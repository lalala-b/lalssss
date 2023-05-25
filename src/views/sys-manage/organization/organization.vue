<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:33:55
 * @LastEditTime: 2020-09-04 17:01:21
 * @LastEditors: Luoxd
-->
<template>
  <div class="organization">
    <!-- 组织结构树形图 -->
    <tree ref="tree" @open="openDialog" @setCurr="setDialogCurr" />
    <!-- 部门详情 -->
    <detail :data="detailData" @updateTree="updateTree" />
    <!-- 添加弹层 -->
    <add v-if="addDialog.show" v-model="addDialog.show" :data="addDialog.data" @updateTree="updateTree" />
  </div>
</template>
<script>
import detail from './detail.vue'
import tree from './tree.vue'
import add from './add.vue'

export default {
  components: {
    detail,
    tree,
    add
  },
  data() {
    return {
      tableData: [],
      dialogStatus: {
        del: false
      },
      loading: false,
      nowPage: 0,
      addDialog: {
        show: false,
        data: {
          curr: null,
          children: null
        }
      },
      detailData: null,
      total: 0
    }
  },
  created() {

  },
  methods: {
    onDel() {},
    openDialog() {
      this.addDialog.show = true
    },
    /**
     * 设置选择的部门
     */
    setDialogCurr(data) {
      if (!data) {
        this.addDialog.data.curr = null
        this.detailData = {}
        return
      }
      this.addDialog.data.curr = data
      this.detailData = {
        orgName: data.orgName,
        remark: data.remark,
        id: data.id
      }
    },
    /**
     * 更新树形图
     */
    updateTree() {
      this.$refs.tree.getOrganization()
    }
  }
}
</script>
<style lang="scss" scoped>
  .organization {
    // height: 100%;
    // display: flex;
  }
</style>
