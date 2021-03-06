//ng开发环境
const { BASE_URL: pulicWeb } = process.env
// var pulicWeb = '/faw'
// var pulicWeb = '/faw'
// var pulicWeb = '/back/dcErp/faw'


//ng测试环境
// var pulicWeb = '/back/dcErpTest/faw'

// hotfix环境
// var pulicWeb = '/back/dcErpHotfix/faw'


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
  // 二代价格导入
  airPriceImport: pulicWeb + '/t-rates/importExcelOriginal',
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

  //用户查询
  userSearchNoAuth: pulicWeb + '/t-sys-user/noAuth/search',
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
  //财务订单列表导出列表
  exportFoExcel: pulicWeb + '/t-order/exportFoExcel',
  //财务订单列表 数据统计
  financeOrderCount: pulicWeb + '/t-order/financeOrderCount',
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
  //发票申请页面 - 订单号运单号查看详情
  orderInfoShow: pulicWeb + '/t-invoice-apply/orderInfoShow',
  //生成发票
  confirmInvoice: pulicWeb + '/t-invoice-apply/confirmInvoice',

  expressInvoices: pulicWeb + '/t-invoice-apply/expressInvoices',

  nullifyInvoiceMore: pulicWeb + '/t-invoice-apply/nullifyInvoiceMore',

  //发票申请页面 - 数据统计
  invoiceStatistics: pulicWeb +'/t-invoice-apply/dataStatistics',
  //发票申请页面 - 导出列表
  exportToExcel: pulicWeb + '/t-invoice-apply/exportToExcel',
  //发票申请页面 - 上传发票
  uploadInvoicePDF: pulicWeb + '/t-invoice-apply/uploadInvoicePDF',
  //应收核销明细列表
  searchWoDetailByPage: pulicWeb + '/t-rcv-records/searchWoDetailByPage',
  //核销明细列表查询
  writeOffSearch: pulicWeb + '/t-payment-write-off/writeOffSearch',
//应收核销操作记录
  searchArList: pulicWeb + '/t-write-off-records/searchArWoList',
