var isPassed = false; // 显示答题页正确图标按钮
var chanceNum = 0; //今日抽奖机会
var remainChance = 0; //今日剩余抽奖机会
var useChance = 0; //今日使用抽奖机会
var isOrder = 1; //是否订购,0表示已订购
var totalChance = 0; //总的抽奖机会
var userDataList = ["716", "0",];//用户今日闯关城市信息;["闯关日期","已使用答题机会",{"cityName":"城市缩写","isPassed":true/false}]
var cityArr = ["nj", "sz", "gl", "xa", "cd"];//所有未参与的城市名称，目前只需要三个城市，可在这数组中注销掉2个城市
var prizeListInter = null;//获奖名单滚动定时器
var timer;//页面移动第定时器
var scrollFocus = {//不同闯关城市焦点对应的页面定位
  "start": { top: 0, id: "hands_x0_y0_cloudTour0_" },
  "nj": { top: -720, id: "hands_x0_y0_cloudTour4_" },
  "sz": { top: -720 * 2, id: "hands_x0_y0_cloudTour5_" },
  "gl": { top: -720 * 3, id: "hands_x0_y0_cloudTour6_" },
  "xa": { top: -720 * 4, id: "hands_x0_y0_cloudTour7_" },
  "cd": { top: -720 * 5, id: "hands_x0_y0_cloudTour8_" }
};
var cityEnter = false;//城市是否能够点击进入


// 获取url查询字符串
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

var fromCity = getQueryString("fromgCity");//获取从哪个城市返回的信息
if (fromCity) {
  fromCity = getQueryString("fromgCity");
} else {
  fromCity = "start";
}
function init() {
  // 焦点初始化:若有记录城市则焦点在记录城市，否则在默认第一个
  focusInit();
  if (fromCity) {
    curFocus = getFocusModel6(scrollFocus[fromCity].id);
  }
  curFocus.defaultFocus();
}

var cityFocusArr = [];//城市数组


