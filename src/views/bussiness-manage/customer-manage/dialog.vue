<template>
  <el-dialog
    :title="dialogType === 'add' ? '新增客户': '编辑客户'"
    :visible.sync="showDialog"
    width="980px"
    :close-on-click-modal="false"
    :show-close="true"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <p class="titleBox">
      <span class="title">详细信息</span>
      <span v-if="dialogType === 'edit'" class="notice">（客户创建人：{{ formData.createName || '--' }}，创建时间：{{ formData.createTime || '--' }}）</span>
    </p>
    <div>
      <el-form
        ref="forms"
        label-width="120px"
        :rules="rules"
        :model="formData"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户全称" prop="creditCode">
              <el-select
                v-model="formData.creditCode"
                filterable
                remote
                reserve-keyword
                clearable
                placeholder="请输入公司名称或统一社会信用代码"
                :remote-method="handleSearchCompany"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.companyName + '/' + item.creditCode"
                  :label="item.companyName"
                  :value="item.companyName + '/' + item.creditCode"
                >
                  <span style="float: left; margin-right: 14px">{{ item.companyName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.creditCode }}</span>
                </el-option>
              </el-select>
              <!-- <Select v-model="formData.creditCode" :config="normalFormItemMap.creditCode" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户级别">
              <span class="notice">敬请期待</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主要合作类型" prop="customerType">
              <el-select
                v-model="formData.customerType"
                placeholder="请选择合作类型"
                :filterable="true"
                :clearable="true"
                popper-class="cooperateSelect"
                :popper-append-to-body="false"
              >
                <el-option
                  v-for="item in customerTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                  <div>{{ item.name }}</div>
                  <div v-if="item.tipContent" style="font-size: 12px; color:rgb(190,190,190);margin-top: -10px;">{{ item.tipContent }}</div>
                </el-option>
              </el-select>
              <!-- <Select
                v-model="formData.customerType"
                :config="{
                  ...normalFormItemMap.customerType,
                  data: customerTypeList,
                  optionValKey: 'id',
                  optionLabelKey: 'name'
                }"
              /> -->
              <IconTip
                content="我们与客户的合作类型一般只有1种，若有若有多种，则此处填入的是最主要的合作类型。"
                icon-class="iconwenhao"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业类别">
              <el-cascader
                ref="cascader"
                v-model="formData.industryId"
                placeholder="请选择行业类别"
                :options="normalFormItemMap.fieldId.data"
                :props="{ checkStrictly: false, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' }"
                clearable
                @change="handleChangeFieldIds"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <p class="notice m-b-20">
          注：媒介渠道的客户，行业类别一般都为广告/文化传媒
        </p>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主对接人">
              <Select
                v-model="formData.mainConnectId"
                :config="{
                  ...normalFormItemMap.mainConnectId,
                  data: (normalFormItemMap.crmInfo || {}).data
                }"
              />
              <IconTip
                content="可为空。主对接人负责拉齐所有与该客户相关的所有信息，包括但不限于返点年政策、商机合作等。"
                icon-class="iconwenhao"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人数量上限">
              <el-input
                v-model="formData.maxConnectLimit"
                placeholder="请输入联系人数量上限"
                :max="500"
                oninput="value=Number(value.replace(/[^0-9]+/g,'')) > 100 ? 100 : value.replace(/[^0-9]+/g,'') === 0 ? 1 : value.replace(/[^0-9]+/g,'')"
              />
              <IconTip
                content="为了避免单个客户有过多的联系人，导致客户跟进效率低，不利于商务的跟进效率。"
                icon-class="iconwenhao"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="自营返点区间" prop="selfMax">
              <el-input-number
                v-model="formData.selfMin"
                :controls="false"
                class="inputNumber"
                :precision="2"
                :min="0"
                :max="formData.selfMax"
                label="自营返点区间"
              />%
              ~
              <el-input-number
                v-model="formData.selfMax"
                :controls="false"
                class="inputNumber"
                :precision="2"
                :min="0"
                :max="25"
                label="自营返点区间"
              />%

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="签约返点区间" prop="signMax">
              <el-input-number
                v-model="formData.signMin"
                :controls="false"
                class="inputNumber"
                :precision="2"
                :min="0"
                :max="formData.signMax"
                label="签约返点区间"
              />%
              ~
              <el-input-number
                v-model="formData.signMax"
                :controls="false"
                class="inputNumber"
                :precision="2"
                :min="0"
                :max="20"
                label="签约返点区间"
              />%

            </el-form-item>
          </el-col>
        </el-row>
        <p class="notice m-b-20">
          注：自营返点上限不能高于25%，签约返点上限不能高于20%，不填下限即为无下限<br>
          注：该客户后续合作的商机、商单，其返点均不允许超出该区间
        </p>
        <el-row>
          <el-col>
            <el-form-item label="客户回收规则">
              <span class="notice">敬请期待</span>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, getCurrentInstance, onMounted, watch } from '@vue/composition-api'
