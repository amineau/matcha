<template>
  <defaultLayout :auth="auth">

    <div class="row">
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
    name: 'Liked',
    data () {
      return {
        peoples: [],
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
      this.$http.get(`${CONFIG.BASEURL_API}users/liked`, auth.httpOption)
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
