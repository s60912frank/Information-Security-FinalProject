import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueHead from 'vue-head'

import App from './App'
import Login from './components/login'
import RoomList from './components/roomlist'
import ChatRoom from './components/chatroom'

import './assets/milligram.min.css'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(VueHead)

const routes = [
  { path: '/login', component: Login },
  { path: '/roomList', component: RoomList },
  { path: '/chatRoom', component: ChatRoom }
]

const router = new VueRouter({
  routes // short for routes: routes
})

new Vue({
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
