<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import AccountBlacklist from './AccountBlacklist.vue'
import AccountLibrary from './AccountLibrary.vue'
import ProtectionConfig from './ProtectionConfig.vue'
export default {
  components: {
    AccountLibrary,
    AccountBlacklist,
    ProtectionConfig
  },
  setup(props) {
    const ctx = getCurrentInstance()
    const tabs = [
      {
        name: 'AccountLibrary',
        label: '投放账号库',
        permissionName: 'account_library'
      },
      {
        name: 'AccountBlacklist',
        label: '账号黑名单',
        permissionName: 'account_blacklist'
      },
      {
        name: 'ProtectionConfig',
        label: '保护期配置',
        permissionName: 'protection_config'
      }
    ].filter(_ => ctx.proxy.$permission(_.permissionName))
    const activeName = ref(tabs[0].name)

    return {
      tabs,
      activeName
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .table-view .el-link {
    margin-right: 0px;
  }
}
</style>
