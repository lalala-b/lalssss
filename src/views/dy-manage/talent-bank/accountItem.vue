<template>
  <div class="list-card flex">
    <div class="serial-number" data-num>
      {{ index+1 }}
    </div>
    <div class="list-card__info flex">
      <div v-if="info.redeliveryFlag" class="flex flex-center">
        <el-tooltip
          effect="dark"
          content="近期账号视频数据表现良好，推荐合作投放！"
          placement="top"
        >
          <svg-icon icon-class="hot" class="hot-icon m-r-5" />
        </el-tooltip>
      </div>
      <div>
        <AccountCard
          :info="{
            ...info,
            accountLoginUrl:`https://www.douyin.com/search/${info.uniqueId}`,
            xingtuIndexUrl:`https://www.xingtu.cn/ad/creator/author/douyin/${info.getDataUrl}/1/?recommend=false`
          }"
          :options="{accountUrl: 'accountLoginUrl'}"
          :show-tags="false"
        >
          <!-- <p class="user-info__id m-t-8">ID：<strong>{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</strong></p> -->
          <p
            v-if="info.sysAccountTag || info.tagValue || info.tagName"
            class="account-card__tag"
          >
            <template v-if="info.sysAccountTag">
              <template v-for="item in info.sysAccountTag.split(',')">
                <el-tag
                  v-if="item"
                  :key="item"
                  class="m-r-5 m-b-5"
                  size="mini"
                >{{ item }}</el-tag>
              </template>
            </template>
            <template v-if="info.tagValue">
              <template v-for="item in info.tagValue.split(',')">
                <el-tag
                  v-if="item"
                  :key="item"
                  class="m-r-5 m-b-5"
                  size="mini"
                >{{ item }}</el-tag>
              </template>
            </template>
            <template v-if="info.tagName">
              <el-tag
                v-for="item in info.tagName.split(',')"
                :key="item"
                class="m-r-5 m-b-5"
                size="mini"
              >{{ item }}</el-tag>
            </template>
          </p>
        </AccountCard>
        <p class="userInfoId m-t-8">
          ID：<strong>{{
            info.uniqueId || info.eid || info.getDataUrl || "--"
          }}</strong>
        </p>
        <el-popover
          v-if="info.accountProfile"
          placement="bottom"
          width="488"
          trigger="hover"
        >
          <div v-html="info.accountProfile" />
          <div slot="reference" class="user-info__profile text-over-hidden-2">
            简介：<span v-html="info.accountProfile" />
          </div>
        </el-popover>
      </div>
    </div>
    <ul class="list-card__data">
      <!-- <el-tooltip
        v-for="item in config"
        :key="item.field"
        class="item"
        effect="dark"
        :content="
          getUpdateTime(item.field)
            ? `数据更新时间：${getUpdateTime(item.field)}`
            : '暂无更新时间'
        "
        placement="top"
      > -->
      <div v-for="item in config" :key="item.field" class="item">
        <li>
          <template v-if="item.field === 'sexProportions'">
            <div>
              <h3 data-num>
                男：{{ +Number(info.menProportion * 100).toFixed(2) }}%
              </h3>
              <h3 data-num>
                女：{{ +Number(info.womenProportion * 100).toFixed(2) }}%
              </h3>
            </div>
            <div class="flex item-name">
              <span>性别分布</span>
              <IconTip
                type="tooltip"
                :content="getUpdateTime(item.field)
                  ? `数据更新时间：${getUpdateTime(item.field)}`
                  : '暂无更新时间'"
                icon-class="el-icon-time"
              />
            </div>
          </template>
          <!-- 分布相关 -->
          <template v-else-if="item.type === 'distributionTop'">
            <div>
              <template v-if="info[item.field]">
                <h3
                  v-for="(it, idx) in info[item.field]"
                  :key="it.name"
                  data-num
                >
                  <span :class="['sequence', `sequence${idx + 1}`]">{{
                    idx + 1
                  }}</span>
                  <span>{{ it.name }}({{ it.proportion }})</span>
                </h3>
              </template>
              <h3 v-else data-num>--</h3>
            </div>
            <div class="flex item-name">
              <span>{{ item.name }}</span>
              <IconTip
                type="tooltip"
                :content="getUpdateTime(item.field)
                  ? `数据更新时间：${getUpdateTime(item.field)}`
                  : '暂无更新时间'"
                icon-class="el-icon-time"
              />
            </div>
          </template>
          <!-- 八大人群分布 -->
          <template v-else-if="item.field === 'mulDrawProportions'">
            <div>
              <template v-if="info[item.field]">
                <h3 v-for="it in info[item.field]" :key="it.name" data-num>
                  <span>{{ it.name }}({{ it.proportion || "--" }})</span>
                </h3>
              </template>
              <h3 v-else data-num>--</h3>
            </div>
            <div class="flex item-name">
              <span>{{ item.name }}</span>
              <IconTip
                type="tooltip"
                :content="getUpdateTime(item.field)
                  ? `数据更新时间：${getUpdateTime(item.field)}`
                  : '暂无更新时间'"
                icon-class="el-icon-time"
              />
            </div>
          </template>
          <template v-else>
            <div>
              <h3 data-num>
                {{ info[item.field] | toThousandsW
                }}<span
                  v-if="
                    item.unit &&
                      info[item.field] !== null &&
                      info[item.field] !== 'null'
                  "
                >{{ item.unit }}</span>
                <i
                  v-if="
                    item.icon &&
                      info[item.field] !== null &&
                      info[item.field] !== 'null'
                  "
                  :class="[
                    'iconfont',
                    item.icon,
                    item.iconUrl && 'cursor',
                    'm-l-8',
                  ]"
                  @click="handleJump(item.iconUrl, item)"
                />
              </h3>
            </div>
            <div class="flex item-name">
              <span>{{ item.name }}</span>
              <IconTip
                type="tooltip"
                :content="getUpdateTime(item.field)
                  ? `数据更新时间：${getUpdateTime(item.field)}`
                  : '暂无更新时间'"
                icon-class="el-icon-time"
              />
            </div>
          </template>
        </li>
      </div>

      <!-- </el-tooltip> -->
    </ul>
    <div class="list-card__btns flex flex-align-center">
      <div>
        <template v-if="+info.residentFlag!==0">
          <p>
            <span class="timeTitle">1~20s：</span>
            <span>¥{{ toThousand(info.twentySecondPrice) }}</span>
          </p>
          <p>
            <span class="timeTitle">21~60s：</span>
            <span>¥{{ toThousand(info.twentyToSixtySecondPrice) }}</span>
          </p>
          <p>
            <span class="timeTitle">60s以上：</span>
            <span>¥{{ toThousand(info.overSixtySecondPrice) }}</span>
          </p>
          <el-tooltip
            effect="dark"
            content="数据更新时间"
            :disabled="!info.priceSpiderTime"
          >
            <p class="price-update-time"> {{ info.priceSpiderTime?`(${info.priceSpiderTime})`:'暂无更新时间' }}</p>
          </el-tooltip>
        </template>
        <template v-else>
          <div class="flex flex-dir-col flex-align-center">
            <el-button
              type="primary"
              round
              size="medium"
            >
              未入驻星图
            </el-button>
            <el-tooltip
              effect="dark"
              content="数据更新时间"
              :disabled="!info.baseSpiderTime"
            >
              <p class="price-update-time"> {{ info.baseSpiderTime?`(${info.baseSpiderTime})`:'暂无更新时间' }}</p>
            </el-tooltip>
          </div>
        </template>
      </div>
      <div>
        <el-button type="primary" plain size="small" @click="handleBindAccount">
          绑定账号
        </el-button>
        <el-tooltip
          class="item"
          effect="dark"
          :content="info.accountId ? '账号详情' : '暂未收录'"
        >
          <el-button
            :disabled="!info.accountId"
            :title="!info.accountId && '暂未收录'"
            type="primary"
            plain
            size="small"
            @click="goDetail"
          >
            账号详情
          </el-button>
        </el-tooltip>
        <el-button
          type="danger"
          plain
          size="small"
          @click="dialogVisible=true"
        >不再推荐</el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="()=>{dialogVisible = false}"
    >
      <div><i class="el-icon-warning" style="" /><span>确认不再推荐该账号了吗？</span></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCancelRecommend(0)">7天不推荐</el-button>
        <el-button type="primary" @click="handleCancelRecommend(1)">永不推荐</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AccountCard, IconTip } from 'components'
