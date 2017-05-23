<template>
  <defaultLayout :auth="auth">

    <div v-if='ready' class="collection">
       <router-link v-for="message in messages" :key="message.id" :to="{name: 'chat', params: {id: message.user.id}}" class="collection-item avatar">
         <img :src="message.user.base64" alt="" class="circle">
         <span class="title">{{message.user.login}} <online :id="message.user.id"></online></span>
         <p>{{message.chat.comment}}</p>
       </router-link>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import online from './button/Online.vue'
  import CONFIG from '../../config/conf.json'

  export default {
    name: 'Message',
    data () {
      return {
        messages: [],
        ready: false,
        id: null,
        httpOption: {}
      }
    },
    props: {
      auth: Function
    },
    created () {
      const auth = this.auth()
      if (!auth.success) return console.log(auth.err)
      this.id = auth.decoded.id
      this.httpOption = auth.httpOption
      this.$http.get(`${CONFIG.BASEURL_API}chat`, this.httpOption)
        .then(res => {
          if (!res.body.success) return console.log(res.body.err)
          this.messages = res.body.data
          let promises =[]
          console.log(this.messages)
          this.messages.forEach(e => {
            promises.push(this.getUser(e))
          })
          Promise.all(promises)
            .then(() => this.ready = true)
        })
        .then(() => this.$socket.emit('online', this.id))
    },
    methods: {
      getUser (message) {
        console.log('message',message)
        const id = message.users.find(e => e !== this.id)
        return this.$http.get(`${CONFIG.BASEURL_API}user/id/${id}`, this.httpOption)
          .then(res => {
            if (!res.body.success) return console.log(res.body.err)
            this.$set(message, 'user', res.body.data[0])
          })
      }
    },
    components: {
      defaultLayout,
      online
    }
  }

</script>

<style>


</style>
