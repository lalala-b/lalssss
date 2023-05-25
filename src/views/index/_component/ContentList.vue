<template>
  <Wrap class="flex flex1 flex-dir-col">
    <Head title="内容创作" :has-active="false" />
    <ul class="flex1 flex flex-dir-col flex-justify-between">
      <li
        v-for="item in list"
        :key="item.typeName"
        class="content-list-item flex flex-align-center m-b-16"
      >
        <strong>{{ item.typeName }}</strong>
        <div class="flex flex1 text-over-hidden">
          <a v-for="t in item.typeContent" :key="t.newsName" class="text-over-hidden" :href="t.newsUrl" target="_blank">
            {{ t.newsName }}
          </a>
        </div>
      </li>
    </ul>
  </Wrap>
</template>
<script>
import Head from './_com/Head'
export default {
  components: {
    Head
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .content {
    &-list {
      &-item {
        height: 24px;
        &:last-child {
          margin-bottom: 0;
        }
        strong {
          flex-shrink: 0;
          font-size: 14px;
          margin-right: 16px;
        }
        a {
          position: relative;
          padding-right: 24px;
          color: #BFBFBF;
          &:hover {
            color: $--color-primary;
          }
          &::after {
            content: "";
            position: absolute;
            right: 12px;
            top: 50%;
            height: 18px;
            width: 1px;
            background: #D8D8D8;
            transform: translateY(-50%);
          }
          &:last-child {
            &::after {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
