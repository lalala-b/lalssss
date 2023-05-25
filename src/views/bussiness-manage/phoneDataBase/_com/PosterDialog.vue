<template>
  <el-dialog
    title="预览"
    :visible.sync="show"
    :width="`${posterType==='1'?900:780}px`"
    :before-close="handleClose"
  >
    <div>
      <template v-if="posterType==='1'">
        <HeavyEnduranceTest :echarts-data="echartsData" />
      </template>
      <template v-if="posterType==='2'">
        <OriginalGod :echarts-data="echartsData" />
      </template>
      <template v-if="['3','4','5','6'].includes(posterType)">
        <ScreenBrightness :poster-type="posterType" :echarts-data="echartsData" />
      </template>
      <template v-if="posterType==='7'">
        <TwentyTest :echarts-data="echartsData" />
      </template>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { AccountCard, IconTip } from 'components'
import { useToggle } from '@/hook'
import TwentyTest from './TwentyTest.vue'
import HeavyEnduranceTest from './HeavyEnduranceTest.vue'
import OriginalGod from './OriginalGod.vue'
import ScreenBrightness from './ScreenBrightness.vue'
import { $getPoster } from '@/api/phoneBase'
export default defineComponent({
  props: {
    value: Boolean,
    posterType: {
      type: String,
      default: '1'
    },
    selectRows: {
      type: Array,
      default: () => {
        return []
      }
    },
    orderField: {
      type: String,
      default: ''
    }
  },
  components: {
    AccountCard,
    IconTip,
    TwentyTest,
    HeavyEnduranceTest,
    OriginalGod,
    ScreenBrightness
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const states = reactive({
      phoneIds: [],
      echartsData: {}
    })
    const formatSelectRows = (list) => {
      states.phoneIds = list.map((item) => item.phoneId)
    }
    watch(() => props.selectRows, (val) => {
      if (val && val.length) {
        formatSelectRows(val)
      }
    }, {
      immediate: true,
      deep: true
    })
    console.log(props)
    const getPoster = () => {
      try {
        const params = {
           posterType: props.posterType,
           phoneIds: states.phoneIds,
           orderField: props.orderField
        }
        $getPoster(params).then(res => {
          if (res.code === 1 && res.data) {
            states.echartsData = res.data
          }
        })
      } catch (err) {
        console.log(err)
      }
    }
   const save = () => {

   }
   getPoster()
    return {
      ...toRefs(states),
      show,
      handleClose,
      save
    }
  }
})
</script>
