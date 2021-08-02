/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },

  //=====================
  {
    path: '/',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: '/deviceManage',
    component: Layout,
    redirect: 'noRedirect',
    // name: 'DeviceManage',
    name: 'deviceManage',
    alwaysShow: true,
    meta: {
      title: '设备管理',
      icon: 'box-open',
      permissions: ['admin'],
    },
    children: [
      //管理员 使用
      {
        path: 'deviceList',
        name: 'deviceList',
        component: () => import('@/views/deviceManage/deviceList'),
        meta: {
          title: '设备列表设置',
          keepAlive: true,
        },
      },
      //客户 使用
      {
        path: 'customerdeviceList',
        name: 'customerdeviceList',
        component: () => import('@/views/deviceManage/customerdeviceList'),
        meta: {
          title: '设备列表',
          keepAlive: true,
        },
      },
      {
        path: 'deviceDetails',
        name: 'deviceDetails',
        hidden: true,
        component: () => import('@/views/deviceManage/deviceDetails'),
        meta: {
          title: '设备详情',
        },
      },
      {
        path: 'otaList',
        name: 'otaList',
        component: () => import('@/views/deviceManage/otaList'),
        meta: {
          title: 'OTA文件',
          keepAlive: true,
        },
      },
      {
        path: 'otadetail',
        name: 'otadetail',
        hidden: true,
        component: () => import('@/views/deviceManage/otadetail'),
        meta: {
          title: 'OTA升级任务',
          keepAlive: true,
        },
      },
      {
        path: 'otaUpgradeList',
        name: 'otaUpgradeList',
        component: () => import('@/views/deviceManage/otaUpgradeList'),
        meta: {
          title: 'OTA远程升级',
          keepAlive: true,
        },
      },
      {
        path: 'otaProgress',
        name: 'otaProgress',
        hidden: true,
        component: () => import('@/views/deviceManage/otaProgress'),
        meta: {
          title: 'OTA升级进度',
        },
      },
      {
        path: 'deviceAlarmList',
        name: 'deviceAlarmList',
        component: () => import('@/views/deviceManage/deviceAlarmList'),
        meta: {
          title: '报警信息',
          keepAlive: true,
        },
      },
      {
        path: 'deviceTypeList',
        name: 'deviceTypeList',
        component: () => import('@/views/deviceManage/deviceTypeList'),
        meta: {
          title: '设备类型',
          keepAlive: true,
        },
      },
      {
        path: 'deviceDataPoint',
        name: 'deviceDataPoint',
        component: () => import('@/views/deviceManage/deviceDataPoint'),
        meta: {
          title: '设备点位',
          keepAlive: true,
        },
      },
    ],
  },
  {
    path: '/carManage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'carManage',
    alwaysShow: true,
    meta: {
      title: '车辆管理',
      icon: 'car-side',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'carList',
        name: 'carList',
        component: () => import('@/views/carManage/carList'),
        meta: { title: '车辆列表' },
      },
      {
        path: 'videoDetail',
        name: 'videoDetail',
        hidden: true,
        component: () => import('@/views/carManage/videoDetail'),
        meta: {
          title: '视频详情',
        },
      },
      {
        path: 'commonCarList',
        name: 'commonCarList',
        component: () => import('@/views/carManage/commonCarList'),
        meta: { title: '车辆列表' },
      },
      {
        path: 'commonCarAdd',
        name: 'commonCarAdd',
        hidden: true,
        component: () => import('@/views/carManage/commonCarAdd'),
        meta: {
          title: '新增车辆',
          keepAlive: true
        },
      },
      {
        path: 'commonCarDetails',
        name: 'commonCarDetails',
        hidden: true,
        component: () => import('@/views/carManage/commonCarDetails'),
        meta: {
          title: '车辆详情',
        },
      },
      {
        path: 'commonCarEdit',
        name: 'commonCarEdit',
        hidden: true,
        component: () => import('@/views/carManage/commonCarEdit'),
        meta: {
          title: '编辑车辆',
        },
      },
    ],
  },
  {
    path: '/systemSet',
    component: Layout,
    redirect: 'noRedirect',
    name: 'systemSet',
    alwaysShow: true,
    meta: {
      title: '系统设置',
      icon: 'cog',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'optionAddition',
        name: 'optionAddition',
        component: () => import('@/views/systemSet/optionAddition'),
        meta: { title: '选项添加' },
      },
      {
        path: 'optionAdditionView',
        name: 'optionAdditionView',
        component: () => import('@/views/systemSet/optionAdditionView'),
        meta: { title: '查看选择子级' },
        hidden: true,
      },
      {
        path: 'distributionDevice',
        name: 'distributionDevice',
        component: () => import('@/views/systemSet/distributionDevice'),
        meta: {
          title: '分配设备',
          keepAlive: true
        },
      },
      {
        path: 'alarmCode',
        name: 'alarmCode',
        component: () => import('@/views/systemSet/alarmCode'),
        meta: {
          title: '报警代码',
          keepAlive: true
        },
      },
    ],
  },
  {
    path: '/userManage',
    component: Layout,
    redirect: 'noRedirect',
    name: 'userManage',
    alwaysShow: true,
    meta: {
      title: '员工管理',
      icon: 'user-cog',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'userList',
        name: 'userList',
        component: () => import('@/views/userManage/userList'),
        meta: {
          title: '员工列表',
        },
      },
      {
        path: 'userAdd',
        name: 'userAdd',
        component: () => import('@/views/userManage/userAdd'),
        meta: {
          title: '新增员工',
          // keepAlive: true
        },
        hidden: true,
      },
      {
        path: 'userEdit',
        name: 'userEdit',
        component: () => import('@/views/userManage/userEdit'),
        meta: { title: '编辑员工' },
        hidden: true,
      },
      {
        path: 'organizational',
        name: 'organizational',
        component: () => import('@/views/userManage/organizational'),
        meta: {
          title: '组织架构',
          keepAlive: true
        },
      },
      {
        path: 'roleList',
        name: 'roleList',
        component: () => import('@/views/userManage/roleList'),
        meta: {
          title: '角色管理',
          keepAlive: true
        },
      },
      {
        path: 'powerManage',
        name: 'powerManage',
        component: () => import('@/views/userManage/powerManage'),
        meta: {
          title: '权限管理',
          keepAlive: true
        },
      },
    ],
  },
  {
    path: '/businessSet',
    component: Layout,
    redirect: 'noRedirect',
    name: 'businessSet',
    alwaysShow: true,
    meta: {
      title: '业务设置',
      icon: 'briefcase',
      permissions: ['admin'],
    },
    children: [
      {
        path: 'pointTypet',
        name: 'pointTypet',
        component: () => import('@/views/businessSet/pointTypet'),
        meta: {
          title: '点位类型',
          keepAlive: true
        },
      },
      {
        path: 'formType',
        name: 'formType',
        component: () => import('@/views/businessSet/formType'),
        meta: {
          title: '新增标准化设置',
          keepAlive: true
        },
        hidden: true,
      },
      {
        path: 'formTypeEdit',
        name: 'formTypeEdit',
        component: () => import('@/views/businessSet/formTypeEdit'),
        meta: {
          title: '编辑标准化设置',
          keepAlive: true
        },
        hidden: true,
      },
      {
        path: 'formTypeDetails',
        name: 'formTypeDetails',
        component: () => import('@/views/businessSet/formTypeDetails'),
        meta: {
          title: '标准化设置详情',
          keepAlive: true
        },
        hidden: true,
      },
      {
        path: 'formCar',
        name: 'formCar',
        component: () => import('@/views/businessSet/formCar'),
        meta: {
          title: '标准化列表',
          keepAlive: true
        },
      }
    ],
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

export const asyncRoutes = [
 // {
 //   path: '/',
 //   component: Layout,
 //   redirect: 'index',
 //   children: [
 //     {
 //       path: 'index',
 //       name: 'Index',
 //       component: () => import('@/views/index/index'),
 //       meta: {
 //         title: '首页',
 //         icon: 'home',
 //         affix: true,
 //       },
 //     },
 //   ],
 // },
 // {
 //   path: '/deviceManage',
 //   component: Layout,
 //   redirect: 'noRedirect',
 //   // name: 'DeviceManage',
 //   name: 'deviceManage',
 //   alwaysShow: true,
 //   meta: {
 //     title: '设备管理',
 //     icon: 'box-open',
 //     permissions: ['admin'],
 //   },
 //   children: [
 //     {
 //       path: 'deviceList',
 //       name: 'deviceList',
 //       component: () => import('@/views/deviceManage/deviceList'),
 //       meta: {
 //         title: '设备列表',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'deviceDetails',
 //       name: 'deviceDetails',
 //       hidden: true,
 //       component: () => import('@/views/deviceManage/deviceDetails'),
 //       meta: {
 //         title: '设备详情',
 //       },
 //     },
 //     {
 //       path: 'otaList',
 //       name: 'otaList',
 //       component: () => import('@/views/deviceManage/otaList'),
 //       meta: {
 //         title: 'OTA文件',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'otadetail',
 //       name: 'otadetail',
 //       hidden: true,
 //       component: () => import('@/views/deviceManage/otadetail'),
 //       meta: {
 //         title: 'OTA升级任务',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'otaUpgradeList',
 //       name: 'otaUpgradeList',
 //       component: () => import('@/views/deviceManage/otaUpgradeList'),
 //       meta: {
 //         title: 'OTA远程升级',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'otaProgress',
 //       name: 'otaProgress',
 //       hidden: true,
 //       component: () => import('@/views/deviceManage/otaProgress'),
 //       meta: {
 //         title: 'OTA升级进度',
 //       },
 //     },
 //     {
 //       path: 'deviceAlarmList',
 //       name: 'deviceAlarmList',
 //       component: () => import('@/views/deviceManage/deviceAlarmList'),
 //       meta: {
 //         title: '设备报警',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'deviceTypeList',
 //       name: 'deviceTypeList',
 //       component: () => import('@/views/deviceManage/deviceTypeList'),
 //       meta: {
 //         title: '设备类型',
 //         keepAlive: true,
 //       },
 //     },
 //     {
 //       path: 'deviceDataPoint',
 //       name: 'deviceDataPoint',
 //       component: () => import('@/views/deviceManage/deviceDataPoint'),
 //       meta: {
 //         title: '设备点位',
 //         keepAlive: true,
 //       },
 //     },
 //   ],
 // },
 // {
 //   path: '/carManage',
 //   component: Layout,
 //   redirect: 'noRedirect',
 //   name: 'carManage',
 //   alwaysShow: true,
 //   meta: {
 //     title: '车辆管理',
 //     icon: 'car-side',
 //     permissions: ['admin'],
 //   },
 //   children: [
 //     {
 //       path: 'carList',
 //       name: 'carList',
 //       component: () => import('@/views/carManage/carList'),
 //       meta: { title: '车辆列表' },
 //     },
 //     {
 //       path: 'videoDetail',
 //       name: 'videoDetail',
 //       hidden: true,
 //       component: () => import('@/views/carManage/videoDetail'),
 //       meta: {
 //         title: '视频详情',
 //       },
 //     },
 //   ],
 // },
 // {
 //   path: '/systemSet',
 //   component: Layout,
 //   redirect: 'noRedirect',
 //   name: 'systemSet',
 //   alwaysShow: true,
 //   meta: {
 //     title: '系统设置',
 //     icon: 'cog',
 //     permissions: ['admin'],
 //   },
 //   children: [
 //     {
 //       path: 'optionAddition',
 //       name: 'optionAddition',
 //       component: () => import('@/views/systemSet/optionAddition'),
 //       meta: { title: '选项添加' },
 //     },
 //     {
 //       path: 'optionAdditionView',
 //       name: 'optionAdditionView',
 //       component: () => import('@/views/systemSet/optionAdditionView'),
 //       meta: { title: '查看选择子级' },
 //       hidden: true,
 //     },
 //     {
 //       path: 'distributionDevice',
 //       name: 'distributionDevice',
 //       component: () => import('@/views/systemSet/distributionDevice'),
 //       meta: {
 //         title: '分配设备',
 //         keepAlive: true
 //       },
 //     },
 //     {
 //       path: 'alarmCode',
 //       name: 'alarmCode',
 //       component: () => import('@/views/systemSet/alarmCode'),
 //       meta: {
 //         title: '报警代码',
 //         keepAlive: true
 //       },
 //     },
 //   ],
 // },
 // {
 //   path: '/userManage',
 //   component: Layout,
 //   redirect: 'noRedirect',
 //   name: 'userManage',
 //   alwaysShow: true,
 //   meta: {
 //     title: '员工管理',
 //     icon: 'user-cog',
 //     permissions: ['admin'],
 //   },
 //   children: [
 //     {
 //       path: 'userList',
 //       name: 'userList',
 //       component: () => import('@/views/userManage/userList'),
 //       meta: {
 //         title: '员工列表',
 //       },
 //     },
 //     {
 //       path: 'userAdd',
 //       name: 'userAdd',
 //       component: () => import('@/views/userManage/userAdd'),
 //       meta: {
 //         title: '新增员工',
 //         // keepAlive: true
 //       },
 //       hidden: true,
 //     },
 //     {
 //       path: 'userEdit',
 //       name: 'userEdit',
 //       component: () => import('@/views/userManage/userEdit'),
 //       meta: { title: '编辑员工' },
 //       hidden: true,
 //     },
 //     {
 //       path: 'organizational',
 //       name: 'organizational',
 //       component: () => import('@/views/userManage/organizational'),
 //       meta: {
 //         title: '组织架构',
 //         keepAlive: true
 //       },
 //     },
 //     {
 //       path: 'roleList',
 //       name: 'roleList',
 //       component: () => import('@/views/userManage/roleList'),
 //       meta: {
 //         title: '角色管理',
 //         keepAlive: true
 //       },
 //     },
 //     {
 //       path: 'powerManage',
 //       name: 'powerManage',
 //       component: () => import('@/views/userManage/powerManage'),
 //       meta: {
 //         title: '权限管理',
 //         keepAlive: true
 //       },
 //     },
 //   ],
 // },
 // {
 //   path: '*',
 //   redirect: '/404',
 //   hidden: true,
 // },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})
//注释的地方是允许路由重复点击，如果你觉得框架路由跳转规范太过严格可选择放开
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

export function resetRouter() {
  router.matcher = new VueRouter({
    base: publicPath,
    mode: routerMode,
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher
}

export default router
