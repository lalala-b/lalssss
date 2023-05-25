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
  path: '/ks-manage',
  component: Layout,
  text: '快手素材库',
  name: 'ks_manage',
  meta: {
    title: '快手素材库',
    icon: 'iconziyuan1'
  },
  alwaysShow: true,
  children: [
    {
      name: 'ks_manage_accounts',
      text: '快手达人库',
      meta: {
        title: '快手达人库'
      },
      path: 'accounts',
      component: () => import('@/views/ks-manage/talent')
    }
    // {
    //   name: 'ks_ranking_quote_expert',
    //   text: '快手达人热榜',
    //   meta: {
    //     title: '快手达人热榜',
    //     hasTab: true
    //   },
    //   path: 'expert',
    //   component: () => import('@/views/ks-manage/ranking-quote-expert/ranking-quote-expert')
    // }
  ]
}

export default dyManage
