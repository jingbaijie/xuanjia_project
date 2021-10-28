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

//抽奖机会
var creditNum;

//获取抽奖机会
actiObj.getUserCredit(function(data) {
	if(data && data.resultMsg == "success") {
		creditNum = parseInt(data.creditNum, 10) || 0;
		CT.$("getPrizeChance").innerHTML=creditNum;
	} else {
		creditNum = 0;
		CT.$("getPrizeChance").innerHTML=creditNum;
	}
})

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

//转盘开始旋转
function startLottery() {	
	//转动图片
	var circleImg = 0;

	if(creditNum <= 0) {
		CT.$("lotteryTan").src = "img/tanChuang/noLingJ.png";
		actiObj.changeFocus("hands_x0_y0_lotteryTanFocus_");
	} else {
		var n = Math.ceil(Math.random() * 2 - 1); //获取[0,1]随机数 ，无奖
		var m = Math.ceil(Math.random() * 2 + 1); //获取[2,3]随机数，三等奖
		var k = Math.ceil(Math.random() * 2 + 3); //获取[4,5]随机数，四等奖

		//切换至空焦点
		curFocus.defaultBlur();
		curFocus = getFocusModel6("hands_x0_y0_emptyFocus_");
		curFocus.defaultFocus();
		isRinging = true;

		//每个奖品对应的位置	
		var moveLottery = document.getElementById("moveLottery").getElementsByTagName("img");
		var prizeDeg = [];
		prizeDeg[0] = moveLottery[4];
		prizeDeg[1] = moveLottery[7];
		prizeDeg[2] = moveLottery[3];
		prizeDeg[3] = moveLottery[6];
		prizeDeg[4] = moveLottery[0];
		prizeDeg[5] = moveLottery[2];
		prizeDeg[6] = moveLottery[1];
		prizeDeg[7] = moveLottery[5];
		//旋转圈数
		var ringNum = Math.ceil(Math.random() * 10) + 5;		
		//最终旋转位置
		var prizeRingNum = 0;
		//进行概率计算
		var giftPercent = Math.ceil(Math.random() * 10000);
		if(prizeList[0].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage) {
			//一等奖
			prizeRingNum = prizeDeg[6];
			prizeId = prizeList[0].prize_id;
			prizePrice = prizeList[0].prize_price;
		} else if(prizeList[1].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage) {
			//二等奖
			prizeRingNum = prizeDeg[7];
			prizeId = prizeList[1].prize_id;
			prizePrice = prizeList[1].prize_price;
		} else if(prizeList[2].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage + prizeList[2].prize_percentage) {
			//三等奖
			prizeRingNum = prizeDeg[m];
			prizeId = prizeList[2].prize_id;
			prizePrice = prizeList[2].prize_price;
		} else if(prizeList[3].prize_num > 0 && giftPercent <= prizeList[0].prize_percentage + prizeList[1].prize_percentage + prizeList[2].prize_percentage + prizeList[3].prize_percentage) {
			//四等奖
			prizeRingNum = prizeDeg[k];
			prizeId = prizeList[3].prize_id;
			prizePrice = prizeList[3].prize_price;
		} else {
			//无奖品			
			prizeRingNum = prizeDeg[n];
			prizeId = 100;
			prizePrice = 100;
		}

		ringInterval = setInterval(function() {			
			//document.getElementById("errorTip").innerHTML="ringNum:"+ringNum+"<br/>";
			if(ringNum <= 1) {
				prizeRingNum.style.visibility = "visible";
				clearInterval(ringInterval);
				isRinging = false;
				setPrize();

				CT.$("littleTips").style.visibility = "hidden";
			} else {
				//document.getElementById("errorTip").innerHTML+="circleImg:"+circleImg+"<br/>";
				//console.log(moveLottery);
				//document.getElementById("errorTip").innerHTML+="moveLottery:"+moveLottery+"<br/>";
				//document.getElementById("errorTip").innerHTML+="moveLottery[1]:"+moveLottery[1].style.visibility+"<br/>";
				if(circleImg > 7) {
					ringNum--;
					moveLottery[circleImg - 1].style.visibility = "hidden";
					circleImg = 0;
					if(ringNum != 1) {
						moveLottery[circleImg].style.visibility = "visible";
					}
				} else {									
					moveLottery[circleImg].style.visibility = "visible";
					//document.getElementById("errorTip").innerHTML+="moveLottery[circleImg].style.visibility:"+moveLottery[circleImg].style.visibility+"<br/>";	
					if(circleImg >= 1) {
						moveLottery[circleImg - 1].style.visibility = "hidden";
						//document.getElementById("errorTip").innerHTML+="moveLottery[circleImg - 1].style.visibility:"+moveLottery[circleImg - 1].style.visibility+"<br/>";
					}
				}
				circleImg++;
			}
		}, 100);

		//点击立即抽奖，抽奖次数减一
		creditNum--;
		CT.$("getPrizeChance").innerHTML=creditNum;
		//存储抽奖次数
		actiObj.setUserCredit(creditNum);
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
	CT.$("lotteryTan").src = "img/tanChuang/zhongJ.png";
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
	CT.$("lotteryTan").src = "img/tanChuang/noPrize.png";
}

//转盘转动期间禁止多余操作
function notTips() {
	CT.$("littleTips").style.visibility = "visible";
}