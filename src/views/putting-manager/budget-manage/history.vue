<template>
  <Wrap>
    <div class="search-view">
      <Seach
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      />
    </div>
    <div class="table-view">
      <Statistics :loading="loading" :data="summaryItems" />
      <el-table
        ref="table"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
      >
        <!-- <el-table-column
          type="selection"
          width="55"
        /> -->
        <el-table-column label="投放专员" prop="userName" />
        <el-table-column label="所在军" prop="orgNameD" />
        <el-table-column label="所在团" prop="orgNameF" />
        <el-table-column label="上月预算/万">
          <span slot-scope="{ row }">{{ row.lastMonthBudgetAmount | toThousands }}w</span>
        </el-table-column>
        <el-table-column label="当月预算/万">
          <span slot-scope="{ row }">{{ row.curMonthBudgetAmount | toThousands }}w</span>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="{row}">
            <div>
              <el-button size="small" type="primary" plain @click="handleClickDetail(row)">查看详情</el-button>
              <el-button :disabled="!row.editFlag" size="small" type="primary" @click="handleClickEdit(row)">修改预算</el-button>
            </div>
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
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <Detail v-if="detailShow" v-model="detailShow" :user-id="userId" />
    <Edit v-if="editShow" v-model="editShow" v-bind="{...editInfo}" @update="getList" />
  </Wrap>
</template>
<script>
import Seach from '@/components/Search'
import Detail from './detail'
import Edit from './edit'
import { $getBudgetList, $getBudgetCondition } from '@/api/putting-manager'
import Statistics from '@/components/Statistics'
export default {
  components: {
    Seach,
    Detail,
    Edit,
    Statistics
  },
  data() {
    return {
      loading: false,
      tableData: [],
      searchData: {
        pageNum: 1
      },
      formConf: {},
      detailShow: false,
      editShow: false,
      userId: '',
      summaryItems: [{
        text: '人员数量',
        val: 0,
        key: 'userCount'
      }, {
        text: '当月投放预算',
        val: 0,
        key: 'monthAmount',
        unit: 'w'
      }],
      editInfo: {},
      total: 0
    }
  },
  created() {
    this.buildFormConf()
    this.getCondition()
    this.getList()
  },
  methods: {
    onSubmit(data) {
      const params = { ...data }
      params.orgId = params.fId || params.dId || ''
      delete params.dId
      delete params.fId
      this.searchData.pageNum = 1
      Object.assign(this.searchData, params)
      this.getList()
    },
    onExport() {},
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'dId') {
        model.fId = ''
        model.userId = ''
        this.advFormItemMap.fId.data = []
        this.advFormItemMap.userId.data = []
        this.getCondition(val)
        return
      }
      if (item.key === 'fId') {
        model.userId = ''
        this.advFormItemMap.userId.data = []
        this.getCondition(val || model.dId)
      }
    },
    buildFormConf() {
      let normal = [
        {
          type: 'select',
          key: 'dId',
          data: [],
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          isAccountName: true,
          conf: {
            placeholder: '选择军',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'fId',
          data: [],
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          isAccountName: true,
          conf: {
            placeholder: '选择团',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'userId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '投放专员'
          }
        }
      ]
      const advFormItemMap = {}

      normal = normal.filter((item, index) => {
        if (item.permissionName && !this.$permission(item.permissionName)) {
          return false
        }
        item.index = index
        advFormItemMap[item.key] = item
        return true
      })
      this.advFormItemMap = advFormItemMap
      this.formConf = {
        normal,
        hasExport: false
      }
    },
    getList() {
      this.loading = true
      $getBudgetList(this.searchData).then(res => {
        if (res.code === 1) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.summaryItems.forEach(item => {
            item.val = res.data[item.key] || 0
          })
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    getCondition(orgId) {
      $getBudgetCondition({ orgId }).then(res => {
        if (res.code === 1) {
          if (orgId) {
            this.advFormItemMap.fId.data = res.data.orgInfos
          } else {
            this.advFormItemMap.dId.data = res.data.orgInfos
          }
          this.advFormItemMap.userId.data = res.data.userInfo
        }
      })
    },
    handleClickDetail(row) {
      this.userId = row.userId
      this.detailShow = true
    },
    handleClickEdit(row) {
      this.editInfo = row
      this.editInfo.userIdList = [row.userId]
      this.editShow = true
    },
    handleSelectionChange(row) {
      this.selectData = row
    },
    handleBatchEdit() {
      if (this.selectData && this.selectData.length > 0) {
        this.editInfo = {
          isBatch: true
        }
        this.editInfo.userIdList = this.selectData.map(item => item.userId)
        this.editShow = true
      } else {
        this.$message.info('请选择要修改的数据')
      }
    },
    handleCurrentChange() {
      // this.selectData && this.selectData.forEach(item => {
      //   this.$refs.table.toggleRowSelection(item, true)
      // })
      this.getList()
    }
  }
}
</script>
<style lang="scss">
  .table-btn-wrap {
    height: 60px;
    line-height: 60px;
    text-align: right;
    .el-button {
      height: auto;
    }
  }
</style>
