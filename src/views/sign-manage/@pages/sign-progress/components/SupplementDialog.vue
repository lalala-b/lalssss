<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="880px"
    title="补充签约信息"
    :visible.sync="showDialog"
    :before-close="handleClose"
    @close="handleClose"
  >
    <el-tabs v-model="activeTabName">
      <el-tab-pane label="达人基本信息" name="basicMsg">
        <div class="add-form">
          <el-form
            ref="addForm"
            label-width="134px"
            :model="addForm"
            :rules="addFormRules"
            class="norm-form"
          >
            <el-form-item label="账号信息" prop="platType">
              <AccountCard :info="addForm" :show-tags="false">
                <span
                  class="account-id"
                >{{ addForm.platName }}号：{{
                  addForm.uniqueId ||
                    addForm.eid ||
                    addForm.getDataUrl ||
                    '--'
                }}</span>
              </AccountCard>
            </el-form-item>

            <el-row>
              <el-col :span="24">
                <el-form-item label="达人类型" prop="inputTags">
                  <template v-if="addForm.sysAccountTag">
                    <el-tag
                      v-for="tag in addForm.sysAccountTag.split(',')"
                      :key="tag"
                      class="m-r-5 m-b-5"
                      :disable-transitions="false"
                    >{{ tag }}</el-tag>
                  </template>
                  <el-tag
                    v-for="tag in addForm.inputTags"
                    :key="tag"
                    closable
                    class="m-r-5 m-b-5"
                    :disable-transitions="false"
                    @close="handleCloseTag(tag)"
                  >{{ tag }}</el-tag>
                  <el-cascader
                    ref="tag"
                    v-model="tagInputValue"
                    placeholder="请选择达人内容类型"
                    filterable
                    clearable
                    :props="{
                      value: 'tagName',
                      label: 'tagName',
                      children: 'childNodeTags',
                      expandTrigger: 'hover',
                    }"
                    :options="tagList"
                    class="input-new-tag"
                    @change="handleAddTag"
                  />
                  <br><span
                    v-if="inputTagsError"
                    class="errorText"
                  >每个达人最多添加5个达人类型</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="账号状态" prop="accountStatus">
                  <el-select v-model="addForm.accountStatus" clearable>
                    <el-option
                      v-for="item in accountStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="账号标签">
                  <el-button
                    type="primary"
                    class="m-r-5"
                    @click="showAccountFeatureTagsDialog = true"
                  >
                    {{
                      (addForm.accountFeatureTags || []).length
                        ? '编辑'
                        : '添加'
                    }}
                  </el-button>
                  <el-tag
                    v-for="item in addForm.accountFeatureTags || []"
                    :key="item.tagName"
                    class="m-r-5"
                    type="success"
                  >
                    {{ item.tagName }}
                  </el-tag>
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 抖音 -->
            <template v-if="+addForm.platId === 25">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="1-20s报价">
                    <el-input-number
                      v-model="addForm.twentySecondPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="1-20s报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="21-60s报价" prop="sixPrice">
                    <el-input-number
                      v-model="addForm.quotePrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="21-60s报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="60s+报价">
                    <el-input-number
                      v-model="addForm.oversixtySecondPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="60s+报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="全网报价">
                    <el-input-number
                      v-model="addForm.netPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="全网报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- 快手 -->
            <template v-if="+addForm.platId === 26">
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="达人报价"
                    prop="kuaishouTwentySecondPrice"
                  >
                    <el-input-number
                      v-model="addForm.quotePrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="达人报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="全网报价">
                    <el-input-number
                      v-model="addForm.netPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="全网报价"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- b站 -->
            <template v-if="+addForm.platId === 2">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="定制视频" prop="customVideoPrice">
                    <el-input-number
                      v-model="addForm.customVideoPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="定制视频"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="植入视频">
                    <el-input-number
                      v-model="addForm.implantationVideoPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="植入视频"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="直发视频">
                    <el-input-number
                      v-model="addForm.directVideoPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="直发视频"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="转发动态">
                    <el-input-number
                      v-model="addForm.forwardSituationPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="转发动态"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <!-- 小红书 -->
            <template v-if="+addForm.platId === 45">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="视频笔记" prop="videoPrice">
                    <el-input-number
                      v-model="addForm.videoPrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="视频笔记"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="图文笔记">
                    <el-input-number
                      v-model="addForm.picturePrice"
                      :precision="0"
                      :min="0"
                      :max="100000000"
                      label="图文笔记"
                    />
                    元
                    <IconTip
                      :content="CONTENT"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </template>

            <el-row>
              <el-col :span="12">
                <el-form-item label="达人联系方式" prop="phone">
                  <el-input
                    v-model="addForm.phone"
                    clearable
                    maxlength="20"
                    onkeyup="value=value.replace(/\s+/g, '')"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约经纪人">
                  <span>{{ addForm.brokerUserName }}</span>
                  <!-- {{ user.userInfo.realname }} -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="签约时间" prop="rangeTime">
                  <el-date-picker
                    v-model="addForm.rangeTime"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="达人分成比例">
                  <div class="flex">
                    <!-- <el-select v-if="!isEdit" v-model="addForm.outMoneyRatio">
                  <el-option v-for="item in outMoneyRatios" :key="item.val" :label="item.text" :value="item.val" />
                </el-select> -->
                    <!-- <template v-else> -->
                    <el-input-number
                      v-model="addForm.outMoneyRatio"
                      :min="0"
                      :max="100"
                      label="直播报价"
                      :precision="0"
                    />
                    %
                    <!-- </template> -->
                    <IconTip
                      content="达人分成：请按照合同的实际分成比例填写，例如机构与达人的分成为3：7，则达人分成比例填写70%"
                      label=""
                      icon-class="iconwenhao"
                    />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="最多共担返点" prop="maxBearRatio">
                  <el-input-number
                    v-model="addForm.maxBearRatio"
                    :precision="1"
                    :min="0"
                    :max="100"
                    label="最多共担返点"
                  />%
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="购物车权益" prop="cart">
                  <el-button type="primary" @click="showCartDialog = true">{{
                    addForm.cart ? '修改' : '添加'
                  }}</el-button>
                  <span class="hint">{{ addForm.cart }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="信息流权益" prop="msgFlow">
                  <el-button type="primary" @click="showMsgFlowDialog = true">{{
                    addForm.msgFlow ? '修改' : '添加'
                  }}</el-button>
                  <span class="hint">{{ addForm.msgFlow }}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="线下商单权益" prop="offlineOrderInterest">
                  <el-select v-model="addForm.offlineOrderInterest">
                    <el-option :value="1" label="接受线下商单" />
                    <el-option :value="0" label="不接受线下商单" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="对接商务">
                  <el-select
                    v-model="addForm.businessUserId"
                    filterable
                    clearable
                    placeholder="对接商务"
                  >
                    <el-option
                      v-for="item in businessUserList"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="商务微信">
                  <el-input
                    v-model="addForm.businessWechat"
                    placeholder="限长15个字符"
                    show-word-limit
                    maxlength="15"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="是否保量">
                  <el-switch
                    v-model="addForm.quantityFlag"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="addForm.quantityFlag" :span="12">
                <el-form-item label="保量详情">
                  <el-input
                    v-model="addForm.quantityInfo"
                    placeholder="限长10个字符"
                    show-word-limit
                    maxlength="10"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="是否底薪">
                  <el-switch
                    v-model="addForm.baseSalaryFlag"
                    :active-value="1"
                    :inactive-value="0"
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="addForm.baseSalaryFlag" :span="12">
                <el-form-item label="底薪详情">
                  <el-input
                    v-model="addForm.baseSalaryInfo"
                    placeholder="限长10个字符"
                    show-word-limit
                    maxlength="10"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row v-if="+addForm.platId === 25">
              <!-- <el-col :span="24">
            <el-form-item label="是否加入乾派MCN">
              <el-switch v-model="addForm.joinMcnFlag" :active-value="1" :inactive-value="0" />
              <p class="flex-inline tip-red m-l-10">注：完全通过乾派的银行账户收款才选择是已加入乾派MCN</p>
            </el-form-item>
          </el-col> -->
              <el-col :span="24">
                <el-form-item label="加入MCN" prop="mcnCheckList">
                  <el-checkbox-group v-model="addForm.mcnCheckList">
                    <el-checkbox label="是否加入星图MCN" />
                    <el-checkbox label="是否加入抖音MCN" />
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="达人详细地址">
                  <el-input
                    v-model="addForm.darenAddress"
                    class="w-100"
                    placeholder="限长50个字符"
                    show-word-limit
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="过往合作行业类别">
                  <el-tag
                    v-for="tag in addForm.usedFields"
                    :key="tag.fieldId"
                    class="m-r-5 m-b-5"
                    :disable-transitions="false"
                  >{{ tag.fieldName }}</el-tag>
                  <el-tag
                    v-for="(tag, index) in addForm.customFields"
                    :key="tag.fieldId"
                    closable
                    class="m-r-5 m-b-5"
                    :disable-transitions="false"
                    @close="handleRemoveCustom(index)"
                  >{{ tag.fieldName }}</el-tag>
                  <el-select
                    v-model="customInputValue"
                    filterable
                    clearable
                    default-first-option
                    class="input-new-tag"
                    placeholder="+ 行业类别"
                    @change="handleAddCustom"
                  >
                    <el-option
                      v-for="item in fieldList"
                      :key="item.id"
                      :value="item"
                      :label="item.newsContent"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="过往合作客户">
                  <el-input
                    v-model="addForm.cooperationCustomer"
                    class="w-100"
                    placeholder="限长50个字符"
                    show-word-limit
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="24">
                <el-form-item label="备注">
                  <el-input
                    v-model="addForm.remark"
                    placeholder="限长100个字符"
                    type="textarea"
                    show-word-limit
                    maxlength="100"
                    row="8"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button
              type="primary"
              @click="handleConfirmBasicMsg"
            >下一页</el-button>
          </div>

          <CartDialog
            v-if="showCartDialog"
            :show="showCartDialog"
            :data="shoppingCartInterest"
            @close="showCartDialog = false"
            @confirm="handleConfirmCart"
          />

          <MsgFlowDialog
            v-if="showMsgFlowDialog"
            :show="showMsgFlowDialog"
            :data="msgFlowInterest"
            @close="showMsgFlowDialog = false"
            @confirm="handleConfirmMsgFlow"
          />

          <AccountFeatureTagsDialog
            v-if="showAccountFeatureTagsDialog"
            :show="showAccountFeatureTagsDialog"
            :data="addForm.accountFeatureTags"
            :arr="showAccountFeatureTagsArr"
            @close="showAccountFeatureTagsDialog = false"
            @confirm="handleConfirmFeatureTags"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="达人权益信息" name="benefitsMsg" :disabled="disableBenefitsMsg">
        <div class="add-form">
          <el-form
            ref="addBenefitsForm"
            label-width="140px"
            :model="addBenefitsForm"
            :rules="addBenefitsFormRules"
            class="norm-form"
          >
            <el-row>
              <el-col>
                <el-form-item label="达人商务简介" prop="businessProfile">
                  <el-input
                    v-model="addBenefitsForm.businessProfile"
                    type="textarea"
                    autosize
                    maxlength="200"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="24">
              <h4 class="freeTopTitle">免费推广/置顶</h4>
              <el-col :span="12">
                <el-form-item label="Link" prop="freeTopFlag">
                  <el-select v-model="addBenefitsForm.freeTopFlag" clearable>
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="锚点" prop="freeAnchorFlag">
                  <el-select v-model="addBenefitsForm.freeAnchorFlag" clearable>
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="小蓝车" prop="freeBlueCarFlag">
                  <el-select
                    v-model="addBenefitsForm.freeBlueCarFlag"
                    clearable
                  >
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="落地页" prop="freePageFlag">
                  <el-select v-model="addBenefitsForm.freePageFlag" clearable>
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="视频最长保留时间" prop="videoSaveDate">
                  <el-input-number
                    v-model="addBenefitsForm.videoSaveDate"
                    :min="1"
                  />
                  天
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="是否需要供稿直发" prop="straightFeedFlag">
                  <el-select
                    v-model="addBenefitsForm.straightFeedFlag"
                    clearable
                  >
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col>
                <el-form-item label="是否接受二次剪辑" prop="secondFeedFlag">
                  <el-select v-model="addBenefitsForm.secondFeedFlag" clearable>
                    <el-option
                      v-for="item in freePromotionStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <div
              v-if="
                judgeAccountTag.findIndex(
                  (item) =>
                    item === '母婴亲子' ||
                    item === '汽车' ||
                    item === '家居家装',
                ) !== -1
              "
            >
              <h2>品类信息</h2>
              <el-row
                v-if="
                  judgeAccountTag.findIndex((item) => item === '母婴亲子') !==
                    -1
                "
                class="categoryInformationItem"
              >
                <el-col>
                  <el-form-item label="出镜小孩年纪" prop="childAge">
                    <el-input-number
                      v-model="addBenefitsForm.childAge"
                      placeholder="0-18区间"
                      :min="0"
                      :max="18"
                    />
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="是否为孕期妈妈" prop="gravidaFlag">
                    <el-select v-model="addBenefitsForm.gravidaFlag" clearable>
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item
                    label="小孩与产品同框是否加收费用"
                    prop="togetherShowFlag"
                  >
                    <el-select
                      v-model="addBenefitsForm.togetherShowFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row
                v-if="
                  judgeAccountTag.findIndex((item) => item === '汽车') !== -1
                "
                class="categoryInformationItem"
              >
                <el-col>
                  <el-form-item label="是否有驾照" prop="drivingLicenseFlag">
                    <el-select
                      v-model="addBenefitsForm.drivingLicenseFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item label="是否接受保量" prop="ensureFlowFlag">
                    <el-select
                      v-model="addBenefitsForm.ensureFlowFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item
                    label="是否接受差旅自费"
                    prop="travelExpensesFlag"
                  >
                    <el-select
                      v-model="addBenefitsForm.travelExpensesFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item
                    label="可否参加线下活动"
                    prop="offlineActivitiesFlag"
                  >
                    <el-select
                      v-model="addBenefitsForm.offlineActivitiesFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row
                v-if="
                  judgeAccountTag.findIndex((item) => item === '家居家装') !==
                    -1
                "
                class="categoryInformationItem"
              >
                <el-col>
                  <el-form-item
                    label="可否线下打卡门店"
                    prop="offlineClockingFlag"
                  >
                    <el-select
                      v-model="addBenefitsForm.offlineClockingFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col>
                  <el-form-item
                    label="可否安装大小家电"
                    prop="installHomeProductsFlag"
                  >
                    <el-select
                      v-model="addBenefitsForm.installHomeProductsFlag"
                      clearable
                    >
                      <el-option
                        v-for="item in freePromotionStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form>

          <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose">取 消</el-button>
            <el-button
              :loading="btnLoading"
              type="primary"
              @click="handleConfirmBenefitsMsg"
            >确 定</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import { IconTip, AccountCard } from 'components'
import { $getSceneTags } from '@/api'
import {
  $getIntermediaryCondition,
  $getEnableTag
} from '@/api/bussiness-manage'
import { $getEditCondition } from '@/api/sign-contract'
import {
  $getFailInfo,
  $supplementAccount,
  $getEditInfo
} from '@/api/sign-progress'
import AccountFeatureTagsDialog from '../../sign-contract/accounts/_com/accountFeatureTagsDialog.vue'
import CartDialog from '../../sign-contract/accounts/_com/cartDialog.vue'
import MsgFlowDialog from '../../sign-contract/accounts/_com/msgFlowDialog.vue'

export default {
  components: {
    AccountCard,
    IconTip,
    AccountFeatureTagsDialog,
    CartDialog,
    MsgFlowDialog
  },
  props: {
    show: {
      type: Boolean,
      default() {
        return false
      }
    },
    id: {
      type: String,
      default() {
        return ''
      }
    }
  },
  data() {
    const validateTag = (rule, value, callback) => {
      if (!value || (value.length === 0 && !this.addForm.sysAccountTag)) {
        callback(new Error('请添加达人类型'))
      } else {
        callback()
      }
    }

    const validateSixPrice = (rule, value, callback) => {
      if (!this.addForm.quotePrice) {
        callback(new Error('请输入21-60s报价'))
      } else {
        callback()
      }
    }

    const validateksTwentySecondPrice = (rule, value, callback) => {
      if (!this.addForm.quotePrice) {
        callback(new Error('请输入达人报价'))
      } else {
        callback()
      }
    }

    const validateCustomVideoPrice = (rule, value, callback) => {
      if (!this.addForm.customVideoPrice) {
        callback(new Error('请输入定制视频报价'))
      } else {
        callback()
      }
    }

    const validateVideoPrice = (rule, value, callback) => {
      if (!this.addForm.videoPrice) {
        callback(new Error('请输入视频笔记报价'))
      } else {
        callback()
      }
    }

    const validateMcnCheckList = (rule, value, callback) => {
      if (!value.length) {
        callback(new Error('至少选择一个MCN'))
      } else {
        callback()
      }
    }

    return {
      tagInputValue: [],
      inputTagsError: false,
      addFormRules: {
        inputTags: [
          { required: true, validator: validateTag, trigger: 'change' }
        ],
        accountStatus: [
          {
            required: true,
            message: '请选择账号状态',
            trigger: ['blur', 'change']
          }
        ],
        provId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        mechanismId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        rangeTime: [
          { required: true, message: '请选择签约时间', trigger: 'blur' }
        ],
        sixPrice: [
          {
            required: true,
            validator: validateSixPrice,
            trigger: ['blur', 'change']
          }
        ],
        kuaishouTwentySecondPrice: [
          {
            required: true,
            validator: validateksTwentySecondPrice,
            trigger: ['blur', 'change']
          }
        ],
        customVideoPrice: [
          {
            required: true,
            validator: validateCustomVideoPrice,
            trigger: ['blur', 'change']
          }
        ],
        videoPrice: [
          {
            required: true,
            validator: validateVideoPrice,
            trigger: ['blur', 'change']
          }
        ],
        maxBearRatio: [
          {
            required: true,
            message: '请输入最多共担返点',
            trigger: ['blur', 'change']
          }
        ],
        cart: [
          {
            required: true,
            message: '请填写购物车权益',
            trigger: ['blur', 'change']
          }
        ],
        msgFlow: [
          {
            required: true,
            message: '请填写信息流权益',
            trigger: ['blur', 'change']
          }
        ],
        offlineOrderInterest: [
          { required: true, message: '请选择线下商单权益', trigger: 'change' }
        ],
        mcnCheckList: [
          {
            required: true,
            validator: validateMcnCheckList,
            trigger: 'change'
          }
        ]
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
      },
      addBenefitsFormRules: {
        freeTopFlag: [
          {
            required: true,
            message: '请选择是否需要link',
            trigger: 'change'
          }
        ],
        freeAnchorFlag: [
          {
            required: true,
            message: '请选择是否需要锚点',
            trigger: 'change'
          }
        ],
        freeBlueCarFlag: [
          {
            required: true,
            message: '请选择是否需要小蓝车',
            trigger: 'change'
          }
        ],
        freePageFlag: [
          {
            required: true,
            message: '请选择是否需要落地页',
            trigger: 'change'
          }
        ],
        videoSaveDate: [
          {
            required: true,
            message: '请输入视频最长保留时间',
            trigger: 'change'
          }
        ],
        straightFeedFlag: [
          {
            required: true,
            message: '请选择是否需要供稿直发',
            trigger: 'change'
          }
        ],
        secondFeedFlag: [
          {
            required: true,
            message: '请选择是否需要二次剪辑',
            trigger: 'change'
          }
        ],
        childAge: [
          {
            required: true,
            message: '请选择出镜小孩的年纪',
            trigger: 'change'
          }
        ],
        gravidaFlag: [
          {
            required: true,
            message: '请选择是否为孕期妈妈',
            trigger: 'change'
          }
        ],
        togetherShowFlag: [
          {
            required: true,
            message: '请选择小孩与产品同框是否加收费用',
            trigger: 'change'
          }
        ],
        drivingLicenseFlag: [
          {
            required: true,
            message: '请选择是否有驾照',
            trigger: 'change'
          }
        ],
        ensureFlowFlag: [
          {
            required: true,
            message: '请选择是否接受保量',
            trigger: 'change'
          }
        ],
        travelExpensesFlag: [
          {
            required: true,
            message: '请选择是否接受差旅自费',
            trigger: 'change'
          }
        ],
        offlineActivitiesFlag: [
          {
            required: true,
            message: '请选择是否参加线下活动',
            trigger: 'change'
          }
        ],
        offlineClockingFlag: [
          {
            required: true,
            message: '请选择可否线下打卡门店',
            trigger: 'change'
          }
        ],
        installHomeProductsFlag: [
          {
            required: true,
            message: '请选择可否安装大小家电',
            trigger: 'change'
          }
        ]
      },
      customInputValue: '',
      addForm: {
        oversixtySecondPrice: null,
        outMoneyRatio: null,
        quotePrice: null,
        netPrice: null,
        twentySecondPrice: null,
        customVideoPrice: null,
        implantationVideoPrice: null,
        directVideoPrice: null,
        forwardSituationPrice: null,
        videoPrice: null,
        picturePrice: null,
        platName: '',
        uniqueId: '',
        eid: '',
        getDataUrl: '',
        inputTags: [],
        phone: '',
        brokerUserName: '',
        businessUserId: null,
        businessWechat: null,
        quantityFlag: 0,
        quantityInfo: null,
        baseSalaryFlag: 0,
        baseSalaryInfo: null,
        joinMcnFlag: 0,
        darenAddress: null,
        usedFields: [],
        accountStatus: '',
        maxBearRatio: 0,
        cart: '',
        msgFlow: '',
        offlineOrderInterest: '',
        customFields: [],
        cooperationCustomer: '',
        remark: '',
        rangeTime: '',
        mcnCheckList: []
      },
      addBenefitsForm: {
        businessProfile: '',
        freeTopFlag: null,
        freeAnchorFlag: null,
        freeBlueCarFlag: null,
        freePageFlag: null,
        videoSaveDate: 1,
        straightFeedFlag: null,
        secondFeedFlag: null,
        childAge: 1,
        gravidaFlag: null,
        togetherShowFlag: null,
        drivingLicenseFlag: null,
        ensureFlowFlag: null,
        travelExpensesFlag: null,
        offlineActivitiesFlag: null,
        offlineClockingFlag: null,
        installHomeProductsFlag: null
      },
      tagList: [],
      btnLoading: false,
      belongs: {
        conf: {
          placeholder: '所属机构',
          filterable: true
        },
        optionLabelKey: 'mcnName',
        optionValKey: 'id',
        data: []
      },
      businessUserList: [],
      fieldList: [],
      CONTENT:
        '账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。',
      accountStatusList: [
        {
          value: 0,
          label: '上架'
        },
        {
          value: 1,
          label: '下架'
        }
      ],
      showAccountFeatureTagsDialog: false,
      showAccountFeatureTagsArr: [],
      showCartDialog: false,
      shoppingCartInterest: {},
      showMsgFlowDialog: false,
      msgFlowInterest: {},
      activeTabName: 'basicMsg',
      freePromotionStatusList: [
        {
          value: 0,
          label: '否'
        },
        {
          value: 1,
          label: '是'
        },
        {
          value: 2,
          label: '未知'
        }
      ],
      judgeAccountTag: [], // 用于判断当前选择的达人类型，展示对应的达人权益信息的品类信息填写
      formParams: {}, // 最终入参的表单数据
      disableBenefitsMsg: true // 禁用达人权益信息的tab页
    }
  },
  computed: {
    ...mapGetters(['user']),
    showDialog: {
      get() {
        return this.show
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  watch: {
    'addForm.inputTags'(val) {
      // if ((val || []).length >= 5) {
      //   this.inputTagsError = true
      // } else {
      this.inputTagsError = false
      // }
    }
  },
  async created() {
    this.getCondition()
    this.getPlatPrice()

    $getSceneTags({
      platId: 0,
      tagType: 2,
      operationScene: ['signEdit']
    }).then(({ code, data }) => {
      if (+code === 1) {
        this.showAccountFeatureTagsArr = data.signEdit || []
      }
    })

    this.addForm = {
      ...this.addForm,
      searchType: '1',
      brokerUserName: this.user.userInfo.realname,
      brokerUserId: this.user.userInfo.id
    }
    try {
      const {
        code,
        message,
        data: resData
      } = await $getFailInfo({ accountId: this.id })
      if (+code === 1) {
        this.addForm = {
          ...this.addForm,
          ...resData,
          accountId: this.id,
          // 过滤出绿色标签和新签账号
          accountFeatureTags: (resData.accountTagInfoBOList || []).filter(
            (item) =>
              +(item.tagStyle || {}).styleCode === 2 &&
              item.tagName !== '新签账号'
          ),
          offlineOrderInterest:
            +(resData.talentInterest || {}).offlineOrderInterest === 2
              ? ''
              : (resData.talentInterest || {}).offlineOrderInterest
        }
        this.$nextTick(() => {
          this.getEnableTag()
        })
        const signContractDate = this.addForm.signContractDate
          ? this.addForm.signContractDate
          : ''
        const signContractDateEnd = this.addForm.signContractDateEnd
          ? this.addForm.signContractDateEnd
          : ''

        if (this.addForm.signContractDate) {
          this.$set(this.addForm, 'signContractDate', signContractDate)
          this.$set(this.addForm, 'signContractDateEnd', signContractDateEnd)
        }
      } else {
        this.$message.error(message)
      }
    } catch (e) {
      this.$message.error(e)
    }
  },
  methods: {
    handleClose() {
      this.$emit('onClose')
    },
    handleAddTag(val) {
      this.judgeAccountTag = [...this.judgeAccountTag, val[0]]
      // this.judgeAccountTag = [...new Set(arr)]
      if ((this.addForm.inputTags || []).length >= 5) {
        this.inputTagsError = true
        this.$refs.addForm.validateField('inputTags')
        this.tagInputValue = []
        return
      }
      this.inputTagsError = false

      const tagItem = this.tagList.find(
        (item) => item.tagName === (val || [])[0]
      )
      if ((tagItem.childNodeTags || []).length && (val || []).length === 1) {
        // this.$message.info('限长4个字符(仅中英文)')
        this.$refs.addForm.validateField('inputTags')
        this.tagInputValue = []
        return
      }
      if (this.addForm.inputTags.indexOf(val[val.length - 1]) === -1) {
        if (
          (this.addForm.sysAccountTag || '')
            .split(',')
            .indexOf(val[val.length - 1]) === -1
        ) {
          this.addForm.inputTags.push(val[val.length - 1])
        }
      }

      this.$refs.addForm.validateField('inputTags')
      this.tagInputValue = []
    },

    handleAddCustom(val) {
      this.customInputValue = ''
      if (this.addForm.customFields.find((item) => item.fieldId === val.id)) {
        return
      }
      if (this.addForm.usedFields.find((item) => item.fieldId === val.id)) {
        return
      }
      this.addForm.customFields.push({
        fieldId: val.id,
        fieldName: val.newsContent
      })
    },

    handleRemoveCustom(index) {
      this.addForm.customFields.splice(index, 1)
    },

    getEnableTag() {
      $getEnableTag({ platId: this.addForm.platId }).then((res) => {
        if (+res.code === 1) {
          this.tagList = res.data || []
        }
      })
    },

    getCondition() {
      $getIntermediaryCondition().then((res) => {
        if (res.code === 1) {
          // this.tagList = res.data.tagValues
          this.belongs.data = res.data.belongs
        }
      })
      $getEditCondition().then((res) => {
        if (res.code === 1) {
          this.businessUserList = res.data.businessUserList
          this.fieldList = res.data.fieldList
        }
      })
    },

    handleConfirmFeatureTags(arr) {
      this.showAccountFeatureTagsDialog = false
      this.addForm.accountFeatureTags = arr
    },

    // 删除达人类型
    handleCloseTag(tag) {
      this.addForm.inputTags.splice(this.addForm.inputTags.indexOf(tag), 1)
      this.$refs.addForm.validateField('inputTags')

      // 只存在子节点的达人类型数据
      let childList = []
      this.tagList.forEach((item) => {
        if ((item.childNodeTags || []).length) {
          childList.push(item.childNodeTags)
        } else {
          childList.push(item)
        }
      })
      childList = childList.flat(Infinity)
      // 删除的达人类型子节点数据对应的父md5Id
      const parentMd5Id = childList.find(item => item.tagName === tag)?.parentMd5Id || ''
      // 删除的达人类型子节点对应的父节点tagName
      const parentTagName = this.tagList.find(item => item.md5Id === parentMd5Id)?.tagName || ''
      // 该父节点在judgeAccountTag数组中的index
      const indexOfJudgeAccountTag = this.judgeAccountTag.indexOf(parentTagName)

      // 当存在删除的达人类型数据存在时，才删除
      if (indexOfJudgeAccountTag !== -1) {
        this.judgeAccountTag.splice(indexOfJudgeAccountTag, 1)
      }
    },

    handleConfirmCart(data) {
      this.shoppingCartInterest = {
        ...data
      }

      let cart = ''
      const {
        isFree,
        commissionRatio,
        isHasCommission,
        trailerAdditionalPrice
      } = data
      cart = [
        !+isFree ? '付费' : +isFree === 1 ? '免费' : '',
        +isFree !== 1 ? `${trailerAdditionalPrice}元` : '',
        isHasCommission ? '有佣金要求' : '无佣金要求',
        isHasCommission ? `${commissionRatio || 0}%` : ''
      ]
        .filter((item) => item !== '')
        .join('-')

      this.addForm = {
        ...this.addForm,
        cart
      }

      this.showCartDialog = false

      this.$nextTick(() => {
        this.$refs.addForm.validateField('cart')
      })
    },

    handleConfirmMsgFlow(data) {
      this.msgFlowInterest = {
        ...data
      }

      let msgFlow = ''

      const { isFree, msgAdditionalPrice, msgDuration } = data

      msgFlow = [
        !+isFree ? '付费' : +isFree === 1 ? '免费' : '',
        +isFree !== 1 ? `${msgAdditionalPrice}元` : '',
        `${
          !+msgDuration
            ? '0'
            : +msgDuration === 1
            ? '1-3'
            : +msgDuration === 2
            ? '2-4'
            : '6-12'
        }个月`
      ]
        .filter((item) => item !== '')
        .join('-')

      this.addForm = {
        ...this.addForm,
        msgFlow
      }

      this.showMsgFlowDialog = false

      this.$nextTick(() => {
        this.$refs.addForm.validateField('msgFlow')
      })
    },

    // 获取平台的报价信息
    async getPlatPrice() {
      try {
        const {
          code,
          data,
          message = ''
        } = await $getEditInfo({ accountId: +this.id })
        this.loading = false
        if (+code === 1) {
          this.addForm = {
            ...this.addForm,
            ...data.updateSignContractAccountPriceRequest,
            quotePrice: data.updateSignContractAccountPriceRequest.sixPrice
          }
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.$message.error(e?.message)
      }
    },

    // 确认达人基本信息
    handleConfirmBasicMsg() {
      this.$refs['addForm'].validate(async(valid) => {
        if (!this.addForm.cart) {
          return this.$message.error('请填写购物车权益')
        }
        if (!this.addForm.msgFlow) {
          return this.$message.error('请填写信息流权益')
        }
        if (valid) {
          const params = { ...this.addForm }
          params.userId = params.eid
          params.sixPrice = params.quotePrice

          if (!params.mcnCheckList.length) {
            params.xingtuMcnTag = 0
            params.douyinMcnTag = 0
          }
          if (
            params.mcnCheckList.length === 1 &&
            params.mcnCheckList.includes('是否加入抖音MCN')
          ) {
            params.xingtuMcnTag = 0
            params.douyinMcnTag = 1
          }
          if (
            params.mcnCheckList.length === 1 &&
            params.mcnCheckList.includes('是否加入星图MCN')
          ) {
            params.xingtuMcnTag = 1
            params.douyinMcnTag = 0
          }
          if (params.mcnCheckList.length === 2) {
            params.xingtuMcnTag = 1
            params.douyinMcnTag = 1
          }

          delete params.mcnCheckList

          // params.tagValue = this.addForm.inputTags.join(',')
          if (params.rangeTime) {
            params.signContractDate = params.rangeTime[0]
            params.signContractDateEnd = params.rangeTime[1]
            delete params.rangeTime
          }

          let list = []
          this.tagList.forEach((item) => {
            if ((item.childNodeTags || []).length) {
              list.push(item.childNodeTags)
            } else {
              list.push(item)
            }
          })

          list = list.flat(Infinity)
          params.accountTags = [
            ...this.addForm.inputTags.map((item) => {
              return {
                tagName: item,
                md5Id:
                  (list.find((it) => it.tagName === item) || {}).md5Id || '',
                tagSource: 0
              }
            }),
            ...params.accountFeatureTags
          ]

          params.shoppingCartInterest = this.shoppingCartInterest
          params.msgFlowInterest = this.msgFlowInterest
          params.offlineBusinessOrderInterest = params.offlineOrderInterest
          delete params.offlineOrderInterest
          delete params.talentInterest
          delete params.accountFeatureTags

          const reqParams = {
            ...params,
            businessUserName:
              (
                this.businessUserList.find(
                  (item) => +item.userId === +this.addForm.businessUserId
                ) || {}
              ).userName || ''
          }
          this.formParams = reqParams

          this.activeTabName = 'benefitsMsg'
          this.disableBenefitsMsg = false
        }
      })
    },

    // 确认达人权益信息
    handleConfirmBenefitsMsg() {
      this.$refs['addBenefitsForm'].validate(async(isValidate) => {
        try {
          if (isValidate) {
            // 最终的入参表单数据
            this.formParams = {
              ...this.formParams,
              ...this.addBenefitsForm
            }
            this.btnLoading = true
            const { code, message } = await $supplementAccount({
              ...this.formParams
            })
            this.btnLoading = false
            if (+code === 1) {
              this.$emit('getAll')
              this.$emit('onClose')
              this.$message.success('签约成功')
            } else {
              this.$emit('onClose')
              this.$message.error(message)
            }
          }
        } catch (e) {
          this.btnLoading = false
          this.$emit('onClose')
          this.$message.error(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.add-form {
  margin-top: 30px;

  .freeTopTitle {
    padding-left: 48px;
    margin-bottom: 10px;
  }

  .categoryInformationItem {
    background: rgba(0, 0, 0, 0.2);
    margin: 10px 0;
    padding-top: 24px;
    padding-left: 10px;
  }
}

.account-id {
  line-height: 1.2;
  color: $--color-text-secondary;
}

.el-date-editor {
  width: 250px;
}

.el-input__inner {
  padding-right: 10px !important;
}

::v-deep {
}

.errorText {
  color: #ff0000;
  font-size: 12px;
}

.hint {
  margin-left: 6px;
  color: #999;
  font-size: 12px;
}
</style>
