<template>
  <homeLayout v-show='ready'>
    <div>

      <h1>Bienvenue sur Matcha</h1>
      <router-link :to="{name: 'signin'}" class="waves-effect waves-light btn">Se connecter</router-link>

    </div>
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
      if (this.auth().success) return this.$router.replace({name: 'dashBoard'})
      this.ready = true
    },
    components: {
      homeLayout
    }
  }

</script>

<style>


</style>
