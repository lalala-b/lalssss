<template>
  <div>
    <el-dialog title="签约失败原因" :visible="show" :before-close="handleClose">
      <el-table :data="data">
        <el-table-column prop="signUserName" label="签约经纪人" />
        <el-table-column prop="signGroupName" label="所属团队" />
        <el-table-column prop="signTeamName" label="所属小组" />
        <el-table-column prop="reasonForFailure" label="签约失败原因" />
        <el-table-column prop="faildTime" label="签约失败时间" />
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: []
    }
  },
  setup(_, { emit }) {
    const handleClose = () => {
      emit('onClose')
    }

    return {
      handleClose
    }
  }
})
</script>
