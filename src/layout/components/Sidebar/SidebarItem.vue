<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-08 20:14:01
 * @LastEditTime: 2020-11-24 16:03:46
 * @LastEditors: Linjie
-->
<template>
  <div v-if="!item.meta || !(item.meta && item.meta.hidden)">
    <el-menu-item
      v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)"
      :index="basePath"
    >
      <item :icon="onlyOneChild.meta && onlyOneChild.meta.icon || (item.meta && item.meta.icon)" :title="onlyOneChild.meta && onlyOneChild.meta.title || onlyOneChild.text" />
    </el-menu-item>
    <el-submenu
      v-else
      :index="basePath"
    >
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  mounted() {
    // if (this.menuType === 'el-submenu') {
    //   const redefine_el_submenu_handleMouseenter = function(event) {
    //   // ignore some original handleMouseenter code, please parse by yourself.//

    //     if (this.appendToBody && this.$parent.$el !== event.target) {
    //       this.$parent.$el.dispatchEvent(new MouseEvent('mouseenter'))
    //     }
    //   }
    //   this.$children[0].handleMouseenter = (event) => {
    //     redefine_el_submenu_handleMouseenter.call(this.$children[0], event)
    //   }
    // }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }
      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
