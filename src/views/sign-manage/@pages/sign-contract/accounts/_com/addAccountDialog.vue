<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="980px"
    :title="dialogTitle"
    :close-on-click-modal="false"
    :visible.sync="show"
    @close="onCancel"
  >
    <el-tabs v-model="activeTabName" @tab-click="handleChangeTab">
      <el-tab-pane label="达人基本信息" name="basicMsg">
        <div class="add-form">
          <el-form
            ref="addForm"
            label-width="134px"
            :model="addForm"
            :rules="addFormRules"
            class="norm-form"
          >
            <template v-if="isEdit || from === 'recommend'">
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
            </template>

            <template v-else>
              <el-form-item v-if="!isEdit" label="平台名称">
                <span>{{
                  +platId === 25
                    ? '抖音'
                    : +platId === 26
                      ? '快手'
                      : +platId === 2
                        ? 'B站'
                        : +platId === 45
                          ? '小红书'
                          : ''
                }}</span>
                <div
                  v-if="addForm.platId"
                  class="plat-info flex flex-align-center"
                >
                  <img
                    :src="(platMap[addForm.platId] || {}).plat_logo"
                    class="m-r-5"
                    alt
                  >账号授权,请输入平台下分享出来的链接
                </div>
              </el-form-item>
              <el-form-item v-if="userInfo" class="mr90">
                <img :src="userInfo.avatar_uri" style="width: 100px" alt="">
                <p>{{ userInfo.user_name }}</p>
              </el-form-item>

              <el-form-item
                v-if="+addForm.platId === 25 || +addForm.platId === 26"
                label="账号检索"
              >
                <el-select
                  v-model="addForm.eid"
                  class="account-search"
                  filterable
                  remote
                  reserve-keyword
                  placeholder="请输入关键词"
                  :remote-method="remoteMethod"
                  :loading="accountLoading"
                  :popper-append-to-body="false"
                  no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
                  style="width: 100%"
                  @change="handleAccountChange"
                >
                  <el-option
                    v-for="item in accountList"
                    :key="item.user_id"
                    :label="item.user_name"
                    :value="item.eid"
                  >
                    <div class="flex">
                      <img class="account-img" :src="item.avatar_uri" alt="">
                      <div
                        class="account-info flex flex-dir-col flex1 flex-justify-center"
                      >
                        <p class="account-text1 account-name">
                          {{ item.user_name }}
                        </p>
                        <p class="account-text2">ID:{{ item.eid }}</p>
                      </div>
                      <div
                        class="account-info account-fans flex flex-dir-col flex-justify-center"
                      >
                        <p class="account-text1">粉丝量</p>
                        <p class="account-text2">
                          {{ item.fans_num | toThousandsW }}
                        </p>
                      </div>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="URL" prop="userUrl">
                <div class="flex">
                  <el-input
                    v-model="addForm.userUrl"
                    class="flex1"
                    autocomplete="off"
                    @change="handleUserUrl"
                  />
                  <el-button
                    :loading="empowerLoading"
                    :disabled="empowerDisabled"
                    size="small"
                    style="margin-left: 10px"
                    @click="empower"
                  >授权</el-button>
                </div>
              </el-form-item>
            </template>
            <el-row>
              <el-col :span="24">
                <el-form-item label="达人类型" prop="inputTags">
                  <template v-if="addForm.sysAccountTag">
                    <el-tag
                      v-for="tag in (addForm.sysAccountTag || '').split(',')"
                      :key="tag"
                      class="m-r-5 m-b-5"
                      :disable-transitions="false"
                    >{{ tag }}</el-tag>
                  </template>
                  <el-tag
                    v-for="tag in addForm.inputTags || []"
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
                  <!-- <el-select
                      ref="tag"
                      v-model="tagInputValue"
                      filterable
                      clearable
                      allow-create
                      default-first-option
                      class="input-new-tag"
                      placeholder="限长4个字符(仅中英文)"
                      @change="handleAddTag"
                    >
                      <el-option
                        v-for="item in tagList"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select> -->
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="账号状态" prop="accountStatus">
                  <el-select
                    v-model="addForm.accountStatus"
                    clearable
                    @change="handleChangeAccountStatus"
                  >
                    <el-option
                      v-for="item in accountStatusList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>

              <el-col v-if="showCoopStatus" :span="12">
                <el-form-item label="合作状态" prop="coopStatus">
                  <el-radio-group v-model="addForm.coopStatus">
                    <el-radio :label="1">解约</el-radio>
                    <el-radio :label="2">拉黑</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
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
                  <!-- <el-select
                      v-model="addForm.accountStatus"
                    >
                      <el-option
                        v-for="item in accountStatusList"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select> -->
                </el-form-item>
              </el-col>

              <el-col v-if="isEdit" :span="12">
                <el-form-item label="解约时间" prop="cancelContractTime">
                  {{ addForm.cancelContractTime || '--' }}
                </el-form-item>
              </el-col>
            </el-row>

            <!-- 抖音 -->
            <template v-if="+platId === 25">
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
            <template v-if="+platId === 26">
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
            <template v-if="+platId === 2">
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
            <template v-if="+platId === 45">
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
                <el-form-item label="达人等级" prop="signAccountLevel">
                  <!-- 快手和小红书平台保持原来的达人等级交互逻辑 -->
                  <template v-if="+platId === 26 || +platId === 45">
                    <template>
                      {{ addForm.signAccountLevel || '--' }}
                      <el-button type="primary" @click="showLevelDialog = true">{{
                        addForm.signAccountLevel ? '修改等级' : '添加等级'
                      }}</el-button>
                    </template>
                  </template>
                  <!-- 抖音和B站直接使用后端自动计算的等级 -->
                  <span v-else>{{ addForm.signAccountLevel || '--' }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="达人联系方式" prop="phone">
                  <el-input v-model="addForm.phone" clearable maxlength="20" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="签约经纪人">
                  <el-select
                    v-if="isEdit"
                    v-model="addForm.brokerUserId"
                    @change="handleBrokerUser"
                  >
                    <el-option
                      v-for="item in users"
                      :key="item.val"
                      :label="item.text"
                      :value="item.val"
                    />
                  </el-select>
                  <span v-else>{{ addForm.brokerUserName }}</span>
                  <!-- {{ user.userInfo.realname }} -->
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <!-- <el-form-item label="签约时间" prop="signContractDate">
                    <div class="flex time-wrapper">
                      <el-date-picker v-model="addForm.signContractDate" value-format="yyyy-MM-dd" />
                      至
                      <el-date-picker v-model="addForm.signContractDateEnd" value-format="yyyy-MM-dd" />
                    </div>
                  </el-form-item> -->

                <el-form-item label="签约时间" prop="signContractDateArr">
                  <el-date-picker
                    v-model="addForm.signContractDateArr"
                    class="datePicker"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="达人分成比例" prop="outMoneyRatio">
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
            <!-- <template v-if="isEdit"> -->
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
            <!-- </template> -->
            <!-- <template v-else>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="是否保量">
                      <el-switch v-model="addForm.quantityFlag" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否底薪">
                      <el-switch v-model="addForm.baseSalaryFlag" :active-value="1" :inactive-value="0" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </template> -->
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
            <el-button @click="onCancel">取 消</el-button>
            <el-button
              :loading="btnLoading"
              type="primary"
              @click="dialogConfirm"
            >下一页</el-button>
          </div>
        </div>

        <LevelDialog
          :show="showLevelDialog"
          :data="levelMessage"
          :account-id="accountId"
          @close="showLevelDialog = false"
          @confirm="handleUpdateLevel"
        />

        <AccountFeatureTagsDialog
          v-if="showAccountFeatureTagsDialog"
          :show="showAccountFeatureTagsDialog"
          :data="addForm.accountFeatureTags"
          :arr="showAccountFeatureTagsArr"
          @close="showAccountFeatureTagsDialog = false"
          @confirm="handleConfirmFeatureTags"
        />

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
      </el-tab-pane>

      <el-tab-pane label="达人权益信息" name="benefitsMsg">
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
            <el-button @click="onCancel">取 消</el-button>
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
import dayjs from 'dayjs'
import request from '@/http'
import { PYTHON_HOST as HOST } from '@/const'
import {
  $getUserAccount,
  $getBaseInfo,
  $findEvaluateInfo
} from '@/api/account-manage'
import {
  $getIntermediaryCondition,
  $getEnableTag
} from '@/api/bussiness-manage'
import {
  $addSignContractAccount,
  $addSignContractAccountTikTok,
  $addSignAccountKuaiShou,
  $addSignAccountBli,
  $addSignAccountRedBook,
  $editSignContractAccount,
  $editSignContractAccountTikTok,
  $editSignAccountKuaiShou,
  $editSignAccountBli,
  $editSignAccountRedBook,
  $getEditCondition
} from '@/api/sign-contract'
import { $supplementAccount } from '@/api/sign-progress'
import { $getSceneTags } from '@/api'
import { copy } from '@/utils'
import { IconTip, AccountCard } from 'components'
import AccountFeatureTagsDialog from './accountFeatureTagsDialog.vue'
import LevelDialog from './levelDialog.vue'
import CartDialog from './cartDialog.vue'
import MsgFlowDialog from './msgFlowDialog.vue'

export default {
  components: {
    IconTip,
    AccountCard,
    LevelDialog,
    AccountFeatureTagsDialog,
    CartDialog,
    MsgFlowDialog
  },
  props: {
    users: {
      type: Array,
      default() {
        return []
      }
    },
    platList: {
      type: Array,
      default() {
        return []
      }
    },
    editRow: {
      type: Object,
      default() {
        return {}
      }
    },
    editTags: {
      type: Array,
      default() {
        return []
      }
    },
    platId: {
      type: Number,
      default: 0
    },
    // outMoneyRatios: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    accountId: {
      type: Number,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    },
    accountInfo: {
      type: Object,
      default() {
        return {
          platName: '',
          accountImg: '',
          accountName: ''
        }
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
    const validateTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择开始时间'))
      } else if (value && !this.addForm.signContractDateEnd) {
        callback(new Error('请选择结束时间'))
      } else {
        callback()
      }
    }

    const validateSixPrice = (rule, value, callback) => {
      if (
        this.addForm.quotePrice === null ||
        this.addForm.quotePrice === undefined
      ) {
        callback(new Error('请输入21-60s报价'))
      } else if (!this.addForm.quotePrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateksTwentySecondPrice = (rule, value, callback) => {
      if (
        this.addForm.quotePrice === null ||
        this.addForm.quotePrice === undefined
      ) {
        callback(new Error('请输入达人报价'))
      } else if (!this.addForm.quotePrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateCustomVideoPrice = (rule, value, callback) => {
      if (
        this.addForm.customVideoPrice === null ||
        this.addForm.customVideoPrice === undefined
      ) {
        callback(new Error('请输入定制视频报价'))
      } else if (!this.addForm.customVideoPrice) {
        callback(new Error('请输入大于0的整数'))
      } else {
        callback()
      }
    }

    const validateVideoPrice = (rule, value, callback) => {
      if (
        this.addForm.videoPrice === null ||
        this.addForm.videoPrice === undefined
      ) {
        callback(new Error('请输入视频笔记报价'))
      } else if (!this.addForm.videoPrice) {
        callback(new Error('请输入大于0的整数'))
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
      addFormRules: {
        platId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        userUrl: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        eid: [{ required: true, message: '请选择账号', trigger: 'blur' }],
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
        signContractDate: [
          { required: true, validator: validateTime, trigger: 'change' }
        ],
        signContractDateArr: [
          { required: true, message: '请选择签约时间', trigger: 'change' }
        ],
        outMoneyRatio: [
          {
            required: true,
            message: '请输入达人分成比例',
            trigger: ['blur', 'change']
          }
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
        signAccountLevel: [
          {
            required: true,
            message: '请填写达人等级',
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
        ],
        coopStatus: [
          { required: true, message: '请选择合作状态', trigger: 'change' }
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
      tagInputValue: [],
      inputTagsError: false,
      customInputValue: '',
      addForm: {
        signContractDate: null,
        signContractDateArr: [],
        signContractDateEnd: null,
        oversixtySecondPrice: null,
        quotePrice: undefined,
        netPrice: null,
        twentySecondPrice: null,
        signAccountLevel: '',
        outMoneyRatio: null,
        livePrice: null,
        searchType: '1',
        customVideoPrice: undefined,
        implantationVideoPrice: null,
        directVideoPrice: null,
        forwardSituationPrice: null,
        videoPrice: undefined,
        picturePrice: null,
        accountId: '',
        platId: '',
        tagValue: '',
        mechanismId: '',
        userUrl: '',
        phone: '',
        remark: '',
        rebate: '',
        brokerUserName: '',
        brokerUserId: '',
        cooperationCustomer: '',
        businessUserId: null,
        businessWechat: null,
        quantityInfo: null,
        baseSalaryInfo: null,
        inputTags: [],
        quantityFlag: 0,
        baseSalaryFlag: 0,
        joinMcnFlag: 0,
        darenAddress: null,
        customFields: [],
        usedFields: [],
        accountStatus: '',
        maxBearRatio: undefined,
        cart: '',
        msgFlow: '',
        offlineOrderInterest: '',
        mcnCheckList: [],
        coopStatus: null,
        cancelContractTime: ''
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
      platMap: {},
      platInfo: [],
      accountList: [],
      tagList: [],
      userInfo: null,
      empowerDisabled: false,
      accountLoading: false,
      empowerLoading: false,
      showAddMeduiuDialog: false,
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
      showLevelDialog: false,
      levelMessage: {},
      CONTENT:
        '账号报价来源于星图等接单平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。',
      hasLevelMessage: false,
      // 上架下架状态
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
      BLevel: ['S', 'A', 'B', 'C'],
      showCoopStatus: false,
      judgeAccountTag: [], // 用于判断当前选择的达人类型，展示对应的达人权益信息的品类信息填写
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
      formParams: {} // 最终入参的表单数据
    }
  },
  computed: {
    ...mapGetters(['user']),
    dialogTitle() {
      return this.isEdit ? '编辑' : '添加'
    },
    show: {
      get() {
        return this.value
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
  created() {
    this.showAccountFeatureTagsArr = this.editTags || []

    if (this.isEdit) {
      const form = this.initEditFormatData(this.editRow)
      // 回显达人基本信息
      Object.assign(this.addForm, form)
      // 回显达人权益编辑信息
      Object.keys(this.addBenefitsForm).forEach(item => {
        this.$set(this.addBenefitsForm, item, form[item])
      })
    } else {
      this.addForm = {
        ...this.addForm,
        searchType: '1',
        brokerUserName: this.user.userInfo.realname,
        brokerUserId: this.user.userInfo.id,
        platId: this.platId
      }
    }
    if (!this.isEdit || !this.accountId) {
      this.getPlatList()
    }
    this.getCondition()

    if (this.isEdit) {
      //  非B站和抖音的平台才调取接口获取等级信息
      if (+this.platId !== 2 && +this.platId !== 25) {
        this.findEvaluateInfo()
      }

      this.shoppingCartInterest =
        (this.editRow.talentInterest || {}).cartInterest || {}

      const cartInterest = (this.editRow.talentInterest || {}).cartInterest
      this.addForm.cart = cartInterest
        ? [
            !+cartInterest.isFree
              ? '付费'
              : +cartInterest.isFree === 1
              ? '免费'
              : '',
            +cartInterest.isFree !== 1
              ? `${cartInterest.trailerAdditionalPrice}元`
              : '',
            cartInterest.isHasCommission ? '有佣金要求' : '无佣金要求',
            cartInterest.isHasCommission
              ? `${cartInterest.commissionRatio || 0}%`
              : ''
          ]
            .filter((item) => item !== '')
            .join('-')
        : ''

      this.msgFlowInterest =
        (this.editRow.talentInterest || {}).msgFlowInterest || {}

      const msgFlowInterest = (this.editRow.talentInterest || {})
        .msgFlowInterest
      this.addForm.msgFlow = msgFlowInterest
        ? [
            !+msgFlowInterest.isFree
              ? '付费'
              : +msgFlowInterest.isFree === 1
              ? '免费'
              : '',
            +msgFlowInterest.isFree !== 1
              ? `${msgFlowInterest.msgAdditionalPrice}元`
              : '',
            `${
              !+msgFlowInterest.msgDuration
                ? '0'
                : +msgFlowInterest.msgDuration === 1
                ? '1-3'
                : +msgFlowInterest.msgDuration === 2
                ? '2-4'
                : '6-12'
            }个月`
          ]
            .filter((item) => item !== '')
            .join('-')
        : ''
    } else {
      this.addForm.signAccountLevel = ''
    }

    this.$bus.$on('updateMediumOrg', this.getCondition)
  },
  beforeDestroy() {
    this.$bus.$off('updateMediumOrg')
  },
  methods: {
    async findEvaluateInfo() {
      const { code, data } = await $findEvaluateInfo({
        accountId: this.accountId
      })
      if (+code === 1) {
        this.hasLevelMessage = !!Object.keys(data || {}).length
        this.levelMessage = data || {}
        this.addForm.signAccountLevel = (data || {}).accountLevel
      }
    },

    async handleUpdateLevel(data) {
      this.levelMessage = {
        ...this.levelMessage,
        ...data
      }

      this.addForm = {
        ...this.addForm,
        signAccountLevel: data.accountLevel
      }

      // await this.findEvaluateInfo()
      this.showLevelDialog = false
      this.$nextTick(() => {
        this.$refs.addForm.validateField('signAccountLevel')
      })
    },

    limitTag() {
      const tag = this.$refs.tag
      tag.query =
        tag.previousQuery =
        tag.selectedLabel =
          tag.selectedLabel.replace(/[^\u4E00-\u9FA5A-Za-z]/g, '')
      if (tag.selectedLabel.length >= 4) {
        tag.previousQuery =
          tag.query =
          tag.selectedLabel =
            tag.selectedLabel.slice(0, 4)
      }
    },
    handleBrokerUser(id, e) {
      for (let index = 0; index < this.users.length; index++) {
        const element = this.users[index]
        if (element.val === id) {
          this.addForm.brokerUserName = element.text
          return
        }
      }
    },
    initEditFormatData(data) {
      if (data.douyinMcnTag) {
        data.mcnCheckList = ['是否加入抖音MCN']
      }
      if (data.xingtuMcnTag) {
        data.mcnCheckList = ['是否加入星图MCN']
      }
      if (data.douyinMcnTag && data.xingtuMcnTag) {
        data.mcnCheckList = ['是否加入抖音MCN', '是否加入星图MCN']
      }
      // if (data.tagValue) {
      data.signContractDateArr = [
        data.signContractDate || '',
        data.signContractDateEnd || ''
      ]
      data.inputTags = (data.accountTagInfoBOList || [])
        .filter((item) => +(item.tagStyle || {}).styleCode === 0)
        .map((item) => {
          let list = []
          if ((item.accountTagInfoBOList || []).length) {
            list = item.accountTagInfoBOList.map((item) => item.tagName)
          } else {
            list = item.tagName
          }

          return list
        })
        .flat(Infinity)

      // 过滤出绿色标签和新签账号
      data.accountFeatureTags = (data.accountTagInfoBOList || []).filter(
        (item) =>
          +(item.tagStyle || {}).styleCode === 2 && item.tagName !== '新签账号'
      )

      data.offlineOrderInterest =
        +(data.talentInterest || {}).offlineOrderInterest === 2
          ? ''
          : (data.talentInterest || {}).offlineOrderInterest

      data.signAccountLevel = (data || {}).signAccountLevel
      // }

      // 若账号状态为下架状态，则显示合作状态选择框
      this.showCoopStatus = !!data.accountStatus

      // 处理达人类型标签(系统固有的标签和用户打标的标签)显示对应的品类信息填写
      if (data.sysAccountTag || data.accountTagInfoBOList) {
        const tagMap = {
          '育儿科普': '母婴亲子',
          '萌娃日常': '母婴亲子',
          '亲子互动': '母婴亲子',
          '测评种草': '母婴亲子',
          '母婴亲子': '母婴亲子',
          '汽车测评': '汽车',
          '汽车知识': '汽车',
          '汽车周边': '汽车',
          '汽车': '汽车',
          '家装设计': '家居家装',
          '装修知识': '家居家装',
          '家居家装': '家居家装'
        }

        let sysAccountTagArr = []

        const accountTagInfoBOList = data.accountTagInfoBOList || []

        // 系统固有的达人类型标签
        if (data.sysAccountTag) {
          sysAccountTagArr = data.sysAccountTag.split(',').map(item => ({
            tagName: item
          }))
        }

        [...sysAccountTagArr, ...accountTagInfoBOList].forEach((item) => {
          if (tagMap[item.tagName]) {
            this.judgeAccountTag.push(tagMap[item.tagName])
          }
        })
      }

      return data
    },
    getCondition() {
      $getIntermediaryCondition().then((res) => {
        if (res.code === 1) {
          // this.tagList = res.data.tagValues
          this.belongs.data = res.data.belongs
        }
      })

      $getEnableTag({ platId: this.platId }).then((res) => {
        if (+res.code === 1) {
          this.tagList = res.data || []
        }
      })

      $getEditCondition().then((res) => {
        if (res.code === 1) {
          this.businessUserList = res.data.businessUserList
          this.fieldList = res.data.fieldList
        }
      })
    },
    onCancel() {
      this.show = false
    },
    handleUserUrl() {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.empowerDisabled = false
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
      if (this.addForm.customFields.find((item) => item.fieldId === val.id)) { return }
      if (this.addForm.usedFields.find((item) => item.fieldId === val.id)) { return }
      this.addForm.customFields.push({
        fieldId: val.id,
        fieldName: val.newsContent
      })
    },

    handleRemoveCustom(index) {
      this.addForm.customFields.splice(index, 1)
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
      const parentMd5Id =
        childList.find((item) => item.tagName === tag)?.parentMd5Id || ''
      // 删除的达人类型子节点对应的父节点tagName
      const parentTagName =
        this.tagList.find((item) => item.md5Id === parentMd5Id)?.tagName || ''
      // 该父节点在judgeAccountTag数组中的index
      const indexOfJudgeAccountTag =
        this.judgeAccountTag.indexOf(parentTagName)

      // 当存在删除的达人类型数据存在时，才删除
      if (indexOfJudgeAccountTag !== -1) {
        this.judgeAccountTag.splice(indexOfJudgeAccountTag, 1)
      }
    },

    handlePlatType(val) {
      this.addForm.userUrl = ''
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.addForm.eid = ''
      // console.log(val)
      switch (val) {
        case 25:
          this.hasAccount = false
          this.addForm.searchType = '1'
          break
        default:
          this.hasAccount = true
          this.addForm.searchType = '2'
      }
    },
    getPlatList() {
      $getUserAccount({ account_type: 4 }).then((res) => {
        if (res.code === 1) {
          this.platMap = res.data.reduce((t, n) => {
            t[n.plat_id] = n
            return t
          }, {})
          this.platInfo = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleAccountChange(userId) {
      this.empowerDisabled = true
      let data = null
      for (let index = 0; index < this.accountList.length; index++) {
        const element = this.accountList[index]
        if (element.eid === userId) {
          data = element
          break
        }
      }
      this.userInfo = data
      this.addForm.eid = data.eid
      this.addForm.userUrl = data.index_url
      // this.$refs.addForm
      this.$refs.addForm.validateField('eid')
      this.$refs.addForm.validateField('userUrl')
    },
    remoteMethod(query) {
      if (query !== '') {
        // console.log(query, '--query')
        this.accountLoading = true
        this.getBaseInfo(query)
      } else {
        this.accountList = []
      }
    },
    async getBaseInfo(keyword) {
      const res = await $getBaseInfo({
        keyword,
        platId: this.addForm.platId
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
      this.accountLoading = false
    },

    /**
     * 授权
     */
    async empower() {
      const platId = this.addForm.platId
      if (!platId) {
        this.$message.error('请选择平台')
        return
      }
      this.empowerLoading = true
      const { platMap } = this
      const row = platMap[this.addForm.platId]
      let type = ''
      this.userInfo = null // 清空用户信息
      const params = {
        index_url: this.addForm.userUrl,
        realname: this.realname
      }
      try {
        const res = await request.get(`${HOST}${row.api1}`, { params: params })
        type = res.code === 1 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type
        })
        if (res.code === 1) {
          this.userInfo = res.data
        }
      } catch (err) {
        this.$message.error({
          message: err.msg
        })
      }
      this.empowerLoading = false
    },

    handleConfirmFeatureTags(arr) {
      this.showAccountFeatureTagsDialog = false
      this.addForm.accountFeatureTags = arr
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

    dialogConfirm() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const params = copy(this.addForm)
          params.userId = params.eid
          // params.tagValue = this.addForm.inputTags.join(',')
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

          params.signContractDate = params.signContractDateArr[0]
            ? dayjs(params.signContractDateArr[0] || '').format('YYYY-MM-DD')
            : ''
          params.signContractDateEnd = params.signContractDateArr[1]
            ? dayjs(params.signContractDateArr[1] || '').format('YYYY-MM-DD')
            : ''
          delete params.signContractDateArr

          // B站等级是选的
          if (+this.platId !== 2) {
            params.signAccountEvaluateRequest = {
              ...this.levelMessage,
              operateType: this.hasLevelMessage ? 1 : 0
            }
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
            ...(params.accountFeatureTags || [])
          ]

          params.shoppingCartInterest = this.shoppingCartInterest
          params.msgFlowInterest = this.msgFlowInterest
          params.offlineBusinessOrderInterest = params.offlineOrderInterest
          delete params.offlineOrderInterest
          delete params.talentInterest
          delete params.accountFeatureTags

          if (this.isEdit) {
            // 编辑
            this.editAccount(params)
          } else {
            this.addAccount(params)
          }
        }
      })
    },
    addParamsOtherData(params) {
      if (params.inputTags) {
        params.tagValue = params.inputTags.join(',')
      }
      if (!params.quantityFlag) {
        params.quantityInfo = ''
      }
      if (!params.baseSalaryFlag) {
        params.baseSalaryInfo = ''
      }
      params.businessUserName = this.businessUserList.find(
        (item) => item.userId === this.addForm.businessUserId
      )?.userName
      // params.brokerUserName = this.user.userInfo.realname
      // params.brokerUserId = this.user.userInfo.id
    },

    // 监听账号状态的变化
    handleChangeAccountStatus(val) {
      // 账号上架状态
      if (val) {
        this.showCoopStatus = true
      } else {
        // 账号下架状态，隐藏合作状态并清空合作状态的值
        this.showCoopStatus = false
        this.addForm.coopStatus = null
      }
    },

    // 编辑新签账号
    editAccount(params) {
      this.addParamsOtherData(params)
      // params.accountType = 5
      delete params.accountLoginUrl
      this.formParams = { ...params }
      this.activeTabName = 'benefitsMsg'
    },

    // 新增签约账号
    addAccount(params) {
      if (!this.userInfo) {
        this.$message.error('请授权账号')
      }

      const { platMap } = this
      const row = platMap[this.addForm.platId]
      params.accountType = 5
      params.thirdUserId = this.userInfo.user_id
      params.accountLoginUrl = this.userInfo.index_url
      this.addParamsOtherData(params)
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => l.toUpperCase())
        params[k] = this.userInfo[key]
      }
      params.platName = row.plat_name
      this.formParams = { ...params }
      this.activeTabName = 'benefitsMsg'
    },

    // 监听切换tab页的方法
    handleChangeTab(tab) {
      // 切换tab页到达人权益信息时，执行下一页的方法
      if (tab.name === 'benefitsMsg') {
        this.dialogConfirm()
      }
    },

    // 确认达人权益信息
    handleConfirmBenefitsMsg() {
      let $api = ''

      // 抖音
      if (+this.platId === 25) {
        $api = this.isEdit
          ? $editSignContractAccountTikTok
          : $addSignContractAccountTikTok
      } else if (+this.platId === 26) {
        // 快手
        $api = this.isEdit ? $editSignAccountKuaiShou : $addSignAccountKuaiShou
      } else if (+this.platId === 2) {
        // b站
        $api = this.isEdit ? $editSignAccountBli : $addSignAccountBli
      } else if (+this.platId === 45) {
        // 小红书
        $api = this.isEdit ? $editSignAccountRedBook : $addSignAccountRedBook
      }

      this.$refs['addBenefitsForm'].validate(async(isValidate) => {
        try {
          if (isValidate) {
            // 最终的入参表单数据
            this.formParams = {
              ...this.formParams,
              ...this.addBenefitsForm
            }
            this.btnLoading = true
            const { code, message } = await $api(this.formParams)
            this.btnLoading = false
            if (+code === 1) {
              this.$message.success(message || '编辑成功')
              this.onCancel()
              this.$emit('update')
              // 编辑类型
              if (this.isEdit) {
                this.$bus.$emit('upLog', {
                  accountId: this.formParams.accountId,
                  operation_module: '编辑确定'
                })
              } else {
                this.$bus.$emit('upLog', { operation_module: '添加确定' })
              }
            } else {
              this.$message.error(message)
            }
          }
        } catch (e) {
          this.btnLoading = false
          this.onCancel()
          this.$message.error(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.plat-info {
  margin-top: 10px;
  img {
    width: 50px;
    height: 50px;
  }
}
.input-new-tag {
  width: 200px;
}
.account-img {
  width: 40px;
  border-radius: 50%;
  margin-right: 8px;
}
.account-name {
  font-weight: 700;
  width: 170px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.account-text1 {
  font-size: 14px;
  line-height: 1.2;
}
.account-text2 {
  line-height: 1.2;
  font-size: 12px;
  margin-top: 6px;
}
.account-search {
  ::v-deep {
    .el-input {
      width: 100%;
    }
  }
}
::v-deep {
  .el-select-dropdown__item {
    padding: 10px 20px;
  }
}
.account-id {
  line-height: 1.2;
  color: $--color-text-secondary;
}
.el-select-dropdown {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: 1.2 !important;
    padding: 10px;
    .flex-row > * {
      margin: initial;
    }
    .account-img {
      width: 40px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .account-info {
      display: flex;
      flex: 1;
      justify-content: center;
      flex-direction: column;
      // align-items: center;
      margin-right: 10px;
    }
    .account-fans {
      flex: initial;
      width: 80px;
    }
    .account-text1 {
      font-size: 14px;
    }
    .account-text2 {
      font-size: 12px;
      margin-top: 6px;
    }
    .account-name {
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
.time-wrapper {
  ::v-deep {
    .el-date-editor {
      width: 250px;
    }
    .el-input__inner {
      padding-right: 10px !important;
    }
  }
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

.datePicker {
  width: 300px;
}

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
</style>
