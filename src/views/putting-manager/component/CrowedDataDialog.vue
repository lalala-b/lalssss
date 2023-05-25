<template>
  <el-dialog width="500px" :visible="show" @close="handleClose">
    <p class="crowed-title">通用</p>
    <el-row class="m-t-12">
      <el-col :span="12">
        年龄占比（18-40岁）：{{ data.ageProportion|emptyFill }}
      </el-col>
      <el-col :span="12">
        一二线城市占比：{{ data.firstAndSecondLineCityProportion|emptyFill }}
      </el-col>
    </el-row>
    <p class="m-t-16 crowed-title">抖音</p>
    <el-row class="m-t-12">
      <el-col :span="12">
        五大人群占比：{{ data.fiveGroupsProportion |emptyFill }}
        <IconTip
          type="popover"
          content="都市白领+资深中产+都市蓝领+精致妈妈+Z世代占比合计"
          icon-class="iconwenhao"
        />
      </el-col>
      <el-col :span="12">
        负向指标占比：{{ data.negativeIndicatorProportion|emptyFill }}
        <IconTip
          type="popover"
          content="小镇青年+都市银发占比合计"
          icon-class="iconwenhao"
        />
      </el-col>
    </el-row>
    <el-row class="m-t-12">
      近30天粉丝观看频次（1次以下）占比：{{ data.viewingFrequencyProportion|emptyFill }}
    </el-row>
    <p class="m-t-16 crowed-title">快手</p>
    <p class="m-t-12">
      手机设备价格占比(2000-5000以上)：{{ data.phonePriceProportion|emptyFill }}</p>
  </el-dialog>
</template>
<script>
import { useToggle } from '@/hook'
import { IconTip } from 'components'
export default {
  components: {
    IconTip
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, ctx) {
    const { show, handleClose } = useToggle(props)
    return {
      show,
      handleClose
    }
  }
}
</script>
<style lang="scss" scoped>
.crowed-title{
  font-size: 14px;
  font-weight: 600;
}
::v-deep{
  .el-dialog__headerbtn{
    top: 10px;
  }
  .el-dialog__header {
    padding: 0;
    padding-bottom: 0px;
    border: none;
}
}
</style>
