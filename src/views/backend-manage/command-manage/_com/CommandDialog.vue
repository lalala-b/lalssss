<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="500px"
    @close="handleClose"
  >
    <p v-if="dialogType === 0" class="m-b-5 tip-red ">多个口令需分别添加</p>
    <el-form
      ref="forms"
      label-width="100px"
      :rules="rules"
      :model="formData"
    >
      <el-form-item prop="businessTag" label="业务标签">
        <el-select v-model="formData.businessTag" filterable>
          <el-option
            v-for="item in normalFormItemMap.businessTagList.data"
            :key="item.text"
            :value="item.val"
            :label="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="getCustomerWay" label="获客方式">
        <el-select v-model="formData.getCustomerWay" filterable>
          <el-option
            v-for="item in normalFormItemMap.getCustomerWayList.data"
            :key="item.text"
            :value="item.val"
            :label="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="toolCase" label="工具箱">
        <el-select
          v-model="formData.toolCase"
          allow-create
          filterable
        >
          <el-option
            v-for="item in normalFormItemMap.toolCaseList.data"
            :key="item.text"
            :value="item.val"
            :label="item.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="wordOfCommand" label="口令">
        <el-input v-model="formData.wordOfCommand" maxlength="20" />
      </el-form-item>
      <el-form-item prop="beginTime" label="生效时间">
        <el-date-picker v-model="formData.beginTime" value-format="yyyy-MM-dd" />
      </el-form-item>
    </el-form>
    <div class="flex flex-justify-end">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleEditClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { reactive, ref, onMounted, getCurrentInstance } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $addWordOfCommand, $updateCommand } from '@/api/backend-manage'
import { copy } from '@/utils'

export default {
  props: {
    value: Boolean,
    normalFormItemMap: {
      type: Object,
      default() {
        return {}
      }
    },
    dialogType: {
      type: Number,
      default: 0
    },
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    title() {
      return this.dialogType === 0 ? '新增口令' : '编辑口令'
    }
  },
  setup(props, ctx) {
    const _ctx = getCurrentInstance()
    const { emit, refs } = _ctx
    const { $message } = ctx.root
    const { show, handleClose } = useToggle(props)
    const loading = ref(false)
    const handleEditClick = async() => {
      loading.value = true
      const form = refs.forms
      try {
        await form.validate()
        const params = copy(formData)
        params.isSelf = 0
        params.isNewToolCase =
        props.normalFormItemMap.getCustomerWayList.data.findIndex(item => item.val === params.toolCase) >= 0 ? 0 : 1
        const $api = props.dialogType === 0 ? $addWordOfCommand : $updateCommand
        $api(params).then(res => {
        // this.normalFormItemMap.
          if (res.code === 1) {
            $message.success('操作成功')
            handleClose()
            emit('update:list')
          } else {
            $message.error(res.message)
          }
          loading.value = false
        })
      } catch (e) {
        loading.value = false
      }
    }

    const formData = reactive({
      businessTag: '',
      getCustomerWay: '',
      toolCase: '',
      wordOfCommand: '',
      beginTime: ''
    })

    const wordOfCommandCheck = (rule, value, callback) => {
      const test = /[\,，]/
      if (value === '') {
        callback(new Error('请输入口令'))
      } else if (value.match(test)) {
        callback(new Error('口令不能包含中英文逗号'))
      } else {
        callback()
      }
    }
    const rules = {
      wordOfCommand: [{ required: true, validator: wordOfCommandCheck, trigger: 'blur' }],
      beginTime: [{ required: true, message: '请选择生效时间', trigger: 'change' }],
      businessTag: [{ required: true, message: '请选择业务标签', trigger: 'change' }],
      getCustomerWay: [{ required: true, message: '请选择获客方式', trigger: 'change' }],
      toolCase: [{ required: true, message: '请选择工具箱', trigger: 'change' }]
    }

    onMounted(() => {
      for (const key in props.editData) {
        formData[key] = props.editData[key]
      }
    })

    return {
      formData,
      rules,
      show,
      loading,
      handleClose,
      handleEditClick
    }
  }
}
</script>
