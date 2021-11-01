// pages/organ/allStudent/allStudent.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreStudent:[],
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
    this.getStudent();
   
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
    this.getStudent();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 跳转学员详情
   * @param {} e 
   */
  jumpStudentPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/student/student?id=' + e.currentTarget.id,
    })
  },
  /**
   * 获取学员列表
   * @param {*} e 
   */
  getStudent:function(e){
    console.log("缓存城市编码：" + app.globalData.city.id);
    var allStudent = {
      requestUrl:ajaxConfig.getStudent,
      data:{
        areaCode:app.globalData.city.id,
        pageNum:this.data.pageNum,
        pageSize:20
      }
    }
    ajaxConfig.xjRequestApi(allStudent,(res) => {
      if(res.data.successFlg == 1 && res.data.data ){
        var moreStudent1 = this.data.moreStudent;
        var moreStudent2 = res.data.data.records;
        moreStudent1 = moreStudent1.concat(moreStudent2);
        this.setData({
          moreStudent:moreStudent1
        })
      }
    })

  }

})