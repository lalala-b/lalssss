<template>
  <el-header
    :class="[
      'navbar',
      env === 'testing' ? 'devNavbar' : '',
      env === 'development' ? 'localNavBar' : '',
    ]"
    :height="variables.headerHeight"
  >
    <logo />
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- 前后端均非线上 -->
    <!-- <template v-if="!(user.userInfo.environmentFlag === 'online' && env !== 'testing' && env !== 'development')"> -->
    <div v-if="env === 'testing'" class="notice">
      前端{{ isSandbox ? '沙箱' : '测试' }}环境，后端{{
        javaEnvList[user.userInfo.environmentFlag]
          ? `${javaEnvList[user.userInfo.environmentFlag]}环境`
          : '环境未知，注意数据'
      }}
    </div>
    <div v-if="env === 'development'" class="notice">
      前端本地环境，后端{{
        javaEnvList[user.userInfo.environmentFlag]
          ? `${javaEnvList[user.userInfo.environmentFlag]}环境`
          : '环境未知，注意数据'
      }}
    </div>

    <!-- <div v-if="env !== 'testing' && env !== 'development'" class="notice">
        前端线上环境，后端{{ javaEnvList[user.userInfo.environmentFlag] ? `${javaEnvList[user.userInfo.environmentFlag]}环境` : '环境未知，注意数据' }}
      </div> -->
    <!-- </template> -->

    <!-- <div v-if="env === 'development'" class="notice">
      前端本地环境，后端{{ javaEnvList[user.userInfo.environmentFlag] ? `${javaEnvList[user.userInfo.environmentFlag]}环境` : '环境未知，注意数据' }}
    </div> -->

    <div class="right-menu">
      <template v-if="env === 'development' || (env === 'testing' && !isSandbox)">
        <el-select
          v-model="loginUserRoleId"
          clearable
          filterable
          :options="userRolesOptions"
          :loading="userRoleloading"
          placeholder="请选择用户角色"
          @change="handleChangeLoginUserRole"
          @clear="handleClearLoginUserRole"
        >
          <el-option
            v-for="item in userRolesOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="loginUserNameId"
          clearable
          filterable
          :options="userNameOptions"
          :loading="userNameloading"
          placeholder="请选择用户快速登录"
          @change="handleChangeLoginUserName"
        >
          <el-option
            v-for="item in userNameOptions"
            :key="item.id"
            :label="`${item.realname}(${item.name})`"
            :value="item.id"
          />
        </el-select>
      </template>
      <a
        target="_blank"
        href="//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/%E7%B3%BB%E7%BB%9F%E5%BF%AB%E9%80%9F%E6%8C%87%E5%8D%97.pdf"
      >
        <i class="iconfont iconwenhao" />
      </a>
      <Msg />
      <!-- <AccountTip /> -->
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="user.userInfo.avatar || avatar" class="user-avatar">
          <span>{{ user.userInfo.realname }}</span>
          <i class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            @click.native="onEditUser"
          >修改用户信息</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <EditUserDialog v-if="hasEditDialog" v-model="hasEditDialog" />
  </el-header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import jsCookie from 'js-cookie'
import { setLocalStorageWithExpiration, getLocalStorageWithExpiration } from '/src/utils/expirateLocalStorage.js'
import { $quickLogin } from '/src/api/index'
import { $getAllRole, $getQuickLoginUserName } from '/src/api/backend-manage'
import Hamburger from './Hamburger'
// import AccountTip from './AccountTip'
import Logo from './Logo'
import Msg from './Msg'
import EditUserDialog from './EditUserDialog'
import avatar from '@/assets/_src/people.png'
import variables from '@/styles/variables.scss'

