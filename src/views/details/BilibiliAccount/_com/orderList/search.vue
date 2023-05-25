<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
  >
    <template v-slot:btns="target">
      <el-checkbox v-model="target.model.shield" class="m-l-10" true-label="1" false-label="0">屏蔽找靓机工单</el-checkbox>
    </template>
  </Search>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import { $getQueryCondition } from '@/api/bussiness-manage'
import { Search } from 'components'

export default defineComponent({
  components: { Search },
  setup(props, { emit }) {
    const formConf = ref({})
        // 构建搜索表单项映射

    const productSearch = (queryString, cb) => {
      const productList = normalFormItemMap.quotientName?.data?.map(item => {
          item.value = item.text = item.producationName
          return item
        }) || []
      const list = queryString
        ? productList.filter(item => item.text.includes(queryString))
        : productList
      cb(list)
    }
    const normalFormItemMap = {}

    const buildFormConf = () => {
      const normal = [
        {
          type: 'select',
          key: 'brandId',
          _key: 'brandTags',
          data: [],
          conf: {
            placeholder: '请选择品牌'
          },
          optionValKey: 'id',
          optionLabelKey: 'newsContent'
        },
        {
          type: 'autocomplete',
          key: 'production',
          _key: 'quotientName',
          conf: {
            placeholder: '请输入合作产品',
            fetchSuggestions: productSearch
          },
          optionValKey: 'producationName',
          optionLabelKey: 'producationName'
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

    const loadBaseSearchData = () => {
      $getQueryCondition().then((res) => {
        if (res.code === 1) {
          for (const key in res.data) {
            if (normalFormItemMap[key]) {
              normalFormItemMap[key].data = res.data[key]
            }
          }
        }
      })
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

