
<template>
  <div>
    <a class='dropdown-button notif' data-activates='dropdown1' @click='notifToFalse'>
      <i class="fa fa-bell-o" aria-hidden="true"></i>
      <div :class="{pulse: notifCount}" class="btn btn-floating brown-m">{{notifCount}}</div>
    </a>

    <ul id='dropdown1' class='dropdown-content'>
      <li v-for="notif in notifs" :class="{'new': notif.link.notif}">
        <router-link :to="{name: notif.action==='CHAT'?'chat':'user', params: {id: notif.id}}"  class="valign-wrapper">
          <img :src="notif.base64" width=50 height=50/><div>{{textNotif(notif)}}</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>

  import CONFIG from '../../config/conf.json'
  import _ from 'lodash'

  export default {
    name: 'dropdown',
    props: {
      auth: Function
    },
    data () {
      return {
        notifCount: 0,
        httpOption: null,
        notifs: [],
        new: {}
      }
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.err)
      this.httpOption = auth.httpOption
      this.loadNotifs(true)
      this.$options.sockets.notif = (id) => {
        if (id === auth.decoded.id) {
          this.loadNotifs()
        }
      }
      $(function() {
        $('.dropdown-button').dropdown({
         inDuration: 300,
         outDuration: 225,
         constrainWidth: false, // Does not change width of dropdown to that of the activator
         hover: false, // Activate on hover
         gutter: 0, // Spacing from edge
         belowOrigin: true, // Displays dropdown below the button
         alignment: 'left', // Displays dropdown with edge aligned to the left of button
         stopPropagation: true // Stops event propagation
       })
      })
    },
    methods: {
      notifToFalse () {
        this.$http.put(`${CONFIG.BASEURL_API}notif`, {}, this.auth().httpOption)
          .then(res => {
            if (!res.body.success) return res.body.err
            this.notifCount = 0
          })
      },
      loadNotifs (first = false) {
        this.notifCount = 0
        this.$http.get(`${CONFIG.BASEURL_API}notif`, this.httpOption)
          .then(res => {
            if (!res.body.success) return console.log(res.body.err)
            res.body.data.forEach(e => e.link.notif ? this.notifCount++ : null)
            if (!_.isEqual(this.notifs, res.body.data) && !first) {
              console.log(this.notifs, res.body.data)
              this.new = this.textNotif(res.body.data[0])
              this.newNotif.display(3500)
            }
            this.notifs = res.body.data
          })
      },
      textNotif (notif) {
        if (notif.action === 'VISITED') {
          return `${notif.login} a visité votre profil`
        } else if (notif.action === 'LIKED') {
          return `${notif.login} vous a liké`
        } else if (notif.action === 'UNLIKED') {
          return `${notif.login} a retiré son like`
        } else if (notif.action === 'CHAT') {
          return `${notif.login} vous a envoyé un message`
        }
      }
    },
    computed: {
      newNotif () {
        return new window.Notif(this.new, 'confirmed')
      },
      errorNotif () {
        return new window.Notif("Inscription échouée... Veuillez remplir les champs incorrects", 'error')
      }
    },
  }

</script>

<style>

  .dropdown-content li.new:hover {
    background-color: white;
  }
  .dropdown-content li.new {
    background-color: #eee;
  }

  .dropdown-content {
    max-height: 400px;
  }

  .dropdown-content li>a {
    display: flex;
  }

  .dropdown-content li>a img {
    border-radius: 50%;
    margin-right: 10px;
  }

  .notif {
    position: relative;
  }

  .notif div {
    position: absolute;
    top: 15px;
    right: 12px;
    border-radius: 50%;
    height: 15px;
    line-height: 15px;
    width: 15px;
    text-align: center;
    font-size: 0.6em
  }

  .notif i {
    height: auto;
  }

</style>
