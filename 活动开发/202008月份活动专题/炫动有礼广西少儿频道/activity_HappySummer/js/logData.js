var xjDataLog = {
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
    isJsp: false, //是否为jsp页面
    isRecommend: true, //是否引用之前的参数
    loggerUrl: AjaxConfig.loggerUrl, //上传日志接口
    insertUserUrl: AjaxConfig.insertUserUrl, //新增用户接口
    //页面信息对象，页面获取到信息后，直接赋值  outJSON[0].pageInfo对象中的信息
    //{pageTemplateId: 294,commPageId: 303,pageTemplateCname: "全部内容新版20180821",templatePic: "/XJCartoonFileManager_test/UpAppGame/2/201808211344302181.jpg",pageTemplateEname: "all",pageTemplateBgpic: /XJCartoonFileManager_test/UpAppGame/2/201808211344594874.jpg",templateId: null,templateUrl: null,booleanUp: 2,startTime: "2018-08-21 13:51:22",endTime: "2021-08-22 13:51:22",booleanTimeperiod: 0,timeperiodStartTime: ull,timeperiodStartWeek: null,timeperiodEndTime: null,timeperiodEndWeek: null,commPageCname: "全部内容新版20180821",commPageEname: "AllContent_20180821",nextCommPageUrl: "0",prevCommPageUrl: "0",createTime: "2018-08-21 3:42:53",filemTime: "2018-08-21 13:43:36",more1: null,more2: null}
    commPageInfo: {},
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
        "cityCode": "",
        //用户城市
        "cityName": "",
        //牌照方
        "playFrom": "NEWTV",
        //牌照方所在城市
        "playFromCity": "52",
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
        'EC6108V9U_ca_hbjlt': 'HW' // 华为
    },
    isLoad: false, // 上传页面日志回调判断
    /**
     * 鉴权日志
     * @param option
     */
    setUserAuthLogoInfo: function (option) {
        var _this = this;
        var option = option || {};
        var loggerUrl = _this.loggerUrl + "userAuth";
        var params = {
            "userId": option.userId || _this.getUserId(), //页面入口名称，最好英文加数字
            "authState": option.authState + "" || "1", //鉴权标识：0失败，1成功，2退订
            "authFrom": option.authFrom || "", //鉴权来源
            "contentId": CT.requestValue("contentId"), //鉴权内容ID
            "contentType": 0, //内容类型：0卡通，1游戏，2专题，3活动，4普通页面
            "authStateCname": option.authStateCname || "", //第3方返回的鉴权结果
            "productInfo": option.productInfo || "", //鉴权的产品编码
            "cityCode": _this.getCityCode(), //城市编码
            "cityName": _this.defaultConfig.cityName, //城市中文名
            "moduleName": _this.defaultConfig.prodName, //鉴权产品名称,
            "createDate": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "successFlg": option.successFlg || "", //成功标识，1：成功，0：失败
            "resultCode": option.resultCode || "", //错误码
            "resultMsg": option.resultMsg || "", //错误描述
            "more1":option.more1||"",
            "more2":option.more2||"",
            "more3":option.more3||"",
            "more4":option.more4||""
        };

        _this.setLogger(loggerUrl, params);
    },


    init: function (option) {
        var _this = this;
        _this.startTime = new Date();
        window.addEventListener("load", function (ev) {
            try {

                _this.commPageInfo = AjaxConfig.commonPageInfo.data.pageInfo || {};
            } catch (e) {}

        })
        _this.beforeUnload(); //离开页面前日志操作
    },
    /**
     * 获取盒子STBType
     * */
    getSTBType: function () {
        var _this = this;
        try {
            var STBType = Authentication.CUGetConfig("STBType")
        } catch (e) {

        }
        var name = _this.STBTypes[STBType] || 0;
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
        } else if (curPage.indexOf("springRecommendPage") > -1) {
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
        var pageType = 1;
        if (curPage.indexOf("activityId") > -1) {
            pageType = 3;
        } else if (curPage.indexOf("game") > -1) {
            pageType = 1;
        } else if (curPage.indexOf("springRecommendPage") > -1) {
            pageType = 2;
        } else if (curPage.indexOf("playVideo.html") > -1) {
            pageType = 1;
        } else if (curPage.indexOf("loginPortal") > -1) {
            pageType = 1;
        } else if (curPage.indexOf("videoDetail") > -1) {
            pageType = 1;
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
        var commPageEname = _this.commPageInfo.commPageEname || CT.requestValue("contentEName");
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
                commPageEname = "activityId_" + CT.requestValue("activityId") + "_" + CT.requestValue("contentEName");
            default:
                break;
        }
        return commPageEname || 0;
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
            } catch (e) {}
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
    //获取用户ID
    getUserId: function () {
        var _this = this;
        var userId = "";
        userId = CT.getCookie("userId");
        if (!userId || userId == "-1") {
            try{
                userId = hardware.STB.serialNumber;
            }catch(e){
            }
        }
        return userId || "test001";
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
        return 'xjly';
    },
    /**
     *      * 获取apk版本号
     *           */
    getVersion: function () { //获取版本号
        var _this = this;
        var version = "";
        try {
            /*获取系统版本号*/
        } catch (e) {}
        return version || "v0.0"
    },
    /*获取token*/
    getUserToken: function () {
        var _this = this;
        var userToken = "";
        userToken = CT.getCookie("userToken");
        if (!userToken) {
            try {
                userToken = Authentication.CUGetConfig('UserToken');
                CT.delCookie("userToken");
                CT.setCookie("userToken", userToken);
            } catch (e) {}
        }
    },
    //获取mac
    getMac: function () {
        var _this = this;
        var mac = "";
        mac = CT.getCookie("mac");
        if (!mac) {
            try {
                mac = Authentication.CUGetConfig('MAC');
            } catch (e) {}
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
        userPhone = CT.getCookie("userId");
        if (!userPhone) {
            try {
                //系统获取userPhone的方法
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
        stbId = CT.getCookie("stbId");
        if (!stbId) {
            try {
                Authentication.CUGetConfig('stbID');
            } catch (e) {

            }
        }
        return stbId || _this.defaultConfig.sn;
    },
    //获取城市编号
    getCityCode: function () {
        var _this = this;
        var cityCode = "";
        try {
            // cityCode = CITV.loginInfo.areaCode;
            //  if (!cityCode) {
            cityCode = Utility.getSystemInfo("ARC");
            //    }
        } catch (e) {

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


            } catch (e) {}
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
            } catch (e) {}
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
        var nextPageInfo = "prePageUrl=" + nextPage + "&commPageEname=" + (_this.getCommPageEname() || CT.requestValue("contentEName")) + "&commPageCname=" + (_this.commPageInfo.commPageCname || CT.requestValue("contentCName")) + "&startTime=" + _this.startTime.getTime() + "&defaultFocus=" + curFocus.FocusID + "&focusDivPos=" + ajax.jsonToString(_this.getDivPosition(curFocus.FocusID));
        nextPageInfo += "&fl=" + ((curFocus.TempData && curFocus.TempData.recommendTrackName) || curFocus.FocusID || "-1");
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
	 * 	"pageEname" "pageCname"_this.commPageInfo.commPageCname
	 "nextPageCname":_this.commPageInfo.commPageCname || "-1",//下一个页面信息
			"nextPageEname":_this.commPageInfo.commPageEname || "-1",//下一个页面英文名称
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
                    contentId = setLoggerInfo.pageInfoLog.data.pageInfo.contentId
                } catch (error) {

                }
            }
        }

        if (game_id) {
            nextId = game_id;
        } else if (videoId) {
            nextId = videoId;
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
        var pageName = '';
        if (url.indexOf('?') > -1) {
            if (_this.isJsp) { //jsp页面
                pageName = _this.querySearchUrlKey(url, 'commPageId');
                if (pageName) {
                    pageName = 'commPageId_' + pageName;
                } else {
                    pageName = 'action_' + _this.querySearchUrlKey(url, 'action');
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
                if (curPage.indexOf("GTmusic") > -1 || curPage.indexOf("generalTemplate") > -1) {
                    var action = _this.querySearchUrlKey(curPage, "action");
                    var commPageId = _this.querySearchUrlKey(curPage, "commPageId");
                    pageName += "_action_" + action + "_commPageId_" + commPageId;
                } else if (curPage.indexOf("activityId") > -1) {
                    var activityId = _this.querySearchUrlKey(curPage, "activityId");
                    pageName += "_activityId_" + activityId;
                }
            } catch (e) {}
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
                args += i + '=' + (params[i]);
            }
            /*var script = document.createElement("script");
             script.src = logUrl + '?' + args;
             document.body.appendChild(script);*/
            var img = new Image(0, 0);
            img.src = logUrl + '?' + args;
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
        if (date.length == 14 && !isNaN(Number(date))) {
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
        if (str && typeof Number(str) == "number") {

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
     * 用户离开平台日志
     * @param data
     *       data={
                 userId："666",  //用户编号                                        非必填
                "fromPortal" : "pid_version", // 页面入口名称，最好英文加数字      非必填，默认取pid值
                "page" : "loginportal_xxx", //必传，登陆的页面名称/退出的页面      必填
                "loginType" : 2,//登陆类型1登陆2登出                               非必填
            }
     */
    uploadLoginOutTime: function (data) {
        var _this = this;
        data = data || {};
        data.loginType = 2;
        data.page = _this.getNextPage();
        data.fromPortal = _this.getFromPortal(), //默认去pid
            _this.uploadLoginOut(data);
    },
    /**
     * 上传订购成功日志
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
        var params = {
            "version": _this.defaultConfig.version,
            "opCode": "1002",
            "body": {}
        };
        data = data || {};
        params = {
            "userId": _this.getUserId(), //页面入口名称，最好英文加数字
            "moduleName": _this.defaultConfig.prodName, //订购产品名称,
            "cityCode": _this.getCityCode(), //城市编码
            "cityName": _this.defaultConfig.cityName, //城市中文名
            "orderState": data.orderState || "0", //订购标识：1失败，0成功
            "orderMessage": data.orderMessage || "-1", //订购说明（可为空）
            "productType": _this.defaultConfig.feeType, //计费方式，1包月，2按次
            "productId": data.productId || _this.defaultConfig.prodId, //订购产品id_this.defaultConfig.payType,//订购方式：1手机话费、2宽带支付、3第三方支付
            "contentName": orderSource() || CT.requestValue("contentEName"), //订购内容名称
            "contentId": CT.requestValue("activityId") || CT.requestValue("contentId"), //订购内容ID
            "createDate": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "errorMsg": "", //错误描述
            "startTime": _this.formateTime2(new Date()), //yyyyMMddHHmmss订购时间24小时制
            "unsubscribeDate": "",
            "contentType": data.contentType || 0,
            "more1": data.more1 || "",
            "more2": data.more2 || "",
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
            "stayTime": data.stateTime, //停留时长
            "spName": "",
            "spId": "",
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
        var stateTime = (Number(_this.startTime.getTime()) - Number(startTime)) / 1000; // 单位s
        var params = {
            "pageEname": prePageInfoJson.commPageEname || "-1", //页面英文名称
            "pageCname": prePageInfoJson.commPageCname || "-1", //页面中文名称
            "nextPageCname": _this.commPageInfo.commPageCname || CT.requestValue("contentCName"), //下一个页面信息
            "nextPageEname": _this.getCommPageEname() || CT.requestValue("contentEName"), //下一个页面英文名称
            "nextPageContentType": _this.getPageType(), //内容类型：0卡通，1游戏，2专题，3活动，4普通页面
            "nextPageContentId": CT.requestValue("contentId") || -1, //内容ID  
            "fromInfo": _this.getFromPortal(), //页面入口名称，最好英文加数字
            "stayTime": stateTime, //停留时长
           // "focusLocation": prePageInfoJson.defaultFocus || "-1", //焦点位置
            "focusLocation":  prePageInfoJson.fl || prePageInfoJson.defaultFocus || "-1", //焦点位置
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
        window.addEventListener('load', function () {
            _this.startTime = new Date();
            _this.uploadLogPage();
            // 上传全局埋点

            window.entryTime = new Date().getTime();
            /*全屏页面日志拦截*/
            var url = window.location.href;
            if (url.indexOf('index.html') > -1) {
                CT.delCookie("logCollParam");
            }
            /*页面加载 获取上一页信息，触发采集日志接口*/
            _this.logCollection((CT.getCookie("logCollParam")));
        });
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
            var params =params && eval("(" + params + ")");
        } else if (params == undefined || params == 'undefined' || params == null || params == 'null' || params == '') {
            return;
        } else if (params.userId == undefined || params.userId == 'undefined' || params.userId == null || params.userId == 'null' || params.userId == '') {
            return;
        }
        _this.sendAjaxPost(
            AjaxConfig.saveCommonLog,
            params,
            function (e) {

            },
            function (e) {}
        )
    }
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
    pageInfoLog: {},
    playStatus: {},
    videoDerail: {},
}

