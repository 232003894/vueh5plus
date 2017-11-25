import {
  os
} from './os.js'
import * as utils from '../common/utils'
import * as ui from './nativeUI.js'
import qs from 'qs'

// #region 辅助方法

/**
 * 构建 window id
 * @param {String} url url
 * @param {Object} extras 扩展参数
 */
function getId(url, extras) {
  let tmp = url.split('?')
  let opt = {}
  if (tmp.length > 1) {
    opt = utils.mix(true, opt, qs.parse(tmp[tmp.length - 1]), extras)
  } else {
    opt = utils.mix(true, opt, extras)
  }
  let _qs = qs.stringify(opt)
  if (_qs) {
    _qs = "?" + _qs
  }
  return tmp[0] + _qs
}
/**
 * 组装 window url
 * @param {String} url url
 * @param {Object} extras 扩展参数
 * @param {String} id 页面id 
 */
function getUrl(url, extras, id) {
  let tmp = url.split('?')
  let opt = {}
  if (tmp.length > 1) {
    opt = utils.mix(true, opt, qs.parse(tmp[tmp.length - 1]), extras)
  } else {
    opt = utils.mix(true, opt, extras)
  }
  if (!id) {
    id = getId(url, extras)
  }
  opt = utils.mix(true, opt, { id: id })
  let _qs = qs.stringify(opt)
  if (_qs) {
    _qs = "?" + _qs
  }
  return { url: tmp[0] + _qs, id: id }
}


// #endregion

// #region 常量

// 默认打开窗口样式配置
const defaultWin = {
  scalable: false,
  bounce: ''
}
// 默认窗口显示配置
const defaultShow = {
  duration: os.ios ? 400 : 300,
  aniShow: 'slide-in-right'
}
// 默认窗口隐藏配置
const defaultHide = {
  duration: os.ios ? 600 : 450,
  aniHide: 'slide-out-right'
}

// #endregion

// #region 公共方法

/**
 * 创建新窗口
 * @param {String} url url
 * @param {String} id 窗口id 
 * @param {Object} extras 扩展参数
 * @param {Object} styles 样式参数
 */
export function creat(url = '', id = '', extras = {}, styles = {}) {
  let webview = null
  if (!url) {
    return webview
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, extras)
    }
    webview = plus.webview.create(url, id, utils.mix({}, defaultWin, styles), extras)
    return webview
  } else {
    return webview
  }
}

/**
 * 显示窗体
 * @param {String|window|WebviewObject} w 
 * @param {*} showOpt 
 */
export function show(w, showOpt = {}) {
  // export function show(w, showOpt = {}, showedCB = function () { }) {
  w = getWin(w)
  if (!w) {
    console.error('[show方法] 类型{String|window|WebviewObject}参数w不能为空!')
    return
  }
  if (window.plus) {
    let isVisible = w.isVisible()
    let _Opt = utils.mix({}, defaultShow, showOpt)
    // if (!utils.isFunction(showedCB)) {
    //   showedCB = function () { }
    // }
    let _ishome = isHome(w)

    if (!isVisible) {
      // 窗口不可见（从没调用过show或hide了）
      ui.showWaiting()
      setTimeout(() => {
        w.show(_Opt.aniShow, _Opt.duration, function () {
          // showedCB()
          ui.closeWaiting()
        })
      }, defaultShow.duration)
    } else {
      // 窗口可见（调用过show方法，即使被其它窗口挡住了也认为已显示）
      let topView = plus.webview.getTopWebview()
      let _wIsTop = topView.id === w.id
      // 最顶层的是否home页
      let _topIsHome = isHome(topView)
      if (!_wIsTop) {
        // 窗口可见但不在最顶层
        if (_topIsHome) {
          // 最顶层的是home页
          ui.showWaiting()
          hide(w, {
            aniHide: 'none'
          })
          setTimeout(() => {
            w.show(_Opt.aniShow, _Opt.duration, function () {
              // showedCB()
              ui.closeWaiting()
            })
          }, defaultHide.duration)
          // } else if (_ishome) {
          //   // 最顶层的不是home页，但w是home页面
          //   w.showBehind(topView)
          //   hide(topView)
          //   setTimeout(() => {
          //     showedCB()
          //   }, defaultHide.duration)
        } else {
          // 最顶层的不是home页并且w也不是是home页面
          ui.showWaiting()
          w.showBehind(topView)
          hide(topView)
          setTimeout(() => {
            // showedCB()
            ui.closeWaiting()
          }, defaultHide.duration)
        }
      }
    }
  } else {
    console.log('[' + os.name + ']不支持show方法!')
    w.focus()
  }
}

