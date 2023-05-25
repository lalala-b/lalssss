<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 13:43:02
 * @LastEditTime: 2020-12-26 16:42:39
 * @LastEditors: Linjie
-->
<template>
  <div class="P-client">
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" :lazy="true" :label="item.title" :name="item.name">
          <template slot="label">
            <div v-if="item.val">
              {{ item.title }} <i class="icon-high">{{ item.val }}</i>
            </div>
            <IconTip
              v-if="item.tip"
              slot="label"
              trigger="hover"
              :content="item.tip"
              :label="item.title"
              icon-class="iconwenhao"
            />
          </template>
          <keep-alive>
            <component
              :is="`v-${item.name}`"
              @changeTabNum="changeTabNum"
              @getExceptionOrderCount="getExceptionOrderCount"
            />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Order from './_pages/order'
import SpecialOrder from './_pages/specialOrder'
import Evaluate from './_pages/evaluate'
import EntryOrder from './_pages/entryRank'
import Exception from './_pages/exceptionOrder'
import { IconTip } from 'components'
import {
  $getEvaluateCount,
  $getExceptionOrderCount
} from '@/api/bussiness-manage'
import { $getDeskEvaluateCount } from '@/api/business-desk'
export default {
  components: {
    vOrder: Order,
    vSpecialOrder: SpecialOrder,
    vEntryOrder: EntryOrder,
    vEvaluate: Evaluate,
    vException: Exception,
    IconTip
  },
  data() {
    return {
      tabs: (() => {
        let tab = [
          {
            title: '视频工单',
            tip: '发布视频的工单，必须能添加视频链接',
            name: 'order'
          },
          {
            title: '特殊工单',
            tip: '不需要发布视频的工单，不限于代运营、直播、转发评论等合作',
            name: 'specialOrder'
          },
          {
            title: '待评价工单',
            loading: false,
            val: 0,
            name: 'evaluate',
            permission: 'evaluate_workorder'
          },
          {
            title: '异常工单',
            loading: false,
            val: 0,
            name: 'exception'
          },
          {
            title: '录单耗时',
            name: 'entryOrder'
          }
        ]
        // if (!this.$permission('putting_order_wait')) {
        //   tab.splice(1, 1)
        // }
        const { name } = this.$route
        if (name === 'my_desk' || name === 'my_team_desk') {
          tab.splice(3, 1)
        }
        tab = tab.filter(t => this.$permission(t.permission))
        return tab
      })(),
      activeName: 'order'
    }
  },
  created() {
    this.changeTabNum()
    this.getExceptionOrderCount()
    const { id, userId, bTime, oTime, workId, platId, accountId, brandId, fieldId } = this.$route.query
    if (id || userId || bTime || oTime || workId || platId || accountId || brandId || fieldId) {
      this.activeName = this.$route.query.activeName
    } else {
      this.activeName = this.$route.query.activeName || this.tabs[0].name
      const tabName = this.$route.query.tabName || this.tabs[0].title
      this.$router.replace({
        query: {
          activeName: this.activeName,
          tabName
        }
      })
    }
  },
  methods: {
    handleClick(e) {
      this.changeTabNum()
      this.getExceptionOrderCount()
      const activeName = e.name
      const label = e.label
      this.$router.replace({
        query: {
          activeName,
          tabName: label
        }
      })
    },

    async changeTabNum() {
      const deskType = localStorage.getItem('deskType') || ''
      const params = {}
      if (deskType) {
        params.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskEvaluateCount : $getEvaluateCount
      const { code, data } = await $api(params)
      if (+code === 1) {
        this.tabs[2].val = data
      }
    },

    async getExceptionOrderCount() {
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) return

      const { code, data } = await $getExceptionOrderCount()
      if (+code === 1) {
        this.tabs[3].val = data
      }
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
