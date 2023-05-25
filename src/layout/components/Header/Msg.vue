<template>
  <div class="M-layoutMsg">
    <i class="iconfont icontongzhi" :class="msgClass" @click="onShowMsg" />
    <el-dialog
      v-if="msgListStatus"
      title="提示"
      width="60%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :visible.sync="msgListStatus"
      :before-close="handleClose"
    >
      <div class="M-layoutMsgList">
        <ul v-if="items && items.length > 0">
          <li v-for="(item, i) in items" :key="item.art_id">
            <em>{{ i+1 }}</em><span>{{ item.content }}</span>
          </li>
        </ul>
      </div>
      <div class="M-layoutMsgFooter">
        <el-link
          type="primary"
          :underline="false"
          @click="goAllMsg"
        >查看全部消息</el-link>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Cache from '@/utils/cache'
import { is } from '@/components/common'
import { $getUserMsgList, $readUserNotice } from '@/api/index'

// 页面缓存实例
const MSG_CACHE = new Cache({
  prefix: '_MSG_',
  type: 1
})

/**
 * 一次获取的公告数量
 * @type {Number}
 */
const MSG_COUNT = 3

/**
 * 轮询时间间隔
 * @type {Number}
 */
const QUEUE_DELAY = 100000

/**
 * 是否允许轮询
 * @type {Boolean}
 */
const IS_ENABLE_QUEUE = true

export default {
  data() {
    return {
      items: [],
      // 浮层状态
      msgListStatus: false
    }
  },
  computed: {
    // 小铃铛样式
    msgClass() {
      return this.items.length > 0 ? 'default' : 'bell'
    }
  },
  mounted() {
    this.timer = null
    // 轮询间隔
    this.delay = QUEUE_DELAY
    this.isEnableQueue = IS_ENABLE_QUEUE
    this.req = null

    var first = MSG_CACHE.get('first')
    this.firstBlood = is(first, 'boolean') && first

    // 看的到顶部到情况下尝试加载一次
    this.load().then(re => {
      if (this.firstBlood) {
        MSG_CACHE.set('first', false)
      }
      this.firstBlood = false
    }, err => {
      this.firstBlood = false
    })
  // }
  },
  methods: {
  /**
         * 图标点击响应函数
         */
    onShowMsg() {
      if (!this.items.length) {
        return
      }
      this.msgListStatus = true
    },
    /**
         * 浮层关闭响应函数
         */
    handleClose(done) {
      this.$nextTick(() => {
        this.allRead()
        this.items = []
      }, 200)
      if (done) {
        done()
      }
    },
    /**
     * 全部已读
     */
    allRead() {
      $readUserNotice()
    },
    /**
     * 消息查询
     */
    load() {
      // if (!this.user.muid) return
      this.pure()

      return $getUserMsgList({
        size: MSG_COUNT,
        onlyUnread: 1
      }).then(re => {
        if (re.code === 1) {
          this.items = re.data.map(item => {
            if (item.content && item.content.length > 50) {
              item.content = `${item.content.substr(0, 50)}...`
            }
            return item
          })
          if (this.firstBlood && this.items.length) {
            this.msgListStatus = true
          }
        }
        if (this.isEnableQueue) {
          this.timer = setTimeout(() => {
            this.load()
          }, this.delay)
        }
      }).catch(() => {
        this.timer = setTimeout(() => {
          this.load()
        }, this.delay)
      })
    },
    /**
     * 请求清理
     */
    pure() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    goAllMsg() {
      this.msgListStatus = false
      this.handleClose()
      this.$go('/announcements?at=1')
    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .el-dropdown  {
      color: inherit;
    }
  }
  .iconfont {
    width: 22px;
    height: 22px;
    font-size: 22px;
    margin-right: 32px;
    color: inherit;
  }
</style>
