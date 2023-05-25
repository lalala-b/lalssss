<template>
  <el-dialog
    :title="id ? '标记修改' : '视频标记'"
    :visible.sync="show"
    width="40%"
    :before-close="handleClose"
  >
    <el-cascader
      ref="cascader"
      v-model="b2cPhoneModelId"
      placeholder="请选择产品型号"
      class="m-r-10"
      :options="data"
      :show-all-levels="false"
      :props="{
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'modelId',
        label: 'modelName',
        children: 'phoneModelVOList' }"
      filterable
      clearable
      :filter-method="dataFilter"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  $updatePhoneModel
} from '@/api/military-manage'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    },
    rowData: {
      type: Object,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      b2cPhoneModelId: ''
    }
  },
  watch: {
    show(val) {
      if (!val) {
        this.b2cPhoneModelId = ''
      }
    },
    id(val) {
      this.b2cPhoneModelId = val
    }
  },
  methods: {

    handleClose() {
      this.$emit('close')
    },
    handleConfirm() {
      const lastNode = this.$refs.cascader.getCheckedNodes().filter(item => !item.hasChildren)
      console.info('----lastNode', lastNode)
      if (!lastNode.length) {
        this.$message.error('请选择产品型号')
        return
      }

      const data = { flowId: this.rowData.flowId, b2cPhoneModelId: lastNode[0].value }

      $updatePhoneModel(data)
        .then(re => {
          if (+re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
            this.$emit('confirm')
          } else {
            this.$message.error(re.message)
          }
        })
    },
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    }
  }
}
</script>
