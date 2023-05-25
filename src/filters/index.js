/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-22 15:30:32
 * @LastEditTime: 2020-11-12 10:24:44
 * @LastEditors: Linjie
 */
import { date as commonDate } from '@/components/common'
import { isNumber, isUndef } from '@/utils'

/**
 * Show plural label if time is plural number
 * @param {number} time
 * @param {string} label
 * @return {string}
 */
function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

/**
 * @param {number} time
 */
export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

/**
 * Number formatting
 * like 10000 => 10k
 * @param {number} num
 * @param {number} digits
 */
export function numberFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

/**
 * 10000 => "10,000"
 * @param {number} num
 */
export function toThousandFilter(num) {
  const reg = /^[0-9]+.?[0-9]*$/
  if (!reg.test(num)) {
    return num
  }
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

/**
 * 转化为百分率形式
 * @param {String} string
 */
export function toRateNumber(str) {
  if (str || +str === 0) {
    return ((Math.round((str * 10000))) / 100.00).toFixed(1) + '%'
  } else {
    return '--'
  }
}

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function date(val, format = 'Y-m-d H:i:s') {
  if (!val) return
  return commonDate(format, new Date(val))
}
export function forMatDateForYMD(val, format = 'Y-m-d') {
  if (!val) return
  return commonDate(format, new Date(val))
}

export function toThousands(num) {
  if (!isNumber(num)) {
    return '--'
  }
  if (!num) {
    num = 0
  }
  num = String(num).split('.')
  var postfix = num.length > 1 ? '.' + num.pop() : ''
  num = num[0]
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + postfix
}

export function toThousandsW(num) {
  if (!isNumber(num / 1) || isUndef(num)) {
    return '--'
  }

  if (num > 10000 || num < -10000) {
    num = parseFloat((num / 10000).toFixed(2)) + 'w'
  }

  num = String(num).split('.')
  var postfix = num.length > 1 ? '.' + num.pop() : ''
  num = num[0]
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + postfix
}

export function toThousandsW0(num) {
  if (!isNumber(num)) {
    return '--'
  }

  if (num >= 10000) {
    num = (num / 10000).toFixed(0) + 'w'
  }

  num = String(num).split('.')
  var postfix = num.length > 1 ? '.' + num.pop() : ''
  num = num[0]
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + postfix
}

export function toFloorThousandsW(num) {
  if (!isNumber(num / 1) || isUndef(num)) {
    return '--'
  }

  if (num > 10000) {
    num = (Math.floor(num / 10000 * 100) / 100).toFixed(2) + 'w'
  }

  num = String(num).split('.')
  var postfix = num.length > 1 ? '.' + num.pop() : ''
  num = num[0]
  return num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + postfix
}

export function emptyFill(val) {
  if (val !== '0' && val !== 0 && !val) {
    return '--'
  } else {
    return val
  }
}

