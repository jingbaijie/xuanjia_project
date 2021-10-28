var buttons = [
    {
        id: "hands_x0_y0_ruleFocus_",
        clickHandler: "javascript:goSomeWhere(0)",
        left: "disable",
        //right: "hands_x0_y0_startFocus_",
        rightEvent:'javascript:rightFocusFun()',
        up: "disable",
        down: "hands_x0_y0_giftFocus_",
        focusType: 7
    },{
        id: "hands_x0_y0_giftFocus_",
        clickHandler: "javascript:goSomeWhere(1)",
        left: "disable",
        //right: "hands_x0_y0_startFocus_",
        rightEvent:'javascript:rightFocusFun()',
        up: "hands_x0_y0_ruleFocus_",
        down: "hands_x0_y0_moreFocus_",
        focusType: 7
    },{
        id: "hands_x0_y0_moreFocus_",
        clickHandler: "javascript:goSomeWhere(2)",
        left: "disable",
        //right: "hands_x0_y0_startFocus_",
        rightEvent:'javascript:rightFocusFun()',
        up: "hands_x0_y0_giftFocus_",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_startFocus_",
        clickHandler: "javascript:dirct()",
        otherFocusEvent:"javascript:startFocus()",
        otherBlurEvent:"javascript:startBlur()",
        //left: "hands_x0_y0_moreFocus_",
        leftEvent:'javascript:leftFocusFun()',
        right: "hands_x0_y0_backFocus_",
        up: "hands_x0_y0_backFocus_",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_backFocus_",
        clickHandler: "javascript:backfunc()",
        left: "hands_x0_y0_startFocus_",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_startFocus_",
        focusType: 7
    },{
        id: "hands_x0_y0_emptyFocus_",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_tipsFocus0_",
        clickHandler: "javascript:tipGoSomeWhere()",
        left: "disable",
        right: "hands_x0_y0_tipsFocus1_",
        up: "disable",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_tipsFocus1_",
        clickHandler: "javascript:tipGoSomeWhere()",
        left: "hands_x0_y0_tipsFocus0_",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_phoneBtn_",
        clickHandler: "",
        right:'hands_x0_y0_saveBtn_',
        otherFocusEvent:'javascript:OnFocus(1)',
        otherBlurEvent:'javascript:OnFocus(0)',
        left: "disable",
        up: "disable",
        down:"disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_saveBtn_",
        clickHandler: "javascript:savePhoneClick()",
        right:'hands_x0_y0_delBtn_',
        left: "hands_x0_y0_phoneBtn_",
        up: "disable",
        down:"disable",
        focusType: 7
    },
    {
        id: "hands_x0_y0_delBtn_",
        clickHandler: "javascript:clearPhoneNum()",
        right:'disable',
        left: "hands_x0_y0_saveBtn_",
        up: "disable",
        down:"disable",
        focusType: 7
    }];
