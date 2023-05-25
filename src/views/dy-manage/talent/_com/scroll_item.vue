<template>
  <div>
    <slot :row="row" />
  </div>
</template>
<script>
export default {
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
