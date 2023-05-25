<template>
  <div class="budget-card" :class="{'budget-card__pitcher': isPitcher}" :style="`border-color: ${item.colourType};`">
    <h2 :style="`background: ${item.colourType};`">{{ item.orgName }}</h2>
    <div class="budget-card__head">
      <span />
      <span bold>投放金额</span>
      <!-- <span bold>投放条数</span> -->
    </div>
    <ul class="budget-card__list" :class="{'hidden': !open}">
      <li>
        <span>计划预算</span>
        <el-tooltip v-if="!showInput" effect="dark" :content="item.sysBudgetAmount | toThousands" placement="top">
          <span @dblclick="handleClick">{{ item.sysBudgetAmount | toFloorThousandsW }}<i v-if="isPitcher && item.editFlag === 1" class="el-icon-edit" /></span>
        </el-tooltip>
        <template v-else>
          <el-input-number ref="input" v-model="money" :controls="false" class="money-input" @blur="handleSave" /> w
        </template>
        <!-- <span>1474</span> -->
      </li>
      <li>
        <span red>有效订单</span>
        <el-tooltip effect="dark" :content="item.currentBudgetAmount | toThousands" placement="top">
          <span>
            {{ item.currentBudgetAmount | toFloorThousandsW }}
          </span>
        </el-tooltip>
        <!-- <span>1474</span> -->
      </li>
      <li>
        <span orange>已发布视频</span>
        <el-tooltip effect="dark" :content="item.hasVideoAmount | toThousands" placement="top">
          <span>{{ item.hasVideoAmount | toFloorThousandsW }}</span>
        </el-tooltip>
        <!-- <span>1474</span> -->
      </li>
      <li>
        <span green>尚未完成</span>
        <el-tooltip effect="dark" :content="item.remainBudgetAmount | toThousands" placement="top">
          <span>{{ item.remainBudgetAmount | toFloorThousandsW }}</span>
        </el-tooltip>
        <!-- <span>1474</span> -->
      </li>
      <li v-for="(val, key) in item.basePlatCharts" :key="key">
        <span>{{ key }}</span>
        <el-tooltip effect="dark" :content="val | toThousands" placement="top">
          <span>{{ val | toFloorThousandsW }}</span>
        </el-tooltip>
        <!-- <span>1474</span> -->
      </li>
    </ul>
    <i v-if="!isPitcher && item.children && item.children.length > 0" class="budget-card__after">
      <i v-if="!item.close" class="el-icon-minus" @click="handleToggle(item)" />
      <i v-else class="el-icon-plus" @click="handleToggle(item)" />
      <!-- <i v-else @click="handleToggle(item)">{{ item.children.length }}</i> -->
    </i>
  </div>
</template>
<script>
import { $editBudgetChart } from '@/api/putting-manager'
export default {
  props: {
    open: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    isPitcher: {
      type: Boolean,
      default: false
    },
    paramDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showInput: false,
      money: 0
    }
  },
  methods: {
    handleToggle(item) {
      item.close ? item.close = !item.close : this.$set(item, 'close', true)
    },
    handleClick() {
      if (!this.isPitcher || this.item.editFlag !== 1) return
      this.showInput = true
      this.money = (this.item.sysBudgetAmount / 10000).toFixed(2)
      this.$nextTick(_ => {
        this.$refs.input.focus()
      })
    },
    handleSave() {
      this.$nextTick(() => {
        if (this.saveing) return
        this.saveing = true
        if (this.money > 1000) {
          this.saveing = false
          return this.$message.error('预算不能超过上限一千万')
        }
        let item = this.item
        const offset = (this.money * 10000) - item.sysBudgetAmount

        this.showInput = false
        $editBudgetChart({
          userId: item.orgId,
          curMonthBudgetAmount: this.money,
          paramDate: this.paramDate
        }).then(res => {
          if (res.code === 1) {
            item.sysBudgetAmount = this.money * 10000
            item.remainBudgetAmount = item.remainBudgetAmount + offset
            this.$bus.$emit('budget:update')
            this.$message.success('操作成功')
            while (item.parent) {
              // 向上递归计算
              item = item.parent
              item.sysBudgetAmount = item.sysBudgetAmount + offset
              item.remainBudgetAmount = item.remainBudgetAmount + offset
            }
          } else {
            this.$message.error(res.message)
          }
          this.saveing = false
        }).catch(err => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.saveing = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .budget-card {
    position: relative;
    width: 180px;
    border: 1px solid #c00000;
    background: #fff;
    margin-bottom: 40px;
    flex-shrink: 0;
    &:hover {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
    > h2 {
      line-height: 20px;
      text-align: center;
      font-size: 12px;
      background: #c00000;
      color: #fff;
    }
    &::after {
      content: "";
      position: absolute;
      left: 50%;
      top: -22px;
      height: 18px;
      width: 2px;
      background: #3a3838;
      transform: translateX(-50%);
    }
    &::before {
      content: "";
      position: absolute;
      top: -6px;
      left: 50%;
      width: 0;
      height: 0;
      border: 4px solid;
      border-color: #3a3838 transparent  transparent;
      transform: translateX(-50%);
    }
    &__after {
      position: absolute;
      bottom: -20px;
      left: 50%;
      width: 2px;
      height: 15px;
      background: #3a3838;
      transform: translateX(-50%);
      z-index: 10;
      cursor: pointer;
      > i {
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 16px;
        height: 16px;
        font-size: 12px;
        transform: translate(-50%, 50%);
        z-index: 10;
        // color: #61b8fc;
        background: #fff;
        border-radius: 50%;
        border: 1px solid #8793a4;
        color: #8793a4;
        &::before {
          transform: scale(0.6);
        }
      }
      :hover {
        color: rgb(41, 151, 255);
        border-color: rgb(41, 151, 255);
      }
    }
    &__pitcher {
      border: 1px solid #3a3838;
      margin-bottom: 40px;
      > h2 {
        background: #3a3838;
      }
      &::after, &::before {
        display: none;
      }
    }

    &__head {
      display: flex;
      text-align: center;
      span {
        width: 50%;
        &[bold] {
          font-weight: bold;
        }
      }
    }
    &__list {
      padding: 0 10px;
      &.hidden {
        overflow: hidden;
        height: 120px;
      }
      li {
        display: flex;
        text-align: center;
        line-height: 20px;
        span {
          position: relative;
          cursor: pointer;
          &:hover {
            color: #2998ff;
          }
          .el-icon-edit {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            color: #2998ff;
          }
          width: 50%;
          &::first-child {
            font-weight: bold;
          }
          &[red] {
            color: #c00000;
          }
          &[orange] {
            color: #f39a35;
          }
          &[green] {
            color: #70ad47;
          }
        }
      }
    }
  }
  .money-input {
    width: 44%;
    line-height: 24px;
    ::v-deep {
      .el-input {
        line-height: 20px;
      }
      .el-input__inner {
        height: 20px;
        line-height: 20px;
      }
    }
  }
</style>
