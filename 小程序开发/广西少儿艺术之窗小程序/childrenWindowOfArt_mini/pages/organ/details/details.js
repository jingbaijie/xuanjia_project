// pages/organ/details/details.js
import AJAX from "../../../utils/request";
const CT = require("../../../utils/generalMothod");
const ajaxConfig = new AJAX();
const app = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    organDetail:{},
    imgUrl:ajaxConfig.ipConfigImg,
    cpLabel:[],
    collected:0,//0收藏  1 已收藏
    picList:[], //图片列表
    cpId:0,//机构ID
    xjURL:'',
    picUrl:false,//默认图是否显示

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cpId:options.cpId
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
    this.getOrganDetail();
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
 * 获取机构详情
 * @param {} options 
 */
  getOrganDetail:function(e){
    var _this = this;
    var getOrganDetailObj = {
      requestUrl:ajaxConfig.getCpDetailById,
      data:{
        id:this.data.cpId,//options.cpId
        openId:app.globalData.openId,//app.globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(getOrganDetailObj,(res) => {
      if(res.data.successFlg == 1 && res.data.data){
        ajaxConfig.xjRequestApi({
          requestUrl: ajaxConfig.time
        }, (timerRes)=>{
          var xjToken = wx.Common.JWT({
            "nbf": Math.round((timerRes.data - 5000) / 1000),
            "openId": app.globalData.openId,
            "iss": "xj_yszc_university",
            "exp": Math.round((timerRes.data + 10800000) / 1000),//过期时间，签发时间+30S
            "iat": Math.round((timerRes.data - 5000) / 1000),//
            "jti": "a4d512be-acb8-4ed3-9a6d-fc9907f41ffe",
          });
    
          if(res.data.data.introductionList.length > 0){
            var url = ajaxConfig.ipConfigLocal + "/videos/" + res.data.data.introductionList[0].playUrl + '?token=' + xjToken;
            console.log(xjToken);
          }
          for(var i=0;i<res.data.data.picList.length;i++){
            var picUrl = _this.data.imgUrl + res.data.data.picList[i].playUrl;
          }
          var picList = [];
          picList.push(picUrl);
      
          _this.setData({
            organDetail:res.data.data,
            cpLabel:res.data.data.CpDetail.cpLabel.split(" "),
            collected:res.data.data.collected,
            picList:picList,
            xjURL:url,
            picUrl:true,
          })
          setTimeout(function () {
            _this.videoContext = wx.createVideoContext('xjVideo', _this);
            console.log(_this.videoContext)
            //_this.videoContext.requestFullScreen({})
          }, 500);
        })
      }
    })
  },
  /**
   * 点击收藏   已收藏
   */
  onCollectCp: function(e){
    var collectCp = {
      requestUrl:ajaxConfig.collectCp,
      data:{
        id:this.data.cpId,//options.cpId
        openId:app.globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(collectCp, (res) => {
      if(res.data.successFlg == 1){
        if(e.currentTarget.id == 0){//收藏
          this.setData({
            collected:1
          })
        }else if(e.currentTarget.id == 1){//已收藏
          this.setData({
            collected:0
          })
        }
      }
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
   * 跳学员主页
   * @param {t} e 
   */
  jumpStudentPage:function(e){
    wx.navigateTo({
      url: '/pages/organ/student/student?id=' + e.currentTarget.id,
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
   * 跳转
   */
  jumpPage:function(e){
    switch(e.currentTarget.id){
      case'moreStudent':
      wx.navigateTo({
        url: '/pages/organ/moreStudent/moreStudent?stuList='+ JSON.stringify(this.data.organDetail.stuList),
      })
      break;
      case'moreVideo':
      wx.navigateTo({
        url: '/pages/organ/moreVideo/moreVideo?videoList='+ JSON.stringify(this.data.organDetail.videoList),
      })
      break;
      case'morePic':
      wx.navigateTo({
        url: '/pages/organ/morePicList/morePicList?picList='+ JSON.stringify(this.data.organDetail.picList),
      })
      default:
        break;
    }
  },
  /**
   * 播放視頻提示
   * @param {} param0 
   */
  showNetwrorkTpye:function(e){
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
      },
      // WiFi环境
      otherCallback () {
        // 声明不执行检查流量类型
        _this.setData({
          alreadyNetwrorkTpye: 'yes'
        })
        // 继续播放
        player.play();
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
  }
})