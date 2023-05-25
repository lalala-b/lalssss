<template>
  <Wrap class="m-t-12">
    <div :class="isDetail ? 'detailMsg' : ''">
      <div class="msgItem">
        <h3>达人信息</h3>

        <div class="msgWrap">
          <div class="item">
            <span>达人名称</span>
            <span>
              <a :href="baseTiktokThirdTalentInfo.getDataUrl" target="_blank">{{ baseTiktokThirdTalentInfo.authorNickName || '--' }}</a>
            </span>
          </div>
          <div class="item">
            <span>达人电话</span>
            <span>{{ baseTiktokThirdTalentInfo.authorDisplayPhone || '--' }}</span>
          </div>
        </div>
      </div>

      <div class="msgItem">
        <h3>产品介绍</h3>

        <div class="msgWrap">
          <div class="item">
            <span>品牌名称</span>
            <span v-if="JSON.parse(baseTiktokThirdProductInfo.demandBrands || '[]').length">
              <i v-for="item in JSON.parse(baseTiktokThirdProductInfo.demandBrands || '[]')" :key="item.id">
                {{ item }}
              </i>
            </span>
            <span v-else>--</span>
          </div>
          <div class="item">
            <span>所属行业</span>
            <span>{{ baseTiktokThirdProductInfo.demandSecondClassCategoryName || '--' }}</span>
          </div>
          <div class="item">
            <span>产品名称</span>
            <span>{{ baseTiktokThirdProductInfo.demandProductName || '--' }}</span>
          </div>
          <div class="item">
            <span>产品介绍</span>
            <span>{{ baseTiktokThirdProductInfo.demandProductInformation || '--' }}</span>
          </div>
        </div>
      </div>

      <div class="msgItem">
        <h3>任务要求</h3>

        <div class="msgWrap">
          <div class="item">
            <span>期望发布时间</span>
            <span>{{ baseTiktokThirdOrderInfo.demandExpirationTime ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTime * 1000)) : '--' }}
              至
              {{ baseTiktokThirdOrderInfo.demandExpirationTimeEnd ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTimeEnd * 1000)) : '--' }}
            </span>
          </div>
          <div class="item">
            <span>期望保留时长</span>
            <span>{{ baseTiktokThirdTaskInfo.demandExpectRemainTime || 0 }}天</span>
          </div>
          <div class="item">
            <span>详细要求</span>
            <span>{{ baseTiktokThirdTaskInfo.demandMobileSpecificOther || '--' }}</span>
          </div>
          <!-- <div class="item">
            <span>背景音乐</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>道具要求</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>场景要求</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>其他要求</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>是否跳过脚本</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>投放广告</span>
            <span>无</span>
          </div>
          <div class="item">
            <span>附件</span>
            <span>无</span>
          </div> -->
          <div class="item">
            <span>挂载搜索词</span>
            <span>{{ baseTiktokThirdTaskInfo.demandSearchWord || '--' }}</span>
          </div>
        </div>
      </div>

      <div class="msgItem">
        <h3>视频附加组件</h3>
        <div class="msgWrap">
          <div class="item">
            <span>组件类型</span>
            <span>{{ getComponentType(baseTiktokThirdVideoComInfo.componentType) }}</span>
          </div>

          <div class="item">
            <span>组件信息</span>
            <span>
              <HrefCardComp
                :header-name="getComponentType(baseTiktokThirdVideoComInfo.componentType).slice(0,-2)"
                :comp-type="baseTiktokThirdVideoComInfo.componentType"
                :link-href="baseTiktokThirdVideoComInfo.componentLinkUrl || '#'"
              >
                <div v-if="baseTiktokThirdVideoComInfo.componentType === 15">
                  <div>{{ baseTiktokThirdVideoComInfo.componentAnchorName || '--' }}</div>
                  <div v-if="baseTiktokThirdVideoComInfo.componentIndustryAnchorId">
                    <i>行业锚点ID:</i>
                    {{ baseTiktokThirdVideoComInfo.componentIndustryAnchorId || '--' }}
                  </div>
                </div>

                <div v-else>
                  <div>{{ baseTiktokThirdVideoComInfo.componentLinkTitle || '--' }}</div>
                  <div v-if="baseTiktokThirdVideoComInfo.componentLinkId">
                    <i>组件ID:</i>
                    {{ baseTiktokThirdVideoComInfo.componentLinkId || '--' }}
                  </div>
                </div>

                <!-- <div v-if="baseTiktokThirdVideoComInfo.componentAnchorStatus" class="examineContent">
                  <i class="dot" />
                  <p>{{ getExamineStatus(baseTiktokThirdVideoComInfo.componentAnchorStatus) }}</p>
                  <div v-if="baseTiktokThirdVideoComInfo.componentAuditRejectReason">
                    <p>{{ baseTiktokThirdVideoComInfo.componentAuditRejectReason }}</p>
                    <span>></span>
                  </div>
                </div> -->
              </HrefCardComp>
            </span>
          </div>
        </div>
      </div>

      <div class="msgItem">
        <h3>监测链接</h3>
        <div class="msgWrap">
          <div class="item">
            <span>点击监测链接</span>
            <span>
              <HrefCardComp header-name="监测链接" :is-open="false" :link-href="baseTiktokThirdMonitorInfo.componentItemMonitorUrl">
                <div>{{ baseTiktokThirdMonitorInfo.componentItemMonitorUrl || '--' }}</div>
              </HrefCardComp>
            </span>
          </div>

          <div class="item">
            <span>视频曝光监测链接</span>
            <span>
              <HrefCardComp header-name="监测链接" :is-open="false" :link-href="baseTiktokThirdMonitorInfo.componentItemShowMonitorUrl">
                <div>{{ baseTiktokThirdMonitorInfo.componentItemShowMonitorUrl || '--' }}</div>
              </HrefCardComp>
            </span>
          </div>
        </div>
      </div>
    </div>
  </Wrap>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import HrefCardComp from './hrefCardComp.vue'
