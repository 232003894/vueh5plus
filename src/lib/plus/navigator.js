/**
 * 设置系统状态栏背景颜色
 * @param {String} color 背景颜色值，颜色值格式为"#RRGGBB"，如"#FF0000"为红色，默认颜色由系统状态栏样式决定。
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