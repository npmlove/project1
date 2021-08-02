import request from '@/utils/request'

//查询设备列表
export function getDeviceList(data) {
  return request({
    url: '/api/device/CIPCGetShopTruckAccessoryList',
    method: 'post',
    data,
  })
}

// 查询OTA文件列表
export function getOTAList(data) {
  return request({
    url: '/api/device/GetOTAFileList',
    method: 'post',
    data,
  })
}

//上传文件
export function uploadFile(data) {
  return request({
    url: '/api/device/DeviceFileUpload',
    method: 'post',
    data,
  })
}

// 上传文件提交
export function submitUploadFile(data) {
  return request({
    url: '/api/device/OTAFileUpd',
    method: 'post',
    data,
  })
}

//15.获取OTA升级任务列表
export function getOTATaskList(data) {
  return request({
    url: '/api/device/GetOTATaskList',
    method: 'post',
    data,
  })
}

//16.创建/更新OTA升级任务
export function OTATaskUpd(data) {
  return request({
    url: '/api/device/OTATaskUpd',
    method: 'post',
    data,
  })
}

//查询 选项中的 文件类型
export function getFileType(data) {
  return request({
    url: '/api/mes/GetDictionary',
    method: 'post',
    data,
  })
}

//DVR注册视频平台
export function getXMmdadd(data) {
  return request({
    url: '/api/device/XMmdadd',
    method: 'post',
    data,
  })
}

//设备注册物联网平台
export function getIOTDeviceRegister(data) {
  return request({
    url: '/api/device/IOTDeviceRegister',
    method: 'post',
    data,
  })
}

// 19.获取设备升级进度
export function getOTAProgress(data) {
  return request({
    url: '/api/device/ComTableGet',
    method: 'post',
    data,
  })
}

////.获取组织层级中根节点下的一级公司
export function getComOneLevel(data) {
  return request({
    url: '/api/device/ComTableGet',
    method: 'post',
    data,
  })
}

//分配设备到公司
export function accessoryOrgUpd(data) {
  return request({
    url: '/api/device/PCAccessoryOrgUpd',
    method: 'post',
    data,
  })
}

// 查询设备的 GPS位置信息
export function getDevicePosition(data) {
  return request({
    url: '/api/device/GetDeviceLocation',
    method: 'post',
    data,
  })
}
//获取设备的版本信息 和 历史记录
export function getDeviceVerAndHistroy(data) {
  return request({
    url: '/api/device/GetDeviceDetailsDs',
    method: 'post',
    data,
  })
}
//获取设备报警列表
export function getSYSAlarmList(data) {
  return request({
    url: '/api/system/GetSYSAlarmList',
    method: 'post',
    data,
  })
}
//报警处理  
export function sysAlarmkHandle(data) {
  return request({
    url: '/api/system/SysAlarmkHandle',
    method: 'post',
    data,
  })
}

//获取设备类型列表
export function getDeviceTypeList(data) {
  return request({
    url: '/api/system/GetDeviceTypeList',
    method: 'post',
    data,
  })
}
//客户设备类型新增，编辑
export function deviceTypeUpdate(data) {
  return request({
    url: '/api/system/DeviceTypeUpdate',
    method: 'post',
    data,
  })
}
//获取设备点位列表  
export function getDeviceDataPointList(data) {
  return request({
    url: '/api/system/GetDeviceDataPointList',
    method: 'post',
    data,
  })
}
//设备点位新增，编辑  
export function deviceDataPointUpdate(data) {
  return request({
    url: '/api/system/DeviceDataPointUpdate',
    method: 'post',
    data,
  })
}

//获取设备登录 日志
export function getDeviceLoginLogList(data) {
  return request({
    url: '/api/device/GetDeviceLoginLogList',
    method: 'post',
    data,
  })
}
