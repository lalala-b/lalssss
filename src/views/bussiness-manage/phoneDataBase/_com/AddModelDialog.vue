<template>
  <el-dialog
    :title="
      modelDialogType === 'add'
        ? '新增机型'
        : `${modelDialogType === 'edit' ? '编辑机型' : '查看机型'}`
    "
    :visible.sync="show"
    width="1200px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-form
      ref="form"
      label-width="140"
      :rules="formRules"
      :model="addForm"
      :inline="true"
    >
      <p class="titleBox"><span class="title">基础参数</span></p>
      <div class="base">
        <el-row>
          <el-col :span="5">
            <el-form-item prop="phoneType" class="phone-type" label="手机类型">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.phoneType === 1 ? '常规手机' : '折叠屏手机'
              }}</span>
              <el-select
                v-else
                v-model="addForm.phoneType"
                style="width: 116px"
                placeholder="请选择"
                clearable
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.val"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="机型" prop="phoneName">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.phoneName || '--'
              }}</span>
              <template v-else>
                <el-input v-model="addForm.phoneName" placeholder="" />
                <p class="item-tip">如：iPhone14 Pro Max</p>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              class="date-picker"
              label="发布日期"
              prop="publishTime"
            >
              <span v-if="modelDialogType === 'detail'">{{
                addForm.publishTime || '--'
              }}</span>
              <el-date-picker
                v-else
                v-model="addForm.publishTime"
                type="date"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item class="item-save" label="存储" prop="storage">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.storage || '--'
              }}</span>
              <template v-else>
                <el-input v-model="addForm.storage" placeholder="" />
                <p class="item-tip">如：6+128G（需要带单位G、T）</p>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="SoC" prop="cpu">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.cpu || '--'
              }}</span>
              <template v-else>
                <el-input v-model="addForm.cpu" placeholder="" />
                <p class="item-tip">如：高通骁龙888</p>
              </template>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="系统版本" prop="systemVersion">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.systemVersion || '--'
              }}</span>
              <el-input v-else v-model="addForm.systemVersion" placeholder="" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性能模式" prop="performanceMode">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.performanceMode || '--'
              }}</span>
              <el-input
                v-else
                v-model="addForm.performanceMode"
                placeholder=""
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="电池容量" prop="electricity">
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.electricity || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.electricity"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit" style="width: 60px">mA·h</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="充电功率" prop="power">
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.power || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.power"
                  placeholder=""
                  :min="0"
                  :precision="2"
                  :controls="false"
                />
                <span class="item-unit">W</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="手机封面图">
              <UploadImg
                v-if="modelDialogType !== 'detail'||addForm.phoneMainPic&&addForm.phoneMainPic.length"
                v-model="addForm.phoneMainPic"
                :limit="1"
                :upload-url="'/api/phone/upload'"
                size="small"
                :disabled="modelDialogType === 'detail'"
                :prew-photo="true"
              />
              <span v-else>--</span>
            </el-form-item>
            <div v-if="modelDialogType !== 'detail'" style="margin-top: -6px" class="item-tip">
              图片大小3M以内，jpg、jpeg、png
            </div>
          </el-col>
        </el-row>
      </div>
      <p class="titleBox m-t-16">
        <span class="title">5小时重度续航测试</span>
      </p>
      <div class="electricity-test">
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >B站视频5G（60min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.bilibili || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.bilibili"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >微博5G（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.weibo || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.weibo"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >原神WiFi（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.genshinImpact || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.genshinImpact"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >录像5G（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.recordScreen || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.recordScreen"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >王者荣耀5G（60min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.honorKings || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.honorKings"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >抖音WiFi（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.douyin || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.douyin"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >淘宝WiFi（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.taobao || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.taobao"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
              <span
                slot="label"
              >和平精英WiFi（30min）<span
                class="item-subtext"
              >消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.battlefield || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.battlefield"
                  placeholder=""
                  :min="0"
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="">
              <span
                slot="label"
              >剩余电量<span class="item-subtext">消耗电量百分比</span></span>
              <div class="flex">
                <span v-if="modelDialogType === 'detail'">{{
                  addForm.remain || '--'
                }}</span>
                <el-input-number
                  v-else
                  v-model="addForm.remain"
                  placeholder=""
                  :precision="0"
                  :controls="false"
                />
                <span class="item-unit">%</span>
                <IconTip
                  v-if="modelDialogType !== 'detail'"
                  content=" 支持任意整数。负数不直接显示（仅用于排序）"
                  icon-class="iconwenhao"
                />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item class="item-mark" label="未达5小时备注">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.testRemark || '--'
              }}</span>
              <el-input
                v-else
                v-model="addForm.testRemark"
                type="textarea"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <p
              v-if="modelDialogType !== 'detail'"
              style="margin-left: 100px; margin-top: -20px"
              class="item-tip"
            >
              不超过20个字，如：4小时15分钟后剩余4%时提示关机
            </p>
          </el-col>
        </el-row>
      </div>
      <p class="titleBox m-t-16">
        <span class="title">原神半小时表现</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="游戏最高温度">
            <div class="flex game-t">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.temperatureTypeDesc || '--'
              }}</span>
              <el-select
                v-else
                v-model="addForm.temperatureType"
                placeholder="位置"
                clearable
              >
                <el-option
                  v-for="item in placeList"
                  :key="item.val"
                  :label="item.label"
                  :value="item.val"
                />
              </el-select>
              <span v-if="modelDialogType === 'detail'">{{
                addForm.temperature
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.temperature"
                placeholder=""
                :min="0"
                :precision="2"
                :controls="false"
              />
              <span class="item-unit">°C</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="游戏整机功耗">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.usedPower || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.usedPower"
                placeholder=""
                :min="0"
                :precision="2"
                :controls="false"
              />
              <span class="item-unit">W</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="游戏平均帧率">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.fps || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.fps"
                placeholder=""
                :min="0"
                :precision="2"
                :controls="false"
              />
              <span class="item-unit">fps</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="最高温度图">
            <UploadImg
              v-if="modelDialogType !== 'detail'||addForm.temperaturePic&&addForm.temperaturePic.length"
              v-model="addForm.temperaturePic"
              :limit="1"
              :upload-url="'/api/phone/upload'"
              size="small"
              :disabled="modelDialogType === 'detail'"
              :prew-photo="true"
            />
            <span v-else>--</span>
          </el-form-item>
          <p
            v-if="modelDialogType !== 'detail'"
            style="margin-top: -20px; margin-bottom: 10px"
            class="item-tip"
          >
            图片大小3M以内，jpg、jpeg、png
          </p>
        </el-col>
        <el-col :span="8">
          <el-form-item label="功耗图">
            <UploadImg v-if="modelDialogType !== 'detail'||addForm.usedPowerPic&&addForm.usedPowerPic.length" v-model="addForm.usedPowerPic" :upload-url="'/api/phone/upload'" :limit="1" size="small" :disabled="modelDialogType === 'detail'" :prew-photo="true" />
            <span v-else>--</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平均帧率图">
            <UploadImg v-if="modelDialogType !== 'detail'||addForm.fpsPic&&addForm.fpsPic.length" v-model="addForm.fpsPic" :upload-url="'/api/phone/upload'" :limit="1" size="small" :disabled="modelDialogType === 'detail'" :prew-photo="true" />
            <span v-else>--</span>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox">
        <span class="title">手机屏幕亮度（仅常规手机）</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手动最高平均亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.manualMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.manualMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自动激发最高亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.autoMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.autoMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox">
        <span class="title">手机屏幕亮度（内屏）（仅折叠屏手机）</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手动最高平均亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.innerManualMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.innerManualMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自动激发最高亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.innerAutoMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.innerAutoMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox">
        <span class="title">手机屏幕亮度（外屏）（仅折叠屏手机）</span>
      </p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="手动最高平均亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.outManualMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.outManualMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="自动激发最高亮度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.outAutoMaxLight || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.outAutoMaxLight"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">nit</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox"><span class="title">1%~100%充电速度）</span></p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="前台UI充满时间">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.uiFull || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.uiFull"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">min</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="后台实际充满时间">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.backFull || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.backFull"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">min</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="峰值功率">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.topPower || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.topPower"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">W</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox"><span class="title">20款APP使用情况</span></p>
      <el-row>
        <el-col :span="8">
          <el-form-item label="打开速度">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.openTime || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.openTime"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">S</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="后台保留数量">
            <div class="flex">
              <span v-if="modelDialogType === 'detail'">{{
                addForm.backNum || '--'
              }}</span>
              <el-input-number
                v-else
                v-model="addForm.backNum"
                placeholder=""
                :min="0"
                :precision="0"
                :controls="false"
              />
              <span class="item-unit">个</span>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <p class="titleBox"><span class="title">其他</span></p>
      <el-form-item label="备注">
        <span v-if="modelDialogType === 'detail'">{{
          addForm.remark || '--'
        }}</span>
        <el-input
          v-else
          v-model="addForm.remark"
          type="textarea"
          rows="3"
          maxlength="100"
          show-word-limit
          placeholder=""
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="save"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { AccountCard, IconTip, UploadImg } from 'components'
import { useToggle } from '@/hook'
import { copy } from '@/utils'
import { $getAddModel, $getPhoneDetail } from '@/api/phoneBase.js'

export default defineComponent({
  props: {
    value: Boolean,
    modelDialogType: {
      type: String,
      default: 'add'
    },
    phoneMsgId: {
      type: Number,
      default: 0
    }
  },
  components: {
    AccountCard,
    IconTip,
    UploadImg
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const states = reactive({
      btnLoading: false,
      addForm: {
        phoneType: '',
        phoneName: '',
        cpu: '',
        storage: '',
        systemVersion: '',
        performanceMode: '',
        electricity: undefined,
        power: undefined,
        remark: '',
        bilibili: undefined,
        weibo: undefined,
        genshinImpact: undefined,
        recordScreen: undefined,
        honorKings: undefined,
        douyin: undefined,
        taobao: undefined,
        battlefield: undefined,
        remain: undefined,
        testRemark: '',
        temperature: undefined,
        temperatureType: undefined,
        usedPower: undefined,
        fps: undefined,
        manualMaxLight: undefined,
        autoMaxLight: undefined,
        innerManualMaxLight: undefined,
        innerAutoMaxLight: undefined,
        outManualMaxLight: undefined,
        outAutoMaxLight: undefined,
        uiFull: undefined,
        backFull: undefined,
        topPower: undefined,
        openTime: undefined,
        backNum: undefined,
        publishTime: '',
        phoneMainPic: [],
        temperaturePic: [],
        usedPowerPic: [],
        fpsPic: []
      },
      typeList: [
        { id: 1, val: '常规手机' },
        { id: 2, val: '折叠屏手机' }
      ],
      placeList: [
        { val: 1, label: '正面' },
        { val: 2, label: '背面' },
        { val: 3, label: '顶部' },
        { val: 4, label: '底部' },
        { val: 5, label: '左侧' },
        { val: 6, label: '右侧' }
      ],
      formRules: {
        publishTime: [
          { required: true, message: '请选择发布时间', trigger: 'change' }
        ],
        phoneType: [
          { required: true, message: '请输入手机类型', trigger: 'change' }
        ],
        phoneName: [
          { required: true, message: '请输入手机型号', trigger: 'blur' }
        ],
        cpu: [{ required: true, message: '请输入SoC', trigger: 'blur' }],
        storage: [{ required: true, message: '请输入存储', trigger: 'blur' }],
        systemVersion: [
          { required: true, message: '请输入系统版本', trigger: 'blur' }
        ],
        performanceMode: [
          { required: true, message: '请输入性能模式', trigger: 'blur' }
        ],
        electricity: [
          { required: true, message: '请输入电池容量', trigger: 'blur' }
        ],
        power: [{ required: true, message: '请输入充电功率', trigger: 'blur' }]
      }
    })
    const formatData = (data) => {
      const dataList = copy(data)
      for (const k in dataList) {
        dataList[k] =
          dataList[k] === undefined || dataList[k] === null ? '' : dataList[k]

        if (k === 'phoneType' || k === 'temperatureType') {
          dataList[k] = Number(dataList[k])
        } else {
          dataList[k] = dataList[k].toString()
        }
      }
      return dataList
    }
    const save = async function() {
      try {
        await $refs.form.validate()
        states.btnLoading = true
        const params = formatData(states.addForm)
        console.info(states.addForm)
        if (props.modelDialogType === 'edit') {
          params.phoneId = props.phoneMsgId
        }
        const res = await $getAddModel(params)
        if (+res.code === 1) {
          emit('success')
          emit('getCondition')
          handleClose()
          $message.success('操作成功')
        } else {
          $message.error(res.message)
        }
        states.btnLoading = false
      } catch (err) {
        $message.error(err)
        states.btnLoading = false
      }
    }
    // 限制只能输入两位小数

    const limitInput = (value, name) => {
      states.addForm[name] =
        ('' + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, '')
          .replace(/^0+(\d)/, '$1')
          .replace(/^\./, '0.')
          .match(/^\d*(\.?\d{0,2})/g)[0] || '' // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，	而且小数点后面只能有0到2位小数
    }
    const handleLimitInput = (val, name) => {
      let val1 = val
      if (val && val.includes('.')) {
        if (val.split('.')[1].length === 0) {
          val1 = val.split('.')[0]
        }
      }
      console.log(val1)
      states.addForm[name] = val1
    }

    // 编辑/查看时回显数据
    const handleShowPhoneMsg = async(phoneId) => {
      const { code, data } = await $getPhoneDetail({
        phoneId
      })
      if (+code === 1) {
        const phoneMsg = data
        let key1 = ''
        for (const key in states.addForm) {
          if (
            [
              'bilibili',
              'douyin',
              'genshinImpact',
              'honorKings',
              'recordScreen',
              'remain',
              'taobao',
              'weibo',
              'testRemark',
              'battlefield'
            ].includes(key)
          ) {
            key1 = 'fiveHourTest'
          } else if (
            [
              'autoMaxLight',
              'innerAutoMaxLight',
              'innerManualMaxLight',
              'manualMaxLight',
              'outAutoMaxLight',
              'outManualMaxLight'
            ].includes(key)
          ) {
            key1 = 'phoneLight'
          } else if (
            ['fps', 'temperature', 'temperatureType', 'usedPower', 'fpsPic', 'temperaturePic', 'usedPowerPic'].includes(key)
          ) {
            key1 = 'temperature'
          } else if (['uiFull', 'backFull', 'topPower'].includes(key)) {
            key1 = 'powerRate'
          } else if (['openTime', 'backNum'].includes(key)) {
            key1 = 'appUsed'
          }
          if (key1) {
            states.addForm[key] = phoneMsg[key1][key]
            //  (['phoneMainPic', 'fpsPic', 'usedPowerPic', 'temperaturePic'].includes(key))
            if (key1 === 'temperature') {
              states.addForm['temperatureTypeDesc'] =
                phoneMsg[key1]['temperatureTypeDesc']
              states.addForm['fpsPic'] = phoneMsg[key1]['fpsPic'] ? [phoneMsg[key1]['fpsPic']] : []
              states.addForm['temperaturePic'] = phoneMsg[key1]['temperaturePic'] ? [phoneMsg[key1]['temperaturePic']] : []
              states.addForm['usedPowerPic'] = phoneMsg[key1]['usedPowerPic'] ? [phoneMsg[key1]['usedPowerPic']] : []
            }
            if (key1 === 'phoneLight') {
              states.addForm['autoMaxLight'] =
                phoneMsg[key1]['autoMaxLight'] || undefined
              states.addForm['innerAutoMaxLight'] =
                phoneMsg[key1]['innerAutoMaxLight'] || undefined
              states.addForm['innerManualMaxLight'] =
                phoneMsg[key1]['innerManualMaxLight'] || undefined
              states.addForm['manualMaxLight'] =
                phoneMsg[key1]['manualMaxLight'] || undefined
              states.addForm['outAutoMaxLight'] =
                phoneMsg[key1]['outAutoMaxLight'] || undefined
              states.addForm['outManualMaxLight'] =
                phoneMsg[key1]['outManualMaxLight'] || undefined
            }
            key1 = ''
          } else {
            if (key === 'phoneMainPic') {
              states.addForm[key] = phoneMsg[key] ? [phoneMsg[key]] : []
            } else {
              states.addForm[key] = phoneMsg[key]
            }
          }
        }
      }
    }

    if (
      props.modelDialogType === 'edit' ||
      props.modelDialogType === 'detail'
    ) {
      handleShowPhoneMsg(props.phoneMsgId)
    }

    return {
      ...toRefs(states),
      show,
      handleClose,
      save,
      limitInput,
      handleLimitInput,
      handleShowPhoneMsg
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item__content {
    width: 150px;
  }
  .phone-type {
    .el-form-item__content {
      width: 130px;
    }
  }
  .base {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
  .date-picker {
    .el-form-item__content {
      width: 240px;
    }
    .el-range-editor.el-input-number__inner {
      width: 240px;
    }
  }
  .titleBox {
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 18px;
  }
  .titleBox {
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 18px;
  }
  .title {
    font-size: 18px;
    position: relative;
    padding-left: 18px;

    &::after {
      content: '';
      width: 10px;
      height: 24px;
      font-size: 0;
      background: #2c64ff;
      display: block;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .el-textarea {
    width: 540px;
  }
  .item-mark {
    .el-textarea {
      width: 200px;
    }
  }
  .item-tip {
    color: #7f7f7f;
    font-size: 13px;
    letter-spacing: -1px;
  }
  .electricity-test {
    .el-form-item__label {
      font-weight: 600;
    }
  }
  .item-save {
    .item-tip {
      display: block;
      width: 200px;
    }
  }
  .item-subtext {
    display: block;
    font-size: 12px;
    font-weight: 400;
    margin-top: -10px;
  }
  .item-unit {
    display: block;
    width: 38px;
    margin-left: 2px;
  }
  .game-t {
    width: 200px;
    .el-select {
      width: 100px;
      margin-right: 4px;
      .el-input-number--suffix {
        width: 75px;
      }
    }
    .el-input-number {
      width: 106px;
    }
    .item-unit {
      display: block;
      width: 34px;
    }
  }
  .el-form-item__content {
    position: relative;
    .el-form-item__error {
      position: absolute;
      top: 7px;
      left: 28px;
    }
  }
}
</style>
