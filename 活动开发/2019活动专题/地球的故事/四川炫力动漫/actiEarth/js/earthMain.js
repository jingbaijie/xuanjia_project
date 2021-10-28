/* 初始化全局变量 */
var chanceNum=1;                                                        // 初始答题次数
var maxChance = 1;														//最大答题次数
var usedNum = 0;                                                              // 用户今日答题次数
var actiDate = '' + (new Date().getMonth() + 1) + new Date().getDate();   // 用户存取信息标记
var isOrder;                                                              // 鉴权值 
var isUserData;                                                           // 判断用户今日是否看过视频
var userDataList;

/* 焦点初始化 */
var buttons = [
    {
        id: "hands_x0_y0_leftArrowFocus_",
        clickHandler: "javascript: scrollImg._clickLeft()",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_rightArrowFocus_",
        up: "disable",
        downEvent: "javascript: scrollFocus()",
        focusType: 7
    },
    {
        id: "hands_x0_y0_rightArrowFocus_",
        clickHandler: "javascript: scrollImg._clickRight()",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "hands_x0_y0_leftArrowFocus_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_startFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_bearFocus1_",
        clickHandler: "javascript: goSomeWhere(4);",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_startFocus_",
        up: "hands_x0_y0_leftArrowFocus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_dogFocus1_",
        clickHandler: "javascript: goSomeWhere(5);",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_startFocus_",
        up: "hands_x0_y0_leftArrowFocus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_planeFocus_",
        clickHandler: "javascript: goSomeWhere(6);",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_startFocus_",
        up: "hands_x0_y0_leftArrowFocus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_bearFocus_",
        clickHandler: "javascript: goSomeWhere(7);",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_startFocus_",
        up: "hands_x0_y0_leftArrowFocus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_dogFocus_",
        clickHandler: "javascript: goSomeWhere(8);",
        otherFocusEvent: "javascript: scrollImg._quitAutoplay()",
        otherBlurEvent: "javascript: scrollImg._beginAutoplay()",
        left: "disable",
        right: "hands_x0_y0_startFocus_",
        up: "hands_x0_y0_leftArrowFocus_",
        down: "disable",
        focusType: 7
    },
    /* 列表按钮 */
	{
	    id: "hands_x0_y0_startFocus_",
        clickHandler: "javascript: startGame()",
        leftEvent: "javascript: scrollFocus()",
        right: "disable",
        up: "hands_x0_y0_rightArrowFocus_",
        down: "hands_x0_y0_ruleFocus_",
        focusType: 7
	},
    {
        id: "hands_x0_y0_ruleFocus_",
        clickHandler: "javascript: goSomeWhere(1)",
        leftEvent: "javascript: scrollFocus()",
        right: "disable",
        up: "hands_x0_y0_startFocus_",
        down: "hands_x0_y0_prizeListFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_prizeListFocus_",
        clickHandler: "javascript: goSomeWhere(2)",
        leftEvent: "javascript: scrollFocus()",
        right: "disable",
        up: "hands_x0_y0_ruleFocus_",
        down: "hands_x0_y0_exchangeFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_exchangeFocus_",
        clickHandler: "javascript: goSomeWhere(3)",
        leftEvent: "javascript: scrollFocus()",
        right: "disable",
        up: "hands_x0_y0_prizeListFocus_",
        down: "hands_x0_y0_returnFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_returnFocus_",
        clickHandler: "javascript: backfunc()",
        leftEvent: "javascript: scrollFocus()",
        right: "disable",
        up: "hands_x0_y0_exchangeFocus_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_confirmModalFocus_",
        clickHandler: "javascript: confirmModal()",
        left: "disable",
        right: "hands_x0_y0_backModalFocus_",
        up: "disable",
        down: "disable",
        focusType: 7
    }
];

/* 鉴权并初始化 */
function authInit(){
    orderJs.columnGetAuth(function(data){
        isOrder = data;
        // console.log(data)
        // isOrder = 0;
    })
	getChance();
    focusInit();
    curFocus = getFocusModel6("hands_x0_y0_startFocus_");
    curFocus.defaultFocus();
}
authInit();

