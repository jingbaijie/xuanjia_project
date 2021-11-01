// pages/user/myFavorite/myFavorite.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: ajaxConfig.ipConfigImg,
    collectType: 0,
    collectList: []
  },
  /**
   * 获取收藏列表
   * @param {*collectType} //0,机构；1，视频；
   */
  getCollectList: function (options) {
    if (options) {
      this.setData({
        collectType: options.currentTarget.dataset.type
      })
    }
    var paramsObj = {
      requestUrl: ajaxConfig.getCollectList,
      data: {
        openId: getApp().globalData.openId,
        type: this.data.collectType
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      this.setData({
        collectList: res.data.data
      })
    })
  },
  /**
   * 跳转机构详情
   * cpId
   */
  toInstituteDetail:function(options){
    var cpId = options.currentTarget.dataset.cpid;
    wx.navigateTo({
      url: '/pages/organ/details/details?cpId='+cpId
    })
  },
  /**
   * 跳转视频详情
   * videoId
   */
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
    this.getCollectList();
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
    this.getCollectList({
      currentTarget: {
        dataset: {
          type: this.data.collectType
        }
      }
    })
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