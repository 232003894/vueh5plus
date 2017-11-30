
import {
  os
} from './os.js'
import * as utils from '../common/utils'
import * as win from './window'
import * as ui from './nativeUI'

import { send } from './broadcast'

let hooks = new Set()
let __back__first = null
const endTime = 2000

/**
 * 增加back执行流程
 * @param {Object} hook 
 */
export function addBack(hook) {
  if (hook.index && utils.isFunction(hook.act)) {
    hooks.add(hook)
  }
}
/**
 * 删除back执行流程
 * @param {Object} hook 
 */
export function removeBack(hook) {
  hooks.delete(hook)
}

/**
 * 执行back的action
 * @returns {Boolean} 是否可以后退
 */
function acts() {
  let ret = true
  if (hooks.size > 0) {
    let _hooks = [...hooks]
    console.log(utils.getType(_hooks))
    _hooks.sort(function (a, b) {
      return a.index - b.index
    })
    ret = _hooks.every(function (hook, index) {
      // hook.act() 只要为false就中断后续钩子
      return hook.act() !== false
    })
  }
  return ret
}

const _fisthref = window.location.href
/**
 * 后退按钮执行
 */
export function back() {
  if (!acts()) {
    return
  }
  var wobj = win.getWin()
  if (window.plus) {
    if (wobj.parent()) {
      // 子窗体
      send('__backbutton', { wid: wobj.id, pid: this.parent.id }, { ids: [this.parent.id] })
    }
    wobj.canBack(e => {
      if (e.canBack) {
        window.history.back()
      } else {
        if (win.isHome(wobj)) {
          if (!__back__first) {
            __back__first = new Date().getTime()
            ui.toast('再按一次退出应用')
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
    if (_fisthref !== window.location.href && window.history.length > 1) {
      window.history.back()
    } else {
      if (win.isHome(wobj)) {
        if (wobj.confirm('是否退出应用？')) {
          win.close(wobj)
        }
      } else {
        win.close(wobj)
      }
    }
  }
}
