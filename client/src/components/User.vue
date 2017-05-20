<template>
  <defaultLayout :auth="auth">
    <div v-if="find" class="user">
      <div class="img-profil">
        <div v-for='photo in photos'>
            <img class="materialboxed" :src="photo.base64" :width="photo.head?300:300/4" :height="photo.head?300:300/4" />
        </div>
      </div>
      <div class='infos'>
        <div>
          <like :httpOption="httpOption" :people="user"></like>
          <chat :httpOption="httpOption" :people="user"></chat>
          <h5><span class='login'>{{user.login}}</span>, <span>{{calculateAge(user.birthday)}} ans</span> <online :id="user.id"></online></h5>
          <div class='bio'>{{user.bio}}</div>
          <div>Membre depuis le {{memberSince}}</div>
          <div v-show="!status">Dernière connexion le {{lastConnection}}</div>
          <div><i class="fa fa-star-o" aria-hidden="true"></i> {{user.score}} points</div>
          <div>
            <i class="fa fa-venus-mars" aria-hidden="true"></i>
            <span v-if="user.sex === 'M'">Homme</span>
            <span v-else>Femme</span>
          </div>
          <div>
            <i class="fa fa-heart-o" aria-hidden="true"></i>
            <span v-if="user.prefer === 'M'">Homme</span>
            <span v-else-if="user.prefer === 'W'">Femme</span>
            <span v-else-if="user.prefer === 'B'">Homme et Femme</span>
            <span v-else>Non renseigné</span>
          </div>
          <div class='chips'>
            <div v-for='tag in tags' :class="{'brown-m': tag.commun}" class='chip'>{{tag.name}}</div>
          </div>
        </div>
      </div>
      <div>
        <block :httpOption="httpOption" :people="user"></block>
        <report :httpOption="httpOption" :people="user"></report>
      </div>
    </div>
    <div v-else>
      Aucun utilisateur trouvé
    </div>
  </defaultLayout>
</template>

<script>

  import _ from 'lodash'
  import dateformat from 'dateformat'
  import chat from './button/Chat.vue'
  import like from './button/Like.vue'
  import block from './button/Block.vue'
  import report from './button/Report.vue'
  import online from './button/Online.vue'
  import defaultLayout from './layout/Default.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'User',
    data () {
      return {
        user: {},
        photos: [],
        tags: [],
        id: Number(this.$route.params.id),
        find: true,
        status:0,
      }
    },
    created () {
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${this.id}`, this.httpOption)
        .then(res => {
          if (!res.body.success || _.isEmpty(res.body.data)) return Promise.reject(res.body.err)
          this.user = res.body.data[0]
        })
        .then(Promise.all([
          this.$http.get(`${CONFIG.BASEURL_API}pic/${this.id}`, this.httpOption)
            .then(res => {
              if (!res.body.success) return null
              this.photos = res.body.data
              if (!this.photos.length) {
                this.photos.push({base64: `src/assets/M-silhouette.jpg`, head: true})
              }
              $(function() {
                $('.materialboxed').materialbox()
              })
            }),
          this.$http.get(`${CONFIG.BASEURL_API}tags/${this.id}`, this.httpOption)
            .then(res => {
              if (!res.body.success) return null
              this.tags = res.body.data
              this.tags.forEach(e => {
                this.$set(e, 'commun', false)
              })
            }).then(() => this.$http.get(`${CONFIG.BASEURL_API}tags/${this.userId}`, this.httpOption).then(res => {
              if (!res.body.success) return null
              res.body.data.forEach(t => {
                this.tags.forEach(e => {
                  if (t.name === e.name) {
                    e.commun = true
                  }
                })
                this.tags.sort((a,b) => b.commun - a.commun)
              })
            })),
            this.$http.post(`${CONFIG.BASEURL_API}visit/${this.id}`, {}, this.httpOption).then(res => {
              if (!res.body.success) return console.log(res.body.err)
            })
        ]))
        .then(() => this.$socket.emit('online', this.userId))
        .catch(err => this.find = false)
      this.$root.$on('userUpdate', (users) => this.status = users.find(e => e.id === this.id))
    },
    computed: {
      httpOption () {
        const auth = this.auth()
        if (auth.decoded.id === this.$route.params.id) return this.$router.replace({name: 'dashBoard'})
        if (!auth.success) return console.log(auth.err)
        return auth.httpOption
      },
      userId () {
        const auth = this.auth()
        if (!auth.success) return console.log(auth.err)
        return auth.decoded.id
      },
      memberSince () {
        return dateformat(this.user.dateCreate, 'dd/mm/yyyy')
      },
      lastConnection () {
        return dateformat(this.user.lastConnection, 'dd/mm/yyyy')
      }
    },
    methods: {
      calculateAge (birthDate) {
          birthDate = new Date(birthDate)
          const now = new Date()

          var years = (now.getFullYear() - birthDate.getFullYear())

          if (now.getMonth() < birthDate.getMonth()
              || now.getMonth() == birthDate.getMonth()
              && now.getDate() < birthDate.getDate()) {
              years--
          }
          return years
      }
    },
    props: {
      auth: Function
    },
    components: {
      defaultLayout,
      block,
      like,
      chat,
      report,
      online
    }
  }

</script>

<style>

  .img-profil {
    display: flex;
    flex-wrap: wrap;
    width: 300px;
  }

  img {
    padding: 5px;
  }

  .user {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
  }

  .infos {
    flex:1;
    min-width: 300px;
    padding: 10px;
    display: flex;
    justify-content: center;
  }

  .user > div:last-child {
    width: 100%;
  }

  .login {
    font-weight: bold;
  }

  .bio {
    font-style: italic;
    padding: 0 0 .8em .8em;
  }

  .infos > div > div:not(.chip) {
    color: #bdbdbd;
  }

  .chips {
    margin-top: 30px;
    border-bottom: none;
  }


</style>
