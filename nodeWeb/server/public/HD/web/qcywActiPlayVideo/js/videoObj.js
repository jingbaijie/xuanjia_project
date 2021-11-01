(function () {
    var videoObj = { };
    videoObj.init = function () {
        var _this = this;
    };
    /**
     * 获取播放串
     * @param mediaCode 用来请求播放串
     */
    videoObj.getPlayUrl = function (mediaCode, callback) {
        var _this = this;
        // 获取请求地址
        var mainURL = CT.getEpgDomain();
        switch (videoPlayer.BossPlatForm) {
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
     * _isRight: - 向右 + 向左
     * _isPause: 是否暂停
     * 左右拖动 由：快进快退、暂停、播放 转 拖动,拖动结束 1s播放 拖动过程中 默认 流 暂停
     */
    videoObj.leftOrRight = function (_isRight, _isPause) {
        var _this = this;

        clearTimeout(videoPlayer.leftOrRightTimeout);  // 清除拖动计时器
        clearTimeout(Page.PerSecondTimeout);     // 清除每秒计时器
        videoPlayer.leftOrRightTimeout = null;
        Page.PerSecondTimeout = null;

        if (_isPause == 1) { // 流暂停
            _this.pause();
        } else {             // 流继续播
            _this.resume();
        }

        if (!videoPlayer.forwardOrRewindFlag) { //暂停转拖动
            var curTime = Number(_this.getCurrentPlayTime());
        } else {
            var curTime = videoPlayer.firstTime;
        }
        videoPlayer.forwardOrRewindFlag = true;

        // 设置拖动步长
        _this.setStep();

        if (_isRight == 1) {
            curTime += videoPlayer.timeStep;
        } else {
            curTime -= videoPlayer.timeStep;
        }
        //改变进度条
        if (_isRight === 1) {
            Page.forwardOrBackward("forward", curTime);
        } else {
            Page.forwardOrBackward("backward", curTime);
        }

        videoPlayer.firstTime = curTime;
        videoPlayer.leftOrRightTimeout = setTimeout(function () {
            if (curTime <= 0) {

            } else if (curTime >= videoPlayer.totalTime) {
                // 播放下一集
                Page.nextEpisode();
            } else {
                // 播放当前
                var startObj = {
                    type: 1,// 相对时间 ，2: 绝对时间
                    time: curTime,//  开始的时间点 
                    speed: 0,//播放速度
                }
                videoPlayer.startSomePosPlay(startObj);
            }
            Page.setTimePerSecond();// 重启每秒计时
            videoPlayer.forwardOrRewindFlag = false;
            clearTimeout(videoPlayer.leftOrRightTimeout);  // 清除拖动计时器
            videoPlayer.leftOrRightTimeout = null;
        }, 1000);

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
        if (!videoPlayer.forwardOrRewindFlag) {
            var currPlayMode = _this.getCurPlayerStatus();
            switch (currPlayMode) {
                case "pause":
                case "play":
                    if (Page.PerSecondTimeout !== null) {
                        clearTimeout(Page.PerSecondTimeout);
                        Page.PerSecondTimeout = null;
                    }
                    if (_isForward == 1) {
                        _this.fastForward(2);
                    } else {
                        _this.fastRewind(-2);
                    }
                    Page.setTimePerSecond();// 重启每秒计时
                    break;
                case "trickMode":
                    if (Page.PerSecondTimeout !== null) {
                        clearTimeout(Page.PerSecondTimeout);
                        Page.PerSecondTimeout = null;
                    }
                    var curSpeed = parseInt(_this.getCurPlayerSpeed());
                    if (_isForward == 1) {
                        if (curSpeed > 0 && curSpeed < 32) {
                            curSpeed *= 2;
                        } else {
                            curSpeed = 2;
                        }
                        _this.fastForward(curSpeed);
                    } else {
                        if (curSpeed < 0 && curSpeed > -32) {
                            curSpeed *= 2;
                        } else {
                            curSpeed = -2;
                        }
                        _this.fastRewind(curSpeed);
                    }
                    Page.setTimePerSecond();// 重启每秒计时
                    break;
                default:
                    break;
            }
        }
    };
    /**
     * 暂停 播放
     */
    videoObj.stopOrPlay = function (what) {
        var _this = this;
        if (!videoPlayer.forwardOrRewindFlag) {
            var currPlayMode = _this.getCurPlayerStatus();
            switch (currPlayMode) {
                case "play":            //自然播放转暂停
                    // 暂停ui变化
                    Page.playState = 'play';
                    Page.playOrPause();
                    //暂停
                    _this.pause();
                    break;
                case "pause":                  //当前为暂停 ,转播放
                case "trickMode":              //当前为快进快退 ，转播放
                    // 播放ui变化
                    Page.playState = 'pause';
                    Page.playOrPause();
                    //重新播放
                    _this.resume();
                    break;
                default:
                    break;
            }
        }
        if (what == 'backBtn') {
            Page.hiddenExitUI();
        }
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
        videoPlayer.volume = _this.getVolume();
        videoPlayer.volume == 100 ? videoPlayer.volume = 100 : videoPlayer.volume = videoPlayer.volume + _num;
        // 音量进度条
        Page.volumebar(videoPlayer.volume);
        //设置音量
        this.setVolume(videoPlayer.volume);
    };
    /**
     * 声音-
     */
    videoObj.volDown = function (_num) {
        var _this = this;
        //获取当前音量
        videoPlayer.volume = _this.getVolume();
        videoPlayer.volume == 0 ? videoPlayer.volume = 0 : videoPlayer.volume = videoPlayer.volume - _num;
        // 音量进度条
        Page.volumebar(videoPlayer.volume);
        //设置音量
        this.setVolume(videoPlayer.volume);

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
        if (videoPlayer.totalTime > 600) {
            videoPlayer.timeStep = 15;
        } else {
            videoPlayer.timeStep = 5;
        }
    };
    /**
     * 从头开始播放
     */
    videoObj.playFromStart = function () {
        var _this = this;
        try {
            //机顶盒api 
            videoPlayer.startSomePosPlay();
            videoPlayer.curStatus = "play";
        } catch (error) {
            videoPlayer.curStatus = "play";
            videoPlayer.curTime = 0;
        }
    }
    /**
     * 获取视频当前时长
     */
    videoObj.getCurrentPlayTime = function () {
        var _this = this;
        try {
            //机顶盒API
            return videoPlayer.getCurPlayTime();
        } catch (e) {
            if(videoPlayer.curStatus != "pause"){
                videoPlayer.curTime++;
            }
            if (videoPlayer.curTime > videoPlayer.totalTime) {
                videoPlayer.curTime = videoPlayer.totalTime;
            }
            return videoPlayer.curTime;
        }
    };
    /**
     * 获取视频总时长
     */
    videoObj.getMediaDuration = function () {
        var _this = this;
        try {
            //机顶盒API
            return videoPlayer.getVideoDuration();
        } catch (e) {
            return videoPlayer.totalTime;
        }
    };
    /**
     * 获取当前是否静音   0: 设置为有声 (默认值) 1: 设置为静音
     */
    videoObj.getMuteFlag = function () {
        var _this = this;
        try {
            //机顶盒api 获取当前静音值状态
            var muteFlag = videoPlayer.getMuteFlag();
        } catch (error) {
            videoPlayer.curMuteFlag = videoPlayer.curMuteFlag == 1 ? 0 : 1;
            var muteFlag = videoPlayer.curMuteFlag;
        }
        return muteFlag;
    };
    /**
     * 设置静音状态
     */
    videoObj.setMuteFlag = function (val) {
        var _this = this;

        try {
            //机顶盒api 设置当前静音值状态
            videoPlayer.setMuteFlag(val);
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
            videoPlayer.volume = videoPlayer.getVolume();

            return videoPlayer.volume;
        } catch (error) {
            return videoPlayer.volume
        }

    };
    /**
    * 设置音量
    */
    videoObj.setVolume = function (val) {
        var _this = this;

        try {
            //机顶盒api 设置音量
            videoPlayer.setVolume(val);

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
            videoPlayer.pausePlay();
            videoPlayer.curStatus = "pause";
            return "pause";
        } catch (error) {
            videoPlayer.curStatus = "pause";
            return -1;
        }

    };
    /**
     * 恢复播放
     */
    videoObj.resume = function (val) {
        var _this = this;

        try {
            //机顶盒api 设置音量
            videoPlayer.startPlay();
            videoPlayer.curStatus = "play";
            return "resume";
        } catch (error) {
            videoPlayer.curStatus = "play";
            return -1;
        }

    };
    /**
     * 快进
     */
    videoObj.fastForward = function (val) {
        var _this = this;
        try {
            //机顶盒api 快进
            videoPlayer.seekPlay('1');
            videoPlayer.curStatus = "trickMode";
            return val;
        } catch (error) {
            videoPlayer.curSpeed = val;
            videoPlayer.curStatus = "trickMode";
            return -1;
        }
    };
    /**
     * 快退
     */
    videoObj.fastRewind = function (val) {
        var _this = this;
        try {
            //机顶盒api 快进
            videoPlayer.seekPlay('-1');
            return val;
        } catch (error) {
            videoPlayer.curSpeed = val;
            videoPlayer.curStatus = "trickMode";
            return -1;
        }
    };
    /**
    * 关闭播放器
    */
    videoObj.close = function () {
        try {
            videoPlayer.exitPage();
        } catch (error) {
        }
    };
    //获取当前播放器状态
    videoObj.getCurPlayerStatus = function (callback) {
        var _this = this;
        return videoPlayer.getPlayerState();
    };
    /**
     * 获取当前播放速配
     */
    videoObj.getCurPlayerSpeed = function () {
        var _this = this;
        try {
            return videoPlayer.getCurPlayerSpeed;
        } catch (error) {
            return videoPlayer.curSpeed;
        }
    }
    window.videoObj = videoObj;
})();
