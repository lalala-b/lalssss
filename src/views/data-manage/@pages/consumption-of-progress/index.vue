<template>
  <el-tabs v-model="activeName" class="el-tabs-wrap" >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      <iframe v-if="item.name === activeName" :src="item.url" frameborder="0" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { $getDataByDictType,$getUserOrgInfo } from '@/api'

export default defineComponent({
  setup() {
    const { $permission } = getCurrentInstance().proxy
    let list = [
      {
        name: 'fund_A2',
        label: '基金A2',
        url: '',
        flag:false
      },
      {
        name: 'fund_A5',
        label: '基金A5',
        url: '',
        flag:false
      },
    ]
    const states = reactive({
    activeName:'',
    tabs:[]
    })
    const getDataByDictType = () => {
      $getDataByDictType({
        dictTypes: ['A2_A5_consume_schedule'],
      }).then((res) => {
        if (res.code === 1 && res.data) {
          let data = res.data.A2_A5_consume_schedule
          data.forEach((item, index) => {
            list[index].url = item.dictValue
          })
          getUserOrgInfo()
        }
      })
    }
    const getUserOrgInfo = ()=>{
      $getUserOrgInfo().then(res=>{
        if(res.code===1&&res.data){
          list[0].flag = res.data.armyA2Flag
          list[1].flag = res.data.armyA5Flag
          if(!res.data.managerFlag){
            states.tabs = list.filter(item=>!!item.flag)
          }else{
            states.tabs = list
          }
          states.activeName = states.tabs.length?states.tabs[0].name:''
        }
      })
    }
    
    getDataByDictType()
    return {
     ...toRefs(states)
    }
  },
})
</script>
<style lang="scss" scoped>
.el-tabs-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  ::v-deep {
    .el-tabs__content {
      flex: 1;
      .el-tab-pane,
      iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
