//仅限南京用户：
//未订购用户：
//每天一次抽奖机会，抽中奖品弹出弹窗去跳转订购/再次点击抽奖按钮跳转订购页，订购成功返回抽奖页面
//抽奖页面判断当前用户》》》已订购且拥有奖品且有订购成功页返回信息》》》弹出填写联系方式弹窗(订购成功页需加上订购成功页返回标识，返回活动之后删除标识 )、增加三次抽奖机会
//订购用户：
//每天三次抽奖机会，抽中》》》填写联系方式弹窗；未抽中；次数用完；奖品抽完;
var getUserTimeurl = AjaxConfig.origin + "/js_orderTime/logOrderTab/orderTime";//江苏有线
var createtime;
/*获取用户会员订购时间*/
function getUserTime(fn) {
    actiObj.getAjaxResult({
        requestUrl: getUserTimeurl,
        params: {
            userId: actiUserId
        },
        success: function (data) {
            fn && fn(data);
        },
        fail: function () {
            fn && fn(false);
        }
    });
}
getUserTime(function (data) {
    createtime = new Date(data.CREATE_DATE).getTime();
});
function xuanwuLake() {
    this.isOrder = 1;//是否订购
    this.chanceNum;//已经使用抽奖机会
    this.userPhone;//手机号
    this.orderSucBackInfo;//订购成功页返回信息
    this.initFocusId;//默认焦点
    this.nowDate;//当前日期
    this.getUserData;//获取到的日期
    this.isTry = false;//今日是否试玩，默认未试玩
    this.prizeList = null; //奖品列表
    this.getPrizeList = [];//当前用户的中奖列表
    this.limitPrizeFive = false;//限定只能五等奖，默认不限定
    this.prizeId = null; //获奖Id
    this.isPrize = false; //用户获奖信息
    this.isRing = false; //转盘是否在旋转中
    this.ringImg = document.getElementById("hands_x0_y0_startBtnFocus_"); //旋转光标
    this.littleTips = document.getElementById("littleTips"); //旋转提示
    this.ringInterval = null; //旋转定时器
    this.ringTime = 200; //定时器执行时间
    this.ringNum = 0; //已旋转圈数
    this.ringFlag = 0; //旋转抽奖标志
    this.targetRing = 0; //最终旋转圈数
    this.targetPrize = 0; //最终停止奖品格
    this.prizeArr = [0, 7, 2, 4, 5]; //奖品下标数组
    this.noPrizeArr = [1, 3, 6]; //无奖品下标数组
    this.prizeIndex; //接口获取奖品下标
    this.ringArr = [
        [210, 580],
        [210, 750],
        [210, 930],
        [340, 930],
        [475, 930],
        [475, 750],
        [475, 580],
        [345, 580]
    ];
    this.isShowTip = false;//弹窗是否显示，默认不显示
	this.priceName;//当前未订购用户获得的奖品
    this.initFunc();

}
xuanwuLake.prototype = {
    constructor: xuanwuLake,
    initFunc: function () {
        var _this = this;
        this.nowDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当天日期	
        orderJs.columnGetAuth(function (data) {
            if (data == "0") {
                _this.isOrder = 0;
            } else {
                _this.isOrder = 1;
            }
			//_this.isOrder=0;
            //未订购用户判断当天有没有试玩机会
            if (_this.isOrder == 0) {
                //获取抽奖机会
                _this.getChanceFunc();
            } else {
                _this.isTryPlay();
            }
            //获取当前用户的手机号信息
            _this.getUserInfo();
            // 获取活动奖品列表
            _this.getPrizeListFunc();
        });
    },
    isTryPlay: function () {
        var _this = this;
        actiObj.getUserDataList(function (res) {
            if (res.successFlg == "1") {
                _this.getUserData = res.data.userActiData;
                if (_this.nowDate != _this.getUserData) {
                    _this.isTry = false;//今日未试玩
                    CT.$("lotteryNum").innerHTML = 1;
                } else {
                    _this.isTry = true;
                    CT.$("lotteryNum").innerHTML = 0;
                }
            } else {
                _this.isTry = false;
                CT.$("lotteryNum").innerHTML = 1;
            }
        });
    },
    /*
	 *获取用户今日已使用机会
	 */
    getChanceFunc: function () {
        var _this = this;
        actiObj.getChance(function (data) {
            _this.chanceNum = data.data.activityChance;
            CT.$("lotteryNum").innerHTML = 3 - _this.chanceNum;
        });
    },
    /*
    *获取当前用户的手机号信息
    */
    getUserInfo: function () {
        var _this = this;
        actiObj.getUserPhone(function (userInfoData) {
            if (userInfoData.successFlg == 1) {
                _this.userPhone = userInfoData.data.userPhone;
                if (_this.userPhone) {
                    CT.$("telInput").innerHTML = _this.userPhone;
                }
            }
        });
    },
    getPrizeListFunc: function () {
        var _this = this;
        actiObj.getActivityPrize(function (prizeData) {
            if (prizeData.successFlg == 1) {
                if (_this.isOrder == 0) {
                    _this.prizeList = prizeData.data.records.slice(0, 5);
                } else {
                    _this.prizeList = prizeData.data.records.slice(5, 10);
                }
            } else {
                _this.prizeList = [];
            }
        });
        //获取当前用户获奖信息,判断当前用户是否中过奖
        actiObj.getUserPrizeInfo(function (userPrizeData) {
            if (userPrizeData.successFlg == 1) {
                _this.isPrize = true;
                _this.getPrizeList = userPrizeData.data;
				userPrizeData.data[0].prizeCname.substring(0,length-5);
				_this.priceName = userPrizeData.data[0].prizeCname.substring(0,userPrizeData.data[0].prizeCname.length-5);//未订购时中的奖
                //若当前用户中过一、二、三、四等奖，则限定只能中五等奖：电影院线点播
                for (var i = 0; i < _this.getPrizeList.length; i++) {
                    if (_this.getPrizeList[i].prizePrice == "1" || _this.getPrizeList[i].prizePrice == "2" || _this.getPrizeList[i].prizePrice == "3" || _this.getPrizeList[i].prizePrice == "4") {
                        _this.limitPrizeFive = true; //限定只能中五等奖
                    }
                }
            } else {
                _this.isPrize = false;
            }
            //判断是否有订购成功页返回信息>>>如果订购成功&&当前用户有奖品&&有订购成功返回就出现订购成功弹窗，填写手机号
            _this.orderSucBackInfo = CT.getCookie("orderSucBack");
            if (_this.isOrder == 0 && _this.orderSucBackInfo && _this.isPrize) {
				CT.delCookie("orderSucBack");
                _this.tanchuangShow(6);
                _this.initFocusId = "hands_x0_y0_inputFocus_";
            } else if (CT.getCookie("xuanwuBackFocusId")) {
                _this.initFocusId = CT.getCookie("xuanwuBackFocusId");
                CT.delCookie("xuanwuBackFocusId");
            } else {
                _this.initFocusId = "hands_x0_y0_startBtnFocus_";
            }
            // 焦点初始化
            PAGE.focusInit();
            PAGE.changeFocus(_this.initFocusId);
        });
    },
    startLottery: function () {
        var _this = this;
        //已订购用户上传已用机会
        if (this.isOrder == 0) {            
            if (this.chanceNum < 3) {
                this.chanceNum++;
                CT.$("lotteryNum").innerHTML = 3 - this.chanceNum;
                actiObj.setChance(function (res) {
                    if (res.successFlg == "1") {
                        //转盘正在旋转
                        _this.isRing = true;
                        //概率计算
                        _this.probabilityFunc();
                        //转盘开始旋转
                        _this.toRing();
                    }
                });
            } else {
                //今日抽奖机会用完
                this.tanchuangShow(4);
            }
        } else {
            if (!this.isTry) {
                //存入试玩数据
                actiObj.setUserDataList(this.nowDate);
                this.isTry = true;//已经试玩
                CT.$("lotteryNum").innerHTML = 0;
                //转盘正在旋转
                _this.isRing = true;
                //概率计算
                _this.probabilityFunc();
                //转盘开始旋转
                _this.toRing();
            } else {//试玩过跳转订购>>>提示跳订购弹窗
                this.tanchuangShow(2);
            }
        }
    },
    /*
	 * 概率计算
	 */
    probabilityFunc: function () {
        this.targetRing = Math.ceil(Math.random() * 3) + 3; //[4,6]随机数
        var userNum = Math.ceil(Math.random() * 100); //[1,100]随机数
        var probabilityArr = [];
        var lefttTme =  1601395200000;//开始时间毫秒 lefttTme < createtime < rightTime,9月30
        var rightTime = 1602259200000;//结束时间毫秒 10月9号
        if (this.isOrder == 0) {
            if(createtime>=lefttTme && createtime<=rightTime){//活动期间内订购
                probabilityArr = [5, 5, 5, 10, 10];
            }else{
                userNum=1000;
            }           
        } else {
            probabilityArr = [5, 5, 5, 45, 40];
        }
        if (userNum <= probabilityArr[0] && this.prizeList && this.prizeList[4].prizeRemainNum > 0 && !this.limitPrizeFive) {
            this.prizeId = this.prizeList[4].id;
            this.targetPrize = 0;
            this.prizeIndex = 4;
			this.priceName = this.prizeList[4].prizeCname.substring(0,this.prizeList[4].prizeCname.length-5);//未订购时中的奖
        } else if (userNum <= probabilityArr[1] + probabilityArr[0] && this.prizeList && this.prizeList[3].prizeRemainNum > 0 && !this.limitPrizeFive) {
            this.prizeId = this.prizeList[3].id;
            this.targetPrize = 7;
            this.prizeIndex = 3;
			this.priceName = this.prizeList[3].prizeCname.substring(0,this.prizeList[3].prizeCname.length-5);//未订购时中的奖
        } else if (userNum <= probabilityArr[2] + probabilityArr[1] + probabilityArr[0] && this.prizeList && this.prizeList[2].prizeRemainNum > 0 && !this.limitPrizeFive) {
            this.prizeId = this.prizeList[2].id;
            this.targetPrize = 2;
            this.prizeIndex = 2;
			this.priceName = this.prizeList[2].prizeCname.substring(0,this.prizeList[2].prizeCname.length-5);//未订购时中的奖
        } else if (userNum <= probabilityArr[3] + probabilityArr[2] + probabilityArr[1] + probabilityArr[0] && this.prizeList && this.prizeList[1].prizeRemainNum > 0 && !this.limitPrizeFive) {
            this.prizeId = this.prizeList[1].id;
            this.targetPrize = 4;
            this.prizeIndex = 1;
			this.priceName = this.prizeList[1].prizeCname.substring(0,this.prizeList[1].prizeCname.length-5);//未订购时中的奖
        } else if (userNum <= probabilityArr[4] + probabilityArr[3] + probabilityArr[2] + probabilityArr[1] + probabilityArr[0] && this.prizeList && this.prizeList[0].prizeRemainNum > 0) {
            this.prizeId = this.prizeList[0].id;
            this.targetPrize = 5;
            this.prizeIndex = 0;
			this.priceName = this.prizeList[0].prizeCname.substring(0,this.prizeList[0].prizeCname.length-5);//未订购时中的奖
        } else {
            this.targetPrize = this.noPrizeArr[Math.floor(Math.random() * 3)];
        }
    },
    /*
	 * 转盘开始旋转
	 */
    toRing: function () {
        var _this = this;
        this.ringTime = 180;
        clearInterval(this.ringInterval);
        PAGE.changeFocus("hands_x0_y0_startBtnFocus_");
        this.ringInterval = setInterval(function () {
            _this.ringImg.style.top = _this.ringArr[_this.ringFlag % 8][0] + "px";
            _this.ringImg.style.left = _this.ringArr[_this.ringFlag % 8][1] + "px";
            //转一圈
            if (_this.ringFlag !== 0 && _this.ringFlag % 8 === 0) {
                _this.ringNum += 1;
            }
            //已转圈数达到目标圈数且距离目标奖品格小于三格时，降低旋转速度
            if (_this.ringNum >= _this.targetRing && Math.abs(_this.targetPrize - _this.ringFlag % 8) < 3) {
                _this.ringTime = 400;
            }
            //已转圈数达到目标圈数且光标到达目标奖品格时停止转动
            if (_this.targetRing === _this.ringNum && _this.ringFlag % 8 === _this.targetPrize) {
                clearInterval(_this.ringInterval);
                _this.ringFlag = 0;
                _this.ringNum = 0;
                _this.stopRing(); //停止转动
            } else {
                _this.ringFlag++;
            }
        }, this.ringTime);
    },
    stopRing: function () {
        var _this = this;
        this.isRing = false;
        if (this.prizeArr.indexOf(this.targetPrize) > -1) {
            //判断奖品剩余
            if (this.prizeList[this.prizeIndex].prizeRemainNum > 0) {
                actiObj.setPrize(this.prizeId, function () {
                    setTimeout(function () {
                        _this.showGetPrize(_this.targetPrize);
                    }, 1000);
                });
            } else {
                //奖品抽完
                this.tanchuangShow(5);
            }
        } else {
            setTimeout(function () {
                _this.showNoPrize();
            }, 1000);
        }
    },
    /*
	 * 获奖
	 */
    showGetPrize: function (targetPrize) {
        this.isprize = true;
        if (targetPrize == 0 || targetPrize == 7 || targetPrize == 2 || targetPrize == 4 || targetPrize == 5) {
            // 未订购用户中奖弹出跳订购提示弹窗,订购用户弹出中奖提示弹窗
            if (this.isOrder == 0) {
                this.tanchuangShow(1);
            } else {
                this.tanchuangShow(2);
            }
        }
    },
    /*
	*弹窗显示
	*/
    tanchuangShow: function (tipType) {
        this.isShowTip = true;
        CT.$("tipBG").style.visibility = "visible";
        //1、订购用户获奖填写手机号;2、未订购用户中奖跳订购提示弹窗;3、很遗憾没有中奖4、抽奖次数用完5、奖品抽完6、订购成功返回提示填写信息弹窗
        if (tipType == 1) {
            CT.$("tipImg").src = "img/tip/orderTelTip.png";
            CT.$("telInput").style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_inputFocus_");
        } else if (tipType == 2) {
            CT.$("tipImg").src = "img/tip/noOrderZhong.png";
			CT.$("getPrizeText").style.visibility = "visible";
			CT.$("getPrizeText").innerHTML=this.priceName;
            PAGE.changeFocus("hands_x0_y0_toOrderFocus_");
        } else if (tipType == 3) {
            CT.$("tipImg").src = "img/tip/pity.png";
            PAGE.changeFocus("hands_x0_y0_confirmFocus_");
        } else if (tipType == 4) {
            CT.$("tipImg").src = "img/tip/noChance.png";
            PAGE.changeFocus("hands_x0_y0_confirmFocus_");
        } else if (tipType == 5) {
            CT.$("tipImg").src = "img/tip/noRemain.png";
            PAGE.changeFocus("hands_x0_y0_pityExcellentFocus_");
        } else if (tipType == 6) {
            CT.$("tipImg").src = "img/tip/telTip.png";
            CT.$("telInput").style.visibility = "visible";
        }
    },
    /*
	 * 没有中奖
	 */
    showNoPrize: function () {
        this.tanchuangShow(3);
    },
    /*
    *首页跳转按钮>>>0、规则页1、奖品页2、更多精彩
    */
    btnJump: function (jumpType) {
        if (jumpType == 0) {
            CT.setCookie("xuanwuBackFocusId", curFocus.FocusID);
            CT.commonJumpUrl("xuanwuLakeRule.html");
        } else if (jumpType == 1) {
            CT.setCookie("xuanwuBackFocusId", curFocus.FocusID);
            CT.commonJumpUrl("xuanwuLakePrize.html");
        } else if (jumpType == 2) {
            CT.BackPortalMainPage();
        }
    },
    /*
	 * 抽奖中勿操作提示
	 */
    showTips: function () {
        var _this = this;
        this.littleTips.innerHTML = "转盘转动中，请勿做多余操作！";
        setTimeout(function () {
            _this.littleTips.innerHTML = "";
        }, 2000);
    },
    /*
	*跳转订购
	*/
    toOrder: function () {
        CT.goPage();
        orderJs.columnToOrderPage("xuanwuLake");
    },
    /*
	*初始化转盘页面
	*/
    initLottery: function () {
        this.ringImg.style.top = "345px";
        this.ringImg.style.left = "760px";
    }
}
var xuanwuLakeLottery = new xuanwuLake();

