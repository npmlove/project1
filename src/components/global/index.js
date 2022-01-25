// 批量导入组件
const request = require.context('../global/', false, /\.vue$/)
const Components = request.keys().reduce((obj, item) => {
  const key = item.match(/\.\/(\S*)\.vue/)[1]
  obj[key] = require(`../global/${key}`).default
  return obj
}, {})
export default Components
