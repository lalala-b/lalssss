<!-- eslint-disable no-case-declarations -->
<template>
  <div
    v-infinite-scroll="getMoreList"
    infinite-scroll-distance="500"
    :infinite-scroll-disabled="loading"
  >
    <Wrap class="accounts m-b-24">
      <div v-loading="searchLoad" class="accounts-search">
        <div
          v-if="$permission('talent-bank-input')"
          class="accounts-search__title m-b-24"
        >
          <el-input
            v-model="searchData.wd"
            class="accounts-search__title-input"
            placeholder="请输入账号名称或者抖音ID进行检索"
            @input="handleInput"
            @keydown.enter.native="handleSearchBtnClick"
          >
            <el-button
              slot="append"
              type="primay"
              @click="handleSearchBtnClick"
            >搜索</el-button>
          </el-input>
        </div>
        <div class="accounts-search__item">
          <el-tooltip
            class="m-r-24"
            effect="dark"
            content="无已存在的筛选条件"
            :disabled="!hasSelectConfig"
            placement="top"
          >
            <span>
              <el-button
                type="primary"
                plain
                :disabled="hasSelectConfig"
                @click="() => getMenuConfigData()"
              >加载已存的筛选条件</el-button>
            </span>
          </el-tooltip>

          <el-tooltip
            class="item"
            effect="dark"
            content="当前无筛选条件，请进行筛选"
            :disabled="!hasSelectData"
            placement="top"
          >
            <span>
              <el-button
                type="primary"
                plain
                :disabled="hasSelectData"
                @click="updateSearchConfig"
              >保存筛选条件</el-button>
            </span>
          </el-tooltip>
        </div>
        <div class="flex flex-align-center m-t-20">
          <span class="accounts-search__label" data-bold>自定义CPM</span>
          <template v-if="isCustomedCpm">
            <SelectBase
              ref="selectBasecpm"
              :select-item-data="selectObjList.cpm"
              :default-value="
                searchFilterData && searchFilterData.cpm
                  ? searchFilterData.cpm
                  : {}
              "
              :is-cpm="true"
              class="m-r-24"
              :show-select="true"
              @updateSearch="(val) => handleUpdateSelect(val, 'cpm')"
            />
          </template>
          <el-popover
            ref="Popover"
            v-model="cpmVisable"
            trigger="click"
            placement="top-start"
            width="560"
          >
            <div class="m-b-24">
              <b>自定义CPM公式</b>
              <IconTip type="popper" width="300" icon-class="iconwenhao">
                <template>
                  <div>CPM = 投放价格 ÷ 播放量 * 1000</div>
                  <div>投放价格 = 【所选的报价类型】 * 【折扣系数】</div>
                  <div>
                    播放量 =
                    【最近X条】【所选的视频类型】【中位数/最高值/平均值】
                  </div>
                </template>
              </IconTip>
            </div>
            <div v-if="cpmVisable" class="flex flex-align-center m-b-16">
              <el-form
                ref="ruleForm"
                :model="customForm"
                :rules="rules"
                class="rule-form"
              >
                <div class="flex flex-align-center m-b-16">
                  <div class="popover-title m-r-16" data-bold>投放价格</div>

                  <el-form-item prop="customCpmPriceType">
                    <el-select
                      v-model="customForm.customCpmPriceType"
                      class="m-r-10"
                      clearable
                      placeholder="请选择报价类型"
                    >
                      <el-option
                        v-for="item in priceTypeList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="customCpmDiscountCoefficient">
                    <el-select
                      v-model="customForm.customCpmDiscountCoefficient"
                      class="m-r-10"
                      clearable
                      placeholder="请选择折扣系数"
                    >
                      <el-option
                        v-for="item in coefficientList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="flex flex-align-center">
                  <div class="popover-title m-r-16" data-bold>播放量</div>
                  <el-form-item prop="customCpmVideoCount">
                    <el-select
                      v-model="customForm.customCpmVideoCount"
                      class="m-r-10"
                      clearable
                      placeholder="请选择视频条数"
                    >
                      <el-option
                        v-for="item in videoCountList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="customCpmStatisticalType">
                    <el-select
                      v-model="customForm.customCpmStatisticalType"
                      class="m-r-10"
                      clearable
                      placeholder="请选择统计方式"
                    >
                      <el-option
                        v-for="item in statisticalTypeList"
                        :key="item.dictValue"
                        :disabled="
                          item.dictValue !== '中位数' && statisticalFlag
                        "
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div style="margin-left: 100px; margin-top: 4px">
              (只统计近30天发布的视频条数)
            </div>
            <div style="text-align: right; margin: 0">
              <el-button
                size="small"
                type="text"
                @click="cpmVisable = false"
              >取消</el-button>
              <el-button
                type="primary"
                size="small"
                @click="cpmConfirm"
              >确定</el-button>
            </div>
            <el-link
              slot="reference"
              :class="isCustomedCpm ? 'm-l-12' : ''"
              type="primary"
              :underline="false"
              plain
            >{{ isCustomedCpm ? "已" : "自" }}定义CPM公式</el-link>
          </el-popover>
        </div>
        <div class="flex flex-align-center m-t-20">
          <span class="accounts-search__label" data-bold>观众画像</span>
          <SelectBase
            ref="selectBasemenProportion"
            :select-item-data="selectObjList.menProportion"
            class="m-r-24"
            :default-value="
              searchFilterData && searchFilterData.menProportion
                ? searchFilterData.menProportion
                : {}
            "
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'menProportion')"
          />
          <SelectMultiple
            ref="selectMultipleage"
            :select-item-data="selectObjList.age"
            class="m-r-24"
            :default-value="
              searchFilterData && searchFilterData.age
                ? searchFilterData.age
                : {}
            "
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'age')"
          />
          <SelectMultiple
            ref="selectMultiplecityGrade"
            :select-item-data="selectObjList.cityGrade"
            :default-value="
              searchFilterData && searchFilterData.cityGrade
                ? searchFilterData.cityGrade
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'cityGrade')"
          />
          <SelectMultiple
            ref="selectMultiplecrowd"
            :select-item-data="selectObjList.crowd"
            class="m-r-24"
            :default-value="
              searchFilterData && searchFilterData.crowd
                ? searchFilterData.crowd
                : {}
            "
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'crowd')"
          />
          <SelectMultiple
            ref="selectMultipledevice"
            :select-item-data="selectObjList.device"
            class="m-r-24"
            :default-value="
              searchFilterData && searchFilterData.device
                ? searchFilterData.device
                : {}
            "
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'device')"
          />
          <!-- <SelectCustom
            ref="selectBaserecyclableCityProportion"
            :select-item-data="selectObjList.recyclableCityProportion"
            :default-value="
              searchFilterData && searchFilterData.recyclableCityProportion
                ? searchFilterData.recyclableCityProportion
                : {}
            "
            class="m-r-24"
            :show-input="false"
            @updateSearch="
              (val) => handleUpdateSelect(val, 'recyclableCityProportion')
            "
          /> -->
        </div>
        <div class="flex flex-align-center m-t-20">
          <span class="accounts-search__label" data-bold>达人画像</span>
          <!-- <SelectCustom
            ref="selectBasedarenPrice"
            :select-item-data="selectObjList.darenPrice"
            :default-value="
              searchFilterData && searchFilterData.darenPrice
                ? searchFilterData.darenPrice
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'darenPrice')"
          /> -->
          <SelectBase
            ref="selectBasedarenPrice"
            :select-item-data="selectObjList.darenPrice"
            :default-value="
              searchFilterData && searchFilterData.darenPrice
                ? searchFilterData.darenPrice
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'darenPrice')"
          />
          <SelectCheck
            ref="selectChecktagsIds"
            :select-item-data="selectObjList.tagsIds"
            class="m-r-24"
            :tag-info="tagInfo"
            :default-value="
              searchFilterData && searchFilterData.tagsIds
                ? searchFilterData.tagsIds
                : {}
            "
            :tag-value-list="tagValueList"
            @updateSearch="(val) => handleUpdateSelect(val, 'tagsIds')"
          />
          <SelectBase
            ref="selectBaserecommendIndexNumber"
            :select-item-data="selectObjList.recommendIndexNumber"
            :default-value="
              searchFilterData && searchFilterData.recommendIndexNumber
                ? searchFilterData.recommendIndexNumber
                : {}
            "
            class="m-r-24"
            @updateSearch="
              (val) => handleUpdateSelect(val, 'recommendIndexNumber')
            "
          />
          <SelectBase
            ref="selectBasechangeIndexNumber"
            :select-item-data="selectObjList.changeIndexNumber"
            class="m-r-24"
            :default-value="
              searchFilterData && searchFilterData.changeIndexNumber
                ? searchFilterData.changeIndexNumber
                : {}
            "
            @updateSearch="
              (val) => handleUpdateSelect(val, 'changeIndexNumber')
            "
          />
          <selectComponent
            ref="selectComponentswellingPowder"
            :select-item-data="selectObjList.swellingPowder"
            :default-value="
              searchFilterData && searchFilterData.swellingPowder
                ? searchFilterData.swellingPowder
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'swellingPowder')"
          />
          <SelectBase
            ref="selectBasefansNum"
            :select-item-data="selectObjList.fansNum"
            :default-value="
              searchFilterData && searchFilterData.fansNum
                ? searchFilterData.fansNum
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'fansNum')"
          />
          <SelectBase
            ref="selectBasegender"
            :select-item-data="selectObjList.gender"
            :default-value="
              searchFilterData && searchFilterData.gender
                ? searchFilterData.gender
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'gender')"
          />
          <selectCascader
            ref="cascaderComponentdarenOrigin"
            :select-item-data="selectObjList.darenOrigin"
            :default-value="
              searchFilterData && searchFilterData.darenOrigin
                ? searchFilterData.darenOrigin
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'darenOrigin')"
          />
        </div>
        <div class="flex flex-align-center m-t-20">
          <span class="accounts-search__label" data-bold>视频特征</span>
          <selectComponent
            ref="selectComponentreleaseSituation"
            :select-item-data="selectObjList.releaseSituation"
            :default-value="
              searchFilterData && searchFilterData.releaseSituation
                ? searchFilterData.releaseSituation
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'releaseSituation')"
          />
          <selectComponent
            ref="selectComponentplaySituation"
            :select-item-data="selectObjList.playSituation"
            :default-value="
              searchFilterData && searchFilterData.playSituation
                ? searchFilterData.playSituation
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'playSituation')"
          />
          <selectComponent
            ref="selectComponentnealy10PerDeleteCount"
            :select-item-data="selectObjList.nealy10PerDeleteCount"
            :default-value="
              searchFilterData && searchFilterData.nealy10PerDeleteCount
                ? searchFilterData.nealy10PerDeleteCount
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="
              (val) => handleUpdateSelect(val, 'nealy10PerDeleteCount')
            "
          />
          <selectComponent
            ref="selectComponentplaySituationXingTu"
            :select-item-data="selectObjList.playSituationXingTu"
            :default-value="
              searchFilterData && searchFilterData.playSituationXingTu
                ? searchFilterData.playSituationXingTu
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="
              (val) => handleUpdateSelect(val, 'playSituationXingTu')
            "
          />
          <el-checkbox
            v-model="searchData.nealyHotMoneyVideoFlag"
            class="m-l-16"
            :true-label="1"
            :false-label="0"
            @change="handleCheckbox"
          >近期有爆款视频</el-checkbox>
        </div>
        <div class="flex flex-align-center m-t-20">
          <span class="accounts-search__label" data-bold>乾数据标签</span>
          <SelectMultiple
            ref="selectMultipleoppositeUserIds"
            :select-item-data="selectObjList.oppositeUserIds"
            :default-value="
              searchFilterData && searchFilterData.oppositeUserIds
                ? searchFilterData.oppositeUserIds
                : {}
            "
            class="m-r-24"
            @updateSearch="(val) => handleUpdateSelect(val, 'oppositeUserIds')"
          />
          <selectComponent
            ref="selectComponentitemSpiderTime"
            :select-item-data="selectObjList.itemSpiderTime"
            :default-value="
              searchFilterData && searchFilterData.itemSpiderTime
                ? searchFilterData.itemSpiderTime
                : {}
            "
            class="m-r-24"
            :data-list="cpmList"
            @updateSearch="(val) => handleUpdateSelect(val, 'itemSpiderTime')"
          />
        </div>
        <div
          v-if="dynamicTags.length"
          class="tags-box flex flex-align-center m-t-20"
        >
          <div class="accounts-search__label tags-box-left m-b-8" data-bold>
            已选项
          </div>
          <div class="tags-box-right">
            <div
              v-for="item in dynamicTags"
              :key="item.key"
              :class="item.key === 'tagsIds' ? 'tag-content m-r-8 ' : 'm-r-8 '"
            >
              <el-tag
                :class="`${item.key === 'tagsIds' ? '' : 'm-b-8'} dynamic-tag`"
                :disable-transitions="false"
                size="mini"
              >
                {{ item.label
                }}{{
                  [
                    "age",
                    "cityGrade",
                    "crowd",
                    "device",
                    "oppositeUserIds",
                  ].includes(item.key)
                    ? "之和"
                    : ""
                }}：{{ item.value }}
                <i
                  class="el-icon-close"
                  @click="handleClose(item.key, item.selectType)"
                />
              </el-tag>
            </div>
          </div>
        </div>
      </div>
      <el-button
        class="m-t-20"
        type="primary"
        @click="handlerecommendationSearch(0)"
      >生成推荐达人</el-button>
      <el-button
        v-if="dynamicTags.length"
        class="m-t-20 m-l-24"
        type="primary"
        plain
        @click="handleCloseAllTags"
      >清空已选项</el-button>
    </Wrap>
    <TalentBankTable
      :search-data="searchData"
      :total="total"
      :table-data="tableData"
      :time-map="timeMap"
      :loading="loading"
      @search="handleTableSearch"
      @handleCreateSessionId="handleCreateSessionId"
      @cancelRecommend="handleCancelRecommend"
      @reSearchCurrent="handleReSearchCurrent"
    />
  </div>
