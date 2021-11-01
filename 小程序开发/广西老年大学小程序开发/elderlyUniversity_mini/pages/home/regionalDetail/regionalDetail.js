// pages/home/regionalDetail/regionalDetail.js
Page({

  // 页面初始化数据
  data: {
    pageData: null
  },
  // 页面加载
  onLoad: function (options) {
    let _this = this;
    wx.get('/api/web/findCommonPageInfo', { contentName: 'jqqdWECHAT' }).then(res => {
      console.log(res);
      _this.setData({
        pageData: res.data.data.pageInfo
      })
    })

    // 动态设置页面名称
    wx.setNavigationBarTitle({
      title: options.name
    })
  },
  //  命周期函数--监听页面初次渲染完成
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


  onShareAppMessage: function () {
    return {
      title: '广西老年互助服务平台'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '广西老年互助服务平台'
    }
  },
})