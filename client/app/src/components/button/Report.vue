<template>

  <div>

    <a v-if="!people.reported" @click="reported" class='text-brown-m'>
      <i class="fa fa-ban" aria-hidden="true"></i>
      <span>Signaler cet utilisateur</span>
    </a>
    <p v-else>Vous avez signalé {{people.login}}</p>
  </div>

</template>

<script>

  import config from '../../../config'
  import _ from 'lodash'

  export default {
    name: 'Report',
    props: {
      httpOption: Object,
      people: Object
    },
    methods: {
      reported () {
        this.$http.post(`${config.api}report/${this.people.id}`, {}, this.httpOption)
          .then(res => {
            if (!res.body.success) return;
            this.people.reported = !this.people.reported
          })
      }
    }
  }

</script>

<style>


</style>
