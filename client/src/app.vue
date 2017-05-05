<template>

  <layout>
    <router-view></router-view>
  </layout>

</template>

<script>

  import layout from './components/layout/Default.vue'

  export default {
    name: 'app',
    components: {
      layout
    }
  }

</script>

<style>
</style>
