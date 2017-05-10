<template>
  <defaultLayout :auth="auth">

    <p>Personnes à proximitées</p>
    <div class="row">
       <div v-for="people in peoples" class="col s6 m4 l3">
         <div class="card">
           <div class="card-image">
             <img :src="people.photo"/>
             <span class="card-title">{{people.login}}</span>
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
        httpOption: this.auth().httpOption
      }
    },
    props: {
      auth: Function
    },
    created () {
      this.$http.get(`${CONFIG.BASEURL_API}users`, this.httpOption)
        .then(res => {
          if (!res.body.success) return res.body.err
          this.peoples = res.body.data
          this.peoples.forEach(e => {
            if (!e.photo) {
              e.photo = `src/assets/${e.sex}-silhouette.jpg`
            }
          })
        })
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
