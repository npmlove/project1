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
    breadcrumb: true
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
    breadcrumb: true
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
//费用管理
const cargoTrackingManage=[{
  path:'/cargoTrackingManage',
  component:Layout,
  name:'cargoTrackingManage',
  redirect:'noredirect',
  alwaysShow:true,
  meta:{
    title:'货物追踪',
    icon: 'icon iconfont icon-diannao',
    breadcrumb: true
  },
  children:[{
    path: 'cargoTracking',
    component: () => import('@/pages/cargoTrackingManage/cargoTracking.vue'),
    name: 'cargoTracking',
    meta: {
      title: '货物追踪详情',
      keepAlive:true,
      needLogin: true
    },},]

},
]
//管理模块
const adminUserCenter = [{
  path: '/adminUser',
  component: Layout,
  name: 'adminUser',
  redirect: 'noredirect',
  alwaysShow: true,
  meta: {
    title: '管理员',
    icon: 'icon iconfont icon-shengchan',
    breadcrumb: true
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
    breadcrumb: false
  },
  children: [
    {
      path: 'routeManage',
      component: () => import('@/pages/routeManagement/routeManage.vue'),
      name: 'routeManage',
      meta: {
        title: '航线列表',
        keepAlive: false,
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
    breadcrumb: false
  },
  children: [
    {
      path: 'financeManage',
      component: () => import('@/pages/financeManagement/financeManage.vue'),
      name: 'financeManage',
      meta: {
        title: '财务列表',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'invoiceList',
      component: () => import('@/pages/financeManagement/invoiceList.vue'),
      name: 'invoiceList',
      meta: {
        title: '发票列表',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderWriteOff',
      component: () => import('@/pages/financeManagement/orderWriteOff.vue'),
      name: 'orderWriteOff',
      meta: {
        title: '订单核销',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'receivableStatistics',
      component: () => import('@/pages/financeManagement/receivableStatistics.vue'),
      name: 'receivableStatistics',
      meta: {
        title: '应收统计',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'receivableStatisticsDetails',
      component: () => import('@/pages/financeManagement/receivableStatisticsDetails.vue'),
      name: 'receivableStatisticsDetails',
      meta: {
        title: '应收核销明细',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'paysStatistics',
      component: () => import('@/pages/financeManagement/paysStatistics.vue'),
      name: 'paysStatistics',
      meta: {
        title: '应付统计',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'paysStatisticsDetails',
      component: () => import('@/pages/financeManagement/paysStatisticsDetails.vue'),
      name: 'paysStatisticsDetails',
      meta: {
        title: '应付核销明细',
        keepAlive: false,
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
    breadcrumb: false
  },
  children: [
    {
      path: 'orderManage',
      component: () => import('@/pages/orderManagement/orderManage.vue'),
      name: 'orderManage',
      meta: {
        title: '订单列表',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails1',
      component: () => import('@/pages/orderManagement/orderDetails1.vue'),
      name: 'orderDetails1',
      hidden: true,
      meta: {
        title: '订单详情-平台审核',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails2',
      component: () => import('@/pages/orderManagement/orderDetails2.vue'),
      name: 'orderDetails2',
      hidden: true,
      meta: {
        title: '订单详情-待进仓',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails3',
      component: () => import('@/pages/orderManagement/orderDetails3.vue'),
      name: 'orderDetails3',
      hidden: true,
      meta: {
        title: '订单详情-操作中',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails4',
      component: () => import('@/pages/orderManagement/orderDetails4.vue'),
      name: 'orderDetails4',
      hidden: true,
      meta: {
        title: '订单详情-海关安检',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails5',
      component: () => import('@/pages/orderManagement/orderDetails5.vue'),
      name: 'orderDetails5',
      hidden: true,
      meta: {
        title: '订单详情-运输中',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails6',
      component: () => import('@/pages/orderManagement/orderDetails6.vue'),
      name: 'orderDetails6',
      hidden: true,
      meta: {
        title: '订单详情-完成',
        keepAlive: false,
        needLogin: true
      }
    },
    {
      path: 'orderDetails7',
      component: () => import('@/pages/orderManagement/orderDetails7.vue'),
      name: 'orderDetails7',
      hidden: true,
      meta: {
        title: '订单详情-已取消',
        keepAlive: false,
        needLogin: true
      }
    }
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
    breadcrumb: false
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
    breadcrumb: false
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

const routes = [
  ...autoRoutes,
  ...orderManagementCenter,
  ...routeManagementCenter,
  ...financeManagementCenter,
  ...adverManagementCenter,
  ...agentManagement,
  ...expenseManagement,
  // ...dictManagement,
  ...userManagementCenter,
  ...adminUserCenter,
  ...cargoTrackingManage

]

export default routes
