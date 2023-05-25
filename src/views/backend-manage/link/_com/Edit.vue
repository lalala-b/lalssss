<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-16 10:59:16
 * @LastEditTime: 2020-12-18 11:25:32
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    :title="title"
    :visible="editShow"
    :destroy-on-close="true"
    width="1200px"
    @open="handleOpen"
    @close="$emit('update:editShow', false)"
  >
    <div class="flex m-r-24-wrap">
      <div><strong>组件ID：</strong>{{ info.id }}</div>
      <div><strong>组件类型：</strong>{{ info.linkUseTypeName || '--' }}</div>
      <div><strong>组件渠道号：</strong>{{ info.androidDeliveryName }}</div>
      <div><strong>组件名称：</strong>{{ info.linkName }}</div>
    </div>
    <div class="flex m-r-24-wrap flex-align-center">
      <div><strong>组件品牌：</strong>{{ info.brandName }}</div>
      <div><strong>团队属性：</strong>{{ info.teamAttribute }}</div>
      <div><strong>业务标签：</strong>{{ info.businessTag }}</div>
      <div><strong>组件跳转链路：</strong>{{ info.businessType }}</div>
      <div><strong>投放渠道：</strong>{{ info.deliveryChannel }}</div>
      <!-- <div><strong>机型：</strong>
        <span v-if="types === 0">{{ info.phoneBrand ? `${info.phoneBrand}${info.phoneModel ? `-${info.phoneModel}`: ''}` : '' }}</span>
        <!-- <el-cascader
          v-else
          v-model="info.phoneModelId"
          placeholder="产品型号"
          :options="b2cPhoneModelData"
          :props="{
            checkStrictly: false,
            expandTrigger: 'hover',
            value: 'modelId',
            label: 'modelName',
            children: 'phoneModelVOList' }"
          filterable
          clearable
          :filter-method="dataFilter"
        /> 
        <el-cascader
          v-else
          v-model="info.phoneModelId"
          placeholder="请选择产品型号"
          :options="b2cPhoneModelData"
          :props="{
            checkStrictly: true,
            expandTrigger: 'hover',
            value: 'modelId',
            label: 'modelName',
            children: 'phoneModelVOList'
          }"
          filterable
          clearable
          :filter-method="dataFilter"
        />
      </div> -->
    </div>
    <div v-if="info.linkUseTypeName !== '评论置顶'" class="flex m-r-24-wrap">
      <div><strong>IOS-ID：</strong>{{ info.iosId }}</div>
      <div><strong>IOS应用下载链接：</strong><a :href="info.iosDownloadUrl" target="blank">{{ info.iosDownloadUrl }}</a></div>
    </div>
    <div><strong>Android-投放渠道名称：</strong>{{ info.androidDeliveryName }}</div>
    <div><strong>{{ info.androidDownloadUrlTitle || 'Android-下载链接' }}：</strong><a :href="info.androidDownloadUrl" target="blank">{{ info.androidDownloadUrl }}</a></div>
    <div v-if="info.deliveryChannel==='抖音'" class="flex flex-align-center">
      <strong>转码链接：</strong>
      <div v-if="info.transcodingUrl">
        <div v-for="item in info.transcodingUrl.split('\n')" :key="item">{{ item }}</div>
      </div>
      <!-- <span v-if="types === 0" span="12">{{ info.transcodingUrl }}</span> -->
      <!-- <el-input v-else v-model.trim="info.transcodingUrl" placeholder="转码链接" /> -->
    </div>

    <div v-if="info.deliveryChannel==='抖音'">
      <strong>转码状态：</strong>
      <span>{{ TRANSCODING_STATUS[info.transcodingStatus] }}</span>
    </div>
    <div><strong>Android-下载包名：</strong>{{ info.androidPackageName }}</div>
    <div v-if="info.linkUseTypeName !== '评论置顶' || info.linkUseTypeName !== '落地页组件'">
      <strong>APP调起链接：</strong>
      <span ref="androidAwakenUrl" class="editStyle" @click="editAndroidAwakenUrl">{{ info.androidAwakenUrl }}</span>
      <el-input ref="androidAwakenUrlInput" v-model="info.androidAwakenUrl" style="display:none;width:80%" @blur="getNewAndroidAwakenUrl" />
    </div>
    <div><strong>安卓隐私政策链接：</strong><a :href="info.androidPrivacyPolicyUrl" target="blank">{{ info.androidPrivacyPolicyUrl }}</a></div>
    <div v-if="info.clickMonitorUrl"><strong>组件监测链接：</strong><a :href="info.clickMonitorUrl" target="blank">{{ info.clickMonitorUrl }}</a></div>
    <div v-if="info.clickMonitorUrl"><strong>曝光监测链接：</strong><a :href="formatUrl(info.clickMonitorUrl)" target="blank">{{ formatUrl(info.clickMonitorUrl) }}</a></div>
    <!-- <div class="flex m-r-24-wrap"> -->
    <!-- <div class="m-r-24"><strong>创建人：</strong>{{ info.createdBy }}</div> -->
    <!-- <div><strong>创建时间：</strong>{{ info.createTime }}</div> -->
    <!-- </div> -->
    <div class="flex m-r-24-wrap">
      <div class="flex flex-0">
        <strong class="flex-0">组件状态：</strong>
        <span>{{ info.enableStr }}</span>
        <!-- <el-select v-else placeholder="是否启用" /> -->
      </div>
      <div class="flex">
        <strong class="flex-0">使用方：</strong>
        <span v-if="types === 0">{{ info.userName }}</span>
        <el-select
          v-else
          v-model="info.userIdName"
          :filterable="true"
          :clearable="true"
          placeholder="使用方"
          @change="getDFInfo"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.name"
            :value="item.idName"
          />
        </el-select>
      </div>
      <div class="flex">
        <strong class="flex-0">用户所属军：</strong>
        <span v-if="types === 0">{{ info.dName }}</span>
        <el-select
          v-else
          v-model="info.dId"
          placeholder="用户所属军"
          :filterable="true"
          :clearable="true"
          @change="hanleDIdchange"
        >
          <el-option
            v-for="item in dIdList"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          />
        </el-select>
      </div>
      <div class="flex">
        <strong class="flex-0">用户所属团：</strong>
        <span v-if="types === 0">{{ info.fName }}</span>
        <el-select
          v-else
          v-model="info.fId"
          placeholder="用户所属团"
          :clearable="true"
        >
          <el-option
            v-for="item in fIdList"
            :key="item.orgId"
            :label="item.orgName"
            :value="item.orgId"
          />
        </el-select>
      </div>
    </div>
    <div class="flex">
      <strong class="flex-0 m-r-10">组件启用人员: </strong>
      <span>{{ info.designateUserName }}</span>
    </div>
    <div class="flex">
      <strong class="flex-0 m-r-10">备注: </strong>
      <span v-if="types === 0">{{ info.remark }}</span>
      <el-input v-else v-model="info.remark" type="textarea" />
    </div>
    <template v-if="types !== 0" slot="footer">
      <el-button @click="$emit('update:editShow', false)">取 消</el-button>
      <el-button :loading="editLoading" type="primary" @click="hanleEditSave">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { $getLinkDetail, $getUserDFInfo, $updateLink, $gerUserInfo } from '@/api/link'
