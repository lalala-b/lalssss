import {
  reactive
} from '@vue/composition-api'
export const useStatistics = function() {
  // const _this = getCurrentInstance()
  const detailStatistics = reactive([{
      key: 'orderCount',
      val: '--',
      text: '订单数量'
    },
    {
      key: 'orderMoneySum',
      val: '--',
      text: '商单流水总额'
    },
    {
      key: 'honourAgreementCount',
      val: '--',
      text: '履约数量'
    },
    {
      key: 'honourAgreementOrderMoneySum',
      val: '--',
      text: '履约流水总额'
    },
    {
      key: 'centerMoney',
      val: '--',
      text: '中台实际营收'
    }
  ])
  const revenueStatistics1 = reactive([
    {
      key: 'performanceIncomeMoneySum',
      val: '--',
      text: '履约流水总额'
    },
    {
      key: 'centerMoneySum',
      val: '--',
      text: '中台营收总额'
    },
    {
      key: 'outMoneySum',
      val: '--',
      text: '外部营收总额'
    },
    {
      key: 'otherMoneySum',
      val: '--',
      text: '其余支出总额'
    },
    {
      key: 'actualIncomeMoneySum',
      val: '--',
      text: '实际营收总额'
    }
  ])
  const revenueStatistics2 = reactive([{
      key: 'targetOrderMoneySum',
      val: '--',
      text: '目标流水'
    },
    {
      key: 'orderMoneySum',
      val: '--',
      text: '当前流水总额'
    },
    {
      key: 'orderMoneyBalanceSum',
      val: '--',
      text: '流水差额'
    },
    {
      key: 'centerMoneyActualSum',
      val: '--',
      text: '中台实际营收'
    },
    {
      key: 'orderMoneyCompleteRatio',
      val: '--',
      text: '流水完成率'
    }
  ])
  return {
    detailStatistics,
    revenueStatistics1,
    revenueStatistics2

  }
}

export const useMapData = function() {
  const projectTypeMap = new Map([
    ['1', '视频工单'],
    ['2', '海盗订单'],
    ['3', '达人私单（不分成）'],
    ['4', '达人私单（分成）']
  ])
  const orderStatusMap = new Map([
    [0, '商业信息待录入'],
    [1, '待履约'],
    [2, '已履约'],
    [3, '已核账'],
    [4, '撤单']
  ])
  return {
    projectTypeMap,
    orderStatusMap
  }
}
