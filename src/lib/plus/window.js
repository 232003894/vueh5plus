/**
 * 管理应用窗口界面，实现窗口的逻辑控制管理操作
 * @module window
 */

import { os } from "./os.js"
import * as utils from "../common/utils"
import * as ui from "./nativeUI.js"
import qs from "qs"

// #region 辅助方法

/*
 * 构建 window id
 * @param {String} url url
 * @param {Object} ext 扩展参数
 */
function getId(url, ext) {
  let tmp = url.split("?")
  let opt = {}
  if (tmp.length > 1) {
    opt = utils.mix(true, opt, qs.parse(tmp[tmp.length - 1]), ext)
  } else {
    opt = utils.mix(true, opt, ext)
  }
  let _qs = qs.stringify(opt)
  if (_qs) {
    _qs = "?" + _qs
  }
  return tmp[0] + _qs
}
/*
 * 组装 window url
 * @param {String} url url
 * @param {Object} ext 扩展参数
 * @param {String} id 页面id
 */
function getUrl(url, ext, id) {
  let tmp = url.split("?")
  let opt = {}
  if (tmp.length > 1) {
    opt = utils.mix(true, opt, qs.parse(tmp[tmp.length - 1]), ext)
  } else {
    opt = utils.mix(true, opt, ext)
  }
  if (!id) {
    id = getId(url, ext)
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
  bounce: "",
  plusrequire: "ahead",
  softinputMode: "adjustPan"
}
// 默认窗口显示配置
const defaultShow = {
  duration: os.ios ? 300 : 200,
  aniShow: "slide-in-right"
}
// 默认窗口隐藏配置
const defaultHide = {
  duration: os.ios ? 450 : 300,
  aniHide: "slide-out-right"
}
// #endregion

// #region 公共方法

/**
 * 设置自定义错误页面
 * @param {String} url - 错误页面路径，必须是本地路径（Hbuilder的）
 * @example <caption>设置错误页</caption>
 * // 路径，必须是本地路径（Hbuilder项目的）
 * this.plus.errorPage('/error.html')
 */
export function errorPage(url) {
  defaultWin.errorPage = url
  if (window.plus) {
    getWin().setStyle({ errorPage: url })
  }
}

/**
 * 创建新窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.create('login.html')
 */
export function create(url = "", id = "", opts = { ext: {}, style: {} }) {
  let webview = null
  if (!url) {
    return webview
  }
  if (!opts) {
    opts = { ext: {}, style: {} }
  }
  if (!opts.ext) {
    opts.ext = {}
  }
  if (!opts.style) {
    opts.style = {}
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, opts.ext)
    }
    webview = plus.webview.getWebviewById(id)
    if (!webview) {
      // 不存在
      webview = plus.webview.create(
        url,
        id,
        utils.mix({}, defaultWin, opts.style),
        opts.ext
      )
    }
    return webview
  } else {
    return webview
  }
}

/**
 * 显示窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {Object} [opts] - 显示参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @example
 * // 根据id显示
 * this.plus.show('login')
 */
export function show(w, opts = { loading: true, ani: {} }) {
  // export function show(w, opts = {}, showedCB = function () { }) {
  w = getWin(w)
  if (!w) {
    console.error("[show方法] 类型{String|window|WebviewObject}参数w不能为空!")
    return
  }
  if (!opts) {
    opts = { loading: true, ani: {} }
  }
  if (!opts.ani) {
    opts.ani = {}
  }
  if (!utils.isBoolean(opts.loading)) {
    opts.loading = true
  }
  if (window.plus) {
    let isVisible = w.isVisible()
    let _Opt = utils.mix({}, defaultShow, opts.ani)
    // if (!utils.isFunction(showedCB)) {
    //   showedCB = function () { }
    // }
    let _ishome = isHome(w)

    if (!isVisible) {
      // 窗口不可见（从没调用过show或hide了）
      if (opts.loading) {
        ui.showWaiting()
        setTimeout(() => {
          // 设置系统状态栏背景颜色
          w.show(_Opt.aniShow, _Opt.duration, function() {
            // showedCB()
            ui.closeWaiting()
          })
        }, defaultShow.duration)
      } else {
        setTimeout(() => {
          // 设置系统状态栏背景颜色
          w.show(_Opt.aniShow, _Opt.duration, function() {
            // showedCB()
          })
        }, defaultShow.duration)
      }
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
          hide(w, {
            aniHide: "none"
          })
          if (opts.loading) {
            ui.showWaiting()
            setTimeout(() => {
              // 设置系统状态栏背景颜色
              w.show(_Opt.aniShow, _Opt.duration, function() {
                // showedCB()
                ui.closeWaiting()
              })
            }, defaultHide.duration)
          } else {
            setTimeout(() => {
              // 设置系统状态栏背景颜色
              w.show(_Opt.aniShow, _Opt.duration, function() {
                // showedCB()
              })
            }, defaultHide.duration)
          }
        } else {
          // 最顶层的不是home页并且w也不是是home页面
          w.showBehind(topView)
          if (opts.loading) {
            ui.showWaiting()
            setTimeout(() => {
              // showedCB()
              ui.closeWaiting()
            }, defaultHide.duration)
          } else {
            // setTimeout(() => {
            //   // showedCB()
            // }, defaultHide.duration)
          }
          hide(topView)
        }
      }
    }
  } else {
    console.log("[" + os.name + "]不支持show方法!")
    w.focus()
  }
}

