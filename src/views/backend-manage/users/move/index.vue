<template>
  <div>
    <Wrap class="search-view">
      <Search
        :config="formConf"
        @submit="onSubmit"
      >
        <template v-slot:prv="target">
          <el-cascader
            v-model="target.model.orgId"
            placeholder="请选择组织"
            class="m-r-10"
            :options="orgOptions"
            :props="{ checkStrictly: true, value: 'id', label: 'orgName', children: 'childOrgList', emitPath: false}"
            clearable
            filterable
          />
        </template>
      </Search>
    </Wrap>
    <Wrap
      class="m-t-16"
    >
      <div>
        <IconTip
          type="popover"
          label="注意事项"
          placement="top"
          width="370"
          class="tip-red"
        >
          <ul class="attention-list">
            <li data-bold>离职移交说明：</li>
            <li>1、请先在账户管理中删除用户后再进行离职移交！</li>
            <li>2、将与离职人员相关待继续跟进对接的客户记录、商单记录、工单记录统一调整交接。</li>
            <li data-bold>特殊强调：</li>
            <li data-bold class="tip-red">一旦离职移交处理后数据无法回退，请确认后操作！</li>
            <li data-bold>案例说明：</li>
            <li>例如a人员离职，工作内容移交给b人员</li>
            <li>1、客户联系人管理中商务为a人员的记录将商务改为b人员；</li>
            <li>2、商单管理中当前未到账商单商务为a人员的记录将商务改为b人员，商务小组同理调整；商单管理中未到账商单执行人为a人员的记录将执行人改为b人员；</li>
            <li>3、工单管理中当前对应商单未到账则商务为a人员的记录将商务改为b人员，商务小组同理调整；工单管理中对应商单未到账则执行人为a人员的记录将执行人改为b人员；</li>
          </ul>
        </IconTip>
      </div>
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        class="m-t-10"
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
        empty-text="请确认已在账户管理中删除用户后再进行离职移交！"
      >
        <el-table-column label="头像" width="60">
          <template slot-scope="s">
            <img :src="s.row.avatar" alt="" style="width: 36px;">
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="真实名称" width="120" />
        <el-table-column prop="name" label="OA账号" width="100" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="mobile" label="手机号" width="110" />
        <el-table-column prop="orgName" label="组织名称" />
        <el-table-column label="用户状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.isDeleted === 1" style="color: red">注销</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column prop="transferFlag" label="是否已离职移交">
          <template slot-scope="{row}">{{ row.transferFlag === 0 ? '否' : '是' }}</template>
        </el-table-column>
        <el-table-column prop="receiverUserName" label="交接人员">
          <template slot-scope="{row}">{{ row.receiverUserName || '--' }}</template>
        </el-table-column>
        <el-table-column prop="receiveDate" label="移交时间" width="102">
          <template slot-scope="{row}">{{ row.receiveDate || '--' }}</template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="{row}">
            <el-link v-log :disabled="row.transferFlag === 1" type="primary" @click="handleMoveClick(row)">离职移交</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
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
    <MoveUser v-if="showMoveDialog" v-model="showMoveDialog" :data="editData" @success="getList" />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { Search, IconTip } from 'components'
import { $getMoveUserCondition, $getMoveUserInfo, $getAllRole } from '@/api/backend-manage'
export default defineComponent({
  components: {
    Search, IconTip,
    MoveUser: () => import('./moveUserDialog.vue')
  },
  setup() {
    const { $message } = getCurrentInstance().proxy
    const useSearch = () => {
       const normalFormItemMap = {}
      const buildFormConf = () => {
        const formConf = ref({
          normal: [
            {
              type: 'select',
              key: 'roleName',
              data: [],
              conf: {
                clearable: true,
                placeholder: '请选择用户角色',
                filterable: true
              },
              optionLabelKey: 'name',
              optionValKey: 'name'
            },
            {
              type: 'input',
              key: 'realname',
              data: [],
              conf: {
                placeholder: '请输入名称',
                filterable: true
              },
              attrs: {
              }
            },
            {
              type: 'input',
              key: 'email',
              data: [],
              conf: {
                placeholder: '请输入邮箱',
                filterable: true
              }
            },
            {
              type: 'input',
              key: 'mobile',
              data: [],
              conf: {
                placeholder: '请输入手机号',
                filterable: true
              }
            },
            {
              type: 'select',
              key: 'transferFlag',
              data: [{
                val: 0,
                text: '否'
              }, {
                val: 1,
                text: '是'
              }],
              conf: {
                clearable: true,
                placeholder: '请选择是否已离职移交'
              }
            }
          ],
          hasExport: false
        })
        formConf.value.normal.forEach(function(item, index) {
          item.index = index
          normalFormItemMap[item.key] = item
        })
        return { formConf, normalFormItemMap }
      }

      const orgOptions = ref([])
      const getOrgInfo = () => {
        $getMoveUserCondition().then(res => {
          if (res.code === 1) {
            orgOptions.value = res.data
          }
        })
      }
      const getAllRole = () => {
        $getAllRole().then(res => {
          if (res.code === 1) {
            normalFormItemMap.roleName.data = res.data
          }
        })
      }
      getAllRole()
      getOrgInfo()
      const { formConf } = buildFormConf()

      const searchData = ref({})
      const onSubmit = (params) => {
        searchData.value = params
        searchData.value.pageNum = 1
        getList()
      }

      return {
        searchData,
        formConf,
        onSubmit,
        orgOptions
      }
    }

    const { formConf, onSubmit, orgOptions, searchData } = useSearch()

    const useTable = () => {
      const tableData = ref([])
      const loading = ref(false)
      const total = ref(0)
      const showMoveDialog = ref(false)
      const editData = ref({})
      const getList = () => {
        loading.value = true
        $getMoveUserInfo({ ...searchData.value, ...{ isDeleted: 1 }}).then(res => {
          if (res.code === 1) {
            tableData.value = res.data
            total.value = res.total
          } else {
            $message.error(res.message)
          }
          loading.value = false
        })
      }

      const handleMoveClick = (row) => {
        editData.value = row
        showMoveDialog.value = true
      }
      return {
        showMoveDialog,
        loading,
        total,
        tableData,
        getList,
        editData,
        handleMoveClick
      }
    }

    const { tableData, loading, getList, total, showMoveDialog, editData, handleMoveClick } = useTable()

    getList()

    return {
      editData,
      handleMoveClick,
      showMoveDialog,
      loading,
      getList,
      tableData,
      formConf,
      searchData,
      onSubmit,
      orgOptions,
      total
    }
  }
})
</script>
<style lang="scss" scoped>
  .attention-list {
    li {
      line-height: 1.5;
    }
  }
</style>
