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
  } else {
    console.log('[' + os.name + ']不支持nativeUI的showWaiting方法!')
  }
}

/**
 * 关闭系统等待对话框
 */
export function closeWaiting() {
  if (window.plus) {
    plus.nativeUI.closeWaiting();
  } else {
    console.log('[' + os.name + ']不支持nativeUI的closeWaiting方法!')
  }
}

/**
 * 显示自动消失的提示消息
 * @param {String} message 
 * @param {Object} options 
 */
export function toast(message = '', options = {}) {
  if (!message) {
    message = '提示'
  }
  options = utils.mix({}, options)
  if (window.plus) {
    plus.nativeUI.toast(message, options)
  } else {
    console.log('[' + os.name + ']不支持nativeUI的toast方法!')
  }
}
