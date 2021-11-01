import AJAX from "../../../utils/request"
const ajaxConfig = new AJAX();
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 图片前缀
    imgUrl:ajaxConfig.ipConfigImg,
    // 搜索框是否获焦
    focus: false,
    // 搜索框的值
    search_input_value: '',
    // 搜索类型： 1机构 2 学员 3 视频
    search_type: 1,
    // 搜索第几页
    pageNum: 1,
    // 搜索一页几个
    pageSize: 50,
    // 当前展示数据（或搜索结果）
    search_result: [],
    // 触点开始Y轴值
    clientY_start: 0,
    // 触点结束Y轴值
    clientY_end: 0,
    // 触点开始X轴值
    clientX_start: 0,
    // 触点结束X轴值
    clientX_end: 0,
    /*
      机构数据：
      {
        // 接口返回
        records: [],
        "total": 178,
        "size": 1,
        "current": 1,
        "orders": [],
        "optimizeCountSql": true,
        "hitCount": false,
        "countId": null,
        "maxLimit": null,
        "searchCount": true,
        "pages": 178
      }
    */
    dataList_1: null,
    // 学员数据
    dataList_2: null,
    // 视频数据
    dataList_3: null,
    // 热门搜索推荐结果
    hot_search_obj: {},
    // 跳转子页面取参： 当前跳转类型： jump_type ：（同搜索数据类型）1机构 2 学员 3 视频
    jump_type: 1,
    // 跳转子页面取参：机构ID： cpId
    jump_cpId: '',
    // 跳转子页面取参：学员ID： id
    jump_id: '',
    // 跳转子页面取参：视频ID： videoId
    jump_videoId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 搜索框获焦
    let dataObj = {};
    if (options.search_type) {
      dataObj.search_type = options.search_type;
    }
    this.setData(dataObj);
    // 显示热门搜索
    this.getHotSearchData();
    // 显示默认分类
    this.change_tab();
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
    let _this = this;
    let searchType = _this.data.search_type;
    // 需要请求的下一页页码 空表示到达最后一页，无需请求
    let next_page_num = '';
    if (searchType == 1) {
      // 机构
      if (_this.data.dataList_1.current < _this.data.dataList_1.pages) {
        next_page_num = _this.data.dataList_1.current  + 1;
      }
    } else if (searchType == 2) {
      // 学生
      if (_this.data.dataList_2.current < _this.data.dataList_2.pages) {
        next_page_num = _this.data.dataList_2.current  + 1;
      }
    } else if (searchType == 3) {
      // 视频
      if (_this.data.dataList_3.current < _this.data.dataList_3.pages) {
        next_page_num = _this.data.dataList_3.current  + 1;
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
      _this.setData({
        pageNum: next_page_num
      });
      // 搜索接口调用函数
      let searchObj = {
        callback: function (res) {
          let resultData = res.data.data;
          // 获取当前分类数据键名
          let keyName = 'dataList_' + _this.data.search_type;
          // 获取当前分类数据
          let curClassData = _this.data[keyName];
          // 更新数据数组
          resultData.records = curClassData.records.concat(resultData.records);
          let setDataObj = {
            search_result: resultData.records, 
          }
          setDataObj[keyName] = resultData;
          _this.setData(setDataObj);
          wx.hideLoading({
            success: (res) => {},
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        },
        failCallback: function () {
          wx.showToast({
            title: 'downReq fail',
            icon: 'none'
          })
          wx.hideLoading({
            success: (res) => {},
          })
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        }
      };
      this.search_true(searchObj);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /*
    获取热门搜索推荐
  */
  getHotSearchData: function () {
    let _this = this;
    let getHotSearchList = {
      requestUrl: ajaxConfig.hotSearch,
    }
    ajaxConfig.xjRequestApi(getHotSearchList,(res) => {
      if (res.data.successFlg == 1 && res.data.data) {
        _this.setData({
          hot_search_obj: res.data.data
        })
      } else {
        wx.showToast({
          title: 'hotSearch fail!',
          icon: 'none'
        })
      }
    })
  },
  /*
    // 搜索接口调用函数
    let searchObj = {
      callback: function (res) {
        // let resultData = res.data.data;
        // this.setData({
        //   search_result: resultData.records,
        // });
      },
      failCallback: function () {
        
      }
    };
    this.search_true(searchObj);
  */
 search_true: function (searchObj) {
    // 获取当前分类搜索内容
    var getSearchList = {
      requestUrl: ajaxConfig.search,
      data: {
        openId:app.globalData.openId,
        pageNum: this.data.pageNum || 1,
        pageSize: this.data.pageSize || 8,
        searchValue: this.data.search_input_value,
        // 1机构 2 学员 3 视频
        type: this.data.search_type
      }
    }
    ajaxConfig.xjRequestApi(getSearchList,(res) => {
      if (res.data.successFlg == 1 && res.data.data.records) {
        searchObj.callback && searchObj.callback(res);
      } else {
        searchObj.failCallback && searchObj.failCallback(res);
        wx.showToast({
          title: 'search fail!',
          icon: 'none'
        })
      }
    })
 },
  /*
    搜索函数
  */
  search: function (e) {
    var _this = this;
    // 改变输入框值的数据
    this.setData({
      search_input_value: e.detail.value
    });
    // 搜索接口调用函数
    let searchObj = {
      callback: function (res) {
        let resultData = res.data.data;
        let setObj = {
          // 更新展示数据
          search_result: resultData.records,
        }
        // 更新保存当前分类的数据
        setObj["dataList_" + _this.data.search_type] = resultData;
        _this.setData(setObj);
      },
      failCallback: function () {

      }
    };
    this.search_true(searchObj);
  },
  /*
    切换当前搜索分类

  */
  change_tab: function (e) {
    let _this = this;
    let search_type = _this.data.search_type;
    try {
      search_type = e.currentTarget.dataset.search_type;
    } catch (error) {
      
    }
    this.setData({
      search_type: search_type,
      search_input_value: '',
    })
    //  清空搜索框
    let curClassData = this.data['dataList_' + this.data.search_type];
    if (curClassData && curClassData.records && !curClassData.countId) {
      this.setData({
        search_result: curClassData.records
      })
    } else {
      // 搜索接口调用函数
      let searchObj = {
        callback: function (res) {
          let resultData = res.data.data;
          let setObj = {
            // 更新展示数据
            search_result: resultData.records,
          }
          // 更新保存当前分类的数据
          setObj["dataList_" + _this.data.search_type] = resultData;
          _this.setData(setObj);
        },
        failCallback: function () {

        }
      };
      this.search_true(searchObj);
    }
  },
  /*
    取消搜索 
  */
  cancel_search: function (e){
    // 设置展示数据为当前分类数据
    this.setData({
      search_input_value: ''
    });
    this.change_tab();
  },
  /*
    输入框获焦
  */
  searchInput_focus: function (e) {
    this.setData({
      focus: true
    })
  },
  /*
    输入框失焦
  */
 searchInput_blur: function (e) {
    this.setData({
      focus: false
    })
  },
  /*
    点击热搜
  */
 goHotRecommendPage: function (e) {
    let setDataObj = {
      jump_type: e.currentTarget.dataset.hot_search_type
    }
    let idValue = e.currentTarget.dataset.id;
    switch (e.currentTarget.dataset.hot_search_type) {
      case '1':
        setDataObj.jump_cpId = idValue;
        break;
      case '2':
        setDataObj.jump_id = idValue;
        break;
      case '3':
        setDataObj.jump_videoId = idValue;
        break;
    
      default:
        break;
    }
    // 设置跳转参数
    this.setData(setDataObj);
    // 跳转子页面，跳转前需设定 jump_type和 jump_cpId/jump_id/jump_videoId
    this.jumpSubpage();
  },
  /*
    // 跳转子页面，跳转前需设定 jump_type和 jump_cpId/jump_id/jump_videoId
    this.jumpSubpage();
  */
 jumpSubpage: function () {
    // 判断跳转类型： jump_type ：（同搜索数据类型）1机构 2 学员 3 视频
    // 跳转地址
    let jump_url = '';
    // 错误日式语
    let errorTip = '';
    switch (parseInt(this.data.jump_type)) {
      case 1:
        if (this.data.jump_cpId) {
          jump_url = `/pages/organ/details/details?cpId=${this.data.jump_cpId}`
        } else {
          errorTip = 'jump_cpId empty';
        }
        break;
      case 2:
        if (this.data.jump_id) {
          jump_url = `/pages/organ/student/student?id=${this.data.jump_id}`
        } else {
          errorTip = 'jump_id empty';
        }
        break;
      case 3:
        if (this.data.jump_videoId) {
          jump_url = `/pages/organ/videoDetails/videoDetails?videoId=${this.data.jump_videoId}`
        } else {
          errorTip = 'jump_videoId empty';
        }
        break;
      default:
        errorTip = 'Jump error!';
        break;
    }
    if (errorTip) {
      // 提示跳转错误
      wx.showToast({
        title: errorTip,
        icon: 'none'
      })
    } else {
      // 跳转
      wx.navigateTo({
        url: jump_url,
      })
    }
  },
  /*
    点击列表元素
  */
 clickListDom: function (e) {
    // 获取对应的id值
    let dataIndex = e.currentTarget.dataset.index;
    let jumpSetObj = {
      jump_type: this.data.search_type
    };
    let curSearchType = this.data.search_type;
    if (curSearchType == 1) {
      jumpSetObj.jump_cpId = this.data.search_result[dataIndex].cpId;
    } else if (curSearchType == 2) {
      jumpSetObj.jump_id = this.data.search_result[dataIndex].studentId;
    } else if (curSearchType == 3) {
      jumpSetObj.jump_videoId = this.data.search_result[dataIndex].videoId;
    }
    this.setData(jumpSetObj);
    // 
    console.log(jumpSetObj)
    // 跳转子页面，跳转前需设定 jump_type和 jump_cpId/jump_id/jump_videoId
    this.jumpSubpage();
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
    this.setData({
      clientX_end: e.changedTouches[0].clientX,
      clientY_end: e.changedTouches[0].clientY
    })
    let distance_X = this.data.clientX_end - this.data.clientX_start;
    let distance_Y = this.data.clientY_end - this.data.clientY_start;
    if (distance_X > 0 && Math.abs(distance_X) > 50 && Math.abs(distance_Y) < 25) {
      // 右划左拉
      var search_type = _this.data.search_type;
      search_type--;
      if (search_type < 1) {
        search_type = 1;
      }
      var changeTab_params = {
        currentTarget: {
          dataset: {
            search_type: search_type
          }
        }
      }
      this.change_tab(changeTab_params);
    } else if (Math.abs(distance_X) > 50 && Math.abs(distance_Y) < 25) {
      // 左划右拉
      var search_type = _this.data.search_type;
      search_type++;
      if (search_type > 3) {
        search_type = 3;
      }
      var changeTab_params = {
        currentTarget: {
          dataset: {
            search_type: search_type
          }
        }
      }
      this.change_tab(changeTab_params);
    }
  },
})

// var pages = getCurrentPages()[0];