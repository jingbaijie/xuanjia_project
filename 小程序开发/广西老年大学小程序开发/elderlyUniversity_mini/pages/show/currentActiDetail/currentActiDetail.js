// pages/show/currentActiDetail/currentActiDetail.js
import AJAX from "../../../utils/request";
let ajaxConfig = new AJAX();
let imgUrl = ajaxConfig.ipConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,//图片地址
    bannerData: [], //轮播图数据
    sayToPartyData: [], //对党说数据
    videoData: [],//视频数据
    drawData: [],//绘画数据
    writingData: [],//书法数据
    photographData: [],//摄影数据
  },
  /**
   * 获取活动上传卡通详情（视频）
   * @param {*activitySchedule}  活动状态 0-往期 1-上期 2-当前期
   */
  getVideoData: function () {
    var videoObj = {
      requestUrl: ajaxConfig.findActivityCartoon,
      data: { activitySchedule: 1 }
    }
    ajaxConfig.xjRequestApi(videoObj, (res) => {
      console.log(res);
      if (res.data.data && res.data.errorCode == 1000) {
        var videoArr = [];
        res.data.data.splice(0, 4).forEach((item) => {
          videoArr.push({ picUrl: imgUrl + item.detailPic.picPath, cartoonId: item.id, text: item.cartoonCname })
        })
        this.setData({
          videoData: videoArr
        })
      }
    })
  },
  /**
   * 获取上传资源详情(图片)
   * @param {*activityId} 活动id false
   * @param {*tagCode} 上传标签code true
   * @param {*activitySchedule} 活动状态 0-往期 1-上期 2-当前期 true
   */
  getPicData: function () {
    var count = 0;
    this.requestPicData(count);
  },
  requestPicData: function (count) {
    var tagCode = "";
    switch (count) {
      case 0:
        tagCode = "huihua"
        break;
      case 1:
        tagCode = "shufa"
        break;
      case 2:
        tagCode = "sheying"
        break;
      default:
        break;
    }
    var paramsObj = {
      requestUrl: ajaxConfig.uploadDetail,
      data: {
        tagCode: tagCode,
        activitySchedule: 1//上期
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      console.log(res);
      var resData = res.data.data;
      if (res.data.errorCode == "1000" && res.data.data.length > 4) {//四条以上数据
        resData = res.data.data.splice(0, 4);
      }
      switch (count) {
        case 0:
          this.setData({
            drawData: resData
          })
          break;
        case 1:
          this.setData({
            writingData: resData
          })
          break;
        case 2:
          this.setData({
            photographData: resData
          })
          break;
        default:
          break;
      }
      count++;
      if (count < 3) {
        this.requestPicData(count);
      }
    })
  },
  /**
   * 获取轮播图数据
   * @param {*} options 
   */
  getBannerData: function () {
    var paramsObj = {
      requestUrl: ajaxConfig.getRecommonPageInfo,
      data: {
        contentId: 506,
        contentName: "sqhdwechatxqy"
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      console.log(res);
      this.setData({
        bannerData: res.data.data.recommend_1
      })
    })
  },
  /**
   * 表演视频跳转全屏(通过卡通id)
   */
  fullScreenPlay: function (options) {
    var cartoonId = options.currentTarget.dataset.cartoonid;
    var paramsObj = {
      requestUrl: ajaxConfig.getVideoIdByCartoonId,
      data: {
        cartoonId: cartoonId
      }
    }
    // 根据卡通ID获取videoId
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      var videoId = res.data.data[0].movieDetails[0].videoId;
      wx.navigateTo({
        url: "/pages/home/video/video?videoId=" + videoId
      });
    })
  },
  /**
   * 根据videoId跳转全屏 
   */
  fullScreenPlayByVideoId:function(options){
    var videoId = options.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: "/pages/home/video/video?videoId=" + videoId
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置当前页面主题
    wx.setNavigationBarTitle({
      title: options.lastItemTheme
    });
    // 获取视频数据
    this.getVideoData();
    // 获取图片数据
    this.getPicData();
    // 获取轮播图数据
    this.getBannerData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我上电视啦\r\n快来看看有你的作品吗'
    }
  },/**
   * 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '我上电视啦\r\n快来看看有你的作品吗'
    }
  }
})