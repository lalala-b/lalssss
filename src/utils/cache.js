import {
  extend
} from '@/utils'

// store conf
var DEF_CONF = {
  prefix: '',
  expires: 0, // 全局过期时间
  type: 0, // 0:localStorage 1: sessionStorage
  maxStack: 200 // 暂时限制上限
}

var PREFIX = '__Q_CACHE__'

var STACK_KEY = '__STACK__'

var STORE_TYPE = {
  0: localStorage,
  1: sessionStorage
}

var Store = function(_conf) {
  var conf = this.conf = extend({}, DEF_CONF, _conf || {})
  this.prefix = PREFIX + conf.prefix + '_'
  this._store = STORE_TYPE[conf.type] || STORE_TYPE[0]
  var stack = this._store.getItem(this.prefix + STACK_KEY)
  if (stack) {
    try {
      stack = JSON.parse(stack)
    } catch (err) {
      stack = []
    }
  } else {
    stack = []
  }
  this._stack = stack
  conf = stack = null
}

Store.prototype = {
  get: function(key) {
    if (!key) return
    key = this.prefix + key
    var item = this._store.getItem(key)
    var now = Date.now()
    if (item) {
      item = JSON.parse(item)
      if (item.expires && now > item.expires) {
        this.del(key.slice(this.prefix.length))
        return null
      } else {
        return item.value
      }
    }
  },
  set: function(key, value, conf) {
    conf = extend({
      expires: this.conf.expires
    }, conf || {})

    // 缓存生效条件
    var conditions = conf.conditions || null
    if (conditions) {
      // 检测结果
      var fail = false
      // 条件列表
      var keyArr = Object.keys(conditions)
      var q
      var qKey
      while (keyArr.length) {
        qKey = keyArr.pop()
        q = qKey + '=' + conditions[qKey]
        if (key.indexOf(q) === -1) {
          // 任何一个条件不满足则不允许写缓存
          fail = true
          break
        }
      }
      if (fail) {
        keyArr = null
        // 不满足缓存条件导致缓存写入的情况下返回 null
        return null
      }
    }

    key = this.prefix + key
    var expires = conf.expires
    if (expires) {
      expires = Date.now() + conf.expires
    }
    this._store.setItem(key, JSON.stringify({
      value: value,
      expires: expires
    }))
    var index = this._stack.indexOf(key)
    if (index === -1) {
      if (this.isStackOOM()) {
        this._store.removeItem(this._stack.shift())
      }
      this._stack.push(key)
      this.syncStack()
    }
  },
  del: function(key) {
    if (!key) return
    key = this.prefix + key
    var index = this._stack.indexOf(key)
    if (index !== -1) {
      this._store.removeItem(key)
      this._stack.splice(index, 1)
      this.syncStack()
    }
  },
  clean: function() {
    this._stack.forEach(function(key) {
      this._store.removeItem(key)
    }, this)
    this._stack = []
    this.syncStack()
  },
  length: function() {
    return this._stack.length
  }
}

Object.defineProperties(Store.prototype, {
  isStackOOM: {
    value: function() {
      return this._stack.length >= this.conf.maxStack
    }
  },
  syncStack: {
    value: function() {
      this._store.setItem(this.prefix + STACK_KEY, JSON.stringify(this._stack))
    }
  }
})

export default Store
