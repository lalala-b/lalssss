/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-08 19:50:54
 * @LastEditTime: 2020-12-14 17:08:00
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const militaryManage = {
  path: '/military-manage',
  component: Layout,
  name: 'military_manage',
  text: '军功系统',
  meta: {
    title: '军功系统',
    icon: 'iconjungongzhang'
  },
  alwaysShow: true,
  children: [
    {
      name: 'military_video_mark',
      text: '视频标记',
      meta: {
        title: '视频标记',
        hasTab: true
      },
      path: 'video-mark',
      component: () => import('@/views/military-manage/video-mark/video-mark.vue')
    },
    {
      name: 'military_search',
      text: '军功查询',
      meta: {
        title: '军功查询',
        hasTab: true
      },
      path: 'search',
      component: () => import('@/views/military-manage/search/search.vue')
    },
    {
      name: 'military_audit',
      text: '军功审核',
      meta: {
        title: '军功审核',
        hasTab: true
      },
      path: 'audit',
      component: () => import('@/views/military-manage/audit/audit.vue')
    },
    {
      name: 'military_control',
      text: '军功流程',
      meta: {
        title: '军功流程'
      },
      path: 'control',
      component: () => import('@/views/military-manage/military_control')
    }
  ]
}

export default militaryManage
