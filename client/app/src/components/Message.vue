<template>
  <defaultLayout :auth="auth">

    <div v-if='ready' class="collection">
       <router-link v-for="message in messages" :key="message.id" :to="{name: 'chat', params: {id: message.user.id}}" class="collection-item avatar">
         <img :src="message.user.base64" alt="" class="circle">
         <span class="title">{{message.user.login}} <online :id="message.user.id" :httpOption="httpOption"></online></span>
         <p>{{message.chat.comment}}</p>
       </router-link>
     </div>

  </defaultLayout>
</template>

<script>

  import defaultLayout from './layout/Default.vue'
  import online from './button/Online.vue'
  import config from '../../config'

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
      if (!auth.success) return;
      this.id = auth.decoded.id
      this.httpOption = auth.httpOption
      this.$http.get(`${config.api}chat`, this.httpOption)
        .then(res => {
          if (!res.body.success) return;
          this.messages = res.body.data
          let promises =[]
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
        const id = message.users.find(e => e !== this.id)
        return this.$http.get(`${config.api}user/id/${id}`, this.httpOption)
          .then(res => {
            if (!res.body.success) return;
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
