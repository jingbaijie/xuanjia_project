// pages/show/worksShow/worksShow.js
import AJAX from "../../../utils/request";
let ajaxConfig = new AJAX();
let imgUrl = ajaxConfig.ipConfig;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,//图片地址
    currentVideoData: []//当前视频作品数据
  },
  /**
   * 获取视频数据
   * @param {*} options 
   */
  getVideoData: function (tagCode,schedule) {
    var videoObj = {
      requestUrl: ajaxConfig.findActivityCartoon,
      data: { activitySchedule: schedule}
    }
    ajaxConfig.xjRequestApi(videoObj, (res) => {
      console.log(res);
      var videoArr = [];
      res.data.data.forEach((item) => {
        videoArr.push({ picUrl: imgUrl + item.detailPic.picPath, cartoonId: item.id, text: item.cartoonCname })
      })
      this.setData({
        currentVideoData: videoArr
      })
    })
  },
  /**
   *跳转全屏播放 
   */
  fullScreenPlay:function(options){
    var cartoonId = options.currentTarget.dataset.cartoonid;
    var paramsObj = {
      requestUrl:ajaxConfig.getVideoIdByCartoonId,
      data:{
        cartoonId:cartoonId
      }
    }
    // 根据卡通ID获取videoId
    ajaxConfig.xjRequestApi(paramsObj,(res)=>{
      var videoId = res.data.data[0].movieDetails[0].videoId;
      wx.navigateTo({
        url: "/pages/home/video/video?videoId=" + videoId
      });
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var pageTitle = "表演作品";//页面标题
    // 根据眉头参数options.type动态设置页面标题
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    // 请求页面数据
    this.getVideoData(options.tagCode,options.schedule);
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
    return {
      title: '广西老年互助服务平台'
    }
  },/**
  * 分享到朋友圈
  */
 onShareTimeline: function () {

 }
})