// 获取用户当日答题次数
function getChance() {
	var _this = this;
	actiObj.getChance(function(data) {
		usedNum = parseInt(data.activityChance);
		chanceNum -= usedNum;
		_this.getUserNum();
	});
}
// 获取用户标记信息并计算答题机会
function getUserNum(){
	actiObj.getUserDataList(function(data) {
		var actiDate = '' + (new Date().getMonth() + 1) + new Date().getDate();			
		// console.log(chanceNum)
		if (data.resultMsg == "success"){
			userDataList=data.list[0].user_acti_data;
			if(actiDate == userDataList){
				isUserData=true;
				maxChance = 3;
			}else{
				maxChance = 1;
			}
			/*if(data.list[0].user_acti_data.split("_")[1]){
				maxChance= JSON.parse(data.list[0].user_acti_data.split("_")[1]);
			}			
			if(actiDate == data.list[0].user_acti_data.split("_")[0]) {								  
				    maxChance+=1;
					isUserData=true;
			}*/
		}else{
			maxChance = 1;
		}
		chanceNum = maxChance - usedNum;
		if(chanceNum < 0){
			chanceNum = 0;
		}
	})
}

/* 开始游戏 */
function startGame(){
	listLeft = parseInt(list.style.left);  
	if(listLeft === 0 || (listLeft >= -3840 && listLeft < -2560)){
		var name = "bearFocus";
	}else if((listLeft >= -1280 && listLeft < 0) || (listLeft >= -5120 && listLeft < -3840)){
		var name = "dogFocus";
	}else if(listLeft >= -2560 && listLeft < -1280){
		var name = "planeFocus";
	}
	listLeft = parseInt(list.style.left);     
	var actiTime = new Date().getTime();
	if(isOrder == "0"){		
		if(chanceNum < 1 && maxChance==1){
			content.innerHTML = "观看推荐视频获取两次答题机会";
			modalDiv.style.visibility = 'visible';
			changeFocus('hands_x0_y0_confirmModalFocus_');
		}else if(chanceNum < 1 && maxChance>=3){
			content.innerHTML = "今日次数已用光";
			modalDiv.style.visibility = 'visible';
			changeFocus('hands_x0_y0_confirmModalFocus_');
		}else {
			window.location.href = "earthGame.html?actiTime=" + actiTime + "&actiIndex=" + name + "&chanceNum=" + chanceNum + "&usedNum=" + usedNum;
		}
	}else{
		CT.setCookie("backPrePage",window.location.href);
        orderJs.columnToOrderPage("actiEarth");
	}	
}

/* 页面跳转 */
//视频页面跳转,调用recommendUrl.js中的方法
function actiToGame(cartoonId){
	var data = '' + (new Date().getMonth() + 1) + new Date().getDate();
	userDataList=data;
	setUserDataList(userDataList);
	var cartoonAction = "videoDetail";
	var hrefUrl = "?action=videoDetail&cartoonId=" + cartoonId;
	var curId = curFocus.FocusID + "&backActi=" + encodeURIComponent(window.location.href);
	var type = "actiRec";
	if(!isUserData){
		CT.$("littleTips").style.visibility="visible";		
		getAnterUrl(cartoonAction,hrefUrl,curId);
		setTimeout(function(){
		window.location.href = ajaxActionUrl + "HD/html/videoDetailPage_201804/web/videoDetailPage.html?action=cartoonDetail_2018v1&backType=1&cartoonId=" + cartoonId + "&v=" + new Date().getTime();
		},3000)
	}else{
		window.location.href = ajaxActionUrl + "HD/html/videoDetailPage_201804/web/videoDetailPage.html?action=cartoonDetail_2018v1&backType=1&cartoonId=" + cartoonId + "&v=" + new Date().getTime();
	}	
}
// 视频及通用页面跳转
function goSomeWhere(n, name) {
    CT.setCookie("earthMianBackFocus", curFocus.FocusID);
    var actiTime = new Date().getTime();
    switch (parseInt(n)) {
        case 0:
			if(chanceNum < 1){
				content.innerHTML = "今日次数已用光";
				modalDiv.style.visibility = 'visible';
				changeFocus('hands_x0_y0_confirmModalFocus_');
			}else if(userData && userData.indexOf(name + actiDate) > -1){
				content.innerHTML = name + "主题已经完成，请前往其他主题答题";
				modalDiv.style.visibility = 'visible';
				changeFocus('hands_x0_y0_confirmModalFocus_');
			}else {
				window.location.href = "earthGame.html?actiTime=" + actiTime + "&actiIndex=" + curFocus.ImgID;
			}
            break;
        case 1:
            window.location.href = "earthRule.html?actiTime=" + actiTime;
            break;
        case 2:
            window.location.href = "earthPrizeList.html?actiTime=" + actiTime;
            break;
        case 3:
            window.location.href = "earthExchange.html?actiTime=" + actiTime;
            break;
        case 6:
			actiToGame("1355");
			break;
		case 7:
			actiToGame("1439");
			break;
		case 5:
			actiToGame("1429");
			break;
        default:
            break;
    }
}

