import Vue from 'vue'
import Element from 'element-ui'
import 'regenerator-runtime/runtime.js'
import { legoInit, legoPerfPC } from '@zz-common/lego'
import jsCookie from 'js-cookie'
import VueCompositionAPI from '@vue/composition-api'
import '@/styles/index.scss' // global css
import {
  SentryVueInit,
  SentryCapture
} from '@zz-common/sentry'
import App from './App'
import store from './store'
import router from './router'
import {
  initPrototype
} from './prototype'
import publicComponent from '@/components/public'
import loadmore from './directives/loadmore'
import log from './directives/log'
import scrollbar from './directives/scrollbar'
import VueQuillEditor from 'vue-quill-editor'
// require styles 引入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './icons' // icon

import * as filters from './filters' // global filters
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import pageIdConfig from './page.config'
Vue.prototype.$video = Video
initPrototype(Vue)
import { prefetchApps } from 'qiankun'
// 预加载qianshuju_qp资源
prefetchApps([{ name: 'qianshuju_qp', entry: '//qp.zhuanspirit.com' }])
Vue.use(publicComponent)

Vue.use(Element)

Vue.use(loadmore)
Vue.use(log)
Vue.use(scrollbar)
Vue.use(VueCompositionAPI)
Vue.use(VueQuillEditor)

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.prototype.$legoInit = (config) => {
  legoInit(Object.assign({}, pageIdConfig, config))
}
Vue.config.productionTip = false
try {
  var protocol = window.location.protocol
  var hostname = window.location.hostname
  if (hostname === 'data.qpmcn.com' && protocol === 'http:') {
    window.location.href = `${window.location.href.replace('http:', 'https:')}`
  }
} catch (err) {
  console.error(err)
}

legoPerfPC({ enableInitTestLegoSend: true, getPageInfoLazy: true })
legoInit({ t: 1007 })
// SentryVueInit('https://b0985197a7524caebaf3e0b26f5e6691@sentry.zhuanzhuan.com/1592')

SentryVueInit('https://b0985197a7524caebaf3e0b26f5e6691@sentry.zhuanzhuan.com/1592', {
  senddev: false // 测试环境
})

// 捕获页面级别错误
Vue.config.errorHandler = (err, vm, info) => {
  console.error(err)
  SentryCapture(err, 2)
}

async function main() {
  if (jsCookie.get('sso_uid')) {
    await store.dispatch('user/login').catch((err) => {
      Element.Message.error(err)
      setTimeout(() => {
        jsCookie.remove('sso_uid', {
          domain: '.zhuanspirit.com'
        })
        jsCookie.remove('uid')
        jsCookie.remove('sso_uid')
        jsCookie.remove('external_user')
        location.reload()
      }, 3000)
    })
  }
  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
  })
}
main()
