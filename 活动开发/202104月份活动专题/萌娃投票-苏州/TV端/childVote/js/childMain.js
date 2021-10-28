/*..............首页图片轮播...............*/
var buttons = [
    {
        id: "hands_x0_y0_mainFocus0_",
        otherFocusEvent:'javascript:getPrizeList(0)',
        left: "disable",
        right: "hands_x0_y0_mainFocus6_",
        up: "disable",
        down: "hands_x0_y0_mainFocus1_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus1_",
        otherFocusEvent:'javascript:getPrizeList(1)',
        left: "disable",
        right: "hands_x0_y0_mainFocus6_",
        up: "hands_x0_y0_mainFocus0_",
        down: "hands_x0_y0_mainFocus2_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus2_",
        otherFocusEvent:'javascript:getPrizeList(2)',
        left: "disable",
        right: "hands_x0_y0_mainFocus6_",
        up: "hands_x0_y0_mainFocus1_",
        down: "hands_x0_y0_mainFocus3_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus3_",
        clickHandler: "javascript:goSomeWhere(3)",
        left: "disable",
        right: "hands_x0_y0_mainFocus4_",
        up: "hands_x0_y0_mainFocus2_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus4_",
        clickHandler: "javascript:goSomeWhere(4)",
        left: "hands_x0_y0_mainFocus3_",
        right: "hands_x0_y0_mainFocus5_",
        up: "hands_x0_y0_mainFocus2_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus5_",
        clickHandler: "javascript:voteClick()",
        left: "hands_x0_y0_mainFocus4_",
        right: "disable",
        up: "hands_x0_y0_mainFocus6_",
        down: "disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus6_",
		clickHandler: "javascript:goSomeWhere(5)",
        left: "hands_x0_y0_mainFocus0_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_mainFocus5_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_mainFocus7_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7
    }];
