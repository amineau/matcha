
<template>
  <div>
    <a class='dropdown-button btn' @click="notifToFalse" data-activates='dropdown1'>
      <i class="fa fa-envelope-o" aria-hidden="true"></i>
      <div class="red">{{notifCount}}</div>
    </a>

    <ul id='dropdown1' class='dropdown-content'>
      <li v-for="notif in notifs">
        <router-link v-if="notif.action == 'VISITED'" to="#">{{notif.user.login}} a visité votre profil</router-link>
        <router-link v-else-if="notif.action == 'LIKED'" to="#">{{notif.user.login}} vous a liké</router-link>
        <router-link v-else-if="notif.action == 'UNLIKED'" to="#">{{notif.user.login}} a retiré son like</router-link>
        <router-link v-else-if="notif.action == 'CHAT'" to="#">{{notif.user.login}} vous a envoyé un message</router-link>
      </li>
    </ul>
  </div>
</template>

<script>

  import CONFIG from '../../config/conf.json'


  export default {
    name: 'dropdown',
    props: {
      auth: Function,
      notifs: Array
    },
    data () {
      return {
        notifCount: 0,
      }
    },
    created () {

    },
    methods: {
      notifToFalse () {
        this.$http.put(`${CONFIG.BASEURL_API}notif`, {}, this.auth().httpOption)
          .then(res => {
            if (!res.body.success) return res.body.err
            this.notifCount = 0
          })
      }
    },
    watch: {
      notifs: function (val) {
        val.forEach(e => e.link.notif ? this.notifCount++ : 0)
        console.log('notifs updated', this.notifCount)
        console.log(val)
      }
    }

  }

</script>
