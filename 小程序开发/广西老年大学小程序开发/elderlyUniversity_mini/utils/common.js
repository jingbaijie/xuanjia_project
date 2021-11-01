/**
 * 自定义方法
 *  */
import AJAX from "../utils/request";
const ajaxConfig = new AJAX();

let Common = {

  //和普通base64加密不一样
  base64UrlEncode: function (str) {
    var encodedSource = wx.CryptoJS.enc.Base64.stringify(str);
    var reg = new RegExp('/', 'g');
    encodedSource = encodedSource.replace(/=+$/, '').replace(/\+/g, '-').replace(reg, '_');
    return encodedSource;
  },

  // JWT加密
  JWT: function (params) {
    let header = JSON.stringify({
      "alg": "HS256"
    });

    let payload = JSON.stringify(params);

    let secretSalt = wx.base64.encodeURI("U2FsdGVkX1/tbhVf7Kzop78AJ3GcJWGsXrAxRtg/027Q5r8M8YyR7gAEVNZyoyEn");//秘钥

    let before_sign = this.base64UrlEncode(wx.CryptoJS.enc.Utf8.parse(header)) + '.' + this.base64UrlEncode(wx.CryptoJS.enc.Utf8.parse(payload));

    let signature = this.base64UrlEncode(wx.CryptoJS.HmacSHA256(before_sign, secretSalt));

    let final_sign = before_sign + '.' + signature;

    return final_sign;
  },

  // 公共跳转方法
  toRecommendUrl: function (recommendObj) {
    console.log(recommendObj);
    var recommendType = recommendObj.recommendDisplayType;//1卡通 2视频 4通用页面
    switch (recommendType) {
      case 1:
        wx.navigateTo({
          url: '/pages/interest/course/course?cartoonId=' + recommendObj.recommendDisplayValue + "&title=" + recommendObj.recommendDisplayName,
        })
        break;
      case 2:
        wx.navigateTo({
          url: '/pages/home/video/video?videoId=' + recommendObj.recommendDisplayValue,
        })
        break;
      case 4:
        var paramsObj = {
          data: { contentId: recommendObj.commpageId || recommendObj.recommendDisplayValue },
          requestUrl: ajaxConfig.findTemplateInfo
        }
        ajaxConfig.xjRequestApi(paramsObj, (e) => {
          var url = e.data.data.templateUrl;
          //跳转
          wx.navigateTo({
            url: url,
          })
        })      
        break;
      default:
        break;
    }
  },
  /**
   * 上传图片查看次数
   */
  uploadPicViewNum: function (batchNo) {
    var paramsObj = {
      requestUrl: ajaxConfig.picViewNumLog,
      data: {
        batchNo: batchNo
      }
    }
    ajaxConfig.xjRequestApi(paramsObj);
  },
  /**
   * 汇总卡通点赞
   */
  sumCartoonLikeNum: function (callback) {
    var paramsObj = {
      requestUrl: ajaxConfig.sumCartoonLikeNum
    }
    ajaxConfig.xjRequestApi(paramsObj, callback);
  }
}

export default Common;