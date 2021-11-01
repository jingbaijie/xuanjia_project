CT.$("main").style.top = "0px";
var commonPageInfo = basePageInfo.commonPageInfo;
var page = {
  //页面是否已完成注册焦点
  alreadyInitFocus: false,
  //页面是否已加载瀑布流图片
  alreadyLoadPBLImg: false,
  //页面id
  contentId: commonPageInfo.pageInfo.commonPageId || 1,
  //瀑布流数据
  pinterestData: null,
  //最大的div存放瀑布流DOM
  parentBox: document.getElementById("main"),
  //main的top值
  parentBoxHeight: 0,
  //比较当前行的数组,如果当前行填满则清空数组
  comPareArray: [{ curRowNum: 0, h: 720 }],
  //当前比较数组下标
  comPareArrayIndex: 0,
  //默认初始Left值
  defaultFocus: "hands_x0_y0_DMSYvideo_",
  defaultFocus2: "hands_x0_y0_DMSYKW0_",
  defaultFocusID: CT.requestValue("curFocusId"),
  //默认初始Left值
  defaultLeft: 40,
  //默认初始元素上下间隔值
  defaultSpaceCol: 20,
  //默认初始元素左右间隔值
  defaultSpaceRow: 20,
  //默认初始焦点图元素左上错位值
  defaultStartValue: 6,
  //默认瀑布流展示高度
  defaultHeight: 563,
  //默认初始top值
  defaultTop: 700,
  //是否已经加载完
  isLoaded: false,
  //小窗口是否在播放
  isPlayingVideo: true,
  //所有推荐位的more1 数据
  moer1DataJson: [],
  //main当前的top值，只用于首页离开后再返回到首页使用，实现来哪去哪
  mainTop: CT.requestValue("mainTop") || false,
  //跑马灯功能
  // 是否添加跑马灯
  isMarquee: true,
  // 跑马灯数据
  recommendMarquee: null,
  //广告功能
  // 是否显示广告
  isPoster: true,
  // 广告数据
  recommendPoster: null,
  // 第一屏固定推荐数据
  recommendFirstScreenFiexd: [],
  // 小视频区域数据
  recommendPlayer: [],
  //小视频数据
  recommendSmallVideoArr: [],
  //当前播放哪个小视频
  nowSmallVideoIndex: 0,
  //当前播放小视频所属的卡通
  CurCartoonId: null,
  //当前播放小视频所属的卡通视频列表信息： 'smallVideoListInfo' + CurCartoonId
  // 排行榜数据
  recommendRank: [],
  //小海贝悬浮框小人焦点的上一个焦点
  XHBLastFocusId: null,
  //切换播放小视频的计时器： videoPlayer.timer
  //小海贝动画计时器
  xhbBtnAnimationTimer: null,
  //主题列表数组
  themeListArr: [],
  //当前主题对象
  curThemeObj: null,

  isAnimationOn: true, // 是否使用焦点动画

  /** ************************ 功能性推荐位 1-轮播，2-排行，3-小视频，4-火车头 *****************************/
  recommendScroll: [], // 轮播图数据
  scrollId: 9999, // 轮播图所在推荐位
  rankId: 9999, // 排行榜所在推荐位
  playId: 9999, // 小视频所在推荐位
  //trainId: 9999,                         // 小火车所在推荐位
  dotPosition: -155, // 调整轮播图小圆点位置,
  dotW: 16, // 轮播图小圆点宽
  dotM: 10, // 轮播图小圆点间隙
  rankList: false, // 是否生成排行榜
  isPlay: false, // 是否生成小视频
  isTrain: false, // 是否生成小火车
  rankBoxTop: 62, // 排行榜内容盒子的top调整参数
  rankBoxHeight: 70, // 排行榜内容盒子的高度调整参数
  wordNums: 0, // 排行榜所能容纳字数
  isOnPlay: false, // 判断是否播放
  playObj: {
    // 小视频尺寸
    t: 238,
    l: 420,
    w: 400,
    h: 220,
  },
  //一元周卡用户状态
  cardState: null,
  //周卡背景动画计时器
  gifTimer: null,
  //倒计时计时器
  timeTimer: null,
  //周卡倒计时秒数
  cardTime: (commonPageInfo.recommend_14 && commonPageInfo.recommend_14[0] && parseInt(commonPageInfo.recommend_14[0].more1)) || 30,
  /**
   * 初始化页面，请求到页面需要的所有数据
   */
  init: function () {
    var _this = this;
    if (_this.inited == true) return;
    _this.inited = true;
    var data = AjaxConfig.commonPageInfo;
    try {
      interface.getUserState(
        {
          params: {
            userId: xjDataLog.getUserId(),
            activityId: 22,
            state: 1,
          },
        },
        function (res) {
          _this.cardState = res.data.state;
          if (res.data.state == 0) {
            interface.getOldUserState(
              {
                params: {
                  userId: xjDataLog.getUserId(),
                  activityId: 23,
                  state: 1,
                  database: "cloud_base_channel_log_v1_3",
                },
              },
              function (resOld) {
                _this.cardState = resOld.data.state;
                // console.log(resOld);
              }
            );
          }
          // CT.alertTip("新老用户状态:"+_this.cardState,{time:3000});
          // console.log(res);
        }
      );
    } catch (error) {}
    var authObj = {
      successCallback: function () {
        //初始化小视频
        _this.videoHidden(0);
        // CT.alertTip("已订购",{time:5000});
        console.log("已订购");
        var useChance = 0;
        // 判断用户是否是第一次进页面 是的话则跳快乐加倍页面
        actiObj.getMyChance(parseInt(xjDataLog.getUserId()), function (res) {
          useChance = res.data.activityChance;
          if (useChance >= 1) {
            //return;
          } else {
              actiObj.setMyChance(parseInt(xjDataLog.getUserId()), function (res) {
              if (res.errorCode == 1000) {
                var params = {
                  contentId: 766,
                  contentName: "happyjb",
                  contentType: "column",
                  action: "column",
                };
                CT.getAnterByIdOrAction(params);
              }
            });
          }
        });
      },
      failCallback: function () {
        _this.setCardState();
        console.log("未订购");
        // CT.alertTip("未订购",{time:5000});
      },
    };
    /** 赋值功能数据 */
    //启动自动寻找焦点，自动寻找焦点--不需要给光标定义上下左右的移动位置或事件，key3_4.js循环寻找最近的坐标
    AjaxConfig.isAutoFindFocus = true;
    //瀑布流数据
    _this.pinterestData = data.recommend_5;
    _this.initPageDom();
    //判断是否是南京地区，参与投票活动
    //orderJs.getAreaOfUser(function(res,areaCode){
    //    if(areaCode == '1002' || ",1502,1503,1504,1505,1506,1510,1508,1509,101000," .indexOf("," + areaCode + ",") >=0) {
    //       if (CT.$("hands_x0_y0_DMSYKW2_") && PAGE.getFocusModel6("hands_x0_y0_DMSYKW2_") && PAGE.getFocusModel6("hands_x0_y0_DMSYKW2_").TempData) {
    //            PAGE.getFocusModel6("hands_x0_y0_DMSYKW2_").TempData = basePageInfo.commonPageInfo.recommend_15[0];
    //            CT.$("DMSYKW2Img").src = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_15[0].recommendPic.picPath;
    //        }
    //        return;
    //    }
    //});
    setTimeout(function () {
      orderJs.getAuth(authObj);
      if (CT.$("cardAlertDiv").style.display == "none") {
        PAGE.getModelByFocusId("hands_x0_y0_yyzk_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_orderYK_").enFocus = false;
        PAGE.getModelByFocusId("hands_x0_y0_cancel_").enFocus = false;
        _this.videoHidden(0);
      }
    }, 200);
  },

  //一元周卡状态判断
  setCardState: function () {
    var _this = this;
    if (_this.cardState == "1") {
      actiActivityId = 22;
      actiObj.getChance(function (res) {
        // console.log(res)
        if (res.data.activityChance == 0) {
          CT.setCookie("cardActId", "22");
          _this.showOrderPop();
          setTimeout(function () {
            PAGE.changeFocus("hands_x0_y0_yyzk_");
          }, 400);
          actiObj.setChance(function (res) {
            // console.log(res)
          });
        }
      });
    } else if (_this.cardState == "2") {
      actiActivityId = 23;
      actiObj.getChance(function (res) {
        // console.log(res)
        if (res.data.activityChance == 0) {
          CT.setCookie("cardActId", "23");
          _this.showOrderPop();
          setTimeout(function () {
            PAGE.changeFocus("hands_x0_y0_yyzk_");
          }, 400);
          actiObj.setChance(function (res) {
            // console.log(res)
          });
        }
        // else {
        //   var useChance = 0;
        //   // 判断用户是否是第一次进页面 是的话则跳快乐加倍页面
        //   actiObj.getMyChance(parseInt(xjDataLog.getUserId()), function (res) {
        //     useChance = res.data.activityChance;
        //     if (useChance >= 1) {
        //       return;
        //     } else {
        //         actiObj.setMyChance(parseInt(xjDataLog.getUserId()), function (res) {
        //         if (res.errorCode == 1000) {
        //           var params = {
        //             contentId: 766,
        //             contentName: "happyjb",
        //             contentType: "column",
        //             action: "column",
        //           };
        //           CT.getAnterByIdOrAction(params);
        //         }
        //       });
        //     }
        //   });
        // }
      });
    }
  },

  /**
   * 新老用户分层弹窗
   */
  showOrderPop: function () {
    var _this = this;
    var cardNewData = basePageInfo.commonPageInfo.recommend_12;
    var cardOldData = basePageInfo.commonPageInfo.recommend_13;
    if (basePageInfo.commonPageInfo.recommend_12 || basePageInfo.commonPageInfo.recommend_13) {
      CT.$("cardAlertDiv").style.display = "block";
      //新用户背景
      if (_this.cardState == 1) {
        CT.$("setTime").className = "newFont";
        //背景
        if (CT.$("cardAlertDiv")) {
          CT.$("cardAlertDiv").style.background = "";
        }
        if (CT.$("cardBackground")) {
          CT.$("cardBackground").style.background = "url(" + AjaxConfig.imgUrl + cardNewData[0].recommendPic.picPath + ") center center no-repeat";
        }
        CT.$("hands_x0_y0_yyzk_").style.background = "url(" + AjaxConfig.imgUrl + cardNewData[1].recommendPic.picPath + ") center center no-repeat";
        CT.$("yyzk").src = AjaxConfig.imgUrl + cardNewData[1].recommendLabelpic.picPath;
        CT.$("yyzk").style.top = "-16px";
        CT.$("yyzk").style.left = "-8px";
        CT.$("hands_x0_y0_yyzk_").style.top = "602px";
        CT.$("hands_x0_y0_yyzk_").style.left = "440px";
        CT.$("hands_x0_y0_yyzk_").style.width = "179px";
        CT.$("hands_x0_y0_yyzk_").style.height = "87px";

        CT.$("hands_x0_y0_orderYK_").style.background =
          "url(" + AjaxConfig.imgUrl + cardNewData[2].recommendPic.picPath + ") center center no-repeat";
        CT.$("orderYK").src = AjaxConfig.imgUrl + cardNewData[2].recommendLabelpic.picPath;
        CT.$("orderYK").style.top = "-16px";
        CT.$("orderYK").style.left = "-8px";
        CT.$("hands_x0_y0_orderYK_").style.top = "602px";
        CT.$("hands_x0_y0_orderYK_").style.left = "655px";
        CT.$("hands_x0_y0_orderYK_").style.width = "179px";
        CT.$("hands_x0_y0_orderYK_").style.height = "87px";
      } else if (_this.cardState == 2) {
        //老用户动画
        CT.$("setTime").className = "oldFont";
        CT.$("cardAlertDiv").style.background =
          "url(" + AjaxConfig.imgUrl + cardOldData[3].pageRecommendConfigTabVos[0].picLibraryTab.picPath + ") center center no-repeat";

        var downTipData = cardOldData[3].pageRecommendConfigTabVos;
        var imgUrlArr = [];
        var imgUrl01 = AjaxConfig.imgUrl + downTipData[0].picLibraryTab.picPath;
        var imgUrl02 = AjaxConfig.imgUrl + downTipData[1].picLibraryTab.picPath;
        var imgUrl03 = AjaxConfig.imgUrl + downTipData[2].picLibraryTab.picPath;
        var imgUrl04 = AjaxConfig.imgUrl + downTipData[3].picLibraryTab.picPath;
        imgUrlArr.push(imgUrl01, imgUrl02, imgUrl03, imgUrl04);
        var animationIndex = 0;
        _this.gifTimer = setInterval(function () {
          if (animationIndex > 3) {
            animationIndex = 0;
          }
          var animationDiv = CT.$("cardAlertDiv");
          animationDiv && (animationDiv.style.background = "url(" + imgUrlArr[animationIndex] + ") center center no-repeat");
          animationIndex++;
        }, 1000);

        CT.$("hands_x0_y0_yyzk_").style.background = "url(" + AjaxConfig.imgUrl + cardOldData[1].recommendPic.picPath + ") center center no-repeat";
        CT.$("yyzk").src = AjaxConfig.imgUrl + cardOldData[1].recommendLabelpic.picPath;
        CT.$("yyzk").style.top = "0px";
        CT.$("yyzk").style.left = "0px";
        CT.$("hands_x0_y0_yyzk_").style.top = "528px";
        CT.$("hands_x0_y0_yyzk_").style.left = "356px";
        CT.$("hands_x0_y0_yyzk_").style.width = "327px";
        CT.$("hands_x0_y0_yyzk_").style.height = "149px";

        CT.$("hands_x0_y0_orderYK_").style.background =
          "url(" + AjaxConfig.imgUrl + cardOldData[2].recommendPic.picPath + ") center center no-repeat";
        CT.$("orderYK").src = AjaxConfig.imgUrl + cardOldData[2].recommendLabelpic.picPath;
        CT.$("orderYK").style.top = "0px";
        CT.$("orderYK").style.left = "0px";
        CT.$("hands_x0_y0_orderYK_").style.top = "528px";
        CT.$("hands_x0_y0_orderYK_").style.left = "640px";
        CT.$("hands_x0_y0_orderYK_").style.width = "360px";
        CT.$("hands_x0_y0_orderYK_").style.height = "150px";

        //背景
        if (CT.$("cardBackground")) {
          CT.$("cardBackground").style.background = "url(" + AjaxConfig.imgUrl + cardOldData[0].recommendPic.picPath + ") center center no-repeat";
        }
      }
      PAGE.focusInit();
      PAGE.getModelByFocusId("hands_x0_y0_yyzk_").enFocus = true;
      PAGE.getModelByFocusId("hands_x0_y0_orderYK_").enFocus = true;
      PAGE.getModelByFocusId("hands_x0_y0_cancel_").enFocus = true;

      var maxtime = _this.cardTime; //倒计时
      _this.timeTimer = setInterval(function CountDown() {
        if (maxtime >= 0) {
          seconds = maxtime;
          msg = seconds;
          CT.$("setTime").innerHTML = msg;
          --maxtime;
        } else {
          _this.closePop();
        }
      }, 1000);
    }
  },

  //订购一元周卡或普通月卡
  toPayWeekCard: function () {
    if (window["xjButtonLock"]) {
      return;
    }
    window["xjButtonLock"] = true;
    var _this = this;
    if (curFocus.FocusID == "hands_x0_y0_yyzk_") {
      CT.setCookie("cardState", "true");
    }
    setTimeout(function () {
      orderJs.toPay();
    }, 100);
  },
  //关闭弹窗
  closePop: function () {
    var _this = this;
    CT.$("cardAlertDiv").style.display = "none";
    PAGE.getModelByFocusId("hands_x0_y0_yyzk_").enFocus = false;
    PAGE.getModelByFocusId("hands_x0_y0_orderYK_").enFocus = false;
    PAGE.getModelByFocusId("hands_x0_y0_cancel_").enFocus = false;
    PAGE.changeFocus("hands_x0_y0_DMSYKW0_");
    clearInterval(_this.timeTimer);
    clearInterval(_this.gifTimer);
    _this.videoHidden(0);
  },

  initPageDom: function () {
    var _this = this;
    var data = AjaxConfig.commonPageInfo;
    // 轮播图
    if (data.recommend_7) {
      _this.recommendScroll = data.recommend_7;
    }
    // 第一屏固定五个推荐位
    if (data.recommend_1) {
      _this.recommendFirstScreenFiexd = data.recommend_1;
      _this.firstScreenFiexdRecommend();
    }
    // 排行榜
    if (data.recommend_3) {
      _this.recommendRank = data.recommend_3;
      _this.firstScreenRankRecommend();
    }
    // 视频区域
    if (data.recommend_2) {
      _this.recommendPlayer = data.recommend_2;
      _this.recommendSmallVideoArr = _this.recommendPlayer.slice(2, 7);
      _this.firstScreenVideoRecommend();
    }
    _this.createTheme(function () {
      //创建下拉指示箭头
      document.getElementsByTagName("body")[0].innerHTML +=
        "<img id='downTipImg' style='position:absolute;top:650px;left:50px;' src='" +
        AjaxConfig.imgUrl +
        AjaxConfig.commonPageInfo.recommend_4[0].recommendPic.picPath +
        "'>";
      // 生成轮播图 recommendDisplayType 9 recommendDisplayValue recommend
      if (_this.autoPlay) {
        _this.autoPlayImg({ whitch: "firstScreenFiexd" });
      }
      // 小海贝悬浮框
      if (AjaxConfig.commonPageInfo.recommend_10) {
        // _this.xhbXFC();
      }
      //页面初始化焦点,实现来哪去哪先取眉头
      _this.alreadyInitFocus = true;
      PAGE.focusInit();
      if (_this.autoPlay) {
        PAGE.getFocusModel6("hands_x0_y0_DMSYKW" + _this.scrollId + "_").TempData = _this.recommendScroll[0];
      }
      var defaultFocus =
        CT.requestValue("curFocusId") && CT.requestValue("curFocusId").indexOf("hands_x0_y0_") > -1
          ? CT.requestValue("curFocusId")
          : _this.defaultFocus;
      setTimeout(function () {
        PAGE.changeFocus(defaultFocus);
        _this.defaultFocus = _this.defaultFocus2;
      }, 0);
      //初始化小视频
      // _this.videoHidden(0);
    });
  },
  /**
   * 生成主题选择弹框
   * */
  createTheme: function (callBack) {
    var _this = this;
    //获取主题列表
    // interface.getThemeList({ params: {}, ajaxConfig: { async: false } }, function (res) {
    var res = basePageInfo.selectThemeDetail;
    _this.themeListArr = res || [];
    //可供
    if (_this.themeListArr.length > 4) {
      var tempArr = [];
      for (var i = 0; i < _this.themeListArr.length; i++) {
        tempArr.push(_this.themeListArr[i]);
      }
      _this.themeListArr = tempArr;
    }
    if (!CT.$("themeListAlert")) {
      //创建主题列表div
      var themeListAlert = document.createElement("div");
      themeListAlert.id = "themeListAlert";
      themeListAlert.style.position = "absolute";
      themeListAlert.style.left = "0px";
      themeListAlert.style.top = "0px";
      themeListAlert.style.width = "1280px";
      themeListAlert.style.height = "720px";
      themeListAlert.style.background = "url(./HD/images/translucent.png) no-repeat";
      themeListAlert.style.visibility = "hidden";
      themeListAlert.style.zIndex = "1";
      //主题轮盘图
      var themeImg = new Image();
      themeImg.id = "themeImg";
      themeImg.src = AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendLabelpic.picPath;
      themeImg.style.position = "absolute";
      themeImg.style.left = "0px";
      themeImg.style.top = "280px";
      themeListAlert.appendChild(themeImg);
      //创建主题列表按钮
      var listBtnStartLeft = 160;
      var listBtnStartTop = 390;
      var listBtnStartStepC = 110;
      var listBtnStartStepR = 0;
      // switch (_this.themeListArr.length) {
      //     case 2:
      //         listBtnStartLeft = 140;
      //         listBtnStartTop = 295;
      //         break;

      //     case 3:
      //         listBtnStartLeft = 140;
      //         listBtnStartTop = 295;
      //         listBtnStartStepC = 100;
      //         break;

      //     case 4:
      //         listBtnStartLeft = 160;
      //         listBtnStartTop = 200;
      //         listBtnStartStepC = 30;
      //         break;
      //     default:
      //         break;
      // }
      for (var index = 0; index < _this.themeListArr.length; index++) {
        // listBtnStartTop = 270 +  (index ) * parseInt(280  / (_this.themeListArr.length + 1))  - 110/2;
        // listBtnStartLeft = 170 - Math.abs(index - parseInt(_this.themeListArr.length / 2)) * 45;
        listBtnStartTop = 230 + (index + 1) * parseInt(360 / (_this.themeListArr.length + 1)) - 110 / 2;
        listBtnStartLeft = 200 - Math.abs(index - parseInt(_this.themeListArr.length / 2)) * 45;
        //主题焦点div
        var themeBtn = document.createElement("div");
        themeBtn.id = "hands_x0_y0_themeBtn" + index + "_";
        themeBtn.style.position = "absolute";
        themeBtn.style.left = listBtnStartLeft + "px";
        themeBtn.style.top = listBtnStartTop + "px";
        //主题展示图
        var themeBtnShowImg = new Image();
        themeBtnShowImg.id = "themeBtnImg";
        themeBtnShowImg.style.position = "absolute";
        try {
          themeBtnShowImg.src = AjaxConfig.imgUrl + _this.themeListArr[index].themeAttrMap.THEME_COVER_PIC.split(",")[0];
        } catch (error) {}
        themeBtn.appendChild(themeBtnShowImg);
        //主题焦点图
        var themeBtnFocusImg = new Image();
        themeBtnFocusImg.id = "themeBtn" + index;
        themeBtnFocusImg.style.position = "absolute";
        themeBtnFocusImg.style.visibility = "hidden";
        try {
          themeBtnFocusImg.src = AjaxConfig.imgUrl + _this.themeListArr[index].themeAttrMap.THEME_COVER_PIC.split(",")[2];
        } catch (error) {}
        themeBtn.appendChild(themeBtnFocusImg);
        themeListAlert.appendChild(themeBtn);
        var btnObj = {
          id: "hands_x0_y0_themeBtn" + index + "_",
          clickHandler: "javascript:mainNavObj.changeDefaultTheme(" + CT.jsonToString(_this.themeListArr[index]) + ")",
          up: "hands_x0_y0_themeBtn" + (index - 1) + "_",
          down: "hands_x0_y0_themeBtn" + (index + 1) + "_",
          //left : 'hands_x0_y0_DMSYGN2_',
          leftEvent: "javascript:mainNavObj.hideThemeList()",
          right: "disable",
          focusType: _this.defaultFocusType,
          // TempData: _this.recommendFirstScreenFiexd[i],
          TempData: _this.themeListArr[index],
          enFocus: false,
        };
        if (index == 0) {
          btnObj.up = "disable";
        } else if (index == _this.themeListArr.length - 1) {
          btnObj.down = "disable";
        }
        buttons.push(btnObj);
      }
      //插入页面
      document.getElementsByTagName("body")[0].appendChild(themeListAlert);
    }
    callBack && callBack();
    // })
  },
  rankBlur: function (i) {
    CT.$("hands_x0_y0_DMSYPH" + i + "_").style.zIndex = 0;
  },
  rankFocus: function (i) {
    CT.$("hands_x0_y0_DMSYPH" + i + "_").style.zIndex = 100;
  },
  /**
   * 创建瀑布流元素
   * */
  loadPBL: function () {
    var _this = this;
    //是否已加载瀑布流图片
    if (_this.alreadyLoadPBLImg) {
      return;
    }
    _this.alreadyLoadPBLImg = true;
    var nowFocusId = "";
    try {
      nowFocusId = curFocus.FocusID;
    } catch (error) {}
    //各个推荐位的定位
    for (var i = 0, len = _this.pinterestData.length; i < len; i++) {
      try {
        //加载瀑布流图片
        CT.$("DMSYXLP" + i + "Img").src = CT.$("DMSYXLP" + i + "Img").getAttribute("imgsrc");
        CT.$("DMSYXLP" + i).src = CT.$("DMSYXLP" + i).getAttribute("imgsrc");
      } catch (error) {}
    }
    //document.getElementsByTagName('body')[0].innerHTML += "<img id='downTipImg' style='position:absolute;top:650px;left:50px;' src='" + AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendPic.picPath + "'>"
    if (_this.alreadyInitFocus && nowFocusId) {
      //不是初始化页面
      PAGE.focusInit();
      nowFocusId && PAGE.getFocusModel6(nowFocusId).defaultFocus();
    }
  },
  /**
   * 跑马灯开始
   * */
  runText: function (index) {
    var _this = this;
    var showTitle = curFocus.TempData.recommendDisplayName;
    if (showTitle.length > this.wordNums) {
      var len = this.wordNums * 2;
      CT.$("title" + index).innerHTML = CT.setMarquee(showTitle, len, 4);
    }
  },
  /**
   * 跑马灯结束
   * */
  stopText: function (index) {
    var _this = this;
    var showTitle = curFocus.TempData.recommendDisplayName;
    if (showTitle.length > this.wordNums) {
      var len = this.wordNums;
      CT.$("title" + index).innerHTML = (showTitle + "").substring(0, len - 1) + "…";
    }
  },

  /**
   * 轮播图
   * */
  autoPlayImg: function (initObj) {
    var _this = this;
    var initObj = initObj || {};
    var index = 0;
    var len = _this.recommendScroll.length; // 数据数量
    var dom = CT.$("hands_x0_y0_DMSYKW" + this.scrollId + "_"); // 轮播图
    var width = this.recommendScroll[0].recommendLabelpic.picW; // 图片宽度
    var w = this.recommendScroll[0].recommendLabelpic.picW.replace("px", "");
    var height = this.recommendScroll[0].recommendLabelpic.picH; // 图片高度
    var h = this.recommendScroll[0].recommendLabelpic.picH.replace("px", "");
    var top = height - 40; // 相对于main元素定位
    var left = 0; // 相对于main元素定位
    // 生成小点
    var dots =
      '<div id="dots" style="position: absolute; left: ' +
      left +
      "px; top: " +
      parseInt(top) +
      "px; width: " +
      width +
      "px;height: 20px;z-index: 0;padding: 0 " +
      (parseInt(w) - (_this.dotW + _this.dotM * 2) * parseInt(len)) / 2 +
      'px"></div>';
    if (initObj.whitch == "firstScreenFiexd") {
      //第一屏轮播小点
      CT.$("hands_x0_y0_DMSYKW" + this.scrollId + "_").innerHTML += dots;
    } else {
      //瀑布流轮播小点
      dom = CT.$("hands_x0_y0_DMSYXLP" + this.scrollId + "_"); // 轮播图
      top = dom.style.top.replace("px", ""); // 相对于main元素定位
      left = dom.style.left.replace("px", ""); // 相对于main元素定位
      var dots =
        '<div id="dots" style="position: absolute; left: ' +
        left +
        "px; top: " +
        (parseInt(top) + parseInt(h) - _this.dotPosition) +
        "px; width: " +
        width +
        "px;height: 20px;z-index: 10;padding: 0 " +
        (parseInt(w) - (_this.dotW + _this.dotM * 2) * parseInt(len)) / 2 +
        'px"></div>';
      CT.$("contentBox" + this.scrollId).innerHTML += dots;
    }
    var dotDoms = "";
    for (var i = 0; i < len; i++) {
      if (i == 0) {
        var dot =
          '<span id="dot' +
          i +
          '" style="float:left;width: ' +
          _this.dotW +
          "px; height: 16px;background-color: rgb(100, 100, 100);border-radius: 50%;line-height: 18px;margin: 0 " +
          _this.dotM +
          'px;"></span>';
      } else {
        var dot =
          '<span id="dot' +
          i +
          '" style="float:left;width: ' +
          _this.dotW +
          "px; height: 16px;background-color: #fff;border-radius: 50%;line-height: 18px;margin: 0 " +
          _this.dotM +
          'px;"></span>';
      }

      dotDoms += dot;
    }
    document.getElementById("dots").innerHTML += dotDoms;
    var scroll = function () {
      setTimeout(function () {
        try {
          index == len && (index = 0);
          var imgDom = CT.$("DMSYKW" + _this.scrollId + "Img");
          imgDom.src = AjaxConfig.imgUrl + _this.recommendScroll[index].recommendPic.picPath;
          for (var i = 0; i < len; i++) {
            CT.$("dot" + i).style.backgroundColor = "#fff";
          }
          CT.$("dot" + index).style.backgroundColor = "rgb(100, 100, 100)";
          PAGE.getFocusModel6("hands_x0_y0_DMSYKW" + _this.scrollId + "_").TempData = _this.recommendScroll[index];
          //已下架内容处理
          if (_this.recommendScroll[index].booleanUp == 0) {
            try {
              CT.$("DMSYKW" + _this.scrollId + "_booleanDown").style.display = "block";
            } catch (e) {}
          } else {
            try {
              CT.$("DMSYKW" + _this.scrollId + "_booleanDown").style.display = "none";
            } catch (e) {}
          }
          //已下架内容处理
          index++;
        } catch (error) {}
        scroll();
      }, 2500);
    };
    scroll();
  },
  /**
   *  生成第一屏固定推荐位
   * */
  firstScreenFiexdRecommend: function () {
    var _this = this;

    for (var i = 0; i < _this.recommendFirstScreenFiexd.length; i++) {
      var recommendDisplayValue = _this.recommendFirstScreenFiexd[i].recommendDisplayValue;
      if (recommendDisplayValue == 1) {
        // 判断是否为轮播图
        _this.autoPlay = true;
        _this.scrollId = i + "";
      }
    }
  },
  /**
   *  生成第一屏视频区域
   * */
  firstScreenVideoRecommend: function () {
    var _this = this;
  },
  /**
   * 排行榜
   * */
  firstScreenRankRecommend: function () {},
  /**
   *   生成小海贝悬浮窗
   *
   */
  xhbXFC: function () {
    var _this = this;
    //添加小海贝按钮动画
    var xhbXFCData = AjaxConfig.commonPageInfo.recommend_10;
    var imgUrlArr = [];
    var imgUrl0 = AjaxConfig.imgUrl + xhbXFCData[2].recommendLabelpic.picPath;
    imgUrlArr.push(imgUrl0);
    var imgUrl1 = AjaxConfig.imgUrl + xhbXFCData[2].recommendFocuspic.picPath;
    imgUrlArr.push(imgUrl1);
    //添加首页第一屏向下提示箭头动画
    var downTipData = AjaxConfig.commonPageInfo.recommend_4;
    var imgUrlArr1 = [];
    var imgUrl01 = AjaxConfig.imgUrl + downTipData[0].recommendPic.picPath;
    imgUrlArr1.push(imgUrl01);
    var imgUrl11 = AjaxConfig.imgUrl + downTipData[0].recommendFocuspic.picPath;
    imgUrlArr1.push(imgUrl11);
    var xhbAnimationIndex = 0;
    _this.xhbBtnAnimationTimer = setInterval(function () {
      if (xhbAnimationIndex > 1) {
        xhbAnimationIndex = 0;
      }
      CT.$("DMXHB0").src = imgUrlArr[xhbAnimationIndex];
      //添加首页第一屏向下提示箭头动画
      var xhbFocusBtn = CT.$("downTipImg");
      xhbFocusBtn && (xhbFocusBtn.src = imgUrlArr1[xhbAnimationIndex]);
      xhbAnimationIndex++;
    }, 300);
  },
  /**
   *   小海贝按钮获焦事件
   *   @param more1
   *   @returns {*}
   */
  xhbBtnGetFocus: function () {
    var _this = this;
    if (curFocus.lastFocusId.toUpperCase().indexOf("DMXHB") == -1) {
      _this.XHBLastFocusId = curFocus.lastFocusId;
    }
    _this.hidXhbXFC();
  },
  /**
   *   显示小海贝弹窗
   *   @param more1
   *   @returns {*}
   */
  showXhbXFC: function () {
    var _this = this;
    //隐藏小视频
    // videoPlayer.pausePlay();
    _this.videoHidden(-100, function () {});
    CT.$("xhbAlertDiv").style.visibility = "visible";
    PAGE.focusArr["hands_x0_y0_DMXHB2_"].focusmodel.enFocus = true;
    PAGE.focusArr["hands_x0_y0_DMXHB1_"].focusmodel.enFocus = true;
    PAGE.changeFocus("hands_x0_y0_DMXHB1_");
  },
  /**
   *   隐藏小海贝弹窗
   *   @param more1
   *   @returns {*}
   */
  hidXhbXFC: function () {
    var _this = this;
    //是否开启小视频
    // videoPlayer.startPlay();
    _this.videoHidden();
    CT.$("xhbShowImg").style.visibility = "hidden";
    CT.$("xhbAlertDiv").style.visibility = "hidden";
    PAGE.focusArr["hands_x0_y0_DMXHB2_"].focusmodel.enFocus = false;
    PAGE.focusArr["hands_x0_y0_DMXHB1_"].focusmodel.enFocus = false;
  },
  /**
   *   隐藏小海贝按钮往右切换焦点
   *   @param more1
   *   @returns {*}
   */
  xhbFocusRight: function () {
    var _this = this;
    CT.$("xhbShowImg").style.visibility = "visible";
    PAGE.changeFocus(_this.XHBLastFocusId || "hands_x0_y0_DMSYGN0_");
  },
  /**
   *   取more1数据,并返回一个对象
   *   isShowSelectedImg=true 是否完全显示光标图片，默认false ，特例：小火车车身
   *   isSetZIndex=true  是否设置z-index属性，默认false默认光标在下
   *   isVideo=true 小视频坑位
   *   toTop= true 回到顶部坑位
   *   isShowFont=true显示推荐位的文字描述
   *   @param more1
   *   @returns {*}
   */
  getMore1: function (more1) {
    return more1 ? CT.strToJson(more1) : {};
  },
  /**
   *    设置button
   *    配置光标图片conf.selectBorderImgUrl表示光标可用
   *    配置conf.isShowSelectedImg光标不可用（特例：小火车）
   *    @param conf 序号
   *    @returns {*}
   */
  setBtnObj: function (conf) {
    var _this = this;
    conf = conf || {};
    var btn = null;
    if (conf.selectBorderImgUrl && conf.isShowSelectedImg != 4) {
      btn = {
        id: "hands_x0_y0_DMSYXLP" + conf.index + "_",
        focusType: 7,
        clickHandler: 'javascript:page.toJump("bottom",' + conf.index + ")",
        otherFocusEvent: "javascript:page.focusEvent(" + conf.index + ")",
        otherBlurEvent: "javascript:page.blurEvent(" + conf.index + ")",
        TempData: conf.TempData,
      };
    } else {
      btn = {
        id: "hands_x0_y0_DMSYXLP" + conf.index + "_",
        focusType: 7,
        enFocus: false,
      };
    }
    var moreObj = CT.getMoresObj(conf.TempData.more2);
    if (moreObj.focusType) {
      btn.focusType = parseInt(moreObj.focusType);
      try {
        /*判断为低版本盒子
                if (btn.focusType == 6 && XJEPG.stbType == '1') {
                    btn.focusType = 7;
                    //_this.pinterestData[conf.index].recommendFocuspic && (CT.$('DMSYXLP' + conf.index).imgsrc = AjaxConfig.imgUrl + _this.pinterestData[conf.index].recommendFocuspic.picPath);
                }
                */
      } catch (error) {}
    }
    return btn;
  },

  /**
   *  1.开启或关闭视频
   *  2.隐藏或显示小视频位置的补图
   *  @param top 当前光标的top值
   */
  videoHidden: function (top, callBack) {
    var _this = this;
    clearTimeout(_this.videoHidden_timer);
    _this.videoHidden_timer = setTimeout(function () {
      var topNum = top || parseInt(CT.$("main").style.top.substring(0, CT.$("main").style.top.length - 2));
      if (top + "" == "0") {
        topNum = 0;
      }
      if (topNum < 0) {
        //top > _this.mainShowAreaHight
        //关闭小视频
        CT.show(CT.$("videoImg"));
        loggerInfo("play closeVideo: _this.isOnPlay=" + _this.isOnPlay + "---top:" + topNum);
        if (_this.isOnPlay) {
          if (videoPlayer.timer !== null) {
            clearInterval(videoPlayer.timer);
            videoPlayer.timer = null;
          }
          _this.isOnPlay = false;
          videoPlayer.exitPage();
          // try {
          //     videoPlayer.mp = new MediaPlayer();
          // } catch (error) {

          // }
        }
      } else {
        //开启小视频
        if (CT.$("main").style.top == "0px") {
          CT.hide(CT.$("videoImg"));
        }
        loggerInfo("play startVideo: _this.isOnPlay=" + _this.isOnPlay + "---top:" + topNum);
        if (!_this.isOnPlay) {
          _this.changeSmallVideo(_this.nowSmallVideoIndex);
          _this.isOnPlay = true;
        }
      }

      callBack && callBack();
    }, 500);
  },

  /**
   *  真正切换小视频播放
   */
  changeSmallVideoToDo: function (i) {
    var _this = this;
    _this.nowSmallVideoIndex = i;
    //改变小视频框绑定数据
    PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData = PAGE.getModelByFocusId("hands_x0_y0_DMSYvideolist" + i + "_").TempData;
    //改变小视频列表按钮播放标识状态
    for (var index = 0; index < _this.recommendSmallVideoArr.length; index++) {
      CT.$("videoListBtnBG" + index).style.visibility = "hidden";
      CT.$("videoListText" + index).style.width = "130px";
      CT.$("videoListText" + index).style.left = "10px";
      CT.$("videoListText" + index).style.color = "white";
      CT.$("videoListText" + index).innerHTML = _this.recommendSmallVideoArr[index].recommendDisplayName;
    }
    CT.$("videoListBtnBG" + i).style.visibility = "visible";
    CT.$("videoListText" + i).style.width = "105px";
    CT.$("videoListText" + i).style.left = "40px";
    CT.$("videoListText" + i).style.color = "#ffeb3b";
    //添加跑马灯
    if (PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData.recommendDisplayName) {
      var showTitle = " " + PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData.recommendDisplayName;
    } else {
      var showTitle = CT.$("videoListText" + i).innerHTML;
    }
    CT.$("videoListText" + i).innerHTML = CT.setMarquee(showTitle, 14, 6);
    clearTimeout(_this.playstartTimer);
    _this.playstartTimer = setTimeout(function () {
      if (CT.$("main") && CT.$("main").style.top && CT.$("main").style.top.substring(0, CT.$("main").style.top.length - 2) == "0") {
        //当前展示第一屏
        _this.playSmallVideo();
        _this.nowSmallVideoIndex++;
        if (_this.nowSmallVideoIndex >= _this.recommendSmallVideoArr.length) {
          _this.nowSmallVideoIndex = 0;
        }
      } else {
        _this.videoHidden(-100);
      }
    }, 600);
  },

  /**
   *  下视频列表按钮获焦事件
   *  重置当前小视频播放计时器
   */
  changeSmallVideo: function (i) {
    var _this = this;
    _this.changeSmallVideoToDo(i);
    //清除轮播播放小视频计时器
    clearInterval(videoPlayer.timer);
    videoPlayer.timer = null;
    videoPlayer.timer = setInterval(function () {
      //停止小视频播放
      _this.changeSmallVideoToDo(_this.nowSmallVideoIndex);
    }, 30000);
  },
  /**
   *  播放小视频
   */
  playSmallVideo: function () {
    var _this = this;

    if (CT.$("main").style.top.split("px")[0] != "0") {
      //不是在第一屏
      return;
    }
    _this.CurCartoonId = _this.recommendSmallVideoArr[_this.nowSmallVideoIndex].recommendDisplayValue;
    //看当前小视频所属卡通列表数据是否存在
    if (_this["smallVideoListInfo" + _this.CurCartoonId]) {
      //改变标记视频播放状态
      _this.isOnPlay = true;
      try {
        var playParams = {
          top: _this.playObj.t,
          left: _this.playObj.l,
          height: _this.playObj.h,
          width: _this.playObj.w,
          nns_ids: _this["smallVideoListInfo" + _this.CurCartoonId].data[0].movieDetails[0].playUrl, //合集媒资
          videoIndex: 0, //当前集数下标
          //上传小视频播放日志所用信息
          smallVideoInfo: _this["smallVideoListInfo" + _this.CurCartoonId].data[0],
        };
        videoPlayer.SmallPlay(playParams);
      } catch (e) {
        interface.loggerInfo("播放小视频失败：" + CT.jsonToString(e), "post");
      }
    } else {
      interface.findVideoListByCartoonId(
        {
          params: { cartoonId: _this.CurCartoonId },
          ajaxConfig: { async: true },
        },
        function (res) {
          //改变标记视频播放状态
          _this.isOnPlay = true;
          _this["smallVideoListInfo" + _this.CurCartoonId] = res;
          try {
            var playParams = {
              top: _this.playObj.t,
              left: _this.playObj.l,
              height: _this.playObj.h,
              width: _this.playObj.w,
              nns_ids: res.data[0].movieDetails[0].playUrl, //合集媒资
              videoIndex: 0, //当前集数下标
              //上传小视频播放日志所用信息
              smallVideoInfo: res.data[0],
            };
            videoPlayer.SmallPlay(playParams);
          } catch (e) {
            interface.loggerInfo("播放小视频失败A：" + CT.jsonToString(e), "post");
          }
        }
      );
    }
  },
  /*
        记录页面数据
        leaveDataObj ：离开页面参数对象
    */
  memoryPageLeaveData: function (leaveDataObj) {
    var _this = this;
    var obj = leaveDataObj || {};
    PAGE.otherPageParam =
      "&contentId=" +
      _this.contentId +
      "&contentEName=" +
      commonPageInfo.pageInfo.commPageEname +
      "&contentName=" +
      commonPageInfo.pageInfo.commPageEname +
      "&contentCName=" +
      commonPageInfo.pageInfo.commPageCname +
      "&contentType=" +
      CT.requestValue("contentType") +
      "&curFocusId=" +
      (obj.curFocusId || curFocus.FocusID) +
      "&mainTop=" +
      CT.$("main").style.top;
    CT.goPage();
  },
  /**
   *  跳转
   *  眉头跳转、瀑布流推荐位跳转、"返回到顶部"
   *  如果是瀑布流的跳转先判断产品是否已经下线，下线不跳转
   *  @param type 跳转的类型：bottom瀑布流推荐位跳转、Mid中间眉头跳转、Right右侧眉头跳转
   *  @param num 序号
   */
  toJump: function (type, num, next) {
    var _this = this;
    //如果有配置more1,按需求鉴权并跳到订购页

    // clearTimeout(_this._jumpTimer);
    // if(next != true && curFocus.TempData && curFocus.TempData.more1 == 'order'){
    //     _this._jumpTimer = setTimeout(function(){   //超时处理
    //         _this.toJump(type,num,true);
    //     },1000);

    //     orderJs.getUserInfo(function (e) {
    //         clearTimeout(_this._jumpTimer);
    //         if( e && e.data && e.data.userInfo && '1002150215031504'.indexOf(e.data.userInfo.districtCode)==-1) {
    //             orderJs.getAuth(function () {   //非南京地区未订购用户跳转到订购页
    //                 _this.toJump(type,num,true);
    //             });
    //         } else {//南京地区不鉴权 直接跳转
    //             _this.toJump(type,num,true);
    //         }
    //     });
    //     return;
    // }

    /*"返回到顶部"按钮
     */
    // if (CT.dataType(num) != 'object' && _this.moer1DataJson[num] && _this.moer1DataJson[num].toTop == 'true') { //返回到顶部
    if (CT.dataType(num) != "object" && num == _this.pinterestData.length - 1) {
      CT.$("main").style.top = "0px";
      PAGE.changeFocus(_this.defaultFocus);
    } else {
      //瀑布流已下线产品没有跳转
      if (type.indexOf("bottom") > -1 && _this.pinterestData[num].booleanUp == 0) {
        //下架弹窗
        CT.undercarriageTip();
        return;
      } else if (curFocus.TempData && curFocus.TempData.booleanUp == 0) {
        //下架弹窗
        CT.undercarriageTip();
        return;
      }
      //剩下正常的跳转，先记录跳转离开之前的光标
      var leaveDataObj = {
        curFocusId: curFocus.FocusID,
      };
      if (type.indexOf("xhbAlert") > -1) {
        //小海贝弹框
        leaveDataObj.curFocusId = _this.XHBLastFocusId;
      }
      //记忆页面离开时的数据
      _this.memoryPageLeaveData(leaveDataObj);

      if (curFocus.TempData.more1 == "order") {
        orderJs.getUserInfo(function (e) {
          //判断是否为南京地区
          if ("1002150215031504,101000".indexOf(e.data.userInfo.districtCode) == -1) {
            orderJs.getAuth(function () {
              CT.toAnterRecommendUrl(curFocus.TempData);
            });
          } else {
            CT.toAnterRecommendUrl(curFocus.TempData);
          }
        });

        return;
      }

      if (type.indexOf("bottom") > -1) {
        //瀑布流
        if (_this.scrollId == num || _this.playId == num) {
          CT.toAnterRecommendUrl(curFocus.TempData);
        } else {
          CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo, "recommend_5", num);
        }
      } else {
        if (type == "firstScreenSmallVideo") {
          if (!curFocus.TempData) {
            curFocus.TempData = PAGE.getModelByFocusId("hands_x0_y0_DMSYvideolist" + _this.nowSmallVideoIndex + "_").TempData;
          }
        }
        CT.toAnterRecommendUrl(curFocus.TempData);
      }
    }
  },
  /*
        第一屏元素到瀑布流
    */
  firstSrcDownEvent: function (focusIndex) {
    var _this = this;
    if (focusIndex) {
      //关闭小视频
      // try {
      //     videoPlayer.mp = new MediaPlayer();
      // } catch (error) { }
      CT.show(CT.$("videoImg"));
      if (videoPlayer.timer !== null) {
        clearInterval(videoPlayer.timer);
        videoPlayer.timer = null;
      }
      _this.isOnPlay = false;
      videoPlayer.exitPage();
      videoPlayer.exitPage();
    }
    //自动寻找下一焦点
    PAGE.ProximityPrinciple("down");
  },
};
page.init();

