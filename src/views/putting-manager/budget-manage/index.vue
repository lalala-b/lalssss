<template>
  <div>
    <!-- <template v-else> -->
    <div class="m-b-10">
      <el-select v-model="paramDate" @change="getChartData">
        <el-option v-for="item in times" :key="item" :value="item" />
      </el-select>
      <el-switch
        v-model="open"
        class="m-l-10"
        active-text="详情展开"
        inactive-text="详情收缩"
      />
    </div>
    <Loading v-if="loading" />
    <div
      v-show="!loading"
      ref="budget"
      class="budget-content"
      @mousedown="handleDown"
      @mouseup="handleUp"
    >
      <BudgetSubItem :param-date="paramDate" :items="trees" :open="open" />
    </div>
    <!-- </template> -->
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { $getBudgetChart, $getBudgetTimes } from '@/api/putting-manager'
import BudgetSubItem from './_com/BudgetSubItem'
import Loading from '@/components/Loading'
export default {
  components: {
    BudgetSubItem,
    Loading
  },
  data() {
    return {
      value1: '',
      trees: [],
      times: [],
      loading: true,
      open: false,
      paramDate: dayjs().format('YYYY-MM')
    }
  },
  async created() {
    // this.trees[0].children &
    //   this.trees[0].children.forEach((item, index) => {
    //     item.color = colors[index] ? colors[index] : colors[colors.length]
    //   })
    await this.getTimes()
    await this.getChartData()
    this.$bus.$on('budget:update', async() => {
      // const loading = this.$loading({
      //   lock: true,
      //   text: '操作成功，加载数据中。。。',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      try {
        await this.getChartData(false)
      } catch (err) { console.error(err) }
      // loading.close()
    })
  },
  beforeDestroy() {
    this.$bus.$off('budget:update')
    this.handleUp()
  },
  methods: {
    getTimes() {
      return new Promise((resolve, reject) => {
        $getBudgetTimes().then(res => {
          if (res.code === 1) {
            this.times = res.data
            resolve()
          }
        })
      })
    },
    each(items) {
      items.forEach(item => {
        const parent = item
        if (item.children) {
          item.children.forEach(child => {
            child.parent = parent
          })
          this.each(item.children)
        }
      })
    },
    getChartData(isLoading) {
      return new Promise((resolve, reject) => {
        if (isLoading) {
          this.loading = true
        }
        $getBudgetChart({ queryTime: this.paramDate })
          .then(res => {
            if (res.code === 1) {
              this.trees = res.data
              this.each(this.trees)
            } else {
              this.$message.error(res.message)
            }
            this.loading = false
            return resolve()
          })
          .catch(err => {
            if (err.__CANCEL__) {
              return
            }
            this.loading = false
            this.$message.error(err.message)
          })
      })
    },
    handleDown(event) {
      const { x, y } = event
      this.oX = x
      this.oY = y
      this.$refs.budget.addEventListener('mousemove', this.handleMove, {
        passive: false
      })
    },
    handleUp() {
      this.$refs.budget.removeEventListener('mousemove', this.handleMove)
    },
    handleMove(event) {
      const { x, y } = event
      const offsetX = (x - this.oX) * 0.1 - this.$refs.budget.scrollLeft
      const offsetY = (y - this.oY) * 0.1 + this.$refs.budget.scrollTop
      // if (offsetX < 0) {
      //   offsetX = 0
      // }
      // if (offsetY < 0) {
      //   offsetY = 0
      // }

      this.$refs.budget.scrollTo(-offsetX, offsetY)
    }
  }
}
</script>
<style lang="scss" scoped>
  .budget-content {
    // overflow-y: hidden;
    display: flex;
    flex-direction: column;
    // flex-direction: column;
    overflow: auto;
    // justify-content: center;
  }
</style>
