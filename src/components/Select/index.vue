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
    v-model="sValue"
    v-loadmore="loadMore"
    class="select"
    :placeholder="config.conf.placeholder"
    :filterable="config.conf.filterable"
    :clearable="config.conf.clearable"
    :allow-create="config.conf.allowCreate"
    :multiple-limit="config.conf.limit"
    :multiple="config.conf.multiple"
    :collapse-tags="!config.conf.deCollapseTags"
    :default-first-option="config.conf.defaultFirst"
    :filter-method="dataFilter"
    v-bind="$attrs"
    @change="seletData"
    @visible-change="init"
    @clear="init"
  >
    <el-option
      v-for="(opt, index) in options"
      :key="opt[optionValKey] + '' + index"
      :label="opt[optionLabelKey]"
      :value="opt[optionValKey]"
    />
  </el-select>
</template>
<script>
import { isObject, copy } from '@/utils'
import { isArray } from 'axios/lib/utils'
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {
          conf: {}
        }
      }
    },
    size: {
      type: Number,
      default: 20
    },
    value: {
      type: [Number, String, Array],
      default: ''
    }
  },
  data() {
    return {
      options: [],
      total: 0,
      pageNum: 1,
      optionLabelKey: 'text',
      sValue: ''
    }
  },
  computed: {
    optionValKey() {
      return this.config.optionValKey || 'val'
    }
  },
  watch: {
    'config.data': {
      immediate: true,
      handler(val) {
        if (!val) return
        this.allOptions = copy(val)
        this.total = this.config.data.length
        this.pageNum = 1
        this.dataFilter()
        if (this.value && !this.initValue) {
          this.searchSelectData(this.value)
        }
      },
      deep: true
    },
    'config.optionLabelKey': {
      immediate: true,
      handler(val) {
        this.optionLabelKey = val
      },
      deep: true
    },
    value: {
      immediate: true,
      handler(val) {
        this.sValue = val
        if (val) {
          this.searchSelectData(val)
        }
      },
      deep: true
    }
  },
  created() {
    this.sValue = this.value
    this.optionLabelKey = this.config.optionLabelKey || 'text'
  },
  mounted() {
    this.$bus.$on('reset', () => {
      this.sValue = ''
    })
  },
  activated() {
    this.$bus.$on('reset', () => {
      this.sValue = ''
    })
  },
  deactivated() {
    this.$bus.$off('reset')
  },
  beforeDestroy() {
    this.$bus.$off('reset')
  },
  methods: {
    loadMore() {
      if (this.total > (this.pageNum - 1) * this.size && !this.hidden) {
        this.pageNum += 1
        this.buildOptions(true)
      }
    },
    init(b) {
      if (!b) {
        this.hidden = true
        setTimeout(this.reset, 0)
      } else {
        this.hidden = false
      }
    },
    dataFilter(query = '') {
      if (this.config.data) {
        let allOptions = this.config.data ? copy(this.config.data) : []
        if (query) {
          allOptions = allOptions.filter(item => (item[this.optionLabelKey] || []).includes(query)).sort((a, b) => a[this.optionLabelKey]?.length - b[this.optionLabelKey]?.length)
        }
        this.allOptions = allOptions
        this.total = allOptions.length
        this.pageNum = 1
        if (this.total > this.size && window.addEventListener) {
          this.buildOptions()
        } else {
          this.options = copy(this.allOptions)
        }
      }
    },
    buildOptions(isLoadMore = false) {
      if (isLoadMore) {
        this.options = [...this.options, ...copy(this.allOptions.slice((this.pageNum - 1) * this.size, (this.pageNum - 1) * this.size + this.size))]
      } else {
        this.options = copy(this.allOptions.slice(0, this.size))
      }
    },
    searchSelectData(value) {
      this.initValue = true
      setTimeout(() => {
        if (value) {
          if (isArray(value)) {
            value.forEach(val => {
              this.setNormalVal(val)
            })
          } else {
            this.setNormalVal(value)
          }
        }
      }, 0)
    },

    setNormalVal(value) {
      const allOptions = copy(this.config.data)
      if (allOptions.length === 0) this.initValue = false
      const index = allOptions.findIndex((item) => {
        if (isObject(item)) {
          return item[this.optionValKey] == value
        }
        return item === value
      })

      if (index >= this.size) {
        this.options.unshift(allOptions[index])
        this.allOptions.splice(index, 1)
      }
    },
    seletData(val) {
      // if (val) {
        this.$emit('input', val)
        this.$emit('sChange', val)
      // }
    },
    reset() {
      if (!this.config.data) return
      this.initValue = false
      this.pageNum = 1
      this.options = []
      this.allOptions = this.config.data ? copy(this.config.data) : []
      this.total = this.allOptions.length
      this.buildOptions()
      if (this.sValue) {
        this.searchSelectData(this.sValue)
      }
    }
  }
}
</script>
