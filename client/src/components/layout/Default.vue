<template>
  <div id="default-layout" class="layout" v-show="ready">
    <header>
          <!-- <div>Salut {{user.login}}</div> -->
          <a v-on:click="logout" class="btn waves-effect waves-light">Deconnexion</a>
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

  export default {
    name: 'layout',
    data () {
      return {
        ready: false
      }
    },
    props: ['auth'],
    created () {
      this.auth(data => {
        if (!data.success) return this.$router.replace('/')
        this.ready = true
      })
    },
    methods: {
      logout () {
        this.$cookie.delete('token')
        this.$router.replace('/')
      }
    }
  }

</script>

<style>

</style>
