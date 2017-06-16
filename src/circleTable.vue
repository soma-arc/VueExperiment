<template>
    <div>
        <circle-table v-for="circle in circles"
                      v-bind:key="circle"
                      v-bind:circle="circle">
        </circle-table>
    </div>
</template>

<script>
 import Complex from '../lib/GeometryUtils/src/complex.js';
 import Circle from './circle.js';

 export default {
     data: function(){
         return {
             circles: [new Circle(Complex.ONE, 100),
                       new Circle(Complex.ZERO, 20)]
         }
     },
     components: {
         'circle-table': require('./circle.vue')
     }
 }
</script>
