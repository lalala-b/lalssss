<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-05 13:43:16
 * @LastEditTime: 2020-12-30 17:19:45
 * @LastEditors: Linjie
-->
<template>
  <Wrap
    v-infinite-scroll="getMoreList"
    infinite-scroll-distance="500"
    :infinite-scroll-disabled="loading"
    class="accounts"
  >
    <div class="accounts-search">
      <div class="accounts-search__title m-b-24">
        <el-input
          v-model="searchData.wd"
          class="accounts-search__title-input"
          placeholder="请输入账号名称或者快手ID进行检索"
          @keydown.enter.native="handleSearchBtnClick"
        >
          <el-button slot="append" type="primay" @click="handleSearchBtnClick">搜索</el-button>
        </el-input>
        <!-- <el-button class="m-l-24">清空条件</el-button> -->
      </div>
      <div class="accounts-search__item ">
        <TagSelect
          v-for="(item, key) in tagsData"
          :key="key"
          v-model="searchData[item.valKey]"
          :label="item.text"
          :data="item.list"
          :model="item.model || 'arr-obj'"
          :label-key="item.labelName"
          :val-key="item.valName"
          :check="item.check"
          class="m-b-24"
          @change="handleSearch"
        >

          <el-tooltip v-if="item.tip" slot="left" effect="dark" :content="item.tip" placement="top">
            <span class="accounts-search__label" data-bold>{{ item.text }}
              <i class="iconfont iconwenhao" />
            </span>
          </el-tooltip>
          <span v-else slot="left" class="accounts-search__label" data-bold>{{ item.text }}</span>
          <template v-if="item.custom" slot="right">
            <el-tag
              v-if="!item._status"
              effect="dark"
              size="small"
              @click="item._status = true;"
            >自定义</el-tag>
            <div v-else class="flex">
              <el-input
                v-model="item._start"
                class="w-150"
                type="number"
                min="0"
                size="small"
                placeholder="开始值"
                autocomplete="off"
                @change="handleCustomChange(item)"
                @keydown.enter="handleCustomChange(item)"
              />w
              <span>-</span>
              <el-input
                v-model="item._end"
                class="w-150"
                type="number"
                min="0"
                size="small"
                placeholder="结束值"
                autocomplete="off"
                @change="handleCustomChange(item)"
                @keydown.enter="handleCustomChange(item)"
              />w
            </div>
          </template>
        </TagSelect>
        <div class="flex flex-align-center m-b-24">
          <span class="accounts-search__label" data-bold>指标筛选</span>
          <el-select v-model="searchData.expectCPM" class="m-r-10" :clearable="true" placeholder="请选择预期cpm" @change="handleSearch">
            <el-option v-for="item in cpmList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
          <el-select v-model="searchData.nealy7ThumbUpAvg" class="m-r-10" :clearable="true" placeholder="近7日集均点赞" @change="handleSearch">
            <el-option v-for="item in nealy7ThumbUpAvgList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
          <el-select v-model="searchData.nealy7dMedianThumbs" class="m-r-10" :clearable="true" placeholder="近7日点赞量中位数" @change="handleSearch">
            <el-option v-for="item in middleLikeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
        </div>
        <div class="flex flex-align-center m-b-24">
          <span class="accounts-search__label" data-bold>粉丝画像</span>
          <div class="flex flex-align-center">
            <el-select v-model="searchData.maxAgeLabel" class="m-r-10" :clearable="true" placeholder="年龄" @change="handleSearch">
              <el-option v-for="item in fansAgeRangeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
            </el-select>
          </div>
          <div class="flex flex-align-center">
            <el-cascader
              v-model="searchData.sixRange"
              class="m-r-10"
              :options="sixRange"
              clearable
              :props="{value: 'dictValue', label: 'dictLabel', emitPath: true, checkStrictly: true}"
              placeholder="性别分布"
              @change="handleSearch"
            />
          </div>
          <div class="flex flex-align-center">
            <el-select v-model="searchData.maxPhoneLabel" class="m-r-10" :clearable="true" placeholder="粉丝手机系统" @change="handleSearch">
              <el-option v-for="item in phoneSysRange" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
            </el-select>
          </div>
        </div>
        <div class="flex flex-align-center m-t-10">
          <span class="accounts-search__label" data-bold>高级筛选</span>
          <!-- <el-select v-model="searchData.ageRange" class="m-r-10" :clearable="true" filterable placeholder="达人年龄" @change="handleSearch">
            <el-option v-for="item in ageRangeList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select> -->
          <el-select
            v-model="searchData.sex"
            class="m-r-10"
            clearable
            placeholder="达人性别"
            @change="handleSearch"
          >
            <el-option value="男" label="男" />
            <el-option value="女" label="女" />
          </el-select>
          <el-cascader
            v-model="searchData.region"
            class="m-r-10"
            :options="provList"
            clearable
            :props="{value: 'areaName', label: 'areaName', lazy: true, lazyLoad: handleProvChange, emitPath: true, checkStrictly: true}"
            placeholder="达人所在地区"
            @change="handleSearch"
          />
          <el-select v-model="searchData.mcnName" class="m-r-10" filterable :clearable="true" placeholder="请输入MCN机构" @change="handleSearch">
            <el-option v-for="item in mcnList" :key="item" :value="item" :label="item" />
          </el-select>
          <!-- <el-checkbox v-model="searchData.mcnFlag" true-label="1" false-label="0" @change="handleSearch">已加入MCN机构 <i class="iconfont iconmcn" /></el-checkbox> -->
          <!-- <el-checkbox v-model="searchData.associatedAppletsFlag" true-label="1" false-label="0" @change="handleSearch">关联小程序 <svg-icon icon-class="link" /></el-checkbox>
          <el-checkbox v-model="searchData.associatedComponentsFlag" true-label="1" false-label="0" @change="handleSearch">关联视频组件 <svg-icon icon-class="ele" /></el-checkbox> -->
          <!-- <el-checkbox v-model="searchData.bindPhoneFlag" true-label="1" false-label="0" @change="handleSearch"><i class="el-icon-mobile-phone" /> 有联系方式</el-checkbox> -->
        </div>
      </div>
      <div class="flex flex-justify-between m-b-16 m-t-40">
        <div class="flex flex-align-center">
          <span class="accounts-search__label" data-bold>排序方式：</span>
          <el-button-group class="determind-wrap">
            <el-radio-group v-model="searchData.determined" @change="handleSearch">
              <el-radio-button v-for="(item, key) in determined" :key="key" :label="key">{{ item }}</el-radio-button>
            </el-radio-group>
          </el-button-group>
        </div>
        <p class="flex flex-align-center">共搜索到 <strong data-bold>{{ total }}</strong> 条数据</p>
      </div>
    </div>
    <div>
      <accountItem
        v-for="(item, index) in tableData"
        :key="item.eid"
        :info="item"
        :index="index"
        class="m-t-16"
        @update="upDateTableData(index)"
      />
      <Loading v-if="loading" />
      <div v-if="!loading && tableData.length === 0" class="no-data">暂无数据</div>
    </div>

    <BackToTop />
  </Wrap>
