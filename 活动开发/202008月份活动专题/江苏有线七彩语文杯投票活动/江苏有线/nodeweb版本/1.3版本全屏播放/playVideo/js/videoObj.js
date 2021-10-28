(function () {

    var videoObj = {
        mp: null,                                    // 播放实例
        /** 初始化播放器参数开始 **/
        instanceId: null,                            // 获取播放器实例ID
        playListFlag: 0,                             // 0 单媒体播放模式 1 播放列表模式
        videoDisplayMode: 1,                         // 0 按照setVideoDisplayArea()中设置的hwlt属性显示视频 1 全屏显示 2 按宽度显示（保持比例） 3 按高度显示 255 隐藏视频窗播放声音
        muteFlag: 0,                                 // 0 默认有声 1 静音
        useNativeUIFlag: 0,                          // 0 不使用本地UI 1 使用本地UI
        subtitleFlag: 0,                             // 0 默认无字幕 1 显示字幕
        videoAlpha: 0,                               // 0 完全显示 100 完全透明
        cycleFlag: 0,                                // 0 循环播放 1 单次播放
        randomFlag: 0,
        playMustArgu: { playUrl: '', left: 0, top: 0, width: 1280, height: 720 }, // 默认视频尺寸与位置
        /** 初始化播放器参数结束 **/
        volume: 0,                                   // 音量
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
        computeNum: 1
    };
    //当前时长
    videoObj.curTime = 0;
    //总时长
    videoObj.totalTime = 1200;
    //当前是否静音 0 ：有声 1：静音
    videoObj.curMuteFlag = 0;
    //当前播放速度；
    videoObj.curSpeed = 1;
    //当前播放状态
    videoObj.curStatus = "play";


    videoObj.init = function () {

        var _this = this;
        try {
            //机顶盒播放器，初始化播放器
            _this.mp = new MediaPlayer();
            this.instanceId = this.mp.getNativePlayerInstanceID();  //获取播放器实例ID
        } catch (error) {

        }
    };
    /**
     * 获取播放串
     * @param mediaCode 用来请求播放串
     */
    videoObj.getPlayUrl = function (mediaCode, callback) {
        var _this = this;
        // 获取请求地址
        var mainURL = CT.getEpgDomain();
        switch (this.BossPlatForm) {
            case 'ZTE':
                // 联通中兴
                ajax.init({
                    url: mainURL + "datajsp/play_getVodPlayUrl.jsp",
                    method: "get",
                    params: { mediaCode: mediaCode },//{"PROGID" : VODID,'PLAYTYPE':"1"},//_this.resolveMediaCode(mediacode)
                    async: false,
                    ContentType: "json",
                    success: function (data) {
                        callback && callback(data);

                    },
                    fail: function (status) {
                    }
                });
                break;
            case 'HUAWEI':
                // 联通华为
                ajax.init({
                    url: mainURL + "datajsp/play_getVodPlayUrl.jsp",
                    method: "get",
                    params: { mediaCode: mediaCode },            //{"PROGID" : VODID,'PLAYTYPE':"1"}
                    async: false,
                    ContentType: "json",
                    success: function (data) {
                        callback && callback(data);
                    },
                    fail: function (status) {
                    }
                });
                break;
            default:
                break;
        }
    };
    /**
     * 开始播放
     * @param _playUrl 播放串
     * @param _time    开始播放时间
     */
    videoObj.playVideo = function (_playUrl, _time) {
        var _this = this;
        try {

            //机顶盒开始播放视频

            _this.mp.setVideoDisplayMode(0);
            _this.mp.setVideoDisplayArea(0, 0, 1280, 720);
            _this.mp.refreshVideoDisplay();
            //alert('播放地址》》》》'+_playUrl)
            _this.mp.setSingleMedia(_playUrl);


            if (_time == 0 || _time == undefined) {

                //alert('playFromStart');
                //从头开始播放
                _this.playFromStart();
            } else {
                //alert('playByTime'+_time);
                //从指定位置播放
                _this.playByTime(1, _time, 1);
            }

        } catch (error) {
            //alert('playVideo ===>> error  '+error);
        }
        // setTimeout(function () {
            //alert(_this.mp.getMediaDuration());
            // alert(_this.mp.getMediaDuration());
        //     Page.getTotalTime()
        // }, 1000);
        //alert(_this.mp.getMediaDuration());
        //获取当前适配总时间

        //Page.getTotalTime()

    };

    /**
     * _isRight: - 向右 + 向左
     * _isPause: 是否暂停
     * 左右拖动 由：快进快退、暂停、播放 转 拖动,拖动结束 1s播放 拖动过程中 默认 流 暂停
     */
    videoObj.leftOrRight = function (_isRight, _isPause) {
        var _this = this;
        clearTimeout(_this.leftOrRightTimeout);  // 清除拖动计时器
        clearTimeout(Page.PerSecondTimeout);     // 清除每秒计时器
        _this.leftOrRightTimeout = null;
        Page.PerSecondTimeout = null;

        if (_isPause == 1) { // 流暂停
            _this.pause();
        } else {             // 流继续播
            _this.resume();
        }

        if (!_this.forwardOrRewindFlag) { //暂停转拖动
            var curTime = Number(_this.getCurrentPlayTime());
        } else {
            var curTime = _this.firstTime;
        }
        _this.forwardOrRewindFlag = true;
        //alert(curTime);
        // 设置拖动步长
        _this.setStep();

        if (_isRight == 1) {
            curTime += _this.timeStep;
        } else {
            curTime -= _this.timeStep;
        }

        //改变进度条

        if (_isRight === 1) {
            Page.forwardOrBackward("forward", curTime);
        } else {
            Page.forwardOrBackward("backward", curTime);
        }

        _this.firstTime = curTime;
        // _this.leftOrRightTimeout = setTimeout(function () {
        if (curTime <= 0) {

        } else if (curTime >= Page.totalTime) {
            // 播放下一集
            Page.nextEpisode();
        } else {
            // 播放当前
            _this.playByTime(1, curTime,0);
        }
        Page.setTimePerSecond();// 重启每秒计时
        _this.forwardOrRewindFlag = false;
        // }, 1000);

    };
    /**
     * 倍数快进快退 隐藏暂停按钮
     * _isForward =1 倍速 快进 , _isForward = -1 倍速 快退
     *
     * getPlaybackMode()
     * 播放器的当前播放模式。返回值为 JSON 字符串，其中至少包括“播放模 式”和“模式相关参数”两类信息
     * 播放模式分： NormalPlay ， Pause ， Trickmode（快进快退等）
     * 返回值为{Mode:”TrickMode”,Speed:”2x”}
     */
    videoObj.forwardOrRewind = function (_isForward) {
        var _this = this;
        if (_isForward) {
            _this.fastForward(10)
        } else {
            _this.fastRewind(10);
        }
    };
    /**
     * 暂停 播放
     */
    videoObj.stopOrPlay = function () {
        var _this = this;
        if (_this.computeNum % 2) {
            // 暂停ui变化
            Page.playState = 'play';
            _this.pause();
        } else {
            Page.playState = 'pause';
            _this.resume();
        }
        Page.playOrPause();
        _this.computeNum++;
        return
    };
    /**
     * 设置进度条样式
     */
    videoObj.setState = function () {
        switch (_state) {
            case 0: //播放态

                break;
            case 1: // 暂停

                break;
            case 2: // 快进

                break;
            default:
                break;
        }
    };
    /**
     * 声音+
     */
    videoObj.volUp = function (_num) {

        var _this = this;
        //获取当前音量
        this.volume = _this.getVolume();
        this.volume == 31 ? this.volume = 31 : this.volume = this.volume + _num;
        // 音量进度条
        Page.volumebar(this.volume);
        //设置音量
        this.setVolume(this.volume);

    };
    /**
     * 声音-
     */
    videoObj.volDown = function (_num) {

        var _this = this;
        //获取当前音量
        this.volume = _this.getVolume();
        this.volume == 0 ? this.volume = 0 : this.volume = this.volume - _num;
        // 音量进度条
        Page.volumebar(this.volume);

        //设置音量
        this.setVolume(this.volume);

    };
    /**
     * 静音
     */

    videoObj.volMute = function () {
        var _this = this;

        //获取当前是否静音   0: 设置为有声 (默认值) 1: 设置为静音
        var muteFlag = _this.getMuteFlag();

        switch (muteFlag) {
            case 0:
                // 显示静音图片
                Page.changeControlImg("mute");
                try {
                    //设置静音
                    _this.setMuteFlag(1);
                } catch (error) {

                }

                break;
            case 1:
                // 隐藏静音图片
                Page.changeControlImg();
                try {
                    //取消静音
                    _this.setMuteFlag(0);
                } catch (error) {

                }

                break;

            default:
                break;
        }


    };
    /**
     * 设置拖动步长
     */
    videoObj.setStep = function () {
        var _this = this;
        if (Page.totalTime > 600) {
            _this.timeStep = 15;
        } else {
            _this.timeStep = 5;
        }
    };
    /**
     * 从头开始播放
     */
    videoObj.playFromStart = function () {
        var _this = this;
        try {
            //机顶盒api 
            _this.mp.playFromStart();
            videoObj.curStatus = "play";
        } catch (error) {
            videoObj.curStatus = "play";
            _this.curTime = 0;
        }
    }


    /**
     *  从媒体的某个时间点开始播放
     *  @param type 1 相对时间 ，2: 绝对时间
     *  @param time  开始的时间点 
     *  @param speed 播放速度
     */

    videoObj.playByTime = function (type, time, speed) {
        var _this = this;
        type = type || 1;
        try {
            //机顶盒API
            _this.mp.playByTime(type, time, 0);
            videoObj.curStatus = "play";
        } catch (error) {
            videoObj.curStatus = "play";
            _this.curTime = time;
        }
    }

    /**
     * 获取视频当前时长
     */
    videoObj.getCurrentPlayTime = function () {
        var _this = this;
        try {
            //机顶盒API
            return _this.mp.getCurrentPlayTime();
        } catch (e) {
            if (_this.curStatus != "pause") {
                _this.curTime++;
            }
            if (_this.curTime > _this.totalTime) {
                _this.curTime = _this.totalTime;
            }
            return _this.curTime;
        }
    };
    /**
     * 获取视频总时长
     */
    videoObj.getMediaDuration = function () {
        var _this = this;
        try {
            //机顶盒API
            return _this.mp.getMediaDuration();
        } catch (e) {
            return _this.totalTime;
        }
    };
    /**
     * 获取当前是否静音   0: 设置为有声 (默认值) 1: 设置为静音
     */
    videoObj.getMuteFlag = function () {
        var _this = this;
        try {
            //机顶盒api 获取当前静音值状态
            var muteFlag = _this.mp.getMuteFlag();
        } catch (error) {
            _this.curMuteFlag = _this.curMuteFlag == 1 ? 0 : 1;
            var muteFlag = _this.curMuteFlag;
        }
        return muteFlag;
    };
    /**
     * 设置静音状态
     */
    videoObj.setMuteFlag = function (val) {
        var _this = this;

        try {
            //机顶盒api 获取当前静音值状态
            _this.mp.setMuteFlag(val);

            return val;
        } catch (error) {
            return -1;
        }

    };
    /**
     * 获取当前音量值
     */
    videoObj.getVolume = function () {
        var _this = this;

        try {
            //机顶盒api 获取当前音量值
            this.volume = _this.mp.getVolume();

            return _this.volume;
        } catch (error) {
            return _this.volume
        }

    };
    /**
    * 设置音量
    */
    videoObj.setVolume = function (val) {
        var _this = this;

        try {
            //机顶盒api 设置音量
            this.mp.setVolume(val);
            return val;
        } catch (error) {
            return -1;
        }

    };
    /**
     * 设置暂停
     */
    videoObj.pause = function (val) {
        var _this = this;

        try {
            //机顶盒api 设置暂停
            this.mp.pause();
            videoObj.curStatus = "pause";
            return "pause";
        } catch (error) {
            videoObj.curStatus = "pause";
            return -1;
        }

    };
    /**
     * 恢复播放
     */
    videoObj.resume = function (val) {
        var _this = this;

        try {
            this.mp.resume();
            videoObj.curStatus = "play";
            return "resume";
        } catch (error) {
            videoObj.curStatus = "play";
            return -1;
        }

    };
    /**
     * 快进
     */
    videoObj.fastForward = function (val) {
        var _this = this;
        try {
            //window.keyword 节流字段
            if (window.keyword) {
                window.keyword = false;
                var curTime = Number(_this.getCurrentPlayTime()) + 10;
                _this.playByTime(1, curTime,0);
                Page.setTimePerSecond('forward', curTime);
                setTimeout(function () {
                    window.keyword = true
                }, 100);
            }
        } catch (error) { }
    };
    /**
     * 快退
     */
    videoObj.fastRewind = function (val) {
        var _this = this;
        try {
            ////window.keyword 节流字段
            if (window.keyword) {
                window.keyword = false;
                var curTime = Number(_this.getCurrentPlayTime()) - 10;
                _this.playByTime(1, curTime,0);
                Page.setTimePerSecond('backward', curTime);
                setTimeout(function () {
                    window.keyword = true
                }, 100);
            }

            //return val;
        } catch (error) {
            videoObj.curSpeed = val;
            videoObj.curStatus = "trickMode";
            return -1;
        }
    };
    /**
    * 关闭播放器
    */
    videoObj.close = function () {
		var _this = this;
		CT.writeInfo("关闭视频1");
        try {
			CT.writeInfo("关闭视频2");
			if (window.navigator.appVersion.indexOf("MSIE") > -1 && window.navigator.userAgent.indexOf('DVNBrowser') > -1) {
					CT.writeInfo("关闭视频3");
					this.mp.stop();
					this.mp.setSingleMedia("");
			 } else {
				 	this.mp.setSingleMedia("");
					CT.writeInfo("关闭视频4223");
					CT.writeInfo(this.instanceId)
					_this.mp.releaseMediaPlayer(0);
					_this.mp.pause();
					_this.mp.stop();

					//this.mp.releaseMediaPlayer(this.instanceId);
					//return this.mp.releaseMediaPlayer(this.instanceId);
			}
        } catch (error) {
        }
    };
    //获取当前播放器状态
    videoObj.getCurPlayerStatus = function (callback) {
        var _this = this;
        try {
            var currPlayMode = eval("(" + _this.mp.getPlaybackMode() + ")");

            var playMode = "";
            switch (currPlayMode.PlayMode) {
                case "Pause"://暂停
                    playMode = "pause";
                    break;
                case "Normal Play": //播放状态
                    playMode = "play";
                    break;
                case "Trickmode": //快进快退状态
                    playMode = "trickMode";
                    break;
                default:
                    break;
            }
            callback && callback(playMode);
            return playMode;

        } catch (error) {
            return _this.curStatus;
        }
    };
    /**
     * 获取当前播放速配
     */
    videoObj.getCurPlayerSpeed = function () {
        var _this = this;
        try {
            var currPlayMode = eval("(" + _this.mp.getPlaybackMode() + ")");
            return currPlayMode.Speed;
        } catch (error) {
            return videoObj.curSpeed;
        }
    }

    window.videoObj = videoObj;

   
})();
