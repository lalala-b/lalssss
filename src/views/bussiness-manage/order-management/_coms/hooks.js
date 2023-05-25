export const commonData = function() {
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
    orderStatusMap,
    projectTypeMap
  }
}
