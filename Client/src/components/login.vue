<template>
  <div class="login">
    帳號: <input v-model="username"><br>
    密碼: <input v-model="password" type="password"><br>
    <button v-on:click="login">登入</button>
    <button v-on:click="register">註冊</button>
    <h3>{{ errorMsg }}</h3>
  </div>
</template>

<script>
export default {
  name: 'login',
  mounted () {
    let jwt = window.localStorage.getItem('jwt')
    if (jwt) {
      this.$http.post('http://localhost:3000/verifyJwt', { token: jwt }).then((res) => {
        if (res.body.valid) {
          console.log('token good')
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
      let url = 'http://localhost:3000/' + type
      let data = {
        'username': this.username,
        'password': this.password
      }
      console.log(data)
      this.$http.post(url, data).then((res) => {
        console.log(res.body)
        if (res.body.error) {
          this.errorMsg = res.body.error
        } else {
          // good to go!
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
<style scoped>

</style>
