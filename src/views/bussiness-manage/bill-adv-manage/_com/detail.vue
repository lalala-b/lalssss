<template>
  <div v-loading="batchSearchLoading">
    <Wrap class="search-view">
      <search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <!-- <template v-slot:prv="target">
          <department-select v-model="target.model.orgId" :inline="true" />
        </template> -->
        <template v-slot:btn-prv="target">
          <el-button
            type="text"
            @click="batchSearchDialogShow = true"
          >批量找号</el-button>
          <el-button
            v-if="$permission('add_account_tag')"
            type="text"
            @click="addAccountTagDialogShow = true"
          >添加账号标签</el-button>
          <div class="search-item">
            <div class="search-item-title" data-bold>内容类型</div>
            <div class="search-item-tag tag-box" :class="tagOpen ? 'open' : ''">
              <template>
                <template v-for="(item, index) in tagValueList">
                  <template v-if="(item.childNodeTags || []).length">
                    <el-popover
                      :key="item.md5Id"
                      placement="bottom"
                      trigger="hover"
                    >
                      <template v-for="it in item.childNodeTags">
                        <el-checkbox
                          :key="`${it.md5Id}_${it.tagName}`"
                          class="m-b-10"
                          :value="
                            tagCheckList.findIndex((i) => i === it.tagName) > -1
                              ? true
                              : false
                          "
                          @change="handleChangeChildTags(it, item)"
                        >{{ it.tagName }}</el-checkbox>
                        <br :key="it.md5Id">
                      </template>

                      <el-tag
                        slot="reference"
                        v-log
                        :effect="contentTagEffect[item.md5Id] || 'plain'"
                        :type="
                          contentTagType[item.md5Id] === 'notInfo' ? '' : 'info'
                        "
                        size="small"
                        class="tag m-b-10"
                        @click="handleClickParentTag(item)"
                      >
                        {{ item.tagName }}
                      </el-tag>
                    </el-popover>
                  </template>
                  <template v-else>
                    <el-tag
                      :key="item.md5Id"
                      v-log
                      :effect="
                        !tagCheckList.length && item.tagName === '全部'
                          ? 'dark'
                          : tagCheckList.findIndex((i) => i === item.tagName) >
                            -1
                            ? 'dark'
                            : 'plain'
                      "
                      :type="
                        !tagCheckList.length && item.tagName === '全部'
                          ? 'dark'
                          : tagCheckList.findIndex((i) => i === item.tagName) >
                            -1
                            ? ''
                            : 'info'
                      "
                      size="small"
                      class="tag m-b-10"
                      @click="handleClickParentTag(item)"
                    >
                      {{ item.tagName }}
                    </el-tag>
                  </template>
                </template>
              </template>
              <!-- <div v-else class="check-wrap">
                <el-checkbox-group v-model="tagCheckList" @change="handleTagCheckChange">
                  <template v-for="item in tagValueList">
                    <el-checkbox v-if="item.tagName !== '全部'" :key="item.tagId" :label="item.tagName">{{ item.tagName }}</el-checkbox>
                  </template>
                </el-checkbox-group>
                <span class="cancel-btn" @click="handleTagCancel">取消多选</span>
              </div> -->
            </div>
            <div class="search-right">
              <span
                @click="tagOpen = !tagOpen"
              >{{ tagOpen ? '收起' : '展开' }}
                <i
                  :class="tagOpen ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"
                />
              </span>
              <!-- <el-button
                size="mini"
                @click="handleTagCancel"
              >多选</el-button> -->
            </div>
          </div>
          <!-- <div v-for="(item, name) in tagInfo" :key="name" class="search-item">
              <div class="search-item-title" data-bold>{{ item.title }}</div>
              <div class="search-item-tag">
                <el-tag
                  v-for="(tag, index) in item.data"
                  :key="tag.text || tag"
                  v-log
                  :effect="(item.selectIndex === index ? 'dark': 'plain')"
                  :type="(item.selectIndex === index ? '':'info')"
                  size="small"
                  class="tag"
                  @click="handleClickTag(name, index)"
                >{{ tag.text || tag }}</el-tag>
                <template v-if="item.hasCustom">
                  <el-tag
                    v-if="!item._status"
                    v-log
                    effect="dark"
                    size="small"
                    class="tag"
                    @click="item._status = true"
                  >自定义</el-tag>
                  <div v-else class="flex flex-align-center">
                    <el-input-number
                      v-model.number="item._start"
                      :controls="false"
                      :precision="2"
                      type="number"
                      :min="0"
                      :max="100000000"
                      placeholder="开始值"
                      autocomplete="off"
                      size="small"
                      on-keypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
                      @change="handleCustomChange(item, name)"
                    />w
                    <span> - </span>
                    <el-input-number
                      v-model.number="item._end"
                      :controls="false"
                      :precision="2"
                      type="number"
                      :min="0"
                      :max="100000000"
                      placeholder="结束值"
                      autocomplete="off"
                      size="small"
                      on-keypress="return (/[\d\.]/.test(String.fromCharCode(event.keyCode)))"
                      @change="handleCustomChange(item, name)"
                    />w
                  </div>
                </template>
              </div>
            </div> -->
          <el-collapse-transition>
            <div class="collapse-wrap">
              <div class="flex flex-align-start">
                <span
                  class="accounts-search__label searchLabel"
                  data-bold
                >达人信息</span>
                <div>
                  <el-cascader
                    ref="cascader1"
                    v-model="target.model.filedIds"
                    class="cascader m-r-10 m-b-24"
                    placeholder="历史合作行业"
                    :options="historyIndustryTypeList"
                    :props="{
                      checkStrictly: false,
                      value: 'tagId',
                      label: 'tagName',
                      children: 'childNodeTags',
                      multiple: true,
                    }"
                    collapse-tags
                    clearable
                    @change="handleChangeCascader"
                  />

                  <Select
                    v-model="target.model.brandId"
                    class="m-r-10"
                    :config="(normalFormItemMap || {}).brandId || {}"
                  />

                  <el-select
                    v-model="target.model.fansNumRange"
                    class="m-r-10 m-b-24"
                    :clearable="true"
                    placeholder="粉丝量"
                    @visible-change="handleVisibleChangeFans"
                    @change="handleChangeSelectFans"
                  >
                    <el-option
                      v-for="item in fansList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                    <div class="optionSlot">
                      <div class="optionBox">
                        <el-input-number
                          v-model="searchData.fansInputStart"
                          placeholder="0"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="0"
                          :max="searchData.cpmInputEnd || 10000"
                        />
                        w
                        <span class="seg">-</span>
                        <el-input-number
                          v-model="searchData.fansInputEnd"
                          placeholder="10000"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="searchData.cpmInputStart || 0"
                          :max="10000"
                        />
                        w
                      </div>
                      <el-button
                        size="small"
                        type="primary"
                        class="reset"
                        @click="handleResetFans"
                      >重置</el-button>
                    </div>
                  </el-select>
                  <el-select
                    v-model="target.model.expectedPlayback"
                    class="m-r-10 m-b-24"
                    :clearable="true"
                    placeholder="预期播放量"
                    @visible-change="handleVisibleChangeExpectedPlayback"
                    @change="handleChangeSelectExpectedPlayback"
                  >
                    <el-option
                      v-for="item in expectedPlaybackList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                    <div class="optionSlot">
                      <div class="optionBox">
                        <el-input-number
                          v-model="searchData.expectedPlaybackInputStart"
                          placeholder="0"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="0"
                          :max="searchData.cpmInputEnd || 10000"
                        />
                        w
                        <span class="seg">-</span>
                        <el-input-number
                          v-model="searchData.expectedPlaybackInputEnd"
                          placeholder="10000"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="searchData.cpmInputStart || 0"
                          :max="10000"
                        />
                        w
                      </div>
                      <el-button
                        size="small"
                        type="primary"
                        class="reset"
                        @click="handleResetExpectedPlayback"
                      >重置</el-button>
                    </div>
                  </el-select>
                  <template v-if="type === 'douyin'">
                    <el-select
                      v-model="target.model.avgFlowWeeks"
                      class="m-r-10 m-b-24"
                      :clearable="true"
                      placeholder="近7日集均播放量"
                      @visible-change="handleVisibleChangeAvgFlowWeeks"
                      @change="handleChangeSelectAvgFlowWeeks"
                    >
                      <el-option
                        v-for="item in avgFlowWeeksList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                      <div class="optionSlot">
                        <div class="optionBox">
                          <el-input-number
                            v-model="searchData.avgFlowWeeksInputStart"
                            placeholder="0"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="0"
                            :max="searchData.cpmInputEnd || 1000"
                          />
                          万
                          <span class="seg">-</span>
                          <el-input-number
                            v-model="searchData.avgFlowWeeksInputEnd"
                            placeholder="1000"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="searchData.cpmInputStart || 0"
                            :max="1000"
                          />
                          万
                        </div>
                        <el-button
                          size="small"
                          type="primary"
                          class="reset"
                          @click="handleResetAvgFlowWeeks"
                        >重置</el-button>
                      </div>
                    </el-select>
                    <el-select
                      v-model="target.model.nealy7ThumbUpAvg"
                      class="m-r-10 m-b-24"
                      :clearable="true"
                      placeholder="近7日集均点赞量"
                      @visible-change="handleVisibleChangeNealy7ThumbUpAvg"
                      @change="handleChangeSelectNealy7ThumbUpAvg"
                    >
                      <el-option
                        v-for="item in nealy7ThumbUpAvgList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                      <div class="optionSlot">
                        <div class="optionBox">
                          <el-input-number
                            v-model="searchData.nealy7ThumbUpAvgInputStart"
                            placeholder="0"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="0"
                            :max="searchData.cpmInputEnd || 100000"
                          />
                          <span class="seg">-</span>
                          <el-input-number
                            v-model="searchData.nealy7ThumbUpAvgInputEnd"
                            placeholder="100000"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="searchData.cpmInputStart || 0"
                            :max="100000"
                          />
                        </div>
                        <el-button
                          size="small"
                          type="primary"
                          class="reset"
                          @click="handleResetNealy7ThumbUpAvg"
                        >重置</el-button>
                      </div>
                    </el-select>
                  </template>
                  <!-- <el-select v-model="target.model.nealy7dMedianThumbs" class="m-r-10" :clearable="true" placeholder="近7日点赞量中位数">
                    <el-option v-for="item in nealy7ThumbUpAvgList" :key="item.value" :value="item.value" :label="item.label" />
                  </el-select> -->
                  <el-select
                    v-model="target.model.cpm"
                    popper-class="cpmSelect"
                    :clearable="true"
                    class="m-r-10 m-b-24"
                    placeholder="预期cpm"
                    @change="handleChangeSelect"
                    @visible-change="handleVisibleChange"
                  >
                    <el-option
                      v-for="item in cpmList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                    <div class="optionSlot">
                      <div class="optionBox">
                        <el-input-number
                          v-model="searchData.cpmInputStart"
                          placeholder="0"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="0"
                          :max="searchData.cpmInputEnd || 999"
                        />
                        <span class="seg">-</span>
                        <el-input-number
                          v-model="searchData.cpmInputEnd"
                          placeholder="999"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="searchData.cpmInputStart || 0"
                          :max="999"
                        />
                      </div>
                      <el-button
                        size="small"
                        type="primary"
                        class="reset"
                        @click="handleReset"
                      >重置</el-button>
                    </div>
                  </el-select>

                  <template v-if="type === 'douyin'">
                    <el-select
                      v-model="target.model.cpe"
                      popper-class="cpmSelect"
                      :clearable="true"
                      class="m-r-10 m-b-24"
                      placeholder="预期CPE"
                      @change="handleChangeSelectCpe"
                      @visible-change="handleVisibleChangeCpe"
                    >
                      <el-option
                        v-for="item in cpeList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                      <div class="optionSlot">
                        <div class="optionBox">
                          <el-input-number
                            v-model="searchData.cpeInputStart"
                            placeholder="0"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="0"
                            :max="searchData.cpeInputEnd || 999"
                          />
                          <span class="seg">-</span>
                          <el-input-number
                            v-model="searchData.cpeInputEnd"
                            placeholder="999"
                            :controls="false"
                            class="optionInput"
                            size="small"
                            :min="searchData.cpeInputStart || 0"
                            :max="999"
                          />
                        </div>
                        <el-button
                          size="small"
                          type="primary"
                          class="reset"
                          @click="handleResetCpe"
                        >重置</el-button>
                      </div>
                    </el-select>
                  </template>

                  <el-select
                    v-model="target.model.sixPriceRange"
                    popper-class="cpmSelect"
                    :clearable="true"
                    class="m-r-10 m-b-24"
                    :placeholder="pricePlaceholder"
                    @change="handleChangeSelectSixPrice"
                    @visible-change="handleVisibleChangeSixPrice"
                  >
                    <!-- <el-option v-for="item in tagInfo.sixPriceRange.data.slice(1)" :key="item" :value="item" :label="item" /> -->
                    <el-option
                      v-for="item in sixPriceList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                    <div class="optionSlot">
                      <div class="optionBox">
                        <el-input-number
                          v-model="searchData.sixPriceInputStart"
                          placeholder="0"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="0"
                          :max="searchData.sixPriceInputEnd || 100000"
                        />w
                        <span class="seg">-</span>
                        <el-input-number
                          v-model="searchData.sixPriceInputEnd"
                          placeholder="100000"
                          :controls="false"
                          class="optionInput"
                          size="small"
                          :min="searchData.sixPriceInputStart || 0"
                          :max="100000"
                        />w
                      </div>
                      <el-button
                        size="small"
                        type="primary"
                        class="reset"
                        @click="handleResetSixPrice"
                      >重置</el-button>
                    </div>
                  </el-select>
                  <el-select
                    v-model="target.model.cartIsFree"
                    class="m-r-10 m-b-24"
                    clearable
                    placeholder="购物车权益"
                  >
                    <el-option
                      v-for="item in cartEntitlementList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                  <el-select
                    v-model="target.model.msgIsFree"
                    class="m-r-10 m-b-24"
                    :clearable="true"
                    placeholder="信息流权益"
                  >
                    <el-option
                      v-for="item in streamingBenefitsList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                  <el-select
                    v-model="target.model.offlineOrderInterest"
                    class="m-r-10 m-b-24"
                    :clearable="true"
                    placeholder="线下商单权益"
                  >
                    <el-option
                      v-for="item in offlineBusinessBillRightsList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                  <el-select
                    v-model="target.model.coopStatus"
                    class="m-r-10 m-b-24"
                    :clearable="true"
                    placeholder="合作状态"
                  >
                    <el-option
                      v-for="item in coopStatusList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                </div>
              </div>
              <div class="flex flex-align-center m-b-24">
                <span class="accounts-search__label" data-bold>粉丝画像</span>
                <div class="flex flex-align-center">
                  <el-select
                    v-model="target.model.maxAgeLabel"
                    class="m-r-10"
                    :clearable="true"
                    placeholder="年龄"
                  >
                    <el-option
                      v-for="item in fansAgeRangeList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                </div>
                <div class="flex flex-align-center">
                  <el-cascader
                    v-model="target.model.sixRange"
                    class="m-r-10"
                    :options="sixRange"
                    clearable
                    :props="{
                      value: 'dictValue',
                      label: 'dictLabel',
                      emitPath: true,
                      checkStrictly: true,
                    }"
                    placeholder="性别分布"
                  />
                </div>
                <div class="flex flex-align-center">
                  <el-select
                    v-model="target.model.maxPhoneLabel"
                    class="m-r-10"
                    :clearable="true"
                    placeholder="粉丝手机系统"
                  >
                    <el-option
                      v-for="item in phoneSysRange"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                </div>
                <!-- <div class="flex flex-align-center">
                  <el-cascader
                    v-model="target.model.fansCity"
                    class="m-r-10"
                    :options="fansCitys"
                    clearable
                    filterable
                    :props="{value: 'areaName', label: 'areaName',children: 'nodes',emitPath: true,expandTrigger:'hover' }"
                    placeholder="粉丝城市分布"
                  />
                </div> -->
              </div>
              <div class="flex flex-align-center m-b-24">
                <span class="accounts-search__label" data-bold>账号筛选</span>
                <div class="flex flex-align-center">
                  <el-select
                    v-model="target.model.accountTypeFlag"
                    class="m-r-10"
                    multiple
                    collapse-tags
                    :clearable="true"
                    placeholder="账号归属"
                    @change="handleChangeAccountTypeFlag"
                  >
                    <el-option
                      v-for="item in accountAttributionList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      :label="item.dictLabel"
                    />
                  </el-select>
                  <el-checkbox
                    v-for="item in searchAccountFields"
                    :key="item.md5Id"
                    class="m-l-20 checkbox"
                    :true-label="'true,' + item.md5Id"
                    :false-label="'false,' + item.md5Id"
                    @change="handleChangeShield"
                  >
                    <IconTip
                      :content="item.tagDescribe"
                      :label="item.tagName"
                      icon-class="iconwenhao"
                    />
                  </el-checkbox>
                  <el-checkbox
                    v-model="target.model.signOffline"
                    class="m-l-20 checkbox"
                    @change="handleChangeSignOffline"
                  >
                    解约账号
                  </el-checkbox>
                </div>
              </div>
              <el-collapse-transition>
                <div v-show="collapseShow" class="collapse-wrap">
                  <div class="flex flex-align-center m-b-24">
                    <span
                      class="accounts-search__label"
                      data-bold
                    >高级筛选</span>
                    <el-select
                      v-model="target.model.ageRange"
                      class="m-r-10"
                      :clearable="true"
                      filterable
                      placeholder="达人年龄"
                    >
                      <el-option
                        v-for="item in ageRangeList"
                        :key="item.dictValue"
                        :value="item.dictValue"
                        :label="item.dictLabel"
                      />
                    </el-select>
                    <el-select
                      v-model="target.model.sex"
                      class="m-r-10"
                      clearable
                      placeholder="达人性别"
                    >
                      <el-option value="男" label="男" />
                      <el-option value="女" label="女" />
                    </el-select>
                    <el-cascader
                      v-model="target.model.region"
                      class="m-r-10"
                      :options="provList"
                      clearable
                      :props="{
                        value: 'areaName',
                        label: 'areaName',
                        lazy: true,
                        lazyLoad: handleProvChange,
                        emitPath: true,
                        checkStrictly: true,
                      }"
                      placeholder="达人所在地区"
                    />
                    <el-select
                      v-model="target.model.mcnName"
                      class="m-r-10"
                      filterable
                      :clearable="true"
                      placeholder="请输入MCN机构"
                    >
                      <el-option
                        v-for="item in mcnList"
                        :key="item"
                        :value="item"
                        :label="item"
                      />
                    </el-select>
                  </div>

                  <div class="flex flex-align-center m-b-24">
                    <span
                      class="accounts-search__label"
                      data-bold
                    >合作评分</span>
                    <el-select
                      v-model="target.model.responseSpeedScore"
                      class="m-r-10"
                      filterable
                      :clearable="true"
                      placeholder="响应速度"
                    >
                      <el-option
                        v-for="item in responseSpeedOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                    <el-select
                      v-model="target.model.cooperationScore"
                      class="m-r-10"
                      filterable
                      :clearable="true"
                      placeholder="配合度"
                    >
                      <el-option
                        v-for="item in cooperationOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                    <el-select
                      v-model="target.model.contentCreativeScore"
                      class="m-r-10"
                      filterable
                      :clearable="true"
                      placeholder="内容创意"
                    >
                      <el-option
                        v-for="item in contentCreativeOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                    <el-select
                      v-model="target.model.rebateScore"
                      class="m-r-10"
                      filterable
                      :clearable="true"
                      placeholder="返点力度"
                    >
                      <el-option
                        v-for="item in rebateOptions"
                        :key="item.value"
                        :value="item.value"
                        :label="item.label"
                      />
                    </el-select>
                  </div>
                </div>
              </el-collapse-transition>
            </div>
          </el-collapse-transition>
          <div class="flex m-b-16">
            <el-link
              :underline="false"
              type="primary"
              @click="collapseShow = !collapseShow"
            >{{ collapseShow ? '收起更多筛选' : '展开更多筛选'
            }}<i
              class="iconfont"
              :class="collapseShow ? 'iconzhankai' : 'iconshouqi'"
            /></el-link>
          </div>
        </template>
        <!-- <template v-slot:btns="target"> -->
        <!-- <div class="flex-inline m-l-10">
            <el-button type="primary" @click="onAllExport(target.model)">全部导出</el-button>
            <IconTip
              content="一键导出查询后的全部账号信息。"
              icon-class="iconwenhao"
            />
          </div> -->
        <!-- <el-checkbox v-model="searchData.qpOwn" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示乾派自营账号</el-checkbox>
          <el-checkbox v-model="searchData.hdOwn" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示海盗自营账号</el-checkbox>
          <el-checkbox v-model="searchData.signOwn" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示签约账号</el-checkbox>
          <el-checkbox v-model="searchData.agencyOwn" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示媒介账号</el-checkbox>
          <el-checkbox v-model="searchData.deliveryOwn" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示投放账号</el-checkbox>
          <el-checkbox v-for="item in accountTagList" :key="item.dictValue" v-model="searchData[item.dictValue]" class="m-l-10 checkbox" true-label="1" false-label="0" @change="handleChangeShield">显示{{ item.dictLabel }}账号</el-checkbox> -->
        <!-- </template> -->
      </search>
    </Wrap>
    <Wrap class="m-t-16 table-view">
      <div class="checkbox-view m-b-16">
        <el-checkbox
          v-for="(item, key) in extFields"
          :key="key"
          v-model="item.status"
          :label="key"
        >{{ item.chnName }}</el-checkbox>
        <!-- <el-checkbox-group v-model="checkTableRow" class="group">
          <template v-if="type === 'douyin'">
            <el-checkbox label="twentySecondPrice">1-20s报价</el-checkbox>
            <el-checkbox label="sixPrice">21-60s报价</el-checkbox>
            <el-checkbox label="oversixtySecondPrice">60s+报价</el-checkbox>
            <el-checkbox label="livePrice">直播报价</el-checkbox>
            <el-checkbox label="netPrice">全网报价</el-checkbox>
          </template>

          <template v-if="type === 'kuaishou'">
            <el-checkbox label="sixPrice">达人报价</el-checkbox>
            <el-checkbox label="netPrice">全网报价</el-checkbox>
          </template>

          <template v-if="type === 'bilibili'">
            <el-checkbox label="customVideoPrice">定制视频</el-checkbox>
            <el-checkbox label="implantationVideoPrice">植入视频</el-checkbox>
            <el-checkbox label="directVideoPrice">直发视频</el-checkbox>
            <el-checkbox label="forwardSituationPrice">转发动态</el-checkbox>
          </template>

          <template v-if="type === 'xiaohongshu'">
            <el-checkbox label="videoPrice">视频笔记</el-checkbox>
            <el-checkbox label="picturePrice">图文笔记</el-checkbox>
          </template>
        </el-checkbox-group> -->
      </div>
      <el-table
        ref="table"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        :row-class-name="getTableRowClass"
        header-row-class-name="table-header"
        style="width: 100%"
        @sort-change="doSort"
        @select="handleSelect"
        @selection-change="handleListSelect"
      >
        <el-table-column type="selection" fixed="left" />
        <!-- <el-table-column type="index" label="序号" :index="getIndex" /> -->
        <el-table-column label="账号信息" width="200" align="left" fixed="left">
          <template slot-scope="s">
            <AccountCard :info="s.row">
              <div class="account">
                <!-- <p>ID：{{ (s.row.eidOrGetDataUrl.split('、') || [])[0] || '--' }}</p> -->
                <p v-if="(s.row.accountFeatureList || []).length" class="m-t-5">
                  <el-tag
                    v-for="item in s.row.accountFeatureList"
                    :key="item"
                    type="danger"
                    class="m-r-5 m-b-5"
                    size="mini"
                  >{{ item }}</el-tag>
                </p>
                <!-- <p v-if="extFields.accountBelong.status">{{ s.row.accountBelong }}</p> -->
                <p>{{ s.row.accountBelong }}</p>
                <p>
                  {{
                    [s.row.birthday, s.row.sex, s.row.areaName]
                      .filter((item) => item)
                      .join('/')
                  }}
                </p>
              </div>
            </AccountCard>
          </template>
        </el-table-column>

        <el-table-column
          label="行业合作历史"
          prop="accountFiledData"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <template v-if="(row.accountFiledData || []).length">
              <span>{{ row.accountFiledData[0].filedName || '--' }}（{{
                row.accountFiledData[0].count || 0
              }}次）</span>
              <i
                class="iconfont el-icon-more-outline more"
                @click="handleShowHistoryDialog(row, 'filed')"
              />
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column
          label="品牌合作历史"
          prop="accountBrandData"
          min-width="120"
        >
          <template slot-scope="{ row }">
            <template v-if="(row.accountBrandData || []).length">
              <span>{{ row.accountBrandData[0].brandName || '--' }}（{{
                row.accountBrandData[0].count || 0
              }}次）</span>
              <i
                class="iconfont el-icon-more-outline more"
                @click="handleShowHistoryDialog(row, 'brand')"
              />
            </template>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="ID" prop="eidOrGetDataUrl" width="150" /> -->
        <!-- <el-table-column v-if="extFields.accountBelong.status" label="账号归属" prop="accountBelong" /> -->
        <!-- <el-table-column v-if="extFields.tagName.status" label="内容类型" prop="tagName" /> -->
        <el-table-column
          label="粉丝量"
          prop="fansNum"
          sortable="custom"
          min-width="100"
        >
          <template slot-scope="{ row }">
            {{ row.fansNum | toThousandsW }}
          </template>
        </el-table-column>
        <el-table-column
          label="报价"
          prop="twentySecondPrice"
          width="200"
          text-align="left"
        >
          <template slot="header">
            <IconTip
              v-if="getPlatPriceTip"
              :content="getPlatPriceTip"
              label="报价"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div class="price">
              <template v-if="type === 'douyin'">
                <p v-if="extFields.allQuotes.status">
                  <span>1-20s：</span>
                  <span>¥{{ row.twentySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.sixPrice">
                  <span>21-60s：</span>
                  <span>¥{{ row.sixPrice | toThousandsW }}</span>
                </p>
                <p v-if="extFields.allQuotes.status">
                  <span>60s以上：</span>
                  <span>¥{{ row.oversixtySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="extFields.allQuotes.status">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'kuaishou'">
                <p v-if="checkTableRowShow.sixPrice">
                  <span>达人报价：</span>
                  <span>¥{{ row.sixPrice | toThousandsW }}</span>
                </p>
                <p v-if="extFields.allQuotes.status">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'bilibili'">
                <p v-if="checkTableRowShow.customVideoPrice">
                  <span>定制视频：</span>
                  <span>¥{{ row.customVideoPrice | toThousandsW }}</span>
                </p>
                <template v-if="extFields.allQuotes.status">
                  <p>
                    <span>植入视频：</span>
                    <span>¥{{ row.implantationVideoPrice | toThousandsW }}</span>
                  </p>
                  <p>
                    <span>直发视频：</span>
                    <span>¥{{ row.directVideoPrice | toThousandsW }}</span>
                  </p>
                  <p>
                    <span>转发动态：</span>
                    <span>¥{{ row.forwardSituationPrice | toThousandsW }}</span>
                  </p>
                </template>
              </template>
              <template v-if="type === 'xiaohongshu'">
                <p v-if="checkTableRowShow.videoPrice">
                  <span>视频笔记：</span>
                  <span>¥{{ row.videoPrice | toThousandsW }}</span>
                </p>
                <p v-if="extFields.allQuotes.status">
                  <span>图文笔记：</span>
                  <span>¥{{ row.picturePrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'other'">
                <p style="text-align: center">
                  ¥{{ row.sixPrice | toThousandsW }}
                </p>
              </template>
            </div>

            <div
              v-if="
                (type === 'douyin' ||
                  type === 'kuaishou' ||
                  type === 'bilibili') &&
                  row.priceTime
              "
              class="priceTime"
            >
              <el-tag
                size="small"
                type="info"
              >更新时间：{{ row.priceTime.slice(0, -3) || '--' }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="历史毛利率"
          prop="grossProfitRate"
          min-width="120"
          sortable="custom"
        >
          <template slot="header">
            <IconTip
              content="该账号，最近两个月“档期”的工单毛利率的平均值，每天0点更新一次"
              label="历史毛利率"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.grossProfitRate ? `${row.grossProfitRate}%` : '--' }}
          </template>
        </el-table-column>
        <template v-if="type === 'douyin' || type === 'kuaishou'">
          <el-table-column
            prop="expectPlayVolume"
            label="预期播放量"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天达人星图视频的预期播放量，数据来源为星图平台，每周更新一次，可能存在一定偏差"
                label="预期播放量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.expectPlayVolume | toThousandsW }}</div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type === 'douyin'"
            prop="playMedian"
            label="播放中位数"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="达人最近30天的星图视频播放中位数"
                label="播放中位数"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.playMedian || '--' }}</div>
            </template>
          </el-table-column>

          <el-table-column
            prop="expectCpm"
            label="预期CPM"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天，达人20-60s视频的预期CPM，数据来源为星图平台，每周更新一次，可能存在一定偏差"
                label="预期CPM"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ getExpectCpm(row.expectCpm) }}</div>
            </template>
          </el-table-column>

          <el-table-column
            v-if="type === 'douyin'"
            prop="expectCpe2160"
            label="预期CPE"
            sortable="custom"
            width="120"
          >
            <template slot-scope="{ row }">
              <div>{{ row.expectCpe2160 || '--' }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-if="type === 'kuaishou'">
          <el-table-column prop="completePlayRate" label="完播率" width="120">
            <template slot-scope="{ row }">
              <div>{{ row.completePlayRate | toRateNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="interactRate" label="互动率" width="120">
            <template slot-scope="{ row }">
              <div>{{ row.interactRate | toRateNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="viewCntAvg" label="平均播放量" width="120">
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近15个视频的平均播放量"
                label="平均播放量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.viewCntAvg | toThousandsW }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="likeCntAvg" label="平均点赞量" width="120">
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近15个视频的平均点赞量"
                label="平均点赞量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.likeCntAvg | toThousandsW }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="commentCntAvg" label="平均评论量" width="120">
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近15个视频的平均评论量"
                label="平均评论量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.commentCntAvg | toThousandsW }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="forwardCntAvg" label="平均分享量" width="120">
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近15个视频的平均分享量"
                label="平均分享量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.forwardCntAvg | toThousandsW }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-if="type === 'douyin'">
          <el-table-column
            prop="workInteractionRate"
            label="互动率"
            sortable="custom"
            width="100"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天星图视频互动率"
                label="互动率"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.workInteractionRate | toRateNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="completePlayRate"
            label="完播率"
            sortable="custom"
            width="100"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天星图视频完播率"
                label="完播率"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.completePlayRate | toRateNumber }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="avgLike"
            label="平均点赞"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天星图视频平均点赞"
                label="平均点赞"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.avgLike | toThousandsW }}</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="avgComment"
            label="平均评论"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30天星图视频平均评论"
                label="平均评论"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div>{{ row.avgComment | toThousandsW }}</div>
            </template>
          </el-table-column>
        </template>
        <template v-if="type === 'douyin'">
          <el-table-column
            label="近7日集均点赞量"
            prop="avgLikeWeek"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近7日发布视频的平均点赞量，删除的视频也会列入统计"
                label="近7日集均点赞量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">{{
              (row.avgLikeWeek || 0).toFixed(0) | toThousandsW
            }}</template>
          </el-table-column>
          <el-table-column
            label="近7日集均播放量"
            prop="avgFlowWeek"
            sortable="custom"
            min-width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近7日发布视频的平均播放量，删除的视频也会列入统计"
                label="近7日集均播放量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">{{
              (row.avgFlowWeek || 0).toFixed(0) | toThousandsW
            }}</template>
          </el-table-column>
        </template>
        <template v-if="type === 'douyin'">
          <el-table-column label="粉丝活跃度" prop="fanActivity" width="90">
            <template slot-scope="{ row }">{{
              (row.fansActiveRate || 0).toFixed(2) | toThousandsW
            }}</template>
          </el-table-column>
          <el-table-column
            label="粉丝城市分布"
            prop="fansCityProportion"
            width="120"
          >
            <template slot-scope="{ row }">
              <template v-if="Object.keys(row.fansCityProportion || {}).length">
                <div
                  v-for="(item, index) in Object.keys(
                    row.fansCityProportion || {},
                  ).slice(0, 3)"
                  :key="item"
                >
                  {{ item }} ({{
                    Object.values(row.fansCityProportion || {})[index]
                  }})
                </div>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </template>
        <!-- <el-table-column v-if="type === 'douyin'" label="报价更新时间" prop="priceTime" width="180">
          <template slot-scope="{ row }">
            {{ row.priceTime || '--' }}
          </template>
        </el-table-column> -->
        <template
          v-if="
            type !== 'douyin' &&
              type !== 'kuaishou' &&
              type !== 'bilibili' &&
              type !== 'xiaohongshu'
          "
        >
          <el-table-column
            label="近7日集均播放量"
            prop="avgFlowWeek"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近7日发布视频的平均播放量，删除的视频也会列入统计"
                label="近7日集均播放量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">{{
              (row.avgFlowWeek || 0).toFixed(0) | toThousandsW
            }}</template>
          </el-table-column>
          <el-table-column
            label="近7日集均点赞量"
            prop="avgLikeWeek"
            sortable="custom"
            width="120"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近7日发布视频的平均点赞量，删除的视频也会列入统计"
                label="近7日集均点赞量"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">{{
              (row.avgLikeWeek || 0).toFixed(0) | toThousandsW
            }}</template>
          </el-table-column>
        </template>
        <template v-if="type === 'bilibili'">
          <el-table-column
            label="播放量中位数"
            prop="averagePlayCnt"
            width="120"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span v-if="row.averagePlayCnt !== null">
                {{ row.averagePlayCnt | toThousandsW }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="互动率中位数"
            prop="averageInteractiveRate"
            width="120"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span v-if="row.averageInteractiveRate !== null">
                {{ row.averageInteractiveRate | toRateNumber }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="点赞中位数"
            prop="averageLikeCnt"
            width="120"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span v-if="row.averageLikeCnt !== null">
                {{ row.averageLikeCnt | toThousandsW }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="评论中位数"
            prop="averageCommentCnt"
            width="120"
            sortable="custom"
          >
            <template slot-scope="{ row }">
              <span v-if="row.averageCommentCnt !== null">
                {{ row.averageCommentCnt | toThousandsW }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </template>
        <template v-if="type === 'douyin' || type === 'kuaishou'">
          <el-table-column label="粉丝性别" width="100">
            <template slot-scope="{ row }">
              <template v-if="Object.keys(row.fanGenderRatio || {}).length">
                <div
                  v-for="(item, index) in Object.keys(row.fanGenderRatio || {})"
                  :key="item"
                >
                  {{ item }} ({{
                    Object.values(row.fanGenderRatio || {})[index]
                  }})
                </div>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column label="粉丝年龄" width="140">
            <template slot-scope="{ row }">
              <template
                v-if="Object.keys(row.fansAgeDistribution || {}).length"
              >
                <div
                  v-for="(item, index) in Object.keys(
                    row.fansAgeDistribution || {},
                  ).slice(0, 3)"
                  :key="item"
                >
                  {{ item }} ({{
                    Object.values(row.fansAgeDistribution || {})[index]
                  }})
                </div>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="extFields.proportionOfFanPhones.status"
            label="粉丝手机占比"
            width="140"
          >
            <template slot-scope="{ row }">
              <template
                v-if="Object.keys(row.fansPhoneProportion || {}).length"
              >
                <div
                  v-for="(item, index) in Object.keys(
                    row.fansPhoneProportion || {},
                  ).slice(0, 3)"
                  :key="item"
                >
                  {{ item }} ({{
                    Object.values(row.fansPhoneProportion || {})[index]
                  }})
                </div>
              </template>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="extFields.talentRights.status"
            prop="talentInterest"
            label="达人权益"
            width="140"
            align="left"
          >
            <template slot-scope="{ row }">
              <div class="otherMessage">
                <p>
                  <span>购物车：</span>
                  <span>{{
                    (row.talentInterest || {}).cartInterest
                      ? getCartInterest(row)
                      : '--'
                  }}</span>
                </p>
                <p>
                  <span>信息流：</span>
                  <span>{{
                    (row.talentInterest || {}).msgFlowInterest
                      ? getMsgFlowInterest(row)
                      : '--'
                  }}</span>
                </p>
                <p v-if="row.offlineOrderInterest">
                  <span>
                    {{
                      !+row.offlineOrderInterest
                        ? '不接受线下商单'
                        : +row.offlineOrderInterest === 1
                          ? '接受线下商单'
                          : ''
                    }}
                  </span>
                </p>
                <p v-if="row.maxBearRatio">
                  <span>最多共担返点{{ row.maxBearRatio || 0 }}%</span>
                </p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            v-if="extFields.coopScoring.status"
            label="合作评分"
            width="152"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="满分5分，仅统计2022年3月份之后生成且被评价的工单"
                label="合作评分"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <div class="price">
                <p>
                  <span>响应速度：</span>
                  <span>{{ row.responseSpeedScore | toThousandsW }}</span>
                </p>
                <p>
                  <span>配合度：</span>
                  <span>{{ row.cooperationScore | toThousandsW }}</span>
                </p>
                <p>
                  <span>内容创意：</span>
                  <span>{{ row.contentCreativeScore | toThousandsW }}</span>
                </p>
                <p v-if="+row.intermediaryFlag">
                  <span>返点力度：</span>
                  <span>{{ row.rebateScore | toThousandsW }}</span>
                </p>
              </div>
            </template>
          </el-table-column>
        </template>
        <template v-if="type === 'xiaohongshu'">
          <el-table-column
            label="阅读中位数"
            prop="clickMidnum"
            width="120"
            sortable="custom"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30日日常笔记处于中间位置的阅读量"
                label="阅读中位数"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <span v-if="row.clickMidnum !== null">
                {{ row.clickMidnum | toThousandsW }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            label="互动中位数"
            prop="interMidnum"
            width="120"
            sortable="custom"
          >
            <template slot="header">
              <IconTip
                placement="top-start"
                width="200"
                trigger="hover"
                content="近30日日常笔记处于中间位置的互动量（点赞+收藏+评论）"
                label="互动中位数"
                icon-class="iconwenhao"
              />
            </template>
            <template slot-scope="{ row }">
              <span v-if="row.interMidnum !== null">
                {{ row.interMidnum | toThousandsW }}
              </span>
              <span v-else>--</span>
            </template>
          </el-table-column>
        </template>
        <el-table-column
          label="视频数据最近更新时间"
          prop="lastUpdateTime"
          width="120"
        >
          <template slot="header">
            <IconTip
              placement="top-start"
              width="200"
              trigger="hover"
              content="若抖音账号过期则视频数据最近更新时间离当前时间较长，请先联系账号主重新绑定！"
              label="视频数据最近更新时间"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="最近一次发布时间" prop="lastAddTime" width="170px">
          <template slot="header">
            <IconTip
              placement="top-start"
              width="200"
              trigger="hover"
              content="若最近一次发布时间离当前时间较长，可能是账号废弃或者被封！"
              label="最近一次发布时间"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column> -->
        <el-table-column
          v-if="extFields.numberOfTickets.status"
          label="工单数"
          prop="workerOrderCount"
          sortable="custom"
          width="90"
        >
          <template slot-scope="{ row }">
            <el-link type="primary" @click="handleToWorkerOrderPage(row)">{{
              row.workerOrderCount | toThousands
            }}</el-link>
          </template>
        </el-table-column>
        <!-- <el-table-column label="未完成工单" prop="notOverCount" sortable="custom" /> -->
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="s">
            <!-- <el-link v-if="$permission('bill_adv_edit') && +s.row.edit" v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }" class="m-r-5" type="primary" @click="handleEdit(s.row)">编辑</el-link>
            <el-link v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }" class="m-r-5" type="primary" @click="handleDetail(s.row)">账号详情</el-link> -->
            <!-- <el-link v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }" type="primary" @click="handleOrderTimes(s.row)">工单排期</el-link> -->
            <!-- <el-link v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }" type="primary" @click="handleToDq(s.row)">账号档期</el-link> -->
            <div
              style="
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <el-tooltip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                class="m-r-10"
                placement="top"
              >
                <div slot="content">账号档期</div>
                <div class="dangqi" @click="handleToDq(s.row)">档</div>
              </el-tooltip>
              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="账号详情"
                class="m-r-5"
                icon-class="iconxiangqing"
                @click="handleDetail(s.row)"
              />
              <IconTip
                v-if="$permission('bill_adv_edit') && +s.row.edit"
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="编辑"
                icon-class="iconbianji"
                @click="handleEdit(s.row)"
              />
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-size="pageSize"
          :total="total"
          :page-sizes="pageSizeList"
          :current-page.sync="searchData.pageNum"
          @size-change="handleSizeChange"
          @current-change="getList"
        />
      </div>
    </Wrap>

    <div
      :class="['ball', showBall && 'showBall']"
      :style="{
        top: `${elEect.top}px`,
        left: `${elEect.left}px`,
      }"
    >
      <img :src="accountImg">
    </div>

    <edit
      :data="editData"
      :edit-show.sync="editShow"
      :tag-value-list="tagValueList"
      @success="getList"
    />

    <AccountsCar
      :category="accountCarCategory"
      :list="accountCartVOList"
      :add-flag="addToAccountCarFlag"
      @delete="handleDelete"
      @deleteAll="handleDeleteAll"
      @syncOpportunities="handleSyncOpportunities"
      @export="onExport"
    />

    <el-dialog
      :visible="searchResultDialogShow"
      title="批量查找结果"
      @close="searchResultDialogShow = false"
    >
      <div>
        未能查询到以下账号：<br>
        {{ searchResultList.join(', ') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="searchResultDialogShow = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :visible="addAccountTagResultDialogShow"
      title="账号标签添加结果"
      @close="addAccountTagResultDialogShow = false"
    >
      <p>账号标签添加成功：{{ addAccountResultCount }}个</p>
      <br>
      <div v-if="(addAccountResultList || []).length">
        未能找到以下账号，请检查账号昵称是否有误：<br>
        {{ addAccountResultList.join(', ') }}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="addAccountTagResultDialogShow = false"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 我的商机弹窗 -->
    <el-dialog
      title="我的商机"
      width="80%"
      :visible.sync="syncOpportunitieDialogVisible"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      :before-close="handleCloseSyncOpportunitieDialog"
    >
      <el-form ref="form" label-position="left" :model="businessForm">
        <el-row :gutter="24">
          <el-col :span="6">
            <el-form-item label="商机号" prop="opNo" label-width="60px">
              <el-input v-model="businessForm.opNo" placeholder="商机号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户" prop="companyId" label-width="40px">
              <el-select
                v-model="businessForm.companyId"
                class="customerSelect"
                clearable
                filterable
              >
                <el-option
                  v-for="item in customerNameList"
                  :key="item.companyId"
                  :label="item.companyName"
                  :value="item.companyId"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="创建时间" prop="createTime" label-width="80px">
              <el-date-picker
                v-model="businessForm.createTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="handleChangeCreateTime"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="8">
          <el-col :span="4">
            <el-form-item>
              <el-button
                type="primary"
                @click="handleSearchBusiness"
              >搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="flex flex-justify-between">
        <div style="margin-bottom: 20px">
          仅展示<span style="color: red">"待找号，找号中"</span>状态下的商机
        </div>
        <span class="dialog-footer">
          <el-button
            @click="syncOpportunitieDialogVisible = false"
          >取消</el-button>
          <el-popover
            :disabled="selectOpportRows.length === 1 ? true : false"
            placement="top"
            width="200"
            trigger="hover"
            :content="disableBtnTipContent"
          >
            <el-button
              v-if="selectOpportRows.length === 1"
              slot="reference"
              :loading="syncCartLoading"
              type="primary"
              @click="handleSyncCartToOpport"
            >同步购物车账号</el-button>
            <el-button
              v-else
              slot="reference"
              class="disabledBtn"
              type="primary"
            >同步购物车账号</el-button>
          </el-popover>
        </span>
      </div>
      <el-table
        :data="syncOpportunitieData"
        border
        @selection-change="handleChangeSelection"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="opNo" label="商机号" width="160" />
        <el-table-column prop="companyName" label="客户">
          <template slot-scope="{ row }">
            {{ row.companyName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="customerName" label="联系人">
          <template slot-scope="{ row }">
            {{ row.customerName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="需求描述" width="300">
          <template slot-scope="{ row }">
            <!-- {{ row.description || '--' }} -->

            <el-tooltip
              popper-class="table-toolTip"
              :content="row.description"
              transition="none"
              placement="top"
            >
              <div class="toolTip-content">{{ row.description || '--' }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="260">
          <template slot-scope="{ row }">
            <el-tag v-if="row.isNew" size="small">最新</el-tag>
            {{ row.createdTime }}
          </template>
        </el-table-column>
        <template slot="empty">
          <a
            target="_blank"
            class="empty-link"
            @click="handleToBusiniess"
          >暂无符合的商机，点击前往商机管理，创建新商机</a>
        </template>
      </el-table>
    </el-dialog>

    <!-- 存在解约账号的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="hasTerminationDialogVisible"
      width="40%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div>
        <p>
          选号车中包括{{
            signOfflineList.length
          }}个已解约的签约账号，公司规定若非客户特别要求，不得与解约账号再次合作，确认继续把解约账号同步到商机？
        </p>

        <p class="terminationWrap">
          解约账号名称：
          <span v-for="(item, index) in signOfflineList" :key="item.id">
            {{ item.accountName }}（{{ item.platName }}）
            <i v-show="index !== signOfflineList.length - 1">、</i>
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelTerminate">取 消</el-button>
        <el-button
          plain
          type="danger"
          @click="handleConfirmTerminate"
        >确 定</el-button>
      </span>
    </el-dialog>

    <!-- 账号工单合作类型的弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="configSyncDialogVisible"
      width="50%"
      custom-class="configSyncDialog"
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <div>
        <div style="margin-bottom: 20px">
          视频工单账号
          <span style="color: red">{{
            accountCartListForConfig.filter(
              (item) => item.cooperateTypeValue === 1,
            ).length
          }}</span>
          个， 特殊工单账号
          <span style="color: red">{{
            accountCartListForConfig.filter(
              (item) => item.cooperateTypeValue === 2,
            ).length
          }}</span>
          个， 同步后，会清空选号车所有账号，是否继续？
        </div>
        <el-table v-loading="opportunityListLoading" :data="accountCartListForConfig" border>
          <el-table-column prop="accountName" label="账号名称" />
          <el-table-column prop="platName" label="平台" />
          <el-table-column prop="createdTime" label="合作类型">
            <template scope="{row}">
              <el-select
                v-model="row.cooperateTypeValue"
                placeholder="请选择"
                @change="
                  (value) =>
                    handleChangeCooperateTypeValue(value, row.accountId)
                "
              >
                <el-option
                  v-for="item in cooperateTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="createdTime" label="合作形式">
            <template slot-scope="{ row }">
              <el-select
                v-if="row.cooperateTypeValue === 2"
                v-model="row.cooperateFormValue"
                placeholder="请选择"
                @change="
                  (value) =>
                    handleChangeCooperateFormValue(value, row.accountId)
                "
              >
                <el-option
                  v-for="item in cooperateFormOptions"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                />
              </el-select>
            </template>
          </el-table-column>
          <!-- <template slot="empty">
            <a target="_blank" class="empty-link" @click="handleToBusiniess">暂无符合的商机，点击前往商机管理，创建新商机</a>
          </template> -->
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="configSyncDialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="confirmFindAccountLoading"
          @click="handleConfirmFindAccount"
        >确 定</el-button>
      </span>
    </el-dialog>

    <BatchSearchDialog
      :show="batchSearchDialogShow"
      :plat-list="normalFormItemMap.platId.data"
      :type="type"
      :batch-search-value="batchSearchValue"
      :plat-id="batchSearchPlatId"
      @close="batchSearchDialogShow = false"
      @search="handleSeachAccounts"
    />

    <AddAccountTagDialog
      :show="addAccountTagDialogShow"
      :plat-list="normalFormItemMap.platId.data"
      :type="type"
      :account-tag-list="editAccountFields"
      :tag-validity-list="tagValidityList"
      @close="addAccountTagDialogShow = false"
      @confirm="handleConfirmAddAccountTag"
    />

    <CalendarWrap
      :show="showCalendarDialog"
      :account-id="dqAccountId"
      :is-account-quotes-lib="true"
      :account-dq-msg="accountDqMsg"
      @closeCalendarWrap="showCalendarDialog = false"
    />

    <HistoryDialog
      :show="showHistoryDialog"
      :type="historyDialogType"
      :current-item="currentItem"
      @close="showHistoryDialog = false"
    />
  </div>
</template>
<script>
import qs from 'qs'
import Search from '@/components/Search'
import tableMixin from '@/mixins/table'
import Edit from './edit'
import BatchSearchDialog from './BatchSearchDialog'
import AddAccountTagDialog from './AddAccountTagDialog'
import AccountsCar from './AccountsCar'
import { AccountCard, IconTip, Select } from 'components'
import { objectMerge, deepClone, debounce, dateFormat } from '@/utils'
import { validNumWithWan } from '@/utils/validate'
import CalendarWrap from '@/views/sign-manage/@pages/sign-contract/accounts/_com/calendarWrap.vue'
import {
  $getTiktokBillAdvList,
  $getKuaishouBillAdvList,
  $getBilibiliBillAdvList,
  $getRedbookBillAdvList,
  $getOtherBillAdvList,
  $getTiktokFilterRang,
  $getKuaishouFilterRang,
  $getBilibiliFilterRang,
  $getRedbookFilterRang,
  $getOtherFilterRang,
  $getTiktokAccount,
  $getKuaishouAccount,
  $getBilibiliAccount,
  $getRedbookAccount,
  $getOtherAccount,
  $getAccountCarList,
  $addAccountCar,
  $deleteAccountCar,
  $deleteAllAccountCar,
  $getOrgList,
  $findSceneTags,
  $getHistoryIndustryTypeList,
  $getHistoryBrandList,
  $getFindingOpportunityList,
  $getFindAccountBySelf,
  $getAccountNameList,
  $getCityArea,
  $checkSignOffline,
  $getCustomerName
} from '@/api/bill-adv-manage'
import { $getMcnList } from '@/api/dy-manage'
import { $getDataByDictType, $getAera } from '@/api'
import { $getDictDataList } from '@/api/backend-manage'
import {
  responseSpeedOptions,
  cooperationOptions,
  contentCreativeOptions,
  rebateOptions
} from '../../@common/scoreOptions'
import HistoryDialog from './HistoryDialog.vue'

export default {
  components: {
    Search,
    AccountCard,
    IconTip,
    Edit,
    BatchSearchDialog,
    AccountsCar,
    AddAccountTagDialog,
    CalendarWrap,
    Select,
    HistoryDialog
  },
  mixins: [tableMixin],
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    let defaultCheckTableRow = ''
    if (this.type === 'douyin') {
      defaultCheckTableRow = ['sixPrice']
    } else if (this.type === 'kuaishou') {
      defaultCheckTableRow = ['sixPrice']
    } else if (this.type === 'bilibili') {
      defaultCheckTableRow = ['customVideoPrice']
    } else if (this.type === 'xiaohongshu') {
      defaultCheckTableRow = ['videoPrice']
    }

    return {
      collapseShow: false,
      formConf: {},
      normalFormItemMap: {},
      initAccountInfoList: [],
      tableData: [],
      extFields: {},
      searchAccountFields: [],
      editAccountFields: [],
      // extFields: {
      //   allQuotes: { status: false, chnName: '全部报价' },
      //   proportionOfFanPhones: { status: false, chnName: '粉丝手机占比' },
      //   talentRights: { status: false, chnName: '达人权益' },
      //   coopScoring: { status: false, chnName: '合作评分' },
      //   numberOfTickets: { status: false, chnName: '工单数' }
      //   // platName: { status: true, chnName: '平台' },
      //   // accountBelong: { status: false, chnName: '账号归属' },
      //   // tagName: { status: false, chnName: '内容类型' },
      //   // fansNum: { status: false, chnName: '粉丝量' },
      //   // twentySecondPrice: { status: false, chnName: '1-20s报价' },
      //   // sixPrice: { status: true, chnName: '21-60s报价' },
      //   // oversixtySecondPrice: { status: false, chnName: '60s以上报价' },
      //   // netPrice: { status: false, chnName: '全网报价' }
      // },
      searchData: {
        // qpOwn: 0,
        // hdOwn: 0,
        // signOwn: 0,
        // agencyOwn: 0,
        // deliveryOwn: 0,
        accountTagList: [],
        pageNum: 1,
        size: 20,
        filedIds: []
        // cpmInputStart: '',
        // cpmInputEnd: ''
      },
      editShow: false, // 编辑弹窗显隐
      batchSearchDialogShow: false,
      addAccountTagDialogShow: false,
      accountCarCategory: [
        {
          platId: 25,
          num: 0
        },
        {
          platId: 26,
          num: 0
        },
        {
          platId: 45,
          num: 0
        },
        {
          platId: 2,
          num: 0
        },
        {
          platId: 'other',
          num: 0
        }
      ],
      elEect: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0
      },
      accountImg: '',
      showBall: false,
      addToAccountCarFlag: false,
      accountCartVOList: [], // 购物车的账号数据
      accountCartListForConfig: [],
      selectFillFlag: false,
      searchResultDialogShow: false,
      searchResultList: [],
      addAccountTagResultDialogShow: false,
      addAccountResultList: [],
      addAccountResultCount: 0,
      loadMore: false,
      noMore: false,
      editData: {},
      tagInfo: {
        fansNumRange: {
          title: '粉丝量',
          data: [],
          hasCustom: true,
          all: true,
          selectIndex: 0,
          _status: false,
          _start: undefined,
          _end: undefined
        },
        twentySecondPriceRange: {
          title: '1-20s报价',
          data: [],
          hasCustom: true,
          all: true,
          selectIndex: 0,
          _status: false,
          _start: undefined,
          _end: undefined
        },
        sixPriceRange: {
          title: '21-60s报价',
          data: [],
          hasCustom: true,
          all: true,
          selectIndex: 0,
          _status: false,
          _start: undefined,
          _end: undefined
        },
        oversixtySecondPrice: {
          title: '60s以上报价',
          data: [],
          hasCustom: true,
          all: true,
          selectIndex: 0,
          _status: false,
          _start: undefined,
          _end: undefined
        },
        netPriceRange: {
          title: '全网报价',
          data: [],
          hasCustom: true,
          all: true,
          selectIndex: 0,
          _status: false,
          _start: undefined,
          _end: undefined
        }
      },
      nealy7ThumbUpAvgList: [],
      tagValueList: [], // 内容类别
      tagIndex: 0,
      checkList: [],
      tagCheckList: [],
      provList: [],
      fansList: [],
      expectedPlaybackList: [],
      cpmList: [],
      cpeList: [],
      sixPriceList: [],
      historyIndustryTypeList: [],
      cartEntitlementList: [
        {
          dictLabel: '付费',
          dictValue: 0
        },
        {
          dictLabel: '免费',
          dictValue: 1
        }
      ],
      streamingBenefitsList: [
        {
          dictLabel: '付费',
          dictValue: 0
        },
        {
          dictLabel: '免费',
          dictValue: 1
        }
      ],
      offlineBusinessBillRightsList: [
        {
          dictLabel: '不接受线下商单',
          dictValue: 0
        },
        {
          dictLabel: '接受线下商单',
          dictValue: 1
        }
      ],
      coopStatusList: [
        {
          dictLabel: '解约',
          dictValue: 1
        },
        {
          dictLabel: '拉黑',
          dictValue: 2
        }
      ],
      accountAttributionList: [
        {
          dictLabel: '乾派自营账号',
          dictValue: 'qpOwn'
        },
        {
          dictLabel: '签约账号',
          dictValue: 'signOwn'
        },
        {
          dictLabel: '媒介账号',
          dictValue: 'agencyOwn'
        },
        {
          dictLabel: '海盗自营账号',
          dictValue: 'hdOwn'
        },
        {
          dictLabel: '投放账号',
          dictValue: 'deliveryOwn'
        }
      ],
      sixRange: [],
      mcnList: [],
      avgFlowWeeksList: [],
      ageRangeList: [],
      fansAgeRangeList: [],
      phoneSysRange: [],
      accountTagList: [],
      tagValidityList: [],
      idKey: 'accountId',
      tagOpen: false, // 内容类别展开关闭
      isTagCheck: false, // 内容类别多选
      contentTagEffect: {},
      contentTagType: {},
      responseSpeedOptions,
      cooperationOptions,
      contentCreativeOptions,
      rebateOptions,
      checkTableRow: defaultCheckTableRow,
      showCalendarDialog: false,
      dqAccountId: 0,
      accountDqMsg: {},
      showHistoryDialog: false,
      historyDialogType: '',
      currentItem: {},
      syncOpportunitieDialogVisible: false,
      configSyncDialogVisible: false,
      hasTerminationDialogVisible: false,
      syncOpportunitieData: [],
      selectOpportRows: [],
      batchSearchValue: [],
      batchSearchLoading: false,
      batchSearchPlatId: '',
      fansCitys: [],
      cooperateTypeOptions: [
        {
          value: 1,
          label: '视频工单'
        },
        {
          value: 2,
          label: '特殊工单'
        }
      ],
      cooperateFormOptions: [],
      signOfflineList: [], // 解约账号名称数据
      confirmFindAccountLoading: false,
      syncCartLoading: false, // 同步购物车按钮的按钮loading
      pageSize: 50,
      pageSizeList: [50, 100],
      businessForm: {
        opNo: '',
        companyId: '',
        customerId: '',
        createTime: ''
      },
      customerNameList: [],
      opportunityListLoading: true
    }
  },
  computed: {
    checkTableRowShow() {
      return this.checkTableRow.reduce((n, t) => {
        n[t] = true
        return n
      }, {})
    },
    getPlatPriceTip() {
      let plat = ''
      switch (this.type) {
        case 'douyin':
          plat = '星图'
          break
        case 'kuaishou':
          plat = '磁力巨星'
          break
        case 'bilibili':
          plat = '花火'
          break
        case 'xiaohongshu':
          plat = '小红书'
          break
      }
      return plat
        ? `账号报价来源于${plat}平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。`
        : ''
    },
    pricePlaceholder() {
      let text = '报价'
      switch (this.type) {
        case 'douyin':
        case 'kuaishou':
        case 'other':
          text = '21-60s报价'
          break
        case 'bilibili':
          text = '定制视频报价'
          break
        case 'xiaohongshu':
          text = '视频笔记报价'
          break
      }
      return text
    },
    disableBtnTipContent() {
      const selectOpportRowsLen = this.selectOpportRows.length
      if (!selectOpportRowsLen) {
        return '请选择一个商机信息'
      } else {
        if (selectOpportRowsLen > 1) {
          return '仅能选择一个商机信息'
        }
      }
      return '请选择一个商机信息'
    }
  },
  watch: {
    type: {
      immediate: true,
      handler(val) {
        const obj = {
          allQuotes: { status: false, chnName: '全部报价' },
          proportionOfFanPhones: { status: false, chnName: '粉丝手机占比' },
          talentRights: { status: true, chnName: '达人权益' },
          coopScoring: { status: false, chnName: '合作评分' },
          numberOfTickets: { status: false, chnName: '工单数' }
        }
        if (val !== 'douyin' && val !== 'kuaishou') {
          delete obj['proportionOfFanPhones']
        }
        this.extFields = obj
      }
    }
  },
  created() {
    this.searchData.accountTypeFlag = ['qpOwn', 'signOwn']
    // this.searchData.signOwn = 1
    this.getFindSceneTags()
    this.getAccountCarList()
    this.buildFormConf()
    this.getList()
    this.getFilterRang()
    this.getPlatAndAccount()
    this.checkAllList = []
    this.debounceList = debounce(this.getList, 1000, false)
    this.getArea().then((res) => {
      this.provList = res.data
    })
    this.getSeachConfigList()
    this.getMcnList()
    this.getDictDataList()
    this.getOrgList()
    this.getHistoryIndustryTypeList()
    this.getHistoryBrandList()
    this.getCityArea()
  },
  mounted() {
    const { platId, opId, feishuId } = this.$route.query
    this.$set(this.$refs.search.form, 'accountTypeFlag', ['qpOwn', 'signOwn'])
    if (platId && (opId || feishuId)) {
      this.batchSearchPlatId = platId
      this.getAccountNameList({ platId, opId, feishuId })
    }
  },
  beforeDestroy() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.getList()
    },
    handleToBusiniess() {
      this.$router.push({
        path: `/qp/business-opportunity-manage?from=billAdvManage`,
        query: {
          _blank: true
        }
      })
    },
    async getCityArea() {
      const res = await $getCityArea()
      if (res.code === 1 && res.data) {
        this.fansCitys = res.data
      }
    },
    async getAccountNameList(params) {
      this.batchSearchLoading = true
      try {
        const { code, data } = await $getAccountNameList(params)
        this.batchSearchLoading = false
        if (+code === 1) {
          if (!(data || []).length) {
            this.$message.error('当前平台下没有账号')
            return
          }
          this.batchSearchValue = data
          this.batchSearchDialogShow = true
        } else {
          this.$message.error('获取当前商机账号失败，请刷新重试！')
        }
      } catch (e) {
        this.batchSearchLoading = false
      }
    },

    async getHistoryIndustryTypeList() {
      const { code, data } = await $getHistoryIndustryTypeList()
      if (+code === 1) {
        this.historyIndustryTypeList = data || []
      }
    },

    async getHistoryBrandList() {
      const { code, data } = await $getHistoryBrandList({
        page: 1,
        size: 100000
      })
      if (+code === 1) {
        this.normalFormItemMap.brandId.data = data || []
      }
    },

    getExpectCpm(expectCpm) {
      if (expectCpm === null || Number(expectCpm) === -1) {
        return '--'
      }
      if (!expectCpm) {
        expectCpm = 0
      }
      expectCpm = String(expectCpm).split('.')
      const postfix = expectCpm.length > 1 ? '.' + expectCpm.pop() : ''
      expectCpm = expectCpm[0]
      return expectCpm.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + postfix
    },

    getFindSceneTags() {
      $findSceneTags({
        operationScene: [
          'accountQuoteLibraryForSearch',
          'accountQuoteLibraryForEdit'
        ]
      }).then((res) => {
        if (res.code === 1) {
          // console.log(res.data, 'res.data')
          this.searchAccountFields = res.data.accountQuoteLibraryForSearch
          this.editAccountFields = res.data.accountQuoteLibraryForEdit
          // console.log(this.accountFields, 'accountFields')
        }
      })
    },
    getDictDataList() {
      $getDictDataList({ dictType: 'daren_age_range' }).then((res) => {
        if (res.code === 1) {
          // console.log(res)
          this.ageRangeList = res.data
        }
      })
    },
    getMcnList() {
      $getMcnList().then((res) => {
        if (res.code === 1) {
          this.mcnList = res.data.mcnNameList
        }
      })
    },
    // 获取搜索配置项下拉数据
    getSeachConfigList() {
      $getDataByDictType({
        dictTypes: [
          'sys_library_search_cpm',
          'sys_library_search_cpe',
          'fans_age_kuaishou_condition_age',
          'daren_library_query_condition_phone',
          'daren_library_query_condition_fans',
          'daren_library_query_condition_60s',
          'daren_library_query_condition_sex',
          'daren_library_query_condition_sex_rate',
          'account_price_avg_like',
          'account_price_avg_flow',
          'account_feature_qp',
          'account_feature_deadline',
          'expect_play_volume_range',
          'special_order_coop_type'
        ]
      }).then((res) => {
        if (res.code === 1) {
          this.fansList = res.data.daren_library_query_condition_fans
          this.expectedPlaybackList = res.data.expect_play_volume_range
          this.cpmList = res.data.sys_library_search_cpm
          this.cpeList = res.data.sys_library_search_cpe
          this.sixPriceList = res.data.daren_library_query_condition_60s
          this.accountTagList = res.data.account_feature_qp
          this.tagValidityList = res.data.account_feature_deadline
          this.fansAgeRangeList = res.data.fans_age_kuaishou_condition_age
          this.phoneSysRange = res.data.daren_library_query_condition_phone
          this.avgFlowWeeksList = res.data.account_price_avg_flow
          this.nealy7ThumbUpAvgList = res.data.account_price_avg_like
          this.sixRange = res.data.daren_library_query_condition_sex.map(
            (item) => ({
              ...item,
              children: res.data.daren_library_query_condition_sex_rate
            })
          )
          this.cooperateFormOptions = res.data.special_order_coop_type
        }
      })
    },
    buildFormConf() {
      const formConf = {
        normal: [
          // {
          //   type: 'cascader',
          //   key: 'orgId',
          //   data: [],
          //   conf: {
          //     placeholder: '选择账号归属',
          //     props: { multiple: true, value: 'id', label: 'orgName', children: 'childOrgList' },
          //     collapseTags: true
          //     // props: { value: 'dictValue', label: 'dictLabel', emitPath: true, checkStrictly: true }
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'orgName'
          // },
          {
            type: 'select',
            key: 'platId',
            data: [],
            conf: {
              placeholder: '全部平台',
              hidden: this.type !== 'other'
            },
            optionValKey: 'platId',
            optionLabelKey: 'platName'
          },
          {
            type: 'select',
            key: 'accountId',
            data: [],
            conf: {
              placeholder: '请选择账号',
              hasAccount: false
            },
            optionValKey: 'accountId',
            optionLabelKey: 'accountName'
          }
          // {
          //   type: 'select',
          //   key: 'cpm',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择cpm'
          //   },
          //   optionValKey: 'dictValue',
          //   optionLabelKey: 'dictLabel'
          // }
        ],
        hasExport: false
      }

      this.formConf = formConf
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        normalFormItemMap[item.key] = item
      })

      normalFormItemMap.brandId = {
        type: 'select',
        key: 'brandId',
        data: [],
        conf: {
          placeholder: '历史合作品牌',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'newsContent'
      }

      this.normalFormItemMap = normalFormItemMap
    },
    getPlatAndAccount(platId) {
      let request = ''

      if (this.type === 'douyin') {
        request = $getTiktokAccount
      } else if (this.type === 'kuaishou') {
        request = $getKuaishouAccount
      } else if (this.type === 'bilibili') {
        request = $getBilibiliAccount
      } else if (this.type === 'xiaohongshu') {
        request = $getRedbookAccount
      } else if (this.type === 'other') {
        request = $getOtherAccount
      }

      request({ platId })
        .then((res) => {
          if (res) {
            if (res.code === 1) {
              if (!platId && this.type === 'other') {
                this.normalFormItemMap.platId.data = res.data.platInfoList
                this.initAccountInfoList = res.data.platInfoList
              }
              this.normalFormItemMap.accountId.data = res.data.accountInfo
            }
          }
        })
        .catch((err) => {})
    },
    getFilterRang() {
      let request = ''
      if (this.type === 'douyin') {
        request = $getTiktokFilterRang
      } else if (this.type === 'kuaishou') {
        request = $getKuaishouFilterRang
      } else if (this.type === 'bilibili') {
        request = $getBilibiliFilterRang
      } else if (this.type === 'xiaohongshu') {
        request = $getRedbookFilterRang
      } else if (this.type === 'other') {
        request = $getOtherFilterRang
      }

      request()
        .then((res) => {
          if (res) {
            if (res.code === 1) {
              for (const key in this.tagInfo) {
                this.tagInfo[key].data = res.data[key] || []
                if (this.tagInfo[key].all) {
                  this.tagInfo[key].data.unshift('全部')
                }
              }

              // const initChecked = (list) => {
              //   return list.map(item => {
              //     const newItem = { ...item }
              //     if ((item.childNodeTags || []).length) {
              //       initChecked(item.childNodeTags)
              //     } else {
              //       newItem.checked = false
              //     }
              //     console.info('-asdasdasdasd', newItem)
              //     return newItem
              //   })
              // }

              this.tagValueList = res.data.sysPlatTags || []
              // initChecked(this.tagValueList)
              this.tagValueList.unshift({
                tagId: '',
                tagName: '全部'
              })
              // this.$nextTick(() => {
              //   console.info('-asdasdasdasd', this.tagValueList)
              // })
            } else {
              this.$message.error(res.error)
            }
          }
        })
        .catch((err) => {})
    },

    handleSelect(selection, row) {},

    getCartInterest(row) {
      let result = ''
      const {
        isFree,
        commissionRatio,
        isHasCommission,
        trailerAdditionalPrice
      } = row.talentInterest.cartInterest
      result = [
        !+isFree ? '付费' : +isFree === 1 ? '免费' : '',
        +isFree !== 1 ? `${trailerAdditionalPrice}元` : '',
        isHasCommission ? '有佣金要求' : '无佣金要求',
        isHasCommission ? `${commissionRatio || 0}%` : ''
      ]
        .filter((item) => item !== '')
        .join('-')

      return result
    },

    getMsgFlowInterest(row) {
      let result = ''
      const { isFree, msgAdditionalPrice, msgDuration } =
        row.talentInterest.msgFlowInterest
      result = [
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

      return result
    },

    splitStr(str) {
      function judegStrWidthWan(str1) {
        if (
          typeof str1 === 'string' &&
          (str1.lastIndexOf('w') !== -1 || str1.lastIndexOf('万') !== -1)
        ) {
          return validNumWithWan(str1)
        } else {
          return str1
        }
      }
      const start = str.split('-')[0]
      const end = str.split('-')[1] || ''
      return [judegStrWidthWan(start), judegStrWidthWan(end)]
    },

    getList(p) {
      this.loading = true
      this.selectFillFlag = true
      this.checkList = []
      const params = deepClone(this.searchData)
      // console.log(params, 'params')
      params.tagName = params.tagName === '全部' ? '' : params.tagName
      if (params.fansNumRange) {
        const arr = this.splitStr(params.fansNumRange)
        params.fansNumRangeStart = arr[0]
        params.fansNumRangeEnd = arr[1]
        // params.fansNumRangeStart = params.fansNumRange.split('-')[0]
        // params.fansNumRangeEnd = params.fansNumRange.split('-')[1] || ''
        delete params.fansNumRange
      }
      if (params.expectedPlayback) {
        const arr = this.splitStr(params.expectedPlayback)
        params.expectPlayVolumeStart = +arr[0]
        params.expectPlayVolumeEnd = +arr[1]
        // params.expectedPlaybackStart = params.expectedPlayback.split('-')[0]
        // params.expectedPlaybackEnd = params.expectedPlayback.split('-')[1] || ''
        delete params.expectedPlayback
      }
      if (params.avgFlowWeeks) {
        const arr = this.splitStr(params.avgFlowWeeks)
        params.avgFlowWeeksStart = +arr[0]
        params.avgFlowWeeksEnd = +arr[1]
        // params.avgFlowWeeksStart = params.avgFlowWeeks.split('-')[0]
        // params.avgFlowWeeksEnd = params.avgFlowWeeks.split('-')[1] || ''
        delete params.avgFlowWeeks
      }
      if (params.nealy7ThumbUpAvg) {
        const arr = this.splitStr(params.nealy7ThumbUpAvg)
        params.nealy7ThumbUpAvgStart = +arr[0]
        params.nealy7ThumbUpAvgEnd = +arr[1]
        // params.nealy7ThumbUpAvgStart = params.nealy7ThumbUpAvg.split('-')[0]
        // params.nealy7ThumbUpAvgEnd = params.nealy7ThumbUpAvg.split('-')[1] || ''
        delete params.nealy7ThumbUpAvg
      }
      if (params.cpm) {
        const arr = this.splitStr(params.cpm)
        params.expectCpmStart = +arr[0]
        params.expectCpmEnd = +arr[1]
        // params.cpmStart = params.cpm.split('-')[0]
        // params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }

      if (params.cpe) {
        const arr = this.splitStr(params.cpe)
        params.expectCpe2160Start = +arr[0]
        params.expectCpe2160End = +arr[1]
        delete params.cpe
      }

      if (params.sixPriceRange) {
        const arr = this.splitStr(params.sixPriceRange)
        params.sixPriceRangeStart = arr[0]
        params.sixPriceRangeEnd = arr[1]
        // params.sixPriceRangeStart = params.sixPriceRange.split('-')[0]
        // params.sixPriceRangeEnd = params.sixPriceRange.split('-')[1] || ''
        delete params.sixPriceRange
      }
      if (params.region && params.region.length) {
        params.provinceName = params.region[0]
        params.cityName = params.region[1]
        delete params.region
      }
      if (params.sixRange) {
        params.maxSexLabel = params.sixRange[0]
        params.maxSexRate = params.sixRange[1]
        delete params.sixRange
      }
      if (params.orgId) {
        params.orgId = params.orgId.map((item) => item[item.length - 1])
      }
      if (!params.accountTypeFlag || !params.accountTypeFlag.length) {
        params.accountTypeFlag = 0
      } else if (params.accountTypeFlag.length) {
        params.accountTypeFlag.forEach((item) => {
          params[item] = 1
        })
        params.accountTypeFlag = 1
      }

      // 处理解约账号的传参
      if (params.signOffline) {
        params.signOffline = 1
      } else {
        params.signOffline = 0
      }

      // this.changePageCoreRecordData()
      if (p instanceof Object) {
        const { accounts, plat } = p
        params.accountNameList = accounts
        params.platId = plat
      }
      if (params.fansCity && params.fansCity.length === 2) {
        params.fansCity = params.fansCity[params.fansCity.length - 1]
      } else {
        params.fansCity = ''
      }
      params.size = this.pageSize
      delete params.fansInputStart
      delete params.fansInputEnd
      delete params.expectedPlaybackInputStart
      delete params.expectedPlaybackInputEnd
      delete params.avgFlowWeeksInputStart
      delete params.avgFlowWeeksInputEnd
      delete params.nealy7ThumbUpAvgInputStart
      delete params.nealy7ThumbUpAvgInputEnd
      delete params.sixPriceInputStart
      delete params.sixPriceInputEnd
      let request = ''

      if (this.$refs.cascader1) {
        params.filedIds = this.$refs.cascader1
          .getCheckedNodes()
          .filter((item) => !item.hasChildren)
          .map((item) => {
            return item.data.tagId
          })
      }

      if (this.type === 'douyin') {
        request = $getTiktokBillAdvList
      } else if (this.type === 'kuaishou') {
        request = $getKuaishouBillAdvList
      } else if (this.type === 'bilibili') {
        params.customVideoPriceRange = params.sixPriceRange
        delete params.sixPriceRange
        request = $getBilibiliBillAdvList
      } else if (this.type === 'xiaohongshu') {
        params.videoPriceRange = params.sixPriceRange
        delete params.sixPriceRange
        request = $getRedbookBillAdvList
      } else if (this.type === 'other') {
        request = $getOtherBillAdvList
      }

      params.tagNameList = (params.tagName || '')
        .split(',')
        .filter((item) => item)
      delete params.tagName
      // console.log(params, 'params')
      request(params)
        .then((res) => {
          this.selectFillFlag = false
          if (res) {
            if (res.code === 1) {
              if (this.type === 'douyin') {
                this.tableData = res.data.workOrderAccountVOList || []
              } else if (this.type === 'kuaishou') {
                this.tableData = res.data.accountQuoteKuaiShouVOList || []
              } else if (this.type === 'bilibili') {
                this.tableData = res.data.accountQuoteBliVOList || []
              } else if (this.type === 'xiaohongshu') {
                this.tableData = res.data.accountQuoteRedBookVOList || []
              } else if (this.type === 'other') {
                this.tableData = res.data.accountQuoteOtherPlatVOS || []
              }

              this.total = res.data.total
              if (this.total > 100) {
                this.pageSizeList = [50]
                const l =
                  parseInt(this.total / 100) + (this.total % 100 > 0 ? 1 : 0)
                for (let i = 1; i <= l; i++) {
                  this.pageSizeList.push(i * 100)
                }
              } else {
                this.pageSizeList = this.total > 50 ? [50, 100] : [50]
              }
              if ((res.data.accountNameList || []).length) {
                this.searchResultList = res.data.accountNameList
                this.searchResultDialogShow = true
              }
              this.$nextTick(() => {
                this.setSelectRow()
              })
            } else if (res.message) {
              this.$message.error(res.message)
            }
            this.loading = false
          }
        })
        .catch((err) => {
          this.selectFillFlag = false
          if (err.__CANCEL__) {
            return
          }
          if (err.message) {
            this.$message.error(err.message)
          }
          this.loading = false
        })
    },

    async getAccountCarList() {
      try {
        const { code, data, message } = await $getAccountCarList()
        if (+code === 1) {
          const {
            douYinAccountTotal = 0,
            kuaiShouAccountTotal = 0,
            bliAccountTotal = 0,
            redBookAccountTotal = 0,
            otherAccountTotal = 0,
            accountCartVOList = []
          } = data

          this.accountCarCategory = [
            {
              platId: 25,
              num: douYinAccountTotal
            },
            {
              platId: 26,
              num: kuaiShouAccountTotal
            },
            {
              platId: 45,
              num: redBookAccountTotal
            },
            {
              platId: 2,
              num: bliAccountTotal
            },
            {
              platId: 'other',
              num: otherAccountTotal
            }
          ]

          this.accountCartVOList = accountCartVOList || []
          this.accountCartListForConfig = [...accountCartVOList]
          this.accountCartListForConfig = this.accountCartListForConfig.map(
            (item) => {
              item.cooperateTypeValue = 1
              item.cooperateFormValue = undefined
              return item
            }
          )
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.$message.error(e || '获取选号车出错，请重试')
      }
    },

    onSubmit(data) {
      objectMerge(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'platId') {
        this.normalFormItemMap.accountId.data = []
        this.getPlatAndAccount(val)
      }
    },
    onExport(data) {
      const params = {}
      // if (params.cpm) {
      //   params.cpmStart = params.cpm.split('-')[0]
      //   params.cpmEnd = params.cpm.split('-')[1] || ''
      //   delete params.cpm
      // }
      const propertyNameList = []
      for (const key in this.extFields) {
        if (!this.extFields[key].status) {
          propertyNameList.push(key)
        }
      }
      let arr = []
      if (this.type === 'douyin') {
        arr = [
          'sixPrice',
          'twentySecondPrice',
          'oversixtySecondPrice',
          'netPrice'
        ]
      } else if (this.type === 'kuaishou') {
        arr = ['sixPrice', 'netPrice']
      } else if (this.type === 'bilibili') {
        arr = [
          'customVideoPrice',
          'implantationVideoPrice',
          'directVideoPrice',
          'forwardSituationPrice'
        ]
      } else if (this.type === 'xiaohongshu') {
        arr = ['videoPrice', 'picturePrice']
      } else if (this.type === 'other') {
        arr = ['sixPrice']
      }

      arr.forEach((item) => {
        const index = (this.checkTableRow || []).findIndex((it) => it === item)
        if (index <= -1) {
          propertyNameList.push(item)
        }
      })

      params.propertyNameList = propertyNameList.join(',')

      if (params.orgId) {
        params.orgId = params.orgId.map((item) => item[item.length - 1])
      }

      // this.changePageCoreRecordData()
      const accountIdList = [...(this.accountCartVOList || [])]
      if (accountIdList.length <= 0) {
        this.$message.warning('请选择要导出的数据')
        return
      }
      params.accountIdList = accountIdList
        .map((item) => item.accountId)
        .join(',')

      if (this.$refs.cascader1) {
        params.filedIds = this.$refs.cascader1
          .getCheckedNodes()
          .filter((item) => !item.hasChildren)
          .map((item) => {
            return item.data.tagId
          })
      }

      location.href = `/api/mid/user/account/cart/downloadAccountQuoteLibraryCart?${qs.stringify(
        params
      )}&componentId=${this.$componentId}`
    },
    // onAllExport(data) {
    //   const params = objectMerge(data, this.searchData)
    //   if (params.cpm) {
    //     params.cpmStart = params.cpm.split('-')[0]
    //     params.cpmEnd = params.cpm.split('-')[1] || ''
    //     delete params.cpm
    //   }
    //   location.href = `/api/work/order/downloadWorkerOrderAccount?${qs.stringify(params)}&componentId=${this.$componentId}&outPutType=2`
    // },
    handleClickTag(item, index) {
      if (index !== this.tagInfo[item].selectIndex) {
        this.tagInfo[item].selectIndex = index
        this.tagInfo[item]._status = false
        this.tagInfo[item]._start = undefined
        this.tagInfo[item]._end = undefined
        this.searchData[item] =
          this.tagInfo[item].data[index] === '全部'
            ? ''
            : this.tagInfo[item].data[index]
        this.searchData.pageNum = 1
        this.getList()
      }
    },
    handleSeachAccounts(arr) {
      this.$refs.search.form = {
        ...this.$refs.search.form,
        platId: arr.plat
      }
      this.getList(arr)
    },
    // 内容类别点击
    hanleClickTagVal(index, tagName) {
      this.tagIndex = index
      this.searchData.pageNum = 1
      this.searchData.tagName =
        tagName === '全部' ? '' : tagName.replace(/^\s+|\s+$/g, '')
      this.tagCheckList = []
      this.getList()
    },

    handleClickParentTag(parent) {
      if (parent.tagName === '全部') {
        this.tagCheckList = []
        this.searchData.pageNum = 1
        this.searchData.tagName = ''
        this.contentTagEffect = {}
        this.contentTagType = {}
        this.debounceList()
        return
      }

      let tagCheckList = [...this.tagCheckList]
      if ((parent.childNodeTags || []).length) {
        let checkNum = 0
        parent.childNodeTags.forEach((item) => {
          const index = tagCheckList.findIndex((it) => it === item.tagName)
          if (index <= -1) {
            tagCheckList.push(item.tagName)
          } else {
            checkNum++
          }
        })
        tagCheckList.push(parent.tagName)
        // 已经全选, 去除全选
        if (checkNum === parent.childNodeTags.length) {
          parent.childNodeTags.forEach((item) => {
            const parentIndex = tagCheckList.indexOf(parent.tagName)
            if (parentIndex !== -1) {
              tagCheckList[parentIndex] = ''
            }
            const index = tagCheckList.findIndex((it) => it === item.tagName)
            tagCheckList[index] = ''
          })
        }

        tagCheckList = tagCheckList.filter((item) => item)

        this.checkEffectAndType(tagCheckList, parent)
      } else {
        const index = tagCheckList.findIndex((it) => it === parent.tagName)
        if (index <= -1) {
          tagCheckList.push(parent.tagName)
        } else {
          tagCheckList.splice(index, 1)
        }
      }

      this.tagCheckList = tagCheckList
      this.searchData.tagName = tagCheckList
        .map((item) => item.replace(/^\s+|\s+$/g, ''))
        .join(',')
      this.debounceList()
    },

    // 跳转到对应的工单列表
    handleToWorkerOrderPage(row) {
      this.$router.push({
        path: `/bussiness-manage/workorder`,
        query: {
          platId: row.platId,
          accountId: row.accountId,
          activeName: 'order',
          tabName: '视频工单',
          _blank: true
        }
      })
    },

    // 编辑
    handleEdit(row) {
      this.editShow = true
      this.editData = row
    },
    // 查看账号详情
    handleDetail(row) {
      if ([25, 26].includes(row.platId)) {
        this.$router.push({
          path: `/details/account/${row.platId}/${row.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (row.platId === 2) {
        // b站的用户详情信息
        this.$router.push({
          path: `/details/bilibili-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else if (row.platId === 45) {
        // 小红书账号详情页
        this.$router.push({
          path: `/details/red-book-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else {
        window.open(
          `#/account-manage/account-detail?accountId=${row.accountId}&accountType=${row.accountType}&source=1`
        )
      }
    },
    // 查看工单排期
    // handleOrderTimes(row) {
    //   window.open(`#/bussiness-manage/bill-adv-schedule?accountId=${row.accountId}`)
    //   // this.$router.push({
    //   //   path: `/bussiness-manage/bill-adv-schedule?accountId=${row.accountId}`
    //   // })
    // },
    // 查看对应的档期
    handleToDq(row) {
      // console.log(row, 'row')
      this.dqAccountId = +row.accountId
      this.showCalendarDialog = true
      this.accountDqMsg = row
    },
    // 设置选中回显
    setSelectRow() {
      const accountCartVOList = [...this.accountCartVOList]
      if (!accountCartVOList.length) {
        return
      }

      this.selectFillFlag = true

      this.$nextTick(() => {
        const checkList = []
        for (var i = 0; i < this.tableData.length; i++) {
          if (
            accountCartVOList.findIndex(
              (item) => +item.accountId === +this.tableData[i].accountId
            ) > -1
          ) {
            this.$refs.table.toggleRowSelection(this.tableData[i])
            checkList.push(this.tableData[i])
          } else {
            this.$refs.table.toggleRowSelection(this.tableData[i], false)
          }
        }
        this.checkList = checkList
        this.selectFillFlag = false
      })
    },
    // 设置选中值
    changePageCoreRecordData() {
      if (this.checkList.length <= 0) {
        return
      }
      const idKey = this.idKey
      const selectIds = this.checkList.map((item) => item[idKey])
      const noSelectIds = this.tableData.reduce((t, n) => {
        if (!selectIds.includes(n[idKey])) {
          t.push(n[idKey])
          return t
        }
        return t
      }, [])
      selectIds.forEach((item) => {
        if (!this.checkAllList.includes(item)) {
          this.checkAllList.push(item)
        }
      })
      noSelectIds.forEach((item) => {
        const index = this.checkAllList.findIndex((a) => a === item)
        if (index > 0) {
          this.checkAllList.splice(index, 1)
        }
      })
      // this.checkList = []
    },
    // 取消内容类别多选
    handleTagCancel() {
      this.isTagCheck = !this.isTagCheck
      this.searchData.tagName = ''
      this.tagIndex = 0
      // if (!this.isTagCheck) {
      //   // 取消多选
      //   this.searchData.tagName = this.tagValueList[this.tagIndex].tagName
      // } else {
      //   this.searchData.tagName = this.tagCheckList.join(',')
      // }
      this.getList()
      // this.searchData.tagName = ''
      this.tagCheckList = []
    },

    checkEffectAndType(tagCheckList, parent) {
      let checkNum = 0;
      (parent.childNodeTags || []).forEach((item) => {
        if (tagCheckList.findIndex((it) => it === item.tagName) > -1) {
          checkNum++
        }
      })

      let flag = false

      if ((parent.childNodeTags || []).length) {
        if (checkNum === 0) {
          this.contentTagEffect[parent.md5Id] = 'plain'
          this.contentTagType[parent.md5Id] = ''
        } else if (checkNum < parent.childNodeTags.length) {
          this.contentTagEffect[parent.md5Id] = 'light'
          this.contentTagType[parent.md5Id] = 'notInfo'
        } else if (checkNum === parent.childNodeTags.length) {
          this.contentTagEffect[parent.md5Id] = 'dark'
          this.contentTagType[parent.md5Id] = 'notInfo'
          flag = true
        }
      }

      return flag
    },

    handleChangeChildTags(child, parent) {
      const tagCheckList = [...this.tagCheckList]
      const index = tagCheckList.findIndex((item) => item === child.tagName)
      if (index > -1) {
        tagCheckList.splice(index, 1)
      } else {
        tagCheckList.push(child.tagName)
      }

      const indexOfParent = tagCheckList.indexOf(parent.tagName)

      const res = this.checkEffectAndType(tagCheckList, parent)

      if (!res && indexOfParent !== -1) {
        tagCheckList.splice(indexOfParent, 1)
      } else if (res && indexOfParent === -1) {
        tagCheckList.push(parent.tagName)
      }

      this.tagCheckList = tagCheckList
      this.searchData.tagName = tagCheckList
        .map((item) => item.replace(/^\s+|\s+$/g, ''))
        .join(',')
      this.debounceList()
      // console.info("ccccc", child, parent)
    },

    async addAccountCar(arr, selection) {
      try {
        this.loading = true
        const { code, message } = await $addAccountCar({
          accountIdList: arr.map((item) => +item.accountId)
        })
        this.loading = false

        if (+code === 1) {
          this.getAccountCarList()
          this.$nextTick(() => {
            this.showBall = true
            this.addToAccountCarFlag = true
            setTimeout(() => {
              this.showBall = false
            }, 600)
          })
          this.checkList = selection
        } else {
          this.$message.error(message)
        }
      } catch (e) {
        this.loading = false
        this.$message.error(e || '添加失败，请重试')
      }
    },

    async deleteAccountCar(arr, selection) {
      try {
        this.loading = true
        this.selectFillFlag = true
        this.$nextTick(async() => {
          const { code, message } = await $deleteAccountCar({
            accountIdList: arr.map((item) => +item.accountId)
          })
          this.loading = false

          if (+code === 1) {
            this.getAccountCarList()

            for (var i = 0; i < arr.length; i++) {
              const index = this.tableData.findIndex(
                (item) => +item.accountId === +arr[i].accountId
              )
              this.$refs.table.toggleRowSelection(this.tableData[index], false)
            }

            this.checkList = selection
          } else {
            this.$message.error(message)
          }
          this.$nextTick(() => {
            this.selectFillFlag = false
          })
        })
      } catch (e) {
        this.loading = false
        this.selectFillFlag = false
        this.$message.error(e || '删除失败，请重试')
      }
    },

    async handleDelete(accountId) {
      const checkList = [...this.checkList]
      const deleteIndex = checkList.findIndex(
        (item) => +item.accountId === +accountId
      )
      checkList.splice(deleteIndex, 1)
      this.deleteAccountCar([{ accountId }], checkList)
    },

    handleDeleteAll() {
      this.$confirm('是否要清空选号车?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          try {
            this.loading = true
            this.selectFillFlag = true

            this.$nextTick(async() => {
              const { code, message } = await $deleteAllAccountCar()

              this.loading = false

              if (+code === 1) {
                this.getAccountCarList()

                this.tableData.forEach((item) => {
                  this.$refs.table.toggleRowSelection(item, false)
                })

                this.$message({
                  type: 'success',
                  message: '清空成功!'
                })
                this.checkList = []
              } else {
                this.$message.error(message || '清空失败，请重试')
              }
              this.$nextTick(() => {
                this.selectFillFlag = false
              })
            })
          } catch (e) {
            this.loading = false
            this.$message.error(e || '清空失败，请重试')
          }
        })
        .catch(() => {})
    },

    // 打开同步到商机的弹窗
    handleSyncOpportunities() {
      this.syncOpportunitieDialogVisible = true
      this.getFindingOpportunityList()
      this.getCustomerName()
    },

    handleCloseSyncOpportunitieDialog() {
      this.selectOpportRows = []
      this.syncOpportunitieDialogVisible = false
    },

    handleCloseConfigSyncDialog() {
      this.configSyncDialogVisible = false
    },

    // 获取商机列表
    async getFindingOpportunityList(params = {}) {
      try {
        this.opportunityListLoading = true
        const {
          code,
          data,
          message = ''
        } = await $getFindingOpportunityList({
          ...params
        })
        this.opportunityListLoading = false
        if (+code === 1) {
          this.syncOpportunitieData = data.map((item, index) => {
            if (index === 0) {
              item.isNew = true
            }
            return item
          })
        } else {
          this.syncOpportunitieData = []
          this.$message.error(message)
        }
      } catch (e) {
        this.opportunityListLoading = false
        this.syncOpportunitieData = []
        this.$message.error(e?.message)
      }
    },

    handleChangeSelection(selection) {
      this.selectOpportRows = selection
    },

    // 同步购物车账号的确认
    async handleSyncCartToOpport() {
      try {
        this.syncCartLoading = true
        const accountId = this.accountCartVOList.map((item) => item.accountId)
        // 校验是否有解约账号
        const {
          code,
          data: { signOfflineList },
          message = ''
        } = await $checkSignOffline({
          accountId
        })
        if (+code === 1) {
          // 存在解约账号，则显示解约账号的弹窗提示
          if (signOfflineList.length) {
            this.signOfflineList = signOfflineList
            this.hasTerminationDialogVisible = true
          } else {
            this.configSyncDialogVisible = true
          }
        } else {
          this.$message.error(message)
        }
        this.syncCartLoading = false
      } catch (e) {
        this.$message.error(e?.message)
        this.syncCartLoading = false
      }
    },

    // 存在解约账号提示的取消（关闭我的商机弹窗和解约账号提示弹窗）
    handleCancelTerminate() {
      this.hasTerminationDialogVisible = false
      this.syncOpportunitieDialogVisible = false
    },

    // 存在解约账号提示的确认（关闭解约账号提示弹窗和打开账号工单合作类型弹窗）
    handleConfirmTerminate() {
      this.configSyncDialogVisible = true
      this.hasTerminationDialogVisible = false
    },

    // 更改合作类型的选择值
    handleChangeCooperateTypeValue(value, accountId) {
      this.accountCartListForConfig = this.accountCartListForConfig.map(
        (item) => {
          if (item.accountId === accountId) {
            item.cooperateTypeValue = value
          }
          return item
        }
      )
    },

    // 更改合作形式的选择值
    handleChangeCooperateFormValue(value, accountId) {
      this.accountCartListForConfig = this.accountCartListForConfig.map(
        (item) => {
          if (item.accountId === accountId) {
            item.cooperateFormValue = value
          }
          return item
        }
      )
    },

    // 确认同步账号添加到商机中
    async handleConfirmFindAccount() {
      try {
        const opId = this.selectOpportRows.map((item) => item.id)[0]
        const syncAccountInfos = this.accountCartListForConfig.map((item) => {
          const obj = {}
          obj.accountId = item.accountId
          obj.orderType = +item.cooperateTypeValue
          obj.coopType = +item.cooperateFormValue
          return obj
        })
        let cooperateFormValFlag = false
        syncAccountInfos.forEach((item) => {
          if (item.orderType === 2 && !item.coopType) {
            cooperateFormValFlag = true
          }
        })
        if (cooperateFormValFlag) {
          cooperateFormValFlag = false
          return this.$message.error('合作形式不能为空')
        }
        this.confirmFindAccountLoading = true
        const { code, message = '' } = await $getFindAccountBySelf({
          opId,
          syncAccountInfos
        })
        if (+code === 1) {
          this.confirmFindAccountLoading = false
          this.$confirm('账号已添加到商机中', {
            cancelButtonText: '确定',
            confirmButtonText: '查看找号进度'
          })
            .then(async(_) => {
              try {
                const { code } = await $deleteAllAccountCar()
                if (+code === 1) {
                  this.getAccountCarList()
                  window.localStorage.setItem('isFromBillAdv', 'true')
                  this.$router.push({
                    path: '/qp/business-opportunity-manage',
                    query: {
                      showDrawer: true,
                      opId
                    }
                  })
                }
              } catch (e) {
                this.$message.error(String(e?.message))
              }
            })
            .catch(async(e) => {
              try {
                const { code } = await $deleteAllAccountCar()
                if (+code === 1) {
                  this.handleCloseConfigSyncDialog()
                  this.handleCloseSyncOpportunitieDialog()
                  this.getAccountCarList()
                }
              } catch (e) {
                this.$message.error(String(e?.message))
              }
            })
        } else {
          this.confirmFindAccountLoading = false
          this.$message.error(message)
        }
      } catch (e) {
        this.confirmFindAccountLoading = false
        this.$message.error(String(e?.message))
      }
    },

    handleListSelect(selection) {
      if (this.selectFillFlag) return
      const checkList = [...this.checkList]

      if (selection.length > checkList.length) {
        // 添加
        const arr = []
        selection.forEach((item) => {
          if (
            checkList.findIndex((it) => +item.accountId === +it.accountId) <= -1
          ) {
            arr.push(item)
          }
        })

        let index = 0
        if (selection.length - checkList.length === 1) {
          // 添加单个
          index = this.tableData.findIndex(
            (item) => +item.accountId === +arr[0].accountId
          )
        }

        const tableEl = document.getElementsByClassName('el-table__body')[0]
        const checkBoxEl = tableEl.querySelectorAll('.el-checkbox')[index]
        const elEect = checkBoxEl.getBoundingClientRect()
        this.elEect = elEect
        this.accountImg = arr[0].accountImg

        this.addAccountCar(arr, selection)
      } else if (selection.length < checkList.length) {
        // 删除
        const arr = []
        checkList.forEach((item) => {
          if (
            selection.findIndex((it) => +item.accountId === +it.accountId) <= -1
          ) {
            arr.push(item)
          }
        })
        this.deleteAccountCar(arr, selection)
      }
    },
    handleCustomChange(item, name) {
      if (!item._end && !item._start) {
        return
      }
      this.searchData[name] = `${item._start || 0}w-${item._end || 100000}w`
      if (item._start && item._end && item._start > item._end) {
        this.$message.warning('结束值应大于开始值')
        return
      }
      this.tagInfo[name].selectIndex = -1
      if (item._start && item._end) {
        this.$nextTick(() => {
          this.searchData.pageNum = 1
          this.getList()
        }, 50)
      }
    },
    getIndex(index) {
      return index + (this.searchData.pageNum - 1) * this.searchData.size + 1
    },
    getArea(parentId = 0, random = '') {
      return $getAera({ parentId }, random)
    },
    handleTagCheckChange() {
      this.searchData.tagName = this.tagCheckList
        .map((item) => item.replace(/^\s+|\s+$/g, ''))
        .join(',')
      this.debounceList()
    },

    // 处理账号归属下拉框数据的选择
    handleChangeAccountTypeFlag(val) {
      // 当选择了账号归属的数据，就禁用解约账号选择框并使其勾选值变为false
      if (val.length) {
        this.searchData.signOffline = false
        this.$set(this.$refs.search.form, 'signOffline', false)
      }
      this.searchData.accountTypeFlag = val
    },

    handleChangeShield(val) {
      const status = val.split(',')[0]
      const md5Id = val.split(',')[1]
      if (status === 'true') {
        this.searchData.accountTagList.push(md5Id)
      } else {
        this.searchData.accountTagList = this.searchData.accountTagList.filter(
          (item) => item !== md5Id
        )
        // const index = this.searchData.accountTagList.indexOf(md5Id)
        // this.searchData.accountTagList.splice(index, 1)
      }
      this.searchData.accountTagList = [
        ...new Set(this.searchData.accountTagList)
      ]
      this.getList()
    },

    // 对解约账号的勾选操作
    handleChangeSignOffline(val) {
      // 若勾选解约账号，则清空账号筛选下拉框的数据
      if (val) {
        this.searchData.accountTypeFlag = []
        this.$set(this.$refs.search.form, 'accountTypeFlag', [])
      }
      this.searchData.signOffline = val
      this.getList()
    },

    handleProvChange(node, resolve) {
      const provName = node.value
      const level = node.level
      // 暂时性修复执行两次的问题
      if (level === 2 || (node.children && node.children.length > 0)) { return resolve() }
      if (provName) {
        const id = this.provList.find(
          (item) => item.areaName === provName
        ).areaId
        this.getArea(id).then((res) => {
          res.data.map((item) => (item.leaf = true))
          resolve(res.data)
        })
      } else {
        resolve([])
        this.searchData.cityName = ''
      }
      // this.handleSearch()
    },

    async getOrgList() {
      const { code, data } = await $getOrgList()
      if (+code === 1) {
        (this.normalFormItemMap.orgId || {}).data = data || []
      }
    },

    handleVisibleChange(flag) {
      if (!flag) {
        const { cpmInputStart, cpmInputEnd } = this.searchData
        if (
          typeof cpmInputStart === 'number' ||
          typeof cpmInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            cpm: `${cpmInputStart || 0}-${
              cpmInputEnd === 0 ? 0 : cpmInputEnd || 999
            }`
          }
        }
      } else {
        if (!this.$refs.search.form.cpm) {
          this.handleReset()
        }
      }
    },

    handleVisibleChangeCpe(flag) {
      if (!flag) {
        const { cpeInputStart, cpeInputEnd } = this.searchData
        if (
          typeof cpeInputStart === 'number' ||
          typeof cpeInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            cpe: `${cpeInputStart || 0}-${
              cpeInputEnd === 0 ? 0 : cpeInputEnd || 999
            }`
          }
        }
      } else {
        if (!this.$refs.search.form.cpe) {
          this.handleResetCpe()
        }
      }
    },

    handleVisibleChangeFans(flag) {
      if (!flag) {
        const { fansInputStart, fansInputEnd } = this.searchData
        if (
          typeof fansInputStart === 'number' ||
          typeof fansInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            fansNumRange: `${fansInputStart || 0}w-${
              fansInputEnd === 0 ? 0 : fansInputEnd || 10000
            }w`
          }
        }
      } else {
        if (!this.$refs.search.form.fansNumRange) {
          this.handleResetFans()
        }
      }
    },

    handleVisibleChangeExpectedPlayback(flag) {
      if (!flag) {
        const { expectedPlaybackInputStart, expectedPlaybackInputEnd } =
          this.searchData
        if (
          typeof expectedPlaybackInputStart === 'number' ||
          typeof expectedPlaybackInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            expectedPlayback: `${expectedPlaybackInputStart || 0}w-${
              expectedPlaybackInputEnd === 0
                ? 0
                : expectedPlaybackInputEnd || 10000
            }w`
          }
        }
      } else {
        if (!this.$refs.search.form.expectedPlayback) {
          this.handleResetExpectedPlayback()
        }
      }
    },

    handleVisibleChangeAvgFlowWeeks(flag) {
      if (!flag) {
        const { avgFlowWeeksInputStart, avgFlowWeeksInputEnd } =
          this.searchData
        if (
          typeof avgFlowWeeksInputStart === 'number' ||
          typeof avgFlowWeeksInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            avgFlowWeeks: `${avgFlowWeeksInputStart || 0}万-${
              avgFlowWeeksInputEnd === 0 ? 0 : avgFlowWeeksInputEnd || 1000
            }万`
          }
        }
      } else {
        if (!this.$refs.search.form.avgFlowWeeks) {
          this.handleResetAvgFlowWeeks()
        }
      }
    },

    handleVisibleChangeNealy7ThumbUpAvg(flag) {
      if (!flag) {
        const { nealy7ThumbUpAvgInputStart, nealy7ThumbUpAvgInputEnd } =
          this.searchData
        if (
          typeof nealy7ThumbUpAvgInputStart === 'number' ||
          typeof nealy7ThumbUpAvgInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            nealy7ThumbUpAvg: `${nealy7ThumbUpAvgInputStart || 0}-${
              nealy7ThumbUpAvgInputEnd === 0
                ? 0
                : nealy7ThumbUpAvgInputEnd || 100000
            }`
          }
        }
      } else {
        if (!this.$refs.search.form.nealy7ThumbUpAvg) {
          this.handleResetNealy7ThumbUpAvg()
        }
      }
    },

    handleVisibleChangeSixPrice(flag) {
      if (!flag) {
        const { sixPriceInputStart, sixPriceInputEnd } = this.searchData
        if (
          typeof sixPriceInputStart === 'number' ||
          typeof sixPriceInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            sixPriceRange: `${sixPriceInputStart || 0}w-${
              sixPriceInputEnd === 0 ? 0 : sixPriceInputEnd || 100000
            }w`
          }
        }
      } else {
        if (!this.$refs.search.form.sixPriceRange) {
          this.handleResetSixPrice()
        }
      }
    },

    handleChangeSelect(val) {
      this.handleReset()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        cpm: val
      }
    },

    handleChangeSelectCpe(val) {
      this.handleResetCpe()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        cpe: val
      }
    },

    handleChangeSelectFans(val) {
      this.handleResetFans()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        fansNumRange: val
      }
    },

    handleChangeSelectExpectedPlayback(val) {
      console.log(val, 'handleChangeSelectExpectedPlayback')
      this.handleResetExpectedPlayback()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        expectedPlayback: val
      }
    },

    handleChangeSelectAvgFlowWeeks(val) {
      this.handleResetAvgFlowWeeks()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        avgFlowWeeks: val
      }
    },

    handleChangeSelectNealy7ThumbUpAvg(val) {
      this.handleResetNealy7ThumbUpAvg()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        nealy7ThumbUpAvg: val
      }
    },

    handleChangeSelectSixPrice(val) {
      console.log(val, 'handleChangeSelectSixPrice')
      this.handleResetSixPrice()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        sixPriceRange: val
      }
    },

    handleReset() {
      const data = { ...this.searchData }
      delete data.cpmInputStart
      delete data.cpmInputEnd
      this.searchData = data
    },

    handleResetCpe() {
      const data = { ...this.searchData }
      delete data.cpeInputStart
      delete data.cpeInputEnd
      this.searchData = data
    },

    handleResetFans() {
      const data = { ...this.searchData }
      delete data.fansInputStart
      delete data.fansInputEnd
      this.searchData = data
    },

    handleResetExpectedPlayback() {
      const data = { ...this.searchData }
      delete data.expectedPlaybackInputStart
      delete data.expectedPlaybackInputEnd
      this.searchData = data
    },

    handleResetAvgFlowWeeks() {
      const data = { ...this.searchData }
      delete data.avgFlowWeeksInputStart
      delete data.avgFlowWeeksInputEnd
      this.searchData = data
    },

    handleResetNealy7ThumbUpAvg() {
      const data = { ...this.searchData }
      delete data.nealy7ThumbUpAvgInputStart
      delete data.nealy7ThumbUpAvgInputEnd
      this.searchData = data
    },

    handleResetSixPrice() {
      const data = { ...this.searchData }
      delete data.sixPriceInputStart
      delete data.sixPriceInputEnd
      this.searchData = data
    },

    handleConfirmAddAccountTag(val) {
      this.addAccountTagResultDialogShow = true
      this.addAccountResultList = val.errorAccountNameList
      this.addAccountResultCount = val.successCount
      this.addAccountTagDialogShow = false
      if (val.successCount) {
        this.getList()
      }
    },

    handleShowHistoryDialog(row, type) {
      this.showHistoryDialog = true
      this.historyDialogType = type
      this.currentItem = row
    },

    handleChangeCascader(val) {
      if (val.length <= 1) {
        val.push('')
        this.$set(this.$refs.search.form, 'filedIds', val)
        this.searchData = {
          ...this.searchData,
          filedIds: val
        }
      }
    },

    // 获取客户联系人数据
    async getCustomerName() {
      try {
        const { code, data } = await $getCustomerName()
        if (+code === 1 && data.length) {
          this.customerNameList = data
        }
      } catch (e) {
        this.$message.error(e.message)
      }
    },

    // 监听创建时间更改的事件
    handleChangeCreateTime(val) {
      if (!val) {
        delete this.businessForm.createTime
        delete this.businessForm.createTimeStart
        delete this.businessForm.createTimeEnd
        return
      }
      const startTime = `${dateFormat('YYYY-mm-dd', new Date(val[0]))} 00:00:00`
      const endTime = `${dateFormat('YYYY-mm-dd', new Date(val[1]))} 23:59:59`
      this.businessForm.createTimeStart = startTime
      this.businessForm.createTimeEnd = endTime
    },

    // 搜索商机信息
    async handleSearchBusiness() {
      const params = {
        ...this.businessForm
      }
      delete params.createTime
      this.getFindingOpportunityList({
        ...params
      })
    },

    // 根据不同的账号状态，账号底板显示不同的颜色
    getTableRowClass({ row }) {
      // 解约状态
      if (row.coopStatus === 1) {
        return 'yellow-row'
      } else if (row.coopStatus === 2) { // 拉黑状态
        return 'red-row'
      }
      return ''
    }
  }
}
</script>
<style lang="scss">
.table-toolTip {
  max-width: 400px !important;
}
</style>
<style lang="scss" scoped>
.search-view {
  position: relative;
}
.avatar {
  overflow: hidden;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.load-more {
  line-height: 50px;
  text-align: center;
}
.search-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 20px;
  line-height: 30px;
  .search-item-title {
    line-height: 24px;
    text-align: justify;
    text-align-last: justify;
    margin-right: 10px;
    flex-shrink: 0;
    width: 70px;
    color: #000;
    // font-weight: bold;
    // font-size: 16px;
  }
  .search-item-tag {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    line-height: 24px;
    height: 24px;
    // &>div{
    //     margin-left: 10px;
    //     cursor: pointer;
    // }
  }
  .custom-input {
    display: flex;
    align-items: center;
    .el-input {
      margin: 0 10px;
    }
  }
  .tag {
    margin-right: 10px;
    margin-bottom: 0;
    cursor: pointer;
  }
  .m-b-10 {
    margin-bottom: 10px;
  }
  .search-right {
    flex-shrink: 0;
    > span {
      color: rgb(24, 144, 255);
      line-height: 30px;
      margin: 0 10px;
      cursor: pointer;
    }
  }
  .tag-box {
    overflow: hidden;
    height: 30px;
    &.open {
      height: auto;
    }
    .el-checkbox {
      margin-right: 10px;
    }
  }
}
.table-view {
  ::v-deep .el-image__error {
    font-size: 12px;
  }
}
.check-wrap {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: #fafafa;
  padding: 10px;
}
.cancel-btn {
  margin: 0 auto;
  color: rgb(24, 144, 255);
  cursor: pointer;
}
$--label-width: 70px;

