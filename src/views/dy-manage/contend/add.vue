<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-03 11:15:11
 * @LastEditTime: 2020-12-04 18:22:04
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    width="480px"
    title="添加竞品"
    :visible="addShow"
    append-to-body
    @close="innerModalClose"
  >
    <div class="flex flex-align-start">
      <span class="add-label">竞品名称：</span>
      <div class="flex flex-dir-col">
        <el-input
          v-model.trim="inputValue"
          placeholder="输入竞品名称，按回车键生成"
          style="width: 362px;margin-bottom: 8px;"
          maxlength="20"
          show-word-limit
          class="input-new-tag"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <div>
          <el-tag
            v-for="(tag, index) in contendTags"
            :key="tag"
            class="m-r-10 m-b-10"
            closable
            :disable-transitions="false"
            @close="handleClose(index)"
          >{{ tag }}</el-tag>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="innerModalClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="innerConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $addContend } from '@/api/contend'
export default {
  props: {
    addShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputValue: '',
      contendTags: [],
      inputVisible: false,
      loading: false
    }
  },
  methods: {
    innerModalClose() {
      this.inputValue = ''
      this.contendTags = []
      this.inputVisible = false
      this.$emit('update:addShow', false)
    },
    innerConfirm() {
      if (this.contendTags.length === 0) {
        return this.$message.info('请添加竞品名称')
      }
      this.loading = true
      $addContend({ competeName: this.contendTags.join(',') }).then(res => {
        if (res.code === 1) {
          this.innerModalClose()
          this.$message.success('添加成功，系统开始检索竞品数据，十分钟后可查看最新结果，请稍候。')
          this.$emit('addSuccess')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    handleClose(index) {
      this.contendTags.splice(index, 1)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (this.contendTags.includes(inputValue)) {
        return this.$message.info('重复添加')
      }
      if (inputValue) {
        this.contendTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-label {
    line-height: 32px;
  }
</style>
