// pages/user/myWorks/myWorks.js
import AJAX from "../../../utils/request";
import Common from "../../../utils/common";
const ajaxConfig = new AJAX();
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    releaseType: 7,//发布类型，7待发布，2已发布
    waitReleaseList: [],//待发布作品
    releasedList: [],//已发布作品列表
    currentPicList: [],//当前图片地址列表  
    showPic: "",//展示图片
    imgUrl: ajaxConfig.ipConfig,//本地图片地址
    fromPage: 0,//从何而来
    keyWords: "",//搜索框关键词
    releaseStatus: 0,//发布状态 1待发布无,已发布有；2待发布无，已发布无；3待发布有，已发布无；4待发布有，已发布有；
    isSearch: false,//是否是搜索操作
    searchList: [],//搜索列表
    searchDelete: false,//是否为搜索删除
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
    this.getMyWorksData(this.data.releaseType, keyWords, (searchRes) => {
      this.setData({
        keyWords: "",
        searchList: searchRes.data.data || [],
        isSearch: true
      })
    });
  },
  /**
   * 滑动删除
   */
  slideButtonTap:function(e){
    this.deleteNoPass(e);
  },
  /**
   * 删除未审核通过的作品
   */
  deleteNoPass: function (options) {
    var index;
    if(options.currentTarget.dataset.index==0 || options.currentTarget.dataset.index){
      index = options.currentTarget.dataset.index;
    }else{
      index = options.detail.data;
    }
    var curMyWorksList = [];
    if (this.data.isSearch) {
      curMyWorksList = this.data.searchList;
    } else if (this.data.releaseType == 7) {
      curMyWorksList = this.data.waitReleaseList;
    } else if (this.data.releaseType == 2) {
      curMyWorksList = this.data.releasedList;
    }
    var batchNo = curMyWorksList[index].batchNo;
    curMyWorksList.splice(index, 1);
    if (this.data.isSearch) {
      this.setData({
        searchList: curMyWorksList,
        searchDelete: true
      })
    } else if (this.data.releaseType == 7) {
      this.setData({
        waitReleaseList: curMyWorksList
      })
    } else if (this.data.releaseType == 2) {
      this.setData({
        releasedList: curMyWorksList
      })
    }
    var deleteParamsObj = {
      data: { batchNo: batchNo, openId: app.globalData.openId },
      requestUrl: ajaxConfig.delUploadLog
    }
    ajaxConfig.xjRequestApi(deleteParamsObj);
  },
  /**
   * 选择待发布还是已发布
   */
  chooseType: function (options) {
    this.setData({
      isSearch: false
    })
    var type = options.currentTarget.dataset.type;
    if (type == 7) {//待发布
      this.setData({
        releaseType: 7
      })
    } else if (type == 2) {//已发布
      this.setData({
        releaseType: 2
      })
    }
    this.getMyWorksData(this.data.releaseType, "", (res) => {
      if (this.data.releaseType == 7) {
        this.setData({
          waitReleaseList: res.data.data || []
        })
      } else if (this.data.releaseType == 2) {
        this.setData({
          releasedList: res.data.data || []
        })
      }
      if (this.data.waitReleaseList && this.data.waitReleaseList.length > 0) {//待发布有数据        
        if (this.data.releasedList && this.data.releasedList.length > 0) {//待发布有数据，已发布有数据
          this.setData({
            releaseStatus: 4
          })
        } else {//待发布有数据，已发布无数据
          this.setData({
            releaseStatus: 3
          })
        }
      } else {//待发布无数据
        if (this.data.releasedList && this.data.releasedList.length > 0) {//待发布无数据，已发布有数据
          this.setData({
            releaseStatus: 1
          })
        } else {//待发布无数据，已发布无数据
          this.setData({
            releaseStatus: 2
          })
        }
      }
    })
  },
  /**
   * 获取页面数据
   */
  getMyWorksData: function (releaseType, worksName, callback) {
    var paramsObj = {
      data: {
        status: releaseType,
        openId: app.globalData.openId,
        title: worksName || ""
      },
      requestUrl: ajaxConfig.getUserUploadDetail
    }
    var sumVideoLikeNumObj = {
      requestUrl: ajaxConfig.sumVideoLikeNum
    }
    ajaxConfig.xjRequestApi(sumVideoLikeNumObj, (calcResult) => {
      ajaxConfig.xjRequestApi(paramsObj, callback);
    });
  },
  /**
   * 预览图片
   */
  previewImage: function (options) {
    var index = options.currentTarget.dataset.index;
    var currentPicList = [];
    var curMyWorksList = [];
    if (this.data.isSearch) {
      curMyWorksList = this.data.searchList;
    } else if (this.data.releaseType == 7) {
      curMyWorksList = this.data.waitReleaseList;
    } else if (this.data.releaseType == 2) {
      curMyWorksList = this.data.releasedList;
    }
    curMyWorksList[index].uploadDetailList.forEach((item) => {
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
    this.getMyWorksData(7, "", (waitReleaseData) => {
      var waitReleaseData = waitReleaseData.data.data || [];
      this.getMyWorksData(2, "", (releasedData) => {
        var releasedData = releasedData.data.data || [];
        this.setData({
          waitReleaseList: waitReleaseData,
          releasedList: releasedData
        })
        if (waitReleaseData && waitReleaseData.length > 0) {//待发布有数据        
          if (releasedData && releasedData.length > 0) {//待发布有数据，已发布有数据
            this.setData({
              releaseStatus: 4
            })
          } else {//待发布有数据，已发布无数据
            this.setData({
              releaseStatus: 3
            })
          }
        } else {//待发布无数据
          if (releasedData && releasedData.length > 0) {//待发布无数据，已发布有数据
            this.setData({
              releaseStatus: 1
            })
          } else {//待发布无数据，已发布无数据
            this.setData({
              releaseStatus: 2
            })
          }
        }
      })
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

  }
})