</template>
<script>
import { copy } from '@/components/common'
import { $getDyList, $refuseRecommend } from '@/api/dy-manage'
import { lego } from '@zz-common/lego'
import {
  $updateMenuConfigData,
  $getMenuConfigData
} from '@/api/proprietary-orders'
import TalentBankTable from './table.vue'
import SelectBase from './_com/selectBase.vue'
import { $getDataByDictType } from '@/api/index'
import IconTip from '@/components/IconTip'
import SelectMultiple from './_com/selectMultiple.vue'
import { $getTiktokFilterRang } from '@/api/bill-adv-manage'
import SelectCheck from './_com/selectCheck.vue'
import selectComponent from './_com/selectComponent.vue'
import selectCascader from './_com/selectCascader.vue'
import { deepClone } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  components: {
    TalentBankTable,
    IconTip,
    SelectMultiple,
    SelectCheck,
    selectComponent,
    SelectBase,
    selectCascader
  },
  data() {
    return {
      searchData: {
        // 筛选条件
        pageNum: 1,
        size: 20,
        blacklistFlag: 1,
        determined: '', // 排序-nealy7dAddfans
        nealyHotMoneyVideoFlag: 0
      },
      customForm: {
        customCpmPriceType: '',
        customCpmDiscountCoefficient: '',
        customCpmVideoCount: '',
        customCpmStatisticalType: ''
      },
      total: 0,
      tableData: [],
      timeMap: {},
      loading: false,
      cpmVisable: false,
      cpmList: [],
      quotationList: [],
      Popover: null,
      tagInfo: {},
      tagValueList: [],
      searchFilterData: {}, // 已经存储的筛选项
      searchDataConfigObject: {},
      selectObjList: {
        cpm: {
          type: 1,
          label: 'CPM',
          value: '',
          key: 'cpm',
          showInput: true,
          dataList: [],
          showRange: true,
          selectType: 'selectBase'
        },
        menProportion: {
          label: '性别分布',
          value: '',
          text: '选择性别',
          type: 1,
          showInput: false,
          selectType: 'selectBase',
          dataList: [],
          dataListMsg: '性别占比',
          showTypeSlect: true,
          dataTypeList: [
            {
              dictValue: '2',
              dictLabel: '女'
            },
            {
              dictValue: '1',
              dictLabel: '男'
            }
          ],
          dataTypePlaceholder: '请选择性别'
        },
        age: {
          label: '年龄分布',
          value: '',
          showTag: true,
          placeholder: '请选择上述年龄段的合计占比',
          selectType: 'selectMultiple',
          selectKey: 'ageProportion',
          checkBoxList: [],
          dataList: []
        },
        cityGrade: {
          label: '城市等级分布',
          value: '',
          showTag: true,
          placeholder: '请选择上述城市等级的合计占比',
          selectType: 'selectMultiple',
          selectKey: 'cityGradeProportion',
          checkBoxList: [],
          dataList: []
        },
        crowd: {
          label: '八大人群分布',
          value: '',
          showTag: true,
          placeholder: '请选择上述八大人群的合计占比',
          selectType: 'selectMultiple',
          selectKey: 'deviceProportion',
          checkBoxList: [],
          dataList: []
        },
        device: {
          label: '设备分布',
          value: '',
          placeholder: '请选择上述设备的合计占比',
          selectType: 'selectMultiple',
          selectKey: 'deviceProportion',
          checkBoxList: [],
          dataList: []
        },
        // recyclableCityProportion: {
        //   label: '可上门回收城市占比',
        //   value: '',
        //   placeholder: '请选择占比',
        //   text: '支持转转上门回收的城市，在达人观众TOP10城市中的人数占比',
        //   selectType: 'selectBase',
        //   dataList: []
        // },
        darenPrice: {
          label: '达人报价',
          text: '达人报价类型',
          value: '',
          unit: '元',
          type: 2,
          showInput: true,
          selectType: 'selectBase',
          dataList: [],
          inputText: '报价'
        },
        tagsIds: {
          label: '内容标签',
          value: '',
          selectType: 'selectCheck'
        },
        recommendIndexNumber: {
          label: '种草指数',
          value: '',
          type: 1,
          showInput: false,
          selectType: 'selectBase',
          dataList: []
        },
        changeIndexNumber: {
          label: '转化指数',
          value: '',
          type: 1,
          showInput: false,
          selectType: 'selectBase',
          dataList: []
        },
        swellingPowder: {
          label: '涨粉量',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              dataList: [],
              placeholder: '请选择时间范围',
              type: 'select',
              // placeholderTxt:'时间范围',
              key: 'addFansTimeFrame'
            },
            {
              label: '涨粉量',
              dataList: [],
              placeholder: '请选择涨粉区间',
              type: 'select',
              customFlag: true,
              // placeholderTxt:'涨粉区间',
              key: 'nealyAddFans'
            }
          ]
        },
        fansNum: {
          label: '粉丝量',
          text: '达人粉丝量',
          value: '',
          unit: 'w',
          type: 2,
          precision: 2,
          showInput: true,
          selectType: 'selectBase',
          dataList: []
        },
        gender: {
          label: '达人性别',
          value: '',
          type: 1,
          showInput: false,
          selectType: 'selectBase',
          dataList: [
            {
              dictValue: '2',
              dictLabel: '女'
            },
            {
              dictValue: '1',
              dictLabel: '男'
            },
            {
              dictValue: '0',
              dictLabel: '未知'
            }
          ]
        },
        darenOrigin: {
          label: '所在地域',
          value: '',
          type: 1,
          showInput: false,
          selectType: 'cascaderComponent',
          dataList: []
        },
        releaseSituation: {
          label: '星图条数',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              dataList: [],
              placeholder: '请选择统计范围',
              type: 'select',
              key: 'xingtuVideoStatisticalScope'
            },
            {
              label: '已发布星图视频',
              dataList: [],
              type: 'select',
              placeholder: '请选择条数',
              key: 'xingtuVideoCount'
            }
          ]
        },
        playSituation: {
          label: '播放量',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              dataList: [],
              type: 'select',
              placeholder: '请选择时间范围',
              key: 'allVideoStatisticalScope'
            },
            {
              label: '已发布视频播放量',
              dataList: [],
              type: 'select',
              placeholder: '请选择统计方式',
              key: 'allVideoStatisticalType'
            },
            {
              dataList: [],
              type: 'inputRange',
              label: '介于',
              placeholder: '请选择播放区间',
              key: 'flowCount',
              precision: 2,
              unit: 'w'
            }
          ]
        },
        playSituationXingTu: {
          label: '个人视频播放量',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              dataList: [],
              type: 'inputRange',
              label: '近30天播放量中位数',
              placeholder: '请选择播放区间',
              key: 'playMid130',
              unit: 'w',
              precision: 2
            }
          ]
        },
        nealy10PerDeleteCount: {
          label: '删除视频条数',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              type: 'inputRange',
              label: '近10条删除视频条数',
              key: 'nealy10PerDeleteCount',
              unit: '条',
              precision: 0,
              placeholder: '请选择删除视频条数',
              max: 10
            }
          ]
        },
        itemSpiderTime: {
          label: '数据更新时间',
          value: '',
          selectType: 'selectComponent',
          selectList: [
            {
              type: 'date',
              key: 'itemSpiderTime'
            }
          ]
        },
        oppositeUserIds: {
          label: '是否有绑定人',
          value: '',
          showTag: false,
          selectType: 'selectMultiple',
          checkBoxList: [
            {
              dictLabel: '无B2C绑定人',
              dictValue: 'B2C'
            },
            {
              dictLabel: '无C2B绑定人',
              dictValue: 'C2B'
            },
            {
              dictLabel: '无C2C绑定人',
              dictValue: 'C2C'
            }
          ]
        }
      },
      hasSelectConfig: true,
      selectResult: {},
      dynamicTags: [], // 筛选后的tag
      indirectTags: [],
      priceTypeList: [],
      coefficientList: [],
      statisticalTypeList: [],
      videoCountList: [],
      selectComponentFlag: false,
      rules: {
        customCpmPriceType: [
          { required: true, message: '请选择报价类型', trigger: 'change' }
        ],
        customCpmDiscountCoefficient: [
          { required: true, message: '请选择折扣系数', trigger: 'change' }
        ],
        customCpmVideoCount: [
          { required: true, message: '请选择视频条数', trigger: 'change' }
        ],
        customCpmStatisticalType: [
          { required: true, message: '请选择统计方式', trigger: 'change' }
        ]
      },
      searchLoad: false,
      isCustomedCpm: false,
      userId: '',
      oldCustomSessionId: '',
      customSessionId: '',
      firstFlag: true,
      cancelFlag: false,
      hasPullDownData: true // 是否还存在下拉数据
    }
  },
  computed: {
    ...mapGetters(['user']),
    topicsTags() {
      return copy(
        this.tagsData.find((item) => item.key === 'topics')
      ).list.filter((item) => item.tagId)
    },
    hasSelectData() {
      return !this.dynamicTags.length
    },
    statisticalFlag() {
      if (
        this.customForm.customCpmVideoCount === '最近30天个人视频' &&
        this.customForm.customCpmStatisticalType !== '中位数'
      ) {
        this.$set(this.customForm, 'customCpmStatisticalType', '')
      }
      return this.customForm.customCpmVideoCount === '最近30天个人视频'
    }
  },
  watch: {
    hasSelectConfig(val) {
      if (!val) {
        this.getMenuConfigData()
      }
    },
    dynamicTags(val) {
      if (this.firstFlag && val && val.length) {
        this.handleCreateSessionId()
        this.handleSearch(0)
        this.firstFlag = false
      }
    }
  },
  created() {
    lego.send({
      actiontype: 'R1804',
      pagetype: 'zpmshow',
      backup: {
        sortId: 9,
        sortName: '首次进入',
        token: this.user.userInfo.userid,
        uid: this.user.userInfo.id
      }
    })
    this.userId = this.$store.state.user.userInfo.userid
    sessionStorage.setItem(
      'sessionId',
      `${this.userId}_${new Date().getTime()}`
    )
    this.customSessionId = `${this.userId}${Date.now()}`
    this.$nextTick(() => {
      this.getSeachConfigList()
      this.getFilterRang()
      this.getMenuConfigData(true)
    })
    this.getList(0)
  },
  beforeDestroy() {
    sessionStorage.setItem('sessionId', '')
  },
  methods: {
    handleCreateSessionId() {
      this.oldCustomSessionId = this.customSessionId
      this.customSessionId = `${this.userId}${Date.now()}`
    },
    handleChangeSelect(val) {
      this.handleReset()
    },
    handleCheckbox(val) {
      if (+val) {
        const _index = this.dynamicTags.findIndex(
          (item) => item.key === 'nealyHotMoneyVideoFlag'
        )
        if (_index > -1) {
          this.dynamicTags[_index].value = val ? '是' : '否'
        } else {
          this.dynamicTags.push({
            label: '近期有爆款视频',
            key: 'nealyHotMoneyVideoFlag',
            value: val ? '是' : '否'
          })
        }
      } else {
        this.handleClose('nealyHotMoneyVideoFlag')
      }
    },
    handleVisibleChange(flag) {
      if (!flag) {
        const { cpmInputStart, cpmInputEnd } = this.searchData
        if (
          typeof cpmInputStart === 'number' ||
          typeof cpmInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            cpm: `${cpmInputStart || 0}-${
              cpmInputEnd === 0 ? 0 : cpmInputEnd || 999
            }`
          }
        }
      } else {
        if (!this.searchData.cpm) {
          this.handleReset()
        }
      }
    },
    handleReset() {
      const data = { ...this.searchData }
      delete data.cpmInputStart
      delete data.cpmInputEnd
      this.searchData = data
    },
    handleConfirm(key) {
      const { cpmInputStart, cpmInputEnd } = this.searchData
      this.searchData[key] = `${cpmInputStart || 0}-${
        cpmInputEnd === 0 ? 0 : cpmInputEnd || 999
      }`
      this.$refs.select.blur()
    },
    handleCustom() {
      this.cpmVisable = true
      this.$refs.Popover.doShow()
    },
    async cpmConfirm() {
      await this.$refs['ruleForm'].validate()
      this.cpmVisable = false
      Object.assign(this.searchData, { ...this.customForm })
      const res = await $updateMenuConfigData({
        menuCode: 'cpm-custom-form',
        customColumns: JSON.stringify(this.customForm)
      })
      if (res.code === 1) {
        this.$message.success('cpm自定义公式已保存成功')
        this.getMenuConfigData(true)
        console.info(this.searchFilterData)
        if (this.searchData.cpmEnd || this.searchData.cpmStart) {
          const cpmItem = this.dynamicTags.find((item) => item.key === 'cpm')
          if (cpmItem) {
            const {
              customCpmPriceType,
              customCpmDiscountCoefficient,
              customCpmVideoCount,
              customCpmStatisticalType
            } = this.customForm
            cpmItem.value = `${this.searchData.cpmStart || 0}-${
              this.searchData.cpmEnd
            }（投放价格：${customCpmPriceType}*${customCpmDiscountCoefficient}  播放量：${customCpmVideoCount}【${customCpmStatisticalType}】）`
          }
        }
      }
    },
    // 监听账号名称或者抖音ID输入
    handleInput() {
      this.handleCloseAllTags()
    },
    handleSearchBtnClick() {
      if (!this.searchData.wd) {
        this.handleCloseAllTags()
        this.$message.warning('检索条件不能为空')
        return
      }
      if (this.searchData.wd !== '') {
        this.searchData.determined = ''
      }
      this.handleCreateSessionId()
      this.handleSearch(0)
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          sortId: 0,
          sortName: '搜索',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          filterData: JSON.stringify(this.searchData)
        }
      })
    },

    // 关闭已选项，清除筛选框内的值
    handleClose(key, selectType) {
      const _index = this.dynamicTags.findIndex((item) => item.key === key)
      if (_index > -1) {
        this.dynamicTags.splice(_index, 1)
      }
      if (key === 'nealyHotMoneyVideoFlag') {
        this.searchData.nealyHotMoneyVideoFlag = 0
      }
      if (this.$refs['selectCheck' + key]) {
        this.$refs['selectCheck' + key].handleReset(true)
      }
      if (this.$refs['selectComponent' + key]) {
        this.$refs['selectComponent' + key].handleReset(true)
      }
      if (this.$refs['selectBase' + key]) {
        this.$refs['selectBase' + key].handleReset(true)
      }
      if (this.$refs['cascaderComponent' + key]) {
        this.$refs['cascaderComponent' + key].handleReset(true)
      }
      if (this.$refs['selectMultiple' + key]) {
        this.$refs['selectMultiple' + key].handleReset(true)
      }
      if (
        [
          'swellingPowder',
          'releaseSituation',
          'playSituation',
          'nealy10PerDeleteCount',
          'playSituationXingTu',
          'itemSpiderTime'
        ].includes(key)
      ) {
        this.$set(this.searchDataConfigObject, key, {
          value: this.selectObjList[key].selectList,
          selectType
        })
      } else {
        this.$set(this.searchDataConfigObject, key, { value: {}, selectType })
      }
    },
    handleCloseAllTags() {
      const keysList = Object.keys(this.searchDataConfigObject)
      if (this.searchData.nealyHotMoneyVideoFlag) {
        keysList.push('nealyHotMoneyVideoFlag')
      }
      keysList.forEach((key) => {
        this.handleClose(key, this.searchDataConfigObject[key]?.selectType)
      })
    },
    // 格式化已筛选项
    formatItem(_itemObj) {
      const { value: item, type, selectType, key } = _itemObj
      const _list = _itemObj.value || []
      let str = ''
      switch (selectType) {
        case 'selectBase':
          if (type === 1) {
            const {
              customCpmPriceType,
              customCpmDiscountCoefficient,
              customCpmVideoCount,
              customCpmStatisticalType
            } = this.customForm
            if (key === 'cpm') {
              return (
                item.selectValueTxt +
                `（投放价格：${customCpmPriceType}*${customCpmDiscountCoefficient}  播放量：${customCpmVideoCount}【${customCpmStatisticalType}】）`
              )
            }
            return (
             (item.selectTypeTxt ? `${item.selectTypeTxt} ` : '') + item.selectValueTxt
            )
          } else {
            return `${item.selectValueTxt || ''}${
              item.startValue || item.endValue
                ? `（${
                    item.startValue +
                    _itemObj.unit +
                    '-' +
                    (item.endValue
                      ? item.endValue + _itemObj.unit
                      : undefined || '不限')
                  }）`
                : item.type === 2
                ? '（不限）'
                : ''
            }`
          }
        case 'cascaderComponent':
          return item.selectValueTxt || ''
        case 'selectMultiple':
          return (
            item.selectValueTxt.checkBoxArr.join('、') +
            (item.selectValueTxt.selectTxt
              ? `（占比：${item.selectValueTxt.selectTxt}）`
              : '')
          )
        case 'selectCheck':
          return item.selectValue
        case 'selectComponent':
          str = ''
          _list.forEach((item, index) => {
            if (item.type === 'inputRange') {
              str += `${item.label ? item.label + '：' : ''}(${
                item.value.start || 0
              }${item.unit}～${
                item.value.end ? item.value.end + item.unit : '不限'
              })`
            }
            if (item.type === 'select') {
              str += `${item.label ? item.label + '：' : ''}${item.text} `
            }
            if (item.type === 'date') {
              str += item.text
            }
          })
          return str
        default:
          break
      }
    },
    // 过滤筛选的结果，获得已选项数据
    filterResult(type, obj, selectType) {
      const { label } = obj
      if (!this.dynamicTags.find((item) => item.key === type)) {
        this.dynamicTags.push({
          key: type,
          label: label,
          selectType,
          value: this.formatItem(obj)
        })
      } else {
        const _index = this.dynamicTags.findIndex((item) => item.key === type)
        this.dynamicTags[_index].value = this.formatItem(obj)
      }
    },
    // 过滤获取searchData的值
    getSearchData() {
      let _searchData = {}
      const keyList = Object.keys(this.searchDataConfigObject)
      const objList = { ...this.searchDataConfigObject }
      keyList.forEach((_key) => {
        const { value: item = {}, selectType } = objList[_key] || {}
        if (selectType === 'selectBase') {
          if (_key === 'gender') {
            _searchData[_key] = item.selectValue
            return
          }
          _searchData[_key + 'Start'] = item.startValue
            ? item.startValue * (_key === 'fansNum' ? 10000 : 1)
            : ''
          _searchData[_key + 'End'] = item.endValue
            ? item.endValue * (_key === 'fansNum' ? 10000 : 1)
            : ''
          if (_key === 'darenPrice') {
            _searchData[_key + 'Type'] = item.selectValue
              ? item.selectValue
              : ''
          }
          if (item.showTypeSlect) {
             _searchData[_key + 'Type'] = item.selectValue
              ? item.selectTypeValue
              : ''
          }
        }

        if (selectType === 'cascaderComponent') {
          _searchData.cityNames = item.value ? item.value : ''
        }

        if (selectType === 'selectMultiple') {
          if (_key !== 'oppositeUserIds') {
            _searchData[_key + 'Proportions'] = item?.selectArr || []
          } else {
            _searchData[_key] = item?.selectArr || []
          }
          if (_key !== 'oppositeUserIds') {
            _searchData[_key + 'Proportion'] = item?.selectValue || ''
          }
        }

        if (selectType === 'selectCheck') {
          _searchData.emptyTagsFlag = null
          if (item && item.selectValue) {
            _searchData[_key] = item.tagsIds || []
            const _index = item.tagsIdsLevelTwo.findIndex(
              (item) => item === '无内容标签'
            )
            if (_index > -1) {
              item.tagsIdsLevelTwo.splice(_index, 1)
              _searchData.emptyTagsFlag = 0
            }
            _searchData[_key + 'LevelTwo'] = item.tagsIdsLevelTwo || []
          } else {
            _searchData[_key] = []
            _searchData[_key + 'LevelTwo'] = []
          }
        }

        if (selectType === 'selectComponent' && item) {
          item.forEach((_innerItem) => {
            if (_innerItem.type === 'inputRange') {
              _searchData[_innerItem.key + 'Start'] = _innerItem.value
                ? ((_innerItem.value || {}).start || 0) *
                    (_innerItem.unit === 'w' ? 10000 : 1) || 0
                : ''
              _searchData[_innerItem.key + 'End'] =
                ((_innerItem.value || {}).end || 0) *
                  (_innerItem.unit === 'w' ? 10000 : 1) || ''
            }
            if (_innerItem.type === 'date') {
              _searchData[_innerItem.key + 'Start'] =
                (_innerItem.value || {}).start || ''
              _searchData[_innerItem.key + 'End'] =
                (_innerItem.value || {}).end || ''
            }
            if (_innerItem.type === 'select') {
              if (_innerItem.customFlag) {
                _searchData[_innerItem.key + 'Start'] =
                  _innerItem.value || _innerItem.start || 0
                _searchData[_innerItem.key + 'End'] = _innerItem.end || ''
              } else {
                _searchData[_innerItem.key] = _innerItem.value || ''
              }
            }
          })
        }
      })
      // 设置cpm时，需要将自定义的cpm公式传递
      if (_searchData.cpmEnd || _searchData.cpmStart) {
        _searchData = { ..._searchData, ...this.customForm }
      } else {
        _searchData.customCpmPriceType = ''
        _searchData.customCpmDiscountCoefficient = ''
        _searchData.customCpmVideoCount = ''
        _searchData.customCpmStatisticalType = ''
      }

      Object.assign(this.searchData, { ..._searchData })
      this.searchData = { ...this.removeEmpty(this.searchData) }
    },
    // 移除对象为空的
    removeEmpty(obj) {
      return Object.entries(obj)
        .filter(([_, v]) => v !== '' && !(Array.isArray(v) && v.length === 0))
        .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
    },
    // 判断对象是否为空
    justifyObject(val) {
      return val.findIndex((item) => item.value !== '') > -1
    },

    handleUpdateSelect(val, type) {
      // 当选择是选项时，清除顶部检索值
      this.$set(this.searchData, 'wd', '')
      const _copySelectObjList = deepClone(this.selectObjList)
      _copySelectObjList[type].value = val
      this.$set(this.searchDataConfigObject, type, {
        value: val,
        selectType: _copySelectObjList[type].selectType
      })
      this.selectResult = _copySelectObjList
      if (
        !val ||
        (_copySelectObjList[type].selectType === 'selectComponent' &&
          !this.justifyObject(val))
      ) {
        // 筛选框点击重置清除已选项
        this.handleClose(type, _copySelectObjList[type].selectType)
      } else {
        this.filterResult(
          type,
          _copySelectObjList[type],
          _copySelectObjList[type].selectType
        )
      }
    },
    // 生成推荐达人
    handlerecommendationSearch(refreshDataFlag) {
      this.searchData.wd = ''
      this.handleCreateSessionId()
      this.handleSearch(refreshDataFlag)
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          sortId: 1,
          sortName: '生成推荐达人',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          filterData: JSON.stringify(this.searchData)
        }
      })
    },
    // 是否过滤黑名单账号
    handleTableSearch(refreshDataFlag) {
      this.handleCreateSessionId()
      this.handleSearch(refreshDataFlag)
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          sortId: 0,
          sortName: '过滤黑名单账号',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          filterData: JSON.stringify(this.searchData)
        }
      })
    },
    handleSearch(refreshDataFlag) {
      this.getSearchData()
      this.tableData = []
      this.loading = true
      this.searchData.pageNum = 1
      this.total = 0
      this.getList(refreshDataFlag)
    },
    getFilterRang() {
      $getTiktokFilterRang()
        .then((res) => {
          if (res) {
            if (res.code === 1) {
              for (const key in this.tagInfo) {
                this.tagInfo[key].data = res.data[key] || []
                if (this.tagInfo[key].all) {
                  this.tagInfo[key].data.unshift('全部')
                  this.tagInfo[key].data.push('无内容标签')
                }
              }
              this.tagValueList = res.data.sysPlatTags || []
              this.tagValueList.unshift({
                tagId: '',
                tagName: '全部'
              })
              this.tagValueList.push({
                tagId: '无内容标签',
                tagName: '无内容标签'
              })
            } else {
              this.$message.error(res.error)
            }
          }
        })
        .catch((err) => {})
    },
    async handleCancelRecommend(searchData, index, val) {
      const res = await $refuseRecommend({
        accountId: searchData.accountId,
        getDataUrl: searchData.getDataUrl,
        refuseRecommendType: val
      })

      if (+res.code === 1) {
        delete searchData.accountId
        delete searchData.getDataUrl
        this.cancelFlag = true
        this.$message.success('不再推荐设置成功')
        this.handleReSearchCurrent(searchData)
      } else {
        this.$message.error(res.message)
      }
    },
    async handleReSearchCurrent(searchData) {
      const params = copy({ ...this.searchData, ...searchData })
      params.oldCustomSessionId =
        this.oldCustomSessionId || this.customSessionId
      params.customSessionId = this.customSessionId
      params.refreshDataFlag = 1
      // this.total = 0
      $getDyList({ ...params }).then((res) => {
        if (res.code === 1) {
          const tableData = [...this.tableData]
          this.tableData = tableData.splice(
            0,
            (searchData.pageNum - 1) * searchData.size
          )
          this.total = res.total
          this.tableData = [...this.tableData, ...res.data]
        }
      })
    },
    async handleReSearchCurrent1(searchData) {
      const tableData = [...this.tableData]
      this.tableData = tableData.splice(
        0,
        (searchData.pageNum - 1) * searchData.size
      )

      this.loading = true
      this.searchData = { ...searchData }
      this.total = 0
      this.$nextTick(() => {
        this.getList()
      })
    },

    handleChangeFilterFlag() {
      if (this.$refs.backTopRefs && this.$refs.backTopRefs.visible) {
        this.loading = true
        this.$refs.backTopRefs.backToTop()
        const checkSearch = () => {
          setTimeout(() => {
            if (!this.$refs.backTopRefs.visible) {
              this.handleSearch()
            } else {
              checkSearch()
            }
          }, 400)
        }

        checkSearch()
        return
      }
      this.handleSearch()
    },
    // 获取搜索配置项下拉数据
    getSeachConfigList() {
      $getDataByDictType({
        dictTypes: [
          'daren_library_new_custom_cpm', // 自定义cpm
          'daren_library_new_custom_cpm_price_type', // 报价类型
          'daren_library_new_custom_cpm_discount_coefficient', // 折扣系数
          'daren_library_new_custom_cpm_video_count', // 视频条数
          'daren_library_new_custom_cpm_statistical_type', // 统计方式
          'daren_library_new_men_proportion', // 性别分布
          'daren_library_new_age_proportion', // 年龄分布
          'daren_library_new_city_grade_proportion', // 城市等级分布
          'daren_library_new_crowd_proportion', // 八大人群分布
          'daren_library_new_proportion', // 设备分布
          'daren_library_new_recyclable_city_proportion', // 占比
          'daren_library_new_price_type', // 报价类型
          'daren_library_new_recommend_index_number', // 种草指数
          'daren_library_new_change_index_number', // 转化指数
          'daren_library_new_add_fans_time_frame', // 时间范围
          'daren_library_new_add_fans_number', // 涨粉区间
          'daren_library_new_xingtu_video_statistical_scope', // 星图条数-统计范围
          'daren_library_new_xingtu_video_count', // 星图条数-统计条数
          'daren_library_new_all_video_statistical_scope', // 播放量-统计范围
          'daren_library_new_all_video_statistical_type', // 播放量-统计方式
          'daren_library_new_all_video_statistical_play_frame', // 播放量-播放量区间
          'daren_library_new_areas' // 达人所在区域
        ]
      }).then((res) => {
        if (res.code === 1) {
          const {
            daren_library_new_custom_cpm: cpmList,
            daren_library_new_custom_cpm_price_type: priceTypeList,
            daren_library_new_custom_cpm_discount_coefficient: coefficientList,
            daren_library_new_custom_cpm_video_count: videoCountList,
            daren_library_new_custom_cpm_statistical_type: statisticalTypeList,
            daren_library_new_men_proportion: menProportionList, // 性别分布
            daren_library_new_age_proportion: ageList, // 年龄分布
            daren_library_new_city_grade_proportion: cityGradeList, // 城市等级分布
            daren_library_new_crowd_proportion: crowdProportionList, // 八大人群分布
            daren_library_new_proportion: deviceList, // 设备分布
            daren_library_new_recyclable_city_proportion: proportionList, // 可上门回收城市占比
            daren_library_new_price_type: newPriceTypeList, // 达人报价
            daren_library_new_recommend_index_number: indexNumList, // 种草指数
            daren_library_new_change_index_number: changeNumList, // 转化指数
            daren_library_new_add_fans_time_frame: fansTimeList, // 时间范围
            daren_library_new_add_fans_number: addFansNumList, // 涨粉区间
            daren_library_new_xingtu_video_statistical_scope: videoScopeList, // 星图条数-统计范围
            daren_library_new_xingtu_video_count: videpCountList, // 星图条数-统计条数
            daren_library_new_all_video_statistical_scope: allVideoScopeList, // 播放量-统计范围
            daren_library_new_all_video_statistical_type: allVideoTypeList, // 播放量-统计方式
            daren_library_new_areas: darenNewAreas
            // daren_library_new_all_video_statistical_play_frame: playFrameList // 播放量-播放区间
          } = res.data
          this.selectObjList.cpm.dataList = cpmList
          this.priceTypeList = priceTypeList
          this.coefficientList = coefficientList
          this.statisticalTypeList = statisticalTypeList
          this.videoCountList = videoCountList
          this.selectObjList.menProportion.dataList = menProportionList
          this.selectObjList.age.checkBoxList = ageList
          this.selectObjList.age.dataList = proportionList
          this.selectObjList.cityGrade.checkBoxList = cityGradeList
          this.selectObjList.cityGrade.dataList = proportionList
          this.selectObjList.device.checkBoxList = deviceList
          this.selectObjList.device.dataList = proportionList
          this.selectObjList.crowd.checkBoxList = crowdProportionList
          this.selectObjList.crowd.dataList = proportionList
          this.selectObjList.darenPrice.dataList = newPriceTypeList
          this.selectObjList.recommendIndexNumber.dataList = indexNumList
          this.selectObjList.changeIndexNumber.dataList = changeNumList
          this.selectObjList.darenOrigin.dataList = []
          if (darenNewAreas && darenNewAreas.length) {
            this.selectObjList.darenOrigin.dataList = darenNewAreas.map(
              (item) => {
                const label = item.dictLabel
                const value = JSON.parse(item.dictValue)
                const children = value.map((v) => ({
                  label: v,
                  value: v
                }))
                return {
                  label,
                  value: label,
                  children
                }
              }
            )
          }
          this.selectObjList.swellingPowder.selectList.forEach((item) => {
            if (item.key === 'addFansTimeFrame') {
              item.dataList = fansTimeList
            }
            if (item.key === 'nealyAddFans') item.dataList = addFansNumList
          })
          this.selectObjList.releaseSituation.selectList.forEach((item) => {
            if (item.key === 'xingtuVideoStatisticalScope') {
              item.dataList = videoScopeList
            }
            if (item.key === 'xingtuVideoCount') item.dataList = videpCountList
          })
          this.selectObjList.playSituation.selectList.forEach((item) => {
            if (item.key === 'allVideoStatisticalScope') {
              item.dataList = allVideoScopeList
            }
            if (item.key === 'allVideoStatisticalType') {
              item.dataList = allVideoTypeList
            }
            // if (item.key === 'flowCount') item.dataList = playFrameList
          })
        }
      })
    },
    getMoreList() {
      // 点击不再推荐后，不能调用滚动加载
      if (this.cancelFlag) {
        this.cancelFlag = false
        return
      }
      if (this.tableData.length >= this.total) {
        return
      }
      // 没有下拉数据了 不请求
      if (!this.hasPullDownData) {
        return
      }
      this.oldCustomSessionId = this.customSessionId
      this.searchData.pageNum += 1
      this.loading = true
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmshow',
        backup: {
          sortId: 3,
          sortName: '下拉列表滚动加载',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          filterData: JSON.stringify(this.searchData)
        }
      })
      this.getList(1, true)
    },
    getList(refreshDataFlag = 1) {
      // refreshDataFlag 列表数据刷新的渠道：【生成推荐达人】-0、【通过下拉框下拉】-1
      this.loading = true
      const params = copy(this.searchData)
      // 会话ID生成，配合后端列表的缓存方案
      params.oldCustomSessionId =
        this.oldCustomSessionId || this.customSessionId
      params.customSessionId = this.customSessionId
      $getDyList({ ...params, refreshDataFlag })
        .then((re) => {
          if (re.code === 1) {
            this.total = re.total
            this.tableData = [...this.tableData, ...re.data]
            this.timeMap = re.spiderTimeMap
            this.hasPullDownData = true
          } else {
            // 下拉没有数据了
            if (re.message === '暂无数据,请点击重新生成推荐达人') {
              this.hasPullDownData = false
            }
            this.$message.error(re.message)
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.hasPullDownData = true
          this.loading = false
          this.$message.error(err.message)
        })
    },
    // 清空selectComponent\selectMultiple没有值的数据
    clearFomartData() {
      const objList = deepClone(this.searchDataConfigObject)
      const clearArr = []
      for (const k in objList) {
        if (objList[k].value && !Object.keys(objList[k].value).length) {
          clearArr.push(k)
        }
        if (
          objList[k].selectType === 'selectMultiple' &&
          typeof objList[k].value === 'object' &&
          Object.keys(objList[k].value).length === 0
        ) {
          clearArr.push(k)
        }
        if (objList[k].selectType === 'selectComponent') {
          const list = objList[k].value
          const item = list.find(
            (item) =>
              !item.customFlag &&
              (item.value === undefined || item.value === '')
          )
          if (item) {
            clearArr.push(k)
          }
        }
      }
      clearArr.forEach((item) => {
        delete objList[item]
      })
      return objList
    },
    async updateSearchConfig() {
      this.clearFomartData()
      const params = {
        searchDataConfig: this.clearFomartData(),
        nealyHotMoneyVideoFlag: this.searchData.nealyHotMoneyVideoFlag
      }
      const res = await $updateMenuConfigData({
        menuCode: 'search-data-config',
        customColumns: JSON.stringify(params)
      })
      if (res.code === 1) {
        this.hasSelectConfig = false
        this.$message.success(res.message)
      }
    },
    // 加载已存在的筛选条件 type存在，则代表查询是否有配置，否则为加载配置
    async getMenuConfigData(type) {
      // 清空当前的筛选条件
      if (!type) {
        this.handleCloseAllTags()
      }
      this.searchLoad = true
      const res = await $getMenuConfigData({
        menuCodes: ['search-data-config', 'cpm-custom-form'].join(',')
      })
      if (res.code === 1 && res.data) {
        this.searchLoad = false
        const list = res.data || []
        const cpmStr = (
          list.find((item) => item.menuCode === 'cpm-custom-form') || {}
        ).customColumns
        const searchStr = (
          list.find((item) => item.menuCode === 'search-data-config') || {}
        ).customColumns
        this.customForm = cpmStr?.length ? JSON.parse(cpmStr) : this.customForm
        this.isCustomedCpm = !!cpmStr
        // hasSelectConfig是否存在已设置的筛选配置
        this.hasSelectConfig = !searchStr
        // type用来判断是否加载已设置的筛选项 true不加载、false加载
        if (type || !searchStr) return
        const obj = JSON.parse(searchStr)
        this.searchFilterData = obj.searchDataConfig
        console.info('---------------已存在调价加载', obj)
        this.searchData.nealyHotMoneyVideoFlag =
          obj.nealyHotMoneyVideoFlag || 0
        if (this.searchData.nealyHotMoneyVideoFlag) {
          this.handleCheckbox(this.searchData.nealyHotMoneyVideoFlag)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
$--label-width: 70px;
.no-data {
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.accounts {
  &-search {
    &__title {
      // display: flex;
      // justify-content: end;
      &-input {
        width: 590px;
      }
    }
    &__label {
      width: $--label-width;
      text-align: justify;
      text-align-last: justify;
      margin-right: 24px;
    }
    &__sub-label {
      width: $--label-width;
      text-align: right;
    }
  }
}
.m-t-40 {
  margin-top: 40px;
}

.totalBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 16px;
  position: sticky;
  top: -24px;
  background-color: #fff;
  z-index: 2;
}

.total {
  font-size: 14px;
  margin-right: 14px;
}

.p-t-0 {
  padding-top: 0px;
}

.iconTip {
  font-size: 14px;
  align-items: center;
  margin-left: 4px;
}
.select-drap {
  padding: 0 24px;
  &-box {
    border-top: 1px solid #eee;
    padding-top: 12px;
  }
}
.input-xs {
  width: 100px;
}
.el-select-dropdown__item {
  height: 30px !important;
  line-height: 30px !important;
}
.popover-title {
  width: 80px;
  text-align: right;
}
.select-checked {
  color: #2c64ff;
}

.select-box {
  position: relative;
  .audience-select {
    position: absolute;
    top: 0;
    width: 80px;
    opacity: 0;
  }
}
.tags-box {
  position: relative;
  display: flex;
  justify-items: center;
  &-left {
    position: absolute;
    height: 100%;
    padding-top: 10px;
  }
  &-right {
    width: 100%;
    flex: 1;
    display: flex;
    margin-left: 94px;
    flex-wrap: wrap;
  }
  .dynamic-tag {
    border-radius: 30px;
    padding: 2px 16px;
    line-height: 24px;
    height: fit-content;
    .el-icon-close {
      font-size: 14px;
    }
  }
  .tag-content {
    position: relative;
    width: fit-content;
    margin-bottom: 9px;
    span {
      display: block;
      // width: 90%;
      width: fit-content;
      height: 100%;
      white-space: break-spaces;
    }
  }
}

.rule-form {
  ::v-deep {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
</style>
