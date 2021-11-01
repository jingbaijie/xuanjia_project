// pages/home/video/video.js
import AJAX from "../../../utils/request";
const app = getApp();
const ajaxConfig = new AJAX();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    xjURL: '',
    hTime: 0,
    cartoonId: null,//当前卡通Id
    cartoonInfo: [],//卡通信息
    videoId: null,//当前的视频id
    currentClickIndex: 0,//当前点击的视频列表第几个
    isThumbUp: false,//当前视频是否点赞
    videoPlayNum: 0,//当前视频播放次数
    likeNum: 0,//视频点赞数
    isLike: false,//是否点赞，默认否
    fromPage: 0,//页面来源，0通用视频、course我要学习版块的视频
    imgUrl: ajaxConfig.ipConfig,
    recommendRandomList: [],
    title: "老年互动服务平台",//当前视频的名称
  },
  /**
   * 获取当前视频的点赞数和播放量
   */
  getVideoExtend: function (videoId) {
    // 汇总视频
    var videoExendObj = {
      requestUrl: ajaxConfig.getVideoExtend,
      data: {
        videoId: videoId
      }
    }
    var sumVideoLikeNumObj = {
      requestUrl: ajaxConfig.sumVideoLikeNum
    }
    ajaxConfig.xjRequestApi(sumVideoLikeNumObj, (calcResult) => {
      ajaxConfig.xjRequestApi(videoExendObj, (videoExendData) => {
        if (videoExendData.data.data && videoExendData.data.data.playViews) {
          this.setData({
            videoPlayNum: videoExendData.data.data.playViews
          })
        } else {
          this.setData({
            videoPlayNum: 0
          })
        }
        if (videoExendData.data.data && videoExendData.data.data.likeNum) {
          this.setData({
            likeNum: videoExendData.data.data.likeNum
          })
        } else {
          this.setData({
            likeNum: 0
          })
        }
      })
    })
  },
  /**
   * 点赞视频
   */
  giveThumbUp: function () {
    if (!this.data.isLike) {
      this.setData({
        isLike: true,//当前视频点赞
        likeNum:this.data.likeNum+1
      })
      var insertCartoonLikeObj = {
        requestUrl: ajaxConfig.insertCartoonLikeLog,
        method: "post",
        header: "application/json",
        data: {
          cartoonId: this.data.cartoonId,
          isLike: 1,//1点赞，0取消点赞
          openId: app.globalData.openId,
          videoId: this.data.videoId
        }
      }
      ajaxConfig.xjRequestApi(insertCartoonLikeObj, (likeResult) => {
        if (likeResult.data.errorCode == 1000) {
          console.log("点赞成功");
        } else {
          console.log("点赞失败");
        }
      })
    }
  },
  /**
   * 跳转单集视频，切换视频地址，视频播放页面其他不变
   */
  toSingleVideo: function (options) {
    console.log(options);
    var videoId = options.currentTarget.dataset.videoid;
    this.getVideoPlayData(videoId);//切换视频播放
    this.getVideoExtend(videoId);//获取当前视频播放次数和点赞次数
  },
  /**
   * 获取视频播放信息
   */
  getVideoPlayData: function (videoId) {
    // 根据id获取卡通详情
    let _this = this;
    this.setData({
      videoId: videoId,
      isLike: false//当前视频未点赞
    })
    wx.get('/api/web/findVideoMoiveDetailById', { videoId: videoId }).then(res => {
      wx.request({
        url: ajaxConfig.ipConfig + '/wechatToken/time',
        method: "GET",
        success: function (timeMsg) {
          console.log(timeMsg)
          if (timeMsg && timeMsg.data) {
            var xjToken = wx.Common.JWT({
              "nbf": Math.round(timeMsg.data / 1000),
              "openId": app.globalData.openId,
              "iss": "xj_elderly_university",
              "exp": Math.round((timeMsg.data + 10800000) / 1000),//过期时间，签发时间+30S
              "iat": Math.round(timeMsg.data / 1000),//
              "jti": "a4d512be-acb8-4ed3-9a6d-fc9907f41ffe"
            });
          } else {
            var xjToken = wx.Common.JWT({
              "nbf": Math.round(new Date().getTime() / 1000),
              "openId": app.globalData.openId,
              "iss": "xj_elderly_university",
              "exp": Math.round((new Date().getTime() + 10800000) / 1000),//过期时间，签发时间+30S
              "iat": Math.round(new Date().getTime() / 1000),//
              "jti": "a4d512be-acb8-4ed3-9a6d-fc9907f41ffe"
            });
          }
          if (!_this.data.cartoonId) {
            _this.setData({
              cartoonId: res.data.data.cartoonId
            })

            // 展示列表信息，根据卡通id获取列表信息，点击列表切换视频播放地址
            var paramsObj = {
              requestUrl: ajaxConfig.getVideoIdByCartoonId,
              data: { cartoonId: _this.data.cartoonId }
            }
            ajaxConfig.xjRequestApi(paramsObj, (cartoonInfo) => {
              console.log(cartoonInfo);
              _this.setData({
                cartoonInfo: cartoonInfo.data.data
              })
              _this.data.cartoonInfo.forEach((item, index) => {
                if (item.id == videoId) {
                  _this.setData({
                    currentClickIndex: index
                  })
                }
                return;
              })
            });
          } else {
            _this.data.cartoonInfo.forEach((item, index) => {
              if (item.id == videoId) {
                _this.setData({
                  currentClickIndex: index
                })
              }
              return;
            })
          }

          if (res.data.data.movieDetails[0].more1.indexOf('uploadActivity') != -1) {
            var url = encodeURI(_this.data.imgUrl + res.data.data.movieDetails[0].more1) + '?token=' + xjToken;
          } else {
            var url = encodeURI(_this.data.imgUrl + '/videos' + res.data.data.movieDetails[0].more1) + '?token=' + xjToken;
          }

          _this.setData({
            xjURL: url,
            title: res.data.data.videoCname
          })

          setTimeout(function () {
            _this.videoContext = wx.createVideoContext('xjVideo', _this);
            //_this.videoContext.requestFullScreen({})
          }, 500);

          //当前视频是否点赞过
          var getUserVideoIsLikeObj = {
            data: {
              openId: app.globalData.openId,
              cartoonId: res.data.data.cartoonId,
              videoId: videoId
            },
            requestUrl: ajaxConfig.getUserCartoonLikeLog
          }
          ajaxConfig.xjRequestApi(getUserVideoIsLikeObj, (userVideoIsLikeRes) => {
            if (userVideoIsLikeRes.data.data && userVideoIsLikeRes.data.data[0].isLike == 1) {//点赞过
              _this.setData({
                isLike: true
              })
            }
          })

          // 上传用户观看记录接口
          let insetParams = {
            userId: app.globalData.openId,
            contentId: res.data.data.cartoonId,
            contentType: 1,
            playType: 0,
            videoId: videoId
          }
          wx.get('/api/web/view/history/insert', insetParams).then(res => { })

          // 上传视频播放量
          var addPlayViewsObj = {
            requestUrl: ajaxConfig.addPlayViews,
            data: { videoId: videoId }
          }
          ajaxConfig.xjRequestApi(addPlayViewsObj, (addPlayViewsData) => {
            if (addPlayViewsData.data.errorCode == 1000) {
              console.log("上传播放次数成功");
            } else {
              console.log("上传播放次数失败");
            }
          })
        }
      })
    })

  },
  /**
   * 获取普通视频数据
   * @param {*} options 
   */
  getVideoData: function (tagCode, schedule) {
    var recommendRandomList = [];
    var flag = 1;
    var videoObj = {
      requestUrl: ajaxConfig.findActivityCartoon,
      data: { activitySchedule: schedule }
    }
    ajaxConfig.xjRequestApi(videoObj, (res) => {
      if (res.data.data && res.data.data.length > 0) {
        this.getRandom(res.data.data, recommendRandomList, flag, 6);//获取随机数组六个
      }
    })
  },
  /**
   * 跳转全屏
   */
  toFullScreenPlay: function (options) {
    var cartoonId = options.currentTarget.dataset.cartoonid;
    var paramsObj = {
      requestUrl: ajaxConfig.getVideoIdByCartoonId,
      data: {
        cartoonId: cartoonId
      }
    }
    // 根据卡通ID获取videoId
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      var videoId = res.data.data[0].movieDetails[0].videoId;
      wx.navigateTo({
        url: "/pages/home/video/video?videoId=" + videoId
      });
    })
  },
  /**
   * 跳转相应课程
   */
  toCourse: function (options) {
    var cartoonId = options.currentTarget.dataset.cartoonid;
    var title = options.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../../interest/course/course?cartoonId=' + cartoonId + '&fromPage=' + this.data.fromPage + '&title=' + title
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var videoId = options.videoId;
    var paramsObj = {
      data: { contentName: "xqktWECHAT" },
      requestUrl: ajaxConfig.findCommonPageInfo
    }
    //页面来源
    this.setData({
      fromPage: options.fromPage
    })
    if (this.data.fromPage == "course") {//课程
      var recommendRandomList = [];
      var flag = 1;
      // 更多课程推荐数据
      ajaxConfig.xjRequestApi(paramsObj, (res) => {
        console.log(res.data.data.recommend_1);
        var recommendList = res.data.data.recommend_1;
        this.getRandom(recommendList, recommendRandomList, flag, 4);//获取随机数组四个
      })
    } else {//视频
      this.getVideoData("biaoyan", 0);//固定往期表演视频
    }
    this.getVideoPlayData(videoId);
    this.getVideoExtend(videoId);
  },
  /**
   * 获取四个随机的推荐数组
   */
  getRandom: function (recommendList, recommendRandomList, flag, num) {
    var random = Math.floor(Math.random() * recommendList.length);//[0,9);
    recommendRandomList.push(recommendList[random]);
    recommendList.splice(random, 1);
    flag++;
    if (flag > num) {
      this.setData({
        recommendRandomList: recommendRandomList
      })
    } else {
      this.getRandom(recommendList, recommendRandomList, flag, num);
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
* 生命周期函数--监听页面初次渲染完成
*/
  onReady: function () {

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
    var shareTitle = "";
    if (this.data.cartoonInfo[0].cartoonInfo.cartoonCname == this.data.title) {
      shareTitle = this.data.cartoonInfo[0].cartoonInfo.cartoonCname;
    } else {
      shareTitle = this.data.cartoonInfo[0].cartoonInfo.cartoonCname + "\r\n" + this.data.title;
    }
    return {
      title: shareTitle
    }
  },

  // 监听退出全屏方法
  fullscreenchange: function (e) {
    // if (wx.IS_IOS) {
    //   if (e.detail.direction == 'vertical') {
    //     wx.navigateBack({
    //       delta: 1
    //     })
    //   }
    // } else {
    //   if (e.detail.direction == 'horizontal') {
    //     this.setData({
    //       hTime: this.data.hTime + 1
    //     })
    //   }
    //   if (this.data.hTime > 1) {
    //     if (e.detail.direction == 'horizontal') {
    //       wx.navigateBack({
    //         delta: 1
    //       })
    //     }
    //   }
    // }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline: function () {
    var shareTitle = "";
    if (this.data.cartoonInfo[0].cartoonInfo.cartoonCname == this.data.title) {
      shareTitle = this.data.cartoonInfo[0].cartoonInfo.cartoonCname;
    } else {
      shareTitle = this.data.cartoonInfo[0].cartoonInfo.cartoonCname + "\r\n" + this.data.title;
    }
    return {
      title: shareTitle
    }
  },

  onAdplay(e) {

  },
  onAdload(e) {

  },
  onAdclose(e) {

  },
  onAdError(e) {

  },

})