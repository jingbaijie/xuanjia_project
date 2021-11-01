// pages/home/politics/politics.js
import Common from "../../../utils/common";
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerList: [],//广告图列表
    szList: [],
    imgUrl:ajaxConfig.ipConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'szzcwechat' }).then(res => {
      _this.setData({
        bannerList: res.data.data.recommend_1,
        szList: res.data.data.recommend_2.slice(1),
      })
    })
  },

  onShareAppMessage: function () {
    return {
      title: '老年大学互动服务平台\r\n思政之窗，党政知识学习'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '老年大学互动服务平台\r\n思政之窗，党政知识学习'
    }
  },

  // 页面跳转
  jumpPage: function (e) {
    var index = e.currentTarget.dataset.index;
    var type = e.currentTarget.dataset.type;
    if(type=="banner"){
      Common.toRecommendUrl(this.data.bannerList[index]);
    }else if(type=="list"){
      Common.toRecommendUrl(this.data.szList[index]);
    }
    
    // if (e.currentTarget.id == '1') {
    //   wx.navigateTo({ url: '/pages/home/politicsList/politicsList' });
    // } else {
    //   if (e.currentTarget.id == 'rb') {
    //     wx.navigateTo({ url: '/pages/home/video/video?videoId=' + e.currentTarget.dataset.videoid });
    //   } else {
    //     wx.navigateTo({ url: '/pages/interest/course/course?key=' + e.currentTarget.dataset.videoid + '&name=' + e.currentTarget.dataset.name });
    //   }
    // }

  }
})