<template>
  <el-dialog
    :visible="show"
    title="请选择最终合作的账号"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-row class="m-b-20">
      <el-col :span="12">
        <span>客户名称：</span>
        <span>{{ (data || {}).companyName || '--' }}</span>
      </el-col>

      <el-col :span="12">
        <span>需求描述：</span>
        <span>{{ (data || {}).requirementDesc || '--' }}</span>
      </el-col>
    </el-row>

    <div>
      <el-table ref="table" v-scrollbar v-loading="listLoading" :data="list.filter(item => deleteIds.findIndex(it => it === item.id) < 0)" max-height="250" @selection-change="handleSelect">
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column label="合作类型" prop="coopType">
          <template slot-scope="{ row }">
            {{ row.coopType || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="平台" prop="platName" />
        <el-table-column label="账号" prop="accountName">
          <template slot="header">
            <span>账号</span>
            <IconTip
              content="若列表中找不到对应账号，请检查账号是否已添加至推荐账号当中"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, computed, watch } from '@vue/composition-api'
import { IconTip } from 'components'
import { $getFinalAccountList, $chooseFinalAccount } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    selectArr: {
      type: Array,
      default: () => []
    },
    deleteArr: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $confirm, $router, $refs, $nextTick } = getCurrentInstance().proxy

    const showDialog = computed(() => props.show)

    const sel = computed(() => props.selectArr)

    const deleteIds = computed(() => props.deleteArr)

    const state = reactive({
      listLoading: false,
      btnLoading: false,
      list: [],
      selected: []
    })

    watch(showDialog, (val) => {
      if (val) {
        getList()
      } else {
        state.selected = []
        $refs.table.clearSelection()
      }
    })

    watch(sel, (val) => {
    }, { immediate: true, deep: true })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      if (props.type === 'confirm') {
        const arr = []
        sel.value.forEach(item => {
          if (state.selected.findIndex(it => it.id === item.id) < 0) {
            arr.push(item)
          }
        })
        if (arr.length) {
          $confirm(`确定将账号：${arr.map(item => item.accountName).join(', ')}<br>从最终合作账号中删除吗？删除后，对应已生成的工单也将被清除且不可恢复，确定要取消吗？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }).then(() => {
            emit('choose', state.selected)
            handleClose()
          })
        } else {
          emit('choose', state.selected)
          handleClose()
        }
      } else {
        chooseFinalAccount()
      }
    }

    const handleSelect = (val) => {
      state.selected = val
    }

    const getList = async() => {
      state.listLoading = true
      try {
        const { code, data, message } = await $getFinalAccountList({
          opportunityId: props.data.opportunityId
        })
        if (+code === 1) {
          state.list = data || []

          state.selected = state.list.map(item => {
            if (props.selectArr.findIndex(it => it.id === item.id) > -1) {
              return item
            } else {
              return null
            }
          }).filter(item => item)

          $refs.table.clearSelection()

          $nextTick(() => {
            state.selected.forEach(item => {
              $refs.table.toggleRowSelection(item)
            })
          })
        } else {
          $message.error(message || '网络错误')
        }
        state.listLoading = false
      } catch (e) {
        state.listLoading = false
        $message.error(e || '网络错误')
      }
    }

    const chooseFinalAccount = async() => {
      state.btnLoading = true

      try {
        const { code, message } = await $chooseFinalAccount({
          idList: state.selected.map(({ id }) => id),
          opportunityId: props.data.opportunityId,
          confirmFlag: 1
        })
        if (+code === 1) {
          $message.success(props.type === 'confirm' ? '选择成功' : '确认成功')
          emit('getList')
          handleClose()
          if (props.type !== 'confirm') {
            $confirm('是否立即创建商单？', '', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'success'
            }).then(() => {
              const routeUrl = $router.resolve({
                path: '/bussiness-manage/bill-manage',
                query: {
                  type: 'create',
                  id: props.data.opportunityId
                }
              })
              window.open(routeUrl.href, '_self')
            })
          }
        } else {
          $message.error(message || '网络错误')
        }
        state.btnLoading = false
      } catch (e) {
        state.btnLoading = false
        $message.error(e || '网络错误')
      }
    }

    return {
      ...toRefs(state),
      handleClose,
      handleConfirm,
      handleSelect,
      deleteIds
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
