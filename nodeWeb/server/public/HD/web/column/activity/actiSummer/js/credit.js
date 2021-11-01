var credit = 0;
    /**
     * 获取用户积分
     * @param fn 回调函数
     * 用法: actiObj.getUserCredit(function(data){
     *
     * })
     */
    function getUserCredit(actiActivityId,fn){
    var _this = this;
        actiObj.getAjaxResult({
        requestUrl: actiActionUrl + "activity/getActivityCredit",
        params: {
            userId: actiUserId,
            activityId: actiActivityId
        },
        success: function(data){
            if(data && data.successFlg ==  "1"){
                credit = parseInt(data.data.creditNum,10);
            }else{
                credit = 0;
            }
            fn &&fn(data);
        },
        fail: function(){
            fn && fn(false);
        }
    });
}

    /**
     * 设置用户积分
     * @param creditNum 需要被设置的积分
     * @param fn 回调函数
     * 用法: actiObj.setUserCredit("creditNum",function(data){
     *
     * })
     */
    function setUserCredit(actiActivityId,creditNum,fn){
    var _this = this;
        actiObj.getAjaxResult({
        requestUrl: actiActionUrl + "/activity/saveActivityCredit",
        params: {
            userId: actiUserId,
            activityId: actiActivityId,
            creditNum: creditNum
        },
        success: function(data){
            fn &&fn(data);
        },
        fail: function(){
            fn && fn(false);
        }
    });
}
