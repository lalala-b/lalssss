<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    :append-to-body="true"
    width=""
  >
    <div
      v-loading="loading"
    >
      <el-row :gutter="10">
        <el-col :span="12">
          <AccountCard :info="info">
            <span class="account-id">ID：{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</span>
          </AccountCard>
        </el-col>
        <el-col :span="12">
          <div class="flex">
            订单号：{{ info.orderNumber }}
            <el-link
              class="m-l-10"
              target="_blank"
              type="primary"
              :underline="false"
              @click="handleOrderDetail(info.orderId,info.platId)"
            >查看详情</el-link>
          </div>
        </el-col>
      </el-row>
      <el-form
        ref="form"
        label-suffix=":"
        :model="formModel"
        class="m-t-16"
        :rules="rules"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="广告师">{{ info.advertiserRealname }}（{{ info.advertiserorgNameD }}-{{ info.advertiserOrgNameF }}）</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投放专员">{{ info.deliveryName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="投放下单报价">{{ info.deliveryOfferAmount | toThousands }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台手续费">{{ info.platServiceCharge | toThousands }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计费方式">{{ PUT_CHARGE_TYPE[info.chargeType] }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台消耗金额">{{ info.consumeAmount | toThousands }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="返款金额">{{ info.rebateAmount | toThousands }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="补款金额">{{ info.addAmount | toThousands }}</el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="投放价格">{{ info.deliveryMoney | toThousands }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="平台订单ID">{{ info.thirdOrderId }}</el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="视频信息">
              <div class="flex">
                <VideoList
                  v-if="info.videoList && info.videoList.length"
                  :list-data="info.videoList"
                  :options="{
                    coverImg: 'videoCoverUrl',
                    title: 'titleName',
                  }"
                  :show-video-count="4"
                />
                <VideoInfo
                  v-if="info.videoInfo&&info.videoInfo.titleName"
                  :info="info.videoInfo"
                  :options="{
                    coverImg: 'videoCoverUrl',
                    title: 'titleName',
                  }"
                />
                <div v-else class="account-card__gray">暂无视频信息</div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="异常类型" prop="appealType" label-width="88px">
              <div v-if="['detail', 'approval'].includes(type) || (info.appealStatus && info.appealStatus !== 0)">{{ info.appealTypeName }}</div>
              <template v-else>
                <el-select v-model="formModel.appealType" placeholder="请选择异常问题">
                  <el-option
                    v-for="item in complainTypesList"
                    :key="item.dictValue"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  />
                </el-select>
                <!-- <span class="m-l-10">异常问题无对应选项请联系林婷婷</span> -->
              </template>
            </el-form-item>
          </el-col>
          <el-col v-if="formModel.appealType==='order_amount_modify'" :span="12">
            <el-form-item label="相关截图" prop="screenshot">
              <UploadImg v-model="formModel.screenshot" :limit="3" :size="'small'" :disabled="!['putIn','edit'].includes(type)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="formModel.appealType === 'scalping_type'" :gutter="10">
          <el-col :span="24">
            <el-form-item label="客情关系" prop="relationship" label-width="88px">
              <div v-if="['detail', 'approval'].includes(type) || (info.appealStatus && info.appealStatus !== 0)">{{ info.relationshipName }}</div>
              <el-select
                v-else
                v-model="formModel.relationship"
                placeholder="请选择客情关系"
                style="width: 300px"
              >
                <el-option
                  v-for="item in relationshipList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="Number(item.dictValue)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="['scalping_type', 'kuai_shou_current_limiting', 'examine_problem','order_amount_modify'].includes(formModel.appealType || info.appealType)" :gutter="10">
          <el-col :span="24">
            <el-form-item label="问题描述" prop="exceptionDesc" label-width="88px">
              <div v-if="['detail', 'approval'].includes(type) || (info.appealStatus && info.appealStatus !== 0)">{{ info.exceptionDesc }}</div>
              <template v-else>
                <el-input
                  v-model="formModel.exceptionDesc"
                  class="complaint--textarea"
                  type="textarea"
                  :placeholder="formModel.appealType==='order_amount_modify'?'请填写乾数据订单中具体要修改的金额信息及修改原因':'请填写问题详请'"
                  maxlength="200"
                  show-word-limit
                />
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <template v-if="['kuai_shou_delete'].includes(formModel.appealType||info.appealType)">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="申请原因" prop="appealReason" label-width="88px">
                <div v-if="['detail', 'approval'].includes(type) || (info.appealStatus && info.appealStatus !== 0)">{{ info.appealReason }}</div>
                <template v-else>
                  <el-input
                    v-model="formModel.appealReason"
                    class="complaint--textarea"
                    type="textarea"
                    placeholder="请填写申请原因"
                    maxlength="200"
                    show-word-limit
                  />
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="平台任务ID">{{ info.platTaskId }}</el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-link type="primary" :underline="false" @click="showTpl = true">磁力聚星视频作品删除申请（模板工单） </el-link>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="达人确认截图" prop="darenConfirmScreenshot">
                <div
                  v-if="['detail', 'approval'].includes(type) || (info.appealStatus && info.appealStatus !== 0)"
                >
                  <el-image
                    v-if="info.darenConfirmScreenshot"
                    style="width: 100px; height: 100px"
                    :src="info.darenConfirmScreenshot"
                  />
                  <el-link v-if="info.darenConfirmScreenshot" type="primary" :underline="false" class="m-l-10" @click="handleExportClick">导出申请</el-link>

                </div>
                <div v-else class="flex">
                  <UploadImg v-model="formModel.darenConfirmScreenshot" :limit="1" size="small" />
                  <el-link v-if="formModel.darenConfirmScreenshot.length > 0" type="primary" :underline="false" class="m-l-10" @click="handleExportClick">导出申请</el-link>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </template>

        <template v-if="(type==='approval' || type === 'detail') && info.appealStatus !== 3">
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="申诉进度" prop="appealProgress">
                <div v-if="type==='detail'">{{ info.appealProgressName }}</div>
                <template v-else>
                  <el-select
                    v-model="formModel.appealProgress"
                    placeholder="请选择申诉进度"
                    @change="handleToAppealProgress"
                  >
                    <el-option
                      v-for="item in appealTypeList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="Number(item.dictValue)"
                    />
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="24">
              <el-form-item label="进度备注">
                <div v-if="type==='detail'">{{ info.progressRemark }}</div>
                <template v-else>
                  <el-input
                    v-model="formModel.progressRemark"
                    class="complaint--textarea"
                    type="textarea"
                    placeholder="请填写申诉处理具体进度情况"
                    maxlength="200"
                    show-word-limit
                  />
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="showFinish" :gutter="10">
            <el-col :span="24">
              <el-form-item label="申诉是否已完成">
                <div v-if="type==='detail'">{{ info.isFinish === 1 ? '是' : '否' }}</div>
                <template v-else>
                  <el-radio-group v-model="formModel.isFinish" :disabled="formModel.disableAppealFinish">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>

      <div v-if="type !== 'detail'" slot="footer" class="flex flex-justify-end">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="handleSave">确 定</el-button>
      </div>
    </div>
    <ClTemplate v-if="showTpl" v-model="showTpl" :info="info" :form-model="formModel" />
  </el-dialog>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, reactive, ref, watch } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { AccountCard, VideoInfo, UploadImg, VideoList } from 'components'
import { PUT_CHARGE_TYPE } from '@/const'
import { $getAppealDetail, $addAppeal, $updateAppeal, $updateAppealStatus } from '@/api/putting-manager'
import { $getDataByDictType } from '@/api'
import qs from 'qs'
import { isUndef } from '@/utils'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: 'approval' | 'putIn' | 'edit' | 'detail',
      default: 'putIn'
    },
    orderNumber: String | Number,
    appealId: String | Number
  },
  components: {
    UploadImg,
    AccountCard,
    VideoInfo,
    VideoList,
    ClTemplate: () => import('./ClTemplate')
  },
  setup(props, { emit }) {
    const { $message, $router, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const showTpl = ref(false)

    const formModel = reactive({
      appealType: undefined,
      appealReason: '',
      darenConfirmScreenshot: [],
      exceptionDesc: '',
      relationship: undefined,
      progressRemark: undefined,
      appealProgress: '',
      isFinish: 0,
      screenshot: [],
      disableAppealFinish: false
    })
    const checkImg = (rule, value, callback) => {
      if (!value) {
         return callback(new Error(rule.message))
      }
      if (Array.isArray(value) && value.length === 0) {
        return callback(new Error(rule.message))
      }
      return callback()
    }
    const rules = {
      appealType: { required: true, message: '请选择异常类型', trigger: 'change' },
      relationship: { required: true, message: '请选择客情关系', trigger: 'change' },
      exceptionDesc: { required: true, message: '请填写问题详请', trigger: 'blur' },
      appealReason: { required: true, message: '请填写申请原因', trigger: 'blur' },
      // darenConfirmScreenshot: { required: true, message: '请上传达人确认截图', trigger: 'blur' },
      appealProgress: { required: true, message: '请选择申诉进度', trigger: 'change' },
      screenshot: { required: true, validator: checkImg, message: '请上传相关截图', trigger: ['blur', 'change'] }
    }

    const form = ref(null)
    const btnLoading = ref(false)
    // 监听formModel.screenshot有值则去除较验
    watch(() => formModel.screenshot, (val) => {
      if (val && val.length) {
        $refs.form.clearValidate('screenshot')
      }
    })
    const handleSave = async() => {
      await form.value.validate()
      btnLoading.value = true
      const params = {
        orderNumber: props.orderNumber,
        appealType: formModel.appealType,
        exceptionDesc: formModel.exceptionDesc,
        appealId: props.appealId,
        screenshot: formModel.screenshot.length ? JSON.stringify(formModel.screenshot) : ''
      }
      if (formModel.appealType === 'scalping_type') {
        // 刷量 - 客情关系
        params.relationship = formModel.relationship
      }
      if (formModel.appealType === 'kuai_shou_delete') {
        // 快手删除视频
        delete params.exceptionDesc
        params.appealReason = formModel.appealReason
        params.darenConfirmScreenshot = formModel.darenConfirmScreenshot[0]
      }
      if (props.type === 'approval') {
        params.isFinish = showFinish.value ? formModel.isFinish : 0
        params.progressRemark = formModel.progressRemark
        params.appealProgress = formModel.appealProgress
      }
      try {
        let res
        switch (props.type) {
          case 'putIn':
            res = await $addAppeal(params)
            break
          case 'edit':
            res = await $updateAppeal(params)
            break
          case 'approval':
            res = await $updateAppealStatus(params)
        }

        btnLoading.value = false
        if (res && res.code === 1) {
          $message.success('操作成功')
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
        $message.error('系统错误')
      }
    }

    const complainTypes = ref([])
    const relationshipList = ref([])
    const getDictType = () => {
      $getDataByDictType({ dictTypes: ['exception_appeal_type', 'customer_relationship'] }).then(res => {
        if (res.code === 1) {
          complainTypes.value = res.data.exception_appeal_type
          relationshipList.value = res.data.customer_relationship
        }
      })
    }
    getDictType()
    const complainTypesList = computed(() => {
      return complainTypes.value.filter(item => {
        return !item.extValue || item.extValue.split(',').includes(String(info.value.platId))
      })
    })

    const info = ref({})
    const loading = ref(false)

    const getDetailInfo = () => {
      loading.value = true
      $getAppealDetail({ orderNumber: props.orderNumber, appealId: props.appealId }).then(res => {
        if (res.code === 1) {
          if (res.data) {
            const list = res.data.exceptionOrderAppealListVOSubList
              if (Array.isArray(list) && list.length >= 1) {
                res.data.videoList = list.slice(0, list.length - 1)
                res.data.videoInfo = list[list.length - 1]
              } else {
                res.data.videoList = []
                res.data.videoInfo = {}
              }
          }
          info.value = res.data
          for (const key in formModel) {
            !isUndef(res.data[key]) && (formModel[key] = res.data[key])
          }
          if (res.data.darenConfirmScreenshot) {
            formModel.darenConfirmScreenshot = [formModel.darenConfirmScreenshot]
          } else {
            formModel.darenConfirmScreenshot = []
          }
          if (props.type === 'approval' || props.type === 'detail') {
            getAppealProgress(info.value.appealType)
          }
          if (res.data && res.data.screenshot && res.data.screenshot.length) {
            formModel.screenshot = JSON.parse(res.data.screenshot)
          }
        } else {
          $message.error(res.message)
        }
        loading.value = false
      }).catch(err => {
        console.log(err)
        loading.value = false
        $message.error('系统错误')
      })
    }
    getDetailInfo()

    const appealTypeList = ref([])
    const getAppealProgress = (appealType) => {
      $getDataByDictType({ dictTypes: [appealType] }).then(res => {
        if (res.code === 1) {
          appealTypeList.value = res.data[appealType]
        }
      })
    }

    const handleOrderDetail = (orderId, platId) => {
      $router.push({
        path: '/putting-manager/order-detail',
        query: {
          orderId,
          platId,
          _blank: true
        }
      })
    }

    const handleExportClick = () => {
      const params = {
        agentName: '深圳市向乾文化传播有限公司',
        accountName: info.value.accountName,
        getDataUrl: info.value.uniqueId || info.value.eid || info.value.getDataUrl,
        url: info.value.url,
        appealReason: formModel.appealReason || info.value.appealReason,
        addTime: info.value.addTime,
        titleName: info.value.titleName,
        thirdOrderId: info.value.thirdOrderId,
        platTaskId: info.value.platTaskId,
        darenConfirmScreenshot: formModel.darenConfirmScreenshot[0]
      }
      window.open(`/api/exception/order/appeal/downloadAppealTemplate?${qs.stringify(params)}`)
    }

    const handleToAppealProgress = (val) => {
      if (+val === 4) {
        formModel.isFinish = 1
        formModel.disableAppealFinish = true
      } else {
        formModel.isFinish = 0
        formModel.disableAppealFinish = false
      }
    }

    const showFinish = computed(() => {
      const item = appealTypeList.value.find(item => {
        console.log(String(item.dictValue) === String(formModel.appealProgress))
        console.log(String(item.extValue) === '1')
        return String(item.dictValue) === String(formModel.appealProgress) && String(item.extValue) === '1'
      })
      return Boolean(item)
    })

    const title = computed(() => {
      switch (props.type) {
        case 'approval':
          return '编辑异常申诉'
        case 'putIn':
          return '新增异常申诉'
        case 'edit':
          return '编辑异常申诉'
        case 'detail':
          return '查看异常申诉'
        default:
          return '查看异常申诉'
      }
    })
    return {
      title,
      showFinish,
      loading,
      btnLoading,
      formModel,
      form,
      rules,
      PUT_CHARGE_TYPE,
      info,
      showTpl,
      show,
      appealTypeList,
      complainTypesList,
      relationshipList,
      handleClose,
      handleSave,
      handleOrderDetail,
      handleExportClick,
      handleToAppealProgress
    }
  }
})
</script>
<style lang="scss" scoped>
  .complaint--textarea{
    width: 600px;
  }
  ::v-deep {
    .video-info-right {
      justify-content: flex-start;
    }
    .video-info-right__title {
      margin-bottom: 12px;
    }
  }
  .account-card__gray {
    color: $--color-text-secondary;
  }
</style>
