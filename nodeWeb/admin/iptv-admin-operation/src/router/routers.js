/***
 *  路由组件挂载
 */

const entry = {
  login: () => import('@/components/entry/loginPage'),
  // loginBefore: () => import('@/components/entry/loginBefore'),
  // register: () => import('@/components/entry/register'),
  // forgetPassword: () => import('@/components/entry/forgetPassword'),
  // modifyPassword: () => import('@/components/entry/modifyPassword'),
}
const home = {
  homePage: () => import('@/components/layout/homePage'),
  masterPage: () => import('@/components/layout/masterPage'),
  navBar: () => import('@/components/layout/navBar'),
  headerBar: () => import('@/components/layout/headerBar')
}
//系统权限管理模块
const system = {
  menuList: () => import('@/components/views/system/menu/menuList'),
  roleList: () => import('@/components/views/system/role/roleList'),
  userList: () => import('@/components/views/system/user/userList'),
}

const table = {
  imageList: () => import('@/components/views/image/imageList'),
  giftList: () => import('@/components/views/prize/giftList'),
  cpDetailList: () => import('@/components/views/cpsp/cpDetailList'),
  classifyList: () => import('@/components/views/classification/classifyList'),
  labelList: () => import('@/components/views/label/labelList'),
  programList: () => import('@/components/views/program/programList'),
  gameList: () => import('@/components/views/game/gameList'),
  blackList: () => import('@/components/views/black/blackList'),
  parameterList: () => import('@/components/views/parameter/parameterList'),
  templateManage: () => import('@/components/views/templates/templateManage'),
  dictionaryList: () => import('@/components/views/dictionary/dictionaryList'),
  theme: () => import('@/components/views/theme/'),
  voucher: () => import('@/components/views/voucher/'),
  indexPage: () => import('@/components/views/indexPage/'),
  cpspInfo: () => import('@/components/views/cpsp/cpspInfo/'),
  cpspRecommend: () => import('@/components/views/cpsp/cpspRecommend/'),

}
const STB = {
  portal: () => import('@/components/views/portal'),
  version: () => import('@/components/views/version'),
  upgrade: () => import('@/components/views/upgrade'),
  factory: () => import('@/components/views/factory'),
  device: () => import('@/components/views/device'),
  startUpgrade: () => import('@/components/views/version/startUpgrade.vue')
}
const activeTemplate = {
  activeParent: () => import('@/components/views/activity/activeParent'),
  activeView: () => import('@/components/views/activity/activeView'),
}
const specialTemplate = {
  templateParent: () => import('@/components/views/special/specialParent'),
  templateList: () => import('@/components/views/special/templateList'),
  createFrame: () => import('@/components/views/special/createFrame'),
  templateInfo: () => import('@/components/views/special/templateThemeInfo'),
  recommendList: () => import('@/components/views/special/recomConfigList'),
  recommendDetail: () => import('@/components/views/special/recomConfigDetail'),
}
const recommendTemplate = {
  templateParent: () => import('@/components/views/recommend/recommendParent'),
  templateList: () => import('@/components/views/recommend/templateList'),
  createFrame: () => import('@/components/views/recommend/createFrame'),
  templateInfo: () => import('@/components/views/recommend/templateThemeInfo'),
  recommendList: () => import('@/components/views/recommend/recomConfigList'),
  recommendDetail: () => import('@/components/views/recommend/recomConfigDetail'),
}

const cpspRecommend = {
  templateParent: () => import('@/components/views/cpRecommend/templateParent'),
  templateList: () => import('@/components/views/cpRecommend/templateList'),
  createFrame: () => import('@/components/views/cpRecommend/createFrame'),
  templateInfo: () => import('@/components/views/cpRecommend/templateThemeInfo'),
  recommendList: () => import('@/components/views/cpRecommend/recomConfigList'),
  recommendDetail: () => import('@/components/views/cpRecommend/recomConfigDetail'),
}

