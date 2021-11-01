// pages/organ/index/index.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    organList:[],
    imgUrl:ajaxConfig.ipConfigImg,
    pageNum:1,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
    this.getOrganList();
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
    console.log("上拉刷新");
    var pageNum = this.data.pageNum + 1;
    console.log("页数："+pageNum);
    this.setData({
      pageNum:pageNum
    })
    this.getOrganList();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 机构列表
   */
  getOrganList:function(){
    // var code = wx.getStorageSync('code'); //获取缓存中的城市
    // console.log("缓存城市编码：" + code);
    var getOrganList = {
      requestUrl: ajaxConfig.organ,
      data:{
        areaCode:app.globalData.city.code || '',
        pageNum:this.data.pageNum,
        pageSize:16
      }
    }
    ajaxConfig.xjRequestApi(getOrganList,(res) => {
      if(res.data.successFlg == 1 && res.data.data){
        var arr1 = this.data.organList;
        var arr2 = res.data.data.records;
        arr1 = arr1.concat(arr2);
        this.setData({
          organList : arr1
        })
      }
    })
  },
/**
 * 跳机构详情
 * @param {*} e 
 */
  jumpdetails: function(e) {
    wx.navigateTo({
      url: '/pages/organ/details/details?cpId=' + e.currentTarget.id,
    })
  }
})