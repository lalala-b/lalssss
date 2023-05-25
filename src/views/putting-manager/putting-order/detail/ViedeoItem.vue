<template>
  <Wrap :loading="giveLoading">
    <div data-bold class="flex flex-justify-between m-b-20">
      <h2 class="title flex flex-algin-center">视频信息</h2>

      <div class="flex flex-justify-between flex-align-center">
        <EditItem v-if="+showType === 6" v-model="isEditDamages" edit-content="编辑违约金" save-content="保存违约金" cancel-content="取消编辑违约金" @handleSave="handleSaveDamages" @handleCancel="handleCancelDamages" />

        <EditItem v-if="showAction || shouldShowAction" v-model="isEdit" edit-content="编辑视频" save-content="保存视频" cancel-content="取消编辑视频" @handleSave="handleSave" @handleCancel="handleCancel" />
      </div>

      <!-- <EditItem v-if="this.$orderData.videoExamineInfoVO.orderCooperationStatus !== 0 && this.$orderData.businessStatus === 17" v-model="isEditAddVideo" @handleSave="handleSaveAddVideo" @handleCancel="handleCancelAddVideo" /> -->
    </div>
    <p v-if="showType == 3" class="status-tip">待发布</p>
    <p v-if="showType == 5" class="status-tip">等待达人发布视频后提交视频相关信息！</p>
    <p v-if="showType == 2" class="status-tip m-b-10">{{ ($orderData.videoExamineInfoVO && $orderData.videoExamineInfoVO.note) || '达人放弃合作' }}</p>
    <div v-if="showType == 4 && !showVideoInfo && $orderData.businessStatus !== 17" class="btn-item">
      <p class="btn-item_tip">达人是否已接单待发布视频？</p>
      <div class="m-t-10">
        <el-tooltip
          content="平台订单ID在星图/聚星已取消！请点击放弃合作。"
          placement="top"
          :disabled="!btnSuccessFlag"
        >
          <span class="m-r-12"> <el-button type="success" :disabled="btnSuccessFlag" icon="el-icon-check" @click="handleShowVideoInfo">是，已发布</el-button></span>
        </el-tooltip>
        <!-- <el-button type="success" icon="el-icon-check" @click="handleShowVideoInfo">是，已发布</el-button> -->
        <el-button type="danger" icon="el-icon-close" @click="handleShowCancelDialog">否，放弃合作</el-button>
      </div>
    </div>

    <div v-if="showType == 4 && $orderData.businessStatus === 17" class="btn-item m-b-20">
      <p class="btn-item_tip">选择放弃合作的原因？</p>
      <el-button class="m-t-10" type="danger" icon="el-icon-close" @click="handleShowCancelDialog">选择放弃合作的原因</el-button>
    </div>

    <div v-if="+showType === 6" class="m-b-10">
      <p class="status-tip m-b-10">我司放弃投放，中止合作！</p>
      <span class="damagesTitle">支付违约金：</span>
      <el-input-number
        v-show="isEditDamages"
        v-model="$orderData.videoExamineInfoVO.orderLiquidatedDamages"
        :min="0"
        :precision="0"
        @blur="handleBlur"
        @input="handleInput"
      />
      <span v-show="!isEditDamages" class="damagesTitle">
        {{ $orderData.videoExamineInfoVO.orderLiquidatedDamages || 0 }}
      </span>
      <br>
      <span v-if="isEditDamages && error" class="red">支付违约金不得超过投放订单的平台消耗金额！</span>
    </div>

    <el-form
      v-if="showVideoInfo || $orderData.midDeliveryVideoNewBaseInfoBO&&+$orderData.midDeliveryVideoNewBaseInfoBO.platId===26&&videoForm.videoInfo.length"
      ref="form"
      inline
      label-suffix="："
      class="video-form"
      :model="videoForm"
    >
      <div v-if="$orderData.videoExamineInfoVO && $orderData.videoExamineInfoVO.sysVideoCheck" class="tip-red">{{ $orderData.videoExamineInfoVO.sysVideoCheck }}</div>
      <el-form-item v-if="isEdit && videoForm.videoInfo.length < videoMaxLen" label="视频录入" class="video">
        <div class="m-b-10">
          <el-button :type="videoType === 1 ? 'primary': ''" @click="handleVideoTypeChange(1)">选择视频</el-button>
          <el-button :type="videoType === 2 ? 'primary': ''" @click="handleVideoTypeChange(2)">手工录入视频</el-button>
        </div>
        <div v-if="videoType === 2">
          <el-input v-model="videoAuthHref" class="m-t-5 m-b-5 w-500">
            <el-button slot="append" type="primary" :loading="authLoading" @click="handleAuth">授权</el-button>
          </el-input>
          <p>填写视频链接后需点击右侧授权按钮！</p>
        </div>
      </el-form-item>
      <div class="flex flex-wrap m-t-10">
        <VideoBox
          v-for="(item, index) in videoForm.videoInfo"
          :key="item.flowId"
          :index="index"
          :video-info="item"
          :is-edit="isEdit"
          :plat-id="$orderData.midDeliveryVideoNewBaseInfoBO.platId"
          @del="handleDelectVideo(index)"
        />
      </div>
    </el-form>
    <!-- <div v-if="showCancelDialog">
      <p>请确认订单当前情况后选择下方状态，</p>
      <p>若达人放弃合作则进入下一个流程进行资金核算！</p>
      <div class="m-t-10">
        <el-button @click="showCancelDialog = false">达人尚未发布视频</el-button>
        <el-button :loading="giveLoading" type="primary" @click="handleGiveUp">达人放弃合作</el-button>
      </div>
    </div> -->
    <VideoList
      v-if="showVideoList"
      v-model="showVideoList"
      :account-id="$orderData.midDeliveryVideoNewBaseInfoBO.accountId"
      :plat-id="$orderData.midDeliveryVideoNewBaseInfoBO.platId"
      :flow-id="videoForm.videoInfo.flowId"
      @confirm="handleChangeVideo"
    />

    <AbandonVideoDialog
      :show="showCancelDialog"
      :give-loading="giveLoading"
      @close="showCancelDialog = false"
      @confirm="handleConfirmAbandon"
    />
  </Wrap>
