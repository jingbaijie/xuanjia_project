
var isOn = false;
var videoPlayer = {
	mp: null,                                    // 播放实例
	/** 初始化播放器参数开始 **/
	instanceId: null,                            // 获取播放器实例ID
	playListFlag: 0,                             // 0 单媒体播放模式 1 播放列表模式
	videoDisplayMode: 1,                         // 0 按照setVideoDisplayArea()中设置的hwlt属性显示视频 1 全屏显示 2 按宽度显示（保持比例） 3 按高度显示 255 隐藏视频窗播放声音
	muteFlag: 0,                                 // 0 默认有声 1 静音
	curTime : 0,							//当前时间
	totalTime : 60,								//总时长
	useNativeUIFlag: 0,                          // 0 不使用本地UI 1 使用本地UI
	subtitleFlag: 0,                             // 0 默认无字幕 1 显示字幕
	videoAlpha: 0,                               // 0 完全显示 100 完全透明
	cycleFlag: 0,                                // 0 循环播放 1 单次播放
	randomFlag: 0,
	playMustArgu: { playUrl: '', left: 0, top: 0, width: 640, height: 526 }, // 默认视频尺寸与位置
	/** 初始化播放器参数结束 **/
	firstTime: 0,                                // 自然播放转拖动的开始时间
	forwardOrRewindFlag: false,                  // 是否在拖动中，默认为false
	timeStep: 15,                                // 左右拖动的步长(时间 默认15秒),如果影片小于10分钟，则该值为5
	leftOrRightTimeout: null,                    // 左右拖动期间视频流暂停，1秒后正常播放，拖动flag置成false
	showPerSecondTimeout: null,                  // 左右拖动正常播放1秒后进度条时间循环更新,左右拖动期间不循环进度条不循环
	volume: 50,                                // 音量
	speed: 1,			                         // 正常播放速度
	showState: 'small',                         // small-自定义小屏幕播放状态（默认），full=全屏状态 voice-音频播放
	state: 'stop', 	                         // play-播放,pause-暂停,fastForward-快进,fastRewind-快退,full-全屏,stop-停止播放
	/** 其它参数 **/
	BossPlatForm: xjDataLog.getPlatform(),      // 获取平台
    //当前是否静音 0 ：有声 1：静音
    curMuteFlag: 0,
    //当前播放速度；
    curSpeed: 1,
    //当前播放状态，play、pause、trickMode
    curStatus:"play",
	//获取到的播放串
	playUrl: '',
	isDebug: false, //日志打印开关
	isMsg: false, //日志打印开关
	option: {}, //调用视频传来数据
	smallVideoTimer: undefined, //延迟播放小视屏
	smallVideoInterval: undefined, //循环播放小视屏
	getTotalTimer: undefined, //延迟获取小视屏总时长
	totalTime: 60 * 60,           // 播放总时长
	//是否已获取总时长
	alreadyGetTotalTime: false,
	//是否开启重新播放小视频
	restartSwitch: true,
	//重新播放延时器，避免获取到的当前播放时间点达不到总时长的长度，提前延时器设置重新播放
	restartFunTimer: null,
	//小视频数据
	smallVideoInfo: null,
	init: function () {
		var _this = this;
	},
	/**
	 *获取播放串
	 * @param mediacode  节目侧code
	 * @param option
	 * {
     *     nns_cp_id: 0,//注入方CPID
	 * 	   nns_cp_video_id: "fhzq2017070100000000000100000006",//CP注入视频ID，CP注入视频ID
	 * 	   nns_video_type : "0"//0点播，1直播，2回看，3花絮， 4预告片
     * }
	 */
	getPlayUrl: function (option) {
		var _this = this;
		option = option || {};
		//获取播放串
		// loggerInfo("play: wyy ========>fullPlayObj===>>> "+JSON.stringify(option));
		interface.findPlayUrlByMediaCode({
			assetID: option.nns_ids,
			ajaxConfig: {
				async: true,
				method: "get",
			}
		}, function (data) {
			// loggerInfo('play: 获取播放串结果：' + CT.jsonToString(data), 'post')
			// loggerInfo('play:wyy ========>onDemandURL===>>> play 获取播放串：' + CT.jsonToString(data.onDemandURL), 'post');
			option.playUrl = data.onDemandURL;
			option.callback && option.callback(option)
		});
	},
	/**
	 *
	 * @param mediacode  获取播放url
	 * @param option
	 * {
	 *     top:0,
	 *     left:2,
	 * 	   height:1,
	 * 	   width:1
	 * }
	 */
	SmallPlay: function (params) {
		var _this = this;
		_this.exitPage();
		interface.findPlayUrlByMediaCode({
			assetID: params.nns_ids,
			ajaxConfig: {
				async: true,
				method: "get",
			}
		}, function (data) {
			params.playUrl = data.onDemandURL;

			// loggerInfo('wyy ======>>>>>findPlayUrlByMediaCode 11111111 begin>>>>> '+ params.playUrl);
			_this.initMediaPlay(params);
		});
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
	initMediaPlay: function (option) {
		var _this = this;
		try {
			if (CT.dataType(option.smallVideoInfo) == "object") {
				_this.smallVideoInfo = option.smallVideoInfo;
				_this.uploadVideoDetailLog({
					contentId: option.smallVideoInfo.cartoonId + "_" + option.smallVideoInfo.isFree,
					contentCname: option.smallVideoInfo.cartoonInfo.cartoonCname,
					contentEname: option.smallVideoInfo.cartoonInfo.cartoonEname,
					playId: option.smallVideoInfo.movieDetails[0].videoId + "_" + new Date().getTime(),
					playType: 1, 
					eventType: "start", 
					playName: option.smallVideoInfo.videoCname,
					spName: option.smallVideoInfo.cartoonInfo.cspInfo.cpCname,
					spId: option.smallVideoInfo.cartoonInfo.cspInfo.cpCode
				});
			} else {
				loggerInfo('smallVideoInfo is null.')
			}
		} catch (e) {
			
		}
		try {
			_this.smallVideoInterval && clearInterval(_this.smallVideoInterval);
			_this.getTotalTimer && clearTimeout(_this.getTotalTimer);
			var playListFlag = 0; //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
			var videoDisplayMode = 1; //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示
			var height = option.height;
			var width = option.width;
			var left = option.left;
			var top = option.top;
			
			window['my_mediaplay'] = new MediaPlayer(); 
			_this.mp = window['my_mediaplay'];
			// _this.instanceId = _this.mp.getNativePlayerInstanceID();  //获取播放器实例ID
			_this.mp.setVideoDisplayMode(0);
			try{
				_this.mp.setVideoDisplayArea(left, top, width, height);
				_this.mp.refreshVideoDisplay();
				_this.mp.setSingleMedia(option.playUrl);
				_this.mp.playFromStart();
			} catch(ex1) {
				_this.mediaAVPlayFlag = _this.mediaAvPley(option);
				/*if (typeof (media) === 'object' && typeof (media.AV) === 'object') {
					setOptionSuc = false;
					media.video.setPosition(left, top, width, height);
					media.AV.open(option.playUrl, "VOD");
					_this.play_timeout = setTimeout(function () {
						media.AV.play();
					}, 1000);

					function systemEvent(evt) {
						evt = evt != null && evt != undefined ? evt : window.event;
						var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
						var p2 = evt.modifiers;
						loggerInfo("zzw >>>>>>>>>smallVideo onsystemevent>>" + keyCode+"===p2==>>" + p2);
						switch (keyCode) {
							case 5205:
								break;
							case 5202:
								media.AV.play();
								break;
							case 5210:
							case 5206:
								break;
							case 5203:
								media.AV.play();
								break;
							default:
								break;
						}
					}
					document.onsystemevent = systemEvent;
					document.onkeypress = systemEvent;
					document.onirkeypress = systemEvent;
				}*/
			}
			

			// setTimeout(function() {
				// loggerInfo('wyy 444======>>>>>smallPlayStart >>>>>getVideoDisplayMode:' + _this.mp.getVideoDisplayMode() + ',_this.mp.refreshVideoDisplay() : ' + a_res + '>>' + _this.mp.getVideoDisplayLeft() + "," + _this.mp.getVideoDisplayTop() + ","  + _this.mp.getVideoDisplayWidth() + "," + _this.mp.getVideoDisplayHeight());
			// }, 2000);
			_this.getTotalTimer = setTimeout(function () {
				var totleTime = 0;
				if(!_this.mediaAVPlayFlag) {
					totleTime = _this.mp.getMediaDuration();
				} else {
					totleTime = media.AV.duration;
				}
				if (totleTime > 0 && totleTime != undefined) {
					if (totleTime > 120) {
						//大于两分钟的片单，只播放两分钟
						totleTime = 120;
					}
					_this.smallVideoInterval = setInterval(function () {
						if(!_this.mediaAVPlayFlag) {
							_this.mp.playFromStart();
						} else {
							media.AV.seek("00:00:00");//从头播放
						}
						try {
							if (CT.dataType(_this.smallVideoInfo) == "object") {
								_this.uploadVideoDetailLog({
									contentId: _this.smallVideoInfo.cartoonId + "_" + _this.smallVideoInfo.isFree,
									contentCname: _this.smallVideoInfo.cartoonInfo.cartoonCname,
									contentEname: _this.smallVideoInfo.cartoonInfo.cartoonEname,
									playId: _this.smallVideoInfo.movieDetails[0].videoId + "_" + new Date().getTime(),
									playType: 1, 
									eventType: "playing", 
									playName: _this.smallVideoInfo.videoCname,
									spName: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCname,
									spId: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCode
								});
							} else {
								loggerInfo('smallVideoInfo is null playing0.')
							}
						} catch (e) {
							
						}
					}, 1000 * (totleTime - 3));
				} else {
					//未获取到总时长默认播放两分钟
					_this.smallVideoInterval = setInterval(function () {
						if(!_this.mediaAVPlayFlag) {
							_this.mp.playFromStart();
						} else {
							media.AV.seek("00:00:00");//从头播放
						}
						try {
							if (CT.dataType(_this.smallVideoInfo) == "object") {
								_this.uploadVideoDetailLog({
									contentId: _this.smallVideoInfo.cartoonId + "_" + _this.smallVideoInfo.isFree,
									contentCname: _this.smallVideoInfo.cartoonInfo.cartoonCname,
									contentEname: _this.smallVideoInfo.cartoonInfo.cartoonEname,
									playId: _this.smallVideoInfo.movieDetails[0].videoId + "_" + new Date().getTime(),
									playType: 1, 
									eventType: "playing", 
									playName: _this.smallVideoInfo.videoCname,
									spName: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCname,
									spId: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCode
								});
							} else {
								loggerInfo('smallVideoInfo is null playing1.')
							}
						} catch (ex) {
							loggerInfo('wyy ======>>>>>smallPlay_err 11111111 >>>>> '+ ajax.jsonToString(ex));
						}
					}, 1000 * (120 - 3));
				}
			}, 3000);
		} catch (e) {
			loggerInfo('wyy ======>>>>>smallPlay_err >>>>> '+ ajax.jsonToString(e));
		}
	},
	mediaAvPley: function(option) {
		var _this = this;
		if (typeof (media) === 'object' && typeof (media.AV) === 'object') {
			var height = option.height;
			var width = option.width;
			var left = option.left;
			var top = option.top;
			media.video.setPosition(left, top, width, height);
			media.AV.open(option.playUrl, "VOD");
			_this.play_timeout = setTimeout(function () {
				media.AV.play();
			}, 1000);

			function systemEvent(evt) {
				evt = evt != null && evt != undefined ? evt : window.event;
				var keyCode = evt.which != null && evt.which != undefined && evt.which != 0 ? evt.which : evt.keyCode;
				var p2 = evt.modifiers;
				switch (keyCode) {
					case 5205:
						break;
					case 5202:
						clearTimeout(_this.play_timeout);
						media.AV.play();
						break;
					case 5210:
					case 5206:
						break;
					case 5203:
						clearTimeout(_this.play_timeout);
						media.AV.play();
						break;
					default:
						break;
				}
			}
			document.onsystemevent = systemEvent;
			return true;
		}
		return false;
	},
	//小视频播放日志
    uploadVideoDetailLog: function(param) {
        var p = new logCollParam(parseInt((new Date().getTime()) - window.entryTime) / 1000);
        p.cartoonId = param.contentId;
        p.contentCname = param.contentCname;
        p.contentEname = param.contentEname;
        // p.prevPageContentId="";
        // p.prevPageContentType= "";
        // p.prevPageEname= "";
        // p.prevPageCname= "";        
        p.playId = param.playId;
        p.playType = param.playType; 
        p.eventType = param.eventType;
        p.playName = param.playName;
        p.contentType = "video";
        p.spId = param.spId;
        p.spName = param.spName;
        p.stateTime = 0;
        xjDataLog.logCollection(ajax.jsonToString(p));
    },
	/**
	 *  小视频播放
	 * @param data
	 */
	toSmallPlay: function (playObj) {
		var _this = this;
		//是否在首页第一屏
		if (window.location.href.indexOf('web/mainPage/html/mainPage.html') != -1) {
			//在首页
			try {
				if (CT.$('main').style.top != '0px') {
					//不在第一屏
					return;
				}
			} catch (e) {
				
			}
		}
		playObj = playObj || {};
		//播放串
		playObj.playUrl && (_this.playUrl = playObj.playUrl);
		if (_this.playUrl) {


			//设置播放器尺寸和位置
			var setPlayerState = _this.setPlayerSize(playObj);
			//禁止播放器自带菜单，
			var ignorePlayermenu = _this.switchPlayerSysMenu('0');
			//设置播放器忽略遥控器按键
			var switchPlayerKey = '';//_this.switchPlayerKey('1');
			//设置播放器不处理播放结束消息
			var switchPlayerFinish = _this.switchPlayerFinish();
			//初始化播放
			var createPlayerState = _this.createPlayer(_this.playUrl);
			//开始播放
			var startPlayState = _this.startPlay();
			//打印设置播放器信息
			// interface.loggerInfo('play 设置小视频播放状态（1成功，#或0失败）aaa：smallVideo createPlayerState=' + createPlayerState + '---ignorePlayermenu=' + ignorePlayermenu + '---switchPlayerKey=' + switchPlayerKey + '---setPlayerState=' + setPlayerState + '---startPlayState=' + startPlayState, 'post');
			//隐藏小视频加载中提示图
			_this.hideSmallVideoLoadTip();
		}
	},
	/**
	 *  隐藏视频加载中提示图
	 * @param data
	 */
	smallTimerNum: 0,
	hideSmallVideoLoadTip: function(){
		var _this = this;
		//隐藏视频加载中提示图
		if (CT.$('videoLoadingImg') && CT.$('videoLoadingImg').style.visibility != 'hidden') {
			var timer = setTimeout(function () {
				clearTimeout(timer);
				try {
					var playState = _this.getPlayerState();
					// interface.loggerInfo('play ,playState:' + playState);
					if (playState == 1 || _this.smallTimerNum >= 10) {
						var timer1 = setTimeout(function(){
							CT.$('videoLoadingImg').style.visibility = 'hidden';
						},2000)
					} else {
						_this.smallTimerNum++;
						_this.hideSmallVideoLoadTip();
					}
				} catch (e) {

				}
			}, 500)
		} else if (CT.$('videoLoadingImg')) {
			CT.$('videoLoadingImg').style.visibility = 'hidden';
		}
	},
	/**
	 *  全屏播放
	 * @param data
	 */
	fullScreenPlaying: function (option) {
		var _this = this;
		_this.option = option || {};
		// 初始化播放器
		videoPlayer.createPlayer();
		_this.option.callback = function (playUrlObj) {
			var playObj = playUrlObj || {};
			//播放串
			_this.playUrl = playObj.playUrl;
			if (_this.playUrl) {
				try {
					// loggerInfo("play wyy playUrl >>>>>>>>"+_this.playUrl)
					//机顶盒开始播放视频
		
					_this.mp.setVideoDisplayMode(0);
					_this.mp.setAllowTrickmodeFlag(0);
					
					
					try{
						_this.mp.setVideoDisplayArea(0, 0, 1280, 720);
						_this.mp.refreshVideoDisplay();
						_this.mp.setSingleMedia(_this.playUrl);
					} catch(ex1) {
						// _this.mp.setVideoDisplayMode(1);
						option.left = 0,option.top = 0, option.width = 1280, option.height = 720;
						_this.mediaAVPlayFlag = _this.mediaAvPley(option);
					}

					if (!playObj.startPlayTimePoint) {
						// loggerInfo(" play from start >>>");
					} else {
						// loggerInfo('playByTime:'+playObj.startPlayTimePoint);
						//从指定位置播放
						var startObj = {
							type: 1,// 相对时间 ，2: 绝对时间
							time: playObj.startPlayTimePoint,//  开始的时间点 
							speed: 0,//播放速度
						}
						videoPlayer.playByTime(startObj);
					}
					try{
						_this.mp.setVideoDisplayArea(0, 0, 1280, 720);
						_this.mp.refreshVideoDisplay();
						//从头开始播放
						_this.playFromStart();
						// loggerInfo("play wyy setSingleMedia>>>"+_this.playUrl)
					} catch(ex) {
						option.left = 0,option.top = 0, option.width = 1280, option.height = 720;
						_this.mediaAVPlayFlag = _this.mediaAvPley(option);
					}
				} catch (e) {
					//alert('playVideo ===>> error  '+error);
				}
			}
		}
		//获取播放串
		_this.getPlayUrl(_this.option);
	},
	//轮训是否需要重新播放小视频
	restartFun: function () {
		var _this = this;
		var time = 0;
		if (_this.totalTime) {
			time = Number(_this.totalTime * 1000) - 5 * 1000;
		}
		setInterval(function () {
			var startObj = {
				type: 1,// 相对时间 ，2: 绝对时间
				time: 0,//  开始的时间点 
				speed: 0,//播放速度
			}
			videoPlayer.playByTime(startObj);
		}, time);
	},
    /**
     *  重新播放 从头开始播放
     */
	playFromStart: function () {
        var _this = this;
        try {
            //机顶盒api 
			if(!_this.mediaAVPlayFlag) {
				_this.mp.playFromStart();
			} else {
				// loggerInfo('wyy ======>>>>>startSomePosPlay_time_333 >>>>> ');
				media.AV.seek('00:00:00');
			}
            videoObj.curStatus = "play";
            _this.curTime = 0;
        } catch (e) {
            videoObj.curStatus = "play";
            _this.curTime = 0;
        }
    },

	exitPage: function () {//退出播放器
		var _this = this;
		// var __flag = false;
		if(!_this.mp && window['my_mediaplay']) {
			_this.mp = window['my_mediaplay']
		}
		// loggerInfo('videoPlay type2222>>' + Object.prototype.toString.call(_this.mp) + ">>>" + _this.mp);
		try{
			if(typeof(DVB) === 'object') {
				// DVB.stopAV(0);
				media.AV.close();
			}
		} catch(e) {}
		try {
			_this.smallVideoTimer && clearTimeout(_this.smallVideoTimer);
			if (window.navigator.userAgent.indexOf("Moz") > -1 || window.navigator.userAgent.indexOf("Coship cooca Webkit") > -1) {
				//  _this.mp && Object.prototype.toString.call(_this.mp) == "[object VodJsmp]" && _this.mp.stop();
				 _this.mp && _this.mp.stop();
			} else {
				_this.mp && _this.mp.releaseMediaPlayer(_this.mp.getNativePlayerInstanceID());
				 _this.mp && _this.mp.stop();
			}
			
			if(!_this.mp && _this.instanceId) {
				_this.mp.releaseMediaPlayer(_this.instanceId);
			} else if(!_this.mp){
				_this.mp = new MediaPlayer();
				for(var i = 0 ; i < 255; i ++ ) {
					_this.mp.releaseMediaPlayer(i);
				}
			}
		} catch (e) {
			// setTimeout(function () {
			// 	videoPlayer.exitPage();
			// }, 1000);
			// __flag = true;
		}
		// if(__flag) return;
		try {
			if (CT.dataType(_this.smallVideoInfo) == "object") {
				_this.uploadVideoDetailLog({
					contentId: _this.smallVideoInfo.cartoonId + "_" + _this.smallVideoInfo.isFree,
					contentCname: _this.smallVideoInfo.cartoonInfo.cartoonCname,
					contentEname: _this.smallVideoInfo.cartoonInfo.cartoonEname,
					playId: _this.smallVideoInfo.movieDetails[0].videoId + "_" + new Date().getTime(),
					playType: 1, 
					eventType: "end", 
					playName: _this.smallVideoInfo.videoCname,
					spName: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCname,
					spId: _this.smallVideoInfo.cartoonInfo.cspInfo.cpCode
				});
			} else {
				loggerInfo('smallVideoInfo is null end.')
			}
		} catch (e) {
			
		}
		clearInterval(_this.smallVideoInterval);
	},
	//播放器新增方法开始
	//点播播放器开始
	/*
		创建播放器；
		入参playObj根据各地需要修改。
	*/
	createPlayer: function (playObj) {
		var _this = this;
        try {
            //机顶盒播放器，初始化播放器
            _this.mp = new MediaPlayer();
            _this.instanceId = this.mp.getNativePlayerInstanceID();  //获取播放器实例ID
        } catch (e) {

        }
	},
	/*设置视频恢复播放
	*/
	startPlay: function () {
		var _this = this;
        try {
			if(!_this.mediaAVPlayFlag) {
				_this.mp.resume();
			} else {
				media.AV.play();
			}
            videoPlayer.curStatus = "play";
            return "resume";
        } catch (e) {
            videoPlayer.curStatus = "play";
            return -1;
        }
	},
	/*设置视频暂停
	*/
	pausePlay: function () {
		var _this = this;
        try {
            //机顶盒api 设置暂停
			if(!_this.mediaAVPlayFlag) {
				_this.mp.pause();
			} else {
				media.AV.pause();
			}
            videoPlayer.curStatus = "pause";
            return "pause";
        } catch (e) {
            videoPlayer.curStatus = "pause";
            return -1;
        }
	},
	/*设置视频快进、快退
	*/
	seekPlay: function () {
		var _this = this;
        try {
            //window.keyword 节流字段
            if (window.keyword) {
                window.keyword = false;
                var curTime = Number(_this.getCurPlayTime()) + 10;
				var startObj = {
					type: 1,// 相对时间 ，2: 绝对时间
					time: curTime,//  开始的时间点 
					speed: 0,//播放速度
				}
				videoPlayer.playByTime(startObj);
                Page.setTimePerSecond('forward', curTime);
                setTimeout(function () {
                    window.keyword = true
                }, 100);
            }
        } catch (e) { }
		num = num || '0';
		try {
			//全屏页标记播放器状态
			videoPlayer.curStatus = "trickMode";
		} catch (e) {

		}
	},
	/*
		断点续播
	从媒体的某个时间点开始播放
		startObj：各地需要修改
		var startObj = {
			type: 1,// 相对时间 ，2: 绝对时间
     		time: 0,//  开始的时间点 
     		speed: 0,//播放速度
		}
	*/
	startSomePosPlay: function (startObj) {
		var _this = this;
		startObj = startObj || {};
        type = startObj.type || 1;
        time = startObj.time || 0;
        speed = startObj.speed || 0;
        try {
            //机顶盒API
			// loggerInfo('wyy ======>>>>>startSomePosPlay >>>>> '+ ajax.jsonToString(startObj));
			if(!_this.mediaAVPlayFlag) {
				_this.mp.playByTime(type, time, speed);
			} else {
				var time = parseInt(startObj.time)

				
				var hour = Math.floor(time/3600);
				var minute = Math.floor((time-hour*3600)/60);
				var second = time-hour*3600-minute*60;
				hour = hour>9?hour:"0"+hour;
				minute = minute>9?minute:"0"+minute;
				second = second>9?second:"0"+second;
				var time2 = hour+":"+minute+":"+second;
				// loggerInfo('zzw ======>>>>>startSomePosPlay_time >>>444>> '+ time2);
				try{
					// media.AV.forward(2)
					media.AV.play();
					var __flag = media.AV.seek(time2);
					// loggerInfo('zzw ======>>>>>startSomePosPlay_time >>>444>> '+ time2 + " ==> res ==>" + __flag +"==>elapsed==>" + media.AV.elapsed+"==media.AV.status==>" + media.AV.status);
					// if(media.AV.elapsed == 0) {
					// 	__flag = media.AV.seek(time);
					// 	loggerInfo('zzw ======>>>>>startSomePosPlay_time >>>555>> '+ time + " ==> res ==>" + __flag +"==>elapsed==>" + media.AV.elapsed);
					// }
					// _this.mp.playByTime(type, time, speed);
				} catch(e) {
					// loggerInfo('zzw ======>>>>>startSomePosPlay_time_err >>>');
				}
			}
            videoObj.curStatus = "play";
        } catch (e) {
            videoObj.curStatus = "play";
            _this.curTime = time;
        }
	},
	/*
		获取当前播放时间，获取成功，返回当前播放时间，格式：时分秒（00：00：00）；失败，返回#。
	*/
	getCurPlayTime: function () {
		var _this = this;
        try {
            //机顶盒API
			if(!_this.mediaAVPlayFlag) {
				// loggerInfo('wyy ======>>>>>getCurPlayTime >>>>> '+ _this.mp.getCurrentPlayTime());
				return _this.mp.getCurrentPlayTime();
			} else {
				// loggerInfo('wyy ======>>>>>getCurPlayTime media.AV.elapsed>>>>> '+ media.AV.elapsed);
				return media.AV.elapsed;
			}
        } catch (e) {
            if (_this.curStatus != "pause") {
                _this.curTime++;
            }
            if (_this.curTime > _this.totalTime) {
                _this.curTime = _this.totalTime;
            }
			// loggerInfo('wyy ======>>>>>getCurPlayTime _this.curTime>>>>> '+ _this.curTime);
            return _this.curTime;
        }
	},
	/*
		获取播放器模式对象
	*/
	getPlaybackMode: function () {
		var _this = this;
		var result = eval("(" + _this.mp.getPlaybackMode() + ")");
		return result;
	},
	/*
		获取播放器配速
	*/
	getCurPlayerSpeed: function () {
		var _this = this;
		if(!_this.mediaAVPlayFlag) {
			_this.curSpeed = _this.getPlaybackMode().Speed;
		} else {
			_this.curSpeed = media.AV.speed;
		}

		return _this.curSpeed;
	},
	/*
		获取视频播放状态
	*/
	getPlayerState: function (callback) {
		var _this = this;
        try {
			var currPlayMode = "";
			if(!_this.mediaAVPlayFlag) {
				 currPlayMode = _this.getPlaybackMode();
				} else {
					currPlayMode = {};
					currPlayMode.PlayMode = media.AV.status;
				}
				switch (currPlayMode.PlayMode) {
					case "Pause"://暂停
					case "pause"://暂停
						_this.curStatus = "pause";
						break;
					case "Normal Play": //播放状态
					case "play": //播放状态
						_this.curStatus = "play";
						break;
					case "Trickmode": //快进快退状态
					case "forward": //快进快退状态
					case "backward": //快进快退状态
						_this.curStatus = "trickMode";
						break;
					default:
						break;
				}
				callback && callback(_this.curStatus);
				return _this.curStatus;
		} catch (e) {
			return _this.curStatus;
		}
			
	},
	/*
		获取当前片源总时长
	*/
	getVideoDuration: function () {
		var _this = this;
		try {
			
			if(!_this.mediaAVPlayFlag) {
				_this.totalTime = Number(_this.mp.getMediaDuration());
			} else {
				_this.totalTime = Number(media.AV.duration);
			}
			return _this.totalTime;
		} catch (e) {
			return _this.totalTime;
		}
	},
	/*
		设置静音状态
	*/
	setMuteFlag: function (val) {
		var _this = this;
        try {
            //机顶盒api 获取当前静音值状态
			if(!_this.mediaAVPlayFlag) {
				_this.mp.setMuteFlag(val);
			} else {
				media.sound.mute();
			}

            return val;
        } catch (e) {
            return -1;
        }
	},
	/*
		获取当前是否静音   0: 设置为有声 (默认值) 1: 设置为静音
	*/
	getMuteFlag: function () {
		var _this = this;
        try {
            //机顶盒api 获取当前静音值状态
			var muteFlag = 0;
			if(!_this.mediaAVPlayFlag) {
				muteFlag = _this.mp.getMuteFlag();
			} else {
				muteFlag = media.sound.isMute;
			}
        } catch (e) {
            _this.curMuteFlag = _this.curMuteFlag == 1 ? 0 : 1;
            var muteFlag = _this.curMuteFlag;
        }
        return muteFlag;
	},
	/*
		设置音量
	*/
	setVolume: function (val) {
		var _this = this;
        try {
            //机顶盒api 设置音量
			if(!_this.mediaAVPlayFlag) {
				_this.mp.setVolume(val);
			} else {
				val = Number(val);
				media.sound.value = val >= 100? 100 : val <= 0 ? 0:val;
			}
            return val;
        } catch (e) {
            return -1;
        }
	},
	/*
		获取音量
	*/
	getVolume: function () {
		var _this = this;
        try {
            //机顶盒api 获取当前音量值
			if(!_this.mediaAVPlayFlag) {
				this.volume = _this.mp.getVolume();
			} else {
				this.volume = media.sound.value;
			}
            return _this.volume;
        } catch (e) {
            return _this.volume
        }
	},
	//音量加计
	/*
		设置音量，音量加。1 为加，-1 为减。
	*/
	volumeStep: 5,
	changeVolume: function (num) {
		var _this = this;
		num = num || 1;
		//获取当前音量
		var nowVolume = _this.getVolume();
		if (num < 0) {
			//音量减
			nowVolume -= _this.volumeStep;
			nowVolume = nowVolume < 0 ? 0 : nowVolume;
			_this.setVolume(nowVolume);
		}else{
			//音量加
			nowVolume += _this.volumeStep;
			nowVolume = nowVolume > 32 ? 32 : nowVolume;
			_this.setVolume(nowVolume);
		}
	},
	//转化时长格式 时分秒（00：00：00）为秒
	transformTime: function (timeStr) {
		var _this = this;
		timeStr = timeStr || '';
		timeStr = (timeStr + "");
		var timeArr = [];
		if (timeStr.indexOf(':') > -1) {
			timeArr = timeStr.split(':');
		} else if (timeStr.indexOf('：') > -1) {
			timeArr = timeStr.split('：');
		}
		var time = 0;
		try {
			time += (+timeArr[0]) * 3600;
			time += (+timeArr[1]) * 60;
			time += (+timeArr[2]);
		} catch (e) {

		}
		return time;
	},


	//点播播放器结束
	//播放器新增方法结束
};

window.addEventListener("unload", function () {
	videoPlayer.exitPage();
	return;
	var dom = CT.$('videoLoadingImg');
	if (dom) {
		document.getElementsByTagName('body')[0].removeChild(dom);
	}
});
/*
 window.addEventListener("unload", function () {
	videoPlayer.exitPage();
	return;
	var dom = CT.$('videoLoadingImg');
	if (dom) {
		document.getElementsByTagName('body')[0].removeChild(dom);
	}
});
*/