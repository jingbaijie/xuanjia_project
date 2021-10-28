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
 ***调用方法：ajax.init({
						url:"http://r.qzone.qq.com/cgi-bin/user/cgi_personal_card",
						method:"get",
						params:{"format":"json","ip":"172.16.169.240"},
						async:true,
						ContentType:"application/x-www-form-urlencoded",
						success:function(data){
							aa.innerHTML=data;
						},
						fail:function(status){

						}
				});
 */
//配置文件
var AjaxConfig = {
	    //IP + 端口
        // origin :  document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] || "http://172.31.231.229:28080",
		// 端口
        // PORT : document.URL.match(/(:)(\d)+/g)[0].substr(1),
		// IP
        // IP : document.URL.match(/(http|https)(:\/\/)[^\:]+/g)[0],
		// //图片地址
		// imgUrl:document.URL.match(/(http|https)(:\/\/)[\w\.:]+/g)[0] || "http://172.31.231.229:28080/",
        // //完整的项目地址 ip+端口+项目名
        // projectUrl : document.URL.match(/(https?\:\/\/)([0-9a-zA-Z\_\.\-:]*\/){2}/g)[0],
		// //页面后台接口地址
		// interfaceUrl:document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/iptv-web-api/api/web/",
		// //活动接口
		// actInterfaceUrl:document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/iptv-web-api/api/activity/",
		// //日志接口
		// loggerUrl: document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/iptv-log-api/api/log/",
		// //新增用户接口
		// insertUserUrl: document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/iptv-web-api/api/web/insertUserInfo",
		// //默认的首页地址，预备强制返回用
		// defaultMainUrl : "/HD/web/mainPage/html/mainPage.html",
		// //页面所有数据，每个页面必须赋值这个变量，眉头JS和日志使用
	    // commonPageInfo : null,
		// //自动寻找焦点，默认false不启动自动寻找，如果页面眉头需要启动自动寻找，需要在调用 navBarObj.init之前设置isAutoFindFocus为true
		// isAutoFindFocus:false,
		// //全国日志埋点接口
		// saveCommonLog: document.URL.match(/(http|https)(:\/\/)[^\/]+/g)[0] + "/iptv-log-api/log/saveCommonLog",

		// //广东有线新增。
		// //hostname 启动游戏主机名
		// hostname : document.URL.match(/(http|https)(:\/\/)[^\:]+/g)[0].split("://")[1],
		// //启动游戏端口
		// gamePort : 28080
		
};

/**
 * ajax请求升级
 * @param option ｛
 *             url : "http://192.168.2.40:8080/projectName/",//请求地址
 *             async : true, //  true 异步，false 同步
 *             method : "get", // post
 *             ContentType : "application/json",//发送数据类型
 *             beforeSend : function(xhr) {//发送请求前调用方法 可以设置请求头
 *                      xhr.setRequestHeader("token","header-token-value");
 *             },
 *             params : { //需要传的参数
 *                  userId : "aa",
 *                  pid : "1"
 *             },
 *             success : function(data){
 *                  //成功回调
 *             },
 *             fail : function(data){
 *                  //失败回调
 *             } ,
 *             timeout : 5000,//设置超时时间，超时直接调用失败回调
 *
 *
 *
 * ｝
 */



