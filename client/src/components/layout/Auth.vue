<template>
  <div v-show='ready' id="authLayout" class='layout'>
    <header>
      <!-- <img src='../../assets/logo.png'> -->
      <router-link :to='linkBtn' class="waves-effect waves-light btn">{{nameBtn}}</router-link>
    </header>

    <main>
      <slot></slot>
    </main>

  </div>
</template>

<script>

  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'authLayout',
    props: ['linkBtn', 'nameBtn', 'auth'],
    data () {
      return {
        ready: false
      }
    },
    created () {
      this.auth(data => {
        if (data.success) return this.$router.replace('/dash')
        this.ready = true
      })
    },
  }

</script>

<style>

</style>
