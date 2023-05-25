<template>
  <Wrap>
    <div v-loading="loading" class="list flex ">
      <ul class="flex flex-wrap">
        <!-- <li>投放对接人：{{ data.meetUserName }}</li>
        <li>对接保护期：<span v-if="data.deadlineDateNum">{{ data.deadlineDateNum }}天</span></li> -->
        <li v-if="data.createTime" class="flex1">投放账号添加时间：{{ data.createTime || '--' }}</li>
        <li>账号投放状态：{{ ACCOUNT_STATUS_MAP[data.deliveryStatus] || '--' }}</li>
        <li>是否合作（合作次数）：{{ data.isPartner === 0 ? "否" : "是" }}({{ data.accountUserCount? data.accountUserCount > 99 ? '99+' : data.accountUserCount : '--' }})</li>
        <li>投放上限/月：{{ data.sysPuttingCount || '--' }}</li>
        <div class="block" />
        <template>
          <li>手机号码：{{ data.phone || '--' }}</li>
          <li>微信号：{{ data.wechatNumber || '--' }}</li>
          <li>QQ：{{ data.qqNumber || '--' }}</li>
          <li>邮箱：{{ data.email || '--' }}</li>
          <li>座机：
            <template v-if="data.fixedPhoneCode || data.fixedPhoneNumber">{{ data.fixedPhoneCode }}-{{ data.fixedPhoneNumber }}</template>
            <template v-else>--</template>
          </li>
          <li>其它：{{ data.otherContact || '--' }}</li>
        </template>
        <li class="block">备注：{{ data.remark || '--' }}</li>
      </ul>
      <div class="table-border">
        <el-table
          :data="meetUserTableData"
          border
          style="width:440px"
          :header-cell-style="{ background: '#fff' }"
        >
          <el-table-column prop="businessLine" label="业务线" width="70" />
          <el-table-column prop="monthDeliveryCount" label="每月投放上限（当月剩余次数）" width="140">
            <template slot-scope="{ row }">
              {{ row.monthDeliveryCount | emptyFill }} ({{ row.remainMonthDeliveryCount|emptyFill }})
            </template>
          </el-table-column>
          <el-table-column label="对接人/保护期">
            <template slot-scope="{ row }">
              {{ row.oppositeUserName|emptyFill }}/{{ row.oppositeDayCount|emptyFill }}
              <i class="iconfont iconlianxiren realname-icon" @click="handleShowList(row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Realnamelist v-if="showNameList" v-model="showNameList" :info="dataInfo" :business-line="businessLine" />
    </div>
  </Wrap>
</template>
<script>
import { getCurrentInstance, defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { IconTip } from 'components'
import { ACCOUNT_STATUS_MAP } from '@/const'
import { $getDeliveryBusinessInfo } from '@/api/bussiness-manage'
import Realnamelist from '@/views/putting-manager/putting-account/_component/RealnameList.vue'

export default defineComponent({
  components: { IconTip, Realnamelist },
  props: {
    data: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const { $message } = getCurrentInstance().proxy

    const states = reactive({
      // realnamelistLoading: false,
      showNameList: false,
      businessLine: '',
      meetUserTableData: [],
      dataInfo: {}
    })

    const getDeliveryBusinessInfo = async() => {
      try {
        // states.realnamelistLoading = true
        const { code, data } = await $getDeliveryBusinessInfo({ accountId: props.data.accountId })
        if (code === 1) {
          states.meetUserTableData = data.businessInfos
          states.dataInfo = data
        }
        // states.realnamelistLoading = false
      } catch (error) {
        // states.realnamelistLoading = false
        $message.error(error.message)
      }
    }

    watch(() => props.data, (businessInfo) => {
      if (businessInfo && Object.keys(businessInfo).length) {
        getDeliveryBusinessInfo()
      }
    }, {
      immediate: true
    })

    const handleShowList = (row) => {
      states.showNameList = true
      states.businessLine = row.businessLine
    }
    return {
      ACCOUNT_STATUS_MAP,
      handleShowList,
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.block {
  width: 100%;
  max-width: 100%;
}
.list {
  li {
    &.flex1 {
      flex: 1;
      max-width: 100%;
    }
    &.block {
      width: 100%;
      max-width: 100%;
    }

    width: 50%;
    max-width: 225px;
    min-width: 200px;
    font-size: 14px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 16px;
    margin-right: 12px;
  }
}
.table-border{
  width: 340px;
  padding-left: 12px;
  border-left: 2px solid #eee;
  ::v-deep{
    th>div{
      color: #595959;
      font-size: 14px !important;
    }
  }
}
.realname-icon {
  margin-left: 5px;
  font-size: 14px;
  color: $--color-primary;
  cursor: pointer;
}
</style>
