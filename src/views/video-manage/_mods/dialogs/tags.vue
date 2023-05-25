<template>
  <el-dialog
    class="M-benchmarkTagsDialog"
    title="修改标签"
    :visible.sync="status"
    @close="onCancel"
  >
    <div class="M-benchmarkTagsDialogTags">
      <div class="M-benchmarkTagsDialogTagsLabel">账号标签:</div>
      <div class="M-benchmarkTagsDialogTagsCon">
        <div>
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            v-model="inputTag"
            class="input-new-tag"
            size="small"
            placeholder="输入标签"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
        </div>
        <p>输入标签名称，按 回车键 生成标签</p>
      </div>
    </div>
    <div slot="footer" class="M-benchmarkTagsDialogFooter">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { copy } from '@/components/common'
// 最多添加的 tag 数量
const MAX_TAG = 6

export default {
  'props': {
    'status': {
      'type': Boolean,
      default() {
        return false
      }
    },
    'subject': {
      'type': Object,
      default() {
        return {}
      }
    },
    'userid': {
      'type': Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      'loading': false,
      'inputTag': '',
      MAX_TAG,
      'tags': []
    }
  },
  // ,"computed":{
  //     tags() {
  //         return this.subject.note ? copy(this.subject.note) : [];
  //     }
  // }
  'methods': {
  // 取消删除
    onCancel() {
      this.inputTag = ''
      this.$emit('close')
      this.$emit('update:status', false)
    },
    // 确认删除
    onConfirm() {
      this.loading = true
      this.$request({
        'url': '/modifyBenchmarkTags',
        'method': 'post',
        'data': {
          'user_id': this.userid,
          'account_id': this.subject.account_id,
          'note': this.tags.join(',')
        }
      })
        .then(
          re => {
            this.loading = false
            if (re) {
              this.$tip('修改成功', 'success')
              this.$emit('tag', true, this.subject)
              this.subject.note = copy(this.tags)
              this.onCancel()
            }
          }
          , err => {
            this.$emit('tag', false, this.subject)
            this.loading = false
          }
        )
    },
    // 删除标签
    handleClose(tag) {
      this.tags.splice(
        this.tags.indexOf(tag), 1
      )
    },
    // 确认标签输入
    handleInputConfirm() {
      if (this.tags.length > MAX_TAG) {
        this.$tip(`最多只能添加 ${MAX_TAG} 个标签`)
        return
      }
      var inputTag = this.inputTag
      if (inputTag && this.tags.indexOf(inputTag) === -1) {
        this.tags.push(inputTag)
      }
      this.inputTag = ''
    }
  },
  'watch': {
    subject(nVal, oVal) {
      if (nVal !== oVal) {
        this.tags = this.subject.note ? copy(this.subject.note) : []
      }
    }
  }
}
</script>
