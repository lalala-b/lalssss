<template>
  <el-dialog
    class="mail-dialog"
    title="合同信息"
    width="580px"
    :append-to-body="true"
    :visible="value"
    @close="close"
  >
    <div v-loading="loading" class="content">
      <div class="flex flex-justify-center m-b-24">
        <template v-if="isEditConcat">
          <el-upload
            v-if="!formData.contractUrl"
            class="upload-demo"
            :before-upload="onImportReady"
            :on-success="uploadFileSuccess"
            :on-preview="filePreview"
            :on-remove="fileRemove"
            :file-list="uploadFileList"
            drag
            action="/api/business/order/uploadContractHaiDao"
            multiple
            :limit="1"
            accept=".pdf,.docx,.doc"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
              将合同文件拖到此处，或点击上传<em>点击上传</em>
            </div>
            <div slot="tip" class="el-upload__tip">
              文件格式仅限于word、pdf，文件内存不超过30M
            </div>
          </el-upload>
          <div v-else class="contract">
            <a class="m-r-10" :href="httpAddS(formData.contractUrl)" target="_blank" underline="false">{{
              formData.contractName
            }}</a>
            <i
              v-if="formData.contractUrl"
              class="el-icon-delete"
              @click="handleRemoveContract"
            />
          </div>
        </template>
        <template v-else>
          <div class="contract">
            <a :href="httpAddS(formData.contractUrl)" target="_blank" underline="false">{{
              formData.contractName
            }}</a>
          </div>
        </template>
      </div>
      <el-form :model="formData" label-width="124px">
        <el-form-item label="合同寄出快递单号">
          <el-input
            v-model="formData.outCourierNumber"
            maxlength="30"
            :disabled="!isEditConcat"
            @input="
              formData.outCourierNumber = arguments[0].replace(
                /[^0-9A-Za-z]/g,
                ''
              )
            "
          />
        </el-form-item>
        <el-form-item
          v-if="$permission('courier_number')"
          label="合同回寄快递单号"
        >
          <el-input
            v-model="formData.backCourierNumber"
            maxlength="30"
            :disabled="!isEditConcat"
            @input="
              formData.backCourierNumber = arguments[0].replace(
                /[^0-9A-Za-z]/g,
                ''
              )
            "
          />
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        v-if="isEditConcat"
        :loading="btnLoading"
        type="primary"
        @click="save"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getContractInfo, $updateContractInfo } from '@/api/bussiness-manage'
export default defineComponent({
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    pageType: {
      type: String,
      default: ''
    },
    isEditConcat: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      formData: {
        outCourierNumber: '',
        backCourierNumber: '',
        contractUrl: '',
        contractName: ''
      },
      loading: false,
      btnLoading: false,
      uploadFileList: []
    })
    watch(
      () => props.data,
      (val) => {
        if (val && Object.keys(val).length) {
          states.formData = {
            outCourierNumber: val.outCourierNumber,
            backCourierNumber: val.backCourierNumber,
            contractUrl: val.contractUrl,
            contractName: val.contractName
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )

    const httpAddS = (url) => {
      if (url && url.includes('https://')) {
        return url
      }
      if (url && url.includes('http://')) {
        const urlArr = url.split('http://')
        url = 'https://' + urlArr[1]
        return url
      }
      return url
    }
    const getContractInfo = async() => {
      states.loading = true
      const res = await $getContractInfo({ orderId: props.data.orderId })
      states.loading = false
      if (res.code === 1) {
        states.formData = res.data
      }
    }
    const save = () => {
      const params = {
        ...states.formData,
        contractName: states.uploadFileList.length
          ? states.uploadFileList[0].name
          : states.formData.contractName,
        contractUrl: states.uploadFileList.length
          ? states.uploadFileList[0].url
          : states.formData.contractUrl
      }
      if (props.pageType === 'detail' && props.isEditConcat) {
        states.btnLoading = true
        saveConcat({ ...params, orderId: props.data.orderId })
      } else {
        emit('save', params)
        handleClose()
      }
    }
    const saveConcat = async(params) => {
      const res = await $updateContractInfo(params)
      states.btnLoading = false
      if (res.code === 1) {
        $message.success('编辑成功')
        emit('onOrderDetail')
      } else {
        $message.error(res.message || '系统错误')
      }
      close()
    }
    const onImportReady = (file) => {
      if (file.size / 1000 / 1000 > 30) {
        $message.warning('视频大小不能大于30MB')
        return false
      }
    }
    const uploadFileSuccess = (res) => {
      const file = {
        name: res.data.name,
        url: res.data.url
      }
      states.uploadFileList.push(file)
    }
    // 文件预览
    const filePreview = (file) => {
      window.open(file.url)
    }
    // 删除上传文件
    const fileRemove = (file) => {
      const list = states.uploadFileList
      // 文件预览
      if (!list.length) {
        return
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].url === file.url) {
          list.splice(i, 1)
          break
        }
      }
    }
    const handleRemoveContract = () => {
      states.formData.contractUrl = ''
      states.formData.contractName = ''
    }
    const close = () => {
      emit('onOrderDetail', 'cancel')
      handleClose()
    }
    if (props.pageType === 'detail') {
      getContractInfo()
    }

    return {
      ...toRefs(states),
      show,
      close,
      save,
      fileRemove,
      filePreview,
      uploadFileSuccess,
      handleRemoveContract,
      onImportReady,
      httpAddS
    }
  }
})
</script>
<style lang="scss" scoped>
.contract {
  display: flex;
  width: 100%;
  align-items: center;
  > a {
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 500px;
    color: #2c64ff;
  }
  > i {
    margin-right: 2px;
    vertical-align: middle;
    cursor: pointer;
    color: red;
  }
}
</style>
