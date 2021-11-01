// pages/user/watchHistory/watchHistory.js
import AJAX from "../../../utils/request";
const app = getApp();
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[],
    picUrl:ajaxConfig.ipConfigImg
  },
  toVideoDetail:function(options){
    var videoId = options.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: '/pages/organ/videoDetails/videoDetails?videoId='+videoId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var paramsObj = {
      requestUrl:ajaxConfig.getHistory,
      data:{userId:app.globalData.openId}
    }
    ajaxConfig.xjRequestApi(paramsObj,(res)=>{
        this.setData({
          historyList:res.data.data.records
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

  }
})