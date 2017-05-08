<template>
  <authLayout :auth="auth" linkBtn="signin" nameBtn='Connexion'>

    <formInputs :inputs='inputs' :submit='submit' button="S'inscrire"></formInputs>

  </authLayout>
</template>

<script>

  import authLayout from './layout/Auth.vue'
  import formInputs from './Form.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'signup',
    data () {
      return {
        inputs: [
          {
            name: 'email',
            text: 'Email',
            type: 'email'
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
            type: 'radio',
            options: [
              {
                name: 'M',
                text: 'Homme'
              },
              {
                name: 'W',
                text: 'Femme'
              }
            ]
          },
          {
            name: 'birthday',
            text: 'Date de naissance',
            type: 'date'
          },
          {
            name: 'password',
            text: 'Mot de Passe',
            type: 'password',
            pattern: '(?=.*[0-9])(?=.*[a-zA-Z])(.{6,50})',
            error: 'Doit contenir entre 6 et 50 caractères et au moins une lettre et un chiffre',
          }
        ]
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
      submit (data) {
        this.$http.post(`${CONFIG.BASEURL_API}auth/signup`, data, {
          responseType: 'json'
        }).then(res => {
          if (!res.body.success) {
            this.inputs.forEach(n => {
              if (res.body.err[n.name]){
                this.$set(n, 'error', res.body.err[n.name].message)
                $('#' + n.name).removeClass('valid').addClass('invalid')
              }
            })
          } else {
            this.$http.post(`${CONFIG.BASEURL_API}auth/signin`, data, {
              responseType: 'json'
            }).then(res => {
              if (!res.body.success) return res.body.err
              this.$cookie.set('token', res.body.token)
              this.$router.replace('/dash')
            })
          }
        })
      }
    },
    props: ['auth'],
    components: {
      authLayout,
      formInputs
    }
  }

</script>

<style>

</style>
