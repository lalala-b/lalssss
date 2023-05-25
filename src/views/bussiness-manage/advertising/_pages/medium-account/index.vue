<template>
  <div class="P-client">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :lazy="true" :label="item.title" :name="item.name">
          <template slot="label">
            <div v-if="item.val">
              {{ item.title }} <i class="icon-high">{{ item.val }}</i>
            </div>
          </template>
          <!-- <keep-alive> -->
          <Detail
            v-if="activeName === item.name"
            :type="activeName"
          />
          <!-- <component
            :is="`v-${item.name}`"
            v-if="activeName === item.name"
            :type="activeName"
          /> -->
          <!-- </keep-alive> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Detail from './_com/detail.vue'
export default {
  components: {
    Detail
  },
  data() {
    return {
      tabs: (() => {
        let tab = [
          {
            title: '抖音达人',
            name: 'douyin'
          },
          {
            title: '快手达人',
            name: 'kuaishou'
          },
          {
            title: 'B站达人',
            name: 'bilibili'
          },
          {
            title: '小红书达人',
            name: 'xiaohongshu'
          }
        ]

        tab = tab.filter(t => this.$permission(t.permission))
        return tab
      })(),
      activeName: 'douyin'
    }
  },
  created() {
    this.activeName = this.$route.query.activeName || this.tabs[0].name
    const tabName = this.$route.query.tabName || this.tabs[0].title
    this.$router.replace({
      query: {
        activeName: this.activeName,
        tabName
      }
    })
  },
  methods: {
    handleClick(e) {
      const activeName = e.name
      const label = e.label
      this.$router.replace({
        query: {
          activeName,
          tabName: label
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-high {
  background-color: #f00;
  color: #fff;
  // width: 16px;
  padding: 0 4px;
  height: 16px;
  line-height: 16px;
  display: inline-block;
  text-align: center;
  border-radius: 10px;
  ::v-deep .el-loading-spinner {
    margin-top: -10px;
    .circular {
      width: 20px;
      height: 20px;
    }
  }
}
</style>
