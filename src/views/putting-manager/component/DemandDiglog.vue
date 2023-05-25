<template>
  <el-dialog width="800px" :title="title" :visible="show" @close="handleClose">
    <!-- <p
      v-if="!formData.commissionerRealname && source !== 2 && !getUserLoading"
      class="tip-red m-b-10 flex flex-justify-center"
    >
      该平台未指派投放专员承接需求，请联系徐成举进行指派！
    </p> -->
    <el-form
      ref="form"
      :model="formData"
      inline
      label-suffix="："
      class="demand m-t-24"
      label-width="140px"
      :rules="rules"
    >
      <el-form-item class="w-100" label="账号信息">
        <AccountCard :info="data" />
      </el-form-item>
      <template v-if="demandType === 'forOther'">
        <el-form-item label="广告师">
          <el-select v-model="formData.advertiserUserId" filterable clearable placeholder="请选择广告师">
            <el-option
              v-for="item in advertiserList"
              :key="item.id"
              :label="item.name"
              :value="Number(item.id)"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item v-if="!isAdvice" label="广告师">{{
          formData.advertiserRealname
        }}</el-form-item>
      </template>
      <el-form-item v-if="![2].includes(+source)&&type!=='edit'" label="投放专员" prop="commissionerUserId">
        <el-select
          v-model="formData.commissionerUserId"
          placeholder="请选择投放专员"
          clearable
          filterable
        >
          <el-option
            v-for="item in deliveryList"
            :key="item.deliveryId"
            :value="item.deliveryId"
            :label="item.deliveryName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-else label="投放专员">{{
        formData.commissionerRealname
      }}</el-form-item>
      <el-form-item v-if="!isAdvice" label="计费方式" prop="chargeType">
        <el-select v-model="formData.chargeType" placeholder="请选择计费方式">
          <el-option
            v-for="item in chargingModeList"
            :key="item.dictLabel"
            :label="item.dictLabel"
            :value="Number(item.dictValue)"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdvice" label="合作单量" prop="coopOrderMaxNum">
        <el-input-number
          v-model="formData.coopOrderMaxNum"
          :min="1"
          :max="5"
          placeholder="合作单量"
        />
      </el-form-item>
      <el-form-item class="w-100" label="预期投放价格" prop="preDeliveryAmount">
        <el-input-number
          v-model="formData.preDeliveryAmountMin"
          :precision="0"
          :controls="false"
          :min="0"
          :max="5000000"
          placeholder="金额最小值"
        />
        <span class="m-l-5 m-r-5">至</span>
        <el-input-number
          v-model="formData.preDeliveryAmountMax"
          :min="0"
          :max="5000000"
          :controls="false"
          placeholder="金额最大值"
          :precision="0"
        />
      </el-form-item>
      <el-form-item class="w-100" label="预计发布时间" prop="preReleaseVideoTime">
        <el-date-picker
          v-model="formData.preReleaseVideoTime"
          type="date"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
          :picker-options="pickerOptions"
          clearable
        />
      </el-form-item>
      <el-form-item v-if="!isAdvice" label="品牌标签" prop="brandTag">
        <el-select
          v-model="formData.brandTag"
          placeholder="请选择品牌标签"
          clearable
          filterable
          @change="handleTagChange"
        >
          <el-option
            v-for="item in brandNameList"
            :key="item.dictLabel"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="!isAdvice" label="业务标签" prop="businessTag">
        <el-select
          v-if="type!=='edit'"
          v-model="formData.businessTag"
          clearable
          filterable
          placeholder="请选择业务标签"

          @change="onChangeBusinessTag"
        >
          <el-option
            v-for="item in businessTagList"
            :key="item.dictLabel"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
        <span v-else>{{ formData.businessTag }}</span>
      </el-form-item>
      <el-form-item v-if="!isAdvice" label="视频类型" prop="junType">
        <el-select v-model="formData.junType" filterable clearable>
          <el-option
            v-for="tags in junTypeList"
            :key="tags.junType"
            :value="tags.junType"
            :label="tags.junType"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.businessTag === 'B2C'" label="产品型号">
        <el-cascader
          v-model="formData.b2cPhoneModelId"
          placeholder="请选择产品型号"
          class="m-r-10"
          :options="modelData"
          :show-all-levels="false"
          :props="{
            checkStrictly: false,
            expandTrigger: 'hover',
            value: 'modelId',
            label: 'modelName',
            children: 'phoneModelVOList' }"
          clearable
          filterable
          :filter-method="dataFilter"
        />
      </el-form-item>
      <el-form-item class="w-100" label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          :maxlength="200"
          type="textarea"
          placeholder="备注"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSave"
      >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import dayjs from 'dayjs'
