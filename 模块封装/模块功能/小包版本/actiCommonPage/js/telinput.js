/**
 * 1、调用方式：actiContact.init("嵌入该模块的DOM元素的id","传入的参数");
 *    示例：actiContact.init("prizeBox",option);
 * 2、参数格式说明
 * var actiContactModuleJson = {
            //非焦点元素展示
            "textShowInfo": {
                //输入框展示信息["textName":元素名称，"textSize":字体大小,"textColor":文字颜色,"textLeft":元素绝对定位的left值,"textTop",元素绝对定位的top值,"textWidth":元素的宽度，"textHeight":元素的高度]
                "telInput": {
                    "textName": "telInput",
                    "textSize": "24px",
                    "textColor": "#333",
                    "textLeft": "405px",
                    "textTop": "632px",
                    "textWidth": "265px",
                    "textHeight": "40px"
                },
                //保存提示信息
                "saveTip": {
                    "textName": "saveTip",
                    "textSize": "24px",
                    "textColor": "#fff",
                    "textLeft": "450px",
                    "textTop": "680px",
                    "textWidth": "",
                    "textHeight": ""
                }
            },
            //按钮显示["btnName":按钮名称，"btnSrc":按钮图片路径,"btnLeft":按钮绝对定位的left值,"btnTop",按钮绝对定位的top值,"btnWidth":按钮的宽度，"btnHeight":按钮的高度]
            "btnShow": {
                //保存按钮
                "saveBtn": {
                    "btnName": "saveBtn",
                    "btnSrc": "",
                    "btnLeft": "",
                    "btnTop": "",
                    "btnWidth": "",
                    "btnHeight": ""
                },
                //清空按钮
                "emptyBtn": {
                    "btnName": "emptyBtn",
                    "btnSrc": "",
                    "btnLeft": "",
                    "btnTop": "",
                    "btnWidth": "",
                    "btnHeight": ""
                }
            },
            //焦点展示信息["focusName":焦点图片名称,"focusLeft":焦点绝对定位的left值,"focusTop":焦点绝对定位的Top值,"focusSrc":焦点图片路径,"clickEvent":点击方法名称,"otherFocusEvent":焦点聚焦事件名称,"otherBlurEvent":焦点失焦事件名称，"up","down","left","right":焦点移动方向]
            "contactFocusInfo": {
                //输入框焦点
                "telInputFocus": {
                    "focusName": "telInputFocus",
                    "focusLeft": "380px",
                    "focusTop": "612px",
                    "focusSrc": "img/inputFocus.png",
                    "clickEvent": "",
                    "otherFocusEvent": "inputFocusEvent()",
                    "otherBlurEvent": "inputBlurEvent()",
                    "up": "disable",
                    "down": "disable",
                    "left": "disable",
                    "right": "saveBtnFocus"
                },
                //保存按钮焦点
                "saveBtnFocus": {
                    "focusName": "saveBtnFocus",
                    "focusLeft": "685px",
                    "focusTop": "612px",
                    "focusSrc": "img/saveFocus.png",
                    "clickEvent": "saveFunc()",
                    "otherFocusEvent": "",
                    "otherBlurEvent": "saveBtnBlur()",
                    "up": "disable",
                    "down": "disable",
                    "left": "telInputFocus",
                    "right": "emptyBtnFocus"
                },
                //清空按钮焦点
                "emptyBtnFocus": {
                    "focusName": "emptyBtnFocus",
                    "focusLeft": "790px",
                    "focusTop": "612px",
                    "focusSrc": "img/saveFocus.png",
                    "clickEvent": "emptyFunc()",
                    "otherFocusEvent": "",
                    "otherBlurEvent": "",
                    "up": "disable",
                    "down": "disable",
                    "left": "saveBtnFocus",
                    "right": "disable"
                }
            }
        }
 */
