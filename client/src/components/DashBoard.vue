<template>
  <defaultLayout :auth="auth">

    <search :peoples="peoples" :auth="auth" :update="updatePeople"></search>
    <div class="row">
      <div class="col s4 right switch">
        <i @click="list=true" :class="{'text-yellow-m': list}" class="fa fa-list-ul fa-2x col s6 center-align" aria-hidden="true"></i>
        <i @click="list=false" :class="{'text-yellow-m': !list}" class="fa fa-map-o fa-2x col s6 center-align" aria-hidden="true"></i>
      </div>
    </div>
    <div v-show="list">
      <div class="input-field col s12">
        <select>
          <option value="score" selected>Popularité</option>
          <option value="age">Âge</option>
          <option value="localisation">Distance</option>
          <option value="tag">Tags en commun</option>
        </select>
      </div>
      <div class="row">
       <div v-for="people in peoples" class="col s6 m4 l3">
         <card :httpOption="httpOption" :people="people"></card>
       </div>
     </div>
   </div>
   <googleMap v-if="!list" :markers="markers" :auth="auth"></googleMap>

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
        list: true,
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
      $(function() {
        Materialize.updateTextFields()
      })
      const auth = this.auth()
      if (!auth.success) return console.log(auth.error)
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}users?distance=100`, auth.httpOption)
        .then(this.updatePeople)
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      updatePeople (res) {
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
          resolve()
        })
      }
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
