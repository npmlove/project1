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
}