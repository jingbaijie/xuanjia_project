// pages/interest/index/index.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateList: [],//课程列表
    showItem: false,
    imgUrl:ajaxConfig.ipConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'xqktWECHAT' }).then(res => {
      _this.setData({
        cateList: res.data.data.recommend_1,
        showItem: res.data.data.recommend_1.length % 2 == 1
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
      title: '老年大学互动服务平台\r\n活到老学到老，一起学习吧~'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '老年大学互动服务平台\r\n活到老学到老，一起学习吧~'
    }
  },

  // clickHandle
  clickHandle: function (e) {
    wx.navigateTo({ url: '/pages/interest/course/course?cartoonId=' + e.currentTarget.id + '&title=' + e.currentTarget.dataset.title +'&fromPage=course'});
  }


})