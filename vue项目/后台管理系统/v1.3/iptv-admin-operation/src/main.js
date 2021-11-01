/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-14 18:58:36
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-06-09 12:01:49
 */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import _ from 'vue-underscore'
import './style/index.styl'
import 'element-ui/lib/theme-chalk/index.css'
import './style/animation.styl'
import './common/directives.js';
import VueI18n from 'vue-i18n'
import languageDataList from './locale'
import { $getLanguage, isAuth } from './utils'
import VueParticles from 'vue-particles'  
Vue.use(VueParticles)
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(_)
Vue.use(VueI18n)
Vue.use(ElementUI)
Vue.config.productionTip = false
import moment from 'moment'//导入文件 

Vue.prototype.$moment = moment;//赋值使用
var i18n = new VueI18n({
  locale: localStorage.getItem('language')||'zh', //这里看本地是否设置过，不存在就使用中文
  messages: {
    'zh': require('./assets/i18n/zh-CN'),
    'en': require('./assets/i18n/en-US')
  }
})
String.prototype.replaceAll = function (f, e) {
  var reg = new RegExp(f, "g");
  return this.replace(reg, e);
}

// 挂载全局权限鉴权方法
Vue.prototype.isAuth = isAuth

/* 去除img标签冒泡事件 */
document.getElementsByTagName('img').onmousedown = function (e) {
  e.preventDefault()
}

// 自动设置语言
// for (let i = 0; i < languageDataList.length; i++) {
//   Vue.i18n.add(languageDataList[i].language, languageDataList[i].data)
// }
// Vue.i18n.set($getLanguage())

// var i18n = new VueI18n({
//   locale: localStorage.getItem('language') || 'en', //这里看本地是否设置过，不存在就使用英文 en
//   messages,
// })
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
