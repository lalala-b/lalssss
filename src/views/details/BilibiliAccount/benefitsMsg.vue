<template>
  <div class="benefitsDetail">
    <div class="q-wrap">
      <div>达人商务简介：{{ info.businessProfile || '--' }}</div>

      <h4 class="freeTopTitle">免费推广/置顶</h4>
      <ul class="list flex flex-wrap">
        <li :span="12">
          Link：{{ info.freeTopFlag !== null ? dataMap[+info.freeTopFlag] : '--' }}
        </li>

        <li :span="12">
          锚点：{{ info.freeAnchorFlag !== null ? dataMap[+info.freeAnchorFlag] : '--' }}
        </li>

        <li :span="12">
          小蓝车：{{
            info.freeBlueCarFlag !== null ? dataMap[+info.freeBlueCarFlag] : '--'
          }}
        </li>

        <li :span="12">
          落地页：{{ info.freePageFlag !== null ? dataMap[+info.freePageFlag] : '--' }}
        </li>

        <el-row>
          <li>视频最长保留时间：{{ info.videoSaveDate || '--' }}天</li>
        </el-row>

        <el-row>
          <li>
            是否需要供稿直发：{{
              info.straightFeedFlag !== null ? dataMap[+info.straightFeedFlag] : '--'
            }}
          </li>
        </el-row>

        <el-row>
          <li>
            是否接受二次剪辑：{{
              info.secondFeedFlag !== null ? dataMap[+info.secondFeedFlag] : '--'
            }}
          </li>
        </el-row>
      </ul>
    </div>

    <div v-if="info.isCar || info.isFurnishing || info.isMombaby" class="q-wrap m-t-16">
      <h3>品类信息</h3>
      <el-row v-if="info.isMombaby" class="categoryInformationItem">
        <div> 出镜小孩年纪：{{ info.childAge || '--' }}岁 </div>

        <div>
          是否为孕期妈妈：{{
            info.gravidaFlag !== null ? dataMap[+info.gravidaFlag] : '--'
          }}
        </div>

        <div>
          小孩与产品同框是否加收费用：{{
            info.togetherShowFlag !== null ? dataMap[+info.togetherShowFlag] : '--'
          }}
        </div>
      </el-row>

      <el-row v-if="info.isCar" class="categoryInformationItem">
        <div>
          <div>
            是否有驾照：{{
              info.drivingLicenseFlag !== null ? dataMap[+info.drivingLicenseFlag] : '--'
            }}
          </div>
        </div>

        <div>
          是否接受保量：{{
            info.ensureFlowFlag !== null ? dataMap[+info.ensureFlowFlag] : '--'
          }}
        </div>

        <div>
          是否接受差旅自费：{{
            info.travelExpensesFlag !== null ? dataMap[+info.travelExpensesFlag] : '--'
          }}
        </div>

        <div>
          可否参加线下活动：{{
            info.offlineActivitiesFlag !== null
              ? dataMap[+info.offlineActivitiesFlag]
              : '--'
          }}
        </div>
      </el-row>

      <el-row v-if="info.isFurnishing" class="categoryInformationItem">
        <div>
          可否线下打卡门店：{{
            info.offlineClockingFlag !== null ? dataMap[+info.offlineClockingFlag] : '--'
          }}
        </div>

        <div>
          可否安装大小家电：{{
            info.installHomeProductsFlag !== null
              ? dataMap[+info.installHomeProductsFlag]
              : '--'
          }}
        </div>
      </el-row>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    benefitsInfo: {
      type: Object,
      default() {
        return () => ({})
      }
    }
  },
  setup(props) {
    const states = reactive({
      info: {},
      dataMap: {
        0: '否',
        1: '是',
        2: '未知'
      }
    })

    watch(
      () => props.benefitsInfo,
      (val) => {
        const keys = Object.keys(val)
        if (val && keys.length) {
          states.info = val
        }
      },
      {
        immediate: true
      }
    )

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.benefitsDetail {
  font-size: 16px;

  .list {
    li {
      &.block {
        width: 100%;
        max-width: 100%;
      }
      width: 20%;
      max-width: 245px;
      min-width: 220px;
      color: #595959;
      line-height: 22px;
      margin-bottom: 16px;
      margin-right: 12px;
    }
  }

  .freeTopTitle {
    margin-bottom: 10px;
    margin-top: 16px;
  }

  .categoryInformationItem {
    background: rgba(0, 0, 0, 0.2);
    margin: 10px 0;
    padding: 16px;

    div {
      margin-bottom: 12px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>
