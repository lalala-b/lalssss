import request from '@/http'
import qs from 'qs'

/**
 * 获取标签库列表
 */
export const $getTagLibraryList = (params) => {
  return request.get('/sys/plat/tag/findSysPlatTagList', { params })
}

/**
 * 获取标签库筛选条件
 */
export const $getTagLibraryCondition = (params) => {
  return request.get('/sys/plat/tag/findSysPlatTagCondition', { params })
}

/**
 * 获取标签详情
 */
export const $getTagDetail = (params) => {
  return request.get('/sys/plat/tag/findSysPlatTagInfo', { params })
}

/**
 * 查询一级标签，新建二级标签时使用
 */
export const $getFirstLevelTag = (params) => {
  return request.get('/sys/plat/tag/findFirstLevelTag', { params })
}

/**
 * 新增系统自定义标签接口
 */
export const $addSysPlatTag = (params) => {
  return request.post('/sys/plat/tag/addSysPlatTag', params)
}

/**
 * 更新系统自定义标签接口
 */
export const $updateSysPlatTag = (params) => {
  return request.post('/sys/plat/tag/updateSysPlatTagRequest', params)
}

/**
 * 删除系统自定义标签接口
 */
export const $deleteSysPlatTag = (params) => {
  return request.get('/sys/plat/tag/deleteSelfTag', { params })
}

/**
 * 根据平台获取标签内容
 */
export const $getPlatTagTypeList = (params) => {
  return request.get('/sys/plat/tag/findTagType', { params })
}
