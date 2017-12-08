
// #region NodeList扩展：forEach
/* global NodeList:true */
if (!NodeList.prototype.forEach) {
  // 安卓4.2中 NodeList forEach不支持
  NodeList.prototype.forEach = Array.prototype.forEach
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