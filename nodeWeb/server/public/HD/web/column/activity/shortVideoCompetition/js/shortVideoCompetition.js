/**
 * 列表数据渲染，一页六条数据；
 * 焦点选中文字加粗、文字溢出则滚动效果；焦点未选中文字溢出加省略号；
 * 点击上页下页实现翻页功能；
 * 点击每一条标题，进入全屏播放页；
 * 注意页面返回
 */
function shortVideo() {
	this.cartoonId = 1521; //当前卡通id    
	this.videoListJSon = {};
	this.step = 6;
	this.pageNum = 0; //当前页数,默认第一页
	this.textScroll = null; //文字滚动定时器
	this.curArr = [];
	this.curEpisode=0;//当前集数
	this.defaultFcous="hands_x0_y0_videoTitleFocus0_";
	this.getVideoListData();
}
shortVideo.prototype = {
	constructor: shortVideo,
	getVideoListData: function() {
		var _this = this;
		interface.findVideoListByCartoonId({ params: { cartoonId: _this.cartoonId }, ajaxConfig: { async: true } }, function (data) {
			/*ajax.init({
				url: "data/videoList.json",
				method: "get",
				params: {
					"cartoonId": _this.cartoonId
				},
				async: true,
				ContentType: "application/x-www-form-urlencoded",
				success: function(data) {*/
					_this.videoListJSon = data.data;
					if(_this.videoListJSon.length%6>0){
						CT.$("totalNum").innerHTML=parseInt(_this.videoListJSon.length/6)+1;
					}else{
						CT.$("totalNum").innerHTML=parseInt(_this.videoListJSon.length/6);
					}					
					_this.pageNum=parseInt(CT.requestValue("curpageNum")) || 0;
					_this.defaultFcous=CT.requestValue("curFocusId") || "hands_x0_y0_videoTitleFocus0_";
					//渲染视频标题数据
					_this.videoListTitleShow();
					//创建焦点数组
					_this.createButtons();					
					//初始化页面按钮
					PAGE.focusInit();
					PAGE.changeFocus(_this.defaultFcous);
				/*},
				fail: function(status) {

				}
			});*/
		});
	},
	videoListTitleShow: function() {
		var videoTitleListHTML = "";
		this.curArr = this.getCurrentArr() || [];
		for(var i = 0; i < this.step; i++) {			
			videoTitleListHTML += '<li id="videoTitle' + i + '">'+((this.curArr[i] && this.curArr[i].videoCname)?this.curArr[i].videoCname:"")+'</li>';
			videoTitleListHTML += '<div id="hands_x0_y0_videoTitleFocus' + i + '_">';
			videoTitleListHTML += '<img src="img/empty.png" alt="" id="videoTitleFocus' + i + '" style="visibility: hidden;"/>';
			videoTitleListHTML += '</div>';			
		}
		CT.$("videotitleList").innerHTML = videoTitleListHTML;
	},
	createButtons: function() {
		for(var i = 0; i < this.step; i++) {
			var button = {
				id: "hands_x0_y0_videoTitleFocus" + i + "_",
				clickHandler: "javascript:shortVideoCompetition.jumpVideoPlay(" + i + ")",
				otherFocusEvent: "javascript:shortVideoCompetition.onFocus(1," + i + ")",
				otherBlurEvent: "javascript:shortVideoCompetition.onFocus(0," + i + ")",
				left: "disable",
				right: "disable",
				up: (i == 0) ? "disable" : "hands_x0_y0_videoTitleFocus" + (i - 1) + "_",
				down: "disable",
				downEvent:"javascript:shortVideoCompetition.titleBtnDownEvent("+i+")",
				focusType: 7
			}
			buttons.push(button);
		}
	},
	getCurrentArr: function() {
		var _this = this;
		var curArr = [];		
		CT.$("pageNum").innerHTML = this.pageNum + 1;
		curArr = this.videoListJSon.slice(this.pageNum * 6, (this.pageNum * 6 + 6));
		return curArr;
	},
	onFocus: function(isFocus, ii) {
		var focusDom = "";
		if(ii == "last" || ii == "next") {
			if(ii == "last") {
				focusDom = CT.$("lastPageBtn");
			} else if(ii == "next") {
				focusDom = CT.$("nextPageBtn");
			}
			/*if(isFocus == 0) {
				CT.removeClass(focusDom, "onFocusChangePage");
			} else if(isFocus == 1) {
				CT.addClass(focusDom, "onFocusChangePage");
			}*/
		} else {
			if(isFocus == 0) {
				CT.removeClass(CT.$("videoTitle" + ii), "onFocus");
				CT.$("videoTitle" + ii).innerHTML = this.curArr[ii].videoCname;
			} else if(isFocus == 1) {
				CT.addClass(CT.$("videoTitle" + ii), "onFocus");
				//焦点标题溢出跑马灯效果
				CT.$("videoTitle" + ii).innerHTML = CT.setMarquee(CT.$("videoTitle" + ii).innerHTML, 44, 6);
			}
		}
	},
	/**
	 * 跳转全屏播放页
	 * @param {视频列表编号} num 
	 */
	jumpVideoPlay: function(num) {
		var _this = this;
		_this.curEpisode = Number(num);
		//点击推荐位数据
        var curData =  _this.curArr[num];
		var mediaCode = curData.movieDetails[0].playUrl;
        //添加全屏cookie
        var index = num;
        if(index < 9){
            var pageNo = 0;
            var defaultFocus = "hands_x0_y0_number" + index + "_";
        }else {
            var pageNo = index - 8;
            var defaultFocus = "hands_x0_y0_number8_";
        }
        var params = {
            pageNo: pageNo,
            defaultFocus:defaultFocus
        };
        params = CT.jsonToString(params);
        CT.setCookie('listNotes', params);
		CT.setCookie("pageType","activity");
        //记录返回
        PAGE.otherPageParam = "&contentId="+CT.requestValue("contentId")+"&contentEName="+CT.requestValue("contentEName")+"&contentCName="+CT.requestValue("contentCName")+"&cartoonId="+_this.cartoonId+"&curFocusId="+curFocus.FocusID+"&curpageNum="+_this.pageNum+"&curEpisodeListNum=0"+"&curEpisode="+_this.curEpisode;
        CT.goPage();		
		_this.playVideo(curData);
	},
	/**
	 * 全屏
	 * @param curData 全屏播放需要的数据
	 */
	playVideo:function(curData){
		var _this = this;
		//跳转
		curData.recommendDisplayType = 2;//页面类型2表示全屏页面
		curData.cartoonId = _this.cartoonId;
		CT.toAnterRecommendUrl(curData);
	},
	/**
	 * 向上翻页
	 */
	jumpLastPage: function() {
		if(this.pageNum > 0) {			
			this.pageNum--;
			//重新渲染列表数据
			this.videoListTitleShow();
		}
	},
	/**
	 * 向下翻页
	 */
	jumpNextPage: function() {
		if(this.videoListJSon.length > (this.pageNum + 1) * 6) {
			this.pageNum++;
			//重新渲染列表数据
			this.videoListTitleShow();
		}
	},
	/**
	 * 获取点击上一页的焦点
	 */
	nextPageBtnUpEvent:function(){
		var upFocusId = this.curArr.length-1;
		PAGE.changeFocus("hands_x0_y0_videoTitleFocus"+upFocusId+"_");
	},
	titleBtnDownEvent:function(index){
		if(this.curArr.length>(index+1)){
			PAGE.changeFocus("hands_x0_y0_videoTitleFocus" + (index + 1) + "_");
		}else{
			PAGE.changeFocus("hands_x0_y0_nextPageBtnFocus_");
		}
	}

}
var shortVideoCompetition = new shortVideo();


function backFunc(){
	CT.backPage();
}