/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-12-29 14:22:09
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 获取列表
 * @param params
 */
export function $getContentList(params) {
  return request.get(`/admin/list`, { params })
  // return axios.post(`/admin/list`, JSON.stringify(params), {
  //   headers: {
  //     'Content-Type': 'application/json'
  //   },
  // })
}

/**
 * 删除内容
 */
export function $delContentArticle(params) {
  return request.get(`/admin/delete`, { params })
}

/**
 * 创建内容
 */
export function $createContentArticle(params) {
  return request.post(`/admin/add`, params)
}

/**
 * 发布内容
 */
export function $publishContentArticle(params) {
  return request.get(`/admin/pushArticle`, { params })
}

/**
 * 更新内容
 */
export function $updateContentArticle(params) {
  return request.post(`/admin/update`, params)
}

/**
 * 导出内容
 */
export function $exportContentData(params) {
  return request.get(`/admin/exportArticleExcel`, { params })
}
/**
 * 查询banner条数限制
 * @param {*} params
 * @returns
 */
export function $getBannerLimit(params) {
  return request.get(`/admin/findBannerLimit`)
}
/**
 *
 * @param params
 */
export function $getUsers(params) {
  return request.get(`/hdjt/user/get_user`, { params })
}

/**
 *
 * @param params
 */
export function $getUsersDropdownData(params) {
  return request.get(`/comment/user_f`, { params })
}

/**
 *
 * @param params
 */
export function $getUsersRole(params) {
  return request.get(`/hdjt/user/hd_role`, { params })
}

/**
 *
 * @param params
 */
export function $addUser(params) {
  return request.post(`/hdjt/user/add_account`, params)
}

/**
 *
 * @param params
 */
export function $delUser(params) {
  return request.post(`/hdjt/user/del_account`, params)
}

/**
 * 新增组织结构
 * @param params
 */
export function $addOrganizationInfo(params) {
  return request.post(`/organization/info`, params)
}

/**
 * 修改组织结构
 * @param params
 */
export function $setOrganizationInfo(params) {
  return request.put(`/organization/info`, params)
}

/**
 * 删除组织结构
 * @param params
 */
export function $delOrganizationInfo(id) {
  return request.delete(`/organization/info/${id}`)
}

/**
 * 用户信息查询
 * @param params
 */
export function $getUserInfo(params) {
  return request.post(`/user/info`, params)
}

export function $getQSJUserInfo(params) {
  return request.post('/user/info', params)
}

/**
 * 获取离职人员
 */
export function $getMoveUserInfo(params) {
  return request.get(`/resignation/getUserInfoList`, { params })
}
export function $getMoveUserCondition(params) {
  return request.get(`/resignation/getCondition`)
}

/**
 * 【军籍管理】- 获取列表
 */

export function $getBasis(params) {
  return request.get(`/mng/user/basis`, { params })
}

/**
 * 【军籍管理】- 获取统计数据
 */

export function $getWorks(params) {
  return request.get(`/mng/user/basis/getworks`, { params })
}

/**
 * 【军籍管理】- 获取职位
 * @param {*} params
 */
export function $getPositions(params) {
  return request.get(`/mng/user/basis/position`, { params })
}

/**
 * 【军籍管理】- 获取用户信息
 * @param {*} params
 */
export function $getusers(params) {
  return request.get(`/mng/user/basis/getusers`, { params })
}
/**
 * 【军籍管理】- 军籍详情
 * @param {*} params
 */
export function $getSoilderNews(params) {
  return request.get(`/mng/user/basis/soilder_news`, { params })
}
/**
 * 【军籍管理】- 编辑军籍
 */

export function $updateBasis(params) {
  return request.put(`/mng/user/basis`, params)
}

/**
 * 添加用户
 */
export function $addUser2(params) {
  return request.post(`/user/info/add`, params)
}

/**
 * 用户下线
 */
export function $downOut(params) {
  return request.get(`/user/info/clear`, { params })
}

/**
 * 获取交接人员
 */
export function $getReceiverUser(params) {
  return request.get(`/resignation/getReceiverUser`, { params })
}

/**
 * 离职移交
 */
export function $receiverUser(params) {
  return request.post(`/resignation/transfer`, params)
}

/**
 *
 *
 * 查询可用状态的角色列表
 */
export function $getRoleAll(params) {
  return request.get(`/sys/user/role/getRoleByUserId`, { params })
}

/**
 * 根据组织id查询
 * @param {*} params
 */
export function $getUserRoleByOrgId(params) {
  return request.get(`/sys/org/role/getRoleByOrgId`, { params })
}

/**
 * 更新用户信息
 */
export function $updateUserInfo(params) {
  return request.post(`/user/info/update`, params)
}

/**
 * 查询用户已有角色
 */
export function $getRoleByUserId(params) {
  return request.get(`/sys/role/getRoleByUserId`, { params })
}

/**
 * 保存角色关系
 */
export function $saveRole(params) {
  return request.post(`/sys/user/role`, params)
}
/**
 * 批量删除用户
 */
