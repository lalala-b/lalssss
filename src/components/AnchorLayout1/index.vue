<template>
  <div id="root">
    <div id="anchorBefore">
      <slot name="anchorBefore" />
    </div>
    <el-button-group class="buttonGroup">
      <el-button v-for="({ buttonText }, index) in anchor" :key="buttonText" :type="anchorIndex === index ? 'primary': 'default'" @click="handleScroll(index)">
        {{ buttonText }}
      </el-button>
    </el-button-group>
    <div class="body">
      <div v-for="({ buttonText }, index) in anchor" :id="`wrap${index}`" :key="buttonText" class="m-b-10">
        <slot :name="`anchor${index}`" />
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  components: {

  },
  props: {
    anchor: {
      type: Array,
      default() {
        return []
      }
    },
    isTop: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const data = reactive({
      anchorIndex: 0
    })
    const handleScroll = (index) => {
      const el = document.getElementById(`wrap${index}`)
      const appMainEl = document.getElementById(`appMain`)
      appMainEl.scrollTo({
        top: el.offsetTop - (props.isTop ? 40 : 0),
        behavior: 'smooth'
      })
      data.anchorIndex = index
    }

    onMounted(() => {
      const appMainEl = document.getElementById(`appMain`)
      const list = props.anchor.map((_, index) => {
        return document.getElementById(`wrap${index}`).offsetTop
      }).map((item, index, li) => {
        return item - li[0]
      })

      appMainEl.addEventListener('scroll', () => {
        for (let i = 0; i < list.length; i += 1) {
          if (appMainEl.scrollTop < list[i] && i === 0) {
            data.anchorIndex = 0
          } else if (appMainEl.scrollTop >= list[i] && i === list.length - 1) {
            data.anchorIndex = list.length - 1
          } else if (appMainEl.scrollTop >= list[i] && appMainEl.scrollTop < list[i + 1]) {
            data.anchorIndex = i
          }
        }
      })
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
  z-index: 100;
  display: block;
  width: 100%;
  margin-top: 40px;
  transform: translateY(-24px);
}

</style>
