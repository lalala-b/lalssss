<template>
  <div class="P-contents">
    <div class="P-contentsCon">
      <Wrap class="search-view">
        <v-search
          ref="search"
          :config="formConf"
          @submit="onSubmit"
          @change="onSearchChange"
          @export="onExport"
        >
          <template v-slot:normal="target">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="target.model.timerange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @change="onSearchChange(target.model.timerange, {'key': 'timerange'}, '', '', target.model)"
              />
            </el-form-item>
          </template>
        </v-search>
      </Wrap>

      <Wrap class="table-view m-t-16">
        <div class="table-btn-view m-b-16">
          <el-button type="primary" size="small" @click="onCreate">新增内容</el-button>
        </div>
        <el-table
          ref="flow"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          cell-class-name="table-cell"
          header-row-class-name="table-header"
        >
          <el-table-column align="center" width="60" label="序号" type="index" :index="tableIndex" />
          <el-table-column label="内容" width="100">
            <template slot-scope="s">{{ FIRST_CATE[String(s.row.firstCate)] || "" }}</template>
          </el-table-column>
          <el-table-column prop="title" label="标题" align="left" />
          <el-table-column label="类别" width="150">
            <template slot-scope="s">{{ SECOND_CATE[s.row.secondCate] || "" }}</template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="s">{{ STATUS_MAP[s.row.isPushed] || "" }}</template>
          </el-table-column>
          <el-table-column prop="pushedTime" width="170" label="发布时间" />
          <el-table-column label="操作" width="120">
            <template slot-scope="{row}">
              <div class="flex flex-justify-around">
                <el-link type="primary" @click="onDo(row, 'edit')">编辑</el-link>
                <el-link :disabled="row.isPushed === 1" type="primary" @click="handleRelease(row)">发布</el-link>
                <el-link type="primary" @click="handleDelect(row)">删除</el-link>
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
            :current-page.sync="searchData.pageNum"
            @current-change="getList"
          />
        </div>
      </Wrap>
    </div>
    <EditDialog v-if="showDialog" v-model="showDialog" :data="editData" :is-edit="isEdit" @success="getList" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import Search from '@/components/Search'
import { copy } from '@/components/common'
import { $getContentList, $delContentArticle, $publishContentArticle } from '@/api/backend-manage'
import qs from 'qs'
import './content.scss'
import EditDialog from './_com/EditDialog'
import { FIRST_CATE, SECOND_CATE } from './const'
/**
 * 发布状态
 * @type {Object}
 */
const STATUS_MAP = {
  '1': '已发布',
  '0': '未发布'
}

export default {
  components: {
    vSearch: Search,
    EditDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      isEdit: false,
      showDialog: false,
      formConf: {},
      searchData: {
        type: 2,
        onlyPushed: 0,
        firstCate: '',
        secondCate: '',
        keyword: '',
        beginDate: '',
        endDate: ''
      },
      FIRST_CATE,
      SECOND_CATE,
      STATUS_MAP,
      dialogType: '',
      dialogStatus: false,
      dialogLoading: false,
      dialogData: {},
      disabled: false,
      editData: {}
    }
  },
  created() {
    this.buildFormConf()
    this.getList()
  },
  methods: {
  /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      const searchData = copy(data)
      const timerange = searchData.timerange
      if (timerange && timerange.length) {
        searchData.beginDate = timerange[0] ? `${timerange[0]} 00:00:00` : ''
        searchData.endDate = timerange[1] ? `${timerange[1]} 23:59:59` : ''
      }
      delete searchData.timerange
      searchData.pageNum = 1
      Object.assign(this.searchData, searchData)
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
      switch (item.key) {
          case 'keyword':
            this.searchData.type = val ? 1 : 2
            this.searchData.keyword = val
            break

          case 'timerange':
            if (!val || !val.length) {
              this.searchData.beginDate = ''
              this.searchData.endDate = ''
            }
            break

          default:
            this.searchData[item.key] = val
      }
    },
    /**
     * 获取列表数据
     * @param  {Number} [pageNum=1] 页码
     * @return {Object}              请求 Promise 对象
     */
    getList() {
      this.loading = true
      const params = copy(this.searchData)
      delete params.onlyPushed
      $getContentList(params).then(
        re => {
          this.loading = false
          if (re.data) {
            this.tableData = re.data
            this.total = re.total
          }
        }, err => {
          this.loading = false
        }
      )
    },
    buildFormConf() {
      const FIRST_CATE_ARRAY = []
      const SECOND_CATE_ARRAY = []
      for (const key in FIRST_CATE) {
        FIRST_CATE_ARRAY.push({
          text: FIRST_CATE[key],
          val: key
        })
      }
      for (const key in SECOND_CATE) {
        SECOND_CATE_ARRAY.push({
          text: SECOND_CATE[key],
          val: key
        })
      }
      var formConf = {
        normal: [
          {
            type: 'select',
            key: 'firstCate',
            data: FIRST_CATE_ARRAY,
            conf: {
              placeholder: '请选择内容'
            }
          },
          {
            type: 'input',
            key: 'keyword',
            conf: {
              placeholder: '请输入标题'
            }
          },
          {
            type: 'select',
            key: 'secondCate',
            data: SECOND_CATE_ARRAY,
            conf: {
              placeholder: '请选择类别'
            }
          },
          {
            type: 'date-picker',
            key: 'timerange',
            value: [this.searchData.beginDate, this.searchData.endDate],
            hide: true
          }
        ],
        hasExport: true
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
     * 创建
     */
    onCreate() {
      this.isEdit = false
      this.showDialog = true
      this.editData = {}
    },
    onDo(item) {
      this.isEdit = true
      this.showDialog = true
      this.editData = item
    },
    /**
     * 导出
     * @param  {Object}  导出的基本请求参数
     */
    onExport(data) {
      var searchData = copy(data)
      var timerange = searchData.timerange
      if (timerange && timerange.length) {
        searchData.beginDate = timerange[0] ? `${timerange[0]} 00:00:00` : ''
        searchData.endDate = timerange[1] ? `${timerange[1]} 23:59:59` : ''
      }
      delete searchData.timerange
      window.open(`/api/admin/exportArticleExcel?${qs.stringify(searchData)}&componentId=${this.$componentId}`)
    },
    /**
     * 导出数据
     * @param {Object} 导出参数
     */
    exportData(data) {
      var str = []
      Object.keys(data).forEach(function(key) {
        str.push(`${key}=${encodeURIComponent(data[key])}`)
      })
      str = str.join('&')
      // str = `${this.$request.getApi("/exportContentData")}?${str}`;
      var win = window.open(str)
      if (!win) {
        this.$message({
          message: '请允许在本页打开新窗口',
          type: 'error'
        })
      }
    },
    tableIndex(i) {
      return i + 1 + 20 * (this.nowPage - 1)
    },
    confirm(text) {
      return this.$confirm(text, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    async handleRelease(row) {
      await this.confirm('确认发布这条数据吗？')
      const res = await $publishContentArticle({ artId: row.artId })
      if (res.code === 1) {
        this.$message.success('发布成功')
        this.getList()
      } else {
        this.$message.error(res.message)
      }
    },
    async handleDelect(row) {
      await this.confirm('确认删除这条数据吗？')
      const res = await $delContentArticle({ artId: row.artId })
      if (res.code === 1) {
        this.$message.success('删除成功')
        this.getList()
      } else {
        this.$message.error(res.message)
      }
    }
  }
}
</script>
