<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
  >
    <template v-slot:normal="target">
      <el-form-item label="视频发布时间" prop="timerange">
        <el-date-picker
          v-model="target.model.timerange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
    </template>
  </Search>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { $getLibraryCondition } from '@/api/bussiness-manage'
import { Search } from 'components'

export default defineComponent({
  components: { Search },
  setup(props, { emit }) {
    const formConf = ref({})
        // 构建搜索表单项映射

    const normalFormItemMap = {}

    const buildFormConf = () => {
      const normal = [
        {
          type: 'select',
          key: 'brandName',
          data: [],
          optionLabelKey: 'newsContent',
          optionValKey: 'newsContent',
          conf: {
            placeholder: '品牌'
          }
        },
        {
          type: 'select',
          key: 'quotientName',
          data: [],
          optionLabelKey: 'producationName',
          optionValKey: 'producationName',
          conf: {
            placeholder: '合作产品'
          }
        },
        {
          type: 'input',
          key: 'titleName',
          conf: {
            placeholder: '请输入标题'
          }
        }
      ]
      formConf.value = {
        normal: normal,
        hasExport: false
      }
      formConf.value.normal.forEach(function(item, index) {
        item.index = index
        if (Array.isArray(item.data) && item.data.length === 0 || !item.data) {
          normalFormItemMap[item._key || item.key] = item
        }
      })
    }
    buildFormConf()

    const loadBaseSearchData = async() => {
        try {
          const res = await $getLibraryCondition()
          if (res.code === 1) {
          normalFormItemMap.quotientName.data = res.data.quotientNames
           normalFormItemMap.brandName.data = res.data.brandList
          }
        } catch (err) {
          if (err.__CANCEL__) {
            return
          }
        }
    }

    loadBaseSearchData()

    const onSubmit = (data) => {
      emit('onSubmit', data)
    }

    return {
      formConf,
      onSubmit
    }
  }
})
</script>

