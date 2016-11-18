<template>
  <div id="chatroom">
    <div class="row" id="title">
      <h1>{{ roomName }}</h1>
      <router-link to="roomList" id="back">回房間列表</router-link>
    </div>
    <messageBox v-bind:msgs="messages"></messageBox>
    <div class="row">
      <textarea id="inputbox" v-model="msgInput" @keypress.enter="send"></textarea>
      <button @click="send">送出</button>
    </div>
  </div>
</template>

<script>
import { CryptoJS, JsonFormatter } from 'node-cryptojs-aes'
import Bubble from './msgbubble'
import MessageBox from './messagebox'

export default {
  name: 'chatRoom',
  components: { Bubble, MessageBox },
  mounted () {
    if (!window.localStorage.getItem('jwt')) {
      this.$router.push('login')
    }
    if (!window.socket) {
      this.$router.push('roomList')
    }
    this.roomId = this.$route.query.id
    this.name = window.localStorage.getItem('name')
    this.socket = window.socket // need error handling
    this.socket.emit('joinRoom', this.roomId)
    this.listeners(this.socket)
  },
  data () {
    return {
      socket: {},
      roomName: '',
      roomId: '',
      messages: [],
      key: '',
      msgInput: '',
      name: ''
    }
  },
  methods: {
    listeners (socket) {
      socket.on('room', (data) => {
        this.roomName = data.name
        this.key = data.key
        let decryptedMsgs = []
        for (let i = 0; i < data.history.length; i++) {
          let msg = this.decryptMsg(data.history[i])
          decryptedMsgs.push(msg)
        }
        this.messages = decryptedMsgs
      })

      socket.on('msg', (data) => {
        let msg = this.decryptMsg(data)
        this.messages.push(msg)
      })

      socket.on('roomRemoved', (data) => {
        if (data.id === this.roomId) {
          window.alert('系統提示:房間已由創建者刪除')
          this.$router.push('roomList')
        }
      })
    },
    send () {
      if (this.msgInput.trim() !== '') {
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
          let error = {
            msg: '!!無法解密訊息!!',
            name: 'unknown',
            time: new Date()
          }
          decryptedStr = JSON.stringify(error)
        }
      }
      return JSON.parse(decryptedStr)
    }
  }
}
</script>

<style scoped lang="stylus">
  #title
    margin-bottom: 0.5rem
    display: flex
    justify-content: space-between
  #back
    align-self: flex-end
    font-size: 2rem
  #inputbox
    margin-right 1rem
</style>
