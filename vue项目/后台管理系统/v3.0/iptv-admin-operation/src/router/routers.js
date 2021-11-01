/***
 *  路由组件挂载
 */

const entry = {
    login: () =>
        import ("@/components/entry/loginPage")
        // loginBefore: () => import('@/components/entry/loginBefore'),
        // register: () => import('@/components/entry/register'),
        // forgetPassword: () => import('@/components/entry/forgetPassword'),
        // modifyPassword: () => import('@/components/entry/modifyPassword'),
};
const home = {
    homePage: () =>
        import ("@/components/layout/homePage"),
    masterPage: () =>
        import ("@/components/layout/masterPage"),
    navBar: () =>
        import ("@/components/layout/navBar"),
    headerBar: () =>
        import ("@/components/layout/headerBar")
};
//系统权限管理模块
const system = {
    menuList: () =>
        import ("@/components/views/system/menu/menuList"),
    roleList: () =>
        import ("@/components/views/system/role/roleList"),
    userList: () =>
        import ("@/components/views/system/user/userList"),
    headPortrait: () =>
        import ("@/components/views/headPortrait")
};

const table = {
    imageList: () =>
        import ("@/components/views/image/imageList"),
    giftList: () =>
        import ("@/components/views/prize/giftList"),
    cpDetailList: () =>
        import ("@/components/views/cpsp/cpDetailList"),
    classifyList: () =>
        import ("@/components/views/classification/classifyList"),
    labelList: () =>
        import ("@/components/views/label/labelList"),
    programList: () =>
        import ("@/components/views/program/programList"),
    gameList: () =>
        import ("@/components/views/game/gameList"),
    blackList: () =>
        import ("@/components/views/black/blackList"),
    parameterList: () =>
        import ("@/components/views/parameter/parameterList"),
    templateManage: () =>
        import ("@/components/views/templates/templateManage"),
    dictionaryList: () =>
        import ("@/components/views/dictionary/dictionaryList"),
    theme: () =>
        import ("@/components/views/theme/"),
    voucher: () =>
        import ("@/components/views/voucher/"),
    indexPage: () =>
        import ("@/components/views/indexPage/"),
    cpspInfo: () =>
        import ("@/components/views/cpsp/cpspInfo/"),
    cpspRecommend: () =>
        import ("@/components/views/cpsp/cpspRecommend/")
};
const STB = {
    portal: () =>
        import ("@/components/views/portal"),
    version: () =>
        import ("@/components/views/version"),
    upgrade: () =>
        import ("@/components/views/upgrade"),
    factory: () =>
        import ("@/components/views/factory"),
    device: () =>
        import ("@/components/views/device"),
    startUpgrade: () =>
        import ("@/components/views/version/startUpgrade.vue")
};
const activeTemplate = {
    activeParent: () =>
        import ("@/components/views/activity/activeParent"),
    activeView: () =>
        import ("@/components/views/activity/activeView")
};
const specialTemplate = {
    specialParent: () =>
        import ("@/components/views/special/specialParent"),
    modelList: () =>
        import ("@/components/views/special/modelList"),
    addSpecialForm: () =>
        import ("@/components/views/special/addSpecialForm")
};

const specialIssue = {
    specialIssueParent: () =>
        import ("@/components/views/specialIssue/specialIssueParent"),
    issueList: () =>
        import ("@/components/views/specialIssue/issueList"),
    addIssueForm: () =>
        import ("@/components/views/specialIssue/addIssueForm")
};

const recommendTemplate = {
    templateParent: () =>
        import ("@/components/views/recommend/recommendParent"),
    templateList: () =>
        import ("@/components/views/recommend/templateList"),
    createFrame: () =>
        import ("@/components/views/recommend/createFrame"),
    templateInfo: () =>
        import ("@/components/views/recommend/templateThemeInfo"),
    recommendList: () =>
        import ("@/components/views/recommend/recomConfigList"),
    recommendDetail: () =>
        import ("@/components/views/recommend/recomConfigDetail")
};

const cpspRecommend = {
    templateParent: () =>
        import ("@/components/views/cpRecommend/templateParent"),
    templateList: () =>
        import ("@/components/views/cpRecommend/templateList"),
    createFrame: () =>
        import ("@/components/views/cpRecommend/createFrame"),
    templateInfo: () =>
        import ("@/components/views/cpRecommend/templateThemeInfo"),
    recommendList: () =>
        import ("@/components/views/cpRecommend/recomConfigList"),
    recommendDetail: () =>
        import ("@/components/views/cpRecommend/recomConfigDetail")
};

