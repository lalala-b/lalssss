<template>
  <div id="root">
    <el-button-group class="buttonGroup">
      <el-button
        v-for="({ buttonText }, index) in anchor"
        :key="buttonText"
        :type="anchorIndex === index ? 'primary' : 'default'"
        @click="handleScroll(index)"
      >
        {{ buttonText }}
      </el-button>
    </el-button-group>
    <div class="body">
      <wrap
        v-for="({ buttonText }, index) in anchor"
        :id="`wrap${index}`"
        :key="buttonText"
        class="m-b-10"
      >
        <slot :name="`anchor${index}`" />
      </wrap>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  onUnmounted,
  getCurrentInstance
} from '@vue/composition-api'

export default defineComponent({
  components: {},
  props: {
    anchor: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props) {
    const { $nextTick } = getCurrentInstance().proxy
    const data = reactive({
      anchorIndex: 0,
      click: false
    })

    let timeout = ''

    const handleScroll = (index) => {
      clearTimeout(timeout)
      data.click = true
      const firstElOffsetTop = document.getElementById(`wrap0`).offsetTop
      const el = document.getElementById(`wrap${index}`)

      const appMainEl = document.getElementById(`appMain`)

      $nextTick(() => {
        appMainEl.scrollTo({
        top: el.offsetTop - firstElOffsetTop,
        behavior: 'smooth'
        })
        data.anchorIndex = index
      })

      timeout = setTimeout(() => {
        data.click = false
      }, 800)
    }

    let appMainEl
    let list = []

    const scroll = () => {
      if (data.click) return
      for (let i = 0; i < list.length; i += 1) {
        if (appMainEl.scrollTop < list[i] && i === 0) {
          data.anchorIndex = 0
        } else if (appMainEl.scrollTop >= list[i] && i === list.length - 1) {
          data.anchorIndex = list.length - 1
        } else if (
          appMainEl.scrollTop >= list[i] &&
          appMainEl.scrollTop < list[i + 1]
        ) {
          data.anchorIndex = i
        }
        // break
      }
    }

    onMounted(() => {
      appMainEl = document.getElementById(`appMain`)

      list = props.anchor
        .map((_, index) => {
          return document.getElementById(`wrap${index}`).offsetTop
        })
        .map((item, index, li) => {
          if (index === 0) {
            return 0
          } else {
            return item - li[0]
          }
        })

      if (appMainEl.scrollTop <= list[0]) {
        data.anchorIndex = 0
      }

      appMainEl.addEventListener('scroll', scroll)
    })

    onUnmounted(() => {
      appMainEl.removeEventListener('scroll', scroll)
    })

    return {
      ...toRefs(data),
      handleScroll
    }
  }
})
</script>

<style lang="scss" scoped>
.buttonGroup {
  position: sticky;
  top: 0px;
  display: block;
  width: 100%;
  background: #f5f5f5;
  padding-top: 24px;
  padding-bottom: 10px;
  transform: translateY(-24px);
  z-index: 2;
}

.body {
  margin-top: -10px;
}

.video-detail {
  &-header {
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    &__fans {
      font-size: 14px;
      color: #d9d9d9;
      .iconfont {
        font-size: 14px;
        margin-right: 4px;
      }
    }
    &__data {
      font-size: 20px;
      color: #272727;
      line-height: 20px;
      > li {
        margin-right: 50px;
      }
      .iconfont {
        margin-right: 5px;
        font-size: 18px;
        color: #d9d9d9;
      }
    }
    ::v-deep {
      .video-info {
        &-coverImg {
          width: 100px;
          height: 134px;
          border-radius: 6px;
          margin-right: 12px;
        }
        &-right__title {
          margin-bottom: 8px;
        }
      }
    }
  }
  &-content {
    padding: 24px;
    > h3 {
      font-size: 14px;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    &__time {
      margin-left: 36px;
      font-size: 12px;
      font-weight: 400;
      color: #595959;
      line-height: 16px;
    }
    &__list {
      > li {
        width: 25%;
        margin-top: 16px;
        font-size: 12px;
        color: #595959;
        line-height: 16px;
      }
    }
  }
  .container {
    > li {
      display: inline-block;
      width: 33.33%;
      margin-top: 16px;
    }
  }
}
</style>
