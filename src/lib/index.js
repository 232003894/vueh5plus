import * as _plus from './plus'

var vue // lazy绑定
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
    init: function () {
      var plusready = this.$options.plusready
      var ready = this.$options.onload
      // Dom加载完成
      if (ready) {
        onload(ready)
      }
      // 设备的加载完成
      if (plusready) {
        if (window.plus) {
          // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
          setTimeout(() => {
            plusready()
          }, 16.7)
        } else {
          // 修复：手机app中会调用2次的bug，window.plus改为os.plus
          if (_plus.os.plus) {
            document.addEventListener('plusready', function () {
              plusready()
            }, false)
          } else {
            onload(plusready)
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
    document.addEventListener('DOMContentLoaded', callback, false)
  }
  return this
}
const test = {
  install(Vue, options) {
    vue = Vue
    Vue.mixin(plusExtend)
    Vue.prototype.plus = _plus
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(test)
}
export default test
