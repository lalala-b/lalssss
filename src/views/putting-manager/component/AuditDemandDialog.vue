<template>
  <el-dialog
    width="800px"
    title="审核投放需求"
    :visible="show"
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading"
      :model="formData"
      inline
      label-suffix="："
      class="demand m-t-24"
      label-width="180px"
    >
      <el-row>
        <el-col :span="18">
          <el-form-item class="w-100" label="账号信息">
            <div class="account-box">
              <AccountCard :info="data" />
              <div class="icon-container">
                <el-tooltip
                  v-if="formData.videoCount"
                  class="item"
                  effect="dark"
                  content="新投放视频库"
                  placement="top-start"
                >
                  <i
                    class="iconfont iconshipin m-r-12"
                    style="color:#2c64ff"
                    @click="handleToNewVideo"
                  />
                </el-tooltip>
                <el-tooltip
                  v-if="formData.videoCount"
                  class="item"
                  effect="dark"
                  content="投放视频库"
                  placement="top-start"
                >
                  <i class="iconfont iconshipin" @click="handleToVideo" />
                </el-tooltip>
              </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div>实际视频发布次数：{{ formData.videoCount }}</div>
        </el-col>
      </el-row>
      <div class="crowed">
        <h3 class="crowed-h">人群画像</h3>
        <div class="crowed-box">
          <p class="crowed-title">通用</p>
          <el-form-item label="年龄占比">
            {{ crowedData.ageProportion | emptyFill }}
            <IconTip
              type="popover"
              content="18-40岁"
              icon-class="iconwenhao"
            />
          </el-form-item>
          <el-form-item label="一二线城市占比">
            {{
              crowedData.firstAndSecondLineCityProportion | emptyFill
            }}
          </el-form-item>
          <p class="crowed-title">抖音</p>
          <el-form-item label="五大人群占比">
            {{ crowedData.fiveGroupsProportion | emptyFill }}
            <IconTip
              type="popover"
              content="都市白领+资深中产+都市蓝领+精致妈妈+Z世代占比合计"
              icon-class="iconwenhao"
            />
          </el-form-item>
          <el-form-item label="负向指标占比">
            {{
              crowedData.negativeIndicatorProportion | emptyFill
            }}
            <IconTip
              type="popover"
              content="都市银发+中老年占比合计"
              icon-class="iconwenhao"
            />
          </el-form-item>
          <el-form-item label="近30天粉丝观看频次">
            {{
              crowedData.viewingFrequencyProportion | emptyFill
            }}
            <IconTip
              type="popover"
              content="1次以下占比"
              icon-class="iconwenhao"
            />
          </el-form-item>
          <p class="m-t-16 crowed-title">快手</p>
          <el-form-item label="手机设备价格占比">
            {{
              crowedData.phonePriceProportion | emptyFill
            }}
            <IconTip
              type="popover"
              content="2000-5000以上"
              icon-class="iconwenhao"
            />
          </el-form-item>
          <el-form-item label="其他年龄占比">
            {{
              crowedData.otherAgeProportion | emptyFill
            }}
          </el-form-item>
        </div>
      </div>
      <h3 class="crowed-h">需求信息</h3>
      <el-form-item label="广告师">{{
        formData.advertiserRealname
      }}</el-form-item>
      <el-form-item label="投放专员">{{
        formData.commissionerRealname
      }}</el-form-item>
      <el-form-item label="计费方式">
        {{ getChargeType(formData.chargeType) }}
      </el-form-item>
      <el-form-item label="合作单量" prop="coopOrderMaxNum">
        {{ formData.coopOrderMaxNum | emptyFill }}
      </el-form-item>
      <el-form-item class="w-100" label="预期投放价格">
        {{ formData.preDeliveryAmountMin | emptyFill }}
        <span class="m-l-5 m-r-5">～</span>
        {{ formData.preDeliveryAmountMax | emptyFill }}
      </el-form-item>
      <el-form-item class="w-100" label="预计发布时间">
        {{ formData.preReleaseVideoTime | emptyFill }}
      </el-form-item>
      <el-form-item label="品牌标签" prop="brandTag">
        {{
          formData.brandTag === 'zz_putting_business_tag' ? '转转' : '找靓机'
        }}
      </el-form-item>
      <el-form-item label="业务标签" prop="businessTag">
        {{ formData.businessTag | emptyFill }}
      </el-form-item>
      <el-form-item label="视频类型" prop="junType">
        {{ formData.junType | emptyFill }}
      </el-form-item>
      <el-form-item v-if="formData.businessTag === 'B2C'" label="产品型号">
        <el-cascader
          v-model="formData.b2cPhoneModelId"
          placeholder=""
          :options="modelData"
          class="cascader-box"
          :props="{
            value: 'modelId',
            label: 'modelName',
            children: 'phoneModelVOList',
            emitPath: false,
          }"
          disabled
          :filter-method="dataFilter"
        />
      </el-form-item>
      <el-form-item
        v-if="formData.remark"
        class="w-100"
        label="备注"
        prop="remark"
      >
        <div>{{ formData.remark }}</div>
      </el-form-item>
      <!-- <el-form-item class="item-pass" label="需求是否通过">
        <el-radio-group v-model="formData.requirementExamineStatus">
          <el-radio :label="2">是</el-radio>
          <el-radio :label="3">否</el-radio>
          <el-radio :label="4">待定</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item class="w-100" label="审核备注">
        <el-input
          v-model="formData.requirementExamineRemark"
          :maxlength="200"
          type="textarea"
          placeholder="长度限制200"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button
        :loading="loading"
        type="primary"
        @click="handleSave(2)"
      >审核通过</el-button>
      <el-button type="danger" @click="handleSave(3)">审核驳回</el-button>
      <el-button
        v-if="auditStatus === 0"
        :loading="loading"
        type="plain"
        @click="handleSave(4)"
      >待线下沟通</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { AccountCard, IconTip } from 'components'
