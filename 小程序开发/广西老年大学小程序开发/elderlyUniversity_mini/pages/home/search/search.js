// pages/home/search/search.js
import AJAX from "../../../utils/request";
const ajaxConfig = new AJAX();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: [],//搜索结果
    focus: true,
    hideTips: false,
    imgUrl:ajaxConfig.ipConfig
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      focus: true
    })
  },


  // 页面搜索
  search: function (e) {
    let _this = this;
    if (e.detail.value == '') {
      return
    }
    wx.get('/api/web/search', { searchValue: e.detail.value }).then(res => {
      _this.setData({
        searchData: res.data.data,
        hideTips: res.data.data.length == 0 ? true : false,
      })
    })
  },
  onShareAppMessage: function () {
    return {
      title: '广西老年互助服务平台'
    }
  },

  // 页面跳转
  jumpPage: function (e) {
    console.log(e);
    // wx.get('/api/web/findVideoListByCartoonId', { cartoonId: e.currentTarget.dataset.contentid, videoNumber: '' }).then(res => {
    //   wx.navigateTo({ url: '/pages/home/video/video?videoId=' + res.data.data[0].movieDetails[0].id });
    // })

    wx.navigateTo({ url: '/pages/interest/course/course?cartoonId=' + e.currentTarget.dataset.contentid + '&title=' + e.currentTarget.dataset.name });


  }

})