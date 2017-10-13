<template>

  <router-link :to="{name: 'chat', params: {id: people.id}}" :disabled="disabled" class="waves-effect waves-light btn-floating">
    <i class="fa fa-comment-o" aria-hidden="true"></i>
  </router-link>

</template>

<script>

  import Chat from '../Chat.vue'

  export default {
    name: 'ChatButton',
    props: {
      people: Object
    },
    components: {
      Chat
    },
    computed: {
      disabled () {
        return (!this.people.connected || this.people.blocked) ? true : false
      }
    }
  }

</script>

<style>


</style>
