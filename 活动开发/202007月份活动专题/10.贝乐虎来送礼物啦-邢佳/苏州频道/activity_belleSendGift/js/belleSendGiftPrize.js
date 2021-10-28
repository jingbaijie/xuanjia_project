/*
*获取用户信息：userId和手机号
*获取用户中奖信息
*获取当前活动中奖列表，滚动展示
*手机号输入、保存、清除功能、输入提示
*/
function getPrize() {
    this.init();
    this.getPrizeList = [];//中奖名单列表
    this.listHTML = "";
    this.isOnFocus = 1;//输入框是否聚焦
    this.rankInterval = null;
	this.maxUp = 0;
}
var telInput = CT.$("telInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;
getPrize.prototype = {
    constructor: getPrize,
    init: function () {
        var _this = this;
        //获取用户信息：userId和手机号 
        actiObj.getUserPhone(function (userInfoData) {
            if (userInfoData.successFlg == 1) {
                if (userInfoData.data.userPhone) {
                    CT.$("telInput").innerHTML = userInfoData.data.userPhone;
                    phoneNum = userInfoData.data.userPhone;
                }
            }
            if(actiUserId != "undefined") {
				CT.$("userInfo").innerHTML = actiUserId;
			}
        });
        //获取用户中奖信息
        actiObj.getUserPrizeInfo(actiActivityId, function (userPrizeData) {
            if (userPrizeData.successFlg == 1) {
                CT.$("zhongJSituation").innerHTML = userPrizeData.data[0].prizeCname;
            } else {
                CT.$("zhongJSituation").innerHTML = "未中奖";
            }
        });
        //获奖列表
        this.getNameList();
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
            phoneNum="";
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
    /*
	 * 设置奖品榜，超过8人开始向下滚动
	 */
    getNameList: function () {
        var _this = this;
        if (this.rankInterval) {
            clearInterval(this.rankInterval);
        }
        actiObj.getPrizeUserInfo(actiActivityId, function (getPrizeData) {
            CT.$("prizeListUL").innerHTML = "";
            _this.getPrizeList = getPrizeData.data.records;
            if (getPrizeData && getPrizeData.successFlg == 1 && _this.getPrizeList.length > 0) {
                for (var i = 0; i < _this.getPrizeList.length; i++) {
                    for (var i = 0; i < _this.getPrizeList.length; i++) {
                        _this.listHTML += "<li><span>" + _this.getPrizeList[i].userId + "</span><span>" + _this.getPrizeList[i].prizeCname + "</span></li>";
                    }
                    CT.$("prizeListUL").innerHTML = _this.listHTML;
                }
            } else {
                _this.listHTML = "<li><span>19087675567</span><span>贝乐虎拼图</span></li>"
                CT.$("prizeListUL").innerHTML = _this.listHTML;
            }
            if (_this.getPrizeList.length >= 10) {
                _this.listHTML += _this.listHTML;
                CT.$("prizeListUL").innerHTML = _this.listHTML;
                _this.setRankUp();
            } else {
                CT.$("prizeListUL").innerHTML = _this.listHTML;
            }
        });        
    },
	/*
	 * 奖品榜滚动
	 */
    setRankUp: function () {
        var _this = this;
        var rankLines = CT.$("prizeListUL").getElementsByTagName("li");
        if (rankLines && rankLines.length >= 10) {
            this.maxUp = 0 - (rankLines.length / 2) * 25;
            this.rankInterval = setInterval(function () {
                if (parseInt(CT.$("prizeListUL").style.top) > _this.maxUp) {
                    CT.$("prizeListUL").style.top = parseInt(CT.$("prizeListUL").style.top) - 10 + "px";
                } else {
                    CT.$("prizeListUL").style.top = "0px";
                }
                document.querySelector('#prizeListUL>li:nth-child(' + rankLines.length / 2 + ')').style.marginBottom = "25px";
                document.querySelector('#prizeListUL>li:nth-child(' + rankLines.length + ')').style.marginBottom = "25px";
            }, 200);
        }
    }
}
var getPrizePage = new getPrize();
function backfunc() {
    window.location.href = "belleSendGiftMain.html";
}

changeNumObj.changeNum = function (num) {
    if (getPrizePage.isOnFocus) {
        var size;
        // phoneNum = CT.$("telInput").innerHTML;
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