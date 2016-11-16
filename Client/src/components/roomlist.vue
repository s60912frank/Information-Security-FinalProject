<template>
  <div id="roomList">
    房間名稱:<input v-model="roomName">
    <button @click="addRoom">新建房間!</button>
    <button @click="logout">登出</button>
    <ul>
      <li v-for="room in listRoom">
        <router-link :to="{ path: 'chatRoom', query: { id: room._id }}">
          {{ room.name }}({{ room._id }})
        </router-link>
        <button v-if='room.owner == name' @click="delRoom" :id="room._id">X</button>
      </li>
    </ul>
  </div>
</template>

<script>
import io from 'socket.io-client'
export default {
  name: 'roomList',
  mounted () {
    if (!window.localStorage.getItem('jwt')) {
      this.$router.push('login')
    }
    this.name = window.localStorage.getItem('name')
    delete (window.socket)
    window.socket = io.connect('http://localhost:3000', { 'query': 'token=' + window.localStorage.getItem('jwt') })
    this.socket = window.socket
    this.socket.emit('getRoomList')
    this.listeners(this.socket)
  },
  data () {
    return {
      listRoom: [],
      roomName: '',
      socket: {},
      name: ''
    }
  },
  methods: {
    addRoom () {
      this.socket.emit('createRoom', { name: this.roomName })
    },
    listeners (socket) {
      socket.on('room', (data) => {
        this.listRoom.push(data)
      })

      socket.on('roomList', (data) => {
        this.listRoom = data
      })
    },
    logout () {
      window.localStorage.removeItem('jwt')
      window.localStorage.removeItem('name')
      delete (window.socket)
      this.$router.push('login')
    },
    delRoom (e) {
      this.socket.emit('deleteRoom', { name: e.target.id })
    }
  }
}
</script>

<style>
</style>
