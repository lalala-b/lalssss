<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-01 15:10:29
 * @LastEditTime: 2020-11-07 14:02:17
 * @LastEditors: Linjie
-->
<template>
  <div v-if="config.length" class="C-department" :class="inline ? 'inline' : ''">
    <template v-for="(item, index) in config">
      <el-form-item :key="item.key">
        <el-select v-model="valueData[index]" :placeholder="item.placeholder" clearable @change="handleChange(item, index)">
          <el-option v-for="option in item.data" :key="option.orgId" :label="option.orgName" :value="option.orgId" />
        </el-select>
      </el-form-item>
    </template>
  </div>
</template>
<script>
import { $getOrgCondition } from '@/api'

export default {
  props: {
    orgChange: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean
    },
    hiddenLevel: {
      type: Array,
      default() {
        return []
      }
    },
    needLastLevel: {
      type: Boolean,
      default: true
    },
    hasPermission: {
      type: Boolean,
      default: true
    },
    showGroup: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      //
      config: [],
      valueData: []
    }
  },
  created() {
    this.configData = {}
    this.setConfig()
    this.getOrgCondition()
  },
  methods: {
    setConfig() {
      let config = [
        {
          componentType: 'el-select',
          key: 'depthLayer1',
          depthLayer: 1,
          placeholder: '选择部',
          permissionName: 'middleground',
          data: []
        },
        {
          componentType: 'el-select',
          key: 'depthLayer2',
          depthLayer: 2,
          placeholder: '请选择军/工作室',
          permissionName: ['d_j_id', 'd_g_id'],
          data: []
        },
        {
          componentType: 'el-select',
          key: 'depthLayer3',
          depthLayer: 3,
          placeholder: '选择团',
          permissionName: this.showGroup ? 'f_id' : 'not-show-group',
          data: []
        }
      ]
      config = config.filter((item) => {
        return this.hasPermission ? (this.$permission(item.permissionName) && !this.hiddenLevel.includes(item.depthLayer)) : !this.hiddenLevel.includes(item.depthLayer)
      })
      if (!this.needLastLevel && this.config.length === 1) {
        this.config = []
      } else {
        this.config = config
      }
    },
    getOrgCondition(orgId = '', depthLayer = 0) {
      if (depthLayer in this.config) {
        $getOrgCondition({
          orgId
        }).then((res) => {
          if (res.code === 1) {
            this.config[depthLayer].data = res.data || []
          }
        }).catch(err => {})
      }
    },
    /**
     * 重置
     */
    reset() {
      const val = []
      for (let i = 0; i < this.valueData.length; i++) {
        val.push('')
      }
      this.valueData = val
    },
    /**
     * 选择触发
     */
    handleChange(row, index) {
      const value = this.valueData[index]
      for (let i = index + 1; i < this.config.length; i++) {
        this.$set(this.valueData, i, '')
        this.config[i].data = []
      }
      if (value) {
        this.$emit('input', value)
        this.getOrgCondition(value, index + 1)
      } else {
        if (index > 0) {
          const value = this.valueData[index - 1]
          this.$emit('input', value)
        } else {
          this.$emit('input', '')
        }
      }
      this.$emit('orgChange', value, row.depthLayer)
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-department {
    &.inline {
      display: inline-block;
      vertical-align: top;
    }
    & > .el-select {
      margin-right: 10px;
    }
  }
</style>
