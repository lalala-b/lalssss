<template>
  <div class="testarea">
    <div style="width: 600px">
      <UploadImg v-model="uploadImg" :limit="3" />
    </div>
    <div style="width: 600px">
      <Register ref="register" />
      <el-button type="primary" @click="handleSave">保存</el-button>
    </div>
    <div>
      <h3>sentry上报</h3>
      <div>
        <el-button type="primary" @click="handleUpSentry">上报</el-button>
      </div>
    </div>
    <div class="area">
      <h3>Pagination 分页</h3>
      <div>
        <el-pagination
          :current-page="pager.current"
          :page-size="20"
          layout="total, prev, pager, next, jumper"
          :total="400"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <div class="area" style="width: 700px">
      <h3>Table 表格</h3>
      <div>
        <el-table
          v-scrollbar
          :data="table.data"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="date"
            label="日期"
            width="180"
          />
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="address"
            label="地址"
          />
        </el-table>
      </div>
    </div>
    <div class="area">
      <h3>Tag 标签</h3>
      <div>
        <el-tag style="margin:0 10px 0 0;">标签一</el-tag>
        <el-tag size="mini">标签 Mini</el-tag>
      </div>
    </div>
    <div class="area" style="width:700px;">
      <h3>Tabs 标签页</h3>
      <div>
        <el-tabs v-model="tabs.act">
          <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="area">
      <h3>Radio 单选框 </h3>
      <div>
        <el-radio v-model="radio.value" label="1">备选项</el-radio>
        <el-radio v-model="radio.value" label="2">备选项</el-radio>
      </div>
    </div>
    <div class="area">
      <h3>Input 输入框</h3>
      <div>
        <el-input v-model="input.value" placeholder="请输入内容" />
      </div>
      <div>
        <el-input placeholder="请输入内容" />
      </div>
      <div class="el-form-item is-error is-required">
        <el-input v-model="input.value" placeholder="请输入内容" />
      </div>
      <div>
        <el-input placeholder="请输入内容" :disabled="true" />
      </div>
    </div>
    <div class="area" style="width:700px">
      <h3>Checkbox 多选框</h3>
      <div>
        <el-checkbox-group v-model="checkbox.list">
          <el-checkbox label="复选框 A" />
          <el-checkbox label="复选框 B" />
          <el-checkbox label="复选框 C" />
          <el-checkbox label="禁用" disabled />
          <el-checkbox label="选中且禁用" disabled />
        </el-checkbox-group>
      </div>
    </div>
    <div class="area">
      <h3>Selected 选择器</h3>
      <div>
        <el-select v-model="select.value" placeholder="请选择">
          <el-option
            v-for="item in select.items"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-select v-model="select.value" disabled placeholder="请选择">
          <el-option
            v-for="item in select.items"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div>
        <el-select v-model="select.value2" multiple placeholder="请选择">
          <el-option
            v-for="item in select.items"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </div>
    <div class="area" style="width: 600px">
      <h3>图表</h3>
      <div>
        <v-chart :loading="chart.loading" :config="config" />
        <!-- <v-chart :loading="chart.loading" type="line2"></v-chart> -->
      </div>
    </div>
    <backtop target="#app" />
    <div v-if="$permission('1')">测试</div>
  </div>
</template>
<script>
import { SentryCapture } from '@zz-common/sentry'

import { Backtop, VChart, UploadImg } from 'components'
import Register from '@/views/login/register/form.vue'
import { $newRegister } from '@/api/user'

import './index.scss'
export default {
  name: 'Test',
  components: {
    Backtop,
    VChart,
    Register,
    UploadImg
  },
  data() {
    return {
      uploadImg: [],
      chart: {
        loading: false
      },
      radio: {
        value: '1'
      },
      input: {
        value: 233
      },
      checkbox: {
        list: ['选中且禁用', '复选框 A']
      },
      pager: {
        current: 4
      },
      table: {
        data: [
          {
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }
        ]
      },
      tabs: {
        act: 'second'
      },
      select: {
        items: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        value2: []
      },
      config: {
        legend: {
            data: ['销量', '销量2']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: [{
          type: 'value',
          name: '销量',
            interval: 10

        }, {
          type: 'value',
          name: '销量2',
          interval: 100,
          max: 400,
          min: 0
        }],
        series: [{
            name: '销量',
            type: 'line',
            smooth: true,
            data: [5, 20, 36, 10, 10, 20]
        }, {
            yAxisIndex: 1,
            name: '销量2',
            type: 'line',
            smooth: true,
            data: [150, 220, 340, 120, 110, 210]
        }]
      }
    }
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.chart.loading = true
      setTimeout(() => {
        this.chart.loading = false
      }, 3000)
    })
  },
  methods: {
    handleUpSentry() {
      SentryCapture('demo', 2)
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    handleSave() {
      this.$refs.register.handleSave().then(res => {
        console.log(res)
        $newRegister(res).then(res => {
          if (res.code === 1) {
            this.$message.success('注册成功')
          } else {
            this.$message.error(res.message)
          }
        })
      })
    }
  }
}
</script>
