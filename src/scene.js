import Complex from '../lib/GeometryUtils/src/complex.js';
import SelectionState from './selectionState.js';
import Circle from './circle.js';

// TODO: generate this object automatically
const STR_CLASS_MAP = { 'Circle': Circle };

export default class Scene {
    constructor() {
        this.objects = {};
        this.selectedState = new SelectionState();
    }

    addCircle(c) {
        if (this.objects['Circle'] === undefined) {
            this.objects['Circle'] = [];
        }
        this.objects['Circle'].push(c);
    }

    setCirclesList(c) {
        this.objects['Circle'] = c;
    }

    select (mouse) {
        const objKeyNames = Object.keys(this.objects);
        for (const objName of objKeyNames) {
            for (const obj of this.objects[objName]) {
                const state = obj.select(mouse);
                if (state.isSelectingObj()) {
                    this.selectedState = state;
                    return true;
                }
            }
        }
        this.selectedState = new SelectionState();
        return false;
    }

    move (mouse) {
        if (this.selectedState.isSelectingObj()) {
            this.selectedState.selectedObj.move(this.selectedState, mouse);
            return true;
        }
        return false;
    }

    setUniformLocation(gl, uniLocations, program) {
        const objKeyNames = Object.keys(this.objects);
        for (const objName of objKeyNames) {
            const objArray = this.objects[objName];
            for (let i = 0; i < objArray.length; i++) {
                objArray[i].setUniformLocation(gl, uniLocations, program, i);
            }
        }
    }

    setUniformValues(gl, uniLocation, uniIndex) {
        let uniI = uniIndex;
        const objKeyNames = Object.keys(this.objects);
        for (const objName of objKeyNames) {
            const objArray = this.objects[objName];
            for (let i = 0; i < objArray.length; i++) {
                uniI = objArray[i].setUniformValues(gl, uniLocation, uniI);
            }
        }
        return uniI;
    }

    getContext() {
        const context = {};
        const objKeyNames = Object.keys(this.objects);
        for (const objName of objKeyNames) {
            context[`num${objName}`] = this.objects[objName].length;
        }
        return context;
    }

    getObjFromId(id) {
        const objKeyNames = Object.keys(this.objects);
        for (const objName of objKeyNames) {
            const obj = this.objects[objName].find((elem, idxm, array) => {
                if (elem.id === id) {
                    return true;
                } else {
                    return false;
                }
            });
            if (obj !== undefined) return obj;
        }
        return undefined;
    }
}
