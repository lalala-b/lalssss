<template>
  <div class="C-search">
    <div class="flex flex-justify-between align-center">
      <div class="search-date">
        <el-radio-group v-model="form.type" @change="handleChange">
          <el-radio-button :label="1">日榜</el-radio-button>
          <el-radio-button :label="2">周榜</el-radio-button>
          <el-radio-button :label="3">月榜</el-radio-button>
        </el-radio-group>
        <el-select v-model="form.date" :placeholder="selectTip" @change="getData">
          <el-option v-for="(item, index) in selectList" :key="index" :label="item" :value="item" />
        </el-select>
      </div>
      <div class="flex flex-align-center time-tip">
        <span class="m-r-16">榜单生成时间：{{ activeTime }}</span>
        <IconTip label="榜单规则" icon-class="iconwenhao" effect="dark" :content="tip" placement="top" />
      </div>
    </div>
    <div class="flex mt-20">
      <div class="flex-value">
        <TagSelect v-model="xingtu" label="内容类型" :data="xingtuTagData" model="arr" @change="handleXingtuChange" />
      </div>
    </div>
    <div class="search-other" />
  </div>
</template>
<script>
import { IconTip, TagSelect } from 'components'

export default {
  components: { TagSelect, IconTip },
  props: {
    queryData: {
      type: Object,
      default() {
        return {}
      }
    },
    tip: {
      type: String,
      default: ''
    },
    xingtuTagData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      activeTime: '',
      xingtu: '全部',
      form: {
        type: 1,
        date: ''
      },
      dateList: [],
      weekList: [],
      monthList: []
    }
  },
  computed: {
    selectList() {
      const type = this.form.type
      switch (type) {
          case 1:
            return this.dateList
          case 2:
            return this.weekList
          case 3:
            return this.monthList
          default:
            return this.dateList
      }
    },
    selectTip() {
      const type = this.form.type
      switch (type) {
          case 1:
            return '日榜'
          case 2:
            return '周榜'
          case 3:
            return '月榜'
          default:
            return '日榜'
      }
    }
  },
  watch: {
    queryData: {
      handler(data) {
        if (data) {
          this.dateList = data.dayBillboardTime
          this.weekList = data.weekBillboardTime
          this.monthList = data.monthBillboardTime
          this.activeTime = data.activeTime
          this.handleChange()
        }
      },
      immediate: true
    }
  },
  methods: {
    handleXingtuChange(val) {
      // this.xingtu = val
      this.$emit('reset')
      this.$emit('getData', 1, val)
    },
    handleChange() {
      this.$emit('reset')
      this.form.date = this.selectList[0]
      this.$emit('clear')
      console.log(1111)
      this.$emit('getData', 1)
    },
    getData() {
      this.$emit('reset')
      this.$emit('getData', 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-search {
    position: relative;
    .search-date {
      > * {
        vertical-align: top;
        margin-right: 10px;
      }
    }
    .search-other {
      font-size: 14px;
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
    }
    .mt-20 {
      margin-top: 20px;
    }
    .flex {
      display: flex;
      &-label {
        width: 80px;
        font-size: 16px;
        font-weight: bold;
      }
      &-value {
        flex: 1;
      }
    }
    .time-tip {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 22px;
      ::v-deep {
        .el-tooltip {
          font-size: 14px;
          line-height: 22px;
        }
      }
    }
  }
</style>