function AjaxFun(option){
    var _this = this;
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
				}else if(val + "" && num.test(type)){
					return val;
				} else {
					return cb(val);
				}
			}
			
			var arr = [];
			if(obj && obj instanceof Array){
				for(var i=0,len=obj.length;i<len;i++){		
					arr.push(format(obj[i],_this.jsonToString)) ;	
				}
				return '[' + arr.join(',') + ']';
			}else if(obj && obj instanceof Object){

				for(var key in obj){
					arr.push('"' + key + '":' + format(obj[key],_this.jsonToString));
				}
				
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
        ////console.log(this.formatParams)
        var xhr;
        if (window.XMLHttpRequest)
        {// code for IE7+, Firefox, Chrome, Opera, Safari
            xhr=new XMLHttpRequest();
        }
        else
        {// code for IE6, IE5
            xhr=new ActiveXObject("Microsoft.XMLHTTP");
        }

        //接收请求
        xhr.onreadystatechange=function(){
            if(xhr.readyState == 4 ){
                if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304){
					var data = xhr.responseText;
					//alert("this.params>>>>>"+ data)
					if(data.indexOf("{") > -1){
					//alert("this.params indexof >>>>>")
						
						data = eval("("+xhr.responseText+")");
						
					}else{
						//alert("this.params indexofelse >>>>>"+ data)
						//当部分机顶盒出现  返回str 字符串的时候  eg： var data = '"ok"'; //就没法进行eval解析的
						data = xhr.responseText.replace(/[\W]+/g,"");
						//alert("this.params index else >>>>>"+ data)


					}
                    clearTimeout(this.timeoutTimer);

		    //alert(data.page+"this.params success >>>>>"+ ajax.jsonToString(data));

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
            if(this.jsonToString(this.params) == '{}' || this.params == ''){
                var p = '';
            }else {
                var p = "?"+this.params;
            }
		//alert("curUrl>>>>" + document.URL + "<<<<<>>>" + this.method + ">>>>" + this.url+p + ">>>>" + this.Async)   
            xhr.open(this.method,this.url+p,this.Async);

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

var ajax=new AjaxFun();



/**
 * jsonp请求
 * @param url
 * @param config
 * @constructor
 * function myerror(){
			alert('there must be something wrong!');
		}


 function getData (data){
			alert("服务器过来的数据是"+data);
		}


 var url = 'http://runningls.com/demos/2016/jsonp/jsonp.php';

 //调用函数。
 JSONP(url,{
			data:{
				id:1
			},
			callback:getData,
			error:myerror,
			timeout:10000
		});
 */
function JSONP(url,config){
	var data = config.data || [];
	var paraArr=[],paraString='';//get请求的参数。
	var urlArr;
	var callbackName;//每个回调函数一个名字。按时间戳。
	var script,head;//要生成script标签。head标签。
	var supportLoad;//是否支持 onload。是针对IE的兼容处理。
	var onEvent;//onload或onreadystatechange事件。
	var timeout = config.timeout || 0;//超时功能。

	for(var i in data){
		if(data.hasOwnProperty(i)){
			paraArr.push(encodeURIComponent(i) + "=" +encodeURIComponent(data[i]));
		}
	}

	urlArr = url.split("?");//链接中原有的参数。
	if(urlArr.length>1){
		paraArr.push(urlArr[1]);
	}

	callbackName = 'callback'+new Date().getTime();
	paraArr.push('callback='+callbackName);
	paraString = paraArr.join("&");
	url = urlArr[0] + "?"+ paraString;

	script = document.createElement("script");
	script.loaded = false;//为了实现IE下的onerror做的处理。JSONP的回调函数总是在script的onload事件（IE为onreadystatechange）之前就被调用了。因此我们在正向回调执行之时，为script标签添加一个属性，然后待到onload发生时，再检测有没有这个属性就可以判定是否请求成功，没有成功当然就调用我们的error。

	//将回调函数添加到全局。
	window[callbackName] = function(arg){
		var callback = config.callback;
		callback(arg);
		script.loaded = true;
	};

	head = document.getElementsByTagName("head")[0];
	head.insertBefore(script, head.firstChild) //chrome下第二个参数不能为null
	script.src = url;

	supportLoad = "onload" in script;
	onEvent = supportLoad ? "onload" : "onreadystatechange";

	script[onEvent] = function(){

		if(script.readyState && script.readyState !="loaded"){
			return;
		}
		if(script.readyState == 'loaded' && script.loaded == false){
			script.onerror();
			return;
		}
		//删除节点。
		(script.parentNode && script.parentNode.removeChild(script))&& (head.removeNode && head.removeNode(this));
		script = script[onEvent] = script.onerror = window[callbackName] = null;

	};

	script.onerror = function(){
		if(window[callbackName] == null){
			//console.log("请求超时，请重试！");
		}
		config.error && config.error();//如果有专门的error方法的话，就调用。
		(script.parentNode && script.parentNode.removeChild(script))&& (head.removeNode && head.removeNode(this));
		script = script[onEvent] = script.onerror = window[callbackName] = null;
	};

	if(timeout!= 0){
		setTimeout(function() {
			if(script && script.loaded == false){
				window[callbackName] = null;//超时，且未加载结束，注销函数
				script.onerror();
			}
		}, timeout);
	}
};
