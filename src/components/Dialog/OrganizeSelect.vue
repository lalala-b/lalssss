<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-20 15:38:01
 * @LastEditTime: 2020-12-29 11:38:12
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="选择组织"
    :visible="value"
    width="30%"
    :append-to-body="true"
    @close="$emit('input', false)"
  >
    <div>
      <el-tree
        :props="{
          children: 'childOrgName',
          label: 'orgName'
        }"
        :data="data"
        :highlight-current="true"
        :default-checked-keys="[orgId]"
        :default-expanded-keys="[orgId]"
        node-key="id"
        @node-click="handleNodeClick"
      />

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getOrganization, $getRegistOrg } from '@/api'

export default {
  name: 'OrganizeSelect',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isRegist: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      data: [],
      organization: null // 已选择的组织
    }
  },
  created() {
    this.getOrganization()
  },
  methods: {
  /**
     * 选择节点
     */
    handleNodeClick(data) {
      // if (data.parentId === 0) {
      //   this.organization = null
      //   return
      // }
      this.organization = data
    },
    /**
     * 保存组织结构
     */
    save() {
      if (this.organization) {
        this.$emit('save', this.organization)
      } else {
        this.$message.error('请选择正确的组织')
      }
    },
    /**
     * 转换接口返回组织数据转成插件使用的数据格式
     */
    // formatResultToData(list) {
    //   function recursion(data) {
    //     for (let i = 0; i < data.length; i++) {
    //       const t = data[i]
    //       t.label = t.orgName
    //       t.children = t.childOrgName
    //       delete t.childOrgName
    //       if (t.children) {
    //         recursion(t.children)
    //       }
    //     }
    //   }
    //   recursion(list)
    // },
    /**
     * 获取组织架构
     */
    getOrganization() {
      let $ajax = $getOrganization
      if (this.isRegist) {
        $ajax = $getRegistOrg
      }

        $ajax().then(re => {
          if (re.code === 1) {
            // this.formatResultToData(re.data)
            // console.log(re.data, '--re.data')
            this.data = re.data
          }
        })
    }
  }
}
</script>
