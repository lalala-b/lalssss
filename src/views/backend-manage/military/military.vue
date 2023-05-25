<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
      >
        <template v-slot:prv>
          <department-select v-model="searchData.orgId" :inline="true" :hidden-level="[1]" />
        </template>
        <template v-slot:normal>
          <el-form-item label="入职时间">
            <el-date-picker
              v-model="searchData.entryDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="离职时间">
            <el-date-picker
              v-model="searchData.leaveDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap class="m-t-16">
      <div class="table-view">
        <div class="table-btn-view m-b-16">
          <el-button type="primary" @click="handleImportToggele">导入人员信息</el-button>
        </div>
        <el-table
          ref="client"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column label="序号" prop="userId" />
          <el-table-column label="工号" prop="jobId" />
          <el-table-column label="姓名" prop="realname" />
          <el-table-column label="性别" prop="sex" />
          <el-table-column label="组织" prop="orgPath" width="250" />
          <el-table-column label="职位" prop="position" />
          <el-table-column label="人员状态">
            <template slot-scope="s">{{ WORK_STATUS_MAP[s.row.isWork] || "" }}</template>
          </el-table-column>
          <el-table-column label="入职时间" prop="entryDate" />
          <el-table-column label="离职时间" prop="leaveDate" />
          <el-table-column label="操作">
            <template slot-scope="s">
              <el-link type="primary" @click="onLook(s.row)">查看详情</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation-view">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="searchData.size"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getList"
          />
        </div>
      </div>
    </Wrap>
    <el-dialog
      title="导入用户信息"
      :visible.sync="importStatus"
      width="400px"
      :before-close="handleImportToggele"
    >
      <el-upload
        v-loading="uploading"
        class="upload-view"
        name="file"
        accept=".xls,.xlsx"
        drag
        :with-credentials="true"
        :on-success="uploadSuccess"
        :on-error="onImportError"
        :before-upload="beforeUpload"
        :show-file-list="false"
        action="/api/mng/user/basis/import"
        element-loading-text="正在上传文件..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.6)"
      >
        <div>
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或点击上传
            <em>点击上传</em>
          </div>
        </div>
      </el-upload>
      <div>导入
        <el-link
          type="primary"
          href="/api/mng/user/basis/export"
          target="_blank"
          :underline="false"
        >模板下载</el-link></div>
    </el-dialog>
  </div>
</template>

<script>
import Search from '@/components/Search'
import Statistics from 'components'
import departmentSelect from '@/components/DepartmentSelect'

import tableMixin from '@/mixins/table'
import { copy } from '@/components/common'
import { $getBasis, $getWorks, $getPositions, $getusers } from '@/api/backend-manage'

const WORK_STATUS_MAP = {
  '0': '在职',
  '1': '离职'
}

const HD_WORK_STATUS = Object.keys(WORK_STATUS_MAP).map(function(key) {
  return {
    val: Number(key),
    text: WORK_STATUS_MAP[key]
  }
})

