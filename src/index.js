import Vue from 'vue';
const CircleTable = require('./circleTable.vue');

window.addEventListener('load', () => {
    new Vue({
        el: '#app',
        render: h => h(CircleTable)
    });
})
