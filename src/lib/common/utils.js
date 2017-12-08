
/**
 * 类型和验证
 * @module utils.type
 */
// #region type

let class2type = {}

let types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']

types.forEach((name, i) => {
  class2type['[object ' + name + ']'] = name.toLowerCase()
})

/**
 * 获取类型
 * @param {*} value
 * @returns {String} 类型名称
 */
export function getType(value) {
  /**
   * ECMA-262 规范定义了Object.prototype.toString的行为：
   当调用 toString 方法，采用如下步骤：
   1. 如果 this 的值是 undefined, 返回 '[object Undefined]'.
   2. 如果 this 的值是 null, 返回 '[object Null]'.
   3. 令 O 为以 this 作为参数调用 ToObject 的结果 .
   4. 令 class 为 O 的 [[Class]] 内部属性的值 .
   5. 返回三个字符串 '[object ', class, and ']' 连起来的字符串 .

   利用这个方法，再配合call，我们可以取得任何对象的内部属性[[Class]]，然后把类型检测转化为字符串比较，以达到我们的目的。
   */
  return value == null ? String(value) : class2type[{}.toString.call(value)] || 'object'
}

/**
 * 判定是否为字符串
 * @param {*} value
 * @returns {Boolean} 是否为字符串
 */
export function isString(value) {
  return getType(value) === 'string'
}

/**
 * 判定是否为数值
 * @param {*} value
 * @returns {Boolean} 是否为数值
 */
export function isNumber(value) {
  return getType(value) === 'number'
}

/**
 * 判定是否为布尔
 * @param {*} value
 * @returns {Boolean} 是否为布尔
 */
export function isBoolean(value) {
  return getType(value) === 'Boolean'
}

/**
 * 判定是否为正则
 * @param {*} value
 * @returns {Boolean} 是否为正则
 */
export function isRegExp(value) {
  return getType(value) === 'regexp'
}

/**
 * 判定是否为一个函数
 * @param {*} value
 * @returns {Boolean} 是否为一个函数
 */
export function isFunction(value) {
  return getType(value) === 'function'
}

/**
 * 判定是否为日期
 * @param {*} value
 * @returns {Boolean} 是否为日期
 */
export function isDate(value) {
  return getType(value) === 'date'
}

/**
 * 判定是否为数组
 * @param {*} value
 * @returns {Boolean} 是否为数组
 */
export function isArray(value) {
  return getType(value) === 'array'
}

/**
 * 判定是否为一个window对象
 * @param {*} value
 * @returns {Boolean} 是否为一个window对象
 */
export function isWindow(value) {
  return value != null && value === value.window
}

/**
 * 判定是否为一个对象
 * @param {*} value
 * @returns {Boolean} 是否为一个对象
 */
export function isObject(value) {
  return getType(value) === 'object'
}

/**
 * 判定是否为一个纯净的JS对象, 不能为window, 任何类(包括自定义类)的实例,元素节点,文本节点
 * @param {*} value
 * @returns {Boolean} 是否为一个纯净的JS对象
 */
export function isPlainObject(value) {
  return isObject(value) && !isWindow(value) && Object.getPrototypeOf(value) === Object.prototype
}

/**
 * 验证URL
 * @param {String} str - 待验证的字符串 
 * @returns {Boolean} 是否为URL格式
 */
export function isURL(str) {
  // 验证url  
  // var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
  var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
    + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" // ftp的user@  
    + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
    + "|" // 允许IP和DOMAIN（域名）  
    + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
    + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
    + "[a-z]{2,6})" // first level domain- .com or .museum  
    + "(:[0-9]{1,4})?" // 端口- :80  
    + "((/?)|" // a slash isn't required if there is no file name  
    + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
  var re = new RegExp(strRegex);
  return re.test(str);
}
//  #endregion

/**
 * 扩展方法
 * 1.文本换行处理，去html标签
 * 2.颜色和样式
 *  1.获取dom元素的style
 *  2.随机颜色
 *  3.颜色值的反色
 * 3.对象合并、拷贝
 * 4.toFixed
 * @module utils.Extend
 */
// #region txt
/**
 * 文本自动换行
 * @param {String} txt - 文本
 * @param {Number} [lineLength=10] - 换行长度，0：表示不处理
 * @param {String} [lineBreak="\r\n"] - 换行符
 * @returns {String} 换行处理过的字符串
 */
export function strBreak(txt = "", lineLength = 10, lineBreak = "\r\n") {
  if (!txt) {
    return ''
  }
  lineLength = toFixed(lineLength)
  if (lineLength <= 0) {
    return txt
  }
  // http://www.makaidong.com/%E5%8D%9A%E5%AE%A2%E5%9B%AD%E7%9F%A5%E8%AF%86%E5%BA%93/18649.shtml
  if (txt.replace(/[^\x00-\xff]/g, "xx").length <= lineLength) {
    return txt;
  }
  var str = "";
  var l = 0;
  var schar;
  for (var i = 0; (schar = txt.charAt(i)); i++) {
    str += schar;
    l += schar.match(/[^\x00-\xff]/) != null ? 2 : 1;
    if (l >= lineLength) {
      str += lineBreak;
      l = 0;
    }
  }
  return str;
}

