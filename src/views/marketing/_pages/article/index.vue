<template>
  <Wrap>
    <Search
      ref="search"
      :config="formConf"
      @submit="onSubmit"
    >
      <template v-slot:prv="target">
        <el-form-item label="时间范围">
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
    <el-table
      v-scrollbar
      v-loading="loading"
      style="width: 100%"
      :data="tableData"
    >
      <el-table-column
        prop="prop"
        label="文章信息"
        align="left"
      >
        <template slot-scope="{row}">
          <VideoInfo
            :options="{
              coverImg: 'image',
              addTime: 'pushedTime'
            }"
            :info="row"
            @urlClick="handleArticleClick"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="公众号"
      />
      <el-table-column
        prop="linkHits"
        label="链接点击数"
      />
      <el-table-column
        prop="trampledCount"
        label="被踩"
      >
        <template slot="header">
          <IconTip label="被踩" icon-class="iconwenhao" content="文章在乾数据首页显示时被踩的数量" />
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="searchData.size"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { Search, IconTip, VideoInfo } from 'components'
import { $getArticless, $updateArticless } from '@/api/home'
import { $getOfficialAccount } from '@/api/marketing'
import { copy } from '@/components/common'
export default defineComponent({
  components: {
    VideoInfo,
    Search,
    IconTip
  },
  setup() {
    const useSearch = () => {
      const { $permission } = getCurrentInstance().proxy
      const formConf = ref({})
      const searchData = ref({
        pageNum: 1,
        size: 15
      })
      const normalFormItemMap = {}
      const buildFormConf = () => {
        let normal = [
          {
            type: 'select',
            key: 'name',
            data: [],
            conf: {
              placeholder: '请选择公众号'
            },
            optionValKey: 'name',
            optionLabelKey: 'name'
          },
          {
            type: 'input',
            key: 'title',
            conf: {
              placeholder: '请输入关键词'
            }
          }
        ]

        normal = normal.filter((item, index) => {
          if (item.permissionName && !$permission(item.permissionName)) {
            return false
          }
          item.index = index
          normalFormItemMap[item.key] = item
          return true
        })
        formConf.value = {
          normal,
          hasExport: false
        }
      }
      buildFormConf()
      const onSubmit = (data) => {
        const params = copy(data)
        if (params.timerange) {
          params.dateStart = params.timerange[0] + ' 00:00:00'
          params.dateEnd = params.timerange[1] + ' 23:59:59'
          delete params.timerange
        }
        searchData.value = { ...searchData.value, ...params }
        getList()
      }
      const getOfficialAccount = () => {
        $getOfficialAccount().then(res => {
          if (res.code === 1) {
            normalFormItemMap.name.data = res.data || []
          }
        })
      }
      getOfficialAccount()
      return {
        formConf,
        onSubmit,
        searchData
      }
    }
    const { formConf, onSubmit, searchData } = useSearch()
    const loading = ref(false)
    const tableData = ref([])
    const total = ref(0)
    const getList = () => {
      loading.value = true
      $getArticless(searchData.value).then(res => {
        if (res.code === 1) {
          tableData.value = res.data
          total.value = res.total
        }
        loading.value = false
      })
    }
    getList()
    const handleArticleClick = (item) => {
      $updateArticless({
        id: item.id,
        type: 1
      })
    }

    return {
      loading,
      total,
      formConf,
      onSubmit,
      getList,
      tableData,
      searchData,
      handleArticleClick
    }
  }
})
</script>
