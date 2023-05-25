<template>
  <Wrap class="P-users">
    <div class="search-view">
      <v-search ref="search" :config="formConf" @submit="onSubmit" @change="onSearchChange" />
    </div>
    <div v-loading="loading" class="table-view">
      <div style="margin-bottom: 20px;text-align: right">
        <el-button type="primary" @click="onAdd">新增</el-button>
      </div>
      <el-table
        ref="flow"
        v-scrollbar
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="数据域SQL">
                <span>{{ props.row.scopeSql }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="typeSql" label="SQL类型" width="80" />
        <el-table-column prop="scopeValue" label="scope返回值" width="160" />
        <el-table-column prop="datascope" label="数据域标志" width="200" />
        <el-table-column prop="remark" label="备注" />
        <!-- <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" /> -->
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" class="pad0" @click="onEdit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="20"
          :total="total"
          :current-page.sync="nowPage"
          @current-change="getList"
        />
      </div>
    </div>
    <!-- 添加用户 -->
    <EditDialog v-if="hasAddDialog" v-model="hasAddDialog" :dict-type-response="dictTypeResponse" :data="userRow" @update="getList" />
  </Wrap>
</template>
<script>
import tableMixin from '@/mixins/table'
import Search from '@/components/Search'
import { toOptions, copy, isUndefined, filterByRule } from '@/components/common'
import { $getDatascopeSql, $getUsersDropdownData, $addUser, $delUser, $getUsersRole, $userBatchDel } from '@/api/backend-manage'
import { $updateUser } from '@/api'
import EditDialog from './edit-dialog.vue'
import { $getDataByDictType } from '@/api'

/**
 * 默认的用户表单模型
 * @type {Object}
 */
const USER = {
  username: '',
  password: '',
  nick_name: '',
  real_name: '',
  author_value: 'r_id',
  belong_id: '',
  d_id: '',
  f_id: '',
  user_id: ''
}

export default {
  components: {
    vSearch: Search,
    EditDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      organizeVisible: false,
      hasRoleDialog: false,
      lists: {
        belong_id: [],
        type_id: [],
        d_id: [],
        f_id: []
      },
      popList: {
        belong_id: [],
        type_id: [],
        d_id: [],
        f_id: [],
        author_value: []
      },
      formConf: {},
      searchData: {
        type_id: ''
      },
      userRow: null,
      dialogStatus: {
        del: false,
        user: false
      },
      dialogData: {
        del: {},
        user: {}
      },
      dialogLoading: {
        del: false,
        user: false
      },
      rules: {
        username: {
          required: true,
          message: '登录名称不能为空',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '登录密码不能为空',
          trigger: 'blur'
        },
        nick_name: {
          required: true,
          message: '昵称不能为空',
          trigger: 'blur'
        },
        real_name: {
          required: true,
          message: '账户名不能为空',
          trigger: 'blur'
        },
        r_id: {
          required: true,
          message: '请选择账户角色',
          trigger: 'change'
        },
        belong_id: {
          required: true,
          validator: (rule, value, callback) => {
            var data = this.dialogData.user
            var keys = ['type_id', 'belong_id', 'd_id', 'f_id']
            var re = false
            for (let i = 0; i < 4; i++) {
              if (data[keys[i]]) {
                re = true
                break
              }
            }
            if (re) {
              callback()
            } else {
              callback(new Error('请选择账户归属'))
            }
          },
          trigger: 'change'
        }
      },
      formLabelWidth: '88px',
      total: 0,
      isMcn: false,
      selected: null,
      hasAddDialog: false,
      delUserLoading: false,
      dictTypeResponse: {
        sys_datascope_value_type: [],
        sys_datascope_flag: []
      }
    }
  },
  created() {
    this.buildFormConf()
    // 获取基础数据
    this.getList()
    this.getDataByDictType()
  },
  methods: {
    async getDataByDictType() {
      const res = await $getDataByDictType({
        dictTypes: ['sys_datascope_value_type', 'sys_datascope_flag']
      })
      if (res.code === 1 && res.data) {
        this.dictTypeResponse.sys_datascope_value_type.push(...res.data.sys_datascope_value_type)
        this.dictTypeResponse.sys_datascope_flag.push(...res.data.sys_datascope_flag)
      }
    },
    /**
     * 表格选择响应函数
     * @param {Array} val 当前选中的数组
     */
    handleSelectionChange(val) {
      this.selected = val
    },
    onRole(row) {
      this.userRow = row
      this.hasRoleDialog = true
    },
    onAdd() {
      this.hasAddDialog = true
      this.userRow = null
    },
    onDel() {
      if (this.delUserLoading) {
        return
      }
      if (!this.selected || this.selected.length === 0) {
        this.$message.error('请选择要删除的用户')
        return
      }
      this.$confirm(`是否确认删除所选的${this.selected.length}个用户?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          this.delUserLoading = true
          try {
            const res = await $userBatchDel({
              ids: this.selected.map(t => t.id)
            })
            if (res.code === 1) {
              this.getList()
              this.$message.success(res.message || '操作成功')
            } else {
              this.$message.error(res.message || '网络错误')
            }
          } catch (err) {
            console.log(err)
          }
          this.delUserLoading = false
        })
    },
    onEdit(row) {
      this.userRow = row
      this.hasAddDialog = true
    },
    /**
     * 修改部门
     */
    async onOrganizeEdit(org) {
      const re = await $updateUser({
        orgId: org.id,
        id: this.row.id
      })
      if (re.code === 1) {
        this.organizeVisible = false
        this.hasShowRouter = true
        this.getList()
      }
    },
    /**
     * 获取列表数据
     * @param  {Number} [pageNum=1] 页码
     * @return {Object}              请求 Promise 对象
     */
    getList() {
      this.loading = true
      const query = copy(this.searchData)
      query.pageNum = this.nowPage
      query.size = 20
      return $getDatascopeSql(query)
        .then(re => {
          this.loading = false
          if (re.code === 1) {
            this.tableData = re.data
            this.total = re.total
          }
        })
    },
    buildFormConf() {
      var formConf = {
        normal: filterByRule(
          [
            {
              type: 'select',
              key: 'typeSql',
              data: [
                {
                  val: '公共',
                  text: '公共'
                },
                {
                  val: '私有',
                  text: '私有'
                }
              ],
              conf: {
                placeholder: '请输入SQL类型'
              },
              attrs: {
                filterable: true
              }
            },
            {
              type: 'select',
              key: 'scopeValue',
              optionLabelKey: 'dictLabel',
              optionValKey: 'dictValue',
              data: this.dictTypeResponse.sys_datascope_value_type,
              conf: {
                placeholder: '请输入scope返回值'
              },
              attrs: {
                filterable: true
              }
            },
            {
              type: 'select',
              key: 'datascope',
              optionLabelKey: 'dictLabel',
              optionValKey: 'dictValue',
              data: this.dictTypeResponse.sys_datascope_flag,
              conf: {
                placeholder: '数据域标识'
              },
              attrs: {
                filterable: true
              }
            }
          ],
          this.$store.state.user.userInfo
        ),
        hasExport: false
      }
      this.formConf = formConf
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
    },
    /**
     * 获取下拉菜单数据
     * @param  {String}  数据类型，该类型对应 lists 中的字段
     */
    getDropdownData(type, head_id = '') {
      var query
      switch (type) {
          case 'belong_id':
          case 'd_id':
          case 'f_id':
            query = {
              head_id
            }
            break

          case 'type_id':
            query = {
              head_id: ''
            }
            break
      }
      return $getUsersDropdownData(query)
        .then(re => {
          if (re) {
            return toOptions(re, {
              valKey: 'id',
              textKey: 'role_name'
            })
          }
          return []
        })
    },
    /**
     * 搜索的下拉菜单处理函数
     * @param  {String}  type  类型
     */
    getSelectData(type, head_id) {
      this.getDropdownData(type, head_id).then(
        re => {
          this.lists[type] = re
          if (this.normalFormItemMap[type]) {
            this.normalFormItemMap[type].data = this.lists[type]
          }
        },
        err => {}
      )
    },
    /**
     * 浮层的下拉菜单处理函数
     * @param  {String}  type  类型
     */
    getPopSelectData(type, head_id = '') {
      this.getDropdownData(type, head_id).then(
        re => {
          this.popList[type] = re
        },
        err => {}
      )
    },
    /**
     * 浮层的下拉菜单选择响应函数
     * @param  {String}  type  类型
     */
    onDialogSelectChange(type, head_id) {
      switch (type) {
          case 'type_id':
            this.popList.belong_id = []
            this.popList.d_id = []
            this.popList.f_id = []
            this.dialogData.user.belong_id = ''
            this.dialogData.user.d_id = ''
            this.dialogData.user.f_id = ''
            type = 'belong_id'
            break

          case 'belong_id':
            this.popList.d_id = []
            this.popList.f_id = []
            this.dialogData.user.d_id = ''
            this.dialogData.user.f_id = ''
            type = 'd_id'
            break

          case 'd_id':
            this.popList.f_id = []
            this.dialogData.user.f_id = ''
            type = 'f_id'
            break
      }
      this.getPopSelectData(type, head_id)
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData = data
      this.nowPage = 1
      this.getList()
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {
      var fMap = this.normalFormItemMap
      switch (item.key) {
          case 'type_id':
            model.d_id = ''
            model.f_id = ''
            model.belong_id = ''
            fMap.d_id.data = []
            fMap.f_id.data = []
            fMap.belong_id.data = []
            this.searchData = model
            if (val) {
              this.getSelectData('belong_id', val)
            }
            break

          case 'belong_id':
            model.d_id = ''
            model.f_id = ''
            fMap.d_id.data = []
            fMap.f_id.data = []
            this.searchData = model
            if (val) {
              this.getSelectData('d_id', val)
            }
            break

          case 'd_id':
            model.f_id = ''
            fMap.f_id.data = []
            this.searchData = model
            if (val) {
              this.getSelectData('f_id', val)
            }
            break
      }
    },
    /**
     * 确认操作
     * @param  {String}  type  操作类型
     */
    async onConfirm(type) {
      this.dialogLoading[type] = true
      var re
      try {
        re = await this[type === 'del' ? 'delUser' : 'modifyUser']()
      } catch (e) {
        re = false
      }
      this.dialogLoading[type] = false
      if (re) {
        this.onCancel(type)
      }
    },
    /**
     * 修改或新增用户
     */
    async modifyUser() {
      if (this.userTimer) {
        clearTimeout(this.userTimer)
      }
      var re
      try {
        re = await this.$refs.user.validate()
      } catch (e) {
        re = false
      }
      if (!re) {
        this.userTimer = setTimeout(() => {
          this.$refs.user.clearValidate()
        }, 5000)
        return Promise.reject(null)
      }

      var data = {}
      Object.keys(USER).forEach(key => {
        const rKey = USER[key] || key
        data[key] = this.dialogData.user[rKey]
      })
      if (!data.f_id) {
        delete data.f_id
      }
      if (!data.d_id) {
        delete data.d_id
      }
      if (!data.belong_id) {
        delete data.belong_id
      }

      this.dialogLoading.user = true
      return $addUser(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.msg || '操作成功',
              type: 'success'
            })
            const { _index } = this.dialogData.user
            if (isUndefined(_index)) {
              // 新增
              this.nowPage = 1
              this.getList(this.nowPage)
            } else {
              // 编辑
              Object.assign(this.tableData[_index], data)
            }
          }
        })
    },
    /**
     * 删除用户响应函数
     * @param {Object}  item  删除的用户数据
     */
    onDelUser(item) {
      if (item) {
        this.dialogData.del = item
        this.dialogStatus.del = true
      }
    },
    // 删除用户
    delUser() {
      return $delUser({
        user_id: this.dialogData.del.user_id
      })
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.msg || '操作成功',
              type: 'success'
            })
            // 从表格中删除数据
            this.tableData.splice(
              this.tableData.indexOf(this.dialogData.del),
              1
            )
          }
        })
    },
    /**
     * 浮层取消或关闭响应函数
     * @param  {String}  type   浮层类型
     */
    onCancel(type) {
      this.dialogStatus[type] = false
      this.dialogData[type] = {}
      if (type === 'user') {
        this.$refs.user.resetFields()
      }
    },
    // 获取角色列表
    getRoles() {
      $getUsersRole()
        .then(re => {
          if (re.code === 1) {
            this.popList.author_value = toOptions(re, {
              valKey: 'author_value',
              textKey: 'author_name'
            })
          }
        })
    }
  }
}
</script>
