<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      >
        <template v-slot:prv="target">
          <el-cascader
            ref="cascader1"
            v-model="target.model.seoKeyWordId"
            class="cascader m-r-24 m-b-24"
            placeholder="请选择SEO关键词"
            :options="seoKeyWordList"
            :props="{
              checkStrictly: false,
              value: 'id',
              label: 'seo_word',
              children: 'keyWords',
              multiple: true,
            }"
            collapse-tags
            clearable
            @change="handleChangeCascader"
          />
        </template>
        <template v-slot:normal="target">
          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="target.model.addTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="数据更新时间">
            <el-date-picker
              v-model="target.model.spiderTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
        </template>
        <template v-slot:btns>
          <el-checkbox v-model="toMarkFlag" class="m-l-16" @change="handleChangeToMarkFlag">待打标视频</el-checkbox>
        </template>
      </Search>
    </wrap>

    <wrap class="m-t-24">
      <VTable
        ref="table"
        :opinion-data="opinionData"
        :search-data="searchData"
      />
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components'
import {
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
} from '@vue/composition-api'
import { $getHdSeoKeyWordTypes, $getAccountList } from '@/api/seo'
import { $getDataByDictType } from '@/api'
import Table from './table'

import { copy } from '@/utils'
import qs from 'qs'

export default {
  components: {
    VTable: Table,
    Search
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: true
    })

    const states = reactive({
      seoKeyWordList: [],
      opinionData: [],
      toMarkFlag: false
    })

    const searchData = ref({})

    $nextTick(() => {
      $set($refs.search.form, 'videoTypes', ['4'])
      searchData.value.videoTypes = ['4']
      handleGetList()
    })

    const handleGetList = () => {
      if ($refs.cascader1) {
        searchData.value.seoKeyWordId = $refs.cascader1
          .getCheckedNodes()
          .filter((item) => !item.hasChildren)
          .map((item) => {
            return item.data.id
          })
      }

      if (searchData.value.accountName === '暂无账号') {
        searchData.value.accountId = -1
        delete searchData.value.accountName
      }

      $nextTick(() => {
        $refs.table.getList()
      })
    }

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'opinion',
          data: [],
          conf: { placeholder: '请选择舆论倾向' },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'videoTypes',
          data: [],
          conf: { placeholder: '请选择视频类型', multiple: true },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue',
          conf: {
            placeholder: '请选择平台'
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '请选择账号',
            allowCreate: true,
            defaultFirst: true,
            isAccountName: true
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        if (item.permissionName && !$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }

    const formatData = (data) => {
      const params = copy(data)
      if (params.addTime) {
        params.addTimeStart = params.addTime[0] + ' 00:00:00'
        params.addTimeEnd = params.addTime[1] + ' 23:59:59'
      } else {
        params.addTimeStart = ''
        params.addTimeEnd = ''
      }
      delete params.addTime

      if (params.spiderTime) {
        params.spiderTimeStart = params.spiderTime[0] + ' 00:00:00'
        params.spiderTimeEnd = params.spiderTime[1] + ' 23:59:59'
      } else {
        params.spiderTimeStart = ''
        params.spiderTimeEnd = ''
      }
      delete params.spiderTime

      return params
    }

    const getHdSeoKeyWordTypes = async() => {
      const res = await $getHdSeoKeyWordTypes()
      states.seoKeyWordList = res.data
    }

    const getDataByDictType = async() => {
      const res = await $getDataByDictType({
        dictTypes: ['seo_plat_list', 'seo_opinion_list', 'seo_video_type_list']
      })

      normalFormItemMap.opinion.data = res.data['seo_opinion_list']
      states.opinionData = res.data['seo_opinion_list']
      normalFormItemMap.videoTypes.data = res.data['seo_video_type_list']
      normalFormItemMap.platId.data = res.data['seo_plat_list']
    }

    const getAccountList = async(val) => {
      const res = await $getAccountList({
        platId: val
      })
      if (res.code === 1) {
        normalFormItemMap.accountId.data = res.data || []
      }
    }

    const handleChangeCascader = (val) => {
      if (val.length <= 1) {
        val.push('')
        $set($refs.search.form, 'seoKeyWordId', val)
        searchData.value = {
          ...searchData.value,
          seoKeyWordId: val
        }
      }
    }

    const handleChangeToMarkFlag = (val) => {
      // 勾选后，清空所有筛选项，自动填入以下筛选条件：
      // 关键词类型：业务词、品牌词
      // 舆论倾向：（空）
      // 视频类型：外部视频
      if (val) {
        $set($refs.search.form, 'opinion', '-2')
        $set($refs.search.form, 'videoTypes', ['4'])

        const selectSeoKeyWord = []

        states.seoKeyWordList.forEach(item => {
          if (item.id === 1 || item.id === 2) {
            item.keyWords.forEach(word => {
              selectSeoKeyWord.push([item.id, word.id])
            })
          }
        })
        $set($refs.search.form, 'seoKeyWordId', selectSeoKeyWord)
        searchData.value.pageNum = 1

        searchData.value = {
          ...searchData.value,
          opinion: '-2',
          videoTypes: ['4'],
          seoKeyWordId: selectSeoKeyWord
        }
      } else {
        $set($refs.search.form, 'opinion', '')
        $set($refs.search.form, 'videoTypes', [])
        $set($refs.search.form, 'seoKeyWordId', [])
        searchData.value.pageNum = 1

        searchData.value = {
          ...searchData.value,
          opinion: '',
          videoTypes: [],
          seoKeyWordId: []
        }
      }

      $nextTick(() => {
        handleGetList()
      })
    }

    const onChange = (val, item, type, index, model) => {
      // 是这三个 ，取消打标视频选中
      if (['opinion', 'videoTypes', 'seoKeyWordId'].indexOf(item.key) > -1) {
        states.toMarkFlag = false
      }

      switch (item.key) {
        case 'platId':
          model.accountId = ''
          normalFormItemMap.accountId.data = []
          getAccountList(val)
          break
      }
    }

    const onSubmit = (data) => {
      const params = formatData(data)
      searchData.value.pageNum = 1
      Object.assign(searchData.value, params)
      handleGetList()
    }

    const onExport = (data) => {
      const params = formatData(Object.assign({}, searchData.value, data))

      if ($refs.cascader1) {
        params.seoKeyWordId = $refs.cascader1
          .getCheckedNodes()
          .filter((item) => !item.hasChildren)
          .map((item) => {
            return item.data.id
          })
      }

      if (params.accountName === '暂无账号') {
        params.accountId = -1
        delete params.accountName
      }

      window.open(
        `/api/hd/seo/list?${qs.stringify({
          ...params,
          isExport: 1
        })}`
      )
    }

    buildFormConf()
    getDataByDictType()
    getHdSeoKeyWordTypes()
    getAccountList()
    return {
      searchData,
      formConf,
      onSubmit,
      onChange,
      ...toRefs(states),
      handleChangeCascader,
      handleChangeToMarkFlag,
      onExport
    }
  }
}
</script>
