<template>
  <homeLayout :auth="auth" :frame="true">

    <formInputs :inputs='inputs' :submit='submit' button="S'inscrire"></formInputs>

  </homeLayout>
</template>

<script>

  import homeLayout from './layout/Home.vue'
  import formInputs from './Form.vue'
  import _ from 'lodash'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'signup',
    data () {
      return {
        inputs: [{
          name: 'email',
          text: 'Email',
          type: 'email'
        },{
          name: 'login',
          text: 'Login',
          type: 'text'
        },{
          name: 'firstName',
          text: 'Prénom',
          type: 'text'
        },{
          name: 'lastName',
          text: 'Nom',
          type: 'text'
        },{
          name: 'sex',
          text: 'Sexe',
          type: 'radio',
          options: [{
            name: 'M',
            text: 'Homme'
          },{
            name: 'W',
            text: 'Femme'
          }]
        },{
          name: 'birthday',
          text: 'Date de naissance',
          type: 'date'
        },{
          name: 'password',
          text: 'Mot de Passe',
          type: 'password',
          pattern: '(?=.*[0-9])(?=.*[a-zA-Z])(.{6,50})',
          error: 'Doit contenir entre 6 et 50 caractères et au moins une lettre et un chiffre',
        }]
      }
    },
    created () {
      this.inputs.forEach(e => {
        this.$set(e, 'label', true)
        this.$set(e, 'value', null)
        this.$set(e, 'required', true)
      })
    },
    methods: {
      getPosition () {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            pos => resolve(pos.coords),
            err => {
              this.$http.get(`http://ip-api.com/json`).then(res => {
                resolve({latitude: res.data.lat, longitude: res.data.lon})
              }).catch(err => reject(err))
            }
          )
        })
      },
      submit (data) {
        return this.getPosition()
        .then(coords => this.$http.post(`${CONFIG.BASEURL_API}auth/signup`,
          _.merge(data, coords), {
            responseType: 'json'
          })
        )
        .then(res => {
          if (!res.body.success) {
            this.inputs.forEach(n => {
              if (res.body.err[n.name]){
                this.$set(n, 'error', res.body.err[n.name].message)
                $('#' + n.name).removeClass('valid').addClass('invalid')
              }
            })
            return this.errorNotif.display(3500)
          }
          this.$http.post(`${CONFIG.BASEURL_API}auth/signin`, data, {
            responseType: 'json'
          }).then(res => {
            if (!res.body.success) return;
            this.$cookie.set('token', res.body.token)
            this.$router.replace({name: 'dashBoard'})
            this.successNotif.display(3500)
          })
        })
      }
    },
    computed: {
      successNotif () {
        return new window.Notif("Inscription réussi... Vous pouvez maintenant consulter les profils présents près de chez vous", 'success')
      },
      errorNotif () {
        return new window.Notif("Inscription échouée... Veuillez remplir les champs incorrects", 'error')
      }
    },
    props: ['auth'],
    components: {
      homeLayout,
      formInputs
    }
  }

</script>

<style>

</style>
