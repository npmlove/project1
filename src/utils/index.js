import moment from 'moment'
export default {
  moment,
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
    val = val.replace(/[^\d.]+/g, '')
    if (isInt) {
      return val <= 0 ? 1: Math.floor(val)
    }
    // 判断是否为数字
    const test = (/^[+-]?(0|([1-9]\d*))(\.\d+)?$/).test(val)
    if (test) {
      return val
    } else {
      // 去除多余小数点
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
      // 排除000这种
      const allZero = val.split('').every(item => Number(item) === 0)
      if (allZero) {
        return 0
      }
      // 排除00122这种
      if (!allZero && !val.includes('.')) {
        return Number(val)
      }
      return val
    }
  },
}