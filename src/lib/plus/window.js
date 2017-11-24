import {
  os
} from './os.js'
import * as utils from '../common/utils'

import qs from 'qs'
import { debug } from 'util';

/**
 * 打开新页面
 * @param {*} url 
 * @param {*} id 页面id 
 * @param {*} extras 
 * @param {*} styles 
 */
export function open(url = '', id = '', extras = {}, styles = {}) {
  if (!url) {
    return null
  }
  if (!id) {
    id = url
  }
  if (os.plus) {
    // 设备
  } else {
    // web，非web
    let tmp = url.split('?')
    if (tmp.length > 1) {
      extras = utils.mix(true, qs.parse(tmp[tmp.length - 1]), extras, { id: id })
    } else {
      extras = utils.mix(true, extras, { id: id })
    }
    let _qs = qs.stringify(extras)
    if (_qs) {
      _qs = "?" + _qs
    }
    url = tmp[0] + _qs

    let views = [...mainWin.__all_wins]
    let view = views.find(function (item, index, arr) {
      return item.id === id;
    })
    if (!view) {
      window.open(url, '_blank')
    } else {
      view.focus()
    }
  }


  // opts = opts || {}
  // opts.extras = opts.extras || {}

  // var newWin = window.open(url, '_blank')
  // newWin.id = id
  // utils.mix(true, newWin, baseSearch, opts.extras)
  // if (_wins.every((_w) => {
  //     return _w !== newWin
  //   })) {
  //   _wins.push(newWin)
  // }
  // return newWin
}