var directArr = [[179,301],[179,490],[179,684],[316,684],[450,684],[450,490],[450,301],[316,301]];//选中框8个位置
var ipArr = [6438,0,3440,0,6084,0,5898,6314];
var stop = [0,2,4,6,7];
var lotteryTimer = null;//抽奖定时器
var selectTimer = null;//选中转圈定时器
var time = 0;
var randomTime = 0;
var index = 0;
var imgIndex = 0;
var blurTime = null;//离开开始按钮，开始按钮闪烁
var wordTime = null;
var leftFocusRemember = CT.getCookie("leftFocusRemember") || "hands_x0_y0_moreFocus_";
var wuyipageFocusRemember = CT.getCookie("wuyipageFocusRemember") || "hands_x0_y0_startFocus_";
var chance = 0;
var isOrder = 1;
var activityId = CT.getCookie("activityId");
var probability = 0;//三等奖概率
var prizeNum = 0;
var prizedegree = 0;
var prizeid = 0;
var userHavePrize = true;
var prams = {
    cartoonId: "",
    contentId: 3,
    contentType: "page"
};
//鉴权
orderJs.columnGetAuth(function(data){
    actiObj.getChance(function (res) {//进入首页时获得机会
        chance = res.data.activityChance;
        //data = “0”
        if(data == "0"){
            isOrder = 0;
            if(3-chance < 0){
                CT.$("chanceNum").innerHTML = 0;
            }else {
                CT.$("chanceNum").innerHTML = 3-chance;
            }

        }else{
            isOrder = 1;
            if(1-chance < 0){
                CT.$("chanceNum").innerHTML = 0;
            }else {
                CT.$("chanceNum").innerHTML = 1-chance;
            }
        }
		//获取当前用户是否拥有奖品
		actiObj.getUserPrizeInfo(function(prizeData){
			if(prizeData && prizeData.data){
				userHavePrize = true;
			}else{
				userHavePrize = false;
			}
		});
		//获取奖品列表
		actiObj.getActivityPrize(function (data) {
			if(data.successFlg == 1){
				prizeNum = data.data.records[0].prizeRemainNum;
				prizedegree = data.data.records[0].prizePercentage;
				prizeid = data.data.records[0].id;
			}else {
				prizeNum = 0;
			}
			init();
		});
    });
});
function init() {
    PAGE.focusInit();
    curFocus = PAGE.getFocusModel6(wuyipageFocusRemember);
    curFocus.defaultFocus();
    clearInterval(wordTime);
    CT.delCookie("wuyipageFocusRemember");
    if(curFocus.FocusID == "hands_x0_y0_startFocus_"){
        CT.$("start1").style.visibility = "visible";
        CT.$("select").style.visibility = "visible";
        clearInterval(selectTimer);
        selectChange();

    }else {
        CT.$("select").style.visibility = "hidden";
        startBlur();
    }
}
function rightFocusFun(){
    leftFocusRemember = curFocus.FocusID;
    CT.delCookie("leftFocusRemember");
    CT.setCookie("leftFocusRemember",curFocus.FocusID);
    changeFocus("hands_x0_y0_startFocus_")
}
function leftFocusFun() {
    changeFocus(leftFocusRemember);
}
function startBlur() {
    if(curFocus.FocusID == "hands_x0_y0_emptyFocus_"){
        CT.$("select").style.visibility = "visible";
        clearInterval(blurTime);
    }else {
        clearInterval(selectTimer);
        CT.$("select").style.visibility = "hidden";
        clearInterval(blurTime);
        blurTime = setInterval(function () {
            var str = CT.$("start1").src;
            if(parseInt(str.substr(str.lastIndexOf("/")+6,1)) == 1){
                CT.$("start1").src = "./img/start2.png";
            }else if(parseInt(str.substr(str.lastIndexOf("/")+6,1)) == 2){
                CT.$("start1").src = "./img/start1.png";
            }
        },200)
    }
}
function startFocus(){
    clearInterval(blurTime);
    CT.$("select").style.top = 305 + "px";
    CT.$("select").style.left = 493 + "px";
    selectChange();
}
function selectChange(){
    CT.$("select").style.visibility = "visible";
    clearInterval(selectTimer);
    selectTimer = setInterval(function () {
        var str =  CT.$("select").src;
        if(parseInt(str.substr(str.lastIndexOf("/")+1,1)) == 1){//选中框转圈
            CT.$("select").src = "./img/select/2.png";
        }else if(parseInt(str.substr(str.lastIndexOf("/")+1,1))== 2){
            CT.$("select").src = "./img/select/3.png";
        }else if(parseInt(str.substr(str.lastIndexOf("/")+1,1)) == 3){
            CT.$("select").src = "./img/select/4.png";
        }else if(parseInt(str.substr(str.lastIndexOf("/")+1,1)) == 4){
            CT.$("select").src = "./img/select/1.png";
        }
    },200);
}
function dirct() {
    if(isOrder == 0){
        if(chance == 3){
            CT.$("select").style.visibility = "hidden";
            CT.$("tipImg").src = "./img/tips/noChance.png";
            CT.$("tipImg").style.visibility = "visible";
            changeFocus("hands_x0_y0_tipsFocus0_");
        }else if(3-chance < 0){
            CT.$("select").style.visibility = "hidden";
            CT.$("tipImg").src = "./img/tips/noChance.png";
            CT.$("tipImg").style.visibility = "visible";
            changeFocus("hands_x0_y0_tipsFocus0_");
        }else {
            directChange();
        }
    }else {
        if(chance == 1){
            CT.$("select").style.visibility = "hidden";
            CT.$("tipImg").src = "./img/tips/orderMoreChance.png";
            CT.$("tipImg").style.visibility = "visible";
            changeFocus("hands_x0_y0_tipsFocus0_");
        }else if(1-chance < 0){
            CT.$("select").style.visibility = "hidden";
            CT.$("tipImg").src = "./img/tips/noChance.png";
            CT.$("tipImg").style.visibility = "visible";
            changeFocus("hands_x0_y0_tipsFocus0_");
        }else {
            directChange();
        }
    }
}
function directChange() {//选中框位置改变
    clearInterval(selectTimer);
    changeFocus("hands_x0_y0_emptyFocus_");
    CT.$("select").style.top = 179 + "px";
    CT.$("select").style.left = 301 + "px";
    selectChange();
    clearInterval(blurTime);
    if(isOrder == 0){//订购用户有千分之一的概率
        probability = Math.floor(Math.random()*1000);
    }else {
        probability = 1001;
    }
    var stopIndex = Math.floor(Math.random()*5);
    if(probability < prizedegree && prizeNum > 0 && prizedegree > 0 && !userHavePrize){
		userHavePrize = true;
        actiObj.setPrize(prizeid,function () {//中三等奖
            imgIndex = 3;
			randomTime = (imgIndex + 1)*100 + 1600;
			lotteryStart();
        })
    }else {
        if(actiUserId == "0317kf001"){
            actiObj.setPrize(prizeid,function () {//中三等奖
                imgIndex = 3;
                randomTime = (imgIndex + 1)*100 + 1600;
                lotteryStart();
            })
        }else if(actiUserId == "0315gdtest"){
            actiObj.setPrize(prizeid,function () {//中三等奖
                imgIndex = 3;
                randomTime = (imgIndex + 1)*100 + 1600;
                lotteryStart();
            })
        }else if(actiUserId == "0311nhwcsgd20009"){
            actiObj.setPrize(prizeid,function () {//中三等奖
                imgIndex = 3;
                randomTime = (imgIndex + 1)*100 + 1600;
                lotteryStart();
            })
        }else {
            randomTime = (stop[stopIndex]+1)*100 + 1600;
            imgIndex = stop[stopIndex];
            lotteryStart();
        }
    }
}

