<template>
  <div>
    <div class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:prv="target">
          <el-form-item>
            <el-select
              v-model="target.model.accountStatus"
              placeholder="账号状态"
              clearable
            >
              <el-option
                v-for="item in AccountStatusList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-cascader
              ref="cascader"
              v-model="target.model.tagNameList"
              class="cascader"
              placeholder="达人类型"
              :options="((normalFormItemMap || {}).tagNameList || {}).data"
              :props="{
                multiple: true,
                value: 'tagName',
                label: 'tagName',
                children: 'childNodeTags'
              }"
              collapse-tags
              clearable
              @change="handleChangeCascader"
            />
          </el-form-item>

          <el-form-item v-if="type === 'other'">
            <el-select
              v-model="target.model.platId"
              placeholder="平台"
              clearable
              @change="handleChangePlat"
            >
              <el-option
                v-for="item in ((normalFormItemMap || {}).platList || {}).data"
                :key="item.platId"
                :label="item.platName"
                :value="item.platId"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:normal="target">
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input
                v-model="target.model.fansStart"
                type="number"
                :min="0"
                :max="100000000"
                placeholder="粉丝量最小值"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="target.model.fansEnd"
                type="number"
                :min="0"
                :max="100000000"
                placeholder="粉丝量最大值"
              />
            </div>
          </el-form-item>
          <el-form-item label="问询时间">
            <el-date-picker
              v-model="target.model.inquiryTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
            <IconTip
              width="300"
              trigger="hover"
              content="问询时间：指账号被商务添加为商机的推荐账号的时间"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </template>
      </Search>
    </div>
    <div>
      <el-checkbox-group v-model="checkTableRow" class="checkbox">
        <template v-if="type === 'douyin'">
          <el-checkbox label="oversixtySecondPrice">60s+报价</el-checkbox>
          <el-checkbox label="quotePrice">21-60s报价</el-checkbox>
          <el-checkbox label="twentySecondPrice">1-20s报价</el-checkbox>
          <!-- <el-checkbox label="livePrice">直播报价</el-checkbox> -->
          <el-checkbox label="netPrice">全网报价</el-checkbox>
        </template>

        <template v-if="type === 'kuaishou'">
          <el-checkbox label="quotePrice">达人报价</el-checkbox>
          <el-checkbox label="netPrice">全网报价</el-checkbox>
        </template>

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

      <el-radio-group v-model="searchData.opportunitySwitch" @change="handleChangeOpportunitySwitch">
        <el-radio :label="1">新版商机问询数据</el-radio>
        <el-radio :label="0">旧版商机问询数据</el-radio>
      </el-radio-group>

      <VTable
        ref="table"
        :source="'myOperate'"
        :search-data="searchData"
        :inquiry-time="inquiryTime"
        :type="type"
        :check-table-row-show="checkTableRowShow"
      />
    </div>
  </div>
</template>
<script>
import { Search, IconTip } from 'components'
import { getCurrentInstance, reactive, toRefs, ref, computed } from '@vue/composition-api'
import { lego } from '@zz-common/lego'
import {
  $getAccountInfoOp,
  $getTiktokCondition,
  $getKuaishouCondition,
  $getBilibiliCondition,
  $getRedbookCondition
} from '@/api/operating-manage'
import VTable from '../Table'
import { commonData } from '../../../_com/hooks'
import qs from 'qs'
import {
  responseSpeedOptions,
  cooperationOptions,
  contentCreativeOptions
} from '../../../../@common/scoreOptions'

