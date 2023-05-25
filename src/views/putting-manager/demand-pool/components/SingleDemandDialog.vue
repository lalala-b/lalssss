<template>
  <div>
    <el-dialog title="移交需求" :visible="show" :before-close="close" width="720px">
      <AccountCard :info="data" />
      <el-row class="col">
        <el-col :span="12">
          <span>需求提报人：</span>
          <span>{{ data.advertiserRealname || '--' }}</span>
        </el-col>
        <el-col :span="12">
          <el-form
            ref="form"
            label-width="80px"
            :model="form"
            :rules="formRules"
          >
            <template>
              <el-form-item label="投放专员" prop="commissioner">
                <div class="header">
                  <div>
                    <el-select
                      v-model="form.commissioner"
                      filterable
                    >
                      <el-option
                        v-for="item in list"
                        :key="item.userId"
                        :value="item.userId"
                        :label="item.realname"
                      />
                    </el-select>
                  </div>
                </div>
              </el-form-item>
            </template>
          </el-form>
        </el-col>
      </el-row>

      <el-row class="col">
        <el-col :span="12">
          <span>计费方式：</span>
          <span>{{ data.chargeTypeDesc || '--' }}</span>
        </el-col>
        <el-col :span="12">
          <span>合作单量：</span>
          <span>{{ data.coopOrderMaxNum || '--' }}</span>
        </el-col>
      </el-row>

      <el-row class="col">
        <el-col :span="12">
          <span>预期投放价格：</span>
          <span>{{ data.preDeliveryAmountMin }}~{{ data.preDeliveryAmountMax }}</span>
        </el-col>
        <el-col :span="12">
          <span>预计发布时间：</span>
          <span>{{ data.preReleaseVideoTime |emptyFill }}</span>
        </el-col>
      </el-row>

      <el-row class="col">
        <el-col :span="12">
          <span>品牌标签：</span>
          <span>{{ data.brandTagStr || '--' }}</span>
        </el-col>
        <el-col :span="12">
          <span>业务标签：</span>
          <span>{{ data.businessTag || '--' }}</span>
        </el-col>
      </el-row>

      <el-row class="col">
        <el-col :span="12">
          <span>视频类型：</span>
          <span><span>{{ data.junType || '--' }}</span></span>
        </el-col>
        <el-col v-if="data.businessTag === 'B2C'" :span="12">
          <span>产品型号：</span>
          <span><span>{{ data.b2cPhoneModel || '--' }}</span></span>
        </el-col>
        <el-col :class="[data.businessTag === 'B2C' && 'm-t-20']" :span="12">
          <span>备注：</span>
          <span>{{ data.remark || '--' }}</span>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import AccountCard from '@/components/AccountCard'
import { $singleHandOverDemand } from '@/api/putting-manager'

export default {
  components: {
    AccountCard
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    getList: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      formRules: {
        commissioner: [{ required: true, message: '请选择投放专员', trigger: 'blur' }]
      },
      form: {
        commissioner: ''
      },
      btnLoading: false
    }
  },
  watch: {
    data(val) {
      if (val) {
        this.form.commissioner = this.data.commissionerUserId || ''
      }
    }
  },
  methods: {
    close() {
      this.$emit('onClose')
    },

    dialogConfirm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          const { id, commissionerUserId, commissionerRealname } = this.data
          if (+commissionerUserId === +this.form.commissioner) {
            this.$message.error('待移交专员与待承接专员不可为同一人')
            return
          }

          const params = {
            id,
            nowRequirementRequestId: commissionerUserId,
            nowRequirementRequestName: commissionerRealname,
            targetRequirementRequestId: this.form.commissioner,
            targetRequirementRequestName: this.list.find(item => +item.userId === +this.form.commissioner).realname
          }

          this.btnLoading = true

          try {
            const { code, message } = await $singleHandOverDemand(params)

            this.btnLoading = false

            if (+code === 1) {
              this.$message.success('需求移交成功')
              this.close()
              this.$emit('getList')
            } else {
              this.$message.error(message || '需求移交失败')
            }
          } catch (e) {
            this.btnLoading = false
            this.$message.error(e)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.col, .norm-form {
  margin-top: 20px;
}
::v-deep{
  .el-form-item{
    margin-bottom: 0px;
  }
}
</style>
