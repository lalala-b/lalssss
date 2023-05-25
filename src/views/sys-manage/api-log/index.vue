<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-26 16:13:36
 * @LastEditTime: 2020-12-14 17:08:40
 * @LastEditors: Linjie
-->
<template>
  <Wrap>
    <el-form :inline="true" class="search-view flex-rows">
      <el-form-item>
        <el-select v-model="logTypes">
          <el-option :value="1" label="正常日志" />
          <el-option :value="0" label="异常日志" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.title" clearable placeholder="标题" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.requestParam" clearable placeholder="请求参数" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.serverIp" clearable placeholder="服务器地址" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.clientIp" clearable placeholder="客户端地址" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.createBy" clearable placeholder="创建人" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="date"
          type="daterange"
          clearable
          placeholder="创建时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchData.requestType" clearable placeholder="请求类型">
          <el-option v-for="item in requestType" :key="item" :value="item">{{ item }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          data-burry_btn_name="search"
          @click="getList"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-view">
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="请求参数：">
                <span>{{ props.row.requestParam }}</span>
              </el-form-item>
            </el-form>
            <template v-if="!logTypes">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="堆栈：">
                  <span>{{ props.row.stackTrace }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="异常信息：">
                  <span style="color: red">{{ props.row.exceptionMsg }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="文件名：">
                  <span>{{ props.row.fileName }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="错误行数：">
                  <span>{{ props.row.errLineNumber }}</span>
                </el-form-item>
              </el-form>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="serverIp" label="服务器地址" width="180" />
        <!-- <el-table-column prop="serverName" label="服务器名字" /> -->
        <el-table-column prop="env" label="服务器环境" />
        <el-table-column prop="clientIp" label="客户端地址" />
        <el-table-column prop="requestUri" label="请求地址" width="280" />
        <el-table-column prop="requestType" label="请求类型" />
        <!-- <el-table-column prop="requestParam" label="请求参数" /> -->
        <el-table-column prop="clazzName" label="类名" width="240" />
        <el-table-column prop="methodName" label="方法名" />
        <el-table-column prop="requestType" label="请求类型" />
        <el-table-column prop="createBy" label="创建人" />
        <el-table-column prop="createTime" label="创建时间" />
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
    </div>
  </Wrap>
</template>
<script>
import tableMixin from '@/mixins/table'
import { $getSucessList, $getErrorList } from '@/api/api-log'

export default {
  name: 'ApiLog',
  mixins: [tableMixin],
  data() {
    return {
      logTypes: 0,
      searchData: {
        pageNum: 1,
        dateStart: '',
        dateEnd: '',
        title: '',
        serverIp: '',
        clientIp: '',
        createBy: '',
        createTime: '',
        requestParam: '',
        requestType: ''
      },
      date: undefined,
      requestType: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      let request
      if (this.logTypes) {
        request = $getSucessList
      } else {
        request = $getErrorList
      }
      const date = this.date
      if (date) {
        this.searchData.dateStart = date[0] + ' 00:00:00'
        this.searchData.dateEnd = date[1] + ' 23:59:59'
      } else {
        this.searchData.dateStart = ''
        this.searchData.dateEnd = ''
      }
      request(this.searchData).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    }
  }
}
</script>
