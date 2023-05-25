/* eslint-disable no-const-assign */
import jsCookie from 'js-cookie'
import JSEncrypt from 'jsencrypt'
import Cache from '@/utils/cache'
import {
  $getUserInfo,
  $getOldMenus,
  $getEexternalUser,
  $getMenus
} from '@/api/user'
import { $getDataByDictType } from '@/api/index'
import {
  $getMenuConfigData
} from '@/api/proprietary-orders'
import {
  $register
} from '@/api'
import { $getRouteList } from '@/api/backend-manage'
import Layout from '@/layout'
import routerView from '@/layout/components/routerView'
// import {
//   routerMaps
// } from '@/router/routerMap'
import {
  copy
} from '@/utils'
import { cloneDeep } from 'lodash'
let routerMaps = new Map()
let routerFilter = newRouterFilter
let checkMenuPermission = newCheckMenuPermission

// import { checkMenuPermission } from './indexOld'
const AUTH_CACHE = new Cache({
  'prefix': 'AUTH'
})

function isValidArray(list) {
  return Array.isArray(list) && list.length
}

// 菜单及权限对象
var permissionInfoCache = {}

// 获取有权限的菜单列表
export function getNewMenuPermission() {
  var _ref6 = permissionInfoCache || {}
  var menuList = _ref6.menuList && _ref6.menuList.length > 0 ? _ref6.menuList[0].children : []
  return isValidArray(menuList) ? menuList : []
}

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