import { toThousands } from '@/filters'
import { lego } from '@zz-common/lego'
import { mapGetters } from 'vuex'
export default {
  components: {
    AccountCard,
    IconTip
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    timeMap: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    },
    config: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
     ...mapGetters(['user'])
  },
  methods: {
    getUpdateTime(field) {
      // 先根据字段拿到映射字符串，再通过映射的每一项拿到时间，把空值滤掉后排期，取最大的时间
      const times = (this.timeMap[field] || '')
        .split(',')
        .map((item) => this.info[item])
        .filter((item) => item)
      return (
        times.sort(
          (a, b) => new Date(b).getTime() - new Date(a).getTime()
        )[0] || ''
      )
    },
    goDetail() {
      const { accountId, accountType, platId } = this.info
      if (!accountId) return
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          sortId: 6,
          sortName: '账号详情',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id
        }
      })
      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          accountType,
          _blank: true
        }
      })
    },
    handleJump(url, item) {
      if (item.field === 'accountUserCount') {
        lego.send({
          actiontype: 'R1804',
          pagetype: 'zpmclick',
          backup: {
            sortId: 4,
            sortName: '历史合作次数',
            token: this.user.userInfo.userid,
            uid: this.user.userInfo.id
          }
        })
      }
      this.$router.push({
        path: url,
        query: {
          _blank: true,
          accountId: this.info.accountId,
          platId: this.info.platId
        }
      })
    },
    toThousand(val) {
      return toThousands(val)
    },
    handleCancelRecommend(type) {
      this.dialogVisible = false
      lego.send({
          actiontype: 'R1804',
          pagetype: 'zpmclick',
          backup: {
            sortId: 7,
            sortName: '不再推荐',
            token: this.user.userInfo.userid,
            uid: this.user.userInfo.id
          }
        })
        this.$emit('cancelRecommend', type)
      // this.$confirm('确认7天内不再推荐该账号吗？', '', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   cancelButtonClass: 'dialogButtonClass',
      //   confirmButtonClass: 'dialogButtonClass',
      //   type: 'warning'
      // }).then(() => {

      // })
    },
    handleBindAccount() {
      lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          sortId: 5,
          sortName: '绑定账号',
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          accountId: `【${this.info.platId}】${this.info.deliveryAccountLibraryFlag ? this.info.accountId : this.info.accountName}`
        }
      })
      this.$emit('bindAccount', this.info)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .account-card {
    &__image {
      width: 82px;
      height: 82px;
      margin-right: 8px;
      img {
        width: 82px;
        height: 82px;
      }
    }
    &__name {
      font-size: 20px;
    }
  }
}
.list-card {
  position: relative;
  width: 100%;
  border: 1px solid #f0f0f0;
  min-height: 156px;
  border-radius: 4px;

  &:hover {
    box-shadow: 0 8px 18px #edeff7;
  }
  // box-shadow: 0 8px 18px #edeff7;
  &__info {
    width: 250px;
    padding: 16px;
    align-self: center;
  }
  &__data {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    padding: 10px 0;

    li {
      display: flex;
      // flex-direction: column;
      align-items: center;
      justify-content: center;
      // width: 25%;
      width: 186px;
      padding: 8px 0;
      flex-wrap: wrap;

      div {
        width: 100%;
        text-align: center;
        align-self: end;
      }

      h3 {
        color: #272727;
        font-size: 20px;
        line-height: 32px;
        font-weight: bold;
        position: relative;
        // display: inline-block;
      }
      .item-name {
        font-size: 14px;
        color: #8c8c8c;
        line-height: 22px;
        width: 100%;
        justify-content: center;
        align-items: center;
        .el-tooltip{
          margin-left: 4px;
        }
      }
    }
  }
  &__btns {
    position: relative;
    width: 248px;
    border-left: 1px solid #f0f0f0;
    padding: 0 20px;
    justify-content: space-between;
    // color: $--color-primary;
    ::v-deep {
      .tooltip-label {
        margin: 0 6px;
      }
      .iconfont {
        font-size: 24px;
        color: $--color-primary;
        margin-left: 0;
      }

      .el-button {
        display: block;
        width: fit-content;
        margin: 0;
        font-size: 12px;
        margin-bottom: 8px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    p {
      font-size: 14px;

      .timeTitle {
        display: inline-block;
        width: 66px;
      }
    }

    &-time {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 12px;
      text-align: right;
      color: #595959;
    }
  }
}
.user-info__profile {
  color: #999;
  cursor: pointer;
}
.m-t-8 {
  margin-top: 8px;
}

.userInfoId {
  color: #999;
}

.hot-icon {
  font-size: 20px;
}

.cursor {
  cursor: pointer;
  color: #2c64ff;
}

.sequence {
  display: inline-block;
  line-height: 22px;
  width: 22px;
  height: 22px;
  text-align: center;
  background-color: #e97272;
  color: #fff;
  border-radius: 4px;
  margin-right: 4px;
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // margin: auto;
  // left: 4px;
}

.sequence2 {
  background-color: #f6c942;
}
.serial-number{
  width: auto;
  min-width: 24px;
  padding: 0 4px;
  font-size: 16px;
  line-height: 24px;
  height: 24px;
  text-align: center;
  color: #fff;
  border-radius: 0px 0px 8px 0px;
  background: linear-gradient(45deg, #2c64ff, transparent);
}
.price-update-time{
  text-align: center;
  font-size: 10px !important;
  color: #8c8c8c;
  margin-top: 4px;
}
.el-icon-warning {
  margin-right: 4px;
  color: #fecd6c;
}
</style>
