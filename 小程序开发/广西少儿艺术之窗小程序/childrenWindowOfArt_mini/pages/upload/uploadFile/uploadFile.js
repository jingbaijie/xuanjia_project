// pages/upload/uploadFile/uploadFile.js
const CT = require('../../../utils/generalMothod')
import AJAX from '../../../utils/request';
const ajaxConfig = new AJAX();
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: ajaxConfig.ipConfigImg,
    // 上传类型： 0：视频。 1：图片
    uploadType: 0,
    // 是否正在显示选择用户列表弹框: 0: 隐藏； 1: 显示。
    userListShowStatus: 0,
    // 学员信息列表 显示到页面上的数组
    student_info_list: [],
    // 当前登录的学员的学号
    _loginStuNum: '',
    // 当前登录学员的姓名
    _loginStuName: '',
    // 作品名
    opus_name: '',
    //用户选择视频临时文件
    temporary_video: '',
    //选择的视频时长
    duration: 0,
    //视频大小
    size: 0,
    // 视频上传类型的图片
    coverImgUrl: '',
    // 图片上传类型的图片
    opus_imgUrl: '',
    // 放大图片的地址
    enlarge_img_url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 监听网络变化
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        // 刚刚断网了
        wx.showLoading({
          title: '网络重连上传中',
          mask: true
        })
      }
      // console.log(res.isConnected)
      // console.log(res.networkType)
    })
    // 判断学员是否登录，未登录则跳转登录页面
    if (app.globalData._loginStuCode && app.globalData._loginStuNum && app.globalData._loginStuName) {
      // 已登录
      this.setData({
        _loginStuNum: app.globalData._loginStuNum,
        _loginStuName: app.globalData._loginStuName
      })
    } else {
      // 提示用户选择或注册学员登录
      wx.showToast({
        title: '请点击左上角选择或注册学员登录哦！',
        icon: 'none'
      })
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
   * 
   * @param {*} params 
   */
  onTabItemTap () {
    // 判断用户是否获得授权过
    if (!app.globalData.userInfo) {
      // 无用户授权信息，从数据库取
      // 获取数据库保存的用户授权信息
      let getUserInfo_params = {
        callback: (res) => {
          console.log('get userInfo success');
        },
        failCallback: (res) => {
          // 未取到用户信息
          // 拉取用户信息
          // 发起用户信息授权
          let getUserProfile_params = {
            callback: (res) => {
              console.log('getUserProfile success');
            },
            failCallback: (res) => {
              // 用户拒绝授权，啥也不做
              console.log('getUserProfile fail');
            },
          }
          CT.getUserProfile(getUserProfile_params);
        },
      }
      CT.getUserInfo(getUserInfo_params);
    }
  },
  /**
   * 离开页面时记录页面状态
   * @param {*} params 
   */
  /**
   * 去注册学员页
   * @param {*} params 
   */
  addNewStu: function (params) {
    wx.navigateTo({
      url: '/pages/upload/uploadRegister/uploadRegister',
    })
  },
  /**
   * 获取所有当前微信用户注册登录过的学员
   * @param {*callback} 获取成功回调
   * * @param {*failCallback} 获取失败回调
   */
  getStuList: function (params) {
    let _this = this;
    var getStuList = {
      requestUrl: ajaxConfig.getStuList,
      data: {
        openId: app.globalData.openId
      }
    }
    ajaxConfig.xjRequestApi(getStuList,(res) => {
      if(res.data.successFlg == 1 && res.data.data){
        this.setData({
          student_info_list: res.data.data
        })
      }
    })
  },
  /**
   * 去登录注册学员页
   * @param {*} e 
   */
  goRegisterPage: function (params) {
    // 未登录
    wx.navigateTo({
      url: '/pages/upload/uploadRegister/uploadRegister',
    })
  },
  /*
    切换上传视频还是图片
  */
  changeUserListStatus: function(e){
    if (this.data.student_info_list.length == 0) {
      // 获取全部注册登录过的学员列表
      this.getStuList();
    }
    this.setData({
      userListShowStatus: e.target.dataset.userlist_display
    })
  },
  /*
    切换上传视频还是图片
  */
  changeUploadType: function(e){
    this.setData({
      uploadType: parseInt(e.target.dataset.uploadtype),
      opus_name: '',
    })
  },
  /**
   * 更新data中的作品名
   * @param {*} e 
   */
  updateOpusName: function (e) {
    this.setData({
      opus_name: e.detail.value
    })
  },
  /**
   * 选择视频
   * @param {*} e 
   */
  chooseVideo: function () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        console.log(res);
        if (res.size / 1024 / 1024 > 500) {
          wx.showToast({
            title: '视频应小于500MB！',
            icon: 'none',
            duration: 2000
          });
        } else {
          this.setData({
            temporary_video: res.tempFilePath,
            duration: res.duration / 60,
            size: res.size / (1024 * 1024)
          })
        }
      }
    })
  },
  /**
   * 选择图片
   * @param {*} e 
   */
  chooseImage: function () {
    let _this = this;
    wx.chooseImage({
      // 最多可以选择图片个数
      count: 1,
      // 选择图片的尺寸
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        console.log('imgInfo: ', res)
        // 图片的路径和大小
        const tempFiles = res.tempFiles;
        if (tempFiles[0].size > 5 * 1000 * 1024) {
          wx.showToast({
            title: '图片应小于5MB！',
            icon: 'none',
            duration: 2000
          });
        } else {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths;
          // 去裁剪页面前设置本页面需要记住的参数
          // 对象转为get请求类型的字符串: & 符拼接的字符串
          let originParams = {
            cutting_width: 354,
            cutting_height: 200
          }
          if (_this.data.uploadType == 0) {
            // 视频分类的图片
            // 裁剪的图片地址键名
            originParams['cuttingImg_keyName'] = 'coverImgUrl';
            originParams['coverImgUrl'] = tempFilePaths[0];
          } else {
            // 图片分类的图片
            // 裁剪的图片地址键名
            originParams['cuttingImg_keyName'] = 'opus_imgUrl';
            originParams['opus_imgUrl'] = tempFilePaths[0];
          }
          let transObj = {
            // 要转化的对象
            receivedParams: originParams,
            // 转化时剔除的键名的数组
            notSpliceParams: []
          };
          let resultStr = CT.objToStr(transObj);
          wx.navigateTo({
            url: `/pages/common/cropper/cropper?` + resultStr,
          })
        }
        
      }
    })
  },
  /**
   * 选择要上传的 视频/图片
   * @param {*} e 
   */
  choseUploadFile: function (e) {
    var _this = this;
    // 判断当前属于视频上传还是图片上传navtab
    if (_this.data.uploadType === 0) {
      // 视频上传导航
      _this.chooseVideo();
    } else if (_this.data.uploadType === 1) {
      // 图片上传导航
    } else {
      wx.showToast({
        title: 'uploadType error',
        icon: 'error'
      })
    }
  },
  /**
   * 确认提交按钮
   */
  confirmSubmission: function (params) {
    let _this = this;
    // 判断学员是否登录，未登录则跳转登录页面
    if (app.globalData._loginStuCode && app.globalData._loginStuNum && app.globalData._loginStuName) {
      // 已登录学员
      // 判断用户是否获得授权过
      if (app.globalData.userInfo) {
        // 有用户授权信息
        // 授权成功，上传文件
        _this.uploadFile();
      } else {
        // 无用户授权信息，从数据库取
        // 获取数据库保存的用户授权信息
        let getUserInfo_params = {
          callback: (res) => {
            // 获取到了用户信息
            // 授权成功，上传文件
            _this.uploadFile();
          },
          failCallback: (res) => {
            // 未取到用户信息
            // 拉取用户信息
            // 发起用户信息授权
            let getUserProfile_params = {
              callback: (res) => {
                // 授权成功，上传文件
                _this.uploadFile();
              },
              failCallback: (res) => {
                // 用户拒绝授权，啥也不做
              },
            }
            CT.getUserProfile(getUserProfile_params);
          },
        }
        CT.getUserInfo(getUserInfo_params);
      }
    } else {
      // 提示用户选择或注册学员登录
      wx.showToast({
        title: '请点击左上角选择或注册学员登录哦！',
        icon: 'none'
      })
    }
  },
  /**
   * 上传文件
   * @param {*} e 
   */
  uploadFile: function (params = {}) {
    let _this = this;
    // 其他参数 fields: [{name: '', value: ''}, ...]
    let fields = [
      {
        name: 'openId',
        value: getApp().globalData.userInfo.openId //app.globalData.openId
      },
      {
        name: 'studentNumber',
        value: app.globalData._loginStuCode
      },
      {
        name: 'title',
        value: _this.data.opus_name
      },
      {
        // 上传者姓名
        name: 'uploaderName',
        value:  getApp().globalData._loginStuName
      },
      {
        name: 'uploaderPhone',
        value:  getApp().globalData.userInfo.phoneNum || null
      },
    ];
    // 图片或视频参数 files: [{name: '', filePath: ''}, ...]
    let files = [];
    let tipStr = '';
    if (!_this.data.opus_name) {
      tipStr = '请填写作品名';
    }
    // 判断上传类型 
    if (_this.data.uploadType == 0) {
      // 视频类型
      // 判断作品名和视频、视频封面是否已选择
      if (!this.data.temporary_video) {
        tipStr = '请选择视频!';
      } else if (!this.data.coverImgUrl) {
        tipStr = '请选择视频封面!';
      }
      fields.push({
        // 标签code tupianzuopin-图片作品 shipinzuopin-视频作品
        name: 'uploadTagCode',
        value: 'shipinzuopin'
      });
      files = [
        {
          name: 'videos',
          // 图片文件，只能上传一张图片，可为jpg、png、gif格式
          filePath: _this.data.temporary_video
        },
        {
          name: 'coverPictures',
          // 图片文件，只能上传一张图片，可为jpg、png、gif格式
          filePath: _this.data.coverImgUrl
        }
      ]
    } else {
      // 图片类型
      if (!_this.data.opus_imgUrl) {
        tipStr = '请选择作品图片!';
      }
      fields.push({
        // 标签code tupianzuopin-图片作品 shipinzuopin-视频作品
        name: 'uploadTagCode',
        value: 'tupianzuopin'
      });
      files = [
        {
          name: 'pictures',
          // 图片文件，只能上传一张图片，可为jpg、png、gif格式
          filePath: _this.data.opus_imgUrl
        }
      ]
    }
    // 是否提示
    if (tipStr) {
      wx.showToast({
        title: tipStr,
        icon: 'none'
      });
      return;
    }
    // 上传作品文件
    let uploadFileParams = {
      // 上传地址
      uploadUrl: ajaxConfig.uploadWorks,
      // 其他参数 fields: [{name: '', value: ''}, ...]
      fields: fields,
      // 图片或视频参数 files: [{name: '', filePath: ''}, ...]
      files: files,
      // 成功回调
      callback: (res) => {
        wx.showToast({
          title: "作品上传成功！",
          icon: 'none',
        });
        // 把临时文件清空
        _this.setData({
          temporary_video: '',
          coverImgUrl: '',
          opus_imgUrl: '',
          opus_name: ''
        })
        // 查看是否有成功回调，成功回调返回true则不执行默认操作
        let callbackRes = params.callback && params.callback(res);
        if (!callbackRes) {
          // 默认上传成功执行的操作
        }
      }
      // 失败回调

    };
    CT.myUploadFile(uploadFileParams);
  },
  /**
   * 切换学生登录
   */
  changeStuLogin: function (e) {
    let _this = this;
    let stu_info = e.currentTarget.dataset.stu_info;
    // 学生姓名
    let stuName = stu_info.cartoonCname
    // 学生学号 cspInfo.cpCode + outId
    let stuNum = stu_info.cspInfo.cpCode + stu_info.outId;
    // 学员信息的cartoonCode，用作上传唯一标识
    let cartoonCode = stu_info.cartoonCode;
    
    // 已登录
    app.globalData._loginStuNum = stuNum;
    app.globalData._loginStuName = stuName;
    app.globalData._loginStuCode = cartoonCode;
    _this.setData({
      _loginStuNum: app.globalData._loginStuNum,
      _loginStuName: app.globalData._loginStuName,
      // 隐藏学员列表弹框
      userListShowStatus: 0
    })
    return;
    // 登录请求
    let myOldStuLoginParams = {
      data: {
        "name": stuName,
        "number": stuNum,
        "openId": app.globalData.openId,
        // 写死的测试
        // "name": "甘雨桥",
        // "number": "0100300010010",
        // "openId": "oKCOW4tx3H2Pl193WZNksg3L1Q8g"
      },
      callback: (res) => {
        setTimeout(() => {
          // 已登录
          _this.setData({
            _loginStuNum: app.globalData._loginStuNum,
            _loginStuName: app.globalData._loginStuName,
            // 隐藏学员列表弹框
            userListShowStatus: 0
          })
        }, 500);
      },
      failCallback: (res) => {
        
      }
    };
    CT.myOldStuLogin(myOldStuLoginParams)
  },
  /**
   * 放大 图片类型的图片
   */
  enlargeImg(){
    this.setData({
      enlarge_img_url: this.data.opus_imgUrl
    })
  },
  /**
   * 取消放大 图片类型的图片
   */
  cancelEnlargeImg(){
    this.setData({
      enlarge_img_url: ''
    })
  },
  /**
   * 删除 图片类型的图片
   */
  deleteImg(){
    this.setData({
      opus_imgUrl: ''
    })
  },
  /**
    触摸上传部分开始
  */
  monitorGesture_start (e) {
    CT.monitorGesture_start(e);
  },
  /**
   触摸上传部分结束
  */
  monitorGesture_end (e) {
    let _this = this;
    // 监听用户手势（点下和离开需配套使用）： 开始手势结束
    var params_MGend = {
      // 往右划 拉左方的
      callback_right (e) {
        // 显示视频上传模块
        var params = {
          target: {
            dataset: {
              uploadtype: 0
            }
          }
        }
        if (_this.data.uploadType == 1) {
          _this.changeUploadType(params);
        }
      },
      // 往左划 拉右方的
      callback_left (e) {
        // 显示图片上传模块
        var params = {
          target: {
            dataset: {
              uploadtype: 1
            }
          }
        }
        if (_this.data.uploadType == 0) {
          _this.changeUploadType(params);
        }
      },
    }
    CT.monitorGesture_end(e, params_MGend);
  }
})