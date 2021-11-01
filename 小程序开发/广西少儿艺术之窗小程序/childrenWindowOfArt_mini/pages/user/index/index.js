// index.js
// 获取应用实例
import AJAX from "../../../utils/request";
const app = getApp();
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: wx.getSystemInfoSync().statusBarHeight, //获取状态栏高度
    ruzhuObj: {
      leftIcon: "/static/images/user/ruzhu.png",
      text: "机构入驻",
      bindEvent: "clickRuzhu"
    },
    contactObj: {
      leftIcon: "/static/images/user/contact.png",
      text: "联系客服",
      bindEvent: "clickContact"
    },
    myWorksObj: {
      leftIcon: "/static/images/user/myworks.png",
      text: "我的作品",
      bindEvent: "clickMyWorks"
    },
    aboutUsObj: {
      leftIcon: "/static/images/user/aboutUs.png",
      text: "关于我们",
      bindEvent: "clickAboutUs"
    },
    headerPic: "",
    nickName: ""
  },
  onTabItemTap: function (item) {
    if (!this.data.nickName && !this.data.headerPic) {
      if (app.globalData.openId) {
        this.getUserInfo(); //获取用户信息
      } else {
        wx.login({
          success: (resCode) => {
            if (resCode.code) {
              ajaxConfig.xjRequestApi({
                requestUrl: ajaxConfig.getOpenId,
                data: {
                  jscode: resCode.code
                }
              }, (res) => {
                if (res.data.errorCode == 1000) {
                  this.getUserInfo(res.data.data);
                }
              })
            }
          }
        })
      }
    }
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (openId) {
    var paramsObj = {
      requestUrl: ajaxConfig.getUserInfo,
      data: {
        openId: openId || app.globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      if (res.data.errorCode == 1000 && res.data.data) { //能够获取到用户信息
        this.setData({
          headerPic: res.data.data.avatarUrl,
          nickName: res.data.data.nickName
        })
      } else { //获取不到用户信息，发起授权
        this.getUserProfile();
      }
    })
  },
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(必填)
      success: (res) => { //用户允许，获取用户信息存入数据库
        var paramsObj = {
          requestUrl: ajaxConfig.insertUserInfo,
          header: {
            'content-type': "application/json"
          },
          method: "POST",
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
          if (data.data.errorCode == 1000) {
            //  显示头像、昵称
            this.setData({
              headerPic: res.userInfo.avatarUrl,
              nickName: res.userInfo.nickName
            })
          }
        })
      },
      fail: (res) => { //用户拒绝
        console.log(res);
      }
    })
  },
  /**
   * 观看历史
   */
  watchHistory: function () {
    wx.navigateTo({
      url: '/pages/user/watchHistory/watchHistory'
    })
  },
  /**
   * 我的喜欢
   */
  myFavorite: function () {
    wx.navigateTo({
      url: '/pages/user/myFavorite/myFavorite'
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