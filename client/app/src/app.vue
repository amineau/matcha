<template>

  <router-view :key="$route.path" :auth="checkToken"></router-view>

</template>

<script>

  import config from '../config'
  import jwt from 'jsonwebtoken'
  import 'materialize-css'

  export default {
    name: 'app',
    methods: {
      checkToken () {
        try {
          const token = this.$cookie.get('token')
          let decoded = jwt.verify(token, config.secret_token)
          delete decoded.iat
          delete decoded.exp
          return {success: true, decoded,
            httpOption: {
              responseType: 'json',
              headers: {
                "x-forwarded-for": this.ip,
                "matcha-token": token
              }
            }
          }
        } catch (err) {
          return {success: false, err}
        }
      }
    },
    computed: {
      ip() {
        this.$http.get('http://freegeoip.net/json/').then(res => {
          if (res.status !== 200) return null
          return res.data.ip
        })
      }
    }
  }

</script>

<style>
</style>
