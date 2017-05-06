<template>

  <router-view :key="$route.path" :auth="checkToken"></router-view>

</template>

<script>

  import CONFIG from '../config/conf.json'
  import jwt from 'jsonwebtoken'

  export default {
    name: 'app',
    data () {
      return {
        token: null
      }
    },
    props: ['auth'],
    created () {
      this.token = this.$cookie.get('token')
    },
    beforeUpdate () {
      this.token = this.$cookie.get('token')
    },
    methods: {
      checkToken (callback) {
        jwt.verify(this.token, CONFIG.SECRET_TOKEN, (err, decoded) => {
          if (err) return callback({success: false, err})
          delete decoded.iat
          delete decoded.exp
          return callback({success:true, decoded, token: this.token})
        })
      }
    }
  }

</script>

<style>
</style>
