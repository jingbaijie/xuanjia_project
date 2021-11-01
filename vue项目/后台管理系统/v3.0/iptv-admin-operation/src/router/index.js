/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-04-14 18:58:36
 * @LastEditors: jwzx
 * @LastEditTime: 2021-04-22 19:37:40
 */
import Vue from "vue";
import Router from "vue-router";
import { Notification, Message } from "element-ui";
import routers from "./routers";
Vue.use(Router);
/**
     * 全局路由守卫
     * 1、判断用户是否登录
     * 2、token 是否过期 
     * 3、如果过期 自动重定向到 首页 登录界面
     * 4、判断路径是否正确
     * to:      跳转路由对象
     * from:    当前跳转路由对象
     * next: Function: 一定要调用该方法来 resolve 这个钩子。执行效果依赖 next 方法的调用参数。
        next(): 进行管道中的下一个钩子。如果全部钩子执行完了，则导航的状态就是 confirmed (确认的)。
        next(false): 中断当前的导航。如果浏览器的 URL 改变了 (可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
        next('/') 或者 next({ path: '/' }): 跳转到一个不同的地址。当前的导航被中断，然后进行一个新的导航。你可以向 next 传递任意位置对象，且允许设置诸如 replace: true、name: 'home' 之类的选项以及任何用在 router-link 的 to prop 或 router.push 中的选项。
        next(error): (2.4.0+) 如果传入 next 的参数是一个 Error 实例，则导航会被终止且该错误会被传递给 router.onError() 注册过的回调。
     */

let tipTime = true;
let tipRelogin = true;
const router = new Router({
    base: "/" + window.location.href.match(/\/([a-zA-Z0-9\.\:\_\-]*\/)*/)[1],
    mode: "history",
    scrollBehavior: () => ({
        // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
        y: 0
    }),
    routes: routers
});

router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("token");
    if (to.name == "Login") {
        //如果跳登录直接next跳转
        next();
    } else {
        if (token) {
            //如果token存在直接next跳转目标组件
            next();
        } else {
            //如果token不存在重定向到登录页
            next({
                path: "/login"
            }); // 否则全部重定向到登录页
        }
    }
});
router.afterEach((to, from) => {
    window.scrollTo(0, 0);
});
export default router;