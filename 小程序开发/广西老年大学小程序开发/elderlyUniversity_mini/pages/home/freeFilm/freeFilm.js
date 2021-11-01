// pages/home/freeFilm/freeFilm.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  // 页面的初始数据
  data: {
    bannerList: [],//轮播图
    contentList1: [],//内容1
    contentList1Title: null,//内容1title
    imgUrl:ajaxConfig.ipConfig
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'mfdywechat' }).then(res => {
      _this.setData({
        bannerList: res.data.data.recommend_1,
        contentList1: res.data.data.recommend_2.slice(1),
        contentList1Title: res.data.data.recommend_2[0],
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
      title: '广西老年互助服务平台'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {

  },

  // 页面跳转
  jumpPage: function (e) {
    wx.navigateTo({ url: '/pages/home/video/video?videoId=' + e.currentTarget.dataset.videoid });
  }
})