/**
  * vue-h5-plus v1.0.8
  * H5Plus Extend for Vue.js
  * (c) 2017 cwb
  * repository: https://github.com/232003894/vueh5plus
  * @license MIT
  */
'use strict';

// #region Array扩展：isArray forEach removeAt
// fixed Array.isArray
if (!Array.isArray) {
  Array.isArray = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]'
  };
}
/* global NodeList:true */
if (!NodeList.prototype.forEach) {
  // 安卓4.2中 NodeList forEach不支持
  NodeList.prototype.forEach = Array.prototype.forEach;
}
/* eslint-disable no-extend-native */
Array.prototype.removeAt = function (index) {
  // 移除数组中指定位置的元素，返回布尔表示成功与否
  return !!this.splice(index, 1).length
};
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
    };
    var evt = document.createEvent('Events');
    var bubbles = true;
    for (var name in params) {
      (name === 'bubbles') ? (bubbles = !!params[name]) : (evt[name] = params[name]);
    }
    evt.initEvent(event, bubbles, true);
    return evt
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}
// #endregion
// #region String扩展：trim
// fixed String trim
if (String.prototype.trim === undefined) { // fix for iOS 3.2
  /* eslint-disable no-extend-native */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '')
  };
}
// #endregion

// #region Object扩展：setPrototypeOf
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  /* eslint-disable no-proto */
  obj['__proto__'] = proto;
  return obj
};
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

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var accounting = createCommonjsModule(function (module, exports) {
/*!
 * accounting.js v0.4.1
 * Copyright 2014 Open Exchange Rates
 *
 * Freely distributable under the MIT license.
 * Portions of accounting.js are inspired or borrowed from underscore.js
 *
 * Full details and documentation:
 * http://openexchangerates.github.io/accounting.js/
 */

(function(root, undefined) {

	/* --- Setup --- */

	// Create the local library object, to be exported or referenced globally later
	var lib = {};

	// Current version
	lib.version = '0.4.1';


	/* --- Exposed settings --- */

	// The library's settings configuration object. Contains default parameters for
	// currency and number formatting
	lib.settings = {
		currency: {
			symbol : "$",		// default currency symbol is '$'
			format : "%s%v",	// controls output: %s = symbol, %v = value (can be object, see docs)
			decimal : ".",		// decimal point separator
			thousand : ",",		// thousands separator
			precision : 2,		// decimal places
			grouping : 3		// digit grouping (not implemented yet)
		},
		number: {
			precision : 0,		// default precision on numbers is 0
			grouping : 3,		// digit grouping (not implemented yet)
			thousand : ",",
			decimal : "."
		}
	};


	/* --- Internal Helper Methods --- */

	// Store reference to possibly-available ECMAScript 5 methods for later
	var nativeMap = Array.prototype.map,
		nativeIsArray = Array.isArray,
		toString = Object.prototype.toString;

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js
	 */
	function isString(obj) {
		return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
	}

	/**
	 * Tests whether supplied parameter is a string
	 * from underscore.js, delegates to ECMA5's native Array.isArray
	 */
	function isArray(obj) {
		return nativeIsArray ? nativeIsArray(obj) : toString.call(obj) === '[object Array]';
	}

	/**
	 * Tests whether supplied parameter is a true object
	 */
	function isObject(obj) {
		return obj && toString.call(obj) === '[object Object]';
	}

	/**
	 * Extends an object with a defaults object, similar to underscore's _.defaults
	 *
	 * Used for abstracting parameter handling from API methods
	 */
	function defaults(object, defs) {
		var key;
		object = object || {};
		defs = defs || {};
		// Iterate over object non-prototype properties:
		for (key in defs) {
			if (defs.hasOwnProperty(key)) {
				// Replace values with defaults only if undefined (allow empty/zero values):
				if (object[key] == null) object[key] = defs[key];
			}
		}
		return object;
	}

	/**
	 * Implementation of `Array.map()` for iteration loops
	 *
	 * Returns a new Array as a result of calling `iterator` on each array value.
	 * Defers to native Array.map if available
	 */
	function map(obj, iterator, context) {
		var results = [], i, j;

		if (!obj) return results;

		// Use native .map method if it exists:
		if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);

		// Fallback for native .map:
		for (i = 0, j = obj.length; i < j; i++ ) {
			results[i] = iterator.call(context, obj[i], i, obj);
		}
		return results;
	}

	/**
	 * Check and normalise the value of precision (must be positive integer)
	 */
	function checkPrecision(val, base) {
		val = Math.round(Math.abs(val));
		return isNaN(val)? base : val;
	}


	/**
	 * Parses a format string or object and returns format obj for use in rendering
	 *
	 * `format` is either a string with the default (positive) format, or object
	 * containing `pos` (required), `neg` and `zero` values (or a function returning
	 * either a string or object)
	 *
	 * Either string or format.pos must contain "%v" (value) to be valid
	 */
	function checkCurrencyFormat(format) {
		var defaults = lib.settings.currency.format;

		// Allow function as format parameter (should return string or object):
		if ( typeof format === "function" ) format = format();

		// Format can be a string, in which case `value` ("%v") must be present:
		if ( isString( format ) && format.match("%v") ) {

			// Create and return positive, negative and zero formats:
			return {
				pos : format,
				neg : format.replace("-", "").replace("%v", "-%v"),
				zero : format
			};

		// If no format, or object is missing valid positive value, use defaults:
		} else if ( !format || !format.pos || !format.pos.match("%v") ) {

			// If defaults is a string, casts it to an object for faster checking next time:
			return ( !isString( defaults ) ) ? defaults : lib.settings.currency.format = {
				pos : defaults,
				neg : defaults.replace("%v", "-%v"),
				zero : defaults
			};

		}
		// Otherwise, assume format was fine:
		return format;
	}


	/* --- API Methods --- */

	/**
	 * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
	 * Alias: `accounting.parse(string)`
	 *
	 * Decimal must be included in the regular expression to match floats (defaults to
	 * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
	 * separator, provide it as the second argument.
	 *
	 * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
	 *
	 * Doesn't throw any errors (`NaN`s become 0) but this may change in future
	 */
	var unformat = lib.unformat = lib.parse = function(value, decimal) {
		// Recursively unformat arrays:
		if (isArray(value)) {
			return map(value, function(val) {
				return unformat(val, decimal);
			});
		}

		// Fails silently (need decent errors):
		value = value || 0;

		// Return the value as-is if it's already a number:
		if (typeof value === "number") return value;

		// Default decimal point comes from settings, but could be set to eg. "," in opts:
		decimal = decimal || lib.settings.number.decimal;

		 // Build regex to strip out everything except digits, decimal point and minus sign:
		var regex = new RegExp("[^0-9-" + decimal + "]", ["g"]),
			unformatted = parseFloat(
				("" + value)
				.replace(/\((.*)\)/, "-$1") // replace bracketed values with negatives
				.replace(regex, '')         // strip out any cruft
				.replace(decimal, '.')      // make sure decimal point is standard
			);

		// This will fail silently which may cause trouble, let's wait and see:
		return !isNaN(unformatted) ? unformatted : 0;
	};


	/**
	 * Implementation of toFixed() that treats floats more like decimals
	 *
	 * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
	 * problems for accounting- and finance-related software.
	 */
	var toFixed = lib.toFixed = function(value, precision) {
		precision = checkPrecision(precision, lib.settings.number.precision);
		var power = Math.pow(10, precision);

		// Multiply up by precision, round accurately, then divide and use native toFixed():
		return (Math.round(lib.unformat(value) * power) / power).toFixed(precision);
	};


	/**
	 * Format a number, with comma-separated thousands and custom precision/decimal places
	 * Alias: `accounting.format()`
	 *
	 * Localise by overriding the precision and thousand / decimal separators
	 * 2nd parameter `precision` can be an object matching `settings.number`
	 */
	var formatNumber = lib.formatNumber = lib.format = function(number, precision, thousand, decimal) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val) {
				return formatNumber(val, precision, thousand, decimal);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(precision) ? precision : {
					precision : precision,
					thousand : thousand,
					decimal : decimal
				}),
				lib.settings.number
			),

			// Clean up precision
			usePrecision = checkPrecision(opts.precision),

			// Do some calc:
			negative = number < 0 ? "-" : "",
			base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10) + "",
			mod = base.length > 3 ? base.length % 3 : 0;

		// Format the number:
		return negative + (mod ? base.substr(0, mod) + opts.thousand : "") + base.substr(mod).replace(/(\d{3})(?=\d)/g, "$1" + opts.thousand) + (usePrecision ? opts.decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : "");
	};


	/**
	 * Format a number into currency
	 *
	 * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
	 * defaults: (0, "$", 2, ",", ".", "%s%v")
	 *
	 * Localise by overriding the symbol, precision, thousand / decimal separators and format
	 * Second param can be an object matching `settings.currency` which is the easiest way.
	 *
	 * To do: tidy up the parameters
	 */
	var formatMoney = lib.formatMoney = function(number, symbol, precision, thousand, decimal, format) {
		// Resursively format arrays:
		if (isArray(number)) {
			return map(number, function(val){
				return formatMoney(val, symbol, precision, thousand, decimal, format);
			});
		}

		// Clean up number:
		number = unformat(number);

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero):
			formats = checkCurrencyFormat(opts.format),

			// Choose which format to use for this value:
			useFormat = number > 0 ? formats.pos : number < 0 ? formats.neg : formats.zero;

		// Return with currency symbol added:
		return useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(number), checkPrecision(opts.precision), opts.thousand, opts.decimal));
	};


	/**
	 * Format a list of numbers into an accounting column, padding with whitespace
	 * to line up currency symbols, thousand separators and decimals places
	 *
	 * List should be an array of numbers
	 * Second parameter can be an object containing keys that match the params
	 *
	 * Returns array of accouting-formatted number strings of same length
	 *
	 * NB: `white-space:pre` CSS rule is required on the list container to prevent
	 * browsers from collapsing the whitespace in the output strings.
	 */
	lib.formatColumn = function(list, symbol, precision, thousand, decimal, format) {
		if (!list) return [];

		// Build options object from second param (if object) or all params, extending defaults:
		var opts = defaults(
				(isObject(symbol) ? symbol : {
					symbol : symbol,
					precision : precision,
					thousand : thousand,
					decimal : decimal,
					format : format
				}),
				lib.settings.currency
			),

			// Check format (returns object with pos, neg and zero), only need pos for now:
			formats = checkCurrencyFormat(opts.format),

			// Whether to pad at start of string or after currency symbol:
			padAfterSymbol = formats.pos.indexOf("%s") < formats.pos.indexOf("%v") ? true : false,

			// Store value for the length of the longest string in the column:
			maxLength = 0,

			// Format the list according to options, store the length of the longest string:
			formatted = map(list, function(val, i) {
				if (isArray(val)) {
					// Recursively format columns if list is a multi-dimensional array:
					return lib.formatColumn(val, opts);
				} else {
					// Clean up the value
					val = unformat(val);

					// Choose which format to use for this value (pos, neg or zero):
					var useFormat = val > 0 ? formats.pos : val < 0 ? formats.neg : formats.zero,

						// Format this value, push into formatted list and save the length:
						fVal = useFormat.replace('%s', opts.symbol).replace('%v', formatNumber(Math.abs(val), checkPrecision(opts.precision), opts.thousand, opts.decimal));

					if (fVal.length > maxLength) maxLength = fVal.length;
					return fVal;
				}
			});

		// Pad each number in the list and send back the column of numbers:
		return map(formatted, function(val, i) {
			// Only if this is a string (not a nested array, which would have already been padded):
			if (isString(val) && val.length < maxLength) {
				// Depending on symbol position, pad after symbol or at index 0:
				return padAfterSymbol ? val.replace(opts.symbol, opts.symbol+(new Array(maxLength - val.length + 1).join(" "))) : (new Array(maxLength - val.length + 1).join(" ")) + val;
			}
			return val;
		});
	};


	/* --- Module Definition --- */

	// Export accounting for CommonJS. If being loaded as an AMD module, define it as such.
	// Otherwise, just add `accounting` to the global object
	{
		if ('object' !== 'undefined' && module.exports) {
			exports = module.exports = lib;
		}
		exports.accounting = lib;
	}

	// Root will be `window` in browser or `global` on the server:
}(commonjsGlobal));
});

