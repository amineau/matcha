<template>
  <defaultLayout :auth="auth">

    <p>Mon compte</p>

    <setPhoto :auth="auth"></setPhoto>
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
        inputs: [{
          name: 'email',
          text: 'Email',
          type: 'email'
        }, {
          name: 'login',
          text: 'Login',
          type: 'text'
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
        }]
      }
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return alert(auth.err)
      this.inputs.forEach(e => {
        this.$set(e, 'value', null)
        this.$set(e, 'edit', false)
      })
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${auth.decoded.id}`, auth.httpOption).then(res => {
        if (!res.body.success ) return null
        this.inputs.forEach(e => {
          if (res.body.data[0][e.name]) {
            if (e.options){
              e.options.forEach(i => {
                if (i.name === res.body.data[0][e.name]) {
                  e.value = i.name
                }
              })
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
      .then(() => this.$socket.emit('online', auth.decoded.id))
    },
    methods: {
      submit (data) {
        const auth = this.auth()
        this.$http.put(`${CONFIG.BASEURL_API}user`, data, auth.httpOption).then(res => {
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
                e.edit = false
              }
            })
          })
        })
      },
      textOption (input) {
        let text
        input.options.forEach(e => {
          if (e.name === input.value) {
            text = e.text
          }
        })
        return text
      }
    },
    computed: {

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

</style>