export default {
  components: {
    // Breadcrumb,
    Hamburger,
    Logo,
    Msg,
    // AccountTip,
    EditUserDialog
  },
  data() {
    return {
      hasEditDialog: false,
      avatar,
      env:
        process.env.NODE_ENV === 'development'
          ? 'development'
          : (window['__PAGE_META__'] || {}).env,
      isSandbox: (window['__PAGE_META__'] || {}).isSandbox,
      javaEnvList: {
        dev: '本地',
        test: '测试',
        sandbox: '沙箱',
        online: '线上'
      },
      // 切换的登录角色id
      loginUserRoleId: null,
      // 切换的登录用户id
      loginUserNameId: null,
      // 登录用户角色的数据列表
      userRolesOptions: [],
      // 登录用户名称的数据列表
      userNameOptions: [],
      // 登录用户角色的数据列表loading
      userRoleloading: false,
      // 登录用户名称的数据列表loading
      userNameloading: false
    }
  },
  computed: {
    ...mapGetters(['user', 'sidebar', 'permissionRoutes']),
    variables() {
      return variables
    }
  },
  created() {
    this.getloginUserRolesData()
    // 没有缓存全部登录用户数据时，重新请求；否则直接赋值
    const quickLoginUserNameData = JSON.parse(getLocalStorageWithExpiration('quickLoginUserName') || '[]')
    if (!quickLoginUserNameData.length) {
      this.getloginUserNameData()
    } else {
      this.userNameOptions = quickLoginUserNameData
    }
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      loginout: 'user/loginout'
    }),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
      this.$bus.$emit('toggleSideBar')
    },
    onEditUser() {
      this.hasEditDialog = true
    },
    logout() {
      this.loginout()
      location.reload()
    },

    // 获取登录用户角色数据
    async getloginUserRolesData() {
      try {
        this.userRoleloading = true
        const { code, data, message = '' } = await $getAllRole()
        this.userRoleloading = false
        if (+code === 1) {
          this.userRolesOptions = data
        } else {
          console.error(message)
        }
      } catch (err) {
        this.userRoleloading = false
        this.$message.error(err.message)
      }
    },

    // 获取登录用户名称数据
    async getloginUserNameData(roleName) {
      try {
        this.userNameloading = true
        const {
          code,
          data,
          message = ''
        } = await $getQuickLoginUserName({
          roleName,
          size: 1000
        })
        this.userNameloading = false
        if (+code === 1) {
          this.userNameOptions = data
          // 缓存全部用户名称数据(一小时)
          if (!roleName) {
            setLocalStorageWithExpiration('quickLoginUserName', JSON.stringify(data), 60)
          }
        } else {
          console.error(message)
        }
      } catch (err) {
        this.userNameloading = false
        this.$message.error(err.message)
      }
    },

    // 监听登录用户角色的变化
    async handleChangeLoginUserRole(val) {
      try {
        // 对于要请求全部登录用户名称的数据，就不再请求获取登录用户名称的数据
        if (!val) return
        const roleName = this.userRolesOptions.filter(
          (item) => item.id === val
        )[0]?.name
        this.getloginUserNameData(roleName)
      } catch (error) {
        console.info(error)
      }
    },

    // 监听清空角色时的事件
    handleClearLoginUserRole() {
      this.userNameOptions = JSON.parse(getLocalStorageWithExpiration('quickLoginUserName') || '[]')
    },

    // 监听登录用户名的变化
    async handleChangeLoginUserName(id) {
      try {
        const {
          code,
          data,
          message = ''
        } = await $quickLogin({
          id
        })

        await this.loginout()

        if (+code === 1) {
          jsCookie.set('sso_uid', data.userid, {
            expires: 7
          })
          jsCookie.set('uid', data.userid, {
            expires: 7
          })
          jsCookie.set('external_user', true, {
            expires: 7
          })
        } else {
          this.$message.error(message)
        }

        // 清除浏览器缓存并强行加载
        location.reload(true)

        await this.login(data)
        // 没有首页权限的情况
        if (
          this.permissionRoutes.findIndex((item) => item.path === '/') === -1
        ) {
          this.$router.push({
            path: this.permissionRoutes.find((item) => item.alwaysShow).path
          })
        } else {
          this.$router.push({
            path: '/'
          })
        }

        // 清空选择的用户角色和名称id，重新赋值全部用户名数据
        this.loginUserNameId = null
        this.loginUserRoleId = null
        this.userNameOptions = JSON.parse(getLocalStorageWithExpiration('quickLoginUserName') || '[]')
      } catch (err) {
        this.$message.error(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';
.navbar {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  padding: 0 32px 0 0 !important;
  background: $headerBg;
  color: $headerColor;
  z-index: 100;
  // box-shadow: 0px 3px 8px 0px rgba(0, 21, 41, 0.12);
  box-shadow: 0px 3px 8px 0px rgba(0, 21, 41, 0.06);

  .breadcrumb-container {
    flex: 1;
  }
  .hamburger-container {
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer;
  }

  .right-menu {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 300px;
    height: 100%;
    color: inherit;

    .iconfont {
      width: 22px;
      height: 22px;
      font-size: 22px;
      margin-right: 32px;
      // color: rgba($color: #fff, $alpha: .85);
    }
    a {
      color: inherit;
    }

    .right-menu-item {
      font-size: 14px;
      color: inherit;
      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        // color: rgba($color: #fff, $alpha: 0.6);
        color: inherit;
        font-size: 18px;

        .user-avatar {
          width: 32px;
          height: 32px;
          margin-right: 36px;
          border-radius: 50%;
          cursor: pointer;
        }

        .el-icon-arrow-down {
          cursor: pointer;
          font-size: 16px;
          margin-left: 4px;
        }
      }
    }
  }
}

.devNavbar {
  background: #000;
}

.localNavBar {
  background: #999;
}

.notice {
  font-size: 20px;
  font-weight: bold;
  padding-left: 20px;
  align-self: center;
  margin-left: 30px;
}

@media all and (-webkit-min-device-pixel-ratio: 0) and (min-resolution: 0.001dpcm) {
  .notice {
    background-image: -webkit-linear-gradient(
      left,
      #147b96,
      #e6d205 25%,
      #147b96 50%,
      #e6d205 75%,
      #147b96
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    -webkit-background-size: 200% 100%;
    -webkit-animation: masked-animation 1s infinite linear;
  }
}
@-webkit-keyframes masked-animation {
  0% {
    background-position: 0 0;
    transform: scale(1);
  }
  100% {
    background-position: -100% 0;
    transform: scale(1.2);
  }
}

::v-deep {
  .el-select {
    margin-right: 30px;
  }
}
</style>
