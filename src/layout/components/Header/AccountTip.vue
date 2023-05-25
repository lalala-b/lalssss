<template>
  <div v-if="newsStatus" class="tip-btn">
    <i
      :class="newsStatus ? 'el-icon-warning': 'el-icon-warning-outline'"
      @click="handleDrawerToggle"
    />
    <el-drawer
      size="580px"
      title="账号归属确认"
      :visible.sync="drawer"
      direction="rtl"
      :modal-append-to-body="true"
      :append-to-body="true"
    >
      <div class="account-drawer">
        <template v-if="overAccounts.length">
          <p class="overaccount-title">以下账号存在跨团队多人同时绑定，请账号运营团队负责人确认当前归属！其他团队负责人无需操作仅通知团员解绑。</p>
          <div class="overaccount-content">
            <el-row v-for="(item, index) in overAccounts" :key="item.id" class="account" :gutter="20">
              <el-col :span="6">
                <el-tag
                  class="account-tags"
                  type="mini"
                  :title="item.platName + '-' + item.accountName"
                >{{ item.platName }}-{{ item.accountName }}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row>
                  <el-col :span="6">绑定用户：</el-col>
                  <el-col :span="18">{{ joinAccount(item.accountBindUserInfoBOList, item.orgType) }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">当前归属：</el-col>
                  <el-col v-if="!item.edit" :span="18">
                    <span v-if="item.orgType === 1" class="m-r-10">{{ item.belongDName }}-{{ item.belongFName }}</span>
                    <span v-else class="m-r-10">{{ item.belongDName }}</span>
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="handleEdit(index, type='overAccounts')"
                    >修改</el-link>
                  </el-col>
                  <el-col v-else :span="18" class="eidt-item">
                    <el-select
                      v-model="item.bindDId"
                      class="m-r-10"
                      size="small"
                      @change="dChange(item)"
                    >
                      <el-option
                        v-for="opt in (item.orgType === 1 ? moveFormOptions.pirateOrgList : moveFormOptions.qianpaiOrgList)"
                        :key="opt.id"
                        :value="opt.id"
                        :label="opt.orgName"
                      />
                    </el-select>
                    <el-select
                      v-if="item.orgType === 1"
                      v-model="item.bindFId"
                      class="m-r-10"
                      size="small"
                    >
                      <el-option
                        v-for="opt in item.f_ids"
                        :key="opt.id"
                        :value="opt.id"
                        :label="opt.orgName"
                      />
                    </el-select>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleEditSave(index, 'overAccounts')"
                    >确定</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
        <template v-if="mutipleAccounts.length">
          <p class="overaccount-title">以下账号为团队成员添加的其他团队归属账号，请确认是否需要修改当前归属！</p>
          <div class="overaccount-content">
            <el-row v-for="(item, index) in mutipleAccounts" :key="item.id" class="account" :gutter="20">
              <el-col :span="6">
                <el-tag
                  class="account-tags"
                  type="mini"
                  :title="item.platName + '-' + item.accountName"
                >{{ item.platName }}-{{ item.accountName }}</el-tag>
              </el-col>
              <el-col :span="18">
                <el-row>
                  <el-col :span="6">绑定用户：</el-col>
                  <el-col :span="18">{{ joinAccount(item.accountBindUserInfoBOList, item.orgType) }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="6">当前归属：</el-col>
                  <el-col v-if="!item.edit" :span="18">
                    <span v-if="item.orgType === 1" class="m-r-10">{{ item.belongDName }}-{{ item.belongFName }}</span>
                    <span v-else class="m-r-10">{{ item.belongDName }}</span>
                    <el-link
                      type="primary"
                      :underline="false"
                      @click="handleEdit(index, type='mutipleAccounts')"
                    >修改</el-link>
                  </el-col>
                  <el-col v-else :span="18" class="eidt-item">
                    <el-select
                      v-model="item.bindDId"
                      size="small"
                      class="m-r-10"
                      @change="dChange(item)"
                    >
                      <el-option
                        v-for="opt in (item.orgType === 1 ? moveFormOptions.pirateOrgList : moveFormOptions.qianpaiOrgList)"
                        :key="opt.id"
                        :value="opt.id"
                        :label="opt.orgName"
                      />
                    </el-select>
                    <el-select
                      v-if="item.orgType === 1"
                      v-model="item.bindFId"
                      class="m-r-10"
                      size="small"
                    >
                      <el-option
                        v-for="opt in item.f_ids"
                        :key="opt.id"
                        :value="opt.id"
                        :label="opt.orgName"
                      />
                    </el-select>
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleEditSave(index, 'mutipleAccounts')"
                    >确定</el-button>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </div>
        </template>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { $getMutiBindAccounts, $getRansferDTeam, $updateAccountBelong } from '@/api'
export default {
  data() {
    return {
      tipClass: 'el-icon-warning-outline',
      overAccounts: [],
      mutipleAccounts: [],
      drawer: false,
      moveFormOptions: {
        pirateOrgList: [],
        qianpaiOrgList: []
      }
    }
  },
  computed: {
    hasNewMsg() {
      return this.overAccounts.length > 0 || this.mutipleAccounts.length > 0
    },
    newsStatus() {
      return this.overAccounts.length > 0 || this.mutipleAccounts.length > 0
    }
  },
  created() {
    this.getMutiBindAccounts()
    this.getDOptions()
  },
  methods: {
    getMutiBindAccounts() {
      return $getMutiBindAccounts().then((res) => {
        if (res.code === 1 && res.data) {
          res.data.forEach((item) => {
            item.edit = false
            item.bindDId = item.belongDId
            item.bindFId = item.belongFId
            item.f_ids = []
          })
          this.overAccounts = res.data.filter((item) => (item.type === 1))
          this.mutipleAccounts = res.data.filter((item) => (item.type === 2))
        }
      })
    },
    getDOptions() {
      $getRansferDTeam().then(res => {
        if (res.code === 1) {
          this.moveFormOptions = res.data
        }
      })
    },
    dChange(item, init) {
      // console.log(item)
      if (!init) {
        item.bindFId = ''
      }
      $getRansferDTeam({ orgId: item.bindDId }).then(res => {
        item.f_ids = res.data.getListByOrgId
      })
    },
    handleDrawerToggle() {
      if (this.hasNewMsg) {
        this.drawer = !this.drawer
      }
    },
    joinAccount(list, orgType) {
      const text = list.map((item) => {
        return orgType === 1 ? `${item.bindDName}-${item.bindFName}-${item.bindUserName}` : `${item.bindDName}-${item.bindUserName}`
      })
      return text.join(',')
    },
    handleEdit(index, type) {
      const item = this[type][index]
      if (item.bindFId) {
        this.dChange(item)
      }
      item.edit = true
      this.dChange(item, true)
    },
    handleEditSave(index, type) {
      const item = this[type][index]
      if (!item.bindFId && item.orgType === 1) {
        this.$message('请选择团')
        return
      }

      const data = {
        accountId: item.accountId,
        orgIdForD: item.bindDId,
        orgIdForF: item.bindFId
      }
      $updateAccountBelong(data).then((res) => {
        if (res.code === 1) {
          this.$message.success('修改成功')
          this[type][index].edit = false
          this.getMutiBindAccounts()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss">
    .tip-btn {
        display: flex;
        align-items: center;
        font-size: 14px;
        // text-align: center;
        // line-height: 30px;
        margin: 0 32px 0 0;
        i {
            color: #ff4121;
            font-size: 22px;
            cursor: pointer;
            // line-height: 50px;
            &.el-icon-warning-outline {
                cursor: default;
                color: #818181;
            }
        }
    }
    .el-drawer__header {
      margin-bottom: 0;
    }
    .account-drawer {
      padding: 0 20px;
      .overaccount-title {
        padding: 10px 0;
      }
      .account {
        border: 1px solid #666;
        margin-bottom: 10px;
        padding: 10px;
      }
    }
  .el-drawer__body {
    overflow: auto;
  }
  // .el-drawer__container ::-webkit-scrollbar{
  //   display: none;
  // }
  .account-tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    height: auto;
  }
  .eidt-item {
    display: flex;
    .el-select {
      flex: 1;
    }
  }
</style>
