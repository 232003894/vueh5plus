
// #region Array扩展：isArray forEach removeAt
// fixed Array.isArray
if (!Array.isArray) {
  Array.isArray = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]'
  }
}
/* global NodeList:true */
if (!NodeList.prototype.forEach) {
  // 安卓4.2中 NodeList forEach不支持
  NodeList.prototype.forEach = Array.prototype.forEach
}
/* eslint-disable no-extend-native */
Array.prototype.removeAt = function (index) {
  // 移除数组中指定位置的元素，返回布尔表示成功与否
  return !!this.splice(index, 1).length
}
// #endregion
// #region Event-CustomEvent
// fixed CustomEvent
if (typeof window.CustomEvent === 'undefined') {
  /* eslint-disable no-inner-declarations */
  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    }
    var evt = document.createEvent('Events')
    var bubbles = true
    for (var name in params) {
      (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name])
    }
    evt.initEvent(event, bubbles, true)
    return evt
  }
  CustomEvent.prototype = window.Event.prototype
  window.CustomEvent = CustomEvent
}
// #endregion
// #region String扩展：trim
// fixed String trim
if (String.prototype.trim === undefined) { // fix for iOS 3.2
  /* eslint-disable no-extend-native */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '')
  }
}
// #endregion

// #region Object扩展：setPrototypeOf
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  /* eslint-disable no-proto */
  obj['__proto__'] = proto
  return obj
}
// #endregion

// if (Object.prototype.addEvent === undefined) {
// /**
//  * 添加事件监听器
//  * @param {*} event 窗口事件类型
//  * @param {*} listener 监听事件发生时执行的回调函数
//  * @param {*} capture 捕获事件流顺序
//  */
// Object.prototype.addEvent = function (event, listener, capture) {
//   // if (this.addEventListener) {
//   //   this.addEventListener(event, listener, capture)
//   // }
//   return this
// }
// }
// if (Object.prototype.removeEvent === undefined) {
  // /**
  //  * 移除事件监听器
  //  * @param {*} event 要移除的事件类型
  //  * @param {*} listener 要移除监听函数对象
  //  */
  // Object.prototype.removeEvent = function (event, listener) {
  //   if (this.removeEventListener) {
  //     this.removeEventListener(event, listener)
  //   }
  //   return this
  // }
// }
