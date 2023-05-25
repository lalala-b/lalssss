<template>
  <el-dialog class="C-dialog" :visible="value" title="口令信息" :append-to-body="true" @close="onClose">
    <!-- form -->
    <PasswordForm :form-data="formData" :edit-list="editList" :start-time="startTime" @save="save" @cancel="onClose" />
  </el-dialog>
</template>
<script>
import { ref } from '@vue/composition-api'
import PasswordForm from './PasswordForm.vue'

export default {
  components: { PasswordForm },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    editList: {
      type: Object,
      default() {
        return {}
      }
    },
    startTime: Date,
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup() {
    const count = ref(0)

    return {
      count
    }
  },
  methods: {
    save(data) {
      this.$emit('save', data)
      this.onClose()
    },
    onClose() {
      this.$emit('input', false)
    }
  }
}
</script>
