<template>
  <defaultLayout :auth="auth">
    <div v-show="ready">

      <div v-if="user.id !== undefined" class="user">
        <div class="img-profil">
          <div v-for='photo in photos'>
              <img class="materialboxed" :src="photo.base64" :width="photo.head?300:300/4" :height="photo.head?300:300/4" />
          </div>
        </div>
        <div class='infos'>
          <div>
            <like :httpOption="httpOption" :people="user"></like>
            <chat :people="user"></chat>
            <h5><span class='login'>{{user.login}}</span>, <span>{{calculateAge(user.birthday)}} ans</span> <online :id="user.id" :httpOption="httpOption"></online></h5>
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
              <div v-for='tag in tags' @click.prevent.stop :class="{'brown-m': tag.commun}" class='chip'>{{tag.name}}</div>
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
  import config from '../../config'

  export default {
    name: 'User',
    data () {
      return {
        user: {},
        photos: [],
        tags: [],
        id: Number(this.$route.params.id),
        status:0,
        ready: false,
        httpOption: {},
        userId: 0
      }
    },
    mounted () {
      const auth = this.auth()
      if (!auth.success) return;
      this.httpOption = auth.httpOption
      this.userId = auth.decoded.id
      this.$http.get(`${config.api}user/id/${this.id}`, this.httpOption)
        .then(res => {
          return new Promise((resolve, reject) => {
            if (!res.body.success || _.isEmpty(res.body.data)) return reject(res.body.err)
            this.user = res.body.data[0]
            console.log("1 : ", this.user)
            resolve()
          })
        })
        .then(Promise.all([
          this.$http.get(`${config.api}pic/${this.id}`, this.httpOption)
            .then(res => {
              if (!res.body.success) return null
              this.photos = res.body.data
              console.log("2 : ", this.user)
              if (!this.photos.length) {
                this.photos.push({base64: `${config.static_path}/assets/${this.user.sex}-silhouette.jpg`, head: true})
              }
              $(function() {
                $('.materialboxed').materialbox()
              })
            }),
          this.$http.get(`${config.api}tags/${this.id}`, this.httpOption)
            .then(res => {
              if (!res.body.success) return null
              this.tags = res.body.data
              this.tags.forEach(e => {
                this.$set(e, 'commun', false)
              })
            }).then(() => this.$http.get(`${config.api}tags/${this.userId}`, this.httpOption).then(res => {
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
            this.$http.post(`${config.api}visit/${this.id}`, {}, this.httpOption).then(res => {
              if (!res.body.success) return;
            })
        ]))
        .then(() => this.ready = true)
        .catch(() => {
          this.ready = true
          this.errorNotif.display(3500)
        })
        .then(() => this.$socket.emit('online', this.userId))

        this.$options.sockets.user = (users) => {
          let list = []
          for (let elem in users) {
            if (users[elem].id === this.id) {
              return this.status = users[elem].status
            }
          }
          return this.status = 0
        }


    },
    computed: {
      memberSince () {
        return dateformat(this.user.dateCreate, 'dd/mm/yyyy')
      },
      lastConnection () {
        return dateformat(this.user.lastConnection, 'dd/mm/yyyy')
      },
      errorNotif () {
        return new window.Notif("Utilisateur introuvable", 'error')
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

  .img-profil img {
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
    padding: 30px;
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

  .infos .chips {
    margin-top: 30px;
    border-bottom: none;
    max-width: 500px;
  }


</style>
