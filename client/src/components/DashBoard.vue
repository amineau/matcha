<template>
  <div id="dashboard">

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

  </div>
</template>

<script>

  export default {
    name: 'DashBoard',
    data () {
      return {
        peoples: ['Magalie', 'Sonia', 'Ernest', 'Jacques']
      }
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
