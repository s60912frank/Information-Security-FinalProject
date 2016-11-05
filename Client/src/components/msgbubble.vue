<template>
  <div id="bubble" v-bind:class="{ 'me': isMe, 'other': !isMe }">
    <div>
      <div id="namecontainer">
        <p>{{ msg.name }}</p>
      </div>
      <div id="msgandtime">
        <div>{{ msg.msg }}</div>
        <p>{{ msg.time }}</p>
      </div>
    </div>
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
  display: flex
  & > div
    max-width: 60%
    display: inline-block

p
  margin: 0

.other
  justify-content: flex-start
  & div div
    flex-direction: row
    & div
      background-color: lightgray

.me
  justify-content: flex-end
  & div div
    flex-direction: row-reverse
    & div
      background-color: orange

#msgandtime
  display: flex
  & div
    border-radius: 1rem
    padding: 0.5rem
    margin: 0
    word-break: break-all
    color: black
  & p
    align-self: flex-end

#namecontainer
  display: flex
</style>
