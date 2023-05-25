<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:09
 * @LastEditTime: 2020-09-08 14:28:42
 * @LastEditors: Luoxd
-->
<template>
  <div class="form-view">
    <el-form :inline="true">
      <el-form-item v-for="(item, index) in config" :key="index" :label="item.name" :required="true">
        <component :is="`${item.is}`" v-model="item.value" :type="item.type || null" :style="{ width: item.width || '240px' }" />
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="onSet">修改</el-button>
        <el-button size="small" :disabled="!data" @click="onDel">删除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { $setOrganizationInfo, $delOrganizationInfo } from '@/api/backend-manage'

export default {
  props: {
    data: {
      type: Object,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      config: {
        orgName: {
          is: 'el-input',
          value: '',
          name: '组织名'
        },
        remark: {
          is: 'el-input',
          type: 'textarea',
          value: '',
          name: '组织说明'
        }
      }
    }
  },
  watch: {
    'data'(newData) {
      this.syncData(newData)
    }
  },
  methods: {
    syncData(data) {
      for (const key in this.config) {
        this.config[key].value = data[key]
      }
    },
    /**
     * 修改保存
     */
    async onSet() {
      const params = {
        id: this.data.id
      }
      for (const key in this.config) {
        const { value, name } = this.config[key]
        if (!value) {
          this.$message({
            message: '请输入' + name,
            type: 'error'
          })
          return
        }
        params[key] = value
      }
      const re = await $setOrganizationInfo(params)
      if (re.code === 1) {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$emit('updateTree')
      }
    },
    /**
     * 删除按钮触发
     */
    onDel() {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del()
      })
    },
    /**
     * 请求删除
     */
    async del() {
      const re = await $delOrganizationInfo(this.data.id)
      if (re.code === 1) {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.$emit('updateTree')
        this.reset()
      }
    },
    /**
     * 重置
     */
    reset() {
      for (const key in this.config) {
        this.config[key].value = ''
      }
    }
  }
}
</script>
