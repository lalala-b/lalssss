<template>
  <div>
    <div class="header-btn">
      <el-button class="back-btn" type="text" @click="$router.go(-1)">
        <i class="el-icon-back" />返回
      </el-button>
      <div class="btn-item">
        <el-button
          v-if="disable"
          size="mini"
          type="primary"
          @click="disable = false"
        >编辑</el-button>
        <template v-else>
          <el-button
            v-loading="saveLoading"
            size="mini"
            type="primary"
            @click="bindleSave"
          >确定</el-button>
          <el-button
            size="mini"
            @click="bindleCancel"
          >取消</el-button>
        </template>
      </div>
    </div>
    <el-form
      :inline="true"
      label-width="140px"
      :gutter="20"
    >
      <div class="flex-content">
        <div class="military-left">
          <div>
            <el-form-item
              label="姓名："
            >
              <span>{{ editData.realname }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="工号："
            >
              <span>{{ editData.jobId }}</span>
            </el-form-item>
          </div>
          <div>
            <el-form-item
              label="企业微信邮箱："
            >
              <!-- <el-input
                v-model="editData.email"
                placeholder="企业微信邮箱"
                :disabled="disable"
              /> -->
              <span>{{ editData.email }}</span>
            </el-form-item>
          </div>
        </div>
        <div class="military-right">
          <el-form-item
            label="性别："
          >
            <el-select
              v-model="editData.sex"
              placeholder="请选择性别"
              :disabled="disable"
            >
              <el-option
                v-for="item in sex"
                :key="item.text"
                :value="item.text"
                :label="item.text"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="出生日期："
          >
            <el-date-picker
              v-model="editData.birthDate"
              type="date"
              placeholder="出生日期"
              :disabled="disable"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="毕业时间："
          >
            <el-date-picker
              v-model="editData.graduationDate"
              type="date"
              placeholder="毕业时间"
              :disabled="disable"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="最高学历："
          >
            <el-input
              v-model="editData.eduBest"
              placeholder="最高学历"
              :disabled="disable"
            />
          </el-form-item>
          <el-form-item
            label="毕业院校："
          >
            <el-input
              v-model="editData.eduSchool"
              placeholder="毕业院校"
              :disabled="disable"
            />
          </el-form-item>
          <el-form-item
            label="专业："
          >
            <el-input
              v-model="editData.skill"
              placeholder="专业"
              :disabled="disable"
            />
          </el-form-item>
          <el-form-item
            label="首次参加工作日期："
          >
            <el-date-picker
              v-model="editData.firstWorkDate"
              type="date"
              placeholder="工作日期"
              :disabled="disable"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="职位："
          >
            <el-input
              v-model="editData.position"
              placeholder="职位"
              :disabled="disable"
            />
          </el-form-item>
          <el-form-item
            label="入职时间："
          >
            <el-date-picker
              v-model="editData.entryDate"
              type="date"
              placeholder="入职时间"
              :disabled="disable"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="人员状态："
          >
            <el-select
              v-model="editData.isWork"
              placeholder="人员状态"
              :disabled="disable"
            >
              <el-option
                v-for="item in workStatus"
                :key="item.text"
                :label="item.text"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            label="离职时间："
          >
            <el-date-picker
              v-model="editData.leaveDate"
              type="date"
              placeholder="离职时间"
              :disabled="disable"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item
            label="组织："
          >
            <span>{{ editData.orgPath }}</span>
          </el-form-item>
        </div>
      </div>
      <div class="flex-content">
        <div class="military-left flex-row-center">
          海盗军团工作历程
        </div>
        <div class="military-right">
          <el-input
            v-model="editData.workNews"
            :disabled="disable"
            type="textarea"
            :autosize="{ minRows: 2}"
          />
        </div>
      </div>
      <div class="flex-content">
        <div class="military-left flex-row-center">
          奖惩信息
        </div>
        <div class="military-right">
          <el-input
            v-model="editData.rewardsNews"
            :disabled="disable"
            type="textarea"
            :autosize="{ minRows: 2}"
          />
        </div>
      </div>
      <div class="flex-content">
        <div class="military-left flex-row-center">
          过往成绩
        </div>
        <div class="military-right">
          <el-input
            v-if="editData.autoRewardsNews"
            v-model="editData.autoRewardsNews"
            class="m-b-20"
            :disabled="true"
            type="textarea"
            :autosize="{ minRows: 2}"
          />
          <el-input
            v-model="editData.achieveNews"
            :disabled="disable"
            type="textarea"
            :autosize="{ minRows: 2}"
          />
        </div>
      </div>
      <div class="flex-content flex-space-between">
        <div>
          当前绑定账号数量：{{ summaryItems.bindAccounts || 0 }}
        </div>
        <div>
          参与制作视频数量：{{ summaryItems.makeVideos || 0 }}
        </div>
        <div>
          累计军功：{{ summaryItems.allScore || 0 }}
        </div>
      </div>
    </el-form>
    <div class="chart-view">
      <div class="option-view">
        <el-row>
          <el-col :span="12">
            <el-radio-group v-model="picType" size="small">
              <el-radio-button label="soilderRes">军功趋势</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="12" class="flex-end">
            <el-radio-group v-model="activeCharsType" size="small">
              <el-radio-button
                v-for="catesName in currentCates"
                :key="catesName"
                :label="catesName"
              />
            </el-radio-group>
          </el-col>
        </el-row>
      </div>
      <VChart
        v-if="chartsData.line"
        ref="chart"
        :data="chartsData.line"
      />
      <el-link
        type="primary"
        :underline="false"
        @click="hanleDialogShow"
      >查看明细数据</el-link>
    </div>
    <el-dialog
      :title="activeCharsType"
      :visible.sync="dialogStatus"
      @close="dialogStatus = false"
    >
      <el-table
        v-scrollbar
        :data="diaLogData"
      >
        <template v-if="activeCharsType === '军功趋势明细数据-周'">
          <el-table-column label="周" prop="term" />
          <el-table-column label="系统计算军功" prop="value" />
        </template>
        <template v-if="activeCharsType === '军功趋势明细数据-月'">
          <el-table-column label="月份" prop="term" />
          <el-table-column label="日期时间段" prop="mouthTerm" />
          <el-table-column label="系统计算军功" prop="value" />
        </template>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { $getSoilderNews, $updateBasis } from '@/api/backend-manage'
import VChart from '@/components/VChart'
import { copy } from '@/components/common'
export default {
  components: {
    VChart
  },
  data() {
    return {
      disable: true,
      saveLoading: false,
      editData: {
        id: '',
        userId: '', // 用户id
        jobId: '', // 工号
        sex: '', // 性别
        position: '', // 职位
        birthDate: '', // 生日
        entryDate: '', // 入职日期
        leaveDate: '', // 离职日期
        graduationDate: '', // 毕业日期
        firstWorkDate: '', // 首次参加工作时间
        isWork: '', // 是否在职，0表示在职，1表示离职
        eduBest: '', // 最高学历
        eduSchool: '', // 毕业学校
        skill: '', // 专业
        addTime: '', // 修改时间
        workNews: '', // 海盗军团工作历程
        rewardsNews: '', // 奖惩信息
        autoRewardsNews: '', // 系统奖惩信息
        achieveNews: '', // 过往成绩
        realname: '', // 姓名
        dName: '', // 军
        fName: '', // 团
        bindAccounts: '', // 绑定账号数量
        makeVideos: '', // 参与制作视频数目
        allScore: '' // 总军功数
      },
      diaLogData: [],
      sex: [
        {
          text: '男'
        }, {
          text: '女'
        }
      ],
      workStatus: [
        {
          text: '在职',
          value: 0
        }, {
          text: '离职',
          value: 1
        }
      ],
      summaryItems: {
        bindAccounts: 0,
        makeVideos: 0,
        allScore: 0
      },
      catchData: {},
      picType: 'soilderRes',
      activeCharsType: '',
      targetOption: {
        soilderRes: {
          cates: [],
          values: [],
          terms: []
        }
      },
      chartsData: {
        main: null,
        line: null
      },
      dialogStatus: false
    }
  },
  computed: {
    currentCates() {
      return this.targetOption[this.picType].cates
    },
    lineData() {
      const targetData = this.targetOption[this.picType]
      const index = targetData.cates.findIndex(
        item => item === this.activeCharsType
      )
      return {
        terms: targetData.terms[index] || [],
        cates: [this.activeCharsType],
        values: [targetData.values[index]]
      }
    }
  },
  watch: {
    picType(newVal) {
      // 默认选中第一个
      this.activeCharsType = this.targetOption[newVal]['cates'][0]
    },
    activeCharsType(newVal) {
      this.chartsData.line = this.lineData
    }
  },
  created() {
    const userId = this.$route.query.userId
    this.getUserMilitaryInfo(userId)
  },
  methods: {
    // 获取军籍详情
    getUserMilitaryInfo(userId = '') {
      $getSoilderNews({ userId }).then((res) => {
        if (res.code === 1) {
          this.editData = res.data.mainNews
          this.summaryItems.bindAccounts = res.data.bindAccounts
          this.summaryItems.makeVideos = res.data.makeVideos
          this.summaryItems.allScore = res.data.allScore
          this.catchData = copy(this.editData)
          this.formatChartsOptions(res.data)
          // this.chartsData.line = this.lineData
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 格式化图表数据
    formatChartsOptions(chartsData) {
      let activeKey = ''
      for (const key in this.targetOption) {
        activeKey || (activeKey = key)
        const data = chartsData[key]
        data.cates = data.cates.map((item) => (item.typeName))
        this.targetOption[key] = data
      }

      this.activeCharsType = this.targetOption[activeKey]['cates'][0]
    },
    bindleSave() {
      if (this.saveLoading) return
      this.saveLoading = true
      for (const key in this.editData) {
        if (this.editData[key] === null || this.editData[key] === '') delete this.editData[key]
      }
      $updateBasis(this.editData).then((res) => {
        if (res.code === 1) {
          this.$message.success('保存成功')
          this.disable = true
          this.catchData = copy(this.editData)
        } else {
          this.$message.error(res.message)
        }
        this.saveLoading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.saveLoading = false
      })
    },
    bindleCancel() {
      this.editData = copy(this.catchData)
      this.disable = true
    },
    hanleDialogShow() {
      const data = this.targetOption[this.picType]
      const rowIndex = data.cates.indexOf(this.activeCharsType)
      const diaLogData = []
      data.values[rowIndex].forEach((item, index) => {
        diaLogData.push({
          term: data.terms[rowIndex][index],
          value: item,
          mouthTerm: data.mouthMainTerms ? data.mouthMainTerms[rowIndex][index] : ''
        })
      })
      this.diaLogData = diaLogData
      this.dialogStatus = true
    }
  }
}
</script>
<style lang="scss" scoped>
  // .table-view {
    .flex-content {
      padding: 20px;
      display: flex;
      background: #ffffff;
      margin-bottom: 20px;
      .military-left {
        width: 300px;
        margin-right: 10px;
        padding-left: 10px;
      }
      .military-right {
        flex: 1;
      }
    }
    .el-input,
    .el-select {
      width: 140px;
    }
  // }
  .header-btn {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    padding: 22px 22px 0;
  }
  .flex-space-between {
    justify-content: space-between;
  }
  .flex-end {
    display: flex;
    justify-content: flex-end;
  }
  .chart-view {
    padding: 20px;
    margin-bottom: 20px;
    background: #ffffff;
  }
  .m-b-20 {
    margin-bottom: 20px;
  }
</style>
