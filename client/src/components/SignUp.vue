<template>
  <authLayout :auth="auth" linkBtn="/signin" nameBtn='Connexion'>

    <formInputs :inputs='inputs' action='/dash' :submit='submit' button="S'inscrire"></formInputs>

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
            type: 'email',
            label: true
          },
          {
            name: 'login',
            text: 'Login',
            type: 'text',
            label: true
          },
          {
            name: 'firstName',
            text: 'Prénom',
            type: 'text',
            label: true
          },
          {
            name: 'lastName',
            text: 'Nom',
            type: 'text',
            label: true
          },
          {
            name: 'password',
            text: 'Mot de Passe',
            type: 'password',
            label: true
          }
        ]
      }
    },
    methods: {
      submit (data) {
        this.$http.post(`${CONFIG.BASEURL_API}auth/signup`, data, {
          responseType: 'json'
        }).then(res => {
          console.log(res)
          if (res.body.success) {

          }
        }).catch(err => console.log('err', err))
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