/**
 * 类型和验证
 * @module utils.type
 */
// #region type

let class2type = {};

let types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

types.forEach((name, i) => {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

/**
 * 获取类型
 * @param {*} value
 * @returns {String} 类型名称
 */
function getType(value) {
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
function isString(value) {
  return getType(value) === 'string'
}

/**
 * 判定是否为数值
 * @param {*} value
 * @returns {Boolean} 是否为数值
 */
function isNumber(value) {
  return getType(value) === 'number'
}

/**
 * 判定是否为布尔
 * @param {*} value
 * @returns {Boolean} 是否为布尔
 */
function isBoolean(value) {
  return getType(value) === 'Boolean'
}

/**
 * 判定是否为正则
 * @param {*} value
 * @returns {Boolean} 是否为正则
 */
function isRegExp(value) {
  return getType(value) === 'regexp'
}

/**
 * 判定是否为一个函数
 * @param {*} value
 * @returns {Boolean} 是否为一个函数
 */
function isFunction(value) {
  return getType(value) === 'function'
}

/**
 * 判定是否为日期
 * @param {*} value
 * @returns {Boolean} 是否为日期
 */
function isDate(value) {
  return getType(value) === 'date'
}

/**
 * 判定是否为数组
 * @param {*} value
 * @returns {Boolean} 是否为数组
 */
function isArray(value) {
  return getType(value) === 'array'
}

/**
 * 判定是否为一个window对象
 * @param {*} value
 * @returns {Boolean} 是否为一个window对象
 */
function isWindow(value) {
  return value != null && value === value.window
}

/**
 * 判定是否为一个对象
 * @param {*} value
 * @returns {Boolean} 是否为一个对象
 */
function isObject(value) {
  return getType(value) === 'object'
}

/**
 * 判定是否为一个纯净的JS对象, 不能为window, 任何类(包括自定义类)的实例,元素节点,文本节点
 * @param {*} value
 * @returns {Boolean} 是否为一个纯净的JS对象
 */
function isPlainObject(value) {
  return isObject(value) && !isWindow(value) && Object.getPrototypeOf(value) === Object.prototype
}

/**
 * 验证URL
 * @param {String} str - 待验证的字符串 
 * @returns {Boolean} 是否为URL格式
 */
function isURL(str) {
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
 * 文本换行处理，去html标签
 * @module utils.txt
 */
// #region txt
/**
 * 文本自动换行
 * @param {String} txt - 文本
 * @param {Number} [lineLength=10] - 换行长度，0：表示不处理
 * @param {String} [lineBreak="\r\n"] - 换行符
 * @returns {String} 换行处理过的字符串
 */
function strBreak(txt = "", lineLength = 10, lineBreak = "\r\n") {
  if (!txt) {
    return ''
  }
  lineLength = toFixed(lineLength);
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
function delHtmlTag(html) {
  var doc = '';
  if (getType(html) === 'string') {
    // doc = html.replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
    doc = html.replace(/<\/?.+?>/g, '');
  }
  return doc
}
//  #endregion

/**
 * 颜色和样式
 * 1.获取dom元素的style
 * 2.随机颜色
 * 3.颜色值的反色
 * @module utils.style
 */
// #region color
/**
 * 计算颜色值的反色，colorStr格式为：rgb(0,0,0),#000000或者#f00
 * @param {String} colorStr colorStr格式为：rgb(0,0,0),#000000或者#f00
 * @returns {String} 反色的颜色值 #000000 格式
 */
function reversalColor(colorStr) {
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
function randomColor(useRgb = false) {
  let _color = '';
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
function getStyle(domObj) {
  return domObj.currentStyle != null ? domObj.currentStyle : window.getComputedStyle(domObj, false)
}
//  #endregion

/**
 * 对象对比和合并、拷贝
 * @module utils.object
 */
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
function mix() {
  var options;
  var name;
  var src;
  var copy;
  var copyIsArray;
  var clone;
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'Boolean') {
    deep = target;
    target = arguments[1] || {};
    i++;
  }

  // 确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  // 如果只有一个参数，那么新成员添加于mix所在的对象上
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // 只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        try {
          // 当options为VBS对象时报错
          copy = options[name];
        } catch (e) {
          continue
        }

        // 防止环引用
        if (target === copy) {
          continue
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[name] = mix(deep, clone, copy);
        } else if (copy !== void 0) {
          target[name] = copy;
        }
      }
    }
  }
  return target
}

/**
 * 比较对象是否相等
 * @param {Object} x - 对象x
 * @param {Object} y - 对象y
 * @param {String} [propertys=''] 设置对比的属性,多属性用逗号分隔
 */
function equals(x, y, propertys = '') {
  // If both x and y are null or undefined and exactly the same
  if (x === y) {
    return true
  }
  // If they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false
  }
  // They must have the exact same prototype chain, the closest we can do is
  // test the constructor.
  if (x.constructor !== y.constructor) {
    return false
  }

  if (typeof (x) === 'function' && typeof (y) === 'function') {
    return (x).toString() === (y).toString()
  }

  if (propertys) {
    var arrs = propertys.split(',');
    for (var arr in arrs) {
      var _p = arrs[arr];
      if (x.hasOwnProperty(_p) && y.hasOwnProperty(_p)) {
        // If they have the same strict value or identity then they are equal
        if (x[_p] === y[_p]) {
          continue
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof (x[_p]) !== 'object' && typeof (x[_p]) !== 'function') {
          return false
        }
        // Objects and Arrays must be tested recursively
        if (!equals(x[_p], y[_p])) {
          return false
        }
      }
    }
  } else {
    for (var p in x) {
      // Inherited properties were tested using x.constructor === y.constructor
      if (x.hasOwnProperty(p)) {
        // Allows comparing x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
          return false
        }
        // If they have the same strict value or identity then they are equal
        if (x[p] === y[p]) {
          continue
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof (x[p]) !== 'object' && typeof (x[p]) !== 'function') {
          return false
        }
        // Objects and Arrays must be tested recursively
        if (!equals(x[p], y[p])) {
          return false
        }
      }
    }

    for (p in y) {
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false
      }
    }
  }

  return true
}
//  #endregion

