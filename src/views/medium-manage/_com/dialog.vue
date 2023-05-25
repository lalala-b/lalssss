<template>
  <div>
    <el-dialog
      width="1280px"
      :title="type === 'edit'?'编辑':'查看'"
      :visible="show"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form
        ref="form"
        v-loading="loading"
        class="modal-form"
        label-position="right"
        :model="formData"
        :rules="(type !== 'edit') ? {} : rules"
      >
        <div class="m-b-10">商业信息</div>
        <div class="box">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称：">{{ formData.businessInfo.orderName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型：">{{ formData.businessInfo.orderType }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号平台：">{{ formData.businessInfo.accountPlatName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="下单账号：">{{ formData.businessInfo.orderAccountName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已定排期：">
                <template v-if="type !== 'edit' || otherDisabled">
                  {{ formData.businessInfo.scheduled || '--' }}
                </template>
                <template v-else>
                  <el-date-picker
                    v-model="formData.businessInfo.scheduled"
                    class="input"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期"
                    @focus="handleToGetCurVal"
                    @change="handleToJudgeDq"
                  />
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="媒介投放人：" :label-width="`${type !== 'edit' || otherDisabled ? '' : '108px'}`" prop="mediumDeliveryUserId">
                <template v-if="type !== 'edit' || otherDisabled">
                  {{ formData.mediumDeliveryUserName }}
                </template>
                <template v-else>
                  <el-select v-model="formData.mediumDeliveryUserId" clearable filterable>
                    <el-option v-for="item in mediaPlacement" :key="item.userId" :value="item.userId" :label="item.realname" />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商务小组：">{{ formData.businessInfo.groupName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="商务对接人：">{{ formData.businessInfo.businessDockingName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="所属机构：">{{ formData.businessInfo.affiliation || '--' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="媒介采买人：">{{ formData.orderInfo.headOfMediaName }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态：">{{ ['商务信息待录入', '待履约', '已履约', '已核账', '撤单'][formData.businessInfo.workerStatus] || '--' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单ID：">{{ formData.businessInfo.workerId }}</el-form-item>
            </el-col>
          </el-row>
        </div>

        <template>
          <p class="form-title m-b-10 m-t-20">订单信息（由商务填写）</p>
          <div class="box">
            <el-row>
              <el-col :span="8">
                <el-form-item label="销售收入：">
                  {{ formData.businessMoneyInfoBO.flowMoney || '--' }}
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

        <div class="m-b-10">
          订单信息（由媒介采买人填写）
        </div>
        <div class="box">
          <el-row>
            <el-col :span="8">
              <el-form-item label="刊例价：" prop="platPrice">
                <template>
                  {{ formData.platPrice }}
                </template>
                <IconTip
                  trigger="hover"
                  content="刊例价=销售收入-平台手续费"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="达人分成："
                prop="outMoney"
                :label-width="`${(type !== 'edit' || disabled) ? '' : '94px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false }] : rules.outMoney"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ formData.orderInfo.outMoney }}
                </template>
                <el-input-number
                  v-else
                  v-model="formData.orderInfo.outMoney"
                  :disabled="+formData.businessInfo.workerStatus === 3"
                  :precision="2"
                  :min="0"
                  size="small"
                  @input="handleInputOutMoney"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="客户返点&折扣金额：">
                <template>
                  {{ formData.orderInfo.rebateAndDiscountMoney }}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="绩效营收：">
                <template>
                  {{ formData.orderInfo.performanceMoney }}
                </template>
                <IconTip
                  trigger="hover"
                  content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="平台下单价："
                prop="platOrderMoney"
                :label-width="`${(type !== 'edit' || disabled) ? '' : '108px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.platOrderMoney"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ formData.orderInfo.platOrderMoney }}
                </template>
                <el-input-number
                  v-else
                  v-model="formData.orderInfo.platOrderMoney"
                  :disabled="+formData.businessInfo.workerStatus === 3"
                  :precision="2"
                  :min="0"
                  size="small"
                  @input="handleInputPlatOrderMoney"
                />
                <IconTip
                  content="实际在平台中下单给达人的价格"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`${paymentType === 2 ? '应收' : '应付'}金额：`" prop="collectionMoney">
                <template>
                  {{ formData.orderInfo.collectionMoney }}
                </template>
                <IconTip
                  content="应收/应付金额=平台下单价-达人分成"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="锁定金额：">
                <template v-if="type !== 'edit' || otherDisabled">
                  {{ formData.orderInfo.lockMoney ? '是' : '否' }}
                </template>
                <template v-else>
                  <el-switch
                    v-model="formData.orderInfo.lockMoney"
                    active-color="#13ce66"
                    inactive-color="#d9d9d9"
                  />
                </template>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="绑定视频：">
                <template v-if="type !== 'edit' || otherDisabled">
                  <el-link
                    type="primary"
                    target="_blank"
                    class="video"
                    :href="formData.orderInfo.url"
                  >{{ formData.orderInfo.title }}</el-link>
                </template>
                <template v-else>
                  <el-button v-if="!formData.orderInfo.url" type="primary" @click="showVideoDialog = true">选择视频</el-button>
                  <el-link
                    v-if="formData.orderInfo.url"
                    type="primary"
                    target="_blank"
                    class="video"
                    :href="formData.orderInfo.url"
                  >{{ formData.orderInfo.title }}</el-link>
                  <el-button v-if="formData.orderInfo.url && +formData.businessInfo.workerStatus !== 3" type="text" class="deleteButton" @click="handleDelete">删除</el-button>
                  <!-- <el-input v-model="formData.accountPlatName" type="input" /> -->
                </template>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="视频发布时间：">{{ formData.orderInfo.addTime || '--' }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!-- paymentType === 2 yingshou -->
            <el-col :span="8" />

            <el-col v-if="paymentType === 2" :span="8">
              <el-form-item
                label="收款情况："
                prop="paymentResult"
                :label-width="`${type !== 'edit' || disabled ? '' : '94px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.paymentResult"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ (chasingArr.find(item => +item.val === +formData.orderInfo.paymentResult) || {}).label || '--' }}
                </template>
                <el-select v-else v-model="formData.orderInfo.paymentResult" :disabled="+formData.businessInfo.workerStatus === 3">
                  <el-option
                    v-for="item in chasingArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="paymentType === 2 && +formData.orderInfo.paymentResult === 1"
              :span="8"
            >
              <el-form-item
                label="收款时间："
                prop="paymentTime"
                :label-width="`${type !== 'edit' || disabled ? '' : '94px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.paymentTime"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ formData.orderInfo.paymentTime || '--' }}
                </template>
                <el-date-picker
                  v-else
                  v-model="formData.orderInfo.paymentTime"
                  type="month"
                  placeholder="请选择时间"
                  value-format="yyyy-MM"
                  :disabled="+formData.businessInfo.workerStatus === 3"
                />
              </el-form-item>
            </el-col>

            <el-col
              v-if="paymentType === 2 && +formData.orderInfo.paymentResult === 1"
              :span="8"
            >
              <el-form-item
                label="支付渠道："
                prop="tradeType"
                :label-width="`${(type !== 'edit' || disabled) ? '' : '94px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.tradeType"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ (tradeTypeArr.find(item => +item.val === +formData.orderInfo.tradeType) || {}).label || '--' }}
                </template>
                <el-select
                  v-else
                  v-model="formData.orderInfo.tradeType"
                  placeholder="请选择支付渠道"
                  :disabled="+formData.businessInfo.workerStatus === 3"
                >
                  <el-option v-for="item in tradeTypeArr" :key="item.val" :label="item.label" :value="item.val" />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="paymentType === 2 && +formData.orderInfo.paymentResult === 1 && (+formData.orderInfo.tradeType === 1 || +formData.orderInfo.tradeType === 2)"
              :span="8"
            >
              <el-form-item
                label="交易流水号："
                prop="outTradeNo"
                :label-width="`${type !== 'edit' || disabled ? '' : '108px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.outTradeNo"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ formData.orderInfo.outTradeNo || '--' }}
                </template>
                <el-input v-else v-model="formData.orderInfo.outTradeNo" :disabled="+formData.businessInfo.workerStatus === 3" placeholder="请输入交易流水号" maxlength="45" @input="handleInputOutTradeNo" />
              </el-form-item>
            </el-col>

            <el-col
              v-if="paymentType === 2 && +formData.orderInfo.paymentResult === 1 && (+formData.orderInfo.tradeType === 3)"
              :span="8"
            >
              <el-form-item
                label="款项截图："
                prop="paymentScreenshotList"
                label-width="94px"
                :rules="
                  (paymentType === 2 && +formData.orderInfo.paymentResult === 1)
                    ? [{ required: true, validator: collectionScreenshotsRequired } ]:
                      [{ required: false }]"
              >
                <UploadImg
                  v-model="formData.orderInfo.paymentScreenshotList"
                  :limit="3"
                  size="small"
                  :disabled="type !== 'edit' || otherDisabled || +formData.businessInfo.workerStatus === 3"
                />
                <div
                  v-if="!formData.orderInfo.paymentScreenshotList.length"
                  class="el-upload__tip"
                >
                  只能上传jpg/png文件
                </div>
              </el-form-item>
            </el-col>

            <el-col v-if="paymentType === 1" :span="8">
              <el-form-item
                label="付款情况："
                prop="paymentResult"
                :label-width="`${type !== 'edit' || disabled ? '' : '94px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.paymentResult"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ (remitArr.find(item => +item.val === +formData.orderInfo.paymentResult) || {}).label || '--' }}
                </template>
                <el-select v-else v-model="formData.orderInfo.paymentResult" :disabled="+formData.businessInfo.workerStatus === 3">
                  <el-option
                    v-for="item in remitArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col
              v-if="paymentType === 1 && +formData.orderInfo.paymentResult === 1"
              :span="8"
            >
              <el-form-item
                label="OA流程编号："
                prop="oaContractNumber"
                :label-width="`${type !== 'edit' || disabled ? '' : '114px'}`"
                :rules="(type !== 'edit' || disabled) ? [{ required: false}] : rules.oaContractNumber"
              >
                <template v-if="type !== 'edit' || disabled">
                  {{ formData.orderInfo.oaContractNumber || '--' }}
                </template>
                <el-input v-else v-model="formData.orderInfo.oaContractNumber" :disabled="+formData.businessInfo.workerStatus === 3" placeholder="请输入该笔打款的OA编号" maxlength="25" @input="handleInputOaContractNumber" />
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="撤单：">
                <template v-if="!(type !== 'edit' || +formData.businessInfo.workerStatus === 3)" v-slot:label>
                  <template>
                    <span>撤单</span><IconTip
                      type="popover"
                      content="订单状态为已核账时，订单不支持再勾选为撤单，若需撤单，需先联系财务取消已核账的选项"
                      icon-class="iconwenhao"
                    />
                  </template>
                </template>

                <template v-if="type !== 'edit' || +formData.businessInfo.workerStatus === 3">
                  {{ formData.cancelOrderStatus ? '是' : '否' }}
                </template>
                <template v-else>
                  <el-checkbox
                    v-model="formData.cancelOrderStatus"
                    :true-label="1"
                    :false-label="null"
                    :disabled="+formData.businessInfo.workerStatus === 3"
                  />
                </template>
              </el-form-item>
            </el-col>

            <el-col v-if="formData.cancelOrderStatus" :span="8">
              <el-form-item label="撤单原因：" prop="cancelOrderReason">
                <template v-if="type !== 'edit' || +formData.businessInfo.workerStatus === 3">
                  {{ formData.cancelOrderReason || '--' }}
                </template>
                <template v-else>
                  <el-input
                    v-model="formData.cancelOrderReason"
                    placeholder="请输入撤单原因"
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                  />
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 待录入和待履约不显示 -->
        <template v-if="+formData.businessInfo.workerStatus > 1">
          <p class="form-title m-b-10">抵扣信息（由媒介采买人填写）</p>
          <div class="box">
            <div v-if="!(type !== 'edit' || disabled) && !formData.deductionInfoBO.parentWorkId && +formData.businessInfo.workerStatus !== 3" class="addButton" @click="handleShowDeduction('add')">若该达人或该机构有多个工单要抵扣或合并，可在此处添加，添加后可提升财务核算绩效的准确度</div>

            <el-row >
              <el-col :span="8">
                <el-form-item label="关联抵扣工单：">
                  <template v-if="type !== 'edit' || disabled">
                    <template v-if="formData.deductionInfoBO.parentWorkId">
                      <span v-if="formData.deductionInfoBO.parentWorkId" class="childWorkNum m-r-10">共{{ (formData.deductionInfoBO || {}).childWorkOrderCount }}个工单</span>
                      <el-button type="primary" @click="handleShowDeduction('detail')">
                        查看
                      </el-button>
                      <IconTip
                        content="若同一达人或同一家公司有多个工单要相抵扣，可在此处添加"
                        icon-class="iconwenhao"
                      />
                    </template>
                    <template v-else>无</template>
                  </template>
                  <template v-else>
                    <span v-if="formData.deductionInfoBO.parentWorkId" class="childWorkNum m-r-10">共{{ (formData.deductionInfoBO || {}).childWorkOrderCount }}个工单</span>
                    <el-button type="primary" :disabled="+formData.businessInfo.workerStatus === 3" @click="handleShowDeduction(formData.deductionInfoBO.parentWorkId ? 'edit' : 'add')">
                      {{ formData.deductionInfoBO.parentWorkId ? '编辑' : '添加' }}
                    </el-button>
                    <IconTip
                      content="若同一达人或同一家公司有多个工单要相抵扣，可在此处添加"
                      icon-class="iconwenhao"
                    />
                  </template>

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
                    <template v-if="type !== 'edit' || disabled">
                      {{ (chasingArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                    </template>
                    <template v-else>
                      <el-select v-model="formData.deductionInfoBO.paymentResult" :disabled="+formData.businessInfo.workerStatus === 3">
                        <el-option
                          v-for="item in chasingArr"
                          :key="item.val"
                          :value="item.val"
                          :label="item.label"
                        />
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="+formData.deductionInfoBO.paymentType === 1" label="付款情况：" label-width="94px" prop="deductionRemitResult">
                    <template v-if="type !== 'edit' || disabled">
                      {{ (remitArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                    </template>
                    <template v-else>
                      <el-select v-model="formData.deductionInfoBO.paymentResult" :disabled="+formData.businessInfo.workerStatus === 3">
                        <el-option
                          v-for="item in remitArr"
                          :key="item.val"
                          :value="item.val"
                          :label="item.label"
                        />
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>

                <template v-if="+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1">
                  <el-col :span="8">
                    <el-form-item label="绩效月：" label-width="80px" prop="deductionMonthMoney">
                      <template v-if="type !== 'edit' || disabled">
                        {{ formData.deductionInfoBO.monthMoney || '--' }}
                      </template>
                      <template v-else>

                        <el-date-picker
                          v-model="formData.deductionInfoBO.monthMoney"
                          type="month"
                          placeholder="请选择月份"
                          value-format="yyyy-MM"
                          :disabled="+formData.businessInfo.workerStatus === 3"
                        />
                      </template>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item label="支付渠道：" label-width="94px" prop="deductionTradeType">
                      <template v-if="type !== 'edit' || disabled">
                        {{ (tradeTypeArr.find(item => +item.val === +formData.deductionInfoBO.tradeType) || {}).label || '--' }}
                      </template>
                      <template v-else>
                        <el-select
                          v-model="formData.deductionInfoBO.tradeType"
                          placeholder="请选择支付渠道"
                          :disabled="+formData.businessInfo.workerStatus === 3"
                        >
                          <el-option v-for="item in tradeTypeArr" :key="item.val" :label="item.label" :value="item.val" />
                        </el-select>
                      </template>
                    </el-form-item>
                  </el-col>

                  <el-col :span="8">
                    <el-form-item v-if="(+formData.deductionInfoBO.tradeType === 1 || +formData.deductionInfoBO.tradeType === 2)" label="交易流水号：" label-width="108px" prop="deductionOutTradeNo">
                      <template v-if="type !== 'edit' || disabled">
                        {{ formData.deductionInfoBO.outTradeNo || '--' }}
                      </template>
                      <template v-else>
                        <el-input v-model="formData.deductionInfoBO.outTradeNo" maxlength="45" :disabled="+formData.businessInfo.workerStatus === 3" @input="(val) => handleInputOutTradeNo(val, 'deduction')" />
                      </template>
                    </el-form-item>
                  </el-col>

                </template>

                <el-col v-if="+formData.deductionInfoBO.paymentType === 1 && +formData.deductionInfoBO.paymentResult === 1" :span="8">
                  <el-form-item label="OA流程编号：" prop="deductionOaContractNumber">
                    <template v-if="type !== 'edit' || disabled">
                      {{ formData.deductionInfoBO.oaContractNumber || '--' }}
                    </template>
                    <template v-else>
                      <el-input v-model="formData.deductionInfoBO.oaContractNumber" :disabled="+formData.businessInfo.workerStatus === 3" maxlength="25" @input="(val) => handleInputOaContractNumber(val, 'deduction')" />
                    </template>
                  </el-form-item>
                </el-col>

                <el-col v-if="+formData.deductionInfoBO.tradeType === 3" :span="8">
                  <el-form-item
                    label="款项截图："
                    label-width="94px"
                    prop="deductionCollectionScreenshots"
                    :rules="
                      (type !== 'edit' || disabled) ? [{ required: false}] : (+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1)
                        ? [{ required: true, validator: deductionCollectionScreenshotsRequired } ]:
                          [{ required: false }]"
                  >
                    <template v-if="type !== 'edit' || disabled">
                      <UploadImg
                        v-model="formData.deductionInfoBO.paymentScreenshots"
                        :limit="3"
                        size="small"
                        disabled
                      />
                    </template>
                    <template v-else>
                      <UploadImg
                        v-model="formData.deductionInfoBO.paymentScreenshots"
                        :limit="3"
                        size="small"
                        :disabled="type !== 'edit' || otherDisabled || +formData.businessInfo.workerStatus === 3"
                      />
                      <div
                        v-if="!(formData.deductionInfoBO.paymentScreenshots || []).length"
                        class="el-upload__tip"
                      >
                        只能上传jpg/png文件
                      </div>
                    </template>
                  </el-form-item>
                </el-col>

              </template>
            </el-row>
          </div>
        </template>

        <div class="m-b-10">
          财务信息
        </div>
        <div class="box">
          <el-row>
            <el-col :span="8">
              <el-form-item label="销售收入：">{{ formData.financeInfo.workMoney }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售成本：">{{ formData.financeInfo.costMoney }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="执行金额：">{{ formData.financeInfo.executeMoney }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="达人分成：">{{ formData.financeInfo.allOutMoney }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="绩效营收：">{{ formData.financeInfo.performanceMoney }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="已付客户返点：">{{ formData.financeInfo.customerRebatePaid }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否已开发票：">{{ +formData.financeInfo.receiptStatus ? '是' : '否' }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="财务是否核账：">{{ +formData.financeInfo.reconciliationStatus ? '是' : '否' }}</el-form-item>
            </el-col>
          </el-row>

          <!-- <OrderRemind v-if="$permission('order_remind')" ref="orderRemind" type="2" :work-id="id" /> -->
        </div>

        <div class="m-b-10">备注</div>
        <template v-if="type !== 'edit' || otherDisabled">
          {{ formData.financeInfo.remark }}
        </template>
        <template v-else>
          <el-input
            v-model="formData.financeInfo.remark"
            type="textarea"
            placeholder="请输入备注"
            maxlength="100"
            show-word-limit
          />
        </template>
      </el-form>

      <div
        v-if="type === 'edit'"
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose">取 消</el-button>
        <el-button :disabled="loading" type="primary" :loading="btnLoading" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <VideoDialog
      v-if="showVideoDialog"
      v-model="showVideoDialog"
      :plat-id="+formData.businessInfo.accountPlatId"
      :account-id="+formData.businessInfo.orderAccountId"
      :selected-video="formData.video"
      :support-multi-video-flag="0"
      @success="handleChangeVideo"
    />

    <DeductionDialog
      ref="deductionDialog"
      :belong-type="2"
      :type="deductionDialogType"
      :parent-id="deductionParentId"
      :current-id="deductionCurrentId"
      :current-item="{ paymentType: +paymentType, collectionMoney: formData.orderInfo.collectionMoney }"
      :show="showDeductionDialog"
      @close="showDeductionDialog = false"
      @success="editDeductionSuccess"
      @computed="computedTotalMoney"
    />

    <!-- :support-multi-video-flag="supportMultiVideoFlag" -->

  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  defineAsyncComponent,
  watch,
  computed
} from '@vue/composition-api'
import { IconTip, UploadImg, OrderRemind } from 'components'
import { $getMediumDetail, $editMediumDetail, $findMediumDeliveryUser } from '@/api/medium-manage'
import { $getDateStatus } from '@/api/proprietary-orders'
import dayjs from 'dayjs'
import DeductionDialog from '../../bussiness-manage/components/deductionDialog.vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'show'
    },
    id: {
      type: Number,
      default: 0
    },
    accountId: {
      type: Number,
      default: 0
    }
  },
  components: {
    UploadImg,
    IconTip,
    OrderRemind,
    DeductionDialog,
    VideoDialog: defineAsyncComponent(() => import('../../bussiness-manage/workorder/_pages/order/videoListDialog.vue'))
  },
  setup(props, { emit }) {
    const { $message, $refs, $confirm, $nextTick } = getCurrentInstance().proxy

    const state = reactive({
      formData: {
        businessInfo: {},
        orderInfo: {},
        financeInfo: {},
        businessMoneyInfoBO: {},
        deductionInfoBO: {},
        platPrice: '',
        mediumDeliveryUserId: '',
        cancelOrderStatus: '',
        cancelOrderReason: ''
      },
      loading: false,
      PAY_CHANNEL: ['银行卡', '微信', '支付宝'],
      showVideoDialog: false,
      btnLoading: false,
      disabled: false,
      otherDisabled: false,
      mediaPlacement: [],
      rules: {
        // platPrice: [
        //   { required: true, message: '请输入平台账号报价', trigger: 'blur' }
        // ],
        mediumDeliveryUserId: [
          { required: true, message: '请选择媒介投放人', trigger: ['blur', 'change'] }
        ],
        outMoney: [{
          required: true,
          validator: (rule, value, callback) => {
            if (state.formData.orderInfo.outMoney === null || state.formData.orderInfo.outMoney === undefined || state.formData.orderInfo.outMoney === '') {
              callback(new Error(`请输入达人分成`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change']
        }],
        platOrderMoney: [{
          required: true,
          validator: (rule, value, callback) => {
            if (state.formData.orderInfo.platOrderMoney === null || state.formData.orderInfo.platOrderMoney === undefined || state.formData.orderInfo.platOrderMoney === '') {
              callback(new Error(`请输入平台下单价`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change']
        }],
        paymentResult: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.orderInfo.paymentResult) {
              callback(new Error(`请选择${paymentType.value === 2 ? '收款情况' : '付款情况'}`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change'] }],
        paymentTime: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.orderInfo.paymentTime) {
              callback(new Error(`请选择${paymentType.value === 2 ? '收款时间' : '付款时间'}`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change'] }],
        tradeType: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.orderInfo.tradeType) {
              callback(new Error(`请选择支付渠道`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change']
        }],
        outTradeNo: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.orderInfo.outTradeNo) {
              callback(new Error(`请输入交易流水号`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change'] }],
        oaContractNumber: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.orderInfo.oaContractNumber) {
              callback(new Error(`请输入OA流程编号`))
              return
            }
            callback()
          },
          trigger: ['blur', 'change'] }],
        cancelOrderReason: [
          { required: true, message: '请输入撤单原因', trigger: ['blur', 'change'] }
        ],
        deductionChasingResult: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.deductionInfoBO.paymentResult) {
              callback(new Error('请选择收款情况'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'] }],
        deductionRemitResult: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.deductionInfoBO.paymentResult) {
              callback(new Error('请选择付款情况'))
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change'] }],
        deductionMonthMoney: [{
          required: true,
          validator: (rule, value, callback) => {
            if (!state.formData.deductionInfoBO.monthMoney) {
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
            if (!state.formData.deductionInfoBO.tradeType) {
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
            if (!state.formData.deductionInfoBO.outTradeNo.replace(/(^\s*)|(\s*$)/g, '')) {
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
            if (!state.formData.deductionInfoBO.oaContractNumber.replace(/(^\s*)|(\s*$)/g, '')) {
              callback(new Error('请输入OA流程编号'))
            } else {
              callback()
            }
          },
          message: '请输入OA流程编号',
          trigger: ['blur', 'change']
        }]
      },
      curScheduled: '',
      chasingArr: [{ val: 1, label: '收款已到账' }, { val: 2, label: '收款未到账' }],
      remitArr: [{ val: 1, label: '已向达人付款' }, { val: 2, label: '未向达人付款​' }],
      tradeTypeArr: [{ val: 1, label: '支付宝' }, { val: 2, label: '微信' }, { val: 3, label: '银行转账' }, { val: 4, label: '线上折扣' }],
      showDeductionDialog: false,
      deductionDialogType: '',
      deductionParentId: '',
      deductionCurrentId: ''
    })

    const deductionCollectionScreenshotsRequired = (rule, value, callback) => {
      if (!(state.formData.deductionInfoBO.paymentScreenshots || []).length) {
        callback(new Error('请上传款项截图'))
        return
      }
      return callback()
    }

    const collectionScreenshotsRequired = (rule, value, callback) => {
      if (!(state.formData.orderInfo.paymentScreenshotList || []).length) {
        callback(new Error('请上传款项截图'))
        return
      }
      return callback()
    }

    const paymentType = computed(() => {
      return +state.formData.orderInfo.platOrderMoney - +state.formData.orderInfo.outMoney >= 0 ? 2 : 1
    })

    watch(() => paymentType.value, (val, oldVal) => {
      // state.formData.chasingResult = ''
      // state.formData.remitResult = ''

      state.formData.orderInfo.paymentTime = ''
      state.formData.orderInfo.paymentResult = ''
      state.formData.orderInfo.tradeType = ''

      $nextTick(() => {
        $refs.form && $refs.form.clearValidate('paymentResult')
        $refs.form && $refs.form.clearValidate('oaContractNumber')
        $refs.form && $refs.form.clearValidate('paymentTime')
        $refs.form && $refs.form.clearValidate('outTradeNo')
      })

      // 当前应收应付变化时，校验是否有抵扣工单存在，存在则重新计算。
      if (!oldVal) return

      if (!state.formData.deductionInfoBO.parentWorkId) return

      if (val === 2 && state.formData.collectionMoney === undefined) return
      if (val === 1 && state.formData.collectionMoney === undefined) return

      state.deductionCurrentId = state.formData.businessInfo.workerId
      state.deductionParentId = (state.formData.deductionInfoBO || {}).parentWorkId

      $nextTick(() => {
        $refs.deductionDialog.computedTotalMoney()
      })

      // state.formData.oaContractNumber = ''
    })

    watch(() => state.formData.orderInfo.paymentResult, (val) => {
      $refs.form && $refs.form.clearValidate('paymentResult')
      // $refs.form && $refs.form.clearValidate('remitResult')
      $refs.form && $refs.form.clearValidate('oaContractNumber')
      $refs.form && $refs.form.clearValidate('paymentTime')
      $refs.form && $refs.form.clearValidate('outTradeNo')

      if (!(paymentType === 2 && +state.formData.orderInfo.paymentResult === 1)) {
        $refs.form && $refs.form.clearValidate('paymentScreenshotList')
      }

      state.formData.orderInfo.paymentTime = ''
      state.formData.orderInfo.tradeType = ''
      // state.formData.oaContractNumber = ''
    })

    watch(() => state.formData.orderInfo.tradeType, (val) => {
      $refs.form && $refs.form.clearValidate('paymentResult')
      $refs.form && $refs.form.clearValidate('oaContractNumber')
      $refs.form && $refs.form.clearValidate('paymentTime')
      $refs.form && $refs.form.clearValidate('outTradeNo')

      state.formData.orderInfo.paymentScreenshotList = []
      state.formData.orderInfo.outTradeNo = ''
      $nextTick(() => {
        $refs.form && $refs.form.clearValidate('paymentScreenshotList')
      })
    })

    watch(() => state.formData.orderInfo.paymentScreenshotList, (val) => {
      $refs.form && $refs.form.validateField('paymentScreenshotList')
    })

    watch(() => state.formData.deductionInfoBO.paymentType, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')

      state.formData.deductionInfoBO.monthMoney = ''
      state.formData.deductionInfoBO.tradeType = ''
      // state.formData.oaContractNumber = ''
    })

    watch(() => state.formData.deductionInfoBO.paymentResult, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')

      if (!(+state.formData.deductionInfoBO.paymentType === 2 && +state.formData.deductionInfoBO.paymentResult === 1)) {
        $refs.addForm && $refs.addForm.clearValidate('deductionCollectionScreenshots')
      }

      state.formData.deductionInfoBO.monthMoney = ''
      state.formData.deductionInfoBO.tradeType = ''
      state.formData.deductionInfoBO.oaContractNumber = ''
    })

    watch(() => state.formData.deductionInfoBO.tradeType, (val) => {
      $refs.addForm && $refs.addForm.clearValidate('deductionChasingResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionRemitResult')
      $refs.addForm && $refs.addForm.clearValidate('deductionOaContractNumber')
      $refs.addForm && $refs.addForm.clearValidate('deductionMonthMoney')
      $refs.addForm && $refs.addForm.clearValidate('deductionOutTradeNo')
      state.formData.deductionInfoBO.paymentScreenshots = []
      state.formData.deductionInfoBO.outTradeNo = ''
      $nextTick(() => {
        $refs.addForm && $refs.addForm.clearValidate('deductionCollectionScreenshots')
      })
    })

    watch(() => state.formData.deductionInfoBO.paymentScreenshots, (val) => {
      $refs.addForm && $refs.addForm.validateField('deductionCollectionScreenshots')
    })

    // 监听当前工单的应收
    watch(() => state.formData.orderInfo.collectionMoney, (val) => {
      if (!(state.formData.deductionInfoBO || {}).parentWorkId) {
        return
      }

      if (!state.formData.businessInfo.workerId) {
        return
      }

      if (val === undefined) {
        return
      }

      state.deductionCurrentId = state.formData.businessInfo.workerId
      state.deductionParentId = (state.formData.deductionInfoBO || {}).parentWorkId

      $nextTick(() => {
        if (+paymentType.value === 2 || +paymentType.value === 1) {
          $refs.deductionDialog.computedTotalMoney()
        }
      })
    })

    const handleClose = () => {
      emit('close')
    }

    const getDetail = async() => {
      state.loading = true
      try {
        const { code, data, message } = await $getMediumDetail({ mediumOrderId: props.id })
        if (+code === 1) {
          // 已履约或者待履约 且已锁金额
          const disabled = (+(data.businessInfoBO || {}).workerStatus === 1 ||
            +(data.businessInfoBO || {}).workerStatus === 2) &&
            Boolean((data.orderInfoBO || {}).lockMoney) ||
            +(data.businessInfoBO || {}).workerStatus === 3 ||
            +(data.businessInfoBO || {}).workerStatus === 4

          const otherDisabled = +(data.businessInfoBO || {}).workerStatus === 3 ||
            +(data.businessInfoBO || {}).workerStatus === 4

          state.formData.businessInfo = data.businessInfoBO || {}
          state.formData.businessMoneyInfoBO = data.businessMoneyInfoBO || {}
          state.formData.orderInfo = {
            ...(data.orderInfoBO || {}),
            lockMoney: Boolean((data.orderInfoBO || {}).lockMoney),
            paymentScreenshotList: (data.orderInfoBO || {}).paymentScreenshotList || []
          }

          state.formData.cancelOrderStatus = (data.orderInfoBO || {}).cancelOrderStatus
          state.formData.cancelOrderReason = (data.orderInfoBO || {}).cancelOrderReason
          state.formData.mediumDeliveryUserId = (data.orderInfoBO || {}).mediumDeliveryUserId || ''
          state.formData.mediumDeliveryUserName = (data.orderInfoBO || {}).mediumDeliveryUserName || ''
          state.formData.financeInfo = data.financeBO || {}
          state.formData.platPrice = (data.orderInfoBO || {}).platPrice || ''

          state.disabled = disabled
          state.otherDisabled = otherDisabled

          const deductionInfoBO = (data || {}).deductionInfoBO || {}

          state.formData.deductionInfoBO = { ...deductionInfoBO }

          $nextTick(() => {
            state.formData.orderInfo.paymentResult = (data.orderInfoBO || {}).paymentResult

            if (+deductionInfoBO.paymentType === 2) {
                state.formData.deductionInfoBO = {
                  ...state.formData.deductionInfoBO,
                  paymentResult: +deductionInfoBO.paymentResult ? +deductionInfoBO.paymentResult : ''
                }
              } else if (+deductionInfoBO.paymentType === 1) {
                state.formData.deductionInfoBO = {
                  ...state.formData.deductionInfoBO,
                  paymentResult: +deductionInfoBO.paymentResult ? +deductionInfoBO.paymentResult : ''
                }
              } else {
                state.formData.deductionInfoBO = {
                  ...state.formData.deductionInfoBO,
                  paymentResult: ''
                }
              }

            $nextTick(() => {
              state.formData.orderInfo.paymentTime = (data.orderInfoBO || {}).paymentTime
              state.formData.orderInfo.tradeType = (data.orderInfoBO || {}).tradeType

              $nextTick(() => {
                state.formData.orderInfo.oaContractNumber = (data.orderInfoBO || {}).oaContractNumber
                state.formData.orderInfo.outTradeNo = (data.orderInfoBO || {}).outTradeNo
                state.formData.orderInfo.paymentScreenshotList = (data.orderInfoBO || {}).paymentScreenshotList || []

                state.formData.deductionInfoBO.monthMoney = deductionInfoBO.monthMoney
                state.formData.deductionInfoBO.oaContractNumber = deductionInfoBO.oaContractNumber
                state.formData.deductionInfoBO.tradeType = deductionInfoBO.tradeType

                if (+deductionInfoBO.paymentType === 1) {
                  state.formData.deductionInfoBO.collectionMoney = deductionInfoBO.collectionMoney
                } else if (+paymentType === 2) {
                  state.formData.deductionInfoBO.collectionMoney = deductionInfoBO.collectionMoney
                }

                $nextTick(() => {
                  state.formData.deductionInfoBO.outTradeNo = deductionInfoBO.outTradeNo
                  state.formData.deductionInfoBO.paymentScreenshots =
                    deductionInfoBO.paymentScreenshots
                      ? Array.isArray(deductionInfoBO.paymentScreenshots) ? deductionInfoBO.paymentScreenshots : JSON.parse(deductionInfoBO.paymentScreenshots || '[]')
                        : '[]'
                  $refs.form.clearValidate()
                })
              })
            })
          })
        } else {
          $message.error(String(message) || '网络错误')
        }
        state.loading = false
      } catch (e) {
        state.loading = false
        $message.error(String(e) || '网络错误')
      }
    }

    const handleInputPlatOrderMoney = (val = 0) => {
      const orderInfo = { ...state.formData.orderInfo }
      const { outMoney = 0 } = orderInfo

       // 应收/应付金额
      orderInfo.collectionMoney = Math.abs(val - outMoney)

      state.formData = {
        ...state.formData,
        orderInfo
      }
    }

    // 达人分成修改
    const handleInputOutMoney = (val = 0) => {
      const orderInfo = { ...state.formData.orderInfo }
      const businessMoneyInfoBO = { ...state.formData.businessMoneyInfoBO }
      const {
        flowMoney = 0,
        platMoney = 0,
        discount = 0,
        discountPrivate = 0,
        rebateMoney = 0,
        douMoney = 0,
        otherMoney = 0
      } = businessMoneyInfoBO
      const { platOrderMoney = 0 } = orderInfo

      // 刊例价
      const platPrice = flowMoney - platMoney
      orderInfo.platPrice = platPrice

      // 绩效营收
      orderInfo.performanceMoney = platPrice - val - discount - discountPrivate - rebateMoney - douMoney - otherMoney

      // 应收/应付金额
      orderInfo.collectionMoney = Math.abs(platOrderMoney - val)

      state.formData = {
        ...state.formData,
        orderInfo,
        platPrice
      }
    }

    const handleChangeVideo = (video) => {
      const orderInfo = { ...state.formData.orderInfo }
      orderInfo.title = video.value.map(item => {
        return item.titleName
      })[0]

      orderInfo.flowId = video.value.map(item => {
        return item.flowId
      })[0]

      orderInfo.url = video.value.map(item => {
        return item.url
      })[0]

      orderInfo.addTime = video.value[0].addTime

      state.formData = {
        ...state.formData,
        orderInfo
      }
    }

    const handleDelete = () => {
      const orderInfo = { ...state.formData.orderInfo }

      orderInfo.title = ''

      orderInfo.flowId = ''

      orderInfo.url = ''

      orderInfo.addTime = ''

      state.formData = {
        ...state.formData,
        orderInfo
      }
    }

    const handleConfirm = async() => {
      $refs.form.validate().then(async(res) => {
        // if ($refs.orderRemind.$refs.orderRemindForm) {
        //   await $refs.orderRemind.$refs.orderRemindForm.validate()
        // }

        // btnLoading.value = true
        const { businessInfo, orderInfo, financeInfo, platPrice, deductionInfoBO } = state.formData
        state.btnLoading = true

        const params = {
          workId: businessInfo.workerId,
          scheduled: businessInfo.scheduled ? dayjs(businessInfo.scheduled).format('YYYY-MM-DD') : '',
          platAccountQuotation: platPrice,
          mediumDeliveryUserId: state.formData.mediumDeliveryUserId,
          mediumRebatePercentage: orderInfo.intermediaryRebate,
          mediumRebateAmount: orderInfo.intermediaryDiscount,
          customerRebateRatio: orderInfo.customerRebateRatio,
          customerRebateAmount: orderInfo.customerRebateAmount,
          performanceRevenue: orderInfo.performanceMoney,
          lockedAmount: Number(orderInfo.lockMoney),
          flowId: orderInfo.flowId,
          flowUrl: orderInfo.url,
          titles: orderInfo.title,
          isRebate: Number(orderInfo.isRebate),
          rebateTime: orderInfo.rebateTime ? dayjs(orderInfo.rebateTime).format('YYYY-MM-DD') : '',
          paymentChannel: orderInfo.paymentChannel,
          remark: financeInfo.remark,
          paymentScreenshot: orderInfo.paymentScreenshotList,
          cancelOrderStatus: state.formData.cancelOrderStatus,
          cancelOrderReason: state.formData.cancelOrderStatus ? state.formData.cancelOrderReason : '',
          platOrderMoney: orderInfo.platOrderMoney,
          collectionMoney: orderInfo.collectionMoney,
          paymentType: paymentType.value,
          paymentResult: orderInfo.paymentResult,
          paymentTime: orderInfo.paymentTime,
          tradeType: orderInfo.tradeType,
          outTradeNo: orderInfo.outTradeNo,
          oaContractNumber: orderInfo.oaContractNumber,
          outMoney: orderInfo.outMoney,
          rebateAndDiscountMoney: orderInfo.rebateAndDiscountMoney,
          deductionInfoBO: {
            ...deductionInfoBO,
            paymentScreenshots: deductionInfoBO.paymentScreenshots ? JSON.stringify(deductionInfoBO.paymentScreenshots) : '[]'
          }
        }

        // if ($refs.orderRemind.$refs.orderRemindForm) {
        //   const { reminderUserBOS, msg } = $refs.orderRemind.form

        //   params.feishuMsgSendRequest = {
        //     reminderUserBOS,
        //     msg
        //   }
        // }

        if (!params.deductionInfoBO.parentWorkId) {
          params.deductionInfoBO = {}
        }

        try {
          const { code, message } = await $editMediumDetail(params)

          if (+code === 1) {
            $message.success('编辑成功')
            emit('getList')
            handleClose()
          } else {
            $message.error(String(message))
          }

          state.btnLoading = false
        } catch (e) {
          state.btnLoading = false
          $message.error(String(e))
        }
      }).catch(async e => {
        // if ($refs.orderRemind.$refs.orderRemindForm) {
        //   await $refs.orderRemind.$refs.orderRemindForm.validate()
        // }
      })
    }
    const findMediumDeliveryUser = async() => {
      try {
        const res = await $findMediumDeliveryUser()
        if (res.code === 1) {
          state.mediaPlacement = res.data || []
        } else {
          $message.error(String(res.message))
        }
      } catch (e) {
        $message.error(String(e))
      }
    }

    const handleInputOutTradeNo = (val, type) => {
      if (type === 'deduction') {
        state.formData.deductionInfoBO.outTradeNo = val.replace(/[^a-zA-Z0-9]/g, '')
        return
      }
      state.formData.orderInfo.outTradeNo = val.replace(/[^a-zA-Z0-9]/g, '')
    }

    const handleInputOaContractNumber = (val, type) => {
      if (type === 'deduction') {
        state.formData.deductionInfoBO.oaContractNumber = val.replace(/[^a-zA-Z0-9]/g, '')
        return
      }
      state.formData.orderInfo.oaContractNumber = val.replace(/[^a-zA-Z0-9]/g, '')
    }

    const handleToGetCurVal = (val) => {
      state.curScheduled = val.displayValue
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
              state.formData.businessInfo.scheduled = state.curScheduled
            })
          }
        })
    }

    const handleShowDeduction = (type) => {
      if (type === 'add') {
        // 非已履约
        if (+state.formData.businessInfo.workerStatus !== 2) {
          $message.error('请先履约绑定视频后再添加抵扣工单')
          return
        }
      }
      state.deductionDialogType = type
      state.showDeductionDialog = true
      state.deductionCurrentId = state.formData.businessInfo.workerId
      state.deductionParentId = (state.formData.deductionInfoBO || {}).parentWorkId
    }

    const editDeductionSuccess = (data) => {
      // 变化后如果不相同，说明应收应付已改，重置收付款情况
      if (+data.paymentType !== +state.formData.deductionInfoBO.paymentType) {
        state.formData.deductionInfoBO.paymentResult = ''
      }

      $nextTick(() => {
        state.showDeductionDialog = false
        state.formData.deductionInfoBO = {
          ...state.formData.deductionInfoBO,
          ...data
        }
        state.formData.deductionInfoBO.parentWorkId = data.parentWorkId
      })
    }

    const computedTotalMoney = (data) => {
      // 变化后如果不相同，说明应收应付已改，重置收付款情况
      if (+data.paymentType !== +state.formData.deductionInfoBO.paymentType) {
        state.formData.deductionInfoBO.paymentResult = ''
      }

      $nextTick(() => {
        state.showDeductionDialog = false
        state.formData.deductionInfoBO = {
          ...state.formData.deductionInfoBO,
          ...data
        }
      })
    }

    getDetail()
    findMediumDeliveryUser()

    return {
      ...toRefs(state),
      paymentType,
      handleClose,
      handleChangeVideo,
      handleConfirm,
      handleDelete,
      handleInputPlatOrderMoney,
      handleInputOutMoney,
      handleInputOutTradeNo,
      handleInputOaContractNumber,
      handleToGetCurVal,
      handleToJudgeDq,
      handleShowDeduction,
      editDeductionSuccess,
      deductionCollectionScreenshotsRequired,
      collectionScreenshotsRequired,
      computedTotalMoney
    }
  }
})

</script>

<style lang="scss" scoped>
// ::v-deep {
//   .el-form-item {
//     // margin-bottom: 14px;
//   }
// }

::v-deep {
  $--upload-image-size: 100px;
  .el-upload-list__item, .el-upload--picture-card {
    width: $--upload-image-size;
    height: $--upload-image-size;
    line-height: $--upload-image-size;
  }
  img {
    width: $--upload-image-size;
    height: $--upload-image-size;
    object-fit: contain;
  }

  .el-input {
    max-width: 160px;
  }

  // .el-col {
  //   width: 33% !important;
  // }
}

.box {
  // border: 1px solid #dfdfdf;
  // border-radius: 6px;
  padding: 10px;
  margin-bottom: 20px;
  background: #eee;
  position: relative;
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

.input {
  max-width: 180px;
}

.dialog {
  & > div {
    width: 880px
  }
}

.video {
  width: 240px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow:ellipsis;
  margin-right: 14px !important;
  display: inline-block;
}

.deleteButton {
  color: #ff0000;
}

.childWorkNum {
  color: #67C23A
}
</style>
