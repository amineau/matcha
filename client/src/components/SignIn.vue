<template>
  <authLayout linkBtn="/signup" nameBtn='Inscription'>

    Connexion

  </authLayout>
</template>

<script>

  import authLayout from './layout/Auth.vue'
  export default {
    name: 'signin',
    data () {
      return {

      }
    },
    components: {
      authLayout
    }
  }

</script>

<style>

</style>
