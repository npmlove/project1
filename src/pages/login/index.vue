<template>
  <div class="login_bg">
    <div class="land_logo"></div>
    <div class="login_content">
      <div class="el-total form_list">
        <div class="el-login">系统</div>
        <div class="list-item">
          <div class="list">
            <img mode="aspectFit" src="../../assets/zhanghao@2x.png" />
            <input v-model="form.name" class="input" type="text" placeholder="请输入账号" />
          </div>
          <div class="list">
            <img src="../../assets/mima@2x.png" />
            <input v-model="form.pwd" class="input" type="password" placeholder="请输入密码" />
          </div>
          <div class="error">{{errorTitle}}</div>
          <div class="list">
            <el-button @click="onSubmit" type="primary">登录</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    toData
  } from '@/util/assist'
  export default {
    data() {
      return {
        form: {
          name: '',
          pwd: '',
          yzm: ''
        },
        flag: true,
        errorTitle: ''
      }
    },
    methods: {
      onSubmit() {
        const vm = this
        if (vm.form.name === '' || vm.form.pwd === '') {
          vm.errorTitle = '账号或密码不能为空！'
          vm.flag = false
          return
        }
        this.flag = true
        var data = {
          loginName: vm.form.name,
          password: vm.form.pwd
        }
        data = toData(data)
        vm.$http.get(this.$service.login + '?' + data).then(data => {
          console.log(data.code)
          if (data.code == 200) {
            sessionStorage.setItem('userInfo', JSON.stringify(data.data.tsysUser))
            sessionStorage.setItem('userId', data.data.tsysUser.id)
            sessionStorage.setItem('tokenId', data.data.tokenId)
            var url = vm.$route.query.redirect
            // console.log(url)
            if (url) {
              vm.$router.push(url)
            } else {
              vm.$router.push('/adminUser/homePage')
            }
          } else {
            vm.errorTitle = data.Message
            vm.flag = false
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .login_bg {
    width: 100%;
    height: calc(100vh);
    min-width: 1200px;
    background-size: cover;
    background-image: url(../../assets/login_bg.png);
    position: relative;
  }

  .land_logo {
    display: flex;
    padding: 22px;
    padding-bottom: 0;
  }

  .land_logo>div.logo-ziti {
    font-size: 18px;
    font-weight: 500;
    color: rgba(246, 246, 246, 1);
    height: 32px;
    // line-height: 32px;
    margin-left: 20px;
    // background-image: url(../../assets/MES@2x.png);
    background-size: contain;
    background-repeat: no-repeat;
    width: 120px;
    background-position: center;
    height: 48px;
  }

  .login_content {
    width: 386px;
    height: 400px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    background-color: #FFF;
    right: 12%;
    border-radius: 10px;
  }

  .el-login {
    font-size: 24px;
    color: #00A06E;
    text-align: center;
    font-weight: 500;
    padding: 45px 0;
  }

  .el-form {
    width: 320px;
    margin: 0 auto;
  }

  .el-button {
    width: 100%;
  }

  .el-tishi {
    width: 320px;
    height: 29px;
    background-color: #FBE9E9;
    margin-bottom: 6px;
    color: #DC2424;
    line-height: 29px;
    font-size: 14px;
  }

  .form_list .list-item {
    margin: 0 33px;
  }

  .form_list .list-item .list {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    margin-bottom: 20px;
  }

  .form_list .list-item .list img {
    position: absolute;
    left: 10px;
    width: 24px;
    height: 24px;
  }

  .form_list .list-item .list .input {
    border: 1px solid #DCDCDC;
    height: 40px;
    padding-left: 44px;
    padding-right: 10px;
    font-size: 15px;
    width: 100%;
    border: 1px solid rgba(205, 205, 205, 1);
    border-radius: 5px;
  }

  .form_list .list .btn {
    width: 100%;
    height: 40px;
    background-color: #00A06E;
    color: #FFF;
    font-size: 15px;
    border-radius: 5px;
    text-align: center;
    line-height: 40px;
  }

  .hd {
    visibility: hidden;
  }

  .error {
    color: #F00;
    font-size: 14px;
    margin-top: -15px;
    height: 20px;
    margin-bottom: 50px;
  }
</style>
