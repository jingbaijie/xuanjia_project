import AJAX from "../../../utils/request"
const ajaxConfig = new AJAX();
const app = getApp()
const CT = require('../../../utils/generalMothod')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图片前缀
    imgUrl: ajaxConfig.ipConfigImg,
    // 显示内容类型： 0：视频； 1：图片
    show_type: 0,
    // 视频数据
    dataInfo_0: null,
    // 图片数据
    dataInfo_1: null,
    // 当前操作（分享）的 视频/图片 名字
    curShareName: '',
    // 触点开始Y轴值
    clientY_start: 0,
    // 触点结束Y轴值
    clientY_end: 0,
    // 触点开始X轴值
    clientX_start: 0,
    // 触点结束X轴值
    clientX_end: 0,
    // 滚动一个视频的高度差
    video_dom_height: 272,
    // 当前播放的视频的id
    curPlayDomId: '',
    // 标识当前页面视频播放状态（是否播放中）: yes / no
    play_status: 'no',
    // 播放器名称前缀
    video_player_pre: 'myVideo',
  },
  onTabItemTap () {
    console.log('onTabItemTap')
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#6C7AFF', // 传递的颜色值
      // animation: { // 可选项，加上这项会有个显示的动画效果
      //   duration: 4000,
      //   timingFunc: 'easeIn'
      // }
    })
    // 获取 视频广场 或 图片广场 数据
    let params_square = {
      // request page num
      pageNum: 1,
      // 0: video 1: image
      type: _this.data.show_type,
      callback (res) {
        let dataKeyName = 'dataInfo_' + _this.data.show_type;
        let setDataParams = {};
        setDataParams[dataKeyName] = res.data.data;
        // 设置
        _this.setData(setDataParams);
      },
      fallCallback (res) {

      }
    };
    _this.getVideoOrImageData(params_square);
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
    // 暂停当前播放的视频
    this.pauseCurPlayVideo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 暂停当前播放的视频
    this.pauseCurPlayVideo();
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
    let _this = this;
    let requestType = _this.data.show_type;
    // 需要请求的下一页页码 空表示到达最后一页，无需请求
    let next_page_num = '';
    if (requestType == 0) {
      // 视频
      if (_this.data.dataInfo_0.current < _this.data.dataInfo_0.pages) {
        next_page_num = _this.data.dataInfo_0.current  + 1;
      }
    } else if (requestType == 1) {
      // 图片
      if (_this.data.dataInfo_1.current < _this.data.dataInfo_1.pages) {
        next_page_num = _this.data.dataInfo_1.current  + 1;
      }
    } else {
      wx.showToast({
        title: 'down error',
        icon: 'none'
      });
      return;
    }
    // 查看是否需要请求下一页
    if (next_page_num) {//在标题栏中显示加载
      wx.showNavigationBarLoading()
      wx.showLoading({
        //加载转圈显示
        title: '加载中',
      });
      // 获取 视频广场 或 图片广场 数据
      let params_square = {
        // request page num
        pageNum: next_page_num,
        // 0: video 1: image
        type: _this.data.show_type,
        callback (res) {
          let resultData = res.data.data;
          // 获取当前分类数据键名
          let dataKeyName = 'dataInfo_' + _this.data.show_type;
          // 获取当前分类数据
          let curClassData = _this.data[dataKeyName];
          // 更新数据数组
          resultData.records = curClassData.records.concat(resultData.records);
          // 更新数据
          let setDataParams = {};
          setDataParams[dataKeyName] = resultData;
          _this.setData(setDataParams);
          // 停止刷新
          wx.hideLoading({
            success: (res) => {},
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        },
        fallCallback (res) {
          wx.showToast({
            title: 'downReq fail',
            icon: 'none'
          })
          // 停止刷新
          wx.hideLoading({
            success: (res) => {},
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
          // 不执行请求数据失败默认提示
          return true;
        }
      };
      _this.getVideoOrImageData(params_square);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.curShareName
    }
  },
  /**
    // 获取 视频广场 或 图片广场 数据
    let params_square = {
      // request page num
      pageNum: ,
      // 0: video 1: image
      type: ,
      callback (res) {

      },
      fallCallback (res) {

      }
    };
    _this.getVideoOrImageData(params_square);
   */
  getVideoOrImageData: function (params_square = {}) {
    let _this = this;
    let squareParams = {
      requestUrl: ajaxConfig.getContentSquare,
      method: 'GET',
      header: {
        'content-type': "application/json"
      },
      data: {
        openId: app.globalData.openId,
        pageNum: params_square.pageNum || 1,
        pageSize: 50,
        type: params_square.type || _this.data.show_type
      }
    }
    ajaxConfig.xjRequestApi(squareParams,(res) => {
      if (res.data.successFlg == 1 && res.data.data.records) {
        let callbackRes = params_square.callback && params_square.callback(res);
        if (!callbackRes) {
          // 默认操作
        }
      } else {
        let failCallbackRes = params_square.failCallback && params_square.failCallback(res);
        if (!failCallbackRes) {
          // 默认操作
          let tipStr = '获取数据失败!type： ' + _this.data.show_type;
          if (res.errorMsg) {
            tipStr = res.errorMsg;
          }
          wx.showToast({
            title: tipStr,
            icon: 'none'
          });
        }
      }
    })
  },
  /**
    // 切换显示视频广场还是图片广场
   */
  changeShowType: function (e) {
    let _this = this;
    // 暂停当前播放的视频
    this.pauseCurPlayVideo();
    _this.setData({
      show_type: typeof e.show_type == 'number' ? e.show_type : e.target.dataset.show_type
    });
    // 判断当前类数据是否存在
    let dataKeyName = 'dataInfo_' + _this.data.show_type;
    if (!_this.data[dataKeyName]) {
      // 获取 视频广场 或 图片广场 数据
      let params_square = {
        // request page num
        pageNum: 1,
        // 0: video 1: image
        type: _this.data.show_type,
        callback (res) {
          let dataKeyName = 'dataInfo_' + _this.data.show_type;
          let setDataParams = {};
          setDataParams[dataKeyName] = res.data.data;
          // 设置
          _this.setData(setDataParams);
        },
        fallCallback (res) {
          
        }
      };
      _this.getVideoOrImageData(params_square);
    }
  },
  /**
    // 去搜索页
   */
  goSearchPage: function (e) {
    wx.navigateTo({
      url: '/pages/common/search/search',
    })
  },
  /**
   * 去机构页
   */
  toOrganPage (e) {
    // 机构id
    let organ_id = e.currentTarget.dataset.organ_id;
    console.log(e, organ_id)
    // 跳转
    wx.navigateTo({
      url: `/pages/organ/details/details?cpId=${organ_id}`,
    })
  },
  /**
   * 点赞（starFlag） / 收藏（collectionFlag） / 分享
   *  0：已取消 1：已完成
   */
  interactClick (e) {
    let _this = this;
    let dataSet =  e.currentTarget.dataset;
    // 单元数据对象的数据下标
    let data_index = dataSet.data_index;
    // 当前分类数据 （视频 / 图片）
    let curClassName = 'dataInfo_' + _this.data.show_type;
    let curClassData = _this.data[curClassName];
    // 单元数据对象
    let item_data = curClassData.records[data_index];
    console.log(item_data)
    // 请求类型
    let type_value = dataSet.type_value;
    let contentId = item_data.id;
    if (type_value == 1) {
      // 点赞，判断是否已点赞过
      if (item_data.starFlag == 1) {
        item_data.starFlag = 0;
        // 点赞减一
        item_data.wechatVideoExtraInfo.star--;
      } else {
        item_data.starFlag = 1;
        // 点赞加一
        item_data.wechatVideoExtraInfo.star++;
      }
    } else if (type_value == 3) {
      // 收藏，判断是否已收藏过
      if (item_data.collectionFlag == 1) {
        item_data.collectionFlag = 0;
        // 收藏减一
        item_data.wechatVideoExtraInfo.collection--;
      } else {
        item_data.collectionFlag = 1;
        // 收藏加一
        item_data.wechatVideoExtraInfo.collection++;
      }
    } else if (type_value == 5) {
      // 分享
      item_data.shareFlag = 1;
      // 分享加一
      item_data.wechatVideoExtraInfo.share++;
    } else {
      // 啥也不是，错误提示
      wx.showToast({
        title: 'Interact type error!',
        icon: 'none'
      });
      return;
    }
    // 更新点赞/收藏/分享状态
    var setDataParams = {
      curShareName: item_data.videoCname
    };
    setDataParams[curClassName] = curClassData;
    _this.setData(setDataParams);
    // 请求 点赞/收藏/分享
    let data = {
      // 0视频，1图片
      conentType: _this.data.show_type,
      // 内容id(cp的id或video的id或cartoon的id)
      contentId: contentId,
      openId: app.globalData.openId,
      // 1 点赞 2 取消 3 收藏 4 取消收藏 5 分享
      type: type_value
    }
    var operateData = {
      requestUrl:ajaxConfig.operateVideo,
      data:data
    }
    ajaxConfig.xjRequestApi(operateData,(res) => {
      if(res.data.successFlg == 1){
        console.log('类别：' + _this.data.show_type, 'type_value: ' + type_value);
        if (type_value == 5) {
          _this.onShareAppMessage();
        }
      }
    })
  },
  /**
   * 监听开始触摸
   */
  touchStartEvent (e) {
    this.setData({
      clientX_start: e.changedTouches[0].clientX,
      clientY_start: e.changedTouches[0].clientY
    })
  },
  /**
   * 监听结束触摸
   */
  touchEndEvent (e) {
    let _this = this;
    if (true) {
      return;
    }
    this.setData({
      clientX_end: e.changedTouches[0].clientX,
      clientY_end: e.changedTouches[0].clientY
    })
    let distance_X = this.data.clientX_end - this.data.clientX_start;
    let distance_Y = this.data.clientY_end - this.data.clientY_start;
    if (distance_X > 0 && Math.abs(distance_X) > 50 && Math.abs(distance_Y) < 25) {
      if (_this.data.show_type == 1) {
        // 右划左拉，显示视频
        _this.changeShowType({show_type: 0});
      }
    } else if (Math.abs(distance_X) > 50 && Math.abs(distance_Y) < 25) {
      // 左划右拉
      if (_this.data.show_type == 0) {
        // 右划左拉，显示图片
        _this.changeShowType({show_type: 1});
      }
    }
  },
  /**
   * 暂停当前播放的视频
   * @param {*} e 
   */
  pauseCurPlayVideo () {
    let _this = this;
    if (_this.data.curPlayDomId) {
      // 获取之前播放的播放器
      let preVideoDom =  wx.createVideoContext(this.data.curPlayDomId);
      preVideoDom.pause();
      _this.setData({
        play_status: 'no'
      })
    }
  },
  /**
   * 调用播放
   * @param {*} e 
   */
  TruePlayVideo (videoDomId) {
    let _this = this;
    if (videoDomId) {
      let videoPlayer =  wx.createVideoContext(videoDomId);
      setTimeout(() => {
        // 获取之前播放的播放器
        videoPlayer.play();
      }, 0);
      // 更新当前播放的视频domid和播放状态
      _this.setData({
        curPlayDomId: videoDomId,
        play_status: 'yes'
      })
    }
  },
  /**
   * 播放当前视频
   */
  playCurVideo (e) {
    let _this = this;
    // 获取准备播放的播放器
    let videoDomId = e.currentTarget.dataset.video_dom_id;
    // 是否是点击播放器播放按钮触发的本次函数
    let is_play = e.currentTarget.dataset.is_play;
    // 播放当前视频
    // 获取当前要播放视频数据下标
    let clickVideoIndex = e.currentTarget.dataset.index;
    // 获取视频数据
    let videoInfo = _this.data.dataInfo_0;
    // 获取当前要播放视频数据
    let clickVideoData = videoInfo.records[clickVideoIndex];
    // is_play：播放器播放时调用； 记录的当前播放器id是不是当前id
    if (is_play != 'yes' && clickVideoIndex != (_this.curPlayDomId && _this.curPlayDomId.match(/[0-9]+/g)[0])) {
      // 暂停当前播放的视频
      this.pauseCurPlayVideo();
    }
    if (clickVideoData.truePlayUrl) {
      if (is_play != 'yes') {
        setTimeout(() => {
          _this.TruePlayVideo(videoDomId);
        }, 200);
      }
    } else {
      // 获取真正的播放串
      let getTruePlayUrl_params = {
        playUrl: clickVideoData.playUrl,
        callback (truePlayUrl) {
          console.log('truePlayUrl: ' + truePlayUrl);
          clickVideoData.truePlayUrl = truePlayUrl;
          // 更新当前播放的视频domid
          _this.setData({
            curPlayDomId: videoDomId,
            dataInfo_0: videoInfo
          })
          setTimeout(() => {
            _this.TruePlayVideo(videoDomId);
          }, 200);
        },
      }
      CT.getTruePlayUrl(getTruePlayUrl_params);
    }
  },
  /**
   * 页面滑动时
  */
  changeVideoTimer: null,
  onPageScroll (e) {
    let _this = this;
    if (_this.data.show_type == 1 || this.data.play_status == 'no') {
      // 图片分类不执行操作
      return;
    }
    // 获取页面滑动高度
    let scrollValue = e.scrollTop;
    // 算出当前大概是第几个视频在播放
    let videoIndex = String(Math.floor(scrollValue / _this.data.video_dom_height));
    // console.log(videoIndex, scrollValue);
    // 算出当前视频向上的滑动差值
    let diff_value = scrollValue - videoIndex * _this.data.video_dom_height;
    // 获取当前播放视频的下标
    let curPlayVideoIndex = _this.data.curPlayDomId.substring(7);
    // 判断当前页上滑幅度超过应该隐藏值
    let playSec_start = 17;
    if (diff_value < playSec_start) {
      // 未超过，播放可视区域第一个视频
      if (curPlayVideoIndex != videoIndex) {
        // 当前播放视频不是可是区域第一个，换成可是区域第一个
        clearTimeout(_this.changeVideoTimer);
        _this.changeVideoTimer = setTimeout(() => {
          _this.playCurVideo({
            currentTarget: {
              dataset: {
                video_dom_id: _this.data.video_player_pre + videoIndex,
                index: videoIndex,
              }
            }
          })
        }, 200);
      }
    } else {
      // 超过，播放可视区域第二个视频
      videoIndex = videoIndex - 0 + 1;
      if (curPlayVideoIndex != videoIndex) {
        // 当前播放视频不是可是区域第一个，换成可是区域第一个
        clearTimeout(_this.changeVideoTimer);
        _this.changeVideoTimer = setTimeout(() => {
          _this.playCurVideo({
            currentTarget: {
              dataset: {
                video_dom_id: _this.data.video_player_pre + videoIndex,
                index: videoIndex,
              }
            }
          })
        }, 200);
      }
    }
  },
  /**
   * 预览图片
   */
  previewImg (e) {
    let _this = this;
    console.log(e.currentTarget.dataset.src);
    wx.previewImage({
      current:e.currentTarget.dataset.src,   //当前图片地址
      urls: [e.currentTarget.dataset.src],        //所有要预览的图片的地址集合 数组形式
     })
  },
})