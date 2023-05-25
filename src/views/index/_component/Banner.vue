<template>
  <el-carousel v-if="bannerList && bannerList.length > 0" ref="carousel" :height="height + 'px'" class="banner" :autoplay="false">
    <el-carousel-item v-for="item in bannerList" :key="item.image">
      <el-image fit="cover" class="banner-img" :src="item.image" @click="handleImgClick(item)" />
    </el-carousel-item>
  </el-carousel>
</template>
<script>
import { defineComponent, getCurrentInstance, ref, onMounted, onUnmounted } from '@vue/composition-api'
import { $getBannerList } from '@/api/home'
import { isArray, throttle } from '@/utils'
import { checkRouter } from '@/router'
export default defineComponent({
  setup() {
    const { $router, $alert } = getCurrentInstance().proxy
    const bannerList = ref([])
    const getBannerList = () => {
      $getBannerList().then(res => {
        if (res.code === 1 && res.data) {
          bannerList.value = res.data.filter(item => {
            if (item.gotoFlag === 0) return true
            return checkRouter(item.url)
          })
          if (isArray(res.data) && res.data.length > 0) {
            setHeight()
          }
        }
      })
    }
    const height = ref(110)
    let s = 0
    const setHeight = () => {
      setTimeout(() => {
        let maxHeight = 0
        document.querySelectorAll('.banner-img').forEach(item => {
          maxHeight = Math.max(maxHeight, item.offsetHeight)
        })
        if (maxHeight === 0 && s < 20) {
          s++
          setTimeout(() => {
            setHeight()
          }, 500)
          return
        }
        if (maxHeight > 0) { height.value = maxHeight - 12 }
      }, 0)
    }
    getBannerList()

    const handleImgClick = (item) => {
      if (item.gotoFlag === 0) {
        window.open(item.url)
      } else {
        $router.push({
          path: item.url,
          params: {
            dismiss404: true
          }
        })
      }
    }

    const thSetHeight = throttle(setHeight, 200)
    onMounted(() => {
      window.addEventListener('resize', thSetHeight)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', thSetHeight)
    })

    return {
      height,
      bannerList,
      handleImgClick
    }
  }
})
</script>

<style lang="scss" scoped>
  .banner {
    &-img {
      width: 100%;
      // height: 100%;
      border-radius: 4px;
    }
  }
</style>