/**
 * 数字toFixed
 * @module utils.number
 */
// #region number
/**
 * 把 Number 四舍五入为指定小数位数的数字
 * @param {Number} value 
 * @param {Number} [precision=0] - 保留位数
 * @param {Boolean} [toStr=false] - 是否输出为字符串格式，false则输出数值
 * @returns {Number|String} 四舍五入后的数字或字符串
 */
function toFixed(value, precision = 0, toStr = false) {
  let fixed = accounting.toFixed(value, precision) * 1;
  if (toStr === true) {
    fixed = accounting.toFixed(value, precision);
  }
  return fixed
}
//  #endregion

/**
 * 浏览器用于 HTTP 请求的用户代理头的值
 * @module userAgent
 */

const ua = navigator.userAgent;

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
};

// wechat
let match = ua.match(/(MicroMessenger)\/([\d.]+)/i);
if (match) {
  _os.name += ' wechat';
  _os.wechat = match[2].replace(/_/g, '.');
}
// android
match = ua.match(/(Android);?[\s/]+([\d.]+)?/);
if (match) {
  _os.name += ' android';
  _os.android = true;
  _os.version = match[2];
  _os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion));
}
// ipad
match = ua.match(/(iPad).*OS\s([\d_]+)/);
if (match) {
  _os.name += ' iPad';
  _os.ios = _os.ipad = true;
  _os.version = match[2].replace(/_/g, '.');
}
// iphone
match = ua.match(/(iPhone\sOS)\s([\d_]+)/);
if (!_os.ipad && match) {
  _os.name += ' iPhone';
  _os.ios = _os.iphone = true;
  _os.version = match[2].replace(/_/g, '.');
}
//  5+ Browser
match = ua.match(/Html5Plus/i);
if (match) {
  _os.name += ' h5+';
  _os.plus = true;
  // document.body.classList.add( $.className( 'plus' ) )
}
// 最好有流应用自己的标识
match = ua.match(/StreamApp/i);
if (match) {
  _os.name += ' stream';
  _os.stream = true;
  // document.body.classList.add( $.className( 'plus-stream' ) )
}


/**
 * 浏览器属性
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
let os = _os;

/**
 * 跨webView广播通知
 * @module broadcast
 */

/**
 * 广播通知
 * @param {String} name - 事件名称
 * @param {Object} [data] - 事件数据
 * @param {Object} [opts] - 需要通知的窗体参数
 * @param {Bollean} [opts.self=false] - 是否通知自己<br>false:不通知自己
 * @param {Array} [opts.ids=[]] - 指定通知的窗体id集合<br>[]:通知所有窗体
 * @example <caption>广播通知已登录（包括本窗体）.</caption>
 * this.plus.send("logined", { uid: 1 }, { self: true });
 */
function send(name, data = {}, { self = false, ids = [] } = {}) {
    if (window.plus) {
        // 设备的情况
        let views = plus.webview.all();
        if (ids.length > 0) {
            views = [];
            for (let id of ids) {
                let view = plus.webview.getWebviewById(id);
                view && views.push(view);
            }
        }
        let _indexID = plus.webview.currentWebview().id;
        for (let v of views) {
            //跳过自己
            if (v.id == _indexID && !self) {
                continue
            }
            if (!data) {
                data = {};
            }
            v.evalJS(`document.dispatchEvent(new CustomEvent('${name}', {
                detail:JSON.parse('${JSON.stringify(data)}'),
                bubbles: true,
                cancelable: true
            }));`);
        }
    }
    else {
        // 非设备:基本上是给调试用的
        let views = [...mainWin.__all_wins];
        let viewsAll = [...mainWin.__all_wins];
        if (ids.length > 0) {
            views = [];
            for (let id of ids) {
                let view = viewsAll.find(function (item, index, arr) {
                    return item.id === id;
                });
                view && views.push(view);
            }
        }
        let _indexID = window.id;
        for (let v of views) {
            //跳过自己
            if (v.id == _indexID && !self) {
                continue
            }
            // console.log('send')
            v.postMessage({
                name: name,
                data: data
            }, window.location.origin);
        }
    }

}

/**
 * 统原生界面
 * @module nativeUI
 */

// #region 常量
// 载入中
const loadingTitle = '';

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
};
const toastOption = {
  // 提示消息在屏幕中的垂直位置：可选值为"top"、"center"、"bottom"，分别为垂直居顶、居中、居底，未设置时默认值为"bottom"
  verticalAlign: 'bottom',
  // 提示消息框显示的时间：可选值为"long"、"short"，值为"long"时显示时间约为3.5s，值为"short"时显示时间约为2s，未设置时默认值为"short"。
  duration: 'short',
  // 提示消息框上显示的图标：png格式，并且必须是本地资源地址；图标与文字分两行显示，上面显示图标，下面显示文字；
  icon: '',
  // 提示 
  lineLength: 0
};
// #endregion

/**
 * 显示系统等待对话框
 * @param {String} title='' - 标题
 * @example 
 * this.plus.showWaiting("载入中");
 */
function showWaiting(title = '') {
  if (!title) {
    title = loadingTitle;
  }
  if (window.plus) {
    plus.nativeUI.showWaiting(title, WaitingOptions);
    // return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的showWaiting方法!');
    // return false
  }
}

/**
 * 关闭系统等待对话框
 * @example 
 * this.plus.closeWaiting();
 */
function closeWaiting() {
  if (window.plus) {
    plus.nativeUI.closeWaiting();
    return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的closeWaiting方法!');
    return false
  }
}

