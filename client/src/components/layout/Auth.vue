<template>
  <div id="authLayout" class='layout'>
    <header>
      <!-- <img src='../../assets/logo.png'> -->
      <router-link :to='linkBtn' class="waves-effect waves-light btn">{{nameBtn}}</router-link>
    </header>

    <main>
      <slot></slot>
    </main>

  </div>
</template>

<script>

  import conf from '../../../../config/conf.json'
  import jwt from 'jsonwebtoken'

  export default {
    name: 'authLayout',
    props: ['linkBtn', 'nameBtn'],
    data () {
      return {

      }
    }
  }

</script>

<style>

</style>
