import colorSchemes from './color-schemes'
import { getCookie } from '@/utils'
import qs from 'qs'
const { blue, orange } = colorSchemes
const getColors = colorSchemes.get

export { blue }
export { orange }
export { getColors }

const toString = Object.prototype.toString
/**
 * 是否是对象
 * @param  {Object}  val  要判断的对象
 * @return {Boolean}      判断结果
 */
var isObject = function isObject(obj) {
  return toString.call(obj) === '[object Object]'
}
export { isObject }

function isNumber(val) {
  return !(val === null || isNaN(+val))
}
export { isNumber }

function isString(str) {
  return (typeof (str) === 'string')
}
export { isString }

function isArray(obj) {
  return toString.call(obj) === '[object Array]'
}
export { isArray }

/**
 * 类型判断
 * @param  {Mix}     subject 待判断数据
 * @param  {String}  type    预期的数据类型
 * @return {Boolean}         判断结果
 */
function is(subject, type) {
  type = type.toLowerCase()
  return toString.call(subject).toLowerCase() === `[object ${type}]`
}
export { is }

/**
 * 是否是函数
 * @param  {Mix} fn     待判断数据
 * @return {Boolean}    判断结果
 */
function isFunction(fn) {
  return is(fn, 'function')
}
export { isFunction }

/**
 * 格式化数字, 自动补0前续
 * @param  {Number} number 要格式化的数字
 * @param  {Number} size   格式化后出来的数字位数
 * @return {String}        格式化结果
 */
function fix0(number, size) {
  number = number.toString()
  while (number.length < size) {
    number = '0' + number
  }
  return number
}
export { fix0 }

function forEach(obj, iterator, context) {
  var key
  if (obj) {
    if (typeof (obj) === 'function') {
      for (key in obj) {
        // Need to check if hasOwnProperty exists,
        // as on IE8 the result of querySelectorAll is an object without a hasOwnProperty function
        if (key !== 'prototype' && key !== 'length' && key !== 'name' && Object.prototype.hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key)
        }
      }
    } else if (isArray(obj) || isArrayLike(obj)) {
      for (key = 0; key < obj.length; key++) {
        iterator.call(context, obj[key], key)
      }
    } else if (obj.forEach && obj.forEach !== forEach) {
      obj.forEach(iterator, context)
    } else {
      for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          iterator.call(context, obj[key], key)
        }
      }
    }
  }
  return obj
}
export { forEach }

function resetDateTime(date, data) {
  if (date && data) {
    var fnName
    forEach(data, function(val, key) {
      switch (key) {
          case 'y':
            fnName = 'setYear'
            break

          case 'm':
            fnName = 'setMonth'
            break

          case 'd':
            fnName = 'setDate'
            break

          case 'H':
            fnName = 'setHours'
            break

          case 'i':
            fnName = 'setMinutes'
            break

          case 's':
            fnName = 'setSeconds'
            break

          case 'M':
            fnName = 'setMilliseconds'
            break
      }
      if (fnName) {
        date[fnName](val)
      }
    })
  }
  return date
}
export { resetDateTime }

function isUndefined(val) {
  return typeof val === 'undefined' || (typeof val === 'string' && val.trim() === '')
}
export { isUndefined }

/**
 * 转换对象为JS Date对象
 * @param  {Mix}    date   <可选> 日期数据(时间戳, 字符串, Date对象, 空)
 * @param  {Number} offset 修正偏移的秒数
 * @return {Date}          返回JS Date对象 / NULL 日期格式错误
 */
var date_regx = /[^\d]+/
function toDate(date, offset) {
  var ts
  if (date instanceof Date) {
    ts = date
  } else if (isNaN(+date)) {
    if (isString(date)) {
      date = date.split(date_regx)
      if (date.length === 3) {
        ts = new Date(+date[0], date[1] - 1, +date[2], 0, 0, 0, 0)
        if (isNaN(+ts)) {
          ts = null
        }
      }
    } else {
      return null
    }
  }
  if (!ts) {
    if (!date) { return null }
    ts = new Date()
    if (date > 5e8) {
      // 时间戳
      ts.setTime(date * 1000)
    } else {
      // 时间偏移(秒数)
      ts.setTime(ts.getTime() + date * 1000)
    }
  }
  if (!isNaN(+offset)) {
    ts.setTime(ts.getTime() + offset * 1000)
  }
  return ts
}
export { toDate }