const modelData = {
    recommModel: () =>
        import ("@/components/views/modelList/modeParent"),
    modelList: () =>
        import ("@/components/views/modelList/modelList"),

    addModel: () =>
        import ("@/components/views/modelList/addModelForm"),
    recommElement: () =>
        import ("@/components/views/element")
};

const launcher = {
    launcherLayout: () =>
        import ("@/components/views/launcher/launcherLayout"),
    launcherAudit: () =>
        import ("@/components/views/launcher/launcherAudit"),
    launcherPublish: () =>
        import ("@/components/views/launcher/launcherPublish"),
    launcherManage: () =>
        import ("@/components/views/launcher/launcherLayout/launcherManage")
};

// 主题管理
const themeTemplate = {
    themeParent: () =>
        import ("@/components/views/motif/allTheme/themeParent"),
    // 所有主题
    allThemeManage: () =>
        import ("@/components/views/motif/allTheme/allThemeManage"),
    // 栏目管理
    columnManage: () =>
        import ("@/components/views/motif/column/columnManage"),
    // 页面设置
    pageManage: () =>
        import ("@/components/views/motif/page/pageManage"),
    // 用户主题
    userThemeManage: () =>
        import ("@/components/views/motif/userTheme/userThemeManage"),
    // 专项链接
    specialLinkManage: () =>
        import ("@/components/views/motif/specialLinks/specialLinkManage")
};

