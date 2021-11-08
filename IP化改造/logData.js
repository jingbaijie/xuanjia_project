var xjDataLog = {
    //盒子类型：'STBType0'，STBType为固定前缀，不同盒子后面跟的数字不同，默认STBType0：老盒子。所有盒子分类详见getSTBType方法。·
    STBType: 'STBType0',
    //盒子类型：布尔值，标记属于新盒子还是老盒子，默认老盒子
    boolLeanIsNewSTB: false,
    isDo: false,
    //开启debug模式，上线后要关闭改成false
    isDebug: false,
    isMsg: false,
    //进入时间
    startTime: null,
    //结束时间
    endTime: null,
    //停留时间
    time: 0,
    //页面部分位置偏差补位
    pageOffsetXY: {
        "x": 0,
        "y": 0
    },
    //是否是IP盒子
    _isIpDevice: CT.getCookie("isIPDevice") == "true",
    isRoute: window.location.href.indexOf('.html') > -1 ? false : true, //是否为路由访问页面
    isRecommend: true, //是否引用之前的参数
    loggerUrl: AjaxConfig.loggerUrl, //上传日志接口
    insertUserUrl: AjaxConfig.insertUserUrl, //新增用户接口
    //页面信息对象，页面获取到信息后，直接赋值  outJSON[0].pageInfo对象中的信息
    //{pageTemplateId: 294,commPageId: 303,pageTemplateCname: "全部内容新版20180821",templatePic: "/XJCartoonFileManager_test/UpAppGame/2/201808211344302181.jpg",pageTemplateEname: "all",pageTemplateBgpic: /XJCartoonFileManager_test/UpAppGame/2/201808211344594874.jpg",templateId: null,templateUrl: null,booleanUp: 2,startTime: "2018-08-21 13:51:22",endTime: "2021-08-22 13:51:22",booleanTimeperiod: 0,timeperiodStartTime: ull,timeperiodStartWeek: null,timeperiodEndTime: null,timeperiodEndWeek: null,commPageCname: "全部内容新版20180821",commPageEname: "AllContent_20180821",nextCommPageUrl: "0",prevCommPageUrl: "0",createTime: "2018-08-21 3:42:53",filemTime: "2018-08-21 13:43:36",more1: null,more2: null}
    commonPageInfo: {},
    //基础配置文件
    defaultConfig: {
        "version": "1.1",
        //运营商,1.移动，2联通（），3电信，4有线，5咪咕，6华数，7联通集约中心，66其它
        "userNetType": 4,
        //用户ip
        "userIp": "0.0.0.0",
        //设备id
        "sn": "sn00000",
        //设备类型，1.android,2.linux,3.其它
        "snType": 2,
        //城市编码
        "cityCode": "025",
        //用户城市
        "cityName": "江苏省",
        //牌照方
        "playFrom": "jsyx",
        //牌照方所在城市
        "playFromCity": "45",
        //平台：1炫佳乐园，2炫力动漫，3乐玩堂，4音乐包，5小海贝，6 少儿频道
        "moduleName": 6,
        //来源：1.android,2.wx,3.epg,4.other
        "source": 3,
        //订购产品id
        "prodId": "0020412cp0007",
        //订购产品名称
        "prodName": "高清少儿包",
        //订购方式：1手机话费、2宽带支付、3第三方支付
        "payType": 1,
        //计费方式，1包月，2按次
        "feeType": 1,
        //页面类型0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它
        "pageType": 1,
        "spId": "NJXJ",
        "spName": "南京炫佳"

    },
    STBTypes: {
        'HG650': 'FH', // 通过判断盒子型号改变上传日志方法
        'HG680-L': 'FH', // 烽火 HG680-L
        'HG680-R': 'FH1', // 烽火
        'IP906H_08U1': 'HX', // 海信
        'SZT8': 'SZ', // 神州
        'E900': 'CW', // 创维
        'B860AV2.1U': 'ZX', // 中兴
        'B860AV2.2U': 'ZX', // 中兴
        'B860AV1.1': 'ZX', // 中兴
        'B700V5U': 'ZX', // 中兴
        'MC8638S97': 'SDK', // 斯达康
        'MC8638': 'SDK', // 斯达康
        'EC6108V9E_hbjlt_BES': 'HW', // 华为
        'EC6109U_hbjlt': 'HW', // 华为
        'EC6108V9U_ca_hbjlt': 'HW', // 华为
        //广西新增，键名为盒子硬件版本号，键值为高清(720P)/标清(480P)
        '29': '720P',
        'Hi3798MV200(41)': '720P',
        //29老盒子升级版
        '56': '720P',
        //41差盒子
        '41': '720P',
    },
    isLoad: false, // 上传页面日志回调判断
    /**
     * ajax请求
     * @param data ajax请求需要的数据
     *		  data.url			请求的地址
     *		  data.params		请求的参数
     *        data.ajaxConfig   请求的配置，可以配置method，async，ContentType，如果不配置取默认值
     * @param callback 请求成功之后的回调函数
     */
    ajax: function(data, callback, cb) {
        var url = data.url;
        var params = data.params || {};
        params.times = new Date().getTime();
        var ajaxConfig = data.ajaxConfig || {};
        var method = ajaxConfig.method || "get";
        var async = ajaxConfig.async == false ? false : true;
        var ContentType = ajaxConfig.ContentType || "json";
        ajax.init({
            url: url,
            method: method,
            params: params,
            async: async,
            ContentType: ContentType,
            success: function(e) {
                cb && cb(e)
                callback && callback(e);
            },
            fail: function(status) {
                var dataType = CT.dataType(status);
                if (dataType == 'string') {
                    status = '请求接口失败：' + status;
                } else if (dataType == 'object') {
                    status.request = '请求接口失败!';
                } else if (dataType == 'array') {
                    status.push('请求接口失败!');
                } else {
                    status = '请求接口失败：' + CT.jsonToString(status);
                }
                callback && callback(status);
            }
        });
    },
    /**
     * 鉴权日志
     * @param option
     */
    setUserAuthLogoInfo: function (option) {
        var _this = this;
        var option = option || {};
        var loggerUrl = _this.loggerUrl + "userAuth";
        var params = {
            "userId": _this.getUserId(), //页面入口名称，最好英文加数字
            "authState": option.authState + "" || "1", //鉴权标识：0失败，1成功，2退订
            "authFrom": option.authFrom || "", //鉴权来源
            "contentId": AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commonPageId || CT.requestValue("contentId") || CT.requestValue("activityId"), //鉴权内容ID
            "contentType": _this.getPageType(),
            "authStateCname": option.authStateCname || "", //第3方返回的鉴权结果
            "productInfo": option.productInfo || "", //鉴权的产品编码
            "cityCode": _this.getCityCode(), //城市编码
            "cityName": _this.defaultConfig.cityName, //城市中文名
            "moduleName": _this.defaultConfig.prodName, //鉴权产品名称,
            "createDate": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "more1": option.more1 || _this.getSmartCardid(),
            "more2": option.more2 || _this.getStbId(),
            "more3": encodeURIComponent(option.more3),
            "more4": option.more4
        };
        
        // var ajaxConfig = {
        //     method: 'POST'
        // };
        // var callback = function() {}
        // var url = _this.interfaceUrl + "findTemplateInfo";
        // var data = {
        //     url: loggerUrl,
        //     params: params,
        //     ajaxConfig: ajaxConfig
        // };
        // _this.ajax(data, callback);
        _this.setLogger(loggerUrl, params);
    },


    init: function (option) {
        var _this = this;
        //获取盒子类型
        var stbType = _this.getSTBType();
        // interface.loggerInfo('stbType：' + stbType)
        //释放某些键值给网页端用
        _this.freeSomeKey();
        _this.startTime = new Date();
        window.addEventListener("load", function (ev) {
            if (basePageInfo.personalCenterPageInfo) {
                _this.commonPageInfo = basePageInfo.personalCenterPageInfo || {};
            } else if (basePageInfo.commonPageInfo && basePageInfo.commonPageInfo.pageInfo) {
                _this.commonPageInfo = basePageInfo.commonPageInfo.pageInfo || {};

            } else {
                _this.commonPageInfo = {};
            }
            //离开页面前日志操作
            _this.beforeUnload();
        })
    },
    /**
     * 判断是不是IP盒子
     */
    isIpDevice: function(){
        var _this = this;
        try{
            if(!_this._isIpDevice) {
                _this._isIpDevice = iPanel.ioctlRead("ro.di.stb_type") == "ip";
                if(_this._isIpDevice) {
                    CT.setCookie("isIPDevice","true");
                }
            }
        }catch(e) {
            CT.delCookie("isIPDevice");
            _this._isIpDevice = undefined;
        }
        return _this._isIpDevice;
    },
    /**
     * 获取盒子STBType
     *  iPanel.getGlobalVar("S_F_GET_STB_HARD_VERSION");//获取硬件版本号，获取成功，返回版本号；失败，返回# 比如返回 56。
     * */
    getSTBType: function () {
        var _this = this;
        // var STBType = _this.getGlobalVar('S_F_GET_STB_HARD_VERSION');
        var STBType = "";
        try {
            if(_this.isIpDevice()) {
                STBType = iPanel.ioctlRead("ro.di.stb_model") 
            } else {
                STBType = CITV.loginInfo.stbMode;
            }
        } catch (e) {

        }

        return STBType;
    },
    
    /**自定义盒子类型新旧
     * */
    // isNewSTB: function () {
    //     var _this = this;
    //     var trueSTB = _this.getSTBType() + "";
    //     var newStbStr = "Hi3798MV200(41)";
    //     if (newStbStr.indexOf(trueSTB) > -1) {
    //         _this.boolLeanIsNewSTB = true;
    //         return true;
    //     } else {
    //         _this.boolLeanIsNewSTB = false;
    //         return false;
    //     }
    // },
    /**
     * 获取盒子属于高清还是标清，默认高清
     * */
    getHDOrSD: function () {
        var _this = this;
        var name = _this.STBTypes[(_this.getSTBType()+"")] || '720P';
        return name;
    },
    /**
     * 获取页面类型
     * 页面类型0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它

     * @returns {number}
     */
    getPageType: function () {
        var _this = this;
        var curPage = window.location.href;
        //页面类型0 游戏 1 卡通 2视频 3 跳转指定地址 4 通用页面id 5 活动id 6专题 7分类内容 8卡通需要鉴权 88其它

        var pageType = 1;
        if (curPage.indexOf("videoDetail") > -1) {
            pageType = 1
        } else if (curPage.indexOf("activity") > -1) {
            pageType = 5;
        } else if (curPage.indexOf("column") > -1) {
            pageType = 6;
        } else if (curPage.indexOf("game") > -1) {
            pageType = 0;
        } else if (curPage.indexOf("playVideo") > -1) {
            pageType = 2;
        } else if (curPage.indexOf("contentId") > -1 || curPage.indexOf("contentEName") > -1) {
            pageType = 4;
        } else {
            pageType = 88;
        }
        return pageType;
    },
    /**
     *     * 大数据获取页面类型
     *         * 页面类型1.普通页面，2.专辑，3活动，4游戏，5片单，6.其它,7.卡通，8.登录，9.登出
     *             * @returns {number}
     *                 */
    getPageType1: function () {
        var _this = this;
        var curPage = window.location.href;
        /*/页面类型1.普通页面，2.专辑，3活动，4游戏，5片单，6.其它*/
        /*/cartoon卡通，video视频，game游戏，special专题，activity活动，page普通页面，loginIn 登录，loginOut 登出*/
        var contentType = CT.requestValue("contentType");
        var pageType = 1;
        if (curPage.indexOf("activityId") > -1) {
            pageType = 3;
        } else if (curPage.indexOf("game") > -1) {
            pageType = 4;
        } else if (curPage.indexOf("column") > -1) {
            pageType = 2;
        } else if (AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageEname == "playvideo_2019v1" || curPage.indexOf("playVideo") > -1) {
            pageType = 5;
        } else if (curPage.indexOf("loginPortal") > -1 || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.commPageEname && AjaxConfig.commonPageInfo.commPageEname.indexOf("loginportal") > -1) {
            pageType = 8;
        } else if (AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageEname == "cartoon_detail_2019v1" || curPage.indexOf("videoDetail") > -1) {
            pageType = 7;
        } else if (curPage.indexOf("loginOut_2019v1") > -1) {
            pageType = 9;
        } else if (AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageEname.toLocaleLowerCase().indexOf("order") > -1) {
            pageType = 10;
        } else if (curPageInfo && typeof curPageInfo == "object") {
            pageType = curPageInfo.contentType
        } else {
            pageType = 1;
        }
        return pageType;
    },
    /**
     *      * 获取页面 commpageEname 
     *           */
    getCommPageEname: function () {
        var _this = this;
        var commPageEname = _this.commonPageInfo.commPageEname || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageEname || CT.requestValue("contentName") || CT.requestValue("contentEName") || "";
        switch (_this.getPageType() + "") {
            case "0":
                commPageEname += "_" + CT.requestValue("gameId");
                break;
            case "1":
                commPageEname += "_" + CT.requestValue("cartoonId");
                break;
            case "2":
                commPageEname += "_cartoonId_" + CT.requestValue("cartoonId") + "_videoId_" + CT.requestValue("videoId");
                break;
            case "5":
                commPageEname = "activityId_" + CT.requestValue("activityId") + "_" + commPageEname;
            default:
                break;
        }
        return commPageEname || 0;
    },
    //获取页面中文名
    getCommPageCname: function () {
        var _this = this;
        var commPageCname = _this.commonPageInfo.commPageCname || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageCname || CT.requestValue("contentCName") || "";
        return encodeURIComponent(commPageCname);
    },

    getCurId: function () { //当前焦点
        var _this = this;
        var id = curFocus.FocusID;
        if (!id) {
            id = curFocus.id;
        }
        return id || "-1";
    },
    //获取页面入口名称，最好英文加数字
    getFromPortal: function () {
        var _this = this;
        var pid = CT.getCookie("pid");
        switch (_this.getPageType() + "") {
            case "0": //游戏
                pid += "_gameId_" + CT.requestValue("gameId");
                break;
            case "1": //卡通
                pid += "_cartoonId_" + CT.requestValue("cartoonId");
                break;
            case "2": //卡通详情
                pid += "_cartoonId_" + CT.requestValue("cartoonId") + "_videoId_" + CT.requestValue("videoId");
                break;
            case "5": //活动
                pid += "_activityId_" + CT.requestValue("activityId");
                break;

            default:
                break;
        }

        if (!pid) {
            try {
                //安卓方法取值方式
            } catch (e) { }
        }
        return pid || "-1";
    },
    /**
     * 获取当前id的位置
     * @param id
     * @returns {{x: number, y: number}}
     */
    getDivPosition: function (id) {
        var _this = this;
        try {
            var elm = document.getElementById(id);
            if (elm) {
                //增加页面补位
                var position = {
                    x: (elm.offsetWidth / 2) + _this.pageOffsetXY.x,
                    y: (elm.offsetHeight / 2) + _this.pageOffsetXY.y
                };
                for (var i = 0; i < 100; i++) {
                    position.x += Math.abs(elm.offsetLeft);
                    position.y += Math.abs(elm.offsetTop);
                    elm = elm.parentNode;
                    if (elm.tagName == "BODY") {
                        break;
                    }
                }
            } else {
                var position = {
                    x: 0,
                    y: 0
                }

            }

            return position;
        } catch (e) {

        }

    },
    //是否为游客用户
    isGuestUser: function(){
        var _this = this;
        return _this.isIpDevice() && (_this.getUserId() + "").toUpperCase() == "GUEST";
    },
    //ip盒子登录页
    ipDeviceLogin: function(){
        var str=('{"id":"99","name":"com.ipanel.join.jiangsu.login","className":"com.ipanel.join.jiangsu.login.LoginActivity","flags":"FLAG_ACTIVITY_NEW_TASK"}');
        Android.JSONCall(str);
    },
    //获取用户ID，目前取的是设备号
    getUserId: function () {
        var _this = this;
        var userId = "";

        if(_this.isIpDevice()) {
            try{
                return iPanel.ioctlRead("persist.sys.login.userCode");
            }catch(e){
                userId = CT.getCookie("userId");
                return userId || "Guest";
            }

        }
        userId = CT.getCookie("userId");

        if (!userId && userId != "-1") {
            try {

                userId = Utility.getSystemInfo("UID");
                if (!userId) {
                    userId = CITV.loginInfo.userId;
                }


                CT.delCookie("userId");
                if (userId) {
                    CT.setCookie("userId", userId);
                }
            } catch (e) {
                userId = _this.getStbId();
            }
        }
        if (!userId || userId < 0) {
            orderJs.getUserInfo(function (userData) {
				try{
					userId = userData.data.userInfo.userCode;
					if (userId) {
						CT.delCookie("userId");
						CT.setCookie("userId", userId)
					}
				} catch(e){}
            });
        }
        return userId || "-1";
    },
    /**
     * 获取用户pid
     * @returns {string}
     * @example
     *  var pid = CT.getPid();
     */
    getPid: function () {
        var _this = this;
        var pid = "";
        pid = CT.getCookie("pid") || "-1";
        return pid;
    },
    /**
     *iPanel.getGlobalVar("S_F_GET_STB_SOFT_VERSION");//获取软件版本号，获取成功，返回版本号；失败，返回# 比如返回 3.9.128167(6)。
     * */
    getVersion: function () { // 
        var _this = this;
        // var version = _this.getGlobalVar('S_F_GET_STB_SOFT_VERSION');
        version = iPanel && iPanel.ioctlRead && iPanel.ioctlRead("ro.di.sw_version") 
        return version || "v0.0"
    },
    /*获取token*/
    getUserToken: function () {
        var _this = this;
        var userToken = null;
        userToken = CT.getCookie("userToken");
        if(!userToken) {
            try{
                if(_this.isIpDevice()) {
                    userToken = iPanel.ioctlRead("persist.sys.login.Token");
                    // CT.delCookie("userToken");
                    // CT.setCookie("userToken", userToken);
                } else {
                    userToken = CITV.loginInfo.token;
                }
                if(userToken) {
                    CT.delCookie("userToken");
                    CT.setCookie("userToken",userToken);
                }
            }catch(e){
                
            }
        }
        return userToken || "-1";
    },
    //获取mac
    getMac: function () {
        var _this = this;
        var mac = "";
        mac = CT.getCookie("mac");
        if (!mac) {
            try {
                mac = iPanel.ioctlRead("ro.di.mac");
                if(mac) {
                    CT.delCookie("mac");
                    CT.setCookie("mac",mac);
                }
                //      mac = Authentication.CUGetConfig('MAC');
            } catch (e) { }
        }
        return mac || "-1";
    },
    /**
     * 获取用户手机号
     * 默认取userId
     *
     */
    getUserPhone: function () {
        var _this = this;
        var userPhone = "";
        // userPhone = CT.getCookie("userId");
        if (!userPhone) {
            try {
                // userId = Utility.getSystemInfo("UID");
                if(_this.isIpDevice()) {
                    userPhone = iPanel.ioctlRead("persist.sys.login.phone") 
                }
                //默认取userId
            } catch (e) {

            }
        }
        return userPhone || "-1";
    },
    //获取设备号
    getStbId: function () {
        var _this = this;
        var stbId = "";
        try {
            // stbId = CITV.loginInfo.stbId;
            //if (!stbId) {
            if(_this.isIpDevice()) {
                iPanel.ioctlRead("ro.di.stb_sn");
            } else {
                stbId = hardware.STB.serialNumber;
            }
            //}

        } catch (e) {
            stbId = "81200619290004345";
        }
        return stbId || _this.defaultConfig.sn;
    },
    //获取城市编号，现在获取的是区域码areaCode
    getCityCode: function () {
        var _this = this;
        var cityCode = "";
        try {
            // cityCode = CITV.loginInfo.areaCode;
            //  if (!cityCode) {
            cityCode = Utility.getSystemInfo("ARC");
            //    }
        } catch (e) {
            CT.setCookie("areaCode", cityCode);
        }
        return cityCode || _this.defaultConfig.cityCode;
    },
    /**
     *      *      * 获取smartCardId
     *           *           */
    getSmartCardid: function () {
        var _this = this;
        var smartcardId = "";
        try {
            smartcardId = CITV.loginInfo.smcId;
            if (!smartcardId) {
                smartcardId = Utility.getSystemInfo("SID")
            }

        } catch (e) {
            smartcardId = "-1"
        }
        return smartcardId;
    },
    getTvcode: function () {
        var _this = this;
        var tvcode = "";
        try {
            tvcode = CITV.loginInfo.tvcode;

        } catch (e) {
            tvcode = "-1"
        }
        return tvcode;
    },
    //获取ip
    getUserIp: function () {
        var _this = this;
        var userIp = "";
        userIp = CT.getCookie("userIp");
        if (!userIp) {
            try {
                userIp = Authentication.CUGetConfig('IP');
            } catch (e) {
                /*interface.getSystemIP(function(e){
                   userIp = e.data;
                });*/
            }
        }
        return userIp || _this.defaultConfig.userIp;
    },
    //获取牌照方
    getPlayFrom: function () {
        var _this = this;
        var playFrom = "";
        playFrom = CT.getCookie("platform");
        if (!playFrom) {
            try {
                //获取牌照方方法
                playFrom = XJ_TV_JS.getVal("platform");


            } catch (e) { }
        }
        return playFrom || _this.defaultConfig.platform;
    },
    //牌照方所在城市
    getPlayFromCity: function () {
        var _this = this;
        var playFromCity = "";
        playFromCity = CT.getCookie("playFromCity");
        if (!playFromCity) {
            try {
                //获取牌照方城市方法
            } catch (e) { }
        }
        return playFromCity || _this.defaultConfig.playFromCity;
    },
    //获取平台
    getPlatform: function () {
        var _this = this;
        var platform = "";
        try {
            //平台获取方式
        } catch (e) {

        }
        return platform;
    },

    /**
     * 获取默认基础信息
     */
    getDefaultInfoObj: function () {
        var _this = this;
        var obj = {};
        obj.userId = _this.getUserId();
        obj.userPhone = _this.getUserPhone();
        obj.userNetType = _this.defaultConfig.userNetType;
        obj.userIp = _this.getUserIp();
        obj.sn = _this.getStbId();
        obj.snType = _this.defaultConfig.snType;
        obj.stbId = _this.getStbId();
        obj.mac = _this.getMac();
        obj.cityCode = _this.getCityCode();
        obj.cityName = _this.defaultConfig.cityName;
        obj.playFrom = _this.getPlayFrom();
        obj.playFromCity = _this.getPlayFromCity();
        obj.moduleName = _this.defaultConfig.moduleName;
        obj.apkVersion = _this.getSTBType();
        return obj;
    },
    /**
     * 复制对象
     * @param targetObj
     * @param modelObj
     * @returns {*}
     */
    checkObj: function (targetObj, modelObj) {
        if (modelObj != null && modelObj != undefined) {
            for (var p in modelObj) {
                targetObj[p] = modelObj[p];
            }
        }

        return targetObj;

    },
    /**
     * 获取上一页面名称
     * @returns {*}
     */
    getPrePage: function () { //获取上一页面的名称
        var _this = this;
        var prePageInfo = CT.getCookie("prePageInfo");
        var prePageInfoJson = null;
        if (prePageInfo) {
            prePageInfoJson = CT.strToJson(prePageInfo);
        }
        /*存储当前页面的信息，作为下一个页面的prePageInfo*/
        var nextPage = _this.getPageUrlName(window.location.href);
        var nextPageInfo = "prePageUrl=" + nextPage + "&commPageEname=" + (_this.getCommPageEname()) + "&commPageCname=" + _this.getCommPageCname() + "&startTime=" + _this.startTime.getTime() + "&defaultFocus=" + curFocus.FocusID + "&focusDivPos=" + ajax.jsonToString(_this.getDivPosition(curFocus.FocusID));
        CT.delCookie("prePageInfo");
        CT.setCookie("prePageInfo", nextPageInfo);



        return prePageInfoJson || {
            commPageEname: "-1",
            commPageCname: "-1"
        };
    },
    /**
     * 获取当前页面名称
     * @returns {*}
	 * 	"pageEname" "pageCname"_this.commonPageInfo.commPageCname
	 "nextPageCname":_this.commonPageInfo.commPageCname || "-1",//下一个页面信息
			"nextPageEname":_this.commonPageInfo.commPageEname || "-1",//下一个页面英文名称
     */
    getNextPage: function () {
        var _this = this;
        var nextPage = "";

        return nextPage || "-1";
    },
    /**
     * 获取nextId   比如gameId 或者cartoonId
     * @returns {string|string}
     */
    getNextId: function (curPageUrl) {
        var _this = this;
        curPageUrl = curPageUrl || window.location.href;
        var nextId = "";
        var game_id = _this.querySearchUrlKey(curPageUrl, "gameId");
        var cartoon_id = _this.querySearchUrlKey(curPageUrl, 'cartoonId');
        var songId = _this.querySearchUrlKey(curPageUrl, 'songId');
        var singerId = _this.querySearchUrlKey(curPageUrl, 'singerId');
        var videoId = _this.querySearchUrlKey(curPageUrl, 'videoId');
        var activityId = _this.querySearchUrlKey(curPageUrl, 'activityId');
        var contentId = _this.querySearchUrlKey(curPageUrl, 'contentId');
        if (!contentId) {
            if (setLoggerInfo.pageInfoLog) {
                try {
                    contentId = setLoggerInfo.pageInfoLog.pageInfo.contentId
                } catch (error) {

                }
            }
        }

        if (game_id) {
            nextId = game_id;
        } else if (videoId) {
            nextId = videoId;
            if(cartoon_id){ //把数据改为需要 cartoon_id
                nextId = {cartoonId:cartoon_id,videoId:videoId,nextId:nextId};
            }
        } else if (cartoon_id) {
            nextId = cartoon_id;
        } else if (songId) {
            nextId = songId;
        } else if (singerId && singerId != "undefined" && singerId != "null") {
            nextId = singerId;
        } else if (activityId) {
            nextId = activityId;
        } else if (singerId && singerId != "undefined" && singerId != "null") {
            nextId = singerId;
        } else if (contentId) {
            nextId = contentId
        } else {
            nextId = window.curPageInfo.contentId;
        }
        if (curPageUrl.indexOf('loginPortal') > 0) {
            nextId = 'commPageId_1'
        }
        return nextId || "-1";
    },
    joinStr: function (obj) { //拼接参数
        var _this = this;
        var args = '';
        for (var key in obj) {
            if (args != '') {
                args += '&';
            }
            args += key + '=' + encodeURIComponent(obj[key]);
        }
        return args;
    },

    /**
     * 截取地址中的网页名称
     * @param url
     * @returns {string}
     */
    getPageUrlName: function (url) { //获取页面名称
        var _this = this;
        url = url || window.location.href;
        var pageName = '';
        if (url.indexOf('?') > -1) {
            if (_this.isRoute) {
                //路由访问页面
                pageName = _this.querySearchUrlKey(url, 'contentName');
                if (pageName) {
                    pageName = 'contentName_' + pageName;
                } else {
                    pageName = 'contentId_' + _this.querySearchUrlKey(url, 'contentId');
                }
            } else {
                var str = url.split("?")[0];

                pageName = str.substr(str.lastIndexOf("/") + 1);
                //   pageName = url.substring(url.lastIndexOf("/")+1,(url.indexOf("?")==-1?url.length:url.indexOf("?")));
                if (pageName.indexOf("?") > -1) {
                    var url_1 = url.substr(0, url.indexOf("?"));
                    pageName = url_1.substr(url_1.lastIndexOf("/") + 1);
                }
            }

            try {
                var curPage = url;
                if (curPage.indexOf("GTmusic") > -1 || curPage.indexOf("columnGeneral") > -1) {
                    var action = _this.querySearchUrlKey(curPage, "action");
                    var commPageId = _this.querySearchUrlKey(curPage, "commPageId");
                    pageName += "_action_" + action + "_commPageId_" + commPageId;
                } else if (curPage.indexOf("activityId") > -1) {
                    var activityId = _this.querySearchUrlKey(curPage, "activityId");
                    pageName += "_activityId_" + activityId;
                }
            } catch (e) { }
        } else {
            pageName = url.substring(url.lastIndexOf("/") + 1, (url.indexOf("?") == -1 ? url.length : url.indexOf("?")));

        }

        return pageName;
    },
    /**
     *  获取地址中  key对应的val
     * @param url
     * @param name
     * @returns {*}
     */
    querySearchUrlKey: function (url, name) { //根据地址获取后面参数
        var _this = this;
        var search, reg, value;
        if (url) {
            search = url.substring(url.indexOf("?") + 1); //获取问号后面的字符串
        } else {
            _this.writeInfo('querySearchUrlKey 中URL 地址错误');
        }
        if (name) {
            reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)'); //获取正则表达式
            try {
                value = search.match(reg)[2];
            } catch (e) {
                value = null;
                //_this.writeInfo('querySearchUrlKey 中未查询到该key值');
            }

        } else {
            _this.writeInfo('querySearchUrlKey 中name 为空')
        }
        return value;

    },
    /**
     * 上传日志通用方法
     * @param logUrl
     * @param params
     */
    setLogger: function (logUrl, params) {
        var _this = this;
        if (params instanceof Object) {
            var args = '';
            for (var i in params) {
                var val = '';
                if (args != '') {
                    args += '&';
                }
                if (params[i] && params[i] != '') {
                    val = params[i];
                } else {
                    val = '19700101000000';
                }
                     args += i + '=' + encodeURIComponent(params[i]);
            }
            /*var script = document.createElement("script");
             script.src = logUrl + '?' + args;
             document.body.appendChild(script);*/
            // var img = new Image(0, 0);
            // img.src = logUrl + '?' + args;

            var ajaxConfig = {
                method: 'get'
            };
            var callback = function() {};
            var postData = {
                url: logUrl,
                params: params,
                ajaxConfig: ajaxConfig
            };
            interface.ajax(postData, callback);

        } else {
            _this.writeInfo("上传参数格式错误");
        }
    },
    /**
     * 时间格式化
     * @param date 20180924122324 ==》 2018-09-24 12：23：24
     * @returns {*}
     */
    formateTime: function (date) { //格式化时间
        var _this = this;
        if (date) {
            var year = date.getFullYear() + ""; //年
            var month = date.getMonth() + 1 + ""; //月
            var day = date.getDate() + ""; //日
            var hour = date.getHours() + ""; //小时
            var minutes = date.getMinutes() + ""; //分
            var seconds = date.getSeconds() + ""; //秒
            date = year + '' + _this.autoAdd(month) + '' + _this.autoAdd(day) + "" + _this.autoAdd(hour) + '' + _this.autoAdd(minutes) + '' + _this.autoAdd(seconds);
        } else {
            date = 19700101000000;
            _this.writeInfo('传入的时间格式错误');
        }
        return date;
    },
    /**
     * 时间格式化
     * @param date 20180924122324 ==》 2018-09-24 12：23：24
     * @returns {*}
     */
    formateTime2: function (date) { //格式化时间
        var _this = this;
        if (date) {
            var year = date.getFullYear() + ""; //年
            var month = date.getMonth() + 1 + ""; //月
            var day = date.getDate() + ""; //日
            var hour = date.getHours() + ""; //小时
            var minutes = date.getMinutes() + ""; //分
            var seconds = date.getSeconds() + ""; //秒
            date = year + '-' + _this.autoAdd(month) + '-' + _this.autoAdd(day) + " " + _this.autoAdd(hour) + ':' + _this.autoAdd(minutes) + ':' + _this.autoAdd(seconds);
        } else {
            date = 19700101000000;
            _this.writeInfo('传入的时间格式错误');
        }
        return date;
    },
    /**
     * 将24小时制转成时间格式
     * @param date
     *  20180924122324 ==》 2018-09-24 12：23：24
     */
    reverseTime: function (date) {
        var _this = this;
        var newDate = "";
        date += "";
        if (date.length == 14 && !isNaN(parseInt(date))) {
            newDate = date.substring(0, 4) +
                "-" + date.substring(4, 6) +
                "-" + date.substring(6, 8) +
                " " + date.substring(8, 10) +
                ":" + date.substring(10, 12) +
                ":" + date.substring(12, 14)
        }
        return newDate;
    },
    /**
     * 转换时间格式
     * @param str
     *  “2017-12-12 12：12：12” =>  20171212121212
     **/
    changeTime: function (str) {
        var _this = this;
        var date;
        if (str && typeof parseInt(str) == "number") {

            date = _this.formateTime(new Date(str));

        } else {
            _this.writeInfo("时间格式出错");
        }
        return date || _this.formateTime(new Date());
    },
    /**
     * 日期自动补全
     * @param str
     * @param len
     * @returns {string}
     */
    autoAdd: function (str, len) { //日期自动不全
        var _this = this;
        var newStr = '';
        if (!len) {
            len = 2;
        }
        if (str && typeof (str) === 'string') {
            if (str.length < len) {
                newStr = "0" + str;
            } else {
                newStr = str;
            }
        }
        return newStr;
    },
    //页面日志打印
    writeInfo: function (msg) {

        var _this = this;
        if (_this.isDebug) {
            if (_this.isMsg) {
                var el = document.createElement("div");
                el.style.position = "absolute";
                el.style.top = "200px";
                el.style.left = "100px";
                el.style.color = "red";
                el.style.fontSize = "20px";
                el.innerHTML = msg;
                el.id = "msg";
                document.body.appendChild(el);
                _this.isMsg = false;
                return;
            }
            var el = document.getElementById("msg");
            el.innerHTML = el.innerHTML + "；" + msg;
        }
    },

    /**
     * ajax请求返回参数回调方法
     * @param logUrl  接口地址
     * @param params  请求参数
     * @param callBack   回调函数
     */
    setAjaxCallBack: function (logUrl, params, callBack) {
        var _this = this;
        ajax.init({
            url: logUrl,
            method: "GET",
            params: params,
            async: false,
            ContentType: "json",
            success: function (data) {
                data = data || {};
                callBack && callBack(data);
            },
            fail: function (status) {
                //_this.writeInfo(status + "" + logUrl);

            }
        });
    },
    /**
     * json数据转成string数据
     * @param obj
     * @returns {*}
     */
    jsonToString: function (obj) { //
        var _this = this;
        return _this.joinStr(obj);
    },
    /**
     * string转成Json数据
     * @param str
     * @returns {{}}
     */
    stringToJson: function (str) {
        var _this = this;
        var arr = [];
        var obj = {};
        arr = str.split("&");
        for (var i = 0; i < arr.length; i++) {
            var array = arr[i].split("=");
            obj[array[0]] = array[1];
        }
        return obj;
    },
    /**
     * 新增用户
     * @param data
     */
    insertUserInfo: function (data) { //上传登录登出
        var _this = this;
        var loggerUrl = _this.insertUserUrl;
        data = data || {};
        var params = {
            "userId": data.userId || _this.getUserId(),
            /* 用户ID*/
            "createDate": _this.reverseTime(_this.formateTime(new Date())), // 服务器时间
            /* 设备号*/
            "stbId": data.stbId || _this.getStbId(),
            "userPhone": data.userPhone || "",
            /* 城市ID*/
            "cityId": _this.getCityCode(),
            "more1": _this.getSmartCardid(),
            "more2": _this.getTvcode(),
            "more3": _this.getStbId(),
            //城市编号
            "more4": data.more4 || ""
        };
        params = _this.checkObj(_this.getDefaultInfoObj(), params);
        _this.setLogger(loggerUrl, params);
    },

    /**
     *  用户登录日志
     * @param data
     *           data={
                     "fromPortal" : "pid_version", // 必传，页面入口名称，最好英文加数字    必填，pid值+apk版本号
                     "page" : "loginportal_xxx", //必传，登陆的页面名称/退出的页面          必填
                     "userId"："666",  //用户编号  非必传                                   非必填
                     "loginType" : 1,//登陆类型1登陆2登出  非必传                           非必填
                }
     */
    uploadLoginOut: function (data) { //上传登录登出
        var _this = this;
        var loggerUrl = _this.loggerUrl + "login";
        data = data || {};
        var params = {
            "userId": _this.getUserId(),
            'page': data.page || "",
            "pageEname": data.pageEname || "",
            "pageCname": data.pageCname || "",
            "loginType": data.loginType || "",
            "fromCname": _this.getFromPortal(),
            "createDate": _this.reverseTime(_this.formateTime(new Date())), //服务器时间
            "moduleName": _this.defaultConfig.moduleName,
            "more1": _this.getSmartCardid(),
            "more2": _this.getStbId()
        };
        params = _this.checkObj(_this.getDefaultInfoObj(), params);
        params = _this.checkObj(params, data);
        _this.setLogger(loggerUrl, params);
    },
    /**
     * 上传订购成功日志，小包数据库日志，有可能接口java那边删除未部署
     * @param data
     *
     *
     *     data =  {
                "fromPortal" : "pid值",//页面入口名称，最好英文加数字                                         非必填 （默认取pid值）
                "type" : 0,//类型：0订购，1退订                                                               非必填（默认值为0）
                "cid" : "-1",//点播内容。ID，音乐ID，videoID                                                  必填
                "ename" : "",//内容英文名称                                                                   必填
                "cname" : "",//中文名                                                                         必填
                "cstyle" : 1,//内容风格。1卡通2机甲。。。                                                   必填（如果风格不确定，可不填）
                "prodId" : _this.defaultConfig.prodId,//订购产品id                                            必填（如果只有一种计费id，可不填）
                "prodName" : _this.defaultConfig.prodName,//订购产品名称,                                     必填（如果只有一种计费id，可不填）
                "payType" : _this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付         必填（如果只有一种计费id，可不填）
                "feeType" : _this.defaultConfig.feeType,//计费方式，1包月，2按次                              必填（如果只有一种计费id，可不填）
                "startTime" : "20180927135452" ,//yyyyMMddHHmmss订购时间24小时制                              非必填（默认取当前时间，如）
                "endTime" : "",//yyyyMMddHHmmss退订时间24小时制                                               非必填
                "source" : 1,//来源：1.EGP,2.专题，3.活动，4，搜索结果                                      必填
                "sourceName" : "videoDetail_221",//来源页面名称                                               必填
            }
            orderJs.uploadOrderSuccess({
                orderState:3
            })


             orderJs.uploadOrderSuccess({
                orderState:3
            })
     */
    uploadOrderSuccess: function (data) { //上传订购成功
        var _this = this;

        data = data || {};
        var loggerUrl = _this.loggerUrl + "userOrder";
        params = {
            "userId": _this.getUserId(), //页面入口名称，最好英文加数字
            "moduleName": _this.defaultConfig.prodName, //订购产品名称,
            "cityCode": _this.getCityCode(), //城市编码
            "cityName": _this.defaultConfig.cityName, //城市中文名
            "orderState": data.orderState || "0", //订购标识：0成功；1失败；2取消
            "orderMessage": data.orderMessage || "-1", //订购说明（可为空）
            "productType": _this.defaultConfig.feeType, //计费方式，1包月，2按次
            "productId": data.productId || _this.defaultConfig.prodId, //订购产品id_this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付
            "contentName": orderSource() || _this.getCommPageEname(), //订购内容名称
            "contentId": CT.requestValue("activityId") || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commonPageId, //订购内容ID
            "createDate": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "errorMsg": "", //错误描述
            "startTime": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "unsubscribeDate": "",
            "contentType": data.contentType || 0,
            "more1": data.more1 || "",
            "more2": _this.getStbId(),
            "more3": data.more3 || "",
            "more4": data.more4 || ""
        };
        /*params = _this.checkObj(_this.getDefaultInfoObj(),params);
        params = _this.checkObj(params,data);
        var sendData = {
            "data" : encodeURIComponent(CT.jsonToString(params))
        }*/
        _this.setLogger(loggerUrl, params);
    },
    /**
     * 上传订购失败日志
     * @param data
     *           data =  {
                "cid" : "-1",//点播内容。ID，音乐ID，videoID                                                  必填
                "ename" : "",//内容英文名称                                                                   必填
                "cname" : "",//中文名                                                                         必填
                "cstyle" : 1,//内容风格。1卡通2机甲。。。                                                   必填（如果风格不确定，可不填）
                "prodId" : _this.defaultConfig.prodId,//订购产品id                                            必填（如果只有一种计费id，可不填）
                "prodName" : _this.defaultConfig.prodName,//订购产品名称,                                     必填（如果只有一种计费id，可不填）
                "payType" : _this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付         必填（如果只有一种计费id，可不填）
                "feeType" : _this.defaultConfig.feeType,//计费方式，1包月，2按次                              必填（如果只有一种计费id，可不填）
                "successFlag" : 2,//成功标识，1：成功，2：失败,                                               非必填
                "errorCode" : 3,//错误码,1停机2欠费，3其它原因                                                非必填（可以知道订购失败原因，必填）
                "errorMsg" : "",//错误描述                                                                    非必填（可以知道订购失败原因，必填）
                "startTime" : "20180927135452" ,//yyyyMMddHHmmss订购时间24小时制                              非必填（默认取当前时间，如）
                "endTime" : "",//yyyyMMddHHmmss退订时间24小时制                                               非必填
                "source" : 1,//来源：1.EGP,2.专题，3.活动，4，搜索结果                                      必填
                "sourceName" : "videoDetail_221",//来源页面名称                                               必填
            }
     */
    uploadOrderFail: function (data) {
        var _this = this;
        data = data || {};
        data.orderState = "0"; //成功标识，1：成功，0：失败,
        data.errorCode = data.errorCode || 3; //错误码,1停机2欠费，3其它原因
        data.errorMsg = data.errorMsg || ""; //错误描述
        _this.uploadOrderSuccess(data);

    },
    /**
     * 上传退订日志
     * @param data
     *       data =  {
                "cid" : "-1",//点播内容。ID，音乐ID，videoID                                                非必填
                "ename" : "",//内容英文名称                                                                 非必填
                "cname" : "",//中文名                                                                       非必填
                "cstyle" : 1,//内容风格。1卡通2机甲。。。                                                   非必填（如果风格不确定，可不填）
                "prodId" : _this.defaultConfig.prodId,//订购产品id                                          必填（如果只有一种计费id，可不填）
                "prodName" : _this.defaultConfig.prodName,//订购产品名称,                                   必填（如果只有一种计费id，可不填）
                "payType" : _this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付       必填（如果只有一种计费id，可不填）
                "feeType" : _this.defaultConfig.feeType,//计费方式，1包月，2按次                            必填（如果只有一种计费id，可不填）
                "successFlag" : null,//成功标识，1：成功，2：失败,                                          非必填
                "errorCode" : null,//错误码,1停机2欠费，3其它原因                                           非必填（可以知道订购失败原因，必填）
                "errorMsg" : null,//错误描述                                                                非必填（可以知道订购失败原因，必填）
                "startTime" : "" ,//yyyyMMddHHmmss订购时间24小时制                                          非必填（默认取当前时间，如过是退订，必填传空""）
                "endTime" : "20180927143021",//yyyyMMddHHmmss退订时间24小时制                                               必填(获取当前时间)
                "source" : 1,//来源：1.EGP,2.专题，3.活动，4，搜索结果                                      非必填
                "sourceName" : "videoDetail_221",//来源页面名称                                             必填
            }
     */
    uploadOrderUnsubscribeTime: function (data) { //上传退订
        var _this = this;
        data = data || {};
        data.type = 1; //类型：0订购，1退订
        data.successFlag = null, //成功标识没有
            data.endTime = _this.formateTime(new Date()); //结束时间
        _this.uploadOrderSuccess(data);
    },
    saveOrderInfo : function(){
        var _this = this;
        var backPrePage = window.location.href;
        CT.setCookie("backPrePage", backPrePage);
        //记录订购来源
        var orderSource = xjDataLog.getOrderSource();
        try{
            var intelligent = CT.getCookie("intelligent");
            if(curFocus.TempData && curFocus.TempData.recommendTrackName && curFocus.TempData.recommendTrackName.indexOf("intelligent") > -1 && curFocus.TempData.recommendDisplayValue != undefined && curFocus.TempData.recommendDisplayValue != null) {
                var __params = curFocus.TempData.recommendTrackName.split("&");
                if(__params.length >= 5) {
                    // var recommendDisplayType = curFocus.TempData.recommendDisplayType;
                    // contentId = params.contentId.split("&")[0];recommendDisplayValue
                    // CT.querySearchUrlKey(window.location.href,"contentId") + "&" + focusLocation + "&" + curFocus.TempData.recommendDisplayValue;
                    var orderSourceObj = eval("(" + orderSource + ")");
                    orderSourceObj.more4 = "intelligent";
                    orderSourceObj.more2 = (CT.querySearchUrlKey(window.location.href,"contentId") || curFocus.TempData.recommendDisplayType) + "&" + __params[2]+"&" + curFocus.TempData.recommendDisplayValue;
                    orderSource = ajax.jsonToString(orderSourceObj);
                    CT.delCookie("intelligent");
                }
            } else if(intelligent && intelligent.indexOf("&") > -1){
                var _params = intelligent.split("&");
                if(_params.length >= 3) {
                    var orderSourceObj = eval("(" + orderSource + ")");
                    if(orderSourceObj.contentId == _params[2] || CT.querySearchUrlKey(window.location.href,"cartoonId") == _params[2]) {
                        orderSourceObj.more4="intelligent";
                        orderSourceObj.more2=intelligent;
                        orderSource = ajax.jsonToString(orderSourceObj);
                    } else {
                        CT.delCookie("intelligent");
                    }
                }
            } else {
                CT.delCookie("intelligent");
            }
        }catch(e){}
        CT.setCookie('fromOrder',orderSource);
    },

     /**
     * wyy 获取订购来源
     */
    getOrderFromType: function () {
        var _this = this;
        var curPage = document.URL;
        //订购来源类型  1.专题，2.活动，3卡通，4坑位，66其它

        var pageType = 66;
        if (curPage.indexOf("springRecommendPage") > -1) {
            pageType = 1;
        } else if (curPage.indexOf("activity") > -1) {
            pageType = 2;
        } else if (curPage.indexOf("playVideo") > -1) {
            pageType = 3;
        } else {
            pageType = 4;
        }
        return pageType;
    },
    /**
     * 获取当前坑位焦点信息
     * @param {*} tempData 
     */
    getCurFocusInfo : function(tempData){
        var _this = this;
        tempData = tempData || curFocus || {};
        var curFocusInfo = {};
        switch(+tempData.recommendDisplayType){
            case 0:
                 curFocusInfo = {
                    CONTENT_CNAME: tempData.recommendDisplayName ,
                    CONTENT_ENAME: "game_" + tempData.recommendDisplayValue,
                };
                break;
            case 1:
                curFocusInfo = {
                    CONTENT_CNAME: tempData.recommendDisplayName ,
                    CONTENT_ENAME: "cartoon_" + tempData.recommendDisplayValue,
                };
                break;
            case 2:
                curFocusInfo = {
                    CONTENT_CNAME: tempData.recommendDisplayName ,
                    CONTENT_ENAME: "video_" + (tempData.recommendDisplayValue || recommendmap.id),
                };
                break;
            case 3:
                curFocusInfo = {
                    CONTENT_CNAME: tempData.recommendDisplayName ,
                    CONTENT_ENAME: "other" ,
                };
                
                break;
            case 4:
                curFocusInfo = {
                    CONTENT_CNAME: "通用页面" ,
                    CONTENT_ENAME: tempData.commpageName ,
                };
                
                break;
            case 5:
                curFocusInfo = {
                    CONTENT_CNAME:  tempData.recommendDisplayName,
                    CONTENT_ENAME: "activity_" + tempData.recommendDisplayValue ,
                };
                break;
            case 6:
                curFocusInfo = {
                    CONTENT_CNAME:  tempData.recommendDisplayName,
                    CONTENT_ENAME: tempData.commpageName ,
                };
                break;
            case 7:
                curFocusInfo = {
                    CONTENT_CNAME:  "全部内容页",
                    CONTENT_ENAME: tempData.commpageName ,
                };
                break;
           
            default:
                curFocusInfo = {
                    CONTENT_CNAME:  "坑位",
                    CONTENT_ENAME: curFocus.recommendTrackName ||  tempData.FocusID && tempData.FocusID.split("_")[3] ,
                };
        }

        return curFocusInfo;
    },
    /**
     * 记录订购来源
     */
    getOrderSource: function () {
        var _this = this;
        var config = xjDataLog.defaultConfig || {};
        var pageInfo = AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo || {};
        var focusData = curFocus && curFocus.TempData || {};
        var userId = _this.getUserId();
        var stbId = xjDataLog.getStbId();
        var orderS = {
            userNetType: config.userNetType,
            moduleName: config.moduleName,
            cityCode: config.cityCode,
            cityName: config.cityName,
            userId: userId,
            stbId: stbId,
            spId: config.spId,
            spName: config.spName
        }
        /**
            1)专题 fromeType为1 有二种情况，
            专题页面跳订购，from_XX为专题信息，content_xx为坑位的内容信息
            2)活动
            fromeType为2
            活动详情页面跳订购，from_XX为活动信息，content_xx不传
            3）卡通
            新的：详情页面跳订购，from_XX传成卡通信息，content_xx传成卡通信息
            4）坑位
            坑位跳订购，from_XX为页面信息，content_xx为坑位的内容信息
            坑位里面是卡通，content_xx为卡通信息
            如果是其它，content_xx对类推
            5）其它
            其它跳订购，from_XX为页面信息，content_xx为其它的内容信息
         */
        switch (_this.getOrderFromType()) {
            case 1:
                orderS.fromType = 1;
                orderS.fromId = pageInfo.commonPageId;
                orderS.fromCname = pageInfo.commPageCname;
                orderS.fromEname = pageInfo.commPageEname;
                orderS.contentType = 1;
                orderS.contentId = focusData.recommendTrackName || focusData.recommendDisplayValue || curFocus.recommendTrackName || curFocus.FocusID && curFocus.FocusID.split("_")[3] ;
                orderS.contentCname = "";
                orderS.contentEname = "";
                break;
            case 2:
                //活动先不做
                orderS.fromType = 2;
                orderS.fromId = pageInfo.commonPageId || CT.requestValue("activityId");
                orderS.fromCname = pageInfo.commPageCname || CT.requestValue("contentCname") || "";
                orderS.fromEname = pageInfo.commPageEname || CT.requestValue("contentEName") || "";
                orderS.contentType = 2;
                orderS.contentId = curFocus.recommendTrackName || curFocus.FocusID;
                orderS.contentCname = pageInfo.commPageCname || CT.requestValue("contentCname") || "";
                orderS.contentEname = pageInfo.commPageEname || CT.requestValue("contentCname") || "";
                break;
            case 3:
                orderS.fromType = 3;
                orderS.fromId = Page.cartoonData.id;;
                orderS.fromCname = Page.cartoonData.cartoonCname;
                orderS.fromEname = Page.cartoonData.cartoonEname;
                orderS.contentType = 3;
                orderS.contentId = Page.cartoonData.id;
                orderS.contentCname = Page.cartoonData.cartoonEname;
                orderS.contentEname = Page.cartoonData.cartoonCname;
                break;
            case 4:
                orderS.fromType = 4;
                orderS.fromId = pageInfo.commonPageId;
                orderS.fromCname = pageInfo.commPageCname;
                orderS.fromEname = pageInfo.commPageEname;
                orderS.contentType = 4;
                orderS.contentId = focusData.recommendTrackName || focusData.recommendDisplayValue || curFocus.recommendTrackName || curFocus.FocusID && curFocus.FocusID.split("_")[3];
                orderS.contentCname = _this.getCurFocusInfo().CONTENT_CNAME;
                orderS.contentEname = _this.getCurFocusInfo().CONTENT_ENAME;
                break;
            default:
                break;
        }
        return ajax.jsonToString(orderS)
    },
    //上传订购结果日志，大数据
    uploadOrderSuccessBigData: function (data) {
        var _this = this;
        var orderSourceObj = {};
        try {
            orderSourceObj = CT.stringToJson(CT.getCookie("fromOrder")) || {};
        } catch (error) {
            
        }
        data = data || {};
        params = {
            "userId": _this.getUserId(), //页面入口名称，最好英文加数字
            "userNetType": _this.defaultConfig.userNetType || "",
            "moduleName": xjDataLog.defaultConfig.moduleName,
            "macId": xjDataLog.getMac() || "",
            "cityCode": _this.getCityCode() || "", //城市编码
            "cityName": _this.defaultConfig.cityName || "", //城市中文名
            "stbId": _this.getStbId() || "",
            "contentId": orderSourceObj.contentId, //订购内容ID
            "contentType": orderSourceObj.contentType || "",
            "contentEname": orderSourceObj.contentEname || "",
            "contentCname": orderSourceObj.contentCname || "",
            "fromType": orderSourceObj.fromType || "",
            "fromId": orderSourceObj.fromId || "",
            "fromCname": orderSourceObj.fromCname || "",
            "fromEname": orderSourceObj.fromEname || "",
            "spId": orderSourceObj.spId || _this.defaultConfig.spId,
            "spName": orderSourceObj.spName || _this.defaultConfig.spName,
            "orderState": data.orderState || "0", //订购标识：0成功；1失败；2取消
            //未验证确定的
            "orderStateMsg": data.orderStateMsg || "" ,//订购返回结果
            "orderPrice": data.orderPrice || "",//订购价格
            "orderType": data.autoSub || _this.defaultConfig.feeType, //计费方式，1包月，2按次
            "orderId": data .orderId || '',
            "productId": data.productId || _this.defaultConfig.prodId, //订购产品id_this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付
            "transId": data.transId || '',
            // 时间参数局方不确定，我们
            // "createTime": new Date().getTime(),
            // "startTime": new Date().getTime(),
            // "endTime": new Date().getTime(),
            // "payTime": new Date().getTime(),
            // "unsubscribeTime": new Date().getTime(),
            // "newUserFlag": 0,//新增用户标识：0否，1是
            "description": data.orderMessage || "-1", //商品信息    沿用：订购说明（可为空）
            // "sign": '',//请求签名
            "payType": data.payType || _this.defaultConfig.payType, //支付方式(1:话费支付  2:积分  3:支付宝  4:微信支付  5第3方支付66:其他)
            "autoSub": data.autoSub || _this.defaultConfig.feeType,//是否连续包月(0:非自动续费  1:自动续订)
            "more1": data.more1 || '',
            "more2": data.more2 || orderSourceObj.more2 || '',
            "more3": data.more3 || '',
            "more4": data.more4 || orderSourceObj.more4 ||''

        };
        // _this.setLogger(AjaxConfig.saveCommonOrderLog, params);

        var ajaxConfig = {
            method: 'get'
        };
        var callback = function() {};
        var postData = {
            url: AjaxConfig.saveCommonOrderLog,
            params: params,
            ajaxConfig: ajaxConfig
        };
        interface.ajax(postData, callback);
    },
    /**
     * 上传游戏结束日志
     * @param data
     *      data = {
     *           "startTime" : "20180927141414",//视频开始时间                   非必填（如果apk方面能传来参数，直接用apk参数）
     *           "endTime" : "20180927141414",//yyyyMMddHHmmss退订时间24小时制   非必填（如果apk方面能传来参数，直接用apk参数）
     *
     *      } 
     */
    uploadGameEndLog: function (data) {
        var _this = this;
        var loggerUrl = _this.loggerUrl + "setGameLog";
        data = data || {};
        var params = {
            "gameId": data.gameId, //游戏ID
            "gameCname": data.gameCname,
            "gameEname": data.gameEname,
            "stateTime": _this.formateTime(new Date()) - data.stateTime, //停留时间
            "createDate": _this.reverseTime(_this.formateTime(new Date())), //服务器时间
            "eventType": data.eventType
        };
        params.endDate = params.createDate;
        params = _this.checkObj(_this.getDefaultInfoObj(), params);
        _this.setLogger(loggerUrl, params);
    },
    /**
     * 上传视频结束日志
     * @param data
     *      data = {
     *           "startTime" : "20180927141414",//视频开始时间                   非必填（如果apk方面能传来参数，直接用apk参数）
     *           "endTime" : "20180927141414",//yyyyMMddHHmmss退订时间24小时制   非必填（如果apk方面能传来参数，直接用apk参数）
     *
     *      } 
     */
    uploadViodeEndLog: function (data) {
        var _this = this;
        var loggerUrl = _this.loggerUrl + "setPlayVideo";
        data = data || {};
        var params = {
            "cartoonId": data.cartoonId,
            "cartoonCname": data.cartoonCname,
            "cartoonEname": data.cartoonEname,
            "videoId": data.videoId,
            "videoCname": data.videoCname,
            "videoEname": data.videoEname,
            "startTime": data.startTime,
            "eventType": data.eventType,
            "moduleName": _this.defaultConfig.moduleName,
            "playId": data.playId,
            "playType": data.playType || 0,
            "createDate": _this.reverseTime(_this.formateTime(new Date())), //服务器时间
            "stayTime": data.stateTime || (new Date().getTime() - _this.startTime.getTime()), //停留时长
            "spName": data.spName,
            "spId": data.spId || "",
            "more2": _this.getStbId(),
            "more1": _this.getSmartCardid(),
        };
        params.endTime = params.createDate;
        params = _this.checkObj(_this.getDefaultInfoObj(), params);
        _this.setLogger(loggerUrl, params);
    },
    getSystemConfigByKey: function (callBack) {
        ajax.init({
            url: AjaxConfig.interfaceUrl + "/iptv-web-api/api/web/getSystemConfigByKey?key=sys_default_cartoon_ids",
            method: "GET",
            async: false,
            ContentType: "json",
            success: function (data) {
                /**
                 *  data：
                 * [{
                            "cartoonId" : 123,
                            "cartoonName" : "小浣熊",
                            "cartoonEname" : "xhx",
                            "videoId" : "123123",
                            "videoName" : "小浣熊01",
                            "videoCname" : "xhx01",
                            
                    },{
                        "cartoonId" : 123,
                        "cartoonName" : "小浣熊",
                        "cartoonEname" : "xhx",
                        "videoId" : "123123",
                        "videoName" : "小浣熊01",
                        "videoCname" : "xhx01",
                        
                    }]
                 */
                data = data || {};
                callBack && callBack(data);
            },
            fail: function (status) {
                //_this.writeInfo(status + "" + logUrl);

            }
        });
    },
    /**
     * 上传页面日志
     * @param data
     *          data = {
     *              userId : "6666", //用户id
     *              prePage : "aa.html",//前一个页面信息
     *              nextPage : "bb.html",//当前页面信息
     *              nextId : "123",//当前页面编号
     *              fromPid : "2"，//入口进入判断
     *              focus : "aa",//焦点位置
     *              onloadTime : "20170808000000",//进入时间
     *              leaveTime : "20171010000000",//离开页面时间
     *              stayTime : "11111111"
     *          }
     */
    uploadLogPage: function (data) {
        var _this = this;
        var loggerUrl = _this.loggerUrl + "setLogPage";
        var prePageInfoJson = _this.getPrePage();
        var pagePosition = eval("(" + prePageInfoJson.focusDivPos + ")") || {
            x: 0,
            y: 0
        };
        var startTime = prePageInfoJson.startTime || "0";
        data = data || {};
        var stateTime = (parseInt(_this.startTime.getTime()) - parseInt(startTime)) / 1000; // 单位s
        var params = {
            "pageEname": prePageInfoJson.commPageEname || "-1", //页面英文名称
            "pageCname": prePageInfoJson.commPageCname || "-1", //页面中文名称
            "nextPageCname": _this.commonPageInfo.commPageCname || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageCname, //下一个页面信息
            "nextPageEname": _this.getCommPageEname() || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commPageEname, //下一个页面英文名称
            "nextPageContentType": _this.getPageType(), //内容类型：0卡通，1游戏，2专题，3活动，4普通页面
            "nextPageContentId": CT.requestValue("activityId") || AjaxConfig.commonPageInfo && AjaxConfig.commonPageInfo.pageInfo.commonPageId || -1, //内容ID  
            "fromInfo": _this.getFromPortal(), //页面入口名称，最好英文加数字
            "stayTime": stateTime, //停留时长
            "focusLocation": prePageInfoJson.defaultFocus || "-1", //焦点位置
            "position": "X:" + pagePosition.x + "Y:" + pagePosition.y, //离开页面的位置信息，X和Y坐及其它,
            "more1": _this.getSmartCardid(), //卡号
            "more2": _this.getStbId() //设备号
        };
        params = _this.checkObj(_this.getDefaultInfoObj(), params);
        params = _this.checkObj(params, data);
        params.stateTime = _this.formateTime(new Date()) - _this.formateTime(_this.startTime);
        _this.setLogger(loggerUrl, params);
    },
    beforeUnload: function () { //页面离开前操作日志
        var _this = this;
        /** 上传埋点 */
        _this.startTime = new Date();
        _this.uploadLogPage();
        // 上传全局埋点

        window.entryTime = new Date().getTime();
        /*全屏页面日志拦截*/
        var url = window.location.href;
        if (url.indexOf('index.html') > -1) {
            CT.delCookie("logCollParam");
        }
        try {
            var __logCollParam = eval("("+CT.getCookie("logCollParam")+")")
            // if(xjDataLog.getPageType1() != 5){  //全屏播放页日志上传不在load事件
            if(__logCollParam.contentType != "video"){  //全屏播放页日志上传不在load事件
                /*页面加载 获取上一页信息，触发采集日志接口*/
                _this.logCollection((CT.getCookie("logCollParam")));
            }
        } catch(e){}
        /** 保存页面信息 */
        // if (!_this.isLoad) {
        //     window.addEventListener('beforeunload', function() { //页面离开事件
        //         _this.getPrePage();
        //         _this.isLoad = true;

        //         var json = ajax.jsonToString(new logCollParam(parseInt(((new Date().getTime()) - window.entryTime) / 1000)));
        //         CT.setCookie("logCollParam", (json));

        //     });
        // }


    },
    sendAjaxPost: function (url, postData, success, fail) {
        var _this = this;
        if (!postData) {
            interface.loggerInfo('接口：' + (url) + ' 的请求体为空！');
            return;
        }
        try {
            oAjax = new XMLHttpRequest();
        } catch (e) {
            oAjax = new ActiveXObject("Microsoft.XMLHTTP");
        };
        oAjax.open("POST", url, true);
        /*/post相比get方式提交多了个这个*/
        oAjax.setRequestHeader("Content-type", "application/json;charset=utf-8");
        /*//post发送数据*/
        oAjax.withCredentials = true;
        oAjax.send(ajax.jsonToString(postData).replace(/\s*/g, ""));
        oAjax.onreadystatechange = function () {
            /*/当状态为4的时候，执行以下操作*/
            if (oAjax.readyState == 4) {
                if (oAjax.status == 200) {
                    success && success(eval("(" + oAjax.responseText + ")"));
                } else {
                    fail && fail(status);
                }
            };
        };
    },

    logCollection: function (params) {
        var _this = this;
        if (typeof params != "object") {
            var params = eval("(" + params + ")");
        } else if (params == undefined || params == 'undefined' || params == null || params == 'null' || params == '') {
            return;
        } else if (params.userId == undefined || params.userId == 'undefined' || params.userId == null || params.userId == 'null' || params.userId == '') {
            return;
        }
        _this.setLogger(AjaxConfig.saveCommonLog,params);
        /*_this.sendAjaxPost(
            AjaxConfig.saveCommonLog,
            params,
            function (e) {

            },
            function (e) { }
        )*/
    },

    /******************************************  广西有线EPG方法开始 **********************************************/
    //********************************                                                  iPanel对象方法
    /*
        设置存储键值对。设置成功，返回 1；失败，返回#。示例中是键名为字符串，键值为数字
    */
    setGlobalVar: function (key, val) {
        var _this = this;
        var result = '';
        try {
          //  result = iPanel.setGlobalVar(key, val);
        } catch (error) {

        }
        return result;
    },
    /*
        获取 setGlobalVar 存储的值。获取成功，返回存储键值；失败，返回#。
    */
    getGlobalVar: function (key) {
        var _this = this;
        var result = '';
        try {
         //   result = iPanel.getGlobalVar(key);
        } catch (error) {

        }
        return result;
    },
    /*
        机顶盒默认情况下所有按键都可作为网页响应键使用，但当按键复用为 DVB 快捷键时，需要设置控制接口方可强制性作为网页响应键使用。
        目前 DVB 快捷键包括：
            返回键（'SEND_RETURN_KEY_TO_PAGE'）
            退出键（'SEND_EXIT_KEY_TO_PAGE'）
            首页键（'SEND_FIRSTPAGE_KEY_TO_PAGE'）
            点播键（'SEND_VOD_KEY_TO_PAGE'）
            高清键（'SEND_HD_KEY_TO_PAGE'）
            信息键（'SEND_INFO_KEY_TO_PAGE'）
            导视键（'SEND_HOMEPAGE_KEY_TO_PAGE'）
            电视键（'SEND_TV_KEY_TO_PAGE'）
            广播键（'SEND_RADIO_KEY_TO_PAGE'）
            声道键（'SEND_AUDIOMODE_KEY_TO_PAGE'）
            输出键（'SEND_OUTPUT_KEY_TO_PAGE'）
            股票键（'SEND_STOCK_KEY_TO_PAGE'）
            红键（'SEND_RED_KEY_TO_PAGE'）
            蓝键（'SEND_BLUE_KEY_TO_PAGE'）
            绿键（'SEND_GREEN_KEY_TO_PAGE'）
            黄键（'SEND_YELLOW_KEY_TO_PAGE'）
            SEND_ALL_KEY_TO_PAGE：全部 DVB 快捷键的控制接口，用于设置全部 DVB 快捷键是作为机顶盒DVB端的快捷键，还是作为网页响应键。
                    设置成功，返回 1；失败，返回#。
                    设置参数：1，将全部 DVB 快捷键释放，强制作为网页响应键使用。
                             0，全部 DVB 快捷键恢复默认使用。
        设置参数：
                    1，将按键键释放，作为网页响应键使用。
                    0，返按键恢复为 DVB 端快捷键使用。
        设置成功，返回 1；失败，返回#。
        设置用例：
            iPanel.setGlobalVar("SEND_YELLOW_KEY_TO_PAGE ","1");//将黄键释放，作为网页响应键使用。
            iPanel.setGlobalVar("SEND_YELLOW_KEY_TO_PAGE ","0");//黄键恢复为 DVB 端快捷键使用。
            我们封装后可调用：
                xjDataLog.setGlobalVar("SEND_YELLOW_KEY_TO_PAGE ","1");//将黄键释放，作为网页响应键使用。
                xjDataLog.setGlobalVar("SEND_YELLOW_KEY_TO_PAGE ","0");//黄键恢复为 DVB 端快捷键使用。


        本函数释放固定几个键值给网页端用：
            返回键、HOME键
    */
    freeSomeKey: function (num) {
        var _this = this;
        num = num || '1';
        var freeKeysArr = ['SEND_RETURN_KEY_TO_PAGE', 'SEND_EXIT_KEY_TO_PAGE', 'SEND_FIRSTPAGE_KEY_TO_PAGE'];
        freeKeysArr.forEach(function (item) {
            _this.setGlobalVar(item, num);
        });
    },
    //********************************                                               guangxi 对象方法
    /*
        获取机顶盒号字符串（device_id）。获取成功，返回机顶盒号字符串，格式如4290000001（十一位）；失败，返回#。
    */
    getStbNumGX: function (key) {
        var _this = this;
        var result = '';
        try {
            // result = guangxi.getStbNum();;
        } catch (error) {

        }
        return result;
    },
    /******************************************  广西有线EPG方法结束 **********************************************/
};

