<template>
  <el-dialog
    title="移交全部账号"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="700px"
    :before-close="handleClose"
  >
    <div>
      <p class="selectNumTip">已勾选{{ accountTotalNum }}个账号！</p>

      <div class="m-t-20">
        <el-form
          ref="form"
          :rules="rules"
          :model="formData"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="移交给：" prop="newOperatorId">
            <el-select
              v-model="formData.newOperatorId"
              placeholder="请选择人员"
              clearable
              filterable
              class="m-r-16"
            >
              <el-option
                v-for="item in transferUserList"
                :key="item.userId"
                :label="item.realname"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="移交原因：" prop="transferReason">
            <el-input v-model="formData.transferReason" type="textarea" maxlength="100" rows="4" show-word-limit clearable />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="handleConfirm"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { AccountCard, IconTip } from 'components'
import { $batchHandover, $getTransferInfo } from '@/api/operating-manage'
import { useToggle } from '@/hook'
export default defineComponent({
  props: {
    accountTotalNum: {
      type: Number,
      default() {
        return 0
      }
    },
    value: Boolean
  },
  components: {
    AccountCard,
    IconTip
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const states = reactive({
      formData: {
        newOperatorId: '',
        transferReason: ''
      },
      rules: {
        newOperatorId: {
          required: true,
          trigger: 'change',
           validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择移交人员'))
              return
            }
            callback()
          }
        }
      },
      btnLoading: false,
      transferUserList: []
    })

    // 获取移交人员的数据
    const getTransferUserList = async() => {
      try {
        const res = await $getTransferInfo({
          orgType: 1 // 海盗组织
        })
        if (+res.code === 1) {
          states.transferUserList = res.data
        }
      } catch (err) {
        $message.error(err)
      }
    }

    // 确认账号批量移交
    const handleConfirm = async() => {
      try {
        await $refs.form.validate()
        states.btnLoading = true
        const params = { ...states.formData }
        params.operationType = '账号移交'

        const res = await $batchHandover(params)
        if (+res.code === 1) {
            emit('getList')
            emit('close')
            emit('checkAllAccountTransfer')
            $message.success('操作成功')
          } else {
            $message.error(res.message)
          }
        states.btnLoading = false
      } catch (err) {
        $message.error(err)
        states.btnLoading = false
      }
    }
    getTransferUserList()
    return {
      ...toRefs(states),
      show,
      handleClose,
      handleConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .account-card__image {
    height: 58px;
    width: 58px;
  }
  .el-select{
    width: 240px;
  }
  .el-input{
    width: 240px;
  }
  .selectNumTip{
    margin:40px 0;
    margin-bottom:58px;
    font-size: 24px;
    font-weight: 600;
  }
}

</style>
