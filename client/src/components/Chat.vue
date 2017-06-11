<template>
    <defaultLayout :auth="auth">
      <router-link v-if="user.id !== undefined" :to="{name: 'user', params: {id: user.id}}" class='profil'>
        <img :src="user.base64" width=50 height=50 />
        <h5>{{user.login}}</h5>
        <online :id="user.id" :httpOption="newAuth.httpOption"></online>
      </router-link>
      <div id='chat'>
        <div v-for="message in chat" :class="{mine: message.sender === newAuth.decoded.id}" class="message">
          <div :class="{blanco: message.sender === newAuth.decoded.id}"></div>
          <div v-html="commentReplace(message.comment)" class='comment'></div>
          <div :class="{blanco: message.sender !== newAuth.decoded.id}"></div>
        </div>
      </div>
      <div class="comment">
        <textarea v-if="enter" :id="input.name" @keyup.enter="submit" class="materialize-textarea" v-model='input.value' placeholder="Écrivez lui quelque chose..." autofocus></textarea>
        <textarea v-else :id="input.name" class="materialize-textarea" v-model='input.value' placeholder="Écrivez lui quelque chose..." autofocus></textarea>
        <i @click="submit" class="text-blue-m fa fa-paper-plane fa-2x" aria-hidden="true"></i>
      </div>
      <div class='right-align' id='enter'>
        <input type="checkbox" id="checkbox" v-model="enter">
        <label for="checkbox">Entrée pour envoyer</label>
      </div>

    </defaultLayout>
</template>

<script>

  import CONFIG from '../../config/conf.json'
  import defaultLayout from './layout/Default.vue'
  import online from './button/Online.vue'

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
          value: null,
          element: null
        },
        enter: true,
      }
    },
    created () {
      this.newAuth = this.auth()
      if (!this.newAuth.success) return;
      this.$http.get(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, this.newAuth.httpOption).then(res => {
        if (!res.body.success) return this.$router.replace({name: 'dashBoard'})
        this.chat = res.body.data
        $(function() {
          this.element = document.getElementById('chat')
          this.element.scrollTop = this.element.scrollHeight
        })
      })
      .then(() => this.$socket.emit('online', this.newAuth.decoded.id))
      this.$http.get(`${CONFIG.BASEURL_API}user/id/${this.$route.params.id}`, this.newAuth.httpOption).then(res => {
        if (!res.body.success || !res.body.data.length) return this.$router.replace({name: 'dashBoard'})
        this.user = res.body.data[0]
        if (!this.user.base64) {
          this.user.base64 = `src/assets/${this.user.sex}-silhouette.jpg`
        }
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
      submit() {
        if (!this.input.value) return
        this.input.value = this.input.value.replace(/</g, "&lt;").replace(/>/g, "&gt;")
        this.chat.push({comment: this.input.value, sender: this.newAuth.decoded.id})
        this.$http.post(`${CONFIG.BASEURL_API}chat/${this.$route.params.id}`, {comment: this.input.value}, this.newAuth.httpOption).then(res => {
          if (!res.body.success) return this.$router.replace({name: 'dashBoard'})
        })
        this.input.value = null
        $(function() {
          this.element = document.getElementById('chat')
          this.element.scrollTop = this.element.scrollHeight
        })
      },
      commentReplace(comment) {
        return comment.replace('\n', '<br />')
      }
    },
    props: {
      auth: Function
    },
    components: {
      defaultLayout,
      online
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
    padding-right: 70px;
    height: auto;
    -webkit-box-sizing: border-box;
       -moz-box-sizing: border-box;
            box-sizing: border-box;
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

  .comment {
    position: relative;
    /*white-space: pre;
    word-wrap: break-word;*/
  }

  .comment i {
    position: absolute;
    top: 50%;
    transform: translateY(-100%);
    right: 20px;

    cursor: pointer;
  }

  #enter {
    font-size: .2em;
  }

</style>
