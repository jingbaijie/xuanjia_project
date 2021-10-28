var OutJson = "";
var cartoonId = "tqxqw";
var buttons = [];
var Privilege = function () {
	this.imgUrl = AjaxConfig.imgUrl;
	this.imgWidth = 0;
	this.imgHeight = 0;
	this.largeArr = [];                                                         //存放大图地址
	this.normalArr = [];                                                        //存放小图地址
    this.tipArr = [];
	this.isFirstFocus = false;
	this.main = document.getElementById("main");                                //背景DOM
    this.liPic = document.getElementById("liPic");                              //存放图片的地址
    this.liLabelPic = document.getElementById("liLabelPic");
	this.focusDiv = document.getElementById("focusDiv");                        //存放焦点的DOM
	this.liArr = document.getElementById("liLabelPic").getElementsByTagName("li");   //获取页面有几个小图
	this.getImgHeight = function(imgUrl){
		if(imgUrl){
			var imgHeight = imgUrl.substring(imgUrl.lastIndexOf("+") + 1,imgUrl.lastIndexOf("."));
		}else{
			var imgHeight = "0";
		}
		return parseInt(imgHeight);
	};
	this.getImgWidth = function(imgUrl){
		if(imgUrl){
			var imgWidth = imgUrl.substring(imgUrl.lastIndexOf("_") + 1,imgUrl.lastIndexOf("+"));
		}else{
			var imgWidth = "0";
		}
		return parseInt(imgWidth);
	};
    this.render = function (data) {                                         //渲染页面的DOM结构
		if(data.recommend_1 && data.recommend_1.length > 0){
			this.imgWidth = parseInt(data.recommend_1[0].recommendLabelpic.picW);
			this.imgHeight = parseInt(data.recommend_1[0].recommendLabelpic.picH);
			this.liPic.style.width = this.imgWidth * data.recommend_1.length + "px";
			this.liLabelPic.style.width = this.imgWidth * data.recommend_1.length + "px";
		}
		for(var i =0 ;i<data.recommend_1.length;i++){
			var opt = data.recommend_1[i];
			var urlImg = this.imgUrl+opt.recommendLabelpic.picPath;
			var urlImg2 = this.imgUrl+opt.recommendPic.picPath;
			this.normalArr.push(urlImg2);
			this.largeArr.push(urlImg);
			this.tipArr.push(null); 
			for(var z = 0; z < opt.pageRecommendConfigTabVos.length; z++){
				if(opt.pageRecommendConfigTabVos[z].picType == "2" && !this.tipArr[i]){
					this.tipArr[i] = opt.pageRecommendConfigTabVos[z].picLibraryTab;
				}
			}
		}
        this.main.style.background = "url("+this.imgUrl+ data.pageInfo.pageTemplateBgpic.picPath+") no-repeat";
        var arr = this.normalArr;
        var str1 = "";
        var str2 = "";
		var str3 = "";
		var str4 = "";
        for (var i = 0; i < arr.length; i++) {
            //str1 += "<li style='background:url("+arr[i]+") center no-repeat'></li>";
			str1 += "<li style = 'position: absolute;top: 0;left: "+ parseInt(data.recommend_1[i].recommendLabelpic.picW)*i +"px;width:"+ data.recommend_1[i].recommendLabelpic.picW +"px;height: "+ data.recommend_1[i].recommendLabelpic.picH +"px;'>"
			+"<img src='./images/empty.png'>"
			+"</li>";
			str3 += "<li style = 'width: "+ 166 +"px;height: "+ 233 +"px;position: absolute;top: 0;left: "+ parseInt(data.recommend_1[i].recommendLabelpic.picW)*i +"px;'>"
			+"<img style = 'position: absolute;top: 8px;left: 25px;' src = '"+arr[i]+"'>"
			
			if(this.tipArr[i]){
				str3 += "<img style = 'width: "+ this.tipArr[i].picW +"px;height: "+ this.tipArr[i].picH +"px;position: absolute;top: -2px;left: 100px;' src = '"+ (this.tipArr[i].picPath || "./images/empty.png") +"'>";
			}
			str3 += "</li>";
        }
        this.liPic.innerHTML = str3;
		this.liLabelPic.innerHTML = str1;

		var upFocus = "disable";
		var downFocus = "disable";
		if(data.recommend_2 && data.recommend_2.length > 0 && data.recommend_2[0].recommendLabelpic){
			var backTop =  50; //data.recommend_2[0].recommendLabelpic.yValue;
			var backLeft = 1000//data.recommend_2[0].recommendLabelpic.xValue;
			var backWidth = data.recommend_2[0].recommendLabelpic.picW;
			var backHeight = data.recommend_2[0].recommendLabelpic.picH;
			var backImg = "";
			if(data.recommend_2[0].recommendPic){
				var backT = 50;//data.recommend_2[0].recommendPic.yValue;
				var backL = 1000;//data.recommend_2[0].recommendPic.xValue;
				var backW = data.recommend_2[0].recommendPic.picW;
				var backH = data.recommend_2[0].recommendPic.picH;
				backImg += "<img src = '"+ this.imgUrl + data.recommend_2[0].recommendPic.picPath +"' style = 'position: absolute;top: "+ backT +"px;left: "+ backL +"px;width: "+ backW +"px;height: "+ backH +"px;'>"
			}
			var backHtml = backImg + "<div id = 'hands_x0_y0_backFocus_' style = 'position: absolute;top: "+ backTop +"px;left: "+ backLeft +"px;width: "+ backWidth +"px;height: "+ backHeight +"px;'>"
				+"<img id = 'backFocus' src = '"+ this.imgUrl + data.recommend_2[0].recommendLabelpic.picPath +"' style = 'visibility: hidden;'>"
				+"</div>";
			
			this.focusDiv.innerHTML += backHtml;
			buttons.push({
				id: "hands_x0_y0_backFocus_",
				clickHandler: "javascript: backfunc()",
				up: "disable",
				downEvent: "javascript: freeFriday.backPre()",
				leftEvent: "javascript: freeFriday.backPre()",
				right: "disable",
				focusType: 7
			});
			upFocus = "hands_x0_y0_backFocus_";
		}
		if(data.recommend_3 && data.recommend_3.length > 0 && data.recommend_3[0].recommendLabelpic){
			var otherTop = 635;//data.recommend_3[0].recommendLabelpic.yValue;
			var otherLeft = 545;//data.recommend_3[0].recommendLabelpic.xValue;
			var otherWidth = data.recommend_3[0].recommendLabelpic.picW;
			var otherHeight = data.recommend_3[0].recommendLabelpic.picH;
			var otherImg = "";
			if(data.recommend_2[0].recommendPic){
				var otherT = 635;//data.recommend_3[0].recommendPic.yValue;
				var otherL = 545;//data.recommend_3[0].recommendPic.xValue;
				var otherW = data.recommend_3[0].recommendPic.picW;
				var otherH = data.recommend_3[0].recommendPic.picH;
				otherImg += "<img src = '"+ this.imgUrl + data.recommend_3[0].recommendPic.picPath +"' style = 'position: absolute;top: "+ otherT +"px;left: "+ otherL +"px;width: "+ otherW +"px;height: "+ otherH +"px;'>"
			}
			var otherHtml = otherImg + "<div id = 'hands_x0_y0_otherFocus_' style = 'position: absolute;top: "+ otherTop +"px;left: "+ otherLeft +"px;width: "+ otherWidth +"px;height: "+ otherHeight +"px;'>"
				+"<img id = 'otherFocus' src = '"+ this.imgUrl + data.recommend_3[0].recommendLabelpic.picPath +"' style = 'visibility: hidden;'>"
				+"</div>";
			this.focusDiv.innerHTML += otherHtml;
			buttons.push({
				id: "hands_x0_y0_otherFocus_",
				clickHandler: "javascript: botJump()",
				upEvent: "javascript: freeFriday.backPre()",
				down: "disable",
				left: "disable",
				right: "disable",
				focusType: 7
			});
			downFocus = "hands_x0_y0_otherFocus_";
		}
        for(var j=0;j<data.recommend_1.length;j++){
            str2 +="<div id='hands_x0_y0_mainFocus"+j+"_' class='normal'>"+
                    "<img id='mainFocus"+j+"' src='./images/empty.png' style='visibility: hidden;'>"+
                    "</div>";
			if(j == 0){
				buttons.push({
					id: "hands_x0_y0_mainFocus"+ j +"_",
					clickHandler:"javascript:jumpUrl("+ j +")",
					otherFocusEvent:"javascript:freeFriday.changeImg("+ j +")",
					otherBlurEvent:"javascript:freeFriday.hideImg("+ j +")",
					left:"disable",
					right:"hands_x0_y0_mainFocus"+ (j + 1) +"_",
					up:upFocus,
					down:downFocus, 
					focusType:7
				});
			}else if(j == data.recommend_1.length - 1){
				buttons.push({
					id: "hands_x0_y0_mainFocus"+ j +"_",
					clickHandler:"javascript:jumpUrl("+ j +")",
					otherFocusEvent:"javascript:freeFriday.changeImg("+ j +")",
					otherBlurEvent:"javascript:freeFriday.hideImg("+ j +")",
					left:"hands_x0_y0_mainFocus"+ (j - 1) +"_",
					right:"disable",
					up:upFocus,
					down:downFocus, 
					focusType:7
				});
			}else{
				buttons.push({
					id: "hands_x0_y0_mainFocus"+ j +"_",
					clickHandler:"javascript:jumpUrl("+ j +")",
					otherFocusEvent:"javascript:freeFriday.changeImg("+ j +")",
					otherBlurEvent:"javascript:freeFriday.hideImg("+ j +")",
					left:"hands_x0_y0_mainFocus"+ (j - 1) +"_",
					right:"hands_x0_y0_mainFocus"+ (j + 1) +"_",
					up:upFocus,
					down:downFocus, 
					focusType:7
				});
			}
        }
        this.focusDiv.innerHTML += str2;
    };
    this.focusCookie = function () {
		var columnBackFocus = CT.querySearchUrlKey(window.location.href,"columnLeaveFocus")+"";
		PAGE.focusInit();
		if(document.getElementById(columnBackFocus)){
			PAGE.changeFocus(columnBackFocus);
		}else{
			PAGE.changeFocus("hands_x0_y0_mainFocus0_");
		}
    };
	this.backPre = function(){
		if(curFocus.lastFocusId && curFocus.lastFocusId != curFocus.FocusID && document.getElementById(curFocus.lastFocusId)){
			PAGE.changeFocus(curFocus.lastFocusId);
		}else{
			PAGE.changeFocus("hands_x0_y0_mainFocus0_");
		}
	};
	this.changeImg = function (n) {                                             //获得焦点显示大图
		if(!this.isFirstFocus && parseInt(CT.querySearchUrlKey(window.location.href,"backLeft"))){
			this.isFirstFocus = true;
			var backLeft = CT.querySearchUrlKey(window.location.href,"backLeft");
			this.liPic.style.left = backLeft + "px";
			this.liLabelPic.style.left = backLeft + "px";
		}else{
			var liPicLeft = parseInt(this.liPic.style.left);
			var curImgLeft = this.imgWidth * n + liPicLeft;
			var curImgRight = this.imgWidth * (n + 1) + liPicLeft;
			if(curImgLeft >= 0){
				var curImgLeftCut = 1280 - curImgLeft;
			}else{
				var curImgLeftCut = 0 - curImgLeft;
			}
			var curImgRightCut = this.imgWidth - curImgLeftCut;
			if(curImgLeft < 0){
				var moveDis = 1280 - curImgRightCut;
				if(liPicLeft + moveDis <= 0){
					this.liPic.style.left = liPicLeft + moveDis + "px";
					this.liLabelPic.style.left = liPicLeft + moveDis + "px";
				}else{
					this.liPic.style.left = "45px";
					this.liLabelPic.style.left = "45px";
				}
			}else if(curImgRight > 1280){
				var moveDis = 1280 - curImgLeftCut;
				var minLeft = 0 - this.imgWidth * OutJson.recommend_1.length + 1280;
				if(liPicLeft - moveDis < minLeft){
					this.liPic.style.left = minLeft - 45 + "px";
					this.liLabelPic.style.left = minLeft - 45 + "px";
				}else{
					this.liPic.style.left = liPicLeft - moveDis + "px";
					this.liLabelPic.style.left = liPicLeft - moveDis + "px";
				}
			}
		}
		this.liArr[n].getElementsByTagName("img")[0].style.visibility = "visible";
		this.liArr[n].getElementsByTagName("img")[0].src = this.largeArr[n];
	};
	this.hideImg = function (n) {                                               //获得焦点显示小图
         this.liArr[n].getElementsByTagName("img")[0].style.visibility = "hidden";
	};
};
/*Privilege.prototype.moveRight = function (n,s) {                                //向右移动滚动
	document.getElementById("liPic").style.left = n*(1205)+"px";
	document.getElementById("liLabelPic").style.left = n*(1205)+"px";
	// this.animate(document.getElementById("liPic"),n*1205);
	this.defineCurrent("main",s);
};
Privilege.prototype.moveLeft = function (n,s) {                                //向左移动滚动
	document.getElementById("liPic").style.left = n*(-1205)+"px";
	document.getElementById("liLabelPic").style.left = n*(-1205)+"px";
	// this.animate(document.getElementById("liPic"),n*(-1205));
	this.defineCurrent("main",s);
};*/
Privilege.prototype.defineCurrent = function(dir,n) {                         //切换焦点
	curFocus.defaultBlur();
	curFocus = getFocusModel6("hands_x0_y0_"+dir+"Focus"+n+"_");
	curFocus.defaultFocus();
};
Privilege.prototype.animate = function (ele,target) {                        //移动动画
	clearInterval(ele.timer);
	var num = parseInt(ele.style.left) || 0;
	ele.timer = setInterval(function () {
		var step =0;
		step = (target - num)/10;
		num += step;
		ele.style.left = num +"px";
		if(Math.abs(target - num)<Math.abs(step)){
			ele.style.left = target +"px";
			clearInterval(ele.timer);
		}
	},20);
};
/*
*
*从眉头获取专题action用以区分专题内容
*
*/
function getGeneralAction(){
	var reg = new RegExp("(^|&)contentEName=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return  unescape(r[2]);
	}else{
		return null;
	}
}
Privilege.prototype.init = function () {                                  //页面初始化
    var self = this;
	ajax.init({
		url:AjaxConfig.interfaceUrl +'findRecCommonPageInfo',
		method:'get',
		params:{
			contentName: getGeneralAction()
		},
		async:false,
		ContentType:'json',
		success:function(data){
			// 通用日志
			setLoggerInfo.pageInfoLog = data;
			if(data.successFlg == "1"){
				OutJson = data.data;
				document.title = OutJson.pageInfo.commPageCname;
				self.render(OutJson);
				/*if(buttons[OutJson.recommend_1.length - 1]){
					buttons[OutJson.recommend_1.length - 1].right = "disable";
				}
				for(var i = OutJson.recommend_1.length; i < buttons.length; i++){
					buttons[i].enFocus = false;
				}*/
				self.focusCookie();
			}else{
				OutJson = [];
			}
		},
		fail:function(status){
		}
	});
};
var freeFriday = new Privilege();
freeFriday.init();
function jumpUrl(n) {
	PAGE.otherPageParam = "&contentEName="+CT.querySearchUrlKey(window.location.href,"contentEName") + "&columnLeaveFocus=" + curFocus.FocusID + "&backLeft=" +parseInt(document.getElementById("liLabelPic").style.left);
	CT.goPage();
    if(OutJson.pageInfo.more1 && OutJson.pageInfo.more1.indexOf("free") != -1 || (OutJson.recommend_1[n].more1+"").indexOf("free") > -1 || freeFriday.tipArr[n]){
		CT.toAnterRecommendUrl(OutJson,"recommend_1",n);
	}else{
		orderJs.columnGetAuth(function(data){
			if(data == "0"){
				CT.toAnterRecommendUrl(OutJson,"recommend_1",n);
			}else{
				orderJs.columnToOrderPage(getGeneralAction());
			}
		});
	}
}
function botJump(){
	PAGE.otherPageParam = "&contentEName="+CT.querySearchUrlKey(window.location.href,"contentEName") + "&columnLeaveFocus=" + curFocus.FocusID;
	CT.goPage();
	CT.toAnterRecommendUrl(OutJson,"recommend_3",0);
}
function backfunc(){
	if(OutJson && OutJson.recommend_2 && OutJson.recommend_2[0] && OutJson.recommend_2[0].recommendDisplayType != "88"){
		CT.toAnterRecommendUrl(OutJson,"recommend_2",0);
	}else{
		CT.backPage();
	}
}

