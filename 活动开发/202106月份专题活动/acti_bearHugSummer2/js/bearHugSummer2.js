function BearHugSummer2() {
    this.prizelist = [];
    this.getPrizeList();
    this.baseProbability = 1000;//概率基数
    this.isPrize = false;//当前用户有没有中过奖,默认没有
    this.prizeId = 0;//奖品id
}
BearHugSummer2.prototype = {
    constructor: BearHugSummer2,
    // 获取奖品列表
    getPrizeList: function () {
        var _this = this;
        actiObj.getActivityPrize(function (res) {
            if (res.errorCode == 1000 && res.data.records.length > 0) {
                _this.prizelist = res.data.records;
            }
            _this.isHaveChance();
        })
    },
    // 上传抽奖记录
    uploadLotteryChance: function (fn) {
        actiObj.setChance(fn);
    },
    /**
     * 判断是否有机会抽奖
     */
    isHaveChance: function () {
        var _this = this;
        actiObj.getChance(function (res) {
            // 提示今日无抽奖机会
            if (res.data.activityChance >= 1) {
                CT.$("todayNoChance").style.visibility = "visible";
                // 初始化焦点
                _this.initFocusFunc();
            } else {//上传一次抽奖机会
                _this.uploadLotteryChance(function () {
                    // 判断当前用户有无中过奖
                    _this.judgeUserIsPrize();
                });
            }
        })
    },
    /**
     * 判断当前用户有无中过奖
     */
    judgeUserIsPrize: function () {
        var _this = this;
        actiObj.getUserPrizeInfo(function (res) {
            if (res.errorCode == 1000 && res.data.length > 0) {
                _this.isPrize = true;
            } else {
                _this.isPrize = false;
            }
            _this.getProbability();//计算中奖概率
        })
    },
    /**
     * 计算中奖概率
     */
    getProbability: function () {
        var random = Math.ceil(Math.random() * this.baseProbability);//[1,1000]
        if (random <= this.prizelist[0].prizePercentage && !this.isPrize && this.prizelist[0].prizeRemainNum > 0) {//贝肯熊玩具
            this.prizeId = this.prizelist[0].id;
            CT.$("getPrizeTip").style.visibility = "visible";
            CT.$("prizeBG").src = "img/getToy.png";
            actiObj.setPrize(this.prizeId);
        } else if (random <= (this.prizelist[0].prizePercentage + this.prizelist[1].prizePercentage) && !this.isPrize && this.prizelist[1].prizeRemainNum > 0) {//电影票
            this.prizeId = this.prizelist[1].id;
            CT.$("getPrizeTip").style.visibility = "visible";
            CT.$("prizeBG").src = "img/getFilmTicket.png";
            actiObj.setPrize(this.prizeId);
        } else {//遗憾没有中奖
            CT.$("pityTip").style.visibility = "visible";
        }
        // 初始化焦点
        this.initFocusFunc();
    },
    /**
     * 初始化焦点
     */
    initFocusFunc: function () {
        PAGE.focusInit();
        if (this.prizeId != 0) {
            PAGE.changeFocus("hands_x0_y0_telInputFocus_");
        } else {
            PAGE.changeFocus("hands_x0_y0_closeBtnFocus_");
        }
    },
    /** 
     * 返回按钮向下事件
    */
    closeDownEvent: function () {
        if (this.prizeId != 0) {//获奖有输入框焦点
            PAGE.changeFocus("hands_x0_y0_telInputFocus_");
        }
    }
}
var bearHugSummer2 = new BearHugSummer2();

function backFunc() {
    CT.backPage();
}

