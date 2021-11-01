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
      "textLeft": "467px",
      "textTop": "633px",
      "textColor": "#ffffff",
    },
    //保存提示信息
    "saveTip": {
      "textName": "saveTip",
      "textSize": "24px",
      "textColor": "#ffffff",
      "textLeft": "450px",
      "textTop": "684px",
      "textWidth": "200px",
      "textHeight": ""
    }
  },
  //焦点展示信息
  "contactFocusInfo": {
    "telInputFocus": {
      "focusName": "telInputFocus",
      "focusLeft": "455px",
      "focusTop": "620px",
      "focusSrc": "images/phoneSelect.png",
      "clickEvent": "",
      "otherFocusEvent": "inputFocusEvent",
      "otherBlurEvent": "inputBlurEvent",
      "up": "myBackFocus",
      "down": "disable",
      "left": "disable",
      "right": "saveBtnFocus"
    },
    "saveBtnFocus": {
      "focusName": "saveBtnFocus",
      "focusLeft": "754px",
      "focusTop": "613px",
      "focusSrc": "images/saveSelect.png",
      "clickEvent": "saveFunc(afterSavePhone)",
      "otherFocusEvent": "",
      "otherBlurEvent": "saveBtnBlur",
      "up": "myBackFocus",
      "down": "disable",
      "left": "telInputFocus",
      "right": "emptyBtnFocus"
    },
    "emptyBtnFocus": {
      "focusName": "emptyBtnFocus",
      "focusLeft": "861px",
      "focusTop": "612px",
      "focusSrc": "images/saveSelect.png",
      "clickEvent": "emptyFunc",
      "otherFocusEvent": "",
      "otherBlurEvent": "",
      "up": "myBackFocus",
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
        "textTop": "437px",
        "textColor": "#ffffff",
      },
      //保存提示信息
      "saveTip": {
        "textName": "saveTipMsg",
        "textSize": "24px",
        "textColor": "#333",
        "textLeft": "500px",
        "textTop": "503px",
        "width": "200px",
        "textHeight": ""
      }
    },
    //焦点展示信息
    "contactFocusInfo": {
      "telInputFocus": {
        "focusName": "telFocus",
        "focusLeft": "542px",
        "focusTop": "421px",
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
        "focusLeft": "643px",
        "focusTop": "477px",
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
        "focusLeft": "746px",
        "focusTop": "479px",
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
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  }


}


