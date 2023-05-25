<template>
  <div class="C-scroll-list">
    <div class="scroll-header">
      <div v-for="(item, index) in $slots" :key="index" class="scroll-th scroll-row">
        <p>{{ item[0].data.attrs.title }}</p>
      </div>
    </div>
    <template v-if="has">
      <div v-for="(dataItem, dataIndex) in data" :key="dataIndex" class="scroll-content">
        <slot />
        <div v-for="(item, index) in $slots" :key="index" class="scroll-td scroll-row">
          <!-- <component :is="item">
          </component> -->
          <!-- <ScrollItem>
            <component :is="`scroll-col-${index}`" :row="dataItem">
            </component>
          </ScrollItem> -->
          <slot :name="item[0].data.slot" :row="dataItem" />
          <!-- <slot name="ranking" /> -->
        </div>
      </div>
    </template>
  </div>
</template>
<script>
// import ScrollItem from './scroll_item.vue'

export default {
  // components: { ScrollItem },
  props: {
    header: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      has: false
    }
  },
  created() {
    const slots = this.$slots
    console.log(this, slots, '--slots')
    // let index = 0
    // for(let key in slots) {
    //   Vue.component(`scroll-col-${index}`, {
    //     props: {
    //       row: Object
    //     },
    //     render: function (createElement) {
    //       return slots[key]
    //     }
    //   })
    //   index++
    // }
    this.has = true
  }
}
</script>
<style lang="scss" scoped>
  .C-scroll-list {
    .scroll-header, .scroll-content {
      display: flex;
      > * {
        flex: 1;
      }
    }
    .scroll-header {
      .scroll-th {
        font-size: 14px;
        font-weight: bold;
      }
    }
    .scroll-row {
      height: 34px;
      display: flex;
      align-items: center;
      justify-items: center;
      padding: 0 6px;
    }
  }
</style>
