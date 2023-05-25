<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { ref } from '@vue/composition-api'
import Fans from './fans.vue'
import Spectator from './spectator.vue'
import FerrousPowder from './ferrousPowder.vue'
export default {
  components: {
    Fans,
    Spectator,
    FerrousPowder
  },
  setup(props) {
    const tabs = [
      {
        name: 'Spectator',
        label: '观众画像'
      },
      {
        name: 'Fans',
        label: '粉丝画像'
      },
      {
        name: 'FerrousPowder',
        label: '铁粉画像'
      }
    ]
    const activeName = ref(tabs[0].name)
    return {
      tabs,
      activeName
    }
  }
}
</script>
