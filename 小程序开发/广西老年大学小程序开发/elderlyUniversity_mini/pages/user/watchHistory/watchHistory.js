// pages/user/watchHistory/watchHistory.js
import AJAX from "../../../utils/request"
const ajaxConfig = new AJAX();
const app = getApp();
const imgUrl = ajaxConfig.ipConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [], //对党说数据
    imgUrl: imgUrl,
    default: false//是否展示默认图片
  },
  /**
   * 跳转视频列表页
   */
  toVideoList: function (options) {
    var cartoonId = options.currentTarget.dataset.cartoonid;
    var index = options.currentTarget.dataset.index;
    wx.navigateTo({
      url: "/pages/interest/course/course?cartoonId=" + cartoonId+"&title="+this.data.listData[index].mediaName
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 观看历史数据
    var paramsObj = {
      requestUrl: ajaxConfig.getHistory,
      data: { userId: app.globalData.openId }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      this.setData({
        listData: res.data.data.records
      });
      if (this.data.listData.length == 0) {//没有观看记录
        this.setData({
          default: true
        })
      }
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

  },/**
  * 分享到朋友圈
  */
  onShareTimeline: function () {

  }
})