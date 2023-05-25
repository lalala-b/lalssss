import jsCookie from 'js-cookie'
import JSEncrypt from 'jsencrypt'
import Cache from '@/utils/cache'
import { $getUserInfo, $getmenus, $getEexternalUser } from '@/api/user'
import { $getMenuConfigData } from '@/api/proprietary-orders'
import { $register } from '@/api'

const AUTH_CACHE = new Cache({
  'prefix': 'AUTH'
})

function isValidArray(list) {
  return Array.isArray(list) && list.length
}
// 以下为本sdk环境内用到的全局变量
// 用户信息

var permissionInfoCache = {} // 接入的系统id

export function getAllPermissionInfo() {
  return permissionInfoCache || {}
}
/**
 * 获取菜单权限信息
 * @returns {Array} 菜单权限信息
 * @example
 * async function main (){
 *      // return [{"id":"64","title":"售后单查询","name":"aftersaleList","type":"1"}]
 *      const menuList = getMenuPermission(2950422220238007202);
 * }
 */

export function getMenuPermission() {
  var _ref6 = permissionInfoCache || {}
  var menuList = _ref6.menuList

  return isValidArray(menuList) ? menuList : []
}
/**
 * 获取菜单权限信息
 * @returns {Array} 菜单权限信息
 * @example
 * async function main (){
 *      // return [{"id":"81","title":"批量分配","name":"ticket_batchDistribution","type":"2"}]
 *      const permissions = getMenuPermission(2950422220238007202);
 * }
 */

var findName = function findName(permissionKey) {
  return function(item) {
    var _ref8 = item || {}
    var name = _ref8.name

    return name === permissionKey
  }
}
/**
 * 校验是否存在权限
 * @param {string} permissionKey 权限key
 * @returns {boolean}
 */

export function checkPermission(permissionKey) {
  var _ref9 = permissionInfoCache || {}
  var permissions = _ref9.permissions
  return !!(permissions || []).find(findName(permissionKey))
}
/**
 * 校验是否存在菜单权限
 * @param {string} permissionKey 菜单权限key
 * @returns {boolean}
 */

export function checkMenuPermission(permissionKey, route) {
  var _ref10 = permissionInfoCache || {}
  var menuList = _ref10.menuList
  var b = (menuList || []).find(findName(permissionKey))
  // console.log(route)
  if (b && route && route.meta) {
    route.meta.componentId = b.id
    route.meta.title = b.title
    // route.meta.url = b.url
  }
  return !!b
}

/**
 * 根据
 * @param {Array} router 菜单路由
 * @param {Object} options 权限限制配置项对象
 * @param options.uniqueKey {string} 路由中需要起权限标示作用的配置项key名  默认为 'key'
 * @param options.children {string}  路由中需要嵌套子路由作用的配置项key名  默认为 'children'
 * @param options.customCheck {CustomCheck} 自定义校验
 * @param options.ignoreList {Array<String>} 忽略权限校验的路由
 * @param options.ignoreEmpty {String>} 忽略校验无uniqueKey的路由
 * @returns {Array} 格式化后的路由
 */

export function routerFilter(router = [], options = undefined) {
  // 如果没传options的默认配置
  var _ref11 = options || {}
  var _ref11$uniqueKey = _ref11.uniqueKey
  var uniqueKey = _ref11$uniqueKey === void 0 ? 'key' : _ref11$uniqueKey
  var _ref11$childrenKey = _ref11.childrenKey
  var childrenKey = _ref11$childrenKey === void 0 ? 'children' : _ref11$childrenKey
  var _ref11$customCheck = _ref11.customCheck
  var customCheck = _ref11$customCheck === void 0 ? defaultCheck : _ref11$customCheck
  var _ref11$ignoreList = _ref11.ignoreList
  var ignoreList = _ref11$ignoreList === void 0 ? [] : _ref11$ignoreList
  var _ref11$ignoreEmpty = _ref11.ignoreEmpty
  var ignoreEmpty = _ref11$ignoreEmpty === void 0 ? false : _ref11$ignoreEmpty

  function defaultCheck(route) {
    var key = (route || {})[uniqueKey]
    if (key === undefined && ignoreEmpty) return true
    if (ignoreList.includes(key)) return true
    return checkMenuPermission(key, route)
  }

  var menuList = getMenuPermission()

  if (!isValidArray(menuList) || !isValidArray(router)) {
    return []
  }

  return treeFilter(router, customCheck, {
    childrenKey: childrenKey
  })
}
/**
 * 树状数据过滤
 * @param {Array} treeList 菜单路由
 * @param {Object} filterFn 自定义过滤行为
 * @param {string} options
 * @param {string} options.childrenKey 子项标识key 默认为 ‘children’
 * @returns {Array} 格式化后的路由
 */

