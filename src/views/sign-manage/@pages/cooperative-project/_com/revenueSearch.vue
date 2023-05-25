<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
    @export="onExport"
    @change="onChange"
  >
    <template v-if="tabName === 'detail'" v-slot:prv="target">
      <el-form-item>
        <el-select
          v-model="target.model.projectType"
          multiple
          collapse-tags
          placeholder="订单类型"
          :clearable="true"
        >
          <!--  @change="handleProjectType" -->
          <el-option
            v-for="item in projectTypeList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
          <!-- :disabled="isDisabled && ['2', '3'].includes(item.dictValue)" -->
        </el-select>
      </el-form-item>
      <!--  v-if="showWorkStatus" -->
      <el-form-item>
        <el-select
          v-model="target.model.workerStatusList"
          placeholder="工单状态"
          :clearable="true"
          multiple
          collapse-tags
          @change="handleWorkerStatus"
        >
          <el-option
            v-for="item in workerList"
            :key="item.id"
            :label="item.text"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </template>
    <template v-slot:normal="target">
      <template v-if="tabName==='revenue'">
        <el-form-item v-if="$permission('achievements_month')" label="绩效年月">
          <el-date-picker
            v-model="target.model.performanceMonth"
            type="monthrange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM"
            value-format="yyyy-MM"
          />
        </el-form-item>
      </template>
      <el-form-item label="已定档期">
        <el-date-picker
          v-model="target.model.schedulingTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item label="视频发布日期">
        <el-date-picker
          v-model="target.model.monthTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <template v-if="tabName === 'detail'">
        <el-form-item label="订单创建时间">
          <el-date-picker
            v-model="target.model.orderTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </template>
    </template>
    <template v-slot:btns>
      <el-link
        v-if="tabName === 'revenue' && $permission('month_payments')"
        type="primary"
        :underline="false"
        @click="handleShowMonth"
      >设置月度收支</el-link>

      <el-checkbox v-if="tabName === 'detail'" v-model="haoLaiWuOrder" class="m-r-10 m-l-10" true-label="1" false-label="0" @change="handleChangeShield">好莱坞工单</el-checkbox>
      <el-checkbox v-if="tabName === 'detail'" v-model="wuHeBiaoJiuOrder" class="m-l-4" true-label="1" false-label="0" @change="handleChangeShield">五合镖局工单</el-checkbox>
    </template>
  </Search>