/**
 * 隐藏窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {Object} [hideOpts] - 隐藏参数
 * @param {String} [hideOpts.aniHide='none'|'auto'] - 隐藏窗口的动画效果,非显示栈顶的窗口的默认值为'none'
 * @param {Number} [hideOpts.duration=300] - 隐藏窗口动画的持续时间
 * @example
 * // 根据id隐藏
 * this.plus.hide('login')
 */
export function hide(w, hideOpts = {}) {
  w = getWin(w)
  if (!w) {
    console.error("[hide方法] 类型{String|window|WebviewObject}参数w不能为空!")
    return
  }
  if (window.plus) {
    // 首页不隐藏
    if (isHome(w)) {
      return
    }
    let _Opt = { duration: defaultHide.duration }
    if (hideOpts.duration || hideOpts.aniHide) {
      _Opt = utils.mix({}, defaultHide, hideOpts)
    }
    let isTop = plus.webview.getTopWebview().id === w.id
    if (!isTop) {
      w.hide("none", _Opt.duration)
    } else {
      w.hide(_Opt.aniHide || "auto", _Opt.duration)
    }
  } else {
    console.log("[" + os.name + "]不支持hide方法!")
    return
  }
}

/**
 * 关闭窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {*} [closeOpts] - 关闭参数
 * @param {String} [closeOpts.aniHide='none'|'auto'] - 关闭窗口的动画效果,非显示栈顶的窗口的默认值为'none'
 * @param {Number} [closeOpts.duration=300] - 关闭窗口动画的持续时间
 * @example
 * // 根据id关闭
 * this.plus.close('login')
 */
export function close(w, closeOpts = {}) {
  w = getWin(w)
  if (!w) {
    console.error("[close方法] 类型{String|window|WebviewObject}参数w不能为空!")
    return
  }
  if (window.plus) {
    let _cs = w.children(),
      fn = () => {
        for (var c of _cs) {
          close(c)
        }
      }
    w.addEventListener("onclose", fn)
    let _Opt = { duration: defaultHide.duration }
    if (closeOpts.duration || closeOpts.aniHide) {
      _Opt = utils.mix({}, defaultHide, closeOpts)
    }

    let isTop = plus.webview.getTopWebview().id === w.id
    if (!isTop) {
      w.close("none", _Opt.duration)
    } else {
      w.close(_Opt.aniHide || "auto", _Opt.duration)
    }
  } else {
    w.close()
  }
}

/**
 * 创建并打开新窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.open('login.html', "login", {
 *   ext: {
 *     uid: 121
 *   }
 * });
 */
export function open(
  url = "",
  id = "",
  opts = { loading: true, ext: {}, ani: {}, style: {} }
) {
  if (!url) {
    return null
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, opts.ext)
    }
    let view = plus.webview.getWebviewById(id)
    if (!view) {
      // 不存在
      view = create(url, id, { ext: opts.ext, style: opts.style })
    } else {
      view.setStyle(opts.style)
    }
    show(view, { loading: opts.loading, ani: opts.ani })
    return view
  } else if (!os.plus) {
    // web，非web
    let _opt = getUrl(url, opts.ext, id)
    url = _opt.url
    id = _opt.id
    let views = [...mainWin.__all_wins]
    let view = views.find(function(item, index, arr) {
      return item.id === id
    })
    if (!view) {
      view = window.open(url, "_blank")
    } else {
      show(view)
    }
    return view
  }
}

/**
 * 用浏览器打开url
 * @param {String} url - 页面地址
 * @example
 * this.plus.openBrowser('http://www.baidu.com');
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
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * // 取得当前窗体
 * this.plus.getWin()
 * // 获取id为‘login’的窗体
 * this.plus.getWin('login')
 */
