// pages/organ/cityType/cityType.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList:[],//城市列表
    cityId:0//选中城市id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var getAreaList = {
      requestUrl: ajaxConfig.area
    }
    ajaxConfig.xjRequestApi(getAreaList,(res) => {
      if (res.data.successFlg == 1 && res.data.data) {
        that.setData({
          areaList :res.data.data
        })
      }
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
   * 选择城市
   */
  selectCity:function(e){
    const cities =this.data.areaList;
    var city = cities.find(c => c.id == e.currentTarget.id);//根据城市id查找
    if (city) {
      if (city.name === '南宁市') {
        city.ename = 'nanning';
      } else if (city.name === '柳州市') {
        city.ename = 'liuzhou';
      } else if (city.name === '桂林市') {
        city.ename = 'guilin';
      } else if (city.name === '梧州市') {
        city.ename = 'wuzhou';
      } else if (city.name === '北海市') {
        city.ename = 'beihai';
      } else if (city.name === '崇左市') {
        city.ename = 'chongzuo';
      } else if (city.name === '来宾市') {
        city.ename = 'laibin';
      } else if (city.name === '贺州市') {
        city.ename = 'hezhou';
      } else if (city.name === '玉林市') {
        city.ename = 'yulin';
      } else if (city.name === '百色市') {
        city.ename = 'baise';
      } else if (city.name === '河池市') {
        city.ename = 'hechi';
      } else if (city.name === '钦州市') {
        city.ename = 'qinzhou';
      } else if (city.name === '防城港市') {
        city.ename = 'fangchenggang';
      } else if (city.name === '贵港市') {
        city.ename = 'guigang';
      }
      app.globalData.city = city;
    } else {
      app.globalData.city = app.globalData.defaultCity;
    }
    this.setData({
      cityId: app.globalData.city.id
    })
    wx.switchTab({
      url: '../index/index'
  })

  }
})