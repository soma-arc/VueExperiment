<template>
    <table>
        <tr>
            <th>x</th>
            <th>y</th>
            <th>r</th>
        </tr>
        <circle-table-element v-for="circle in circles"
                      v-bind:key="circle"
                      v-bind:circle="circle">
        </circle-table-element>
    </table>
</template>

<script>
 export default {
     props: ['circles'],
     components: {
         'circle-table-element': require('./circle.vue')
     },
 }
</script>
