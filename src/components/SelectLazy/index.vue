<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-10-13 17:33:07
 * @LastEditTime: 2020-11-04 11:48:44
 * @LastEditors: Linjie
-->
<template>
  <el-select
    ref="Select"
    v-model="accountValue"
    v-loadmore="loadMore"
    class="select"
    :placeholder="config.conf.placeholder"
    :filterable="config.conf.filterable || true"
    :clearable="config.conf.clearable || true"
    :allow-create="config.conf.allowCreate || true"
    :multiple-limit="config.conf.limit"
    :multiple="config.conf.multiple"
    :collapse-tags="!config.conf.deCollapseTags"
    :default-first-option="config.conf.defaultFirst"
    :filter-method="filterMethodThrottle"
    v-bind="$attrs"
    @change="handleChange"
    @focus="handleFocus"
  >
    <el-option
      v-for="(opt, index) in options"
      :key="opt[optionValKey] + '' + index"
      :label="opt[config.optionLabelKey]"
      :value="opt[optionValKey]"
    />
    <div
      v-loading="selectLoading"
      element-loading-spinner="el-icon-loading"
      class="select-loading"
    />
  </el-select>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {
          conf: {},
        };
      },
    },
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    size: {
      type: Number,
      default: 20,
    },
  },
  data() {
    return {
      options: [],
      total: 0,
      pageNum: 1,
      platId: "",
      accountValue: "",
      $api: "",
      selectLoading: false,
      selectVal: "",
      optionValKey: "accountName",
    };
  },
  computed: {
    // 防抖
    filterMethodThrottle() {
      var time = null;
      return (val) => {
        if (time) {
          clearTimeout(time);
        }
        time = setTimeout(() => {
          // 搜索方法
          this.getFilterAccount(val);
          clearTimeout(time);
        }, 500);
      };
    },
  },
  watch: {
    "config.optionLabelKey": {
      immediate: true,
      handler(val) {
        this.optionLabelKey = val;
      },
      deep: true,
    },
    config: {
      handler(val) {
        if (val.lazyLoadApi) {
          this.$api = val.lazyLoadApi;
        }
      },
      deep: true,
      immediate: true,
    },
    "form.platId"(id) {
      this.platId = id;
      this.options = [];
      this.pageNum = 1;
      this.selectVal = "";
      this.accountValue = "";
      if (id) {
        this.optionValKey = "accountId";
      } else {
        this.optionValKey = "accountName";
      }
    },
  },
  methods: {
    async getAccountList() {
      this.selectLoading = true;
      const res = await this.$api({
        accountViewFlag: false,
        pageNum: this.pageNum,
        accountName: this.selectVal,
        platId: this.platId,
      });

      if (res.code === 1) {
        this.selectLoading = false;
        this.total = res.total;
        this.options = [...this.options, ...res.data];
      }
    },
    loadMore() {
      if (this.total > this.pageNum * this.size && !this.selectLoading) {
        this.pageNum += 1;
        this.getAccountList();
      }
    },
    async getFilterAccount(val = "") {
      this.selectVal = "";
      this.options = [];
      if (val) {
        this.pageNum = 1;
        this.selectVal = val;
      } else {
        this.selectVal = "";
      }
      await this.getAccountList();
    },
    handleChange(val) {
      this.$set(this.form, "accountId", "");
      this.$set(this.form, "accountName", "");
      this.$nextTick(() => {
        if (val === this.$refs.Select.createdLabel) {
          this.$set(this.form, "accountName", val);
        } else {
          if (this.form.platId) {
            this.$set(this.form, "accountId", val);
          } else {
            this.$set(this.form, "accountName", val);
          }
        }
      });
    },
    async handleFocus() {
      if (!this.options.length || !this.accountValue) {
        this.options = [];
        this.selectVal = "";
        this.pageNum = 1;
        await this.getAccountList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.select-loading {
  font-size: 16px;
}
</style>
