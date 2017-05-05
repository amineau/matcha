<template>
  <homeLayout>

    <p>Bienvenue sur DoubleMatching</p>
    <router-link to="/dash" class="waves-effect waves-light btn">DashBoard</router-link>

  </homeLayout>
</template>

<script>

  import homeLayout from './layout/Home.vue'

  export default {
    name: 'home',
    data () {
      return {
        msg: ''
      }
    },
    components: {
      homeLayout
    }
  }

</script>

<style>

</style>
