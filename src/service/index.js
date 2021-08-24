//正式环境
var pulicWeb = '/dcErp/faw'

//测试环境
//var pulicWeb = '/dcErpTest/faw'


const serviceApi = {
  // 登录
  login: pulicWeb+'/t-sys-user/login',
  //用户查询
  userSearch: pulicWeb+'/t-sys-user/search',
  //用户新增
  userAdd: pulicWeb+'/t-sys-user/add',
  //用户编辑
  userUpdate: pulicWeb+'/t-sys-user/update',
  //用户修改密码
  userUpdatePassword: pulicWeb+'/t-sys-user/updatePassword',
  //角色查询
  roleSearch: pulicWeb+'/t-sys-role/search',
  //新增角色
  roleAdd: pulicWeb+'/t-sys-role/add',
  //删除角色
  roleDelete: pulicWeb+'/t-sys-role/delete',
  //编辑角色
  roleUpdate: pulicWeb+'/t-sys-role/update',
  //模块查询
  moduleSearch: pulicWeb+'/t-sys-module/search',
  //模块新增
  moduleAdd: pulicWeb+'/t-sys-module/add',
  //模块修改
  moduleUpdate: pulicWeb+'/t-sys-module/update',
  //模块删除
  moduleDelete: pulicWeb+'/t-sys-module/delete',
  //代理列表查询
  agentList: pulicWeb+'/t-agent/list',
  //代理列表新增
  agentSave:pulicWeb+'/t-agent/save',
  //代理列表修改
  agentUpdate:pulicWeb+'/t-agent/update',
  //代理列表删除
  agentDelete:pulicWeb+'/t-agent/delete',
  //上传Banner图片
  uploadBannerImage:pulicWeb+ '/t-banner/uploadBannerImage',


}
export default serviceApi
