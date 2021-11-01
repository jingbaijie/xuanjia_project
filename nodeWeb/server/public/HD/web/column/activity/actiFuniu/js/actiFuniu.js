var newPhone = '';//最新手机号
var afterSavePhone = function () {
    newPhone = CT.$('telInput').innerHTML;
    CT.$('telInputText').innerHTML = newPhone;
}
var afterSavePhoneT = function () {
    newPhone = CT.$('telInputText').innerHTML;
    CT.$('telInput').innerHTML = newPhone;
}
/*中奖名单列表保存手机号*/
var winningListInfoJson = {
    //非焦点元素展示
    "textShowInfo": {
        //输入框展示信息
        "telInput": {
            "textLeft": "440px",
            "textTop": "542px",
            "textColor": "#ffffff",
        },
        //保存提示信息
        "saveTip": {
            "textName": "saveTip",
            "textSize": "24px",
            "textColor": "#333",
            "textLeft": "450px",
            "textTop": "584px",
            "textWidth": "200px",
            "textHeight": ""
        }
    },
    //焦点展示信息
    "contactFocusInfo": {
        "telInputFocus": {
            "focusName": "telInputFocus",
            "focusLeft": "440px",
            "focusTop": "526px",
            "focusSrc": "images/phoneSelect.png",
            "clickEvent": "",
            "otherFocusEvent": "inputFocusEvent",
            "otherBlurEvent": "inputBlurEvent",
            "up": "disable",
            "down": "disable",
            "left": "disable",
            "right": "saveBtnFocus"
        },
        "saveBtnFocus": {
            "focusName": "saveBtnFocus",
            "focusLeft": "740px",
            "focusTop": "525px",
            "focusSrc": "images/saveSelect.png",
            "clickEvent": "saveFunc(afterSavePhone)",
            "otherFocusEvent": "",
            "otherBlurEvent": "saveBtnBlur",
            "up": "disable",
            "down": "disable",
            "left": "telInputFocus",
            "right": "emptyBtnFocus"
        },
        "emptyBtnFocus": {
            "focusName": "emptyBtnFocus",
            "focusLeft": "840px",
            "focusTop": "525px",
            "focusSrc": "images/saveSelect.png",
            "clickEvent": "emptyFunc",
            "otherFocusEvent": "",
            "otherBlurEvent": "",
            "up": "disable",
            "down": "disable",
            "left": "saveBtnFocus",
            "right": "disable"
        }
    }
}
actiContact.init("winningListInfo",winningListInfoJson);
actiContact.initSuccess = function() {
    /*中奖保存手机号*/
    window.actiContactOne = new actiContactModule("actiContactOne");
    var winningInfoJson = {
        //非焦点元素展示
        "textShowInfo": {
            //输入框展示信息
            "telInput": {
                "textName": "telInputText",
                "textLeft": "515px",
                "textTop": "387px",
                "textColor": "#ffffff",
            },
            //保存提示信息
            "saveTip": {
                "textName": "saveTipMsg",
                "textSize": "24px",
                "textColor": "#333",
                "textLeft": "420px",
                "textTop": "453px",
                "width": "200px",
                "textHeight": ""
            }
        },
        //焦点展示信息
        "contactFocusInfo": {
            "telInputFocus": {
                "focusName": "telFocus",
                "focusLeft": "530px",
                "focusTop": "373px",
                "focusSrc": "images/phoneSelect.png",
                "clickEvent": "",
                "otherFocusEvent": "inputFocusEvent",
                "otherBlurEvent": "inputBlurEvent",
                "up": "disable",
                "down": "saveTelFocus",
                "left": "disable",
                "right": "disable"
            },
            "saveBtnFocus": {
                "focusName": "saveTelFocus",
                "focusLeft": "608px",
                "focusTop": "430px",
                "focusSrc": "images/saveSelect.png",
                "clickEvent": "saveFunc("+ afterSavePhoneT +")",
                "otherFocusEvent": "",
                "otherBlurEvent": "saveBtnBlur",
                "up": "telFocus",
                "down": "IP0",
                "left": "disable",
                "right": "emptyTelFocus"
            },
            "emptyBtnFocus": {
                "focusName": "emptyTelFocus",
                "focusLeft": "714px",
                "focusTop": "432px",
                "focusSrc": "images/saveSelect.png",
                "clickEvent": "emptyFunc",
                "otherFocusEvent": "",
                "otherBlurEvent": "",
                "up": "telFocus",
                "down": "IP0",
                "left": "saveTelFocus",
                "right": "disable"
            }
        }
    }
    actiContactOne.init("winningInfo",winningInfoJson);
    actiContactOne.initSuccess = function(){
        PAGE.focusInit();
        PAGE.changeFocus("hands_x0_y0_flopSelect0_");
    }


}


/*
 *牌
 *  this.index = index第几张牌
 * this.status = 'closed'; //状态: closed未翻开, flopWin_1~flopWin_3:翻开未中奖, flopWin_fn:中奖
 */
