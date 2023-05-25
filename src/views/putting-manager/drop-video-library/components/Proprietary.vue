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
        <!-- <template v-slot:prv>
          <span class="search-title m-r-16">标签筛选</span>
        </template> -->
        <template v-slot:cascader>
          <VirtualCascader
            v-model="virtualData"
            :options="normalFormItemMap.b2cPhoneModelIdStrs.data"
            placeholder="请选择产品型号"
          />
        </template>
        <template v-slot:normal="target">
          <!-- <br> -->
          <div class="search-view slot-search-view">
            <span>订单筛选</span>
            <div>
              <el-form-item>
                <el-select
                  v-model="target.model.platId"
                  placeholder="全部平台"
                  clearable
                  @change="handlePlatId"
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
              <el-form-item>
                <accountSelect
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
                />
                <!-- <el-select
                  v-model="formInnner.accountId"
                  filterable
                  clearable
                  placeholder="请输入账号"
                >
                  <el-option
                    v-for="item in accountList"
                    :key="item.accountId"
                    :label="item.accountName"
                    :value="item.accountId"
                  />
                </el-select> -->
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.platOrderId"
                  clearable
                  placeholder="请输入平台订单ID"
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.videoTitle"
                  placeholder="请输入视频标题"
                  clearable
                />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="target.model.taskName"
                  placeholder="请输入平台任务名称关键词"
                  clearable
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
                  clearable
                />
              </el-form-item>
            </div>
          </div>
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <div class="m-b-8 flex flex-justify-between">
        <div>
          <i class="iconfont el-icon-setting" />
          <el-button
            type="text"
            @click="showSummaryFieldConfig = true"
          >设置显示的指标</el-button>
        </div>
        <div class="detail-column">
          <span class="m-r-12">指标信息：</span>
          <el-radio-group v-model="targetType">
            <el-radio label="1">展开</el-radio>
            <el-radio label="0">收起</el-radio>
          </el-radio-group>
        </div>
      </div>
      <Statistics v-loading="loading" :class="`${targetType==='0'?'statistics':'show-total-wrap'}`" :data="summaryData" />
    </wrap>
    <wrap class="table-view m-t-24">
      <div class="m-b-8 flex flex-justify-between">
        <div>
          <i class="iconfont el-icon-setting" />
          <el-button
            type="text"
            @click="showTableFieldConfig = true"
          >设置显示的字段</el-button>
        </div>
        <div class="detail-column">
          <span class="m-r-12">列表详情信息：</span>
          <el-radio-group v-model="radioType" @change="handleRadioType">
            <el-radio label="1">展开</el-radio>
            <el-radio label="0">收起</el-radio>
          </el-radio-group>
        </div>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column
          v-for="(item, index) in tableSortConfigData"
          :key="index"
          :prop="item.field"
          :label="item.name"
          :fixed="
            ['accountInfo'].includes(item.type) ? 'left' : null
          "
          :width="item.width || '100'"
          :align="item.align || ''"
          :sortable="item.sort ? 'custom' : false"
        >
          <template v-if="item.tip" slot="header">
            <span>{{ item.name }}</span>
            <IconTip :content="item.tip" icon-class="iconwenhao" />
          </template>
          <template slot-scope="{ row }">
            <template v-if="item.type === 'accountInfo'">
              <AccountCard :info="row" :options="{ name: 'accountName' }">
                <template>
                  <div class="video-list flex flex-justify-end">
                    <template v-if="row.videoList && row.videoList.length">
                      <VideoList
                        v-if="showDetailColumn"
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
                          <p class="info-text flex">
                            发布时间：{{ node.videoCreateTime || '--' }}
                          </p>
                          <p class="info-text">
                            组件类型：{{
                              row.linkUseType ? row.linkUseType : '--'
                            }}
                          </p>
                        </template>
                      </VideoList>
                    </template>
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
                        发布时间：{{ row.videoInfo.videoCreateTime || '--' }}
                      </p>
                      <p>
                        组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                      </p>
                    </VideoInfo>
                    <div v-else class="account-card__gray">暂无视频</div>
                  </div>
                  <el-popover
                    v-if="
                      row.videoList && row.videoList.length && !showDetailColumn
                    "
                    placement="top-start"
                    width="300"
                    trigger="hover"
                  >
                    <div
                      v-for="(innerItem, Iindex) in row.videoList"
                      :key="Iindex"
                      class="m-b-12"
                    >
                      <VideoInfo
                        :info="innerItem"
                        :options="{
                          coverImg: 'videoCoverUrl',
                          url: 'videoUrl',
                          title: 'videoTitle',
                        }"
                      >
                        <p class="info-text">
                          发布时间：{{ innerItem.videoCreateTime || '--' }}
                        </p>
                        <p>
                          组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                        </p>
                      </VideoInfo>
                    </div>
                    <el-button
                      v-if="
                        row.videoList &&
                          row.videoList.length >= 1 &&
                          !showDetailColumn
                      "
                      slot="reference"
                      type="text"
                      size="mini"
                    >查看剩余{{ row.videoList.length }}条视频</el-button>
                  </el-popover>
                </template>
                <template v-if="row.showAccountInfo">
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
                </template>
                <template v-slot:last>
                  <el-button
                    v-if="!row.showAccountInfo"
                    type="text"
                    size="mini"
                    @click="() => (row.showAccountInfo = true)"
                  >展开更多
                  </el-button>
                  <el-button
                    v-else
                    type="text"
                    size="mini"
                    @click="() => (row.showAccountInfo = false)"
                  >收起
                  </el-button>
                  <!-- <i class="iconfont iconzhankai" /> -->
                </template>
              </AccountCard>
            </template>
            <!-- <template v-else-if="item.type === 'video'">
              <div class="video-list flex flex-justify-end">
                <template v-if="row.videoList && row.videoList.length">
                  <VideoList
                    v-if="showDetailColumn"
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
                      <p class="info-text flex">
                        发布时间：{{ node.videoCreateTime || '--' }}
                      </p>
                      <p class="info-text">
                        组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                      </p>
                    </template>
                  </VideoList>
                </template>
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
                    发布时间：{{ row.videoInfo.videoCreateTime || '--' }}
                  </p>
                  <p>
                    组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                  </p>
                </VideoInfo>
                <div v-else class="account-card__gray">暂无视频信息</div>
              </div>
              <el-popover
                v-if="
                  row.videoList && row.videoList.length && !showDetailColumn
                "
                placement="top-start"
                width="300"
                trigger="hover"
              >
                <div
                  v-for="(innerItem, Iindex) in row.videoList"
                  :key="Iindex"
                  class="m-b-12"
                >
                  <VideoInfo
                    :info="innerItem"
                    :options="{
                      coverImg: 'videoCoverUrl',
                      url: 'videoUrl',
                      title: 'videoTitle',
                    }"
                  >
                    <p class="info-text">
                      发布时间：{{ innerItem.videoCreateTime || '--' }}
                    </p>
                    <p>
                      组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                    </p>
                  </VideoInfo>
                </div>
                <el-button
                  v-if="
                    row.videoList &&
                      row.videoList.length >= 1 &&
                      !showDetailColumn
                  "
                  slot="reference"
                  type="text"
                  size="mini"
                >查看剩余{{ row.videoList.length }}条视频</el-button>
              </el-popover>
            </template> -->
            <template v-else-if="item.type === 'c2bPriceSection'">
              <div v-if="row.showC2bData" class="flex c2bPriceSection">
                <div>
                  <div style="width: 120px" class="m-b-8">价格区间</div>
                  <div>【0，100）</div>
                  <div>【100，400）</div>
                  <div>【400，900）</div>
                  <div>【900，1800）</div>
                  <div>【1800，3000）</div>
                  <div>【3000以上】</div>
                </div>
                <div>
                  <div class="m-b-8">回收量</div>
                  <div>{{ row.recAllFinish0100OrderQty || 0 }}</div>
                  <div>{{ row.recAllFinish100400OrderQty || 0 }}</div>
                  <div>{{ row.recAllFinish400900OrderQty || 0 }}</div>
                  <div>{{ row.recAllFinish9001800OrderQty || 0 }}</div>
                  <div>{{ row.recAllFinish18003000OrderQty || 0 }}</div>
                  <div>{{ row.recAllFinish3000InfOrderQty || 0 }}</div>
                </div>
                <div>
                  <div class="m-b-10">占比</div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish0100OrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish100400OrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish400900OrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish9001800OrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish18003000OrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                  <div>
                    {{
                      computedTotal(row)
                        ? `${Number(
                          ((row.recAllFinish3000InfOrderQty || 0) /
                            computedTotal(row)) *
                            100
                        ).toFixed(2)}%`
                        : '0%'
                    }}
                  </div>
                </div>
              </div>
              <template>
                <el-button
                  v-if="!row.showC2bData"
                  class="m-l-8"
                  type="text"
                  size="mini"
                  @click="() => (row.showC2bData = true)"
                >查看详情</el-button>
                <el-button
                  v-else
                  class="m-l-8"
                  type="text"
                  size="mini"
                  @click="() => (row.showC2bData = false)"
                >收起详情</el-button>
              </template>
            </template>
            <template v-else-if="item.type === 'personInfo'">
              <p class="flex">
                <span>军：{{ row.dname || '--' }}</span>
                <span>团：{{ row.fname || '--' }}</span>
              </p>
              <p class="flex">
                <span>编辑人员：{{ row.editUserName || '未选择' }}</span>
                <span>剪辑人员：{{ row.cutUserName || '--' }}</span>
              </p>
              <p>
                <span>网红：{{ row.influencer || '未选择' }}</span>
              </p>
            </template>
            <template v-else-if="item.type === 'flowCount'">
              <div>{{ row.flowCount || '--' }}</div>
              <div v-if="row.flowCountUpdateTime" class="updateTime">
                <el-tag size="small" type="info">更新时间：{{ row.flowCountUpdateTime.slice(0,-3) || '--' }}</el-tag>
              </div>
            </template>
            <template v-else>
              {{ getTableF(row, item) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="$permission('component_click_self_detail')"
          label="操作"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <IconTip
              content="查看订单详情"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleGoDetail(row)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div>
        <el-pagination
          background
          layout="total, prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getProprietaryList"
        />
      </div>
    </wrap>

    <SummaryFieldConfig
      v-if="showSummaryFieldConfig"
      :show="showSummaryFieldConfig"
      :config-data="summaryConfigData"
      code="config_self_summary_button"
      @close="showSummaryFieldConfig = false"
      @confirm="handleConfirmChooseSummaryField"
    />

    <TableFieldConfig
      v-if="showTableFieldConfig"
      :show="showTableFieldConfig"
      :config-data="tableConfigData"
      code="config_self_select_button"
      :sort-data="tableSortConfigData"
      @close="showTableFieldConfig = false"
      @confirm="handleConfirmChooseTableField"
    />

    <ExportFieldConfig
      v-if="showExportFieldConfig"
      :show="showExportFieldConfig"
      :config-data="exportConfigData"
      code="export_code_propriety"
      @close="showExportFieldConfig = false"
      @confirm="handleConfirmChooseExportField"
    />
  </div>
</template>
<script>
import {
  Search,
  Statistics,
  AccountCard,
  VideoInfo,
  VideoList,
  IconTip
} from 'components'
import accountSelect from '@/components/AccountSelect/index.vue'
import { useTableSort } from '@/hook'
import {
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  computed
} from '@vue/composition-api'
import { copy } from '@/utils'
import {
  $getProprietaryFundOrgId,
  $getSelfAccount,
  $getBasePlatInfo,
  $getB2CPhoneModel
} from '@/api/bussiness-manage'
import { $getAccontByOrgIdOrPlatId } from '@/api/military-manage'
import { $getDropVideoLibrarySelfList } from '@/api/proprietary-orders'
import TableFieldConfig from '@/components/TableFieldConfig'
import ExportFieldConfig from '@/components/ExportFieldConfig'
import SummaryFieldConfig from '@/components/SummaryFieldConfig'
import { downloadFile } from '@/utils/download'
import { fieldConfigData, fieldSortConfigData } from '../selfTableConfig'
import VirtualCascader from '@/components/VirtualCascader'
import dayjs from 'dayjs'
import qs from 'qs'
export default {
  components: {
    Search,
    Statistics,
    AccountCard,
    VideoInfo,
    VideoList,
    IconTip,
    accountSelect,
    TableFieldConfig,
    ExportFieldConfig,
    SummaryFieldConfig,
    VirtualCascader
  },
  setup() {
    const { $permission, $router, $message, $refs, $nextTick, $set, $store } =
      getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: $permission('export_code_propriety')
    })

    const states = reactive({
      platInfo: [],
      accountList: [],
      formInnner: {
        platId: ''
      },
      extFields: {
        spreadLike: { status: false, chnName: '点赞数' },
        b2cPhoneSubmitOrderCount: {
          status: false,
          chnName: 'B2C手机下单订单量'
        },
        b2cPhoneNetPayOrderCount: {
          status: false,
          chnName: 'B2C手机净支付数量'
        }
      },
      tableData: [],
      total: 0,
      loading: false,
      summaryData: [],
      showTableFieldConfig: false,
      showExportFieldConfig: false,
      tableConfigData: [],
      exportConfigData: [],
      tableSortConfigData: [],
      showSummaryFieldConfig: false,
      summaryConfigData: [],
      dataStatics: {},
      exportData: {},
      radioType: '0',
      targetType: '0',
      cascaderProps: {
        checkStrictly: false,
        children: 'phoneModelVOList',
        emitPath: false,
        multiple: true,
        label: 'modelName',
        value: 'modelId'
      },
      virtualData: []
    })
    const showDetailColumn = computed(() => {
      return !!+states.radioType
    })
    const handleRadioType = (val) => {
      states.tableData.forEach((item) => {
        item.showC2bData = !!+val
        item.showAccountInfo = !!+val
      })
    }
    const loadConfigData = (fieldConfigData, saveConfig, type) => {
      const newFieldConfigData = fieldConfigData.map((item) => {
        const newItem = { ...item }

        const saveIndex = saveConfig.findIndex((it) => it.field === item.field)

        if (saveIndex > -1) {
          if (type === 'export') {
            // 能找到， 原有的 对齐defaultShow, 递归内部children。 找不到取新值
            newItem.exportDefaultShow = saveConfig[saveIndex].exportDefaultShow
          } else {
            // 能找到， 原有的 对齐defaultShow, 递归内部children。 找不到取新值
            newItem.defaultShow = saveConfig[saveIndex].defaultShow
          }

          if ((newItem.children || []).length) {
            newItem.children = loadConfigData(
              newItem.children,
              saveConfig[saveIndex].children,
              type
            )
          }
        }

        return newItem
      })
      return newFieldConfigData
    }

    const menuConfig = $store.state.user.config || []
    const tableMenuIndex = menuConfig.findIndex(
      (item) => item.menuCode === 'config_self_select_button'
    )

    const exportMenuIndex = menuConfig.findIndex(
      (item) => item.menuCode === 'export_code_propriety'
    )

    const summaryMenuIndex = menuConfig.findIndex(
      (item) => item.menuCode === 'config_self_summary_button'
    )

    // 所有
    const allSortData = fieldConfigData
      .map((item) => item.children)
      .flat(Infinity)
    // 根据自定义数据进行菜单加载
    if (tableMenuIndex > -1) {
      // 保存的排序数据
      const saveSort = JSON.parse(menuConfig[tableMenuIndex].customColumns).sort

      // 保存的配置数据
      const saveConfig = JSON.parse(
        menuConfig[tableMenuIndex].customColumns
      ).config

      const tableSortConfigData = allSortData
        .map((item) => {
          let newItem = { ...item }
          // 保存的排序的index
          const index = saveSort.findIndex((it) => it.field === item.field)

          // 从保存的配置中找的index
          const sortIndexInConfig = saveConfig
            .map((item) => item.children)
            .flat(Infinity)
            .findIndex((it) => it.field === item.field)

          // 找到了 说明该字段无改变
          if (index > -1) {
            newItem = saveSort[index]
          } else if (sortIndexInConfig > -1) {
            // 在保存的中没找到 且不是第一级 再从保存的配置中找，找到了 说明是取消的 直接取值
            newItem = saveConfig.map((item) => item.children).flat(Infinity)[sortIndexInConfig]
          } else {
            // 没找到 说明是新增的字段 返回原值即可，删减的情况不用考虑 不取任何值即可
            // 默认不展示 返回空
            if (!newItem.defaultShow) {
              return ''
            }
          }
          return newItem
        })
        .filter((item) => (item || {}).defaultShow)

      const finalSortData = []

      saveSort.forEach((item) => {
        const index = tableSortConfigData.findIndex(it => it.field === item.field)

        if (index > -1) {
          finalSortData.push(item)
          tableSortConfigData.splice(index, 1)
        }
      })

      const tableSortConfigData1 = [...finalSortData, ...tableSortConfigData]
      tableSortConfigData1.forEach(item => {
         if (item.field === 'platOrderInfo') {
          item.width = '380px'
         }
        if (item.field !== 'videoInfo') {
          states.tableSortConfigData.push(item)
        }
        if (item.field === 'flowCount') {
          item.type = 'flowCount'
          item.width = '200px'
        }
      })
      const tableConfigData = loadConfigData(fieldConfigData, saveConfig)
      states.tableConfigData = tableConfigData
    } else {
     const tableSortConfigData1 = [...fieldSortConfigData]
      tableSortConfigData1.forEach(item => {
        if (item.field === 'platOrderInfo') {
          item.width = '370px'
        }
        if (item.field !== 'videoInfo') {
          states.tableSortConfigData.push(item)
        }
        if (item.field === 'flowCount') {
          item.type = 'flowCount'
          item.width = '200px'
        }
      })
      states.tableConfigData = [...fieldConfigData]
    }

    if (exportMenuIndex > -1) {
      // 保存的配置数据
      const saveExportConfig = JSON.parse(
        menuConfig[exportMenuIndex].customColumns
      ).config

      const exportConfigData = loadConfigData(fieldConfigData, saveExportConfig, 'export')

      states.exportConfigData = exportConfigData
    } else {
      states.exportConfigData = [...fieldConfigData]
    }

    if (summaryMenuIndex > -1) {
      // 所有
      const allSummaryData = fieldConfigData
        .map((item) => {
          return item.children
            .map((it) => {
              // delete it.children
              if (it.summary) {
                return it
              } else {
                return ''
              }
            })
            .filter((it) => it)
        })
        .flat(Infinity)

      // 保存的排序数据
      const saveSummary = JSON.parse(
        menuConfig[summaryMenuIndex].customColumns
      ).config

      const summaryConfigData = allSummaryData.map((item) => {
        let newItem = { ...item }
        const index = saveSummary.findIndex((it) => it.field === item.field)
        // 找到了 说明该字段无改变
        if (index > -1) {
          newItem = { ...saveSummary[index], tip: item.tip }
        } else {
          // 与上面sort的区别是 sort只展示显示的且存在的，
          // 没找到 说明是新增的字段 返回原值即可，删减的情况不用考虑 不取任何值即可
        }

        return newItem
      })

      states.summaryConfigData = summaryConfigData
      states.summaryData = summaryConfigData
        .filter((item) => +item.defaultShow)
        .map((item) => {
          return {
            key: item.field,
            val: 0,
            text: item.name,
            tip: item.tip
          }
        })
    } else {
      const summary = fieldConfigData
        .map((item) => {
          return item.children
            .map((it) => {
              // delete it.children
              if (it.summary) {
                return it
              } else {
                return ''
              }
            })
            .filter((it) => it)
        })
        .flat(Infinity)
      states.summaryConfigData = summary
      states.summaryData = summary
        .filter((item) => +item.defaultShow)
        .map((item) => {
          return {
            key: item.field,
            val: 0,
            text: item.name,
            tip: item.tip
          }
        })
    }

    const searchData = ref({
      platOwner: states.platOwner,
      platId: '',
      pageNum: 1
    })
    $nextTick(() => {
      const timeEnd = dayjs().format('YYYY-MM-DD')
      const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
      $set($refs.search.form, 'videodaterange', [`${timeStart}`, `${timeEnd}`])
      searchData.value.videoCreateStartTime = timeStart + ' 00:00:00'
      searchData.value.videoCreateEndTime = timeEnd + ' 23:59:59'
      getProprietaryList()
    })
    // 时间添加时分秒
    const formatData = (data) => {
      const params = copy(data)
      if (params.videodaterange) {
        // 视频发布时间
        params.videoCreateStartTime = params.videodaterange[0] + ' 00:00:00'
        params.videoCreateEndTime = params.videodaterange[1] + ' 23:59:59'
      } else {
        params.videoCreateStartTime = ''
        params.videoCreateEndTime = ''
      }
      delete params.videodaterange
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
    const onChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'dId':
          model.fId = ''
          normalFormItemMap.fId.data = []
          model.editIdOrCutId = ''
          normalFormItemMap.editIdOrCutId.data = []
          getAccontByOrgIdOrPlatId(model)
          if (!val) {
            return
          }
          getProprietaryFundOrgId(val)
          break
        case 'fId':
          if (!val) {
            return
          }
          model.editIdOrCutId = ''
          normalFormItemMap.editIdOrCutId.data = []
          getAccontByOrgIdOrPlatId(model)
          break
      }
    }
    const handlePlatId = (val) => {
      $refs.search.form.accountId = ''
      normalFormItemMap.accountId.data = []
      getSelfAccount(val)
    }
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'dId',
          data: [],
          conf: {
            placeholder: '请选择军（账号归属）'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'select-army'
        },
        {
          type: 'select',
          key: 'fId',
          data: [],
          conf: {
            placeholder: '请选择团（账号归属）'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'select-group'
        },
        {
          type: 'select',
          key: 'jobType',
          data: [
            { val: 'edit', text: '编辑' },
            { val: 'cut', text: '剪辑' }
          ],
          conf: {
            placeholder: '请选择人员职责'
          }
        },
        {
          type: 'select',
          key: 'editIdOrCutId',
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          data: [],
          conf: {
            placeholder: '请输入人员名称'
          }
        },
        {
          type: 'cascaderSlot',
          key: 'b2cPhoneModelIdStrs',
          data: []
          // conf: {
          //   placeholder: '请选择产品型号',
          //   props: {
          //     value: 'modelId',
          //     expandTrigger: 'hover',
          //     label: 'modelName',
          //     children: 'phoneModelVOList',
          //     multiple: true
          //   },
          //   filterable: true,
          //   collapseTags: true,
          //   showAllLevels: false,
          //   ref: 'cascader',
          //   filterMethod: (node, val) => {
          //     const REP = /\s+/g
          //     const txt = (node.text || '').replace(REP, '')
          //     const value = (val || '').replace(REP, '')
          //     if (
          //       !!~txt.indexOf(val) ||
          //       !!~txt.toUpperCase().indexOf(value.toUpperCase())
          //     ) {
          //       return true
          //     }
          //   }
          // },
          // optionValKey: 'modelId',
          // optionLabelKey: 'modelName'
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
    const getSelfAccount = (val) => {
      $getSelfAccount({ platId: val })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    const getProprietaryFundOrgId = (orgId) => {
      $getProprietaryFundOrgId({ orgId })
        .then((res) => {
          if (res.code === 1) {
            if ($permission('select-army') && $permission('select-group')) {
              if (!orgId) {
                normalFormItemMap.dId.data = res.data
              } else {
                normalFormItemMap.fId.data = res.data
              }
            }
            if (!$permission('select-army') && $permission('select-group')) {
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

    const getBasePlatInfo = () => {
      $getBasePlatInfo()
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.platId.data = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    // 选择人员列表
    const getAccontByOrgIdOrPlatId = (model = {}) => {
      $getAccontByOrgIdOrPlatId({
        platId: model.platId || '',
        orgId: model.orgId || '',
        accountType: 1,
        methodId: 2
      })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data.accountInfo
            normalFormItemMap.editIdOrCutId.data = res.data.employeeNameVO
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const editAndCut = (data) => {
      const jobType = data.jobType ? data.jobType : ''
      const jobMap = {
        editId: 'edit',
        cutId: 'cut',
        editIdOrCutId: ''
      }
      for (const key in jobMap) {
        if (jobType === jobMap[key]) {
          data[key] = data.editIdOrCutId
        } else {
          delete data[key]
        }
        delete data.jobType
      }
    }

    const getProprietaryList = function() {
      states.loading = true
      const params = formatAccount(searchData.value)
      if (params.videodaterange) {
        delete params.videodaterange
      }
      return $getDropVideoLibrarySelfList({
        ...params,
        platOwner: '自营'
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.dataStatics = res.data.dataStatics || {}
            states.summaryData = states.summaryData.map((item) => {
              item.val = (res.data.dataStatics || {})[item.key]
              return item
            })

            if (res.data.list) {
              res.data.list.forEach((item) => {
                item.showC2bData = false
                item.showAccountInfo = false
                const list = item.componentClickConversionRelationVideoVOList
                if (Array.isArray(list) && list.length >= 1) {
                  item.videoList = list.reverse().slice(0, list.length - 1).reverse()
                  item.videoInfo = list.reverse()[0]
                } else {
                  item.videoList = []
                  item.videoInfo = {}
                }
              })

              states.tableData = res.data.list
              states.total = res.data.total
            } else {
              states.tableData = []
              states.total = 0
            }
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const handleGoDetail = (row) => {
      let query = {}

      const {
        platId,
        platOrderId,
        platOrderName,
        platCreatetime,
        qsjOrderNumber
      } = row
      query = {
        type: 'self',
        thirdId: platOrderId,
        platId
      }
      const storage = {
        ...(JSON.parse(localStorage.getItem('detail')) || {}),
        [`self_${platOrderId}`]: {
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
    const formatAccount = (data) => {
      const params = copy(data)
      if (!params.platId) {
        const list = normalFormItemMap.accountId.data || []
        const item =
          list.find((item) => item.accountId === params.accountId) || {}

        params.accountName = item.accountName || data.accountName
        delete params.accountId
      } else {
        delete params.accountName
      }
      console.log(params)
      return params
    }
    const onSubmit = (data) => {
      const params = formatData(data)
      params.orgId = params.fId || params.dId || ''
      delete params.dId
      delete params.fId

      // if ($refs.search.$refs.cascader) {
      //   params.b2cPhoneModelIdStrs = $refs.search.$refs.cascader
      //     .getCheckedNodes()
      //     .filter((item) => {
      //       return !item.hasChildren
      //     })
      //     .map((item) => {
      //       return item.data.modelId
      //     })
      //     .join(',')
      // }
      params.b2cPhoneModelIds = states.virtualData
      Object.assign(searchData.value, params)
      editAndCut(searchData.value)
      getProprietaryList()
    }
    const onExport = (data) => {
      states.showExportFieldConfig = true
      states.exportData = data
      // const propertyNameList = []
      // for (const key in states.extFields) {
      //   if (!states.extFields[key].status) {
      //     propertyNameList.push(key)
      //   }
      // }
      // const params = formatData(Object.assign({}, searchData.value, data))
      // editAndCut(params)
      // window.open(
      //   `/api/delivery/app/self/export?${qs.stringify({
      //     ...formatAccount(params),
      //     propertyNameList: [...new Set(propertyNameList)]
      //   })}`
      // )
    }

    const handleConfirmChooseTableField = (data) => {
      states.showTableFieldConfig = false
      states.tableSortConfigData = JSON.parse(JSON.stringify(data.sort))
      states.tableConfigData = JSON.parse(JSON.stringify(data.config))
    }

    const handleConfirmChooseSummaryField = (data) => {
      states.showSummaryFieldConfig = false
      states.summaryConfigData = JSON.parse(JSON.stringify(data.config))
      states.summaryData = JSON.parse(JSON.stringify(data.config))
        .filter((item) => +item.defaultShow)
        .map((item) => {
          return {
            key: item.field,
            val: states.dataStatics[item.field],
            text: item.name,
            tip: item.tip
          }
        })
    }

    const loadHiddenColumns = (data, arr) => {
      (data.children || []).forEach((item) => {
        // 聚合字段 有下一级
        if (item.aggregation) {
          arr.push(loadHiddenColumns(item, arr))
        } else {
          if (!item.exportDefaultShow) {
            arr.push(item.field)
          }
        }
      })
    }

    const handleConfirmChooseExportField = async(data) => {
      states.showExportFieldConfig = false
      states.exportConfigData = JSON.parse(JSON.stringify(data.config))

      const hiddenColumns = []

      data.config.forEach((item) => {
        loadHiddenColumns(item, hiddenColumns)
      })

      const params = formatData(states.exportData)
      params.orgId = params.fId || params.dId || ''
      delete params.dId
      delete params.fId

      // if ($refs.search.$refs.cascader) {
      //   params.b2cPhoneModelIdStrs = $refs.search.$refs.cascader
      //     .getCheckedNodes()
      //     .filter((item) => {
      //       return !item.hasChildren
      //     })
      //     .map((item) => {
      //       return item.data.modelId
      //     })
      //     .join(',')
      // }
       params.b2cPhoneModelIds = states.virtualData
      Object.assign(searchData.value, params)
      editAndCut(searchData.value)

      $nextTick(() => {
        const params = formatAccount(searchData.value)
        if (params.videodaterange) {
          delete params.videodaterange
        }

        downloadFile('/api/app/qsj/order/conversion/new/h/self/export', {
          ...params,
          platOwner: '自营',
          hiddenColumns: [...new Set(hiddenColumns.filter((item) => item))]
        })
      })
    }

    const getTableF = (row, item) => {
      if (item.name.indexOf('是否') > -1) {
        return row[item.field] ? '是' : '否'
      }

      const numberArr = ['投放金额', 'CPM']

      if (numberArr.includes(item.name)) {
        return item.aggregation
        ? (item.children || [])
            .map((it) => row[it.field])
            .filter((item) => item)
            .join(item.format || '') || 0
        : row[item.field] || 0
      }

      const result = item.aggregation
        ? (item.children || [])
            .map((it) => row[it.field])
            .filter((item) => item)
            .join(item.format || '') || '--'
        : row[item.field] || '--'
      return result
    }

    const getB2CPhoneModel = async() => {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        normalFormItemMap.b2cPhoneModelIdStrs.data = data || []
        // 取消el-cascader首次高亮
        // this.$nextTick(() => {
        //   this.$refs.cascader.$refs.panel.clearCheckedNodes() // 清空选中的节点
        //   this.$refs.cascader.$refs.panel.activePath = []
        // })
      }
    }

    const computedTotal = (row) => {
      const {
        recAllFinish0100OrderQty,
        recAllFinish100400OrderQty,
        recAllFinish400900OrderQty,
        recAllFinish9001800OrderQty,
        recAllFinish18003000OrderQty,
        recAllFinish3000InfOrderQty
      } = row || {}
      return (
        +recAllFinish0100OrderQty +
        +recAllFinish100400OrderQty +
        +recAllFinish400900OrderQty +
        +recAllFinish9001800OrderQty +
        +recAllFinish18003000OrderQty +
        +recAllFinish3000InfOrderQty
      )
    }

    getAccontByOrgIdOrPlatId()
    getProprietaryFundOrgId()
    getBasePlatInfo()
    buildFormConf()
    getSelfAccount()
    getB2CPhoneModel()
    // 排序
    const { doSort } = useTableSort(searchData.value, getProprietaryList)
    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      onChange,
      handlePlatId,
      ...toRefs(states),
      doSort,
      getTableF,
      getProprietaryList,
      handleGoDetail,
      computedTotal,
      normalFormItemMap,
      handleConfirmChooseTableField,
      handleConfirmChooseSummaryField,
      handleConfirmChooseExportField,
      showDetailColumn,
      handleRadioType
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
    margin-right: 12px;
  }
}
.slot-search-view {
  transform: translateX(-70px);
}
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
    .video-info {
      display: flex;
      flex-direction: row-reverse;
      background: #d6e9ff63;
      border-radius: 4px;
      padding: 4px 8px;
      margin-bottom: 4px;
      &-right {
        width: 230px;
      }
      &-coverImg {
        width: 50px;
        height: 70px;
        border-radius: 4px;
        margin-right: 0px;
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
      margin-bottom: 0px;
    }
    &__gray{
      background: #d5d5d5;
      border-radius: 16px;
      padding: 0 8px;
      margin: 4px 0;
      font-size: 12px;
      color: #fff;
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

.flex span {
  display: flex;
  flex: 1;
}

::v-deep {
  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 180px;
  }

  // .el-cascader__search-input {
  //   display: none;
  // }
}

.setting {
  button {
    cursor: pointer;
  }

  i {
    cursor: pointer;
    vertical-align: -2px;
  }
}

.c2bPriceSection {
  & > div {
    flex: 1;
  }
}
.detail-column {
  font-size: 14px;
  display: flex;
  align-items: center;
  .el-radio {
    margin-right: 16px !important;
  }
}
.show-total-wrap {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    height: 100% !important;
    ::v-deep{
      .total-list{
        margin-bottom: 24px !important;
      }
      .total-list::after{
        background: none !important;
      }
    }
}

.updateTime {
  margin-top: 16px;

  .el-tag {
    border-radius: 10px;
  }
}
</style>
