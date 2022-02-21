import Router from "@/router"
import ServiceAPI from '@/service/index'
import DcHttp from '@/util/http.js'
import dayjs from 'dayjs'
const Utils = {
  dayjs,
  // 账单倒计时24小时
  billCountDown(createTime, timer) {
    const endTime = new Date(createTime).getTime() + 24 * 60 * 60 * 1000
    const nowTime = new Date().getTime()
    let duringTime = endTime - nowTime
    if (duringTime <= 0) {
      duringTime = 0
      // clearInterval(timer)
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
      return val < 0 ? 1 : Math.floor(val)
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
      // 排除小数点开头
      const pointStart = val[0] === '.'
      if (pointStart) {
        return '0.'
      }
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
  /**
   * 载入本地文件
   * @param attrObj 需要对input(file)设置的属性
   */
  loadFile(attrObj = {}) {
    return new Promise(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      Object.keys(attrObj).forEach(item => {
        input[item] = attrObj[item]
      })
      input.style.display = 'none'
      input.onchange = (ev) => {
        resolve(ev.target.files)
        document.documentElement.removeChild(input)
      }
      document.documentElement.appendChild(input)
      input.click()
    })
  },
  // 获取docx预览地址，区分线上本地测试开发环境
  getDocxViewUrl(xpath) {
    const url = Utils.getDocxUrl(xpath)
    const docViewer = `https://view.officeapps.live.com/op/embed.aspx?src=` // 微软预览
    return `${docViewer}${url}`
  },
  // 获取docx实际地址
  getDocxUrl(xpath) {
    // 处理域名前缀问题
    const host = getHost()
    function getHost() {
      if (process.env.NODE_ENV === 'development' || window.location.host.includes(`10.8.0.1`)) {
        return `https://17dc.shenghuoq.com`
      } else {
        return window.location.origin
      }
    }
    return `${host}${xpath}`
  },
  // MessageBox预览docx
  previewDocx({ xpath, title = "预览"}) {
    const url = Utils.getDocxViewUrl(xpath)
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: `<iframe src="${url}" style="width: 60vw; height: 80vh"></iframe>`,
      center: true,
      showConfirmButton: false,
      customClass: "image-preview-message-box",
    })
      .then(() => { })
      .catch(() => { });
  },
  // MessageBox预览image
  previewImage({ url, title = "预览" }) {
    ELEMENT.MessageBox({
      dangerouslyUseHTMLString: true,
      title,
      message: `<img src="${url}" style="min-width: 100%; max-width: 80vw; max-height: 60vh" />`,
      center: true,
      showConfirmButton: false,
      customClass: "image-preview-message-box",
    })
      .then(() => {})
      .catch(() => {});
  },
  // 下载文件
  downloadFile({ url, name = '未命名', type }) {
    const tagA = document.createElement("a");
    name = `${name}${type ? `.${type}` : ''}`
    tagA.href = url;
    tagA.setAttribute("download", name); // 设置下载文件名称
    document.body.appendChild(tagA);
    tagA.click();
    document.body.removeChild(tagA)
  },
}
export default Utils