import AJAX from './request'
const ajaxConfig = new AJAX();
// 多部分上传
const Multipart = require("./Multipart.min");
const app = getApp();

// 隐藏上传中弹框延时器
let hidUploadingTipTimer = null;

// 触点开始Y轴值
let clientY_start = 0;
// 触点结束Y轴值
let clientY_end = 0;
// 触点开始X轴值
let clientX_start = 0;
// 触点结束X轴值
let clientX_end = 0;

/*
  // 对象转为get请求类型的字符串: & 符拼接的字符串
  let transObj = {
    // 要转化的对象
    receivedParams: ,
    // 转化时剔除的键名的数组
    notSpliceParams: []
  };
  let resultStr = CT.objToStr(transObj);
*/
const objToStr = params => {
  let resultStr = '';
  if (params && params.receivedParams) {
    let receivedParams = params.receivedParams;
    let notSpliceParams = params.notSpliceParams || [];
    for (const key in receivedParams) {
      if (Object.hasOwnProperty.call(receivedParams, key)) {
        if (notSpliceParams.indexOf(key) == -1) {
          const element = receivedParams[key];
          let splicer = !resultStr.length ? '' : '&';
          resultStr += splicer + key + '=' + element;
        }
      }
    }
  }
  return resultStr;
}
/*
  // get请求类型的字符串: & 符拼接的字符串  转为 对象
  let transObj = {
    // 要转化的字符串
    originStr: '',
    // 转化时剔除的键名的数组
    notAddParams: []
  };
  let targetObj = CT.strToObj(transObj);
*/
const strToObj = params => {
  let originStr = params.originStr;
  let notAddParams = params.notAddParams || [];
  let targetObj = {};
  let tempArr = originStr.split('&');
  for (let index = 0; index < tempArr.length; index++) {
    let elementArr = tempArr[index] && tempArr[index].split('=');
    if (elementArr && notAddParams.indexOf(elementArr[0]) == -1) {
      targetObj[elementArr[0]] = elementArr[1];
    }
  }
  return targetObj;
}
/*
  // 过滤掉对象自有属性，和不想保留的对象属性
  let params = {
    // 要转化的对象
    receivedParams: ,
    // 转化时剔除的键名的数组
    notSpliceParams: []
  };
  let resultObj = CT.filterObj(params);
*/
const filterObj = params => {
  let resultObj = {};
  if (params && params.receivedParams) {
    let receivedParams = params.receivedParams;
    let notSpliceParams = params.notSpliceParams || [];
    for (const key in receivedParams) {
      if (Object.hasOwnProperty.call(receivedParams, key)) {
        if (notSpliceParams.indexOf(key) == -1) {
          const element = receivedParams[key];
          resultObj[key] = element;
        }
      }
    }
  }
  return resultObj;
}

/**
 * /^([\u4e00-\u9fa5]{2,15}|[a-zA-Z.\s]{2,15})$/
 * 1.可以是中文
 * 2.可以是英文，允许输入点（英文名字中的那种点),允许输入空格
 * 3.中文和英文不能同时出现
 * 4.长度在15个字符以内
 * @param {*authorName}
 */
const checkUserName = (params = {}) => {
  var authorName = params.user_name;
  var nameReg = /^([\u4e00-\u9fa5]{2,15}|[a-zA-Z.\s]{2,15})$/;
  let check_result = false;
  if (authorName && nameReg.test(authorName)) {
    check_result = true;
  }
  return check_result;
}
/*
  // 手机号校验

*/
const checkPhoneNum = (phoneNum = '') => {
  let check_result = false;
  var phoneReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (phoneReg.test(phoneNum)) {
    check_result = true;
  }
  return check_result;
}

/**
 * 获取时间戳随机数
 */
const getTimeRandom = function () {
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
}

/**
 * 获取数据库保存的用户授权信息
 * @param {* callback} 成功回调
 * @param {* failCallback} 失败回调
 * 
  // 获取数据库保存的用户授权信息
  let getUserInfo_params = {
    callback: (res) => {

    },
    failCallback: (res) => {

    },
  }
  CT.getUserInfo(getUserInfo_params);
 */
const getUserInfo = (params = {}) => {
  ajaxConfig.xjRequestApi({
    requestUrl: ajaxConfig.getUserInfo,
    data: {
      openId: app.globalData.openId
    }
  }, (res) => {
    if (res.data.errorCode == 1000 && res.data.data) { //能够获取到用户信息
      getApp().globalData.userInfo = res.data.data;
      params.callback && params.callback(res);
    } else {
       //没有用户信息则发起用户授权
      //  CT.getUserProfile();
      params.failCallback && params.failCallback(res);
    }
  }, (res) => {
    console.log('getUserInfo获取用户信息错误！', res);
  })
}
/**
 * 发起用户信息授权
 * @param {* callback} 成功回调
 * @param {* failCallback} 失败回调
 
  // 发起用户信息授权
  let getUserProfile_params = {
    callback: (res) => {

    },
    failCallback: (res) => {

    },
  }
  CT.getUserProfile(getUserProfile_params);
 */
