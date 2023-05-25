<template>
  <Wrap class="p-t-0">
    <div class="totalBox">
      <div class="flex">
        <p class="flex flex-align-center total">
          共搜索到
          <strong data-bold>{{
            total > 1000
              ? $permission("is-show-all-data")
                ? total
                : "1000+"
              : total
          }}</strong>
          条数据
        </p>
        <el-switch
          v-model="searchData.blacklistFlag"
          :active-value="1"
          :inactive-value="0"
          active-text="是否过滤黑名单账号"
          @change="handleChangeFilterFlag"
        />
        <IconTip
          placement="top-start"
          trigger="hover"
          icon-class="iconwenhao"
          class="iconTip"
        >
          <div>
            <p>选“是”时，符合下列任一条件的账号不展示（默认选是）：</p>
            <p>1、最近15天没有任何视频更新（包括个人视频和星图视频）</p>
            <p>2、近30天，个人视频平均内容时长小于30秒（时长为空则不过滤），且没有发布星图视频</p>
            <p>3、过滤乾数据黑名单的账号</p>
          </div>
        </IconTip>
      </div>

      <div class="flex flex-align-center">
        <i class="iconfont el-icon-setting" />
        <el-button type="text" @click="showTableFieldConfig = true">
          设置显示的字段
        </el-button>
      </div>
    </div>
    <accountItem
      v-for="(item, index) in tableData"
      :key="item.accountId"
      :info="item"
      :time-map="timeMap"
      :config="tableSortConfigData"
      :index="index"
      class="m-b-16"
      @bindAccount="(item) => handleBindAccount(index, item)"
      @cancelRecommend="(val)=>handleCancelRecommend(val,index, item)"
    />
    <Loading v-if="loading" />
    <div v-if="!loading && tableData.length === 0" class="no-data">
      暂无数据
    </div>
    <div
      v-if="tableData.length > 0 && tableData.length === total"
      class="bottom-text"
    >
      <div class="bottom-text-line" />
      没有更多账号啦
      <div class="bottom-text-line" />
    </div>
    <BackToTop ref="backTopRefs" />

    <TableFieldConfig
      v-if="showTableFieldConfig"
      :show="showTableFieldConfig"
      :config-data="tableConfigData"
      code="dy_talent_bank_select"
      :sort-data="tableSortConfigData"
      @close="showTableFieldConfig = false"
      @confirm="handleConfirmChooseTableField"
    />

    <AccountDialog
      v-if="showAccountDialog"
      v-model="showAccountDialog"
      :edit-type="'edit'"
      :from="'newDylibrary'"
      :edit-data="accountEditData"
      :addbackfill="addbackfill"
      :save-interface="saveInterface"
      :edit-interface="editInterface"
      @updateData="updateEditList"
    />
  </Wrap>
</template>