export function $userBatchDel(params) {
  return request.post(`/user/info/batchDel`, params)
}

/**
 * 获取菜单列表
 */
export function $getMenuTree(params) {
  return request.get(`/sys/menu/getMenuTree`, { params })
}
/**
 * 删除菜单
 * @param {* number} params menuId
 * @returns
 */
export function $delMenuItem(params) {
  return request.post(`/sys/menu/deleteMenu`, params)
}

/**
 * 移动菜单
 * @param {*} params
 * @returns
 */
export function $updateMenuPid(params) {
  return request.post(`/sys/menu/updateMenuPid`, params)
}

/**
 * 查询角色列表
 */
export function $getRoleList(params) {
  return request.get(`/sys/role/getRoleList`, { params })
}
/**
 * 查询角色列表
 */
export function $getMenuRoles(params) {
  return request.get(`/sys/menu/getMenuRoles`, { params })
}
/**
 * 查询角色关联的用户
 * @param {*} params
 */
export function $getUserListByRoleId(params) {
  return request.get(`/sys/user/role/getUserInfoByRoleId`, { params })
}
/**
 * 根据角色roleId获取下面的菜单信息
 */
export function $getMenuByRoleId(params) {
  return request.get(`/sys/role/getMenuByRoleId`, { params })
}
/**
 * 更新菜单
 */
export function $updateMenu(params) {
  return request.post('/sys/menu/updateMenu', params)
}
/**
 * 新增菜单
 */
export function $addMenu(params) {
  return request.post('/sys/menu/addMenu', params)
}
/**
 * 新增角色
 */
export function $addRole(params) {
  return request.post('/sys/role/addRole', params)
}
/**
 * 更新角色
 */
export function $updateRole(params) {
  return request.post('/sys/role/updateRole', params)
}
/**
 * 删除指定的菜单角色关系
 */
export function $deleteBindRoleForMenu(params) {
  return request.post('/sys/menu/deleteBindRoleForMenu', params)
}
/**
 * 为菜单分配角色接口
 */
export function $bindRoleForMenu(params) {
  return request.post('/sys/menu/bindRoleForMenu', params)
}
/**
 * 为角色绑定菜单接口
 */
export function $bindMenuForRole(params) {
  return request.post('/sys/role/bindMenuForRole', params)
}

/**
 * 获取组织
 */
export function $getOrgInfo(params) {
  return request.get('/user/info/getCondition', { params })
}
/**
 * 根据组织ID获取绑定的角色
 */
export function $getRoleByOrgId(params) {
  return request.get('/organization/info/getRoleByOrgId', { params })
}
/**
 * 获取全部的组织信息
 */
export function $getOrgs(params) {
  return request.get('/organization/info/getOrgs', { params })
}
/**
 * 根据组织获取角色
 */
export function $getOrgByRoleId(params) {
  return request.get('/organization/info/getOrgByRoleId', { params })
}
/**
 * 更新组织
 */
export function $bindOrgForRole(params) {
  return request.post('/sys/role/bindOrgForRole', params)
}
/**
 * 根据菜单获取数据域配置信息
 */
export function $getDataScopeByMenuId(params) {
  return request.get('/sys/role/getDataScopeByMenuId', { params })
}
/**
 *  数据域SQL配置表
 */
export function $getDatascopeSql(params) {
  return request.get('/datascope/sql/list', { params })
}
/**
 *  数据域SQL配置表修改
 */
export function $updateDatascopeSql(params) {
  return request.post('/datascope/sql/update', params)
}
/**
 *  数据域SQL配置表新增
 */
export function $addDatascopeSql(params) {
  return request.post('/datascope/sql', params)
}
/**
 *  根据orgId、menuId、roleId修改t_sys_org_menu_role_datascope数据的datascopeSqlId
 */
export function $updateDataScopeForMenu(params) {
  return request.post('/sys/user/role/updateDataScopeForMenu', params)
}

/**
 * 获取组织和角色的信息
 */
export function $getRoleOrgList(params) {
  return request.get(`/sys/role/getRoleOrgList`, { params })
}

// 配置信息管理start

/**
 * 获取配置信息表
 */
export function $getConfigList(params) {
  return request.get('/sys/config/list', { params })
}

/**
 * 新增配置信息
 */
export function $addConfigItem(params) {
  return request.post(`/sys/config`, params)
}

/**
 * 修改配置信息
 */

export function $editConfigItem(params) {
  return request.put(`/sys/config`, params)
}

/**
 * 删除配置信息
 */
export function $deleteConfigItem(id) {
  return request.delete(`/sys/config/${id}`)
}

// 配置信息end

// 字段表start

/**
 * 获取字典表列表
 */
export function $getDictList(params) {
  return request.get(`/sys/dict/type/list`, { params })
}

/**
 * 新增字典
 */
export function $addDictItem(parmas) {
  return request.post(`/sys/dict/type`, parmas)
}

/**
 * 编辑字典
 */
export function $editDictItem(parmas) {
  return request.put(`/sys/dict/type`, parmas)
}

