<template>
  <el-dialog
    v-loading="loading"
    title="供应商达人批量导入媒介账号库"
    :visible="show"
    width="800px"
    :append-to-body="true"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="flex m-b-10">
      <el-image
        :src="info.mcnLogo"
        class="mcn-logo m-r-10 flex-center flex"
        fit="contain"
      >
        <div slot="error">暂无</div>
      </el-image>
      <div>
        <h3>{{ info.mcnName }}</h3>
        <p class="m-t-10 flex flex-align-center">
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

    <div>
      <el-row class="m-b-10">
        <el-col :span="12">
          <span class="label">机构星图达人总数：</span>
          <span>{{ info.mcnTalentCount }}</span>
          <IconTip
            class="icontip"
            content="机构星图达人包含：抖音达人、头条创作者、西瓜创作者、火山创作者"
            icon-class="iconwenhao"
          />
        </el-col>
        <el-col :span="12">
          <span class="label">供应商联系人：</span>
          <span>{{ info.mcnContactUser }}</span>
        </el-col>
      </el-row>
      <el-row class="m-b-10">
        <el-col :span="12">
          <span class="label">机构抖音达人数：</span>
          <span>{{ info.mcnTiktokAccountCount }}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">供应商联系方式：</span>
          <span>{{ info.mcnContact }}</span>
        </el-col>
      </el-row>
      <el-row class="m-b-10">
        <el-col :span="12">
          <span class="label">已添加为媒介账号：</span>
          <span>{{ info.mcnAccountCount }}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">返点：</span>
          <span>{{ info.rebate === 0 ? 0 : (info.rebate || '--') }}%</span>
        </el-col>
      </el-row>
      <el-row class="m-b-10">
        <el-col :span="12">
          <span class="label">可导入为媒介账号：</span>
          <span>{{ info.waitAddMediumCount }}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">媒介采买人：</span>
          <span>{{ info.mcnResponsibleUserName }}</span>
        </el-col>
      </el-row>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确认导入</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs } from '@vue/composition-api'
import { $getMediumMechanismInfo, $batchExportMechanismAccount } from '@/api/bussiness-manage'
import { IconTip } from 'components'

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
    IconTip
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy

    const data = reactive({
      loading: false,
      info: {},
      btnLoading: false
    })

    onMounted(async() => {
      try {
        data.loading = true
        const res = await $getMediumMechanismInfo({ mechanismId: props.id })
        data.loading = false
        const { code, message } = res
        if (+code === 1) {
          data.info = res.data
        } else {
          $message.error(message)
        }
      } catch (err) {
        data.loading = true
        $message.error(err)
      }
    })

    const handleConfirm = async() => {
      try {
        data.btnLoading = true
        const res = await $batchExportMechanismAccount({ mechanismId: props.id })
        data.btnLoading = false
        const { code, message } = res
        if (+code === 1) {
          $message.success('导入成功')
          emit('confirm')
          emit('close')
        } else {
          $message.error(message)
        }
      } catch (err) {
        data.btnLoading = false
        $message.error(err)
      }
    }

    const handleClose = () => {
      emit('close')
    }

    return {
      ...toRefs(data),
      handleClose,
      handleConfirm
    }
  }
})
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

.label {
  width: 130px;
  display: inline-block;
  text-align: right;
}

.icontip {
  margin-left: 6px;
}
</style>
