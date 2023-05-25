import { copy } from './'

/**
 * 蓝色配色方案
 * @type {Array}
 */
const BLUES = [
  ['#5ebcd2'],
  ['#85cbcf', '#3984b6'],
  ['#85cbcf', '#3984b6', '#1d2e81'],
  ['#9ed5cd', '#44a7cb', '#2e62a1', '#192574'],
  ['#b7dfcb', '#5abad1', '#3984b6', '#264992', '#161f63'],
  ['#bee0cc', '#70c3d0', '#419dc5', '#316ba7', '#223b89', '#151e5e'],
  ['#c6e3cb', '#83cacf', '#47aed0', '#3984b6', '#2c5a9c', '#1e3082', '#141c59'],
  ['#cee6ca', '#91d0ce', '#56b9d2', '#3f97c2', '#3371aa', '#274b93', '#1b277c', '#131a55'],
  ['#d5e9ca', '#9ed5cd', '#69c0d1', '#44a7cb', '#3984b6', '#2e62a1', '#233f8c', '#192473', '#121850'],
  ['#dcecc9', '#aadacc', '#78c6d0', '#48b3d3', '#3e94c0', '#3474ac', '#2a5599', '#203686', '#18216b', '#11174b'],
  ['#dcecc9', '#afdccc', '#83cacf', '#56b9d2', '#43a1c7', '#3984b6', '#3067a5', '#274b93', '#1e3082', '#172068', '#11174b'],
  ['#dcecc9', '#b3ddcc', '#8acdce', '#62bed2', '#46aace', '#3d91be', '#3577ae', '#2d5e9e', '#24448e', '#1c2b7f', '#162065', '#11174b']
]

/**
 * 橙色配色方案
 * @type {Array}
 */
const ORANGES = [
  ['#f4b656'],
  ['#f8cd61', '#e97e3b'],
  ['#f8cd61', '#e97e3b', '#a34529'],
  ['#fbdb68', '#ef9c49', '#e45e2d', '#8b412b'],
  ['#fdea6f', '#f3b355', '#e97e3b', '#cf4f29', '#723c2c'],
  ['#fdeb73', '#f6c15b', '#ed9445', '#e66731', '#b84a29', '#6a3a2d'],
  ['#fdeb78', '#f8cb60', '#f0a44d', '#e97e3b', '#e3572a', '#a64629', '#63392d'],
  ['#fdec7c', '#f9d464', '#f2b154', '#ec8f43', '#e66c33', '#d35028', '#98432a', '#5b372e'],
  ['#fded82', '#fbdc68', '#f5bc59', '#ef9c49', '#e97e3b', '#e45e2d', '#c04b29', '#8a402b', '#54362f'],
  ['#fded86', '#fce36b', '#f7c65d', '#f1a84f', '#ec8c41', '#e76f34', '#e25328', '#b04829', '#7e3e2b', '#4c3430'],
  ['#fded86', '#fce66d', '#f8cb60', '#f2b154', '#ee9747', '#e97e3b', '#e5632f', '#d35028', '#a64629', '#793d2c', '#4c3430'],
  ['#fded86', '#fde86e', '#f9d063', '#f5b857', '#f0a04b', '#eb8a40', '#e77235', '#e35b2c', '#c74e29', '#9d4429', '#753c2c', '#4c3430']
]

/**
 * 配色方案最大支持的数量
 * @type {Object}
 */
const TYPES_LEN = {}

/**
 * 配色方案
 * @type {Object}
 */
const TYPES = {
  'blue': {},
  'orange': {}
}

// 生成方案数据
BLUES.forEach(function(item, index) {
  TYPES.blue[index + 1] = item
})
TYPES_LEN.blue = BLUES.length
ORANGES.forEach(function(item, index) {
  TYPES.orange[index + 1] = item
})
TYPES_LEN.orange = ORANGES.length

/**
 * 获取所有配色方案
 * @return {Object} 配色方案
 */
function types() {
  return copy(TYPES)
}
export { types }

/**
 * 获取指定配色方案的某一组配色组合
 * @param  {String} type 配色方案名称
 * @param  {Number} len  组合数量
 * @return {Object}      组合方案
 */
function get(type, len) {
  if (TYPES[type]) {
    var typeLen = TYPES_LEN[type]
    if (len === -1) {
      len = typeLen
    }
    if (typeLen < len) {
      // 需要的颜色超出定义的颜色
    }
    return copy(TYPES[type][len])
  }
  return null
}
export { get }

/**
 * 获取蓝色配色
 * @param  {Number} len 组合数量
 * @return {Object}     配色组合方案
 */
function blue(len) {
  return get('blue', len)
}
export { blue }

/**
 * 获取橙色配色
 * @param  {Number} len 组合数量
 * @return {Object}     配色组合方案
 */
function orange(len) {
  return get('orange', len)
}
export { orange }

export default { types, get, blue, orange }
