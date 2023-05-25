import Vue from 'vue'
import Router from 'vue-router'
import jsCookie from 'js-cookie'
import qs from 'qs'
import dayjs from 'dayjs'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { Message } from 'element-ui'
import store from '../store'
import { DEFAULT_LOG_MESSAGE, upLog } from '../log'
import { $getRecommendLimitInfo } from '@/api'
import { checkMenuPermission } from '@/permission'

Vue.use(Router)
const originalReplace = Router.prototype.replace
Router.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)
}
/* Layout */
import Layout from '@/layout'

/* Router Modules */
import videoManage from './modules/videoManage'
import accountManage from './modules/accountManage'
import militaryManage from './modules/militaryManage'
import dyManage from './modules/dyManage'
// import ksManage from './modules/ksManage'
import backendManage from './modules/backendManage'
import sysManage from './modules/sysManage'
import bussinessManage from './modules/bussinessManage'
import puttingManage from './modules//puttingManage'
import dataManage from './modules/dataManage'
import qpDataManage from './modules/qpDataManage'
import businessQp from './modules/businessQp'
import commentMonitor from './modules/commentMonitor'
export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/login',
    meta: {
      title: '登录',
      hidden: true
    },
    component: () => import('@/views/login/login')
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
    meta: {
      hidden: true
    }
  }
]

/**
 * asyncRoutes
 * 动态加载的路由 根据后端返回的权限列表做筛选
 */