<script>
import {
  $saveDeliveryAccount,
  $updateDeliveryAccountInfo,
  $checkBindAccount
} from '@/api/dy-manage'
import BackToTop from '@/components/BackToTop'
import IconTip from '@/components/IconTip'
import accountItem from './accountItem'
import Loading from '@/components/Loading'
import TableFieldConfig from '@/components/TableFieldConfig'
import AccountDialog from '@/views/putting-manager/putting-account/_component/AccountDialog.vue'
import { fieldConfigData, fieldSortConfigData } from './config'
import { lego } from '@zz-common/lego'
import { mapGetters } from 'vuex'
export default {
  components: {
    accountItem,
    Loading,
    BackToTop,
    IconTip,
    TableFieldConfig,
    AccountDialog
  },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    total: {
      type: Number,
      default: 0
    },
    tableData: {
      type: Array,
      default: () => []
    },
    timeMap: {
      type: Object,
      default: () => {}
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showTableFieldConfig: false,
      tableConfigData: [],
      tableSortConfigData: [],
      showAccountDialog: false,
      accountEditType: '',
      accountEditData: null,
      bindIndex: 0,
      addbackfill: false,
      saveInterface: $saveDeliveryAccount,
      editInterface: $updateDeliveryAccountInfo
    }
  },
  computed: {
     ...mapGetters(['user'])
  },
  watch: {
    showAccountDialog(val) {
      if (!val) {
        this.accountEditType = ''
        this.accountEditData = null
        this.isAffirm = false
      }
    }
  },
  mounted() {
    this.userId = this.$store.state.user.userInfo.userid
    const menuConfig = this.$store.state.user.config || []
    const tableMenu = menuConfig.find(
      (item) => item.menuCode === 'dy_talent_bank_select'
    )

    // 保存过，加载
    if (tableMenu) {
      const { config, sort } = JSON.parse(tableMenu.customColumns)
      this.tableConfigData = this.loadConfigData(fieldConfigData, config)
      this.tableSortConfigData = this.loadSortData(config, sort)
      console.info(
        '----s-s-s-s--s-ss',
        this.tableConfigData,
        this.tableSortConfigData
      )
    } else {
      // 没保存过，走默认
      this.tableConfigData = fieldConfigData
      this.tableSortConfigData = fieldSortConfigData
    }
  },
  methods: {
    loadSortData(saveConfig, saveSort) {
      // 所有的排序
      const allSortData = fieldConfigData
        .map((item) => item.children)
        .flat(Infinity)

      const tableSortConfigData = allSortData
        .map((item) => {
          let newItem = { ...item }
          // 保存的排序的index
          const index = saveSort.findIndex((it) => it.field === item.field)

          // 从保存的配置中找的index
          const sortIndexInConfig = saveConfig
            .map((item) => item.children)
            .flat(Infinity)
            .findIndex((it) => it.field === item.field)
          // 找到了 说明该字段无改变
          if (index > -1) {
            newItem = {
              ...saveSort[index],
              ...item,
              // 需要取保存的值
              radioChildren: saveSort[index].radioChildren,
              defaultShow: saveSort[index].defaultShow
            }
          } else if (sortIndexInConfig > -1) {
            // 在保存的中没找到 且不是第一级 再从保存的配置中找，找到了 说明是取消的 直接取值
            newItem = saveConfig.map((item) => item.children).flat(Infinity)[
              sortIndexInConfig
            ]
          } else {
            // 没找到 说明是新增的字段 返回原值即可，删减的情况不用考虑 不取任何值即可
            // 默认不展示 返回空
            if (!newItem.defaultShow) {
              return ''
            }
          }
          return newItem
        })
        .filter((item) => (item || {}).defaultShow)

      const finalSortData = []

      saveSort.forEach((item) => {
        const index = tableSortConfigData.findIndex(
          (it) => it.field === item.field
        )

        if (index > -1) {
          finalSortData.push({
            ...item,
            ...tableSortConfigData[index]
          })

          tableSortConfigData.splice(index, 1)
        }
      })
      return [...finalSortData, ...tableSortConfigData]
    },
    loadConfigData(fieldConfigData, saveConfig = [], type) {
      const newFieldConfigData = fieldConfigData.map((item) => {
        const newItem = { ...item }

        const saveIndex = saveConfig.findIndex((it) => it.field === item.field)

        if (saveIndex > -1) {
          if (type === 'export') {
            // 能找到， 原有的 对齐defaultShow, 递归内部children。 找不到取新值
            newItem.exportDefaultShow = saveConfig[saveIndex].exportDefaultShow
          } else {
            // 能找到， 原有的 对齐defaultShow, 递归内部children。 找不到取新值
            newItem.defaultShow = saveConfig[saveIndex].defaultShow
          }

          if (newItem.type === 'radioGroup') {
            newItem.radioChildren = saveConfig[saveIndex].radioChildren
          }

          if ((newItem.children || []).length) {
            newItem.children = this.loadConfigData(
              newItem.children,
              saveConfig[saveIndex].children,
              type
            )
          }
        }

        return newItem
      })

      return newFieldConfigData
    },
    handleChangeFilterFlag() {
      if (this.$refs.backTopRefs && this.$refs.backTopRefs.visible) {
        this.loading = true
        this.$refs.backTopRefs.backToTop()

        const checkSearch = () => {
          setTimeout(() => {
            if (!this.$refs.backTopRefs.visible) {
              this.$emit('search', 0)
            } else {
              checkSearch()
            }
          }, 400)
        }

        checkSearch()
        return
      }
      this.$emit('search', 0)
    },
    handleConfirmChooseTableField(data) {
      const searchData = { ...this.searchData }
      searchData.pageNum = 1
      this.$emit('handleCreateSessionId')
      this.$emit('reSearchCurrent', {
        ...searchData
      })
      this.showTableFieldConfig = false
      this.tableSortConfigData = JSON.parse(JSON.stringify(data.sort))
      this.tableConfigData = JSON.parse(JSON.stringify(data.config))
    },

    async handleBindAccount(index, item) {
      // if (item.deliveryAccountLibraryFlag) {
      //   this.$confirm(
      //     '该达人已在投放视频库中，如需添加对接人，请前往投放视频库中操作',
      //     '提示',
      //     {
      //       confirmButtonText: '确定',
      //       cancelButtonText: '取消',
      //       type: 'warning'
      //     }
      //   ).then(() => {
      //     this.$router.push({
      //       path: `/putting-manager/account-list?accountId=${item.accountId}&from=newDylibrary`,
      //       query: {
      //         _blank: true
      //       }
      //     })
      //   })
      //   return
      // }

      const res = await $checkBindAccount()

      if (+res.code === 1) {
        // 不能再添加了，提示
        if (!res.data.frequencyControlFlag) {
          this.$confirm(
            '当前添加的绑定账号过于频繁，已达到上限，请稍后再试',
            '',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
          return
        }
        this.showAccountDialog = true
        // this.accountEditType = item.deliveryAccountLibraryFlag ? 'edit' : 'add'
        this.bindIndex = index
        // add且抖音号存在就回填
        this.addbackfill =
          !item.deliveryAccountLibraryFlag &&
          !!(item.uniqueId || item.eid || item.getDataUrl)
        this.accountEditData = {
          ...item,
          platType: '25-抖音',
          plat_id: item.platId,
          businessLines: [],
          platName: item.platName || '抖音',
          xingtuPrice: item.twentySecondPrice,
          belongTeam: item.mcnName
        }
        // 当前账号不在投放账号库中，则属于新增，可填写对接人
        if (!item.deliveryAccountLibraryFlag) {
          this.accountEditData.editC2bOppositeUserIdFlag = true
          this.accountEditData.editB2cOppositeUserIdFlag = true
          this.accountEditData.editC2cOppositeUserIdFlag = true
        }
      } else {
        this.$message.error(res.message)
      }
    },

    handleCancelRecommend(val, index, item) {
      const { size } = this.searchData
      // 先取到当前点击的页码
      const searchData = { ...this.searchData }
      searchData.pageNum = Math.ceil(index / size) || 1
      this.$emit(
        'cancelRecommend',
        {
          ...searchData,
          accountId: item.accountId,
          getDataUrl: item.getDataUrl
        },
        index,
        val
      )
    },

    updateEditList(legoObj) {
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
         ...legoObj,
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          filterData: JSON.stringify(this.searchData)
        }
      })
      const { size } = this.searchData
      // 先取到当前点击的页码
      const searchData = { ...this.searchData }
      searchData.pageNum = Math.ceil(this.bindIndex / size) || 1

      this.$emit('reSearchCurrent', {
        ...searchData
      })
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
      width: $--label-width;
      text-align: justify;
      text-align-last: justify;
      margin-right: 10px;
    }
    &__sub-label {
      width: $--label-width;
      text-align: right;
    }
  }
  // ::v-deep {
  //   .is-active {
  //     .el-radio-button__inner {
  //       color: $--color-primary;
  //     }
  //   }
  //   .el-radio-button__inner {
  //     color: rgba(0, 0, 0, 0.65);
  //     &:hover {
  //       color: $--color-primary;
  //     }
  //   }
  // }
}
.m-t-40 {
  margin-top: 40px;
}

.totalBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0 16px;
  position: sticky;
  top: -24px;
  background-color: #fff;
  z-index: 2;
}

.total {
  font-size: 14px;
  margin-right: 14px;
}

.p-t-0 {
  padding-top: 0px;
}

.iconTip {
  font-size: 14px;
  align-items: center;
  margin-left: 4px;
}
.bottom-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  &-line {
    width: 40px;
    height: 1px;
    margin: 0 8px;
    border-bottom: 1px solid #999;
  }
}
</style>
