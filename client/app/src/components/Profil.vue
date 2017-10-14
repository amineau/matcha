<template>
  <defaultLayout :auth="auth">

    <p>Mon compte</p>

    <setPhoto :auth="auth" :sex="sex"></setPhoto>
    <div class="collection">
      <a v-for="input in inputs" @click="input.edit = true" class="row collection-item">
        <div class="col s3">{{input.text}}</div>
        <tagbutton v-if="input.name === 'tag'" :auth="auth" :autocomplete="true" :init="true"></tagbutton>
        <div v-else class="value col s8">
          <formInputs v-if='input.edit' :inputs="[input]" :submit="submit" button="Enregistrer"></formInputs>
          <div v-else-if='input.type === "radio"'>{{textOption(input)}}</div>
          <div v-else>{{input.value}}</div>
        </div>
        <i v-if="input.type !== 'chips'" @click.stop="input.edit = !input.edit" :class="{'fa-pencil': !input.edit, 'fa-close': input.edit}" class="fa secondary-content" aria-hidden="true"></i>
      </a>
    </div>

    <a class="modal-trigger waves-effect waves-light btn" href="#changePassword">Changer de mot de passe</a>
    <router-link class="modal-trigger waves-effect waves-light btn" :to="{name: 'user', params:{id}}">Profil public</router-link>

    <!-- Modal Structure -->
    <div id="changePassword" class="modal modal-fixed-footer">
      <div class="modal-content">
        <h4>Changement de mot de passe</h4>
        <formInputs :inputs="password" :submit="submitPassword" button="Modifier"></formInputs>
      </div>
    </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import formInputs from './Form.vue'
  import setPhoto from './SetPhoto.vue'
  import tagbutton from './button/Tag.vue'
  import dateformat from 'dateformat'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Profil',
    data () {
      return {
        httpOption: {},
        id: 0,
        sex: "",
        address: '',
        inputs: [{
          name: 'email',
          text: 'Email',
          type: 'email'
        }, {
          name: 'login',
          text: 'Login',
          type: 'text'
        }, {
          name: 'localisation',
          text: 'Localisation',
          type: 'radio',
          options: [{
            name: 'self',
            text: 'Ma position'
          }, {
            name: 'place',
            text: 'Autre'
          }]
        }, {
          name: 'firstName',
          text: 'Prénom',
          type: 'text'
        }, {
          name: 'lastName',
          text: 'Nom',
          type: 'text'
        }, {
          name: 'birthday',
          text: 'Date de naissance',
          type: 'date'
        }, {
          name: 'sex',
          text: 'Sexe',
          type: 'radio',
          options: [{
            name: 'M',
            text: 'Homme'
          }, {
            name: 'W',
            text: 'Femme'
          }]
        }, {
          name: 'prefer',
          text: 'Orientation sexuelle',
          type: 'radio',
          options: [{
            name: 'M',
            text: 'Homme'
          }, {
            name: 'W',
            text: 'Femme'
          }, {
            name: 'B',
            text: 'Bisexuel'
          }]
        }, {
          name: 'bio',
          text: 'Bio',
          type: 'textarea'
        }, {
          name: 'tag',
          text: 'Tag',
          type: 'chips'
        }],
        password: [{
          name: 'oldPassword',
          text: 'Ancien mot de passe',
          type: 'password',
          label: true,
          value: null
        }, {
          name: 'password',
          text: 'Nouveau mot de passe',
          type: 'password',
          label: true,
          value: null
        }]
      }
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return;
      this.httpOption = auth.httpOption
      this.id = auth.decoded.id
      this.inputs.forEach(e => {
        this.$set(e, 'value', null)
        this.$set(e, 'edit', false)
      })
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${this.id}`, this.httpOption).then(res => {
        if (!res.body.success ) return null
        this.inputs.forEach(e => {
          if (res.body.data[0][e.name]) {
            this.sex = res.body.data[0].sex
            if (e.options){
              e.options.forEach(i => {
                if (i.name === res.body.data[0][e.name]) {
                  e.value = i.name
                }
              })
              if (e.name === 'localisation' && e.value === 'place') {
                this.$set(e, 'place', res.body.data[0].place)
              }
            } else if (e.type === 'date') {
              const date = new Date(res.body.data[0][e.name])
              e.value = dateformat(date, 'dd/mm/yyyy')
            } else {
              e.value = res.body.data[0][e.name]
            }
          } else if (e.name !== 'tag') {
            e.value = 'Non renseigné'
          }
        })
      })
      .then(() => this.$socket.emit('online', this.id))
      $(function(){
        $('.modal').modal()
      })
    },
    methods: {
      submit (data) {
        return this.$http.put(`${CONFIG.BASEURL_API}user`, data, this.httpOption)
          .then(res => {
            if (!res.body.success) {
              this.inputs.forEach(n => {
                if (res.body.err[n.name]){
                  this.$set(n, 'error', res.body.err[n.name].message)
                  $('#' + n.name).removeClass('valid').addClass('invalid')
                }
              })
              return null
            }
            const keys = Object.keys(data)
            keys.forEach(key => {
              this.inputs.forEach(e => {
                if (e.name === key) {
                  e.value = data[key]
                  if (e.name === 'localisation' && data.localisation === 'place') {
                    this.$set(e, 'place', data.place)
                  }
                  e.edit = false
                  return;
                }
              })
            })
          })
      },
      submitPassword (data) {
        return this.$http.put(`${CONFIG.BASEURL_API}user/password`, data, this.httpOption)
          .then(res => {
            if (!res.body.success) {
              this.password.forEach(n => {
                if (res.body.err[n.name]){
                  this.$set(n, 'error', res.body.err[n.name].message)
                  $('#' + n.name).removeClass('valid').addClass('invalid')
                }
              })
              return null
            }
            $('.modal').modal('close')
            this.password.forEach(e => {
              e.value = null
            })
          })
      },
      textOption (input) {
        let text
        input.options.forEach(e => {
          if (e.name === input.value) {
            if (e.name === 'place') {
              text = input.place
            } else {
              text = e.text
            }
          }
        })
        return text || input.value
      },
      getAddressData (addressData, placeResultData) {
        this.address = addressData;
      }
    },
    props: ['auth'],
    components: {
      defaultLayout,
      formInputs,
      tagbutton,
      setPhoto
    }
  }

</script>

<style>

.collection-item:hover i.fa-pencil{
  display: block;
}

.collection-item i.fa-pencil{
  display: none;
}

.pac-container:after{
    content:none !important;
}

</style>
