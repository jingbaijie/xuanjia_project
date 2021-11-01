//获取数据
var commonPageInfo = basePageInfo.commonPageInfo;
var arr;
var arrLength;
var imgUrl = AjaxConfig.imgUrl;
var topInter = null;
var botInter = null;
var findTemplateInfo = basePageInfo.findTemplateInfo;
/*
*
*从眉头获取专题action用以区分专题内容
*
*/
function getGeneralAction(name){
	var reg = new RegExp("(^|&)"+name+"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null){
		return  unescape(r[2]);
	}else{
		return null;
	}
}
var buttons = [
	{
		id: "hands_x0_y0_iconFocus0_",
		clickHandler:"javascript:goSomeWhere(0)",
		otherFocusEvent: "javascript: getFocusImg(0)",
		left:"disable",
		leftEvent: "javascript: leftMove()",
		right:"hands_x0_y0_iconFocus1_",
		up:"disable",
		upEvent:"javascript:topMove(0)",
		down:"disable",
		downEvent:"javascript:downMove(0)",
		focusType:7
	},
	{
		id: "hands_x0_y0_iconFocus1_",
		clickHandler:"javascript:goSomeWhere(1)",
		otherFocusEvent: "javascript: getFocusImg(1)",
		left:"hands_x0_y0_iconFocus0_",
		right:"hands_x0_y0_iconFocus2_",
		up:"disable",
		upEvent:"javascript:topMove(1)",
		down:"disable",
		downEvent:"javascript:downMove(1)",
		focusType:7
	},
	{
		id: "hands_x0_y0_iconFocus2_",
		clickHandler:"javascript:goSomeWhere(2)",
		otherFocusEvent: "javascript: getFocusImg(2)",
		left:"hands_x0_y0_iconFocus1_",
		right:"disable",
		rightEvent: "javascript: rightMove(2)",
		up:"disable",
		upEvent:"javascript:topMove(2)",
		down:"disable",
		downEvent:"javascript:downMove(2)",
		focusType:7
	},
	{
		id: "hands_x0_y0_iconFocus3_",
		clickHandler:"javascript:goSomeWhere(0)",
		otherFocusEvent: "javascript: getFocusImg(0)",
		left:"disable",
		leftEvent: "javascript: leftMove(true)",
		rightEvent:"javascript: rightMove(3)",
		up:"disable",
		upEvent:"javascript:topMove(3)",
		down:"disable",
		downEvent:"javascript:downMove(3)",
		focusType:7
	},
	{
		id: "hands_x0_y0_iconFocus4_",
		clickHandler:"javascript:goSomeWhere(1)",
		otherFocusEvent: "javascript: getFocusImg(1)",
		left:"hands_x0_y0_iconFocus3_",
		rightEvent:"javascript: rightMove(4)",
		up:"disable",
		upEvent:"javascript:topMove(4)",
		down:"disable",
		downEvent:"javascript:downMove(4)",
		focusType:7
	},{
		id: "hands_x0_y0_iconFocus5_",
		clickHandler:"javascript:goSomeWhere(2)",
		otherFocusEvent: "javascript: getFocusImg(2)",
		left:"hands_x0_y0_iconFocus4_",
		right:"disable",
		rightEvent: "javascript: rightMove()",
		up:"disable",
		upEvent:"javascript:topMove(5)",
		down:"disable",
		downEvent:"javascript:downMove(5)",
		focusType:7
	}/*,{
		id: "hands_x0_y0_orderTipFocus_",
		clickHandler: "javascript: showOrder()",
		up: "disable",
		down: "hands_x0_y0_iconFocus2_",
		left: "hands_x0_y0_iconFocus1_",
		right: "disable",
		focusType: 7
	},{
		id: "hands_x0_y0_orderConFocus_",
		clickHandler: "javascript: backFunc()",
		up: "disable",
		down: "disable",
		left: "disable",
		right: "disable",
		focusType: 7
	}*/

];
	//移动
var move= document.getElementById("contain");
var index = 0;
var iconBot = document.getElementById("icon_bot").getElementsByTagName("img");
var iconTop = document.getElementById("icon_top").getElementsByTagName("img");
var flag = 0;

