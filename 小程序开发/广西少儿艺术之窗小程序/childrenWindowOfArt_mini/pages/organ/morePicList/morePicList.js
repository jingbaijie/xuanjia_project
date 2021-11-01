// pages/organ/morePicList/morePicList.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    morePicList:[],
    imgUrl:ajaxConfig.ipConfigImg,
    picList:[] //图片列表

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    for(var i=0;i<JSON.parse(options.picList).length;i++){
      var picUrl = this.data.imgUrl + JSON.parse(options.picList)[i].playUrl;
    }
    var picList = [];
    picList.push(picUrl);
    this.setData({
      morePicList: JSON.parse(options.picList),
      picList:picList
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
    /**
   * 图片预览
   * @param {*} e 
   */
  onPreview:function(e){
    let currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.picList // 需要预览的图片http链接列表
    })
  },
})