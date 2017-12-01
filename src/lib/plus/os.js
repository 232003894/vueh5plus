/**
 * 浏览器用于 HTTP 请求的用户代理头的值
 * @module userAgent
 */

const ua = navigator.userAgent

let _os = {
  name: 'web',
  version: 0,
  wechat: false,
  android: false,
  isBadAndroid: false,
  ios: false,
  ipad: false,
  iphone: false,
  plus: false,
  stream: false
}

// wechat
let match = ua.match(/(MicroMessenger)\/([\d.]+)/i)
if (match) {
  _os.name += ' wechat'
  _os.wechat = match[2].replace(/_/g, '.')
}
// android
match = ua.match(/(Android);?[\s/]+([\d.]+)?/)
if (match) {
  _os.name += ' android'
  _os.android = true
  _os.version = match[2]
  _os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion))
}
// ipad
match = ua.match(/(iPad).*OS\s([\d_]+)/)
if (match) {
  _os.name += ' iPad'
  _os.ios = _os.ipad = true
  _os.version = match[2].replace(/_/g, '.')
}
// iphone
match = ua.match(/(iPhone\sOS)\s([\d_]+)/)
if (!_os.ipad && match) {
  _os.name += ' iPhone'
  _os.ios = _os.iphone = true
  _os.version = match[2].replace(/_/g, '.')
}
//  5+ Browser
match = ua.match(/Html5Plus/i)
if (match) {
  _os.name += ' h5+'
  _os.plus = true
  // document.body.classList.add( $.className( 'plus' ) )
}
// 最好有流应用自己的标识
match = ua.match(/StreamApp/i)
if (match) {
  _os.name += ' stream'
  _os.stream = true
  // document.body.classList.add( $.className( 'plus-stream' ) )
}


/**
 * os属性
 * @property {String} name 运行环境名称
 * @property {Number} version 版本
 * @property {Boolean} wechat 是否微信
 * @property {Boolean} android 是否android
 * @property {Boolean} isBadAndroid 是否android非Chrome环境
 * @property {Boolean} ios 是否ios系统
 * @property {Boolean} ipad 是否ipad
 * @property {Boolean} iphone 是否iphone
 * @property {Boolean} iphone 是否H5+
 * @property {Boolean} stream 是否stream
 */
export let os = _os;
