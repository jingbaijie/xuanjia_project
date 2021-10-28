// 构造函数
function eliminateVirusMain() {
    this.initFunc();//页面初始化
    this.rulePage = false;//规则页是否显示
    this.rankPage = false;//排行页是否显示
    this.isOrder;//鉴权
    this.chanceNum = 0;//已使用游戏次数（仅限未订购用户）
    this.isOnFocus;//焦点是否在输入框
}

var telInput = CT.$("telInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;
// 原型
eliminateVirusMain.prototype = {
    constructor: eliminateVirusMain,
    /*
    *页面初始化：鉴权》》》焦点初始化
    */
    initFunc: function () {
        var _this = this;
        orderJs.columnGetAuth(function (data) {
            if (data == "0") {
                _this.isOrder = "0";
            } else {
                _this.isOrder = "1";
                //未订购用户获取游戏次数
                actiObj.getChance(function (res) {
                    _this.chanceNum = res.activityChance;
                });
            }
            // 焦点初始化
            focusInit();
            curFocus = getFocusModel6("hands_x0_y0_leftCartoonFocus_");
            curFocus.defaultFocus();
        });
    },
    /*
    *选择射手：选择不同的射手传递不同的参数，游戏页展示的射手不同
    */
    chooseCharacter: function (index) {
        //未订购用户游戏次数超过两次直接跳订购,否则直接进入游戏
        if (this.isOrder == "1" && this.chanceNum >= 2) {
            orderJs.columnToOrderPage("activity_eliminateVirus");
        } else {
            if (index == 0) {
                actiObj.toJumpUrl("activity_eliminateVirusGame.html", { "character": "0", "isOrder": this.isOrder });
            } else if (index == 1) {
                actiObj.toJumpUrl("activity_eliminateVirusGame.html", { "character": "1", "isOrder": this.isOrder });
            }
        }
    },
    /*
    *首页点击按钮跳转:0跳转规则页；1跳转排行榜页；2退出活动
    */
    jumpBtn: function (ii) {
        if (ii == 0) {
            this.rulePage = true;
            CT.$("tanchuangBG").style.visibility = "visible";
            CT.$("rulePage").style.visibility = "visible";
            actiObj.changeFocus("hands_x0_y0_ruleBackBtn_");
        } else if (ii == 1) {
            this.rankPage = true;
            CT.$("tanchuangBG").style.visibility = "visible";
            CT.$("rankPage").style.visibility = "visible";
            actiObj.changeFocus("hands_x0_y0_inputFocus_");
            //获取排行榜页数据
            this.getRankData();
        } else if (ii == 2) {
            BackPortalMainPage();
        }
    },
    /*
    *获取排行榜页数据：获取排行榜列表、获取用户信息(userId、手机号）
    */
    getRankData: function () {
        var rankListHtml = "";
        //获取排行榜列表
        actiObj.getActivityRankList(function (res) {
            if (res && res.resultMsg == "success") {
                var rankList = res.list;
                for (var i = 0; i < rankList.length; i++) {
                    rankListHtml += "<li><span>" + rankList[i].userId + "</span><span>" + (i + 1) + "</span></li>";
                }
            } else {
                rankListHtml = "<li><span>180****7710</span><span>20</span></li>";
            }
            CT.$("rankList").innerHTML = rankListHtml;
        });
        //获取当前用户用户信息
        actiObj.getUserPhone(function (res) {
            CT.$("userInfo").innerHTML = res.userId;
            if (res.userPhone != null) {
                CT.$("telInput").innerHTML = res.userPhone;
            } else {
                CT.$("telInput").innerHTML = "";
            }
        });
    },
    /*
    *判断焦点是否在输入框
    */
    onFocus: function (kk) {
        this.isOnFocus = kk == 1 ? true : false;
        if (this.isOnFocus) {
            changeNum();
        }
    },
    /*
    *保存手机号
    */
    saveFunc: function () {
        var TEL_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
        phoneNum = CT.$("telInput").innerHTML;
        if (phoneNum.length != 11) {
            CT.$("telInput").innerHTML = "请输入11位手机号码";
        } else {
            if (TEL_REGEXP.test(phoneNum)) {
                actiObj.setUserPhone(phoneNum, function (res) {
                    phoneNum = res.userphone;
                });
                CT.$("saveTip").innerHTML = "手机号保存成功";
            } else {
                CT.$("telInput").innerHTML = "您输入的手机号格式有误";
            }
        }
    },
    /*
    *清除手机号
    */
    cancelFunc: function () {
        CT.$("telInput").innerHTML = "";
        phoneNum = "";
    },
    /*
    *保存成功提示移除
    */
    saveBlur: function () {
        CT.$("saveTip").innerHTML = "";
    }
}

/*
*返回：规则弹窗出现时返回、排行弹窗出现时返回、活动首页返回
*/
function backfunc() {
    if (eliminateVirusMainSp.rulePage == true) {
        eliminateVirusMainSp.rulePage = false;
        CT.$("tanchuangBG").style.visibility = "hidden";
        CT.$("rulePage").style.visibility = "hidden";
        actiObj.changeFocus("hands_x0_y0_ruleBtnFocus_");
    } else if (eliminateVirusMainSp.rankPage == true) {
        eliminateVirusMainSp.rankPage = false;
        CT.$("tanchuangBG").style.visibility = "hidden";
        CT.$("rankPage").style.visibility = "hidden";
        actiObj.changeFocus("hands_x0_y0_rankBtnFocus_");
    } else {
        //返回平台首页
        BackPortalMainPage();
    }
}
//监听用户遥控器输入的数字
function changeNum(num) {
    if (num != undefined) {
        var size;
        phoneNum = CT.$("telInput").innerHTML;
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

// 实例
var eliminateVirusMainSp = new eliminateVirusMain();


// 页面逻辑
// 页面初始化鉴权：已订购直接跳游戏页；未订购用户判断游戏次数chanceNum>=2，直接跳订购
//点击排行榜：获取排行榜列表（滚动）、获取手机号、用户userId、保存手机号