function treeFilter(treeList, filterFn) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {}
  var _options$childrenKey = options.childrenKey
  var childrenKey = _options$childrenKey === void 0 ? 'children' : _options$childrenKey

  function _treeLoop(treeListCache, parent) {
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1
    return treeListCache.map((item) => {
      var children = item[childrenKey]
      var filterRes = filterFn(item)

      if (!filterRes) {
        return false
      } // 允许filterFn格式化

      var currItemMap = typeof filterRes === 'boolean' ? item : filterRes

      if (Array.isArray(children) && children.length) {
        currItemMap[childrenKey] = _treeLoop(children, currItemMap, level + 1)
      }

      return currItemMap
    }).filter((item) => {
      return !!item
    })
  }
  return _treeLoop(treeList)
}

export function getmenus(userid) {
  if (!userid) {
    Promise.reject('userid不能为空')
  }
  return $getmenus({ userid: userid }).then((res) => {
    if (res.code === 1) {
      permissionInfoCache = res.data
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res.message)
    }
  })
}

const PUBLICK_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDcwjySP4T61/8neKRDzjXw7qU1Q1Pt7MrOSz5uu1GmIGT0sbxsc1ZY0YX7LBvSlB9EdOjVkVfvgNM/ssmBKQw/cVRhK5YzEdUGQwvvvbYl97diYfTfr52DVoeRdKlodSnuKmSBpO4jOOoEewRqPBly9HUHclmQJo0TUig9DzPbwIDAQAB`

export async function commonLogin() {
  // let userInfo = AUTH_CACHE.get('userInfo') || ''
  let userInfo = ''
  const sso_uid = jsCookie.get('sso_uid')
  const external_user = jsCookie.get('external_user')
  if (!userInfo) {
    if (external_user) {
      // 账密登陆
      userInfo = await getEexternalUser()
      if (userInfo.code !== 1) {
        return Promise.reject(userInfo.message)
      }
      userInfo = userInfo.data
      AUTH_CACHE.set('userInfo', userInfo)
    } else {
      // 扫描登陆
      userInfo = await getUserInfo(sso_uid)
      if (userInfo.data && userInfo.data.length) {
        const data = userInfo.data[0]
        delete data.departmentid
        // delete data.departmentpath
        delete data.leaders
        // delete data.mobile
        delete data.password
        delete data.position
        delete data.wbUid
        delete data.wbUsername
        delete data.isleader
        delete data.userStatus
        for (const key in data) {
          switch (key) {
              case 'avatar':
                continue
              case 'departmentpath':
                continue
              case 'mobile':
                continue
          }
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(PUBLICK_KEY)
          data[key] = encrypt.encrypt(data[key])
        }
        userInfo = await register(data)
        if (userInfo.code !== 1) {
          return Promise.reject(userInfo.message)
        }
        userInfo = userInfo.data
        AUTH_CACHE.set('userInfo', userInfo)
      } else {
        return Promise.reject(userInfo)
      }
    }
  }

  const { data } = await $getMenuConfigData({
    menuCodes: [
      'config_pirates_select_button',
      'config_pirates_summary_button',
      'export_code_pirate',
      'config_self_select_button',
      'config_self_summary_button',
      'export_code_propriety'
    ].join(',')
  })

  const permission = await getmenus(userInfo.id)
  return {
    userInfo: userInfo,
    permission: permission,
    config: data || []
  }
}

function getUserInfo(sso_uid) {
  return $getUserInfo({ uid: sso_uid })
}

function register(data) {
  return $register(data)
}

function getEexternalUser() {
  return $getEexternalUser()
}
