/**
 * @module nativeUI
 */

import {
  os
} from './os.js'
import * as utils from '../common/utils'

// #region 常量
/**
 * 载入中
 */
const loadingTitle = ''

const WaitingOptions = {
  width: '100px',
  height: '100px',
  // 等待对话框显示区域的背景色
  background: 'rgba(0,0,0,0.65)',
  // 等待框显示区域的圆角
  round: 4,
  // 可取值"none"表示截获处理返回键，但不做任何响应；"close"表示截获处理返回键并关闭等待框；"transmit"表示不截获返回键，向后传递给Webview窗口继续处理（与未显示等待框的情况一致）。
  back: 'transmit',
  loading: {
    height: '30px'
  }
}
const toastOption = {
  // 提示消息在屏幕中的垂直位置：可选值为"top"、"center"、"bottom"，分别为垂直居顶、居中、居底，未设置时默认值为"bottom"
  position: 'bottom',
  // 提示消息框显示的时间：可选值为"long"、"short"，值为"long"时显示时间约为3.5s，值为"short"时显示时间约为2s，未设置时默认值为"short"。
  duration: 'short',
  // 提示消息框上显示的图标：png格式，并且必须是本地资源地址；图标与文字分两行显示，上面显示图标，下面显示文字；
  icon: '',
  // 提示 
  lineLength: 0
}
// #endregion

/**
 * 显示系统等待对话框
 * @param {String} title 标题，默认值''
 */
export function showWaiting(title = '') {
  if (!title) {
    title = loadingTitle
  }
  if (window.plus) {
    plus.nativeUI.showWaiting(title, WaitingOptions);
    return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的showWaiting方法!')
    return false
  }
}

/**
 * 关闭系统等待对话框
 */
export function closeWaiting() {
  if (window.plus) {
    plus.nativeUI.closeWaiting();
    return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的closeWaiting方法!')
    return false
  }
}

/**
 * 显示自动消失的提示消息
 * @param {String} msg 提示消息上显示的文字内容
 * @param {Object} opts  提示消息的参数，可设置提示消息显示的图标、持续时间、位置、自动换行等。
 */
export function toast(msg = '', opts = {}) {
  if (!msg || !utils.isString(msg)) {
    return
  }
  opts = utils.mix({}, toastOption, opts)
  msg = utils.strBreak(msg, opts.lineLength)
  if (opts.position !== 'bottom' && opts.position !== 'top' && opts.position !== 'center') {
    opts.position = 'bottom'
  }
  opts.verticalAlign = opts.position
  if (opts.duration !== 'long' && opts.duration !== 'short') {
    opts.duration = 'short'
  }
  if (!utils.isString(opts.icon)) {
    opts.icon = ''
  }
  if (window.plus) {
    plus.nativeUI.toast(msg, opts)
    return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的toast方法!')
    console.log('[toast]\n' + msg)
    return false
  }
}
