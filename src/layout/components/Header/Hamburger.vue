<template>
  <div>
    <i
      :class="isActive ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
      class="hamburger"
      @click="toggleClick"
    />
    <el-breadcrumb v-if="showTitle" class="title m-l-5">
      <template v-for="item in $route.matched">
        <el-breadcrumb-item v-if="item.meta && item.meta.title" :key="item.componentId">{{ item.meta.title }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    showTitle() {
      return this.$route.meta && this.$route.meta.hidden === true
    },
    title() {
      return this.$route.matched.map(item => item.meta.title).join('-')
    }
  },
  created() {
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped lang="scss">
.hamburger {
  display: inline-block;
  vertical-align: middle;
  font-size: 20px;
  color: inherit;
  // color: #fff;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
.title {
  font-size: $--font-size-base;
  // color: #fff;
  color: inherit;
  ::v-deep {
    .el-breadcrumb__inner, .el-breadcrumb__separator {
      // color: #fff;
      color: inherit;
    }
  }
}
</style>
