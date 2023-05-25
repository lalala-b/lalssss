<template>
  <div>
    <wrap class="search-view">
      <span>标签筛选</span>
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <div class="search-view slot-search-view">
            <span>订单筛选</span>
            <div>
              <el-form-item>
                <el-select
                  v-model="target.model.platId"
                  placeholder="全部平台"
                  clearable
                  @change="handleChangePlat"
                >
                  <el-option
                    v-for="(opt, index) in (
                      (normalFormItemMap || {}).platId || {}
                    ).data || []"
                    :key="opt.platId + '' + index"
                    :label="opt.platName"
                    :value="opt.platId"
                  />
                </el-select>
              </el-form-item>
              <el-form-item class="m-r">
                <!-- <accountSelect
                  key="accountId"
                  :conf="((normalFormItemMap || {}).accountId || {}).conf"
                  :has-account="
                    ((normalFormItemMap || {}).accountId || {}).conf.hasAccount
                  "
                  :inline="true"
                  :form="target.model"
                  :list="((normalFormItemMap || {}).accountId || {}).data"
                  :no-ajax="true"
                  :is-account-name="
                    ((normalFormItemMap || {}).accountId || {}).conf
                      .isAccountName
                  "
                /> -->
                <SelectLazy
                  class="m-r-24"
                  :form="target.model"
                  :config="{
                    type: 'select',
                    key: 'accountId',
                    lazyLoadApi: getPlusAccountInfo,
                    data: [],
                    conf: {
                      placeholder: '请选择账号',
                      allowCreate: true,
                      defaultFirst: true
                    },
                    optionLabelKey: 'accountName',
                    optionValKey: 'accountId',
                  }"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.platOrderId"
                  placeholder="平台订单ID"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.qsjOrderNumber"
                  placeholder="乾数据订单号"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.videoTitle"
                  placeholder="请输入标题"
                />
              </el-form-item>
              <el-form-item label="平台任务创建时间">
                <el-date-picker
                  v-model="target.model.createdaterange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="视频发布时间">
                <el-date-picker
                  v-model="target.model.videodaterange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  :clearable="false"
                />
              </el-form-item>
            </div>
          </div>
        </template>
        <template v-slot:btns="target">
          <span class="m-r-10 m-l-20">是否核算完已返款:</span>
          <el-radio-group
            v-model="target.model.refundedFlag"
            @change="onSubmit(target.model)"
          >
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <span
            class="m-l-24 conversion-title"
          >转化来源：
            <el-radio-group
              v-model="target.model.conversionSource"
              :disabled="WhetherDisabled"
              @change="onSubmit(target.model)"
            >
              <el-radio :label="1">全部流量</el-radio>
              <el-radio :label="2">仅看自然流量</el-radio>
              <el-radio :label="3">仅看助推流量</el-radio>
            </el-radio-group>
          </span>
          <IconTip
            type="popover"
            content="转化来源：20211208之后启用新版监测链接的快手部分订单参与流量助推，可区分自然流量和助推流量。"
            icon-class="iconwenhao"
          />
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <Statistics
        v-loading="loading"
        class="statistics data-wrap"
        :data="summaryData"
      />
    </wrap>
    <wrap class="m-t-24">
      <div class="checkbox-view m-b-10">
        <el-checkbox
          v-for="item in extFields"
          :key="item.fieldName"
          v-model="item.status"
          :label="item.fieldName"
        >{{ item.chnName }}</el-checkbox>
      </div>
      <div class="table-view">
        <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
          <el-table-column
            prop="orderInfo"
            label="平台订单信息"
            width="340px"
            align="left"
          >
            <template slot-scope="{ row }">
              <AccountCard
                :info="row"
                :options="{ imgUrl: 'avatarUri', name: 'accountName' }"
              >
                <p class="info-text">
                  乾数据订单号：{{
                    row.qsjOrderNumber ? row.qsjOrderNumber : '--'
                  }}
                </p>
                <p class="info-text">
                  平台订单ID：{{ row.platOrderId ? row.platOrderId : '--' }}
                </p>
                <el-tooltip
                  :disabled="!row.platOrderName"
                  type="el-popover"
                  :content="row.platOrderName"
                  placement="top"
                >
                  <p class="info-text text-over-hidden-1">
                    平台任务名称：{{
                      row.platOrderName ? row.platOrderName : '--'
                    }}
                  </p>
                </el-tooltip>
                <p class="info-text">
                  平台任务创建时间：{{
                    row.platCreatetime ? row.platCreatetime : '--'
                  }}
                </p>
              </AccountCard>
            </template>
          </el-table-column>
          <el-table-column prop="platPrice" label="平台消耗金额" sortable="custom" />
          <el-table-column
            v-if="extFields.rebateAmount && extFields.rebateAmount.status"
            prop="rebateAmount"
            label="返款"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.rebateAmount | emptyFill }}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="投放价格" sortable="custom" width="120px">
            <template slot="header">
              <span>投放价格</span>
              <IconTip
                content="投放价格=投放下单报价+平台手续费 +补款金额+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额，如该视频资金核算完成，则展示该视频实际消耗金额。"
                icon-class="iconwenhao"
              />
            </template>
          </el-table-column>
          <el-table-column label="视频信息" width="500px" align="left">
            <template slot-scope="{ row }">
              <div class="video-list flex flex-justify-end">
                <VideoList
                  v-if="row.videoList && row.videoList.length"
                  :list-data="row.videoList"
                  :options="{
                    coverImg: 'videoCoverUrl',
                    url: 'videoUrl',
                    title: 'videoTitle',
                  }"
                  :compact="true"
                  :show-video-count="4"
                >
                  <template slot-scope="{ node }">
                    <p class="info-text">
                      发布时间：<span class="info-value">{{
                        node.videoCreateTime
                      }}</span>
                    </p>
                    <p class="info-text">
                      组件类型：{{
                        row.linkUseType ? row.linkUseType : '--'
                      }}
                    </p>
                    <div class="info-text info-p">
                      <span
                        class="info-text"
                      >广告师：{{
                        row.editUserName ? row.editUserName : '未选择'
                      }}</span>
                      <span
                        class="info-text"
                      >投放专员：{{
                        row.cutUserName ? row.cutUserName : '未选择'
                      }}</span>
                    </div>
                  </template>
                </VideoList>
                <VideoInfo
                  v-if="row.videoInfo && row.videoInfo.videoUrl"
                  :info="row.videoInfo"
                  :options="{
                    coverImg: 'videoCoverUrl',
                    url: 'videoUrl',
                    title: 'videoTitle',
                  }"
                >
                  <p class="info-text">
                    发布时间：<span class="info-value">{{
                      row.videoInfo.videoCreateTime
                    }}</span>
                  </p>
                  <p>
                    组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                  </p>
                  <div class="info-text info-p">
                    <span
                      class="info-text"
                    >广告师：{{
                      row.editUserName ? row.editUserName : '未选择'
                    }}</span>
                    <span
                      class="info-text"
                    >投放专员：{{
                      row.cutUserName ? row.cutUserName : '未选择'
                    }}</span>
                  </div>
                </VideoInfo>
                <div v-else class="account-card__gray">暂无视频信息</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="flowCount" label="流量" sortable="custom" />
          <el-table-column
            v-if="extFields.spreadLike && extFields.spreadLike.status"
            prop="spreadLike"
            label="点赞数"
            sortable="custom"
          />
          <el-table-column
            v-if="[1, 3].includes(searchData.conversionSource) && platId === 26"
            prop="flowBoostConsumeAmount"
            width="110px"
            label="实际消耗金额（流量助推）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.flowBoostConsumeAmount | emptyFill }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="searchData.conversionSource === 1 && platId === 26"
            prop="totalConsumeAmount"
            label="总消耗金额"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.totalConsumeAmount | emptyFill }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="[1, 2].includes(searchData.conversionSource)"
            prop="cpm"
            label="CPM"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.cpm | toThousands }}</template>
          </el-table-column>
          <el-table-column
            v-if="[1, 2].includes(searchData.conversionSource)"
            prop="componentClickCount"
            label="组件点击量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.componentClickCount | toThousands }}</template>
          </el-table-column>
          <el-table-column
            v-if="[1, 2].includes(searchData.conversionSource)"
            prop="componentClicknewActive"
            label="新增激活"
            sortable="custom"
          >
            <template slot-scope="{ row }">{{
              row.componentClicknewActive | toThousands
            }}</template>
          </el-table-column>
          <el-table-column
            v-if="[1, 3].includes(searchData.conversionSource) && platId === 26"
            prop="flowBoostConversionCount"
            width="100px"
            label="激活数（流量助推）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.flowBoostConversionCount | emptyFill }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="[1, 2].includes(searchData.conversionSource)"
            prop="cpa"
            label="CPA"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.cpa | toThousands }}</template>
          </el-table-column>
          <el-table-column
            v-if="[1,3].includes(searchData.conversionSource) && platId === 26"
            prop="flowBoostActivateUnitPrice"
            width="110px"
            label="激活单价（流量助推）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.flowBoostActivateUnitPrice | emptyFill }}
            </template>
          </el-table-column>
          <el-table-column
            prop="c2bOrderCount"
            label="C2B总订单量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.c2bOrderCount === null ? '--' : row.c2bOrderCount }}
            </template>
          </el-table-column>
          <el-table-column
            prop="c2bReceiveCount"
            label="C2B总收件量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.c2bReceiveCount === null ? '--' : row.c2bReceiveCount }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="
              extFields.b2cPhoneSubmitOrderCount &&
                extFields.b2cPhoneSubmitOrderCount.status
            "
            prop="b2cPhoneSubmitOrderCount"
            width="120px"
            label="B2C手机下单订单量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.b2cPhoneSubmitOrderCount === null ? '--' : row.b2cPhoneSubmitOrderCount }}
            </template>
          </el-table-column>
          <el-table-column
            v-if="
              extFields.b2cPhoneNetPayOrderCount &&
                extFields.b2cPhoneNetPayOrderCount.status
            "
            prop="b2cPhoneNetPayOrderCount"
            width="120px"
            label="B2C手机净支付数量"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.b2cPhoneNetPayOrderCount === null ? '--' : row.b2cPhoneNetPayOrderCount }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="{ row }">
              <IconTip
                v-if="['A', 'C', 'D'].includes(row.orderConversionViewDetails)"
                v-log
                content="查看详情"
                class="m-r-10"
                icon-class="iconxiangqing"
                @click="handleGoDetail(row)"
              />
              <IconTip
                v-if="row.orderConversionViewDetails === 'B'"
                v-log
                content="平台订单ID重复填写，无法查看订单投后转化详情，请联系订单下单付款人员修改。"
                class="m-r-10"
                icon-class="iconxiangqing"
              />
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getPriateList"
          />
        </div>
      </div>
    </wrap>
  </div>
