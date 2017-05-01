

  import Vue from 'vue'
  import App from './app.vue'
  import Jquery from 'jquery'

  new Vue({
    el: 'section',
    components: {App},
    data: {
      loading: false,
      message: "plop"
    },
    mounted: function() {
      console.log('heho')
      this.loading = true
      this.$http.post(`http://127.0.0.1:4242/auth/signin`, {
        login: 'Toto',
        password: 'Youhou55'
      }, function(data, status, request) {
        if (request.status == 200) {
          console.log(status.response)
          console.log(data)
        } else {
          console.log(status)
        }
        this.loading = false
      })
    }
  })
