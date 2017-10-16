<template>
  <homeLayout :auth="auth" :frame="true">
    <formInputs :inputs='inputs' :submit='submit' button="Se connecter"></formInputs>
    <router-link :to="{name: 'forgot'}">Mot de passe oublié ?</router-link>
  </homeLayout>
</template>

<script>

  import homeLayout from './layout/Home.vue'
  import formInputs from './Form.vue'
  import config from '../../config'

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
        return this.$http.post(`${config.api}auth/signin`, data, {
          responseType: 'json'
        }).then(res => {
          if (!res.body.success) return this.errorNotif.display(3500)
          this.$cookie.set('token', res.body.token)
          this.$socket.emit('online', res.body.id)
          this.$router.replace({name: 'dashBoard'})
          this.successNotif.display(3500)
        })
      }
    },
    props: ['auth'],
    components: {
      homeLayout,
      formInputs
    },
    computed: {
      successNotif () {
        return new window.Notif("Connexion réussi... Amusez vous !", 'success')
      },
      errorNotif () {
        return new window.Notif("Connexion échouée", 'error')
      }
    }
  }

</script>

<style>

  .authTitle {
    background-color: rgba(0, 0, 0, 0.2);
    padding: auto;
  }

</style>
