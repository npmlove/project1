<template>
  <div class="login_bg">
    <div class="land_logo">
      <div style="margin-left: 30px;">
        <!-- <img src="../../assets/logo.png" style="width: 157px;height: 28px;"/> -->
        <div class="land-logo-img" style="width: 157px;height: 28px;"></div>
      </div>
    </div>
    <div class="login_content">
      <div class="el-total form_list">
        <div class="el-login">账号登录</div>
        <el-form :label-position="labelPosition" label-width="60px" size="medium" class="demo-form-inline">
          <el-form-item label="账号">
            <el-input v-model="form.name" type="text" placeholder="请输入账号" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.pwd" type="password" @keyup.native.enter="onSubmit" placeholder="请输入密码" clearable></el-input>
          </el-form-item>
          <div class="error">{{errorTitle}}</div>
          <div class="list">
            <el-button @click="onSubmit" type="primary">登录</el-button>
          </div>
        </el-form>
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
        labelPosition: 'right',
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
          if (data.code == 200) {
            sessionStorage.setItem('userInfo', JSON.stringify(data.data.tsysUser))
            sessionStorage.setItem('userId', data.data.tsysUser.id)
            sessionStorage.setItem('tokenId', data.data.tokenId)
            var url = vm.$route.query.redirect
            if (url) {
              if (decodeURIComponent(url).includes('redirect=')) {
                vm.$router.push('/routeManagement/routeManage')  
              } else {
                vm.$router.push(url)
              }
            } else {
              vm.$router.push('/routeManagement/routeManage')
            }
          } else {
            this.$message.error(data.message)
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
    background-color: #2273CE;
    height: 64px;
    display: flex;
    align-items: center;
  }
  .login_content {
    width: 386px;
    height: 360px;
    position: absolute;
    top: 50%;
    margin-top: -200px;
    background-color: #FFF;
    right: 12%;
    // border-radius: 10px;
  }

  .land-logo-img{
    background-image: url(../../assets/logo.svg);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }

  .el-login {
    font-size: 20px;
    color: #FFF;
    text-align: center;
    font-weight: 500;
    padding: 35px 0;
    background-color: #2273CE;
  }

  .el-form {
    width: 320px;
    margin: 0 auto;
    margin-top: 40px;
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
    background-color: #2273CE;
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
    margin-bottom: 20px;
  }
</style>
