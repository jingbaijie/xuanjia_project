// components/mine_Title/mine_Title.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    leftIcon: {//左侧图标
      type: String,
      value: ''
    },
    titleText: {//标题文字
      type: String,
      value: ''
    },
    clickEvent: {//点击事件名称
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
   * 关于我们
   */
    aboutUs: function () {
      wx.navigateTo({
        url: '/pages/user/aboutUs/aboutUs',
      });
    },
    /**
   * 联系客服
   */
    contactService: function () {
      wx.makePhoneCall({
        phoneNumber: '96335', //仅为示例，并非真实的电话号码
        success(res) {
          console.log("确定拨打客服电话");
        },
        fail(res) {
          console.log("取消联系客服");
        }
      });
    },
    /**
   * 跳转观看历史
   */
    watchHistory: function () {
      wx.navigateTo({
        url: '/pages/user/watchHistory/watchHistory',
      });
    },
    /**
     * 跳转我的作品页面
     */
    toMyWorks: function () {
      wx.navigateTo({
        url: '/pages/user/myWorks/myWorks',
      })
    }
  }
})
