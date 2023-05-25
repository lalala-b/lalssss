<template>
  <div>
    <el-table ref="table" v-scrollbar v-loading="loading" :data="data" class="C-putting-order-table" align="center" @sort-change="doSort">
      <el-table-column width="30">
        <template slot-scope="{row}">
          <el-tooltip
            effect="dark"
            :content="row.beCollected ? '取消收藏' : '加入收藏'"
            placement="top"
          >
            <i v-loading="btnLoading && (row.orderId === clickId)" :class="['iconfont', 'iconlove', row.beCollected && 'collect']" @click="() => handleCollect(row.beCollected, row.orderId)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="订单信息" width="366px" algin="left">
        <template slot-scope="{ row }">
          <AccountCard :info="row" :options="{ imgUrl:'avatarUri' }">
            <template v-slot:last>
              <p class="info-text">预计发布时间：<span class="info-value">{{ row.preReleaseVideoTime }}</span></p>
              <p class="info-text">
                订单号：<span class="info-value">{{ row.orderNumber }}</span>
                <el-tooltip
                  v-if="row.signOrderFlag && tabType === 'TeamOrder'"
                  effect="dark"
                  content="已加入乾派MCN的签约账号订单"
                  placement="top"
                >
                  <span class="account-card__name-plat">乾</span>
                </el-tooltip>
              </p>
            </template>
          </AccountCard>
        </template>
      </el-table-column>
      <el-table-column v-if="tabType === 'PaymentOrder'" prop="orderExamineTime" label="审核时间" width="102" sortable="consumeAmount" />
      <el-table-column label="订单状态" width="120">
        <template slot-scope="{ row }">
          {{ BUSSINESS_STATUS_MAP[row.businessStatus] }}
        </template>
      </el-table-column>
      <el-table-column prop="advertiserRealname" label="广告师" />
      <el-table-column prop="deliveryName" label="投放专员">
        <template slot-scope="{row}">
          {{ row.deliveryName|emptyFill }}
        </template>
      </el-table-column>
      <el-table-column v-if="['MyOrder', 'PaymentOrder', 'AccountingOrder', 'TeamOrder', 'PublishSubmit'].includes(tabType)" label="编导人员">
        <template slot-scope="{ row }">
          {{ row.choreographerName|emptyFill }}
        </template>
      </el-table-column>
      <el-table-column v-if="tabType === 'PaymentOrder' || tabType === 'PublishSubmit'" prop="deliveryOfferAmount" label="投放下单报价" sortable="consumeAmount" />
      <el-table-column prop="consumeAmount" label="平台消耗金额" sortable="consumeAmount" width="130" />
      <el-table-column v-if="hasBack" prop="rebateAmount" label="返款" width="80" />
      <el-table-column v-if="hasBack && tabType === 'TeamOrder'" prop="rebateType" label="返款方式" width="80" />
      <el-table-column prop="deliveryMoney" label="投放价格" sortable="deliveryMoney" width="120">
        <template slot="header">
          <IconTip
            :content="`投放价格=投放下单报价+平台手续费 +补款金额+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额${tabType === 'TeamOrder' ? '，如该视频资金核算完成，则展示该视频实际消耗金额。' : ''}`"
            label="投放价格"
            icon-class="iconwenhao"
          />
        </template>
      </el-table-column>
      <el-table-column v-if="['PaymentOrder','PublishSubmit','AccountingOrder','TeamOrder'].includes(tabType)||tabType==='MyOrder'&&!['1,2','5','6'].includes(activeName)" label="视频信息" width="320" align="left">
        <template slot-scope="{ row }">
          <VideoList
            :list-data="row.deliveryRelationVideoDetailBOList"
            :options="{ coverImg: 'videoCoverUrl', title: 'titleName' }"
            :show-video-count="5"
          >
            <p slot-scope="{node}">流量：{{ node.flowCount || '--' }}</p>
          </VideoList>
        </template>
      </el-table-column>
      <el-table-column v-if="tabType==='MyOrder'&&activeName==='6'||['PublishSubmit'].includes(tabType)" label="中台处理状态" width="206">
        <template slot-scope="{ row }">
          <el-select
            v-if="row.setScheduledPublishFlag&&tabType!=='MyOrder'"
            v-model="row.videoReleaseFlag"
            class="m-b-8"
            placeholder="是否设置视频发布时间"
            @change="(val)=>handleConfirm(val,'time',row)"
          >
            <el-option
              v-for="item in confirmSelectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else class="m-b-8">{{ row.videoReleaseFlag!==null?row.videoReleaseFlag?'已发布':'未设置视频发布时间':'' }}</div>
          <el-select
            v-if="row.setConfirmPriceFlag&&tabType!=='MyOrder'"
            v-model="row.confirmPriceFlag"
            placeholder="是否确认价格"
            @change="(val)=>handleConfirm(val,'price',row)"
          >
            <el-option
              v-for="item in confirmPriceSelectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <div v-else class="m-b-8">{{ row.confirmPriceFlag!==null?row.confirmPriceFlag?'已确认价格':'未确认价格':'' }}</div>
        </template>
      </el-table-column>
      <el-table-column v-if="['PublishSubmit'].includes(tabType)" label="编导期望视频发布时间" width="200">
        <template slot-scope="{ row }">
          {{ row.thirdVideoPublishTime }}
        </template>
      </el-table-column>
      <el-table-column v-if="['PublishSubmit'].includes(tabType)||tabType==='MyOrder'&&!['1,2','5'].includes(activeName)" label="平台订单状态" width="200">
        <template slot-scope="{ row }">
          <div v-html="row.thirdOrderStatusStr" />
        </template>
      </el-table-column>
      <el-table-column v-if="!['WaitOrder', 'PaymentOrder', 'PublishSubmit'].includes(tabType)" prop="flowCount" label="流量">
        <template slot-scope="{ row }">
          {{ row.flowCount || '--' }}
        </template>
      </el-table-column>
      <el-table-column v-if="['TeamOrder','MyOrder'].includes(tabType)" label="产品型号">
        <template slot-scope="{ row }">
          {{ row.b2cPhoneModel || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" fixed="right">
        <template slot-scope="{ row }">
          <template v-if="tabType === 'MyOrder'">
            <el-button v-if="hasView[row.businessStatus]" type="text" size="small" @click="handleGo(row)">查看详情</el-button>
            <el-button v-if="hasSubmit[row.businessStatus] && row.editVideoFlag === 1" type="text" size="small" @click="handleGo(row, 3)">提交视频</el-button>
            <el-button v-if="hasUpdate[row.businessStatus]" type="text" size="small" @click="handleGo(row)">数据更新</el-button>
            <el-button v-if="hasEdit[row.businessStatus] && row.editOrderFlag === 1" type="text" size="small" @click="handleGo(row)">修改订单</el-button>
            <el-button v-if="hasCopy[row.businessStatus]" type="text" size="small" @click="copyText(row)">复制链接</el-button>
            <el-popover
              v-if="hasDel[row.businessStatus] && row.cancelOrderFlag === 1"
              :ref="`popover-${row.id}`"
              placement="left"
              trigger="click"
              width="310"
              title="取消订单"
            >
              <p style="margin-bottom: 10px;">取消订单后该订单结束，不可恢复，请确认！</p>
              <el-form ref="form" inline>
                <el-form-item label="备注">
                  <el-input v-model="row.remark" type="textarea" size="small" style="width: 100%;" maxlength="50" />
                </el-form-item>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(row)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleCancel(row)">确定</el-button>
                </div>
              </el-form>
              <el-button slot="reference" type="text" size="small">取消订单</el-button>
            </el-popover>
            <el-button v-if="!['10', '9', '8'].includes(activeName) && row.appealFlag === 1" type="text" size="small" @click="handleClickComplaint(row)">异常申诉</el-button>
          </template>
          <template v-else-if="tabType === 'TeamOrder'">
            <el-button type="text" size="small" @click="handleGo(row)">查看详情</el-button>
            <el-button v-if="$permission('putting_order_move') && ![8,9,10].includes(row.businessStatus)" type="text" size="small" @click="handleMove(row)">
              订单移交
              <!-- <IconTip v-if="+row.orderTransferFlag === 0" class="orderTurnOver" label="订单移交" content="投放订单已计算军功，不再支持移交！" />
              <span v-else></span> -->
            </el-button>
            <template v-if="$permission('putting_order_copy') && row.requirementId!==0">
              <el-tooltip
                v-if="!row.copyOrder"
                placement="top"
                content="请联系账号对接人先补充联系方式后再下单！"
              >
                <el-link disabled size="small" type="info">复制订单</el-link>
              </el-tooltip>
              <el-button v-else type="text" size="small" @click="handleCopyOrder(row)">复制订单</el-button>
            </template>
          </template>
          <template v-else-if="tabType === 'WaitOrder' || tabType === 'PaymentOrder' || tabType === 'AccountingOrder'">
            <el-button v-if="$permission('putting_order_wait_sh') && hasExamine[row.businessStatus]" type="text" size="small" @click="handleGo(row, 1)">订单审核</el-button>
            <el-button v-if="$permission('putting_order_wait_xd') && hasPayment[row.businessStatus]" type="text" size="small" @click="handleGo(row, 2)">审批下单付款</el-button>
            <el-button v-if="$permission('putting_order_wait_xd2') && hasAccounts[row.businessStatus]" type="text" size="small" @click="handleGo(row, 4)">资金核算</el-button>
          </template>
          <template v-if="tabType === 'WaitOrder' ">
            <el-button type="text" size="small" @click="handleGoHistoryOrder(row)">查看历史订单</el-button>
          </template>
          <template v-if="tabType === 'PublishSubmit' && (row.platId === 25 || row.platId === 26)">
            <el-button type="text" size="small" @click="handleToJuxingOrXingtu(row)">前往{{ getPlatUrlName(row.platId) }}</el-button>
          </template>
          <template v-if="tabType === 'PublishSubmit'">
            <el-button type="text" size="small" @click="handleGo(row)">查看详情</el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>
    <MoveOrder
      v-if="moveShow"
      :info-data="orderItem"
      :show.sync="moveShow"
      page-type="putting_order"
      @success="moveUpdate"
      @handleHistoryDialog="handleHistoryDialog"
    />
    <HistoryDialog v-if="showHistory" v-model="showHistory" :order-id="orderItem.orderId" />
    <PlaceOrder v-if="showPlaceOrder" v-model="showPlaceOrder" :form-data="formData" palce-source="putting" @handleBusinessDialog="handleBusinessDialog" />
    <ComplaintDialog v-if="showComplaint" v-model="showComplaint" :order-number="orderNumber" @success="moveUpdate" />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
  </div>
</template>
<script>
import { $cancelOrder, $getSimpleOrderDetail, $confirmPrice, $setVideoRelease, $doCollection } from '@/api/putting-manager'
import MoveOrder from '../../../../bussiness-manage/advertising/_pages/lanuch-orders/_pages/move.vue'
import PlaceOrder from '../../../putting-account/_component/PlaceOrder'
import { copyBigDataToBoard } from '@/utils'
import { AccountCard, VideoInfo, IconTip, VideoList } from 'components'
import ComplaintDialog from '@/views/putting-manager/abnormal-complaints/_com/ComplaintDialog.vue'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'
import HistoryDialog from '../../../../bussiness-manage/advertising/_pages/lanuch-orders/_pages/historyDialog'

const BUSSINESS_STATUS_MAP = {
  1: '待审核', 2: '待审核', 5: '待下单付款', 6: '待发布提交', 7: '待资金核算', 8: '已驳回', 9: '已取消', 10: '已完成', 17: '待平台订单完成'
}
export default {
  components: { MoveOrder, AccountCard, VideoInfo, PlaceOrder, IconTip, ComplaintDialog, VideoList, BusinessLinePutDialog, HistoryDialog },
  props: {
    activeName: {
      type: String,
      default() {
        return '1'
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    },
    hasBack: {
      type: Boolean,
      default() {
        return false
      }
    },
    tabType: {
      type: String,
      default: ''
    },
    loading: Boolean
  },
  data() {
    return {
      visible1: false,
      visible: false,
      hasView: Object.freeze({
        2: true,
        1: true,
        6: true,
        7: true,
        8: true,
        9: true,
        5: true,
        10: true,
        17: true
      }),
      hasCopy: Object.freeze({
        1: true,
        2: true
      }),
      hasDel: Object.freeze({
        2: true,
        1: true,
        8: true
      }),
      hasSubmit: Object.freeze({
        6: true
      }),
      hasUpdate: Object.freeze({
        7: true
      }),
      hasExamine: Object.freeze({
        1: true,
        2: true
      }),
      hasPayment: Object.freeze({
        5: true
      }),
      hasAccounts: Object.freeze({
        7: true
      }),
      hasEdit: Object.freeze({
        8: true
      }),
      BUSSINESS_STATUS_MAP,
      xingtuData: Object.freeze({
        '1': '向乾',
        '2': '乾派',
        '3': '快接单',
        '4': '线下',
        '5': '北京'
      }),
      linkUseType: Object.freeze({
        net_server_component: '网服组件',
        comment_set_top: '落地页组件'
      }),
      orderItem: null,
      moveShow: false,
      showPlaceOrder: false,
      formData: {},
      showComplaint: false,
      orderNumber: '',
      dialogInfo: {},
      showBusinessLineDialog: false,
      showHistory: false,
      confirmPriceFlag: '',
      videoReleaseFlag: '',
      confirmSelectData: [
        { label: '已发布', value: 1 },
        { label: '未设置视频发布时间', value: 0 }
      ],
      confirmPriceSelectData: [
        { label: '已确认价格', value: 1 },
        { label: '未确认价格', value: 0 }
      ],
      btnLoading: false,
      clickId: ''
     }
  },
  methods: {
    copyText(row) {
      copyBigDataToBoard(`http://app.qpmcn.com/#/putting_order?orderId=${row.orderId}`)
      this.$message.success('复制成功')
    },
    handleMove(row) {
      this.orderItem = row
      this.moveShow = true
    },
    moveUpdate() {
      this.$emit('update')
    },
    handleGo(row, scroll) {
      this.$router.push({
        path: `/putting-manager/order-detail`,
        query: {
          scroll,
          orderId: row.orderId,
          platId: row.platId,
          _blank: true
        }
      })
    },
    handleGoHistoryOrder(row) {
      this.$router.push({
        path: `/putting-manager/drop-video-library`,
        query: {
          accountId: row.accountId,
          platId: row.platId,
          _blank: true
        }
      })
    },

    // 根据平台id获取对应跳转平台的名称
    getPlatUrlName(platId) {
      let str = ''
      switch (platId) {
        case 25:
          str = '星图'
          break
        case 26:
          str = '聚星'
          break
        default:
          break
      }

      return str
    },

    handleToJuxingOrXingtu(row) {
      window.open(row.thirdOrderDetailUrl)
    },
    /**
     * 排序
     * @param  {String}  prop   列名
     * @param  {String}  order  排序方式
     */
    doSort({ prop, order }) {
      this.$emit('sort', order === 'ascending' ? prop : (order === 'descending' ? `-${prop}` : ''))
    },
    handleCancel(row) {
      $cancelOrder({
        orderId: row.orderId,
        cancelRemark: row.remark || ''
      })
        .then(res => {
          if (res.code === 1) {
            this.$emit('update')
            this.handleClose(row)
          } else {
            this.$message.error(res.message || '取消订单失败')
          }
        })
    },
    handleCopyOrder(row) {
      $getSimpleOrderDetail({ orderId: row.orderId }).then(res => {
        this.showPlaceOrder = true
        this.formData = res.data
        if (res.data && res.data.deliveryWordOfCommandBOList) {
          res.data.deliveryWordOfCommandBOList = {
            list: res.data.deliveryWordOfCommandBOList,
            beDependentOrderNumber: res.data.beDependentOrderNumber,
            addCommandType: res.data.addCommandType
          }
        }
      })
    },
    handleClickComplaint(row) {
      this.showComplaint = true
      this.orderNumber = row.orderNumber
    },
    handleClose(row) {
      // 模拟点击页面其它部分关掉弹层，因为该页面列表使用懒加载导致doClose无效
      document.body.click()
    },
    handleBusinessDialog(val) {
      this.dialogInfo = val
      this.showBusinessLineDialog = true
    },
    handleHistoryDialog(val) {
      this.showHistory = true
    },
    handleConfirm(val, type, row) {
      const $api = type === 'price' ? $confirmPrice : $setVideoRelease
      const params = type === 'price' ? { confirmPriceFlag: val } : { videoReleaseFlag: val }
      try {
        $api({
          orderId: row.orderId,
          ...params
        }).then(res => {
          if (res.code === 1) {
           this.$message.success(res.message)
           this.$emit('update')
          } else {
           this.$message.error(res.message)
          }
        })
      } catch (error) {
        console.info(error)
      }
    },

    async handleCollect(isCollect, orderId) {
      const params = { orderId }
      this.clickId = orderId
      if (isCollect) {
        params.operation = 0
      } else {
        params.operation = 1
      }

      try {
        this.btnLoading = true
        const { code, message } = await $doCollection(params)
        this.btnLoading = false
        if (+code === 1) {
          this.$message.success(`${isCollect ? '取消' : '添加'}收藏成功`)
          this.$emit('update')
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.btnLoading = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-table {
    ::v-deep .el-button {
      margin: 0;
    }
    .flex {
      display: flex;
      text-align: left;
      &-avater {
        width: 80px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          display: block;
          border-radius: 50%;
        }
      }
      &-url {
        width: 80px;
        margin-right: 10px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          display: block;
        }
      }
      &-info {
        font-size: 14px;
        .info-important {
          font-weight: bold;
          font-size: 16px;
        }
        .info-icon {
          // flex: 1;
          position: relative;
          top: -2px;
          .xingtu-icon {
            top: 0;
          }
          img {
            vertical-align: top;
            margin-top: 6px;
            position: relative;
            left: 4px;
          }
        }
        .info-value {
          color: #999;
        }
        .info-title {
          display: flex;
          width: 230px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 8px;
          > span {
            width: 230px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          > a {
            // flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 170px;
          }
        }
      }
    }
    .info-text {
      font-size: 12px;
      font-weight: 400;
      color: #8C8C8C;
      line-height: 17px;
      margin-top: 4px;
    }
  }
  ::v-deep {
    .account-card {
      &__image {
        width: 88px;
        height: 88px;
        margin-right: 8px;
      }
      &__name {
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #272727;
        line-height: 20px;
        margin-bottom: 10px;
      }
    }
    .video-info {
      &-coverImg {
        width: 86px;
        height: 112px;
        border-radius: 4px;
      }
      &-right__title {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #272727;
        line-height: 20px;
      }
      .info-coverImg {
        width: 86px;
        height: 112px;
        border-radius: 4px;
      }
    }
  }

  .account-card__name-plat {
    background: #3b63f6;
    color: #fff;
    text-align: center;
    display: inline-block;
    font-weight: bold;
    border-radius: 4px;
  }

  ::v-deep {
    .orderTurnOver > span {
      margin-right: 0 !important;
    }
  }
  .copy-btn{
    color: #8C8C8C;
  }

  .iconlove {
    color: #ccc;
    cursor: pointer;
  }

  .collect {
    color: #ff0000;
  }
  // .orderTurnOver {
  //   span {
  //     margin-right: 0 !important;
  //   }
  // }
</style>