function logCollParam(stateTime) {
    var prePageInfo = CT.getCookie("logCollParam") && eval("(" + (CT.getCookie("logCollParam")) + ")");
    if (prePageInfo != null) {
        window.prePageInfoObj = {
            "prevPageContentId": prePageInfo.contentId,
            "prevPageContentType": prePageInfo.contentType,
            "prevPageEname": prePageInfo.contentEname,
            "prevPageCname": prePageInfo.contentCname,
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
    this.fromInfo = xjDataLog.defaultConfig.spId; //来源信息，局方入口 或者外部入口信息
    this.position = xjDataLog.getDivPosition(curFocus.FocusID).x + ',' + xjDataLog.getDivPosition(curFocus.FocusID).y;
    this.prevPageContentId = window.prePageInfoObj.prevPageContentId;
    this.prevPageContentType = window.prePageInfoObj.prevPageContentType;
    this.prevPageEname = window.prePageInfoObj.prevPageEname;
    this.prevPageCname = window.prePageInfoObj.prevPageCname;
    this.contentId = xjDataLog.getNextId(); //当前播放的视频或者游戏的ID
    this.contentType = typeObj[xjDataLog.getPageType1()]; //1.普通页面，2.专辑，3.活动，4.游戏，5.片单，6.其它,7.
    if (setLoggerInfo.pageInfoLog && setLoggerInfo.pageInfoLog.data) {
        this.contentEname = setLoggerInfo.pageInfoLog.data.pageInfo.pageTrackName || setLoggerInfo.pageInfoLog.data.pageInfo.commPageEname || curPageInfo.commPageEname; //pageInfo页面英文名
        this.contentCname = setLoggerInfo.pageInfoLog.data.pageInfo.commPageCname || curPageInfo.commPageCname;
    } else {
        if (setLoggerInfo.pageInfoLog && setLoggerInfo.pageInfoLog.data) {
            this.contentEname = setLoggerInfo.pageInfoLog.data.pageInfo.commPageEname;
        }
        this.contentCname = '其他'
    }

    this.playId = setLoggerInfo.playStatus.playId;
    this.playType = setLoggerInfo.playStatus.playType; //0被动播放  1全屏播放
    this.eventType = setLoggerInfo.playStatus.eventType; //start:开始，playing:播放中，end:结束
    this.playName = setLoggerInfo.playStatus.playName;
    if (curFocus.TempData != null) {
        try {
            this.focusLocation = curFocus.TempData.recommendTrackName;
        } catch (e) {}
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
    var json = eval("(" + (CT.getCookie("logCollParam")) + ")");
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
    if (!xjDataLog.isLoad ) {
        xjDataLog.getPrePage();
        xjDataLog.isLoad = true;
        var json = ajax.jsonToString(new logCollParam(parseInt(((new Date().getTime()) - window.entryTime) / 1000)));
        CT.setCookie("logCollParam", (json));
    }
});
