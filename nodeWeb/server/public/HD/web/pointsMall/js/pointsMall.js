
var commonPageInfo = basePageInfo.commonPageInfo;
var recommend_1 = basePageInfo.commonPageInfo.recommend_1;
var recommend_2 = basePageInfo.commonPageInfo.recommend_2;
var recommend_3 = basePageInfo.commonPageInfo.recommend_3;
var recommend_4 = basePageInfo.commonPageInfo.recommend_4;
var recommend_5 = basePageInfo.commonPageInfo.recommend_5;
var recommend_6 = basePageInfo.commonPageInfo.recommend_6;
var recommend_7 = basePageInfo.commonPageInfo.recommend_7;
var recommend_8 = basePageInfo.commonPageInfo.recommend_8;
var recommend_9 = basePageInfo.commonPageInfo.recommend_9;
var recommend_10 = basePageInfo.commonPageInfo.recommend_10;
var pointsMallObj = {
    //默认焦点
    defaultFocus: 'hands_x0_y0_toMission_',
    babySex: null,
    //页面id
    contentId: commonPageInfo.pageInfo.commonPageId || 1,
    //用户id(小写)
    userid: null,
    //是否订购标签 1 订购 0 未订购
    isOrder: null,
    ageMark: null,
    ageRegion: 1,
    //信息表主键id
    infoId: null,
    //上传接口的爱好字符串
    likeMarkStr: "",
    likeMarkArr: [],
    babyRname: "猪猪侠",
    //头像昵称关联的index more1
    babyIndex: 8,
    userPhoneNum: null,
    userAge: null,
    //注册信息是否完整 0 不完整 1 完整  more2
    registerSuc: null,
    //是否第一次注册 0 第一次 1 不是第一次
    newRegister: null,
    babyNameArr: ['贝乐虎', '冰公主', '驰小飞', '炽焰队长', '萌可', '巨神战击队', '恐龙阿贡', '奶龙', '猪猪侠', '小麦奇','彩虹'],
    //头像数组
    avatarArr: basePageInfo.commonPageInfo.recommend_6,
    //返回事件标签
    pageIndex: 0,
    //订购状态标签 1 为订购 0 未订购
    orderMark: null,
    //订购次数，判断是否加分
    orderTimes: null,
    //签到次数，判断是否加分
    signTimes: null,

    init: function () {
        var _this = this;
        //初始化鉴权事件
        _this.userid = xjDataLog.getUserId();
        try{
            // if(window.navigator.userAgent.toUpperCase().indexOf("WIN64") > 0) {
            //     orderJs.auth_cache_info = {
            //         //缓存标识
            //         cacheId: null,
            //         //鉴权返回值: result: -1 未鉴权,1: 鉴权已订购,其他:鉴权未通过;
            //         result: 2,
            //         //authTime: 当前缓存的鉴权时间;
            //         authTime: new Date().getTime(),
            //         //data,鉴权返回信息;
            //         data: [],
            //         //time_out:鉴权有效时间(毫秒) 0:长期有效
            //         time_out: 0,
            //         // cache_strategy:鉴权策略:默认(0或没有) 只缓存已订购用户; 1 只缓存未订购用户, 2 缓存所有;
            //         cache_strategy: 2
            //     };
            // // xjDataLog.getUserId = function(){return "04440714190000050"};
            // }
        }catch(e){}
        _this.buttonsPush();
        PAGE.focusInit();
        _this.creatConvertDom();
        _this.initUserInfo();
        setTimeout(function(){
            _this.showConvertInfo();
        },100);
        // 页面初始化默认焦点
        _this.getUserSumPoints();
        setTimeout(function(){
            // 页面初始化默认焦点
            _this.showBabyInfo();
            //任务页跳转进行注册
            setTimeout(function(){
                if ( CT.requestValue('defaultFocus') == "hands_x0_y0_toRegister_" && pointsMallObj.registerSuc != 1 ) {
                    // _this.defaultFocus = "hands_x0_y0_toRegister_";
                    _this.toRegister();
                }
            },100);
            PAGE.focusInit();
            _this.orderGetAuth();
            // var nextNode = PAGE.getModelByFocusId(_this.defaultFocus);
            // if (typeof(nextNode) == "undefined" || !nextNode) {
            //     if (CT.$("orderAlert").style.display = "none") {
            //         nextNode = PAGE.getModelByFocusId("hands_x0_y0_toMission_");
            //     }
            // } 
            // curFocus = nextNode;
            curFocus.defaultFocus();
            
        },200);
        if (CT.$("registerAlert") && CT.$("registerAlert").style.display == "none" && curFocus.FocusID == "hands_x0_y0_changeName_" && CT.$("orderAlert").style.display == "none") {
            setTimeout(function(){
                PAGE.changeFocus("hands_x0_y0_toMission_");
            },100);
        }
    },

    //展示订购弹窗
    showOrderAlert: function () {
        var _this = this;
        if ( CT.requestValue('defaultFocus') != "hands_x0_y0_toRegister_" ) {
            CT.$('orderAlert').style.display = "block"
            CT.$('mengban').style.visibility = "visible";
            PAGE.getModelByFocusId("hands_x0_y0_alertOrder_").enFocus = true;
            // PAGE.getModelByFocusId("hands_x0_y0_orderCancel_").enFocus = true;
            PAGE.getModelByFocusId("hands_x0_y0_alertBack_").enFocus = true;
            PAGE.getModelByFocusId("hands_x0_y0_backOrder_").enFocus = true;
            setTimeout(function(){
                PAGE.changeFocus("hands_x0_y0_alertOrder_");
            },100);
            if (_this.orderTimes == 0) {
                //订购按钮改样式
                CT.$('hands_x0_y0_orderCancel_').style.display = "block";
                PAGE.getModelByFocusId("hands_x0_y0_orderCancel_").enFocus = true;
                CT.$('orderAlert').style.background = "url("+AjaxConfig.imgUrl + recommend_9[4].recommendPic.picPath+") center center no-repeat";
                CT.$('hands_x0_y0_alertOrder_').style.background = "url("+AjaxConfig.imgUrl + recommend_9[0].recommendPic.picPath+") center center no-repeat";
                CT.$('hands_x0_y0_alertOrder_').style.width = "199px";
                CT.$('hands_x0_y0_alertOrder_').style.height = "164px";
                CT.$('alertOrder').src = AjaxConfig.imgUrl + recommend_9[0].recommendLabelpic.picPath;
                CT.$('alertOrder').style.top = "-22px";
                CT.$('alertOrder').style.left = "-6px";
            }

            _this.pageIndex = 5;
        }
    },

    //用户进入上传默认信息
    initUserInfo: function () {
        var _this = this;
        interface.getUserInfoList({
            params: {
                userid: xjDataLog.getUserId()
            } 
        }, function (data) {
            //是否有数据
            if (!data || !data.data || data.data.length == 0) {
                _this.pageIndex = 5;
                interface.addUserInfo(
                    {
                        params: {
                            nickName: "猪猪侠",
                            age: 1,
                            userid: xjDataLog.getUserId(),
                            more1: 8,
                        }
                    },
                    function (res) {
                        // console.log(res);
                    }
                );
            }
            // console.log("a" + data);
        });
        
    },

    //页面初始化鉴权
    orderGetAuth: function () {
        var _this = this;
        var authObj = {
            successCallback: function () {
                CT.$('vipMark').style.visibility = "visible";
                CT.$('hands_x0_y0_toOrder_').style.display = "none";
                CT.$('hands_x0_y0_orderCancel_').style.display = "none";
                CT.$('rightTips').innerHTML = "完成任务获得更多贝壳";
                _this.orderMark = 1;
                //订购鉴权通过加积分  签到
                interface.insertPoints({
                    params:{
                        userid: xjDataLog.getUserId(),
                        activityId: 1,
                        taskid: 2,
                        prizeid: 4,
                        points: 3
                    },
                },function(res){
                    // console.log(res);
                });
                //订购+30
                setTimeout(function(){
                    interface.insertPoints({
                        params:{
                            userid:xjDataLog.getUserId(),
                            activityId: 1,
                            taskid: 1,
                            prizeid: 7,
                            points: 30
                        },
                    },function(res){
                        // console.log(res);
                    });
                },200);
                _this.isOrder = 1;
            },failCallback:function() {
                _this.orderMark = 0;
                CT.$('vipMark').style.visibility = "hidden";
                CT.$('hands_x0_y0_orderCancel_').style.display = "none";
                //签到加分
                interface.insertPoints({
                    params:{
                        userid: xjDataLog.getUserId(),
                        activityId: 1,
                        taskid: 2,
                        prizeid: 3,
                        points: 2
                    },
                },function(res){
                    // console.log(res);
                });
                _this.isOrder = 0;
            }
        }
        orderJs.getAuth(authObj);
    },

    //页面初始化调用接口展示用户数据
    showBabyInfo: function () {
        var _this = this;
        //注册任务完成次数
        interface.getTaskByUserId({params:
            {
                userId: xjDataLog.getUserId(),
                prizeType: 2,
                activityId:1
            }
        },function(res){
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].name == "注册任务") {
                    _this.registerSuc = Number(res.data[i].hasFinish);
                    if (res.data[i].hasFinish == 1) {
                        //如果注册信息完整，就算完成注册任务
                        // _this.defaultFocus = "hands_x0_y0_toMission_";
                    } else {
                        //未完成注册任务
                    }
                }
                //完成订购任务
                if (res.data[i].name == "订购任务") {
                    _this.orderTimes = Number(res.data[i].hasFinish);
                    if (res.data[i].hasFinish == 0) {
                        //如果没有加过订购的积分
                    }
                }
                //完成订购任务
                if (res.data[i].name == "签到任务") {
                    _this.signTimes = Number(res.data[i].hasFinish);
                    if (res.data[i].hasFinish == 0) {
                        //如果没有签到的弹出订购弹窗
                        _this.showOrderAlert();
                    }
                }
            }
            // console.log(res);
        });
        // setTimeout(function(){
            //注册界面保留数据
            interface.getUserInfoList({params:{userid:xjDataLog.getUserId()}},
                function(res){
                    if (!res || !res.data || res.data.length == 0) {
                        //未注册用户
                        _this.newRegister = 0;
                        CT.$('points').innerHTML = "0";
                    } else {
                        //用户表主键id
                        _this.infoId = res.data[0].id;
                        //如果用户有数据但不全，注册时展示保存的数据
                        if (_this.registerSuc == 0) {
                            //判断年龄区间
                            if (res.data[0].ageRegion != null) {
                                switch (res.data[0].ageRegion) {
                                    case 0: 
                                        _this.ageMark = 1;
                                        break;
                                    case 4: 
                                        _this.ageMark = 2;
                                        break;
                                    case 7: 
                                        _this.ageMark = 3;
                                        break;
                                    case 13: 
                                        _this.ageMark = 4;
                                        break;
                                }
                            }
                            //初始化爱好
                            if (res.data[0].hobby == null || res.data[0].hobby.length < 1) {
                                _this.likeMarkArr = [];
                            } else if (res.data[0].hobby.length == 1) {
                                _this.likeMarkArr.push( parseInt(res.data[0].hobby) );
                            } else if (res.data[0].hobby.length > 2) {
                                _this.likeMarkArr = res.data[0].hobby.split(",");
                            }
                            //电话
                            if (res.data[0].phone != null) {
                                _this.userPhoneNum = res.data[0].phone;
                            }
                            //性别
                            if (res.data[0].sex != null) {
                                _this.babySex = res.data[0].sex;
                            }
                        } else if (_this.registerSuc == 1) {
                            _this.defaultFocus = "hands_x0_y0_alertOrder_";
                            if (_this.isOrder == 1) { //校验是否订购
                                _this.defaultFocus = "hands_x0_y0_toMission_";
                            } else {
                                _this.defaultFocus = "hands_x0_y0_alertOrder_";
                            }
                        }
                        _this.newRegister = 1;
                        _this.babyRname = res.data[0].nickName;
                        CT.$('babyName').innerHTML = _this.babyRname;
                        _this.babyIndex = Number(res.data[0].more1);
                        var avatarArr = basePageInfo.commonPageInfo.recommend_6;
                        CT.$('avatar').src = AjaxConfig.imgUrl + avatarArr[_this.babyIndex].recommendPic.picPath;
                        
                        // console.log(res);
                    }
                }
            );
        // },0)
    },

    /* 根据所传userId和activityId获取用户总积分 */
    getUserSumPoints: function () {
        var _this = this
        try {
            interface.getUserSumPoints({
                params:{
                    userId: xjDataLog.getUserId(),
                    activityId: 1 
                }
            }, function (res) {
                // CT.alertTip(res.data.sumPoints,{time:2000})
                CT.$("points").innerHTML = res.data.sumPoints;
            })
        } catch (error) {
            // CT.alertTip(error,{time:5000})
        }
    },

    //页面初始化调接口展示兑换产品数据
    showConvertInfo: function () {
        var _this = this;
        interface.getPrizeListByUserId(
            {params:{
                prizeType: 3,
                outId: 1,
                userId: xjDataLog.getUserId()
            }},
            function (res) {
                var photoIndex = null
                for (var i = 0; i < res.data.length; i++ ) {
                    if (Number(res.data[i].isExchange) > 0) {
                        CT.$('convertText' + i ).innerHTML = "已兑换";
                    }
                    // if (res.data[i].prizeName == "儿童摄影套餐") {
                    //     photoIndex = i;
                    // }
                    if (Number(res.data[i].prizeLeftNum) == 0) {
                        CT.$('convertText' + i ).innerHTML = "已兑完";
                        CT.$('convertingSpan' + i ).innerHTML = "兑换结束";
                    }
                    //是否为会员专属奖品
                    if (CT.$("vipMark" + i) && PAGE.getFocusModel6("hands_x0_y0_toConvert" + i + "_") && PAGE.getFocusModel6("hands_x0_y0_toConvert" + i + "_").TempData && PAGE.getFocusModel6("hands_x0_y0_toConvert" + i + "_").TempData.prizePicId == 2) {
                        CT.$("vipMark" + i).style.visibility = "visible";
                    }
                }
                // 摄影套餐是否领取
                // actiObj.getUserPrizeInfo(function (data) {
                //     if (data.successFlg == 1) {
                //         if (data && data.data[0] && data.data[0].prizeCname) {
                //             CT.$('convertText' + photoIndex).innerHTML = "已兑换";
                //         }
                //     }
                // });
            }
        );
    },
    
    //创建兑换奖品的dom
    creatConvertDom: function () {
        var _this = this;
        interface.getPrizeListByUserId(
            {params:{
                prizeType: 3,
                outId: 1,
                userId: xjDataLog.getUserId()
            }},
            function (res) {
                var startLeft = 79;
                var startTop = 15;
                var colNum = 3;
                var colStep = 390;
                var rowStep = 245;
                //创建dom个数
                var len = res.data.length || 6;
                var convertDom = "";
                for (var index = 0; index < len; index++) {
                    var left =  startLeft +  Math.ceil(index % colNum) * colStep;
                    var top = startTop +  Math.floor(index / colNum) * rowStep;
                    var position = "top:" + top + "px;left:" + left + "px;"

                    convertDom += "<div id='convert"+ index +"' class='position convert' style='" + position + ";background:url(" + AjaxConfig.imgUrl + recommend_10[3].recommendPic.picPath + ") no-repeat;'>"

                        + "<img class='position convertImg' src='" + AjaxConfig.imgUrl + res.data[index].more2 + "' alt=''>"
                        + "<img id='vipMark" + index + "' class='position' style='top:4px; left:4px;height:32px; visibility: hidden;' src='" + AjaxConfig.imgUrl + recommend_10[4].recommendPic.picPath + "' alt=''>"
                        + "<div id='converting" + index + "' class='position converting' style='background:url(" + AjaxConfig.imgUrl + recommend_1[8].recommendPic.picPath + ") no-repeat;'>"
                        + "<span id='convertingSpan" + index + "' class='convertingSpan'>正在抢兑中</span>"
                        + "<span id='convertPoints" + index + "' class='convertPoints'>" + res.data[index].prizePrice + "贝壳</span>"
                        + "</div>"

                        + "<div id='convertName" + index + "' class='position convertName' style=''>" + res.data[index].prizeName + "</div>"

                        + "<div id='hands_x0_y0_toConvert"+ index +"_' class='position toConvert' style='background:url(" + AjaxConfig.imgUrl + recommend_1[0].recommendPic.picPath + ") no-repeat;'>"

                        + "<div id='convertText"+ index +"'  class='position toConvert' style='left:0px;top:0px;'>去兑换</div>"

                        + "<img id='toConvert" + index + "' class='position convertFocus' style='visibility: hidden;' src='" + AjaxConfig.imgUrl + recommend_1[0].recommendLabelpic.picPath + "' alt=''>"
                        +  "</div>"

                        +  "</div>"

                    var convertButton = {
                        id: 'hands_x0_y0_toConvert'+ index +'_',
                        clickHandler: 'javascript:pointsMallObj.toConvert('+ index +')',
                        // left: 'hands_x0_y0_' + name + 'Focus' + (index  - 1) + '_',
                        // right: 'hands_x0_y0_' + name + 'Focus' + (index  + 1) + '_',
                        // up: 'hands_x0_y0_' + name + 'Focus' + (index  - colNum) + '_',
                        // down: 'hands_x0_y0_' + name + 'Focus' + (((index + colNum) <= len -1) ? (index + colNum):(len -1)  ) + '_',
                        otherFocusEvent: "javascript:pointsMallObj.runText("+ index +")",
                        otherBlurEvent: "javascript:pointsMallObj.stopText("+ index +")",
                        focusType: 7,
                        TempData: res.data[index],
                        enFocus : true,
                        enMove : true
                    }
                    convertButton.TempData.recommendTrackName = "prizeId" + res.data[index].id;
                    // if (res.data[index].prizeName == "良品铺子满减券" || res.data[index].prizeName == "咕比美术课" || res.data[index].prizeName == "凯叔讲故事故事包") {
                    //     convertButton.clickHandler = 'javascript:pointsMallObj.toConvert("QR")'
                    // }
                    if (res.data[index].prizePicId == 1) {
                        convertButton.clickHandler = 'javascript:pointsMallObj.toConvert("QR")'
                    }
                    if (res.data[index].prizePicId == 2) {
                        convertButton.clickHandler = 'javascript:pointsMallObj.toConvert("vip")'
                    }
                    buttons.push(convertButton);
                }
                CT.$("moveCovertDiv").innerHTML = convertDom;
                PAGE.focusInit();
                // console.log(res);
            }
        );
        
    },

    //去订购页
    toOrder: function () {
        orderJs.getAuth();
    },
    
    //去任务页
    toMission: function () {
        CT.goPage();
        CT.getAnterByIdOrAction({
            contentName: "jfsc-rwzc"
        });
    },
    
    //随机生成昵称
    randomName: function() {
        var _this = this;
        if (CT.$("registerAlert").style.display == "block") {
            var babyNickName = "";
            var babyIndex = Math.floor((Math.random() * _this.babyNameArr.length));
            _this.babyIndex = babyIndex;
            babyNickName = _this.babyNameArr[babyIndex];
            _this.babyRname = babyNickName;
            CT.$("babyName").innerHTML = babyNickName;
            CT.$("babyNameAlert").innerHTML = babyNickName;
            CT.$("avatar").src = AjaxConfig.imgUrl + _this.avatarArr[babyIndex].recommendPic.picPath;
        } else {
            PAGE.changeFocus("hands_x0_y0_toMission_");
        }
    },

    //焦点获焦字体变色
    numFocus: function (index) {
        var _this = this;
        for (var i = 1; i < 13; i++) {
            CT.$("focusNum" + i).className = 'setNum';
        }
        CT.$("focusNum" + index).className = 'numFocus';
    },

    //打开注册面板
    toRegister: function () {
        var _this = this;
        CT.$('registerAlert').style.display = "block";
        CT.$('mengban').style.visibility = "visible";
        CT.$('babyNameAlert').innerHTML = _this.babyRname;
        PAGE.changeFocus("hands_x0_y0_changeName_");
        if (_this.babySex != null) {
            _this.setSex(_this.babySex);
        }
        if (_this.userPhoneNum != null) {
            CT.$('phoneNumText').innerHTML = _this.userPhoneNum;
        }
        if (_this.likeMarkArr.length > 0) {
            _this.showHobbyMark();
        }
        _this.pageIndex = 1;
    },

    //打开键盘面板
    showKeyboard: function (info) {
        var _this = this;
        CT.$('showKeyboard').style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_num1_");
        if (info) {
            CT.$('showKeyboard').style.top = "229px";
            _this.pageIndex = 4;
        } else {
            CT.$('showKeyboard').style.top = "291px";
            _this.pageIndex = 2;
        }
    },

    //设置性别 0:男 1:女
    setSex: function(sex) {
        var _this = this;
        if (CT.$("registerAlert") && CT.$("registerAlert").style.display == "block") {
            if (sex == 0) {
                CT.$("boyMark").style.visibility = "hidden";
                CT.$("girlMark").style.visibility = "visible";
                CT.$('sexTips').style.visibility = "hidden";
                _this.babySex = 0;
            } else {
                CT.$("boyMark").style.visibility = "visible";
                CT.$("girlMark").style.visibility = "hidden";
                CT.$('sexTips').style.visibility = "hidden";
                _this.babySex = 1;         
            }
        } else {
            PAGE.changeFocus("hands_x0_y0_toMission_");
        }
    },

    //设置年龄
    toSetAge: function() {
        var _this = this;
        CT.$('ageTips').style.visibility = "hidden";
        var age = "age"
        _this.showKeyboard(age);
    },

    //隐藏年龄选中状态
    hiddenAgeMark: function() {
        var _this = this;
        for(var i = 1; i<= 4 ; i++ ){
            CT.$("ageMark" + i).style.visibility = "hidden";
            CT.$("ageFocus" + i).className = "setAge";
        }
    },

    //隐藏爱好选中状态
    hiddenHobbyMark: function() {
        var _this = this;
        for(var i = 1; i<= 8 ; i++ ){
            if (CT.$("likeMark" + i)) {
                CT.$("likeMark" + i).style.visibility = "hidden";
                CT.$("likeFocus" + i).className = "setAge";
            }
        }
    },

    //展示爱好选中状态
    showHobbyMark: function() {
        var _this = this;
        _this.likeMarkArr.forEach(function(num){
            CT.$("likeMark" + num).style.visibility = "visible";
            CT.$("likeFocus" + num).className = "focusText";
        })
    },

    //选择喜好
    setHobby: function(num) {
        var _this = this;
        if (CT.$("likeMark" + num) && CT.$("likeMark" + num).style.visibility == "hidden"){
            CT.$("likeMark" + num).style.visibility = "visible";
            CT.$("likeFocus" + num).className = "focusText";
            CT.$('hobbyTips').style.visibility = "hidden";
            _this.likeMarkArr.push(num);
        } else {
            CT.$("likeMark" + num).style.visibility = "hidden";
            CT.$("likeFocus" + num).className = "setAge";
            _this.likeMarkArr.pop();
        }
    },

    //键盘输入
    inputNum: function(key) {
        var _this = this;
        try {
            if (CT.$("registerAlert").style.display == 'block') {
                //输入手机号
                if (_this.pageIndex == 2) {
                    CT.$('phoneNumTips').style.visibility = "hidden";
                    if (CT.$('phoneNumText').innerText == "请用遥控器输入手机号码") {
                        CT.$('phoneNumText').innerHTML = "";
                    }
                    if ( key < 11 && CT.$("phoneNumText").innerHTML.length < 11) {
                        CT.$("phoneNumText").innerHTML += key;
                    } else if (key == '11') {
                        var numStr = CT.$("phoneNumText").innerHTML;
                        CT.$("phoneNumText").innerHTML = numStr.slice(0,numStr.length-1);
                    } else {
                        CT.$("showKeyboard").style.visibility = 'hidden';
                        PAGE.changeFocus("hands_x0_y0_setPhoneNum_");
                    }
                } else {
                    //输入年龄
                    CT.$('ageTips').style.visibility = "hidden";
                    if (CT.$('ageText').innerText == "请用遥控器输入年龄") {
                        CT.$('ageText').innerHTML = "";
                    }
                    if ( key < 11 && CT.$("ageText").innerHTML.length < 2) {
                        CT.$("ageText").innerHTML += key;
                    } else if (key == '11') {
                        var numStr = CT.$("ageText").innerHTML;
                        CT.$("ageText").innerHTML = numStr.slice(0,numStr.length-1);
                    } else {
                        CT.$("showKeyboard").style.visibility = 'hidden';
                        PAGE.changeFocus("hands_x0_y0_setAge_");
                        if (CT.$("ageText").innerHTML.substr(0,1) == "0" || parseInt(CT.$("ageText").innerHTML) > 18) {
                            CT.$('ageText').innerHTML = "请用遥控器输入年龄";
                            CT.$('ageTips').style.visibility = "visible";
                        }
                    }
                }
            }
        } catch (error) {
            // CT.alertTip(error,{time:10000});
        }
    },

    //上传爱好字符串封装的方法
    uploadLikeStr: function () {
        var _this = this;
        _this.likeMarkStr = "";
        for(var i = 1; i < 10; i++) {
            if (CT.$("likeMark" + i).style.visibility == "visible") {
                _this.likeMarkStr += ",";
                _this.likeMarkStr += i;
            }
        }
        if (_this.likeMarkStr.length != 0 && _this.likeMarkStr.indexOf(",") == 0) {
            _this.likeMarkStr = _this.likeMarkStr.substr(1);
        }
    },

    //上传年龄区间
    uploadAgeRegion: function () {
        var _this = this;
        if (parseInt(CT.$('ageText').innerText) != NaN) {
            _this.userAge = parseInt(CT.$('ageText').innerText);
            if (_this.userAge < 4) {
                _this.ageRegion = 0;
            } else if (_this.userAge < 7) {
                _this.ageRegion = 4;
            } else if (_this.userAge < 13) {
                _this.ageRegion = 7;
            } else if (_this.userAge < 18) {
                _this.ageRegion = 13;
            }    
        }
    },

    //去兑换页
    toConvert: function (index) {
        var _this = this;
        if (index == "QR") {
            var pageParam = {
                contentName: "creditsExchange",
                contentType: "page", 
                gameId: curFocus.TempData.id
            }
            CT.goPage();
            CT.getAnterByIdOrAction(pageParam); 
        } else if (index == "vip") {
            var authObj = {
                successCallback: function () {
                    var pageParam = {
                        contentName: "convertPage",
                        contentType: "page", 
                        gameId: curFocus.TempData.id
                    }
                    CT.goPage();
                    CT.getAnterByIdOrAction(pageParam); 
                },failCallback:function() {
                    orderJs.toOrderPage();
                }
            }
            orderJs.getAuth(authObj);
        }

    },

    //提交注册信息
    confirmInfo: function () {
        var _this = this;
        _this.uploadLikeStr();
        _this.uploadAgeRegion();
        //没填写信息就提示用户
        if (_this.babySex == null) {
            CT.$('sexTips').style.visibility = "visible";
        }
        if (_this.ageRegion == null) {
            _this.ageRegion = "0";
        }
        if (CT.$('phoneNumText').innerText == "" || CT.$('phoneNumText').innerText == "请用遥控器输入手机号码" || CT.$('phoneNumText').innerText.length < 11) {
            CT.$('phoneNumText').innerText = "请用遥控器输入手机号码";
            CT.$('phoneNumTips').style.visibility = "visible";
            _this.userPhoneNum = "";
        } else {
            _this.userPhoneNum = CT.$('phoneNumText').innerText;
        }
        if (CT.$('ageText').innerText == "" || CT.$('ageText').innerText == "请用遥控器输入年龄") {
            CT.$('ageText').innerText = "请用遥控器输入年龄";
            CT.$('ageTips').style.visibility = "visible";
            _this.userAge = "";
        } else {
            _this.userAge = CT.$('ageText').innerText;
        }
        if (_this.likeMarkArr.length == 0) {
            CT.$('hobbyTips').style.visibility = "visible";
        }
        //填写完整就调用注册接口
        if (_this.babySex != null && _this.userAge.length > 0 && _this.userPhoneNum.length == 11 && _this.likeMarkArr.length != 0){
            interface.pointsUpdateUserInfo(
                {params:{
                    nickName: _this.babyRname.toString(),
                    id: _this.infoId,
                    sex: _this.babySex,
                    age: _this.userAge,
                    ageRegion: _this.ageRegion,
                    phone: _this.userPhoneNum,
                    userid: xjDataLog.getUserId(),
                    hobby: _this.likeMarkStr,
                    more1: _this.babyIndex,
                }},
                function (res) {
                    if (res.errorCode == "1000" || res.errorMsg == "操作成功") {
                        _this.registerSuccess();
                    }
                    // console.log(res);
                }
            );
        }
    },

    //退出注册
    exitRegister: function () {
        var _this = this;
        if (CT.$('registerAlert').style.display == "block") {
            PAGE.changeFocus("hands_x0_y0_toMission_");
            CT.$('mengban').style.visibility = "hidden";
            CT.$('boyMark').style.visibility = "hidden";
            CT.$('girlMark').style.visibility = "hidden";
            CT.$('registerAlert').style.display = "none";
            _this.hiddenHobbyMark();
            // _this.hiddenAgeMark();
            _this.pageIndex = 0;
        }
    },

    //注册成功
    registerSuccess: function () {
        var _this = this;
        CT.$('hands_x0_y0_registerSuc_').style.visibility = "visible";
        PAGE.changeFocus('hands_x0_y0_registerSuc_');
        interface.insertPoints({
            params:{
                userid: xjDataLog.getUserId(),
                activityId: 1,
                prizeid: 2,
                taskid: 3,
                points: 30
            }
        },function(res){
            // console.log("insertPoints",res)
        });
        _this.registerSuc = 1;
        _this.pageIndex = 3;
    },

    //退出注册成功
    exitRegisterSuccess: function () {
        // setTimeout(function(){
            window.location.reload();
        // },500)
    },

    //添加跑马灯
    runText: function (index) {
        try {
            scroll("convert"+index,"moveCovertDiv");
            if (CT.$("convertName" + index) && CT.$("convertName" + index).innerHTML.length > 9 && curFocus.TempData && curFocus.TempData.prizeName) {
                CT.$("convertName" + index).innerHTML = CT.setMarquee(curFocus.TempData.prizeName, 15, 6);
            }
        } catch (error) {}
    },

    //去除跑马灯
    stopText: function (index) {
        // var showTitle = CT.$("convertName" + index).innerHTML;
        try {
            if (CT.$("convertName" + index) && curFocus.TempData && curFocus.TempData.prizeName) {
                CT.$("convertName" + index).innerHTML = curFocus.TempData.prizeName;
            }
        } catch (error) {
            
        }
    },

    //顶部获焦事件
    topFocus: function () {
        if (CT.$("moveCovertDiv")) {
            CT.$("moveCovertDiv").style.top = "-15px";
        }
    },

    //初始化默认焦点移到去任务页按钮上
    defaultDown: function () {
        if (CT.$("registerAlert").style.display == "none") {
            PAGE.changeFocus("hands_x0_y0_toMission_");
        } else {
            if (curFocus.FocusID == "hands_x0_y0_changeName_") {
                PAGE.changeFocus("hands_x0_y0_boy_");
            } else if (curFocus.FocusID == "hands_x0_y0_boy_") {
                PAGE.changeFocus("hands_x0_y0_setAge_");
            } else if (curFocus.FocusID == "hands_x0_y0_girl_") {
                PAGE.changeFocus("hands_x0_y0_setAge_");
            } else if (curFocus.FocusID == "hands_x0_y0_setAge_") {
                PAGE.changeFocus("hands_x0_y0_setPhoneNum_");
            } else if (curFocus.FocusID == "hands_x0_y0_setPhoneNum_") {
                PAGE.changeFocus("hands_x0_y0_like1_");
            }
        }
    },

    //初始化默认焦点移到去任务页按钮上
    defaultUp: function () {
        if (CT.$("registerAlert").style.display == "none") {
            PAGE.changeFocus("hands_x0_y0_toMission_");
        } else {
            if (curFocus.FocusID == "hands_x0_y0_changeName_") {
                return;
            } else if (curFocus.FocusID == "hands_x0_y0_boy_") {
                PAGE.changeFocus("hands_x0_y0_changeName_");
            } else if (curFocus.FocusID == "hands_x0_y0_girl_") {
                PAGE.changeFocus("hands_x0_y0_changeName_");
            } else if (curFocus.FocusID == "hands_x0_y0_setAge_") {
                PAGE.changeFocus("hands_x0_y0_boy_");
            } else if (curFocus.FocusID == "hands_x0_y0_setPhoneNum_") {
                PAGE.changeFocus("hands_x0_y0_setAge_");
            }
        }
    },

	//初始化默认焦点移到去任务页按钮上
    defaultLeft: function () {
        if (CT.$("registerAlert").style.display == "none") {
            PAGE.changeFocus("hands_x0_y0_toMission_");
        } else {
            if (curFocus.FocusID == "hands_x0_y0_changeName_") {
                return;
            } else if (curFocus.FocusID == "hands_x0_y0_boy_") {
                return;
            } else if (curFocus.FocusID == "hands_x0_y0_girl_") {
                PAGE.changeFocus("hands_x0_y0_boy_");
            } else if (curFocus.FocusID == "hands_x0_y0_setAge_") {
                return;
            } else if (curFocus.FocusID == "hands_x0_y0_setPhoneNum_") {
                return;
            }
        }
    },
	
    //弹窗订购增加60积分
    alertToOrder: function() {
        var _this = this;
        if (_this.orderMark == 0) {
            CT.setCookie("pointsOrder","true");
            // orderJs.toPay(); 
            orderJs.getAuth({});
        } else {
            _this.closeAlert();
        }
    },

    //显示弹窗订购挽留
    alertBackEvent: function() {
        var _this = this;
        CT.$("orderBack").style.display = "block"
        PAGE.getModelByFocusId("hands_x0_y0_alertOrder_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_orderCancel_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_backOrder_").enFocus = true;
        PAGE.getModelByFocusId("hands_x0_y0_alertBack_").enFocus = true;
        PAGE.changeFocus("hands_x0_y0_backOrder_");
        CT.$("orderCancel").style.visibility = "hidden";
        CT.$("alertOrder").style.visibility = "hidden";
        _this.pageIndex = 6;
    },

    //挽留弹窗返回订购弹窗
    backToAlert: function() {
        var _this = this;
        PAGE.getModelByFocusId("hands_x0_y0_backOrder_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_alertBack_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_alertOrder_").enFocus = true;
        PAGE.getModelByFocusId("hands_x0_y0_orderCancel_").enFocus = true;
        PAGE.changeFocus("hands_x0_y0_alertOrder_");
        CT.$("orderBack").style.display = "none";
        _this.pageIndex = 5;
    },

    //完全关闭弹窗
    closeAlert: function() {
        var _this = this;
        PAGE.getModelByFocusId("hands_x0_y0_backOrder_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_alertBack_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_alertOrder_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_orderCancel_").enFocus = false;
        PAGE.changeFocus("hands_x0_y0_toMission_");
        CT.$("orderBack").style.display = "none";
        CT.$("orderAlert").style.display = "none";
        CT.$("mengban").style.visibility = "hidden";
        _this.pageIndex = 0;
    },

    //按钮事件注册
    buttonsPush: function (){
        var _this = this;
        buttons.push({
            id: "hands_x0_y0_changeName_",
            clickHandler: "javascript:pointsMallObj.randomName()",
            upEvent: "javascript:pointsMallObj.defaultUp()",
            leftEvent: "javascript:pointsMallObj.defaultLeft()",
            right: "disable",
            downEvent: "javascript:pointsMallObj.defaultDown()",
            focusType: 7
        }, {
            id: "hands_x0_y0_boy_",
            clickHandler: "javascript:pointsMallObj.setSex(1)",
            upEvent: "javascript:pointsMallObj.defaultUp()",
            leftEvent: "javascript:pointsMallObj.defaultLeft()",
            right: "hands_x0_y0_girl_",
            downEvent: "javascript:pointsMallObj.defaultDown()",
            focusType: 7
        }, {
            id: "hands_x0_y0_girl_",
            clickHandler: "javascript:pointsMallObj.setSex(0)",
            upEvent: "javascript:pointsMallObj.defaultUp()",
            leftEvent: "javascript:pointsMallObj.defaultLeft()",
            right: "disable",
            downEvent: "javascript:pointsMallObj.defaultDown()",
            focusType: 7
        }, {
            id: "hands_x0_y0_setPhoneNum_",
            clickHandler: "javascript:pointsMallObj.showKeyboard()",
            upEvent: "javascript:pointsMallObj.defaultUp()",
            leftEvent: "javascript:pointsMallObj.defaultLeft()",
            right: "disable",
            downEvent: "javascript:pointsMallObj.defaultDown()",
            focusType: 7
        }, {
            id: "hands_x0_y0_confirm_",
            clickHandler: "javascript:pointsMallObj.confirmInfo()",
            up: "hands_x0_y0_like7_",
            left: "disable",
            right: "hands_x0_y0_back_",
            down: "disable",
            focusType: 7
        }, {
            id: "hands_x0_y0_back_",
            clickHandler: "javascript:pointsMallObj.exitRegister()",
            up: "hands_x0_y0_like7_",
            left: "hands_x0_y0_confirm_",
            right: "disable",
            down: "disable",
            focusType: 7
        }, {
            id: "hands_x0_y0_registerSuc_",
            clickHandler: "javascript:pointsMallObj.exitRegisterSuccess()",
            up: "disable",
            left: "disable",
            right: "disable",
            down: "disable",
            focusType: 7
        }, {
            id: "hands_x0_y0_toOrder_",
            clickHandler: "javascript:pointsMallObj.toOrder()",
            otherFocusEvent: "javascript:pointsMallObj.topFocus()",
            up: "disable",
            // right: "hands_x0_y0_toMission_",
            // down: "hands_x0_y0_toConvert3_",
            TempData: recommend_1[2],
            focusType: 7
        }, {
            id: "hands_x0_y0_toMission_",
            clickHandler: "javascript:pointsMallObj.toMission()",
            otherFocusEvent: "javascript:pointsMallObj.topFocus()",
            up: "disable",
            // left: "hands_x0_y0_toOrder_",
            right: "disable",
            // down: "hands_x0_y0_toConvert3_",
            focusType: 7
        }, {
            id: 'hands_x0_y0_setAge_',
            clickHandler: 'javascript:pointsMallObj.toSetAge()',
            right: 'disable',
            leftEvent: "javascript:pointsMallObj.defaultLeft()",
            upEvent: 'javascript:pointsMallObj.defaultUp()',
            downEvent: 'javascript:pointsMallObj.defaultDown()',
            focusType: 7,
        }, {
            id: "hands_x0_y0_alertOrder_",
            clickHandler: "javascript:pointsMallObj.alertToOrder()",
            up: "hands_x0_y0_orderCancel_",
            right: "hands_x0_y0_orderCancel_",
            enFocus : "false",
            focusType: 7
        }, {
            id: "hands_x0_y0_orderCancel_",
            clickHandler: "javascript:pointsMallObj.alertBackEvent()",
            left: "hands_x0_y0_alertOrder_",
            down: "hands_x0_y0_alertOrder_",
            enFocus : "false",
            focusType: 7
        }, {
            id: "hands_x0_y0_alertBack_",
            clickHandler: "javascript:pointsMallObj.closeAlert()",
            right: "hands_x0_y0_backOrder_",
            enFocus : "false",
            focusType: 7
        }, {
            id: "hands_x0_y0_backOrder_",
            clickHandler: "javascript:pointsMallObj.backToAlert()",
            left: "hands_x0_y0_alertBack_",
            enFocus : "false",
            focusType: 7
        });

        // for (var i = 1; i < 5; i++) {
        //     var ageButtons = {
        //         id: 'hands_x0_y0_age' + i + '_',
        //         clickHandler: 'javascript:pointsMallObj.toSetAge(' + i + ')',
        //         right: 'hands_x0_y0_age' + (i + 1) + '_',
        //         left: 'hands_x0_y0_age' + (i - 1) + '_',
        //         upEvent: 'javascript:pointsMallObj.defaultUp()',
        //         downEvent: 'javascript:pointsMallObj.defaultDown()',
        //         focusType: 7,
        //     };
        //     buttons.push(ageButtons);
        // }
        for (var i = 1; i < 10; i++) {
            var likeButtons = {
                id: 'hands_x0_y0_like' + i + '_',
                clickHandler: 'javascript:pointsMallObj.setHobby(' + i + ')',
                right: 'hands_x0_y0_like' + (i + 1) + '_',
                left: 'hands_x0_y0_like' + (i - 1) + '_',
                up: 'hands_x0_y0_like' + (i - 3) + '_',
                down: 'hands_x0_y0_like' + (i + 3) + '_',
                focusType: 7,
            };
            if (i == 1 || i == 2 || i == 3) {
                likeButtons.up = "hands_x0_y0_setPhoneNum_";
            }
            if (i == 7 || i == 8 || i == 9 ) {
                likeButtons.down = "hands_x0_y0_confirm_";
            }
            buttons.push(likeButtons);
        }
        for (var i = 1; i < 13; i++) {
            var numButtons = {
                id: 'hands_x0_y0_num' + i + '_',
                clickHandler: 'javascript:pointsMallObj.inputNum(' + i + ')',
                right: 'hands_x0_y0_num' + (i + 1) + '_',
                left: 'hands_x0_y0_num' + (i - 1) + '_',
                up: 'hands_x0_y0_num' + (i - 4) + '_',
                down: 'hands_x0_y0_num' + (i + 4) + '_',
                otherFocusEvent: 'javascript:pointsMallObj.numFocus(' + i + ')',
                focusType: 7,
            };
            if ( i == 10 ) {
                numButtons.clickHandler = 'javascript:pointsMallObj.inputNum(0)';
            }
            buttons.push(numButtons);
        }
    },




    
}
    //自动焦点
	/**
    * 获取int值
    * @param {string} val 原值
    * @param {int} def 如果转换失败的默认值
    */
    var getInt = function (val, def) {
        var _this = this;
        try {
            var res = parseInt(val);
            if (isNaN(res)) {
                if (def) {
                    return _this.getInt(def);
                }
            } else {
                return res;
            }
        } catch (e) {

        }
        return 0;
    }

    /**
      * 获取元素使用的样式值
      * @param {*} obj 元素id或元素本身
      * @param {*} attr 样式
      */
    var getStyle = function (obj, attr) {
        if (typeof (obj) === 'string') {
            obj = CT.$(obj)
        }
        if (!obj) return "";
        if (obj.currentStyle) {
        //    obj.currentStyle[attr];
            return obj.currentStyle[attr];
        } else if (window.getComputedStyle) {
           //非IE，
            return window.getComputedStyle(obj, null)[attr];
        } else {
            return obj.style[attr];
        }
    }
    //计算当前元素在父级元素的位置
    function getPositionFunc(ele, parent){
        if(typeof(ele) === 'string') { ele = CT.$(ele) }
        if(typeof(parent) === 'string') { ele = CT.$(parent) }
        if(!ele) return null;
        var result = {
            top: 0,
            left:0,
            width: getInt(getStyle(ele ,"width"),2),
            height: getInt(getStyle(ele ,"height"),2),
        }
        while(ele && (ele != parent || (parent.id && parent.id != ele.id)) && ele.parentNode.tagName != "body") {
            if(getStyle(ele,"visibility") == 'hidden' || getStyle(ele,'display') == 'none') return null;
            if(getStyle(ele ,"position") == "absolute") {
                result.top += getInt(getStyle(ele ,"top"),0);
                result.left += getInt(getStyle(ele ,"left"),0);
            }
            ele = ele.parentNode;
        }
        return result;
    }
    
    function scroll(curEle,contains){
        //var curEle,containsId;
        // if(param && param.curEle){ 
        //     curEle = param.curEle;
        // } else {
        //     curEle = arguments[arguments.length - 1];
        // }

        //if(param && param.containsId) containsId = param.containsId;
        if(typeof(curEle) === "string") curEle = CT.$(curEle);
        if(typeof(contains) === "string") contains = CT.$(contains);
        if(!curEle) return;
       // var contains = containsId? PAGE.getEle(containsId) : curEle.parentNode;
        
        var windows = contains.parentNode;
        var poEle = getPositionFunc(curEle,contains);
        var poCon = getPositionFunc(contains,windows);
        var poWin = getPositionFunc(windows,windows);

        if(poEle.left + poEle.width > poWin.width - poCon.left) {
            contains.style.left = poWin.width - poEle.left - poEle.width;

        } else if(poEle.left < 0 - poCon.left) {
            contains.style.left = 0 - poEle.left
        }
        if(poEle.top + poEle.height > poWin.height - poCon.top) {
            contains.style.top = parseInt(poWin.height - poEle.top - (poEle.height * 9  / 8) ) + "px";

        } else if(poEle.top < 0 - poCon.top) {
            contains.style.top = 0 - poEle.top + "px";
        }
    }

    var findNextFocusNode = function(action,parent,curEle,children,state){
        if(!curEle) curEle = CT.$(curFocus.FocusID);
        if(!curEle) return;
        if(curEle.tagName.toUpperCase() != 'DIV') return;
        if(!parent) parent = curEle.parentNode;
        if(!children) children = parent.children;

        var nearby = { ele: null, value: [] };

        var curPosition = getPositionFunc(curEle,parent);
        curPosition.right = curPosition.left + curPosition.width;
        curPosition.bottom = curPosition.top + curPosition.height;

        for(var i = 0 ;i < children.length; i++) {
            var _nextEle = children[i];
            if(_nextEle == curEle || (_nextEle.id && _nextEle.id == curEle.id)) {
                continue;
            }
            var nextCurpostion = getPositionFunc(_nextEle,parent);
            if(!nextCurpostion) {
                continue;
            }
            try{
                nextCurpostion.right = nextCurpostion.left + nextCurpostion.width;
                nextCurpostion.bottom = nextCurpostion.top + nextCurpostion.height;
            } catch(e) {
                // console.log(_nextEle,parent,nextCurpostion);
                debugger 
            }
            var resPosition = actionFunc(curPosition,nextCurpostion,action);
            if(!nextCurpostion || !resPosition) {
                continue;
            }
            //如果当前不是焦点,找子节点
            var _nextby = {};
            if(!_nextEle.id || !PAGE.focusArr[_nextEle.id]) {
                if(_nextEle.children.length > 0) {
                    _nextby = findNextFocusNode(action,parent,curEle,_nextEle.children,"toChildren");
                }
                if(_nextby && _nextby.ele) {
                    _nextEle = _nextby.ele;
                    resPosition = _nextby.value;
                } else {
                    resPosition = [];
                }
            }

            for(var j = 0 ;j < resPosition.length;j++) {
                if(nearby.value.length < j || nearby.value[j] > resPosition[j]) {
                    nearby = { ele: _nextEle, value: resPosition };
                    break;
                } else if(nearby.value[j]  < resPosition[j]){
                    break;
                }
            }
        }
        if((!nearby || !nearby.ele) && !state && curEle.parentNode.parentNode) {	//本层没有.向父级找
            nearby = findNextFocusNode(action,curEle.parentNode.parentNode,curEle.parentNode,curEle.parentNode.parentNode.children);
        }
        return nearby;
    }
    /**
       * 重写PAGE.ProximityPrinciple
       * 
       */

    PAGE.ProximityPrinciple = function(action){
        if(window["keyLock"]) return;
        window["keyLock"] = true;
        // 给当前焦点重新赋值
        // if(!PAGE.focusArr || PAGE.focusArr.length == 0) return;
        var nearBy = findNextFocusNode(action)
        try {
            if(nearBy && nearBy.ele) {
                curFocus.defaultBlur();
                curFocus = nearBy.ele.focusmodel;
                var fid = curFocus.FocusID;
                curFocus.lastFocusId = fid;
                curFocus.defaultFocus();
            }
        } catch (error) {}
        clearTimeout(window["keyLock_time"]);
        window["keyLock_time"] = setTimeout(function(){
            window["keyLock"] = false;
        },100);
    }
    
    var actionFunc = function(curEle,nextEle,action) {
        var number1 ;
        var number2 ;
        var number3 ;
        var number4 ;
        var number5 ;
        var number6 ;
        switch (action) {
            case "left":
                number1 = curEle.left,
                number2 = nextEle.right,
                number3 = curEle.top,
                number4 = curEle.bottom,
                number5 = nextEle.top, 
                number6 = nextEle.bottom;
                break
            case "right":
                number1 = nextEle.left,
                number2 = curEle.right,
                number3 = curEle.top,
                number4 = curEle.bottom,
                number5 = nextEle.top, 
                number6 = nextEle.bottom;
                break;
            case "up":
                number1 = curEle.top,
                number2 = nextEle.bottom,
                number3 = curEle.left,
                number4 = curEle.right,
                number5 = nextEle.left, 
                number6 = nextEle.right;
                break;
            case "down":
                number1 = nextEle.top,
                number2 = curEle.bottom,
                number3 = curEle.left,
                number4 = curEle.right,
                number5 = nextEle.left, 
                number6 = nextEle.right;
                break;
        }
        if(number1 >= number2) {
            /**
             * 自动焦点算法: 优先取两最近线的距离(线与线的距离),再取两线之间重合距离,最后取两线之间中心点距离.
             */
            var res3 = (number1 - number2) * (number1 - number2) + (number3 + number4 - number5 - number6) * (number3 + number4 - number5 - number6) / 4;
            var res2 =  Math.max(number3,number5) - Math.min(number4,number6);
            var _min_des = res2 <= 0 ? 0 : res2;
            var res1 =   (number1 - number2) * (number1 - number2)   + _min_des * _min_des;
            return [res1,res2,res3];
        }
        return null; 
    }