arr = commonPageInfo.recommend_1;
arrLength = arr.length;
if(arrLength < 6){
	for(var i = 0;i < buttons.length;i++){
	if(i < arrLength){
		CT.$("hands_x0_y0_iconFocus" + i + "_").getElementsByTagName("img")[0].src = imgUrl + arr[i].recommendLabelpic;
		buttons[i].enFocus = true;
	}else{
		buttons[i].enFocus = false;
	}
	}
}
showImg(arr);	
arrow_bottom();
var curPageFocus = getGeneralAction("pageFocus");
PAGE.focusInit();
if(curPageFocus && document.getElementById(curPageFocus)){
	PAGE.changeFocus(curPageFocus);
}else{
	PAGE.changeFocus("hands_x0_y0_iconFocus0_")
}

function showOrder(){
	orderJs.columnGetAuth(function(authData){
		if(authData == "0"){
			CT.$("orderedConfirm").style.visibility = "visible";
			PAGE.changeFocus("hands_x0_y0_orderConFocus_");
		}else{
			PAGE.otherPageParam = "&contentId=" + commonPageInfo.pageInfo.commonPageId 
			+ "&contentEName=" + commonPageInfo.pageInfo.commPageEname
			+ "&contentCName=" + commonPageInfo.pageInfo.commPageCname
			+ "&contentType=" + CT.querySearchUrlKey(window.location.href,"contentType");
			CT.goPage();
			orderJs.columnToOrderPage(getGeneralAction("contentEName"));
		}
	});
	
}
function hideOrder(){
	CT.$("orderedConfirm").style.visibilty = "hidden";
	PAGE.changeFocus("hands_x0_y0_orderTipFocus_");
}

//生成图片
function showImg(arr){
	var list = ["66px","464px","861px"];
	var contain = document.getElementById("contain");
	var maxContent = "";
	index = parseInt(getGeneralAction("curIndex") || 0);
	for (var i = 0,c = arrLength/3;i < c; i++) {
		for (var j = 0; j < 3; j++) {	
				if(3*i+j>=arrLength){
					break;
				}
				maxContent += '<img src='+imgUrl+arr[3*i+j].recommendPic.picPath+' alt="" style="position:absolute;left:'+list[j]+';top: '+i*240+'px;width:352px;height:198px">';	
		}
	}
	contain.innerHTML = maxContent;
	if(index >= 1){
		contain.style.top = parseInt(contain.style.top) - parseInt((index-1)*240) + "px";
	}else{
		contain.style.top = parseInt(contain.style.top) - parseInt(index*240) + "px";
	}
	arrow_bottom();
	arrow_top();
}



//上键执行
function topMove(n){
	//递减
	/*if(index <= 0){
		PAGE.changeFocus("hands_x0_y0_orderTipFocus_");
	}*/
	if(index > 0){
		index--;
	}
	//如果是0,1,2三个按键
	if(n<=2){
		var topNum = parseInt(move.style.top);
		topNum += 240;
		move.style.top = topNum +"px";
	}else {
		PAGE.changeFocus("hands_x0_y0_iconFocus"+(n-3)+"_");
	}
	//越界的情况
	if(index<=0){
		index =0;
		move.style.top = 0;
	}
	arrow_top();
	arrow_bottom();
}
//下键执行
function downMove(n){
	if((index+1)*3 < arrLength){
		index++;
		if(n <= 2){
			if((index)*3 + n%3 >= arrLength){
				PAGE.changeFocus("hands_x0_y0_iconFocus"+((arrLength%3-1) + 3)+"_");
			}else{
				PAGE.changeFocus("hands_x0_y0_iconFocus"+(3+n)+"_");
			}
		}else{
			var topNum = parseInt(move.style.top);
			topNum -= 240;
			move.style.top = topNum +"px";
			if((index)*3 + n%3 >= arrLength){
				PAGE.changeFocus("hands_x0_y0_iconFocus"+(3+(arrLength%3) - 1)+"_");
			}
		}
		//越界的情况
		if(index >= Math.ceil(arrLength/3 -1)){
			index = Math.ceil( arrLength/3 -1);
			move.style.top = (index-1)*-240 +"px";
		}
		arrow_bottom();
		arrow_top();
	}
}
function leftMove(agr){
	if(agr){
		PAGE.changeFocus("hands_x0_y0_iconFocus2_");
		index--;
	}else if(index > 0){
		PAGE.changeFocus("hands_x0_y0_iconFocus2_");
		index--;
		//越界的情况
		if(index<=0){
			index =0;
			move.style.top = 0;
		}
		arrow_top();
		arrow_bottom();
	}
}
function rightMove(agr){
	if(agr){
		if(agr == "2"){
			PAGE.changeFocus("hands_x0_y0_iconFocus3_");
			index++;
		}else{
			if((index)*3 + parseInt(agr)%3 + 1 < arrLength){
				PAGE.changeFocus("hands_x0_y0_iconFocus"+ (parseInt(agr) + 1) +"_");
			}
		}
	}else if((index+1)*3 < arrLength){
		PAGE.changeFocus("hands_x0_y0_iconFocus3_");
		index++;
		//越界的情况
		if(index >= Math.ceil(arrLength/3 -1)){
			index = Math.ceil( arrLength/3 -1);
			move.style.top = (index-1)*-240 +"px";
		}
		arrow_bottom();
		arrow_top();
	}
}

