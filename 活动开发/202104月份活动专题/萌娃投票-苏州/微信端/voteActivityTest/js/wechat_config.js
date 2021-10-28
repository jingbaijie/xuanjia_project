/*
* 创建时间：20180315
* 作用微信jssdk 鉴权及页面授权
* 注意！！！！
 *         1.在需要调用JS接口的页面引入如下JS文件，（支持https）：http://res.wx.qq.com/open/js/jweixin-1.2.0.js
 *         2.应用此段js 前必须已用jq.js 及jq.cookie.js两个js
*
* 用户信息存入cookie 中
*       $.cookie("weChatId");
        $.cookie("nickname");
        $.cookie("sex");
        $.cookie("language");
        $.cookie("city");
        $.cookie("province");
        $.cookie("country");
        $.cookie("headimgurl");
        $.cookie("privilege");
*
* 在引用的js 相关页面可以直接用全局变量
*  weChatId
*  nickname //用户名
   sex //用户性别
   language //用户语言
   city //用户城市
   province //用户省份
   country //用户国家
   headimgurl //用户头像
   privilege //用户特权
*
*
* */

/* 封装jq的获取当前url参数的方法 $.getUrlParam("code") */
(function($) {
	$.getUrlParam = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	}
})(jQuery);
/*
    JSSDK鉴权
* 通过config接口注入权限验证配置
*
*
* */
var timestamp = "";
var tempurl = escape(window.location.href);
var jsapi_ticket = '';
var appId = 'wx3e23d2bbf6c2f2d1';
var noncestr = '';
var signature = ''; //http://180.96.20.178:9095/xuanjia_weixin_interface/weixin/getSignature?url=www.baidu.com
//保存TV端用户号
if($.getUrlParam("userId")) {
	$.cookie('TVUserId', $.getUrlParam("userId"));
}
/*
 *JS-SDK使用权限签名算法
 *
 *
 * */
$.get('https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/weixin/getSignature?url=' + tempurl, function(res) {
	signature = res.signature; //签名
	timestamp = res.timeStmp; //签名的时间戳
	noncestr = res.nonceStr; //生成签名的随机串
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: appId, // 必填，公众号的唯一标识
		timestamp: timestamp, // 必填，生成签名的时间戳
		nonceStr: noncestr, // 必填，生成签名的随机串
		signature: signature, // 必填，签名，见附录1
		jsApiList: [
			'checkJsApi',
			'startRecord',
			'stopRecord',
			'translateVoice',
			'previewImage',
			'playVoice',
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone',
			'hideMenuItems',
			'showMenuItems',
			'hideAllNonBaseMenuItem',
			'showAllNonBaseMenuItem',
			'onVoiceRecordEnd',
			'onVoicePlayEnd',
			'pauseVoice',
			'stopVoice',
			'uploadVoice',
			'downloadVoice',
			'chooseImage',
			'uploadImage',
			'downloadImage',
			'getNetworkType',
			'openLocation',
			'getLocation',
			'hideOptionMenu',
			'showOptionMenu',
			'closeWindow',
			'scanQRCode',
			'chooseWXPay',
			'openProductSpecificView',
			'addCard',
			'chooseCard',
			'openCard'
		]
	});
	wx.ready(function() {
		// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
		// alert("chenggong")
	});

	wx.error(function(res) {
		// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
		// alert("验证失败")
	});
	//alert("res11");
	/* wx.checkJsApi({
	     jsApiList: ['closeWindow'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
	     success: function(res) {
	        // alert("res");
	         //alert(res);
	         console.log("----------------------");
	         console.log(res);
	         // 以键值对的形式返回，可用的api值true，不可用为false
	         // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
	     }
	 });*/

});

/*定义全局参数*/
var weChatId = ""; //用户的openId
var weChatIAccessToken = ""; //
var weChatIRefresh_token = "";
var urlLocation = window.location.href;
urlLocation = encodeURI(urlLocation);

