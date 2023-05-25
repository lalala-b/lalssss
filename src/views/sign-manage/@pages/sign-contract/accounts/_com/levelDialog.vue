<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="880px"
    title="达人等级"
    :visible.sync="show"
    :close-on-click-modal="false"
    :append-to-body="true"
    :before-close="onClose"
  >
    <div class="add-form">
      <el-form
        ref="addForm"
        label-width="134px"
        :model="addForm"
        :rules="addFormRules"
        class="norm-form"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="双月单量评分：" prop="bimonthlyOrderScore">
              <el-select v-model="addForm.bimonthlyOrderScore" @change="handleChangeSelect">
                <el-option v-for="item in singleAmountArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="平台指数评分：" prop="platIndexScore">
              <el-select v-model="addForm.platIndexScore" @change="handleChangeSelect">
                <el-option v-for="item in platArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="赛道评分：" prop="trackScore">
              <el-select v-model="addForm.trackScore" @change="handleChangeSelect">
                <el-option v-for="item in trackArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CPM分类：" prop="cpmType">
              <el-select v-model="addForm.cpmType" @change="handleChangeSelect('cpm')">
                <el-option v-for="item in cpmTypeArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="调性评分：" prop="typeScore">
              <el-select v-model="addForm.typeScore" @change="handleChangeSelect">
                <el-option v-for="item in typeArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CPM评分：" prop="cpmScore">
              <el-select v-model="addForm.cpmScore" @change="handleChangeSelect">
                <el-option v-for="item in (+addForm.cpmType === 0 ? cpmVerticalScoreArr : +addForm.cpmType === 1 ? cpmScoreArr : [])" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="配合度评分：" prop="cooperationScore">
              <el-select v-model="addForm.cooperationScore" @change="handleChangeSelect">
                <el-option v-for="item in cooperationArr" :key="item.value" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总得分：">
              {{ addForm.totalScore }}
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="上次评级时间：">
              {{ addForm.updatedTime ? dayjs(addForm.updatedTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="达人等级：">
              {{ addForm.accountLevel || '--' }}
              <IconTip
                content=""
                label=""
                icon-class="iconwenhao"
              >
                <div>
                  <p>0-12分：C</p>
                  <p>13-18分：B</p>
                  <p>19-22分：A</p>
                  <p>23-30分：S</p>
                </div>
              </IconTip>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onClose">取 消</el-button>
        <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch,
  computed
} from '@vue/composition-api'
import dayjs from 'dayjs'
import { IconTip } from 'components'
import { $signAccountEvaluate } from '@/api/account-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    accountId: {
      type: Number,
      default: 0
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $refs, $message } = getCurrentInstance().proxy

    watch(() => props.data, (val = {}) => {
      addForm.bimonthlyOrderScore = val.bimonthlyOrderScore || ''
      addForm.platIndexScore = val.platIndexScore || ''
      addForm.trackScore = val.trackScore || ''
      addForm.cpmType = val.cpmType
      addForm.typeScore = val.typeScore || ''
      addForm.cpmScore = val.cpmScore || ''
      addForm.cooperationScore = val.cooperationScore || ''
      addForm.totalScore = val.totalScore || 0
      addForm.updatedTime = val.updatedTime || ''
      addForm.accountLevel = val.accountLevel || ''
    })

    watch(() => props.show, (val) => {
      if (!val) {
        $refs.addForm.resetFields()
      } else {
        addForm.bimonthlyOrderScore = props.data.bimonthlyOrderScore || ''
        addForm.platIndexScore = props.data.platIndexScore || ''
        addForm.trackScore = props.data.trackScore || ''
        addForm.cpmType = props.data.cpmType
        addForm.typeScore = props.data.typeScore || ''
        addForm.cpmScore = props.data.cpmScore || ''
        addForm.cooperationScore = props.data.cooperationScore || ''
        addForm.totalScore = props.data.totalScore || 0
        addForm.updatedTime = props.data.updatedTime || ''
        addForm.accountLevel = props.data.accountLevel || ''
      }
    })

    const data = reactive({
      addFormRules: {
        bimonthlyOrderScore: [{ required: true, message: '请选择双月单量评分', trigger: ['blur', 'change'] }],
        platIndexScore: [{ required: true, message: '请选择平台指数评分', trigger: ['blur', 'change'] }],
        trackScore: [{ required: true, message: '请选择赛道评分', trigger: ['blur', 'change'] }],
        cpmType: [{ required: true, message: '请选择CPM分类', trigger: ['blur', 'change'] }],
        typeScore: [{ required: true, message: '请选择调性评分', trigger: ['blur', 'change'] }],
        cpmScore: [{ required: true, message: '请选择CPM评分', trigger: ['blur', 'change'] }],
        cooperationScore: [{ required: true, message: '请选择配合度评分', trigger: ['blur', 'change'] }]
      },
      btnLoading: false,
      singleAmountArr: [{ value: 1, label: '0-1单（1分）' }, { value: 2, label: '2单（2分）' }, { value: 3, label: '3-4单（3分）' }, { value: 5, label: '5单+（5分）' }],
      platArr: [{ value: 1, label: '≤60（1分）' }, { value: 2, label: '61-70（2分）' }, { value: 3, label: '71-80（3分）' }, { value: 5, label: '≥81（5分）' }],
      trackArr: [{ value: 1, label: '混剪、二剪（1分）' }, { value: 2, label: '泛内容（2分）' }, { value: 3, label: '优质剧情（3分）' }, { value: 5, label: '优质垂类（5分）' }],
      cpmTypeArr: [{ value: 0, label: '垂直分类' }, { value: 1, label: '非垂直分类' }],
      typeArr: [{ value: 1, label: '下沉（1分）' }, { value: 2, label: '普通（2分）' }, { value: 3, label: '舒适（3分）' }, { value: 5, label: '专业（5分）' }],
      cpmVerticalScoreArr: [{ value: 1, label: '500+（1分）' }, { value: 2, label: '301-500（2分）' }, { value: 3, label: '101-300（3分）' }, { value: 5, label: '0-100（5分）' }],
      cpmScoreArr: [{ value: 1, label: '300+（1分）' }, { value: 2, label: '101-300（2分）' }, { value: 3, label: '31-100（3分）' }, { value: 5, label: '0-30（5分）' }],
      cooperationArr: [{ value: 1, label: '商单小白（1分）' }, { value: 2, label: '拒单or有要求（2分）' }, { value: 3, label: '配合一般（3分）' }, { value: 5, label: '配合度高（5分）' }]
    })

    const addForm = reactive({
      bimonthlyOrderScore: '',
      platIndexScore: '',
      trackScore: '',
      cpmType: '',
      typeScore: '',
      cpmScore: '',
      cooperationScore: '',
      totalScore: 0,
      updatedTime: '',
      accountLevel: ''
    })

    const onClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs.addForm.validate()
      // data.btnLoading = true
      // console.info('-----', $message)
      // try {
      //   const { code, message } = await $signAccountEvaluate({ ...addForm, operateType: Object.keys(props.data).length ? 1 : 0, accountId: props.accountId })
      //   data.btnLoading = false
      //   if (+code === 1) {
      //     emit('confirm')
      //     // emit('close')
      //   } else {
      //     $message.error(message)
      //   }
      // } catch (e) {
      //   data.btnLoading = false
      //   $message.error(e)
      // }
      emit('confirm', { ...addForm, operateType: Object.keys(props.data).length ? 1 : 0 })
      // emit('close')
    }

    const handleChangeSelect = (type) => {
      if (type === 'cpm') {
        addForm.cpmScore = ''
      }

      const { bimonthlyOrderScore = 0, platIndexScore = 0, trackScore = 0, typeScore = 0, cpmScore = 0, cooperationScore = 0 } = addForm
      const totalScore = +bimonthlyOrderScore + +platIndexScore + +trackScore + +typeScore + +cpmScore + +cooperationScore
      addForm.totalScore = totalScore

      if (totalScore >= 0 && totalScore <= 12) {
        addForm.accountLevel = 'C'
      } else if (totalScore >= 13 && totalScore <= 18) {
        addForm.accountLevel = 'B'
      } else if (totalScore >= 19 && totalScore <= 22) {
        addForm.accountLevel = 'A'
      } else if (totalScore >= 23 && totalScore <= 30) {
        addForm.accountLevel = 'S'
      }
    }

    return {
      ...toRefs(data),
      onClose,
      addForm,
      handleConfirm,
      handleChangeSelect,
      dayjs
    }
  }
})
</script>

