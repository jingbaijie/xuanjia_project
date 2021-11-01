// pages/home/index/index.js
import QQMapWX from '../../../utils/qqmap-wx-jssdk.min.js'
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();

let qqmapsdk
const app = getApp();
Page({
  // onShareAppMessage() {
  //   return {
  //     title: 'swiper',
  //     path: 'page/component/pages/swiper/swiper'
  //   }
  // },


  /**
   * 页面的初始数据
   */
  data: {
    city:'广西省',
    cities: [],//城市列表
    findRecCommonPageInfo:[],//公共推荐
    imgUrl:ajaxConfig.ipConfigImg,
    recCommonPageByCity:[],//根据城市推荐
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var than = this
       // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'QKXBZ-D5QKI-LZ3GQ-5VQY7-64KM6-Y6FOI'    // 必填
    });

    this.getCities(() => {
      this.checkAuth((latitude, longitude) => {
        qqmapsdk.reverseGeocoder({
          sig: '',    // 必填
          location: {latitude, longitude},
          success(res) {
            const cityName = res.result.ad_info.city;//定位的城市名称
            console.log("城市名称" +cityName)
            const city = than.data.cities.find(c => c.name === cityName);
            if (city) {
              app.globalData.city = city;
            } else {
              app.globalData.city = app.globalData.defaultCity;
            }
            than.setData({
              city: app.globalData.city.name
            })
            
          },
          fail(err) {
            console.log(err)
            wx.showToast('获取城市失败')
          }
        });
      });
    });
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
    this.setData({
      city: getApp().globalData.city.name
    })
    //显示固定推荐
    this.findRecCommonPageInfo();
    //根据城市推荐展示
    this.recCommonPageByCity();
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

  },
/**
 * 授权位置
 * @param {*} callback 
 */
  checkAuth(callback) {
    wx.getSetting({
      success(res) {
        console.log("授权"+ res.authSetting['scope.userLocation'])
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.getLocation({
                type: 'wgs84',
                success(res) {
                  callback(res.latitude, res.longitude)
                }
              })
            }
          })
        }else{
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              callback(res.latitude, res.longitude)
            }
          })
        }
      }  
    })
  },
/**
 * 获取城市列表
 * @param {*} callback 
 */
  getCities:function(callback) {
    var getAreaList = {
      requestUrl: ajaxConfig.area
    }
    ajaxConfig.xjRequestApi(getAreaList,(res) => {
      if (res.data.successFlg == 1 && res.data.data) {
        this.data.cities = res.data.data;
        callback && callback();
      }
    });
  },
/**
 * 通用页面公共推荐
 * @param {*}
 */
  findRecCommonPageInfo:function(e){
    var recCommon = {
      requestUrl:ajaxConfig.findRecCommonPageInfo,
      data:{
        contentName:'yszcxcxtyym' 
      }
    }
    ajaxConfig.xjRequestApi(recCommon,(res) => {
      if (res.data.successFlg == 1 && res.data.data) {
        this.setData({
          findRecCommonPageInfo:res.data.data
        })

      }
    })

  },
  /**
   * 根据城市获取推荐
   * @param {} e 
   */
  recCommonPageByCity:function(e){
    var recCommon = {
      requestUrl:ajaxConfig.findRecCommonPageInfo,
      data:{
        contentName:app.globalData.city.ename
      }
    }
    ajaxConfig.xjRequestApi(recCommon,(res) => {
      if (res.data.successFlg == 1 && res.data.data) {
        this.setData({
          recCommonPageByCity:res.data.data,
        })
      }
    })
  },
  


  /**
   * 跳转
   * @param {t} event 
   */
  jumpPage: function(e) {
    switch(e.currentTarget.id){
      case'organAll':
      wx.switchTab({
          url: '/pages/organ/index/index',
      })
      break;
      case'searchCity':
      wx.navigateTo({
        url: '../cityType/cityType',
      })
      break;
      case'studentAll':
      wx.navigateTo({
        url: '/pages/home/moreStudent/moreStudent',
      })
      break;
      case'videoAll':
      wx.navigateTo({
        url: '/pages/home/moreVideo/moreVideo',
      })
      default:
        break;
    }
  },
  /**
   * 跳机构详情
   * @param {*} e 
   */
  jumpOrganDetails: function(e) {
    console.log('机构'+ e.currentTarget.id)
    wx.navigateTo({
      url: '/pages/organ/details/details?cpId=' + e.currentTarget.id,
    })
  },
    /**
   * 跳学员主页
   * @param {t} e 
   */
  jumpStudentPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/student/student?id=' + e.currentTarget.id,
    })
  },
    /**
   * 跳视频详情页
   * @param {t} e 
   */
  jumpVideoDetailsPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/videoDetails/videoDetails?videoId=' + e.currentTarget.id,
    })
  },
  /**
   * 去搜索页
   */
  jumpSearch:function(){
    wx.navigateTo({
      url: '/pages/common/search/search',
    })
  },
    /**
   * 去搜索 （搜索类型： 1机构 2 学员 3 视频）
   */
  jumpSearchType:function(e){
    wx.navigateTo({
      url: '/pages/common/search/search?search_type=' + e.currentTarget.id,
    })
  },
  jumpType:function(e){
    const recommendDisplayType = e.currentTarget.dataset.type;
    if(recommendDisplayType == 11){//学员
      this.jumpStudentPage(e);
    }else if(recommendDisplayType == 12){//机构
      this.jumpOrganDetails(e);
    }else if(recommendDisplayType == 13){//视频
      this.jumpVideoDetailsPage(e);
    }else if(recommendDisplayType == 6){//专题
      wx.navigateTo({
        url: '/pages/home/jqqd/jqqd'
      })
    }

  }

})