<template>
  <el-dialog
    :title="typeTitle"
    :visible="showAddDialog"
    width="1320px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <div v-if="type === 'view'" class="add-form">
      <el-form v-loading="loading" class="form-view">
        <p class="form-title">商业信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称：">
                {{ formData.projectName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型：">
                {{ projectTypeMap.get(formData.projectType) }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号平台：">
                {{ formData.platName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="下单账号：">
                {{ formData.accountName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <el-form-item label="已定档期：">
                {{ formData.finishTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达人分成比例：">
                {{
                  formData.outMoneyRatio ? `${formData.outMoneyRatio}%` : '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内容协助：">
                {{ formData.contentAssist ? '需要' : '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商务小组：">
                {{ formData.businessGroupName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商务对接人：">
                {{ formData.businessUserName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签约团队：">
                {{ formData.signGroupName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="签约小组：">
                {{ formData.signTeamName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="8">
              <el-form-item label="经纪人：">
                {{ formData.signUserName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态：">
                {{
                  orderStatusMap.get(formData.workerStatus)
                    ? orderStatusMap.get(formData.workerStatus)
                    : '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单ID：">
                {{ formData.workId | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <template>
          <p class="form-title m-t-20">订单信息（由商务填写）</p>
          <div class="form-border">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售收入：">
                  {{ formData.businessMoneyInfoBO.flowMoney | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="对公返点：">
                  {{ formData.businessMoneyInfoBO.discount | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="对公返点：必须走合同和发票返点给客户的金额，即为对公返点金额。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="对私返点：">
                  {{ formData.businessMoneyInfoBO.discountPrivate | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="对私返点：必须通过高灯打款支付给客户个人账户的金额，无需走合同和发票，即为对私金额，填写无需加高灯服务费。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="折扣金额：">
                  {{ formData.businessMoneyInfoBO.rebateMoney | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="折扣金额：客户自行下单，为通过线上改价方式返还给客户的金额；代客下单，为提前从合作金额扣除的返点金额，即不需以打款方式向客户支付的返点。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="抖荚成本：">
                  {{ formData.businessMoneyInfoBO.douMoney | emptyFill }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平台手续费：">
                  {{ formData.businessMoneyInfoBO.platMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="其他成本：">
                  {{ formData.businessMoneyInfoBO.otherMoney | emptyFill }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="线下补款：">
                  {{ formData.businessMoneyInfoBO.offlineAddMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>

        <p class="form-title m-t-20">
          订单信息（由签约经纪人填写）
        </p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="平台下单价：" prop="platOrderMoney">
                {{ formData.platOrderMoney | emptyFill }}
                <IconTip
                  content="平台下单价=实际在平台中下单给达人的价格"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="达人分担客户返点&折扣比例：">
                {{ formData.darenUndertakeRefundRatio ? `${formData.darenUndertakeRefundRatio || 0}%` : '--' }}
                <IconTip
                  content="达人分担客户返点&折扣比例=达人分担客户返点&折扣金额/销售收入"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户返点&折扣比例：">
                {{ formData.refundRatio ? `${formData.refundRatio}%` : '--' }}
                <IconTip
                  content="客户返点&折扣比例=客户返点&折扣金额/销售收入"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单流水：">
                {{ orderMoney || orderMoney === 0 ? orderMoney : '--' }}
                <IconTip
                  content="订单流水=销售收入-对公返点-对私返点-折扣金额"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="达人分担客户返点&折扣金额：">
                {{ formData.darenUndertakeRefundMoney | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户返点&折扣金额：">
                {{ formData.refundMoney || '--' }}
                <IconTip
                  content="客户返点&折扣金额=工单的对私返点金额+对公返点金额+折扣金额，如金额有误，请联系商务沟通拉齐"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达人分成">
                {{ formData.outMoney | emptyFill }}
                <IconTip
                  content="达人分成=（销售收入-达人分担客户返点&折扣金额）*达人分成比例"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="绩效营收：">
                <div class="flex">
                  {{ formData.centerMoney | emptyFill }}
                  <IconTip
                    content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
                    label=""
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <el-form-item label="应收或应付：">
                {{ +formData.paymentType === 1 ? '应向达人付款' : +formData.paymentType === 2 ? '应向达人收款' : '--' }}
              </el-form-item>
            </el-col>
            <el-col v-if="+formData.paymentType === 1 || +formData.paymentType === 2" :span="8">
              <el-form-item :label="`${+formData.paymentType === 1 ? '付款' : '收款'}情况：`">
                <template v-if="+formData.paymentType === 1">
                  {{ +formData.paymentResult === 1 ? '已向达人付款' : +formData.paymentResult === 2 ? '未向达人付款​' : '--' }}
                </template>
                <template v-if="+formData.paymentType === 2">
                  {{ +formData.paymentResult === 1 ? '收款已到账' : +formData.paymentResult === 2 ? '收款未到账' : '--' }}
                </template>
              </el-form-item>
            </el-col>
            <template v-if="+formData.paymentType && +formData.paymentResult === 1">
              <el-col :span="8">
                <el-form-item :label="`${+formData.paymentType === 1 ? 'OA流程编号' : '绩效月'}：`">
                  <template v-if="+formData.paymentType === 1">
                    {{ formData.oaContractNumber || '--' }}
                  </template>
                  <template v-if="+formData.paymentType === 2">
                    {{ formData.monthMoney || '--' }}
                  </template>
                </el-form-item>
              </el-col>
            </template>

            <template v-if="+formData.paymentType">
              <el-col :span="8">
                <el-form-item :label="`${+formData.paymentType === 1 ? '应付金额' : '应收金额'}：`">
                  {{ formData.collectionMoney || '--' }}
                </el-form-item>
              </el-col>

              <el-col v-if="+formData.paymentType === 2 && +formData.paymentResult === 1" :span="8">
                <el-form-item label="支付渠道：">
                  {{ +formData.tradeType ? tradetitle(formData.tradeType): '--' }}
                </el-form-item>
              </el-col>
            </template>
            <template v-if="+formData.paymentType === 2 && +formData.paymentResult === 1 && (+formData.tradeType === 1 || +formData.tradeType === 2)">
              <el-col :span="8">
                <el-form-item label="交易流水号：">
                  {{ formData.outTradeNo || '--' }}
                </el-form-item>
              </el-col>
            </template>
            <el-col :span="8">
              <el-form-item label="款项截图：">
                <UploadImg
                  v-model="formData.collectionScreenshots"
                  :limit="3"
                  :disabled="canEdit"
                  size="small"
                />
                <div v-if="!formData.collectionScreenshots.length">--</div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="+formData.paymentType === 1 && (+formData.platId === 25 || +formData.platId === 2)" :span="8">
              <el-form-item label="平台任务ID：">
                {{ formData.platTaskId | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
            <el-col :span="8">
              <el-form-item label="视频发布时间：">
                {{ formData.video.addTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="播放量：" prop="flowCount">
                {{ formData.flowCount ? formData.flowCount : '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="CPM：" prop="cpm">
                {{ formData.cpm | emptyFill }}
              </el-form-item>
            </el-col>
            <template v-if="projectType === 1&&workId > 0">
              <el-col :span="8">
                <el-form-item label="撤单：">
                  {{ formData.cancelOrderStatus ? '是' : '否' }}
                </el-form-item>
              </el-col>
              <el-col v-if="formData.cancelOrderStatus" :span="8">
                <el-form-item label="撤单原因：">
                  {{ formData.cancelOrderReason || '--' }}
                </el-form-item>
              </el-col>
            </template>
          </el-row>

          <!-- <el-row v-if="formData.projectType">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
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
            </el-col>
          </el-row> -->
          <!-- 新的视频工单：projectType === 1&&workId > 0  -->

        </div>

        <!-- 待录入，待履约不显示 -->
        <template v-if="+formData.workerStatus > 1">
          <p class="form-title m-t-20">抵扣信息（由签约经纪人填写）</p>
          <div class="form-border">
            <el-row>
              <el-col :span="8">
                <el-form-item label="关联抵扣工单：">
                  <template v-if="formData.deductionInfoBO.parentWorkId">
                    <span class="childWorkNum m-r-10">共{{ (formData.deductionInfoBO || {}).childWorkOrderCount }}个工单</span>
                    <el-button type="primary" @click="handleShowDeduction('detail')">
                      查看
                    </el-button>
                    <IconTip
                      content="若同一达人或同一家公司有多个工单要相抵扣，可在此处添加"
                      icon-class="iconwenhao"
                    />
                  </template>
                  <template v-else>无</template>
                </el-form-item>
              </el-col>

              <template v-if="formData.deductionInfoBO.parentWorkId">
                <el-col :span="8">
                  <el-form-item :label="`${formData.deductionInfoBO.paymentType === 1 ? '抵扣后实际应付金额' : '抵扣后实际应收金额'}：`">
                    <span>{{ formData.deductionInfoBO.collectionMoney }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="+formData.deductionInfoBO.paymentType === 2" label="收款情况：" label-width="94px" prop="deductionChasingResult">
                    {{ (chasingArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="+formData.deductionInfoBO.paymentType === 1" label="付款情况：" label-width="94px" prop="deductionRemitResult">
                    {{ (remitArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                  </el-form-item>
                </el-col>

                <template v-if="+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1">
                  <el-col :span="8">
                    <el-form-item label="绩效月：" label-width="80px" prop="deductionMonthMoney">
                      {{ formData.deductionInfoBO.monthMoney || '--' }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="支付渠道：" label-width="94px" prop="deductionTradeType">
                      {{ (tradeTypeArr.find(item => +item.val === +formData.deductionInfoBO.tradeType) || {}).label || '--' }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item v-if="(+formData.deductionInfoBO.tradeType === 1 || +formData.deductionInfoBO.tradeType === 2)" label="交易流水号：" label-width="108px" prop="deductionOutTradeNo">
                      {{ formData.deductionInfoBO.outTradeNo || '--' }}
                    </el-form-item>
                  </el-col>

                </template>

                <el-col v-if="+formData.deductionInfoBO.paymentType === 1 && +formData.deductionInfoBO.paymentResult === 1" :span="8">
                  <el-form-item label="OA流程编号：" prop="deductionOaContractNumber">
                    {{ formData.deductionInfoBO.oaContractNumber || '--' }}
                  </el-form-item>
                </el-col>

                <el-col v-if="+formData.deductionInfoBO.tradeType === 3" :span="8">
                  <el-form-item
                    label="款项截图："
                    label-width="94px"
                    prop="deductionCollectionScreenshots"
                  >
                    <UploadImg
                      v-model="formData.deductionInfoBO.paymentScreenshots"
                      :limit="3"
                      size="small"
                      disabled
                    />
                    <div
                      v-if="!(formData.deductionInfoBO.paymentScreenshots || []).length"
                      class="el-upload__tip"
                    >
                      只能上传jpg/png文件
                    </div>
                  </el-form-item>
                </el-col>

              </template>
            </el-row>
          </div>
        </template>

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
                <el-form-item label="达人分成：">{{
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
      <!-- label-width="130px" -->
      <el-form
        ref="addForm"
        v-loading="loading"
        :model="formData"
        :rules="addFormRules"
        class="norm-form form"
      >
        <p class="form-title">商业信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称：" prop="">
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
            <el-col :span="8">
              <el-form-item label="订单类型：" prop="">
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
            <el-col :span="8">
              <el-form-item label="账号平台：" prop="">
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
            <el-col :span="8">
              <el-form-item label="下单账号：" prop="">
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
            <el-col :span="8">
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
            <el-col :span="8">
              <el-form-item label="已定档期：" prop="finishTime" label-width="94px">
                <el-date-picker
                  v-model="formData.finishTime"
                  :disabled="+formData.workerStatus === 4"
                  type="date"
                  value-format="yyyy-MM-dd"
                  size="small"
                  clearable
                  @focus="handleToGetCurVal"
                  @change="handleToJudgeDq"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达人分成比例：">
                <el-input-number
                  v-model="formData.outMoneyRatio"
                  :disabled="+formData.workerStatus === 4 || +formData.workerStatus === 3"
                  :precision="0"
                  :min="0"
                  :max="100"
                  size="small"
                  @change="handleChangeOutMoneyRatio"
                />%
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内容协助：">
                <el-checkbox v-model="formData.contentAssist" :disabled="+formData.workerStatus === 4">需要</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <!-- :required="formData.projectType === '1' ? true : false" -->
              <el-form-item
                v-if="formData.projectType !== '2'"
                label="商务小组："
                prop=""
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
              <el-form-item v-else label="商务小组：" prop="">
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

          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item
                v-if="formData.projectType === '2'"
                label="商务对接人："
                prop=""
              >
                <el-input
                  v-model="formData.businessUserName"
                  :disabled="+formData.workerStatus === 4"
                  size="small"
                  maxlength="10"
                />
              </el-form-item>
              <!-- :required="formData.projectType === '1' ? true : false" -->
              <el-form-item
                v-else
                label="商务对接人："
                prop=""
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

            <el-col :span="8">
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

            <el-col :span="8">
              <el-form-item label="签约小组：">
                {{
                  type === 'add'
                    ? userInfo.fname || '--'
                    : formData.signTeamName || '--'
                }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
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

            <template v-if="projectType === 1&&workId > 0">
              <el-col :span="8">
                <el-form-item label="工单状态：">
                  {{
                    orderStatusMap.get(formData.workerStatus)
                      ? orderStatusMap.get(formData.workerStatus)
                      : '--'
                  }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工单ID：">
                  {{ formData.workId | emptyFill }}
                </el-form-item>
              </el-col>
            </template>
          </el-row>
        </div>

        <template>
          <p class="form-title m-t-20">订单信息（由商务填写）</p>
          <div class="form-border">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售收入：">
                  {{ formData.businessMoneyInfoBO.flowMoney | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="对公返点：">
                  {{ formData.businessMoneyInfoBO.discount | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="对公返点：必须走合同和发票返点给客户的金额，即为对公返点金额。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="对私返点：">
                  {{ formData.businessMoneyInfoBO.discountPrivate | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="对私返点：必须通过高灯打款支付给客户个人账户的金额，无需走合同和发票，即为对私金额，填写无需加高灯服务费。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="折扣金额：">
                  {{ formData.businessMoneyInfoBO.rebateMoney | emptyFill }}
                  <IconTip
                    width="300"
                    trigger="hover"
                    content="折扣金额：客户自行下单，为通过线上改价方式返还给客户的金额；代客下单，为提前从合作金额扣除的返点金额，即不需以打款方式向客户支付的返点。"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="抖荚成本：">
                  {{ formData.businessMoneyInfoBO.douMoney | emptyFill }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="平台手续费：">
                  {{ formData.businessMoneyInfoBO.platMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="其他成本：">
                  {{ formData.businessMoneyInfoBO.otherMoney | emptyFill }}
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="线下补款：">
                  {{ formData.businessMoneyInfoBO.offlineAddMoney | emptyFill }}
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </template>

        <p class="form-title m-t-20">
          订单信息（由签约经纪人填写）
          <!-- <span class="message">
            （若金额有误，请联系商务沟通拉齐）
          </span> -->
        </p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <!-- <el-form-item label="账号单价" prop="accountUnitPrice">
                <el-input
                  v-model="formData.accountUnitPrice"
                  size="small"
                  disabled
                  @input="
                    (val) => {
                      handleWatch()
                      formData.accountUnitPrice = val.replace(/[^0-9.]/g, '')
                    }
                  "
                />
                <IconTip
                  content="账号单价=工单的平台下单价；如金额有误，请联系商务沟通拉齐"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item> -->
              <el-form-item label="平台下单价：" prop="platOrderMoney" label-width="110px">
                <span v-if="!!formData.existSelfOrderFlag">
                  {{ formData.platOrderMoney }}
                </span>
                <el-input-number
                  v-else
                  v-model="formData.platOrderMoney"
                  :disabled="!!formData.existSelfOrderFlag || +formData.workerStatus === 3"
                  :min="0"
                  :precision="2"
                  :max="100000000"
                  size="small"
                  :controls="false"
                />
                <IconTip
                  content="平台下单价=实际在平台中下单给达人的价格"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="达人分担客户返点&折扣比例：">
                <el-input-number
                  v-model="formData.darenUndertakeRefundRatio"
                  :precision="2"
                  :min="0"
                  :max="100"
                  :disabled="isLocky || +formData.workerStatus === 4 || +formData.workerStatus === 3"
                  size="small"
                  @change="(val) => handleChangeDaren(val, 'ratio')"
                />%
                <IconTip
                  class="iconTip"
                  content="达人分担客户返点&折扣比例=达人分担客户返点&折扣金额/销售收入"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户返点&折扣比例：">
                <el-input-number
                  v-model="formData.refundRatio"
                  :precision="2"
                  :min="0"
                  :max="100"
                  disabled
                  size="small"
                  @change="handleWatch"
                />%
                <IconTip
                  content="客户返点&折扣比例=客户返点&折扣金额/销售收入"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单流水：">
                {{ orderMoney || orderMoney === 0 ? orderMoney : '--' }}
                <IconTip
                  content="订单流水=销售收入-对公返点-对私返点-折扣金额"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="达人分担客户返点&折扣金额：">
                <el-input-number
                  v-model="formData.darenUndertakeRefundMoney"
                  :precision="2"
                  :min="0"
                  :disabled="isLocky || +formData.workerStatus === 4 || +formData.workerStatus === 3"
                  size="small"
                  @change="(val) => handleChangeDaren(val, 'price')"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户返点&折扣金额：">
                <el-input-number
                  v-model="formData.refundMoney"
                  :precision="2"
                  :min="0"
                  disabled
                  size="small"
                  @change="handleWatch"
                />
                <IconTip
                  content="客户返点&折扣金额=工单的对私返点金额+对公返点金额+折扣金额，如金额有误，请联系商务沟通拉齐"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="公司分担客户返点比例">
                <el-input-number
                  v-model="formData.companyUndertakeRefundRatio"
                  :precision="2"
                  :max="100"
                  disabled
                  size="small"
                />%
                <IconTip
                  content="公司分担客户返点比例=客户返点&折扣比例-达人分担客户返点&折扣比例"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <!-- <el-col :span="12">
              <el-form-item label="公司分担客户返点金额">
                <el-input-number
                  v-model="formData.companyUndertakeRefundMoney"
                  :precision="2"
                  disabled
                  size="small"
                />
                <IconTip
                  content="公司分担客户返点金额=客户返点&折扣金额-达人分担客户返点&折扣金额"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达人分成：">
                <el-input-number
                  v-model="formData.outMoney"
                  :precision="2"
                  :min="0"
                  size="small"
                  :disabled="+formData.workerStatus === 3"
                  @change="handleChangeOutMoney"
                />
                <IconTip
                  content="达人分成=（销售收入-达人分担客户返点&折扣金额）*达人分成比例"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="绩效营收：">
                <div class="flex">
                  <el-input-number
                    v-model="formData.centerMoney"
                    :precision="2"
                    disabled
                    :max="1000000000"
                    size="small"
                  />
                  <IconTip
                    content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
                    label=""
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
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

          <el-row>
            <el-col :span="8">
              <el-form-item label="应收或应付：" prop="paymentType" label-width="108px">
                <el-select v-model="formData.paymentType" :disabled="+formData.workerStatus === 3">
                  <el-option
                    v-for="item in paymentTypeArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
                <IconTip
                  content="根据达人实际情况，如果达人已经加入乾派MCN，则需要向达人付款，若达人未加入乾派MCN，则需要向达人收款"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 2" label="收款情况：" label-width="94px" prop="chasingResult">
                <el-select v-model="formData.chasingResult" :disabled="+formData.workerStatus === 3">
                  <el-option
                    v-for="item in chasingArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 1" label="付款情况：" label-width="94px" prop="remitResult">
                <el-select v-model="formData.remitResult" :disabled="+formData.workerStatus === 3">
                  <el-option
                    v-for="item in remitArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 2 && +formData.chasingResult === 1" label="绩效月：" label-width="80px" prop="monthMoney">
                <el-date-picker
                  v-model="formData.monthMoney"
                  type="month"
                  placeholder="请选择月份"
                  value-format="yyyy-MM"
                  :disabled="+formData.workerStatus === 3"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 2" label="应收金额：" prop="collectionMoneyPut">
                <el-input-number
                  v-model="formData.collectionMoneyPut"
                  :disabled="(!$permission('invoice_status_select') && +formData.workerStatus === 3) || +formData.workerStatus === 3"
                  :precision="2"
                  :min="0"
                  size="small"
                />
                <IconTip
                  content="应收金额=平台下单价-达人分成，若金额有误可联系财务沟通、修改"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 2 && +formData.chasingResult === 1" label="支付渠道：" label-width="94px" prop="tradeType">
                <el-select
                  v-model="formData.tradeType"
                  placeholder="请选择支付渠道"
                  :disabled="+formData.workerStatus === 3"
                >
                  <el-option v-for="item in tradeTypeArr" :key="item.val" :label="item.label" :value="item.val" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 2 && +formData.chasingResult === 1 && (+formData.tradeType === 1 || +formData.tradeType === 2)" label="交易流水号：" label-width="108px" prop="outTradeNo">
                <el-input v-model="formData.outTradeNo" maxlength="45" :disabled="+formData.workerStatus === 3" @input="handleInputOutTradeNo" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 1 && +formData.remitResult === 1" label="OA流程编号：" label-width="114px" prop="oaContractNumber">
                <el-input v-model="formData.oaContractNumber" maxlength="25" @input="handleInputOaContractNumber" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item v-if="+formData.paymentType === 1" label="应付金额：" prop="collectionMoneyPay">
                <el-input-number
                  v-model="formData.collectionMoneyPay"
                  :disabled="(!$permission('invoice_status_select') && +formData.workerStatus === 3) || +formData.workerStatus === 3"
                  :precision="2"
                  :min="0"
                  size="small"
                />
                <IconTip
                  content="应付金额=达人分成，若金额有误可联系财务沟通、修改"
                  label=""
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>

            <el-col v-if="+formData.tradeType === 3" :span="8">
              <el-form-item
                label="款项截图："
                label-width="94px"
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
                  :disabled="canEdit || +formData.workerStatus === 4 || +formData.workerStatus === 3"
                />
                <div
                  v-if="!formData.collectionScreenshots.length"
                  class="el-upload__tip"
                >
                  只能上传jpg/png文件
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col v-if="+formData.paymentType === 1 && (+formData.platId === 25 || +formData.platId === 2)" :span="8">
              <!-- :disabled="+formData.workerStatus === 4" -->
              <el-form-item label="平台任务ID：" prop="platTaskId" :label-width="addFormRules.platTaskId[0].required ? '120px' : ''">
                <el-input
                  v-model="formData.platTaskId"
                  placeholder="请输入"
                  :disabled="+formData.workerStatus === 3"
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
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
                      v-if="+formData.workerStatus !== 3"
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
            <el-col :span="8">
              <el-form-item label="视频发布时间：">
                {{ formData.video.addTime | emptyFill }}
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="其他费用">
                <div class="flex">
                  <el-input-number
                    v-model="formData.otherMoney"
                    :precision="2"
                    :min="0"
                    :max="1000000000"
                    disabled
                    size="small"
                  />
                  <el-tooltip placement="top">
                    <div slot="content">
                      抖+费用：{{ formData.workerOrderDouMoney }}<br>
                      平台手续费：{{ formData.workerOrderPlatMoney }}<br>
                      其他成本：{{ formData.workerOrderOtherMoney }}<br>
                      数据源于商务填写的工单，如数据有误，请<br>联系商务沟通拉齐
                    </div>
                    <i class="iconfont iconwenhao" type="primary" />
                  </el-tooltip>
                </div>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="播放量：" prop="flowCount">
                <el-input-number
                  v-model="formData.flowCount"
                  :disabled="+formData.workerStatus === 4"
                  :min="0"
                  size="small"
                  @change="handleChangeFlowCount"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
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

            <template v-if="projectType === 1&&workId > 0">
              <el-col :span="8">
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
              <el-col v-if="formData.cancelOrderStatus" :span="8">
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
            </template>
          </el-row>

          <!-- <el-row v-if="formData.projectType">
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
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
            </el-col>
          </el-row> -->

        </div>

        <!-- 待录入，待履约不显示 -->
        <template v-if="+formData.workerStatus > 1">
          <p class="form-title m-t-20">抵扣信息（由签约经纪人填写）</p>
          <div class="form-border">
            <div v-if="!formData.deductionInfoBO.parentWorkId && +formData.workerStatus !== 3" class="addButton" @click="handleShowDeduction('add')">若该达人或该机构有多个工单要抵扣或合并，可在此处添加，添加后可提升财务核算绩效的准确度</div>
            <el-row>
              <el-col :span="8">
                <el-form-item label="关联抵扣工单：">
                  <span v-if="formData.deductionInfoBO.parentWorkId" class="childWorkNum m-r-10">共{{ (formData.deductionInfoBO || {}).childWorkOrderCount }}个工单</span>
                  <el-button type="primary" :disabled="+formData.workerStatus === 3" @click="handleShowDeduction(formData.deductionInfoBO.parentWorkId ? 'edit' : 'add')">
                    {{ formData.deductionInfoBO.parentWorkId ? '编辑' : '添加' }}
                  </el-button>
                  <IconTip
                    content="若同一达人或同一家公司有多个工单要相抵扣，可在此处添加"
                    icon-class="iconwenhao"
                  />
                </el-form-item>
              </el-col>

              <template v-if="formData.deductionInfoBO.parentWorkId">
                <el-col :span="8">
                  <el-form-item :label="`${formData.deductionInfoBO.paymentType === 1 ? '抵扣后实际应付金额' : '抵扣后实际应收金额'}：`">
                    <span>{{ formData.deductionInfoBO.collectionMoney }}</span>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="+formData.deductionInfoBO.paymentType === 2" label="收款情况：" label-width="94px" prop="deductionChasingResult">
                    <el-select v-model="formData.deductionInfoBO.paymentResult" :disabled="+formData.workerStatus === 3">
                      <el-option
                        v-for="item in chasingArr"
                        :key="item.val"
                        :value="item.val"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="+formData.deductionInfoBO.paymentType === 1" label="付款情况：" label-width="94px" prop="deductionRemitResult">
                    <el-select v-model="formData.deductionInfoBO.paymentResult" :disabled="+formData.workerStatus === 3">
                      <el-option
                        v-for="item in remitArr"
                        :key="item.val"
                        :value="item.val"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <template v-if="+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1">
                  <el-col :span="8">
                    <el-form-item label="绩效月：" label-width="80px" prop="deductionMonthMoney">
                      <el-date-picker
                        v-model="formData.deductionInfoBO.monthMoney"
                        type="month"
                        placeholder="请选择月份"
                        value-format="yyyy-MM"
                        :disabled="+formData.workerStatus === 3"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="支付渠道：" label-width="94px" prop="deductionTradeType">
                      <el-select
                        v-model="formData.deductionInfoBO.tradeType"
                        placeholder="请选择支付渠道"
                        :disabled="+formData.workerStatus === 3"
                      >
                        <el-option v-for="item in tradeTypeArr" :key="item.val" :label="item.label" :value="item.val" />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item v-if="(+formData.deductionInfoBO.tradeType === 1 || +formData.deductionInfoBO.tradeType === 2)" label="交易流水号：" label-width="108px" prop="deductionOutTradeNo">
                      <el-input v-model="formData.deductionInfoBO.outTradeNo" maxlength="45" :disabled="+formData.workerStatus === 3" @input="(val) => handleInputOutTradeNo(val, 'deduction')" />
                    </el-form-item>
                  </el-col>

                </template>

                <el-col v-if="+formData.deductionInfoBO.paymentType === 1 && +formData.deductionInfoBO.paymentResult === 1" :span="8">
                  <el-form-item label="OA流程编号：" prop="deductionOaContractNumber" label-width="114px">
                    <el-input v-model="formData.deductionInfoBO.oaContractNumber" maxlength="25" :disabled="+formData.workerStatus === 3" @input="(val) => handleInputOaContractNumber(val, 'deduction')" />
                  </el-form-item>
                </el-col>

                <el-col v-if="+formData.deductionInfoBO.tradeType === 3" :span="8">
                  <el-form-item
                    label="款项截图："
                    label-width="94px"
                    prop="deductionCollectionScreenshots"
                    :rules="
                      (+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1)
                        ? [{ required: true, validator: deductionCollectionScreenshotsRequired } ]:
                          [{ required: false }]"
                  >
                    <UploadImg
                      v-model="formData.deductionInfoBO.paymentScreenshots"
                      :limit="3"
                      size="small"
                      :disabled="canEdit || +formData.workerStatus === 4 || +formData.workerStatus === 3"
                    />
                    <div
                      v-if="!(formData.deductionInfoBO.paymentScreenshots || []).length"
                      class="el-upload__tip"
                    >
                      只能上传jpg/png文件
                    </div>
                  </el-form-item>
                </el-col>

              </template>
            </el-row>
          </div>
        </template>

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
                <el-form-item label="达人分成：">{{
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

            <!-- <OrderRemind v-if="$permission('order_remind')" ref="orderRemind" type="1" :work-id="+workId" /> -->
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

    <DeductionDialog
      ref="deductionDialog"
      :belong-type="1"
      :type="deductionDialogType"
      :parent-id="deductionParentId"
      :current-id="deductionCurrentId"
      :current-item="{ paymentType: +formData.paymentType, collectionMoney: +formData.paymentType === 2 ? formData.collectionMoneyPut : formData.collectionMoneyPay }"
      :show="showDeductionDialog"
      @close="showDeductionDialog = false"
      @success="editDeductionSuccess"
      @computed="computedTotalMoney"
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
import { UploadImg, IconTip, OrderRemind } from 'components'
import { copy } from '@/utils'
import {
  $getProjectDetial,
  $addProjectDetail,
  $editProjectDetail,
  $getAddPageCondition,
  $getMedAccounts
} from '@/api/sign-contract'
import { $getDataByDictType } from '@/api/index.js'
import { $getDateStatus } from '@/api/proprietary-orders'
import { useStore } from '@/views/putting-manager/hook'
import { useMapData } from './hooks'
import { PYTHON_HOST as HOST } from '@/const'
import request from '@/http'
import DeductionDialog from '../../../../bussiness-manage/components/deductionDialog.vue'

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
    },
    accountId: {
      type: Number,
      default: 0
    }
  },
  components: {
    VideoDialog: defineAsyncComponent(() => import('./videoListDialog.vue')),
    UploadImg,
    IconTip,
    OrderRemind,
    DeductionDialog
  },
  setup(props, { emit }) {
    const { $message, $nextTick, $refs, $confirm, $alert } = getCurrentInstance().proxy
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
      darenUndertakeRefundRatio: 0,
      darenUndertakeRefundMoney: 0,
      companyUndertakeRefundRatio: 0,
      companyUndertakeRefundMoney: 0,
      workerOrderOtherMoney: 0,
      workerOrderDouMoney: 0,
      workerOrderPlatMoney: 0,
      paymentType: '',
      chasingResult: '',
      remitResult: '',
      monthMoney: '',
      oaContractNumber: '',
      collectionMoneyPay: '',
      collectionMoneyPut: '',
      tradeType: '',
      outTradeNo: '',
      businessMoneyInfoBO: {},
      deductionInfoBO: {}
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
      remitArr: [{ val: 1, label: '已向达人付款' }, { val: 2, label: '未向达人付款​' }],
      tradeTypeArr: [{ val: 1, label: '支付宝' }, { val: 2, label: '微信' }, { val: 3, label: '银行转账' }],
      curFinishTime: '',
      showDeductionDialog: false,
      deductionDialogType: '',
      deductionParentId: '',
      deductionCurrentId: ''
    })
    const tradetitle = (value) => {
      const item = states.tradeTypeArr.find(item => item.val === +value) || {}
      return item.label
    }
    states.typeTitle = computed(() => {
      switch (props.type) {
        case 'view':
          return '查看'
        case 'edit':
          return '编辑'
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

    const deductionCollectionScreenshotsRequired = (rule, value, callback) => {
      if (!(formData.value.deductionInfoBO.paymentScreenshots || []).length) {
        callback(new Error('请上传款项截图'))
        return
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
      // accountUnitPrice: [
      //   {
      //     required: true,
      //     trigger: 'blur',
      //     validator: (rule, value, callback) => {
      //       const reg =
      //         /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      //       if (!value || (value && !toString(value).trim())) {
      //         callback(new Error('请输入账号单价'))
      //         return
      //       }
      //       if (!reg.test(value)) {
      //         callback(new Error('仅支持输入小数点后两位的非0正数'))
      //         return
      //       }
      //       if (value > 1000000000) {
      //         callback(new Error('仅支持输入含10亿以内的数字'))
      //         return
      //       }
      //       callback()
      //     }
      //   }
      // ],
      platOrderMoney: [
        {
          required: true,
          trigger: ['blur', 'change'],
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('平台下单价需大于0'))
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
      tradeType: [{
        required: true,
        message: '请选择支付渠道',
        trigger: ['blur', 'change']
      }],
      outTradeNo: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!value.replace(/(^\s*)|(\s*$)/g, '')) {
            callback(new Error('请输入交易流水号'))
          } else {
            callback()
          }
        },
        message: '请输入交易流水号',
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
      }],
      platTaskId: [{ required: true, message: '请输入平台任务ID', trigger: ['blur', 'change'] }],
      deductionChasingResult: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.paymentResult) {
            callback(new Error('请选择收款情况'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change'] }],
      deductionRemitResult: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.paymentResult) {
            callback(new Error('请选择付款情况'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change'] }],
      deductionMonthMoney: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.monthMoney) {
            callback(new Error('请选择绩效月'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }],
      deductionTradeType: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.tradeType) {
            callback(new Error('请选择支付渠道'))
          } else {
            callback()
          }
        },
        trigger: ['blur', 'change']
      }],
      deductionOutTradeNo: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.outTradeNo.replace(/(^\s*)|(\s*$)/g, '')) {
            callback(new Error('请输入交易流水号'))
          } else {
            callback()
          }
        },
        message: '请输入交易流水号',
        trigger: ['blur', 'change']
      }],
      deductionOaContractNumber: [{
        required: true,
        validator: (rule, value, callback) => {
          if (!formData.value.deductionInfoBO.oaContractNumber.replace(/(^\s*)|(\s*$)/g, '')) {
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
        $refs.addForm.clearValidate('businessGroupName')
        $refs.addForm.clearValidate('businessUserName')
      } else {
        $refs.addForm.clearValidate('businessGroupId')
        $refs.addForm.clearValidate('businessUserId')
      }
      formData.value.businessGroupId = ''
      formData.value.businessUserId = ''
      formData.value.businessGroupName = ''
      formData.value.businessUserName = ''
    }
    const watchFlag = ref(false)
    const orderMoney = computed(() => {
      if (!watchFlag.value) return oldOrderMoney.value
      // 订单流水=销售收入-对公返点-对私返点-折扣金额
      const { flowMoney = 0, discount = 0, discountPrivate = 0, rebateMoney = 0 } = formData.value.businessMoneyInfoBO
      return (flowMoney - discount - discountPrivate - rebateMoney)
    })
    // cpm=平台下单价/播放量*1000
    // watch(orderMoney, (val) => {
    //   if (!watchFlag.value) return
    //   if (formData.value.flowCount && val) {
    //     formData.value.cpm = val / formData.value.flowCount * 1000
    //   } else {
    //     formData.value.cpm = undefined
    //   }
    // })
    watch(() => formData.value.flowCount, (val) => {
      if (!watchFlag.value) return
      if (val && formData.value.platOrderMoney) {
        formData.value.cpm = formData.value.platOrderMoney / val * 1000
      } else {
        formData.value.cpm = undefined
      }
    })

    // 客户返点&折扣比例 = 客户返点&折扣金额/销售收入
    watch(
      () => formData.value.refundMoney,
      (val, oldVal) => {
        if (!watchFlag.value) return
        formData.value.refundRatio = ((val || 0) / (formData.value.flowMoney || 0)) * 100
      }
    )
    // 应收金额 = 平台下单价 - 达人分成
    watch(() => formData.value.platOrderMoney, (val) => {
      const { flowCount } = formData.value
      formData.value.cpm = (flowCount === undefined || flowCount === null) ? '' : (val || 0) / (flowCount) * 1000
      formData.value.collectionMoneyPut = (val || 0) - formData.value.outMoney
    })

    // 绩效营收 = 订单流水 - 平台手续费 - 达人分成 - 抖荚成本 - 其他成本 ( => 销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本)
    watch(
      () => formData.value.outMoney,
      (val, oldVal) => {
        formData.value.collectionMoneyPay = val
        formData.value.collectionMoneyPut = formData.value.platOrderMoney - val

        if (!watchFlag.value) return
        const otherMoney = formData.value.businessMoneyInfoBO.otherMoney ? formData.value.businessMoneyInfoBO.otherMoney : 0

        const { douMoney = 0, platMoney = 0 } = formData.value.businessMoneyInfoBO || {}

        formData.value.centerMoney =
          Number(orderMoney.value - platMoney - (val || 0) - douMoney - otherMoney).toFixed(2)
      }
    )
    // 达人分成 = (账号单价-达人分担客户返点金额）*达人分成比例
    watch(
      () => formData.value.outMoneyRatio,
      (val) => {
        if (!watchFlag.value) return
        const { flowMoney = 0 } = formData.value.businessMoneyInfoBO || {}
        formData.value.outMoney = Number((flowMoney - formData.value.darenUndertakeRefundMoney) * (val ? val * 0.01 : 0)).toFixed(2)
      }
    )
    watch(
      () => formData.value.businessMoneyInfoBO.otherMoney,
      (val) => {
        if (!watchFlag.value) return
        const outMoney = formData.value.outMoney ? formData.value.outMoney : 0

        const { douMoney = 0, platMoney = 0 } = formData.value.businessMoneyInfoBO || {}

        formData.value.centerMoney =
          Number(orderMoney.value - outMoney - platMoney - douMoney - (val || 0)).toFixed(2)
      }
    )
    // watch(
    //   () => orderMoney.value,
    //   (val, oldVal) => {
    //     if (!watchFlag.value) return
    //     formData.value.outMoney =
    //      (val || 0) *
    //       (formData.value.outMoneyRatio
    //         ? formData.value.outMoneyRatio * 0.01
    //         : 0)
    //     const outMoney = formData.value.outMoney ? formData.value.outMoney : 0
    //     const otherMoney = formData.value.otherMoney ? formData.value.otherMoney : 0
    //     formData.value.centerMoney =
    //       (val || 0) - outMoney - otherMoney
    //   }
    // )

    watch(() => formData.value.paymentType, (val, oldVal) => {
      // formData.value.chasingResult = ''
      // formData.value.remitResult = ''
      if (!(+val === 1 && (+formData.value.platId === 25 || +formData.value.platId === 2))) {
        formData.value.platTaskId = ''
      }

      $refs.addForm && $refs.addForm.clearValidate('chasingResult')
      $refs.addForm && $refs.addForm.clearValidate('remitResult')
      $refs.addForm && $refs.addForm.clearValidate('oaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('monthMoney')
      $refs.addForm && $refs.addForm.clearValidate('outTradeNo')

      formData.value.monthMoney = ''
      formData.value.tradeType = ''

      // 当前应收应付变化时，校验是否有抵扣工单存在，存在则重新计算。
      if (!oldVal) return

      if (!formData.value.deductionInfoBO.parentWorkId) return

      if (val === 2 && formData.value.collectionMoneyPut === undefined) return
      if (val === 1 && formData.value.collectionMoneyPay === undefined) return

      states.deductionCurrentId = formData.value.workId
      states.deductionParentId = (formData.value.deductionInfoBO || {}).parentWorkId

      $nextTick(() => {
        $refs.deductionDialog.computedTotalMoney()
      })
      // formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.chasingResult, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('chasingResult')
      $refs.addForm && $refs.addForm.clearValidate('remitResult')
      $refs.addForm && $refs.addForm.clearValidate('oaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('monthMoney')
      $refs.addForm && $refs.addForm.clearValidate('outTradeNo')

      if (!(+formData.paymentType === 2 && +formData.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('collectionScreenshots')
      }

      formData.value.monthMoney = ''
      formData.value.tradeType = ''
      // formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.remitResult, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('chasingResult')
      $refs.addForm && $refs.addForm.clearValidate('remitResult')
      $refs.addForm && $refs.addForm.clearValidate('oaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('monthMoney')
      $refs.addForm && $refs.addForm.clearValidate('outTradeNo')

      if (!(+formData.paymentType === 2 && +formData.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('collectionScreenshots')
      }

      formData.value.monthMoney = ''
      formData.value.tradeType = ''
      // formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.tradeType, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('chasingResult')
      $refs.addForm && $refs.addForm.clearValidate('remitResult')
      $refs.addForm && $refs.addForm.clearValidate('oaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('monthMoney')
      $refs.addForm && $refs.addForm.clearValidate('outTradeNo')
      formData.value.collectionScreenshots = []
      formData.value.outTradeNo = ''
      $nextTick(() => {
        $refs.addForm && $refs.addForm.clearValidate('collectionScreenshots')
      })
    })

    watch(() => formData.value.collectionScreenshots, (val) => {
      $refs.addForm && $refs.addForm.validateField('collectionScreenshots')
    })

    watch(() => formData.value.deductionInfoBO.paymentType, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')

      formData.value.deductionInfoBO.monthMoney = ''
      formData.value.deductionInfoBO.tradeType = ''
      // formData.value.oaContractNumber = ''
    })

    watch(() => formData.value.deductionInfoBO.paymentResult, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')

      if (!(+formData.value.deductionInfoBO.paymentType === 2 && +formData.value.deductionInfoBO.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('deductionCollectionScreenshots')
      }

      formData.value.deductionInfoBO.monthMoney = ''
      formData.value.deductionInfoBO.tradeType = ''
      formData.value.deductionInfoBO.oaContractNumber = ''
    })

    watch(() => formData.value.deductionInfoBO.tradeType, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')
      formData.value.deductionInfoBO.paymentScreenshots = []
      formData.value.deductionInfoBO.outTradeNo = ''
      $nextTick(() => {
        $refs.addForm && $refs.addForm.clearValidate('deductionCollectionScreenshots')
      })
    })

    watch(() => formData.value.deductionInfoBO.paymentScreenshots, (val) => {
      $refs.addForm && $refs.addForm.validateField('deductionCollectionScreenshots')
    })

    watch([() => formData.value.video, () => formData.value.paymentType], (newVal, oldVal) => {
      console.log(newVal, oldVal)
      if (+newVal[1] === 1) {
        console.log('付款')
        if (!oldVal[0].titleName && !newVal[0].titleName) {
          console.log(1)
          addFormRules.platTaskId[0].required = false
        } else if (oldVal[0].titleName && !newVal[0].titleName) {
            console.log(2)
          addFormRules.platTaskId[0].required = false
        } else {
            console.log(3)
          addFormRules.platTaskId[0].required = true
        }
        console.log(addFormRules.platTaskId[0].required, 'addFormRules.platTaskId[0].required')
      }
      }, {
        deep: true
        // immediate: true
      })

    // 监听当前工单的应收
    watch(() => formData.value.collectionMoneyPut, (val) => {
      if (!formData.value.deductionInfoBO.parentWorkId) {
        return
      }

      if (!formData.value.workId) {
        return
      }

      if (val === undefined) {
        return
      }

      states.deductionCurrentId = formData.value.workId
      states.deductionParentId = (formData.value.deductionInfoBO || {}).parentWorkId

      $nextTick(() => {
        if (+formData.value.paymentType === 2) {
          $refs.deductionDialog.computedTotalMoney()
        }
      })
    })

    // 监听当前工单的应付
    watch(() => formData.value.collectionMoneyPay, (val) => {
      if (!formData.value.deductionInfoBO.parentWorkId) {
        return
      }

      if (!formData.value.workId) {
        return
      }

      if (val === undefined) {
        return
      }

      states.deductionCurrentId = formData.value.workId
      states.deductionParentId = (formData.value.deductionInfoBO || {}).parentWorkId

      $nextTick(() => {
        if (+formData.value.paymentType === 1) {
          $refs.deductionDialog.computedTotalMoney()
        }
      })
    })

    const handleChangeDaren = (val = 0, type) => {
      const {
        platOrderMoney = 0,
        businessMoneyInfoBO,
        outMoneyRatio,
        flowCount
      } = formData.value

      const { flowMoney = 0, douMoney = 0, otherMoney = 0, platMoney = 0 } = businessMoneyInfoBO || {}

      if (type === 'ratio') {
        formData.value = {
          ...formData.value,
          darenUndertakeRefundMoney: Number(flowMoney * (val || 0) / 100).toFixed(2),
          outMoney: (flowMoney - Number(flowMoney * val / 100).toFixed(2) || 0) * outMoneyRatio / 100,
          centerMoney: orderMoney.value - ((flowMoney - Number(flowMoney * val / 100).toFixed(2) || 0) * outMoneyRatio / 100) - platMoney - douMoney - otherMoney,
          cpm: (flowCount === undefined || flowCount === null) ? '' : (platOrderMoney - Number(platOrderMoney * val / 100).toFixed(2)) / (flowCount) * 1000
        }
      } else {
        formData.value = {
          ...formData.value,
          darenUndertakeRefundRatio: Number(val / flowMoney * 100).toFixed(2),
          outMoney: (flowMoney - Number(val).toFixed(2) || 0) * outMoneyRatio / 100,
          centerMoney: orderMoney.value - ((flowMoney - Number(val).toFixed(2) || 0) * outMoneyRatio / 100) - platMoney - douMoney - otherMoney,
          cpm: (flowCount === undefined || flowCount === null) ? '' : (platOrderMoney - Number(val).toFixed(2)) / (flowCount) * 1000
        }
      }
    }

    const handleWatch = (val) => {
      watchFlag.value = true
    }

    const handleChangeOutMoneyRatio = (val) => {
      const {
        businessMoneyInfoBO = {},
        darenUndertakeRefundMoney
      } = formData.value

      const { flowMoney = 0, douMoney = 0, otherMoney = 0, platMoney = 0 } = businessMoneyInfoBO

      formData.value = {
        ...formData.value,
        outMoney: Number((flowMoney - darenUndertakeRefundMoney) * val / 100).toFixed(2),
        centerMoney: Number((orderMoney.value || 0) - Number((flowMoney - darenUndertakeRefundMoney) * val / 100).toFixed(2) - platMoney - douMoney - otherMoney).toFixed(2)
      }
    }

    const handleChangeOutMoney = (val) => {
      const {
        businessMoneyInfoBO = {}
      } = formData.value

      const { douMoney = 0, otherMoney = 0, platMoney = 0 } = businessMoneyInfoBO

      formData.value = {
        ...formData.value,
        centerMoney: Number((orderMoney.value || 0) - val - platMoney - douMoney - otherMoney).toFixed(2)
      }
    }

    const handleChangeFlowCount = (val) => {
      if (val && formData.value.platOrderMoney) {
        formData.value.cpm = formData.value.platOrderMoney / val * 1000
      } else {
        formData.value.cpm = undefined
      }
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
          (item) => +item.id === +params.businessGroupId
        ) || {}).orgName
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

      params.deductionInfoBO.paymentScreenshots = JSON.stringify(
        params.deductionInfoBO.paymentScreenshots
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
              oaContractNumber,
              tradeType,
              outTradeNo,
              collectionMoney,
              businessMoneyInfoBO = {}

            } = res.data || {}
            const data = res.data || {}

            let { deductionInfoBO = {}} = data
            deductionInfoBO = deductionInfoBO ? { ...deductionInfoBO } : {}

            const resDeductionInfoBO = res.data.deductionInfoBO || {}
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
              collectionScreenshots: JSON.parse(collectionScreenshots || '[]'),
              businessMoneyInfoBO: businessMoneyInfoBO || {},
              deductionInfoBO: deductionInfoBO ? {
                ...deductionInfoBO
              } : {}
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

              if (+resDeductionInfoBO.paymentType === 2) {
                formData.value.deductionInfoBO = {
                  ...formData.value.deductionInfoBO,
                  paymentResult: +resDeductionInfoBO.paymentResult ? +resDeductionInfoBO.paymentResult : ''
                }
              } else if (+resDeductionInfoBO.paymentType === 1) {
                formData.value.deductionInfoBO = {
                  ...formData.value.deductionInfoBO,
                  paymentResult: +resDeductionInfoBO.paymentResult ? +resDeductionInfoBO.paymentResult : ''
                }
              } else {
                formData.value.deductionInfoBO = {
                  ...formData.value.deductionInfoBO,
                  paymentResult: ''
                }
              }

              $nextTick(() => {
                formData.value.monthMoney = monthMoney
                formData.value.oaContractNumber = oaContractNumber
                formData.value.tradeType = tradeType

                formData.value.deductionInfoBO.monthMoney = resDeductionInfoBO.monthMoney
                formData.value.deductionInfoBO.oaContractNumber = resDeductionInfoBO.oaContractNumber
                formData.value.deductionInfoBO.tradeType = resDeductionInfoBO.tradeType

                if (+paymentType === 1) {
                  formData.value.collectionMoneyPay = collectionMoney
                } else if (+paymentType === 2) {
                  formData.value.collectionMoneyPut = collectionMoney
                }

                if (+deductionInfoBO.paymentType === 1) {
                  formData.value.deductionInfoBO.collectionMoney = resDeductionInfoBO.collectionMoney
                } else if (+paymentType === 2) {
                  formData.value.deductionInfoBO.collectionMoney = resDeductionInfoBO.collectionMoney
                }

                $nextTick(() => {
                  formData.value.outTradeNo = outTradeNo
                  formData.value.collectionScreenshots = JSON.parse(collectionScreenshots || '[]')

                  formData.value.deductionInfoBO.outTradeNo = resDeductionInfoBO.outTradeNo
                  formData.value.deductionInfoBO.paymentScreenshots =
                    resDeductionInfoBO.paymentScreenshots
                      ? Array.isArray(resDeductionInfoBO.paymentScreenshots) ? resDeductionInfoBO.paymentScreenshots : JSON.parse(resDeductionInfoBO.paymentScreenshots || '[]')
                        : '[]'

                  setTimeout(() => {
                    $refs.addForm && $refs.addForm.clearValidate('platOrderMoney')
                  })
                })
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
      // try {
        await addForm.value.validate()
        await $refs.addForm.validateField('chasingResult')
        await $refs.addForm.validateField('remitResult')

        if (states.showActiveLinkError) return
      // } catch (e) {
        // if ($refs.orderRemind.$refs.orderRemindForm) {
        //   await $refs.orderRemind.$refs.orderRemindForm.validate()
        // }
        // return
      // }

      // if ($refs.orderRemind.$refs.orderRemindForm) {
      //   await $refs.orderRemind.$refs.orderRemindForm.validate()
      // }

      const params = formatData()
      if (!(+params.cancelOrderStatus)) {
        params.cancelOrderReason = ''
        params.cancelOrderStatus = 0
      }

      states.loading = true

      if (+params.paymentType === 1) {
        params.chasingResult = ''
        params.collectionMoneyPut = ''
      } else if (+params.paymentType === 2) {
        params.remitResult = ''
        params.collectionMoneyPay = ''
      }

      if (!(+params.paymentType === 1 && +params.remitResult === 1)) {
        params.oaContractNumber = ''
      }
      // +formData.paymentType === 2 && +formData.chasingResult === 1
      if (!(+params.paymentType === 2 && +params.chasingResult === 1)) {
        params.monthMoney = ''
        params.tradeType = ''
      }

      params.collectionMoney = params.collectionMoneyPay === '' ? params.collectionMoneyPut : params.collectionMoneyPay
      params.paymentResult = params.chasingResult || params.remitResult

      params.platTaskId = params.platTaskId || ''

      if (!params.deductionInfoBO.parentWorkId) {
        params.deductionInfoBO = {}
      }

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

            // if ($refs.orderRemind.$refs.orderRemindForm) {
            //   const { reminderUserBOS, msg } = $refs.orderRemind.form
            //   params.feishuMsgSendRequest = {
            //     workId: props.workId,
            //     reminderUserBOS,
            //     msg
            //   }
            // }

            res = await $editProjectDetail(params)
            break
        }
        states.loading = false
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

    const handleInputOutTradeNo = (val, type) => {
      if (type === 'deduction') {
        formData.value.deductionInfoBO.outTradeNo = val.replace(/[^a-zA-Z0-9]/g, '')
        return
      }
      formData.value.outTradeNo = val.replace(/[^a-zA-Z0-9]/g, '')
    }

    const handleInputOaContractNumber = (val, type) => {
      if (type === 'deduction') {
        formData.value.deductionInfoBO.oaContractNumber = val.replace(/[^a-zA-Z0-9]/g, '')
        return
      }
      formData.value.oaContractNumber = val.replace(/[^a-zA-Z0-9]/g, '')
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

    const close = () => {
      emit('close')
    }

    const handleToGetCurVal = (val) => {
      states.curFinishTime = val.displayValue
    }

    const handleToJudgeDq = (val) => {
      $getDateStatus({
        accountId: props.accountId,
        slotDate: val
      }).then(res => {
        const { status } = res.data
        if (status === 1) {
            $confirm(`该账号所选中的档期已存在工单，确认要继续选择${val}该天的档期？`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              $message({
                type: 'success',
                message: '操作成功!'
              })
            }).catch(() => {
              $message({
                type: 'info',
                message: '操作失败'
              })
              formData.value.finishTime = states.curFinishTime
            })
          } else if (status === 2) {
            $alert(`该账号所选中的档期显示已被封档，请选择其他日期`, {
              confirmButtonText: '确定',
              callback: () => {
                formData.value.finishTime = states.curFinishTime
              }
            })
          }
        })
    }

    const handleShowDeduction = (type) => {
      // 存在签约、自营双重
      if (+formData.value.existSelfOrderFlag === 1) {
        $message.error('此订单不支持添加抵扣工单')
        return
      }

      if (type === 'add') {
        // 非已履约
        if (+formData.value.workerStatus !== 2) {
          $message.error('请先履约绑定视频后再添加抵扣工单')
          return
        }
      }
      states.deductionDialogType = type
      states.showDeductionDialog = true
      states.deductionCurrentId = formData.value.workId
      states.deductionParentId = (formData.value.deductionInfoBO || {}).parentWorkId
    }

    const editDeductionSuccess = (data) => {
      // 变化后如果不相同，说明应收应付已改，重置收付款情况
      if (+data.paymentType !== +formData.value.deductionInfoBO.paymentType) {
        formData.value.deductionInfoBO.paymentResult = ''
      }

      $nextTick(() => {
        states.showDeductionDialog = false
        formData.value.deductionInfoBO = {
          ...formData.value.deductionInfoBO,
          ...data
        }
        formData.value.deductionInfoBO.parentWorkId = data.parentWorkId
      })
    }

    const computedTotalMoney = (data) => {
      // 变化后如果不相同，说明应收应付已改，重置收付款情况
      if (+data.paymentType !== +formData.value.deductionInfoBO.paymentType) {
        formData.value.deductionInfoBO.paymentResult = ''
      }

      $nextTick(() => {
        states.showDeductionDialog = false
        formData.value.deductionInfoBO = {
          ...formData.value.deductionInfoBO,
          ...data
        }
      })
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
      handlePlat,
      userInfo,
      orderMoney,
      handleProjectType,
      handleWatch,
      handleChangeDaren,
      handleChangeOutMoneyRatio,
      handleInputOutTradeNo,
      handleInputOaContractNumber,
      handleChangeFlowCount,
      projectTypeMap,
      orderStatusMap,
      handleSwitch,
      handleShowActiveLink,
      handleCancel,
      handleSaveActiveLink,
      handleDeleteActiveLinkUrl,
      handleChangeOutMoney,
      tradetitle,
      handleToGetCurVal,
      handleToJudgeDq,
      handleShowDeduction,
      deductionCollectionScreenshotsRequired,
      editDeductionSuccess,
      computedTotalMoney
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
    position: relative;
  }
}

.addButton {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
  border: 1px solid #ccc;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  z-index: 2;
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

  .el-select {
    width: 160px;
  }

  .el-input {
    width: 160px;
  }

  .el-input-number {
    width: 160px;
  }

  .iconfont {
    margin-left: 4px;
    color: inherit;
    font-size: inherit;
    cursor: pointer;
  }
}

.message {
  font-size: 10px;
  color: #aaa;
}

::v-deep {
  .flex {
    align-items: center;
  }

  .upload--img__small {
    align-items: flex-start;
  }

  .iconTip {
    margin-left: -8px;
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

.childWorkNum {
  color: #67C23A
}
</style>
