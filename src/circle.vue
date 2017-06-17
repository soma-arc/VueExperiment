<template>
    <tr>
        <td>{{ circle.center.re }}</td>
        <td>{{ circle.center.im }}</td>
        <td>{{ circle.radius }}</td>
    </tr>
</template>

<script>
 export default {
     props: ['circle'],
 }
</script>
