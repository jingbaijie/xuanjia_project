/**
 *url :请求接口地址
 *xhr:对象
 *Async:是否是异步请求（true：异步；false：同步）
 *method:请求方式（POST或GET）
 *params:请求传送的参数
 *Content-Type:请求头格式要求
 *data:请求获取到的信息
 *
 *
 ***调用方法：actiAjax.init({
						url:"http://r.qzone.qq.com/cgi-bin/user/cgi_personal_card",
						method:"get",
						params:{"format":"json","ip":"218.4.255.255"},
						async:true,
						ContentType:"application/x-www-form-urlencoded",
						success:function(data){
							aa.innerHTML=data;
						},
						fail:function(status){

						}
				});
 */
function AjaxFun(option){
    this.option=null;
    this.url=null;//请求地址
    this.Async=null;//是否异步请求；
    this.method=null;//请求方式
    this.beforeSend = null;//发送请求前调用方法
    this.formatParams=function(data){//对传参进行编码
        var arr=[];
        for(var name in data){
            arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
        }
        return arr.join("&");
    };
    this.jsonToString = function(obj){//将json 转成 string 类型字符串

        function format(val, cb) {//判断该参数是数字，字符串，还是其它
            var str = /^(string)$/;
            var num = /^(number)$/;
            var type = typeof val;
            if (val && str.test(type)) {
                return '"' + val + '"' ;
            }else if(val && num.test(type)){
                return val;
            } else {
                return cb(val);
            }
        }

        var arr = [];
        if(obj && obj instanceof Array){
            for(var i=0,len=obj.length;i<len;i++){
                arr.push(format(obj[i],jsonToString)) ;
            }
            return '[' + arr.join(',') + ']';
        }else if(obj && obj instanceof Object){

            for(var key in obj){
                arr.push('"' + key + '":' + format(obj[key],jsonToString));
            }
            CT.writeInfo(arr);
            return '{' + arr.join(',') + '}';
        }else{
            return '""';
        }
    };
    this.params = null;//拼接的参数串
    this.contentType = null;//发送数据的类型
    this.timeoutTimer = null;//超时定时器
    this.timeout = null;//超时时长
    this.init=function(option){//初始化
        this.option=option||{};
        this.url=this.option.url;//请求地址
        this.Async = this.option.async == false ?  false : true ;//是否异步请求；true（异步）或 false（同步）
        this.method=this.option.method.toUpperCase();//请求方式
        this.params=this.formatParams(this.option.params);
        this.contentType=this.option.ContentType||"";//发送数据的类型
        this.beforeSend = this.option.beforeSend || null;//发送请求前调用方法
        this.timeout = this.option.timeout || 10000;//超时时长,默认超时10000 秒
        //创建对象
        //CT.writeInfo(this.formatParams)
        var xhr;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr=new XMLHttpRequest();
        } else {// code for IE6, IE5
            xhr=new ActiveXObject("Microsoft.XMLHTTP");
        }
        //接收请求
        xhr.onreadystatechange=function(){
            if(xhr.readyState == 4 ){
                if(xhr.status == 200){
                    var data = xhr.responseText;
                    if(data.indexOf("{") > -1){
                        data = eval("("+xhr.responseText+")");
                    }else{
                        //当部分机顶盒出现  返回str 字符串的时候  eg： var data = '"ok"'; //就没法进行eval解析的
                        data = xhr.responseText.replace(/[\W]+/g,"");
                    }
                    clearTimeout(this.timeoutTimer);
                    option.success && option.success(data);

                } else {
                    option.fail && option.fail(status);

                }
            }
        };
        //判断请求方式
        if(this.method=="POST"){
            xhr.open(this.method,this.url,this.Async);
            var dataStr = this.params;
            //设置提交时的内容类型
            if(this.contentType==""){
                xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            }else if(this.contentType.indexOf("json") > -1){
                xhr.setRequestHeader("Content-type","application/json");
                //json 类型提交的时候 send的方法传送的数据为 json字符串类型是数据
                dataStr = this.jsonToString(this.option.params)
            }else{
                xhr.setRequestHeader("Content-type",this.contentType);
            }
            //请求前调用方法  可以设置请求头 ，也可以是 在这里设置显示加载loading ,然后在强求完成中隐藏loading
            if(this.beforeSend){
                this.beforeSend(xhr);
            }
            xhr.send(dataStr);//发送数据
        }else if(this.method=="GET"){
            xhr.open(this.method,this.url+"?"+this.params,this.Async);
            if(this.beforeSend){
                this.beforeSend(xhr);
            }
            xhr.send(null);
        }
        if ( this.timeout && this.timeout > 0 ) {
            this.timeoutTimer = setTimeout( function(){
                xhr.abort( "timeout" );
                this.fail && this.fail();//超时回调
            }, this.timeout );
        }
    };

}
var actiAjax = new AjaxFun();

