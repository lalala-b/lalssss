<template>
  <div>
    <wrap class="m-b-20">
      <div class="m-b-20">搜索</div>
      <div class="screen searchScreen">
        <div v-for="(item, index) in searchOptions" :key="index">
          <span>
            <span class="smallTitle">搜索选项属性{{ index + 1 }}：</span>

            <el-select
              v-model="item.type"
              class="input"
              @change="handleChangeSearchSelect(index)"
            >
              <el-option v-for="it in TYPE" :key="it" :value="it" :label="it" />
            </el-select>

            <el-input v-model="item.key" class="input" placeholder="key" />

            <el-input
              v-model="item.placeholder"
              class="input"
              placeholder="placeholder"
            />

            <el-input
              v-if="item.type !== 'input'"
              v-model="item.optionValKey"
              class="input"
              placeholder="optionValKey"
            />

            <el-input
              v-if="item.type !== 'input'"
              v-model="item.optionLabelKey"
              class="input"
              placeholder="optionLabelKey"
            />

            <el-input
              v-model="item.permission"
              class="input"
              placeholder="permission"
            />

            <el-button
              v-if="searchOptions.length > 1"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteSearchOptions(index)"
            />

            <el-button
              v-if="index === searchOptions.length - 1"
              type="primary"
              icon="el-icon-plus"
              @click="handleAddSearchOptions"
            />
          </span>
        </div>
      </div>

      <div class="line m-t-20 m-b-20" />

      <div class="m-t-10 m-b-10">
        <span class="title">是否包含搜索插槽:</span>
        <el-radio v-model="haveSlot" :label="false">否</el-radio>
        <el-radio v-model="haveSlot" :label="true">是</el-radio>
      </div>

      <div v-if="haveSlot" class="screen slotScreen">
        <div v-for="(item, index) in slotArr" :key="index">
          <span>
            <span class="smallTitle">插槽属性{{ index + 1 }}：</span>
            <el-input
              v-model="item.label"
              class="input"
              placeholder="输入label"
            />

            <el-input v-model="item.key" class="input" placeholder="输入key" />

            <el-input
              v-model="item.startKey"
              class="input"
              placeholder="startKey"
            />

            <el-input
              v-model="item.endKey"
              class="input"
              placeholder="endKey"
            />

            <el-input
              v-model="item.permission"
              class="input"
              placeholder="permission"
            />

            <el-select v-model="item.default" class="input">
              <el-option
                v-for="it in SLOT_DEFAULT_ARR"
                :key="it.key"
                :value="it.key"
                :label="it.value"
              />
            </el-select>

            <span class="title">可清除:</span>
            <el-radio
              v-model="item.clearable"
              class="clearRadio"
              :label="false"
            >否</el-radio>
            <el-radio
              v-model="item.clearable"
              class="clearRadio"
              :label="true"
            >是</el-radio>

            <el-button
              v-if="slotArr.length > 1"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteSlotArr(index)"
            />

            <el-button
              v-if="index === slotArr.length - 1"
              type="primary"
              icon="el-icon-plus"
              @click="handleAddSlotArr"
            />
          </span>
        </div>
      </div>

      <div class="line m-t-20 m-b-20" />

      <div>
        <span class="title">是否有导出:</span>
        <el-radio v-model="haveExport" :label="false">否</el-radio>
        <el-radio v-model="haveExport" :label="true">是</el-radio>
        <el-input
          v-if="haveExport"
          v-model="exportCode"
          class="input"
          placeholder="输入导出code"
        />

        <el-input
          v-if="haveExport"
          v-model="exportUrl"
          class="input"
          placeholder="导出接口地址"
        />
      </div>
    </wrap>

    <wrap class="m-b-20">
      <div>
        <span class="title">是否包含聚合:</span>
        <el-radio v-model="haveAggregation" :label="false">否</el-radio>
        <el-radio v-model="haveAggregation" :label="true">是</el-radio>
      </div>

      <div v-if="haveAggregation" class="screen">
        <div>
          <span>
            <span class="" style="font-size: 14px">聚合接口导入地址：</span>
            <span
              style="font-size: 14px"
            >import
              <el-input v-model="aggregationReq" class="input">
                <template slot="prepend">$</template></el-input>
              from
              <el-input v-model="aggregationFrom" class="input">
                <template slot="prepend">@/api/</template>
              </el-input></span>
          </span>
        </div>
        <div v-for="(item, index) in aggregationArr" :key="index">
          <span>
            <span class="smallTitle">属性{{ index + 1 }}：</span>
            <el-input v-model="item.key" class="input" placeholder="输入key" />

            <el-input
              v-model="item.title"
              class="input"
              placeholder="输入title"
            />

            <el-input v-model="item.tip" class="input" placeholder="输入tip" />

            <el-button
              v-if="aggregationArr.length > 1"
              type="danger"
              icon="el-icon-delete"
              @click="handleDeleteAggregation(index)"
            />

            <el-button
              v-if="index === aggregationArr.length - 1"
              type="primary"
              icon="el-icon-plus"
              @click="handleAddAggregation"
            />
          </span>
        </div>
      </div>
    </wrap>
    <wrap class="m-b-20">
      <span class="title">是否包含新增/编辑弹窗</span>
      <el-radio v-model="haveDialog" :label="false">否</el-radio>
      <el-radio v-model="haveDialog" :label="true">是</el-radio>
      <el-input
        v-if="haveDialog"
        v-model="dialogName"
        class="input"
        placeholder="请输入弹窗组件的命名"
      />
    </wrap>

    <wrap class="m-b-20">
      <div class="m-b-10">
        <span>
          <span class="" style="font-size: 14px">列表接口导入地址：</span>
          <span
            style="font-size: 14px"
          >import
            <el-input v-model="tableReq" class="input">
              <template slot="prepend">$</template></el-input>
            from
            <el-input v-model="tableForm" class="input">
              <template slot="prepend">@/api/</template>
            </el-input></span>
        </span>
      </div>

      <div
        v-for="(item, index) in tableArr"
        :key="`${index}`"
        class="m-b-10 tableBox"
      >
        <span>
          <span class="smallTitle">列表{{ index + 1 }}：</span>
          <el-input
            v-model="item.prop"
            class="input"
            placeholder="输入prop"
            style="width: 100px"
          />

          <el-input
            v-model="item.label"
            class="input"
            placeholder="输入label"
            style="width: 100px"
          />

          <span class="title">使用插槽?:</span>
          <el-radio v-model="item.hasSlot" :label="false">否</el-radio>
          <el-radio v-model="item.hasSlot" :label="true">是</el-radio>

          <span class="title">操作栏?:</span>
          <el-radio v-model="item.isTools" :label="false">否</el-radio>
          <el-radio v-model="item.isTools" :label="true">是</el-radio>

          <span class="title">排序?:</span>
          <el-radio v-model="item.sort" :label="false">否</el-radio>
          <el-radio v-model="item.sort" :label="true">是</el-radio>

          <span class="title">extFields?:</span>
          <el-radio
            v-model="item.extFields"
            :label="false"
            @change="changeExtFields"
          >否</el-radio>
          <el-radio
            v-model="item.extFields"
            :label="true"
            @change="changeExtFields"
          >是</el-radio>

          <el-button
            v-if="tableArr.length > 1"
            type="danger"
            icon="el-icon-delete"
            @click="handleDeleteTable(index)"
          />

          <el-button
            v-if="index === tableArr.length - 1"
            type="primary"
            icon="el-icon-plus"
            @click="handleAddTable"
          />
        </span>
      </div>
    </wrap>

    <div class="footer">
      <el-button type="primary" @click="handleCreateIndex">创建index</el-button>

      <el-button
        v-if="haveAggregation"
        type="primary"
        @click="handleCreateSummary"
      >创建summary</el-button>

      <el-button type="primary" @click="handleCreateTable">创建table</el-button>
      <el-button type="primary" @click="handleCreateDialog">创建弹窗</el-button>
    </div>

    <el-dialog
      title="index.vue"
      :visible.sync="indexDialog"
      width="30%"
      :before-close="handleCloseIndex"
    >
      <el-button type="text" @click="handleCopy(indexStr)">一键复制</el-button><br>
      <span>{{ indexStr }}</span>
    </el-dialog>

    <el-dialog
      title="SummaryItems.vue"
      :visible.sync="summaryDialog"
      width="30%"
      :before-close="handleCloseSummary"
    >
      <el-button type="text" @click="handleCopy(summaryStr)">一键复制</el-button><br>
      <span>{{ summaryStr }}</span>
    </el-dialog>

    <el-dialog
      title="Table.vue"
      :visible.sync="tableDialog"
      width="30%"
      :before-close="handleCloseTable"
    >
      <el-button type="text" @click="handleCopy(tableStr)">一键复制</el-button><br>
      <span>{{ tableStr }}</span>
    </el-dialog>
    <el-dialog
      :title="`${dialogName}.vue`"
      :visible.sync="addDialog"
      width="30%"
      :before-close="handleCloseDialog"
    >
      <el-button type="text" @click="handleCopy(dialogStr)">一键复制</el-button><br>
      <span>{{ dialogStr }}</span>
    </el-dialog>
  </div>
