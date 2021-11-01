// pages/organ/student/student.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData : 0,
    studentDetail:[],
    imgUrl:ajaxConfig.ipConfigImg,
    picList:'',
    

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var studentDetailById = {
      requestUrl:ajaxConfig.getStudentDetailById,
      data:{
        id:options.id
      }
    }
    ajaxConfig.xjRequestApi(studentDetailById,(res) => {
      if(res.data.successFlg == 1 && res.data.data){
        for(var i=0;i<res.data.data.picList.length;i++){
          var picUrl = this.data.imgUrl + res.data.data.picList[i].playUrl;
        }
        var picList = [];
        picList.push(picUrl);
        this.setData({
          studentDetail:res.data.data,
          picList:picList,
        })

      }
    })
  

  },

   //获取当前滑块的index
   bindchange:function(e){
    const that  = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent:function(e){
    const that = this;
    if (that.data.currentData === e.currentTarget.dataset.current){//e.target.dataset.current
        return false;
    }else{
      that.setData({
        currentData: e.currentTarget.dataset.current
      })
    }
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
   * 跳视频详情
   * @param {} e 
   */
  jumpPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/videoDetails/videoDetails?videoId=' + e.currentTarget.id,
    })
  },
    /**
   * 图片预览
   * @param {*} e 
   */
  onPreview:function(e){
    let currentUrl = e.currentTarget.dataset.src;
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: this.data.picList // 需要预览的图片http链接列表
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