var timestamp = null
var format_exp = /[YymndjNwaAghGHisT]/g
function format_callback(tag) {
  var t = timestamp
  switch (tag) {
      case 'Y': return t.getFullYear()
      case 'y': return t.getFullYear() % 100
      case 'm': return fix0(t.getMonth() + 1, 2)
      case 'n': return t.getMonth() + 1
      case 'd': return fix0(t.getDate(), 2)
      case 'j': return t.getDate()
      case 'N': return t.getDay()
      case 'w': return t.getDay() % 7
      case 'a': return t.getHours() < 12 ? 'am' : 'pm'
      case 'A': return t.getHours() < 12 ? 'AM' : 'PM'
      case 'g': return t.getHours() % 12 + 1
      case 'h': return fix0(t.getHours() % 12 + 1, 2)
      case 'G': return t.getHours()
      case 'H': return fix0(t.getHours(), 2)
      case 'i': return fix0(t.getMinutes(), 2)
      case 's': return fix0(t.getSeconds(), 2)
      case 'T': return Math.round(t.getTime() / 1000)
  }
  return tag
}
function date(format, date, offset) {
  if (!format) { return '' }
  timestamp = toDate(date, offset)
  if (timestamp === null) { timestamp = new Date() }
  return format.replace(format_exp, format_callback)
}
export { date }

function extend(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        dst[key] = value
      })
    }
  })
  return dst
}
export { extend }

function isWindow(obj) {
  return obj && obj.document && obj.location && obj.alert && obj.setInterval
}
export { isWindow }

function isArrayLike(obj) {
  if (obj == null || isWindow(obj)) {
    return false
  }

  var length = obj.length

  if (obj.nodeType === 1 && length) {
    return true
  }

  return isString(obj) || isArray(obj) || length === 0 ||
         typeof length === 'number' && length > 0 && (length - 1) in obj
}
export { isArrayLike }

const DEF_FACE = ''
export { DEF_FACE }

/**
 * 转化为统一的 option 数据
 * @param  {Array}  data 待处理的数据
 * @param  {Object} conf 处理配置对象
 * @return {Array}       处理后的数据
 */
function toOptions(data, conf) {
  if (!conf || conf && !conf.textKey || conf && !conf.valKey) {
    return data
  }
  if (isArray(data)) {
    return data.map(function(item) {
      let dat = {
        'text': item[conf.textKey],
        'val': item[conf.valKey]
      }
      if (conf.keepOther) {
        delete item[conf.textKey]
        delete item[conf.valKey]
        dat = Object.assign(dat, item)
      }
      return dat
    })
  } else {
    return data
  }
}
export { toOptions }

/**
 * 根据规则判断权限
 * @param  {Object}  userDat 用户数据
 * @param  {Mix}     rule    当前节点的判断规则
 * @return {Boolean}         判断结果
 */
function checkRule(userDat, rule) {
  if (isArray(rule)) {
  // 如果单条规则是数组则是且的关系
    return rule.every(function(item) {
      return checkRule(userDat, item)
    })
  } else {
  // 默认运算符为等于
  // 有其他的运算则需要再加
    rule.compute = rule.compute || '==='

    switch (rule.compute) {
        case '!==':
          return userDat[rule.key] !== rule.val

        case '===':
          return userDat[rule.key] === rule.val

        case '~':
          return userDat[rule.key] && userDat[rule.key].indexOf(rule.val) !== -1

        case '!~':
          return userDat[rule.key] && userDat[rule.key].indexOf(rule.val) === -1

        default:
          return false
    }
  }
}
export { checkRule }

