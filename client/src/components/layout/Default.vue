<template>
  <div id="default-layout" class="layout" v-show="ready">
    <header>

          <nav>
            <div class='container'>

              <div class="nav-fixed col s12 m8 l4">
                <router-link to="dash" class="brand-logo hide-on-med-and-down">Matcha</router-link>
                <ul id="nav-mobile" class="right">
                  <li><router-link :to="{name: 'dashBoard'}">DashBoard</router-link></li>
                  <li><router-link :to="{name: 'followed'}">Suivi</router-link></li>
                  <li><router-link :to="{name: 'profil'}">Profil</router-link></li>
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
            <h5 class="white-text">Footer Content</h5>
            <p class="grey-text text-lighten-4">You can use rows and columns here to organize your footer content.</p>
          </div>
          <div class="col l4 offset-l2 s12">
            <h5 class="white-text">Links</h5>
            <ul>
              <li><a class="grey-text text-lighten-3" href="#!">Link 1</a></li>
              <li><a class="grey-text text-lighten-3" href="#!">Link 2</a></li>
              <li><a class="grey-text text-lighten-3" href="#!">Link 3</a></li>
              <li><a class="grey-text text-lighten-3" href="#!">Link 4</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div class="footer-copyright">
        <div class="container">
        © 2014 Copyright Text
        <a class="grey-text text-lighten-4 right" href="#!">More Links</a>
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
        httpOption: {},
        notifs: []
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return this.$router.replace('/')
      this.ready = true
      this.httpOption = auth.httpOption
      this.$options.sockets.user = (users) => {
        let list = []
        Object.keys(users).map((objectKey) => {
          list.push(users[objectKey])
        })
        this.$parent.$emit('userUpdate', list)
      }
      let vm = this
      $(window).focus(function() {
        vm.$socket.emit('online', auth.decoded.id)
      })

      $(window).blur(function() {
        vm.$socket.emit('focus off', auth.decoded.id)
      })
      navigator.geolocation.getCurrentPosition(pos => this.setPosition(pos.coords), err => {
        this.$http.get(`http://ip-api.com/json`).then(res => {
          this.setPosition({latitude: res.data.lat, longitude: res.data.lon})
        }).catch(err => console.log(err))
      })
    },
    methods: {
      logout () {
        this.$cookie.delete('token')
        this.$router.replace('/')
        this.$socket.emit('logout')
      },
      setPosition (coords) {
        if (coords) {
          this.$http.put(`${CONFIG.BASEURL_API}user`, {
            latitude: coords.latitude,
            longitude: coords.longitude
          }, this.httpOption).then(res => {
            if (!res.body.success) return console.log(res.body.err)
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

  nav {
    background-color: transparent;
  }

  nav ul a, nav .brand-logo {
    color: #34888C;
  }

  main.container {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /*@media only screen and (max-width: 992px) {
    nav .brand-logo {
      display: none;
    }
  }*/

</style>
