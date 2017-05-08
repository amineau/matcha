<template>
  <defaultLayout :auth="auth">



  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'User',
    data () {
      return {
      }
    },
    created () {

        console.log(this.$route.params.id)
    },
    props: ['auth'],
    components: {
      defaultLayout
    }
  }

</script>

<style>


</style>
