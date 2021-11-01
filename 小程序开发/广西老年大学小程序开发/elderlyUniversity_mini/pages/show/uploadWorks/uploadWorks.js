import AJAX from '../../../utils/request'; //封装请求
const Multipart = require("../../../utils/Multipart.min");
const FormData = require('../../../utils/formData')


//new一个FormData对象
let formData = new FormData();
let app = getApp(); //使用全局变量
let ajaxConfig = new AJAX();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadTip: false, //上传成功提示弹窗显示还是隐藏
    authorName: "", //作者姓名
    authorNameLen: 0, //作者姓名长度
    authorNameTip: "", //作者姓名报错提示
    phoneNum: "", //联系方式
    phoneTip: "", //手机号报错提示
    worksName: "", //作品名称
    worksNameLen: 0, //作品名称长度
    worksNameTip: "", //作品名称报错提示
    worksCover: "", //作品封面
    isClickCover: false, //是否点击了作品封面
    temporaryVideo: "", //用户选择视频临时文件
    isClickVideo: false, //是否点击视频触发删除按钮
    worksTypeArr: [], //所有的作品标签数据
    currentWorksArr: [], //当前选中的上传作品数据    
    currentTypeData: [], //当前选中的作品类型
    currentWorksIndex: null, //当前上传作品的下标
    activityId: 0, //当前活动id
    filePaths: [], //当前要上传的文件路径数组
    duration: 0, //选择的视频时长
    size: 0, //视频大小
    pictureNum: 0 //当前作品图片数量

  },
  /**
   * 作者姓名,监听字数  
   */
  getAuthorName: function (event) {
    this.setData({
      authorNameLen: event.detail.cursor
    })
  },
  /**
   * /^([\u4e00-\u9fa5]{2,15}|[a-zA-Z.\s]{2,15})$/
   * 1.可以是中文
   * 2.可以是英文，允许输入点（英文名字中的那种点),允许输入空格
   * 3.中文和英文不能同时出现
   * 4.长度在15个字符以内
   * @param {*authorName} 作者姓名输入框失去焦点进行正则验证
   */
  authorNameBlur: function (event) {
    var authorName = event.detail.value;
    var nameReg = /^([\u4e00-\u9fa5]{2,15}|[a-zA-Z.\s]{2,15})$/;
    if (authorName) {
      if (!nameReg.test(authorName)) {
        this.setData({
          authorNameTip: "姓名格式不正确"
        })
      } else {
        this.setData({
          authorNameTip: ""
        })
      }
    } else {
      this.setData({
        authorNameTip: "请输入姓名"
      })
    }
    this.setData({
      authorName: event.detail.value
    })
  },
  /**
   * 联系方式聚焦事件:自动获取绑定手机号
   */
  contactInputFocus: function () {
    var phoneNum = app.globalData.phoneNum;
    if (!this.data.phoneNum && phoneNum) {
      this.setData({
        phoneNum: phoneNum
      })
    }
  },
  /**
   * /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
   * @param {*} contactStyleBlur 手机号输入框失焦进行正则验证
   */
  contactStyleBlur: function (event) {
    var phoneNum = event.detail.value;
    var phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
    if (phoneNum) {
      if (!phoneReg.test(phoneNum)) {
        this.setData({
          phoneTip: "手机号格式不正确"
        })
      } else {
        this.setData({
          phoneTip: ""
        })
      }
    } else {
      this.setData({
        phoneTip: "请输入手机号"
      })
    }
    this.setData({
      phoneNum: phoneNum
    })
  },
  /**
   * 监听作品名称字数
   * @param {*} getWorksName 
   */
  getWorksName: function (event) {
    this.setData({
      worksNameLen: event.detail.cursor
    })
  },
  /**
   * @param {*} worksNameBlur  作品名称输入框失焦进行作品名称校验
   */
  worksNameBlur: function (event) {
    var worksName = event.detail.value;
    console.log(worksName);
    if (worksName) {
      this.setData({
        worksNameTip: ""
      })
    } else {
      this.setData({
        worksNameTip: "请输入作品名称"
      })
    }
    this.setData({
      worksName: worksName
    })
  },
  /**
   * 选择作品标签
   */
  chooseWorksType: function (event) {
    var labelIndex = event.currentTarget.dataset.index;
    this.setData({
      currentTypeData: this.data.worksTypeArr[labelIndex],
    });
  },
  /**
   * 选择作品封面
   */
  chooseWorksCover: function (event) {
    wx.chooseImage({
      count: 1, //最多可以选择一张
      success: (res) => {
        const worksCover = res.tempFiles[0].path;
        var addParams = "";
        if (this.data.authorName) {
          addParams += "&authorName=" + this.data.authorName;
        }
        if (this.data.phoneNum) {
          addParams += "&phoneNum=" + this.data.phoneNum;
        }
        if (this.data.worksName) {
          addParams += "&worksName=" + this.data.worksName;
        }
        if (this.data.temporaryVideo) {
          addParams += "&temporaryVideo=" + this.data.temporaryVideo;
        }
        if (this.data.duration > 0) {
          addParams += "&duration=" + this.data.duration;
        }
        if (this.data.size > 0) {
          addParams += "&size=" + this.data.size;
        }
        wx.navigateTo({
          url: `../cropper/cropper?worksCover=${worksCover}&activityId=${this.data.activityId}${addParams}`
        })
      }
    })
  },
  /**
   * 触发封面图片删除按钮
   */
  coverDeleteShow: function () {
    this.setData({
      isClickCover: true
    })
  },
  /**
   * 删除作品封面
   */
  deleteCover: function (event) {
    this.setData({
      worksCover: "",
      isClickCover: false
    })
  },
  /**
   * 选择视频
   */
  chooseVideo: function () {
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: (res) => {
        console.log(res);
        this.setData({
          temporaryVideo: res.tempFilePath,
          duration: res.duration / 60,
          size: res.size / (1024 * 1024)
        })
      }
    })
  },
  /**
   * 触发视频删除按钮
   */
  videoDeleteShow: function () {
    this.setData({
      isClickVideo: true
    })
  },
  /**
   * 删除本地视频
   */
  deleteVideo: function () {
    this.setData({
      temporaryVideo: "",
      isClickVideo: false
    })
  },
  /**
   * 选择作品
   */
  chooseWorks: function (event) {
    this.setData({
      pictureNum: this.data.currentWorksArr.length
    })
    wx.chooseImage({
      count: 3, //最多可以选择一张
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        if ((res.tempFilePaths.length + this.data.pictureNum) > 3) {
          wx.showToast({
            title: '超过限定数量',
            icon: 'error',
            duration: 2000
          })
        } else {
          const currentWorksArrNew = res.tempFiles;
          const currentWorksArrOld = this.data.currentWorksArr;
          this.setData({
            currentWorksArr: [...currentWorksArrOld, ...currentWorksArrNew],
            pictureNum: res.tempFilePaths.length + this.data.pictureNum
          })
        }
      }
    })
  },
  /**
   * 点击作品图片触发删除按钮
   */
  worksImgDeletShow: function (event) {
    var index = event.currentTarget.dataset.index;
    this.setData({
      currentWorksIndex: index //当前点击的作品下标
    })
  },
  /**
   * 删除当前作品图片
   */
  deleteCurrentWorksImg: function (event) {
    var index = event.currentTarget.dataset.index;
    this.data.currentWorksArr.splice(index, 1);
    this.setData({
      currentWorksArr: this.data.currentWorksArr,
      currentWorksIndex: null,
      pictureNum: this.data.pictureNum - 1
    })
  },
  /**
   * 上传表单信息
   */
  uploadFormInfo: function () {
    // var count = 0;//第几个文件    
    // this.uploadOneByOne(count);//单次上传
    if (this.data.authorName && this.data.phoneNum && this.data.worksName) {
      if (this.data.currentTypeData.videoSupport == 1) { //当前选中标签支持视频
        if (!this.data.worksCover) {
          wx.showToast({
            title: '请上传视频封面',
            icon: 'error',
            duration: 2000
          })
        } else if (this.data.duration == 0 || this.data.size == 0 || !this.data.temporaryVideo) { //视频未选中
          wx.showToast({
            title: '视频资源未上传',
            icon: 'error',
            duration: 2000
          })
        } else if (this.data.duration >= 5 || this.data.size >= 500) { //视频时长大于5min，视频大小大于500M
          wx.showToast({
            title: '视频文件过大',
            icon: 'error',
            duration: 2000
          })
        } else { //正常上传
          // 判断用户是否授权过个人信息
          this.getUserInfo();
        }
      } else { //图片上传
        if (this.data.currentWorksArr.length > 0) {
          // 判断用户是否授权过个人信息
          this.getUserInfo();
        } else {
          wx.showToast({
            title: '请上传作品',
            icon: 'error',
            duration: 2000
          })
        }
      }
    } else {
      wx.showToast({
        title: '您有信息未填写',
        icon: 'error',
        duration: 2000
      })
    }
  },
  /**
   * 上传判断
   */
  uploadJudge: function () {
    var reqNo = this.getVtimeRandom();
    var files = [];
    const fields = [{
      name: "activityId",
      value: this.data.activityId
    }, {
      name: 'openId',
      value: app.globalData.openId
    }, {
      name: 'title',
      value: this.data.worksName
    }, {
      name: 'uploadTagCode',
      value: this.data.currentTypeData.tagCode
    }, {
      name: 'uploaderName',
      value: this.data.authorName
    }, {
      name: 'uploaderPhone',
      value: this.data.phoneNum
    }, {
      name: 'reqNo',
      value: reqNo
    }];
    if (this.data.currentTypeData.videoSupport == 1) {
      files = [{
          name: "coverPictures",
          filePath: this.data.worksCover
        },
        {
          name: "videos",
          filePath: this.data.temporaryVideo
        }
      ];
    } else {
      this.data.currentWorksArr.forEach((item) => {
        var item = {
          name: "pictures",
          filePath: item.path
        };
        files.push(item);
      })
    }
    // 上传中
    wx.showLoading({
      title: '上传中...',
      mask: true
    })
    let result = new Multipart({
      fields,
      files
    }).submit(ajaxConfig.uploadActivityApi);
    result.then((res) => {
      //请求结果
      console.log(res);
      if (res.statusCode == 200 && res.data.errorCode == 1000) {
        wx.hideLoading();
        this.setData({
          uploadTip: true
        });
      } else if (res.data.errorCode == 2005) {
        wx.showToast({
          title: res.data.errorMsg,
          icon: 'error',
          duration: 2000
        })
      } else {
        wx.showToast({
          title: '文件格式不正确',
          icon: 'error',
          duration: 2000
        })
      }
    });
  },
  /**
   * 单次上传
   */
  uploadOneByOne: function (count) {
    var fileType = "";
    this.setData({
      filePaths: []
    })
    // 获取时间戳和随机数
    var reqNo = this.getVtimeRandom();
    if (this.data.currentTypeData.videoSupport == 1) {
      this.data.filePaths = [this.data.worksCover, this.data.temporaryVideo]; //封面图片、视频
      if (count == 0) { //封面
        fileType = "coverPictures";
      } else { //视频
        fileType = "videos";
      }
    } else {
      this.data.currentWorksArr.forEach((item) => {
        this.data.filePaths.push(item.path);
      });
      fileType = "pictures";
    }
    wx.uploadFile({
      url: ajaxConfig.uploadActivityApi,
      filePath: this.data.filePaths[count],
      name: fileType,
      formData: {
        "activityId": this.data.activityId,
        "openId": app.globalData.openId,
        "title": this.data.worksName,
        "uploadTagCode": this.data.currentTypeData.tagCode,
        "uploaderName": this.data.authorName,
        "uploaderPhone": this.data.phoneNum,
        "reqNo": reqNo
      },
      header: {
        'content-type': 'multipart/form-data' // 默认值
      },
      success: (res) => {
        count++; //上传成功进入下一个
        if (count == this.data.filePaths.length) {
          this.setData({
            uploadTip: true
          });
        } else {
          this.uploadOneByOne(count); //上传下一张
        }
      },
      fail: (res) => {
        console.log(res);
        console.log("上传失败");
      }
    })
  },
  /**
   * 获取时间戳随机数
   */
  getVtimeRandom: function () {
    var now = new Date();
    var year = now.getFullYear(); //得到年份
    var month = now.getMonth() + 1; //得到月份
    var date = now.getDate(); //得到日期
    var hour = now.getHours(); //得到小时
    var minu = now.getMinutes(); //得到分钟
    var sec = now.getSeconds(); //得到秒
    if (month < 10) month = "0" + month;
    if (date < 10) date = "0" + date;
    if (hour < 10) hour = "0" + hour;
    if (minu < 10) minu = "0" + minu;
    if (sec < 10) sec = "0" + sec;
    var random = Math.ceil(Math.random() * 1000000); //六位随机数
    return year + month + date + hour + minu + sec + random;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 若从裁剪页返回获取数据
    this.setData({
      authorName: options.authorName || "",
      phoneNum: options.phoneNum || "",
      worksName: options.worksName || "",
      temporaryVideo: options.temporaryVideo || "",
      duration: options.duration || 0,
      size: options.size || 0
    })
    if (this.data.authorName) {
      this.setData({
        authorNameLen: this.data.authorName.length
      })
    }
    if (this.data.worksName) {
      this.setData({
        worksNameLen: this.data.worksName.length
      })
    }
    //获取作品标签 
    var paramsObj = {
      requestUrl: ajaxConfig.getworksTagApi
    }
    ajaxConfig.xjRequestApi(paramsObj, (res) => {
      if (res.data.errorCode == 1000 && res.data.data.length > 0) {
        this.setData({
          worksTypeArr: res.data.data,
          currentTypeData: res.data.data[0],
          activityId: options.activityId
        })
        if (options && options.worksCover) {
          this.setData({
            worksCover: options.worksCover
          })
        }
      }
    });
  },
  /**
   * 获取用户信息
   */
  getUserInfo: function () {
    ajaxConfig.xjRequestApi({
      requestUrl: ajaxConfig.getUserInfo,
      data: {
        openId: app.globalData.openId
      }
    }, (res) => {
      if (res.data.errorCode == 1000 && res.data.data) { //能够获取到用户信息
        getApp().globalData.userInfo = res.data.data;
        this.uploadJudge();//正常上传文件
      } else {
        this.getUserProfile(); //没有用户信息则发起用户授权
      }
    })
  },
  /**
   * 发起用户信息授权
   */
  getUserProfile: function () {
    wx.getUserProfile({
      desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写(必填)
      success: (res) => { //用户允许，获取用户信息存入数据库，并且跳转首页
        getApp().globalData.userInfo = res.userInfo; //用户信息存到全局便于我的页面使用
        // 将用户个人信息插入数据库
        var paramsObj = {
          requestUrl: ajaxConfig.insertUserInfo,
          header: {
            'content-type': "application/json"
          },
          method: "POST",
          data: {
            avatarUrl: res.userInfo.avatarUrl,
            city: res.userInfo.city,
            country: res.userInfo.country,
            gender: res.userInfo.gender,
            nickName: res.userInfo.nickName,
            openId: app.globalData.openId,
            province: res.userInfo.province,
            language: res.userInfo.language
          }
        }
        ajaxConfig.xjRequestApi(paramsObj, (data) => {
          if (data.data.errorCode == 1000) {
            console.log("用户信息上传数据库成功");
          }
        })
      },
      fail: (res) => { //用户拒绝，回到微信登录界面
        console.log(res);
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
    if (app.globalData.level == 1) {
      var pages = getCurrentPages();
      var num = pages.length - 3;
      if (num > 0) {
        console.log(pages);
        wx.navigateBack({
          delta: num
        })
      }
      getApp().globalData.level = 2;
    }

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
    return {
      title: '广西老年互助服务平台'
    }
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline: function () {

  }
})