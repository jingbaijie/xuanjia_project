var commonPageInfo = basePageInfo.commonPageInfo
var conversionObj = {
    // 默认焦点
    defaultFocus: "hands_x0_y0_select_",
    /* 用户id */
    userId: xjDataLog.getUserId(),
    commitId: null,
    prizeId: null,
    /* 页面初始化 */
    init: function () {
        var _this = this;
        _this.prizeId = parseInt(CT.requestValue('gameId'));
        _this.toyIndex = parseInt(CT.requestValue('defaultFocus').slice(21,23));
        interface.getPrizeListByUserId(
            {
                params:{
                    prizeType: 3,
                    outId: 1,
                    userId: xjDataLog.getUserId()
                }
            },
            function (res) {
                CT.$("BJ").src = AjaxConfig.imgUrl + res.data[_this.toyIndex].prizeFrom;
                CT.$("select").src = AjaxConfig.imgUrl + res.data[_this.toyIndex].more1;
                CT.$("select1").src = AjaxConfig.imgUrl + res.data[_this.toyIndex].more4;
                CT.$("showQRcode").src = AjaxConfig.imgUrl + res.data[_this.toyIndex].more3;
            }
        );
        //获取兑换状态
        setTimeout(function(){
            interface.getUserPrizeInfo(
                {params:{
                    prizeId: _this.prizeId,
                    userId: xjDataLog.getUserId(),
                }},
                function (res) {
                    if (res && res.data && res.data.id && res.data.more1) {
                        prized = false;
                        _this.commitId = res.data.id;
                    } else {
                        prized = true;
                        if (res && res.data && res.data.id) {
                            _this.commitId = res.data.id;
                        }
                    }
                }
            );     
        },200);
        _this.buttonsPush();
        PAGE.focusInit();
        PAGE.changeFocus(_this.defaultFocus)
        setInterval(_this.showAd, 500);
    },
    /* 按钮 */
    buttonsPush: function () {
        var _this = this;
        buttons.push({
            id: "hands_x0_y0_select_",
            clickHandler: "javascript:conversionObj.showQRcode()",
            up: "disable",
            down: "disable",
            left: "disable",
            right: "disable",
            focusType: 7
        })
    },
    /* 选择按钮动画 */
    showAd: function () {
        var _this = this
        if (CT.$("select").style.visibility == "visible") {
            CT.$("select1").style.visibility = "visible";
            CT.$("select").style.visibility = "hidden";
        } else {
            CT.$("select").style.visibility = "visible";
            CT.$("select1").style.visibility = "hidden";
        }
    },
    /* 显示二维码 */
    showQRcode:function(){
        var _this = this;
        //点击扣积分
        interface.changePrizeByPoints(
            {params:{
                prizeId: _this.prizeId,
                userId: xjDataLog.getUserId(),
                activityId: 1
            }},
            function (res) {
                console.log(res);
                switch (Number(res.data)) {
                    case 1:
                        CT.alertTip("奖品余额不足",{time:1500});
                        break;
                    case 2:
                        CT.alertTip("用户积分不足",{time:1500});
                        setTimeout(function(){
                            CT.getAnterByIdOrAction({
                                contentName: "jfsc-rwzc"
                            });
                        },1500)
                        break;
                    case 3:
                        CT.alertTip("奖品兑换时间未到或不存在该奖品",{time:1500});
                        break;
                    case 4:
                        CT.$('QRcode').style.visibility="visible";
                        CT.alertTip("兑换成功",{time:1500});
                        break;
                    case 5:
                        CT.alertTip("兑换失败",{time:1500});
                        break;
                    case 6:
                        CT.$('QRcode').style.visibility="visible";
                        // CT.alertTip("仅支持兑换一次",{time:500});
                        break;
                    case 7:
                        CT.alertTip("用户不存在或者无积分",{time:1500});
                        break;

                    default:
                        break;
                }
            }
        );
    },

}

conversionObj.init();

//返回
function backFunc() {
    if (CT.$('QRcode').style.visibility=="hidden") {
        // CT.backPage();
        CT.getAnterByIdOrAction({
            contentName: "PointsMall"
        });
    } else {
        CT.$('QRcode').style.visibility = "hidden";
    }
    
}