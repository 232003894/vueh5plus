import * as _plus from './plus'
import * as utils from './common/utils'
import qs from 'qs'
import { debug } from 'util';

var vue // lazy绑定
const listen_names = new WeakMap()
const plusExtend = {
  created: function () {
    if (!vue) {
      console.warn('[h5 plus] not installed!')
    }
  },
  mounted: function () {
    this.init()
    if (!_plus.os.plus) {
      window.id = 'index'
      let tmp = window.location.href.split('?')
      let extras = null
      if (tmp.length > 1) {
        extras = qs.parse(tmp[tmp.length - 1])
        utils.mix(true, window, extras)
      }

    }
  },
  methods: {
    init: function () {
      let plusready = this.$options.plusready
      let ready = this.$options.onload
      let listens = this.$options.listens
      var self = this
      // Dom加载完成
      if (ready) {
        // debugger
        onload.call(self, ready)
      }
      // 设备的加载完成
      if (plusready) {
        if (window.plus) {
          // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
          setTimeout(() => {
            plusready.call(self)
          }, 16.7)
        } else {
          // 修复：手机app中会调用2次的bug，window.plus改为os.plus
          if (_plus.os.plus) {
            document.addEventListener('plusready', function () {
              plusready.call(self)
            }, false)
          } else {
            onload.call(self, plusready)
          }
        }
      }
      // 事件监听
      if (listens) {
        let _ls = Object.keys(listens)
        for (let index = 0; index < _ls.length; index++) {
          const _l = _ls[index]
          const _lf = listens[_l]
          if (typeof (_lf) === "function") {
            if (!listen_names.get(_lf)) {
              listen_names.set(_lf, true)
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

function onload(callback) {
  let readyRE = /complete|loaded|interactive/
  if (readyRE.test(document.readyState)) {
    callback()
  } else {
    var self = this
    document.addEventListener('DOMContentLoaded', function () {
      callback.call(self)
    }, false)
  }
  return this
}
const h5plus = {
  install(Vue, options) {
    vue = Vue
    Vue.mixin(plusExtend)
    Vue.prototype.plus = _plus
  }
}

if (!_plus.os.plus) {
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
  window.onbeforeunload = function () {
    if (window.mainWin !== window) {
      window.mainWin.__all_wins.delete(window)
    }
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(h5plus)
}
export default h5plus
