<template>
  <el-dialog
    :title="typeTitle"
    :visible="showAddDialog"
    width="1000px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <div v-if="type === 'view'" class="add-form">
      <el-form v-loading="loading" class="form-view" label-width="150px">
        <p class="form-title">商业信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单名称：">
                {{ formData.projectName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号平台：">
                {{ formData.platName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单类型：">
                {{ projectTypeMap.get(formData.projectType) }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下单账号：">
                {{ formData.accountName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商务小组：">
                {{ formData.businessGroupName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否加入乾派MCN：">
                {{
                  formData.joinMcnFlag === 1
                    ? '是'
                    : formData.joinMcnFlag === 0
                      ? '否'
                      : '--'
                }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商务对接人：">
                {{ formData.businessUserName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已定档期：">
                {{ formData.finishTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约团队：">
                {{ formData.signGroupName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="达人分成比例：">
                {{
                  formData.outMoneyRatio ? `${formData.outMoneyRatio}%` : '--'
                }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约小组：">
                {{ formData.signTeamName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内容协助：">
                {{ formData.contentAssist ? '需要' : '--' }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="经纪人：">
                {{ formData.signUserName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工单状态：">
                {{
                  orderStatusMap.get(formData.workerStatus)
                    ? orderStatusMap.get(formData.workerStatus)
                    : '--'
                }}
              </el-form-item>
              <el-form-item label="工单ID：">
                {{ formData.workId | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="form-title m-t-20">订单信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号单价：" prop="accountUnitPrice">
                {{ formData.accountUnitPrice | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="绑定视频：">
                <div v-if="activeLinkUrl">
                  <el-link
                    type="primary"
                    class="text-over-hidden-1"
                    :href="activeLinkUrl"
                    :underline="false"
                    target="_blank"
                  >
                    {{ activeLinkUrl }}
                  </el-link>
                </div>
                <template v-else>
                  <div v-if="formData.video.url" class="video flex">
                    <div v-if="formData.video.isDeleted" class="flex del-txt">
                      <span>(已删除)</span>
                      <div class="video-title text-over-hidden-1">{{ formData.video.titleName }}</div>
                    </div>
                    <el-link
                      v-else
                      type="primary"
                      class="text-over-hidden-1"
                      :href="formData.video.url"
                      :underline="false"
                      target="_blank"
                    >
                      {{ formData.video.titleName }}
                    </el-link>
                  </div>
                  <span v-else>--</span>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户返点比例：">
                {{ formData.refundRatio ? `${formData.refundRatio}` : '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视频发布时间：">
                {{ formData.video.addTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户返点金额：">
                {{ formData.refundMoney }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="播放量：" prop="flowCount">
                {{ formData.flowCount ? formData.flowCount : '--' }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="（订单价格）流水：">
                {{ orderMoney || orderMoney === 0 ? orderMoney : '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CPM：" prop="cpm">
                {{ formData.cpm | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="达人实际营收：">
                {{ formData.outMoney | emptyFill }}
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <template v-if="formData.projectType">
                <el-form-item
                  v-if="
                    formData.projectType !== '3' && formData.joinMcnFlag == 0
                  "
                  label="是否返款"
                >
                  {{
                    formData.refundFlag
                      ? +formData.refundFlag === 1
                        ? '是'
                        : '否'
                      : '--'
                  }}
                </el-form-item>
                <el-form-item
                  v-if="
                    formData.projectType === '3' && formData.joinMcnFlag === 1
                  "
                  label="是否到账"
                >
                  {{
                    formData.transferFlag
                      ? +formData.transferFlag === 1
                        ? '是'
                        : '否'
                      : '--'
                  }}
                </el-form-item>
              </template>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="其他费用：">
                <div class="flex">
                  {{ formData.otherMoney | emptyFill }}
                  <IconTip
                    content="豆荚等维护费用、或者是差旅等业务费用"
                    label=""
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
              <el-form-item label="中台实际营收：">
                <div class="flex">
                  {{ formData.centerMoney | emptyFill }}
                </div>
              </el-form-item>
              <el-form-item v-if="projectType === 1&&workId > 0" label="平台任务ID：">
                {{ formData.platTaskId | emptyFill }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="款项截图：">
                <UploadImg
                  v-model="formData.collectionScreenshots"
                  :limit="3"
                  :disabled="canEdit"
                  size="small"
                />
                <div v-if="!formData.collectionScreenshots.length">--</div>
              </el-form-item>
              <el-form-item v-if="projectType === 1&&workId > 0" label="锁定金额：">
                {{
                  formData.lockMoney !== null
                    ? formData.lockMoney
                      ? '是'
                      : '否'
                    : '--'
                }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="应收或应付：">
                {{ +formData.paymentType === 1 ? '应向达人付款' : +formData.paymentType === 2 ? '应向达人收款' : '--' }}
              </el-form-item>
            </el-col>
            <el-col v-if="+formData.paymentType === 1 || +formData.paymentType === 2" :span="12">
              <el-form-item :label="`${+formData.paymentType === 1 ? '打款' : '追款'}情况：`">
                <template v-if="+formData.paymentType === 1">
                  {{ +formData.paymentResult === 1 ? '已向达人付款' : +formData.paymentResult === 2 ? '未向达人付款​' : '--' }}
                </template>
                <template v-if="+formData.paymentType === 2">
                  {{ +formData.paymentResult === 1 ? '收款已到账' : +formData.paymentResult === 2 ? '收款未到账' : '--' }}
                </template>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="+formData.paymentType && +formData.paymentResult === 1">
            <el-col :span="12">
              <el-form-item :label="`${+formData.paymentType === 1 ? 'OA流程编号' : '绩效月'}：`">
                <template v-if="+formData.paymentType === 1">
                  {{ formData.oaContractNumber || '--' }}
                </template>
                <template v-if="+formData.paymentType === 2">
                  {{ formData.monthMoney || '--' }}
                </template>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 新的视频工单：projectType === 1&&workId > 0  -->
          <el-row v-if="projectType === 1&&workId > 0">
            <el-col :span="12">
              <el-form-item label="撤单：">
                {{ formData.cancelOrderStatus ? '是' : '否' }}
              </el-form-item>
            </el-col>
            <el-col v-if="formData.cancelOrderStatus" :span="12">
              <el-form-item label="撤单原因：">
                {{ formData.cancelOrderReason || '--' }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <template v-if="projectType === 1&&workId > 0">
          <p class="form-title m-t-20">财务信息</p>
          <div class="form-border">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售收入：">
                  {{ financeInfoBO.workMoney | emptyFill }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售成本：">{{
                  financeInfoBO.costMoney | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="执行金额："
                >{{ financeInfoBO.executeMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="达人分成成本：">{{
                  financeInfoBO.allOutMoney | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="绩效营收：">{{
                  financeInfoBO.performanceMoney | emptyFill
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="已付客户返点：">{{
                  financeInfoBO.customerRebatePaid | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="是否已开发票："
                >{{
                  [0, 1].includes(financeInfoBO.receiptStatus)
                    ? financeInfoBO.receiptStatus
                      ? '是'
                      : '否'
                    : '--'
                }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="财务是否核账：">{{
                  [0, 1].includes(financeInfoBO.reconciliationStatus)
                    ? financeInfoBO.reconciliationStatus
                      ? '是'
                      : '否'
                    : '--'
                }}</el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <p class="m-t-16 form-title">备注</p>
        <div> {{ formData.remark }}</div>
      </el-form>
    </div>
    <div v-else class="add-form">
      <el-form
        ref="addForm"
        v-loading="loading"
        :model="formData"
        :rules="addFormRules"
        class="norm-form form"
        label-width="150px"
      >
        <p class="form-title">商业信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单名称：" prop="projectName">
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.projectName | emptyFill }}
                </div>
                <el-input
                  v-else
                  v-model="formData.projectName"
                  :disabled="+formData.workerStatus === 4"
                  size="small"
                  maxlength="10"
                  @input="
                    formData.projectName = arguments[0].replace(
                      /[^\u0391-\uFFE5A-Za-z0-9]/g,
                      ''
                    )
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号平台：" prop="platId">
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.platName | emptyFill }}
                </div>
                <el-select
                  v-else
                  v-model="formData.platId"
                  :disabled="+formData.workerStatus === 4"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  @change="handlePlat"
                >
                  <el-option
                    v-for="item in plats"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="订单类型：" prop="projectType">
                <div v-if="projectType === 1&&workId > 0">
                  {{ projectTypeMap.get(formData.projectType) }}
                </div>
                <el-select
                  v-else
                  v-model="formData.projectType"
                  :disabled="+formData.workerStatus === 4"
                  filterable
                  clearable
                  size="small"
                  @change="handleProjectType"
                >
                  <el-option
                    v-for="item in dictValueList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                    :disabled="item.dictValue == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下单账号：" prop="accountId">
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.accountName | emptyFill }}
                </div>
                <el-select
                  v-else
                  v-model="formData.accountId"
                  placeholder="请选择"
                  :disabled="+formData.workerStatus === 4"
                  size="small"
                  filterable
                  clearable
                  @change="handleOrderAccount"
                >
                  <el-option
                    v-for="item in orderAccountList"
                    :key="item.accountId"
                    :label="item.accountName"
                    :value="item.accountId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                v-if="formData.projectType !== '2'"
                label="商务小组："
                prop="businessGroupId"
                :required="formData.projectType === '1' ? true : false"
              >
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.businessGroupName | emptyFill }}
                </div>
                <el-select
                  v-else
                  v-model="formData.businessGroupId"
                  :disabled="+formData.workerStatus === 4"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                  @change="handleBusinessGroup"
                >
                  <el-option
                    v-for="item in businessInfoList"
                    :key="item.businessGroupId"
                    :label="item.businessGroupName"
                    :value="item.businessGroupId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-else label="商务小组：" prop="businessGroupName">
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.businessGroupName | emptyFill }}
                </div>
                <el-input
                  v-else
                  v-model="formData.businessGroupName"
                  :disabled="+formData.workerStatus === 4"
                  size="small"
                  maxlength="10"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否加入乾派MCN：">
                {{
                  +formData.joinMcnFlag === 1
                    ? '是'
                    : +formData.joinMcnFlag === 0
                      ? '否'
                      : '--'
                }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                v-if="formData.projectType === '2'"
                label="商务对接人："
                prop="businessUserName"
              >
                <el-input
                  v-model="formData.businessUserName"
                  :disabled="+formData.workerStatus === 4"
                  size="small"
                  maxlength="10"
                />
              </el-form-item>
              <el-form-item
                v-else
                label="商务对接人："
                prop="businessUserId"
                :required="formData.projectType === '1' ? true : false"
              >
                <div v-if="projectType === 1&&workId > 0">
                  {{ formData.businessUserName | emptyFill }}
                </div>
                <el-select
                  v-else
                  v-model="formData.businessUserId"
                  :disabled="+formData.workerStatus === 4"
                  placeholder="请选择"
                  size="small"
                  filterable
                  clearable
                >
                  <el-option
                    v-for="item in businessUserList"
                    :key="item.businessUserId"
                    :label="item.businessUserName"
                    :value="item.businessUserId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="已定档期：" prop="finishTime">
                <el-date-picker
                  v-model="formData.finishTime"
                  :disabled="+formData.workerStatus === 4"
                  type="date"
                  value-format="yyyy-MM-dd"
                  size="small"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约团队：">
                {{
                  type === 'add'
                    ? userInfo.dname
                      ? userInfo.dname
                      : '--'
                    : formData.signGroupName || '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="达人分成比例：">
                <el-input-number
                  v-model="formData.outMoneyRatio"
                  :disabled="+formData.workerStatus === 4"
                  :precision="0"
                  :min="0"
                  :max="100"
                  size="small"
                  @change="handleWatch"
                />%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="签约小组：">
                {{
                  type === 'add'
                    ? userInfo.fname || '--'
                    : formData.signTeamName || '--'
                }}
              </el-form-item>
              <el-form-item label="经纪人：">
                {{
                  type === 'add'
                    ? userInfo.realname
                      ? userInfo.realname
                      : '--'
                    : formData.signUserName || '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="内容协助：">
                <el-checkbox v-model="formData.contentAssist" :disabled="+formData.workerStatus === 4">需要</el-checkbox>
              </el-form-item>
              <template v-if="projectType === 1&&workId > 0">
                <el-form-item label="工单状态：">
                  {{
                    orderStatusMap.get(formData.workerStatus)
                      ? orderStatusMap.get(formData.workerStatus)
                      : '--'
                  }}
                </el-form-item>
                <el-form-item label="工单ID：">
                  {{ formData.workId | emptyFill }}
                </el-form-item>
              </template>
            </el-col>
          </el-row>
        </div>
        <p class="form-title m-t-20">订单信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号单价：" prop="accountUnitPrice">
                <el-input
                  v-model="formData.accountUnitPrice"
                  size="small"
                  :disabled="isLocky || +formData.workerStatus === 4"
                  @input="
                    (val) => {
                      handleWatch()
                      formData.accountUnitPrice = val.replace(/[^0-9.]/g, '')
                    }
                  "
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="绑定视频：">
                <template v-if="!activeLinkUrl">
                  <el-button
                    v-if="!formData.video.titleName"
                    class="chooseVideoButton"
                    :disabled="+formData.workerStatus === 4"
                    type="primary"
                    @click="handleShowVideoDialog"
                  >选择视频</el-button>
                  <div v-else class="flex video">
                    <div v-if="formData.video.isDeleted" class="flex del-txt">
                      <span>(已删除)</span>
                      <div class="video-title text-over-hidden-1">{{ formData.video.titleName }}</div>
                    </div>
                    <el-link
                      v-else
                      type="primary"
                      class="text-over-hidden-1"
                      :href="formData.video.url"
                      :underline="false"
                      target="_blank"
                    >{{ formData.video.titleName }}</el-link>
                    <el-link
                      type="danger"
                      :underline="false"
                      @click="handleDelect"
                    >删除</el-link>
                  </div>
                </template>
                <div v-if="+formData.platId === 2 && (+formData.projectType === 3 || +formData.projectType === 4) && !formData.video.titleName" class="activeLink">
                  <template v-if="activeLinkUrl">
                    <el-link
                      type="primary"
                      :href="activeLinkUrl"
                      :underline="false"
                      target="_blank"
                    >
                      {{ activeLinkUrl }}
                    </el-link>
                    <el-button type="text" class="deleteLinkUrlButton" @click="handleDeleteActiveLinkUrl">删除</el-button>
                  </template>
                  <template v-else>
                    <el-button type="text" @click="handleShowActiveLink">输入动态链接</el-button>
                    <div v-show="showActiveLink" class="flex">
                      <el-input v-model="activeLinkInput" class="activeLinkInput" size="small" />
                      <el-button type="text" @click="handleSaveActiveLink">保存</el-button>
                      <el-button type="text" class="cancelButton" @click="handleCancel">取消</el-button>
                    </div>
                    <div v-show="showActiveLink && showActiveLinkError" style="color: #ff0000; font-size: 12px">请核实链接是否属于当前达人</div>
                  </template>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户返点比例：">
                <el-input-number
                  v-model="formData.refundRatio"
                  :precision="0"
                  :min="0"
                  :max="100"
                  :disabled="isLocky || +formData.workerStatus === 4"
                  size="small"
                  @change="handleWatch"
                />%
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="视频发布时间：">
                {{ formData.video.addTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="客户返点金额：">
                <el-input-number
                  v-model="formData.refundMoney"
                  :precision="2"
                  :min="0"
                  :disabled="isLocky || +formData.workerStatus === 4"
                  size="small"
                  @change="handleWatch"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="播放量：" prop="flowCount">
                <el-input-number
                  v-model="formData.flowCount"
                  :disabled="+formData.workerStatus === 4"
                  :min="0"
                  size="small"
                  @change="handleWatch"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="（订单价格）流水：">
                {{ orderMoney || orderMoney === 0 ? orderMoney : '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="CPM：" prop="cpm">
                <el-input-number
                  v-model="formData.cpm"
                  :precision="0"
                  :disabled="CPMDisabled || +formData.workerStatus === 4"
                  :min="0"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="达人实际营收：">
                <el-input-number
                  v-model="formData.outMoney"
                  :precision="2"
                  :min="0"
                  :disabled="isLocky || +formData.workerStatus === 4"
                  size="small"
                  @change="handleWatch"
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <template v-if="formData.projectType">
                <el-form-item
                  v-if="
                    formData.projectType !== '3' && formData.joinMcnFlag == 0
                  "
                  label="是否返款"
                >
                  <el-select
                    v-model="formData.refundFlag"
                    :disabled="+formData.workerStatus === 4"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in whetherToAccountList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  v-if="
                    formData.projectType === '3' && formData.joinMcnFlag === 1
                  "
                  label="是否到账"
                >
                  <el-select
                    v-model="formData.transferFlag"
                    :disabled="+formData.workerStatus === 4"
                    placeholder="请选择"
                    size="small"
                  >
                    <el-option
                      v-for="item in whetherToAccountList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </template>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="其他费用：">
                <div class="flex">
                  <el-input-number
                    v-model="formData.otherMoney"
                    :precision="2"
                    :min="0"
                    :max="1000000000"
                    :disabled="isLocky || +formData.workerStatus === 4"
                    size="small"
                    @change="handleWatch"
                  />
                  <IconTip
                    content="豆荚等维护费用、或者是差旅等业务费用"
                    label=""
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
              <el-form-item label="中台实际营收：">
                <div class="flex">
                  <el-input-number
                    v-model="formData.centerMoney"
                    :precision="2"
                    :disabled="isLocky || +formData.workerStatus === 4"
                    :max="1000000000"
                    size="small"
                    @change="handleWatch"
                  />
                </div>
              </el-form-item>
              <el-form-item v-if="projectType === 1&&workId > 0" label="平台任务ID：">
                <el-input
                  v-model="formData.platTaskId"
                  :disabled="+formData.workerStatus === 4"
                  placeholder="请输入"
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="款项截图："
                prop="collectionScreenshots"
                :rules="
                  (+formData.paymentType === 2 && +formData.chasingResult === 1)
                    ? [{ required: true, trigger: 'change', message: '请上传款项截图' } ]:
                      [{ required: false }]"
              >
                <UploadImg
                  v-model="formData.collectionScreenshots"
                  :limit="3"
                  size="small"
                  :disabled="canEdit || +formData.workerStatus === 4"
                />
                <div
                  v-if="!formData.collectionScreenshots.length"
                  class="el-upload__tip"
                >
                  只能上传jpg/png文件
                </div>
              </el-form-item>
              <el-form-item v-if="projectType === 1&&workId > 0" label="锁定金额：">
                <div class="flex flex-align-center">
                  <el-switch
                    v-model="formData.lockMoney"
                    :disabled="+formData.workerStatus === 4"
                    :active-value="1"
                    :inactive-value="0"
                    class="m-r-5"
                    @change="handleSwitch"
                  />
                  <IconTip
                    type="popover"
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    content="订单信息填写完毕并核对无误后，可通过锁定金额的方式防止商务后期未经沟通擅改金额"
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="projectType === 1&&workId > 0">
            <el-col :span="12">
              <el-form-item>
                <template v-slot:label>
                  <span>撤单</span>
                  <IconTip
                    type="popover"
                    content="订单状态为已核账时，订单不支持再勾选为撤单，若需撤单，需先联系财务取消已核账的选项"
                    icon-class="iconwenhao"
                  />
                </template>
                <el-checkbox
                  v-model="formData.cancelOrderStatus"
                  :disabled="+formData.workerStatus === 3"
                  :true-label="1"
                  :false-label="null"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="formData.cancelOrderStatus" :span="12">
              <el-form-item label="撤单原因：" prop="cancelOrderReason">
                <el-input
                  v-model="formData.cancelOrderReason"
                  :disabled="+formData.workerStatus === 3"
                  placeholder="请输入撤单原因"
                  type="textarea"
                  maxlength="100"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="应收或应付：" prop="paymentType">
                <el-select v-model="formData.paymentType">
                  <el-option
                    v-for="item in paymentTypeArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
                <IconTip
                  content="根据达人实际情况，如果达人已经加入乾派MCN，则需要打款，若达人未加入乾派MCN，则需要追款"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>

              <el-form-item v-if="+formData.paymentType === 2" label="收款情况：" prop="chasingResult">
                <el-select v-model="formData.chasingResult">
                  <el-option
                    v-for="item in chasingArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>

              <el-form-item v-if="+formData.paymentType === 1" label="付款情况：" prop="remitResult">
                <el-select v-model="formData.remitResult">
                  <el-option
                    v-for="item in remitArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>

              <el-form-item v-if="+formData.paymentType === 2 && +formData.chasingResult === 1" label="绩效月：" prop="monthMoney">
                <el-date-picker
                  v-model="formData.monthMoney"
                  type="month"
                  placeholder="请选择月份"
                  value-format="yyyy-MM"
                />
              </el-form-item>

              <el-form-item v-if="+formData.paymentType === 1 && +formData.remitResult === 1" label="OA流程编号：" prop="oaContractNumber">
                <el-input v-model="formData.oaContractNumber" maxlength="25" @input="handleInputOaContractNumber" />
              </el-form-item>
            </el-col>
          </el-row>

        </div>
        <template v-if="projectType === 1&&workId > 0">
          <p class="form-title m-t-20">财务信息</p>
          <div class="form-border">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售收入：">
                  {{ financeInfoBO.workMoney | emptyFill }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="销售成本：">{{
                  financeInfoBO.costMoney | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="执行金额："
                >{{ financeInfoBO.executeMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="达人分成成本：">{{
                  financeInfoBO.allOutMoney | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="绩效营收：">{{
                  financeInfoBO.performanceMoney | emptyFill
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="已付客户返点：">{{
                  financeInfoBO.customerRebatePaid | emptyFill
                }}</el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="是否已开发票："
                >{{
                  [0, 1].includes(financeInfoBO.receiptStatus)
                    ? financeInfoBO.receiptStatus
                      ? '是'
                      : '否'
                    : '--'
                }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="财务是否核账：">{{
                  [0, 1].includes(financeInfoBO.reconciliationStatus)
                    ? financeInfoBO.reconciliationStatus
                      ? '是'
                      : '否'
                    : '--'
                }}</el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>
        <p class="m-t-16 form-title">备注</p>
        <el-input
          v-model="formData.remark"
          :disabled="+formData.workerStatus === 4"
          maxlength="100"
          class="note-input"
          type="textarea"
          placeholder="请输入备注"
          show-word-limit
        />
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="!canEdit" @click="close">取 消</el-button>
      <el-button
        v-if="!canEdit"
        :loading="loading"
        type="primary"
        @click="dialogConfirm"
      >确 定</el-button>
    </div>
    <VideoDialog
      v-if="showVideoDialog"
      v-model="showVideoDialog"
      :plat-id="formData.platId"
      :account-id="formData.accountId"
      :selected-video="formData.video"
      @success="handleChangeVideo"
    />
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  computed,
  watch
} from '@vue/composition-api'
import day from 'dayjs'
import { UploadImg, IconTip } from 'components'
import { copy } from '@/utils'
import {
  $getProjectDetial,
  $addProjectDetail,
  $editProjectDetail,
  $getAddPageCondition,
  $getMedAccounts
} from '@/api/sign-contract'
import { $getDataByDictType } from '@/api/index.js'
import { useStore } from '@/views/putting-manager/hook'
import { useMapData } from './hooks'
import { PYTHON_HOST as HOST } from '@/const'
import request from '@/http'

export default defineComponent({
  props: {
    orderId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    showAddDialog: {
      type: Boolean,
      default: false
    },
    projectType: {
      type: Number,
      default: 0
    },
    workId: {
      type: String,
      default: ''
    },
    workerStatus: {
      type: Object | Number,
      default: null || 0
    }
  },
  components: {
    VideoDialog: defineAsyncComponent(() => import('./videoListDialog.vue')),
    UploadImg,
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $nextTick, $refs } = getCurrentInstance().proxy
    const { projectTypeMap, orderStatusMap } = useMapData()
    const store = useStore()
    const userInfo = computed(() => store.userInfo.value)
    const oldOrderMoney = ref(0)
    const formData = ref({
      video: {},
      accountId: '',
      otherMoney: 0,
      refundRatio: 0,
      refundMoney: '',
      outMoney: '',
      centerMoney: '',
      collectionScreenshots: [],
      businessGroupName: '',
      businessUserName: '',
      businessGroupId: '',
      businessUserId: '',
      contentAssist: false,
      lockMoney: 0,
      signGroupName: '',
      signTeamName: '',
      signUserName: '',
      cancelOrderStatus: '',
      cancelOrderReason: '',
      paymentType: '',
      chasingResult: '',
      remitResult: '',
      monthMoney: '',
      oaContractNumber: ''
    })
    const states = reactive({
      loading: false,
      typeTitle: '新增',
      showVideoDialog: false,
      plats: [],
      businessInfoList: [],
      businessUserList: [],
      businessUserdata: [],
      accountPlatList: [],
      orderAccountList: [],
      dictValueList: [],
      whetherToAccountList: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      signGroupName: '',
      signTeamName: '',
      signUserName: '',
      canEdit: false,
      financeInfoBO: {},
      isLocky: false,
      handleLockyMoney: false,
      CPMDisabled: true,
      showActiveLink: false,
      activeLinkInput: '',
      activeLinkUrl: '',
      showActiveLinkError: false,
      paymentTypeArr: [{ val: 2, label: '应向达人收款' }, { val: 1, label: '应向达人付款' }],
      chasingArr: [{ val: 1, label: '收款已到账' }, { val: 2, label: '收款未到账' }],
      remitArr: [{ val: 1, label: '已向达人付款' }, { val: 2, label: '未向达人付款​' }]
    })
    states.typeTitle = computed(() => {
      switch (props.type) {
        case 'view':
          return '查看'
        case 'edit':
          return '编辑'
        case 'add':
          return '新增'
      }
    })
    states.canEdit = computed(() => {
      if (props.type === 'view') return true
    })
    states.isLocky = computed(() => {
      if (formData.value.lockMoney === 1) return true
    })
    const addForm = ref('')
    const valiBussinesProp = (rule, value, callback) => {
      if (formData.value.projectType === '1') {
        if (value) {
          return callback()
        } else {
          callback(new Error(rule.message))
        }
      }
      return callback()
    }
    const valiBussinesName = (rule, value, callback) => {
      if (formData.value.projectType === '2') {
        if (value) {
          return callback()
        } else {
          callback(new Error(rule.message))
        }
      }
      return callback()
    }
    const addFormRules = reactive({
      projectName: [
        {
          required: true,
          message: '请输入项目名称',
          trigger: 'blur'
        }
      ],
      platId: [
        {
          required: true,
          message: '请选择平台账号',
          trigger: 'change'
        }
      ],
      projectType: [
        {
          required: true,
          message: '请选择订单类型',
          trigger: 'change'
        }
      ],
      accountId: [
        {
          required: true,
          message: '请选择下单账号名称',
          trigger: 'change'
        }
      ],
      businessGroupId: [
        {
          validator: valiBussinesProp,
          message: '请选择商务小组',
          trigger: 'change'
        }
      ],
      businessGroupName: [
        {
          required: true,
          validator: valiBussinesName,
          message: '请输入商务小组',
          trigger: 'change'
        }
      ],
      businessUserName: [
        {
          required: true,
          validator: valiBussinesName,
          message: '请输入商务对接人',
          trigger: 'change'
        }
      ],
      businessUserId: [
        {
          validator: valiBussinesProp,
          message: '请选择商务对接人',
          trigger: 'change'
        }
      ],
      schedulTime: [{ required: true, message: '选择时间', trigger: 'change' }],
      accountUnitPrice: [
        {
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            const reg =
              /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
            if (!value || (value && !toString(value).trim())) {
              callback(new Error('请输入账号单价'))
              return
            }
            if (!reg.test(value)) {
              callback(new Error('仅支持输入小数点后两位的非0正数'))
              return
            }
            if (value > 1000000000) {
              callback(new Error('仅支持输入含10亿以内的数字'))
              return
            }
            callback()
          }
        }
      ],
      cancelOrderReason: [
        { required: true, message: '请输入撤单原因', trigger: 'change' },
        { required: true, message: '请输入撤单原因', trigger: 'blur' }
      ],
      flowCount: [
        {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value === undefined) {
              callback()
              return
            }
            if (value !== 0 && value > 0) {
              callback()
            } else {
              callback(new Error('播放量不能为0'))
              return
            }
            callback()
          }
        }
      ],
      finishTime: [
        {
          required: true,
          message: '请选择已定排期',
          trigger: 'change'
        }
      ],
      collectionScreenshots: [{
        required: true,
        trigger: ['blur', 'change'] }],
      paymentType: [{ required: true, message: '请选择应收或应付', trigger: ['blur', 'change'] }],
      chasingResult: [{
        required: true,
        message: '请选择收款情况',
        trigger: ['blur', 'change'] }],
      remitResult: [{
        required: true,
        message: '请选择付款情况',
        trigger: ['blur', 'change'] }],
      monthMoney: [{
        required: true,
        message: '请选择绩效月',
        trigger: ['blur', 'change']
      }],
      oaContractNumber: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!value.replace(/(^\s*)|(\s*$)/g, '')) {
            callback(new Error('请输入OA流程编号'))
          } else {
            callback()
          }
        },
        message: '请输入OA流程编号',
        trigger: ['blur', 'change']
      }]
    })

    const handleProjectType = (val) => {
      if (val !== '2') {
        $refs.addForm && $refs.addForm.clearValidate('businessGroupName')
        $refs.addForm && $refs.addForm.clearValidate('businessUserName')
      } else {
        $refs.addForm && $refs.addForm.clearValidate('businessGroupId')
        $refs.addForm && $refs.addForm.clearValidate('businessUserId')
      }
      formData.value.businessGroupId = ''
      formData.value.businessUserId = ''
      formData.value.businessGroupName = ''
      formData.value.businessUserName = ''
    }
    const watchFlag = ref(false)
    const orderMoney = computed(() => {
      if (!watchFlag.value) return oldOrderMoney.value
      return (
        Number(formData.value.accountUnitPrice) -
        Number(formData.value.refundMoney)
      )
    })
    // cpm=订单流水/播放量*1000
    watch(orderMoney, (val) => {
      if (!watchFlag.value) return
      if (formData.value.flowCount && val) {
        formData.value.cpm = val / formData.value.flowCount * 1000
      } else {
        formData.value.cpm = undefined
      }
    })
    watch(() => formData.value.flowCount, (val) => {
      if (!watchFlag.value) return
      if (val && orderMoney.value) {
        formData.value.cpm = orderMoney.value / val * 1000
      } else {
        formData.value.cpm = undefined
      }
    })
    // 客户返点金额=账号单价*客户返点比例
    watch(
      () => formData.value.accountUnitPrice,
      (val, oldVal) => {
        if (!watchFlag.value) return
        const refundRatio = formData.value.refundRatio ? formData.value.refundRatio : 0
        formData.value.refundMoney =
          (val || 0) * refundRatio * 0.01
      }
    )
    // 客户返点金额=账号单价*客户返点比例
    watch(
      () => formData.value.refundRatio,
      (val, oldVal) => {
        if (!watchFlag.value) return
        formData.value.refundMoney =
          formData.value.accountUnitPrice * (val ? val * 0.01 : 0)
      }
    )
    // 中台实际营收 = 订单流水 -达人实际营收 - 其他费用
    watch(
      () => formData.value.outMoney,
      (val, oldVal) => {
        if (!watchFlag.value) return
        const otherMoney = formData.value.otherMoney ? formData.value.otherMoney : 0
        formData.value.centerMoney =
          orderMoney.value - (val || 0) - otherMoney
      }
    )
    // 达人实际营收 = 订单流水*达人分成比例
    watch(
      () => formData.value.outMoneyRatio,
      (val) => {
        console.log(typeof val)
        if (!watchFlag.value) return
        formData.value.outMoney =
          orderMoney.value * (val ? val * 0.01 : 0)
      }
    )
    watch(
      () => formData.value.otherMoney,
      (val) => {
        if (!watchFlag.value) return
        const outMoney = formData.value.outMoney ? formData.value.outMoney : 0
        formData.value.centerMoney =
          orderMoney.value - outMoney - (val || 0)
      }
    )
    watch(
      () => orderMoney.value,
      (val, oldVal) => {
        if (!watchFlag.value) return
        formData.value.outMoney =
         (val || 0) *
          (formData.value.outMoneyRatio
            ? formData.value.outMoneyRatio * 0.01
            : 0)
        const outMoney = formData.value.outMoney ? formData.value.outMoney : 0
        const otherMoney = formData.value.otherMoney ? formData.value.otherMoney : 0
        formData.value.centerMoney =
          (val || 0) - outMoney - otherMoney
      }
    )

    watch(() => formData.value.paymentType, (val) => {
      formData.value.chasingResult = ''
      formData.value.remitResult = ''
      $refs.addForm && $refs.addForm.clearValidate('chasingResult')
      $refs.addForm && $refs.addForm.clearValidate('remitResult')

      formData.value.monthMoney = ''
      formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.chasingResult, (val) => {
      if (!(+formData.paymentType === 2 && +formData.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('collectionScreenshots')
      }

      formData.value.monthMoney = ''
      formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.remitResult, (val) => {
      if (!(+formData.paymentType === 2 && +formData.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('collectionScreenshots')
      }

      formData.value.monthMoney = ''
      formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.collectionScreenshots, (val) => {
      $refs.addForm && $refs.addForm.validateField('collectionScreenshots')
    })


    const handleWatch = (val) => {
      watchFlag.value = true
    }
    const getMedAccounts = (platId) => {
      $getMedAccounts({ platId, methodId: 2 }).then((res) => {
        if (res.code === 1) {
          states.orderAccountList = res.data
        }
      })
    }
    const handleBusinessGroup = (val) => {
      states.businessUserList = states.businessUserdata.filter(
        (item) => item.orgId === val
      )
    }

    const getProjectTypeList = () => {
      $getDataByDictType({ dictTypes: ['sign_contract_project_type'] }).then(
        (res) => {
          if (res.code === 1) {
            states.dictValueList = res.data.sign_contract_project_type
          }
        }
      )
    }
    const getAddPageCondition = (callback) => {
      $getAddPageCondition()
        .then((res) => {
          if (res.code === 1) {
            res.data.businessInfoList.forEach((item) => {
              item.businessGroupId = item.id
              item.businessGroupName = item.orgName
            })
            res.data.businessUserList.forEach((item) => {
              item.businessUserId = item.id
              item.businessUserName = item.name
            })
            states.plats = res.data.plats
            states.businessInfoList = res.data.businessInfoList
            states.businessUserList = res.data.businessUserList
            states.businessUserdata = res.data.businessUserList
            $nextTick(() => {
              callback()
            })
          } else {
            callback()
          }
        })
        .catch(() => {
          callback()
        })
    }
    const handleShowVideoDialog = () => {
      states.showVideoDialog = true
    }
    const handleChangeVideo = (selectVideo) => {
      formData.value.video = selectVideo.value
      console.log(formData.value.video)
    }
    const handleDelect = () => {
      formData.value.video = {}
    }
    const handlePlat = (val) => {
      formData.value.accountId = ''
      formData.value.outMoneyRatio = ''
      if (val) {
        getMedAccounts(val)
      }
    }
    const handleSwitch = () => {
      states.handleLockyMoney = true
    }
    const handleOrderAccount = (val) => {
      states.activeLinkInput = ''
      states.activeLinkUrl = ''
      states.showActiveLinkError = false
      if (val) {
        const item = states.orderAccountList.find(
          (item) => item.accountId === val
        ) || {}
        formData.value.outMoneyRatio = item.outMoneyRatio
        formData.value.joinMcnFlag = item.joinMcnFlag
      } else {
        formData.value.outMoneyRatio = ''
        formData.value.joinMcnFlag = ''
      }
    }
    // 格式化数据 后端要求id和name都需要传递
    const formatData = () => {
      const params = copy(formData.value)
      if (props.type === 'add') {
        params.signUserId = userInfo.value.id || ''
        params.signUserName = userInfo.value.realname || ''
        params.signGroupId = userInfo.value.did || ''
        params.signGroupName = userInfo.value.dname || ''
        params.signTeamId = userInfo.value.fid || ''
        params.signTeamName = userInfo.value.fname || ''
      }

      params.orderMoney = orderMoney.value ? orderMoney.value : ''
      if (params.businessUserId) {
        params.businessUserName = (states.businessUserList.find(
          (item) => Number(item.businessUserId) === Number(params.businessUserId)
        ) || {}).businessUserName
      } else {
        if (params.projectType !== '2') {
          delete params.businessUserId
          delete params.businessUserName
        }
      }
      if (params.businessGroupId) {
        params.businessGroupName = (states.businessInfoList.find(
          (item) => Number(item.businessGroupId) === Number(params.businessGroupId)
        ) || {}).businessGroupName
      } else {
        if (params.projectType !== '2') {
          delete params.businessGroupId
          delete params.businessGroupName
        }
      }
      if (params.platId) {
        params.platName = (states.plats.find(
          (item) => Number(item.platId) === Number(params.platId)
        ) || {}).platName
      }
      if (params.accountId) {
        params.accountName = (states.orderAccountList.find(
          (item) => Number(item.accountId) === Number(params.accountId)
        ) || {}).accountName || params.accountName
      }
      params.dynamicLink = states.activeLinkUrl
      params.flowId = params.video.flowId || ''
      params.addTime = params.video.addTime || ''
      delete params.video
      params.collectionScreenshots = JSON.stringify(
        params.collectionScreenshots
      )
      return params
    }

    if (['edit', 'view'].includes(props.type)) {
      states.loading = true
    }
    const getProjectDetial = async() => {
      if (['edit', 'view'].includes(props.type)) {
        try {
          const res = await $getProjectDetial({ orderId: props.orderId })
          if (res && res.code === 1) {
            const {
              projectType,
              title,
              url,
              flowId,
              addTime,
              orderMoney,
              collectionScreenshots,
              financeInfoBO,
              isDeleted,
              contentAssist,
              cpm,
              flowCount,
              dynamicLink,
              paymentType,
              paymentResult,
              monthMoney,
              oaContractNumber
            } = res.data || {}
            const data = res.data || {}

            // 存在0的情况
            if (!+paymentType) {
              delete data.paymentType
            }

            // 存在0的情况
            if (!+paymentResult) {
              delete data.paymentResult
            }

            formData.value = Object.assign({}, data, {
              projectType: String(projectType),
              contentAssist: !!contentAssist,
              cpm: cpm || undefined,
              flowCount: flowCount || undefined,
              video: {
                titleName: title,
                url,
                addTime: addTime
                  ? day(addTime).format('YYYY-MM-DD HH:mm:ss')
                  : '',
                flowId,
                isDeleted: isDeleted || false
              },
              paymentType: +paymentType ? +paymentType : '',
              collectionScreenshots: JSON.parse(collectionScreenshots || '[]')
            })
            states.activeLinkUrl = dynamicLink || ''
            states.financeInfoBO = financeInfoBO || {}
            getMedAccounts(res.data.platId)
            oldOrderMoney.value = orderMoney

            $nextTick(() => {
              if (+paymentType === 2) {
                formData.value = {
                  ...formData.value,
                  chasingResult: +paymentResult ? +paymentResult : '',
                  remitResult: ''
                }
              } else if (+paymentType === 1) {
                formData.value = {
                  ...formData.value,
                  chasingResult: '',
                  remitResult: +paymentResult ? +paymentResult : ''
                }
              } else {
                formData.value = {
                  ...formData.value,
                  chasingResult: '',
                  remitResult: ''
                }
              }

              $nextTick(() => {
                formData.value.monthMoney = monthMoney
                formData.value.oaContractNumber = oaContractNumber

                formData.value.collectionScreenshots = JSON.parse(collectionScreenshots || '[]')
              })
            })

            $nextTick(() => {
              states.loading = false
            })
          }
        } catch (err) {
          $message.error('系统错误')
        }
      }
    }
    const dialogConfirm = async() => {
      await addForm.value.validate()
      await $refs.addForm.validateField('chasingResult')
      await $refs.addForm.validateField('remitResult')

      if (states.showActiveLinkError) return

      const params = formatData()
      if (!(+params.cancelOrderStatus)) {
        params.cancelOrderReason = ''
        params.cancelOrderStatus = 0
      }

      states.loading = true

      params.paymentResult = params.chasingResult || params.remitResult

      try {
        let res
        switch (props.type) {
          case 'add':
            res = await $addProjectDetail(params)
            break
          case 'edit':
            params.orderId = props.orderId
            params.contentAssist = params.contentAssist ? 1 : 0
            console.log(params)
            if (
              props.projectType === 1 &&
              params.url &&
              !states.handleLockyMoney && props.workId > 0
            ) {
              params.lockMoney = 1
            }
            res = await $editProjectDetail(params)
            break
        }
        states.loading = false

        params.paymentResult = params.chasingResult || params.remitResult

        if (res.code === 1) {
          emit('getList')
          emit('getStatisticsList')
          close()
          $message.success(res.message)
        } else {
          $message.error(res.message || '系统错误')
        }
      } catch (err) {
        states.loading = false
        $message.error('系统错误')
      }
    }

    const handleShowActiveLink = () => {
      if (states.showActiveLink) return

      if (!formData.value.accountId) {
        $message.warning('请先选择下单账号')
        return
      }

      states.showActiveLink = true
    }
    const handleCancel = () => {
      states.showActiveLink = false
      states.activeLinkInput = ''
      states.showActiveLinkError = false
    }

    const handleSaveActiveLink = async() => {
      if (!states.activeLinkInput.replace(/^\s*|\s*$/g, '')) {
        $message.error('动态链接不能为空')
        return
      }

      try {
        states.loading = true
        const { code, data, msg } = await request.get(`${HOST}/plat/bilibili/article?index_url=${states.activeLinkInput}`)
        states.loading = false
        if (+code === 1) {
          const item = states.orderAccountList.find(item => +item.accountId === +formData.value.accountId)
          if (String(item.getDataUrl) === String(data.get_data_url)) {
            // 相同
            states.activeLinkUrl = states.activeLinkInput
            states.showActiveLinkError = false
          } else {
            states.showActiveLinkError = true
          }
        } else {
          $message.error(msg)
          states.showActiveLinkError = false
        }
      } catch (e) {
        states.loading = false
        $message.error(e || '网络错误')
        states.showActiveLinkError = false
      }
    }

    const handleDeleteActiveLinkUrl = () => {
      states.activeLinkInput = ''
      states.activeLinkUrl = ''
      states.showActiveLinkError = false
    }

    const handleInputOaContractNumber = (val) => {
      formData.value.oaContractNumber = val.replace(/[^a-zA-Z0-9]/g, '').substr(0, 25)
    }

    const close = () => {
      emit('close')
    }
    getAddPageCondition(getProjectDetial)
    getProjectTypeList()
    return {
      close,
      ...toRefs(states),
      addFormRules,
      formData,
      addForm,
      dialogConfirm,
      handleShowVideoDialog,
      handleChangeVideo,
      handleOrderAccount,
      handleBusinessGroup,
      handleDelect,
      handleInputOaContractNumber,
      handlePlat,
      userInfo,
      orderMoney,
      handleProjectType,
      handleWatch,
      projectTypeMap,
      orderStatusMap,
      handleSwitch,
      handleShowActiveLink,
      handleCancel,
      handleSaveActiveLink,
      handleDeleteActiveLinkUrl
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  &-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
  &-border {
    padding: 16px 32px;
    background: #eee;
  }
}
.video-title{
  width: 200px;
}
::v-deep {
  .video {
    .el-link--primary {
      width: 200px;
      font-size: 12px;
    }
    .el-link--danger {
      font-size: 12px;
      margin-left: 20px;
    }
    .del-txt {
      font-size: 12px;
      color: #aaa5a5;
    }
  }

  .upload--img__small {
    align-items: flex-start;
  }
}

.activeLink {
  display: inline-block;
  margin-left: 6px;
}

.chooseVideoButton {
  vertical-align: top;
}

.cancelButton {
  color: #000;
}

.activeLinkInput {
  width: 140px;
}

.deleteLinkUrlButton {
  color: #ff0000;
  margin-left: 6px;
}
</style>
