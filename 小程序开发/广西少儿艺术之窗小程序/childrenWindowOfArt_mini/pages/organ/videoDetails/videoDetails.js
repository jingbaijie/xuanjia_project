// pages/organ/videoDetails/videoDetails.js
import AJAX from "../../../utils/request";
const CT = require("../../../utils/generalMothod");
const ajaxConfig = new AJAX();
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoDetail:[],
    imgUrl:ajaxConfig.ipConfigImg,
    videoId:0,
    starFlag:0,//0未点赞  1已点赞
    star:0,//点赞
    collectionFlag:0,//0未收藏 1 已收藏
    collection:0,//收藏
    share:0,//分享
    xjURL:''//视频地址

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    var videoData = {
      requestUrl:ajaxConfig.findVideoDetailById,
      data:{
        id:options.videoId,
        openId:app.globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(videoData,(res) => {
      if(res.data.successFlg == 1 && res.data.data){
        ajaxConfig.xjRequestApi({
          requestUrl:ajaxConfig.time
        },(timerRes) => {
          var xjToken = wx.Common.JWT({
            "nbf": Math.round((timerRes.data - 5000) / 1000),
            "openId": app.globalData.openId,
            "iss": "xj_yszc_university",
            "exp": Math.round((timerRes.data + 10800000) / 1000),//过期时间，签发时间+30S
            "iat": Math.round((timerRes.data - 5000) / 1000),//
            "jti": "a4d512be-acb8-4ed3-9a6d-fc9907f41ffe",
          });
          var url = ajaxConfig.ipConfigLocal + "/videos/" + res.data.data.movieDetails[0].playUrl + '?token=' + xjToken;

          this.setData({
            videoDetail:res.data.data,
            videoId:options.videoId,
            star:res.data.data.wechatVideoExtraInfo.star,
            collection:res.data.data.wechatVideoExtraInfo.collection,
            share:res.data.data.wechatVideoExtraInfo.share,
            starFlag:res.data.data.starFlag,
            collectionFlag:res.data.data.collectionFlag,
            xjURL:url
          });
          _this.videoContext = wx.createVideoContext('myVideo', _this);
          setTimeout(function () {
            _this.videoContext = wx.createVideoContext('myVideo', _this);
            //_this.videoContext.requestFullScreen({})
          }, 500);

        })
    

      }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.onOperateVideo(null,5);
    　return{
      title:this.data.videoDetail.videoCname
    }
   

  },

  /**
   * 收藏，点赞 ，转发
   */
  onOperateVideo:function(e,type){
    console.log("分享类型："+ type);
    if(type == 5){//转发
      this.setData({
        share:this.data.share + 1
      })
      console.log("分享量："+ this.data.share);
    }else if(e.currentTarget.id == 1){//未点赞
      this.setData({
        star:this.data.star + 1,
        starFlag:1
      })
    }else if(e.currentTarget.id == 2){//已点赞
      this.setData({
        star:this.data.star - 1,
        starFlag:0
      })
    }else if(e.currentTarget.id == 3){//未收藏
      this.setData({
        collection:this.data.collection + 1,
        collectionFlag:1
      })
    }else if(e.currentTarget.id == 4){//已收藏
      this.setData({
        collection:this.data.collection - 1,
        collectionFlag:0
      })
    }

    var operateData = {
      requestUrl:ajaxConfig.operateVideo,
      data:{ 
        conentType:0,
        contentId:this.data.videoId,//这里是视频ID
        openId:app.globalData.openId,
        type:type || e.currentTarget.id
      }
    }
    ajaxConfig.xjRequestApi(operateData,(res) => {
      if(res.data.successFlg == 1){
      }
    })

  },
  /** 
   * 新增历史记录
   * @param {}
   */
  insertHistory:function(e){
    let _this = this;
    // 判断是否需要再次检查网络类型
    if (_this.data.alreadyNetwrorkTpye) {
      _this.setData({
        alreadyNetwrorkTpye: ''
      })
      return;
    }
    // 获取播放器
    let player = wx.createVideoContext(e.currentTarget.dataset.player_id);
    // 暂停
    player.pause();
    //  检查用户是否使用流量数据，只提示一次
    let showNetwrorkTpye_params = {
      callback () {
        // 用户同意流量播放回调
        // 声明不执行检查流量类型
        _this.setData({
          alreadyNetwrorkTpye: 'yes'
        })
        // 继续播放
        player.play();
        _this.insertHistory_true();
      },
      // WiFi环境
      otherCallback () {
        // 声明不执行检查流量类型
        _this.setData({
          alreadyNetwrorkTpye: 'yes'
        })
        // 继续播放
        player.play();
        _this.insertHistory_true();
      },
      failCallback () {
        // 用户不同意播放回调
        // 声明不执行检查流量类型
        _this.setData({
          alreadyNetwrorkTpye: 'yes'
        })
      }
    }
    CT.showNetwrorkTpye(showNetwrorkTpye_params);
  },
  /** 
   * 新增历史记录
   * @param {}
   */
  insertHistory_true:function(e){
    console.log('波段'+this.data.videoDetail.movieDetails[0].id)
    var history = {
      requestUrl:ajaxConfig.insertHistory,
      data:{
        contentId:this.data.videoDetail.movieDetails[0].id,//这里是movieDetails.id
        userId:app.globalData.openId,
        videoId:this.data.videoId
      }
    }
    ajaxConfig.xjRequestApi(history,(res) => {
      if(res.data.successFlg == 1 && res.data.data){

      }
    })
  },
  /**
   * 跳视频详情页
   * @param {t} e 
   */
  jumpVideoDetailsPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/videoDetails/videoDetails?videoId=' + e.currentTarget.id,
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