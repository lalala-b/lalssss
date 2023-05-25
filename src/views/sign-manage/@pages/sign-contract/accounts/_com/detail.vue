<template>
  <div>
    <Wrap class="search-wrapper">
      <span>团队筛选</span>
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <div
            :class="[
              'search-wrapper',
              'slot-search',
              !talentStatus && talentShow && 'hideTalent',
            ]"
          >
            <span>达人筛选</span>
            <div ref="talentBox">
              <el-form-item>
                <el-select
                  v-model="target.model.accountStatus"
                  placeholder="账号状态"
                  clearable
                >
                  <el-option
                    v-for="item in accountStatusList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="target.model.coopStatus"
                  placeholder="合作状态"
                  clearable
                >
                  <el-option
                    v-for="item in coopStatusList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <!-- <el-form-item>
                <el-select
                  v-model="target.model.platId"
                  placeholder="全部平台"
                  clearable
                  @change="getAccountList(arguments[0], target.model)"
                >
                  <el-option
                    v-for="item in (normalFormItemMap.platId||{}).data||[]"
                    :key="item.platId"
                    :value="item.platId"
                    :label="item.platName"
                  />
                </el-select>
              </el-form-item> -->
              <el-form-item>
                <el-cascader
                  ref="cascader"
                  v-model="target.model.tagNameList"
                  class="cascader"
                  placeholder="达人类型"
                  :options="((normalFormItemMap || {}).sysPlatTags || {}).data"
                  :props="{
                    multiple: true,
                    value: 'tagName',
                    label: 'tagName',
                    children: 'childNodeTags',
                  }"
                  collapse-tags
                  clearable
                  @change="handleChangeCascader"
                />
              </el-form-item>
              <el-form-item>
                <el-select
                  v-model="target.model.signAccountLevel"
                  placeholder="达人等级"
                  clearable
                >
                  <el-option
                    v-for="item in level"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item style="margin-right: 0">
                <accountSelect
                  placeholder="账号搜索"
                  :inline="true"
                  :no-ajax="true"
                  :list="accountList"
                  :form="target.model"
                  :params="paramsConfig"
                />
              </el-form-item>
              <el-form-item>
                <el-cascader
                  v-model="target.model.region"
                  placeholder="达人所在地区"
                  class="m-r-10"
                  :options="regionList"
                  :props="{
                    value: 'areaName',
                    label: 'areaName',
                    lazy: true,
                    lazyLoad: handleProvChange,
                    emitPath: true,
                    checkStrictly: true,
                  }"
                  clearable
                  filterable
                />
              </el-form-item>

              <el-form-item>
                <el-select
                  v-model="target.model.cartInterest"
                  placeholder="购物车权益"
                  clearable
                >
                  <el-option
                    v-for="item in interestSelectArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-select
                  v-model="target.model.msgFlowInterest"
                  placeholder="信息流权益"
                  clearable
                >
                  <el-option
                    v-for="item in interestSelectArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-select
                  v-model="target.model.offlineOrderInterest"
                  placeholder="线下商单权益"
                  clearable
                >
                  <el-option
                    v-for="item in offlineOrderSelectArr"
                    :key="item.val"
                    :value="item.val"
                    :label="item.label"
                  />
                </el-select>
              </el-form-item>
            </div>
            <div v-show="talentShow">
              <el-link
                :underline="false"
                type="primary"
                @click="talentStatus = !talentStatus"
              >{{ talentStatus ? '收起' : '展开'
              }}<i
                class="iconfont"
                :class="talentStatus ? 'iconzhankai' : 'iconshouqi'"
              /></el-link>
            </div>
          </div>

          <div class="search-wrapper slot-search">
            <span>时间筛选</span>
            <div>
              <el-form-item label="签约时间">
                <el-date-picker
                  v-model="target.model.signContractDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="问询时间">
                <el-date-picker
                  v-model="target.model.inquiryTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
                <IconTip
                  width="300"
                  trigger="hover"
                  content="问询时间：指账号被商务添加为商机的推荐账号的时间"
                  icon-class="iconwenhao"
                />
              </el-form-item>
              <el-form-item label="已定档期">
                <el-date-picker
                  v-model="target.model.finishTimeConfirm"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="解约时间">
                <el-date-picker
                  v-model="target.model.cancelContractTime"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </div>
          </div>

          <div class="search-wrapper slot-search">
            <span>账号筛选</span>
            <div>
              <el-form-item>
                <el-checkbox-group v-model="accountTagList">
                  <el-checkbox
                    v-for="item in sceneTags"
                    :key="item.md5Id"
                    :label="item.md5Id"
                  >
                    {{ item.tagName }}
                    <IconTip
                      v-if="item.tagDescribe"
                      :content="item.tagDescribe"
                      icon-class="iconwenhao"
                    />
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>

          <div v-if="showMore" class="search-wrapper slot-search">
            <span>其他筛选</span>
            <div>
              <el-form-item>
                <Select
                  v-model="target.model.fansRange"
                  :config="(normalFormItemMap || {}).fansRange || {}"
                />
              </el-form-item>
              <!-- <el-form-item>
                <Select
                  v-model="target.model.priceRange"
                  :config="(normalFormItemMap || {}).priceRange || {}"
                />
              </el-form-item> -->
              <el-form-item>
                <el-select
                  v-model="target.model.priceRange"
                  popper-class="priceSelect"
                  :clearable="true"
                  :placeholder="pricePlaceholder"
                  @change="handleChangeSelectPriceRange"
                  @visible-change="handleVisibleChangePriceRange"
                >
                  <el-option
                    v-for="item in (normalFormItemMap || {}).priceRange.data ||
                      {}"
                    :key="item.dictValue"
                    :value="item.dictValue"
                    :label="item.dictLabel"
                  />
                  <div class="optionSlot">
                    <div class="optionBox">
                      <el-input-number
                        v-model="searchData.priceInputStart"
                        placeholder="0"
                        :controls="false"
                        class="optionInput"
                        size="small"
                        :min="0"
                        :max="searchData.priceInputEnd || 100000"
                      />w
                      <span class="seg">-</span>
                      <el-input-number
                        v-model="searchData.priceInputEnd"
                        placeholder="100000"
                        :controls="false"
                        class="optionInput"
                        size="small"
                        :min="searchData.priceInputStart || 0"
                        :max="100000"
                      />w
                    </div>
                    <el-button
                      size="small"
                      type="primary"
                      class="reset"
                      @click="handleResetPrice"
                    >重置</el-button>
                  </div>
                </el-select>
              </el-form-item>

              <el-form-item>
                <Select
                  v-model="target.model.maxAgeLabel"
                  :config="(normalFormItemMap || {}).maxAgeLabel || {}"
                />
              </el-form-item>
              <el-form-item>
                <el-cascader
                  v-model="target.model.sixRange"
                  placeholder="粉丝性别分布"
                  class="m-r-10"
                  :options="sixRangeList"
                  :props="{
                    value: 'dictValue',
                    label: 'dictLabel',
                    emitPath: true,
                    checkStrictly: true,
                  }"
                  clearable
                  filterable
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.maxPhoneLabel"
                  :config="(normalFormItemMap || {}).maxPhoneLabel || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.outMoneyRatio"
                  :config="(normalFormItemMap || {}).outMoneyRatio || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.quantityFlag"
                  :config="(normalFormItemMap || {}).quantityFlag || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.baseSalaryFlag"
                  :config="(normalFormItemMap || {}).baseSalaryFlag || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.responseSpeedScore"
                  :config="(normalFormItemMap || {}).responseSpeedScore || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.cooperationScore"
                  :config="(normalFormItemMap || {}).cooperationScore || {}"
                />
              </el-form-item>
              <el-form-item>
                <Select
                  v-model="target.model.contentCreativeScore"
                  :config="(normalFormItemMap || {}).contentCreativeScore || {}"
                />
              </el-form-item>
            </div>
          </div>
        </template>
        <template v-slot:btns>
          <!-- <el-button
            v-if="$permission('add_sign_contract_btn')"
            v-log
            type="primary"
            @click="handleAddAccount"
          >添加签约账号</el-button> -->
          <el-button
            :class="['getMoreButton', showMore && 'showMoreButton']"
            type="text"
            @click="handleShowMore"
          >更多筛选<span>&lt;</span></el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-between m-b-24">
        <div class="selectBtnWrap">
          <el-checkbox-group v-model="checkTableRow">
            <el-checkbox label="allPrice">全部报价</el-checkbox>
            <el-checkbox label="talentInterest">达人权益</el-checkbox>
          </el-checkbox-group>
          <el-radio-group
            v-model="searchData.opportunitySwitch"
            size="mini"
            @change="handleChangeOpportunitySwitch"
          >
            <el-radio :label="1">新版商机问询数据</el-radio>
            <el-radio :label="0">旧版商机问询数据</el-radio>
          </el-radio-group>
        </div>
        <div>
          <el-button
            v-if="$permission('batch_sign_contract_account')"
            type="primary"
            @click="importDrawerStatus = true"
          >批量导入账号</el-button>
          <!-- <el-button v-if="$permission('up_sign_contract_account')" v-log type="primary" size="small" plain @click="updateCheckAccountStatus(0)">批量上架</el-button>
          <el-button v-if="$permission('down_sign_contract_account')" v-log type="danger" size="small" plain @click="updateCheckAccountStatus(1)">批量下架</el-button> -->
        </div>
      </div>
      <el-table
        v-loading="loading"
        v-scrollbar
        :data="tableData"
        :row-class-name="getTableRowClass"
        header-row-class-name="table-header"
        @sort-change="doSort"
        @selection-change="handleListSelect"
      >
        <!-- <el-table-column v-if="$permission('up_sign_contract_account') && $permission('down_sign_contract_account')" type="selection" :selectable="checkVerifyPermission" /> -->
        <el-table-column prop="accountStatus" label="账号状态" width="102">
          <template slot="header">
            <IconTip
              content="账号状态：选项有上架中、下架中，默认为上架中。只有上架中的账号可以在商单中指派接单，若达人暂时休息或者签约到期终止合作可调整为下架中。"
              label="账号状态"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <!-- <el-select
              v-if="($permission('up_sign_contract_account') && $permission('down_sign_contract_account')) && row.editOperatorPermissions"
              v-model="row.accountStatus"
              size="mini"
              @change="hanleAccountStatus(row)"
            >
              <el-option
                v-for="item in accountStatusList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select> -->
            <div>
              {{ row.accountStatus === 0 ? '上架' : '下架' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="accountName"
          label="账号信息"
          width="200"
          align="left"
        >
          <template slot-scope="{ row }">
            <AccountCard :info="row">
              <template v-slot>
                <!-- <div v-if="row.tagValue">
                  <el-tag v-for="item in row.tagValue.split(',')" :key="item" class="account-tag m-r-5 m-b-5" size="small">{{ item }}</el-tag>
                </div> -->
                <div
                  v-if="row.upUpNameAndLeader"
                  class="m-t-5"
                  style="text-align: left"
                >
                  <el-tag size="mini" type="danger">{{
                    row.upUpNameAndLeader
                  }}</el-tag>
                </div>
              </template>
              <template v-slot:last>
                <p class="area">
                  <span>{{
                    [row.provinceName, row.cityName]
                      .filter((item) => item)
                      .join('-')
                  }}</span>
                </p>
              </template>
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column label="达人等级">
          <template slot-scope="scope">
            {{ scope.row.signAccountLevel || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fansNum"
          label="总粉丝量"
          sortable="custom"
          width="100"
        >
          <template slot-scope="scope">
            <!-- 防止fansNum出现undefined、null之类的导致页面渲染出错 -->
            {{ Number(((scope.row.fansNum || 0) / 10000).toFixed(1)) }}w
          </template>
        </el-table-column>

        <el-table-column
          label="报价"
          prop="twentySecondPrice"
          width="152"
          text-align="left"
        >
          <template slot="header">
            <IconTip
              :content="getPlatPriceTip"
              label="报价"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div class="price">
              <template v-if="type === 'douyin'">
                <p v-if="checkTableRowShow.allPrice">
                  <span>1-20s：</span>
                  <span>¥{{ row.twentySecondPrice | toThousandsW }}</span>
                </p>
                <p>
                  <span>21-60s：</span>
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>

                <p v-if="checkTableRowShow.allPrice">
                  <span>60s以上：</span>
                  <span>¥{{ row.oversixtySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'kuaishou'">
                <p>
                  <span>达人报价：</span>
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'bilibili'">
                <p>
                  <span>定制视频：</span>
                  <span>¥{{ row.customVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>植入视频：</span>
                  <span>¥{{ row.implantationVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>直发视频：</span>
                  <span>¥{{ row.directVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>转发动态：</span>
                  <span>¥{{ row.forwardSituationPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'xiaohongshu'">
                <p>
                  <span>视频笔记：</span>
                  <span>¥{{ row.videoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.allPrice">
                  <span>图文笔记：</span>
                  <span>¥{{ row.picturePrice | toThousandsW }}</span>
                </p>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="历史毛利率"
          prop="grossProfitRate"
          width="120"
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
            {{
              row.grossProfitRate === null || row.grossProfitRate === undefined
                ? '--'
                : `${row.grossProfitRate}%`
            }}
          </template>
        </el-table-column>

        <el-table-column
          prop="opportunityTotal"
          sortable="custom"
          width="160px"
        >
          <template slot="header">
            <IconTip
              content="指账号在商机中被商务添加为推荐账号的总次数；问询总次数=MCN商机问询总数+向乾商机问询总数"
              label="问询总数"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <template v-if="row.opportunityTotal">
                <span>{{ row.opportunityTotal }}</span>
                <!-- <IconTip
                  v-if="row.mcnOpportunityDataBO"
                  icon-class="icontongjiliebiao"
                  @click="handleBussiness(row,'Mcn')"
                >
                  <div>MCN商机问询总数 {{ row.mcnOpportunityDataBO.totalOpportunitySum }}</div>
                  <div>等待结果 {{ row.mcnOpportunityDataBO.waitOpportunitySum }}</div>
                  <div>确认合作（含此账号）{{ row.mcnOpportunityDataBO.confirmOpportunitySum }}</div>
                  <div>确认合作（不含此号）{{ row.mcnOpportunityDataBO.confirmOppNotIncludedSum }}</div>
                  <div>暂不合作 {{ row.mcnOpportunityDataBO.refuseOpportunitySum }}</div>
                  <div>问询成功率 {{ row.mcnOpportunityDataBO.accountWinTenderRatio===0||row.mcnOpportunityDataBO.accountWinTenderRatio>0?row.mcnOpportunityDataBO.accountWinTenderRatio+'%':'' }}</div>
                  <div>点击图标查看商机明细</div>
                </IconTip> -->
                <IconTip
                  v-if="row.xiangQianOpportunityDataBO"
                  icon-class="icontongjiliebiao"
                  class="MCN-icon"
                  @click="handleBussiness(row, 'CommercialOpportunity')"
                >
                  <div>
                    商机问询总数
                    {{ row.xiangQianOpportunityDataBO.totalOpportunitySum }}
                  </div>
                  <div>
                    等待结果
                    {{ row.xiangQianOpportunityDataBO.waitOpportunitySum }}
                  </div>
                  <div>
                    确认合作（含此账号）{{
                      row.xiangQianOpportunityDataBO.confirmOpportunitySum
                    }}
                  </div>
                  <div>
                    确认合作（不含此号）{{
                      row.xiangQianOpportunityDataBO.confirmOppNotIncludedSum
                    }}
                  </div>
                  <div>
                    暂不合作
                    {{ row.xiangQianOpportunityDataBO.refuseOpportunitySum }}
                  </div>
                  <div>
                    问询成功率
                    {{
                      row.xiangQianOpportunityDataBO.accountWinTenderRatio ===
                        0 ||
                        row.xiangQianOpportunityDataBO.accountWinTenderRatio > 0
                        ? row.xiangQianOpportunityDataBO.accountWinTenderRatio +
                          '%'
                        : ''
                    }}
                  </div>
                  <div>点击图标查看商机明细</div>
                </IconTip>
              </template>
              <template v-else>--</template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommendSuccessRatio"
          sortable="custom"
          width="160"
        >
          <template slot="header">
            <IconTip
              content="指商机中，账号最终合作的总次数/账号被商务添加为推荐账号的总次数*100%"
              label="问询成功率"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <span>{{
              row.recommendSuccessRatio === 0 || row.recommendSuccessRatio > 0
                ? row.recommendSuccessRatio + '%'
                : '--'
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="checkTableRowShow.talentInterest"
          prop="talentInterest"
          label="达人权益"
          width="160"
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
              <p v-if="+row.offlineOrderInterest !== 2">
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
              <p v-if="row.maxBearRatio !== '' || row.maxBearRatio !== null">
                <span>最多共担返点{{ row.maxBearRatio }}%</span>
              </p>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="合作评分" width="130">
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
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="达人地区" width="90">
          <template v-if="row.provinceName || row.cityName" slot-scope="{row}">
            {{ row.provinceName }}<span v-if="row.provinceName && row.cityName">-</span>{{ row.cityName }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column label="签约时间" width="120" align="left">
          <template slot-scope="{row}">
            {{ row.signContractDate|emptyFill }} {{ row.signContractDateEnd?`至${row.signContractDateEnd}`:'' }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="outMoneyRatio" label="达人分成比例" width="62">
          <template slot-scope="{row}">
            {{ row.outMoneyRatio }}%
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="quantityFlag" label="是否保量">
          <template slot-scope="scope">
            {{ scope.row.quantityFlag ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="baseSalaryFlag" label="是否底薪">
          <template slot-scope="scope">
            {{ scope.row.baseSalaryFlag ? '是' : '否' }}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="avgLikeWeek"
          label="近7天集均点赞量"
          sortable="custom"
          width="97"
        >
          <template slot-scope="{ row }">{{
            (row.avgLikeWeek || 0).toFixed(0) | toThousandsW
          }}</template>
        </el-table-column>
        <el-table-column
          prop="avgLikeMonth"
          label="近30天集均点赞量"
          sortable="custom"
          width="97"
        >
          <template slot-scope="{ row }">{{
            (row.avgLikeMonth || 0).toFixed(0) | toThousandsW
          }}</template>
        </el-table-column>
        <el-table-column prop="brokerUserName" label="签约经纪人" />
        <el-table-column label="其他信息" width="150">
          <template slot-scope="{ row }">
            <div class="otherMessage">
              <p>
                <span>达人分成比例：</span>
                <span>{{ row.outMoneyRatio || 0 }}%</span>
              </p>
              <p>
                <span>签约结束时间：</span>
                <span>{{
                  row.signContractDateEnd ? `${row.signContractDateEnd}` : ''
                }}</span>
              </p>
              <p>
                <span>是否保量：</span>
                <span>{{ row.quantityFlag ? '是' : '否' }}</span>
              </p>
              <p>
                <span>是否底薪：</span>
                <span>{{ row.baseSalaryFlag ? '是' : '否' }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140" fixed="right">
          <template slot-scope="s">
            <IconTip
              v-log
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
            />
            <IconTip
              v-if="s.row.editOperatorPermissions"
              content="编辑"
              icon-class="iconbianji"
              class="m-r-10"
              @click="handleEdit(s.row)"
            />
            <el-popconfirm
              v-if="
                $permission('del_sign_contract_account') &&
                  s.row.editOperatorPermissions
              "
              :title="`确定删除账号${s.row.accountName}？`"
              @confirm="handleDeletAccount(s.row)"
            >
              <IconTip
                slot="reference"
                content="删除"
                icon-class="iconshanchu"
                class="m-r-10"
                :disabled="s.row.accountUseCount > 0"
              />
            </el-popconfirm>
            <el-tooltip v-if="s.row.editOperatorPermissions" placement="top">
              <div slot="content">档期管理</div>
              <div class="dangqi" @click="handleToDq(s.row)">档</div>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>

    <import-acounts
      v-if="importDrawerStatus"
      :show="importDrawerStatus"
      :config="importConf"
      :prev-status-url="getPrevUpdateStatus"
      :is-off-line="true"
      template-url="/api/sign/contract/account/exportExcelTemplate"
      fail-url="/api/sign/contract/account/downloadSignContractErrorData"
      @close="importDrawerStatus = false"
    >
      <!-- <p class="m-b-5" style="color: #ff4949">单次最多导入20条数据，快手账号的主页链接可以用视频链接代替</p> -->
    </import-acounts>
    <!-- <AddAccountDialog
      v-if="showAddMeduiuDialog"
      v-model="showAddMeduiuDialog"
      @update="handleUpdate"
    /> -->
    <AddAccountDialog
      v-if="showDialog"
      v-model="showDialog"
      :account-id="isEdit ? accountId : 0"
      :plat-id="
        type === 'douyin'
          ? 25
          : type === 'kuaishou'
            ? 26
            : type === 'bilibili'
              ? 2
              : type === 'xiaohongshu'
                ? 45
                : 0
      "
      :is-edit="isEdit"
      :user-list="optionsData.userList"
      :users="normalFormItemMap.brokerUserId.data"
      :edit-row="currEditRow"
      :edit-tags="sceneEditTags"
      :out-money-ratios="normalFormItemMap.outMoneyRatio.data"
      :plat-list="normalFormItemMap.platId.data"
      @update="getList"
    />

    <CalendarWrap
      :show="showCalendarDialog"
      :account-id="dqAccountId"
      :account-dq-msg="accountDqMsg"
      @closeCalendarWrap="showCalendarDialog = false"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import qs from 'qs'
import { lego } from '@zz-common/lego'
import Search from '@/components/Search'
import AddAccountDialog from './addAccountDialog.vue'
import CalendarWrap from './calendarWrap.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import tableMixin from '@/mixins/table'
import { Statistics, AccountCard, IconTip, Select } from 'components'
import ImportAcounts from '@/components/ImportAcounts'
import { $getMedAccounts } from '@/api/bussiness-manage'
import {
  $getSignContractCondition,
  $getSignContractTikTokCondition,
  $getSignContractKuaiShouCondition,
  $getSignContractBliCondition,
  $getSignContractRedBookCondition,
  $findSignContractAccountList,
  $findSignAccountTikTokList,
  $findSignAccountKuaiShouList,
  $findSignAccountBliList,
  $findSignAccountRedBookList,
  $updateAccountStatus,
  $deleteAccount,
  $getPrevUpdateStatus,
  $getSignContractTeam
} from '@/api/sign-contract'
import { copy } from '@/components/common'
import { unique } from '@/utils'
import { $getAera, $getDataByDictType, $getSceneTags } from '@/api'
import {
  responseSpeedOptions,
  cooperationOptions,
  contentCreativeOptions
} from '@/views/bussiness-manage/@common/scoreOptions'
import dayjs from 'dayjs'
// import AddMediumAccount from '../../_mods/AddMediumAccount/'

const LEVEL = [
  { value: 'S', label: 'S' },
  { value: 'A', label: 'A' },
  { value: 'B', label: 'B' },
  { value: 'C', label: 'C' }
]

export default {
  components: {
    vSearch: Search,
    Statistics,
    ImportAcounts,
    AccountCard,
    AddAccountDialog,
    // AddMediumAccount,
    IconTip,
    Select,
    accountSelect,
    CalendarWrap
  },
  mixins: [tableMixin],
  props: {
    type: {
      type: String,
      default: 'douyin'
    }
  },
  data() {
    return {
      getPrevUpdateStatus: $getPrevUpdateStatus,
      editType: '',
      showDialog: false,
      formConf: {},
      accountId: null,
      currEditRow: null,
      searchData: {
        accountId: '',
        accountName: '',
        accountStatus: '',
        platId: '',
        accountType: '',
        opportunitySwitch: 1,
        pageNum: 1
      },

      // inputTags: [],
      optionsData: {
        // 媒介采买人
        userList: []
      },
      // 统计数据
      summaryItems: [
        {
          key: 'accountNum',
          text: '账号数量',
          val: 0
        },
        {
          key: 'onlineAccountNum',
          text: '上架账号数量',
          val: 0
        },
        {
          key: 'confirmAccountCount',
          text: '被指派工单账号数量',
          val: 0
        },
        {
          key: 'inquiryCount',
          text: '问询总数',
          val: 0
        },
        {
          key: 'inquirySuccessRate',
          text: '平均问询成功率',
          val: 0,
          tip: '平均问询成功率=问询成功总数/问询总次数'
        }
      ],
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
      // 合作状态
      coopStatusList: [
        {
          value: 1,
          label: '解约'
        },
        {
          value: 2,
          label: '拉黑'
        }
      ],
      normalFormItemMap: {},
      sixRange: [],
      importConf: {
        pageType: 2,
        methodId: 3,
        title: '导入签约账号',
        url: '/api/sign/contract/account/uploadSignContractAccount'
      },
      isEdit: false,
      checkTableRow: [],
      checkAccountListIds: [],
      importDrawerStatus: false, // 批量导入账号弹窗
      signTeamList: [],
      showMore: false,
      inquiryTime: [],
      // finishTimeConfirm: [],
      sixRangeList: [],
      regionList: [],
      accountList: [],
      paramsConfig: { methodId: 1, accountType: 1 },
      level: LEVEL,
      talentShow: false,
      talentStatus: false,
      interestSelectArr: [
        { val: 0, label: '付费' },
        { val: 1, label: '免费' }
      ],
      offlineOrderSelectArr: [
        { val: 1, label: '接受线下商单' },
        { val: 0, label: '不接受线下商单' }
      ],
      sceneTags: [],
      sceneEditTags: [],
      accountTagList: [],
      showCalendarDialog: false,
      dqAccountId: 0,
      accountDqMsg: {}
    }
  },
  computed: {
    ...mapGetters(['user', 'realname']),
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
      return `账号报价来源于${plat}平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。`
    },
    getPlatId() {
      let platId = ''
      switch (this.type) {
        case 'douyin':
          platId = 25
          break
        case 'kuaishou':
          platId = 26
          break
        case 'bilibili':
          platId = 2
          break
        case 'xiaohongshu':
          platId = 45
          break
      }
      return platId
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
    }
  },
  created() {
    this.buildFormConf()
    this.getFilterData()
    // this.getFilterList()

    this.getArea().then((res) => {
      this.regionList = res.data
    })
    // this.getDataByDictType()
    this.getSeachConfigList()

    $getSceneTags({
      platId: 0,
      tagType: 2,
      operationScene: ['signListAccountSearch', 'signEdit']
    }).then(({ code, data }) => {
      if (+code === 1) {
        this.sceneEditTags = data.signEdit || []
        this.sceneTags = data.signListAccountSearch || []
        this.sceneTags = this.sceneTags.filter(
          (item) => item.md5Id !== '2fd12409ed6151ec30b7e8e0667b77d9'
        )
      }
    })

    this.$nextTick(() => {
      const height = this.$refs.talentBox.clientHeight
      if (height > 56) {
        this.talentShow = true
      } else {
        this.talentShow = false
      }
    })
  },
  mounted() {
    const currentMonth = dayjs().format('YYYY-MM')
    const date = currentMonth.split('-')
    const day = new Date(date[0], date[1], 0)
    const timeEnd = date[0] + '-' + date[1] + '-' + day.getDate()
    const timeStart = `${dayjs().year()}-${
      dayjs().month() + 1 > 9 ? dayjs().month() + 1 : `0${dayjs().month() + 1}`
    }-01`
    this.$set(this.$refs.search.form, 'signContractDate', [
      `${timeStart}`,
      `${timeEnd}`
    ])
    this.searchData.signContractDate = [
      timeStart + ' 00:00:00',
      timeEnd + ' 23:59:59'
    ]

    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    checkVerifyPermission(row) {
      return row.editOperatorPermissions
    },
    handleProvChange(node, resolve) {
      const provName = node.value
      const level = node.level
      // 暂时性修复执行两次的问题
      if (level === 2 || (node.children && node.children.length > 0)) {
        return resolve()
      }
      // this.searchData.provinceName = provName
      if (provName) {
        const id = this.regionList.find(
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
    getArea(parentId = 0, random = '') {
      return $getAera({ parentId }, random)
    },
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'signGroupId',
          data: [],
          conf: {
            placeholder: '签约团队'
          },
          optionValKey: 'id',
          optionLabelKey: 'orgName'
        },
        {
          type: 'select',
          key: 'signTeamId',
          data: [],
          conf: {
            placeholder: '选择签约小组'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'sign_progress_contract_group'
        },
        {
          type: 'select',
          key: 'brokerUserId',
          data: [],
          conf: {
            placeholder: '选择签约经纪人'
          },
          permissionName: 'sign_progress_contract_user'
        }
      ]
      const formConf = {
        normal,
        // hasExport: this.$permission('export_sign_contract')
        hasExport: this.$permission('manager_export')
      }
      const normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      normalFormItemMap.accountStatus = {
        type: 'select',
        key: 'accountStatus',
        data: this.accountStatusList,
        conf: {
          placeholder: '请选择账号状态',
          clearable: true
        },
        value: 0,
        optionValKey: 'value',
        optionLabelKey: 'label'
      }

      normalFormItemMap.coopStatus = {
        type: 'select',
        key: 'coopStatus',
        data: this.coopStatusList,
        conf: {
          placeholder: '请选择合作状态',
          clearable: true
        },
        value: 0,
        optionValKey: 'value',
        optionLabelKey: 'label'
      }

      normalFormItemMap.platId = {
        type: 'select',
        key: 'platId',
        data: [],
        conf: {
          placeholder: '全部平台',
          clearable: true
        },
        optionValKey: 'platId',
        optionLabelKey: 'platName'
      }
      normalFormItemMap.accountId = {
        type: 'select',
        key: 'accountId',
        data: [],
        conf: {
          placeholder: '请输入账号',
          allowCreate: true,
          defaultFirst: true,
          clearable: true,
          filterable: true
        },
        optionValKey: 'accountId',
        optionLabelKey: 'accountName'
      }
      normalFormItemMap.sysPlatTags = {
        type: 'select',
        key: 'sysPlatTags',
        data: [],
        conf: {
          placeholder: '达人类型',
          clearable: true,
          filterable: true
        }
      }
      normalFormItemMap.fansRange = {
        type: 'select',
        key: 'fansRange',
        data: [],
        conf: {
          placeholder: '粉丝量级别',
          clearable: true
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }
      normalFormItemMap.priceRange = {
        type: 'select',
        key: 'priceRange',
        data: [],
        conf: {
          placeholder:
            this.type === 'douyin'
              ? '21-60s报价'
              : this.type === 'kuaishou'
              ? '达人报价'
              : this.type === 'bilibili'
              ? '定制视频报价'
              : this.type === 'xiaohongshu'
              ? '视频笔记报价'
              : '',
          clearable: true
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }
      normalFormItemMap.region = {
        type: 'cascader',
        key: 'region',
        data: [],
        conf: {
          placeholder: '达人所在区',
          props: {
            value: 'areaName',
            label: 'areaName',
            lazy: true,
            lazyLoad: this.handleProvChange,
            emitPath: true,
            checkStrictly: true
          }
        }
      }
      normalFormItemMap.maxAgeLabel = {
        type: 'select',
        key: 'maxAgeLabel',
        data: [],
        conf: {
          placeholder: '粉丝年龄',
          clearable: true
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }
      // normalFormItemMap.sixRange = {
      //   type: 'cascader',
      //   key: 'sixRange',
      //   data: [],
      //   conf: {
      //     placeholder: '粉丝性别分布',
      //     options: [],
      //     clearable: true,
      //     props: { value: 'dictValue', label: 'dictLabel', emitPath: true, checkStrictly: true }
      //   }
      // }
      normalFormItemMap.maxPhoneLabel = {
        type: 'select',
        key: 'maxPhoneLabel',
        data: [],
        conf: {
          placeholder: '粉丝手机系统',
          clearable: true
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }
      normalFormItemMap.outMoneyRatio = {
        type: 'select',
        key: 'outMoneyRatio',
        data: [],
        conf: {
          placeholder: '达人分成比例',
          clearable: true
        }
      }
      normalFormItemMap.quantityFlag = {
        type: 'select',
        key: 'quantityFlag',
        data: [
          {
            text: '是',
            val: 1
          },
          {
            text: '否',
            val: 0
          }
        ],
        conf: {
          placeholder: '是否保量',
          clearable: true
        }
      }
      normalFormItemMap.baseSalaryFlag = {
        type: 'select',
        key: 'baseSalaryFlag',
        data: [
          {
            text: '是',
            val: 1
          },
          {
            text: '否',
            val: 0
          }
        ],
        conf: {
          placeholder: '是否底薪',
          clearable: true
        }
      }

      normalFormItemMap.responseSpeedScore = {
        type: 'select',
        key: 'responseSpeedScore',
        data: responseSpeedOptions,
        conf: {
          placeholder: '响应速度',
          clearable: true
        },
        optionValKey: 'value',
        optionLabelKey: 'label'
      }

      normalFormItemMap.cooperationScore = {
        type: 'select',
        key: 'cooperationScore',
        data: cooperationOptions,
        conf: {
          placeholder: '配合度',
          clearable: true
        },
        optionValKey: 'value',
        optionLabelKey: 'label'
      }

      normalFormItemMap.contentCreativeScore = {
        type: 'select',
        key: 'contentCreativeScore',
        data: contentCreativeOptions,
        conf: {
          placeholder: '内容创意',
          clearable: true
        },
        optionValKey: 'value',
        optionLabelKey: 'label'
      }

      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    // 获取下拉框选项 CPM
    // getFilterList() {
    //   $getDataByDictType({
    //     dictTypes: ['sys_search_cpm']
    //   }).then(res => {
    //     if (res.code === 1) {
    //       this.normalFormItemMap.cpm.data = res.data.sys_search_cpm
    //     }
    //   })
    // },
    // 获取搜索条件数据
    getFilterData() {
      let request = ''
      if (this.type === 'douyin') {
        request = $getSignContractTikTokCondition
      } else if (this.type === 'kuaishou') {
        request = $getSignContractKuaiShouCondition
      } else if (this.type === 'bilibili') {
        request = $getSignContractBliCondition
      } else if (this.type === 'xiaohongshu') {
        request = $getSignContractRedBookCondition
      }

      request().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.plats || []
          // this.normalFormItemMap.meetUserId.data = res.data.meetAccounts || []
          this.normalFormItemMap.sysPlatTags.data = res.data.sysPlatTags || []
          this.normalFormItemMap.brokerUserId.data = res.data.users.map(
            (item) => ({ val: item.userId, text: item.realname })
          )
          this.normalFormItemMap.outMoneyRatio.data =
            res.data.outMoneyRatio.map((item) => ({
              val: item.dictValue - 0,
              text: item.dictLabel
            }))
          this.accountList = res.data.medAccountNameVOS || []
          this.normalFormItemMap.signGroupId.data =
            res.data.signGroupInfoList || []
          // this.optionsData.userList = [...res.data.editHeadUser]
          // this.normalFormItemMap.priceRange.data = res.data.priceRange.map(item => ({ val: item.dictValue, text: item.dictLabel }))
        } else {
          this.$message.error(res.message)
        }
      })
      // $getFilterRange().then(res => {
      //   if (res.code === 1) {
      //     // this.normalFormItemMap.playRange.data = res.data.playRange.map(item => ({ val: item, text: item }))
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 获取搜索配置项下拉数据
    getSeachConfigList() {
      $getDataByDictType({
        dictTypes: [
          'sign_contract_account_price_range',
          'sign_contract_account_fans_range',
          'sys_search_cpm',
          'fans_age_kuaishou_condition_age',
          'daren_library_query_condition_phone',
          'daren_library_query_condition_fans',
          'daren_library_query_condition_60s',
          'daren_library_query_condition_sex',
          'daren_library_query_condition_sex_rate'
        ]
      }).then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.maxAgeLabel.data =
            res.data.fans_age_kuaishou_condition_age
          this.normalFormItemMap.maxPhoneLabel.data =
            res.data.daren_library_query_condition_phone
          this.normalFormItemMap.priceRange.data =
            res.data.sign_contract_account_price_range
          this.normalFormItemMap.fansRange.data =
            res.data.sign_contract_account_fans_range
          this.sixRangeList = res.data.daren_library_query_condition_sex.map(
            (item) => ({
              ...item,
              children: res.data.daren_library_query_condition_sex_rate
            })
          )
          // {

          //   if (item.list && item.list.length === 0) {
          //     item.list = res.data[item.key] || []
          //   }
          //   if (!item.all) {
          //     const all = {
          //       [item.valKey]: '',
          //       [item.labelName]: '全部'
          //     }
          //     item.list.unshift(all)
          //   }
          // })
        }
      })
    },
    // 弹窗打开
    dialogOpen() {
      if (this.addForm.provId) {
        this.provinceChange(this.addForm.provId, false)
      }
    },
    // 查看
    handleShow(row) {
      const { platId, accountId, accountType } = row
      if ([25, 26].includes(platId)) {
        this.$router.push({
          path: `/details/account/${platId}/${accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else if (platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else {
        this.$router.push({
          path: '/order-account-detail',
          query: {
            accountId: accountId,
            type: 1,
            signContract: 1,
            _blank: true
          }
        })
      }
    },
    handleShowMore() {
      this.showMore = !this.showMore
    },
    handleBussiness(row, name) {
      let url = '/bussiness-manage/business_opportunity_manage'

      if (+row.opportunitySwitch === 1) {
        url = '/qp/business-opportunity-manage'
      }

      this.$router.push({
        path: url,
        query: {
          accountId: row.accountId,
          platId: row.platId,
          time: this.inquiryTime ? String(this.inquiryTime) : '',
          _blank: true
        }
      })
    },
    // 编辑媒介账号-获取信息
    handleEdit(row) {
      this.currEditRow = row
      this.editType = 'edit'
      this.isEdit = true
      this.accountId = row.accountId
      this.showDialog = true
    },
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'signGroupId') {
        model.signTeamId = ''
        this.normalFormItemMap.signTeamId.data = []
        $getSignContractTeam({
          signGroupId: val
        }).then((res) => {
          this.normalFormItemMap.signTeamId.data = res.data || []
        })
      }
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    getAccountList(val, model) {
      model.accountId = ''
      this.normalFormItemMap.accountId.data = []
      $getMedAccounts({ platId: val, methodId: 2 }).then((res) => {
        this.accountList = res.data || []
      })
    },
    formatData(data) {
      const params = copy(data)
      // 问询时间
      if (params.inquiryTime) {
        params.inquireTimeStart = params.inquiryTime[0] + ' 00:00:00'
        params.inquireTimeEnd = params.inquiryTime[1] + ' 23:59:59'
      } else {
        params.inquireTimeStart = ''
        params.inquireTimeEnd = ''
      }

      // 已定档期时间
      if (params.finishTimeConfirm) {
        params.finishTimeConfirmStart =
          params.finishTimeConfirm[0] + ' 00:00:00'
        params.finishTimeConfirmEnd = params.finishTimeConfirm[1] + ' 23:59:59'
        delete params.finishTimeConfirm
      } else {
        params.finishTimeConfirmStart = ''
        params.finishTimeConfirmEnd = ''
      }

      // 解约时间
      if (params.cancelContractTime) {
        params.cancelContractTimeStart = params.cancelContractTime[0] + ' 00:00:00'
        params.cancelContractTimeEnd = params.cancelContractTime[1] + ' 23:59:59'
        delete params.cancelContractTime
      } else {
        params.cancelContractTimeStart = ''
        params.cancelContractTimeEnd = ''
      }

      this.inquiryTime = params.inquiryTime
      delete params.inquiryTime
      return params
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      data = this.formatData(data)
      this.searchData = Object.assign(this.searchData, data)
      this.searchData.pageNum = 1

      let inquiryTime = ''
      if (this.searchData.inquireTimeStart) {
        inquiryTime = [
          this.searchData.inquireTimeStart,
          this.searchData.inquireTimeEnd
        ].join(',')
      }

      lego.send({
        appid: 'ZHUANZHUAN',
        pagetype: `data.qpmcn.com-sign-manage-sign-contract-accounts?activeName=${this.type}`,
        actiontype: 'SIGN_CONTRACT_ACCOUNTS',
        abtesttype: 'ALL',
        lon: 0,
        lat: 0,
        ua: window.navigator.userAgent.toLowerCase(),
        os: '',
        backup: {
          inquiryTime
        }
      })
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }

      if (params.signContractDate && params.signContractDate.length) {
        params.signContractDateBegin = params.signContractDate[0]
        params.signContractDateEnd = params.signContractDate[1]
        delete params.signContractDate
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

      // 解约时间
      if (params.cancelContractTime) {
        params.cancelContractTimeStart = params.cancelContractTime[0] + ' 00:00:00'
        params.cancelContractTimeEnd = params.cancelContractTime[1] + ' 23:59:59'
        delete params.cancelContractTime
      }

      if (params.priceRange) {
        params.priceRange = params.priceRange
          .split('-')
          .map((item) => {
            if (item.lastIndexOf('w') !== -1 || item.lastIndexOf('万') !== -1) {
              item = item.slice(0, -1) * 10000
            }
            return item
          })
          .join('-')
        delete params.priceInputStart
        delete params.priceInputEnd
      }

      if (this.$refs.cascader) {
        params.tagNameList = this.$refs.cascader
          .getCheckedNodes()
          .map((item) => {
            if (item.hasChildren) {
              return ''
            } else {
              return item.value
            }
          })
          .filter((item) => item)
      }

      params.accountTagList = this.accountTagList

      let url = ''

      if (this.type === 'douyin') {
        url = '/api/sign/contract/account/tiktok/exportSignAccountTikTokList'
      } else if (this.type === 'kuaishou') {
        url =
          '/api/sign/contract/account/kuaishou/exportSignAccountKuaiShouList'
      } else if (this.type === 'bilibili') {
        url = '/api/sign/contract/account/blibli/exportSignAccountBliList'
      } else if (this.type === 'xiaohongshu') {
        url = '/api/sign/contract/account/redbook/exportSignAccountRedBookList'
      }

      location.href = `${url}?${qs.stringify(params)}&componentId=${
        this.$componentId
      }`
    },

    handleAddAccount() {
      this.editType = 'add'
      this.currEditRow = null
      this.showDialog = true
      this.isEdit = false
    },
    // 删除账号
    handleDeletAccount(row) {
      $deleteAccount({ accountId: row.accountId })
        .then((res) => {
          if (res.code === 1) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    },
    formatAccount(params) {
      if (params.platId) {
        if (params.accountName) {
          params.belongName = ''
          params.accountId = ''
        } else {
          params.belongName = ''
        }
      } else {
        if (params.belongName) {
          params.accountId = ''
          params.accountName = ''
        }
      }
      return params
    },

    // 重置报价选择
    handleResetPrice() {
      const data = { ...this.searchData }
      delete data.priceInputStart
      delete data.priceInputEnd
      this.searchData = data
    },

    // 修改报价选择的逻辑
    handleChangeSelectPriceRange(val) {
      this.handleResetPrice()
      this.$refs.search.form = {
        ...this.$refs.search.form,
        priceRange: val
      }
    },

    // 修改报价选择的下拉框显隐逻辑
    handleVisibleChangePriceRange(flag) {
      if (!flag) {
        const { priceInputStart, priceInputEnd } = this.searchData
        if (
          typeof priceInputStart === 'number' ||
          typeof priceInputEnd === 'number'
        ) {
          this.$refs.search.form = {
            ...this.$refs.search.form,
            priceRange: `${priceInputStart || 0}w-${
              priceInputEnd === 0 ? 0 : priceInputEnd || 100000
            }w`
          }
        }
      } else {
        if (!this.$refs.search.form.priceRange) {
          this.handleResetPrice()
        }
      }
    },

    handleChangeCascader(val) {
      if (val.length <= 1) {
        val.push('')
        this.$set(this.$refs.search.form, 'tagNameList', val)
        this.searchData = {
          ...this.searchData,
          tagNameList: val
        }
      }
    },

    getList() {
      this.loading = true
      const params = copy(this.searchData)
      console.log(params, 'params')
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      if (params.signContractDate && params.signContractDate.length) {
        params.signContractDateBegin = params.signContractDate[0]
        params.signContractDateEnd = params.signContractDate[1]
        delete params.signContractDate
      }
      if (params.region && params.region.length) {
        params.provinceName = params.region[0]
        params.cityName = params.region[1]
        delete params.region
      }
      if (params.sixRange) {
        params.maxSexLabel = params.sixRange[0]
        params.maxSexRate = params.sixRange[1]
        console.log(params.sixRange)
        delete params.sixRange
      }
      if (params.priceRange) {
        params.priceRange = params.priceRange
          .split('-')
          .map((item) => {
            if (item.lastIndexOf('w') !== -1 || item.lastIndexOf('万') !== -1) {
              item = item.slice(0, -1) * 10000
            }
            return item
          })
          .join('-')
        delete params.priceInputStart
        delete params.priceInputEnd
      }

      if (this.$refs.cascader) {
        params.tagNameList = this.$refs.cascader
          .getCheckedNodes()
          .map((item) => {
            if (item.hasChildren) {
              return ''
            } else {
              return item.value
            }
          })
          .filter((item) => item)
      }

      params.accountTagList = this.accountTagList

      let request = ''
      if (this.type === 'douyin') {
        request = $findSignAccountTikTokList
      } else if (this.type === 'kuaishou') {
        request = $findSignAccountKuaiShouList
      } else if (this.type === 'bilibili') {
        request = $findSignAccountBliList
      } else if (this.type === 'xiaohongshu') {
        request = $findSignAccountRedBookList
      }

      request(params)
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
            this.summaryItems = this.summaryItems.map((item) => {
              if (item.key === 'inquirySuccessRate') {
                item.val = res.data[item.key] + '%'
              } else {
                item.val = res.data[item.key] || 0
              }
              return item
            })
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    },

    handleChangeOpportunitySwitch() {
      this.getList()
    },

    // 列表选择
    handleListSelect(s) {
      console.log(s)
      this.checkAccountListIds = s.map((item) => item.accountId)
    },
    // 更改账号状态
    hanleAccountStatus(row) {
      const accountIds = []
      const accountStatus = row.accountStatus
      accountIds.push(row.accountId)
      this.updateAccountStatus({ accountIds, accountStatus })
    },
    // 批量更新账号状态
    updateCheckAccountStatus(accountStatus) {
      if (this.checkAccountListIds.length === 0) {
        return this.$message.error('请选择要批量操作的数据')
      }
      this.updateAccountStatus({
        accountIds: this.checkAccountListIds,
        accountStatus
      })
    },
    updateAccountStatus({ accountIds = [], accountStatus = 0 }) {
      $updateAccountStatus({ accountStatus, accountIds })
        .then((res) => {
          if (res.code === 1) {
            this.$message.success('操作成功')
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    },
    handleToDq(row) {
      this.dqAccountId = +row.accountId
      this.showCalendarDialog = true
      this.accountDqMsg = row
    },
    closeCalendarWrap() {
      this.showCalendarDialog = false
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
<style scoped lang='scss'>
.MCN-icon {
  ::v-deep {
    .iconfont {
      color: #ff6f00 !important;
    }
  }
}
.getMoreButton {
  margin-left: 10px;

  span {
    transform: scaleX(2) rotate(-90deg);
    transition: all 0.2s;
    display: inline-block;
    font-size: 10px;
    margin-left: 8px;
  }
}
.showMoreButton {
  span {
    transform: scaleX(2) rotate(90deg);
  }
}

.otherMessage {
  p {
    text-align: left;
    font-size: 12px;
    color: #999;
  }
}

.price {
  text-align: left;

  p {
    span:nth-child(1) {
      display: inline-block;
      width: 74px;
    }
  }
}

::v-deep {
  .el-cascader {
    margin-right: 0 !important;
    width: 200px;
  }

  .el-link--inner {
    width: 60px;
    display: inline-block;
    padding-top: 6px;
  }

  .optionInput {
    width: 76px;
    margin-right: 4px;
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

.hideTalent {
  height: 56px;
  overflow: hidden;
}

.iconshouqi,
.iconzhankai {
  font-size: 14px;
  margin-left: 5px;
}

.area {
  font-size: 12px;
  color: #999;
}

.dangqi {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #2c64ff;
  color: #2c64ff;
  margin: 0 auto;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  caret-color: transparent;
}

.selectBtnWrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;

  .el-radio-group {
    margin-left: 20px;
    margin-top: 2px;
  }
}

.priceSelect {
  width: 220px;
  margin-bottom: 0 !important;

  & > div {
    margin-top: 100px;
  }

  .optionSlot {
    margin: -3px 20px 0;
    border-top: 1px solid #eee;
    padding: 7px 0 0;

    .optionBox {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .seg {
        margin: 0 8px;
      }
    }

    .reset {
      margin: 4px 0 0;
    }
  }
}
</style>
