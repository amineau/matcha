<template>

  <i :class="{'orange-text': status === 2, 'green-text': status === 1, 'grey-text': !status}"
    class="fa fa-circle"
    aria-hidden="true"
  ></i>

</template>

<script>

  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'Online',
    props: {
      id: Number,
      httpOption: Object
    },
    data () {
      return {
        status: 0
      }
    },
    created () {
      this.$http.get(`${CONFIG.BASEURL_API}online/${this.id}`, this.httpOption)
        .then(res => {
          this.status = res.body.data.status
        })
      this.$options.sockets.user = (users) => {
        let list = []
        for (let elem in users) {
          if (users[elem].id === this.id) {
            return this.status = users[elem].status
          }
        }
        return this.status = 0
      }
    }
  }

</script>

<style>

  i.fa-circle {
    font-size: .6em
  }

</style>
