var orderJs = {
    columnGetAuth: function(callback){
        var canOrderResult = 1;
        try {
            if(window.androidjs){//鉴权结果 0 成功  1 失败
                canOrderResult = window.androidjs.getOrderResult();
            }
        } catch (e) {

        }
        callback && callback(canOrderResult);
    },
    columnToOrderPage: function(stringPid){
        if(!stringPid){
            var local = window.location.href;
            var pageName = GetQueryString("action");
            if(!pageName){
                pageName = local.substring(local.lastIndexOf("/")+1,(local.indexOf("?")==-1?local.length:local.indexOf("?")));
            }
            stringPid = pageName;
        }
        try {
            if (window.androidjs) {
                window.androidjs.toOrderActivity(stringPid);
            }
        } catch (e) {
        }
    }
};