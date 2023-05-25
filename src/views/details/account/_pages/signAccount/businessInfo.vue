<template>
  <Wrap>
    <ul class="list flex flex-wrap">
      <li>账号状态：{{ data.accountStatus == 0 ? '上架' : '下架' }}</li>
      <!-- <li>1-20s报价：{{ data.twentySecondPrice | toThousands }}</li>
      <li>21-60s报价：{{ data.quotePrice | toThousands }}</li>
      <li>60s+报价：{{ data.oversixtySecondPrice | toThousands }}</li> -->
      <li>直播报价：{{ data.livePrice | toThousands }}</li>
      <li>达人联系方式：{{ data.phone }}</li>
      <li>签约经纪人：{{ data.brokerUserName }}</li>
      <li>达人分成比例：{{ data.outMoneyRatio }}%
        <IconTip
          type="popover"
          placement="top-start"
          width="300"
          trigger="hover"
          content="达人分成：请按照合同的实际分成比例填写，例如机构与达人的分成为3：7，则达人分成比例填写70%"
          icon-class="iconwenhao"
        />
      </li>
      <li>对接商务：{{ data.businessUserName }}</li>
      <li>商务微信：{{ data.businessWechat }}</li>
      <li>是否保量：{{ data.quantityFlag ? '是' : '否' }}</li>
      <li>保量详情：{{ data.quantityInfo }}</li>
      <li>是否底薪：{{ data.baseSalaryFlag ? '是' : '否' }}</li>
      <li>底薪详情：{{ data.baseSalaryInfo }}</li>
      <template v-if="type === 'sign'">
        <li>最多共担返点：{{ data.maxBearRatio === undefined ? '--' : `${data.maxBearRatio || 0}%` }}</li>

        <li class="block flex flex-between">
          <div class="cartBox">
            购物车权益：
            <el-tag v-if="(data.talentInterest || {}).cartInterest" size="small">
              {{ [
                !+data.talentInterest.cartInterest.isFree ? '付费' : +data.talentInterest.cartInterest.isFree === 1 ? '免费' : '',
                +data.talentInterest.cartInterest.isFree !== 1 ? `${data.talentInterest.cartInterest.trailerAdditionalPrice}元` : '',
                data.talentInterest.cartInterest.isHasCommission ? '有佣金要求' : '无佣金要求',
                data.talentInterest.cartInterest.isHasCommission ? `${data.talentInterest.cartInterest.commissionRatio || 0}%` : ''
              ].filter(item => item !== '').join('-') }}
            </el-tag>
            <span v-else>--</span>
          </div>
          <div>
            线下商单权益：
            {{ (data.talentInterest || {}).offlineOrderInterest === 0 ? '不接受线下商单' : (data.talentInterest || {}).offlineOrderInterest === 1 ? '接受线下商单' : '--' }}
          </div>
        </li>

        <li class="block flex flex-between">
          <div class="cartBox">
            信息流权益：
            <el-tag v-if="(data.talentInterest || {}).msgFlowInterest" size="small">
              {{ [
                !+data.talentInterest.msgFlowInterest.isFree ? '付费' : +data.talentInterest.msgFlowInterest.isFree === 1 ? '免费' : '',
                +data.talentInterest.msgFlowInterest.isFree !== 1 ? `${data.talentInterest.msgFlowInterest.msgAdditionalPrice}元` : '',
                `${!+data.talentInterest.msgFlowInterest.msgDuration ? '0' : +data.talentInterest.msgFlowInterest.msgDuration === 1 ? '1-3' : +data.talentInterest.msgFlowInterest.msgDuration === 2 ? '2-4' : '6-12'}个月`
              ].filter(item => item !== '').join('-') }}
            </el-tag>
            <span v-else>--</span>
          </div>
        </li>

      </template>
      <li class="block">签约时间：{{ data.signContractDate|emptyFill }} {{ data.signContractDateEnd?`至 ${data.signContractDateEnd}`:'' }}</li>
      <li v-if="data.createTime" class="block">签约账号添加时间：{{ data.createTime }}</li>
      <template v-if="data.platName === '抖音'">
        <li class="block">是否加入星图MCN：{{ data.xingtuMcnTag ? '是' : '否' }}</li>
        <li class="block">是否加入抖音MCN：{{ data.douyinMcnTag ? '是' : '否' }}</li>
      </template>
      <!-- <li class="block">是否加入乾派MCN：{{ data.joinMcnFlag ? '是' : '否' }} <i class="tip-gray m-l-24">注：完全通过乾派的银行账户收款才选择是已加入乾派MCN</i> </li> -->
      <li class="block">达人详细地址：{{ data.darenAddress }}</li>
      <!-- <li class="block">达人详细地址：{{ data.provinceName }} <template v-if="data.provinceName && data.cityName">-</template> {{ data.cityName }}</li> -->
      <li class="block">
        过往合作行业类别：
        <template v-if="data.customFieldName">
          <el-tag
            v-for="item in data.customFieldName.split(',')"
            :key="item"
            class="m-r-5"
            size="small"
          >{{ item }}</el-tag>
        </template>
      </li>
      <li class="block">过往合作客户：
        <template v-if="data.cooperationCustomer">
          <el-tag
            v-for="item in data.cooperationCustomer.split('，')"
            :key="item"
            class="m-r-5"
            size="small"
          >{{ item }}</el-tag>
        </template>
      </li>
      <li class="block">备注：{{ data.remark }}</li>
      <!-- <li>签约时间：{{ data.signContractDate }}</li> -->
    </ul>
  </Wrap>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { IconTip } from 'components'
export default defineComponent({
  components: { IconTip },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup() {
  }
})
</script>

<style lang="scss" scoped>
.list {
  li {
    &.block {
      width: 100%;
      max-width: 100%;
    }
    width: 20%;
    max-width: 245px;
    min-width: 220px;
    font-size: 16px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 16px;
    margin-right: 12px;
  }
}

.flex-between {
  // justify-content: space-between;
  margin-right: 0;

  div {
    width: 20%;
    min-width: 220px;
    max-width: 245px;
    margin-right: 12px;
  }

  .cartBox {
    width: 40%;
    min-width: 440px;
    max-width: 490px;
    margin-right: 24px;
  }
}
</style>
