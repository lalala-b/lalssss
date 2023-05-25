<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="880px"
    :title="dialogType === 'view' ? '查看达人沟通记录' : '填写达人沟通记录'"
    :visible.sync="showDialog"
    @close="handleClose"
  >
    <div class="containerWrap">
      <div class="formWrap">
        <el-form
          ref="recordForm"
          label-width="134px"
          :model="recordForm"
          :rules="dialogType === 'view' ? {} : recordFormRules"
          label-position="top"
          class="norm-form"
        >
          <template>
            <el-form-item label="本次沟通结果" prop="result">
              <el-select
                v-model="recordForm.result"
                :disabled="dialogType === 'view' ? true : false"
                @change="handleCommunicateRes"
              >
                <el-option
                  v-for="item in communicateResList"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>

            </el-form-item>

            <el-form-item v-if="showDescribeSelect" label="具体原因" prop="describeList">
              <el-select
                v-model="recordForm.describeList"
                :disabled="dialogType === 'view' ? true : false"
                multiple
              >
                <el-option
                  v-for="item in describeList"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </el-form-item>

            <el-row>
              <el-col :span="24">
                <el-form-item label="详细记录" prop="note">
                  <el-input v-model="recordForm.note" placeholder="仅支持200字以内" :disabled="dialogType === 'view' ? true : false" type="textarea" show-word-limit maxlength="200" row="8" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item v-if="dialogType === 'edit'">
              <div class="formBtnWrap">
                <el-button @click="handleClose">取消</el-button>
                <el-button :loading="btnLoading" type="primary" @click="handleSubmit">提交</el-button>
              </div>
            </el-form-item>
          </template>
        </el-form>
      </div>

      <div v-loading="historyRecordLoading" class="historyRecordWrap">
        <h3>历史沟通记录</h3>

        <ul v-if="historyRecordList.length" class="recordList">
          <li v-for="item in historyRecordList" :key="item.id">
            <div class="top">
              <img v-if="item.avatar" :src="item.avatar" alt="">
              <i v-else class="el-icon-user-solid" />
              <div>
                <p>{{ item.communicatorName }}</p>
                <p>{{ item.createTime }}</p>
              </div>
            </div>

            <div class="tag">
              <el-tag type="danger" size="mini">{{ item.result }}</el-tag>
              <el-tag v-for="describeItem in item.describeList" :key="describeItem" type="danger" size="mini">{{ describeItem }}</el-tag>
            </div>

            <div v-if="item.note" class="recordText" :title="item.note">{{ item.note }}</div>
            <div v-else style="color: rgba(0,0,0,.5)">无其他详细记录</div>
          </li>
        </ul>

        <div v-else class="noData">暂无历史沟通记录 ~</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { $addAccountCommunicate, $getAccountCommunicateList, $getCommunicateResList, $getDescribeList } from '@/api/sign-progress'

export default {
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    id: {
      type: String,
      default() {
        return ''
      }
    },
    dialogType: {
      type: String,
      default: 'edit'
    }
  },
  data() {
    return {
      recordFormRules: {
        result: [{ required: true, message: '请选择本次沟通结果', trigger: 'change' }],
        describeList: [{ required: true, message: '请选择具体原因', trigger: 'change' }]
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      recordForm: {
        result: undefined,
        describeList: [],
        note: ''
      },
      historyRecordList: [],
      communicateResList: [],
      describeList: [],
      showDescribeSelect: true,
      historyRecordLoading: false,
      btnLoading: false
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.getAccountCommunicateList()
    this.getCommunicateResList()
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
    },

    // 获取沟通结果下拉的列表数据
    async getCommunicateResList() {
      const { code, data } = await $getCommunicateResList({
        'dictTypes': ['sign_sche_result_list']
      })
      if (+code === 1) {
        this.communicateResList = data['sign_sche_result_list']
      }
    },

    // 处理本次沟通结果选择后的逻辑
    async handleCommunicateRes(val) {
      try {
        if (+val === 3) {
          this.showDescribeSelect = false
          this.recordForm.describeList = []
          return
        } else {
          this.showDescribeSelect = true
        }
        const { code, data, message = '' } = await $getDescribeList({
          dictValue: val
        })
        if (+code === 1) {
          this.describeList = data
          this.recordForm.describeList = []
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.$message.error(e?.message)
      }
    },

    // 获取历史沟通人列表信息
    async getAccountCommunicateList() {
      try {
        this.historyRecordLoading = true
        const { code, data, message = '' } = await $getAccountCommunicateList({
          accountId: this.id
        })
        this.historyRecordLoading = false
        if (+code === 1) {
          this.historyRecordList = data
          if (this.dialogType === 'view') {
            this.recordForm.result = this.historyRecordList[0]?.result
            this.recordForm.describeList = this.historyRecordList[0]?.describeList
            this.recordForm.note = this.historyRecordList[0]?.note
          }
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.historyRecordLoading = false
        this.$message.error(e?.message)
      }
    },

    handleSubmit() {
      this.$refs['recordForm'].validate(async valid => {
        if (valid) {
          try {
            this.btnLoading = true
            const params = { ...this.recordForm }
            params.accountId = +this.id
            const { code, message = '' } = await $addAccountCommunicate({ ...params })
            this.btnLoading = false
            if (+code === 1) {
              this.$message.success('提交成功')
              this.recordForm.result = undefined
              this.recordForm.describeList = []
              this.recordForm.note = ''
              this.showDescribeSelect = true
              this.getAccountCommunicateList()
              this.$emit('getList')
              this.$refs['recordForm'].resetFields()
            } else {
              this.$message.error(message)
            }
          } catch (e) {
            this.btnLoading = false
            this.$message.error(e?.message)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.containerWrap {
  display: flex;

  .formWrap {
    width: 45%;
    border-right: 1px solid rgba(0,0,0,.3);
    padding-right:20px;
    margin-right: 20px;
  }

  .historyRecordWrap {
    width: 50%;

    h3 {
      font-size: 20px;
    }

    .recordList {
      margin-top: 6px;
      height: 520px;
      overflow: auto;

      li {
        width: 100%;
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
        margin-top: 14px;
        padding-left: 10px;
        border-radius: 6px;
        cursor: default;

        .top {
          display: flex;
          font-weight: 600;
          display: flex;
          align-items: center;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }

          i {
            font-size: 36px;
            margin-right: 16px
          }

          p {
            margin-top: 4px;
            font-size: 14px;
          }
        }

        .tag {
          margin: 8px 0;

          .el-tag {
            margin-right: 10px;
            margin-top: 6px;
          }
        }

        .recordText {
          font-weight: 600;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}

.formBtnWrap {
  text-align: right;
}

::v-deep {
  .el-textarea {
    textarea {
        height: 250px
    }
  }
}

.noData {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
}
</style>
