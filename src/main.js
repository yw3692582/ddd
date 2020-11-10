// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { setInterval, clearInterval } from 'timers'
 
//样式
import axios from 'axios'
import qs from 'qs'
import App from './App'
import router from './router'
import './icons'
import store from './store'
 
Vue.config.productionTip = false

Vue.prototype.$ajax=axios
Vue.prototype.$ajax.defaults.baseURL='http://121.36.193.217:10022'
Vue.prototype.$qs=qs
// 全局设置超时的时间
Vue.prototype.$ajax.defaults.timeout = 6000
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
