/*
 *鉴权
*获取游戏机会（getChance）
 *获取游戏最大机会次数(getUserDataList)（点击看视频，最大机会为4;未观看视频，最大机会为3;超过最大机会，机会用完，无法进入游戏，否则进入游戏页）   
 */




// 创建首页button数组
function createMainButton() {
    var button = {};
    for (var i = 0; i < 12; i++) {
        button = {
            id: "hands_x0_y0_mainBtnFocus" + i + "_",
            clickHandler: "",
            left: "hands_x0_y0_mainBtnFocus" + (i - 1) + "_",
            right: "hands_x0_y0_mainBtnFocus" + (i + 1) + "_",
            up: "disable",
            down: "disable",
            focusType: 7
        };
        // 首页
        if (i == 0 || i == 1 || i == 2 || i == 3) {
            button.clickHandler = "javascript:jumpPage(" + i + ")";
            button.up = "hands_x0_y0_mainBtnFocus3_";
            if (i == 0) {
                button.left = "disable";
            } else if (i == 3) {
                button.right = "disable";
                button.down = "hands_x0_y0_mainBtnFocus1_";
            }
            //规则弹窗 
        } else if (i == 4) {
            button.left = "disable";
            button.right = "disable";
            button.clickHandler = "javascript:backMain()";
            // 排行榜弹窗
        } else if (i == 5 || i == 6 || i == 7 || i == 8) {
            button.up = "hands_x0_y0_mainBtnFocus8_";
            if (i == 5) {
                button.left = "disable";
                button.otherFocusEvent="javascript:onFocus(1)";
                button.otherBlurEvent="javascript:onFocus(0)";
            } else if (i == 6) {
                button.clickHandler = "javascript:saveFunc()";
                button.otherBlurEvent="javascript:saveBlur()";
            } else if (i == 7) {
                button.right = "disable";
                button.clickHandler = "javascript:modifyFunc()";
            } else if (i == 8) {
                button.clickHandler = "javascript:backMain()";
                button.right = "disable";
                button.down = "hands_x0_y0_mainBtnFocus5_";
            }
        }else if(i==9){
			button.clickHandler = "javascript:seeVideoFunc()";
			button.right = "disable";
			button.left = "disable";
			button.up = "hands_x0_y0_mainBtnFocus10_";
		}else if(i==10){
			button.right = "disable";
			button.left = "disable";
			button.down = "hands_x0_y0_mainBtnFocus9_";
			button.clickHandler = "javascript:backMain()";
		}else if(i==11){
			button.right = "disable";
			button.left = "disable";
			button.clickHandler = "javascript:backMain()";
		}
        buttons.push(button);
    }
};

var isOrder = 1;
var chanceNum = 0;//游戏机会
var seeVideoTime;//看视频的时间
var maxChance = 3;//最大游戏次数
var thisDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当前时间
(function () {
    createMainButton();
	//鉴权
	orderJs.columnGetAuth(function(authRes) {
		if(authRes == "0") {
			isOrder = 0;
		} else {
			isOrder = 1;
		}
	});
	//初始化焦点
    focusInit();
    curFocus = getFocusModel6("hands_x0_y0_mainBtnFocus1_");
    curFocus.defaultFocus();
	/*获取最大机会次数*/
	actiObj.getChance(function(res){
		chanceNum = res.activityChance;
		//获取存储的日期，如果当前日期=获取日期，		
		actiObj.getUserDataList(function(data) {
			if(data.resultMsg == "success") {
				seeVideoTime = data.list[0].user_acti_data;
				//看视频的时间=当前的时间，表示今天看过视频，最大游戏次数为4,否则为3
				if(seeVideoTime==thisDate){
					maxChance = 4;
				}else{
					maxChance = 3;
				}
			}else{
				maxChance = 3;
			}
		});
	});
})();

