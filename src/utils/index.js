import Router from "@/router"
import ServiceAPI from '@/service/index'
import DcHttp from '@/util/http.js'
export default {
  // 账单倒计时24小时
  billCountDown(createTime, timer) {
    const endTime = new Date(createTime).getTime() + 24 * 60 * 60 * 1000
    const nowTime = new Date().getTime()
    let duringTime = endTime - nowTime
    if (duringTime <= 0) {
      duringTime = 0
      clearInterval(timer)
    }
    const h = Math.floor(duringTime / 1000 / 60 / 60 % 24);
    const m = Math.floor(duringTime / 1000 / 60 % 60);
    const s = Math.floor(duringTime / 1000 % 60);

    function addZero(num) {
      return `${num <= 9 ? '0' : ''}${num}`
    }
    return `${addZero(h)}:${addZero(m)}:${addZero(s)}`
  },
  // 返回数字
  getNumber(val, isInt = false) {
    if (val === '0') {
      return ''
    }
    val = val.replace(/[^\d.]+/g, '')
    if (isInt) {
      return val <= 0 ? 1 : Math.floor(val)
    }
    const test = (/^[+-]?(0|([1-9]\d*))(\.\d+)?$/).test(val)
    if (test) {
      return val
    } else {
      let pointFlag = false
      val = val.split('').reduce((str, item) => {
        if (item === '.') {
          if (!pointFlag) {
            str += item
          }
        } else {
          str += item
        }
        if (item === '.') {
          pointFlag = true
        }
        return str
      }, '')
      return val
    }
  },
  // 详情页操作本页刷新
  async orderDetailRefresh(order) {
    // 获取最新订单状态
    const { code, data: { id } } = await DcHttp.get(
      ServiceAPI.orderSearchDetail, {
      params: {
        orderId: order.id,
      }
    }
    );
    if (code !== 200) {
      return
    }
    Router.replace({ name: 'OrderDetail', query: { id, timestamp: new Date().getTime() } })
  },
}