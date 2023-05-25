<template>
  <el-dialog
    title="修改内容主题"
    :visible="show"
    @close="onCancel"
  >
    <div class="flex flex-align-center">
      <span class="bench-label">账号名称：</span>
      <a class="flex flex-align-center account-info" :href="data.accountLoginUrl || data.authorUrl" target="_blank">
        <img :src="data.accountImg" alt="">
        <span v-html="data.accountName" />
      </a>
    </div>
    <div class="flex flex-align-start m-t-24">
      <div class="bench-label">内容主题：</div>
      <div class="flex-value">
        <el-checkbox-group v-model="data.topics" :max="6">
          <el-checkbox
            v-for="topic in topicsTags"
            :key="topic.tagId"
            :label="topic.tagId"
          >{{ topic.tagName }}</el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $changeAccountTopic } from '@/api/dy-manage'
import { copy } from '@/utils'
export default {
  props: {
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
    show: Boolean,
    topicsTags: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      data: {}
    }
  },
  created() {
    this.data = copy(this.dialogData)
  },
  methods: {
    handleSave() {
      this.loading = true
      const params = {
        accountId: this.data.accountId,
        topics: this.data.topics.filter(item => item)
      }
      $changeAccountTopic(params).then((res) => {
        if (res.code === 1) {
          this.$message.success('设置成功')
          this.$emit('success', params)
          this.onCancel()
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.$message.error(err.message)
        this.loading = false
      })
    },
    onCancel() {
      this.$emit('update:show', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .bench-label {
    flex-shrink: 0;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 32px;
  }
  .account-info {
    img {
      width: 32px;
      height: 32px;
      margin-right: 4px;
      border-radius: 50%;
    }
  }
  .tag-input {
    font-size: 14px;
    width: 240px;
    margin-bottom: 8px;
  }
</style>

