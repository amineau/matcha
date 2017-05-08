<template>

  <router-link :to="{name: 'chat', params: {id: people.id}}" :disabled="!people.connected" class="waves-effect waves-light btn-floating">
    <i class="fa fa-comment-o" aria-hidden="true"></i>
  </router-link>

</template>

<script>

  import CONFIG from '../../config/conf.json'
  import Chat from './Chat.vue'

  export default {
    name: 'ChatButton',
    props: {
      people: Object
    },
    components: {
      Chat
    }
  }

</script>

<style>


</style>