import { dateFormat } from '@/utils'
import Wrap from '@/components/public/Wrap'

export default defineComponent({
  props: {
    statusType: {
      type: String,
      default: 'receive'
    },
    isDetail: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    HrefCardComp,
    Wrap
  },

  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      baseTiktokThirdOrderInfo: {}, // 基本信息
      baseTiktokThirdTalentInfo: {}, // 达人信息
      baseTiktokThirdProductInfo: {}, // 产品介绍
      baseTiktokThirdTaskInfo: {}, // 任务要求
      baseTiktokThirdVideoComInfo: {}, // 视频附加组件
      baseTiktokThirdMonitorInfo: {} // 监测链接
    })

     watch(() => props.data, (newData) => {
      if (Object.keys(newData).length) {
        state.baseTiktokThirdOrderInfo = newData.baseTiktokThirdOrderInfo || {}
        state.baseTiktokThirdTalentInfo = newData.baseTiktokThirdTalentInfo || {}
        state.baseTiktokThirdProductInfo = newData.baseTiktokThirdProductInfo || {}
        state.baseTiktokThirdTaskInfo = newData.baseTiktokThirdTaskInfo || {}
        state.baseTiktokThirdVideoComInfo = newData.baseTiktokThirdVideoEnclosureComponent || {}
        state.baseTiktokThirdMonitorInfo = newData.baseTiktokThirdMonitorInfo || {}
      }
    }, {
      immediate: true
    })

    const getComponentType = (type) => {
      let str = '--'
      switch (type) {
        case 1:
          str = '落地页组件'
          break
        case 15:
          str = '网服下载组件'
          break
        default:
          break
      }
      return str
    }

    const getExamineStatus = (type) => {
      let str = ''
      switch (type) {
        case 1:
          str = '审核未通过'
          break
        default:
          break
      }
      return str
    }

    return {
      ...toRefs(state),
      getComponentType,
      dateFormat,
      getExamineStatus
    }
  }
})
</script>
<style lang="scss" scoped>
  a {
    color: rgb(68, 68, 231);
  }

  .msgItem {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30px;
    padding-bottom: 10px;

    &:last-child {
      border: none;
      margin-bottom: 0;
    }

    .msgWrap {
      margin-top: 24px;

      .item {
        display: flex;
        margin-bottom: 20px;

        span {
          flex: 4;
          display: flex;
          align-items: flex-start;

          &:first-child {
            flex: 1;
            color: rgb(158, 149, 149);
            font-weight: 500;
            width: 12%;
            margin-right: 20px;
          }
        }
      }

      .examineContent {
        display: flex;
        align-items: center;
        border-top: 1px solid #f0f0f0;
        margin-top: 16px;
        padding-top: 16px;

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e94c71;
          display: flex;
          margin-right: 6px;
        }

        p {
          font-size: 16px;
          cursor: pointer;

          &:last-child {
            font-size: 14px;
            width: 180px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .detailMsg {
    .msgItem {
      .msgWrap {
        span {
          &:first-child {
            width: 16%;
          }
        }
      }
    }
  }
</style>
