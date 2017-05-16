<template>
  <defaultLayout :auth="auth">

    <div class="row">
      <div class="col s12 m9 l6 center switch">
        <div @click="list='l_rec'" :class="{'text-yellow-m': list==='l_rec'}" class="col s3 center-align">Likes reçus</div>
        <div @click="list='l_sen'" :class="{'text-yellow-m': list==='l_sen'}" class="col s3 center-align">Likes envoyés</div>
        <div @click="list='v_rec'" :class="{'text-yellow-m': list==='v_rec'}" class="col s3 center-align">Visites reçues</div>
        <div @click="list='v_sen'" :class="{'text-yellow-m': list==='v_sen'}" class="col s3 center-align">Profils visités</div>
      </div>
    </div>
    {{list}}
    {{followed.l_rec}}
    <div v-for="(peoples, id) in followed" v-show="id === list" class="row">
       <div v-for="people in peoples" class="col s6 m4 l3">
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
        followed: {},
        list: 'l_rec',
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
      Promise.all([
        this.$http.get(`${CONFIG.BASEURL_API}users/liked`, auth.httpOption),
        this.$http.get(`${CONFIG.BASEURL_API}users/like`, auth.httpOption),
        this.$http.get(`${CONFIG.BASEURL_API}users/visited`, auth.httpOption),
        this.$http.get(`${CONFIG.BASEURL_API}users/visite`, auth.httpOption)
      ])
        .then(this.updatePeople)
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      updatePeople (res) {
        return new Promise((resolve, reject) => {
          console.log(res)
          if (!res.every(e => e.body.success)) {
            console.log('error update people Followed')
            return reject()
          }
          ['l_rec', 'l_sen', 'v_rec', 'l_sen'].forEach((e, k) => {
            console.log(e, k)
            this.followed[e] = res[k].body.data
            this.followed[e].forEach(f => {
              this.$set(f, 'status', false)
              if (!f.base64) {
                f.base64 = `src/assets/${f.sex}-silhouette.jpg`
              }
            })
            this.$on('userUpdate', (users) => {
              this.followed[e].forEach(f => {
                const user = users.find(user => user.id === f.id)
                f.status = user ? user.status : 0
              })
            })
          })
          console.log(this.followed.l_rec)
          resolve()
        })
      }
    },
    watch: {
      users () {
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
