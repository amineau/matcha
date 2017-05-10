<template>

  <div :class='{"chips-autocomplete": autocomplete}' class='chips col s8'></div>

</template>

<script>

  import CONFIG from '../../../config/conf.json'

  export default {
    name: 'TagButton',
    props: {
      auth: Function,
      autocomplete: Boolean
    },
    mounted () {
      const auth = this.auth()
      if (!auth.success) return
      let promises = [this.$http.get(`${CONFIG.BASEURL_API}tags/${auth.decoded.id}`, auth.httpOption)]
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
          res[0].body.data.forEach(i => data.push({tag: i}))
          if (this.autocomplete) {
            res[1].body.data.forEach(i => autocompleteOptions.data[i] = null)
          }
          resolve({data, autocompleteOptions})
        })
      }).then((data) => {
        var thisVm = this
        $(function() {
          $('.chips').material_chip(data)
          if (!thisVm.autocomplete) {
            $('.chip i').remove()
          }
          $('.chips').on('chip.add', function(e, chip){
            thisVm.$http.post(`${CONFIG.BASEURL_API}tags/${chip.tag}`, {}, auth.httpOption).catch(r => console.log(r))
          })
          $('.chips').on('chip.delete', function(e, chip){
            thisVm.$http.delete(`${CONFIG.BASEURL_API}tags/${chip.tag}`, auth.httpOption).catch(r => console.log(r))
          })
        })
      })
    }

  }

</script>

<style>


</style>
