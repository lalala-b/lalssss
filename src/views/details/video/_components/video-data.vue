<template>
  <div class="C-video-data">
    <div class="flex flex-align-center flex-justify-between m-b-16">
      <el-radio-group v-model="dataType" size="small" @change="handlePoints">
        <el-radio-button :label="1">分日数据</el-radio-button>
        <el-radio-button :label="2">分时数据</el-radio-button>
      </el-radio-group>
      <div class="data-form">
        <!-- <el-radio-group v-model="form.type">
        <el-radio-button :label="1">天</el-radio-button>
        <el-radio-button :label="2">小时</el-radio-button>
      </el-radio-group> -->
        <el-date-picker
          v-if="dataType===2"
          v-model="form.date1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="accountFansChart"
        />
        <el-date-picker
          v-else
          v-model="form.date"
          type="daterange"
          align="right"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="margin-left: 12px;"
          @change="accountFansChart"
        />
        <el-select v-model="form.releaseDate" style="margin-left: 12px;" @change="handleChange">
          <el-option v-for="(item, index) in configDate" :key="index" :value="item.value" :label="item.label">
            <div v-if="item.type === 'custom'" class="C-video-data-custom-date">
              <span>发布后</span>
              <div class="custom-input" @click.stop.prevent="stopPrevent" @mousedown.stop="stopPrevent" @mouseup.stop.prevent="stopPrevent">
                <el-input :value="form.customDate" size="mini" @input="form.customDate = arguments[0].replace(/[^\d]/g, '')" @change="handleCustomChange" @blur="handleCustom" />
              </div>
              <span>天</span>
            </div>
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-loading="loading" class="flex chart-wrapper">
      <div class="flex-item">
        <Title title="点赞趋势" class="p-0" icon="icondianzan_fill" />
        <!-- <linechart v-if="chartsData.giveLine" :config="lineConfig" :items="chartsData.giveLine" /> -->
        <VChart v-if="chartsData.giveLine" type="line" :config="lineConfig" :data="chartsData.giveLine" />
      </div>
      <div class="flex-item">
        <Title title="评论趋势" class="p-0" icon="iconpinglun_fill" />
        <!-- <linechart v-if="chartsData.giveLine" :config="lineConfig" :items="chartsData.giveLine" /> -->
        <VChart v-if="chartsData.fansLine" type="line" :config="lineConfig" :data="chartsData.fansLine" />
      </div>
      <div class="flex-item">
        <Title title="转发趋势" class="p-0" icon="iconzhuanfa_fill" />
        <!-- <linechart v-if="chartsData.giveLine" :config="lineConfig" :items="chartsData.giveLine" /> -->
        <VChart v-if="chartsData.forwardLine" type="line" :config="lineConfig" :data="chartsData.forwardLine" />
      </div>
    </div>
  </div>
</template>
<script>
import { $getVideoPicNew, $getHourVideoPicNew } from '@/api/account-manage'
import VChart from '@/components/VChart'
import Title from '@/components/Title'

