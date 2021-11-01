var interceptePage = {
	    //页面id
	    contentId:basePageInfo.commonPageInfo.pageInfo.commonPageId || 1,
		//页面数据
		commonPageInfo:basePageInfo.commonPageInfo,
		//四个推荐位的定位
		topRecommendPosition:[
			{top:83,left:63},{top:220,left:256},{top:230,left:765},{top:100,left:965}
		],
		//两个推荐位的定位（继续和离开）
		bottomRecommendPosition:[
			{top:565,left:276},{top:565,left:753}
		],
        //初始化页面
		init:function(){
			 var _this = this;
			 //请求页面的数据
				//创建并显示上面四个推荐位
				_this.showTopRecommend();
				//创建并显示下面两个推荐位
				_this.showBottomRecommend();
				//默认焦点
				PAGE.focusInit();
				PAGE.changeFocus("hands_x0_y0_bottomRecommend0_");
		},
		//创建四个推荐位
		showTopRecommend:function(){
			var _this = this;
			var len = _this.commonPageInfo.recommend_1.length;
			var topRecommendHtml = "";
			var topRecommendBtn = null;
			for(var i = 0;i<4;i++){
				topRecommendHtml += "<div class='btn' id='topRecommendDiv"+i+"' style='top:"+_this.topRecommendPosition[i].top+"px;left:"+_this.topRecommendPosition[i].left+"px;'><img class='btn'src='"+AjaxConfig.imgUrl+_this.commonPageInfo.recommend_1[i].recommendPic.picPath+"'>";//底图
				topRecommendHtml += "<div class='btn' id='hands_x0_y0_topRecommend"+i+"_' style='width:245px;height:306px;top:0px;left:0px;'><img id='topRecommend"+i+"' style='visibility: hidden;' src='"+AjaxConfig.imgUrl+_this.commonPageInfo.recommend_1[i].recommendLabelpic.picPath+"'></div>";//光标图
				topRecommendHtml += "</div>";
				topRecommendBtn = {
					id:"hands_x0_y0_topRecommend"+i+"_",
					clickHandler:"javascript:interceptePage.goSomeWhere("+i+")",
					left:"hands_x0_y0_topRecommend"+(i-1)+"_",
					right:"hands_x0_y0_topRecommend"+(i+1)+"_",
					up:"disable",
					down:"disable",
					focusType: 7
				}; 
				if(i==0){
					topRecommendBtn.left="disable";
				}else if(i == 3){
					topRecommendBtn.right="disable";
				}
				if(i == 0|| i == 1){
					topRecommendBtn.down = "hands_x0_y0_bottomRecommend0_";
				}else{
					topRecommendBtn.down = "hands_x0_y0_bottomRecommend1_";
				}
				buttons.push(topRecommendBtn);
			}
			CT.$("topRecommend").innerHTML = topRecommendHtml;
			//判断上下架
			_this.isBooleanUp();
		},
		//上下架
		isBooleanUp:function(){
			var _this = this;
			var recommendData = _this.commonPageInfo.recommend_1;
			for(var i=0;i<recommendData.length;i++){
				CT.isBooleanUp(recommendData[i].booleanUp,"hands_x0_y0_topRecommend"+i+"_","topRecommendDiv"+i);
			}
		},
		//创建四个推荐位
		showBottomRecommend:function(){
			var _this = this;
			var len = _this.commonPageInfo.recommend_2.length;
			var bottomRecommendHtml = "";
			var bottomRecommendBtn = null;
			for(var i = 0;i<len;i++){
				bottomRecommendHtml += "<div class='btn' style='top:"+_this.bottomRecommendPosition[i].top+"px;left:"+_this.bottomRecommendPosition[i].left+"px;'><img class='btn'src='"+AjaxConfig.imgUrl+_this.commonPageInfo.recommend_2[i].recommendPic.picPath+"'>";//底图
				bottomRecommendHtml += "<div class='btn' id='hands_x0_y0_bottomRecommend"+i+"_' style='top:0px;left:0px;'><img id='bottomRecommend"+i+"' style='visibility: hidden;' src='"+AjaxConfig.imgUrl+_this.commonPageInfo.recommend_2[i].recommendLabelpic.picPath+"'></div>";//光标图
				bottomRecommendHtml += "</div>";
				bottomRecommendBtn = {
					id:"hands_x0_y0_bottomRecommend"+i+"_",
					left:"hands_x0_y0_bottomRecommend"+(i-1)+"_",
					right:"hands_x0_y0_bottomRecommend"+(i+1)+"_",
					up:"disable",
					down:"disable",
					focusType: 7
				}; 
				if(i==0){//继续
					bottomRecommendBtn.left="disable";
					bottomRecommendBtn.up="hands_x0_y0_topRecommend1_";
					bottomRecommendBtn.clickHandler="javascript:interceptePage.continuePlay()";
				}else if(i == len-1){//退出平台
					bottomRecommendBtn.right="disable";
					bottomRecommendBtn.up="hands_x0_y0_topRecommend2_";
					bottomRecommendBtn.clickHandler="javascript:interceptePage.exitPlatform()";
				}
				buttons.push(bottomRecommendBtn);
			}
			CT.$("bottomRecommend").innerHTML = bottomRecommendHtml;

		},
		//上面四个推荐位的跳转
		goSomeWhere:function(num){
			var _this = this;
			PAGE.otherPageParam = "&contentId="+_this.contentId+"&contentEName="+basePageInfo.commonPageInfo.pageInfo.commPageEname+"&contentCName="+basePageInfo.commonPageInfo.pageInfo.commPageCname;
			CT.goPage();
			if(_this.commonPageInfo.recommend_1[num].booleanUp != 0){//上下架
				CT.toAnterRecommendUrl(_this.commonPageInfo,"recommend_1",num);
		    }
		},
		//继续玩，去首页
		continuePlay:function(){
			var _this = this;
			CT.toAnterRecommendUrl(_this.commonPageInfo,"recommend_2",0);
		},
		//退出平台
		exitPlatform:function(){
			var _this = this;
			//去退出中转页
            // interface.loggerInfo("exit method,退出拦截页直接调用退出平台方法。");
			CT.toAnterRecommendUrl(_this.commonPageInfo,"recommend_2",1);
			//直接调用退出方法
			// CT.exitPlatform();
		}
		

};
interceptePage.init();
//返回
function backFunc(){
	interceptePage.continuePlay();
}