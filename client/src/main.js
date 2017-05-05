

  import Vue from 'vue'
  import VueCookie from 'vue-cookie'
  import VueResource from 'vue-resource'
  import App from './app.vue'
  import router from './router'

  Vue.use(VueResource)
  Vue.use(VueCookie)

  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
