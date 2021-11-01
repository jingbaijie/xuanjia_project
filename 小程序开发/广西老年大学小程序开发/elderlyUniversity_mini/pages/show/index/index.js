// pages/show/index/index.js
import AJAX from "../../../utils/request";
let ajaxConfig = new AJAX();
let imgUrl = ajaxConfig.ipConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerArr: [], //轮播图图片数组
    lastItemRec: [], //往期活动推荐数据
    worksCover: [],//作品展示数据
    lastItemTheme: "",//上期活动主题
    pastWorkShow: [],//往期作品展示
    imgUrl: imgUrl
  },
  /**
   * 轮播图跳转
   */
  bannerJump: function (event) {
    var bannerIndex = event.currentTarget.dataset.index;//轮播图下标
    var bannerUrl = "";
    if (bannerIndex == 0) {
      bannerUrl = "/pages/show/gotoTv/gotoTv";
      wx.navigateTo({
        url: bannerUrl
      });
    }

  },
  /**
   * （作品展示）往期作品列表跳转
   */
  worksTypeJump: function (event) {
    var tagCode = event.currentTarget.dataset.tagcode;
    if (tagCode == "biaoyan") {
      wx.navigateTo({
        url: "/pages/show/worksShow/worksShow?tagCode=" + tagCode + "&schedule=0"
      });
    } else {
      wx.navigateTo({
        url: "/pages/show/currentActiList/currentActiList?tagCode=" + tagCode + "&schedule=0"
      });
    }

  },
  /**
   * 跳转全屏播放
   */
  fullScreenPlay: function (options) {
    var videoId = options.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: "/pages/home/video/video?videoId=" + videoId
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取风采展示推荐数据
    var recommendObj = {
      requestUrl: ajaxConfig.getRecommonPageInfo,
      data: {
        contentId: 493,
        contentName: "fczsWECHAT"
      }
    }
    ajaxConfig.xjRequestApi(recommendObj, (res) => {
      console.log(res);
      var recommend1 = [];//轮播图推荐数据
      var recommend2 = [];//上期活动数据
      var recommend3 = [];//往期作品数据
      var lastItemTheme = res.data.data.recommend_2[0].more1;//上期活动主题
      var pastActiTitle = res.data.data.recommend_3[0].more1;//往期活动作品展示标题
      res.data.data.recommend_1.forEach((item) => {
        recommend1.push({ img: imgUrl + item.recommendPic.picPath, recommendPageId: item.recommendDisplayValue });
      })
      res.data.data.recommend_2.shift();
      res.data.data.recommend_2.forEach((item) => {
        recommend2.push({ img: imgUrl + item.recommendPic.picPath, text: item.recommendDisplayName, videoId: item.recommendDisplayValue });
      })
      res.data.data.recommend_3.shift();
      this.setData({
        bannerArr: recommend1,
        lastItemRec: recommend2,
        lastItemTheme: lastItemTheme,
        pastWorkShow: res.data.data.recommend_3
      })
    })
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
      title: '广西老年互助服务平台'
    }
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline: function () {

  }
})