<template>

  <i :class="{'orange-text': status === 2, 'green-text': status === 1, 'grey-text': !status}"
    class="fa fa-circle"
    aria-hidden="true"
  ></i>

</template>

<script>

  export default {
    name: 'Online',
    props: {
      id: Number
    },
    data () {
      return {
        status: 0
      }
    },
    created () {
      this.$root.$on('userUpdate', (users) => {
        const list = users.find(e => e.id === this.id)
        this.status = list ? list.status : 0
      })
    }
  }

</script>

<style>

  i.fa-circle {
    font-size: .6em
  }

</style>