import AccountCard from '@/components/AccountCard'
import {
  computed,
  reactive,
  toRefs,
  getCurrentInstance,
  ref
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { useStore } from '../hook'
import {
  // $getCommissionerUser,
  $getAddCondition,
  $addRequirement,
  $updateRequirement,
  $getJunType,
  $getAdvertiserList,
  $addRequirementForOther
} from '@/api/putting-manager'
import { $getDeliveryList } from '@/api/putting-manager'

import { $getB2CPhoneModel } from '@/api/bussiness-manage'
import { $getDataByDictType } from '@/api'
import { copy } from '@/utils'
export default {
  components: { AccountCard },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    source: {
      type: Number,
      default: 0 // 0 - 需求提报； 1 - 提报合作大厅  2 - 建议合作  3 - 需求代提
    },
    type: {
      type: String,
      default: 'add'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    demandType: {
      type: String,
      default: ''
    },
    showSubmitTip: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const _this = getCurrentInstance()
    const store = useStore()
    const userInfo = computed(() => store.userInfo.value)
    const brandType = ref('')
     const title = computed(() => {
       if (props.demandType === 'forOther') {
         return '投放需求代提'
       } else {
         return props.source === 2 ? '建议合作' : props.type === 'edit' ? '编辑投放需求' : '投放需求提报'
       }
    })
    const hasDelivery = ref(props.source === 2 || props.type === 'edit')
    const {
      brandNameList,
      chargingModeList,
      setBrandNameList,
      setChargingModeList
    } = useStore()
    const state = reactive({
      loading: false,
      // getUserLoading: true,
      modelData: [],
      formData: {
        id: null,
        requirementId: props.source === 1 ? props.data.id : '',
        accountId: props.data.accountId,
        platId: props.data.platId,
        advertiserUserId: null,
        advertiserRealname: null,
        commissionerUserId: props.data.commissionerUserId || '',
        commissionerRealname: props.data.commissionerRealname || '',
        chargeType: null,
        source: props.source,
        businessTag: null,
        brandTag: null,
        coopOrderMaxNum: 1,
        preDeliveryAmountMin: null,
        preDeliveryAmountMax: null,
        preReleaseVideoTime: null,
        remark: null,
        junType: null,
        b2cPhoneModelId: ''
      },
      businessTagList: [],
      rules: {
        chargeType: [
          { required: true, message: '请选择计费方式', trigger: 'change' }
        ],
        businessTag: [
          { required: true, message: '请选择业务标签', trigger: 'change' }
        ],
        brandTag: [
          { required: true, message: '请选择品牌标签', trigger: 'change' }
        ],
        coopOrderMaxNum: [
          { required: true, message: '请输入合作单量', trigger: 'change' }
        ],
        junType: [
          { required: true, message: '请选择视频类型', trigger: 'change' }
        ],
        commissionerUserId: [
           { required: true, message: '请选择投放专员', trigger: 'change' }
        ],
        // remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
        preDeliveryAmount: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (
                !state.formData.preDeliveryAmountMin ||
                !state.formData.preDeliveryAmountMax
              ) {
                callback(new Error('请输入正确预期投放价格'))
                return
              }
              if (
                state.formData.preDeliveryAmountMin >
                state.formData.preDeliveryAmountMax
              ) {
                callback(new Error('预期投放价格最小值应小于最大值'))
                return
              }
              callback()
            }
          }
        ],
        preReleaseVideoTime: [
          { required: true, message: '请输入预计发布时间', trigger: 'change' }
        ]
      },
      junTypeList: [],
      advertiserList: [],
      deliveryList: []// 投放专员列表
    })
    const { show, handleClose } = useToggle(props)
    const onChangeBusinessTag = (val) => {
      // if (!val) return
      if (val !== 'B2C') {
        state.formData.b2cPhoneModelId = ''
      }
      getJunType()
      // const list = copy(state.junTypeList)
      // if (['B2C秒杀', 'C2C秒杀'].includes(val)) {
      //   list.forEach((item) => {
      //     if (item.junType.includes(val)) {
      //       state.formData.junType = item.junType
      //     }
      //   })
      // }
    }
    const getCommissionerRealname = (id) => {
      const list = state.deliveryList
      return (list.find(item => +item.deliveryId === +id) || {}).deliveryName
    }
    const Save = async() => {
      await _this.refs.form.validate()
      const params = copy(state.formData)
      // if (params.daterange) {
      //   params.preReleaseVideoBeginTime = params.daterange[0]
      //   params.preReleaseVideoEndTime = params.daterange[1]
      //   delete params.daterange
      // }
      if (params.advertiserUserId) {
        params.advertiserRealname = state.advertiserList.find(item => item.id === params.advertiserUserId).name
      }
      params.source = props.source
      const res = await $addRequirementForOther(params)
      if (res.code === 1) {
        handleClose()
        _this.proxy.$message.success('操作成功')
        ctx.emit('success')
        if (props.showSubmitTip) {
          showSubmitTip()
        }
      } else {
        _this.proxy.$message.error(res.message)
      }
    }

    const showSubmitTip = () => {
        _this.proxy.$confirm(`已提交申请，待中台审核`, '提示', {
          customClass: 'apply-confrim-wrap',
          showCancelButton: false,
          confirmButtonText: '查看我的提报申请'
        }).then(() => {
          _this.proxy.$router.push({
            path: '/putting-manager/demand-pool',
            query: {
              queryActiveName: 'ToAuditDemand'
            }
          })
          return
        }).catch(() => {
          return
        })
    }

    const handleSave = async function() {
      state.loading = true
      if (props.demandType === 'forOther') {
        Save()
        return
      }
      try {
        await _this.refs.form.validate()
        const params = copy(state.formData)
        // if (params.daterange) {
        //   params.preReleaseVideoBeginTime = params.daterange[0]
        //   params.preReleaseVideoEndTime = params.daterange[1]
        //   delete params.daterange
        // }
        params.source = props.source

        if ((params.b2cPhoneModelId || []).length > 1) {
          params.b2cPhoneModelId = params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1]
        } else {
          params.b2cPhoneModelId = ''
        }
        if (params.commissionerUserId) {
          params.commissionerRealname = getCommissionerRealname(params.commissionerUserId)
        }
        let $api
        switch (props.type) {
          case 'add':
            $api = $addRequirement
            break
          case 'edit':
            $api = $updateRequirement
            break
        }

        const res = await $api(params)

        if (res.code === 1) {
          handleClose()
          _this.proxy.$message.success('操作成功')
          ctx.emit('success')
          if (props.showSubmitTip) {
            showSubmitTip()
          }
        } else {
          const message = res.message || ''
          if (message.indexOf('投放次数' || '已达上限') > -1) {
            ctx.emit('handleBusinessDialog', { accountId: props.data.accountId, businessLine: state.formData.businessTag, businessLineDate: state.formData.preReleaseVideoTime })
          } else {
            _this.proxy.$message.error(res.message)
          }
        }
        state.loading = false
      } catch (err) {
        state.loading = false
        if (!err) return
        if (err.__CANCEL__) return
        _this.proxy.$message.error(err.message)
      }
    }

    const getB2CPhoneModel = async() => {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        state.modelData = data || []
        if (props.data.b2cPhoneModelId) {
          for (let i = 0; i < (data || []).length; i++) {
            for (let j = 0; j < (data[i].phoneModelVOList || []).length; j++) {
              if (data[i].phoneModelVOList[j].phoneModelVOList.findIndex(item => +item.modelId === +props.data.b2cPhoneModelId) > -1) {
                state.formData = {
                  ...state.formData,
                  b2cPhoneModelId: [+data[i].modelId, +data[i].phoneModelVOList[j].modelId, props.data.b2cPhoneModelId]
                }
                break
              }
            }
          }
        }
      }
    }

    // 获取下拉条件
    const getCondition = function() {
      if (
        brandNameList.value.length === 0 ||
        chargingModeList.value.length === 0
      ) {
        $getAddCondition().then((res) => {
          if (res.code === 1) {
            setBrandNameList(res.data.brandNameList || [])
            setChargingModeList(res.data.chargingModeList || [])
          }
        })
      }
      // if (props.source !== 2 && props.demandType !== 'forOther' && props.type !== 'edit') {
      //   // 需求提报 获取投放专员
      //   $getCommissionerUser({ accountId: props.data.accountId })
      //     .then((res) => {
      //       if (res.code === 1) {
      //         if (!res.data) return
      //         hasDelivery.value = true
      //         state.formData.commissionerRealname = res.data.commissionerRealname
      //         state.formData.commissionerUserId = res.data.commissionerUserId
      //       } else {
      //         hasDelivery.value = false
      //         _this.proxy.$message.error({
      //           message: res.message,
      //           duration: 5000
      //         })
      //         handleClose()
      //       }
      //       state.getUserLoading = false
      //     })
      //     .catch((err) => {
      //       _this.proxy.$message.error(err.message)
      //       state.getUserLoading = false
      //     })
      // }
    }
    const getAdvertiserList = function() {
      $getAdvertiserList()
        .then((res) => {
          if (res.code === 1) {
            state.advertiserList = res.data || []
          } else {
            _this.proxy.$message.error(res.message)
          }
        })
        .catch((err) => {
          _this.proxy.$message.error(err)
        })
    }
    // 获取视频类型
    const getJunType = (isInit = false) => {
      const brandTag = brandNameList.value.find(
        (item) => item.dictValue === state.formData.brandTag
      )?.dictLabel
      $getJunType({ accountId: state.formData.accountId, brandTag: isInit ? '' : brandTag, dictValue: isInit ? '' : state.formData.businessTag }).then(
        (res) => {
          if (res.code === 1) {
            if (res.data.findIndex(item => item.junType === state.formData.junType) <= -1) {
              state.formData.junType = null
            }
            state.junTypeList = res.data
          }
        }
      )
    }
    // 获取业务标签数据
    const handleTagChange = function(dictTypes, isInit = false) {
      if (!dictTypes) {
        state.formData.businessTag = ''
        getJunType(true)
        state.businessTagList = []
        return
      }
      getJunType()
      brandType.value = dictTypes
      $getDataByDictType({
        dictTypes: [dictTypes]
      }).then((res) => {
        if (res.code === 1) {
          state.businessTagList = res.data[dictTypes]
        }
      })
      // getJunType(isInit)
    }

    const isAdvice = computed(() => props.source === 2)

    const pickerOptions = computed(() => {
      const sTime = new Date()
      return {
        disabledDate(time) {
          return (
            dayjs(sTime).add(-1, 'day').isAfter(time) ||
            dayjs(sTime).add(6, 'month').isBefore(time)
          )
        }
      }
    })
    const dataFilter = (node, val) => {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    }
    const getDeliveryList = () => {
      $getDeliveryList().then(res => {
        if (res.code === 1) {
          state.deliveryList = res.data
        }
      })
    }
    getCondition()
    if (props.type === 'add' || props.demandType) {
      const { realname, id } = _this.proxy.$store.getters
      if (props.source !== 2 && props.demandType !== 'forOther') {
        // 需求提报
        state.formData.advertiserRealname = realname
        state.formData.advertiserUserId = id
      } else {
        // 建议合作
        state.formData.commissionerRealname = realname
        state.formData.commissionerUserId = id
      }
    }

    if (props.type === 'edit') {
      // 编辑
      for (const key in state.formData) {
        state.formData[key] = props.data[key]
      }
      // state.formData.daterange = [
      //   props.data.preReleaseVideoBeginTime,
      //   props.data.preReleaseVideoEndTime
      // ]
      handleTagChange(state.formData.brandTag, true)
    }
    getAdvertiserList()
    getB2CPhoneModel()
    getJunType()
    getDeliveryList()
    return {
      title,
      show,
      isAdvice,
      pickerOptions,
      handleClose,
      handleSave,
      handleTagChange,
      brandNameList,
      chargingModeList,
      hasDelivery,
      onChangeBusinessTag,
      ...toRefs(state),
      userInfo,
      dataFilter
    }
  }
}
</script>
<style lang="scss" scoped>
.demand {
  .el-form-item {
    width: 50%;
    margin-right: 0;
    ::v-deep {
      .el-form-item__content {
        display: inline-flex;
      }
    }
    &.w-100 {
      width: 100%;
    }
    .el-textarea {
      width: 500px;
    }
  }
}

::v-deep {
  .el-select {
    max-width: 200px;
  }

  .el-input {
    max-width: 200px;
  }
}
</style>

<style lang="scss">
.el-message-box.apply-confrim-wrap {
    padding:14px 10px;
    .el-message-box__btns {
      display: flex;
      justify-content: center;
      align-items: center;

      button{
        transform: scale(0.85);
        display:flex;
        justify-content: center;
        align-items: center;
        width:160px;
        height:40px;
        border-radius: 8px;
      }
    }
  }
</style>