var Card = function(game, index) {
    var _this = this;
    this.game = game;
    this.index = index;//第几张牌
    this.status = 'closed';
    this.el = CT.$('flopPic' + index);
    this.prizeId = '';

}
Card.prototype = {
    open:function() {
        var _this = this;
        if (_this.status === 'closed') {
            var result = _this.game.random();
            if (result) {
                //存储中奖信息
                if(result.prized){
                    //调用接口保存中奖信息
                    actiObj.setPrize(_this.game.prizes[result.id].id, function() {
                    });
                }
                //播放翻牌动画
                _this.el.src = 'images/flop/Flop_1.png';
                setTimeout(function () {
                    if(result.prized){
                        _this.status = 'flopWin_fn';//中奖
                        _this.el.style.zIndex = '1';
                        _this.el.src = 'images/prize/prize_' +result.id+ '.png';
                        /*中奖弹框*/
                        setTimeout(function () {
                            CT.$('hands_x0_y0_winningBox_').style.visibility = 'visible'
                            PAGE.changeFocus("hands_x0_y0_telFocus_");

                        },100)

                    }else {
                        _this.status = 'flopWin_'+result.id;//未中奖
                        _this.el.style.zIndex = '1';
                        _this.el.src = 'images/flopwin/flopWin_'+ result.id +'.png';
                        /*未中奖弹框*/
                        setTimeout(function () {
                            CT.$('hands_x0_y0_nowinningBox_').style.visibility = 'visible'
                            PAGE.changeFocus("hands_x0_y0_wzjIP0_");
                        },100)

                    }
                    //存储状态
                    _this.game.save();
                }, 300);


            }
        }
    },

}
/*游戏*/
var Game = function() {
    var _this = this;
    this.cards = [];//所有的牌
    this.prizes = [];//所有的奖品
    this.canOpen = 0; //当日可抽奖的次数
    this.prized = false; //是否已经中过奖
    this.createTime = '';//创建时间
    this.statusOpen = 0;//翻开次数
    this.cardsIndex = 0;//记录是第几张牌
    this.isOrder = 1;//默认 未订购   0 已订购
}
Game.prototype = {
    init:function(callback) {//初始化
        var _this=this;
        for (var i = 0; i < 8; i++) {
            _this.cards.push(new Card(_this, i));
        }
        actiObj.getActivityPrize(function (data) {
            _this.prizes = data.data.records;
            actiObj.getChance(function (data) {
                _this.createTime = data.data.createTime.substring(0,10);
                console.log(_this.createTime);
                callback && callback();
            })
        })
        CT.$('winningListId').innerHTML = xjDataLog.getUserId();
        CT.$('winningId').innerHTML = xjDataLog.getUserId();
    },
    random:function() {//随机抽取奖品
        var _this=this;
        if (this.canOpen > _this.statusOpen) {//翻牌总次数大于已翻开牌的数量
            _this.statusOpen ++;
            CT.$('remainder').innerHTML = this.canOpen - _this.statusOpen;//剩余次数   获得的总次数-已使用的数量
            if(_this.prized){
                var wzjNum =Math.floor(Math.random() * 3);
                return  { prized:false, id:wzjNum };
            }else if(Math.random() > 0.9 ){//中奖
                _this.prized = true;
                var randomsum = 0;
                for (var i=0; i<this.prizes.length; i++){
                    randomsum += this.prizes[i].prizePercentage || 0;
                }
                var result = Math.random() * randomsum;
                var randomitem = 0;
                for (var i=0; i<this.prizes.length; i++){
                    randomitem += this.prizes[i].prizePercentage || 0;
                    if(this.prizes[i].prizeRemainNum > 0) {//奖品数量大于0，中奖
                        if(randomitem >= result){//比较抽取的奖品属于哪个
                            return  { prized:true, id:i };
                        }
                    }else {
                        return this.random();
                    }
                }
            }else {//未中奖
                var wzjNum =Math.floor(Math.random() * 4);
                return  { prized:false, id:wzjNum };
            }
        }else {
            if(_this.isOrder == 1){
                //跳订购
                CT.goPage();
                orderJs.columnToOrderPage("actiFuniu");
            }else {
                //显示抽奖次数已用完
                CT.$('regret').style.visibility = 'visible'
                PAGE.changeFocus("hands_x0_y0_regretConfirm_");
            }
        }
    },
    open:function(i){//点击翻牌开奖
        var _this = this;
        _this.cardsIndex = i
        _this.cards[i].open();
    },
    cardsFocus:function(){//翻开牌的焦点定位
        var _this = this;
        PAGE.changeFocus("hands_x0_y0_flopSelect" + _this.cardsIndex + "_");
    },
    save:function() { //将游戏的状态存储到服务器
        var _this = this;
        var userData = {
            statusOpen:_this.statusOpen,
            date: _this.createTime //翻牌时间
        };
        actiObj.setUserDataList(JSON.stringify(userData));
        //JSON.stringify(data);
    },
    restore:function() { //从服务器存储的数据中还原游戏的状态
        var _this = this;
        //鉴权: 设置canOpen;
        orderJs.columnGetAuth(function (data) {
            if(data == '0'){
                _this.isOrder = 0;
                _this.canOpen = 3;
            }else {
                _this.isOrder = 1;
                _this.canOpen = 1;
            }
            actiObj.getUserDataList(function(data) {
                if(data.successFlg != 0){
                    if(data.data != ""){
                        var userData = JSON.parse(data.data.userActiData);
                        if (userData.date === _this.createTime) {
                            _this.statusOpen = userData.statusOpen || 0;
                        }
                    }
                }
                CT.$('remainder').innerHTML = _this.canOpen - _this.statusOpen;//剩余次数   获得的总次数-已使用的数量
            })
            actiObj.getUserPrizeInfo(function (data) {
                if(data.successFlg != 0){
                    if (data && data.data[0] && data.data[0].prizeCname){//设置this.prized = true;为已中奖
                        _this.prized = true;
                    }
                }

            })

        });
        /* _this.canOpen = 3;*/

    },
    JumpIP:function (IP) {//跳卡通
        var cartoonId = 0;
        if(IP == "0"){//奥特曼
            cartoonId = 1495; //江苏有线 1495 苏州3042
        }else if(IP == "1"){//超级飞侠
            cartoonId = 1546;//江苏有线 1546 苏州2625
        }else if(IP == "2"){//萌鸡
            cartoonId = 1604;//江苏有线 1604 苏州3232
        }else if(IP == "3"){//宇宙护卫队
            cartoonId = 7362;//江苏有线 7362 苏州2937
        }
        PAGE.otherPageParam = window.location.search.substring(1);
        CT.goPage();
        var commpageId = 3;
        var cartoonData={recommendDisplayType:1,recommendDisplayValue:cartoonId,commpageId:commpageId};
        CT.toAnterRecommendUrl(cartoonData);
    }
}

