var buttons = [];
var mainPage = {
  userData : [],//用户信息
  userData: {
    // 萌宠卡
    mcCards: [],
    // 机灵卡
    jlCards: [],
    // 梦想卡
    dreamCards: [],
  },
  // 初始化页面
  initPage: function () {
    // 获取用户数据
    this.queryUserInfo();
  },
  initFocus: function () {
    buttons.push(
      {
        // 机灵宠物车
        id: "hands_x0_y0_petCarFocus_",
        clickHandler: "javascript:mainPage.exchangeJlEvent()",
        left: "disable",
        right: "hands_x0_y0_mjFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 萌鸡小队
      {
        id: "hands_x0_y0_mjFocus_",
        clickHandler: "javascript:mainPage.exchangeMjEvent()",
        left: "hands_x0_y0_petCarFocus_",
        right: "hands_x0_y0_rocketCarFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 火箭车
      {
        id: "hands_x0_y0_rocketCarFocus_",
        clickHandler: "javascript:mainPage.exchangeRocketCarEvent()",
        left: "hands_x0_y0_mjFocus_",
        right: "hands_x0_y0_secertPrizeFocus_",
        up: "disable",
        down: "hands_x0_y0_callFocus_",
        focusType: 7,
      },
      // 神秘大礼包
      {
        id: "hands_x0_y0_secertPrizeFocus_",
        clickHandler: "javascript:mainPage.exchangeSecertEvent()",
        left: "hands_x0_y0_rocketCarFocus_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 未中奖弹框焦点
      {
        id: "hands_x0_y0_wzjTipFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "disable",
        right: "hands_x0_y0_backTipFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 弹框返回焦点
      {
        id: "hands_x0_y0_backTipFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        leftEvent: "javascript:mainPage.moveRightEvent()",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 空返回焦点
      {
        id: "hands_x0_y0_emptyBackFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 已兑换过奖品弹框
      {
        id: "hands_x0_y0_againTipFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "disable",
        right: "hands_x0_y0_backTipFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 中奖手机号码焦点
      {
        id: "hands_x0_y0_phoneNumberFocus_",
        clickHandler: "javascript:",
        left: "disable",
        right: "hands_x0_y0_enterFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 确定焦点
      {
        id: "hands_x0_y0_enterFocus_",
        clickHandler: "javascript:saveFunc()",
        otherBlurEvent: "javascript:saveBlur()",
        left: "hands_x0_y0_phoneNumberFocus_",
        right: "hands_x0_y0_clearFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 删除焦点
      {
        id: "hands_x0_y0_clearFocus_",
        clickHandler: "javascript:emptyFunc()",
        left: "hands_x0_y0_enterFocus_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      }
    );
    // 焦点初始化
    PAGE.focusInit();
    PAGE.changeFocus("hands_x0_y0_petCarFocus_");
  },
  //   获取用户信息
  queryUserInfo: function () {
    var that = this;
    actiObj.getUserDataList(function (data) {
      if (data.errorCode == "1000") {
        that.userData = CT.stringToJson(data.data.userActiData);
        if (that.userData) {
          CT.$("mc").innerHTML = that.userData.mcCards.length;
          CT.$("jl").innerHTML = that.userData.jlCards.length;
          CT.$("dream").innerHTML = that.userData.dreamCards.length;
        } else {
          CT.$("mc").innerHTML = 0;
          CT.$("jl").innerHTML = 0;
          CT.$("dream").innerHTML = 0;
        }
      } else {
        CT.$("mc").innerHTML = 0;
        CT.$("jl").innerHTML = 0;
        CT.$("dream").innerHTML = 0;
        that.userData.mcCards.length = 0;
        that.userData.jlCards.length = 0;
        that.userData.dreamCards.length = 0;
      }
    });
    actiObj.getActivityPrize(function (prizeData) {
      if (prizeData.errorCode == "1000") {
        that.prizeList = prizeData.data.records;
      }
    });
    actiObj.getUserPrizeInfo(function (res) {
      if (res.resultMsg == "success") {
        that.isPrize = true; //中过奖
      } else {
        that.isPrize = false; //未中过奖
      }
      // 初始化焦点
      that.initFocus();
    });
  },
  // 查找奖品索引
  findPrizeIndex: function (price) {
    var that = this;
    var index = -1;
    // 循环数组
    for (var i = 0; i < that.prizeList.length; i++) {
      if (price === that.prizeList[i].prizePrice) {
        index = i;
        break;
      }
    }
    return index;
  },
  // 兑换机灵宠物车事件
  exchangeJlEvent: function () {
    // 判断是否达到条件兑换奖品
    // 取到userData中存储的数据进行判断
    var that = this;
    var index = that.findPrizeIndex("1");
    console.log(index);
    if (index < 0) {
      return;
    }
    // 判断奖品是否大于0
    if (that.prizeList[index].prizeRemainNum > 0) {
      // 获取当前用户是否中过奖
      //如果达到兑换领取奖品的条件
      if (that.userData.mcCards.length >= 6 && that.userData.jlCards.length >= 12) {
        // 用户未曾获取过奖品并且当前获奖的prizeId不为空以及奖品数量充足的情况下，塞入用户获奖信息
        if (!that.isPrize && !that.prizeList[index].prize_id) {
          actiObj.setPrize(that.prizeList[index].rankId, function (res) {
            if (res.resultMsg == "success") {
              // 则让中奖的弹框显示
              that.showCongratulationTip();
              // 设置已中过奖品的标识
              that.isPrize = true;
              // 减去兑换的卡片，并存到setUserData中
              that.userData.mcCards -= 6;
              that.userData.jlCards -= 12;
              // 设置用户数据
              actiObj.setUserDataList(JSON.stringify(that.userData), function (res) {
                if (res.resultMsg == "success") {
                }
              });
            }
          });
        } else {
          // 则展示已领取过奖品的弹框
          that.showExchangeAgain();
        }
      } else {
        // 未达到中奖的条件弹框显示
        that.notArrivedTip();
      }
    } else {
      // 展示当前已被领取完弹框
      that.showPrizeOver();
    }
    //设置已中奖
    actiObj.getUserPrizeInfo(function (data) {
      if (data.resultMsg == "success") {
        that.isPrize = true;
      }
    });
  },
  // 兑换萌鸡事件
  exchangeMjEvent: function () {
    // 判断是否达到条件兑换奖品
    // 取到userData中存储的数据进行判断
    var that = this;
    var index = that.findPrizeIndex("2");
    console.log(index);
    if (index < 0) {
      return;
    }
    // 判断奖品是否大于0
    if (that.prizeList[index].prizeRemainNum > 0) {
      // 获取当前用户是否中过奖
      //如果达到兑换领取奖品的条件
      if (that.userData.mcCards.length >= 12 && that.userData.jlCards.length >= 6 && that.userData.dreamCards.length >= 6) {
        // 用户未曾获取过奖品并且当前获奖的prizeId不为空以及奖品数量充足的情况下，塞入用户获奖信息
        if (!that.isPrize && !that.prizeList[index].prize_id) {
          actiObj.setPrize(that.prizeList[index].rankId, function (res) {
            if (res.resultMsg == "success") {
              // 则让中奖的弹框显示
              that.showCongratulationTip();
              // 设置已中过奖品的标识
              that.isPrize = true;
              // 减去兑换的卡片，并存到setUserData中
              that.userData.mcCards -= 12;
              that.userData.jlCards -= 6;
              that.userData.dreamCards -= 6;
              // 设置用户数据
              actiObj.setUserDataList(JSON.stringify(that.userData), function (res) {
                if (res.resultMsg == "success") {
                }
              });
            }
          });
        } else {
          // 则展示已领取过奖品的弹框
          showExchangeAgain();
        }
      } else {
        // 未达到中奖的条件弹框显示
        that.notArrivedTip();
      }
    } else {
      // 展示当前已被领取完弹框
      that.showPrizeOver();
    }
    //设置已中奖
    actiObj.getUserPrizeInfo(function (data) {
      if (data.resultMsg == "success") {
        that.isPrize = true;
      }
    });
  },
  // 兑换火箭车事件
  exchangeRocketCarEvent: function () {
    // 判断是否达到条件兑换奖品
    // 取到userData中存储的数据进行判断
    var that = this;
    var index = that.findPrizeIndex("3");
    console.log(index);
    if (index < 0) {
      return;
    }
    // 判断奖品是否大于0
    if (that.prizeList[index].prizeRemainNum > 0) {
      // 获取当前用户是否中过奖
      //如果达到兑换领取奖品的条件
      if (that.userData.mcCards.length >= 12 && that.userData.jlCards.length >= 12 && that.userData.dreamCards.length >= 12) {
        // 用户未曾获取过奖品并且当前获奖的prizeId不为空以及奖品数量充足的情况下，塞入用户获奖信息
        if (!that.isPrize && !that.prizeList[index].prize_id) {
          actiObj.setPrize(that.prizeList[index].rankId, function (res) {
            if (res.resultMsg == "success") {
              // 则让中奖的弹框显示
              that.showCongratulationTip();
              // 设置已中过奖品的标识
              that.isPrize = true;
              // 减去兑换的现金，并存到setUserData中
              that.userData.mcCards -= 12;
              that.userData.jlCards -= 12;
              that.userData.dreamCards -= 12;
              // 设置用户数据
              actiObj.setUserDataList(JSON.stringify(that.userData), function (res) {
                if (res.resultMsg == "success") {
                }
              });
            }
          });
        } else {
          // 则展示已领取过奖品的弹框
          that.showExchangeAgain();
        }
      } else {
        // 未达到中奖的条件弹框显示
        that.notArrivedTip();
      }
    } else {
      // 展示当前已被领取完弹框
      that.showPrizeOver();
    }
    //设置已中奖
    actiObj.getUserPrizeInfo(function (data) {
      if (data.resultMsg == "success") {
        that.isPrize = true;
      }
    });
  },
  // 兑换神秘大礼包事件
  exchangeSecertEvent: function () {
    // 判断是否达到条件兑换奖品
    // 取到userData中存储的数据进行判断
    var that = this;
    var index = that.findPrizeIndex("4");
    console.log(index);
    if (index < 0) {
      return;
    }
    // 判断奖品是否大于0
    if (that.prizeList[index].prizeRemainNum > 0) {
      // 获取当前用户是否中过奖
      //如果达到兑换领取奖品的条件
      if (that.userData.mcCards.length >= 18 && that.userData.jlCards.length >= 18 && that.userData.dreamCards.length >= 18) {
        // 用户未曾获取过奖品并且当前获奖的prizeId不为空以及奖品数量充足的情况下，塞入用户获奖信息
        if (!that.isPrize && !that.prizeList[index].prize_id ) {
          actiObj.setPrize(that.prizeList[index].rankId, function (res) {
            if (res.resultMsg == "success") {
              // 则让中奖的弹框显示
              that.showCongratulationTip();
              // 设置已中过奖品的标识
              that.isPrize = true;
              // 减去兑换的现金，并存到setUserData中
              that.userData.mcCards -= 18;
              that.userData.jlCards -= 18;
              that.userData.dreamCards -= 18;
              // 设置用户数据
              actiObj.setUserDataList(JSON.stringify(that.userData), function (res) {
                if (res.resultMsg == "success") {
                }
              });
            }
          });
        } else {
          // 则展示已领取过奖品的弹框
          that.showExchangeAgain();
        }
      } else {
        // 未达到中奖的条件弹框显示
        that.notArrivedTip();
      }
    } else {
      // 展示当前已被领取完弹框
      that.showPrizeOver();
    }
    //设置已中奖
    actiObj.getUserPrizeInfo(function (data) {
      if (data&&data.successFlg != 0) {
        that.isPrize = true;
      }
    });
  },
  //焦点返回左移事件
  moveRightEvent: function () {
    if (CT.$("wzjTip").style.visibility == "visible") {
      PAGE.changeFocus("hands_x0_y0_wzjTipFocus_");
    } else if (CT.$("againTip").style.visibility == "visible") {
      PAGE.changeFocus("hands_x0_y0_againTipFocus_");
    }
  },
  // 未达到中奖条件弹框显示
  notArrivedTip: function () {
    CT.$("wzjTip").style.visibility = "visible";
    PAGE.changeFocus("hands_x0_y0_wzjTipFocus_");
  },
  
  // 展示已兑换过奖品弹框
  showExchangeAgain: function () {
    CT.$("againTip").style.visibility = "visible";
    PAGE.changeFocus("hands_x0_y0_againTipFocus_");
  },
  // 展示奖品已被领完弹框
  showPrizeOver: function () {
    CT.$("prizeOver").style.visibility = "visible";
    PAGE.changeFocus("hands_x0_y0_emptyBackFocus_");
  },
  // 跳首页
  jumpAnimation: function () {
    actiObj.actiCommonJumpUrl("./acti_puzzleAnimation.html");
  },
};
mainPage.initPage();


// 返回函数
function backFunc() {
  if (CT.$("wzjTip").style.visibility == "visible") {
    CT.$("wzjTip").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_petCarFocus_");
  } else if (CT.$("prizeTip").style.visibility == "visible") {
    CT.$("prizeTip").style.visibility = "hidden";
    CT.$("jlPrize").style.visibility = "hidden";
    CT.$("successTip").style.visibility = "hidden";
    CT.$("phoneNumber").style.visibility = "hidden";
    CT.$("enter").style.visibility = "hidden";
    CT.$("clear").style.visibility = "hidden";
    CT.$("telInput").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_petCarFocus_");
  } else if (CT.$("againTip").style.visibility == "visible") {
    CT.$("againTip").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_petCarFocus_");
  } else if (CT.$("prizeOver").style.visibility == "visible") {
    CT.$("prizeOver").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_petCarFocus_");
  } else {
    window.location.href ="./acti_puzzleAnimation.html";
  }
}

//焦点是否在输入框上
var isOnFocus = true;
//当前用户手机号
var userPhone = "";
var size = 0;
//焦点获焦在输入框中执行的方法
function onFocus(index) {
  isOnFocus = index == 1 ? true : false;
}
//手机号输入框
var telInput = CT.$("telInput").innerHTML;
//去除字符串内所有的空格
telInput = telInput.replace(/\s*/g, "");
  //获取手机号
  function getUserPhone() {
    actiObj.getUserPhone(function (res) {
      if (res.userPhone != null) {
        CT.$("telInput").innerHTML = res.userPhone;
        phoneNum = res.userPhone;
        CT.$("telInput").innerHTML = phoneNum;
      }
    });
  }
var phoneNum = telInput;
//保存手机号
function saveFunc() {
  var phoneNum = document.getElementById("telInput").innerHTML;
  var TEL_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
  if (phoneNum.length != 11) {
    document.getElementById("telInput").innerHTML = "请输入11位手机号码";
  } else if (phoneNum.length >= 11 && TEL_REGEXP.test(phoneNum)) {
    document.getElementById("telInput").innerHTML = phoneNum;
    actiObj.setUserPhone(phoneNum, function (res) {
      phoneNum = res.userphone;
    });
    document.getElementById("saveTips").innerHTML = "手机号保存成功";
  } else {
    phoneNum = "";
    document.getElementById("saveTips").innerHTML = "请输入正确的手机号";
  }
}
//监听用户遥控器输入的数字
changeNumObj.changeNum=function(num) {
  if (isOnFocus) {
    CT.$("telInput").style.visibility = "visible";
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
  }
  CT.$("telInput").innerHTML = phoneNum;
}
//保存按钮失去焦点
function saveBlur() {
  document.getElementById("saveTips").innerHTML = "";
}
//修改、清除手机号
function emptyFunc() {
  document.getElementById("telInput").innerHTML = "";
  phoneNum = "";
}

// 中奖弹框显示
function showCongratulationTip() {
  CT.$("prizeTip").style.visibility = "visible";
  CT.$("jlPrize").style.visibility = "visible";
  CT.$("successTip").style.visibility = "visible";
  CT.$("phoneNumber").style.visibility = "visible";
  CT.$("enter").style.visibility = "visible";
  CT.$("clear").style.visibility = "visible";
  PAGE.changeFocus("hands_x0_y0_phoneNumberFocus_");
  getUserPhone();
  CT.$("telInput").style.visibility = 'visible';
}