<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:btns="target">
          <el-button v-if="$permission('add_medium_org')" v-log type="primary" @click="handleAdd">添加媒介供应商</el-button>
          <el-checkbox
            v-model="target.model.cooperationYearFrameFlag"
            class="checkBox"
            :true-label="1"
            :false-label="null"
            @change="onSubmit(target.model)"
          >年框合作</el-checkbox>
        </template>
      </v-search>

    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <el-table
        v-scrollbar
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column prop="accountStatus" label="供应商信息" width="260px" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="{ name:'mcnName', imgUrl: 'mcnLogo', xingtuUrl: 'mcnXingtuUrl'}">
              <template v-slot>
                <div>
                  <el-tag v-if="+row.mcnType === 1" class="tag" size="small" effect="dark">机构</el-tag>
                  <el-tag v-if="+row.mcnType === 0" class="tag" size="small" type="warning" effect="dark">个人</el-tag>
                  <el-tag v-if="+row.mcnType === 2" class="tag" size="small" type="success" effect="dark">KOC/线上合作</el-tag>
                  <el-tooltip effect="dark" content="该供应商抖音达人已全部导入至媒介账号库" placement="top">
                    <el-tag v-if="+row.batchIntoFlag === 1" class="tag" size="small" type="info" effect="dark">达人已入库</el-tag>
                  </el-tooltip>
                </div>
              </template>
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column prop="mcnTalentCount" label="供应商达人数" sortable="custom">
          <template slot="header">
            <IconTip
              content="数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
              label="供应商达人数"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <el-table-column prop="mcnAccountCount" label="已添加媒介账号数" sortable="custom" />
        <el-table-column label="覆盖平台">
          <template slot-scope="{ row }">
            <el-tooltip v-for="item in row.coverPlatInfo" :key="item.paltId" class="account-icon-wrap" effect="dark" :content="item.platName" placement="top">
              <el-image fit="contain" class="plat-img" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${item.platId}.png`" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="mcnResponsibleUserName" label="媒介采买人" />
        <el-table-column prop="bindingTime" label="绑定时间" sortable="custom" />
        <el-table-column label="年框合作">
          <template slot-scope="{ row }">
            {{ row.cooperationYearFrameFlag?'合作':'--' }}
          </template>
        </el-table-column>
        <el-table-column label="合作周期">
          <template slot-scope="{ row }">
            {{ row.cooperationCycle | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="110">
          <template slot-scope="{ row }">
            <IconTip v-if="+row.batchIntoFlag === 0" content="供应商达人批量导入媒介账号库" class="m-r-4" icon-class="icondaoru" @click="handleImport(row)" />
            <IconTip content="查看" class="m-r-4" icon-class="iconxiangqing" @click="handleShowInfo(row, false)" />
            <IconTip v-if="row.editFlag === 1" content="编辑" icon-class="iconbianji" @click="handleShowInfo(row, true)" />
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
    <AddMediumOrg
      v-if="showAddDialog"
      v-model="showAddDialog"
      :type="mediumOrgType"
      :info="mcnInfo"
      :user-list="normalFormItemMap.userId.data"
    />

    <BatchImportDialog
      v-if="showBatchImportDialog"
      :id="mechanismId"
      :show="showBatchImportDialog"
      @close="showBatchImportDialog = false"
      @confirm="handleUpdate"
    />
    <!-- <MediumInfo
      v-if="showInfoDialog"
      v-model="showInfoDialog"
      :info="mcnInfo"
      :is-edit="isEdit"
      :user-list="normalFormItemMap.userId.data"
      @update="handleUpdate"
    /> -->
  </div>
</template>
<script>
import qs from 'qs'
import tableMixin from '@/mixins/table'
import Search from '@/components/Search'
import { AccountCard, IconTip } from 'components'
import AddMediumOrg from './AddMediumOrg'
// import MediumInfo from './MediumInfo'
import BatchImportDialog from './BatchImportDialog.vue'
import { $getMediumOrgList, $getMediumOrgCondition } from '@/api/bussiness-manage'
export default {
  components: {
    VSearch: Search,
    AddMediumOrg,
    BatchImportDialog,
    // MediumInfo,
    AccountCard,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    return {
      formConf: null,
      tableData: [],
      showAddDialog: false,
      showInfoDialog: false,
      mediumOrgType: 'add',
      isEdit: false,
      mcnInfo: {},
      loading: false,
      total: 0,
      searchData: {
        pageNum: 1,
        mechanismId: '',
        userId: ''
      },
      showBatchImportDialog: false,
      mechanismId: ''
    }
  },
  created() {
    this.getList()
    this.buildFormConf()
    this.getCondition()
    this.$bus.$on('updateMediumOrg', this.handleUpdate)
  },
  beforeDestroy() {
    this.$bus.$off('updateMediumOrg')
  },
  methods: {
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'mcnType',
          data: [{ id: 1, label: '机构' }, { id: 0, label: '个人' }, { id: 2, label: 'KOC/线下合作' }],
          conf: {
            placeholder: '请选择供应商类型'
          },
          optionValKey: 'id',
          optionLabelKey: 'label'
        },
        {
          type: 'select',
          key: 'mechanismId',
          data: [],
          conf: {
            placeholder: '请选择供应商名称'
          },
          optionValKey: 'id',
          optionLabelKey: 'mcnName'
        },
        {
          type: 'select',
          key: 'userId',
          data: [],
          conf: {
            placeholder: '媒介采买人'
          },
          optionValKey: 'userId',
          optionLabelKey: 'realname'
        }
      ]
      const formConf = {
        normal,
        // hasExport: this.$permission('medium_org_manage_export')
        hasExport: this.$permission('manager_export')
      }
      const normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    getCondition() {
      $getMediumOrgCondition().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.mechanismId.data = res.data.baseMcnInfos
          this.normalFormItemMap.userId.data = res.data.userInfos
        }
      })
    },
    getList() {
      this.loading = true
      $getMediumOrgList(this.searchData).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        }
      }).finally(_ => {
        this.loading = false
      })
    },
    onSubmit(praams) {
      Object.assign(this.searchData, praams)
      this.searchData.pageNum = 1
      this.getList()
    },
    onExport(data) {
      window.open(`/api/medium/mechanism/info/export?${qs.stringify(data)}`)
    },
    handleUpdate() {
      this.getList()
      this.getCondition()
    },
    onSearchChange() {},
    handleAdd() {
      this.showAddDialog = true
      this.mediumOrgType = 'add'
    },
    handleShowInfo(row, isEdit = false) {
      this.mcnInfo = row
      this.showAddDialog = true
      this.mediumOrgType = isEdit ? 'edit' : 'view'
      // this.isEdit = isEdit
      // this.showInfoDialog = true
    },
    handleImport(row) {
      const { completeFlag, id } = row
      // 不完整
      if (!completeFlag) {
        this.$confirm('供应商达人批量导入媒介账号库前，请先完善供应商信息', '提示', {
          confirmButtonText: '去完善',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.mcnInfo = row
          this.showAddDialog = true
          this.mediumOrgType = 'edit'
        })
        return
      }

      this.showBatchImportDialog = true
      this.mechanismId = String(id)
    }
  }
}
</script>
<style lang="scss" scoped>
   .mcn-logo {
     flex-shrink: 0;
     width: 50px;
     height: 50px;
     border-radius: 50%;
     background: #f6f6f6;
     border: 1px solid #f1f2f2;
   }
   .account-icon-wrap {
     width: 25px;
     height: 25px;
     margin-right: 5px;
   }

   .checkBox {
     margin-left: 20px;
   }

   .tag {
     margin-top: 6px;
     margin-left: 4px;
   }
</style>
