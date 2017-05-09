<template>

  <router-link :to="{name: 'user', params: {id: people.id}}" class="waves-effect waves-light btn-floating">
    <i class="fa fa-user-o" aria-hidden="true"></i>
  </router-link>

</template>

<script>

  import User from '../User.vue'

  export default {
    name: 'ProfilButton',
    props: {
      people: Object
    },
    components: {
      User
    }
  }

</script>

<style>


</style>
