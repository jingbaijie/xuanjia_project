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

var ajaxActionUrl ="http://112.25.69.22:28080/XuanLi_Cartoon/"
var logAjaxActionUrl = "http://112.25.69.22:28080/XuanLi_Cartoon/";
//var ImageUrl = "http://112.25.69.6:28080";
var ImageUrl = "http://112.25.69.22:28080";
var urlChange="http://112.25.69.22:28080/XuanLi_Cartoon/HD/html/";
var activityUrl ="http://112.25.69.22:28080/";

function AjaxFun(option){
	this.option=null;
	this.url=null;//请求地址
	this.Async=null;//是否异步请求；
	this.method=null;//请求方式
	this.formatParams=function(data){//对传参进行编码
	     var arr=[];
		 for(var name in data){
			arr.push(encodeURIComponent(name)+"="+encodeURIComponent(data[name]));
		 }
		// arr.push(("v="+Math.random()).replace(".",""));
		 return arr.join("&");
	}
	this.params=null;
	this.contentType=null;
	this.data=null;//请求获取到的信息
    this.init=function(option){//初始化
		this.option=option||{};
		this.url=this.option.url;//请求地址
		this.Async=this.option.async||true;//是否异步请求；
		this.method=this.option.method.toUpperCase();//请求方式
		this.params=this.formatParams(this.option.params);
		this.contentType=this.option.ContentType||"";
		this.data=null;//请求获取到的信息

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
				if(xhr.status == 200){
					  option.success && option.success(eval("("+xhr.responseText+")"));
                } else {
                    option.fail && option.fail(status);
					//window.location.href="404.html";
                }
			}
		}

		  //判断请求方式
		if(this.method=="POST"){
			xhr.open(this.method,this.url,this.Async);
			//设置提交时的内容类型
			if(this.contentType==""){
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			}else{
			  xhr.setRequestHeader("Content-type",this.contentType);
			}
			xhr.send(this.params);
		}else if(this.method=="GET"){
			xhr.open(this.method,this.url+"?"+this.params,this.Async);
			xhr.send(null);
		}
	};
	
}
var ajax=new AjaxFun();
/*
    function ajax(options) {
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }

        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        }

        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
    }
    //格式化参数
    function formatParams(data) {
        var arr = [];
        for (var name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".",""));
        return arr.join("&");
    }
	*/
	//var logAjaxActionUrl = "http://192.168.2.13:8081/xjcartoonzhihui_BtopInterface/";
 //直接调用埋点数据信息
 /**
  * 
  * @param {Object} userId  用户信息
  * @param {Object} from_pid 来源
  * @param {Object} next_id 请求详情Id
  */
   function setLogInfo(userId,from_pid,next_id){
   		var params = new Object();
		//暂时设定一个定值的userid和user_ip
		var userIdStr = userId;
		if(userIdStr == "" || userIdStr == undefined || userIdStr == "undefined"){
			userIdStr = CT.getCookie("userId");
		}
		params.userId = userIdStr;
	   
	    //上一个页面
	    params.prevAction = getSubStrUrl(document.referrer) || '';
	    //当前页面地址
	    params.nextAction = getSubStrUrl(document.URL) || '';
	    params.nextId = next_id;
	    params.pid = from_pid;
	    //拼接参数串
	    var args = '';
	    for(var i in params) {
	        if(args != '') {
	            args += '&';
	        }   
	        args += i + '=' + encodeURIComponent(params[i]);
	    }
		var img=new Image(1,1);
		img.src = logAjaxActionUrl+'setLogPage?' + args;
   }
   
   

/**
    * 用户投诉意见接口
    * 
    * */
   function setAdviceInfoAll(userId,phone,fromType){
	var params ={}; 
	    var userIdStr = userId;
		if(userIdStr == "" || userIdStr == undefined || userIdStr == "undefined"){
			userIdStr = CT.getCookie("userId");
		}
		params.userId = userIdStr;
		params.phone =userIdStr;
		
    params.fromType = fromType;	
	
    var args = '';
	  for(var i in params) {
		        if(args != '') {
		            args += '&';
		        }   
		    args += i + '=' + encodeURIComponent(params[i]);
		    }
			var img=new Image(1,1);
			img.src = logAjaxActionUrl+'loginUserComplaint?' + args;
   }
   









