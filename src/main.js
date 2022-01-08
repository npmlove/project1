// import Vue from 'vue'
const Vue = require("vue")

import App from './App'
import router,{resetRouter} from './router'
import http from '@/util/http'
import serviceAPI from '@/service/index'
import '@/vendor/directives3'
import {constantRoutes,asyncRoutes} from "@/router/config"
import {filterAsyncRoutes,whiteList} from "@/util/permission"

import '@/assets/icon/iconfont.css'
import '@/assets/custom.css'
import '@/assets/reset.css'
import '@/assets/styles/common.less'

Vue.config.productionTip = false
// Vue.prototype.$message = Message
Vue.prototype.$service = serviceAPI
Vue.prototype.inputMax = 50
Vue.prototype.imgUrl = ''
// Vue.prototype.$confirm = MessageBox.confirm
//判断是否登录
router.beforeEach(function (to, from, next) {
  if (whiteList.includes(to.path)) {
    //从cookie中获取用户信息，判断是否已登录
    var tokenId = sessionStorage.getItem('tokenId')
    // console.log(UserID)
    if (tokenId) {
      if(router.options.routes.length>3) {
        next()
      }else{
        /******权限******/
        const {loginName,roleName} = JSON.parse(sessionStorage.getItem('userInfo'))
        let currentRoutes = []
        // admin show all
        if(loginName ==='admin'){
          currentRoutes = asyncRoutes
        }else{
          const roles = [roleName]
          currentRoutes = filterAsyncRoutes(asyncRoutes,roles)
          // currentRoutes = asyncRoutes
        }
        router.options.routes = constantRoutes.concat([...currentRoutes])  // menu
        resetRouter()  
        router.addRoutes([...currentRoutes])
        /******权限******/
        next({...to});
      }
    } else {
      //未登录
      //next可以传递一个路由对象作为参数 表示需要跳转到的页面
      router.replace({
        path: '/',
        query: {redirect: to.fullPath}
      })
    }

  }else{
    if(to.path === "/" || to.path === "/login") {
      sessionStorage.clear()
      router.options.routes = constantRoutes
    }
    next()
  }
});




Vue.use(http)

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
