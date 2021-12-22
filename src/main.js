// import Vue from 'vue'
const Vue = require("vue")

import App from './App'
import router,{resetRouter} from './router'
import http from '@/util/http'
import serviceAPI from '@/service/index'
import '@/vendor/directives3'
import {constantRoutes,asyncRoutes} from "@/router/config"
import {filterAsyncRoutes} from "@/util/permission"

import '@/assets/icon/iconfont.css'
import '@/assets/custom.css'
import '@/assets/reset.css'

Vue.config.productionTip = false
// Vue.prototype.$message = Message
Vue.prototype.$service = serviceAPI
Vue.prototype.inputMax = 50
Vue.prototype.imgUrl = ''
// Vue.prototype.$confirm = MessageBox.confirm
//判断是否登录
router.beforeEach(function (to, from, next) {
  if (to.meta.needLogin) {
    //从cookie中获取用户信息，判断是否已登录
    var tokenId = sessionStorage.getItem('tokenId')
    // console.log(UserID)
    if (tokenId) {
      next(); //表示已经登录
    } else {
      //未登录
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      router.replace({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }

  }else{
    next(); //表示已经登录
  }
});




Vue.use(http)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
