<template>
  <div v-loading="loading">
    <ul class="inspiration">
      <li v-for="item in list" :key="item.id" class="inspiration-list">
        <a class="inspiration-list-items" :href="item.url" target="_blank">
          <div class="inspiration-list-items__img">
            <img :src="item.image">
          </div>
          <div class="inspiration-list-items_title text-over-hidden-1">
            {{ item.title }}
          </div>
        </a>
      </li>
    </ul>
    <div v-if="total" class="P-advertisingSkillTablePager">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import { $getContentList } from '@/api/backend-manage'
export default defineComponent({
  props: {},
  setup() {
    const loading = ref(false)
    const list = ref([])
    const total = ref(0)
    const searchData = ref({
        pageNum: 1,
        size: 9,
        type: 2,
        firstCate: 2,
        secondCate: 0,
        onlyPushed: 1
    })
    const getList = () => {
      loading.value = true
      $getContentList(searchData.value).then((re) => {
        loading.value = false
        if (re.code === 1) {
          list.value = re.data
          total.value = re.total
        }
      })
    }
    getList()
    return {
      loading,
      list,
      total,
      searchData,
      getList
    }
  }
})
</script>
<style lang="scss" scoped>
.inspiration {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  &-list {
    width: 33.3%;
    padding-right: 24px;
    box-sizing: border-box;
    margin-bottom: 32px;
    :last-child {
      padding-right: 0px;
    }
    &-items {
      width: 100%;
      &__img {
        position: relative;
        overflow: hidden;
        width: 100%;
        padding-bottom: 61%;
        border-radius: 10px;
        box-shadow: 0 8px 12px rgba(56, 123, 193, 0.1);
      }
      img {
        position: absolute;
        top: 50%;
        left: 0;
        width: 100%;
        height: 100%;
        transform: translateY(-50%);
        object-fit: cover;
      }
      &_title {
        text-align: center;
        margin-top: 16px;
        font-size: $--font-size-extra-large;
        color: #333333;
        &:hover {
          color: $--color-primary;
        }
      }
    }
  }
}
</style>
