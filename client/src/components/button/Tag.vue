<template>

  <div :class='{"chips-autocomplete": autocomplete}' class='chips'></div>

</template>

<script>

  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'TagButton',
    props: {
      auth: Function,
      init: Boolean,
      autocomplete: Boolean
    },
    mounted () {
      console.log('coucou')
      const auth = this.auth()
      if (!auth.success) return console.log(auth.error)
      const id = auth.decoded.id
      let promises = []
      if (this.init) {
        promises.push(this.$http.get(`${CONFIG.BASEURL_API}tags/${id}`, auth.httpOption))
      }
      if (this.autocomplete) {
        promises.push(this.$http.get(`${CONFIG.BASEURL_API}tags`, auth.httpOption))
      }
      Promise.all(promises).then((res) => {
        return new Promise((resolve) => {

          let success = true
          res.forEach(e => success = !e.body.success ? e.body.success : success)
          if (!success) return
          let autocompleteOptions = {data: {}}
          let data = []
          if (this.init) {
            res[0].body.data.forEach(i => data.push({tag: i.name}))
            if (this.autocomplete) {
              res[1].body.data.forEach(i => autocompleteOptions.data[i] = null)
            }
          } else {
            res[0].body.data.forEach(i => autocompleteOptions.data[i] = null)
          }
          resolve({data, autocompleteOptions})
        })
      }).then((data) => {
        var vm = this
        $(function() {
          $('.chips').material_chip(data)
          if (!vm.autocomplete) {
            $('.chip i').remove()
          }
          if (vm.autocomplete && vm.init) {
            $('.chips').on('chip.add', function(e, chip){
              vm.$http.post(`${CONFIG.BASEURL_API}tags/${chip.tag}`, {}, auth.httpOption).catch(r => console.log(r))
            })
            $('.chips').on('chip.delete', function(e, chip){
              vm.$http.delete(`${CONFIG.BASEURL_API}tags/${chip.tag}`, auth.httpOption).catch(r => console.log(r))
            })
          }
        })
      })
    }

  }

</script>

<style>


</style>
