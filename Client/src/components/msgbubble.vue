<template>
  <div id="bubble">
    <p>{{ msg.name }}</p><br>
    <div>
      {{ msg.msg }}
    </div>
    <p>{{ msg.time }}</p>
  </div>
</template>

<script>
export default {
  name: 'bubble',
  mounted () {
    this.msg.time = this.formatTime(this.msg.time)
  },
  props: ['msg'],
  data () {
    return {
      // username: '',
      // msg: '',
      // time: ''
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

<style>
#bubble div {
  background-color: orange;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: inline-block;
  width: 200px;
  word-break: break-all;
}
p {
  display: inline-block;
}
</style>
