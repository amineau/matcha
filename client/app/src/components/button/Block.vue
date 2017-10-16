<template>

  <a v-if="people.blocked" @click="blocked" class="text-blue-m">
    <i class="fa fa-unlock-alt" aria-hidden="true"></i>
    <span class="block">Débloquer</span>
  </a>
  <a v-else @click="blocked" class="text-brown-m">
    <i class="fa fa-lock" aria-hidden="true"></i>
    <span class="block">Bloquer</span>
  </a>

</template>

<script>

  import config from '../../../config'
  import _ from 'lodash'

  export default {
    name: 'Block',
    props: {
      httpOption: Object,
      people: Object
    },
    methods: {
      blocked () {
        this.$http.post(`${config.api}${this.people.blocked?'un':''}block/${this.people.id}`, {}, this.httpOption)
          .then(res => {
            if (!res.body.success) return;
            this.people.blocked = !this.people.blocked
          })
      }
    }
  }

</script>

<style>

  .block {
    text-decoration: underline;
  }

</style>
