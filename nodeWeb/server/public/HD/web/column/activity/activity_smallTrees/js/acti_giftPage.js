//中奖名单
function prizeList() {
  actiObj.getPrizeUserInfo(function (data) {
    var rankList = CT.$("rankList");
    var rankHTML = "";
    var userId = "";
    if ((data.resultMsg = "success")) {
      var rankListArr = data.list || [];
      if (rankListArr.length > 0) {
        for (var i = 0; i < rankListArr.length; i++) {
          userId = rankListArr[i].USERID + "";
          userId = userId.substr(0, 4) + "****" + userId.substr(userId.length - 4);
          rankHTML +=
            '<div style="height: 30px"><span style="float: left">' +
            userId +
            '</span><span style="float: right">' +
            rankListArr[i].PRIZE_CNAME +
            "</span></div>";
        }
        rankList.innerHTML = rankHTML;

        var con = document.getElementById("rankscro");
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
}
prizeList();
var buttons = [
  {
    // 输入框
    id: "hands_x0_y0_telFocus_",
    otherFocusEvent: "javascript:",
    otherBlurEvent: "javascript:",
    clickHandler: "javascript:",
    left: "disable",
    right: "hands_x0_y0_saveFocus_",
    up: "hands_x0_y0_backFocus_",
    down: "disable",
    focusType: 7,
  },
  // 保存
  {
    id: "hands_x0_y0_saveFocus_",
    otherFocusEvent: "javascript:",
    otherBlurEvent: "javascript:saveBlur()",
    clickHandler: "javascript:saveFunc()",
    left: "hands_x0_y0_telFocus_",
    right: "hands_x0_y0_clearFocus_",
    up: "hands_x0_y0_backFocus_",
    down: "disable",
    focusType: 7,
  },
  // 清除
  {
    id: "hands_x0_y0_clearFocus_",
    otherFocusEvent: "javascript:",
    otherBlurEvent: "javascript:",
    clickHandler: "javascript:emptyFunc()",
    left: "hands_x0_y0_saveFocus_",
    right: "disable",
    up: "hands_x0_y0_backFocus_",
    down: "disable",
    focusType: 7,
  },
  // 返回
  {
    id: "hands_x0_y0_backFocus_",
    clickHandler: "javascript:backfunc()",
    up: "disable",
    left: "disable",
    right: "disable",
    down: "hands_x0_y0_clearFocus_",
    focusType: 7,
  },
];
focusInit();
curFocus = getFocusModel6("hands_x0_y0_telFocus_");
curFocus.defaultFocus();
//获奖名单渲染
//   actiObj.getPrizeUserInfo(function (res) {
//     var html = "";
//     if (res.resultMsg == "success") {
//       for (var i = 0; i < res.list.length; i++) {
//         html += "<li><span>" + res.list[i].USERID + "</span><span>" + res.list[i].PRIZE_CNAME + "</span></li>";
//         // CT.$("nameList").innerHTML = html;
//       }
//     }
//   });

//获取用户中奖信息
actiObj.getUserPrizeInfo(function (res) {
  if (res.resultMsg == "success") {
    CT.$("prizeInfo").innerHTML = "您已中奖";
  } else {
    CT.$("prizeInfo").innerHTML = "您未获得奖品";
  }
});

//焦点是否在输入框上
var isOnFocus = true;

//当前用户手机号
var userPhone = "";

//焦点获焦在输入框中执行的方法
function onFocus(index) {
  isOnFocus = index == 1 ? true : false;
}

//手机号输入框
var telInput = document.getElementById("telInput").innerHTML;
//去除字符串内所有的空格
telInput = telInput.replace(/\s*/g, "");
//获取手机号
actiObj.getUserPhone(function (res) {
  CT.$("userInfo").innerHTML = res.userId;
  if (res.userPhone != null) {
    document.getElementById("telInput").innerHTML = res.userPhone;
    phoneNum = res.userPhone;
  }
});

var phoneNum = telInput;
//监听用户遥控器输入的数字
function changeNum(num) {
  if (isOnFocus) {
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
    document.getElementById("telInput").innerHTML = phoneNum;
  }
}

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
    document.getElementById("telInput").innerHTML = "";
    phoneNum = "";
    document.getElementById("saveTips").innerHTML = "请输入正确的手机号";
  }
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
