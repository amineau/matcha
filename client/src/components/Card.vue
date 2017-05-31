<template>

   <div class="card">
     <div class="card-image">
       <img :src="people.base64"/>
       <span class="card-title">{{people.login}} <online :id="people.id" :httpOption="httpOption"></online></span>
     </div>
     <div class="card-content content row">
       <div class="col s12 m6"><i class="fa fa-birthday-cake" aria-hidden="true"></i> {{ calculateAge(people.birthday) }} ans</div>
       <div class="col s12 m6"><i class="fa fa-star" aria-hidden="true"></i> {{people.score}} points</div>
       <div v-show="people.distance !== undefined" class="col s12 m6"><i class="fa fa-map-marker" aria-hidden="true"></i> {{people.distance}} km</div>
     </div>
     <div class="card-action">
       <likebutton :httpOption="httpOption" :people="people"></likebutton>
       <chatbutton :people="people"></chatbutton>
       <profilbutton :people="people"></profilbutton>
     </div>
   </div>

</template>

<script>

  import likebutton from './button/Like.vue'
  import chatbutton from './button/Chat.vue'
  import profilbutton from './button/Profil.vue'
  import online from './button/Online.vue'

  export default {
    name: 'Card',
    props: {
      people: Object,
      httpOption: Object
    },
    mounted () {
      $('ul.tabs').tabs()
    },
    methods: {
      calculateAge (birthDate) {
          birthDate = new Date(birthDate)
          const now = new Date()

          var years = (now.getFullYear() - birthDate.getFullYear())

          if (now.getMonth() < birthDate.getMonth()
              || now.getMonth() == birthDate.getMonth()
              && now.getDate() < birthDate.getDate()) {
              years--
          }
          return years
      }
    },
    components: {
      likebutton,
      chatbutton,
      profilbutton,
      online
    }
  }

</script>

<style>

  /*.content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }*/

  .content div {
    overflow: visible;
    max-height: 21px;
  }

  .card-action {
    display:flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }

  /*@media only screen and (max-width: 1092px) {
    .content {
      flex-direction: column;
      justify-content: space-around;
    }
  }*/

</style>
