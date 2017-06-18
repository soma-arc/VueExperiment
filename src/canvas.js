import { GetWebGL2Context, CreateRGBTextures, CreateSquareVbo,
         AttachShader, LinkProgram } from './glUtils';
import Complex from '../lib/GeometryUtils/src/complex.js';
import Circle from './circle.js';
const RENDER_VERTEX = require('./shaders/render.vert')
const RENDER_TMPL = require('./shaders/render.njk.frag')

export default class Canvas {
    constructor(canvasId, scene) {
        this.canvas = document.getElementById(canvasId);
        this.gl = GetWebGL2Context(this.canvas);
        this.scene = scene;

        this.vertexBuffer = CreateSquareVbo(this.gl);
        this.canvasRatio = this.canvas.width / this.canvas.height / 2;
        this.pixelRatio = 1;

        // render to canvas
        this.compileRenderShader();

        this.scaleFactor = 1.5;
        this.translate = Complex.ZERO;
        this.scale = 500;

        // mouse
        this.mouseState = {
            isPressing: false,
            prevPosition: Complex.ZERO,
            prevTranslate: Complex.ZERO
        };
        this.boundOnMouseDown = this.onMouseDown.bind(this);
        this.boundOnMouseUp = this.onMouseUp.bind(this);
        this.boundOnMouseWheel = this.onMouseWheel.bind(this);
        this.boundOnMouseMove = this.onMouseMove.bind(this);
        this.boundDblClickLisntener = this.onMouseDblClick.bind(this);
        this.canvas.addEventListener('mousedown', this.boundOnMouseDown);
        this.canvas.addEventListener('mouseup', this.boundOnMouseUp);
        this.canvas.addEventListener('mousewheel', this.boundOnMouseWheel);
        this.canvas.addEventListener('mousemove', this.boundOnMouseMove);
        this.canvas.addEventListener('dblclick', this.boundDblClickLisntener);
        this.canvas.addEventListener('contextmenu', event => event.preventDefault());
    }

    compileRenderShader() {
        this.renderProgram = this.gl.createProgram();
        AttachShader(this.gl, RENDER_VERTEX,
                     this.renderProgram, this.gl.VERTEX_SHADER);
        AttachShader(this.gl, RENDER_TMPL.render(this.scene.getContext()),
                     this.renderProgram, this.gl.FRAGMENT_SHADER);
        LinkProgram(this.gl, this.renderProgram);

        this.renderCanvasVAttrib = this.gl.getAttribLocation(this.renderProgram,
                                                             'a_vertex');
        this.gl.enableVertexAttribArray(this.renderCanvasVAttrib);

        this.uniLocations = [];
        this.uniLocations.push(this.gl.getUniformLocation(this.renderProgram,
                                                          'u_resolution'));
        this.uniLocations.push(this.gl.getUniformLocation(this.renderProgram,
                                                          'u_geometry'));
        this.scene.setUniformLocation(this.gl, this.uniLocations, this.renderProgram);
    }

    /**
     * Calculate screen coordinates from mouse position
     * scale * [-width/2, width/2]x[-height/2, height/2]
     * @param {number} mx
     * @param {number} my
     * @returns {Complex}
     */
    calcCanvasCoord(mx, my) {
        const rect = this.canvas.getBoundingClientRect();
        return new Complex(this.scale * (((mx - rect.left) * this.pixelRatio) /
                                         this.canvas.height - this.canvasRatio),
                           this.scale * -(((my - rect.top) * this.pixelRatio) /
                                          this.canvas.height - 0.5));
    }

    /**
     * Calculate coordinates on scene (consider translation) from mouse position
     * @param {number} mx
     * @param {number} my
     * @returns {Complex}
     */
    calcSceneCoord(mx, my) {
        return this.calcCanvasCoord(mx, my).add(this.translate);
    }

    onMouseWheel(event) {
        event.preventDefault();
        if (event.wheelDelta > 0) {
            this.scale /= this.scaleFactor;
        } else {
            this.scale *= this.scaleFactor;
        }
        this.render();
    }

    onMouseDown(event) {
        event.preventDefault();
        const mouse = this.calcSceneCoord(event.clientX, event.clientY);
        if (event.button === Canvas.MOUSE_BUTTON_LEFT) {
            const selected = this.scene.select(mouse);
        } else if (event.button === Canvas.MOUSE_BUTTON_WHEEL) {
            // TODO: add circle
            this.scene.addCircle(new Circle(mouse, 50));
            this.compileRenderShader();
            this.render();
        }
        this.mouseState.prevPosition = mouse;
        this.mouseState.prevTranslate = this.translate;
        this.mouseState.isPressing = true;
    }

    onMouseDblClick(event) {
        if (event.button === this.MOUSE_BUTTON_LEFT) {
            // TODO: remove object
        }
    }

    onMouseUp(event) {
        this.mouseState.isPressing = false;
    }

    onMouseMove(event) {
        // envent.button return 0 when the mouse is not pressed.
        // Thus we check if the mouse is pressed.
        if (!this.mouseState.isPressing) return;
        const mouse = this.calcSceneCoord(event.clientX, event.clientY);
        if (event.button === Canvas.MOUSE_BUTTON_LEFT) {
            const moved = this.scene.move(mouse);
            if (moved) this.render();
        } else if (event.button === Canvas.MOUSE_BUTTON_RIGHT) {
            this.translate = this.translate.sub(mouse.sub(this.mouseState.prevPosition));
            this.render();
        }
    }

    render() {
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.useProgram(this.renderProgram);
        let uniI = 0;
        this.gl.uniform2f(this.uniLocations[uniI++], this.canvas.width, this.canvas.height);
        this.gl.uniform3f(this.uniLocations[uniI++], this.translate.re, this.translate.im, this.scale);
        uniI = this.scene.setUniformValues(this.gl, this.uniLocations, uniI)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.vertexAttribPointer(this.renderCanvasVAttrib, 2,
                                    this.gl.FLOAT, false, 0, 0);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.flush();
    }

    static get MOUSE_BUTTON_LEFT() {
        return 0;
    }

    static get MOUSE_BUTTON_WHEEL() {
        return 1;
    }

    static get MOUSE_BUTTON_RIGHT() {
        return 2;
    }
}
