var page = {
    //此卡通是否免费
    isFree: "",
    //此卡通总集数
    cartoonSumvideonum: "",
	//用户id
	userId : xjDataLog.getUserId(),
	//页面id
	contentId : CT.requestValue("contentId") || 1,
	//卡通
	cartoonId : 674,
	//视频的总集数集合，未处理的数据
	videoListJSon:{},
	//视频的总集数集合，经过处理，数组的第0、1、2...分别对应着第1、2、3页 （1-18、19-36....）
	list:[],
	//当前的页码 --- 集数列表翻页的情况下才会加一或者减一  (第一页：1-18.....第二页：217-234....）
	curpageNum:CT.requestValue("curpageNum") || 0,
	// 一屏最多可以显示的  集数列表数 (可以显示1-18,19-36.....n-m 等12个页面)
	maxEpisodeListNum:12,
	//当前选中的集数   (n-m)
	curEpisodeListNum: CT.requestValue("curEpisodeListNum") || 0,
	//当前页面最大的(n-m) 集数集合
	curPageMaxEListNum:0,
	//disablePageNum
	disablePageNum:0,
	//比如：1-18,19-19，选中19之后记录下disableEpisodeNum=1，在19集向右不能移动
	disableEpisodeNum:0,
	//当前集数
	curEpisode:CT.requestValue("curEpisode"),
	//当前底部显示的数据
	curButtomList:[],
	/**
	 *  请求页面数据
	 *  页面数据，中间小视频信息，底部推荐
	 */
	init:function(){
		var _this = this;
		interface.findCommonPageInfo({params:{contentId:_this.contentId},ajaxConfig:{async:true}},function(data){
            setLoggerInfo.pageInfoLog = data;
            // 通用日志
			//保存页面的所有数据，generalNavBar.js会用到AjaxConfig.commonPageInfo
			AjaxConfig.commonPageInfo = data;
			//上部的logo，nav数据，背景图
			_this.setBJAndNav();
			//本部卡通的详细数据
			_this.getVideoData();
			//获取收藏状态
			_this.getCollectState();
		});
	},
	/**
	 *  显示眉头数据,背景
	 */
	setBJAndNav:function(){
		//背景
		//CT.$("BJ").src = AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.data.pageInfo.pageTemplateBgpic.picPath;
		//眉头
		navBarObj.init({logo:null,navInfo:"right"});
	},
	/***
	 * 1.通过ajax获取视频的所有集数信息
	 * 2.获取卡通的详细描述（卡通名称、卡通描述、卡通类型）
	 * 3.显示底部推荐
	 * 4.初始化页面
	 */
	getVideoData:function(){
		    var _this = this;
			//视频框和收藏、播放按钮
			_this.setVideoButtons();
			//所有集数信息
			interface.findVideoListByCartoonId({params:{cartoonId:_this.cartoonId},ajaxConfig:{async:true}},function(data){
			    _this.videoListJSon = data;
			    try {
                    //播放视频
                    _this.playSmallVideo();
                }catch (e) {
                }

                //显示集数列表
                _this.showPages();
                //显示底部
                _this.buttomData(AjaxConfig.commonPageInfo.data.recommend_1);
                //初始化页面按钮
                PAGE.focusInit();
                PAGE.changeFocus("hands_x0_y0_videoBorder_");
		    });
			//卡通的详细描述
			interface.findCartoonDetailById({params:{id:_this.cartoonId},ajaxConfig:{async:true}},function(data){
		           if(data.data){
		               _this.isFree = data.data.isFree;
		               _this.cartoonSumvideonum = data.data.cartoonSumvideonum;
						CT.$("videoTitle").innerHTML = data.data.cartoonCname;
						CT.$("videoContent").innerHTML = (data.data.cartoonIntroduction ? data.data.cartoonIntroduction : "").length > 100 ? (data.data.cartoonIntroduction.substring(0, 100) + "..." ) : data.data.cartoonIntroduction;;
					    //类型tagsInfo
						var cartoonType ="";
						var cartoonTypeInfo = data.data.tagsInfoList;
						if(cartoonTypeInfo){
							for (var i =0; i<cartoonTypeInfo.length;i++){
								cartoonType += "<img src='"+AjaxConfig.imgUrl + cartoonTypeInfo[i].iconPic.picPath+"'>";
							}
						}
						
						CT.$("videoType").innerHTML += cartoonType;
					}
		    });
     },
	 /**
	  *  视频框、收藏、播放按钮
	  *
	  */
    setVideoButtons:function(){
		var _this =this;
		buttons.push({
			id:"hands_x0_y0_videoBorder_",
			clickHandler:"javascript:page.toPlayVideo('smallVideo')",
			left:"disable",
			right:"hands_x0_y0_NowWatch_",
			downEvent:"javascript:page.togglePage('video')",
			up:"hands_x0_y0_navRightFocus0_",
			focusType: 7
		},{
			id:"hands_x0_y0_NowWatch_",
			clickHandler:"javascript:page.toPlayVideo('smallVideo')",
			left:"hands_x0_y0_videoBorder_",
			right:"hands_x0_y0_collectContent_",
			downEvent:"javascript:page.togglePage()",
			up:"hands_x0_y0_navRightFocus0_",
			focusType: 7
		},{
			id:"hands_x0_y0_collectContent_",
			clickHandler:"javascript:page.toggleCollectState()",
			left:"hands_x0_y0_NowWatch_",
			right:"disable",
			downEvent:"javascript:page.togglePage()",
			up:"hands_x0_y0_navRightFocus0_",
			focusType: 7
		});
	
	},
	/**
	 *  显示分页
	 *  最多创建maxPageNum个分页光标，超过maxPageNum个多余的隐藏
	 */
	showPages : function(){
		var _this = this;
		var maxPageNum = Math.ceil(_this.videoListJSon.data.length/18);
		//先把所有集数放到固定的数组里
		for(var i=0;i<maxPageNum;i++) {
			_this.list.push(_this.videoListJSon.data.slice(18 * i, 18 * (i + 1)));
		}
		//显示第一屏的分页
		maxPageNum = maxPageNum>_this.maxEpisodeListNum?_this.maxEpisodeListNum:maxPageNum;
		_this.curPageMaxEListNum = maxPageNum;
		if(_this.videoListJSon.data.length/18 > 0){  //至少存在一集
			var pageNum = "";
			var pageBorder = "";
			for(var i=0;i<maxPageNum;i++) {
				//显示分页数
				//数字
			    pageNum += "<div class='pageNum' id='pageNum"+i+"'>" + (18 * i + 1) + "-" + (18 * (i + 1) < (_this.videoListJSon.data.length) ? 18 * (i + 1) : (_this.videoListJSon.data.length)) + "</div>";
				//光标图片
			    pageBorder += "<div class='pageNumBorder position' id='hands_x0_y0_page" + i + "_' style='top:-1px;left:"+(40+i*90)+"px;'><img id='page"+i+"' src='../image/pageBorder.png' style='width:108px;height:48px;visibility: hidden'></div>";
				//光标按钮
				var pageButton = {
					id:"hands_x0_y0_page"+i+"_",
					otherFocusEvent: "javascript:page.toggleEpisode(" + i + ")",
					left:"hands_x0_y0_page"+(i-1)+"_",
					right:"hands_x0_y0_page"+(i+1)+"_",
					up:"hands_x0_y0_videoBorder_",
					down:"hands_x0_y0_episode0_",
					focusType: 7
				};
				if(i == 0){
					pageButton.left = "disable";
					pageButton.leftEvent = "javascript:page.togglePage(1)";
				}
				if( i == maxPageNum-1 ){
					pageButton.right = "disable";
					pageButton.rightEvent = 'javascript:page.togglePage('+(_this.maxEpisodeListNum-1)+')';
				}
				buttons.push(pageButton);
			}
            _this.curpageNum = 1;
			CT.$("pageNum").innerHTML = pageNum;
			CT.$("pageBorder").innerHTML = pageBorder;
			//显示一屏集数
			_this.setEpisodesBut();
		}
	},
	/**
	 * 设置集数的buttons
	 */
	setEpisodesBut:function(){
		var _this = this;
		var episodeEnd = CT.$("pageNum0").innerHTML;
		episodeEnd = parseInt(episodeEnd.slice(episodeEnd.indexOf("-")+1,episodeEnd.length));
		//设置buttons  创建Div
		var episodeBorder="";
		for(var i=0;i<18;i++){
			episodeBorder += "<div class='episodeBorder position' id='hands_x0_y0_episode" + i + "_' style='top:0px;left:"+(48+i*62)+"px;'><img id='episode"+i+"' style='visibility: hidden' src='../image/episodeBorder.png'></div>";
			var episodeButton = {
				id:"hands_x0_y0_episode"+i+"_",
				clickHandler:"javascript:page.toPlayVideo("+i+")",
				left:"hands_x0_y0_episode"+(i-1)+"_",
				right:"hands_x0_y0_episode"+(i+1)+"_",
				upEvent:"javascript:page.togglePage('episode')",
				down:"hands_x0_y0_buttom0_",
				focusType: 7
			};
			if(i == 0){
				episodeButton.left = "disable";
			}else if( i == 17 ){
				episodeButton.right = "disable";
			}
			buttons.push(episodeButton);
		}
		_this.showEpisodes(1,episodeEnd);
		CT.$("episodeBorder").innerHTML = episodeBorder;
		
	},
	
	/**
	 * 显示集数
	 * 传一个起初和终结值，显示中间的所有集数
	 * @param episodeBegin 显示集数的起点
	 * @param episodeEnd  显示集数最大
	 */
	showEpisodes:function(episodeBegin,episodeEnd){
		var _this = this;
		var episode = "";
		var num = 0;//div定位使用
		for(var i=episodeBegin;i<=episodeEnd;i++){
			episode += "<div class='episodes' style='top:0px;left:"+(num*62)+"px;'>";
			num ++;
			if(_this.videoListJSon.data[i-1].isFree == 0){//免费图标
				episode += "<img class='position' style='top:-17px;' src='../image/free.png'>";
			}else{//vip图标
			    episode += "<img class='position' style='top:-17px;' src='../image/vip.png'>";
			}
			episode += i;
			episode += "</div>";
		}
		CT.$("episode").innerHTML = episode;
	},
	/**
	 *  切换页码光标
	 *  @param num  当num不存在时是上部光标切换到页码光标、当num=1是第一页、num=_this.maxPageNum-1是最后一页码
	 *  
	 */
	togglePage:function(num){
		var _this = this;
        if(!num){
        	if(_this.videoListJSon.data.length>0){
				PAGE.changeFocus("hands_x0_y0_page0_");
			}else{
				PAGE.changeFocus("hands_x0_y0_buttom0_");
			}
	    }else if(num == 1){
			if(_this.curpageNum >1){  //需要翻页
				var pageNum ="";
			    PAGE.focusArr["hands_x0_y0_page"+_this.disablePageNum+"_"].coo.right="hands_x0_y0_page"+(_this.disablePageNum+1)+"_";
				var maxPageNum = _this.maxEpisodeListNum;
				_this.curPageMaxEListNum = maxPageNum;
				for(var i=0;i<maxPageNum;i++) {
					//数字
					pageNum += "<div class='pageNum' id='pageNum"+i+"'>" + (18 * (i) + 1) + "-" + (18 * ((i) + 1) < (_this.videoListJSon.data.length) ? 18 * ((i) + 1) : (_this.videoListJSon.data.length)) + "</div>";
				}
				_this.curpageNum --;
				CT.$("pageNum").innerHTML = pageNum;
				PAGE.changeFocus("hands_x0_y0_page11_");
			}
		}else if(num == _this.maxEpisodeListNum-1){
            if(_this.curpageNum * _this.maxEpisodeListNum < parseInt(_this.videoListJSon.data.length/18)+1){  //需要翻页
                 var pageNum ="";
                 var maxPageNum = parseInt(_this.videoListJSon.data.length/18)+1 - (_this.curpageNum * _this.maxEpisodeListNum)>_this.maxEpisodeListNum?_this.maxEpisodeListNum:parseInt(_this.videoListJSon.data.length/18)+1 - (_this.curpageNum * _this.maxEpisodeListNum);
				_this.curPageMaxEListNum = maxPageNum;
				 for(var i=0;i<maxPageNum;i++) {
					//数字
					pageNum += "<div class='pageNum' id='pageNum"+i+"'>" + (18 * (i + _this.maxEpisodeListNum) + 1) + "-" + (18 * ((i + _this.maxEpisodeListNum) + 1) < (_this.videoListJSon.data.length) ? 18 * ((i + _this.maxEpisodeListNum) + 1) : (_this.videoListJSon.data.length)) + "</div>";
				 }
				 _this.curpageNum ++;
				 CT.$("pageNum").innerHTML = pageNum;
				 PAGE.changeFocus("hands_x0_y0_page0_");
				 if(maxPageNum<_this.maxEpisodeListNum-1){
					PAGE.focusArr["hands_x0_y0_page"+(maxPageNum-1)+"_"].coo.right="disable";
					_this.disablePageNum = maxPageNum-1;
				 }
			}
		}else{
			PAGE.changeFocus("hands_x0_y0_page"+_this.curEpisodeListNum+"_");
		}
	},
	/**
	 * 清除每一个集数集合的样式
	 */
	clearColor : function(){
		var _this =this;
		for(var i=0;i<_this.curPageMaxEListNum;i++){
			PAGE.removeClass(CT.$("pageNum"+i),"pageColor");
		}
	},
	/**
	 *  切换每个页码对应的具体的某几集
	 *  @param num 序号
	 */
	toggleEpisode :function(num){
		var _this = this;
		num = num || 0;
		_this.curEpisodeListNum = num;
        //先清空黄色字体样式
		_this.clearColor();
		//改变页码样式
		PAGE.addClass(CT.$("pageNum"+num),"pageColor");
		var episodeBegin = 18*((_this.curpageNum-1)*_this.maxEpisodeListNum+num)+1;
		var episodeEnd=CT.$("pageNum"+num).innerText;
		episodeEnd = parseInt(episodeEnd.slice(episodeEnd.indexOf("-")+1,episodeEnd.length));
		if(Number(episodeEnd)-Number(episodeBegin)<17){
			_this.disableEpisodeNum = episodeEnd-episodeBegin;
		    PAGE.focusArr["hands_x0_y0_episode"+(episodeEnd-episodeBegin)+"_"].coo.right="disable";
		}else{
	    	PAGE.focusArr["hands_x0_y0_episode"+(_this.disableEpisodeNum)+"_"].coo.right="hands_x0_y0_episode"+(_this.disableEpisodeNum+1)+"_";
			_this.disableEpisodeNum = 0;
		}
		_this.showEpisodes(episodeBegin,episodeEnd);
	},

	/**
	 * 创建底部推荐及显示
	 * 注：会取到七个数据，先比较是否有等于当前页面的卡通，如果有可以用第7个数据替换调
	 * @param data 底部推荐的所有数据
	 */
	buttomData:function(data){
		var _this = this;
		var recommendHtml ="";
        for(var i=0;i<data.length-1;i++ ){
			//剔除和本页面重复的卡通
            if(data[i].cartoonId == _this.cartoonId){
			     data[i] = data[data.length-1];
			}
			recommendHtml += "<div class='position' id='hands_x0_y0_buttom"+i+"_' style='top:0px;left:"+i*200+"px;width:210px;height:220px;'><img id='buttom"+i+"' style='visibility: hidden' src='"+AjaxConfig.imgUrl + data[0].recommendLabelpic.picPath+"'></div>";//光标
			recommendHtml += "<div class='position' style='top:0px;left:"+i*200+"px;'><img src='"+AjaxConfig.imgUrl + data[i].recommendPic.picPath+"'></div>";//底图
			var buttomButton={
				id:"hands_x0_y0_buttom"+i+"_",
				clickHandler:"javascript:page.toVideoDetail("+i+")",
				left:"hands_x0_y0_buttom"+(i-1)+"_",
				right:"hands_x0_y0_buttom"+(i+1)+"_",
				upEvent:"javascript:page.buttomUpEvent()",
				down:"disable",
				focusType: 7
			}
            buttomButton.TempData = data[i];
            if(i==0){
				buttomButton.left="disable";
			}else if(i == data.length-2){
				buttomButton.right="disable";
			}
			buttons.push(buttomButton);
			_this.curButtomList.push(data[i]);
			
        }
		CT.$("recommend").innerHTML += recommendHtml;
		//判断上下架
		_this.isBooleanUp();
	},
   /**
    * 判断推荐位是否下架
    */
	isBooleanUp:function(){
		var _this = this;
		for(var i=0;i<_this.curButtomList.length;i++){
			CT.isBooleanUp(_this.curButtomList[i].booleanUp,"hands_x0_y0_buttom"+i+"_","recommend");
		}
	},
   /**
    * 底部推荐向上，先判断卡通是否存在至少一集
    */
	buttomUpEvent:function(){
		var _this = this;
		if(_this.videoListJSon.data.length>0){
			PAGE.changeFocus("hands_x0_y0_episode0_");
		}else{
			PAGE.changeFocus("hands_x0_y0_videoBorder_");
		}
	},
	/**
	 *  底部推荐位点击跳转到相对应的详情页
	 *  booleanUp = 0表示已经下架，下架的卡通不跳转
	 *  @param num 序号
	 */
	 toVideoDetail:function(num){
		 var _this = this;
		 if(_this.curButtomList[num].booleanUp != 0){
			orderJs.getAuth(function () {
			 CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo.data,"recommend_1",num);})
		 }
		
	 },
    /**
	 * 点击 视频框、播放按钮、某一集，准备去全屏
	 * 取数据 _this.list[_this.curEpisodeListNum][num]
	 * 注：1.判断是否免费  0，免费，1收费
	 *     2.收费先去鉴权，鉴权通过直接播放
	 * @param num  num == "smallVideo" 小窗口，其他表示下面的选集
	 */
	toPlayVideo:function(num){
        var _this = this;
		_this.curEpisode = Number(num);
		//点击推荐位数据
        var curData = (num == "smallVideo" )? _this.videoListJSon.data[0] : (_this.list[_this.curEpisodeListNum][num]);
		var mediaCode = curData.movieDetails[0].playUrl;
        //添加全屏cookie
        var index = num == "smallVideo" ? 0 : Number(page.list[page.curEpisodeListNum][num].videoNumber) - 1;
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
        //记录返回
        PAGE.otherPageParam = "&contentId="+_this.contentId+"&contentEName="+CT.requestValue("contentEName")+"&contentCName="+CT.requestValue("contentCName")+"&cartoonId="+_this.cartoonId+"&curFocusId="+curFocus.FocusID+"&curpageNum="+_this.curpageNum+"&curEpisodeListNum="+_this.curEpisodeListNum+"&curEpisode="+_this.curEpisode;
        CT.goPage();
		if(curData.isFree == 1){
		    //去鉴权，回调视频播放
			
            try{
                xjDataLog.uploadLogPage();
            }catch(e){}
		   // orderJs.getAuth(function(){
				_this.playVideo(curData);
		   // });
		}else{
		   _this.playVideo(curData);
		}
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
	 *  播放小视频
	 */
	playSmallVideo:function(){
		var mediaCode = this.videoListJSon.data[Math.floor(Math.random()*3)+1].movieDetails[0].playUrl;
		var stbType = xjDataLog.getSTBType();
                                if(stbType != undefined && stbType != 'undefined' && stbType){
                                        stbType = stbType.split('-');
                                        stbType = stbType[0] + '-' + stbType[1];
                                }
				 orderJs.getUserInfo(function (e) {
				//宜兴茁壮TVOS小视屏适配
                                if (e.data.userInfo.districtCode == '3330' && window.navigator.appVersion.indexOf("MSIE")>-1&& window.navigator.userAgent.indexOf('DVNBrowser')>-1) {
                                        if(stbType == 'N9201-S4000'){
                                                try {   
                                                        videoPlayer.SmallPlay(mediaCode, {
                                                                top: 60,//167
                                                                left: 20,//283
                                                                height: 1,//18
                                                                width: 1,//290
                                                                t: 120000
                                                        })
                                                  } catch (e) {}
                                        
                                        }else {
                                                 try {  
                                                        videoPlayer.SmallPlay(mediaCode, {
                                                               top: 100,//167
                                                                left:40 ,//283
                                                                height: 1,//18
                                                                width: 1,//290
                                                                t: 120000
                                                        })
                                                } catch (e) {}
                                        }

                                } else {
					//酷开产创小视屏尺寸
                                        if (window.navigator.appVersion.indexOf("Safari") > -1) {
                                videoPlayer.SmallPlay(mediaCode,{
                                        top : 150,
                                        left : 88,
                                        height : 1,
										width : 1
                                });
                                	}else{	
					//中间件，华博等
                                        videoPlayer.SmallPlay(mediaCode,{
                                                top : 136,
                                                left : 55,
                                                height : 1,
                                                width : 1
                                        });
                               		 }
                       		 }});

		/**
		if (window.navigator.appVersion.indexOf("Safari") > -1) {
			videoPlayer.SmallPlay(mediaCode,{
				top : 150,
				left : 88,
				height : 211,
				width : 345
			});
		}else{
			videoPlayer.SmallPlay(mediaCode,{
				top : 136,
				left : 55,
				height : 241,
				width : 411
			});
		}
       		**/
       
	},
	/**
	 *  先获取收藏状态并显示
	 *  contentType : 1    0-游戏，1-卡通，2-视频
	 */
	 getCollectState:function(){
		var _this =this;
		var data = {
			params:{
			 userId : _this.userId,
			 contentId : _this.cartoonId,
			 contentType : 1  
		    },
			ajaxConfig:{async:true}
		}
	    interface.findMediaCollectStatus(data,function(e){
		   if(e.data == 0 || e.data == "0"){  //已收藏
			  CT.$("collectImage").src = "../image/collect.png";
		   }else{ //未收藏
			  CT.$("collectImage").src = "../image/nocollect.png";
		   }
		})
	 },
	/**
     *  切换收藏状态
	 *  在改变之前先查看现在的状态 ： 0 已收藏   其他 未收藏
	 *  toggleCollectStateFlag 是否可以继续触发接口
	 */
     toggleCollectStateFlag:true,
	 toggleCollectState:function(){
		var _this =this;
		if(!_this.toggleCollectStateFlag){
		    return;
		}
	   var data = {
			params:{
			 userId : _this.userId,
			 contentId : _this.cartoonId,
			 contentType : 1  
		    },
			ajaxConfig:{async:true}
		}
		_this.toggleCollectStateFlag = false;
	    interface.findMediaCollectStatus(data,function(e){
		   if(e.data == 0 || e.data == "0"){  //已收藏
			  _this.delCollect();
		   }else{ //未收藏
			 _this.saveCollect();
		   }
		})
	 },
    
	/**
     *  添加用户收藏
	 */
	 saveCollect:function(){
	     var _this =this;
		 var params={
			 userId : _this.userId,
			 contentId : _this.cartoonId,
			 contentType : 1
		 };
		 interface.saveUserCollect(params,function(data){
			if(data.successFlg == 1){//1代表收藏成功或内容已经收藏
				 CT.$("collectImage").src = "../image/collect.png";
				_this.toggleCollectStateFlag = true;
			}else{
			    //收藏失败
			}
		 });
	 },
	 /**
	  *  删除收藏
	  */
	  delCollect:function(){
		 var _this =this;
		 var params={
			 userId : _this.userId,
			 contentId : _this.cartoonId,
			 contentType : 1
		 };
		 interface.deleteUserCollect(params,function(data){
			if(data.successFlg == 1){//删除成功
			    CT.$("collectImage").src = "../image/nocollect.png";
				_this.toggleCollectStateFlag = true;
			}else{
			    //删除失败
			}
		 });
	  }

}
//page.init();


