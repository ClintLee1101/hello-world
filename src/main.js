// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'


import router from './router'

// 引入并使用vue-resource网络请求模块
import VueResource from 'vue-resource'
// import jQuery from 'jquery'
Vue.use(VueResource)


// Vue.use(config)
// Vue.use(jQuery)
Vue.config.productionTip = false
// Vue.config.debug = true
//import './assets/common.css';
import FastClick from 'fastclick';

// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', function() {
//     FastClick.attach(document.body);
//   }, false);
// }
/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  render: h => h(App)
  // template: '<App/>',
  // components: { App }
})