const getUserProfile = (params = {}) => {
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
          // 查看是否有授权成功回调
          params.callback && params.callback(data);
        }
      })
    },
    fail: (res) => { //用户拒绝，回到微信登录界面
      console.log(res);
      // 查看是否有授权失败回调
      params.failCallback && params.failCallback(res);
    }
  })
}

/**
 * 上传通用方法
 * @param {* uploadUrl} 上传接口地址
 * @param {* fields} 其他参数 fields: [{name: '', value: ''}, ...]
 * @param {* files} 图片或视频参数 files: [{name: '', filePath: ''}, ...]
 * @param {* callback} 成功回调
 * @param {* failCallback} 失败回调
 */
const myUploadFile = (params = {}) => {
  var reqNo = getTimeRandom();
  // 上传接口
  let uploadUrl = params.uploadUrl;
  // 其他参数
  let fields = params.fields;
  // 图片或视频参数
  let files = params.files;
  if (!uploadUrl || !fields || !files) {
    wx.showToast({
      title: 'params defect!',
      icon: 'error',
    })
    return;
  }
  // 上传中
  wx.showLoading({
    title: '上传中...',
    mask: true
  })
  let result = new Multipart({
    fields,
    files
  }).submit(uploadUrl);
  clearTimeout(hidUploadingTipTimer);
  hidUploadingTipTimer = setTimeout(() => {
    wx.hideLoading();
  }, 20 * 1000);
  result.then((res) => {
    wx.hideLoading();
    //请求结果
    console.log(res);
    if (res.statusCode == 200 && res.data.errorCode == 1000) {
      // 成功回调
      params.callback && params.callback(res);
      return;
    } else if (res.data.errorCode == 2005) {
      wx.showToast({
        title: res.data.errorMsg,
        icon: 'none',
        duration: 2000
      })
    } else if (res.data.errorCode == 1002) {
      // 参数有问题，安全审核结果返回
      wx.showToast({
        title: res.data.errorMsg,
        icon: 'none',
        duration: 2000
      })
    } else {
      wx.showToast({
        title: '文件格式不正确',
        icon: 'error',
        duration: 2000
      })
    }
    // 失败回调
    params.failCallback && params.failCallback(res);
  });
}

/**
 * 老学员登录通用方法
 * @param {* fields} 其他参数 fields: [{name: '', value: ''}, ...]
 * @param {* files} 图片或视频参数 files: [{name: '', filePath: ''}, ...]
 * @param {* callback} 成功回调
 * @param {* failCallback} 失败回调
 * 
  调用方法：
    // 登录请求
    let myOldStuLoginParams = {
      data: {
        "name": _this.data.userName,
        "number": _this.data.studentNum,
        "openId": app.globalData.openId,
      },
      callback: (res) => {
        
      },
      failCallback: (res) => {
        
      }
    };
    CT.myOldStuLogin(myOldStuLoginParams)
 */
