<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="680px"
    :title="dialogTitle"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="show"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" label-width="124px" :rules="rules">
      <template v-for="(item, index) in arr">
        <el-row :key="item.md5Id" class="m-b-10">
          <el-col :span="12" class="checkBox">
            <el-checkbox v-model="formData[`item${index}`]" size="medium">{{ item.tagName }}</el-checkbox>
            <IconTip
              v-if="item.tagDescribe"
              :content="item.tagDescribe"
              icon-class="iconwenhao"
              class="m-l-6"
            />
          </el-col>

          <el-col :span="12">
            <el-form-item
              v-if="item.canEditType && formData[`item${index}`]"
              :label="`${item.tagName.substr(0, item.tagName.length - 2)}截止时间`"
              :prop="`itemDate${index}`"
            >
              <el-date-picker
                v-model="formData[`itemDate${index}`]"
                class="date"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                :picker-options="{
                  disabledDate
                }"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>

    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  computed,
  reactive,
  onMounted,
  toRefs,
  watch
} from '@vue/composition-api'
import { IconTip } from 'components'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    arr: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $refs, $nextTick } = getCurrentInstance().proxy

    const dialogTitle = computed(() => {
      return props.data.length ? '编辑账号标签' : '添加账号标签'
    })

    const state = reactive({
      formData: {},
      btnLoading: false
    })

    const validateTag = (rule, value, callback, key) => {
      if (!state.formData[key]) {
        callback(new Error('请选择截止时间'))
      } else {
        callback()
      }
    }

    const rules = computed(() => {
      const rules = {}
      props.arr.forEach((item, index) => {
        if (item.canEditType) {
          rules[`itemDate${index}`] = [{ required: true, validator: (rule, value, callback) => validateTag(rule, value, callback, `itemDate${index}`), trigger: ['blur', 'change'] }]
        }
      })
      return rules
    })

    onMounted(() => {
      const obj = {}
      props.arr.forEach((item, index) => {
        obj[`item${index}`] = props.data.findIndex(it => it.tagName === item.tagName) > -1
        if (item.canEditType) {
          obj[`itemDate${index}`] = (props.data.find(it => it.tagName === item.tagName) || {}).endTime || ''
        }
      })

      state.formData = {
        ...obj
      }
    })

    watch(() => state.formData, (val, oldVal) => {
      if (val && Object.keys(oldVal).length) {
        const obj = { ...val }

        Object.values(val).forEach((item, index) => {
          if (item === false) {
            obj[`itemDate${Object.keys(val)[index].substr(4)}`] = ''
          }
        })

        if (JSON.stringify(obj) === JSON.stringify(val)) { return }

        state.formData = {
          ...obj
        }
      }
    }, { deep: true })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs.form.validate()
      const { formData } = state

      const result = []

      props.arr.forEach((item, index) => {
        const newItem = {
          md5Id: item.md5Id,
          tagName: item.tagName,
          tagSource: 2,
          endTime: ''
        }
        if (formData[`item${index}`]) {
          // 有时间的
          if (item.canEditType) {
            newItem.endTime = formData[`itemDate${index}`]
          }
          result.push(newItem)
        }
      })

      emit('confirm', result)
    }

    const disabledDate = (time) => {
      return time.getTime() < Date.now() - 8.64e7
    }

    return {
      ...toRefs(state),
      rules,
      dialogTitle,
      handleClose,
      handleConfirm,
      disabledDate
    }
  }
})
</script>
<style lang="scss" scoped>
.date {
  width: 180px;
}

.checkBox {
  padding-top: 6px;
}
</style>
