/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-12-22 11:48:11
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 *
 * @param params
 */
export function $getCondition(params) {
  return request.get(`/achievement/video/getCondition`, { params })
}

/**
 * 【视频标记】- 视频录入列表
 * @param {*} params platId 平台id
 * @param {*} params accountName 账号名称
 * @param {*} params title 标题
 * @param {*} params junType 视频分类
 * @param {*} params job 人员职责类型
 * @param {*} params editId 编辑人员id
 * @param {*} params cutId 剪辑人员id
 * @param {*} params publicUserId 人员id
 * @param {*} params startTime 开始时间
 * @param {*} params endTime 结束时间
 * @param {*} params flowStart 流量区间最小值
 * @param {*} params flowEnd 流量区间最大值
 * @param {*} params determined 排序规则
 * @param {*} params pageNum 页码
 */
export function $getVideoInputList(params) {
  return request.post(`/video/input/getVideoInputList`, params)
}
/**
 * 【军工审核】- 审核录入视频列表
 * @param {*} params
 */
export function $getExamineInputVideoList(params) {
  return request.post(`/video/input/examineInputVideoList`, params)
}

/**
 * 【军工审核】- 审核录入视频 审核
 * @param {*} params uploadIdList 审核的id集合
 * @param {*} params hdStatus 审核状态
 */
export function $setExamineVideo(params) {
  return request.post(`/video/input/examineVideo?now=` + Date.now(), params)
}

/**
 * 【军工审核】- 审核录入视频 - 申诉修改
 * @param {*} params
 */
export function $appealUpdateVideo(params) {
  return request.post(`/video/input/appealUpdateVideo`, params)
}

/**
 * 【视频标记】- 列表删除
 * @param {*} params uploadId 视频id
 */
export function $deleteInputItem(params) {
  return request.get(`/video/input/delete`, { params })
}

/**
 *  查询录入的视频账号选项
 * @param {*} params type 查询类型：1-个人，2-团队
 * @param {*} params platId 查询类型：平台id
 */
export function $getAccountCondition(params) {
  return request.get(`/video/input/getAccountCondition`, { params })
}

/**
 *  【视频标记】- 编辑录入视频
 * @param {*} params uploadId 视频id
 * @param {*} params belongName 统一名称
 * @param {*} params platId 平台id
 * @param {*} params platName 平台名称
 * @param {*} params accountName 账号名
 * @param {*} params url 视频链接
 * @param {*} params titleName 视频标题
 * @param {*} params addTime 发布时间
 * @param {*} params flowCount 流量
 * @param {*} params videoUrl 上传素材视频url
 * @param {*} params imgUrl 上传素材图片url
 * @param {*} params junType 视频类型
 * @param {*} params editId 编辑人员id
 * @param {*} params editName 编辑人员姓名
 * @param {*} params cutId 剪辑人员id
 * @param {*} params cutName 剪辑人员姓名
 */
export function $updateVideoInputSelfVideo(params) {
  return request.post(`/video/input/updateVideoInputSelfVideo`, params)
}
/**
 * 【视频标记】- 添加录入视频
 * @param {*} params
 */
export function $addVideoInputSelfVideo(params) {
  return request.post(`/video/input/addVideoInputSelfVideo`, params)
}

/**
 * 获取标记状态
 * @param {*} params
 */
export function $getExamineSignStatus(params) {
  return request.get(`/video/input/getExamineSignStatus`, { params })
}
/**
 * 【军工查询】- 手工录入视频列表
 * @param {*} params
 */
export function $getByHandVideoInputList(params) {
  return request.post(`/video/input/getByHandVideoInputList`, params)
}
/*
 * @param params
 */
export function $getAchievementList(params) {
  return request.post(`/achievement/video/list`, params)
}

/**
 * 【视频标记】-批量标记
 * @param params
 */
export function $putAchievementVideo(params) {
  return request.put(`/achievement/video`, params)
}

/**
 * 【系统采集系统】-条件查询
 * @param params
 */
export function $sysGetCondition(params) {
  return request.get(`/video/collect/getCondition`, { params })
}

/**
 * 【系统采集系统】-数据查询
 * @param params
 */
export function $sysGetList(params) {
  return request.post(`/video/collect/list`, params)
}

/**
 * 【审核标记视频】-标记开启|停止
 * @param params
 */
export function $markChange(params) {
  return request.post(`/video/examine/change`, params)
}

/**
 * 【审核视频标记】-数据查询
 * @param params
 */
export function $getMarkList(params) {
  return request.post(`/video/examine/list`, params)
}

/**
 * 【审核视频标记】-数据查询
 * @param params
 */
export function $batchMVideo(params) {
  return request.put(`/video/examine?now=` + Date.now(), params)
}

/**
 * 【审核标记视频】-申诉修改
 * @param params
 */
export function $complainEdit(params) {
  return request.put(`/video/examine/complain`, params)
}

/**
 * 【审核标记视频】-获取标记状态
 * @param params
 */
export function $getMarkStatus() {
  return request.get(`/video/input/getExamineSignStatus`)
}

/**
 * 【审核标记视频】-获取标记状态
 * @param params
 */
export function $uploadMilitarySource(params) {
  return request.post(`/achievement/video/upload`, params)
}

/**
 * 【投放视频标记】- 条件查询
 * @param params
 */
export function $getSignCondition(params) {
  return request.get(`/achievement/putting/video/sign/getCondition`, params)
}

/**
 * 【投放视频标记】- 条件查询
 * @param params
 */
