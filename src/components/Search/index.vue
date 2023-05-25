<template>
  <div class="M-search" :class="inline ? 'inline' : ''">
    <el-form ref="form" :model="form" :inline="(config.inline || true)">
      <div class="M-searchNormal">
        <div class="M-searchNormalItems">
          <template v-if="isBlock">
            <div ref="normalBlock" :class="blockClass" :style="{position: 'relative', height: blockClass ? `${normalHeight}px` : 'auto'}">
              <slot name="prv" :model="form" :setting="setting.normal" />
              <slot
                v-if="config.firstSlot"
                name="normal"
                :model="form"
                :setting="setting.normal"
              />
              <template v-for="(item, index) in setting.normal">
                <accountSelect
                  v-if="item.key === 'accountId'"
                  :key="item.key"
                  :conf="item.conf"
                  :has-account="item.conf.hasAccount"
                  :inline="true"
                  :list="item.data"
                  :form="form"
                  :no-ajax="true"
                  :is-account-name="item.conf.isAccountName"
                />

                <template v-else>
                  <el-form-item
                    v-show="!item.conf.hidden"
                    :key="item.key"
                    :prop="item.key"
                    :filterable="item.conf.filterable"
                    :clearable="item.conf.clearable"
                    :label="item.label"
                  >
                    <template v-if="item.type !== 'el-select'">
                      <component
                        :is="item.type"
                        v-if="item.hide !== true"
                        v-model="form[item.key]"
                        :options="item.data"
                        v-bind="item.conf"
                        :props="item.props || (item.conf || {}).props"
                        @change="onChange(form[item.key], item, 'normal', index)"
                      />
                    </template>
                    <template v-else>
                      <vselect v-model="form[item.key]" :config="item" :form="form" :has-account="item.conf.hasAccount" @sChange="onChange(form[item.key], item, 'normal', index)" />
                    </template>
                  </el-form-item>
                </template>
              </template>
            </div>
          </template>
          <template v-else>
            <slot name="prv" :model="form" :setting="setting.normal" />
            <slot
              v-if="config.firstSlot"
              name="normal"
              :model="form"
              :setting="setting.normal"
            />
            <template v-for="(item, index) in setting.normal">
              <template v-if="item.key === 'accountId'">
                <accountSelect
                  v-if="!item.lazyLoadApi"
                  :key="item.key"
                  :conf="item.conf"
                  :has-account="item.conf.hasAccount"
                  :inline="true"
                  :list="item.data"
                  :form="form"
                  :no-ajax="true"
                  :is-account-name="item.conf.isAccountName"
                />
                <SelectLazy v-else :key="item.key" class="m-r-24" :form="form" :config="item" />
              </template>
              <template v-else>
                <el-form-item
                  v-show="!item.conf.hidden"
                  :key="item.key"
                  :prop="item.key"
                  :filterable="item.conf.filterable"
                  :clearable="item.conf.clearable"
                  :label="item.label"
                >
                  <template v-if="item.type !== 'el-select'&&item.type !== 'el-cascaderSlot'">
                    <component
                      :is="item.type"
                      v-if="item.hide !== true"
                      v-model="form[item.key]"
                      :options="item.data"
                      v-bind="item.conf"
                      :props="item.props || (item.conf || {}).props"
                      :onkeyup="item.type === 'el-input' && item.conf.number ? `value=value.replace(/[^0-9]/g, '')` : ''"
                      @change="onChange(form[item.key], item, 'normal', index)"
                    />
                  </template>
                  <template v-else-if="item.type==='el-cascaderSlot'">
                    <slot v-if="!item.slotName" name="cascader" :model="form" :setting="setting.cascader" />
                    <!-- 自定义插入任意位置el-form-item-->
                    <slot v-else name="accountSelect" />
                  </template>
                  <template v-else>
                    <vselect v-model="form[item.key]" :config="item" :form="form" :has-account="item.conf.hasAccount" @sChange="onChange(form[item.key], item, 'normal', index)" />
                  </template>
                </el-form-item>
              </template>
            </template>
          </template>

          <slot
            v-if="!config.firstSlot"
            name="normal"
            :model="form"
            :setting="setting.normal"
          />

          <slot name="btn-prv" :model="form" :setting="setting.normal" />
          <el-form-item v-if="!setting.adv || !setting.adv.length" class="M-searchNormalFns">
            <el-button
              type="primary"
              :data-burry_btn_name="isBurry ? 'search': ''"
              @click="onSubmit"
            >{{ config.text.submit }}</el-button>
            <el-button
              v-if="config.hasExport"
              @click="onExport"
            >{{ config.text.export }}</el-button>
            <slot name="btns" :model="form" :setting="setting" :reset="reset" />
          </el-form-item>
        </div>
        <div v-if="!config.hide" class="M-searchNormalCtrl" @click="toggle">
          {{ config.text[advStatus ? "collapse": "expand"] }}
          <i
            :class="{'el-icon-caret-bottom': !advStatus, 'el-icon-caret-top': advStatus}"
          />
        </div>
      </div>
      <el-collapse-transition>
        <div v-show="advStatus" v-if="setting.adv && setting.adv.length" class="M-searchExt">
          <div class="M-searchAdv">
            <el-form-item
              v-for="(item, index) in setting.adv"
              :key="item.key"
              :prop="item.key"
              :filterable="item.conf.filterable"
              :clearable="item.conf.clearable"
              :label="item.label"
            >
              <template v-if="item.type !== 'el-select'">
                {{ 1312 }}
                <component
                  :is="item.type"
                  v-if="item.hide !== true"
                  v-model="form[item.key]"
                  :placeholder="item.conf.placeholder"
                  :options="item.data"
                  :filterable="item.conf.filterable"
                  :clearable="item.conf.clearable"
                  :allow-create="item.conf.allowCreate"
                  :filter-method="item.conf.filterMethod"
                  :default-first-option="item.conf.defaultFirst"
                  @visibleChange="item.conf.visibleChangeMethod"
                  @change="onChange(form[item.key], item, 'adv', index)"
                />
              </template>
              <vselect v-else :config="item" @change="onChange(form[item.key], item, 'normal', index)" />
            </el-form-item>
            <slot name="adv" :model="form" :setting="setting.adv" />
          </div>
          <div class="M-searchFns">
            <el-form-item>
              <el-button
                type="primary"
                :data-burry_btn_name="isBurry ? 'search': ''"
                @click="onSubmit"
              >{{ config.text.submit }}</el-button>
            </el-form-item>
            <el-form-item v-if="config.hasExport">
              <el-button
                type="primary"
                plain
                @click="onExport"
              >{{ config.text.export }}</el-button>
            </el-form-item>
            <slot name="btns" :model="form" :setting="setting" :reset="reset" />
          </div>
        </div>
      </el-collapse-transition>
    </el-form>
    <div class="M-add-btn">
      <slot name="addBtn" />
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
import vselect from '@/components/Select'
// import './index.scss'
import { isUndefined } from '@/components/common'
import accountSelect from '@/components/AccountSelect/index.vue'
import SelectLazy from '@/components/SelectLazy/index.vue'
/**
 * 组件类型判断正则
 * @type {RegExp}
 */
