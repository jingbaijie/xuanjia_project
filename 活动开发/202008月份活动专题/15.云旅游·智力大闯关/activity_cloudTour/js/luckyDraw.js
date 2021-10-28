// 获取url查询字符串
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
function LotteryPage() {
  this.canClick = true;//用户当前是否可以点击抽奖
  this.lotteryIndex = 0; //抽奖按钮图片变量
  this.remainChance = getQueryString("remainChance") || 0; //今日剩余抽奖机会
  this.isOrder = getQueryString("isOrder") || 0; //是否订购,0表示已订购
  this.timeRecords; //时间记录
  this.lotteryAni = null; //定时器
  this.nowDate = 0; //当天日期
  this.getBackFocus; //记忆焦点
  this.init(); //页面初始化
  this.prizeList = null; //奖品列表
  this.prizeId = null; //获奖Id
  this.isPrize = false; //用户获奖信息
  this.isRing = false; //转盘是否在旋转中
  this.ringImg = document.getElementById("hands_x0_y0_lotteryBtnFocus_"); //旋转光标
  this.littleTips = document.getElementById("littleTips"); //旋转提示
  this.ringInterval = null; //旋转定时器
  this.ringTime = 200; //定时器执行时间
  this.ringNum = 0; //已旋转圈数
  this.ringFlag = 0; //旋转抽奖标志
  this.targetRing = 0; //最终旋转圈数
  this.targetPrize = 0; //最终停止奖品格
  this.prizeArr = [1, 3, 5, 7]; //奖品下标数组
  this.noPrizeArr = [0, 2, 4, 6]; //无奖品下标数组
  this.prizeIndex; //接口获取奖品下标
  this.ringArr = [
    [138, 366],
    [141, 545],
    [141, 724],
    [289, 722],
    [442, 722],
    [437, 545],
    [437, 366],
    [289, 366],
  ];
  this.cartoonId; //跳转卡通id
  this.isShowTip = false; //弹窗是否显示，默认不显示
}
LotteryPage.prototype = {
  constructor: LotteryPage,
  /*
   *焦点初始化：初始化焦点为第一个卡通IP
   *有抽奖机会：抽奖按钮动画；无抽奖机会：次数用完按钮；抽奖中：抽奖中按钮；
   */
  init: function () {
    var _this = this;
    //获取活动奖品信息
    actiObj.getActivityPrize(function (prizeData) {
      if (prizeData.resultMsg == "success") {
        _this.prizeList = prizeData.list;
      } else {
        _this.prizeList = [];
      }
      //获取用户获奖信息
      actiObj.getUserPrizeInfo(function (userData) {
        if (userData.resultMsg == "success") {
          _this.isPrize = true;
        }
        //焦点初始化
        focusInit();
        curFocus = getFocusModel6("hands_x0_y0_lotteryBtnFocus_");
        curFocus.defaultFocus();
      });
    });
  },
  /*
   * 抽奖
   */
  lottery: function () {
    var _this = this;
    if (this.canClick) {
      this.canClick = false;
      if (this.remainChance > 0) {
        this.remainChance = parseInt(this.remainChance) - 1;
        //上传一次使用机会
        actiObj.setChance(function (res) {
          //转盘正在旋转
          _this.isRing = true;
          //概率计算
          _this.probabilityFunc();
          //转盘开始旋转
          _this.toRing();
        });
      } else {
        //if (actiUserId == "123") {
          this.tanchuangShow(4);//没有抽奖次数
        // } else {
        //   this.littleTips.innerHTML = "您当前未拥有抽奖机会";
        //   this.littleTips.style.visibility = "visible";
        //   setTimeout(function () {
        //     _this.littleTips.style.visibility = "hidden";
        //     _this.littleTips.innerHTML = "";
        //     _this.canClick = true;
        //   }, 2000);
        // }
      }
    }
  },
  /*
   * 概率计算3 2 1 0
   */
  probabilityFunc: function () {
    this.targetRing = Math.ceil(Math.random() * 3) + 3; //[4,6]随机数
    var userNum = Math.ceil(Math.random() * 1000); //[1,1000]随机数
    if (this.prizeList && userNum <= this.prizeList[0].prize_percentage && this.prizeList && this.prizeList[0].prize_num > 0 && !this.isPrize) {
      //一等奖步步高家教机
      this.prizeId = this.prizeList[0].prize_id;
      this.targetPrize = 1;
      this.prizeIndex = 0;
    } else if (this.prizeList && userNum <= this.prizeList[0].prize_percentage + this.prizeList[1].prize_percentage && this.prizeList[1].prize_num > 0 && !this.isPrize) {
      //二等奖富士instax立拍立得
      this.prizeId = this.prizeList[1].prize_id;
      this.targetPrize = 3;
      this.prizeIndex = 1;
    } else if (this.prizeList && userNum <= this.prizeList[0].prize_percentage + this.prizeList[1].prize_percentage + this.prizeList[2].prize_percentage && this.prizeList[2].prize_num > 0 && !this.isPrize) {
      //三等奖三只松鼠小闹钟
      this.prizeId = this.prizeList[2].prize_id;
      this.targetPrize = 5;
      this.prizeIndex = 2;
    } else if (this.prizeList && userNum <= this.prizeList[0].prize_percentage + this.prizeList[1].prize_percentage + this.prizeList[2].prize_percentage + this.prizeList[3].prize_percentage && this.prizeList[3].prize_num > 0 && !this.isPrize) {
      //四等奖宇宙护卫队绘本
      this.prizeId = this.prizeList[3].prize_id;
      this.targetPrize = 7;
      this.prizeIndex = 3;
    } else {
      this.targetPrize = this.noPrizeArr[Math.floor(Math.random() * 4)];
    }
  },
  /*
   * 转盘开始旋转
   */
  toRing: function () {
    var _this = this;
    this.ringTime = 200;
    clearInterval(this.ringInterval);
    actiObj.changeFocus("hands_x0_y0_lotteryBtnFocus_");
    this.ringInterval = setInterval(function () {
      _this.ringImg.style.top = _this.ringArr[_this.ringFlag % 8][0] + "px";
      _this.ringImg.style.left = _this.ringArr[_this.ringFlag % 8][1] + "px";
      //转一圈
      if (_this.ringFlag !== 0 && _this.ringFlag % 8 === 0) {
        _this.ringNum += 1;
      }
      //已转圈数达到目标圈数且距离目标奖品格小于三格时，降低旋转速度
      if (_this.ringNum >= _this.targetRing && Math.abs(_this.targetPrize - (_this.ringFlag % 8)) < 3) {
        _this.ringTime = 500;
        actiObj.removeClass(_this.ringImg, "fastRow");
        actiObj.addClass(_this.ringImg, "slowRow");
      }
      //已转圈数达到目标圈数且光标到达目标奖品格时停止转动
      if (_this.targetRing === _this.ringNum && _this.ringFlag % 8 === _this.targetPrize) {
        clearInterval(_this.ringInterval);
        _this.ringFlag = 0;
        _this.ringNum = 0;
        _this.stopRing(); //停止转动
      } else {
        _this.ringFlag++;
      }
    }, this.ringTime);
  },
  stopRing: function () {
    var _this = this;
    this.isRing = false;
    if (this.prizeArr.indexOf(this.targetPrize) > -1) {
      //判断奖品剩余
      if (this.prizeList[this.prizeIndex].prize_num > 0) {
        actiObj.setPrize(this.prizeId, function () {
          setTimeout(function () {
            _this.showGetPrize(_this.targetPrize);
          }, 1000);
        });
      } else {
        //奖品被抽完弹窗
        this.tanchuangShow(3);
      }
    } else {
      setTimeout(function () {
        _this.showNoPrize();
      }, 1000);
    }
  },
  /*
   * 获奖
   */
  showGetPrize: function (targetPrize) {
    this.isprize = true;
    this.isShowTip = true;
    if (targetPrize == 1 || targetPrize == 3 || targetPrize == 7 || targetPrize == 5) {
      this.tanchuangShow(1);
    }
  },
  /*
   * 没有中奖
   */
  showNoPrize: function () {
    this.isShowTip = true;
    this.tanchuangShow(2);
  },
  /*
   * 抽奖中勿操作提示
   */
  showTips: function () {
    var _this = this;
    this.littleTips.innerHTML = "转盘转动中，请勿做多余操作！";
    this.littleTips.style.visibility = "visible";
    setTimeout(function () {
      _this.littleTips.style.visibility = "hidden";
      _this.littleTips.innerHTML = "";
    }, 2000);
  },
  /*
   *弹窗显示
   */
  tanchuangShow: function (tipType) {
    this.isShowTip = true;
    CT.$("tipBG").style.visibility = "visible";
    //恭喜获奖
    if (tipType == 1) {
      this.isPrize = true;
      CT.$("tipImg").src = "img/alertT/3.png";
      actiObj.changeFocus("hands_x0_y0_phoneFocus_");
    } else if (tipType == 2) {//很遗憾没有获奖
      CT.$("tipImg").src = "img/alertT/2.png";
      actiObj.changeFocus("hands_x0_y0_tipImgFocus_");
    } else if (tipType == 3) {//奖品被抽完
      CT.$("tipImg").src = "img/alertT/1.png";
      actiObj.changeFocus("hands_x0_y0_tipImgFocus_");
    }else if(tipType == 4){//抽奖次数用完
      CT.$("tipImg").src = "img/alertT/nochanceTip.png";
      actiObj.changeFocus("hands_x0_y0_tipImgFocus_");
    }
  },
  //未中奖与奖品被抽完弹窗点击确认 
  clickOn: function () {
    this.canClick = true; 
    var returnUrl = CT.getCookie("returnUrl");   
    if(this.isOrder==0){
      CT.$("tipBG").style.visibility = "hidden";
      CT.$("tipImg").src = "img/empty.png";
      actiObj.changeFocus("hands_x0_y0_lotteryBtnFocus_");
    }else{
      orderJs.columnToOrderPage("actiCloudTour");
      if(returnUrl){
        setTimeout(function(){
          window.location.href=returnUrl;          
        },1000);
      } 
    }
  }
};
function ringFocusBack() {
  document.getElementById("hands_x0_y0_lotteryBtnFocus_").style.top = "288px";
  document.getElementById("hands_x0_y0_lotteryBtnFocus_").style.left = "540px";
}
function backfunc() {
  window.location.href = "./cloudTour.html?vTime=" + new Date().getTime() + "&isOrder=" + LotteryPageMain.isOrder + "&remainChance=" + LotteryPageMain.remainChance;
}
var LotteryPageMain = new LotteryPage();
