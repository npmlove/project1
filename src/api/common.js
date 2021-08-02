import request from '@/utils/request'

//所有选项字段接口
export function getDictionary(data) {
  return request({
    url: '/api/mes/GetDictionary',
    method: 'post',
    data,
  })
}

//获取员工列表
export function getUserList(data) {
  return request({
    url: '/api/mes/GetUserList',
    method: 'post',
    data,
  })
}