var ajaxUrl = AjaxConfig.origin;
var imgUrl = AjaxConfig.origin + "/pic-baby";
var userId = xjDataLog.getUserId("userId");
//CT.$("divtest").innerHTML += "userId:" + userId + "-----";
//var userId = 22232;
var listArr = [];
var curFocusPlayerIndex = 0;
var beforeTipCur = null;//弹窗之前焦点记录
var pageCurBefore = CT.getCookie("child_pageCurBefore") || null;
var pic = null;
var imgWidth = null;
var move = 0;
var timerAuto = null;
var timer = null;
var isClick = true;//是否点击投票
var videoListJSon = null;
init();
function init() {
	//背景音乐
	interface.findVideoListByCartoonId({params:{cartoonId:674,ajaxConfig:{async:true}}},function(data){
		
		page.videoListJSon = data;
		page.playSmallVideo();
	});
    PAGE.focusInit();
    if(pageCurBefore){
        PAGE.changeFocus(pageCurBefore);
    }else {
        PAGE.changeFocus(hands_x0_y0_mainFocus0_);
    }
    curFocus.defaultFocus();
    getPrizeList(0);
	//CT.$("divtest").innerHTML += "当前页面地址：" + window.location.href + "----";
}
function goSomeWhere(num) {//跳转
    CT.setCookie("child_pageCurBefore",curFocus.FocusID);
    if(num == 3){
        actiObj.actiCommonJumpUrl("childRule.html");
    }else if(num == 4){
        actiObj.actiCommonJumpUrl("childVote.html");
    }else if(num == 5){
       CT.backPage();
	}
}
//获得排行榜
function getPrizeList(num){
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/list",
        method:"get",
        params:{
            "pageNum":1,
            "pageSize":10,
            "orderType":0
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000) {
                listArr = res.data.records;
                createPicHtml(num);
                pic = document.getElementById("child_pic");
                imgWidth = pic.children[0].offsetWidth;
                pic.style.left = 0 + "px";
                for(var i = 0; i < 3; i++){
                    CT.$("listPic" + i).src = imgUrl + listArr[i].avatar;
					var playId = (Array(6).join(0) + listArr[i].playerId).slice(-6);
                    CT.$("listId" + i).innerHTML = "ID:"+ playId;
                    CT.$("listM" + i).innerHTML = "月票:"+ listArr[i].playerMonthlyCredits;
                    CT.$("listTotal" + i).innerHTML = "总票数:"+ listArr[i].playerYearlyCredits;
                }
                autoPlay();
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function voteClick() {
    var mAuth = null;
    var creditFrom = null;
    if(isClick){
        isClick = false;
        /*鉴权*/
        // orderJs.columnGetAuth(function (data) {
		// 	//CT.$("divtest").innerHTML += "鉴权结果：" + data + "----";
        //     if(data == "0"){
                mAuth = true;
                creditFrom = 1;
                voteGet(mAuth,creditFrom);
        //     }else {
        //         mAuth = false;
        //         creditFrom = 0;
        //         voteGet(mAuth,creditFrom);
        //     }
        // });
    }

}
function voteGet(mAuth,creditFrom) {
    var addBabyId = listArr[curFocusPlayerIndex].playerId;
    var mKey = hex_md5(Base64.encode("userId=" + userId + "&userType=0&addBaby=" + addBabyId + "&authStatus="+ mAuth + "&creditFrom=" + creditFrom));
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/insert",
        method: "get",
        params: {
            "userId": userId,
            "userType": 0,
            "addBaby": addBabyId,
            "authStatus":mAuth,
            "creditFrom":creditFrom
        },
        ContentType: "json",
        async: false,
        beforeSend: function(xml){
            xml.setRequestHeader("x-v-p",mKey);
        },
        success: function (res) {
            if (res.errorCode == 1000) {
                //动态修改票数，不请求接口
                CT.$("listM" + curFocusPlayerIndex).innerHTML = "月票:"+ (parseInt(CT.$("listM" + curFocusPlayerIndex).innerHTML.substr(3)) + 1);
                CT.$("listTotal" + curFocusPlayerIndex).innerHTML = "总票数:"+ (parseInt(CT.$("listTotal" + curFocusPlayerIndex).innerHTML.substr(4)) + 1);
                CT.$("tips").style.visibility = "visible";
                beforeTipCur = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_mainFocus7_");
                getPlayerInfo(addBabyId);
            } else if (res.errorCode == 1034) {
                CT.$("hands_x0_y0_mainFocus7_").style.top = 513 + "px";
                CT.$("hands_x0_y0_mainFocus7_").style.left = 506 + "px";
                CT.$("tips1").style.visibility = "visible";
                if(creditFrom == 1){
                    CT.$("isGone").innerHTML = "今日票数已用完";
                }else{
                    CT.$("isGone").innerHTML = "今日票数已用完，参与订购将获得更多票数！";
                }
                beforeTipCur = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_mainFocus7_");
            }else if (res.errorCode == 1041) {
                CT.$("hands_x0_y0_mainFocus7_").style.top = 513 + "px";
                CT.$("hands_x0_y0_mainFocus7_").style.left = 506 + "px";
                CT.$("tips1").style.visibility = "visible";
				CT.$("isGone").innerHTML = "当前时段内投票投票次数已达上限，请过一小时后再来投票！";
                beforeTipCur = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_mainFocus7_");
            }
            isClick = true;
        },
        fail: function (res) {
            console.log("请求失败")
        }
    });
}
function createPicHtml(num) {
    clearInterval(timerAuto);
    var picLength = listArr[num].playerPicInfoList.length;
    //数字键html创建
    var picChange = CT.$("child_pic");
    picChange.innerHTML = "";
    var picHtml = "";
    for(var m = 0 ; m < picLength ;m++){
        picHtml =
            '<li style="top: 0;left: '+m*548+'px;">'
            +'<img id="listPic'+m+'" src="'+imgUrl+listArr[num].playerPicInfoList[m].picPath+'" style="width: 100%;height: 100%">'
            +'</li>';
        picChange.innerHTML = picChange.innerHTML + picHtml;
    }
    CT.$("playerName").innerHTML = "姓名：" + listArr[num].playerName;
    CT.$("playerAge").innerHTML = "年龄：" + listArr[num].playerAge;
    curFocusPlayerIndex = num;

}
function nextPic() {
    if(move == pic.children.length-1){
        move = 0;
        pic.style.left = 0 + "px";
    }else {
        move++;
        pic.style.left = -move*imgWidth + "px";
    }

    animate(pic,-move*imgWidth);
}
function prevPic() {
    if(move == 0){
        move = listArr-1;
        pic.style.left = -move * imgWidth + "px";
    }else {
        move--;
        pic.style.left = -move*imgWidth + "px";
    }
    animate(pic,-move*imgWidth);
}
function animate(el,distance) {
    clearInterval(el.timer);
    el.timer = setInterval(function () {
        var present = el.offsetLeft;//当前的位置
        var movement = 10;//每次移动的距离
        movement = present < distance ? movement : -movement;
        present +=movement;
        if(Math.abs(present-distance) > Math.abs(movement)){
            el.style.left = present + "px";
        }else{
            clearInterval(el.timer);
            el.style.left = distance + "px";
        }
    },5)

}

//自动轮播，或光标离开时图片开始自动轮播
function autoPlay() {
    timerAuto = setInterval(function () {
        nextPic();
    },2000)
}
function getPlayerInfo(playerId) {
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/getPersonalCreditsInfo",
        method:"get",
        params:{
            "playerId":playerId,
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                CT.$("totalTicMonth").innerHTML = res.data.amountCreditsM;
                CT.$("TVTic").innerHTML = res.data.tvPlatformCreditsM;
                CT.$("phoneTic").innerHTML = res.data.wxPlatformCreditsM;
                CT.$("totalTic").innerHTML = res.data.amountCredits;
                //PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function backFunc() {//关闭弹窗
    if(curFocus.FocusID == "hands_x0_y0_mainFocus7_"){
        CT.$("tips").style.visibility = "hidden";
        CT.$("tips1").style.visibility = "hidden";
        PAGE.changeFocus(beforeTipCur);
    }else {//返回上一页
		CT.backPage();
    }
}

