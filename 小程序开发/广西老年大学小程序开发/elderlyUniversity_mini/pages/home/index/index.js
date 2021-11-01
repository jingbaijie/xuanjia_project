// pages/home/index/index.js
import AJAX from "../../../utils/request";
import Common from "../../../utils/common";
const ajaxConfig = new AJAX();
var app = getApp();
Page({

  // 页面的初始数据
  data: {
    bannerList: [],//广告图列表
    cateList: [],//分类列表
    backList: [],//精彩回顾列表
    hotList: [],//今日热播
    backListTitle: null,
    hotListTitle: null,
    imgUrl:ajaxConfig.ipConfig
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'main_wechat' }).then(res => {
      _this.setData({
        bannerList: res.data.data.recommend_1,
        cateList: res.data.data.recommend_6,
        backListTitle: res.data.data.recommend_7[0],
        backList: res.data.data.recommend_7.slice(1),
        hotListTitle: res.data.data.recommend_4[0],
        hotList: res.data.data.recommend_8,
      })
    })
  },

  // inputHandle
  focusHandle: function (e) {
    wx.navigateTo({ url: '/pages/home/search/search' });
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


  onShareAppMessage: function () {
    return {
      title: '老年大学互动服务平台\r\n精彩内容千万别错过哦~'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '老年大学互动服务平台\r\n精彩内容千万别错过哦~'
    }
  },

  // 页面跳转
  jumpPage: function (e) {
    switch (e.currentTarget.id) {
      case '1':
        wx.navigateTo({ url: '/pages/home/myWorks/myWorks'});
        break;
      case '2':
        wx.navigateTo({ url: '/pages/home/politics/politics' });
        break;
      case '3':
        wx.navigateTo({ url: '/pages/home/review/review' });
        break;
      case '4':
        wx.navigateTo({ url: '/pages/home/regional/regional' });
        break;
      case 'more':
        wx.navigateTo({ url: '/pages/home/review/review' });
        break;
      case 'more1':
        wx.navigateTo({ url: '/pages/home/freeFilm/freeFilm' });
        break;
      case 'banner':
        if (e.currentTarget.dataset.isrtmp == 'true') {
          wx.navigateTo({ url: '/pages/home/rtmp/rtmp' });
        } else {
          wx.navigateTo({ url: '/pages/home/video/video?videoId=' + e.currentTarget.dataset.videoid });
        }
        break;
      case 'banner4':
        wx.navigateTo({ url: '/pages/show/gotoTv/gotoTv' });
        break;
      case 'back':
        this.jumpConfigurePage(e.currentTarget.dataset.pagetype);
        break;
      case 'hot':
        var index = e.currentTarget.dataset.index;
        Common.toRecommendUrl(this.data.hotList[index]);
        break;
      default:
        break;
    }
  },
  /**
   * 配置跳转
   */
  jumpConfigurePage:function(pageType){
    if(pageType.indexOf("xjrw")>-1){//先进人物
      wx.navigateTo({
        url: '/pages/home/person/person',
      })
    }else if(pageType.indexOf("wysds")>-1){//我要上电视
      wx.navigateTo({
        url: '/pages/show/gotoTv/gotoTv',
      })
    }
  }
})