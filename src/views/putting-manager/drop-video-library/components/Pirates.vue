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
        <template v-slot:cascader>
          <VirtualCascader
            v-model="virtualData"
            :options="normalFormItemMap.b2cPhoneModelIdStrs.data"
            placeholder="请选择产品型号"
          />
        </template>
        <template v-slot:normal="target">
          <div class="search-view slot-search-view">
            <span>订单筛选</span>
            <div>
              <el-form-item>
                <el-select
                  v-model="target.model.platId"
                  placeholder="全部平台"
                  clearable
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
                      defaultFirst: true,
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
                  clearable
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

          <el-checkbox
            v-model="target.model.onlyMyCollection"
            class="m-l-20"
            :true-label="1"
            :false-label="0"
            @change="onSubmit(target.model)"
          >
            仅看我的收藏
          </el-checkbox>
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
      <Statistics
        v-loading="loading"
        :class="`${
          targetType === '0' ? 'statistics data-wrap' : 'show-total-wrap'
        }`"
        :data="summaryData"
      />
    </wrap>
    <wrap class="m-t-24">
      <div class="table-view">
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
        <div v-if="total" class="pagenation-view m-b-8">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getPriateList"
          />
        </div>
        <el-table
          ref="table"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          @sort-change="doSort"
        >
          <el-table-column
            v-for="(item, index) in tableSortConfigData"
            :key="index"
            :prop="item.field"
            :fixed="['accountInfo'].includes(item.type) ? 'left' : null"
            :label="item.name"
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
                              发布时间：{{ node.videoCreateTime || "--" }}
                            </p>
                            <p class="info-text">
                              组件类型：{{
                                row.linkUseType ? row.linkUseType : "--"
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
                          发布时间：{{ row.videoInfo.videoCreateTime || "--" }}
                        </p>
                        <p>
                          组件类型：{{
                            row.linkUseType ? row.linkUseType : "--"
                          }}
                        </p>
                      </VideoInfo>
                      <div v-else class="account-card__gray">暂无视频</div>
                    </div>
                    <el-popover
                      v-if="
                        row.videoList &&
                          row.videoList.length &&
                          !showDetailColumn
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
                            发布时间：{{ innerItem.videoCreateTime || "--" }}
                          </p>
                          <p>
                            组件类型：{{
                              row.linkUseType ? row.linkUseType : "--"
                            }}
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
                      乾数据订单号：{{
                        row.qsjOrderNumber ? row.qsjOrderNumber : "--"
                      }}
                    </p>
                    <p class="info-text">
                      平台订单ID：{{ row.platOrderId ? row.platOrderId : "--" }}
                    </p>
                    <el-tooltip
                      :disabled="!row.platOrderName"
                      type="el-popover"
                      :content="row.platOrderName"
                      placement="top"
                    >
                      <p class="info-text text-over-hidden-1">
                        平台任务名称：{{
                          row.platOrderName ? row.platOrderName : "--"
                        }}
                      </p>
                    </el-tooltip>
                    <p class="info-text">
                      平台任务创建时间：{{
                        row.platCreatetime ? row.platCreatetime : "--"
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
              <template v-else-if="item.type === 'speechcraft'">
                <div class="flex flex-justify-between">
                  <div v-if="row.editSpeechcraft">
                    <el-select
                      v-model="row.speechcraft"
                      class="m-b-4"
                      placeholder="广告话术"
                      size="small"
                      clearable
                      filterable
                      @change="(val) => handleSpeechcraft(val, 'speechcraft')"
                    >
                      <el-option
                        v-for="opt in speechcraftList"
                        :key="opt.dictValue"
                        :label="opt.dictValue"
                        :value="opt.dictValue"
                      />
                    </el-select>
                    <el-select
                      v-model="row.secondSpeechcraft"
                      class="m-b-4"
                      placeholder="植入场景"
                      filterable
                      size="small"
                      clearable
                      @change="
                        (val) => handleSpeechcraft(val, 'secondSpeechcraft')
                      "
                    >
                      <el-option
                        v-for="opt in secondSpeechcraftList"
                        :key="opt.dictValue"
                        :label="opt.dictValue"
                        :value="opt.dictValue"
                      />
                    </el-select>
                    <el-select
                      v-model="row.thirdSpeechcraft"
                      placeholder="投放品类"
                      size="small"
                      clearable
                      filterable
                      @change="
                        (val) => handleSpeechcraft(val, 'thirdSpeechcraft')
                      "
                    >
                      <el-option
                        v-for="opt in thirdSpeechcraftList"
                        :key="opt.dictValue"
                        :label="opt.dictValue"
                        :value="opt.dictValue"
                      />
                    </el-select>
                  </div>
                  <div v-else class="text-left">
                    <p>{{ row.speechcraft || "--" }}</p>
                    <p>{{ row.secondSpeechcraft || "--" }}</p>
                    <p>{{ row.thirdSpeechcraft || "--" }}</p>
                  </div>
                  <div v-if="row.speechcraftEditFlag" class="edit-center">
                    <i v-if="!row.editSpeechcraft" class="speechcraft-edit el-icon-edit-outline" @click="handleUpdateSpeechcraft(row)" />
                    <el-button
                      v-else
                      size="small"
                      type="primary"
                      plain
                      @click="saveSpeechcraft(row)"
                    >保存</el-button>
                  </div>
                </div>
              </template>
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
                          : "0%"
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
                          : "0%"
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
                          : "0%"
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
                          : "0%"
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
                          : "0%"
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
                          : "0%"
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
                  <span>军：{{ row.dname || "--" }}</span>
                  <span>团：{{ row.fname || "--" }}</span>
                </p>
                <p class="flex">
                  <span>投放专员：{{ row.cutUserName || "未选择" }}</span>
                  <span>编导人员：{{ row.choreographerName || "--" }}</span>
                </p>
                <p>
                  <span>广告师：{{ row.editUserName || "未选择" }}</span>
                </p>
              </template>
              <template v-else-if="item.type === 'flowCount'">
                <div>{{ row.flowCount || "--" }}</div>
                <div v-if="row.flowCountUpdateTime" class="updateTime">
                  <el-tag
                    size="small"
                    type="info"
                  >更新时间：{{
                    row.flowCountUpdateTime.slice(0, -3) || "--"
                  }}</el-tag>
                </div>
              </template>
              <template v-else>
                {{ getTableF(row, item) }}
              </template>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right">
            <template slot-scope="{ row }">
              <el-link
                type="primary"
                @click="handleDetail(row)"
              >查看数据</el-link>
              <br>
              <el-link type="primary" @click="handleGoOrderDetail(row)">
                查看订单详情
              </el-link>
              <br>
              <el-link
                v-if="$permission('put_count_edit')"
                type="primary"
                @click="handlePutCountShow(row)"
              >
                限制投放
              </el-link>
              <!-- <IconTip
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
              /> -->
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total">
          <el-pagination
            background
            layout="total, prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getPriateList"
          />
        </div>
      </div>
    </wrap>

    <PutCount
      v-if="putCountShow"
      v-model="putCountShow"
      :is-batch="isBatch"
      :accout-info="accoutInfo"
      @update="getPriateList"
    />

    <SummaryFieldConfig
      v-if="showSummaryFieldConfig"
      :show="showSummaryFieldConfig"
      :config-data="summaryConfigData"
      code="config_pirates_summary_button"
      @close="showSummaryFieldConfig = false"
      @confirm="handleConfirmChooseSummaryField"
    />

    <TableFieldConfig
      v-if="showTableFieldConfig"
      :show="showTableFieldConfig"
      :config-data="tableConfigData"
      code="config_pirates_select_button"
      :sort-data="tableSortConfigData"
      @close="showTableFieldConfig = false"
      @confirm="handleConfirmChooseTableField"
    />

    <ExportFieldConfig
      v-if="showExportFieldConfig"
      :show="showExportFieldConfig"
      :config-data="exportConfigData"
      code="export_code_pirate"
      @close="showExportFieldConfig = false"
      @confirm="handleConfirmChooseExportField"
    />

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
          (detailVideo.componentClickConversionRelationVideoVOList || [])
            .length > 1
        "
      >
        <el-tabs v-model="activeTabs">
          <el-tab-pane
            v-for="(
              item, index
            ) in detailVideo.componentClickConversionRelationVideoVOList || []"
            :key="item.flowId || index"
            :label="`视频${videoIndex[index]}`"
            :name="`视频${videoIndex[index]}`"
          >
            <PiratesDetailDialog
              v-if="activeTabs === `视频${videoIndex[index]}`"
              :row-info="
                (detailVideo.componentClickConversionRelationVideoVOList || [])[
                  index
                ]
              "
            />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-else>
        <PiratesDetailDialog
          :row-info="
            (detailVideo.componentClickConversionRelationVideoVOList || [])[0]
          "
        />
      </template>
    </el-dialog>
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
// import accountSelect from '@/components/AccountSelect/index.vue'
import SelectLazy from '@/components/SelectLazy/index.vue'
import PutCount from '@/views/putting-manager/putting-account/_component/PutCount.vue'
import TableFieldConfig from '@/components/TableFieldConfig'
import ExportFieldConfig from '@/components/ExportFieldConfig'
import SummaryFieldConfig from '@/components/SummaryFieldConfig'
import PiratesDetailDialog from './PiratesDetailDialog'
import VirtualCascader from '@/components/VirtualCascader'

import { useTableSort } from '@/hook'
import {
  $getTransferCondition,
  // $getAccountPuttingByPlatId,
  $getFundOrgId,
  $getBasePlatInfo,
  $getVideoType,
  $getContentTypeList
} from '@/api/bussiness-manage'
import { $getFundUser } from '@/api/putting-manager'
import { $getDropVideoLibraryPirateList } from '@/api/proprietary-orders'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'
import { $getDataByDictType } from '@/api'
import { copy, unique } from '@/utils'
import { downloadFile } from '@/utils/download'
import dayjs from 'dayjs'
import { fieldConfigData, fieldSortConfigData } from '../tableConfig'
import {
  $getPlusAccountInfo,
  $editSpeechcraftInfo
} from '@/api/putting-manager'
export default {
  components: {
    Statistics,
    Search,
    IconTip,
    AccountCard,
    VideoInfo,
    VideoList,
    PutCount,
    TableFieldConfig,
    ExportFieldConfig,
    SummaryFieldConfig,
    PiratesDetailDialog,
    VirtualCascader,
    SelectLazy
  },
  setup() {
    const {
      $permission,
      $refs,
      $nextTick,
      $set,
      $router,
      $route,
      $message,
      $store
    } = getCurrentInstance().proxy

    const state = reactive({
      summaryData: [],
      loading: false,
      tableData: [],
      total: 0,
      platId: '',
      putCountShow: false,
      isBatch: false,
      accoutInfo: {},
      showTableFieldConfig: false,
      showExportFieldConfig: false,
      tableConfigData: [],
      exportConfigData: [],
      tableSortConfigData: [],
      showSummaryFieldConfig: false,
      summaryConfigData: [],
      dataStatics: {},
      showDetail: false,
      detailVideo: {},
      videoIndex: ['一', '二', '三', '四', '五'],
      activeTabs: '视频一',
      exportData: {},
      radioType: '0',
      videoWidth: 250,
      targetType: '0',
      cascaderProps: {
        checkStrictly: false,
        children: 'phoneModelVOList',
        emitPath: false,
        multiple: true,
        label: 'modelName',
        value: 'modelId'
      },
      virtualData: [],
      getPlusAccountInfo: $getPlusAccountInfo,
      value: '',
      secondSpeechcraftList: [],
      thirdSpeechcraftList: [],
      speechcraftList: []
    })
    const showDetailColumn = computed(() => {
      return !!+state.radioType
    })
    const handleRadioType = (val) => {
      state.tableData.forEach((item) => {
        item.showC2bData = !!+val
        item.showAccountInfo = !!+val
      })
    }
    const loadConfigData = (fieldConfigData, saveConfig = [], type) => {
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
      (item) => item.menuCode === 'config_pirates_select_button'
    )

    const exportMenuIndex = menuConfig.findIndex(
      (item) => item.menuCode === 'export_code_pirate'
    )

    const summaryMenuIndex = menuConfig.findIndex(
      (item) => item.menuCode === 'config_pirates_summary_button'
    )

    // 所有
    const allSortData = fieldConfigData
      .map((item) => item.children)
      .flat(Infinity)

    // 根据自定义数据进行菜单加载
    if (tableMenuIndex > -1) {
      // 保存的排序数据
      const saveSort = JSON.parse(
        menuConfig[tableMenuIndex].customColumns
      ).sort

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
            newItem = saveConfig.map((item) => item.children).flat(Infinity)[
              sortIndexInConfig
            ]
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
        const index = tableSortConfigData.findIndex(
          (it) => it.field === item.field
        )
        if (index > -1) {
          finalSortData.push(item)
          tableSortConfigData.splice(index, 1)
        }
      })
      const tableSortConfigData1 = [...finalSortData, ...tableSortConfigData]
      tableSortConfigData1.forEach((item) => {
        if (item.field === 'platOrderInfo') {
          item.width = '350px'
        }
        if (item.field !== 'videoInfo') {
          state.tableSortConfigData.push(item)
        }
        if (item.field === 'flowCount') {
          item.type = 'flowCount'
          item.width = '200px'
        }
        if (item.field === 'speechcraft') {
          item.type = 'speechcraft'
          item.width = '200px'
          item.align = 'left'
        }
      })
      const tableConfigData = loadConfigData(fieldConfigData, saveConfig)
      state.tableConfigData = tableConfigData
    } else {
      const tableSortConfigData1 = [...fieldSortConfigData]
      tableSortConfigData1.forEach((item) => {
        if (item.field === 'platOrderInfo') {
          item.width = '350px'
        }
        if (item.field !== 'videoInfo') {
          state.tableSortConfigData.push(item)
        }
        if (item.field === 'flowCount') {
          item.type = 'flowCount'
          item.width = '200px'
        }
      })
      state.tableConfigData = [...fieldConfigData]
    }

    if (exportMenuIndex > -1) {
      // 保存的配置数据
      const saveExportConfig = JSON.parse(
        menuConfig[exportMenuIndex].customColumns
      ).config

      const exportConfigData = loadConfigData(
        fieldConfigData,
        saveExportConfig,
        'export'
      )

      state.exportConfigData = exportConfigData
    } else {
      state.exportConfigData = [...fieldConfigData]
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

      state.summaryConfigData = summaryConfigData
      state.summaryData = summaryConfigData
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
      state.summaryConfigData = summary
      state.summaryData = summary
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

    // source: 0-快手以外的平台 1快手转化来源（全部流量） 2快手转化来源（自然流量） 1快手转化来源（助推流量）

    const formConf = reactive({
      normal: [],
      hasExport: $permission('export_code_pirate')
    })
    let _businessTags = reactive({})
    const searchData = ref({
      pageNum: 1,
      platId: ''
    })

    $nextTick(() => {
      if ($route.query.platId && $route.query.accountId) {
        $set($refs.search.form, 'platId', +$route.query.platId)
        $set($refs.search.form, 'accountId', +$route.query.accountId)
        searchData.value.platId = $route.query.platId
        searchData.value.accountId = $route.query.accountId
      } else {
        const timeEnd = dayjs().format('YYYY-MM-DD')
        const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
        $set($refs.search.form, 'videodaterange', [
          `${timeStart}`,
          `${timeEnd}`
        ])
        searchData.value.videoCreateStartTime = timeStart + ' 00:00:00'
        searchData.value.videoCreateEndTime = timeEnd + ' 23:59:59'
      }
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
        {
          type: 'select',
          key: 'speechcraft',
          data: [],
          conf: {
            placeholder: '广告话术'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'secondSpeechcraft',
          data: [],
          conf: {
            placeholder: '植入场景'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'thirdSpeechcraft',
          data: [],
          conf: {
            placeholder: '投放品类'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
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
        },
        {
          type: 'select',
          key: 'choreographerId',
          data: [],
          conf: {
            placeholder: '请选择编导人员'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
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

    const getVideoType = async(val) => {
      const res = await $getVideoType({ brand: val })
      const { code, data = [] } = res || {}
      if (+code === 1) {
        normalFormItemMap.junType.data = data
      }
    }
    const getFundUser = () => {
      $getFundUser().then((res) => {
        if (res.code === 1) {
          normalFormItemMap.choreographerId.data = res.data
        }
      })
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
    const formatSpeechcraftParams = (val) => {
      let dictTypes = [
        'b2c_putting_speechcraft',
        'second_b2c_putting_speechcraft',
        'third_b2c_putting_speechcraft'
      ]
      if (val === 'B2C') {
        dictTypes = [
          'b2c_putting_speechcraft',
          'second_b2c_putting_speechcraft',
          'third_b2c_putting_speechcraft'
        ]
      } else if (val === 'C2B') {
        dictTypes = [
          'c2b_putting_speechcraft',
          'second_c2b_putting_speechcraft',
          'third_c2b_putting_speechcraft'
        ]
      } else if (val === 'C2C') {
        dictTypes = [
          'c2b_putting_speechcraft',
          'second_c2c_putting_speechcraft',
          'third_c2c_putting_speechcraft'
        ]
      }
      return dictTypes
    }
    const getTableSpeechcraftList = (val) => {
      const dictTypes = formatSpeechcraftParams(val)
      $getDataByDictType({
        dictTypes
      }).then((res) => {
        if (res.code === 1 && res.data) {
          state.speechcraftList = res.data[dictTypes[0]] || []
          state.secondSpeechcraftList = res.data[dictTypes[1]] || []
          state.thirdSpeechcraftList = res.data[dictTypes[2]] || []
        }
      })
    }
    const getSpeechcraftList = (val) => {
      const dictTypes = formatSpeechcraftParams(val)
      $getDataByDictType({
        dictTypes: formatSpeechcraftParams(val)
      }).then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.speechcraft.data = res.data[dictTypes[0]] || []
          normalFormItemMap.secondSpeechcraft.data =
            res.data[dictTypes[1]] || []
          normalFormItemMap.thirdSpeechcraft.data =
            res.data[dictTypes[2]] || []
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
        case 'businessTag':
          model.speechcraft = ''
          // model.cutUserId = ''
          normalFormItemMap.speechcraft.data = []
          // normalFormItemMap.cutUserId.data = []
          getSpeechcraftList(val)
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
      params.size = state.pageSize
      // const flag = params.platId !== 26 ? 0 : searchData.value.conversionSource
      return $getDropVideoLibraryPirateList({
        ...params,
        platOwner: '投放'
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1 && res.data) {
            state.dataStatics = res.data.dataStatics || {}
            state.summaryData = state.summaryData.map((item) => {
              item.val = (res.data.dataStatics || {})[item.key]
              return item
            })

            if (res.data.list) {
              res.data.list.forEach((item) => {
                item.editSpeechcraft = false
                item.showC2bData = false
                item.showAccountInfo = false
                const list = item.componentClickConversionRelationVideoVOList
                if (Array.isArray(list) && list.length >= 1) {
                  item.videoList = list
                    .reverse()
                    .slice(0, list.length - 1)
                    .reverse()
                  item.videoInfo = list.reverse()[0]
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

    const handleGoOrderDetail = (row) => {
      const { href } = $router.resolve({
        path: '/putting-manager/order-detail',
        query: { orderId: row.orderId, platId: row.platId }
      })
      window.open(href, '_blank')
    }

    const handleDetail = (row) => {
      state.showDetail = true
      state.detailVideo = row
    }

    // const handleChangePlat = (val) => {
    //   $refs.search.form.accountId = ''
    //   // normalFormItemMap.accountId.data = []
    //   // getAccountPuttingByPlatId(val)
    // }

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
    // const formatAccount = (data) => {
    //   const params = copy(data)
    //   if (!params.platId) {
    //     const list = normalFormItemMap.accountId.data || []
    //     const item =
    //       list.find((item) => item.accountId === params.accountId) || {}

    //     params.accountName = item.accountName || data.accountName
    //     delete params.accountId
    //   } else {
    //     delete params.accountName
    //   }
    //   return params
    // }

    const handlePutCountShow = (row) => {
      state.putCountShow = true
      state.accoutInfo = row
      state.isBatch = false
      state.accoutInfo.accountIds = [row.accountId]
    }

    const onSubmit = (data) => {
      const params = formatData(data)
      params.orgId = params.fId || params.dId || ''
      params.pageNum = 1
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
      params.b2cPhoneModelIds = state.virtualData
      Object.assign(searchData.value, params)
      getPriateList()
    }

    const onExport = (data) => {
      state.showExportFieldConfig = true
      state.exportData = data
    }

    const handleConfirmChooseTableField = (data) => {
      state.showTableFieldConfig = false
      state.tableSortConfigData = JSON.parse(JSON.stringify(data.sort))
      state.tableConfigData = JSON.parse(JSON.stringify(data.config))
    }

    const handleConfirmChooseSummaryField = (data) => {
      state.showSummaryFieldConfig = false
      state.summaryConfigData = JSON.parse(JSON.stringify(data.config))
      state.summaryData = JSON.parse(JSON.stringify(data.config))
        .filter((item) => +item.defaultShow)
        .map((item) => {
          return {
            key: item.field,
            val: state.dataStatics[item.field],
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
      state.showExportFieldConfig = false
      state.exportConfigData = JSON.parse(JSON.stringify(data.config))

      const hiddenColumns = []

      data.config.forEach((item) => {
        loadHiddenColumns(item, hiddenColumns)
      })

      const params = formatData(state.exportData)
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
      params.b2cPhoneModelIds = state.virtualData
      Object.assign(searchData.value, params)

      $nextTick(() => {
        const params = copy(searchData.value)

        // const flag =
        //   params.platId !== 26 ? 0 : searchData.value.conversionSource

        downloadFile('/api/app/qsj/order/conversion/new/h/fund/export', {
          ...params,
          platOwner: '投放',
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
    const handleUpdateSpeechcraft = (row) => {
      getTableSpeechcraftList(row.businessTag)
      state.tableData.forEach((item) => {
        if (item.id === row.id) {
          item.editSpeechcraft = true
        } else {
          item.editSpeechcraft = false
        }
      })
    }
    const speechcraftObj = reactive({
      speechcraft: '',
      secondSpeechcraft: '',
      thirdSpeechcraft: ''
    })
    const saveSpeechcraft = async(row) => {
      const params = {
        speechcraft: speechcraftObj.speechcraft || row.speechcraft,
        secondSpeechcraft: speechcraftObj.secondSpeechcraft || row.secondSpeechcraft,
        thirdSpeechcraft: speechcraftObj.thirdSpeechcraft || row.thirdSpeechcraft
      }
      const res = await $editSpeechcraftInfo({
        ...params,
        orderId: row.orderId
      })
      if (res.code === 1) {
        $message.success(res.message)
      } else {
        $message.error(res.message)
      }
      row.editSpeechcraft = false
    }
    const handleSpeechcraft = (val, type) => {
      speechcraftObj[type] = val
    }
    const { doSort } = useTableSort(searchData.value, getPriateList)
    getBusinessTags()
    getFundUser()
    getVideoType()
    getContentTypeList()
    getBasePlatInfo()
    buildFormConf()
    getB2CPhoneModel()
    getFundOrgId()
    getTransferCondition()
    // getAccountPuttingByPlatId()
    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      onChange,
      ...toRefs(state),
      getTableF,
      normalFormItemMap,
      // handleChangePlat,
      handlePutCountShow,
      getPriateList,
      doSort,
      platId,
      handleDetail,
      handleGoDetail,
      handleGoOrderDetail,
      fieldConfigData,
      fieldSortConfigData,
      computedTotal,
      handleConfirmChooseTableField,
      handleConfirmChooseSummaryField,
      handleConfirmChooseExportField,
      showDetailColumn,
      handleRadioType,
      handleUpdateSpeechcraft,
      saveSpeechcraft,
      handleSpeechcraft
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
    .video-info {
      display: flex;
      flex-direction: row-reverse;
      background: #d6e9ff63;
      border-radius: 4px;
      padding: 4px 8px;
      margin-bottom: 4px;
      &-right {
        width: 190px;
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
      display: flex;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 6px;
    }
    &__gray {
      background: #d5d5d5;
      border-radius: 16px;
      padding: 0 8px;
      font-size: 12px;
      margin-bottom: 4px;
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
    line-height: 12px;
    margin-bottom: 4px;
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

.dialogTitle {
  font-size: 16px;
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
    font-size: 13px;
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
  ::v-deep {
    .total-list {
      margin-bottom: 24px !important;
    }
    .total-list::after {
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
.edit-center {
  display: flex;
  align-items: center;
  margin-left: 4px;
  .speechcraft-edit{
    display: block;
    font-size: 20px;
    color: #2c64ff;
    cursor: pointer;
  }
}
.m-b-4 {
  margin-bottom: 4px;
}
</style>