import {
  computed,
  reactive,
  toRefs,
  getCurrentInstance
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { useStore } from '../hook'
import {
  $getRequirementInfo,
  $auditRequirement,
  $getAccountCrowdProportionInfo
} from '@/api/putting-manager'

import { $getB2CPhoneModel } from '@/api/bussiness-manage'
export default {
  components: { AccountCard, IconTip },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    from: {
      type: String,
      default: ''
    },
    // isEdit: {
    //   type: Boolean,
    //   default: false
    // },
    auditStatus: {
      type: Number,
      default: 0
    }
  },
  setup(props, ctx) {
    const { $message, $router } = getCurrentInstance().proxy
    const store = useStore()
    const userInfo = computed(() => store.userInfo.value)
    const { brandNameList, chargingModeList } = useStore()
    const state = reactive({
      loading: false,
      modelData: [],
      crowedData: {},
      formData: {
        // requirementExamineStatus: null,
        requirementExamineRemark: ''
      }
    })
    const { show, handleClose } = useToggle(props)
    const getChargeType = (val) => {
      const list = [
        {
          id: 1,
          label: '按播放量计费'
        },
        {
          id: 2,
          label: '保量计费'
        },
        {
          id: 3,
          label: '一口价计费'
        }
      ]
      return (list.find((item) => item.id === +val) || {}).label
    }
    const getRequirementInfo = async function() {
      try {
        state.loading = true
        const res = await $getRequirementInfo({
          requirementId: props.data.id || ''
        })
        state.loading = false
        if (res.code === 1) {
          state.formData = res.data
        }
      } catch (err) {
        $message.error(err.message)
      }
    }
    const handleSave = async function(status) {
      try {
        const params = {
          requirementId: props.data.id || '',
          requirementExamineStatus: status,
          requirementExamineRemark: state.formData.requirementExamineRemark
        }
        const res = await $auditRequirement(params)
        if (res.code === 1) {
          ctx.emit('success')
          handleClose()
          $message.success('操作成功')
        } else {
          $message.error(res.message)
        }
        state.loading = false
      } catch (err) {
        state.loading = false
        if (!err) return
        if (err.__CANCEL__) return
        $message.error(err.message)
      }
    }
    const handleToVideo = () => {
      $router.push({
        path: `/putting-manager/video-list`,
        query: {
          _blank: true,
          accountId: props.data.accountId,
          platId: props.data.platId
        }
      })
    }
    const handleToNewVideo = () => {
      $router.push({
        path: `/putting-manager/drop-video-library`,
        query: {
          _blank: true,
          accountId: props.data.accountId,
          platId: props.data.platId
        }
      })
    }
    const getB2CPhoneModel = async() => {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        state.modelData = data || []
        if (props.data.b2cPhoneModelId) {
          for (let i = 0; i < (data || []).length; i++) {
            for (let j = 0; j < (data[i].phoneModelVOList || []).length; j++) {
              if (data[i].phoneModelVOList[j].phoneModelVOList.findIndex(item => +item.modelId === +props.data.b2cPhoneModelId) > -1) {
                state.formData = {
                  ...state.formData,
                  b2cPhoneModelId: [+data[i].modelId, +data[i].phoneModelVOList[j].modelId, props.data.b2cPhoneModelId]
                }
                break
              }
            }
          }
        }
      }
    }
    const dataFilter = (node, val) => {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (
        !!~txt.indexOf(val) ||
        !!~txt.toUpperCase().indexOf(value.toUpperCase())
      ) {
        return true
      }
    }
    const getTikTokAccountFansInfo = async function() {
      try {
        const res = await $getAccountCrowdProportionInfo({
          accountId: props.data.accountId || ''
        })
        if (res.code === 1 && res.data) {
          state.crowedData = res.data || {}
        }
      } catch (err) {
        $message.error(err.message)
      }
    }
    const handleShowData = () => {
      ctx.emit('handleCrowedDialog', state.crowedData)
    }
    getTikTokAccountFansInfo()
    getRequirementInfo()
    getB2CPhoneModel()
    return {
      show,
      handleClose,
      handleSave,
      brandNameList,
      chargingModeList,
      ...toRefs(state),
      userInfo,
      getChargeType,
      handleToVideo,
      dataFilter,
      handleShowData,
      handleToNewVideo
    }
  }
}
</script>
<style lang="scss" scoped>
.demand {
  .el-form-item {
    width: 50%;
    margin-right: 0;
    ::v-deep {
      .el-form-item__content {
        display: inline-flex;
      }
    }
    &.w-100 {
      width: 100%;
    }
    .el-textarea {
      width: 500px;
    }
  }
}
.item-pass {
  display: flex;
  align-items: center;
}
::v-deep {
  .el-select {
    max-width: 200px;
  }
  .el-input {
    max-width: 200px;
  }

  .el-dialog__footer {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      border-radius: 10px;
      margin: 0 16px;
    }
  }
}
.account-box {
  position: relative;
  display: flex;
  .icon-container {
    margin-top: -3px;
    margin-left: 4px;
    width: 60px;
  }
  .iconchengyuan_fill:hover {
    color: #2c64ff;
  }
  .iconshipin:hover {
    color: #2c64ff;
  }
}
.cascader-box {
  ::v-deep {
    input {
      padding: 0 !important;
      background: #fff !important;
      border: none;
      color: #595959 !important;
    }
    .el-input__inner {
      text-overflow: initial;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
.crowed {
  margin-bottom: 20px;
  ::v-deep{
    .el-form-item{
      margin-bottom: 0px !important;
    }
  }
  &-h{
    margin-bottom: 12px;
    border-bottom: 1px solid #eee;
  }
}
.crowed-title {
  font-size: 14px;
  font-weight: 600;
  margin-left: 20px;
}
</style>
