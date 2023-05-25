<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-16 10:15:12
 * @LastEditTime: 2020-11-20 15:49:22
 * @LastEditors: Linjie
-->
<template>
  <div>
    <Wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:btns="target">
          <el-button
            type=""
            :disabled="!(target.model.deliveryChannel === 'douyin' && target.model.transcodingStatus === 1)"
            @click="onLinkExport(target.model)"
          >导出抖音待转码渠道号</el-button>
        </template>
      </Search>
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-between m-b-16">
        <el-button
          v-if="$permission('link_edit')"
          type="primary"
          @click="addShow=true"
        >新增组件link</el-button>
        <!-- <div>
          <el-select class="m-r-10" placeholder="请选择是否启用" />
          <el-button
            type="primary"
          >批量操作</el-button>
        </div> -->
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @selection-change="handleSelectionChange"
        @sort-change="doSort"
      >
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column label="组件ID" prop="id" />
        <el-table-column label="组件类型" prop="linkUseType" />
        <el-table-column label="组件渠道号" prop="androidDeliveryName" />
        <el-table-column label="组件名称" prop="linkName" />
        <el-table-column label="组件状态">
          <template slot-scope="s">
            <span :class="'color' + s.row.enable">{{ s.row.enableStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="组件品牌" prop="brandName" />
        <el-table-column label="机型" prop="phoneModel">
          <template slot-scope="s">
            <span>{{ s.row.deliveryChannel === '抖音' && s.row.brandName === '转转' && s.row.businessTag === 'B2C' && s.row.phoneBrand ? `${s.row.phoneBrand}${s.row.phoneModel ? `-${s.row.phoneModel}`: ''}` : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务标签" prop="businessTag" />
        <el-table-column label="团队属性" prop="teamAttribute" />
        <el-table-column label="组件跳转链路" prop="businessType" width="120" />
        <el-table-column label="投放渠道" prop="deliveryChannel" />
        <el-table-column label="使用方" prop="userName" />
        <el-table-column label="用户所属军" prop="dName" />
        <el-table-column label="用户所属团" prop="fName" />
        <el-table-column label="创建时间" prop="createTime" width="102" />
        <el-table-column fixed="right" label="操作" width="160">
          <template slot-scope="s">
            <div class="btn-wrap">
              <el-button
                size="mini"
                type="text"
                @click="hanldeOpenEdit(s.row.id, 0)"
              >查看</el-button>
              <!-- <el-button
                v-if="($permission('link_edit') || s.row.editAuth) && s.row.teamAttribute !== '投放'"
                size="mini"
                type="text"
                @click="hanldeOpenEdit(s.row.id, 1)"
              >编辑</el-button> -->
              <el-button
                v-if="$permission('link_edit')"
                :disabled="s.row.enable !== 2"
                size="mini"
                type="text"
                @click="hanldeDisabled(s.row.id)"
              >禁用</el-button>
              <el-button
                v-if="($permission('link_edit') && s.row.editAuth && s.row.teamAttribute !== '投放') || (s.row.deliveryChannel === '抖音' && s.row.brandName === '转转' && s.row.businessTag === 'B2C')"
                size="mini"
                type="text"
                @click="hanldeOpenEdit(s.row.id, 1)"
              >编辑</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <Add :add-show.sync="addShow" :normal-form-item-map="normalFormItemMap" @success="getList" />
    <Edit
      :link-id="linkId"
      :edit-show.sync="editShow"
      :types="types"
      :user-list="normalFormItemMap.userId || {}"
      :d-id-list="normalFormItemMap.dId.data || []"
      @success="getList"
    />
  </div>
</template>
<script>
import qs from 'qs'
import Search from '@/components/Search'
import Add from './_com/Add'
import Edit from './_com/Edit'
import tableMixin from '@/mixins/table'

import { $getLinkList, $getLinkCondition, $disableLinkStatus, $getBusinessTypeNew } from '@/api/link'
import { $getOrgCondition, $getDataByDictType } from '@/api'
import { objectMerge } from '@/utils'
const TRANS_CODING_STATUS = [{
  text: '无需转码',
  val: 0
}, {
  text: '待转码',
  val: 1
}, {
  text: '已转码',
  val: 2
}]
export default {
  components: {
    Search,
    Add,
    Edit
  },
  mixins: [tableMixin],
  data() {
    return {
      searchData: {
      },
      brandName: null,
      linkUseType: null,
      formConf: {},
      addShow: false,
      editShow: false,
      types: 0, // 0-查看，1-编辑
      linkId: '',
      normalFormItemMap: {}
    }
  },
  created() {
    this.buildFormConf()
    this.getList()
    this.getCondition()
    this.getOrgInfo()
    this.getBusinessTag()
  },
  methods: {
    buildFormConf() {
      let normal = [{
        type: 'select',
        key: 'androidDeliveryName',
        conf: {
          placeholder: '请选择组件渠道号'
        },
        data: []
      }, {
        type: 'select',
        key: 'linkUseType',
        conf: {
          placeholder: '请选择组件类型'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'autocomplete',
        key: 'linkName',
        conf: {
          placeholder: '请输入组件名称',
          fetchSuggestions: this.productSearch
        },
        data: []
      }, {
        type: 'select',
        key: 'enable',
        conf: {
          placeholder: '请选择组件状态'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'select',
        key: 'brandName',
        conf: {
          placeholder: '请选择组件品牌'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'select',
        key: 'businessTag',
        data: [],
        optionLabelKey: 'dictLabel',
        optionValKey: 'dictValue',
        conf: {
          placeholder: '请选择业务标签'
        }
      }, {
        type: 'select',
        key: 'teamAttribute',
        conf: {
          placeholder: '请选择团队属性'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue',
        code: 'link_team_attr'
      }, {
        type: 'select',
        key: 'businessType',
        conf: {
          placeholder: '请选择组件跳转链路'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'select',
        key: 'deliveryChannel',
        conf: {
          placeholder: '请选择投放渠道'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'select',
        key: 'phoneType',
        conf: {
          placeholder: '请选择机型'
        },
        data: [],
        optionLabelKey: 'configName',
        optionValKey: 'configValue'
      }, {
        type: 'select',
        key: 'dId',
        conf: {
          placeholder: '请选择用户所属军'
        },
        data: [],
        optionLabelKey: 'orgName',
        optionValKey: 'orgId'
      }, {
        type: 'select',
        key: 'fId',
        conf: {
          placeholder: '请选择用户所属团'
        },
        data: [],
        optionLabelKey: 'orgName',
        optionValKey: 'orgId'
      }, {
        type: 'select',
        key: 'userId',
        conf: {
          placeholder: '请选择使用方'
        },
        data: [],
        optionLabelKey: 'userName',
        optionValKey: 'userId'
      }, {
        type: 'select',
        key: 'transcodingStatus',
        conf: {
          placeholder: '转码状态'
        },
        data: TRANS_CODING_STATUS
      }]

      const normalFormItemMap = {}
      normal = normal.filter(item => {
        return this.$permission(item.code)
      })
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: true
      }
    },
    handleVideoTagChange(value) {
      this.$refs.search.form.businessTag = ''
      console.log(value)
      if (value === 'zlj') {
        this.normalFormItemMap.businessTag.data = this._businessTags.zlj_putting_business_tag
      } else {
        this.normalFormItemMap.businessTag.data = this._businessTags.zz_putting_business_tag
      }
    },
    // 获取业务标签
    getBusinessTag() {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then(res => {
        if (res.code === 1) {
          this._businessTags = res.data
          // if (this.$refs.search.form.videoTag === '找靓机') {
          //   this.normalFormItemMap.businessTag.data = this._businessTags.zlj_putting_business_tag
          // } else {
            this.normalFormItemMap.businessTag.data = this._businessTags.zz_putting_business_tag
          // }
          // this.businessTags = res.data.zz_putting_business_tag
        }
      })
    },
    getList() {
      this.loading = true
      const params = objectMerge({}, this.searchData)
      $getLinkList(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    getCondition() {
      $getLinkCondition().then(res => {
        if (res.code === 1) {
          for (const key in res.data) {
            if (this.normalFormItemMap[key]) {
              if (key === 'androidDeliveryName') {
                this.normalFormItemMap[key].data = res.data[key].map(item => ({ text: item, val: item }))
              } else {
                this.normalFormItemMap[key].data = res.data[key]
              }
            }
          }
          this.normalFormItemMap.linkUseType.data = res.data.linkUseTypeList
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    getOrgInfo() {
      $getOrgCondition().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.dId.data = res.data || []
        }
      })
    },
    onSubmit(data) {
      this.searchData = objectMerge(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    onExport(data) {
      const params = objectMerge(this.searchData, data)
      window.open(`/api/link/detail/exportLinkList?${qs.stringify(params)}`)
    },
    onLinkExport(data) {
      const params = objectMerge(this.searchData, data)
      window.open(`/api/link/detail/exportNeedTranscodingLink?${qs.stringify(params)}`)
    },
    onSearchChange(val, item, type, index, model) {
      console.log(item.key)
      if (item.key === 'dId') {
        if (val) {
          $getOrgCondition({ orgId: val }).then(res => {
            if (res.code === 1) {
              this.normalFormItemMap.fId.data = res.data || []
            }
          })
        } else {
          model.fId = ''
          this.normalFormItemMap.fId.data = []
        }
      }
      if (item.key === 'brandName') {
        this.brandName = val
      }
      if (item.key === 'linkUseType') {
        this.linkUseType = val
      }
      if (item.key === 'brandName') {
        this.handleVideoTagChange(val)
      }
      switch (item.key) {
          case 'brandName':
          case 'linkUseType':
            $getBusinessTypeNew({ brandName: this.brandName, linkUseType: this.linkUseType }).then(res => {
              if (res.code === 1) {
                this.normalFormItemMap.businessType.data = res.data || []
                model.businessType = ''
              }
            })
            break
      }
    },
    handleSelectionChange() {},
    hanldeOpenEdit(linkId, types) {
      this.linkId = linkId
      this.types = types
      this.editShow = true
    },
    productSearch(queryString, cb) {
      const productList = this.normalFormItemMap.linkName.data.map(item => {
        return {
          value: item
        }
      }) || []
      const list = queryString
        ? productList.filter(item => item.value.includes(queryString))
        : productList
      cb(list)
    },
    hanldeDisabled(linkId) {
      this.$confirm(`是否确认禁用?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        $disableLinkStatus({
          enable: 3,
          linkId: [linkId]
        }).then(res => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style lang="scss">
  .btn-wrap {
    .el-button {
      padding: 0 2px;
    }
  }
  .color1 {
    color: #409EFF
  }
  .color2 {
    color: #67C23A
  }
  .color3 {
    color: #F56C6C
  }
</style>
