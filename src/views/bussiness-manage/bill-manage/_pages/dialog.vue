<template>
  <el-dialog
    :visible="addVisible"
    :title="dialogTitle"
    :close-on-click-modal="isOnlyShow ? true : false"
    width="1100px"
    @close="showFormClose"
  >
    <div v-if="dialogTitle === '编辑' && showCheckInvoiceFlag" class="notice">
      商单已核账，部分信息不再支持编辑，遇特殊情况需要修改的，请联系财务
    </div>
    <!--新增编辑区域-->
    <el-form
      v-show="!isOnlyShow"
      ref="showForm"
      v-loading="loading"
      class="modal-form"
      label-position="right"
      :rules="addRules"
      :model="showForm"
      :scroll-to-error="true"
      label-width="130px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="选择客户联系人" prop="customId">
            <!-- 编辑 -->
            <template v-if="!isOnlyShow && quotientId">
              {{ showForm.customerName }}
            </template>
            <el-select
              v-else
              v-model="showForm.customId"
              filterable
              placeholder="请选择客户联系人"
              class="m-r-10"
              :disabled="isOpp || (isMoneyCatch && quotientId != '')"
              @change="customChange"
            >
              <el-option
                v-for="item in formItemMap.selfCustomerNameAndIdBOList"
                :key="item.customerId"
                :label="item.customerName"
                :value="item.customerId"
              />
            </el-select>
            <el-button size="small" type="primary" @click="toAddClient">去新增对接人</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌" prop="brandIds">
            <Select v-model="showForm.brandIds" :config="optionsData.brandTags" :disabled="EditCooperation" />
            <!-- <el-select v-model="showForm.brandIds" filterable placeholder="请选择品牌" :disabled="isMoneyCatch && quotientId != ''">
              <el-option
                v-for="item in brandTags"
                :key="item.brandId"
                :label="item.brandName"
                :value="item.brandId"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合作产品" prop="quotientName">
            <el-input v-model.trim="showForm.quotientName" placeholder="输入合作产品" :disabled="EditCooperation" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计发布时间" prop="punishDateArr">
            <el-date-picker
              v-model="showForm.punishDateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行人小组" prop="executeGroupId">
            <el-select v-model="showForm.executeGroupId" :disabled="EditCooperation" @change="excuteGroupChange">
              <el-option
                v-for="item in formItemMap.executeGroupInfoBOList"
                :key="item.executeGroupId"
                :label="item.executeGroupName"
                :value="item.executeGroupId"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="执行人"
            prop="executeId"
          >
            <el-select v-model="showForm.executeId" filterable clearable>
              <el-option
                v-for="item in formItemMap.executorInfoBOList"
                :key="item.executeId"
                :label="item.executeName"
                :value="item.executeId"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="商单成单时间" prop="productTime">
            <el-date-picker v-model="showForm.productTime" value-format="yyyy-MM-dd" :disabled="EditCooperation" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="行业类别"
            prop="fieldIds"
          >
            <el-cascader
              ref="cascader"
              v-model="showForm.fieldIds"
              placeholder="请选择行业类别"
              :options="formItemMap.industryTypeTags"
              :props="{ checkStrictly: false, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' }"
              clearable
              @change="handleChangeFieldIds"
            />
            <!-- <el-select v-model="showForm.fieldIds" multiple filterable :multiple-limit="1">
              <el-option
                v-for="item in formItemMap.industryTypeTags"
                :key="item.id"
                :value="item.id"
                :label="item.newsContent"
              />
            </el-select> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售收入" prop="workMoney">
            <el-input v-model.trim="showForm.workMoney" type="number" placeholder="输入未扣除返点的流水金额" :min="0" :precision="2" :disabled="EditCooperation" />
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="返点金额" prop="discount">
            <el-input-number
              v-model.trim="showForm.discount"
              type="number"
              placeholder="请输入返点金额"
              :min="0"
              :precision="2"
              :disabled="showCheckInvoiceFlag"
            />
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="返点金额：返回给客户的金额，若是合同成单，则无返点金额；若是客户自行下单，则无平台手续费，返点金额视谈判结果而可有可无"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
          <el-form-item label="销售成本">
            {{ showForm.costMoney }}
            <el-popover
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售成本：返点成本+抖＋成本+平台手续费+其他成本；若是合同成单，则无返点金额；若是客户自行下单，则无平台手续费，返点金额视谈判结果而可有可无"
            >
              <i slot="reference" class="el-icon-question" />
            </el-popover>
          </el-form-item>
        </el-col> -->

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="返点日期" prop="dis">
            <el-date-picker
              v-model="showForm.discountDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择返点日期"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工单返款" prop="workOrderDiscountAll">
            {{ showForm.workOrderDiscountAll }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="工单返款：汇总该商单所有工单的对公返款和对私返款之和。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="折扣金额" prop="rebateMoney">
            {{ showForm.rebateMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="折扣金额：汇总该商单所有工单的平台折扣金额之和"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="抖+成本" prop="douMoney">
            {{ showForm.douMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="抖+成本：汇总该商单所有工单的抖+成本之和"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="平台手续费" prop="platMoney">
            {{ showForm.platMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="平台手续费：汇总该商单所有工单的平台手续费之和"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="其他成本" prop="otherMoney">
            {{ showForm.otherMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="其他成本：汇总该商单所有工单的其他成本之和"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售成本">
            {{ showForm.costMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售成本：对公返点+对私返点+折扣金额+抖＋成本+平台手续费+其他成本。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达人分成成本">
            {{ showForm.outMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="达人分成成本：汇总该商单所有工单的达人分成成本之和"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="商单类型" prop="quotientType">
            <el-select v-model="showForm.quotientType" :disabled="showCheckInvoiceFlag" @change="handleQuotientType">
              <el-option
                v-for="item in quotientTypeList"
                :key="item.extValue"
                :label="item.configName"
                :value="Number(item.extValue)"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司主体" prop="companyType">
            <el-select v-model="showForm.companyType" :disabled="showCheckInvoiceFlag">
              <el-option
                v-for="item in COMPANY_TYPE"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="12">
          <el-form-item label="验收时点">
            <el-date-picker
              v-model="showForm.checkDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择验收时点"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票状态">
            <el-select v-model="showForm.receiptStatus">
              <el-option
                v-for="item in RECEIPT_STATUS_TYPE"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="是否到款" prop="isMoney">
            <el-select v-model="showForm.isMoney" :disabled="EditFlag" @change="showForm.getMoneyDate=null;showForm.transferredScreenshotUrl=[]">
              <el-option label="是" :value="1" />
              <el-option label="否" :value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款日期" prop="getMoneyDate">
            <el-date-picker
              v-model="showForm.getMoneyDate"
              :disabled="EditFlag"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择收款日期"
            />
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="收款日期：未收到款项时填写预计收款日期，实际收到款项时填写收款日期 "
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <!-- :disabled="!(diaLogType === 'edit' && formData.lockMoney === 0 && hasEditRight)" -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="OA合同编号:">
            <el-input v-model.trim="showForm.oaContractNo" type="text" placeholder="请输入" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商单状态:">
            <!-- <el-select v-model="showForm.checkAccountsFlag" :disabled="!$permission('invoice_status_select') || !+showForm.isMoney || showCheckInvoiceFlag">
              <el-option label="未核账" :value="0" />
              <el-option label="待核账" :value="2" />
              <el-option label="已核账" :value="1" />
            </el-select> -->
            {{ ['未核账', '已核账', '待核账'][showForm.checkAccountsFlag] || '--' }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="+showForm.isMoney" label="上传收款截图" prop="transferredScreenshotUrl">
        <UploadImg v-model="showForm.transferredScreenshotUrl" :limit="3" :disabled="showCheckInvoiceFlag" />
      </el-form-item>
      <!-- <el-row> -->
      <!-- <el-col :span="12"> -->
      <!-- <el-upload
              class="upload-view"
              :on-success="uploadSuccess"
              :on-preview="filePreview"
              :on-remove=""
              :file-list="uploadFileList"
              drag
              multiple
              :limit="1"
              list-type="picture"
              action="/api/admin/uploadImage"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                <em>点击上传</em>
              </div>
            </el-upload> -->
      <!-- <el-form-item label="上传收款截图">
            <el-upload
              ref="uploadImg"
              drag
              :limit="1"
              class="upload-view"
              :on-success="uploadImgSuccess"
              :show-file-list="false"
              action="/api/admin/uploadImage"
              accept=".png,.jpg,.jpeg"
              name="file"
            >
              <div v-if="showForm.collectionPhotoUrl" class="upload-wrap el-upload-list--picture-card">
                <img
                  class="pic"
                  :src="showForm.collectionPhotoUrl"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop.prevent="openUrl(showForm.collectionPhotoUrl)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click.stop.prevent="handleDelImg"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
              <div v-else>
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  <em>点击上传</em>
                </div>
              </div>
            </el-upload>
          </el-form-item> -->
      <!-- </el-col> -->
      <!-- <el-col :span="12">
          <el-form-item label="上传合同">
            <el-upload
              class="upload-view"
              :on-success="uploadFileSuccess"
              :on-preview="filePreview"
              :on-remove="fileRemove"
              :file-list="uploadFileList"
              drag
              multiple
              :limit="5"
              accept=".pdf,.docx,.doc"
              action="/api/business/order/uploadContract"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                <em>点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
        </el-col> -->
      <!-- </el-row> -->
      <el-row class="m-b-24">
        <el-col :span="24">
          <p class="el-form-item__error">1、通过发布视频合作接单的账号在下方左侧指派；</p>
        </el-col>
      </el-row>
      <el-row class="m-b-24">
        <el-col :span="24">
          <p class="el-form-item__error">2、通过代运营、代制作、直播、转发评论等其他不需要发布视频合作接单的在下方右侧选择合作方式后指派合作团队及人员；</p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="合作方式">视频</el-form-item>
          <el-form-item label="合作账号及归属">
            <el-row type="flex" justify="space-between">
              <el-col :span="10">
                <el-select v-model="platId" filterable placeholder="选择平台" @change="setAccountOptions">
                  <el-option
                    v-for="item in formItemMap.mngPlatInfoVOList"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platId"
                  />
                </el-select>
              </el-col>
              <el-col :span="10">
                <Select v-model="accountId" :config="accountMap" />
                <!-- <el-select v-model="accountId" filterable placeholder="选择账号">
                  <el-option
                    v-for="item in accountOptions"
                    :key="item.accountId"
                    :label="item.accountName"
                    :value="item.accountId"
                  />
                </el-select> -->
              </el-col>
              <el-col :span="3">
                <el-button size="small" type="primary" @click="addAccount">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="批量导入合作账号">
            <div class="flex-row">
              <el-link href="/api/business/order/downloadErrAccountData?type=1" type="primary" target="_blank" class="m-r-10">下载批量导入账号模板</el-link>
              <el-upload
                accept=".xls,.xlsx"
                :disabled="isOpp"
                :with-credentials="true"
                :before-upload="beforeUploadAccount"
                :on-success="uploadAccountSuccess"
                :on-error="uploadAccountError"
                action="/api/business/order/uploadAccountData"
                name="file"
                :show-file-list="false"
              >
                <el-button v-loading="uploadAccountLoading" size="small" type="primary">批量导入账号</el-button>
              </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="已指定合作账号">
            <div v-if="accountTags" class="max-height-156">
              <el-tag
                v-for="(item, index) in accountTags"
                :key="index"
                closable
                class="account-tag"
                @close="handleTagClose(index)"
              >{{ item.name }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作方式">
            <el-select v-model="specialData.workType">
              <el-option label="代运营" value="代运营" />
              <el-option label="直播" value="直播" />
              <el-option label="图文" value="图文" />
              <el-option label="转发" value="转发" />
              <el-option label="代制作" value="代制作" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          <el-form-item label="合作团队及人员">
            <el-row class="m-b-10">
              <el-col class="m-r-10" :span="7">
                <el-select
                  v-model="specialData.orgType"
                  filterable
                  clearable
                  placeholder="请选择部"
                  @change="handleOrgChange"
                >
                  <el-option
                    v-for="item in orgList"
                    :key="item.orgId"
                    :label="item.orgName"
                    :value="item.orgId"
                  />
                </el-select>
              </el-col>
              <el-col :span="16">
                <el-select
                  v-model="specialData.businessGroup"
                  filterable
                  clearable
                  placeholder="请选择军/工作室"
                  @change="setBusinessUser"
                >
                  <el-option
                    v-for="item in businessGroup"
                    :key="item.id"
                    :label="item.orgName"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
            </el-row>
            <el-row>
              <el-col class="m-r-10" :span="7">
                <el-select v-model="specialData.businessUser" filterable clearable placeholder="选择创作者">
                  <el-option
                    v-for="item in businessUser"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-col>
              <el-col class="m-r-10" :span="6">
                <el-select v-model="specialData.platName" filterable clearable placeholder="平台">
                  <el-option
                    v-for="item in formItemMap.mngPlatInfoVOList"
                    :key="item.platId"
                    :label="item.platName"
                    :value="item.platName"
                  />
                </el-select>
              </el-col>
              <el-col class="m-r-10" :span="6">
                <el-input
                  v-model="specialData.accountName"
                  class="account-input"
                  filterable
                  placeholder="选择账号"
                  maxlength="15"
                />
              </el-col>
              <el-col :span="3">
                <el-button size="small" type="primary" @click="addSpecialAccount">确定</el-button>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item label="已指定合作方">
            <div class="max-height-156">
              <el-tag
                v-for="(item, index) in specialNews"
                :key="index"
                closable
                class="account-tag"
                @close="handleSpecialTagClose(index)"
              >{{ item.text }}</el-tag>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注">
          <el-input v-model="showForm.note" type="textarea" placeholder="请输入备注内容" />
        </el-form-item>
      </el-row>
    </el-form>
    <!--查看区域-->
    <div v-show="isOnlyShow" v-loading="loading" class="show-view">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户联系人:">{{ showForm.customerName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商务:">{{ showForm.crmName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户公司名称:">{{ showForm.companyName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌:">{{ showForm.brandName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="合作产品:">{{ showForm.quotientName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="预计发布时间:"
            >{{ showForm.publishTimeStart }} {{ showForm.publishTimeStart && showForm.publishTimeEnd ? '至' : '' }} {{ showForm.publishTimeEnd }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="执行人小组:">{{ showForm.executeGroup }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="执行人:">{{ showForm.executeName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商单成单日期:">{{ showForm.productTime }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业类别：">{{ showForm.fieldName }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售收入：">{{ showForm.workMoney }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="返点金额:">{{ showForm.discount }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="返点日期:">{{ showForm.discountDate }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工单返款:">{{ showForm.workOrderDiscountAll }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="折扣金额:">{{ showForm.rebateMoney }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抖+成本:">{{ showForm.douMoney }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="平台手续费:">{{ showForm.platMoney }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他成本:">{{ showForm.otherMoney }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="销售成本:">{{ showForm.costMoney }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="达人分成成本:">{{ showForm.outMoney }}</el-form-item>
          </el-col>
        </el-row>

        <el-row />
        <el-row>
          <el-col :span="12">
            <el-form-item label="商单类型:">{{ quotientName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="公司主体:">{{ companyName }}</el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col :span="12">
            <el-form-item label="验收时点:">{{ showForm.checkDate }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开票状态:">{{ getInvoiceState(showForm.receiptStatus) }}</el-form-item>
          </el-col>
        </el-row> -->
        <el-row>

          <el-col :span="12">
            <el-form-item label="是否到账:">{{ showForm.isMoney === 1 ? '是' : '否' }}</el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="收款日期:">{{ showForm.getMoneyDate }}</el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="OA合同编号:">{{ showForm.oaContractNo }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商单状态:">{{ ['未核账', '已核账', '待核账'][showForm.checkAccountsFlag] || '--' }}</el-form-item>
          </el-col>
        </el-row>

        <el-form-item v-if="+showForm.isMoney" label="上传收款截图:" prop="transferredScreenshotUrl">
          <UploadImg v-model="showForm.transferredScreenshotUrl" :limit="3" disabled />
        </el-form-item>
        <!-- <el-row> -->
        <!-- <el-col :span="12">
            <el-form-item label="收款截图:">
              <el-image
                style="width: 100px; height: 100px"
                :src="showForm.collectionPhotoUrl"
                @click="openUrl(showForm.collectionPhotoUrl)"
              />
            </el-form-item>
          </el-col> -->
        <!-- <el-col :span="12">
            <el-form-item label="上传合同:">
              <br>
              <div v-if="showForm.briefs && showForm.briefs.length">
                <div class="show-brief-view">
                  <div v-for="(item, index) in showForm.briefs" :key="index" class="file-content">
                    <p>{{ item.name }}</p>
                    <el-link
                      type="primary"
                      target="_blank"
                      :href="item.url"
                      :download="item.name"
                    >下载</el-link>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-col> -->
        <!-- </el-row> -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="合作账号及账号归属:">{{ showForm.accountBelong }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合作团队及人员:">{{ showForm.specialNewsText }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="备注:">
              <p v-html="showForm.note" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最近编辑时间:">{{ (showForm.addTime * 1000) | date }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <span v-show="!isOnlyShow" slot="footer" class="dialog-footer">
      <el-button @click="showFormClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="addConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  $getBusinessOrderInfo,
  $addQuotientInfo,
  $getAccountAndPlatInfo,
  $getTeamAndMember,
  $updateQuotientInfo,
  $getOpportunityInfo,
  $getSelfCustomerList
} from '@/api/bussiness-manage'
import { $getByConfigCode, $getNextOrgInfo } from '@/api/index'
import { copy } from '@/components/common'
import { unique } from '@/utils'
import { IconTip, Select, UploadImg } from 'components'

// 公司主体
const COMPANY_TYPE = [
  {
    val: 1,
    text: '乾派'
  },
  {
    val: 2,
    text: '向乾'
  }
]

// 发票状态类型
const RECEIPT_STATUS_TYPE = [
  {
    val: 0,
    text: '未选择'
  },
  {
    val: 1,
    text: '已开发票'
  },
  {
    val: 2,
    text: '未开发票'
  },
  {
    val: 3,
    text: '无需开发票'
  }
]

const SHOW_DATA = {
  outMoney: 0,
  costMoney: 0,
  otherMoney: 0,
  douMoney: 0,
  platMoney: 0,
  workOrderDiscountAll: 0,
  rebateMoney: 0,
  quotientType: '',
  companyType: '',
  quotientId: '',
  customId: '',
  quotientName: '',
  companyId: '',
  executeId: '',
  brandIds: '',
  workMoney: '',
  collectionPhotoUrl: '',
  publishTime_start: '',
  publishTime_end: '',
  discount: 0,
  executeGroupId: '',
  accountIds: '',
  productTime: '',
  isMoney: 0,
  note: '',
  briefs: [],
  fieldIds: [],
  checkDate: '',
  discountDate: '',
  receiptStatus: '',
  getMoneyDate: '',
  transferredScreenshotUrl: [],
  checkAccountsFlag: 0
}

export default {
  components: { IconTip, Select, UploadImg },
  props: {
    addVisible: {
      type: Boolean,
      default: false
    },
    isOnlyShow: {
      type: Boolean,
      default: false
    },
    normalFormItemMap: {
      type: Object,
      default() {
        return {}
      }
    },
    optionsData: {
      type: Object,
      default() {
        return {}
      }
    },
    quotientId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    oppId: {
      type: String,
      default: ''
    }
  },
  data() {
    const validFieldIds = (rule, value, callback) => {
      if (!this.fieldIdsRequired) return callback()
      if (this.showForm.fieldIds.length > 0) {
        callback()
      } else {
        callback(new Error(rule.message))
      }
    }
    return {
      COMPANY_TYPE,
      RECEIPT_STATUS_TYPE,
      isMoneyCatch: false,
      orgList: [],
      showForm: {
        brandIds: ''
      },
      addRules: {
        discount: [{ required: true, message: '请输入返点政策', trigger: 'blur' }],
        quotientType: [{ required: true, message: '请选择商单类型', trigger: 'change' }],
        companyType: [{ required: true, message: '请选择公司主体', trigger: 'change' }],
        customId: [{ required: true, message: '请选择客户联系人', trigger: 'change' }],
        quotientName: [{ required: true, message: '请输入合作产品', trigger: 'blur' }],
        brandIds: [{ required: true, message: '请选择品牌', trigger: ['change', 'blur'] }],
        executeGroupId: [{ required: true, message: '请选择执行人小组', trigger: 'change' }],
        executeId: [{ required: true, message: '请选择执行人', trigger: 'change' }],
        workMoney: [{ required: true, message: '请输入销售收入', trigger: 'blur' }],
        punishDateArr: [{ required: true, message: '请选择预计发布时间', trigger: 'change' }],
        productTime: [{ required: true, message: '请选择商品成单日期', trigger: 'change' }],
        fieldIds: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
        isMoney: [{ required: true, message: '请选择是否到款', trigger: 'change' }],
        getMoneyDate: [{ required: true, message: '请选择收款日期', trigger: 'change' }],
        transferredScreenshotUrl: [{ required: false, message: '到款选“是”，必须上传到款截图', trigger: 'change' }]
      },
      uploadFileList: [],
      accountTags: [],
      accountOptions: [],
      accountMap: {
        data: [],
        conf: {
          placeholder: '请选择客户联系人',
          filterable: true
        },
        optionValKey: 'accountId',
        optionLabelKey: 'accountName'
      },
      specialData: {
        orgType: '',
        workType: '',
        businessGroup: '',
        businessUser: '',
        platName: '',
        accountName: ''
      },
      businessGroup: [],
      businessUser: [],
      platId: '',
      accountId: '',
      uploadAccountLoading: false,
      uploadUrl: '',
      uploadAccountUrl: '',
      quotientTypeList: [],
      workCooperationType: [],
      brandTags: [],
      specialNews: [],
      loading: false,
      btnLoading: false,
      formItemMap: {
        mngPlatInfoVOList: [],
        industryTypeTags: [],
        executorInfoBOList: [],
        executeGroupInfoBOList: [],
        customerNameAndIdBOList: [],
        selfCustomerNameAndIdBOList: []
      },
      industryTypeArr: [],
      showCheckInvoiceFlag: false
    }
  },
  computed: {
    EditFlag() {
      let flag = true
      if (this.$permission('invoice_status_select')) {
        flag = false
      } else if (+this.showForm.checkAccountsFlag === 0) {
        flag = false
      }
      return flag
    },
    EditCooperation() {
      let flag = false
      if (this.$permission('invoice_status_select')) {
        flag = false
      } else if (this.isMoneyCatch && this.quotientId !== '') {
        flag = true
      }
      return flag
    },
    dialogTitle() {
      return this.isOnlyShow
        ? '查看商单详情'
        : (!this.quotientId ? '新增' : '编辑')
    },
    quotientName() {
      return this.showForm.quotientType
        ? this.quotientTypeList.find(item => item.extValue == this.showForm.quotientType)?.configName
        : ''
    },
    companyName() {
      return this.showForm.companyType
        ? this.COMPANY_TYPE.find(
          item => item.val === this.showForm.companyType
        ).text
        : ''
    },
    getInvoiceState(types) {
      return function(types) {
        const invoiceState = RECEIPT_STATUS_TYPE.filter((item) => item.val === types)
        if (invoiceState && invoiceState.length > 0) return invoiceState[0].text
        return '未选择'
      }
    },
    // 行业类别是否必填
    fieldIdsRequired() {
      const brandIds = this.showForm.brandIds
      if (!brandIds) return false
      const brand = this.brandTags?.find(item => item.brandId === brandIds)
      return brand?.customerType === 2020
    },
    // 来源是否是商机
    isOpp() {
      return (!!(this.type === 'create' && this.oppId) || !!(this.type === 'edit' && this.oppId && this.quotientId))
    }
  },
  watch: {
    normalFormItemMap: {
      handler(nVal, oVal) {
        if (nVal) {
          for (const key in this.normalFormItemMap) {
            this.formItemMap[key] = copy(this.normalFormItemMap[key].data)
          }
          this.formItemMap.executorInfoBOList = (this.formItemMap.executorInfoBOList || []).filter(item => item.userStatus === 1)
        }
      },
      immediate: true,
      deep: true
    },
    'showForm.brandIds'() {
      if (!this.fieldIdsRequired) {
        this.clearValidate('fieldIds')
      }
    },
    'showForm.isMoney'() {
      if ([2, 4].indexOf(+this.showForm.quotientType) > -1) {
        this.addRules.transferredScreenshotUrl = [{ required: true, message: '到款选“是”，必须上传到款截图', trigger: 'change' }]
      } else {
        this.addRules.transferredScreenshotUrl = [{ required: false, message: '到款选“是”，必须上传到款截图', trigger: 'change' }]
      }

      // 到款为否
      if (!+this.showForm.isMoney) {
        this.showForm.checkAccountsFlag = 0
        this.addRules.getMoneyDate = [{ required: false, message: '请选择是否到款', trigger: 'change' }]
      } else {
        this.addRules.getMoneyDate = [{ required: true, message: '请选择是否到款', trigger: 'change' }]
      }

      this.showForm.transferredScreenshotUrl = []
       this.$refs.showForm && this.$refs.showForm.clearValidate()
    }
  },
  created() {
    this.getSelfCustomerList()
    this.getAccountAndPlatInfo()
    this.getTeamAndMember()
    this.getBConfigByCode()
    this.getOrgInfo()
    this.hanleOpenForm()
  },
  methods: {
    async getSelfCustomerList() {
      const { code, data } = await $getSelfCustomerList()
      if (+code === 1) {
        this.formItemMap.selfCustomerNameAndIdBOList = data || []
      }
    },
    clearValidate(fieldNames) {
      this.$refs.showForm?.clearValidate(fieldNames)
    },
    handleDelImg() {
      this.$refs.uploadImg && this.$refs.uploadImg.clearFiles()
      this.showForm.collectionPhotoUrl = ''
    },
    openUrl(url) {
      window.open(url)
    },
    // 获取乾派、海盗组织
    getOrgInfo(orgId = 0) {
      $getNextOrgInfo({ orgId }).then(res => {
        if (res.code === 1) {
          this.orgList = res.data
        }
      })
    },
    // 获取商单类型、合作方式
    getBConfigByCode() {
      const configCodes = ['business_manager_quotient_type', 'business_manager_special_work_cooperation_type']
      $getByConfigCode({ configCodes: configCodes.join(',') }).then(res => {
        if (res.code === 1) {
          this.quotientTypeList = res.data.business_manager_quotient_type || []
          this.workCooperationType = res.data.business_manager_special_work_cooperation_type || []
        } else {
          // this.$message.error()
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
      })
    },
    async hanleOpenForm() {
      if (this.quotientId) {
        this.getBusinessOrderInfo(this.quotientId)
      } else {
        this.showForm = copy(SHOW_DATA)
      }

      this.getIndustryList(this.formItemMap.industryTypeTags)

      // 只新建的才会获取商机详情
      if (this.type === 'create' && this.oppId) {
        const { code, data } = await $getOpportunityInfo({ opportunityId: this.oppId })
        if (+code === 1) {
          this.showForm.customId = +data.customerId
          this.accountTags = data.flowWorkInfoBOS.filter(item => data.finalCooperateAccounts.findIndex(it => it.id === item.id) > -1).map(item => {
            return {
              ...item,
              name: `${item.platName}-${item.accountName}`
            }
          })

          this.showForm.executeGroupId = data.businessUserOrgId
          if (data.businessUserOrgId !== '') {
            this.excuteGroupChange(data.businessUserOrgId)
          }

          this.showForm.brandIds = ((data.brandInfoBOList || [])[0] || {}).brandId || ''

          if (data.fieldId) {
            data.fieldIds = String(data.fieldId).split(',').map(item => Number(item))
          } else {
            data.fieldIds = []
          }

          if (data.fieldIds.length) {
            let parentId = ''
            const arr = this.formItemMap.industryTypeTags || []
            for (let i = 0; i < arr.length; i += 1) {
              const index = arr[i].childNodeTags.findIndex(item => +item.tagId === +data.fieldIds[0])
              if (index > -1) {
                parentId = arr[i].tagId
                break
              }
            }

            this.showForm.fieldIds = [parentId, data.fieldIds[0].toString()]
          }

          if (data.specialWorkInfoBOS) {
            this.specialNews = data.specialWorkInfoBOS.filter(item => data.finalCooperateAccounts.findIndex(it => it.id === item.id) > -1).map(item => {
              return {
                ...item,
                businessGroup: item.orgDId,
                businessGroupName: item.orgDName,
                businessUser: item.creatorId,
                businessUserName: item.creatorName,
                workType: item.coopType,
                text: `${item.coopType}-${item.orgDName}-${item.creatorName}-${item.platName}-${item.accountName}`
              }
            })
            this.showForm.specialNewsText = data.specialWorkInfoBOS.filter(item => data.finalCooperateAccounts.findIndex(it => it.id === item.id) > -1).map(item => {
              return {
                ...item,
                businessGroup: item.orgDId,
                businessGroupName: item.orgDName,
                businessUser: item.creatorId,
                businessUserName: item.creatorName,
                workType: item.coopType,
                text: `${item.coopType}-${item.orgDName}-${item.creatorName}-${item.platName}-${item.accountName}`
              }
            }).map(item => (item.text)).join(',')
          }
        }
      }
    },
    getBusinessOrderInfo(quotientId) {
      this.loading = true
      $getBusinessOrderInfo({ quotientId }).then((res) => {
        if (res.code === 1) {
          this.showCheckInvoiceFlag = +res.data.checkAccountsFlag === 1 && !this.$permission('invoice_status_select')

          this.processshowFormData(res.data)
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 处理回显数据
    processshowFormData(rowData) {
      if (rowData.isMoney === 1) {
        this.isMoneyCatch = true
      } else {
        this.isMoneyCatch = false
      }
      if (rowData.accountIds) {
        const accountIds = rowData.accountIds.split(',')
        const accountBelong = rowData.accountBelong.split(',')
        if (rowData.accountBelong) {
          this.accountTags = accountIds
            .map((id, index) => {
              let name = accountBelong[index]
              if (name) {
                name = name.split('-')
                name.shift()
                return {
                  name: name.join('-'),
                  accountId: accountIds[index]
                }
              } else {
                return null
              }
            }) || []
            .filter(item => item !== null)
        }
      }
      // if (rowData.customId) {
      //   this.getBrandInfo(rowData.customId)
      // }
      if (rowData.executeGroupId) {
        this.excuteGroupChange(rowData.executeGroupId)
      }
      rowData.brandIds && (rowData.brandIds = parseInt(rowData.brandIds))
      if (rowData.fieldIds) {
        rowData.fieldIds = rowData.fieldIds.split(',').map(item => Number(item))
      } else {
        rowData.fieldIds = []
      }
      if (rowData.briefs) {
        // 回显已上传的文件
        this.uploadFileList = rowData.briefs = JSON.parse(rowData.briefs)
      }
      if (rowData.publishTimeStart && rowData.publishTimeEnd) {
        rowData.punishDateArr = [
          rowData.publishTimeStart,
          rowData.publishTimeEnd
        ]
      }
      if (rowData.specialNews) {
        this.specialNews = rowData.specialNews
        rowData.specialNewsText = rowData.specialNews.map(item => (item.text)).join(',')
      }

      if (rowData.fieldIds.length) {
        let parentId = ''
        const arr = this.formItemMap.industryTypeTags || []
        this.getIndustryList(this.formItemMap.industryTypeTags)
        for (let i = 0; i < arr.length; i += 1) {
          const index = arr[i].childNodeTags.findIndex(item => +item.tagId === +rowData.fieldIds[0])
          if (index > -1) {
            parentId = arr[i].tagId
            break
          }
        }

        rowData.fieldIds = [parentId, rowData.fieldIds[0].toString()]
      }
      const urlArr = (rowData.transferredScreenshotUrl || '').split(',')
      this.showForm = rowData

      this.$nextTick(() => {
        // 不在nexttick中会重置
        this.showForm.transferredScreenshotUrl = urlArr.filter(item => item)
      })
    },
    // 获取品牌
    // getBrandInfo(customerId) {
    //   if (!customerId) return
    //   $getBrandInfoByCustomerId({ customerId }).then((res) => {
    //     if (res.code === 1) {
    //       this.brandTags = res.data
    //     } else {
    //       this.$message.error(res.message)
    //     }
    //   })
    // },
    getIndustryList(list) {
      if (list) {
        list.forEach(item => {
          if (!item.enableFlag) {
            this.$set(item, 'disabled', false)
          } else {
            this.$set(item, 'disabled', true)
          }
          if (item.childNodeTags) {
            this.getIndustryList(item.childNodeTags)
          }
        })
      }
    },
    handleChangeFieldIds(val) {
      const nodesInfo = this.$refs.cascader.getCheckedNodes()[0]
      if (!nodesInfo || !Object.keys(nodesInfo).length) {
        this.showForm.fieldIds = []
        return
      }
      if (nodesInfo.data.disabled || nodesInfo.children.length) {
        this.showForm.fieldIds = []
      } else {
        this.showForm.fieldIds = val
      }
    },
    // 海盗、乾派切换
    handleOrgChange(orgId) {
      this.businessGroup = []
      this._businessUser = []
      this.businessUser = []
      this.specialData.businessGroup = ''
      this.specialData.businessUser = ''
      if (orgId) {
        this.getTeamAndMember(orgId)
      }
    },
    // 获取平台及账号
    getAccountAndPlatInfo() {
      // if (this.isOpp) {
      //   this.loading = true
      // }
      $getAccountAndPlatInfo().then((res) => {
        if (res.code === 1) {
          this.formItemMap.mngPlatInfoVOList = res.data.mngPlatInfoVOList || []
          this.formItemMap.simpleAccountBOList = res.data.simpleAccountBOList || []
          // if (this.isOpp) {
          //   setTimeout(() => {
          //     this.loading = false
          //   }, 2500)
          // }
        }
      }).catch(err => {})
    },
    // 获取分组及创作者
    getTeamAndMember(orgId) {
      $getTeamAndMember({ orgId }).then((res) => {
        if (res.code === 1) {
          this.businessGroup = res.data.organizationInfoList
          this._businessUser = res.data.simpleUserInfoVOList
        }
      })
    },
    // 新增、编辑确定
    addConfirm() {
      const getNodesArr = this.$refs.cascader.getCheckedNodes()
      if (!(getNodesArr[0] && !getNodesArr[0].hasChildren)) {
        this.showForm.fieldIds = ''
        this.showForm.fieldName = ''
        this.$nextTick(() => {
          this.$refs.showForm.validate()
        })
        return
      }

      // if (this.showForm.isMoney === 1 && !this.showForm.getMoneyDate) {
      //   this.$message.error('请输入对应收款日期')
      //   return
      // }

      this.$refs['showForm'].validate((v) => {
        if (v) {
          this.btnLoading = true
          const data = copy(this.showForm)
          // if (data.isMoney === 1 && data.collectionPhotoUrl === '') {
          //   return this.$message.error('请上传收款截图')
          // }
          if (this.uploadFileList.length > 0) {
            data.briefs = JSON.stringify(this.uploadFileList.map(item => {
              return {
                url: item.url,
                name: item.name
              }
            }))
          } else {
            delete data.briefs
          }
          if (this.accountTags.length) {
            // 去重之后把账号id传给后端
            const accountIds = this.accountTags.map(item => item.accountId)
            data.accountIds = Array.from(accountIds).join(',')
          } else {
            data.accountIds = ''
          }

          // 特殊单处理
          if (this.specialNews.length > 0) {
            // data.specialNews = JSON.stringify(this.specialNews)
            data.specialNews = this.specialNews
          }

          if (this.isOpp) {
            data.opportunityId = this.oppId
          }

          if (data.punishDateArr && data.punishDateArr.length > 0) {
            data.publishTimeStart = data.punishDateArr[0]
            data.publishTimeEnd = data.punishDateArr[1]
            delete data.punishDateArr
          }
          data.fieldIds = data.fieldIds[data.fieldIds.length - 1]

          data.transferredScreenshotUrl = data.transferredScreenshotUrl.join(',')

          console.log(data)
          if (this.quotientId) {
            $updateQuotientInfo(data).then((res) => {
              if (res.code === 1) {
                this.$message.success('编辑成功')
                this.showFormClose()
                this.$emit('getList')
                this.$bus.$emit('upLog', { operation_module: '编辑确定', quotientId: data.quotientId })
              } else {
                this.$message.error(res.message)
              }
              this.btnLoading = false
            })
          } else {
            $addQuotientInfo(data).then((res) => {
              if (res.code === 1) {
                this.$message.success('添加成功')
                if (data.accountIds || (data.specialNews || []).length) {
                  this.$confirm('是否立即【批量录工单】？批量录工单可以提升效率，节省录单时间', '商单创建成功', {
                    confirmButtonText: '批量录单',
                    cancelButtonText: '暂不录单',
                    type: 'success'
                  }).then(() => {
                    const routeUrl = this.$router.resolve({
                      path: '/bussiness-manage/batch-entry',
                      query: {
                        id: res.data
                      }
                    })
                    window.open(routeUrl.href, '_self')
                  })
                }
                this.showFormClose()
                this.$emit('getList')
                this.$bus.$emit('upLog', { operation_module: '添加商单' })
              } else {
                this.$message.error(res.message)
              }
              this.btnLoading = false
            })
          }
        } else {
          // this.$nextTick(() => {
          //   document.querySelector('.is-error .el-input__inner').focus()
          // })
        }
      })
    },
    // 文件预览
    filePreview(file) {
      window.open(file.url)
    },
    // 删除上传文件
    fileRemove(file) {
      const list = this.uploadFileList
      // 文件预览
      if (!list.length) {
        return
      }
      for (let i = 0; i < list.length; i++) {
        if (list[i].url === file.url) {
          list.splice(i, 1)
          break
        }
      }
    },
    customChange(customerId) {
      this.showForm.brandIds = ''
      // this.getBrandInfo(customerId)
    },
    toAddClient() {
      this.$router.push({
        path: '/bussiness-manage/client-manage'
      })
    },
    beforeUploadAccount(file) {
      const re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        this.uploadAccountLoading = true
      } else {
        this.$message.error('只支持 Excel 文件')
      }
      return re
    },
    uploadAccountSuccess(res) {
      // 上传文件成功
      if (res.code === 1) {
        if (res.data.failAccountNum === 0) {
          this.$message({
            message: '上传全部成功',
            type: 'success'
          })
        } else {
          const cacheKey = res.data.cacheKey
          const tplUrl = `/api/business/order/downloadErrAccountData?type=2&cacheKey=${cacheKey}`
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `上传失败账号${res.data.failAccountNum}个 <a target="_blank" href="${tplUrl}" style="color: #1890ff">下载明细</a>`,
            duration: 0,
            type: 'warning'
          })
        }
        this.accountTags = unique(this.accountTags.concat(res.data.successAccountList), 'accountId')
      } else {
        this.$message.error(res.message)
      }
      this.uploadAccountLoading = false
    },
    uploadAccountError(err) {
      this.uploadAccountLoading = false
      this.$message.error(err)
    },
    addAccount() {
      if (this.isOpp) {
        this.$message.warning('请从对应的商机中增删对应的账号')
        return
      }

      if (!this.platId) {
        this.$message.error('请选择平台')
        return
      }
      if (!this.accountId) {
        this.$message.error('请选择账号')
        return
      }
      const currentAccount = this.accountOptions.find(
        item => item.accountId == this.accountId
      ) || {}
      const platName = this.formItemMap.mngPlatInfoVOList.find(
        item => item.platId == this.platId
      ) || {}
      const accountTags = {
        name: `${platName.platName}-${currentAccount.accountName}`,
        accountId: currentAccount.accountId
      }
      if (this.accountTags.some(item => item.name == accountTags.name && item.accountId == accountTags.accountId)) {
        this.$message.error('重复添加')
        return
      }
      this.accountTags.push(accountTags)
    },
    // 添加指定合作方
    addSpecialAccount() {
      if (this.isOpp) {
        this.$message.warning('请从对应的商机中增删对应的账号')
        return
      }

      if (!this.specialData.workType) {
        this.$message.error('请选择合作方式')
        return
      }
      if (!this.specialData.orgType) {
        this.$message.error('请选择部')
        return
      }
      if (!this.specialData.businessGroup) {
        this.$message.error('请选择军/工作室')
        return
      }
      // if (!this.specialData.businessUser) {
      //   this.$message.error('请选择创作者')
      //   return
      // }
      // if (!this.specialData.platName) {
      //   this.$message.error('请选择平台')
      //   return
      // }
      // if (!this.specialData.accountName) {
      //   this.$message.error('请输入账号')
      //   return
      // }
      const accountTags = copy(this.specialData)
      const workTypeText = accountTags.workType
      const businessGroupText = this.businessGroup.find(item => item.id === accountTags.businessGroup)
      const businessUserText = this.businessUser.find(item => item.id === accountTags.businessUser)
      const platNameText = accountTags.platName
      const accountNameText = accountTags.accountName
      const tagsNameArr = [workTypeText, businessGroupText.orgName]
      if (businessUserText) {
        tagsNameArr.push(businessUserText.name)
      }
      if (platNameText) {
        tagsNameArr.push(platNameText)
      }
      if (accountNameText) {
        tagsNameArr.push(accountNameText)
      }
      const tagsName = tagsNameArr.join('-')
      accountTags.text = tagsName
      // if (this.specialNews.some((item) => (item.text === tagsName))) {
      //   this.$message.error('重复添加')
      //   return
      // }
      this.specialNews.push(accountTags)
    },
    showFormClose() {
      // this.specialData = {
      //   workType: '',
      //   businessGroup: '',
      //   businessUser: '',
      //   platName: '',
      //   accountName: ''
      // }
      // this.showForm = copy(SHOW_DATA)
      // this.isMoneyCatch = false
      // this.uploadFileList = []
      // this.accountTags = []
      // this.specialNews = []
      // this.platId = ''
      // this.accountId = ''
      this.$emit('update:addVisible', false)
      // this.$nextTick(() => {
      //   this.$refs['showForm'].clearValidate()
      // })
    },
    handleSearchReset(target) {
      target.reset()
      this.searchData.workMoneyStart = ''
      this.searchData.workMoneyEnd = ''
      this.searchData.dateArr = ''
    },
    excuteGroupChange(executeGroupId) {
      this.showForm.executeId = ''
      this.formItemMap.executorInfoBOList = (this.optionsData.executorInfoBOList || []).filter((item) => (item.executeGroupId === executeGroupId && item.userStatus === 1))
    },
    uploadFileSuccess(res) {
       const file = {
          name: res.data.name,
          url: res.data.url
        }
        this.uploadFileList.push(file)
    },
    uploadImgSuccess(res) {
      if (res.code === 1) {
          this.showForm.collectionPhotoUrl = res.data
      } else {
        this.$message.error(res.message)
      }
    },
    // 设置账号
    setAccountOptions() {
      this.accountId = ''
      this.accountOptions = this.formItemMap.simpleAccountBOList.filter(item => (item.platId === this.platId))
      this.accountMap.data = this.accountOptions
    },
    // 设置创作者
    setBusinessUser() {
      this.specialData.businessUser = ''
      this.businessUser = (this._businessUser || []).filter(item => (item.dId === this.specialData.businessGroup || item.fId === this.specialData.businessGroup))
    },
    // 删除合作方
    handleSpecialTagClose(index) {
      if (this.isOpp) {
        this.$message.warning('请从对应的商机中增删对应的账号')
        return
      }

      this.specialNews.splice(index, 1)
    },
    // 删除账号标签
    handleTagClose(index) {
      if (this.isOpp) {
        this.$message.warning('请从对应的商机中增删对应的账号')
        return
      }

      this.$confirm('删除账号后，对应的工单及订单也将被清除且不可恢复，请谨慎操作', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          this.accountTags.splice(index, 1)
      }).catch(() => {
      })
    },

    handleQuotientType(val) {
      // 代课下单 达人私单  到款必填
      if ([2, 4].indexOf(+val) > -1) {
        this.addRules.transferredScreenshotUrl = [{ required: true, message: '到款选“是”，必须上传到款截图', trigger: 'change' }]
      } else {
        this.addRules.transferredScreenshotUrl = [{ required: false, message: '到款选“是”，必须上传到款截图', trigger: 'change' }]
      }

      this.showForm.transferredScreenshotUrl = []
      this.$refs.showForm.clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-input {
    width: 230px;
  }
  .account-input {
    width: 100%;
  }
  .account-tag {
    margin: 10px;
  }
  .max-height-156 {
    overflow-y: auto;
    max-height: 156px;
  }
  .flex-row {
    display: flex
  }
  .m-r-10 {
    margin-right: 10px;
  }
  .upload-view {
    height: 100px;
    width: 120px;
    ::v-deep  {
      .el-upload {
        width: 100%;
        height: 100%;
      }
      .el-upload-dragger  {
        width: 100%;
        height: 100%;
        padding: 10px;
        box-sizing: border-box;
      }
      .el-icon-upload {
        margin: 0;
        font-size: 24px;
      }
      .el-upload__text {
        font-size: 12px;
      }
    }
  }
  .pic {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .notice {
    background: #E6A23C;
    color: #fff;
    text-align: center;
    position: relative;
    top: -24px;
    width: fit-content;
    margin: 0 auto;
    padding: 0 16px;
  }
</style>
