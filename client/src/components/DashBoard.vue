<template>
  <defaultLayout :auth="auth">

    <p>Personnes à proximitées</p>
    <div class="row">
       <div v-for="people in peoples" class="col s6 m4 l3">
         <div class="card small">
           <div class="card-content">{{ people }}</div>
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

  export default {
    name: 'DashBoard',
    data () {
      return {
        peoples: ['Magalie', 'Sonia', 'Ernest', 'Jacques']
      }
    },
    props: ['auth'],
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