function backfunc() {
    CT.delCookie("xuanwuBackFocusId");//删除记忆焦点
    //弹窗显示
    if (xuanwuLakeLottery.isShowTip) {
        xuanwuLakeLottery.isShowTip = false;
        //关闭弹窗
        CT.$("tipBG").style.visibility = "hidden";
        CT.$("telInput").style.visibility = "hidden";
		CT.$("getPrizeText").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_startBtnFocus_");
        //初始化抽奖转盘
        xuanwuLakeLottery.initLottery();
    } else if (xuanwuLakeLottery.isRing) {//转盘旋转中
        xuanwuLakeLottery.showTips();
    } else {
        CT.backPage();
    }
}
var startBtnBlurAni = null;
var startBtnFocusAni = null;
function startFocusEvent() {
    clearInterval(startBtnBlurAni);
    var circleImg = 0;
    startBtnFocusAni = setInterval(function () {
        if (circleImg > 3) {
            circleImg = 0;
        }
        CT.$("startBtnFocus").src = "img/mainPage/choose/" + (circleImg + 1) + ".png";
        circleImg++;
    }, 200);
}
function startBlurEvent() {
    clearInterval(startBtnFocusAni);
    var startImg = 0;
    startBtnBlurAni = setInterval(function () {
        if (startImg % 2 == 0) {
            CT.$("startBtn").src = "img/mainPage/startBtn1.png";
        } else {
            CT.$("startBtn").src = "img/mainPage/startBtn2.png";
        }
        startImg++;
    }, 200);
}




