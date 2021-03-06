import Layout from '../components/layout/Layout'

const autoRoutes = [{
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/pages/login/index.vue'),
    hidden: true
  },
  {
    path: '*',
    component: () => import('@/pages/404.vue'),
    hidden: true
  }
]


//字典管理
const dictManagement=[{
  path:'/dict',
  component:Layout,
  name:'dict',
  redirect:'noredirect',
  alwaysShow:true,
  meta:{
    title:'字典管理',
    icon: 'icon iconfont icon-diannao',
    breadcrumb: true
  },
  children:[{
    path: 'dict',
    component: () => import('@/pages/dict/dict.vue'),
    name: 'dict',
    meta: {
      title: '业务字典',
      keepAlive:true,
      needLogin: true
    },},]

},
]
//代理管理
const agentManagement=[{
  path:'/agentManagement',
  component:Layout,
  name:'agentManagement',
  redirect:'noredirect',
  alwaysShow:true,
  meta:{
    title:'代理管理',
    icon: 'icon iconfont icon-diannao',
    breadcrumb: true,
    roles:['航线负责人','售中客服']
  },
  children:[{
    path: 'agentList',
    component: () => import('@/pages/agentManagement/agentList.vue'),
    name: 'agentList',
    meta: {
      title: '代理列表',
      keepAlive:true,
      needLogin: true
  },},]

},
]
//费用管理
const expenseManagement=[{
  path:'/expenseManagement',
  component:Layout,
  name:'expenseManagement',
  redirect:'noredirect',
  alwaysShow:true,
  meta:{
    title:'费用管理',
    icon: 'icon iconfont icon-diannao',
    breadcrumb: true,
    roles:['航线负责人','售中客服','售前客服','财务人员']
  },
  children:[{
    path: 'expenseList',
    component: () => import('@/pages/expenseManagement/expenseManagement.vue'),
    name: 'expenseList',
    meta: {
      title: '费用列表',
      keepAlive:true,
      needLogin: true
  },},]

},
]
//货物跟踪
const cargoTrackingManage=[{
  path:'/cargoTrackingManage',
  component:Layout,
  name:'cargoTrackingManage',
  redirect:'noredirect',
  alwaysShow:true,
  meta:{
    title:'大盘主页',
    icon: 'icon iconfont icon-diannao',
    breadcrumb: true,
    // roles:['航线负责人','售中客服','售前客服','财务人员']
    roles:['超级管理员']
  },
  children:[{
    path: 'cargoTracking',
    component: () => import('@/pages/cargoTrackingManage/cargoTracking.vue'),
    name: 'cargoTracking',
    meta: {
      title: '货物追踪详情',
      keepAlive:true,
      needLogin: true
    }},
    {
      path: 'routeDataStatistics',
      component: () => import('@/pages/cargoTrackingManage/routeDataStatistics.vue'),
      name: 'routeDataStatistics',
      meta: {
        title: '航线运营数据统计',
        keepAlive:true,
        needLogin: true
      },}
  ]

},
]
//管理员
const adminUserCenter = [{
  path: '/adminUser',
  component: Layout,
  name: 'adminUser',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '管理员',
    icon: 'icon iconfont icon-shengchan',
    breadcrumb: true,
    roles:[]
  },
  children: [
    {
      path: 'userCenter',
      component: () => import('@/pages/adminUser/userCenter.vue'),
      name: 'userCenter',
      meta: {
        title: '账号管理',
        keepAlive: false,
        needLogin: true
      },
    },
    {
      path: 'roleCenter',
      component: () => import('@/pages/adminUser/roleCenter.vue'),
      name: 'roleCenter',
      meta: {
        title: '角色管理',
        keepAlive: false,
        needLogin: true
      },
    },
    {
      path: 'authorityCenter',
      component: () => import('@/pages/adminUser/authorityCenter.vue'),
      name: 'authorityCenter',
      meta: {
        title: '权限管理',
        keepAlive: false,
        needLogin: true
      },
    },
    {
      path: 'userAdd',
      component: () => import('@/pages/adminUser/userAdd.vue'),
      name: 'userAdd',
      hidden: true,
      meta: {
        title: '新增用户',
        keepAlive: false,
        needLogin: true
      },
    },
    {
      path: 'userEdit',
      component: () => import('@/pages/adminUser/userEdit.vue'),
      name: 'userEdit',
      hidden: true,
      meta: {
        title: '编辑用户',
        keepAlive: false,
        needLogin: true
      },
    },
    {
      path: 'homePage',
      component: () => import('@/pages/adminUser/homePage.vue'),
      name: 'homePage',
      hidden: true,
      meta: {
        title: '首页',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]

// 航线管理
const routeManagementCenter = [{
  path: '/routeManagement',
  component: Layout,
  name: 'routeManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '航线管理',
    icon: 'icon iconfont icon-kucun',
    breadcrumb: false,
    roles:['航线负责人','财务人员']
  },
  children: [
    {
      path: 'routeManage',
      component: () => import('@/pages/routeManagement/routeManage.vue'),
      name: 'routeManage',
      meta: {
        title: '航线列表',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'routeAdd',
      component: () => import('@/pages/routeManagement/routeAdd.vue'),
      name: 'routeAdd',
      hidden: true,
      meta: {
        title: '新增航线',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'routeDetails',
      component: () => import('@/pages/routeManagement/routeDetails.vue'),
      name: 'routeDetails',
      hidden: true,
      meta: {
        title: '航线详情',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'routeEdit',
      component: () => import('@/pages/routeManagement/routeEdit.vue'),
      name: 'routeEdit',
      hidden: true,
      meta: {
        title: '编辑航线',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'routeImport',
      component: () => import('@/pages/routeManagement/routeImport.vue'),
      name: 'routeImport',
      hidden: false,
      meta: {
        title: ' 航线导入',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]
// 财务管理
const financeManagementCenter = [{
  path: '/financeManagement',
  component: Layout,
  name: 'financeManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '财务管理',
    icon: 'icon iconfont icon-kucun',
    breadcrumb: false,
    roles:['财务人员']
  },
  children: [
    {
      path: 'financeManage',
      component: () => import('@/pages/financeManagement/financeManage.vue'),
      name: 'financeManage',
      meta: {
        title: '财务列表',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'invoiceList',
      component: () => import('@/pages/financeManagement/invoiceList.vue'),
      name: 'invoiceList',
      meta: {
        title: '发票列表',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'orderWriteOff',
      component: () => import('@/pages/financeManagement/orderWriteOff.vue'),
      name: 'orderWriteOff',
      meta: {
        title: '订单核销',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'receivableStatistics',
      component: () => import('@/pages/financeManagement/receivableStatistics.vue'),
      name: 'receivableStatistics',
      meta: {
        title: '应收统计',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'receivableStatisticsDetails',
      component: () => import('@/pages/financeManagement/receivableStatisticsDetails.vue'),
      name: 'receivableStatisticsDetails',
      meta: {
        title: '应收核销明细',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'paysStatistics',
      component: () => import('@/pages/financeManagement/paysStatistics.vue'),
      name: 'paysStatistics',
      meta: {
        title: '应付统计',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'paysStatisticsDetails',
      component: () => import('@/pages/financeManagement/paysStatisticsDetails.vue'),
      name: 'paysStatisticsDetails',
      meta: {
        title: '应付核销明细',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'bankAccount',
      component: () => import('@/pages/financeManagement/bankAccount.vue'),
      name: 'bankAccount',
      meta: {
        title: '银行账号列表',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]
// 账单总览
const billOverview = [{
  path: '/billOverview',
  component: Layout,
  name: 'billOverview',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '账单总览',
    icon: 'icon iconfont icon-kucun',
    breadcrumb: false,
    roles:['财务人员']
  },
  children: [
    {
      path: 'userBill',
      component: () => import('@/pages/billOverview/userBill.vue'),
      name: 'userBill',
      meta: {
        title: '用户账单',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'shopBill',
      component: () => import('@/pages/billOverview/shopBill.vue'),
      name: 'shopBill',
      meta: {
        title: '供应商账单',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]
// 订单管理
const orderManagementCenter = [{
  path: '/orderManagement',
  component: Layout,
  name: 'orderManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '订单管理',
    icon: 'icon iconfont icon-kucun',
    breadcrumb: false,
    roles:['航线负责人','售中客服','售前客服','财务人员']
  },
  children: [
    {
      path: 'orderManage',
      component: () => import('@/pages/orderManagement/orderManage.vue'),
      name: 'orderManage',
      meta: {
        title: '订单列表',
        keepAlive: true,
        needLogin: true
      }
    },
    {
      path: 'ladingBillDownLoad',
      component: () => import('@/pages/orderManagement/ladingBillDownLoad.vue'),
      name: 'ladingBillDownLoad',
      meta: {
        title: '提单制作',
        keepAlive: false,
        needLogin: true,
        roles:['售中客服','财务人员']
      }
    },
    {
      path: 'orderdetail',
      component: () => import('@/pages/orderManagement/OrderDetail.vue'),
      name: 'OrderDetail',
      hidden: true,
      meta: {
        title: '订单详情',
        keepAlive: false,
        needLogin: true
      }
    },
    // {
    //   path: 'orderDetails1',
    //   component: () => import('@/pages/orderManagement/orderDetails1.vue'),
    //   name: 'orderDetails1',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-平台审核',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails2',
    //   component: () => import('@/pages/orderManagement/orderDetails2.vue'),
    //   name: 'orderDetails2',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-待进仓',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails3',
    //   component: () => import('@/pages/orderManagement/orderDetails3.vue'),
    //   name: 'orderDetails3',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-操作中',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails4',
    //   component: () => import('@/pages/orderManagement/orderDetails4.vue'),
    //   name: 'orderDetails4',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-海关安检',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails5',
    //   component: () => import('@/pages/orderManagement/orderDetails5.vue'),
    //   name: 'orderDetails5',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-运输中',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails6',
    //   component: () => import('@/pages/orderManagement/orderDetails6.vue'),
    //   name: 'orderDetails6',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-完成',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails7',
    //   component: () => import('@/pages/orderManagement/orderDetails7.vue'),
    //   name: 'orderDetails7',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-已取消',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
    // {
    //   path: 'orderDetails8',
    //   component: () => import('@/pages/orderManagement/orderDetails8.vue'),
    //   name: 'orderDetails8',
    //   hidden: true,
    //   meta: {
    //     title: '订单详情-平台审核',
    //     keepAlive: false,
    //     needLogin: true
    //   }
    // },
  ]
}]

// 广告模块
const adverManagementCenter = [{
  path: '/adverManagement',
  component: Layout,
  name: 'adverManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '广告管理',
    icon: 'icon iconfont icon-yuangongguanli',
    breadcrumb: false,
    roles:['航线负责人','售中客服','售前客服','财务人员']
  },
  children: [
    {
      path: 'adverCenter',
      component: () => import('@/pages/adverManagement/adverCenter.vue'),
      name: 'adverCenter',
      hidden: true,
      meta: {
        title: '广告列表',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'adverAdd',
      component: () => import('@/pages/adverManagement/adverAdd.vue'),
      name: 'adverAdd',
      hidden: true,
      meta: {
        title: '新增广告',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'bannerNew',
      component: () => import('@/pages/adverManagement/bannerNew.vue'),
      name: 'bannerNew',
      meta: {
        title: 'banner广告位',
        keepAlive: false,
        needLogin: true
      }
    },
  ]
}]

// 用户管理
const userManagementCenter = [{
  path: '/userManagement',
  component: Layout,
  name: 'userManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '用户管理',
    icon: 'icon iconfont icon-ECN',
    breadcrumb: false,
    roles:['售中客服','售前客服']
  },
  children: [{
      path: 'userManage',
      component: () => import('@/pages/userManagement/userManage.vue'),
      name: 'userManage',
      meta: {
        title: '用户列表',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]


// 科目管理
const courseManagement = [{
  path: '/courseManagement',
  component: Layout,
  name: 'courseManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '科目管理',
    icon: 'icon iconfont icon-ECN',
    breadcrumb: false,
    roles:['航线负责人','售中客服','售前客服','财务人员']
  },
  children: [{
    path: 'exchangeRateManagement',
    component: () => import('@/pages/courseManagement/exchangeRateManagement.vue'),
    name: 'exchangeRateManagement',
    meta: {
      title: '汇率管理',
      keepAlive: false,
      needLogin: true
    }
  }
  ]
}]

// 工单
const workOrder = [{
  path: '/workOrder',
  component: Layout,
  name: 'workOrder',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title:"工单",
    img: require("../assets/gongdan.png"),
    breadcrumb: false,
    roles:["售前客服","航线负责人"]
  },
  children: [
    {
      path: 'serviceWorkOrder',
      component: () => import('@/pages/workOrder/serviceWorkOrder.vue'),
      name: 'serviceWorkOrder',
      meta: {
        title: '客服工单提交',
        keepAlive: false,
        needLogin: true,
        roles:["售前客服"]
      }
    },
    {
      path: 'airlineWorkOrder',
      component: () => import('@/pages/workOrder/airlineWorkOrder.vue'),
      name: 'airlineWorkOrder',
      meta: {
        title: '航线工单审核',
        keepAlive: false,
        needLogin: true,
        roles:["航线负责人"]
      }
    },
    {
      path: 'workOrderStatistics',
      component: () => import('@/pages/workOrder/workOrderStatistics.vue'),
      name: 'workOrderStatistics',
      meta: {
        title: '工单目的港可视化',
        keepAlive: false,
        needLogin: true,
        roles:[""]
      },
    },{
      path: 'overAllStatistics',
      component: () => import('@/pages/workOrder/overAllStatistics.vue'),
      name: 'overAllStatistics',
      meta: {
        title: '统计',
        keepAlive: false,
        needLogin: true,
        roles:[""]
      }
    }
  ]
}]

// 仓库
const warehouse = [{
  path: '/warehouseManagement',
  component: Layout,
  name: 'WarehouseManagement',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title:"仓库管理",
    icon: 'icon iconfont icon-diannao',
    breadcrumb: false,
    roles:["售中客服","一代操作"]
  },
  children: [
    {
      path: 'warehouseList',
      component: () => import('@/pages/warehouseManagement/WarehouseList.vue'),
      name: 'WarehouseList',
      meta: {
        title: '仓库列表',
        keepAlive: false,
        needLogin: true,
        roles:["售中客服","一代操作"]
      }
    },
  ]
}]

// led
const led = [{
  path:"/ledPage",
  component: Layout,
  name: 'ledPageLayout',
  redirect: 'noredirect',
  alwaysShow: true,
  hidden:true,
  meta: {
    title: 'led大屏',
    icon: 'icon iconfont icon-ECN',
    breadcrumb: false,
  },
  children:[
    {
      path: 'ledPage',
      component: () => import('@/pages/ledPage/led.vue'),
      name: 'ledPage',
      hidden:true,
      meta: {
        title: 'led大屏展示',
        keepAlive: false,
        needLogin: true
      }
    }
  ]
}]


// 权限控制路由
export const asyncRoutes = [
  ...orderManagementCenter,
  ...routeManagementCenter,  // dashboard home
  ...warehouse,
  ...financeManagementCenter,
  ...billOverview,
  ...adverManagementCenter,
  ...agentManagement,
  ...expenseManagement,

  ...userManagementCenter,
  ...adminUserCenter,
  ...courseManagement,
  ...cargoTrackingManage,
  ...workOrder,
  ...led,
]

// 默认显示路由
export const constantRoutes  = [
  ...autoRoutes,
]

export default constantRoutes
