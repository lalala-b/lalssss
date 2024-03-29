function pad(s) {
  return (s.length === 1) ? '0' + s : s
}

function parseColor(hexStr) {
  return hexStr.length === 4 ? hexStr.substr(1).split('').map(function(s) { return 0x11 * parseInt(s, 16) }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function(s) { return parseInt(s, 16) })
}

/*
  start 开始颜色
  end 结束颜色
  steps 颜色分解 次数
  gamma 暂时理解为透明一点（伽马）
*/
export function gradientColors(start, end, steps, gamma) {
  var i; var j; var ms; var me; var output = []; var so = []
  gamma = gamma || 1
  var normalize = function(channel) {
      return Math.pow(channel / 255, gamma)
  }
  start = parseColor(start).map(normalize)
  end = parseColor(end).map(normalize)
  for (i = 0; i < steps; i++) {
      ms = i / (steps - 1)
      me = 1 - ms
      for (j = 0; j < 3; j++) {
      so[j] = pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16))
      }
      output.push('#' + so.join(''))
  }
  return output
}
