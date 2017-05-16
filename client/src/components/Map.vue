<template>

  <gmap-map
    :center="center"
    :zoom="10"
    style="width: 80%; height: 800px"
  >
    <gmap-marker
      v-for="m in markers"
      :key="m.position"
      :position="m.position"
      :clickable="true"
      :icon.sync='m.icon'
      @click="m.path"
    ></gmap-marker>
    <gmap-marker
      :position="myPosition.position"
      :icon.sync='myPosition.icon'
    ></gmap-marker>
  </gmap-map>

</template>

<script>

  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Map',
    props: {
      auth: Function,
      markers: Array
    },
    data () {
      return {
        center: {
          lat: 48.0,
          lng: 2.0
        },
        myPosition: {}
      }
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.err)
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${auth.decoded.id}`, auth.httpOption)
        .then(res => {
          if (!res.body.success) return console.log(res.body.err)
          console.log(res.body.data[0])
          this.center = {
            lat: res.body.data[0].latitude,
            lng: res.body.data[0].longitude
          }
          this.myPosition = {
            position: this.center,
            icon: {
              url: 'https://cdn0.iconfinder.com/data/icons/superuser-web-kit/512/686909-user_people_man_human_head_person-512.png',
              scaledSize: {
                width: 20,
                height: 20
              }
            }
          }
        })
    },
    watch: {
      '$route'(to, from) {
        this.$gmapDefaultResizeBus.$emit('resize')
      }
    }
  }

</script>

<style>

</style>