function actiContactModule(actiContactName) {
    if (!actiContactModule.actiContacts) actiContactModule.actiContacts = [];
    actiContactModule.actiContacts.push(actiContactName);
    //输入框焦点是否聚焦
    this.isOnFocus = false;
    //手机号
    this.phoneNum;
    //保存提示id命名
    this.saveTipName = "saveTip";
    //输入框id命名
    this.telInputName = "telInput";
    /**
     * 页面原始数据初始化，优先使用传入参数，未传入参数，则使用默认参数
     **/
    this.actiContactModuleJson = function (option) {
        var actiContactModuleJson = {
            //非焦点元素展示
            "textShowInfo": {
                //输入框展示信息
                "telInput": {
                    "textName": "telInput",
                    "textSize": "24px",
                    "textColor": "#333",
                    "textLeft": "405px",
                    "textTop": "632px",
                    "textWidth": "265px",
                    "textHeight": "40px"
                },
                //保存提示信息
                "saveTip": {
                    "textName": "saveTip",
                    "textSize": "24px",
                    "textColor": "#fff",
                    "textLeft": "450px",
                    "textTop": "680px",
                    "textWidth": "",
                    "textHeight": ""
                }
            },
            //按钮显示
            "btnShow": {
                "saveBtn": {
                    "btnName": "saveBtn",
                    "btnSrc": "",
                    "btnLeft": "",
                    "btnTop": "",
                    "btnWidth": "",
                    "btnHeight": ""
                },
                "emptyBtn": {
                    "btnName": "emptyBtn",
                    "btnSrc": "",
                    "btnLeft": "",
                    "btnTop": "",
                    "btnWidth": "",
                    "btnHeight": ""
                }
            },
            //焦点展示信息
            "contactFocusInfo": {
                "telInputFocus": {
                    "focusName": "telInputFocus",
                    "focusLeft": "380px",
                    "focusTop": "612px",
                    "focusSrc": "img/inputFocus.png",
                    "clickEvent": "",
                    "otherFocusEvent": "inputFocusEvent()",
                    "otherBlurEvent": "inputBlurEvent()",
                    "up": "disable",
                    "down": "disable",
                    "left": "disable",
                    "right": "saveBtnFocus"
                },
                "saveBtnFocus": {
                    "focusName": "saveBtnFocus",
                    "focusLeft": "685px",
                    "focusTop": "612px",
                    "focusSrc": "img/saveFocus.png",
                    "clickEvent": "saveFunc(afterSavePhone)",
                    "otherFocusEvent": "",
                    "otherBlurEvent": "saveBtnBlur()",
                    "up": "disable",
                    "down": "disable",
                    "left": "telInputFocus",
                    "right": "emptyBtnFocus"
                },
                "emptyBtnFocus": {
                    "focusName": "emptyBtnFocus",
                    "focusLeft": "790px",
                    "focusTop": "612px",
                    "focusSrc": "img/saveFocus.png",
                    "clickEvent": "emptyFunc(afterEmpty)",
                    "otherFocusEvent": "",
                    "otherBlurEvent": "",
                    "up": "disable",
                    "down": "disable",
                    "left": "saveBtnFocus",
                    "right": "disable"
                }
            }
        }
        //将传入参数与默认参数合并
        actiContactModuleJson = this.deepCopy(actiContactModuleJson, option);
        this.saveTipName = actiContactModuleJson.textShowInfo.saveTip.textName;
        this.telInputName = actiContactModuleJson.textShowInfo.telInput.textName;
        return actiContactModuleJson;
    };
    /**
     * 将传入对象与默认对象合并
     */
    this.deepCopy = function (actiContactModuleJson, option) {
        for (var key in option) {
            if (option.hasOwnProperty(key)) {
                if (typeof option[key] == "object" && option[key] != null) {
                    actiContactModuleJson[key] = this.deepCopy(actiContactModuleJson[key], option[key]);//递归复制
                } else {
                    actiContactModuleJson[key] = option[key];
                }
            }
        }
        return actiContactModuleJson;
    };
    /**
     *页面初始化:
     *初始化默认手机号、渲染页面元素、创建焦点数组
     */
    this.init = function (main, option, callback) {
        var _this = this;
        var outerBOX = document.getElementById(main);
		var reg = /^[0-9]+.?[0-9]*$/;//判断是否为数字
        //获取用户信息：userId和手机号 
        actiObj.getUserPhone(function (userInfoData) {
            if (userInfoData && userInfoData.userPhone && reg.test(userInfoData.userPhone)) {                
               _this.phoneNum = userInfoData.userPhone;
            }else {
               _this.phoneNum = "";
            }
            outerBOX.innerHTML += _this.actiContactModuleHTML(_this.actiContactModuleJson(option));
            callback && callback();
        });
    };
    /**
     * 根据配置信息渲染页面
     */
    this.actiContactModuleHTML = function (actiContactModuleJson) {
        //焦点信息数据
        var contactFocusInfo = actiContactModuleJson.contactFocusInfo;
        //非焦点数据显示
        var textShowInfo = actiContactModuleJson.textShowInfo;
        //按钮显示
        var btnShow = actiContactModuleJson.btnShow;
        //创建焦点元素
        var focusHtml = this.createFocus(contactFocusInfo);
        //创建页面显示元素
        var showHtml = this.createDetail(textShowInfo, btnShow);
        var returnHtml = showHtml + focusHtml;
        return returnHtml;
    };
    /**
     * 创建焦点元素
     */
    this.createFocus = function (contactFocusInfo) {
        if (typeof (contactFocusInfo) == "object") {
            var focusHtml = "";
            for (var key in contactFocusInfo) {
                if (contactFocusInfo.hasOwnProperty(key)) {
                    focusHtml += "<div id='hands_x0_y0_" + contactFocusInfo[key].focusName + "_' style='position: absolute;left: " + contactFocusInfo[key].focusLeft + ";top: " + contactFocusInfo[key].focusTop + ";'><img src='" + contactFocusInfo[key].focusSrc + "' alt='' id='" + contactFocusInfo[key].focusName + "' style='visibility:hidden;'></div>";
                }
                this.addButtons(contactFocusInfo, key);
            }
            return focusHtml;
        } else {
            return "";
        }
    };
    /**
     * 创建焦点数组
     */
    this.addButtons = function (contactFocusInfo, key) {
        var contactButtons = {
            id: "hands_x0_y0_" + contactFocusInfo[key].focusName + "_",
            otherFocusEvent: contactFocusInfo[key].otherFocusEvent ? "javascript:" + actiContactName + "." + contactFocusInfo[key].otherFocusEvent + "" : "",
            otherBlurEvent: contactFocusInfo[key].otherBlurEvent ? "javascript:" + actiContactName + "." + contactFocusInfo[key].otherBlurEvent + "" : "",
            clickHandler: contactFocusInfo[key].clickEvent ? "javascript:" + actiContactName + "." + contactFocusInfo[key].clickEvent + "" : "",
            up: contactFocusInfo[key].up == "disable" ? contactFocusInfo[key].up : "hands_x0_y0_" + contactFocusInfo[key].up + "_",
            down: contactFocusInfo[key].down == "disable" ? "disable" : "hands_x0_y0_" + contactFocusInfo[key].down + "_",
            left: contactFocusInfo[key].left == "disable" ? "disable" : "hands_x0_y0_" + contactFocusInfo[key].left + "_",
            right: contactFocusInfo[key].right == "disable" ? "disable" : "hands_x0_y0_" + contactFocusInfo[key].right + "_",
            focusType: 7
        }
        buttons.push(contactButtons);
    };
    /**
     * 创建非焦点页面显示元素
     */
    this.createDetail = function (textShowInfo, btnShow) {
        if (typeof (textShowInfo) == "object" && typeof (btnShow) == "object") {
            var detailHtml = "";
            for (var key1 in textShowInfo) {
                if (textShowInfo.hasOwnProperty(key1)) {
                    if (key1 == "telInput") {
                        detailHtml += "<div id='" + textShowInfo[key1].textName + "' style='position: absolute;width: " + textShowInfo[key1].textWidth + ";height: " + textShowInfo[key1].textHeight + ";left: " + textShowInfo[key1].textLeft + ";top: " + textShowInfo[key1].textTop + ";line-height: " + textShowInfo[key1].textHeight + ";text-align: center;font-size: " + textShowInfo[key1].textSize + ";color:" + textShowInfo[key1].textColor + ";'>" + this.phoneNum + "</div>";
                    } else if (key1 == "saveTip") {
                        detailHtml += "<div id='" + textShowInfo[key1].textName + "' style='position: absolute;width: " + textShowInfo[key1].textWidth + ";height: " + textShowInfo[key1].textHeight + ";left: " + textShowInfo[key1].textLeft + ";top: " + textShowInfo[key1].textTop + ";line-height: " + textShowInfo[key1].textHeight + ";text-align: center;font-size: " + textShowInfo[key1].textSize + ";color:" + textShowInfo[key1].textColor + ";'></div>";
                    }
                }
            }
            for (var key2 in btnShow) {
                if (btnShow.hasOwnProperty(key2) && btnShow[key2].btnSrc) {
                    detailHtml += "<img id='" + btnShow[key2].btnName + "' src='" + btnShow[key2].btnSrc + "' width: " + btnShow[key2].btnWidth + ";height: " + btnShow[key2].btnHeight + "; style='position: absolute;left: " + btnShow[key2].btnLeft + ";top: " + btnShow[key2].btnTop + ";'>";
                }
            }
            return detailHtml;
        } else {
            return "";
        }
    };
    /**
     * 输入框聚焦事件
     */
    this.inputFocusEvent = function () {
        this.isOnFocus = true;
    };
    /**
     * 输入框失焦事件
     */
    this.inputBlurEvent = function () {
        this.isOnFocus = false;
    };
    /**
     * 保存按钮失焦事件
     */
    this.saveBtnBlur = function () {
        CT.$("" + this.saveTipName + "").innerHTML = "";
    };
    /**
     * 保存按钮点击事件
     */
    this.saveFunc = function (afterSavePhone) {
        var _this = this;
        this.phoneNum = CT.$("" + this.telInputName + "").innerHTML.replace(/\s*/g, "");//手机号输入框(去除字符串内所有的空格)
        var phoneReg = /^1[3|4|5|7|8]\d{9}$/;
        if (this.phoneNum.length != 11) {
            CT.$("" + this.telInputName + "").innerHTML = "请输入11位手机号码";
            this.phoneNum = CT.$("" + this.telInputName + "").innerHTML.replace(/\s*/g, "");//手机号输入框(去除字符串内所有的空格)
        } else if (!phoneReg.test(this.phoneNum)) {
            CT.$("" + this.telInputName + "").innerHTML = "手机号格式不正确";
            this.phoneNum = CT.$("" + this.telInputName + "").innerHTML.replace(/\s*/g, "");//手机号输入框(去除字符串内所有的空格)
        } else {
            actiObj.setUserPhone(this.phoneNum, function (res) {
                if (res == true) {
                    CT.$("" + _this.saveTipName + "").innerHTML = "手机号保存成功";
                }
            });
        }
        for (var i = 0; i < actiContactModule.actiContacts.length; i++) {
            window[actiContactModule.actiContacts[i]].phoneNum = this.phoneNum;
            CT.$(window[actiContactModule.actiContacts[i]].telInputName).innerHTML = this.phoneNum;
        }
        afterSavePhone && typeof afterSavePhone == "function" && afterSavePhone();
    };
    /**
     * 清空按钮点击事件
     */
    this.emptyFunc = function (afterEmptyPhone) {
        CT.$("" + this.telInputName + "").innerHTML = "";
        this.phoneNum = "";
        for (var i = 0; i < actiContactModule.actiContacts.length; i++) {
            window[actiContactModule.actiContacts[i]].phoneNum = this.phoneNum;
            CT.$(window[actiContactModule.actiContacts[i]].telInputName).innerHTML = this.phoneNum;
        }
        afterEmptyPhone && typeof afterEmptyPhone == "function" && afterEmptyPhone();
    };
}

/**
 * 键盘输入调用方法
 * 重写key3_4.js中changeNumObj.changeNum(num)方法
 */
changeNum = function (num) {
    if (actiContactModule.actiContacts) {
        for (var i = 0; i < actiContactModule.actiContacts.length; i++) {
            var actiContact = window[actiContactModule.actiContacts[i]];
            var reg = /^[0-9]+.?[0-9]*$/;//判断是否为数字
            if (actiContact.isOnFocus) {
                var size;
                if (!reg.test(actiContact.phoneNum)) {
                    actiContact.phoneNum = "";
                }
                if (actiContact.phoneNum == "") {
                    size = 0;
                } else {
                    size = actiContact.phoneNum.length;
                }
                if (size < 11 || !size) {
                    var addnum = actiContact.phoneNum;
                    actiContact.phoneNum = addnum + num;
                }
                CT.$("" + actiContact.telInputName + "").innerHTML = actiContact.phoneNum;
            }
        }
    }
}  
