<template>
  <el-dialog
    title="添加为SOP账号"
    :visible="show"
    @close="onCancel"
  >
    <el-form label-width="90px">
      <el-form-item label="账号名称：">
        <div class="account-info flex flex-align-center">
          <img :src="data.accountImg" alt="">
          <span v-html="data.accountName" />
        </div>
      </el-form-item>
      <el-form-item label="URL：">
        <el-link :href="data.url" :underline="false" target="_blank">{{ data.url }}</el-link>
      </el-form-item>
      <el-form-item label="内容主题：">
        <el-checkbox-group v-model="data.topics" :max="6">
          <el-checkbox
            v-for="topic in topicsTags"
            :key="topic.tagId"
            :label="topic.tagId"
          >{{ topic.tagName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="点评：">
        <el-input v-model="data.comment" placeholder />
      </el-form-item>
      <Notice />
    </el-form>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onAccountConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Notice } from 'components'
import { $setSOPAccount } from '@/api/dy-manage'
import { copy } from '@/utils'

export default {
  components: { Notice },
  props: {
    show: Boolean,
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
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
    onCancel() {
      this.$emit('update:show', false)
    },
    onAccountConfirm() {
      this.loading = true
      this.data.topics = this.data.topics.filter(item => item)
      $setSOPAccount(this.data).then(res => {
        if (res.code === 1) {
          this.$message.success('设置成功')
          this.$emit('success', this.data)
          this.$emit('update:show', false)
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        this.$message.error(err.message)
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .account-info {
    > img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
  .notice {
    padding: 16px;
    background: #F0F0F0;
    > h3 {
      font-size: 14px;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 8px;
    }
    > p {
      line-height: 16px;
      font-size: 12px;
    }
  }
</style>
