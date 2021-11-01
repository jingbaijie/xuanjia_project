import languageData from '../locale'
import {$getLanguage} from './index'

const language = languageData.find(
  item => item.language === $getLanguage()
).data

// 昵称
export const VALI_NICKNAME = {
  min: 6,
  max: 16,
  message: language.user.userName_notValid.replace('{0}', 6).replace('{1}', 16)
}

// 支付宝名称
export const VALI_ALIPAY_NAME = {
  min: 2,
  max: 20,
  message: language.validate.alipay_name_range
}
// 支付宝账号
export const VALI_ALIPAY_ACCOUNT = {
  min: 4,
  max: 40,
  message: language.validate.alipay_account_range
}
// 银行卡姓名
export const VALI_CARD_HOLDER = {
  min: 2,
  max: 20,
  message: language.validate.card_holder_range
}
// 银行卡卡号
export const VALI_CARD_NUMBER = {
  min: 16,
  max: 19,
  message: language.validate.card_number_range
}
// 密码
export const VALI_PASSWORD_NUMBER = {
  min: 6,
  max: 18,
  message: language.validate.password_range.replace('{0}', 6).replace('{1}', 18)
}
// 提现地址标签
export const VALI_ADDRESS_LABEL = {
  min: 2,
  max: 16,
  message: language.validate.address_label
}
// 发广告备注信息
export const VALI_AD_REMARK = {
  max: 500,
  message: language.validate.max_length.replace('{0}', 500)
}
// 聊天输入框
export const VALI_CHAT = {
  max: 200,
  message: language.validate.max_length.replace('{0}', 1000)
}
// 付款留言
export const VALI_PAYMENT_INFO = {
  max: 200,
  message: language.validate.max_length.replace('{0}', 200)
}
//
export const VALI_NUMBER = {
  regexp: value => {
    return new RegExp('^[0-9.-]+$', 'g').test(value)
    // return !!+value ||
  },
  message: language.validate.must_be_number
}

export const VALI_NUMBER_CALLBACK = (rule, value, callback) => {
  if (value && !VALI_NUMBER.regexp(value)) {
    callback(new Error(VALI_NUMBER.message))
  } else {
    callback()
  }
}

// export const SET_RANGE_RULE = (value, min = 0, max, message) => {
//   if (!isString(value)) return new Error("value must be string");
//   let len = 0;
//   for (let i of value) {
//     var c = value.charCodeAt(i);
//     //单字节加1
//     if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
//       len += 1;
//     } else {
//       len += 2;
//     }
//   }
//   if (len < min && len >= max) {

//   }
// };
