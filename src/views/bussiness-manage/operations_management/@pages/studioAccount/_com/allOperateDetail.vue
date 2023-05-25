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
        <template v-slot:normal="target">
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input
                v-model="target.model.fansBegin"
                type="number"
                placeholder="粉丝量最小值"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="target.model.fansEnd"
                type="number"
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
        :source="'allOperate'"
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
import { lego } from '@zz-common/lego'
import { getCurrentInstance, reactive, toRefs, ref, computed } from '@vue/composition-api'
import {
  $getStudioAccounts,
  $getOperatorName,
  $getOrgList,
  $getTiktokGroupCondition,
  $getKuaishouGroupCondition,
  $getBilibiliGroupCondition,
  $getRedbookGroupCondition,
  $getGroupAccountInfoOp
} from '@/api/operating-manage'
import { $getPlatCondition } from '@/api'
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
    const { formatData, AccountStatusList } = commonData()
    const formConf = reactive({
      normal: [],
      // hasExport: true
      hasExport: $permission('manager_export')
    })
    const states = reactive({
      accountList: [],
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      inquiryTime: []
    })

    const searchData = ref({
      platId: '',
      pageNum: 1,
      opportunitySwitch: 1
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

    const checkTableRow = ref(defaultCheckTableRow)

    const checkTableRowShow = computed(() => {
      return checkTableRow.value.reduce((n, t) => {
        n[t] = true
        return n
      }, {})
    })

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'orgId',
          data: [],
          conf: {
            placeholder: '工作室'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'operatorId',
          data: [],
          conf: {
            placeholder: '运营负责人'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'accountStatus',
          data: AccountStatusList,
          conf: {
            placeholder: '账号状态'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
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
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '平台',
            hidden: props.type !== 'other'
          }
        },
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
      if (item.key === 'tagNameList') {
        if (val.length <= 1) {
          val.push('')
          model.tagNameList = val
        }
      }
      if (item.key === 'platId') {
        model.accountId = ''
        normalFormItemMap.accountId.data = []
        getGroupAccountInfoOp(val)
      }
      if (item.key === 'orgId') {
        model.operatorId = ''
        normalFormItemMap.operatorId.data = []
        getOperatorName(val)
      }
    }

    const getGroupAccountInfoOp = (id = '') => {
      $getGroupAccountInfoOp({ platId: id })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data.accountInfoBOList || []
            normalFormItemMap.tagNameList.data = res.data.sysPlatTagTree || []
            normalFormItemMap.platId.data = res.data.platQueryVOS || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    // const getPlatCondition = () => {
    //   $getPlatCondition({ ...states.config })
    //     .then((res) => {
    //       if (res.code === 1) {
    //         normalFormItemMap.platId.data = res.data || []
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //     })
    // }
    // const getStudioAccounts = (id = '') => {
    //   $getStudioAccounts({ platId: id })
    //     .then((res) => {
    //       if (res.code === 1) {
    //         normalFormItemMap.accountId.data = res.data || []
    //       }
    //     })
    //     .catch((err) => {
    //       console.error(err)
    //     })
    // }
    const getOperatorName = (orgId = '') => {
      $getOperatorName({ orgId }).then(res => {
        normalFormItemMap.operatorId.data = res.data || []
      })
      .catch((err) => {
          console.error(err)
        })
    }
    const getOrgList = () => {
      $getOrgList().then(res => {
        normalFormItemMap.orgId.data = res.data
      })
      .catch((err) => {
          console.error(err)
        })
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

      const cascader = ((((($refs.search || {}).$children || [])[0] || {}).$children || [])[3] || {}).$children[1]
      if (cascader) {
        params.tagNameList = cascader.getCheckedNodes().map(item => {
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
        pagetype: `data.qpmcn.com-operations-management-studio-operate-accounts?type=all`,
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

      const cascader = ((((($refs.search || {}).$children || [])[0] || {}).$children || [])[3] || {}).$children[1]
      if (cascader) {
        params.tagNameList = cascader.getCheckedNodes().map(item => {
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
        url = '/api/account/operate/tiktok/groupAccount/exportGroupAccountList'
      } else if (props.type === 'kuaishou') {
        url = '/api/account/operate/kuaishou/groupAccount/exportGroupAccountList'
      } else if (props.type === 'bilibili') {
        url = '/api/account/operate/bli/groupAccount/exportGroupAccountList'
      } else if (props.type === 'xiaohongshu') {
        url = '/api/account/operate/redbook/groupAccount/exportGroupAccountList'
      } else if (props.type === 'other') {
        url = '/api/account/operate/op/groupAccount/exportGroupAccountList'
      }

      window.open(
        `${url}?${qs.stringify({
          ...searchData.value
        })}`
      )
    }

    const getCondition = async() => {
      let request = ''
      const { type } = props
      if (type === 'douyin') {
        request = $getTiktokGroupCondition
      } else if (type === 'kuaishou') {
        request = $getKuaishouGroupCondition
      } else if (type === 'bilibili') {
        request = $getBilibiliGroupCondition
      } else if (type === 'xiaohongshu') {
        request = $getRedbookGroupCondition
      } else {
        return
      }

      const { code, data } = await request()
      if (+code === 1) {
        normalFormItemMap.accountId.data = data.accountInfoBOList || []
        normalFormItemMap.tagNameList.data = data.sysPlatTagTree || []
      }
    }

    getCondition()
    buildFormConf()
    getOrgList()
    // getPlatCondition()
    // getStudioAccounts()
    getOperatorName()

    props.type === 'other' && getGroupAccountInfoOp()

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
    handleGetList()
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      onExport,
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
