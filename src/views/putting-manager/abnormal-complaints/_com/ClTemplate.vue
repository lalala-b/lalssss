<template>
  <el-dialog
    title="磁力聚星视频作品删除申请（模板工单）"
    :visible.sync="show"
    :before-close="handleClose"
    :append-to-body="true"
    width="500px"
  >
    <ul>
      <li>代理商：深圳市向乾文化传播有限公司</li>
      <li>网红昵称：{{ info.accountName }}</li>
      <li>网红ID：{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</li>
      <li>视频链接：{{ info.url }}</li>
      <li>申请原因：{{ formModel.appealReason || info.appealReason || '' }}</li>
      <li>发布时间： {{ info.addTime }}</li>
      <li>视频标题：{{ info.titleName }}</li>
      <li>订单ID：{{ info.thirdOrderId }}</li>
      <li>任务ID：{{ info.platTaskId }}</li>
      <li>（与达人的确认截图需要体现原由及达人确认的全部信息）</li>
    </ul>
  </el-dialog>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useToggle } from '@/hook/index'
export default defineComponent({
  props: {
    value: Boolean,
    info: {
      type: Object,
      default: () => {}
    },
    formModel: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const { show, handleClose } = useToggle(props)
    return { show, handleClose }
  }
})
</script>
