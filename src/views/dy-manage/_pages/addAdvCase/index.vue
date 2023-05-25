<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-08 14:33:19
 * @LastEditTime: 2020-09-08 15:13:02
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="添加为广告案例"
    :visible="dialogStatus"
    @close="handleMaskHide"
  >
    <div>
      <el-form ref="form" :model="dialogData" label-width="120px" :rules="dialogRules">
        <el-form-item label="URL链接:">
          <el-link :href="dialogData.url" :underline="false" target="_blank">{{ dialogData.url }}</el-link>
        </el-form-item>
        <el-form-item label="标题:">
          <span>{{ dialogData.titleName }}</span>
        </el-form-item>
        <el-form-item label="行业类别:" prop="topics">
          <el-select
            v-model="dialogData.topics"
            placeholder="请选择"
          >
            <el-option
              v-for="item in advTopics"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="品牌:" prop="brand">
          <el-input v-model="dialogData.brand" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer">
      <el-button @click="handleMaskHide">取消</el-button>
      <el-button :loading="maskLoading" type="primary" @click="handleAddAdvery">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { copy } from '@/components/common'
import { $addAdvert } from '@/api/dy-manage'

export default {
  props: {
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
    advTopics: {
      type: Array,
      default() {
        return []
      }
    },
    dialogStatus: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogRules: {
        topics: [{
          required: true,
          message: '请选择行业类别',
          trigger: 'blur'
        }],
        brand: [{
          required: true,
          message: '请输入品牌信息',
          trigger: 'blur'
        }]
      },
      maskLoading: false
    }
  },
  methods: {
    handleAddAdvery() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const data = copy(this.dialogData)
          delete data.titleName
          data.topics = [data.topics]
          $addAdvert(data).then((res) => {
            if (res.code === 1) {
              this.$message.success('设置成功')
              this.$emit('closeDialog')
            } else {
              this.$message.error(res.message)
            }
          })
        }
      })
    },
    handleMaskHide() {
      this.$emit('closeDialog')
      this.$refs.form.clearValidate()
    }
  }
}
</script>
