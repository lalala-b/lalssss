<template>
  <div class="C-password-form">
    <el-radio-group v-model="form.addCommandType" style="margin-bottom: 20px;" @change="handleTypeChange">
      <el-radio-button :label="1">手工添加口令</el-radio-button>
      <el-radio-button :label="2">关联其他订单口令</el-radio-button>
    </el-radio-group>
    <template v-if="form.addCommandType === 1">
      <p class="el-form-item__error" style="margin-bottom: 10px;">若存在多个口令请点击添加按钮分别录入</p>
      <el-form ref="form" :inline="true" :model="form">
        <flex-row v-for="(item, index) in list" :key="index" class-name="flex-center m-b-16">
          <span>{{ index + 1 }}</span>
          <el-form-item
            :clearable="true"
            label="口令:"
            :prop="`list.${index}.wordOfCommand`"
            :rules="{
              required: true,
              message: '口令不能为空',
              trigger: 'blur'
            }"
          >
            <el-input :value="item.wordOfCommand" maxlength="10" @input="item.wordOfCommand = arguments[0].replace(/[\,\，]/g, '').replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, '')" />
          </el-form-item>
          <el-form-item
            :clearable="true"
            label="投放生效时间:"
            :prop="`list.${index}.timerange`"
            :rules="timeRules"
          >
            <el-date-picker
              v-model="item.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <p @click="handleDel(index)">
            <i class="el-icon-close" />
          </p>
        </flex-row>
        <!-- <p class="el-form-item__error" v-if="hasErrorForm" style="margin-left: 100px;">信息填写不完整，请检查!</p> -->
        <div>
          <el-button type="text" @click="add">添加</el-button>
        </div>

      </el-form>
    </template>
    <template v-else>
      <el-form ref="form" :model="form">
        <el-form-item
          :clearable="true"
          label="账号检索"
          prop=""
          :rules="{
            required: true,
            message: '账号不能为空',
            trigger: 'change'
          }"
        >
          <el-select
            v-model="form.beDependentOrderNumber"
            :popper-append-to-body="false"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入账号名称"
            :remote-method="remoteMethod"
            :loading="loading"
            @change="handleAccountChange"
            @clear="clearAccount"
          >
            <el-option v-for="(item) in accountList" :key="item.orderNumber" :label="item.accountName" :value="item.orderNumber">
              <flex-row class="account-item" :no-bottom="true">
                <img class="account-image" :src="item.accountImg" alt="">
                <div class="account-info">
                  <flex-row :no-bottom="true">
                    <div class="account-name">
                      {{ item.accountName }}
                    </div>
                    <p class="account-text2 text-over" style="margin-left: 50px;">口令: {{ item.orderCommand }}</p>
                  </flex-row>
                  <flex-row :no-bottom="true">
                    <p class="account-text" style="margin-right: 50px;">订单号: {{ item.orderNumber }}</p>
                    <p class="account-text">平台消耗金额: {{ item.consumeAmount }}</p>
                  </flex-row>
                </div>
              </flex-row>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="selectAccount"
          :clearable="true"
          label="关联订单口令"
        >
          <flex-row class="account-item" :no-bottom="true">
            <img class="account-image" :src="selectAccount.accountImg" alt="">
            <div class="account-info">
              <flex-row :no-bottom="true">
                <div class="account-name">
                  <b>{{ selectAccount.accountName }}</b>
                </div>

              </flex-row>
              <flex-row :no-bottom="true">
                <p class="account-text">订单号: <b>{{ selectAccount.orderNumber }}</b></p>
                <p class="account-text">平台消耗金额: <b>{{ selectAccount.consumeAmount }}</b></p>
              </flex-row>
              <p v-for="(item, index) in selectAccount.deliveryWordOfCommandBOList" :key="index" class="account-text2">口令{{ index + 1 }}: <b>{{ item.wordOfCommand }}</b> &nbsp;投放生效时间：<b>{{ item.beginTime }}</b> 至 <b>{{ item.endTime }}</b></p>
            </div>
          </flex-row>
        </el-form-item>
      </el-form>
    </template>
    <div style="text-align: center;">
      <el-button @click="handleCancel">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </div>
  </div>
</template>
<script>
import { reactive, ref } from '@vue/composition-api'
import dayjs from 'dayjs'
import { $findDependentOrderList } from '@/api/putting-manager'
// import FlexRow from '@/components/public/flex-row/flex-row.vue'
// import flexRow from '@/components/public/flex-row/flex-row.vue'

function PasswordCore(hasData) {
  const list = reactive([])
  const data = {
    wordOfCommand: '',
    timerange: []
  }
  const add = () => {
    list.push(reactive({ ...data }))
  }
  if (!hasData) {
    // 初始化一项
    add()
  }

  return {
    list,
    add
  }
}

const hasErrorForm = ref(false)

function validateMenu(rule, value, callback) {
  console.log(value, '----menu')
  // value && value.forEach(item => {
  //   if (!item.wordOfCommand || item.timerange.length === 0) {
  //     hasErrorForm.value = true
  //   } else {
  //     hasErrorForm.value = false
  //   }
  // })
  callback()
}

