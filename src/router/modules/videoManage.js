/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-22 15:30:32
 * @LastEditTime: 2020-11-24 16:22:57
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const videoManage = {
  path: '/video-manage',
  component: Layout,
  name: 'video_manage',
  text: '视频监测',
  meta: {
    title: '视频监测',
    icon: 'iconbofang_circle',
    roles: []
  },
  alwaysShow: true,
  children: [
    {
      name: 'my_video',
      text: '我的视频',
      meta: {
        title: '我的视频'
      },
      path: 'my-video',
      component: () => import('@/views/video-manage/my-video/my-video.vue')
    },
    {
      name: 'team_video',
      text: '团队视频',
      meta: {
        title: '团队视频'
      },
      path: 'team-video',
      component: () => import('@/views/video-manage/team-video/team-video.vue')
    },
    {
      name: 'bench_mark_video',
      text: '对标视频',
      meta: {
        title: '对标视频',
        hasTab: true
      },
      path: 'bench-mark-video',
      component: () => import('@/views/video-manage/bench-mark/bench-mark.vue')
    }
  ]
}

export default videoManage
