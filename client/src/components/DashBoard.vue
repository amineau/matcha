<template>
  <defaultLayout :auth="auth">

    <p>Personnes à proximitées</p>
    <div class="row">
       <div v-for="people in peoples" class="col s6 m4 l3">
         <div class="card">
           <div class="card-image">
             <img :src="people.base64"/>
             <span class="card-title">{{people.login}} <i :class="{'orange-text': people.status === 2, 'green-text': people.status === 1, 'grey-text': !people.status}" class="fa fa-circle" aria-hidden="true"></i></span>
           </div>
           <div class="card-content">{{ calculateAge(people.birthday) }} ans</div>
           <div class="card-action">
             <likebutton :httpOption="httpOption" :people="people"></likebutton>
             <chatbutton :people="people"></chatbutton>
             <profilbutton :people="people"></profilbutton>
           </div>
         </div>
       </div>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import likebutton from './button/Like.vue'
  import chatbutton from './button/Chat.vue'
  import profilbutton from './button/Profil.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'DashBoard',
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
      this.$http.get(`${CONFIG.BASEURL_API}users`, auth.httpOption)
        .then(res => {
          if (!res.body.success) return res.body.err
          this.peoples = res.body.data
          this.peoples.forEach(e => {
            this.$set(e, 'status', false)
            if (!e.base64) {
              e.base64 = `src/assets/${e.sex}-silhouette.jpg`
            }
          })
        }).then(() => {
          this.$on('userUpdate', (users) => {
            this.peoples.forEach((e, k) => {
              const user = users.find(user => user.id === e.id)
              e.status = user ? user.status : 0
            })
          })
        })
        .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      calculateAge (birthDate) {
          birthDate = new Date(birthDate)
          const now = new Date()

          var years = (now.getFullYear() - birthDate.getFullYear())

          if (now.getMonth() < birthDate.getMonth() ||
              now.getMonth() == birthDate.getMonth() && now.getDate() < birthDate.getDate()) {
              years--
          }
          return years
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
      defaultLayout,
      likebutton,
      chatbutton,
      profilbutton
    }
  }

</script>

<style>


</style>