/*****************************活动需要的基本数据**************************/
//用户名
var actiUserId = CT.getCookie("actiUserId")+"";
if(actiUserId == "" || actiUserId == "null" || actiUserId == "undefined" || actiUserId == "-1"){
	actiUserId = xjDataLog.getUserId();
}
//userTooken
var actiUserToken = CT.getCookie("userToken") + "";
//carrierId
var actiCarrierId = CT.getCookie("carrierId") + "";
//活动ID
//var actiActivityId = CT.getCookie("activityId") + "";
var actiActivityId = 8 + "";
//pid
var actiPid = CT.getCookie("pid") + "";
if(actiPid.indexOf("activity") === -1){
    actiPid = actiPid + "_activityId" + actiActivityId;
}
//活动接口项目地址
//var actiActionUrl = AjaxConfig.origin + "/iptv-web-api/api";
var actiActionUrl ="http://172.31.183.147:8090/iptv-web-api/api";
var actiObj = (function(){
    function Acti(){

    };
    Acti.prototype = {
        /**
         * 获取ajax请求结果
         * option = {
         *      "requestUrl": 请求地址
         *      "method": 请求类型(post/get)
         *      "params": 请求参数
         *      "success": function(data){}请求成功后的回调方法
         *      "fail": function(data){}请求失败后的回调方法
         *  }
         * @param option
         * 用法: actiObj.getAjaxResult({
         *     url: "www.baidu.com",
         *     method: "get",
         *     params: {action: 123},
         *     success: function(data){
         *
         *     },
         *     fail: function(data){
         *
         *     }
         * })
         */
        getAjaxResult : function(option){
            option.params.vTime = new Date().getTime();
            actiAjax.init({
                url:option.requestUrl,
                method:option.type || "get",
                params:option.params,
                async:true,
                ContentType:"application/x-www-form-urlencoded",
                success:function(data){
                    option.success && option.success(data);
                },
                fail:function(status){
                    option.fail && option.fail();
                }
            });
        },
        /**
         *
         * 获取当前用户信息(包含手机号)  请求参数: userId
         * 拥有用户信息时的返回信息，建议以successFlg为判断(1为成功，0为失败)
         * {
            data: {
                cityId: null,
                createTime: null,
                filemTime: null,
                id: 2,
                lastLoginTime: null,
                markIp: null,
                more1: null,
                more2: null,
                more3: null,
                more4: null,
                stbId: null,
                userBalance: 0,
                userCredits: 0,
                userOrderstatus: 0,
                userPhone: null,
                userSex: 0,
                userid: "1001"
            },
            errorCode: "1000",
            errorMsg: "操作成功",
            successFlg: 1
            }
         *
         * 没有查询到用户信息时的返回信息
         * {
                data: "",
                errorCode: "1007",
                errorMsg: "结果集为空",
                successFlg: 0
            }
         */
        //getUserPhoneUrl : actiActionUrl + "/web/findUserDetailByUserId",
        getUserPhoneUrl : AjaxConfig.origin + "/iptv-web-api/api/web/findUserDetailByUserId",
        /**
         * 获取用户手机号
         * @param fn 回调方法
         * 用法： actiObj.getUserPhone(function(data){
         *
         * })
         */
        getUserPhone: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getUserPhoneUrl,
                params: {
                    userId: actiUserId
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_chance_tab
         * 获取用户今日已使用机会  请求参数: activityId  userId
         *返回信息
         * {
                data: {
                    activityChance: 0,
                    activityId: 1,
                    createTime: "2019-06-27 17:29:36",
                    id: 3,
                    loginTime: "2019-06-27 17:29:36",
                    userid: "96321"
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         */
        getChanceUrl : actiActionUrl + "/activity/getUsedChanceForToday",
        /**
         *获取用户已使用机会次数
         * @param fn 回调方法
         * 用法: actiObj.getChance(function(data){
         *
         * });
         */
        getChance: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getChanceUrl,
                params: {
                    userId: actiUserId,
                    activityId: actiActivityId
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_chance_tab
         * 上传用户机会  请求参数: activityId   userId
         * 返回信息
         * 操作成功
         *  {
                data: "",
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         *  操作失败
         *  {
                data: "",
                errorCode: "1000",
                errorMsg: "操作失败",
                successFlg: 0
            }
         *
         *
         */
        setChanceUrl :  actiActionUrl + "/activity/saveActivityChance",
        /**
         * 上传用户此次使用机会
         * @param fn 回调方法
         * 用法: actiObj.setChance(function(data){
         *
         * })
         */
        setChance: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setChanceUrl,
                params: {
                    userId: actiUserId,
                    activityId: actiActivityId
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },

        /**
         * xjcartoon_activity_credit_tab
         * 获取当前用户积分  请求参数: userId   activityId
         * 返回信息
         *{
            data: {
                activityId: 1,
                creditNum: 0,
                flag: 0,
                userId: "96321"
            },
            errorCode: "1000",
            errorMsg: "操作成功",
            successFlg: 1
            }
         */
        getUserCreditUrl : actiActionUrl + "/activity/getActivityCredit",
        /**
         * 获取用户积分
         * @param fn 回调函数
         * 用法: actiObj.getUserCredit(function(data){
         *
         * })
         */
        getUserCredit: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getUserCreditUrl,
                params: {
                    userId: actiUserId,
                    activityId: actiActivityId
                },
                success: function(data){
                    if(data && data.successFlg ==  "1"){
                        _this.credit = parseInt(data.data.creditNum,10);
                    }else{
                        _this.credit = 0;
                    }
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_credit_tab
         * 设置用户积分  请求参数: userId  activityId  creditNum
         * 返回信息
         * 积分设置成功
         * {
                data: "",
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         */
        setUserCreditUrl : actiActionUrl + "/activity/saveActivityCredit",
        /**
         * 设置用户积分
         * @param creditNum 需要被设置的积分
         * @param fn 回调函数
         * 用法: actiObj.setUserCredit("creditNum",function(data){
         *
         * })
         */
        setUserCredit: function(creditNum,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setUserCreditUrl,
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
        },
        /**
         * xjcartoon_activity_credit_tab
         * 获取当前用户积分排行  请求参数: activityId   userId
         * 返回信息
         * {
                data: {
                    activityId: 1,
                    rank: 4,
                    userId: "96321"
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         */
        getUserRankListUrl : actiActionUrl + "/activity/getActivityUserCreditRank",
        /**
         * 获取当前用户在整体排行版中的情况
         * @param fn 回调函数
         * 用法: actiObj.getUserRankList(function(data){
         *
         * })
         */
        getUserRankList: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getUserRankListUrl,
                params: {
                    userId: actiUserId,
                    activityId: actiActivityId
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_credit_tab
         * 获取当前活动积分排行榜
         * 请求参数: activityId pageNo=1(页数)  pageSize=10(该页数内包含几条内容) orderbyType=0(0为正序1为倒序)
         * 返回信息
         * 有排行信息
         * {
                data: {
                    current: 1,
                    pages: 2,
                    records: [
                        {
                            activityCreditNum: 222,
                            activityId: 1,
                            createTime: "2019-06-15 16:24:52",
                            id: 2,
                            loginTime: "2019-06-15 16:24:47",
                            userId: "lwg"
                        },
                        {
                            activityCreditNum: 123,
                            activityId: 1,
                            createTime: "2019-06-15 16:24:08",
                            id: 1,
                            loginTime: "2019-06-15 16:24:05",
                            userId: "12321"
                        },
                        {
                            activityCreditNum: 50,
                            activityId: 1,
                            createTime: "2019-06-15 16:24:58",
                            id: 3,
                            loginTime: "2019-06-15 16:24:55",
                            userId: "ioio"
                        }
                    ],
                    size: 3,
                    total: 5
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         * 无排行信息
         * {
                data: {
                    current: 1,
                    pages: 0,
                    records: [ ],
                    size: 3,
                    total: 0
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
                }
         */
        getActivityRankListUrl : actiActionUrl + "/activity/getActivityCreditTopList",
        /**
         * 获取当前活动的整体积分排行
         * @param pageSize 排行内容数量
         * @param orderbyType 0为正序，1为倒序
         * @param fn 回调函数
         */
        getActivityRankList: function(pageSize,orderbyType,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getActivityRankListUrl,
                params: {
                    activityId: actiActivityId,
                    pageNo: 1,
                    pageSize: pageSize || 10,
                    orderbyType: orderbyType || 0
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_user_tab
         * 保存用户电话号码  请求参数: userId  userPhone
         * 返回信息
         * true: 保存成功
         * false: 保存失败
         */
        //setUserPhoneUrl : actiActionUrl + "/web/updateUserInfo",
        setUserPhoneUrl : AjaxConfig.origin + "/iptv-web-api/api/web/updateUserInfo",
        /**
         * 设置当前用户手机号
         * @param userPhone  被设置的手机号
         * @param fn 回调函数
         * 用法: actiObj.setUserPhone("phoneNumber",function(data){
         *
         * })
         */
        setUserPhone: function(userPhone,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setUserPhoneUrl,
                params: {
                    userId: actiUserId,
                    userPhone: userPhone
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_prize_tab
         * 获取本活动的所有奖品 请求参数: activityId  pageNo=1   pageSize=10
         * 返回信息
         * 获取奖品成功
         * {
                data: {
                    current: 1,
                    pages: 3,
                    records: [
                        {
                            activityCname: null,
                            activityId: 44,
                            createTime: null,
                            id: 1001,//奖品ID
                            more1: "",
                            more2: "",
                            more3: "",
                            more4: "",
                            picUrl: null,
                            prizeCname: "呼呼cccc",
                            prizeFrom: 1,
                            prizePercentage: 0.05,
                            prizePicId: 232,
                            prizePrice: "100",
                            prizeRemainNum: 15,
                            prizeTotalNum: 100,
                            prizeType: "",
                            rankId: 1
                        }
                    ],
                    size: 10,
                    total: 22
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
         */
        getActivityPrizeUrl : actiActionUrl + "/activity/getActivityPrizeList",
        /**
         * 获取当前活动的奖品信息
         * @param fn 回调函数
         * 用法: actiObj.getActivityPrize(function(data){
         *
         * })
         */
        getActivityPrize: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getActivityPrizeUrl,
                params: {
                    activityId: actiActivityId,
                    pageNo: 1,
                    pageSize: 10,
		    prizeFrom: 0
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_user_getprize_tab
         * 保存用户兑换奖品 请求参数: activityId    prizeId(奖品ID)      userId
         * 返回信息
         *{
                data: {
                   msg: "",
                   flag: 1  //-1：无商品，0：有商品但是没库存，1：成功
                },
                 errorCode: "1000",
                 errorMsg: "操作成功",
                 successFlg: 1
            }
         */
        setPrizeUrl : actiActionUrl + "/activity/setUserPrize",
        /**
         * 设置当前用户拥有哪个奖品
         * @param prizeId 被设置的奖品对应的奖品ID
         * @param fn 回调函数
         * 用法: actiObj.setPrize(prizeId,function(data){
         *
         * })
         */
        setPrize: function(prizeId,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setPrizeUrl,
                params: {
                    activityId: actiActivityId,
                    userId: actiUserId,
                    prizeId: prizeId,
		    prizeFrom: 0
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_user_getprize_tab
         * 获取当前用户获奖信息  请求参数: userId  activityId
         * 返回信息
         * 该用户在当前活动拥有奖品(一个用户在一个活动中只允许拥有一个奖品)
         * {
                data: [
                    {
                        activityId: 1,
                        createTime: "2019-06-28 14:09:54",
                        getPrizeType: 0,
                        prizeCname: "呼呼cccc",
                        prizeFrom: 1,
                        prizePrice: "100",
                        userId: "96321",
                        userPhone: null
                    }
                ],
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         * 该用户在当前活动未拥有奖品
         * {
                data: "",
                errorCode: "1007",
                errorMsg: "结果集为空",
                successFlg: 0
            }
         */
        getUserPrizeInfoUrl : actiActionUrl + "/activity/getUserPrizeInfo",
        /**
         * 获取当前用户的中奖信息,一名用户在一个活动中只能拥有一个奖品
         * @param fn 回调函数
         * 用法: actiObj.getUserPrizeInfo(function(){
         *
         * })
         */
        getUserPrizeInfo: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getUserPrizeInfoUrl,
                params: {
                    activityId: actiActivityId,
                    userId: actiUserId,
 		    prizeFrom: 0
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_user_getprize_tab
         * 获取所有获奖用户列表  activityId  pageNo=1   pageSize=10
         * 返回信息
         * 存在获奖用户
         * {
                data: {
                    current: 1,
                    pages: 1,
                    records: [
                        {
                            activityId: 1,
                            createTime: "2019-06-28 14:09:54",
                            getPrizeType: 0,
                            prizeCname: "呼呼cccc",
                            prizeFrom: 1,
                            prizePrice: null,
                            userId: "96321",
                            userPhone: null
                        }
                    ],
                    size: 3,
                    total: 3
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
                }
         *
         * 不存在获奖用户
         * {
            data: {
                current: 1,
                pages: 0,
                records: [ ],
                size: 3,
                total: 0
            },
            errorCode: "1000",
            errorMsg: "操作成功",
            successFlg: 1
            }
         */
        getPrizeUserInfoUrl : actiActionUrl +  "/activity/getActivityUserPrizeList",
        /**
         * 获取当前活动中的中奖用户,取前十
         * @param fn 回调函数
         * 用法: actiObj.getPrizeUserInfo(function(data){
         *
         * })
         */
        getPrizeUserInfo: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getPrizeUserInfoUrl,
                params: {
                    activityId: actiActivityId,
                    pageNo: 1,
                    pageSize: 20,
		    prizeFrom: 0
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_userdata
         *获取当前用户存储信息(可存取任意长度为255内的字符串)   activityId   userId
         * 返回信息
         * 在当前活动有存储数据
         * {
                data: {
                    activityId: 1,
                    id: 3,
                    loginTime: null,
                    more1: null,
                    more2: null,
                    userActiData: "1_1_1",
                    userId: "96321"
                },
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         * 在当前活动无存储信息
         * {
                data: "",
                errorCode: "1007",
                errorMsg: "结果集为空",
                successFlg: 0
            }
         */
        getUserDataListUrl : actiActionUrl + "/activity/getActivityUserDataList",
        /**
         * 获取当前用户在当前活动中存储的信息
         * @param fn 回调函数
         * 用法: actiObj.getUserDataList(function(data){
         *
         * })
         */
        getUserDataList: function(fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getUserDataListUrl,
                params: {
                    activityId: actiActivityId,
                    userId: actiUserId
                },
                success: function(data){
                    if(data && data.successFlg == "1"){
                        _this.userData = data.data.userActiData;
                    }else{
                        _this.userData = "";
                    }
                    fn &&fn(data);
                },
                fail: function(){
                    _this.userData = "";
                    fn && fn(false);
                }
            });
        },
        /**
         * xjcartoon_activity_userdata
         * 设置当前用户存储信息(可存取任意字符串)
         * 请求参数: activityId   userId    userActiData(任意的需存储的字符串信息)
         * 返回信息
         * 请求成功
         * {
                data: "",
                errorCode: "1000",
                errorMsg: "操作成功",
                successFlg: 1
            }
         *
         * 请求失败
         * {
                data: "",
                errorCode: "1000",
                errorMsg: "操作失败",
                successFlg: 0
            }
         *
         */
        setUserDataListUrl : actiActionUrl + "/activity/setActivityUserData",
        /**
         * 设置当前用户需存储的信息
         * @param userData 需设置的信息
         * @param fn 回调函数
         * 用法: actiObj.setUserDataList(function(data){
         *
         * })
         */
        setUserDataList: function(userData,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setUserDataListUrl,
                params: {
                    activityId: actiActivityId,
                    userId: actiUserId,
                    userActiData: userData
                },
                success: function(data){
                    _this.userData = userData;
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        },
        option: null,
        /**
         * 将对象转(params)换成用&符号拼接的字符串,并返回用&符号拼接的字符串
         * @param params
         * @returns {string}
         * 用法： actiObj.trimArgs({"1": 1,"2": 2});
         */
        trimArgs: function(params){
            var args = '';
            for(var i in params) {
                if(args !== '') {
                    args += '&';
                }
                //args += i + '=' + encodeURIComponent(params[i]);
                args += i + '=' + params[i];
            }
            return args;
        },
        /**
         * 获取当前Url地址的中name的值,并返回该值
         * @param name
         * @returns {null}
         * @constructor
         * 用法: actiObj.GetQueryString("action")
         */
        GetQueryString: function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if(r!=null)return  unescape(r[2]); return null;
        },
        /**
         * 在url中筛选name的值,并返回该值
         * @param url
         * @param name
         * @returns {*}
         * 用法： actiObj.querySearchUrlKey(window.location.href,"action")
         */
        querySearchUrlKey: function(url,name){
            var search,reg,value;
            if(url){
                search = url.substring(url.indexOf("?")+1);//获取问号后面的字符串
            }
            if(name){
                reg = new RegExp('(^|&)' + name + '=([^&]*)($|&)');//获取正则表达式
                try{
                    value = search.match(reg)[2];
                }catch(e){
                    value = "null";
                }

            }else{
                value = "null"
            }
            return value;
        },

        /**
         * 查看当前页面是否存在选中框focusName
         * @param focusName
         * @returns {boolean}
         * 用法: actiObj.checkFocusAble("FocusID")
         */
        checkFocusAble: function(focusName){
            focusName = focusName + "";
            if(focusName && focusName.indexOf("hands_x0_y0") != -1 && document.getElementById(focusName)){
                return true;
            }else{
                return false;
            }
        },
        /**
         * 切换焦点
         * @param focusName
         * 用法: actiObj.changeFocus("FocusID");
         */
        changeFocus: function(focusName){
            if(this.checkFocusAble(focusName) === true){
                PAGE.changeFocus(focusName);
            }
        },
        /**
         *判断当前DOM（objDom）元素是否拥有cls类
         *
         * objDom: 查询元素
         * cls类名
         *用法: actiObj.hasClass(DOM.'className')
         * */
        hasClass: function(objDom,cls){
            return objDom.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
        },
        /**
         *为当前DOM（objDom）元素添加cls类
         *
         * objDom: 查询元素
         * cls类名
         * 用法: actiObj.addClass(DOM,"className")
         * */
        addClass: function(objDom,cls){
            if(!this.hasClass(objDom, cls)) objDom.className += " " + cls;
        },
        /**
         *为当前DOM（objDom）元素移除cls类
         *
         * objDom: 查询元素
         * cls类名
         * 用法: actiObj.removeClass(DOM,"className")
         * */
        removeClass: function(objDom,cls){
            if(this.hasClass(objDom, cls)) objDom.className = objDom.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), '');
        },
		/**
		 * 活动跳转
		 *
         * url: 跳转下一个页面的路径
         * str：取当前路径“？”之后的所有数据，拼接到下一个页面路径
         * 用法: actiObj.actiCommonJumpUrl(url)
         * */
        actiCommonJumpUrl: function(url){
            /*
            userId
            pid
            activityId
            contentId
            contentCName
            contentEName
            defaultFocus
            */
            debugger;
            console.log('.....');
            var strArr = [];
			var curPageEName = url.substring(url.lastIndexOf("/")+1,(url.indexOf("?")==-1?url.length:url.indexOf("?")));
            strArr["userId"] = CT.requestValue("userId");
            strArr["pid"] = CT.requestValue("pid");
            strArr["activityId"] = CT.requestValue("activityId");
            strArr["contentCName"] = actiPageCname || CT.requestValue("contentCName");
            strArr["contentId"] = CT.requestValue("contentId");
            strArr["contentEName"] = curPageEName+"_activityId"+actiActivityId;//CT.requestValue("contentEName")
            strArr["defaultFocus"] = curFocus.FocusID;//从A页面离开到达活动页面，defaultFocus记录A页面离开时的焦点，实现来哪去哪（备用）
			strArr["vTime"] = new Date().getTime();
            var str = this.trimArgs(strArr);
            if(url.indexOf("?") != -1){
				url += "&" + str;
               window.location.href = url;
            }else{
				url += "?" + str;
               window.location.href = url;
            }

        }
    };
    return new Acti();
})();
