<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
    @export="onExport"
    @change="onChange"
  />
</template>
<script>
import { defineComponent, getCurrentInstance, reactive } from '@vue/composition-api'
import { Search } from 'components'
import { $getDataByDictType } from '@/api'
import { $getAppealCondition, $getAppealAccount } from '@/api/putting-manager'

export default defineComponent({
  props: {
    tabName: {
      type: String,
      default: 'my'
    }
  },
  components: { Search },
  setup(props, { emit }) {
    const { $permission } = getCurrentInstance().proxy
      const normalFormItemMap = {}
      const formConf = reactive({
        normal: [],
        hasExport: true
      })
      const buildFormConf = () => {
        let normal = [
          {
            type: 'select',
            key: 'appealType',
            data: [],
            conf: {
              placeholder: '请选择异常类型'
            },
            optionLabelKey: 'dictLabel',
            optionValKey: 'dictValue',
            auth: 'my'
          },
          {
            type: 'select',
            key: 'appealStatus',
            data: [],
            conf: {
              placeholder: '请选择申诉状态'
            },
            optionLabelKey: 'dictLabel',
            optionValKey: 'dictValue'
          },
          {
            type: 'select',
            key: 'platId',
            conf: {
              placeholder: '请选择平台'
            },
            optionLabelKey: 'platName',
            optionValKey: 'platId'
          },
          {
            type: 'select',
            key: 'accountId',
            conf: {
              placeholder: '请选择账号'
            },
            optionLabelKey: 'accountName',
            optionValKey: 'accountId'
          },
          {
            type: 'select',
            key: 'videoTag',
            data: [],
            conf: {
              placeholder: '请选择品牌'
            },
            optionLabelKey: 'configName',
            optionValKey: 'configName'
          },
          {
            type: 'input',
            key: 'titleName',
            conf: {
              placeholder: '请输入标题'
            }
          },
          {
            type: 'select',
            key: 'advertiserUserId',
            data: [],
            conf: {
              placeholder: '请选择广告师'
            },
            optionLabelKey: 'realname',
            optionValKey: 'userId',
            auth: 'allComplaint'
          }
        ]
        normal = normal.filter(function(item, index) {
          if (item.permissionName && !$permission(item.permissionName)) {
            return false
          }
          if (item.auth && props.tabName !== item.auth) return false
          item.index = index
          normalFormItemMap[item.key] = item
          return true
        })
        formConf.normal = normal
      }
      buildFormConf()

      const getCondition = () => {
        $getDataByDictType({ dictTypes: ['exception_appeal_type', 'exception_appeal_status'] }).then(res => {
          if (res.code === 1) {
            normalFormItemMap.appealType && (normalFormItemMap.appealType.data = res.data.exception_appeal_type)
            normalFormItemMap.appealStatus && (normalFormItemMap.appealStatus.data = res.data.exception_appeal_status)
          }
        })
        $getAppealCondition({ pageType: props.tabName === 'my' ? 0 : 1 }).then(res => {
          if (res.code === 1) {
            console.log(res)
            normalFormItemMap.videoTag.data = res.data.brandNames
            normalFormItemMap.platId.data = res.data.platInfos
            normalFormItemMap.advertiserUserId && (normalFormItemMap.advertiserUserId.data = res.data.advertiserInfos || [])
          }
        })
        getAppealAccount()
      }

      const getAppealAccount = (platId) => {
        console.log(platId, 'platId')
        $getAppealAccount({ platId, pageType: props.tabName === 'my' ? 0 : 1 }).then(res => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data
          }
        })
      }
      getCondition()

      const onChange = (val, item, type, index, model) => {
        switch (item.key) {
          case 'platId':
            model.accountId = ''
            model.accountName = ''
            getAppealAccount(val)
        }
      }

      const onSubmit = (data) => {
        emit('onSubmit', data)
      }
      const onExport = (data) => {
        emit('onExport', data)
      }

      return {
        formConf,
        onChange,
        onSubmit,
        onExport
      }
  }
})
</script>