/**
 * 显示自动消失的提示消息
 * @param {String} msg - 提示消息上显示的文字内容
 * @param {Object} opts - 提示消息参数，只有<b>lineLength属性</b>是扩展的，<br>下列只是部分常用的，其他完整的可以参考{@link http://www.html5plus.org/doc/zh_cn/nativeui.html#plus.nativeUI.ToastOptions HTML5+ API}。
 * @param {Number} [opts.lineLength=0] - 提示信息（msg）的手动换行长度，单位是字节，0表示不处理。
 * @param {String} [opts.verticalAlign='bottom'] - 屏幕中的垂直位置：可选值为"top"、"center"、"bottom"，分别为垂直居顶、居中、居底。
 * @param {String} [opts.icon=''] - 显示的图标：png格式，并且必须是本地资源地址；<br>默认图标与文字分两行显示，上面显示图标，下面显示文字。
 * @param {String} [opts.duration='short'] - 显示的时间：可选值为"long"、"short"，"long"约为3.5s，"short"约为2s。
 * @example <caption>垂直居顶自动换行的消息.</caption>
 * this.plus.toast(
 *  "创建并显示系统样式提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。长时间提示消息显示时间约为3.5s，短时间提示消息显示时间约为2s。",
 *  {
 *    verticalAlign: "top",
 *    duration: "short",
 *    lineLength: 0
 *  }
 *);
 * @example <caption>垂直居中13个字节换行的消息.</caption>
 * this.plus.toast(
 *  "创建并显示系统样式提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。长时间提示消息显示时间约为3.5s，短时间提示消息显示时间约为2s。",
 *  {
 *    verticalAlign: "center",
 *    duration: "short",
 *    lineLength: 13
 *  }
 *);
 * @example <caption>带成功图标的消息.</caption>
 * // 图标png格式，并且必须是本地资源地址（Hbuilder的App项目路径，不能是远程路径）
 * this.plus.toast("提案成功", {
 *    verticalAlign: "center",
 *    icon: "/ui/ok.png"
 *  }
 *);
 */
function toast(msg = '', opts = {}) {
  if (!msg || !isString(msg)) {
    return
  }
  opts = mix({}, toastOption, opts);
  msg = strBreak(msg, opts.lineLength);
  if (opts.verticalAlign !== 'bottom' && opts.verticalAlign !== 'top' && opts.verticalAlign !== 'center') {
    opts.verticalAlign = 'bottom';
  }
  if (opts.duration !== 'long' && opts.duration !== 'short') {
    opts.duration = 'short';
  }
  if (!isString(opts.icon)) {
    opts.icon = '';
  }
  if (window.plus) {
    plus.nativeUI.toast(msg, opts);
    // return true
  } else {
    console.log('[' + os.name + ']不支持nativeUI的toast方法!');
    console.log('[toast]\n' + msg);
    // return false
  }
}

var utils = createCommonjsModule(function (module, exports) {
'use strict';

var has = Object.prototype.hasOwnProperty;

var hexTable = (function () {
    var array = [];
    for (var i = 0; i < 256; ++i) {
        array.push('%' + ((i < 16 ? '0' : '') + i.toString(16)).toUpperCase());
    }

    return array;
}());

var compactQueue = function compactQueue(queue) {
    var obj;

    while (queue.length) {
        var item = queue.pop();
        obj = item.obj[item.prop];

        if (Array.isArray(obj)) {
            var compacted = [];

            for (var j = 0; j < obj.length; ++j) {
                if (typeof obj[j] !== 'undefined') {
                    compacted.push(obj[j]);
                }
            }

            item.obj[item.prop] = compacted;
        }
    }

    return obj;
};

exports.arrayToObject = function arrayToObject(source, options) {
    var obj = options && options.plainObjects ? Object.create(null) : {};
    for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== 'undefined') {
            obj[i] = source[i];
        }
    }

    return obj;
};

exports.merge = function merge(target, source, options) {
    if (!source) {
        return target;
    }

    if (typeof source !== 'object') {
        if (Array.isArray(target)) {
            target.push(source);
        } else if (typeof target === 'object') {
            if (options.plainObjects || options.allowPrototypes || !has.call(Object.prototype, source)) {
                target[source] = true;
            }
        } else {
            return [target, source];
        }

        return target;
    }

    if (typeof target !== 'object') {
        return [target].concat(source);
    }

    var mergeTarget = target;
    if (Array.isArray(target) && !Array.isArray(source)) {
        mergeTarget = exports.arrayToObject(target, options);
    }

    if (Array.isArray(target) && Array.isArray(source)) {
        source.forEach(function (item, i) {
            if (has.call(target, i)) {
                if (target[i] && typeof target[i] === 'object') {
                    target[i] = exports.merge(target[i], item, options);
                } else {
                    target.push(item);
                }
            } else {
                target[i] = item;
            }
        });
        return target;
    }

    return Object.keys(source).reduce(function (acc, key) {
        var value = source[key];

        if (has.call(acc, key)) {
            acc[key] = exports.merge(acc[key], value, options);
        } else {
            acc[key] = value;
        }
        return acc;
    }, mergeTarget);
};

exports.assign = function assignSingleSource(target, source) {
    return Object.keys(source).reduce(function (acc, key) {
        acc[key] = source[key];
        return acc;
    }, target);
};

exports.decode = function (str) {
    try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
    } catch (e) {
        return str;
    }
};

exports.encode = function encode(str) {
    // This code was originally written by Brian White (mscdex) for the io.js core querystring library.
    // It has been adapted here for stricter adherence to RFC 3986
    if (str.length === 0) {
        return str;
    }

    var string = typeof str === 'string' ? str : String(str);

    var out = '';
    for (var i = 0; i < string.length; ++i) {
        var c = string.charCodeAt(i);

        if (
            c === 0x2D // -
            || c === 0x2E // .
            || c === 0x5F // _
            || c === 0x7E // ~
            || (c >= 0x30 && c <= 0x39) // 0-9
            || (c >= 0x41 && c <= 0x5A) // a-z
            || (c >= 0x61 && c <= 0x7A) // A-Z
        ) {
            out += string.charAt(i);
            continue;
        }

        if (c < 0x80) {
            out = out + hexTable[c];
            continue;
        }

        if (c < 0x800) {
            out = out + (hexTable[0xC0 | (c >> 6)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        if (c < 0xD800 || c >= 0xE000) {
            out = out + (hexTable[0xE0 | (c >> 12)] + hexTable[0x80 | ((c >> 6) & 0x3F)] + hexTable[0x80 | (c & 0x3F)]);
            continue;
        }

        i += 1;
        c = 0x10000 + (((c & 0x3FF) << 10) | (string.charCodeAt(i) & 0x3FF));
        out += hexTable[0xF0 | (c >> 18)]
            + hexTable[0x80 | ((c >> 12) & 0x3F)]
            + hexTable[0x80 | ((c >> 6) & 0x3F)]
            + hexTable[0x80 | (c & 0x3F)];
    }

    return out;
};

exports.compact = function compact(value) {
    var queue = [{ obj: { o: value }, prop: 'o' }];
    var refs = [];

    for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];

        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
            var key = keys[j];
            var val = obj[key];
            if (typeof val === 'object' && val !== null && refs.indexOf(val) === -1) {
                queue.push({ obj: obj, prop: key });
                refs.push(val);
            }
        }
    }

    return compactQueue(queue);
};

exports.isRegExp = function isRegExp(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
};

exports.isBuffer = function isBuffer(obj) {
    if (obj === null || typeof obj === 'undefined') {
        return false;
    }

    return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
});

'use strict';

var replace = String.prototype.replace;
var percentTwenties = /%20/g;

var formats = {
    'default': 'RFC3986',
    formatters: {
        RFC1738: function (value) {
            return replace.call(value, percentTwenties, '+');
        },
        RFC3986: function (value) {
            return value;
        }
    },
    RFC1738: 'RFC1738',
    RFC3986: 'RFC3986'
};

'use strict';




var arrayPrefixGenerators = {
    brackets: function brackets(prefix) { // eslint-disable-line func-name-matching
        return prefix + '[]';
    },
    indices: function indices(prefix, key) { // eslint-disable-line func-name-matching
        return prefix + '[' + key + ']';
    },
    repeat: function repeat(prefix) { // eslint-disable-line func-name-matching
        return prefix;
    }
};

var toISO = Date.prototype.toISOString;

var defaults = {
    delimiter: '&',
    encode: true,
    encoder: utils.encode,
    encodeValuesOnly: false,
    serializeDate: function serializeDate(date) { // eslint-disable-line func-name-matching
        return toISO.call(date);
    },
    skipNulls: false,
    strictNullHandling: false
};

