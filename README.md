# vue-h5-plus

> `H5Plus Extend for Vue.js`

> 包含了 babel-polyfill（所以文件大点，但是省事些） [[支持的特性]](https://github.com/zloirock/core-js#core-js)


## 安装
``` bash
npm install vue-h5-plus
```

## 基本使用

``` javascript
import Vue from 'vue'
import plus from 'vue-h5-plus'
Vue.use(plus)
```

### 组件选项
> `其方法中的this指向组件`

#### - load选项
`在组件选项中,用于处理加载完成的事件`
1. dom函数：等同于window.onload
1. plus函数：设备加载完成的处理


#### - listener选项
`用于监听自定义的事件广播`

#### 实例扩展plus对象  [查看文档](https://232003894.github.io/vueh5plus/index.html)
> `实例对象中扩展plus属性对象，plus中有许多静态方法，可以在Modules中查看`

### 示例

```javascript
export default {
  name: "app",
  // 加载选项
  load: {
    // 相当于window.onload
    dom() {
      console.log("test组件 Dom加载完成");
    },
    // plusready，设备加载完成
    plus() {
      console.log("test组件 设备加载完成");
    }
  },
  // 监听选项
  listener: {
    // “customEvent”为事件名称
    customEvent(e) {
      // e.detail：事件传递的数据
      alert("test:" + JSON.stringify(e.detail));
    }
  },
  methods: {
    // 广播消息
    send: function() {
      this.plus.send("customEvent", { a: 1 }, { self: true });
    }
  }
};
```


## 自定义扩展

``` javascript
import Vue from 'vue'
import plus from 'vue-h5-plus'
Vue.use(plus, {
  // 全局指定hbuild的错误页地址
  errorPage: '/error.html',
  // 重写库中的toast方法
  toast(msg){
    alert(msg)
  },
  // 扩展方法
  log(info){
    console.log(info)
  }
})
```



## [文档](https://232003894.github.io/vueh5plus/index.html)

## 参考
1. 多页模板 [[git]](https://github.com/232003894/vue-webpack-pages)
1. webpack [[中文]](https://doc.webpack-china.org/concepts/)
1. vue-loader [[中文]](https://vue-loader.vuejs.org/zh-cn/)