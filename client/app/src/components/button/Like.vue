<template>

  <button @click="liked" :class="{'yellow-m': people.like}" :disabled="disabled" class="waves-effect waves-light btn-floating">
    <i class="fa fa-heart-o" aria-hidden="true"></i>
  </button>

</template>

<script>

  import CONFIG from '../../../config/conf.json'
  import _ from 'lodash'

  export default {
    name: 'LikeButton',
    props: {
      httpOption: Object,
      people: Object
    },
    methods: {
      liked () {
        this.$http.post(`${CONFIG.BASEURL_API}${this.people.like?'un':''}like/${this.people.id}`, {}, this.httpOption)
          .then(res => {
            if (!res.body.success) return;
            this.people.like = !this.people.like
            this.people.connected = res.body.connected
            this.$emit('update:people.connected')
          })
      }
    },
    computed: {
      disabled () {
        return (!this.people.likable || this.people.blocked) ? true : false
      }
    }
  }

</script>

<style>

  .yellow-m:focus, .yellow-m:hover {
    background-color: #F5E356;
  }

</style>
