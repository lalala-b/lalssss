
<template>
  <div class="m-t-16 m-b-16 table-view">
    <el-table
      v-loading="loading"
      :data="heroList"
      height="343px"
      row-class-name="hero-bg"
      @sort-change="doSort"
    >
      <el-table-column
        prop="opportunityId"
        width="160"
        :label="curentMonth ? '预评级' : '评级'"
        fixed="left"
      >
        <template slot-scope="{ row ,$index}">
          <div class="column-one-box">
            <template v-if="[0,1,2].includes($index)">
              <img v-if="$index===0" class="rank-logo" src="https://img1.zhuanstatic.com/common/biz/img/rank0.png" alt="">
              <img v-if="$index===1" class="rank-logo" src="https://img1.zhuanstatic.com/common/biz/img/rank1.png" alt="">
              <img v-if="$index===2" class="rank-logo" src="https://img1.zhuanstatic.com/common/biz/img/rank2.png" alt="">
            </template>
            <div v-else class="rank-logo">{{ $index+1 }}</div>
            {{ row.prepareLevel ? row.prepareLevel : '0' }}级-{{
              row.prepareLevelName | emptyFill
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column width="170" label="账号统一名称" fixed="left">
        <template slot-scope="{ row }">
          <a
            class="account-card flex flex-align-center"
            :href="row.accountLoginUrl"
            target="_black"
          >
            <img class="account-card-image" :src="row.accountImg">
            <div>
              <div class="flex flex-align-center">
                <img
                  class="account-card-plat"
                  :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${row.platId}.png`"
                  alt=""
                >
                <el-tooltip
                  effect="dark"
                  :content="row.belongName"
                  placement="top"
                  :disabled="(row.belongName || '').length < 8"
                >
                  <span>{{ (row.belongName || '').slice(0, 7) }}</span>
                </el-tooltip>
              </div>
              <p style="font-size:13px">粉丝数：{{ row.fansNum| toThousandsW }}</p>
            </div>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="nodeFlowCount" sortable="custom">
        <template slot="header">
          节点流量
          <IconTip
            type="popover"
            class="table-head"
            content="月维度：计算规则为每周账号全平台节点流量从小到大排序后，取第二位周的节点流量数据；周维度：计算规则为单周账号统一名称下所有平台流量总和"
            icon-class="iconwenhao"
          />
        </template>
        <template slot-scope="{ row }">
          {{ formatTableText(row.nodeFlowCount, row.nodeFlowLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="nodeThumbupCount" sortable="custom">
        <template slot="header">
          节点点赞
          <IconTip
            type="popover"
            class="table-head"
            content="月维度：账号绩效月全平台视频节点点赞分开排序，取平台视频80%视频能达到的点赞来对比，较大值为绩效月的节点点赞，且平台展示为较大值的平台；周维度：对账号统一名称在周内各平台分别发布视频条数的节点点赞排序，取平台视频80%视频能达到的点赞来对比，较大值为该周的节点点赞，且平台展示为较大值的平台"
            icon-class="iconwenhao"
          />
        </template>
        <template slot-scope="{ row }">
          {{ formatTableText(row.nodeThumbupCount, row.nodeThumbupLevel) }}
        </template>
      </el-table-column>
      <el-table-column label="编辑">
        <template slot-scope="{ row }">{{ row.editName | emptyFill }}</template>
      </el-table-column>
      <el-table-column label="剪辑">
        <template slot-scope="{ row }">{{ row.cutName | emptyFill }}</template>
      </el-table-column>
      <el-table-column label="网红">
        <template slot-scope="{ row }">{{ row.influencer | emptyFill }}</template>
      </el-table-column>
      <el-table-column label="拍摄">
        <template slot-scope="{ row }">{{
          row.photographer | emptyFill
        }}</template>
      </el-table-column>
      <el-table-column label="SOP">
        <template slot-scope="{ row }">{{ row.sop | emptyFill }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'
import dayjs from 'dayjs'
import { IconTip } from 'components'
import { formatNum } from '@/utils'
import { $getHeroList } from '@/api/home'
import { toThousands, toThousandsW } from '@/filters'
export default defineComponent({
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    curentMonth: {
      type: Boolean,
      default: true
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const states = reactive({
      total: 0,
      loading: false,
      heroList: []
    })
    const getList = () => {
      try {
        states.loading = true
        const par = {
          ...props.params
        }
        console.info('--asdasd', props.params)
        if (props.params.showAll) {
          par.size = 2000
        } else {
          delete par.size
        }

        $getHeroList(par).then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.heroList = res.data
          } else {
            states.heroList = []
          }
        })
      } catch (error) {
        states.loading = false
        console.log(error)
      }
    }
    const formatTableText = (prv, next, type) => {
      if (prv === null) return '--'
      if (String(prv).length <= 6) {
        prv = toThousands(prv)
      } else {
        prv = toThousandsW(prv)
      }
      next = (next || 0) + '级'
      return `${prv}(${next})`
    }
    const { doSort } = useTableSort(props.params, getList)
    return {
      ...toRefs(states),
      dayjs,
      doSort,
      formatNum,
      getList,
      formatTableText
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .el-table__row {
    height: 60px;
  }
  .account-card {
    width: 160px;
    &-image {
      width: 30px;
      height: 30px;
      margin-right: 6px;
      border-radius:4px;
    }
    &-plat {
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }
    &-name {
      font-family: PingFangSC-Medium, PingFang SC;
      color: #272727;
      font-size: 14px;
      margin-bottom: 6px;
    }
  }
}
.account {
  padding: 10px 0;
  display: flex;
  p {
    text-align: left;
    letter-spacing: -1px;
  }
}
.column-one-box{
  display: flex;
  align-items: center;
  .rank-logo{
    width: 34px;
    line-height: 34px;
    margin: 0 16px;
  }
}
</style>

