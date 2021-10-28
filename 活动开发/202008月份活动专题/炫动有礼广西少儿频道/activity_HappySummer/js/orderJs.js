var orderJs = {
    isto: false,
    authUrl: "auth", //鉴权地址
    orderUrl: "order", //订购地址

    isClick: false, // 是否已经点击
    orderData: '', // 专题活动需要的订购状态
    authData: {},
    userMoney: "",
    colunmProductID: "800600122137", //活动专题鉴权订购productId
    isColumnGetAuth: false, // 是否是专题鉴权
    getUserId: function () { // userId
        var userId = "";
        userId = CT.getCookie("userId");
        if (!userId || userId == "-1") {
            //系统获取方法
            try {
                userId = hardware.STB.serialNumber;
            } catch (e) {}
        }
        return userId || "test001";
    },
    getPid: function () {
        var _this = this
        var pid = CT.getCookie('pid') + ''
        if (pid == '-1') {
            try {} catch (e) {
                pid = CT.getCookie('pid')
            }
        }
        return pid
    },
    getUserClockMess: function () { //获取童锁信息
        var userId = this.getUserId();
        ajax.init({ // 获取童锁信息
            url: playUrl + "/xjcartoon_BtopInterface_xuanli/UserTaskInterface/queryUserLockList",
            method: "get",
            params: {
                "userId": userId
            },
            async: false,
            ContentType: "json",
            success: function (data) {
                if (!data.list.length == 0) {
                    var userLockMess = data.list[0].lockMessage;
                    if (userLockMess) {
                        orderJs.userLockMess = true;
                    }
                    if (orderJs.isto) {
                        if (orderJs.userLockMess) {
                            CT.commonJumpUrl(ajaxActionUrl + "HD/html/column/childLockIntercept/childLockIntercept.html")
                        } else {
                            CT.commonJumpUrl(_this.orderUrl + "?userId=" + obj.userId + "&pid=" + obj.pid);
                        }
                    }
                }
                orderJs.isto = true;
            },
            fail: function (status) {}
        });
    },
    /**
     * 计费鉴权
     * @param {} callback 
     */
    toAuth: function (obj, success, failCallback) {
        var _this = this;
        /**
         * 
         * 判断用户是否为黑白名单
         * 
         * 黑名单不鉴权直接跳订购失败 
         *
         * 白名单直接播放 不鉴权不订购
         * 
         * 正常用户
         **/
        
        // interface.findWhithBlackDetailById({
        //     'userId': _this.getUserId()
        // }, function (res) {
        //     if (res.errorCode == "1011") { // 白名单
        //         success && success(res);
        //     } else if (res.errorCode == "1010") { // 黑名单 跳转404
        //         //进404
        //         _this.toErrorPage();
        //     } else {
                //非名单内选手直接鉴权
                obj["timespace"]=new Date().getTime()
                ajax.init({ //眉头及背景图片的接口数据请求
                    url: AjaxConfig.interfaceUrl + _this.authUrl,
                    method: "GET",
                    params: obj,
                    async: false,
                    //ContentType:"json",
                    success: function (res) {
                        CT.setCookie("fromOrder", _this.getOrderSource() || "")
                        if(res.errorCode == "1011"){
                            xjDataLog.setUserAuthLogoInfo({ //鉴权日志
                                "userId": obj.userId,
                                "authState": 2
                            })
                            success && success(res);
                        }else if(res.errorCode == "1010"){
                            xjDataLog.setUserAuthLogoInfo({ //鉴权日志
                                "userId": obj.userId,
                                "authState": 3
                            })
                            _this.toErrorPage();
                        }else if (res.data && res.data.subscribes.isSubscribe == 'Y') {
                            //已订购
                            xjDataLog.setUserAuthLogoInfo({ //鉴权日志
                                "userId": obj.userId,
                                "authState": 1
                                // "more1": ajax.jsonToString(obj),
                                // "more2": ajax.jsonToString(res)
                            })
                            success && success(res);
                        } else {
                            xjDataLog.setUserAuthLogoInfo({ //鉴权日志
                                "userId": obj.userId,
                                "authState": 0
                                // "more1": ajax.jsonToString(obj),
                                // "more2": ajax.jsonToString(res)
                            })
                            //未订购
                            if (failCallback && typeof failCallback == "function") {
                                failCallback();
                            } else {
                                _this.toOrderPage(); //订购页面
                            }
                        }
                    },
                    fail: function (err) {
                        CT.writeInfo("鉴权信息错误 ：" + err);
                    }
                });
        //     }
        // });
    },
    deductMoney: function () {
        var _this = this;
        var userId = "";
        try {
            userId = hardware.STB.serialNumber;
        } catch (e) {}
        var param = {
            userId: userId,
            productId: "800600122137",
            clientId: userId,
            pid: "xldm"
        }
        var fromOrder = eval("(" + CT.getCookie("fromOrder") + ")")
        for (key in fromOrder) {
            param[key] = fromOrder[key]
        }
        ajax.init({ //眉头及背景图片的接口数据请求
            url: AjaxConfig.interfaceUrl + _this.orderUrl,
            method: "GET",
            params: param,
            async: false,
            //ContentType:"json",
            success: function (res) {
                interface.loggerInfo("wyy >>>> deductMoney res >>>>> " + ajax.jsonToString(res), "post")
                if (res.data && eval("(" + res.data + ")").errorCode == 0) {
                    xjDataLog.uploadOrderSuccess({ //订购成功日志
                        orderState: "0",
                        more1: ajax.jsonToString(param),
                        more2: ajax.jsonToString(res),
                        more3: AjaxConfig.interfaceUrl + _this.orderUrl
                    })
                    _this.toOrderSucPage();
                } else {
                    xjDataLog.uploadOrderSuccess({ //订购失败日志
                        orderState: "1",
                        more1: ajax.jsonToString(param),
                        more2: ajax.jsonToString(res),
                        more3: AjaxConfig.interfaceUrl + _this.orderUrl
                    })
                    _this.toOrderFailPage();
                }
            },
            fail: function (err) {
                CT.writeInfo("鉴权信息错误 ：" + err);
            }
        });
    },
    //免费体验卷兑换鉴权
    authByFreeTrail: function (authSuc, authFail) {
        var _this = this;
        ajax.init({ //眉头及背景图片的接口数据请求
            url: _this.freeTrailAuthUrl,
            method: "GET",
            params: {
                "userId": _this.getUserId(),
                "time": new Date().getTime()
            },
            async: false,
            //ContentType:"json",
            success: function (data) {
                if (data == "true") {
                    authSuc && authSuc();
                } else {
                    authFail && authFail();
                }
            },
            fail: function (data) {
                CT.writeInfo("鉴权信息错误 ：" + data);
            }
        });
    },
    //订购页面日志
    collOrderLog: function () {
        var p = new logCollParam();
        p.contentType = "order";
        xjDataLog.logCollection(p);
    },
    /**
     * 专题活动鉴权
     * @param {*} callback 
     */
    columnGetAuth: function (callback) {
        var _this = this
        _this.isColumnGetAuth = true; // 是专题鉴权；
        _this.toAuth({
            productId: _this.colunmProductID,
            userId: _this.getUserId(),
            clientId: _this.getUserId(),
            pid: "xldm"
        }, function () {
            callback("0");
        }, function () {
            callback("1");
        });
    },
    /**
     * 专题活动订购跳转
     * @param {*} stringPid 
     */
    columnToOrderPage: function () {
        var _this = this;
        _this.toOrderPage(); // 订购页面
    },
    toOrderPage: function () { // 订购页面
        CT.setCookie("backPrePage", window.location.href)
        CT.getAnterByIdOrAction({
            contentId: 'szorderPage1'
        })
    },

    toOrderSucPage: function () { // 订购成功页面
        CT.getAnterByIdOrAction({
            contentId: 'orderSuc_2019v1'
        })
    },

    /**
     * @param {*} val : 0订购失败1是余额不足失败 
     */
    toOrderFailPage: function (val) { // 订购失败页面
        var pageUrl;
        if (val == 1) {
            CT.getAnterByIdOrAction({
                contentId: 'orderFail_2019v1'
            })

        } else {
            CT.getAnterByIdOrAction({
                contentId: 'orderFail'
            })
        }
    },
    toErrorPage: function () {
        CT.getAnterByIdOrAction({
            contentId: '404_2019v1'
        })
    },

    /**
     * wyy 获取订购来源
     */
    getOrderFromType: function () {
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

    getOrderSource: function () {
        var self = this;
        var config = xjDataLog.defaultConfig || {};
		if(window.location.href.indexOf("activity") > -1){
			setLoggerInfo.pageInfoLog = {
				data: {
					pageInfo: {
						commonPageId: actiActivityId,
						commPageCname: document.title,
						commPageEname: "activity_" + actiActivityId
					}
				}
			}
			var pageInfo = setLoggerInfo && setLoggerInfo.pageInfoLog && setLoggerInfo.pageInfoLog.data.pageInfo;
		}else{
			var pageInfo = setLoggerInfo && setLoggerInfo.pageInfoLog && setLoggerInfo.pageInfoLog.data.pageInfo;
		}
        var focusData = curFocus.TempData || {};
        var userId = self.getUserId();
        var stbId = 'testSTB';
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
        switch (self.getOrderFromType()) {
            case 1:
                orderS.fromType = 1;
                orderS.fromId = pageInfo.commonPageId;
                orderS.fromCname = pageInfo.commPageCname;
                orderS.fromEname = pageInfo.commPageEname;
                orderS.contentType = 1;
                orderS.contentId = focusData.recommendTrackName;
                orderS.contentCname = "";
                orderS.contentEname = "";
                break;
            case 2:
                //活动先不做
                orderS.fromType = 2;
                orderS.fromId = "";
                orderS.fromCname = "";
                orderS.fromEname = "";
                break;
            case 3:
                orderS.fromType = 3;
                orderS.fromId = Page.cartoonData.id;
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
                orderS.contentType = focusData.recommendDisplayType;
                orderS.contentId = focusData.recommendDisplayValue;
                orderS.contentCname = focusData.recommendDisplayName;
                orderS.contentEname = focusData.recommendDisplayType;
                break;
            default:
                break;
        }
        return ajax.jsonToString(orderS)
    }
}
