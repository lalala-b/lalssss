<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-02 11:18:01
 * @LastEditTime: 2020-11-12 10:09:29
 * @LastEditors: Linjie
-->
<template>
  <el-form-item class="C-account" :class="inline ? 'inline' : ''">
    <vselect v-model="accountValue" :config="accountConfig" :form="form" :has-account="hasAccount" @sChange="handleInput" />
  </el-form-item>
</template>
<script>
import vselect from '@/components/Select'
import { $condition } from '@/api/video-manage'
import { unique } from '@/utils'

export default {
  components: { vselect },
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    inline: {
      type: Boolean
    },
    form: {
      type: Object,
      default() {
        return {}
      }
    },
    conf: {
      type: Object,
      default() {
        return {}
      }
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    params: {
      type: Object,
      default() {
        return {}
      }
    },
    hasPlatId: {
      type: Boolean
    },
    hasAccount: {
      type: Boolean
    },
    noAjax: {
      type: Boolean
    },
    isAccountName: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: [],
      accountConfig: {
        conf: {
          filterable: true,
          clearable: true,
          allowCreate: true,
          defaultFirst: true,
          placeholder: this.placeholder || '请选择账号'
        },
        optionValKey: 'accountId',
        optionLabelKey: this.form.platId ? 'accountName' : (this.hasAccount ? 'belongName' : 'accountName'),
        data: []
      },
      accountValue: null
    }
  },
  watch: {
    list(val) {
      if (this.form.platId) {
        this.accountConfig.data = val
      } else {
        this.accountConfig.data = unique(val, this.hasAccount ? 'belongName' : this.isAccountName ? 'accountName' : 'accountId', true)
      }
      this.accountValue = this.form.accountId ? this.form.accountId : ''
    },
    'form.platId'(id) {
      this.accountValue = this.form.accountId ? this.form.accountId : ''
      this.form.accountId = this.form.accountId ? this.form.accountId : ''
      if (id) {
        this.accountConfig.optionLabelKey = 'accountName'
      } else {
        this.accountConfig.optionLabelKey = this.hasAccount ? 'belongName' : 'accountName'
      }
    }

  },
  created() {
    if (this.noAjax) {
      this.accountConfig.data = unique(this.list, this.hasAccount ? 'belongName' : this.isAccountName ? 'accountName' : 'accountId', true)
    } else {
      this.condition()
    }
    this.accountConfig.conf = Object.assign({}, this.accountConfig.conf, this.conf)
  },
  methods: {
    /**
     * 获取账号列表
     */
    async condition() {
      const res = await $condition({
        ...this.params
      })
      if (res.code === 1) {
        // res.data = unique(res.data, this.hasAccount ? 'belongName' : 'accountId')
        res.data = unique(res.data, this.hasAccount ? 'belongName' : this.isAccountName ? 'accountName' : 'accountId', true)

        this.accountConfig.data = res.data || []
      }
    },
    handleInput(val) {
      let key = ''
      if (!this.inOptions(val)) {
        this.$set(this.form, 'accountId', '')
        this.$set(this.form, 'belongName', '')

        key = 'accountName'
        this.$set(this.form, key, val)
      } else if (!this.form.platId && this.hasAccount) {
        this.$set(this.form, 'accountName', '')
        this.$set(this.form, 'accountId', '')
        key = 'belongName'
        val
          ? this.$set(this.form, key, this.seekOption(val).belongName)
          : this.$set(this.form, key, '')
      } else if (!this.form.platId && this.isAccountName) {
        this.$set(this.form, 'belongName', '')
        this.$set(this.form, 'accountId', '')

        key = 'accountName'
        val
          ? this.$set(this.form, key, this.seekOption(val).accountName)
          : this.$set(this.form, key, '')
      } else {
        this.$set(this.form, 'accountName', '')
        this.$set(this.form, 'belongName', '')

        key = 'accountId'
        this.$set(this.form, key, val)
      }
      this.$emit('input', val)
    },
    inOptions(val) {
      return this.accountConfig.data.some((item) => {
        return item[this.accountConfig.optionValKey] === val
      })
    },
    seekOption(value) {
      return this.accountConfig.data.find(item => {
        return item[this.accountConfig.optionValKey] === value
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-account {
    &.inline {
      display: inline-block;
    }
  }
</style>