var stringify = function stringify( // eslint-disable-line func-name-matching
    object,
    prefix,
    generateArrayPrefix,
    strictNullHandling,
    skipNulls,
    encoder,
    filter,
    sort,
    allowDots,
    serializeDate,
    formatter,
    encodeValuesOnly
) {
    var obj = object;
    if (typeof filter === 'function') {
        obj = filter(prefix, obj);
    } else if (obj instanceof Date) {
        obj = serializeDate(obj);
    } else if (obj === null) {
        if (strictNullHandling) {
            return encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder) : prefix;
        }

        obj = '';
    }

    if (typeof obj === 'string' || typeof obj === 'number' || typeof obj === 'boolean' || utils.isBuffer(obj)) {
        if (encoder) {
            var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder);
            return [formatter(keyValue) + '=' + formatter(encoder(obj, defaults.encoder))];
        }
        return [formatter(prefix) + '=' + formatter(String(obj))];
    }

    var values = [];

    if (typeof obj === 'undefined') {
        return values;
    }

    var objKeys;
    if (Array.isArray(filter)) {
        objKeys = filter;
    } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        if (Array.isArray(obj)) {
            values = values.concat(stringify(
                obj[key],
                generateArrayPrefix(prefix, key),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        } else {
            values = values.concat(stringify(
                obj[key],
                prefix + (allowDots ? '.' + key : '[' + key + ']'),
                generateArrayPrefix,
                strictNullHandling,
                skipNulls,
                encoder,
                filter,
                sort,
                allowDots,
                serializeDate,
                formatter,
                encodeValuesOnly
            ));
        }
    }

    return values;
};

var stringify_1 = function (object, opts) {
    var obj = object;
    var options = opts ? utils.assign({}, opts) : {};

    if (options.encoder !== null && options.encoder !== undefined && typeof options.encoder !== 'function') {
        throw new TypeError('Encoder has to be a function.');
    }

    var delimiter = typeof options.delimiter === 'undefined' ? defaults.delimiter : options.delimiter;
    var strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults.strictNullHandling;
    var skipNulls = typeof options.skipNulls === 'boolean' ? options.skipNulls : defaults.skipNulls;
    var encode = typeof options.encode === 'boolean' ? options.encode : defaults.encode;
    var encoder = typeof options.encoder === 'function' ? options.encoder : defaults.encoder;
    var sort = typeof options.sort === 'function' ? options.sort : null;
    var allowDots = typeof options.allowDots === 'undefined' ? false : options.allowDots;
    var serializeDate = typeof options.serializeDate === 'function' ? options.serializeDate : defaults.serializeDate;
    var encodeValuesOnly = typeof options.encodeValuesOnly === 'boolean' ? options.encodeValuesOnly : defaults.encodeValuesOnly;
    if (typeof options.format === 'undefined') {
        options.format = formats['default'];
    } else if (!Object.prototype.hasOwnProperty.call(formats.formatters, options.format)) {
        throw new TypeError('Unknown format option provided.');
    }
    var formatter = formats.formatters[options.format];
    var objKeys;
    var filter;

    if (typeof options.filter === 'function') {
        filter = options.filter;
        obj = filter('', obj);
    } else if (Array.isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
    }

    var keys = [];

    if (typeof obj !== 'object' || obj === null) {
        return '';
    }

    var arrayFormat;
    if (options.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = options.arrayFormat;
    } else if ('indices' in options) {
        arrayFormat = options.indices ? 'indices' : 'repeat';
    } else {
        arrayFormat = 'indices';
    }

    var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];

    if (!objKeys) {
        objKeys = Object.keys(obj);
    }

    if (sort) {
        objKeys.sort(sort);
    }

    for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];

        if (skipNulls && obj[key] === null) {
            continue;
        }

        keys = keys.concat(stringify(
            obj[key],
            key,
            generateArrayPrefix,
            strictNullHandling,
            skipNulls,
            encode ? encoder : null,
            filter,
            sort,
            allowDots,
            serializeDate,
            formatter,
            encodeValuesOnly
        ));
    }

    var joined = keys.join(delimiter);
    var prefix = options.addQueryPrefix === true ? '?' : '';

    return joined.length > 0 ? prefix + joined : '';
};

'use strict';



var has = Object.prototype.hasOwnProperty;

var defaults$1 = {
    allowDots: false,
    allowPrototypes: false,
    arrayLimit: 20,
    decoder: utils.decode,
    delimiter: '&',
    depth: 5,
    parameterLimit: 1000,
    plainObjects: false,
    strictNullHandling: false
};

var parseValues = function parseQueryStringValues(str, options) {
    var obj = {};
    var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, '') : str;
    var limit = options.parameterLimit === Infinity ? undefined : options.parameterLimit;
    var parts = cleanStr.split(options.delimiter, limit);

    for (var i = 0; i < parts.length; ++i) {
        var part = parts[i];

        var bracketEqualsPos = part.indexOf(']=');
        var pos = bracketEqualsPos === -1 ? part.indexOf('=') : bracketEqualsPos + 1;

        var key, val;
        if (pos === -1) {
            key = options.decoder(part, defaults$1.decoder);
            val = options.strictNullHandling ? null : '';
        } else {
            key = options.decoder(part.slice(0, pos), defaults$1.decoder);
            val = options.decoder(part.slice(pos + 1), defaults$1.decoder);
        }
        if (has.call(obj, key)) {
            obj[key] = [].concat(obj[key]).concat(val);
        } else {
            obj[key] = val;
        }
    }

    return obj;
};

var parseObject = function (chain, val, options) {
    var leaf = val;

    for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];

        if (root === '[]') {
            obj = [];
            obj = obj.concat(leaf);
        } else {
            obj = options.plainObjects ? Object.create(null) : {};
            var cleanRoot = root.charAt(0) === '[' && root.charAt(root.length - 1) === ']' ? root.slice(1, -1) : root;
            var index = parseInt(cleanRoot, 10);
            if (
                !isNaN(index)
                && root !== cleanRoot
                && String(index) === cleanRoot
                && index >= 0
                && (options.parseArrays && index <= options.arrayLimit)
            ) {
                obj = [];
                obj[index] = leaf;
            } else {
                obj[cleanRoot] = leaf;
            }
        }

        leaf = obj;
    }

    return leaf;
};

var parseKeys = function parseQueryStringKeys(givenKey, val, options) {
    if (!givenKey) {
        return;
    }

    // Transform dot notation to bracket notation
    var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, '[$1]') : givenKey;

    // The regex chunks

    var brackets = /(\[[^[\]]*])/;
    var child = /(\[[^[\]]*])/g;

    // Get the parent

    var segment = brackets.exec(key);
    var parent = segment ? key.slice(0, segment.index) : key;

    // Stash the parent if it exists

    var keys = [];
    if (parent) {
        // If we aren't using plain objects, optionally prefix keys
        // that would overwrite object prototype properties
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
            if (!options.allowPrototypes) {
                return;
            }
        }

        keys.push(parent);
    }

    // Loop through children appending to the array until we hit depth

    var i = 0;
    while ((segment = child.exec(key)) !== null && i < options.depth) {
        i += 1;
        if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
            if (!options.allowPrototypes) {
                return;
            }
        }
        keys.push(segment[1]);
    }

    // If there's a remainder, just add whatever is left

    if (segment) {
        keys.push('[' + key.slice(segment.index) + ']');
    }

    return parseObject(keys, val, options);
};

var parse = function (str, opts) {
    var options = opts ? utils.assign({}, opts) : {};

    if (options.decoder !== null && options.decoder !== undefined && typeof options.decoder !== 'function') {
        throw new TypeError('Decoder has to be a function.');
    }

    options.ignoreQueryPrefix = options.ignoreQueryPrefix === true;
    options.delimiter = typeof options.delimiter === 'string' || utils.isRegExp(options.delimiter) ? options.delimiter : defaults$1.delimiter;
    options.depth = typeof options.depth === 'number' ? options.depth : defaults$1.depth;
    options.arrayLimit = typeof options.arrayLimit === 'number' ? options.arrayLimit : defaults$1.arrayLimit;
    options.parseArrays = options.parseArrays !== false;
    options.decoder = typeof options.decoder === 'function' ? options.decoder : defaults$1.decoder;
    options.allowDots = typeof options.allowDots === 'boolean' ? options.allowDots : defaults$1.allowDots;
    options.plainObjects = typeof options.plainObjects === 'boolean' ? options.plainObjects : defaults$1.plainObjects;
    options.allowPrototypes = typeof options.allowPrototypes === 'boolean' ? options.allowPrototypes : defaults$1.allowPrototypes;
    options.parameterLimit = typeof options.parameterLimit === 'number' ? options.parameterLimit : defaults$1.parameterLimit;
    options.strictNullHandling = typeof options.strictNullHandling === 'boolean' ? options.strictNullHandling : defaults$1.strictNullHandling;

    if (str === '' || str === null || typeof str === 'undefined') {
        return options.plainObjects ? Object.create(null) : {};
    }

    var tempObj = typeof str === 'string' ? parseValues(str, options) : str;
    var obj = options.plainObjects ? Object.create(null) : {};

    // Iterate over the keys and setup the new object

    var keys = Object.keys(tempObj);
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options);
        obj = utils.merge(obj, newObj, options);
    }

    return utils.compact(obj);
};