</template>
<script>
import request from '@/http'
import { mapGetters } from 'vuex'
import EditItem from './_com/EditItem'
import VideoList from '../../_mods/viedeoList'
import VideoBox from './Video.vue'
import AbandonVideoDialog from './AbandonVideoDialog.vue'
import { copy } from '@/utils'
import { $savePostVideoInfo, $editPostVideoInfo, $findFlowData, $saveOrderLiquidatedDamages } from '@/api/putting-manager'

import { PYTHON_HOST } from '@/const'
export default {
  components: { EditItem, VideoList, VideoBox, AbandonVideoDialog },
  data() {
    return {
      showCancelDialog: false,
      showVideoInfo: false,
      videoUploading: false,
      giveLoading: false,
      isEdit: false,
      isEditDamages: false,
      lastDamages: 0,
      editFlag: false,
      error: false,
      showAction: false,
      showVideoList: false,
      videoAuthHref: '',
      authLoading: false,
      videoForm: {
         videoInfo: []
      },
      videoType: 1
      // isEditAddVideo: false // 放弃合作后，编辑添加视频信息
    }
  },
  inject: ['$orderData'],
  computed: {
    ...mapGetters([
      'realname'
    ]),
    showType() {
      if (this.$orderData.videoExamineInfoVO) {
        if (this.$orderData.videoExamineInfoVO.examineStatus === 1) {
          // 显示付款信息
          return 1
        } else {
        /**
         *orderCooperationStatus:订单是否放弃合作:0-否（合作中），1-是（放弃合作）,2-是(我司放弃合作),5-系统判断放弃合作
        */
          const orderCooperationStatus = +this.$orderData.videoExamineInfoVO.orderCooperationStatus
          switch (orderCooperationStatus) {
            case 1:
              return 2
            case 5:// 系统判断放弃合作
            if (+this.$orderData.examineAuth === 1) {
              return 4
            } else {
              return 3
            }
            default:
              return 6
          }
          // if (+this.$orderData.videoExamineInfoVO.orderCooperationStatus === 1) {
          //   // 显示达人放弃驳回信息
          // return 2
          // } else if (+this.$orderData.videoExamineInfoVO.orderCooperationStatus === 1) {
          //   this.btnSuccessFlag = true
          // } else {
          //   // 显示公司违约信息
          //   return 6
          // }
        }
      } else if (this.$orderData.businessStatus === 6) {
        // businessStatus订单状态 1：一级待审核（1.5W以下需一级审核）2：二级待审核（1.5W及以上需二级审核）5：待下单付款 6：待发布提交7：待资金核算8：已驳回 9：已取消 10：已完成' 17：'待平台订单完成'
        if (this.$orderData.examineAuth === 1) {
          // 有操作权限 显示按钮
          return 4
        } else {
          // 显示等待等待审核
          return 5
        }
      } else {
        return 3
      }
    },
    shouldShowAction() {
      // 若该订单已取消合作(达人或我司) 且 有对应的编辑权限 且 该订单状态为待平台订单完成，则显示编辑视频信息的按钮
      if (
        this.$orderData.videoExamineInfoVO &&
        (this.$orderData.videoExamineInfoVO.orderCooperationStatus === 1 || this.$orderData.videoExamineInfoVO.orderCooperationStatus === 2) &&
        this.$orderData.videoExamineInfoVO.editAuth === 1 &&
        this.$orderData.businessStatus === 17
      ) {
        return true
      }
      return this.$orderData.videoExamineInfoVO && this.$orderData.videoExamineInfoVO.editAuth === 1 && this.$orderData.videoExamineInfoVO.examineStatus === 1
    },
    videoMaxLen() {
      // return 5
      return this.$orderData && this.$orderData.midDeliveryVideoNewBaseInfoBO.videoMaxLen || 1
    },
    btnSuccessFlag() {
      /**
       *orderCooperationStatus:订单是否放弃合作:0-否（合作中），1-是（放弃合作）,2-是(我司放弃合作),5-系统判断放弃合作
      */
      return !!(this.$orderData.midDeliveryVideoNewBaseInfoBO && this.$orderData.midDeliveryVideoNewBaseInfoBO.orderCooperationStatus === 5)
    }
  },
  watch: {
    '$orderData.videoExamineInfoVO'(val) {
      if (!val) {
        this.videoForm.videoInfo = []
        this.showVideoInfo = false
      } else {
        this.lastDamages = this.$orderData.videoExamineInfoVO.orderLiquidatedDamages || 0
        this.videoForm.videoInfo = copy(val.deliveryRelationVideoDetailBOList || [])
        // if (this.videoForm.videoInfo.length) {
        //   this.showKsVideo= true
        // }
        if (this.editFlag) {
          setTimeout(() => {
            this.isEditDamages = true
          })
          this.editFlag = false
        }
      }
    },
    isEdit() {
      if (this.$orderData.videoExamineInfoVO) {
        this.videoForm.videoInfo = copy(this.$orderData.videoExamineInfoVO.deliveryRelationVideoDetailBOList || [])
      }
      this.videoType = 1
      this.videoAuthHref = ''
    },
    isEditDamages() {
      this.error = false
    },
    showType(val) {
      // 有视频信息且通过状态 或 订单放弃合作 或 系统判定放弃合作且该订单状态为待平台订单完成，就显示对应的视频信息
      if (val === 1 || val === 2 || val === 6 || (val === 4 && this.$orderData.businessStatus === 17)) {
        this.showVideoInfo = true
      } else {
        this.showVideoInfo = false
      }
    }
  },
  created() {
    this.$bus.$on('handleCancel', () => {
      this.showAction = false
    })
  },
  beforeDestroy() {
     this.$bus.$off('handleCancel')
  },
  methods: {
    onImportError(type) {
      return (err) => {
        this.$message.error('上传失败，请重试~')
        this.disabled = false
        if (type === 'video') {
          this.videoUploading = false
        } else {
          this.imgUploading = false
        }
      }
    },
    onImportSuccess(type) {
      return (res) => {
        if (res && res.code === 1) {
          this.$message.success('上传完成')
          if (type === 'video') {
            this.videoForm.videoInfo.uploadUrl = res.data
            this.videoUploading = false
          } else {
            this.imgUploading = false
            this.videoForm.videoInfo.imgUrl = res.data
          }
        } else {
          this.$message.error(res.message)
          if (type === 'video') {
            this.videoUploading = false

            this.videoForm.videoInfo.uploadUrl = ''
          } else {
            this.imgUploading = false
            this.videoForm.videoInfo.imgUrl = ''
          }
        }
        this.disabled = false
      }
    },
    onBeforeUpload(type) {
      return () => {
        if (type === 'video') {
          this.videoUploading = true
        } else {
          this.imgUploading = true
        }
      }
    },
    openUrl(url) {
      window.open(url)
    },
    handleVideoTypeChange(type) {
      if (type === 1 && (this.videoType === type || !this.videoForm.videoInfo.flowId)) {
        this.showVideoList = true
      }
      if (type !== this.videoType) {
        this.videoType = type
      }
    },
    // 授权
    async handleAuth() {
      this.authLoading = true
      if (!this.videoAuthHref) {
        this.$message.error('视频链接不能为空')
        this.authLoading = false
        return
      }
      try {
        if (!this.authApiList) {
          await this.getAuthApiList()
        }
        const platId = this.$orderData.midDeliveryVideoNewBaseInfoBO.platId
        const api = this.authApiList.find(item => (item.plat_id === platId))
        if (!api) {
          this.authLoading = false
          return this.$message.error('该平台暂不支持')
        }
        const videoRes = await request.get(`${PYTHON_HOST}${api.api1}`, { params: { index_url: encodeURI(this.videoAuthHref), realname: this.realname }, timeout: 1000 * 60 })
        if (videoRes.code !== 1) {
          this.authLoading = false
          return this.$message.error(videoRes.msg)
        } else {
          const medFlowVideoInfoRequest = {}
          const pattern = /_([a-z])/gi
          for (const key in videoRes.data) {
            const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
            medFlowVideoInfoRequest[k] = videoRes.data[key]
          }
          medFlowVideoInfoRequest.saveVideoType = 2 // 视频选择方式 2 - 授权
          medFlowVideoInfoRequest.sysVideoUpdateFlag = 0 // 视频系统更新标志 0=未更新 1=更新
          this.videoAuthHref = ''
          if (!this.checkRepeat(medFlowVideoInfoRequest.thirdId)) {
            this.videoForm.videoInfo.unshift(medFlowVideoInfoRequest)
          }
          this.authLoading = false
        }
      } catch (err) {
        this.authLoading = false
        this.$message.error(err.msg || '系统错误')
      }
    },
    checkRepeat(id) {
      return !!this.videoForm.videoInfo.find(item => item.flowId === id || item.thirdId === id)
    },
    // 获取Python的API列表
    getAuthApiList() {
      return new Promise((resolve, reject) => {
        request.get(`${PYTHON_HOST}/plat_info`, { params: { account_type: 6 }}).then(res => {
          if (res.code === 1) {
            this.authApiList = res.data
            return resolve()
          } else {
            return reject(res)
          }
        })
      })
    },
    // 保存
    async handleSave(fn) {
      if (this.showVideoInfo || this.$orderData.videoExamineInfoVO) {
        // 视频发布保存
        try {
          await this.$refs.form.validate()
          const $api = this.$orderData.videoExamineInfoVO ? $editPostVideoInfo : $savePostVideoInfo
          // 点击【是，已发布】的按钮时，传递orderCooperationStatus的值为0，否则不传
          const orderCooperationStatus = this.showAction ? 0 : null
          const res = await $api({
            medFlowVideoInfoRequest: this.videoForm.videoInfo,
            examineStatus: 1,
            orderCooperationStatus,
            orderId: this.$route.query.orderId
          })
          if (res.code === 1) {
            this.$emit('update', () => {
              this.isEdit = false
              this.$message.success(res.message || '操作成功')
              fn()
            })
          } else {
            const message = res.message || ''
            if (message.indexOf('投放次数' || '已达上限') > -1) {
              let businessLineDate = ''
              if (this.videoForm.videoInfo && this.videoForm.videoInfo.length) {
                const datelist = []
                this.videoForm.videoInfo.forEach(item => {
                  datelist.push(item.addTime)
                })
                businessLineDate = datelist.sort((a, b) => a - b)[0]
              }
              this.$emit('handleBusinessDialog', businessLineDate)
            } else {
              this.$message.error(res.message)
            }
            fn()
          }
        } catch (err) {
          fn()
        }
      }
    },
    // 达人放弃合作
    handleGiveUp() {
      this.giveLoading = true
      $savePostVideoInfo({
        ...this.videoForm.videoInfo,
        examineStatus: 2,
        orderCooperationStatus: 1,
        orderId: this.$route.query.orderId
      }).then(res => {
        if (res.code === 1) {
          this.$message.success(res.message || '操作成功')
          this.$emit('update', () => {
            this.showCancelDialog = false
          })
        } else {
          this.showCancelDialog = false
          this.$message.error(res.message)
        }
        this.giveLoading = false
      }).catch(err => {
        this.giveLoading = false
        this.showCancelDialog = false
      })
    },
    // 公司放弃合作
    handleBusinessGiveUp() {
      this.giveLoading = true
      $savePostVideoInfo({
        ...this.videoForm.videoInfo,
        examineStatus: 2,
        orderCooperationStatus: 2,
        orderLiquidatedDamages: 0,
        orderId: this.$route.query.orderId
      }).then(res => {
        this.showCancelDialog = false
        if (res.code === 1) {
          this.$message.success(res.message || '操作成功')
          this.editFlag = true

          this.$nextTick(() => {
            this.$emit('update', () => {
              this.showCancelDialog = false
            })
          })
        } else {
          this.$message.error(res.message)
        }
        this.giveLoading = false
      }).catch(err => {
        this.giveLoading = false
        this.showCancelDialog = false
      })
    },

    handleConfirmAbandon({ type }) {
      if (+type === 1) {
        this.handleGiveUp()
      } else {
        this.handleBusinessGiveUp()
      }
    },

    handleSaveDamages(fn) {
      if ((this.$orderData.videoExamineInfoVO.orderLiquidatedDamages || 0) > (this.$orderData.midDeliveryVideoNewBaseInfoBO || {}).consumeAmount || 0) {
        this.error = true
        fn()
        return
      } else {
        this.error = false
      }

      if (this.error) return

      this.giveLoading = true
      $saveOrderLiquidatedDamages({
        examineStatus: 2,
        orderCooperationStatus: 2,
        orderLiquidatedDamages: this.$orderData.videoExamineInfoVO.orderLiquidatedDamages || 0,
        orderId: this.$route.query.orderId
      }).then(res => {
        this.isEditDamages = false
        fn()
        if (res.code === 1) {
          this.$message.success(res.message || '操作成功')
          this.$emit('update', () => {
            this.showCancelDialog = false
          })
        } else {
          this.$message.error(res.message)
        }
        this.giveLoading = false
      }).catch(() => {
        this.giveLoading = false
        fn()
      })
    },

    handleCancelDamages() {
      this.$orderData.videoExamineInfoVO.orderLiquidatedDamages = this.lastDamages || 0
    },

    handleBlur(e) {
      if (!e.target.value) {
        this.$orderData.videoExamineInfoVO.orderLiquidatedDamages = 0
      }
    },

    handleInput(val) {
      if (+val > (this.$orderData.midDeliveryVideoNewBaseInfoBO || {}).consumeAmount || 0) {
        this.error = true
        return
      } else {
        this.error = false
      }
    },

    // 视频选择
    handleChangeVideo(res) {
      if (this.$orderData.midDeliveryVideoNewBaseInfoBO.platId === 25) {
        this.findFlowData(res)
      }
      const defaultVideoInfo = {
          cptClick: '',
          flowId: '',
          titleName: '',
          flowCount: '',
          uploadUrl: '',
          imgUrl: '',
          videoCoverUrl: '',
          saveVideoType: 1,
          sysVideoUpdateFlag: 0
      }
      if (!this.checkRepeat(res.flowId)) {
        this.videoForm.videoInfo.unshift(Object.assign({}, defaultVideoInfo, res))
      }
    },
    // 星图获取视频流量
    findFlowData(data) {
      $findFlowData({
        platId: this.$orderData.midDeliveryVideoNewBaseInfoBO.platId,
        flowId: data.flowId
      }).then(res => {
        if (res.code === 1 && res.data) {
          this.$set(this.videoForm.videoInfo[this.videoForm.videoInfo.length - 1], 'flowData', res.data)
        }
      })
    },
    handleCancel() {
      // this.videoForm.videoInfo = copy(this.$orderData.videoExamineInfoVO.deliveryRelationVideoDetailBOList)
      if (!this.$orderData.videoExamineInfoVO) {
        this.showAction = false
        this.showVideoInfo = false
      } else {
        this.isEdit = false
      }
      this.$refs.form.clearValidate()
    },
    handleShowVideoInfo() {
      this.showVideoInfo = true
      this.showAction = true
      this.isEdit = true
    },
    handleShowCancelDialog() {
      this.showCancelDialog = true
    },
    handleDelectVideo(index) {
      this.videoForm.videoInfo.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.video-item {
  font-size: 16px;
}
::v-deep {
  .iconshanchu_fill {
    font-size: 24px;
    color: #fd494c;
  }
}
.w-366 {
  width: 366px;
}
.video-form {
  .el-form-item {
    display: inline-flex;
  }
  .upload-wrap {
    position: relative;
    width: 200px;
    height: 130px;
    padding: 8px;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    &.upload-show {
      width: 100px;
      height: 64px;
      border:0;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &:hover {
      .upload-wrap-actions {
        opacity: 1;
      }
    }
    .upload-wrap-actions {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: rgb(255, 255, 255);
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0 ,.5);
      transition: opacity .3s;
      display: flex;
      align-items: center;
      justify-content: center;
      > span {
        &:nth-child(n+2) {
          margin-left: 8px;
        }
      }
    }
  }
}
.btn-item {
  &_tip {
    margin-top: 20px;
    font-size: 16px;
    color: #272727;
    line-height: 22px;
  }
}
.w-500 {
  width: 500px;
}
.tip-red {
  line-height: inherit;
  font-size: 16px;
  margin-bottom: 10px;
}
</style>
<style lang="scss">
  .video-raido {
    .el-radio__label {
      display: none;
    }
  }

  .damagesTitle {
    font-size: 14px;
  }

  .red {
    color: #ff0000;
    padding-left: 84px;
    margin-top: 4px;
  }
</style>