xjDataLog.init(); //调用日志埋点方法
/*********************************************************************************************************/
/*
 *  * 
 *   *   通用页面数据采集接口 初始化参数
 *    *   Created By :   wyy
 *     *   Date :  Tue Sep 24 2019
 *      */
var setLoggerInfo = {
    pageInfoLog: null,
    playStatus: {},
    videoDerail: {},
}

function logCollParam(stateTime) {
    var prePageInfo = CT.getCookie("logCollParam") && eval("(" + (CT.getCookie("logCollParam")) + ")");
    if (prePageInfo != null) {
        window.prePageInfoObj = {
            "prevPageContentId": prePageInfo.contentId || "-1",
            "prevPageContentType": prePageInfo.contentType || "-1",
            "prevPageEname": prePageInfo.contentEname || "-1",
            "prevPageCname": prePageInfo.contentCname || "-1",
        };
    }

    /*cartoon卡通，video视频，game游戏，special专题，activity活动，page普通页面，loginIn 登录，loginOut 登出*/
    var typeObj = {
        '1': 'page',
        '2': 'special',
        '3': 'activity',
        '4': 'game',
        '5': 'video',
        '6': 'other',
        '7': 'cartoon',
        '8': 'loginIn',
        '9': 'loginOut',
        '10': 'order',
    };
    this.stateTime = stateTime || 0; // 秒
    this.userNetType = xjDataLog.defaultConfig.userNetType; //运营商
    this.cityCode = xjDataLog.defaultConfig.cityCode; //城市code
    this.cityName = xjDataLog.defaultConfig.cityName; //城市名称
    this.moduleName = xjDataLog.defaultConfig.moduleName; //产品模块：平台：1.炫力动漫，2.炫佳乐园，3.乐玩堂，4.炫麦唱吧，5.小海贝乐园，66.其他
    this.spId = xjDataLog.defaultConfig.spId; //SP编号
    this.spName = xjDataLog.defaultConfig.spName; //城市名称

    this.userId = xjDataLog.getUserId();
    this.macId = xjDataLog.getMac(); //物理地址
    this.stbId = xjDataLog.getStbId(); //机顶盒ID
    this.apkVersion = xjDataLog.getSTBType(); //xjDataLog.getVersion(); //用户APK下载来源中文名称
    this.apkFromName = xjDataLog.getVersion(); //用户APK下载来源中文名称
    this.fromInfo = xjDataLog.getFromPortal(); //来源信息，局方入口 或者外部入口信息
    this.position = xjDataLog.getDivPosition(curFocus.FocusID).x + ',' + xjDataLog.getDivPosition(curFocus.FocusID).y;
    this.prevPageContentId = window.prePageInfoObj.prevPageContentId;
    this.prevPageContentType = window.prePageInfoObj.prevPageContentType;
    this.prevPageEname = window.prePageInfoObj.prevPageEname;
    this.prevPageCname = window.prePageInfoObj.prevPageCname;
    var NextId = xjDataLog.getNextId(); //当前播放的视频或者游戏的ID
    this.contentId = NextId != null && CT.dataType(NextId) === 'object' ? NextId.NextId:NextId; 
    this.contentType = typeObj[xjDataLog.getPageType1()]; //页面类型：1.普通页面，2.专辑，3活动，4游戏，5片单，6.其它,7.卡通，8.登录，9.登出
    this.contentEname = CT.requestValue("contentEName") || 'other';
    this.contentCname = CT.requestValue("contentCName") || '其他'
    if(xjDataLog.getPageType1() == 5) {
        //全屏播放,contentId记录为cartoonId
        // {cartoonId:cartoon_id,videoId:videoId}
        if (CT.dataType(window.basePageInfo) == 'object' && CT.dataType(basePageInfo.cartoonDetail) == 'object') {
            this.contentId = basePageInfo.cartoonDetail.id || NextId.NextId;
            this.contentEname = basePageInfo.cartoonDetail.cartoonEname; //英文名
            this.contentCname = basePageInfo.cartoonDetail.cartoonCname; //英文名
        } else if(CT.dataType(Page) == 'object' && Page.cartoonData){
            this.contentId = NextId.cartoonId || NextId.NextId;
            this.contentEname = Page.cartoonData.cartoonEname; //英文名
            this.contentCname = Page.cartoonData.cartoonCname; //英文名
        }
    } else if(xjDataLog.getPageType1() == 7) {
        if (CT.dataType(window.basePageInfo) == 'object' && CT.dataType(basePageInfo.cartoonDetail) == 'object') {
            this.contentEname = basePageInfo.cartoonDetail.cartoonEname; //英文名
            this.contentCname = basePageInfo.cartoonDetail.cartoonCname; //英文名
        } else if(CT.dataType(page) == 'object' && page.cartoonData){
            this.contentEname = page.cartoonData.cartoonEname; //英文名
            this.contentCname = page.cartoonData.cartoonCname; //英文名
        }
    } else if (setLoggerInfo.pageInfoLog && CT.dataType(setLoggerInfo.pageInfoLog.pageInfo) == 'object') {
        this.contentEname = setLoggerInfo.pageInfoLog.pageInfo.commPageEname || setLoggerInfo.pageInfoLog.pageInfo.pageTrackName || curPageInfo.commPageEname; //pageInfo页面英文名
        this.contentCname = setLoggerInfo.pageInfoLog.pageInfo.commPageCname || curPageInfo.commPageCname;
    }

    this.playId = setLoggerInfo.playStatus.playId;
    this.playType = setLoggerInfo.playStatus.playType; //0被动播放  1全屏播放
    this.eventType = setLoggerInfo.playStatus.eventType; //start:开始，playing:播放中，end:结束
    this.playName = setLoggerInfo.playStatus.playName;
    if (curFocus.TempData != null || curFocus.recommendTrackName != "") {
        try {
            this.focusLocation = curFocus.TempData && curFocus.TempData.recommendTrackName || curFocus.recommendTrackName  || curFocus.FocusID.match(/hands_x0_y0_([\s\S]*?)_/)[1];
        } catch (e) { }
    }
}
window.prePageInfoObj = {
    "prevPageContentId": '',
    "prevPageContentType": '',
    "prevPageEname": '',
    "prevPageCname": '',
};
window.curPageInfo = {
    "commPageCname": "",
    "commPageEname": "",
    "contentId": "0",
    "contentType": "1"
}
/** 用于上传视频开始以及播放中 */
function commonUpLoadVideo(obj) {
    // var json = eval("(" + (CT.getCookie("logCollParam")) + ")");
    var json = new logCollParam(obj.stateTime);
    json.prevPageCname = json.contentCname;
    json.prevPageEname = json.contentEname;
    json.prevPageContentId = json.contentEname;
    json.prevPageContentType = json.contentType;
    var __cartoonData = {};
    if(Page.cartoonData){
        __cartoonData = Page.cartoonData;
        json.spId = __cartoonData.cspInfo.cpCode;
        json.spName = __cartoonData.cspInfo.cpCname;
    }else{
      json.spId = obj.spId;
      json.spName = obj.spName;
    }
    json.playId = obj.playId;
    json.playType = obj.playType;
    json.eventType = obj.eventType;
    json.contentId = obj.contentId + '_' + obj.isFree;
    json.playName = obj.playName;
    json.stateTime = obj.stateTime || 0;
    json.contentEname = obj.cartoonEname;
    json.contentCname = obj.cartoonCname;
    json.contentType = "video";
    
    /** 开始播放 */
    /** 上传数据 */
    xjDataLog.logCollection(ajax.jsonToString(json));
}

