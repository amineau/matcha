<template>
  <defaultLayout :auth="auth">

    <div class="row">
      <div class="col s12 l9 right switch">
        <div @click="request('liked')" :class="{'text-yellow-m': action==='liked'}" class="col s3 center-align">Likes reçus</div>
        <div @click="request('like')" :class="{'text-yellow-m': action==='like'}" class="col s3 center-align">Likes envoyés</div>
        <div @click="request('visited')" :class="{'text-yellow-m': action==='visited'}" class="col s3 center-align">Visites reçues</div>
        <div @click="request('visite')" :class="{'text-yellow-m': action==='visite'}" class="col s3 center-align">Profils visités</div>
      </div>
    </div>
    <div v-for="f in followed" v-show="f.action === action" class="row">
       <div v-for="people in f.peoples" class="col s6 l4">
         <card :httpOption="httpOption" :people="people"></card>
       </div>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import card from './Card.vue'
  import googleMap from './Map.vue'
  import search from './Search.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Followed',
    data () {
      return {
        followed: [],
        action: null,
        httpOption: null,
        users: {}
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      let vm = this
      if (!auth.success) return;
      this.httpOption = auth.httpOption
      this.request('liked')
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      request (action) {
        this.action = action
        return this.$http.get(`${CONFIG.BASEURL_API}users/${action}`, this.httpOption)
          .then(res => {
            if (!res.body.success) return;
            let peoples = res.body.data
            peoples.forEach(f => {
              if (!f.base64) {
                f.base64 = `src/assets/${f.sex}-silhouette.jpg`
              }
            })
            let found = false
            this.followed.forEach(e => {
              if (e.action === action) {
                e.peoples = peoples
                found = true
              }
            })
            if (!found) {
              this.followed.push({peoples, action})
            }
            Promise.resolve()
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