// 调用鉴权方法  已订购用户进入页面有三次闯关机会 每闯关成功一次就有一次抽奖机会 当天最多有三次抽奖机会
// 订购用户每天登录活动页面进行签到闯关  完成一个闯关活动  即获得一次抽奖机会
// 未订购用户可试玩第一关卡的任务 第一关若是试玩，结束后则返回至首页，在首页做统一跳订购处理
// 鉴权识别当前用户是已订购用户还是未订购用户
orderJs.columnGetAuth(function (data) {
  if (data == 0) {
    isOrder = 0;
  } else {
    isOrder = 1;
    CT.setCookie("returnUrl", window.location.href);
  }
  //初始化焦点
  init();
  cityFocusArr = [PAGE.focusArr[0], PAGE.focusArr[4], PAGE.focusArr[5], PAGE.focusArr[6], PAGE.focusArr[7], PAGE.focusArr[8]];//城市数组
  var nowDate = new Date().getMonth() + 1 + "" + new Date().getDate(); //当天日期
  // 获取当前用户已闯关城市
  actiObj.getUserDataList(function (res) {
    if (res.resultMsg == "success" && res.list[0].user_acti_data) {//获取当前用户当天的闯关信息
      userDataList = JSON.parse(res.list[0].user_acti_data);
      if (nowDate != userDataList[0]) {//如果存储日期与当天日期不一样，则重新设置闯关信息
        userDataList = [nowDate, "0"];
      }
    } else {//未正常获取到闯关信息，则重新设置闯关信息
      userDataList = [nowDate, "0"]
    }

    // 0
    if (getQueryString("totalChance")) {
      totalChance = getQueryString("totalChance");//眉头获取总抽奖机会
    } else {
      if (isOrder == 0) {
        totalChance = 3;//订购用户赠送三次	  
      } else {
        totalChance = 1;//未订购用户赠送一次	
      }
    }
    if (isOrder == 0) {
      for (var i = 1; i < cityFocusArr.length; i++) {
        cityFocusArr[i].focusmodel.enable = false;
      }
      if (userDataList.length == 6 && userDataList[5].isPassed) {//西安通过
        cityFocusArr[5].focusmodel.enable = true;
      } else if (userDataList.length == 5 && userDataList[4].isPassed) {//桂林通过
        cityFocusArr[4].focusmodel.enable = true;
      } else if (userDataList.length == 4 && userDataList[3].isPassed) {//苏州站通过
        cityFocusArr[3].focusmodel.enable = true;
      } else if (userDataList.length == 3 && userDataList[2].isPassed) {//南京站通过
        cityFocusArr[2].focusmodel.enable = true;
      } else {
        cityFocusArr[1].focusmodel.enable = true;
      }
    }
    //获取到当前城市数据，前面的城市一定都是闯关通过的蓝色；若没有闯关城市数据，则没有蓝色闯关成功图标  
    for (var i = 2; i < userDataList.length; i++) {//成功闯一关，显示蓝色按钮，点击蓝色按钮出现去下一关弹窗
      if (userDataList[i]) {
        if (userDataList[i].isPassed == true) {
          document.getElementById(userDataList[i].cityName + "Done").src = "./img/cg(1).png";
          PAGE.focusArr[i + 2].focusmodel.enable = true;//开启当前焦点           
        }
        if (!userDataList[i].isPassed) {
          for (var m = 0; m < cityArr.length; m++) {
            document.getElementById(cityArr[m] + "Done").src = "./img/empty.png";
          }
        }
      }
    }
    //获取用户剩余抽奖机会
    actiObj.getChance(function (chanceData) {
      if (chanceData) {
        useChance = chanceData.activityChance;
      } else {
        userChance = 0;
      }
      //已订购用户使用当前获取的抽奖机会减去用掉的抽奖机会获得剩余抽奖机会
      remainChance = (totalChance - useChance) > 0 ? (totalChance - useChance) : 0;
      CT.$("userInfo").innerHTML = remainChance;
      setActiPrizeInfo();//根据用户获奖信息及活动获奖信息设置用户中奖榜单内容
    });
  });
});

//设置当前活动的中奖信息，包括用户中奖信息以及活动内所有用户的获奖信息
function setActiPrizeInfo() {
  //获取用户中奖信息
  actiObj.getUserPrizeInfo(function (res) {//获取当前用户获奖信息
    if (res.resultMsg == "success") {
      CT.$("prizeInfo").innerHTML = res.list.PRIZE_CNAME;
    } else {
      CT.$("prizeInfo").innerHTML = "未中奖";
    }
  });
  actiObj.getPrizeUserInfo(function (prizeData) {//获取当前活动所有中奖用户信息
    var nameRoll = CT.$("nameRoll");
    if (prizeData.resultMsg == "success") {
      var prizeList = prizeData.list;
    } else {
      var prizeList = [];
    }
    //渲染榜单
    for (var i = 0; i < prizeList.length; i++) {
      nameRoll.innerHTML += "<li><span class = 'listName'>" + (prizeList[i].USERID.substr(0, 3) + "****" + prizeList[i].USERID.substr(prizeList[i].USERID.length - 4, 4)) + "</span><span class = 'listPrize'>" + prizeList[i].PRIZE_CNAME + "</span></li>";
    }
    //中奖用户超过10个，开启榜单滚动功能
    if (prizeList.length > 10) {
      for (var i = 0; i < prizeList.length; i++) {
        nameRoll.innerHTML += "<li><span class = 'listName'>" + (prizeList[i].USERID.substr(0, 3) + "****" + prizeList[i].USERID.substr(prizeList[i].USERID.length - 4, 4)) + "</span><span class = 'listPrize'>" + prizeList[i].PRIZE_CNAME + "</span></li>";
      }
      prizeListInter = setInterval(function () {
        nameRoll.style.top = parseInt(nameRoll.style.top) - 10 + "px";
        if (parseInt(nameRoll.style.top) < (0 - prizeList.length * 18)) {
          nameRoll.style.top = "0px";
        }
      }, 200)
    }
  });
}
// 跳转活动规则
function jumpToGz() {
  window.location.href = "./activityRule.html?vTime=" + new Date().getTime() + "&isOrder=" + isOrder + "&remainChance=" + remainChance + "&totalChance=" + totalChance;
}