function checkFilterRule(rules, user) {
  if (rules && rules.length) {
  // 有配置的时候用配置做判断
    let re = false
    for (const rule of rules) {
      re = checkRule(user, rule)
      if (re) {
        break
      }
    }
    return re
  } else {
  // 没配置的时候默认有权限访问
    return true
  }
}
export { checkFilterRule }

/**
 * 根据规则及用户过滤数据
 * @param  {Array}  data 待处理数据
 * @param  {Object} user 用户数据
 * @return {Array}       处理后的数据
 */
function filterByRule(data, user) {
  if (isArray(data)) {
    return data.filter(function(item) {
      return checkFilterRule(item.rule, user)
    })
  }
  return data
}
export { filterByRule }

/**
 * 把返回的列表数据处理后返回，默认处理成下拉列表类型的数据
 * @param  {Array}    re       原始数据
 * @param  {Function} formater 格式化函数
 * @param  {Object}   conf     下拉列表格式化配置
 * @return {Array}             处理后的数据
 */
function processListDataAndReturn(re, formater, conf) {
  if (re) {
    if (isFunction(formater)) {
      return formater(re)
    } else {
      return toOptions(re, conf)
    }
  }
  return []
}
export { processListDataAndReturn }

/**
 * 精度处理
 * @param  {Number} num   待处理数字
 * @param  {Number} dec   精度
 * @return {Number}       处理后的数字
 */
function getWithDec(num, dec) {
  var pow10s = Math.pow(10, dec || 0)
  return (dec) ? Math.round(pow10s * num) / pow10s : num
}
export { getWithDec }

function copy(dat) {
  var re
  try {
    re = JSON.parse(
      JSON.stringify(dat)
    )
  } catch (e) {
    re = dat
  }
  return re
}
export { copy }

/**
 * 获取包含指定范围内的随机数
 * @param  {Number} max 最大范围(包含)
 * @param  {Number} min 最小范围(包含，默认 0)
 * @return {Number}     随机数
 */
function random(max, min) {
  if (min === undefined) {
    min = 0
  }
  return Math.round(Math.random() * (max - min) + min)
}
export { random }

/**
 * 判断是否登录
 */
function checkLogin() {
  if (!getCookie('sso_uid')) {
    window.location.href = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww8469a6417268da6f&agentid=1000130&redirect_uri=https%3A%2F%2Fzzkfapi.zhuanspirit.com%2Fuser%2Ftransfer%2Flogin%3Frandom%3D0.2992575486580411%26aid%3D7262759683269926792'
  }
}

export { checkLogin }

function download(filename, data, url = '') {
  var oReq = new XMLHttpRequest()
  oReq.open('GET', `${url}?${qs.stringify(data)}`, true)
  // 设置请求头类型
  oReq.setRequestHeader('Content-type', 'application/vnd.ms-excel')
  oReq.responseType = 'blob'
  oReq.onload = function(oEvent) {
    var content = oReq.response
    var elink = document.createElement('a')
    elink.download = filename
    elink.style.display = 'none'

    var blob = new Blob([content])
    elink.href = URL.createObjectURL(blob)

    document.body.appendChild(elink)
    elink.click()

    document.body.removeChild(elink)
  }
  oReq.send()
}

export { download }

/**
 * 合并
 * @param target  合并基准对象
 * @param sources 后续合并对象
 */
function merge(target, ...sources) {
    if (!sources.length) return target
    const source = sources.shift()
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {}})
                }
                merge(target[key], source[key])
            } else {
                Object.assign(
                    target,
                    {
                        [key]: source[key]
                    }
                )
            }
        }
    }
    return merge(target, ...sources)
}
export { merge }

const PACKAGE = {
  isObject,
  isNumber,
  isString,
  isArray,
  fix0,
  forEach,
  resetDateTime,
  isUndefined,
  toDate,
  date,
  extend,
  isArrayLike,
  isWindow,
  DEF_FACE,
  toOptions,
  checkRule,
  processListDataAndReturn,
  getWithDec,
  copy,
  blue,
  orange,
  getColors,
  checkFilterRule,
  random,
  merge
}

export default { PACKAGE }
