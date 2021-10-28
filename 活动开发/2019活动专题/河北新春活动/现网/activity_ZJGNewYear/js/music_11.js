/**
 *musiceUrl:音乐地址
 *music:音乐数组；
 *index:数组下标；
 *mediaStr:媒体相关参数的描述
 *mediaCode:媒体的唯一标识
 *mediaType:媒体的类型
 *audioType:音频编码类型
 *videoType:视频编码类型
 *streamType:流类型
 *drmType:DRM类型
 *fingerPrint:是否支持水印保护
 *copyProtection:防拷贝类型
 *allowTrickmode:表示该媒体是否允许任何
 *startTime:表示媒体的起始时间
 *endTime:表示媒体的结束时间
 *entryID:只在加入Playlist时用到
 *
 */

var playUrl = "http://10.0.2.53:9097/web/HD/web/column/activity/actiDinosaur/video/";
var nowADay = new Date().getMonth() + 1 + "" + new Date().getDate() + new Date().getTime();
//music的播放地址
var music = ['dinosaur.mp3']; //
var musicIndex = 0;
var myIndex = musicIndex;
//var myIndex=7;
var mediaStr = '[{mediaUrl:"' + playUrl + music[myIndex] + '",';

mediaStr += 'mediaCode: "jsoncode1",';

mediaStr += 'mediaType:4,';

mediaStr += 'audioType:2,';

//	mediaStr += 'videoType:6,';
mediaStr += 'videoType:3,';

//	mediaStr += 'streamType:1,';
mediaStr += 'streamType:2,';

mediaStr += 'drmType:1,';

mediaStr += 'fingerPrint:0,';

mediaStr += 'copyProtection:1,';

mediaStr += 'allowTrickmode:1,';

mediaStr += 'startTime:0,';

mediaStr += 'endTime:0,';

mediaStr += 'entryID:"jsonentry1"}]';



var mp = new MediaPlayer(); //新建一个mediaplayer对象

var instanceId = mp.getNativePlayerInstanceID(); //读取本地的媒体播放实例的标识

function initMediaPlay() {
	var playListFlag = 0; //Media Player 的播放模式。 0：单媒体的播放模式 (默认值)，1: 播放列表的播放模式
	var videoDisplayMode = 2; //MediaPlayer 对象对应的视频窗口的显示模式. 1: 全屏显示2: 按宽度显示，3: 按高度显示
	var height = 0;
	var width = 0;
	var left = 0;
	var top = 0;
	var muteFlag = 0; //0: 设置为有声 (默认值) 1: 设置为静音
	var subtitleFlag = 0; //字幕显示
	var videoAlpha = 0; //视频的透明度
	var cycleFlag = 0;
	var randomFlag = 0;
	var autoDelFlag = 0;
	var useNativeUIFlag = 1;
	//初始话mediaplayer对象
	mp.initMediaPlayer(instanceId, playListFlag, videoDisplayMode,
		height, width, left, top, muteFlag, useNativeUIFlag, subtitleFlag, videoAlpha, cycleFlag, randomFlag, autoDelFlag);
	mp.setSingleMedia(mediaStr); //设置媒体播放器播放媒体内容
	mp.setAllowTrickmodeFlag(1); //设置是否允许trick操作。 0:允许 1：不允许
	mp.setVideoDisplayMode(0);
	mp.setVideoDisplayArea(left, top, width, height);
	mp.setNativeUIFlag(0); //设置播放器本地UI显示功能 0:允许 1：不允许
	mp.setAudioTrackUIFlag(0); //0:不使能音轨选择的本地UI 显示功能;1:使能音轨选择的本地UI 显示功能（默认值）
	//设置是否循环播放节目(0:设置为循环播放；1：设置为单次播放（默认值）)
	mp.setCycleFlag(0);
	//对应的本地播放器实例是否静音（0:设置为有声｛默认值｝；1：设置为静音）
	mp.setMuteFlag(0);
	mp.setMuteUIFlag(1);
	mp.setAudioVolumeUIFlag(0); //0:不使能音量调节的本地UI 显示功能1:使能音量调节的本地UI 显示功能（默认值）
	mp.refreshVideoDisplay();

}

//initMediaPlay();//首先初始话mediaplayer对象




//视频播放完毕后跳转

var curMusic = 0;
var manTime = 0;
var manAllTime = 60;

function isEnd() {

	var curTime = mp.getCurrentPlayTime();
	//videoPlayer.writeInfo("--当前--"+curTime);
	if (parseInt(curTime) === 0 || parseInt(curTime) > manAllTime) {
		curTime = manTime;
		//videoPlayer.writeInfo("--自定义1--"+curTime);
	}
	var allTime = mp.getMediaDuration();
	//videoPlayer.writeInfo("--总时长--"+allTime);
	if (parseInt(allTime) <= 0 || parseInt(allTime) > manAllTime) {
		curTime = manTime;
		allTime = manAllTime;
		//videoPlayer.writeInfo("--自定义2--"+allTime + "---" + curTime);
	}
	//videoPlayer.writeInfo("--剩余--"+(allTime-curTime));
	if (allTime - curTime <= 1 && curTime != 0) {
		curMusic = 0;
		manTime = 4;
		startByTime(manTime);
		/*stopMp3();
		setTimeout(function(){
			startMp3();
		},2000);*/

	}
	manTime++;

}
var musicTimer;

function startMp3() {
		//videoPlayer.writeInfo("调用播放");
		initMediaPlay();
		mp.playFromStart(); //从头开始播放
		musicTimer = setInterval(isEnd, 1000);
}

function startByTime(second) {
	//videoPlayer.writeInfo("开始定点播放-----------<br>");
	mp.playByTime(1, second)
}
//暂停
function pushMap3() {
	mp.pause();
}
//重新播放
function restartMap3() {
	mp.resume();
}
//停止
function stopMp3() {
	//videoPlayer.writeInfo("停止播放");
	mp.stop();
	mp.releaseMediaPlayer(instanceId);
	clearInterval(musicTimer);
}

function stopMp3_1() {
	mp.stop();
	clearInterval(musicTimer);
}

pushMap3();


var videoPlayer = {
	isDebug: false, //日志打印开关
	isMsg: false, //日志打印开关
	writeInfo: function (msg) {
		var _this = this;
		if (_this.isDebug) {
			if (_this.isMsg) {
				var el = document.createElement("div");
				el.style.position = "absolute";
				el.style.top = "20px";
				el.style.width = "1000px";
				el.style.left = "200px";
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
			el.innerHTML = el.innerHTML + "；" + msg;
		}
	}
}


function volumeUp() {
	var volume = mp.getVolume();
	volume = volume + 5;
	volume = volume > 100 ? 100 : volume;
	volume = volume < 0 ? 0 : volume;
	mp.setVolume(volume);
}

function volumeDown() {
	var volume = mp.getVolume();
	volume = volume - 5;
	volume = volume > 100 ? 100 : volume;
	volume = volume < 0 ? 0 : volume;
	mp.setVolume(volume);
}