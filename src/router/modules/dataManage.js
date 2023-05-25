import Layout from '@/layout'
import routerView from '@/layout/components/routerView'

export default {
  path: '/data-manage',
  name: 'data_manage',
  component: Layout,
  text: '海盗数据看板',
  meta: {
    title: '海盗数据看板',
    icon: 'iconshujukanban'
  },
  children: [
    {
      name: 'pirate_operating',
      text: '海盗运营看板',
      meta: {
        title: '海盗运营看板'
      },
      alwaysShow: true,
      path: 'pirate-operating',
      component: routerView,
      children: [
        {
          name: 'trend_analysis',
          text: '趋势分析',
          meta: {
            title: '趋势分析'
          },
          path: 'trend-analysis',
          component: () => import('@/views/data-manage/@pages/pirate-operating/trend-analysis')
        },
        {
          name: 'periodic_repeat',
          text: '周期性复盘',
          meta: {
            title: '周期性复盘'
          },
          path: 'periodic-repeat',
          component: () => import('@/views/data-manage/@pages/pirate-operating/periodic-review')
        },
        {
          name: 'b2c_weekly',
          text: 'B2C机型分发周报',
          meta: {
            title: 'B2C机型分发周报',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=79862543-142a-4b44-93f0-ecba1301dc99&accessToken=480d7ca4f5332b35af6f0ed112ac4dfc&dd_orientation=auto'
          },
          path: 'b2c-weekly',
          component: () => import('@/views/data-manage/iframe')
        }
      ]
    },
    {
      name: 'pirate_putting',
      text: '海盗投放看板',
      meta: {
        title: '海盗投放看板'
      },
      path: 'pirate-putting',
      component: routerView,
      children: [
        {
          name: 'periodic_review',
          text: '周期性复盘',
          meta: {
            title: '周期性复盘'
          },
          path: 'periodic-review',
          component: () => import('@/views/data-manage/@pages/periodic-review')
        },
        {
          name: 'trend_analyse',
          text: '趋势分析',
          meta: {
            title: '趋势分析'
          },
          path: 'trend-analyse',
          component: () => import('@/views/data-manage/iframe/trend-analyse')
        },
        {
          name: 'A2_A5_consume_schedule',
          text: '消耗进度',
          meta: {
            title: '消耗进度'
          },
          path: 'A2-A5-consume-schedule',
          component: () => import('@/views/data-manage/@pages/consumption-of-progress')
        },
        // {
        //   name: 'pirate_putting_week',
        //   text: '周复盘',
        //   meta: {
        //     title: '周复盘'
        //   },
        //   path: 'pirate-putting-week',
        //   component: () => import('@/views/data-manage/@pages/fund-week-data')
        // },
        {
          name: 'week-code',
          text: '周复盘',
          meta: {
            title: '周复盘'
          },
          path: 'pirate-putting-week1',
          component: () => import('@/views/data-manage/@pages/fund-week-data1')
        },
        {
          name: 'week-trendContrast',
          text: '周趋势对比',
          meta: {
            title: '周趋势对比',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=1ffdf3db-c178-416a-b361-334d897d01c4&accessToken=b10217f48b0507524f9f6ed872a6450f'
          },
          path: 'pirate-putting-trendContrast',
          component: () => import('@/views/data-manage/iframe')
        },
        // {
        //   name: 'pirate_putting_month',
        //   text: '月复盘',
        //   meta: {
        //     title: '月复盘'
        //   },
        //   path: 'pirate-putting-month',
        //   component: () => import('@/views/data-manage/@pages/fund-month-data')
        // },
        {
          name: 'pirate_increase',
          text: '投放金额及口令新增',
          meta: {
            title: '投放金额及口令新增',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=d628a065-8752-49a3-938b-327ef223b5dd&accessToken=b8df31d3f0140dd41aaeed5e6735ab55'
          },
          path: 'pirate-increase',
          component: () => import('@/views/data-manage/iframe')
        },
        {
          name: 'demand_order',
          text: '需求订单看板',
          meta: {
            title: '需求订单看板',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=14b244a7-530e-4955-9ef6-dc4859e23c7b&accessToken=4788af290675eaa9459472fbc0f2a1f0'
          },
          path: 'demand-order',
          component: () => import('@/views/data-manage/iframe')
        }
      ]
    },
    {
      name: 'pirate_self',
      text: '海盗自营看板',
      meta: {
        title: '海盗自营看板'
      },
      path: 'pirate-self',
      component: routerView,
      children: [
        {
          name: 'pirate_self_week',
          text: '周复盘',
          meta: {
            title: '周复盘'
          },
          path: 'pirate-self-week',
          component: () => import('@/views/data-manage/@pages/group-week-data')
        },
        {
          name: 'pirate_self_month',
          text: '月复盘',
          meta: {
            title: '月复盘'
          },
          path: 'pirate-self-month',
          component: () => import('@/views/data-manage/@pages/group-month-data')
        },
        {
          name: 'pirate_sop_distribution',
          text: 'SOP分发周报',
          meta: {
            title: 'SOP分发周报'
          },
          path: 'pirate-sop-distribution',
          component: () => import('@/views/data-manage/@pages/pirate-sop-distribution')
        },
        {
          name: 'pirate_self_custom',
          text: '定制看板',
          meta: {
            title: '定制看板'
          },
          path: 'pirate-self-custom',
          component: () => import('@/views/data-manage/@pages/self-week-data')
        }
      ]
    },
    // {
    //   name: 'qp_business',
    //   text: '乾派商务看板',
    //   meta: {
    //     title: '乾派商务看板'
    //   },
    //   path: 'qp-business',
    //   component: routerView,
    //   children: [
    //     {
    //       name: 'qp_business_week',
    //       text: '周复盘',
    //       meta: {
    //         title: '周复盘'
    //       },
    //       path: 'qp-business-week',
    //       component: () => import('@/views/data-manage/@pages/qian-week-data')
    //     },
    //     {
    //       name: 'qp_business_month',
    //       text: '月复盘',
    //       meta: {
    //         title: '月复盘'
    //       },
    //       path: 'qp-business-month',
    //       component: () => import('@/views/data-manage/@pages/qian-month-data')
    //     }
    //   ]
    // },
    // {
    //   name: 'qp_work',
    //   text: '工作室看板',
    //   meta: {
    //     title: '工作室看板'
    //   },
    //   path: 'qp-work',
    //   component: routerView,
    //   children: [
    //     {
    //       name: 'qp_work_day',
    //       text: '日看板',
    //       meta: {
    //         title: '日看板',
    //         url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=64b8ec2f-e0e5-435e-b5b0-984f55ee0fa9&accessToken=43d50e3c35d90d54d99a4d19a3cf8d8a'
    //       },
    //       path: 'qp-work-day',
    //       component: () => import('@/views/data-manage/iframe')
    //     },
    //     {
    //       name: 'qp_work_month',
    //       text: '月看板',
    //       meta: {
    //         title: '月看板',
    //         url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=8b20e530-9eea-41ab-b4a0-856571e3273b&accessToken=ae2a7464c65fe8f56a476425231c157e'
    //       },
    //       path: 'qp-work-month',
    //       component: () => import('@/views/data-manage/iframe')
    //     }
    //   ]
    // },
    {
      name: 'business_transformation',
      text: '业务转化',
      meta: {
        title: '业务转化'
      },
      alwaysShow: true,
      path: 'business_transformation',
      component: routerView,
      children: [
        {
          name: 'C2B_conversion',
          text: 'C2B转化',
          meta: {
            title: 'C2B转化'
            // url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=23fd72fc-8c88-49e5-a164-e6561dd6f028&accessToken=f2500fa2ad496bf1610c0039319091c9'
          },
          path: 'C2B_conversion',
          component: () => import('@/views/data-manage/iframe/c2b')
        },
        {
          name: 'B2C_conversion',
          text: 'B2C转化',
          meta: {
            title: 'B2C转化',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=13f2f569-0637-4f49-9721-9b5c771bb252&accessToken=6ce9b563ce36178a98a20979bbe5e584'
          },
          path: 'B2C_conversion',
          component: () => import('@/views/data-manage/iframe')
        },
        {
          name: 'day_pirate_short',
          text: '组件业务转化',
          meta: {
            title: '组件业务转化',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=43cc7bd7-2fe5-43e6-9f30-22724dc936b8&accessToken=562328be6b7c36d1e4fe6f01b5a43ca8'
          },
          path: 'day-pirate-short',
          component: () => import('@/views/data-manage/iframe')
        }

      ]
    },
    {
      name: 'information_flow',
      text: '信息流看板',
      meta: {
        title: '信息流转化看板',
        url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=2eebbd07-a4ae-40a4-b618-084a52ca629b&accessToken=03b8f72686de7e42190e93d9850f3bcf&dd_orientation=auto'
      },
      path: 'information-flow',
      component: () => import('@/views/data-manage/iframe')
    },
    {
      name: 'buried_point',
      text: '埋点报表',
      meta: {
        title: '埋点报表'
      },
      path: 'buried-point',
      component: () => import('@/views/data-manage/buriedPoint')
    }
  ]
}
