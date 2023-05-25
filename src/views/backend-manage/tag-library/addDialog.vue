<template>
  <el-dialog
    :visible="show"
    title="新增标签"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading">
      <el-form ref="form" label-width="140px" :model="form" :rules="rules">

        <el-form-item label="所属平台：" prop="platId">
          <el-select v-model="form.platId" @change="() => handleChangeSelect('plat')">
            <el-option v-for="item in platInfo" :key="item.platId" :label="item.platName" :value="item.platId" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属层级：" prop="tagLevel">
          <el-select v-model="form.tagLevel" @change="handleChangeSelect">
            <el-option v-for="item in levelArr" :key="item.val" :value="item.val" :label="item.label" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签类型：" prop="tagType">
          <el-select v-model="form.tagType" @change="handleChangeSelect">
            <el-option v-for="item in tagTypeArr" :key="item.tagType" :label="item.tagTypeName" :value="item.tagType" />
          </el-select>
        </el-form-item>

        <el-form-item v-if="+form.tagLevel === 2 && form.platId && form.tagType !== '' && form.tagType !== null" label="所属一级标签" prop="parentMd5Id">
          <el-select v-model="form.parentMd5Id">
            <el-option v-for="item in firstLevelList" :key="item.md5Id" :label="item.tagName" :value="item.md5Id" />
          </el-select>
        </el-form-item>

        <el-form-item label="第三方标签ID：" prop="tagId">
          <el-input v-model="form.tagId" placeholder="请输入第三方标签ID" maxlength="10" />
        </el-form-item>

        <el-form-item label="标签名：" prop="tagName">
          <el-input v-model="form.tagName" placeholder="请输入标签名" maxlength="10" />
        </el-form-item>
      </el-form>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch, computed } from '@vue/composition-api'
import { $getTagDetail, $getFirstLevelTag, $addSysPlatTag, $getPlatTagTypeList } from '@/api/tag-library'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    platInfo: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const { $message, $refs } = getCurrentInstance().proxy

    const form = reactive({
      tagLevel: '',
      platId: '',
      tagId: '',
      tagType: '',
      parentMd5Id: '',
      tagName: ''
    })

    const state = reactive({
      reason: '',
      btnLoading: false,
      loading: false,
      tagTypeArr: [],
      levelArr: [{
        val: 1,
        label: '一级标签'
      }, {
        val: 2,
        label: '二级标签'
      }],
      firstLevelList: [],
      rules: {
        tagLevel: [{ required: true, message: '请选择所属层级', trigger: ['change'] }],
        platId: [{ required: true, message: '请选择所属平台', trigger: ['change'] }],
        tagType: [{ required: true, message: '请选择标签类型', trigger: ['change'] }],
        parentMd5Id: [{ required: true, message: '请选择一级标签', trigger: ['change'] }],
        tagName: [{ required: true, message: '请输入标签名', trigger: ['change', 'blur'] }],
        tagId: [{ required: true, message: '请输入第三方标签ID', trigger: ['change', 'blur'] }]
      }
    })

    watch(() => props.show, (val) => {
      if (!val) {
        $refs.form.resetFields()
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs.form.validate()
      state.btnLoading = true
      try {
        const { code, message } = await $addSysPlatTag({
        ...form,
        tagTypeName: (state.tagTypeArr.find(item => item.tagType === form.tagType) || {}).tagTypeName,
        tagPid: (state.firstLevelList.find(item => item.md5Id === form.parentMd5Id) || {}).tagId
      })
        if (+code === 1) {
          $message.success('添加成功')
          emit('confirm')
        } else {
          $message.error(message)
        }
        state.btnLoading = false
      } catch (e) {
        state.btnLoading = false
        $message.error(e)
      }
    }

    const handleGetFirstLevel = async() => {
      const { platId, tagType } = form

      state.loading = true

      try {
        const { code, data } = await $getFirstLevelTag({
          platId,
          tagType
        })
        if (+code === 1) {
          state.firstLevelList = data || []
        }

        state.loading = false
      } catch (e) {
        state.loading = false
        $message.error(e)
      }
    }

    const handleChangeSelect = async(type) => {
      if (type === 'plat') {
        getPlatTagTypeList()
      }

      if (+form.tagLevel === 2 && form.platId && form.tagType !== '' && form.tagType !== null) {
        form.parentMd5Id = ''
        handleGetFirstLevel()
      }
    }

    const getPlatTagTypeList = async() => {
      const res = await $getPlatTagTypeList({ platId: form.platId })
      state.tagTypeArr = res.data || []
    }

    return {
      form,
      ...toRefs(state),
      dayjs,
      handleClose,
      handleChangeSelect,
      handleConfirm,
      getPlatTagTypeList
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  textarea {
    height: 100px;
  }

  .el-dialog__wrapper {
    z-index: 2009;
  }

  // .el-form-item {
  //   display: flex;
  // }
}

</style>