</template>
<script>
import { copy } from '@/components/common'
import BackToTop from '@/components/BackToTop'
import TagSelect from '@/components/TagSelect'
import accountItem from './accountItem'
import Loading from '@/components/Loading'
import { $getKsAccountList, $getKsMcnName } from '@/api/ks-manage'
import { $getDataByDictType } from '@/api/index'
import { $getAera } from '@/api/'
import { $getDictDataList } from '@/api/backend-manage'
import { isArray } from '@/utils'
import { lego } from '@zz-common/lego'
import { mapGetters } from 'vuex'
export default {
  components: {
    TagSelect,
    accountItem,
    Loading,
    BackToTop
  },
  data() {
    return {
      checkList: [],
      tagsData: {
        topics: {
          key: 'topics',
          text: '达人标签',
          valKey: 'accountTags',
          valName: 'dictValue',
          labelName: 'dictLabel',
          selecteIndex: 0,
          check: true,
          // model: 'array',
          list: []
        },
        industryCategoryTag: {
          key: 'industryCategoryTag',
          text: '适合行业',
          valKey: 'industryCategoryTag',
          valName: 'dictValue',
          labelName: 'dictLabel',
          selecteIndex: 0,
          list: [],
          tip: '数据来源为磁力聚星，通常每周更新一次，可能存在一定延迟偏差，仅供参考，最新数据以磁力聚星平台的为准。'
        },
        sixPrice: {
          key: 'sixPrice',
          text: '报价',
          valKey: 'sixPrice',
          valName: 'dictValue',
          labelName: 'dictLabel',
          selecteIndex: 0,
          list: [],
          custom: true,
          _status: false
        },
        fans: {
          key: 'fans',
          text: '粉丝数',
          valKey: 'fans',
          valName: 'dictValue',
          labelName: 'dictLabel',
          selecteIndex: 0,
          list: [],
          custom: true,
          _status: false
        }
    },
      searchData: {
        accountTags: '',
        wd: '',
        region: null,
        provinceName: '',
        cityName: '',
        mcnFlag: '',
        associatedAppletsFlag: '',
        associatedComponentsFlag: '',
        bindPhoneFlag: '',
        fans: '', // 粉丝范围 1000-100000
        tagId: '', // 标签ID
        determined: '-fansNum', // 排序
        accountName: '', // 账号名
        tagName: '', // 内容主题
        nealy7ThumbUpAvg: '',
        nealy7dMedianThumbs: '',
        ageRange: '',
        pageNum: 1
      },
      nealy7ThumbUpAvgList: [],
      middleLikeList: [],
      cpmList: [],
      total: 0,
      tableData: [],
      determined: {
        '': '默认',
        '-fansNum': '粉丝数',
        '-expecteExposureNum': '预期曝光量',
        '-expecteClickNum': '预期播放量',
        '-expectCPM': '预期CPM',
        '-fansInteractRate': '粉丝互动率',
        '-sixPrice': '达人报价'
      },
      loading: false,
      dialogData: {},
      provList: [],
      cityList: [],
      ageRangeList: [],
      fansAgeRangeList: [],
      phoneSysRange: [],
      mcnList: [],
      sixRange: []
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  created() {
    lego.send({
      actiontype: 'Z4114',
      pagetype: 'zpmshow',
      backup: {
        sortId: 0,
        sortName: '进入页面',
        token: this.user.userInfo.userid,
        uid: this.user.userInfo.id
      }
    })
    this.getList()
    // this.getKsAccountTags()
    this.getSeachConfigList()
    this.getArea().then(res => {
      this.provList = res.data
    })
    this.getDictDataList()
    this.getMcnList()
  },
  methods: {
    // 达人标签
    // getKsAccountTags() {
    //   $getKsAccountTags().then(res => {
    //     if (res.code === 1) {
    //       res.data.unshift('全部')
    //       this.tagsData.topics.list = res.data
    //     }
    //   })
    // },
    getMcnList() {
      $getKsMcnName().then(res => {
        if (res.code === 1) {
          this.mcnList = res.data
        }
      })
    },
    handleSearchBtnClick() {
      if (this.searchData.wd !== '') {
        this.searchData.determined = ''
      }
      this.handleSearch()
    },
    handleSearch() {
      this.tableData = []
      this.loading = true
      this.searchData.pageNum = 1
      this.total = 0
      this.$bus.$emit('upLog', { operation_module: '搜索', ...this.searchData })
      this.getList()
    },
    handleProvChange(node, resolve) {
      const provName = node.value
      const level = node.level
      // 暂时性修复执行两次的问题
      if (level === 2 || node.children && node.children.length > 0) return resolve()
      // this.searchData.provinceName = provName
      if (provName) {
        const id = this.provList.find(item => item.areaName === provName).areaId
        this.getArea(id).then(res => {
          res.data.map(item => (item.leaf = true))
         resolve(res.data)
        })
      } else {
        resolve([])
        this.searchData.cityName = ''
      }
      // this.handleSearch()
    },
    handleCustomChange(item) {
      if (item._end < item._start) {
        this.$message.error('结束值应大于开始值')
        return
      }
      if (item._start && item._end) {
        this.$nextTick(() => {
          this.searchData[item.valKey] = `${item._start * 10000}-${item._end * 10000}`
          this.handleSearch()
        }, 50)
      }
    },
    updateList(info) {
      const { topics } = info
      const index = this.editIndex
      let tagName = []
      if (topics.length) {
        tagName = topics.map(id => {
          return this.tagsData[0].list.filter(item => item.tagId === id)[0].tagName
        })
      }
      // this.tableData[index].sysAccountTag = [...new Set([...tagName, ...(this.tableData[index].sysAccountTag || '').split(',')])].filter(item => item).join(',')
      this.tableData[index].tagName = tagName.filter(item => item).join(',')
      this.editIndex = -1
    },

    upDateTableData(index) {
      const newTableData = [...this.tableData]
      newTableData[index].readySignContractAccountFlag = false
      this.tableData = newTableData
    },

    getMoreList() {
      if (this.tableData.length >= this.total) {
        return
      }
      this.searchData.pageNum += 1
      this.loading = true
      this.getList()
    },
    // 获取搜索配置项下拉数据
    getSeachConfigList() {
      $getDataByDictType({
        dictTypes: [
          'sys_search_cpm',
          'fans_age_kuaishou_condition_age',
          'daren_library_query_condition_phone',
          'daren_library_query_condition_fans',
          'daren_library_query_condition_60s',
          'daren_library_query_condition_sex',
          'daren_library_query_condition_sex_rate',
          'account_price_avg_like',
          'account_price_middle_like',
          'industry_category_tag',
          'kuaishou_account_tag'
        ]
      }).then(res => {
        if (res.code === 1) {
          const sixPriceTag = this.tagsData.sixPrice
          const fansTage = this.tagsData.fans
          const categoryTage = this.tagsData.industryCategoryTag
          const topics = this.tagsData.topics
          const all = {
            [sixPriceTag.valKey]: '',
            [sixPriceTag.labelName]: '全部'
          }
          categoryTage.list = res.data.industry_category_tag || []
          topics.list = res.data.kuaishou_account_tag || []
          sixPriceTag.list = res.data.daren_library_query_condition_60s || []
          fansTage.list = res.data.daren_library_query_condition_fans || []

          categoryTage.list.unshift(all)
          sixPriceTag.list.unshift(all)
          fansTage.list.unshift(all)
          topics.list.unshift(all)

          this.cpmList = res.data.sys_search_cpm
          this.fansAgeRangeList = res.data.fans_age_kuaishou_condition_age
          this.phoneSysRange = res.data.daren_library_query_condition_phone
          this.middleLikeList = res.data.account_price_middle_like
          this.nealy7ThumbUpAvgList = res.data.account_price_avg_like
          this.sixRange = res.data.daren_library_query_condition_sex.map(item => ({ ...item, children: res.data.daren_library_query_condition_sex_rate }))
          // {

          //   if (item.list && item.list.length === 0) {
          //     item.list = res.data[item.key] || []
          //   }
          //   if (!item.all) {
          //     const all = {
          //       [item.valKey]: '',
          //       [item.labelName]: '全部'
          //     }
          //     item.list.unshift(all)
          //   }
          // })
        }
      })
    },
    buildParams() {
      console.log(this.searchData)
      const params = copy(this.searchData)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      if (params.region) {
        //  provinceName: '',
        // cityName: '',
        params.provinceName = params.region[0]
        params.cityName = params.region[1]
        delete params.region
      }
      if (params.sixRange) {
        params.maxSexLabel = params.sixRange[0]
        params.maxSexRate = params.sixRange[1]
        delete params.sixRange
      }
      if (isArray(params.accountTags)) {
        params.accountTags = params.accountTags.join(',')
      }
      console.log(params)
      return params
    },
    getList() {
      this.loading = true
      const params = this.buildParams()
      $getKsAccountList(params).then((re) => {
        if (re.code === 1) {
          this.total = re.total
          // const tableData = re.data.map(item => {
          //   // item.tagName = item.tagName.split(',')
          //   item.sysAccountTag = `${item.sysAccountTag || ''},${item.tagName || ''}`
          //   item.sysAccountTag = [...new Set([...item.sysAccountTag.split(',')])].filter(item => item).join(',')
          //   return item
          // })
          // this.tableData = [...this.tableData, ...tableData]
          this.tableData = [...this.tableData, ...re.data]
        } else {
          this.$message.error(re.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        this.loading = false
        this.$message.error(err.message)
      })
    },
    getDictDataList() {
      $getDictDataList({ dictType: 'daren_age_range' }).then(res => {
        if (res.code === 1) {
          this.ageRangeList = res.data
        }
      })
    },
    getArea(parentId = 0, random = '') {
      return $getAera({ parentId }, random)
    }
  }
}
</script>
<style lang="scss" scoped>
$--label-width: 70px;

.no-data {
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.accounts {
  &-search {
    &__title {
      &-input {
        width: 590px;
      }
    }
    &__label {
      flex-shrink: 0;
      width: $--label-width;
      text-align:justify;
      text-align-last: justify;
      margin-right: 10px;
    }
    &__sub-label {
      width: $--label-width;
      text-align: right;
    }
  }
  ::v-deep {
    .is-active {
      .el-radio-button__inner {
        // color: $--color-primary;
      }
    }
    .el-radio-button__inner {
      // color: rgba(0, 0, 0, 0.65);
      &:hover {
        // color: $--color-primary;
      }
    }
  }
}
.m-t-40 {
  margin-top: 40px;
}
</style>
