var playerId = GetQueryString("playerId");
var playerInfo;
var playerPicHtml = "";
var surplusVotes; //剩余票数
var isClick = true; //点击投票是否可以点击
var picSrcArr = [];
getPlayerInfo(playerId, function(res) {
	if(res.errorCode == "1000") {
		playerInfo = res.data;
		//页面渲染
		$("#playerId").html(PrefixInteger(playerInfo.id, 6));
		$("#playerName").html(playerInfo.playerName);
		if(playerInfo.playerGender == "0") {
			$("#playerSex").html("男");
		} else if(playerInfo.playerGender == "1") {
			$("#playerSex").html("女");
		}
		$("#playerAge").html(playerInfo.playerAge + "岁");
		$("#playerHobbies").html(playerInfo.playerIntroduction);
		$("#playerArea").html(playerInfo.playerCity);
		$("#playerPhone").html(playerInfo.playerPhone);
		$("#monthNum").html(playerInfo.userMonthlyCredits);
		$("#totalNum").html(playerInfo.userYearlyCredits);
		for(var i = 0; i < playerInfo.picList.length; i++) {
			playerPicHtml += "<li><img src=" + imgUrl + playerInfo.picList[i].picPath + "><img src='img/personalFiles/fullScreenBtn@3x.png' class='fullScreenBtn' data-picIndex=" + i + "></li>";
			picSrcArr.push(imgUrl + playerInfo.picList[i].picPath);
		}
		$(".presonalFiles_picShow").append(playerPicHtml);
	}
});

//获取当前用户剩余票数
getPersonalCredits(function(res) {
	if(res.errorCode == "1000") {
		surplusVotes = res.data.creditsRemain;
	}
});

//点击投票
$("#voteBtn").click(function(e) {
	if(isClick) {
		isClick = false; //禁止点击
		e.stopPropagation(); //阻止事件冒泡		
		var monthNum = parseInt($("#monthNum").html()); //月票
		var totalNum = parseInt($("#totalNum").html()); //年票		
		if(surplusVotes == "0") {
			layer.open({
				content: '今日票数已用完',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			isClick = true;
		} else {
			voteOperate(playerId, function(res) {
				if(res.errorCode == "1000") { //投票成功,票数增加
					$("#monthNum").html(monthNum + 1);
					$("#totalNum").html(totalNum + 1);
					surplusVotes--;
					layer.open({
						content: '投票成功',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					isClick = true;
				}
			});
		}
	}
});

//解决手机返回回退页面不刷新
window.onpageshow = function(event) {
	if(event.persisted || window.performance && window.performance.navigation.type == 2) {
		window.location.reload();
	}
}

//点击返回
$("#backBtn").click(function() {
	window.history.back();
});

//点击全屏
$(document).on("click", ".fullScreenBtn", function() {
	var picIndex = $(this).attr("data-picindex");
	wxPreviewImage(picIndex);
});

function wxPreviewImage(picIndex) {
	var currentImgSrc = picSrcArr[picIndex];
	/*
	 *JS-SDK使用权限签名算法
	 *
	 *
	 * */
	var appId = 'wx3e23d2bbf6c2f2d1';
	var tempurl = escape(window.location.href);
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
			wx.previewImage({
				current: currentImgSrc, // 当前显示图片的http链接
				urls: picSrcArr // 需要预览的图片http链接列表
			});
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
}

//帮他拉票
$("#canvassBtn").click(function() {
	window.location.href = "shareQrcode.html?playerId=" + playerId;
});