<template>
  <component :is="renderName" :data="data" :head-height="headHeight">
    <template v-slot:hoverHead>
      <slot name="hoverHead" />
    </template>
  </component>
</template>
<script>
import typeCard from './components/typeCard'
import typeText from './components/typeText'

export default {
  components: { typeCard, typeText },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    headHeight: {
      type: String,
      default: ''
    }
  },
  computed: {
    renderName() {
      switch (this.type) {
          case 'card':
            return 'typeCard'
          case 'text':
          default:
            return 'typeText'
      }
    }
  }
}
</script>
