import * as _plus from './plus'
import qs from 'qs'

// lazy绑定
var vue
// listen的集合
const _listens = new WeakMap()

/**
 * h5+插件扩展
 */
const plusExtend = {
  created: function () {
    if (!vue) {
      console.warn('[h5 plus] not installed!')
    }
  },
  mounted: function () {
    this.init()
  },
  methods: {
    /**
     * 初始化
     */
    init: function () {
      var self = this
      /**
       * 扩展的组件选项
       */
      let plusready = this.$options.load && this.$options.load.plus
      let ready = this.$options.load && this.$options.load.dom
      let listener = this.$options.listener
      let back = this.$options.back

      /**
       * Dom加载完成
       */
      if (ready && _plus.isFunction(ready)) {
        onload(ready, self)
      }
      /**
       * 设备的加载完成
       */
      if (plusready && _plus.isFunction(plusready)) {
        onplusload(plusready, self)
      }
      /**
       * 事件监听
       */
      if (listener) {
        let _ls = Object.keys(listener)
        for (let index = 0; index < _ls.length; index++) {
          const _l = _ls[index]
          const _lf = listener[_l]
          if (_plus.isFunction(_lf)) {
            if (!_listens.get(_lf)) {
              _listens.set(_lf, true)
              if (_plus.os.plus) {
                // 设备
                document.addEventListener(_l, function (e) {
                  _lf.call(self, e)
                })
              } else {
                // 非设备:基本上是给调试用的
                window.addEventListener('message', function (e) {
                  if (e.data && e.data.name === _l) {
                    _lf.call(self, { "detail": e.data.data || {} })
                  }
                }, false)
              }
            }
          }
        }
      }
    }
  }
}

/**
 * Dom加载完成
 * @param {Function} callback 
 */
function onload(callback, vm = null) {
  let readyRE = /complete|loaded|interactive/
  if (readyRE.test(document.readyState)) {
    if (vm) {
      callback.call(vm)
    } else {
      callback()
    }
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (vm) {
        callback.call(vm)
      } else {
        callback()
      }
    }, false)
  }
  return this
}

/**
 * 设备的加载完成
 * @param {Function} callback 
 */
function onplusload(callback, vm = null) {
  if (window.plus) {
    // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
    setTimeout(() => {
      if (vm) {
        callback.call(vm)
      } else {
        callback()
      }

    }, 16.7)
  } else {
    // 修复：手机app中会调用2次的bug，window.plus改为os.plus
    if (_plus.os.plus) {
      document.addEventListener('plusready', function () {
        if (vm) {
          callback.call(vm)
        } else {
          callback()
        }
      }, false)
    } else {
      if (vm) {
        onload(callback, vm)
      } else {
        onload(callback)
      }
    }
  }
}



/**
 * 非设备环境模拟H5+
 * 1.模拟window的id和参数
 * 2.构建全部窗体列表为模拟通知使用
 */
(function () {
  onplusload(function () {
    window.plus && window.plus.key.addEventListener('backbutton', _plus.back, false)
    if (_plus.os.plus) {
      // 设备
      document.addEventListener('__backbutton', function (e) {
        _plus.back()
      })
    } else {
      // 非设备:基本上是给调试用的
      window.addEventListener('message', function (e) {
        if (e.data && e.data.name === '__backbutton') {
          _plus.back()
        }
      }, false)
    }

  })
  if (!_plus.os.plus) {
    window.id = 'index'
    let tmp = window.location.href.split('?')
    let extras = null
    if (tmp.length > 1) {
      extras = qs.parse(window.location.href.replace(tmp[0] + "?", ''))
      _plus.mix(true, window, extras)
    }
    if (!window.mainWin) {
      let mainWin = window
      while (mainWin.opener) {
        mainWin = mainWin.opener
        mainWin.mainWin && (mainWin = mainWin.mainWin)
      }
      window.mainWin = mainWin
      if (!window.mainWin.__all_wins) {
        window.mainWin.__all_wins = new Set()
        window.mainWin.__all_wins.add(mainWin)
      }
    }
    window.mainWin.__all_wins.add(window)
    let isHome = _plus.isHome()
    if (isHome) {
      console.warn('[web调试模式(非设备)] 当前是首页，手动刷新本页会影响已有窗体的通知失效。')
    }
    window.onbeforeunload = function () {
      if (!isHome) {
        window.mainWin.__all_wins.delete(window)
      }
    }
  }
})()

/**
 * 安装插件
 */
const h5plus = {
  install(Vue, options) {
    vue = Vue
    Vue.mixin(plusExtend)
    Vue.prototype.plus = _plus
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(h5plus)
}

export default h5plus
