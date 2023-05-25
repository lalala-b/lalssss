<template>
  <div>
    <el-dialog
      v-if="popStatus"
      :title="title"
      :visible="popStatus"
      width="800px"
      :before-close="onCancel"
    >
      <div v-if="types==1" class="M-advertisingLaunchOrderInfo">
        <el-form
          label-width="140px"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="平台">{{ form.platName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号">{{ form.accountName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="预计发布时间"
                prop="preReleaseVideoTime"
              >
                {{ form.preReleaseVideoTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="平台消耗金额"
                prop="consumeAmount"
              >
                {{ form.consumeAmount }}
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="平台消耗金额（星图、快接单等平台实际消耗金额，包含手续费）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="预计发布时间"
                prop="preReleaseVideoTime"
              >
                {{ form.preReleaseVideoTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="手续费"
                prop="handlingCharge"
              >
                {{ form.handlingCharge }}
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="返款金额"
                prop="rebateAmount"
              >
                {{ form.rebateAmount }}
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="返款金额（达人返款金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="返款时间"
                prop="rebateTime"
              >
                {{ form.rebateTime }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="补款金额"
                prop="addAmount"
              >
                {{ form.addAmount }}
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="补款金额（给达人线下补款金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="补款时间"
                prop="addAmountTime"
              >
                {{ form.addAmountTime }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="dou+成本"
                prop="douMoney"
              >
                {{ form.douMoney }}
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="dou+成本（给达人充dou+金额，非达人自行充dou+金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="其他成本"
                prop="otherMoney"
              >
                {{ form.otherMoney }}
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="其他成本（如微纳税补款6.8%手续费等其他消耗金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="投放价格"
                prop="deliveryMoney"
              >
                {{ form.deliveryMoney || form.consumeAmount - form.rebateAmount + form.rebateAmount || '--' }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="下单时间"
                prop="orderTime"
              >
                {{ form.orderTime }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="视频上传:"
              >
                <el-link type="primary" target="_blank" :href="form.uploadUrl">{{ form.uploadUrl }}</el-link>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频：">
                <el-link type="primary" target="_blank" :href="form.url">{{ form.titleName }}</el-link>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="流量"
              >
                {{ form.flowCount }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="品牌标签"
                prop="videoTag"
              >
                {{ form.videoTag }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="业务标签"
                prop="businessTag"
              >
                {{ form.businessTag }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="口令"
                prop="orderCommand"
              >
                {{ form.orderCommand }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="内容类别"
                prop="contentType"
              >
                {{ form.contentType }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="星图验收时间"
                prop="completeTime"
              >
                {{ form.completeTime }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="星图账户"
                prop="xtAccountId"
              >
                {{ XT_ACCOUNT_ID[form.xtAccountId - 1] && XT_ACCOUNT_ID[form.xtAccountId - 1].text }}
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="是否收到星图发票"
                prop="hasInvoice"
              >
                {{ HAS_INVOICE[form.hasInvoice] && HAS_INVOICE[form.hasInvoice].text }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="发票号"
                prop="invoiceNumber"
              >
                {{ form.invoiceNumber }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="OA充值申请编号"
                prop="rechargeNumber"
              >
                {{ form.rechargeNumber }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="是否充值完成"
                prop="isRecharge"
              >
                {{ IS_RECHARGE[form.isRecharge] && IS_RECHARGE[form.isRecharge].text }}
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="组件点击量"
                prop="cptClick"
              >
                {{ form.cptClick }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="Link组件渠道号"
                prop="androidDeliveryName"
              >
                {{ form.androidDeliveryName }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item
                :clearable="true"
                label="备注"
              >
                {{ form.note }}
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align:center">
          <el-button size="small" type="primary" :loading="addLoading" @click="onCancel">确定</el-button>
          <el-button size="small" @click="onCancel">取消</el-button>
        </div>
      </div>
      <div v-else class="M-advertisingLaunchOrderInfo">
        <el-form
          ref="form"
          :model="form"
          label-width="140px"
          :rules="orderRules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="平台">{{ form.platName }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号">{{ form.accountName }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="预计发布时间"
                prop="preReleaseVideoTime"
              >
                <el-date-picker
                  v-model="form.preReleaseVideoTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="平台消耗金额"
                prop="consumeAmount"
              >
                <el-input-number
                  v-model="form.consumeAmount"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="平台消耗金额（星图、快接单等平台实际消耗金额，包含手续费）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
                <!-- <el-input
                  v-model="form.consumeAmount"
                  show-word-limit
                  type="Number"
                  @input.native="limitLen($event, 'consumeAmount')"
                /> -->
              </el-form-item>
            </el-col>

            <!-- <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="预计发布时间"
                prop="preReleaseVideoTime"
              >
                <el-date-picker
                  v-model="form.preReleaseVideoTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd 00:00:00"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="手续费"
                prop="handlingCharge"
              >
                <el-input-number
                  v-model="form.handlingCharge"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="返款金额"
                prop="rebateAmount"
              >
                <el-input-number
                  v-model="form.rebateAmount"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="返款金额（达人返款金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
                <!-- <el-input
                  v-model="form.rebateAmount"
                  type="Number"
                  @input.native="limitLen($event, 'rebateAmount')"
                /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="返款时间"
                prop="rebateTime"
              >
                <el-date-picker
                  v-model="form.rebateTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd 00:00:00"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="补款金额"
                prop="addAmount"
              >
                <el-input-number
                  v-model="form.addAmount"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="补款金额（给达人线下补款金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
                <!-- <el-input v-model="form.addAmount" type="Number" @input.native="limitLen($event, 'addAmount')" /> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="补款时间"
                prop="addAmountTime"
              >
                <el-date-picker
                  v-model="form.addAmountTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd 00:00:00"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="dou+成本"
                prop="douMoney"
              >
                <el-input-number
                  v-model="form.douMoney"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="dou+成本（给达人充dou+金额，非达人自行充dou+金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="其他成本"
                prop="otherMoney"
              >
                <el-input-number
                  v-model="form.otherMoney"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :controls="false"
                />
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="其他成本（如微纳税补款6.8%手续费等其他消耗金额）"
                >
                  <i slot="reference" class="el-icon-question" />
                </el-popover>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="投放价格"
                prop="deliveryMoney"
              >
                {{ deliveryMoney }}
                <div v-if="deliveryMoney && deliveryMoney < 0" class="el-form-item__error">投放价格应大于0</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="下单时间"
                prop="orderTime"
              >
                <el-date-picker
                  v-model="form.orderTime"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="视频上传:"
              >
                <el-upload
                  ref="uploadVideo"
                  v-loading="uploading"
                  drag
                  accept=".mp4"
                  :with-credentials="true"
                  :data="qData"
                  :action="uploadVideoUrl"
                  :on-error="onImportError"
                  :on-success="onImportSuccess"
                  :before-upload="onImportReady"
                  :disabled="disabled"
                  :show-file-list="false"
                  name="file"
                  element-loading-text="正在上传视频..."
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.6)"
                  class="upload-video"
                >
                  <div v-if="form.uploadUrl" class="upload-wrap el-upload-list--picture-card">
                    <img
                      class="pic"
                      src="@/assets/video.png"
                    >
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click.stop.prevent="openUrl(form.uploadUrl)"
                      >
                        <i class="el-icon-zoom-in" />
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click.stop.prevent="delectVideo"
                      >
                        <i class="el-icon-delete" />
                      </span>
                    </span>
                  </div>
                  <div v-else>
                    <i class="el-icon-upload" />
                    <div class="el-upload__text">
                      将视频文件拖到此处，或点击上传
                      <em>点击上传</em>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="图片上传:">
                <el-upload
                  ref="uploadImg"
                  drag
                  accept="*"
                  :limit="1"
                  :on-success="uploadPhotoSuccess"
                  :show-file-list="false"
                  :action="photoUploadUrl"
                  name="file"
                  class="upload-video"
                >
                  <div v-if="form.imgUrl" class="upload-wrap el-upload-list--picture-card">
                    <img
                      class="pic"
                      :src="form.imgUrl"
                    >
                    <span class="el-upload-list__item-actions">
                      <span
                        class="el-upload-list__item-preview"
                        @click.stop.prevent="openUrl(form.imgUrl)"
                      >
                        <i class="el-icon-zoom-in" />
                      </span>
                      <span
                        class="el-upload-list__item-delete"
                        @click.stop.prevent="delectImg"
                      >
                        <i class="el-icon-delete" />
                      </span>
                    </span>
                  </div>
                  <div v-else>
                    <i class="el-icon-upload" />
                    <div class="el-upload__text">
                      将图片文件拖到此处，或点击上传
                      <em>点击上传</em>
                    </div>
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="视频：">
                <el-button type="primary" size="mini" @click="addVideo">选择视频</el-button>
                <p v-if="form.flowId">
                  <el-link
                    :type="(form.isDeleted || form.url === '') ? 'info' : 'primary'"
                    target="_blank"
                    :href="form.url"
                  >{{ form.isDeleted ? '(已删除)' : '' }}{{ form.titleName }}</el-link>
                  <el-button type="danger" size="mini" @click="onDelVideo">删除</el-button>
                </p>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="流量"
              >
                <el-input v-model="form.flowCount" onkeyup="value=value.replace(/[^\d]/g, '')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="品牌标签"
                prop="videoTag"
              >
                <el-select v-model="form.videoTag" @change="handleVideoTagChange">
                  <el-option
                    v-for="(item, index) in videoTags"
                    :key="`VT_${item.text}_${index}`"
                    :value="item.val"
                    :label="item.text"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="业务标签"
                prop="businessTag"
              >
                <el-select v-model="form.businessTag">
                  <el-option v-for="tags in businessTags" :key="tags.dictLabel" :value="tags.dictValue" :label="tags.dictLabel" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="口令"
                prop="orderCommand"
              >
                <el-input
                  v-model="form.orderCommand"
                  type="text"
                  placeholder="多个口令请用英文逗号“,”分隔"
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="内容类别"
                prop="contentType"
              >
                <el-select v-model="form.contentType">
                  <el-option v-for="(content) in contentTypes" :key="content" :value="content" :label="content" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="星图验收时间"
                prop="completeTime"
              >
                <el-date-picker
                  v-model="form.completeTime"
                  type="date"
                  placeholder="选择日期"
                  format="yyyy 年 MM 月 dd 日"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="星图账户"
                prop="xtAccountId"
              >
                <el-select v-model="form.xtAccountId">
                  <el-option v-for="(item, index) in XT_ACCOUNT_ID" :key="`XT_${item.text}_${index}`" :value="item.val" :label="item.text" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="是否收到星图发票"
                prop="hasInvoice"
              >
                <el-select v-model="form.hasInvoice">
                  <el-option v-for="(item,index) in HAS_INVOICE" :key="`XT_${item.text}_${index}`" :value="item.val" :label="item.text" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="发票号"
                prop="invoiceNumber"
              >
                <el-input v-model="form.invoiceNumber" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="OA充值申请编号"
                prop="rechargeNumber"
              >
                <el-input v-model="form.rechargeNumber" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="是否充值完成"
                prop="isRecharge"
              >
                <el-select v-model="form.isRecharge">
                  <el-option v-for="(item, index) in IS_RECHARGE" :key="`XT_${item.text}_${index}`" :value="item.val" :label="item.text" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row> -->
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="组件点击量"
                prop="cptClick"
              >
                <el-input v-model="form.cptClick" onkeyup="value=value.replace(/[^\d]/g, '')" />
              </el-form-item>
            </el-col>
            <el-col v-if="$permission('has_link_edit')" :span="12">
              <el-form-item
                :clearable="true"
                label="Link组件渠道号"
              >
                <el-input v-model.trim="form.androidDeliveryName" :disabled="hasDeliveryName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="邮寄信息"
              >
                <el-button type="primary" @click="hasMailDialog = true">填写邮寄信息</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                :clearable="true"
                label="备注"
              >
                <el-input v-model="form.note" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" style="text-align:center">
          <el-button size="small" type="primary" :loading="addLoading" @click="onConfirm">确定</el-button>
          <el-button size="small" @click="onCancel">取消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 视频列表 -->
    <VideoList v-if="addVideoShow" v-model="addVideoShow" :account-id="form.accountId" :plat-id="form.platId" :flow-id="form.flowId" @confirm="handleChangeVideo" />
    <!-- 邮寄信息弹窗 -->
    <MailDialog v-if="hasMailDialog" v-model="hasMailDialog" :status="types === 0 ? 'add' : 'edit'" :order-id="form.orderId" :account-id="form.accountId" :data="form.addressName ? form : null" style="z-index: 2100" @save="addMailInfo" />
  </div>
</template>
<script>
import { copy } from '@/components/common'
import { $getDataByDictType } from '@/api'
import { $putOrderPuttingAdd, $putOrderPutting, $getContentType, $getLinkStatus } from '@/api/bussiness-manage'
import './index.scss'
import VideoList from '../viedeoList'
import MailDialog from '../../putting-account/_component/MailDialog'
import { isString } from '@/utils'

/*
accountId	    Y	int	    账号id
consumeAmount	Y	int	    平台消耗金额
handlingCharge	N	int	    手续费
rebateAmount	N	int	    返点金额
rebateTime	    N	string	返点时间	2020-08-10 00:00:00
addAmount	    N	int	    补款金额
addAmountTime N	string	补款时间	2020-08-10 00:00:00
deliveryMoney	N	int	    投放价格
orderTime	    N	string	下单时间	2020-08-10 00:00:00
uploadUrl	    N	string	上传的视频地址
flowId	        N	int	    视频id
flowCount	    N	int	    视频流量
videoTag	    N	int	    品牌标签
cptClick	    N	int	    组件点击量
completeTime	N	string	星图验收时间	2020-08-10 00:00:00
xtAccountId	N	int	    星图账号id，1=向乾、2=乾派、3=快接单、4=线下
hasInvoice	    N	int	    是否收到星图发票 0=否，1=是
invoiceNumber	N	string	星图发票编号
rechargeNumber	N	string  OA充值编号，isRecharge=1时必填
isRecharge	    N	int	    是否充值完成 0=否，1=是
remark
 */

const MODEL = {
  orderId: '',
  accountId: '',
  consumeAmount: '',
  handlingCharge: '',
  rebateAmount: '',
  rebateTime: '',
  addAmount: '',
  addAmountTime: '',
  deliveryMoney: '',
  orderTime: '',
  uploadUrl: '',
  imgUrl: '',
  flowId: '',
  url: '',
  titleName: '',
  flowCount: '',
  videoTag: '',
  contentType: '',
  cptClick: '',
  completeTime: '',
  xtAccountId: '',
  hasInvoice: 0,
  invoiceNumber: '',
  rechargeNumber: '',
  isRecharge: 0,
  remark: '',
  platName: '',
  accountName: '',
  platId: '',
  note: '',
  androidDeliveryName: '',
  douMoney: '',
  otherMoney: '',
  preReleaseVideoTime: '',
  businessTag: '',
  orderCommand: ''
}

const XT_ACCOUNT_ID = [
  {
    val: 1,
    text: '向乾'
  },
  {
    val: 2,
    text: '乾派'
  },
  {
    val: 3,
    text: '快接单'
  },
  {
    val: 4,
    text: '线下'
  },
  {
    val: 5,
    text: '北京'
  }
]

const HAS_INVOICE = [
  {
    val: 0,
    text: '否'
  },
  {
    val: 1,
    text: '是'
  }
]

const IS_RECHARGE = [
  {
    val: 0,
    text: '否'
  },
  {
    val: 1,
    text: '是'
  }
]

export default {
  components: { MailDialog, VideoList },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default() {
        return null
      }
    },
    // types = 1 订单编辑， 0 = 新增下单
    types: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      hasDeliveryName: false,
      photoUploadUrl: `/api/admin/uploadImage`,
      addLoading: false,
      hasMailDialog: false,
      XT_ACCOUNT_ID,
      HAS_INVOICE,
      IS_RECHARGE,
      videoTags: [
        {
          val: '转转',
          text: '转转'
        },
        {
          val: '找靓机',
          text: '找靓机'
        }
      ],
      businessTags: [],
      imgUploading: false,
      uploading: false,
      disabled: false,
      form: copy(MODEL),
      qData: {},
      videoTableData: [],
      total: 0,
      selectedVideo: {},
      addVisible: false,
      addVideoShow: false,
      videoDateArr: [],
      contentTypes: [],
      orderRules: {
        consumeAmount: [{ required: true, message: '请输入平台消耗金额', trigger: 'blur' }],
        orderTime: [{ required: true, message: '请选择下单时间', trigger: 'blur' }],
        preReleaseVideoTime: [{ required: true, message: '请选择预计发布时间', trigger: 'blur' }],
        videoTag: [{ required: true, message: '请选择品牌标签', trigger: 'change' }],
        businessTag: [{ required: true, message: '请选择业务标签', trigger: 'change' }],
        contentType: [{ required: true, message: '请选择内容类别', trigger: 'change' }],
        xtAccountId: [{ required: true, message: '请选择星图账户', trigger: 'change' }]
        // hasInvoice: [{ required: true, message: '请选择是否收到星图发票', trigger: 'blur' }],
        // isRecharge: [{ required: true, message: '请选择是否充值完成', trigger: 'blur' }],
        // rechargeNumber: [{ required: false, message: '请输入OA充值申请编号', validator: (rule, value, callback) => {
        //   if (this.form.isRecharge & !value) {
        //     callback(new Error('请输入OA充值申请编号'))
        //   } else {
        //     callback()
        //   }
        // }
        // }],
        // invoiceNumber: [{ required: false, message: '请输入发票号', validator: (rule, value, callback) => {
        //   if (this.form.hasInvoice & !value) {
        //     callback(new Error('请输入发票号'))
        //   } else {
        //     callback()
        //   }
        // }
        // }]
      },
      hasaDeliveryName: false
    }
  },
  computed: {
    title() {
      const titleMap = new Map([
        [0, '添加投放订单'],
        [1, '查看投放订单'],
        [2, '编辑投放订单']
      ])

      return titleMap.get(this.types)
    },
    popStatus: {
      set(val) {
        this.$emit('update:show', val)
      },
      get() {
        return this.show
      }
    },
    deliveryMoney() {
      /**
       * consumeAmount 平台消耗金额
       * rebateAmount 返款金额
       * addAmount 补款金额
       * handlingCharge 手续费
       * douMoney dou+成本
       * otherMoney 其他成本
       */
      const deliveryMoney = ['consumeAmount', 'rebateAmount', 'addAmount', 'douMoney', 'otherMoney'].reduce((total, item) => {
        if (item === 'rebateAmount') {
          total = total - Number(this.form[item] || 0)
        } else {
          total = total + Number(this.form[item] || 0)
        }
        return total
      }, 0)
      return deliveryMoney.toFixed(2)
    },
    uploadVideoUrl() {
      return '/api/video/input/uploadVideo'
    }
  },
  watch: {
    item: {
      handler(val) {
        if (val && this.item) {
          this.form = Object.assign({}, this.form, this.item)
          if (this.form.androidDeliveryName) {
            this.hasDeliveryName = true
          } else {
            this.hasDeliveryName = false
          }
          if (this.form.videoTag) {
            this.businessTags = this.form.videoTag === '找靓机' ? this._businessTags.zlj_putting_business_tag : this._businessTags.zz_putting_business_tag
          }
        }
      },
      immediate: true
    }
  },

  created() {
    this.getAccountCondition()
    this.getBusinessTag()
  },
  methods: {
    // 获取业务标签
    getBusinessTag() {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then(res => {
        if (res.code === 1) {
          this._businessTags = res.data
          // this.businessTags = res.data.zz_putting_business_tag
        }
      })
    },
    addMailInfo(data) {
      this.form = Object.assign({}, this.form, data)
    },
    async getAccountCondition() {
      const res = await $getContentType()
      if (res.code === 1) {
        this.contentTypes = res.data
      }
    },
    openUrl(url) {
      window.open(url)
    },
    // 删除视频
    delectVideo() {
      this.form.uploadUrl = ''
      this.$refs.uploadVideo && this.$refs.uploadVideo.clearFiles()
    },
    // 删除图片
    delectImg(e) {
      this.form.imgUrl = ''
      this.$refs.uploadImg && this.$refs.uploadImg.clearFiles()
    },
    limitLen(e, code) {
      let quotePrice = e.target.value
      quotePrice = quotePrice.replace(/[^\d]/g, '')
      if (quotePrice.length > 10) {
        quotePrice = quotePrice.slice(0, 10)
      }
      this.form[code] = quotePrice
    },
    onCancel() {
      this.popStatus = false
      this.$nextTick(() => {
        this.uploading = false
        this.disabled = false
        this.qData = {}
        this.videoTableData = []
        this.total = []
        this.selectedVideo = {}
        this.addVisible = false
        this.form = copy(MODEL)
        this.delectVideo()
      })
    },
    async onConfirm() {
      this.addLoading = true
      try {
        const valid = await this.$refs['form'].validate()
        if (valid && this.deliveryMoney >= 0) {
          const params = copy(this.form)
          params.deliveryMoney = this.deliveryMoney
          ;['handlingCharge', 'rebateAmount', 'addAmount', 'deliveryMoney', 'flowId', 'flowCount', 'cptClick'].forEach((item) => {
            if (!params[item]) {
              params[item] = 0
            } else if (isString(params[item])) {
              params[item] = params[item].replace(/[^\d/\.]/g, '')
            }
          })
          delete params.isDeleted
          if (!this.hasDeliveryName && params.androidDeliveryName) {
            // 判断是否有组件渠道号
            const linkStatus = await $getLinkStatus({ androidDeliveryName: params.androidDeliveryName })
            if (linkStatus.code === 1 && linkStatus.data.code != 1) {
              await this.$confirm(linkStatus.data.message, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
            }
          }
          let res
          if (this.types === 2) {
            // 编辑
            res = await $putOrderPutting(params)
          } else {
            // 新增
            res = await $putOrderPuttingAdd(params)
          }
          if (res.code === 1) {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.$emit('update:list')
            this.$bus.$emit('upLog', { operation_module: this.types === 2 ? '编辑确定' : '下单确定', accountId: params.accountId, accountName: params.accountName })
            this.onCancel()
          } else {
            this.$message({
              type: 'error',
              message: res.message
            })
          }
          this.addLoading = false
        }
      } catch (err) {
        this.addLoading = false
        if (err === false) return
      }
    },
    /**
     * 上传失败处理函数
     * @type {Boolean}
     */
    onImportError(err) {
      this.$message.error(err)
      this.disabled = false
      this.uploading = false
    },
    /**
     * 上传成功
     * @type {Boolean}
     */
    onImportSuccess(re) {
      console.log(re)
      if (re && re.code === 1) {
        this.$message.success('上传完成')
        this.form.uploadUrl = re.data
      } else {
        this.$message.warning(re.message)
        this.form.uploadUrl = ''
      }
      this.uploading = false
      this.disabled = false
    },
    /**
     * 准备上传，文件判断
     */
    onImportReady(file) {
      if (file.size / 1000 / 1000 > 30) {
        this.$message.warning('视频大小不能大于30MB')
        return false
      }
      var re = /\.(mp4)$/i.test(file.name)
      if (re) {
        this.disabled = true
        this.uploading = true
      } else {
        this.$message.warning('只支持 MP4格式文件')
      }
      return re
    },
    uploadPhotoSuccess(re) {
      if (re && re.code === 1) {
        this.form.imgUrl = re.data
        this.$message.success('上传成功')
      } else {
        this.$message.error(re.message)
      }
    },
    handleSelectionChange(selectRows) {},
    handleChangeVideo(params) {
      this.form.flowId = params.flowId
      this.form.url = params.url
      this.form.titleName = params.titleName
      this.form.isDeleted = params.isDeleted
    },
    addVideo() {
      this.addVideoShow = true
      // this.getVideoInfo()
    },
    onDelVideo(video, index) {
      this.form.flowId = ''
      this.form.url = ''
      this.titleName = ''
    },
    handleVideoTagChange(value) {
      this.form.businessTag = ''
      if (value === '找靓机') {
        this.businessTags = this._businessTags.zlj_putting_business_tag
      } else {
        this.businessTags = this._businessTags.zz_putting_business_tag
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .M-advertisingLaunchOrderInfo {
    ::v-deep .el-select, ::v-deep .el-date-editor {
      width: 100%;
    }
  }
  .text-a-l.el-input-number {
    // width: 100%;
    ::v-deep .el-input__inner {
    text-align: left;
    }
  }
  .upload-video {
    width: 200px;
    height: 150px;
    ::v-deep .el-upload-dragger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 200px;
      height: 150px;
      .el-icon-upload {
        margin: 0;
        font-size: 24px;
      }
      .el-upload__text {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
      }
    }
  }
</style>
