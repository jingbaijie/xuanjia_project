// pages/organ/moreVideo/moreVideo.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreVideo:[],
    imgUrl:ajaxConfig.ipConfigImg,
    pageNum:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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
    this.getVideoList();

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
    var that = this;
    var pageNum = that.data.pageNum + 1;
    console.log("页数："+pageNum);
    that.setData({
      pageNum:pageNum
    })
    this.getVideoList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳视频详情
   * @param {} e 
   */
  jumpPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/videoDetails/videoDetails?videoId=' + e.currentTarget.id,
    })
  },
  /**
   * 获取视频列表
   * @param {*} e 
   */
  getVideoList:function(e){
    var videoinfo = {
      requestUrl:ajaxConfig.searchVideoInfoForWeChat,
      data:{
        areaCode:app.globalData.city.id,
        pageNum:this.data.pageNum,
        pageSize:20
      }
    }
    ajaxConfig.xjRequestApi(videoinfo,(res) => {
      if(res.data.successFlg == 1 && res.data.data ){
        var moreVideo1 = this.data.moreVideo;
        var moreVideo2 = res.data.data.records;
        moreVideo1 = moreVideo1.concat(moreVideo2);
        this.setData({
          moreVideo:moreVideo1
        })
      }

    })

  }
})