addEvent.on("pageEvent",function(e){
    pointsMallObj.init();
})

//返回
function backFunc() {
    switch (pointsMallObj.pageIndex) {
        case 0: //首页返回
            CT.getAnterByIdOrAction({
                contentId: "31"
            });
            break;
        case 1: //打开注册弹窗返回
            pointsMallObj.hiddenHobbyMark();
            // pointsMallObj.hiddenAgeMark();
            PAGE.changeFocus("hands_x0_y0_toMission_");
            CT.$('registerAlert').style.display = "none";
            CT.$('mengban').style.visibility = "hidden";
            CT.$('boyMark').style.visibility = "hidden";
            CT.$('girlMark').style.visibility = "hidden";
            pointsMallObj.pageIndex = 0;
            break;
        case 2: //打开数字键盘返回
            if (CT.$('phoneNumText').innerText == "") {
                CT.$('phoneNumText').innerText = "请用遥控器输入手机号码";
            }
            CT.$('showKeyboard').style.visibility = "hidden";
            PAGE.changeFocus("hands_x0_y0_setPhoneNum_");
            pointsMallObj.pageIndex = 1;
            break;
        case 3: //注册成功弹窗返回
            pointsMallObj.pageIndex = 0;
            break;
        case 4: //设置年龄弹窗返回
            if (CT.$('ageText').innerText == "") {
                CT.$('ageText').innerText = "请用遥控器输入年龄";
            }
            CT.$('showKeyboard').style.visibility = "hidden";
            PAGE.changeFocus("hands_x0_y0_setAge_");
            if (CT.$("ageText").innerHTML.substr(0,1) == "0" || parseInt(CT.$("ageText").innerHTML) > 18) {
                CT.$('ageText').innerHTML = "请用遥控器输入年龄";
                CT.$('ageTips').style.visibility = "visible";
            }
            pointsMallObj.pageIndex = 1;
            break;
        case 5: //订购弹窗返回挽留
            if (pointsMallObj.orderMark == 1) {
                pointsMallObj.closeAlert();
                pointsMallObj.pageIndex = 0;
            } else {
                pointsMallObj.alertBackEvent();
                pointsMallObj.pageIndex = 6;
            }
            break;
        case 6: //挽留弹窗关闭
            pointsMallObj.closeAlert();
            pointsMallObj.pageIndex = 0;
            break;
    }
}

// 遥控器输入数字
changeNumObj.changeNum = function (num) {
    if (pointsMallObj.pageIndex == 2) {
        if (CT.$('phoneNumText').innerText == "请用遥控器输入手机号码") {
            CT.$('phoneNumText').innerText = "";
        }
        var phoneNum = "";
        var size = phoneNum.length;
        if (!size && CT.$("phoneNumText").innerText.length < 11) {
            phoneNum += num;
            CT.$("phoneNumText").innerHTML += phoneNum;
        }
    }
    if (pointsMallObj.pageIndex == 4) {
        if (CT.$('ageText').innerText == "请用遥控器输入手机号码") {
            CT.$('ageText').innerText = "";
        }
        var ageNum = "";
        var size = ageNum.length;
        if (!size && CT.$("ageText").innerText.length < 2) {
            ageNum += num;
            CT.$("ageText").innerHTML += ageNum;
        }
    }
}