</template>
<script>
import {
  Search,
  IconTip,
  Statistics,
  AccountCard,
  VideoInfo,
  VideoList
} from 'components'
import {
  computed,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from '@vue/composition-api'
import qs from 'qs'
// import accountSelect from '@/components/AccountSelect/index.vue'
import SelectLazy from '@/components/SelectLazy/index.vue'
import { useTableSort } from '@/hook'
import {
  $getTransferCondition,
  // $getAccountPuttingByPlatId,
  $getFundOrgId,
  $getBasePlatInfo,
  $getVideoType,
  $getContentTypeList
} from '@/api/bussiness-manage'
import { $getPirateList } from '@/api/proprietary-orders'
import { $getPlusAccountInfo } from '@/api/putting-manager'
// import { $getB2CPhoneModel } from '@/api/bussiness-manage'
import { $getDataByDictType } from '@/api'
import { copy, unique } from '@/utils'
import dayjs from 'dayjs'
export default {
  components: {
    Statistics,
    Search,
    IconTip,
    // accountSelect,
    SelectLazy,
    AccountCard,
    VideoInfo,
    VideoList
  },
  setup() {
    const { $permission, $refs, $nextTick, $set, $router, $message } =
      getCurrentInstance().proxy
    const extFields = reactive({
      rebateAmount: { status: false, chnName: '返款' },
      spreadLike: { status: false, chnName: '点赞数' },
      b2cPhoneSubmitOrderCount: { status: false, chnName: 'B2C手机下单订单量' },
      b2cPhoneNetPayOrderCount: { status: false, chnName: 'B2C手机净支付数量' }
    })
    const state = reactive({
      WhetherDisabled: true,
      summaryData: [],
      loading: false,
      tableData: [],
      total: 0,
      platId: '',
      getPlusAccountInfo: $getPlusAccountInfo
    })
    // source: 0-快手以外的平台 1快手转化来源（全部流量） 2快手转化来源（自然流量） 1快手转化来源（助推流量）
    const summaryItems = [
      {
        source: '0123',
        key: 'orderCount',
        val: 0,
        text: '订单量'
      },
      {
        source: '0123',
        key: 'flowCount',
        val: 0,
        text: '流量'
      },
      {
        source: '02',
        key: 'priceCount',
        val: 0,
        text: '投放价格'
      },
      {
        source: '13',
        key: 'flowBoostConsumeAmount',
        val: 0,
        text: '实际消耗金额',
        discription: '（流量助推）'
      },
      {
        source: '1',
        key: 'totalConsumeAmount',
        val: 0,
        text: '总消耗金额',
        tip: '总消耗金额：汇总订单所有消耗金额，根据订单下单报价、平台手续费、补款金额、抖+成本、其他成本、流量助推实际消耗相加计算，另外订单核算后的返款金额会相应扣减。'
      },

      {
        source: '012',
        key: 'cpmCount',
        val: 0,
        text: 'CPM',
        tip: 'cpm=总消耗金额/(流量/1000)'
      },
      {
        source: '012',
        key: 'componentClickNewActiveCount',
        val: 0,
        text: '新增激活',
        tip: '2022年8月2日快手改为曝光口径'
      },
      {
        source: '13',
        key: 'flowBoostConversionCount',
        val: 0,
        text: '激活数',
        discription: '（流量助推）'
      },
      {
        source: '012',
        key: 'cpaCount',
        val: 0,
        text: 'CPA',
        tip: 'CPA=投放金额/新增激活'
      },
      {
        source: '13',
        key: 'flowBoostActivateUnitPrice',
        val: 0,
        text: '激活单价',
        discription: '（流量助推）'
      },
      {
        source: '0123',
        key: 'c2bReceiverCount',
        val: 0,
        text: 'C2B总收件量'
      },
      {
        source: '0123',
        key: 'b2cPayOrderCount',
        val: 0,
        text: 'B2C手机净支付数量'
      }
    ]
    const formConf = reactive({
      normal: [],
      hasExport: $permission('export_code_pirate')
    })
    let _businessTags = reactive({})
    const searchData = ref({
      pageNum: 0,
      conversionSource: 2,
      platId: ''
    })

    $nextTick(() => {
      const timeEnd = dayjs().format('YYYY-MM-DD')
      const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
      $set($refs.search.form, 'videodaterange', [`${timeStart}`, `${timeEnd}`])
      $set($refs.search.form, 'conversionSource', 2)
      searchData.value.videoCreateStartTime = timeStart + ' 00:00:00'
      searchData.value.videoCreateEndTime = timeEnd + ' 23:59:59'
      getPriateList()
    })

    const normalFormItemMap = {}

    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'videoTag',
          // ,"value": ""
          data: [
            { val: '转转', text: '转转' },
            { val: '找靓机', text: '找靓机' }
          ],
          conf: {
            placeholder: '品牌标签'
          }
        },
        {
          type: 'select',
          key: 'businessTag',
          data: [],
          conf: {
            placeholder: '业务标签'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        // {
        //   type: 'cascader',
        //   key: 'b2cPhoneModelId',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择产品型号',
        //     props: { value: 'modelId', label: 'modelName', children: 'phoneModelVOList' },
        //     filterMethod: (node, val) => {
        //       const REP = /\s+/g
        //       const txt = (node.text || '').replace(REP, '')
        //       const value = (val || '').replace(REP, '')
        //       if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        //         return true
        //       }
        //     }
        //   },
        //   optionValKey: 'modelId',
        //   optionLabelKey: 'modelName'
        // },
        {
          type: 'select',
          key: 'junType',
          data: [],
          conf: {
            placeholder: '视频类型'
          },
          optionLabelKey: 'junType',
          optionValKey: 'junType'
        },
        {
          type: 'select',
          key: 'contentType',
          data: [],
          conf: {
            placeholder: '内容类别'
          }
        },
        {
          type: 'input',
          key: 'orderCommand',
          conf: {
            placeholder: '请输入口令'
          }
        },
        {
          type: 'select',
          key: 'dId',
          data: [],
          conf: {
            placeholder: '请选择军'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId'
        },
        {
          type: 'select',
          key: 'fId',
          data: [],
          conf: {
            placeholder: '请选择团'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId'
        },
        {
          type: 'select',
          key: 'editUserId',
          data: [],
          conf: {
            placeholder: '请选择广告师'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'cutUserId',
          data: [],
          conf: {
            placeholder: '请选择投放专员'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        }
      ]
      normal = normal.filter(function(item, index) {
        if (item.permissionName && !$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })

      normalFormItemMap.platId = {
        type: 'select',
        key: 'platId',
        data: [],
        conf: {
          placeholder: '全部平台'
        },
        optionLabelKey: 'platName',
        optionValKey: 'platId'
      }

      normalFormItemMap.accountId = {
        type: 'select',
        key: 'accountId',
        data: [],
        conf: {
          placeholder: '请选择账号',
          isAccountName: false
        },
        optionLabelKey: 'accountName',
        optionValKey: 'accountId'
      }

      formConf.normal = normal
    }

    const getVideoType = async(val) => {
      const res = await $getVideoType({ brand: val })
      const { code, data = [] } = res || {}
      if (+code === 1) {
        normalFormItemMap.junType.data = data
      }
    }

    const getFundOrgId = (orgId) => {
      $getFundOrgId({ orgId })
        .then((res) => {
          if (res.code === 1) {
            if (!orgId) {
              normalFormItemMap.dId.data = res.data
            } else {
              normalFormItemMap.fId.data = res.data
            }
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    }

    // const getAccountPuttingByPlatId = (platId) => {
    //   $getAccountPuttingByPlatId({ platId })
    //     .then((res) => {
    //       if (res.code === 1) {
    //         normalFormItemMap.accountId.data = res.data
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //     })
    // }

    const getContentTypeList = () => {
      $getContentTypeList().then((res) => {
        if (res.code === 1) {
          normalFormItemMap.contentType.data = res.data.map((item) => ({
            text: item,
            val: item
          }))
        }
      })
    }

    const getTransferCondition = (orgId) => {
      $getTransferCondition({ orgId })
        .then((res) => {
          if (res.code === 1) {
            if (!orgId) {
              normalFormItemMap.cutUserId.data = res.data
            }
            normalFormItemMap.editUserId.data = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    // 获取平台列表
    const getBasePlatInfo = () => {
      $getBasePlatInfo()
        .then((res) => {
          if (res.code === 1) {
            (normalFormItemMap.platId || {}).data = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    // 获取业务标签
    const getBusinessTags = () => {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then((res) => {
        if (res.code === 1) {
          _businessTags = res.data
          normalFormItemMap.businessTag.data = unique(
            [
              ...res.data.zz_putting_business_tag,
              ...res.data.zlj_putting_business_tag
            ],
            'dictValue'
          )
        }
      })
    }
    const onChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'dId':
          model.fId = ''
          model.editUserId = ''
          // model.cutUserId = ''
          normalFormItemMap.fId.data = []
          normalFormItemMap.editUserId.data = []
          // normalFormItemMap.cutUserId.data = []
          getTransferCondition(val)
          if (!val) {
            return
          }
          getFundOrgId(val)
          break
        case 'fId':
          if (!val) {
            return
          }
          model.editUserId = ''
          // model.cutUserId = ''
          normalFormItemMap.editUserId.data = []
          // normalFormItemMap.cutUserId.data = []
          getTransferCondition(val)
          break
        case 'videoTag':
          getVideoType(val)
          model.businessTag = ''
          model.junType = ''
          if (!val) {
            normalFormItemMap.businessTag.data = unique(
              [
                ..._businessTags.zz_putting_business_tag,
                ..._businessTags.zlj_putting_business_tag
              ],
              'dictValue'
            )
            return
          }
          if (val === '找靓机') {
            normalFormItemMap.businessTag.data =
              _businessTags.zlj_putting_business_tag
          } else {
            normalFormItemMap.businessTag.data =
              _businessTags.zz_putting_business_tag
          }
          break
      }
    }
    // 区分快手或者其他平台
    const platId = computed(() => {
      return searchData.value.platId || 25
    })

    const getPriateList = function() {
      state.loading = true
      const params = copy(searchData.value)
      if (params.platId !== 26) {
        params.conversionSource = 2
      }
      const flag = params.platId !== 26 ? 0 : searchData.value.conversionSource
      return $getPirateList({
        ...params,
        platOwner: '投放'
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1 && res.data) {
            summaryItems.forEach((item) => {
                if ([0, 2].includes(flag)) {
                  if (item.key === 'cpmCount') { item.tip = 'CPM=投放金额/（流量/1000)' }
                  if (item.key === 'cpaCount') { item.tip = 'CPA=投放金额/新增激活' }
                } else {
                  if (item.key === 'cpmCount') { item.tip = 'CPM=总消耗金额/(流量/1000)' }
                  if (item.key === 'cpaCount') { item.tip = 'cpA=总消耗金额/新增激活' }
                }
                item.val = (res.data.dataStatics || [])[item.key]
              })
              state.summaryData = summaryItems.filter((item) =>
                item.source.includes(flag)
              )
            if (res.data.list) {
              res.data.list.forEach((item) => {
                const list = item.componentClickConversionRelationVideoVOList
                if (Array.isArray(list) && list.length >= 1) {
                  item.videoList = list.slice(0, list.length - 1).reverse()
                  item.videoInfo = list[list.length - 1]
                } else {
                  item.videoList = []
                  item.videoInfo = {}
                }
              })
              state.tableData = res.data.list
              state.total = res.data.total
            } else {
              state.tableData = []
              state.total = 0
            }
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    const handleGoDetail = (row) => {
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
      const { href } = $router.resolve({
        path: '/putting-manager/component-detail',
        query
      })
      window.open(href, '_blank')
    }

    const handleChangePlat = (val) => {
      if (val === 26) {
        $set($refs.search.form, 'conversionSource', 1)
        searchData.value.conversionSource = 1
      } else {
        $set($refs.search.form, 'conversionSource', 2)
        searchData.value.conversionSource = 2
      }
      state.WhetherDisabled = val !== 26
      $refs.search.form.accountId = ''
      // normalFormItemMap.accountId.data = []
      // getAccountPuttingByPlatId(val)
    }

    // 时间添加时分秒
    const formatData = (data) => {
      const params = copy(data)
      if (params.videodaterange) {
        // 视频发布时间
        params.videoCreateStartTime = params.videodaterange[0] + ' 00:00:00'
        params.videoCreateEndTime = params.videodaterange[1] + ' 23:59:59'
        delete params.videodaterange
      }
      if (params.createdaterange) {
        // 视频创建时间
        params.platCreateStartTime = params.createdaterange[0] + ' 00:00:00'
        params.platCreateEndTime = params.createdaterange[1] + ' 23:59:59'
        delete params.createdaterange
      } else {
        params.platCreateStartTime = ''
        params.platCreateEndTime = ''
      }
      return params
    }
    // const formatAccount = (data) => {
    //   const params = copy(data)
    //   if (!params.platId) {
    //     const list = normalFormItemMap.accountId.data || []
    //     const item = list.find(item => item.accountId === params.accountId) || {}
    //     params.accountName = item.accountName
    //     delete params.accountId
    //   } else {
    //     delete params.accountName
    //   }
    //   return params
    // }
    const onSubmit = (data) => {
      const params = formatData(data)
      params.orgId = params.fId || params.dId || ''
      delete params.dId
      delete params.fId
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      Object.assign(searchData.value, params)
      getPriateList()
    }

    const onExport = (data) => {
      const params = formatData(Object.assign({}, searchData.value, data))
      params.orgId = params.fId || params.dId || ''
      delete params.dId
      delete params.fId
      const propertyNameList = []
      for (const key in extFields) {
        if (!extFields[key].status) {
          propertyNameList.push(key)
        }
      }
      params.conversionSource = params.platId !== 26 ? 2 : 1
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      window.open(
        `/api/delivery/app/fund/export?${qs.stringify({
          ...params,
          propertyNameList: [...new Set(propertyNameList)]
        })}`
      )
    }
    // const getB2CPhoneModel = async() => {
    //   const { code, data } = await $getB2CPhoneModel()
    //   if (+code === 1) {
    //     normalFormItemMap.b2cPhoneModelId.data = data || []
    //   }
    // }
    // 排序
    const { doSort } = useTableSort(searchData.value, getPriateList)
    getBusinessTags()
    getVideoType()
    getContentTypeList()
    getBasePlatInfo()
    buildFormConf()
    // getB2CPhoneModel()
    getFundOrgId()
    getTransferCondition()
    // getAccountPuttingByPlatId()
    return {
      extFields,
      searchData,
      formConf,
      onSubmit,
      onExport,
      onChange,
      ...toRefs(state),
      normalFormItemMap,
      handleChangePlat,
      getPriateList,
      doSort,
      platId,
      handleGoDetail
    }
  }
}
</script>

<style lang="scss" scoped>
.search-view {
  display: flex;

  & > span {
    flex-shrink: 0;
    font-size: 14px;
    color: #595959;
    font-weight: 600;
    padding-top: 6px;
    padding-right: 12px;
  }
}

.slot-search-view {
  transform: translateX(-70px);
}

.m-r {
  margin-right: 0;
}
.slot-header {
  color: #b1b0b0;
  font-size: 12px;
}
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
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
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}
</style>
