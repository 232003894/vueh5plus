/**
 * 跨webView广播通知
 * @module broadcast
 */

/**
 * 广播通知
 * @param {String} name - 事件名称
 * @param {Object} [data={}] - 事件数据
 * @param {Object} [opts] - 需要通知的窗体参数
 * @param {Bollean} [opts.self=false] - 是否通知自己<br>false:不通知自己
 * @param {Array} [opts.ids=[]] - 指定通知的窗体id集合<br>[]:通知所有窗体
 */
export function send(name, data = {}, { self = false, ids = [] } = {}) {
    if (window.plus) {
        // 设备的情况
        let views = plus.webview.all()
        if (ids.length > 0) {
            views = []
            for (let id of ids) {
                let view = plus.webview.getWebviewById(id)
                view && views.push(view)
            }
        }
        let _indexID = plus.webview.currentWebview().id
        for (let v of views) {
            //跳过自己
            if (v.id == _indexID && !self) {
                continue
            }
            if (!data) {
                data = {}
            }
            v.evalJS(`document.dispatchEvent(new CustomEvent('${name}', {
                detail:JSON.parse('${JSON.stringify(data)}'),
                bubbles: true,
                cancelable: true
            }));`)
        }
    }
    else {
        // 非设备:基本上是给调试用的
        let views = [...mainWin.__all_wins]
        let viewsAll = [...mainWin.__all_wins]
        if (ids.length > 0) {
            views = []
            for (let id of ids) {
                let view = viewsAll.find(function (item, index, arr) {
                    return item.id === id;
                })
                view && views.push(view)
            }
        }
        let _indexID = window.id
        for (let v of views) {
            //跳过自己
            if (v.id == _indexID && !self) {
                continue
            }
            // console.log('send')
            v.postMessage({
                name: name,
                data: data
            }, window.location.origin)
        }
    }

}