/**
 * 1.执行后退
 * 2.添加删除后退执行前的操作
 * @module back
 */

import { os } from "./os.js"
import * as utils from "../common/utils"
import * as win from "./window"
import * as ui from "./nativeUI"

import { send } from "./broadcast"

let hooks = new Set()
let __back__first = null
const endTime = 2000

/**
 * 增加后退执行前的操作
 * @param {Object} hook - 要增加的操作对象
 * @param {Number} [hook.index=100] - 操作的索引，索引值越小就先执行
 * @param {Function} hook.act - 操作的执行方法，需要执行的操作。<br>执行的返回值默认为true；<br>执行的返回值为false，则中断后续操作。
 * @returns {Object} 操作对象
 * @example <caption>添加一个可以继续后续操作的操作.</caption>
 * let handle = {
 *   index: 100,
 *   act() {
 *     console.log("back  handle");
 *     return true
 *   }
 * };
 * this.plus.addBack(handle)
 * let handle1 = {
 *   act() {
 *     console.log("back  handle1");
 *   }
 * };
 * this.plus.addBack(handle1)
 * @example <caption>添加一个中断后续操作的操作.</caption>
 * let handle = {
 *   index: 9999,
 *   act() {
 *     console.log("此路不通，窗体不能关闭！");
 *     return false
 *   }
 * };
 * this.plus.addBack(handle)
 */
export function addBack(hook) {
  if (hook) {
    if (!utils.isNumber(hook.index)) {
      hook.index = 100
    }
    if (utils.isFunction(hook.act)) {
      hooks.add(hook)
      return hook
    } else {
      return null
    }
  } else {
    return null
  }
}
/**
 * 删除后退执行前的操作
 * @param {Object} hook - 要删除的操作对象
 * @returns {Object} 操作对象
 * @example <caption>删除一个声明的操作</caption>
 * // 声明hook
 * let handle = {
 *   index: 9999,
 *   act() {
 *     console.log("此路不通，窗体不能关闭！");
 *     return false
 *   }
 * };
 * this.plus.addBack(handle)
 * setTimeout(() => {
 *  this.plus.removeBack(handle)
 * }, 1000);
 *
 * // 通过添加获取hook
 * let handle3 = this.plus.addBack({
 *   index: 9999,
 *   act() {
 *     console.log("此路不通，窗体不能关闭！");
 *     return false
 *   }
 * });
 * setTimeout(() => {
 *  this.plus.removeBack(handle3)
 * }, 1000);
 */
export function removeBack(hook) {
  if (hook) {
    hooks.delete(hook)
    return hook
  }
  return null
}

//遍历执行back的action
function acts() {
  let ret = true
  if (hooks.size > 0) {
    let _hooks = [...hooks]
    // console.log(utils.getType(_hooks))
    _hooks.sort(function(a, b) {
      return a.index - b.index
    })
    ret = _hooks.every(function(hook, index) {
      // hook.act() 只要为false就中断后续钩子
      return hook.act() !== false
    })
  }
  return ret
}

const _fisthref = window.location.href
/**
 * 执行后退（窗体后退，或安卓的后退按键）
 * @param {Boolean} forceBack - 是否强制退出
 * @example <caption>窗体后退</caption>
 * // 窗体后退
 * this.plus.back()
 */
export function back(forceBack = false) {
  if (!forceBack) {
    if (!acts()) {
      return
    }
  }
  var wobj = win.getWin()
  if (window.plus) {
    if (wobj.parent()) {
      // 子窗体
      send(
        "__backbutton",
        { wid: wobj.id, pid: this.parent.id },
        { ids: [this.parent.id] }
      )
    }
    wobj.canBack(e => {
      if (e.canBack) {
        window.history.back()
      } else {
        if (win.isHome(wobj)) {
          if (!__back__first) {
            __back__first = new Date().getTime()
            ui.toast("再按一次退出应用")
            setTimeout(() => {
              __back__first = null
            }, endTime)
          } else {
            if (new Date().getTime() - __back__first < endTime) {
              plus.runtime.quit()
            }
          }
        } else {
          win.close(wobj)
        }
      }
    })
  } else {
    if (window.history.length > 1) {
      // if (_fisthref !== window.location.href && window.history.length > 1) {
      window.history.back()
    } else {
      win.close(wobj)
      // if (win.isHome(wobj)) {
      //   if (wobj.confirm("是否退出应用？")) {
      //     win.close(wobj)
      //   }
      // } else {
      //   win.close(wobj)
      // }
    }
  }
}
