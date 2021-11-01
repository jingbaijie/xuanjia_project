
var commonPageInfo = basePageInfo.commonPageInfo;
var parentObj = {
    //默认焦点
    defaultFocus: 'hands_x0_y0_DMEJleftceterbutton4_',
    //用户id
    userId: xjDataLog.getUserId(),
    //页面id
    contentId: commonPageInfo.pageInfo.commonPageId || 1,
    numInputArr: [],
    newpwdArr: [],
    userLock: "", //家长锁
    customArr: [], //全部家长定制类型
    screenedArr: [], //剔除首页后的类型
    customNumArr: [], //家长定制类型数量
    userCustomArr: [], //用户定制类型
    canWatch: false, //是否开启禁止时间段
    forbiddenTime: "", //用户当前设置的时间段
    timeArr: [],
    nopwdSign: false,
    //初始化焦点
    offOrOnImg: "",
    offImg: "",
    onImg: "",
    laseF: "", //上一个焦点  时间段设置背景
    verifySign: false, //密码验证标识
    unlock: false, //已解锁
    pageIndex: 1,
    selectInvariable:0,
    passwordData: commonPageInfo.recommend_6,
    invariableFormulaArr:[
        ["3×12-6","30"],
        ["2×15+5","35"],
        ["5×12+3","63"],
        ["4×13-2","50"],
        ["25÷5+3","8"],
        ["36÷6+4","10"],
    ],

    init: function () {
        var _this = this;
        buttons.push({
            id: "hands_x0_y0_custom_",
            //暂时屏蔽家长中心其他功能
            // enFocus: false,
            up: "disable",
            left: _this.defaultFocus,
            rightEvent: "javascript:parentObj.showPanel('limittime_panel')",
            down: "hands_x0_y0_DMEJclassic0_",
            downEvent: "javascript:parentObj.panelDown('custom')",
            focusType: 7
        }, {
            id: "hands_x0_y0_limittime_",
            //暂时屏蔽家长中心其他功能
            // enFocus: false,
            up: "disable",
            leftEvent: "javascript:parentObj.showPanel('custom_panel')",
            rightEvent: "javascript:parentObj.showPanel('lock_panel')",
            down: "hands_x0_y0_DMEJtime0_",
            downEvent: "javascript:parentObj.panelDown('limittime')",
            focusType: 7
        }, {
            id: "hands_x0_y0_lock_",
            //暂时屏蔽家长中心其他功能
            // enFocus: false,
            up: "disable",
            leftEvent: "javascript:parentObj.showPanel('limittime_panel')",
            rightEvent: "javascript:parentObj.showPanel('report_panel')",
            // down: "hands_x0_y0_num0_",
            downEvent: "javascript:parentObj.panelDown('lock')",
            focusType: 7
        }, {
            id: "hands_x0_y0_report_",
            //暂时屏蔽家长中心其他功能
            // enFocus: false,
            up: "disable",
            leftEvent: "javascript:parentObj.showPanel('lock_panel')",
            right: "disable",
            down: "disable",
            downEvent: "javascript:parentObj.panelDown('report')",
            focusType: 7
        });
        buttons.push({
            clickHandler: "javascript:parentObj.showPanel('custom_panel')",
            id: "hands_x0_y0_timerBar_",
            up: "hands_x0_y0_limittime_",
            left: "disable",
            right: "disable",
            down: "disable",
            focusType: 7
        });

        buttons.push({
            clickHandler: "javascript:parentObj.inputKeys(1)",
            id: "hands_x0_y0_num0_",
            // up: "hands_x0_y0_lock_",
            upEvent: "javascript:parentObj.toTopParent()",
            leftEvent: "javascript:parentObj.toDefaultFocus()",
            // left: "disable",
            //暂时屏蔽家长中心其他功能
            // up: "disable",
            // left: _this.defaultFocus,
            right: "hands_x0_y0_num1_",
            down: "hands_x0_y0_num3_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(2)",
            id: "hands_x0_y0_num1_",
            upEvent: "javascript:parentObj.toTopParent()",
            // up: "hands_x0_y0_lock_",
            //暂时屏蔽家长中心其他功能
            // up: "disable",
            left: "hands_x0_y0_num0_",
            right: "hands_x0_y0_num2_",
            down: "hands_x0_y0_num4_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(3)",
            id: "hands_x0_y0_num2_",
            upEvent: "javascript:parentObj.toTopParent()",
            // up: "hands_x0_y0_lock_",
            //暂时屏蔽家长中心其他功能
            // up: "disable",
            left: "hands_x0_y0_num1_",
            right: "disable",
            down: "hands_x0_y0_num5_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(4)",
            id: "hands_x0_y0_num3_",
            up: "hands_x0_y0_num0_",
            left: "disable",
            //暂时屏蔽家长中心其他功能
            // left: _this.defaultFocus,
            right: "hands_x0_y0_num4_",
            down: "hands_x0_y0_num6_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(5)",
            id: "hands_x0_y0_num4_",
            up: "hands_x0_y0_num1_",
            left: "hands_x0_y0_num3_",
            right: "hands_x0_y0_num5_",
            down: "hands_x0_y0_num7_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(6)",
            id: "hands_x0_y0_num5_",
            up: "hands_x0_y0_num2_",
            left: "hands_x0_y0_num4_",
            right: "disable",
            down: "hands_x0_y0_num8_",
            focusType: 7

        }, {
            clickHandler: "javascript:parentObj.inputKeys(7)",
            id: "hands_x0_y0_num6_",
            up: "hands_x0_y0_num3_",
            left: "disable",
            //暂时屏蔽家长中心其他功能
            // left: _this.defaultFocus,
            right: "hands_x0_y0_num7_",
            down: "hands_x0_y0_num9_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(8)",
            id: "hands_x0_y0_num7_",
            up: "hands_x0_y0_num4_",
            left: "hands_x0_y0_num6_",
            right: "hands_x0_y0_num8_",
            down: "hands_x0_y0_num10_",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(9)",
            id: "hands_x0_y0_num8_",
            up: "hands_x0_y0_num5_",
            left: "hands_x0_y0_num7_",
            right: "disable",
            down: "hands_x0_y0_num11_",
            focusType: 7

        }, {
            clickHandler: "javascript:parentObj.inputKeys(true)",
            id: "hands_x0_y0_num9_",
            up: "hands_x0_y0_num6_",
            //left: "disable",
            //暂时屏蔽家长中心其他功能
            // left: _this.defaultFocus,
            left:"disable",
            right: "hands_x0_y0_num10_",
            downEvent:"javascript:parentObj.toFogotButton()",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(0)",
            id: "hands_x0_y0_num10_",
            up: "hands_x0_y0_num7_",
            left: "hands_x0_y0_num9_",
            right: "hands_x0_y0_num11_",
            downEvent:"javascript:parentObj.toFogotButton()",
            focusType: 7
        }, {
            clickHandler: "javascript:parentObj.inputKeys(false)",
            id: "hands_x0_y0_num11_",
            up: "hands_x0_y0_num8_",
            left: "hands_x0_y0_num10_",
            right: "disable",
            downEvent:"javascript:parentObj.toFogotButton()",
            focusType: 7
        });
        _this.offImg = commonPageInfo.recommend_2[0].recommendLabelpic.picPath;
        _this.onImg = commonPageInfo.recommend_2[0].recommendPic.picPath;
        _this.timeArr = commonPageInfo.recommend_3;
        _this.customArr = commonPageInfo.pageInfo.commonPageInfo.recommend_2;
        _this.findUserForbiddenTime();
        _this.limitDiv();
        _this.findParent();
        _this.createPasswordDom();
        _this.findUserForbiddenTime();
        _this.tipDiv();
        _this.customDiv(function () {
            //时间定制背景图
            !CT.$("lockbg").style.backgroundImage && (CT.$("lockbg").style.backgroundImage = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_4[0].recommendPic.picPath + "')");
            var num = [];
            num = Array.prototype.slice.call(document.getElementsByClassName("num"));
            num.forEach(function (item) {
                CT.$(item.id).style.backgroundImage = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_4[0].recommendLabelpic.picPath + "')";
            })
            var numInput = [];
            numInput = Array.prototype.slice.call(document.getElementsByClassName("numInput"));
            numInput.forEach(function (item) {
                CT.$(item.id).style.backgroundImage = "url('" + AjaxConfig.imgUrl + commonPageInfo.recommend_4[0].recommendFocuspic.picPath + "')";
            })

            PAGE.focusInit();
            _this.toParent();
            PAGE.changeFocus(_this.defaultFocus);
            CT.$("lock").style.visibility = "visible";
            //产生随机算数
            _this.produceExpression();
            _this.orderToForgotPage();
        });
    },
    orderToForgotPage: function () {
        var _this = this;
        if( CT.requestValue("defaultFocus") && CT.requestValue("defaultFocus") == "hands_x0_y0_forgotPwdOrder_") {
            if(_this.nopwdSign) {
                return
            }
            _this.lockShowV();
        }
    },
    //随机生成验证码表达式中的随机数，向上取整
    randomNum: function (startNum, endNum) {
        startNum = startNum || 0;
        endNum = endNum || 0;
        return Math.ceil(Math.random() * (endNum - startNum) + startNum);
    },
    createPasswordDom: function(){
        var _this = parentObj;
        if(!_this.nopwdSign){
            //忘记密码
            CT.$("lockbg").appendChild(CT.createDom({
                domTag: 'div',
                domAttribute: {
                    id: "hands_x0_y0_forgotPw_",
                    innerHTML:"<img src='"+ AjaxConfig.imgUrl + _this.passwordData[5].recommendPic.picPath +"' style='position:absolute;' />" +
                        "<img id='forgotPw' src='"+ AjaxConfig.imgUrl + _this.passwordData[5].recommendLabelpic.picPath +"' style='position:absolute;visibility:hidden;' />"
                },
                cssStyle:{
                    cssText:"position:absolute;top:369px;left:324px;"
                }
            }))
            buttons.push({
                id: "hands_x0_y0_forgotPw_",
                clickHandler: "javascript:parentObj.lockShowV(1)",
                up: "hands_x0_y0_num10_",
                left: "hands_x0_y0_num9_",
                right: "hands_x0_y0_num11_",
                down: "disable",
                focusType: 7
            })
        }
        
        //修改界面
        var panelDom = CT.$("lock_panel");
        panelDom.appendChild(CT.createDom({
            domTag: 'div',
            domAttribute: {
                id: "hands_x0_y0_updatePwButton_",
                innerHTML:"<img src='"+ AjaxConfig.imgUrl + _this.passwordData[3].recommendPic.picPath +"' style='position:absolute;' />" +
                    "<img id='updatePwButton' src='"+ AjaxConfig.imgUrl + _this.passwordData[3].recommendLabelpic.picPath +"' style='position:absolute;visibility:hidden;' />"
            },
            cssStyle:{
                cssText:"position:absolute;top:80px;left:175px;visibility:hidden;"
            }
        }))
        buttons.push({
            id: "hands_x0_y0_updatePwButton_",
            clickHandler: "javascript:parentObj.updatePwWindow()",
            up: "hands_x0_y0_lock_",
            left: "disable",
            right: "hands_x0_y0_clearPwButton_",
            down: "disable",
            focusType: 7
        })
        panelDom.appendChild(CT.createDom({
            domTag: 'div',
            domAttribute: {
                id: "hands_x0_y0_clearPwButton_",
                innerHTML:"<img src='"+ AjaxConfig.imgUrl + _this.passwordData[4].recommendPic.picPath +"' style='position:absolute;' />" +
                    "<img id='clearPwButton' src='"+ AjaxConfig.imgUrl + _this.passwordData[4].recommendLabelpic.picPath +"' style='position:absolute;visibility:hidden;' />"
            },
            cssStyle:{
                cssText:"position:absolute;top:80px;left:460px;visibility:hidden;"
            }
        }))
        buttons.push({
            id: "hands_x0_y0_clearPwButton_",
            clickHandler: "javascript:parentObj.confirmOperation(1)",
            up: "hands_x0_y0_lock_",
            left: "hands_x0_y0_updatePwButton_",
            right: "disable",
            down: "disable",
            focusType: 7
        })
        //取消确认
        panelDom.appendChild(CT.createDom({
            domTag: 'img',
            domAttribute: {
                id: "isConfirmClear",
                src:AjaxConfig.imgUrl + _this.passwordData[0].recommendPic.picPath    
            },
            cssStyle:{
                cssText:"position:absolute;top:50px;left:215px;visibility:hidden;"
            }
        }))
        panelDom.appendChild(CT.createDom({
            domTag: 'div',
            domAttribute: {
                id: "hands_x0_y0_confirmClearPw_",
                innerHTML:"<img src='"+ AjaxConfig.imgUrl + _this.passwordData[1].recommendPic.picPath +"' style='position:absolute;' />" +
                    "<img id='confirmClearPw' src='"+ AjaxConfig.imgUrl + _this.passwordData[1].recommendLabelpic.picPath +"' style='position:absolute;visibility:hidden;' />"
            },
            cssStyle:{
                cssText:"position:absolute;top:233px;left:250px;visibility:hidden;"
            }
        }))
        buttons.push({
            id: "hands_x0_y0_confirmClearPw_",
            clickHandler: "javascript:parentObj.clearPwd()",
            up: "disable",
            left: "disable",
            right: "hands_x0_y0_cancelClearPw_",
            down: "disable",
            focusType: 7
        })
        panelDom.appendChild(CT.createDom({
            domTag: 'div',
            domAttribute: {
                id: "hands_x0_y0_cancelClearPw_",
                innerHTML:"<img src='"+ AjaxConfig.imgUrl + _this.passwordData[2].recommendPic.picPath +"' style='position:absolute;' />" +
                    "<img id='cancelClearPw' src='"+ AjaxConfig.imgUrl + _this.passwordData[2].recommendLabelpic.picPath +"' style='position:absolute;visibility:hidden;' />"
            },
            cssStyle:{
                cssText:"position:absolute;top:233px;left:430px;visibility:hidden;"
            }
        }))
        buttons.push({
            id: "hands_x0_y0_cancelClearPw_",
            clickHandler: "javascript:parentObj.confirmOperation(0)",
            up: "disable",
            left: "hands_x0_y0_confirmClearPw_",
            right: "disable",
            down: "disable",
            focusType: 7
        })
    },
    toDefaultFocus:function(){
        var _this = this;
        if(CT.$("pwd").style.visibility == 'hidden' || _this.unlock){
            return
        }
        PAGE.changeFocus(this.defaultFocus);
    },
    toTopParent:function(){
        if(this.verifySign){
            return
        }
        PAGE.changeFocus("hands_x0_y0_lock_");
    },
    toFogotButton:function(){
        if (this.nopwdSign || CT.$("pwd").style.visibility == 'hidden' || this.verifySign) {
            return
        }
        PAGE.changeFocus("hands_x0_y0_forgotPw_");
    },
    /*
    生成算是表达式
    */
    produceExpression: function () {
        var _this = this;
        //固定算式开始
        this.selectInvariable = parseInt(Math.random()*6);
        CT.$("operator").innerHTML = this.invariableFormulaArr[this.selectInvariable][0];
        //第一位和第二位数字
        // var NowFormulaArr = invariableFormulaArr[_this.randomNum(0.1, 5) - 1];
        // CT.$("firstNum").innerHTML = NowFormulaArr[0];
        // CT.$("secondNum").innerHTML = NowFormulaArr[2];
        //运算符
        // CT.$("operator").innerHTML = NowFormulaArr[1]; //computeChar;
    },
    clearAnswer: function () {
        var _this = this;
        CT.$("answerShow").innerHTML = "";
    },
    clearNum: function () {
        var _this = this;
        CT.$("numInput0").innerHTML = "";
        CT.$("numInput1").innerHTML = "";
        CT.$("numInput2").innerHTML = "";
        CT.$("numInput3").innerHTML = "";
    },
    /**
     * 定制化弹框
     * @param msg
     * @param args
     * @example
     *  CT.alertTip("我在干嘛！",{
     *
     *  })
     *
     *
     */
    alertTip: function (msg, args) { //提示信息
        var _this = this;
        args = args || {};
        var str = "";
        args.time = args.time || 1000;
        args.fontSize = args.fontSize || "30px";
        args.color = args.color || "red";
        args.background = args.background || "#ddd";
        if (CT.$('alertTip')) {
            return;
        };
        for (var key in args) {
            str += key + ":" + args[key] + ";";
        }
        var elm = document.createElement("div");
        elm.style.cssText = "position:absolute;top:515px;left:726px;padding:20px;text-align:center;font-weight:bold; -webkit-border-radius:10px;border-radius: 10px;" + str;
        elm.id = "alertTip";
        elm.innerHTML = msg;
        document.body.appendChild(elm);
        setTimeout(function () {
            elm.parentNode.removeChild(elm);
        }, args.time)
    },
    /**
    * 判断是否解锁
    */
    toParent: function () {
        var _this = this;
        if (_this.unlock) {
            parentObj.showPanel('limittime_panel');
            CT.$("lock").style.visibility = "hidden";
        } else {
            if(CT.$("hands_x0_y0_updatePwButton_").style.visibility === "visible"){
                PAGE.changeFocus("hands_x0_y0_updatePwButton_");
            } else {
                this.clear();
                CT.$("lock_panel").style.visibility = 'visible';
                PAGE.changeFocus("hands_x0_y0_num0_");
            } 
        }
    },

    inputKeys: function (key) {
        var _this = this;
        var answer = "";
        if (CT.$("pwd").style.visibility == 'hidden') { //验算
            if (typeof key == 'number' && CT.$("answerShow").innerText.length < 2) {
                CT.$("answerShow").innerText += key;
                if(CT.$("answerShow").innerText.length === 2){
                    PAGE.changeFocus("hands_x0_y0_num11_");
                }
            } else {
                if (key) {
                    CT.$("answerShow").innerText = "";
                } else {
                    this.verifyAnswer();
                    CT.$("lock").style.visibility = 'visible';
                    _this.unlock = true;
                }
            }
        } else {
            if(_this.verifySign){
                if (_this.newpwdArr.length < 4) {
                    if (typeof key == 'number') {
                        _this.newpwdArr.push(key);
                    } else if (key === true) {
                        CT.$("numInput" + (_this.newpwdArr.length - 1)).innerText = "";
                        _this.newpwdArr.pop();
                    }
                } else {
                    if (key === false) {
                        _this.updatePwd(); //更新密码
                    }
                }
                for (var i = 0; i < _this.newpwdArr.length; i++) {
                    CT.$("numInput" + i).innerText = _this.newpwdArr[i];
                }
                if (key !== true && _this.newpwdArr.length === 4) {
                    PAGE.changeFocus("hands_x0_y0_num11_");
                }
            
        
        //输入密码
        // if (typeof key == 'number' && _this.verifySign == false) {
        //     if (_this.numInputArr.length >= 4) {
        //         return
        //     }
        //     _this.numInputArr.push(key)
        //     answer = key;
        //     for (var i = 0; i < _this.numInputArr.length; i++) {
        //         CT.$("numInput" + i).innerText = _this.numInputArr[i];
        //     }
        //     //输入新密码
        // } else if (_this.verifySign) {
        //设置密码
            } else {
                if(typeof key == 'number'){
                    if (_this.numInputArr.length >= 4) {
                        return
                    }
                    _this.numInputArr.push(key)
                    answer = key;
                    for (var i = 0; i < _this.numInputArr.length; i++) {
                        CT.$("numInput" + i).innerText = _this.numInputArr[i];
                    }
                    if (key !== true && _this.numInputArr.length === 4) {
                        PAGE.changeFocus("hands_x0_y0_num11_");
                    }
                } else {
                    if (key) {
                        CT.$("numInput" + (_this.numInputArr.length - 1)).innerText = "";
                        CT.$("answerShow").innerText = "";
                        _this.numInputArr.pop();
                    } else {
                        _this.verifyAnswer(); //验证答案  验证密码  设置密码
                    }
                }
            }
        }
    },
    updatePwWindow: function(){
        CT.$("pwd").style.visibility = 'inherit';
        CT.$("calc").style.visibility = 'hidden';
        CT.$("hands_x0_y0_updatePwButton_").style.visibility = "hidden";
        CT.$("hands_x0_y0_clearPwButton_").style.visibility = "hidden";
        CT.$("lockbg").style.visibility = 'visible';
        this.verifySign = true;
        CT.$("lockTxt").innerHTML = "请输入新密码";
        this.clearNum();
        PAGE.changeFocus("hands_x0_y0_num0_");
    },
    //验证答案
    verifyAnswer: function () {
        var _this = this;
        if (CT.$("pwd").style.visibility == 'hidden') {
            if (this.invariableFormulaArr[this.selectInvariable][1] === CT.$("answerShow").innerHTML) {
                _this.passOperation(1);
                PAGE.changeFocus('hands_x0_y0_updatePwButton_');
            } else {
                //刷新验证表达式
                _this.produceExpression();
                _this.clearAnswer();
                _this.alertTip("答案错误，请重新输入！");
                // PAGE.changeFocus('hands_x0_y0_num0_');
            }
        } else {
            _this.nopwd(_this.numInputArr.toString().replace(/,/g, ''));
        }
    },
    lockShowV: function () {
        var _this = this;
        CT.$("lockTxt").innerHTML = "验证可重置密码";
        CT.$("hands_x0_y0_forgotPw_").style.visibility = "hidden";
        CT.$("pwd").style.visibility = 'hidden';
        CT.$("calc").style.visibility = 'visible';
        CT.$("lock").style.visibility = 'hidden';
        _this.clearNum();
        //暂时屏蔽家长中心其他功能
        // PAGE.changeFocus("hands_x0_y0_num0_");
        // CT.$("calc").style.visibility = 'visible';
        if (_this.unlock) {
            _this.showPanel("custom_panel");
            // CT.$("lockbg").style.visibility = 'hidden';
            // CT.$("calc").style.visibility = 'hidden';
        } else {
            PAGE.changeFocus('hands_x0_y0_num0_')
        }
    },
    confirmOperation: function(action){
        var confirmClearImg = CT.$("isConfirmClear");
        var confirmDom = CT.$("hands_x0_y0_confirmClearPw_");
        var cancelDom = CT.$("hands_x0_y0_cancelClearPw_");
        if(action){
            confirmClearImg.style.visibility = "visible";
            confirmDom.style.visibility = "visible";
            cancelDom.style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_confirmClearPw_");
        } else {
            confirmClearImg.style.visibility = "hidden";
            confirmDom.style.visibility = "hidden";
            cancelDom.style.visibility = "hidden";
            PAGE.changeFocus("hands_x0_y0_clearPwButton_");
        }
    },
    passOperation: function(action){
        var updateDom = CT.$("hands_x0_y0_updatePwButton_");
        var clearDom = CT.$("hands_x0_y0_clearPwButton_");
        if(action){
            updateDom.style.visibility = "visible";
            clearDom.style.visibility = "visible";
            CT.$("calc").style.visibility = 'hidden';
            CT.$("lockbg").style.visibility = 'hidden';
            CT.$("pwd").style.visibility = 'hidden';
            // PAGE.changeFocus("hands_x0_y0_updatePwButton_");
        } else {
            updateDom.style.visibility = "hidden";
            clearDom.style.visibility = "hidden";
            CT.$("calc").style.visibility = 'visible';
            CT.$("lockbg").style.visibility = 'visible';
            CT.$("pwd").style.visibility = 'visible';
        }
    },
    /**
     * 初始设置密码
     */
    nopwd: function (pwd) {
        var _this = this;
        if (_this.nopwdSign) { //新增用户密码
            interface.insertUserLock({ userId: _this.userId, content: pwd }, function (res) {
                if (res.errorCode == "1000") {
                    _this.alertTip('设置密码成功');
                    _this.unlock = true;
                    _this.lockShowV();
                }
            });
        } else { //验证用户密码
            if (pwd == _this.userLock) {
                _this.alertTip("密码正确")
                _this.unlock = true;
                //_this.toParent();
                _this.lockShowV();
            } else {
                _this.alertTip("密码错误")
                _this.clearNum();
                PAGE.changeFocus("hands_x0_y0_num0_");
            }
            _this.numInputArr = [];
        }
    },
    clearPwd :function(){
        var _this = this; 
        interface.clearUserLock({params:{ userId: _this.userId}}, function (res) {
            if (res.errorCode == "1000") {
                _this.alertTip('密码取消成功');
                setTimeout(function(){
                    window.location.reload();
                },1000)
            }
        });
    },
    updatePwd: function () {
        var _this = this;
        var pwd = _this.newpwdArr.toString().replace(/,/g, '');
        interface.updateUserLock({ userId: _this.userId, content: pwd }, function (res) {
            if (res.errorCode == "1000") {
                _this.alertTip('密码更新成功');
                _this.verifySign = false;
                _this.newpwdArr = [];
                _this.lockShowV();
                //刷新验证表达式
                _this.produceExpression();
                _this.clearAnswer();
                CT.$("pwd").style.visibility = 'hidden';
                CT.$("lockbg").style.visibility = 'hidden';
                CT.$("calc").style.visibility = 'hidden';
                // _this.clear();
                _this.unlock = false;
                setTimeout(function(){
                    window.location.reload();
                },500)
            }
        });
    },

    /**
     * 获取家长锁
     * @param {*}  
     */
    findParent: function () {
        var _this = this;
        interface.findUserLockById({ contentId: _this.userId }, function (res) {
            if(res.data) {
                var lockMessage = res.data.lockMessage;
                if (lockMessage.length > 4) {
                    lockMessage = lockMessage.slice(0, 4);
                }
                _this.userLock = lockMessage
            }
            if (res.errorCode == "1007") {
                _this.nopwdSign = true;
                CT.$("lockTxt").innerHTML = "请设置密码";
                _this.alertTip('请设置密码');
            }
        })
    },
    /**
     * 查询禁止观看时间段
     */
    findUserForbiddenTime: function (choseThemeObj) {
        var _this = this;
        //当前背景替换

        interface.findUserForbiddenTime({ params: { userId: _this.userId }, ajaxConfig: { async: true } }, function (res) {
            _this.canWatch = res.data.canWatch;
            _this.forbiddenTime = res.data.forbiddenTime;
            var val = null;
            for (var i = 0; i < _this.timeArr.length - 1; i++) {
                val = CT.$("timeHtml" + i).innerHTML;
                if (val == _this.forbiddenTime) {
                    //当前设置时间段
                    if (_this.timeArr[i].recommendFocuspic != null) {
                        CT.$("hands_x0_y0_DMEJtime" + i + '_').style.backgroundImage = "url('" + AjaxConfig.imgUrl + _this.timeArr[i].recommendLabelpic.picPath + "')";
                    } else {
                        CT.$("hands_x0_y0_DMEJtime" + i + '_').style.backgroundImage = "url('../image/locktimeFocus.png')";
                    }
                }
            }
        });
    },
    limitDiv: function () {
        var _this = this;
        var timeHtml = ""
        for (var i = 0; i < _this.timeArr.length - 1; i++) {

            // timeHtml = "";
            timeHtml = "<div id='hands_x0_y0_DMEJtime" + i + "_' class='lockT' style='float:left;margin: 20px 20px; width:190px; height:60px;background:url(" + AjaxConfig.imgUrl + _this.timeArr[i].recommendPic.picPath + ") no-repeat;'>" +
                "<div id='DMEJtime" + i + "'  style='width:190px;height:60px;visibility: hidden; background: url(" + AjaxConfig.imgUrl + _this.timeArr[i].recommendFocuspic.picPath + ") no-repeat;'>" +
                "</div>" +
                "<div id='timeHtml" + i + "'  style='margin-top: -45px; width:190px;text-align: center;color: #FFF;font-size: 24px;'>" + _this.timeArr[i].more1 + "</div>" +
                "</div>"

            //创建按钮
            var step = 2;
            var button = {
                id: 'hands_x0_y0_DMEJtime' + i + '_',
                clickHandler: 'javascript:parentObj.changeTime()',
                right: 'hands_x0_y0_DMEJtime' + Number(i + 1) + '_',
                left: 'hands_x0_y0_DMEJtime' + Number(i - 1) + '_',
                up: 'hands_x0_y0_DMEJtime' + Number(i - step) + '_',
                down: 'hands_x0_y0_DMEJtime' + Number(i + step) + '_',
                focusType: 7,
                TempData: _this.timeArr[i]
            };
            if (i < 2) {
                button.up = "hands_x0_y0_limittime_";
            }
            if (i == 4 || i == 5) {
                button.down = "disable"
            }
            if (i % 2 == 0) {
                button.left = "disable"
            }
            if (i == _this.timeArr.length - 2) {
                button.right = "disable"
            }
            CT.$("limit").innerHTML += timeHtml;
            buttons.push(button);
        }
    },

    tipDiv: function () {
        var _this = this;
        var tipHtml = "";
        tipHtml = " <div style='margin: 0 auto; width:1000px;height:559px; background:  url(" + AjaxConfig.imgUrl + commonPageInfo.recommend_5[0].recommendPic.picPath + ") no-repeat;'></div>"
        CT.$("report_panel").innerHTML = tipHtml;
    },
    customDiv: function (callBack) {
        var _this = this;
        var customHtml = "";
        //当前设置的
        interface.getCurUserNavItem({ userId: _this.userId }, function (res) {
            _this.userCustomArr = res.data;
            //过滤首页免费等导航
            _this.customArr.forEach(function (item) {
                var navMustExistRankIdArr = ajaxConf.navMustExistRankIdArr|| [1, 6, 7];
                if (navMustExistRankIdArr.indexOf(parseInt(item.rankId)) == -1) {
                    _this.screenedArr.push(item);
                }
                // if ('[1, 6, 7]'.indexOf(item.rankId) == -1) {
                //     _this.screenedArr.push(item)
                // }
            })
            //取两个数组相同的
            var newArr = [];
            for (var i = 0; i < _this.screenedArr.length; i++) {
                if (_this.userCustomArr != null) {
                    for (var j = 0; j < _this.userCustomArr.length; j++) {
                        if (Number(_this.userCustomArr[j]) == _this.screenedArr[i].rankId) {
                            newArr.push(_this.screenedArr[i].rankId);
                            break;
                        }
                    }
                }
            }
            for (var i = 0; i < _this.screenedArr.length; i++) {
                if (newArr.length != 0) {
                    if (newArr.indexOf(_this.screenedArr[i].rankId) != -1) {
                        _this.offOrOnImg = _this.onImg;
                        _this.screenedArr[i].state = 1;
                    } else {
                        _this.offOrOnImg = _this.offImg;
                        _this.screenedArr[i].state = 0;
                    }
                } else {
                    _this.offOrOnImg = _this.offImg;

                }
                customHtml = "";
                customHtml = "<div id='hands_x0_y0_DMEJclassic" + i + "_' style='margin-left: 50px;margin-top: 80px;float: left;;width: 134px;height:134px;background: " +
                    "url(" + AjaxConfig.imgUrl + ((_this.screenedArr.length == 0) ? "/pic/category/20200304/20200304101556674_ypzyu.png" : _this.screenedArr[i].recommendPic.picPath) + ") no-repeat;'>" +
                    "<div id='DMEJclassic" + i + "' style='background: url(" + AjaxConfig.imgUrl + ((_this.screenedArr && _this.screenedArr.constructor === Array && _this.screenedArr.length) ? _this.screenedArr[i].recommendFocuspic.picPath : "/pic/category/20200304/20200304101556674_ypzyu.png") + ") no-repeat; ;width: 134px;height:134px;visibility: hidden;'></div>" +
                    "<div style='width: 134px;height:34px;'>" +
                    "<img id='offOrOn" + i + "' src='" + AjaxConfig.imgUrl + _this.offOrOnImg + "' style='margin-left: 10%;' alt=''></div>" +
                    "</div>";
                //创建按钮
                var step = 4;
                var button = {
                    id: 'hands_x0_y0_DMEJclassic' + i + '_',
                    clickHandler: 'javascript:parentObj.changeState()',
                    right: 'hands_x0_y0_DMEJclassic' + Number(i + 1) + '_',
                    left: i % 4 == 0 ? _this.defaultFocus : 'hands_x0_y0_DMEJclassic' + Number(i - 1) + '_',
                    up: 'hands_x0_y0_DMEJclassic' + Number(i - step) + '_',
                    down: 'hands_x0_y0_DMEJclassic' + (Number(i + step) > (_this.screenedArr.length - 1) ? (_this.screenedArr.length - 1) : Number(i + step)) + '_',
                    focusType: 7,
                    TempData: _this.screenedArr[i]
                };
                if (i < 4) {
                    button.up = "hands_x0_y0_custom_";
                }
                if (i == _this.screenedArr.length - 1) {
                    button.right = "disable";
                //    button.down = "disable";
                //}
                //if (i > 0 && i < 4) {
                    button.down = "disable";
                }
                CT.$("cont").innerHTML += customHtml;
                buttons.push(button);
            }
            callBack && callBack();
        })
    },
    changeTime: function () {
        var _this = this;
        var setTime = "";
        setTime = curFocus.TempData.more1;
        interface.updateExtraUserInfo({ params: { userId: _this.userId, forbiddenTime: setTime }, ajaxConfig: { async: false } }, function (res) {
            if (res.errorCode == "1000") {
                _this.alertTip("更改成功")
                var timelist = [];
                timelist = Array.prototype.slice.call(document.getElementsByClassName("lockT"));
                timelist.forEach(function (item) {
                    CT.$(item.id).style.backgroundImage = "url('" + _this.timeArr[0].recommendPic.picPath + "')";
                })
                CT.$(curFocus.FocusID).style.backgroundImage = "url('" + _this.timeArr[0].recommendLabelpic.picPath + "')";
            } else {
                _this.alertTip("更改失败")
            }
        });
    },
    changeState: function () {
        var _this = this;
        var thisRankId = "";
        var thisId = "";
        thisRankId = curFocus.TempData.rankId;
        thisId = curFocus.FocusID;
        //改变开关
        for (var j = 0; j < _this.screenedArr.length; j++) {
            if (_this.screenedArr[j].rankId == thisRankId) {
                //避免ajax请求完成后 j 的值发生变化（为循环完成后的值），将此时的 j 传入闭包函数。
                (function (j) {
                    if (_this.screenedArr[j].state == 1) {
                        //眉头关闭，进行打开开关操作
                        var params = { params: {
                                userId: _this.userId,
                                customId: _this.screenedArr[j].rankId,
                                isShow: true
                            },
                            ajaxConfig: {
                                async: false
                            }
                        }
                        // interface.loggerInfo('控制眉头应用上下架参数：' + CT.jsonToString(params),'post');
                        interface.updateCustomThemeInfo(params, function (res) {
                            // interface.loggerInfo('控制眉头应用上下架结果：' + CT.jsonToString(res),'post');
                            if (res.errorCode == "1000") {
                                _this.alertTip("更改成功")
                                _this.screenedArr[j].state = 0;
                                CT.$("offOrOn" + j).src = '' + AjaxConfig.imgUrl + _this.offImg + '';
                                _this.offOrOnImg = _this.offImg;            
                                //清除node端定制眉头缓存
                                var clearData = {
                                    //必传参数，清除缓存的关键字
                                    keyWord: 'updateCustomThemeInfo',
                                }
                                interface.clearNodeCache(clearData);
                            } else {
                                _this.alertTip("更改失败")
                            }
                        });
                    } else {
                        //眉头开启，进行关闭开关操作
                        interface.updateCustomThemeInfo({ params: { userId: _this.userId, customId: _this.screenedArr[j].rankId, isShow: false }, ajaxConfig: { async: false } }, function (res) {
                            if (res.errorCode == "1000") {
                                _this.alertTip("更改成功");
                                _this.screenedArr[j].state = 1;
                                _this.offOrOnImg = _this.onImg;
                                CT.$("offOrOn" + j).src = '' + AjaxConfig.imgUrl + _this.onImg + '';
                                //清除node端定制眉头缓存
                                var clearData = {
                                    //必传参数，清除缓存的关键字
                                    keyWord: 'updateCustomThemeInfo',
                                }
                                interface.clearNodeCache(clearData);
                            } else {
                                _this.alertTip("更改失败")
                            }
                        });
                    }
                })(j);
                //匹配到当前所改变的眉头ID，跳出循环
                break;
            }
        }
    },
    closeOpen: function (flag) {
        if (curFocus.TempData) {
            CT.$(curFocus.ImgID + flag).src = "../image/关.png"
            curFocus.TempData = false;
        } else {
            CT.$(curFocus.ImgID + flag).src = "../image/开.png"
            curFocus.TempData = true;
        }
    },
    toChildPage: function (index) {
        var _this = this;
        switch (index) {
            case 1:
                CT.commonJumpUrl('./business.html')
                break;
            case 2:
                CT.commonJumpUrl('./history.html?action=history')
                break;
            case 3:
                CT.commonJumpUrl('./history.html?action=favorite')
                break;
            case 4:
                CT.commonJumpUrl('./parent.html')
                break;
        }
    },
    clear: function () {
        try {
            CT.$("custom_panel").style.visibility = 'hidden';
            CT.$("limittime_panel").style.visibility = 'hidden';
            CT.$("lock_panel").style.visibility = 'hidden';
            CT.$("report_panel").style.visibility = 'hidden';
            CT.$("calc").style.visibility = 'hidden';
            CT.$("hands_x0_y0_updatePwButton_").style.visibility = 'hidden';
            CT.$("hands_x0_y0_clearPwButton_").style.visibility = 'hidden';
        } catch (error) {

        }
    },
    showPanel: function (name) {
        var _this = this;
        if (_this.unlock) {
            this.clear();
            CT.$(name).style.visibility = 'visible'
            PAGE.changeFocus("hands_x0_y0_custom_");
            if (name == "custom_panel") {
                PAGE.changeFocus("hands_x0_y0_custom_");
            } else if (name == "limittime_panel") {
                PAGE.changeFocus("hands_x0_y0_limittime_");
            } else if (name == "lock_panel") {
                // if (CT.$('lockTxt').innerHTML != "请输入新密码") {
                //     CT.$("calc").style.visibility = 'visible';
                // }
                PAGE.changeFocus("hands_x0_y0_lock_");
                _this.passOperation(1);
            } else if (name == "report_panel") {
                PAGE.changeFocus("hands_x0_y0_report_");
            }
        } else {
            if (name == "limittime_panel" || name == "report_panel") {
                PAGE.changeFocus("hands_x0_y0_DMEJleftceterbutton4_");
            } else {
                this.clear();
                CT.$("lock_panel").style.visibility = 'visible';
                if (!_this.nopwdSign) {
                    CT.$("calc").style.visibility = 'visible';
                }
                // PAGE.changeFocus(_this.defaultFocus);
                PAGE.changeFocus('hands_x0_y0_num0_');
            }
        }
    },
    panelDown: function (name) {
        // this.clear();
        // CT.$(name + "_panel").style.visibility = 'visible';
        if (name == "custom") {
            PAGE.changeFocus("hands_x0_y0_DMEJclassic0_");
        } else if (name == "limittime") {
            PAGE.changeFocus("hands_x0_y0_DMEJtime0_");
        } else if (name == "lock") {
            if(CT.$("hands_x0_y0_updatePwButton_").style.visibility==="visible"){
                PAGE.changeFocus("hands_x0_y0_updatePwButton_");
            } else {
                PAGE.changeFocus("hands_x0_y0_num0_");
            } 
        } else if (name == "report") { }
        CT.$(name).style.visibility = 'visible';
    }


}
addEvent.on("pageEvent",function(e){

    parentObj.init();
})


//重定义左侧导航按钮向右事件: curBtnIndex：当前焦点下标
generalLeftNavObj.navBtnRighEvent = function (curBtnIndex) {
    parentObj.toParent();
    
    //暂时屏蔽家长中心其他功能
    //PAGE.changeFocus('hands_x0_y0_num0_');
};

/*重定义左侧列表按钮获焦事件，有需要的话放开
generalLeftNavObj.navBtnOtherFocusEventCallBack = function(curBtnIndex) {
    var _this = this;
    var navItemDomList = document.getElementsByClassName('navItem');
    //左侧“家长中心”按钮获焦，隐藏右侧显示指示按钮图
    for (var index = 0; index < navItemDomList.length; index++) {
        navItemDomList[index].style.visibility = 'hidden';
    }
*/
//返回
function backFunc() {
    CT.backPage();
}