//元素隐藏
function eleShow(ele,vis){
	return document.getElementById(ele).style.visibility = vis;
}
//全部隐藏
function allHidden(ele1,ele2,ele3){
	eleShow(ele1,"hidden");
	eleShow(ele2,"hidden");
	eleShow(ele3,"hidden");
}
//全部显示
function allVisible(ele1,ele2,ele3){
	eleShow(ele1,"visible");
	eleShow(ele2,"visible");
	eleShow(ele3,"visible");
}
//循环显示
function easeImg(eleArr){
	if(flag == 0){
		eleArr[0].style.visibility = "hidden";
		eleArr[1].style.visibility = "visible";
		flag++;
	}else if(flag == 1){
		eleArr[1].style.visibility = "visible";
		eleArr[0].style.visibility = "visible";
		flag++;
	}else if(flag == 2){
		eleArr[1].style.visibility = "hidden";
		eleArr[0].style.visibility = "visible";
		flag = 0;
	}
}
//上面的按钮
function arrow_top(){
	//如果只有一页
	if(arrLength/3<=2 || !arrLength){
		clearInterval(topInter);
		allHidden("icon_top","arrow_1","arrow_2");
	}else {
		//让上面的按钮显示
		if(index > 0 && parseInt(contain.style.top) < 0){
			clearInterval(topInter);
			allVisible("icon_top","arrow_1","arrow_2");
			topInter = setInterval(function(){
				easeImg(iconTop);
			},500);
		}else{
			clearInterval(topInter);
			allHidden("icon_top","arrow_1","arrow_2");
		}
	}
}
//下面的按钮
function arrow_bottom (){
	//如果只有一页
	var minTop = 0 - (Math.ceil(arrLength/3) - 2) * 240;
	if(arrLength/3 <= 2 || !arrLength){
		allHidden("icon_bot","arrow_3","arrow_4");
	}else {
		//让下面的按钮显示
		if(index < Math.ceil(arrLength/3) - 1 && parseInt(contain.style.top) > minTop){
			clearInterval(botInter);
			allVisible("icon_bot","arrow_3","arrow_4");
			botInter = setInterval(function(){
				easeImg(iconBot);
			},500);
		}else {
			clearInterval(botInter);
			allHidden("icon_bot","arrow_3","arrow_4");
		}
	}
}
      
function goSomeWhere(n){
	n = index*3 + n;
	PAGE.otherPageParam = "&contentId=" + commonPageInfo.pageInfo.commonPageId 
		+ "&contentEName=" + commonPageInfo.pageInfo.commPageEname
		+ "&contentCName=" + commonPageInfo.pageInfo.commPageCname
		+ "&contentType=" + CT.querySearchUrlKey(window.location.href,"contentType") 
		+ "&curIndex=" + index + "&pageFocus=" + curFocus.FocusID;
	curFocus.TempData = commonPageInfo["recommend_1"][n];
	CT.goPage();
	/*orderJs.columnGetAuth(function(authData){
		if(authData == "0"){*/
			CT.toAnterRecommendUrl(commonPageInfo,"recommend_1",n);
		/*}else{
			orderJs.columnToOrderPage(commonPageInfo.pageInfo.contentEName);
		}
	});*/
}
function getFocusImg(n){
	/*if(OutJson && OutJson.recommend_1 && OutJson.recommend_1[n].recommendLabelpic){
		CT.$(curFocus.FocusID).getElementsByTagName("img")[0].src = imgUrl + OutJson.recommend_1.recommendLabelpic.picPath;
	}*/
}


