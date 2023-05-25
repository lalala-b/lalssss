<template>
  <div :class="['fRight', drawer && 'showDrawer']">
    <div class="carButton" @click="handleClick">
      <i class="carIcon el-icon-shopping-cart-2" />
      <div class="text">选<br>号<br>车</div>
      <sup class="num">{{ totalNum }}</sup>
    </div>

    <div :class="['content', drawer && 'showContent']">
      <div class="header">
        <i class="el-icon-close" @click="handleClick" />
      </div>

      <div class="body">
        <div v-if="!listData.length" class="empty">
          <i class="el-icon-shopping-cart-2" />
          <div>
            选号车内空空如也，<br>
            赶紧去挑选心仪的账号吧～
          </div>
        </div>
        <template v-else>
          <div v-for="item in listData" :key="item.accountId" class="listItem">
            <AccountCard :info="item">
              <span class="fans">粉丝数：{{ item.fansNum | toThousandsW }}</span>
            </AccountCard>

            <i class="deleteButton el-icon-close" @click="() => handleDelete(item.accountId)" />
          </div>
        </template>
      </div>

      <div class="footer">
        <div class="category">
          <div v-for="(item, index) in categoryData" :key="index" :class="[!item.num && 'none', 'categoryItem']">
            <div>
              <img :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${item.platId}.png`">
            </div>
            <span>{{ item.num || 0 }}</span>
          </div>
        </div>
        <div class="grey">
          <div class="total">
            已选中：{{ totalNum }}个
          </div>
          <div class="tools">
            <el-button type="text" :disabled="!totalNum" @click="handleDeleteAll">
              清空选号车
              <i class="el-icon-delete" />
            </el-button>
            <el-button v-if="$permission('sync_opportunities_btn')" :disabled="!totalNum" type="primary" @click="handleSyncOpportunities">同步到商机</el-button>
            <el-button :disabled="!totalNum" type="primary" @click="handleExport">导出账号</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, computed, getCurrentInstance, watch } from '@vue/composition-api'
import { AccountCard } from 'components'

export default defineComponent({
  props: {
    category: {
      type: Array,
      default: () => []
    },
    list: {
      type: Array,
      default: () => []
    },
    addFlag: {
      type: Boolean,
      default: () => false
    }
  },
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const { $confirm, $message } = getCurrentInstance().proxy

    const state = reactive({
      drawer: false,
      showDeleteAll: false
    })

    const categoryData = computed(() => props.category)

    const isAdd = computed(() => props.addFlag)

    const listData = computed(() => props.list || [])

    const totalNum = computed(() => {
      return props.category.reduce((perv, cur) => {
        return perv + (cur.num || 0)
      }, 0)
    })

    watch(isAdd, (val) => {
      if (val) {
        state.drawer = true
      }
    })

    const handleClick = () => {
      state.drawer = !state.drawer
    }

    const handleDelete = (accountId) => {
      emit('delete', accountId)
    }

    const handleDeleteAll = () => {
      if (!listData.value.length) return
      emit('deleteAll')
    }

    const handleExport = () => {
      emit('export')
    }

    const handleSyncOpportunities = () => {
      emit('syncOpportunities')
    }

    return {
      ...toRefs(state),
      handleClick,
      totalNum,
      categoryData,
      listData,
      handleDelete,
      handleDeleteAll,
      handleExport,
      handleSyncOpportunities
    }
  }
})
</script>

<style lang="scss" scoped>
.fRight {
  position: fixed;
  right: -326px;
  bottom: 0px;
  z-index: 2001;
  transition: all .3s;
  box-shadow: -1px 0px 4px 0px rgba(0,0,0,0.5);
}

.carButton {
  background-color: #2c64ff;
  // width: 46px;
  width: 46px;
  padding: 0 4px;
  text-align: center;
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
  padding-bottom: 6px;
  position: absolute;
  bottom: 100px;
  left: -46px;
  opacity: 1 !important;
  box-shadow: 0 8px 10px -5px rgba(0 ,0 ,0 , 0.2) , 0 16px 24px 2px rgba(0,0  ,0 , 0.14), 0 6px 30px 5px rgba(0, 0, 0 , 0.12);
  cursor: pointer;

  .text {
    color: #fff;
    font-size: 14px;
    // writing-mode: tb-rl;
    // -webkit-writing-mode: vertical-rl;
    // writing-mode: vertical-rl;
    // margin: 0 auto;
    // text-align: center;
    // text-indent: 4px;
    // line-height:4px
  }

  .num {
    background-color: #f56c6c;
    color: #fff;
    height: 18px;
    line-height: 18px;
    padding: 0 6px;
    border-radius: 10px;
    margin-top: 4px;
    display: inline-block;
  }
}

.carIcon {
  font-size: 18px;
  color: #fff;
  font-weight: bold;
  margin: 6px 0;
}

.content {
  width: 326px;
  height: 100vh;
  background-color: #fff;
  opacity: 0;
  transition: all .3s;
  // padding: 10px;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 0 10px;

    i {
      font-size: 20px;
      font-weight: bold;
      cursor: pointer;
    }
  }

  .body {
    flex: 1;
    margin: 10px 6px;
    max-height: calc(100vh - 20px - 20px - 20px - 128px - 20px);
    overflow: auto;
    padding: 0 10px;
  }

  .footer {
    padding-top: 10px;
    border-top: 1px solid #ccc;

    .category {
      display: flex;
      justify-content: space-around;
      margin: 0 10px;

      .categoryItem {
        text-align: center;

        img {
          width: 32px;
        }

        span {
          font-size: 14px;
        }
      }

      .none {
        filter: grayscale(100%);
      }
    }

    .total {
      margin: 10px 0 6px;
      font-size: 14px;
    }

    .tools {
      display: flex;
      justify-content: space-between;
    }
  }
}

.empty {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 100%;

  i {
    font-size:70px;
  }

  div {
    width: 100%;
    text-align: center;
    font-size: 14px;
    margin-top: 10px;
  }
}

.showContent {
  opacity: 1;
}

.showDrawer {
  right: 0;
  opacity: 1;
}

.fans {
  color: #2c64ff;
  position: relative;
  top: -18px;
  left: 26px;
}

.listItem {
  padding: 0 6px;
  padding-top: 14px;
  transition: all .25s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f5f7fa;

    .deleteButton {
      display: block;
    }
  }
}

.deleteButton {
  color: #F56C6C;
  font-size: 16px;
  height: 18px;
  border: 1px solid #F56C6C;
  border-radius: 50%;
  font-weight: bold;
  margin-bottom: 20px;
  margin-right: 6px;
  cursor: pointer;
  line-height: 18px;
  text-align: center;
  display: none;
}

.grey {
  background-color: rgba(0,0,0,0.1);
  padding: 6px 10px 6px;
  margin-top: 10px;
}
</style>
