<template>
  <el-dialog
    title="关联抵扣的工单"
    :visible.sync="show"
    :before-close="handleClose"
    :append-to-body="true"
    :close-on-click-modal="false"
    width="900px"
  >
    <div>
      <div v-if="!isDetail" class="flex m-b-20">
        <span class="m-r-10 addTitle">请输入一起抵扣的订单的工单号</span>
        <div class="m-r-10 inputBox">
          <el-input v-model="workerId" placeholder="请输入工单号" clearable @input="handleInputWorkerId" @keydown.enter.native="handleAddDeductionWork" />
          <div v-show="showError" class="error">{{ errorText }}</div>
        </div>
        <el-button type="primary" plain :loading="addButtonLoading" @click="handleAddDeductionWork">添加</el-button>
      </div>
      <div class="p-t-20 m-b-20">
        <el-table
          v-scrollbar
          v-loading="tableLoading"
          :data="tableData"
          max-height="250"
        >
          <el-table-column label="工单号">
            <template slot-scope="{ row }">
              {{ (+currentId === +row.workId ? `${row.workId}（当前工单）` : row.workId) | emptyFill }}
            </template>
          </el-table-column>

          <el-table-column label="订单名称">
            <template slot-scope="{ row }">
              {{ [row.brandName, row.quotientName].filter(item => item).join('-') | emptyFill }}
            </template>
          </el-table-column>

          <el-table-column prop="workerStatus" label="工单状态" align="center" width="110px">
            <template slot-scope="{ row }">
              {{
                orderStatusMap.get(row.workerStatus)
                  ? orderStatusMap.get(row.workerStatus)
                  : '--'
              }}
            </template>
          </el-table-column>

          <el-table-column label="账号信息" width="200" align="left">
            <template slot-scope="{ row }">
              <div class="flex flex-align-center">
                <AccountCard :info="row">
                  <template slot="last">
                    <div v-if="row.upUpNameAndLeader" style="text-align: left">
                      <el-tag size="mini" type="danger">{{
                        row.upUpNameAndLeader
                      }}</el-tag>
                    </div>
                  </template>
                </AccountCard>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="已定档期"
            align="center"
            prop="finishTimeConfirm"
            width="110px"
          >
            <template slot-scope="{ row }">
              {{ row.finishTimeConfirm | emptyFill }}
            </template>
          </el-table-column>

          <el-table-column label="应收金额">
            <template slot-scope="{ row }">
              {{ row.collectionMoneyIn | emptyFill }}
            </template>
          </el-table-column>

          <el-table-column label="应付金额">
            <template slot-scope="{ row }">
              {{ row.collectionMoneyOut | emptyFill }}
            </template>
          </el-table-column>

          <el-table-column v-if="!isDetail" label="操作" width="80px">
            <template slot-scope="{ row }">
              <el-button v-if="+currentId !== +row.workId" type="text" class="errorButton" @click="handleDeleteDeductionWork(row.workId)">删除</el-button>
            </template>
          </el-table-column>

        </el-table>
      </div>
      <div slot="footer" class="flex flex-justify-end">
        <el-button @click="handleClose">{{ isDetail ? '关 闭' : '取 消' }}</el-button>
        <el-button
          v-if="!isDetail"
          type="primary"
          :loading="btnLoading"
          @click="handleSave"
        >保 存</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  computed,
  ref,
  toRefs,
  onMounted,
  watch
} from '@vue/composition-api'
import {
  $deductionFindChildWorkOrder,
  $deductionAddChildWorkOrder,
  $deductionAddOrUpdateChildWorkOrder
} from '@/api/sign-contract'
import { AccountCard } from 'components'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    belongType: {
      type: Number
    },
    parentId: {
      type: String | Number
    },
    currentId: {
      type: String | Number
    },
    currentItem: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const { $message, $confirm } = getCurrentInstance().proxy

    const isDetail = computed(() => props.type === 'detail')

    const states = reactive({
      typeList: [],
      btnLoading: false,
      workerId: '',
      showError: false,
      errorText: '',
      addButtonLoading: false,
      orderStatusMap: new Map([
        [0, '商业信息待录入'],
        [1, '待履约'],
        [2, '已履约'],
        [3, '已核账'],
        [4, '撤单']
      ]),
      tableData: [],
      tableLoading: false
    })

    watch(() => props.show, (val) => {
      if (val) {
        // 添加时请求当前工单信息
        if (props.type === 'add') {
          const { currentId, belongType } = props
          deductionFindChildWorkOrder({ parentId: '', currentWorkId: currentId, belongType, childWorkIdList: [currentId] })
        } else {
          const { currentId, parentId, belongType } = props
          deductionFindChildWorkOrder({ parentWorkId: parentId, currentWorkId: currentId, belongType })
        }
      } else {
        states.tableData = []
        states.workerId = ''
        states.errorText = ''
        states.showError = false
      }
    })

    watch(() => states.workerId, (val) => {
      if (!val) {
        states.errorText = ''
        states.showError = false
      }
    })

    const deductionFindChildWorkOrder = async(params) => {
      states.tableLoading = true
      try {
        const { code, data, message } = await $deductionFindChildWorkOrder(params)
        states.tableLoading = false
        if (+code === 1) {
          states.tableData = data.map(item => {
            const newItem = { ...item }

            if (props.type === 'detail' || !Object.keys(props.currentItem || {}).length) return newItem

            if (+item.workId === +props.currentId) {
              newItem.paymentType = props.currentItem.paymentType
              newItem.collectionMoney = props.currentItem.collectionMoney
              if (+props.currentItem.paymentType === 2) {
                newItem.collectionMoneyIn = props.currentItem.collectionMoney
                newItem.collectionMoneyOut = ''
              } else if (+props.currentItem.paymentType === 1) {
                newItem.collectionMoneyOut = props.currentItem.collectionMoney
                newItem.collectionMoneyIn = ''
              }
            }
            return newItem
          })
        }
      } catch (e) {
        states.tableLoading = false
        $message.error(e)
      }
    }

    const computedTotalMoney = async() => {
      if (!(states.tableData || []).length) {
        if (props.type === 'add') {
          const { currentId, belongType } = props
          await deductionFindChildWorkOrder({ parentId: '', currentWorkId: currentId, belongType, childWorkIdList: [currentId] })
        } else {
          const { currentId, parentId, belongType } = props
          await deductionFindChildWorkOrder({ parentWorkId: parentId, currentWorkId: currentId, belongType })
        }
      }

      states.tableData = states.tableData.map(item => {
        const newItem = { ...item }
        if (+item.workId === +props.currentId) {
          newItem.paymentType = props.currentItem.paymentType
          newItem.collectionMoney = props.currentItem.collectionMoney
          if (+props.currentItem.paymentType === 2) {
            newItem.collectionMoneyIn = props.currentItem.collectionMoney
            newItem.collectionMoneyOut = ''
          } else if (+props.currentItem.paymentType === 1) {
            newItem.collectionMoneyOut = props.currentItem.collectionMoney
            newItem.collectionMoneyIn = ''
          }
        }
        return newItem
      })

      const collectionMoneyIn = states.tableData.reduce((total, item) => total + +item.collectionMoneyIn, 0)
      const collectionMoneyOut = states.tableData.reduce((total, item) => total + +item.collectionMoneyOut, 0)
      emit('computed', {
        collectionMoney: Math.abs(collectionMoneyIn - collectionMoneyOut),
        paymentType: collectionMoneyIn >= collectionMoneyOut ? 2 : 1
      })
    }

    const handleAddDeductionWork = async() => {
      if (!states.workerId) {
        states.errorText = '请输入工单号'
        states.showError = true
        return
      }

      if (states.tableData.length >= 30) {
        states.errorText = '最多仅支持添加30个抵扣订单'
        states.showError = true
        // $message.error('最多仅支持添加30个抵扣订单')
        return
      }

      if (states.tableData.findIndex(item => +item.workId === +states.workerId) > -1) {
        states.errorText = '该工单已添加，请重新输入'
        states.showError = true
        return
      }

      states.errorText = ''
      states.showError = false
      states.addButtonLoading = true

      try {
        const { code, data, message } = await $deductionAddChildWorkOrder({ checkType: props.belongType, workId: states.workerId })
        states.addButtonLoading = false

        if (+code === 1) {
          states.errorText = ''
          states.showError = false
          states.tableData.splice(1, 0, data)
          states.workerId = ''
        } else {
          states.errorText = message
          states.showError = true
        }
      } catch (e) {
        states.addButtonLoading = false
        $message.error(e)
      }
    }

    const handleDeleteDeductionWork = (workId) => {
      $confirm('确定删除该条抵扣工单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = states.tableData.findIndex(item => +item.workId === +workId)
        states.tableData.splice(index, 1)
        $message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }

    const handleInputWorkerId = (val) => {
      states.workerId = val.replace(/[^0-9]/g, '')

      if (val.replace(/[^0-9]/g, '') && states.errorText === '请输入工单号') {
        states.errorText = ''
        states.showError = false
      }
    }

    const handleSave = async() => {
      // if (states.tableData.length === 1) {
      //   $message.error('请先添加需要抵扣的工单')
      //   return
      // }
      states.btnLoading = true

      const params = {
        parentWorkId: props.parentId,
        belongType: props.belongType,
        childWorkIdList: states.tableData.map(item => item.workId)
      }

      try {
        const res = await $deductionAddOrUpdateChildWorkOrder(params)
        states.btnLoading = false
        if (res && +res.code === 1) {
          $message.success('保存成功')
          const collectionMoneyIn = states.tableData.reduce((total, item) => total + +item.collectionMoneyIn, 0)
          const collectionMoneyOut = states.tableData.reduce((total, item) => total + +item.collectionMoneyOut, 0)
          emit('success', {
            parentWorkId: res.data || '',
            collectionMoney: Math.abs(collectionMoneyIn - collectionMoneyOut),
            paymentType: collectionMoneyIn >= collectionMoneyOut ? 2 : 1,
            childWorkOrderCount: states.tableData.length
          })
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
        $message.error('系统错误')
      }
    }

    const handleClose = () => {
      emit('close')
    }

    return {
      ...toRefs(states),
      isDetail,
      handleAddDeductionWork,
      handleDeleteDeductionWork,
      handleInputWorkerId,
      handleSave,
      handleClose,
      computedTotalMoney
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep {

}

.addTitle {
  flex-shrink: 0;
  line-height: 32px;
}

.inputBox {
  position: relative;
}

.error {
  font-size: 12px;
  color: #F56C6C;
  position: absolute;
}

.errorButton {
  color: #F56C6C;
}
</style>
