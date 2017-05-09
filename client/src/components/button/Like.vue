<template>

  <button @click="liked" :class="{red: people.like}" :disabled="!people.likable" class="waves-effect waves-light btn-floating">
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
            if (!res.body.success) return res.body.err
            this.people.like = !this.people.like
            this.people.connected = res.body.connected
            this.$emit('update:people.connected')
          })
      }
    }
  }

</script>

<style>

  .like {
    color: red
  }

</style>