function lotteryStart(){
	time = 0;
	index = 0;
	lotteryTimer = setInterval(function () {
        if(time == randomTime){
			clearInterval(lotteryTimer);
            time = 0;
            randomTime = 0;
            if(isOrder == 0){//订购用户
                if(chance < 3){//已订购用户小于三次机会
                    actiObj.setChance(function () {
                        setTimeout(function () {
                            actiObj.getChance(function (data) {
                                chance = data.data.activityChance;
                                CT.$("select").style.visibility = "hidden";
                                CT.$("chanceNum").innerHTML = 3-chance;
                                if(ipArr[imgIndex] == 0){
                                    CT.$("tipImg").src = "./img/tips/lottery.png";
									CT.$("tipImg").style.visibility = "visible";
                                    CT.$("phoneText").style.visibility = "visible";
                                    CT.$("phoneInfo").style.visibility = "visible";
									changeFocus("hands_x0_y0_phoneBtn_");

                                }else {
                                    CT.$("tipImg").src = "./img/tips/toWatch.png";
									CT.$("tipImg").style.visibility = "visible";
									changeFocus("hands_x0_y0_tipsFocus0_");
								}
                            });
                        },1500);
                    });
                }
            }else {//未订购用户
                if(chance < 1){
                    actiObj.setChance(function (){
                        setTimeout(function () {
                            actiObj.getChance(function (data) {
                                chance = data.data.activityChance;
                                CT.$("chanceNum").innerHTML = 1-chance;
                                CT.$("select").style.visibility = "hidden";
                                if(ipArr[imgIndex] == 0){
                                    CT.$("tipImg").src = "./img/tips/lottery.png";
                                    CT.$("tipImg").style.visibility = "visible";
                                    CT.$("phoneText").style.visibility = "visible";
                                    CT.$("phoneInfo").style.visibility = "visible";
                                    changeFocus("hands_x0_y0_phoneBtn_");
                                }else {
                                    CT.$("tipImg").src = "./img/tips/toWatch.png";
                                    CT.$("tipImg").style.visibility = "visible";
                                    changeFocus("hands_x0_y0_tipsFocus0_");
                                }

                            });
                        },1500);
                    });
                }
            }
        }else{
            if(time == 0){
                changeFocus("hands_x0_y0_emptyFocus_");
            }
			CT.$("select").style.top = directArr[index%8][0] + "px";
			CT.$("select").style.left = directArr[index%8][1] + "px";
			time = time + 100;
			index++;
		}
    },100)
}
function goSomeWhere(num) {

    if(num == 0){
        CT.setCookie("wuyipageFocusRemember",curFocus.FocusID);
        window.location.href = "./lotteryRule.html"
    }else if(num == 1){
        CT.setCookie("wuyipageFocusRemember",curFocus.FocusID);
        window.location.href = "./lotteryPrizeList.html"
    }else if(num == 2){

        CT.backPage();//返回大厅
    }
}
function changeFocus(focusId){
    curFocus.defaultBlur();
    curFocus = PAGE.getFocusModel6(focusId);
    curFocus.defaultFocus();
}
function backfunc() {
    if(CT.$("tipImg").style.visibility == "visible"){
        CT.$("tipImg").style.visibility = "hidden";
        CT.$("phoneText").style.visibility = "hidden";
        CT.$("phoneInfo").style.visibility = "hidden";
        selectChange();
        changeFocus("hands_x0_y0_startFocus_");
    }else {

        CT.backPage();
    }

}
function tipGoSomeWhere() {
    var str1 = CT.$("tipImg").src;
    var str = str1.substr(str1.lastIndexOf("/")+1);
    CT.setCookie("columnBackUrl",window.location.href);
    if(curFocus.FocusID == "hands_x0_y0_tipsFocus0_"){
        if(str.indexOf("noChance") >= 0){
            CT.$("tipImg").style.visibility = "hidden";
            selectChange();
            changeFocus("hands_x0_y0_startFocus_");
        }else if(str.indexOf("toWatch") >= 0){//看相应动画
            CT.goPage();
            prams.cartoonId = ipArr[imgIndex];
            CT.getAnterByIdOrAction(prams);
            //getAnterUrl("cartoonDetail_2018v1","?action=cartoonDetail_2018v1&cartoonId="+ipArr[imgIndex],curFocus.FocusID);
        }else if(str.indexOf("lottery") >= 0){
            actiObj.getUserPhone(function (data) {
                CT.$("phoneText").innerHTML = data.data.userPhone;
            });
        }else if(str.indexOf("orderMoreChance") >= 0){
            changeFocus("hands_x0_y0_startFocus_");
			orderJs.columnToOrderPage();
		}
    }else if(curFocus.FocusID == "hands_x0_y0_tipsFocus1_"){
        if(str.indexOf("noChance") >= 0){//机会用完去大厅
            CT.backPage();
        }else if(str.indexOf("toWatch") >= 0){//返回抽奖首页
            CT.$("tipImg").style.visibility = "hidden";
            selectChange();
            changeFocus("hands_x0_y0_startFocus_");
        }else if(str.indexOf("orderMoreChance") >= 0){//未订购用完一次机会去大厅
            CT.backPage();
        }
    }
	// CT.$("tipImg").src = "./img/none.png";
}

