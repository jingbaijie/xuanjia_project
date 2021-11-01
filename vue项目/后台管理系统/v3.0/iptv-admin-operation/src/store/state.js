export default {
    cachedViews: [],
    typeIds: [
        { value: "1", label: "通用专题正文推荐" },
        { value: "2", label: "通用专题退出推荐" },
        { value: "3", label: "通用专题其他推荐" },
        { value: "4", label: "通用专题上/左拉推荐" },
        { value: "5", label: "通用专题下/右他推荐" }
    ],
    typeIds2: [],
    recommendDisplayTypes: [{
            value: "0",
            label: "游戏"
        },
        {
            value: "1",
            label: "卡通"
        },
        {
            value: "2",
            label: "视频"
        },
        {
            value: "3",
            label: "跳转指定地址"
        },
        {
            value: "4",
            label: "通用页面"
        },
        {
            value: "5",
            label: "活动"
        },
        {
            value: "6",
            label: "专题"
        },
        {
            value: "7",
            label: "分类内容"
        },
        {
            value: "8",
            label: "卡通需要鉴权"
        },
        {
            value: "88",
            label: "其他"
        },
        {
            label: "占位符",
            value: "9"
        }
    ],
    dictionaryList: [],
    recommendList: [],
    specialList: [],
    loginInfo: {
        mobile: "",
        loginToken: ""
    },
    userInfo: {
        // 用户信息
        id: "",
        display_name: "",
        nickname: "",
        email: "",
        phone_number: "",
        api_ln: "",
        activated: true,
        invite: "",
        notice: 0,
        valid_account: [],
        omt: {},
        stat: {
            trade_count: 0,
            good_count: 0,
            good_rate: "0"
        },
        default_collection: {}
    },
    myAds: {
        list: []
    },
    deposit: {
        account: [],
        deposit_channels: {},
        deposits_history: []
    },
    withdraw: {
        default_source_id: "",
        fund_sources: [],
        withdraw_channels: {},
        withdraws: []
    },
    bankList: [],
    countryList: [],
    collectionList: [],
    userToken: null, // 登录后header必携带
    axiosCancel: {}, // axios的CancelToken
    device: 0, // 设备 0--PC端 1--手机端,
    isFirstLogin: 1,
    /** 升级信息组件状态管理 */
    isComponent: "addDevice", // 动态组件状态
    upgradeTable: [] // 升级表格
};