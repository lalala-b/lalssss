/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-10 15:22:59
 * @LastEditTime: 2020-09-26 14:59:20
 * @LastEditors: Linjie
 */
import { checkPermission } from '@/permission'
function permission(code) {
  if (code === '' || code === null || code === undefined) return true
  if (Array.isArray(code)) {
    return code.some((item) => checkPermission(item))
  }
  if (typeof code === 'string' && code) {
    return checkPermission(code)
  }
  return false
}

export default permission
