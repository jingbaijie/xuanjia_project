import AJAX from "../../../utils/request";
import Common from "../../../utils/common";
const ajaxConfig = new AJAX();
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curMyWorksList: [],//当前我的作品列表
    currentPicList: [],//当前图片地址列表 
    status: 0,//1审核中,没有发布作品2未上传作品3有发布作品
    imgUrl: ajaxConfig.ipConfig,//本地图片地址
    keyWords: "",//搜索框关键字
  },
  /**
   * 跳转上传页
   */
  toUpLoad: function () {
    wx.navigateTo({
      url: '../../show/gotoTv/gotoTv',
    })
  },
  /**
   * 搜索
   */
  search: function (options) {
    var keyWords = options.detail.value;
    this.getMyWorksData(2, keyWords, (res) => {
      if (res.data.data && res.data.data.length > 0) {
        this.setData({
          curMyWorksList: res.data.data
        })
      }
    });
    this.setData({
      keyWords: ""
    })
  },
  /**
   * 获取页面数据
   */
  getMyWorksData: function (releaseStatus, worksName, callback) {
    this.setData({
      curMyWorksList: []
    })
    var paramsObj = {
      data: {
        status: releaseStatus,
        openId: app.globalData.openId,
        title: worksName || ""
      },
      requestUrl: ajaxConfig.getUserUploadDetail
    }
    ajaxConfig.xjRequestApi(paramsObj, callback);
  },
  /**
   * 预览图片
   */
  previewImage: function (options) {
    var index = options.currentTarget.dataset.index;
    var currentPicList = [];
    this.data.curMyWorksList[index].uploadDetailList.forEach((item) => {
      if (item.mediaType == "picture") {
        currentPicList.push(this.data.imgUrl + item.filePath);
      } else if (item.mediaType == "coverPicture") {
        currentPicList.push(this.data.imgUrl + item.filePath);
      }
    })
    this.setData({
      currentPicList: currentPicList
    })
    wx.previewImage({
      urls: this.data.currentPicList // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sumVideoLikeNumObj = {
      requestUrl: ajaxConfig.sumVideoLikeNum
    }
    ajaxConfig.xjRequestApi(sumVideoLikeNumObj, (calcResult) => {
      this.getMyWorksData(7, "", (res) => {
        this.getMyWorksData(2, "", (result) => {
          if (res.data.data && res.data.data.length > 0) {//有待审核数据 
            if (result.data.data && result.data.data.length > 0) {//有发布作品
              this.setData({
                status: 3,
                curMyWorksList: result.data.data
              })
            } else {//有待审核，没有发布作品
              this.setData({
                status: 1
              })
            }
          } else {//没有待审核数据
            if (result.data.data && result.data.data.length > 0) {//有发布作品
              this.setData({
                status: 3,
                curMyWorksList: result.data.data
              })
            } else {//未发布作品
              this.setData({
                status: 2
              })
            }
          }
        })
      });//默认
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
    return {
      title: '我上电视啦\r\n快来看看我的作品吧~'
    }
  },/**
  * 分享到朋友圈
  */
  onShareTimeline: function () {
    return {
      title: '我上电视啦\r\n快来看看我的作品吧~'
    }
  }
})