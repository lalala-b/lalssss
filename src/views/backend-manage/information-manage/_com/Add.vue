<template>
  <el-dialog
    title="新增信息流链接"
    :visible="show"
    label-suffix="："
    width="900px"
    @close="handleClose"
  >
    <el-form
      ref="form"
      inline
      :model="form"
      :rules="rules"
    >
      <el-form-item prop="platName" label=" ">
        <el-select v-model="form.platName" filterable clearable placeholder="请选择平台">
          <el-option v-for="item in condition.platName" :key="item.configValue" :value="item.configValue" :label="item.configName" />
        </el-select>
      </el-form-item>
      <el-form-item prop="agent" label=" ">
        <el-select v-model="form.agent" filterable clearable placeholder="请选择代理商">
          <el-option v-for="item in condition.agent" :key="item.agent" :value="item.agent" :label="item.agent" />
        </el-select>
        <el-button class="m-l-10" type="primary" @click="showAddAgent = true">新增代理商</el-button>
      </el-form-item>
      <el-form-item prop="brandName" label=" ">
        <el-select v-model="form.brandName" filterable clearable placeholder="请选择推广应用" @change="getLinkageCondition">
          <el-option v-for="item in condition.brandName" :key="item.dictValue" :value="item.configValue" :label="item.configName" />
        </el-select>
      </el-form-item>
      <el-form-item prop="popularizeTarget" label=" ">
        <el-select v-model="form.popularizeTarget" filterable clearable placeholder="请选择推广目标">
          <el-option v-for="item in condition.popularizeTarget" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
        </el-select>
      </el-form-item>
      <el-form-item prop="popularizeBusiness" label=" ">
        <el-select v-model="form.popularizeBusiness" filterable clearable placeholder="请选择推广业务">
          <el-option v-for="item in condition.popularizeBusiness" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />

        </el-select>
      </el-form-item>
      <el-form-item prop="systemType" label=" ">
        <el-select v-model="form.systemType" filterable clearable placeholder="请选择设备系统">
          <el-option v-for="item in condition.systemType" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />

        </el-select>
      </el-form-item>
      <el-form-item prop="businessType" label=" ">
        <el-select v-model="form.businessType" filterable clearable placeholder="请选择跳转指定页">
          <el-option v-for="item in condition.businessType" :key="item.configValue" :value="`${item.configValue}，${item.configName}`" :label="item.configName" />
        </el-select>
      </el-form-item>
      <br>
      <el-form-item label="备注：">
        <el-input v-model="form.remark" maxlength="100" class="note-input" type="textarea" placeholder="请输入备注" show-word-limit />
      </el-form-item>
      <br>
      <el-form-item label="新增数量：" prop="addCount">
        <el-input-number v-model="form.addCount" :min="1" :max="20" label="新增数量" :controls="false" :precision="0" :step="1" />
      </el-form-item>
    </el-form>
    <div class="flex flex-justify-end">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleAddClick">确 定</el-button>
    </div>
    <AddAgent v-if="showAddAgent" v-model="showAddAgent" />
  </el-dialog>
</template>
<script>
import AddAgent from './AddAgent.vue'
import { useToggle } from '@/hook'
import { copy } from '@/utils'
import { toRefs, reactive, onMounted, onUnmounted } from '@vue/composition-api'
import { $addInfoStream, $getInfoStreamCondition, $getLinkageCondition } from '@/api/information-manage'
export default {
  components: { AddAgent },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      loading: false,
      showAddAgent: false,
      condition: {},
      rules: {
        platName: [{ required: true, message: '请选择平台', trigger: 'change' }],
        agent: [{ required: true, message: '请选择代理商', trigger: 'change' }],
        brandName: [{ required: true, message: '请选择推广应用', trigger: 'change' }],
        popularizeTarget: [{ required: true, message: '请选择推广目标', trigger: 'change' }],
        popularizeBusiness: [{ required: true, message: '请选择推广业务', trigger: 'change' }],
        systemType: [{ required: true, message: '请选择设备系统', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择跳转指定页', trigger: 'change' }],
        addCount: [{ required: true, message: '请输入新增数量', trigger: 'blur' }]
      }
    })
    const form = reactive({
      platName: null,
      agent: null,
      brandName: null,
      popularizeTarget: null,
      popularizeBusiness: null,
      systemType: null,
      businessType: null,
      remark: null,
      addCount: 1
    })

    const handleAddClick = async() => {
      try {
        await ctx.refs.form.validate()
        state.loading = true
        const params = copy(form)
        const [businessType, forwardPage] = params.businessType.split('，')
        params.businessType = businessType
        params.forwardPage = forwardPage
        const res = await $addInfoStream(params)
        if (res.code === 1) {
          ctx.root.$message.success('操作成功')
          ctx.emit('update')
          handleClose()
        } else {
          ctx.root.$message.error(res.message)
        }
        state.loading = false
      } catch (err) {
        if (err === false) return
        if (err?.__CANCEL__) return
        ctx.root.$message.error(err.message)
        state.loading = false
      }
    }

    const getInfoStreamCondition = function(params) {
      $getInfoStreamCondition().then(res => {
        if (res.code === 1) {
          state.condition = res.data
        } else {
          ctx.root.$message.error(res.message)
        }
      })
    }
    getInfoStreamCondition()
    const getLinkageCondition = function(val) {
      form.businessType && (form.businessType = '')
      form.popularizeBusiness && (form.popularizeBusiness = '')
      state.condition.businessType = []
      state.condition.popularizeBusiness = []
      $getLinkageCondition({
        brandName: val
      }).then(res => {
        if (res.code === 1) {
          state.condition.businessType = res.data.businessType
          state.condition.popularizeBusiness = res.data.popularizeBusiness
        }
      })
    }

    onMounted(() => {
      ctx.root.$bus.$on('updateAgent', () => {
        $getInfoStreamCondition().then(res => {
          if (res.code === 1) {
            state.condition.agent = res.data.agent
          } else {
            ctx.root.$message.error(res.message)
          }
        })
      })
    })

    onUnmounted(() => {
      ctx.root.$bus.$off('updateAgent')
    })

    return {
      show,
      form,
      ...toRefs(state),
      handleClose,
      handleAddClick,
      getLinkageCondition
    }
  }
}
</script>
<style lang="scss" scoped>
  .note-input {
    width: 600px;
  }
  ::v-deep {
    .el-form-item__label {
      padding: 0;
    }
  }
</style>
