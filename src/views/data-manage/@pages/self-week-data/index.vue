<template>
  <div class="P-qianWeekData">
    <div class="data-wrap">
      <div class="list-tree">
        <el-tree
          :data="list"
          node-key="extValue"
          :current-node-key="defaultKey"
          :props="defaultProps"
          :highlight-current="true"
          @node-click="handleBtnClick"
        />
      </div>
      <div class="iframe-wrap">
        <iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" :src="url" />
      </div>
    </div>
  </div>
</template>
<script>
import { $getDashBoardLink } from '@/api/data'
export default {
  data() {
    return {
      list: [],
      url: '',
      defaultProps: {
        children: 'children',
        label: 'extValue'
      },
      defaultKey: ''
    }
  },
  created() {
    $getDashBoardLink().then(res => {
      if (res.code === 1) {
        this.list = res.data
        this.url = res.data.length > 0 ? res.data[0].dictValue : ''
        this.defaultKey = res.data.length > 0 ? res.data[0].extValue : ''
      } else {
        this.$message.error(res.message)
      }
    }).catch(err => {
      if (err.__CANCEL__) {
        return
      }
      this.$message.error(err.message)
    })
  },
  methods: {
    handleBtnClick(item) {
      this.url = item.dictValue
    },
    hanleChange() {}
  }
}
</script>
<style lang="scss" scoped>
  .data-wrap {
    .list-tree {
      position: absolute;
      left: 0;
      top: 0%;
      bottom: 0;
      width: 120px;
      background: #fff;
      // transform: translateY(-50%);
    }
    .iframe-wrap {
      position: absolute;
      top: 0px;
      left: 120px;
      bottom: 0;
      right: 0px;
    }
  }

</style>
