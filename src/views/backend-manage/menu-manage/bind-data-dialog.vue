<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-11-20 17:49:41
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="bind-data-dialog"
      :title="`${data ? '修改' : '添加'}`"
      width="1100px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-table v-scrollbar v-loading="loading" :data="tableData">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline>
                <el-form-item label="数据域SQL">
                  <span>{{ props.row.scopeSql }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column
            width="55"
          >
            <template slot-scope="scope">
              <el-radio v-model="rowId" :label="scope.row.id" class="video-raido" />
            </template>
          </el-table-column>
          <el-table-column prop="typeSql" label="SQL类型" width="80" />
          <el-table-column prop="scopeValue" label="scope返回值" />
          <el-table-column prop="datascope" label="数据域标志" />
          <el-table-column prop="remark" label="备注" />
        </el-table>
        <div v-if="total" class="pagenation-view">
          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="10"
            :total="total"
            :current-page.sync="nowPage"
            @current-change="getList"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="save">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
import { $getDatascopeSql, $updateDataScopeForMenu } from '@/api/backend-manage'

const FORM = {
  id: '',
  scopeValue: '',
  datascope: '',
  scopeSql: '',
  remark: ''
}

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: null
    }
  },
  inject: ['$info'],
  data() {
    return {
      form: { ...FORM },
      tableData: [],
      organizeVisible: false,
      loading: false,
      rowId: '',
      nowPage: 1,
      total: 0,
      rules: {
        scopeValue: [
          { required: true, message: '请输入scope返回值', trigger: 'blur' }
        ],
        datascope: [
          { required: true, message: '请输入数据域标志建立唯一索引', trigger: 'blur' }
        ],
        scopeSql: [
          { required: true, message: '请输入数据域SQL', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.data && this.data.datascopeSqlId) {
      this.rowId = this.data.datascopeSqlId
    }
    // 获取基础数据
    this.getList()
  },
  methods: {
    /**
     * 获取列表数据
     * @param  {Number} [pageNum=1] 页码
     * @return {Object}              请求 Promise 对象
     */
    getList() {
      this.loading = true
      const query = {}
      query.pageNum = this.nowPage
      query.size = 10
      query.scopeValue = this.$info.data.datascope
      return $getDatascopeSql(query)
        .then(re => {
          this.loading = false
          if (re.code === 1) {
            this.tableData = re.data
            this.total = re.total
          }
        })
    },
    updateForm(data) {
      for (const key in this.form) {
        this.form[key] = data[key]
        if (key === 'email') {
          this.form[key] = (this.form[key] || '').replace('@zhuanzhuan.com', '')
        }
      }
    },
    /**
     * 修改部门
     */
    onOrganizeEdit(org) {
      this.form.orgId = org.id
      this.form.orgName = org.orgName
      this.organizeVisible = false
    },
    showOrganize() {
      this.organizeVisible = true
    },
    getCurrentSeclted() {
      const { tableData, rowId } = this
      for (let i = 0; i < tableData.length; i++) {
        if (tableData[i].id === rowId) {
          return tableData[i]
        }
      }
    },
    async save() {
      const current = this.getCurrentSeclted()
      const { data } = this
      if (current) {
        try {
          const res = await $updateDataScopeForMenu({
            orgId: data.orgId,
            menuId: data.menuId,
            roleId: data.roleId,
            datascopeSqlId: current.id
          })
          if (res.code === 1) {
            this.$emit('input', false)
            this.$message.success(res.message)
          } else {
            this.$message.error(res.message)
          }
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$message.error('请选择数据域')
      }
    }
  }
}
</script>
<style lang="scss">
  .bind-data-dialog {
    .video-raido {
      .el-radio__label {
        display: none;
      }
    }
  }
</style>
