<template>

  <div class="img-set">
    <div v-for='photo in photos'>
      <div :style="{height:photo.head?'360px':'200px'}">
        <img :src="photo.base64" :width="photo.head?360:200" :height="photo.head?360:200" />
      </div>
      <div v-show="!photo.head" @click="deleteImage(photo.id)">
        <i class="fa fa-close" aria-hidden="true"></i>
        <div>Supprimer</div>
      </div>
      <div v-show="!photo.head" @click="profil(photo.id)" class="valign-wrapper">
        <div class="center-align">Définir comme profil</div>
      </div>
    </div>
    <div v-if="photos.length < 5" @click="addPhoto" class="add grey lighten-1">
      <i class="fa fa-plus fa-5x" aria-hidden="true"></i>
      <input type="file" style="display:none" id='photo' @change="upload" />
    </div>
  </div>

</template>

<script>

  import CONFIG from '../../config/conf.json'

  export default {
    name: 'setPhoto',
    data () {
      return {
        photos: [],
        httpOption: {}
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return;
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}pic/${auth.decoded.id}`, this.httpOption).then(res => {
        if (!res.body.success) return;
        this.photos = res.body.data
        if (!this.photos.length) {
          this.photos.push({base64: `${CONFIG.STATIC_PATH}/assets/M-silhouette.jpg`, head: true, silhouette: true})
        }
      })
    },
    methods: {
      addPhoto () {
        $("#photo").trigger('click')
      },
      upload (e) {
        var files = e.target.files || e.dataTransfer.files
        if (!files.length) return
        this.createImage(files[0])
        $('input[type=file]').val('')
      },
      createImage (file) {
        let image = new Image()
        let reader = new FileReader()
        image.onload = () => {
          var canvas = document.createElement("canvas")
          var octx = canvas.getContext('2d')

          canvas.width = 640
          canvas.height = 640

          octx.drawImage(image,(image.width - image.height)/2,0,image.height,image.height,0, 0, 640, 640)
          const base64 = canvas.toDataURL("image/png")

          this.$http.post(`${CONFIG.BASEURL_API}pic`, {base64}, this.httpOption).then(res => {
            if (!res.body.success || !res.body.data.length) return this.errorAddNotif.display(3500)
            const id = res.body.data[0].id
            if (this.photos.length === 1 && this.photos[0].silhouette) {
              this.photos = []
            }
            this.photos.push({base64, id, head: this.photos.length === 0})
            this.successAddNotif.display(3500)
          })
        }
        reader.onload = (e) => {
          if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
            return alert('Les formats acceptés sont jpeg, jpg et png')
          }
          image.src = e.target.result
        }

        reader.readAsDataURL(file)
      },
      deleteImage (id) {
        this.$http.delete(`${CONFIG.BASEURL_API}pic/${id}`, this.httpOption).then(res => {
          if (!res.body.success) return this.errorDeleteNotif.display(3500)
          this.photos = this.photos.filter(obj => obj.id !== id)
          this.successDeleteNotif.display(3500)
        })
      },
      profil (id) {
        this.$http.put(`${CONFIG.BASEURL_API}pic/${id}`, {}, this.httpOption).then(res => {
          if (!res.body.success) return;
          let index
          this.photos[0].head = false
          this.photos.forEach((e, k) => {
            if (e.id === id) {
              e.head = true
              index = k
            }
          })
          this.photos.unshift(this.photos.splice(index, 1)[0])
        })
      }
    },
    computed: {
      successAddNotif () {
        return new window.Notif("Ajout réussi", 'success')
      },
      successDeleteNotif () {
        return new window.Notif("Supression réussie", 'success')
      },
      errorAddNotif () {
        return new window.Notif("Erreur lors de l'ajout de la photo... Veuillez réessayer", 'error')
      },
      errorDeleteNotif () {
        return new window.Notif("Erreur lors de la suppression de la photo... Veuillez réessayer", 'error')
      }
    }
  }

</script>

<style>

  .img-set {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
  }

  .img-set > div {
    position: relative;
    margin: 10px;
  }

  .img-set > div > div:nth-child(1) {
    z-index: 1;
  }

  .img-set > div > div:nth-child(2) {
    position: absolute;
    z-index: 2;
    display: none;
    padding: 5px;
    border-radius: 20px;
    background-color: rgba(238, 238, 238, 0.5);
    cursor: pointer;
    top: 10px;
    right: 10px;
  }

  .img-set > div > div:nth-child(3) {
    background-color: rgba(238, 238, 238, 0.5);
    position: absolute;
    z-index: 2;
    display: none;
    bottom: 0;
    right: 0;
    left: 0;
    height: 30%;
    width: auto;
    margin: auto;
    cursor: pointer;
    font-weight: bold;
  }

  .img-set > div > div:nth-child(3) div {
    width: 100%;
  }
  .img-set > div > div:nth-child(2) i {
    padding: 5px;
  }
  .img-set > div > div:nth-child(2) div {
    max-width: 0px;
    overflow: hidden;
    font-weight: bold;
  }
  .img-set > div > div:nth-child(n+2):hover{
    background-color: rgba(158, 158, 158, 0.7);
    transition: background-color 1s;
    -webkit-transition: background-color 1s;
  }
  .img-set > div > div:nth-child(2):hover div {
    margin: auto;
    padding-right: 5px;
    transition: max-width 1s;
    -webkit-transition: max-width 1s;
    max-width: 100px;
  }
  .img-set > div:hover > div:nth-child(n+2) {
    display: flex;
  }
  .img-set .add {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .img-set .add:hover i {
    transition: color 0.5s;
    -webkit-transition: color 0.5s;
    color: #4fc3f7
  }

</style>
