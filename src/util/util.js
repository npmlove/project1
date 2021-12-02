import axios from './http'
// 上传文件
export function postImage(url, data) {
    return new Promise((resolve, reject) => {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      };
      axios.post(url, data, config).then(
        response => {
          resolve(response);
        },
        err => {
          reject(err);
        }
      );
    });
  }
  // 将blob流改成excle文档 
  /*
  ****** res 二进制流
  ****** type blob的类型

  "application/vnd.ms-excel"
  "application/pdf"
  ****** name 下载文件的名字
  */
export function exportFile(res,type,name) {
  const a = document.createElement("a");
  let blob = new Blob([res], {
    type: type
  })
  a.href = URL.createObjectURL(blob)
  a.setAttribute('download', name + '.xlsx')
  a.click()
}
// 常用的几个国家的货币及符号
export const moneyList = [{
    value: '1',
    label: 'CNY',
    symbol:'￥'
  }, {
    value: '2',
    label: '港币',
    symbol:"HK$"
  }, {
    value: '3',
    label: '美元',
    symbol:'$'
  }, {
    value: '4',
    label: '欧元',
    symbol:'€'
  }, {
    value: '5',
    label: '英镑',
    symbol:'￡',
  }]
// 常用的结算方式 
export const payWayArray = [
  {
      value:'',
      label:"全部"
  },{
      value:'0',
      label:"付款买单"
  },{
      value:"1",
      label:'月结'
  }
]