export default [{
        path: "*",
        meta: {
            error: 1
        },
        redirect: "/login"
    },
    {
        path: "/login",
        name: "Login",
        component: entry.login,
        meta: {
            cache: false
        },
        children: []
    },
    {
        path: "/homePage",
        name: "Home",
        component: home.homePage,
        children: [{
            path: "/masterPage",
            name: "masterPage",
            meta: {
                cache: false
            },
            component: home.masterPage,
            children: [{
                    path: "/menuList",
                    name: "menuList",
                    meta: {
                        cache: true
                    },
                    component: system.menuList
                },
                {
                    path: "/roleList",
                    name: "roleList",
                    meta: {
                        cache: true
                    },
                    component: system.roleList
                },
                {
                    path: "/userList",
                    name: "userList",
                    meta: {
                        cache: true
                    },
                    component: system.userList
                },
                {
                    path: "/portal",
                    name: "portal",
                    meta: {
                        cache: true
                    },
                    component: STB.portal
                },
                {
                    path: "/version",
                    name: "version",
                    meta: {
                        cache: true
                    },
                    component: STB.version
                },
                {
                    path: "/startUpgrade",
                    name: "startUpgrade",
                    component: STB.startUpgrade
                },
                {
                    path: "/factory",
                    name: "factory",
                    meta: {
                        cache: true
                    },
                    component: STB.factory
                },
                {
                    path: "/upgrade",
                    name: "upgrade",
                    meta: {
                        cache: true
                    },
                    component: STB.upgrade
                },
                {
                    path: "/device",
                    name: "device",
                    meta: {
                        cache: true
                    },
                    component: STB.device
                },
                {
                    //专题管理路由
                    path: "/specialParent",
                    name: "specialParent",
                    meta: {
                        cache: true
                    },
                    component: specialTemplate.specialParent
                },
                {
                    path: "/addSpecialForm",
                    name: "addSpecialForm",
                    meta: {
                        cache: true
                    },
                    component: specialTemplate.addSpecialForm
                },
                //专辑
                {
                    path: "/specialIssueParent",
                    name: "specialIssueParent",
                    meta: {
                        cache: true
                    },
                    component: specialIssue.specialIssueParent
                },
                {
                    path: "/addIssueForm",
                    name: "addIssueForm",
                    meta: {
                        cache: true
                    },
                    component: specialIssue.addIssueForm
                },
                {
                    //推荐管理路由
                    path: "/recommendParent",
                    name: "recommendParent",
                    meta: {
                        cache: true
                    },
                    component: recommendTemplate.templateParent
                },
                {
                    //活动管理路由
                    path: "/activeParent",
                    name: "activeParent",
                    meta: {
                        cache: true
                    },
                    component: activeTemplate.activeParent
                },
                {
                    //CPSP推荐管理
                    path: "/cpspRecommendParent",
                    name: "cpspRecommend",
                    meta: {
                        cache: true
                    },
                    component: cpspRecommend.templateParent
                },
                {
                    path: "/cpspInfo",
                    name: "cpspInfo",
                    meta: {
                        cache: true
                    },
                    component: table.cpspInfo
                },
                {
                    path: "/imageList",
                    name: "imageList",
                    meta: {
                        cache: true
                    },
                    component: table.imageList
                },
                {
                    path: "/giftList",
                    name: "giftList",
                    meta: {
                        cache: true
                    },
                    component: table.giftList
                },
                {
                    path: "/cpDetailList",
                    name: "cpDetailList",
                    meta: {
                        cache: true
                    },
                    component: table.cpDetailList
                },
                {
                    path: "/classifyList",
                    name: "classifyList",
                    meta: {
                        cache: true
                    },
                    component: table.classifyList
                },
                {
                    path: "/labelList",
                    name: "labelList",
                    meta: {
                        cache: true
                    },
                    component: table.labelList
                },
                {
                    path: "/programList",
                    name: "programList",
                    meta: {
                        cache: true
                    },
                    component: table.programList
                },
                {
                    path: "/gameList",
                    name: "gameList",
                    meta: {
                        cache: true
                    },
                    component: table.gameList
                },
                {
                    path: "/blackList",
                    name: "blackList",
                    meta: {
                        cache: true
                    },
                    component: table.blackList
                },
                {
                    path: "/parameterList",
                    name: "parameterList",
                    meta: {
                        cache: true
                    },
                    component: table.parameterList
                },
                {
                    path: "/templateManage",
                    name: "templateManage",
                    meta: {
                        cache: true
                    },
                    component: table.templateManage
                },
                {
                    path: "/dictionaryList",
                    name: "dictionaryList",
                    meta: {
                        cache: true
                    },
                    component: table.dictionaryList
                },
                {
                    path: "/theme",
                    name: "theme",
                    meta: {
                        cache: true
                    },
                    component: table.theme
                },
                {
                    path: "/voucher",
                    name: "voucher",
                    meta: {
                        cache: true
                    },
                    component: table.voucher
                },
                {
                    path: "/indexPage",
                    name: "indexPage",
                    meta: {
                        cache: true
                    },
                    component: table.indexPage
                },

                {
                    path: "/addModel",
                    name: "addModel",
                    meta: {
                        cache: true
                    },
                    component: modelData.addModel
                },

                {
                    path: "/recommModel",
                    name: "recommModel",
                    meta: {
                        cache: true
                    },
                    component: modelData.recommModel
                },
                {
                    path: "/recommElement",
                    name: "recommElement",
                    meta: {
                        cache: true
                    },
                    component: modelData.recommElement
                },
                // 所有主题
                {
                    path: "/themeParent",
                    name: "themeParent",
                    meta: {
                        cache: true
                    },
                    component: themeTemplate.themeParent
                },
                // 栏目管理
                {
                    path: "/columnManage",
                    name: "columnManage",
                    meta: {
                        cache: true
                    },
                    component: themeTemplate.columnManage
                },
                // 页面推荐配置
                {
                    path: "/pageManage",
                    name: "pageManage",
                    meta: {
                        cache: true
                    },
                    component: themeTemplate.pageManage
                },
                // 用户主题
                {
                    path: "/userThemeManage",
                    name: "userThemeManage",
                    meta: {
                        cache: true
                    },
                    component: themeTemplate.userThemeManage
                },
                // 专项链接
                {
                    path: "/specialLinkManage",
                    name: "specialLinkManage",
                    meta: {
                        cache: true
                    },
                    component: themeTemplate.specialLinkManage
                },
                //launcherLayout排版
                {
                    path: "/launcherLayout",
                    name: "launcherLayout",
                    meta: {
                        cache: true
                    },
                    component: launcher.launcherLayout
                }, //launcherAudit审核
                {
                    path: "/launcherAudit",
                    name: "launcherAudit",
                    meta: {
                        cache: true
                    },
                    component: launcher.launcherAudit
                }, //launcherPublish发布
                {
                    path: "/launcherPublish",
                    name: "launcherPublish",
                    meta: {
                        cache: true
                    },
                    component: launcher.launcherPublish
                }, //launcherManage管理
                {
                    path: "/launcherManage",
                    name: "launcherManage",
                    meta: {
                        cache: true
                    },
                    component: launcher.launcherManage
                },

                {
                    path: "/headPortrait",
                    name: "headPortrait",
                    meta: {
                        cache: true
                    },
                    component: system.headPortrait
                }
            ]
        }]
    }
];