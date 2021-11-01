class request {
  constructor() {
    this._header = { 'content-type': 'application/x-www-form-urlencoded' };
    this.baseurlLocal = "http://192.168.2.146:18088/iptv-wechat-api";
    this.ipConfigLocal = "http://192.168.2.61:8088";
    // this.ipConfig = "http://lndx.tvjoy.cn:28080";
    // this.ipConfig = "https://lndx.tvjoy.cn:28443";
    // this.ipConfig = "https://xxzq.96335.com:29443";//广西测试网
    this.ipConfig = "https://xxzq.96335.com:28443";//广西现网
    this._baseUrl = this.ipConfig + '/iptv-wechat-api';
    this.getworksTagApi = this._baseUrl + "/api/wechat/getUploadTag";//获取作品标签
    this.uploadActivityApi = this._baseUrl + "/api/wechatUpload/uploadActivity";//上传活动表单资源
    this.getCurrentActivity = this._baseUrl + "/api/activity/getCurrentActivity";//获取当前活动
    this.getRecommonPageInfo = this._baseUrl + "/api/web/findRecCommonPageInfo";//获取推荐页面数据
    this.findTemplateInfo = this._baseUrl + "/api/web/findTemplateInfo";//请求通用页面的地址
    this.findCommonPageInfo = this._baseUrl + "/api/web/findCommonPageInfo";//获取页面配置数据
    this.findActivityCartoon = this._baseUrl + "/api/web/findActivityCartoon";//获取活动上传卡通详情（视频）
    this.uploadDetail = this._baseUrl + "/api/wechatUpload/getUploadDetail";//获取上传资源详情（图片 ）
    this.updatePhoneNum = this._baseUrl + "/api/wechat/updatePhoneNum";//绑定手机号
    this.getOpenId = this._baseUrl + "/api/wechat/getOpenId";//获取用户唯一标识
    this.getUserInfo = this._baseUrl + "/api/wechat/getWechatUser";//获取用户信息
    this.insertUserInfo = this._baseUrl + "/api/wechat/insertWeChatUser";//存入用户信息
    this.getHistory = this._baseUrl + "/api/web/view/history";//历史数据
    this.getVideoIdByCartoonId = this._baseUrl + "/api/web/findVideoListByCartoonId"//根据卡通id获取videoId
    this.getUserUploadDetail = this._baseUrl + "/api/wechatUpload/getUserUploadDetail"//获取当前用户上传作品得状态
    this.insertCartoonLikeLog = this._baseUrl + "/api/cartoonLike/insertCartoonLikeLog"//点赞
    this.getVideoExtend = this._baseUrl + "/api/videoExtend/getVideoExtend"//获取video点赞数量和播放量
    this.addPlayViews = this._baseUrl + "/api/videoExtend/addPlayViews"//上传增加播放量
    this.sumVideoLikeNum = this._baseUrl + "/api/videoExtend/sumVideoLikeNum"//计算汇总视频点赞数
    this.getUserCartoonLikeLog = this._baseUrl + "/api/cartoonLike/getUserCartoonLikeLog"//用户当前视频是否点赞
    this.delUploadLog = this._baseUrl + "/api/wechatUpload/delUploadLog"//删除用户上传的作品
    this.picViewNumLog = this._baseUrl + "/api/wechatUpload/addPlayViews"//上传图片查看次数
    this.sumCartoonLikeNum = this._baseUrl + "/api/cartoonExtend/sumCartoonLikeNum"//计算汇总卡通点赞总数
  }
  /**
   * 接口请求_xujie
   */
  xjRequestApi(paramsObj, callback, failCallback) {
    wx.request({
      url: paramsObj.requestUrl,
      header: paramsObj.header || this._header,
      method: paramsObj.method || "GET",
      data: paramsObj.data || {},
      success: (res) => {
        callback && callback(res);
      },
      fail: (res) => {
        failCallback && failCallback(res);
      }
    })
  }


  /**
   * 设置统一的异常处理
   */
  setErrorHandler(handler) {
    this._errorHandler = handler;
  }

  /**
   * GET类型的网络请求
   */
  getRequest(url, data, header = this._header) {
    return this.requestAll(this._baseUrl + url, data, header, 'GET')
  }

  /**
   * DELETE类型的网络请求
   */
  deleteRequest(url, data, header = this._header) {
    return this.requestAll(this._baseUrl + url, data, header, 'DELETE')
  }

  /**
   * PUT类型的网络请求
   */
  putRequest(url, data, header = this._header) {
    return this.requestAll(this._baseUrl + url, data, header, 'PUT')
  }

  /**
   * POST类型的网络请求
   */
  postRequest(url, data, header = this._header) {
    return this.requestAll(this._baseUrl + url, data, header, 'POST')
  }

  // 封装请求
  requestAll(url, data, header, method) {

    return new Promise((resolve, reject) => {
      // 调用请求显示loading
      wx.showLoading({
        title: '加载中...'
      })

      wx.request({
        url: url,
        data: data,
        header: header,
        method: method,
        success: (res => {
          // 关闭loading
          wx.hideLoading()
          if (res.statusCode === 200) {
            // 如果token过期，需要重新调用getopenid
            if (res.data.errorCode == '104') {
              wx.login({
                success: res => {
                }
              });
              wx.showToast({
                title: '服务器超时，请重试',
                icon: 'none'
              })
            } else {
              resolve(res)
            }

          } else {
            console.log('!200')
            //其它错误，提示用户错误信息
            if (this._errorHandler != null) {
              //如果有统一的异常处理，就先调用统一异常处理函数对异常进行处理
              this._errorHandler(res)
            }
            reject(res)
          }
        }),
        fail: (res => {
          // 关闭loading
          wx.hideLoading()
          if (this._errorHandler != null) {
            this._errorHandler(res)
          }
          reject(res)
        })
      })
    })
  }
}

export default request