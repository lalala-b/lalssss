<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    @close="handleClose"
  >
    <div>
      <el-form ref="form" :model="formData" label-width="120px" :rules="rules" label-suffix=":">
        <el-form-item label="内容模块" :required="true">
          <div class="flex flex-align-center">
            <el-select
              v-model="formData.firstCate"
              :disabled="isEdit"
              class="P-contentsDialogFormSelect"
              placeholder="请选择"
              @change="handleCateChange"
            >
              <el-option
                v-for="(val, key) in FIRST_CATE"
                :key="key"
                :label="val"
                :value="Number(key)"
              />
            </el-select>
            <p v-if="bannerDisabled && formData.firstCate === 6" class="tip-red m-l-10">banner数量已达到上限，请删除后再新增。</p>
          </div>
        </el-form-item>
        <el-form-item v-if="checkModalShow.gotoFlag" prop="gotoFlag" label="跳转链接">
          <el-select v-model="formData.gotoFlag" placeholder="" @change="clearValidate">
            <el-option
              label="跳转至外部链接"
              :value="0"
            />
            <el-option
              label="跳转至内部页面"
              :value="1"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkModalShow.innerPage" prop="innerPage" label="页面选择">
          <el-select v-model="formData.innerPage" placeholder="">
            <el-option
              v-for="item in internaleList"
              :key="item.dictType"
              :label="item.dictLabel"
              :value="item.dictLabel"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="checkModalShow.secondCate" prop="secondCate" label="类别">
          <el-select
            v-model="formData.secondCate"
            class="P-contentsDialogFormSelect"
            placeholder="请选择"
          >
            <el-option
              v-for="(val, key) in SECOND_CATE"
              :key="key"
              :label="val"
              :value="Number(key)"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="checkModalShow.url"
          label="URL链接"
          prop="url"
        >
          <el-input v-model="formData.url" />
        </el-form-item>
        <el-form-item
          v-if="checkModalShow.title"
          label="标题"
          prop="title"
        >
          <el-input v-model="formData.title" maxlength="30" show-word-limit>
            <!-- <template v-if="hasPreTitle && preTitle" slot="prepend">【{{ preTitle }}】</template> -->
          </el-input>
        </el-form-item>
        <el-form-item
          v-if="checkModalShow.content"
          label="详细内容"
          prop="content"
        >
          <el-input
            v-model="formData.content"
            rows="5"
            resize="none"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item
          v-if="checkModalShow.sortNum"
          label="banner排序"
          prop="sortNum"
        >
          <el-select v-model="formData.sortNum" placeholder="">
            <el-option
              v-for="item in 4"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="checkModalShow.image"
          :label="imageLabel"
          prop="image"
        >
          <UploadImg v-model="formData.image" />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="P-contentsDialogFooter">
      <el-button @click="handleClose">取消</el-button>
      <el-button :disabled="bannerDisabled && formData.firstCate === 6" type="primary" :loading="btnLoading" @click="handleSave">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, reactive, ref, watch } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { UploadImg } from 'components'
import { FIRST_CATE, SECOND_CATE } from '../const'
import { isArray } from 'axios/lib/utils'
import { $updateContentArticle, $getBannerLimit, $createContentArticle } from '@/api/backend-manage'
import { $getDataByDictType } from '@/api'
import { copy } from '@/components/common'
import { validURL } from '@/utils/validate'

