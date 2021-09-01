//开发环境
var pulicWeb = '/dcErp/faw'

//测试环境
// var pulicWeb = '/dcErpTest/faw'


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
  uploadBannerImage:pulicWeb+'/t-banner/uploadBannerImage',
  //保存/修改Banner信息
  changeBanner:pulicWeb+'/t-banner/changeBanner',
  //后台广告管理展示
  manageBannerList:pulicWeb+'/t-banner/manageBannerList',
  //航线价格导出
  airlineExcelExport:pulicWeb+'/t-rates/exportExcel',
  //航线价格导入
  airlineExcelImport:pulicWeb+'/t-rates/importExcel',
  //航线价格导入
  downloadTemplate:pulicWeb+'/t-rates/downloadTemplate',
  //三字代码查询分页
  airportSearchByPage: pulicWeb+'/t-airport/word-code/searchByPage',
  //二字代码查询分页
  companySearchByPage: pulicWeb+'/t-air-company/word-code/searchByPage',
  //新增航线
  airlineSave: pulicWeb+'/t-airline/save',
  //航司线管理列表
  airlineSearchByPage: pulicWeb+'/t-airline/searchByPage',
  //航线信息修改/上架下架按钮
  airlineUpdate: pulicWeb+'/t-airline/update',
  //航线删除
  airlineDelete: pulicWeb+'/t-airline/delete',
  //航线信息详情
  airlineDetail: pulicWeb+'/t-airline/airlineDetail',
  //航线报价信息详情
  airlineRatesDetail: pulicWeb+'/t-airline/airlineRatesDetail',
  //清空航线代理关系及价格
  airlineDeleteCascade: pulicWeb+'/t-airline-agent/deleteCascade'



}
export default serviceApi
