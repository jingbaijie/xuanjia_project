//奖品列表
var prizeList = [];
//转盘旋转定时器
var ringInterval = null;

//奖品ID
var prizeId = 100;
//几等奖
var prizePrice = 100;
//转盘是否正在转动
var isRinging = false;

//转盘图片
var circleImg = 1;

//获取活动奖品列表
function getActivityPrizeList() {
	actiAjax.init({
		url: actiObj.getActivityPrizeUrl,
		method: "get",
		params: {
			"activityId": actiActivityId,
			"pageNo": 1,
			"pageSize": 10
		},
		async: true,
		ContentType: "application/x-www-form-urlencoded",
		success: function(data) {
			if(data.resultMsg == "success") {
				prizeList = data.list;
			} else {
				prizeList = [];
			}
			console.log(data);
		},
		fail: function(status) {

		}
	});
}
getActivityPrizeList();

//获取积分，恐龙数量
var creditNum = 0;
actiObj.getUserCredit(function(res) {
	if(res.resultMsg == "success") {
		creditNum = res.creditNum;
		if(creditNum < 10) {
			CT.$("pointer").src = "img/lottery/btn3.png";
		} else {
			CT.$("pointer").src = "img/lottery/btn2.png";
		}
	}
})



//转盘开始旋转
function lotteryStartFunc() {
	var n = Math.ceil(Math.random() * 4 - 1); //获取-1到4随机数 
	if(creditNum >= 10) {
		CT.$("pointer").src = "img/lottery/btn2.png";
		//切换至空焦点
		curFocus.defaultBlur();
		curFocus = getFocusModel6("hands_x0_y0_emptyFocus_");
		curFocus.defaultFocus();
		isRinging = true;
		var turnTable = CT.$("turnTable");
		
		//每个奖品对应的图片
		var prizeDeg = [2, 4, 6, 8, 5, 3, 7, 1];
		//旋转圈数
		var ringNum = Math.ceil(Math.random() * 10) + 5;
		//最终旋转图片
		var prizeRingNum = 0;
		//进行概率计算
		var giftPercent = Math.ceil(Math.random() * 10000);
		if(prizeList[0].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage) {
			//一等奖
			prizeRingNum = prizeDeg[7];
			prizeId = prizeList[0].prize_id;
			prizePrice = prizeList[0].prize_price;
		} else if(prizeList[1].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage) {
			//二等奖
			prizeRingNum = prizeDeg[6];
			prizeId = prizeList[1].prize_id;
			prizePrice = prizeList[1].prize_price;
		} else if(prizeList[2].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage + prizeList[2].prize_percentage) {
			//三等奖
			prizeRingNum = prizeDeg[5];
			prizeId = prizeList[2].prize_id;
			prizePrice = prizeList[2].prize_price;
		} else if(prizeList[3].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage + prizeList[2].prize_percentage + prizeList[3].prize_percentage) {
			//四等奖
			prizeRingNum = prizeDeg[4];
			prizeId = prizeList[3].prize_id;
			prizePrice = prizeList[3].prize_price;
		} else {
			//无奖品			
			prizeRingNum = prizeDeg[n];
			prizeId = 100;
			prizePrice = 100;
		}
		

		ringInterval = setInterval(function() {
			if(ringNum == 0) {
				CT.$("turnTable").src = "img/lottery/turntable/" + prizeRingNum + ".png";
				clearInterval(ringInterval);
				prizeRingNum = 0;
				clearInterval(ringInterval);
				isRinging = false;
				setPrize();
				creditNum -= 10;
				//存积分
				actiObj.setUserCredit(creditNum);
				CT.$("littleTips").style.visibility = "hidden";
			} else {
				ringNum--;
				if(circleImg > 8) {
					circleImg=1;
					CT.$("turnTable").src = "img/lottery/turntable/" + circleImg + ".png";
				} else {
					CT.$("turnTable").src = "img/lottery/turntable/" + circleImg + ".png";
				}
				circleImg++;
			}
		}, 100);
	} else {
		actiObj.changeFocus("hands_x0_y0_lotteryTanFocus_");
		CT.$("lotteryTan").src = "img/tips/noChance.png";
		CT.$("pointer").src = "img/lottery/btn3.png";
	}
}

function setPrize() {
	isRinging = false;
	if(prizePrice <= 4) {
		actiAjax.init({
			url: actiObj.setPrizeUrl,
			method: "get",
			params: {
				"userId": actiUserId,
				"activityId": actiActivityId,
				"prizeId": prizeId
			},
			async: true,
			ContentType: "application/x-www-form-urlencoded",
			success: function(data) {
				if(data.resultMsg == "success") {
					showPrize();
				} else {
					showConfirm();
				}
				console.log(data);
			},
			fail: function(status) {
				showConfirm();
			}
		});
	} else {
		showConfirm();
	}
}

function showPrize() {
	CT.$("lotteryTan").src = "img/tips/zhongjiang.png";
	actiObj.changeFocus("hands_x0_y0_lotteryTanFocus_");
	if(prizePrice <= 4) {
		actiObj.changeFocus("hands_x0_y0_zhongjiangFocus_");
	} else {
		showConfirm();
	}
}

//未中奖显示
function showConfirm() {
	actiObj.changeFocus("hands_x0_y0_lotteryTanFocus_");
	CT.$("lotteryTan").src = "img/tips/nochouzhong.png";
}

//转盘转动期间禁止多余操作
function notTips() {
	CT.$("littleTips").style.visibility = "visible";
}

//点击提示框确定按钮
function lotteryTips() {
	if(CT.$("lotteryTan").src=="http://112.25.69.5:8192/XuanLi_Cartoon/HD/html/column/actiDisney/img/tips/noChance.png"){
		backfunc();
	}else{
		actiObj.changeFocus("hands_x0_y0_lotteryFocus_");
		CT.$("lotteryTan").src = "img/game/empty.png";
	}	
}