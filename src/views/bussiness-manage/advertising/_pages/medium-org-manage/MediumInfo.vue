<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="500px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div class="flex">
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
          <span class="m-r-24">机构达人数：{{ info.mcnTalentCount }}</span>
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
    <div class="m-t-10">
      <span class="title">媒介采买人：</span>
      <span v-if="!isEdit">{{ info.mcnResponsibleUserName || '暂无' }}</span>
      <el-select v-else v-model="mcnResponsibleUserId" :clearable="true">
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.realname"
          :value="item.userId"
        />
      </el-select>
    </div>
    <div class="m-t-10">
      <span class="title">年框合作：</span>
      <span v-if="!isEdit">{{
        info.cooperationYearFrameFlag ? '合作' : '--'
      }}</span>
      <el-checkbox
        v-else
        v-model="cooperationYearFrameFlag"
        class="checkBox"
        :true-label="1"
        :false-label="null"
      />
    </div>

    <div
      v-if="isEdit ? cooperationYearFrameFlag : info.cooperationYearFrameFlag"
      class="m-t-10"
    >
      <div v-if="!isEdit">
        <span class="title">合作周期：</span>
        <span>{{ info.cooperationCycle || '--' }}</span>
      </div>
      <div v-else>
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item prop="cooperationCycle">
            <template slot="label">
              <span>合作周期：</span>
            </template>
            <el-date-picker
              v-model="form.cooperationCycle"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-if="isEdit" class="flex flex-justify-end m-t-24">
      <el-button @click="handleCancel">取消</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="handleSave"
      >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $editMediuOrg } from '@/api/bussiness-manage'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      mcnResponsibleUserId: '',
      cooperationYearFrameFlag: '',
      rules: {
        cooperationCycle: [
          { required: true, message: '请选择合作周期', trigger: 'blur' },
          { required: true, message: '请选择合作周期', trigger: 'change' }
        ]
      },
      form: {
        cooperationCycle: []
      },
      btnLoading: false
    }
  },
  computed: {
    title() {
      return this.isEdit ? '编辑机构信息' : '查看机构信息'
    },
    show: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    // cooperationYearFrameFlag(val) {
    //   if (!val) {
    //     this.form.cooperationCycle = []
    //   }
    // }
  },
  created() {
    if (this.info) {
      this.mcnResponsibleUserId = this.info.mcnResponsibleUserId || ''
      this.cooperationYearFrameFlag = this.info.cooperationYearFrameFlag ? 1 : 0
      if (this.info.cooperationCycle && this.info.cooperationCycle.includes('至')) {
      this.form.cooperationCycle = this.info.cooperationCycle.split('至')
    } else {
      this.form.cooperationCycle = []
    }
    }
  },
  methods: {
    handleCancel() {
      this.show = false
    },
    async handleSave() {
      try {
        if (this.$refs.form) await this.$refs.form.validate()
        let cooperationCycle = ''
        if (this.cooperationYearFrameFlag && this.form.cooperationCycle) {
          console.log(this.form.cooperationCycle)
          const time = this.form.cooperationCycle
          cooperationCycle = `${time[0]}至${time[1]}`
        } else {
          cooperationCycle = ''
        }
        console.log('年框合作', this.cooperationYearFrameFlag)
        this.btnLoading = true
        const params = {
          id: this.info.id,
          mcnResponsibleUserId: this.mcnResponsibleUserId,
          cooperationYearFrameFlag: this.cooperationYearFrameFlag || 0,
          cooperationCycle: cooperationCycle
        }
        console.log('编辑接口-----', params)
        const res = await $editMediuOrg(params)
        if (res.code === 1) {
          this.btnLoading = false
          this.$message.success('编辑成功')
          this.handleCancel()
          this.$emit('update')
        } else {
          this.btnLoading = false
          this.$message.error(res.message || '编辑失败')
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
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
