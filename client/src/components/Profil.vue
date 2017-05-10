<template>
  <defaultLayout :auth="auth">

    <p>Mon compte</p>
    <div class="img-profil">
      <div v-for='photo in photos'>
        <div>
          <img :src="photo.path" :width="photo.head?360:200" :height="photo.head?360:200" />
        </div>
        <div>
          <i class="fa fa-close" aria-hidden="true"></i>
          <div>Supprimer</div>
        </div>
      </div>
      <div v-if="photos.length < 5" @click="addPhoto" class="add grey lighten-1">
        <i class="fa fa-plus fa-5x" aria-hidden="true"></i>
        <input type="file" style="display:none" id='photo' @change="upload" />
      </div>
    </div>

    <div class="collection">
      <a v-for="input in inputs" @click="input.edit = true" class="row collection-item">
        <div class="col s3">{{input.text}}</div>
        <tagbutton v-if="input.name === 'tag'" :auth="auth" :autocomplete="true"></tagbutton>
        <div v-else class="value col s8">
          <formInputs v-if='input.edit' :inputs="[input]" :submit="submit" button="Enregistrer"></formInputs>
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
  import tagbutton from './button/Tag.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Profil',
    data () {
      return {
        photos: [],
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
      Promise.all([
        this.$http.get(`${CONFIG.BASEURL_API}user/id/${auth.decoded.id}`, auth.httpOption).then(res => {
          if (!res.body.success ) return null
          console.log(res.body)
          this.inputs.forEach(e => {
            if (res.body.data[0][e.name]) {
              if (e.options){
                e.options.forEach(i => {
                  if (i.name === res.body.data[0][e.name]) {
                    e.value = i.text
                  }
                })
              } else {
                e.value = res.body.data[0][e.name]
              }
            } else if (e.name !== 'tag') {
              e.value = 'Non renseigné'
            }
          })
        }),
        this.$http.get(`${CONFIG.BASEURL_API}pic/${auth.decoded.id}`, auth.httpOption).then(res => {
          if (!res.body.success ) return null
          this.photos = res.body.data
          if (!this.photos.length) {
            this.photos.push({path: `src/assets/M-silhouette.jpg`, head: true})
          }
        })
      ])
    },
    methods: {
      submit (data) {
        console.log('coucou', data)
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
                if (e.type === 'radio') {
                    e.options.forEach(o => {
                      if (o.name === data[key]) {
                        e.value = o.text
                      }
                    })
                } else {
                  e.value = data[key]
                }
                e.edit = false
              }
            })
          })
        })
      },
      addPhoto () {
        $("#photo").trigger('click')
      },
      upload (e) {
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.createImage(files[0])
      },
      createImage (file) {
        let image = new Image()
        let reader = new FileReader()
        let vm = this
        image.onload = () => {
          console.log(image.width,image.height)
          var canvas = document.createElement("canvas")
          canvas.height = canvas.width * (image.height / image.width);

          var octx = canvas.getContext('2d');

          canvas.width = image.width * 0.1;
          canvas.height = image.height * 0.1;
          octx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/png")
          const auth = vm.auth()
          console.log(auth.httpOption)
          if (!auth.success) return alert(auth.err)
          vm.$http.post(`${CONFIG.BASEURL_API}pic`, {base64}, auth.httpOption).then(res => {
            if (!res.body.success) return alert('Erreur lors du post pic', res.body.err)
              vm.photos.push({path: base64, head: false})
          })
        }
        reader.onload = (e) => {
          if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
            return alert('Les formats acceptés sont jpeg, jpg et png')
          }
          image.src = e.target.result

          vm.photos.push({path: image.src, head: false})
        }

        reader.readAsDataURL(file)
      },
    },
    props: ['auth'],
    components: {
      defaultLayout,
      formInputs,
      tagbutton
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

.img-profil {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
}

.img-profil > div {
  position: relative;
  margin: 10px;
}

.img-profil > div > div:nth-child(1) {
  z-index: 1;
}

.img-profil > div > div:nth-child(2) {
  position: absolute;
  z-index: 2;
  display: none;
  top: 10px;
  right: 10px;
  padding: 5px;
  border-radius: 20px;
  background-color: rgba(238, 238, 238, 0.5);
  cursor: pointer;
}
.img-profil > div > div:nth-child(2) i {
  padding: 5px;
}
.img-profil > div > div:nth-child(2) div {
  max-width: 0px;
  overflow: hidden;
  font-weight: bold;
}
.img-profil > div > div:nth-child(2):hover{
  background-color: rgba(158, 158, 158, 0.7);
  transition: background-color 1s;
  -webkit-transition: background-color 1s;
}
.img-profil > div > div:nth-child(2):hover div {
  margin: auto;
  padding-right: 5px;
  transition: max-width 1s;
  -webkit-transition: max-width 1s;
  max-width: 100px;
}
.img-profil > div:hover > div:nth-child(2) {
  display: flex;
}
.img-profil .add {
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.img-profil .add:hover i {
  transition: color 0.5s;
  -webkit-transition: color 0.5s;
  color: #4fc3f7
}
</style>
