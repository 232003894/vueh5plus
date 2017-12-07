import Vue from 'vue'
Vue.config.productionTip = false
import App from './App.vue'
// import plus from './lib'
import plus from '../vue-h5plus.esm.js'
Vue.use(plus, {
  errorPage: '/error.html'
})
new Vue({
  el: '#app',
  render: h => h(App)
})
