import Vue from 'vue';
import Complex from '../lib/GeometryUtils/src/complex.js';
import Circle from './circle.js';
import Canvas from './canvas.js';
import Scene from './scene.js';

const CircleTable = require('./circleTable.vue');

window.addEventListener('load', () => {
    const scene = new Scene();
    const c = new Circle(Complex.ZERO, 100);
    //    scene.addCircle(c);
    const circlesList = [c];
    scene.setCirclesList(circlesList);
    const d = { 'circles': circlesList };
    new Vue({
        el: '#app',
        data: d,
        render: (h) => {
            return h('circle-table', { 'props': d })
        },
        components: { 'circle-table': CircleTable }
    });

    const canvas = new Canvas('canvas', scene);
    canvas.render();
})
