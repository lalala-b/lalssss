<template>
  <el-dialog
    title="添加为对标账号"
    :visible="show"
    width="480px"
    @close="onCancel"
  >
    <div class="flex flex-align-center">
      <span class="bench-label">账号名称：</span>
      <a class="flex flex-align-center account-info" :href="dialogData.accountLoginUrl || dialogData.authorUrl" target="_blank">
        <img :src="dialogData.accountImg" alt="">
        <!-- 搜索时会有颜色高亮 -->
        <span v-html="dialogData.accountName" />
      </a>
    </div>
    <div class="flex flex-align-start m-t-24">
      <span class="bench-label">账号标签：</span>
      <div class="flex flex-dir-col">
        <el-input
          v-model.trim="inputTag"
          class="tag-input"
          placeholder="输入标签名称，按回车键生成标签"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <div>
          <el-tag
            v-for="(tag, index) in tagsItem"
            :key="tag"
            closable
            size="small"
            :disable-transitions="false"
            class="m-r-5"
            @close="handleDelTag(index)"
          >{{ tag }}</el-tag>
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="onCancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  props: {
    value: Boolean,
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
    save: {
      type: Function,
      default() {
        return () => null
      }
    }
  },
  data() {
    return {
      loading: false,
      inputTag: '',
      tagsItem: []
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        return this.$emit('input', value)
      }
    }
  },
  methods: {
    handleDelTag(index) {
      this.tagsItem.splice(index, 1)
    },
    handleInputConfirm() {
      if (this.tagsItem.length === 6) {
        this.$message.info('最多只能添加 6 个标签')
        return
      }
      const inputTag = this.inputTag
      if (!inputTag) {
        return
      }
      if (inputTag && !this.tagsItem.includes(inputTag)) {
        this.tagsItem.push(inputTag)
      }
      this.inputTag = ''
    },
    async handleSave() {
      this.save({ tagValue: this.tagsItem }, this.onCancel)
    },
    onCancel() {
      this.show = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .bench-label {
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
