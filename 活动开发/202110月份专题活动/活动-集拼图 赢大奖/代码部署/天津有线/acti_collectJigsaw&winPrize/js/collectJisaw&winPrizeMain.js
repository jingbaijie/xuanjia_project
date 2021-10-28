// 焦点数组
var buttons = [
    {
        id: "hands_x0_y0_choosePrize1Focus_",
        clickHandler: "javascript:collectJigSawMainEG.choosePrize(1)",
        left: "disable",
        up: "hands_x0_y0_ruleBtnFocus_",
        right: "hands_x0_y0_choosePrize2Focus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_choosePrize2Focus_",
        clickHandler: "javascript:collectJigSawMainEG.choosePrize(2)",
        left: "hands_x0_y0_choosePrize1Focus_",
        up: "disable",
        right: "hands_x0_y0_choosePrize3Focus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_choosePrize3Focus_",
        clickHandler: "javascript:collectJigSawMainEG.choosePrize(3)",
        left: "hands_x0_y0_choosePrize2Focus_",
        up: "disable",
        right: "disable",
        down: "disable",
        focusType: 7
    }, {
        id: "hands_x0_y0_blankFocus_",
        left: "disable",
        up: "disable",
        right: "disable",
        down: "disable",
        focusType: 7

    }, {
        id: "hands_x0_y0_ruleBtnFocus_",
        clickHandler: "javascript:collectJigSawMainEG.goRule()",
        left: "disable",
        up: "disable",
        right: "disable",
        down: "hands_x0_y0_choosePrize1Focus_",
        focusType: 7
    }
]

