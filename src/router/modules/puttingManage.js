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
  path: '/putting-manager',
  component: Layout,
  name: 'putting_manager',
  text: '投放管理',
  meta: {
    title: '投放管理',
    icon: 'icontoufangguanli'
  },
  alwaysShow: true,
  children: [{
      name: 'account_recommend',
      text: '推荐账号',
      meta: {
        title: '推荐账号'
      },
      path: 'account-recommend',
      component: () => import('@/views/putting-manager/account-recommend')
    },
    {
      name: 'putting_account_list',
      text: '投放账号库列表',
      meta: {
        title: '投放账号库列表'
      },
      // hidden: true,
      path: 'account-list',
      component: () => import('@/views/putting-manager/putting-account/index')
    },
    {
      name: 'demand-pool',
      text: '投放需求池',
      meta: {
        title: '投放需求池'
      },
      path: 'demand-pool',
      component: () => import('@/views/putting-manager/demand-pool')
    },
    {
      name: 'putting_ordera_list',
      text: '投放订单列表',
      meta: {
        title: '投放订单列表'
      },
      // hidden: true,
      path: 'order-list',
      component: () => import('@/views/putting-manager/putting-order/list')
    },
    {
      name: 'putting_video_list',
      text: '投放视频列表',
      meta: {
        title: '投放视频列表'
      },
      // hidden: true,
      path: 'video-list',
      component: () => import('@/views/putting-manager/putting-video/index')
    },

    {
      name: 'drop_video_library',
      text: '新投放视频库',
      meta: {
        title: '新投放视频库'
      },
      path: 'drop-video-library',
      component: () => import('@/views/putting-manager/drop-video-library')
    },

    {
      name: 'abnormal_complaints',
      text: '异常申诉管理',
      meta: {
        title: '异常申诉管理'
      },
      path: 'abnormal-complaints',
      component: () => import('@/views/putting-manager/abnormal-complaints')
    },
    {
      name: 'component_click_transform',
      text: '订单转换查询',
      meta: {
        title: '订单转换查询'
      },
      path: 'component-click',
      component: () => import('@/views/putting-manager/component-click')
    },
    {
      name: 'component_click_detail',
      text: '订单投后详情',
      meta: {
        title: '订单投后详情',
        hidden: true
      },
      path: 'component-detail',
      component: () => import('@/views/putting-manager/component-detail')
    },
    {
      name: 'putting_ranking',
      text: '投放榜',
      meta: {
        title: '投放榜'
      },
      // hidden: true,
      path: 'ranking-list',
      component: () => import('@/views/putting-manager/puttiing-ranking/index')
    },
    {
      name: 'putting_order_detail',
      text: '投放订单详情',
      meta: {
        title: '投放订单详情',
        hidden: true
      },
      path: 'order-detail',
      component: () => import('@/views/putting-manager/putting-order/detail/index')
    },
    {
      name: 'putting_xingtu_detail',
      text: '星图详情页',
      meta: {
        title: '星图详情页',
        hidden: true
      },
      path: 'xingtu-detail',
      component: () => import('@/views/putting-manager/putting-order/xingtuDetail/index')
    },
    {
      name: 'putting_juxing_detail',
      text: '聚星详情页',
      meta: {
        title: '聚星详情页',
        hidden: true
      },
      path: 'juxing-detail',
      component: () => import('@/views/putting-manager/putting-order/juxingDetail/index')
    },
    {
      name: 'putting_budget_manage',
      text: '投放预算管理',
      meta: {
        title: '投放预算管理'
      },
      path: 'budget-manage',
      component: () => import('@/views/putting-manager/budget-manage')
    },
    {
      name: 'putting_appoint',
      text: '投放专员指派',
      meta: {
        title: '投放专员指派'
      },
      path: 'putting-appoint',
      component: () => import('@/views/putting-manager/putting_appoint')
    }

    //
  ]
}

export default backendManage
