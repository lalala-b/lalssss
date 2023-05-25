<template>
  <Wrap class="hot">
    <div class="flex flex-justify-between flex-align-center hot-head">
      <div class="hot-head__title">实时榜</div>
      <div class="flex flex-align-center hot-head__right">
        <p class="m-r-16">数据更新时间：{{ activeTime }}</p>
        <el-popover
          placement="bottom"
          width="280"
          trigger="hover"
          class="hover-tip"
        >
          <p>【数据来源】：抖音APP-热点榜</p>
          <p>【更新频率】：每10-30分钟更新一次</p>
          <span slot="reference">榜单规则<i class="iconfont iconwenhao" /></span>
        </el-popover>
      </div>
    </div>

    <el-table
      v-if="!isInit"
      v-scrollbar
      :data="tableData"
      class="sticky-head"
    >
      <el-table-column prop="position" label="排名" width="100">
        <template slot-scope="{row}">
          <svg-icon v-if="row.position <= 3" class="level-icon" :icon-class="'level' + row.position" />
          <span v-else>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="热门标题">
        <template slot-scope="{ row }">
          <el-link
            :href="row.top1VideoIndexUrl"
            type="primary"
            target="_blank"
            :underline="false"
          >
            {{ row.word }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="hotValue" label="热度值">
        <template slot-scope="{ row }">
          <div>
            <i class="iconfont iconhuo" />
            <span>{{ row.hotValue | toThousandsW }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="相关视频数" prop="videoCount" />
      <el-table-column label="热门视频">
        <template slot-scope="{ row }">
          <el-link
            target="_blank"
            :href="row.top1VideoIndexUrl"
            :underline="false"
          >
            <el-image
              :src="row.top1VideoCoverUrl"
              class="hot-video__img"
              fit="contain"
            />
          </el-link>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <IconTip content="详情" icon-class="iconxiangqing" @click="handleShowDetail(row)" />
        </template>

      </el-table-column>
    </el-table>
    <Loading v-if="loading" />
    <detail v-if="isDetailShow" :show.sync="isDetailShow" :info="detailInfo" />
    <BackToTop />
  </Wrap>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import { Loading, IconTip } from 'components'

import detail from './detail'
import { $getDyHotList } from '@/api/dy-manage'
export default {
  components: { Loading, detail, BackToTop, IconTip },
  data() {
    return {
      isInit: true,
      loading: false,
      total: 0,
      searchData: {
        pageNum: 1,
        size: 50
      },
      activeTime: '',
      tableData: [],
      isDetailShow: false,
      detailInfo: {}
    }
  },
  created() {
    this.getList().then(_ => {
      this.isInit = false
    })
  },
  methods: {
    getList() {
      this.loading = true
      return $getDyHotList(this.searchData).then(res => {
        if (res.code === 1) {
          this.activeTime = res.data.activeTime
          this.tableData = [...this.tableData, ...res.data.list]
          this.total = res.total
        } else {
          throw Error(res)
        }
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(_ => {
        this.loading = false
      })
    },
    handleShowDetail(row) {
      this.detailInfo = row
      this.isDetailShow = true
    }
  }
}
</script>
<style lang="scss" scoped>
  .hot {
    &-head {
      margin-bottom: 20px;
      &__title {
        font-size: 16px;
        color: #272727;
      }
      &__right {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
      }
    }
    &-video {
      &__img {
        width: 83px;
        height: 110px;
        border-radius: 4px;
      }
    }
    .iconhuo {
      color: #FF3333;
    }
    .iconwenhao {
      margin-left: 4px;
    }
    .level-icon {
      font-size: 32px;
    }
  }
  .hover-tip {
    cursor: pointer;
  }
  .sticky-head {
    overflow: visible;
    ::v-deep {
      .el-table__header-wrapper {
        overflow: visible;
        position: sticky;
        top: -24px;
        z-index: 10;
        table {
          position: sticky;
          top: 0;
          thead {
            position: relative;
            th {
              position: sticky;
              top: 0;
              z-index: 10;
            }
          }
        }
      }
    }
  }
</style>