/**
 * 隐藏窗体
 * @param {String|window|WebviewObject} w 
 * @param {*} hideOpts 
 */
export function hide(w, hideOpts = {}) {
  w = getWin(w)
  if (!w) {
    console.error('[hide方法] 类型{String|window|WebviewObject}参数w不能为空!')
    return
  }
  if (window.plus) {
    // 首页不隐藏
    if (isHome(w)) {
      return
    }
    let _Opt = utils.mix({}, defaultHide, hideOpts)
    let isTop = plus.webview.getTopWebview().id === w.id
    if (!isTop) {
      w.hide("none", _Opt.duration)
    } else {
      w.hide(_Opt.aniHide, _Opt.duration)
    }
  } else {
    console.log('[' + os.name + ']不支持hide方法!')
    return
  }
}

/**
 * 关闭窗体
 * @param {String|window|WebviewObject} w 
 * @param {*} closeOpts 
 */
export function close(w, closeOpts = {}) {
  w = getWin(w)
  if (!w) {
    console.error('[close方法] 类型{String|window|WebviewObject}参数w不能为空!')
    return
  }
  if (window.plus) {
    // home窗口
    if (isHome(w)) {
      // todo:首页关闭
    }
    let _Opt = utils.mix({}, defaultHide, closeOpts)
    let isTop = plus.webview.getTopWebview().id === w.id
    if (!isTop) {
      w.close("none", _Opt.duration)
    } else {
      w.close(_Opt.aniHide, _Opt.duration)
    }
  } else {
    w.close()
  }
}

/**
 * 创建并打开新窗口
 * @param {String} url url
 * @param {String} id 窗口id 
 * @param {Object} extras 扩展参数
 * @param {Object} styles 样式参数
 */
export function open(url = '', id = '', extras = {}, styles = {}) {
  if (!url) {
    return null
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, extras)
    }
    let view = plus.webview.getWebviewById(id)
    if (!view) {
      // 不存在
      view = creat(url, id, extras, styles)
    }
    show(view)
  } else if (!os.plus) {
    // web，非web
    let _opt = getUrl(url, extras, id)
    url = _opt.url
    id = _opt.id
    let views = [...mainWin.__all_wins]
    let view = views.find(function (item, index, arr) {
      return item.id === id;
    })
    if (!view) {
      view = window.open(url, '_blank')
    } else {
      show(view)
    }
    return view
  }
}

/**
 * 用浏览器打开url
 * @param {String} url url
 */
export function openBrowser(url) {
  if (window.plus) {
    window.plus.runtime.openURL(encodeURI(url))
  } else {
    open(url)
  }
}

/**
 * 获取窗体
 * @param {String|window|WebviewObject} w 
 */
export function getWin(w) {
  if (window.plus) {
    if (!w) {
      w = plus.webview.currentWebview()
    } else if (utils.isString(w)) {
      w = plus.webview.getWebviewById(w)
    }
  } else {
    if (!w) {
      w = window
    } else {
      let views = [...mainWin.__all_wins]
      w = views.find(function (item, index, arr) {
        return item.id === id;
      })
      if (!w) {
        w = null
      }
    }
  }
  return w
}

/**
 * 获取home窗体
 */
export function getHomeWin() {
  if (window.plus) {
    return plus.webview.getLaunchWebview();
  } else {
    return window.mainWin
  }
}

/**
 * 到首页
 */
export function goHome() {
  show(getHomeWin())
}

/**
 * 是否主页
 * @param {String|window|WebviewObject} w 
 */
export function isHome(w) {
  w = getWin(w)
  if (!w) {
    return false
  }
  if (window.plus) {
    return w.id === window.plus.runtime.appid
  } else {
    return w.mainWin === window
  }
}

// #endregion