<template>
  <div class="P-advertisingSop" data-burry_sub_page_type="in_sop">
    <div class="P-advertisingSopCon">
      <div class="P-advertisingSopSearch">
        <div v-for="type in searchTypes" :key="type.key" class="P-advertisingSopSearchType">
          <div class="P-advertisingSopSearchTitle">{{ type.text }}</div>
          <div class="P-advertisingSopSearchTags">
            <div
              v-for="item in datas.tags[type.key]"
              :key="item[type.valKey]"
              data-type="tag"
            >
              <template v-if="item._isCustom">
                <div class="P-advertisingSopSearchTagsCustom">
                  <el-tag
                    v-if="!item._status"
                    effect="dark"
                    size="small"
                    @click="onCustom(type, item)"
                  >自定义</el-tag>

                  <div v-show="item._status" class="P-advertisingSopSearchTagsCustomForm">
                    <el-input
                      v-model="item._start"
                      type="number"
                      min="0"
                      placeholder="开始值"
                      autocomplete="off"
                      size="mini"
                      @change="onCustomChange(item, type)"
                    />w
                    <span>-</span>
                    <el-input
                      v-model="item._end"
                      type="number"
                      min="0"
                      placeholder="结束值"
                      autocomplete="off"
                      size="mini"
                      @change="onCustomChange(item, type)"
                    />w
                  </div>
                </div>
              </template>
              <template v-else>
                <el-tag
                  data-burry_btn_name="tab"
                  :data-burry_title="item[type.nameKey]"
                  :effect="(item._selected ? 'dark': 'plain')"
                  :type="(item._selected ? '':'info')"
                  size="small"
                  @click="onTag(item, type)"
                >{{ item[type.nameKey] }}</el-tag>
              </template>
            </div>
          </div>
        </div>
        <div class="P-advertisingSopSearchName">
          <el-input v-model="searchData.accountName" placeholder="请输入账号" autocomplete="off" />
          <el-button type="primary" data-burry_btn_name="search" @click="onSearch()">查询</el-button>
        </div>
      </div>
    </div>
    <div class="P-advertisingSopCon">
      <div v-if="$permission('market_sop_add_acount')" class="P-advertisingSopFn">
        <el-button type="primary" plain @click="onCreate">添加账号</el-button>
      </div>
      <div v-loading="loading">
        <div class="P-advertisingSopTable">
          <el-table
            ref="accounts"
            v-scrollbar
            v-loading="loading"
            :data="tableData"
            header-row-class-name="P-advertisingSopTableHead"
            row-class-name="P-advertisingSopTableRow"
            @sort-change="doSort"
          >
            <el-table-column prop="accountName" label="账号名" width="222">
              <template slot-scope="{row}">
                <AccountCard :info="row" :options="{accountUrl: 'authorUrl'}" />
              </template>
            </el-table-column>
            <el-table-column label="内容主题" width="230">
              <template slot-scope="s">
                <div class="P-advertisingSopTagsList">
                  <el-tag v-for="(tag, index) in s.row.tagName" :key="index">{{ tag }}</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="commentContent" label="账号点评" />
            <el-table-column prop="fansNum" label="粉丝数" width="120" sortable="custom" />
            <el-table-column prop="addFansNum" label="昨日涨粉数" width="120" sortable="custom" />

            <el-table-column label="操作">
              <template slot-scope="s">
                <el-link
                  class="m-r-10"
                  type="primary"
                  :underline="false"
                  @click="goVideoList(s.row)"
                >查看视频列表</el-link>
                <el-link
                  v-if="$permission('market_sop_add_rsd_acount')"
                  class="m-r-10"
                  type="primary"
                  :underline="false"
                  @click="goSet(s.row)"
                >添加为对标账号</el-link>
                <el-link
                  v-if="$permission('market_sop_edit')"
                  class="m-r-10"
                  type="primary"
                  :underline="false"
                  @click="goChange(s.row)"
                >修改</el-link>
                <el-link
                  v-if="$permission('market_sop_del')"
                  type="primary"
                  :underline="false"
                  @click="goDel(s.row)"
                >删除</el-link>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total" class="P-advertisingSopTablePager">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="nowPage"
          />
        </div>
      </div>
    </div>
    <add-sop
      :status.sync="dialogSOPStatus"
      :is-edit="isEdit"
      :dialog-data="dialogData"
      :topics-list="datas.tags.topics"
      @success="getList(nowPage)"
    />
    <AddBenchMark v-if="dialogStatus" v-model="dialogStatus" :dialog-data="dialogData" :save="onConfirm" />

    <el-dialog
      class="P-advertisingSopDialog"
      title="提示"
      :visible.sync="dialogDelStatus"
      @close="onCancel"
    >
      <div class="P-advertisingSopDialogText">确认要删除 {{ dialogData.accountName }} 吗？</div>
      <div slot="footer" class="P-advertisingSopFooter">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="markLoading" @click="onDelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '../../_mods/mixin'
import { copy } from '@/components/common'
import addSop from './addSop'
import { $getMarketSopAccounts, $delMarketSopAccount, $setBenchmarking } from '@/api/marketing'
import { AccountCard, AddBenchMark } from 'components'
import './index.scss'

