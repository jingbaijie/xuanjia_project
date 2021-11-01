import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const routes = [{
        path: "*",
        redirect: "/home",
    },
    {
        name: "home",
        component: () =>
            import ("./view/home"), //首页
        meta: {
            title: "小海贝视听平台主页",
        },
    },
    {
        name: "videoDetails",
        component: () =>
            import ("./view/home/videoDetails"), //手机详情页
        meta: {
            title: "手机详情页",
        },
    },
    {
        name: "search",
        component: () =>
            import ("./view/details/search"), //搜索页
        meta: {
            title: "小海贝视听搜索页",
        },
    },
    {
        name: "contentAll",
        component: () =>
            import ("./view/details/contentAll"), //全部内容
        meta: {
            title: "小海贝视听全部内容页",
        },
    },

    {
        name: "personalCenter",
        component: () =>
            import ("./view/personalCenter/index"), //个人中心
        meta: {
            title: "小海贝视听个人中心页",
        },
    },
    {
        name: "login",
        component: () =>
            import ("./view/login/index"), //登录
        meta: {
            title: "小海贝视听登录页",
        },
    },{
        name: "juveniles",
        component: () =>
            import ("./view/home/juveniles"), //未成年监护工程
        meta: {
            title: "未成年监护工程页",
        },
    },
];

// add route path
routes.forEach((route) => {
    route.path = route.path || "/" + (route.name || "");
});

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }
    next();
});

export { router };