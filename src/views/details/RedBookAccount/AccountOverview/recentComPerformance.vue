<template>
  <el-card v-loading="accountDataLoading" shadow="always">
    <div class="recent-head">
      <span>
        <svg-icon icon-class="pugongying" class="pugongying-logo" />
        小红书蒲公英数据
      </span>
    </div>

    <div class="flex flex-align-center flex-justify-between flex-wrap">
      <div v-for="item in redBookPugongYingDataList" :key="item.title" class="data-item flex flex-center flex-dir-col">
        <p class="item-title">{{ item.title }}<IconTip v-if="item.tipContent" icon-class="iconwenhao" :content="item.tipContent" /></p>
        <p>{{ item.value | toThousandsW }}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import IconTip from '@/components/IconTip'

export default defineComponent({
  props: {
    accountDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    accountDataLoading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const states = reactive({
      redBookPugongYingDataList: {
        clickMidnum: {
          title: '阅读中位数',
          value: ''
        },
        interMidnum: {
          title: '互动中位数',
          value: ''
        },
        videoReadcost: {
          title: '预估阅读单价（视频）',
          value: '',
          tipContent: '结合视频报价和近30日视频日常和合作笔记的阅读中位数（仅统计自然流量）计算，仅作参考，不代表实际效果，实际合作效果与内容质量有关'
        },
        pictureReadcost: {
          title: '预估阅读单价（图文）',
          value: '',
          tipContent: '结合图文报价和近30日图文日常和合作笔记的阅读量中位数（仅统计自然流量）计算，仅作参考，不代表实际效果，实际合作效果与内容质量有关'
        }
      },
      isCooperate: true // 是合作笔记还是日常笔记
    })

    // 将数据转为百分率形式
    // const toRateNumber = (str) => {
    //   return ((Math.round((str * 10000))) / 100.00).toFixed(1) + '%'
    // }

    watch(() => props.accountDetail, (info) => {
      if (Object.keys(info || {}).length) {
        const redBookPugongYingDataList = states.redBookPugongYingDataList
        // 合作笔记
        if (info.coClickMidnum || info.coInterMidnum) {
          states.isCooperate = true
        } else if (info.clickMidnum || info.interMidnum) { // 日常笔记
          states.isCooperate = false
        }
        const arr = []
        Object.keys(redBookPugongYingDataList).forEach(item => arr.push(item))
        arr.forEach(item => {
          const dataItem = redBookPugongYingDataList[item]
          dataItem.value = +info[item] < 0 ? '--' : info[item]

          // 合作
          if (states.isCooperate) {
            if (item === 'clickMidnum') {
              dataItem.value = +info['coClickMidnum'] < 0 ? '--' : info['coClickMidnum']
              dataItem.tipContent = '近30日合作笔记处于中间位置的阅读量'
            } else if (item === 'interMidnum') {
              dataItem.value = +info['coInterMidnum'] < 0 ? '--' : info['coInterMidnum']
              dataItem.tipContent = '近30日合作笔记处于中间位置的互动量（点赞+收藏+评论）'
            }
          } else { // 日常
            if (item === 'clickMidnum') {
              dataItem.tipContent = '近30日日常笔记处于中间位置的阅读量'
            } else if (item === 'interMidnum') {
              dataItem.tipContent = '近30日日常笔记处于中间位置的互动量（点赞+收藏+评论）'
            }
          }
        })
      }
    }, {
      immediate: true
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.recent-head {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .pugongying-logo {
    font-size: 20px;
    margin-bottom: 4px;
  }
}

 .data-item {
    position:relative;
    width: 25%;
    margin-top: 10px;

    p {
      line-height: 32px;
      font-size: 24px;
      font-weight: bold;
      color: $--color-primary;
    }

    .item-title{
      color: #333;
      font-size: 14px;
      font-weight: normal;
    }

    .normal{
      position:absolute;
      top:6%;
      right:21%;
      border:1px solid #ccc;
      color:#ccc;
      border-radius:8px;
      padding:2px 8px;
      font-size:12px;
    }
  }
</style>
