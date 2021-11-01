// commpents/Mine_list/Mine_list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    myTitleObj: {
      type: Object,
      value: {}
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
     * 机构入驻
     */
    clickRuzhu: function () {
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
     * 联系客服
     */
    clickContact: function () {
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
     * 我的作品
     */
    clickMyWorks: function () {
      wx.navigateTo({
        url: '../../user/myWorks/myWorks'
      })
    },
    /**
     * 关于我们
     */
    clickAboutUs: function () {
      wx.navigateTo({
        url: '../../user/aboutUs/aboutUs'
      })
    },
  }
})
