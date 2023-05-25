<template>
  <el-dialog
    :title="dialogType === 'add' ? '新增客户': '编辑客户'"
    :visible.sync="showDialog"
    width="980px"
    :close-on-click-modal="false"
    :show-close="true"
    :append-to-body="true"
    :before-close="handleClose"
  >
    <p class="titleBox">
      <span class="title">基本信息</span>
      <span v-if="dialogType === 'edit'" class="notice">（客户创建人：{{ formData.createName || '--' }}，创建时间：{{ formData.createTime || '--' }}）</span>
    </p>
    <div>
      <el-form
        ref="forms"
        label-width="130px"
        :rules="rules"
        :model="formData"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户联系人名称" prop="customerName">
              <el-input v-model="formData.customerName" placeholder="请输入客户联系人名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="customerPosition">
              <el-input v-model="formData.customerPosition" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属客户" prop="customerAdminId">
              <Select
                v-model="formData.customerAdminId"
                :config="{
                  data: customerAdminList,
                  optionValKey: 'id',
                  optionLabelKey: 'companyName',
                  key: 'customerAdminId',
                  conf: {
                    placeholder: '请选择所属客户',
                    clearable: true,
                    filterable: true
                  }
                }"
              />
              <el-popover
                :disabled="$permission('customer_manage_add_button') ? true : false"
                placement="top"
                width="250"
                trigger="hover"
                content="当前账号无权限添加新客户，请联系您的上级进行添加"
              >
                <span v-if="$permission('customer_manage_add_button')" ref="addCustomer" slot="reference" class="addClient" @click="handleToCustomerManagement">新增客户</span>
                <span v-else slot="reference" ref="noAddCustomer" class="disableAddClient">新增客户</span>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门">
              <el-input v-model="formData.customerDepartment" placeholder="请输入所属部门" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="性别">
              <el-select
                v-model="formData.gender"
                placeholder="请选择性别"
                clearable
              >
                <el-option v-for="item in genderArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生年代">
              <el-select
                v-model="formData.bornAge"
                placeholder="请选择出生年代"
                clearable
              >
                <el-option v-for="item in bornAgeArr" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="备注">
              <el-input v-model="formData.note" type="textarea" placeholder="请输入备注" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <p class="titleBox">
          <span class="title">联系方式</span>
        </p>

        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码">
              <el-input v-model="formData.mobilePhone" placeholder="请输入手机号码" maxlength="11" onkeyup="value=value.replace(/[^0-9]/g, '')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码2">
              <el-input v-model="formData.mobilePhone2" placeholder="请输入手机号码2" maxlength="11" onkeyup="value=value.replace(/[^0-9]/g, '')" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="微信号">
              <el-input v-model="formData.wechatNumber" placeholder="请输入微信号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信昵称">
              <el-input v-model="formData.wechatName" placeholder="请输入微信昵称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="formData.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="地址" prop="place">
              <el-input v-model="formData.place" type="textarea" placeholder="请输入地址" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="其他联系方式">
              <el-input v-model="formData.otherContact" type="textarea" placeholder="请输入其他联系方式" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <p class="titleBox">
          <span class="title">商务合作信息</span>
        </p>

        <el-row>
          <el-col :span="12">
            <el-form-item label="归属商务" prop="crmId">
              <Select v-model="formData.crmId" :config="normalFormItemMap.crmId" />
              <!-- <el-input v-model="formData.wechatNumber" placeholder="请输入微信号" /> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brandIds">
              <Select v-model="formData.brandIds" class="brandSelect" :config="brandConfig" />
              <el-button type="text" @click="showAddBrandConfirm = showAddBrandConfirm ? false : true">
                新增品牌
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="showAddBrandConfirm">
          <el-col :span="12" :offset="14">
            <div class="addBrandBox">
              <el-input v-model="addBrandInput" class="addInput" placeholder="请输入新增品牌的名称" />
              <el-button type="primary" :loading="addLoading" @click="handleAddBrand">添加</el-button>
              <span v-show="showAddError" class="error">该品牌已存在</span>
            </div>
          </el-col>
        </el-row>

        <p class="notice m-b-20">
          注：正常情况，联系人的AM对接人应该是该客户的AM对接人
        </p>

        <el-row>
          <el-col>
            <el-form-item label="联系人负责行业" prop="fieldIds">
              <!-- multiple: true, 暂时去除多个行业 -->
              <el-cascader
                ref="cascader"
                v-model="formData.fieldIds"
                placeholder="请选择联系人负责行业"
                :options="normalFormItemMap.adminIndustryId.data"
                :props="{ checkStrictly: false, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' }"
                clearable
                @change="handleChangeFieldIds"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <p class="notice m-b-20">
          注：此处填入的是该联系人所负责的行业方向，并非联系人所在企业的行业方向。暂不支持多选
        </p>

        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="合作类型（即将废弃）" label-width="180px">
              <Select
                v-model="formData.customerType"
                :config="{
                  ...normalFormItemMap.customerType,
                  data: customerTypeList,
                  optionValKey: 'id',
                  optionLabelKey: 'name'
                }"
              />
              <IconTip
                type="popper"
                icon-class="iconwenhao"
              >
                <template>
                  合作类型分为：客户的“主合作类型”，在“客户管理”中维护。商机、商单的“合作类型”，在商机、商单中维护。<br>联系人的合作类型即将废弃。
                </template>
              </IconTip>
            </el-form-item>
          </el-col>
        </el-row> -->

      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, ref, toRefs, getCurrentInstance, onMounted, watch } from '@vue/composition-api'
