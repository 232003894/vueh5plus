/**
 * 原生扩展
 * @module native.Extend
 */

import { os } from "./os.js"

/**
 * 写入剪贴板（复制）
 * @param {String} txt='' - 复制的字符串
 * @example
 * this.plus.copyToClip("复制的字符串");
 */
export function copyToClip(txt = "") {
  if (window.plus) {
    let clip
    if (os.android) {
      var Context = window.plus.android.importClass("android.content.Context")
      var main = window.plus.android.runtimeMainActivity()
      clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
      window.plus.android.invoke(clip, "setText", txt)
      // plus.android.invoke(clip,"getText");
    } else if (os.ios) {
      var UIPasteboard = window.plus.ios.importClass("UIPasteboard")
      clip = UIPasteboard.generalPasteboard()
      // clip.setValueforPasteboardType(txt, "public.utf8-plain-text")
      clip.plusCallMethod({
        setValue: txt,
        forPasteboardType: "public.utf8-plain-text"
      })
    }
  } else {
    console.log("[" + os.name + "]不支持native的copyToClip方法!")
    // return false
  }
}

/**
 * 读取剪贴板
 * @returns {String} 剪贴板内容
 * @example
 * this.plus.getFromClip();
 */
export function readFromClip() {
  if (window.plus) {
    let clip
    if (os.android) {
      var Context = window.plus.android.importClass("android.content.Context")
      var main = window.plus.android.runtimeMainActivity()
      clip = main.getSystemService(Context.CLIPBOARD_SERVICE)
      return window.plus.android.invoke(clip, "getText")
    } else if (os.ios) {
      var UIPasteboard = window.plus.ios.importClass("UIPasteboard")
      clip = UIPasteboard.generalPasteboard()
      // clip.plusCallMethod({valueForPasteboardType:"public.utf8-plain-text"});
      return clip.valueForPasteboardType("public.utf8-plain-text")
    }
  } else {
    console.log("[" + os.name + "]不支持native的readFromClip方法!")
    return ""
    // return false
  }
}
