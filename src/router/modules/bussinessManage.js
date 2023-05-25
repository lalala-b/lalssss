/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-14 10:15:10
 * @LastEditTime: 2020-12-24 15:50:03
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

import billAdvManagement from '@/views/bussiness-manage/bill-adv-manage'

const bussinessManage = [{
    path: '/bussiness-manage',
    name: 'commerce_manage',
    text: '商务管理',
    meta: {
      title: '商务管理',
      icon: 'iconyewuguanli'
    },
    alwaysShow: true,
    component: Layout,
    children: [
      {
        name: 'my_team_desk',
        text: '团队工作台',
        meta: {
          title: '团队工作台'
        },
        path: 'my-team-desk',
        component: () => import('@/views/bussiness-manage/my-desk/MyTeamDesk.vue')
      },
      {
        name: 'my_desk',
        text: '我的工作台',
        meta: {
          title: '我的工作台'
        },
        path: 'my-desk',
        component: () => import('@/views/bussiness-manage/my-desk/MineDesk.vue')
      },
      {
        name: 'customer_manage',
        text: '客户管理',
        meta: {
          title: '客户管理'
        },
        path: 'customer-manage',
        component: () => import('@/views/bussiness-manage/customer-manage/customer-manage.vue')
      },
      {
        name: 'bussiness_client_manage',
        text: '客户联系人管理',
        meta: {
          title: '客户联系人管理'
        },
        path: 'client-manage',
        component: () => import('@/views/bussiness-manage/client-manage/client-manage.vue')
      },
      {
        name: 'bill_adv_manage',
        text: '账号商城',
        meta: {
          title: '账号商城'
        },
        path: 'bill-adv-manage',
        // component: () => import('@/views/bussiness-manage/bill-adv-manage')
        component: billAdvManagement
      },
      {
        name: 'business_opportunity_manage',
        text: '商机管理',
        meta: {
          title: '商机管理'
        },
        path: 'business_opportunity_manage',
        component: () => import('@/views/bussiness-manage/business_opportunity/index')
      },
      // {
      //   name: 'bussiness_account',
      //   text: '商务账号库',
      //   meta: {
      //     title: '商务账号库'
      //   },
      //   path: 'bussiness-account',
      //   component: () => import('@/views/bussiness-manage/bussiness-account')
      // },
      {
        name: 'bill_adv_schedule',
        text: '账号工单排期',
        meta: {
          title: '账号工单排期',
          hidden: true
        },
        path: 'bill-adv-schedule',
        component: () => import('@/views/bussiness-manage/bill-adv-manage/schedule')
      },
      {
        name: 'bussiness_bill_manage',
        text: '商单管理',
        meta: {
          title: '商单管理'
        },
        path: 'bill-manage',
        component: () => import('@/views/bussiness-manage/bill-manage/bill-manage')
      },
      {
        name: 'batch_entry',
        text: '批量录单',
        meta: {
          title: '批量录单',
          hidden: true
        },
        path: 'batch-entry',
        component: () => import('@/views/bussiness-manage/batch-entry')
      },
      {
        name: 'bill_adv_detail',
        text: '账号详情',
        meta: {
          title: '账号详情',
          hidden: true
        },
        path: 'bill-adv-detail',
        component: () => import('@/views/bussiness-manage/bill-adv-manage/schedule')
      },
      {
        name: 'bussiness_workorder',
        text: '工单管理',
        meta: {
          title: '工单管理',
          hasTab: true
        },
        // path: 'workorder/:platId?/:accountId?',
        path: 'workorder',
        component: () => import('@/views/bussiness-manage/workorder/index.vue')
      },
      {
        name: 'bussiness-analysis',
        text: '行业营收分布',
        meta: {
          title: '行业营收分布'
        },
        path: 'bussiness-analysis',
        component: () => import('@/views/bussiness-manage/bussinessAnalysis/index.vue')
      },
      {
        name: 'account-track',
        text: '账号赛道分布',
        meta: {
          title: '账号赛道分布',
          hidden: true
        },
        path: 'account-track',
        component: () => import('@/views/sign-manage/@pages/account-track')
      },
      {
        name: 'check_accounts_result',
        text: '核账结果',
        meta: {
          title: '核账结果页',
          hidden: true
        },
        path: 'check-accounts-result',
        component: () => import('@/views/bussiness-manage/checkAccountsResult')
      },
      {
        name: 'bussiness_bill_video',
        text: '商单视频详情',
        meta: {
          title: '商单视频详情',
          hidden: true
        },
        path: 'bill-video',
        component: () => import('@/views/bussiness-manage/bill-video/bill-video')
      }
    ]
  },
  {
    path: '/sign-manage',
    name: 'sign-manage',
    text: '签约管理',
    meta: {
      title: '签约管理',
      icon: 'iconqianyue'
    },
    alwaysShow: true,
    component: Layout,
    children: [{
        name: 'cooperative-project',
        text: '签约订单管理',
        meta: {
          title: '签约订单管理'
        },
        path: 'cooperative-project',
        component: () => import('@/views/sign-manage/@pages/cooperative-project')
      },
      {
        name: 'sign-progress',
        text: '签约流程管理',
        meta: {
          title: '签约流程管理'
        },
        path: 'sign-progress',
        component: () => import('@/views/sign-manage/@pages/sign-progress')
      },
      {
        name: 'sign-contract-accounts',
        text: '签约账号库',
        meta: {
          title: '签约账号库'
        },
        path: 'sign-contract-accounts',
        component: () => import('@/views/sign-manage/@pages/sign-contract/accounts/index.vue')
      },
      {
        name: 'sign-track-analysis',
        text: '签约数据分析',
        meta: {
          title: '签约数据分析'
        },
        path: 'sign-track-analysis',
        component: () => import('@/views/sign-manage/@pages/sign-track')
      }
    ]
  },
  {
    path: '/medium-manage',
    name: 'medium-manage',
    text: '媒介管理',
    meta: {
      title: '媒介管理',
      icon: 'iconmeijieguanli'
    },
    alwaysShow: true,
    component: Layout,
    children: [{
        name: 'medium-order',
        text: '媒介订单管理',
        meta: {
          title: '媒介订单管理'
        },
        path: 'medium-order',
        component: () => import('@/views/medium-manage/order')
      },
      {
        name: 'medium_account',
        text: '媒介账号库',
        meta: {
          title: '媒介账号库'
        },
        path: 'medium-account',
        component: () => import('@/views/bussiness-manage/advertising/_pages/medium-account')
      },
      {
        name: 'adv_medium_video',
        text: '媒介视频库',
        meta: {
          title: '媒介视频库'
        },
        path: 'medium-adv-video',
        component: () => import('@/views/bussiness-manage/advertising/_pages/medium-video')
      },
      {
        name: 'medium_org_manage',
        text: '媒介供应商管理',
        meta: {
          title: '媒介供应商管理'
        },
        path: 'medium-org-manage',
        component: () => import('@/views/bussiness-manage/advertising/_pages/medium-org-manage')
      }
      // {
      //   name: 'medium_account_analysis',
      //   text: '媒介账号分析',
      //   meta: {
      //     title: '媒介账号分析'
      //   },
      //   path: 'medium-account-analysis',
      //   component: () => import('@/views/bussiness-manage/advertising/_pages/medium-account-analysis')
      // }
    ]
  },
  {
    path: '/advertising',
    component: Layout,
    name: 'bussiness_advertising',
    meta: {
      title: '广告系统',
      hasTab: true,
      hidden: true
    },
    children: [
      {
        name: 'bussiness_advertising',
        text: '广告系统',
        meta: {
          title: '广告系统',
          hasTab: true,
          hidden: true
        },
        path: '',
        component: () => import('@/views/bussiness-manage/advertising/advertising')
      }
    ]
  },
  {
    path: '/order-account-detail',
    component: Layout,
    name: 'order_account_detail',
    meta: {
      hidden: true
    },
    children: [
      {
        name: 'order_account_detail',
        text: '投放账号详情',
        meta: {
          title: '投放账号详情',
          hidden: true
        },
        path: '',
        component: () => import('@/views/bussiness-manage/orderAccountDetail')
      }
    ]
  }
]

export default bussinessManage