function orderSource() {
    var backPrePage = CT.getCookie("backPrePage") || "";
    var fromPage = xjDataLog.getPageUrlName(backPrePage);
    if (backPrePage.indexOf("cartoonId") > -1) {
        var cartoonId = xjDataLog.querySearchUrlKey(backPrePage, "cartoonId");
        fromPage += "_" + cartoonId;
    } else if (backPrePage.indexOf("gameId") > -1) {
        var gameId = xjDataLog.querySearchUrlKey(backPrePage, "gameId");
        fromPage += "_" + gameId;
    } else if (backPrePage.indexOf("activity") > -1) {
        var activityId = xjDataLog.querySearchUrlKey(backPrePage, "activityId");
        fromPage += "_activityId_" + activityId;
    } else {
        var contentName = xjDataLog.querySearchUrlKey(backPrePage, "contentEName");
        fromPage += "_" + contentName;
    }
    return fromPage
}


window.addEventListener('unload', function () { //页面离开事件

    if (!xjDataLog.isLoad) {
        xjDataLog.getPrePage();
        xjDataLog.isLoad = true;
        var json = ajax.jsonToString(new logCollParam(parseInt(((new Date().getTime()) - window.entryTime) / 1000)));
        CT.setCookie("logCollParam", (json));
    }
});
