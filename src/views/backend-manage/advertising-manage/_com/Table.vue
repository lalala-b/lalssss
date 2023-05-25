<template>
  <div class="table-view">
    <el-table v-loading="loading" :data="tableData" @sort-change="doSort">
      <el-table-column prop="accountId" label="账号ID" width="150">
        <template slot-scope="{ row }">
          {{ row.accountId | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="accountName" label="账号名称" width="170">
        <template slot-scope="{ row }">
          {{ row.accountName | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="accountType" label="账号类型">
        <template slot-scope="{ row }">
          {{ row.accountType | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="platName" label="平台名称">
        <template slot-scope="{ row }">
          {{ row.platName | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="platId" label="平台id">
        <template slot-scope="{ row }">
          {{ row.platId | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="loginName" label="账号登录名" width="120">
        <template slot-scope="{ row }">
          {{ row.loginName | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="loginPassword" label="账号登录密码" width="160">
        <template slot-scope="{ row }">
          {{ row.loginPassword | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="companyType" label="zz/zlj">
        <template slot-scope="{ row }">
          {{ row.companyType | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="useType" label="使用场景">
        <template slot-scope="{ row }">
          {{ useTypeList.get(row.useType) }}
        </template>
      </el-table-column>
      <el-table-column prop="clientId" label="应用ID ">
        <template slot-scope="{ row }">
          {{ row.clientId | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="clientSecret" label="应用秘钥" width="200">
        <template slot-scope="{ row }">
          {{ row.clientSecret | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="callbackUrl" label="回调地址" width="200">
        <template slot-scope="{ row }">
          {{ row.callbackUrl | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="authorizationCode" label="授权码" width="200">
        <template slot-scope="{ row }">
          {{ row.authorizationCode | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="accountToken" label="授权标志token" width="160">
        <template slot-scope="{ row }">
          {{ row.accountToken | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="refreshToken" label="刷新token" width="200">
        <template slot-scope="{ row }">
          {{ row.refreshToken | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="developerUrl" label="开放平台地址" min-width="200">
        <template slot-scope="{ row }">
          <OverPopover :content="row.developerUrl" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column prop="managerUrl" label="后台管理地址" min-width="200">
        <template slot-scope="{ row }">
          <OverPopover :content="row.managerUrl" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column prop="authorizationCodeUrl" label="获取授权码URL" min-width="200">
        <template slot-scope="{ row }">
          <OverPopover :content="row.authorizationCodeUrl" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column prop="getTokenUrl" label="获取tokenURL" min-width="200">
        <template slot-scope="{ row }">
          <OverPopover :content="row.getTokenUrl" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column prop="isDeleted" label="是否删除">
        <template slot-scope="{ row }">
          {{ row.isDeleted ? '已删除' : '未删除' }}
        </template>
      </el-table-column>
      <el-table-column prop="createdTime" label="记录创建时间" width="170">
        <template slot-scope="{ row }">
          {{ row.createdTime | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="updatedTime" label="记录更新时间" width="170">
        <template slot-scope="{ row }">
          {{ row.updatedTime | emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="cookies" label="cookies" min-width="200">
        <template slot-scope="{ row }">
          <OverPopover :content="row.cookies" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column prop="line " label="业务线">
        <template slot-scope="{ row }"> {{ lineList.get(row.line) }} </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="120">
        <template slot-scope="{ row }">
          <OverPopover :content="row.remark" :show-count="40" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="{ row }">
          <template v-if="!row.isDeleted">
            <IconTip
              content="删除"
              icon-class="iconshanchu"
              @click="handleDelete(row)"
            />
            <IconTip
              content="编辑"
              icon-class="iconbianji"
              @click="handleEdit(row)"
            />
          </template>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
    <AddDialog
      v-if="showDialog"
      v-model="showDialog"
      :type="'edit'"
      :detail-data="detailData"
      @success="getList"
      @close="showDialog = false"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $findAdAccountList, $deleteAdAccount } from '@/api/sys'
import { useTableSort } from '@/hook'
import { IconTip, OverPopover } from 'components'
import AddDialog from './AddDialog.vue'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    }
  },
  components: { IconTip, AddDialog, OverPopover },
  setup(props) {
    const { $message, $confirm } = getCurrentInstance().proxy
    const useTypeList = new Map([
      [1, '普通广告主'],
      [2, '账号管家'],
      [4, '一级代理商'],
      [4, '二级代理商'],
      [6, '星图账号']
    ])
    const lineList = new Map([
      [1, '海盗投放'],
      [2, '海盗自营'],
      [4, '乾派商务']
    ])
    const state = reactive({
      showDialog: false,
      total: 0,
      loading: false,
      tableData: [],
      detailData: {}
    })
    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $findAdAccountList({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data || []
            state.total = res.total
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const handleEdit = (row) => {
      state.showDialog = true
      state.detailData = row
    }
    const handleDelete = (row) => {
      $confirm(
        '确认删除账号信息？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        try {
           state.loading = true
          const { code, message } = await $deleteAdAccount({
            id: row.id
          })
          if (+code === 1) {
             state.loading = false
            $message.success('删除成功')
            getList()
          } else {
            state.loading = false
            $message.error(message || '网络错误')
          }
        } catch (e) {
          state.loading = false
          $message.error(e || '网络错误')
        }
      })
    }
    getList()
    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      handleEdit,
      getList,
      ...toRefs(state),
      doSort,
      lineList,
      useTypeList,
      handleDelete
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}
</style>
