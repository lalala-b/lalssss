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
          客户
        </el-tag>
        <span class="companyName">{{ detail.companyName || '--' }}</span>
      </div>
    </template>

    <wrap>
      <p class="titleBox">
        <span class="title">详细信息</span>
      </p>
      <el-form label-width="130px">
        <el-row>
          <el-col :span="8">
            <el-form-item label="客户级别">
              <span class="notice">敬请期待</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="主要合作类型">
              <span>{{ detail.customerTypeName || '--' }}</span>
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
          <el-col :span="8">
            <el-form-item label="AM对接人">
              <template slot="label">
                <span>AM对接人</span>
                <IconTip
                  type="popper"
                  icon-class="iconwenhao"
                >
                  <template>
                    <div>AM对接人为该客户的客户联系人的归属商务。支持多个。</div>
                  </template>
                </IconTip>
              </template>
              <span v-if="(detail.ams || []).length <= 1">{{ (detail.ams || [])[0] || '--' }}</span>
              <template v-else>
                <IconTip width="50px" popper-class="popper" type="popper" :label="detail.ams.length.toString()" label-class="tooltip">
                  <div v-for="(item, index) in detail.ams" :key="`${item}_${index}`">{{ item }}</div>
                </IconTip>
              </template>
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

        <el-row>
          <el-col :span="8">
            <el-form-item label="客户回收规则">
              <span class="notice">敬请期待</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </wrap>

    <wrap>
      <el-tabs v-model="currentTab" @tab-click="handleClick">
        <el-tab-pane v-for="item in tabs" :key="item.name" class="m-t-10" :label="item.label" :name="item.name">
          <component :is="currentTab" v-if="currentTab === item.name && detail.companyId" :company-id="detail.companyId" />
        </el-tab-pane>
      </el-tabs>
    </wrap>
  </el-drawer>
</template>

<script>
import { defineComponent, watch, reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import { $getCustomerDetail } from '@/api/bussiness-manage'
import { IconTip } from 'components'
import Contact from './contact-table.vue'
import Opportunity from './opportunity-table.vue'
import Invoice from './invoice-table.vue'

export default defineComponent({
  components: {
    IconTip,
    Contact,
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
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      loading: false,
      detail: {},
      currentTab: 'Contact',
      tabs: [{
        name: 'Contact',
        label: '联系人'
      }, {
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
        const { code, data } = await $getCustomerDetail({ id: props.id })
        states.loading = false
        if (+code === 1) {
          states.detail = data
        }
      } catch (e) {
        $message.error(e)
        states.loading = false
      }
    }

    watch(() => props.showDrawer, (val) => {
      if (val) {
        getDetail()
        states.currentTab = 'Contact'
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

    return {
      ...toRefs(states),
      handleClick,
      handleClose
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
  min-width: 70px;
}

.tooltip {
  color: #409EFF;
}
</style>
