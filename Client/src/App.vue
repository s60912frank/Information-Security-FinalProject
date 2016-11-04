<template>
  <div id="app">
    <h1>嗨!</h1>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    console.log('ok!')
    this.$router.push('login')
  }
}
</script>

<style>
</style>
