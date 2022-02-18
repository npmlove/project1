import http from '@/util/http'
import serviceAPI from '@/service/index'
export default {
  state: {
    expenseCodeOpt: [], // 费用列表
  },
  mutations: {
    SET_EXPENSE_CODE_OPT(state, data) {
      state.expenseCodeOpt = data
    }
  },
  actions: {
    getExpenseCodeOpt({ commit }) {
      http.get(serviceAPI.expenseSearchExcludeAirFee, {
        params: {
          pageSize: 50000,
        }
      }).then((data) => {
        if (data.code == 200) {
          commit('SET_EXPENSE_CODE_OPT', data.data.records)
        }
      })
    },
  }
}
