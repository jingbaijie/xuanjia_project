export default class URL{
  /**
   * @memberOf URL
   * @summary 获取当前页面连接中指定参数
   * @type {function}
   * @param {string} param1                     - 如果param2为undefined，param1是指从当前页面url中获取指定参数的key, 如果param2不为空，param1为指定的url
   * @param {string} param2                     - 可选参数，如果param2存在，则从指定的param1连接中获取对应参数的key
   * @return {string|null}
   */
  static getParam (param1, param2) {
    let url = ''
    let param = null;
    // 如果只有一个参数，默认从当前页面链接获取参数
    if (typeof param2 === 'undefined') {
      url = window && window.location.href || ''
      param = param1
    // 从指定url中获取参数
    } else {
      url = param1
      param = param2
    }
    // 排除hash的影响
    url = url.split('#')[0]
    if (url.indexOf('?') > -1) {
      url = url.split('?')[1]
    }
    const reg = new RegExp('(^|&)' + param + '=([^&]*)[&#$]*', 'i')
    const rstArr = url.match(reg)
    if (rstArr !== null) {
      return decodeURIComponent(rstArr[2])
    }
    return null
  }
}