<template>
  <el-dialog
    title="账号粉丝地域分布"
    :visible.sync="show"
    :close="handleClose"
    width="1000px"
  >
    <div>
      <div class="flex flex-justify-between flex-align-center">
        <AccountCard :info="data" />
        <div>粉丝量：{{ data.fansNum | toThousandsW }}</div>
      </div>
      <p>账号添加时间：{{ data.createTime }}</p>
    </div>
    <div>
      <div class="flex flex-wrap m-t-16">
        <div
          class="chart-item flex1 w-50 m-b-24"
        >
          <Title title="全国省份分布" class="p-0  m-b-16" />
          <VChart
            :type="cityMap.type"
            :config="cityMap.config || {}"
            :data="cityMap.data"
            :loading="loading"
          />
        </div>
        <div
          class="chart-item flex1 w-50 m-b-24"
        >
          <div class="flex flex-justify-between">
            <Title title="地域占比TOP10" class="p-0  m-b-16" />
            <el-radio-group v-if="data.platId !== 26" v-model="cityCheck">
              <el-radio-button label="省份分布">省份</el-radio-button>
              <el-radio-button label="城市分布">城市</el-radio-button>
            </el-radio-group>
          </div>
          <VChart
            ref="city"
            :type="cityData.type"
            :config="cityData.config || {}"
            :data="cityData.data"
            :formater="formater"
            :loading="loading"
          />
        </div>
      </div>
    </div>
    <!-- <div slot="footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </div> -->
  </el-dialog>
</template>

<script>
import { defineComponent, computed, ref } from '@vue/composition-api'
import { AccountCard, Title, VChart } from 'components'
import { useToggle } from '@/hook'
import { useEchart } from '@/views/details/account/_pages/hooks'

export default defineComponent({
  props: {
    value: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: { AccountCard, Title, VChart },
  setup(props) {
    const { show, handleClose } = useToggle(props)
    const { charts, loading } = useEchart(props.data.accountId)
    const cityMap = charts.find(_ => _.key === 2)
    const cityBar = charts.find(_ => _.key === 8)

    console.info(cityMap, 'cityMap')

    const cityCheck = ref('城市分布')
    if (props.data.platId === 26) {
      cityCheck.value = '省份分布'
    }

    const cityData = computed(() => {
      let data = {}
      if (cityCheck.value === '城市分布') {
        data = {
          cates: cityBar.data.cates,
          terms: [...cityBar.data.terms].reverse(),
          values: [...cityBar.data.values].reverse()
        }
      } else {
        data = {
          cates: cityMap.data.cates,
          terms: [...cityMap.data.terms.slice(-10)].reverse(),
          values: [...cityMap.data.values.slice(-10)].reverse()
        }
      }
      return {
        type: 'bar',
        config: {
          legend: {
            show: false
          },
          xAxis: {
            boundaryGap: true,
            axisLabel: {
              interval: 0
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: '{b}：{c}%'
          }
        },
        loading,
        data
      }
    })

    const formater = function(config) {
      config.yAxis = {
        axisLabel: {
          formatter(value) {
            return value + '%'
          }
        }
      }
      return config
    }
    return {
      cityData,
      cityMap,
      charts,
      loading,
      cityCheck,
      handleClose,
      formater,
      show
    }
  }
})
</script>
