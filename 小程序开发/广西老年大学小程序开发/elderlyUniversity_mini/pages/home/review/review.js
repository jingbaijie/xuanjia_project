// pages/home/review/review.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({
  // 页面的初始数据
  data: {
    imgUrl:ajaxConfig.ipConfig
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'jchgwechat' }).then(res => {
      _this.setData({
        bannerList: res.data.data.recommend_1,
        reviewList: res.data.data.recommend_2.slice(1),
      })
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


  onShareAppMessage: function () {
    return {
      title: '老年大学互动服务平台\r\n晚会展演，精彩回顾'
    }
  },
  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '老年大学互动服务平台\r\n晚会展演，精彩回顾'
    }
  },

  // 页面跳转
  jumpPage: function (e) {
    wx.navigateTo({ url: '/pages/home/video/video?videoId=' + e.currentTarget.dataset.videoid });
  }
})