// 跳转抽奖页面
function jumpToName() {
  window.location.href = "./luckyDraw.html?vTime=" + new Date().getTime() + "&remainChance=" + remainChance + "&isOrder=" + isOrder;
}

//点击开始云旅游，跳转至对应的未旅游地
function scrollDown(direction) {
  var failStatus = false;//未失败
  var nowDate = new Date().getMonth() + 1 + "" + new Date().getDate(); //当天日期
  for (var i = 2; i < userDataList.length; i++) {
    if (userDataList[i] && userDataList[i].isPassed == false) {
      failStatus = true;//失败状态
    }
  };
  if (isOrder == "0") {//用户已订购情况下
    //已使用答题机会没超过三次，存储了七条数据，则重置游戏首页
    if (userDataList[1] < 3) {//用户当前闯关机会未使用完，则移动到南京站
      actiObj.changeFocus("hands_x0_y0_cloudTour4_");
      if (userDataList[1] < 3 && (userDataList.length >= 7 || failStatus)) {
        userDataList = [nowDate, userDataList[1]];
        fromCity = "nj";
        init();
        for (var i = 1; i < cityFocusArr.length; i++) {
          cityFocusArr[i].focusmodel.enable = false;
        }
        if (userDataList.length == 6 && userDataList[5] && userDataList[5].isPassed) {//西安通过
          cityFocusArr[5].focusmodel.enable = true;
        } else if (userDataList.length == 5 && userDataList[4] && userDataList[4].isPassed) {//桂林通过
          cityFocusArr[4].focusmodel.enable = true;
        } else if (userDataList.length == 4 && userDataList[3] && userDataList[3].isPassed) {//苏州站通过
          cityFocusArr[3].focusmodel.enable = true;
        } else if (userDataList.length == 3 && userDataList[2] && userDataList[2].isPassed) {//南京站通过
          cityFocusArr[2].focusmodel.enable = true;
        } else {
          cityFocusArr[1].focusmodel.enable = true;
        }
        for (var m = 0; m < cityArr.length; m++) {
          document.getElementById(cityArr[m] + "Done").src = "./img/empty.png";
        }
      }
    } else {//所有闯关机会已使用完毕，提示今日机会用完
      var confirmModal = document.getElementById("confirmModalImg");
      confirmModal.src = "./img/alertT/noChance.png";
      confirmModal.style.visibility = "visible";
      actiObj.changeFocus("hands_x0_y0_confirmModal_");
    }
  } else {
    if (CT.getCookie("haveTry") == "yes") {//用户未订购且试玩已结束，提示用户去订购,否则下移到第一关(南京关)
      var confirmModal = document.getElementById("confirmModalImg");
      confirmModal.src = "./img/alertT/goToOrder.png";
      confirmModal.style.visibility = "visible";
      actiObj.changeFocus("hands_x0_y0_confirmModal_");
    } else {
      actiObj.changeFocus("hands_x0_y0_cloudTour4_");
    }
  }
}
//当旅游城市开始闯关焦点获焦时，执行滑动到对应页面方法
function scrollToCity(cityName) {
  var scrollPage = CT.$("pages");
  if (scrollFocus[cityName]) {
    scrollPage.style.top = scrollFocus[cityName].top + "px";
  }
}
// 各个城市打卡闯关
function clockIn(cityName) {
  CT.setCookie("isPassedList", JSON.stringify(userDataList));//存储当前闯关信息给下一个页面
  if (isOrder == 0) {//已订购
    if(userDataList[1] >=3){//次数用完
      var confirmModal = document.getElementById("confirmModalImg");
      confirmModal.src = "./img/alertT/noChance.png";
      confirmModal.style.visibility = "visible";
      actiObj.changeFocus("hands_x0_y0_confirmModal_");
    }else if (CT.$(cityName + "Done").src.indexOf("img/cg(1).png")>-1) { // 点击的时候如果该按钮是蓝色的，出现去下一关提示弹窗
      CT.setCookie("cityDone", cityName);
      var confirmModal = document.getElementById("confirmModalImg");
      confirmModal.src = "./img/alertT/next.png";
      confirmModal.style.visibility = "visible";
      actiObj.changeFocus("hands_x0_y0_confirmModal_");
      CT.$("confirmModal").style.left=572+"px";
      CT.$("confirmModal").style.top=486+"px";
    } else if (cityName == 'gl') {
      window.location.href = "findDiff.html?cityName=" + cityName + "&isOrder=" + isOrder + "&remainChance=" + remainChance;
    } else if (cityName == "cd") {
      window.location.href = "answerQuestion.html?cityName=" + cityName + "&isOrder=" + isOrder + "&remainChance=" + remainChance + "&totalChance=" + totalChance;
    } else {
      window.location.href = "answerQuestion.html?cityName=" + cityName + "&isOrder=" + isOrder + "&remainChance=" + remainChance;
    }
  } else {
    if (CT.getCookie("haveTry") == "yes") {//用户未订购且试玩已结束，提示用户去订购,否则存试玩机会只能跳进南京站
      var confirmModal = document.getElementById("confirmModalImg");
      confirmModal.src = "./img/alertT/goToOrder.png";
      confirmModal.style.visibility = "visible";
      actiObj.changeFocus("hands_x0_y0_confirmModal_");
    } else {
      if (cityName == "nj") {
        CT.setCookie("haveTry", "yes");//设置当前用户已试玩标识
        window.location.href = "answerQuestion.html?cityName=" + cityName + "&isOrder=" + isOrder + "&remainChance=" + remainChance;
      }
    }
  }
}
// 更多精彩跳转卡通
function jumpCartoon() {
  CT.setCookie("columnBackUrl", window.location.href);
  getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=1132", curFocus.FocusID);
}
// 弹框焦点点击事件
function confirmClick() {
  var confirmModal = document.getElementById("confirmModalImg");
  var cityDone = CT.getCookie("cityDone");
  if (confirmModal.src.indexOf("goToOrder") > -1) {//提示订购弹窗跳转订购
    orderJs.columnToOrderPage("actiCloudTour");
  } else if (confirmModal.src.indexOf("next") > -1 && cityDone) {//去下一关
    confirmModal.src = "./img/empty.png";
    confirmModal.style.visibility = "hidden";
    for (var i = 0; i < cityArr.length; i++) {
      if (cityDone == cityArr[i]) {  
        if(i<4){
          actiObj.changeFocus("hands_x0_y0_cloudTour" + (i + 5) + "_");
        }else{
          actiObj.changeFocus("hands_x0_y0_cloudTour0_");
        }
      }
    }    
  } else {//其余弹窗则隐藏弹窗
    confirmModal.src = "./img/empty.png";
    confirmModal.style.visibility = "hidden";
    actiObj.changeFocus("hands_x0_y0_cloudTour0_");
  }
}
// 返回
function backfunc() {
  var confirmModal = document.getElementById("confirmModalImg");
  if (confirmModal.style.visibility == "visible") {//有弹窗时隐藏弹窗
    confirmModal.src = "./img/empty.png";
    confirmModal.style.visibility = "hidden";
    actiObj.changeFocus("hands_x0_y0_cloudTour0_");
  } else if (parseInt((CT.$("pages").style.top)) < 0) {//不在首页时返回首页
    actiObj.changeFocus("hands_x0_y0_cloudTour0_");
    CT.$("pages").style.top = "0px";
  } else {
    CT.delCookie("returnUrl");
    BackPortalMainPage();
  }
}
