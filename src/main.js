import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins'
import '@/layouts/export'
import directive from './utils/directives'

import VideoPlayer from 'vue-video-player'
import 'vue-video-player/src/custom-theme.css'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls.js/src/videojs.hlsjs'

//导入百度地图
import BaiduMap from 'vue-baidu-map'
//导入 修改的样式
import '@/styles/common.css'

Vue.use(VideoPlayer)

//导入百度地图
Vue.use(BaiduMap, {
  ak: 'R9EvGaxGinZsKvBFm0YfmesrUq4dGaES'
})

/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 生产环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('@/utils/static')
//   mockXHR()
// }

// Vue.config.productionTip = false

//自定义指令注册到全局使用
Object.keys(directive).forEach((fncName) => {
  Vue.directive(fncName, directive[fncName])
})


new Vue({
  el: '#vue-admin-beautiful',
  router,
  store,
  render: (h) => h(App),
})