// 焦点数组
var buttons = [];
var mainPage = {
  subscriberWateringNum: 3, //订购用户浇水次数
  unsubscribedUserWateringNum: 1, //未订购用户浇水次数
  timer: "", //定时器
  wateringNumber: 0, //浇水次数
  aniName: "", //动画名称
  jumpAnimation: "", //未中奖弹框动画名称
  isPrize: false, //是否中过奖
  isOrder: 1, //未订购用户
  totalChance: 0, //总的抽奖机会
  usedChance: 0, //使用抽奖机会
  remainChance: 0, //剩余抽奖机会
  prizeList: [], //奖品列表
  myPrize: {
    prizeId: null,
    prizeName: "",
  },
  timeRecords: "", //时间记录
  createTime: "", //浇水时间
  isWatering: false, //开始浇水按钮是否可以点击
  getBackFocus: null, //记忆焦点
  nowDate: new Date().getMonth() + 1 + "" + new Date().getDate(), //当天日期
  // 初始化页面
  initPage: function () {
    buttons.push(
      // 开始游戏
      {
        id: "hands_x0_y0_startGameFocus_",
        clickHandler: "javascript:mainPage.startWatering()",
        left: "disable",
        right: "hands_x0_y0_moreFocus_",
        up: "hands_x0_y0_jumpRuleFocus_",
        down: "disable",
        focusType: 7,
      },
      // 跳转规则页
      {
        id: "hands_x0_y0_jumpRuleFocus_",
        clickHandler: "javascript:mainPage.jumpRulePage()",
        left: "hands_x0_y0_startGameFocus_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_jumpGiftFocus_",
        focusType: 7,
      },
      // 跳转奖品页
      {
        id: "hands_x0_y0_jumpGiftFocus_",
        clickHandler: "javascript:mainPage.jumpGiftPage()",
        left: "hands_x0_y0_startGameFocus_",
        right: "disable",
        up: "hands_x0_y0_jumpRuleFocus_",
        down: "hands_x0_y0_moreFocus_",
        focusType: 7,
      },
      // 小树成长状态
      {
        id: "hands_x0_y0_growingFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "hands_x0_y0_superFlyingFocus_",
        down: "disable",
        focusType: 7,
      },
      // 超级飞侠
      {
        id: "hands_x0_y0_superFlyingFocus_",
        clickHandler: "javascript:mainPage.jumpAniListEvent('0')",
        left: "disable",
        right: "hands_x0_y0_rocketCarFocus_",
        up: "disable",
        down: "hands_x0_y0_growingFocus_",
        downEvent:"javascript:mainPage.focusDownEvent()",
        focusType: 7,
      },
      // 爆宠火箭车
      {
        id: "hands_x0_y0_rocketCarFocus_",
        clickHandler: "javascript:mainPage.jumpAniListEvent('1')",
        left: "hands_x0_y0_superFlyingFocus_",
        right: "hands_x0_y0_cuteChickenFocus_",
        up: "disable",
        down: "hands_x0_y0_growingFocus_",
        downEvent:"javascript:mainPage.focusDownEvent()",
        focusType: 7,
      },
      // 萌鸡小队
      {
        id: "hands_x0_y0_cuteChickenFocus_",
        clickHandler: "javascript:mainPage.jumpAniListEvent('2')",
        left: "hands_x0_y0_rocketCarFocus_",
        right: "hands_x0_y0_assassinFocus_",
        up: "disable",
        down: "hands_x0_y0_growingFocus_",
        downEvent:"javascript:mainPage.focusDownEvent()",
        focusType: 7,
      },
      // 刺客伍六七
      {
        id: "hands_x0_y0_assassinFocus_",
        clickHandler: "javascript:mainPage.jumpAniListEvent('3')",
        left: "hands_x0_y0_cuteChickenFocus_",
        right: "hands_x0_y0_petCarFocus_",
        up: "disable",
        down: "hands_x0_y0_growingFocus_",
        downEvent:"javascript:mainPage.focusDownEvent()",
        focusType: 7,
      },
      // 宠物机灵车
      {
        id: "hands_x0_y0_petCarFocus_",
        clickHandler: "javascript:mainPage.jumpAniListEvent('4')",
        left: "hands_x0_y0_assassinFocus_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_growingFocus_",
        downEvent:"javascript:mainPage.focusDownEvent()",
        focusType: 7,
      },
      // 未订购用户机会用完弹框
      {
        id: "hands_x0_y0_noChanceFocus_",
        clickHandler: "javascript:mainPage.jumpOrder()",
        left: "disable",
        right: "hands_x0_y0_laterFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 未订购用户机会用完弹框
      {
        id: "hands_x0_y0_laterFocus_",
        clickHandler: "javascript:backFunc()",
        left: "hands_x0_y0_noChanceFocus_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 已订购用户机会用完弹框
      {
        id: "hands_x0_y0_seeAniFocus_",
        clickHandler: "javascript:mainPage.orderUserJumpAni()",
        left: "disable",
        right: "hands_x0_y0_backFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 已订购用户机会用完弹框
      {
        id: "hands_x0_y0_backFocus_",
        clickHandler: "javascript:backFunc()",
        left: "hands_x0_y0_seeAniFocus_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 小树已经长大弹框
      {
        id: "hands_x0_y0_successFocus_",
        clickHandler: "javascript:mainPage.treeGrowUp()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 已订购未中奖
      {
        id: "hands_x0_y0_loseGiftFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 未订购未中奖
      {
        id: "hands_x0_y0_pityFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "hands_x0_y0_superFlyingFocus_",
        down: "disable",
        focusType: 7,
      },
      // 中奖弹框
      {
        id: "hands_x0_y0_successFocus_",
        clickHandler: "javascript:mainPage.treeGrowUp()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      // 手机号输入框
      {
        id: "hands_x0_y0_phoneNumberFocus_",
        clickHandler: "javascript:",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_saveFocus_",
        focusType: 7,
      },
      // 清除
      {
        id: "hands_x0_y0_emptyFocus_",
        clickHandler: "javascript:emptyFunc()",
        left: "hands_x0_y0_saveFocus_",
        right: "disable",
        up: "hands_x0_y0_phoneNumberFocus_",
        down: "disable",
        focusType: 7,
      },
      // 保存
      {
        id: "hands_x0_y0_saveFocus_",
        clickHandler: "javascript:saveFunc()",
        otherBlurEvent: "javascript:saveBlur()",
        left: "disable",
        right: "hands_x0_y0_emptyFocus_",
        up: "hands_x0_y0_phoneNumberFocus_",
        down: "disable",
        focusType: 7,
      },
      // 更多精彩
      {
        id: "hands_x0_y0_moreFocus_",
        clickHandler: "javascript:mainPage.moreWonderful()",
        left: "hands_x0_y0_startGameFocus_",
        right: "disable",
        up: "hands_x0_y0_jumpGiftFocus_",
        down: "disable",
        focusType: 7,
      },
      {
        id: "hands_x0_y0_closeQuit_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      {
        id: "hands_x0_y0_myBackFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_telInputFocus_",
        focusType: 7,
      }

    );
    CT.$("subsriber").innerText = this.subscriberWateringNum;
    CT.$("unsubscribedUser").innerText = this.unsubscribedUserWateringNum;
    this.openInter();
    this.queryUserData();
  },
  checkRemainChance: function () {
    var that = this;
    if (that.remainChance > 0) {
      return true;
    } else {
      // 展示没有机会弹框
      if (that.isOrder == 0) {
        CT.$("vipTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_seeAniFocus_");
      } else {
        CT.$("nochance").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_noChanceFocus_");
      }
      return false;
    }
  },
  // 浇水动画
  wateringAnimation: function () {
    var that = this;
    var n = 0;
    function hideAll() {
      CT.$("waterSrc1").style.display = 'none';
      CT.$("waterSrc2").style.display = 'none';
      CT.$("waterSrc3").style.display = 'none';
      CT.$("waterSrc4").style.display = 'none';
      CT.$("waterSrc5").style.display = 'none';
    }
    var bootTimer = setInterval(function () {
      if (n > 16) {//动画播放结束后
        clearInterval(bootTimer);
        that.isWatering = false;
        hideAll();
        CT.$("waterSrc1").style.display = 'block'
        CT.$("water").style.left = "788px";
        CT.$("water").style.top = "483px";
        CT.$("water").style.width = "250px";
        that.treeTipEvent();
        setTimeout(function () {
          if (that.wateringNumber < 30) {
            that.showTreeGrowingDialog();
          }else {
            that.randomDropPrizes();
          }
        }, 1000);
      } else if(n > 5) {
        n++;
        CT.$("water").style.width = '415px';
        CT.$("water").style.height = '376px';
        hideAll();
        if (n % 3 == 0) {
          CT.$("waterSrc3").style.display = 'block'
        }else if (n % 3 == 1) {
          CT.$("waterSrc4").style.display = 'block'
        }else {
          CT.$("waterSrc5").style.display = 'block'
        }
      }else {
        n++;
        hideAll();
        CT.$("waterSrc2").style.display = 'block'
        CT.$("water").style.width = '415px';
        CT.$("water").style.height = '376px';
        if(n == 1){
          CT.$("water").style.left = "650px";
          CT.$("water").style.top = "340px";
        }else if(n == 2){
          CT.$("water").style.left = "680px";
          CT.$("water").style.top = "300px";
        }else if(n == 3){
          CT.$("water").style.left = "690px";
          CT.$("water").style.top = "170px";
        }else if(n == 4){
          CT.$("water").style.left = "680px";
          CT.$("water").style.top = "40px";
        }else{
          CT.$("water").style.left = "650px";
          CT.$("water").style.top = "0px";
        }

      }
    }, 200);
  },
  // 渲染进度条
  renderProgressBar: function () {
    var that = this;
    var totalNum = that.wateringNumber;
    var loading = 0;
    // loading跟totalNum是取余的关系
    loading = totalNum % 10;
    if (totalNum > 0 && loading == 0) {
      loading = 10;
    }
    CT.$("loadingImg").src = "./img/mainPage/loadingImg/" + loading + ".png";
  },
  //显示小树成长中弹框
  showTreeGrowingDialog: function () {
    var that = this;
    // if (0 < that.wateringNumber && that.wateringNumber < 40 && that.wateringNumber % 10 == 0) {
    // CT.$("loadingImg").src = "./img/mainPage/loadingImg/10.png";
    if (that.wateringNumber == 30) {
      return;
    }
    CT.$("growing").style.visibility = "visible";
    CT.$("superFlying").style.visibility = "visible";
    CT.$("rocketCar").style.visibility = "visible";
    CT.$("cuteChicken").style.visibility = "visible";
    CT.$("assassin").style.visibility = "visible";
    CT.$("petCar").style.visibility = "visible";
    PAGE.changeFocus("hands_x0_y0_superFlyingFocus_");
    // }
  },
  // 开始浇水
  startWatering: function () {
    var that = this;
    CT.$("water").style.visibility = "visible";
    if (that.isWatering) {
      return;
    }
    // 如果小树长大了就显示长大的弹框
    if (that.wateringNumber >= 30) {
      CT.$("success").style.visibility = "visible";
      PAGE.changeFocus("hands_x0_y0_successFocus_");
      return;
    }
    // 判断用户是否有浇水的机会
    if (!that.checkRemainChance()) {
      // that.isWatering = false;
      return;
    }
    that.isWatering = true;
    actiObj.setChance(function (res) {
      if (res) {
        that.remainChance--;
        CT.$("remainChance").innerHTML = that.remainChance;
        that.setUserData();
      }
    });
  },
  // 调接口获取用户每天抽奖机会
  queryUserData: function () {
    var that = this;
    // 鉴权
    orderJs.columnGetAuth(function (data) {
      if (data == 0) {
        that.isOrder = 0;
        that.totalChance = 3;
      } else {
        that.isOrder = 1;
        that.totalChance = 1;
      }
      // 获取用户浇水机会
      mainPage.getChanceFunc();
      actiObj.getUserDataList(function (data) {
        if (data && data.successFlg != 0) {
          var userData = JSON.parse(data.data.userActiData);
          that.wateringNumber = userData.waterNum;
          var totalNum = userData.waterNum;
          var loading = 0;
          // loading跟totalNum是取余的关系
          loading = totalNum % 10;
          if (totalNum > 0 && loading == 0) {
            loading = 10;
          }
          CT.$("loadingImg").src = "./img/mainPage/loadingImg/" + loading + ".png";
          that.treeTipEvent();
        }
      });
      //设置已中奖
      actiObj.getUserPrizeInfo(function (data) {
        if (data && data.successFlg != 0) {
          if (data && data.data[0] && data.data[0].prizeCname){//设置为已中奖
            that.isPrize = true;
          }
        }
      });
    });
  },
  //存储浇水次数
  setUserData: function () {
    var that = this;
    var userData = {
      // 浇水次数
      waterNum: ++that.wateringNumber,
    };
    actiObj.setUserDataList(JSON.stringify(userData), function (res) {
      if (res && res.successFlg != 0) {
        that.renderProgressBar();
        that.wateringAnimation();
      }
    });
  },
  // 随机函数
  shuffle: function (arr) {
    var len = arr.length;
    for (var i = 0; i < len - 1; i++) {
      var index = parseInt(Math.random() * (len - i));
      var temp = arr[index];
      arr[index] = arr[len - i - 1];
      arr[len - i - 1] = temp;
    }
    return arr;
  },
  // 种树完成 随机掉落奖品
  randomDropPrizes: function () {
    console.log("开始抽奖");
    var that = this;

    // 测试用|| true
    if (that.wateringNumber == 30) {
      clearInterval(that.timer);
      that.startLotterying();
    }
  },
  startLotterying: function () {
    var that = this;
    //获取活动奖品信息
    actiObj.getActivityPrize(function (prizeData) {
      if (prizeData && prizeData.successFlg != 0) {
        var prizeList = [];
        if (Array.isArray(prizeData.data.records)) {
          that.prizeList = prizeData.data.records;
          prizeList = prizeData.data.records;
        }
        var random = Math.random() * 100;
        var percent = 0;
        for (var i = 0; i < prizeList.length; i++) {
          percent += prizeList[i].prizePercentage;
        }
        if (random < percent) {
          var randomPrizeIndex = Math.floor(Math.random() * prizeList.length);
          if (prizeList[randomPrizeIndex].prizeRemainNum > 0) {
            that.myPrize = {
              rankId: prizeList[randomPrizeIndex].rankId,
              prizeId: prizeList[randomPrizeIndex].id,
              prizeName: prizeList[randomPrizeIndex].prizeCname,
            };
            var prizeIdList = ["cjfx","bchjc","jlcwc"];
            var randomId = prizeIdList[that.myPrize.rankId-1];
            that.calculateGiftPackage(randomId);
          } else {
            that.pityFunc();
          }
        } else {
          that.pityFunc();
        }
      } else {
        that.prizeList = [];
        // 显示未获奖
        that.pityFunc();
      }
    });
  },
  //获取奖品情况并展示对应的获奖（未获奖）弹框信息
  calculateGiftPackage: function (randomId) {
    var that = this;
    // 获取当前用户是否中过奖
    actiObj.getUserPrizeInfo(function (res) {
      if (res && res.successFlg != 0) {
        if (res && res.data[0] && res.data[0].prizeCname){//设置this.prized = true;为已中奖
          that.isPrize = true; //中过奖
        }
      } else {
        that.isPrize = false; //未中过奖
      }
      //用户未曾获取过奖品并且当前获奖的prizeId不为空以及奖品数量充足的情况下，塞入用户获奖信息
      if (!that.isPrize && that.myPrize.prizeId != null) {
        console.log("中奖了");
        actiObj.setPrize(that.myPrize.prizeId, function (res) {
          if (res && res.successFlg != 0) {
            that.moveDownElement(randomId,function(){
              CT.$("gift").style.visibility = "visible";
              PAGE.changeFocus("hands_x0_y0_telFocus_");
              that.openInter();
            })
          }
        });
      } else {
        that.pityFunc();
      }
    });
  },
  //奖品下降过程
  moveDownElement: function (id,callback) {
    var that = this;
    var step = 20;
    var downTimer = setInterval(function () {
      var bottom = Number(CT.$(id).style.bottom.replace("px", ""));
      if (bottom >= 10) {
        CT.$(id).style.bottom = bottom - step + "px";
      } else {
        clearInterval(downTimer);
        CT.$(id).style.visibility = "hidden";
        callback && callback();
      }
    }, 200);
  },

  //获取用户今日已使用机会
  getChanceFunc: function () {
    var that = this;
    actiObj.getChance(function (data) {
      var usedChance = data.data.activityChance;
      that.remainChance = that.totalChance - usedChance;
      if (that.remainChance < 0) {
        that.remainChance = 0;
      }
      CT.$("remainChance").innerHTML = that.remainChance;
    });
  },
  // 未中奖片单切换
  wzjAniListDisEvent: function (animationnName) {
    var that = this;
    that.jumpAnimation = animationnName;
  },
  // 判断当前弹框焦点下移到那个焦点上
  // isShowWzjDialog:function(){
  //   var down = 'disable';
  //   if(CT.$("pity").style.visibility == 'visible'){
  //     buttons.push({
  //        // 未订购未中奖弹框
  //       id: "hands_x0_y0_pityFocus_",
  //       clickHandler: "javascript:backfunc()",
  //       left: "disable",
  //       right: "disable",
  //       up: "disable",
  //       down: "disable",
  //       focusType: 7,
  //     });
  //   }
  // },
  // 未中奖片单切换
  // wzjAniJumpEvent:function(){
  //   var that = this;
  //   if(that.jumpAnimation == 'super'){
  //     getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=215", curFocus.FocusID);
  //   }else if(that.jumpAnimation == 'rocket'){
  //     getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=2648", curFocus.FocusID);
  //   }else if(that.jumpAnimation == 'cute'){
  //     getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=602", curFocus.FocusID);
  //   }else if(that.jumpAnimation == 'assassin'){
  //     getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=2415", curFocus.FocusID);
  //   }else if(that.jumpAnimation == 'petCar'){
  //     getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=2469", curFocus.FocusID);
  //   }
  // },
  // 点击确认跳转片单
  jumpAniListEvent: function (IP) {
    var cartoonId = 0;
    if(IP == "0"){//三只松鼠
      cartoonId = 771;
    }else if(IP == "1"){//爆冲火箭
      cartoonId = 1391;
    }else if(IP == "2"){//萌鸡
      cartoonId = 1604;
    }else if(IP == "3"){//刺客五六七
      cartoonId = 384;
    }else if(IP == "3"){//机灵宠物车
      cartoonId = 803;
    }
    PAGE.otherPageParam = window.location.search.substring(1);
    CT.goPage();
    var commpageId = 3;
    var cartoonData={recommendDisplayType:1,recommendDisplayValue:cartoonId,commpageId:commpageId};
    CT.toAnterRecommendUrl(cartoonData);
  },
  // 已订购用户跳动画
  orderUserJumpAni: function () {
    var cartoonId = [771,1391,1604,384,803];
    var random = Math.floor(Math.random() * 5);
    PAGE.otherPageParam = window.location.search.substring(1);
    CT.goPage();
    var commpageId = 3;
    var cartoonData={recommendDisplayType:1,recommendDisplayValue:cartoonId[random],commpageId:commpageId};
    CT.toAnterRecommendUrl(cartoonData);



  },
  //抽奖机会用完展示弹框
  noChanceFunc: function () {
    var that = this;
    // 停止浇水动画以及进度条展示
    clearInterval(that.bootTimer);
    // 鉴权 判断是已订购/未订购
    orderJs.columnGetAuth(function (data) {
      if (data == 0) {
        if (that.isOrder == 0) {
          CT.$("vipUser").style.visibility = "visible";
          PAGE.changeFocus("hands_x0_y0_noChanceFocus_");
        } else {
          //用户上一次鉴权是未订购的情况下，即用户在试玩后订购，重置游戏机会
          that.isOrder = 0;
          that.totalChance = 3;
          that.remainChance = 2;
        }
      } else {
        //未订购用户试玩机会已使用的情况下，再次点击抽奖弹出弹框
        that.isOrder = 1;
        // 弹出未订购用户机会用完弹框
        CT.$("nochance").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_noChanceFocus_");
      }
    });
  },
  // 很遗憾未获奖;
  pityFunc: function () {
    var that = this;
    if (that.isOrder == 0) {
      CT.$("loseGift").style.visibility = "visible";
      PAGE.changeFocus("hands_x0_y0_loseGiftFocus_");
    } else {
      CT.$("pity").style.visibility = "visible";
      CT.$("superFlying").style.visibility = "visible";
      CT.$("rocketCar").style.visibility = "visible";
      CT.$("cuteChicken").style.visibility = "visible";
      CT.$("assassin").style.visibility = "visible";
      CT.$("petCar").style.visibility = "visible";
      PAGE.changeFocus("hands_x0_y0_superFlyingFocus_");
    }
  },
  // 小树成长状态
  treeTipEvent: function () {
    var that = this;
    // that.jumpAniListEvent();
    if (that.wateringNumber >= 10 && that.wateringNumber <= 19) {
      CT.$("tree").src = "./img/mainPage/tree/2.png";
      CT.$("treeWrapper").style.width = "170px";
      CT.$("treeWrapper").style.height = "290px";
      CT.$("treeWrapper").style.marginLeft = "-85px";
    } else if (that.wateringNumber >= 20 && that.wateringNumber <= 29) {
      CT.$("tree").src = "./img/mainPage/tree/3.png";
      CT.$("treeWrapper").style.width = "231px";
      CT.$("treeWrapper").style.height = "335px";
      CT.$("treeWrapper").style.marginLeft = "-85px";
    } else if (that.wateringNumber >= 30) {
      CT.$("tree").src = "./img/mainPage/tree/4.png";
      CT.$("treeWrapper").style.width = "360px";
      CT.$("treeWrapper").style.height = "430px";
      CT.$("treeWrapper").style.marginLeft = "-180px";
    }
  },
  // 跳转规则页
  jumpRulePage: function () {
    CT.setCookie("backCurFocus", curFocus.FocusID); //焦点记忆
    /*actiObj.actiCommonJumpUrl("./acti_rulePage.html");*/
    CT.$('rulePage').style.visibility = 'visible';
    PAGE.changeFocus("hands_x0_y0_closeQuit_");
  },
  // 跳转奖品页
  jumpGiftPage: function () {
    actiObj.getUserPrizeInfo(function (res) {
      if (res && res.successFlg != 0) {
        CT.$("prizeInfo").innerHTML = res.data[0].prizeCname;
      } else {
        CT.$("prizeInfo").innerHTML = "您未获得奖品";
      }
    });
    CT.setCookie("backCurFocus", curFocus.FocusID); //焦点记忆
    /*actiObj.actiCommonJumpUrl("./acti_giftPage.html");*/
    CT.$('winningList').style.visibility = 'visible';
    PAGE.changeFocus("hands_x0_y0_telInputFocus_");
  },
  // 未订购用户跳订购
  jumpOrder: function () {
    CT.goPage();
    orderJs.columnToOrderPage("activity_smallTrees");
  },
  // 小树成功长大
  treeGrowUp: function () {
    CT.$("success").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  },
  // 开启玩具定时器
  openInter: function () {
    var that = this;
    var direction;
    that.timer = setInterval(function () {
      if (direction == "up") {
        direction = "down";
        CT.$("jlcwc").style.bottom = "178px";
        CT.$("bchjc").style.bottom = "295px";
        CT.$("cjfx").style.bottom = "367px";
      } else {
        direction = "up";
        CT.$("jlcwc").style.bottom = "168px";
        CT.$("bchjc").style.bottom = "285px";
        CT.$("cjfx").style.bottom = "377px";
      }
    }, 650);
  },
  // 更多精彩
  moreWonderful: function () {
    CT.BackPortalMainPage();
  },
  // 焦点下移事件
  focusDownEvent:function(){
    if(CT.$("pity").style.visibility == 'visible'){
      PAGE.changeFocus("hands_x0_y0_pityFocus_");
    } else {
      PAGE.changeFocus("hands_x0_y0_growingFocus_");
    }
  },
};
// 初始化页面
mainPage.initPage();

//中奖名单
function prizeList() {
  actiObj.getPrizeUserInfo(function (data) {
    var rankList = CT.$("rankList");
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
  });
  CT.$('winningListId').innerHTML = xjDataLog.getUserId();
  CT.$('winningId').innerHTML = xjDataLog.getUserId();
}
prizeList();

// 返回函数
function backFunc() {
  CT.delCookie("backCurFocus"); //删除记忆焦点
  if (CT.$("growing").style.visibility == "visible" || CT.$("pity").style.visibility == "visible") {
    CT.$("growing").style.visibility = "hidden";
    CT.$("pity").style.visibility = "hidden";
    CT.$("superFlying").style.visibility = "hidden";
    CT.$("rocketCar").style.visibility = "hidden";
    CT.$("cuteChicken").style.visibility = "hidden";
    CT.$("assassin").style.visibility = "hidden";
    CT.$("petCar").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("nochance").style.visibility == "visible") {
    CT.$("nochance").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("vipTip").style.visibility == "visible") {
    CT.$("vipTip").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("gift").style.visibility == "visible") {
    CT.$("gift").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("loseGift").style.visibility == "visible") {
    CT.$("loseGift").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("success").style.visibility == "visible") {
    CT.$("success").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  } else if (CT.$("loseGift").style.visibility == "visible") {
    CT.$("loseGift").style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  }else if(CT.$('winningList').style.visibility == 'visible'){
    CT.$('winningList').style.visibility = 'hidden'
    PAGE.changeFocus("hands_x0_y0_jumpGiftFocus_");
  }else if(CT.$('rulePage').style.visibility == 'visible'){
    CT.$('rulePage').style.visibility = 'hidden'
    PAGE.changeFocus("hands_x0_y0_jumpRuleFocus_");
  } else {
    CT.BackPortalMainPage();
    PAGE.changeFocus("hands_x0_y0_startGameFocus_");
  }
  CT.$("waterSrc1").src = "./img/mainPage/water/1.png";
  CT.$("waterSrc1").style.left = "463px";
  CT.$("waterSrc1").style.top = "736px";
  CT.$("water").style.visibility = "visible";
}