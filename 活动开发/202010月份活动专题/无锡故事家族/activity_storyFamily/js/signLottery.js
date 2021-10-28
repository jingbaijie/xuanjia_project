/*
 * 获取用户是否签到，获取用户积分，获取剩余奖品数量
 * 用户未签到，点击【今日签到】按钮执行签到操作；用户未签到，【今日签到】按钮不可点
 * 用户积分达到条件，点击【积分兑换】按钮兑换相应奖品；未达到积分条件，【积分兑换】按钮不可点
 */
//构造函数
function signLottery() {
	this.nowDay; //今天的日期	
	this.latSignTime;
	this.userData = {};
	this.userDataStr;
	this.userDataArr = [];
	this.signIcon = CT.$("signIcon").getElementsByTagName("img"); //签到图标
	this.initFunc();
	this.isTodaySign = false; //今日是否签到
	this.isExchange = false; //是否能兑换奖品
	this.creditNum = 0; //当前总积分
	this.isTanchuang = false; //兑换弹窗是否显示
	this.isShowTip = false; //抽奖弹窗
	this.exchangeStandard = 200; //兑换标准
	this.chanceNum = 1; //当天抽奖机会
	this.prizeList = null; //奖品列表
	this.prizeId = null; //获奖Id
	this.isPrize = false; //用户获奖信息
	this.isRing = false; //转盘是否在转动中
	this.ringImg = document.getElementById("hands_x0_y0_lotteryBtnFocus_"); //旋转光标
	this.littleTips = document.getElementById("littleTips"); //旋转提示
	this.ringInterval = null; //旋转定时器
	this.ringTime = 200; //定时器执行时间
	this.ringNum = 0; //已旋转圈数
	this.ringFlag = 0; //旋转抽奖标志
	this.targetRing = 0; //最终旋转圈数
	this.targetPrize = 0; //最终停止奖品格
	this.prizeArr = [4, 0, 6, 2]; //奖品下标数组
	this.noPrizeArr = [1, 3, 5, 7]; //积分下标
	this.prizeIndex; //接口获取奖品下标
	this.ringArr = [
		[50, 65],
		[50, 190],
		[50, 315],
		[175, 315],
		[280, 315],
		[288, 190],
		[280, 65],
		[170, 65]
	]; //奖品格坐标数组 
	this.isFusai = false; //复赛是否获得奖品
	this.isHalfJuesai = false; //半决赛是否获得奖品
	this.isJuesai = false; //决赛是否获得奖品
	this.isLive = false; //是否获得现场录制
	this.fusaiId = false; //复赛Id
	this.fusaiRemainNum = false; //复赛剩余名额
	this.actiUserGetPrizeList = []; //活动获奖用户列表
	this.userPhone = null; //用户手机号
};
//原型对象
signLottery.prototype = {
	constructor: signLottery,
	/*
	 * 签到：
	 * 获取用户前一天是否签到信息，若前一天未签到则回到第一天;
	 * 若前一天签到了，表示连续签到，获取用户今日是否签到信息，未签到点击按钮签到，已签到按钮不可点；
	 */
	initFunc: function() {
		var _this = this;
		var now = new Date();
		var year = now.getFullYear(); //得到年份
		var month = now.getMonth() + 1; //得到月份
		var thisDate = now.getDate(); //得到日期
		if(month < 10) month = "0" + month;
		if(thisDate < 10) thisDate = "0" + thisDate;
		this.nowDay = year + "-" + month + "-" + thisDate;
		this.userDataObj = {
			nowDay: this.nowDay, //今天的日期	
		};
		//获取签到信息
		actiObj.getUserDataList(function(res) {
			if(res.errorCode == "1000") {
				_this.userDataStr = res.data.userActiData;
				_this.userDataArr = JSON.parse(_this.userDataStr);
			} else {
				_this.userDataArr = [];
			}
			if(_this.userDataArr.length > 0) {
				_this.latSignTime = _this.userDataArr[_this.userDataArr.length - 1].nowDay;
				var startTime = Date.parse(new Date(_this.latSignTime));
				var endTime = Date.parse(new Date(_this.nowDay));
				var distanceTime = (endTime - startTime) / 1000 / 3600 / 24 + '';
				for(var i = 0; i < _this.userDataArr.length; i++) {
					if(_this.userDataArr.length <= 7) {
						//签到七天且今日未签到,从第一天开始
						if(_this.userDataArr.length == 7 && distanceTime == 1) {
							CT.$("todaySignBtn").src = "img/signBtn.png";
							CT.$("continuousNum").innerHTML = "0";
							_this.userDataArr = [];
							//连续签到,今日未签到
						} else if(distanceTime == 1) {
							CT.$("todaySignBtn").src = "img/signBtn.png";
							_this.signIcon[i].src = "img/sign/" + (i + 1) + "-" + (i + 1) + ".png";
							CT.$("continuousNum").innerHTML = _this.userDataArr.length;
							//连续签到，今日已签到
						} else if(distanceTime == 0) {
							_this.isTodaySign = true;
							CT.$("todaySignBtn").src = "img/signed.png";
							_this.signIcon[i].src = "img/sign/" + (i + 1) + "-" + (i + 1) + ".png";
							CT.$("continuousNum").innerHTML = _this.userDataArr.length;
							//不是连续签到,回到第一天	
						} else {
							CT.$("todaySignBtn").src = "img/signBtn.png";
							CT.$("continuousNum").innerHTML = "0";
							_this.userDataArr = [];
						}
					}
				}
				//焦点初始化
				PAGE.focusInit();
				//第七天签到完成,焦点落在抽奖按钮上，抽奖一次存储一次机会
				if(_this.userDataArr.length == 7 && distanceTime == 0) {
					//获取当天抽奖机会
					actiObj.getChance(function(res) {
						if(res.errorCode == "1000") {
							_this.chanceNum = res.data.activityChance;
						} else {
							_this.chanceNum = 1;
						}
						//若抽奖机会等于0，有抽奖机会
						if(_this.chanceNum == 0) {
							PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
						} else {
							PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
						}
					});
				} else {
					PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
				}

			} else {
				//第一次进入,没有签到过
				CT.$("todaySignBtn").src = "img/signBtn.png";
				CT.$("continuousNum").innerHTML = "0";
				//焦点初始化
				PAGE.focusInit();
				PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
			}
		});

		//获取积分信息
		_this.getCreditInfo();
		//获取活动奖品信息
		_this.getPrizeInfo();
		//获取活动获奖用户信息
		_this.getPrizeUserInfoFunc();
		//获取用户手机号
		_this.getUserPhoneFunc();

	},
	/*
	 * 获取用户手机号
	 */
	getUserPhoneFunc: function() {
		var _this = this;
		actiObj.getUserPhone(function(res) {
			if(res.errorCode == "1000") {
				_this.userPhone = res.data.userPhone;
			}
		});
	},
	/*
	 * 获取积分信息
	 */
	getCreditInfo: function() {
		var _this = this;
		//获取积分信息
		actiObj.getUserCredit(function(res) {
			if(res && res.successFlg == "1") {
				_this.creditNum = parseInt(res.data.creditNum, 10);
				//积分兑换按钮开启
				//				_this.creditNum = 1000;
				CT.$("scoreNum").innerHTML = _this.creditNum;
				if(_this.creditNum >= _this.exchangeStandard) {
					CT.$("exchangeBtn").src = "img/exchangeBtn.png";
					_this.isExchange = true; //可以兑换奖品
				}
			} else {
				_this.creditNum = 0;
			}
		});
	},
	/*
	 * 点击签到按钮
	 */
	todaySignFunc: function() {
		var _this = this;
		//今日未签到才可以点击，否则不能点击
		if(!this.isTodaySign) {
			this.userDataArr.push(this.userDataObj);
			actiObj.setUserDataList(JSON.stringify(this.userDataArr), function(res) {
				if(res && res.successFlg == "1") {
					_this.isTodaySign = true; //今日已签到
					CT.$("todaySignBtn").src = "img/signed.png";
					_this.signIcon[_this.userDataArr.length - 1].src = "img/sign/" + (_this.userDataArr.length) + "-" + (_this.userDataArr.length) + ".png";
					CT.$("continuousNum").innerHTML = _this.userDataArr.length;
					//积分加十分
					CT.$("get10ScoreTip").style.visibility = "visible";
					//存储积分
					_this.creditNum += 10;
					_this.setUserCreditFunc(_this.creditNum);
					//积分兑换按钮开启
					if(_this.creditNum >= _this.exchangeStandard) {
						CT.$("exchangeBtn").src = "img/exchangeBtn.png";
						_this.isExchange = true; //可以兑换奖品
					}
					//七天签到成功获得抽奖机会
					if(_this.userDataArr.length == 7) {
						PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
					}
				}
			});
		};
	},
	/*
	 * 积分兑换
	 */
	exchangeFunc: function() {
		var _this = this;
		//达到兑换条件点击兑换按钮才有反应
		if(_this.isExchange) {
			CT.$("exchangeTip").style.visibility = "visible";
			PAGE.changeFocus("hands_x0_y0_exchangePageBtnFocus_");
			this.isTanchuang = true; //弹窗显示
			//当前用户获奖信息
			actiObj.getUserPrizeInfo(14, function(res) {
				if(res.successFlg == 1) {
					_this.isFusai = true;
				}
			});
			//当前奖品信息			
			actiObj.getActivityPrize(14, function(res) {
				if(res.errorCode == "1000") {
					_this.fusaiId = res.data.records[0].id;
					_this.fusaiRemainNum = res.data.records[0].prizeRemainNum;
				}
			});
		}
	},
	/*
	 * 积分页积分兑换按钮
	 */
	exchangePageBtnFunc: function() {
		var _this = this;
		if(this.isExchange) {
			//有没有兑换过奖品》》》没有兑换过，判断剩余奖品还有没有，有进行兑换，没有剩余奖品提示奖品已经对完
			if(!_this.isFusai) { //没有兑换过
				if(_this.fusaiRemainNum > 0) { //复赛剩余名额
					actiObj.setPrize(14, _this.fusaiId, function(res) {
						//兑换成功
						_this.creditNum -= _this.exchangeStandard;
						actiObj.setUserCredit(_this.creditNum, function(res) {
							if(res.successFlg == "1") {
								CT.$("exchangeMessage").innerHTML = "恭喜你成功晋级复赛！";
								_this.isFusai = true;
								CT.$("scoreNum").innerHTML = _this.creditNum;
								//如果用户未填写手机号，弹出手机号弹窗
								if(_this.userPhone == null) {
									setTimeout(function() {
										CT.$("exchangeTip").style.visibility = "hidden";
										CT.$('modalBox').style.visibility = 'visible';
										PAGE.changeFocus('hands_x0_y0_inputX_');
									}, 1000);
								}
							}
						});
					});
				} else {
					//晋级复赛名额已满
					CT.$("exchangeMessage").innerHTML = "抱歉，复赛名额已满！";
				}
			} else {
				//已经兑换过
				CT.$("exchangeMessage").innerHTML = "您已兑换过复赛晋级名额，不可重复兑换！";
				//如果用户未填写手机号，弹出手机号弹窗
				if(_this.userPhone == null) {
					setTimeout(function() {
						CT.$("exchangeTip").style.visibility = "hidden";
						CT.$('modalBox').style.visibility = 'visible';
						PAGE.changeFocus('hands_x0_y0_inputX_');
					}, 1000);
				}
			}
		}
	},
	/*
	 * 抽奖
	 */
	lotteryFunc: function() {
		var _this = this;
		//上传第七天当天抽奖机会
		actiObj.setChance(function(res) {
			if(res.successFlg == "1") {
				_this.isRing = true;
				_this.probabilityFunc();
				_this.toRing();
			}
		});
	},
	/*
	 * 概率计算
	 */
	probabilityFunc: function() {
		this.targetRing = Math.ceil(Math.random() * 3) + 3;
		var userNum = Math.ceil(Math.random() * 1000);
		if(userNum <= this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[3].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[3].id;
			this.targetPrize = 4;
			this.prizeIndex = 3;
		} else if(userNum <= this.prizeList[1].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[1].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[1].id;
			this.targetPrize = 0;
			this.prizeIndex = 1;
		} else if(userNum <= this.prizeList[2].prizePercentage + this.prizeList[1].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[2].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[2].id;
			this.targetPrize = 6;
			this.prizeIndex = 2;
		} else if(userNum <= this.prizeList[0].prizePercentage + this.prizeList[2].prizePercentage + this.prizeList[1].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[0].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[0].id;
			this.targetPrize = 2;
			this.prizeIndex = 0;
		} else {
			this.targetPrize = this.noPrizeArr[Math.floor(Math.random() * 4)];
		}
	},
	/*
	 * 转盘开始旋转
	 */
	toRing: function() {
		var _this = this;
		this.ringTime = 200;
		clearInterval(this.ringInterval);
		PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
		this.ringInterval = setInterval(function() {
			_this.ringImg.style.top = _this.ringArr[_this.ringFlag % 8][0] + "px";
			_this.ringImg.style.left = _this.ringArr[_this.ringFlag % 8][1] + "px";
			if(_this.ringFlag !== 0 && _this.ringFlag % 8 === 0) {
				_this.ringNum += 1;
			}
			if(_this.ringNum >= _this.targetRing && Math.abs(_this.targetPrize - _this.ringFlag % 8) < 3) {
				_this.ringTime = 500;
				actiObj.removeClass(_this.ringImg, "fastRow");
				actiObj.addClass(_this.ringImg, "slowRow");
			}
			if(_this.targetRing === _this.ringNum && _this.ringFlag % 8 === _this.targetPrize) {
				clearInterval(_this.ringInterval);
				_this.ringFlag = 0;
				_this.ringNum = 0;
				_this.stopRing();
			} else {
				_this.ringFlag++;
			}
		}, this.ringTime);
	},
	stopRing: function() {
		var _this = this;
		this.isRing = false;
		if(this.prizeArr.indexOf(this.targetPrize) > -1) {
			//判断奖品剩余
			if(this.prizeList[this.prizeIndex].prizeRemainNum > 0) {
				actiObj.setPrize(actiActivityId, this.prizeId, function() {
					setTimeout(function() {
						_this.showGetPrize(_this.targetPrize);
					}, 1000);
				});
			} else {
				_this.showTips(2);
			}
		} else {
			setTimeout(function() {
				_this.showNoPrize();
			}, 1000);
		}
	},
	/*
	 * 获奖
	 */
	showGetPrize: function(targetPrize) {
		this.isPrize = true;
		this.isShowTip = true;
		CT.$("getprizeTipBG").style.visibility = "visible";
		if(targetPrize == 4) {
			CT.$("getprizeTip").src = "img/tip/legaowanju.png";
		} else if(targetPrize == 0) {
			CT.$("getprizeTip").src = "img/tip/aroundProduct.png";
		} else if(targetPrize == 6) {
			CT.$("getprizeTip").src = "img/tip/day30xldm.png";
		} else if(targetPrize == 2) {
			CT.$("getprizeTip").src = "img/tip/day15xldm.png";
		}
		PAGE.changeFocus("hands_x0_y0_getprizeFocus_");
	},
	/*
	 * 获得积分不是实物奖品
	 */
	showNoPrize: function() {
		var _this = this;
		this.isShowTip = true;
		CT.$("getprizeTipBG").style.visibility = "visible";
		if(this.targetPrize == 1) {
			CT.$("getprizeTip").src = "img/tip/score5Tip.png";
			this.creditNum += 5;
		} else if(this.targetPrize == 3) {
			CT.$("getprizeTip").src = "img/tip/score10Tip.png";
			this.creditNum += 10;
		} else if(this.targetPrize == 5) {
			CT.$("getprizeTip").src = "img/tip/score20Tip.png";
			this.creditNum += 20;
		} else if(this.targetPrize == 7) {
			CT.$("getprizeTip").src = "img/tip/score30Tip.png";
			this.creditNum += 30;
		}
		PAGE.changeFocus("hands_x0_y0_getprizeFocus_");
		//存储积分
		this.setUserCreditFunc(this.creditNum);
	},
	showTips: function(index) {
		var _this = this;
		if(index == 1) {
			this.littleTips.innerHTML = "转盘转动中,请勿做多余操作";
		} else if(index == 2) {
			this.littleTips.innerHTML = "很抱歉，该奖品已数量不足";
		}
		setTimeout(function() {
			_this.littleTips.innerHTML = "";
			if(index == 2) {
				PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
			}
		}, 2000);
	},
	/*
	 * 获取活动剩余奖品
	 */
	getPrizeInfo: function() {
		var _this = this;
		actiObj.getActivityPrize(actiActivityId, function(prizeData) {
			if(prizeData.successFlg == 1) {
				_this.prizeList = prizeData.data.records;
			} else {
				_this.prizeList = [];
			}
			//获取用户获奖信息
			actiObj.getUserPrizeInfo(actiActivityId, function(userData) {
				if(userData.successFlg == 1) {
					_this.isPrize = true;
				}
			});
		});
	},
	//中奖确认按钮
	getprizeConfirm: function() {
		this.isShowTip = false;
		CT.$("getprizeTipBG").style.visibility = "hidden";
		PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
	},
	//存储积分
	setUserCreditFunc: function(creditNum) {
		var _this = this;
		actiObj.setUserCredit(creditNum, function(res) {
			if(res.errorCode == "1000") {
				CT.$("scoreNum").innerHTML = _this.creditNum;
			}
		});
	},
	/*
	 * 获取活动所有获奖用户信息
	 * 获奖名单公告滚屏
	 */
	getPrizeUserInfoFunc: function() {
		var _this = this;
		var actiUserGetPrizeListHtml = "";
		actiObj.getPrizeUserInfo(function(res) {
			if(res.errorCode == "1000" && res.successFlg == "1") {
				_this.actiUserGetPrizeList = res.data.records;
				CT.$("speakerTotal").innerHTML = "";
				if(_this.actiUserGetPrizeList.length > 0) {
					for(var i = 0; i < _this.actiUserGetPrizeList.length; i++) {
						actiUserGetPrizeListHtml = "<li>恭喜用户" + _this.actiUserGetPrizeList[i].userId + "获得" + _this.actiUserGetPrizeList[i].prizeCname + "</li>";
						CT.$("speakerTotal").innerHTML += actiUserGetPrizeListHtml;
					}
				}else{
					actiUserGetPrizeListHtml = "<li>恭喜用户180***7080获得炫力少儿15天体验券</li><li>恭喜用户139***0906获得炫力少儿30天体验券</li><li>恭喜用户136***2019获得动漫周边产品</li>";
					CT.$("speakerTotal").innerHTML += actiUserGetPrizeListHtml;
				}
				setInterval('autoScroll("#speaker")', 2000);
			}
		});
	}
}

