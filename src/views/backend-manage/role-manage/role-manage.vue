<template>
  <div class="P-role">
    <Wrap class="search-view">
      <v-search ref="search" :config="formConf" @submit="onSubmit" />
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <div style="margin-bottom: 20px;text-align: right;">
        <el-button type="primary" @click="onAdd">添加角色</el-button>
      </div>
      <el-table
        ref="flow"
        v-scrollbar
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
      >
        <el-table-column prop="name" label="角色名称" width="320" />
        <el-table-column label="角色类型">
          <template slot-scope="{ row }">
            <div>
              {{ row.roleTypeName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色归属">
          <template slot-scope="{ row }">
            <div>
              {{ row.attributionName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="code" label="code" width="180" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="角色有效期" width="120">
          <template slot-scope="{row}">
            {{ row.effectiveDay === "-1" ? '无限' : row.effectiveDay }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 1">正常</span>
            <span v-else style="color: red">停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="scope">
            <div class="flex flex-justify-around">
              <el-link type="primary" @click="onEdit(scope.row)">修改</el-link>
              <el-link type="primary" @click="onOrgs(scope.row)">组织绑定</el-link>
              <el-link type="primary" @click="onBind(scope.row)">菜单绑定</el-link>
              <el-link v-if="scope.row.status === 0" type="primary" @click="onConfirm(scope.row, 1)">启用</el-link>
              <el-link v-else-if="scope.row.status === 1" type="primary" @click="onConfirm(scope.row, 0)">停用</el-link>
              <el-link type="primary" @click="hanleUserShow(scope.row)">查看用户</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="size"
        :total="total"
        :current-page.sync="nowPage"
        @current-change="getRoleList"
      />
    </Wrap>
    <!-- 添加用户 -->
    <AddUserDialog v-if="hasAddDialog" v-model="hasAddDialog" :type-datas="typeDatas" :attribution-datas="attributionDatas" :data="editRow" @update="getRoleList" />
    <!-- 菜单绑定 -->
    <MenuTreeDialog v-if="hasMenuTree" v-model="hasMenuTree" :data="editRow" @update="getRoleList" />
    <!-- 组织绑定 -->
    <OrgsTreeDialog v-if="hasOrgsTree" v-model="hasOrgsTree" :data="editRow" @update="getRoleList" />
    <!-- 查看用户 -->
    <RoleUser v-model="hasRoleUser" :role-id="roleId" @update="getRoleList" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import Search from '@/components/Search'
import { $getRoleList, $updateRole, $getRoleData } from '@/api/backend-manage'
import AddUserDialog from './add-user-dialog.vue'
import MenuTreeDialog from './menu-tree.vue'
import OrgsTreeDialog from './orgs-tree.vue'
import RoleUser from './role-user.vue'
import { copy } from '@/components/common'

const STATUS_INFO = {
  1: {
    confirmTip: '启用'
  },
  0: {
    confirmTip: '停用'
  }
}

export default {
  components: {
    vSearch: Search,
    AddUserDialog,
    MenuTreeDialog,
    OrgsTreeDialog,
    RoleUser
  },
  mixins: [tableMixin],
  data() {
    return {
      hasRoleUser: false,
      organizeVisible: false,
      hasRoleDialog: false,
      hasMenuTree: false,
      hasOrgsTree: false,
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
        name: ''
      },
      editRow: null,
      roleId: null,
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
      nowPage: 0,
      size: 10,
      isMcn: false,
      hasAddDialog: false,
      typeDatas: [],
      attributionDatas: [],
      loading: false
    }
  },
  created() {
    this.buildFormConf()
    this.getRoleData()
    // 获取基础数据
    this.getRoleList()
  },
  methods: {
    onConfirm(row, type) {
      this.$confirm(`是否确认${STATUS_INFO[type].confirmTip}角色?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await $updateRole({
            id: row.id,
            status: type,
            updateType: 2
          })
          if (res.code === 1) {
            this.$message.success(res.message || '操作成功')
            this.getRoleList()
          } else {
            this.$message.error(res.message || '网络错误')
          }
        })
    },
    /**
     * 获取角色列表
     */
    async getRoleList() {
      this.loading = true
      const res = await $getRoleList({
        ...this.searchData,
        pageNum: this.nowPage,
        size: this.size
      })
      if (res.code === 1) {
        this.loading = false
        const list = copy(res.data)
        list.forEach(item => {
          const attributionDatas = this.attributionDatas.filter(val => val.attributionId === item.attributionId)
          item.attributionName = attributionDatas.length ? attributionDatas[0].attributionName : ''
          const typeDatas = this.typeDatas.filter(val => val.roleTypeId === item.roleTypeId)
          item.roleTypeName = typeDatas.length ? typeDatas[0].roleTypeName : ''
        })
        this.tableData = list
        this.total = res.total
      } else {
        this.loading = false
        this.$message.error(res.message || '网络错误')
      }
    },
    onRole(row) {
      this.editRow = row
      this.hasRoleDialog = true
    },
    onAdd() {
      this.hasAddDialog = true
      this.editRow = null
    },
    onEdit(row) {
      this.editRow = row
      this.hasAddDialog = true
    },
    onBind(row) {
      this.editRow = row
      this.hasMenuTree = true
    },
    onOrgs(row) {
      this.editRow = row
      this.hasOrgsTree = true
    },
    // 查看绑定的用户
    hanleUserShow(row) {
      this.roleId = row.id
      this.hasRoleUser = true
    },
    getRoleData() {
      $getRoleData().then(res => {
        if (res.code === 1 && res.data) {
          this.typeDatas = res.data.roleTypeVos
          this.attributionDatas = res.data.roleAttributionVos
          this.formConf.normal.forEach(item => {
            if (item.key === 'roleTypeId') {
              item.data = this.typeDatas
            }
            if (item.key === 'attributionId') {
              item.data = this.attributionDatas
            }
          })
        }
      }).catch(err => {
        console.error(err)
      })
    },
    buildFormConf() {
      this.formConf = {
        normal: [
          {
            type: 'input',
            key: 'name',
            data: [],
            conf: {
              placeholder: '请输入角色名称'
            },
            attrs: {
              filterable: true
            }
          },
          {
            type: 'select',
            key: 'roleTypeId',
            data: [],
            conf: {
              placeholder: '请选择角色类型'
            },
            optionLabelKey: 'roleTypeName',
            optionValKey: 'roleTypeId',
            attrs: {
              filterable: true
            }
          },
          {
            type: 'select',
            key: 'attributionId',
            data: [],
            conf: {
              placeholder: '请选择角色归属'
            },
            optionLabelKey: 'attributionName',
            optionValKey: 'attributionId',
            attrs: {
              filterable: true
            }
          }
        ],
        hasExport: false
      }
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData = data
      this.nowPage = 0
      this.getRoleList()
    }
  }
}
</script>