/**
    * 上传页面日志
    * @param userId
    * @param from_pid
    * @param next_id
    */
   function setLogInfoOfAll(userId,from_pid,next_id,prePage,nextPage){
  		var params = new Object();
		//暂时设定一个定值的userid和user_ip
		var userIdStr = userId;
		if(userIdStr == "" || userIdStr == undefined || userIdStr == "undefined"){
			userIdStr = CT.getCookie("userId");
		}
		params.userId = userIdStr;
	   
	    //上一个页面
	    params.prevAction = getSubStrUrl(prePage) || '';
	    //当前页面地址
	    params.nextAction = getSubStrUrl(nextPage) || '';
	    params.nextId = next_id;
	    params.pid = from_pid;
	    
	    //拼接参数串
	    var args = '';
	    for(var i in params) {
	        if(args != '') {
	            args += '&';
	        }   
	        args += i + '=' + encodeURIComponent(params[i]);
	    }
		var img=new Image(1,1);
		img.src = logAjaxActionUrl+'setLogPage?' + args;
  }


   
   //调用平台登陆的埋点
   function setLogLoginPortal(userId,from_pid,action){
   		var params = new Object();
		//暂时设定一个定值的userid和user_ip
		params.userId = userId;
	    //params.user_ip = "8851003273568946";
	    params.pid = from_pid;
	    //当前页面地址
	    params.nextAction = action;
	    //params.next_id = next_id;
	    //拼接参数串
	    var args = ''; 
	    for(var i in params) {
	        if(args != '') {
	            args += '&';
	        }   
	        args += i + '=' + encodeURIComponent(params[i]);
	    }
	    //alert(logAjaxActionUrl+'logInterface/setlog_page?loggerType=page&' + args);
		var img=new Image(1,1);
		img.src = logAjaxActionUrl+'setLoginOrOutPortal?' + args;
   }
   /**
    * 登陆游戏的日志埋点
    * @param {Object} typeNum 0表示开始插入时间  1表示结束时间插入
    */
   
   function setLogOfGameLogin(typeNum,gameId){
   		var userId = CT.getCookie("userId");
   		if(typeNum == 0){
   			//第一次插入数据使用ajax请求,将数据信息返回
   			ajax.init({
					url:logAjaxActionUrl+"setLogGame",
					method:"get",
					params:{"userId":userId,"gameId":gameId},
					async:false,
					ContentType:"json",
					success:function(data){
						var gameLoginNum =  data.game_login_logout_id;
						CT.setCookie("gameLoginNum",gameLoginNum);
					},
					fail:function(status){
						
					}
			});
   		}else if(typeNum == 1){
   			//第二次插入数据请求,直接上传信息,采用image请求
   			setLogOfGameEnd(userId,gameId);
   		}
   	
   }
   /**
    * 退出游戏界面的日志插入
    * @param {Object} userId
    * @param {Object} gameId
    */
   function setLogOfGameEnd(userId,gameId){
   		var gameLoginNum = CT.getCookie("gameLoginNum");
   		//添加删除cook
   		CT.delCookie("gameLoginNum");
   		var params = new Object();
		//暂时设定一个定值的userid
		params.userId = userId;
		//退出游戏的id编号
	    params.gameLoginOutId = gameLoginNum;
	    params.gameId = gameId;
	    //拼接参数串
	    var args = addParams(params);
		var img= new Image(1,1);
		img.src = logAjaxActionUrl+'setLogGame?' + args;
   }
   
   /**
    * 登陆视频的日志埋点
    * 
    */
   function setLogOfVideoLogin(typeNum,videoId){
	   var userId = CT.getCookie("userId");
	   if(typeNum == 0){
		   //初始埋点日志信息
		   ajax.init({
					url:logAjaxActionUrl+"setLogVideo",
					method:"get",
					params:{"userId":userId,"videoId":videoId},
					async:false,
					ContentType:"json",
					success:function(data){
						var videoLoginNum =  data.playvideo_id;
						CT.setCookie("videoLoginNum",videoLoginNum);
					},
					fail:function(status){
						
					}
			});
	   }else if(typeNum == 1){
		   //第二次插入数据埋点
			setLogOfVideoEnd(userId,videoId);
	   }
  	}
   	/**
   	*添加视频的第二次埋点
   	*/
   	function setLogOfVideoEnd(userId,videoId){
		var videoLoginNum = CT.getCookie("videoLoginNum");
		//添加删除cook
   		CT.delCookie("videoLoginNum");
		var params = new Object();
		//暂时设定一个定值的userid
		params.userId = userId;
		//退出游戏的id编号
	    params.videoLoginOutId = videoLoginNum;
	    params.videoId = videoId;
	    //拼接参数串
	    var args = addParams(params);
		var img= new Image(1,1);
		img.src = logAjaxActionUrl+'setLogVideo?' + args;
   	}
   	
   
   
   /**
    * 截取字符串地址,发送请求的action信息
    * @param {Object} url 请求地址
    */
   function getSubStrUrl(url){
   	 return	url.substring(url.lastIndexOf("/")+1,(url.indexOf("?")==-1?url.length:url.indexOf("?")));
   }
   /**
    * 拼接字符串
    * @param {Object} params
    */
   function addParams(params){
   		var args = ''; 
	    for(var i in params) {
	        if(args != '') {
	            args += '&';
	        }   
	        args += i + '=' + encodeURIComponent(params[i]);
	    }
	    return args;
   }
   
  
   function getData(headImgId){//上传头像
	    var userId = CT.getCookie("userId");
	    ajax.init({
			url:ajaxActionUrl+"getUserInfo",
			method:"get",
			params:{"userId":userId},
			async:false,
			ContentType:"json",
			success:function(data){	
				 try {
					 	var imgUrl=data.icon.userIconPic;
						if(imgUrl==null && imgUrl==undefined && imgUrl==""){
							return;
						}else{
							var img=document.getElementById(headImgId);
							img.src=ImageUrl+imgUrl;
					}
				 } catch (e) {
			}
					
		},
			fail:function(status){
			}
		});
   }
   
   
   function isOrderFun(){//订购鉴权
		ajax.init({
			url : ajaxActionUrl+"AuthBtop",
			method : "GET",
			params : {
				"userId":userId,
			"phone":userId				
			},
			async : false,
			ContentType : "json",
			success : function(data) {
				//setLoadFun();
			    var isOrder=data;
			    CT.setCookie("isOrder",isOrder);
			
			},
			fail:function(status) {
			
			}
		 });   
   }
    


  // 家长锁鉴权接口
   //var  UserLockPwd="";
   function isUserLockFun(){//鉴权家长锁
		ajax.init({
			url : ajaxActionUrl+"userLock",
			method : "GET",
			params : {
				"userId":userId
			},
			async : false,
			ContentType : "json",
			success : function(data) {
				//setLoadFun();
			   var isUserLock=data.result;
			   //UserLockPwd = data.message;
			   CT.setCookie("isUserLock",isUserLock);
			  		   
			},
			fail:function(status) {
				
			}
		 });   
  }








   
   
   //日志埋点
      var userId = CT.getCookie("userId");
	  var pid = CT.getCookie("pid");
	  var action = GetQueryString("action");
	  var n = GetQueryString("n");
	  var cartoonId=GetQueryString("cartoonId");
	  var enterId=GetQueryString("enterId");
	  var curId="";
	  var cartoonId_1="";
