<template>
  <div class="selfMsgDetail">
    <div class="q-wrap">
      <ul class="list">
        <li>账号统一名称：{{ info.belongName || '--' }}</li>
        <li>账号归属：{{ info.accountBelong || '--' }}</li>
        <li>运营负责人：{{ info.operatorName || '--' }}</li>
        <li class="bindWrap">
          绑定记录：
          <div class="flex">
            <div v-if="info.bindUser&&info.bindUser.split(',').length > 2" class="flex">
              <div
                v-for="(tag, index) in info.bindUser.split(',')"
                :key="index"
              >
                <span
                  v-if="index < 2"
                >{{ tag }}<i v-if="index <= 1">,</i></span>
              </div>
              <span>...</span>
            </div>
            <p v-else>
              {{ info.bindUser }}
            </p>
            <i
              class="iconfont iconlianxiren realname-iocn m-l-12"
              @click="showRecord"
            />
          </div>
        </li>
        <li>账号状态：{{ info.accountStatus || info.accountStatus === 0 ? accountStatusMap[+info.accountStatus] : '--' }}</li>
        <li>绑定手机号：{{ info.phone || '--' }}</li>
        <li>运营负责人：{{ info.operatorName || '--' }}</li>

        <!-- 抖音 -->
        <template v-if="info.platId === 25">
          <li>
            1-20s报价：{{ info.twentySecondPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            21-60s报价：{{ info.sixPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            60s+报价：{{ info.oversixtySecondPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            全网报价：{{ info.netPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
        </template>

        <!-- 快手 -->
        <template v-else-if="info.platId === 26">
          <li>
            达人报价：{{ info.sixPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            全网报价：{{ info.netPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
        </template>

        <!-- b站 -->
        <template v-else-if="info.platId === 2">
          <li>
            定制视频：{{ info.customVideoPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            植入视频：{{ info.implantationVideoPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            直发视频：{{ info.directVideoPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            转发动态：{{ info.forwardSituationPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
        </template>

        <!-- 小红书 -->
        <template v-else-if="info.platId === 45">
          <li>
            视频笔记：{{ info.videoPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
          <li>
            图文笔记：{{ info.picturePrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
        </template>

        <!-- 其他平台 -->
        <template v-else>
          <li>
            报价：{{ info.sixPrice || '--' }}元
            <IconTip
              :content="contentTip"
              label=""
              icon-class="iconwenhao"
            />
          </li>
        </template>

        <li>账号：{{ info.accountLoginName || '--' }}</li>
        <li>
          实名人姓名：{{ info.realCelebrityName || '--' }}
        </li>
        <li>
          密码：{{ info.accountLoginPwd || '--' }}
        </li>
        <li>
          在职状态：{{ info.registerIsWorking ? '在职' : '离职' }}
        </li>
        <li>
          登录手机号：{{ info.accountLoginPhone || '--' }}
        </li>
        <li>
          运营人身份证：{{ info.operatorIdCard || '--' }}
        </li>
        <li>
          手机卡实名认证人：{{ info.phoneCardRegisterName || '--' }}
        </li>
        <li>
          运营人住址：{{ info.operatorAddress || '--' }}
        </li>
        <li>
          实体手机卡现持有人：{{ info.usePhoneUserName || '--' }}
        </li>
        <li>
          运营人电话：{{ info.operatorPhone || '--' }}
        </li>
        <li>
          账号当前运营人：{{ info.operatorName || '--' }}
        </li>
        <li>
          是否绑定个人提现方式：{{ info.isBindWithdrawal ? '是' : '否' }}
        </li>
        <li>
          本年度是否完成橱窗升级：{{ info.isUpdateShowcase ? '是' : '否' }}
        </li>
        <li>
          是否签署电子签：{{ info.isESign ? '是' : '否' }}
        </li>
      </ul>
    </div>
    <BindDialog v-if="showRecords" v-model="showRecords" :row="info" />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import IconTip from '@/components/IconTip'
import BindDialog from '@/views/account-manage/account-count/_com/bind-dialog.vue'

export default defineComponent({
  components: {
    IconTip,
    BindDialog
  },
  props: {
    accountDetail: {
      type: Object,
      default() {
        return () => ({})
      }
    }
  },
  setup(props) {
    const states = reactive({
      info: {},
      accountStatusMap: {
        0: '上架',
        1: '下架',
        2: '孵化中'
      },
      contentTip: '账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。',
      showRecords: false
    })

    watch(
      () => props.accountDetail,
      (val) => {
        const keys = Object.keys(val)
        if (val && keys.length) {
          states.info = val
        }
      },
      {
        immediate: true
      }
    )

    const showRecord = () => {
      states.showRecords = true
    }

    return {
      ...toRefs(states),
      showRecord
    }
  }
})
</script>

<style lang="scss" scoped>
.selfMsgDetail {
  font-size: 16px;

  .list {
    display: flex;
    flex-wrap: wrap;

    li {
      width: 50%;
      margin: 6px 0;
    }

    .bindWrap {
      display: flex;
      align-items: center;

      i {
        cursor: pointer;
        color: #2c64ff;
        margin-top: 2px;
      }
    }
  }
}
</style>
