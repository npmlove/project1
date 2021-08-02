//获取权限里面的操作按钮
export function operation(name) {
  var operArr = []
  if(!sessionStorage.getItem('menu')){
    return operArr
  }
  const menu = JSON.parse(sessionStorage.getItem('menu'))
  var operArr = []
  for(var i = 0;  i < menu.length; i++){
    for(var q = 0; q < menu[i].children.length; q++){
      if(menu[i].children[q].name == name){
        for(var a = 0; a < menu[i].children[q].op.length; a++){
          operArr.push(menu[i].children[q].op[a].name)
        }
      }
    }
  }
  return operArr
}

//  export function getParenthesesStr(text) {
//     let result = ''
//     if (isObjEmpty(text))  //值为空返回空
//       return result
//     let regex = /\((.+?)\)/g;  //匹配小括号的正则
//     let options = text.match(regex)  //返回一个数据 例如"等于(=)" --> ["等于","(=)"]
//     if (!isObjEmpty(options)) {
//         let option = options[0]
//         if (!isObjEmpty(option)) {
//             result = option.substring(1, option.length - 1)
//         }
//     }
//     return result
// }

//获取字符串中小括号中的值 例如："等于(=)"  "sdfdsfsdgf(111)sfdsgfdsgf"
 export function getParenthesesVal(text) {
    let result = ''
    if (JSON.stringify(text)=='{}')  //值为空返回空
      return result
    let regex = /\((.+?)\)/g;  //匹配小括号的正则
    let options = text.match(regex)  //返回一个数据 例如"等于(=)" --> ["(=)"]
    console.log(options)
    if (options.length > 0) {
        let option = options[0]
        if (option) {
          result = option.substring(1, option.length - 1)
        }
    }
    return result
}

// 根据数组内对象某个字段去重
export function arrNoRepeatByKey(arr) {
  var obj = {};
   arr = arr.reduce(function(item, next) {
     obj[next.pointname] ? '' : obj[next.pointname] = true && item.push(next);
     return item;
  }, []);
  return arr;
}