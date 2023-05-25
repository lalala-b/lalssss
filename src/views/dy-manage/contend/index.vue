<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-01 17:27:06
 * @LastEditTime: 2020-12-09 10:53:25
 * @LastEditors: Linjie
-->
<template>
  <el-container class="contend">
    <el-aside class="contend-aside m-r-16" width="263px">
      <div class="contend-title flex flex-align-center flex-justify-around">
        <span blod>我的竞品</span>
        <el-button type="primary" size="small" @click="addShow = true">添加竞品</el-button>
      </div>
      <div class="content-select flex flex-align-center flex-justify-center">
        <el-select
          v-model="contendName"
          placeholder="请选择竞品名称"
          :filterable="true"
          :clearable="true"
          @change="handleContendNameChange"
        >
          <el-option v-for="item in contendList" :key="item.id" :label="item.competeName" :value="item.id">{{ item.competeName }}</el-option>
        </el-select>
      </div>
      <ul class="contend-list">
        <li class="flex flex-justify-between">全部({{ contendList.length }}) <span v-if="contendList.length === 0" style="color: #F56C6C">请先添加竞品！</span></li>
        <li
          v-for="(item, index) in contendList"
          :key="item.id"
          :class="index === sIndex ? 'on' : ''"
          @click="handleClick(item.competeName, index)"
        >
          {{ item.competeName }}
          <el-dropdown trigger="click">
            <i class="el-icon-more" @click.stop="" />
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native.stop="handleTop(item.id)">置顶</el-dropdown-item>
              <el-dropdown-item @click.native.stop="handleDelect(item.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </el-aside>
    <el-main class="contend-main">
      <el-tabs v-model="activeName">
        <el-tab-pane label="关联视频" name="video">
          <l-video :fans-range="fansRange" />
        </el-tab-pane>
        <el-tab-pane label="关联账号" name="account">
          <l-account :fans-range="fansRange" />
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <add :add-show.sync="addShow" @addSuccess="getContendList" />
  </el-container>
</template>
<script>
import { $getDataByDictType } from '@/api/index'
import { $getContendList, $delectContend, $upContend } from '@/api/contend'
import video from './video'
import account from './account'
import add from './add'
export default {
  components: {
    LVideo: video,
    LAccount: account,
    add
  },
  data() {
    return {
      fansRange: [],
      contendName: '',
      activeName: 'video',
      contendList: [],
      addShow: false,
      sIndex: 0
    }
  },
  created() {
    this.getContendList()
    this.getFansNum()
  },
  methods: {
    // 获取竞品
    getContendList() {
      $getContendList({ isPage: 0 }).then(res => {
        if (res.code === 1) {
          this.contendList = res.data
          if (res.data.length > 0) {
            this.$bus.$emit('centendChange', res.data[0].competeName)
          }
          this.$bus.$emit('getContendList', res.data)
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
    // 获取粉丝量
    getFansNum() {
      $getDataByDictType({ dictTypes: ['sys_fans_range'] }).then(res => {
        if (res.code === 1) {
          this.fansRange = res.data.sys_fans_range
        }
      })
    },
    handleClick(competeName, index) {
      this.sIndex = index
      this.$bus.$emit('centendChange', competeName)
      this.contendName = ''
    },
    // 置顶
    handleTop(id) {
      // const index = this.contendList.findIndex(item => (item.id === id))
      $upContend({ id }).then(res => {
        if (res.code === 1) {
          this.$message.success('置顶成功')
          // if (index === this.sIndex) {
          this.sIndex = 0
          // 判断置顶是不是当前选中的
          this.$el.querySelector('.contend-list').scrollTop = 0
          // }
          this.getContendList()
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
    // 删除竞品
    handleDelect(id) {
      const index = this.contendList.findIndex(item => (item.id === id))
      this.$confirm('是否确认删除此竞品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $delectContend({ id }).then(async res => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.getContendList()
            if (index === this.sIndex) {
              const competeName = this.contendList.length === 1 ? '' : this.contendList[0].competeName
              this.handleClick(competeName, 0)
              this.$el.querySelector('.contend-list').scrollTop = 0
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
      }).catch()
    },
    // 下拉框选择竞品
    handleContendNameChange(id) {
      const index = this.contendList.findIndex(item => (item.id === id))
      this.sIndex = index
      const contendName = this.contendList[this.sIndex].competeName
      this.$bus.$emit('centendChange', contendName)
      this.$nextTick(() => {
        this.$el.querySelector('.contend-list').scrollTop = this.$el.querySelector(`.on`).offsetTop
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .contend {
    height: 100%;
    width: 100%;
    // background: #fff;
    &-aside {
      display: flex;
      flex-direction: column;
      border-radius: 4px;
      box-sizing: border-box;
      background: #fff;
      .contend-title {
        font-size: 16px;
        height: 64px;
        color: #272727;
        border-bottom: 1px solid #F0F0F0;
      }
      .content-select {
        height: 64px;
        ::v-deep {
          .el-select {
            width: 215px;
          }
        }
      }
      .contend-list {
        position: relative;
        flex: 1;
        overflow: auto;
        // padding: 0 10px;
        li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 24px 0 27px;
          height: 48px;
          font-size: 14px;
          text-indent: 1em;
          cursor: pointer;
          &:hover {
            background: #EBF3FF;
          }
          &.on {
            color: #409EFF;
            background: #EBF3FF;
          }
          > i {
            margin-top: -5px;
            text-align: center;
            transform-origin: 50% 50%;
            transform: rotate(90deg);
          }
        }
      }
    }
    &-main {
      padding: 0;
      background: #fff;
    }
  }
</style>
