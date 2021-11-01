// pages/user/index/index.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headPic: "",
    name: "",
    phoneText: "",
    isBindPhone: false,
    userInfo:[]//用户信息
  },
  /**
   * 获取手机号
   */
  getPhoneNumber: function (e) {
      if (e.detail.errMsg == "getPhoneNumber:ok") {
        // 登录获取code
        wx.login({
          success: (resCode) => {
            if (resCode.code) {
              var getPhoneNumObj = {
                requestUrl: ajaxConfig.updatePhoneNum,
                data: {
                  encData: e.detail.encryptedData,
                  iv: e.detail.iv,
                  jscode: resCode.code
                }
              }
              ajaxConfig.xjRequestApi(getPhoneNumObj, (res) => {
                if (res.data.errorCode == 1000 && res.data.data) {
                  // 手机号入库
                  app.globalData.phoneNum = res.data.data;
                  this.insertPhoneNum(res.data.data);
                }
              })
            }
          }
        })
      }
  },
  /**
   * 手机号入库
   */
  insertPhoneNum: function (phoneNumber) {
    var paramsObj = {
      requestUrl: ajaxConfig.insertUserInfo,
      header: {
        'content-type': "application/json"
      },
      method: "POST",
      data: {
        avatarUrl: this.data.headPic,
        nickName: this.data.name,
        openId: app.globalData.openId,
        phoneNum: phoneNumber
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      // 手机号入库
      this.setData({
        phoneText: phoneNumber,
        isBindPhone: true
      })
    }, (res) => {
      console.log(res);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 获取用户信息
   */
  getUserInfo: function (openId) {
    ajaxConfig.xjRequestApi({
      requestUrl: ajaxConfig.getUserInfo,
      data: {
        openId: app.globalData.openId || openId
      }
    }, (res) => {
      if (res.data.errorCode == 1000 && res.data.data) { //能够获取到用户信息
        getApp().globalData.userInfo = res.data.data;
        this.setData({
          headPic: res.data.data.avatarUrl,
          name: res.data.data.nickName,
          phoneText: res.data.data.phoneNum,
          userInfo:res.data.data
        })
        if (res.data.data.phoneNum) {
          this.setData({
            isBindPhone: true
          })
        }
      } else {
        this.getUserProfile(); //没有用户信息则发起用户授权
      }
    })
  },
  /**
   * 
   * 点击[我的]tabbar栏触发事件
   */
  onTabItemTap: function (item) {
    if (app.globalData.openId) {
      this.getUserInfo(); //获取用户信息
    } else {
      wx.login({
        success: (resCode) => {
          if (resCode.code) {
            // 获取openId
            ajaxConfig.xjRequestApi({
              requestUrl: ajaxConfig.getOpenId,
              data: {
                jscode: resCode.code
              }
            }, (res) => {
              if (res.data.errorCode == 1000) {
                this.getUserInfo(res.data.data); //获取用户信息
              }
            })
          }
        }
      })
    }
  },
  /**
   * 发起用户信息授权
   */
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(必填)
      success: (res) => { //用户允许，获取用户信息存入数据库，并且跳转首页
        console.log(res);
        getApp().globalData.userInfo = res.userInfo; //用户信息存到全局便于我的页面使用
        // 将用户个人信息插入数据库
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
              headPic: app.globalData.userInfo.avatarUrl,
              name: app.globalData.userInfo.nickName,
              phoneText: app.globalData.userInfo.phoneNum,
              userInfo:app.globalData.userInfo
            })
          }
        })
      },
      fail: (res) => { //用户拒绝，回到微信登录界面
        console.log(res);
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