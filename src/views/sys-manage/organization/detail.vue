<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:50:39
 * @LastEditTime: 2020-08-21 16:21:36
 * @LastEditors: Luoxd
-->
<template>
  <Wrap v-loading="loading" class="organization-view">
    <!-- 表单 -->
    <DForm :data="data" @updateTree="updateTree" />
    <!-- tab -->
    <DTabs :data="data" />
  </Wrap>
</template>

<script>
import DForm from './form.vue'
import DTabs from './tab.vue'

export default {
  components: {
    DForm, DTabs
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false
    }
  },
  created() {

  },
  methods: {
    updateTree() {
      this.$emit('updateTree')
    }
  }
}
</script>
<style lang="scss" scoped>
  .organization-view {
    // flex: 1;
    margin-left: 320px;
  }
</style>