import { Select, IconTip } from 'components'
import {
  $searchCompany,
  $getCustomer,
  $putCustomer,
  $addBaseCustomerInfo,
  $addCustomerContactInfo,
  $getCustomerAdminList,
  $getCustomerTypeList
} from '@/api/bussiness-manage'

export default defineComponent({
  components: {
    Select,
    IconTip
  },
  props: {
    id: {
      type: String | Number,
      default: ''
    },
    dialogType: {
      type: String,
      default: 'add'
    },
    showDialog: {
      type: Boolean,
      default: false
    },
    normalFormItemMap: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { $message, $refs, $router, $set } = getCurrentInstance().proxy
    const showAddBrandConfirm = ref(false)
    const addBrandInput = ref('')
    const addLoading = ref(false)
    const showAddError = ref(false)
    const brandConfig = ref({
      type: 'select',
      key: 'brandId',
      data: (props.normalFormItemMap.brandId || {}).data || [],
      conf: {
        placeholder: '请选择品牌',
        filterable: true,
        clearable: true,
        multiple: true
      },
      optionValKey: 'id',
      optionLabelKey: 'newsContent'
    })

    watch(
      () => props.normalFormItemMap.brandId.data,
      (newVal) => {
        brandConfig.value = {
          ...brandConfig.value,
          data: newVal
        }
      }
    )

    watch(
      () => props.normalFormItemMap.adminIndustryId.data,
      (newVal) => {
        if ((newVal || []).length) {
          const field = []

          if (((states.detail.medCustomerInfo || {}).fieldIds || []).length) {
            states.detail.medCustomerInfo.fieldIds.forEach((fieldId) => {
              let parentId = ''
              const arr = props.normalFormItemMap.adminIndustryId.data || []
              for (let i = 0; i < arr.length; i += 1) {
                const index = arr[i].childNodeTags.findIndex(item => +item.id === +fieldId)
                if (index > -1) {
                  parentId = arr[i].id
                  break
                }
              }
              field.push([parentId, fieldId])
            })
          }

          states.formData.fieldIds = field
        }
      }
    )

    // 公司名称
    const useCompany = () => {
      const remoteLoading = ref(false)
      const companyList = ref([])
      const handleSearchCompany = (word) => {
        if (!word) return
        remoteLoading.value = true
        $searchCompany({ word }).then(res => {
          if (res.code === 1) {
            companyList.value = res.data?.list || []
          }
          remoteLoading.value = false
        }).catch(err => {
          if (err.__CANCEL__) return
          remoteLoading.value = false
        })
      }
      return {
        companyList,
        handleSearchCompany,
        remoteLoading
      }
    }

    const { companyList, remoteLoading, handleSearchCompany } = useCompany()

    const validateFields = (rule, value, callback) => {
      if (!$refs.cascader.getCheckedNodes().filter(item => item).length) {
        callback(new Error('请选择联系人负责行业'))
      } else {
        callback()
      }
    }

    const states = reactive({
      rules: {
        customerName: [{ required: true, message: '请输入客户联系人名称', trigger: ['blur', 'change'] }],
        customerPosition: [{ required: true, message: '请输入职位', trigger: ['blur', 'change'] }],
        customerAdminId: [{ required: true, message: '请选择所属客户', trigger: ['blur', 'change'] }],
        place: [{ required: true, message: '请输入地址', trigger: ['change', 'blur'] }],
        crmId: [{ required: true, message: '请选择归属商务', trigger: ['change', 'blur'] }],
        brandIds: [{ required: true, message: '请选择品牌', trigger: ['change', 'blur'] }],
        fieldIds: [{ required: true, validator: validateFields, trigger: ['blur', 'change'] }]
      },
      btnLoading: false,
      detail: {},
      genderArr: [{ id: 0, name: '未知' }, { id: 1, name: '男' }, { id: 2, name: '女' }],
      bornAgeArr: [
        { id: 0, name: '未知' },
        { id: 1, name: '60后' },
        { id: 2, name: '70后' },
        { id: 3, name: '80后' },
        { id: 4, name: '90后' },
        { id: 5, name: '00后' }
      ],
      customerAdminList: [],
      customerTypeList: [],
      formData: {
        customerName: '',
        customerPosition: '',
        customerAdminId: '',
        customerDepartment: '',
        gender: 0,
        bornAge: 0,
        note: '',
        mobilePhone: '',
        mobilePhone2: '',
        wechatNumber: '',
        wechatName: '',
        email: '',
        place: '',
        otherContact: '',
        crmId: '',
        brandIds: [],
        fieldIds: [],
        customerType: ''
      }
      // curfieldIds: []
    })

    const getCustomerAdminList = async() => {
      const { code, data } = await $getCustomerAdminList()
      if (+code === 1) {
        states.customerAdminList = data
      }
    }

    const getCustomerTypeList = async() => {
      const { code, data } = await $getCustomerTypeList()

      if (+code === 1) {
        states.customerTypeList = data || []
      }
    }

    onMounted(async() => {
      getCustomerAdminList()
      getCustomerTypeList()
      if (props.id) {
        const { code, data } = await $getCustomer({ customerId: props.id })
        if (+code === 1) {
          states.detail = data

          const field = []

          if (data.medCustomerInfo.fieldIds.length) {
            data.medCustomerInfo.fieldIds.forEach((fieldId) => {
              let parentId = ''
              const arr = props.normalFormItemMap.adminIndustryId.data || []
              for (let i = 0; i < arr.length; i += 1) {
                const index = arr[i].childNodeTags.findIndex(item => +item.tagId === +fieldId)
                if (index > -1) {
                  parentId = arr[i].tagId
                  break
                }
              }
              field.push([parentId, fieldId.toString()])
            })
          }

          states.formData = {
            ...data.customerAdminInfo,
            ...data.medCustomerInfo,
            fieldIds: field[0]
          }
        }
      }
      getIndustryList(props.normalFormItemMap.adminIndustryId.data)
    })

    const getIndustryList = (list) => {
      if (list) {
        list.forEach(item => {
          if (!item.enableFlag) {
            $set(item, 'disabled', false)
          } else {
            $set(item, 'disabled', true)
          }
          if (item.childNodeTags) {
            getIndustryList(item.childNodeTags)
          }
        })
      }
    }

    const handleChangeFieldIds = (val) => {
      const nodesInfo = $refs.cascader.getCheckedNodes()[0]
      if (!nodesInfo || !Object.keys(nodesInfo).length) {
        states.formData.fieldIds = []
        return
      }
      if (nodesInfo.data.disabled || nodesInfo.children.length) {
        states.formData.fieldIds = []
      } else {
        states.formData.fieldIds = val
      }
    }

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs['forms'].validate()
      const params = { ...states.formData }

      params.fieldIds = $refs.cascader.getCheckedNodes().map(item => {
        if ((item || {}).hasChildren) {
          return ''
        } else {
          return item.value
        }
      }).filter(item => item)

      let $api = ''
      if (props.dialogType === 'add') {
        $api = $addCustomerContactInfo
      } else {
        $api = $putCustomer
      }

      params.mobilePhone = params.mobilePhone.replace(/[^0-9]/g, '')
      params.mobilePhone2 = params.mobilePhone2.replace(/[^0-9]/g, '')

      try {
        states.btnLoading = true
        const { code, message } = await $api(params)
        if (+code === 1) {
          if (props.dialogType === 'add') {
            $message.success('新增成功')
          } else {
            $message.success('编辑成功')
          }
          emit('success')
          states.btnLoading = false
        } else {
          states.btnLoading = false
          $message.error(message)
        }
      } catch (e) {
        states.btnLoading = false
        $message.error(e)
      }
    }

    const handleAddBrand = async() => {
      const value = addBrandInput.value.replace(/\s*/g, '')
      if (!value) {
        $message.error('新增品牌名不能为空')
        return
      }

      addLoading.value = true
      showAddError.value = false

      try {
        const { code, message, data } = await $addBaseCustomerInfo({
          typeId: 2,
          newsContent: value
        })

        if (+code === 0) {
          addLoading.value = false

          if (message.indexOf('已存在') > -1) {
            showAddError.value = true
          } else {
            showAddError.value = false
            $message.error(message)
          }
        } else if (+code === 1) {
          const newBrandData = (props.normalFormItemMap.brandId || {}).data || []
          newBrandData.push(data)
          brandConfig.value = {
            ...brandConfig.value,
            data: newBrandData
          }

          const brandArr = states.formData.brandIds || []
          brandArr.push(data.id)
          states.formData.brandIds = brandArr

          addLoading.value = false
          showAddError.value = false
          addBrandInput.value = ''
          $message.success('品牌添加成功')
        } else {
          addLoading.value = false
          showAddError.value = false
          $message.error(message)
        }
      } catch (e) {
        showAddError.value = false
        addLoading.value = false
        $message.error(e)
      }
    }

    const handleToCustomerManagement = async() => {
      $router.push({
        path: '/bussiness-manage/customer-manage',
        query: {
            flag: 'fromClient'
        }
      })
    }

    return {
      ...toRefs(states),
      brandConfig,
      addBrandInput,
      addLoading,
      showAddError,
      showAddBrandConfirm,
      handleClose,
      handleConfirm,
      handleSearchCompany,
      handleAddBrand,
      companyList,
      remoteLoading,
      handleToCustomerManagement,
      handleChangeFieldIds
      // getCurrentFieldIds
    }
  }
})
</script>

<style lang="scss" scoped>
.titleBox {
  padding-bottom: 10px;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 18px;
}

.title {
  font-size: 18px;
  position: relative;
  padding-left: 18px;

  &::after {
    content: "";
    width: 10px;
    height: 24px;
    font-size: 0;
    background: #409EFF;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
  }
}

.notice {
  color: #aaa;
  position: relative;
}

.rel-top {
  top: -18px;
}

::v-deep {
  .el-input {
    max-width: 220px;
  }

  .el-cascader {
    width: 100%;
    max-width: 100%;

    .el-input {
      max-width: 100%;
    }
  }
}

.inputNumber {
  max-width: 80px;
}

.brandSelect {
  width: 166px;
  margin-right: 6px;
}

.dialogBrandSelect {
  width: 180px;
  margin-right: 6px;
  margin-bottom: 10px;
}

.error {
  margin-left: 4px;
  color: #ff0000;
  font-size: 12px;
}

.addClient {
  color: #2c64ff;
  margin-left: 14px;
  font-size: 14px;
  cursor: pointer;
}

.disableAddClient {
  color:#ccc;
  cursor: not-allowed;
  margin-left: 14px;
  font-size: 14px;
}

.hide {
  display: none;
}
</style>
