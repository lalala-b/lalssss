<template>
  <div>
    <Detail :type="type" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import Detail from '../_com/detail.vue'

export default defineComponent({
  components: {
    Detail
  },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  setup() {

  },
})
</script>
