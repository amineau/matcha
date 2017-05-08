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
           <!-- <div class="card-content">{{ people }}</div> -->
           <div class="card-action">
             <like :httpOption="httpOption" :people="people"></like>
             <chatbutton :people="people"></chatbutton>
             <router-link :to="{name: 'user', params: {id: people.id}}" class="waves-effect waves-light btn-floating"><i class="fa fa-user-o" aria-hidden="true"></i></router-link>
           </div>
         </div>
       </div>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import like from './Like.vue'
  import chatbutton from './ChatButton.vue'
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
              console.log(e)
              e.photo = `src/assets/${e.sex}-silhouette.jpg`
            }
          })
        })
    },
    components: {
      defaultLayout,
      like
    }
  }

</script>

<style>


</style>
