import Vue from 'vue'
import VueCookie from 'vue-cookie'
import VueResource from 'vue-resource'
import VueSocketio from 'vue-socket.io'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './app.vue'
import router from './router'
import config from '../config'

Vue.use(VueResource)
Vue.use(VueCookie)
Vue.use(VueSocketio, config.api)
Vue.use(VueGoogleMaps, {
  load: {
    key: config.key_api_google,
    libraries: 'places'
  }
})

console.log(API_URL)

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})