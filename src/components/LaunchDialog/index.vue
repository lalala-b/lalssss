<template>
  <el-dialog
    :title="title"
    :visible.sync="popStatus"
    :width="width"
    :before-close="onCancel"
  >
    <div class="M-launchDialog">
      <div class="M-launchDialogTitle">
        <p>{{ form.title_name }}</p>
        <el-link v-if="form.rec_link" type="primary" target="_blank" :href="form.rec_link">{{ form.rec_title }}</el-link>
      </div>
      <el-form ref="form" :model="form">
        <div class="M-launchDialogForm">
          <div class="M-launchDialogBase">
            <el-form-item
              :clearable="true"
              required
              label="流量:"
            >
              <el-input v-model="form.flow_count" />
            </el-form-item>
            <el-form-item
              :clearable="true"
              required
              label="投放价格:"
            >
              <el-input v-model="form.delivery_money" />
            </el-form-item>
            <el-form-item
              :clearable="true"
              label="品牌标签:"
            >
              <el-input v-model="form.video_tag" />
            </el-form-item>
            <el-form-item
              :clearable="true"
              label="组件点击量:"
            >
              <el-input v-model="form.cpt_click" />
            </el-form-item>
            <el-form-item
              label="视频上传:"
            >
              <el-upload
                drag
                :with-credentials="true"
                :data="qData"
                :action="uploadUrl"
                :on-error="onImportError"
                :on-success="onImportSuccess"
                :before-upload="onImportReady"
                :disabled="disabled"
                :show-file-list="false"
                name="video"
                :class="{'M-launchDialogUploadFile': form.upload_url !== ''}"
              >
                <p v-if="form.upload_url">{{ getUploadFileName(form.upload_url) }}</p>
                <div
                  v-else
                  v-loading="uploading"
                  class="M-launchDialogUploadCon"
                  element-loading-text="正在上传视频..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.6)"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                </div>
                <div slot="tip" class="el-upload__tip">
                  {{ form.upload_url ? "点击文件名重新上传" : "请上传MP4、flash格式文件" }}
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item
              :clearable="true"
              label="备注:"
            >
              <el-input v-model="form.note" />
            </el-form-item>
          </div>
          <div class="M-launchDialogExt">
            <el-form-item
              label="CPM: "
            >
              <p>{{ form.cpm | toThousands }}</p>
            </el-form-item>
            <!-- <el-form-item
                        :clearable="true" required
                        label="达人类型:"
                    >
                        <div v-if="typeLoading" v-loading="typeLoading" class="M-launchDialogExtLoading"></div>
                        <el-checkbox-group :max="6" v-model="form.tag_ids" v-if="!typeLoading">
                            <el-checkbox v-for="topic in tags.topic" :label="topic.tagName" :key="topic.tag_id">
                                {{topic.tagName}}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item> -->
          </div>
        </div>
      </el-form>
      <div slot="footer" style="text-align:center">
        <el-button size="small" type="primary" :loading="addLoading" @click="onConfirm">确定</el-button>
        <el-button size="small" @click="onCancel">取消</el-button>
      </div>
      <!-- <div class="M-launchDialogFooter">
            <div class="M-launchDialogFns">
                <el-button size="small" round @click="onCancel">取消</el-button>
                <el-button size="small" type="warning" round @click="onConfirm" :loading="addLoading">确定</el-button>
            </div>
        </div> -->
    </div>
  </el-dialog>
</template>
<script>
import { copy, getWithDec, isUndefined, isFunction } from '@/components/common'

/**
 * 默认请求参数模型
 * @type {Object}
 */
