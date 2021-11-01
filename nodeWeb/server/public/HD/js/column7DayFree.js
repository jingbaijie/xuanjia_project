var sevenDayFree = {
    freeAudioMp3: AjaxConfig.projectUrl + "HD/images/audio/freeTip.mp3",
    timeOrderMp3: AjaxConfig.projectUrl + "HD/images/audio/timeToOrder.mp3",
    activityId: 18,
    haveClickFree: false,
    pageBackFunc: null,
    modelShow: false,
    modelHaveShow: false,
    haveCheck: false,
    lastFocus: "",
    testArr: [],//["05510718100038292","05510718100038292","04440714190000050"];
    userId: xjDataLog.getUserId(),
    getAjax: function(option,callback){
        ajax.init({
            url: option.url,
            method: option.method,
            params: option.params,
            success: function (msg) {
                callback && callback(msg);
            },
            fail: function (status) {
                callback && callback(false);
            }
        });
    },
    //获取上个月该用户是否有pv记录
    getLastUserRecordUrl: AjaxConfig.origin + "/iptv-userrecord/user/info/getLastUserRecord",
    getLastUserRecord: function(callback){
        var _this = this;
        this.getAjax({
            url: _this.getLastUserRecordUrl,
            method: "GET",
            params: {userId: xjDataLog.getUserId(),database: "cloud_base_channel_log_v1_3"}
        },function(msg){
            callback && callback(msg);
        });
    },
    //查询用户状态信息(是否获取体验卷，已获取的时长)
    getExperienceUserUrl: AjaxConfig.interfaceUrl + "/getExperienceUser",
    getExperienceUser: function(callback){
        var _this = this;
        this.getAjax({
            url: _this.getExperienceUserUrl,
            method: "GET",
            params: {userId: xjDataLog.getStbId()}
        },function(msg){
            callback && callback(msg);
        });
    },
    //保存体验券用户
    saveExperienceUserUrl: AjaxConfig.interfaceUrl + "saveExperienceUser",
    saveExperienceUser: function(callback){
        var _this = this;
        this.getAjax({
            url: _this.saveExperienceUserUrl,
            method: "GET",
            params: {userId: xjDataLog.getStbId()}
        },function(msg){
            callback && callback(msg);
        });
    },
    getChanceUrl : ajaxConf.webApiUrl + "activity/getUsedChanceForToday",
    /**
     *获取用户已使用机会次数
        * @param fn 回调方法
        * 用法: actiObj.getChance(function(data){
        *
        * });
        */
    getChance: function(callback){
        var _this = this;
        this.getAjax({
            url: _this.getChanceUrl,
            method: "GET",
            params: {
                userId: xjDataLog.getUserId(),
                activityId: _this.activityId
            }
        },function(msg){
                callback && callback(msg);    
        });
    },
    setChanceUrl :  ajaxConf.webApiUrl + "activity/saveActivityChance",
    /**
     * 上传用户此次使用机会
     * @param fn 回调方法
     * 用法: actiObj.setChance(function(data){
     *
     * })
     */
    setChance: function(callback){
        var _this = this;
        this.getAjax({
            url: _this.setChanceUrl,
            method: "GET",
            params: {
                userId: xjDataLog.getUserId(),
                activityId: _this.activityId
            }
        },function(msg){
                callback && callback(msg);    
        });
    },
    /**
     * xjcartoon_activity_userdata
     *获取当前用户存储信息(可存取任意长度为255内的字符串)   activityId   userId
    * 返回信息
    * 在当前活动有存储数据
    * {
        data: {
            activityId: 1,
            id: 3,
            loginTime: null,
            more1: null,
            more2: null,
            userActiData: "1_1_1",
            userId: "96321"
        },
        errorCode: "1000",
        errorMsg: "操作成功",
        successFlg: 1
    }
    *
    * 在当前活动无存储信息
    * {
        data: "",
        errorCode: "1007",
        errorMsg: "结果集为空",
        successFlg: 0
    }
    */
    getUserDataListUrl : ajaxConf.webApiUrl + "activity/getActivityUserDataList",
    /**
     * 获取当前用户在当前活动中存储的信息
     * @param fn 回调函数
     * 用法: actiObj.getUserDataList(function(data){
     *
     * })
     */
    getUserDataList: function(fn){
        var _this = this;
        this.getAjax({
            url: _this.getUserDataListUrl,
            method: "GET",
            params: {
                activityId: _this.activityId,
                userId: xjDataLog.getUserId()
            }
        },function(data){
                fn && fn(data); 
        });
    },
    /**
     * xjcartoon_activity_userdata
     * 设置当前用户存储信息(可存取任意字符串)
     * 请求参数: activityId   userId    userActiData(任意的需存储的字符串信息)
     * 返回信息
     * 请求成功
     * {
            data: "",
            errorCode: "1000",
            errorMsg: "操作成功",
            successFlg: 1
        }
        *
        * 请求失败
        * {
            data: "",
            errorCode: "1000",
            errorMsg: "操作失败",
            successFlg: 0
        }
        *
        */
    setUserDataListUrl : ajaxConf.webApiUrl + "activity/setActivityUserData",
    /**
     * 设置当前用户需存储的信息
     * @param userData 需设置的信息
     * @param fn 回调函数
     * 用法: actiObj.setUserDataList(function(data){
     *
     * })
     */
    setUserDataList: function(userData,fn){
        var _this = this;
        this.getAjax({
            url: _this.setUserDataListUrl,
            method: "GET",
            params: {
                activityId: _this.activityId,
                userId: xjDataLog.getUserId(),
                userActiData: userData
            }
        },function(data){
            fn &&fn(data); 
        });
    },
    parentDom: document.body,
    haveShow: false,
    showInter: null,//弹窗展示倒计时定时器
    showTime: 5,//倒计时时间，单位秒
    freeModelHTML: '<div id = "sevenDayGrayBg" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;background: black;opacity: 0.7;z-index: 1000;"></div>'
    +'<div id = "freeModelBg" style = "width: 1035px;height: 720px;position: absolute;top: 0;left: 120px;background: url(./HD/images/column7DayFree/20210527/getFree/xuanwo.png)no-repeat;"></div>'
    +'<div id = "freeModel" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;background: url(./HD/images/column7DayFree/20210527/getFree/BG.png?v=202106)no-repeat;z-index: 1000;" alt = "">'
    +'<div id = "hands_x0_y0_getFreeFocus_" style = "width: 616px;height: 201px;position: absolute;top: 435px;left: 345px;">'
    +'<img src = "./HD/images/column7DayFree/20210527/getFree/start.png" style = "position: absolute;top: 0;left: 0;" alt = "">'
    +'<img id = "getFreeFocus" src = "./HD/images/column7DayFree/20210527/getFree/started.png" style = "position: absolute;top: 0;left: 0;visibility: hidden;" alt = "">'
    +'</div>'
    +'<div id = "sucTip" style = "width: 1280px;height: 50px;position: absolute;top: 295px;left: 0px;text-align: center;color: #ffe42f;font-size: 30px;line-height: 50px;visibility: hidden;">恭喜您成功领取7天免费会员！</div>'
    +'</div>',
    toOrderModelHTML: '<div id = "sevenDayGrayBg" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;background: black;opacity: 0.7;z-index: 1000;"></div>'
    +'<div id = "toOrderModel" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;background: url(./HD/images/column7DayFree/20210527/getOrder/BG.png?v=202106)no-repeat;z-index: 1000;" alt = "">'
    +'<img id = "columnMoveIce" src = "./HD/images/column7DayFree/20210527/getOrder/move0.png" style = "position: absolute;top: 190px;left: 700px;" alt = "">'
    +'<div id = "hands_x0_y0_getOrderFocus_" style = "width: 616px;height: 201px;position: absolute;top: 440px;left: 370px;">'
    +'<img src = "./HD/images/column7DayFree/20210527/getOrder/start.png" style = "position: absolute;top: 0;left: 0;" alt = "">'
    +'<img id = "getOrderFocus" src = "./HD/images/column7DayFree/20210527/getOrder/started.png" style = "position: absolute;top: 0;left: 0;visibility: hidden;" alt = "">'
    +'</div></div>',
    init: function(){
        var _this = this;
        this.getChance(function(chanceMsg){
            if((chanceMsg && chanceMsg.data && chanceMsg.data.activityChance == 0) || _this.testArr.indexOf(_this.userId+"") > -1){
                var canShow = true;
            }else{
                _this.backToBack()
                return;
            }
            //interface.checkUserBlackWhiteList({userId: xjDataLog.getUserId()},function(whiteMsg){
                orderJs.columnGetAuth(function(authData){
                    if(authData != 0 || _this.testArr.indexOf(_this.userId+"") > -1){//|| (whiteMsg && whiteMsg.errorCode == 1011)
                        _this.getLastUserRecord(function(recentMsg){
                            if(recentMsg && recentMsg.data > 0){
                                _this.getExperienceUser(function(canMsg){
                                    if(canMsg && canMsg.data){//用户本月已体验
                                        if(canMsg.data.more3 == 1){//真实兑换时间为末尾，本月失效，但是仍然可以兑换
                                            _this.showGetVip();
                                            return;
                                        }
                                        if(canMsg.data.more2 == 1){//当前用户已兑换，并且已过期
                                            _this.getUserDataList(function(userDataMsg){
                                                var monthData = new Date().getMonth();
                                                if(userDataMsg && userDataMsg.data && userDataMsg.data.userActiData && userDataMsg.data.userActiData == monthData){

                                                }else{
                                                    _this.showToOrder();
                                                    var saveMonthData = new Date().getMonth();
                                                    _this.setUserDataList(saveMonthData);
                                                }
                                            });
                                            return;
                                        }
                                        _this.backToBack();
                                    }else{//用户未体验，显示体验弹框提示用户去体验
                                        _this.showGetVip();
                                    }
                                });
                            }
                        });
                    }
                });
            //})
        });
    },
    hiddenVideo: function(){
        if (videoPlayer.timer !== null) {
            clearInterval(videoPlayer.timer);
            videoPlayer.timer = null;
        }
        videoPlayer.exitPage();
    },
    showGetVip: function(){
        var _this = this;
        this.modelHaveShow = true;
        this.setChance();
        this.modelShow = true;
        this.lastFocus = curFocus.FocusID;
        this.addAudio(_this.freeAudioMp3);
        this.parentDom.innerHTML += _this.freeModelHTML;
        curFocus.defaultBlur();
        buttons.push({
            id: "hands_x0_y0_getFreeFocus_",
            clickHandler: "javascript: sevenDayFree.getVipPower()",
            left: "disable",
            right: "disable",
            up: "disable",
            down: "disable",
            focusType: 7
        });
        if(window.location.href.indexOf("newmain") > -1 && parseInt(CT.$("main").style.top) <= 0){
            try{
                page.videoHidden(-100);
            }catch(e){}
        }
        if(window.location.href.indexOf("cartoon_detail_2019v1") > -1){
            try{
                _this.hiddenVideo(-100);
            }catch(e){}
        }
        PAGE.focusInit();
        PAGE.changeFocus("hands_x0_y0_getFreeFocus_");
        xjDataLog.logCollection((CT.getCookie("logCollParam")));
        var json = ajax.jsonToString(new logCollParam(parseInt(((new Date().getTime()) - window.entryTime) / 1000)));
        CT.setCookie("logCollParam", (json));
        xjDataLog.logCollection((CT.getCookie("logCollParam")));
    },
    showToOrder: function(){
        var _this = this;
        this.setChance();
        this.modelHaveShow = true;
        this.modelShow = true;
        this.lastFocus = curFocus.FocusID;
        this.addAudio(_this.timeOrderMp3);
        this.parentDom.innerHTML += _this.toOrderModelHTML;
        curFocus.defaultBlur();
        buttons.push({
            id: "hands_x0_y0_getOrderFocus_",
            clickHandler: "javascript: sevenDayFree.toOrderPage()",
            left: "disable",
            right: "disable",
            up: "disable",
            down: "disable",
            focusType: 7
        });
        if(window.location.href.indexOf("newmain") > -1 && parseInt(CT.$("main").style.top) <= 0){
            try{
                page.videoHidden(-100);
            }catch(e){}
        }
        if(window.location.href.indexOf("cartoon_detail_2019v1") > -1){
            try{
                _this.videoHidden(-100);
            }catch(e){}
        }
        PAGE.focusInit();
        PAGE.changeFocus("hands_x0_y0_getOrderFocus_");
        _this.orderConToInter();
        xjDataLog.logCollection((CT.getCookie("logCollParam")));
        var json = ajax.jsonToString(new logCollParam(parseInt(((new Date().getTime()) - window.entryTime) / 1000)));
        CT.setCookie("logCollParam", (json));
        xjDataLog.logCollection((CT.getCookie("logCollParam")));
    },
    orderConToInter: function(){
        setInterval(function(){
            var columnMoveIceLeft = parseInt(CT.$("columnMoveIce").style.left);
            columnMoveIceLeft = columnMoveIceLeft - 80;
            CT.$("columnMoveIce").style.left = columnMoveIceLeft + "px";
            if(columnMoveIceLeft <= 400){
                CT.$("columnMoveIce").src = "./HD/images/column7DayFree/20210527/getOrder/move2.png";
            }else if(columnMoveIceLeft <= 680){
                CT.$("columnMoveIce").src = "./HD/images/column7DayFree/20210527/getOrder/move1.png";
            }else{
                CT.$("columnMoveIce").src = "./HD/images/column7DayFree/20210527/getOrder/move0.png";
            }
            if(columnMoveIceLeft <= 320){
                CT.$("columnMoveIce").src = "./HD/images/column7DayFree/20210527/getOrder/move0.png";
                CT.$("columnMoveIce").style.left = "700px";
            }
        },200);
    },
    toOrderPage: function(){
        orderJs.toOrderPage();
    },
    getVipPower: function(){
        var _this = this;
        if(this.haveClickFree){
            return;
        }else{
            this.haveClickFree = true;
        }
        this.saveExperienceUser(function(msg){
            if(msg && msg.successFlg == 1){
                CT.$("sucTip").innerHTML = "您已成功领取3天免费会员！";
                CT.$("sucTip").style.visibility = "visible";
                setTimeout(function(){
                    CT.$("sucTip").style.visibility = "hidden";
                    _this.hideModel();
                },3000);
            }else{
                CT.$("sucTip").innerHTML = "本次会员体验名额已全部发放，请关注下期活动内容！";
                CT.$("sucTip").style.visibility = "visible";
                setTimeout(function(){
                    CT.$("sucTip").style.visibility = "hidden";
                    _this.hideModel();
                },3000);
            }
        });
    },
    hideModel: function(){
        if(window.location.href.indexOf("newmain") > -1 && parseInt(CT.$("main").style.top) <= 0){
            page.playSmallVideo();
        }
        if(window.location.href.indexOf("cartoon_detail_2019v1") > -1){
            page.playSmallVideo();
        }
        if(CT.$("freeModel")){
            CT.$("freeModelBg").style.visibility = "hidden";
            CT.$("freeModel").style.visibility = "hidden";
        }else if(CT.$("toOrderModel")){
            CT.$("toOrderModel").style.visibility = "hidden";
        }else{
            console.log("1");
        }
        CT.$("sevenDayGrayBg").style.visibility = "hidden";
        this.modelShow = false;
        PAGE.changeFocus(this.lastFocus);
    },
    backToBack: function(){
        if(!this.haveCheck){
            backFunc();
        }
    },
    resetBackFunc: function(){
        var _this = this;
        try{
            if (typeof backFunc == "function") {
                this.pageBackFunc = backFunc;
                backFunc = function(){
                    if(false && !sevenDayFree.modelHaveShow && (CT.querySearchUrlKey(window.location.href,"contentName") == "springRecommendPage_xtcljy" || CT.querySearchUrlKey(window.location.href,"contentName") == "orderPage1_xjzb" || CT.querySearchUrlKey(window.location.href,"contentName") == "xszorderPage1")){
                        sevenDayFree.modelHaveShow = true;
                        sevenDayFree.init();
                    }else{
                        if(sevenDayFree.modelShow){
                            sevenDayFree.hideModel();
                        }else{
                            sevenDayFree.pageBackFunc();
                        }
                    }
                }
            }
        }catch(e){}
        try{
            if (typeof backfunc == "function") {
                this.pageBackFunc = backfunc;
                backfunc = function(){
                    if(false && !sevenDayFree.modelHaveShow && (CT.querySearchUrlKey(window.location.href,"contentName") == "springRecommendPage_xtcljy" || CT.querySearchUrlKey(window.location.href,"contentName") == "orderPage1_xjzb" || CT.querySearchUrlKey(window.location.href,"contentName") == "xszorderPage1")){
                        sevenDayFree.modelHaveShow = true;
                        sevenDayFree.init();
                    }else{
                        if(sevenDayFree.modelShow){
                            sevenDayFree.hideModel();
                        }else{
                            sevenDayFree.pageBackFunc();
                        }
                    }
                }
            }
        }catch(e){}
        
        
    },
    addAudio: function(audioUrl){
        /*var _this = this;
        if(window.location.href.indexOf("cartoonId") > -1){
            return;
        }
        if(CT.querySearchUrlKey(window.location.href,"contentId") == 31){
            if(CT.$("main") && parseInt(CT.$("main").style.top) <= 0){
                return;
            }
        }
        videoPlayer.createPlayer({
            width: 10,
            height: 10,
            top: 100,
            left: 100,
            playUrl: audioUrl,
            isFullScreenPlay: false
        })*/
    }
}
/*var column7DayInter = setInterval(function(){
    try{
        var beginTime = columnHaveClick;
    }catch(e){
        var beginTime = new Date().getTime();
    }
    var canShow = true;
    var nowTime = new Date().getTime();
    if(window.location.href.indexOf("column") > -1 || window.location.href.indexOf("videoId") > -1 || window.location.href.indexOf("order") > -1 || window.location.href.indexOf("tsyzym") > -1){
        canShow = false;
    }
    if(nowTime - beginTime < 10000){
        canShow = false;
    }
    if(canShow){
        clearInterval(column7DayInter);
        sevenDayFree.haveCheck = true;
        sevenDayFree.init();
    }
},5000);*/
setTimeout(function(){
    try{
        if(backFunc){
            sevenDayFree.resetBackFunc();
        }
    }catch(e){}
    try{
        if(backfunc){
            sevenDayFree.resetBackFunc();
        }
    }catch(e){}
    var canShow = true;
    if(window.location.href.indexOf("column") > -1 || window.location.href.indexOf("videoId") > -1 || window.location.href.indexOf("order") > -1 || window.location.href.indexOf("tsyzym") > -1){
        canShow = false;
    }
    if(canShow){
        sevenDayFree.haveCheck = true;
        sevenDayFree.init();
    }
},5000);