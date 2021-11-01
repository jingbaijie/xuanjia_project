// pages/login/login.js
const app = getApp();
import AJAX from "../../utils/request";
let ajaxConfig = new AJAX();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}//用户基础信息
  },
  getUserProfile: function (e) {
    wx.getUserProfile({
      desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(必填)
      success: (res) => {//用户允许，获取用户信息存入数据库，并且跳转首页
        console.log(res);
        getApp().globalData.userInfo = res.userInfo;//用户信息存到全局便于我的页面使用
        // 将用户个人信息插入数据库
        var paramsObj = {
          requestUrl: ajaxConfig.insertUserInfo,
          header:{'content-type': "application/json"},
          method:"POST",
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            nickName: res.userInfo.nickName,
            openId: app.globalData.openId,
            province: res.userInfo.province,
            language: res.userInfo.language
          }
        }
        ajaxConfig.xjRequestApi(paramsObj, (data) => {
          if(data.data.errorCode==1000){
            wx.reLaunch({
              url: "/pages/home/index/index"
            });
          }
        })        
      },
      fail: (res) => {//用户拒绝，回到微信登录界面
        console.log(res);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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