import { $getOrgCondition } from '@/api'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'

const TRANSCODING_STATUS = {
  0: '无需转码',
  1: '待转码',
  2: '已转码'
}

export default {
  props: {
    types: {
      // 0 - 查看、1 - 编辑
      type: Number,
      default: 0
    },
    editShow: {
      type: Boolean,
      default: false
    },
    linkId: {
      type: [String, Number],
      default: ''
    },
    dIdList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      editLoading: false,
      info: {},
      fIdList: [],
      userList: [],
      TRANSCODING_STATUS,
      // editForm: {
      //   newB2CPhoneModelId: '',
      //   newAndroidAwakenUrl: ''
      // },
      b2cPhoneModelData: []
      // edit: {
      //   userId: '',
      //   dId: '',
      //   dName: '',
      //   fName: '',
      //   fId: '',
      //   remark: ''
      // }
    }
  },
  computed: {
    title() {
      return this.types === 0 ? '查看组件link信息' : '编辑组件link信息'
    }
  },
  created() {
    $gerUserInfo().then(res => {
      if (res.code === 1) {
        this.userList = res.data
      } else {
        this.$message.error(res.message)
      }
    }).catch(err => {
      if (err.__CANCEL__) {
        return
      }
      this.$message.error(err.message)
    })
    this.getB2CPhoneModel()
  },
  methods: {
    formatUrl(clickMonitorUrl) {
      return clickMonitorUrl.replace('/douyin/track', '/douyin/show')
    },
    getDetailByLinkId() {
      $getLinkDetail({
        linkId: this.linkId
      }).then(res => {
        if (res.code === 1) {
          this.info = res.data
          // this.info.phoneModelId = this.getPhoneModelId(this.info.phoneModelId || this.info.phoneBrandId)
          // console.log(this.info, 'this.info')
        if (this.info.dId) {
            $getOrgCondition({ orgId: this.info.dId }).then(res => {
              if (res.code === 1) {
                this.fIdList = res.data || []
              } else {
                this.$message.error(res.message)
              }
            }).catch(err => {
              if (err.__CANCEL__) {
                return
              }
              this.$message.error(err.message)
            })
          }
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    handleOpen() {
      this.getDetailByLinkId()
    },
   hanleEditSave() {
      this.editLoading = true
      // const modelId = this.info.phoneModelId[this.info.phoneModelId.length - 1]
      // const brandId = this.info.phoneModelId[0]
      const params = {
        linkId: this.linkId,
        userName: '',
        userId: '',
        dName: '',
        dId: '',
        fName: '',
        fId: '',
        remark: this.info.remark,
        // modelId,
        androidAwakenUrl: this.info.androidAwakenUrl
        // brandId
      }
      // if (this.info.phoneModelId.length === 1) {
      //   delete params['modelId']
      // }
      if (!this.info.userIdName) {
        this.setWarning('请选择使用方')
        return
      }
      if (!this.info.dId) {
        this.setWarning('请选择用户所属军')
        return
      }
      // if (!modelId) {
      //   this.setWarning('请选择机型')
      //   return
      // }
      // if (!this.info.fId) {
      //   this.$message.warning('请选择用户所属团')
      //   return
      // }
      if (this.info.fId) {
        params.fId = this.info.fId
        params.fName = this.fIdList.find(item => (item.orgId === this.info.fId)).orgName
      }
      params.dId = this.info.dId
      params.dName = this.dIdList.find(item => (item.orgId === this.info.dId)).orgName
      params.userId = this.info.userIdName.split(',')[0]
      params.userName = this.info.userIdName.split(',')[1]
      params.transcodingUrl = this.info.transcodingUrl
      $updateLink(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$emit('update:editShow', false)
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
        this.editLoading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.editLoading = false
      })
    },
    // 获取用户的军和团
    async getDFInfo() {
      const userIdName = this.info.userIdName
      if (userIdName) {
        try {
          const userDFInfo = await $getUserDFInfo({ userId: userIdName.split(',')[0] })
          if (userDFInfo.code === 1) {
            this.info.dId = userDFInfo.data.dId || ''
            this.info.fId = userDFInfo.data.fId || ''
          } else {
            throw (userDFInfo)
          }
          const dIdList = await $getOrgCondition({ orgId: userDFInfo.data.dId })
          if (dIdList.code === 1) {
            this.fIdList = dIdList.data
          } else {
            throw (dIdList)
          }
        } catch (err) {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        }
      } else {
        this.fIdList = []
        this.info.dId = ''
        this.info.fId = ''
      }
    },
    hanleDIdchange(dId) {
      this.fIdList = []
      this.info.fId = ''
      if (dId) {
        $getOrgCondition({ orgId: dId }).then(res => {
          if (res.code === 1) {
            this.fIdList = res.data || []
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
      }
    },
    editAndroidAwakenUrl() {
      // this.$refs.androidAwakenUrl.contentEditable = true
      // console.log(this.$refs.androidAwakenUrlInput)
      if (this.types === 0 || !this.$permission('link_darsion_edit')) {
        return
      }
      this.$refs.androidAwakenUrl.style.display = 'none'
      this.$refs.androidAwakenUrlInput.$el.style.display = 'inline-block'
      this.$nextTick(() => {
        this.$refs.androidAwakenUrlInput.focus()
      })
    },
    getNewAndroidAwakenUrl(e) {
      if (!this.info.androidAwakenUrl) {
        this.setWarning('APP调起链接不能为空')
        return
      }
      this.$refs.androidAwakenUrl.style.display = 'inline'
      this.$refs.androidAwakenUrlInput.$el.style.display = 'none'
      this.info.newAndroidAwakenUrl = e.target.value
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        this.b2cPhoneModelData = data || []
        // console.log(this.b2cPhoneModelData, 'b2cPhoneModelData')
      }
    },
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    },
    setWarning(str) {
      this.$message.warning(str)
      this.editLoading = false
    }
    // getPhoneModelId(value) {
    //   let arr = []
    //   const itemObj = this.b2cPhoneModelData.find(item => {
    //     return +item.modelId === +value
    //   })

    //   if (!itemObj) {
    //     this.b2cPhoneModelData.forEach(item => {
    //       item.phoneModelVOList.forEach(item1 => {
    //         if (+item1.modelId === +value) {
    //           arr = [+item.modelId, +value]
    //         }
    //       })
    //     })
    //   } else {
    //     arr = [+value]
    //   }

    //   return arr
    // }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-dialog__body {
      line-height: 18px;
      > div {
        margin-bottom: 28px;
      }
      .m-r-24-wrap {
        > div {
          align-items: center;
          margin-right: 40px;
          &::last-child {
            margin-right: 0;
          }
        }
      }
    }
  }
  .flex-0 {
    flex-shrink: 0;
  }
  .flex-content-center {
    align-items: center;
    // align-content: center;
  }
  .el-input {
    width: 400px;
  }
  // .editStyle{
  //   // padding:2px 6px;
  //   // display: none;
  // }
</style>
