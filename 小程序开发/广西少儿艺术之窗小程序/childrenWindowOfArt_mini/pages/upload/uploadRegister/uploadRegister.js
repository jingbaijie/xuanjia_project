// pages/upload/uploadRegister/uploadRegister.js
// 通用工具方法
const CT = require('../../../utils/generalMothod')
// 封装请求
import AJAX from '../../../utils/request';
const ajaxConfig = new AJAX();
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 当前显示分类： 0：老用户；1：新用户。
    userType: 1,
    // 输入框信息： 学号、姓名、性别、年龄
    studentNum: '',
    studentNum_check_result: '请填写学员学号！',
    //  0-女生 1-男生
    userName: '',
    userName_check_result: '用户名应为纯中文或纯英文，15字以内！',
    userSex: null,
    userSex_check_result: '请选择性别！',
    userAge: '',
    userAge_check_result: '年龄应该填入数字！',
    // 机构id
    organ_id: '',
    organ_name: '',
    organ_id_check_result: '请选择机构！',
    // 协议选中状态
    agreement_checked: false,
    // 封面图url
    coverImgUrl: '',
    coverImgUrl_check_result: '请选择图片！',
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
    // 查看是否已经登录
    // 获取页面在全局变量app里面的页面参数对象值
    let receivedParams_app = app.globalData['pageParams_' + 'uploadRegister'];
    // 置空app中存储的参数
    app.globalData['pageParams_' + 'uploadRegister'] = '';
    // 要接受的参数对象
    let receivedParams = options;
    if (typeof receivedParams_app == 'object') {
      Object.assign(receivedParams, receivedParams_app);
    }
    // 不接收的参数数组
    let refuseReceiveArr = [];
    for (const key in options) {
      if (Object.hasOwnProperty.call(options, key)) {
        if (refuseReceiveArr.indexOf(key) == -1) {
          receivedParams[key] = options[key];
        }
      }
    }
    // 把接受到的参数赋值到data中去
    this.setData(receivedParams);
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
  /*
    选择用户类型
  */
  choseUserType: function (e){
    this.setData({
        userType: e.target.dataset.usertype,
        userName: ''
    })
  },
  /*
    同意协议
  */
  agreeOn: function (e){
    this.setData({
        agreement_checked: true
    })
  },
  /*
    去协议页
  */
  toPortocolPage: function (e){
    wx.navigateTo({
      url: '/pages/upload/protocol/protocol',
    })
  },
  /*
    确认提交
  */
  confirmSubmission: function (e){
    let _this = this;
    if (_this.data.userType == 0) {
      // 老用户登录
      _this.oldStuLogin();
    } else if (_this.data.userType == 1) {
      // 判断用户是否获得授权过
      if (app.globalData.userInfo) {
        // 有用户授权信息
        // 新用户注册和登录
        _this.newStuRegister();
      } else {
        // 无用户授权信息，从数据库取
        // 获取数据库保存的用户授权信息
        let getUserInfo_params = {
          callback: (res) => {
            // 获取到了用户信息
            // 新用户注册和登录
            _this.newStuRegister();
          },
          failCallback: (res) => {
            // 未取到用户信息
            // 拉取用户信息
            // 发起用户信息授权
            let getUserProfile_params = {
              callback: (res) => {
                // 新用户注册和登录
                _this.newStuRegister();
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
    }
  },
  /**
   * 老用户（学生账号）登录
   * @param {*callback} 登录成功回调
   * @param {*failCallback} 登录失败回调
   */
  oldStuLogin: function (loginParam = {}) {
    let _this = this;
    // 错误提示
    let errorTip = '';
    if (!this.data.agreement_checked) {
      errorTip = '请知悉并同意协议！';
    }
    // 验证书输入框值
    this.data.studentNum_check_result && (errorTip = this.data.studentNum_check_result);
    this.data.userName_check_result && (errorTip = this.data.userName_check_result);
    // 校验输入框值
    if (errorTip) {
      wx.showToast({
        title: errorTip,
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 登录请求
    let myOldStuLoginParams = {
      data: {
        "name": _this.data.userName,
        "number": _this.data.studentNum,
        "openId": app.globalData.openId,
        // 写死的测试
        // "name": "甘雨桥",
        // "number": "0100300010010",
        // "openId": "oKCOW4tx3H2Pl193WZNksg3L1Q8g"
      },
      callback: (res) => {
        wx.showToast({
          title: "学员登录成功！",
          icon: 'none',
        });
        setTimeout(() => {
          // 返回上一页
          wx.navigateBack({
            delta: 1,
          })
        }, 500);
      },
      failCallback: (res) => {
        loginParam.failCallback && loginParam.failCallback(res);
      }
    };
    CT.myOldStuLogin(myOldStuLoginParams)
  },
  /**
   * 新用户（学生账号）登录
   * @param {*callback} 登录成功回调
   * @param {*failCallback} 登录失败回调
   */
  newStuRegister: function (registerParam = {}) {
    let _this = this;
    // 错误提示
    let errorTip = '';
    if (!this.data.agreement_checked) {
      errorTip = '请知悉并同意协议！';
    }
    // 验证书输入框值
    this.data.userName_check_result && (errorTip = this.data.userName_check_result);
    !this.data.userSex && (errorTip = this.data.userSex_check_result);
    this.data.userAge_check_result && (errorTip = this.data.userAge_check_result);
    !this.data.coverImgUrl && (errorTip = this.data.coverImgUrl_check_result);
    if (!this.data.organ_id || !this.data.organ_name) {
      errorTip = this.data.organ_id_check_result;
    }
    if (errorTip) {
      wx.showToast({
        title: errorTip,
        icon: 'none',
        duration: 2000
      });
      return;
    }
    // 上传新用户信息
    let uploadFileParams = {
      // 上传地址
      uploadUrl: ajaxConfig.newStudent,
      // 其他参数 fields: [{name: '', value: ''}, ...]
      fields: [
        {
          name: 'openId',
          value: app.globalData.openId
        },
        {
          name: 'age',
          value: _this.data.userAge
        },
        {
          name: 'levelId',
          value: 6
        },
        {
          name: 'name',
          value: _this.data.userName
        },
        {
          name: 'organizationId',
          value:  _this.data.organ_id
        },
        {
          name: 'picCname',
          value:  _this.data.userName + '头像'
        },
        {
          name: 'sex',
          value:  _this.data.userSex
        },
      ],
      // 图片或视频参数 files: [{name: '', filePath: ''}, ...]
      files: [
        {
          name: 'picture',
          // 图片文件，只能上传一张图片，可为jpg、png、gif格式
          filePath: _this.data.coverImgUrl
        }
      ],
      // 成功回调
      callback: (res) => {
        wx.showToast({
          title: "学员注册成功！",
          icon: 'none',
        });
        // 查看是否有成功回调，成功回调返回true则不执行默认操作
        let callbackRes = registerParam.callback && registerParam.callback(res);
        if (!callbackRes) {
          // 获取上传文件页页面对象
          // 获取某个目标页面的page对象
          let targetPageObj = CT.getTargetPageObj({
            page_route: 'pages/upload/uploadFile/uploadFile',
          });
          // 改变上一页的老学员列表
          targetPageObj.getStuList();
          // 默认注册成功返回上一页
          setTimeout(() => {
            // 返回上一页
            wx.navigateBack({
              delta: 1,
            })
          }, 300);
        }
      }
      // 失败回调

    };
    CT.myUploadFile(uploadFileParams);
  },
  /*
    选择上传图片
  */
  choseCoverImg: function (e){
    const _this = this;
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
        if (tempFiles[0].size >  5 * 1000 * 1024) {
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
          let transObj = {
            // 要转化的对象
            receivedParams: {
              // 裁剪的图片地址键名
              cuttingImg_keyName: 'coverImgUrl',
              coverImgUrl: tempFilePaths[0],
              // cutting_width: 165,
              // cutting_height: 240
            },
            // 转化时剔除的键名的数组
            notSpliceParams: []
          };
          console.log(tempFilePaths[0])
          let resultStr = CT.objToStr(transObj);
          wx.navigateTo({
            url: `/pages/common/cropper1/cropper1?` + resultStr,
          })
        }
        
      }
    })
  },
  /**
   * 选择性别
   * @param {*} e 
  */
  checkSex (e) {
    this.setData({
      userSex: e.detail.value
    })
  },
  /**
   * 更新在data中记录的输入框值
  */
  updateInputVal: function (e) {
    // 键名
    let key_name = e.currentTarget.dataset.key_name;
    // 输入框值
    let input_value = e.detail.value;
    let setDataObj = {};
    setDataObj[key_name] = input_value;
    this.setData(setDataObj);
    // 校验输入框值
    let checkObj = {
      key_name: key_name,
      input_value: input_value
    }
    let tipStr =  this.checkInputValue(checkObj);
    var check_key_name = key_name + '_check_result';
    let setDataObj1 = {};
    // 更新验证结果
    setDataObj1[check_key_name] = tipStr;
    this.setData(setDataObj1);
    if (tipStr) {
      wx.showToast({
        title: tipStr,
        icon: 'none'
      })
    }
  },
  /**
   * 校验输入框值
  */
  checkInputValue: function (checkObj = {}) {
    let check_result = '';
    let input_value = checkObj.input_value;
    switch (checkObj.key_name) {
      case 'studentNum':
        if (!input_value) {
          check_result = '请填写学员学号！';
        }
        break;
      case 'userName':
        check_result = CT.checkUserName({
          user_name: input_value
        });
        if (!check_result) {
          check_result = '用户名应为纯中文或纯英文，15字以内！';
        } else {
          check_result = '';
        }
        break;
      case 'userAge':
        if (typeof parseInt(input_value) != 'number') {
          check_result = '年龄应该填入数字！';
        }
        break;
    
      default:
        break;
    }
    return check_result;
  },
  /**
   * 去选择机构页
   */
  goChooseOrganPage: function (e) {
    wx.navigateTo({
      url: '/pages/upload/chooseOrgan/chooseOrgan',
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
        // 显示老用户模块
        var params = {
          target: {
            dataset: {
              usertype: 0
            }
          }
        }
        if (_this.data.userType == 1) {
          _this.choseUserType(params);
        }
      },
      // 往左划 拉右方的
      callback_left (e) {
        // 显示新用户模块
        var params = {
          target: {
            dataset: {
              usertype: 1
            }
          }
        }
        if (_this.data.userType == 0) {
          _this.choseUserType(params);
        }
      },
    }
    CT.monitorGesture_end(e, params_MGend);
  }
});