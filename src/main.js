import Vue from 'vue'
Vue.config.productionTip = false
import App from './App.vue'
import plus from './lib'
Vue.use(plus)
new Vue({
  el: '#app',
  render: h => h(App)
})
