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
        if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr = new XMLHttpRequest();
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
actiUserId = xjDataLog.getSmartCardid();
//活动ID
var actiActivityId = CT.getCookie("activityId") + "";
//活动接口项目地址
var actiActionUrl = ajaxConf.webApiUrl;
var actiObj = (function () {
    function Acti() {

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
        getChanceUrl: actiActionUrl + "activity/getUsedChanceForToday",
        /**
         *获取用户已使用机会次数
         * @param fn 回调方法
         * 用法: actiObj.getChance(function(data){
         *
         * });
         */
        getChance: function(fixedActivityId,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.getChanceUrl,
                params: {
                    userId: actiUserId,
                    activityId: fixedActivityId || actiActivityId
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
        setChanceUrl: actiActionUrl + "activity/saveActivityChance",
        /**
         * 上传用户此次使用机会
         * @param fn 回调方法
         * 用法: actiObj.setChance(function(data){
         *
         * })
         */
        setChance: function(fixedActivityId,fn){
            var _this = this;
            this.getAjaxResult({
                requestUrl: _this.setChanceUrl,
                params: {
                    userId: actiUserId,
                    activityId: fixedActivityId || actiActivityId
                },
                success: function(data){
                    fn &&fn(data);
                },
                fail: function(){
                    fn && fn(false);
                }
            });
        }
    };
    return new Acti();
})();