export default defineComponent({
  components: { UploadImg },
  props: {
    value: Boolean,
    isEdit: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { $message, $refs, $nextTick } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const title = computed(() => {
      return props.isEdit ? '编辑内容' : '新增内容'
    })

    const formData = reactive(Object.assign({
      firstCate: '',
      gotoFlag: '',
      secondCate: '',
      url: '',
      title: '',
      content: '',
      image: [],
      innerPage: ''
    }, props.data))
    if (!isArray(formData.image)) {
      formData.image = formData.image ? [formData.image] : []
    }
    const checkUrl = (rule, value, callback) => {
      if (validURL(value)) {
        return callback()
      } else {
        return callback(new Error(rule.message))
      }
    }

    const checkImg = (rule, value, callback) => {
      if (!value) {
         return callback(new Error(rule.message))
      }
      if (isArray(value) && value.length === 0) {
        return callback(new Error(rule.message))
      }
      return callback()
    }
    const rules = {
      firstCate: { required: true, message: '请选择内容模块', trigger: 'change' },
      gotoFlag: { required: true, message: '请选择内容模块', trigger: 'change' },
      secondCate: { required: true, message: '请选择类别', trigger: 'change' },
      url: { required: true, validator: checkUrl, message: '请输入正确的url', trigger: 'blur' },
      title: { required: true, message: '请输入标题', trigger: 'blur' },
      content: { required: true, message: '请输入详细内容', trigger: 'blur' },
      image: { required: true, validator: checkImg, message: '请上传图片', trigger: 'change' },
      sortNum: { required: true, message: '请选择banner排序', trigger: 'change' },
      innerPage: { required: true, message: '请选择页面', trigger: 'change' }
    }
    const btnLoading = ref(false)

    const checkModalShow = computed(() => {
      return {
        gotoFlag: formData.firstCate === 6, // 跳转链接
        innerPage: formData.firstCate === 6 && formData.gotoFlag === 1,
        secondCate: formData.firstCate === 1, // 类别
        url: ![3, 5].includes(formData.firstCate) && !(formData.firstCate === 6 && formData.gotoFlag === 1), // url链接
        title: true, // 标题
        content: [3, 5].includes(formData.firstCate), // 详细内容
        firstCate: formData.firstCate === 1, // 封面图片
        sortNum: formData.firstCate === 6, // banner排序
        image: [2, 6].includes(formData.firstCate)
      }
    })
    const handleSave = async() => {
      const params = copy(formData)
      params.image = params.image.join(',')
      if (params.innerPage && params.firstCate === 6 && params.gotoFlag === 1) {
        params.url = internaleList.value.find(item => item.dictLabel === params.innerPage).dictValue
      }
      await $refs.form.validate()
      if (props.isEdit) {
        handleEdit(params)
      } else {
        handleAdd(params)
      }
    }
    const handleEdit = (params) => {
      btnLoading.value = true
      $updateContentArticle(params).then(res => {
        if (res.code === 1) {
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
        btnLoading.value = false
      })
    }

    const handleCateChange = () => {
      formData.gotoFlag = ''
      formData.secondCate = ''
      formData.url = ''
      formData.title = ''
      formData.content = ''
      formData.image = []
      clearValidate()
    }

    const clearValidate = () => {
      $nextTick(() => {
        $refs.form.clearValidate()
      })
    }

    const internaleList = ref([])
    const getInternalList = () => {
      $getDataByDictType({
        dictTypes: ['internal_pages']
      }).then(res => {
        internaleList.value = res.data.internal_pages
      })
    }

    getInternalList()

    const handleAdd = (params) => {
      btnLoading.value = true
      $createContentArticle(params).then(res => {
        if (res.code === 1) {
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
        btnLoading.value = false
      })
    }

    const isLimitBanner = ref(false)
    $getBannerLimit().then(res => {
      isLimitBanner.value = res.data.limitCount <= res.data.bannerCount
      console.log(isLimitBanner.value)
    })

    const bannerDisabled = computed(() => {
      if (props.isEdit) {
        return isLimitBanner.value && props.data.firstCate !== 6
      }
      return isLimitBanner.value
    })
    const imageLabel = computed(() => {
          switch (formData.firstCate) {
          case 2:
            return '图片'
          case 6:
            return 'banner图片'
      }
    })
    return {
      SECOND_CATE,
      FIRST_CATE,
      title,
      show,
      handleClose,
      formData,
      rules,
      internaleList,
      btnLoading,
      handleSave,
      checkModalShow,
      handleCateChange,
      bannerDisabled,
      clearValidate,
      imageLabel
    }
  }
})
</script>

