import Vue from 'vue'

// 添加全局组件
import Components from '@/components/global'
Object.keys(Components).forEach(key => {
  Vue.component(key, Components[key])
})

// 添加全局方法
import Utils from '@/utils'
Vue.prototype.$utils = Object.keys(Utils).reduce((obj, key) => {
  obj[key] = Utils[key]
  return obj
}, {})
