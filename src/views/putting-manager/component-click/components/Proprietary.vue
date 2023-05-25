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
                  :clearable="false"
                />
              </el-form-item>
            </div>
          </div>
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <Statistics v-loading="loading" class="statistics" :data="summaryItems" />
    </wrap>
    <wrap class="table-view m-t-24">
      <div class="checkbox-view m-b-16">
        <el-checkbox
          v-for="item in extFields"
          :key="item.fieldName"
          v-model="item.status"
          :label="item.fieldName"
        >{{ item.chnName }}</el-checkbox>
      </div>
      <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
        <el-table-column
          prop="orderInfo"
          label="平台订单信息"
          width="340"
          align="left"
        >
          <template slot-scope="{ row }">
            <AccountCard
              :info="row"
              :options="{ imgUrl: 'avatarUri', name: 'accountName' }"
            >
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
        <el-table-column
          prop="platPrice"
          label="平台消耗金额"
          sortable="custom"
        />
        <el-table-column prop="price" label="投放价格" sortable="custom" />
        <el-table-column label="视频信息" width="500" align="left">
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
                    组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}
                  </p>
                  <div class="info-text info-p">
                    <span
                      class="info-text"
                    >编辑人员：{{
                      row.editUserName ? row.editUserName : '未选择'
                    }}</span>
                    <span
                      class="info-text"
                    >剪辑人员：{{
                      row.cutUserName ? row.cutUserName : '未选择'
                    }}</span>
                  </div>
                </template>
              </VideoList>
              <VideoInfo
                v-if="row.videoInfo && row.videoInfo.videoTitle"
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
                <p>组件类型：{{ row.linkUseType ? row.linkUseType : '--' }}</p>
                <div class="info-text info-p">
                  <span
                    class="info-text"
                  >编辑人员：{{
                    row.editUserName ? row.editUserName : '未选择'
                  }}</span>
                  <span
                    class="info-text"
                  >剪辑人员：{{
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
          sortable="custom"
          prop="spreadLike"
          label="点赞数"
        />
        <el-table-column prop="cpm" label="CPM" sortable="custom">
          <template slot-scope="{ row }"> {{ row.cpm | toThousands }}</template>
        </el-table-column>
        <el-table-column
          prop="componentClickCount"
          label="组件点击量"
          sortable="custom"
        />
        <el-table-column
          prop="componentClicknewActive"
          label="新增激活"
          sortable="custom"
        >
          <template slot-scope="{ row }">{{
            row.componentClicknewActive | toThousands
          }}</template>
        </el-table-column>
        <el-table-column prop="cpa" label="CPA" sortable="custom">
          <template slot-scope="{ row }"> {{ row.cpa | toThousands }}</template>
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
          width="120"
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
          width="120"
          label="B2C手机净支付数量"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.b2cPhoneNetPayOrderCount === null ? '--' : row.b2cPhoneNetPayOrderCount }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="$permission('component_click_self_detail')"
          label="操作"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <IconTip
              content="查看详情"
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
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getProprietaryList"
        />
      </div>
    </wrap>
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
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { copy } from '@/utils'
import {
  $getProprietaryFundOrgId,
  $getSelfAccount,
  $getBasePlatInfo
} from '@/api/bussiness-manage'
import { $getAccontByOrgIdOrPlatId } from '@/api/military-manage'
import { $getProprietaryList } from '@/api/proprietary-orders'

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
    accountSelect
  },
  setup() {
    const { $permission, $router, $message, $refs, $nextTick, $set } =
      getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: $permission('export_code_propriety')
    })
    const summaryItems = ref([
      {
        key: 'orderCount',
        val: 0,
        text: '订单量'
      },
      {
        key: 'priceCount',
        val: 0,
        text: '投放价格'
      },
      {
        key: 'flowCount',
        val: 0,
        text: '流量'
      },
      {
        key: 'cpmCount',
        val: 0,
        text: 'CPM',
        tip: 'CPM=投放价格/（流量/1000）'
      },
      {
        key: 'componentClickNewActiveCount',
        val: 0,
        text: '新增激活',
        tip: '2022年8月2日快手改为曝光口径'
      },
      {
        key: 'cpaCount',
        val: 0,
        text: 'CPA',
        tip: 'CPA=投放价格/新增激活'
      },
      {
        key: 'c2bReceiverCount',
        val: 0,
        text: 'C2B总收件量'
      },
      {
        key: 'b2cPayOrderCount',
        val: 0,
        text: 'B2C手机净支付数量'
      }
    ])

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
      loading: false
    })
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
      return $getProprietaryList({
        ...params,
        platOwner: '自营'
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            summaryItems.value.forEach((item) => {
              item.val = (res.data.dataStatics || [])[item.key]
            })
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
        const item = list.find(item => item.accountId === params.accountId) || {}
        params.accountName = item.accountName
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
      Object.assign(searchData.value, params)
      editAndCut(searchData.value)
      getProprietaryList()
    }
    const onExport = (data) => {
      const propertyNameList = []
      for (const key in states.extFields) {
        if (!states.extFields[key].status) {
          propertyNameList.push(key)
        }
      }
      const params = formatData(Object.assign({}, searchData.value, data))
      editAndCut(params)
      window.open(
        `/api/delivery/app/self/export?${qs.stringify({
          ...formatAccount(params),
          propertyNameList: [...new Set(propertyNameList)]
        })}`
      )
    }
    getAccontByOrgIdOrPlatId()
    getProprietaryFundOrgId()
    getBasePlatInfo()
    buildFormConf()
    getSelfAccount()
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
      summaryItems,
      doSort,
      getProprietaryList,
      handleGoDetail,
      normalFormItemMap
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
