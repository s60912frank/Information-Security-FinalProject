<template>
  <div id="msgbox" v-on:scroll="scroll">
    <bubble v-for="msg in msgs" v-bind:msg="msg"></bubble>
  </div>
</template>

<script>
import Bubble from './msgbubble'
export default {
  name: 'messageBox',
  mounted () {
    this.$watch('msgs', (n, o) => {
      if (!this.scrolled) {
        this.$el.scrollTop = this.$el.scrollHeight
        this.scrolled = true
      }
    })
  },
  data () {
    return {
      scolled: false
    }
  },
  methods: {
    scroll () {
      if (this.$el.scrollHeight - this.$el.scrollTop <= this.$el.clientHeight) {
        this.scrolled = false
      } else {
        this.scrolled = true
      }
    }
  },
  components: { Bubble },
  props: ['msgs']
}
</script>

<style scoped lang="stylus">
#msgbox
  box-sizing: border-box
  border-radius: 0.5rem
  height: 50rem
  overflow-y: scroll
  background-color: lightblue
  padding-left: 0.5rem
  padding-right: 0.5rem
  margin-left: -0.9rem
  margin-right: -0.9rem
  margin-bottom: 1rem

#msgbox ul li
  list-style-type: none
</style>
