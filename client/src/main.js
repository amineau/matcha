

  import Vue from 'vue'
  import VueCookie from 'vue-cookie'
  import VueResource from 'vue-resource'
  import App from './app.vue'
  import router from './router'
  import VueSocketio from 'vue-socket.io'
  import CONFIG from '../config/conf.json'

  Vue.use(VueResource)
  Vue.use(VueCookie)
  Vue.use(VueSocketio, CONFIG.BASEURL_API)

  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