export default {
  props: {
    editList: {
      type: Object,
      default() {
        return {}
      }
    },
    startTime: Date,
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props) {
    const { list, add } = PasswordCore(props.editList.addCommandType === 1 && props.editList.list && !!props.editList.list.length)
    const addCommandType = ref(props.editList.addCommandType || 1)
    const beDependentOrderNumber = ref(props.editList.beDependentOrderNumber || null)
    const darenUid = ref(props.editList.darenUid || null)
    const accountList = ref([
    ])
    const form = reactive({
      list,
      addCommandType,
      beDependentOrderNumber,
      darenUid
      // accountName
    })
    const selectAccount = reactive(null)
    const loading = ref(false)

    return {
      form,
      list,
      loading,
      selectAccount,
      accountList,
      add,
      hasErrorForm,
      timeRules: {
        required: true,
        // validator: validateMenu,
        message: '投放生效时间不能为空',
        trigger: 'change'
      },
      rules: {
        list: [{
          required: true,
          validator: validateMenu,
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    pickerOptions() {
      const sTime = this.startTime
      return {
        disabledDate(time) {
          return dayjs(sTime).add(-1, 'day').isAfter(time) || dayjs(sTime).add(6, 'month').isBefore(time)
        }
      }
    }
  },
  created() {
    if (this.editList.addCommandType === 1 && this.editList.list && this.editList.list.length) {
      this.list.push(...this.editList.list.map(t => {
        if (t.beginTime && t.endTime) {
          t.timerange = [t.beginTime, t.endTime]
        }
        return {
          timerange: t.timerange,
          id: t.id,
          wordOfCommand: t.wordOfCommand
        }
      }))
      this.form.list = this.list
    } else if (this.editList.addCommandType === 2) {
      // this.remoteMethod(this.editList.accountName, true)
      this.findOrderNumberItem(this.editList.beDependentOrderNumber).then(res => {
        this.selectAccount = res.data ? res.data[0] : null
        this.remoteMethod(this.selectAccount.accountName)
      })
    }
  },
  methods: {
    clearAccount() {
      this.selectAccount = null
      this.accountList = []
    },
    handleTypeChange() {
      if (this.form.addCommandType === 2 && this.accountList.length === 0) {
        // this.remoteMethod(this.editList.accountName, true)
        this.findOrderNumberItem(this.editList.beDependentOrderNumber).then(res => {
          this.selectAccount = res.data ? res.data[0] : null
          this.remoteMethod(this.selectAccount.accountName)
        })
      }
    },
    handleAccountChange() {
      for (let i = 0; i < this.accountList.length; i++) {
        const item = this.accountList[i]
        if (item.orderNumber === this.form.beDependentOrderNumber) {
          this.selectAccount = item
          this.form.beDependentOrderNumber = item.orderNumber
          this.form.darenUid = item.darenUid
          console.log(this.form)
        }
      }
    },
    findOrderNumberItem(orderNumber) {
      return new Promise(async(resolve, reject) => {
        const res = await $findDependentOrderList({
          orderNumber,
          deliveryId: this.formData.deliveryId,
          advertiserUserId: this.formData.advertiserUserId,
          requirementId: this.formData.requirementId,
          findType: 2
        })
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res.message || '网络错误')
        }
      })
    },
    findDependentOrderList(accountName) {
      return new Promise(async(resolve, reject) => {
        const params = {}
        params.accountName = accountName
        params.businessTag = this.formData.businessTag
        params.findType = 1
        params.deliveryId = this.formData.deliveryId
        params.advertiserUserId = this.formData.advertiserUserId
        params.requirementId = this.formData.requirementId
        const res = await $findDependentOrderList(params)
        if (res.code === 1) {
          resolve(res)
        } else {
          reject(res.message || '网络错误')
        }
      })
    },
    remoteMethod(query, hasEcho) {
      if (query !== '') {
        this.loading = true
        this.findDependentOrderList(query).then((res) => {
          this.loading = false
          this.accountList = res.data || []
          if (hasEcho) {
            this.handleAccountChange()
          }
        }).catch(() => {
          this.accountList = []
          this.loading = false
        })
      } else {
        this.options = []
      }
    },
    async save() {
      if (this.hasErrorForm) {
        console.log('no check')
        return
      }
      let validateResult
      try {
        validateResult = await this.$refs.form.validate()
      } catch (e) {
        validateResult = false
      }
      if (!validateResult) {
        return
      }
      const data = this.form
      if (data.addCommandType === 2) {
        if (this.selectAccount) {
          data.list = this.selectAccount.deliveryWordOfCommandBOList
        }
      } else {
        data.list = data.list.map(t => {
          t.beginTime = t.timerange[0]
          t.endTime = t.timerange[1]
          return {
            wordOfCommand: t.wordOfCommand,
            beginTime: t.beginTime,
            endTime: t.endTime,
            id: t.id || null
          }
        })
      }

      this.$emit('save', data)
    },
    handleCancel() {
      this.$emit('cancel', false)
    },
    handleDel(index) {
      this.list.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
  .flex-center {
    align-items: center;
    justify-content: center;
  }
  .el-form-item__error {
    position: static;
  }
  .el-icon-close {
    cursor: pointer;
  }
  .C-password-form {

    ::v-deep .el-select-dropdown__item {
      line-height: initial;
      height: auto;
      .flex-row {
        > * {
          flex: 1;
        }
      }
    }
    .text-over {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      width: 220px;
    }
    .account-item {
      line-height: 1.6;
      .account-image {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 8px;
      }
      .account-info {
        .account-name {
          font-weight: bold;
          font-size: 16px;
        }
        .account-text {
          font-size: 12px;
          color: #999;
          font-weight: initial;
        }
        .account-text2 {
          font-size: 12px;
          color: #333;
          font-weight: initial;
        }
      }
    }
  }
</style>
