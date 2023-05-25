<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="970px"
    @close="handleClose"
  >
    <div class="step">
      <el-steps :active="+formData.workerStatus === 4 ? -1 : +formData.workerStatus" finish-status="success" process-status="finish" align-center>
        <el-step title="商务信息录入" />
        <el-step title="履约并绑定视频" />
        <el-step title="财务核账" />
      </el-steps>
    </div>

    <el-form
      ref="form"
      v-loading="loading"
      class="modal-form"
      label-position="right"
      :model="formData"
      label-width="120px"
      :rules="diaLogType === 'detail' ? {} : rules"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="账号归属：">{{ formData.accountBelong }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台-账号：">
            <el-tag>{{ formData.platName }}</el-tag>
            -{{ formData.accountName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="品牌：">{{ formData.brandName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合作产品：">{{ formData.quotientName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商单号：">{{ formData.quotientId }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="执行人小组：">{{ formData.executeGroup }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="执行人：">{{ formData.executeName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预计发布时间：">{{ formData.publishTime }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工单状态：">
            {{ (WORK_STATUS_ARR[+formData.workerStatus] || {}).title }}
            <IconTip
              v-if="(WORK_STATUS_ARR[+formData.workerStatus] || {}).tip"
              trigger="hover"
              :content="(WORK_STATUS_ARR[+formData.workerStatus] || {}).tip"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="商单brief文件：" prop="executeId">
            <div v-for="item in formData.briefs" :key="'briefs' + item.name">
              <el-link
                type="primary"
                target="_blank"
                :href="item.url"
              >{{ item.name }}</el-link>
            </div>
          </el-form-item>
        </el-col> -->
      </el-row>
      <div v-if="Object.keys(formData.orderEvaluateInfoBO || {}).length" class="video-content">
        <div class="video-content-title">
          <span>合作评价</span>
        </div>
        <el-row class="m-b-10">
          <el-col :span="12">
            <div class="flex">
              <span class="video-form-item-label">响应速度</span>
              <el-rate
                v-model="(formData.orderEvaluateInfoBO || {}).responseSpeedScore"
                class="m-l-8"
                disabled
              />
            </div>

          </el-col>
          <el-col :span="12">
            <div class="flex">
              <span class="video-form-item-label">配合度</span>
              <el-rate
                v-model="(formData.orderEvaluateInfoBO || {}).cooperationScore"
                class="m-l-8"
                disabled
              />
            </div>
          </el-col>
        </el-row>

        <el-row class="m-b-10">
          <el-col :span="12">
            <div class="flex">
              <span class="video-form-item-label">
                内容创意

              </span>
              <el-rate
                v-model="(formData.orderEvaluateInfoBO || {}).contentCreativeScore"
                class="m-l-8"
                disabled
              />
            </div>

          </el-col>
          <el-col :span="12">
            <div v-if="(formData.orderEvaluateInfoBO || {}).rebateScore" class="flex rebate">
              <span class="video-form-item-label">
                返点力度
                <IconTip
                  type="popover"
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  icon-class="iconwenhao"
                >
                  <div>
                    评星规则：
                    <br>
                    媒介返点比例＞30%：5星
                    <br>
                    媒介返点比例25%-30%（含）：4星
                    <br>
                    媒介返点比例20%-25%（含）：3星
                    <br>
                    媒介返点比例10%-20%（含）：2星
                    <br>
                    媒介返点比例0-10%（含）：1星
                  </div>
                </IconTip>
              </span>
              <el-rate
                v-model="(formData.orderEvaluateInfoBO || {}).rebateScore"
                class="m-l-8"
                disabled
              />
            </div>
          </el-col>
        </el-row>

        <el-row class="m-b-10">
          <el-col>
            <span class="video-form-item-label">其他评价</span>
            <span class="m-l-8">
              {{ (formData.orderEvaluateInfoBO || {}).otherEvaluate }}
            </span>
          </el-col>
        </el-row>

        <el-row class="m-b-10">
          <el-col>
            <span class="video-form-item-label">评价人</span>
            <span class="m-l-8">
              {{ [(formData.orderEvaluateInfoBO || {}).groupName, (formData.orderEvaluateInfoBO || {}).evaluateUserName].filter(item => item).join('-') }}
            </span>
          </el-col>
        </el-row>

      </div>

      <div class="video-content">
        <!-- <div class="flex flex-justify-between flex-align-center video-title m-b-10">
          <a type="primary" target="_blank" :href="video.url">{{ video.titleName }}</a>
          <el-button
            v-if="diaLogType === 'edit'"
            :disabled="formData._isOver || !hasEditRight"
            type="danger"
            size="small"
            @click="handleDelVideo(index)"
          >删除</el-button>
        </div> -->
        <div class="video-content-title">
          <span>订单信息（由商务填写）</span>
          <span v-if="+formData.lockMoney === 1">
            金额已锁定
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="签约/媒介/工作室锁定金额后，商业信息将不允许修改，若需修改，请联系对应人解锁。若工单状态为已核账，则所有金额均无法再修改，特殊情况需要修改的，请联系财务"
              icon-class="iconwenhao"
            />
          </span>
        </div>

        <div class="video-form flex flex-wrap">
          <div class="video-form-item">
            <el-form-item label="销售收入：" prop="workMoney" class="formItem">
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="formData.workMoney"
                size="small"
                :min="0"
                :precision="2"
                :max="99999999"
              />
              <template v-else>
                <span class="video-form-item-value">{{ formData.workMoney }}</span>
              </template>
            </el-form-item>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
              icon-class="iconwenhao"
            />
          </div>
          <!-- <div class="video-form-item">
            <el-form-item label="平台下单价：" prop="platOrderMoney" class="formItem">
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="formData.platOrderMoney"
                size="small"
                :min="0"
                :precision="2"
                :max="99999999"
              />
              <template v-else>
                <span class="video-form-item-value">{{ formData.platOrderMoney }}</span>
              </template>
            </el-form-item>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="实际在平台中下单给达人的价格"
              icon-class="iconwenhao"
            />
          </div> -->
          <div class="video-form-item">
            <span class="video-form-item-label">对公返点：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.discount"
              :min="0"
              :precision="2"
              :max="formData.workMoney"
              size="small"
            />
            <span v-else class="video-form-item-value">{{ formData.discount }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="对公返点：必须走合同和发票返点给客户的金额，即为对公返点金额。"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">对私返点：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.discountPrivate"
              :min="0"
              :precision="2"
              :max="formData.flowMoney"
              size="small"
            />
            <span v-else class="video-form-item-value">{{ formData.discountPrivate }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="对私返点：必须通过高灯打款支付给客户个人账户的金额，无需走合同和发票，即为对私金额，填写无需加高灯服务费。"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">折扣金额：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.rebateMoney "
              :min="0"
              :precision="2"
              :max="formData.flowMoney"
              size="small"
            />
            <span v-else class="video-form-item-value">{{ formData.rebateMoney }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="折扣金额：客户自行下单，为通过线上改价方式返还给客户的金额；代客下单，为提前从合作金额扣除的返点金额，即不需以打款方式向客户支付的返点。"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">抖+成本：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.douMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ formData.douMoney }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">平台手续费：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.platMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ formData.platMoney }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">其他成本：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.otherMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ formData.otherMoney }}</span>
          </div>
          <!-- <div class="video-form-item">
            <el-form-item label="绩效月：" prop="monthMoneyNew" class="formItem">
              <el-date-picker
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="formData.monthMoneyNew"
                type="month"
                size="small"
                value-format="yyyy-MM"
              />
              <template v-else>
                {{ formData.monthMoneyNew }}
              </template>
            </el-form-item>
          </div> -->
          <div class="video-form-item">
            <span class="video-form-item-label">线下补款：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="formData.offlineAddMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>
              {{ formData.offlineAddMoney }}
            </template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="线下补款：客户自行平台下单（不含代客下单和不走平台的私单的情况）还需线下补款，则录入补款金额。"
              icon-class="iconwenhao"
            />
          </div>

          <el-form-item label="上传收款截图" class="uploadCollectionPhoto">
            <UploadImg v-model="formData.collectionScreenshotList" :limit="3" :disabled="!(diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight)" />
          </el-form-item>
          <!--<div class="video-form-item">
            <span class="video-form-item-label">达人分成成本：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.accountType !== 5 && formData.lockMoney === 0 && hasEditRight"
              v-model="video.outMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ video.outMoney }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="若是签约账号接工单则达人分成成本=（销售收入-销售成本）*签约达人分成比例，若是乾饱饱媒介账号接工单则达人分成成本=平台账号报价-媒介返点金额，其中媒介返点金额=平台账号报价*媒介返点比例。"
              icon-class="iconwenhao"
            />
          </div>
          <div v-if="formData.quotientType === 1||formData.quotientType === 2" class="video-form-item">
            <span class="video-form-item-label">平台任务ID：</span>
            <el-input
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="video.platTaskId"
              size="small"
              maxlength="20"
            />
            <span v-else class="video-form-item-value">{{ video.platTaskId }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="平台任务ID：抖音快手等广告交易平台，下单后请输入星图/快接单中的订单ID或任务ID"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">收款日期：</span>
            <el-date-picker
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="video.collectionDate"
              value-format="yyyy-MM-dd"
              placeholder=""
              size="small"
            />
            <span v-else class="video-form-item-value">{{ video.collectionDate }}</span>
          </div> -->
          <!-- <template v-if="formData.accountType === 5">
            <div class="video-form-item">
              <span class="video-form-item-label">平台账号报价：</span>
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="video.platPrice"
                size="small"
                :min="0"
                :precision="0"
                :max="99999999"
                @change="countVideoIntermediaryDiscount(video)"
              />
              <span v-else class="video-form-item-value">{{ video.platPrice }}</span>
              <IconTip
                type="popover"
                placement="top-start"
                width="300"
                trigger="hover"
                content="抖音/快手账号平台报价来源为星图/磁力聚星平台，系统月/周自动更新一次，可能存在一定偏差，支持编辑修改。其他平台数据以用户编辑数值为准。"
                icon-class="iconwenhao"
              />
            </div>
            <div class="video-form-item">
              <span class="video-form-item-label">媒介返点比例：</span>
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="video.rebate"
                size="small"
                :min="0"
                :precision="0"
                :max="100"
                @change="countVideoIntermediaryDiscount(video)"
              />
              <span v-else class="video-form-item-value">{{ video.rebate }}</span>
              %
            </div>
            <div class="video-form-item">
              <span class="video-form-item-label">媒介返点金额：</span>
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="video.intermediaryDiscount"
                size="small"
                :min="0"
                :precision="2"
                :max="video.platPrice"
                @change="intermediaryDiscountChange(video)"
              />
              <span v-else class="video-form-item-value">{{ video.intermediaryDiscount }}</span>
              <IconTip
                type="popover"
                placement="top-start"
                width="300"
                trigger="hover"
                content="乾饱饱媒介账号承接工单，由达人给乾派的返点金额，系统默认媒介返点金额=平台账号报价*媒介返点比例，若存在误差用户可手工修改编辑。"
                icon-class="iconwenhao"
              />
            </div>
          </template> -->
        </div>
      </div>

      <div class="video-content orderMessage">
        <div class="video-content-title">
          <span>订单信息（由{{ +formData.accountTypeForJump === 5 ? '媒介采买人' : +formData.accountTypeForJump === 3 ? '签约经纪人':'工作室账号负责人' }}填写）</span>
        </div>
        <!-- 自营  -->
        <div v-if="+formData.accountTypeForJump === 1" class="video-form flex flex-wrap">
          <div class="video-form-item">
            <span class="video-form-item-label">平台下单价：</span>
            <span class="video-form-item-value">{{ formData.platOrderMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="实际在平台中下单给达人的价格"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">执行金额：</span>
            <span class="video-form-item-value">{{ formData.executeMoney || '--' }}</span>
            <IconTip
              type="popover"
              content="执行金额=销售收入-对公返点-对私返点-折扣金额-抖荚成本-平台手续费-其他成本"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">平台任务ID：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).platTaskId || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="平台任务ID：抖音快手等广告交易平台，下单后请输入星图/快接单中的订单ID或任务ID"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">锁定金额：</span>
            <span class="video-form-item-value">{{ formData.lockMoney ? '是' : '否' || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="订单信息填写完毕并核对无误后，可通过锁定金额的方式防止商务后期未经沟通擅改金额"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">绑定视频：</span>
            <el-link
              v-if="((formData.video || [])[0] || {}).titleName"
              type="primary"
              class="video-form-item-value text-over-hidden-1"
              :href="formData.video.url"
              :underline="false"
              target="_blank"
            >
              {{ formData.video[0].titleName }}
            </el-link>
            <span v-else class="video-form-item-value">--</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">视频发布日期：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).addTime || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">撤单：</span>
            <span class="video-form-item-value">{{ +formData.cancelOrderStatus ? '是' : '否' }}</span>
          </div>
          <!-- <div class="video-form-item">
            <span class="video-form-item-label">视频{{ +formData.isDeleted === 1 ? '(已删除)' : '' }}：</span>
            <span class="video-form-item-value">
              <el-link v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 0" class="link" :href="((formData.video || [])[0] || {}).url">{{ ((formData.video || [])[0] || {}).titleName }}</el-link>
              <span v-else>--</span>

              <span v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 1" class="textOverflow">{{ ((formData.video || [])[0] || {}).titleName }}</span>
            </span>
          </div> -->
        </div>

        <!-- 签约 -->
        <div v-if="+formData.accountTypeForJump === 3" class="video-form flex flex-wrap">
          <div class="video-form-item">
            <span class="video-form-item-label">平台下单价：</span>
            <span class="video-form-item-value">{{ formData.platOrderMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="实际在平台中下单给达人的价格"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">达人分担客户返点&折扣金额：</span>
            <span class="video-form-item-value">{{ formData.darenUndertakeRefundMoney || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">客户返点&折扣金额：</span>
            <span class="video-form-item-value">{{ formData.refundMoney || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">订单流水：</span>
            <span class="video-form-item-value">{{ formData.orderMoney || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">达人分担客户返点&折扣比例：</span>
            <span class="video-form-item-value">{{ formData.darenUndertakeRefundRatio || '--' }}{{ formData.darenUndertakeRefundRatio ? '%' : '' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="达人分担客户返点&折扣比例=达人分担客户返点&折扣金额/平台下单价"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">客户返点&折扣比例：</span>
            <span class="video-form-item-value">{{ formData.refundRatio || '--' }}{{ formData.refundRatio ? '%' : '' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">达人分成：</span>
            <span class="video-form-item-value">{{ formData.allOutMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="达人分成=（销售收入-达人分担客户返点&折扣金额）*达人分成比例"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">绩效营收：</span>
            <span class="video-form-item-value">{{ formData.centerMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">锁定金额：</span>
            <span class="video-form-item-value">{{ formData.lockMoney ? '是' : '否' || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="订单信息填写完毕并核对无误后，可通过锁定金额的方式防止商务后期未经沟通擅改金额"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">应收或应付：</span>
            <span class="video-form-item-value">{{ +formData.paymentType?`${+formData.paymentType===1 ? '向达人打款' : '向达人追款'}`:'未设定' || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="根据达人实际情况，如果达人已经加入乾派MCN，则需要向达人付款，若达人未加入乾派MCN，则需要向达人收款"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span v-if="!+formData.paymentType" class="video-form-item-label">应付/应收金额：</span>
            <span v-else class="video-form-item-label">{{ +formData.paymentType===1?'应付':'应收' }}金额：</span>
            <span class="video-form-item-value">{{ formData.collectionMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              :content="formData.paymentType===1?'应付金额=达人分成，若金额有误可联系财务沟通、修改':'应收金额=平台下单价-达人分成，若金额有误可联系财务沟通、修改'"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span v-if="!+formData.paymentType" class="video-form-item-label">付款/收款情况：</span>
            <span v-else class="video-form-item-label">{{ +formData.paymentType===1?'付款':'收款' }}情况：</span>
            <span class="video-form-item-value">{{ +formData.paymentResult?`${+formData.paymentResult===1 ? `${+formData.paymentType ? `${+formData.paymentType===1 ? '已打款' : '已追款' }` : '--'}` : `${+formData.paymentType ? `${+formData.paymentType===2 ? '未追款' : '未打款' }` : '--'}`}`:'未设置' || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType===1" class="video-form-item">
            <span class="video-form-item-label">OA流程编号：</span>
            <span class="video-form-item-value">{{ formData.oaContractNo || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">绩效月：</span>
            <span class="video-form-item-value">{{ formData.monthMoneyNew || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">支付渠道：</span>
            <span class="video-form-item-value">{{ +formData.tradeType?tradeTypeList.get(+formData.tradeType):'--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">{{ +formData.tradeType===1 || +formData.tradeType===2 ? '交易流水号' : '款项截图' }}：</span>
            <span v-if="+formData.tradeType===1 || +formData.tradeType===2" class="video-form-item-value">{{ formData.outTradeNo || '--' }}</span>
            <div v-else class="video-form-item-value">
              <ul v-if="(formData.paymentScreenshots || []).length" class="imgWrap el-upload-list el-upload-list--picture-card">
                <li v-for="item in formData.paymentScreenshots" :key="item" class="el-upload-list__item is-success">
                  <div>
                    <div class="el-image el-upload-list__item-thumbnail">
                      <img :src="item" alt="" class="el-image__inner">
                    </div>
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePreview(item)">
                        <i class="el-icon-zoom-in" />
                      </span>
                    </span>
                  </div>
                </li>
              </ul>
              <span v-else>--</span>
            </div>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">平台任务ID：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).platTaskId || '--' }}</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">绑定视频：</span>
            <el-link
              v-if="((formData.video || [])[0] || {}).titleName"
              type="primary"
              class="video-form-item-value text-over-hidden-1"
              :href="formData.video.url"
              :underline="false"
              target="_blank"
            >
              {{ formData.video[0].titleName }}
            </el-link>
            <span v-else class="video-form-item-value">--</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">视频发布日期：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).addTime || '--' }}</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">播放量：</span>
            <span class="video-form-item-value">{{ formData.flowCount || '--' }}</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">cpm：</span>
            <span class="video-form-item-value">{{ formData.cpm || '--' }}</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">撤单：</span>
            <span class="video-form-item-value">{{ +formData.cancelOrderStatus === 1 ? '是' : '否' }}</span>
          </div>
          <!-- <div class="video-form-item">
            <span class="video-form-item-label">视频{{ +formData.isDeleted === 1 ? '(已删除)' : '' }}：</span>
            <span class="video-form-item-value">
              <el-link v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 0" class="link" :href="((formData.video || [])[0] || {}).url">{{ ((formData.video || [])[0] || {}).titleName }}</el-link>
              <span v-else>--</span>

              <span v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 1" class="textOverflow">{{ ((formData.video || [])[0] || {}).titleName }}</span>
            </span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">达人是否返款：</span>
            <span class="video-form-item-value">{{ +formData.isRebate ? '是' : '否' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">款项截图：</span>
            <span class="video-form-item-value">
              <UploadImg v-model="formData.paymentScreenshots" :limit="3" disabled class="upload" />
            </span>
          </div> -->
        </div>

        <!-- 媒介 -->
        <div v-if="+formData.accountTypeForJump === 5" class="video-form flex flex-wrap">
          <div class="video-form-item">
            <span class="video-form-item-label">刊例价：</span>
            <span class="video-form-item-value">{{ formData.kanLiPrice || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="刊例价=销售收入-平台手续费"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">达人分成：</span>
            <span class="video-form-item-value">{{ formData.allOutMoney || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">客户返点&折扣金额：</span>
            <span class="video-form-item-value">{{ formData.rebateAndDiscountMoney || '--' }}</span>
          </div>
          <!-- <div class="video-form-item">
            <span class="video-form-item-label">已定档期：</span>
            <span class="video-form-item-value">{{ formData.finishTimeConfirm || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">媒介投放人：</span>
            <span class="video-form-item-value">{{ formData.mediumDeliveryUserName || '--' }}</span>
          </div> -->
          <div class="video-form-item">
            <span class="video-form-item-label">绩效营收：</span>
            <span class="video-form-item-value">{{ formData.performanceMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">平台下单价：</span>
            <span class="video-form-item-value">{{ formData.platOrderMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="实际在平台中下单给达人的价格"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">{{ +formData.paymentType===1?'应付':'应收' }}金额：</span>
            <span class="video-form-item-value">{{ formData.collectionMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              :content="formData.paymentType===1?'应付金额=达人分成，若金额有误可联系财务沟通、修改':'应收金额=平台下单价-达人分成，若金额有误可联系财务沟通、修改'"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">锁定金额：</span>
            <span class="video-form-item-value">{{ formData.lockMoney ? '是' : '否' || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="订单信息填写完毕并核对无误后，可通过锁定金额的方式防止商务后期未经沟通擅改金额"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">绑定视频：</span>
            <el-link
              v-if="((formData.video || [])[0] || {}).titleName"
              type="primary"
              class="video-form-item-value text-over-hidden-1"
              :href="formData.video[0].url"
              :underline="false"
              target="_blank"
            >
              {{ formData.video[0].titleName }}
            </el-link>
            <span v-else class="video-form-item-value">--</span>
          </div>
          <div class="video-form-item platTaskId">
            <span class="video-form-item-label">视频发布日期：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).addTime || '--' }}</span>
          </div>
          <div class="video-form-item">
            <span v-if="!+formData.paymentType" class="video-form-item-label">付款/收款情况：</span>
            <span v-else class="video-form-item-label">{{ +formData.paymentType===1?'付款':'收款' }}情况：</span>
            <span class="video-form-item-value">{{ +formData.paymentResult?`${+formData.paymentResult===1 ? `${+formData.paymentType ? `${+formData.paymentType===1 ? '已打款' : '已追款' }` : '--'}` : `${+formData.paymentType ? `${+formData.paymentType===2 ? '未追款' : '未打款' }` : '--'}`}`:'未设置' || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType===1" class="video-form-item">
            <span class="video-form-item-label">OA流程编号：</span>
            <span class="video-form-item-value">{{ formData.oaContractNo || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">{{ +formData.paymentType===1 ? '付款' : '收款' }}时间：</span>
            <span class="video-form-item-value">{{ formData.paymentTime || '--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">支付渠道：</span>
            <span class="video-form-item-value">{{ +formData.tradeType?tradeTypeList.get(+formData.tradeType):'--' }}</span>
          </div>
          <div v-if="+formData.paymentType!==1" class="video-form-item">
            <span class="video-form-item-label">{{ +formData.tradeType===1 || +formData.tradeType===2 ? '交易流水号' : '款项截图' }}：</span>
            <span v-if="+formData.tradeType===1 || +formData.tradeType===2" class="video-form-item-value">{{ formData.outTradeNo || '--' }}</span>
            <div v-else class="video-form-item-value">
              <ul v-if="(formData.paymentScreenshots || []).length" class="imgWrap el-upload-list el-upload-list--picture-card">
                <li v-for="item in formData.paymentScreenshots" :key="item" class="el-upload-list__item is-success">
                  <div>
                    <div class="el-image el-upload-list__item-thumbnail">
                      <img :src="item" alt="" class="el-image__inner">
                    </div>
                    <span class="el-upload-list__item-actions">
                      <span class="el-upload-list__item-preview" @click="handlePreview(item)">
                        <i class="el-icon-zoom-in" />
                      </span>
                    </span>
                  </div>
                </li>
              </ul>
              <span v-else>--</span>
            </div>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">撤单：</span>
            <span class="video-form-item-value">{{ +formData.cancelOrderStatus ? '是' : '否' }}</span>
          </div>
          <!-- <div class="video-form-item">
            <span class="video-form-item-label">平台账号报价：</span>
            <span class="video-form-item-value">{{ formData.platPrice || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="抖音/快手账号平台报价来源为星图/磁力聚星平台，系统月/周自动更新一次，可能存在一定偏差，支持编辑修改。其他平台数据以用户编辑数值为准。"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">媒介返点比例：</span>
            <span class="video-form-item-value">{{ formData.rebate || '--' }}{{ formData.rebate ? '%' : '' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">媒介返点金额：</span>
            <span class="video-form-item-value">{{ ((formData.video || [])[0] || {}).intermediaryDiscount || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="乾饱饱媒介账号承接工单，由达人给乾派的返点金额，系统默认媒介返点金额=平台账号报价*媒介返点比例，若存在误差用户可手工修改编辑。"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">视频{{ +formData.isDeleted === 1 ? '(已删除)' : '' }}：</span>
            <span class="video-form-item-value">
              <el-link v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 0" class="link" :href="((formData.video || [])[0] || {}).url">{{ ((formData.video || [])[0] || {}).titleName }}</el-link>
              <span v-else>--</span>

              <span v-if="((formData.video || [])[0] || {}).titleName && +formData.isDeleted === 1" class="textOverflow">{{ ((formData.video || [])[0] || {}).titleName }}</span>
            </span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">达人是否返款：</span>
            <span class="video-form-item-value">{{ +formData.isRebate ? '是' : '否' }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">款项截图：</span>
            <span class="video-form-item-value">
              <UploadImg v-model="formData.paymentScreenshots" :limit="3" disabled class="upload" />
            </span>
          </div> -->

        </div>
      </div>

      <!-- 待录入待履约不显示 -->
      <div v-if=" +formData.workerStatus > 1" class="video-content">
        <div class="video-content-title">
          <span>订单信息（由{{ +formData.accountTypeForJump === 5 ? '媒介采买人' : +formData.accountTypeForJump === 3 ? '签约经纪人':'工作室账号负责人' }}填写）</span>
        </div>
        <div class="video-form">
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
                <el-form-item :label="`${formData.deductionInfoBO.paymentType === 1 ? '抵扣后实际应付金额' : '抵扣后实际应收金额'}：`" label-width="170px">
                  <span>{{ formData.deductionInfoBO.collectionMoney }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item v-if="+formData.deductionInfoBO.paymentType === 2" label="收款情况：" prop="deductionChasingResult">
                  {{ (chasingArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                </el-form-item>
              </el-col>

              <el-col :span="8">
                <el-form-item v-if="+formData.deductionInfoBO.paymentType === 1" label="付款情况：" prop="deductionRemitResult">
                  {{ (remitArr.find(item => +item.val === +formData.deductionInfoBO.paymentResult) || {}).label || '--' }}
                </el-form-item>
              </el-col>

              <template v-if="+formData.deductionInfoBO.paymentType === 2 && +formData.deductionInfoBO.paymentResult === 1">
                <el-col :span="8">
                  <el-form-item label="绩效月：" prop="deductionMonthMoney">
                    {{ formData.deductionInfoBO.monthMoney || '--' }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item label="支付渠道：" prop="deductionTradeType">
                    {{ (tradeTypeArr.find(item => +item.val === +formData.deductionInfoBO.tradeType) || {}).label || '--' }}
                  </el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item v-if="(+formData.deductionInfoBO.tradeType === 1 || +formData.deductionInfoBO.tradeType === 2)" label="交易流水号：" prop="deductionOutTradeNo">
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
      </div>

      <div class="video-content">
        <div class="video-content-title">
          <span>财务信息</span>
        </div>

        <div class="video-form flex flex-wrap">
          <div class="video-form-item">
            <span class="video-form-item-label">销售收入：</span>
            <span class="video-form-item-value">{{ formData.workMoney || '--' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">销售成本：</span>
            <span class="video-form-item-value">{{ formData.costMoney || '--' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">执行金额：</span>
            <span class="video-form-item-value">{{ formData.executeMoney || '--' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">达人分成：</span>
            <span class="video-form-item-value">{{ +formData.accountTypeForJump === 1 ? '0' : formData.allOutMoney || '--' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">绩效营收：</span>
            <span class="video-form-item-value">{{ formData.performanceMoney || '--' }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本"
              icon-class="iconwenhao"
            />
          </div>
          <div class="video-form-item contractNum">
            <span class="video-form-item-label">OA合同编号：</span>
            <span class="video-form-item-value">{{ formData.oaContractNo || '--' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">已付客户返点：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && $permission('rebates_paid')"
              v-model="formData.customerRebatePaid"
              :min="0"
              :precision="2"
              size="small"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ formData.customerRebatePaid }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="已付客户返点：该工单公司已实际支付给客户的返点金额，由财务人员录入。"
              icon-class="iconwenhao"
            />
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">是否已开发票：</span>
            <el-radio-group v-if="diaLogType === 'edit' && $permission('is_invoice')" v-model="formData.receiptStatus" size="small">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <span v-else class="video-form-item-value">{{ +formData.receiptStatus === 1 ? '是' : '否' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">财务是否核账：</span>
            <el-radio-group
              v-if="diaLogType === 'edit' && $permission('workorder_financial') && +formData.workerStatus >= 2"
              v-model="formData.reconciliationStatus"
              size="small"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <span v-else class="video-form-item-value">{{ +formData.reconciliationStatus === 1 ? '是' : '否' }}</span>
          </div>

        </div>

        <!-- <div class="video-form flex flex-wrap" style="margin-bottom: 0px">
          <div class="video-form-item">
            <span class="video-form-item-label">已付客户返点：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && $permission('rebates_paid')"
              v-model="formData.customerRebatePaid"
              :min="0"
              :precision="2"
              size="small"
              :max="99999999"
            />
            <span v-else class="video-form-item-value">{{ formData.customerRebatePaid }}</span>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="已付客户返点：该工单公司已实际支付给客户的返点金额，由财务人员录入。"
              icon-class="iconwenhao"
            />
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">是否已开发票：</span>
            <el-radio-group v-if="diaLogType === 'edit' && $permission('is_invoice')" v-model="formData.receiptStatus" size="small">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <span v-else class="video-form-item-value">{{ +formData.receiptStatus === 1 ? '是' : '否' }}</span>
          </div>

          <div class="video-form-item">
            <span class="video-form-item-label">财务是否核账：</span>
            <el-radio-group
              v-if="diaLogType === 'edit' && $permission('workorder_financial') && +formData.workerStatus >= 2"
              v-model="formData.reconciliationStatus"
              size="small"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是</el-radio>
            </el-radio-group>
            <span v-else class="video-form-item-value">{{ +formData.reconciliationStatus === 1 ? '是' : '否' }}</span>
          </div>

        </div> -->

        <OrderRemind v-if="$permission('order_remind') && diaLogType === 'edit'" ref="orderRemind" type="0" :work-id="workId" />
      </div>

      <el-row class="flex">
        <span class="remark">备注：</span>
        <el-input
          v-if="diaLogType === 'edit'"
          v-model="formData.note"
          :disabled="!hasEditRight"
          type="textarea"
          placeholder="请输入备注内容"
        />
        <template v-else>
          {{ formData.note }}
        </template>
      </el-row>
    </el-form>
    <div
      v-if="diaLogType === 'edit'"
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button :disabled="loading" type="primary" :loading="btnLoading" @click="handleConfirm">确 定</el-button>
    </div>

    <DeductionDialog
      :belong-type="+formData.accountTypeForJump === 5 ? 2 : +formData.accountTypeForJump === 3 ? 1 : 0"
      :type="deductionDialogType"
      :parent-id="deductionParentId"
      :current-id="deductionCurrentId"
      :show="showDeductionDialog"
      @close="showDeductionDialog = false"
    />
  </el-dialog>
</template>
<script>
import { defineComponent, computed, getCurrentInstance, ref, reactive, toRefs, watchEffect } from '@vue/composition-api'
import { useToggle } from '@/hook/index'
import { IconTip, UploadImg, OrderRemind } from 'components'
import { $getNewWorkerOrderInfo, $updateNewWorkerOrderInfo, $sendFinancialReminder } from '@/api/bussiness-manage'
import { copy } from '@/utils'
import { isNumber } from 'axios/lib/utils'
import DeductionDialog from '../../../../bussiness-manage/components/deductionDialog.vue'

const useVideoDiaLog = function(formData) {
  const showVideoDialog = ref(false)
  // 删除视频
  const handleDelVideo = (index) => {
    formData.value.video.splice(index, 1)
  }

  const handleShowVideoDialog = () => {
    showVideoDialog.value = true
  }

  const handleChangeVideo = (selectVideo) => {
    formData.value.video = selectVideo.value.map(item => ({
      flowMoney: 0,
      outMoney: formData.value.accountType === 5 ? formData.value.platPrice || 0 : 0,
      otherMoney: 0,
      douMoney: 0,
      platMoney: 0,
      discount: 0,
      discountPrivate: 0,
      rebateMoney: 0,
      intermediaryDiscount: 0,
      rebate: formData.value.accountType === 5 ? formData.value.rebate : null,
      platPrice: formData.value.platPrice || 0,
      ...item
    }))
  }

  return {
    showVideoDialog,
    handleShowVideoDialog,
    handleChangeVideo,
    handleDelVideo
  }
}

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: true
    },
    diaLogType: {
      type: String,
      default: 'detail'
    },
    workId: Number
  },

  components: {
    IconTip,
    UploadImg,
    OrderRemind,
    DeductionDialog
  },
  setup(props, { emit }) {
    const { $message, $bus, $permission, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const title = computed(() => {
      switch (props.diaLogType) {
        case 'detail':
          return '查看工单详情'
        case 'edit':
          return '编辑工单信息'
      }
    })
    const RECONCILIATION_STATUS = ref(0)
    const supportMultiVideoFlag = ref(0)

    const data = reactive({
      WORK_STATUS_ARR: [
        {
          title: '商务信息待录入',
          tip: '指工单生成后，客户返点等信息需要商务录入，商务录入后，签约/媒介/工作室才能录入自己的信息'
        },
        {
          title: '待履约',
          tip: '订单绑定未绑定视频即为未履约'
        },
        {
          title: '已履约',
          tip: '订单绑定了视频即视为已履约'
        },
        {
          title: '已核账',
          tip: '财务核查该订单账目无误后在工单中点击已核账按钮，即视为该订单已核账'
        },
        {
          title: '撤单',
          tip: ''
        }
      ],
      paymentTypeArr: [{ val: 2, label: '应向达人收款' }, { val: 1, label: '应向达人付款' }],
      chasingArr: [{ val: 1, label: '收款已到账' }, { val: 2, label: '收款未到账' }],
      remitArr: [{ val: 1, label: '已向达人付款' }, { val: 2, label: '未向达人付款​' }],
      tradeTypeArr: [{ val: 1, label: '支付宝' }, { val: 2, label: '微信' }, { val: 3, label: '银行转账' }],
      showDeductionDialog: false,
      deductionDialogType: '',
      deductionParentId: '',
      deductionCurrentId: ''
    })

    const hasEditRight = computed(() => {
      return $permission('middleground') && RECONCILIATION_STATUS.value === 0
    })
    const tradeTypeList = new Map([
      [1, '支付宝'],
      [2, '微信'],
      [3, '银行转账'],
      [4, '线上折扣']
    ])
    const formData = ref({
      deductionInfoBO: {}
    })
    const loading = ref(true)
    const getFormData = () => {
      $getNewWorkerOrderInfo({ workId: props.workId }).then(res => {
        if (res.code === 1) {
          try {
            res.data.briefs = JSON.parse(JSON.stringify(res.data.briefs))
          } catch (err) {
            console.log(err)
          }
          res.data._isOver = res.data.isOver === 1
          res.data.monthMoneyNew = res.data.monthMoneyNew || undefined
          res.data.collectionScreenshotList = res.data.collectionScreenshotList || []

          if (res.data.workMoney === null) {
            delete res.data.workMoney
          }

          const { deductionInfoBO = {}} = res.data

          formData.value = {
            ...res.data,
            deductionInfoBO: {
              ...deductionInfoBO,
              paymentScreenshots: (deductionInfoBO || {}).paymentScreenshots
              ? Array.isArray((deductionInfoBO || {}).paymentScreenshots)
              ? (deductionInfoBO || {}).paymentScreenshots : JSON.parse((deductionInfoBO || {}).paymentScreenshots || '[]')
              : '[]'
            }
          }

          console.log(formData, 'formData')

          supportMultiVideoFlag.value = res.data.supportMultiVideoFlag
          RECONCILIATION_STATUS.value = res.data.reconciliationStatus
        } else {
          $message.error(res.message)
        }
        loading.value = false
      }).catch(err => {
        loading.value = false
      })
    }
    getFormData()

    // 计算销售成本
    const countCost = (obj) => {
      return ['discount', 'discountPrivate', 'rebateMoney', 'douMoney', 'platMoney', 'otherMoney'].reduce((t, n) => {
        t += obj[n] || 0
        return t
      }, 0)
    }

    // 计算执行金额
     const countExecuteMoney = (obj) => {
      return ['discount', 'discountPrivate', 'rebateMoney', 'douMoney', 'platMoney', 'otherMoney'].reduce((t, n) => {
        t -= obj[n] || 0
        return t
      }, obj['workMoney'])
    }

    // 计算绩效营收
    const countPerformanceMoney = (obj) => {
      return ['discount', 'discountPrivate', 'rebateMoney', 'platMoney', 'allOutMoney', 'douMoney', 'otherMoney'].reduce((t, n) => {
        t -= obj[n] || 0
        return t
      }, obj['workMoney'])
    }

    // 计算达人分成成本
    const countVideoOutMoney = (videoObj) => {
      if (formData.value.accountType === 5) {
        // 平台账号报价-媒介返点金额
        videoObj.outMoney = Number(((videoObj.platPrice || 0) - (videoObj.intermediaryDiscount || 0)).toFixed(2))
      } else {
        videoObj.outMoney = ((videoObj.flowMoney || 0) - countCost(videoObj)) * (formData.value.outMoneyRatio / 100)
      }
    }

    // 媒介金额change
    const intermediaryDiscountChange = (videoObj) => {
      videoObj.rebate = undefined
      countVideoOutMoney(videoObj)
    }

    // 计算媒介返点金额
    const countVideoIntermediaryDiscount = (videoObj) => {
      videoObj.intermediaryDiscount = ((videoObj.platPrice || 0) * (videoObj.rebate || 0) * 0.01).toFixed(2)
      countVideoOutMoney(videoObj)
    }

    // 计算视频维度的累加
    const countTotal = computed(() => {
      if (formData.value.video && formData.value.video.length && props.diaLogType === 'edit') {
        const countResult = formData.value.video.reduce((t, n) => {
          t.workMoney += n.flowMoney || 0
          t.platOrderMoney += n.platOrderMoney || 0
          t.discount += n.discount || 0
          t.discountPrivate += n.discountPrivate || 0
          t.rebateMoney += n.rebateMoney || 0
          t.douMoney += n.douMoney || 0
          t.platMoney += n.platMoney || 0
          t.otherMoney += n.otherMoney || 0
          t.allOutMoney += n.outMoney || 0
          return t
        }, {
          workMoney: 0,
          platOrderMoney: 0,
          discount: 0,
          discountPrivate: 0,
          rebateMoney: 0,
          douMoney: 0,
          platMoney: 0,
          otherMoney: 0,
          costMoney: 0,
          executeMoney: 0,
          allOutMoney: 0,
          performanceMoney: 0
        })
        // 销售成本 = 对公返点 + 对私返点 + 折扣金额 + 抖荚成本 + 平台手续费 + 其他成本
        countResult.costMoney = countCost(countResult)

        // 执行金额 = 销售收入-对公返点-对私返点-折扣金额-抖荚成本-平台手续费-其他成本
        // countResult.executeMoney = countResult.workMoney - countResult.discount - countResult.discountPrivate - countResult.rebateMoney - countResult.douMoney - countResult.platMoney - countResult.otherMoney
        countResult.executeMoney = countExecuteMoney(countResult)

        // 绩效营收=销售收入-对公返点-对私返点-折扣金额-平台手续费-达人分成-抖荚成本-其他成本
        // countResult.performanceMoney = countResult.workMoney - countResult.discount - countResult.discountPrivate - countResult.rebateMoney - countResult.platMoney - countResult.allOutMoney - countResult.douMoney - countResult.otherMoney
        countResult.performanceMoney = countPerformanceMoney(countResult)

        // 浮点数精度问题
        for (const key in countResult) {
          if (isNumber(countResult[key])) {
            countResult[key] = countResult[key].toFixed(2)
          }
        }
        return countResult
      }
      return formData.value
    })
    const btnLoading = ref(false)
    const rules = {
      workMoney: [{
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value === undefined || value === null) {
            callback(new Error('销售收入不能为空'))
            return
          }
          callback()
        }
      }],
      platOrderMoney: [{
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (value === undefined || value === null) {
            callback(new Error('平台下单价不能为空'))
            return
          }
          callback()
        }
      }],
      // monthMoneyNew: [{ required: true, message: '请输入绩效月', trigger: 'change' }],
      customerRebatePaid: [{
        required: false,
        trigger: 'change',
        validator: (rule, value, callback) => {
            if (value && countTotal.value.workMoney < value) {
              callback(new Error('已付客户返点不能大于工单销售收入'))
              return
            }
            callback()
          }
      }]
    }

    const checkRule = () => {
      return $refs.form.validate()
    }

    // 编辑确定
    const handleConfirm = async() => {
      const flag = $permission('order_remind') && props.diaLogType === 'edit'
      try {
        await checkRule()
      } catch (e) {
        if (flag && $refs.orderRemind.$refs.orderRemindForm) {
          await $refs.orderRemind.$refs.orderRemindForm.validate()
        }
        return
      }

      if (flag && $refs.orderRemind.$refs.orderRemindForm) {
        await $refs.orderRemind.$refs.orderRemindForm.validate()
      }

      btnLoading.value = true

      const data = copy(formData.value)
      // if (data.monthMoneyNew === undefined) {
      //   data.monthMoneyNew = 0
      // }
      if (data.customerRebatePaid === undefined) {
        data.customerRebatePaid = 0
      }
      const {
        workId,
        workMoney,
        platOrderMoney,
        discount,
        discountPrivate,
        rebateMoney,
        douMoney,
        platMoney,
        otherMoney,
        monthMoneyNew,
        offlineAddMoney,
        collectionScreenshotList,
        note,
        customerRebatePaid,
        receiptStatus,
        reconciliationStatus
      } = data

      const params = {
        workId,
        workMoney,
        platOrderMoney,
        discount,
        discountPrivate,
        rebateMoney,
        douMoney,
        platMoney,
        otherMoney,
        monthMoneyNew,
        offlineAddMoney,
        collectionScreenshots: JSON.stringify(collectionScreenshotList),
        note,
        customerRebatePaid,
        receiptStatus,
        reconciliationStatus
      }

      if (flag && $refs.orderRemind.$refs.orderRemindForm) {
        const { reminderUserBOS, msg } = $refs.orderRemind.form
        params.feishuMsgSendRequest = {
          workId: props.workId,
          reminderUserBOS,
          msg
        }
      }

      $updateNewWorkerOrderInfo(params).then((res) => {
        if (res.code === 1) {
          btnLoading.value = false
          emit('success')
          $message.success('操作成功')
          handleClose()
          $bus.$emit('upLog', { quotientId: data.quotientId, operation_module: '编辑确定' })
        } else {
          btnLoading.value = false
          $message.error(res.message)
        }
      })
    }

    // 媒介返款方式
    const intermediaryList = [{
      value: '微信',
      label: '微信'
    }, {
      value: '支付宝',
      label: '支付宝'
    }, {
      value: '银行卡',
      label: '银行卡'
    }]

    const { showVideoDialog, handleShowVideoDialog, handleDelVideo, handleChangeVideo: handleChangeVideoCallBreak } = useVideoDiaLog(formData)

    const handleChangeVideo = (selectVideo) => {
      handleChangeVideoCallBreak(selectVideo)
      if (formData.value.video && formData.value.video.length > 0) {
        formData.value.video.map(item => {
          if (item.rebate === formData.value.rebate) {
            countVideoIntermediaryDiscount(item)
          }
        })
      }
    }

    // 预览图片
    const handlePreview = (file) => {
      window.open(file)
    }

    const handleShowDeduction = (type) => {
      data.deductionDialogType = type
      data.showDeductionDialog = true
      data.deductionCurrentId = formData.value.workId
      data.deductionParentId = (formData.value.deductionInfoBO || {}).parentWorkId
    }

    return {
      ...toRefs(data),
      loading,
      btnLoading,
      handleConfirm,
      showVideoDialog,
      handleShowVideoDialog,
      handleDelVideo,
      handleChangeVideo,
      countVideoOutMoney,
      intermediaryList,
      countVideoIntermediaryDiscount,
      intermediaryDiscountChange,
      hasEditRight,
      formData,
      show,
      countTotal,
      handleClose,
      title,
      rules,
      supportMultiVideoFlag,
      handlePreview,
      handleShowDeduction,
      tradeTypeList
    }
  }
})
</script>

<style lang="scss" scoped>
// ::v-deep {
//   .el-form-item {
//     margin-bottom: 12px;
//   }
// }
.video-content {
    padding: 20px 0;
    margin: 10px 0;
    // max-height: 366px;
    // overflow: auto;
    ::v-deep {
      .iconfont {
        margin-left: 5px;
      }
    }

    .video-content-title {
      // padding: 0px 12px 20px;
      // margin-bottom: 16px;
      // // border-bottom: 1px solid #ccc;
      // display: flex;
      // justify-content: space-between;

      font-size: 14px;
      color: #333;
      margin-bottom: 8px;
    }
  }
  .video-form {
    background-color: #eee;
    padding-left: 2px;
    margin-bottom: 20px;
    // padding: 0 12px;
    padding: 16px 32px;

    &:last-child {
      margin-bottom: 0;
    }
  }
  .video-form-item {
    display: flex;
    align-items: center;
    width: 33%;
    margin-bottom: 22px;
    &-label {
      flex-shrink: 0;
      width: 100px;
      display: inline-block;
      text-align: right;
      margin-right:8px;
    }
    &-value {
      width: auto;
      text-align: left !important;
    }
    .el-input-number, .el-input {
      width: 140px;
    }

    // &.platTaskId,
    // &.contractNum{
    //   width:34%
    // }
  }
  .video-link {
    display: block;
    // width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .video-title {
    padding: 0 20px;
    > a {
      height: 20px;
      line-height: 20px;
      overflow: hidden;
      margin-right: 10px;
      color: rgb(24, 144, 255);
      white-space: nowrap;
      vertical-align: middle;
      text-overflow: ellipsis;
    }
  }

.uploadCollectionPhoto{
  width:35%;
}

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
}

::v-deep {
  .formItem {
    margin-bottom: 0px !important;

    & > .el-form-item__label {
      width: 100px !important;
      padding: 0px !important;
    }

    & > div {
      margin-left: 100px !important
    }
  }

  .upload {
    & > .el-upload-list {
      display: flex;

      & > .el-upload-list__item {
        margin: 0 !important;
        width: 50px !important;
        height: 50px !important;
      }

      & >  .el-upload-list__item, .el-upload--picture-card {
        line-height: 1;
      }
    }
  }

  .rebate {
    .iconfont {
      margin-left: 0 !important;
    }
  }
}

.link {
  color: #2c64ff !important;
  max-width: 160px;
  overflow: hidden;/*超出部分隐藏*/
  white-space: nowrap;/*不换行*/
  text-overflow:ellipsis;/*超出部分文字以...显示*/
  display: inline-block;
}

.textOverflow {
  max-width: 160px;
  overflow: hidden;/*超出部分隐藏*/
  white-space: nowrap;/*不换行*/
  text-overflow:ellipsis;/*超出部分文字以...显示*/
  display: inline-block;
}

.remark {
  flex-shrink: 0;
}

.step {
  padding: 0 16px 30px;
}

.m-l-8 {
  margin-left: 8px;
}

.m-l-0 {
  margin-left: 0 !important;
  vertical-align: -1px;
}

.el-upload-list--picture-card {
  .el-upload-list__item-thumbnail  {
    margin: 50%;
    transform: translate(-50% ,-50%);
  }
}

 ::v-deep{
  $--upload-image-size: 50px;
  .imgWrap{
    display: flex;
    flex-wrap: wrap;

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
 }
}

.orderMessage {
  .video-form-item-label {
    width: fit-content;
  }
}
</style>