//焦点跳转
var jumpUrl = ""; //跳转地址
var ruleShow = false;//规则弹窗默认不显示
var rankShow = false;//排行榜弹窗默认不显示
var seeVideoShow = false;//看视频弹窗
var noChanceShow = false;//没有次数弹窗
function jumpPage(ii) {
    // 0:跳转规则页面; 1:跳转游戏页; 2:跳转排行页面; 3:执行返回方法
    if (ii == 0) {
        CT.$("tanchaungBG").style.visibility = "visible";
        CT.$("tanchaungImg").src = "./img/SXrule.png";
        actiObj.changeFocus("hands_x0_y0_mainBtnFocus4_");
        ruleShow = true;
    } else if (ii == 1) {
		if(isOrder == 0) {
			//游戏机会达到三次，最大机会为3，表示未看视频，提醒看视频;游戏机会达到四次，提醒没有机会;否则进入游戏页
			if(chanceNum == 3 && maxChance == 3){
				CT.$("seeVideoTip").style.visibility="visible";
				seeVideoShow = true;
				actiObj.changeFocus("hands_x0_y0_mainBtnFocus9_");
			}else if(chanceNum >= 4 && maxChance == 4){
				CT.$("noChanceTip").style.visibility="visible";
				noChanceShow = true;
				actiObj.changeFocus("hands_x0_y0_mainBtnFocus11_");
			}else{
				jumpUrl = "actiSharpshooterGame.html";
				//跳转加上时间戳
				jumpUrl = actiObj.timeStamp(jumpUrl);
				window.location.href = jumpUrl;
			}   
		}else{
			//跳订购
			CT.goPage();
			//CT.setCookie("columnBackUrl",window.location.href);
			orderJs.columnToOrderPage("actiSharpshooter");
		}
    } else if (ii == 2) {
        CT.$("tanchaungBG").style.visibility = "visible";
        CT.$("tanchaungImg").src = "./img/rank/rankList.png";
		CT.$("rankBG").style.visibility = "visible";
        rankShow = true;
        actiObj.changeFocus("hands_x0_y0_mainBtnFocus5_");
    } else if (ii == 3) {
        backfunc();
    }
};

//看视频
function seeVideoFunc(){
	//上传当前时间		
	actiObj.setUserDataList(thisDate);
	//800ms后跳转视频
	setTimeout(function(){
		CT.goPage();
		//CT.setCookie("columnBackUrl",window.location.href);
		getAnterUrl("videoDetail","?action=videoDetail&cartoonId=823","hands_x0_y0_shootFocus10_");
	},800);		
}

// 返回首页
function backMain() {
    CT.$("tanchaungBG").style.visibility = "hidden";
    CT.$("tanchaungImg").src = "./img/empty.png";
	CT.$("seeVideoTip").style.visibility="hidden";
	CT.$("noChanceTip").style.visibility="hidden";
	CT.$("rankBG").style.visibility = "hidden";
    // ruleShow == true，焦点返回规则按钮;rankShow == true,焦点返回排行按钮。
    if (ruleShow == true) {
        actiObj.changeFocus("hands_x0_y0_mainBtnFocus0_");
        ruleShow = false;
    } else if (rankShow == true) {
        actiObj.changeFocus("hands_x0_y0_mainBtnFocus2_");
        rankShow = false;
    }else if(seeVideoShow == true || noChanceShow == true){
		actiObj.changeFocus("hands_x0_y0_mainBtnFocus1_");
        seeVideoShow = false;
		noChanceShow = false;
	}
}

// 返回方法
function backfunc() {
    // 弹窗显示时返回
    if (ruleShow == true || rankShow == true || seeVideoShow==true || noChanceShow == true) {
        backMain();        
        // 弹窗不显示时返回平台首页
    } else {
        BackPortalMainPage();
    }
};

//loger埋点
var action = "actiSharpshooterMain";
var OutJson = [{
	pageInfo: {
		commPageEname: "actiSharpshooterMain"
	}
}];