function setComLogInfo(){
	   var next_id="";
		if(cartoonId != null && cartoonId != undefined && cartoonId != ""){
			next_id = cartoonId;
		}else if(n != null && n != undefined && n != "") {
			next_id ="AllContent_"+n;
		}else{
			next_id = cartoonId_1;
		}
		if(!enterId){
			from_pid = pid;
		}else{
			from_pid = pid+"_"+enterId;
		}
		setLogInfo(userId,from_pid,next_id)
}
setComLogInfo();
   

var urlNow=document.URL;
	window.addEventListener("unload",function(){//离开页面
		if(window.androidjs){
			androidjs.hiddenVideo();// 安卓视频隐藏方法
			alert("报错");
		}
	   
});

	
	
function trim(s){//去掉左右
	    return s.replace(/(^\s*)|(\s*$)/g, "");
	}

function shopOrder() {//购物车跳订购（续包月）
		var cmtokenid= "";
		 try{
			 cmtokenid= window.androidjs.getToken();
		}catch (e) {
			 cmtokenid= "未获取到";
		}
		var phoneNum= "";
		try{
			 phoneNum= window.androidjs.getPhoneNumber();
			}catch (e) {
			 phoneNum= "未获取到";
		}	
		var isVideoUrl = ajaxActionUrl+"toOrder?orderType=1&userId="+phoneNum+"&tokenId="+cmtokenid;
		var isOrder=CT.getCookie("isOrder")+"";
		 if(isOrder=='0'){
				return;
		}else{	
			if(window.androidjs){ 
			      window.androidjs.toOrderActivity(trim(StringUrl));
			      return;
		}
	}	 
}






function isBaoyuezp(){// 续包月跳转订购      0：订购      1： 未订购
	if(isOrder == "0"){
		return;//(跳转首页)
	}else{
	   toBaoyueOrder();
	   //setLogInfoOfAll(userId,CT.getCookie("pid"),curFocus.tempData.cartoonId,"cartoonDetail","tOrder");

	}
      }



