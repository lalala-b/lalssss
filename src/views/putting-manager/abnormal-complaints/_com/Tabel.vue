<template>
  <el-table
    v-scrollbar
    :data="tableList"
    @sort-change="doSort"
  >
    <el-table-column
      prop="appealTypeName"
      label="异常类型"
    />
    <el-table-column
      prop="createdTime"
      label="申诉发起时间"
      width="108px"
      sortable="createdTime"
    />
    <el-table-column
      prop="appealStatusName"
      label="申诉单状态"
    />
    <el-table-column
      prop="appealProgressName"
      label="申诉进度"
    />
    <el-table-column
      label="订单信息"
      width="280px"
      align="left"
    >
      <template slot-scope="{row}">
        <AccountCard :info="row">
          <!--  -->
          <p class="account-card__gray">乾数据订单号：{{ row.orderNumber }}</p>
          <p class="account-card__gray">平台订单ID：{{ row.thirdOrderId || '--' }}</p>
        </AccountCard>
      </template>
    </el-table-column>
    <el-table-column
      prop="chargeTypeName"
      label="计费方式"
    />
    <el-table-column
      prop="videoTag"
      label="品牌"
    />
    <el-table-column
      label="视频信息"
      width="400"
      align="left"
    >
      <template slot-scope="{row}">
        <div class="flex">
          <VideoInfo
            v-if="row.videoInfo&&row.videoInfo.titleName"
            :info="row.videoInfo"
            :options="{
              coverImg: 'videoCoverUrl',
              title: 'titleName',
            }"
          />
          <div v-else class="account-card__gray">暂无视频信息</div>
          <VideoList
            v-if="row.videoList && row.videoList.length"
            :list-data="row.videoList"
            :options="{
              coverImg: 'videoCoverUrl',
              title: 'titleName',
            }"
            :compact="true"
            :show-video-count="4"
          />
        </div>
      </template>
    </el-table-column>
    <el-table-column
      prop="prop"
      label="操作"
      fixed="right"
    >
      <template slot-scope="{row}">
        <el-link type="primary" :underline="false" @click="handleTodo(row, 'detail')">查看</el-link>
        <el-link v-if="showEdit(row)" type="primary" :underline="false" class="m-l-5" @click="handleTodo(row, 'edit')">编辑</el-link>
        <el-link v-if="source === 'my' && showCancel(row)" type="primary" :underline="false" class="m-l-5" @click="handleTodo(row, 'cancel')">取消</el-link>
      </template>
    </el-table-column>
    <ComplaintDialog
      v-if="showComplaintDialog"
      v-model="showComplaintDialog"
      :order-number="orderNumber"
      :appeal-id="appealId"
      :type="dialogType"
      @success="$emit('success')"
    />
  </el-table>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { AccountCard, VideoInfo, VideoList } from 'components'
import ComplaintDialog from '../_com//ComplaintDialog.vue'
import { $cancelAppeal } from '@/api/putting-manager'

export default defineComponent({
  props: {
    tableList: {
      type: Array,
      default: () => []
    },
    source: {
      type: 'my' | 'all',
      default: 'my'
    },
    doSort: {
      type: Function,
      default() {}
    }
  },
  components: { AccountCard, VideoInfo, ComplaintDialog, VideoList },
  setup(props, { emit }) {
    const { $confirm, $message } = getCurrentInstance().proxy
    const showComplaintDialog = ref(false)
    const orderNumber = ref(null)
    const appealId = ref(null)
    const dialogType = ref('detail')
    const handleTodo = (row, type = 'detail') => {
      switch (type) {
        case 'detail':
          orderNumber.value = row.orderNumber
          appealId.value = row.appealId
          dialogType.value = 'detail'
          break
        case 'edit':
          orderNumber.value = row.orderNumber
          appealId.value = row.appealId
          if (props.source === 'my') {
            dialogType.value = 'edit'
          } else {
            dialogType.value = 'approval'
          }
          break
        case 'cancel':
          handleCancel(row)
          return
      }
      showComplaintDialog.value = true
    }

    const handleCancel = async(row) => {
      try {
        await $confirm('确定取消?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        const res = await $cancelAppeal({ appealId: row.appealId })
        if (res.code === 1) {
          $message.success('操作成功')
          emit('success')
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
      }
    }

    const showEdit = (row) => {
      if (props.source === 'my') {
        return row.appealStatus === 0
      } else {
        return row.appealStatus !== 3
      }
    }

    const showCancel = (row) => {
      return row.appealStatus === 0 || row.appealStatus === 1
    }

    return {
      showCancel,
      showEdit,
      dialogType,
      appealId,
      orderNumber,
      showComplaintDialog,
      handleTodo
    }
  }
})
</script>
<style lang="scss" scoped>
.account-card__gray {
  font-size: 12px;
  color: $--color-text-secondary;
  width: 100%;
}
::v-deep {
  .account-card__image {
    width: 50px;
    height: 50px;
  }
  .video-info{
    margin-right: 20px;
    &-right{
      width: 200px;
    }
    &-coverImg{
     width: 50px;
      height: 70px;
      border-radius:0;
    }
  }
  .info-coverImg{
    width: 50px;
    height: 70px;
  }
  .flex-wrap {
    flex-wrap: nowrap;
  }
}
</style>
