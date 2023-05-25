<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="900px"
    :title="dialogType === 'edit' ? '编辑' : '新增'"
    :visible.sync="showDialog"
    @close="handleClose"
  >

    <div :class="showXingtuUrl && dialogType !== 'edit' ? 'containerWrap' : ''">
      <div v-loading="loading" class="add-form" :class="showXingtuUrl && dialogType !== 'edit' ? 'formWrap' : ''">
        <el-form
          ref="addForm"
          label-width="110px"
          :model="addForm"
          :rules="addFormRules"
          class="norm-form"
        >
          <template>
            <el-form-item label="平台名称" prop="platId">
              <el-select
                v-model="addForm.platId"
                :disabled="dialogType === 'edit'"
                @change="handlePlatType"
              >
                <el-option
                  v-for="item in platList"
                  :key="item.platId"
                  :value="item.platId"
                  :label="item.platName"
                />
              </el-select>
              <div v-if="addForm.platId" class="plat-info flex flex-align-center">
                <img :src="platMap[addForm.platId].plat_logo" class="m-r-5" alt>账号授权,请输入平台下分享出来的链接
              </div>
            </el-form-item>
            <el-form-item v-if="userInfo" class="mr90">
              <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
              <p>{{ userInfo.user_name }}</p>
            </el-form-item>

            <el-form-item v-if="(addForm.platId === 25 || addForm.platId === 26) && dialogType !== 'edit'" label="账号检索">
              <el-select
                v-model="addForm.eid"
                class="account-search"
                filterable
                remote
                reserve-keyword
                placeholder="请输入关键词"
                :remote-method="remoteMethod"
                :loading="accountLoading"
                :popper-append-to-body="false"
                no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
                style="width: 100%;"
                @change="handleAccountChange"
              >
                <el-option v-for="(item) in accountList" :key="item.user_id" :label="item.user_name" :value="item.eid">
                  <div class="flex">
                    <img class="account-img" :src="item.avatar_uri" alt="">
                    <div class="account-info flex flex-dir-col flex1 flex-justify-center">
                      <p class="account-text1 account-name">{{ item.user_name }}</p>
                      <p class="account-text2">ID:{{ item.eid }}</p>
                    </div>
                    <div class="account-info account-fans flex flex-dir-col flex-justify-center">
                      <p class="account-text1">粉丝量</p>
                      <p class="account-text2">{{ item.fans_num | toThousandsW }}</p>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="URL" prop="userUrl">
              <div class="flex">
                <el-input v-model="addForm.userUrl" :disabled="dialogType === 'edit'" class="flex1" autocomplete="off" @change="handleUserUrl" />
                <el-button :loading="empowerLoading" :disabled="empowerDisabled || dialogType === 'edit'" size="small" style="margin-left: 10px;" @click="empower">授权</el-button>
              </div>
            </el-form-item>

            <el-form-item v-if="addForm.platId === 25 && showXingtuUrl" label="星图地址" prop="xingtuUrl">
              <div ref="xingtuWrap" class="xingtuWrap">
                <el-input v-model="addForm.xingtuUrl" :disabled="dialogType === 'edit' || disabledXingtuUrl" autocomplete="off" @change="handleChangeXingtuUrl" />
              </div>
            </el-form-item>

            <div v-if="dialogType === 'edit'">
              <!-- 抖音报价 -->
              <div v-if="addForm.platId === 25" class="priceWrap">
                <el-form-item label="1-20s报价" prop="twentySecondPrice">
                  <el-input-number v-model="addForm.twentySecondPrice" @change="handleChangeDyPrice(1)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="21-60s报价" prop="sixPrice">
                  <el-input-number v-model="addForm.sixPrice" @change="handleChangeDyPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="60s+报价" prop="oversixtySecondPrice">
                  <el-input-number v-model="addForm.oversixtySecondPrice" @change="handleChangeDyPrice(3)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="全网报价" prop="netPrice">
                  <el-input-number v-model="addForm.netPrice" @change="handleChangeDyPrice(4)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
              </div>

              <!-- 快手报价 -->
              <div v-if="addForm.platId === 26" class="priceWrap">
                <el-form-item label="达人报价" prop="quotePrice">
                  <el-input-number v-model="addForm.quotePrice" @change="handleChangeKsPrice(1)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="全网报价" prop="netPrice">
                  <el-input-number v-model="addForm.netPrice" @change="handleChangeKsPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
              </div>

              <!-- B站报价 -->
              <div v-if="addForm.platId === 2" class="priceWrap">
                <el-form-item label="定制视频" prop="customVideoPrice">
                  <el-input-number v-model="addForm.customVideoPrice" @change="handleChangeBiliPrice(1)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="植入视频" prop="implantationVideoPrice">
                  <el-input-number v-model="addForm.implantationVideoPrice" @change="handleChangeBiliPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="直发视频" prop="directVideoPrice">
                  <el-input-number v-model="addForm.directVideoPrice" @change="handleChangeBiliPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="转发动态" prop="forwardSituationPrice">
                  <el-input-number v-model="addForm.forwardSituationPrice" @change="handleChangeBiliPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
              </div>

              <!-- 小红书报价 -->
              <div v-if="addForm.platId === 45" class="priceWrap">
                <el-form-item label="视频笔记" prop="videoPrice">
                  <el-input-number v-model="addForm.videoPrice" @change="handleChangeRedPrice(1)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
                <el-form-item label="图文笔记" prop="picturePrice">
                  <el-input-number v-model="addForm.picturePrice" @change="handleChangeRedPrice(2)" /> 元
                  <IconTip content="账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。" icon-class="iconwenhao" />
                </el-form-item>
              </div>
            </div>

            <el-row class="remarkWrap">
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <el-input v-model="addForm.remark" placeholder="限长100个字符" type="textarea" show-word-limit maxlength="100" row="8" />
                </el-form-item>
              </el-col>
            </el-row>

            <template v-if="showXingtuUrl && dialogType !== 'edit'">
              <el-form-item label="本次沟通结果" prop="result">
                <el-select
                  v-model="addForm.result"
                  @change="handleCommunicateRes"
                >
                  <el-option
                    v-for="item in communicateResList"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>

              <el-form-item v-if="showDescribeSelect" label="具体原因" prop="describeList">
                <el-select
                  v-model="addForm.describeList"
                  multiple
                >
                  <el-option
                    v-for="item in describeList"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                </el-select>
              </el-form-item>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="详细记录" prop="note">
                    <el-input v-model="addForm.note" placeholder="仅支持200字以内" type="textarea" show-word-limit maxlength="200" row="8" />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
          <el-button :loading="btnLoading" type="primary" @click="handleSubmit">确 定</el-button>
        </div>
      </div>

      <div v-if="showXingtuUrl && dialogType !== 'edit'" class="leftContainerWrap">
        <div v-loading="bindAgentLoading" class="bindAgentWrap">
          <h3>已绑定经纪人</h3>
          <div v-if="bindAgentlist.length" class="recordList">
            <span v-for="(item, index) in bindAgentlist" :key="item.id">{{ item.signUserName }}{{ index === bindAgentlist.length - 1 ? '' : '、' }}</span>
          </div>
          <div v-else class="noData">无</div>
        </div>

        <h3>历史沟通记录</h3>
        <div v-loading="historyRecordLoading" class="historyWrap">
          <ul v-if="historyRecordList.length" class="recordList">
            <li v-for="item in historyRecordList" :key="item.id">
              <div class="top">
                <img v-if="item.avatar" :src="item.avatar" alt="">
                <i v-else class="el-icon-user-solid" />
                <div>
                  <p>{{ item.communicatorName }}</p>
                  <p>{{ item.createTime }}</p>
                </div>
              </div>

              <div class="tag">
                <el-tag type="danger" size="mini">{{ item.result }}</el-tag>
                <el-tag v-for="describeItem in item.describeList" :key="describeItem" type="danger" size="mini">{{ describeItem }}</el-tag>
              </div>

              <div v-if="item.note" class="recordText" :title="item.note">{{ item.note }}</div>
              <div v-else style="color: rgba(0,0,0,.5)">无其他详细记录</div>
            </li>
          </ul>
          <div v-else class="noData">无</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/http'
