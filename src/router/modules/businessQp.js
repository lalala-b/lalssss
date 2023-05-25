import Layout from '@/layout'

const backendManage = {
  path: '/qp',
  component: Layout,
  name: 'business_qp',
  text: '乾派2.0',
  meta: {
    title: '乾派2.0',
    icon: 'iconyingyongguanli',
    color: 'red'
  },
  alwaysShow: true,
  children: [{
      name: 'plan_management',
      text: '方案管理',
      meta: {
        title: '方案管理'
      },
      path: 'plan-management',
      component: () =>
        import('@/views/business-qp/index')
    }, {
      name: 'new_business_opportunity_manage',
      text: '商机管理',
      meta: {
        title: '商机管理'
      },
      path: 'business-opportunity-manage',
      component: () =>
        import('@/views/business-qp/index')
    },
    {
      name: 'task_management',
      text: '任务管理',
      meta: {
        title: '任务管理'
      },
      path: 'task-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'invoice_management',
      text: '商单管理',
      meta: {
        title: '商单管理'
      },
      path: 'invoice-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      path: 'special-payment-management',
      text: '特殊收支',
      name: 'special_payment_manage',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'invoice_details',
      text: '商单详情',
      meta: {
        title: '商单详情',
        hidden: true
      },
      path: 'invoice-details',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'signed_order_manage',
      text: '签约订单管理',
      meta: {
        title: '签约订单管理'
      },
      path: 'signed-order-manage',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'media_management',
      text: '媒介订单管理',
      meta: {
        title: '媒介订单管理'
      },
      path: 'media-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'studio_management',
      text: '工作室订单管理',
      meta: {
        title: '工作室订单管理'
      },
      path: 'studio-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'perform_management',
      text: '执行管理',
      meta: {
        title: '执行管理'
      },
      path: 'perform-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'work_management',
      text: '工单管理',
      meta: {
        title: '工单管理'
      },
      path: 'work-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'work_order_detail',
      text: '工单详情',
      meta: {
        title: '工单详情',
        hidden: true
      },
      path: 'work-order-detail',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'settlement_management',
      text: '结算单管理',
      meta: {
        title: '结算单管理'
      },
      path: 'settlement-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'financial_management',
      text: '财务管理',
      meta: {
        title: '财务管理'
      },
      path: 'financial-management',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'oa_apply_record',
      path: '/qp/oa-apply-record',
      text: 'OA申请记录',
      meta: {
        title: 'OA申请记录'
      },
      component: () => import('@/views/business-qp/index')
    },
    {
      path: '/qp/oa-payment-apply',
      text: 'OA付款申请',
      name: 'oa_payment_apply',
      meta: {
        title: 'OA付款申请',
        hidden: true
      },
      component: () => import('@/views/business-qp/index')
    },
    {
      path: '/qp/oa-invoice-apply',
      text: 'OA开票申请',
      name: 'oa_invoice_apply',
      meta: {
        title: 'OA开票申请',
        hidden: true
      },
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'media_payment_approval',
      text: '广告费及新媒体付款审批单',
      meta: {
        title: '广告费及新媒体付款审批单',
        hidden: true
      },
      path: 'media-payment-approval',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'invoice_application_approval',
      text: '发票申请审批单',
      meta: {
        title: '发票申请审批单',
        hidden: true
      },
      path: 'invoice-application-approval',
      component: () => import('@/views/business-qp/index')
    }
  ]
}

export default backendManage
