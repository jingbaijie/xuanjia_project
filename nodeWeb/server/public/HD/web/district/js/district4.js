var page = {
	//页面id
	contentId:basePageInfo.commonPageInfo.pageInfo.commonPageId || 1,
	//瀑布流数据
	pinterestData:null,
    //最大的div存放瀑布流DOM
    parentBox : document.getElementById('main'),
    //main的top值
	parentBoxHeight : 0,
	//比较当前行的数组,如果当前行填满则清空数组
    comPareArray : [{curRowNum:0}],
	//当前比较数组下标
    comPareArrayIndex : 0,
	//默认初始Left值
    defaultLeft : 51,
	//默认初始top值
    defaultTop : 157,
	//是否已经加载完
    isLoaded : false,
	//小窗口是否在播放
	isPlayingVideo:true,
	//所有推荐位的more1 数据
	moer1DataJson:[],
	//main当前的top值，只用于首页离开后再返回到首页使用，实现来哪去哪
	mainTop:CT.requestValue("mainTop") || false,
    isOnPlay: true,
	/**
	 * 初始化页面，请求到页面需要的所有数据
	 */
    init : function () {
        var _this = this;
		//请求页面的数据
		interface.findCommonPageInfo({params:{contentId:_this.contentId},ajaxConfig:{async:true}},function(data){
            setLoggerInfo.pageInfoLog = data;
			//保存页面的所有数据，generalNavBar.js会用到AjaxConfig.commonPageInfo
			AjaxConfig.commonPageInfo = data;
			//启动自动寻找焦点，自动寻找焦点--不需要给光标定义上下左右的移动位置或事件，key3_4.js循环寻找最近的坐标
			AjaxConfig.isAutoFindFocus = true;
			//瀑布流数据
			_this.pinterestData = data.data.recommend_1;
			//设置背景图、眉头
			_this.setBJAndNav(data);
			//创建推荐位的dom和光标
			_this.createImgDom(data);
			//各个推荐位的定位
		   _this.setImgDomPosition();
			//页面初始化焦点,实现来哪去哪先取眉头
			PAGE.focusInit();
			var defaultFocus = CT.requestValue("curFocusId") || "hands_x0_y0_addContent0_";
			PAGE.changeFocus(defaultFocus);
			//播放视频
			//_this.playSmallVideo();
		});
    },
	/**
     *   设置背景图、眉头
     *   
     */
	 setBJAndNav:function(data){
		var _this = this;
		//生成眉头
		//navBarObj.init({logo:null,navInfo:"both"});
		//首页背景
		CT.$("BJ").src= AjaxConfig.imgUrl + data.data.pageInfo.pageTemplateBgpic.picPath;
	 },
    /**
     *   取more1数据,并返回一个对象
     *   isShowSelectedImg=true 是否完全显示光标图片，默认false ，特例：小火车车身
     *   isSetZIndex=true  是否设置z-index属性，默认false默认光标在下
	 *   isVideo=true 小视频坑位
	 *   toTop= true 回到顶部坑位
	 *   isShowFont=true显示推荐位的文字描述
     *   @param more1
	 *   @returns {*}
     */
    getMore1 : function (more1) {
		return more1?CT.strToJson(more1):{};
    },
    /**
     *	设置button
	 *	配置光标图片conf.selectBorderImgUrl表示光标可用
	 *	配置conf.isShowSelectedImg光标不可用（特例：小火车）
     *	@param conf 序号
     *	@returns {*}
     */
    setBtnObj : function (conf) {
        var _this = this;
        conf = conf || {}
        var btn = null;
        if(conf.selectBorderImgUrl && !conf.isShowSelectedImg){
             btn = {
                 id: "hands_x0_y0_addContent" + (conf.index) + "_",
                 focusType: 7,
				 clickHandler:'javascript:page.toJump("bottom",'+ (conf.index) + ')',
                 otherFocusEvent: "javascript:page.focusEvent("+(conf.index)+")",
				 otherBlurEvent: "javascript:page.blurEvent("+(conf.index)+")",
                 TempData : conf.TempData
             }
        }else{
            btn = {
                id: "hands_x0_y0_addContent" + (conf.index) + "_",
                focusType: 7,
                enFocus: false
            }
        };
        return btn;
    },
	/**
	 *  移动选中光标
	 *  特殊需求:当瀑布流推荐位向上选中眉头时，要根据当前所属页面选择对应的眉头
	 *  先判断是否需要翻页，如果小于560时---不需要翻页：CT.$("main").style.top =  "0px";
	 *                      如果大于560时---需要翻页
	 *  如果大于560时，再判断总高度减去当前高度是否大于560，即是否存在完整的下一页， 如果小于等于560--- _this.isLoaded = true;
	 *                                                                               如果大于560--- _this.isLoaded = false;
	 *  特殊位置的处理：加载完成之后，需要判断是否存在_this.mainTop，如果存在CT.$("main").style.top = _this.mainTop;实现来哪去哪
	 *  移动光标的同时要判断是否需要关闭或播放小视频
	 *  移动光标的同时要判断是否滚动文字
	 *  @param num 序号
	 */
    focusEvent : function (num) {
        var _this = this;
		//特殊需求：底部推荐向上选中当前内容的眉头
		if((curFocus.lastFocusId.indexOf("addContent") >-1) && (curFocus.FocusID.indexOf("DMSYDH") >-1)){
			PAGE.changeFocus("hands_x0_y0_DMSYDH"+navBarObj.showNavSelectedId+"_");
			return;
		}
		//获取当前焦点的信息
		var curClassDomInfo = CT.getCurClassObjInfo(CT.$(curFocus.FocusID));
		//小视频的播放或隐藏
		_this.videoHidden(curClassDomInfo.top);
        //移动盒子main
        if(curClassDomInfo.top >= 560){
            if(_this.parentBoxHeight - curClassDomInfo.top  >= 560){
                CT.$("main").style.top = -(curClassDomInfo.top - _this.defaultTop ) + "px";
                _this.isLoaded = false;
            }else {
                _this.isLoaded = true;
                if(_this.mainTop){//实现特殊位置的来哪去哪
                    CT.$("main").style.top = _this.mainTop;
                }else{
                    //如果当前dom 高度
                    if(_this.parentBoxHeight - curClassDomInfo.top > (_this.defaultHeight/2 + _this.defaultTop)){
                        CT.$("main").style.top = -(curClassDomInfo.top - _this.defaultTop) + "px";
                    }else if(page.getMore1(curFocus.TempData.recommendDisplayValue).toTop == "true" ) {
                        CT.$("main").style.top = -(curFocus.Y_Posi - page.defaultHeight ) + "px";

                    }else {
                        CT.$("main").style.top = -(curClassDomInfo.top - _this.defaultTop ) + "px";
					}
                    // CT.$("main").style.top = -(curClassDomInfo.top - _this.defaultTop ) + "px";
                }
            }
        }else{
            CT.$("main").style.top =  "0px";
        }
		_this.mainTop = false;
		//是否滚动文字
		if(CT.$("addContentFont"+num).innerHTML.length > 10 && CT.$("addContentFont"+num).style.visibility == "visible"){
			CT.addClass(CT.$("addContentFont"+num),'marquee_self');
		}
    },
    /**
	 *  离开光标
	 *  离开光标的同时要关闭滚动文字
	 *  @param num 序号
	 */
	blurEvent:function(num){
		var _this =this;
		CT.removeClass(CT.$("addContentFont"+num),'marquee_self');
	},
    /**
     *  1.开启或关闭视频
	 *  2.隐藏或显示小视频位置的补图
     *  @param top 当前光标的top值
     */
	videoHidden:function(top){
		/*var _this = this;
		if(top>560){
		   //关闭小视频
		    CT.show(CT.$("videoImg"));
		    if(_this.isOnPlay){
                videoPlayer.exitPage();
                _this.isOnPlay = false;
                if(videoPlayer.timer){
                    clearInterval(videoPlayer.timer);
                    videoPlayer.timer = null;
                }
            }
		}else{
			//开启小视频
		   CT.hide(CT.$("videoImg"));
		   if(!_this.isOnPlay){
               _this.playSmallVideo();
               _this.isOnPlay = true;
           }

		}*/
	},
    /**
     *  创建瀑布流推荐位的dom
	 *  从接口返回数据中取出图片的地址、宽、高
     *  注：此时所有的推荐位只创建Dom和赋值width、height、src等属性，其中定位都是top:0;left:0;
	 *  一些特殊需求可在此方法里处理，例如底图和光标图的层级关系、显示光标图（默认不显示）
     */
    createImgDom : function () {
        var _this = this;
        //推荐位文字描述
		var contentText = null;
		//推荐位的显示图片 信息
		var contentImgInfo = null;
		//推荐位的光标图片 信息
		var selectBorderImgInfo = null;
		//存储创建元素
		var elm = null ;
		//存储拼接的DOM
		var obj=null;
		//存储每个推荐位的按钮
		var button = null;
		//所有数据
        recommendObj = _this.pinterestData || [{}];
        //循环所有数据
        for (var i = 0,len=recommendObj.length;i < len;i++){
			//整理more1数据
			_this.moer1DataJson.push(_this.getMore1(recommendObj[i].recommendDisplayValue));
			//推荐位文字描述,取cartoonName或picCname
            contentText = (recommendObj[i].recommendPic && recommendObj[i].recommendPic.picCname )|| "";
            //推荐位的显示图片 信息，位防止报错，默认{"picCname": "","picH": "","picPath": "","picW": ""}
			contentImgInfo = recommendObj[i].recommendPic || {"picCname": "","picH": "","picPath": "","picW": ""};
			selectBorderImgInfo = recommendObj[i].recommendLabelpic || {"picCname": "","picH": "","picPath": "","picW": ""};
            elm = document.createElement("div");
            elm.id = "contentBox" + i;
			//光标
			obj = "<div id='hands_x0_y0_addContent"+i+"_' style='position: absolute;top:0px;left:0px;width:"+contentImgInfo.picW+"px;height:"+contentImgInfo.picH+"px;'><img id='addContent"+i+"' style='visibility:"+(_this.moer1DataJson[i].isShowSelectedImg == 'true'?'visible':'hidden')+"' src='"+AjaxConfig.imgUrl+selectBorderImgInfo.picPath+"'>";
            obj += "<div class='morePonts fontCss' id='addContentFont"+i+"' style='visibility:"+(_this.moer1DataJson[i].isShowFont == 'true'?'visible':'hidden')+";width:"+(contentImgInfo.picW-17)+"px;'>"+ contentText + "ll"+contentText+"pp"+contentText +"</div>";
			obj += "</div>";
			//底图
			obj +="<img id='addContentImg"+i+"' style='position: absolute;top:0px;left:0px;' src='"+AjaxConfig.imgUrl+contentImgInfo.picPath+"'>";
			elm.innerHTML = obj;
            _this.parentBox.appendChild(elm);
			//创建按钮
            button = _this.setBtnObj({
                index : i,
                selectBorderImgUrl : selectBorderImgInfo.picPath,
				isShowSelectedImg : _this.moer1DataJson[i].isShowSelectedImg,
                TempData : recommendObj[i]
            })
            buttons.push(button);
        }
    },
    /**
     *  获取arr数组中值为minH的值在数组中的索引
	 *  @param arr 要比较的数组
	 *  @returns {*}
     */
    getMinHeightKey : function (arr){
        arr = arr || [{}];
        var minIndex = 0;
        for(var i=0,len=arr.length;i<len;i++){
            if(arr[i].h < arr[minIndex].h){
                minIndex = i;
            }
        }
        return arr[minIndex];
    },
    /**
     * 获取数组中值为MaxH的值在数组中的索引
     * @param arr 要比较的数组
     * @returns {*}
     */
    getMaxHeightKey : function (arr){
        arr = arr || [{}];
        var Index = 0;
        for(var i=0,len=arr.length;i<len;i++){
            if(arr[i].h >= arr[Index].h){
                Index = i;
            }
        }
        return arr[Index];
    },
	/**
     * 判断数组中的推荐位是否齐平
	 * 先求出平均值，如果最大值和平均值相差小于10，则表示齐平，10表示误差大小
     * @param arr 要比较的数组
     * @returns {*}
     */
    isAllEquall : function (arr) {
       var _this = this;
       arr = arr || [{}]
       var sum = 0;
       var averageNum = 0;
       var len = arr.length;
       for(var i = 0;i < len; i++){
           if(arr[i].h > 0){
               sum += arr[i].h
           }
       }
       if (sum == 0){
           return {result:true,averageNum:0};
       }
       averageNum = sum / len;

       if(_this.getMaxHeightKey(arr).h - averageNum  > 10){
            return {result:false,averageNum:0};
       }
       return {result:true,averageNum:averageNum};
    } ,
     /** 
	  *  瀑布流推荐位的定位
	  *  遍历所有的瀑布流数据，通过计算分别赋值top，left的值，光标图和底图一起改变定位
	  *  计算的步骤
	  *  1.当前推荐位是否需要换行，当left+width <1280不需要，可以直接left=curRowLeft;top=curRowTop
	  *  2.当left+width >1280需要换行，再判断当前数组comPareArray中存在的推荐位是否齐平，如果齐平则制空数组comPareArray，此时的curRowTop就等于平均值;可以直接left=curRowLeft;top=curRowTop，重复步骤1
	  *  3.如果不齐平，找到最小点，判断当前宽+10是否大于最小点推荐位的宽，10表示误差大小，如果大于需要改变最小值的top，如果不大于需要改变最小值的left
	  *  注：每一次的计算最后都要把当前的推荐位信息添加到数组comPareArray中
	  *  
	  *  每次循环的最后判断此推荐位是否上下架：CT.isBooleanUp
	  */
     setImgDomPosition : function () {
        var _this = this;
		//当前推荐位left值，遇到齐平情况会恢复初始值
        var curRowLeft = _this.defaultLeft;
		//当前推荐位Top值，无限增加
        var curRowTop = _this.defaultTop ;
        var curClassDom = null;//当前元素的dom对象
        var curClassDomInfo = {};//当前元素坐标参数
        //遍历当前取到的瀑布流块
        for(var i = 0,len = _this.pinterestData.length; i < len; i++){
            CT.$("hands_x0_y0_addContent"+ i +"_" ).style.display = "block";
            curClassDom = CT.$("hands_x0_y0_addContent"+i+"_");
            curClassDomInfo = CT.getCurClassObjInfo(curClassDom);
			if((curRowLeft + curClassDomInfo.width)< 1280){
				curClassDom.style.left = curRowLeft + "px";//最左边
                curClassDom.style.top = curRowTop + "px";    //最top
				CT.$("addContentImg"+i).style.left = curRowLeft + "px";//最左边
				CT.$("addContentImg"+i).style.top = curRowTop + "px";    //最top
                _this.comPareArray[_this.comPareArrayIndex] = {
                    h : curRowTop + curClassDomInfo.height , //当前元素的 top + height 高度
                    left : curRowLeft, //当前元素的 left + width 宽度
                    width : curClassDomInfo.width,
                    domIndex : i, //当前元素当前在dom中的下标
                    curRowTop : curRowTop, //当前元素 top 值
                    curIndex : _this.comPareArrayIndex, //在当前数组下标
                }
				 curRowLeft += curClassDomInfo.width;
                _this.comPareArrayIndex ++;
            }else{
			    //寻找最小
                var isAllEquallResult = _this.isAllEquall(_this.comPareArray);
				if(isAllEquallResult.result){
				    curRowLeft = _this.defaultLeft;
					curRowTop  = parseInt(isAllEquallResult.averageNum)+1;
					_this.comPareArray=[];
					_this.comPareArrayIndex = 0;
                    //归零之后 加一
					curClassDom.style.left = curRowLeft+"px";//最左边
					curClassDom.style.top = curRowTop + "px";    //最top
					CT.$("addContentImg"+i).style.left = curRowLeft + "px";//最左边
				    CT.$("addContentImg"+i).style.top = curRowTop + "px";    //最top
					_this.comPareArray[_this.comPareArrayIndex] = {
						h : curRowTop + curClassDomInfo.height , 
						left : curRowLeft,
						width : curClassDomInfo.width,
						domIndex : i, 
						curRowTop : curRowTop, 
						curIndex : _this.comPareArrayIndex,
					}
					_this.comPareArrayIndex ++;
				}else{
					var getMinHObj = _this.getMinHeightKey(_this.comPareArray);
					curRowTop = getMinHObj.h  + curClassDomInfo.height;
					curClassDom.style.left = getMinHObj.left + "px";
					curClassDom.style.top = getMinHObj.h + "px";
					CT.$("addContentImg"+i).style.left = getMinHObj.left + "px";//最左边
				    CT.$("addContentImg"+i).style.top = getMinHObj.h + "px";    //最top
					if((curClassDomInfo.width + 10 )>= getMinHObj.width ){
						curRowTop = _this.comPareArray[getMinHObj.curIndex].h + curClassDomInfo.height;
					    _this.comPareArray[getMinHObj.curIndex].h = getMinHObj.h + curClassDomInfo.height ;
					}else{
					   _this.comPareArray[getMinHObj.curIndex].left = getMinHObj.left + curClassDomInfo.width ;
					}
					_this.comPareArray[_this.comPareArrayIndex] = {
						h : curRowTop , 
						left : curRowLeft + curClassDomInfo.width, 
						width : curClassDomInfo.width,
						domIndex : i, 
						curRowTop : curRowTop, 
						curIndex : _this.comPareArrayIndex, 
					}
					_this.comPareArrayIndex ++;
				}
				curRowLeft += curClassDomInfo.width;
			}
			if(i == len -1){
                _this.parentBoxHeight = CT.getDomInfo(curClassDom,'top') + curClassDomInfo.height;
            }
			CT.isBooleanUp(AjaxConfig.commonPageInfo.recommend_1[i].booleanUp,"hands_x0_y0_addContent"+i+"_",'contentBox'+i);
        }
    },
	/**
	 *  播放小视频
	 */
    playSmallVideo:function(){
        var _this = this;
        var cartoonId = page.pinterestData[1].recommendDisplayValue;
        interface.findVideoListByCartoonId({params:{cartoonId: cartoonId},ajaxConfig:{async:true}},function(res){
            try {
                var mediaCode = res.data[0].movieDetails[0].playUrl || "7a21188f3b5149f0aeeda017cebf3416";
                
                videoPlayer.SmallPlay(mediaCode,{
                    top : 145,
                    left : 255,
                    height : 230,
                    width : 350,
                    t: 120000,
					smallVideoInfo: res.data[0]
                });
            }catch (e) {
                interface.loggerInfo("播放小视频e=" + ajax.jsonToString(e))
            }
        });
    },
	/**
     *  跳转
	 *  眉头跳转、瀑布流推荐位跳转、"返回到顶部"
	 *  如果是瀑布流的跳转先判断产品是否已经下线，下线不跳转
     *  @param type 跳转的类型：bottom瀑布流推荐位跳转、Mid中间眉头跳转、Right右侧眉头跳转
     *  @param num 序号
     */
	toJump:function(type,num){
		var _this =this;
		//"返回到顶部"按钮
		if(_this.moer1DataJson[num].toTop == 'true'){//返回到顶部
		   CT.$("main").style.top =  "0px";
		   PAGE.changeFocus("hands_x0_y0_addContent0_");
		   return;
		}
		//已下线产品没有跳转
		if((type.indexOf("bottom") > -1) && _this.pinterestData[num].booleanUp == 0){
		   return;
		}
		//剩下正常的跳转，先记录跳转离开之前的光标
		PAGE.otherPageParam = "&contentId="+_this.contentId+"&contentEName="+basePageInfo.commonPageInfo.pageInfo.commPageEname+"&contentCName="+basePageInfo.commonPageInfo.pageInfo.commPageCname + "&contentType=" + CT.requestValue("contentType") + "&curFocusId="+curFocus.FocusID+"&mainTop="+CT.$("main").style.top;
		CT.goPage();
        //CT.writeInfo("开始跳转>>>>>>>>>>>>");
        if(type.indexOf("bottom") > -1){  //瀑布流
		    CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo,"recommend_1",num);
		}else if(type.indexOf("Mid")> -1){   //中间眉头
            //CT.writeInfo("中间眉头开始跳转>>>>>>>>>>>>");
		    CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo.pageInfo.commonPageInfo,"recommend_2",num);
		}else if(type.indexOf("Right")> -1){   //右侧眉头
		    CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo.pageInfo.commonPageInfo,"recommend_3",num);
		}
	}
};
page.init();

/**
 *  返回
 *  页面返回分两种：1.热门->推出拦截页（或退出平台） 2.综艺秀->热门 （热门、综艺秀用的同一个页面模版）
 *  navBarObj.showNavSelectedId == 0 热门
 *  navBarObj.showNavSelectedId == 6 综艺秀
 */
function backFunc(){
	if(navBarObj.showNavSelectedId == 0){
	    //推出拦截页
		if(AjaxConfig.commonPageInfo.recommend_2 && AjaxConfig.commonPageInfo.recommend_2[0]){
            CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo,"recommend_2",0);
        }else{
            CT.commonJumpUrl(AjaxConfig.projectUrl + "HD/web/interceptePage/html/interceptePage.html?contentId=85");
        }
		//退出平台,添加退出日志
		//CT.exitPlatform();
	}else{
	    CT.backPage();
	}
}
