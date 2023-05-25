<template>
  <div class="P-advertisingLaunch">
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal>
          <el-form-item label="手动录入时间">
            <el-date-picker
              v-model="searchData.rangeTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
        <template v-slot:btns>
          <el-button v-if="$permission('add_med_account')" v-log type="primary" @click="handleAddAccount">添加媒介账号</el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-between m-b-24">
        <el-checkbox-group v-model="checkTableRow">
          <template v-if="type === 'douyin'">
            <el-checkbox label="oversixtySecondPrice">60s+报价</el-checkbox>
            <el-checkbox label="quotePrice">21-60s报价</el-checkbox>
            <el-checkbox label="twentySecondPrice">1-20s报价</el-checkbox>
            <!-- <el-checkbox label="livePrice">直播报价</el-checkbox> -->
          </template>

          <!-- <template v-if="type === 'kuaishou'">
            <el-checkbox label="quotePrice">达人报价</el-checkbox>
            <el-checkbox label="netPrice">全网报价</el-checkbox>
          </template> -->

          <template v-if="type === 'bilibili'">
            <el-checkbox label="customVideoPrice">定制视频</el-checkbox>
            <el-checkbox label="implantationVideoPrice">植入视频</el-checkbox>
            <el-checkbox label="directVideoPrice">直发视频</el-checkbox>
            <el-checkbox label="forwardSituationPrice">转发动态</el-checkbox>
          </template>

          <template v-if="type === 'xiaohongshu'">
            <el-checkbox label="videoPrice">视频笔记</el-checkbox>
            <el-checkbox label="picturePrice">图文笔记</el-checkbox>
          </template>
        </el-checkbox-group>

        <div>
          <el-button
            v-if="$permission('medium_account_replace')"
            type="text"
            @click="showBatchUpdateDialog = true"
          >
            批量更新媒介账号信息
          </el-button>
          <!-- <el-button
            v-if="$permission('medium_account_into')"
            type="primary"
            @click="importDrawerStatus = true"
          >批量导入账号</el-button> -->
          <el-button v-if="$permission('batch_change_account_type')" v-log type="primary" size="small" plain @click="updateCheckAccountStatus(0)">批量上架</el-button>
          <el-button v-if="$permission('batch_change_account_type')" v-log type="danger" size="small" plain @click="updateCheckAccountStatus(1)">批量下架</el-button>
        </div>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        :row-class-name="getTableRowClass"
        header-row-class-name="table-header"
        @sort-change="doSort"
        @selection-change="handleListSelect"
      >
        <el-table-column v-if="$permission('batch_change_account_type')" type="selection" />
        <el-table-column prop="accountStatus" label="账号状态" width="90">
          <template slot-scope="{ row }">
            <el-select
              v-if="$permission('batch_change_account_type')"
              v-model="row.accountStatus"
              size="mini"
              @change="hanleAccountStatus(row)"
            >
              <el-option
                v-for="item in accountStatusList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <div v-else>{{ row.accountStatus === 0 ? '上架': '下架' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="账号等级">
          <template slot-scope="{row}">
            {{ row.mechanismLevel?row.mechanismLevel:'--' }}
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号信息" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row">
              <template v-slot>
                <div v-if="row.upUpNameAndLeader" class="m-t-5" style="text-align:left;"><el-tag size="mini" type="danger">{{ row.upUpNameAndLeader }}</el-tag></div>
              </template>
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom" width="120">
          <template slot-scope="{row}">{{ row.fansNum | toThousandsW }}</template>
        </el-table-column>

        <el-table-column label="报价" prop="twentySecondPrice" width="152" text-align="left">
          <template slot="header">
            <IconTip
              :content="getPlatPriceTip"
              label="报价"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">
            <div class="price">
              <template v-if="type === 'douyin'">
                <p v-if="checkTableRowShow.twentySecondPrice">
                  <span>1-20s：</span>
                  <span>¥{{ row.twentySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.quotePrice">
                  <span>21-60s：</span>
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.oversixtySecondPrice">
                  <span>60s以上：</span>
                  <span>¥{{ row.oversixtySecondPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'kuaishou'">
                <p v-if="checkTableRowShow.quotePrice" class="ksPrice">
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'bilibili'">
                <p v-if="checkTableRowShow.customVideoPrice">
                  <span>定制视频：</span>
                  <span>¥{{ row.customVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.implantationVideoPrice">
                  <span>植入视频：</span>
                  <span>¥{{ row.implantationVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.directVideoPrice">
                  <span>直发视频：</span>
                  <span>¥{{ row.directVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.forwardSituationPrice">
                  <span>转发动态：</span>
                  <span>¥{{ row.forwardSituationPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'xiaohongshu'">
                <p v-if="checkTableRowShow.videoPrice">
                  <span>视频笔记：</span>
                  <span>¥{{ row.videoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.picturePrice">
                  <span>图文笔记：</span>
                  <span>¥{{ row.picturePrice | toThousandsW }}</span>
                </p>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="历史毛利率" prop="grossProfitRate" width="120" sortable="custom">
          <template slot="header">
            <IconTip
              content="该账号，最近两个月“档期”的工单毛利率的平均值，每天0点更新一次"
              label="历史毛利率"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">
            {{ (row.grossProfitRate === null || row.grossProfitRate === undefined) ? '--' : `${row.grossProfitRate}%` }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="quotePrice" label="21-60s报价" sortable="custom" width="132">
          <template slot="header">
            <IconTip
              content="抖音账号数据来源为星图平台，系统每月自动更新一次（每月第二日），可能存在一定偏差，支持编辑校准。其他平台数据以用户编辑数值为准。"
              label="21-60s报价"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">{{ row.quotePrice | toThousandsW }}</template>
        </el-table-column> -->

        <el-table-column prop="rebate" label="返点" sortable="custom">
          <template slot-scope="{row}">
            {{ row.rebate }}%
          </template>
        </el-table-column>
        <el-table-column prop="cpm" label="CPM" sortable="custom" width="90">
          <template slot="header">
            <IconTip
              content="预期CPM：数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
              label="CPM"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="s">
            <div> {{ s.row.cpm | toThousands }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="belongTeam" label="所属供应商" />
        <el-table-column prop="fansNum" label="省市地址">
          <template slot-scope="scope">
            {{ scope.row.provNameAndCityName?scope.row.provNameAndCityName:'--' }}
          </template>
        </el-table-column>
        <el-table-column prop="realName" label="媒介采买人" width="72" />
        <el-table-column prop="accountUseCount" label="投放次数" sortable="custom" />
        <!-- <el-table-column prop="avgLikeWeek" label="近7天集均点赞量" sortable="custom" />
        <el-table-column prop="avgLikeMonth" label="近30天集均点赞量" sortable="custom" /> -->
        <el-table-column width="180" prop="createTime" label="手动录入时间" sortable="custom" />
        <el-table-column prop="remark" label="备注">
          <template slot-scope="{ row }">
            <el-popover
              v-if="(row.remark || '').length > 20"
              width="200"
              trigger="hover"
              :content="row.remark"
              placement="top"
            >
              <span slot="reference">{{ `${(row.remark || '').substr(0, 20)}...` }}</span>
            </el-popover>
            <span v-else>{{ row.remark || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="s">

            <IconTip
              v-log
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
            />
            <IconTip
              v-if="s.row.editOperatorPermissions"
              content="编辑"
              icon-class="iconbianji"
              class="m-r-10"
              @click="handleEdit(s.row)"
            />
            <el-popconfirm
              v-if="s.row.delOperatorPermissions && s.row.accountUseCount === 0"
              :title="`确定删除账号${s.row.accountName}？`"
              @confirm="handleDeletAccount(s.row)"
            >
              <IconTip
                slot="reference"
                content="删除"
                icon-class="iconshanchu"
                class="m-r-10"
                :disabled="s.row.accountUseCount > 0"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>

    <import-acounts
      v-if="importDrawerStatus"
      :show="importDrawerStatus"
      :config="importConf"
      :is-off-line="true"
      @close="importDrawerStatus = false"
    >
      <!-- <p class="m-b-5" style="color: #ff4949">单次最多导入20条数据，快手账号的主页链接可以用视频链接代替</p> -->
    </import-acounts>

    <!-- <ImportAcounts
      v-if="replaceAccountDrawer"
      :show="replaceAccountDrawer"
      type="replace"
      :config="replaceConf"
      template-url="/api/account/commercial/affairs/downLoadCommercialAffairsAccounTemplate"
      :is-off-line="true"
      @close="replaceAccountDrawer = false"
      @success="handleReplace"
      @reload="handleReload"
    /> -->

    <BatchUpdateDialog
      v-if="showBatchUpdateDialog"
      v-model="showBatchUpdateDialog"
      :type="type"
    />

    <AddMediumOrg
      v-if="showAddMeduiuDialog"
      v-model="showAddMeduiuDialog"
      @update="handleUpdate"
    />
    <AddMediumAccount
      v-if="showDialog"
      v-model="showDialog"
      :account-id="accountId"
      :type="type"
      :is-edit="isEdit"
      :user-list="optionsData.userList"
      :talent-level-list="talentLevelList"
      @update="getList"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import qs from 'qs'
import Search from '@/components/Search'
import AddMediumOrg from '../../medium-org-manage/AddMediumOrg'
import tableMixin from '@/mixins/table'
import { Statistics, AccountCard, IconTip } from 'components'
import ImportAcounts from '@/components/ImportAcounts'
import { $getDataByDictType } from '@/api'
import {
  $getUserIdByMeduimOrgId,
  $getMedAccount,
  $getTiktokAccountList,
  $getKuaishouAccountList,
  $getBilibiliAccountList,
  $getRedbookAccountList,
  $getFilterData,
  $getMedAccounts,
  $updateAccountStatus,
  $updateTiktokAccountStatus,
  $updateKuaishouAccountStatus,
  $updateBilibiliAccountStatus,
  $updateRedbookAccountStatus,
  $deletMedAccount,
  $getMediumOrgCondition,
  $deleteTiktokAccount,
  $deleteKuaishouAccount,
  $deleteBilibiliAccount,
  $deleteRedbookAccount
} from '@/api/bussiness-manage'
import { copy } from '@/components/common'
import { isUndef, unique } from '@/utils'
import BatchUpdateDialog from '../BatchUpdateDialog.vue'
import AddMediumAccount from '../../../_mods/AddMediumAccount/'

export default {
  components: {
    vSearch: Search,
    Statistics,
    ImportAcounts,
    AccountCard,
    AddMediumOrg,
    AddMediumAccount,
    BatchUpdateDialog,
    IconTip
  },
  mixins: [tableMixin],
  props: {
    type: {
      type: String,
      default: 'douyin'
    }
  },
  data() {
    let defaultCheckTableRow = ''
    if (this.type === 'douyin') {
      defaultCheckTableRow = ['quotePrice']
    } else if (this.type === 'kuaishou') {
      defaultCheckTableRow = ['quotePrice']
    } else if (this.type === 'bilibili') {
      defaultCheckTableRow = ['customVideoPrice']
    } else if (this.type === 'xiaohongshu') {
      defaultCheckTableRow = ['videoPrice']
    }

    return {
      prevStatusUrl: '',
      editType: '',
      accountLoading: false,
      hasAccount: false,
      showDialog: false,
      showAddMeduiuDialog: false,
      accountList: [],
      formConf: {},
      accountId: null,
      searchData: {
        accountId: '',
        accountName: '',
        accountStatus: 0,
        platId: '',
        accountType: '',
        pageNum: 1,
        mechanismLevel: ''
      },
      // inputTags: [],
      optionsData: {
        belongTeams: [],
        // 省
        provinceList: [],
        // 市
        cityList: [],
        // 平均播放量区间
        playRange: [],
        // 60s星图报价区间
        xingtuPrice: [],
        // 粉丝区间
        fansRange: [],
        // 媒介采买人
        userList: []
      },
      // 统计数据
      summaryItems: [
        {
          key: 'accountNum',
          text: '账号数量',
          val: 0
        },
        {
          key: 'onlineAccountNum',
          text: '上架账号数量',
          val: 0
        },
        {
          key: 'cooperationAccountCount',
          text: '合作投放账号数量',
          val: 0
        }
      ],
      // 上架下架状态
      accountStatusList: [{
        value: 1,
        label: '下架'
      }, {
        value: 0,
        label: '上架'
      }],
      // 合作状态
      coopStatusList: [
        {
          value: 1,
          label: '解约'
        },
        {
          value: 2,
          label: '拉黑'
        }
      ],
      normalFormItemMap: {},
      importConf: {
        pageType: 2,
        methodId: 3,
        title: '导入媒介账号',
        url: '/api/tiktok/import/account'
      },
      replaceConf: {
        pageType: 2,
        methodId: 3,
        title: '替换媒介采买人',
        url: '/api/business/foreign/medAccount/updateChargePersonBatchByImport'
      },
      isEdit: false,
      checkAccountListIds: [],
      importDrawerStatus: false, // 批量导入账号弹窗
      replaceAccountDrawer: false, // 替换媒介人弹窗
      talentLevelList: [
        {
        levelId: '',
        levelName: '全部等级'
      }, {
        levelId: 'S级',
        levelName: 'S级'
      }, {
        levelId: 'A级',
        levelName: 'A级'
      }, {
        levelId: 'B级',
        levelName: 'B级'
      }, {
        levelId: 'C级',
        levelName: 'C级'
      }, {
        levelId: 'D级',
        levelName: 'D级'
      }],
      showBatchUpdateDialog: false,
      checkTableRow: defaultCheckTableRow

    }
  },
  computed: {
    ...mapGetters([
      'realname'
    ]),
    checkTableRowShow() {
      return this.checkTableRow.reduce((n, t) => {
        n[t] = true
        return n
      }, {})
    },
    getPlatPriceTip() {
      let plat = ''
      switch (this.type) {
        case 'douyin':
          plat = '星图'
          break
        case 'kuaishou':
          plat = '磁力巨星'
          break
        case 'bilibili':
          plat = '花火'
          break
        case 'xiaohongshu':
          plat = '小红书'
          break
      }
      return `账号报价来源于${plat}平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。`
    }
  },
  created() {
    this.buildFormConf()
    this.getFilterData()
    this.getFilterList()
    this.getList()
    this.$bus.$on('updateMediumOrg', this.handleUpdate)
  },
  beforeDestroy() {
    this.$bus.$off('updateMediumOrg')
  },
  methods: {
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'accountStatus',
          data: this.accountStatusList,
          conf: {
            placeholder: '请选择账号状态'
          },
          value: 0,
          optionValKey: 'value',
          optionLabelKey: 'label'
        },
        {
          type: 'select',
          key: 'coopStatus',
          data: this.coopStatusList,
          conf: {
            placeholder: '请选择合作状态'
          },
          optionValKey: 'value',
          optionLabelKey: 'label'
        },
        // {
        //   type: 'select',
        //   key: 'platId',
        //   data: [],
        //   conf: {
        //     placeholder: '全部平台'
        //   },
        //   optionValKey: 'platId',
        //   optionLabelKey: 'platName'
        // },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          },
          optionValKey: 'accountId',
          optionLabelKey: 'accountName'
        },
        {
          type: 'cascader',
          key: 'tagNameList',
          data: [],
          conf: {
            placeholder: '达人类型',
            props: {
              multiple: true,
              value: 'tagName',
              label: 'tagName',
              children: 'childNodeTags'
            },
            collapseTags: true
          },
          optionValKey: 'tagName',
          optionLabelKey: 'tagName'
        },
        {
          type: 'select',
          key: 'fansRange',
          data: [],
          conf: {
            placeholder: '粉丝量级别',
            allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'priceRange',
          data: [],
          conf: {
            placeholder: this.type === 'douyin' ? '21-60s报价' : this.type === 'kuaishou' ? '达人报价' : this.type === 'bilibili' ? '定制视频报价' : this.type === 'xiaohongshu' ? '视频笔记报价' : '',
            allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        // {
        //   type: 'input',
        //   key: 'provNameAndCityName',
        //   data: '',
        //   conf: {
        //     placeholder: ''
        //   }
        // },
        {
          type: 'select',
          key: 'mechanismLevel',
          data: this.talentLevelList,
          value: '',
          conf: {
            placeholder: '请选择账号等级'
          },
          optionValKey: 'levelId',
          optionLabelKey: 'levelName'
        },
        // {
        //   type: 'select',
        //   key: 'cityId',
        //   data: [],
        //   conf: {
        //     placeholder: '市'
        //   },
        //   optionValKey: 'areaId',
        //   optionLabelKey: 'areaName'
        // },
        // {
        //   type: 'select',
        //   key: 'mechanismId',
        //   data: [],
        //   conf: {
        //     placeholder: '达人所在地区'
        //   }
        // },
        {
          type: 'select',
          key: 'rebate',
          data: [],
          conf: {
            placeholder: '请选择返点',
            allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'cpm',
          data: [],
          conf: {
            placeholder: '请选择cpm',
            allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'maxAgeLabel',
          data: [],
          conf: {
            placeholder: '粉丝年龄'
            // allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'cascader',
          key: 'sixRange',
          data: [],
          conf: {
            placeholder: '粉丝性别分布',
            props: { value: 'dictValue', label: 'dictLabel', emitPath: true, checkStrictly: true }

          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'maxPhoneLabel',
          data: [],
          conf: {
            placeholder: '粉丝手机系统'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },

        {
          type: 'select',
          key: 'isCommerce',
          data: [{
            text: '是',
            val: 1
          }, {
            text: '否',
            val: 0
          }],
          conf: {
            placeholder: '是否开通购物车'
          }
        },
        {
          type: 'select',
          key: 'mechanismId',
          data: [],
          conf: {
            placeholder: '所属供应商'
          }
        },
        {
          type: 'input',
          key: 'provNameAndCityName',
          data: '',
          conf: {
            placeholder: '请输入省市地址'
          }
        },
        {
          type: 'select',
          key: 'accountContacts',
          data: [],
          conf: {
            placeholder: '账号对接人'
          }
        },
        {
          type: 'select',
          key: 'meetUserId',
          data: [],
          conf: {
            placeholder: '媒介采买人'
          },
          optionValKey: 'userId',
          optionLabelKey: 'realname'
        },
        {
          type: 'select',
          key: 'accountUseCount',
          data: [],
          conf: {
            placeholder: '请选择投放次数',
            allowCreate: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        }
        // {
        //   type: 'select',
        //   key: 'cpm',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择cpm'
        //   },
        //   optionValKey: 'dictValue',
        //   optionLabelKey: 'dictLabel'
        // },

        // {
        //   type: 'select',
        //   key: 'playRange',
        //   data: [],
        //   conf: {
        //     placeholder: '平均播放量'
        //   }
        // }
      ]
      const formConf = {
        normal,
        // hasExport: this.$permission('medium_account_into')
        hasExport: this.$permission('manager_export')
      }

      const normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
      this.regs = {
        fansRange: {
          reg: /^([0-9]+万?)-([0-9]+万?)$/,
          message: '输入正确的粉丝量，例如：10000-20000或1万-2万',
          max: 1000000000
        },
        priceRange: {
          reg: /^([0-9]+万?)-([0-9]+万?)$/,
          message: '输入正确的21-60s报价，例如：10000-20000或1万-2万',
          max: 1000000000
        },
        rebate: {
          reg: /^([0-9]+%?)-([0-9]+%?)$/,
          message: '输入正确的返点，例如：10-20%',
          max: 100
        },
        cpm: {
          reg: /^([0-9]+)-([0-9]+)$/,
          message: '输入正确的cpm，例如：10-20',
          max: 1000000000
        },
        accountUseCount: {
          reg: /^([0-9]+)(-([0-9]+))?$/,
          message: '输入正确的投放次数，例如：10-20',
          max: 1000000000
        }
      }
    },
    // 获取下拉框选项 CPM
    getFilterList() {
      $getDataByDictType({
        dictTypes: ['sign_contract_account_price_range', 'sign_contract_account_fans_range', 'sys_search_cpm', 'fans_age_kuaishou_condition_age', 'daren_library_query_condition_phone', 'daren_library_query_condition_fans', 'daren_library_query_condition_60s', 'daren_library_query_condition_sex', 'daren_library_query_condition_sex_rate', 'medium_account_rebate', 'medium_account_putting_count', 'mechanism_level']
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.cpm.data = res.data.sys_search_cpm
          this.normalFormItemMap.maxAgeLabel.data = res.data.fans_age_kuaishou_condition_age
          this.normalFormItemMap.maxPhoneLabel.data = res.data.daren_library_query_condition_phone
          this.normalFormItemMap.priceRange.data = res.data.sign_contract_account_price_range
          this.normalFormItemMap.fansRange.data = res.data.sign_contract_account_fans_range
          this.normalFormItemMap.sixRange.data = res.data.daren_library_query_condition_sex.map(item => ({ ...item, children: res.data.daren_library_query_condition_sex_rate }))
          this.normalFormItemMap.rebate.data = res.data.medium_account_rebate
          this.normalFormItemMap.accountUseCount.data = res.data.medium_account_putting_count
        }
      })
    },

    // 获取搜索数据
    getFilterData() {
      let platId = ''

      if (this.type === 'douyin') {
        platId = 25
      } else if (this.type === 'kuaishou') {
        platId = 26
      } else if (this.type === 'bilibili') {
        platId = 2
      } else if (this.type === 'xiaohongshu') {
        platId = 45
      }

      $getFilterData({ platId }).then((res) => {
        if (res.code === 1) {
          // this.normalFormItemMap.platId.data = res.data.plats || []
          this.normalFormItemMap.meetUserId.data = res.data.meetAccounts || []
          this.normalFormItemMap.tagNameList.data = res.data.tagValuesNew || []
          this.normalFormItemMap.mechanismId.data = res.data.belongs.map(item => ({ val: item.id, text: item.mcnName }))
          this.normalFormItemMap.accountContacts.data = res.data.accountContacts.map(item => ({ val: item, text: item }))
          this.normalFormItemMap.accountId.data = unique(res.data.accounts || [], 'accountId')
          this.optionsData.userList = [...res.data.editHeadUser]
        } else {
          this.$message.error(res.message)
        }
      })
      // $getFilterRange().then(res => {
      //   if (res.code === 1) {
      //     this.normalFormItemMap.fansRange.data = res.data.fansRange.map(item => ({ val: item, text: item }))
      //     this.normalFormItemMap.priceRange.data = res.data.priceRange.map(item => ({ val: item, text: item }))
      //     // this.normalFormItemMap.playRange.data = res.data.playRange.map(item => ({ val: item, text: item }))
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 弹窗打开
    dialogOpen() {
      if (this.addForm.provId) {
        this.provinceChange(this.addForm.provId, false)
      }
    },
    // 查看
    handleShow(row) {
      if ([25, 26].includes(row.platId)) {
       this.$router.push({
          path: `/details/account/${row.platId}/${row.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (row.platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else if (row.platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else {
        this.$router.push({
          path: '/order-account-detail',
          query: {
            accountId: row.accountId,
            accountName: row.accountName,
            type: 5,
            _blank: true
          }
        })
      }
    },
    // 编辑媒介账号-获取信息
    handleEdit(row) {
      this.editType = 'edit'
      this.isEdit = true
      this.accountId = row.accountId
      this.showDialog = true
    },

    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {
      switch (item.key) {
        case 'tagNameList':
          // element-ui cascader组件自身开启多选且选择只有一级的节点的bug，加入空值是为了触发自身机制使值显示正确
          if (val.length <= 1) {
            val.push('')
            model.tagNameList = val
          }
          break
        case 'provId':
          model.cityId = ''
          this.normalFormItemMap.cityId.data = []
          this.getArea(val).then(res => {
            if (res.code === 1) {
              this.normalFormItemMap.cityId.data = res.data
            } else {
              this.$message.error(res.message)
            }
          })
        break
        case 'platId':
          model.accountId = ''
          this.normalFormItemMap.accountId.data = []
          $getMedAccounts({ platId: val, methodId: 1 }).then(res => {
            this.normalFormItemMap.accountId.data = unique(res.data || [], 'accountId')
          })
        break
        case 'fansRange':
        case 'rebate':
        case 'priceRange':
          this.checkForm(item.key, val)
        break
      }
    },
    checkForm(key, val) {
      if (isUndef(val) || val === '') return true
      if (!this.regs[key].reg.test(val)) {
        // debugger
        this.$message.error(this.regs[key].message)
        return false
      } else {
        const [min, max] = val.split('-')
        if (isUndef(max) || max === '') return true
        if (Number(min) > Number(max)) {
          this.$message.error('最小值不能大于最大值')
          return false
        }
        if (this.regs[key].max && max > this.regs[key].max) {
          this.$message.error(`最大值不能超过${this.regs[key].max}`)
          return false
        }
      }
      return true
    },
    checkAllForm() {
      for (const key in this.regs) {
        if (!this.checkForm(key, this.searchData[key])) return false
      }
      return true
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      data = copy(data)
      this.searchData = Object.assign(this.searchData, data)
      if (!this.checkAllForm()) return
      if (this.searchData.rangeTime) {
        this.searchData.createTimeStart = this.searchData.rangeTime[0] + ' 00:00:00'
        this.searchData.createTimeEnd = this.searchData.rangeTime[1] + ' 23:59:59'
      } else {
        this.searchData.createTimeStart = ''
        this.searchData.createTimeEnd = ''
      }

      this.searchData.pageNum = 1
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }

      const cascader = ((((((this.$refs.search || {}).$children || [])[0] || {}).$children || [])[2] || {}).$children || [])[1] || ''
      if (cascader) {
        params.tagNameList = cascader.getCheckedNodes().map(item => {
          if (item.hasChildren) {
            return ''
          } else {
            return item.value
          }
        }).filter(item => item)
      }

      let url = ''

      if (this.type === 'douyin') {
        url = '/api/medium/tiktok/account/export'
      } else if (this.type === 'kuaishou') {
        url = '/api/medium/kuaishou/account/export'
      } else if (this.type === 'bilibili') {
        url = '/api/medium/bili/account/export'
      } else if (this.type === 'xiaohongshu') {
        url = '/api/medium/redBook/account/export'
      }
      // /api/business/foreign/medAccount/export
      delete params.platId
      location.href = `${url}?${qs.stringify(params)}&componentId=${this.$componentId}`
    },

    handleAddAccount() {
      this.editType = 'add'
      this.showDialog = true
      this.isEdit = false
    },
    // 删除账号
    handleDeletAccount(row) {
      if (row.accountUseCount > 0) {
        return this.$message.error('投放次数大于0的账号不可删除')
      }

      let request = ''

      if (this.type === 'douyin') {
        request = $deleteTiktokAccount
      } else if (this.type === 'kuaishou') {
        request = $deleteKuaishouAccount
      } else if (this.type === 'bilibili') {
        request = $deleteBilibiliAccount
      } else if (this.type === 'xiaohongshu') {
        request = $deleteRedbookAccount
      }

      request({ accountId: row.accountId }).then(res => {
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },

    getList() {
      this.loading = true
      const params = copy(this.searchData)
      console.log(params.priceRange)
      if (params.fansRange) {
        params.fansRange = params.fansRange.replaceAll('万', '0000')
      }
      if (params.priceRange) {
        params.priceRange = params.priceRange.replaceAll('万', '0000')
      }
      if (params.rebate) {
        params.rebate.replaceAll('%', '')
      }
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      if (params.sixRange) {
        params.maxSexLabel = params.sixRange[0]
        params.maxSexRate = params.sixRange[1]
        delete params.sixRange
      }

      let request = ''

      if (this.type === 'douyin') {
        request = $getTiktokAccountList
      } else if (this.type === 'kuaishou') {
        request = $getKuaishouAccountList
      } else if (this.type === 'bilibili') {
        request = $getBilibiliAccountList
      } else if (this.type === 'xiaohongshu') {
        request = $getRedbookAccountList
      }

      const cascader = ((((((this.$refs.search || {}).$children || [])[0] || {}).$children || [])[2] || {}).$children || [])[1] || ''
      if (cascader) {
        params.tagNameList = cascader.getCheckedNodes().map(item => {
          if (item.hasChildren) {
            return ''
          } else {
            return item.value
          }
        }).filter(item => item)
      }

      request(params).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.summaryItems = this.summaryItems.map(item => {
            item.val = res.data[item.key] || 0
            return item
          })
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },

    handleReplace() {
      this.$message.success('批量替换成功')
      this.replaceAccountDrawer = false
      this.getList()
    },

    handleReload() {
      this.getList()
    },

    // 列表选择
    handleListSelect(s) {
      this.checkAccountListIds = s.map(item => item.accountId)
    },
    // 更改账号状态
    hanleAccountStatus(row) {
      const accountIds = []
      const accountStatus = row.accountStatus
      accountIds.push(row.accountId)
      this.updateAccountStatus({ accountIds, accountStatus })
    },
    // 批量更新账号状态
    updateCheckAccountStatus(accountStatus) {
      if (this.checkAccountListIds.length === 0) {
        return this.$message.error('请选择要批量操作的数据')
      }
      this.updateAccountStatus({ accountIds: this.checkAccountListIds, accountStatus })
    },
    updateAccountStatus({ accountIds = [], accountStatus = 0 }) {
      let request = ''

      if (this.type === 'douyin') {
        request = $updateTiktokAccountStatus
      } else if (this.type === 'kuaishou') {
        request = $updateKuaishouAccountStatus
      } else if (this.type === 'bilibili') {
        request = $updateBilibiliAccountStatus
      } else if (this.type === 'xiaohongshu') {
        request = $updateRedbookAccountStatus
      }

      request({ accountStatus, accountIds }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },

    handleUpdate() {
      $getMediumOrgCondition().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.mechanismId.data = res.data.baseMcnInfos.map(item => ({ val: item.id, text: item.mcnName }))
        }
      })
    },
    getUserIdByMeduimOrgId(val) {
      $getUserIdByMeduimOrgId({ mechanismId: val }).then(res => {
        if (res.code === 1) {
          this.addForm.meetUserId = res.data
        }
      })
    },

    // 根据不同的账号状态，账号底板显示不同的颜色
    getTableRowClass({ row }) {
      // 解约状态
      if (row.coopStatus === 1) {
        return 'yellow-row'
      } else if (row.coopStatus === 2) { // 拉黑状态
        return 'red-row'
      }
      return ''
    }
  }
}
</script>
<style scoped lang='scss'>
.add-form {
  .plat-info {
    margin-top: 10px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .input-new-tag {
    width: 120px;
  }
  .the-tag {
    margin: 0 4px 0 0;
  }
  .dialog-footer {
    text-align: center;
  }
}

.price {
  text-align: left;

  p {
    span:nth-child(1) {
      display: inline-block;
      width: 74px;
    }
  }
}

.ksPrice {
  text-align: center;
}

::v-deep {
  .el-cascader__search-input {
    display: none;
  }

  .el-table {
    .yellow-row {
      background-color: rgb(228, 244, 153);
    }

    .red-row {
      background-color: rgb(246, 181, 181);
    }
  }
}
</style>
<style lang="scss">

</style>