var game = new Game();
game.init(function () {
    game.restore();
});

//中奖名单
function prizeList() {
    actiObj.getPrizeUserInfo(function (data) {
        var rankList = CT.$('rankList');
        var rankHTML = "";
        var userId = "";
        if(data && data.successFlg == "1" && data.data.records){
            var rankListArr = data.data.records || [];
            if(rankListArr.length > 0){
                for(var i = 0; i < rankListArr.length; i++){
                    userId = rankListArr[i].userId+"";
                    userId = userId.substr(0,4) + "****" + userId.substr(userId.length-4);
                    rankHTML += "<div style=\"height: 30px\"><span style=\"float: left\">"+ userId +"</span><span style=\"float: right\">"+ rankListArr[i].prizeCname +"</span></div>"
                }
                rankList.innerHTML = rankHTML;

                var con = document.getElementById('rankscro');
                var containerHeight = con.offsetHeight;
                var contentHeight = con.scrollHeight;
                if (containerHeight < contentHeight) {
                    con.innerHTML += con.innerHTML;
                    var setTime = setInterval(function () {
                        con.scrollTop += 10;
                        if (con.scrollTop > contentHeight) {
                            con.scrollTop -= contentHeight;
                        }
                    }, 200);
                }
            }
        }

    })



}
prizeList();



//规则
function rule() {
    CT.$('rulePic').style.visibility = 'visible';
}
/*中奖名单*/
function winning() {
    CT.$('winningList').style.visibility = 'visible';
    PAGE.changeFocus("hands_x0_y0_telInputFocus_");
    newPhone = CT.$('telInput').innerHTML;
    CT.$('telInputText').innerHTML = newPhone;
}
/*更多精彩*/
function MoreIP() {
    CT.BackPortalMainPage();
}
//按返回键返回
function backFunc() {
    if(CT.$('rulePic').style.visibility == 'visible'){
        CT.$('rulePic').style.visibility = 'hidden'
        PAGE.changeFocus("hands_x0_y0_ruleBtn_");
    }else if(CT.$('hands_x0_y0_nowinningBox_').style.visibility == 'visible'){
        CT.$('hands_x0_y0_nowinningBox_').style.visibility = 'hidden'
        game.cardsFocus();
    }else if(CT.$('hands_x0_y0_winningBox_').style.visibility == 'visible'){
        CT.$('hands_x0_y0_winningBox_').style.visibility = 'hidden'
        game.cardsFocus();
    }else if(CT.$('winningList').style.visibility == 'visible'){
        CT.$('winningList').style.visibility = 'hidden'
        PAGE.changeFocus("hands_x0_y0_winningBtn_");
    }else if(CT.$('regret').style.visibility == 'visible'){
        CT.$('regret').style.visibility = 'hidden'
        game.cardsFocus();
    }else {
        CT.backPage();
    }
}
/*重写K3-4方法*/
CT.changeNum = function (num) {

}
