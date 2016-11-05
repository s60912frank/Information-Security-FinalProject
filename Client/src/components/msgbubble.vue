<template>
  <div id="bubble" v-bind:class="{ 'me': isMe, 'other': !isMe }">
    <p id="name">{{ msg.name }}</p>
    <div>{{ msg.msg }}</div>
    <p id="time">{{ msg.time }}</p>
  </div>
</template>

<script>
export default {
  name: 'bubble',
  mounted () {
    this.msg.time = this.formatTime(this.msg.time)
    this.isMe = this.msg.name === window.localStorage.getItem('name')
  },
  props: ['msg'],
  data () {
    return {
      isMe: false
    }
  },
  methods: {
    formatTime (raw) {
      let time = new Date(raw)
      let h = (time.getHours() < 10) ? '0' + time.getHours().toString() : time.getHours()
      let m = (time.getMinutes() < 10) ? '0' + time.getMinutes().toString() : time.getMinutes()
      return h + ':' + m
    }
  }
}
</script>

<style scoped lang="stylus">
#bubble
  margin-top: 1rem
  margin-bottom: 1rem
  border: 1px solid black
  display: flex
  flex-direction: row;
  flex-wrap: wrap;

#bubble div
  border-radius: 1rem
  padding: 0.5rem
  margin: 0
  max-width: 60%
  word-break: break-all

p
  margin: 0

#name
  flex: 0 1 100%
  justify-content: flex-end

#time
  align-self: flex-end

.me
  justify-content: flex-end
  & div
    background-color: orange  

.other
  justify-content: flex-start
  & div
    background-color: lightgray
</style>
