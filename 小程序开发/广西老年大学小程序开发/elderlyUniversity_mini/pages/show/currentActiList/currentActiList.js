import AJAX from "../../../utils/request";
import Common from "../../../utils/common";
let ajaxConfig = new AJAX();
let imgUrl = ajaxConfig.ipConfig;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: imgUrl,//图片地址
    currentPicData: [], //当前图片作品数据 
    uploadDetailImgArr: []//图片数组
  },
  /**
   * 获取上传资源详情(图片)
   * @param {*activityId} 活动id false
   * @param {*tagCode} 上传标签code true
   * @param {*activitySchedule} 活动状态 0-往期 1-上期 2-当前期 true
   */
  requestPicData: function (tagCode, schedule) {
    var paramsObj = {
      requestUrl: ajaxConfig.uploadDetail,
      data: {
        tagCode: tagCode,
        activitySchedule: schedule//0,往期；1,上期
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      console.log(res);
      var resData = res.data.data;
      this.setData({
        currentPicData: resData
      })
    })
  },
  /**
   * 点击全屏预览图片
   */
  previewImage: function (options) {
    var index = options.currentTarget.dataset.index;
    var currentDetailList = this.data.currentPicData[index].uploadDetailList;
    var currentImgArr = [];//图片数组
    currentDetailList.forEach((item) => {
      currentImgArr.push(this.data.imgUrl+item.filePath);
    })
    this.setData({
      uploadDetailImgArr: currentImgArr
    }, () => {
      wx.previewImage({
        urls: this.data.uploadDetailImgArr
      })
    })
    // 上传图片浏览次数
    Common.uploadPicViewNum(this.data.currentPicData[index].batchNo);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var pageTitle = "";//页面标题
    var pageType = 0;//页面类型
    var tagCode = "";
    switch (options.tagCode) {
      case "huihua":
        pageTitle = "绘画作品";
        break;
      case "shufa":
        pageTitle = "书法作品";
        break;
      case "sheying":
        pageTitle = "摄影作品";
        break;
      default:
        break;
    }
    this.requestPicData(options.tagCode, options.schedule);
    // 根据眉头参数动态改变页面标题
    wx.setNavigationBarTitle({
      title: pageTitle
    });
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
    return {
      title: '广西老年互助服务平台'
    }
  }
})