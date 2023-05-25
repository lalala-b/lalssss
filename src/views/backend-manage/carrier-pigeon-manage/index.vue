<template>
  <div>
    <wrap class="search-view">
      <Search ref="search" :config="formConf" @submit="onSubmit" />
    </wrap>
    <wrap>
      <div class="flex flex-justify-between m-b-16">
        <el-button type="primary" @click="handleAdd">注册信鸽场景</el-button>
      </div>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
      >
        <el-table-column label="场景描述" min-width="140">
          <template slot-scope="{ row }">
            {{ row.triggerDesc||'--' }}
          </template>
        </el-table-column>
        <el-table-column label="场景Code" prop="triggerCode" />
        <el-table-column label="机器人Code">
          <template slot-scope="{ row }">
            {{ row.robotRegisterRequest.robotCode||'--' }}
          </template>
        </el-table-column>
        <el-table-column label="机器人名称">
          <template slot-scope="{ row }">
            {{ row.robotRegisterRequest.robotName||'--' }}
          </template>
        </el-table-column>
        <el-table-column label="机器人类型">
          <template slot-scope="{ row }">
            {{ getRobotType(row.robotRegisterRequest.robotType) }}
          </template>
        </el-table-column>
        <el-table-column label="机器人秘钥">
          <template slot-scope="{ row }">
            {{ row.robotRegisterRequest.robotKey||'--' }}
          </template>
        </el-table-column>
        <el-table-column label="模版Code">
          <template slot-scope="{ row }">
            <template v-if="row.templateRegisterRequest">
              {{ row.templateRegisterRequest.templateCode }}
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" min-width="140" fixed="right">
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <el-link
                type="primary"
                class="m-r-16"
                :underline="false"
                @click="handleEditRoute(row)"
              >编辑</el-link>
              <el-link
                type="primary"
                class="m-r-16"
                :underline="false"
                @click="handleDelete(row)"
              >删除</el-link>
              <el-link
                v-if="!row.isPublished"
                type="primary"
                :underline="false"
                @click="handlePublish(row)"
              >发布</el-link>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <div class="pagenation-view">
        <el-pagination
          background
          layout="total,prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div> -->
    </wrap>
    <registerRobot
      v-if="showRouteDialog"
      v-model="showRouteDialog"
      :info="info"
      :from="from"
      :trigger-code-list="normalFormItemMap.triggerCode.data"
      :robot-list="normalFormItemMap.robotCode.data"
      :template-code-list="normalFormItemMap.templateCode.data"
      :robot-type-list="robotTypeList"
      @close="handleClose"
      @success="getList"
    />
  </div>
</template>
<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  ref
} from '@vue/composition-api'
import { Search } from 'components'
import registerRobot from './_com/registerRobot.vue'
import { $getDataByDictType } from '@/api'
import {
  $getCarrierList,
  $carrierCondition
} from '@/api/backend-manage'
export default {
  components: {
    Search,
    registerRobot
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: false
    })
    const states = reactive({
      loading: false,
      tableData: [],
      // total: 0,
      info: {},
      showRouteDialog: false,
      type: 'add',
      from: '',
      robotTypeList: []
    })
    const searchData = ref({
      pageNum: 1
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'robotCode',
          optionLabelKey: 'robotName',
          optionValKey: 'robotCode',
          data: [],
          conf: {
            placeholder: '请选择机器人Code'
          }
        },
        {
          type: 'select',
          key: 'triggerCode',
          optionLabelKey: 'label',
          optionValKey: 'value',
          data: [],
          conf: {
            placeholder: '请选择场景Code'
          }
        },
        {
          type: 'select',
          key: 'templateCode',
          optionLabelKey: 'label',
          optionValKey: 'value',
          data: [],
          conf: {
            placeholder: '请选择模版Code'
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const getList = function() {
      states.loading = true
      return $getCarrierList({
        ...searchData.value
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data || []
          } else {
            states.tableData = []
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const getCarrierCondition = function() {
      return $carrierCondition()
        .then((res) => {
          if (res.data) {
            normalFormItemMap.robotCode.data = res.data.robotVos || [];
            (res.data.triggerCodes || []).forEach((item) => {
              normalFormItemMap.triggerCode.data.push({
                label: item,
                value: item
              })
            });
            (res.data.templates || []).forEach((item) => {
              normalFormItemMap.templateCode.data.push({
                label: item,
                value: item
              })
            })
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    const onSubmit = (data) => {
      Object.assign(searchData.value, { ...data })
      getList()
    }
    const handleClose = () => {
      states.showRouteDialog = false
    }
    // const handleEditRoute = (row) => {
    //   states.info = row
    //   states.type = 'edit'
    //   states.from = 'EditRoute'
    //   states.showRouteDialog = true
    // }
    const handleAdd = () => {
      states.from = ''
      states.info = {}
      states.showRouteDialog = true
    }
    const getRobotType = (type) => {
      const item = states.robotTypeList.find(item => +item.dictValue === +type) || {}
      return item.dictLabel || '--'
    }
    const getDictType = () => {
      $getDataByDictType({ dictTypes: ['carrier_robot_type'] }).then((res) => {
        if (res.code === 1) {
          states.robotTypeList = res.data.carrier_robot_type || []
        }
      })
    }
    getDictType()
    // const handlePublish = async(row) => {
    //   const res = await $publishRoute({ routeCode: row.routeCode })
    //   if (res.code === 1) {
    //     $message.success(res.message)
    //     getList()
    //   }
    // }
    // const handleDelete = async(row) => {
    //   const res = await $deleteRoute({ routeCode: row.routeCode })
    //   if (res.code === 1) {
    //     $message.success(res.message)
    //     getList()
    //   }
    // }
    buildFormConf()
    getCarrierCondition()
    getList()
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      getList,
      handleClose,
      // handleEditRoute,
      // handlePublish,
      handleAdd,
      // handleDelete,
      normalFormItemMap,
      getRobotType
    }
  }
}
</script>
