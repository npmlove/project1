// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import http from '@/util/http'
import serviceAPI from '@/service/index'

import Blob from '@/vendor/Blob'
import Export2Excel from '@/vendor/Export2Excel.js'
import '@/vendor/directives3'


//import pinyin from 'js-pinyin'
import '@/assets/reset.css'
import { Col, Row, Button, Switch,
  Table, DatePicker, Menu, MenuItem,
  Submenu, Form, FormItem, Input,
  TableColumn, Pagination, Checkbox,
  Radio, RadioGroup, Select, Option,
  Dialog, Badge, Upload,
  Breadcrumb, BreadcrumbItem, Tree,
  CheckboxGroup, Steps, Step, Scrollbar, Tabs, tabPane, Popover, Collapse, CollapseItem,
  Timeline, TimelineItem, Image, Message, Divider, TimePicker, Tag, Cascader, Carousel, CarouselItem, InputNumber, Card,
  MessageBox, Autocomplete
} from 'element-ui'
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.use(Col)
Vue.use(Row)
Vue.use(Button)
Vue.use(Table)
Vue.use(DatePicker)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(Submenu)
Vue.use(Switch)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Badge)
Vue.use(Upload)
Vue.use(InputNumber)
Vue.use(Scrollbar)
Vue.use(Step)
Vue.use(Steps)
Vue.use(Autocomplete)
Vue.use(Tag)
Vue.use(CheckboxGroup)
import '@/assets/icon/iconfont.css'
import '@/assets/custom.css'



Vue.config.productionTip = false
Vue.prototype.$message = Message
Vue.prototype.$service = serviceAPI
Vue.prototype.inputMax = 50
Vue.prototype.imgUrl = 'http://121.5.49.152'

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
  store,
  components: { App },
  template: '<App/>'
})