export function $getVideoType(params) {
  return request.get(`/achievement/putting/video/sign/getVideoType`, { params })
}

/**
 * 【投放视频标记】- 数据查询
 * @param params
 */
export function $getSignList(params) {
  return request.post(`/achievement/putting/video/sign/list`, params)
}

/**
 * 【投放视频标记】- 批量标记
 * @param params
 */
export function $putBatchSign(params) {
  return request.put(`/achievement/putting/video/sign/batchSign`, params)
}

/**
 * 【投放视频标记】- 数据编辑
 * @param params
 */
export function $updateSign(params) {
  return request.put(`/achievement/putting/video/sign/update`, params)
}

/**
 * 【军功查询-投放视频】- 条件查询
 * @param params
 */
export function $getPuttingCondition() {
  return request.get(`/achievement/putting/video/getCondition`)
}

/**
 * 【军功查询-投放视频】- 组织筛选框数据获取
 * @param params
 */
export function $getSearchOrgInfo(params) {
  return request.get(`/achievement/putting/video/getOrgInfo`, { params })
}

/**
 * 【军功查询-投放视频】- 数据查询
 * @param params
 */
export function $getVideoList(params) {
  return request.post(`/achievement/putting/video/list`, params)
}

/**
 * 【军功查询-投放视频】- 条件查询
 * @param params
 */
export function $getExamineCondition() {
  return request.get(`/video/examine/video/putting/getCondition`)
}

/**
 * 【军功查询-投放视频】- 数据查询
 * @param params
 */
export function $getVideoExamineList(params) {
  return request.post(`/video/examine/video/putting/list`, params)
}

/**
 * 视频标记未标记完成接口
 * @param {*} params
 */
export function $getVideoUnSign(params) {
  return request.get('/achievement/video/unSign', { params })
}

/**
 * 投放视频未标记完成接口
 * @param {*} params
 */
export function $getPuttingVideoUnSign(params) {
  return request.post('/achievement/putting/video/sign/unSign', params)
}

export function $getMarkAccount(params) {
  return request.get('/achievement/video/getAccountInfoByPlatIds', { params })
}

/**
 * 投放视频平台账号联动
 */
export function $getAccountsByPlatId(params) {
  return request.get(`/achievement/putting/video/getAccounts`, { params })
}

/**
 * 获取已计算完军功日期的后一天
 */
export function $getLastSoilderDate(params) {
  return request.get(`/video/examine/getLastSoilderDate`, { params })
}
/**
 * 计算军工
 * @param {*} params
 */
export function $startCalculation(params) {
  return request.post(`video/examine/startCalculation`, params)
}

/**
 * 计算军工状态
 */
export function $getSoilderComputeringFlag(params) {
  return request.get(`/video/examine/getSoilderComputeringFlag`, { params })
}

/**
 * 系统采集视频-根据平台、组织id查询账号
 * orgId
 * platId
 */
export function $getAccontByOrgIdOrPlatId(params) {
  return request.get(`/video/collect/getByCondition`, { params })
}

/**
 * 军工审核-审核标记视频获取组织信息
 */

export function $getOrgInfo(params) {
  return request.get(`/video/examine/getCondition`)
}

/**
 * 军工审核-审核视频标记-平台、组织获取账号信息
 */
export function $getAuditAccountByOrgIdOrPlatId(params) {
  return request.get(`video/examine/getByCondition`, { params })
}

/**
 * 军工审核-审核投放视频-平台、组织获取账号信息
 */
export function $getDeliveryAccountByOrgIdOrPlatId(params) {
  return request.get(`/video/examine/video/putting/getByCondition`, { params })
}
/**
 * 军工审核-审核录入视频-平台、组织获取账号信息
 */
export function $getInputAccountByOrgIdOrPlatId(params) {
  return request.get(`/video/input/getByCondition`, { params })
}

/**
 * 军工审核-审核投放视频-组织筛选框数据获取
 * @param params
 */
export function $getAuditOrgInfo(params) {
  return request.get(`/video/examine/video/putting/getOrgInfo?`, { params })
}

/**
 * 视频标记-投放视频 根据平台ID获取账号信息和视频类型
 */

export function $getByPlatId(params) {
  return request.get(`/achievement/putting/video/sign/getByPlatId`, { params })
}

/** -------------------- 军工流程 ----------------------- */

/**
 * 过滤无需审核
 */
export function $filterIgnoreData(params) {
  return request.post(`/video/examine/filterNoNeed`, params)
}

/**
 * 更新节点流量
 */
export function $updateNodeFlow(params) {
  return request.post(`/video/examine/saveOldFlowCount`, params)
}

/**
 * 备份数据
 */
export function $backUpData(params) {
  return request.post(`/soilder/info/backUpData`, params)
}

/**
 * 计算军工
 */
export function $plusStartCalculation(params) {
  return request.post(`/soilder/info/plusStartCalculation`, params)
}

/**
 * 口令更改
 */

export function $updateVideoInfo(params) {
  return request.post(`/achievement/video/updateVideoInfo`, params)
}
/**
 * 更新产品型号
 */
export function $updatePhoneModel(params) {
  return request.put(`/achievement/video/updatePhoneModel`, params)
}

/**
 * 获取海盗前台人员
 */
export function $getPirateFrontUsers() {
  return request.get(`/user/info/getPirateFrontUsers`)
}

/**
 * 军功审核-系统采集视频-删除视频
 */
export function $deleteVideoByFlowId(params) {
  return request.post(`/video/examine/deleteVideoByFlowId`, params)
}
