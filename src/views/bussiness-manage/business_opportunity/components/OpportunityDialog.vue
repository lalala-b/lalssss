<template>
  <el-dialog
    :visible="show"
    :title="dialogTitle"
    :close-on-click-modal="isOnlyShow ? true : false"
    width="1100px"
    @close="handleClose"
  >
    <!-- 新增编辑区域 -->
    <el-form
      v-show="!isOnlyShow"
      ref="showForm"
      v-loading="loading"
      class="modal-form"
      label-position="right"
      :rules="addRules"
      :model="showForm"
      :scroll-to-error="true"
      label-width="160px"
      :validate-on-rule-change="false"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择客户联系人" prop="customerId">
            <el-select
              v-model="showForm.customerId"
              filterable
              placeholder="请选择客户联系人"
              class="m-r-10"
              @change="customChange"
            >
              <el-option
                v-for="item in formItemMap.selfCustomerNameAndIdBOList"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId"
              />
            </el-select>
            <el-button size="small" type="primary" @click="toAddClient">去新增联系人</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户">
            {{ showForm.companyName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-popover
            v-show="type!=='add' && showForm.refundRatio && !showForm.selfRatio && !showForm.signRatio"
            placement="top"
            width="300"
            trigger="hover"
            content="该字段已废弃，请填写自营返点比例与签约返点比例"
          >
            <el-form-item slot="reference" label="返点比例" prop="refundRatio">
              <el-input :value="showForm.refundRatio ? showForm.refundRatio.toString().indexOf('%')===-1 ? showForm.refundRatio+'%' : showForm.refundRatio : ''" disabled />
            </el-form-item>
          </el-popover>

          <el-form-item label="自营返点比例" prop="selfRatio">
            <el-input-number
              v-model="showForm.selfRatio"
              placeholder="请输入数值"
              :max="customerInfo.selfMax"
              :min="customerInfo.selfMin || 0"
              :precision="2"
            /> %
          </el-form-item>
          <el-form-item label="签约返点比例" prop="signRatio">
            <el-input-number
              v-model="showForm.signRatio"
              placeholder="请输入数值"
              :max="customerInfo.signMax"
              :min="customerInfo.signMin || 0"
              :precision="2"
            /> %
          </el-form-item>
          <el-form-item label="是否新客户" prop="isNewCustomerFlag">
            <el-select v-model="showForm.isNewCustomerFlag">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brandIds">
            <Select
              v-model="showForm.brandIds"
              class="brandSelect"
              :config="brandConfig"
            />
            <IconTip
              type="popover"
              content="若未能找到对应的品牌，请进入客户联系人管理-对应的客户详情页中添加新品牌"
              icon-class="iconwenhao"
            />
            <el-button type="text" @click="showAddBrandConfirm = showAddBrandConfirm ? false : true">
              新增品牌
            </el-button>
          </el-form-item>
          <el-form-item v-if="showAddBrandConfirm">
            <div class="addBrandBox">
              <el-input v-model="addBrandInput" class="addInput" placeholder="请输入新增品牌的名称" />
              <el-button type="primary" :loading="addLoading" @click="handleAddBrand">添加</el-button>
              <span v-show="showAddError" class="error">该品牌已存在</span>
            </div>
          </el-form-item>
          <el-form-item label="需求描述" prop="requirementDesc">
            <textarea
              v-model.lazy="showForm.requirementDesc"
              maxlength="200"
              class="el-textarea__inner"
              placeholder="请输入需求描述"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="商机优质度" prop="opportunityQuality">
            <el-select v-model="showForm.opportunityQuality" clearable>
              <el-option v-for="item in opportunityQualityData" :key="item.id" :label="item.val" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户联系人负责的行业">
            {{ showForm.fieldName || '--' }}
          </el-form-item>
          <el-form-item label="商务人员">
            {{ type === 'add' ? users.userInfo.realname : showForm.businessUserName }}
          </el-form-item>

          <!-- <el-form-item
            label="访问时间"
          >
            {{ type === 'add' ? nowTime : showForm.inquireTime }}
          </el-form-item> -->
          <el-form-item
            label="合作状态"
          >
            {{ type === 'add' ? '等待结果' : STATUS_ARR[showForm.coopStatus] || '--' }}
            <el-button
              v-if="+showForm.coopStatus === 1"
              type="text"
              class="deleteButton"
              @click="handleRepeal"
            >
              撤销合作
            </el-button>
          </el-form-item>
          <el-form-item
            label="自营返点区间"
          >
            {{ customerInfo.selfMin || 0 }} ~ {{ customerInfo.selfMax || 0 }} %
          </el-form-item>
          <el-form-item
            label="签约返点区间"
          >
            {{ customerInfo.signMin || 0 }} ~ {{ customerInfo.signMax || 0 }} %
          </el-form-item>
          <el-form-item
            v-show="type !== 'add'"
            label="商机创建人"
          >
            {{ showForm.createName ? showForm.createName : '--' }}
          </el-form-item>
          <el-form-item
            v-show="type !== 'add'"
            label="商机创建时间"
          >
            {{ showForm.createTime }}
          </el-form-item>
        </el-col>
      </el-row>
      <!--  <el-row>
         <el-col :span="12">
          <el-form-item label="签约返点比例" prop="signRefundRatio">
            <el-input-number
              v-model="showForm.signRatio"
              placeholder="请输入数值"
              :max="customerInfo.signMax"
              :min="customerInfo.signMin"
              :precision="2"
            /> %
          </el-form-item>
          <el-form-item label="是否新客户" prop="isNewCustomerFlag">
            <el-select v-model="showForm.isNewCustomerFlag">
              <el-option label="否" :value="0" />
              <el-option label="是" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌" prop="brandIds">
            <Select
              v-model="showForm.brandIds"
              class="brandSelect"
              :config="{
                type: 'select',
                key: 'brandId',
                data: formItemMap.brandInfoList || [],
                conf: {
                  placeholder: '请选择品牌',
                  filterable: true,
                  clearable: true
                },
                optionValKey: 'id',
                optionLabelKey: 'newsContent'
              }"
            />
            <IconTip
              type="popover"
              content="若未能找到对应的品牌，请进入客户联系人管理-对应的客户详情页中添加新品牌"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商务人员">
            {{ type === 'add' ? users.userInfo.realname : showForm.businessUserName }}
          </el-form-item>

          <el-form-item
            label="访问时间"
          >
            {{ type === 'add' ? nowTime : showForm.inquireTime }}
          </el-form-item>
          <el-form-item
            label="合作状态"
          >
            {{ type === 'add' ? '等待结果' : STATUS_ARR[showForm.coopStatus] || '--' }}
            <el-button
              v-if="+showForm.coopStatus === 1"
              type="text"
              class="deleteButton"
              @click="handleRepeal"
            >
              撤销合作
            </el-button>
          </el-form-item>
        </el-col>
      </el-row> -->
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="需求描述" prop="requirementDesc">
            <el-input
              v-model="showForm.requirementDesc"
              maxlength="200"
              class="requirementDesc"
              type="textarea"
              placeholder="请输入需求描述"
              show-word-limit
            />
          </el-form-item>
          <el-form-item label="商机优质度" prop="opportunityQuality">
            <el-select v-model="showForm.opportunityQuality" clearable>
              <el-option v-for="item in opportunityQualityData" :key="item.id" :label="item.val" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="自营返点区间"
          >
            {{ customerInfo.selfMin }} ~ {{ customerInfo.selfMax }} %
          </el-form-item>
          <el-form-item
            label="签约返点区间"
          >
            {{ customerInfo.signMin }} ~ {{ customerInfo.signMax }} %
          </el-form-item>
          <el-form-item
            label="创建人"
          >
            {{ customerInfo.creaetName ? customerInfo.creaetName : '--' }}
          </el-form-item>
          <el-form-item
            label="创建时间"
          >
            {{ customerInfo.createTime }}
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row class="row">
        <el-col class="rowItem" :span="12">
          <el-form-item label="订单类型">视频工单</el-form-item>
          <el-form-item label="推荐账号">
            <el-row type="flex" justify="space-between">
              <el-col :span="10">
                <el-select v-model="platId" filterable placeholder="选择平台" @change="setAccountOptions">
                  <el-option
                    v-for="item in formItemMap.mngPlatInfoVOList"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  />
                </el-select>
              </el-col>
              <el-col :span="10">
                <Select v-model="accountId" :config="accountMap" />
                <!-- <el-select v-model="accountId" filterable placeholder="选择账号">
                  <el-option
                    v-for="item in accountOptions"
                    :key="item.accountId"
                    :label="item.accountName"
                    :value="item.accountId"
                  />
                </el-select> -->
              </el-col>
              <el-col :span="3">
                <el-button size="small" type="primary" @click="addAccount">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="批量导入账号">
            <div class="flex-row">
              <el-link href="/api/business/order/downloadErrAccountData?type=1" type="primary" target="_blank" class="m-r-10">下载导入模版</el-link>
              <!-- /api/business/order/uploadAccountData?opportunityId=  有值做编辑态处理 实时加入 -->
              <el-upload
                accept=".xls,.xlsx"
                :with-credentials="true"
                :before-upload="beforeUploadAccount"
                :on-success="uploadAccountSuccess"
                :on-error="uploadAccountError"
                :action="`/api/business/order/uploadAccountData?opportunityId=${opportunityId}`"
                name="file"
                :show-file-list="false"
              >
                <el-button v-loading="uploadAccountLoading" size="small" type="primary">批量导入推荐账号</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="已选中推荐账号">
            <div class="max-height-156">
              <el-tag
                v-for="(item, index) in accountTags"
                :key="index"
                closable
                class="account-tag"
                @close="handleTagClose(index, item)"
              >{{ item.name }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col class="rowItem" :span="12">
          <el-form-item label="订单类型">
            特殊工单
          </el-form-item>
          <el-form-item label="合作类型">
            <el-select v-model="specialData.coopType">
              <el-option label="代运营" value="代运营" />
              <el-option label="直播" value="直播" />
              <el-option label="图文" value="图文" />
              <el-option label="转发" value="转发" />
              <el-option label="代制作" value="代制作" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="推荐账号">
            <el-row class="m-b-10">
              <el-col class="m-r-10" :span="7">
                <el-select
                  v-model="specialData.orgType"
                  filterable
                  clearable
                  placeholder="请选择部"
                  @change="handleOrgChange"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.orgId"
                    :label="item.orgName"
                    :value="item.orgId"
                  />
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-select
                  v-model="specialData.businessGroup"
                  filterable
                  clearable
                  placeholder="请选择军/工作室"
                  @change="setBusinessUser"
                >
                  <el-option
                    v-for="item in businessGroup"
                    :key="item.id"
                    :label="item.orgName"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="m-r-10" :span="7">
                <el-select v-model="specialData.businessUser" filterable clearable placeholder="选择创作者" @change="handleChangeBusinessUser">
                  <el-option
                    v-for="item in businessUser"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col class="m-r-10" :span="6">
                <el-select v-model="specialData.platId" filterable clearable placeholder="平台" @change="handleChangePlat">
                  <el-option
                    v-for="item in formItemMap.mngPlatInfoVOList"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  />
                </el-select>
              </el-col>
              <el-col class="m-r-10" :span="6">
                <el-input
                  v-model="specialData.accountName"
                  class="account-input"
                  filterable
                  placeholder="选择账号"
                  maxlength="15"
                />
              </el-col>
              <el-col :span="3">
                <el-button size="small" type="primary" @click="addSpecialAccount">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="已选中推荐账号">
            <div class="max-height-156">
              <el-tag
                v-for="(item, index) in specialNews"
                :key="index"
                closable
                class="account-tag"
                @close="handleSpecialTagClose(index, item)"
              >{{ item.text }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="最终合作账号">
          <span>
            {{ (showForm.finalCooperateAccounts || []).map(item => item.accountName).join(', ') }}
            <el-button
              v-if="type === 'edit' && +showForm.coopStatus"
              type="text"
              class="m-r-8"
              @click="handleEditFinalAccount"
            >
              编辑
            </el-button>
          </span>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="备注">
          <el-input
            v-model="showForm.note"
            type="textarea"
            placeholder="请输入需攻克的难点/所需的支持"
          />
        </el-form-item>
      </el-row>
    </el-form>

    <!--查看区域-->
    <div v-show="isOnlyShow" v-loading="loading" class="show-view">
      <el-form>
        <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item label="客户联系人:">{{ showForm.customerName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户:">{{ showForm.companyName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item v-if="(!showForm.selfRatio || !showForm.signRatio) && showForm.refundRatio" style="color:red">
              <div slot="label">
                <span style="color:red">返点比例:</span>
              </div>
              {{ showForm.refundRatio ? showForm.refundRatio.toString().indexOf('%')===-1 ? showForm.refundRatio : showForm.refundRatio.split('%')[0] : '' }}%（已作废，请更新该联系人的自营，签约返点比例）</el-form-item>
            <el-form-item label="自营返点比例:">{{ showForm.selfRatio ? `${showForm.selfRatio}%` : '' }}</el-form-item>
            <el-form-item label="签约返点比例:">{{ showForm.signRatio ? `${showForm.signRatio}%` : '' }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户联系人负责的行业:">{{ showForm.fieldName || '--' }}</el-form-item>
            <el-form-item label="商务人员:">{{ showForm.businessUserName }}</el-form-item>
            <!-- <el-form-item label="访问时间:">{{ showForm.inquireTime }}</el-form-item> -->
            <el-form-item
              label="合作状态:"
            >{{ STATUS_ARR[showForm.coopStatus] || '--' }}</el-form-item>
          </el-col>
        </el-row>
        <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item label="是否新客户:">{{ +showForm.isNewCustomerFlag === 1 ? '是' : '否' }}</el-form-item>
            <el-form-item label="品牌:">{{ showForm.brandIds }}</el-form-item>
            <el-form-item label="需求描述:">{{ showForm.requirementDesc }}</el-form-item>
            <el-form-item label="商机优质度:">{{ (opportunityQualityData.find(item => +item.id === +showForm.opportunityQuality) || {}).val || '--' }}</el-form-item>
            <el-form-item label="推荐视频工单账号:">{{ (accountTags || []).map(item => item.name).join(',') }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- <el-form-item label="商务人员:">{{ showForm.businessUserName }}</el-form-item>
            <el-form-item label="访问时间:">{{ showForm.inquireTime }}</el-form-item> -->
            <el-form-item
              label="自营返点区间:"
            >{{ customerInfo.selfMin || 0 }} ~ {{ customerInfo.selfMax || 0 }}%</el-form-item>
            <el-form-item
              label="签约返点区间:"
            >{{ customerInfo.signMin || 0 }} ~ {{ customerInfo.signMax || 0 }}%</el-form-item>
            <el-form-item
              label="商机创建人:"
            >{{ showForm.createName || '--' }}</el-form-item>
            <el-form-item
              label="商机创建时间:"
            >{{ showForm.createTime }}</el-form-item>
            <el-form-item label="推荐特殊工单账号:">{{ showForm.specialNewsText }}</el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item label="需求描述:">{{ showForm.requirementDesc }}</el-form-item>
            <el-form-item label="商机优质度:">{{ (opportunityQualityData.find(item => +item.id === +showForm.opportunityQuality) || {}).val || '--' }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="合作状态:"
            >{{ STATUS_ARR[showForm.coopStatus] || '--' }}</el-form-item>
          </el-col>
        </el-row> -->

        <!-- <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item label="推荐视频工单账号:">{{ (accountTags || []).map(item => item.name).join(',') }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推荐特殊工单账号:">{{ showForm.specialNewsText }}</el-form-item>
          </el-col>
        </el-row> -->
        <el-row class="row">
          <el-col :span="12" class="row-col">
            <el-form-item label="最终合作账号:">
              <span>
                {{ (showForm.finalCooperateAccounts || []).map(item => item.accountName).join(', ') }}
              </span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="row">
          <el-col :span="12">
            <el-form-item label="备注:">
              <p v-html="showForm.note" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="最近编辑时间:">{{ (showForm.addTime * 1000) | date }}</el-form-item>
          </el-col> -->
        </el-row>
      </el-form>
    </div>

    <span v-show="!isOnlyShow" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="addConfirm">确 定</el-button>
    </span>

    <ReasonDialog
      :data="data"
      type="confirm"
      :show="showReasonDialog"
      @close="showReasonDialog = false"
      @getList="handleSubmit"
    />

    <FinalAccountDialog
      :data="data"
      type="confirm"
      :show="showFinalDialog"
      :select-arr="showForm.finalCooperateAccounts"
      :delete-arr="deleteIds"
      @close="showFinalDialog = false"
      @getList="handleSubmit"
      @choose="handleChoose"
    />
  </el-dialog>
</template>
<script>
import {
  $getOpportunityInfo,
  $addOpportunity,
  $getAccountAndPlatInfo,
  $getTeamAndMember,
  $updateOpportunity,
  $getCustomerGetCompany,
  $saveRecommendAccount,
  $getSelfCustomerList,
  $addBaseCustomerInfo
} from '@/api/bussiness-manage'
import { $getByConfigCode, $getNextOrgInfo } from '@/api/index'
import { $getCustomerInfo } from '@/api/bussiness-manage'
import dayjs from 'dayjs'
import { copy } from '@/components/common'
import { unique } from '@/utils'
import { IconTip, Select } from 'components'
import ReasonDialog from './ReasonDialog.vue'
import FinalAccountDialog from './FinalAccountDialog.vue'

// 公司主体
const COMPANY_TYPE = [
  {
    val: 1,
    text: '乾派'
  },
  {
    val: 2,
    text: '向乾'
  }
]

const SHOW_DATA = {
  customerId: '',
  quotientName: '',
  accountIds: '',
  note: '',
  companyName: '',
  fieldName: '',
  fieldId: '',
  opportunityQuality: '',
  isNewCustomerFlag: '',
  businessUserId: '',
  businessUserName: '',
  finalCooperateAccounts: [],
  selfRatio: undefined,
  signRatio: undefined
}

export default {
  components: {
    ReasonDialog,
    Select,
    FinalAccountDialog,
    IconTip
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    normalFormItemMap: {
      type: Object,
      default() {
        return {}
      }
    },
    opportunityId: {
      type: Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      nowTime: '',
      COMPANY_TYPE,
      STATUS_ARR: ['等待结果', '确认合作', '暂不合作'],
      orgList: [],
      showForm: {
      },
      addRules: {
        selfRatio: [{ required: true, message: '请输入自营返点比例', trigger: ['change', 'blur'] }],
        signRatio: [{ required: true, message: '请输入签约返点比例', trigger: ['change', 'blur'] }],
        requirementDesc: [{ required: true, message: '请输入需求描述', trigger: 'blur' }],
        // isNewCustomerFlag: [{ required: true, message: '请选择是否新客户', trigger: ['change', 'blur'] }],
        brandIds: [{ required: true, message: '请选择品牌', trigger: ['change', 'blur'] }],
        // opportunityQuality: [{ required: true, message: '请选择商机优质度', trigger: ['change', 'blur'] }],
        customerId: [{ required: true, message: '请选择客户联系人', trigger: ['change', 'blur'] }]
      },
      accountTags: [],
      accountOptions: [],
      accountMap: {
        data: [],
        conf: {
          placeholder: '请选择客户',
          filterable: true
        },
        optionValKey: 'accountId',
        optionLabelKey: 'accountName'
      },
      specialData: {
        orgType: '',
        orgName: '',
        coopType: '',
        businessGroup: '',
        businessGroupName: '',
        businessUser: '',
        businessUserName: '',
        platId: '',
        platName: '',
        accountName: ''
      },
      businessGroup: [],
      businessUser: [],
      platId: '',
      accountId: '',
      uploadAccountLoading: false,
      uploadUrl: '',
      uploadAccountUrl: '',
      quotientTypeList: [],
      workCooperationType: [],
      brandTags: [],
      specialNews: [],
      loading: false,
      btnLoading: false,
      formItemMap: {
        mngPlatInfoVOList: [],
        industryTypeTags: [],
        executorInfoBOList: [],
        executeGroupInfoBOList: [],
        customerNameAndIdBOList: [],
        selfCustomerNameAndIdBOList: [],
        brandInfoList: []
      },
      showReasonDialog: false,
      showFinalDialog: false,
      deleteIds: [],
      opportunityQualityData: [
        {
          id: 0,
          val: '低'
        },
        {
          id: 1,
          val: '中'
        },
        {
          id: 2,
          val: '高'
        }
      ],
      customerInfo: {},
      showAddBrandConfirm: false,
      addLoading: false,
      showAddError: false,
      addBrandInput: '',
      brandConfig: {
        type: 'select',
        key: 'brandId',
        data: [],
        conf: {
          placeholder: '请选择品牌',
          filterable: true,
          clearable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'newsContent'
      }
    }
  },
  computed: {
    isOnlyShow() {
      return this.type === 'detail'
    },
    dialogTitle() {
      return this.type === 'detail'
        ? '查看详情'
        : (this.type === 'add' ? '新增' : '编辑')
    },
    users() {
      return {
        userInfo: this.$store.state.user.userInfo
      }
    }
  },
  watch: {
    normalFormItemMap: {
      handler(nVal, oVal) {
        if (nVal) {
          for (const key in this.normalFormItemMap) {
            this.formItemMap[key] = copy(this.normalFormItemMap[key].data)
          }
          this.formItemMap.executorInfoBOList = (this.formItemMap.executorInfoBOList || []).filter(item => item.userStatus === 1)
          this.brandConfig.data = this.formItemMap.brandInfoList || []
        }
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    this.getSelfCustomerList()
    this.getAccountAndPlatInfo()
    this.getTeamAndMember()
    this.getBConfigByCode()
    this.getOrgInfo()
    this.getTime()
  },
  methods: {
    async getSelfCustomerList() {
      try {
        const { code, data } = await $getSelfCustomerList()
        if (+code === 1) {
          this.formItemMap.selfCustomerNameAndIdBOList = data || []
        }

        this.$nextTick(() => {
          this.hanleOpenForm()
        })
      } catch (e) {
        this.hanleOpenForm()
      }
    },
    getTime() {
      this.nowTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    clearValidate(fieldNames) {
      this.$refs.showForm?.clearValidate(fieldNames)
    },
    openUrl(url) {
      window.open(url)
    },
    // 获取对应联系人的客户信息
    getCustomerInfo(customerId) {
      $getCustomerInfo({ customerId }).then(res => {
        if (res.code === 1) {
          this.customerInfo = res.data
        }
      })
    },
    // 获取乾派、海盗组织
    getOrgInfo(orgId = 0) {
      $getNextOrgInfo({ orgId }).then(res => {
        if (res.code === 1) {
          this.orgList = res.data
        }
      })
    },
    // 获取商单类型、合作类型
    getBConfigByCode() {
      const configCodes = ['business_manager_quotient_type', 'business_manager_special_work_cooperation_type']
      $getByConfigCode({ configCodes: configCodes.join(',') }).then(res => {
        if (res.code === 1) {
          this.workCooperationType = res.data.business_manager_special_work_cooperation_type || []
        } else {
          // this.$message.error()
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
      })
    },
    hanleOpenForm() {
      if (this.opportunityId) {
        this.getOpportunityInfo(this.opportunityId)
      } else {
        this.showForm = copy(SHOW_DATA)
      }
    },
    getOpportunityInfo(opportunityId) {
      this.loading = true
      $getOpportunityInfo({
        opportunityId
      }).then((res) => {
        if (res.code === 1) {
          this.processshowFormData(res.data)
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 处理回显数据
    processshowFormData(rowData) {
      if (rowData.flowWorkInfoBOS) {
        this.accountTags = rowData.flowWorkInfoBOS.map(item => {
          return {
            ...item,
            name: `${item.platName}-${item.accountName}`
          }
        })
      }
      // if (rowData.customerId) {
      //   this.getBrandInfo(rowData.customerId)
      // }

      if (rowData.specialWorkInfoBOS) {
        this.specialNews = rowData.specialWorkInfoBOS.map(item => {
          return {
            ...item,
            businessGroup: item.orgDId,
            businessGroupName: item.orgDName,
            businessUser: item.creatorId,
            businessUserName: item.creatorName,
            text: `${item.coopType}-${item.orgDName}-${item.creatorName}-${item.platName}-${item.accountName}`
          }
        })
        rowData.specialNewsText = rowData.specialWorkInfoBOS.map(item => {
          return {
            ...item,
            businessGroup: item.orgDId,
            businessGroupName: item.orgDName,
            businessUser: item.creatorId,
            businessUserName: item.creatorName,
            text: `${item.coopType}-${item.orgDName}-${item.creatorName}-${item.platName}-${item.accountName}`
          }
        }).map(item => (item.text)).join(',')
      }

      // 固化客户联系人
      if (rowData.customerId) {
        const list = [...this.formItemMap.selfCustomerNameAndIdBOList]
        const index = list.findIndex(item => +item.customerId === +rowData.customerId)
        list.splice(index, 1, { customerId: rowData.customerId, customerName: rowData.customerName })
        this.formItemMap.selfCustomerNameAndIdBOList = list

        this.getCustomerInfo(rowData.customerId)
      }

      if (this.type === 'edit') {
        // 品牌多选
        // rowData.brandIds = (rowData.brandInfoBOList || []).map(item => +item.brandId)
        rowData.brandIds = ((rowData.brandInfoBOList || [])[0] || {}).brandId || ''
      } else if (this.type === 'detail') {
        rowData.brandIds = (rowData.brandInfoBOList || []).map(item => item.brandName).join(', ')
      }

      rowData.selfRatio = rowData.selfRatio ? rowData.selfRatio : undefined
      rowData.signRatio = rowData.signRatio ? rowData.signRatio : undefined

      this.showForm = rowData
      // console.log(this.showForm, 'showForm')
    },
    // 获取品牌
    // getBrandInfo(customerId) {
    //   if (!customerId) return
    //   $getBrandInfoByCustomerId({ customerId }).then((res) => {
    //     if (res.code === 1) {
    //       this.brandTags = res.data
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    // 海盗、乾派切换
    handleOrgChange(orgId) {
      this.specialData.orgName = (this.orgList.find(item => +item.orgId === +orgId) || {}).orgName
      this.businessGroup = []
      this._businessUser = []
      this.businessUser = []
      this.specialData.businessGroup = ''
      this.specialData.businessGroupName = ''
      this.specialData.businessUser = ''
      this.specialData.businessUserName = ''

      if (orgId) {
        this.getTeamAndMember(orgId)
      }
    },
    // 获取平台及账号
    getAccountAndPlatInfo() {
      $getAccountAndPlatInfo().then((res) => {
        if (res.code === 1) {
          this.formItemMap.mngPlatInfoVOList = res.data.mngPlatInfoVOList || []
          this.formItemMap.simpleAccountBOList = res.data.simpleAccountBOList || []
        }
      }).catch(err => {})
    },
    // 获取分组及创作者
    getTeamAndMember(orgId) {
      $getTeamAndMember({ orgId }).then((res) => {
        if (res.code === 1) {
          this.businessGroup = res.data.organizationInfoList
          this._businessUser = res.data.simpleUserInfoVOList
        }
      })
    },
    // 新增、编辑确定
    addConfirm() {
      this.$refs['showForm'].validate((v) => {
        if (v) {
          let data = copy(this.showForm)
          this.btnLoading = true

          data = {
            ...data,
            businessUserId: this.opportunityId ? data.businessUserId : this.users.userInfo.id,
            businessUserName: this.opportunityId ? data.businessUserName : this.users.userInfo.realname,
            inquireTime: this.nowTime,
            idList: data.finalCooperateAccounts.map(item => item.id),
            flowWorkInfoBOS: this.accountTags,
            specialWorkInfoBOS: this.specialNews.map(({
              accountName,
              businessGroup,
              businessGroupName,
              businessUser,
              businessUserName,
              coopType,
              orgName,
              orgType,
              platId,
              platName,
              id
            }) => {
              return {
                accountName,
                orgDId: businessGroup,
                orgDName: businessGroupName,
                orgType,
                creatorId: businessUser,
                creatorName: businessUserName,
                platId,
                platName,
                id,
                coopType: this.workCooperationType.find(item => item.configName === coopType).configName
              }
            })
          }

          if (this.opportunityId) {
            data.opportunityId = this.opportunityId
            data.specialWorkInfoBOS = data.specialWorkInfoBOS.map(item => ({
              ...item,
              opportunityId: this.opportunityId
            }))
          }

          // 品牌多选
          // data.brandInfoBOList = (data.brandIds || []).map(item => {
          //   return {
          //     brandId: item,
          //     brandName: (((this.formItemMap || {}).brandInfoList || []).find(it => +it.id === +item) || {}).newsContent
          //   }
          // })

          data.fieldId = this.showForm.fieldId
          if (data.brandIds) {
            data.brandInfoBOList = [{
              brandId: data.brandIds,
              brandName: (((this.formItemMap || {}).brandInfoList || []).find(it => +it.id === +data.brandIds) || {}).newsContent
            }]
          }
          if (this.opportunityId) {
            $updateOpportunity({
              ...data
            }).then((res) => {
              if (res.code === 1) {
                this.$message.success('编辑成功')
                this.handleClose()
                this.handleGetList()
              } else {
                this.$message.error(res.message)
              }
              this.btnLoading = false
            })
          } else {
            $addOpportunity({
              ...data
            }).then((res) => {
              if (res.code === 1) {
                this.$message.success('添加成功')
                this.handleClose()
                this.handleGetList()
              } else {
                this.$message.error(res.message)
              }
              this.btnLoading = false
            })
          }
        }
      })
    },

    handleRepeal() {
      this.showReasonDialog = true
    },

    handleGetList() {
      this.$emit('getList')
    },

    handleSubmit() {
      this.handleGetList()
      this.handleClose()
    },

    handleEditFinalAccount() {
      this.showFinalDialog = true
    },

    // 文件预览
    filePreview(file) {
      window.open(file.url)
    },
    async customChange(customerId) {
      const { code, data, message } = await $getCustomerGetCompany({ customerId })
      if (+code === 1) {
        this.showForm.companyName = data.newsContent || ''
        this.showForm.fieldName = data.fieldName || ''
        this.showForm.fieldId = data.fieldIds || ''
        this.getCustomerInfo(customerId)
      }
    },
    toAddClient() {
      this.$router.push({
        path: '/bussiness-manage/client-manage'
      })
    },
    beforeUploadAccount(file) {
      const re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        this.uploadAccountLoading = true
      } else {
        this.$message.error('只支持 Excel 文件')
      }
      return re
    },
    uploadAccountSuccess(res) {
      // 上传文件成功
      if (res.code === 1) {
        if (res.data.failAccountNum === 0) {
          this.$message({
            message: '上传全部成功',
            type: 'success'
          })
        } else {
          const cacheKey = res.data.cacheKey
          const tplUrl = `/api/business/order/downloadErrAccountData?type=2&cacheKey=${cacheKey}`
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `上传失败账号${res.data.failAccountNum}个 <a target="_blank" href="${tplUrl}" style="color: #1890ff">下载明细</a>`,
            duration: 0,
            type: 'warning'
          })
        }
        this.accountTags = this.accountTags.concat(res.data.successAccountList)
      } else {
        this.$message.error(res.message)
      }
      this.uploadAccountLoading = false
    },
    uploadAccountError(err) {
      this.uploadAccountLoading = false
      this.$message.error(err)
    },
    async addAccount() {
      if (!this.platId) {
        this.$message.error('请选择平台')
        return
      }
      if (!this.accountId) {
        this.$message.error('请选择账号')
        return
      }
      const currentAccount = this.accountOptions.find(
        item => +item.accountId === +this.accountId
      ) || {}
      const platName = this.formItemMap.mngPlatInfoVOList.find(
        item => item.platId === this.platId
      ) || {}
      const accountTags = {
        name: `${platName.platName}-${currentAccount.accountName}`,
        accountId: currentAccount.accountId,
        platId: this.platId,
        platName: platName.platName,
        accountName: currentAccount.accountName
      }

      // 编辑时， 实时添加
      if (this.opportunityId) {
        accountTags.opportunityId = this.opportunityId
        accountTags.orderType = 0

        try {
          this.loading = true
          const { code, data, message } = await $saveRecommendAccount({ ...accountTags })
          if (+code) {
            this.accountTags.push({
              ...accountTags,
              id: data
            })
          } else {
            this.$message.error(message || '添加失败，请重试')
          }
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$message.error(e || '添加失败，请重试')
        }
      } else {
        this.accountTags.push(accountTags)
      }

      // if (this.accountTags.some(item => item.name === accountTags.name && +item.accountId === +accountTags.accountId)) {
      //   this.$message.error('重复添加')
      //   return
      // }
      // this.accountTags.push(accountTags)
    },
    // 添加指定合作方
    async addSpecialAccount() {
      if (!this.specialData.coopType) {
        this.$message.error('请选择合作类型')
        return
      }

      if (!this.specialData.orgType) {
        this.$message.error('请选择部')
        return
      }

      if (!this.specialData.businessGroup) {
        this.$message.error('请选择军/工作室')
        return
      }

      // if (!this.specialData.businessUser) {
      //   this.$message.error('请选择创作者')
      //   return
      // }

      if (!this.specialData.platId) {
        this.$message.error('请选择平台')
        return
      }

      if (!this.specialData.accountName) {
        this.$message.error('请输入账号')
        return
      }
      let accountTags = copy(this.specialData)
      const coopTypeText = accountTags.coopType
      const businessGroupText = this.businessGroup.find(item => item.id === accountTags.businessGroup)
      const businessUserText = this.businessUser.find(item => item.id === accountTags.businessUser)
      const platNameText = accountTags.platName
      const accountNameText = accountTags.accountName
      const tagsNameArr = [coopTypeText, businessGroupText.orgName]
      if (businessUserText) {
        tagsNameArr.push(businessUserText.name)
      }
      if (platNameText) {
        tagsNameArr.push(platNameText)
      }
      if (accountNameText) {
        tagsNameArr.push(accountNameText)
      }
      const tagsName = tagsNameArr.join('-')
      accountTags.text = tagsName
      // if (this.specialNews.some((item) => (item.text === tagsName))) {
      //   this.$message.error('重复添加')
      //   return
      // }

      // 编辑时， 实时添加
      if (this.opportunityId) {
        accountTags = {
          ...accountTags,
          opportunityId: this.opportunityId,
          orderType: 1,
          orgDId: accountTags.businessGroup,
          orgDName: accountTags.businessGroupName,
          creatorId: accountTags.businessUser,
          creatorName: accountTags.businessUserName
        }

        try {
          this.loading = true
          const { code, data, message } = await $saveRecommendAccount({ ...accountTags })
          if (+code) {
            this.specialNews.push({
              ...accountTags,
              id: data
            })
          } else {
            this.$message.error(message || '添加失败，请重试')
          }
          this.loading = false
        } catch (e) {
          this.loading = false
          this.$message.error(e || '添加失败，请重试')
        }
      } else {
        this.specialNews.push(accountTags)
      }
    },
    handleClose() {
      this.$emit('close')
    },
    // 设置账号
    setAccountOptions() {
      this.accountId = ''
      this.accountOptions = this.formItemMap.simpleAccountBOList.filter(item => (item.platId === this.platId))
      this.accountMap.data = this.accountOptions
    },
    // 设置创作者
    setBusinessUser(id) {
      this.specialData.businessGroupName = (this.businessGroup.find(item => +item.id === +id) || {}).orgName
      this.specialData.businessUser = ''
      this.specialData.businessUserName = ''
      this.businessUser = (this._businessUser || []).filter(item => (item.dId === this.specialData.businessGroup || item.fId === this.specialData.businessGroup))
    },

    handleChangeBusinessUser(id) {
      this.specialData.businessUserName = (this.businessUser.find(item => +item.id === +id) || {}).name
    },

    handleChangePlat(id) {
      this.specialData.platName = (this.formItemMap.mngPlatInfoVOList.find(item => +item.platId === +id) || {}).platName
    },

    // 删除合作方
    handleSpecialTagClose(index, item) {
      if (this.showForm.finalCooperateAccounts.findIndex(it => it.id === item.id) > -1) {
        this.$message.warning('该账号已被选为最终合作账号，无法删除')
        return
      }
      this.deleteIds.push(item.id)
      this.specialNews.splice(index, 1)
    },
    // 删除账号标签
    handleTagClose(index, item) {
      if (this.showForm.finalCooperateAccounts.findIndex(it => it.id === item.id) > -1) {
        this.$message.warning('该账号已被选为最终合作账号，无法删除')
        return
      }
      // this.$confirm('删除账号后，对应的工单也将被清楚且不可恢复，请谨慎操作', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      this.deleteIds.push(item.id)
      this.accountTags.splice(index, 1)
        // }).catch(() => {
        // })
    },

    handleChoose(arr) {
      this.showForm.finalCooperateAccounts = arr
    },

    async handleAddBrand() {
      const value = this.addBrandInput.replace(/\s*/g, '')
      if (!value) {
        this.$message.error('新增品牌名不能为空')
        return
      }

      this.addLoading = true
      this.showAddError = false

      try {
        const { code, message, data } = await $addBaseCustomerInfo({
          typeId: 2,
          newsContent: value
        })

        if (+code === 0) {
          this.addLoading = false

          if (message.indexOf('已存在') > -1) {
            this.showAddError = true
          } else {
            this.showAddError = false
            this.$message.error(message)
          }
        } else if (+code === 1) {
          const newBrandData = this.formItemMap.brandInfoList || []
          newBrandData.unshift(data)
          this.brandConfig = {
            ...this.brandConfig,
            data: newBrandData
          }

          this.showForm.brandIds = data.id

          this.addLoading = false
          this.showAddError = false
          this.addBrandInput = ''
          this.$message.success('品牌添加成功')
        } else {
          this.addLoading = false
          this.showAddError = false
          this.$message.error(message)
        }
      } catch (e) {
        this.showAddError = false
        this.addLoading = false
        this.$message.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-input {
    width: 230px;
  }
  .account-input {
    width: 100%;
  }
  .account-tag {
    margin: 10px;
  }
  .max-height-156 {
    overflow-y: auto;
    max-height: 156px;
  }
  .flex-row {
    display: flex
  }
  .m-r-10 {
    margin-right: 10px;
  }
  .upload-view {
    height: 100px;
    width: 120px;
    ::v-deep  {
      .el-upload {
        width: 100%;
        height: 100%;
      }
      .el-upload-dragger  {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      .el-icon-upload {
        margin: 0;
        font-size: 24px;
      }
      .el-upload__text {
        font-size: 12px;
      }
    }
  }
  .pic {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ::v-deep {
    .el-textarea__inner{
      height: 100px;
    }
    // .requirementDesc {
    //   textarea {
    //     height: 150px;
    //   }
    // }
    .addInput {
      width: 204px;
    }

    .error {
      margin-left: 6px;
      color:#ff0000
    }
  }

  .deleteButton {
    color: #ff0000;
  }

  .row {
    display: flex;
  }

  .rowItem {
    background: rgba(229,239,254, 0.2);
    padding: 10px 6px 10px 0;
    margin-bottom: 10px;

    &:first-child {
      margin-right: 10px;
    }
  }

  .row-col {
    margin-right: 30px;
  }
</style>
