
<template>
  <div>
    <a class='dropdown-button btn' @click="notifToFalse" data-activates='dropdown1'>
      <i class="fa fa-bell-o" aria-hidden="true"></i>
      <div class="red">{{notifCount}}</div>
    </a>

    <ul id='dropdown1' class='dropdown-content'>
      <li v-for="notif in notifs" :class="{new: notif.link.notif}">
        <router-link :to="{name: 'user', params: {id: notif.id}}">{{textNotif(notif)}}</router-link>
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
      $(function() {
        $('.dropdown-button').dropdown({
         inDuration: 300,
         outDuration: 225,
         constrainWidth: false, // Does not change width of dropdown to that of the activator
         hover: false, // Activate on hover
         gutter: 0, // Spacing from edge
         belowOrigin: true, // Displays dropdown below the button
         alignment: 'left', // Displays dropdown with edge aligned to the left of button
         stopPropagation: false // Stops event propagation
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
    watch: {
      notifs: function (val) {
        val.forEach(e => e.link.notif ? this.notifCount++ : 0)
        console.log('notifs updated', this.notifCount)
        console.log(val)
      }
    }

  }

</script>

<style>

  .new {
    background-color: #eee;
  }

  .dropdown-content {
    max-height: 200px;
  }

</style>