export function getWin(w) {
  let win = null
  if (window.plus) {
    if (utils.isObject(w) && w.draw) {
      win = w
    } else if (utils.isString(w)) {
      win = plus.webview.getWebviewById(w)
    }
    if (!win) {
      win = plus.webview.currentWebview()
    }
  } else {
    if (utils.isString(w)) {
      let views = [...mainWin.__all_wins]
      win = views.find(function(item, index, arr) {
        return item.id === w
      })
    } else if (utils.isWindow(w)) {
      win = w
    }
    if (!win) {
      win = window
    }
  }
  return win
}

/**
 * 获取home窗体
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.getHomeWin()
 */
export function getHomeWin() {
  if (window.plus) {
    return plus.webview.getLaunchWebview()
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
 * @returns {Boolean} 是不是主页
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

/**
 * 是否顶层窗口
 * @param {String|window|WebviewObject} w
 * @returns {Boolean} 是不是顶层窗口
 */
export function isTop(w) {
  w = getWin(w)
  if (!w) {
    return false
  }
  if (window.plus) {
    let topView = plus.webview.getTopWebview()
    let _wIsTop = topView.id === w.id
  } else {
    return !(w.document.hidden || w.document.webkitHidden)
  }
}

/**
 * 创建并打开侧滑窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 侧滑窗体对象
 * @example <caption>左侧滑菜单</caption>
 * this.plus.open('index.html', "menuLeft", {
 *   ani: { aniShow: "slide-in-left" },
 *   style: {
 *     right: "30%",
 *     width: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>右侧滑菜单</caption>
 * this.plus.open('index.html', "menuRight", {
 *   ani: { aniShow: "slide-in-right" },
 *   style: {
 *     left: "30%",
 *     width: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>底侧滑菜单</caption>
 * this.plus.open('index.html', "menuBottom", {
 *   ani: { aniShow: "slide-in-bottom" },
 *   style: {
 *     height: "30%",
 *     top: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>顶侧滑菜单</caption>
 * this.plus.open('index.html', "menuTop", {
 *   ani: { aniShow: "slide-in-top" },
 *   style: {
 *     height: "30%",
 *     bottom: "70%",
 *     popGesture: "none"
 *   }
 * });
 */
export function menu(
  url = "",
  id = "",
  opts = { loading: true, ext: {}, ani: {}, style: {} }
) {
  if (window.plus) {
    let w = getWin()
    let side = open(url, id, opts)
    side.addEventListener(
      "close",
      function() {
        w.setStyle({ mask: "none" })
        side = null
      },
      false
    )
    side.addEventListener(
      "hide",
      function() {
        w.setStyle({ mask: "none" })
      },
      false
    )
    w.setStyle({ mask: "rgba(0,0,0,0.5)" })
    return side
  } else {
    return null
  }
}

/**
 * 当前Webview窗口的下拉刷新效果
 * @param {Object} [style={}]  Webview窗口下拉刷新样式，参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewRefreshStyles HTML5+ API}
 * @param {Function} [callback=()=>{}] Webview窗口下拉刷新事件回调,接收的参数为：结束Webview窗口的下拉刷新function
 * @example <caption>圆圈样式下拉刷新</caption>
 * this.plus.pullRefresh({
 *     support: true,
 *     color: "#2BD009",
 *     style: "circle",
 *     offset: "0px",
 *     range: "80px",
 *     height: "50px"
 *   }, function(end) {
 *     setTimeout(() => {
 *       end();
 *     }, 1000);
 *   }
 * );
 * @example <caption>经典下拉刷新样式（下拉拖动时页面内容跟随）</caption>
 * this.plus.pullRefresh({
 *     support: true,
 *     style: "default",
 *     range: "30px",
 *     height: "30px",
 *     contentdown: {
 *       caption: "下拉可以刷新"
 *     },
 *     contentover: {
 *       caption: "释放立即刷新"
 *     },
 *     contentrefresh: {
 *       caption: "正在刷新..."
 *     }
 *   }, function(end) {
 *     setTimeout(() => {
 *       end();
 *     }, 1000);
 *   }
 * );
 * @example <caption>关闭窗口的下拉刷新功能</caption>
 * this.plus.pullRefresh({ support: false });
 * this.plus.pullRefresh();
 */
export function pullRefresh(style = {}, callback = () => {}) {
  let win = getWin()
  if (window.plus) {
    if (style && !!style.support && utils.isFunction(callback)) {
      win.setPullToRefresh(style, function() {
        let end = () => {
          win.endPullToRefresh()
        }
        callback(end)
      })
    } else {
      win.setPullToRefresh(style)
    }
  }
}
/**
 * 当前Webview窗口的手动触发下拉刷新效果
 * 前提是设置了下拉刷新效果
 * @example <caption>关闭窗口的下拉刷新功能</caption>
 * this.plus.beginPullRefresh();
 */
export function beginPullRefresh() {
  let win = getWin()
  if (window.plus) {
    win.beginPullToRefresh()
  }
}
// #endregion
