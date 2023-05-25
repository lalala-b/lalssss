// 加
function floatAdd(arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (floatMultiply(arg1, m) + floatMultiply(arg2, m)) / m
}
// 乘
function floatMultiply(arg1, arg2) {
  if (arg1 == null || arg2 == null) {
    return null
  }
  var n1, n2
  var r1, r2 // 小数位数
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  n1 = Number(arg1.toString().replace('.', ''))
  n2 = Number(arg2.toString().replace('.', ''))
  return n1 * n2 / Math.pow(10, r1 + r2)
}

// 减
function floatSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  // 动态控制精度长度
  n = (r1 >= r2) ? r1 : r2
  return ((floatMultiply(arg1, m) - floatMultiply(arg2, m)) / m).toFixed(n)
}

export { floatAdd }
export { floatSub }
export { floatMultiply }
