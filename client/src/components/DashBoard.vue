<template>
  <defaultLayout :auth="auth">

    <search :auth="auth" :update="updatePeople" :selected="selected" :meaning="meaning"></search>
    <div class="row">
      <div class="col s4 right switch">
        <i @click="list=true" :class="{'text-yellow-m': list}" class="fa fa-list-ul fa-2x col s6 center-align" aria-hidden="true"></i>
        <i @click="list=false" :class="{'text-yellow-m': !list}" class="fa fa-map-o fa-2x col s6 center-align" aria-hidden="true"></i>
      </div>
    </div>
    <div v-show="list">
      <div class='row'>
        <div class="input-field col s5 m4 l3">
          <select v-model="selected">
            <option v-for="option in options" v-bind:value="option.value">
              {{ option.text }}
            </option>
          </select>
        </div>
        <div class="chevron col s1">
          <i @click="meaning=-1" :class="{'grey-text': meaning===1}" class="fa fa-chevron-up" aria-hidden="true"></i>
          <i @click="meaning=1" :class="{'grey-text': meaning===-1}" class="fa fa-chevron-down" aria-hidden="true"></i>
        </div>
      </div>
      <div class="row">
       <div v-for="people in peoples" class="col s6 l4">
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
        selected: 'score',
        meaning: -1,
        options: [
          {text: 'Popularité', value: 'score'},
          {text: 'Âge', value: 'birthday'},
          {text: 'Distance', value: 'distance'},
          {text: 'Tags en commun', value: 'tags'},
        ],
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
      let vm = this
      $(function() {
        $('select').material_select()
        $('select').change((e) => {
             vm.selected = e.currentTarget.value;
        })
      })
      const auth = this.auth()
      if (!auth.success) return console.log(auth.error)
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}users?distance=100&sort=${this.selected}&meaning=${this.meaning}`, auth.httpOption)
        .then(this.updatePeople)
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      updatePeople (res) {
        return new Promise((resolve) => {
          if (!res.body.success) return console.log(res.body.err)
          console.log(res.body.data)
          this.peoples = res.body.data
          this.markers = []
          this.peoples.forEach(e => {
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

  .chevron {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

</style>
