<template>
  <defaultLayout :auth="auth">

    <div class="img-profil">
      <div v-for='photo in photos'>
          <img class="materialboxed" :src="photo.base64" :width="photo.head?360:200" :height="photo.head?360:200" />
      </div>
    </div>
    {{user}}
    <div v-for='tag in tags' class='chip'>{{tag}}</div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'User',
    data () {
      return {
        user: {},
        photos: [],
        tags: [],
        id: Number(this.$route.params.id)
      }
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.err)
      if (auth.decoded.id === this.$route.params.id) return this.$router.replace({name: 'dashBoard'})
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${this.id}`, auth.httpOption).then(res => {
        if (!res.body.success) return console.log(res.body.err)
        console.log(res.body.data)
        this.user = res.body.data[0]
      })
      this.$http.get(`${CONFIG.BASEURL_API}pic/${this.id}`, auth.httpOption).then(res => {
        if (!res.body.success ) return null
        this.photos = res.body.data
        if (!this.photos.length) {
          this.photos.push({base64: `src/assets/M-silhouette.jpg`, head: true})
        }
        $(function() {
          $('.materialboxed').materialbox()
        })
      })
      this.$http.get(`${CONFIG.BASEURL_API}tags/${this.id}`, auth.httpOption).then(res => {
        if (!res.body.success ) return null
        this.tags = res.body.data
      })
      this.$http.post(`${CONFIG.BASEURL_API}visit/${this.id}`, {}, auth.httpOption).then(res => {
        if (!res.body.success) return console.log(res.body.err)
      })
    },
    props: {
      auth: Function
    },
    components: {
      defaultLayout
    }
  }

</script>

<style>


</style>
