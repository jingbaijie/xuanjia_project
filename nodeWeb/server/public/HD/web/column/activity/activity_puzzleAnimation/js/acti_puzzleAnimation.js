var buttons = [];
xjDataLog.isDebug = true;
xjDataLog.isMsg = true;
var mainPage = {
  isOrder: 1, //未订购用户
  getBackCurrentFocus: null, //记忆焦点
  memeryFocus: null, //记忆从详情页返回的焦点
  isPrize: false, //是否中过奖
  getCartoonId: null, //获取用户从详情页返回的标识
  userData: {
    // 萌宠卡
    mcCards: [],
    // 机灵卡
    jlCards: [],
    // 梦想卡
    dreamCards: [],
  },
  //用户存储的userData数据
  myPrize: {
    prizeId: null, //奖品ID
    prizeName: "", //奖品名称
  },
  myLottery: {
    id: 0,
    name: "",
  },
  lotteryList: [
    { id: 1, name: "萌鸡卡" },
    { id: 2, name: "机灵卡" },
    { id: 3, name: "梦想卡" },
  ],
  // 初始化页面
  initPage: function () {
    this.getCartoonId = CT.getCookie("actiJumpOrderDetailsPage");
    // 获取用户数据
    this.queryUserInfo();
  },
  initFocus: function () {
    buttons.push(
      {
        // 爆冲火箭车之车王之战
        id: "hands_x0_y0_carKingFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "disable",
        right: "hands_x0_y0_cuteChickenFocus_",
        up: "disable",
        down: "hands_x0_y0_petCarFocus_",
        focusType: 7,
      },
      // 萌鸡小队
      {
        id: "hands_x0_y0_cuteChickenFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "hands_x0_y0_carKingFocus_",
        right: "hands_x0_y0_armorFocus_",
        up: "disable",
        down: "hands_x0_y0_callFocus_",
        focusType: 7,
      },
      // 超变武兽
      {
        id: "hands_x0_y0_superFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "hands_x0_y0_callFocus_",
        right: "hands_x0_y0_toExhangeFocus_",
        up: "hands_x0_y0_armorFocus_",
        down: "disable",
        focusType: 7,
      },
      // 机灵宠物车
      {
        id: "hands_x0_y0_petCarFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "disable",
        right: "hands_x0_y0_callFocus_",
        up: "hands_x0_y0_carKingFocus_",
        down: "disable",
        focusType: 7,
      },
      // 爆冲火箭车之飞擎的召唤
      {
        id: "hands_x0_y0_callFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "hands_x0_y0_petCarFocus_",
        right: "hands_x0_y0_superFocus_",
        up: "hands_x0_y0_cuteChickenFocus_",
        down: "disable",
        focusType: 7,
      },
      // 铠甲勇士之猎铠
      {
        id: "hands_x0_y0_armorFocus_",
        clickHandler: "javascript:mainPage.jumpAnimation()",
        left: "hands_x0_y0_cuteChickenFocus_",
        right: "hands_x0_y0_myCardsFocus_",
        up: "disable",
        down: "hands_x0_y0_superFocus_",
        focusType: 7,
      },
      // 我的卡片按钮
      {
        id: "hands_x0_y0_myCardsFocus_",
        clickHandler: "javascript:mainPage.jumpMyCardsPage()",
        left: "hands_x0_y0_armorFocus_",
        right: "hands_x0_y0_ruleFocus_",
        up: "disable",
        down: "hands_x0_y0_toOrderFocus_",
        focusType: 7,
      },
      // 活动规则按钮
      {
        id: "hands_x0_y0_ruleFocus_",
        clickHandler: "javascript:mainPage.jumpRulePage()",
        left: "hands_x0_y0_myCardsFocus_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_toOrderFocus_",
        focusType: 7,
      },
      // 去订购
      {
        id: "hands_x0_y0_toOrderFocus_",
        clickHandler: "javascript:mainPage.jumpOrder()",
        left: "hands_x0_y0_armorFocus_",
        right: "disable",
        up: "hands_x0_y0_ruleFocus_",
        down: "hands_x0_y0_toVisitFocus_",
        focusType: 7,
      },
      // 去浏览
      {
        id: "hands_x0_y0_toVisitFocus_",
        clickHandler: "javascript:mainPage.jumpVideoPage()",
        left: "hands_x0_y0_armorFocus_",
        right: "disable",
        up: "hands_x0_y0_toOrderFocus_",
        down: "hands_x0_y0_toExhangeFocus_",
        focusType: 7,
      },
      // 去兑换
      {
        id: "hands_x0_y0_toExhangeFocus_",
        clickHandler: "javascript:mainPage.jumpExchangePage()",
        left: "hands_x0_y0_superFocus_",
        right: "disable",
        up: "hands_x0_y0_toVisitFocus_",
        down: "disable",
        focusType: 7,
      },
      // 空焦点
      {
        id: "hands_x0_y0_emptyFocus_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      }
    );
    // 焦点初始化
    PAGE.focusInit();
    this.memeryFocus = CT.getCookie("memeryFocus");
    this.getBackCurrentFocus = CT.getCookie("backFocus");
    if (this.memeryFocus) {
      PAGE.changeFocus(this.memeryFocus);
    } else if (this.getBackCurrentFocus) {
      PAGE.changeFocus(this.getBackCurrentFocus);
    } else {
      PAGE.changeFocus("hands_x0_y0_carKingFocus_");
    }
  },
  // 进页面todo
  initEvent: function () {
    var that = this;
    if (that.isOrder == 1) {
      CT.$("toOrder").src = "./img/mainPage/toOrder.png";
    } else {
      CT.$("toOrder").src = "./img/mainPage/order.png";
    }    
    if (that.getCartoonId) {
      that.calculateWinningProbability(); 
      CT.delCookie("actiJumpFreeDetailsPage");
      CT.delCookie("actiJumpOrderDetailsPage");
      // 展示获得的卡片
      setTimeout(function () {
        that.showMyLotteryDialog();
      }, 150);     
      that.setUserData();
    }
  },
  //计算奖品情况并展示对应的获奖弹框信息
  calculateWinningProbability: function () {
    var that = this;
    var lotteryId;
    var random = Math.random();
    var todayMcNum = 0;
    var todayJlNum = 0;
    var date = new Date().getDate();
    for (var i = 0; i < that.userData.mcCards.length; i++) {
      if (that.userData.mcCards[i] == date) {
        todayMcNum += 1;
      }
    }
    for (var i = 0; i < that.userData.jlCards.length; i++) {
      if (that.userData.jlCards[i] == date) {
        todayJlNum += 1;
      }
    }
    // 判断是已订购用户还是未订购用户
    // 已订购用户
    if (that.isOrder == 0) {
      // 已订购用户机灵卡最多10个,萌鸡卡最多4个
      // 判断用户机灵卡是否<=10
      if (random <= 0.5) {
        if (that.userData.jlCards.length <= 8 && todayJlNum <= 2) {
          lotteryId = 2;
        } else {
          // 则给梦想卡
          lotteryId = 3;
        }
      } else if (random > 0.5) {
        if (that.userData.mcCards.length <= 2 && todayMcNum <= 2) {
          lotteryId = 1;
        } else {
          // 则给梦想卡
          lotteryId = 3;
        }
      }
      // 未订购用户
    } else {
      // 未订购用户机灵卡最多8个,萌鸡卡最多3个
      // 判断用户机灵卡是否<=8
      if (random <= 0.5) {
        if (that.userData.jlCards.length <= 6 && todayJlNum <= 1) {
          lotteryId = 2;
        } else {
          lotteryId = 3;
        }
      } else if (random > 0.5) {
        if (that.userData.mcCards.length <= 2 && todayMcNum <= 1) {
          lotteryId = 1;
        } else {
          lotteryId = 3;
        }
      }
    }
    for (var i = 0; i < that.lotteryList.length; i++) {
      if (lotteryId === that.lotteryList[i].id) {
        that.myLottery = that.lotteryList[i];
        break;
      }
    }
  },
  // 显示获得的卡片弹框
  showMyLotteryDialog: function () {
    var that = this;
    switch (that.myLottery.id) {
      case 1:
        CT.$("mcTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_emptyFocus_");
        break;
      case 2:
        CT.$("jlTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_emptyFocus_");
        break;
      case 3:
        CT.$("dreamTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_emptyFocus_");
        break;
      default:
        break;
    }
  },
  //存储用户中奖数据
  setUserData: function () {
    var that = this;
    var date = new Date().getDate();
    switch (that.myLottery.id) {
      case 1:
        that.userData.mcCards.push(date);
        break;
      case 2:
        that.userData.jlCards.push(date);
        break;
      case 3:
        that.userData.dreamCards.push(date);
        break;
      default:
        break;
    }
    // 设置用户数据
    actiObj.setUserDataList(CT.jsonToString(that.userData), function (res) {
      if (res.errorCode == "1000") {
        // 设置机会
        actiObj.setChance(function (res) {
          that.remainChance--;
        });
      }
    });
  },
  // 获取当前用户信息
  queryUserInfo: function () {
    var that = this;
    // 鉴权
    orderJs.columnGetAuth(function (data) {
      if (data == 0) {
        that.isOrder = 0;
      } else {
        that.isOrder = 1;
      }
    });
    actiObj.getUserDataList(function (data) {
      if (data.errorCode == "1000") {
        if (data.data && data.data.userActiData) {
          that.userData = CT.stringToJson(data.data.userActiData);
        }
      }
        that.initEvent();
    });
    actiObj.getUserPrizeInfo(function (data) {
      if (data.successFlg != 0) {
        //设置已中奖
        that.isPrize = true;
      } else {
        that.isPrize = false; //未中过奖
      }
      // 初始化焦点
      that.initFocus();
    });
  },

  // 跳动画视频详情页
  jumpAnimation: function () {
    var actiCartoonId = 0;
    // 车王之战
    if (curFocus.FocusID == "hands_x0_y0_carKingFocus_") {
      actiCartoonId = 1391;
      // 免费跳详情页标识
      CT.setCookie("actiJumpFreeDetailsPage", actiCartoonId);
      // 萌鸡小队
    } else if (curFocus.FocusID == "hands_x0_y0_cuteChickenFocus_") {
      // 免费跳详情页标识
      actiCartoonId = 794;
      CT.setCookie("actiJumpFreeDetailsPage", actiCartoonId);
      // 铠甲勇士猎铠
    } else if (curFocus.FocusID == "hands_x0_y0_superFocus_") {
      actiCartoonId = 825;
      // 机灵宠物车
    } else if (curFocus.FocusID == "hands_x0_y0_petCarFocus_") {
      actiCartoonId = 803;
      // 爆冲火箭车之飞擎的召唤
    } else if (curFocus.FocusID == "hands_x0_y0_callFocus_") {
      actiCartoonId = 1385;
      // 巨神战队之轨道先锋
    } else if (curFocus.FocusID == "hands_x0_y0_armorFocus_") {
      actiCartoonId = 823;
      // 免费跳详情页标识
      CT.setCookie("actiJumpFreeDetailsPage", actiCartoonId);
    }
    var activityCarId = actiCartoonId;
    CT.delCookie("memeryFocus");
    CT.setCookie("actiJumpOrderDetailsPage", activityCarId);
    // PAGE.otherPageParam = window.location.search.substring(1);
    // PAGE.otherPageParam =
    // "&userId=" +
    // actiUserId +
    // "&activityId=" +
    // actiActivityId +
    // "&contentId=" +
    // actiActivityId +
    // "&contentCName=" +
    // CT.querySearchUrlKey(window.location.href, "contentCName");
    CT.setCookie("backFocus",curFocus.FocusID);
    CT.goPage();
    var commpageId = 3;
    var cartoonData = { recommendDisplayType: 1, recommendDisplayValue: actiCartoonId, commpageId: commpageId };
      CT.toAnterRecommendUrl(cartoonData);
  },
  //   跳规则页
  jumpRulePage: function () {
    // 焦点记忆
    CT.setCookie("memeryFocus", curFocus.FocusID);
    CT.delCookie("backFocus");
    actiObj.actiCommonJumpUrl("./acti_rulePage.html");
  },
  // 跳我的卡片页
  jumpMyCardsPage: function () {
    // 焦点记忆
    CT.setCookie("memeryFocus", curFocus.FocusID);
    CT.delCookie("backFocus");
    actiObj.actiCommonJumpUrl("./acti_myCardsPage.html");
  },
  // 跳兑换奖品页
  jumpExchangePage: function () {
    // 焦点记忆
    CT.setCookie("memeryFocus", curFocus.FocusID);
    CT.delCookie("backFocus");
    actiObj.actiCommonJumpUrl("./acti_exchangePage.html");
  },
  // 跳新玩法页
  jumpVideoPage: function () {
    // 焦点记忆
    var that = this;
    CT.delCookie("backFocus");
    if (that.isOrder == 1) {
    PAGE.otherPageParam = window.location.search.substring(1);
    PAGE.otherPageParam =
    "&userId=" +
    actiUserId +
    "&activityId=" +
    actiActivityId +
    "&contentId=" +
    actiActivityId +
    "&contentCName=" +
    CT.querySearchUrlKey(window.location.href, "contentCName");
      CT.goPage();
      orderJs.columnToOrderPage("acticity_puzzleAnimation");
    } else {
      CT.setCookie("memeryFocus", curFocus.FocusID);
      actiObj.actiCommonJumpUrl("./acti_watchVideo.html");
    }
  },
  // 跳订购
  jumpOrder: function () {
    var that = this;
    CT.setCookie("memeryFocus", curFocus.FocusID);
    CT.delCookie("backFocus");
    if (that.isOrder == 1) {
      PAGE.otherPageParam = window.location.search.substring(1);
    PAGE.otherPageParam =
    "&userId=" +
    actiUserId +
    "&activityId=" +
    actiActivityId +
    "&contentId=" +
    actiActivityId +
    "&contentCName=" +
    CT.querySearchUrlKey(window.location.href, "contentCName");
      CT.goPage();
      orderJs.columnToOrderPage("acticity_puzzleAnimation");
    } else {
      window.location.reload();
    }
  },
};
mainPage.initPage();
// 返回
function backFunc() {
  CT.delCookie("memeryFocus");
  CT.delCookie("backFocus");
  if (CT.$("jlTip").style.visibility == "visible") {
    CT.$("jlTip").style.visibility = "hidden";
    PAGE.changeFocus(mainPage.getBackCurrentFocus);
  } else if (CT.$("mcTip").style.visibility == "visible") {
    CT.$("mcTip").style.visibility = "hidden";
    PAGE.changeFocus(mainPage.getBackCurrentFocus);
  } else if (CT.$("dreamTip").style.visibility == "visible") {
    CT.$("dreamTip").style.visibility = "hidden";
    PAGE.changeFocus(mainPage.getBackCurrentFocus);
  } else {
    CT.backPage();
  }
}
