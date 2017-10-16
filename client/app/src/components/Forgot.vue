<template>
  <homeLayout :auth="auth" :frame="true">

    <formInputs :inputs='inputs' :submit='submit' button="Nouveau mot de passe"></formInputs>
  </homeLayout>
</template>

<script>

  import homeLayout from './layout/Home.vue'
  import formInputs from './Form.vue'
  import config from '../../config'

  export default {
    name: 'forgot',
    data () {
      return {
        inputs: [
          {
            name: 'email',
            text: 'Email',
            type: 'email',
            label: true
          }
        ]
      }
    },
    methods: {
      submit (data) {
        return this.$http.post(`${config.api}auth/forgotpassword`, data, {
          responseType: 'json'
        }).then(res => {
          if (!res.body.success) {
            this.inputs.forEach(n => {
              if (res.body.err[n.name]){
                this.$set(n, 'error', res.body.err[n.name].message)
                $('#' + n.name).removeClass('valid').addClass('invalid')
              }
            })
            return;
          }
          this.successNotif.display(3500)
          this.$router.replace('signin')
        })
      }
    },
    computed: {
      successNotif () {
        return new window.Notif("Un email vous a été envoyé", 'success')
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
