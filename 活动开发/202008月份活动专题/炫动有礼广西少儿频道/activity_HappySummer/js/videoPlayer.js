var isOn = false;
var videoPlayer = {
	mp: null,
	flag: null,
	isDebug: false, //日志打印开关
	isMsg: false, //日志打印开关
	option: {}, //传来数据
	isFullPlay: false, //是否是全屏
	startTimebarTimeout: null, // 获取总时长
	totalTime: null, // 播放总时长
	init: function () {
		var _this = this;
	}(),


	/**
	 *  小视频播放
	 * @param data
	 */
	SmallPlay: function (data) {
		var _this = this;
		try {
			_this.initMediaPlay(data);
		} catch (e) {}
	},
	/**
	 * 小视频播放初始化
	 * @param option｛
	 * 			top:0,
	 * 			left:0,
	 * 			height:0,
	 * 			width:0,
	 * 			playUrl: 播放串
	 * ｝
	 */
	initMediaPlay: function (data) {
		var _this = this;
		if (data) {
			var urlStr = "rtsp://10.2.2.51:13810/" + data.playUrl;
			var arr = urlStr.match(/(rtsp|http)/g);
			if (arr.length > 1) {
				urlStr = urlStr.replace("rtsp:\/\/10.2.2.51:13810\/", "");
				try {
					try {
						var soc_type = iPanel.ioctlRead("ro.di.soc_type");
						//存在数组中，直接走接口播放地址；
						var scoTypeArr = ["HISI3716CV200", "HISI3798CV200", "HISI3798MV200", "HISI3798MV200H"];
						if (scoTypeArr.indexOf(soc_type) < 0) {
							var assetid = urlStr.match(/(\/tvjoy\w*)/g)[0];
							urlStr = "http://10.2.2.223:9191/vod" + assetid + "/index.m3u8";
						}
					} catch (error) {}
					media.AV.stop();
					media.AV.close();
					media.video.setPosition(data.left, data.top, data.width, data.height);
					interface.loggerInfo("wyy >>>> initMediaPlay >>>"+orderJs.getUserId()+">>>>>>soc_type:"+soc_type+">>>>PlayUrl:"+urlStr,"post")
					media.AV.open(urlStr, "HTTP");
					media.video.fullScreen(0);
					document.onsystemevent = g;
					document.onkeypress = g;
					document.onirkeypress = g;
					function g(evt) {
						e = evt ? evt : window.event;
						var keycode = e.which ? e.which : e.keyCode;
						switch (keycode) {
							// iPanel 消息
							case 5202: //准备播放
							case 5209:
								media.AV.play();
								break;
							case 5210:
								if(document.URL.indexOf("playVideo")>-1){
									Page.nextEpisode();
								}
								break;
							default:
								break;
						}
					}
				} catch (error) {

				}
			} else {
				try {
					media.AV.stop();
					media.AV.close();
					VOD.changeServer("cisco_dmx", "ip");
					interface.loggerInfo( "wyy >>>> initMediaPlay >>> cisco_dmx ip>> userid:"+orderJs.getUserId()+">>>>>>soc_type:"+soc_type+">>>>PlayUrl:"+urlStr,"post")
					var bl = media.AV.open(urlStr, 8);
					media.video.setPosition(data.left, data.top, data.width, data.height);
					media.video.fullScreen(0);
					media.AV.play();
					//小视频初次黑屏播放问题
					try {
						setTimeout(function () {
							media.AV.seek("00:00:10");
						}, 1000);
					} catch (e) {}
				} catch (e) {}
			}
		} else {

		}
	},
	restartFun: function () {
		var _this = this;
		var t = '';
		if (_this.totalTime * 1000 < _this.option.t) {
			t = Number(_this.totalTime * 1000) - 5 * 1000;
		} else {
			t = _this.option.t;
		}
		setInterval(function () {
			_this.mp.playByTime(1, 0);
		}, t);
	},
	getTotalTime: function () {
		var _this = this;
		try {
			_this.totalTime = Number(_this.mp.getMediaDuration());
		} catch (e) {}

		if (_this.totalTime !== undefined && typeof _this.totalTime != 'undefined' && _this.totalTime != 0) {
			// 开始计时
			if (_this.startTimebarTimeout != null) {
				clearTimeout(_this.startTimebarTimeout);
				_this.startTimebarTimeout = null;
				_this.restartFun();
			} else {
				_this.restartFun();
			}
		} else {
			_this.startTimebarTimeout = setTimeout(function () {
				_this.getTotalTime();
			}, 200);
		}
	},

	exitPage: function () { //退出播放器
		var _this = this;
		try {
			DVB.stopAV(0);
			media.AV.close();
		} catch (e) {
			
		}
	},

	writeInfo: function (msg) {
		var _this = this;
		if (_this.isDebug) {
			if (_this.isMsg) {
				var el = document.createElement("div");
				el.style.position = "absolute";
				el.style.top = "200px";
				el.style.width = "600px";
				el.style.left = "100px";
				el.style.color = "red";
				el.style.fontSize = "20px";
				el.style.background = "rgba(0,0,0,0.8)";
				el.style.zIndex = "111111";
				el.innerHTML = msg;
				el.id = "msg1"
				document.body.appendChild(el);
				_this.isMsg = false;
				return;
			}
			var el = document.getElementById("msg1");
			el.append(el.innerHTML + "；" + msg);
		}
	}
};
window.addEventListener("unload", function () {
	videoPlayer.exitPage();
});