/**
 * 删除字典
 */
export function $deleteDictItem(id) {
  return request.delete(`/sys/dict/type/${id}`)
}

/**
 * 字典数据列表
 */
export function $getDictDataList(params) {
  return request.get(`/sys/dict/data/list`, { params })
}

/**
 * 字典数据删除
 */
export function $deleteDictData(id) {
  return request.delete(`/sys/dict/data/${id}`)
}

/**
 * 新增字典
 */
export function $addDictData(parmas) {
  return request.post(`/sys/dict/data`, parmas)
}

/**
 * 编辑字典
 */
export function $editDictData(parmas) {
  return request.put(`/sys/dict/data`, parmas)
}

/**
 * 口令管理列表
 */
export function $getCommandList(params) {
  return request.get(`/word/command/commandList`, { params })
}

/**
 * 口令管理搜索列表数据
 */
export function $getCommandCondition(params) {
  return request.get(`/word/command/findWordOfCommandCondition`, { params })
}

/**
 * 口令删除
 */
export function $deleteCommandById(params) {
  return request.post(`/word/command/deleteCommandById`, params)
}

/**
 * 新增口令
 */

export function $addWordOfCommand(params) {
  return request.post(`/word/command/addWordOfCommand`, params)
}

/**
 * 编辑
 */
export function $updateCommand(params) {
  return request.post(`/word/command/updateCommand`, params)
}

/**
 * 修改用户基本信息
 */
export function $editBaseInfo(params) {
  return request.post('/user/info/editBaseInfo', params)
}

/**
 * 视频类型管理-获取视频类型列表
 */

export function $getVideoTypeManageList(params) {
  return request.get(`/video/type/list`, { params })
}

/**
 * 视频类型管理-编辑视频类型
 */
export function $editVideoType(params) {
  return request.post(`/video/type/editVideoType`, params)
}
/**
 * 视频类型管理-批量编辑视频类型
 */
 export function $editMoreVideoType(params) {
  return request.post(`/video/type/batchEditByVideoType`, params)
}

/**
 * 视频类型管理-新增视频类型
 */
export function $addVidepType(params) {
  return request.post(`/video/type/addVideoType`, params)
}

/**
 * 视频类型管理-获取视频类型
 */
 export function $getVideoTypeList(params) {
  return request.get(`/video/type/getVideoType`, { params })
}

/**
 * 视频类型组织管理 - 获取列表
 */
export function $getVideoTypeBindList(params) {
  return request.get(`/video/type/bindList`, { params })
}

//

/**
 * 视频类型组织管理 - 获取组织
 */
 export function $getOrganizationInfoCondition(params) {
  return request.get(`/video/type/getOrganizationInfoCondition`, { params })
}

/**
 * 视频类型组织管理 - 根据组织获取绑定的视频类型
 */
 export function $getVideoTypeByOrgId(params) {
  return request.get(`/video/type/getVideoTypeByOrgId`, { params })
}

/**
 * 视频类型组织管理 -组织绑定视频类型
 */
 export function $bindVideoType(params) {
  return request.post(`/video/type/bindVideoType`, params)
}

/**
 * 查询上次邮寄信息导入情况
 */
export function $getPreImportStatus(params) {
  return request.get(`/delivery/new//getLastUploadList`, { params })
}

/**
 * 查询搜索条件角色列表
 */
 export function $getRoleData(params) {
  return request.get(`/sys/role/getRoleInfo`, { params })
}

/**
 * 查询角色列表
 */
 export function $getAllRole() {
  return request.get(`/sys/role/all?random=${Math.random()}`)
}

// 备份角色、菜单、权限表接口：
export function $bakMenuAuthTable() {
  return request.get('/sys/menu/bakMenuAuthTable')
}

// 获取快速登录的用户名
export function $getQuickLoginUserName(params) {
  return request.post('user/info/list', params)
}

// 添加路由
export function $addRoute(params) {
  return request.post('sys/route/add', params)
}

// 编辑路由
export function $updateRoute(params) {
  return request.post('sys/route/update', params)
}
// 删除路由
export function $deleteRoute(params) {
  return request.post('sys/route/delete', params)
}
// 发布路由
export function $publishRoute(params) {
  return request.post('sys/route/publish', params)
}
// 获取路由列表
export function $getRouteList(params) {
  return request.get('sys/route/list', { params })
}
// 同步角色、菜单、权限到测试环境：
export function $syncMenuToTest() {
  return request.get('/sys/menu/syncMenuToTest')
}

// 获取信鸽列表
export function $getCarrierList(params) {
  return request.get('/msg/register/list', { params })
}

// 获取信鸽列表
export function $getRobotList() {
  return request.get('/msg/register/robot/list')
}

// 注册信鸽
export function $registerRobot(params) {
  return request.post('/msg/register/register', params)
}

// 获取信鸽条件
export function $carrierCondition() {
  return request.get('/msg/register/condition')
}

// 获取信鸽模版列表
export function $getTempleteList() {
  return request.get('/msg/register/template/list')
}
