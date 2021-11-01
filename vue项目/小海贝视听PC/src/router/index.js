/*
 * @Author: your name
 * @Date: 2021-09-01 11:05:57
 * @LastEditTime: 2021-09-06 16:05:53
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'

Vue.use(Router)

//获取原型对象上的push函数
const originalPush = Router.prototype.push
//修改原型对象中的push方法
Router.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

export default new Router({
  routes: routes
})
