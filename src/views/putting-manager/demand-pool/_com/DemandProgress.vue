<template>
  <el-dialog
    title="编辑需求进度"
    :visible="show"
    @close="handleClose"
  >
    <AccountCard :info="formData" />
    <el-row class="m-t-24" :gutter="20">
      <el-col :span="6">需求提报人：{{ formData.advertiserRealname }}</el-col>
      <el-col :span="6">投放专员：{{ formData.commissionerRealname }}</el-col>
      <el-col :span="6">计费方式：{{ formData.chargeTypeDesc }}</el-col>
      <el-col :span="6">合作单量：{{ formData.coopOrderMaxNum }}</el-col>
    </el-row>
    <el-row class="m-t-24" :gutter="20">
      <el-col :span="12">预期投放价格：{{ formData.preDeliveryAmountMin }}-{{ formData.preDeliveryAmountMax }}</el-col>
      <el-col :span="12">预计发布时间：{{ formData.preReleaseVideoBeginTime }}~{{ formData.preReleaseVideoEndTime }}</el-col>
    </el-row>
    <el-row class="m-t-24" :gutter="20">
      <el-col :span="12">品牌标签：{{ formData.brandTagStr }}</el-col>
      <el-col :span="12">业务标签：{{ formData.businessTag }}</el-col>
      <el-col class="m-t-24" :span="12">视频类型：{{ formData.junType }}</el-col>
      <el-col v-if="formData.businessTag === 'B2C'" class="m-t-24" :span="12">产品型号：{{ formData.b2cPhoneModel || '--' }}</el-col>

    </el-row>
    <el-row class="m-t-24">
      <el-col>备注：{{ formData.remark }}</el-col>
    </el-row>
    <el-row v-if="formData.contactUserName" class="m-t-24">
      <el-col>账号建联成功人员：{{ formData.contactUserName }}</el-col>
    </el-row>
    <el-form ref="addProcess" :model="formData" :rules="rules" class="m-t-24">
      <el-form-item label="需求进度:">
        <el-select
          v-model="formData.requirementProgress"
          filterable
          clearable
          :disabled="whetherDueTo"
          placeholder="请选择需求进度"
          style="width: 420px"
        >
          <el-option
            v-for="item in progressList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="需求进度备注:" prop="progressRemark" :required="formData.requirementProgress === '议价失败' ? true : false">
        <el-input v-model="formData.progressRemark" :maxlength="formData.requirementProgress === '议价失败'?50:200" type="textarea" :placeholder="formData.requirementProgress === '议价失败'?'请填写议价失败原因':''" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { computed, getCurrentInstance, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { useToggle } from '@/hook'
import AccountCard from '@/components/AccountCard'
import { $getDataByDictType } from '@/api'
import { $updateRequirementProgress } from '@/api/putting-manager'
import { copy } from '@/components/common'
import { commonData } from '@/views/bussiness-manage/operations_management/_com/hooks'
export default {
  components: {
    AccountCard
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { $message, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const formData = reactive(copy(props.data))

    const whetherDueTo = computed(() => {
      return formData && +formData.requirementStatus === 4
    })
    const progressList = ref([])
    watch(() => formData.requirementProgress, (val) => {
      if (val !== '议价失败') {
         $refs.addProcess.clearValidate('progressRemark')
      }
    })
    const rules = reactive({
       progressRemark: [
        {
          validator: (rule, value, callback) => {
            if (formData.requirementProgress === '议价失败') {
              if (value) {
                return callback()
              } else {
                callback(new Error('请填写需求进度备注'))
              }
            }
            return callback()
          },
          trigger: ['blur', 'change']
        }
      ]
    })
    let progressType = 'delivery_requirement_pro_progress'
    if (formData.requirementStatus === 1) {
      progressType = 'delivery_requirement_connect_progress'
    } else {
      progressType = 'delivery_requirement_pro_progress'
    }
    $getDataByDictType({
      dictTypes: [progressType]
    }).then(res => {
      // progressList.value = res.data[progressType]
      const data = res.data[progressType]
      progressList.value = data.filter(item => item.extValue !== 'bargaining_fail_by_system')
    })
    const loading = ref(false)
    const addProcess = ref('')
    const handleSave = async() => {
       await addProcess.value.validate()
      loading.value = true
      $updateRequirementProgress({
        id: formData.id,
        requirementProgress: formData.requirementProgress,
        progressRemark: formData.progressRemark
      }).then(res => {
        if (res.code === 1) {
          handleClose()
          emit('success')
          $message.success('操作成功')
        } else {
          $message.error(res.message)
        }
        loading.value = false
      }).catch(err => {
        loading.value = false
      })
    }

    return {
      formData,
      loading,
      progressList,
      show,
      handleClose,
      handleSave,
      rules,
      addProcess,
      whetherDueTo
    }
  }
}
</script>