export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    name: 'index',
    children: [
      {
        path: '',
        name: 'index',
        text: '首页',
        meta: {
          title: '首页',
          icon: 'iconshouye'
        },
        component: () => import('@/views/index/index.vue')
      }
    ]
  },
  qpDataManage,
  dataManage,
  businessQp,
  {
    path: '/qp/home',
    name: 'test-microapp',
    component: Layout,
    text: '测试微前端',
    children: [
      {
        path: '',
        name: 'test-microapp',
        text: '测试微前端',
        meta: {
          title: '测试微前端',
          icon: 'iconshouye'
        },
        component: () => import('@/views/microapp/index.vue')
      }
    ]
  },
  {
    path: '/fe/create',
    name: 'fe-create',
    component: Layout,
    text: '页面定制化',
    children: [
      {
        path: '',
        name: 'fe-create',
        text: '页面定制化',
        meta: {
          title: '页面定制化',
          icon: 'iconshouye'
        },
        component: () => import('@/views/fe/index.vue')
      }
    ]
  },
  videoManage,
  accountManage,
  commentMonitor,
  puttingManage,
  ...bussinessManage,
  {
    name: 'operations_management',
    text: '运营管理',
    meta: {
      title: '运营管理',
      icon: 'iconyunyingguanli'
    },
    path: '/operations_management',
    alwaysShow: true,
    component: Layout,
    children: [
      {
        name: 'order_management',
        text: '工作室订单管理',
        meta: {
          title: '工作室订单管理'
        },
        path: 'order-management',
        component: () => import('@/views/bussiness-manage/order-management/index')
      },
      {
        name: 'studio_operate_accounts',
        text: '工作室账号库',
        meta: {
          title: '工作室账号库'
        },
        path: 'studio_operate_accounts',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/studioAccount/index.vue')
      },
      {
        name: 'my_operating_account',
        text: '运营的账号',
        meta: {
          title: '运营的账号'
        },
        path: 'my_operating_account',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/pirateAccount/index.vue')
      },
      {
        name: 'studio-analysis',
        text: '工作室数据分析',
        meta: {
          title: '工作室数据分析'
        },
        path: 'studio-analysis',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/studioAnalysis/index.vue')
      },
      {
        name: 'my_application',
        text: '我的申请',
        meta: {
          title: '我的申请'
        },
        path: 'my_application',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/myApplication.vue')
      },
      {
        name: 'my_to_do',
        text: '全部申请',
        meta: {
          title: '全部申请'
        },
        path: 'my_to_do',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/myToDo/myToDo.vue')
      },
      {
        path: '/account-count',
        name: 'backend_account_count',
        text: '账号盘点库',
        meta: {
          title: '账号盘点库'
        },
        component: () => import('@/views/account-manage/account-count/index.vue')
      },
      {
        name: 'transfer_application',
        text: '移交申请',
        meta: {
          title: '移交申请',
          hidden: true
        },
        path: 'transfer_application',
        component: () => import('@/views/bussiness-manage/operations_management/@pages/transferApplication.vue')
      },
      {
        name: 'phone-database',
        text: '手机数据库',
        meta: {
          title: '手机数据库'
        },
        path: 'phone-database',
        component: () => import('@/views/bussiness-manage/phoneDataBase/phoneDataBase.vue')
      }
    ]
  },
  {
    path: '/adlib',
    component: Layout,
    name: 'adlib',
    meta: {
      title: '广告库',
      icon: 'iconguanggaoku'
    },
    children: [
      {
        name: 'adlib',
        text: '广告库',
        meta: {
          title: '广告库'
        },
        path: '',
        component: () => import('@/views/bussiness-manage/advertising/_pages/adlib')
      }
    ]
  },
  {
    path: '/pirate',
    name: 'pirate',
    component: Layout,
    text: '风云榜',
    meta: {
      title: '风云榜',
      icon: 'iconfengyunbang'
    },
    children: [
      {
        name: 'pirate_flow',
        text: '流量榜',
        meta: {
          title: '流量榜',
          text: '流量榜'
        },
        path: 'flow',
        component: () => import('@/views/pirate/flow/flow.vue')
      },
      {
        name: 'pirate_fans',
        text: '粉丝榜',
        meta: {
          title: '粉丝榜',
          text: '粉丝榜'
        },
        path: 'fans',
        component: () => import('@/views/pirate/fans/fans.vue')
      },
      // {
      //   name: 'order_randing',
      //   text: '投放榜',
      //   meta: {
      //     title: '投放榜',
      //     text: '投放榜'
      //   },
      //   path: 'orderRanking',
      //   component: () => import('@/views/pirate/orderRanking')
      // },
      {
        name: 'surge',
        text: '飙升榜',
        meta: {
          title: '飙升榜',
          text: '飙升榜'
        },
        path: 'surge',
        component: () => import('@/views/pirate/surge')
      }
    ]
  },
  militaryManage,
  {
    path: '/manage-accounts',
    component: Layout,
    name: 'manage_accounts',
    text: '达人库',
    meta: {
      title: '达人库',
      icon: 'iconliuliang_fil'
    },
    children: [
      {
        name: 'dy_talent_bank',
        text: '新抖音达人库',
        meta: {
          title: '新抖音达人库'
        },
        path: 'new-tiktok-accounts',
        component: () => import('@/views/dy-manage/talent-bank/accounts')
      },
      {
        name: 'dy_manage_accounts',
        text: '抖音达人库',
        meta: {
          title: '抖音达人库'
        },
        path: 'tiktok-accounts',
        component: () => import('@/views/dy-manage/accounts/accounts')
      },
      {
        name: 'ks_manage_accounts',
        text: '快手达人库',
        meta: {
          title: '快手达人库'
        },
        path: 'ks-accounts',
        component: () => import('@/views/ks-manage/talent')
      }
    ]
  },
  dyManage,
  // ksManage,
  {
    path: '/marketing',
    component: Layout,
    name: 'marketing',
    children: [
      {
        name: 'marketing',
        path: '',
        text: '学习库',
        meta: {
          title: '学习库',
          icon: 'iconxuexiku'
        },
        component: () => import('@/views/marketing/marketing.vue')
      }
    ]
  },
  {
    path: '/announcements',
    name: 'announcements',
    component: Layout,
    children: [
      {
        path: '',
        name: 'announcements',
        text: '公告消息',
        meta: {
          title: '公告消息',
          icon: 'icongonggaoxiaoxi'
        },
        component: () => import('@/views/announcements/announcements.vue')
      }
    ]
  },
  backendManage,
  // {
  //   path: '/sign-contract',
  //   name: 'sign-contract',
  //   component: Layout,
  //   alwaysShow: true,
  //   text: '签约管理',
  //   meta: {
  //     title: '签约管理',
  //     icon: 'iconyewuguanli'
  //   },
  //   children: [
  //     {
  //       path: 'sign-contract-accounts',
  //       name: 'sign-contract-accounts',
  //       text: '签约账号库',
  //       meta: {
  //         title: '签约账号库',
  //         icon: 'icongonggaoxiaoxi'
  //       },
  //       component: () => import('@/views/sign-contract/accounts/index.vue')
  //     }
  //   ]
  // },
  sysManage,
  {
    path: '/details',
    component: Layout,
    name: 'details',
    children: [
      {
        name: 'account_details',
        text: '账号详情',
        meta: {
          title: '账号详情'
        },
        path: 'account/:platId/:accountId',
        component: () => import('@/views/details/account/'),
        hidden: true
      },
      {
        name: 'bilibili_account_details',
        text: 'b站账号详情',
        meta: {
          title: 'b站账号详情'
        },
        path: 'bilibili-account/:platId/:accountId',
        component: () => import('@/views/details/BilibiliAccount'),
        hidden: true
      },
      {
        name: 'red_book_account_details',
        text: '小红书账号详情',
        meta: {
          title: '小红书账号详情'
        },
        path: 'red-book-account/:platId/:accountId',
        component: () => import('@/views/details/RedBookAccount'),
        hidden: true
      },
      {
        name: 'video_details',
        text: '视频详情',
        meta: {
          title: '视频详情'
        },
        path: 'video/:flowId/:accountId',
        component: () => import('@/views/details/video'),
        hidden: true
      }
    ],
    meta: {
      hidden: true
    }
  }
]

