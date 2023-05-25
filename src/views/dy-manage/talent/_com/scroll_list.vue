<template>
  <div ref="scroll" v-infinite-scroll="getTableData" class="C-scroll" :infinite-scroll-distance="480" :infinite-scroll-disabled="hasLoading">
    <div class="table-view">
      <div class="scroll-header">
        <div class="scroll-header-inner">
          <div
            v-for="(item, index) in headerList"
            :key="index"
            class="scroll-th scroll-row"
            :style="{
              width: tableConfig[index] ? tableConfig[index].width + 'px' : null,
              flex: tableConfig[index] && tableConfig[index].width ? 'initial' : null,
              textAlign: tableConfig[index] ? tableConfig[index].textAlign : null,
            }"
          >
            <p>{{ item.label }}</p>
          </div>
        </div>
      </div>
      <div v-for="(dataItem, dataIndex) in data" :key="`${dataItem.id}-${dataIndex}`" class="scroll-row scroll-content-row">
        <div
          class="scroll-td scroll-cell"
          :style="{
            width: tableConfig[0] ? tableConfig[0].width + 'px' : null,
            flex: tableConfig[0] && tableConfig[0].width ? 'initial' : null,
          }"
        >
          <svg-icon v-if="dataIndex + 1 <= 3" class="level-icon" :icon-class="'level' + (dataIndex + 1)" />
          <span v-else>{{ dataIndex + 1 }}</span>
        </div>
        <div class="scroll-td scroll-cell">
          <AccountCard :info="dataItem" :options="accountOptions" />
        </div>
        <div class="scroll-td scroll-cell">{{ dataItem.fans_num | toThousandsW }}</div>
        <div v-if="type === 'increase_fans'" class="scroll-td scroll-cell">{{ dataItem.add_fans | toThousandsW }}</div>
        <div v-else-if="type === 'like' || type === 'potential'" class="scroll-td scroll-cell">{{ dataItem.add_thumbs_num | toThousandsW }}</div>
        <div class="scroll-td scroll-cell">
          <IconTip icon-class="iconxiangqing" content="查看详情" @click="handleView(dataItem)" />
        </div>
      </div>
      <Loading v-if="hasLoading" />
    </div>
  </div>
</template>
<script>
import Loading from '@/components/Loading/index.vue'
import { AccountCard, IconTip } from 'components'

// function debounce(func, delay) {
//   let timeout
//   return function() {
//     const context = this // 指向全局
//     const args = arguments
//     if (timeout) {
//       clearTimeout(timeout)
//     }
//     timeout = setTimeout(() => {
//       func.apply(context, args) // context.func(args)
//     }, delay)
//   }
// }

// class TableScroll {
//   constructor(target, vm) {
//     if (typeof target === 'string') {
//       this.target = document.querySelector(target)
//     } else if (target instanceof HTMLElement) {
//       this.target = target
//     } else {
//       throw ('target is undefined')
//     }
//     this.vm = vm
//     this.headerTarget = this.target.querySelector('.scroll-header')
//     this.headerTable = this.headerTarget.querySelector('.scroll-header-inner')
//     this.init()
//   }
//   init() {
//     this.scrollNode = document.getElementById('appMain')
//     this.scrollContentNode = this.scrollNode.querySelector('div')
//     this.initEvent()
//   }
//   initEvent() {
//     this.scrollNode.addEventListener('scroll', () => {
//       // throttle(this.scroll, 300)
//       this.fixedHeader()
//     })
//   }
//   // lazyLoad() {
//   //   // const currY = this.target.getBoundingClientRect().y
//   //   const node = this.scrollNode
//   //   const distance = 200
//   //   if (node.scrollTop + node.offsetHeight + distance >= this.scrollContentNode.offsetHeight + 104) {
//   //     console.log('load!!')
//   //     // this.vm.hasLoading = true
//   //     this.vm.getTableData()
//   //   }
//   // }
//   fixedHeader() {
//     const cha = 59
//     const currY = this.target.getBoundingClientRect().y
//     if (currY - cha <= 0) {
//       this.headerTarget.style.height = this.headerTable.getBoundingClientRect().height + 'px'
//       this.headerTable.style.width = this.headerTarget.offsetWidth + 'px'
//       this.headerTable.classList.add('active')
//     } else {
//       this.headerTarget.style.height = 'auto'
//       this.headerTable.style.width = 'auto'
//       this.headerTable.classList.remove('active')
//     }
//   }
// }