</template>
<script>
import { Search } from 'components'
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  toRefs
} from '@vue/composition-api'
import { copy, getMonthStartEnd } from '@/utils'
import dayjs from 'dayjs'
import { $getDataByDictType } from '@/api/index.js'
import {
  $getSignAgents,
  $getProjectSearchList,
  $getMoreSignMedAccounts
} from '@/api/sign-contract'
export default defineComponent({
  props: {
    tabName: {
      type: String,
      default: 'detail'
    }
  },
  components: { Search },
  setup(props, { emit }) {
    const { $permission, $nextTick, $set, $refs } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport:
        // props.tabName === 'detail' && $permission('project_detail_export')
        props.tabName === 'detail' && $permission('manager_export')
    })
    const states = reactive({
      signTeamList: [],
      workerList: [
        {
          text: '商业信息待录入',
          id: 0
        },
        {
          text: '待履约',
          id: 1
        },
        {
          text: '已履约',
          id: 2
        },
        {
          text: '已核账',
          id: 3
        },
        {
          text: '撤单',
          id: 4
        }
      ],
      projectTypeList: [],
      params: {},
      haoLaiWuOrder: '',
      wuHeBiaoJiuOrder: '',
      // showWorkStatus: true,
      isDisabled: false
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          tabName: 'revenue',
          type: 'select',
          key: 'projectType',
          data: [],
          conf: {
            placeholder: '订单类型',
            multiple: true
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'businessGroupIdList',
          data: [],
          conf: {
            placeholder: '选择商务小组',
            multiple: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'id',
          data: [],
          conf: {
            placeholder: '选择签约团队'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id',
          permissionName: 'contract_team'
        },
        {
          type: 'select',
          key: 'signGroupId',
          data: [],
          conf: {
            placeholder: '选择签约小组'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'contract_group'
        },
        {
          type: 'select',
          key: 'signUserId',
          data: [],
          conf: {
            placeholder: '选择签约经纪人',
            multiple: true
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          permissionName: 'signing_agent'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '平台',
            multiple: true
          }
        },
        {
          tabName: 'detail',
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '账号名称'
          }
        },
        {
          type: 'select',
          key: 'joinMcnFlag',
          data: [
            { joinMcnFlag: 1, McnName: '是' },
            { joinMcnFlag: 0, McnName: '否' }
          ],
          conf: {
            placeholder: '是否加入乾派MCN'
          },
          optionLabelKey: 'McnName',
          optionValKey: 'joinMcnFlag'
        },
        {
          tabName: 'detail',
          type: 'select',
          key: 'release',
          data: [
            { release: 1, releaseName: '已发布' },
            { release: 0, releaseName: '未发布' }
          ],
          conf: {
            placeholder: '视频是否已发布'
          },
          optionLabelKey: 'releaseName',
          optionValKey: 'release'
        },
        {
          tabName: 'detail',
          type: 'select',
          key: 'contentAssist',
          data: [
            {
              dictLabel: '需要',
              dictValue: 1
            }
          ],
          conf: {
            placeholder: '是否需要内容协助'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          tabName: 'detail',
          type: 'input',
          key: 'projectName',
          conf: {
            placeholder: '订单名称',
            maxLength: 30
          }
        },
        {
          tabName: 'detail',
          type: 'input',
          key: 'workId',
          conf: {
            placeholder: '工单号或商单号',
            maxLength: 30
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        if (
          (item.permissionName && !$permission(item.permissionName)) ||
          (item.tabName && item.tabName !== props.tabName)
        ) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })

      formConf.normal = normal
      console.log(formConf.normal)
    }
    $nextTick(() => {
      const time = getMonthStartEnd()
      $set($refs.search.form, 'schedulingTime', [`${time.firstDay}`, `${time.lastDay}`])
      if (props.tabName === 'revenue') {
        const performanceMonth = dayjs().format('YYYY-MM')
        $set($refs.search.form, 'performanceMonth', [
          `${performanceMonth}`,
          `${performanceMonth}`
        ])
      }
    })
    const getProjectTypeList = async() => {
      $getDataByDictType({ dictTypes: ['sign_contract_project_type'] }).then(
        (res) => {
          if (res.code === 1) {
            if (normalFormItemMap.projectType) {
              normalFormItemMap.projectType.data =
                res.data.sign_contract_project_type
            }
            states.projectTypeList = res.data.sign_contract_project_type
          }
        }
      )
    }
    // 根据签约小组查询经纪人
    const getSignAgents = (val) => {
      $getSignAgents({ orgId: val }).then((res) => {
        if (res && res.code === 1) {
          normalFormItemMap.signUserId.data = res.data
        }
      })
    }
    const getProjectSearchList = () => {
      $getProjectSearchList().then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.businessGroupIdList.data = res.data.businessInfoList
          if (normalFormItemMap.id && res.data.signGroupInfoList) {
            normalFormItemMap.id.data = res.data.signGroupInfoList
          }
          if (normalFormItemMap.signUserId) {
            normalFormItemMap.signUserId.data = res.data.signUserList
          }
          if (normalFormItemMap.platId) {
            normalFormItemMap.platId.data = res.data.plats
          }
          if (!$permission('contract_team') && normalFormItemMap.signGroupId) {
            normalFormItemMap.signGroupId.data = res.data.signTeamList
          }
          states.signTeamList = res.data.signTeamList
        }
      })
    }
    const getMoreSignMedAccounts = (platId) => {
      $getMoreSignMedAccounts({ platList: platId }).then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.accountId.data = (res.data || []).filter(
            (item) => item
          )
        }
      })
    }
    const onChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'id': // 签约团队
          model.signGroupId = ''
          normalFormItemMap.signGroupId.data = states.signTeamList.filter(
            (item) => {
              if (item.parentId === val) return item
            }
          )
          getSignAgents(val)
          break
        case 'signGroupId': // 签约小组
          model.signUserId = ''
          getSignAgents(val)
          break
        case 'platId': // 签约小组
          if (props.tabName !== 'detail') return
          model.accountId = ''
          normalFormItemMap.accountId.data = []
          getMoreSignMedAccounts(val)
          break
      }
    }
    const formatSearchData = (data) => {
      const params = copy(data)
      params.signGroupId = params.signGroupId || params.id || ''
      delete params.id
      if (params.monthTime) {
        params.addTimeStart = params.monthTime[0]
        params.addTimeEnd = params.monthTime[1] + ' 23:59:59'
      } else {
        params.addTimeStart = ''
        params.addTimeEnd = ''
      }

      if (params.schedulingTime) {
        params.scheduledBegin = params.schedulingTime[0]
        params.scheduledEnd = params.schedulingTime[1] + ' 23:59:59'
        params.empty = false
      } else {
        params.scheduledBegin = ''
        params.scheduledEnd = ''
        params.empty = true
      }
      if (props.tabName === 'revenue') {
        if (params.performanceMonth) {
          params.startTime = params.performanceMonth[0]
          params.endTime = params.performanceMonth[1]
          params.performance = false
        } else {
          params.startTime = ''
          params.endTime = ''
          params.performance = true
        }
      }
      if (props.tabName === 'detail') {
        if (params.orderTime) {
          params.createdTimeStart = params.orderTime[0]
          params.createdTimeEnd = params.orderTime[1] + ' 23:59:59'
        } else {
          params.createdTimeStart = ''
          params.createdTimeEnd = ''
        }

        params.haoLaiWuOrder = states.haoLaiWuOrder
        params.wuHeBiaoJiuOrder = states.wuHeBiaoJiuOrder
      }
      if (params.signUserId) {
        params.signUserIdList = params.signUserId
        delete params.signUserId
      }
      delete params.orderTime
      delete params.monthTime
      delete params.schedulingTime
      delete params.performanceMonth
      states.params = params

      return params
    }
    const onSubmit = (data) => {
      console.log(formatSearchData(data))
      emit('onSubmit', formatSearchData(data))
    }

    const onExport = (data) => {
      emit('onExport', formatSearchData(data))
    }
    const handleShowMonth = () => {
      emit('onMonthPayment')
    }
    const handleWorkerStatus = (val) => {
      if (val) {
        states.isDisabled = true
      } else {
        states.isDisabled = false
      }
    }

    const handleChangeShield = () => {
      emit('onSubmit', { ...states.params, haoLaiWuOrder: states.haoLaiWuOrder, wuHeBiaoJiuOrder: states.wuHeBiaoJiuOrder })
    }

    buildFormConf()
    props.tabName === 'detail' && getMoreSignMedAccounts('')
    getProjectTypeList()
    getProjectSearchList()
    return {
      formConf,
      onSubmit,
      onExport,
      onChange,
      handleShowMonth,
      normalFormItemMap,
      handleWorkerStatus,
      handleChangeShield,
      // handleProjectType,
      ...toRefs(states)
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-link {
    margin-left: 16px;
  }
}
</style>
