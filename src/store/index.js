import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import financial from './modules/financial'
import common from './modules/common'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    financial,
    common,
  }
})

export default store