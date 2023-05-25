<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-09 16:40:31
 * @LastEditTime: 2020-12-15 11:31:06
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="编辑账号刊例信息"
    :visible="editShow"
    @open="handleOpen"
    @close="$emit('update:editShow', false)"
  >
    <div class="edit-info flex">
      <img :src="data.accountImg" alt="">
      <div>
        <div class="edit-info-item">
          <span>平台：{{ data.platName }}</span>
          <span>账号名称：{{ data.accountName }}</span>
          <span>ID：{{ data.eidOrGetDataUrl }}</span>
        </div>
        <div class="edit-info-item">账号归属：{{ data.accountBelong }}</div>
        <div class="edit-info-item">粉丝量：{{ data.fansNum }}万</div>
      </div>
    </div>
    <div class="content-wrap flex">
      <span>内容类型</span>
      <div class="check-wrap">
        <el-checkbox-group v-model="checkList" :max="6">
          <template v-for="item in tagValueList">
            <el-checkbox v-if="item.tagName !== '全部'" :key="item.tagId" :label="item.tagId">{{ item.tagName }}</el-checkbox>
          </template>
        </el-checkbox-group>
      </div>
    </div>
    <el-row v-if="data.showOfferFlag" class="m-t-24" type="flex" justify="space-around">
      <el-col :span="11">
        <span class="w-80">21-60s报价：</span><el-input-number v-model="editData.sixPrice" :precision="2" :min="0" /> 元
        <IconTip
          placement="top-center"
          trigger="hover"
          type="el-popover"
          icon-class="iconwenhao"
          content="抖音账号数据来源为星图平台，系统每月自动更新一次（每月第二日），可能存在一定偏差，支持编辑校准。其他平台数据以用户编辑数值为准。"
        />
      </el-col>
      <el-col :span="11">
        <span class="w-80">全网报价：</span><el-input-number v-model="editData.netPrice" :precision="2" :min="0" /> 元
      </el-col>
    </el-row>
    <template slot="footer">
      <el-button @click="$emit('update:editShow', false)">取 消</el-button>
      <el-button v-loading="editLoading" type="primary" @click="hanleEditSave">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { $editAdvAccount } from '@/api/bill-adv-manage'
import { IconTip } from 'components'
export default {
  components: { IconTip },
  props: {
    editShow: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    tagValueList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      checkList: [],
      editData: {
        sixPrice: 0,
        netPrice: 0
      },
      editLoading: false
    }
  },
  methods: {
    hanleEditSave() {
      this.editLoading = true
      const params = {
        tagId: this.checkList.join(','),
        sixPrice: this.editData.sixPrice,
        netPrice: this.editData.netPrice,
        accountId: this.data.accountId
      }
      $editAdvAccount(params).then(res => {
        if (res.code === 1) {
          this.hanleCancel()
          this.$emit('success', {})
          this.$message.success('修改成功')
          this.$bus.$emit('upLog', { ...params, operation_module: '编辑确定' })
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
    hanleCancel() {
      this.checkList = []
      this.$emit('update:editShow', false)
      this.editData = {
        sixPrice: 0,
        netPrice: 0
      }
    },
    handleOpen() {
      this.editData = {
        sixPrice: this.data.sixPrice || 0,
        netPrice: this.data.netPrice || 0
      }
      let checkList = this.data.tagId ? this.data.tagId.split(',') : []
      if (checkList[0] === '') {
        checkList = []
      }
      this.checkList = checkList.map(Number)
    }
  }
}
</script>
<style lang="scss">
  .edit-info {
    img {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      margin-right: 20px;
    }
    > div {
      flex: 1;
    }
    .edit-info-item {
      display: flex;
      line-height: 30px;
      padding-right: 50px;
      color: rgb(32, 31, 31);
      > span {
        margin-right: 60px;
      }
    }
  }
  .content-wrap {
    margin-top: 20px;
    > span {
      flex-shrink: 0;
      text-align: right;
      width: 80px;
      margin-right: 20px;
    }
    .check-wrap {
      padding: 10px;
      background: #fafafa;
    }
  }
  .w-80 {
    width: 80px;
    text-align: right;
  }
</style>
