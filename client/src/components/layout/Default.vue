<template>
  <div id="default-layout">
    <header>
      <div v-if="ready" class="row">
        <div v-if="user" class="col s6 m4">
          <div>Salut {{user.login}}</div>
          <a v-on:click="logout" class="btn waves-effect waves-light">Deconnexion</a>
        </div>
        <form v-else class="col s6 m4">
          <div v-if="connectionError" class="error">{{connectionError}}</div>
          <div class="row">
            <div class="input-field col s12 m6">
              <input id="login" v-model.lazy="login" type="text" class="validate">
              <label for="login">Login</label>
            </div>
            <div class="input-field col s12 m6">
              <input id="password" v-model.lazy="password" type="password"class="validate">
              <label for="password">Mot de passe</label>
            </div>
            <button v-on:click.prevent="signin" class="btn waves-effect waves-light" type="submit">Connexion</button>
          </div>
          <a class="btn waves-effect waves-light">Inscription</a>
        </form>
      </div>
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

  import conf from '../../../../config/conf.json'
  import jwt from 'jsonwebtoken'

  const checkToken = (token, callback) => {
    jwt.verify(token, conf.token.secret, (err, decoded) => {
      if (!err) {
        delete decoded.iat
        delete decoded.exp
      }
      callback(decoded)
    })
  }

  export default {
    name: 'layout',
    data () {
      return {
        ready: false,
        user: null,
        login: null,
        password: null,
        connectionError: null
      }
    },
    created () {
      const token = this.$cookie.get('token')

      if (!token) {
        return this.ready = true
      }
      checkToken(token, (u) => {
        this.user = u
        this.ready = true
      })
    },
    methods: {
      signin () {
        this.$http.post(`http://${conf.api.host}:${conf.api.port}/auth/signin`, {
          login: this.login,
          password: this.password
        },{
          responseType: 'json'
        }).then(res => {
          if (res.body.success) {
            checkToken(res.body.token, (u) => this.user = u)
            this.$cookie.set('token', res.body.token)
            this.connectionError = null
            this.login = null
          } else {
            console.log(res.body)
            this.connectionError = res.body.err.error
          }
          this.password = null
        })
      },
      logout () {
        this.$cookie.delete('token')
        this.user = false
      }
    }

  }

</script>

<style>

</style>
