/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-18 16:35:09
 * @LastEditTime: 2020-12-18 10:46:17
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const backendManage = {
  path: '/sys-manage',
  component: Layout,
  name: 'sys_manage',
  text: '系统管理',
  meta: {
    title: '系统管理',
    icon: 'iconxitongguanli'
  },
  alwaysShow: true,
  children: [
    {
      name: 'backend_manage_authority',
      text: '组织管理',
      meta: {
        title: '组织管理'
      },
      path: 'authority',
      component: () => import('@/views/sys-manage/organization/organization.vue')
    },
    {
      name: 'history_budget',
      text: '历史预算管理',
      meta: {
        title: '历史预算管理'
      },
      path: 'history-budget',
      component: () => import('@/views/putting-manager/budget-manage/history.vue')
    },
    {
      path: 'data-sql',
      name: 'data_sql',
      text: '数据域',
      meta: {
        title: '数据域'
      },
      component: () => import('@/views/sys-manage/data-sql/index.vue')
    },
    {
      path: 'config-manage',
      name: 'config_manage',
      text: '配置信息管理',
      meta: {
        title: '配置信息管理'
      },
      component: () => import('@/views/sys-manage/config-manage/index.vue')
    },
    {
      path: 'dictionaries',
      name: 'dictionaries',
      text: '字典表',
      meta: {
        title: '字典表'
      },
      component: () => import('@/views/sys-manage/dictionaries/index.vue')
    },
    {
      path: 'dictionaries/:dictType',
      name: 'dic_data',
      text: '字典列表',
      meta: {
        title: '字典列表',
        hidden: true
      },
      component: () => import('@/views/sys-manage/dictionaries/list.vue')
    },
    {
      path: 'api-control',
      name: 'api_control',
      text: '接口访问控制',
      meta: {
        title: '接口访问控制'
      },
      component: () => import('@/views/sys-manage/api-control')
    },
    {
      path: 'api-log',
      name: 'apiLog',
      text: '接口日志',
      meta: {
        title: '接口日志'
      },
      component: () => import('@/views/sys-manage/api-log')
    },
    {
      path: 'video-type-manage',
      name: 'video_type_manage',
      text: '视频类型管理',
      meta: {
        title: '视频类型管理'
      },
      component: () => import('@/views/sys-manage/video-type-manage')
    },
    {
      path: 'video-org-manage',
      name: 'video_org_manage',
      text: '视频类型绑定',
      meta: {
        title: '视频类型绑定'
      },
      component: () => import('@/views/sys-manage/video-org-manage')
    },
    {
      path: 'event',
      name: 'event',
      text: '数据统计',
      meta: {
        title: '数据统计',
        url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=6acdd6fd-67a3-4148-a88d-8097568a107b&accessToken=2119ec02a75a5152c19178ebe8db7924'
      },
      component: () => import('@/views/data-manage/iframe')
    }
  ]
}

export default backendManage
