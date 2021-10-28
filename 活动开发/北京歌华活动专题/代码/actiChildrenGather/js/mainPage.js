/**
 * 1、默认焦点：订购用户每次进入默认焦点都为hands_x0_y0_ip0Focus_，进入主题记录当前点击焦点；非订购用户var playReords = [false,false,false,false];玩过的主题，设置为true，进入页面默认焦点为数组中第一个为false的位置
 * 2、未订购用户：是否全玩过》》全玩过都是灰色，点击跳订购》》没有全玩过》》今天有没有玩过的记录》》今天玩过》》全是灰色，点击跳订购》》今天没玩过》》未玩过的主题高亮显示，玩过的是灰色
 * 3、已订购用户可以无限畅玩
 * 4、当前选中IP做切换动画 
 * 5、默认焦点：有焦点记录为记忆焦点，无焦点记录且当天没玩过》》 默认焦点为数组中第一个为false的位置》》》今天玩过或者全为true，焦点为第一个     
 */
function ChildrenGather() {
    this.isOrder = 1;//未订购为1
    this.playRecords = [false, false, false, false];//进入主题记录
    this.isTodayPlay = false;//今天是否玩过游戏.默认未玩过(针对未订购用户)
    this.defaultFocus = "hands_x0_y0_ip0Focus_";//页面默认焦点
    this.allPlay = false;//是否全部玩过
    this.ipChangeAni = null;//IP切换定时器
    this.ipChangeIndex = 0;//IP切换变量
}
ChildrenGather.prototype = {
    constructor: ChildrenGather,
    /**初始化页面元素、焦点数组
     * 鉴权
     * 未订购用户和订购用户页面状态判断
    */
    initFunc: function () {
        var _this = this;
        var ipHtml = "";
        for (var i = 0; i < 4; i++) {
            ipHtml += '<img src="img/mainPage/' + (i + 1) + '.png" alt="" id="ip' + i + 'Show">';
            ipHtml += '<div id="hands_x0_y0_ip' + i + 'Focus_"><img src="img/mainPage/chooseFocus.png" alt="" id="ip' + i + 'Focus" style="visibility: hidden;"></div>';
            buttons.push({
                id: "hands_x0_y0_ip" + i + "Focus_",
                otherFocusEvent: "javascript:childrenGatherMain.onIpFocus(1," + i + ")",
                otherBlurEvent: "javascript:childrenGatherMain.onIpFocus(0," + i + ")",
                clickHandler: "javascript:childrenGatherMain.goIpGame(" + i + ")",
                left: i == 0 ? "disable" : "hands_x0_y0_ip" + (i - 1) + "Focus_",
                right: i == 3 ? "disable" : "hands_x0_y0_ip" + (i + 1) + "Focus_",
                up: i == 3 ? "hands_x0_y0_ruleBtnFous_" : "disable",
                down: "disable",
                focusType: 7
            });
        }
        // 规则焦点
        buttons.push({
            id: "hands_x0_y0_ruleBtnFous_",
            clickHandler: "javascript:childrenGatherMain.goRule()",
            left: "disable",
            right: "disable",
            up: "disable",
            down: "hands_x0_y0_ip3Focus_",
            focusType: 7
        });
        CT.$("main").innerHTML += ipHtml;
        // 鉴权        
        orderJs.columnGetAuth(function (data) {
            if (data == '0') {
                _this.isOrder = 0;
            } else {
                _this.isOrder = 1;
            }
            // 获取非订购用户当天是否玩过
            actiObj.getChance(function (res) {
                if (res.data.activityChance >= 1) {
                    _this.isTodayPlay = true;
                }
                // 获取非订购用户游戏次数记录
                actiObj.getUserDataList(function (res) {
                    if (res.errorCode = "1000" && res.data) {
                        _this.playRecords = JSON.parse(res.data.userActiData);
                        _this.allPlay = _this.playRecords.every(function (playRecord) {
                            return playRecord == true;//如果数组每一项都是true即表示全部玩过，返回true，否则返回false
                        });
                    }
                    // 未订购用户，判断IP主题显示效果
                    if (_this.isOrder != 0) {
                        // 全部玩过,或者今天玩过，全部灰色
                        if (_this.allPlay || _this.isTodayPlay) {
                            for (var m = 0; m < 4; m++) {
                                CT.$("ip" + m + "Show").src = "img/mainPage/grey" + (m + 1) + ".png";
                            }
                            //没有全玩过，且今天没玩过,未玩过的主题高亮显示，玩过的是灰色
                        } else if (!_this.allPlay && !_this.isTodayPlay) {
                            for (var n = 0; n < _this.playRecords.length; n++) {
                                if (_this.playRecords[n]) {
                                    CT.$("ip" + n + "Show").src = "img/mainPage/grey" + (n + 1) + ".png";
                                } else {
                                    CT.$("ip" + n + "Show").src = "img/mainPage/" + (n + 1) + ".png";
                                }
                            }
                        }
                    }
                    // 判断初始默认焦点位置
                    //是否有焦点记忆
                    if (CT.getCookie("ipBackFocus") && CT.$(CT.getCookie("ipBackFocus"))) {
                        _this.defaultFocus = CT.getCookie("ipBackFocus");
                    } else {
                        if (_this.isOrder == 0) {
                            _this.defaultFocus = "hands_x0_y0_ip0Focus_";
                        } else {
                            // 全部玩过,或者今天玩过，焦点默认第一个
                            if (_this.allPlay || _this.isTodayPlay) {
                                _this.defaultFocus = "hands_x0_y0_ip0Focus_";
                                //没有全玩过，且今天没玩过,焦点默认playReords数组第一个为false的下标
                            } else if (!_this.allPlay && !_this.isTodayPlay) {
                                for (var k = 0; k < _this.playRecords.length; k++) {
                                    if (!_this.playRecords[k]) {
                                        _this.defaultFocus = "hands_x0_y0_ip" + k + "Focus_";
                                        break;
                                    }
                                }
                            }
                        }
                    }
                    // 焦点初始化
                    PAGE.focusInit();
                    PAGE.changeFocus(_this.defaultFocus);
                });
            });
        });
    },
    /**
     * 灰色》》聚焦失焦无变化；
     *聚焦：IP动画;失焦：动画消失
     */
    onIpFocus: function (ii, kk) {
        var _this = this;
        if (CT.$("ip" + kk + "Show").src.indexOf("grey") == -1) {//不是灰色
            if (ii == 1) {
                this.ipChangeAni = setInterval(function () {
                    if (_this.ipChangeIndex % 2 == 0) {
                        CT.$("ip" + kk + "Show").src = "img/mainPage/" + (kk + 1) + "-1.png";
                    } else {
                        CT.$("ip" + kk + "Show").src = "img/mainPage/" + (kk + 1) + "-2.png";
                    }
                    _this.ipChangeIndex++;
                }, 200);
            } else {
                clearInterval(this.ipChangeAni);
                this.ipChangeAni = null;
                this.ipChangeIndex = 0;
                CT.$("ip" + kk + "Show").src = "img/mainPage/" + (kk + 1) + ".png";
            }
        }
    },
    /** 
     * 灰色》》跳订购
    */
    goIpGame: function (index) {
        CT.setCookie("ipBackFocus", curFocus.FocusID);
        PAGE.otherPageParam="&activityId="+CT.requestValue("activityId")+"&contentId="+CT.requestValue("contentId")+"&contentCName="+CT.requestValue("contentCName")+"&contentEName="+CT.requestValue("contentEName");
        CT.goPage();        
        var pojectName = AjaxConfig.projectUrl + "HD/web/column/activity/";
        if (CT.$("ip" + index + "Show").src.indexOf("grey") > -1) {//灰色
            //跳订购            
            orderJs.columnToOrderPage("actiChildrenGather");
        } else {
            if (index == 0) {
                actiObj.actiCommonJumpUrl(pojectName + "activity_christmasHMBB/christmasHMBB.html");
            } else if (index == 1) {
                actiObj.actiCommonJumpUrl(pojectName + "activity_christmasWWD/christmasWWD.html");
            } else if (index == 2) {
                actiObj.actiCommonJumpUrl(pojectName + "activity_christmasMJXD/christmasMJXD.html");
            } else if (index == 3) {
                actiObj.actiCommonJumpUrl(pojectName + "activity_christmasYZHWD/christmasYZHWD.html");
            }
        }

    },
    /** 
     * 跳转规则页
    */
    goRule: function () {
        CT.setCookie("ipBackFocus", curFocus.FocusID);
        actiObj.actiCommonJumpUrl("childrenGatherRulePage.html");
    }
}
var childrenGatherMain = new ChildrenGather();
childrenGatherMain.initFunc();

function backFunc() {
    CT.delCookie("ipBackFocus");
    CT.backPage();
}