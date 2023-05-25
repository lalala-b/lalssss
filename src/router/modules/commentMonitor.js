/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-22 15:30:32
 * @LastEditTime: 2020-11-24 17:16:42
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const commentMonitor = {
  path: '/comment-monitor',
  name: 'comment_monitor',
  component: Layout,
  text: '评论监控',
  meta: {
    title: '评论监控',
    icon: 'iconjiankongzhongxin'
  },
  alwaysShow: true,
  children: [
    {
      name: 'account_monitor_manage',
      text: '监控账号管理',
      meta: {
        title: '监控账号管理'
      },
      path: '/account-monitor-manage',
      component: () => import('@/views/comment-monitor/account-monitor-manage/account-monitor-manage.vue')
    },
    {
      name: 'account_comment_manage',
      text: '评论账号管理',
      meta: {
        title: '评论账号管理'
      },
      path: '/account-comment-manage',
      component: () => import('@/views/comment-monitor/account-comment-manage/account-comment-manage.vue')
    },
    {
      name: 'video_monitor_manage',
      text: '监控视频管理',
      meta: {
        title: '监控视频管理'
      },
      path: '/video-monitor-manage',
      component: () => import('@/views/comment-monitor/video-monitor-manage/video-monitor-manage.vue')
    },
    {
      name: 'comment_manage',
      text: '评论管理',
      meta: {
        title: '评论管理'
      },
      path: '/comment-manage',
      component: () => import('@/views/comment-monitor/comment-manage/comment-manage.vue')
    }
  ]
}

export default commentMonitor
