<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      >
        <template v-slot:prv="target">
          <el-form-item prop="signGroupId">
            <el-select
              v-model="target.model.signGroupId"
              placeholder="选择签约团队"
              :clearable="true"
              filterable
              @change="handleChangeSignGroup"
            >
              <el-option
                v-for="item in signGroupList"
                :key="item.id"
                :label="item.orgName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="signTeamId">
            <el-select
              v-model="target.model.signTeamId"
              placeholder="选择签约小组"
              filterable
              :clearable="true"
            >
              <el-option
                v-for="item in signTeamList"
                :key="item.orgId"
                :label="item.orgName"
                :value="item.orgId"
              />
            </el-select>
          </el-form-item>
          <el-form-item prop="signUserId">
            <el-select
              v-model="target.model.signUserId"
              filterable
              placeholder="选择签约经纪人"
              :clearable="true"
            >
              <el-option
                v-for="item in signUserList"
                :key="item.userId"
                :label="item.realname"
                :value="item.userId"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:normal="target">
          <div>
            <el-form-item label="最近沟通时间" prop="lastChatTime">
              <el-date-picker
                v-model="target.model.lastChatTime"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="绑定时间" prop="bindTime">
              <el-date-picker
                v-model="target.model.bindTime"
                :picker-options="pickerOptions"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </div>
        </template>
      </Search>
    </wrap>

    <wrap class="m-t-24">
      <Statistics
        ref="summary"
        v-loading="loading"
        class="statistics data-wrap"
        :data="detailStatistics"
      />
    </wrap>

    <wrap class="table-view m-t-24">
      <div class="flex flex-justify-end">
        <el-button
          v-if="$permission('add_prepare_button') && (+did == 947 || +did === 57)"
          class="m-b-10"
          icon="el-icon-circle-plus-outline"
          size="small"
          type="primary"
          @click="handleAddClick"
        >添加预备签约达人</el-button>
      </div>
      <Table ref="table" :search-data="searchData" :table-data="tableData" :data-total="total" :loading="loading" @getAll="handleGetList" />
    </wrap>

    <RemarkDialog v-if="showRemarkDialog" :show="showRemarkDialog" @onClose="showRemarkDialog = false" @getAll="handleGetList" />
  </div>
</template>

<script>
import { getMonthStartEnd, dateFormat } from '@/utils'
import { defineComponent, reactive, getCurrentInstance, toRefs, ref } from '@vue/composition-api'
import { Search, Statistics, AccountCard } from 'components'
import { $getSignAgents } from '@/api/sign-contract'
import { $getSignContractOrderCondition, $getList } from '@/api/sign-progress'
import qs from 'qs'
import Table from './SignProgressTable.vue'
import RemarkDialog from './components/RemarkDialog'