/**
 * 去html标签
 * @param {String} html - html字符串
 * @returns {String} 去html标签的字符串
 */
export function delHtmlTag(html) {
  var doc = ''
  if (getType(html) === 'string') {
    // doc = html.replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
    doc = html.replace(/<\/?.+?>/g, '')
  }
  return doc
}
//  #endregion

// #region color
/**
 * 计算颜色值的反色，colorStr格式为：rgb(0,0,0),#000000或者#f00
 * @param {String} colorStr colorStr格式为：rgb(0,0,0),#000000或者#f00
 * @returns {String} 反色的颜色值 #000000 格式
 */
export function reversalColor(colorStr) {
  var sixNumReg = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})*$/gi;
  var threeNumReg = /^#([a-fA-F0-9]{1})([a-fA-F0-9]{1})([a-fA-F0-9]{1})$/gi;
  var rgbReg = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/gi;
  var c1 = 0,
    c2 = 0,
    c3 = 0;
  var parseHexToInt = function (hex) {
    return parseInt(hex, 16);
  };
  var parseIntToHex = function (int) {
    return int.toString(16);
  };
  if (sixNumReg.test(colorStr)) {
    sixNumReg.exec(colorStr);
    c1 = parseHexToInt(RegExp.$1);
    c2 = parseHexToInt(RegExp.$2);
    c3 = parseHexToInt(RegExp.$3);
  } else if (threeNumReg.test(colorStr)) {
    threeNumReg.exec(colorStr);
    c1 = parseHexToInt(RegExp.$1 + RegExp.$1);
    c2 = parseHexToInt(RegExp.$2 + RegExp.$2);
    c3 = parseHexToInt(RegExp.$3 + RegExp.$3);
  } else if (rgbReg.test(colorStr)) {
    //rgb color 直接就是十进制，不用转换
    rgbReg.exec(colorStr);
    c1 = RegExp.$1;
    c2 = RegExp.$2;
    c3 = RegExp.$3;
  } else {
    throw new Error(
      "Error color string format. eg.[rgb(0,0,0),#000000,#f00]"
    );
  }
  c1 = parseIntToHex(255 - c1);
  c2 = parseIntToHex(255 - c2);
  c3 = parseIntToHex(255 - c3);
  return (
    "#" +
    (c1 < 10 ? "0" + c1 : c1) +
    (c2 < 10 ? "0" + c2 : c2) +
    (c3 < 10 ? "0" + c3 : c3)
  );
}

/**
 * 获取随机颜色
 * @param {Boolean} [useRgb=false] 是否使用rgb格式 
 * @returns {String} 颜色值 #000000 或 rgb(0,0,0)
 */
export function randomColor(useRgb = false) {
  let _color = ''
  if (!useRgb) {
    // http://blog.csdn.net/inite/article/details/52554142
    _color = '#' + ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).slice(-6);
  } else {
    _color =
      "rgb(" +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      "," +
      Math.floor(Math.random() * 256) +
      ")";
  }
  return _color
}

/**
 * 获取dom元素的style
 * @param {Dom} domObj - document文档对象，不是id
 * @returns {Object} style对象
 */
export function getStyle(domObj) {
  return domObj.currentStyle != null ? domObj.currentStyle : window.getComputedStyle(domObj, false)
}
//  #endregion

// #region object
/**
 * 用于合并多个对象或深克隆,类似于jQuery.extend；
 * 数组也可以合并,这里数组可以理解为以索引为属性的对象；
 * mix( target, [object1, objectN ] )；
 * mix( [deep], target, [object1, objectN ] )；
 * deep : 如果是true，合并成为递归（又叫做深拷贝）。
 * target : 对象扩展。这将接收新的属性。
 * object1 -- objectN : 一个对象，它包含额外的属性合并到第一个参数。
 * @returns {Object} 返回 target
 * @example
 * // 多个对象拷贝
 * // {"title":"sss","obj":{"sub":"abc","test":"sub123"}}
 * this.plus.mix({title:'dd',obj:{sub:'abc',subtitle:'sub'}},{title:'sss',obj:{sub:'abc',test:'sub123'}})
 * 
 * // 多个对象深度拷贝
 * // {"title":"sss","obj":{"sub":"abc","subtitle":"sub","test":"sub123"}}
 * this.plus.mix(true,{title:'dd',id:123,obj:{sub:'abc',subtitle:'sub'}},{title:'sss',id1:123,obj:{sub:'abc',test:'sub123'}})
 * 
 * // 多个数组拷贝
 * // [4,{"sub":"abc","test":"sub123"},3,5]
 * this.plus.mix([1,{sub:'abc',subtitle:'sub'},2,5],[4,{sub:'abc',test:'sub123'},3])
 * 
 * // 多个数组深度拷贝
 * // [4,{"sub":"abc","subtitle":"sub","test":"sub123"},3,5]
 * this.plus.mix(true,[1,{sub:'abc',subtitle:'sub'},2,5],[4,{sub:'abc',test:'sub123'},3])
 * 
 * // 对象拷贝到数组中
 * // [1, 1, 2, title: "ddd", id: 123]
 * this.plus.mix([1,1,2],{title:'dd',id:123})
 * 
 * // 数组拷贝到对象中
 * // Object {0: 1, 1: 1, 2: 2, title: "dd", id: 123}
 * this.plus.mix({title:'dd',id:123},[1,1,2])
 */
