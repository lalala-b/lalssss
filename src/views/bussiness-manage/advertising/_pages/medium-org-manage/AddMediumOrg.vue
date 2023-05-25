<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="600px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div v-if="type !== 'add'" class="flex m-b-10">
      <el-image
        :src="info.mcnLogo"
        class="mcn-logo m-r-10 flex-center flex"
        fit="contain"
      >
        <div slot="error">暂无</div>
      </el-image>
      <div>
        <h3>{{ info.mcnName }}</h3>
        <p v-if="info.isStatus !== 1" class="m-t-10">
          <span class="m-r-24">供应商达人数：{{ info.mcnTalentCount }}</span>
          <span>粉丝数：{{ info.mcnFans | toThousandsW }}</span>
        </p>
        <p class="m-t-10 flex flex-align-center">
          <span class="m-r-10">
            已添加媒介账号：{{ info.mcnAccountCount }}</span>
          <el-tooltip
            v-for="item in info.coverPlatInfo"
            :key="item.paltId"
            class="account-icon-wrap"
            effect="dark"
            :content="item.platName"
            placement="top"
          >
            <el-image
              fit="contain"
              class="plat-img"
              :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${item.platId}.png`"
            />
          </el-tooltip>
        </p>
      </div>
    </div>

    <el-form
      ref="form"
      label-width="130px"
      :rules="rules"
      :model="formData"
    >
      <el-form-item label="供应商名称" prop="mcnName">
        <el-input v-if="!isView" v-model="formData.mcnName" placeholder="请输入供应商名称" maxlength="20" />
        <span v-else>{{ formData.mcnName || '--' }}</span>
      </el-form-item>

      <el-form-item label="供应商类型" prop="mcnType">
        <el-select v-if="!isView" v-model="formData.mcnType" placeholder="请选择供应商类型">
          <el-option v-for="item in mcnTypeArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-else>{{ mcnTypeArr.find(item => +item.value === +formData.mcnType).label || '--' }}</span>
      </el-form-item>

      <el-form-item label="供应商联系人" prop="mcnContactUser">
        <el-input v-if="!isView" v-model="formData.mcnContactUser" placeholder="请输入供应商联系人" maxlength="10" />
        <span v-else>{{ formData.mcnContactUser || '--' }}</span>
      </el-form-item>

      <el-form-item label="供应商联系方式" prop="mcnContact">
        <el-input v-if="!isView" v-model="formData.mcnContact" placeholder="请输入供应商联系方式" maxlength="20" onkeyup="value=value.replace(/[\W]/g,'').slice(0, 20)" />
        <span v-else>{{ formData.mcnContact || '--' }}</span>
      </el-form-item>

      <el-form-item label="返点" prop="rebate">
        <el-input-number
          v-if="!isView"
          v-model="formData.rebate"
          :precision="1"
          :min="0"
        />
        <span v-else>{{ formData.rebate === 0 ? 0 : (formData.rebate || '--') }}</span>
        %
      </el-form-item>

      <el-form-item label="账期" prop="paymentDays">
        <el-input-number
          v-if="!isView"
          v-model="formData.paymentDays"
          :precision="0"
          :min="1"
        />
        <span v-else>{{ formData.paymentDays || '--' }}</span>
        天
      </el-form-item>

      <el-form-item label="税点" prop="taxPoint">
        <el-input-number
          v-if="!isView"
          v-model="formData.taxPoint"
          :precision="1"
          :min="0"
        />
        <span v-else>{{ formData.taxPoint || 0 }}</span>
        %
      </el-form-item>

      <el-form-item label="合同" prop="contract">
        <!--
        :before-upload="beforeUploadAccount"
          :on-success="uploadAccountSuccess"
          :on-error="uploadAccountError" -->

        <!-- :action="`/api/business/order/uploadAccountData?opportunityId=${opportunityId}`" -->
        <template v-if="!isView">
          <el-upload
            v-if="!formData.contractUrl"
            class="upload-view"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :limit="1"
            :show-file-list="false"
            action="/api/business/order/uploadContract"
          >
            <el-button :loading="uploadLoaing" size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div v-else class="contract">
            <a :href="formData.contractUrl" target="_blank" underline="false">{{ formData.contractUrl }}</a>
            <span @click="handleRemoveContract">
              <i class="el-icon-delete" />
            </span>
          </div>
        </template>
        <template v-else>
          <a v-if="formData.contractUrl" :href="formData.contractUrl" target="_blank" underline="false">{{ formData.contractUrl }}</a>
          <span v-else>--</span>
        </template>

      </el-form-item>

      <el-form-item label="媒介采买人" prop="mcnResponsibleUserId">
        <el-select v-if="!isView" v-model="formData.mcnResponsibleUserId" :clearable="true">
          <el-option v-for="item in list" :key="item.userId" :label="item.realname" :value="item.userId" />
        </el-select>
        <span v-else>{{ formData.mcnResponsibleUserName }}</span>
      </el-form-item>
      <el-form-item label="年框合作">
        <el-checkbox
          v-if="!isView"
          v-model="formData.cooperationYearFrameFlag"
          class="checkBox"
          :true-label="1"
          :false-label="null"
        />
        <span v-else>{{ +formData.cooperationYearFrameFlag ? '是' : '否' }}</span>
      </el-form-item>
      <el-form-item v-if="formData.cooperationYearFrameFlag" label="合作周期" prop="cooperationCycle">
        <el-date-picker
          v-if="!isView"
          v-model="formData.cooperationCycle"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
        <span v-else>{{ formData.cooperationCycle }}</span>
      </el-form-item>
    </el-form>
    <div v-if="!isView" slot="footer">
      <el-button @click="handleCancel">取消</el-button>
      <el-button v-loading="btnLoading" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $addMediuOrg, $editMediuOrg } from '@/api/bussiness-manage'
import { $getMediumOrgCondition } from '@/api/bussiness-manage'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: String,
      default: 'add'
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {
        mcnResponsibleUserId: '',
        mcnResponsibleUserName: '',
        mcnName: '',
        mcnType: '',
        mcnContactUser: '',
        mcnContact: '',
        rebate: '',
        // paymentDays: '',
        taxPoint: 0,
        contractUrl: '',
        cooperationYearFrameFlag: '',
        cooperationCycle: ''
      },
      mcnTypeArr: [
        {
          value: 1,
          label: '机构'
        },
        {
          value: 0,
          label: '个人'
        },
        {
          value: 2,
          label: 'KOC/线下合作'
        }
      ],
      list: [],
      uploadLoaing: false,
      rules: {
        mcnName: [{ required: true, message: '请输入供应商名称', trigger: 'blur' }],
        mcnType: [{ required: true, message: '请选择供应商类型', trigger: ['blur', 'change'] }],
        mcnContactUser: [{ required: true, message: '请输入供应商联系人', trigger: ['blur', 'change'] }],
        mcnContact: [{ required: true, message: '请输入供应商联系方式', trigger: ['blur', 'change'] }],
        rebate: [{ required: true, message: '请输入返点', trigger: ['blur', 'change'] }],
        cooperationCycle: [
          { required: true, message: '请选择合作周期', trigger: 'blur' },
          { required: true, message: '请选择合作周期', trigger: 'change' }
        ],
        mcnResponsibleUserId: [{ required: true, message: '请选择媒介采买人', trigger: ['blur', 'change'] }]
      },
      btnLoading: false
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    title() {
      return this.type === 'add' ? '添加供应商信息' : this.type === 'edit' ? '编辑供应商信息' : '查看供应商信息'
    },
    isView() {
      return this.type === 'view'
    }
  },
  created() {
    if (this.userList?.length === 0) {
      this.getCondition()
    } else {
      this.list = this.userList
    }

    if (this.type !== 'add' && Object.keys(this.info).length) {
      const {
        mcnResponsibleUserId,
        mcnName,
        mcnType,
        mcnContactUser,
        mcnContact,
        rebate,
        paymentDays,
        taxPoint = 0,
        contractUrl,
        cooperationYearFrameFlag,
        cooperationCycle,
        mcnResponsibleUserName
      } = this.info

      this.formData = {
        mcnResponsibleUserId,
        mcnResponsibleUserName,
        mcnName,
        mcnType,
        mcnContactUser,
        mcnContact,
        rebate,
        paymentDays,
        taxPoint,
        contractUrl,
        cooperationYearFrameFlag,
        cooperationCycle
      }
    }
  },
  methods: {
    handleCancel() {
      this.show = false
    },
    async handleSave() {
      try {
        await this.$refs.form.validate()
        const params = {
          ...this.formData
        }

        if (+params.cooperationYearFrameFlag && params.cooperationCycle) {
          const time = params.cooperationCycle
          if (typeof params.cooperationCycle !== 'string') {
            params.cooperationCycle = `${time[0]}至${time[1]}`
          }
        } else {
          params.cooperationCycle = ''
        }

        const api = this.type === 'add' ? $addMediuOrg : $editMediuOrg

        if (this.type === 'edit') {
          params.id = this.info.id
          params.cooperationYearFrameFlag = params.cooperationYearFrameFlag || 0
        }
        this.btnLoading = true
        const res = await api(params)
        this.btnLoading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.show = false
          this.$emit('update')
          this.$bus.$emit('updateMediumOrg')
        } else {
          this.$message.error(res.message || '系统出错')
        }
      } catch (err) {
        if (err === false) return
        this.btnLoading = false
        this.$message.error(err.message || '系统出错')
      }
    },
    getCondition() {
      $getMediumOrgCondition().then(res => {
        if (res.code === 1) {
          this.list = res.data.userInfos
        }
      })
    },

    uploadSuccess(res) {
      if (res.code === 1) {
        this.formData.contractUrl = res.data.url
      } else {
        this.$message.error(res.message)
      }
      this.uploadLoaing = false
    },
    uploadBefore() {
      this.uploadLoaing = true
    },
    handleRemoveContract() {
      this.formData.contractUrl = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-dialog__footer {
      text-align: right;
    }
  }

  .contract {
    > a {
    display: inline-block;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    }

    > span {
      margin-left: 10px;
      vertical-align: top;
      cursor: pointer;

      > i {
        margin-right: 2px;
        vertical-align: middle;
        cursor: pointer;

        &:hover {
          color: blue;
        }
      }
    }
  }

  .mcn-logo {
    flex-shrink: 0;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid #f1f2f2;
  }
  .account-icon-wrap {
    width: 25px;
    height: 25px;
    margin-left: 5px;
  }

  .title {
    display: inline-block;
    width: 88px;
    text-align: right;
    margin-right: 12px;
  }
</style>
