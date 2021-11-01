/*
 * @Author: your name
 * @Date: 2021-08-31 14:00:45
 * @LastEditTime: 2021-09-08 09:40:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \tvjoy-web\src\router\routes.js
 */
// 路由组件内容
const home = {
  homePage: () => import('@/components/pages/homePage')
}
const mainPage = {
  mainPage: () => import('@/components/pages/mainPage')
}
const login = {
  loginPage: () => import('@/components/pages/loginPage')
}
const agreement = {
  agreement: () => import('@/components/pages/agreement')
}
const allContent = {
  allContent: () => import('@/components/pages/allContent')
}
const personalCenter = {
  personalCenter: () => import('@/components/pages/personalCenter')
}
const videoDetail = {
  videoDetail: () => import('@/components/pages/videoDetail')
}
const search = {
  search: ()=>import('@/components/pages/search')
}
//中转页
const white = {
  white:()=>import('@/components/common/white')
}
//未成年监护
const underAge = {
  underAge:()=>import('@/components/pages/underAge')
}
//隐私政策
const privated = {
  private:()=>import('@/components/pages/private')
}
export default [
  {
    path: '*',
    meta: {
      error: 1
    },
    redirect: '/home'
  },
  {
    path: '/agreement',
    name: 'agreement',
    component: agreement.agreement,
    meta: {}
  },
  {
    path: '/private',
    name: 'private',
    component: privated.private,
    meta: {}
  },
  {
    path: '/home',
    name: 'home',
    component: home.homePage,
    meta: {
      cache: false,
      title: '小海贝视听'
    },
    children: [
      {
        path: '/mainPage',
        name: 'mainPage',
        component: mainPage.mainPage,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path: '/loginPage',
        name: 'loginPage',
        component: login.loginPage,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path: '/allContent',
        name: 'allContent',
        component: allContent.allContent,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path: '/personalCenter',
        name: 'personalCenter',
        component: personalCenter.personalCenter,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path: '/videoDetail',
        name: 'videoDetail',
        component: videoDetail.videoDetail,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path: '/search',
        name: 'search',
        component: search.search,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path:'/underAge',
        name:'underAge',
        component:underAge.underAge,
        meta: {
          title: '小海贝视听'
        }
      },
      {
        path:'/white',
        name:'white',
        component:white.white,
        meta: {
          title: '小海贝视听'
        }
      }
    ]
  }
]
