<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-21 10:11:55
 * @LastEditTime: 2020-12-26 18:39:09
 * @LastEditors: Linjie
-->
<template>
  <Wrap>
    <div class="search-view">
      <v-search
        ref="search"
        :inline="true"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:prv>
          <el-radio-group v-model="searchData.type" class="m-r-24" @change="handleChangeType">
            <template v-for="item in typeList">
              <el-radio-button
                :key="item.text"
                data-burry_btn_name="tab"
                :data-burry_title="item.text"
                :label="item.label"
              >{{ item.text }}</el-radio-button>
            </template>
          </el-radio-group>
          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </v-search>
    </div>
    <div v-loading="loading" class="table-view">
      <div class="flex">
        <IconTip
          icon-class="iconwenhao"
          label="数据说明"
          type="popover"
          placement="top-start"
          trigger="hover"
        >
          <div>
            <p>【数据说明】{{ tipList[searchData.type - 1] }}</p>
            <p>新增激活：视频带来的的新下载用户数量</p>
            <p>CPM：千次播放价格，CPM=投放金额/（流量/1000）</p>
            <p>CPA：拉新成本，CPA=投放金额/新增激活</p>
            <!-- <p>CPO：订单成本，CPO=投放金额/提交订单量</p>
            <p>CPS：交易成本，CPS=投放金额/收件量</p> -->
          </div>
        </IconTip>
      </div>
      <el-table
        ref="accounts"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        class="m-t-10"
        @sort-change="doSort"
      >
        <el-table-column label="视频信息" align="left" width="380">
          <template slot-scope="{row}">
            <VideoInfo :info="row" :options="{title: 'titleName', coverImg: 'videoCoverUrl'}" />
          </template>
        </el-table-column>

        <el-table-column label="账号信息" align="left" width="200">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column label="流量" prop="flowCount" sortable="custom" />
        <el-table-column label="点赞量" prop="thumbUpCount" sortable="custom" />
        <el-table-column label="组件点击量" prop="cptClick" sortable="custom" />
        <el-table-column label="投放价格" prop="deliveryMoney" sortable="custom">
          <template slot="header">
            投放价格
            <IconTip
              type="popover"
              content="投放价格=投放下单报价+平台手续费 +补款金额+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <el-table-column label="新增激活" prop="appNewDeviceQty" sortable="custom" width="120">
          <template slot="header">
            新增激活
            <IconTip
              type="popover"
              class="table-head"
              content="新增激活：视频带来的的新下载用户数量"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div>
              {{ row.appNewDeviceQty == null && '--' || row.appNewDeviceQty }}
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="CPM" prop="cpm" sortable="custom">
          <template slot="header">
            CPM
            <IconTip
              type="popover"
              class="table-head"
              content="CPM：千次播放价格，CPM=投放金额/（流量/1000）"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div>
              {{ row.cpm == null && '--' || row.cpm }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="CPA" prop="cpa" sortable="custom">
          <template slot="header">
            CPA
            <IconTip
              type="popover"
              class="table-head"
              content="抖音/头条：CPA=投放价格/组件点击新增激活，快手：CPA=投放价格/安卓新增激活。"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div>
              {{ row.cpa == null && '--' || row.cpa }}
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="CPO" prop="cpo" sortable="custom">
          <template slot="header">
            <el-popover
              placement="top-start"
              trigger="hover"
              content="CPO：订单成本，CPO=投放金额/提交订单量"
            >
              <div slot="reference">
                CPO
                <i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="CPS" prop="cps" sortable="custom">
          <template slot="header">
            <el-popover
              placement="top-start"
              trigger="hover"
              content="CPS：交易成本，CPS=投放金额/收件量"
            >
              <div slot="reference">
                CPS
                <i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
        </el-table-column> -->
        <el-table-column label="发布时间" prop="addTime" sortable="custom" width="170" />
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <!-- <IconTip icon-class="iconxiangqing" content="查看详情" @click="onCellBtn(row)" /> -->
            <el-link
              type="primary"
              @click="onCellBtn(row)"
            >查看详情</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <v-dialog v-if="dialogStatus" v-model="dialogStatus" :row-info="rowInfo" /> -->
    <el-dialog
      v-if="showDetail"
      class="video-detail"
      width="980px"
      title="视频详细信息"
      :visible="showDetail"
      @close="showDetail = false"
    >
      <template slot="title">
        <span class="dialogTitle">视频详细信息</span>
        <el-button
          type="text"
          class="m-l-8"
          @click="handleGoDetail(detailVideo)"
        >查看更多详情</el-button>
      </template>
      <template
        v-if="
          (detailVideo.videoList || [])
            .length > 1
        "
      >
        <el-tabs v-model="activeTabs">
          <el-tab-pane
            v-for="(
              item, index
            ) in detailVideo.videoList || []"
            :key="item.flowId || index"
            :label="`视频${videoIndex[index]}`"
            :name="`视频${videoIndex[index]}`"
          >
            <PiratesDetailDialog
              v-if="activeTabs === `视频${videoIndex[index]}`"
              :row-info="rowInfo"
            />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <PiratesDetailDialog
          :row-info="rowInfo"
        />
      </template>
    </el-dialog>
  </Wrap>
