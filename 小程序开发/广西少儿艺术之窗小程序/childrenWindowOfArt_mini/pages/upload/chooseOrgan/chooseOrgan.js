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
    focus: true,
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
    // 是否已经初始化页面
    alreadyInit: false,
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
    // 跳转子页面取参：机构ID：
    jump_cpId: '',
    // 跳转子页面取参：机构名称：
    jump_cpCname: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
   let _this = this;
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
      if (!_this.data.alreadyInit) {
        _this.setData({
          alreadyInit: true
        })
      }
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
    
  },
  /*
    输入框失焦
  */
 searchInput_blur: function (e) {
   
  },
  /*
    // 跳转子页面，跳转前需设定 jump_type和 jump_cpId 、 jump_cpCname
    this.jumpSubpage();
  */
 jumpSubpage: function () {
    // 跳转地址
    let jump_url = '';
    // 错误日式语
    let errorTip = '';
    let cpId = this.data.jump_cpId;
    let cpCname = this.data.jump_cpCname;
    if (cpId && cpCname) {
      // 获取上一页页面的对象
      let pages = getCurrentPages();
      let prePageModel = pages[pages.length - 2];
      let setDataObj = {
        organ_id: cpId,
        organ_name: cpCname
      };
      prePageModel.setData(setDataObj);
    } else {
      errorTip = 'jump_cpId or jump_cpCname empty!';
    }
    if (errorTip) {
      // 提示跳转错误
      wx.showToast({
        title: errorTip,
        icon: 'none'
      })
    } else {
      // 返回上一页
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /*
    点击列表元素
  */
 clickListDom: function (e) {
    // 获取对应的id值
    let dataIndex = e.currentTarget.dataset.index;
    let jumpSetObj = {};
    let curSearchType = this.data.search_type;
    if (curSearchType == 1) {
      jumpSetObj.jump_cpId = this.data.search_result[dataIndex].cpId;
      jumpSetObj.jump_cpCname = this.data.search_result[dataIndex].cpCname;
    }
    this.setData(jumpSetObj);
    this.jumpSubpage();
  },
})

// var pages = getCurrentPages()[0];