import Layout from '@/layout'
import routerView from '@/layout/components/routerView'

export default {
  path: '/qpData-manage',
  name: 'qpData_manage',
  component: Layout,
  text: '乾派数据看板',
  meta: {
    title: '乾派数据看板',
    icon: 'iconshujukanban'
  },
  children: [
    {
      name: 'qp_businesss',
      text: '商务看板',
      meta: {
        title: '商务看板'
      },
      alwaysShow: true,
      path: 'qp-businesss',
      component: routerView,
      children: [
        {
          name: 'business_data_analysis',
          text: '商务数据分析',
          meta: {
            title: '商务数据分析',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=8029eb6f-0aaf-4421-8558-7a997d9abd80&accessToken=22f77f7b48fe4b01c71b195ed3457005&dd_orientation=auto'
          },
          path: 'business-data-analysis',
          // component: () => import('@/views/data-manage/@pages/pirate-operating/trend-analysis')
          component: () => import('@/views/data-manage/iframe')
        },
        {
          name: 'customer_brand_analysis',
          text: '客户品牌分析',
          meta: {
            title: '客户品牌分析',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=1ed47e83-682b-4d51-adfa-52cd3411e616&accessToken=de51b40967ef337016cd81242bb63445&dd_orientation=auto'
          },
          path: 'customer-brand-analysis',
          component: () => import('@/views/data-manage/iframe')
        },
        {
          name: 'industry_revenue_analysis',
          text: '行业营收分析',
          meta: {
            title: '行业营收分析'
          },
          path: 'industry-revenue-analysis',
          component: () => import('@/views/bussiness-manage/bussinessAnalysis/index.vue')
        }
      ]
    },
    {
      name: 'qp_sign',
      text: '签约看板',
      meta: {
        title: '签约看板'
      },
      path: 'qp-sign',
      component: routerView,
      children: [
        {
          name: 'sign_data_analysis',
          text: '签约数据分析',
          meta: {
            title: '签约数据分析'
          },
          path: 'sign-data-analysis',
          component: () => import('@/views/sign-manage/@pages/sign-track')
        },
        {
          name: 'sign_day_replay',
          text: '签约日复盘',
          meta: {
            title: '签约日复盘',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=124773e8-21b4-4420-903d-ceb5e38cdfc9&accessToken=975291cbde94524d10bbab41dee2593b&dd_orientation=auto'
          },
          path: 'sign-day-replay',
          component: () => import('@/views/data-manage/iframe')
        }
      ]
    },
    {
      name: 'qp_studio',
      text: '工作室看板',
      meta: {
        title: '工作室看板'
      },
      path: 'qp-studio',
      component: routerView,
      children: [
        {
          name: 'studio_data_analysis',
          text: '工作室数据分析',
          meta: {
            title: '工作室数据分析'
          },
          path: 'studio-data-analysis',
          component: () => import('@/views/bussiness-manage/operations_management/@pages/studioAnalysis/index.vue')
        },
        {
          name: 'account_revenue_analysis',
          text: '账号营收分析',
          meta: {
            title: '账号营收分析',
            url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=4498de62-57df-47b6-beb9-b3b4c79cdab6&accessToken=2dd093c251809fbe44a0bc93323f756e&dd_orientation=auto'
          },
          path: 'account-revenue-analysis',
          component: () => import('@/views/data-manage/iframe')
        }
      ]
    }
  ]
}
