// pages/home/politicsList/politicsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;

    // 思政之窗详情
    wx.get('/api/web/getPolicyShow', { pageNum: 1, pageSize: 100 }).then(res => {
      _this.setData({
        showList: res.data.data.records
      })
    })
    // 动态设置页面名称
    wx.setNavigationBarTitle({
      title: "老干部党校"
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


  onShareAppMessage: function () {
    return {
      title: '思政之窗\r\n老干部党校'
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    return {
      title: '思政之窗\r\n老干部党校'
    }
  },

  itemClick: function (e) {
    wx.navigateTo({ url: '/pages/home/politicsDetail/politicsDetail?key=' + e.currentTarget.id });
  }
})