</template>
<script>
import search from '@/components/Search'
// import dialog from '@/views/bussiness-manage/advertising/_pages/launch/_components/dialog'
import tableMinxin from '@/mixins/table'
import { $getOrderRankingList, $getOrderRankingPlatList } from '@/api/pirate'
import { objectMerge } from '@/utils'
import { AccountCard, VideoInfo, IconTip } from 'components'
import PiratesDetailDialog from '@/views/putting-manager/drop-video-library/components/PiratesDetailDialog.vue'
import { date } from '@/components/common'
const A_DAY = 864e5
export default {
  components: {
    vSearch: search,
    // vDialog: dialog,
    AccountCard,
    VideoInfo,
    IconTip,
    PiratesDetailDialog
  },
  mixins: [tableMinxin],
  data() {
    return {
      formConf: {},
      tipList: ['筛选条件下流量排行TOP20的投放视频', '筛选条件下组件点击量排行TOP20的投放视频', '筛选条件下安卓新增激活用户数排行TOP20的投放视频', '筛选条件下CPA从小到大排行前20的投放视频'],
      typeList: [
        {
          text: '流量排行',
          label: 1
        }
        // {
        //   text: '组件点击量排行',
        //   label: 2
        // },
        // {
        //   text: '新增激活排行',
        //   label: 3
        // },
        // {
        //   text: '性价比排行',
        //   label: 4
        // }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      searchData: {
        timerange: undefined,
        determined: '',
        type: 1
      },
      loading: false,
      dialogStatus: false,
      rowInfo: {},
      showDetail: false,
      detailVideo: {
        videoList: []
      }
    }
  },
  created() {
    const addTimeStart = date('Y-m-d', new Date(Date.now() - A_DAY * 30))
    const addTimeEnd = date('Y-m-d', new Date(Date.now() - A_DAY))
    this.searchData.timerange = [`${addTimeStart}`, `${addTimeEnd}`]
    this.buildFormConf()
    this.getPlatList()
    this.getList()
  },
  methods: {
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'brandName',
          data: [],
          optionLabelKey: 'configName',
          optionValKey: 'configValue',
          conf: {
            placeholder: '请选择组件品牌',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'businessType',
          data: [],
          optionLabelKey: 'configName',
          optionValKey: 'configValue',
          conf: {
            placeholder: '请选择业务标签',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '请选择平台',
            allowCreate: true,
            defaultFirst: true
          }
        }
      ]
      this.formConf = {
        normal,
        hasExport: false
      }
      const normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
    },
    getPlatList() {
      $getOrderRankingPlatList().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.basePlatInfoList
          this.normalFormItemMap.brandName.data = res.data.brandNameList
          this.normalFormItemMap.businessType.data = res.data.businessTypeList
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    // 类型点击
    handleChangeType() {
      this.$refs.accounts.clearSort()
      this.searchData.determined = ''
      this.getList()
    },
    // 获取列表
    getList() {
      const params = objectMerge({}, this.searchData)
      if (params.timerange) {
        params.addTimeStart = params.timerange[0] + ' 00:00:00'
        params.addTimeEnd = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      this.loading = true
      $getOrderRankingList(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    onExport() {},
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {},
    onSubmit(data) {
      objectMerge(this.searchData, data)
      this.getList()
    },
    handleGoDetail(row) {
      let query = {}
      const {
        monitoringModeType,
        orderId,
        componentClickConversionRelationVideoVOList,
        androidDeliveryName,
        orderConversionViewDetails,
        platId,
        platOrderId,
        platOrderName,
        platCreatetime,
        qsjOrderNumber
      } = row
      // 基金
      query = {
        model: monitoringModeType || '',
        orderId: orderId || '',
        type: '',
        flowId:
          ((componentClickConversionRelationVideoVOList || [])[0] || {})
            .videoId || '',
        name: androidDeliveryName || '',
        detailType: orderConversionViewDetails,
        thirdId: platOrderId,
        platId
      }
      const storage = {
        ...(JSON.parse(localStorage.getItem('detail')) || {}),
        [orderId]: {
          platOrderId,
          platOrderName,
          platCreatetime,
          qsjOrderNumber
        }
      }
      localStorage.setItem('detail', JSON.stringify(storage))
      const { href } = this.$router.resolve({
        path: '/putting-manager/component-detail',
        query
      })
      window.open(href, '_blank')
    },
    // 查看详情
    onCellBtn(row) {
      const { flowId, androidDeliveryName, orderId } = row
      this.rowInfo = { flowId, androidDeliveryName, orderId }
      // this.dialogStatus = true
      this.showDetail = true
      this.detailVideo = {
        ...row,
      videoList: {
        ...row
      }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.dialogTitle {
  font-size: 16px;
}
</style>
