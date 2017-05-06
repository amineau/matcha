
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../components/Home.vue'
import DashBoard from '../components/DashBoard.vue'
import User from '../components/User.vue'
import SignIn from '../components/SignIn.vue'
import SignUp from '../components/SignUp.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/dash',
      name: 'DashBoard',
      component: DashBoard
    },
    {
      path: '/user',
      name: 'User',
      component: User
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    }
  ]
})
