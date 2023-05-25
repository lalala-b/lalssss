<template>
  <el-dialog
    title="注册信鸽场景"
    :visible.sync="show"
    :before-close="handleClose"
    width="640px"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      label-suffix="："
    >
      <el-form-item label="场景Code" prop="triggerCode">
        <el-input v-model="form.triggerCode" placeholder="请输入场景Code" />
      </el-form-item>
      <el-form-item label="场景描述" prop="triggerDesc">
        <el-input
          v-model="form.triggerDesc"
          type="textarea"
          placeholder="请输入场景描述"
        />
      </el-form-item>
      <el-form-item
        label-width="160px"
        label="是否需要注册机器人"
        prop="needRegisterRobot"
      >
        <el-switch
          v-model="form.needRegisterRobot"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item
        v-if="!form.needRegisterRobot"
        :required="true"
        label="机器人Code"
        prop="robotCode"
      >
        <el-select
          v-model="form.robotCode"
          placeholder="请选择机器人Code"
          clearable
          filterable
        >
          <el-option
            v-for="item in robotList"
            :key="item.robotCode"
            :label="`${item.robotCode}(${item.robotName})`"
            :value="item.robotCode"
          />
        </el-select>
      </el-form-item>
      <template v-else>
        <el-form-item
          :required="+form.needRegisterRobot ? true : false"
          label="机器人Code"
          prop="robotCode"
        >
          <el-input v-model="form.robotCode" placeholder="请输入机器人Code" />
        </el-form-item>
        <el-form-item
          :required="+form.needRegisterRobot ? true : false"
          label="机器人名称"
          prop="robotName"
        >
          <el-input v-model="form.robotName" placeholder="请输入机器人名称" />
        </el-form-item>
        <el-form-item
          :required="+form.needRegisterRobot ? true : false"
          label="机器人类型"
          prop="robotType"
        >
          <el-select
            v-model="form.robotType"
            :required="true"
            placeholder="请选择机器人类型"
            clearable
            filterable
          >
            <el-option
              v-for="item in robotTypeList"
              :key="item.dictValue"
              :label="item.dictLabel"
              :value="item.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :required="+form.needRegisterRobot ? true : false"
          label="机器人Key"
          prop="robotKey"
        >
          <el-input v-model="form.robotKey" placeholder="请输入机器人Key" />
        </el-form-item>
      </template>
      <el-form-item
        label-width="140px"
        label="是否需要注册模版"
        prop="needRegisterTemplate"
      >
        <el-switch
          v-model="form.needRegisterTemplate"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item
        v-if="!form.needRegisterTemplate"
        label="模版Code"
      >
        <el-select
          v-model="form.templateCode"
          :required="true"
          placeholder="请选择模版Code"
          clearable
          filterable
        >
          <el-option
            v-for="item in templateCodeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <template v-else>
        <el-form-item
          :required="+form.needRegisterTemplate ? true : false"
          label="模版Code"
          prop="templateCode"
        >
          <el-input v-model="form.templateCode" placeholder="请输入模版Code" />
        </el-form-item>
      </template>
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
import { $getRobotList, $registerRobot } from '@/api/backend-manage'
import fansVue from '@/views/pirate/fans/fans.vue'

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
    triggerCodeList: {
      type: Array,
      default: []
    },
    robotList: {
      type: Array,
      default: []
    },
    templateCodeList: {
      type: Array,
      default: []
    },
    robotTypeList: {
      type: Array,
      default: () => []
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
    const validRobot = (rule, value, callback) => {
      console.info('========rule', rule)
      if (value) {
        return callback()
      } else {
        callback(new Error(rule.message))
      }
      return callback()
    }
    const validTem = (rule, value, callback) => {
      if (value) {
        return callback()
      } else {
        callback(new Error(rule.message))
      }
      return callback()
    }
    const states = reactive({
      rules: {
        triggerCode: [
          {
            required: true,
            message: '请输入场景Code',
            trigger: ['blur', 'change']
          }
        ],
        triggerDesc: [
          { required: true, message: '请输入场景描述', trigger: ['blur'] }
        ],
        robotCode: [
          {
            validator: validRobot,
            message: '请输入机器人Code',
            trigger: ['blur', 'change']
          }
        ],
        robotType: [
          {
            validator: validRobot,
            message: '请输入机器人类型',
            trigger: ['blur', 'change']
          }
        ],
        robotKey: [
          {
            validator: validRobot,
            message: '请输入机器人Key',
            trigger: ['blur']
          }
        ],
        robotName: [
          {
            validator: validRobot,
            message: '请输入机器人名称',
            trigger: ['blur']
          }
        ],
        templateCode: [
          {
            validator: validTem,
            message: '请输入模版Code',
            trigger: ['blur', 'change']
          }
        ]
      }
    })
    const form = reactive({
      triggerCode: '',
      robotCode: '',
      needRegisterTemplate: 0,
      needRegisterRobot: 0
    })
    const loading = ref(false)
    const handleSave = async() => {
      loading.value = true
      const {
        triggerCode,
        triggerDesc,
        needRegisterRobot,
        robotCode,
        robotName,
        robotType,
        robotKey,
        needRegisterTemplate,
        templateCode
      } = form
      const params = {
        triggerCode,
        triggerDesc,
        robotRegisterRequest: {
          needRegisterRobot: !!+needRegisterRobot,
          robotCode,
          robotName,
          robotType,
          robotKey
        },
        templateRegisterRequest: {
          needRegisterTemplate: !!+needRegisterTemplate,
          templateCode
        }
      }
      await $refs.form.validate()
      const res = await $registerRobot(params)
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
<style lang="scss" scoped>
::v-deep {
  .el-form-item__content {
    width: 60% !important;
  }
  .el-select{
    width: 100%;
  }
}
</style>
