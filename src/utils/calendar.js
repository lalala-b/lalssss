/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-11 11:13:43
 * @LastEditTime: 2020-11-11 12:12:50
 * @LastEditors: Linjie
 */
const isLeapYear = (year) => {
  return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0)
}
const getMonthCount = (year, month) => {
  const arr = [
    31, null, 31, 30,
    31, 30, 31, 31,
    30, 31, 30, 31
  ]
  const count = arr[month] || (isLeapYear(year) ? 29 : 28)
  return Array.from(new Array(count), (item, value) => value + 1)
}
const getWeekday = (year, month) => {
  const date = new Date(year, month, 1)
  return date.getDay()
}

const getPreMonthCount = (year, month) => {
  if (month === 0) {
    return getMonthCount(year - 1, 11)
  } else {
    return getMonthCount(year, month - 1)
  }
}
const getNextMonthCount = (year, month) => {
  if (month === 11) {
    return getMonthCount(year + 1, 0)
  } else {
    return getMonthCount(year, month + 1)
  }
}

export default function(time) {
  let res = []
  const nowDate = new Date(time)
  const year = nowDate.getFullYear()
  const month = nowDate.getMonth()
  let currentMonth = getMonthCount(year, month)
  const preMonth = getPreMonthCount(year, month)

  const nextMonth = getNextMonthCount(year, month)
  let whereMonday = getWeekday(year, month)
  if (whereMonday === 0) {
    whereMonday = 7
  }
  whereMonday = whereMonday - 1
  let preArr = preMonth.slice(-1 * whereMonday)
  if (whereMonday === 0) {
    preArr = []
  }

  let nextArr = nextMonth.slice(0, 42 - currentMonth.length - whereMonday)
  preArr = preArr.map(item => ({ value: item, type: 'prev' }))
  nextArr = nextArr.map(item => ({ value: item, type: 'next' }))
  currentMonth = currentMonth.map(item => ({ value: item, type: 'current' }))
  res = [].concat(preArr, currentMonth, nextArr)
  return res
}
