
function encode(msg){
	var string = "";
	for(var  i = 0; i < msg.length;i++)string += (msg.charAt(i).charCodeAt() / 1 + 100000 + "").slice(1);
	return string;
}


function decode(code){
	for(var i=0,msg=[];i<code.length;i+=5){
		var uc=code.substr(i,5);
		msg.push(String.fromCharCode(uc));
	}
	return msg.join("");
}
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
		 return arr.join("&");
	}
	this.params=null;
	this.paramsStr=null;
	this.contentType=null;
	this.data=null;//请求获取到的信息
    this.init=function(option){//初始化
		this.option=option||{};
		this.url=this.option.url;//请求地址
		this.Async=this.option.async||true;//是否异步请求；
		this.method=this.option.method.toUpperCase();//请求方式
		this.params=this.formatParams(this.option.params);
		this.paramsStr = this.option.paramsStr;
		this.contentType=this.option.ContentType||"";
		this.data=null;//请求获取到的信息

		//创建对象
		//console.log(this.formatParams)
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
		}else if(this.method=="POSTSTR"){
			xhr.open("POST",this.url,this.Async);
			//设置提交时的内容类型
			if(this.contentType==""){
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			}else{
			  xhr.setRequestHeader("Content-type",this.contentType);
			}
			xhr.send(this.paramsStr);
		}else if(this.method=="GETSTR"){
			xhr.open("GET",this.url,this.Async);
			xhr.send(null);
		}
	};
}
var ajax=new AjaxFun();



