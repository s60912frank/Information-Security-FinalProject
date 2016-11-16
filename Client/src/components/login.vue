<template>
  <div id="login">
    <h1>登入or註冊</h1>
    <div class="row"><p>帳號</p></div>
    <div class="row">
      <input v-model="username" class="input">
    </div>
    <div class="row"><p>密碼</p></div>
    <div class="row">
      <input v-model="password" type="password" class="input">
    </div> 
    <div class="row" id="btns">
      <button v-on:click="login">登入</button>
    </div>
    <div class="row">
      <button v-on:click="register">註冊</button>
    </div>
    <h3>{{ errorMsg }}</h3>
  </div>
</template>

<script>
import SHA from 'sha256'
export default {
  name: 'login',
  mounted () {
    let jwt = window.localStorage.getItem('jwt')
    if (jwt) {
      this.$http.post('http://localhost:3000/verifyJwt', { token: jwt }).then((res) => {
        if (res.body.valid) {
          this.$router.push('roomList')
        }
      }, (err) => {
        console.log(err)
      })
    }
  },
  data () {
    return {
      username: '',
      password: '',
      errorMsg: ''
    }
  },
  methods: {
    logOrReg (type) {
      if (this.username === '' || this.password === '') {
        this.errorMsg = '帳號或密碼不得為空!'
        return
      }
      let url = 'http://localhost:3000/' + type
      let data = {
        'username': this.username,
        'password': SHA(this.password)
      }
      this.$http.post(url, data).then((res) => {
        if (res.body.error) {
          this.errorMsg = res.body.error
        } else {
          window.localStorage.setItem('jwt', res.body.token)
          window.localStorage.setItem('name', res.body.name)
          console.log('token saved')
          this.$router.push('roomList')
        }
      }, (res) => {
        console.log(res)
      })
    },
    login () {
      this.logOrReg('login')
    },
    register () {
      this.logOrReg('register')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
  .input
    height: 2.5rem
    margin-bottom: 0.5rem
  p
    margin: 0
</style>