function collectJigSawMain() {
    this.boomAni = null; //爆炸动画定时器
    this.boomImg = 1;//爆炸图片变量
    this.newPrizeArr = [];//最终的奖品排列
    this.prize3Random = 1//三等奖的随机数
    this.isTipShow = false;//弹窗是否显示 
    this.prizeId = 0;//选中的奖品Id              
}
collectJigSawMain.prototype = {
    constructor: collectJigSawMain,
    /**
     * 初始化页面奖品位置
    **/
    initCollectPuzzleMain: function () {
        var _this = this;
        //初始奖品排列
        var prizeArr = [1, 2, 3];
        // 左侧奖品
        var random1 = Math.floor(Math.random() * 3);//[0,1,2]奖品位置随机
        var prize1 = prizeArr[random1];
        prizeArr.splice(random1, 1);
        // 中间奖品
        var random2 = Math.floor(Math.random() * 2);//[0,1]奖品位置随机
        var prize2 = prizeArr[random2];
        prizeArr.splice(random2, 1);
        // 右侧奖品
        var prize3 = prizeArr[0];
        // 新的奖品排列
        this.newPrizeArr = [prize1, prize2, prize3];
        //三等奖的随机数
        this.prize3Random = (Math.ceil(Math.random() * 2));
        this.newPrizeArr.forEach(function (item, index) {
            if (item == 3) {
                CT.$("prize" + (index + 1)).src = "img/mainPage/prizebox" + item + "_" + _this.prize3Random + ".png";
            } else {
                CT.$("prize" + (index + 1)).src = "img/mainPage/prizebox" + item + ".png";
            }
        })
        setTimeout(function () {
            CT.addClass(CT.$("prize1"), "prize1Ani");
            CT.addClass(CT.$("prize2"), "prize2Ani");
            CT.addClass(CT.$("prize3"), "prize3Ani");
            _this.gatherPrize();
        }, 1000);
    },
    /**
     * 奖品汇集
    **/
    gatherPrize: function () {
        var _this = this;
        setTimeout(function () {
            CT.$("prize1").src = "img/empty.png";
            CT.$("prize2").src = "img/empty.png";
            CT.$("prize3").src = "img/empty.png";
            // 爆炸--出现一个礼物盒---分出三个礼物盒
            // 上移时间2000*15/100=300ms;爆炸时间200*4=800ms;下移时间为2000*85/100=1700后，即爆炸之后600ms后下移
            _this.boomAni = setInterval(function () {
                if (_this.boomImg > 4) {
                    CT.$("boom").src = "img/empty.png";
                    clearInterval(_this.boomAni);
                    _this.boomAni = null;
                    CT.$("prize1").src = "img/mainPage/prizebox5.png";
                    CT.$("prize2").src = "img/mainPage/prizebox5.png";
                    CT.$("prize3").src = "img/mainPage/prizebox5.png";
                    setTimeout(function () {
                        CT.$("prize1").src = "img/mainPage/prizeboxClose.png";
                        CT.$("prize2").src = "img/mainPage/prizeboxClose.png";
                        CT.$("prize3").src = "img/mainPage/prizeboxClose.png";
                        CT.$("prize1").style.top = "265px";
                        CT.$("prize2").style.top = "265px";
                        CT.$("prize3").style.top = "265px";
                        setTimeout(function () {
                            // 获取当前活动的奖品列表
                            actiObj.getActivityPrize(function (res) {
                                if (res.errorCode == 1000 && res.data.records.length > 0) {
                                    if (_this.prize3Random == 1) {//龙虎战机王
                                        _this.prizeId = res.data.records[0].id;
                                    } else if (_this.prize3Random == 2) {//热浪战机王
                                        _this.prizeId = res.data.records[1].id;
                                    }
                                    // 焦点初始化
                                    PAGE.focusInit();
                                    PAGE.changeFocus("hands_x0_y0_choosePrize1Focus_");
                                }
                            });
                        }, 300);
                    }, 600);
                } else {
                    CT.$("boom").src = "img/mainPage/boom/" + _this.boomImg + ".png";
                    _this.boomImg++;
                }
            }, 200);
        }, 300);
    },
    /**
    *领取礼品，中实物奖品的概率为100%
    **/
    choosePrize: function (index) {
        var _this = this;
        // 另外两个奖品的下标
        var index2 = 0;
        var index3 = 0;
        PAGE.changeFocus("hands_x0_y0_blankFocus_");
        CT.addClass(CT.$("prize" + index + ""), "prizeOpen");
        // 打开礼品盒
        setTimeout(function () {
            CT.$("prize" + index + "").src = "img/mainPage/prizebox3_" + _this.prize3Random + ".png";
            // 上传领取的奖品
            setPrizeContent({ contentId: actiActivityId, userId: actiUserId || xjDataLog.getSmartCardid(), prizeId: _this.prizeId }, function (setRes) {
                if (setRes.errorCode == 1000) {
                    setTimeout(function () {
                        // 打开另外两个奖品
                        if (index == 1) {
                            index2 = 2;
                            index3 = 3;
                        } else if (index == 2) {
                            index2 = 1;
                            index3 = 3;
                        } else if (index == 3) {
                            index2 = 1;
                            index3 = 2;
                        }
                        CT.$("prize" + index2 + "").src = "img/mainPage/prizebox1.png";
                        CT.$("prize" + index3 + "").src = "img/mainPage/prizebox2.png";
                        setTimeout(function () {
                            // 跳转集碎片页面
                            actiObj.actiCommonJumpUrl("collectJigsaw&winPrizeGame.html?prizeIndex=" + collectJigSawMainEG.prize3Random + "&restart=1");
                        }, 1500);
                    }, 1500);
                }
            });
        }, 1200);
    },
    /**
     * 规则弹窗
    **/
    goRule: function () {
        CT.$("ruleTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_blankFocus_");
        this.isTipShow = true;//弹窗显示
    }
}

var collectJigSawMainEG = new collectJigSawMain();

function backFunc() {
    if (collectJigSawMainEG.isTipShow) {
        CT.$("ruleTip").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_ruleBtnFocus_");
        collectJigSawMainEG.isTipShow = false;
    } else {
        CT.backPage();
    }
}