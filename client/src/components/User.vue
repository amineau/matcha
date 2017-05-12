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
      const auth = this.auth()
      console.log(auth)
      if (!auth.success) return console.log(auth.err)
      if (auth.decoded.id !== this.$route.params.id) {
        this.$http.post(`${CONFIG.BASEURL_API}visit/${this.$route.params.id}`, {}, auth.httpOption).then(res => {
          if (!res.body.success) return console.log(res.body.err)
        })
      }
        console.log(this.$route.params.id)
    },
    props: {
      auth: Function
    },
    components: {
      defaultLayout
    }
  }

</script>

<style>


</style>
