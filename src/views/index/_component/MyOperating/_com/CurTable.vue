
<template>
  <div class="m-t-12 table-view">
    <el-table
      v-loading="loading"
      :data="tableData"
      :show-header="false"
      height="586px"
      row-class-name="hero-bg"
    >
      <el-table-column label="账号统一名称" fixed="left" width="190px">
        <template slot-scope="{ row }">
          <div class="account">
            <div>
              <a
                class="account-card flex flex-align-center"
                :href="row.ownAccountInfoVO.accountLoginUrl"
                target="_black"
              >
                <img
                  class="account-card-image"
                  :src="row.ownAccountInfoVO.accountImg"
                >
                <div>
                  <div class="flex flex-align-center">
                    <img
                      class="account-card-plat"
                      :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${row.ownAccountInfoVO.platId}.png`"
                      alt=""
                    >
                    <el-tooltip
                      effect="dark"
                      :content="row.ownAccountInfoVO.belongName"
                      placement="top"
                      :disabled="row.ownAccountInfoVO.belongName.length < 7"
                    >
                      <span>{{
                        row.ownAccountInfoVO.belongName.slice(0, 6)
                      }}</span>
                    </el-tooltip>
                  </div>
                  <p style="font-size: 13px">
                    粉丝数：{{ row.ownAccountInfoVO.fansNum | toThousandsW }}
                  </p>
                </div>
              </a>
              <p>
                <span class="p-icon"> <i class="iconfont iconedit" /></span>编辑：<span class="p-val">{{
                  row.ownAccountInfoVO.editName | emptyFill
                }}</span>
              </p>
              <p>
                <span class="p-icon"> <i class="iconfont iconjianji" /></span>剪辑：<span class="p-val">{{
                  row.ownAccountInfoVO.cutName | emptyFill
                }}</span>
              </p>
              <p>
                <span class="p-icon"> <i class="iconfont iconyonghu" /></span>网红：<span class="p-val">{{
                  row.ownAccountInfoVO.influencer | emptyFill
                }}</span>
              </p>
              <p>
                <span class="p-icon"> <i class="iconfont iconpaishe" /></span>拍摄：<span class="p-val">{{
                  row.ownAccountInfoVO.photographer | emptyFill
                }}</span>
              </p>
              <p style="margin-top: 2px">
                <span class="p-icon"> <i class="iconfont iconshoucangku" /></span>SOP：<span class="p-val">{{
                  row.ownAccountInfoVO.sop | emptyFill
                }}</span>
              </p>
            </div>

          </div>
        </template>
      </el-table-column>
      <el-table-column>
        <template>
          <div class="el-content-header" style="height:40px" />
          <div class="el-content-box">
            <p>预评级</p>
            <p>
              预评级排名
              <IconTip
                type="popover"
                content="当前绩效月评级排名仅为预计评级排名，不作为最终评级排名。如预评级排名为30/200，表示你的账号在200个账号统一名称中排名第30名。"
                icon-class="iconwenhao"
              />
            </p>
            <p style="paddingLeft:15px">
              节点流量
              <IconTip
                type="popover"
                icon-class="iconwenhao"
              >
                <div>
                  <p>节点流量：</p>
                  <p>1、绩效月每周账号全平台节点流量从小到大排序后，取第二位周的节点流量数据</p>
                  <p>eg，第一周，100W，第二周200W，第三周，150W，第四周，210W，则排序为，100W，150W，200W，210W，则取第三周150W的周节点流量作为本月累计节点流量</p>
                  <p>2、单周节点流量为该账号统一名称下单周节点流量总计</p>
                  <p>数据源为军功审核通过及无需审核的数据，未通过/非广视频/乾派广告不计入</p>
                </div>
              </IconTip>
            </p>
            <p style="paddingLeft:15px">
              节点点赞
              <IconTip
                type="popover"
                content="抖快分发条数"
                icon-class="iconwenhao"
              >
                <div>
                  <p>1、节点点赞：</p>
                  <p>月总计：</p>
                  <p>eg，第一周，100W，第二周200W，第三周，150W，第四周，210W，则排序为，100W，150W，200W，210W，则取第三周150W的周节点流量作为本月累计节点流量</p>
                  <p>账号全平台视频分开排序，取平台视频80%视频能达到的点赞来对比，较大值为绩效月的节点点赞，且平台展示为较大值的平台，若发布条数为单数，取值四舍五入</p>
                  <p>eg，该账号本月共发布一百条视频，抖音、快手各50条，抖音点赞数为1-50，快手点赞数为100-150，若抖音80%视频能达到的点赞量为15，则抖音的节点点赞取值为15，若快手80%的视频能达到的点赞量为120，则快手的节点点赞取值为120，由于快手节点点赞取值大于抖音，则该账号平台展示为快手，节点点赞为快手节点点赞120,</p>
                  <p>2、单周的计算逻辑与月总计一致，只是口径为单周该账号统一名称各平台总计发布多少条视频再分别排序进行计算和判断</p>
                  <p>数据源为军功审核的全部数据（非广视频/乾派广告/未通过都计入）</p>
                </div>
              </IconTip>
            </p>
            <p style="margin-left: -13px">
              抖快分发条数
              <IconTip
                type="popover"
                content="抖快分发条数"
                icon-class="iconwenhao"
              >
                <div>
                  <p>抖快分发条数，11/11,表示抖音分发11条，快手分发11条</p>
                  <p>若账号统一名称下有多个同平台账号且在同周内发布视频，则该平台分发条数为—，月的抖快分发条数=周分发条数之和</p>
                </div>
              </IconTip>
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="月总计">
        <template slot-scope="{ row }">
          <div class="el-content-header">月总计</div>
          <div class="el-content-box">
            <div>
              <p
                :title="
                  formatTableText(
                    row.monthAccountRankData.prepareLevel,
                    row.monthAccountRankData.prepareLevelName,
                    '-',
                    '级'
                  )
                "
              >
                {{
                  formatTableText(
                    row.monthAccountRankData.prepareLevel,
                    row.monthAccountRankData.prepareLevelName,
                    '-',
                    '级'
                  )
                }}
              </p>
              <p>
                <template v-if="+params.rankingType === 0">
                  {{
                    formatTableText(
                      row.monthAccountRankData.prepareLevelRanking,
                      row.monthAccountRankData.accountAllCount,
                      '/'
                    )
                  }}
                </template>
                <template v-else>
                  {{
                    formatTableText(
                      row.monthAccountRankData.prepareLevelRankingFund,
                      row.monthAccountRankData.accountAllCountFund,
                      '/'
                    )
                  }}
                </template>
              </p>
              <p>
                {{
                  formatNodeText(
                    row.monthAccountRankData.nodeFlowCount,
                    row.monthAccountRankData.nodeFlowLevel
                  )
                }}
              </p>
              <p>
                {{
                  formatNodeText(
                    row.monthAccountRankData.nodeThumbupCount,
                    row.monthAccountRankData.nodeThumbupLevel
                  )
                }}
              </p>
              <p>
                {{
                  formatTableText(
                    row.monthAccountRankData.tkDistributeCount,
                    row.monthAccountRankData.ksDistributeCount,
                    '-'
                  )
                }}
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="第一周">
        <template slot-scope="{ row }">
          <div class="el-content-header">第一周</div>
          <div class="el-content-box">
            <p>
              {{
                formatTableText(
                  row.firstWeekAccountRankData.prepareLevel,
                  row.firstWeekAccountRankData.prepareLevelName,
                  '-',
                  '级'
                )
              }}
            </p>
            <p>
              <template v-if="+params.rankingType === 0">
                {{
                  formatTableText(
                    row.firstWeekAccountRankData.prepareLevelRanking,
                    row.firstWeekAccountRankData.accountAllCount,
                    '/'
                  )
                }}
              </template>
              <template v-else>
                {{
                  formatTableText(
                    row.firstWeekAccountRankData.prepareLevelRankingFund,
                    row.firstWeekAccountRankData.accountAllCountFund,
                    '/'
                  )
                }}
              </template>
            </p>
            <p>
              {{
                formatNodeText(
                  row.firstWeekAccountRankData.nodeFlowCount,
                  row.firstWeekAccountRankData.nodeFlowLevel
                )
              }}
            </p>
            <p>
              {{
                formatNodeText(
                  row.firstWeekAccountRankData.nodeThumbupCount,
                  row.firstWeekAccountRankData.nodeThumbupLevel
                )
              }}
            </p>
            <p>
              {{
                formatTableText(
                  row.firstWeekAccountRankData.tkDistributeCount,
                  row.firstWeekAccountRankData.ksDistributeCount,
                  '-'
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="第二周">
        <template slot-scope="{ row }">
          <div class="el-content-header">第二周</div>
          <div class="el-content-box">
            <p>
              {{
                formatTableText(
                  row.secondWeekAccountRankData.prepareLevel,
                  row.secondWeekAccountRankData.prepareLevelName,
                  '-',
                  '级'
                )
              }}
            </p>
            <p>
              <template v-if="+params.rankingType === 0">
                {{
                  formatTableText(
                    row.secondWeekAccountRankData.prepareLevelRanking,
                    row.secondWeekAccountRankData.accountAllCount,
                    '/'
                  )
                }}
              </template>
              <template v-else>
                {{
                  formatTableText(
                    row.secondWeekAccountRankData.prepareLevelRankingFund,
                    row.secondWeekAccountRankData.accountAllCountFund,
                    '/'
                  )
                }}
              </template>
            </p>
            <p>
              {{
                formatNodeText(
                  row.secondWeekAccountRankData.nodeFlowCount,
                  row.secondWeekAccountRankData.nodeFlowLevel
                )
              }}
            </p>
            <p>
              {{
                formatNodeText(
                  row.secondWeekAccountRankData.nodeThumbupCount,
                  row.secondWeekAccountRankData.nodeThumbupLevel
                )
              }}
            </p>
            <p>
              {{
                formatTableText(
                  row.secondWeekAccountRankData.tkDistributeCount,
                  row.secondWeekAccountRankData.ksDistributeCount,
                  '-'
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          tableData && tableData[0] && tableData[0].thirdWeekAccountRankData
        "
        label="第三周"
      >
        <template slot-scope="{ row }">
          <div class="el-content-header">第三周</div>
          <div class="el-content-box">
            <p>
              {{
                formatTableText(
                  row.thirdWeekAccountRankData.prepareLevel,
                  row.thirdWeekAccountRankData.prepareLevelName,
                  '-',
                  '级'
                )
              }}
            </p>
            <p>
              <template v-if="+params.rankingType === 0">
                {{
                  formatTableText(
                    row.thirdWeekAccountRankData.prepareLevelRanking,
                    row.thirdWeekAccountRankData.accountAllCount,
                    '/'
                  )
                }}
              </template>
              <template v-else>
                {{
                  formatTableText(
                    row.thirdWeekAccountRankData.prepareLevelRankingFund,
                    row.thirdWeekAccountRankData.accountAllCountFund,
                    '/'
                  )
                }}
              </template>
            </p>
            <p>
              {{
                formatNodeText(
                  row.thirdWeekAccountRankData.nodeFlowCount,
                  row.thirdWeekAccountRankData.nodeFlowLevel
                )
              }}
            </p>
            <p>
              {{
                formatNodeText(
                  row.thirdWeekAccountRankData.nodeThumbupCount,
                  row.thirdWeekAccountRankData.nodeThumbupLevel
                )
              }}
            </p>
            <p>
              {{
                formatTableText(
                  row.thirdWeekAccountRankData.tkDistributeCount,
                  row.thirdWeekAccountRankData.ksDistributeCount,
                  '-'
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          tableData && tableData[0] && tableData[0].fourthWeekAccountRankData
        "
        label="第四周"
      >
        <template slot-scope="{ row }">
          <div class="el-content-header">第四周</div>
          <div class="el-content-box">
            <p>
              {{
                formatTableText(
                  row.fourthWeekAccountRankData.prepareLevel,
                  row.fourthWeekAccountRankData.prepareLevelName,
                  '-',
                  '级'
                )
              }}
            </p>
            <p>
              <template v-if="+params.rankingType === 0">
                {{
                  formatTableText(
                    row.fourthWeekAccountRankData.prepareLevelRanking,
                    row.fourthWeekAccountRankData.accountAllCount,
                    '/'
                  )
                }}
              </template>
              <template v-else>
                {{
                  formatTableText(
                    row.fourthWeekAccountRankData.prepareLevelRankingFund,
                    row.fourthWeekAccountRankData.accountAllCountFund,
                    '/'
                  )
                }}
              </template>
            </p>
            <p>
              {{
                formatNodeText(
                  row.fourthWeekAccountRankData.nodeFlowCount,
                  row.fourthWeekAccountRankData.nodeFlowLevel
                )
              }}
            </p>
            <p>
              {{
                formatNodeText(
                  row.fourthWeekAccountRankData.nodeThumbupCount,
                  row.fourthWeekAccountRankData.nodeThumbupLevel
                )
              }}
            </p>
            <p>
              {{
                formatTableText(
                  row.fourthWeekAccountRankData.tkDistributeCount,
                  row.fourthWeekAccountRankData.ksDistributeCount,
                  '-'
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="
          tableData && tableData[0] && tableData[0].fifthWeekAccountRankData
        "
        label="第五周"
      >
        <template slot-scope="{ row }">
          <div class="el-content-header">第五周</div>
          <div class="el-content-box">
            <p>
              {{
                formatTableText(
                  row.fifthWeekAccountRankData.prepareLevel,
                  row.fifthWeekAccountRankData.prepareLevelName,
                  '-',
                  '级'
                )
              }}
            </p>
            <p>
              <template v-if="+params.rankingType === 0">
                {{
                  formatTableText(
                    row.fifthWeekAccountRankData.prepareLevelRanking,
                    row.fifthWeekAccountRankData.accountAllCount,
                    '/'
                  )
                }}
              </template>
              <template v-else>
                {{
                  formatTableText(
                    row.fifthWeekAccountRankData.prepareLevelRankingFund,
                    row.fifthWeekAccountRankData.accountAllCountFund,
                    '/'
                  )
                }}
              </template>
            </p>
            <p>
              {{
                formatNodeText(
                  row.fifthWeekAccountRankData.nodeFlowCount,
                  row.fifthWeekAccountRankData.nodeFlowLevel
                )
              }}
            </p>
            <p>
              {{
                formatNodeText(
                  row.fifthWeekAccountRankData.nodeThumbupCount,
                  row.fifthWeekAccountRankData.nodeThumbupLevel
                )
              }}
            </p>
            <p>
              {{
                formatTableText(
                  row.fifthWeekAccountRankData.tkDistributeCount,
                  row.fifthWeekAccountRankData.ksDistributeCount,
                  '-'
                )
              }}
            </p>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import dayjs from 'dayjs'
import { IconTip, AccountCard } from 'components'
import { formatNum } from '@/utils'
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
    AccountCard,
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
            states.tableData = res.data
          } else {
            states.tableData = []
          }
        })
      } catch (error) {
        states.loading = false
        console.log(error)
      }
    }

    const formatTableText = (prv, next, type, unit) => {
      if (prv === null && next === null) return '--'
      if (unit === '级') {
        prv = (prv === null ? '--' : formatNum(prv)) + '级'
        next = next === null ? '--' : next
        return `${prv}${type}${next}`
      } else {
        prv = prv === null ? '--' : formatNum(prv)
        next = next === null ? '--' : next
        return type ? `${prv}${type}${next}` : `${prv}(${next})`
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
    return {
      ...toRefs(states),
      dayjs,
      formatNum,
      getList,
      formatTableText,
      formatNodeText
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
  .el-table__body {
    -webkit-border-vertical-spacing: 8px;
  }
  .el-table td {
    background: #f8f7f7b0 !important;
  }
  .el-table .cell{
    padding-right: 0 !important;
  }
  .el-table__row>td:nth-child(2){
    padding-left: 12px;
  }
  .el-table__row>td:last-child{
    padding-right: 12px;
  }
}
.account {
  padding: 16px;
  display: flex;
  background: #f7f6f6;
  border-radius: 8px;
  &-card {
    margin-bottom: 12px;
    margin-right: 4px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f3eaea;
    &-image {
      width: 44px;
      height: 44px;
      margin-right: 8px;
      border-radius: 6px;
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
  p {
    text-align: left;
    font-size: 14px;
    line-height: 32px;
    letter-spacing: -1px;
    color: #333;
    .p-icon {
      display: inline-block;
      color: #88847e;
      margin-right: 8px;
    }
    .p-val {
      color: #333;
    }
  }
}
.el-content-box{
  p{
    line-height: 40px;
    border-bottom: 1px solid #f3eaea;
  }
  p:last-child{
    border-bottom: none;
  }
}
.el-content-header{
  line-height: 40px;
  border-bottom: 1px solid #f3eaea;
}

::v-deep {
  .el-table__header col {
    min-width: 116px !important;
  }

  .el-table__body col {
    min-width: 116px !important;
  }
  .iconwenhao{
    color: #8c8886;
  }
}
</style>

