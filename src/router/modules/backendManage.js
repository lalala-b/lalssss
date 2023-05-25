/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-18 16:35:09
 * @LastEditTime: 2020-12-18 10:46:17
 * @LastEditors: Linjie
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const backendManage = {
  path: '/backend-manage',
  component: Layout,
  name: 'backend_manage',
  text: '后台管理',
  meta: {
    title: '后台管理',
    icon: 'iconhoutaiguanli'
  },
  alwaysShow: true,
  children: [
    {
      name: 'tag_library',
      text: '标签库',
      meta: {
        title: '标签库'
      },
      path: 'tag-library',
      component: () => import('@/views/backend-manage/tag-library')
    },
    {
      name: 'contract_process_manage',
      text: '履约流程管理',
      meta: {
        title: '履约流程管理'
      },
      path: 'contract-process-manage',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'process_node_manage',
      text: '流程节点管理',
      meta: {
        title: '流程节点管理',
        hidden: true
      },
      path: 'process-node-manage',
      component: () => import('@/views/business-qp/index')
    },
    {
      name: 'backend_manage_contents',
      text: '内容管理',
      meta: {
        title: '内容管理'
      },
      path: 'contents',
      component: () => import('@/views/backend-manage/contents/content.vue')
    },
    {
      name: 'popover_manage',
      text: '首页弹窗管理',
      meta: {
        title: '首页弹窗管理'
      },
      path: 'popover-manage',
      component: () => import('@/views/backend-manage/popover-manage')
    },
    {
      name: 'putting_command_manage',
      text: '口令管理',
      meta: {
        title: '口令管理'
      },
      path: 'command-manage',
      component: () => import('@/views/backend-manage/command-manage')
    },
    {
      name: 'backend_manage_users',
      text: '用户管理',
      meta: {
        title: '用户管理'
      },
      path: 'users',
      component: () => import('@/views/backend-manage/users/index.vue')
    },
    {
      name: 'backend_military',
      text: '军籍管理',
      meta: {
        title: '军籍管理'
      },
      path: 'backend-military',
      component: () => import('@/views/backend-manage/military/military.vue')
    },
    {
      name: 'backend_military_detail',
      text: '军籍详情',
      meta: {
        title: '军籍详情',
        hidden: true
      },
      path: 'military-detail',
      component: () => import('@/views/backend-manage/military-detail/military-detail.vue')
    },
    {
      name: 'menu_manager',
      text: '菜单管理',
      meta: {
        title: '菜单管理'
      },
      path: 'menu-manager',
      component: () => import('@/views/backend-manage/menu-manage/menu-manage.vue')
    },
    {
      name: 'router_manage',
      text: '路由管理',
      meta: {
        title: '路由管理'
      },
      path: 'router-manage',
      component: () => import('@/views/backend-manage/router-manage/router-manage.vue')
    },
    {
      name: 'role_manager',
      text: '角色管理',
      meta: {
        title: '角色管理'
      },
      path: 'role-manager',
      component: () => import('@/views/backend-manage/role-manage/role-manage.vue')
    },
    {
      name: 'advertising-manage',
      text: '广告账户管理',
      meta: {
        title: '广告账户管理'
      },
      path: 'advertising-manage',
      component: () => import('@/views/backend-manage/advertising-manage/index.vue')
    },
    {
      name: 'role_menu_user',
      text: '权限表',
      meta: {
        title: '权限表'
      },
      path: 'role-menu-user',
      component: () => import('@/views/backend-manage/role-menu-user')
    },
    {
      path: '/link',
      name: 'link',
      text: 'Link组件',
      meta: {
        title: 'Link组件'
      },
      component: () => import('@/views/backend-manage/link/link.vue')
    },
    {
      path: '/information-manage',
      name: 'information_manage',
      text: '信息流链接管理',
      meta: {
        title: '信息流链接管理'
      },
      component: () => import('@/views/backend-manage/information-manage')
    }
  ]
}

export default backendManage
