import request from '@/utils/request'

export function getCompanyList(data) {
  return request({
    url: '/api/device/CIPCGetShopTruckListDs',
    method: 'post',
    data,
  })
}

//获取有视频的设备的hls播放链接接口
export function getVideoDetail(data) {
  return request({
    url: '/api/device/GetXMCarVideoPlayURL',
    method: 'post',
    data,
  })
}

//更新车辆 可以查看视频 的状态
export function getVideoStatus(data) {
  return request({
    url: '/api/device/XMDevstatus',
    method: 'post',
    data,
  })
}


//通用=================
//更新车辆 可以查看视频 的状态
export function getShopTruckList(data) {
  return request({
    url: '/api/device/GetShopTruckList',
    method: 'post',
    data,
  })
}
//车辆信息新增，编辑
export function getShopTruckUpdate(data) {
  return request({
    url: '/api/device/ShopTruckUpdate',
    method: 'post',
    data,
  })
}
//获取车辆详情信息
export function getShopTruckDetailsDs(data) {
  return request({
    url: '/api/device/GetShopTruckDetailsDs',
    method: 'post',
    data,
  })
}
//获取表单详情
export function getComTableGet(data) {
  return request({
    url: '/api/device/ComTableGet',
    method: 'post',
    data,
  })
}
//公共组件
export function getDictionary(data) {
  return request({
    url: '/api/mes/GetDictionary',
    method: 'post',
    data,
  })
}

//解绑网关产品
export function getCIWXShopTruckUpdate(data) {
  return request({
    url: '/api/device/CIComOp',
    method: 'post',
    data,
  })
}

//获取车辆最后一次工况信息，最新数据为推送数据
export function getDeviceWorkData(data) {
  return request({
    url: '/api/device/GetDeviceWorkData',
    method: 'post',
    data,
  })
}
