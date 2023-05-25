/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-14 16:20:51
 * @LastEditTime: 2020-10-29 16:19:23
 * @LastEditors: Linjie
 */
import uploadDialog from './upload-dialog/index'
import VSearch from '@/components/Search'
import tableMixin from '@/mixins/table'
import { copy } from '@/components/common'

import { $getAccountCondition } from '@/api/military-manage'

const HD_STATUS_MAP = {
  '1': '待审核',
  '2': '通过',
  '3': '未通过',
  '4': '无需审核'
}

const HD_STATUS = Object.keys(HD_STATUS_MAP).map((key) => ({
  val: Number(key),
  text: HD_STATUS_MAP[key]
}))

// 显示用的状态数据
const HD_STATUS_TXT_MAP = copy(HD_STATUS_MAP)
HD_STATUS_TXT_MAP['4'] = '--'

export default {
  components: {
    VSearch,
    uploadDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      formConf: {},
      HD_STATUS_TXT_MAP,
      HD_STATUS,
      uploadData: {},
      showUpload: false
    }
  },
  created() {
    this.buildFormConf()
    this.getAccountCondition()
    this.getList()
  },
  methods: {
    // 获取筛选条件
    getAccountCondition() {
      $getAccountCondition({
        type: 1,
        platId: this.searchData.platId,
        methodId: this.methodId
      }).then((res) => {
        if (res.code === 1) {
          this.catchAccountName = res.data.videoInputAccountConditionVOList
          this.normalFormItemMap.platId.data = res.data.platInfo
          this.normalFormItemMap.accountName.data = res.data.videoInputAccountConditionVOList
          this.normalFormItemMap.publicUserId.data = res.data.employeeNameVO
          this.normalFormItemMap.junType.data = res.data.videoTypeList
        }
      })
    },
    onSubmit(data) {
      data = copy(data)
      const searchData = Object.assign(this.searchData, data)
      if (searchData.timerange) {
        searchData.startTime = searchData.timerange[0]
        searchData.endTime = searchData.timerange[1]
        delete searchData.timerange
      } else {
        searchData.startTime = ''
        searchData.endTime = ''
      }
      const job = searchData.job
      const jobMap = {
        editId: 'edit',
        cutId: 'cut',
        publicUserId: ''
      }
      for (const key in jobMap) {
        if (job === jobMap[key]) {
          searchData[key] = searchData.publicUserId
        } else {
          searchData[key] = ''
        }
      }
      this.searchData = searchData
      this.searchData.pageNum = 1
      this.getList()
    }
  }
}

