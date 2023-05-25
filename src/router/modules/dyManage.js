/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-12-30 17:25:08
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const dyManage = {
  path: '/dy-manage',
  component: Layout,
  name: 'dy_manage',
  text: '抖音素材库',
  meta: {
    title: '抖音素材库',
    icon: 'icondouyin',
    hidden: true
  },
  alwaysShow: true,
  children: [
    // {
    //   name: 'ranking_dy_video',
    //   text: '抖音视频热榜',
    //   meta: {
    //     title: '抖音视频热榜',
    //     hasTab: true
    //   },
    //   path: 'video',
    //   component: () => import('@/views/dy-manage/ranking-dy-video/ranking-dy-video')
    // },
    // {
    //   name: 'ranking_quote_expert',
    //   text: '星图达人热榜',
    //   meta: {
    //     title: '星图达人热榜',
    //     hasTab: true
    //   },
    //   path: 'expert',
    //   component: () => import('@/views/dy-manage/ranking-quote-expert/ranking-quote-expert')
    // },
    // {
    //   name: 'ranking_dy_adv',
    //   text: '星图广告热榜',
    //   meta: {
    //     title: '星图广告热榜'
    //   },
    //   path: 'adv',
    //   component: () => import('@/views/dy-manage/ranking-dy-adv/ranking-dy-adv')
    // },
    {
      name: 'dy_manage_accounts',
      text: '抖音达人库',
      meta: {
        title: '抖音达人库',
        hidden: true
      },
      path: 'accounts',
      component: () => import('@/views/dy-manage/accounts/accounts')
    },
    // {
    //   name: 'dy_manage_videos',
    //   text: '搜视频',
    //   meta: {
    //     title: '搜视频'
    //   },
    //   path: 'videos',
    //   component: () => import('@/views/dy-manage/videos/videos')
    // },
    // {
    //   name: 'contend',
    //   text: '竞品监控',
    //   meta: {
    //     title: '竞品监控'
    //   },
    //   path: 'contend',
    //   component: () => import('@/views/dy-manage/contend')
    // },
    // {
    //   name: 'dy_talent',
    //   text: '抖音达人榜',
    //   meta: {
    //     title: '抖音达人榜'
    //   },
    //   path: 'talent',
    //   component: () => import('@/views/dy-manage/talent')
    // },
    // {
    //   name: 'dy_hot',
    //   text: '抖音热点',
    //   meta: {
    //     title: '抖音热点'
    //   },
    //   path: '/hot',
    //   component: () => import('@/views/dy-manage/hot')
    // },
    {
      name: 'dy_manage_details',
      text: '账号详情',
      meta: {
        title: '账号详情',
        hidden: true
      },
      path: 'details/:accountId',
      component: () => import('@/views/dy-manage/details/details')
    }
  ]
}

export default dyManage
