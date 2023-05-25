<template>
  <el-dialog
    :title="type === 'edit' ? '编辑路由' : '新增路由'"
    :visible.sync="show"
    :before-close="handleClose"
    width="640px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="type === 'add' ? rules : null"
      label-width="110px"
      label-suffix="："
    >
      <el-form-item label="路由名称" prop="routeName">
        <template v-if="type !== 'add'">
          {{ form.routeName }}
        </template>
        <el-input
          v-else
          v-model="form.routeName"
          placeholder="请输入路由名称"
        />
      </el-form-item>
      <el-form-item label="路由code" prop="routeCode">
        <template v-if="type !== 'add'">
          {{ form.routeCode }}
        </template>
        <el-input
          v-else
          v-model="form.routeCode"
          placeholder="请输入路由code"
        />
      </el-form-item>
      <el-form-item label="路由页面地址" prop="routeAddress">
        <el-input
          v-model="form.routeAddress"
          placeholder="请输入路由页面地址"
        />
        <p>例如：@/views/backend-manage/router-manage/router-manage.vue</p>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  watch
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $addRoute, $updateRoute } from '@/api/backend-manage'

export default defineComponent({
  props: {
    value: Boolean,
    type: {
      type: String,
      default: 'add'
    },
    info: {
      type: Object,
      default: () => {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { $message, $nextTick, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    watch(
      () => props.info,
      (val) => {
        if (val && Object.keys(val).length) {
          $nextTick(() => {
            form.routeName = val.routeName
            form.routeCode = val.routeCode
            form.routeAddress = val.routeAddress
          })
        }
      },
      { deep: true, immediate: true }
    )
    const states = reactive({
      rules: {
        routeName: [
          { required: true, message: '请输入路由名称', trigger: ['blur'] }
        ],
        routeCode: [
          { required: true, message: '请输入路由code', trigger: ['blur'] }
        ],
        routeAddress: [
          { required: true, message: '请输入路由页面地址', trigger: ['blur'] }
        ]
      }
    })
    const form = reactive({
      routeName: '',
      routeAddress: '',
      routeCode: ''
    })
    const loading = ref(false)
    const handleSave = async() => {
      const $api = props.type === 'add' ? $addRoute : $updateRoute
      const params = {
        ...form
      }
      console.info('=========', props.from, params.routeAddress)
      if (props.from === 'EditRoute' && !params.routeAddress) {
        $message.error('路由页面地址不能为空')
        return
      }
      if (props.type === 'add') await $refs.form.validate()
      const res = await $api(params)
      if (res.code === 1) {
        $message.success(res.message)
        handleClose()
        loading.value = false
        emit('success')
      } else {
        $message.error(res.message)
      }
    }
    return {
      loading,
      ...toRefs(states),
      form,
      show,
      handleClose,
      handleSave
    }
  }
})
</script>
