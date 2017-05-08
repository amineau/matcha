<template>

  <router-view :key="$route.path" :auth="checkToken"></router-view>

</template>

<script>

  import CONFIG from '../config/conf.json'
  import jwt from 'jsonwebtoken'
  import 'materialize-css'

  export default {
    name: 'app',
    methods: {
      checkToken () {
        try {
          const token = this.$cookie.get('token')
          let decoded = jwt.verify(token, CONFIG.SECRET_TOKEN)
          delete decoded.iat
          delete decoded.exp
          return {success: true, decoded,
            httpOption: {
              responseType: 'json',
              headers: {
                "matcha-token": token
              }
            }
          }
        } catch (err) {
          return {success: false, err}
        }
      }
    }
  }

</script>

<style>
</style>