export default {
  components: {
    Search,
    VTable,
    IconTip
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { $refs, $nextTick, $set, $permission } = getCurrentInstance().proxy
    const { AccountStatusList, formatData } = commonData()
    const formConf = reactive({
      normal: [],
      // hasExport: true
      hasExport: $permission('manager_export')
    })

    let defaultCheckTableRow = ''
    if (props.type === 'douyin') {
      defaultCheckTableRow = ['quotePrice']
    } else if (props.type === 'kuaishou') {
      defaultCheckTableRow = ['quotePrice']
    } else if (props.type === 'bilibili') {
      defaultCheckTableRow = ['customVideoPrice']
    } else if (props.type === 'xiaohongshu') {
      defaultCheckTableRow = ['videoPrice']
    } else if (props.type === 'other') {
      defaultCheckTableRow = ['']
    }

    const states = reactive({
      accountList: [],
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      inquiryTime: []
    })

    const normalFormItemMap = reactive({
      tagNameList: {
        type: 'select',
        key: 'tagNameList',
        data: [],
        conf: {
          placeholder: '达人类型',
          clearable: true,
          filterable: true
        }
      },
      platList: {
        type: 'select',
        key: 'platId',
        data: [],
        conf: {
          placeholder: '平台',
          clearable: true,
          filterable: true
        }
      }
    })

    const checkTableRow = ref(defaultCheckTableRow)

  // () {
  //     return this.checkTableRow.reduce((n, t) => {
  //       n[t] = true
  //       return n
  //     }, {})
  //   },

    const checkTableRowShow = computed(() => {
      return checkTableRow.value.reduce((n, t) => {
        n[t] = true
        return n
      }, {})
    })

    const searchData = ref({
      platId: '',
      pageNum: 1,
      tagNameList: [],
      opportunitySwitch: 1
    })

    const buildFormConf = () => {
      let normal = [
        // {
        //   type: 'select',
        //   key: 'accountStatus',
        //   data: AccountStatusList,
        //   conf: {
        //     placeholder: '账号状态'
        //   },
        //   optionLabelKey: 'dictLabel',
        //   optionValKey: 'dictValue'
        // },
        // {
        //   type: 'cascader',
        //   key: 'tagNameList',
        //   data: [],
        //   conf: {
        //     placeholder: '达人类型',
        //     props: {
        //       multiple: true,
        //       value: 'tagName',
        //       label: 'tagName',
        //       children: 'childNodeTags'
        //     },
        //     collapseTags: true
        //   },
        //   optionLabelKey: 'tagName',
        //   optionValKey: 'tagName'
        // },
        // {
        //   type: 'select',
        //   key: 'platId',
        //   data: [],
        //   optionLabelKey: 'platName',
        //   optionValKey: 'platId',
        //   conf: {
        //     placeholder: '平台'
        //   }
        // },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '账号'
          }
        },
        {
          type: 'select',
          key: 'responseSpeedScore',
          data: responseSpeedOptions,
          conf: {
            placeholder: '响应速度',
            clearable: true
          },
          optionValKey: 'value',
          optionLabelKey: 'label'
        },
        {
          type: 'select',
          key: 'cooperationScore',
          data: cooperationOptions,
          conf: {
            placeholder: '配合度',
            clearable: true
          },
          optionValKey: 'value',
          optionLabelKey: 'label'
        },
        {
          type: 'select',
          key: 'contentCreativeScore',
          data: contentCreativeOptions,
          conf: {
            placeholder: '内容创意',
            clearable: true
          },
          optionValKey: 'value',
          optionLabelKey: 'label'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }

    const onSearchChange = (val, item, type, index, model) => {
    }

    const handleChangeCascader = (val) => {
      if (val.length <= 1) {
        val.push('')
        $set($refs.search.form, 'tagNameList', val)
        searchData.value = {
          ...searchData.value,
          tagNameList: val
        }
      }
    }

    const handleChangePlat = (val) => {
      $set($refs.search.form, 'accountId', 0)
      searchData.value = {
        ...searchData.value,
        accountId: 0
      }
      normalFormItemMap.accountId.data = []
      getAccountInfoOp(val)
    }

    const getAccountInfoOp = (id = '') => {
      $getAccountInfoOp({ platId: id })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data.accountInfoBOList || []
            normalFormItemMap.tagNameList.data = res.data.sysPlatTagTree || []
            normalFormItemMap.platList.data = res.data.platQueryVOS || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    const getCondition = async() => {
      let request = ''
      const { type } = props
      if (type === 'douyin') {
        request = $getTiktokCondition
      } else if (type === 'kuaishou') {
        request = $getKuaishouCondition
      } else if (type === 'bilibili') {
        request = $getBilibiliCondition
      } else if (type === 'xiaohongshu') {
        request = $getRedbookCondition
      } else {
        return
      }

      const { code, data } = await request()
      if (+code === 1) {
        normalFormItemMap.accountId.data = data.accountInfoBOList || []
        normalFormItemMap.tagNameList.data = data.sysPlatTagTree || []
      }
    }

    const handleGetList = () => {
      $nextTick(() => {
        $refs.table.getList('myApplication')
      })
    }

    const handleChangeOpportunitySwitch = () => {
      handleGetList()
    }

    const onSubmit = (data) => {
      states.inquiryTime = data.inquiryTime
      const params = formatData(data)

      if ($refs.cascader) {
        params.tagNameList = $refs.cascader.getCheckedNodes().map(item => {
          if (item.hasChildren) {
            return ''
          } else {
            return item.value
          }
        }).filter(item => item)
      }

      Object.assign(searchData.value, params)

      let inquiryTime = ''
      if (searchData.value.inquireTimeStart) {
        inquiryTime = [searchData.value.inquireTimeStart, searchData.value.inquireTimeEnd].join(',')
      }

      lego.send({
        appid: 'ZHUANZHUAN',
        pagetype: `data.qpmcn.com-operations-management-studio-operate-accounts?type=my`,
        actiontype: 'STUDIO_OPERATE_ACCOUNTS',
        abtesttype: 'ALL',
        lon: 0,
        lat: 0,
        ua: window.navigator.userAgent.toLowerCase(),
        os: '',
        backup: {
          inquiryTime
        }
      })

      handleGetList()
    }
    const onExport = (data) => {
      states.inquiryTime = data.inquiryTime
      const params = formatData(data)

      if ($refs.cascader) {
        params.tagNameList = $refs.cascader.getCheckedNodes().map(item => {
          if (item.hasChildren) {
            return ''
          } else {
            return item.value
          }
        }).filter(item => item)
      }

      searchData.value = Object.assign(searchData.value, params)

      let url = ''

      if (props.type === 'douyin') {
        url = '/api/account/operate/tiktok/selfAccount/exportSelfAccountList'
      } else if (props.type === 'kuaishou') {
        url = '/api/account/operate/kuaishou/selfAccount/exportSelfAccountList'
      } else if (props.type === 'bilibili') {
        url = '/api/account/operate/bli/selfAccount/exportSelfAccountList'
      } else if (props.type === 'xiaohongshu') {
        url = '/api/account/operate/redbook/selfAccount/exportSelfAccountList'
      } else if (props.type === 'other') {
        url = '/api/account/operate/op/selfAccount/exportSelfAccountList'
      }

      window.open(
        `${url}?${qs.stringify({
          ...searchData.value
        })}`
      )
    }

    getCondition()
    buildFormConf()

    props.type === 'other' && getAccountInfoOp()

    $nextTick(() => {
      $set($refs.search.form, 'accountStatus', 0)
      searchData.value = {
        ...searchData.value,
        accountStatus: 0
      }

      $nextTick(() => {
        handleGetList()
      })
    })
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      getAccountInfoOp,
      onExport,
      handleChangePlat,
      handleChangeCascader,
      AccountStatusList,
      normalFormItemMap,
      checkTableRow,
      checkTableRowShow,
      onSearchChange,
      handleChangeOpportunitySwitch
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-cascader__search-input {
    display: none;
  }
}

.checkbox {
  display: inline-block;
  margin-right: 30px;
}
</style>