//公告滚屏
function autoScroll(obj) {
	$(obj).find("#speakerTotal").animate({
		top: "-30px"
	}, 500, function() {
		$(this).css({
			top: "0px"
		}).find("li:first").appendTo(this);
	});
};

function backfunc() {
	if(signLotteryPS.isTanchuang) {
		signLotteryPS.isTanchuang = false; //弹窗显示
		CT.$("exchangeTip").style.visibility = "hidden";
		PAGE.changeFocus("hands_x0_y0_exchangeBtnFocus_");
		CT.$('modalBox').style.visibility = 'hidden';
	} else if(signLotteryPS.isRing) {
		signLotteryPS.showTips(1);
	} else if(signLotteryPS.isShowTip) {
		signLotteryPS.isShowTip = false; //弹窗显示
		CT.$("getprizeTipBG").style.visibility = "hidden";
		PAGE.changeFocus("hands_x0_y0_todaySignFocus_");
	} else {
		CT.backPage();
	}
}

var box = document.getElementById('ruleText');
var con1 = document.getElementById('ruleText_ul');
var con2 = document.getElementById('ruleText_ul2');
con2.innerHTML = con1.innerHTML;

function scrollUp() {
	if(box.scrollTop >= con1.offsetHeight) {
		box.scrollTop = 0;
	} else {
		box.scrollTop++;
	}
}
var time = 50;
setTimeout(function() {
	var mytimer = setInterval(scrollUp, time);
}, 2000);

