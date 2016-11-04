<template>
  <div id="chatroom">
    <h1>{{ roomName }}</h1>
    <input v-model="msgInput" @keyup.enter="send">
    <button @click="send">送出</button>
    <ul>
      <li v-for="msg in messages">
        <bubble v-bind:msg="msg"></bubble>
      </li>
    </ul>
  </div>
</template>

<script>
import { CryptoJS, JsonFormatter } from 'node-cryptojs-aes'
import Bubble from './msgbubble'

export default {
  name: 'chatRoom',
  components: { Bubble },
  mounted () {
    if (!window.localStorage.getItem('jwt')) {
      this.$router.push('login')
    }
    if (!window.socket) {
      this.$router.push('roomList')
    }
    this.name = window.localStorage.getItem('name')
    this.socket = window.socket // need error handling
    this.socket.emit('joinRoom', this.$route.query.id)
    this.listeners(this.socket)
  },
  data () {
    return {
      socket: {},
      roomName: '',
      messages: [],
      key: '',
      msgInput: '',
      name: ''
    }
  },
  methods: {
    listeners (socket) {
      socket.on('room', (data) => {
        console.log(data)
        this.roomName = data.name
        this.key = data.key
        let decryptedMsgs = []
        for (let i = 0; i < data.history.length; i++) {
          let msg = this.decryptMsg(data.history[i])
          // decryptedMsgs.push(msg.name + ':' + msg.msg + '(' + msg.time + ')')
          decryptedMsgs.push(msg)
        }
        this.messages = decryptedMsgs
      })

      socket.on('msg', (data) => {
        let msg = this.decryptMsg(data)
        // this.messages.push(msg.name + ':' + msg.msg + '(' + msg.time + ')')
        this.messages.push(msg)
      })
    },
    send () {
      console.log(this.msgInput)
      if (this.msgInput !== '') {
        let msgToSend = {
          'name': this.name,
          'msg': this.msgInput,
          'time': new Date()
        }
        this.socket.emit('msg', this.encryptMsg(JSON.stringify(msgToSend)))
        this.msgInput = ''
      }
    },
    encryptMsg (msg) {
      let encrypted = CryptoJS.AES.encrypt(msg, this.key, { format: JsonFormatter }).toString()
      console.log('enc: ' + encrypted)
      return encrypted
    },
    decryptMsg (msg) {
      let decrypt = CryptoJS.AES.decrypt(msg, this.key, { format: JsonFormatter })
      let decryptedStr = ''
      try {
        decryptedStr = CryptoJS.enc.Utf8.stringify(decrypt)
      } catch (e) {

      } finally {
        if (decryptedStr === '') {
          decryptedStr = '!!無法解密訊息!!'
        }
      }
      return JSON.parse(decryptedStr)
    }
  }
}
</script>

<style>
</style>