/**
 * 设置为对标账户的固定配置
 * 后面最好使用接口去取对应的 url, platId, platName
 * @type {Object}
 */
const BENCHMARK_CONF = {
  url: '/account/plat_monitor/douyin/',
  data: {
    platId: 25,
    platName: '抖音',
    user_url: '',
    user_id: 0,
    note: ''
  }
}

export default {
  components: {
    addSop,
    AddBenchMark,
    AccountCard
  },
  mixins: [mixin],
  data() {
    return {
      searchTypes: [
        {
          text: '内容主题',
          key: 'topics',
          valKey: 'tagId',
          nameKey: 'tagName'
        },
        {
          text: '粉丝数',
          key: 'fans',
          qKey: 'fansRange',
          valKey: 'typeCode',
          nameKey: 'typeName',
          custom: true
        }
      ],
      selectedSearch: {},
      datas: {
        tags: {}
      },
      searchData: {
        fansRange: '',
        tagId: '',
        determined: '',
        accountName: ''
      },
      dialogStatus: false,
      dialogSOPStatus: false,
      dialogData: {},
      tags: [],
      inputTag: '',
      markLoading: false,
      isEdit: false,
      dialogDelStatus: false
    }
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.getList(nVal)
      }
    }
  },
  created() {
    this.getAllTags()
    this.getList(1)
  },
  methods: {
  /**
     * 选择内容主题checkbox
     */
    onChangeTopics() {
      const { topics } = this.dialogData
      const { tags } = this.datas
      const select = (has) => {
        for (let i = 0; i < tags.topics.length; i++) {
          const t = tags.topics[i]
          if (topics.indexOf(t.tagName) === -1) {
            this.$set(t, 'disabled', has)
          }
        }
      }
      if (topics.length >= 6) {
        select(true)
        return
      }
      select(false)
    },
    // 获取表格数据
    getListData(query) {
      return $getMarketSopAccounts(query)
        .then(re => {
          if (re.code === 1) {
            re.data.forEach(item => {
              if (item.tagName) {
                item.tagName = item.tagName.split(',')
              }
            })
            return re
          }
        })
    },
    // 关闭或取消设为对标账号
    onCancel() {
      this.dialogStatus = false
      this.dialogSOPStatus = false
      // this.dialogData = {}
      this.inputTag = ''
      this.tags = []
      this.isEdit = false
      this.dialogDelStatus = false
    },
    goChange(item) {
      const dialogData = {
        accountId: item.accountId,
        url: item.authorUrl,
        commentContent: item.commentContent,
        accountName: item.accountName,
        accountImg: item.accountImg,
        topics: [...item.tagName] || []
      }
      this.dialogData = dialogData
      this.isEdit = true
      this.dialogSOPStatus = true
    },
    /**
     * 设为对标
     */
    goSet(item) {
      this.dialogStatus = true
      this.dialogData = item
    },
    goVideoList(item) {
      this.$router.push({
        path: `/dy-manage/details/${item.accountId}`,
        query: {
          accountType: item.accountType || 1,
          accountId: item.accountId,
          accountName: item.nickName,
          type: 1,
          _blank: true
        }
      })
    },
    // 确认设为对标账号
    onConfirm({ tagValue }, fn) {
      if (this.markLoading) {
        return
      }
      var data = copy(BENCHMARK_CONF.data)
      data.note = tagValue.join(',')
      data.userUrl = this.dialogData.authorUrl
      data.accountId = this.dialogData.accountId
      // data.userId = this.$store.state.user
      this.markLoading = true
      $setBenchmarking(data)
        .then(re => {
          this.markLoading = false
          if (re.code === 1) {
            this.$message({
              message: '设置成功',
              type: 'success'
            })
            this.dialogStatus = false
            this.dialogData = {}
            fn()
          } else {
            this.$message.error(re.message)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.markLoading = false
        })
    },
    // 删除标签
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },
    // 确认标签输入
    handleInputConfirm() {
      if (this.tags.length === 6) {
        this.$message({
          message: '最多只能添加 6 个标签',
          type: 'error'
        })
        return
      }
      var inputTag = this.inputTag
      if (inputTag && this.tags.indexOf(inputTag) === -1) {
        this.tags.push(inputTag)
      }
      this.inputTag = ''
    },
    goDel(item) {
      item = {
        accountId: item.accountId,
        accountName: item.accountName
      }
      this.dialogData = item
      this.dialogDelStatus = true
    },
    onDelConfirm() {
      $delMarketSopAccount({
        accountId: this.dialogData.accountId
      })
        .then(re => {
          this.markLoading = false
          if (re.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })

            this.getList(1)
            this.onCancel()
          }
        })
    },
    onCreate() {
      var item = {
        topics: [],
        url: '',
        commentContent: ''
      }
      this.dialogData = item
      this.isEdit = false
      this.dialogSOPStatus = true
    }
  }
}
</script>
<style lang="scss">
  // @import url('./index.scss');
  .P-advertisingSop {

    .el-table_1_column_1 {
      .el-link {
        margin-right: 10px;
      }
    }
  }
</style>
