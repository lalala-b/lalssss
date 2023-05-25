function objectForArray(obj) {
  const arr = []
  for (const key in obj) {
    arr.push({
      text: obj[key],
      val: key
    })
  }
  return arr
}

export const LINK_TYPE = Object.freeze({
  net_server_component: '网服组件',
  comment_set_top: '落地页组件'
})

// 投放订单状态
export const PUT_ORDER_BUSINESS_STATUS = Object.freeze({
  1: '待审核', 2: '待审核', 5: '待下单付款', 6: '待发布提交', 7: '待资金核算', 8: '已驳回', 9: '已取消', 10: '已完成', 17: '待平台订单完成'
})

// 投放订单计费方式
export const PUT_CHARGE_TYPE = {
  1: '按播放量计费',
  2: '保量计费',
  3: '一口价计费'
}

export const PUT_CHARGE_TYPE_ARR = objectForArray(PUT_CHARGE_TYPE)

// 投放订单进度
export const APPROVAL_PAYMENT_PROGRESS = {
  1: '正常下单',
  2: '延后下单'
}

// 爬虫地址
export const PYTHON_HOST = process.env.NODE_ENV === 'production' ? 'https://ldpspider.zhuanzhuan.com' : 'https://ldpspider.zhuanzhuan.com'
export const API_HOST = process.env.NODE_ENV === 'production' ? 'https://api.qpmcn.com' : 'https://api.qpmcn.com'

export const BUSINESS_TAG = Object.freeze({
  '转转': 'zz_putting_business_tag',
  '找靓机': 'zlj_putting_business_tag'
})

// 投放账号状态
export const ACCOUNT_STATUS_MAP = Object.freeze({
  1: '待建联',
  2: '建联中',
  3: '待议价',
  4: '议价中'
})

export const ACCOUNT_STATUS_MAP_ARR = objectForArray(ACCOUNT_STATUS_MAP)

// 第三方链接映射
export const THIRD_INDEX_URL_MAP = {
  25: {
    tip: '星图主页链接',
    iconClass: 'xintu'
  },
  26: {
    tip: '聚星主页链接',
    iconClass: 'juxing'
  },
  2: {
    tip: '花火主页链接',
    iconClass: 'huahuo'
  },
  45: {
    tip: '蒲公英主页链接',
    iconClass: 'pugongying'
  }
}

export const DATA_SERVER = 'https://dataserv.qpmcn.com/api'
