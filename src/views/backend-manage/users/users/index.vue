<template>
  <div class="P-users">
    <Wrap class="search-view">
      <v-search ref="search" :config="formConf" @submit="onSubmit" @change="onSearchChange">
        <template v-slot:prv="target">
          <el-cascader
            v-model="target.model.orgIdList"
            placeholder="请选择组织"
            class="m-r-10"
            :options="options"
            :props="{ checkStrictly: true, value: 'id', label: 'orgName', children: 'childOrgList', expandTrigger: 'hover' }"
            clearable
            filterable
          />
        </template>
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <div style="margin-bottom: 20px;text-align: right;">
        <el-button v-log type="primary" @click="onAdd">添加用户</el-button>
        <el-button v-log :loading="delUserLoading" type="danger" @click="onDel">删除用户</el-button>
      </div>
      <el-table
        ref="flow"
        v-scrollbar
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
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
        <el-table-column prop="roleName" label="角色" />
        <el-table-column label="用户状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.isDeleted === 1" style="color: red">注销</span>
            <span v-else>正常</span>
          </template>
        </el-table-column>
        <el-table-column label="登录状态" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.userStatus === 1">正常</span>
            <span v-else style="color: red">禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="flex flex-justify-around">
              <el-link v-log type="primary" @click="onEdit(scope.row)">修改</el-link>
              <el-link v-if="scope.row.editFlag" v-log type="primary" @click="onRole(scope.row)">管理角色</el-link>
              <el-link v-if="$permission('clear_token')" v-log type="primary" @click="handleDownOut(scope.row)">下线</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="nowPage"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <!-- 添加用户 -->
    <AddUserDialog v-if="hasAddDialog" v-model="hasAddDialog" :data="userRow" @update="getList" />
    <!-- 管理角色 -->
    <RoleDialog v-if="hasRoleDialog" v-model="hasRoleDialog" :data="userRow" @update="getList" />
    <!-- 组织架构选择弹框 -->
    <organizeSelect v-if="organizeVisible" v-model="organizeVisible" @save="onOrganizeEdit" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import Search from '@/components/Search'
import { toOptions, copy, isUndefined, filterByRule } from '@/components/common'
import { $getQSJUserInfo, $getUsersDropdownData, $addUser, $delUser, $getUsersRole, $userBatchDel, $getOrgInfo, $downOut, $getAllRole } from '@/api/backend-manage'
import organizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { $updateUser } from '@/api'
import AddUserDialog from './add-user-dialog.vue'
import RoleDialog from './role-dialog.vue'

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
    organizeSelect,
    AddUserDialog,
    RoleDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      options: [],
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
      delUserLoading: false
    }
  },
  created() {
    this.buildFormConf()
    this.getAllRole()
    // 获取基础数据
    this.getList()
    $getOrgInfo().then(res => {
      if (res.code === 1) {
        this.options = res.data
      }
    })
  },
  methods: {
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
      return $getQSJUserInfo(query)
        .then(re => {
          this.loading = false
          if (re.code === 1) {
            this.tableData = re.data
            this.total = re.total
          }
        })
    },
    getAllRole() {
        $getAllRole().then(res => {
          if (res.code === 1) {
            this.normalFormItemMap.roleName.data = res.data
          }
        })
    },
    buildFormConf() {
      var formConf = {
        normal: filterByRule(
          [
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
                placeholder: '请输入名称'
              },
              attrs: {
                filterable: true
              }
            },
            {
              type: 'input',
              key: 'email',
              data: [],
              conf: {
                placeholder: '请输入邮箱'
              },
              attrs: {
                filterable: true
              }
            },
            {
              type: 'input',
              key: 'mobile',
              data: [],
              conf: {
                placeholder: '请输入手机号'
              },
              attrs: {
                filterable: true
              }
            },
            {
              type: 'select',
              key: 'userStatus',
              data: [{
                text: '正常',
                val: '1'
              }, {
                text: '禁用',
                val: '0'
              }],
              conf: {
                placeholder: '登录状态',
                allowCreate: true,
                defaultFirst: true
              }
            },
            {
              type: 'select',
              key: 'isDeleted',
              data: [{
                text: '正常',
                val: '0'
              }, {
                text: '注销',
                val: '1'
              }],
              conf: {
                placeholder: '用户状态',
                allowCreate: true,
                defaultFirst: true
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
      const params = copy(data)
      if (params.orgIdList) {
        params.orgId = params.orgIdList[params.orgIdList.length - 1]
        delete params.orgIdList
      }
      this.searchData = params
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
      // var fMap = this.normalFormItemMap
      // switch (item.key) {
      //     case 'type_id':
      //       model.d_id = ''
      //       model.f_id = ''
      //       model.belong_id = ''
      //       fMap.d_id.data = []
      //       fMap.f_id.data = []
      //       fMap.belong_id.data = []
      //       this.searchData = model
      //       if (val) {
      //         this.getSelectData('belong_id', val)
      //       }
      //       break

      //     case 'belong_id':
      //       model.d_id = ''
      //       model.f_id = ''
      //       fMap.d_id.data = []
      //       fMap.f_id.data = []
      //       this.searchData = model
      //       if (val) {
      //         this.getSelectData('d_id', val)
      //       }
      //       break

      //     case 'd_id':
      //       model.f_id = ''
      //       fMap.f_id.data = []
      //       this.searchData = model
      //       if (val) {
      //         this.getSelectData('f_id', val)
      //       }
      //       break
      // }
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
    },
    handleDownOut(row) {
      $downOut({ userId: row.id }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
