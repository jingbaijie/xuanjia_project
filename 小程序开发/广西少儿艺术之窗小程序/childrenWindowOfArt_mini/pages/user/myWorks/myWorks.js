// pages/user/myWorks/myWorks.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    worksList: [],
    picUrl: ajaxConfig.ipConfigImg
  },
  /**
   * 发布作品
   */
  toReleaseWorks: function () {
    wx.switchTab({
      url: "/pages/upload/uploadFile/uploadFile"
    })
  },
  /**
   * 删除未通过作品
  */
  deleteWorks: function (options) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '确定删除当前作品吗？',
      success (res) {
        if (res.confirm) {
          _this.deleteWorks_true(options);
        } else if (res.cancel) {
          
        }
      }
    })
  },
  /**
   * 真正删除未通过作品
   */
  deleteWorks_true: function (options) {
    var index = options.currentTarget.dataset.index;
    var batchNo = options.currentTarget.dataset.batchno;
    var paramsObj = {
      requestUrl: ajaxConfig.deleteWorks,
      data: {
        batchNo: batchNo,
        openId: getApp().globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      if (res.data.errorCode == 1000) { //删除成功
        this.data.worksList.splice(index, 1);
        this.setData({
          worksList: this.data.worksList
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   * status 说明：0- 上传失败 1- 上传成功/待审核  2- 审核通过 3- 审核拒绝
   */
  onLoad: function (options) {
    var paramsObj = {
      requestUrl: ajaxConfig.getMyWorks,
      data: {
        openId: getApp().globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      this.setData({
        worksList: res.data.data.records
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})