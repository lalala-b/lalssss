<template>
  <el-drawer
    v-loading="loading"
    size="800px"
    :visible.sync="showDrawer"
    class="drawer"
    :before-close="handleClose"
  >
    <template slot="title">
      <div class="flex">
        <el-tag effect="dark" class="tag">
          客户联系人
        </el-tag>
        <span class="companyName">{{ detail.customerName }}</span>
      </div>
    </template>

    <!-- <wrap>
      <p class="titleBox">
        <span class="title">所属公司信息</span>
        <span class="notice">（{{ detail.companyName }}）</span>
        <el-button type="text">查看详情</el-button>
      </p>
    </wrap> -->

    <wrap>
      <p class="titleBox">
        <span class="title">所属公司信息</span>
        <span class="notice">（{{ detail.companyName || '--' }}）</span>
        <el-button type="text" @click="handleGoCustomerDetail">查看详情</el-button>
      </p>
      <el-form label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户级别">
              <span class="notice">敬请期待</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主要合作类型">
              <span>{{ detail.mainCustomerTypeName || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行业类别">
              <span>{{ detail.industryName || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="自营返点区间">
              <template slot="label">
                <span>自营返点区间</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>1、自营返点上限不能高于25%，不填下限即为无下限</div>
                    <div>2、该客户后续合作的商机、商单，其返点均不允许超出该区间</div>
                  </template>
                </IconTip>
              </template>
              <span>{{ detail.selfMin || '--' }}% ~ {{ detail.selfMax || '--' }}%</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="签约返点区间">
              <template slot="label">
                <span>签约返点区间</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>1、签约返点上限不能高于20%，不填下限即为无下限</div>
                    <div>2、该客户后续合作的商机、商单，其返点均不允许超出该区间</div>
                  </template>
                </IconTip>
              </template>
              <span>{{ detail.signMin || '--' }}% ~ {{ detail.signMax || '--' }}%</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大联系人上限">
              <template slot="label">
                <span>最大联系人上限</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>为了避免单个客户有过多的联系人，导致客户跟进效率低，不利于商务的跟进效率。</div>
                  </template>
                </IconTip>
              </template>
              <span>{{ detail.maxConnectLimit || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="主对接人">
              <template slot="label">
                <span>主对接人</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>可为空。主对接人负责拉齐所有与该客户相关的所有信息，包括但不限于返点年政策、商机合作等。</div>
                  </template>
                </IconTip>
              </template>
              <span>{{ detail.mainConnectName || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </wrap>

    <wrap>
      <p class="titleBox">
        <span class="title">详细信息</span>
      </p>
      <el-form label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="所属部门">
              <span>{{ detail.customerDepartment || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="职位">
              <span>{{ detail.customerPosition || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性别">
              <span>{{ detail.genderDesc || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="出生年代">
              <span>{{ detail.bornAgeDesc || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <span>{{ detail.note || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="归属商务">
              <template slot="label">
                <span>归属商务</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>该联系人的归属商务。但不一定是该联系人的归属客户的主对接人。</div>
                  </template>
                </IconTip>
              </template>
              <span>{{ detail.crmName || '--' }}</span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="品牌">
              <span v-if="(detail.brands || []).length <= 1">{{ (detail.brands || [])[0] || '--' }}</span>
              <IconTip v-else width="50px" popper-class="popper" type="popover" :label="`${detail.brands.length.toString()}个`">
                <div v-for="(item, index) in detail.brands" :key="`${item}_${index}`">{{ item }}</div>
              </IconTip>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="联系人负责行业">
              <template slot="label">
                <span>联系人负责行业</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>此行业是该联系人所负责的行业方向，并非联系人所在企业的行业方向。暂不支持多选</div>
                  </template>
                </IconTip>
              </template>
              <span v-if="(detail.fields || []).length <= 1">{{ (detail.fields || [])[0] || '--' }}</span>
              <IconTip v-else width="50px" popper-class="popper" type="popover" :label="detail.fields.length.toString()">
                <div v-for="(item, index) in detail.fields" :key="`${item}_${index}`">{{ item }}</div>
              </IconTip>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-row>
          <el-col :span="8">
            <el-form-item label="合作类型(即将废弃)">
              <span>{{ detail.customerTypeName || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row> -->

        <el-row>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <span>{{ detail.mobilePhone || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码2">
              <span>{{ detail.mobilePhone2 || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="微信">
              <span>{{ detail.wechatNumber || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <span>{{ detail.email || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="地址">
              <span>{{ detail.place || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="16">
            <el-form-item label="其他联系方式">
              <span>{{ detail.otherContact || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="创建人">
              <span>{{ detail.createName || '--' }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="创建时间">
              <span>{{ detail.createTime || '--' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </wrap>

    <wrap>
      <el-tabs v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" class="m-t-10" :label="item.label" :name="item.name">
          <component :is="currentTab" v-if="currentTab === item.name && detail.customerId" :customer-id="detail.customerId" />
        </el-tab-pane>
      </el-tabs>
    </wrap>
  </el-drawer>
</template>

<script>
import { defineComponent, watch, reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import { $getCustomer } from '@/api/bussiness-manage'
import { IconTip } from 'components'
import Opportunity from './opportunity-table.vue'
import Invoice from './invoice-table.vue'

export default defineComponent({
  components: {
    IconTip,
    Opportunity,
    Invoice
  },
  props: {
    id: {
      type: String | Number,
      default: 0
    },
    showDrawer: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $message, $router } = getCurrentInstance().proxy
    const states = reactive({
      loading: false,
      detail: {},
      currentTab: 'Opportunity',
      tabs: [{
        name: 'Opportunity',
        component: '',
        label: '商机'
      }, {
        name: 'Invoice',
        component: '',
        label: '商单'
      }]
    })

    const getDetail = async() => {
      states.loading = true
      try {
        const { code, data } = await $getCustomer({ customerId: props.id })
        states.loading = false
        if (+code === 1) {
          states.detail = {
            ...data.customerAdminInfo,
            mainCustomerTypeName: data.customerAdminInfo.customerTypeName,
            ...data.medCustomerInfo
          }
        }
      } catch (e) {
        $message.error(e)
        states.loading = false
      }
    }

    watch(() => props.showDrawer, (val) => {
      if (val) {
        getDetail()
        states.currentTab = 'Opportunity'
      } else {
        states.currentTab = ''
        states.detail = {}
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleClick = (e) => {
      states.currentTab = e.name
    }

    const handleGoCustomerDetail = () => {
      const routeUrl = $router.resolve({
        path: `/bussiness-manage/customer-manage?id=${states.detail.customerAdminId}`
      })
      window.open(routeUrl.href, '_blank')
    }

    return {
      ...toRefs(states),
      handleClick,
      handleClose,
      handleGoCustomerDetail
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {

  .el-drawer {
    height: 100vh;
    overflow-y: auto;
  }

  .el-drawer__title {
    background: #f5f5f5;
  }
  .el-drawer__header {
    background: #fff;
  }

  .el-tabs__header {
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
      bottom: 0;
      margin: auto;
    }
  }

  .el-tabs__item {
    font-size: 16px;
  }
}

.drawer {
  // background: #f5f5f5;
}

.tag {
  padding: 0 16px;
  height: 20px;
  line-height: 20px;
}

.companyName {
  font-size: 16px;
  margin-left: 10px;
}

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

.popper {
  min-width: 100px;
}
</style>
