<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
    @change="onSearchChange"
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
import { $getFundUser } from '@/api/putting-manager'
import { $getDataByDictType } from '@/api'
import { Search } from 'components'
import { unique } from '@/utils'

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
          key: 'videoTag',
          // ,"value": ""
          data: [
            { val: '转转', text: '转转' },
            { val: '找靓机', text: '找靓机' }
          ],
          conf: {
            placeholder: '品牌标签'
          }
        },
        {
          type: 'select',
          key: 'businessTag',
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue',
          data: [],
          conf: {
            placeholder: '业务标签'
          }
        },

        {
          type: 'input',
          key: 'orderCommand',
          data: [],
          conf: {
            placeholder: '请输入口令'
          }
        },

        {
          type: 'input',
          key: 'androidDeliveryName',
          data: '',
          conf: {
            placeholder: '组件渠道号'
          }
        },
        {
          type: 'input',
          key: 'titleName',
          data: '',
          conf: {
            placeholder: '请输入标题'
          }
        },

        {
          type: 'select',
          key: 'advertiserUserId',
          data: [],
          conf: {
            placeholder: '请选择广告师'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'deliveryId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '投放专员'
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

    const getBusinessTags = () => {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then(res => {
        if (res.code === 1) {
          normalFormItemMap._businessTags = res.data
          normalFormItemMap.businessTag.data = unique([...res.data.zz_putting_business_tag, ...res.data.zlj_putting_business_tag], 'dictValue')
        }
      })
    }

    const getFundUser = () => {
      $getFundUser().then(res => {
        if (res.code === 1) {
          normalFormItemMap.advertiserUserId.data = res.data
          normalFormItemMap.deliveryId.data = res.data
        }
      })
    }

    const loadBaseSearchData = async() => {
      buildFormConf()
      getBusinessTags()
      getFundUser()
    }

    loadBaseSearchData()

    const onSearchChange = (val, item, type, index, model) => {
      if (item.key === 'videoTag') {
        model.businessTag = ''
        if (!val) {
          normalFormItemMap.businessTag.data = unique([...normalFormItemMap._businessTags.zz_putting_business_tag, ...normalFormItemMap._businessTags.zlj_putting_business_tag], 'dictValue')
          return
        }
        if (val === '找靓机') {
          normalFormItemMap.businessTag.data = normalFormItemMap._businessTags.zlj_putting_business_tag
        } else {
          normalFormItemMap.businessTag.data = normalFormItemMap._businessTags.zz_putting_business_tag
        }
      }
    }

    const onSubmit = (data) => {
      emit('onSubmit', data)
    }

    return {
      onSearchChange,
      formConf,
      onSubmit
    }
  }
})
</script>