// 校验菜单列表的children是否跟routerMaps对应
export function newCheckMenuPermission(componentName) {
  var b = routerMaps.get(componentName)
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

export function newRouterFilter(router = [], options = undefined) {
  var menuList = getNewMenuPermission()
  if (!isValidArray(menuList)) {
    return []
  }
  return newTreeFilter(menuList)
}
/**
 * 树状数据过滤
 * @param {Array} treeList 菜单路由
 * @param {Object} filterFn 自定义过滤行为
 * @param {string} options
 * @param {string} options.childrenKey 子项标识key 默认为 ‘children’
 * @returns {Array} 格式化后的路由
 */

function newTreeFilter(menuList) {
  // 将首页永远置于第一位
  function adjustFirstMenu(menuList) {
    const index = menuList.findIndex(item => item.code === 'index')
    const MenuListCopy = copy(menuList)
    MenuListCopy.unshift(...MenuListCopy.splice(index, 1))
    return MenuListCopy
  }
  const _menuList = adjustFirstMenu(menuList)
  // 根据菜单code使用一级菜单组件
  function _setParentComponent(code) {
    if (['qp_businesss', 'qp_sign', 'qp_studio', 'pirate_operating', 'pirate_putting', 'pirate_self', 'business_transformatio', 'pirate_operating'].includes(code)) {
      return routerView
    } else {
      return Layout
    }
  }
  // 区分乾派、海盗、公共菜单引用文件
  function _setComponent(menu) {
    if (menu.url) {
      return () => import('@/views/data-manage/iframe')
    }
    // 乾派迁移至qianshuju-qp的页面
    if (+menu.menuBelong === 2 && +menu.isMoveted === 1) {
      return () => import('@/views/business-qp/index')
    }
    return routerMaps.get(menu.code || 'index') ? () => import('@/views/' + routerMaps.get(menu.code || 'index').split('@/views/')[1]) : null
  }

  // 判断quickBi Url是否存在，如果quickBiurl存在
  function _hasQuickBiUrl(item) {
    return item.url && item.url.length > 5
  }
  // 为菜单无法匹配到路由的componet赋值为null,后面将其过滤
  // 无法匹配到路由文件则说明该文件不存在
  // 递归遍历格式化menuList
  function traverseMenu(_menuList) {
    _menuList.forEach((menu, index) => {
      menu.meta = {
        title: menu.name,
        icon: menu.icon,
        hidden: !!menu.hidden
      }
      menu.meta.componentId = menu.id
      if (menu.parentFlag || menu.code === 'index' || menu.hidden && menu.children) {
        menu.component = _setParentComponent(menu.code)
        if (!menu.children) {
          menu.children = [{
            path: '',
            name: menu.name,
            text: menu.name,
            meta: {
              title: menu.name,
              hidden: !!menu.hidden,
              componentId: menu.id,
              url: menu.url || ''// url为iframe页面，配置的quickBi链接
            },
            component: _setComponent(menu)
          }]
        } else {
          // 处理只有一个菜单时，无需展示父级
          if (menu.children.length === 1) {
            const itemMenu = menu.children[0]
            menu.meta = {
              title: itemMenu.name,
              icon: menu.icon,
              hidden: !!itemMenu.hidden
            }
            menu.meta.componentId = menu.id
            menu.children = [{
              path: '',
              name: itemMenu.name,
              text: itemMenu.name,
              meta: {
                title: itemMenu.name,
                hidden: !!itemMenu.hidden,
                componentId: itemMenu.id,
                url: itemMenu.url || ''
              },
              component: _setComponent(itemMenu)
            }]
          } else {
            traverseMenu(menu.children)
          }
        }
      } else {
        if (_hasQuickBiUrl(menu)) {
          menu.meta.url = menu.url
          menu.component = () => import('@/views/data-manage/iframe')
        } else {
          menu.component = _setComponent(menu)
        }
        menu.meta.hidden = !!menu.hidden
        delete menu.children
      }
    })
    return _menuList
  }

  const filterAllMenuList = cloneDeep(traverseMenu(_menuList))
  // 移除component为null的项
  function removeNullComponents(array) {
    return array.map(obj => {
      if (obj.children) {
        // 菜单管理仅有一个父菜单时，若未创建路由则直接返回null过滤
        if (obj.children.length === 1) {
          return obj.children[0].component !== null ? obj : null
        }
        obj.children = removeNullComponents(obj.children)
        return Object.keys(obj).length > 0 ? obj : null
      } else {
        return obj.component !== null ? obj : null
      }
    }).filter(obj => obj !== null)
  }
  console.info('removeNullComponents(filterAllMenuList)', removeNullComponents(filterAllMenuList))
  return removeNullComponents(filterAllMenuList)
}
function getDictType() {
  return $getDataByDictType({ dictTypes: ['switch_menus_api'] })
  .then(res => {
    if (res.code === 1 && res.data) {
      if (res.data && res.data.switch_menus_api) {
        const { switch_menus_api: objType } = res.data
        if (+objType[0].dictValue) {
          routerFilter = oldRouterFilter
          checkMenuPermission = oldCheckMenuPermission
        } else {
          routerFilter = newRouterFilter
          checkMenuPermission = newCheckMenuPermission
        }
        localStorage.setItem('menu-type', objType[0].dictValue)
      }
      return Promise.resolve(res.data)
    }
  })
}
// 获取路由与页面之间的映射关系
function getRouterList() {
  return $getRouteList()
  .then(res => {
    if (res.code === 1 && res.data) {
      const map = new Map();
      (res.data || []).forEach(item => {
        if (item.isPublished && item.isForbidden) {
          map.set(item.routeCode, item.routeAddress)
        }
      })
      return Promise.resolve(map)
    }
  })
}
const PUBLICK_KEY = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCDcwjySP4T61/8neKRDzjXw7qU1Q1Pt7MrOSz5uu1GmIGT0sbxsc1ZY0YX7LBvSlB9EdOjVkVfvgNM/ssmBKQw/cVRhK5YzEdUGQwvvvbYl97diYfTfr52DVoeRdKlodSnuKmSBpO4jOOoEewRqPBly9HUHclmQJo0TUig9DzPbwIDAQAB`
// ---------------------------------------------------------------------------
export function getMenuPermission() {
  var _ref6 = permissionInfoCache || {}
  var menuList = _ref6.menuList

  return isValidArray(menuList) ? menuList : []
}
/**
 * 校验是否存在菜单权限
 * @param {string} permissionKey 菜单权限key
 * @returns {boolean}
 */

function oldCheckMenuPermission(permissionKey, route) {
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

function oldRouterFilter(router = [], options = undefined) {
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

function getUserInfo(sso_uid) {
  return $getUserInfo({
    uid: sso_uid
  })
}

function register(data) {
  return $register(data)
}

function getEexternalUser() {
  return $getEexternalUser()
}
function _getMenus(userid, type) {
  if (!userid) {
    Promise.reject('userid不能为空')
  }
  const $api = +type ? $getOldMenus : $getMenus
  return $api({ userid: userid }).then((res) => {
    if (res.code === 1) {
      permissionInfoCache = res.data
      return Promise.resolve(res.data)
    } else {
      return Promise.reject(res.message)
    }
  })
}
async function commonLogin() {
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
      'export_code_propriety',
      'dy_talent_bank_select'
    ].join(',')
  })
  const { switch_menus_api: objType } = await getDictType()
  routerMaps = await getRouterList()
  const permission = await _getMenus(userInfo.id, +objType[0].dictValue)
  return {
    userInfo: userInfo,
    permission: permission,
    config: data || [],
    routerMaps: routerMaps || new Map()
  }
}
if (+localStorage.getItem('menu-type')) {
  routerFilter = oldRouterFilter
  checkMenuPermission = oldCheckMenuPermission
}
export {
  commonLogin,
  routerFilter,
  checkMenuPermission,
  routerMaps
}
