import request from '@/utils/request'

//获取报警编码列表
export function getSYSAlarmCodeList(data) {
  return request({
    url: '/api/system/GetSYSAlarmCodeList',
    method: 'post',
    data,
  })
}

//报警编码新增，编辑
export function sysAlarmkCodeUpdate(data) {
  return request({
    url: '/api/system/SysAlarmkCodeUpdate',
    method: 'post',
    data,
  })
}
