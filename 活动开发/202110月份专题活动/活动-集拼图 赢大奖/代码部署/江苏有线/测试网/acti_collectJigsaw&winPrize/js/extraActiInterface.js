//当前活动新增接口
var extraActiInterfaceUrl = AjaxConfig.origin + "/user_activity_support/";
// 查询用户是否订购活动接口;
function queryUserOrderActivity(params, callback) {
    params = params || {};
    callback = callback || function () { };
    var url = extraActiInterfaceUrl + "api/order/queryUserOrderActivity";
    var data = {
        url: url,
        params: params
    }
    interface.ajax(data, callback);
}
// 查询用户设置奖品内容时间是否在有效期接口;
function querySetIsValid(params, callback) {
    params = params || {};
    callback = callback || function () { };
    var url = extraActiInterfaceUrl + "api/prizeContent/querySetIsValid";
    var data = {
        url: url,
        params: params
    }
    interface.ajax(data, callback);
}
// 设置用户领取的奖品内容接口;
function setPrizeContent(params, callback) {
    params = params || {};
    callback = callback || function () { };
    var url = extraActiInterfaceUrl + "api/prizeContent/set";
    var data = {
        url: url,
        params: params,
        ajaxConfig: { method: "POST" }
    }
    interface.ajax(data, callback);
}