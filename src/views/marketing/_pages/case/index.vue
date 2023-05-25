<template>
  <div class="P-advertisingCase" data-burry_sub_page_type="in_adv">
    <div class="P-advertisingCaseCon">
      <div class="P-advertisingCaseSearch">
        <div v-for="type in searchTypes" :key="type.key" class="P-advertisingCaseSearchType">
          <div class="P-advertisingCaseSearchTitle">{{ type.text }}</div>
          <div class="P-advertisingCaseSearchTags">
            <div v-for="item in datas.tags[type.key]" :key="item[type.valKey]" data-type="tag">
              <template v-if="item._isCustom">
                <div class="P-advertisingCaseSearchTagsCustom">
                  <el-tag
                    v-if="!item._status"
                    effect="dark"
                    size="small"
                    @click="onCustom(type, item)"
                  >自定义</el-tag>

                  <div v-show="item._status" class="P-advertisingCaseSearchTagsCustomForm">
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
        <el-form :model="searchData" :inline="true">
          <el-form-item>
            <el-input v-model="searchData.flowContent" placeholder="请输入品牌" autocomplete="off" />
          </el-form-item>

          <el-form-item>
            <el-input v-model="searchData.accountName" placeholder="请输入账号" autocomplete="off" />
          </el-form-item>

          <el-form-item>
            <el-input v-model="searchData.titleName" placeholder="请输入标题" autocomplete="off" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <VideoCard type="card" /> -->
      <div v-loading="loading">
        <div v-if="total">
          <div class="P-advertisingCaseList">
            <div class="P-advertisingCaseListRow">
              <template v-for="(row) in tableData">
                <div
                  v-for="(col, idx) in row"
                  :key="col.flowId"
                  class="P-advertisingCaseListCol"
                  :data-pos="idx"
                  :data-id="col.flowId"
                  style="width: 16.666%"
                >
                  <VideoCard v-if="col.flowId" type="card" :data="col" style="margin-right: 24px;width: auto;">
                    <template v-slot:hoverHead>
                      <div class="video-card-mask">
                        <el-button icon="iconfont iconbofang_fill" type="primary" @click="goPlay(col.url)">播放</el-button>
                        <el-button icon="iconfont iconbianji_fill" type="primary" @click="onCard(col, 'edit')">编辑</el-button>
                        <el-button icon="iconfont iconshanchu_fill" type="primary" @click="onCard(col, 'del')">删除</el-button>
                      </div>
                    </template>
                  </VideoCard>
                </div>
              </template>
            </div>
          </div>
          <div v-if="total" class="P-advertisingCaseListPager">
            <el-pagination
              background
              layout="prev, pager, next, jumper"
              :page-size="20"
              :total="total"
              :current-page.sync="nowPage"
            />
          </div>
        </div>
        <div v-else class="P-advertisingCaseListEmpty">暂无数据</div>
      </div>
    </div>

    <el-dialog
      class="P-advertisingCaseDialog"
      :title="dialogTitle"
      :visible.sync="dialogStatus"
      @close="onCancel"
    >
      <div v-if="isDelDialog" class="P-advertisingCaseDialogText">确认删除数据吗？</div>
      <div v-else class="P-advertisingCaseDialogForm">
        <el-form ref="form" :model="dialogData" label-width="120px">
          <el-form-item label="URL链接:">
            <span>{{ dialogData.url }}</span>
          </el-form-item>
          <el-form-item label="标题:">
            <span>{{ dialogData.titleName }}</span>
          </el-form-item>
          <el-form-item label="行业类别:" :required="true">
            <el-select
              v-model="dialogData.tagId"
              class="P-advertisingCaseDialogFormSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in datas.tags.advTopics"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌:" :required="true">
            <el-input v-model="dialogData.flowContent" />
          </el-form-item>
          <el-form-item label="封面图片:">
            <div class="P-advertisingCaseDialogFormImg">
              <img :src="dialogData.flowImg">
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="P-advertisingCaseDialogFooter">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="maskLoading" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '../../_mods/mixin'
import { toOptions, date, copy } from '@/components/common'
import { $getMarketAdvCase, $delMarketAdvCase, $modifyMarketAdvCase, $searchMarketAccount } from '@/api/marketing'
import VideoCard from '@/components/VideoCardNew/index.vue'
import './index.scss'

const ADV_MAP = {
  '1': '是',
  '0': '否'
}

const A_DAY = 864e5