export default defineComponent({
  components: {
    Search,
    Statistics,
    AccountCard,
    Table,
    RemarkDialog
  },
  setup(props) {
    const { $permission, $nextTick, $refs, $store, $message, $set } = getCurrentInstance().proxy

    const formConf = reactive({
      normal: [],
      // hasExport: $permission('sign_progress_export')
      hasExport: $permission('manager_export')
    })
    const states = reactive({
      signTeamList: []
    })

    const searchData = ref({})

    const data = reactive({
      loading: false,
      detailStatistics: [
        {
          key: 'total',
          val: '--',
          text: '新绑定账号量'
        },
        {
          key: 'chatNum7d',
          val: '--',
          text: '最近7天有沟通的账号量'
        },
        {
          key: 'chatNum30d',
          val: '--',
          text: '最近30天有沟通的账号量'
        },
        {
          key: 'signRatio',
          val: '--',
          text: '签约成功率'
        }
      ],
      tableData: [],
      total: 0,
      deleteItem: {},
      showRemarkDialog: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      signGroupList: [],
      signTeamList: [],
      signUserList: [],
      signTeamListTemp: []
    })

    const formatData = (data) => {
      const dataTemp = { ...data }
       if ((dataTemp.lastChatTime || []).length) {
        dataTemp.lastChatTimeStart = dateFormat('YYYY-mm-dd', new Date(dataTemp.lastChatTime[0])) + ' 00:00:00'
        dataTemp.lastChatTimeEnd = dateFormat('YYYY-mm-dd', new Date(dataTemp.lastChatTime[1])) + ' 23:59:59'
        delete dataTemp.lastChatTime
      } else {
        dataTemp.lastChatTimeStart = ''
        dataTemp.lastChatTimeEnd = ''
      }

       if ((dataTemp.bindTime || []).length) {
        dataTemp.bindStartTime = dateFormat('YYYY-mm-dd', new Date(dataTemp.bindTime[0])) + ' 00:00:00'
        dataTemp.bindEndTime = dateFormat('YYYY-mm-dd', new Date(dataTemp.bindTime[1])) + ' 23:59:59'
        delete dataTemp.bindTime
      } else {
        dataTemp.bindStartTime = ''
        dataTemp.bindEndTime = ''
      }

      return dataTemp
    }

    const onSubmit = (data) => {
      searchData.value.pageNum = 1
      const dataTemp = formatData(data)
      Object.assign(searchData.value, dataTemp)
      handleGetList()
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
      const { id } = $store.state.user.userInfo
      $getSignContractOrderCondition().then((res) => {
        if (res.code === 1 && res.data) {
          // if (normalFormItemMap.signGroupId && res.data.signGroupInfoList) {
          //   normalFormItemMap.signGroupId.data = res.data.signGroupInfoList
          // }
          // if (normalFormItemMap.signUserId) {
          //   normalFormItemMap.signUserId.data = res.data.signUserList
          // }
          // if (!$permission('sign_progress_contract_team') && normalFormItemMap.signTeamId) {
          //   normalFormItemMap.signTeamId.data = res.data.signTeamList
          // }
          if (res.data.signGroupInfoList) {
            data.signGroupList = res.data.signGroupInfoList
          }
          if (res.data.signTeamList) {
            data.signTeamListTemp = res.data.signTeamList
          }
          if (res.data.signUserList) {
            data.signUserList = res.data.signUserList

            if (data.signUserList.filter(item => item.userId === id).length) {
              $set($refs.search.form, 'signUserId', id)
              searchData.value.signUserId = id
            }
          }
          // 预评级数据
          if (normalFormItemMap.preGrade && res.data.preGrades) {
            normalFormItemMap.preGrade.data = res.data.preGrades.map(item => {
              return {
                value: item,
                label: item
              }
            })
          }
          // 签约状态数据
          if (normalFormItemMap.signStatuses && res.data.signStatus) {
            normalFormItemMap.signStatuses.data = res.data.signStatus
          }
          // 账号名称数据
          if (normalFormItemMap.accountName && res.data.medAccountNameVOS) {
            normalFormItemMap.accountName.data = res.data.medAccountNameVOS
          }
          states.signTeamList = res.data.signTeamList
          handleGetList()
        }
      })
    }

    // 处理签约团队下拉框的选择，动态渲染签约小组数据
    const handleChangeSignGroup = (val) => {
      data.signTeamList = data.signTeamListTemp.filter(item => item.parentId === val)
    }

    const handleGetList = (params) => {
      $nextTick(() => {
        const { accountName } = searchData.value
        data.loading = true
        if (accountName) {
          searchData.value.accountId = accountName
        } else {
          searchData.value.accountId = ''
        }
        delete searchData.value.accountName
        $getList(Object.assign({ ...searchData.value }, { pageNum: params }))
        .then((res) => {
          if (+(res || {}).code === 1) {
            data.detailStatistics.forEach((item) => {
              item.val = res.data[item.key]
              if (item.key === 'signRatio') {
                item.val = (item.val * 100 || 0).toFixed(2) + '%'
              }
            })
            data.tableData = res.data.accountInfos
            data.total = res.data.total
          } else {
            $message.error(res.message)
          }
          data.loading = false
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          data.loading = false
          $message.error(err.message || '网络错误')
        })

        // $refs.table.getList()
      })
    }

    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'signGroupId': // 签约团队
          model.signTeamId = ''
          model.signUserId = ''
          normalFormItemMap.signTeamId.data = states.signTeamList.filter((item) => {
            if (item.parentId === val) return item
          })
          getSignAgents(val)
          $nextTick(() => {
            // 上吉签
            if (+val === 947) {
              const item = formConf.normal.splice(1, 1)
              data.deleteItem = item
            } else {
              if (formConf.normal.length === 3) return
              const newNormal = [...formConf.normal]
              newNormal.splice(1, 0, ...data.deleteItem)
              formConf.normal = newNormal
            }
            // break
          })
          break
        case 'signTeamId': // 签约小组
          model.signUserId = ''
          getSignAgents(val)
      }
    }

    const onExport = (data) => {
      const dataTemp = formatData(data)
      Object.assign(searchData.value, dataTemp)
      const searchDataObj = searchData.value
      Object.keys(searchDataObj).forEach(item => {
       if (!searchDataObj[item] && searchDataObj[item] !== 0) {
        Reflect.deleteProperty(searchDataObj, item)
       }
      })
      window.open(
        `/api/sign/account/exportSignScheList?${qs.stringify({
          ...searchDataObj
        })}`
      )
    }

    const handleAddClick = () => {
      data.showRemarkDialog = true
    }

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        // {
        //   type: 'select',
        //   key: 'signGroupId',
        //   data: [],
        //   conf: {
        //     placeholder: '选择签约团队'
        //   },
        //   optionLabelKey: 'orgName',
        //   optionValKey: 'id',
        //   permissionName: 'sign_progress_contract_team'
        // },
        // {
        //   type: 'select',
        //   key: 'signTeamId',
        //   data: [],
        //   conf: {
        //     placeholder: '选择签约小组'
        //   },
        //   optionLabelKey: 'orgName',
        //   optionValKey: 'orgId',
        //   permissionName: 'sign_progress_contract_group'
        // },
        // {
        //   type: 'select',
        //   key: 'signUserId',
        //   data: [],
        //   conf: {
        //     placeholder: '选择签约经纪人'
        //   },
        //   optionLabelKey: 'realname',
        //   optionValKey: 'userId',
        //   permissionName: 'sign_progress_contract_user'
        // },
        {
          type: 'select',
          key: 'preGrade',
          data: [],
          conf: {
            placeholder: '选择预评级'
          },
          optionLabelKey: 'label',
          optionValKey: 'value'
        },
        {
          type: 'select',
          key: 'signStatuses',
          data: [],
          conf: {
            placeholder: '选择签约状态',
            multiple: true
          },
          optionLabelKey: 'statusName',
          optionValKey: 'statusId'
        },
        {
          type: 'select',
          key: 'accountName',
          data: [],
          conf: {
            placeholder: '选择账号'
          },
          optionLabelKey: 'accountName',
          optionValKey: 'accountId'
        }
      ]

      // 上吉签 不渲染签约小组
      if (+$store.getters.user.userInfo.did === 947) {
        normal.splice(1, 1)
      }

      normal = normal.filter(function(item, index) {
        if (item.permissionName && !$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })

      formConf.normal = normal
    }

    $nextTick(() => {
      const { firstDay, lastDay } = getMonthStartEnd()
      $set($refs.search.form, 'bindTime', [`${firstDay}`, `${lastDay}`])
      searchData.value.bindStartTime = firstDay + ' 00:00:00'
      searchData.value.bindEndTime = lastDay + ' 23:59:59'
    })

    buildFormConf()
    // getProjectTypeList()
    getProjectSearchList()

    // handleGetList()

    return {
      ...toRefs(data),
      did: $store.getters.user.userInfo.did,
      formConf,
      onSubmit,
      searchData,
      onExport,
      onChange,
      handleChangeSignGroup,
      handleAddClick,
      handleGetList
      // handleShowMonth
    }
  }
})
</script>

<style scoped>

</style>
