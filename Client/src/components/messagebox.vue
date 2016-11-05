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
        console.log('捲')
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

<style scoped>
#msgbox {
    overflow-y: scroll;
    background-color: lightblue;
    height: 500px;
    width: 80%;
}

#msgbox ul li {
    list-style-type: none;
}
</style>
