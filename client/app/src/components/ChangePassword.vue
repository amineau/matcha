<template>
  <homeLayout :auth="auth" :frame="true">

    <formInputs :inputs='inputs' :submit='submit' button="Nouveau mot de passe"></formInputs>
  </homeLayout>
</template>

<script>

  import homeLayout from './layout/Home.vue'
  import formInputs from './Form.vue'
  import _ from 'lodash'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'changePassword',
    data () {
      return {
        inputs: [{
          name: 'password',
          text: 'Nouveau mot de Passe',
          type: 'password',
          pattern: '(?=.*[0-9])(?=.*[a-zA-Z])(.{6,50})',
          error: 'Doit contenir entre 6 et 50 caractères et au moins une lettre et un chiffre',
          label: true
        }],
        id: null,
        linkPassword: this.$route.params.uuid
      }
    },
    created() {
      this.$http.get(`${CONFIG.BASEURL_API}user/public/linkPassword/${this.linkPassword}`)
        .then(res => {
          if (!res.body.success || !res.body.data.length) return this.$router.replace({name: 'signin'})
          this.id = res.body.data[0].id
        })
    },
    methods: {
      submit (data) {
        return this.$http.post(`${CONFIG.BASEURL_API}auth/changepassword/${this.linkPassword}`, _.merge(data, {id: this.id}), {
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
          this.$router.replace({name: 'signin'})
        })
      }
    },
    computed: {
      successNotif () {
        return new window.Notif("Mot de pass modifié", 'success')
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
