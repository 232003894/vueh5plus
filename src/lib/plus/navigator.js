/**
 * navigator用于管理浏览器运行环境信息
 * @module navigator
 */

/**
* 设置应用在前台运行时系统状态栏的背景颜色，默认使用系统状态栏默认背景色（有系统状态栏样式决定）。 注意：为了有更好的兼容性，避免设置接近白色或黑色的颜色值。
* @param {String} color 背景颜色值，颜色值格式为"#RRGGBB"，如"#FF0000"为红色，默认颜色由系统状态栏样式决定。
* @example 
* this.plus.setStatusBarBackground("#FF0000");
*/
export function setStatusBarBackground(color) {
  let sixNumReg = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})*$/gi;
  if (!sixNumReg.test(color)) {
    color = ''
  }
  if (color) {
    if (window.plus) {
      plus.navigator.setStatusBarBackground(color);
    } else {
      // document.title = color
    }
  }

}