var buttons = [];
var mainPage = {
  isOrder: 1, //鉴权
  videoId: null, //卡通视频Id
  videoListInfo: [
    {
      left: 103,
      cartoonId: 825,
    },
    {
      left: 492,
      cartoonId: 955,
    },
    {
      left: 879,
      cartoonId: 15,
    },
  ],
  videoListJSon: {}, //当前视频剧集列表
  initPage: function () {
    this.initFocus();
  },
  initFocus: function () {
    buttons.push(
      {
        // 视频一
        id: "hands_x0_y0_videoOneFocus_",
        clickHandler: "javascript:",
        otherFocusEvent: "javascript:mainPage.videoPlayEvent('One',0)",
        otherBlurEvent: "javascript:mainPage.marqueeShow()",
        left: "disable",
        right: "hands_x0_y0_videoTwoFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      {
        // 视频二
        id: "hands_x0_y0_videoTwoFocus_",
        clickHandler: "javascript:",
        otherFocusEvent: "javascript:mainPage.videoPlayEvent('Two',1)",
        otherBlurEvent: "javascript:mainPage.marqueeShow()",
        left: "hands_x0_y0_videoOneFocus_",
        right: "hands_x0_y0_videoThreeFocus_",
        up: "disable",
        down: "disable",
        focusType: 7,
      },
      {
        // 视频三
        id: "hands_x0_y0_videoThreeFocus_",
        clickHandler: "javascript:",
        otherFocusEvent: "javascript:mainPage.videoPlayEvent('Three',2)",
        otherBlurEvent: "javascript:mainPage.marqueeShow()",
        left: "hands_x0_y0_videoTwoFocus_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7,
      }
    );
    // 焦点初始化
    PAGE.focusInit();
    PAGE.changeFocus("hands_x0_y0_videoOneFocus_");
  },
  /**
   * 视频一事件
   * @param name 蒙层名称
   * @param index 视频下标
   */
  videoPlayEvent: function (name, index) {
    var that = this;
    // 蒙层隐藏
    CT.$("marquee" + name).style.display = "none";
    // 获取视频数据
    var videoParam = {
      params: {
        cartoonId: this.videoListInfo[index].cartoonId,
      },
    };
    interface.findVideoListByCartoonId(videoParam, function (res) {
      that.videoListJSon = res.data;
      var videoData0 = that.videoListJSon[0];
      var mediaCode = videoData0.movieDetails[0].playUrl;
      var videoIndex = videoData0.videoNumber - 1 || 0;
      // 小视频播放
      videoPlayer.SmallPlay({
        top: 257,
        left: that.videoListInfo[index].left,
        height: 165,
        width: 295,
        nns_ids: mediaCode, //合集媒资
        videoIndex: videoIndex, //当前集数下标
        //上传小视频播放日志所用信息
        smallVideoInfo: videoData0,
      });
    });
  },
  // 蒙层显示
  marqueeShow: function () {
    if (CT.$("marqueeOne").style.display == "none") {
      CT.$("marqueeOne").style.display = "block";
    } else if (CT.$("marqueeTwo").style.display == "none") {
      CT.$("marqueeTwo").style.display = "block";
    } else {
      CT.$("marqueeThree").style.display = "block";
    }
  },
};
mainPage.initPage();
function backFunc() {
  // 视频隐藏
  // CT.setCookie("getVisitorId", true);
  actiObj.actiCommonJumpUrl("./acti_puzzleAnimation.html");
}
