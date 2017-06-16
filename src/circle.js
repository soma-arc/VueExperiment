import Complex from '../lib/GeometryUtils/src/complex.js';

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
    }
}