import { PYTHON_HOST as HOST } from '@/const'
import { $getSignContractCondition } from '@/api/sign-contract'
import { $getUserAccount, $getBaseInfo } from '@/api/account-manage'
import {
  $getEditInfo,
  $addReadyAccount,
  $updateSignContractAccountPrice,
  $getXingtuUrl,
  $getDescribeList,
  $getCommunicateResList,
  $getAccountCommunicateList
} from '@/api/sign-progress'
import {
  IconTip
} from 'components'

export default {
  components: {
    IconTip
  },
  props: {
    dialogType: {
      type: String,
      default() {
        return ''
      }
    },
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    id: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    return {
      addFormRules: {
        platId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        userUrl: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        eid: [{ required: true, message: '请选择账号', trigger: 'blur' }],
        xingtuUrl: [{ required: true, message: '请输入该达人的星图主页地址（如：https://www.xingtu.cn/ad/creator/author/douyin/6629660778767056899/1）', trigger: 'blur' },
        {
          pattern: /^https:\/\/www.xingtu.cn\/ad\/creator\/author\/douyin/,
          message: '地址格式错误，正确的格式应为（如：https://www.xingtu.cn/ad/creator/author/douyin/6629660778767056899/1）',
          trigger: 'blur'
        }],
        sixPrice: [{ required: true, message: '请输入21-60s报价', trigger: ['blur', 'change'] }],
        quotePrice: [{ required: true, message: '请输入达人报价', trigger: ['blur', 'change'] }],
        customVideoPrice: [{ required: true, message: '请输入定制视频报价', trigger: ['blur', 'change'] }],
        videoPrice: [{ required: true, message: '请输入视频笔记报价', trigger: ['blur', 'change'] }],
        result: [{ required: true, message: '请选择本次沟通结果', trigger: 'change' }],
        describeList: [{ required: true, message: '请选择具体原因', trigger: 'change' }]
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      addForm: {
        platId: '',
        searchType: '1',
        userUrl: '',
        userId: '',
        eid: '',
        xingtuUrl: '',
        result: undefined,
        describeList: [],
        note: ''
      },
      platList: [],
      accountList: [],
      platMap: {},
      userInfo: null,
      disabledXingtuUrl: false,
      showXingtuUrlFlag: false,
      empowerDisabled: false,
      accountLoading: false,
      empowerLoading: false,
      btnLoading: false,
      loading: false,
      bindAgentlist: [],
      historyRecordList: [], // 历史沟通记录的数据
      communicateResList: [],
      describeList: [],
      showDescribeSelect: true,
      historyRecordLoading: false,
      bindAgentLoading: false, // 绑定经纪人的数据
      accountId: -1
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    showXingtuUrl() {
      return (this.dialogType !== 'edit' && this.showXingtuUrlFlag) || (this.dialogType === 'edit' && this.addForm.xingtuUrl)
    }
  },
  created() {
    this.getPlatList()
    this.getUserAccount()
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
    },

    handlePlatType(val) {
      this.disabledXingtuUrl = false
      this.showXingtuUrlFlag = false
      this.addForm.userUrl = ''
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.addForm.eid = ''
      this.addForm.result = undefined
      this.addForm.describeList = []
      this.addForm.note = ''
      switch (val) {
        case 25:
          this.addForm.searchType = '1'
          break
        default:
          this.addForm.searchType = '2'
      }
    },

    handleUserUrl() {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.empowerDisabled = false
    },

    handleChangeDyPrice(type) {
      console.info(type)
    },

    // 获取星图链接
    async getXingtuUrl(thirdId) {
      try {
        this.loading = true
        const { code, data, message = '' } = await $getXingtuUrl({
          platId: this.addForm.platId,
          thirdId
        })

        if (+code === 1) {
          this.showXingtuUrlFlag = true
          this.addForm.xingtuUrl = data.xingtuUrl
          if (data.xingtuUrl) {
            if (this.addForm.platId === 25) {
              this.$message.success('获取星图地址成功')
            }
            this.disabledXingtuUrl = true
          }
          this.bindAgentlist = data.bindUser || []
          this.accountId = data.accountId || -1
          this.getCommunicateResList()
          this.getAccountCommunicateList(this.addForm.platId, thirdId)
        } else {
          this.$message.error(message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$message.error(e?.message)
      }
    },

    /**
     * 授权
    */
    async empower() {
      const platId = this.addForm.platId
      if (!platId) {
        this.$message.error('请选择平台')
        return
      }
      this.empowerLoading = true
      const { platMap } = this
      const row = platMap[this.addForm.platId]
      let type = ''
      this.userInfo = null // 清空用户信息
      const params = { index_url: this.addForm.userUrl, realname: this.realname }
      try {
        const res = await request.get(`${HOST}${row.api1}`, { params: params })
        type = res.code === 1 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type
        })
        if (res.code === 1) {
          this.userInfo = res.data
          this.getXingtuUrl(res.data.user_id)
        }
      } catch (err) {
        this.$message.error({
          message: err.msg
        })
      }
      this.empowerLoading = false
    },

    getPlatList() {
      if (this.dialogType === 'edit') this.loading = true
      $getSignContractCondition().then((res) => {
        if (res.code === 1) {
          this.platList = res.data.plats || []

          if (this.dialogType === 'edit') {
            $getEditInfo({ accountId: +this.id }).then(({ code, message, data }) => {
              this.loading = false
              if (+code === 1) {
                this.addForm = {
                  ...this.addForm,
                  ...data.updateSignContractAccountPriceRequest,
                  userUrl: data.accountLoginUrl || '',
                  platId: data.platId || '',
                  remark: data.remark || '',
                  xingtuUrl: data.updateSignContractAccountPriceRequest.xingtuIndexUrl || '',
                  quotePrice: data.updateSignContractAccountPriceRequest.sixPrice
                }
              } else {
                this.$message.error(message)
              }
            })
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },

    getUserAccount() {
      $getUserAccount({ account_type: 4 }).then(res => {
        if (res.code === 1) {
          this.platMap = res.data.reduce((t, n) => {
            t[n.plat_id] = n
            return t
          }, {})
          this.platInfo = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },

    remoteMethod(query) {
      if (query !== '') {
        this.accountLoading = true
        this.getBaseInfo(query)
      } else {
        this.accountList = []
      }
    },

    async getBaseInfo(keyword) {
      const res = await $getBaseInfo({
        keyword,
        platId: this.addForm.platId
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
      this.accountLoading = false
    },

    handleAccountChange(userId) {
      this.empowerDisabled = true
      let data = null
      for (let index = 0; index < this.accountList.length; index++) {
        const element = this.accountList[index]
        if (element.eid === userId) {
          data = element
          break
        }
      }
      this.userInfo = data
      this.addForm.eid = data.eid
      this.addForm.userUrl = data.index_url
      // this.$refs.addForm
      this.$refs.addForm.validateField('eid')
      this.$refs.addForm.validateField('userUrl')
      this.getXingtuUrl(data.user_id)
    },

    async editAccount(params) {
      try {
        this.btnLoading = true
        if (params.platId === 26) {
          params.sixPrice = params.quotePrice
        }
        const { code, message } = await $updateSignContractAccountPrice({ accountId: this.id, ...params })
        this.btnLoading = false
        if (+code === 1) {
          this.$message.success('编辑成功')
          this.$emit('onClose')
          this.$emit('getList')
        } else {
          this.$message.error(message || '编辑失败')
        }
      } catch (e) {
        this.btnLoading = false
        this.$message.error(e || '编辑失败')
      }
    },

    async addAccount(form, { user_id, index_url, fans_num, avatar_uri, user_name, eid, sec_uid, unique_id }) {
      const params = {
        platId: form.platId,
        platName: this.platList.find(item => +item.platId === form.platId).platName,
        userId: user_id,
        accountLoginUrl: index_url,
        fansNum: fans_num,
        avatarUri: avatar_uri,
        userName: user_name,
        account: user_name,
        eid,
        secUid: sec_uid,
        remark: form.remark || '',
        url: form.userUrl,
        uniqueId: unique_id,
        xingtuIndexUrl: form.xingtuUrl || '',
        communicateRecordRequest: {
          result: form.result,
          describeList: form.describeList,
          note: form.note
        }
      }

      try {
        this.btnLoading = true
        const { code, data, message = '' } = await $addReadyAccount(params)
        this.btnLoading = false
        if (+code === 1 && !(data || []).length) {
            this.$message.success('添加成功')
            this.$emit('onClose')
            this.$emit('getAll')
        } else if (+code !== 1 && !Array.isArray(data)) {
          this.$message.error(message)
        } else {
          const str = data.join('、')
          this.$alert(`
            <div class="bindLimitWrap">
              <h3>达人已达到绑定上限</h3>
              <p style="margin-top: 6px">该达人已绑定了5个经纪人，无法再绑定新的经纪人。如需绑定，请先联系相关经纪人解绑后再重新绑定。</p>
              <p style="margin-top: 18px; font-weight: 600">当前已绑定经纪人：</p>
              <p style="margin-top: 6px">${str}</p>
            </div>
          `, '', {
            showConfirmButton: false,
            dangerouslyUseHTMLString: true
          })
        }
      } catch (e) {
        this.btnLoading = false
        this.$message.error(e)
      }
    },

    getPriceLabel(platId) {
      let str = ''
      switch (platId) {
        case 25:
          str = 'sixPrice'
          break
        case 26:
          str = 'quotePrice'
          break
        case 2:
          str = 'customVideoPrice'
          break
        case 45:
          str = 'videoPrice'
          break
      }

      return str
    },

     // 获取沟通结果下拉的列表数据
    async getCommunicateResList() {
      const { code, data } = await $getCommunicateResList({
        'dictTypes': ['sign_sche_result_list']
      })
      if (+code === 1) {
        this.communicateResList = data['sign_sche_result_list']
      }
    },

     // 处理本次沟通结果选择后的逻辑
    async handleCommunicateRes(val) {
      try {
        if (+val === 3) {
          this.showDescribeSelect = false
          this.addForm.describeList = []
          return
        } else {
          this.showDescribeSelect = true
        }
        const { code, data, message = '' } = await $getDescribeList({
          dictValue: val
        })
        if (+code === 1) {
          this.describeList = data
          this.addForm.describeList = []
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.$message.error(e?.message)
      }
    },

     // 获取历史沟通人列表信息
    async getAccountCommunicateList(platId, thirdId) {
      try {
        this.historyRecordLoading = true
        const { code, data, message = '' } = await $getAccountCommunicateList({
          platId,
          thirdId
        })
        this.historyRecordLoading = false
        if (+code === 1) {
          this.historyRecordList = data || []
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.historyRecordLoading = false
        this.$message.error(e?.message)
      }
    },

    handleChangeXingtuUrl(val) {
      if (val.indexOf('?') !== -1) {
        this.addForm.xingtuUrl = val.split('?')[0]
      } else {
        this.addForm.xingtuUrl = val
      }
    },

    handleSubmit() {
      // let count = 0
      // let isAllowNext = false
      // const price = this.getPriceLabel(this.addForm.platId)
      // let validateFieldArr = ['platId', 'userUrl', 'xingtuUrl']
      // if (this.dialogType === 'edit') {
      //   validateFieldArr = validateFieldArr.filter(item => item !== 'xingtuUrl')
      //   validateFieldArr.push(price)
      // }
      // validateFieldArr.forEach(item => {
      //   this.$refs['addForm'].validateField(item, err => {
      //     // 返回值为空时，验证通过；返回值非空时，验证失败
      //     if (err) return
      //     ++count
      //   })
      // })
      //  count === validateFieldArr.length ? isAllowNext = true : ''
      //  if (isAllowNext) {
      //    const params = { ...this.addForm }
      //     params.userId = params.eid
      //     if (this.dialogType === 'edit') {
      //       // 编辑
      //       this.editAccount(params)
      //     } else {
      //       if (!this.userInfo) {
      //         this.$message.error('请先进行授权')
      //         return
      //       }

      //       this.addAccount(params, this.userInfo)
      //     }
      //  }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          const params = { ...this.addForm }
          params.userId = params.eid
          if (this.dialogType === 'edit') {
            // 编辑
            this.editAccount(params)
          } else {
            if (!this.userInfo) {
              this.$message.error('请先进行授权')
              return
            }

            this.addAccount(params, this.userInfo)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.containerWrap {
  display: flex;

  .formWrap {
    width: 50%;
    padding-right:20px;
    margin-right: 20px;
  }

  .leftContainerWrap {
    border: 1px solid #000;
    width: 50%;
    // padding: 10px;

    .bindAgentWrap {
      padding: 10px;
      height: 12%;
      border-bottom: 1px solid #000;

      span {
        font-size: 16px;
      }
    }

    .historyWrap {
      padding: 10px;
      height: 780px;
      overflow: auto;
      margin-top: 6px;
    }

    h3 {
      font-size: 20px;

      &:nth-child(2) {
        margin-top: 10px;
        padding-left: 10px;
      }
    }

    .recordList {
      margin-top: 6px;
      // height: 820px;
      // overflow: auto;

      li {
        width: 100%;
        border: 1px solid #000;
        padding: 6px;
        text-align: left;
        margin-bottom: 14px;
        padding-left: 10px;
        border-radius: 6px;
        cursor: default;

        .top {
          display: flex;
          font-weight: 600;
          display: flex;
          align-items: center;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 10px;
          }

          i {
            font-size: 36px;
            margin-right: 16px
          }

          p {
            margin-top: 4px;
            font-size: 14px;
          }
        }

        .tag {
          margin: 8px 0;

          .el-tag {
            margin-right: 10px;
            margin-top: 6px;
          }
        }

        .recordText {
          font-weight: 600;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
    }
  }
}

.input-new-tag {
  width: 200px;
}
.account-img {
  width: 40px;
  border-radius: 50%;
  margin-right: 8px;
}
.account-name {
  font-weight: 700;
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-text1 {
  font-size: 14px;
  line-height: 1.2;
}
.account-text2 {
  line-height: 1.2;
  font-size: 12px;
  margin-top: 6px;
}
.account-search {
  ::v-deep {
    .el-input {
      width: 100%;
    }
  }
}
::v-deep {
  .el-select-dropdown__item {
    padding: 10px 20px;
  }

  .el-textarea {
    textarea {
      height: 150px
    }
  }

  .remarkWrap {
    margin-top: 44px;
  }
}
.account-id {
  line-height: 1.2;
  color: $--color-text-secondary;
}
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
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.plat-info {
  margin-top: 10px;
  img {
    width: 50px;
    height: 50px;
  }
}

.xingtuWrap {
  .el-input {
    width: 92%;
  }
}

.priceWrap {
  display: flex;
  flex-wrap: wrap;
}

.noData {
  // height: 100%;
  display: flex;
  justify-content: flex-start;
  font-size: 18px;
  margin: 10px 0;
}
</style>