function toBaoyueOrder(){// 续包月跳转订购
		/*var cmtokenid= "";
		 try{
			 cmtokenid= window.androidjs.getToken();
		}catch (e) {
			 cmtokenid= "未获取到";
		}
		var phoneNum= "";
		try{
			 phoneNum= window.androidjs.getPhoneNumber();
			}catch (e) {
			 phoneNum= "未获取到";
		}
		var times = new Date();		
		//var isVideoUrl = ajaxActionUrl+"toOrder?orderType=1&userId="+phoneNum+"&tokenId="+cmtokenid;*/
		 var isVideoUrl =urlChange + "orderPage_jsdx/orderPage201708081.html";
			try {
				if(window.androidjs){//getOrderUrl:安卓直接跳转移动支付页面
			     	window.androidjs.toOrderActivity(trim(isVideoUrl));
			}
		} catch (e) {
			     alert("未获取到");		
	    }	 
}
function toBaoyueOrdertoYiDong(){// 续包月跳转订购
		var cmtokenid= "";
		 try{
			 cmtokenid= window.androidjs.getToken();
		}catch (e) {
			 cmtokenid= "未获取到";
		}
		var phoneNum= "";
		try{
			 phoneNum= window.androidjs.getPhoneNumber();
			}catch (e) {
			 phoneNum= "未获取到";
		}
		var times = new Date();		
		var isVideoUrl = ajaxActionUrl+"toOrder?orderType=1&userId="+phoneNum+"&tokenId="+cmtokenid;
		// var isVideoUrl =urlChange + "orderPage_jsdx/orderPage201708081.html";
			try {
				if(window.androidjs){//getOrderUrl:安卓直接跳转移动支付页面
			     	window.androidjs.toOrderActivity(trim(isVideoUrl));
			}
		} catch (e) {
			     alert("未获取到");		
	    }	 
}

function toDianBOOrderOfYiDong(){
	var cmtokenid= "";
		 try{
			 cmtokenid= window.androidjs.getToken();
		}catch (e) {
			 cmtokenid= "未获取到";
		}
		var phoneNum= "";
		try{
			 phoneNum= window.androidjs.getPhoneNumber();
			}catch (e) {
			 phoneNum= "未获取到";
		}
		var times = new Date();		
		var isVideoUrl = ajaxActionUrl+"toOrder?orderType=0&userId="+phoneNum+"&tokenId="+cmtokenid;
		try {
				if(window.androidjs){//getOrderUrl:安卓直接跳转移动支付页面
			     	window.androidjs.toOrderActivity(trim(isVideoUrl));
			}
		} catch (e) {
		    	alert("未获取到");			
	    }
}
function toBDandianOrder(){// 单点跳转订购
		/*var cmtokenid= "";
		 try{
			 cmtokenid= window.androidjs.getToken();
		}catch (e) {
			 cmtokenid= "未获取到";
		}
		var phoneNum= "";
		try{
			 phoneNum= window.androidjs.getPhoneNumber();
			}catch (e) {
			 phoneNum= "未获取到";
		}
		var times = new Date();		
		//var isVideoUrl = ajaxActionUrl+"toOrder?orderType=0&userId="+phoneNum+"&tokenId="+cmtokenid;*/
		 var isVideoUrl = urlChange+"orderPage_jsdx/orderPage.html";	
			try {
				if(window.androidjs){//getOrderUrl:安卓直接跳转移动支付页面
			     	window.androidjs.toOrderActivity(trim(isVideoUrl));
			}
		} catch (e) {
		    	alert("未获取到");			
	    }	 
        }




   
/**
* 根据周 判定跳单点还是续包月
* @since 2017-08-16  13:30:00
* 该方法根据需求合理调用 不是所有订购都能用
*
*/

function isTimeSystem() {
		var myDate = new Date();
		var weekTime = myDate.getDay();
		if(weekTime == 3){
			toBDandianOrder();
			//toDianBOOrderOfYiDong();
		}else if(weekTime == 0){
			toDianBOOrderOfYiDong();
		}else if(weekTime == 6){
			toBaoyueOrdertoYiDong();
		}else{
			toBaoyueOrder();
			//toBaoyueOrdertoYiDong();	
		}	
}



function toEquity(){// 跳转会员权益
         	window.location.href =urlChange+"equity/equity.html";	
    }



/*function afterOrderSucc(){//订购成功上传日志
		//var userid = CT.getCookie("userId");
		var userId = CT.getCookie("userId");
		var productid =CT.getCookie("productid");
		var price = CT.getCookie("price");
		var pid = CT.getCookie("pid");
		var url = ajaxActionUrl+"setLogOrderSuccess?userId="+userId+"&price="+price+"&productid="+productid+"&pid="+pid;
		var img= new Image(1,1);
		img.src = url;
	}*/	


