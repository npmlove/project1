import request from '@/utils/request'

//获取点位类别列表
export function getDeviceDataPointTypeList(data) {
  return request({
    url: '/api/system/GetDeviceDataPointTypeList',
    method: 'post',
    data,
  })
}

//设备点位类别新增，编辑，删除
export function deviceDataPointTypeUpdate(data) {
  return request({
    url: '/api/system/DeviceDataPointTypeUpdate',
    method: 'post',
    data,
  })
}

//表单新增，编辑，删除
export function getFormUpdate(data) {
  return request({
    url: '/api/system/FormUpdate',
    method: 'post',
    data,
  })
}

//获取表单列表
export function getFormList(data) {
  return request({
    url: '/api/system/GetFormList',
    method: 'post',
    data,
  })
}
