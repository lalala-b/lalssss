<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:13
 * @LastEditTime: 2020-10-10 17:43:15
 * @LastEditors: Luoxd
-->
<template>
  <div class="table-view m-t-16">
    <TabForm :config="form" @save="handleSearch">
      <template slot-scope="{ row }">
        <el-form-item label="数据域绑定状态" label-width="160px">
          <el-select v-model="row.isBindDataScope">
            <el-option v-for="(item, index) in bindStatusList" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-radio-group v-model="row.status">
            <el-radio-button :label="0">停用</el-radio-button>
            <el-radio-button :label="1">正常</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="支持绑定数据域" label-width="160px">
          <el-switch v-model="row.datascopeFlag" />
        </el-form-item>
      </template>
    </TabForm>
    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="dataTableData"
      cell-class-name="table-cell"
      header-row-class-name="table-header"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="sql类型" style="margin-bottom: 0;">
              <span>{{ props.row.typeSql }}</span>
            </el-form-item>
            <el-form-item label="sql返回值类型" style="margin-bottom: 0;">
              <span>{{ props.row.scopeValue }}</span>
            </el-form-item>
            <el-form-item label="数据域范围" style="margin-bottom: 0;">
              <span>{{ props.row.datascope }}</span>
            </el-form-item>
            <el-form-item label="数据域说明" style="margin-bottom: 0;">
              <span>{{ props.row.scopeSqlRemark }}</span>
            </el-form-item>
            <el-form-item label="数据域sql" style="margin-bottom: 0;">
              <span>{{ props.row.scopeSql }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="orgId" label="组织ID" />
      <el-table-column prop="orgName" label="组织名称" />
      <el-table-column prop="roleName" label="角色名" />
      <el-table-column prop="roleType" label="角色类型" width="80" />
      <el-table-column prop="roleDatascopeFlag" label="角色数据域标志" />
      <el-table-column prop="roleStatus" label="角色状态" width="80" />
      <el-table-column prop="roleMark" label="角色备注" />
      <el-table-column label="操作" width="160">
        <template slot-scope="s">
          <el-link v-if="s.row.roleDatascopeFlag === 1 && s.row.menuDatascopeFlag === 1" type="primary" @click="onBind(s.row)">绑定数据域</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total" class="pagenation-view">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="total"
        :current-page="dataPageNum"
        @current-change="currentChange"
      />
    </div>
    <!-- 绑定数据域 -->
    <BindDataDialog v-if="hasBindData" v-model="hasBindData" :data="editRow" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import BindDataDialog from './bind-data-dialog.vue'
import TabForm from './_components/tab-form.vue'

export default {
  // inject: ['dataTableData', 'editData', 'dataTableTotal'],
  components: { BindDataDialog, TabForm },
  data() {
    return {
      organizeVisible: false,
      loading: false,
      hasBindData: false,
      editRow: null,
      dialog: {
        show: false
      },
      searchData: null,
      form: {
        datascopeFlag: null,
        status: null,
        isBindDataScope: null
      },
      bindStatusList: [
        { label: '未绑定', value: 0 },
        { label: '已绑定', value: 1 },
        { label: '全部', value: 2 }
      ],
      typeName: {
        1: '特殊',
        3: '海盗',
        5: '乾派'
      }
    }
  },
  computed: {
    ...mapState('menuManage', {
      dataTableData: state => state.dataTableData,
      total: state => state.dataTotal,
      dataPageNum: state => state.dataPageNum
    })
  },
  methods: {
    ...mapActions('menuManage', ['getDictDataList']),
    currentChange(pageNum) {
      this.getDictDataList({
        ...this.searchData,
        datascopeFlag: this.searchData && this.searchData.datascopeFlag ? 1 : 0,
        pageNum
      })
    },
    handleSearch(form) {
      this.searchData = form
      this.getDictDataList({
        ...form,
        datascopeFlag: form.datascopeFlag ? 1 : 0,
        pageNum: 1
      })
    },
    onBind(row) {
      this.editRow = row
      this.hasBindData = true
    },
    onDelUser() {},
    onDel() {}
  }
}
</script>
