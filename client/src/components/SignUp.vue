<template>
  <authLayout linkBtn="/signin" nameBtn='Connexion'>

    <formInputs :inputs='inputs' action='/dash' :submit='submit' button="S'inscrire"></formInputs>

  </authLayout>
</template>

<script>

  import authLayout from './layout/Auth.vue'
  import formInputs from './Form.vue'
  import conf from '../../../config/conf.json'

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
            name: 'password',
            text: 'Mot de Passe',
            type: 'password'
          },
        ]
      }
    },
    methods: {
      submit (data) {
        this.$http.post(`http://${conf.api.host}:${conf.api.port}/auth/signup`, data, {
          responseType: 'json'
        }).then(res => {
          console.log(res)
        }).catch(err => console.log('err', err))
      }
    },
    components: {
      authLayout,
      formInputs
    }
  }

</script>

<style>

</style>
