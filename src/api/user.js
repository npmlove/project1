import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA, tokenName } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }
  return request({
    url: '/api/device/UserLogin',
    method: 'post',
    data,
  })
}
//  通过用户ID获取菜单
  export function getSysMenus(data) {
    return request({
      url: '/api/mes/GetMesMenu',
      method: 'post',
      data,
    })
  }

export function getUserInfo(accessToken) {
  return request({
    url: '/api/device/UserLogin',
    method: 'post',
    data: {
      [tokenName]: accessToken,
    },
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post',
  })
}

export function register() {
  return request({
    url: '/register',
    method: 'post',
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

//创建/编辑 用户
export function getUpdateUser(data) {
  return request({
    url: '/api/mes/UpdateUser',
    method: 'post',
    data,
  })
}

//获取员工详情
export function getUserDetails(data) {
  return request({
    url: '/api/mes/GetUserDetails',
    method: 'post',
    data,
  })
}

//管理员给用户重设密码
export function getUpdateUserPWD(data) {
  return request({
    url: '/api/mes/UpdateUserPWD',
    method: 'post',
    data,
  })
}

//获取组织架构信息
export function getCompanyOrgList(data) {
  return request({
    url: '/api/system/GetCompanyOrgList',
    method: 'post',
    data,
  })
}
//公司组织架构添加，编辑
export function companyOrgUpdate(data) {
  return request({
    url: '/api/system/CompanyOrgUpdate',
    method: 'post',
    data,
  })
}

//点击组织架构节点  查询下面的员工
export function getCompanyOrgUserList(data) {
  return request({
    url: '/api/mes/GetUserList',
    method: 'post',
    data,
  })
}

//新增/编辑角色 '/api/system/RoleUpdate'
export function getRoleUpdate(data) {
  return request({
    url: '/api/system/RoleUpdate',
    method: 'post',
    data,
  })
}
//获取角色列表 '/api/system/GetRoleList'
export function queryRoleList(data) {
  return request({
    url: '/api/system/GetRoleList',
    method: 'post',
    data,
  })
}

//获取系统所有菜单和权限功能 ''
export function getSysMenu(data) {
  return request({
    url: '/api/system/GetSysMenu',
    method: 'post',
    data,
  })
}
 //新增/编辑菜单
export function getMenuUpdate(data) {
  return request({
    url: '/api/system/MenuUpdate',
    method: 'post',
    data,
  })
}

 //新增/编辑菜单操作 '/api/system/MenuOPUpdate',
 export function getMenuOPUpdate(data) {
  return request({
    url: '/api/system/MenuOPUpdate',
    method: 'post',
    data,
  })
 }

 //获取角色的操作权限
  export function getCheckedOperation(data) {
    return request({
      url: '/api/system/GetCheckedOperation',
      method: 'post',
      data,
    })
  }

  //给角色分配权限
  export function getRoleOperationUpdate(data) {
    return request({
      url: '/api/system/RoleOperationUpdate',
      method: 'post',
      data,
    })
  }


   //  通过用户ID获取菜单
  export function getMesMenu(data) {
    return request({
      url: '/api/mes/GetMesMenu',
      method: 'post',
      data,
    })
  }

  //获取用户已经分配的角色
  export function getUserRoles(data) {
    return request({
      url: '/api/system/GetUserRoles',
      method: 'post',
      data,
    })
  }

//给用户分配角色
export function getUserRoleUpdate(data) {
  return request({
    url: '/api/system/UserRoleUpdate',
    method: 'post',
    data,
  })
}
