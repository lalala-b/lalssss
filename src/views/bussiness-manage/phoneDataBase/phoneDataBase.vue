<!-- eslint-disable vue/no-parsing-error -->

<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="target.model.publishTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-between flex-align-center m-b-24">
        <el-checkbox-group
          v-model="extFieldsArr"
          class="checkbox-wrap checkbox-view"
          @change="getList"
        >
          <el-checkbox label="1"> 5小时重度续航测试 </el-checkbox>
          <el-checkbox label="2"> 原神半小时表现 </el-checkbox>
          <el-checkbox
            label="3"
            :disabled="
              Boolean(
                searchData.phoneType && Number(searchData.phoneType) === 2
              )
            "
          >
            手机屏幕亮度排名
            <IconTip content="仅支持常规手机" icon-class="iconwenhao" />
          </el-checkbox>
          <el-checkbox
            label="4"
            :disabled="
              Boolean(
                searchData.phoneType && Number(searchData.phoneType) === 1
              )
            "
          >
            手机屏幕亮度排名(内屏)
            <IconTip content="仅支持折叠屏手机" icon-class="iconwenhao" />
          </el-checkbox>
          <el-checkbox
            label="5"
            :disabled="
              Boolean(
                searchData.phoneType && Number(searchData.phoneType) === 1
              )
            "
          >
            手机屏幕亮度排名(外屏)
            <IconTip content="仅支持折叠屏手机" icon-class="iconwenhao" />
          </el-checkbox>
          <el-checkbox label="6"> 充电速度排行 </el-checkbox>
          <el-checkbox label="7"> 20款应用测试 </el-checkbox>
        </el-checkbox-group>
        <div class="btn-wrap">
          <el-button
            v-if="$permission('add_new_model')"
            type="primary"
            @click="handleAddModel('add')"
          >新增机型</el-button>
          <el-popover
            :disabled="showDisableBtnTip ? false : true"
            placement="top"
            width="200"
            trigger="hover"
            :content="disableBtnTipContent"
          >
            <el-button
              v-if="showDisableBtnTip"
              slot="reference"
              class="disabledBtn"
              plain
            >生成海报
            </el-button>
            <el-button
              v-else
              slot="reference"
              type="primary"
              plain
              @click="handleCreatePoster"
            >生成海报</el-button>
          </el-popover>
        </div>
      </div>
      <el-table
        v-loading="loading"
        v-scrollbar
        :data="tableData"
        :row-key="getRowKey"
        header-row-class-name="table-header"
        @sort-change="doSort"
        @selection-change="handleSelectChange"
      >
        <el-table-column type="selection" width="55" fixed="left" />
        <!-- <el-table-column prop="phoneId" label="手机ID" fixed="left">
          <template slot-scope="{row}">
            {{ row.phoneId || '--' }}
          </template>
        </el-table-column> -->
        <el-table-column prop="phoneName" label="机型" fixed="left">
          <template slot-scope="{ row }">
            {{ row.phoneName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneTypeDesc" label="手机类型">
          <template slot-scope="{ row }">
            {{ row.phoneTypeDesc || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="publishTime"
          label="发布时间"
          sortable="custom"
          width="140"
        >
          <template slot-scope="{ row }">
            {{ row.publishTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="常规参数" prop="normalParams">
          <el-table-column prop="storage" label="存储">
            <template slot-scope="{ row }">
              {{ row.storage || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="cpu" label="SoC">
            <template slot-scope="{ row }">
              {{ row.cpu || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="systemVersion" label="系统版本">
            <template slot-scope="{ row }">
              {{ row.systemVersion || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="power" label="性能模式">
            <template slot-scope="{ row }">
              {{ row.performanceMode || '--' }}
            </template>
          </el-table-column>
          <el-table-column width="100" prop="electricity" label="电池容量">
            <template slot="header">
              <div>电池容量</div>
              <div>（mAh）</div>
            </template>
            <template slot-scope="{ row }">
              {{ row.electricity || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="power" label="充电功率（W）">
            <template slot="header">
              <div>充电功率</div>
              <div>（W）</div>
            </template>
            <template slot-scope="{ row }">
              {{ row.power || '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-if="extFieldsArr.includes('1')"
          prop="severeEnduranceTestForFive"
          label="5小时重度续航测试（百分比/电量）"
        >
          <!-- <template slot="header">
            <IconTip
              content="xxxxxx"
              label="5小时重度续航测试（百分比/电量）"
              icon-class="iconwenhao"
            />
          </template> -->
          <el-table-column prop="bilibili" label="B站5G" sortable="custom">
            <template slot="header">
              <div>B站5G</div>
              <div>(60min)</div>
            </template>

            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.battlefield||row.fiveHourTest.battlefield===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.bilibiliDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.battlefield+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="weibo" label="微博5G" sortable="custom">
            <template slot="header">
              <div>微博5G</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.weibo||row.fiveHourTest.weibo===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.weiboDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.weibo+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="genshinImpact"
            label="原神WIFI"
            sortable="custom"
            width="110"
          >
            <template slot="header">
              <div>原神WIFI</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.genshinImpact||row.fiveHourTest.genshinImpact===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.genshinImpactDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.genshinImpact+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="recordScreen" label="录屏5G" sortable="custom">
            <template slot="header">
              <div>录像5G</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.recordScreen||row.fiveHourTest.recordScreen===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.recordScreenDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.recordScreen+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="honorKings"
            label="王者荣耀5G"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <div>王者荣耀5G</div>
              <div>(60min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.honorKings||row.fiveHourTest.honorKings===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.honorKingsDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.honorKings+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="douyin" label="抖音WIFI" width="120" sortable="custom">
            <template slot="header">
              <div>抖音WIFI</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.douyin||row.fiveHourTest.douyin===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.douyinDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.douyin+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="taobao" label="淘宝WIFI" width="120" sortable="custom">
            <template slot="header">
              <div>淘宝WIFI</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.taobao||row.fiveHourTest.taobao===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.taobaoDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.taobao+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column
            prop="battlefield"
            label="和平精英WIFI"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <div>和平精英WIFI</div>
              <div>(30min)</div>
            </template>
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest&&(row.fiveHourTest.battlefield||row.fiveHourTest.battlefield===0)">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.battlefieldDesc"
                  placement="top-end"
                >
                  <span>{{ row.fiveHourTest.battlefield+'%' }}</span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="remain" label="剩余电量" width="130" sortable="custom">
            <template slot-scope="{ row }">
              <template v-if="row.fiveHourTest">
                <el-tooltip
                  effect="dark"
                  :content="row.fiveHourTest.remainDesc||'0mAh'"
                  placement="top-end"
                >
                  <span>
                    {{
                      +row.fiveHourTest.remain < 0
                        ? '0%'
                        : `${row.fiveHourTest.remain}%`
                    }}
                  </span>
                </el-tooltip>
              </template>
              <template v-else> --</template>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="未达5小时备注">
            <template slot-scope="{ row }">
              {{ row.fiveHourTest ? row.fiveHourTest.testRemark : '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-if="extFieldsArr.includes('2')"
          prop="protoshinHalfHourbodyTemperature"
          label="原神半小时表现"
        >
          <!-- <template slot="header">
            <IconTip
              content="xxxxxx"
              label="原神半小时机身温度/帧率"
              icon-class="iconwenhao"
            />
          </template> -->
          <el-table-column
            prop="temperature"
            label="机身最高温度（°C）"
            sortable="custom"
            width="100"
          >
            <template slot-scope="{ row }">
              {{ row.temperature ? row.temperature.temperatureTypeDesc : '--'
              }}{{ row.temperature ? row.temperature.temperature : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="fps"
            label="游戏平均帧率（fps）"
            width="110"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.temperature ? row.temperature.fps : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="usedPower"
            label="游戏整机功耗"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.temperature ? row.temperature.usedPower : '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-if="
            extFieldsArr.includes('3') ||
              extFieldsArr.includes('4') ||
              extFieldsArr.includes('5')
          "
          prop="phoneScreenBrightness"
          label="手机屏幕亮度（nit）"
        >
          <template v-if="extFieldsArr.includes('3')">
            <el-table-column
              prop="manualMaxLight"
              label="手动平均最高亮度"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.manualMaxLight : '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="autoMaxLight"
              label="自动激发最高亮度"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.autoMaxLight : '--' }}
              </template>
            </el-table-column>
          </template>

          <template v-if="extFieldsArr.includes('4')">
            <el-table-column
              prop="innerManualMaxLight"
              label="手动平均最高亮度（内屏）"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.innerManualMaxLight : '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="innerAutoMaxLight"
              label="自动激发最高亮度（内屏）"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.innerAutoMaxLight : '--' }}
              </template>
            </el-table-column>
          </template>

          <template v-if="extFieldsArr.includes('5')">
            <el-table-column
              prop="outManualMaxLight"
              label="手动平均最高亮度（外屏）"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.outManualMaxLight : '--' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="outAutoMaxLight"
              label="自动激发最高亮度（外屏）"
              sortable="custom"
            >
              <template slot-scope="{ row }">
                {{ row.phoneLight ? row.phoneLight.outAutoMaxLight : '--' }}
              </template>
            </el-table-column>
          </template>
        </el-table-column>
        <el-table-column
          v-if="extFieldsArr.includes('6')"
          prop="chargingSpeed"
          label="1%~100%充电速度"
        >
          <el-table-column
            prop="uiFull"
            label="前台UI充满时间"
            sortable="custom"
          >
            <template slot="header">
              <div>前台UI充满时间</div>
              <div>(min)</div>
            </template>
            <template slot-scope="{ row }">
              {{ row.powerRate ? row.powerRate.uiFull : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="backFull"
            label="后台实际充满时间"
            sortable="custom"
          >
            <template slot="header">
              <div>后台实际充满时间</div>
              <div>(min)</div>
            </template>
            <template slot-scope="{ row }">
              {{ row.powerRate ? row.powerRate.backFull : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="topPower"
            label="峰值功率（W）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.powerRate ? row.powerRate.topPower : '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          v-if="extFieldsArr.includes('7')"
          prop="appUsed"
          label="20款APP使用情况"
        >
          <el-table-column
            prop="openTime"
            label="打开速度（s）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.appUsed ? row.appUsed.openTime : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="backNum"
            label="后台保留数量（个）"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              {{ row.appUsed ? row.appUsed.backNum : '--' }}
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="{ row }">
            <div v-if="row.remark.length <= 10">
              {{ row.remark || '--' }}
            </div>
            <div v-else>
              <el-popover trigger="hover" placement="top" width="200">
                <p>{{ row.remark }}</p>
                <div slot="reference">
                  {{ row.remark.slice(0, 10) + '...' || '--' }}
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="handleEditOrDetailModel(row, 'detail')"
            >查看</el-button>
            <el-button
              v-if="$permission('add_new_model')"
              type="text"
              @click="handleEditOrDetailModel(row, 'edit')"
            >编辑</el-button>
            <el-button
              v-if="$permission('delete_new_model')"
              type="text"
              @click="handleEditOrDetailModel(row, 'delete')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total">
        <el-pagination
          background
          layout="slot, prev, pager, next, sizes, jumper"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[20, 50, 100]"
          :current-page.sync="searchData.pageNum"
          @current-change="handleCurPageChange"
          @size-change="handlePageSizeChange"
        >
          <div style="display: inline-block">
            <span
              style="font-size: 16px; font-weight: normal"
            >共{{ total }}条数据</span>
            <span
              style="margin: 0 10px; font-size: 16px; font-weight: normal"
            >共{{ Math.ceil(total / pageSize) }}页</span>
          </div>
        </el-pagination>
      </div>
    </Wrap>
    <PosterDialog
      v-if="showPosterDialog"
      v-model="showPosterDialog"
      :poster-type="posterType"
      :select-rows="selectRows"
      :order-field="orderField"
    />
    <AddModelDialog
      v-if="showAddModelDialog"
      v-model="showAddModelDialog"
      :model-dialog-type="modelDialogType"
      :phone-msg-id="phoneMsgId"
      @getCondition="getCondition"
      @success="getList"
    />
  </div>
</template>
<script>
import { Search } from 'components'
import {
  computed,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { copy } from '@/utils'
// import { $getAccontByOrgIdOrPlatId } from '@/api/military-manage'
import PosterDialog from './_com/PosterDialog.vue'
import AddModelDialog from './_com/AddModelDialog.vue'
import {
  $getBatteryConditionList,
  $getCpuList,
  $getPhoneList,
  $deleteModel
} from '@/api/phoneBase'
import { IconTip } from 'components'
import { useTableSort } from '@/hook'

import qs from 'qs'

export default {
  components: {
    // VTable,
    Search,
    PosterDialog,
    AddModelDialog,
    IconTip
  },
  setup() {
    const { $permission, $nextTick, $message, $confirm } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: $permission('')
    })

    const states = reactive({
      showDialog: false,
      showPosterDialog: false,
      showAddModelDialog: false,
      checkTableRow: [],
      loading: false,
      searchData: {
        phoneType: '',
        phoneName: '',
        cpu: '',
        electricity: '',
        publishTime: '',
        posterType: '',
        pageNum: 1,
        size: 50
      },
      tableData: [],
      selectRows: [],
      total: 0,
      pageSize: 50,
      // extFields: {
      //   severeEnduranceTestForFive: { status: false, chnName: '5小时重度续航测试' },
      //   protoshinHalfHourbodyTemperature: { status: false, chnName: '原神半小时机身温度/帧率' },
      //   phoneScreenBrightnessRank: { status: false, chnName: '手机屏幕亮度排名', tipContent: '仅支持常规手机' },
      //   phoneInnerScreenBrightnessRank: { status: false, chnName: '手机屏幕亮度排名(内屏)', tipContent: '仅支持常规手机' },
      //   phoneOuterScreenBrightnessRank: { status: false, chnName: '手机屏幕亮度排名(外屏)', tipContent: '仅支持折叠屏手机' },
      //   chargingSpeedRank: { status: false, chnName: '充电速度排行' },
      //   applicationTestsForTwenty: { status: false, chnName: '20款应用测试' }
      // },
      showDisableBtnTip: true,
      extFieldsArr: [],
      posterType: '1',
      modelDialogType: 'add',
      phoneMsgId: 0,
      orderField: '',
      disableBtnTipContent: '请选择任意一个测评项'
    })

    states.showDisableBtnTip = computed(() => {
      const extFieldsArrLen = states.extFieldsArr.length
      if (!extFieldsArrLen || extFieldsArrLen > 1) {
        states.disableBtnTipContent = '请选择任意一个测评项'
        return true
      } else {
        if (!states.selectRows.length) {
          states.disableBtnTipContent = '请选择下方的产品型号'
          return true
        }
        return false
      }
    })
    const getList = () => {
      states.loading = true
      const params = formatData(states.searchData)
      params.posterType = states.extFieldsArr
      if (params.publishTime) {
        delete params.publishTime
      }
      if (params.determined) states.orderField = params.determined
      $getPhoneList(params)
        .then((res) => {
          if (res.code === 1) {
            states.tableData = res.data.list
            states.total = res.data.total
          } else {
            $message.error(res.message)
          }
          states.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          if (err.message) {
            $message.error(err.message)
          }
          states.loading = false
        })
    }

    const getRowKey = (row) => {
      return row.id
    }

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'phoneType',
          data: [
            {
              phoneTypelabel: '折叠屏手机',
              phoneType: '2'
            },
            {
              phoneTypelabel: '常规手机',
              phoneType: '1'
            }
          ],
          conf: { placeholder: '手机类型筛选' },
          optionLabelKey: 'phoneTypelabel',
          optionValKey: 'phoneType'
        },
        {
          type: 'input',
          key: 'phoneName',
          data: [],
          conf: {
            placeholder: '请输入机型',
            clearable: true
          },
          optionLabelKey: '',
          optionValKey: ''
        },
        {
          type: 'select',
          key: 'cpu',
          data: [],
          conf: { placeholder: 'SoC筛选' },
          optionLabelKey: 'label',
          optionValKey: 'val'
        },
        {
          type: 'select',
          key: 'electricity',
          data: [],
          conf: { placeholder: '电池容量筛选' },
          optionLabelKey: 'label',
          optionValKey: 'val'
        }
      ]
      normal = normal.filter((item, index) => {
        if (item.permissionName && !$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
      // console.log(normalFormItemMap, 'normalFormItemMap')
    }

    /**
     * 获取查询条件信息
     */
    const getCondition = async() => {
      const { code: code1, data: data1 } = await $getBatteryConditionList()
      const { code: code2, data: data2 } = await $getCpuList()
      if (+code1 === 1) {
        const batteryCapacityList = data1
        normalFormItemMap.electricity.data = batteryCapacityList.map((item) => {
          const obj = {}
          obj.label = item
          obj.val = item
          return obj
        })
      }
      if (+code2 === 1) {
        const cpuTypeList = data2
        normalFormItemMap.cpu.data = cpuTypeList.map((item) => {
          const obj = {}
          obj.label = item
          obj.val = item
          return obj
        })
      }
    }

    const handleSelectChange = (selection) => {
      states.selectRows = selection
    }

    const handleCurPageChange = (val) => {
      states.searchData.pageNum = val
      getList()
    }

    const handlePageSizeChange = (val) => {
      states.searchData.size = val
      getList()
    }

    const formatData = (data) => {
      const params = copy(data)
      if (params.publishTime) {
        params.publishTimeStart = params.publishTime[0] + ' 00:00:00'
        params.publishTimeEnd = params.publishTime[1] + ' 23:59:59'
      } else {
        params.publishTimeStart = ''
        params.publishTimeEnd = ''
      }
      return params
    }

    const onChange = (val, item, type, index, model) => {}

    const onSubmit = (data) => {
      const params = formatData(data)
      Object.assign(states.searchData, params)
      if (states.searchData.phoneType === '1') {
        states.extFieldsArr = states.extFieldsArr.filter((item) => {
          return item !== '4' && item !== '5'
        })
      } else if (states.searchData.phoneType === '2') {
        states.extFieldsArr = states.extFieldsArr.filter((item) => {
          return item !== '3'
        })
      }
      getList()
    }

    const onExport = (data) => {
      const params = formatData(Object.assign({}, states.searchData, data))
      params.isExport = 1
      window.open(
        `/api/phone/list?${qs.stringify({
          ...params
        })}`
      )
    }

    const handleShow = () => {
      states.showDialog = true
    }
    const handleCreatePoster = () => {
      states.posterType = states.extFieldsArr[0]
      states.showPosterDialog = true
    }
    const handleAddModel = (type) => {
      states.showAddModelDialog = true
      states.modelDialogType = type
    }

    const handleEditOrDetailModel = (row, type) => {
      if (type !== 'delete') {
        states.showAddModelDialog = true
        states.modelDialogType = type
        states.phoneMsgId = row.phoneId
      } else {
        $confirm('确认是否删除此手机机型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(async() => {
            $deleteModel({ phoneId: row.phoneId }).then(res => {
              if (res.code === 1) {
                $message.success(res.message)
                getList()
              } else {
                $message.error(res.message)
              }
           })
        })
      }
    }

    const { doSort } = useTableSort(states.searchData, getList)

    buildFormConf()
    getCondition()

    $nextTick(() => {
      getList()
    })

    return {
      formConf,
      onSubmit,
      onChange,
      ...toRefs(states),
      handleShow,
      onExport,
      handleCreatePoster,
      handleAddModel,
      handleEditOrDetailModel,
      handleSelectChange,
      getList,
      getRowKey,
      doSort,
      getCondition,
      handleCurPageChange,
      handlePageSizeChange
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .checkbox-wrap {
    .el-checkbox {
      flex: 1;
      margin-top: 6px;
    }
  }

  .btn-wrap {
    display: flex;
    justify-content: center;
    align-items: center;

    .el-button {
      margin: 0 4px;
    }

    .disabledBtn {
      position: relative;
      cursor: not-allowed;
      color: rgba(0, 0, 0, 0.3);
      background: #fff;

      &:hover {
        color: rgba(0, 0, 0, 0.3);
        background: #fff;
      }

      &:focus {
        outline: none;
        border-color: rgba(0, 0, 0, 0.3);
      }
    }
  }

  .el-pagination {
    .el-pagination__sizes {
      .el-input__inner {
        height: 32px;
      }
    }
  }
}
</style>
