<template>
    <defaultLayout :auth="auth">

      <div v-for="message in chat">
        <div>{{message.sender}} a dit :<br/>{{message.comment}}</div>
      </div>
      <formInputs :inputs="[input]" :submit="submit" button="Envoyer"></formInputs>

    </defaultLayout>
</template>

<script>

  import CONFIG from '../../config/conf.json'
  import defaultLayout from './layout/Default.vue'
  import formInputs from './Form.vue'

  export default {
    name: 'Chat',
    data () {
      return {
        newAut: {},
        chat: [],
        input: {
          name: 'comment',
          type: 'textarea',
          label: false,
          value: null
        }
      }
    },
    created () {
      this.newAuth = this.auth()
      if (!this.newAuth.success) return console.log(this.newAuth.err)
      this.$http.get(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, this.newAuth.httpOption).then(res => {
        if (!res.body.success) return alert('Erreur lors de l\'obtention des messages')
        this.chat = res.body.data
      })
      this.$options.sockets.chat = (data) => {
        if (data.recipientId === this.newAuth.decoded.id
         && data.senderId === Number(this.$route.params.id)) {
           this.chat.push({sender: data.senderId, comment: data.comment, timestamp: new Date()})
         }
      }
    },
    methods: {
      submit(data) {
        this.chat.push({comment: data.comment, sender: this.newAuth.decoded.id})
        this.$http.post(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, {comment: data.comment}, this.newAuth.httpOption).then(res => {
          if (!res.body.success) return alert('Erreur lors de l\'obtention des messages')
          this.input.value = null
        })
      }
    },
    props: {
      auth: Function
    },
    components: {
      defaultLayout,
      formInputs
    }
  }

</script>

<style>


</style>
