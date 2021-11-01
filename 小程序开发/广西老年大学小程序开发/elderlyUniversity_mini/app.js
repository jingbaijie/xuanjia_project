
// 引入依赖文件
import CryptoJS from './utils/crypto-js';//
import base64 from './utils/base64';//base64
import Common from './utils/common';//自定义方法
import AJAX from './utils/request';//请求封装
const ajaxConfig = new AJAX();
import system from './utils/system';

App({
  // 小程序初始化完成时
  onLaunch: function () { 
    system.attachInfo();
    wx.CryptoJS = CryptoJS;
    wx.base64 = base64;
    wx.Common = Common;//自定义方法
    wx.post = new AJAX().postRequest.bind(new AJAX());
    wx.get = new AJAX().getRequest.bind(new AJAX());
    wx._baseUrl = new AJAX()._baseUrl;
    

    // 小程序更新
    (() => {
      // 获取小程序更新机制兼容
      if (wx.canIUse('getUpdateManager')) {
        const updateManager = wx.getUpdateManager()
        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          if (res.hasUpdate) {
            updateManager.onUpdateReady(function () {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function (res) {
                  if (res.confirm) {
                    // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                    updateManager.applyUpdate()
                  }
                }
              })
            })
            updateManager.onUpdateFailed(function () {
              // 新的版本下载失败
              wx.showModal({
                title: '已经有新版本了哟~',
                content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
              })
            })
          }
        })
      } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
        })
      }
    })()

  },
  /**
   * 监听小程序启动或者后台切前台
   */
  onShow: function () {
    // 小程序登录
    wx.login({
      success: (res) => {
        if (res.code) {
          var code = res.code;
          console.log(code);
          this.globalData.jsCode = code;
          // 获取openId
          ajaxConfig.xjRequestApi({
            requestUrl: ajaxConfig.getOpenId,
            data: { jscode: code }
          }, (res) => {
            if (res.data.errorCode == 1000) {
              this.globalData.openId = res.data.data;
              // 获取用户信息
              ajaxConfig.xjRequestApi({
                requestUrl: ajaxConfig.getUserInfo,
                data: { openId: this.globalData.openId }
              }, (res) => {
                if (res.data.errorCode == 1000 && res.data.data) {
                  this.globalData.userInfo = res.data.data;//用户信息存到全局便于我的页面使用
                  this.globalData.phoneNum = res.data.data.phoneNum;
                }
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    // wx.login({
    //   success(res){
    //     console.log(res);
    //   }
    // })
  },
  /**
   * 小程序前台切后台
   */
  onHide: function () {

  },
  globalData: {
    openId: "",
    session_key: 0,
    jsCode: 0,
    userInfo: {},
    level: 1,
    phoneNum:""
  }
})
