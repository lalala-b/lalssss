<template>
  <Wrap class="P-pirate">
    <div class="search-view">
      <el-form ref="form" :model="form" :inline="true">
        <el-form-item>
          <el-radio-group v-model="nowTypes.list" @change="onTypeChange">
            <template v-for="item in types.list">
              <el-radio-button
                v-if="$permission(item.permissionName)"
                :key="item.label"
                data-burry_btn_name="tab"
                :data-burry_title="item.text"
                :label="item.label"
              >{{ item.text }}</el-radio-button>
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-select
            v-if="$permission('pirate_fans_org')"
            v-model="form.orgId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in orgData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="nowTypes.list === 1 || nowTypes.list === 3">
          <el-radio-group v-model="nowTypes.date" @change="onDateTypeChange">
            <el-radio-button
              v-for="item in types.date"
              :key="item.label"
              :label="item.label"
            >{{ item.text }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="nowTypes.list === 0" label="时间范围">
          <el-date-picker
            v-model="form.queryDate"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          />
        </el-form-item>

        <el-form-item
          v-if="(nowTypes.list === 1 || nowTypes.list === 2 || nowTypes.list === 3)"
          label="时间范围"
        >
          <el-date-picker
            v-model="form.timerange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy/MM/dd"
          />
        </el-form-item>

        <el-form-item>
          <el-select v-model="form.platId" placeholder="全部平台" value-key="val" clearable>
            <el-option v-for="item in platformData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="nowTypes.list === 2" label="粉丝数">
          <el-radio-group v-model="form.fansAll">
            <el-radio-button
              v-for="item in types.rangs"
              :key="item.label"
              data-burry_btn_name="tab"
              :data-burry_title="item.text"
              :label="item.label"
            >{{ item.text }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button v-log type="primary" data-burry_btn_name="search" @click="onSearch">查询</el-button>
          <el-button
            v-if="nowTypes.list === 2 && $permission('pirate_fans_expot')"
            v-log
            type="primary"
            plain
            @click="onExport"
          >导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" class="table-view">
      <el-table
        ref="accounts"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="账号" prop="accountName" />
        <el-table-column prop="platName" label="平台" />
        <el-table-column prop="belongName" label="归属团队" />
        <el-table-column v-if="nowTypes.list === 0" prop="fansAll" label="总粉丝量" sortable="custom" />
        <el-table-column
          v-if="(nowTypes.list === 1 || nowTypes.list === 2 || nowTypes.list === 3)"
          prop="fansPv"
          label="粉丝增量"
          sortable="custom"
        />
        <el-table-column v-if="nowTypes.list === 2" prop="fansAll" label="粉丝数" sortable="custom" />
        <el-table-column label="操作" width="140">
          <template slot-scope="s">
            <IconTip
              v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
              icon-class="iconxiangqing"
              content="查看详情"
              @click="handleShow(s.row)"
            />
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
        />
      </div>
    </div>
  </Wrap>
</template>
<script>
import qs from 'qs'
import { IconTip } from 'components'
import { date, isArray } from '@/components/common'
import { $getBillboardAllFans, $getBillboardIncreaseFans, $getBillboardIncreaseNew, $getCondition } from '@/api/pirate'

const A_DAY = 864e5

export default {
  components: {
    IconTip
  },
  data() {
    var today = date('Y/m/d 00:00:00', new Date())
    var todayTs = new Date(today).getTime() - 1
    var yesterday = date('Y/m/d', new Date(new Date(today).getTime() - 1))

    return {
      videoDialogData: {},
      dialogShow: false,
      form: {
        orgId: '',
        platId: '',
        timerange: [],
        queryDate: yesterday,
        fansAll: 1e5
      },
      types: {
        list: [
          {
            text: '榜单',
            label: 0,
            request: $getBillboardAllFans
          },
          {
            text: '涨粉榜',
            label: 1,
            request: $getBillboardIncreaseFans,
            query: { queryFansType: 1 }
          },
          {
            text: '掉粉榜',
            label: 3,
            request: $getBillboardIncreaseFans,
            query: { status: 0, queryFansType: 2 },
            permissionName: 'pirate_fans_off'
          },
          {
            text: '新晋潜力账号',
            label: 2,
            request: $getBillboardIncreaseNew,
            permissionName: 'pirate_fans_account'
          }
        ],
        date: [
          { text: '日榜', label: 1 },
          { text: '周榜', label: 7 },
          { text: '月榜', label: 30 }
        ],
        group: [
          { text: '全部', val: '' },
          { text: '海盗军团', val: 1 },
          { text: '乾派', val: 2 }
        ],
        plats: [],
        rangs: [
          { text: '10w以上', label: 1e5 },
          { text: '100w以上', label: 1e6 }
        ]
      },
      nowTypes: {
        list: 0,
        rangs: -1,
        date: 1
      },
      total: 0,
      nowPage: 1,
      tableData: [],
      loading: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > todayTs
        }
      },
      pickerType: 'date',
      hasExport: true,
      pageBurryType: 'fenyun_model',
      platformData: [],
      orgData: [],
      uriMap: {},
      queryMap: {}
    }
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.nowPage = nVal
        this.getList(nVal)
      }
    }
  },
  created() {
    const { query } = this.$route
    this.$req = null
    var uriMap = {}
    var queryMap = {}
    this.types.list.forEach((item, index) => {
      uriMap[item.label] = item.request
      queryMap[item.label] = item.query
    })
    this.uriMap = uriMap
    this.queryMap = queryMap
    if (query.list === 1) {
      this.nowTypes.list = 1
      this.onTypeChange(query.list)
    } else {
      this.getList()
    }
  },
  mounted() {
    this.getCondition()
  },
  methods: {
    async getCondition() {
      const res = await $getCondition()
      if (res.code === 1) {
        this.platformData = res.data.platList.map(item => {
          return {
            value: item.platId,
            label: item.platName
          }
        })
        this.orgData = res.data.orgList.map(item => {
          return {
            value: item.orgId,
            label: item.orgName
          }
        })
      }
    },
    resetPage() {
      const nowType = window.sessionStorage.getItem('nowTypesList')
      if (nowType) {
        this.nowTypes.list = nowType
        this.$forceUpdate()
      }
    },

    getPlatId(platName) {
      let platId = -1
      platName = platName.toUpperCase()
      switch (platName) {
        case '抖音':
          platId = 25
          break
        case '快手':
          platId = 26
          break
        case 'B站':
          platId = 2
          break
        default:
          break
      }
      return platId
    },

    handleShow(rowData) {
      const platId = this.getPlatId(rowData.platName)
      if ([25, 26].includes(platId)) {
       this.$router.push({
          path: `/details/account/${platId}/${rowData.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${platId}/${rowData.accountId}`,
          query: {
            accountType: rowData.accountType,
            _blank: true
          }
        })
      } else if (platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${platId}/${rowData.accountId}`,
          query: {
            accountType: rowData.accountType,
            _blank: true
          }
        })
      } else {
        window.open(`#/account-manage/account-detail?accountId=${rowData.accountId}`)
      }
    },
    /**
     * 榜单类型切换响应函数
     * @param  {Object} val  榜单类型
     */
    onTypeChange(val) {
      this.$bus.$emit('upLog', {
        operation_module: this.types.list.find(item => (item.label === val)).text
      })
      this.nowPage = 1
      // this.tableData = [];

      var today = date('Y/m/d 00:00:00', new Date())
      var yesterday = date('Y/m/d', new Date(new Date(today).getTime() - 1))

      today = today.split(' ')[0]
      this.pickerType = val ? 'daterange' : 'date'
      this.resetForm()
      delete this.form.status
      this.nowTypes.date = 1
      switch (val) {
          case 0:
            this.form.timerange = []
            this.form.queryDate = yesterday
            break

          case 1:
            this.form.queryDate = ''
            this.form.fansAll = ''
            this.form.timerange = [yesterday, yesterday]
            break

          case 3:
            this.form.queryDate = ''
            this.form.status = 0
            this.form.fansAll = ''
            this.form.timerange = [yesterday, yesterday]
            break

          case 2:
            this.form.queryDate = ''
            this.form.timerange = [
              date('Y-m-d', new Date(new Date(yesterday).getTime() - 864e5 * 6)),
              yesterday
            ]
            break
      }
      this.getList(1, val)
    },
    onDateTypeChange(val) {
      const text = this.types.date.find(item => (item.label === val)).text
      const preText = this.types.list.find(item => (item.label === this.nowTypes.list)).text
      const operation_module = `${preText}-${text}`
      this.$bus.$emit('upLog', {
        operation_module
      })
      var ts = A_DAY * val
      var start = ''
      var end = ''
      if (ts) {
        start = date('Y/m/d', new Date(Date.now() - ts))
        end = date('Y/m/d', new Date(Date.now() - A_DAY))
      }
      if (this.form.timerange === undefined) {
        this.$set(this.form, 'timerange', [start, end])
      } else {
        this.form.timerange = [start, end]
      }
      this.getList(1)
    },
    // 重置表单数据
    resetForm() {
      this.form.queryDate = ''
      this.form.timerange = []
      this.form.fansAll = 1e5
    },
    onSearch() {
      if (this.nowTypes.list === 2 && !this.form.timerange) {
        return this.$message.error('请选择时间范围')
      }
      this.nowPage = 1
      this.getList(1)
    },
    /**
     * 排序
     * @param  {String}  prop   列名
     * @param  {String}  order  排序方式
     */
    doSort({ prop, order }) {
      var determined
      switch (order) {
          case 'ascending':
            determined = `${prop}`
            break

          case 'descending':
            determined = `-${prop}`
            break

          case null:
            determined = ''
            break
      }
      this.form.determined = determined
      this.getList()
    },
    buildQuery(pageNum) {
      const query = {
        pageNum,
        ...this.form
      }
      if (isArray(query.timerange)) {
        query.dateStart = query.timerange[0]
        query.dateEnd = query.timerange[1] || ''
        query.dateEnd && (query.dateEnd += ' 23:59:59')
        delete query.timerange
      }

      // var form = this.form
      // Object.keys(this.form).forEach(key => {
      //   switch (key) {
      //       case 'timerange':
      //         const timerange = form.timerange
      //         if (isArray(timerange)) {
      //           query.dateStart = timerange[0] || ''
      //           query.dateEnd = timerange[1] || ''
      //         } else {
      //           query.queryDate = timerange || ''
      //         }
      //         break

      //       default:
      //         query[key] = this.form[key]
      //   }
      // })
      return query
    },
    /**
     * 获取总榜列表数据
     * @param  {Number}  pageNum  页码
     * @return {Object}            Promise 对象
     */
    getList(pageNum = 1, type) {
      type = type || this.nowTypes.list
      var request = this.uriMap[type]
      var query = { ...this.buildQuery(pageNum), ...this.queryMap[type] }
      this.loading = true
      return request(query).then(re => {
        if (type === this.nowTypes.list) {
          this.loading = false
          if (re.code === 1) {
            this.tableData = re.data
            this.total = re.total
          } else {
            this.$message.error(re.message)
            this.tableData = []
            this.total = 0
          }
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.loading = false
        this.$message.error(err.message)
      })
    },
    onExport() {
      if (this.nowTypes.list === 2 && !this.form.timerange) {
        return this.$message.error('请选择时间范围')
      }
      const query = this.buildQuery(1)
      delete query.pageNum
      window.open(`/api/rank/fans/listNewPotential/export?${qs.stringify(query)}`)
    }
  }
}
</script>
