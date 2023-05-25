<template>
  <el-select
    v-model="selectData"
    class="account-search"
    filterable
    remote
    reserve-keyword
    placeholder="请输入关键词"
    :remote-method="remoteMethod"
    :loading="loading"
    :popper-append-to-body="false"
    no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
    value-key="eid"
    @change="handleAccountChange"
  >
    <el-option v-for="(item) in accountList" :key="item.user_id" :label="item.user_name" :value="item">
      <flex-row>
        <img class="account-img" :src="item.avatar_uri" alt="">
        <div class="account-info">
          <p class="account-text1 account-name">{{ item.user_name }}</p>
          <p class="account-text2">ID:{{ item.eid }}</p>
        </div>
        <div class="account-info account-fans">
          <p class="account-text1">粉丝量</p>
          <p class="account-text2">{{ item.fans_num | toThousandsW }}</p>
        </div>
      </flex-row>
    </el-option>
  </el-select>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import { $getBaseInfo } from '@/api/account-manage'

export default defineComponent({
  props: {
    platId: Number | String,
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const selectData = computed({
      get: () => props.value,
      set: (val) => emit('input', val)
    })
    const accountList = ref([])
    const loading = ref(false)
    const handleAccountChange = function(val) {
      emit('change', val)
    }

    const remoteMethod = function(query) {
      if (query !== '') {
        loading.value = true
        getBaseInfo(query)
      } else {
        accountList.value = []
      }
    }

    const getBaseInfo = function(keyword) {
      $getBaseInfo({
        keyword,
        platId: props.platId
      }).then(res => {
        if (res.code === 1) {
          accountList.value = res.data
        }
        loading.value = false
      })
    }

    return {
      loading,
      selectData,
      accountList,
      handleAccountChange,
      remoteMethod
    }
  }
})
</script>

<style lang="scss" scoped>

.account-search {
  width: 100%;
  .el-select-dropdown {
    .el-select-dropdown__item {
      height: auto !important;
      line-height: 1.2 !important;
      padding: 10px;
      .flex-row > * {
        margin: initial;
      }
      .account-img {
        width: 40px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .account-info {
        display: flex;
        flex: 1;
        justify-content: center;
        flex-direction: column;
        // align-items: center;
        margin-right: 10px;
      }
      .account-fans {
        flex: initial;
        width: 80px;
      }
      .account-text1 {
        font-size: 14px;
      }
      .account-text2 {
        font-size: 12px;
        margin-top: 6px;
      }
      .account-name {
        font-weight: bold;
        width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