</template>

<script>
const aggregationArrItem = {
  key: '',
  title: '',
  tip: ''
}

const searchOptionsItem = {
  type: 'select',
  key: '',
  placeholder: '',
  optionLabelKey: '',
  optionValKey: '',
  permission: ''
}

const slotArrItem = {
  key: '',
  label: '',
  clearable: false,
  startKey: '',
  endKey: '',
  permission: '',
  default: ''
}

const tableArrItem = {
  prop: '',
  label: '',
  hasSlot: false,
  isTools: false,
  sort: false,
  extFields: false
}

export default {
  data() {
    return {
      searchOptions: [
        {
          type: 'select',
          key: '',
          placeholder: '',
          optionLabelKey: '',
          optionValKey: '',
          permission: ''
        }
      ],
      TYPE: ['select', 'input'],
      haveSlot: false,
      slotArr: [
        {
          key: '',
          label: '',
          clearable: false,
          startKey: '',
          endKey: '',
          permission: '',
          default: ''
        }
      ],
      SLOT_DEFAULT_ARR: [
        {
          key: '',
          value: '无默认'
        },
        {
          key: '7',
          value: '7天'
        },
        {
          key: '15',
          value: '15天'
        },
        {
          key: '30',
          value: '30天'
        }
      ],
      haveAggregation: false,
      aggregationArr: [
        {
          key: '',
          title: '',
          tip: ''
        }
      ],
      aggregationReq: '',
      aggregationFrom: '',
      haveExport: false,
      exportUrl: '',
      exportCode: '',
      indexStr: '',
      indexDialog: false,
      summaryStr: '',
      summaryDialog: false,

      tableArr: [
        {
          prop: '',
          label: '',
          hasSlot: false,
          isTools: false,
          sort: false,
          extFields: false,
          permission: ''
        }
      ],
      tableReq: '',
      tableForm: '',
      tableStr: '',
      tableDialog: false,
      // 新增或者编辑弹窗
      dialogStr: '',
      addDialog: false,
      haveDialog: false,
      dialogName: '',
      haveExtFields: false
    }
  },
  watch: {
    haveAggregation(val) {
      if (!val) {
        this.aggregationArr = [
          {
            key: '',
            title: '',
            tip: ''
          }
        ]
      }
    },

    haveSlot(val) {
      if (!val) {
        this.slotArr = [
          {
            key: '',
            label: '',
            clearable: false,
            startKey: '',
            endKey: '',
            default: ''
          }
        ]
      }
    },

    haveExport(val) {
      if (!val) {
        this.exportCode = ''
        this.exportUrl = ''
      }
    }
  },
  methods: {
    changeExtFields(val) {
      this.haveExtFields = val
    },
    handleAddSearchOptions() {
      this.searchOptions.push({
        ...searchOptionsItem
      })
    },

    handleDeleteSearchOptions(index) {
      const searchOptions = [...this.searchOptions]
      searchOptions.splice(index, 1)
      this.searchOptions = searchOptions
    },

    handleAddAggregation() {
      this.aggregationArr.push({
        ...aggregationArrItem
      })
    },

    handleDeleteAggregation(index) {
      const aggregationArr = [...this.aggregationArr]
      aggregationArr.splice(index, 1)
      this.aggregationArr = aggregationArr
    },

    handleAddSlotArr() {
      this.slotArr.push({
        ...slotArrItem
      })
    },

    handleDeleteSlotArr(index) {
      const slotArr = [...this.slotArr]
      slotArr.splice(index, 1)
      this.slotArr = slotArr
    },

    handleAddTable() {
      this.tableArr.push({
        ...tableArrItem
      })
    },

    handleDeleteTable(index) {
      const tableArr = [...this.tableArr]
      tableArr.splice(index, 1)
      this.tableArr = tableArr
    },

    handleCreateIndex() {
      let slotDefault = ''
      let formatStr = ''
      const str = `
<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"${
          this.haveExport
            ? `
        @export="onExport"`
            : ''
        }
        @change="onChange"
      ${
        this.haveSlot
          ? `>
        <template v-slot:normal="target">
          ${this.slotArr
            .map((item) => {
              return `<el-form-item label="${item.label}" ${
                item.permission
                  ? `v-if="$permission('${item.permission}')"`
                  : ''
              }>
            <el-date-picker
              v-model="target.model.${item.key}"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="${item.clearable}"
            />
          </el-form-item>`
            })
            .join(',')
            .replace(
              new RegExp(',', 'g'),
              `
          `
            )}
        </template>
      </Search>
          `
          : `
      />`
      }
    </wrap>
    ${
      this.haveAggregation
        ? `
    <wrap class="m-t-24">
      <SummaryItems
        ref="summary"
        :search-data="searchData"
      />
    </wrap>`
        : ''
    }
    <wrap class="m-t-24">
      <div class="checkbox-view m-b-16">
        <el-checkbox
          v-for="item in extFields"
          :key="item.fieldName"
          v-model="item.status"
          :label="item.fieldName"
        >{{ item.chnName }}</el-checkbox>
      </div>
      <VTable
        ref="table"
        :search-data="searchData"
        :ext-fields="extFields"
        :plat-owner="platOwner"
      />
      ${
        this.haveDialog
          ? `<${this.dialogName ? `${this.dialogName}` : 'DefaultDialog'}
           v-if="showDialog"
            v-model="showDialog"
            @success="getList"
            />`
          : ''
      }
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components';
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api';
import Table from '../_com/Table';${
        this.haveAggregation
          ? `
import SummaryItems from '../_com/SummaryItems';`
          : ''
      }
${
  this.haveDialog
    ? `import ${this.dialogName} from '../_com/${this.dialogName}'`
    : ''
};
import { copy } from '@/utils';
import {
  $getProprietaryFundOrgId,
  $getSelfAccount,
  $getBasePlatInfo
} from '@/api/bussiness-manage';
import { $getAccontByOrgIdOrPlatId } from '@/api/military-manage';

import qs from 'qs';

export default {
  components: {
    VTable: Table,
    Search,${
      this.haveAggregation
        ? `
    SummaryItems,`
        : ''
    }${this.haveDialog ? this.dialogName : ''}
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy;
      const formConf = reactive({
        normal: [],${
          this.haveExport
            ? `
        hasExport: $permission('${this.exportCode}')`
            : ''
        }
      });

      const states = reactive({
        ${this.haveDialog ? 'showDialog:false' : ''}
      });

      const searchData = ref({});

      ${
        this.haveSlot
          ? `
        $nextTick(() => {${
          this.slotArr.forEach((item) => {
            if (item.default) {
              slotDefault += `const ${
                item.endKey
              } = dayjs().format('YYYY-MM-DD');
        const ${item.startKey} = dayjs().add(-${
                item.default
              }, 'day').format('YYYY-MM-DD');
        $set($refs.search.form, '${item.key}', [
          ${`\`\$\{${item.startKey}\}\``},
          ${`\`\$\{${item.endKey}\}\``},
        ]);
        searchData.value.${item.startKey} = ${item.startKey} + ' 00:00:00';
        searchData.value.${item.endKey} = ${item.endKey} + ' 23:59:59';`
            }
          })
            ? ''
            : ''
        }})`
          : ''
      }
      const handleGetList = () => {
        $nextTick(() => {
          ${this.haveAggregation ? '$refs.summary.getClickCount();' : ''}
          $refs.table.getList();
        })
      };

      const normalFormItemMap = {};
      const buildFormConf = () => {
        let normal = ${JSON.stringify(
          this.searchOptions.map(
            ({
              type,
              key,
              placeholder,
              optionLabelKey,
              optionValKey,
              permission
            }) => {
              const item = {
                type,
                key,
                data: [],
                conf: {
                  placeholder
                },
                optionLabelKey,
                optionValKey,
                permissionName: permission
              }

              if (type === 'input') {
                delete item.optionLabelKey
                delete item.optionValKey
              }

              if (!permission) delete item.permissionName
              return item
            }
          )
        )}
        ;normal = normal.filter(function(item, index) {
          if (item.permissionName && !$permission(item.permissionName)) {
            return false
          }
          item.index = index;
          normalFormItemMap[item.key] = item;
          return true
        });
        formConf.normal = normal
      };
      ${
        this.haveSlot
          ? `
      const formatData = (data) => {
        const params = copy(data);${
          this.slotArr.forEach((item) => {
            formatStr += `if (params.${item.key}) {
          params.${item.startKey} = params.${item.key}[0] + ' 00:00:00';
          params.${item.endKey} = params.${item.key}[1] + ' 23:59:59';
          delete params.${item.key}
        };`
          })
            ? ''
            : ''
        }
        ${formatStr}
        return params;
      };
      `
          : ''
      }
      const onChange = (val, item, type, index, model) => {
      };

      const onSubmit = (data) => {
        ${
          this.haveSlot
            ? 'const params = formatData(data);Object.assign(searchData.value, params);'
            : ''
        }

        Object.assign(searchData.value, ${this.haveSlot ? 'params' : 'data'});
        handleGetList();
      };

      ${
        this.haveExport
          ? `const onExport = (data) => {
        ${
          this.haveSlot
            ? `const params = formatData(Object.assign({}, searchData.value, data));`
            : `const params = Object.assign({},searchData.value, data)`
        }
        ${
          this.haveExtFields
            ? `
        const propertyNameList = []
      for (const key in extFields) {
        if (!extFields[key].status) {
          propertyNameList.push(key)
        }
      }
      `
            : ''
        }

        window.open(
          \`${`${this.exportUrl}?\$\{qs.stringify({
            ...params
          })\}\``}
        );
      };`
          : ''
      }
      ${
        this.haveDialog
          ? `
      const handleShow = ()=>{
      this.showDialog = true
       }`
          : ''
      }
      buildFormConf();
      handleGetList()
    return {
      searchData,
      formConf,
      onSubmit,
      onChange,
      ...toRefs(states),
      ${this.haveDialog ? 'handleShow,' : ''}
      ${this.haveExport ? 'onExport,' : ''}
      ${this.haveAggregation ? 'summaryItems' : ''}
    }
  }
}
<\/script>`

      this.indexStr = str
      this.indexDialog = true
    },

    handleCloseIndex() {
      this.indexDialog = false
    },

    handleCreateSummary() {
      let sumStr = ''

      this.aggregationArr.forEach((item) => {
        sumStr += `{
          key: '${item.key}',
          val: 0,
          text: '${item.title}',
          ${item.tip ? `tip: '${item.tip}'` : ''}
        },`
      })

      const str = `
<template>
  <Statistics
    v-loading="loading"
    class="statistics data-wrap"
    :data="summaryItems"
  />
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref
} from '@vue/composition-api';
import { Statistics } from 'components';
import { $${this.aggregationReq} } from '@/api/${this.aggregationFrom}';
import { copy } from '@/utils';
export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  components: { Statistics },
  setup(props) {
    const { $message } = getCurrentInstance().proxy;
    const loading = ref(false);
    const summaryItems = reactive([${sumStr}]);

    const getClickCount = function() {
      loading.value = true;
      const searchData = copy(props.searchData);

      return $${this.aggregationReq}({
        ...searchData
      })
        .then((res) => {
          loading.value = false;
          if (res.code === 1) {
            summaryItems.forEach((item) => {
              item.val = res.data[item.key]
            });
          } else {
            $message.error(res.message);
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return;
          loading.value = false;
          $message.error(err.message || '网络错误');
        })
    };
    return {
      loading,
      summaryItems,
      getClickCount
    };
  }
})
<\/script>
<style lang="scss" scoped>
.data-wrap {
  background: rgba(0, 95, 246, 0.05);
}
</style>
`
      this.summaryStr = str
      this.summaryDialog = true
    },

    handleCloseSummary() {
      this.summaryDialog = false
    },

    handleCreateTable() {
      let temStr = ``
      this.tableArr.forEach(
        ({ prop, label, hasSlot, sort, extFields, permission, isTools }) => {
          if (isTools) {
            temStr += `
          <el-table-column
            ${permission ? `v-if="$permission('${permission}')"` : ''}
            label="操作"
          >
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="handleGoDetail(row)"
              >查看详情</el-button>
            </template>
          </el-table-column>`
          } else {
            temStr += `
          <el-table-column
            prop="${prop}"
            label="${label}"
            ${
              extFields
                ? `v-if="extFields.${prop} && extFields.${prop}.status"`
                : ''
            }
            ${sort ? 'sortable="custom"' : ''}
          ${
            hasSlot
              ? '/>'
              : `>
            <template slot-scope="{ row }">
              {{ row.${prop} || '--' }}
            </template>
          </el-table-column>`
          }
          `
          }
        }
      )

      const str = `
<template>
  <div class="table-view">
    <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
      ${temStr}
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $${this.tableReq} } from '@/api/${this.tableForm}'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  setup(props) {
    const { $message, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: []
    })

    const handleGoDetail = (row) => {}

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $${this.tableReq}({
        ...searchData,
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data.list
            state.total = res.data.total
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      ...toRefs(state),
      doSort,
      getList,
      handleGoDetail
    }
  }
})
<\/script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}
</style>
      `

      this.tableStr = str
      this.tableDialog = true
    },

    handleCloseTable() {
      this.tableDialog = false
    },

    handleCreateDialog() {
      const strTem = `<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    width="600px"
  >
    <div>
      <el-form ref="form" :model="formData" class="m-t-16" :rules="rules">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="formData.name" placeholder="请输入名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.val"
                  :label="item.text"
                  :value="item.val"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="flex flex-justify-end">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="handleSave"
        >确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
`
      const strScript = `<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from '@vue/composition-api'
import { useToggle } from '@/hook'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    }
  },
  components: {},
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const states = reactive({
      typeList: [],
      btnLoading: false
    })
    const formData = reactive({
      name: '',
      type: ''
    })
    const rules = {
      name: {
        required: true,
        message: '请输入名称',
        trigger: 'blur'
      },
      type: {
        required: true,
        message: '请选择类型',
        trigger: 'change'
      }
    }

    const form = ref(null)
    const handleSave = async() => {
      await form.value.validate()
      states.btnLoading = true
      const params = Object.assign({}, formData)
      try {
        let res
        switch (props.type) {
          case 'add':
            res = await $add(params)
            break
          case 'edit':
            res = await $edit(params)
            break
        }
        // const res = await $add(params)
        states.btnLoading = false
        if (res && res.code === 1) {
          $message.success('操作成功')
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
        $message.error('系统错误')
      }
    }
    const title = computed(() => {
      switch (props.type) {
        case 'add':
          return '新增'
        case 'edit':
          return '编辑'
        default:
          return '新增'
      }
    })
    return {
      title,
      formData,
      form,
      rules,
      show,
      handleSave,
      ...toRefs(states)
    }
  }
})
<\/script>
`
      this.dialogStr = strTem + strScript
      this.addDialog = true
    },
    handleCloseDialog() {
      this.addDialog = false
    },
    handleCopy(str) {
      navigator.clipboard.writeText(str).then(() => {
        this.$message.success('复制完成')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 14px;
  margin-right: 20px;
}

.smallTitle {
  font-size: 14px;
  margin-right: 10px;
  display: inline-block;
  width: 60px;
}

.screen {
  margin-top: 20px;
  padding-left: 20px;

  & > div {
    margin-bottom: 20px;

    .span {
      font-size: 14px;
    }
  }
}

.searchScreen {
  padding-left: 0px;

  .smallTitle {
    width: 114px;
  }

  .input {
    width: 120px;
  }

  & > div {
    margin-bottom: 10px;
  }
}

.slotScreen {
  .smallTitle {
    width: 80px;
  }

  .input {
    width: 120px;
  }

  .title {
    margin-right: 4px;
  }
}

.input {
  width: 170px;
  margin-right: 10px;
}

.footer {
  margin-top: 20px;
}

.line {
  border-top: 1px dashed #ccc;
}

.clearRadio {
  margin-right: 6px;
}

::v-deep {
  .tableBox {
    .title {
      margin-right: 6px;
      margin-left: 14px;
    }
    .el-radio {
      margin-right: 8px;
    }
  }
}
</style>
