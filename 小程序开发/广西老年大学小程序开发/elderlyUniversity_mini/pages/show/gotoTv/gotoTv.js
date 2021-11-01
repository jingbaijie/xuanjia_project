// pages/show/gotoTv/gotoTv.js
import AJAX from '../../../utils/request';//封装请求
const ajaxConfig = new AJAX();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actiPoster: "/static/img/show/poster.png",//默认海报
    activityUrl: "",//默认跳转地址
    btnColor: "#999",
    btnText: "当前未上线活动，敬请期待..."
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    // 获取当前活动信息，判断是否跳转下一级页面
    var paramsObj = {
      requestUrl: ajaxConfig.getCurrentActivity
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      if (res.data.successFlg == 1 && res.data.data && res.data.errorCode == 1000) {//当前有活动
        // 根据接口返回名称动态设置页面标题
        wx.setNavigationBarTitle({
          title: res.data.data.activityCname
        });
        // 设置海报图
        this.setData({
          actiPoster: ajaxConfig.ipConfig + res.data.data.picUrl,
          activityUrl: "/pages/show/uploadWorks/uploadWorks?activityId=" + res.data.data.id,
          btnColor: "#85270E",
          btnText: "上传作品"
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
    getApp().globalData.level=1;
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
      title: '作品征集活动开始啦\r\n快带上你的作品走向大屏幕吧'
    }
  },/**
  * 分享到朋友圈
  */
 onShareTimeline: function () {
  return {
    title: '作品征集活动开始啦\r\n快带上你的作品走向大屏幕吧'
  }
 }
})