//眉头向下
function navBtnDownEvent(){
   PAGE.changeFocus("hands_x0_y0_videoBorder_");
}
//眉头跳转
function toNextPage(type,num){
	PAGE.otherPageParam = "&contentId="+page.contentId+"&contentEName="+CT.requestValue("contentEName")+"&contentCName="+CT.requestValue("contentCName")+"&cartoonId="+page.cartoonId+"&curFocusId="+curFocus.FocusID;
	CT.goPage();
	if(type.indexOf("Mid")> -1){   //中间眉头
		CT.toAnterRecommendUrl(navBarObj.commonPageInfo.data.pageInfo.commonPageInfo,"recommend_2",num);
	}else if(type.indexOf("Right")> -1){   //右侧眉头
		CT.toAnterRecommendUrl(navBarObj.commonPageInfo.data.pageInfo.commonPageInfo,"recommend_3",num);
	}
}
//页面返回
//通用专题的返回columnBackUrl
function backfunc() {
   
   var columnBackUrl = CT.getCookie("columnBackUrl");
	// alert('videoDetil backFunc'+columnBackUrl);
   CT.delCookie("columnBackUrl");
   if(columnBackUrl){
      CT.commonJumpUrl(columnBackUrl) ;
   }else{
	  CT.backPage();
   }
}

