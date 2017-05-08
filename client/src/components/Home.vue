<template>
  <homeLayout v-show='ready'>

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
        ready: false
      }
    },
    props: ['auth'],
    created () {
      if (this.auth().success) return this.$router.replace('/dash')
      this.ready = true
    },
    components: {
      homeLayout
    }
  }

</script>

<style>

</style>
