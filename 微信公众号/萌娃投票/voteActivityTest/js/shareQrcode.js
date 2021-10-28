$(function() {
	var playerId = GetQueryString("playerId");
	var playerInfo;
	var playerPicArr = [];
	getPlayerInfo(playerId, function(res) {
		if(res.errorCode == "1000") {
			playerInfo = res.data;
			//页面渲染
			$("#playerId").html(PrefixInteger(playerInfo.id,6));
			$("#playerName").html(playerInfo.playerName);
			$("#introductionShow").html(playerInfo.playerIntroduction);
			$("#babyPic").attr("src", "" + imgUrl + playerInfo.picList[0].picPath + "");
			for(var i = 0; i < playerInfo.picList.length; i++) {
				playerPicArr.push(playerInfo.picList[i].picPath);
			}
			lunboPic();
		}
	});

	function lunboPic() {
		//最萌宝贝轮播图
		var babyImg = 1;
		setInterval(function() {
			if(babyImg > playerPicArr.length) {
				babyImg = 1;
			}
			$("#babyPic").attr("src", "" + imgUrl + playerPicArr[babyImg - 1] + "")
			babyImg++;
		}, 1000);
	}

	//生成二维码
	var qrcode = new QRCode("qrcodePic", {
		text: "https://cibn.tvjoy.cn/WeChatXHB/html/voteActivityTest/sharePersonalFiles.html?playerId=" + playerId,
		render: "canvas", //渲染方式指定canvas方式
		typeNumber: -1, //计算模式
		colorDark: "#000000",
		colorLight: "#ffffff",
		correctLevel: QRCode.CorrectLevel.H
	});
	var canvas = document.getElementsByTagName('canvas')[0];
	var img = convertCanvasToImage(canvas);
	$('#qrcodeImg').append(img); // 添加DOM
	//从 canvas 提取图片 image  
	function convertCanvasToImage(canvas) {
		//新建Image对象
		var image = new Image();
		// canvas.toDataURL 返回的是一串Base64编码的URL
		image.src = canvas.toDataURL("image/png");
		return image;
	}

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
			//自定义分享
			wx.onMenuShareTimeline({
				title: '江苏有线最萌宝贝就是我投票二维码分享', // 分享标题
				//				link: 'https://cibn.tvjoy.cn/WeChatXHB/html/voteActivity/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: '', // 分享图标
				success: function() {
					// 用户点击了分享后执行的回调函数
				}
			});
			wx.onMenuShareAppMessage({
				title: '江苏有线最萌宝贝就是我投票二维码分享', // 分享标题
				desc: '江苏有线最萌宝贝就是我投票二维码分享', // 分享描述
				//				link: 'https://cibn.tvjoy.cn/WeChatXHB/html/voteActivity/index.html', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
				imgUrl: '', // 分享图标
				type: 'link', // 分享类型,music、video或link，不填默认为link
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
				success: function() {
					// 用户点击了分享后执行的回调函数
				}
			});
			wx.onMenuShareQQ({
				title: '江苏有线最萌宝贝就是我投票二维码分享', // 分享标题
				desc: '江苏有线最萌宝贝就是我投票二维码分享', // 分享描述
				//				link: 'https://cibn.tvjoy.cn/WeChatXHB/html/voteActivity/index.html', // 分享链接
				imgUrl: '', // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareWeibo({
				title: '江苏有线最萌宝贝就是我投票二维码分享', // 分享标题
				desc: '江苏有线最萌宝贝就是我投票二维码分享', // 分享描述
				//				link: 'https://cibn.tvjoy.cn/WeChatXHB/html/voteActivity/index.html', // 分享链接
				imgUrl: '', // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
			});
			wx.onMenuShareQZone({
				title: '江苏有线最萌宝贝就是我投票二维码分享', // 分享标题
				desc: '江苏有线最萌宝贝就是我投票二维码分享', // 分享描述
				//				link: 'https://cibn.tvjoy.cn/WeChatXHB/html/voteActivity/index.html', // 分享链接
				imgUrl: '', // 分享图标
				success: function() {
					// 用户确认分享后执行的回调函数
				},
				cancel: function() {
					// 用户取消分享后执行的回调函数
				}
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
});