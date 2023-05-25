<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="880px"
    @close="handleClose"
  >
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
        <el-col :span="12">
          <el-form-item label="账号归属：">{{ formData.accountBelong }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台-账号：">
            <el-tag>{{ formData.platName }}</el-tag>
            -{{ formData.accountName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="品牌：">{{ formData.brandName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作产品：">{{ formData.quotientName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商单号：">{{ formData.quotientId }}</el-form-item>
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="预计发布时间：">{{ formData.publishTime }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行人小组：">{{ formData.executeGroup }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行人：">{{ formData.executeName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="已定排期：">
            <template v-if="diaLogType === 'detail'">
              {{ formData.finishTimeConfirm }}
            </template>
            <el-date-picker
              v-else
              v-model="formData.finishTimeConfirm"
              :disabled="!hasEditRight"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工单状态：">
            {{ (WORK_STATUS_ARR[+formData.workerStatus] || {}).title }}
          </el-form-item>
        </el-col>

      </el-row>
      <el-form-item v-if="formData.signAccountFlag" label="锁定金额：">
        <div class="flex flex-align-center">
          <span v-if="diaLogType !=='edit'">{{ formData.lockMoney===1?'是':'否' }}</span>
          <el-switch
            v-else
            v-model="formData.lockMoney"
            :disabled="formData.editAuth === 0||!hasEditRight"
            :active-value="1"
            :inactive-value="0"
            class="m-r-5"
          />
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            content="签约账号承接工单，在工单金额录入完整后（销售收入、对公返点、对私返点、折扣金额、抖+成本、平台手续费、其他成本、达人分成成本、收款日期）。签约经纪人可通过勾选是来锁定工单金额不可修改。"
            icon-class="iconwenhao"
          />
        </div>

      </el-form-item>
      <el-form-item v-if="!(accountType === 2 && +formData.versionNum)" label="视频：">
        <div v-if="diaLogType === 'edit'">
          <el-button :disabled="formData._isOver || !hasEditRight" type="primary" @click="handleShowVideoDialog">选择视频</el-button>
        </div>
      </el-form-item>
      <div v-if="accountType === 2 && +formData.versionNum" class="video-content">
        <div v-for="(video) in formData.video" :key="video.flowId" class="video-form flex flex-wrap">
          <div class="video-form-item oldVideoForm">
            <el-form-item label="销售收入：" prop="flowMoney" class="formItem">
              <el-input-number
                v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                v-model="video.flowMoney"
                size="small"
                :min="0"
                :precision="2"
                :max="99999999"
                @change="countVideoOutMoney(video)"
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
          <div class="video-form-item">
            <span class="video-form-item-label">对公返点：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="video.discount"
              :min="0"
              :precision="2"
              :max="video.flowMoney"
              size="small"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.discount }}</span>
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
              v-model="video.discountPrivate"
              :min="0"
              :precision="2"
              :max="video.flowMoney"
              size="small"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.discountPrivate }}</span>
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
              v-model="video.rebateMoney "
              :min="0"
              :precision="2"
              :max="video.flowMoney"
              size="small"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.rebateMoney }}</span>
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
              v-model="video.douMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.douMoney }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">平台手续费：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="video.platMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.platMoney }}</span>
          </div>
          <div class="video-form-item">
            <span class="video-form-item-label">其他成本：</span>
            <el-input-number
              v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
              v-model="video.otherMoney"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
              @change="countVideoOutMoney(video)"
            />
            <span v-else class="video-form-item-value">{{ video.otherMoney }}</span>
          </div>
          <div class="video-form-item">
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
          </div>
          <template v-if="formData.accountType === 5">
            <div class="video-form-item">
              <!-- $permission('video_worker_plat_price') -->
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
              <!-- $permission('video_worker_medium_rebates') -->
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
              <!-- $permission('video_worker_medium_amount_rebates') -->
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
          </template>
        </div>
      </div>
      <template v-else>
        <div v-if="formData.video && formData.video.length" class="video-content">
          <div v-for="(video, index) in formData.video" :key="video.flowId">
            <div class="flex flex-justify-between flex-align-center video-title m-b-10">
              <a type="primary" target="_blank" :href="video.url">{{ video.titleName }}</a>
              <el-button
                v-if="diaLogType === 'edit'"
                :disabled="formData._isOver || !hasEditRight"
                type="danger"
                size="small"
                @click="handleDelVideo(index)"
              >删除</el-button>
            </div>
            <div class="video-form flex flex-wrap">
              <div class="video-form-item oldVideoForm">
                <el-form-item label="销售收入：" prop="flowMoney" class="formItem">
                  <el-input-number
                    v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                    v-model="video.flowMoney"
                    size="small"
                    :min="0"
                    :precision="2"
                    :max="99999999"
                    @change="countVideoOutMoney(video)"
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

              <div class="video-form-item">
                <span class="video-form-item-label">对公返点：</span>
                <el-input-number
                  v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                  v-model="video.discount"
                  :min="0"
                  :precision="2"
                  :max="video.flowMoney"
                  size="small"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.discount }}</span>
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
                  v-model="video.discountPrivate"
                  :min="0"
                  :precision="2"
                  :max="video.flowMoney"
                  size="small"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.discountPrivate }}</span>
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
                  v-model="video.rebateMoney "
                  :min="0"
                  :precision="2"
                  :max="video.flowMoney"
                  size="small"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.rebateMoney }}</span>
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
                  v-model="video.douMoney"
                  size="small"
                  :min="0"
                  :precision="2"
                  :max="99999999"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.douMoney }}</span>
              </div>
              <div class="video-form-item">
                <span class="video-form-item-label">平台手续费：</span>
                <el-input-number
                  v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                  v-model="video.platMoney"
                  size="small"
                  :min="0"
                  :precision="2"
                  :max="99999999"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.platMoney }}</span>
              </div>
              <div class="video-form-item">
                <span class="video-form-item-label">其他成本：</span>
                <el-input-number
                  v-if="diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight"
                  v-model="video.otherMoney"
                  size="small"
                  :min="0"
                  :precision="2"
                  :max="99999999"
                  @change="countVideoOutMoney(video)"
                />
                <span v-else class="video-form-item-value">{{ video.otherMoney }}</span>
              </div>
              <div class="video-form-item">
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
              </div>
              <template v-if="formData.accountType === 5">
                <div class="video-form-item">
                  <!-- $permission('video_worker_plat_price') -->
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
                  <!-- $permission('video_worker_medium_rebates') -->
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
                  <!-- $permission('video_worker_medium_amount_rebates') -->
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
              </template>
            </div>
          </div>
        </div>
      </template>

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
              {{ [(formData.orderEvaluateInfoBO || {}).teamName, (formData.orderEvaluateInfoBO || {}).evaluateUserName].filter(item => item).join('-') }}
            </span>
          </el-col>
        </el-row>

      </div>

      <el-form-item v-if="accountType === 2 && +formData.versionNum" label="视频：">
        <div v-if="diaLogType === 'edit'">
          <el-button v-if="!(formData.video[0] || {}).titleName" :disabled="formData._isOver || !hasEditRight" type="primary" @click="handleShowVideoDialog">选择视频</el-button>
          <template v-else>
            <el-link :href="formData.video[0].url">{{ formData.video[0].titleName }}</el-link>
            <el-button class="deleteButton" type="text" @click="handleDeleteVideo">删除</el-button>
          </template>
        </div>
      </el-form-item>

      <el-row>
        <el-col :span="12">
          <el-form-item label="销售收入：">
            {{ countTotal.workMoney }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对公返点：">
            {{ countTotal.discount }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="对私返点：">
            {{ countTotal.discountPrivate }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="折扣金额：">
            {{ countTotal.rebateMoney }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抖+成本：">
            {{ countTotal.douMoney }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台手续费：">
            {{ countTotal.platMoney }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="其他成本：">
            {{ countTotal.otherMoney }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售成本：">
            {{ countTotal.costMoney }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行金额：" :class="{'tip-red': countTotal.executeMoney < 0}">
            {{ countTotal.executeMoney }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达人分成成本：">
            {{ countTotal.allOutMoney }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="绩效营收：" :class="{'tip-red': countTotal.executeMoney < 0}">
            {{ countTotal.performanceMoney }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="线下补款：">
            <el-input-number
              v-if="diaLogType === 'edit' && hasEditRight"
              v-model="formData.offlineAddMoney"
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
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="上传收款截图">
            <UploadImg v-model="formData.collectionScreenshotList" :limit="3" :disabled="diaLogType !== 'edit' || !hasEditRight" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData.accountType === 5">
        <el-col :span="12">
          <el-form-item label-width="140px" label="媒介返点收款时间：">
            <el-date-picker
              v-if="diaLogType === 'edit' && hasEditRight"
              v-model="formData.intermediaryRebateTime"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
            <template v-else>{{ formData.intermediaryRebateTime }}</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="140px" label="媒介返点收款方式：">
            <el-select
              v-if="diaLogType === 'edit' && hasEditRight"
              v-model="formData.intermediaryRebateMode"
              placeholder="媒介返点收款方式"
            >
              <el-option
                v-for="item in intermediaryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <template v-else>
              {{ formData.intermediaryRebateMode }}
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-form-item label="绩效月：" prop="monthMoneyNew">
          <el-date-picker
            v-if="diaLogType === 'edit' && hasEditRight"
            v-model="formData.monthMoneyNew"
            type="month"
            value-format="yyyy-MM"
          />
          <template v-else>
            {{ formData.monthMoneyNew }}
          </template>
        </el-form-item>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="已付客户返点：" prop="customerRebatePaid">
            <el-input-number
              v-if="diaLogType === 'edit' && $permission('rebates_paid')"
              v-model="formData.customerRebatePaid"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>
              {{ formData.customerRebatePaid }}
            </template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="已付客户返点：该工单公司已实际支付给客户的返点金额，由财务人员录入。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="财务是否核账：">
            <el-radio-group v-if="diaLogType === 'edit' && $permission('workorder_financial')" v-model="formData.reconciliationStatus">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是，已到账</el-radio>
            </el-radio-group>
            <template v-else>
              {{ formData.reconciliationStatus === 1 ? '是，已到账' : '否' }}
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="是否已开发票：">
          <el-radio-group v-if="diaLogType === 'edit' && $permission('is_invoice')" v-model="formData.receiptStatus">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
          <template v-else>
            {{ formData.receiptStatus === 1 ? '是' : '否' }}
          </template>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="OA合同编号:">
            {{ formData.oaContractNo|emptyFill }}
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <OrderRemind v-if="$permission('order_remind')" ref="orderRemind" type="0" :work-id="workId" /> -->

      <el-row>
        <el-form-item label="备注：">
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
        </el-form-item>
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
    <VideoDialog
      v-if="showVideoDialog"
      v-model="showVideoDialog"
      :plat-id="formData.platId"
      :account-id="formData.accountId"
      :selected-video="formData.video"
      :support-multi-video-flag="accountType === 2 && +formData.versionNum ? 0 : supportMultiVideoFlag"
      @success="handleChangeVideo"
    />
  </el-dialog>
</template>
<script>
import { defineComponent, computed, getCurrentInstance, ref, defineAsyncComponent, reactive, toRefs } from '@vue/composition-api'
import { useToggle } from '@/hook/index'
import { IconTip, UploadImg, OrderRemind } from 'components'
import { $getWorkerOrderInfo, $updateWorkerOrderInfo, $sendFinancialReminder } from '@/api/bussiness-manage'
import { copy } from '@/utils'
import { isNumber } from 'axios/lib/utils'

const useVideoDiaLog = function(formData, props) {
  const showVideoDialog = ref(false)
  // 删除视频
  const handleDelVideo = (index) => {
    formData.value.video.splice(index, 1)
  }

  const handleShowVideoDialog = () => {
    showVideoDialog.value = true
  }

  const handleChangeVideo = (selectVideo) => {
    if (props.accountType === 2 && +formData.value.versionNum) {
      formData.value.video = selectVideo.value.map((item, index) => ({
        collectionDate: formData.value.video[index].collectionDate,
        platTaskId: formData.value.video[index].platTaskId,
        flowMoney: formData.value.video[index].flowMoney,
        outMoney: formData.value.video[index].outMoney,
        otherMoney: formData.value.video[index].otherMoney,
        douMoney: formData.value.video[index].douMoney,
        platMoney: formData.value.video[index].platMoney,
        discount: formData.value.video[index].discount,
        discountPrivate: formData.value.video[index].discountPrivate,
        rebateMoney: formData.value.video[index].rebateMoney,
        intermediaryDiscount: formData.value.video[index].intermediaryDiscount,
        rebate: formData.value.video[index].rebate,
        platPrice: formData.value.video[index].platPrice,
        ...item
      }))
    } else {
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
    workId: Number,
    accountType: {
      type: Number,
      default: 0
    }
  },

  components: {
    IconTip,
    UploadImg,
    OrderRemind,
    VideoDialog: defineAsyncComponent(() => import('./videoListDialog.vue'))
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
    const hasEditRight = computed(() => {
      return $permission('middleground') && RECONCILIATION_STATUS.value === 0
    })

    const formData = ref({})
    const loading = ref(true)

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
          title: '撤单'
        }
      ]
    })

    const getFormData = () => {
      $getWorkerOrderInfo({ workId: props.workId }).then(res => {
        if (res.code === 1 && res.data) {
          try {
            res.data.briefs = JSON.parse(res.data.briefs)
          } catch (err) {
            console.log(err)
          }

          res.data._isOver = res.data.isOver === 1
          res.data.monthMoneyNew = res.data.monthMoneyNew || undefined
          res.data.collectionScreenshotList = res.data.collectionScreenshotList || []
          const item = {
            collectionDate: '',
            discount: 0,
            discountPrivate: 0,
            douMoney: 0,
            flowId: 0,
            flowMoney: null,
            intermediaryDiscount: 0,
            otherMoney: 0,
            outMoney: res.data.accountType === 5 ? res.data.platPrice || 0 : 0,
            platMoney: 0,
            platPrice: res.data.platPrice || 0,
            platTaskId: '',
            rebate: res.data.accountType === 5 ? res.data.rebate : null,
            rebateMoney: 0,
            titleName: '',
            url: '',
            videoCoverUrl: null,
            workId: null
          }
          // 新海盗工单
          if (props.accountType === 2 && +res.data.versionNum && !res.data.video.length) {
            res.data.video = [item]
          }
          const video = res.data.video ? res.data.video : []
          if (video.length > 0 && (video[0].flowMoney === null || video[0].flowMoney === undefined)) {
            delete video[0].flowMoney
          }
          formData.value = res.data
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

    const countCost = (obj) => {
      return ['discount', 'discountPrivate', 'rebateMoney', 'douMoney', 'platMoney', 'otherMoney'].reduce((t, n) => {
        t += obj[n] || 0
        return t
      }, 0)
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
        // 销售成本 = 对公返点 + 对私返点 + 折扣金额 + 抖+成本 + 平台手续费 + 其他成本
        countResult.costMoney = countCost(countResult)
        // 执行金额 = 销售收入 - 销售成本
        countResult.executeMoney = countResult.workMoney - countResult.costMoney
        // 绩效营收 = 执行金额 - 达人分成成本
        countResult.performanceMoney = countResult.executeMoney - countResult.allOutMoney

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
      flowMoney: [{
        required: true,
        trigger: 'change',
        validator: (rule, value, callback) => {
          if (formData.value.video[0].flowMoney === undefined || formData.value.video[0].flowMoney === null) {
            callback(new Error('销售收入不能为空'))
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
      // try {
      //   await checkRule()
      // } catch (e) {
      //   if ($refs.orderRemind.$refs.orderRemindForm) {
      //     await $refs.orderRemind.$refs.orderRemindForm.validate()
      //   }
      //   return
      // }

      // if ($refs.orderRemind.$refs.orderRemindForm) {
      //   await $refs.orderRemind.$refs.orderRemindForm.validate()
      // }
      await checkRule()
      btnLoading.value = true

      const data = copy(formData.value)
      // if (data.monthMoneyNew === undefined) {
      //   data.monthMoneyNew = 0
      // }
      if (data.customerRebatePaid === undefined) {
        data.customerRebatePaid = 0
      }

      // if ($refs.orderRemind.$refs.orderRemindForm) {
      //   const { reminderUserBOS, msg } = $refs.orderRemind.form
      //   data.feishuMsgSendRequest = {
      //     workId: props.workId,
      //     reminderUserBOS,
      //     msg
      //   }
      // }

      $updateWorkerOrderInfo(data).then((res) => {
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

    const { showVideoDialog, handleShowVideoDialog, handleDelVideo, handleChangeVideo: handleChangeVideoCallBreak } = useVideoDiaLog(formData, props)

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

    const handleDeleteVideo = () => {
      const video = [...formData.value.video]
      video[0].url = ''
      video[0].titleName = ''
      video[0].flowId = 0
      formData.value.video = video
    }

    return {
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
      handleDeleteVideo,
      supportMultiVideoFlag,
      ...toRefs(data)
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
    background-color: #eee;
    padding: 20px 0;
    margin: 20px 0;
    max-height: 366px;
    overflow: auto;
    ::v-deep {
      .iconfont {
        margin-left: 5px;
      }
    }
  }
  .video-form {
    padding-left: 2px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .video-form-item {
    display: flex;
    align-items: center;
    width: 33%;
    margin-bottom: 5px;
    &-label {
      flex-shrink: 0;
      width: 100px;
      display: inline-block;
      text-align: right;
    }
    &-value {
      width: auto;
      text-align: left !important;
    }
    .el-input-number, .el-input {
      width: 140px;
    }
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

.deleteButton {
  color: #ff0000;
  margin-left: 10px;
}

.video-content {
    background-color: #eee;
    padding: 20px 0;
    margin: 20px 0;
    max-height: 366px;
    overflow: auto;
    ::v-deep {
      .iconfont {
        margin-left: 5px;
      }
    }

    .video-content-title {
      padding: 0px 12px 20px;
      margin-bottom: 16px;
      border-bottom: 1px solid #ccc;
      display: flex;
      justify-content: space-between;
    }
  }
  .video-form {
    padding-left: 2px;
    margin-bottom: 20px;
    padding: 0 12px;

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
    }
    &-value {
      width: auto;
      text-align: left !important;
    }
    .el-input-number, .el-input {
      width: 140px;
    }
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

.m-l-8 {
  margin-left: 8px;
}

.m-l-0 {
  margin-left: 0 !important;
  vertical-align: -1px;
}

::v-deep {
  .rebate {
    .iconfont {
      margin-left: 0 !important;
    }
  }

  .oldVideoForm {
    .el-form-item {
      margin-bottom: 0px;
    }

    .el-form-item__label {
      width: 100px !important;
      padding: 0;
    }

    .el-form-item__content {
      margin-left: 100px !important;
    }
  }
}
</style>