import { Select, IconTip } from 'components'
import {
  $saveCustomerDetail,
  $searchCompany,
  $getCustomerEditDetail,
  $getCustomerTypeList
} from '@/api/bussiness-manage'

export default defineComponent({
  components: {
    Select,
    IconTip
  },
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    dialogType: {
      type: String,
      default: 'add'
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    normalFormItemMap: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { $message, $refs, $set } = getCurrentInstance().proxy
    const formData = reactive({
      creditCode: '',
      customerType: '',
      industryId: [],
      mainConnectId: '',
      maxConnectLimit: 10,
      selfMin: undefined,
      selfMax: 25,
      signMin: undefined,
      signMax: 20
    })

    watch(() => formData.customerType, (val) => {
      // 主要合作类型为媒介渠道，行业类别默认广告及传媒
      if (+val === 2020 && states.isChangeIndustryId) {
        formData.industryId = ['1922', '10000001']
      }
      states.isChangeIndustryId = true
    })

    // 公司名称
    const useCompany = () => {
      const remoteLoading = ref(false)
      const companyList = ref([])
      const handleSearchCompany = (word) => {
        if (!word) return
        remoteLoading.value = true
        $searchCompany({ word }).then(res => {
          if (res.code === 1) {
            companyList.value = res.data?.list || []
          }
          remoteLoading.value = false
        }).catch(err => {
          if (err.__CANCEL__) return
          remoteLoading.value = false
        })
      }
      return {
        companyList,
        handleSearchCompany,
        remoteLoading
      }
    }

    const { companyList, remoteLoading, handleSearchCompany } = useCompany()

    const validateSelfMax = (rule, value, callback) => {
      if (!formData.selfMax || formData.selfMax > 25) {
        callback(new Error('自营返点上限在0～25%'))
      } else {
        callback()
      }
    }

    const validateSignMax = (rule, value, callback) => {
      if (!formData.signMax || formData.signMax > 20) {
        callback(new Error('签约返点上限在0～20%'))
      } else {
        callback()
      }
    }

    const states = reactive({
      rules: {
        creditCode: [{ required: true, message: '请选择客户全称', trigger: ['blur', 'change'] }],
        customerType: [{ required: true, message: '请选择主要合作类型', trigger: ['blur', 'change'] }],
        selfMax: [{ required: true, validator: validateSelfMax, trigger: ['change', 'blur'] }],
        signMax: [{ required: true, validator: validateSignMax, trigger: ['change', 'blur'] }]
      },
      btnLoading: false,
      detail: {},
      customerTypeList: [],
      isChangeIndustryId: true
    })

    const getCustomerTypeList = async() => {
      const { code, data } = await $getCustomerTypeList()

      if (+code === 1) {
        const customerTypeList = data || []
        states.customerTypeList = customerTypeList.map(item => {
          const newsContent = item.name
          switch (newsContent) {
            case '代理-媒介代理':
              item.tipContent = '以代理身份，对接直客品牌方，不出方案，主要采买市场上账号。'
              break
            case '代理-方案代理':
              item.tipContent = '以代理身份，对接直客品牌方，出创意方案，主要采买市场上账号。'
              break
            case 'MCN-渠道':
              item.tipContent = '以MCN身份，对接渠道代理公司，合作自家账号或者采买市场上账号。'
              break
            case 'MCN-直采':
              item.tipContent = '以MCN身份，对接直客品牌方，合作自家账号。'
              break
            default:
              item.tipContent = ''
              break
          }
          return item
        })
      }
    }

    onMounted(async() => {
      getCustomerTypeList()
      if (props.id) {
        const { code, data } = await $getCustomerEditDetail({ id: props.id })
        if (+code === 1) {
          states.detail = data
          const {
            companyName,
            companyId,
            creditCode,
            customerType,
            industryId,
            mainConnectId,
            maxConnectLimit,
            selfMax,
            selfMin,
            signMax,
            signMin,
            createName,
            createTime
          } = data

          let formIndustryId = []
          if (industryId) {
            formIndustryId = industryId.toString().split(',').map(item => Number(item))
          } else {
            formIndustryId = []
          }
          if (formIndustryId.length) {
            let parentId = ''
            const arr = props.normalFormItemMap.fieldId.data || []
            for (let i = 0; i < arr.length; i += 1) {
              const index = arr[i].childNodeTags.findIndex(item => +item.tagId === +formIndustryId[0])
              if (index > -1) {
                parentId = arr[i].tagId
                break
              }
            }
            formData.industryId = [parentId, formIndustryId[0].toString()]
          }
          states.isChangeIndustryId = false

          formData.createName = createName
          formData.createTime = createTime
          formData.creditCode = `${companyName}/${creditCode}`
          formData.customerType = customerType
          formData.mainConnectId = mainConnectId || ''
          formData.companyId = companyId
          formData.maxConnectLimit = maxConnectLimit
          formData.selfMin = selfMin
          formData.selfMax = selfMax
          formData.signMin = signMin
          formData.signMax = signMax
        }
      }
      getIndustryList(props.normalFormItemMap.fieldId.data)
    })

    const getIndustryList = (list) => {
      if (list) {
        list.forEach(item => {
          if (!item.enableFlag) {
            $set(item, 'disabled', false)
          } else {
            $set(item, 'disabled', true)
          }
          if (item.childNodeTags) {
            getIndustryList(item.childNodeTags)
          }
        })
      }
    }

    const handleChangeFieldIds = (val) => {
      const nodesInfo = $refs.cascader.getCheckedNodes()[0]
      if (!nodesInfo || !Object.keys(nodesInfo).length) {
        formData.industryId = []
        return
      }
      if (nodesInfo.data.disabled || nodesInfo.children.length) {
        formData.industryId = []
      } else {
        formData.industryId = val
      }
    }

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs['forms'].validate()
      const params = { ...formData }
      params.industryId = params.industryId[params.industryId.length - 1]

      if (props.id) {
        params.id = props.id
      }

      if (params.creditCode !== states.detail.creditCode) {
        delete params.companyId
      }

      params.companyName = params.creditCode.split('/')[0]
      params.creditCode = params.creditCode.split('/')[1]

      try {
        states.btnLoading = true
        const { code, message } = await $saveCustomerDetail(params)
        if (+code === 1) {
          if (props.dialogType === 'add') {
            $message.success('新增成功')
          } else {
            $message.success('编辑成功')
          }
          emit('success')
          states.btnLoading = false
        } else {
          states.btnLoading = false
          $message.error(message)
        }
      } catch (e) {
        states.btnLoading = false
        $message.error(e)
      }
    }

    return {
      formData,
      ...toRefs(states),
      handleClose,
      handleConfirm,
      handleSearchCompany,
      companyList,
      remoteLoading,
      handleChangeFieldIds
    }
  }
})
</script>

<style lang="scss" scoped>
.titleBox {
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 18px;
}

.title {
  font-size: 18px;
  position: relative;
  padding-left: 18px;

  &::after {
    content: "";
    width: 10px;
    height: 24px;
    font-size: 0;
    background: #409EFF;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.notice {
  color: #aaa;
  position: relative;
}

.rel-top {
  top: -18px;
}

::v-deep {
  .el-input {
    max-width: 220px;
  }

  .cooperateSelect {
    .el-select-dropdown__item {
        height: auto;
    }
  }
}

.inputNumber {
  max-width: 80px;
}
</style>
