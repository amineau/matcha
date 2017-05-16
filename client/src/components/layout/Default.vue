<template>
  <div id="default-layout" class="layout" v-show="ready">
    <header>
          <!-- <div>Salut {{user.login}}</div> -->
          <button @click="logout" class="btn waves-effect waves-light">Deconnexion</button>

          <dropdown :auth="auth" class='right'></dropdown>

      <h1>Header</h1>
    </header>

    <main>
      <slot></slot>
    </main>

    <footer class="page-footer cyan">
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
      navigator.geolocation.watchPosition(pos => this.setPosition(pos.coords), err => {
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
        console.log('socket logout')
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

</style>