'use strict';





var lib = {
    formats: formats,
    parse: parse,
    stringify: stringify_1
};

/**
 * 管理应用窗口界面，实现窗口的逻辑控制管理操作
 * @module window
 */

// #region 辅助方法

/*
 * 构建 window id
 * @param {String} url url
 * @param {Object} ext 扩展参数
 */
function getId(url, ext) {
  let tmp = url.split('?');
  let opt = {};
  if (tmp.length > 1) {
    opt = mix(true, opt, lib.parse(tmp[tmp.length - 1]), ext);
  } else {
    opt = mix(true, opt, ext);
  }
  let _qs = lib.stringify(opt);
  if (_qs) {
    _qs = "?" + _qs;
  }
  return tmp[0] + _qs
}
/*
 * 组装 window url
 * @param {String} url url
 * @param {Object} ext 扩展参数
 * @param {String} id 页面id 
 */
function getUrl(url, ext, id) {
  let tmp = url.split('?');
  let opt = {};
  if (tmp.length > 1) {
    opt = mix(true, opt, lib.parse(tmp[tmp.length - 1]), ext);
  } else {
    opt = mix(true, opt, ext);
  }
  if (!id) {
    id = getId(url, ext);
  }
  opt = mix(true, opt, { id: id });
  let _qs = lib.stringify(opt);
  if (_qs) {
    _qs = "?" + _qs;
  }
  return { url: tmp[0] + _qs, id: id }
}


// #endregion

// #region 常量

// 默认打开窗口样式配置
const defaultWin = {
  scalable: false,
  bounce: '',
  plusrequire: "ahead",
  softinputMode: "adjustPan"
};
// 默认窗口显示配置
const defaultShow = {
  duration: os.ios ? 400 : 300,
  aniShow: 'slide-in-right'
};
// 默认窗口隐藏配置
const defaultHide = {
  duration: os.ios ? 600 : 450,
  aniHide: 'slide-out-right'
};
// #endregion

// #region 公共方法

/**
 * 设置自定义错误页面
 * @param {String} url - 错误页面路径，必须是本地路径（Hbuilder的）
 * @example <caption>设置错误页</caption>
 * // 路径，必须是本地路径（Hbuilder项目的）
 * this.plus.errorPage('/error.html')
 */
function errorPage(url) {
  defaultWin.errorPage = url;
  if (window.plus) {
    getWin().setStyle({ errorPage: url });
  }
}

/**
 * 创建新窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.create('login.html')
 */
function create(url = '', id = '', opts = { ext: {}, style: {} }) {
  let webview = null;
  if (!url) {
    return webview
  }
  if (!opts) {
    opts = { ext: {}, style: {} };
  }
  if (opts.ext) {
    opts.ext = {};
  }
  if (opts.style) {
    opts.style = {};
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, opts.ext);
    }
    webview = plus.webview.getWebviewById(id);
    if (!webview) {
      // 不存在
      webview = plus.webview.create(url, id, mix({}, defaultWin, opts.style), opts.ext);
    }
    return webview
  } else {
    return webview
  }
}

/**
 * 显示窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {Object} [opts] - 显示参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @example
 * // 根据id显示
 * this.plus.show('login')
 */
function show(w, opts = { loading: true, ani: {} }) {
  // export function show(w, opts = {}, showedCB = function () { }) {
  w = getWin(w);
  if (!w) {
    console.error('[show方法] 类型{String|window|WebviewObject}参数w不能为空!');
    return
  }
  if (!opts) {
    opts = { loading: true, ani: {} };
  }
  if (opts.ani) {
    opts.ani = {};
  }
  if (!isBoolean(opts.loading)) {
    opts.loading = true;
  }
  if (window.plus) {
    let isVisible = w.isVisible();
    let _Opt = mix({}, defaultShow, opts.ani);
    // if (!utils.isFunction(showedCB)) {
    //   showedCB = function () { }
    // }
    let _ishome = isHome(w);

    if (!isVisible) {
      // 窗口不可见（从没调用过show或hide了）
      if (opts.loading) {
        showWaiting();
        setTimeout(() => {
          // 设置系统状态栏背景颜色
          w.show(_Opt.aniShow, _Opt.duration, function () {
            // showedCB()
            closeWaiting();
          });
        }, defaultShow.duration);
      } else {
        setTimeout(() => {
          // 设置系统状态栏背景颜色
          w.show(_Opt.aniShow, _Opt.duration, function () {
            // showedCB()
          });
        }, defaultShow.duration);
      }
    } else {
      // 窗口可见（调用过show方法，即使被其它窗口挡住了也认为已显示）
      let topView = plus.webview.getTopWebview();
      let _wIsTop = topView.id === w.id;
      // 最顶层的是否home页
      let _topIsHome = isHome(topView);
      if (!_wIsTop) {
        // 窗口可见但不在最顶层
        if (_topIsHome) {
          // 最顶层的是home页
          hide(w, {
            aniHide: 'none'
          });
          if (opts.loading) {
            showWaiting();
            setTimeout(() => {
              // 设置系统状态栏背景颜色
              w.show(_Opt.aniShow, _Opt.duration, function () {
                // showedCB()
                closeWaiting();
              });
            }, defaultHide.duration);
          } else {
            setTimeout(() => {
              // 设置系统状态栏背景颜色
              w.show(_Opt.aniShow, _Opt.duration, function () {
                // showedCB()
              });
            }, defaultHide.duration);
          }
        } else {
          // 最顶层的不是home页并且w也不是是home页面
          w.showBehind(topView);
          if (opts.loading) {
            showWaiting();
            setTimeout(() => {
              // showedCB()
              closeWaiting();
            }, defaultHide.duration);
          } else {
            // setTimeout(() => {
            //   // showedCB()
            // }, defaultHide.duration)
          }
          hide(topView);
        }
      }
    }
  } else {
    console.log('[' + os.name + ']不支持show方法!');
    w.focus();
  }
}

/**
 * 隐藏窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {Object} [hideOpts] - 隐藏参数
 * @param {String} [hideOpts.aniHide='none'|'auto'] - 隐藏窗口的动画效果,非显示栈顶的窗口的默认值为'none'
 * @param {Number} [hideOpts.duration=300] - 隐藏窗口动画的持续时间
 * @example
 * // 根据id隐藏
 * this.plus.hide('login')
 */
function hide(w, hideOpts = {}) {
  w = getWin(w);
  if (!w) {
    console.error('[hide方法] 类型{String|window|WebviewObject}参数w不能为空!');
    return
  }
  if (window.plus) {
    // 首页不隐藏
    if (isHome(w)) {
      return
    }
    let _Opt = { duration: defaultHide.duration };
    if (hideOpts.duration || hideOpts.aniHide) {
      _Opt = mix({}, defaultHide, hideOpts);
    }
    let isTop = plus.webview.getTopWebview().id === w.id;
    if (!isTop) {
      w.hide("none", _Opt.duration);
    } else {
      w.hide(_Opt.aniHide || "auto", _Opt.duration);
    }
  } else {
    console.log('[' + os.name + ']不支持hide方法!');
    return
  }
}

/**
 * 关闭窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @param {*} [closeOpts] - 关闭参数
 * @param {String} [closeOpts.aniHide='none'|'auto'] - 关闭窗口的动画效果,非显示栈顶的窗口的默认值为'none'
 * @param {Number} [closeOpts.duration=300] - 关闭窗口动画的持续时间
 * @example
 * // 根据id关闭
 * this.plus.hide('login')
 */
function close(w, closeOpts = {}) {
  w = getWin(w);
  if (!w) {
    console.error('[close方法] 类型{String|window|WebviewObject}参数w不能为空!');
    return
  }
  if (window.plus) {
    let _cs = w.children(),
      fn = () => {
        for (var c of _cs) {
          close(c);
        }
      };
    w.addEventListener('onclose', fn);
    let _Opt = { duration: defaultHide.duration };
    if (closeOpts.duration || closeOpts.aniHide) {
      _Opt = mix({}, defaultHide, closeOpts);
    }

    let isTop = plus.webview.getTopWebview().id === w.id;
    if (!isTop) {
      w.close("none", _Opt.duration);
    } else {
      w.close(_Opt.aniHide || "auto", _Opt.duration);
    }
  } else {
    w.close();
  }
}

