<template>
  <div class="flex flex-justify-end m-l-24" v-bind="$attrs">
    <template v-if="!isEdit">
      <slot />
      <el-button v-if="showEditBtn" type="primary" icon="el-icon-edit" size="small" @click="changeIsEdit">{{ editContent }}</el-button>
    </template>
    <template v-if="isEdit">
      <el-button :loading="loading" type="success" icon="el-icon-check" size="small" @click="handleSave">{{ saveContent }}</el-button>
      <el-button v-if="!hiddenCancel" :disabled="loading" type="danger" icon="el-icon-close" size="small" @click="handleCancel">{{ cancelContent }}</el-button>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    hiddenCancel: {
      type: Boolean,
      default: false
    },
    showEditBtn: {
      type: Boolean,
      default: true
    },
    editContent: {
      type: String,
      default: '编辑'
    },
    saveContent: {
      type: String,
      default: '保存'
    },
    cancelContent: {
      type: String,
      default: '取消'
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    isEdit: {
      get: function() {
        return this.value
      },
      set: function(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    this.$bus.$on('handleCancel', this.handleCancel)
  },
  beforeDestroy() {
    this.$bus.$off('handleCancel')
  },
  methods: {
    handleSave() {
      this.loading = true
      this.$emit('handleSave', () => {
        this.loading = false
      })
    },
    handleCancel() {
      this.$emit('handleCancel')
      this.$emit('changeShowPass', false)
      this.isEdit = false
    },
    changeIsEdit() {
      this.isEdit = true
      this.$emit('changeShowPass', true)
    }
  }
}
</script>
