import Vue from 'vue';
const MyComponent = require('./app.vue');

window.addEventListener('load', () => {
    new Vue({
        el: '#app',
        render: h => h(MyComponent)
    });
})