var codeOAuth = $.getUrlParam("code");
var stateCheck = $.getUrlParam("state");
if(!(codeOAuth && stateCheck)) {

	setTimeout(function() {
		//跳转鉴权获取code 及state
		window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e23d2bbf6c2f2d1&redirect_uri=" + urlLocation + "&response_type=code&scope=snsapi_userinfo&state=drnTest#wechat_redirect";
	}, 10)
} else {
	//通过code换取网页授权access_token及openId 每个code 仅能被调用一次
	$.get('https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/activity/oauth2Access?code=' + codeOAuth, function(res) {

		//如果code 正确获取到用户参数
		if(JSON.parse(res).openid) {

			weChatId = JSON.parse(res).openid;
			weChatIAccessToken = JSON.parse(res).access_token;
			weChatIRefresh_token = JSON.parse(res).refresh_token;
			$.cookie("weChatId", weChatId);
			$.cookie("weChatIAccessToken", weChatIAccessToken);
			$.cookie("weChatIRefresh_token", weChatIRefresh_token);

		} else {
			//如果code错误 获取不到用户信息，默认先从cookie中取
			weChatId = $.cookie("weChatId");
			weChatIAccessToken = $.cookie("weChatIAccessToken");
			weChatIRefresh_token = $.cookie("weChatIRefresh_token");
			/*如果cookie中没有获取过也就是没哟鉴权成功过就跳鉴权页面重新获取code*/
			if(weChatId) {
				urlLocation = window.location.host + window.location.pathname;
				window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3e23d2bbf6c2f2d1&redirect_uri=" + urlLocation + "&response_type=code&scope=snsapi_userinfo&state=drnTest#wechat_redirect";
			}
		}

		// /https://api.weixin.qq.com/sns/auth?access_token=ACCESS_TOKEN&openid=OPENID
		/*
		 *
		 *检验授权凭证（access_token）是否有效
		 *
		 * */
		$.get("https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/activity/snsAuth?access_token=" + weChatIAccessToken + "&openid=" + weChatId, function(res) {

			if(JSON.parse(res).errmsg == "ok") { //access_token有效
				weChatUserinfo(); //获取用户基本信息
			} else {
				// https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=APPID&grant_type=refresh_token&refresh_token=REFRESH_TOKEN
				/*
				 * 刷新access_token
				 */
				$.get('https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/activity/oauth2RefreshToken?refresh_token=' + weChatIRefresh_token, function(res) {
					weChatIAccessToken = JSON.parse(res).access_token;
					weChatUserinfo();
				})

			}
		})

	})

}
var nickname = ""; //用户名
var sex = ""; //用户性别
var language = ""; //用户语言
var city = ""; //用户城市
var province = ""; //用户省份
var country = ""; //用户国家
var headimgurl = ""; //用户头像
var privilege = ""; //用户特权
/*获取用户基本信息*/
function weChatUserinfo() {
	$.get('https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/activity/weChatUserinfo?access_token=' + weChatIAccessToken + '&openid=' + weChatId + '&lang=zh_CN', function(res) {
		res = JSON.parse(res);
		weChatId = res.openid;
		nickname = res.nickname;
		sex = res.sex;
		language = res.language;
		city = res.city;
		province = res.province;
		country = res.country;
		headimgurl = res.headimgurl;
		privilege = res.privilege;
		$.cookie("weChatId", weChatId);
		$.cookie("nickname", nickname);
		$.cookie("sex", sex);
		$.cookie("language", language);
		$.cookie("city", city);
		$.cookie("province", province);
		$.cookie("country", country);
		$.cookie("headimgurl", headimgurl);
		$.cookie("privilege", privilege);
		//http://180.96.20.178:9095/xuanjia_weixin_interface_XJ/user/getUserInfo?
		// wechatNum=123&name=jaker&sex=1&language=zh_ch
		// &city=南京&province=江苏省&country=中国&headImageUrl=aa/bb&phoneNum=15656000757&iptvId=rt43221ssf&firstBabyId=3&secondBabyId=19
		setandgetUserInfo();
	})
}
/*
 * 上传用户基本信息
 * */
function setandgetUserInfo() {
	$.get("https://cibn.tvjoy.cn/xuanjia_weixin_interface_XJ/user/getUserInfo?wechatNum=" + weChatId + "&name=" + nickname + "&sex=" + sex +
		"&language=" + language + "&city=" + city + "&province=" + province + "&country=" + country + "&headImageUrl=" + headimgurl,
		function(res) {

		}
	)
}