import Complex from '../lib/GeometryUtils/src/complex.js';
import SelectionState from './selectionState.js';

export default class Circle {
    /**
     * Construct Circle
     * @param {Complex} center
     * @param {number} radius
     */
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
        this.display = true;
        this.circumferenceThickness = 10;
        this.update();
    }

    update() {
        this.rSq = this.radius * this.radius;
    }

    select(mouse) {
        const dp = mouse.sub(this.center);
        const d = dp.abs();
        if (d > this.radius) return new SelectionState();

        const distFromCircumference = this.radius - d;
        if (distFromCircumference < this.circumferenceThickness) {
            return new SelectionState().setObj(this)
                .setComponentId(Circle.CIRCUMFERENCE)
                .setDistToComponent(distFromCircumference);
        }

        return new SelectionState().setObj(this)
            .setComponentId(Circle.BODY)
            .setDiffObj(dp);
    }

    move(mouseState, mouse) {
        if (mouseState.componentId === Circle.CIRCUMFERENCE) {
            this.radius = Complex.distance(this.center, mouse) + mouseState.distToComponent;
        } else {
            this.center = mouse.sub(mouseState.diffObj);
        }

        this.update();
    }

    getUniformArray() {
        return [this.center.re, this.center.im, this.radius, this.rSq];
    }

    setUniformValues(gl, uniLocation, uniIndex) {
        let uniI = uniIndex;
        gl.uniform4f(uniLocation[uniI++],
                     this.center.re, this.center.im, this.radius, this.rSq);
        return uniI;
    }

    setUniformLocation(gl, uniLocation, program, index) {
        uniLocation.push(gl.getUniformLocation(program, `u_circle${index}`));
    }

    static get BODY() {
        return 0;
    }

    static get CIRCUMFERENCE() {
        return 1;
    }
}
