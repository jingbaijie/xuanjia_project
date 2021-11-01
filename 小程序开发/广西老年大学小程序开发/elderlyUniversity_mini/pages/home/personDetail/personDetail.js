// pages/home/personDetail/personDetail.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  // 页面的初始数据
  data: {
    currentData: null,//当前页面信息
    imgUrl:ajaxConfig.ipConfig
  },

  // 生命周期函数--监听页面加载
  onLoad: function (options) {
    let _this = this;
    let currentId = options.key - 1;
    wx.get('/api/web/getAdvancedFigures', { pageNum: 1, pageSize: 100 }).then(res => {
      console.log(res);
      _this.setData({
        currentData: res.data.data.records[currentId]
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
      title: '老年大学互动服务平台\r\n先进人物事迹介绍'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '老年大学互动服务平台\r\n先进人物事迹介绍'
    }
  },
})