<template>
  <authLayout :auth="auth" linkBtn="/signup" nameBtn='Inscription'>

    <formInputs :inputs='inputs' action='/dash' :submit='submit' button="Se connecter"></formInputs>

  </authLayout>
</template>

<script>

  import authLayout from './layout/Auth.vue'
  import formInputs from './Form.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'signin',
    data () {
      return {
        inputs: [
          {
            name: 'login',
            text: 'Login',
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
        this.$http.post(`${CONFIG.BASEURL_API}auth/signin`, data, {
          responseType: 'json'
        }).then(res => {
          if (!res.body.success) return errorNotif.display(3500)
          this.$cookie.set('token', res.body.token)
          this.$router.replace('/dash')
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
