var buttons = [
    {
        id: "hands_x0_y0_backFocus_",
        clickHandler: "javascript: backfunc()",
        up: "disable",
        down: "hands_x0_y0_ruleFocus_",
        left: "hands_x0_y0_startFocus_",
        right: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_ruleFocus_",
        clickHandler: "javascript: goSomeWhere(1)",
        up: "hands_x0_y0_backFocus_",
        down: "hands_x0_y0_listFocus_",
        left: "hands_x0_y0_startFocus_",
        right: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_listFocus_",
        clickHandler: "javascript: goSomeWhere(2)",
        up: "hands_x0_y0_ruleFocus_",
        down: "hands_x0_y0_changeFocus_",
        left: "hands_x0_y0_startFocus_",
        right: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_changeFocus_",
        clickHandler: "javascript: goSomeWhere(3)",
        up: "hands_x0_y0_listFocus_",
        down: "hands_x0_y0_startFocus_",
        left: "hands_x0_y0_startFocus_",
        right: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_startFocus_",
        clickHandler: "javascript: startGame()",
        otherFocusEvent: "javascript: getStartBling()",
        otherBlurEvent: "javascript: getStopBling()",
        up: "hands_x0_y0_backFocus_",
        down: "disable",
        left: "disable",
        right: "hands_x0_y0_changeFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_sureFocus_",
        clickHandler: "javascript: backfunc()",
        up: "disable",
        down: "disable",
        left: "disable",
        right: "hands_x0_y0_cancelFocus_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_cancelFocus_",
        clickHandler: "javascript: backfunc()",
        up: "disable",
        down: "disable",
        left: "hands_x0_y0_sureFocus_",
        right: "disable",
        focusType: 7
    }
];

//鉴权结果
var isOrder = 1;
//剩余机会
var haveChance = 0;
//已使用机会
var isOrderNum = 0;
//用户积分
var userCredit = 0;
//弹窗是否正出现
var areConfirm = false;
//上一个焦点
var preFocusXL = "hands_x0_y0_startFocus_";
//弹框显示
function showConfirm(inner){
    document.getElementById("textMsg").innerHTML = inner;
    document.getElementById("confirmDiv").style.visibility = "visible";
    curFocus.defaultBlur();
    curFocus = getFocusModel6("hands_x0_y0_sureFocus_");
    curFocus.defaultFocus();
    areConfirm = true;
}
//弹框隐藏
function hideConfirm(){
    document.getElementById("textMsg").innerHTML = "";
    document.getElementById("confirmDiv").style.visibility = "hidden";
    curFocus.defaultBlur();
    curFocus = getFocusModel6(preFocusXL);
    curFocus.defaultFocus();
    areConfirm = false;
}

//获取用户状态,剩余机会,红包数量与初始化焦点
function setOrderStatus(){
    if(isOrder === 0) haveChance = haveChance + 3;
    if(haveChance > isOrderNum){
        haveChance = haveChance - isOrderNum;
    }else{
        haveChance = 0;
    }

    CT.$("redPacketNums").innerHTML = userCredit;
    //设置开始焦点
    setActiFocus()
}
//首页开始按钮闪烁效果
var startBlingInterval;
var startBlingFlag = 0;
function getStartBling(){
    startBlingInterval = setInterval(function(){
        var imgFlag = startBlingFlag%2;
        if(imgFlag === 0){
            CT.$("startImg").style.visibility = "visible";
        }else{
            CT.$("startImg").style.visibility = "hidden";
        }

        CT.$("startFocus").src = "../images/mainPage/selected"+ imgFlag +".png";
        startBlingFlag++;
    },200)
}
//开始按钮停止闪烁
function getStopBling(){
    clearInterval(startBlingInterval);
}
//点击开始游戏
function startGame(){
	CT.setCookie("actiLeaveFocus",curFocus.FocusID);
	var actiFirst23 = CT.getCookie("actiFirst23") + "";
    if(haveChance > 0 || actiFirst23 != "no"){
		CT.setCookie("actiFirst23","no");
        CT.setCookie("isOrderNum",isOrderNum);
        CT.setCookie("haveChance",haveChance);
        window.location.href = "startGame.html";
    }else{
		if(isOrder != 0){
			orderJs.toOrderPage();
		}else{
			showConfirm("今日机会已用完,明天再来吧");
		}
        
    }

}
//页面跳转
function goSomeWhere(ii){
    CT.setCookie("actiLeaveFocus",curFocus.FocusID);
	var actiTime = new Date().getTime();
    switch (ii){
        case 1:
            window.location.href = "rulePage.html?actiTime=" + actiTime;
            break;
        case 2:
            window.location.href = "prizeList.html?actiTime=" + actiTime;
            break;
        case 3:
            window.location.href = "savePrize.html?actiTime=" + actiTime;
            break;
        default:
            break;
    }
}
//获取用户积分
function getUserCredit(){
	var actiTime = new Date().getTime();
    actiAjax.init({
        url:getUserCreditUrl,
        method:"get",
        params:{
            "userId": actiUserId,
            "activityId": actiActivityId,
			"actiTime": actiTime
        },
        async:true,
        ContentType:"application/x-www-form-urlencoded",
        success:function(data){
            if(data.resultMsg == "success"){
                userCredit = data.creditNum;
            }else{
                userCredit = 0;
            }
            console.log(data);
            setOrderStatus();
        },
        fail:function(status){
        }
    });
}
//获取用户今日剩余机会
function getActivityChance(){
	var actiTime = new Date().getTime();
    actiAjax.init({
        url:getChanceUrl,
        method:"get",
        params:{
            "userId": actiUserId,
            "activityId": actiActivityId,
			"actiTime": actiTime
        },
        async:true,
        ContentType:"application/x-www-form-urlencoded",
        success:function(data){
            isOrderNum = parseInt(data.activityChance);
            console.log(data);
			getUserCredit();
        },
        fail:function(status){

        }
    });
	
}
//获取鉴权结果
function getAuthResult(){
	//鉴权
	isOrder = 0;
	getActivityChance();
    
}
getAuthResult();