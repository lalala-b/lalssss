<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="formData"
    label-width="100px"
    label-position="left"
  >
    <el-form-item prop="choreographerId" label="编导人员:">
      <el-select
        v-model="formData.choreographerId"
        placeholder="请选择人员"
        clearable
        filterable
        class="m-r-16"
        @change="onChangeId"
      >
        <el-option
          v-for="item in fundList"
          :key="item.userId"
          :label="item.realname"
          :value="item.userId"
        />
      </el-select>
      <span class="red-tip">可选择基金所有在职人员。流程进入待资金核算后不可修改。</span>
    </el-form-item>
  </el-form>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
export default defineComponent({
  props: {
    value: {
      type: String | Number
    },
    fundList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy
     const states = reactive({
       rules: {
        choreographerId: [
          { required: true, message: '请选择编导人员', trigger: ['blur', 'change'] }
        ]
      },
      formData: {
        choreographerId: props.value
      }
     })
     const onChangeId = (val) => {
       emit('input', val)
     }
    const validateForm = () => {
      return $refs.form.validate()
    }
    return {
      ...toRefs(states),
      validateForm,
      onChangeId
    }
  }
})
</script>
