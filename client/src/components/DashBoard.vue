<template>
  <defaultLayout :auth="auth">

    <p>Personnes à proximitées</p>
    <search :peoples="peoples" :auth="auth" :update="updatePeople"></search>
    <div class="row">
      <div class="col s4 right">
        <ul class="tabs">
          <li class="tab col s6"><a  href="#list">List</a></li>
          <li class="tab col s6"><a class="active" href="#map">Map</a></li>
        </ul>
      </div>
    </div>
    <div class="row" id="list">
       <div v-for="people in peoples" class="col s6 m4 l3">
         <card :httpOption="httpOption" :people="people"></card>
       </div>
     </div>
     <googleMap id="map" :markers="markers" :auth="auth"></googleMap>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import card from './Card.vue'
  import googleMap from './Map.vue'
  import search from './Search.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'DashBoard',
    data () {
      return {
        peoples: [],
        markers: [],
        httpOption: null,
        users: {}
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.error)
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}users?distance=250`, auth.httpOption)
        .then(this.updatePeople)
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      updatePeople (res) {
        console.log(res)
        return new Promise((resolve) => {
          if (!res.body.success) return res.body.err
          this.peoples = res.body.data
          this.markers = []
          this.peoples.forEach(e => {
            this.$set(e, 'status', false)
            if (!e.base64) {
              e.base64 = `src/assets/${e.sex}-silhouette.jpg`
            }
            this.markers.push({
              position: {
                lat: e.latitude,
                lng: e.longitude
              },
              icon: {
                url: e.base64,
                scaledSize: {
                  width: 32,
                  height: 32
                }
              },
              path: () => this.$router.push({name: 'user', params: { id: e.id }})
            })
          })
          this.$on('userUpdate', (users) => {
            this.peoples.forEach((e, k) => {
              const user = users.find(user => user.id === e.id)
              e.status = user ? user.status : 0
            })
          })
          console.log(this.markers)
          resolve()
        })
      }
    },
    watch: {
      users () {
        console.log('watch users')
        let list = []
        Object.keys(this.users.list).map((objectKey) => {
          list.push(this.users.list[objectKey])
        })
        this.peoples.forEach(e => {
          e.status = list.indexOf(e.id) !== -1
        })
      },
    },
    components: {
      search,
      defaultLayout,
      card,
      googleMap
    }
  }

</script>

<style>


</style>
