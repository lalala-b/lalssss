<template>
  <el-dialog
    :visible="show"
    title="添加账号标签"
    append-to-body
    width="800px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="addForm"
      :rules="formRules"
      :model="formData"
      label-width="140px"
      class="norm-form"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="type === 'other'" label="请选择账号标平台" prop="plat">
            <el-select
              v-model="formData.plat"
              class="platSelect"
              placeholder="请选择平台"
            >
              <el-option
                v-for="item in plats"
                :key="item.platId"
                :label="item.platName"
                :value="item.platId"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-else label="平台" prop="plat">
            {{ type === 'douyin' ? '抖音' : type === 'kuaishou' ? '快手' : type === 'bilibili' ? 'B站' : type === 'xiaohongshu' ? '小红书' : '' }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="请选择账号标签" prop="tagName">
            <el-checkbox-group v-model="formData.tagName">
              <el-checkbox
                v-for="item in accountTagList"
                :key="item.md5Id"
                :value="item.md5Id"
                :true-label="`true,${item.md5Id},${item.tagName}`"
                :false-label="`false,${item.md5Id},${item.tagName}`"
                :label="`${item.tagName.slice(0,2)}标签`"
                @change="handleChangeShield"
              />
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="请选择标签有效期" prop="date">
            <el-select
              v-model="formData.deadline"
              class="platSelect"
              placeholder="请选择标签有效期"
            >
              <el-option
                v-for="item in tagValidityList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="description">请输入<span class="alt">账号名称</span>，一行一个，最多200个</div>

    <el-input
      v-model="accounts"
      :placeholder="type === 'other' ? '请选择平台后再输入账号名称' : '输入账号名称' "
      :disabled="!formData.plat"
      type="textarea"
      :rows="10"
    />
    <span v-show="showError" class="error">请输入账号信息！</span>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, computed, watch } from '@vue/composition-api'
import { IconTip } from 'components'
import { $addAccountFeature } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    platList: {
      type: Array,
      default: () => []
    },
    accountTagList: {
      type: Array,
      default: () => []
    },
    tagValidityList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $confirm, $router, $refs, $nextTick } = getCurrentInstance().proxy

    const showDialog = computed(() => props.show)

    const plats = computed(() => props.platList)

    const state = reactive({
      listLoading: true, //
      btnLoading: false,
      accounts: '',
      showError: false,
      selectTag: [],
      formRules: {
        plat: [{ required: true, message: '请选择平台', trigger: ['blur', 'change'] }],
        tagName: [{ required: true, message: '请选择账号标签', trigger: ['blur', 'change'] }],
        deadline: [{ required: true, message: '请选择标签有效期', trigger: ['blur', 'change'] }]
      }
    })

    const formData = reactive({
      tagName: '',
      md5Id: '',
      deadline: ''
    })

    watch(showDialog, (val) => {
      if (val) {
        $refs.addForm && $refs.addForm.resetFields()
        // state.plat = ''
        if (props.type === 'douyin') {
          formData.plat = 25
        } else if (props.type === 'kuaishou') {
          formData.plat = 26
        } else if (props.type === 'bilibili') {
          formData.plat = 2
        } else if (props.type === 'xiaohongshu') {
          formData.plat = 45
        } else if (props.type === 'other') {
          formData.plat = ''
        }
        state.accounts = ''
        state.showError = false
        // state.listLoading = false
      }
    })

    watch(plats, (val) => {
      if (val.length) {
        // state.listLoading = false
      }
    })

    // watch(() => state.plat, () => {
    //   // state.accounts = ''
    // })

    watch(() => state.accounts, (val) => {
      const accountArr = encodeURIComponent(val).split('%0A').map(item => decodeURIComponent(item).replace(/^\s*|\s*$/g, '')).filter(item => item)
      if (accountArr.length) {
        state.showError = false
        return
      }
    })

    const handleChangeShield = (val) => {
      const status = val.split(',')[0]
      const md5Id = val.split(',')[1]
      const tagName = val.split(',')[2]
      if (status === 'true') {
        const obj = {}
        obj['tagName'] = tagName
        obj['md5Id'] = md5Id
        state.selectTag.push(obj)
      } else {
        state.selectTag = state.selectTag.filter((item, index, array) => {
          return item['md5Id'] !== md5Id
        })
      }
      // console.log(state.selectTag, 'selectTag')
    }

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      const accountArr = encodeURIComponent(state.accounts).split('%0A').map(item => decodeURIComponent(item).replace(/^\s*|\s*$/g, '')).filter(item => item)
      try {
        await $refs.addForm.validate()
      } catch (e) {
        if (!accountArr.length) {
          state.showError = true
        }
        return
      }

      if (!accountArr.length) {
        state.showError = true
        return
      }

      state.btnLoading = true

      state.showError = false

      if (accountArr.length > 200) {
        $message.error('账号最多200个')
        return
      }

      const params = {
        accountNameList: accountArr,
        // hotPushDeadline: formData.date,
        accountFeatureBOList: [],
        platId: formData.plat
      }

      state.selectTag.forEach(item => {
        const obj = {}
        obj['md5Id'] = item.md5Id
        obj['tagName'] = item.tagName
        obj['deadline'] = formData.deadline
        params.accountFeatureBOList.push(obj)
      })

      // console.log(params, 'params')

      // props.accountTagList.forEach(item => {
      //   params[item.dictValue] = formData.tag.indexOf(`${item.dictLabel}标签`) > -1 ? 1 : 0
      // })

      try {
        const { code, data, message } = await $addAccountFeature(params)
        if (+code === 1) {
          emit('confirm', data)
        } else {
          $message.error(message)
        }
        state.btnLoading = false
      } catch (e) {
        $message.error(e || '网络错误')
        state.btnLoading = false
      }
    }

    return {
      ...toRefs(state),
      formData,
      handleClose,
      handleConfirm,
      handleChangeShield,
      plats
    }
  }
})
</script>

<style lang="scss" scoped>
// .platSelect {
//   width: 100%;
// }

.description {
  margin: 16px 0;
}

.alt {
  color: #2c64ff;
}

.error {
  color: #ff0000;
  font-size: 10px;
}
</style>