const DEF_MODEL = {
  'flow_id': '',
  'flow_count': '',
  'delivery_money': '',
  'belong_team': '',
  'phone': '',
  'upload_url': '',
  'note': '',
  'cpt_click': 0,
  'video_tag': ''
}
export default {
  'props': {
  // 浮层状态
    'status': {
      'type': Boolean,
      default() {
        return false
      }
    },
    // 原始数据
    'subject': {
      'type': Object,
      default() {
        return {}
      }
    },
    // 浮层宽度
    'width': {
      'type': String,
      default() {
        return '960px'
      }
    },
    // 是否回传数据
    'feedback': {
      'type': Boolean,
      default() {
        return false
      }
    },
    'type': {
      'type': Number,
      default() {
        // 0, 1
        return 0
      }
    }
  },
  'computed': {
    title() {
      return this.type ? '编辑投放视频信息' : '添加为投放视频'
    },
    qData() {
      return {
        'third_id': this.subject.third_id
      }
    }
  },
  data() {
    return {
      'tags': {
        'topic': []
      },
      'form': {},
      'popStatus': false,
      'typeLoading': false,
      'addLoading': false,
      'uploading': false,
      'disabled': false,
      'uploadUrl': ''
    }
  },
  created() {
  // this.getAllTags();
  },
  'methods': {
  /**
         * 获取所有标签类型
         */
    getAllTags() {
      this.typeLoading = true
      return this.$request({
        'url': '/getAllMarketTags'
      })
        .then(
          re => {
            this.typeLoading = false
            if (re) {
              this.tags.topic = re.hdTags || []
            }
          }
          , err => {
            this.typeLoading = false
          }
        )
        .catch(err => {
          console.error(err)
        })
    },
    /**
         * 计算 CPM
         */
    calCpm() {
      if (this.form.flow_count && this.form.delivery_money) {
        this.form.cpm = getWithDec(
          this.form.delivery_money / (this.form.flow_count / 1000)
          , 2
        )
        this.form.cpm = this.form.cpm || '0.00'
      } else {
        this.form.cpm = ''
      }
    },
    /**
         * 取消或关闭浮层
         */
    onCancel(done) {
      if (this.$req) {
        try {
          this.$req.abort()
        } catch (e) { console.log(e) }
      }
      this.$refs.form.resetFields()
      if (isFunction(done)) {
        done()
      }
      this.$emit('close')
      this.$emit('update:status', false)
      this.addLoading = false
    },
    /**
         * 确定
         */
    async onConfirm() {
      let re
      try {
        re = await this.$refs.form.validate()
      } catch (e) {
        re = false
      }
      if (re) {
        let re
        try {
          re = await this.addDelivery()
        } catch (e) {
          re = false
        }
        if (re) {
          setTimeout(() => {
            this.onCancel()
          }, 444)
        }
      }
    },
    /**
         * 添加或修改数据
         */
    addDelivery() {
      this.addLoading = true
      var data = {}
      Object.keys(DEF_MODEL).forEach(key => {
        data[key] = this.form[key]
      })
      // var tag_value = this.form.tag_ids;
      // data.tag_ids = this.tags.topic.filter(item => {
      //                                     return data.tag_ids.indexOf(item.tagName) !== -1;
      //                                 })
      //                                 .map(item => item.tag_id);
      // data.tag_ids = JSON.stringify(data.tag_ids);

      this.$req = this.$request({
        'url': '/setAdvDelivery',
        'method': 'post',
        data,
        'raw': true
      })
        .then(
          re => {
            this.$req = null
            if (re) {
              this.$tip(re.msg || '操作成功', 'success')

              // if (this.feedback) {
              //     // 回传给父层的数据
              //     let vals = [];
              //     let row = [];
              //     tag_value.forEach(tag => {
              //         row.push(tag);
              //         if (row.length === 2) {
              //             vals.push(row);
              //             row = [];
              //         }
              //     });
              //     if (row.length) {
              //         vals.push(row);
              //     }
              //     data.cpm = this.form.cpm;
              //     data.tag_value = vals;
              //     delete data.tag_ids;
              //     vals = tag_value = null;
              // }

              this.$emit('success', data, this.feedback)

              return true
            }
            this.addLoading = false
            return false
          }
          , err => {
            this.addLoading = false
            return false
          }
        )
      return this.$req
    },
    /**
         * 上传失败处理函数
         * @type {Boolean}
         */
    onImportError(err) {
      this.$tip(err, 'error')
      this.disabled = false
      this.uploading = false
    },
    /**
         * 上传成功
         * @type {Boolean}
         */
    onImportSuccess(re) {
      if (re && re.code) {
        this.$tip('上传完成')
        this.form.upload_url = re.data
      } else {
        this.$tip(re.msg)
        this.form.upload_url = ''
      }
      this.uploading = false
      this.disabled = false
    },
    /**
         * 准备上传，文件判断
         */
    onImportReady(file) {
      var re = /\.(mp4|flv)$/i.test(file.name)
      if (re) {
        this.disabled = true
        this.uploading = true
      } else {
        this.$tip('只支持 MP4、flash格式文件')
      }
      return re
    },
    /**
         * 获取上传文件名称
         * @type {[type]}
         */
    getUploadFileName(url) {
      if (url) {
        return url.split('/').pop()
      }
      return url
    }
  },
  'watch': {
    'form.flow_count'() {
      this.calCpm()
    },
    'form.delivery_money'() {
      this.calCpm()
    },
    status(val) {
      this.popStatus = val
    },
    subject() {
      var form = copy(this.subject)
      Object.keys(DEF_MODEL).forEach(key => {
        if (isUndefined(form[key])) {
          const set = DEF_MODEL[key] || {}
          let val = set.key ? form[set.key] : null
          if (set.key) {
            delete form[set.key]
          }
          if (isFunction(set.formater)) {
            val = set.formater(val)
          }
          if (!val) {
            val = set.def || ''
          }

          form[key] = val
        }
      })
      this.form = form
    }
  }
}
</script>
