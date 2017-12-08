import Vue from 'vue'
Vue.config.productionTip = false
import App from './App.vue'
import plus from './lib'
// import plus from '../vue-h5plus.common.js'
Vue.use(plus, {
  errorPage: '/error.html',
  // 重写库中的toast方法
  toast(msg) {
    alert(msg)
  },
  // 扩展方法
  log(info) {
    console.log(info)
  }
})
new Vue({
  el: '#app',
  render: h => h(App)
})
