/**
 * Created by PanJiaChen on 16/11/18.
 */
import dayjs from 'dayjs'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // scss 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object' && sourceProperty !== null) {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// 去重
export function unique(data = [], key, ignoreEmpty = false) {
  if (!isArray(data)) {
    process.env.NODE_ENV === 'production' ? '' : console.error(`data必须为数组`)
    return []
  }
  if (data.length === 0) {
    return []
  }
  let repeat = {}
  data = data.reduce((total, item) => {
    if (!item[key]) {
      ignoreEmpty && total.push(item)
      return total
    }
    if (!repeat[item[key]]) {
      total.push(item)
      repeat[item[key]] = true
    }
    return total
  }, [])
  repeat = {}
  return data
}

export const extend = (function() {
  if (typeof Object.assign === 'function') {
    return Object.assign
  } else {
    return function(target) {
      if (target == null) {
        throw new TypeError(
          'Cannot convert undefined or null to object'
        )
      }
      target = Object(target)
      for (let index = 1; index < arguments.length; index++) {
        const source = arguments[index]
        if (source != null) {
          for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key]
            }
          }
        }
      }
      return target
    }
  }
})()

function isType(type) {
  return function(el) {
    return Object.prototype.toString.call(el) === '[object ' + type + ']'
  }
}

export var isArray = isType('Array')
export var isObject = isType('Object')
export var isFunction = isType('Function')
export var isString = isType('String')
export var isNumber = isType('Number')
export var isBoolean = isType('Boolean')

export var isUndefined = function(obj) {
  return typeof obj === 'undefined'
}

export const isUndef = function(obj) {
  return isUndefined(obj) || obj === null || obj === 'null'
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target
  const source = sources.shift()
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {
            [key]: {}
          })
        }
        mergeDeep(target[key], source[key])
      } else {
        Object.assign(target, {
          [key]: source[key]
        })
      }
    }
  }
  return mergeDeep(target, ...sources)
}
export var merge = mergeDeep

export var copy = function(target) {
  return JSON.parse(JSON.stringify(target))
}

/**
 * 获取环境信息
 * @return {Object} 环境信息对象
 */
function getEnv() {
  var nav = window.navigator
  var env = {
    iphone: false,
    ipad: false,
    android: false,
    pc: false,
    ios: false,
    ver: '0'
  }

  var ua = nav.userAgent
  var android = ua.match(/(Android)\s+([\d.]+)/)
  var ipad = ua.match(/(iPad).*OS\s([\d_]+)/)
  var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/)
  if (ipad) {
    env.ipad = (ipad[1] && true) || false
    env.ver = (ipad[2] && ipad[2].replace(/-/g, '.')) || ''
    env.ios = true
  } else if (iphone) {
    env.iphone = (iphone[1] && true) || false
    env.ver = (iphone[2] && iphone[2].replace(/-/g, '.')) || ''
    env.ios = true
  } else if (android) {
    env.android = (android[1] && true) || false
    env.ver = android[2]
  } else {
    env.pc = true
  }

  return env
}

export var env = getEnv()

// cookie写操作，过期时间单位(s)
export var setCookie = function(name, value, config) {
  config = mergeDeep({
      path: '/'
    },
    config || {}
  )
  var defVal = {
    path: '/'
  }
  var cookie = [name + '=' + value]
  Object.keys(config).forEach(function(key) {
    if (key === 'expires' && config.expires) {
      return cookie.push(
        'expires=' +
        new Date(
          +new Date() + config.expires * 24 * 3600 * 1000
        ).toGMTString()
      )
    }
    cookie.push(key + '=' + (config[key] || defVal[key] || ''))
  })
  return (document.cookie = cookie.join(';'))
}

export var getCookie = function(name) {
  var cMapper = {}
  var re = null
  document.cookie.split(/\s?;\s?/).forEach(function(str) {
    str = str.split('=')
    if (str.length === 2) {
      const key = str[0]

      if (key && !Object.prototype.hasOwnProperty.call(cMapper, key)) {
        cMapper[key] = str[1]
      }
    }
  })
  if (Object.prototype.hasOwnProperty.call(cMapper, name)) {
    re = cMapper[name]
  }
  cMapper = null
  return re
}

export var removeCookie = function(name, path) {
  // debugger
  path = path || '/'
  // expires=Thu, 01 Jan 1970 00:00:00 GMT
  var value = getCookie(name)
  if (value) {
    return (document.cookie =
      name +
      '=' +
      value +
      '; expires=' +
      'Thu, 01 Jan 1970 00:00:00 GMT; path=' +
      path)
  }
}

// 获取 url 参数
export var getQuery = function(key) {
  var q = decodeURIComponent(location.search)
  var ret = {}
  if (q) {
    q = q.slice(1)
    q = q.split('&')
    q.forEach(function(qs) {
      qs = qs.split('=')
      var k = qs[0]
      var v = qs[1]
      if (ret[k]) {
        ret[k] = [].concat(ret[k])
        ret[k].push(v)
      } else {
        ret[k] = v
      }
    })
  }
  if (key) {
    ret = ret[key]
  }
  return ret
}

/**
 * 克隆
 * @param  {Mix} target 待克隆的对象
 * @return {Mix}        克隆后的对象
 */