const myOldStuLogin = (params = {}) => {
  let oldStudent = {
    requestUrl: ajaxConfig.oldStudent,
    method: 'POST',
    header: { 'content-type': 'application/json' },
    data: params.data
  }
  ajaxConfig.xjRequestApi(oldStudent,(res) => {
    if (res.data.successFlg == 1 && res.data && res.data.cartoonCode) {
      let callbackRes = params.callback && params.callback(res);
      if (!callbackRes) {
        // 全局记录当前登录学生学号和姓名
        app.globalData._loginStuNum = params.data.number;
        app.globalData._loginStuName = params.data.name;
        app.globalData._loginStuCode = res.data.cartoonCode;
      }
    } else {
      let failCallbackRes = params.failCallback && params.failCallback(res);
      if (!failCallbackRes) {
        let tipStr = '姓名或学号错误!';
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
}
/*
  // 获取某个目标页面的page对象
  CT.getTargetPageObj({
    page_route: ,
  });
*/
const getTargetPageObj = (params = {}) => {
  let targetPageRoute = params.page_route
  let targetPageObj = null;
  let pageArr = getCurrentPages();
  pageArr.forEach((value) => {
    let route = value.route;
    if (route && route.indexOf(targetPageRoute) > -1) {
      // 匹配到模板路径
      targetPageObj = value;
    }
  })
  return targetPageObj;
}
/**
  // 获取真正的播放串
  let getTruePlayUrl_params = {
    playUrl: ,
    callback (truePlayUrl) {

    },
  }
  CT.getTruePlayUrl(getTruePlayUrl_params);
 */
const getTruePlayUrl = (params = {}) => {
  //  检查用户是否使用流量数据，只提示一次
  let showNetwrorkTpye_params = {
    callback () {
      // 用户同意流量播放回调
      getTruePlayUrl_true(params);
    },
    failCallback () {
      // 用户不同意播放回调
    }
  }
  showNetwrorkTpye(showNetwrorkTpye_params);
}
const getTruePlayUrl_true = (params = {}) => {
  let playUrl = params.playUrl;
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
    var url = ajaxConfig.ipConfigLocal + "/videos/" + playUrl + '?token=' + xjToken;
    params.callback && params.callback(url);
  })
}
/**
  //  检查用户是否使用流量数据，只提示一次
  let showNetwrorkTpye_params = {
    callback () {
      // 用户同意流量播放回调
    },
    failCallback () {
      // 用户不同意播放回调
    }
  }
  CT.showNetwrorkTpye(showNetwrorkTpye_params);
 */
const showNetwrorkTpye = (params = {}) => {
  // 查看有无提示过用户流量非无线
  let haveTipNetwrorkTpye = app.globalData.haveTipNetwrorkTpye;
  if (!haveTipNetwrorkTpye) {
    wx.getNetworkType({
      success (res) {
        const networkType = res.networkType;
        if (networkType != 'wifi' && networkType != 'none') {
          app.globalData.haveTipNetwrorkTpye = 'yes';
          wx.showModal({
            title: '提示',
            content: '您正在使用非无线网络，请注意流量消耗，仅提示一次！',
            success (res) {
              if (res.confirm) {
                params.callback && params.callback();
              } else if (res.cancel) {
                params.failCallback && params.failCallback();
              }
            }
          })
        } else {
          params.otherCallback && params.otherCallback();
        }
      }
    })
  } else {
    params.callback && params.callback();
  }
}

/**
  //  监听用户手势（点下和离开需配套使用）： 手势开始
  CT.monitorGesture_start(e);
 */
const monitorGesture_start = (e) => {
  // 记录手势开始的坐标
  clientX_start = e.changedTouches[0].clientX;
  clientY_start = e.changedTouches[0].clientY;
}
/**
  // 监听用户手势（点下和离开需配套使用）： 开始手势结束
  var params_MGend = {
    // 《滑动方向》 最小生效距离。有默认值
    effectiveDistance_min: ,
    // 《滑动方向的垂直方向》，最大生效距离（该方向滑动超过这个距离的时候，滑动方向手势不生效，该距离一定小于滑动方向最小生效距离）。有默认值
    effectiveDistance_max: ,
    // 往下划 拉上方的
    callback_down (e) {

    },
    // 往上划 拉下方的
    callback_up (e) {

    },
    // 往右划 拉左方的
    callback_right (e) {

    },
    // 往左划 拉右方的
    callback_left (e) {

    },
  }
  CT.monitorGesture_end(e, params_MGend);
 */
const monitorGesture_end = (e, params_MGend = {}) => {
  // 《滑动方向》 最小生效距离
  let effectiveDistance_min = Math.abs(params_MGend.effectiveDistance_min) || 50;
  // 《滑动方向的垂直方向》，最大生效距离（该方向滑动超过这个距离的时候，滑动方向手势不生效，该距离一定小于滑动方向最小生效距离）
  let effectiveDistance_max = Math.abs(params_MGend.effectiveDistance_max) || 25;
  effectiveDistance_max = effectiveDistance_max > effectiveDistance_min ? effectiveDistance_min : effectiveDistance_max;
  // 获取上线左右滑动手势时间
  let callback_right = params_MGend.callback_right || function (e) {};
  let callback_left = params_MGend.callback_left || function (e) {};
  let callback_up = params_MGend.callback_up || function (e) {};
  let callback_down = params_MGend.callback_down || function (e) {};

  // 记录手势结束的坐标
  clientX_end = e.changedTouches[0].clientX;
  clientY_end = e.changedTouches[0].clientY;
  let distance_X = clientX_end - clientX_start;
  let distance_Y = clientY_end - clientY_start;
  // 根据上下距离绝对值，判定是执行上下滑动手势还是左右滑动手势。哪个值大执行哪个
  if (Math.abs(distance_X) > Math.abs(distance_Y)) {
    // 判定左右滑动
    if (distance_X > 0 && Math.abs(distance_X) > effectiveDistance_min && Math.abs(distance_Y) < effectiveDistance_max) {
      // 往右划 拉左方的
      callback_right(e);
    } else if (Math.abs(distance_X) > effectiveDistance_min && Math.abs(distance_Y) < effectiveDistance_max) {
      // 往左划 拉右方的
      callback_left(e);
    }
  } else {
    // 判定上下滑动
    if (distance_Y > 0 && Math.abs(distance_Y) > effectiveDistance_min && Math.abs(distance_X) < effectiveDistance_max) {
      // 往下划 拉上方的
      callback_down(e);
    } else if (Math.abs(distance_Y) > effectiveDistance_min && Math.abs(distance_X) < effectiveDistance_max) {
      // 往上划 拉下方的
      callback_up(e);
    }
  }
}


module.exports = {
  objToStr,
  strToObj,
  filterObj,
  checkUserName,
  checkPhoneNum,
  getTimeRandom,
  getUserInfo,
  getUserProfile,
  myUploadFile,
  myOldStuLogin,
  // 获取，匹配路径的页面对象
  getTargetPageObj,
  // 获取播放串
  getTruePlayUrl,
  showNetwrorkTpye,
  // 自定义获取用户手势
  monitorGesture_start,
  monitorGesture_end,
}