.no-data {
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.accounts {
  &-search {
    &__title {
      &-input {
        width: 590px;
      }
    }
    &__label {
      width: $--label-width;
      text-align: justify;
      text-align-last: justify;
      margin-right: 10px;
    }
    &__sub-label {
      width: $--label-width;
      text-align: right;
    }
  }
  ::v-deep {
    .is-active {
      .el-radio-button__inner {
        color: $--color-primary;
      }
    }
    .el-radio-button__inner {
      color: rgba(0, 0, 0, 0.65);
      &:hover {
        color: $--color-primary;
      }
    }
  }
}
.collapse-wrap {
  ::v-deep {
    .el-input,
    .el-select {
      // width: 254px;
    }
  }
}
.iconshouqi,
.iconzhankai {
  font-size: 14px;
  margin-left: 5px;
}

.ball {
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  border-radius: 50%;
  position: fixed;
  z-index: -1;
  // display: none;
  opacity: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}

.showBall {
  // display: block;
  transform: scale(1.5, 1.5);
  opacity: 1;
  z-index: 2001;
  transition: top 0.6s ease, left 0.6s ease, transform 0.6s ease;
  top: 30px !important;
  left: calc(100vw - 20px) !important;
}

.otherMessage {
  p {
    text-align: left;
    font-size: 12px;
    color: #999;
  }
}

.account {
  font-size: 12px;
  color: #999;
}

.price {
  text-align: left;
  // margin-bottom: 16px;

  p {
    span:nth-child(1) {
      display: inline-block;
      width: 76px;
    }
  }
}

.priceTime {
  margin-top: 16px;

  .el-tag {
    border-radius: 10px;
  }
}

::v-deep {
  .el-cascader__search-input {
    display: none;
  }

  .checkbox {
    margin-right: 10px;
  }

  .optionInput {
    width: 76px;
  }

  .el-cascader {
    // width: 200px;
    // margin-right: 5px;
  }

  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 178px;
  }

  .el-button {
    margin: 0 4px;
  }

  .el-table--border {
    &::after {
      display: none;
      width: 0;
    }
  }

  .el-table {
    .yellow-row {
      background-color: rgb(228, 244, 153);
    }

    .red-row {
      background-color: rgb(246, 181, 181);
    }
  }
}

