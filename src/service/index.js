//ng开发环境
// var pulicWeb = '/faw'
var pulicWeb = '/faw'


//ng测试环境
// var pulicWeb = '/back/dcErpTest/faw'


const serviceApi = {
  // 登录
  login: pulicWeb + '/t-sys-user/login',
  //用户查询
  userRoleList: pulicWeb + '/t-sys-user/queryUserList',
  //用户新增
  userAdd: pulicWeb + '/t-sys-user/add',
  //用户编辑
  userUpdate: pulicWeb + '/t-sys-user/update',
  //用户修改密码
  userUpdatePassword: pulicWeb + '/t-sys-user/updatePassword',
  //角色查询
  roleSearch: pulicWeb + '/t-sys-role/search',
  //新增角色
  roleAdd: pulicWeb + '/t-sys-role/add',
  //删除角色
  roleDelete: pulicWeb + '/t-sys-role/delete',
  //编辑角色
  roleUpdate: pulicWeb + '/t-sys-role/update',
  //模块查询
  moduleSearch: pulicWeb + '/t-sys-module/search',
  //模块新增
  moduleAdd: pulicWeb + '/t-sys-module/add',
  //模块修改
  moduleUpdate: pulicWeb + '/t-sys-module/update',
  //模块删除
  moduleDelete: pulicWeb + '/t-sys-module/delete',
  //代理列表查询
  agentList: pulicWeb + '/t-agent/list',
  //代理列表新增
  agentSave: pulicWeb + '/t-agent/save',
  //代理列表修改
  agentUpdate: pulicWeb + '/t-agent/update',
  //代理列表删除
  agentDelete: pulicWeb + '/t-agent/delete',
  //上传Banner图片
  uploadBannerImage: pulicWeb + '/t-banner/uploadBannerImage',
  //保存/修改Banner信息
  changeBanner: pulicWeb + '/t-banner/changeBanner',
  //后台广告管理展示
  manageBannerList: pulicWeb + '/t-banner/manageBannerList',
  //航线价格导出
  airlineExcelExport: pulicWeb + '/t-rates/exportExcel',
  //航线价格导入
  airlineExcelImport: pulicWeb + '/t-rates/importExcel',
  //航线价格导入
  downloadTemplate: pulicWeb + '/t-rates/downloadTemplate',
  //三字代码查询分页
  airportSearchByPage: pulicWeb + '/t-airport/word-code/searchByPage',
  //二字代码查询分页
  companySearchByPage: pulicWeb + '/t-air-company/word-code/searchByPage',
  //新增航线
  airlineSave: pulicWeb + '/t-airline/save',
  //航线管理列表
  airlineSearchByPage: pulicWeb + '/t-airline/searchByPage',
  //航线信息修改/上架下架按钮
  airlineUpdate: pulicWeb + '/t-airline/update',
  //航线删除
  airlineDelete: pulicWeb + '/t-airline/delete',
  //航线信息详情
  airlineDetail: pulicWeb + '/t-airline/airlineDetail',
  //航线报价信息详情
  airlineRatesDetail: pulicWeb + '/t-airline/airlineRatesDetail',
  //清空航线代理关系及价格
  airlineDeleteCascade: pulicWeb + '/t-airline-agent/deleteCascade',
  //保存航线代理关系及价格
  airlineSaveCascade: pulicWeb + '/t-airline-agent/saveCascade',
  //航线唯一性校验
  airlineCheckAirlineInfo: pulicWeb + '/t-airline/checkAirlineInfo',
  //banner刷新html
  dcReptileReplace: '/back/dcReptile/pageStatic/replace',
  //用户列表
  userSearchByPage: pulicWeb + '/t-portal-user/searchByPage',
  //用户查询
  userSearch: pulicWeb + '/t-sys-user/search',
  //修改用户
  userUpdateUserinfo: pulicWeb + '/t-portal-user/update',
  //费用查询
  expenseList: pulicWeb + '/t-expense/searchByPage',
  //费用列表新增
  expenseSave: pulicWeb + '/t-expense/save',
  //费用列表修改
  expenseUpdate: pulicWeb + '/t-expense/update',
  //费用列表删除
  expenseDelete: pulicWeb + '/t-expense/delete',
  //查询订单信息列表
  orderSearchByPage: pulicWeb + '/t-order/searchByPage',
  //统计分类的订单列表数目
  orderCountList: pulicWeb + '/t-order/countList',
  //查询订单详情
  orderSearchDetail: pulicWeb + '/t-order/searchDetail',
  //费用分页查询，排除了空运费
  expenseSearchExcludeAirFee: pulicWeb + '/t-expense/searchExcludeAirFee',
  //保存订单
  orderSaveOrder: pulicWeb + '/t-order/saveOrder',
  //执行订单
  orderExecuteOrder: pulicWeb + '/t-order/executeOrder',
  //上传附件
  attachmentUpload: pulicWeb + '/t-order-attachment/upload',
  //发起账单
  priceSendBill: pulicWeb + '/t-order-price/sendBill',
  //保存操作记录
  presentSavePresentLog: pulicWeb + '/t-order-present-log/savePresentLog',
  //财务订单列表查询
  financeOrderList: pulicWeb + '/t-order/financeOrderList',

  orderPriceTable: pulicWeb + '/t-order-price/getOrderPriceTable',
  //财务订单列表查询
  savePresentLog: pulicWeb + '/t-order-present-log/savePresentLog',
  trackList: pulicWeb + '/track/monitorQuery/airCompanyInfo',
  trackDetail: pulicWeb + '/track/monitorQuery/getData',
  //汇率编辑
  editByYearAndMonth: pulicWeb + '/t-cur-exrate/editByYearAndMonth',
  //汇率列表
  searchByYear: pulicWeb + '/t-cur-exrate/searchByYear',
  //银行账户管理-删除
  deleteBankAccount: pulicWeb + '/t-bank-account/deleteInfo',
  //银行账户管理-新增编辑
  editBankAccount: pulicWeb + '/t-bank-account/inorChInfo',

  //银行账户管理-查询
  searchBankAccount: pulicWeb + '/t-bank-account/searchByNameBank',

  //发票申请页面-查询
  invoiceSearch: pulicWeb + '/t-invoice-apply/searchByPage',

  //发票申请页面 -开票确认生成
  actionInvoice: pulicWeb + '/t-invoice-apply/actionInvoice',
  //应收核销明细列表
  searchWoDetailByPage: pulicWeb + '/t-rcv-records/searchWoDetailByPage',
//应收核销操作记录
  searchArList: pulicWeb + '/t-write-off-records/searchArWoList',
//应收核销操作记录
  arRevoke: pulicWeb + '/t-write-off-records/arRevoke',
  //应收核销页面，点击订单编号时，查询订单详情及财务记录
  searchOrderDetail: pulicWeb + '/t-rcv-records/searchOrderDetail'

}
export default serviceApi