// 遍历路由，生成组件路径与名称映射
// const deepTree = (data, arr = []) => {
//   for (let i = 0; i < data.length; i++) {
//     const item = data[i]
//     if (item.componentFile) {
//       arr.push({ name: item.name, componentFile: item.componentFile })
//     }
//     // console.info(item.componentFile)
//     // item.componentFile = item.component.replace(/\(|)/g, '')

//     if (item.children && item.children.length) {
//       deepTree(item.children, arr)
//     }
//   }
//   return arr
// }
// let arr = []
// const aList = deepTree(asyncRoutes, arr = [])
// const newMapList = []
// arr.forEach(item => {
//   newMapList.push([item.name + '', item.componentFile + ''])
// })
// console.info(JSON.stringify(newMapList))

export const checkRouter = (path) => {
    return !!router.getRoutes().find(item => item.path === path)
}

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

NProgress.configure({ showSpinner: false })

const jumpUrl = (to, from, next, needReturn) => {
  // 每次路由改变时要清空上次上报的路由，在这里做处理是为了不需要在子应用中每个页面都加入第一次请求，总的原因是为了避免多次请求导致重复上报
  window.localStorage.setItem('lastPerformanceUrl', '')

  if ((to.fullPath.indexOf('/qp/') === 0 && from.fullPath.indexOf('/qp/')) === 0) {
    if (needReturn) {
      return setTimeout(() => {
        next()
      })
    }
    setTimeout(() => {
      next()
    })
  } else {
    if (needReturn) {
      return next()
    }
    return next()
  }
}

const checkTaskisThrough = async function(to, from, next) {
    let recommendLimit = localStorage.getItem('recommendLimit')
    recommendLimit && (recommendLimit = JSON.parse(recommendLimit))

    if (recommendLimit && recommendLimit.expires > new Date().getTime() && recommendLimit.limit === 0) {
      return jumpUrl(to, from, next)
    } else {
      if (to.path === '/putting-manager/account-recommend' || to.path.includes('/dy-manage/details')) {
        return jumpUrl(to, from, next)
      }
      const res = await $getRecommendLimitInfo()
      localStorage.setItem('recommendLimit', JSON.stringify({
        expires: dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf(),
        limit: res.data.count
      }))
      if (res.data.count === 0 || !checkMenuPermission('account_recommend')) {
        return jumpUrl(to, from, next)
      }
      if (from.path === '/putting-manager/account-recommend') {
        Message.error(`当前剩余${res.data.count}个账号未反馈推荐结果！请先完成推荐账号反馈。`)
      } else {
        Message.error(`请先完成推荐账号反馈`)
      }
      next(`/putting-manager/account-recommend`)
      NProgress.done()
    }
}

const checkThrough = function(to, from, next) {
  // if (store.state.user.userInfo.passwordLimitFlag === 1) {
  //   checkPassworldThrough(to, from, next)
  // } else
  if (store.state.user.userInfo.dailyQueryRecommendPuttingAccountFlag === 1) {
    checkTaskisThrough(to, from, next)
  } else {
    // 对微前端之间相互的的跳转加入延时，打入异步任务队列中的原因是为了确保微应用在卸载之后再去跳转路由，避免产生微应用的重复渲染
    jumpUrl(to, from, next)
  }
}

router.beforeEach(async(to, from, next) => {
  store.commit('user/SET_MICROAPP', true)

  // 判断是不是在同一个tab页
  if (from.path !== to.path) {
    // 清除上一个等待的请求
    store.dispatch('http/removeAllPending')
  }
  if (to.query._blank) {
    // 新界面打开
    delete to.query._blank
    window.open(`#${to.path}?${qs.stringify(to.query)}`)
    return
  }
  NProgress.start()
  // 判断是否登录
  if (jsCookie.get('sso_uid')) {
    Vue.prototype.$componentId = to.meta.componentId
    checkThrough(to, from, next)
    // next()
  } else {
    if (to.path === '/login' || to.path === '/test') {
      next()
    } else {
      next('/login')
    }
  }
})

router.afterEach((to, from, next) => {
  store.commit('user/SET_MICROAPP', false)
  // console.log(to, from)
  if (to.meta.hasTab && !to.query.tabName) {
    // 防止重定向时上报两次日志
    return NProgress.done()
  }
  if (to.query.tabName) {
    // 判断是否是table页
    DEFAULT_LOG_MESSAGE.properties.tabName = to.query.tabName
  } else {
    DEFAULT_LOG_MESSAGE.properties.tabName && delete DEFAULT_LOG_MESSAGE.properties.tabName
  }
  DEFAULT_LOG_MESSAGE.page_title = to.meta.title && to.meta.title.replace(' ', '')
  DEFAULT_LOG_MESSAGE.page_id = to.path
  const params = { ...DEFAULT_LOG_MESSAGE }
  params.event_time = new Date().getTime()
  params.properties = { ...to.query, ...to.params }
  params.properties.operation_module = '查看'
  upLog(params)
  NProgress.done()
})

export default router
