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

}

export default Common;