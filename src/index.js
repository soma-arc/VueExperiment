import Vue from 'vue';
import Complex from '../lib/GeometryUtils/src/complex.js';
import Circle from './circle.js';
const CircleTable = require('./circleTable.vue');

window.addEventListener('load', () => {
    let circlesList = [new Circle(Complex.ONE, 100),
                       new Circle(Complex.ZERO, 20)]
    let d = {'circles': circlesList};
    new Vue({
        el: '#app',
        data: d,
        render: (h) => {
            return h('circle-table', {'props': d})
        },
        components: { 'circle-table': CircleTable }
    });

    let i = 0;
    function animLoop () {
        //        d['circles'].push(new Circle(Complex.ONE, 100));
        circlesList[0].center.re = i++;
        requestAnimationFrame(animLoop);
    }
    animLoop();
})
