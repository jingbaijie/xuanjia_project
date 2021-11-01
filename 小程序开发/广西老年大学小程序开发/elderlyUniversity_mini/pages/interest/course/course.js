// pages/interest/course/course.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    courseList: [],
    fromPage:0,//页面来源
    title:"课程列表",
    imgUrl:ajaxConfig.ipConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })
    let cartoonId = options.cartoonId || 1;
    this.setData({
      fromPage:options.fromPage || 0,
      title:options.title
    })
    let _this = this;
    wx.get('/api/web/findVideoListByCartoonId', { cartoonId: cartoonId, videoNumber: '' }).then(res => {
      _this.setData({
        courseList: res.data.data
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
      title: this.data.title
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: this.data.title
    }
  },

  // clickHandle
  clickHandle: function (e) {
    wx.navigateTo({ url: '/pages/home/video/video?videoId=' + e.currentTarget.id+'&fromPage='+this.data.fromPage});
  }
})