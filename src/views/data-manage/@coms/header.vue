<template>
  <div class="header-title flex flex-align-center">
    <p data-bold>{{ title }}</p>
    <p v-if="tip" data-bold>{{ tip }}</p>
    <el-select v-model="selectTime" class="header-title-times m-l-24" @change="handleChangeTime">
      <el-option v-for="item in historys" :key="item.startEnd" :label="item.startEnd" :value="item.startEnd" />
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    historys: {
      type: Array,
      default() {
        return []
      }
    },
    tip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      selectTime: ''
    }
  },
  watch: {
    historys: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) { this.selectTime = val[0].startEnd }
      }
    }
  },
  created() {

  },
  methods: {
    handleChangeTime(currentData) {
      const timeArr = currentData.split('----')
      var pageTime = {
        startTime: timeArr[0],
        endTime: timeArr[1]
      }
      const monthTime = this.historys.find(item => item.startEnd === currentData).monthTime
      this.$emit('change', pageTime, monthTime)
    }
  }
}
</script>
<style lang="scss" scoped>
.header-title {
  &-times {
    width: 248px;
  }
  > p {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
  }
}
</style>