export function mix() {
  var options
  var name
  var src
  var copy
  var copyIsArray
  var clone
  var target = arguments[0] || {}
  var i = 1
  var length = arguments.length
  var deep = false
  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'Boolean') {
    deep = target
    target = arguments[1] || {}
    i++
  }

  // 确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }

  // 如果只有一个参数，那么新成员添加于mix所在的对象上
  if (i === length) {
    target = this
    i--
  }

  for (; i < length; i++) {
    // 只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name]
        try {
          // 当options为VBS对象时报错
          copy = options[name]
        } catch (e) {
          continue
        }

        // 防止环引用
        if (target === copy) {
          continue
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[name] = mix(deep, clone, copy)
        } else if (copy !== void 0) {
          target[name] = copy
        }
      }
    }
  }
  return target
}

// /**
//  * 比较对象是否相等
//  * @param {Object} x - 对象x
//  * @param {Object} y - 对象y
//  * @param {String} [propertys=''] 设置对比的属性,多属性用逗号分隔
//  */
// export function equals(x, y, propertys = '') {
//   // If both x and y are null or undefined and exactly the same
//   if (x === y) {
//     return true
//   }
//   // If they are not strictly equal, they both need to be Objects
//   if (!(x instanceof Object) || !(y instanceof Object)) {
//     return false
//   }
//   // They must have the exact same prototype chain, the closest we can do is
//   // test the constructor.
//   if (x.constructor !== y.constructor) {
//     return false
//   }

//   if (typeof (x) === 'function' && typeof (y) === 'function') {
//     return (x).toString() === (y).toString()
//   }

//   if (propertys) {
//     var arrs = propertys.split(',')
//     for (var arr in arrs) {
//       var _p = arrs[arr]
//       if (x.hasOwnProperty(_p) && y.hasOwnProperty(_p)) {
//         // If they have the same strict value or identity then they are equal
//         if (x[_p] === y[_p]) {
//           continue
//         }
//         // Numbers, Strings, Functions, Booleans must be strictly equal
//         if (typeof (x[_p]) !== 'object' && typeof (x[_p]) !== 'function') {
//           return false
//         }
//         // Objects and Arrays must be tested recursively
//         if (!equals(x[_p], y[_p])) {
//           return false
//         }
//       }
//     }
//   } else {
//     for (var p in x) {
//       // Inherited properties were tested using x.constructor === y.constructor
//       if (x.hasOwnProperty(p)) {
//         // Allows comparing x[ p ] and y[ p ] when set to undefined
//         if (!y.hasOwnProperty(p)) {
//           return false
//         }
//         // If they have the same strict value or identity then they are equal
//         if (x[p] === y[p]) {
//           continue
//         }
//         // Numbers, Strings, Functions, Booleans must be strictly equal
//         if (typeof (x[p]) !== 'object' && typeof (x[p]) !== 'function') {
//           return false
//         }
//         // Objects and Arrays must be tested recursively
//         if (!equals(x[p], y[p])) {
//           return false
//         }
//       }
//     }

//     for (p in y) {
//       // allows x[ p ] to be set to undefined
//       if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
//         return false
//       }
//     }
//   }

//   return true
// }
//  #endregion

// #region number
import accounting from 'accounting'

/**
 * 把 Number 四舍五入为指定小数位数的数字
 * @param {Number|String} value 
 * @param {Number} [precision=0] - 保留位数
 * @param {Boolean} [toStr=false] - 是否输出为字符串格式，false则输出数值
 * @returns {Number|String} 四舍五入后的数字或字符串
 */
export function toFixed(value, precision = 0, toStr = false) {
  let fixed = accounting.toFixed(value, precision) * 1
  if (toStr === true) {
    fixed = accounting.toFixed(value, precision)
  }
  return fixed
}
//  #endregion