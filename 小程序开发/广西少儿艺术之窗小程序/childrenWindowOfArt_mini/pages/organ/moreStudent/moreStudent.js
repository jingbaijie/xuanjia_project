// pages/organ/allStudent/allStudent.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moreStudent:[],
    imgUrl:ajaxConfig.ipConfigImg,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("更多学员"+JSON.parse(options.stuList));
    this.setData({
      moreStudent: JSON.parse(options.stuList)
    })



    // var allStudent = {
    //   requestUrl:ajaxConfig.getStudent,
    //   data:{
    //     areaCode:'',
    //     pageNum:1,
    //     pageSize:20
    //   }
    // }
    // ajaxConfig.xjRequestApi(allStudent,(res) => {
    //   if(res.data.successFlg == 1 && res.data.data ){
    //     this.setData({
    //       allStudent:res.data.data
    //     })
    //   }
    // })

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
  jumpStudentPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/student/student?id=' + e.currentTarget.id,
    })
  }
})