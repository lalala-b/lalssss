<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="700px"
    :before-close="handleClose"
  >
    <div>
      <div v-if="editType==='batchEdit'">
        <p class="selectNumTip">已勾选{{ selectionArr.length }}个账号！</p>
      </div>
      <div v-else>
        <AccountCard :info="row">
          <template v-slot>
            <p v-if="row.platId" class="account-txt">{{ [25,26].includes(row.platId)?row.platName+'号':'ID' }}：{{ row.uniqueId || row.eid || row.getDataUrl || '--' }}</p>
            <div
              v-if="row.upUpNameAndLeader"
              class="m-t-5"
              style="text-align: left"
            >
              <el-tag size="mini" type="danger">{{
                row.upUpNameAndLeader
              }}</el-tag>
            </div>
          </template>
        </AccountCard>
      </div>
      <div class="m-t-20">
        <el-form
          ref="form"
          :rules="rules"
          :model="formData"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="SOP类型:">
            <el-select
              v-model="formData.sopType"
              placeholder="请选择账号内容对应SOP类型"
              clearable
              filterable
              class="m-r-16"
            >
              <el-option
                v-for="item in sopList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formData.phone" maxlength="11" placeholder="请输入手机号" clearable />
          </el-form-item>
          <el-form-item label="账号统一名称">
            <el-input v-model="formData.belongName" maxlength="11" placeholder="账号统一名称" clearable />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="save"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  computed
} from '@vue/composition-api'
import { AccountCard, IconTip } from 'components'
import { $editAccountInfo } from '@/api/operating-manage'
import { $getDataByDictType } from '@/api'
import { useToggle } from '@/hook'
export default defineComponent({
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    selectionArr: {
      type: Array,
      default() {
        return []
      }
    },
    value: Boolean
  },
  components: {
    AccountCard,
    IconTip
  },
  setup(props, { emit }) {
    const MOBILE_REG_EXP = /^1\d{10}$/
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const { sopType = '', phone = '', belongName = '' } = props.row
    const editType = props.selectionArr.length && Object.keys(props.row).length === 0 ? 'batchEdit' : 'edit'
    const states = reactive({
      formData: {
        sopType,
        phone,
        belongName
      },
      rules: {
        phone: {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的手机号'))
              return
            }
            callback()
          }
        }
      },
      btnLoading: false,
      sopList: []
    })
    const title = computed(() => {
      return editType === 'batchEdit' ? '批量编辑' : '编辑'
    })
    const getByDictSopType = () => {
      $getDataByDictType({
        dictTypes: ['haidao_sop_type']
      }).then(res => {
        if (res.data) {
          states.sopList = res.data.haidao_sop_type || []
        }
      })
    }

    const save = async function() {
      try {
        await $refs.form.validate()
        states.btnLoading = true
        const params = { ...states.formData }
        if (editType === 'batchEdit') {
          const accountIdArr = props.selectionArr.map(item => {
            return item.accountId
          })
          params['accountIdList'] = accountIdArr
        } else {
          params['accountId'] = props.row.accountId
        }
        const res = await $editAccountInfo(params)
        if (+res.code === 1) {
            emit('getList')
            emit('close')
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
    getByDictSopType()
    return {
      title,
      editType,
      ...toRefs(states),
      show,
      handleClose,
      save
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
  }
}

</style>
