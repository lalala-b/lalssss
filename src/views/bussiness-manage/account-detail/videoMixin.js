import Case from 'components'
import LaunchDialog from '@/components/LaunchDialog'
import { copy } from '@/components/common'

/**
 * 广告类型映射
 * @type {Object}
 */
const ADV_MAP = {
  '1': '是',
  '0': '否'
}

export default {
  data() {
    return {
      'caseDialogStatus': false,
      'dialogData': null,
      ADV_MAP,
      'dialogStatus': false,
      'maskLoading': false,
      'hasAddToCase': true,
      'launchDialogStatus': false
    }
  },
  'methods': {
    /**
         * 绑定或编辑案例
         * @param  {Object}  row  要绑定的数据
         */
    doSet(row) {
      this.dialogData = row
      this.caseDialogStatus = true
    },
    onCaseClose() {
      this.dialogData = null
    },
    /**
         * 修改广告类型
         * @param  {Object}  row  要修改的数据
         */
    detailChangeAdv(row) {
      this.$request({
        'url': '/changeMarketCaseAdv',
        'data': {
          'flow_id': row.flow_id,
          'adv_id': row.adv_id
        },
        'method': 'post'
      })
        .then(
          re => {
            if (re) {
              this.$tip('修改成功', 'success')
            }
          }
          , err => {}
        )
        .catch(err => {
          console.error(err)
        })
    },
    // 生成权限判断用的字段
    processPermission() {
      // 是否有案例操作
      // this.hasCase = checkFilterRule(
      //     [
      //         {"key": "mrid", "val": 1}
      //         ,{"key": "action_id", "val": 19, "compute": "~"}
      //     ]
      //     ,this.user
      // );

      // // 是否能标记广告
      // this.hasAdv = checkFilterRule(
      //     [
      //         {"key": "mrid", "val": 1}
      //         ,{"key": "action_id", "val": 4, "compute": "~"}
      //     ]
      //     ,this.user
      // );

      // // 是否能添加到案例库
      // this.hasAddToCase = checkFilterRule(
      //     [
      //         {"key": "mrid", "val": 1}
      //         ,{"key": "action_id", "val": 22, "compute": "~"}
      //     ]
      //     ,this.user
      // );

      // // 是否能添加为投放视频
      // this.hasAddToLaunch = checkFilterRule(
      //     [
      //         {"key": "mrid", "val": 1}
      //         ,[
      //             {"key": "action_id", "val": 24, "compute": "~"},
      //             {"key": "mrid", "val": 3}
      //         ]
      //     ]
      //     ,this.user
      // );
    },
    setSop(item) {
      this.dialogData = {
        'flow_id': item.flow_id,
        'topics': '',
        'brand': '',
        'url': item.url,
        'title_name': item.title_name
      }
      this.dialogStatus = true
    },
    setLaunch(item) {
      this.dialogData = copy(item)
      this.launchDialogStatus = true
    },
    onCancel() {
      this.dialogStatus = false
      this.maskLoading = false
      this.dialogData = {}
    },
    onConfirm() {
      var data = copy(this.dialogData)
      delete data.title_name
      data.topics = JSON.stringify([data.topics])

      this.maskLoading = true
      this.$request({
        'url': '/modifyMarketAdvCase',
        data,
        'method': 'post'
      }).then(
        re => {
          if (re) {
            data = null
            this.$tip(re.msg || '操作成功', 'success')
            this.onCancel()
          }
        }
        , err => {
          this.maskLoading = false
        }
      )
    },
    onEditSuccess(data) {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i]
        if (item.flow_id === data.flow_id) {
          item.is_delivery = 1
          break
        }
      }
    }
  },
  'components': {
    'vCase': Case,
    'vLaunchDialog': LaunchDialog
  }
}
