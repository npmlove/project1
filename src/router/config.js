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
        keepAlive: false,
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
      path: 'userCenter',
      component: () => import('@/pages/userManagement/userCenter.vue'),
      name: 'userCenter',
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
  ...routeManagementCenter,
  ...adverManagementCenter,
  ...agentManagement,
  // ...userManagementCenter,
  ...adminUserCenter

]

export default routes
