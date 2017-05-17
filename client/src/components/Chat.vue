<template>
    <defaultLayout :auth="auth">
      <div class='profil'>
        <img :src="user.base64" witdh=50 height=50 />
        <h5>{{user.login}}</h5>
        <i :class="{'orange-text': user.status === 2, 'green-text': user.status === 1, 'grey-text': !user.status}" class="fa fa-circle" aria-hidden="true"></i>
      </div>
      <div id='chat'>
        <div v-for="message in chat" :class="{mine: message.sender === newAuth.decoded.id}" class="message">
          <div :class="{blanco: message.sender === newAuth.decoded.id}"></div>
          <div class='comment'>{{message.comment}}</div>
          <div :class="{blanco: message.sender !== newAuth.decoded.id}"></div>
        </div>
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
        user: {},
        users: {},
        input: {
          name: 'comment',
          type: 'textarea',
          label: false,
          value: null,
          element: null
        }
      }
    },
    created () {
      this.newAuth = this.auth()
      if (!this.newAuth.success) return console.log(this.newAuth.err)
      this.$http.get(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, this.newAuth.httpOption).then(res => {
        if (!res.body.success) return console.log('Erreur lors de l\'obtention des messages', res.body.err)
        this.chat = res.body.data
        $(function() {
          this.element = document.getElementById('chat')
          this.element.scrollTop = this.element.scrollHeight
          console.log(this.element.scrollTop)
        })
      })
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${this.$route.params.id}`, this.newAuth.httpOption).then(res => {
        if (!res.body.success) return console.log(res.body.err)
        this.user = res.body.data[0]
        this.$set(this.user, 'status', false)
        if (!this.user.base64) {
          this.user.base64 = `src/assets/${this.user.sex}-silhouette.jpg`
        }
        this.$on('userUpdate', (users) => {
          console.log(users)
          const list = users.find(e => e.id === this.user.id)
          this.user.status = list ? list.status : 0
        })
      })
      this.$options.sockets.chat = (data) => {
        if (data.recipientId === this.newAuth.decoded.id
         && data.senderId === Number(this.$route.params.id)) {
           this.chat.push({sender: data.senderId, comment: data.comment, timestamp: new Date()})
           $(function() {
             this.element = document.getElementById('chat')
             this.element.scrollTop = this.element.scrollHeight
           })
         }
      }
    },
    methods: {
      submit(data) {
        this.chat.push({comment: data.comment, sender: this.newAuth.decoded.id})
        this.$http.post(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, {comment: data.comment}, this.newAuth.httpOption).then(res => {
          if (!res.body.success) return alert('Erreur lors de l\'obtention des messages')
          this.input.value = null
          $(function() {
            this.element = document.getElementById('chat')
            this.element.scrollTop = this.element.scrollHeight
          })
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

  #chat {
    height: 65vh;
    padding: 10px;
    overflow: auto;
    border-bottom: 1px solid grey
  }

  .profil {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }

  .profil img {
    border-radius: 50%;
  }

  .profil * {
    margin: 5px;
  }

  .message {
    display: flex;
  }

  textarea.materialize-textarea {
    padding: 20px;
  }

  .message div.comment {
    padding: 5px 10px 5px 10px;
    margin: 5px;
    border-radius: 20px;
    max-width: 60%;
    background-color: #34888C;
    color: white;
    word-wrap: break-word;
  }

  .mine .blanco{
    flex: 1;
  }

  .mine div.comment {
    background-color: #CB6318;
    text-align: right;
  }

</style>
