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