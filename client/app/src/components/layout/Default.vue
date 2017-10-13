<template>
  <div id="default-layout" class="layout" v-show="ready">
    <header>

          <nav>
            <div class='container'>

              <div class="nav-fixed col s12 m8 l4">
                <router-link :to="{name: 'dashBoard'}" class="brand-logo hide-on-med-and-down">Matcha</router-link>
                <ul id="nav-mobile" class="right">
                  <li><router-link :to="{name: 'dashBoard'}">DashBoard</router-link></li>
                  <li><router-link :to="{name: 'followed'}">Suivi</router-link></li>
                  <li><router-link :to="{name: 'profil'}">Profil</router-link></li>
                  <li><router-link :to="{name: 'message'}"><i class="fa fa-comments-o" aria-hidden="true"></i></router-link></li>
                  <li><dropdown :auth="auth"></dropdown></li>
                  <li><a @click="logout">Deconnexion</a></li>
                </ul>
              </div>
            </div>
          </nav>

    </header>

    <main class="container">
      <section class="col s12 m9 l6">
        <slot></slot>
      </section>
    </main>

    <footer class="page-footer blue-m">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">Naviguer</h5>
            <ul>
              <li><router-link :to="{name: 'dashBoard'}" class="grey-text text-lighten-3">DashBoard</router-link></li>
              <li><router-link :to="{name: 'followed'}" class="grey-text text-lighten-3">Suivi</router-link></li>
              <li><router-link :to="{name: 'profil'}" class="grey-text text-lighten-3">Profil</router-link></li>
              <li><router-link :to="{name: 'message'}" class="grey-text text-lighten-3">Discussion</router-link></li>
            </ul>
          </div>
          <div class="col l4 offset-l2 s12">
            <h5 class="white-text">Menu</h5>
            <ul>
              <li><a class="grey-text text-lighten-3">Condition Générales d'Utilisation</a></li>
              <li><a class="grey-text text-lighten-3">Foire aux Questions</a></li>
              <li><a class="grey-text text-lighten-3">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="container">
        © 2017 Copyright Text
        </div>
      </div>
    </footer>

  </div>
</template>

<script>

  import dropdown from '../Dropdown.vue'
  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'layout',
    data () {
      return {
        ready: false,
        notifs: [],
        id: null,
        httpOption: {}
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return this.$router.replace({name: 'home'})
      this.id = auth.decoded.id
      this.httpOption = auth.httpOption
      this.ready = true
      navigator.geolocation.getCurrentPosition(pos => this.setPosition(pos.coords), err => {
        this.$http.get(`http://ip-api.com/json`).then(res => {
          this.setPosition({latitude: res.data.lat, longitude: res.data.lon})
        })
      })
      let vm = this
      $(window).focus(function() {
        vm.online()
      })

      $(window).blur(function() {
        vm.focusOff()
      })

    },
    methods: {
      online () {
        this.$socket.emit('online', this.id)
      },
      focusOff () {
        this.$socket.emit('focus off', this.id)
      },
      logout () {
        this.$cookie.delete('token')
        this.$router.replace('/')
        this.$socket.emit('logout')
      },
      setPosition (coords) {
        if (coords) {
          this.$http.put(`${CONFIG.BASEURL_API}user/loc`, {
            latitude: coords.latitude,
            longitude: coords.longitude
          }, this.httpOption).then(res => {
            if (!res.body.success) return;
          })
        }
      }
    },
    components: {
      dropdown
    }
  }

</script>

<style>


</style>