/* 轮播图焦点击事件 */
var modalDiv = document.getElementById("modalDiv");
function scrollFocus () {
	switch (Math.abs(parseInt(list.style.left)) / 1280){
		case 0:
			var nextNode = getModelByFocusId("hands_x0_y0_bearFocus1_");
			break;
		case 1:
			var nextNode = getModelByFocusId("hands_x0_y0_dogFocus1_");
			break;
		case 2:
			var nextNode = getModelByFocusId("hands_x0_y0_planeFocus_");
			break;
		case 3:
			var nextNode = getModelByFocusId("hands_x0_y0_bearFocus_");
			break;
		case 4:
			var nextNode = getModelByFocusId("hands_x0_y0_dogFocus_");
			break;
		default:
			break;
	}
	if(scrollImg.disable){
		curFocus.defaultBlur();
		var fid = curFocus.FocusID;
		curFocus = nextNode;
		curFocus.lastFocusId = fid;
		curFocus.defaultFocus();
	}
}

/* 轮播图 */
var pre = document.getElementById('pre');                           // 左箭头
var nex = document.getElementById('nex');                           // 右箭头
var list = document.getElementById('navs');                         // 滚动容器
var box = document.getElementById('box');                           // 展示容器
var imgNum = list.children.length;                                  // 图片数量
var imgWidth = box.offsetWidth;                                     // 图片宽度
var scrollObj = {
    pre: pre,
    nex: nex,
    list: list,
    box: box,
    imgNum: imgNum,
    imgWidth: imgWidth
};
var scrollImg = new ScrollImg(scrollObj);                                 // 轮播图对象
scrollImg._autoplay();

/* 数据请求 */
// 设置用户标记信息，标记用户今日是否看过视频
function setUserDataList(userData){
    actiObj.setUserDataList(userData);
}

/* 弹框方法 */
function confirmModal() {
    modalDiv.style.visibility = 'hidden';
    changeFocus('hands_x0_y0_startFocus_');
}

/* 工具函数 */
// 改变焦点
function changeFocus(focusName){
    if(focusName){
        curFocus.defaultBlur();
        curFocus = getFocusModel6(focusName);
        curFocus.defaultFocus();
    }
}
/*跳转新的地址*/
function BackOtherPortalMainPage(){
	var action = "springRecommendPage_blfc";
	ajax.init({
		url:ajaxActionUrl+"CommPage",
		method:"get",
		params:{"action":action},
		async:false,
		ContentType:"json",
		success:function(data){
			var actionUrl = data[0].pageInfo.templateUrl;
			window.location.href=actionUrl+"?action="+ action + "&time=" + new Date().getTime() ;
			
		},
		fail:function(status){
			var actionUrl = "HD/html/main_20160605/web/main.html";
			getNextUrl(actionUrl);
		}
	});
	//window.location.href = "page.action?action=main_20161022";
}
// 返回方法
function backfunc(){
	//BackOtherPortalMainPage();
	BackPortalMainPage();
}