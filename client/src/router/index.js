
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import DashBoard from '../components/DashBoard.vue'
import Followed from '../components/Followed.vue'
import User from '../components/User.vue'
import Profil from '../components/Profil.vue'
import Chat from '../components/Chat.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/dash',
      name: 'dashBoard',
      component: DashBoard
    },
    {
      path: '/followed',
      name: 'followed',
      component: Followed
    },
    {
      path: '/settings/profile',
      name: 'profil',
      component: Profil
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User
    },
    {
      path: '/chat/:id',
      name: 'chat',
      component: Chat
    },
    {
      path: '/signin',
      name: 'signin',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUp
    }
  ]
})
