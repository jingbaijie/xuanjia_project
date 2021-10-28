/**
 * 鉴权、初始化焦点、排行榜显示、进度条显示   
 * 未订购用户每天一次投票机会，订购用户每天三次投票机会
 * 票数累计userdata
 * 点击投票功能：1、+1效果；2、数字显示；
 */
function superFly9() {
    this.isOrder = 1;//鉴权结果
    this.ipNum = 5;
    this.voteBtnNum = 5;
    this.actiBackFocus = "hands_x0_y0_voteBtn1Focus_";//活动默认焦点
    this.addAni = null;//投票动画定时器
    this.addImg = 1;//投票图片变量
    this.isClick = true;//点击按钮是否可以点击，默认可以点击
    this.allPlayerVotes = "0_0_0_0_0";//所有选手票数字符串
    this.allPlayerVotesArr = [[], [], [], [], []];//所有选手票数数组
    this.voteUserId = "test001";//投票固定用户
    this.firstIndex = 0;//第一名下标
    this.secondIndex = 0;//第二名下标
    this.thirdIndex = 0;//第三名下标
    this.firstNum = 0;//第一名
    this.secondNum = 0;//第二名
    this.thirdNum = 0;//第三名
    this.usedChance = 0;//已使用机会
    this.totalChance = 0;//总机会
    this.remainChance = 0;//剩余机会
    this.isOnFocus = 1;//输入框是否聚焦
    this.isTipShow = false;//弹窗默认不显示
    this.init();
}
var telInput = CT.$("telInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;
superFly9.prototype = {
    constructor: superFly9,
    init: function () {
        var _this = this;
        // 创建焦点数组
        _this.createButtons();
        //获取投票数数据
        actiObj.getUserDataList(this.voteUserId, function (res) {
			if(res.resultMsg == "success") {
				_this.allPlayerVotes = res.list[0].user_acti_data;
			} else {
				_this.allPlayerVotes = "0_0_0_0_0";
			}
            //页面票数渲染
            _this.voteNumShow();
        });
        //鉴权
        orderJs.columnGetAuth(function (data) {
            if (data == "0") {
                _this.isOrder = 0;
                _this.totalChance = 3;
            } else {
                _this.isOrder = 1;
                _this.totalChance = 1;
            }
            //焦点初始化
            focusInit();			
            _this.actiBackFocus = CT.requestValue("curFocus") || CT.getCookie("superFlyBackFocus") || "hands_x0_y0_voteBtn1Focus_";
            if (CT.getCookie("superFlyBackFocus")) {
                CT.delCookie("superFlyBackFocus");
            }
			curFocus = getFocusModel6(_this.actiBackFocus);
            curFocus.defaultFocus();
            //初始化投票机会
            actiObj.getChance(function (res) {
                _this.usedChance = res.activityChance;
                _this.remainChance = _this.totalChance - _this.usedChance;
            });
        });
    },
    createButtons: function () {
        for (var i = 0; i < this.ipNum; i++) {
            var ipButton = {
                id: "hands_x0_y0_ip" + (i + 1) + "Focus_",
                clickHandler: "javascript:superFly9Vote.jumpIp(" + (i + 1) + ")",
                left: (i == 0) ? "disable" : "hands_x0_y0_ip" + i + "Focus_",
                right: (i == 4) ? "disable" : "hands_x0_y0_ip" + (i + 2) + "Focus_",
                up: (i == 4) ? "hands_x0_y0_backBtnFocus_" : ((i == 0) ? "hands_x0_y0_voteInfoBtnFocus_" : "disable"),
                down: "hands_x0_y0_voteBtn" + (i + 1) + "Focus_",
                focusType: 7
            }
            buttons.push(ipButton);
        }
        for (var k = 0; k < this.voteBtnNum; k++) {
            var voteBtnButton = {
                id: "hands_x0_y0_voteBtn" + (k + 1) + "Focus_",
                clickHandler: "javascript:superFly9Vote.voteBtn(" + (k + 1) + ")",
                left: (k == 0) ? "disable" : "hands_x0_y0_voteBtn" + k + "Focus_",
                right: (k == 4) ? "disable" : "hands_x0_y0_voteBtn" + (k + 2) + "Focus_",
                up: "hands_x0_y0_ip" + (k + 1) + "Focus_",
                down: "disable",
                focusType: 7
            }
            buttons.push(voteBtnButton);
        }
    },
    /**
     * 点击投票：投票动画、上传数据
     * @param {IP下标} num 
     */
    voteBtn: function (num) {
        var _this = this;
        //记录焦点
        CT.setCookie("superFlyBackFocus", curFocus.FocusID);
        if (_this.isOrder == 0) {
            if (_this.remainChance > 0) {
                this.upLoadVotes(num);
            } else {
                //次数用完
                CT.$("chanceOutTip").style.visibility = "visible";
                _this.isTipShow = true;
                actiObj.changeFocus("hands_x0_y0_noChanceBtnFocus_");
            }
        } else {
            if (_this.remainChance > 0) {
                //未订购试玩
                this.upLoadVotes(num);
            } else {
                //去订购 
                _this.toOrder();
            }
        }
    },
    /*
	*跳转订购
	*/
    toOrder: function () {
        orderJs.columnToOrderPage("superFly9");
    },
    /**
     * 上传票数操作
     */
    upLoadVotes: function (num) {
        var _this = this;
        if (this.isClick && _this.addAni == null) {
            this.addAni = setInterval(function () {
                _this.isClick = false;//不可点击
                if (_this.addImg > 4) {
                    _this.addImg = 1;
                    CT.$("addVote").src = "img/empty.png";
                    clearInterval(_this.addAni);
                    _this.addAni = null;
                    _this.isClick = true;//恢复点击
                } else {
                    CT.$("addVote").src = "img/add/add" + _this.addImg + ".png";
                    CT.$("addVote").style.left = CT.$("voteBtn" + num + "").style.left;
                    CT.$("addVote").style.top = parseInt(CT.$("voteBtn" + num + "").style.top) - 100 + "px";
                    _this.addImg++;
                }
            }, 200);

            var ipVotesArr = this.allPlayerVotes.split("_");
            for (var i = 0; i < ipVotesArr.length; i++) {
                if ((num - 1) == i) {
                    ipVotesArr[i] = parseInt(ipVotesArr[i]) + 1;
                } else {
                    ipVotesArr[i] = parseInt(ipVotesArr[i]);
                }
            }
            this.allPlayerVotes = ipVotesArr.join("_");
            //页面票数渲染
            _this.voteNumShow();
            //上传投票数据
            actiObj.setUserDataList(this.voteUserId, this.allPlayerVotes, function (res) {
                if (res.resultMsg == "success") {
                    setTimeout(function () {
                        //投票成功
                        CT.$("voteSuccess").style.visibility = "visible";
                        _this.isTipShow = true;
                        actiObj.changeFocus("hands_x0_y0_sucCloseBtnFocus_");
                        _this.voteSuccessTan();
                    }, 1200);
                }
            });
            //上传机会
            actiObj.setChance();
            _this.remainChance--;
        }
    },
    /**
     * 页面票数渲染:100_200_300_400_500,split("_")
     * 进度条渲染
     * 排行榜展示
     */
    voteNumShow: function () {
        var _this = this;
        var totalBase = 5000;
        this.allPlayerVotesArr = [[], [], [], [], []];
        for (var m = 0; m < 5; m++) {
            CT.$("topImg" + (m + 1) + "").src = "img/empty.png";
        }
        for (var i = 0; i < this.allPlayerVotes.split("_").length; i++) {
            CT.$("numberShow" + (i + 1) + "").innerHTML = "";
            CT.$("blueSlider" + (i + 1) + "").style.width = (this.allPlayerVotes.split("_")[i] / totalBase) * 100 + "%";
            for (var k = 0; k < this.allPlayerVotes.split("_")[i].split("").length; k++) {
                this.allPlayerVotesArr[i].push(this.allPlayerVotes.split("_")[i].split("")[k]);
                CT.$("numberShow" + (i + 1) + "").innerHTML += '<img src="img/mainPage/number/' + this.allPlayerVotesArr[i][k] + '.png" alt="">';
            }
        }
        if (this.allPlayerVotes != "0_0_0_0_0") {
            //排行
            _this.getRank();
        }
    },
    getRank: function () {
        var votesArr = this.allPlayerVotes.split("_");
        this.firstNum = parseInt(votesArr[0]);
        var firstM = 0;//当前数组中第一名下标
        for (var m = 0; m < votesArr.length; m++) {
            if (this.firstNum < parseInt(votesArr[m])) {//第一名
                this.firstNum = parseInt(votesArr[m]);
                firstM = m;
                this.firstIndex = m;
            }
        }
        votesArr.splice(firstM, 1);
        this.secondNum = parseInt(votesArr[0]);
        var secondM = 0;//当前数组中第二名下标
        for (var m = 0; m < votesArr.length; m++) {
            if (this.secondNum < parseInt(votesArr[m])) {//第二名
                this.secondNum = parseInt(votesArr[m]);
                secondM = m;
            }
        }
        votesArr.splice(secondM, 1);
        this.thirdNum = parseInt(votesArr[0]);
        var thirdM = 0;//当前数组中第三名下标
        for (var m = 0; m < votesArr.length; m++) {
            if (this.thirdNum < parseInt(votesArr[m])) {//第三名
                this.thirdNum = parseInt(votesArr[m]);
                thirdM = m;
            }
        }
        votesArr.splice(thirdM, 1);
        for (var i = 0; i < this.allPlayerVotes.split("_").length; i++) {
            if (this.secondNum == this.allPlayerVotes.split("_")[i] && i != this.firstIndex) {
                this.secondIndex = i;
            }
        }
        for (var i = 0; i < this.allPlayerVotes.split("_").length; i++) {
            if (this.thirdNum == this.allPlayerVotes.split("_")[i] && i != this.firstIndex && i != this.secondIndex) {
                this.thirdIndex = i;
            }
        }
        CT.$("topImg" + (this.firstIndex + 1) + "").src = "img/mainPage/top/top1.png";
        CT.$("topImg" + (this.secondIndex + 1) + "").src = "img/mainPage/top/top2.png";
        CT.$("topImg" + (this.thirdIndex + 1) + "").src = "img/mainPage/top/top3.png";
    },
    jumpPage: function (index) {
        //记录焦点
        CT.setCookie("superFlyBackFocus", curFocus.FocusID);
        if (index == 0) {//活动规则
            actiObj.actiCommonJumpUrl("actiSuperFly9Rule.html");
        } else if (index == 1) {//投票信息
            actiObj.actiCommonJumpUrl("actiSuperFly9VoteInfo.html");
        }
    },
    jumpIp: function (num) {
		CT.setCookie("superFlyBackFocus", curFocus.FocusID);
		CT.setCookie("columnBackUrl", window.location.href);
		if(this.isOrder=="0"){
			var cartoonId;					
			getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=2769", curFocus.FocusID);
		}else{
			 //去订购 
              this.toOrder();
		}        
    },
    /**
     * 投票成功弹窗
     */
    voteSuccessTan: function () {
        var _this = this;
        //获取用户信息：userId和手机号 
        actiObj.getUserPhone(function (userInfoData) {
			if (userInfoData.userPhone) {
				CT.$("telInput").innerHTML = userInfoData.userPhone;
				phoneNum = userInfoData.userPhone;
			}
            if (actiUserId != "undefined") {
                CT.$("userInfo").innerHTML = actiUserId;
            }
        });
    },
    onFocus: function (index) {
        if (index == 1) {
            this.isOnFocus = true;
        } else {
            this.isOnFocus = false;
        }
    },
    saveFunc: function () {
        phoneNum = CT.$("telInput").innerHTML;
        if (phoneNum.length != 11) {
            CT.$("telInput").innerHTML = "请输入11位手机号码";
            phoneNum = "";
        } else {
            actiObj.setUserPhone(phoneNum, function (res) {
                phoneNum = res.userphone;
            });
            CT.$("savetips").innerHTML = "手机号保存成功";
        }
    },
    emptyFunc: function () {
        CT.$("telInput").innerHTML = "";
        phoneNum = "";
    },
    saveBlur: function () {
        CT.$("savetips").innerHTML = "";
    },
}
var superFly9Vote = new superFly9();

function changeNum(num) {
    if (superFly9Vote.isOnFocus) {
        var size;
        if (phoneNum == "") {
            size = 0;
        } else {
            size = phoneNum.length;
        }
        if (size < 11 || !size) {
            var addnum = phoneNum;
            phoneNum = addnum + num;
        }
        CT.$("telInput").innerHTML = phoneNum;
    }
}

function backfunc() {
    if (superFly9Vote.isTipShow) {//弹窗展示，关闭弹窗
        CT.$("voteSuccess").style.visibility = "hidden";
        CT.$("chanceOutTip").style.visibility = "hidden";
        superFly9Vote.isTipShow = false;
        var superFlyBackFocus = CT.getCookie("superFlyBackFocus") || "hands_x0_y0_voteBtn1Focus_";
        actiObj.changeFocus(superFlyBackFocus);
    } else {
        BackPortalMainPage();
    }
    CT.delCookie("superFlyBackFocus");
}