export default {
  components: { VChart, Title },
  data() {
    return {
      dataType: 1,
      form: {
        type: 1,
        date: '',
        date1: '',
        releaseDate: 3,
        customDate: ''
      },
      configDate: [],
      pulicDay: [
        { label: '发布后3天', value: 1, type: 'default' },
        { label: '发布后7天', value: 2, type: 'default' },
        { label: '发布后14天', value: 3, type: 'default' }
        // { label: '5', value: 5, type: 'custom' },
      ],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      chartsData: {
        videoColumn: null,
        fansLine: null,
        giveLineLine: null,
        forwardLine: null,
        videoLine: null,
        o_videoColumn: null
      },
      lineConfig: {
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }]
      },
      loading: false,
      picType: 'add',
      activeCharsType: '',
      videoDetail: {},
      activeName: 'data',
      targetOption: {
        add: {
          cates: [],
          values: [],
          terms: []
        },
        all: {
          cates: [],
          values: [],
          terms: []
        }
      }
      // lineConfig: {
      //   legend: {
      //     show: false
      //   },
      //   grid: {
      //     left: 90
      //   }
      // },
      // chartsData: {
      //   main: null,
      //   line: null
      // }
    }
  },
  computed: {

    data() {
      return this.$response.detailData
    }
  },
  watch: {
    dataType: {
      immediate: true,
        handler(val) {
        if (val === 2) {
          this.configDate = this.pulicDay.slice(0, 2)
        } else {
          console.log(this.pulicDay)
          this.configDate = this.pulicDay
        }
      }
    }
  },
  created() {
    this.handleChange()
    this.accountFansChart()
  },
  inject: ['$response'],

  methods: {
    handleCustomChange() {
      console.log(this.form.releaseDate, this.form.customDate)
      if (this.form.releaseDate === 5) {
        this.form.date = this.getReleaseDateRange(this.form.customDate)
        this.accountFansChart()
      }
    },
    getReleaseDateRange(day) {
      day = day - 0
      const release = this.data.addTime
      const releaseDate = new Date(release)
      const releaseNum = releaseDate.getTime()
      const endDate = new Date(releaseNum + (day * 86400000))
      if (this.dataType === 1) {
        return [
        `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1 < 10 ? `0${releaseDate.getMonth() + 1}` : releaseDate.getMonth() + 1}-${releaseDate.getDate() < 10 ? ('0' + releaseDate.getDate()) : releaseDate.getDate()}`,
        `${endDate.getFullYear()}-${endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1}-${endDate.getDate() < 10 ? ('0' + endDate.getDate()) : endDate.getDate()}`
      ]
      } else {
        const dateArr = [
        `${releaseDate.getFullYear()}-${releaseDate.getMonth() + 1 < 10 ? `0${releaseDate.getMonth() + 1}` : releaseDate.getMonth() + 1}-${releaseDate.getDate() < 10 ? ('0' + releaseDate.getDate()) : releaseDate.getDate()} ${releaseDate.toLocaleTimeString()}`,
        `${endDate.getFullYear()}-${endDate.getMonth() + 1 < 10 ? `0${endDate.getMonth() + 1}` : endDate.getMonth() + 1}-${endDate.getDate() < 10 ? ('0' + endDate.getDate()) : endDate.getDate()} ${endDate.toLocaleTimeString()}`
      ]
      return dateArr
      }
    },
    handleChange() {
      const releaseDate = this.form.releaseDate
      switch (releaseDate) {
          case 1:
            if (this.dataType === 1) {
              this.form.date = this.getReleaseDateRange(3)
            } else {
              this.form.date1 = this.getReleaseDateRange(3)
            }
            break
          case 2:
             if (this.dataType === 1) {
              this.form.date = this.getReleaseDateRange(7)
            } else {
              this.form.date1 = this.getReleaseDateRange(7)
            }
            break
          case 3:
            this.form.date = this.getReleaseDateRange(14)
            break
          case 5:
            this.form.date = this.getReleaseDateRange(this.form.customDate)
            break
      }
      // console.log(this.form.date)
      this.accountFansChart()
    },
    stopPrevent() {
    },
    handleCustom() {
      this.configDate[this.configDate.length - 1].label = `发布后${this.form.customDate}天`
    },
    formatDateTime(date) {
      const data = new Date(date)
      const year = data.getFullYear()
      let month = data.getMonth() + 1
      let day = data.getDay() + 1
      month = String(month).length > 1 ? month : '0' + month
      day = String(day).length > 1 ? day : '0' + day
      return `${year}-${month}-${day} ${data.toLocaleTimeString()}`
    },
    async accountFansChart() {
      this.loading = true
      const params = {
        accountId: this.data.accountId,
        thirdId: this.data.thirdId,
        platId: this.data.platId,
        addTime: this.data.addTime
      }
      if (this.form.date && this.dataType === 1) {
        params.beginTime = this.form.date[0]
        params.endTime = this.form.date[1]
      }
      if (this.dataType === 2) {
        params.publishDate = this.data.addTime
        if (this.form.date1) {
          params.beginTime = this.form.date1[0]
          params.endTime = this.form.date1[1]
        }
      }
      const $api = this.dataType === 2 ? $getHourVideoPicNew : $getVideoPicNew
      const res = await $api(params)
      if (res.code === 1) {
        const { cates, terms, values } = res.data
        this.chartsData.giveLine = {
          cates: cates.slice(0, 2).map(item => item.typeName),
          terms,
          values: values.slice(0, 2)
        }
        this.chartsData.fansLine = {
          cates: cates.slice(2, 4).map(item => item.typeName),
          terms,
          values: values.slice(2, 4)
        }
        this.chartsData.forwardLine = {
          cates: cates.slice(4, 6).map(item => item.typeName),
          terms,
          values: values.slice(4, 6)
        }
        this.loading = false
      } else {
        this.loading = false
        this.$message.error(res.message)
      }
    },
    handlePoints(val) {
      this.chartsData = {
        videoColumn: null,
        fansLine: null,
        giveLineLine: null,
        forwardLine: null,
        videoLine: null,
        o_videoColumn: null
      }
      this.form.releaseDate = 1
      this.handleChange()
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-video-data {
    .flex {
      display: flex;
      &-item {
        flex: 1;
      }
    }
    // .data-form {
    //   position: absolute;
    //   right: 24px;
    //   top: 24px;
    //   margin-bottom: 24px;
    //   & > * {
    //     vertical-align: top;
    //   }
    //   // .custom-date {
    //   //   display: flex;
    //   // }
    // }
  }
</style>
<style lang="scss">
.chart-wrapper{
  width: 100%;
  height: 404px;
}
  .C-video-data-custom-date {
    display: flex;
    .custom-input {
      width: 80px;
      margin: 0 4px;
    }
  }
</style>
