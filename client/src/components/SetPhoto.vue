<template>

  <div class="img-profil">
    <div v-for='photo in photos'>
      <div>
        <img :src="photo.base64" :width="photo.head?360:200" :height="photo.head?360:200" />
      </div>
      <div v-show="!photo.head" @click="deleteImage(photo.id)">
        <i class="fa fa-close" aria-hidden="true"></i>
        <div>Supprimer</div>
      </div>
      {{photo.id}}
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
        photos: []
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return alert(auth.err)
      this.$http.get(`${CONFIG.BASEURL_API}pic/${auth.decoded.id}`, auth.httpOption).then(res => {
        if (!res.body.success ) return null
        this.photos = res.body.data
        if (!this.photos.length) {
          this.photos.push({base64: `src/assets/M-silhouette.jpg`, head: true})
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
      },
      createImage (file) {
        let image = new Image()
        let reader = new FileReader()
        image.onload = () => {
          var canvas = document.createElement("canvas")
          canvas.height = canvas.width * (image.height / image.width);
          console.log(image)
          var octx = canvas.getContext('2d');

          canvas.width = image.width * 0.1;
          canvas.height = image.height * 0.1;
          octx.drawImage(image, 0, 0, canvas.width, canvas.height);
          const base64 = canvas.toDataURL("image/png")

          const auth = this.auth()
          if (!auth.success) return alert(auth.err)
          this.$http.post(`${CONFIG.BASEURL_API}pic`, {base64}, auth.httpOption).then(res => {
            if (!res.body.success) return alert('Erreur lors du post pic')
              const id = res.body.data[0].id
              this.photos.push({base64, id, head: this.photos.length === 0})
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
        const auth = this.auth()
        this.$http.delete(`${CONFIG.BASEURL_API}pic/${id}`, auth.httpOption).then(res => {
          if (!res.body.success) return alert('Erreur lors du delete pic')
          this.photos = this.photos.filter(obj => obj.id !== id)
        })
      }
    },
    watch: {

    }
  }

</script>

<style>

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