//重定义顶部按钮向下事件 参数：keyDirection{触发方向}, keyInfo{生成当前按钮的初始化对象，就是上面的“navInfo”或者默认的配置}, keyIndex{"当前nav按钮Id"}
topNavObj.navBtnArrowEvent = function (keyDirection, keyInfo, keyIndex) {
  var _this = topNavObj;
  var curKeyDateArr = topNavObj.navArr || [];
  //以下代码根据自己页面实际需求，可在自己页面重写
  switch (keyDirection) {
    case "left":
      //导航栏按钮向左事件
      if (keyIndex > 0) {
        PAGE.changeFocus("hands_x0_y0_" + keyInfo.name + (keyIndex - 1) + "_");
      }
      break;
    case "right":
      //导航栏按钮向右事件
      if (keyIndex == curKeyDateArr.length - 1) {
        //向右无响应
      } else {
        PAGE.changeFocus("hands_x0_y0_" + keyInfo.name + (keyIndex + 1) + "_");
      }
      break;
    case "up":
      //导航栏按钮向上事件
      //啥也不做
      break;
    case "down":
      if (keyIndex < 2) {
        PAGE.changeFocus("hands_x0_y0_DMSYKW0_");
      } else {
        PAGE.changeFocus("hands_x0_y0_DMSYvideo_");
      }
      break;
    default:
      break;
  }
};

/**
 *  返回
 */
function backFunc() {
  // if (CT.$('xhbAlertDiv').style.visibility == 'visible') {
  //     //隐藏小海贝弹框
  //     PAGE.changeFocus("hands_x0_y0_DMXHB0_");
  //     return;
  // }
  //周卡弹窗返回
  if (CT.$("cardAlertDiv").style.display == "block") {
    page.closePop();
    return;
  }
  if (CT.$("themeListAlert").style.visibility == "visible") {
    //隐藏主题弹框
    mainNavObj.hideThemeList();
    return;
  }
  //推出拦截页
  if (AjaxConfig.commonPageInfo.recommend_8 && AjaxConfig.commonPageInfo.recommend_8[0]) {
    //CT.alertInfo('走配置退出拦截！')
    CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo.recommend_8[0]);
  } else {
    //CT.alertInfo('走自定义退出拦截！')
    CT.commonJumpUrl(AjaxConfig.projectUrl + "commPage?contentId=17");
  }
  //退出平台,添加退出日志
  //CT.exitPlatform();
}

// CT.writeInfo(6)