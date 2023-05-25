<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="账户管理" name="accountManage">
      <User v-if="activeName === 'accountManage'" />
    </el-tab-pane>
    <el-tab-pane label="离职移交" name="accountMove">
      <Move v-if="$permission('resignation_transfer') && activeName === 'accountMove'" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import User from './users/'
import Move from './move/'
export default defineComponent({
  components: { User, Move },
  setup() {
    const activeName = ref('accountManage')
    const handleClick = () => {}

    return {
      activeName,
      handleClick
    }
  }
})
</script>