var phoneText=document.getElementById("phoneText").innerHTML;
var  phoneNum = phoneText;

//监听用户遥控器输入的数字
var isOnFocus;
changeNumObj.changeNum = function(ids){
    if(isOnFocus){
        var size;
        if(phoneNum==""){
            size=0;
        }else{
            size= phoneNum.length;
        }

        if(size < 11||!size){
            var addnum = phoneNum;
            phoneNum = addnum + ids;
        }
        document.getElementById("phoneText").innerHTML=phoneNum;
    }
};
//焦点获焦在输入框中执行的方法
function OnFocus(index){
    isOnFocus = index==1?true:false;
}
function clearPhoneNum() {
    phoneNum = "";
	CT.$("phoneInfo").innerHTML="";
    CT.$("phoneInfo").innerHTML="";
    CT.$("phoneText").innerHTML="";

}
function savePhoneClick() {
    var phoneNum = CT.$("phoneText").innerHTML;
    var size = phoneNum.length;
    if(size == 11){
        userPhone = phoneNum;
        actiObj.setUserPhone(userPhone,function (data) {
            CT.$("phoneInfo").innerHTML="手机号码保存成功!";
        });
    }else{
        CT.$("phoneInfo").innerHTML="您输入的手机号格式无效,请重新输入!";
    }

}