.optionSlot {
  margin: -3px 20px 0;
  border-top: 1px solid #eee;
  padding: 7px 0 0;
}

.optionBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reset {
  margin: 4px 0 0;
}

.cpmSelect {
  width: 220px;
}

.seg {
  margin: 0 8px;
}

.cpmSelect > div {
  margin-top: 100px;
}

.group {
  display: inline-block;
  margin-left: 30px;
}

.searchLabel {
  flex-shrink: 0;
  padding-top: 8px;
}

.more {
  border: 1px solid #409eff;
  border-radius: 50%;
  color: #409eff;
  cursor: pointer;
}

.dangqi {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #2c64ff;
  color: #2c64ff;
  // margin:0 auto;
  // margin-top:10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  caret-color: transparent;
}

.disabledBtn {
  border-color: transparent;
  outline-color: transparent;
  cursor: not-allowed;
  color: #fff;
  background: #ccc;

  &:hover {
    outline: none;
    color: #fff;
  }

  &:focus {
    outline: none;
    border-color: rgba(0, 0, 0, 0.3);
  }
}

.empty-link {
  text-decoration: none;
  color: #2c64ff;
}

.toolTip-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.terminationWrap {
  margin-top: 20px;
}

.customerSelect {
  width: 250px;
}
</style>
