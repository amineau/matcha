<template>
  <div v-show='ready' id="authLayout" class='layout'>

    <header>

      <nav>
        <div class='container'>

          <div class="nav-fixed col s12 m8 l4">
            <router-link :to="{name: 'home'}" class="brand-logo hide-on-med-and-down">Matcha</router-link>
            <ul id="nav-mobile" class="right">
              <li><router-link :to="{name: 'signup'}">Inscription</router-link></li>
              <li><router-link :to="{name: 'signin'}">Connexion</router-link></li>
            </ul>
          </div>
        </div>
      </nav>

    </header>

    <main class="container">
      <section>
        <slot></slot>
      </section>
    </main>

  </div>
</template>

<script>

  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'authLayout',
    props: ['auth'],
    data () {
      return {
        ready: false
      }
    },
    created () {
      if (this.auth().success) return this.$router.replace({name: 'dash'})
      this.ready = true
    },
  }

</script>

<style scoped>

  section {
    margin-right: auto;
    margin-left: auto;
    max-width: 600px;
    padding: 50px;
    background-color: rgba(0,0,0,0.1);
  }

  main {
    display: flex;
    align-items: center;
  }

</style>