export default {
  components: { VideoCard },
  mixins: [mixin],
  data() {
    var today = Date.now()
    var todayStr = date('Y-m-d 23:59:59', new Date(today))
    var endDateStr = 'Y-m-d 00:00:00'
    return {
      searchData: {
        determined: '',
        start: '',
        end: '',
        title: '',
        adv_id: '',
        flowContent: '',
        accountName: '',
        titleName: ''
      },
      ADV_MAP,
      accountData: [],
      searchLoading: false,
      datas: {
        tags: {
          date: [
            {
              id: '全部',
              _selected: true,
              typeId: '',
              type_name: '全部'
            },
            {
              id: 'date1',
              typeCode: [
                todayStr,
                date(endDateStr, new Date(today - A_DAY * 7))
              ],
              typeId: '-7',
              type_name: '近7日'
              // _selected: true
            },
            {
              id: 'date2',
              typeCode: [
                todayStr,
                date(endDateStr, new Date(today - A_DAY * 30))
              ],
              typeId: '-30',
              type_name: '近30日'
            },
            {
              id: 'date3',
              typeCode: [
                todayStr,
                date(endDateStr, new Date(today - A_DAY * 90))
              ],
              typeId: '-90',
              type_name: '近90日'
            }
          ]
        }
      },
      searchTypes: [
        {
          text: '行业类别',
          key: 'advTopics',
          valKey: 'tagId',
          nameKey: 'tagName'
        },
        {
          text: '点赞数',
          key: 'diggs',
          qKey: 'diggRang',
          valKey: 'typeCode',
          nameKey: 'typeName',
          custom: true
        },
        {
          text: '发布时间',
          key: 'date',
          qKey: '*_time',
          valKey: 'typeId',
          nameKey: 'type_name'
          // all: false
        }
      ],
      selectedSearch: {},
      dialogStatus: false,
      maskLoading: false,
      dialogType: '',
      dialogData: {},
      isDelDialog: false
    }
  },
  computed: {
    dialogTitle() {
      return this.isDelDialog ? '删除确认' : '广告案例'
    }
  // ...mapState({
  //   user(state) {
  //     return state.auth.user
  //   }
  // })
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.getList(nVal)
      }
    }
  },
  created() {
    this.listColNum = 2
    this.selectedSearch.date = this.datas.tags.date.filter(
      item => item._selected
    )
    this.loading = true
    this.getAllTags().then(
      re => {
        this.getList(1)
      },
      err => {
        console.error(err)
      }
    )
  },
  methods: {
    goPlay(url) {
      window.open(url)
    },
    // 获取表格数据
    getListData(query) {
      if (!query.startTime) {
        let dateType = this.selectedSearch.date
        dateType = dateType || {}
        if (dateType.typeId) {
          query.startTime = dateType.typeCode[1]
          query.endTime = dateType.typeCode[0]
        }
      }
      return $getMarketAdvCase(query)
        .then(re => {
          if (re.code === 1 && re.data) {
            // 格式化成二维数组
            const data = []
            let row = []
            // const tags = this.datas.tags.advTopics
            re.data.forEach((item, index) => {
              if (item.tagValue) {
                item.tagValue = item.tagValue.split(',')
                // item.tagId = tags
                //   .filter(tag => item.tagValue.indexOf(tag.tagName) !== -1)
                //   .map(tag => tag.tagId)
                // NOTE:
                // 一开始是支持多选的，后面改成了单选
                // 为了防止产品反悔，这里强制改成单选的数据结构
                // item.tagId = item.tagId[0]
              } else {
                // item.tagId = []
              }
              row.push(item)
              if (index % this.listColNum) {
                data.push(row)
                row = []
              }
            })
            if (row.length) {
              while (row.length < this.listColNum) {
                row.push({
                  flowId: ''
                })
              }
              data.push(row)
            }
            row = null
            re.data = data
          }
          return re
        })
    },
    // 搜索
    onSubmit() {
      this.nowPage = 1
      this.getList(1)
    },
    onCard(item, type) {
      this.dialogType = type
      this.isDelDialog = type === 'del'
      this.dialogData = copy(item)
      this.dialogStatus = true
    },
    onCancel() {
      this.dialogStatus = false
      this.maskLoading = false
      this.dialogData = {}
    },
    onConfirm() {
      var ajaxRequest
      var data
      switch (this.dialogType) {
          case 'del':
            ajaxRequest = $delMarketAdvCase
            data = {
              flowId: this.dialogData.flowId
            }
            break

          case 'edit':
            ajaxRequest = $modifyMarketAdvCase
            data = {
              flowId: this.dialogData.flowId,
              // 历史问题，这里手动改成数组模式
              tagId: this.dialogData.tagId,
              brand: this.dialogData.flowContent,
              flowImg: this.dialogData.flowImg
            }
            break
      }
      this.maskLoading = true
      typeof ajaxRequest === 'function' && ajaxRequest(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.onCancel()
            this.getList(this.nowPage)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.maskLoading = false
        })
    },
    // 输入搜索账号
    async onSearchAccounts(accountName) {
      if (accountName) {
        this.searchLoading = true
        const re = await $searchMarketAccount({ accountName })
        this.searchLoading = false
        if (re.code === 1) {
          this.accountData = toOptions(re, {
            valKey: 'accountId',
            textKey: 'accountName'
          })
        } else {
          this.searchLoading = false
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-card-mask {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .65);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    ::v-deep .el-button {
      display: inline-flex;
      align-items: center;
      margin: 0 0 8px 0;
      .iconfont {
        font-size: 16px;
      }
      span {
        margin-left: 8px;
      }
    }
  }
</style>
