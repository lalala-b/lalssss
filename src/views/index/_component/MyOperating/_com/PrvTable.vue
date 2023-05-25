
<template>
  <div class="m-t-12 table-view">
    <el-table
      v-loading="loading"
      :data="tableData"
      height="383px"
      row-class-name="hero-bg"
      @sort-change="doSort"
    >
      <el-table-column width="82" label="评级月排名" fixed="left">
        <template slot-scope="{ row }">
          <template v-if="+params.rankingType === 0">
            {{ row.prepareLevelRanking | emptyFill }}/{{
              row.accountAllCount | emptyFill
            }}
          </template>
          <template v-else>
            {{ row.prepareLevelRankingFund | emptyFill }}/{{
              row.accountAllCountFund | emptyFill
            }}
          </template>
        </template>
      </el-table-column>
      <el-table-column
        prop="opportunityId"
        width="160"
        label="账号统一名称"
        fixed="left"
      >
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
                  :disabled="row.belongName.length < 8"
                >
                  <span>{{ row.belongName.slice(0, 7) }}</span>
                </el-tooltip>
              </div>
              <p style="font-size:13px">粉丝数：{{ row.fansNum| toThousandsW }}</p>
            </div>
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="prepareLevel" label="最终评级" sortable="custom">
        <template slot-scope="{ row }">
          {{ formatTableText(row.prepareLevel, row.prepareLevelName, '级') }}
        </template>
      </el-table-column>
      <el-table-column prop="distributionsNum" sortable="custom">
        <template slot="header">
          分发条数
          <IconTip
            type="popover"
            class="table-head"
            content="抖快分发条数"
            icon-class="iconwenhao"
          />
        </template>
        <template slot-scope="{ row }">
          {{ formatTableText(row.tkDistributeCount, row.ksDistributeCount) }}
        </template>
      </el-table-column>
      <el-table-column prop="nodeFlowCount" width="110" sortable="custom">
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
          {{ formatNodeText(row.nodeFlowCount, row.nodeFlowLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="nodeThumbupCount" width="110" sortable="custom">
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
          {{ formatNodeText(row.nodeThumbupCount, row.nodeThumbupLevel) }}
        </template>
      </el-table-column>
      <el-table-column prop="editName" label="编辑">
        <template slot-scope="{ row }">{{ row.editName | emptyFill }}</template>
      </el-table-column>
      <el-table-column prop="cutName" label="剪辑">
        <template slot-scope="{ row }">{{ row.cutName | emptyFill }}</template>
      </el-table-column>
      <el-table-column prop="influencer" label="网红">
        <template slot-scope="{ row }">{{
          row.influencer | emptyFill
        }}</template>
      </el-table-column>
      <el-table-column prop="photographer" label="拍摄">
        <template slot-scope="{ row }">{{
          row.photographer | emptyFill
        }}</template>
      </el-table-column>
      <el-table-column prop="sop" label="SOP">
        <template slot-scope="{ row }">{{ row.sop | emptyFill }}</template>
      </el-table-column>
      <el-table-column label="审核状态">
        <template slot-scope="{ row }">
          <span
            v-if="+row.examineStatus === 0"
            style="color: #bbb"
          >待审核</span>
          <span
            v-if="+row.examineStatus === 1"
            style="color: #2ced2c"
          >通过</span>
          <span v-if="+row.examineStatus === 2" style="color: red">未通过</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{ row }">
          <el-tooltip
            v-if="row.remark"
            effect="dark"
            :content="row.remark"
            placement="top"
          >
            <div>{{ row.remark.slice(0, 4) }}</div>
          </el-tooltip>
          <div v-else>--</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useTableSort } from '@/hook'
import { copy, formatNum } from '@/utils'
import dayjs from 'dayjs'
import { IconTip } from 'components'
import { $getOperateList } from '@/api/home'
import { toThousands, toThousandsW } from '@/filters'
export default defineComponent({
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const states = reactive({
      total: 0,
      loading: false,
      tableData: []
    })

    const getList = () => {
      try {
        states.loading = true
        $getOperateList(props.params).then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            const data = res.data
            states.tableData = []
            data.forEach((item) => {
              states.tableData.push({
                ...item.ownAccountInfoVO,
                ...item.monthAccountRankData
              })
            })
          } else {
            states.tableData = []
          }
        })
      } catch (error) {
        states.loading = false
        console.log(error)
      }
    }
    const formatTableText = (prv, next, unit) => {
      if (prv === null && next === null) return '--'
      if (unit === '级') {
        prv = (prv ? formatNum(prv) : 0) + '级'
        next = next || '--'
        return `${prv}-${next}`
      } else {
        prv = prv ? formatNum(prv) : 0
        next = next || '0'
        return `${prv}-${next}`
      }
    }
    const formatNodeText = (prv, next, type) => {
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
      getList,
      formatNum,
      formatTableText,
      formatNodeText
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-table__row {
    height: 60px;
  }
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    width: 160px;
    &-image {
      width: 30px;
      height: 30px;
      margin-right: 6px;
      border-radius: 4px;
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
</style>

