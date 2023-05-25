<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-14 16:06:28
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="adlib-edit-dialog"
      title="编辑广告库"
      width="500px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="视频优势">
            <el-checkbox-group v-model="form.videoAdvantage">
              <el-checkbox v-for="item in videoAdvantageList" :key="item.value" :label="item.value">
                {{ item.label }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="form.note" type="textarea" maxlength="50" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="save">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 组织架构选择弹框 -->
    <organizeSelect v-if="organizeVisible" v-model="organizeVisible" @save="onOrganizeEdit" />
  </div>
</template>
<script>
import organizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { $editAdvVideo, $getAdvVideoNote } from '@/api/bussiness-manage'

export default {
  components: { organizeSelect },
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { videoAdvantage: [], note: '' },
      organizeVisible: false,
      loading: false,
      rules: {
        videoAdvantage: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ]
      },
      videoAdvantageList: [
        { label: '数据好', value: 1 },
        { label: '创意好', value: 2 },
        { label: '转化好', value: 3 }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      $getAdvVideoNote({
        flowId: this.data.flowId
      })
        .then(res => {
          this.form.note = res.data.note
          if (res.data.videoAdvantage.length) {
            this.form.videoAdvantage = res.data.videoAdvantage.split(',').map(t => t - 0)
          }
        })
    },
    save() {
      if (this.loading) {
        return
      }
      const params = JSON.parse(JSON.stringify(this.form))
      params.videoAdvantage = params.videoAdvantage.sort().join(',')
      params.flowId = this.data.flowId
      $editAdvVideo(params)
        .then(res => {
          if (res.code === 1) {
            this.$message.success(res.message || '保存成功')
            this.$emit('input', false)
            this.$emit('updateTable')
            this.$bus.$emit('upLog', { flowId: params.flowId, operation_module: '编辑确定' })
          } else {
            this.$message.error('保存失败')
          }
          this.loading = false
        })
    }
  }
}
</script>
