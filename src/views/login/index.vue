<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="14">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
        <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left">
          <div class="title-tips">欢迎来到{{ title }}！</div>
          <el-form-item style="margin-top: 40px" prop="UserName">
            <span class="svg-container svg-container-admin">
              <vab-icon :icon="['fas', 'user']" />
            </span>
            <el-input v-model.trim="form.UserName" v-focus placeholder="请输入用户名" tabindex="1" type="text" />
          </el-form-item>
          <el-form-item prop="Password">
            <span class="svg-container">
              <vab-icon :icon="['fas', 'lock']" />
            </span>
            <el-input :key="passwordType" ref="password" v-model.trim="form.Password" :type="passwordType" tabindex="2" placeholder="请输入密码" @keyup.enter.native="handleLogin" />
            <span v-if="passwordType === 'password'" class="show-password" @click="handlePassword" >
              <vab-icon :icon="['fas', 'eye-slash']"></vab-icon>
            </span>
            <span v-else class="show-password" @click="handlePassword">
              <vab-icon :icon="['fas', 'eye']"></vab-icon>
            </span>
          </el-form-item>
          <el-button :loading="loading" class="login-btn" type="primary" @click="handleLogin" >
            登录
          </el-button>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { isPassword } from '@/utils/validate'
  import { getSysMenus } from '@/api/user'

  export default {
    name: 'Login',
    directives: {
      focus: {
        inserted(el) {
          el.querySelector('input').focus()
        },
      },
    },
    data() {
      const validateusername = (rule, value, callback) => {
        if ('' == value) {
          callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        // if (!isPassword(value)) {
        //   callback(new Error('密码不能少于6位'))
        // } else {
        callback()
        // }
      }
      return {
        nodeEnv: process.env.NODE_ENV,
        title: '车辆监控系统',
        form: {
          UserName: '',
          Password: '',
        },
        rules: {
          UserName: [
            {
              required: true,
              trigger: 'blur',
              validator: validateusername,
            },
          ],
          Password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created() {
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
    },
    mounted() {
      this.form.UserName = 'admin'
      this.form.Password = '12673'
      this.form.appver = ''
    },
    methods: {
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/login', this.form)
              .then(() => {
                let params = {
                  CallType: '',
                  UserID: sessionStorage.getItem('UserID'),
                }
                this.getSysMenu(params)


                // const routerPath = this.redirect === '/404' || this.redirect === '/401' ? '/' : this.redirect
                // console.log(routerPath)
                // this.$router.push(routerPath).catch(() => {})
                // this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      //获取系统菜单
      async getSysMenu(params) {
        // console.log('登录成功后，获取菜单：')
        // console.log(await getSysMenus(params))
        const result = await getSysMenus(params)
        if(result.Status == 0){

          // const routerPath = this.redirect === '/404' || this.redirect === '/401' ? '/' : this.redirect
          // console.log(routerPath)
          // console.log(this.$router)
          // this.$router = []
          // this.$router.push(routerPath).catch(() => {})
          // this.$router.push('/').catch(() => {})
          this.loading = false

          sessionStorage.setItem('menu',JSON.stringify(result.Data))
          // var url = this.$route.query.redirect
            // console.log(url)
            // if(url){
            //   this.$router.push(url)
            // }else{
              this.$router.push('/')
            // }
        }

      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    // background: url('~@/assets/login_images/background.jpg') center center fixed no-repeat;
    background: url('~@/assets/bg.png') center center fixed no-repeat;
    background-size: cover;

    .title {
      font-size: 54px;
      font-weight: 500;
      color: rgba(14, 18, 26, 1);
    }

    .title-tips {
      margin-top: 29px;
      font-size: 30px;
      font-weight: 400;
      color: rgba(14, 18, 26, 1);
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      color: #1677FF;
    }

    .login-btn {
      font-size: 20px;
      display: inherit;
      // width: 220px;
      width: 100%;
      height: 50px;
      margin-top: 80px;
      border: 0;
      border-radius: 5px;
      background-color: #1677FF;

      &:hover {
        opacity: 0.9;
      }
    }

    .login-form {
      position: relative;
      max-width: 100%;
      margin: calc((100vh - 425px) / 2) 10% 10%;
      overflow: hidden;

      width: 400px;


      .forget-password {
        width: 100%;
        margin-top: 40px;
        text-align: left;

        .forget-pass {
          width: 129px;
          height: 19px;
          font-size: 20px;
          font-weight: 400;
          color: rgba(92, 102, 240, 1);
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      // top: 14px;
      top: 10px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 18px;
      // color: #c7cdd1;
      color: #999;
      cursor: pointer;
      user-select: none;
    }

    .show-password {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
    }

    ::v-deep {
      .el-form-item {
        padding-right: 0;
        margin: 20px 0;
        color: #454545;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 2px;

        &__content {
          min-height: $base-input-height;
          line-height: $base-input-height;
        }

        &__error {
          position: absolute;
          top: 100%;
          left: 18px;
          font-size: $base-font-size-small;
          line-height: 18px;
          color: $base-color-red;
        }
      }

      .el-input {
        box-sizing: border-box;

        input {
          // height: 58px;
          height: 50px;
          padding-left: 45px;
          font-size: $base-font-size-default;
          line-height: 50px;
          color: $base-font-color;
          // background: #f6f4fc;
          background-color: #FFFFFF;
          // border: 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          caret-color: $base-font-color;
        }
      }
    }
  }
</style>
