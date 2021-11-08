// app.js
//引入依赖文件
import AJAX from './utils/request';//请求封装
const ajaxConfig = new AJAX();
// 引入依赖文件
import CryptoJS from './utils/crypto-js';//
import base64 from './utils/base64';//base64
import Common from './utils/common';//自定义方法

App({
  onLaunch: function(options) {
    //   // 展示本地存储能力
    //   const logs = wx.getStorageSync('logs') || []
    //   logs.unshift(Date.now())
    //   wx.setStorageSync('logs', logs)
    wx.CryptoJS = CryptoJS;
    wx.base64 = base64;
    wx.Common = Common;//自定义方法
    
},
/**
 * 监听小程序显示
 */
onShow:function(){
    var that = this;
    wx.login({
        success (res){
            if(res.code){
                console.log("标识code:" + res.code);
                ajaxConfig.xjRequestApi({
                    requestUrl:ajaxConfig.getOpenId,
                    data:{jscode:res.code}
                },(res) => {
                    if (res.data.errorCode == 1000) {
                        that.globalData.openId = res.data.data;
                        console.log("用户openId" + that.globalData.openId);
                        // 获取用户信息
                        ajaxConfig.xjRequestApi({
                          requestUrl: ajaxConfig.getUserInfo,
                          data: { openId: that.globalData.openId }
                        }, (res) => {
                          if (res.data.errorCode == 1000 && res.data.data) {
                            console.log("用户信息：" + res.data.data);
                          }
                        })
                      }


                })


            }else{
                console.log('登录失败！' + res.errMsg)
            }

        }
    })

},



// 数据都是根据当前机型进行计算，这样的方式兼容大部分机器
globalData: {
  //默认城市
  defaultCity: {
    id: '',
    name: '广西',
    ename: 'guangxi'
  },
  //选中城市
  city: {
    id: '',
    name: '广西',
    ename: 'guangxi'
  },
  cityId:0,
  openId:"",
}
})
