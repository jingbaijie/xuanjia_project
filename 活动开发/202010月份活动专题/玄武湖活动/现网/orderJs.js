var orderJs = {
    authUrl: AjaxConfig.ajaxActionUrl + 'getAuthResult', // 鉴权地址
    orderUrl: AjaxConfig.ajaxActionUrl + 'getOrderResult', // 订购地址
    isClick: false, // 是否已经点击
    orderData: '', // 专题活动需要的订购状态
    isColumnGetAuth: false, // 是否是专题鉴权
    product_list: null, //产品列表
    orderReturnPage: "#",
    getUserId: function () { // userId
        var _this = this
        var userId = xjDataLog.getUserId();
        if (userId == '-1') {
            try {
                userId = CITV.loginInfo.userId;
                if (!userId) {
                    userId = Utility.getSystemInfo("UID");
                }

                CT.delCookie("userId");
                if (userId) {
                    CT.setCookie("userId", userId);
                }
            } catch (e) {
                userId = "8760004067959879";
            }
        }
        return userId;
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
    /**
     * 
     *
     * 产品包说明：
     *
     *  800600177498 全省余额29包月，南京除外
     *  800600177698 全省半年包 174/9个月
     *  800600177699 全省年包 348/18个月
     *
     *  800600177655 南京时间量季包29月包
     *  800600177542 南京时间量月29元
     *
     *  800600177560 旧南京时间量包年
     *  800600177559 旧南京时间量半年包
     *
     * */

    //南京四个时间量	
    //productId_nj: "800600177698,800600177699,800600177542,800600177655",
	productId_nj: "800600177559,800600177560,800600177542,800600177655",
    //南京以外两个时间量
    //productId_new: "800600177698,800600177699",
    productId_new: "800600177559,800600177560",
    productId_all: "800600177698,800600177699,800600177498,800600177542,800600177560,800600177559,800600177655",
    productId_balance: "800600177498",

    //用于区分全省和南京，全省可以拿到800600177498余额月包，南京可以拿到800600177542扫码月包
    productId: "800600177498,800600177542",

    

    //鉴权包  800600177560,800600177559老包年包季鉴权
    productId_auth: "800500115348,800600177751,800600177723,800600177498,800600177542,800600177698,800600177699,800600177655,800600177560,800600177559,800600176526,800600176316,800600176695,800600176706,800600176714,800600176715,800600176734,800600176735,800600176764,800600176803,800600176822,800600176823,800600177051,800600177054,800600177055,800600177058,800600177059,800600177062,800600177065,800600177066,800600177069,800600177070,800600177073,800600177074,800600177076,800600177079,800600177080,800600122398,800600122399,800600177204,800600177244,800600177283,800600177284,800600177282,800600177281,800600177280,800600177279,800600177278,800600177274,800600177273,800600177272,800600177266",
    //获取鉴权产品Id
    getAuthProductId: function () {
        var _this = this;
        return _this.productId_auth
    },
    userInfoObj: null, //用户账号
    /**
     *  初始化融合AAA SDK
     * @param {*} success
     */
    initJscnAAA: function (success) {
        var _this = this;
        // smartCardid      是      string  卡号
        // stbid    是      string  机顶盒号
        // sp_cogetUserInfode  是      string  服务提供商的id
        // extend_params    否      obj     扩展字段
        _this.getUserInfo(function (e) {
            var e = e || {};
            // e = {"data":{"resultCode":0,"userInfo":{"TVCode":503248493,"districtCode":3303,"phoneNumber":"","userCode":476706513,"status":"02","smartCardId":9932020000622368,"cityCode":101300,"userName":"云媒体市场组","setTopBoxId":71520518452031656,"userType":1,"userRank":9}},"errorCode":"1000","errorMsg":"操作成功","successFlg":1}; 
            _this.userInfoObj = e;
            if (e.errorCode == "1000" && e.data) {
                var userId = _this.getUserId();
                interface.findUserDetailByUserId({
                    userId: userId
                }, function (userInfo) {
                    if (!userInfo.data) {
                        xjDataLog.insertUserInfo({
                            "userId": userId,
                            "stbId": _this.userInfoObj.data.userInfo.setTopBoxId,
                            "more4": _this.userInfoObj.data.userInfo.districtCode,
                            "userPhone": _this.userInfoObj.data.userInfo.phoneNumber
                        })
                    } else {
                        if (userInfo.data.userId == userInfo.data.userPhone || userInfo.data.stbId == "sn00000" || !userInfo.data.more4 || userInfo.data.more4 == "undefined") {
                            interface.updateUserInfo({
                                "userId": xjDataLog.getUserId(),
                                "stbId": _this.userInfoObj.data.userInfo.setTopBoxId,
                                "more4": _this.userInfoObj.data.userInfo.districtCode,
                                "userPhone": _this.userInfoObj.data.userInfo.phoneNumber
                            })
                        }

                    }
                })

                JscnAAA.ready({
                    smartCardid: _this.userInfoObj.data.userInfo.smartCardId,
                    stbid: _this.getStbId(),
                    sp_code: "SP1N02A00_08_030"
                }, function () {
                    /*初始化成功回调，在此调用文档中定义的SDK接口*/
                    success && success();
                    interface.loggerInfo("初始化成功", "post");
                }, function (res) {
                    /*/初始化失败回调*/
                    interface.loggerInfo("初始化失败" + ajax.jsonToString(res), "post");
                    success && success(res);
                })
            } else {
                _this.toErrorPage();
            }


        })

    },
    /**
     * 
     * 2.1.2.3 获取时间量产品订购url接口
     *  JscnAAA.get_time_order_url(params, callback)
     *  参数名	必传	类型	描述
     *  product_id	是	string	 产品列表返回的id
     *  fee_id	否	string	资费id，如果产品没有资费id则不传
     *  video_id	否	string	视频ID。注意：如果是单片购买时，必须传递此参数
     *  notify_url	是	string	支付结果通知地址。
     *  third_order_id	是	string	服务提供商的订单id，通知地址会通知该订单的支付结果。为了服务提供商的订单id的唯一性，使用服务提供商的id作为订单号前缀。
     *  extend_params	否	obj	扩展字段 
     * 
     * 2.1.2.3.5回调函数参数返回值
     *  resultCode	状态码	0 成功 非0失败
     *  errorMessage	错误码说明	
     *  order_url	订购url	时间量产品订购url，终端根据url生成二维码
     *  order_id	订单id	时间量产品订单id，查询订单状态需要这个值。
     * 
     * 终端调用支付接口获取二维码展示给用户后，需要轮询订单状态，查看该订单是否支付完成，并且AAA授权或者充值逻辑全部完成时，会返回一个订单成功的状态。
     *  用户进行第三方支付交易完成后，第三方会异步通知我们AAA系统。这时AAA会设置订单成功状态。
     *  2.1.2.4.3使用场景
     *  成功展示订购支付二维码时，轮训该接口，判断订单是否已支付完成。
     * 
     ***/
    getQRCode: function (product, callback) {
        JscnAAA.get_time_order_url({
            product_id: product.product_id,
            fee_id: product.fee_id,
            offer_id: product.offer_id,
            video_id: product.video_id,
            notify_url: product.notify_url,
            third_order_id: product.third_order_id
        }, function (resp) {
            callback && callback(resp)
        });
    },
    /**
     * 2.1.2.4获取时间量产品订购状态接口
     * JscnAAA.query_time_order_statue(params, callback)
     * @param {*} order_id	是	string	订单ID, 必传
     * @param {*} extend_params	否	obj	扩展字段
     * 
     * 2.1.2.4.5回调函数参数返回值
     *      resultCode	状态码	0订购成功、1未支付，其他失败
     *      errorMessage	错误码说明
     *  desc:
     *      终端调用支付接口获取二维码展示给用户后，需要轮询订单状态，查看该订单是否支付完成，并且AAA授权或者充值逻辑全部完成时，会返回一个订单成功的状态。
     *      用户进行第三方支付交易完成后，第三方会异步通知我们AAA系统。这时AAA会设置订单成功状态。
     *      2.1.2.4.3使用场景
     *      成功展示订购支付二维码时，轮训该接口，判断订单是否已支付完成。
     ***/
    queryQRCodeState: function (order_id, callback) {
        JscnAAA.query_time_order_statue({
            order_id: order_id
        }, function (resp) {
            callback && callback(resp)
        });
    },

    //type: 0南京订购  1全省跳余额
    toOrderQRPage: function (type) { // 扫码页面
        window.location.href = AjaxConfig.projectUrl+"HD/web/orderPage/html/orderPageQR.html?contentType=" + type;
        //CT.getAnterByIdOrAction({
        //    contentId: "orderSuc_2019v1",
        //    contentType:type
        //});
    },



    /**
     * 通过设备号获取用户信息
     * @param {设备号} stb 
     */
    getUserInfo: function (callback) {
        var _this = this;

        callback = callback || function () {}
        var url = AjaxConfig.interfaceUrl + "getUserAreaInfoFromBOSS";
        var data = {
            url: url.replace("iptv-web-api-test", "iptv-web-api"),
            params: {
                queryType: "3",
                setTopBoxId: _this.getStbId(),
                smartCardId: "",
                TVCode: ""
            }
        };
        interface.ajax(data, callback);
    },
    /**
     * 获取当前用户所属地市值  

     * @param fn  请求成功后的回调函数
     * @returns {string}
     */
    getAreaOfUser: function (fn) {
        var _this = this;
        var nowDateCook = "areaType" + new Date().getMonth() + "" + new Date().getDate();
        var areaArr = {
            suzhou: [1001, 3111, 3106, 3107, 3108, 101400],
            nanjing: [1002, 1502, 1503, 1504, 1505, 1506, 1510, 1508, 1509, 101000],
            zhenjiang: [3001, 3006, 3010, 3011, 101100],
            taizhou: [3002, 3033, 3034, 3035, 101200],
            huaian: [3020, 3021, 3031, 3036, 3036, 3037, 3038, 3063, 101600],
            yancheng: [3022, 3051, 3052, 3053, 3054, 3055, 3061, 3096, 102000],
            lianyungang: [3025, 3201, 3209, 3212, 101800],
            changzhou: [3032, 3065, 3317, 3316, 102100],
            nantong: [3062, 3304, 3305, 3307, 3308, 3310, 101900],
            suqian: [3064, 3101, 3102, 3103, 102200],
            xuzhou: [3095, 3203, 3204, 3210, 3211, 3213, 101700],
            zhongguang: [3202],
            yangzhou: [3329, 3205, 3206, 3207, 3208, 3301, 3302, 101500],
            wuxi: [3303, 3306, 3311, 101300],
            maanshan: [102300]
        }
        var nowDateCookie = CT.getCookie(nowDateCook);
        if (nowDateCookie) {
            if (fn && typeof fn == "function") {
                fn(nowDateCookie);
            } else {
                return nowDateCookie;
            }
        } else {
            this.getUserInfo(function (userData) {
                if (userData && userData.errorCode == "1000" && userData.data && userData.data.userInfo && userData.data.userInfo.cityCode) {
                    var userArea = "nanjing";
                    for (var key in areaArr) {
                        for (var i = 0; i < areaArr[key].length; i++) {
                            if (userData.data.userInfo.cityCode == areaArr[key][i]) {
                                CT.setCookie(nowDateCook, key);
                                if (fn && typeof fn == "function") {
                                    fn(key);
                                } else {
                                    return key;
                                }
                            }
                        }
                    }
                } else {
                    CT.setCookie(nowDateCook, "nanjing");
                    if (fn && typeof fn == "function") {
                        fn("nanjing");
                    } else {
                        return "nanjing";
                    }
                }
            });
        }
    },
    getStbId: function () {
        var _this = this;
        var stb = "";
        try {
            stb = hardware.STB.serialNumber;
        } catch (e) {
            //stb = "02176616470065332"
           stb = "81200619290004345"
           //stb= "11089525150138482"
        }
        return stb;
        // return "02197417340213260";
    },
    getSmartCardid: function () {
        var _this = this;
        var smartcardId = "";
        try {
            try {
                smartcardId = CITV.loginInfo.smcId;
            } catch (error) {}

            if (!smartcardId) {
                smartcardId = Utility.getSystemInfo("SID")
            }
            //  smartcardId = Utility.getSystemInfo("SID");
        } catch (e) {
            smartcardId = "-1"
        }
        return smartcardId;
        // return "851500416051554";
    },
    /**
     *    *
     *       *  @params option {
     *          *            suc : function    //成功回调
     *             *            fail : function   //失败回调
     *                *  }
     *                   *
     *                      *
     *                         *  用于判断用户是否拥有传入的产品包的授权。
     *                            *  product_id        是      string  产品包ID，只要用户拥有任意产品授权将鉴权成功。
     *                               * （此处支持多个产品ID,以英文逗号分隔）
     *                                  *  video_id  否      string  影片ID（当进行单片产品包鉴权的时候此参数必传）
     *                                     *  extend_params     否      obj     扩展字段
     *                                        *
     *                                           *  resp {
     *                                              *    "resultCode": "0",
     *                                                 *    "errorMessage": "",
     *                                                    *    "product”: {
     *                                                       *      "product_id": "123456",
     *                                                          *      "begin_date": "2018-04-01 21:49:27",
     *                                                             *      "end_date": "2018-04-30 21:49:30"
     *                                                                *     }
     *                                                                   *  }
     *                                                                      *
     *                                                                         * */
    getJSYXAuth: function (option) {
        var _this = this;
        _this.initJscnAAA(function (res) {
            if (res) {
                /* SDK初始化失败*/
                interface.loggerInfo(ajax.jsonToString({
                    smartCardid: _this.userInfoObj.data.userInfo.smartCardId,
                    stbid: _this.getStbId(),
                    sp_code: "SP1N02A00_08_030"
                }) + 'SDK初始化失败getNewAuth' + ajax.jsonToString(res), "post")

                xjDataLog.setUserAuthLogoInfo({
                    "authState": 101,
                    "authStateCname": res.errorMessage,
                    "productInfo": _this.getAuthProductId(),
                    "more1": _this.userInfoObj.data.userInfo.smartCardId,
                    "more2": _this.getStbId(),
                    "more3": ajax.jsonToString(_this.userInfoObj),
                    "more4": _this.userInfoObj.data.userInfo.districtCode
                });
                _this.toNotExistDevicePage();
            } else {

                var params = {
                    product_id: _this.getAuthProductId(),
                    /*video_id: Page.videoUrl*/
                }
                interface.loggerInfo("params>>>" + ajax.jsonToString(params), "post")
                JscnAAA.product_auth(params, function (resp) {
                    interface.loggerInfo("1>>>" + ajax.jsonToString(resp), "post")
                    //   resp.resultCode = "1";
                    /**上传鉴权日志*/
                    xjDataLog.setUserAuthLogoInfo({
                        "authState": resp.resultCode,
                        "authStateCname": resp.errorMessage,
                        "productInfo": _this.getAuthProductId(),
                        "more1": _this.userInfoObj.data.userInfo.smartCardId,
                        "more2": _this.getStbId(),
                        "more3": ajax.jsonToString(_this.userInfoObj),
                        "more4": _this.userInfoObj.data.userInfo.districtCode

                    })
                    switch (resp.resultCode + "") {

                        case "0":
                            /*鉴权通过*/
                            option.suc && option.suc();
                            break;
                        case "1":
                            /* 鉴权不通过，跳订购*/
                            if (option.fail) {
                                option.fail();
                            } else {
                                _this.toOrderPage()
                                //_this.toNewOrder();
                            }

                            break;
                        case "12":
                            interface.loggerInfo("用户状态异常,请退出重新进");
                            _this.toBasePackagePage();
                            break;
                        case "39": //欠费去充值
                            _this.toRecharge();
                            break;
                        default:
                            interface.loggerInfo("2>>" + ajax.jsonToString(resp));
                            _this.toErrorPage();
                    }


                })
            }
        })
    },
    /**
     *      * 将对象转(params)换成用&符号拼接的字符串,并返回用&符号拼接的字符串
     *           * @param params
     *                * @returns {string}
     *                     * 用法： actiObj.trimArgs({"1": 1,"2": 2});
     *                          */
    trimArgs: function (params) {
        var args = '';
        for (var i in params) {
            if (args !== '') {
                args += '&';
            }
            args += i + '=' + params[i];
        }
        return args;
    },

    getOrderReturnUrl: function () {
        var strArr = [];
        strArr["userId"] = CT.requestValue("userId");
        strArr["pid"] = CT.requestValue("pid");
        strArr["activityId"] = CT.requestValue("activityId");
        strArr["contentCName"] = 'DGZZYM'; //CT.requestValue("contentCName");
        strArr["contentId"] = '140'; //CT.requestValue("contentId");
        strArr["contentEName"] = "orderReturn_2019v1"; //CT.requestValue("contentEName");
        strArr["defaultFocus"] = curFocus.FocusID;
        var strParams = this.trimArgs(strArr);
        return AjaxConfig.projectUrl + "HD/web/orderPage/html/orderReturnPage.html?" + strParams;
    },
    /**
     *    * 统一订购
     *       * 当需要进行订购产品的时候，调用此接口，第三方应用直接跳转到统一订购页面，用户订购完成或者用户返回，跳转到指定的页面。
     *          * @param {*} returnUrl
     *             * @param {*} productId
     *                * @param {*} videoId
     *                   *  2.2.3 接口入参
     *                      *    return_url： 页面返回地址,订购结果会在返回地址后面加上resultCode代表订购状态和errorMessage订购失败的描述的两个参数。
     *                         *                resultCode 0 订购成功 -1 订购失败 1用户没有完成订购返回
     *                            *    errorMessage： 订购结果描述
     *                               *    product_id      是      string  产品包id。如果有多个产品包使用","分割。产品购买需要指定产品包购买时需要传入。
     *                                  *    video_id        否      string  媒资id
     *                                     *    extend_params   否      obj     扩展参数
     *                                        */
    toNewOrder: function (callback) {
        var _this = this;
        JscnAAA.get_order_product_list({
            product_id: _this.productId
        }, function (p_resp) {
            xjDataLog.setUserAuthLogoInfo({
                "authState": 102,
                "authStateCname": p_resp.resultCode + "_" + p_resp.errorMessage,
                "productInfo": _this.getAuthProductId(),
                "more1": _this.userInfoObj.data.userInfo.smartCardId,
                "more2": _this.getStbId(),
                "more3": ajax.jsonToString(p_resp),
                "more4": _this.userInfoObj.data.userInfo.districtCode

            })

            _this.product_list = p_resp;
            if ( p_resp.resultCode == "0" && p_resp.product_type == "2") {
                callback && callback();
            } else {
                _this.toOrderQRPage(0)
                //跳统一订购页面

            }
        });
    },

    /**
     * 余额支付
     */
    toPay: function () {
        var _this = this;
        orderJs.initJscnAAA(function () {
            JscnAAA.get_order_product_list({
                product_id: _this.productId_balance
            }, function (p_resp) {
                JscnAAA.balance_order({
                    "product_id": p_resp.product_list[0].id,
                    "fee_id": p_resp.product_list[0].fee_id,
                    "offer_id": p_resp.product_list[0].offer_id,
                    "notify_url": "xxx",
                    "third_order_id": "xxx"
                }, function (resp) {
                    var returnUrl = _this.getOrderReturnUrl();
                    if (resp.resultCode + "" == "0") {
                        returnUrl += "&resultCode=0&errorMessage=" + resp.errorMessage;
                    } else {
                        returnUrl += "&resultCode=-1&errorMessage=" + resp.resultCode + "_" + resp.errorMessage;
                    }
                    window.location.href = returnUrl;
                })
            })
        })

    },
    /**
     ** 去充值
     **/
    toRecharge: function () {
        var _this = this;
        JscnAAA.get_recharge_channel(function (resp) {
            if (resp.resultCode == 0) {
                var aliPayUrl = resp.aliPayUrl;
                var wechatPayUrl = resp.wechatPayUrl;
                JscnAAA.go_recharge_page({
                    return_url: window.location.href
                });

            }
        });

    },

    /**
     * 鉴权
     * @param suc  成功回调
     * @param fail  失败回调
     */
    getAuth: function (suc, fail) {
        var _this = this
        // newOrderJs.getNewAuth();
        //return;
        interface.checkUserBlackWhiteList({
            userId: _this.getStbId()
        }, function (res) {
            interface.loggerInfo("黑白名单》》" + ajax.jsonToString(res), "post");
            if (res.errorCode == "1011") { // 白名单

                suc && suc("ok");
                return;
            } else if (res.errorCode == "1010") { // 黑名单 跳转404

                _this.toErrorPage();

            } else {
                _this.getJSYXAuth({
                    suc: function (data) {
                        suc && suc("OK");
                    },
                    fail: function (data) {
                        if (fail) {
                            fail(data);
                            return;
                        } else {
                            _this.toOrderPage();
                            //_this.toNewOrder();
                        }
                    }
                })

            }
        })


    },
    /**
     *    * 专题活动鉴权
     *       * @param {*} callback
     *          */
    columnGetAuth: function (callback) {
        var _this = this
        _this.isColumnGetAuth = true; // 是专题鉴权；
        _this.getAuth(function (data) {
            callback && callback('0')
        }, function () {
            callback && callback("1");
        })
    },
    /**
     *    * 专题活动订购跳转
     *       * @param {*} stringPid
     *          */
    columnToOrderPage: function (stringPid) {
        this.toOrderPage();
    },
    upLog: function () {
        if (!document.URL.indexOf("playVideo") >= 0) {
            interface.getSystemConfigByKey(function (res) {
                var arr = res && res.data && eval(res.data.configValue);
                var arrIndex = Math.floor(Math.random() * arr.length + 1) - 1;
                var video = arr[arrIndex] || [];
                interface.findVideoListByCartoonId({
                    params: {
                        cartoonId: video.cartoonId
                    },
                    ajaxConfig: {
                        async: true
                    }
                }, function (data) {
                    xjDataLog.uploadViodeEndLog({
                        "cartoonId": video.cartoonId,
                        "cartoonCname": video.cartoonName,
                        "cartoonEname": video.cartoonEname,
                        "videoId": video.videoId,
                        "videoCname": video.videoName,
                        "videoEname": video.videoEname,
                        "startTime": 0,
                        "stayTime": parseInt(Math.random() * 500), //停留时长
                        "playType": 2,
                        // "spName": data[0].cartoonInfo.cspInfo.spName,
                        // "spId": data[0].cartoonInfo.cspInfo.spId,
                        "spName": xjDataLog.defaultConfig.spName,
                        "spId": xjDataLog.defaultConfig.spId
                    });
                })
            })
        }
    },

    /**
     *    * 去订购
     *       */
    toOrder: function () {
        var _this = this
        var obj = {
            userId: _this.getUserId(),
            pid: _this.getPid()
        }
        if (_this.isClick) {
            return
        }
        _this.isClick = true

        var obj = {
            'userId': _this.getUserId(),
            'devNo': _this.getUserId(),
            'pid': _this.getPid()
        }


        ajax.init({ //
            url: _this.orderUrl,
            method: 'GET',
            params: obj,
            async: false,
            success: function (data) {
                data = data || {};
                data = data.data || {};
                switch (data.result) {
                    case "success": //获取订单成功发起订购
                        var paramStr = data.param;
                        var postUrl = data.tOrderUrl;
                        var params = _this.urlSearchToObj(paramStr);
                        _this.formPost({
                            url: postUrl,
                            params: params
                        })
                        break;
                    case "failed": //订购失败
                        if (data.message == "Reapeat") {
                            _this.toOrderRepeatPage(); //重复订购
                        } else {
                            _this.toOrderFailPage(); //参数错误
                        }
                        break;
                    default:
                        _this.toOrderFailPage();

                }


            },
            fail: function (data) {}
        })


    },
    /**
     *    * form表单提交
     *       * @param {*} obj {
     *          *                url : //    提交的地址 http://wwww.baidu.com   
     *             *                method :        提交方式   get post   默认 post
     *                *                contentType ：  提交的格式 默认  application/x-www-form-urlencoded
     *                   *                params   :      提交的从那时对象  { userId : 112, pwd : 123}
     *                      *              }
     *                         *
     *                            */
    formPost: function (obj) {
        var _this = this;
        obj = obj || {};

        var PostUrl = obj.url; //跳转地址
        var method = obj.method || "post";
        var ectype = obj.contentType || "application/x-www-form-urlencoded"
        var params = obj.params; //参数对象
        var html = "";
        html += "<form id='form' action='" + PostUrl + "' method='" + method + "' ectype='" + ectype + "'>";
        for (x in params) {
            html += "<input type='text' name='" + x + "' value='" + params[x] + "'>";
        }
        html += "<input type='submit' value='提交' onclick='checkUser();'>";
        html += "</form>";
        document.getElementsByTagName('body')[0].innerHTML += html;
        _this.submitForm();
    },
    /**
     *    * 提交表单
     *       */
    submitForm: function () {
        var _this = this;
        document.getElementById("form").submit();
    },
    /**
     *    * 将地址search参数转成obj
     *       * @param {*} str 参数
     *          * @example
     *             *    "a=1&b=2&c=2" => {a:1,b:2,c:2}
     *                */
    urlSearchToObj: function (str) {
        var _this = this;
        var obj = {};
        var strArr = str.split("&");
        var arr = [];
        for (var i = 0; i < strArr.length; i++) {
            arr = strArr[i].split("=");
            obj[arr[0]] = arr[1];
        }
        return obj;

    },

    toExitPlatform: function () {
        var _this = this;
        try {
            exit();
        } catch (e) {}
        window.location.href = _this.subOut + "?userId=" + _this.getUserId() + "&v=" + new Date().getTime();
    },

    toOrderPage: function () { // 跳转至订购页
        var backPrePage = window.location.href;
        CT.setCookie("backPrePage", backPrePage);

        orderJs.toNewOrder(function () {
            CT.getAnterByIdOrAction({
                contentId: "orderPage_2019v1"
            })
        })
    },
    toOrderSucPage: function () { // 订购成功页面
        //判断南京用户显示另外的订购页
		orderJs.getAreaOfUser(function (res) {
			 if(res=="nanjing"){
				 CT.commonJumpUrl(AjaxConfig.projectUrl+"HD/web/orderPage/html/orderSucNanJing.html");
			 }else{
				 CT.getAnterByIdOrAction({
					contentId: "orderSuc_2019v1"
				}); 
			 }
		}); 
    },
    toOrderFailPage: function () { // 订购失败页面
        CT.getAnterByIdOrAction({
            contentId: "orderFail_2019v1"
        });
    },
    toBasePackagePage: function () { // 基础包不存在
        CT.getAnterByIdOrAction({
            contentId: "basePackagePage"
        });
    },
    toNotExistDevicePage: function () { // 设备不存在
        CT.getAnterByIdOrAction({
            contentId: "notExistDevicePage"
        });
    },
    toErrorPage: function () { // 跳转到错误页面
        CT.getAnterByIdOrAction({
            contentId: "404_2019v1"
        });
    }

}


//interface.loggerInfo("当前页面地址》》》》》" + window.location.href, "post");

window.addEventListener("load", function () {

    var curUrl = window.location.href;
    if (curUrl.indexOf("mainPage.html") > -1) {
        setTimeout(function () {
            orderJs.getUserInfo(function (e) {
                var userInfoObj = e || {};
                if (e.errorCode == "1000" && e.data) {
                    var userId = orderJs.getUserId();
                    interface.findUserDetailByUserId({
                        userId: userId
                    }, function (userInfo) {
                        if (!userInfo.data) {
                            xjDataLog.insertUserInfo({
                                "userId": userId,
                                "stbId": userInfoObj.data.userInfo.setTopBoxId,
                                "more4": userInfoObj.data.userInfo.districtCode,
                                "userPhone": userInfoObj.data.userInfo.phoneNumber
                            })
                        } else {
                            if (userInfo.data.userId == userInfo.data.userPhone || userInfo.data.stbId == "sn00000" || !userInfo.data.more4 || userInfo.data.more4 == "undefined") {
                                interface.updateUserInfo({
                                    "userId": xjDataLog.getUserId(),
                                    "stbId": userInfoObj.data.userInfo.setTopBoxId,
                                    "more4": userInfoObj.data.userInfo.districtCode,
                                    "userPhone": userInfoObj.data.userInfo.phoneNumber
                                })
                            }

                        }
                    })
                }
            })
        }, 2000)
    }

})
/**
function loadingJS0(jsObj) {
        
            document.write('<script type="text/javascript" src=' + jsUrl + '>' + '</script>');
       
    }
loadingJS0("http://172.31.183.225:8080/webapp_v2/JscnAAA");
**/
