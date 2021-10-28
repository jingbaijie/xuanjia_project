//奖品列表
var prizeList = [];
//转盘旋转定时器
var ringInterval = null;
//是否选中输入框
var isOnFocus = false;
//手机号
var phoneNum = document.getElementById("phoneText").innerHTML;
//奖品ID
var prizeId = 100;
//几等奖
var prizePrice = 100;
//转盘是否正在转动
var isRinging = false;

//获取活动奖品列表
function getActivityPrizeList(){
    actiAjax.init({
        url:getActivityPrizeUrl,
        method:"get",
        params:{
            "activityId": actiActivityId,
            "pageNo": 1,
            "pageSize": 10
        },
        async:true,
        ContentType:"application/x-www-form-urlencoded",
        success:function(data){
            if(data.resultMsg == "success"){
                prizeList = data.list;
            }else{
                prizeList = [];
            }
            console.log(data);
        },
        fail:function(status){

        }
    });
}
getActivityPrizeList();

//DOM元素旋转
function setDegree(obj,deg) {
    //console.log(obj);
    var initText = obj.style.cssText;
    obj.style.cssText = initText +  "transform: rotate(" + deg + "deg);" + "-moz-transform: rotate(" + deg + "deg);" + "-o-transform: rotate(" + deg + "deg); " + "-webkit-transform: rotate(" + deg + "deg);" ;
}
//转盘开始旋转
function startRing(){
    //切换至空焦点
    curFocus.defaultBlur();
    curFocus = getFocusModel6("hands_x0_y0_emptyFocus_");
    curFocus.defaultFocus();
    isRinging = true;
    var turnTable = CT.$("turnTable");
    //转盘每次旋转的最终角度
    var beginDeg = 0;
    //每个奖品对应的最终角度
    var prizeDeg = [45,125,195,265,330];
    //旋转圈数
    var ringNum = Math.ceil(Math.random()*10) + 5;
    //最终旋转度数
    var prizeRingNum = 0;
    //进行概率计算
    if(Math.ceil(Math.random()*100) <= 1){
        var giftPercent = Math.random()*100;
        if(giftPercent === 1){
            //一等奖
            prizeRingNum = ringNum * 360 + prizeDeg[0];
            prizeId = prizeList[0].prize_id;
            prizePrice = prizeList[0].prize_price;
        }else if(giftPercent <= 10){
            //二等奖
            prizeRingNum = ringNum * 360 + prizeDeg[1];
            prizeId = prizeList[1].prize_id;
            prizePrice = prizeList[1].prize_price;
        }else if(giftPercent <= 25){
            //三等奖
            prizeRingNum = ringNum * 360 + prizeDeg[2];
            prizeId = prizeList[2].prize_id;
            prizePrice = prizeList[2].prize_price;
        }else if(giftPercent <= 50){
            //四等奖
            prizeRingNum = ringNum * 360 + prizeDeg[3];
            prizeId = prizeList[3].prize_id;
            prizePrice = prizeList[3].prize_price;
        }else{
            //无奖品
            prizeRingNum = ringNum * 360 + prizeDeg[4];
            prizeId = 100;
            prizePrice = 100;

        }
    }else{
        prizeRingNum = ringNum * 360 + prizeDeg[4];
    }
    console.log(prizeRingNum);
    //不停改变转盘角度进行旋转
	//setDegree(turnTable,120);
    ringInterval = setInterval(function(){

        if(prizeRingNum <= 0){
            prizeRingNum = 0;
            clearInterval(ringInterval);
			isRinging = false;
            setPrize();
			setChance();
        }else if(prizeRingNum <= 100){
            beginDeg += 5;
            prizeRingNum -= 5;
        }else if(prizeRingNum <= 360){
            beginDeg += 15;
            prizeRingNum -= 15;
        }else{
            beginDeg += 50;
            prizeRingNum -=50;
        }
        setDegree(turnTable,beginDeg);
    },50);

}

function setPrize() {
	isRinging = false;
	if(prizePrice <= 4){
		actiAjax.init({
			url:setPrizeUrl,
			method:"get",
			params:{
				"userId": actiUserId,
				"activityId": actiActivityId,
				"prizeId": prizeId
			},
			async:true,
			ContentType:"application/x-www-form-urlencoded",
			success:function(data){
				if(data.resultMsg == "success"){
					showPrize();
				}else{
					showConfirm();
				}
				console.log(data);
			},
			fail:function(status){
				showConfirm();
			}
		});
	}else{
		showConfirm();
	}
    
}

function setChance(){
	actiAjax.init({
		url:setUserDataListUrl,
		method:"get",
		params:{
			"activityId": actiActivityId,
			"userId": actiUserId,
			"user_acti_data": 1
		},
		async:true,
		ContentType:"application/x-www-form-urlencoded",
		success:function(data){
			console.log(data);
		},
		fail:function(status){

		}
	});
}
function showPrize(){
    document.getElementById("confirmDiv").style.visibility = "visible";
    if(prizePrice <= 4){
        CT.$("conBgImg").src = "./images/confirm/savePhone.png";
        var prizeImgs = "prizeImg" + prizePrice;
        CT.$(prizeImgs).style.visibility = "visible";
        curFocus.defaultBlur();
        curFocus = getFocusModel6("hands_x0_y0_getPrizeFocus0_");
        curFocus.defaultFocus();
    }else{
        showConfirm();
    }
}
//弹框显示
function showConfirm(){
    document.getElementById("confirmDiv").style.visibility = "visible";
    CT.$("conBgImg").src = "./images/confirm/noPrize.png";
    curFocus.defaultBlur();
    curFocus = getFocusModel6("hands_x0_y0_noPrizeFocus0_");
    curFocus.defaultFocus();
}

function canWrite(){
    isOnFocus = true;
}
function canNotWrite(){
    isOnFocus = false;
}
//去除空格
function Trim(str,is_global)
{
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase() === "g")
    {
        result = result.replace(/\s/g,"");
    }
    return result;
};
//输入电话号码
phoneNum = Trim(phoneNum,"g");
function changeNum(num){
    if(isOnFocus){
        var size;
        if(phoneNum ===""){
            size=0;
        }else{
            size= phoneNum.length;
        }

        if(size < 11||!size){
            var addnum = phoneNum;
            phoneNum = addnum + num;
        }
        document.getElementById("phoneText").innerHTML=phoneNum;
    }
}
//清除手机号码
function clearPhoneNum(){
    phoneNum = "";
    document.getElementById("phoneInfo").innerHTML="";
    document.getElementById("phoneText").innerHTML="";
}
//保存手机号
function getSave(){
    var phoneNum = document.getElementById("phoneText").innerHTML;
    var size = phoneNum.length;
    if(size === 11){
        actiAjax.init({
            url:setUserPhoneUrl,
            method:"get",
            params:{//userPhone=1234569481&userId=55308836282
                "userPhone":phoneNum,
                "userId": actiUserId
            },
            async:true,
            ContentType:"application/x-www-form-urlencoded",
            success:function(data){
                if(data === true){
                    document.getElementById("phoneInfo").innerHTML="手机号码保存成功";
                }
            },
            fail:function(status){

            }
        });



    }else{
        document.getElementById("phoneInfo").innerHTML="您输入的手机号格式无效,请重新输入!";
    }
}
//转盘转动期间禁止多余操作
function notTips(){
    CT.$("littleTips").style.visibility = "visible";
}
