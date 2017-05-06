<template>
  <defaultLayout :auth="auth">

    <p>Mon compte</p>
    <div class="collection">
      <a v-for="input in inputs" class="row collection-item">
        <div class="col s3">{{input.text}}</div>
        <div v-if="input.name === 'tag'" class='chips chips-autocomplete col s8'></div>
        <div v-else class="value col s8">{{input.value}}</div>
        <i class="fa fa-pencil secondary-content" aria-hidden="true"></i></a>
    </div>

  </defaultLayout>
</template>

<script>

  require("materialize-css/js/chips.js")

  import defaultLayout from './layout/Default.vue'
  import formInputs from './Form.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'DashBoard',
    data () {
      return {
        inputs: [
          {
            name: 'email',
            text: 'Email',
            type: 'email',
            value: null
          },
          {
            name: 'login',
            text: 'Login',
            type: 'text'
          },
          {
            name: 'firstName',
            text: 'Prénom',
            type: 'text'
          },
          {
            name: 'lastName',
            text: 'Nom',
            type: 'text'
          },
          {
            name: 'sex',
            text: 'Sexe',
            type: 'select',
            choice: ['Homme', 'Femme', 'Transgenre']
          },
          {
            name: 'prefer',
            text: 'Orientation sexuelle',
            type: 'select',
            choice: ['Homme', 'Femme', 'Bisexuel']
          },
          {
            name: 'bio',
            text: 'Bio',
            type: 'textarea'
          },
          {
            name: 'tag',
            text: 'Tag',
            type: 'chips'
          }
        ]
      }
    },
    created () {
      this.auth(data => {
        if (!data.success) return data.err

        const option = {
          responseType: 'json',
          headers: {
            "matcha-token": data.token
          }
        }
        vNotify.info({
          text:'This is anotification.',
          title:'.',
          fadeInDuration: 1000,
          fadeOutDuration: 1000,
          fadeInterval: 50,
          visibleDuration: 5000, // auto close after 5 seconds
          postHoverVisibleDuration: 500,
          position: "topRight", // topLeft, bottomLeft, bottomRight, center
          sticky: false, // is sticky
          showClose: true // show close button
          })
        Promise.all([
          this.$http.get(`${CONFIG.BASEURL_API}user/id/${data.decoded.id}`, option),
          this.$http.get(`${CONFIG.BASEURL_API}tags/${data.decoded.id}`, option),
          this.$http.get(`${CONFIG.BASEURL_API}tags`, option)
        ]).then(res => {
          if (!res[0].body.success || !res[1].body.success || !res[2].body.success) return null
          this.inputs.forEach(e => {
            if (res[0].body.data[0][e.name]) {
              e.value = res[0].body.data[0][e.name]
            } else if (e.name === 'tag') {
              e.value = []
              e.autoComplete = {}
              res[1].body.data.forEach(i => e.value.push({tag: i}))
              res[2].body.data.forEach(i => e.autoComplete[i] = null)

              $(function() {
                $('.chips-autocomplete').material_chip({
                    data: e.value,
                    autocompleteData: e.autoComplete,
                    autocompleteLimit: 1
                })
              })
            } else {
              e.value = 'Non renseigné'
            }
          })
        })
        const thisBis = this
        $(function() {
          $('.chips').on('chip.add', function(e, chip){
            console.log(option)
            thisBis.$http.post(`${CONFIG.BASEURL_API}tags/${chip.tag}`, {},option).then(r => console.log(r))
          })
          $('.chips').on('chip.delete', function(e, chip){
            thisBis.$http.delete(`${CONFIG.BASEURL_API}tags/${chip.tag}`, option).then(r => console.log(r))
          })
        })

      })
    },
    methods: {
      submit (data) {
        // this.$http.post(`${CONFIG.BASEURL_API}auth/signin`, data, {
        //   responseType: 'json'
        // }).then(res => {
        //   if (res.body.success) {
        //     this.$cookie.set('token', res.body.token)
        //     this.$router.replace('/dash')
        //   }
        // }).catch(err => console.log('err', err))
      }
    },
    props: ['auth'],
    components: {
      defaultLayout,
      formInputs
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
