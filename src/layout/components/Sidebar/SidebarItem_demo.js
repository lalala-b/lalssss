import Vue from 'vue'
import mixins from '../mixins'

const createSideBarMenuItem = (createElement, routeList) => {
  return routeList.map((routeItem) => {
    if (routeItem.children && routeItem.children.length) {
      return createElement(
        'el-submenu',
        {
          props: {
            index: routeItem.path
          }
        },
        [
          createElement(
            'template',
            {
              slot: 'title'
            },
            [
              createElement('i', {
                class: 'el-icon-menu'
              }),
              createElement('span', {
                domProps: {
                  innerHTML: routeItem.title
                }
              })
            ]
          ),
          createSideBarMenuItem(createElement, routeItem.children)
        ]
      )
    } else {
      return createElement(
        'el-menu-item',
        {
          props: {
            index: routeItem.path
          }
        },
        [
          createElement('i', {
            class: 'el-icon-menu'
          }),
          createElement('span', {
            slot: 'title',
            domProps: {
              innerHTML: routeItem.title
            }
          })
        ]
      )
    }
  })
}

const SideBarMenu = Vue.component('SideBarMenu', {
  props: {
    routeList: {
      type: Array,
      default: () => [
        { path: '/home', title: '路由1' },
        {
          path: '2',
          title: '路由2',
          children: [
            { path: '/about', title: '路由2-1' },
            {
              path: '2-2',
              title: '路由2-2',
              children: [{ path: '2-2-1', title: '路由2-2-1' }]
            }
          ]
        }
      ]
    },
    closedSideBar: {
      type: Boolean,
      default: true
    }
  },
  render(createElement) {
    return createElement(
      'el-menu',
      {
        style: {
          border: 'none'
        },
        mixins: [mixins],
        props: {
          router: true,
          collapse: this.closedSideBar
        }
      },
      createSideBarMenuItem(createElement, this.routeList)
    )
  }
})

export default SideBarMenu
