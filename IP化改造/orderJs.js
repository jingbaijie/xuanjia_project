var orderJs = {
    authUrl: AjaxConfig.ajaxActionUrl + 'getAuthResult', // 鉴权地址
    orderUrl: AjaxConfig.ajaxActionUrl + 'getOrderResult', // 订购地址
    isClick: false, // 是否已经点击
    orderData: '', // 专题活动需要的订购状态
    isColumnGetAuth: false, // 是否是专题鉴权
    product_list: null, //产品列表
    orderReturnPage: "#",
    cardCookie: null,
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
     * 
     *  800600177655 南京时间量季包29月包
     *  800600177542 南京时间量月29元
     *  800600122669 炫力少儿_29元/1个月 全省boss2地区
     * 
     *  800600177560 旧南京时间量包年
     *  800600177559 旧南京时间量半年包
     * 
     *  800600177815 南京余额29元包支付包
     *
     * */

    //南京四个时间量	
    // productId_nj: "800600177542,800600177655,800600177698,800600177699",
    productId_nj: "800600122669,800600177542,800600177655,800600177559,800600177560",
	// productId_nj: "800600177559,800600177560,800600177542,800600177655",
	// productId_nj: "800500115290,800500115291,800600177542,800600177655",
    //南京以外两个时间量
    productId_new: "800600177698,800600177699,",
    // productId_new: "800600177559,800600177560",
    //     BOSS1/BOSS2套餐更名并重新上线：
    // 800500115290 炫力少儿促销174元（6送1）_江苏_客户级套餐
    // 800500115291 炫力少儿促销348元（12送2）_江苏_客户级套餐
    // productId_new: "800500115290,800500115291",
    productId_all: "800600177698,800600177699,800600177498,800600177542,800600177560,800600177559,800600177655,800600133117",
    productId_balance: "800600177498",

    //一元周卡
    productId_balance_card: "800600133117",

    //用于区分全省和南京，全省可以拿到800600177498余额月包，南京可以拿到800600177542扫码月包
    productId: "800600177498,800600177542",
    //南京余额支付
    productId_balance_nj:"800600177815",

    IpProduct: {id: "800600178026" ,bizCode:"BIZ_XLSE_IP_BALANCE"},//IP测试-炫力少儿（包月）_江苏
    IpProductQR: {id: "800600178027" ,bizCode:"BIZ_XLSE_IP_AOT"}, //IP测试-炫力少儿（包年）_江苏
    //扫码页产品相应图 
    productImg:{
        "800600177559": "product0.png",
        "800600177560": "product1.png",
        "800600177542": "product2.png",
        "800600122669": "product2.png",
        "800600178026": "product2.png",
        "800600177655": "product3.png",
        "800600177698": "product4.png",
        "800600177699": "product5.png",
    },
    //扫码页产品相应焦点
    productFocus:{
        "800600177559": "product0_focus.png",
        "800600177560": "product1_focus.png",
        "800600177542": "product2_focus.png",
        "800600122669": "product2_focus.png",
        "800600178026": "product2_focus.png",
        "800600177655": "product3_focus.png",
        "800600177698": "product4_focus.png",
        "800600177699": "product5_focus.png",
    },

    //鉴权包  800600177560,800600177559老包年包季鉴权
    // 800600177875 炫力少儿174元/7个月_宿迁
    // 800600177876 炫力少儿348元/14个月_宿迁
    // 800600122843 炫力少儿_16元/月_江苏 （张家港分公司申请的）
    // 800600177987 炫力少儿_299元/1年_南京政企 
    productId_auth: "800600177987,800600177876,800600177875,800600177815,800500115348,800600177751,800600177723,800600177498,800600177542,800600177698,800600177699,800600177655,800600177560,800600177559,800600176526,800600176316,800600176695,800600176706,800600176714,800600176715,800600176734,800600176735,800600176764,800600176803,800600176822,800600176823,800600177051,800600177054,800600177055,800600177058,800600177059,800600177062,800600177065,800600177066,800600177069,800600177070,800600177073,800600177074,800600177076,800600177079,800600177080,800600122398,800600122399,800600177204,800600177244,800600177283,800600177284,800600177282,800600177281,800600177280,800600177279,800600177278,800600177274,800600177273,800600177272,800600177266,800600132673,800600122669,800600177836,800600122843",
    //获取鉴权产品Id
    getAuthProductId: function () {
        var _this = this;
        try{
            return ajaxConf.SystemConfigKeys.authProductList.configValue || _this.productId_auth;
        }catch(e){}
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
        // sp_code  是      string  服务提供商的id
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
                if(xjDataLog.isIpDevice()){
                    JscnIPAAA.ready({
                        // smartCardid: _this.userInfoObj.data.userInfo.smartCardId,
                        type: 1,
                        stbid: xjDataLog.getStbId(),
                        sp_code: _this.spCode || "SP1N02A00_08_030"
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
                    });
                }
               
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
        var _this = this;
        if(xjDataLog.isIpDevice()) {
            JscnIPAAA.get_time_order_url({
                userCode: xjDataLog.getUserId(),
                loginToken: xjDataLog.getUserToken(),
                product_id: product.product_id,
                fee_id: product.fee_id,
                offer_id: product.offer_id,
                video_id: product.video_id,
                notify_url: product.notify_url,
                third_order_id: product.third_order_id,
                biz_code: _this.bizCode || "BIZ_XLSE_IP_AOT"
            }, function (resp) {
                callback && callback(resp)
            });
        } else {
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
        }
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
        
        JscnIPAAA.query_time_order_statue(params, function (resp) {
            callback && callback(resp)
        });

        JscnAAA.query_time_order_statue({
            order_id: order_id
        }, function (resp) {
            callback && callback(resp)
        });
    },




    /**
     * 通过设备号获取用户信息
     * @param {设备号} stb 
     */
    getUserInfo: function (callback) {
        var _this = this;
        callback = callback || function () {}
        if(xjDataLog.isIpDevice()){
            var _result = {
                "successFlg": 1,
                "errorCode": 1000,
                "data": {
                    "userInfo": {
                        "districtCode": "00000",
                        "cityCode": "00000",
                        "userCode": xjDataLog.getUserId(),
                        "setTopBoxId": xjDataLog.getMac(),
                        "phoneNumber": xjDataLog.getUserPhone(),
                        "userType": "2",
                        "TVCode": "0",
                        "smartCardId":  xjDataLog.getUserId(),
                        "status": "01"
                    },
                    "resultCode": 0
                }
            }
            callback(_result);
        } else {
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
        }
    },
    /**
     * 获取当前用户所属地市值  

     * @param fn  请求成功后的回调函数
     * @returns {string}
     */
    getAreaOfUser: function (fn) {
        var _this = this;
        var nowDateCook = "areaType_" + new Date().getMonth() + "" + new Date().getDate();
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
        if(!_this.areaMap) {
            _this.areaMap = {};
            for(var key in areaArr) {
                for(var i = 0; i < areaArr[key].length;i++) {
                    _this.areaMap[areaArr[key][i]]  = key;
                }
            }
        }
        var nowDateCookie = CT.getCookie(nowDateCook);
        if (nowDateCookie) {
            var districtCode = '1002' ;
            try{
                nowDateCookie = eval("(" + nowDateCookie + ")");
                districtCode = nowDateCookie.districtCode;
                areaCode = nowDateCookie.areaCode;
            } catch(e) {

            }
            if (fn && typeof fn == "function") {
                fn(areaCode,districtCode);
            } else {
                return nowDateCookie;
            }
        } else {
            this.getUserInfo(function (userData) {
                if (userData && userData.errorCode == "1000" && userData.data && userData.data.userInfo && userData.data.userInfo.cityCode) {
                    // var userArea = "nanjing";
                    userArea = _this.areaMap[userData.data.userInfo.cityCode] || _this.areaMap[userData.data.userInfo.districtCode] || "nanjing";
                    fn && fn(userArea,userData.data.userInfo.districtCode);
                    // for (var key in areaArr) {
                    //     for (var i = 0; i < areaArr[key].length; i++) {
                    //         if (userData.data.userInfo.cityCode == areaArr[key][i]) {
                    //             CT.setCookie(nowDateCook, key);
                    //             if (fn && typeof fn == "function") {
                    //                 fn(key);
                    //             } else {
                    //                 return key;
                    //             }
                    //         }
                    //     }
                    // }
                } else {
                    CT.setCookie(nowDateCook, ajax.jsonToString({areaCode:"nanjin",districtCode:101000}));
                    if (fn && typeof fn == "function") {
                        fn("nanjing",101000);
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
            stb = xjDataLog.getStbId();
            // stb = hardware.STB.serialNumber;
        } catch (e) {
            stb = "";
            // stb = "02176616470065332"
            stb = "81200619290004345";
        }
        return stb;
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
        var productId = option.productId ||  _this.getAuthProductId();
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
                    video_id : ""
                    /*video_id: Page.videoUrl*/
                } 
                if(xjDataLog.isIpDevice()) {
                    params = {
                        userCode: xjDataLog.getUserId(),
                        loginToken: xjDataLog.getUserToken(),
                        product_id: productId ,
                        video_id: ""
                        /*video_id: Page.videoUrl*/
                    }
                    window["JscnAAA"] = JscnIPAAA;
                }
                interface.loggerInfo("auth params>>>" + ajax.jsonToString(params), "post")
                JscnAAA.product_auth(params, function (resp) {
                    interface.loggerInfo("auth result>>>" + ajax.jsonToString(resp), "post")
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
                            option.suc && option.suc(resp);
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
                            interface.loggerInfo("用户状态异常,请退出重新进", 'post');
                            _this.toBasePackagePage(resp.errorCode);
                            break;
                        case "39": //欠费去充值
                            _this.toRecharge();
                            break;
                        default:
                            interface.loggerInfo("auth into swithc default >>" + ajax.jsonToString(resp), 'post');
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
     **    return_url： 页面返回地址,订购结果会在返回地址后面加上resultCode代表订购状态和errorMessage订购失败的描述的两个参数。
     **                resultCode 0 订购成功 -1 订购失败 1用户没有完成订购返回
     **    errorMessage： 订购结果描述
     **    product_id      是      string  产品包id。如果有多个产品包使用","分割。产品购买需要指定产品包购买时需要传入。
     **    video_id        否      string  媒资id
     **    extend_params   否      obj     扩展参数
     **/
    // toNewOrder: function (callback) {
    //     var _this = this;
    //     JscnAAA.get_order_product_list({
    //         product_id: _this.productId 
    //     }, function (p_resp) {
    //         xjDataLog.setUserAuthLogoInfo({
    //             "authState": 102,
    //             "authStateCname": p_resp.resultCode + "_" + p_resp.errorMessage,
    //             "productInfo": _this.getAuthProductId(),
    //             "more1": _this.userInfoObj.data.userInfo.smartCardId,
    //             "more2": _this.getStbId(),
    //             "more3": ajax.jsonToString(p_resp),
    //             "more4": _this.userInfoObj.data.userInfo.districtCode

    //         })

    //         _this.product_list = p_resp;
    //         //if ( p_resp.resultCode == "0" && p_resp.product_type == "2") {
    //         if ( p_resp.resultCode == "0") {
    //             callback && callback();
    //        // } else {
    //             //跳扫码订购页面
    //         //    _this.toOrderQRPage(0)
    //         }
    //     });
    // },

    /**
     * 余额支付
     */
    toPay: function () {
        var _this = this;
        if(xjDataLog.isGuestUser()) {
            xjDataLog.ipDeviceLogin();
            return;
        }
        // //订购触发锁
        // if(_this._to_pay_lock) return;
        // _this._to_pay_lock = true;
        // setTimeout(function(){
        //     _this._to_pay_lock = false;
        // },5000);
        //日志记录

        //页面访问日志和订购日志
        var backPrePage = CT.getCookie("backPrePage") || "";
        var fromPage = xjDataLog.getPageUrlName(backPrePage);
        xjDataLog.uploadOrderSuccess({
            orderState: "8",
            contentName: fromPage,
            more1 : "开始订购",
        });

        orderJs.initJscnAAA(function () {
            if (CT.getCookie("cardState")) {
                _this.cardCookie = CT.getCookie("cardState");
                CT.delCookie("cardState");
            }
            // xjDataLog.log
            if(!_this.productId_balance && !_this.productId_balance_nj) {
                _this.toErrorPage();
            }
            var productId = "";
            if (_this.cardCookie && _this.cardCookie == "true") {
                if (_this.productId_balance_card) {
                    productId = _this.productId_balance_card;
                }
                _this.cardCookie == "false";
            } else {
                if(_this.productId_balance) {
                    productId = _this.productId_balance;
                }
                if(_this.productId_balance_nj) {
                    if(productId!="") {
                        productId += ",";
                    }
                    productId += _this.productId_balance_nj;
                }
            }
            xjDataLog.uploadOrderSuccess({
                orderState: "10",
                contentName: fromPage,
                more1 : "注册成功",
            });
            _this.getProlistTimer = setTimeout(function(){

                xjDataLog.uploadOrderSuccess({
                    orderState: "11",
                    contentName: fromPage,
                    more1 : "获取产品列表超时",
                });
            },1000*3);
            loggerInfo('订购注册框架成功|'  , 'post');
            var _params = {
                product_id: productId
            };
            if(xjDataLog.isIpDevice()) {
                _params = {
                    // userCode: "155341773",
                    userCode: xjDataLog.getUserId(),
                    loginToken: xjDataLog.getUserToken(),
                    product_id: (_this.IpProduct && _this.IpProduct.id) || "800600178026",
                    biz_code: (_this.IpProduct && _this.IpProduct.bizCode) || "BIZ_XLSE_IP_BALANCE",
                }
                window["JscnAAA"] = JscnIPAAA
            }
            JscnAAA.get_order_product_list(_params, function (p_resp) {
                clearTimeout( _this.getProlistTimer);
                loggerInfo('获取产品列表成功2|' + ajax.jsonToString(p_resp) , 'post');
                if(!p_resp || !p_resp.product_list || p_resp.product_list.length <= 0 || !p_resp.product_list[0].id) {
                    
                    loggerInfo('获取可订购列表为空|'  , 'post');
                    var reason = "无可订购产品包";
                    if(p_resp && p_resp.result && p_resp.result.reason) {
                        reason = p_resp.result.reason;
                    } 
                    xjDataLog.uploadOrderSuccess({
                        orderState: "4",
                        contentName: fromPage,
                        more1 : reason,
                        more3: p_resp ? ajax.jsonToString(p_resp) : ""
                    });
                    //可能是非南京地区的
                    if(_this.productId_balance_nj && _this.productId_balance_nj != '') {
                        _this.productId_balance_nj = null;
                        _this.toPay();
                        return;
                    }
                    //无可订购产品包,跳转错误页.
                    setTimeout(function(){
                        // _this.toErrorPage();
                        CT.BackPortalMainPage();
                    },300);
                    return;
                }

                
                _this._findAuthTimer = setTimeout(function(){
                    loggerInfo('本地鉴权超时|' + ajax.jsonToString(p_resp) , 'post');
                    xjDataLog.uploadOrderSuccess({
                        orderState: "9",
                        contentName: fromPage,
                        more1 : "本地鉴权超时",
                    });
                    setTimeout(function(){
                        _this.toPay_api(p_resp);
                    },300);
                },2000);
                loggerInfo('获取产品列表成功2|' + ajax.jsonToString(p_resp) , 'post');
                interface.findAuth({params: {userId: _this.getUserId()},ajaxConfig: {async: true}},function(findAuth_res){
                    loggerInfo('调用自己鉴权一天内数据返回1|' + ajax.jsonToString(findAuth_res) , 'post');
                    clearTimeout(_this._findAuthTimer);
                    if(findAuth_res & findAuth_res["state"]+"" == '0') {
                        loggerInfo('本地鉴权已订购产品包', 'post');
                        //已订购产品包
                        xjDataLog.uploadOrderSuccess({
                            orderState: "5",
                            contentName: fromPage,
                            more1 : "本日已订购过产品包",
                        });
                        setTimeout(function(){
                            loggerInfo('调用自己鉴权一天内数据返回3|' + ajax.jsonToString(findAuth_res) , 'post');
                            // _this.toErrorPage();
                            CT.BackPortalMainPage();
                        },300);
                        // _this.toErrorPage();
                        return;
                    } else {
                        loggerInfo('调用自己鉴权一天内数据返回2|' + ajax.jsonToString(findAuth_res) , 'post');
                        _this.toPay_api(p_resp);
                    }
                });
            });
        });

    },
    toPay_api:function(p_resp){
        var _this = this;
        if(_this.toPayApiFlag) {return;}
        _this.toPayApiFlag = true;
        loggerInfo('去支付1|' + ajax.jsonToString(p_resp) , 'post');
        var backPrePage = CT.getCookie("backPrePage") || "";
        var fromPage = xjDataLog.getPageUrlName(backPrePage);
        if(!p_resp || !p_resp.product_list || p_resp.product_list.length <= 0 || !p_resp.product_list[0].id) {
            //无可订购产品包,跳转错误页
            xjDataLog.uploadOrderSuccess({
                orderState: "4",
                contentName: fromPage,
                more1 : "无可订购产品包2",
            });
            _this.toErrorPage();
            return;
        }else{
            xjDataLog.uploadOrderSuccess({
                orderState: "5",
                contentName: fromPage,
                more1 : "存在可订购产品包",
                more3 : ajax.jsonToString(p_resp)
            });
        }
        loggerInfo('去支付2|' + ajax.jsonToString(p_resp) , 'post');
        var __params = {
            "product_id": p_resp.product_list[0].id,
            "fee_id": p_resp.product_list[0].fee_id,
            "offer_id": p_resp.product_list[0].offer_id,
            "notify_url": "xxx",
            "third_order_id": "xxx"
        }
        if(xjDataLog.isIpDevice()) {
            __params = {
                userCode: xjDataLog.getUserId(),
                loginToken: xjDataLog.getUserToken(),
                "product_id": p_resp.product_list[0].id,
                "fee_id": p_resp.product_list[0].fee_id,
                "offer_id": p_resp.product_list[0].offer_id,
                "notify_url": "xxx",
                "third_order_id": "xxx"
            };
            window["JscnAAA"] = JscnIPAAA;
        }
        JscnAAA.balance_order(__params, function (resp) {
            try{
                loggerInfo('去支付x返回!!!!!!!!!!!!!!!!!!!!|');
                loggerInfo('去支付3|' + ajax.jsonToString(resp) , 'post');
    
                xjDataLog.uploadOrderSuccess({
                    orderState: "6",
                    contentName: fromPage,
                    more1 : "订购接口回调成功",
                    more3 : ajax.jsonToString(resp)
                });
                loggerInfo('order yeE pay into callback!|' + ajax.jsonToString(resp) , 'post');
            }catch(e) {
                
            }
            var orderFromType = 0;
            try {
                //页面访问日志和订购日志
                var backPrePage = CT.getCookie("backPrePage") || "";
                var fromPage = xjDataLog.getPageUrlName(backPrePage);
                if (backPrePage.indexOf("cartoonId") > -1) {
                    var cartoonId = xjDataLog.querySearchUrlKey(backPrePage, "cartoonId");
                    fromPage += "_" + cartoonId;
                } else if (backPrePage.indexOf("gameId") > -1) {
                    var gameId = xjDataLog.querySearchUrlKey(backPrePage, "gameId");
                    fromPage += "_" + gameId;
                } else if (backPrePage.indexOf("activity") > -1) {
                    var activityId = xjDataLog.querySearchUrlKey(backPrePage, "contentEName");
                    orderFromType = 2;
                    fromPage = activityId;
                }else{
                    var contentName = xjDataLog.querySearchUrlKey(backPrePage, "contentEName");
                    fromPage += "_" + contentName;
                }
                //上传结果日志
                var params = {
                    orderState: "",
                    contentName: fromPage,
                    more1 : "",
                    contentType: orderFromType,
                    productId : p_resp.product_list[0].id
                };
                try {
                    loggerInfo('order yeE pay result:' + CT.jsonToString(resp), 'post');
                    params.orderState = resp.resultCode + "";
                    params.more1 = resp.errorMessage;
                } catch (error) {
                    
                }
                //上传日志区分周卡新老用、用户
                var cardActId = null;
                if (p_resp.product_list[0].id = "800600133117") {
                    if (CT.getCookie("cardActId")) {
                        cardActId = CT.getCookie("cardActId");
                    }
                    //新用户
                    if (cardActId == "22") {
                        params.productId = "800600133117_0";
                    }
                    //老用户
                    if (cardActId == "23") {
                        params.productId = "800600133117_1";
                    }
                }
                try{
                    xjDataLog.uploadOrderSuccessBigData(params);
                }catch(ex1) { }
                try{
                    xjDataLog.uploadOrderSuccess(params);
                }catch(ex1) { }
            } catch (error) {
                loggerInfo('parse order yeE pay result failed:', 'post');
            }
            setTimeout(function(e){
                if (resp.resultCode + "" == "0") {
                    //一元周卡上传记录
                    if (p_resp.product_list[0].id == _this.productId_balance_card) {
                        if (CT.getCookie("cardActId")) {
                            cardActId = CT.getCookie("cardActId");
                            CT.delCookie("cardActId");
                        }
                        interface.insertActivityGainRecord({
                            params:{
                                userId: xjDataLog.getUserId(),
                                activityId: cardActId,
                                state: 1
                            }
                        }, function (res) {
                            console.log(res);
                        });
                    }

                    //权益中心首页订购加60分
                    if (CT.getCookie("pointsOrder")) {
                        //订购+60
                        setTimeout(function(){
                            interface.insertPoints({
                                params:{
                                    userid:xjDataLog.getUserId(),
                                    activityId: 1,
                                    taskid: 1,
                                    prizeid: 1,
                                    points: 60
                                },
                            },function(res){
                                // console.log(res);
                            });
                        },100);
                    }

                    //余额支付订购成功
                    _this.toOrderSucPage();
                } else {
                    //余额支付订购失败
                    if (CT.getCookie("pointsOrder")) {
                        CT.delCookie("pointsOrder");
                    }
                    _this.toOrderFailPage();
                }
            },250);
                // var returnUrl = _this.getOrderReturnUrl();
            // if (resp.resultCode + "" == "0") {
            //     returnUrl += "&resultCode=0&errorMessage=" + resp.errorMessage;
            // } else {
            //     returnUrl += "&resultCode=-1&errorMessage=" + resp.resultCode + "_" + resp.errorMessage;
            // }
            // window.location.href = returnUrl;
        })
    },
    /**
     *    * 去充值
     *       */
    toRecharge: function () {
        var _this = this;
        if(!xjDataLog.isIpDevice()) {
            JscnAAA.get_recharge_channel(function (resp) {
                if (resp.resultCode == 0) {
                    var aliPayUrl = resp.aliPayUrl;
                    var wechatPayUrl = resp.wechatPayUrl;
                    JscnAAA.go_recharge_page({
                        return_url: window.location.href
                    });
    
                }
            });
        } else {
            JscnIPAAA.get_recharge_channel({
                userCode: xjDataLog.getUserId,
                loginToken: xjDataLog.getUserToken()
            },function(){
                if (resp.resultCode == 0) {
                    var aliPayUrl = resp.aliPayUrl;
                    var wechatPayUrl = resp.wechatPayUrl;
                    JscnIPAAA.go_recharge_page({
                        return_url: window.location.href
                    });
    
                }
            }) 
        }

    },
    /**
   * 前端page内的鉴权缓存
   * 把该对象设为空,则直接走真实鉴权接口: orderJs.auth_cache_info = null
   */
    auth_cache_info:{
        //鉴权返回值: result: -1 未鉴权,1: 鉴权已订购,其他:鉴权未通过;
        result: -1,
        //authTime: 当前缓存的鉴权时间;
        authTime:new Date().getTime(),
        //data,鉴权返回信息;
        data:null,
        //time_out:鉴权有效时间(毫秒) 0:长期有效
        time_out:6000,
        // cache_strategy:鉴权策略:默认(0或没有) 只缓存已订购用户; 1 只缓存未订购用户, 2 缓存所有;
        cache_strategy:0
    },
     /**
   * 鉴权结果存入缓存
   * 
   */
  setAuthPageCacheInfo:function(cacheInfo){
    var _this = this;
    //根据auth_cache_info设置策略,存入缓存
    if(_this.auth_cache_info && cacheInfo) {
      if((!_this.auth_cache_info.cache_strategy && cacheInfo.result == 1) ||
        _this.auth_cache_info.cache_strategy == 2 ||
        (_this.auth_cache_info.cache_strategy == 1 && cacheInfo.result != 1)
      ){
      	_this.auth_cache_info.result = cacheInfo.result;
				_this.auth_cache_info.authTime = new Date().getTime();
        _this.auth_cache_info.data = cacheInfo.authData;
      }
    }
  },
  /**
   * 鉴权事件队列.用来保证鉴权事件有序执行.与缓存一起使用
   * state: 当前鉴权状态:idle 空闲;busy 忙; arrays: 鉴权单元数组
   * time_out:超时(毫秒)
   */
  auth_arr:{state:"idle",arrays:[],time_out:5000},
  /**
   * 判断鉴权队列是否空闲()并更改为busy状态
   * 
   */
  getAuthState:function(){
    var _this = this;
    if(this.auth_arr.state == 'idle') {
        clearTimeout(this.auth_arr.timer);
        this.auth_arr.timer = setTimeout(function() {
          _this.arrNextAuth();
        }, _this.auth_arr.time_out>0 ? _this.auth_arr.time_out:6000);
        this.auth_arr.state = 'busy'
        return true;
    }
    return  false;
  },
  /**
   * 调用缓存接口 如果需要调用缓存.查看orderJs.auth_cache_info说明
   * 调用getAuthInfo_api 则实时鉴权
   * @param {*} param_1 可为对象可以videoId
   * @param {*} curBooleanFree 是否免费.1为非免费
   * @param {*} callback 已订购回调函数
   * @param {*} callbackFail 非已订购回调函数
   */
  getAuth: function (success, failCallback) {
      if(typeof(success) === 'object' && typeof(success.failCallback) === 'function') {
        failCallback = success.failCallback;
      }
      if(typeof(success) === 'object' && typeof(success.successCallback) === 'function') {
        success = success.successCallback;
      }
      
    var _this = this;
    // success && success();return;
    _this.auth_arr.arrays.push({
        success:success,
        failCallback:failCallback
    });
    //调用鉴权队列
    _this.dealAuthArr();
},
/**
   * 处理鉴权列表
   */
  dealAuthArr: function(){
    var _this = this;
    if(_this.auth_arr.arrays.length == 0 || !_this.getAuthState()) {
      return;
    }
    //从队列取出鉴权单元,并处理为相应参数
    _param = _this.auth_arr.arrays.shift();
    var  success , failCallback;
    if(_param) {
        success = _param.success;
        failCallback = _param.failCallback;
    }
    //判断并使用缓存的鉴权信息
    if(_this.auth_cache_info && 
      _this.auth_cache_info.result != -1 && 
      _this.auth_cache_info.authTime > 0 && 
      (_this.auth_cache_info.time_out == 0|| 
        _this.auth_cache_info.authTime > (new Date().getTime()) 
      -  _this.auth_cache_info.time_out)) {
        // 已订购
        if(_this.auth_cache_info.result == 1) {
            success && success(_this.auth_cache_info.data);
        } else {
            //未订购
            _this.toAuthFail(failCallback,_this.auth_cache_info.data);
        }
        //执行队列下一个鉴权
        _this.arrNextAuth();
    } else {
        //实时鉴权结果并存入缓存
        _this.getAuth_api(
        function(data){
          _this.setAuthPageCacheInfo({result:1,authData:data});
          _this.arrNextAuth();
          success && success(data);
        }, 
        function(data){
            _this.setAuthPageCacheInfo({result:2,authData:data});
            _this.arrNextAuth();
            if(!failCallback){
                return true;
            } else {
                return failCallback(data);
            }
        });
	}
  },
   /**
   * 处理下一个鉴权元
   */
  arrNextAuth : function(){
    var _this = this;
    _this.auth_arr.state='idle';
    clearTimeout(_this.auth_arr.timer);
    _this.dealAuthArr();
  },

    /**鉴权未订购 */
    //跳转异常
    toAuthFail:function(callbackFail,res){
        var _this = this;
        //如果在订购失败方法返回true,表示继续执行
        if (!callbackFail || typeof callbackFail != "function" || callbackFail(res) == true) {
            _this.toOrderPage(); //订购页面
        } 
    },

    /**
     * 鉴权
     * @param suc  成功回调
     * @param fail  失败回调
     */
    getAuth_api: function (suc, fail) {
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
                        _this._findAuthTimer = setTimeout(function(){
                            _this.toAuthFail(fail,data);
                        },6000);
                        interface.findAuth({params: {userId: _this.getUserId()},ajaxConfig: {async: true}},function(findAuth_res){
                            clearTimeout(_this._findAuthTimer);
                            if(findAuth_res & findAuth_res["state"]+"" == '0') {
                                suc && suc("OK");
                            } else {
                                _this.toAuthFail(fail,data);
                            }
                        });
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
    //跳到指定订购页的areaCode
    // _activity_areaCodes : ["1002","1502","1503","1504","1505","1506","1510","1509","101000"],
    order_page_areaId :{},
    toOrderPage: function (_param) { // 跳转至订购页
        var _this = this;
        var order_eName = "orderPage_2019v1";
        var key_name = "orderPage4areaId";
        clearTimeout(_this.getSCBKTimer);
        if(!_param || !_param.result){
            if(ajaxConf.SystemConfigKeys && ajaxConf.SystemConfigKeys[key_name]) {
                var res = {data:ajaxConf.SystemConfigKeys[key_name]}
                var kvs = [];
                if(res && res.data && res.data.configValue) {
                    kvs = res.data.configValue.split("&");
                }
                _this.toOrderPage({result:true,data:kvs})
            } else {
                interface.getSystemConfigByKey(function(res){
                    var kvs = [];
                    if(res && res.data && res.data.configValue) {
                        kvs = res.data.configValue.split("&");
                    }
                    _this.toOrderPage({result:true,data:kvs})
                },key_name);
                _this.getSCBKTimer = setTimeout(function(){
                    _this.toOrderPage({result:true})
                },1200);
            }
            return;
        }
        //跳转订购页面前存储订购信息
        xjDataLog.saveOrderInfo();
        // orderJs.toNewOrder(function () {
        if(_param.data && _param.data.length) {
            for(var i = 0 ;i < _param.data.length; i++){
                var _item = _param.data[i];
                if(_item) {
                    var kvs = _item.split("=");
                    var eName = kvs[0];
                    var hours = "";
                    if(eName.indexOf(":") > 0){
                        var _eh = eName.split(":");
                        eName = _eh[0];
                        if(_eh.length > 1) {
                            hours = ',' + _eh[1] + ",";
                            if(hours.indexOf(',' + new Date().getHours() + ",") < 0) {
                                continue;
                            }
                        }
                    }
                    if(kvs.length > 0) {
                        var areaIds = kvs[1] + ",";
                        _this.getAreaOfUser(function(res,areaCode){

                            //武进区、淮安、溧阳的先写死
                            if((areaCode == '3317' || ",3020,3021,3031,3036,3037,3038,3063,101600,3020,3021,3031,3036,3037,3038,3063,101600,3065," .indexOf("," + areaCode + ",") >=0) && CT.requestValue("contentName").indexOf('OrderPageQR2') < 0) {
                                CT.getAnterByIdOrAction({
                                    contentName: "OrderPageQR2"
                                });
                                return;
                            }
                            if(areaIds.indexOf(areaCode + ",") >=0) {
                                CT.getAnterByIdOrAction({
                                    contentName: eName
                                });
                            } else {
                                CT.getAnterByIdOrAction({
                                    contentName: order_eName
                                });
                            }
                        });
                        return;
                    }
                }
            }
        }
        //指定跳转地区
        // if(areaCode && _this._activity_areaCodes.indexOf(areaCode) >= 0) {
        CT.getAnterByIdOrAction({
            contentName: order_eName
        })
        // });
    },
    // 跳转至二级订购页
    toSecOrderPage: function () {
        var _this = this;
        // orderJs.toNewOrder(function () {
            _this.getAreaOfUser(function(res,areaCode){
                if(areaCode && _this._activity_areaCodes.indexOf(areaCode) >= 0) {
                    CT.getAnterByIdOrAction({
                        contentName: "springRecommendPage_RDlfxjhddgyej202011"
                    })
                } else {
                    CT.getAnterByIdOrAction({
                        contentName: "orderPage2_2019v1"
                    })
                }
            });
        // })
    },
    //type: 0南京订购  1全省跳余额   二维码订购页
    toOrderQRPage: function (type) { // 扫码页面
        var _this = this;
        CT.getAnterByIdOrAction({
            contentId: "274"
        });
    },
    toOrderSucPage: function () { // 订购成功页面
        CT.getAnterByIdOrAction({
            contentName: "orderSuc_2019v1"
        });
    },
    toOrderFailPage: function () { // 订购失败页面
        CT.getAnterByIdOrAction({
            contentName: "orderFail_2019v1"
        });
    },
    toBasePackagePage: function (errCode) { // 基础包不存在
        loggerInfo('order: BasePackage nothingness', 'post');
        if(errCode) {
            CT.getAnterByIdOrAction({
                contentName: "basePackagePage"
            },{errCode : errCode});
        } else {
            CT.getAnterByIdOrAction({
                contentName: "basePackagePage"
            });
        }
    },
    toNotExistDevicePage: function () { // 设备不存在
        loggerInfo('order: device nothingness', 'post');
        CT.getAnterByIdOrAction({
            contentName: "notExistDevicePage"
        });
    },
    toErrorPage: function () { // 跳转到错误页面
        CT.getAnterByIdOrAction({
            contentName: "404_2019v1"
        });
    },


   
    //更改 PVUV表 订购页的页面类型，大数据入库用
    collOrderLog: function () {
        var p = new logCollParam();
        p.contentType = "order";
        xjDataLog.logCollection(p);
    },

}



window.addEventListener("load", function () {
    var curUrl = window.location.href;
    if (curUrl.indexOf("newmain") > -1 || curUrl.indexOf("videoDetail") > -1) {
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
        }, 1000)
    }

})

function loadingJS0(url,jsObj) {
        var loadCommomDate = "20200519";
        var jsObjType = typeof jsObj;
        if(jsObjType == 'string'){
            var jsUrl = url + jsObj + '.js?v=' + loadCommomDate;
            document.write('<script type="text/javascript" src=' + jsUrl + '>' + '</script>');
        }else if(jsObjType == 'object'){
			var jsUrl = "";
            for(var i = 0; i < jsObj.length; i++){
                jsUrl = '<script type="text/javascript" src=' + url + jsObj[i] + '.js?v=' +  loadCommomDate + '>' + '</script>';
                document.write(jsUrl);
            	}
        }
    }
    if(xjDataLog.isIpDevice()) {
        loadingJS0("","http://172.31.183.181:8080/webapp_v2/JscnIPAAA");
        if(JscnIPAAA) {
            window["JscnAAA"] = JscnIPAAA;
        }
    } else {
        loadingJS0("","http://172.31.183.225:8080/webapp_v2/JscnAAA");
    }




    