const EL_REG_EXP = /^el-/

/**
 * 默认文本
 * @type {Object}
 */
const DEF_TEXT = {
  submit: '查询',
  export: '导出',
  collapse: '收起筛选项',
  expand: '展开筛选项'
}

/**
 * 配置项处理函数
 * @param  {Array} items 配置数组
 * @return {Array}       处理完的数组
 */
function processItem(items) {
  return items.map(function(item) {
    let mapName = item.type
    if (mapName === 'select' && !item.data) {
      Vue.set(item, 'data', [])
    }
    if (!EL_REG_EXP.test(mapName)) {
      mapName = `el-${mapName}`
    }
    item.type = mapName
    item.conf = item.conf || {}
    return item
  })
}

export default {
  components: {
    vselect,
    accountSelect,
    SelectLazy
  },
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    isBurry: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean
    },
    isBlock: {
      type: Boolean,
      default: false
    },
    blockClass: {
      type: String,
      default: ''
    },
    normalHeight: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {},
      advStatus: true
    }
  },
  computed: {
  // 真正用于生成的配置项
    setting() {
      return {
        normal: processItem(this.config.normal || []),
        adv: processItem(this.config.adv || [])
      }
    }
  },
  watch: {
    config(val) {
      this.processConfig()
    }
  },
  created() {
    this.processConfig()
  },
  mounted() {
    this.bus = this.$bus.$on('platChange', () => {
      this.form.accountId = ''
      this.form.belongName = ''
      this.form.accountName = ''
    })
  },
  activated() {
    if (this.bus) return
    this.bus = this.$bus.$on('platChange', () => {
      this.form.accountId = ''
      this.form.belongName = ''
      this.form.accountName = ''
    })
  },
  deactivated() {
    this.$bus.$off('platChange')
    this.bus = null
  },
  beforeDestroy() {
    this.$bus.$off('platChange')
  },
  methods: {
    visibleChange(val) {
      if (val) {
		            // 此处可以出来选中下拉选项，清空input搜索值
                }
                this.$nextTick(() => {
                  console.info('------------visibleChange')
                  // 添加这段代码
                  const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
                  Array.from($el).map((item) => item.removeAttribute('aria-owns'))
              })
    },
    processConfig() {
      var show = !this.config.hide
      if (!this.config.adv || (this.config.adv && !this.config.adv.length)) {
        show = false
        this.config.hide = true
      }
      this.advStatus = show
      // 处理默认文本
      this.config.text = this.config.text || {}
      Object.keys(DEF_TEXT).forEach(key => {
        this.config.text[key] = this.config.text[key] || DEF_TEXT[key]
      })
      // 默认开启的属性
      var defEnable = ['clearable', 'filterable'];
      // 处理默认 model
      (this.config.normal || []).concat(this.config.adv || []).forEach(item => {
        if (item.key) {
          Vue.set(this.form, item.key, typeof item.value !== undefined ? item.value : '')
        }
        if (isUndefined(item.conf)) {
          item.conf = {}
        } else {
          defEnable.forEach(function(type) {
            if (isUndefined(item.conf[type])) {
              item.conf[type] = true
            }
          })
        }
      })
    },
    /**
     * 提交
     */
    onSubmit() {
      this.$emit('submit', this.form)
      this.$bus.$emit('upLog', { ...this.form })
    },
    /**
     * 导出
     */
    onExport() {
      this.$emit('export', this.form)
      this.$bus.$emit('upLog', { ...this.form })
    },
    /**
     * 组件内容变化
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     */
    onChange(val, item, type, index) {
      if (item.key === 'platId') {
        this.$bus.$emit('platChange')
      }
      this.$emit('change', val, item, type, index, this.form)
    },
    toggle() {
      this.advStatus = !this.advStatus
    },
    /**
     * 重置
     */
    reset() {
      this.$bus.$emit('reset')
      // this.$refs.form.resetFields()
      for (const key in this.form) {
        this.form[key] = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .M-searchNormalItems {
    position: relative;
  }

  .M-search {
    &.inline {
      display: inline-block;
    }
  }

  .hideNormal {
    overflow-y: hidden;
  }
</style>
