<template>
  <div v-loading="detailLoading">
    <el-dialog
      title="编辑"
      :visible.sync="show"
      width="820px"
      :before-close="handleClose"
    >
      <div class="account-wrapper">
        <AccountCard :info="formData">
          <template v-slot>
            <div
              v-if="formData.upUpNameAndLeader"
              class="m-t-5"
              style="text-align: left"
            >
              <el-tag size="mini" type="danger">{{
                formData.upUpNameAndLeader
              }}</el-tag>
            </div>
          </template>
        </AccountCard>
        <p class="m-t-16 bind-id">ID:{{ getID(formData) }}</p>
        <div class="m-t-12">
          <el-form ref="form" :model="formData" :rules="rules" :inline="true" label="left">
            <el-row>
              <el-col :span="12">
                <el-form-item label="运营负责人：">
                  {{ formData.operatorName | emptyFill }}
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号归属：">{{
                  formData.accountBelong | emptyFill
                }}</el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="formData.phone" maxlength="11" placeholder="请输入手机号" clearable />
              </el-form-item>
              <el-col :span="12">
                <el-form-item label="账号统一名称">
                  <el-input v-model="formData.belongName" maxlength="11" placeholder="账号统一名称" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="绑定记录：">
                  <div class="flex">
                    <div v-if="formData.bindUser&&formData.bindUser.split(',').length > 2" class="flex">
                      <div
                        v-for="(tag, index) in formData.bindUser.split(',')"
                        :key="index"
                      >
                        <span
                          v-if="index < 2"
                        >{{ tag }}<i v-if="index <= 1">,</i></span>
                      </div>
                      <span>...</span>
                    </div>
                    <p v-else>
                      {{ formData.bindUser }}
                    </p>
                    <i
                      class="iconfont iconlianxiren realname-iocn m-l-12"
                      @click="showRecord"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="账号状态：">
                  <el-select
                    v-model="formData.accountStatus"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in accountStatusList"
                      :key="item.dictValue"
                      :label="item.dictLabel"
                      :value="item.dictValue"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="达人类型" prop="inputTags">
                  <template v-if="formData.sysAccountTag">
                    <el-tag
                      v-for="tag in (formData.sysAccountTag || '').split(',')"
                      :key="tag"
                      class="m-r-5 m-b-5"
                      :disable-transitions="false"
                    >{{ tag }}</el-tag>
                  </template>
                  <el-tag
                    v-for="tag in (formData.inputTags || [])"
                    :key="tag"
                    closable
                    class="m-r-5 m-b-5"
                    :disable-transitions="false"
                    @close="handleCloseTag(tag)"
                  >{{ tag }}</el-tag>
                  <el-cascader
                    ref="tag"
                    v-model="tagInputValue"
                    placeholder="请选择达人内容类型"
                    filterable
                    clearable
                    :props="{ value: 'tagName', label: 'tagName', children: 'childNodeTags', expandTrigger: 'hover' }"
                    :options="tagList"
                    class="input-new-tag"
                    @change="handleAddTag"
                  />
                  <br><span v-if="inputTagsError" class="errorText">每个达人最多添加5个达人类型</span>
                </el-form-item>

              </el-col>
            </el-row>

            <!-- 抖音 -->
            <template v-if="type === 'douyin'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="1-20s报价">
                    <el-input-number v-model="formData.twentySecondPrice" :precision="0" :min="0" :max="100000000" label="1-20s报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="21-60s报价" prop="sixPrice">
                    <el-input-number v-model="formData.sixPrice" :precision="0" :min="0" :max="100000000" label="21-60s报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="60s+报价">
                    <el-input-number v-model="formData.oversixtySecondPrice" :precision="0" :min="0" :max="100000000" label="60s+报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="全网报价">
                    <el-input-number v-model="formData.netPrice" :precision="0" :min="0" :max="100000000" label="全网报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- 快手 -->
            <template v-else-if="type === 'kuaishou'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="达人报价" prop="kuaishouTwentySecondPrice">
                    <el-input-number v-model="formData.sixPrice" :precision="0" :min="0" :max="100000000" label="达人报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="全网报价">
                    <el-input-number v-model="formData.netPrice" :precision="0" :min="0" :max="100000000" label="全网报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- b站 -->
            <template v-else-if="type === 'bilibili'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="定制视频" prop="customVideoPrice">
                    <el-input-number v-model="formData.customVideoPrice" :precision="0" :min="0" :max="100000000" label="定制视频" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="植入视频">
                    <el-input-number v-model="formData.implantationVideoPrice" :precision="0" :min="0" :max="100000000" label="植入视频" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="直发视频">
                    <el-input-number v-model="formData.directVideoPrice" :precision="0" :min="0" :max="100000000" label="直发视频" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="转发动态">
                    <el-input-number v-model="formData.forwardSituationPrice" :precision="0" :min="0" :max="100000000" label="转发动态" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- 小红书 -->
            <template v-else-if="type === 'xiaohongshu'">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频笔记" prop="videoPrice">
                    <el-input-number v-model="formData.videoPrice" :precision="0" :min="0" :max="100000000" label="视频笔记" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图文笔记">
                    <el-input-number v-model="formData.picturePrice" :precision="0" :min="0" :max="100000000" label="图文笔记" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- 其他平台 -->
            <template v-else>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="报价" prop="sixPrice">
                    <el-input-number v-model="formData.sixPrice" :precision="0" :min="0" :max="100000000" label="报价" /> 元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <el-row>
              <el-col :span="12">
                <el-form-item label="账号">
                  <el-input v-model="formData.accountLoginName" placeholder="账号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实名人姓名">
                  <el-select
                    v-model="formData.realCelebrityId"
                    placeholder="请选择实名人姓名"
                    clearable
                    filterable
                    @change="handleChangeRealCelebrityId"
                  >
                    <el-option
                      v-for="item in opSimpleUserData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="密码">
                  <el-input v-model="formData.accountLoginPwd" placeholder="密码" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="在职状态">
                  <el-radio-group v-model="formData.registerIsWorking">
                    <el-radio :label="1">在职</el-radio>
                    <el-radio :label="0">离职</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="登录手机号" prop="accountLoginPhone">
                  <el-input v-model="formData.accountLoginPhone" maxlength="11" placeholder="登录手机号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运营人身份证">
                  <el-input v-model="formData.operatorIdCard" maxlength="18" placeholder="运营人身份证" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="手机卡实名认证人">
                  <el-select
                    v-model="formData.phoneCardRegisterId"
                    placeholder="请选择手机卡实名认证人"
                    clearable
                    filterable
                    @change="handleChangePhoneCardRegisterId"
                  >
                    <el-option
                      v-for="item in opSimpleUserData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运营人住址">
                  <el-input v-model="formData.operatorAddress" placeholder="运营人住址" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="实体手机卡现持有人">
                  <el-select
                    v-model="formData.usePhoneUserId"
                    placeholder="请选择实体手机卡现持有人"
                    clearable
                    filterable
                    @change="handleChangeUsePhoneUserId"
                  >
                    <el-option
                      v-for="item in opSimpleUserData"
                      :key="item.id"
                      :value="item.id"
                      :label="item.name"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="运营人电话" prop="operatorPhone">
                  <el-input v-model="formData.operatorPhone" maxlength="11" placeholder="运营人电话" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="是否绑定个人提现方式">
                  <el-radio-group v-model="formData.isBindWithdrawal">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="本年度是否完成橱窗升级">
                  <el-radio-group v-model="formData.isUpdateShowcase">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="是否签署电子签">
                  <el-radio-group v-model="formData.isESign">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div slot="footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button
          type="primary"
          :loading="loading"
          @click="editSave"
        >确定</el-button>
      </div>
    </el-dialog>
    <BindDialog v-if="showRecords" v-model="showRecords" :row="formData" />
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted
} from '@vue/composition-api'
import {
  $getAccountDetail,
  $getTiktokAccountDetail,
  $getKuaishouAccountDetail,
  $getBilibiliAccountDetail,
  $getRedbookAccountDetail,
  $editTiktokAccountDetail,
  $editKuaishouAccountDetail,
  $editBilibiliAccountDetail,
  $editRedbookAccountDetail,
  $editAtyAccountDetail,
  $getOpSimpleUser
} from '@/api/operating-manage'
import { $getEnableTag } from '@/api/bussiness-manage'
import { AccountCard, IconTip } from 'components'
import BindDialog from '@/views/account-manage/account-count/_com/bind-dialog.vue'
import { useToggle } from '@/hook'
import { commonData } from './hooks'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    AccountCard,
    IconTip,
    BindDialog
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs, $nextTick } = getCurrentInstance().proxy
    const { getID, AccountStatusList } = commonData()
    const MOBILE_REG_EXP = /^1\d{10}$/

    const validateTag = (rule, value, callback) => {
      if (!value || value.length === 0 && !states.formData.sysAccountTag) {
        callback(new Error('请添加达人类型'))
      } else {
        callback()
      }
    }

    const validateSixPrice = (rule, value, callback) => {
      if (states.formData.sixPrice === null || states.formData.sixPrice === undefined) {
        callback(new Error('请输入21-60s报价'))
      } else if (!states.formData.sixPrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateksTwentySecondPrice = (rule, value, callback) => {
      if (states.formData.sixPrice === null || states.formData.sixPrice === undefined) {
        callback(new Error('请输入达人报价'))
      } else if (!states.formData.sixPrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateCustomVideoPrice = (rule, value, callback) => {
      if (states.formData.customVideoPrice === null || states.formData.customVideoPrice === undefined) {
        callback(new Error('请输入定制视频报价'))
      } else if (!states.formData.customVideoPrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateVideoPrice = (rule, value, callback) => {
      if (states.formData.videoPrice === null || states.formData.videoPrice === undefined) {
        callback(new Error('请输入视频笔记报价'))
      } else if (!states.formData.videoPrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const states = reactive({
      formData: {
        inputTags: [],
        realCelebrityId: undefined,
        phoneCardRegisterId: undefined,
        usePhoneUserId: undefined,
        operatorId: undefined
      },
      loading: false,
      showRecords: false,
      bindList: '',
      accountStatusList: AccountStatusList,
      CONTENT: '账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。',
      rules: {
        phone: {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的手机号'))
              return
            }
            callback()
          }
        },
        accountLoginPhone: {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的登录手机号'))
              return
            }
            callback()
          }
        },
        operatorPhone: {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的运营人电话'))
              return
            }
            callback()
          }
        },
        inputTags: [{ required: true, validator: validateTag, trigger: 'change' }],
        sixPrice: [{ required: true, validator: validateSixPrice, trigger: ['blur', 'change'] }],
        kuaishouTwentySecondPrice: [{ required: true, validator: validateksTwentySecondPrice, trigger: ['blur', 'change'] }],
        customVideoPrice: [{ required: true, validator: validateCustomVideoPrice, trigger: ['blur', 'change'] }],
        videoPrice: [{ required: true, validator: validateVideoPrice, trigger: ['blur', 'change'] }]
      },
      tagInputValue: [],
      tagList: [],
      inputTagsError: false,
      opSimpleUserData: [],
      detailLoading: true
    })

    onMounted(() => {
      $refs.form && $refs.form.clearValidate()
    })

    const showRecord = () => {
      states.showRecords = true
    }

    const getEnableTag = () => {
      const { type } = props
      let platId = ''

      if (type === 'douyin') {
        platId = 25
      } else if (type === 'kuaishou') {
        platId = 26
      } else if (type === 'bilibili') {
        platId = 2
      } else if (type === 'xiaohongshu') {
        platId = 45
      } else {
        platId = 25
      }

      $getEnableTag({ platId }).then(res => {
        if (+res.code === 1) {
          states.tagList = res.data || []
        }
      })
    }

    // 删除达人类型
    const handleCloseTag = (tag) => {
      const inputTags = states.formData.inputTags
      inputTags.splice(inputTags.indexOf(tag), 1)
      states.formData = {
        ...states.formData,
        inputTags
      }
      $refs.form.validateField('inputTags')
    }

    const handleAddTag = (val) => {
      if ((states.formData.inputTags || []).length >= 5) {
        states.inputTagsError = true
        $refs.form.validateField('inputTags')
        states.tagInputValue = []
        return
      }

      states.inputTagsError = false

      const tagItem = states.tagList.find(item => item.tagName === (val || [])[0])
      if ((tagItem.childNodeTags || []).length && (val || []).length === 1) {
        // this.$message.info('限长4个字符(仅中英文)')
        $refs.form.validateField('inputTags')
        states.tagInputValue = []
        return
      }

      const inputTags = states.formData.inputTags || []

      if ((states.formData.inputTags || []).indexOf(val[val.length - 1]) === -1) {
        if ((states.formData.sysAccountTag || '').split(',').indexOf(val[val.length - 1]) === -1) {
          inputTags.push(val[val.length - 1])
        }
      }

      states.formData = {
        ...states.formData,
        inputTags
      }

      $nextTick(() => {
        $refs.form.validateField('inputTags')
        states.tagInputValue = []
      })
    }

    const getAccountDetail = async function() {
      try {
        states.detailLoading = true
        let request = ''
        if (props.type === 'douyin') {
          request = $getTiktokAccountDetail
        } else if (props.type === 'kuaishou') {
          request = $getKuaishouAccountDetail
        } else if (props.type === 'bilibili') {
          request = $getBilibiliAccountDetail
        } else if (props.type === 'xiaohongshu') {
          request = $getRedbookAccountDetail
        } else if (props.type === 'other') {
          request = $getAccountDetail
        }

        const res = await request({
          accountId: props.row.accountId
        })
        states.detailLoading = false
        if (res.code === 1 && res.data) {
          if (props.type === 'douyin') {
            res.data.sixPrice = res.data.sixPrice === null ? undefined : res.data.sixPrice
            res.data.netPrice = res.data.netPrice || 0
            res.data.twentySecondPrice = res.data.twentySecondPrice || 0
            res.data.oversixtySecondPrice = res.data.oversixtySecondPrice || 0
          } else if (props.type === 'kuaishou') {
            res.data.sixPrice = res.data.sixPrice === null ? undefined : res.data.sixPrice
            res.data.netPrice = res.data.netPrice || 0
          } else if (props.type === 'bilibili') {
            res.data.customVideoPrice = res.data.customVideoPrice === null ? undefined : res.data.customVideoPrice
            res.data.implantationVideoPrice = res.data.implantationVideoPrice || 0
            res.data.directVideoPrice = res.data.directVideoPrice || 0
            res.data.forwardSituationPrice = res.data.forwardSituationPrice || 0
          } else if (props.type === 'xiaohongshu') {
            res.data.videoPrice = res.data.videoPrice === null ? undefined : res.data.videoPrice
            res.data.picturePrice = res.data.picturePrice || 0
          } else if (props.type === 'other') {
            res.data.sixPrice = res.data.sixPrice === null ? undefined : res.data.sixPrice
          }
          states.formData = res.data
          // 对单选框的值进行数字类型的转换
          Object.keys(states.formData).forEach(item => {
            if (['registerIsWorking', 'isESign', 'isBindWithdrawal', 'isUpdateShowcase'].includes(item)) {
              states.formData[item] = Number(states.formData[item])
            }
          })

          states.formData.inputTags = (res.data.accountTagInfoBOList || []).map(item => {
            let list = []
            if ((item.accountTagInfoBOList || []).length) {
              list = item.accountTagInfoBOList.map(item => item.tagName)
            } else {
              list = item.tagName
            }

            return list
          }).flat(Infinity)

          $nextTick(() => {
            $refs.form && $refs.form.clearValidate()
          })
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        states.detailLoading = false
        console.log(err)
      }
    }

    // 获取实名人姓名/手机卡实名认证人/实体手机卡现持有人数据
    const getOpSimpleUser = () => {
      $getOpSimpleUser()
        .then((res) => {
          if (res.code === 1) {
            states.opSimpleUserData = res.data || []
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    }

    // 监听实名人姓名的选择逻辑
    const handleChangeRealCelebrityId = (e) => {
      if (!e) return
      states.formData.realCelebrityName = states.opSimpleUserData.filter(item => item.id === e)[0].name
    }

    // 监听手机卡实名认证人的选择逻辑
    const handleChangePhoneCardRegisterId = (e) => {
      if (!e) return
      states.formData.phoneCardRegisterName = states.opSimpleUserData.filter(item => item.id === e)[0].name
    }

    // 监听实体手机卡现持有人的选择逻辑
    const handleChangeUsePhoneUserId = (e) => {
      if (!e) return
      states.formData.usePhoneUserName = states.opSimpleUserData.filter(item => item.id === e)[0].name
    }

    const editSave = async() => {
      try {
        await $refs.form.validate()
        const params = copy(states.formData)
        states.loading = true

        let request = ''

        if (props.type === 'douyin') {
          request = $editTiktokAccountDetail
        } else if (props.type === 'kuaishou') {
          request = $editKuaishouAccountDetail
        } else if (props.type === 'bilibili') {
          request = $editBilibiliAccountDetail
        } else if (props.type === 'xiaohongshu') {
          request = $editRedbookAccountDetail
        } else if (props.type === 'other') {
          request = $editAtyAccountDetail
        }

        let list = []
        states.tagList.forEach(item => {
          if ((item.childNodeTags || []).length) {
            list.push(item.childNodeTags)
          } else {
            list.push(item)
          }
        })

        list = list.flat(Infinity)
        params.accountTags = states.formData.inputTags.map(item => {
          return {
            tagName: item,
            md5Id: (list.find(it => it.tagName === item) || {}).md5Id || '',
            tagSource: 0
          }
        })

        const res = await request({ ...params })
        if (res && res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message.error(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }

    getAccountDetail()
    getEnableTag()
    getOpSimpleUser()

    return {
      ...toRefs(states),
      show,
      handleClose,
      handleCloseTag,
      handleAddTag,
      editSave,
      showRecord,
      getID,
      handleChangePhoneCardRegisterId,
      handleChangeUsePhoneUserId,
      handleChangeRealCelebrityId
    }
  }
})
</script>
<style scoped lang="scss">
.iconlianxiren {
  color: #2c64ff !important;
}
::v-deep {
  .account-wrapper {
    .account-card__image {
      height: 48px;
      width: 48px;
    }
  }
  .mac-wrapper {
    .account-card__image {
      height: 48px;
      width: 68px;
    }
  }
  .item-phone {
    .el-input {
      width: 200px;
    }
  }
}
.bind-id {
  font-size: 12px;
  color: #837e7e;
}
.update-time {
  margin-top: 8px;
  font-size: 14px;
  color: #918e8e;
}
.text-red {
  margin-top: -24px;
  margin-bottom: 16px;
  font-size: 12px;
  letter-spacing: -1px;
  color: rgb(255, 73, 73);
}

.errorText {
  color: #ff0000;
  font-size: 12px;
}
</style>