//手机号输入
var phoneFocus = false; //输入框是否获焦
function onFocus(index) {
	if(index == 1) {
		phoneFocus = true;
	} else if(index == 0) {
		phoneFocus = false;
	}
}

// 用户保存手机号
function confirmHandle() {
	var phoneHTML = CT.$("inputDiv").innerHTML + "";
	var phoneTips = CT.$("phoneTips");
	var phoneSize = phoneHTML.length;
	var TEL_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
	if(phoneSize >= 11 && TEL_REGEXP.test(phoneHTML)) {
		actiObj.setUserPhone(phoneHTML, function(data) {
			if(data) {
				actiObj.setUserCredit(parseInt(signLotteryPS.creditNum) + 100, function() {
					signLotteryPS.creditNum += 100;
					CT.$("scoreNum").innerHTML = signLotteryPS.creditNum;
					phoneTips.innerHTML = "手机号码保存成功";
				});
			} else {
				phoneTips.innerHTML = "手机号码保存失败";
			}
		});
	} else {
		CT.$("inputDiv").innerHTML = "";
		phoneTips.innerHTML = "您输入的手机号格式无效,请重新输入!"
	}
}

//输入框输入数字方法
changeNumObj.changeNum = function(num) {
	if(phoneFocus) {
		var phoneHTML = CT.$("inputDiv").innerHTML + "";
		var phoneSize = phoneHTML.length;
		if(phoneSize < 11) {
			phoneHTML += "" + num;
		}
		CT.$("inputDiv").innerHTML = phoneHTML;
	}
}

//实例
var signLotteryPS = new signLottery();