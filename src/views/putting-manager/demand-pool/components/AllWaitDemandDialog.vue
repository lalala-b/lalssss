<template>
  <div>
    <el-dialog title="批量移交待处理需求" :visible="show" :before-close="close" width="720px">
      <div v-loading="dialogLoading">
        <div class="header">
          <!-- <div>
            <span>投放专员：</span>
            <span>{{ name || '--' }}</span>
          </div>

          <div>
            <span>待处理需求数量：</span>
            <span>{{ count === '' ? '--' : count }}</span>
          </div> -->
        </div>
        <div class="form">
          <el-form
            ref="form"
            label-width="140px"
            :model="form"
            :rules="formRules"
            class="norm-form"
          >
            <template>
              <el-form-item label="待移交 投放专员" prop="waitCommissioner">
                <div class="header">
                  <div>
                    <el-select
                      v-model="form.waitCommissioner"
                      filterable
                      @change="handleChangeWaitCommissioner"
                    >
                      <el-option
                        v-for="item in waitList"
                        :key="item.userId"
                        :value="item.userId"
                        :label="item.realname"
                      />
                    </el-select>
                  </div>

                  <div>
                    <span>待移交需求数量：</span>
                    <span>{{ waitCount === '' ? '--' : waitCount }}</span>
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="待承接 投放专员" prop="commissioner">
                <div class="header">
                  <div>
                    <el-select
                      v-model="form.commissioner"
                      filterable
                      @change="handleChangeCommissioner"
                    >
                      <el-option
                        v-for="item in list"
                        :key="item.id"
                        :value="item.id"
                        :label="item.realName"
                      />
                    </el-select>
                  </div>

                  <div>
                    <span>承接前已有未完结需求：</span>
                    <span>{{ count === '' ? '--' : count }}</span>
                  </div>
                </div>
              </el-form-item>
            </template>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="close">取 消</el-button>
            <el-button :loading="btnLoading" type="primary" @click="dialogConfirm">确 定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { $getDemandCount, $batchHandOverDemand } from '@/api/putting-manager'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    waitList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formRules: {
        waitCommissioner: [{ required: true, message: '请选择待移交投放专员', trigger: 'blur' }],
        commissioner: [{ required: true, message: '请选择待承接投放专员', trigger: 'blur' }]
      },
      form: {
        commissioner: '',
        waitCommissioner: ''
      },
      count: '',
      waitCount: '',
      btnLoading: false,
      dialogLoading: false
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.count = ''
        this.waitCount = ''
        this.form.commissioner = ''
        this.form.waitCommissioner = ''
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
          const { commissioner, waitCommissioner } = this.form
          if (commissioner === waitCommissioner) {
            this.$message.error('待移交专员与待承接专员不可为同一人')
            return
          }

          const params = {
            nowRequirementRequestId: waitCommissioner,
            nowRequirementRequestName: this.waitList.find(item => +item.userId === +waitCommissioner).realName,
            targetRequirementRequestId: commissioner,
            targetRequirementRequestName: this.list.find(item => +item.id === +commissioner).realname
          }

          this.btnLoading = true

          try {
            const { code, message } = await $batchHandOverDemand(params)

            this.btnLoading = false

            if (+code === 1) {
              this.$message.success('批量移交成功')
              this.close()
              this.$emit('getList')
            } else {
              this.$message.error(message || '批量移交失败')
            }
          } catch (e) {
            this.btnLoading = false
            this.$message.error(e)
          }
        }
      })
    },

    async handleChangeWaitCommissioner(val) {
      this.dialogLoading = true
      const { code, data } = await $getDemandCount({ userId: val })
      this.dialogLoading = false
      if (+code === 1) {
        this.waitCount = data
      } else {
        this.waitCount = ''
      }
    },

    async handleChangeCommissioner(val) {
      this.dialogLoading = true
      const { code, data } = await $getDemandCount({ userId: val })
      this.dialogLoading = false
      if (+code === 1) {
        this.count = data
      } else {
        this.count = ''
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.header{
  display: flex;

  & > div{
    flex: 1
  }
  // justify-content: space-between;
}

.form {
  margin-top: 30px;
}
</style>