/**
 * 创建并打开新窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.open('login.html', "login", {
 *   ext: {
 *     uid: 121
 *   }
 * });
 */
function open(url = '', id = '', opts = { loading: true, ext: {}, ani: {}, style: {} }) {
  if (!url) {
    return null
  }
  if (window.plus) {
    if (!id) {
      id = getId(url, opts.ext);
    }
    let view = plus.webview.getWebviewById(id);
    if (!view) {
      // 不存在
      view = create(url, id, { ext: opts.ext, style: opts.style });
    } else {
      view.setStyle(opts.style);
    }
    show(view, { loading: opts.loading, ani: opts.ani });
    return view
  } else if (!os.plus) {
    // web，非web
    let _opt = getUrl(url, opts.ext, id);
    url = _opt.url;
    id = _opt.id;
    let views = [...mainWin.__all_wins];
    let view = views.find(function (item, index, arr) {
      return item.id === id;
    });
    if (!view) {
      view = window.open(url, '_blank');
    } else {
      show(view);
    }
    return view
  }
}

/**
 * 用浏览器打开url
 * @param {String} url - 页面地址
 * @example
 * this.plus.openBrowser('http://www.baidu.com');
 */
function openBrowser(url) {
  if (window.plus) {
    window.plus.runtime.openURL(encodeURI(url));
  } else {
    open(url);
  }
}

/**
 * 获取窗体
 * @param {String|window|WebviewObject} w - 窗体对象或窗体id
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * // 取得当前窗体
 * this.plus.getWin()
 * // 获取id为‘login’的窗体
 * this.plus.getWin('login')
 */
function getWin(w) {
  let win = null;
  if (window.plus) {
    if (isObject(w) && w.draw) {
      win = w;
    } else if (isString(w)) {
      win = plus.webview.getWebviewById(w);
    }
    if (!win) {
      win = plus.webview.currentWebview();
    }
  } else {
    if (isString(w)) {
      let views = [...mainWin.__all_wins];
      win = views.find(function (item, index, arr) {
        return item.id === w
      });
    } else if (isWindow(w)) {
      win = w;
    }
    if (!win) {
      win = window;
    }
  }
  return win
}

/**
 * 获取home窗体
 * @returns {window|WebviewObject} 窗体对象
 * @example
 * this.plus.getHomeWin()
 */
function getHomeWin() {
  if (window.plus) {
    return plus.webview.getLaunchWebview();
  } else {
    return window.mainWin
  }
}

/**
 * 到首页
 */
function goHome() {
  show(getHomeWin());
}

/**
 * 是否主页
 * @param {String|window|WebviewObject} w 
 * @returns {Boolean} 是不是主页
 */
function isHome(w) {
  w = getWin(w);
  if (!w) {
    return false
  }
  if (window.plus) {
    return w.id === window.plus.runtime.appid
  } else {
    return w.mainWin === window
  }
}

/**
 * 是否顶层窗口
 * @param {String|window|WebviewObject} w
 * @returns {Boolean} 是不是顶层窗口
 */
function isTop(w) {
  w = getWin(w);
  if (!w) {
    return false
  }
  if (window.plus) {
    let topView = plus.webview.getTopWebview();
    
  } else {
    return !(w.document.hidden || w.document.webkitHidden)
  }
}

/**
 * 创建并打开侧滑窗口
 * @param {String} url - 新窗口加载的HTML页面地址
 * @param {String} [id] - 新窗口的标识
 * @param {Object} [opts] - 参数
 * @param {Boolean} [opts.loading=true] - 是否显示loading等待效果
 * @param {Object} [opts.ani] - 显示窗口的动画
 * @param {String} [opts.ani.aniShow='slide-in-right'] - 显示窗口的动画效果
 * @param {Number} [opts.ani.duration=300] - 显示窗口动画的持续时间
 * @param {JSON} [opts.ext] - 创建窗口的额外扩展参数，设置扩展参数后可以直接通过窗口对象的点（“.”）操作符获取扩展参数属性值。
 * @param {Object} [opts.style] - 创建窗口的样式（如窗口宽、高、位置等信息），参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewStyles HTML5+ API}。
 * @returns {window|WebviewObject} 侧滑窗体对象
 * @example <caption>左侧滑菜单</caption>
 * this.plus.open('index.html', "menuLeft", {
 *   ani: { aniShow: "slide-in-left" },
 *   style: {
 *     right: "30%",
 *     width: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>右侧滑菜单</caption>
 * this.plus.open('index.html', "menuRight", {
 *   ani: { aniShow: "slide-in-right" },
 *   style: {
 *     left: "30%",
 *     width: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>底侧滑菜单</caption>
 * this.plus.open('index.html', "menuBottom", {
 *   ani: { aniShow: "slide-in-bottom" },
 *   style: {
 *     height: "30%",
 *     top: "70%",
 *     popGesture: "none"
 *   }
 * });
 * @example <caption>顶侧滑菜单</caption>
 * this.plus.open('index.html', "menuTop", {
 *   ani: { aniShow: "slide-in-top" },
 *   style: {
 *     height: "30%",
 *     bottom: "70%",
 *     popGesture: "none"
 *   }
 * });
 */
function menu(url = '', id = '', opts = { loading: true, ext: {}, ani: {}, style: {} }) {
  if (window.plus) {
    let w = getWin();
    let side = open(url, id, opts);
    side.addEventListener("close", function () {
      w.setStyle({ mask: "none" });
      side = null;
    }, false);
    side.addEventListener("hide", function () {
      w.setStyle({ mask: "none" });
    }, false);
    w.setStyle({ mask: "rgba(0,0,0,0.5)" });
    return side
  } else {
    return null
  }
}

/**
 * 当前Webview窗口的下拉刷新效果
 * @param {Object} [style={}]  Webview窗口下拉刷新样式，参考{@link http://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewRefreshStyles HTML5+ API}
 * @param {Function} [callback=()=>{}] Webview窗口下拉刷新事件回调,接收的参数为：结束Webview窗口的下拉刷新function
 * @example <caption>圆圈样式下拉刷新</caption>
 * this.plus.pullRefresh({
 *     support: true,
 *     color: "#2BD009",
 *     style: "circle",
 *     offset: "0px",
 *     range: "80px",
 *     height: "50px"
 *   }, function(end) {
 *     setTimeout(() => {
 *       end();
 *     }, 1000);
 *   }
 * );
 * @example <caption>经典下拉刷新样式（下拉拖动时页面内容跟随）</caption>
 * this.plus.pullRefresh({
 *     support: true,
 *     style: "default",
 *     range: "30px",
 *     height: "30px",
 *     contentdown: {
 *       caption: "下拉可以刷新"
 *     },
 *     contentover: {
 *       caption: "释放立即刷新"
 *     },
 *     contentrefresh: {
 *       caption: "正在刷新..."
 *     }
 *   }, function(end) {
 *     setTimeout(() => {
 *       end();
 *     }, 1000);
 *   }
 * );
 * @example <caption>关闭窗口的下拉刷新功能</caption>
 * this.plus.pullRefresh({ support: false });
 * this.plus.pullRefresh();
 */
function pullRefresh(style = {}, callback = () => { }) {
  let win = getWin();
  if (window.plus) {
    if (style && !!style.support && isFunction(callback)) {
      win.setPullToRefresh(style, function () {
        let end = () => {
          win.endPullToRefresh();
        };
        callback(end);
      });
    } else {
      win.setPullToRefresh(style);
    }
  }
}
/**
 * 当前Webview窗口的手动触发下拉刷新效果
 * 前提是设置了下拉刷新效果
 * @example <caption>关闭窗口的下拉刷新功能</caption>
 * this.plus.beginPullRefresh();
 */
function beginPullRefresh() {
  let win = getWin();
  if (window.plus) {
    win.beginPullToRefresh();
  }
}
// #endregion

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
function setStatusBarBackground(color) {
  let sixNumReg = /^#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})*$/gi;
  if (!sixNumReg.test(color)) {
    color = '';
  }
  if (color) {
    if (window.plus) {
      plus.navigator.setStatusBarBackground(color);
    } else {
      // document.title = color
    }
  }

}

