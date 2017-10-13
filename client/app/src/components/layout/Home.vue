<template>
  <div id="home-layout" class="layout">
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

    <main class='home center' :class="{frame}">
      <section >
        <slot></slot>
      </section>
    </main>

    <footer class="page-footer blue-m">
      <div class="container">
        <div class="row">
          <div class="col l6 s12">
            <h5 class="white-text">Commencer</h5>
            <ul>
              <li><router-link :to="{name: 'signup'}" class="grey-text text-lighten-3">S'inscrire</router-link></li>
              <li><router-link :to="{name: 'signin'}" class="grey-text text-lighten-3">Se connecter</router-link></li>
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

  export default {
    name: 'homeLayout',
    props: {
      frame: Boolean
    }
  }

</script>

<style scoped>

  .home {
    background-image: url('http://nsa37.casimages.com/img/2017/05/29/170529055346621428.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
  }

  @media (max-width: 1400px) {
    .home {
        background-size: 1400px;
    }
  }

  section {
    margin-right: auto;
    margin-left: auto;
    min-width: 400px;
    width: 40%;
  }

  main.frame {
    display: flex;
  }

  main.frame section{
    margin-top: 50px;
    margin-bottom: 50px;
    margin: auto;
    padding: 50px;
    background-color: rgba(0,0,0,0.75);
  }

  main {
    /*display: flex;
    align-items: center;*/
  }

</style>
