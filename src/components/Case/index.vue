<template>
  <el-dialog
    class="M-caseDialog"
    :title="title"
    :visible.sync="status"
    @close="onCancel"
  >
    <div class="M-caseDialogType" data-type="1">
      <el-form ref="exist" :model="form" :rules="rules" :inline="true">
        <el-form-item prop="author_id">
          <el-select
            v-model="form.author_id"
            placeholder="请选择案例名"
            @change="onAuthorChange"
          >
            <el-option
              v-for="item in authorData"
              :key="item.val"
              :label="item.text"
              :value="item.val"
            />
          </el-select>
        </el-form-item>

        <el-form-item prop="case_id">
          <el-select
            v-model="form.case_id"
            placeholder="请选择活动名"
          >
            <el-option
              v-for="item in caseListData"
              :key="item.val"
              :label="item.text"
              :value="item.val"
            />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <el-divider><i class="el-icon-plus" /></el-divider>
    <div class="M-caseDialogType" data-type="2">
      <el-form ref="newCase" :model="addForm" :inline="true">
        <div>
          <el-form-item label="添加案例">
            <el-input v-model="addForm.author_name" placeholder="请输入案例名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" :loading="authorLoading" @click="addAuthor">新增案例</el-button>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="添加活动">
            <el-select
              v-model="addForm.author"
              placeholder="请选择案例名"
              value-key="val"
            >
              <el-option
                v-for="item in authorData"
                :key="item.val"
                :label="item.text"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="addForm.case_name" placeholder="请输入案例名" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" :loading="caseLoading" @click="addCase">新增活动</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div slot="footer" class="M-caseDialogFooter">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import './index.scss'
import { toOptions, copy } from '@/components/common'
import { $addMarketAdv, $getAllMarketAuthor, $getAllMarketCases, $addAdvAuthor } from '@/api/marketing'

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
    }
  },
  'computed': {
    title() {
      return this.subject.adv_id === 1 ? '绑定案例' : '编辑案例'
    }
  }, data() {
    return {
      'authorData': [],
      'caseListData': [],
      'addForm': {},
      'form': {
        'flow_id': '',
        'author_id': '',
        'case_id': ''
      },
      'rules': {
        'author_id': {
          'required': true,
          'message': '请选择案例名',
          'trigger': 'change'
        },
        'case_id': {
          'required': true,
          'message': '请选择活动名',
          'trigger': 'change'
        }
      },
      'loading': false,
      'authorLoading': false,
      'caseLoading': false
    }
  },
  created() {
    this.getAllAuther()
  },
  'methods': {
  // 确定
    async onConfirm() {
      let re
      try {
        re = await this.$refs.exist.validate()
      } catch (e) {
        re = false
      }
      if (re) {
        this.form.flow_id = this.subject.flow_id
        let result
        try {
          result = await this.addRecord()
        } catch (e) {
          result = false
        }
        if (result) {
          let adv = this.authorData.filter(item => {
            return item.val === this.form.author_id
          })
          let advCase = this.caseListData.filter(item => {
            return item.val === this.form.case_id
          })
          adv = adv && adv[0]
          advCase = advCase && advCase[0]
          if (adv && advCase) {
            this.subject.lebal = `${adv.text}--${advCase.text}`
          }
        }
        this.onCancel()
      }
    },
    // 新增或编辑案例
    addRecord() {
      var data = copy(this.form)
      this.loading = true
      return $addMarketAdv(data)
        .then(
          re => {
            this.loading = false
            if (re.code === 1) {
              this.$message({
                message: '操作成功',
                type: 'success'
              })
            } else {
              this.loading = false
            }
          }
        )
        .catch(err => {
          console.error(err)
        })
    },
    // 取消
    onCancel() {
      // this.status = false;
      this.$refs.exist.resetFields()
      this.$emit('close')
      this.$emit('update:status', false)
    },
    // 所有的案例
    getAllAuther() {
      $getAllMarketAuthor()
        .then((re) => {
          if (re.code === 1) {
            this.authorData = toOptions(
              re
              , {
                'valKey': 'id',
                'textKey': 'author_name'
              }
            )
          }
        })
    },
    /**
         * 获取案例下的所有活动
         * @param  {Number}  author_id  案例 id
         */
    getAllCase(author_id) {
      return $getAllMarketCases({ author_id })
        .then(re => {
          if (re.code === 1) {
            this.caseListData = toOptions(
              re
              , {
                'valKey': 'case_id',
                'textKey': 'case_name'
              }
            )
          }
        })
    },
    /**
         * 选择案例响应函数
         * @param  {Number}  val  案例 id
         */
    onAuthorChange(val) {
      this.getAllCase(val)
    },
    // 添加广告
    async addAuthor() {
      var { author_name } = this.addForm
      if (author_name) {
        var data = {
          author_name
        }
        this.authorLoading = true
        await this.addNew(data)
        this.addForm.author_name = ''
        this.authorLoading = false
      } else {
        this.$tip('请输入广告名', 'error')
      }
    },
    // 添加活动
    async addCase() {
      var { author, case_name } = this.addForm
      if (!author) {
        this.$tip('请选择广告', 'error')
        return
      }
      if (!case_name) {
        this.$tip('请输入活动名', 'error')
        return
      }
      var data = {
        'author_name': author.text,
        case_name
      }
      this.caseLoading = true
      await this.addNew(data)
      this.addForm.author = ''
      this.addForm.case_name = ''
      this.caseLoading = false
    },
    /**
         * 添加案例
         * @param  {Object}  data  请求数据
         */
    addNew(data) {
      return $addAdvAuthor(data)
        .then(re => {
          if (re) {
            this.$message(re.msg)
            this.getAllAuther()
          }
        })
    }
  }
}
</script>