/**
 * 1.执行后退
 * 2.添加删除后退执行前的操作
 * @module back
 */

let hooks = new Set();
let __back__first = null;
const endTime = 2000;

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
function addBack(hook) {
  if (hook) {
    if (!isNumber(hook)) {
      hook.index = 100;
    }
    if (isFunction(hook.act)) {
      hooks.add(hook);
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
function removeBack(hook) {
  if (hook) {
    hooks.delete(hook);
    return hook
  }
  return null
}

//遍历执行back的action
function acts() {
  let ret = true;
  if (hooks.size > 0) {
    let _hooks = [...hooks];
    console.log(getType(_hooks));
    _hooks.sort(function (a, b) {
      return a.index - b.index
    });
    ret = _hooks.every(function (hook, index) {
      // hook.act() 只要为false就中断后续钩子
      return hook.act() !== false
    });
  }
  return ret
}

const _fisthref = window.location.href;
/**
 * 执行后退（窗体后退，或安卓的后退按键）
 * @param {Boolean} forceBack - 是否强制退出
 * @example <caption>窗体后退</caption>
 * // 窗体后退
 * this.plus.back()
 */
function back(forceBack = false) {
  if (!forceBack) {
    if (!acts()) {
      return
    }
  }
  var wobj = getWin();
  if (window.plus) {
    if (wobj.parent()) {
      // 子窗体
      send('__backbutton', { wid: wobj.id, pid: this.parent.id }, { ids: [this.parent.id] });
    }
    wobj.canBack(e => {
      if (e.canBack) {
        window.history.back();
      } else {
        if (isHome(wobj)) {
          if (!__back__first) {
            __back__first = new Date().getTime();
            toast('再按一次退出应用');
            setTimeout(() => {
              __back__first = null;
            }, endTime);
          } else {
            if (new Date().getTime() - __back__first < endTime) {
              plus.runtime.quit();
            }
          }
        } else {
          close(wobj);
        }
      }
    });
  } else {
    if (_fisthref !== window.location.href && window.history.length > 1) {
      window.history.back();
    } else {
      if (isHome(wobj)) {
        if (wobj.confirm('是否退出应用？')) {
          close(wobj);
        }
      } else {
        close(wobj);
      }
    }
  }
}

// fixed


var _plus = Object.freeze({
	getType: getType,
	isString: isString,
	isNumber: isNumber,
	isBoolean: isBoolean,
	isRegExp: isRegExp,
	isFunction: isFunction,
	isDate: isDate,
	isArray: isArray,
	isWindow: isWindow,
	isObject: isObject,
	isPlainObject: isPlainObject,
	isURL: isURL,
	strBreak: strBreak,
	delHtmlTag: delHtmlTag,
	reversalColor: reversalColor,
	randomColor: randomColor,
	getStyle: getStyle,
	mix: mix,
	equals: equals,
	toFixed: toFixed,
	os: os,
	send: send,
	showWaiting: showWaiting,
	closeWaiting: closeWaiting,
	toast: toast,
	errorPage: errorPage,
	create: create,
	show: show,
	hide: hide,
	close: close,
	open: open,
	openBrowser: openBrowser,
	getWin: getWin,
	getHomeWin: getHomeWin,
	goHome: goHome,
	isHome: isHome,
	isTop: isTop,
	menu: menu,
	pullRefresh: pullRefresh,
	beginPullRefresh: beginPullRefresh,
	setStatusBarBackground: setStatusBarBackground,
	addBack: addBack,
	removeBack: removeBack,
	back: back
});

// lazy绑定
var vue;
// listen的集合
const _listens = new WeakMap();

// h5+插件扩展
const plusExtend = {
  created: function () {
    if (!vue) {
      console.warn('[h5 plus] not installed!');
    }
  },
  mounted: function () {
    this.init();
  },
  methods: {
    /**
     * 初始化
     */
    init: function () {
      var self = this;
      /**
       * 扩展的组件选项
       */
      let plusready = this.$options.load && this.$options.load.plus;
      let ready = this.$options.load && this.$options.load.dom;
      let listener = this.$options.listener;
      if (ready && isFunction(ready)) {
        onload(ready, self);
      }
      /**
       * 设备的加载完成
       */
      if (plusready && isFunction(plusready)) {
        onplusload(plusready, self);
      }
      /**
       * 事件监听
       */
      if (listener) {
        let _ls = Object.keys(listener);
        for (let index = 0; index < _ls.length; index++) {
          const _l = _ls[index];
          const _lf = listener[_l];
          if (isFunction(_lf)) {
            if (!_listens.get(_lf)) {
              _listens.set(_lf, true);
              if (os.plus) {
                // 设备
                document.addEventListener(_l, function (e) {
                  _lf.call(self, e);
                });
              } else {
                // 非设备:基本上是给调试用的
                window.addEventListener('message', function (e) {
                  if (e.data && e.data.name === _l) {
                    _lf.call(self, { "detail": e.data.data || {} });
                  }
                }, false);
              }
            }
          }
        }
      }
    }
  }
};

// Dom加载完成
function onload(callback, vm = null) {
  let readyRE = /complete|loaded|interactive/;
  if (readyRE.test(document.readyState)) {
    if (vm) {
      callback.call(vm);
    } else {
      callback();
    }
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      if (vm) {
        callback.call(vm);
      } else {
        callback();
      }
    }, false);
  }
  return this
}

// 设备的加载完成
function onplusload(callback, vm = null) {
  if (window.plus) {
    // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
    setTimeout(() => {
      if (vm) {
        callback.call(vm);
      } else {
        callback();
      }

    }, 16.7);
  } else {
    // 修复：手机app中会调用2次的bug，window.plus改为os.plus
    if (os.plus) {
      document.addEventListener('plusready', function () {
        if (vm) {
          callback.call(vm);
        } else {
          callback();
        }
      }, false);
    } else {
      if (vm) {
        onload(callback, vm);
      } else {
        onload(callback);
      }
    }
  }
}



/**
 * 非设备环境模拟H5+
 * 1.模拟window的id和参数
 * 2.构建全部窗体列表为模拟通知使用
 */
(function () {
  onplusload(function () {
    window.plus && window.plus.key.addEventListener('backbutton', back, false);
    if (os.plus) {
      // 设备
      document.addEventListener('__backbutton', function (e) {
        back();
      });
    } else {
      // 非设备:基本上是给调试用的
      window.addEventListener('message', function (e) {
        if (e.data && e.data.name === '__backbutton') {
          back();
        }
      }, false);
    }

  });
  if (!os.plus) {
    window.id = 'index';
    let tmp = window.location.href.split('?');
    let extras = null;
    if (tmp.length > 1) {
      extras = lib.parse(window.location.href.replace(tmp[0] + "?", ''));
      mix(true, window, extras);
    }
    if (!window.mainWin) {
      let mainWin = window;
      while (mainWin.opener) {
        mainWin = mainWin.opener;
        mainWin.mainWin && (mainWin = mainWin.mainWin);
      }
      window.mainWin = mainWin;
      if (!window.mainWin.__all_wins) {
        window.mainWin.__all_wins = new Set();
        window.mainWin.__all_wins.add(mainWin);
      }
    }
    window.mainWin.__all_wins.add(window);
    let _isHome = isHome();
    if (_isHome) {
      console.warn('[web调试模式(非设备)] 当前是首页，手动刷新本页会影响已有窗体的通知失效。');
    }
    window.onbeforeunload = function () {
      if (!_isHome) {
        window.mainWin.__all_wins.delete(window);
      }
    };
  }
})();

// 安装插件
const h5plus = {
  install(Vue, options) {
    vue = Vue;
    Vue.mixin(plusExtend);
    let __plus = mix(true, {}, _plus);
    if (options) {
      if (options.errorPage && isString(options.errorPage)) {
        errorPage(options.errorPage);
        delete options.errorPage;
      }
      for (var p in options) {
        // 删除类型不一致的属性
        if (_plus[p] && getType(_plus[p]) !== getType(options[p])) {
          delete options[p];
        }
      }
      mix(true, __plus, options);
    }
    Vue.prototype.plus = __plus;
  }
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(h5plus);
}

module.exports = h5plus;
