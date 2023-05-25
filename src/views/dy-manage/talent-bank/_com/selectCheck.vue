<template>
  <div class="select-box">
    <el-dropdown
      ref="dropdown"
      trigger="click"
      placement="bottom-start"
      @visible-change="toggleDropdown"
    >
      <div
        :class="`el-dropdown-link flex flex-align-center ${
          selectItem.selectValue ? 'blue-tip' : ''
        }`"
        @click="handleShow"
      >
        <div>{{ selectItemData.label }}</div>
        <i class="el-icon-arrow-down el-icon--right" />
      </div>
      <el-dropdown-menu slot="dropdown" :hide-on-click="false">
        <div class="search-item">
          <div class="search-item-tag tag-box" :class="tagOpen ? 'open' : ''">
            <div v-for="(item, index) in tagValueList" :key="index">
              <template v-if="(item.childNodeTags || []).length">
                <el-popover
                  :key="item.md5Id"
                  placement="bottom"
                  trigger="hover"
                >
                  <template v-for="it in item.childNodeTags">
                    <el-checkbox
                      :key="`${it.md5Id}_${it.tagId}`"
                      class="m-b-10"
                      :value="
                        tagCheckList.findIndex((i) => i.tagId === it.tagId) > -1
                          ? true
                          : false
                      "
                      @change="handleChangeChildTags(it, item)"
                    >{{ it.tagName }}</el-checkbox>

                    <br :key="it.md5Id">
                  </template>

                  <el-tag
                    slot="reference"
                    v-log
                    :effect="contentTagEffect[item.md5Id] || 'plain'"
                    :type="
                      contentTagType[item.md5Id] === 'notInfo' ? '' : 'info'
                    "
                    size="small"
                    class="tag m-b-10"
                    @click.stop="handleClickParentTag(item)"
                  >
                    {{ item.tagName }}
                  </el-tag>
                </el-popover>
              </template>
              <template v-else>
                <el-tag
                  :key="item.md5Id"
                  v-log
                  :effect="
                    !tagCheckList.length && item.tagName === '全部'
                      ? 'dark'
                      : tagCheckList.findIndex((i) => i.tagId === item.tagId) >
                        -1
                        ? 'dark'
                        : 'plain'
                  "
                  :type="
                    !tagCheckList.length && item.tagName === '全部'
                      ? 'dark'
                      : tagCheckList.findIndex((i) => i.tagId === item.tagId) >
                        -1
                        ? ''
                        : 'info'
                  "
                  size="small"
                  class="tag m-b-10"
                  @click.stop="handleClickParentTag(item)"
                >
                  {{ item.tagName }}
                </el-tag>
              </template>
            </div>
          </div>
          <div class="search-right">
            <span
              @click="tagOpen = !tagOpen"
            >{{ tagOpen ? "收起" : "展开" }}
              <i :class="tagOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" />
            </span>
          </div>
        </div>
        <div class="flex flex-justify-between m-t-12">
          <el-link
            size="small"
            type="primary"
            class="m-l-16"
            :underline="false"
            @click="handleReset"
          >重置</el-link>
          <div>
            <!-- <el-button
              size="small"
              type="default"
              class="reset m-r-8"
              @click="handleCancel"
            >取消</el-button>
            <el-button
              size="small"
              type="primary"
              class="reset m-r-12"
              @click="handleConfirm"
            >确认</el-button> -->
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import {
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import IconTip from '@/components/IconTip'
import { getCurrentInstance } from '@vue/composition-api'
export default defineComponent({
  props: {
    dataList: {
      type: Array,
      default() {
        return []
      }
    },
    selectItemData: {
      type: Object,
      default() {
        return {}
      }
    },
    tagInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    tagValueList: {
      type: Array,
      default() {
        return []
      }
    },
    defaultValue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy
    const states = reactive({
      tagOpen: false, // 内容类别展开关闭
      isTagCheck: false, // 内容类别多选
      tagCheckList: [],
      tagIndex: 0,
      contentTagEffect: {},
      contentTagType: {},
      closeFlag: true,
      selectItem: {
        selectValue: '',
        tagsIds: [], // 一级节点
        tagsIdsLevelTwo: [], // 二级节点
        tagCheckList: []
      }
    })
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      (val) => {
        if (val && val.value) {
          states.selectItem.selectValue = val.value.selectValue
          if (val.value.selectValue) {
            states.tagCheckList = val.value.tagCheckList
            formatTagCheckList(val.value.tagCheckList || [])
            // if (val.value.tagsIds && val.value.tagsIds.length) {
            //   val.value.tagsIds.forEach(item => {
            //     const iteminfo = val.value.tagCheckList.find(_item => +_item.tagId === +item) || {}
            //     checkEffectAndType(states.tagCheckList, iteminfo)
            //   })
            // }
            val.value.tagCheckList.forEach((item) => {
              if (item.tagLevel === 1) {
                checkEffectAndType(states.tagCheckList, item)
              }
              if (item.tagLevel === 2 && item.parent) {
                checkEffectAndType(states.tagCheckList, item.parent)
              }
            })
          }
        }
      },
      { deep: true, immediate: true }
    )
    const handleCancel = () => {
      states.closeFlag = false
      $refs.dropdown.visible = false
    }
    // const handleConfirm = () => {
    //   states.closeFlag = false
    //   handleCancel()
    // }
     // 点击菜单可收起
    const handleShow = () => {
      if ($refs.dropdown.visible) {
        states.closeFlag = false
      } else {
        states.closeFlag = true
        $refs.dropdown.visible = true
      }
    }
    // 重置
    const handleReset = (close) => {
      states.tagOpen = false
      states.isTagCheck = false
      states.selectItem.selectValue = ''
      states.tagIndex = 0
      states.tagCheckList = []
      states.contentTagEffect = {}
      states.contentTagType = {}
      if (close === true) return
      emit('updateSearch')
      handleCancel()
    }

    const handleClickParentTag = (parent) => {
      if (parent.tagName === '全部') {
        states.tagOpen = false
        states.isTagCheck = false
        states.selectItem.selectValue = ''
        states.tagIndex = 0
        states.tagCheckList = []
        states.contentTagEffect = {}
        states.contentTagType = {}
        emit('updateSearch')
        return
      }
      let tagCheckList = [...states.tagCheckList]
      if ((parent.childNodeTags || []).length) {
        let checkNum = 0
        parent.childNodeTags.forEach((item) => {
          const index = tagCheckList.findIndex((it) => it.tagId === item.tagId)
          if (index <= -1) {
            tagCheckList.push({ ...item, parent })
          } else {
            checkNum++
          }
        })
        tagCheckList.push(parent)
        // 已经全选, 去除全选
        if (checkNum === parent.childNodeTags.length) {
          parent.childNodeTags.forEach((item) => {
            const parentIndex = tagCheckList.findIndex(
              (it) => it.tagId === parent.tagId
            )
            if (parentIndex !== -1) {
              tagCheckList[parentIndex] = ''
            }
            const index = tagCheckList.findIndex(
              (it) => it.tagId === item.tagId
            )
            tagCheckList[index] = ''
          })
        }

        tagCheckList = tagCheckList.filter((item) => item)

        checkEffectAndType(tagCheckList, parent)
      } else {
        const index = tagCheckList.findIndex((it) => it.tagId === parent.tagId)
        if (index <= -1) {
          tagCheckList.push(parent)
        } else {
          tagCheckList.splice(index, 1)
        }
      }
      formatTagCheckList(tagCheckList)
    }
    const handleChangeChildTags = (child, parent) => {
      const tagCheckList = [...states.tagCheckList]
      const index = tagCheckList.findIndex(
        (item) => item.tagId === child.tagId
      )
      if (index > -1) {
        tagCheckList.splice(index, 1)
      } else {
        const child1 = { ...child, parent }
        tagCheckList.push(child1)
      }
      const indexOfParent = tagCheckList.findIndex(
        (it) => it.tagId === parent.tagId
      )
      const res = checkEffectAndType(tagCheckList, parent)

      if (!res && indexOfParent !== -1) {
        tagCheckList.splice(indexOfParent, 1)
      } else if (res && indexOfParent === -1) {
        tagCheckList.push(parent)
      }
      formatTagCheckList(tagCheckList)
    }
    // 格式化tagCheckList，获取tags展示文案，获取tagsIds及tagsIdsLevelTwo
    const formatTagCheckList = (tagCheckList) => {
      states.tagCheckList = tagCheckList
      const contentArr = []
      const tagsIds = []
      const tagsIdsLevelTwo = []
      const tagsIdscopy1 = []
      let tagsIdsLevelCopy = []
      states.tagCheckList.forEach((item) => {
        if (item.tagLevel === 1) {
          tagsIds.push(item.tagId)
          tagsIdscopy1.push(item)
        } else {
          tagsIdsLevelTwo.push(item.tagId)
          tagsIdsLevelCopy.push(item)
        }
      })
      //  如果一级标签已经被选中，则去除一级列表下面的二级标签
      tagsIdscopy1.forEach((item) => {
        if (!item.childNodeTags) return
        item.childNodeTags.forEach((_item) => {
          const index = tagsIdsLevelCopy.findIndex(
            (it) => it.tagId === _item.tagId
          )
          if (index > -1) {
            tagsIdsLevelCopy[index] = ''
          }
        })
      })
      // 去除空
      tagsIdsLevelCopy = tagsIdsLevelCopy.filter((item) => item)
      const listContent = [...tagsIdscopy1, ...tagsIdsLevelCopy]
      // 将处理后的全部标签进行格式化处理，一级标签+'全部'
      listContent.forEach((item) => {
        if (item.childNodeTags && item.childNodeTags.length) {
          contentArr.push(item.tagName + '（全部）')
        } else {
          contentArr.push(
            item.tagName + `${item.parent ? `(${item.parent.tagName})` : ''}`
          )
        }
      })
      if (!states.tagCheckList.length) {
        handleReset()
      } else {
        states.selectItem.selectValue = contentArr
          .map((item) => item.replace(/^\s+|\s+$/g, ''))
          .join('，')
        states.selectItem.tagsIds = tagsIds
        states.selectItem.tagsIdsLevelTwo = tagsIdsLevelTwo
        states.selectItem.tagCheckList = states.tagCheckList
        emit('updateSearch', states.selectItem)
      }
    }
    const checkEffectAndType = (tagCheckList, parent) => {
      let checkNum = 0;
      (parent.childNodeTags || []).forEach((item) => {
        if (tagCheckList.findIndex((it) => it.tagId === item.tagId) > -1) {
          checkNum++
        }
      })

      let flag = false

      if ((parent.childNodeTags || []).length) {
        if (checkNum === 0) {
          states.contentTagEffect[parent.md5Id] = 'plain'
          states.contentTagType[parent.md5Id] = ''
        } else if (checkNum < parent.childNodeTags.length) {
          states.contentTagEffect[parent.md5Id] = 'light'
          states.contentTagType[parent.md5Id] = 'notInfo'
        } else if (checkNum === parent.childNodeTags.length) {
          states.contentTagEffect[parent.md5Id] = 'dark'
          states.contentTagType[parent.md5Id] = 'notInfo'
          flag = true
        }
      }

      return flag
    }
    const toggleDropdown = (val) => {
      if (!val && states.closeFlag) {
        $refs.dropdown.visible = true
      }
    }

    const domClick = (event) => {
      const dropdown = $refs.dropdown?.$el
      if (!dropdown) return
      if (!dropdown?.contains(event.target)) {
        states.closeFlag = false
        $refs.dropdown.visible = false
      }
    }
    onMounted(() => {
      document.addEventListener('click', domClick)
    })
    onUnmounted(() => {
      document.removeEventListener('click', domClick)
    })
    return {
      ...toRefs(states),
      handleReset,
      handleShow,
      handleCancel,
      handleClickParentTag,
      handleChangeChildTags,
      toggleDropdown
    }
  }
})
</script>

<style lang="scss" scoped>
.blue-tip {
  color: #2c64ff;
}
.search-item {
  display: flex;
  padding-left: 16px;
  align-items: flex-start;
  line-height: 30px;
  width: 800px;
  .search-item-title {
    line-height: 24px;
    text-align: justify;
    text-align-last: justify;
    margin-right: 10px;
    flex-shrink: 0;
    width: 70px;
    color: #000;
  }
  .search-item-tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    line-height: 24px;
    height: 24px;
  }
  .custom-input {
    display: flex;
    align-items: center;
    .el-input {
      margin: 0 10px;
    }
  }
  .tag {
    margin-right: 10px;
    margin-bottom: 0;
    cursor: pointer;
  }
  .m-b-10 {
    margin-bottom: 10px;
  }
  .search-right {
    flex-shrink: 0;
    > span {
      color: rgb(24, 144, 255);
      line-height: 30px;
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .tag-box {
    overflow: hidden;
    height: 30px;
    &.open {
      height: auto;
    }
    .el-checkbox {
      margin-right: 10px;
    }
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.drop {
  padding: 0 12px;
}
</style>