//应收核销操作记录
  arRevoke: pulicWeb + '/t-write-off-records/arRevoke',
  //应收核销页面，点击订单编号时，查询订单详情及财务记录
  searchOrderDetail: pulicWeb + '/t-rcv-records/searchOrderDetail',
  //订单核销页面 - 查询
  searchWoByPage: pulicWeb +'/t-order/searchWoByPage',
  //订单核销页面 - 订单号详情
  searchWoDetail: pulicWeb +'/t-order/searchWoDetail',
  //订单核销页面 - 数据统计
  subWoList: pulicWeb +'/t-order/sumWoList' ,
  //订单核销页面 - 导出列表
  exportWoExcel: pulicWeb +'/t-order/exportWoExcel' ,
  //统计应收核销明细数据
  sumWoDetail: pulicWeb + '/t-rcv-records/sumWoDetail',
  //订单核销列表导出
  exportWoDetailExcel: pulicWeb + '/t-rcv-records/exportWoDetailExcel',
  //查询操作记录
  searchRecords: pulicWeb + '/t-order-payment/searchRecords',
  //数据统计
  dataStatistics: pulicWeb + '/t-order-payment/dataStatistics',
  //撤销记录
  revokeRecords: pulicWeb + '/t-order-payment/revokeRecords',
  //查询
  search: pulicWeb + '/t-order-payment/search',
  //导出核销明细对账单
  exportWriteOffExcel: pulicWeb + '/t-payment-write-off/exportWriteOffExcel',
  //应收统计 -查询
  receivableSearch: pulicWeb + '/t-rcv-records/searchByPage',
  //应收统计 - 导出列表
  exportWoListExcel: pulicWeb + '/t-rcv-records/exportWoListExcel',
   //应收统计 - 数据统计
   receivableSum: pulicWeb + '/t-rcv-records/sumList',
  //应收统计 - 核销弹框数据
  getWoFrameData: pulicWeb + '/t-rcv-records/getWoFrameData',
  //应收统计 - 核销按钮弹框收款账户信息
  searchByAccount:pulicWeb + '/t-bank-account/searchByAccount',
  //应收统计 - 核销按钮弹框确认核销
  arWriteOff :pulicWeb + '/t-write-off-records/arWriteOff',
  //应收统计 - 生成对账单按钮
  getAccountStatement :pulicWeb + '/t-rcv-records/getAccountStatement',
  //应收统计 - 导出对账单
  exportCheckPdf :pulicWeb +'/t-rcv-records/exportCheckPdf',
  //应收统计 - 预收核销弹框表格
  receiptSearch :pulicWeb +'/t-advance-receipt/searchByPage',
   // 查询应付信息列表
   searchWoByPageBill: pulicWeb + '/t-order-payment/searchWoByPage',
   // 对账导入excel
   importExcel: pulicWeb + '/t-order-payment/importExcel',
   //  导出失败对账单
   exportErrExcel: pulicWeb + '/t-order-payment/exportErrExcel',
   // 对账单对账接口
   toReconciliation: pulicWeb + "/t-order-payment/toReconciliation",
   //  输入对账接口
   toEnterReconciliation: pulicWeb +'/t-order-payment/toEnterReconciliation',
   // 核销
   writeOff: pulicWeb + '/t-payment-write-off/writeOff',
   //  应付导出excel
   billExportExcel: pulicWeb + '/t-order-payment/exportExcel',
   // 发票列表页面 - 上传发票
   uploadInvoBody :  pulicWeb +'/t-invoice-apply/uploadInvoBody',
   //  核销统计接口
   //客服工单-工单数据统计
   sumWorkOrderData: pulicWeb + '/t-work-order/sumWorkOrderData',
   //客服工单/航线 工单详情
   searchWorkOrderDetailById:  pulicWeb +'/t-work-order/searchWorkOrderDetailById',
   //客服工单/航线 工单详情 取消按钮
   closeWorkOrder: pulicWeb +'/t-work-order/closeWorkOrder',
   //客服工单 工单详情 提交按钮
   workOrderAskAgain: pulicWeb + '/t-work-order/askAgain',
   //客服工单 - 导出文件
   exportCstListExcel : pulicWeb + '/t-work-order/exportCstListExcel',
   //客服工单 - 催单
   remindWorkOrder :  pulicWeb +'/t-work-order/remind',
   //客服工单 - 新建工单
   launchWorkOrder :  pulicWeb + '/t-work-order/launchWorkOrder',
   //客服工单任务数
   countDealingWork4Cst : pulicWeb +'/t-work-order/countDealingWork4Cst',
   //客服工单 -滚动公告
   searchRollList: pulicWeb +'/t-work-order/searchRollList',
  //客服工单 - 新建工单获取关键字
  stringIfContent: pulicWeb +'/t-work-order/stringIfContent',
  searchByAirportCode: pulicWeb +'/t-airport/word-code/noAuth/searchByAirportCode',
   //工单-客服工单查询
   searchByPageForCst:  pulicWeb + '/t-work-order/searchByPageForCst',
   //工单 - 待我确认 查询
   searchDealing: pulicWeb + '/t-work-order/searchDealingWork4Cst',
   airOrder: pulicWeb + '/t-work-order/searchAllWork4PrcpByPage',
   // 导出航线工单审核全部工单
   airOrderExport: pulicWeb + '/t-work-order/exportPrcpAllWorkListExcel',
   // 航线工单点击详情
   detailsSearch: pulicWeb + '/t-work-order/searchWorkOrderDetailById',
   //航线工单 - 转单
   setOrder:pulicWeb + '/t-work-order/transfer',
 // 航线工单 - 交单
   handleOrder: pulicWeb + '/t-work-order/reply',
   //航线工单 - 待我处理数量
   countWork4Prcp: pulicWeb + '/t-work-order/countWork4Prcp',
  //航线工单 - 代我处理查询
  searchDealingWork4Prcp: pulicWeb +'/t-work-order/searchDealingWork4Prcp',
  //航线工单 - 航线正在回复
  prcpProcessing: pulicWeb + '/t-work-order/prcpProcessing',
   // 工单 - 统计
  orderStatistics: pulicWeb + '/t-work-order/sumUserWorkData',
  //工单 - 统计 导出统计数据
  exportList: pulicWeb+ '/t-work-order/exportUserWorkListExcel',
    //  对账统计接口
   toCheckAmount : pulicWeb + '/t-order-payment/toCheckAmount',
  //  核销统计接口
  toWriteOffAmountCount: pulicWeb + '/t-order-payment/toWriteOffAmountCount',
  // 修改账单
  modifyBill: pulicWeb + '/t-bill/modifyBill',
  // 获取订单的汇率
  getExchangeRatesForOrder: pulicWeb +  '/t-order/getExchangeRatesForOrder',

  // 用户账单页面
  userList: pulicWeb + '/t-bill/userBill',
// 导出用户账单
  userListExport: pulicWeb + '/t-bill/userBillExport',
// 供应商账单页面
agentBill: pulicWeb + '/t-bill/agentBill',
// 导出供应商账单
  agentListExport:pulicWeb +'/t-bill/agentBillExport',
  // 导出pdf 托书
  createAgentBookingNotePdf: pulicWeb + '/t-order/createAgentBookingNotePdf',
  // 账单操作记录
  billOpearteList: pulicWeb + '/t-order-present-log/list',

  //航线运营数据统计
  searchAirData: pulicWeb + '/t-air-data/searchAirData',
  // 航线操作人员数据导出
  exportOperator: pulicWeb + '/t-air-data/exportOperator',
  // 区域航线导出
  exportArea: pulicWeb + '/t-air-data/exportArea',
  // 获取分泡比例
  getOrderBubblePoint: pulicWeb + '/t-order/getOrderBubblePoint',

  // 仓库相关
  // 根据机场查询仓库，并且添加了一个第三方仓库
  searchByAirport: pulicWeb + `/t-warehouse/searchByAirport`,
  // 新增仓库
  addWarehouse: pulicWeb + `/t-warehouse/add`,
  // 编辑仓库
  editWarehouse: pulicWeb + `/t-warehouse/update`,
  // 删除仓库
  delWarehouse: pulicWeb + `/t-warehouse/delete`,
  // 仓库信息查询
  getWarehouses: pulicWeb + `/t-warehouse/searchByPage`,
  // 查询筛选栏列表
  searchCondList: pulicWeb + `/t-warehouse/searchCondList`,
  // 上传进仓地图模板
  uploadWarehouseMap: pulicWeb + `/t-warehouse/uploadInboundMap`,
}
export default serviceApi

