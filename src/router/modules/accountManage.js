/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-22 15:30:32
 * @LastEditTime: 2020-11-24 17:16:42
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const accountManage = {
  path: '/account-manage',
  name: 'account_manage',
  component: Layout,
  text: '账号监控',
  meta: {
    title: '账号监控',
    icon: 'iconzhanghaojiankong'
  },
  alwaysShow: true,
  children: [
    {
      name: 'my_account',
      text: '我的账号',
      meta: {
        title: '我的账号'
      },
      path: 'my-account',
      component: () => import('@/views/account-manage/my-account/index.vue')
    },
    {
      name: 'team_account',
      text: '团队账号',
      meta: {
        title: '团队账号'
      },
      path: 'team-account',
      component: () => import('@/views/account-manage/team-account/team-account.vue')
    },
    {
      text: '账号详情',
      meta: {
        title: '账号详情',
        hidden: true
      },
      path: 'account-detail',
      component: () => import('@/views/account-manage/account-detail/account-detail.vue')
    },
    {
      name: 'bench_mark',
      text: '对标账号',
      meta: {
        title: '对标账号',
        hasTab: true
      },
      path: 'bench-mark',
      component: () => import('@/views/account-manage/bench-mark/bench-mark.vue')
    }

  ]
}

export default accountManage
