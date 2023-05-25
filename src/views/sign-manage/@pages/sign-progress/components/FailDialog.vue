<template>
  <div v-loading="data.loading">
    <el-dialog title="签约失败" :visible="show" :before-close="handleClose">
      <div class="item">
        <span>账号信息：</span>
        <AccountCard
          :info="data.info"
          :options="{ imgUrl: 'accountImg', name: 'accountName' }"
        >
          <span class="account-id">{{ data.info.platName }}号：{{ data.info.uniqueId || data.info.eid || data.info.getDataUrl || '--' }}</span>
        </AccountCard>
      </div>
      <el-form ref="fail" :model="data">
        <el-form-item
          class="formItem"
          label="签约失败原因："
          label-width="124px"
          prop="reason"
          :rules="[
            { required: true, message: '签约失败原因不能为空'},
          ]"
        >
          <el-input
            v-model="data.reason"
            type="textarea"
            placeholder="请输入签约失败原因"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent, reactive, getCurrentInstance, watch } from '@vue/composition-api'
import { AccountCard } from 'components'
import { $getFailInfo, $failSignProgress } from '@/api/sign-progress'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    AccountCard
  },

  setup(props, { emit }) {
    watch(
      () => props.show,
      async(newVal) => {
        if (newVal) {
          $refs.fail && $refs.fail.resetFields()
          data.loading = true
          try {
            const { code, message, data: resData } = await $getFailInfo({ accountId: props.id })
            data.loading = false
            if (+code === 1) {
              data.info = {
                ...resData,
                accountId: props.id
              }
            } else {
              $message.error(message)
            }
          } catch (e) {
            data.loading = false
            $message.error(e)
          }
        }
      }
    )

    const { $refs, $message } = getCurrentInstance().proxy

    const data = reactive({
      reason: '',
      info: {},
      loading: false
    })

    const handleClose = () => {
      emit('onClose')
    }

    const handleSubmit = () => {
      $refs.fail.validate(async(valid) => {
        if (valid) {
          try {
            const { code, message } = await $failSignProgress({ accountId: props.id, contractFailedReason: data.reason })
            if (+code === 1) {
              emit('onClose')
              emit('getAll')
            } else {
              $message.error(message)
            }
          } catch (e) {
            $message.error(e)
          }
        } else {
          return false
        }
      })
    }

    return {
      data,
      handleClose,
      handleSubmit
    }
  }
})
</script>

<style scoped lang="scss">
.item {
  display: flex;
  margin-bottom: 20px;

  & > span {
    width: 124px;
    padding-right: 12.5px;
    flex-shrink: 0;
    text-align: right;
  }
}

.formItem {
  display: flex;

  .input {
    flex: 1
  }
}

::v-deep .el-form-item__content {
  /* ... */
  flex: 1;
  margin-left: 0 !important;
}

.account-id {
  line-height: 1.2;
  color: $--color-text-secondary;
}
</style>