export default {
  components: {
    vSearch: Search,
    departmentSelect,
    Statistics
  },
  mixins: [tableMixin],
  data() {
    return {
      summaryItems: [
        {
          key: 'inTotal',
          text: '当前在职人数',
          val: 0
        },
        {
          key: 'total',
          text: '入职人数',
          val: 0
        },
        {
          key: 'outTotal',
          text: '离职人数',
          val: 0
        }
      ],
      searchData: {
        orgId: '',
        isWork: '',
        position: '',
        userId: '',
        entryDate: '',
        leaveDate: '',
        determined: '',
        size: 20,
        pageNum: 1
      },
      formConf: {},
      normalFormItemMap: {},
      WORK_STATUS_MAP,
      importStatus: false,
      uploading: false,
      uploadTplUrl: ''
    }
  },
  watch: {
    'searchData.orgId'() {
      this.searchData.userId = ''
      this.getusers()
    }
  },
  created() {
    this._searchData = copy(this.searchData)
    this.getList()
    this.buildFormConf()
    this.getTotalWorks()
    this.getPositions()
    this.getusers()
  },
  methods: {
    getusers() {
      $getusers({ orgId: this.searchData.orgId }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.userId.data = res.data
        }
      })
    },
    getPositions() {
      $getPositions().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.position.data = res.data
        }
      })
    },
    getTotalWorks() {
      if (this._searchData.entryDate) {
        this._searchData.entryDateStart = this._searchData.entryDate[0]
        this._searchData.entryDateEnd = this._searchData.entryDate[1]
        delete this._searchData.entryDate
      }

      if (this._searchData.leaveDate) {
        this._searchData.leaveDateStart = this._searchData.entryDate[0]
        this._searchData.leaveDateEnd = this._searchData.entryDate[1]
        delete this._searchData.leaveDate
      }
      $getWorks(this._searchData).then((res) => {
        if (res.code === 1) {
          this.summaryItems = this.summaryItems.map((item) => {
            if (res.data[item.key] !== undefined || res.data[item.key] !== null) {
              item.val = res.data[item.key]
            }
            return item
          })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onSubmit(item) {
      this.searchData = Object.assign(this.searchData, item)
      this.searchData.pageNum = 1
      this._searchData = copy(this.searchData)
      this.getList()
      this.getTotalWorks()
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
      // console.log(arguments)
    },
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'isWork',
          conf: {
            placeholder: '请选择人员状态'
          },
          data: copy(HD_WORK_STATUS)
        },
        {
          type: 'select',
          key: 'position',
          conf: {
            placeholder: '请选择人员职位'
          },
          data: [],
          optionValKey: 'position',
          optionLabelKey: 'position'
        },
        {
          type: 'select',
          key: 'userId',
          data: [],
          conf: {
            placeholder: '请输入人员名称'
          },
          optionValKey: 'id',
          optionLabelKey: 'realname'
        }
      ]
      const normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: false
      }
    },

    /**
     * 获取表格数据
    */
    getList() {
      this.loading = true
      this._searchData.pageNum = this.searchData.pageNum
      if (this._searchData.entryDate) {
        this._searchData.entryDateStart = this._searchData.entryDate[0]
        this._searchData.entryDateEnd = this._searchData.entryDate[1]
        delete this._searchData.entryDate
      }

      if (this._searchData.leaveDate) {
        this._searchData.leaveDateStart = this._searchData.leaveDate[0]
        this._searchData.leaveDateEnd = this._searchData.leaveDate[1]
        delete this._searchData.leaveDate
      }

      $getBasis(this._searchData).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    handleImportToggele() {
      this.importStatus = !this.importStatus
    },
    uploadSuccess(res) {
      if (res.code === 1) {
        if (res.data.fail_user === 0) {
          this.$message({
            message: `提交${res.data.accept_user}行员工信息，导入成功${res.data.success_user}行！`,
            type: 'success'
          })
        } else {
          const tplUrl = `/api/mng/user/basis/exportfail?uuid=${res.data.uuid}`
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `提交${res.data.accept_user}行员工信息，导入成功${res.data.success_user}行，导入失败${res.data.fail_user}行！ <a target='_blank' href='${tplUrl}'>下载明细</a>`,
            duration: 0,
            type: 'warning'
          })
        }
      } else {
        this.$message.error(res.message)
      }
      this.uploading = false
    },
    onImportError() {
      this.uploading = false
    },
    beforeUpload(file) {
      var re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        this.uploadAccountLoading = true
      } else {
        this.$tip('只支持 Excel 文件')
      }
      this.uploading = true
      return re
    },
    onLook(row) {
      document.querySelector('.app-main').scrollTo(0, 0)
      const userId = row.userId
      this.$router.push({
        path: `/backend-manage/military-detail`,
        query: { userId }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .P-client {
    .search-view {
      padding-bottom: 20px;
    }
  }
</style>
