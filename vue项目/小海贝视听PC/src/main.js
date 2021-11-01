// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import "babel-polyfill"
import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import App from './App'
import router from './router'
import store from './store'
import 'lib-flexible'
import ElementUI from 'element-ui'



Vue.config.productionTip = false
// if(store.state.isLogin){
// store.state.isLogin=false;
if(sessionStorage.getItem('userInfo')){
  store.commit('sessionChangeState')
}
router.beforeEach((to, from, next) => {
  // 让页面回到顶部
  document.documentElement.scrollTop = 0;
  document.title = '小海贝';
  next()
})
// }
Vue.use(ElementUI)
Vue.use(VueVideoPlayer)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
