<template>
  <div class="flex">
    <ul v-if="pictureList && pictureList.length > 0" class="flex flex-wrap">
      <li
        v-for="(item,index) in pictureList"
        :key="index"
        class="m-r-10 video-list-item"
      >
        <el-image class="info-coverImg" fit="cover" :src="item" @click="handleShowDialog(item)">
          <img slot="error" class="image-slot" :src="defaultImg">
        </el-image>
      </li>
    </ul>
    <p v-else>暂无截图信息</p>
    <slot name="more" />
    <el-dialog
      title="查看大图"
      :visible.sync="show"
      width="400px"
      :before-close="handleClose"
    >
      <el-image class="info-coverImg-inner" fit="cover" :src="imgSrc">
        <img slot="error" class="image-slot" :src="defaultImg">
      </el-image>
    </el-dialog>
  </div>
</template>
<script>
import import_dialog from '@/views/putting-manager/putting-order/_component/list/import_dialog.vue'
import { defineComponent, reactive, toRefs } from '@vue/composition-api'

import defaultImg from '../VideoInfo//img/default_video.png'

export default defineComponent({
  components: { import_dialog },
  props: {
    pictureList: {
      type: Array,
      default: () => []
    }
  },
  setup(props, { emit }) {
    const states = reactive({ show: false, imgSrc: '' })
    const handleShowDialog = (item) => {
      states.imgSrc = item
      states.show = true
    }
    const handleClose = () => {
      states.show = false
    }
    return {
      ...toRefs(states),
      defaultImg,
      handleClose,
      handleShowDialog
    }
  }
})
</script>
<style lang="scss" scoped>
.info-coverImg {
  width: 50px;
  height: 70px;
  border-radius: 4px;
  img {
    width: 100%;
    height: 100%;
  }
}
.info-coverImg-inner {
  width: 353px;
  height: auto;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
