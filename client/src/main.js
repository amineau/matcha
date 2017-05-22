

  import Vue from 'vue'
  import VueCookie from 'vue-cookie'
  import VueResource from 'vue-resource'
  import VueSocketio from 'vue-socket.io'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import App from './app.vue'
  import router from './router'
  import CONFIG from '../config/conf.json'


  Vue.use(VueResource)
  Vue.use(VueCookie)
  Vue.use(VueSocketio, CONFIG.BASEURL_API)
  Vue.use(VueGoogleMaps, {
    load: {
      key: CONFIG.KEY_API_GOOGLE,
      libraries: 'places'
    }
  })

  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
