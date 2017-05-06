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
             <a href="#" class="waves-effect waves-light btn-floating"><i class="fa fa-heart-o" aria-hidden="true"></i></a>
             <a href="#" class="waves-effect waves-light btn-floating"><i class="fa fa-comment-o" aria-hidden="true"></i></a>
           </div>
         </div>
       </div>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'DashBoard',
    data () {
      return {
        peoples: []
      }
    },
    props: ['auth'],
    created () {
      this.auth(data => {
        if (!data.success) return data.err

        const option = {
          responseType: 'json',
          headers: {
            "matcha-token": data.token
          }
        }
        this.$http.get(`${CONFIG.BASEURL_API}users`, option)
          .then(res => {
            if (!res.body.success) return res.body.err
            this.peoples = res.body.data
            this.peoples.forEach(e => {
              this.$http.get(`${CONFIG.BASEURL_API}pic/${e.id}`, option)
                .then(pic => {
                  if (!pic.body.success) return pic.body.err
                  this.$set(e, 'photo', pic.body.data[0].photo.path)
                })
            })
          })
      })
    },
    components: {
      defaultLayout
    }
  }

</script>

<style>

/*.row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}*/

</style>