const increase_fans = [
  { label: '排名', value: 'ranking' },
  { label: '账号', value: 'account' },
  { label: '粉丝总量', value: 'fans_all' },
  { label: '粉丝增量', value: 'add_fans' },
  { label: '操作', value: 'opera' }
]
const like = [
  { label: '排名', value: 'ranking' },
  { label: '账号', value: 'account' },
  { label: '粉丝总量', value: 'fans_all' },
  { label: '点赞增量', value: 'add_thumbs_num' },
  { label: '操作', value: 'opera' }
]
const potential = [
  { label: '排名', value: 'ranking' },
  { label: '账号', value: 'account' },
  { label: '粉丝总量', value: 'fans_all' },
  { label: '点赞增量', value: 'add_thumbs_num' },
  { label: '操作', value: 'opera' }
]
const fans_all = [
  { label: '排名', value: 'ranking' },
  { label: '账号', value: 'account' },
  { label: '粉丝总量', value: 'fans_all' },
  { label: '操作', value: 'opera' }
]

export default {
  components: {
    AccountCard,
    IconTip,
    Loading
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    this.accountOptions = {
      accountUrl: 'author_url',
      name: 'account_name',
      xingtuUrl: 'xingtu_index_url',
      imgUrl: 'avatar_uri',
      platId: 'plat_id',
      platName: 'plat_name'
    }
    return {
      count: 0,
      hasLoading: false,
      noData: false,
      tableConfig: [
        { width: 60 },
        { textAlign: 'left' },
        null,
        null,
        null
      ]
      // headerList: [
      //   { label: '排名', value: 'ranking' },
      //   { label: '账号', value: 'account' },
      //   { label: '粉丝总量', value: 'fans_all' },
      //   { label: '粉丝增量', value: 'add_fans' },
      //   { label: '操作', value: 'opera' },
      // ],
    }
  },
  computed: {
    headerList() {
      switch (this.type) {
          case 'increase_fans':
            return increase_fans
          case 'like':
            return like
          case 'potential':
            return potential
          case 'fans_all':
            return fans_all
          default:
            return 'increase_fans'
      }
    }
  },
  mounted() {
    // new TableScroll(this.$refs.scroll, this)
  },
  destroyed() {
    console.log('destroyed')
  },
  methods: {
    openXingtu(row) {
      window.open(row.xingtu_index_url)
    },
    load() {

    },
    handleView(row) {
      this.$router.push({
        path: `/details/account/${row.plat_id}/${row.account_id}`,
        query: {
          _blank: true,
          accountType: row.account_type || 30
        }
      })
    },
    handleDyView(row) {
      // console.log(row)
      if (row.author_url) {
        window.open(row.author_url)
      }
      // this.$router.push({
      //   path: `/details/account/${row.plat_id}/${row.account_id}`,
      //   query: {
      //     _blank: true
      //   }
      // })
    },
    getTableData() {
      // 没有更多数据了
      if (this.noData) {
        return
      }
      this.hasLoading = true
      this.count += 1
      this.$emit('getData', this.count, null, () => {
        // this.hasLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  // #appMain {
  //   overflow: initial;
  // }

  .C-scroll {
    // overflow-y: auto;
    // height: 480px;
    .level-icon {
      font-size: 32px;
    }
    .scroll-header-inner, .scroll-row {
      display: flex;
      > * {
        flex: 1;
      }
    }
    .scroll-content-row {
      transition: .25s;
      border-bottom: 1px solid $--border-color-lighter;
      background-color: #fff;
      &:hover {
        background-color: rgb(242, 242, 242);
      }
    }
    .scroll-header {
      position: sticky;
      top: -24px;
      &-inner {
        background-color: #f5f5f5;
        &.active {
          z-index: 2;
          top: 60px;
          position: fixed;
          border-bottom: 1px solid #eee;
        }
      }
      .scroll-th {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        padding: 14px 16px;
      }
    }
    .scroll-cell {
      min-height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 6px;
      ::v-deep {
        .iconfont {
          font-size: 19px;
          color: $--color-primary;
        }
      }
    }
    .test {
      p {
        line-height: 100px;
      }
    }
    .cell {
      text-align: center;
    }
    .flex {
      display: flex;
      width: 100%;
      // justify-content: center;
      &:hover {
        .info-name {
          color: $--color-primary;
        }
      }
      &-avater {
        width: 32px;
        img {
          width: 100%;
          display: block;
          border-radius: 50%;
        }
      }
      &-icon {
        cursor: pointer;
      }
      &-info {
        display: flex;
        align-items: center;
        // justify-content: center;
        // flex-direction: column;
        margin-left: 12px;
        font-size: 18px;
        > p {
          margin-bottom: 10px;
        }

        .info-name {
          cursor: pointer;
          font-size: 14px;
          text-align: left;
          margin: 0;
          margin-right: 2px;
          padding: 0;
          // width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
