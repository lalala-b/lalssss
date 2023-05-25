<template>
  <el-dialog
    :visible="show"
    title="口令"
  >
    <p>若存在多个口令请点击添加按钮分别录入</p>
    <ul>
      <li />
    </ul>
  </el-dialog>
</template>
<script>
import { useToggle } from '@/hook'
export default {
  setup(props, { emit }) {
    const show = useToggle(props.value, emit)
    return { show }
  }
}
</script>