export function clone(target) {
  var newTarget
  switch (true) {
    case isObject(target):
      newTarget = {}
      Object.keys(target).forEach(function(key) {
        newTarget[key] = clone(target[key])
      })
      break

    case isArray(target):
      newTarget = []
      target.forEach(function(tag) {
        newTarget.push(clone(tag))
      })
      break

    default:
      newTarget = target
  }

  return newTarget
}

// 节流
export function throttle(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}

// 日期格式化
export function dateFormat(fmt, date) {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt)
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt
}

// 获取上一个月的日期
export function getPreMonth(date) {
  var arr = date.split('-')
  var year = arr[0]
  var month = arr[1]
  var day = arr[2]
  // var days = new Date(year, month, 0)
  // days = days.getDate()
  var year2 = year
  var month2 = parseInt(month) - 1
  if (month2 === 0) {
    year2 = parseInt(year2) - 1
    month2 = 12
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }
  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}

// 获取下一个月的日期
export function getNextMonth(date) {
  var arr = date.split('-')
  var year = arr[0]
  var month = arr[1]
  var day = arr[2]
  // var days = new Date(year, month, 0)
  // days = days.getDate()
  var year2 = year
  var month2 = parseInt(month) + 1
  if (month2 == 13) {
    year2 = parseInt(year2) + 1
    month2 = 1
  }
  var day2 = day
  var days2 = new Date(year2, month2, 0)
  days2 = days2.getDate()
  if (day2 > days2) {
    day2 = days2
  }
  if (month2 < 10) {
    month2 = '0' + month2
  }

  var t2 = year2 + '-' + month2 + '-' + day2
  return t2
}

export function getCurrentMonthFirst() {
  const date = new Date()
  date.setDate(1)
  return date
}

export function copyBigDataToBoard(copyString) {
  try {
    // 移除矩形框
    window.getSelection().removeAllRanges()
    // 创建选中范围
    const range = document.createRange()
    // 创建div元素存放文本
    const divNode = document.createElement('div')
    divNode.innerHTML = copyString
    document.body.appendChild(divNode)
    // 选中div元素中的所有文本
    range.selectNode(divNode)
    window.getSelection().addRange(range)
    // 复制文本到粘贴板
    document.execCommand('copy')
    // 移除矩形框
    window.getSelection().removeAllRanges()
    document.body.removeChild(divNode)
  } catch (err) {
    // ignore
  }
}

export function formatNum(num) {
  if (!isNumber(num)) {
    return num
  }

  if (num > 10000) {
    num = (num / 10000).toFixed(0) + 'w'
  }
  // num = String(num).split('.')
  // var postfix = num.length > 1 ? '.' + num.pop() : ''
  // num = num[0]
  return num
}

// 时间戳转日期
export const timestampToTime = (timestamp) => {
  var date = null
  if (timestamp) {
    date = new Date(timestamp)
  } else {
    date = new Date()
  }

  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return Y + M + D + h + m + s
}
export const getMonthStartEnd = () => {
  // 获取当前时间
  const date = new Date()
  // 获取当前月的第一天
  const monthStart = date.setDate(1)
  // 获取当前月
  let currentMonth = date.getMonth()
  // 获取到下一个月，++currentMonth表示本月+1，一元运算
  const nextMonth = ++currentMonth
  // 获取到下个月的第一天
  const nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
  // 一天时间的毫秒数
  const oneDay = 1000 * 60 * 60 * 24
  // 获取当前月第一天和最后一天
  const firstDay = dayjs(monthStart).format('YYYY-MM-DD')
  // nextMonthFirstDay-oneDay表示下个月的第一天减一天时间的毫秒数就是本月的最后一天
  const lastDay = dayjs(nextMonthFirstDay - oneDay).format('YYYY-MM-DD')
  return {
    firstDay,
    lastDay
  }
}

export const formatUnit = (value) => {
  let unit = ''
  if (!value) return 0
  if (value > 100000000 || value < -100000000) {
    value = Number((value / 100000000).toFixed(2))
    unit = '亿'
  } else if (value > 10000 || value < -10000) {
    value = Number((value / 10000).toFixed(2))
    unit = 'w'
  }
  return value + unit
}

// 获取最近某天日期 getDay(0)获取今日
export const getDay = (day) => {
  function doHandleMonth(str) {
    var m = str
    if (str.toString().length === 1) {
      m = '0' + str
    }
    return m
  }
  var today = new Date()
  var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day
  today.setTime(targetday_milliseconds)
  var tYear = today.getFullYear()
  var tMonth = today.getMonth()
  var tDate = today.getDate()
  tMonth = doHandleMonth(tMonth + 1)
  tDate = doHandleMonth(tDate)
  return tYear + '-' + tMonth + '-' + tDate
}

// 截取视频第一帧转为base64的图片
export const getVideoBase64 = (url, W, H) => {
  return new Promise(function(resolve, reject) {
    let dataURL = ''
    const video = document.createElement('video')
    video.setAttribute('crossOrigin', 'anonymous') // 处理跨域
    video.setAttribute('src', url)
    video.setAttribute('width', W)
    video.setAttribute('height', H)
    video.setAttribute('preload', 'auto')
    video.addEventListener('loadeddata', function() {
      const canvas = document.createElement('canvas')
      const width = video.width // canvas的尺寸和图片一样
      const height = video.height
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(video, 0, 0, width, height) // 绘制canvas
      dataURL = canvas.toDataURL('image/jpeg') // 转换为base64
      resolve(dataURL)
    })
  })
}
