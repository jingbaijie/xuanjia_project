/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-04-29 14:29:46
 * @LastEditors: sueRimn
 * @LastEditTime: 2020-05-29 14:03:28
 */
const Mock = require('mockjs');
// 设置拦截ajax请求的相应时间
Mock.setup({
  timeout: '200-600'
});
// 获取 mock.Random 对象
const Random = Mock.Random
const loginMockData = function () {
  return {"data":{"nick":"王亚运mock","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1ODgxNTY3MDksInVzZXJuYW1lIjoid2FuZ3lheXVuIiwiaWF0IjoxNTg4MTUzMTA5fQ.7Pv-tICG2wmMbwGnN9ve4Rm1sOVA_juP0zlTZOhAViw","uname":"wangyayun"},"errorCode":"1000","errorMsg":"操作成功","successFlg":1}
}

// 拦截ajax请求，配置mock的数据
Mock.mock('http://180.96.20.178:8097/iptv-admin-api/login', 'post', loginMockData)
export default Mock;
/** 
let configArray = [];
// 使用webpack的require.context()遍历所有mock文件
const files = require.context('.', true, /\.js$/);
files.keys().forEach((key) => {
  if (key === './index.js') return;
  configArray = configArray.concat(files(key).default);
});

// 注册所有的mock服务
configArray.forEach((item) => {
  for (let [path, target] of Object.entries(item)) {
    let protocol = path.split('|');
    Mock.mock(new RegExp('^' + protocol[1]), protocol[0], target);
  }
});
*/
