<template>
  <div>
    <div v-show="pageType === 'detail'">
      <el-form
        :inline="true"
        label-suffix=":"
        class="order-info-form"
        :class="`order-info-form-line${line}`"
      >
        <el-form-item label="平台">{{ formData.platName }}</el-form-item>
        <el-form-item label="账号">
          <a class="account-box" :href="formData.accountLoginUrl" target="_blank">
            {{ formData.accountName }}
            <el-image :src="formData.accountImg" class="account-img">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </a>
        </el-form-item>
        <el-form-item prop="deliveryId" label="投放专员">
          <div style="width:400px">{{ formData.deliveryName }}（执行开始时间：{{ formData.deliveryTime|emptyFill }}）</div>
        </el-form-item>
        <el-form-item v-if="Number(formData.platId)==2" prop="isMcnStar" label="是否为MCN机构达人 ">
          <el-switch
            v-model="formData.isMcnStar"
            :active-value="1"
            :inactive-value="0"
            :disabled="true"
          />
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="如是MCN机构达人，则对应B站平台收取手续费比例调整为5%，为否则对应B站平台收取手续费比例为7%"
          />
        </el-form-item>
        <br>
        <template v-if="Number(formData.platId)===2">
          <el-form-item label="是否联合投稿">
            <el-switch
              v-model="formData.isUnionContribution"
              :active-value="1"
              :inactive-value="0"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item v-if="Number(formData.isUnionContribution)" prop="unionContributionProportion" label="联合投稿平台手续比例">
            {{ computedRadio }}
          </el-form-item>
          <el-form-item v-if="Number(formData.isUnionContribution)" label="联合投稿平台手续费">
            {{ formData.unionContributionCost }}
          </el-form-item>
          <el-form-item v-if="Number(formData.isUnionContribution)&&pageType!=='place'" label="联合投稿ID">
            {{ formData.unionContributionNumber }}
          </el-form-item>
          <br>
          <el-form-item label="是否挂载组件">
            <el-switch
              v-model="formData.isAmountLink"
              :active-value="1"
              :inactive-value="0"
              :disabled="true"
            />
          </el-form-item>
          <el-form-item v-if="Number(formData.isAmountLink)" label="组件挂载平台手续费">
            {{ formData.amountLinkCost }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              icon-class="iconwenhao"
              content="平台组件挂载手续费为2%"
            />
          </el-form-item>
          <br>
        </template>
        <el-form-item
          :clearable="true"
          label="投放下单报价"
          prop="deliveryOfferAmount"
        >
          <span>{{ formData.deliveryOfferAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台投放合作的下单报价，不含平台手续费。"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="平台手续费"
          prop="platServiceCharge"
        >
          <span>{{ formData.platServiceCharge }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台根据投放合作的报价按照5%收取费用。小红书平台按10%手续费用。另：如平台为B站，则平台手续费=B站平台收取手续费+联合投稿平台手续费+组件挂载平台手续费，其中B站平台收取手续费=投放下单报价*B站平台手续费比例（默认为7%，如是MCN机构达人则为5%）"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="计费方式"
          prop="chargeType"
        >
          <span>{{ CHARGETYPE[formData.chargeType] }}</span>
        </el-form-item>

        <el-form-item
          v-if="formData.chargeType === 1 || formData.chargeType === 2"
          :clearable="true"
          label="计费规则"
          prop="calculatorRule"
        >
          <span>{{ formData.calculatorRule }}</span>

        </el-form-item>
        <br>

        <el-form-item
          :clearable="true"
          label="预计发布时间"
          prop="preReleaseVideoTime"
        >
          <span>{{ formData.preReleaseVideoTime }}</span>

        </el-form-item>
        <el-form-item
          :clearable="true"
          label="平台消耗金额"
          prop="consumeAmount"
        >
          <span>{{ formData.consumeAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台实际消耗金额，包含投放报价和平台手续费。"
          />
        </el-form-item>
        <br>
        <el-form-item
          :clearable="true"
          label="返款金额"
          prop="rebateAmount"
        >

          <span>{{ formData.rebateAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="返款金额（达人返款金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款时间"
          prop="rebateTime"
        >
          <span>{{ formData.rebateTime }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款方式"
          prop="rebateType"
        >
          <span>{{ formData.rebateType }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款截图"
          class="rebate-img"
          prop="rebateScreenshot"
        >
          <div class="flex-inline">
            <!-- <UploadImg v-model="formData.rebateScreenshot" :disabled="true" :limit="3" /> -->
            <el-image
              v-for="(item) in formData.rebateScreenshot"
              :key="item"
              :src="item"
              alt=""
              fit="contain"
              :preview-src-list="rebateScreenshot"
              style="width: 40px;height: 40px;margin-right: 10px;"
            />
          </div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="转账订单号（回单号）"
          prop="transferOrderNum"
          label-width="150"
        >
          <div class="order-num">{{ formData.transferOrderNum }}</div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对公补款金额"
          prop="addAmount"
        >
          <span>{{ formData.addAmount }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对公补款金额：除账号平台报价外另对机构补款金额
            <br>
            对私补款金额：除账号平台报价外另对个人补款金额
            <br>
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <br>
            投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
          <!-- <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="
            "
          /> -->
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对公补款时间"
          prop="addAmountTime"
        >
          <span>{{ formData.addAmountTime }}</span>

        </el-form-item>
        <el-form-item
          :clearable="true"
          label="dou+成本"
          prop="douMoney"
        >
          <span>{{ formData.douMoney }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="dou+成本（给达人充dou+金额，非达人自行充dou+金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="其他成本"
          prop="otherMoney"
        >
          <span>{{ formData.otherMoney }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="其他成本（如微纳税补款6.8%手续费等其他消耗金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对私补款金额"
          prop="priAddAmount"
        >
          <span>{{ formData.priAddAmount }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对公补款金额：除账号平台报价外另对机构补款金额
            <br>
            对私补款金额：除账号平台报价外另对个人补款金额
            <br>
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <br>
            投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对私补款时间"
          prop="priAddAmountTime"
        >
          <span>{{ formData.priAddAmountTime }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="平台手续费（对私）"
          prop="priPlatServiceCharge"
        >
          <span>{{ formData.priPlatServiceCharge }}</span>
          <!-- <span class="pri-radio">比例：7%</span> -->
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            目前合作的第三方支付公司手续费为5.7%
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对私补款金额（含手续费）"
          prop="priAddAmountIncludeServiceCharge"
        >
          <span>{{ formData.priAddAmountIncludeServiceCharge }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <br>
        <el-form-item
          w-100
          :clearable="true"
          label="投放价格"
          prop="deliveryMoney"
        >
          {{ formData.deliveryMoney }}
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额"
          />
        </el-form-item>
        <br>
        <el-form-item
          :clearable="true"
          label="品牌标签"
          prop="videoTag"
        >
          <span>{{ formData.videoTag }}</span>

        </el-form-item>

        <el-form-item
          :clearable="true"
          label="业务标签"
          prop="businessTag"
        >
          <span>{{ formData.businessTag }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="视频类型"
          prop="junType"
        >
          <span>{{ formData.junType }}</span>
        </el-form-item>

        <el-form-item
          v-if="formData.businessTag === 'B2C'"
          label="产品型号"
        >
          <span>{{ formData.b2cPhoneModel || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="广告话术"
        >
          <span>{{ formData.speechcraft || '--' }}</span>
        </el-form-item>
        <el-form-item
          label="植入场景"
        >
          <span>{{ formData.secondSpeechcraft || '--' }} </span>
        </el-form-item>
        <el-form-item
          label="投放品类"
        >
          <span>{{ formData.thirdSpeechcraft || '--' }} </span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="内容类别"
          prop="contentType"
        >
          <span>{{ formData.contentType }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="组件标题"
          prop="componentTitle"
        >
          <span>{{ formData.componentTitle }}</span>
        </el-form-item>
        <!-- <el-form-item
          v-if="Number(formData.platId)===25"
          :clearable="true"
          label="底bar文案"
          prop="bottomBarDraft"
        >
          <span>{{ formData.bottomBarDraft||'--' }}</span>
        </el-form-item> -->
        <el-form-item
          :clearable="true"
          label="达人拍摄所在地"
          class="shoot-address"
        >
          <template>{{ formData.shotAddressInfo||'--' }}</template>
        </el-form-item>
        <br>
        <template v-if="formData.businessTag === 'C2C秒杀'">
          <el-form-item
            :clearable="true"
            label="达人uid"
          >
            <span>{{ formData.darenUid }}</span>
          </el-form-item>
          <el-form-item
            :clearable="true"
            label="是否入驻"
          >
            <span>{{ formData.isSettled === 1 ? '是' : '否' }}</span>
          </el-form-item>
          <br>
        </template>

        <el-form-item
          :clearable="true"
          label="口令"
        >
          <div v-if="formData.deliveryWordOfCommandBOList && formData.deliveryWordOfCommandBOList.list && formData.deliveryWordOfCommandBOList.list.length">
            <span v-for="(item, index) in formData.deliveryWordOfCommandBOList.list" :key="index">{{ item.wordOfCommand }}{{ index < formEditData.deliveryWordOfCommandBOList.list.length - 1 ? ',' : '' }}</span>
          </div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="确认下单截图"
          class="rebate-img"
        >
          <el-image
            v-for="(item) in formData.addOrderScreenshot"
            :key="item"
            :src="item"
            alt=""
            fit="contain"
            :preview-src-list="addOrderScreenshot"
            style="width: 40px;height: 40px;margin-right: 10px;"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="下单付款进度"
          prop="approvalPaymentProgress"
        >
          <span>{{ APPROVAL_PAYMENT_PROGRESS[formData.approvalPaymentProgress] }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="当存在快接单改价、下月改价后下单、沟通中可能有变动、同时谈多单但是需要看第一单效果等情况时选择延后下单"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="邮寄信息"
        >
          <el-link type="primary" @click="hasMailDialog = true">查看</el-link>
          <el-link v-if="$permission('mail_editor')||showEditBtn" class="link-margin" type="primary" @click="handleEditEmail">编辑</el-link>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="合同信息"
        >
          <el-link type="primary" @click="hasContractDialog= true">查看</el-link>
          <el-link v-if="showEditBtn" class="link-margin" type="primary" @click="handleEditConcat">编辑</el-link>
        </el-form-item>
        <el-form-item
          v-if="pageType === 'putting_order_detail'"
          :clearable="true"
          label="审核"
        >
          <el-button type="text" style="padding: 0;" @click="copyText">复制链接</el-button>
        </el-form-item>
        <!-- <el-form-item
        :clearable="true"
        label="合同信息"
      >
        <template v-if="isEdit">

          <el-upload
            v-if="!formEditData.contractUrl"
            class="upload-view"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-remove="fileRemove"
            :limit="1"
            :show-file-list="false"
            :disabled="!isEdit"
            action="/api/business/order/uploadContract"
          >
            <el-button :loading="uploadLoaing" size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div v-else class="contract">
            <a :href="formEditData.contractUrl" target="_blank" underline="false">{{ formEditData.contractUrl }}</a>
            <i class="el-icon-delete" @click="handleRemoveContract" />
          </div>
        </template>
        <template v-else>
          <a class="text-over-hidden-1" :href="formEditData.contractUrl" target="_blank" underline="false">{{ formEditData.contractUrl }}</a>
        </template>

      </el-form-item> -->
        <el-form-item
          w-100
          :clearable="true"
          label="备注"
          prop="orderBaseRemark"
          class="el-form-note"
        >
          <span>{{ formData.orderBaseRemark }}</span>
        </el-form-item>
        <el-form-item v-if="$slots.btn">
          <slot />
        </el-form-item>
      </el-form>
    </div>
    <div v-show="pageType !== 'detail'">
      <!-- <div v-else> -->
      <el-form
        ref="form"
        :model="formEditData"
        :rules="orderRules"
        :inline="true"
        label-width="145px"
        label-suffix=":"
        class="order-info-form"
        :class="[`order-info-form-line${line}`, `edit-order-info-form-line${line}`]"
      >
        <el-form-item label="平台">{{ formData.platName }}</el-form-item>
        <el-form-item label="账号">
          <a class="account-box" :href="formData.accountLoginUrl" target="_blank">
            {{ formData.accountName }}
            <el-image :src="formData.accountImg" class="account-img">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline" />
              </div>
            </el-image>
          </a>
        </el-form-item>
        <el-form-item v-if="palceSource !== 'putting'" prop="deliveryId" label="投放专员">
          <el-select v-if="!formData.requirementId && ['place', 'normal', 'fail'].includes(pageType)" v-model="formEditData.deliveryId" filterable clearable>
            <el-option v-for="item in fundUserList" :key="item.userId" :value="item.userId" :label="item.realname" />
          </el-select>
          <div v-else style="width:400px">{{ formData.deliveryName }}（执行开始时间：{{ formData.deliveryTime|emptyFill }}）</div>
        </el-form-item>
        <el-form-item v-if="Number(formData.platId)===2" prop="isMcnStar" label="是否为MCN机构达人 ">
          <el-switch
            v-model="formEditData.isMcnStar"
            :active-value="1"
            :inactive-value="0"
          />
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="如是MCN机构达人，则对应B站平台收取手续费比例调整为5%，为否则对应B站平台收取手续费比例为7%"
          />
        </el-form-item>
        <br>
        <template v-if="Number(formData.platId)===2">
          <div :class="pageType!=='place'?'union-wrapper':''">
            <el-form-item label="是否联合投稿">
              <el-switch
                v-model="formEditData.isUnionContribution"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item v-if="Number(formEditData.isUnionContribution)" prop="unionContributionProportion" label="联合投稿平台手续比例" label-width="160">

              <el-select v-model="formEditData.unionContributionProportion">
                <el-option v-for="(item,index) in radioList" :key="index" :value="item.value" :label="item.label" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="Number(formEditData.isUnionContribution)" label="联合投稿平台手续费" class="el-unionContributionCost" label-width="160">
              <el-input v-model="formEditData.unionContributionCost" maxlength="10" @input="formEditData.unionContributionCost = arguments[0].replace(/\D/g, '')" />
            </el-form-item>
            <el-form-item v-if="Number(formEditData.isUnionContribution)" label="联合投稿ID" prop="unionContributionNumber">
              <el-input v-model="formEditData.unionContributionNumber" maxlength="18" @input="formEditData.unionContributionNumber = arguments[0].replace(/[^0-9A-Za-z]/g, '')" />
            </el-form-item>
            <el-form-item label="是否挂载组件">
              <el-switch
                v-model="formEditData.isAmountLink"
                :active-value="1"
                :inactive-value="0"
              />
            </el-form-item>
            <el-form-item v-if="Number(formEditData.isAmountLink)" prop="handfee" label="组件挂载平台手续费" label-width="160">
              <el-input v-model="formEditData.amountLinkCost" @input="formEditData.amountLinkCost = arguments[0].replace(/\D/g, '')" />
              <IconTip
                type="popover"
                placement="top-start"
                width="300"
                trigger="hover"
                icon-class="iconwenhao"
                content="平台组件挂载手续费为2%"
              />
            </el-form-item>
          </div>
        </template>
        <el-form-item
          :clearable="true"
          label="投放下单报价"
          prop="deliveryOfferAmount"
        >
          <el-input
            v-if="['place','fail', 'price'].includes(pageType)"
            v-model="formEditData.deliveryOfferAmount"
            @input="formEditData.deliveryOfferAmount = arguments[0].replace(/\D/g, '')"
          />
          <span v-else>{{ formData.deliveryOfferAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台投放合作的下单报价，不含平台手续费。"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="平台手续费"
          prop="platServiceCharge"
        >
          <el-input
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.platServiceCharge"
            :disabled="!['place', 'price'].includes(pageType)"
            @input="formEditData.platServiceCharge = arguments[0].replace(/\D/g, '')"
          />
          <span v-else>{{ formEditData.platServiceCharge }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台根据投放合作的报价按照5%收取费用。小红书平台按10%手续费用。另：如平台为B站，则平台手续费=B站平台收取手续费+联合投稿平台手续费+组件挂载平台手续费，其中B站平台收取手续费=投放下单报价*B站平台手续费比例（默认为7%，如是MCN机构达人则为5%）"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="计费方式"
          prop="chargeType"
        >
          <el-select
            v-if="['place', 'normal', 'fail'].includes(pageType)"
            v-model="formEditData.chargeType"
          >
            <el-option v-for="(val, key) in CHARGETYPE" :key="key" :value="Number(key)" :label="val" />
          </el-select>
          <span v-else>{{ CHARGETYPE[formData.chargeType] }}</span>
        </el-form-item>

        <el-form-item
          v-if="formEditData.chargeType === 1 || formEditData.chargeType === 2"
          :clearable="true"
          label="计费规则"
          prop="calculatorRule"
        >
          <el-input
            v-if="['place', 'normal', 'fail'].includes(pageType)"
            v-model="formEditData.calculatorRule"
            maxlength="50"
          />
          <span v-else>{{ formData.calculatorRule }}</span>

        </el-form-item>
        <br>

        <el-form-item
          :clearable="true"
          label="预计发布时间"
          prop="preReleaseVideoTime"
        >
          <el-date-picker
            v-if="['place', 'normal', 'fail'].includes(pageType)"
            v-model="formEditData.preReleaseVideoTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          />
          <span v-else>{{ formData.preReleaseVideoTime }}</span>

        </el-form-item>
        <el-form-item
          :clearable="true"
          label="平台消耗金额"
          prop="consumeAmount"
        >
          <span>{{ consumeAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="星图、快接单等平台实际消耗金额，包含投放报价和平台手续费。"
          />
        </el-form-item>
        <br>
        <el-form-item
          :clearable="true"
          label="返款金额"
          prop="rebateAmount"
        >
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.rebateAmount"
            :disabled="!(['place', 'price'].includes(pageType)||rejectEdit)"
            class="text-a-l"
            :precision="2"
            :min="0"
            :max="Number(deliveryMoney)"
            :controls="false"
          />
          <span v-else>{{ formData.rebateAmount }}</span>
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="返款金额（达人返款金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款时间"
          prop="rebateTime"
          :required="formEditData.rebateScreenshot.length > 0 ? true: false"
        >
          <el-date-picker
            v-if="['place', 'normal', 'fail','price'].includes(pageType)"
            v-model="formEditData.rebateTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
          <span v-else>{{ formData.rebateTime }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款方式"
          prop="rebateType"
        >
          <el-select v-model="formEditData.rebateType" filterable clearable>
            <el-option v-for="item in deliveryRebateList" :key="item.dictValue" :value="item.dictValue" :label="item.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="返款截图"
          class="rebate-img"
          prop="rebateScreenshot"
          :required="formEditData.rebateTime ? true: false"
        >
          <div
            v-if="['place', 'normal', 'fail','price'].includes(pageType)"
          >
            <UploadImg v-model="formEditData.rebateScreenshot" :limit="3" />
            <div class="el-upload__tip">只能上传jpg/png文件</div>
          </div>
          <div v-else class="flex-inline">
            <el-image
              v-for="(item) in formData.rebateScreenshot"
              :key="item"
              :src="item"
              alt=""
              fit="contain"
              :preview-src-list="rebateScreenshot"
              style="width: 40px;height: 40px;margin-right: 10px;"
            />
            <!-- <el-image
              v-for="(item) in formData.rebateScreenshot"
              :key="item.url"
              :src="item.url"
              alt=""
              :preview-src-list="rebateScreenshot"
              fit="contain"
              style="width: 40px;height: 40px"
            /> -->
          </div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="转账订单号（回单号）"
          prop="transferOrderNum"
          :required="formEditData.rebateScreenshot.length > 0 ? true: false"
          label-width="150"
        >
          <el-input
            v-if="['place', 'normal', 'fail','price'].includes(pageType)"
            v-model="formEditData.transferOrderNum"
            type="text"
            maxlength="50"
          />
          <div v-else class="order-num">{{ formData.transferOrderNum }}</div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对公补款金额"
          prop="addAmount"
        >
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.addAmount"
            :disabled="!(['place', 'price'].includes(pageType)||rejectEdit)"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
          />
          <span v-else>{{ formData.addAmount }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对公补款金额：除账号平台报价外另对机构补款金额
            <br>
            对私补款金额：除账号平台报价外另对个人补款金额
            <br>
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <br>
            投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对公补款时间"
          prop="addAmountTime"
        >
          <el-date-picker
            v-if="['place', 'normal', 'fail','price'].includes(pageType)"
            v-model="formEditData.addAmountTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
          <span v-else>{{ formData.addAmountTime }}</span>

        </el-form-item>
        <el-form-item
          :clearable="true"
          label="dou+成本"
          prop="douMoney"
        >
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.douMoney"
            class="text-a-l"
            :disabled="!['place', 'price'].includes(pageType)"
            :precision="2"
            :max="100000000"
            :controls="false"
          />
          <span v-else>{{ formData.douMoney }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="dou+成本（给达人充dou+金额，非达人自行充dou+金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="其他成本"
          prop="otherMoney"
        >
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.otherMoney"
            :disabled="!['place', 'price'].includes(pageType)"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :controls="false"
          />
          <span v-else>{{ formData.otherMoney }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="其他成本（如微纳税补款6.8%手续费等其他消耗金额）"
          />
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对私补款金额"
          prop="priAddAmount"
        >
          <!-- <el-input
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.priAddAmount"
            :disabled="!['place', 'price'].includes(pageType)"
            onkeyup="this.value=this.value.match(/\d+\.?\d{0,2}/);this.dispatchEvent(new Event('input'))"
            maxlength="9"
          /> -->
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.priAddAmount"
            :disabled="!(['place', 'price'].includes(pageType)||rejectEdit)"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
          />
          <span v-else>{{ formData.priAddAmount }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对公补款金额：除账号平台报价外另对机构补款金额
            <br>
            对私补款金额：除账号平台报价外另对个人补款金额
            <br>
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <br>
            投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="对私补款时间"
          prop="priAddAmountTime"
        >
          <el-date-picker
            v-if="['place', 'normal', 'fail','price'].includes(pageType)"
            v-model="formEditData.priAddAmountTime"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          />
          <span v-else>{{ formData.priAddAmountTime }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="平台手续费（对私）"
          prop="priPlatServiceCharge"
        >
          <el-input-number
            v-if="['place', 'normal', 'fail', 'price'].includes(pageType)"
            v-model="formEditData.priPlatServiceCharge"
            :disabled="!['place', 'price'].includes(pageType)"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
            @change="handlechangeService"
          />
          <span v-else>{{ formData.priPlatServiceCharge }}</span>
          <!-- <span class="pri-radio">比例：7%</span> -->
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            目前合作的第三方支付公司手续费为5.7%
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <el-form-item
          :clearable="true"
          class="pri-Include-charge"
          label="对私补款金额（含手续费）"
          prop="priAddAmountIncludeServiceCharge"
        >
          <span>{{ formEditData.priAddAmountIncludeServiceCharge }}</span>
          <el-popover
            width="400"
            trigger="hover"
            placement="top"
          >
            对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
            <i slot="reference" class="iconfont iconwenhao" />
          </el-popover>
        </el-form-item>
        <br>
        <el-form-item
          w-100
          :clearable="true"
          label="投放价格"
          prop="deliveryMoney"
        >
          {{ deliveryMoney }}
          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额"
          />
          <div v-if="deliveryMoney && deliveryMoney < 0" class="el-form-item__error">投放价格应大于0</div>
        </el-form-item>
        <br>
        <el-form-item
          :clearable="true"
          label="品牌标签"
          prop="videoTag"
        >
          <el-select
            v-if="['fail', 'place'].includes(pageType)"
            v-model="formEditData.videoTag"
            @change="handleVideoTagChange"
          >
            <el-option
              v-for="(item, index) in videoTags"
              :key="`VT_${item.text}_${index}`"
              :value="item.val"
              :label="item.text"
            />
          </el-select>
          <span v-else>{{ formData.videoTag }}</span>

        </el-form-item>
        <el-form-item
          :clearable="true"
          label="业务标签"
          prop="businessTag"
        >
          <!-- <el-select v-if="['fail', 'place'].includes(pageType)||$permission('modification_back_door')" v-model="formEditData.businessTag" @change="handleBusinessTag">
            <el-option v-for="tags in businessTags" :key="tags.dictLabel" :value="tags.dictValue" :label="tags.dictLabel" />
          </el-select> v-else -->
          <span>{{ formData.businessTag }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="视频类型"
          prop="junType"
        >
          <span v-if="$orderData && $orderData.midDeliveryVideoNewBaseInfoBO.videoStatus === 1&&!$permission('modification_back_door')">{{ formData.junType }}</span>
          <el-select v-else v-model="formEditData.junType" filterable clearable>
            <el-option v-for="tags in junTypeList" :key="tags.junType" :value="tags.junType" :label="tags.junType" />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="formData.businessTag === 'B2C'"
          :clearable="true"
          prop="b2cPhoneModelId"
          label="产品型号"
          :error="b2cPhoneModelErrorMsg"
        >
          <!-- <el-cascader
            ref="cascader"
            v-model="formEditData.b2cPhoneModelId"
            placeholder="请选择产品型号"
            class="m-r-10"
            :options="modelData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              expandTrigger: 'click',
              value: 'modelId',
              label: 'modelName',
              children: 'phoneModelVOList'}"
            clearable
            filterable
            :filter-method="dataFilter"
            @change="handleChangeB2CPhoneModel"
          /> -->
          <div class="vir-cascader-box">
            <!-- <div :class="`vir-cascader ${showVirCascader?'z-index0':'z-index100'}`" @click="handleVirCascader">{{ formEditData.b2cPhoneModel }}
              <i class="el-icon-arrow-down vir-cascader-icon" />
            </div> -->
            <VirtualCascader
              v-model="virtualData"
              class="virtual-cascader"
              :options="modelData"
              :err-box="!b2cPhoneModelErrorMsg"
              :is-multiple="false"
              :placeholder="formEditData.b2cPhoneModel?formEditData.b2cPhoneModel:'请选择产品型号'"
            />
          </div>
        </el-form-item>
        <el-form-item
          label="广告话术"
        >
          <el-select v-model="formEditData.speechcraft" class="m-b-4 clearable filterable">
            <el-option v-for="item in speechcraftList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="植入场景"
        >
          <el-select v-model="formEditData.secondSpeechcraft" class="m-b-4" clearable filterable>
            <el-option v-for="item in secondSpeechcraftList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="投放品类"
        >
          <el-select v-model="formEditData.thirdSpeechcraft" clearable filterable>
            <el-option v-for="item in thirdSpeechcraftList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="内容类别"
          prop="contentType"
        >
          <el-select v-if="['normal', 'fail', 'complete', 'place'].includes(pageType)" v-model="formEditData.contentType" clearable filterable>
            <el-option v-for="(content) in contentTypes" :key="content" :value="content" :label="content" />
          </el-select>
          <span v-else>{{ formData.contentType }}</span>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="组件标题"
          prop="componentTitle"
        >
          <el-input v-if="['normal', 'fail', 'place', 'command'].includes(pageType)" v-model="formEditData.componentTitle" maxlength="20" />
          <span v-else>{{ formData.componentTitle }}</span>
        </el-form-item>
        <!-- <el-form-item
          v-if="Number(formData.platId)===25"
          :clearable="true"
          label="底bar文案"
          prop="bottomBarDraft"
        >
          <el-select v-model="formEditData.bottomBarDraft" clearable filterable>
            <el-option v-for="item in bottomBarDraftList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
          </el-select>
        </el-form-item> -->
        <el-form-item
          :clearable="true"
          label="达人拍摄所在地"
          prop="componentTitle"
        >
          <div>
            <div class="shoot-address">
              <el-select v-model="formEditData.shotProvId" placeholder="省" clearable filterable @change="handleChangeProvinces">
                <el-option v-for="item in addressInfo.provinces" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
              </el-select>
              <el-select v-model="formEditData.shotCityId" placeholder="市" clearable filterable @change="handleChangeCity">
                <el-option v-for="item in addressInfo.citys" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
              </el-select>
              <el-select v-model="formEditData.shotAreaId" placeholder="区/县" clearable filterable>
                <el-option v-for="item in addressInfo.areas" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
              </el-select>
            </div>
            <el-link v-if="+formData.provId" type="primary" :underline="false" @click="handleSyncAddress">一键同步邮寄地址</el-link>
          </div>
        </el-form-item>

        <br>
        <template v-if="formData.businessTag === 'C2C秒杀'">
          <el-form-item
            :clearable="true"
            label="达人uid"
          >
            <el-input
              v-if="['normal', 'fail', 'place'].includes(pageType)"
              v-model="formEditData.darenUid"
              maxlength="20"
              :disabled="
                formEditData.deliveryWordOfCommandBOList &&
                  formEditData.deliveryWordOfCommandBOList.addCommandType === 2"
            />
            <span v-else>{{ formData.darenUid }}</span>
          </el-form-item>
          <el-form-item
            :clearable="true"
            label="是否入驻"
          >
            <el-switch v-if="['normal', 'fail', 'place'].includes(pageType)" v-model="formEditData.isSettled" />
            <span v-else>{{ formData.isSettled === 1 ? '是' : '否' }}</span>
          </el-form-item>
          <br>
        </template>

        <el-form-item
          :clearable="true"
          label="口令"
        >
          <template v-if="['normal', 'fail', 'complete', 'command', 'place'].includes(pageType)">
            <p v-if="formEditData.deliveryWordOfCommandBOList && formEditData.deliveryWordOfCommandBOList.list.length">
              <span v-for="(item, index) in formEditData.deliveryWordOfCommandBOList.list" :key="index">{{ item.wordOfCommand }}{{ index < formEditData.deliveryWordOfCommandBOList.list.length - 1 ? ',' : '' }}</span>
            </p>
            <el-button class="m-l-5" type="text" size="small" @click="handleOpenPassword">编辑口令信息</el-button>
          </template>
          <template v-else>
            <div v-if="formData.deliveryWordOfCommandBOList && formData.deliveryWordOfCommandBOList.list.length">
              <span v-for="(item, index) in formData.deliveryWordOfCommandBOList.list" :key="index">{{ item.wordOfCommand }}{{ index < formEditData.deliveryWordOfCommandBOList.list.length - 1 ? ',' : '' }}</span>
            </div>
          </template>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="确认下单截图"
          class="rebate-img"
          prop="addOrderScreenshot"
          :required="['place', 'normal', 'fail'].includes(pageType)&&(isRequired||pageType==='place')"
          :show-message="showAddOrderScreenshotError"
          error="请上传确认下单截图"
        >
          <div
            v-if="['place', 'normal', 'fail'].includes(pageType)"
          >
            <UploadImg v-model="formEditData.addOrderScreenshot" :limit="3" />
            <div class="el-upload__tip">只能上传jpg/png文件</div>
          </div>
          <div v-else class="flex-inline">
            <el-image
              v-for="(item) in formData.addOrderScreenshot"
              :key="item"
              :src="item"
              alt=""
              fit="contain"
              :preview-src-list="addOrderScreenshot"
              style="width: 40px;height: 40px;margin-right: 10px;"
            />
          </div>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="下单付款进度"
          prop="approvalPaymentProgress"
        >
          <el-select v-if="['normal', 'fail', 'place'].includes(pageType)" v-model="formEditData.approvalPaymentProgress">
            <el-option v-for="(label, val) in APPROVAL_PAYMENT_PROGRESS" :key="val" :value="Number(val)" :label="label" />
          </el-select>
          <span v-else>{{ APPROVAL_PAYMENT_PROGRESS[formData.approvalPaymentProgress] }}</span>

          <IconTip
            type="popover"
            placement="top-start"
            width="300"
            trigger="hover"
            icon-class="iconwenhao"
            content="当存在快接单改价、下月改价后下单、沟通中可能有变动、同时谈多单但是需要看第一单效果等情况时选择延后下单"
          />
        </el-form-item>

        <el-form-item
          :clearable="true"
          label="邮寄信息"
        >
          <el-button type="primary" @click="hasMailDialog = true">邮寄信息</el-button>
        </el-form-item>
        <el-form-item
          :clearable="true"
          label="合同信息"
        >
          <el-button type="primary" @click="handleEditConcat">合同信息</el-button>
        </el-form-item>
        <el-form-item
          v-if="pageType === 'putting_order_detail'"
          :clearable="true"
          label="审核"
        >
          <el-button type="text" style="padding: 0;" @click="copyText">复制链接</el-button>
        </el-form-item>
        <!-- <el-form-item
          :clearable="true"
          label="合同信息"
        >
          <template v-if="isEdit">

          <el-upload
            v-if="!formEditData.contractUrl"
            class="upload-view"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :on-remove="fileRemove"
            :limit="1"
            :show-file-list="false"
            :disabled="!isEdit"
            action="/api/business/order/uploadContract"
          >
            <el-button :loading="uploadLoaing" size="small" type="primary">点击上传</el-button>
          </el-upload>
          <div v-else class="contract">
            <a :href="formEditData.contractUrl" target="_blank" underline="false">{{ formEditData.contractUrl }}</a>
            <i class="el-icon-delete" @click="handleRemoveContract" />
          </div>
        </template>
        <template v-else>
          <a class="text-over-hidden-1" :href="formEditData.contractUrl" target="_blank" underline="false">{{ formEditData.contractUrl }}</a>
        </template>

      </el-form-item> -->
        <el-form-item
          w-100
          :clearable="true"
          label="备注"
          prop="orderBaseRemark"
          class="el-form-note"
        >
          <el-input
            v-if="['normal', 'fail', 'place', 'command'].includes(pageType)"
            v-model="formEditData.orderBaseRemark"
            type="textarea"
            placeholder="备注"
            maxlength="50"
            show-word-limit
          />
          <span v-else>{{ formData.orderBaseRemark }}</span>

        </el-form-item>
        <el-form-item v-if="$slots.btn">
          <slot :formData="formEditData" />
        </el-form-item>
      </el-form>
    </div>

    <!-- 邮寄信息弹窗 -->
    <MailDialog
      v-if="hasMailDialog"
      v-model="hasMailDialog"
      :is-edit="['normal', 'fail', 'place', 'complete'].includes(pageType)||isEmailEditor"
      :order-id="formEditData.orderId"
      :account-id="formEditData.accountId"
      :data="(formEditData.addressName||formEditData.sendBackExpressNumber||formEditData.sendExpressNumber)? formEditData : null"
      :is-email-editor="isEmailEditor"
      :status="pageType==='detail' ? 'add' : 'edit'"
      @save="addMailInfo"
      @onOrderDetail="onOrderDetail"
    />
    <!-- 口令信息弹窗 -->
    <PasswordDialog v-if="passwordVisible" v-model="passwordVisible" :form-data="formEditData" :start-time="pageType==='place' ? formData.createdTime : new Date()" :edit-list="formEditData.deliveryWordOfCommandBOList" @save="handlePasswordSave" />
    <!-- 放大查看图片 -->
    <el-dialog
      title="查看图片"
      width="680px"
      :visible="viewPic.show"
      @close="viewPic.show = false"
    >
      <img :src="viewPic.url" style="max-width: 100%;margin: 0 auto;display: block;" alt="">
    </el-dialog>
    <ContractDialog
      v-if="hasContractDialog"
      v-model="hasContractDialog"
      :is-edit-concat="isEditConcat"
      :account-id="formEditData.accountId"
      :data="formEditData"
      :page-type="pageType"
      @onOrderDetail="onOrderDetail"
      @save="addConcatInfo"
    />
  </div>
</template>

<script>
// import { inject } from '@vue/composition-api'
import MailDialog from '../putting-account/_component/MailDialog.vue'
import ContractDialog from '../putting-account/_component/ContractDialog.vue'
import { IconTip, UploadImg, VirtualCascader } from 'components'
import { $getContentType, $getB2CPhoneModel } from '@/api/bussiness-manage'
import { $getDataByDictType } from '@/api'
import { $updateOrder, $getFundUser, $getJunType } from '@/api/putting-manager'
import { copy } from '@/components/common'
import { copyBigDataToBoard, isUndef } from '@/utils'
import { APPROVAL_PAYMENT_PROGRESS } from '@/const'
import PasswordDialog from './PasswordDialog.vue'
import dayjs from 'dayjs'
import { $getAera } from '@/api'
import { isArray, isObject } from 'axios/lib/utils'
import { mapGetters } from 'vuex'
const CHARGETYPE = {
  1: '按播放量计费',
  2: '保量计费',
  3: '一口价计费'
}

const DEFAULT_FORM = {
  businessTag: '',
  deliveryMoney: '',
  approvalPaymentProgress: 1,
  isSettled: 0,
  darenUid: '',
  rebateScreenshot: [],
  addOrderScreenshot: [],
  junType: '',
  b2cPhoneModelId: '',
  b2cPhoneModel: ''
  // platServiceCharge: 0,
  // consumeAmount: 0,
  // deliveryMoney: 0
}

export default {
  components: { MailDialog, PasswordDialog, IconTip, UploadImg, ContractDialog, VirtualCascader },
  props: {
    showEditBtn: {
      type: Boolean,
      default: false
    },
     // normal 默认编辑 || price 订单改价 || command 口令编辑 || complete 订单完成状态 || fail 订单驳回状态 || place 下单
    pageType: {
      type: String,
      default: 'detail',
      validator: value => ['detail', 'place', 'price', 'normal', 'complete', 'command', 'fail'].includes(value)
    },
    // 下单时来源如果是投放需求池则不显示投放专员
    palceSource: {
      type: String,
      default: ''
    },
    line: {
      type: Number,
      default: 2
    },
    formData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    const validateDeliveryOfferAmount = (rule, value, callback) => {
      if (String(value).trim().length === 0) {
        callback(new Error('请填写投放下单报价'))
      } else if (/^[0-9]+(\.[0-9]+)?$/.test(value) === false) {
        callback(new Error('请填写正确的投放下单报价'))
      } else {
        callback()
      }
    }

    const validRebateScreenshot = (rule, value, callback) => {
      if (!this.formEditData.rebateTime) return callback()
      if (this.formEditData.rebateScreenshot && this.formEditData.rebateScreenshot.length > 0) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
    const validAddOrderScreenshot = (rule, value, callback) => {
      if (this.formEditData.addOrderScreenshot && this.formEditData.addOrderScreenshot.length > 0) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
    const validRebateTime = (rule, value, callback) => {
      if (this.formEditData.rebateScreenshot && this.formEditData.rebateScreenshot.length > 0 && !value) {
        return callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const validRebateAmount = (rule, value, callback) => {
      if ((this.formEditData.rebateTime || this.formEditData.rebateScreenshot && this.formEditData.rebateScreenshot.length > 0) && isUndef(value)) {
        return callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const validReceiptNumber = (rule, value, callback) => {
      if (this.formEditData.rebateScreenshot.length && !this.formEditData.transferOrderNum) {
        return callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    const validNumber = (rule, value, callback) => {
      if (value && value.length < 18) {
        return callback(new Error(rule.message))
      } else {
        callback()
      }
    }
    // const getNextChildren = (value, list = this.allModelData || [], level) => {
    //   const children = cloneDeep(list)
    //   for (let i = 0; i < children.length; i++) {
    //     if (children[i].modelId === value) {
    //       return this.recurAddLeaf(children[i].phoneModelVOList)
    //     }
    //     if (children[i].phoneModelVOList) {
    //       const result = getNextChildren(value, children[i].phoneModelVOList, level)
    //       if (result) {
    //         return result
    //       }
    //     }
    //   }
    //   return null
    // }
    return {
      virtualData: [],
      showVirCascader: false,
      b2cPhoneModelIds: [],
      originData: [],
      // cascaderProps: {
      //     lazy: true,
      //     lazyLoad(node, resolve) {
      //       const { level, value } = node
      //       let dataList = []
      //       if (node.children && node.children.length > 0) { resolve() } else {
      //         dataList = getNextChildren(value, this.allModelData, level) || []
      //         const nodes = dataList.map((item) => {
      //           return ({
      //             modelId: item.modelId,
      //             modelName: item.modelName,
      //             // leaf: !item.phoneModelVOList,
      //             phoneModelVOList: item.phoneModelVOList
      //           })
      //         })
      //       resolve(nodes)
      //       }
      //     }
      //   },
      allModelData: [],
      viewPic: {
        show: false,
        url: ''
      },
      APPROVAL_PAYMENT_PROGRESS,
      isEditOfMail: true,
      hasMailDialog: false,
      hasContractDialog: false,
      uploadLoaing: false,
      passwordVisible: false,
      CHARGETYPE,
      orderRules: {
        rebateScreenshot: { validator: validRebateScreenshot, message: '请上传返款截图', trigger: 'change' },
        addOrderScreenshot: { validator: validAddOrderScreenshot, message: '请上传确认下单截图', trigger: 'change' },
        chargeType: [{ required: true, message: '请选择计费方式', trigger: 'change' }],
        deliveryId: [{ required: true, message: '请选择投放专员', trigger: 'change' }],
        preReleaseVideoTime: [{ required: true, message: '请选择预计发布时间', trigger: 'blur' }],
        deliveryOfferAmount: [{ required: true, validator: validateDeliveryOfferAmount, trigger: 'blur' }],
        calculatorRule: [{ required: true, message: '请填写计费规则', trigger: 'blur' }],
        videoTag: [{ required: true, message: '请选择品牌标签', trigger: 'change' }],
        // businessTag: [{ required: true, message: '请选择业务标签', trigger: 'change' }],
        contentType: [{ required: true, message: '请选择内容类别', trigger: 'change' }],
        approvalPaymentProgress: [{ required: true, message: '请选择审批下单付款进度', trigger: 'change' }],
        darenUid: [{ required: true, message: '请输入达人uid', trigger: 'blur' }],
        rebateTime: [{ validator: validRebateTime, message: '请选择返款时间', trigger: ['blur', 'change'] }],
        rebateAmount: [{ validator: validRebateAmount, message: '请输入返款金额', trigger: 'blur' }],
        b2cPhoneModelId: [{ required: false, message: '请选择产品型号', trigger: ['blur', 'change'] }],
        junType: [{ required: true, message: '请选择视频类型', trigger: 'change' }],
        transferOrderNum: { validator: validReceiptNumber, message: '请输入转账订单号（回单号）', trigger: ['blur', 'change'] },
        unionContributionProportion: [{ required: true, message: '请选择联合投稿手续费比例', trigger: 'change' }],
        unionContributionNumber: { validator: validNumber, message: '联合投稿ID为18位', trigger: 'change' }
        // bottomBarDraft: [{ required: true, message: '请选择底bar文案', trigger: 'change' }]
      },
      businessTags: [],
      junTypeList: [],
      businessTagsMap: {},
      contentTypes: [],
      fundUserList: [],
      formEditData: {
        deliveryOfferAmount: '',
        deliveryWordOfCommandBOList: [],
        rebateScreenshot: [],
        addOrderScreenshot: [],
        rebateAmount: undefined,
        isUnionContribution: '0',
        isAmountLink: '0',
        unionContributionProportion: '0.03',
        unionContributionNumber: 0,
        amountLinkCost: 0,
        unionContributionCost: 0,
        b2cPhoneModelId: '',
        b2cPhoneModel: '',
        shotProvId: '',
        shotCityId: '',
        shotAreaId: ''
      },
      modelData: [],
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
      radioList: [
        { label: '3%', value: '0.03' },
        { label: '5%', value: '0.05' },
        { label: '8%', value: '0.08' }
      ],
      isEmailEditor: false,
      isEditConcat: false,
      speechcraftList: [],
      isRequired: false, // 确认下单截图历史数据修复
      showAddOrderScreenshotError: false,
      isErrorFirst: true,
      addressInfo: {
        citys: [],
        provinces: [],
        areas: []
      },
      b2cPhoneModelErrorMsg: '',
      deliveryRebateList: [],
      secondSpeechcraftList: [],
      thirdSpeechcraftList: []
      // bottomBarDraftList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    consumeAmount() {
      // 订单改价
      let count = Number(this.formEditData.deliveryOfferAmount || 0) + Number(this.formEditData.platServiceCharge || 0)
      if (this.formEditData.deliveryOfferAmount && Number((this.formData.platId) === 26 || Number(this.formData.platId) === 25)) {
        this.$set(this.formEditData, 'consumeAmount', count)
        return Number(this.formData.platId) === 26 ? Math.ceil(count) : Math.floor(count)
      } else {
        count = count.toFixed(2) - 0
        this.$set(this.formEditData, 'consumeAmount', count)
        return count
      }
    },
    deliveryMoney() {
      // 投放价格=投放下单报价+平台手续费 +对公补款金额+对私补款金额（含手续费）+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额
      // consumeAmount(平台消耗金额)： 投放下单报价+平台手续费
      // addAmount(补款金额)
      const form = this.formEditData

      let deliveryMoney = this.consumeAmount + (['rebateAmount', 'addAmount', 'priAddAmountIncludeServiceCharge', 'douMoney', 'otherMoney'].reduce((total, item) => {
        if (item === 'rebateAmount') {
          total = total - Number(form[item] || 0)
        } else {
          total = total + Number(form[item] || 0)
        }
        return total
      }, 0))

      if (!(this.pageType === 'detail')) {
        if (!(this.$orderData && this.$orderData.fundAccountingInfoVO && this.$orderData.fundAccountingInfoVO.orderCompleteStatus === 1)) {
          // 未完成订单状态
          // 订单未完成 投放价格不减去补款金额
          deliveryMoney += Number(form.rebateAmount || 0)
        }
      }
      const total = deliveryMoney.toFixed(2)
      return total
    },
    pickerOptions() {
      const sTime = this.formData.createdTime || new Date()
      return {
        disabledDate(time) {
          return dayjs(sTime).add(-1, 'day').isAfter(time) || dayjs(sTime).add(6, 'month').isBefore(time)
        }
      }
    },
    rebateScreenshot() {
      if (this.pageType === 'detail') {
        return this.formData.rebateScreenshot
      }
      return this.formEditData.rebateScreenshot
    },
    // 确认下单截图
    addOrderScreenshot() {
      if (this.pageType === 'detail') {
        return this.formData.addOrderScreenshot
      }
      return this.formEditData.addOrderScreenshot
    },
    // B站平台收取手续费=投放下单报价*B站平台手续费比例（默认为7%，如是MCN机构达人则为5%）
    bServiceCharge() {
      const { deliveryOfferAmount = '', isMcnStar = 0 } = this.formEditData
      const radio = Number(isMcnStar) ? 0.05 : 0.07
      return deliveryOfferAmount * radio
    },
    computedRadio() {
      const item = this.radioList.find(item => item.value === String(this.formData.unionContributionProportion))
      return item ? item.label : '3%'
    },
     // 审批下单付款被驳回,中台可编辑返款金额、对公补款/对私补款金额
    rejectEdit() {
      const { examineStatus } = this.$orderData.orderPaymentInfoVO || {}
      return examineStatus === 2
    }

  },
  watch: {
    formData: {
      immediate: true,
      handler(val) {
        if (val) {
          if (val.rebateScreenshot) {
            val.rebateScreenshot = typeof val.rebateScreenshot === 'string' ? JSON.parse(val.rebateScreenshot) : val.rebateScreenshot
          } else {
            val.rebateScreenshot = []
          }
          if (isArray(val.rebateScreenshot)) {
            val.rebateScreenshot = val.rebateScreenshot.map(item => {
              if (isObject(item)) {
                return item.url
              } else {
                return item
              }
            })
          }
          if (val.addOrderScreenshot) {
            val.addOrderScreenshot = typeof val.addOrderScreenshot === 'string' ? JSON.parse(val.addOrderScreenshot) : val.addOrderScreenshot
          } else {
            val.addOrderScreenshot = []
          }
          if (isArray(val.addOrderScreenshot)) {
            val.addOrderScreenshot = val.addOrderScreenshot.map(item => {
              if (isObject(item)) {
                return item.url
              } else {
                return item
              }
            })
          }
          // 旧数据处理
          if (val.orderCommand && ((val.deliveryWordOfCommandBOList && val.deliveryWordOfCommandBOList.list.length === 0) || !val.deliveryWordOfCommandBOList)) {
            const deliveryWordOfCommandBOList = val.orderCommand.split(',').map(t => {
              return {
                wordOfCommand: t,
                timerange: []
              }
            })
            this.$set(this.formData.deliveryWordOfCommandBOList, 'list', deliveryWordOfCommandBOList)
          }
          // 旧的B站数据处理
          if (!Number(val.isUnionContribution)) {
            this.formData.unionContributionProportion = '0.03'
          } else {
            this.formData.unionContributionProportion = String(val.unionContributionProportion)
          }
          this.formData.shotProvId = this.formData.shotProvId ? this.formData.shotProvId : ''
          this.formData.shotAreaId = this.formData.shotAreaId ? this.formData.shotAreaId : ''
          this.formData.shotCityId = this.formData.shotCityId ? this.formData.shotCityId : ''
          this.formEditData = Object.assign({}, copy(DEFAULT_FORM), copy(this.formData))
          // 给产品型号数组列表赋值
          this.b2cPhoneModelIds = this.formData.b2cPhoneModelIds
          if (this.formData.shotProvId) {
            this.handleChangeProvinces()
          }
          if (this.formData.shotCityId) {
            setTimeout(() => {
              this.handleChangeCity()
            })
          }
          // 大于2月1号
          if (this.formData.businessTag === 'B2C' && this.formData.createdTime && (new Date(this.formData.createdTime).getTime() > new Date('2023-02-01 00:00:00').getTime()) || this.pageType === 'place') {
            this.orderRules.b2cPhoneModelId = [{ required: true, message: '请选择产品型号', trigger: ['blur', 'change'] }]
          } else {
            this.orderRules.b2cPhoneModelId = [{ required: false, message: '请选择产品型号', trigger: ['blur', 'change'] }]
          }

          this.getSpeechcraftList()
        }
      }
    },
    pageType: {
      immediate: true,
      handler(val) {
        if (val) {
          this.isErrorFirst = true
          this.showAddOrderScreenshotError = false
          this.resetForm(val)
        }
      }
    },
    // 监听对私补款金额
    // 对私补款金额（含手续费）=对私补款金额+平台手续费（对私）
    'formEditData.priAddAmount'(val) {
      if (val) {
        const money = Number(val) * 0.057
        this.$set(this.formEditData, 'priPlatServiceCharge', money.toFixed(2))
        const serviceCharge = (money + val).toFixed(2)
        this.$set(this.formEditData, 'priAddAmountIncludeServiceCharge', serviceCharge)
      }
    },
    // 监听平台对私手续费
    'formEditData.priPlatServiceCharge'(val) {
        const value = Number(val || 0)
        if (this.formEditData) {
          const serviceCharge = ((this.formEditData.priAddAmount ? Number(this.formEditData.priAddAmount) : 0) + value).toFixed(2)
          this.$set(this.formEditData, 'priAddAmountIncludeServiceCharge', serviceCharge)
        }
    },
    'formEditData.businessTag'(val) {
      if (val) {
        this.getJunType()
      }
      if (val !== 'B2C') {
        this.formEditData.b2cPhoneModelId = ''
      }
    },
    // 投放下单报价
    'formEditData.deliveryOfferAmount'(val) {
      // (1)非联合投稿
      if (!Number(this.formEditData.isUnionContribution) || !Number(this.formEditData.isAmountLink)) {
        // 小红书10%收取手续费，其他平台5%
        let count = +this.formData.platId === 45 ? ((val || 0) * 0.1).toFixed(2) : ((val || 0) * 0.05).toFixed(2)
        count = isNaN(count) ? 0 : count
        // 平台手续费：抖音四舍五入，快手向上取整，其他平台向下取整
        // count = Number(this.formData.platId) === 26 ? Math.ceil(count) : Math.floor(count)
        count = Number(this.formData.platId) === 25 ? Math.round(count) : Number(this.formData.platId) === 26 ? Math.ceil(count) : Math.floor(count)
        this.$set(this.formEditData, 'platServiceCharge', count)
      }
      // (2)联合投稿
      if (this.formData && Number(this.formData.platId) === 2 && Number(this.formEditData.isUnionContribution)) {
        // 联合投稿平台手续费=投放下单报价*联合投稿平台手续费比例
        const unionContributionCost = (val || 0) * (this.formEditData.unionContributionProportion || 0)
        this.$set(this.formEditData, 'unionContributionCost', unionContributionCost.toFixed(2))
        console.log('联合投稿平台手续费', unionContributionCost)
      }
      // 挂载组件
      // B站的组件挂载平台手续费 = 投放下单报价*0.02（精确到小数点后两位）
      if (this.formData && Number(this.formData.platId) === 2 && Number(this.formEditData.isAmountLink)) {
        const amountLinkCost = ((val || 0) * 0.02).toFixed(2)
        this.formEditData.amountLinkCost = amountLinkCost
        console.log('组件挂载平台手续费', amountLinkCost)
      }
    },
    // 投放价格
    deliveryMoney(val) {
      this.formEditData.deliveryMoney = this.deliveryMoney
    },
    'formEditData.unionContributionProportion'(val) {
      // （1）联合投稿平台手续费=投放下单报价*联合投稿平台手续费比例
      const deliveryOfferAmount = (this.formEditData.deliveryOfferAmount || 0) * (val || 0)
      const unionContributionCost = deliveryOfferAmount.toFixed(2)
      this.$set(this.formEditData, 'unionContributionCost', unionContributionCost)
    },
    // 平台手续费=B站平台收取手续费+联合投稿平台手续费+组件挂载平台手续费
    bServiceCharge(val) {
      if (this.formData && Number(this.formData.platId) === 2) {
        if (val) {
        const { unionContributionCost = 0, amountLinkCost = 0, isAmountLink = 0, isUnionContribution = 0 } = this.formEditData
        // 1）联合投稿且组件已挂载
        if (Number(isUnionContribution) && Number(isAmountLink)) {
          let count1 = 0
          count1 = (Number(val) || 0) + Number(unionContributionCost) + Number(amountLinkCost)
          this.$set(this.formEditData, 'platServiceCharge', count1.toFixed(2))
        }
        // 2）非联合投稿、组件已挂载
        if (!Number(isUnionContribution) && Number(isAmountLink)) {
          let count2 = 0
          count2 = (Number(val) || 0) + Number(amountLinkCost)
          this.$set(this.formEditData, 'platServiceCharge', count2.toFixed(2))
        }
        // 3）联合投稿、未挂载组件
        if (Number(isUnionContribution) && !Number(isAmountLink)) {
          let count3 = 0
          count3 = (Number(val) || 0) + Number(unionContributionCost)
          this.$set(this.formEditData, 'platServiceCharge', count3.toFixed(2))
        }
        // 4）非联合投稿、未挂载组件
        if (!Number(isUnionContribution) && !Number(isAmountLink)) {
          let count4 = 0
          count4 = (Number(val) || 0)
          this.$set(this.formEditData, 'platServiceCharge', count4.toFixed(2))
        }
        }
      }
    },
    // 监听是否联合投稿、计算联合投稿手续费
    'formEditData.isUnionContribution'(val) {
      const { unionContributionCost = 0, amountLinkCost = 0, isAmountLink = 0, deliveryOfferAmount = 0, unionContributionProportion = 0 } = this.formEditData
      let count = 0
      if (Number(val)) {
        if (Number(isAmountLink)) {
          count = (this.bServiceCharge || 0) + Number(unionContributionCost) + Number(amountLinkCost)
        } else {
          count = (this.bServiceCharge || 0) + Number(unionContributionCost)
        }
        const unionContributionCost1 = Number(deliveryOfferAmount || 0) * Number(unionContributionProportion)
        this.$set(this.formEditData, 'unionContributionCost', unionContributionCost1.toFixed(2))
      } else {
        count = (this.bServiceCharge || 0) + Number(amountLinkCost)
      }
      this.$set(this.formEditData, 'platServiceCharge', count.toFixed(2))
    },
    // 监听是否挂载组件，计算组件挂载平台手续费
    'formEditData.isAmountLink'(val) {
      const { deliveryOfferAmount = 0 } = this.formEditData
      if (Number(val)) {
        const amountLinkCost = ((deliveryOfferAmount || 0) * 0.02).toFixed(2)
        this.$set(this.formEditData, 'amountLinkCost', amountLinkCost)
      } else {
        this.$set(this.formEditData, 'amountLinkCost', 0)
      }
    },
    // 监听组件挂载平台手续费计算平台手续费
    'formEditData.amountLinkCost'(val) {
      const { unionContributionCost = 0 } = this.formEditData
      let count = 0
      if (val) {
        count = (Number(val) || 0) + Number(unionContributionCost) + Number(this.bServiceCharge)
      } else {
        count = Number(unionContributionCost) + Number(this.bServiceCharge)
      }
      this.$set(this.formEditData, 'platServiceCharge', count.toFixed(2))
    },
    // 监听联合投稿平台手续费计算平台手续费
    'formEditData.unionContributionCost'(val) {
      const { amountLinkCost = 0 } = this.formEditData
      let count = 0
      if (val) {
        count = (Number(val) || 0) + Number(amountLinkCost) + Number(this.bServiceCharge)
      } else {
        count = Number(amountLinkCost) + Number(this.bServiceCharge)
      }
      this.$set(this.formEditData, 'platServiceCharge', count.toFixed(2))
    },
    // 监听确认下单截图
    'formEditData.addOrderScreenshot'(val, oldVal) {
      if ((oldVal || []).length) {
        this.isErrorFirst = false
      }

      this.$nextTick(() => {
        if (this.isErrorFirst) {
          return
        }
        if (!(['place', 'normal', 'fail'].includes(this.pageType) && (this.isRequired || this.pageType === 'place'))) {
          this.showAddOrderScreenshotError = false
          return
        }

        if ((val || []).length > 0) {
          this.showAddOrderScreenshotError = false
        } else {
          this.showAddOrderScreenshotError = true
        }
      })
    },
    virtualData(val) {
      this.formEditData.b2cPhoneModel = ''
      this.formEditData.b2cPhoneModelId = ''
      this.handleChangeB2CPhoneModel(val)
    }
  },
  inject: {
    $orderData: {
      default: () => {}
    }
  },
  created() {
    this.getAccountCondition()
    this.getBusinessTag()
    this.getFundUserList()
    this.getB2CPhoneModel()
    this.isRequired = new Date() > new Date('2022-06-07 16:10:00')
    this.getAddressInfo()
  },
  mounted() {
    window.addEventListener('click', this.handleBlurB2CPhoneModel)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.handleBlurB2CPhoneModel)
  },
  methods: {
    handleVirCascader() {
      this.showVirCascader = true
    },
    // 设置产品类型的回显数据
    // setModelIdList() {
    //   const list = this.b2cPhoneModelIds || []
    //   const modelList = cloneDeep(this.modelData)
    //   if (list.length > 0) {
    //     const index = modelList.findIndex(item => item.modelId === list[0])
    //     const findItemObj = this.allModelData.find(item => item.modelId === list[0])
    //     const obj = this.formatModelList(findItemObj, list[1])
    //     modelList.splice(index, 1, obj)
    //   }
    //   this.modelData = modelList
    // },
    // formatModelList(obj, value) {
    //   obj.phoneModelVOList.forEach(item => {
    //     if (item.phoneModelVOList) {
    //       item.phoneModelVOList = this.recurAddLeaf(item.phoneModelVOList)
    //     }
    //   })
    //   return obj
    // },
    // 递归遍历列表，给最后把一项添加leaf
    // recurAddLeaf(list) {
    //   (list || []).forEach(item => {
    //     if (!item.phoneModelVOList) {
    //       item.leaf = !item.phoneModelVOList
    //     } else {
    //       this.recurAddLeaf(item.phoneModelVOList)
    //     }
    //   })
    //   return list
    // },
    handleSyncAddress() {
      if (!+this.formData.provId) return
      const promiseArr = []
      if (this.formData.provId) {
        const cityRes = this.getArea(this.formData.provId)
        promiseArr.push(cityRes)
      }
      if (this.formData.cityId) {
        const areaRes = this.getArea(this.formData.cityId)
        promiseArr.push(areaRes)
      }
      Promise.all(promiseArr).then(res => {
        if (res && res.length) {
          if (res[0].code === 1 && res[0].data) {
            this.addressInfo.citys = res[0].data
          } else {
            this.$message.error('网络错误')
          }
          if (res[1].code === 1 && res[1].data) {
            this.addressInfo.areas = res[1].data
          } else {
            this.$message.error('网络错误')
          }
          this.formEditData.shotProvId = this.formData.provId
          this.formEditData.shotCityId = this.formData.cityId
          this.formEditData.shotAreaId = this.formData.areaId
        }
      })
    },
    handleChangeProvinces() {
      this.formEditData.shotCityId = ''
      this.formEditData.shotAreaId = ''
      this.getArea(this.formEditData.shotProvId || this.formData.shotProvId).then(res => {
        if (res.code === 1 && res.data) {
          this.addressInfo.citys = res.data
        } else {
          this.$message.error('网络错误')
        }
      }).catch(err => {
        this.$message.error('网络错误')

        console.log(err)
      })
    },
    handleChangeCity() {
      this.formEditData.shotAreaId = ''
      this.getArea(this.formEditData.shotCityId || this.formData.shotCityId).then(res => {
        if (res.code === 1 && res.data) {
          this.addressInfo.areas = res.data
        } else {
          this.$message.error('网络错误')
        }
      }).catch(err => {
        this.$message.error('网络错误')
        console.log(err)
      })
    },
    getArea(parentId = 0) {
      return $getAera({ parentId }, Math.random())
    },
    async getAddressInfo() {
      this.getArea(0).then(res => {
        if (res.code === 1 && res.data) {
          this.addressInfo.provinces = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        // this.allModelData = [...data]
        this.modelData = data
        // data.forEach(item => {
        //    this.modelData.push({ modelId: item.modelId, modelName: item.modelName })
        // })

        // 有产品型号
        const b2cId = this.formData.b2cPhoneModelId || this.formEditData.b2cPhoneModelId
        const b2cName = this.formData.b2cPhoneModel || this.formEditData.b2cPhoneModel

        if (b2cId) {
          for (let i = 0; i < (data || []).length; i++) {
            for (let j = 0; j < (data[i].phoneModelVOList || []).length; j++) {
              if (data[i].phoneModelVOList[j].phoneModelVOList.findIndex(item => +item.modelId === +b2cId) > -1) {
                this.formEditData.b2cPhoneModelId = [+data[i].modelId, +data[i].phoneModelVOList[j].modelId, +b2cId]
                this.formEditData.b2cPhoneModel = b2cName
                break
              }
            }
          }
        }

        this.$nextTick(() => {
        })
      }
    },

    handleEditEmail() {
      this.hasMailDialog = true
      this.isEmailEditor = this.$permission('mail_editor') || this.showEditBtn
    },
    handleEditConcat() {
      this.hasContractDialog = true
      this.isEditConcat = true
    },
    handleBusinessTag(val) {
      // if (this.isEdit) {
        this.formEditData.isSettled = 0
        // this.formEditData.darenUid = ''
      // }
      this.getJunType()
      // if (!val) return
      // const list = copy(this.junTypeList)
      // if (['B2C秒杀', 'C2C秒杀'].includes(val)) {
      //   list.forEach(item => {
      //    if (item.junType.includes(val)) {
      //      this.formEditData.junType = item.junType
      //    }
      //   })
      // }
    },
    handlePasswordSave(data) {
      this.formEditData.deliveryWordOfCommandBOList = data
      if (data.darenUid) {
        this.formEditData.darenUid = data.darenUid
      }
      // this.formEditData.orderCommand = data.length ? data
    },
    /**
     * 打开口令弹窗
     */
    handleOpenPassword() {
      this.passwordVisible = true
    },
    resetForm(val) {
      this.formEditData = Object.assign({}, copy(DEFAULT_FORM), copy(this.formData))
      this.formEditData.isSettled = !!this.formEditData.isSettled
      if (this.pageType === 'normal' || this.pageType === 'fail' || this.pageType === 'edit') {
        this.getJunType(true)
      }
    },
    clearValidate() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    },
    hendleViewPic(row) {
      this.viewPic.url = row.url
      this.viewPic.show = true
    },
    copyText() {
      copyBigDataToBoard(`http://app.qpmcn.com/#/putting_order?orderId=${this.$route.query.orderId}`)
      this.$message.success('复制成功')
    },
    handleVideoTagChange(value) {
      if (value === '找靓机') {
        this.businessTags = this.businessTagsMap.zlj_putting_business_tag
      } else {
        this.businessTags = this.businessTagsMap.zz_putting_business_tag
      }
      this.getJunType()
    },
    // 获取业务标签
    getBusinessTag() {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag', 'delivery_rebate_type']
      }).then(res => {
        if (res.code === 1) {
          this.businessTagsMap = res.data
          if (this.formEditData.videoTag === '找靓机') {
            this.businessTags = this.businessTagsMap.zlj_putting_business_tag
          } else {
            this.businessTags = this.businessTagsMap.zz_putting_business_tag
          }
          this.deliveryRebateList = this.businessTagsMap.delivery_rebate_type
        }
      })
    },
     // 获取话术分类
    getSpeechcraftList() {
      let dictTypes = ['b2c_putting_speechcraft', 'second_b2c_putting_speechcraft', 'third_b2c_putting_speechcraft']
       if (this.formData.businessTag === 'B2C') {
          dictTypes = ['b2c_putting_speechcraft', 'second_b2c_putting_speechcraft', 'third_b2c_putting_speechcraft']
        } else if (this.formData.businessTag === 'C2B') {
          dictTypes = ['c2b_putting_speechcraft', 'second_c2b_putting_speechcraft', 'third_c2b_putting_speechcraft']
        } else if (this.formData.businessTag === 'C2C') {
          dictTypes = ['c2b_putting_speechcraft', 'second_c2c_putting_speechcraft', 'third_c2c_putting_speechcraft']
        }
      $getDataByDictType({
        dictTypes
      }).then(res => {
        if (res.code === 1 && res.data) {
          this.speechcraftList = res.data[dictTypes[0]]
          this.secondSpeechcraftList = res.data[dictTypes[1]] || []
          this.thirdSpeechcraftList = res.data[dictTypes[2]] || []
        }
      })
    },
    // 获取视频类型
    getJunType(isInit = false) {
      if (!(this.formData || {}).accountId) return

      if (!isInit) {
        this.formEditData.junType = ''
      }
      $getJunType({
        accountId: this.formData.accountId,
        brandTag: this.formEditData.videoTag,
        requirementId: this.formData.requirementId,
        dictValue: this.formData.businessTag || ''
      }).then(res => {
        if (res.code === 1) {
          if (res.data.findIndex(item => item.junType === this.formEditData.junType) <= -1) {
            if (this.pageType !== 'detail' && !(this.$orderData && this.$orderData.midDeliveryVideoNewBaseInfoBO.videoStatus === 1)) {
              this.formEditData.junType = ''
            }
          }
          this.junTypeList = res.data
        }
      })
    },
    // 获取内容类别
    async getAccountCondition() {
      $getContentType().then(res => {
        if (res.code === 1) {
          this.contentTypes = res.data
        }
      })
    },
    async checkScreenShot() {
        if ((['place', 'normal', 'fail'].includes(this.pageType) && (this.isRequired || this.pageType === 'place'))) {
          if ((this.formEditData.addOrderScreenshot || []).length < 1) {
            this.showAddOrderScreenshotError = true
            return Promise.reject()
          }

          this.showAddOrderScreenshotError = false
        }
    },

    checkB2CPhoneModel() {
      return this.orderRules.b2cPhoneModelId[0].required && !this.formEditData.b2cPhoneModelId
      // return this.orderRules.b2cPhoneModelId[0].required && this.$refs.cascader && !this.$refs.cascader.getCheckedNodes().filter(item => !item.hasChildren).length
    },

    handleChangeB2CPhoneModel(val) {
      // 如果是必填 并且选中的不是最后一级
      const value = val ? val[0] : ''
      this.formEditData.b2cPhoneModelId = value
      if (this.checkB2CPhoneModel()) {
        this.b2cPhoneModelErrorMsg = '请选择产品机型'
      } else {
        this.b2cPhoneModelErrorMsg = ''
      }
    },

    handleBlurB2CPhoneModel() {
      if (this.$refs.cascader && !this.$refs.cascader.getCheckedNodes().filter(item => !(item && item.hasChildren)).length) {
        this.formEditData.b2cPhoneModelId = ''
      }
    },

    async handleEditSave() {
      if (this.deliveryMoney < 0) {
        return Promise.reject()
      }

      let b2cPhoneModelErrorMsg = ''
      // 如果是必填 并且选中的不是最后一级
      if (this.checkB2CPhoneModel()) {
        b2cPhoneModelErrorMsg = '请选择产品机型'
      } else {
        b2cPhoneModelErrorMsg = ''
      }
      this.b2cPhoneModelErrorMsg = b2cPhoneModelErrorMsg
      try {
        await this.checkForm()
        await this.checkScreenShot()
      } catch (e) {
        await this.checkScreenShot()
        return Promise.reject()
      }

      if (b2cPhoneModelErrorMsg) return

      try {
        const params = Object.assign({}, this.formEditData)
        params.shotProvId = params.shotProvId !== 0 ? params.shotProvId : ''
        params.shotCityId = params.shotCityId !== 0 ? params.shotCityId : ''
        params.shotAreaId = params.shotAreaId !== 0 ? params.shotAreaId : ''
        params.isSettled = params.isSettled ? 1 : 0
        params.rebateScreenshot = params.rebateScreenshot ? JSON.stringify(params.rebateScreenshot) : params.rebateScreenshot
        params.addOrderScreenshot = params.addOrderScreenshot ? JSON.stringify(params.addOrderScreenshot) : params.addOrderScreenshot
        // 关联订单口令订单号
        if (params.deliveryWordOfCommandBOList) {
          switch (params.businessTag) {
              case 'C2C秒杀':
              case 'B2C秒杀':
                if (params.deliveryWordOfCommandBOList.list.length === 0) {
                  this.$message.error('口令不能为空')
                  return Promise.reject()
                }
                break
          }
          if (params.deliveryWordOfCommandBOList.list.length) {
            params.orderCommand = params.deliveryWordOfCommandBOList.list.map(t => t.wordOfCommand).join(',')
          } else {
            params.orderCommand = ''
          }
          params.addCommandType = params.deliveryWordOfCommandBOList.addCommandType
          if (params.deliveryWordOfCommandBOList.addCommandType === 2) {
            params.beDependentOrderNumber = params.deliveryWordOfCommandBOList.beDependentOrderNumber
            delete params.deliveryWordOfCommandBOList
          } else {
            params.deliveryWordOfCommandBOList = params.deliveryWordOfCommandBOList.list
          }
        } else {
          params.addCommandType = 1
        }
        if (!params.isUnionContribution) {
          params.unionContributionNumber = ''
          params.unionContributionCost = 0
          params.unionContributionProportion = '0.03'
        }
        if (!params.isAmountLink) {
          params.amountLinkCost = 0
        }

        if (Object.prototype.toString.call(params.b2cPhoneModelId) === '[object Array]') {
          if ((params.b2cPhoneModelId || []).length > 1) {
            params.b2cPhoneModelId = params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1]
          } else {
            params.b2cPhoneModelId = ''
            params.b2cPhoneModel = ''
          }
        } else if (!params.b2cPhoneModelId) {
          params.b2cPhoneModelId = ''
          params.b2cPhoneModel = ''
        }

        const res = await $updateOrder(params)
        // this.$refs.form.clearValidate()
        if (res.code === 1) {
          this.$message.success('操作成功')
          return Promise.resolve(this.formEditData)
        } else {
          const message = res.message || ''
          if (message.indexOf('投放次数' || '已达上限') > -1) {
            this.$emit('handleBusinessDialog', this.formEditData.preReleaseVideoTime || '')
          } else {
            this.$message.error(res.message)
          }
          return Promise.reject()
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return Promise.reject()
        }
        this.$message.error(err.message || '网络出错')
        Promise.reject()
      }
    },
    // handleRemoveContract() {
    //   this.formEditData.contractUrl = ''
    // },
    checkFormFileds(fileds) {
      return this.$refs.form.validateField(fileds)
    },
    checkForm() {
      return this.$refs.form.validate()
    },
    addMailInfo(res) {
      this.formEditData = { ...this.formEditData, ...res }
    },
    addConcatInfo(res) {
      this.formEditData = { ...this.formEditData, ...res }
    },
    // uploadSuccess(res) {
    //   if (res.code === 1) {
    //     this.formEditData.contractUrl = res.data.url
    //   } else {
    //     this.$message.error(res.message)
    //   }
    //   this.uploadLoaing = false
    // },
    // uploadBefore() {
    //   this.uploadLoaing = true
    // },
    // fileRemove() {},
    getFundUserList() {
      $getFundUser().then(res => {
        if (res.code === 1) {
          this.fundUserList = res.data
        }
      })
    },

    onOrderDetail(val) {
      this.isEmailEditor = false
      this.isEditConcat = false
      !val && this.$emit('handleOrderDetail')
    },
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    },
    handlechangeService(val) {
    //   const value = val || 0
    //   const serviceCharge = ((this.formEditData.priAddAmount ? this.formEditData.priAddAmount : 0) + value).toFixed(2)
    //   this.$set(this.formEditData, 'priAddAmountIncludeServiceCharge', serviceCharge)
    }
  }
}
</script>
<style lang="scss" scoped>
.union-wrapper{
  .el-form-item, > li {
      width: 33% !important;
    }
}
  .order-info-form {
    .el-form-note {
      ::v-deep {
        .el-form-item__label {
          align-self: flex-start;
        }
      }
    }
    .rebate-img {
      ::v-deep {
         .el-form-item__label {
          align-self: flex-start;
        }
      }
    }
    ::v-deep {
      .el-form-item {
        width: 50%;
        margin-right: 0;
        margin-bottom: 20px;
      }
      &
      .el-input-number,
      .el-select,
      .el-input {
        width: 200px;
      }
      .el-textarea {
        width: 614px;
      }
      .image-slot {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    > li {
      display: inline-flex;
      align-items: center;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      line-height: 20px;
      margin-bottom: 24px;
      > span {
        flex-shrink: 0;
      }
    }
    .el-form-item {
      display: inline-flex;
      align-items: center;

      ::v-deep {
        .el-form-item__content {
          display: inline-flex;
          align-items: center;
        }
        .el-form-item__label {
          flex-shrink: 0;
          display: inline-flex;
          justify-content: flex-end;
          align-self: flex-start;
        }
        $--card-width: 58px;
        .el-upload-list--picture-card {
          display: inline-flex;
          flex-wrap: wrap;
          .el-upload-list__item {
            width: $--card-width;
            height: $--card-width;
            > div {
              width: $--card-width;
              height: $--card-width;
            }
            img {
              object-fit: contain;
            }
          }
          .el-upload-list__item-actions {
            font-size: 18px;
          }
        }
        .el-upload--picture-card {
          flex-shrink: 0;
          width: $--card-width;
          height: $--card-width;
          line-height: $--card-width;
          margin: 0 8px 8px 0;
          .el-icon-plus {
            line-height: $--card-width;
          }
        }
      }
    }
  }

  .order-info-form-line3 {
    .el-form-item, > li{
      width: 33.33%;
    }
  }
  .order-info-form-line4 {
    .el-form-item, > li {
      width: 25%;
    }
  }

  @media screen and (max-width: 1440px) {
    .edit-order-info-form-line4 {
      .el-form-item, > li {
        width: 50%;
      }
    }
  }

  .el-form-item[w-100] {
    width: 100%;
  }
  .contract {
    > a {
    display: inline-flex;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
    }
    > i {
      margin-right: 2px;
      vertical-align: middle;
      cursor: pointer;
      &:hover {
        color: blue;
      }
    }
  }
  .account-box {
    // display: flex;
    // align-items: center;
    line-height: 32px;
    .el-image {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-left: 5px;
      vertical-align: middle;
    }
  }
  .link-margin{
    margin-left: 8px;
  }
  .order-num{
    word-wrap:break-word;
    width: 200px;
  }

  ::v-deep {
    // .pri-charge{
    //    width: 140px !important;
    //   .el-input{
    //     width: 140px !important;
    //   }
    // }
    .pri-Include-charge{
      .el-form-item__label{
        width: 190px !important;
      }
    }
  }
  .pri-radio{
    margin-left: 6px;
    color: #2c64ff;
    line-height: 12px;
    font-size: 12px;
  }
  .iconwenhao{
    margin-left: 4px;
    font-size: 14px;
  }
  .el-upload__tip{
    line-height: 12px;
  }
  .shoot-address{
    ::v-deep{
      .el-select{
        width: 88px !important;
        margin-right: 4px !important;
      }
      .el-input {
        width: 88px !important;
      }
      .el-select-dropdown{
         width: 88px !important;
      }
    }
  }

::v-deep {
  .el-form-item.is-error .el-input__inner, .el-form-item.is-error .el-input__inner:focus, .el-form-item.is-error .el-textarea__inner, .el-form-item.is-error .el-textarea__inner:focus {
    border-color: #FF4746 !important;
  }
}
.vir-cascader-box{
  position: relative;
  height: 32px;
    ::v-deep{
      .el-input{
        input::placeholder {
            color: #595959;
        }
    }
  }
  // .vir-cascader{
  //   position: absolute;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding: 0 6px;
  //   width: 250px;
  //   line-height: 30px;
  //   border-radius: 2px;
  //   color: #595959;
  //   border: 1px solid #d9d9d9;
  //   background: #fff;
  //   &-icon{
  //     color:#BFBFBF ;
  //   }
  // }
  .virtual-cascader{
    margin-top: -10px;
    ::v-deep{
      input{
        border: none!important;;
      }
    }
  }
  // .z-index0{
  //   opacity: 0;
  //   z-index: 0;
  // }
  // .z-index100{
  //   z-index: 100;
  // }
}
.m-b-4{
  margin-bottom: 4px;
}
</style>