export default [{
    path: '*',
    meta: {
      error: 1
    },
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: entry.login,
    meta: {
      cache: false
    },
    children: []
  },
  {
    path: '/homePage',
    name: 'Home',
    component: home.homePage,
    children: [{
      path: '/masterPage',
      name: 'masterPage',
      meta: {
        cache: false
      },
      component: home.masterPage,
      children: [{
          path: '/menuList',
          name: 'menuList',
          meta: {
            cache: true
          },
          component: system.menuList,
        },
        {
          path: '/roleList',
          name: 'roleList',
          meta: {
            cache: true
          },
          component: system.roleList
        },
        {
          path: '/userList',
          name: 'userList',
          meta: {
            cache: true
          },
          component: system.userList
        },
        {
          path: '/portal',
          name: 'portal',
          meta: {
            cache: true
          },
          component: STB.portal
        },
        {
          path: '/version',
          name: 'version',
          meta: {
            cache: true
          },
          component: STB.version
        },
        {
          path: '/startUpgrade',
          name: 'startUpgrade',
          component: STB.startUpgrade
        },
        {
          path: '/factory',
          name: 'factory',
          meta: {
            cache: true
          },
          component: STB.factory
        },
        {
          path: '/upgrade',
          name: 'upgrade',
          meta: {
            cache: true
          },
          component: STB.upgrade
        },
        {
          path: '/device',
          name: 'device',
          meta: {
            cache: true
          },
          component: STB.device
        },
        {
          //专题管理路由
          path: '/specialParent',
          name: 'specialParent',
          meta: {
            cache: true
          },
          component: specialTemplate.templateParent
        },
        {
          //推荐管理路由
          path: '/recommendParent',
          name: 'recommendParent',
          meta: {
            cache: true
          },
          component: recommendTemplate.templateParent,
        },
        {
          //活动管理路由
          path: '/activeParent',
          name: 'activeParent',
          meta: {
            cache: true
          },
          component: activeTemplate.activeParent
        },
        {
          //CPSP推荐管理
          path: '/cpspRecommendParent',
          name: 'cpspRecommend',
          meta: {
            cache: true
          },
          component: cpspRecommend.templateParent
        },
        {
          path: '/cpspInfo',
          name: 'cpspInfo',
          meta: {
            cache: true
          },
          component: table.cpspInfo
        },
        {
          path: '/imageList',
          name: 'imageList',
          meta: {
            cache: true
          },
          component: table.imageList
        },
        {
          path: '/giftList',
          name: 'giftList',
          meta: {
            cache: true
          },
          component: table.giftList
        },
        {
          path: '/cpDetailList',
          name: 'cpDetailList',
          meta: {
            cache: true
          },
          component: table.cpDetailList
        },
        {
          path: '/classifyList',
          name: 'classifyList',
          meta: {
            cache: true
          },
          component: table.classifyList
        },
        {
          path: '/labelList',
          name: 'labelList',
          meta: {
            cache: true
          },
          component: table.labelList
        },
        {
          path: '/programList',
          name: 'programList',
          meta: {
            cache: true
          },
          component: table.programList
        },
        {
          path: '/gameList',
          name: 'gameList',
          meta: {
            cache: true
          },
          component: table.gameList
        },
        {
          path: '/blackList',
          name: 'blackList',
          meta: {
            cache: true
          },
          component: table.blackList
        },
        {
          path: '/parameterList',
          name: 'parameterList',
          meta: {
            cache: true
          },
          component: table.parameterList
        },
        {
          path: '/templateManage',
          name: 'templateManage',
          meta: {
            cache: true
          },
          component: table.templateManage
        },
        {
          path: '/dictionaryList',
          name: 'dictionaryList',
          meta: {
            cache: true
          },
          component: table.dictionaryList
        },
        {
          path: '/theme',
          name: 'theme',
          meta: {
            cache: true
          },
          component: table.theme
        },
        {
          path: '/voucher',
          name: 'voucher',
          meta: {
            cache: true
          },
          component: table.voucher
        },
        {
          path: '/indexPage',
          name: 'indexPage',
          meta: {
            cache: true
          },
          component: table.indexPage
        }
      ]
    }]
  }
]
