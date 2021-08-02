import request from '@/utils/request'

export function getDictionaryClassList(data) {
  return request({
    url: '/api/system/GetDictionaryClassList',
    method: 'post',
    data,
  })
}

export function getDictionaryClassUpdate(data) {
  return request({
    url: '/api/system/DictionaryClassUpdate',
    method: 'post',
    data,
  })
}

export function getDictionaryList(data) {
  return request({
    url: '/api/system/GetDictionaryList',
    method: 'post',
    data,
  })
}

export function getDictionaryUpdate(data) {
  return request({
    url: '/api/system/DictionaryUpdate',
    method: 'post',
    data,
  })
}

//给指定组织层级分配设备
export function distributionOrgDevice(data) {
  return request({
    url: '/api/device/PCAccessoryOrgUpd',
    method: 'post',
    data,
  })
}

//通过组织架构层级.获取属于该组织以及下属组织管理的设备列表
export function getOrgDeviceList(data) {
  return request({
    url: '/api/device/PCGetOrgAccessoryList',
    method: 'post',
    data,
  })
}