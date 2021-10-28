/*
 *未订购用户：一次抽奖机会，看视频不会增加抽奖机会；
 *订购用户：每天三次机会抽奖，看一次视频增加一次抽奖机机会，最多三次；
 */
function belleSendGift() {
	this.lotteryIndex = 0; //抽奖按钮图片变量
	this.totalChance = 0; //今日总的抽奖机会，未订购1，已订购3，看一次视频+1
	this.remainChance = 0; //今日剩余抽奖机会
	this.useChance = 0; //今日使用抽奖机会
	this.isOrder = 1; //是否订购,0表示已订购
	this.timeRecords; //时间记录
	this.lotteryAni = null; //定时器
	this.nowDate = 0;//当天日期
	this.getBackFocus;//记忆焦点
	this.init(); //页面初始化
	this.prizeList = null; //奖品列表
	this.prizeId = null; //获奖Id
	this.isPrize = false; //用户获奖信息
	this.isRing = false; //转盘是否在旋转中
	this.ringImg = document.getElementById("hands_x0_y0_lotteryBtnFocus_"); //旋转光标
	this.littleTips = document.getElementById("littleTips"); //旋转提示
	this.ringInterval = null; //旋转定时器
	this.ringTime = 200; //定时器执行时间
	this.ringNum = 0; //已旋转圈数
	this.ringFlag = 0; //旋转抽奖标志
	this.targetRing = 0; //最终旋转圈数
	this.targetPrize = 0; //最终停止奖品格
	this.prizeArr = [1, 3, 7, 5]; //奖品下标数组
	this.noPrizeArr = [0, 2, 4, 6]; //无奖品下标数组
	this.prizeIndex; //接口获取奖品下标
	this.ringArr = [
		[195, 700],
		[195, 850],
		[195, 1005],
		[348, 1005],
		[500, 1005],
		[500, 850],
		[500, 700],
		[348, 700]
	];
	this.cartoonId;//跳转卡通id
	this.isShowTip = false;//弹窗是否显示，默认不显示
}
belleSendGift.prototype = {
	constructor: belleSendGift,
	/*
	 *焦点初始化：初始化焦点为第一个卡通IP
	 *有抽奖机会：抽奖按钮动画；无抽奖机会：次数用完按钮；抽奖中：抽奖中按钮；
	 */
	init: function () {
		var _this = this;
		this.nowDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当天日期	
		this.getBackFocus = CT.getCookie("backCurFocus");//获取记忆焦点	
		//鉴权
		orderJs.columnGetAuth(function (data) {
			if (data == "0") {
				_this.isOrder = 0;
			} else {
				_this.isOrder = 1;
			}
			//焦点初始化
			PAGE.focusInit();
			if (_this.getBackFocus) {
				PAGE.changeFocus(_this.getBackFocus);
			} else {
				PAGE.changeFocus("hands_x0_y0_songIPFocus_");
			}
			//已订购用户，通过userdata获取今日总抽奖机会,通用getchance获取今日已使用机会
			if (_this.isOrder == 0) {
				actiObj.getUserDataList(actiActivityId, function (res) {
					if (res.successFlg == "1") {
						var getUserData = res.data.userActiData;
						_this.timeRecords = getUserData.split("_")[0];
						if (_this.nowDate != _this.timeRecords) {
							_this.totalChance = 3;
						} else {
							_this.totalChance = parseInt(getUserData.split("_")[1]);
						}
					} else {
						_this.totalChance = 3;
					}
					_this.getChanceFunc();
				});
			} else {
				_this.totalChance = 1;
				_this.getChanceFunc();
			}
		});
		//获取活动奖品信息
		_this.getPrizeInfo();
	},
	/*
	 *获取用户今日已使用机会
	 */
	getChanceFunc: function () {
		var _this = this;
		actiObj.getChance(actiActivityId, function (data) {
			_this.useChance = data.data.activityChance;
			_this.remainChance = _this.totalChance - _this.useChance;
			if (_this.remainChance <= 0) {
				_this.noChanceFunc();
			} else {
				_this.lotteryBtnAni();
			}
		});
	},
	/*
	 *聚焦和失去焦点
	 */
	onLotteryFocus: function (index) {
		if (index == 0) {
			if(PAGE.getFocusModel6("hands_x0_y0_lotteryBtnFocus_").enFocus){
				this.lotteryBtnAni();
			}		
		} else {
			//聚焦清除定时器
			clearInterval(this.lotteryAni);
			this.lotteryAni = null;
		}
	},
	/*
	 *次数用完，显示灰色抽奖按钮
	 */
	noChanceFunc: function () {
		CT.$("lotteryBtn").src = "img/mainPage/noLottery.png";
		//抽奖按钮焦点被禁
		PAGE.getFocusModel6("hands_x0_y0_lotteryBtnFocus_").enFocus = false;
	},
	/*
	 *抽奖按钮动画
	 */
	lotteryBtnAni: function () {
		var _this = this;
		this.lotteryAni = setInterval(function () {
			if (_this.lotteryIndex % 2 == 0) {
				CT.$("lotteryBtn").src = "img/mainPage/lotteryBtn1.png";
			} else {
				CT.$("lotteryBtn").src = "img/mainPage/lotteryBtn2.png";
			}
			_this.lotteryIndex++;
		}, 200);
	},
	/*
	 *页面跳转
	 */
	pageJump: function (index) {
		CT.setCookie("backCurFocus", curFocus.FocusID);//焦点记忆
		if (index == 0) {
			window.location.href = "belleSendGiftRule.html";
		} else if (index == 1) {
			window.location.href = "belleSendGiftPrize.html";
		}
	},
	/*
	 * 抽奖
	 */
	lottery: function () {
		var _this = this;
		//上传已用机会
		this.useChance++;
		actiObj.setChance(actiActivityId, function (res) {
			if (res.successFlg == "1") {
				//转盘正在旋转
				_this.isRing = true;
				//概率计算
				_this.probabilityFunc();
				//转盘开始旋转
				_this.toRing();
			}
		});
	},
	/*
	 * 概率计算
	 */
	probabilityFunc: function () {
		this.targetRing = Math.ceil(Math.random() * 3) + 3; //[4,6]随机数
		var userNum = Math.ceil(Math.random() * 1000); //[1,1000]随机数
		if (userNum <= this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[3].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[3].id;
			this.targetPrize = 1;
			this.prizeIndex = 3;
		} else if (userNum <= this.prizeList[2].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[2].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[2].id;
			this.targetPrize = 3;
			this.prizeIndex = 2;
		} else if (userNum <= this.prizeList[1].prizePercentage + this.prizeList[2].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[1].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[1].id;
			this.targetPrize = 7;
			this.prizeIndex = 1;
		} else if (userNum <= this.prizeList[0].prizePercentage + this.prizeList[1].prizePercentage + this.prizeList[2].prizePercentage + this.prizeList[3].prizePercentage && this.prizeList && this.prizeList[0].prizeRemainNum > 0 && !this.isPrize) {
			this.prizeId = this.prizeList[0].id;
			this.targetPrize = 5;
			this.prizeIndex = 0;
		} else {
			this.targetPrize = this.noPrizeArr[Math.floor(Math.random() * 4)];
		}
	},
	/*
	 * 转盘开始旋转
	 */
	toRing: function () {
		var _this = this;
		this.ringTime = 200;
		clearInterval(this.ringInterval);
		PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
		this.ringInterval = setInterval(function () {
			_this.ringImg.style.top = _this.ringArr[_this.ringFlag % 8][0] + "px";
			_this.ringImg.style.left = _this.ringArr[_this.ringFlag % 8][1] + "px";
			//转一圈
			if (_this.ringFlag !== 0 && _this.ringFlag % 8 === 0) {
				_this.ringNum += 1;
			}
			//已转圈数达到目标圈数且距离目标奖品格小于三格时，降低旋转速度
			if (_this.ringNum >= _this.targetRing && Math.abs(_this.targetPrize - _this.ringFlag % 8) < 3) {
				_this.ringTime = 500;
				//actiObj.removeClass(_this.ringImg, "fastRow");
				//actiObj.addClass(_this.ringImg, "slowRow");
			}
			//已转圈数达到目标圈数且光标到达目标奖品格时停止转动
			if (_this.targetRing === _this.ringNum && _this.ringFlag % 8 === _this.targetPrize) {
				clearInterval(_this.ringInterval);
				_this.ringFlag = 0;
				_this.ringNum = 0;
				_this.stopRing(); //停止转动
			} else {
				_this.ringFlag++;
			}
		}, this.ringTime);
	},
	stopRing: function () {
		var _this = this;
		this.isRing = false;
		if (this.prizeArr.indexOf(this.targetPrize) > -1) {
			//判断奖品剩余
			if (this.prizeList[this.prizeIndex].prizeRemainNum > 0) {
				actiObj.setPrize(actiActivityId, this.prizeId, function () {
					setTimeout(function () {
						_this.showGetPrize(_this.targetPrize);
					}, 1000);
				});
			} else {
				//奖品被抽完弹窗
				this.tanchuangShow(3);
			}
		} else {
			setTimeout(function () {
				_this.showNoPrize();
			}, 1000);
		}
	},
	/*
	 * 获奖
	 */
	showGetPrize: function (targetPrize) {
		this.isprize = true;
		this.isShowTip = true;
		if (targetPrize == 1 || targetPrize == 3 || targetPrize == 7 || targetPrize == 5) {
			this.tanchuangShow(1);
		}
	},
	/*
	 * 没有中奖
	 */
	showNoPrize: function () {
		this.isShowTip = true;
		this.tanchuangShow(2);
	},
	/*
	 * 抽奖中勿操作提示
	 */
	showTips: function () {
		var _this = this;
		this.littleTips.innerHTML = "转盘转动中，请勿做多余操作！";
		setTimeout(function () {
			_this.littleTips.innerHTML = "";
		}, 2000);
	},
	/*
	 * 获取活动奖品信息
	 */
	getPrizeInfo: function () {
		var _this = this;
		actiObj.getActivityPrize(actiActivityId, function (prizeData) {
			if (prizeData.successFlg == 1) {
				_this.prizeList = prizeData.data.records;
			} else {
				_this.prizeList = [];
			}
			//获取用户获奖信息
			actiObj.getUserPrizeInfo(actiActivityId, function (userData) {
				if (userData.successFlg == 1) {
					_this.isPrize = true;
				}
			});
		});
	},
	/*
	*IP跳转,非订购用户跳转订购；订购用户》》当天且总次数没超过3+3,上传数据，反之如果超过，则不上传数据
	*/
	jumpIP: function (index) {
		CT.setCookie("backCurFocus", curFocus.FocusID);//焦点记忆
		if (this.isOrder == 0) {
			if (this.totalChance < 6) {
				//上传当日日日期和总的抽奖机会
				this.totalChance++;
				actiObj.setUserDataList(actiActivityId, this.nowDate + "_" + this.totalChance);
			}
			//跳转IP片单操作
			if (index == 1) {
				cartoonId = "2433";
			} else if (index == 2) {
				cartoonId = "2434";
			} else if (index == 3) {
				cartoonId = "2539";
			} else if (index == 4) {
				cartoonId = "2438";
			} else if (index == 5) {
				cartoonId = "2440";
			} else if (index == 6) {
				cartoonId = "2435";
			}
			var params = {
				contentId: 3,
				cartoonId: cartoonId,
				contentType: "page"
			};
			CT.setCookie("columnBackUrl", window.location.href);
			CT.getAnterByIdOrAction(params);
		} else {
			//跳转订购
			this.toOrder();
		}
	},
	/*
	*跳转订购
	*/
	toOrder: function () {
		CT.goPage();
		orderJs.columnToOrderPage("belleSendGift");
	},
	/*
	*右移事件
	*/
	rightEventFunc: function () {
		if (PAGE.getFocusModel6("hands_x0_y0_lotteryBtnFocus_").enFocus == false) {
			PAGE.changeFocus("hands_x0_y0_ruleBtnFocus_");
		} else {
			PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
		}
	},
	/*
	*左移事件
	*/
	leftEventFunc: function () {
		if (PAGE.getFocusModel6("hands_x0_y0_lotteryBtnFocus_").enFocus == false) {
			PAGE.changeFocus("hands_x0_y0_storyIPFocus_");
		} else {
			PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
		}
	},
	/*
	*弹窗显示
	*/
	tanchuangShow: function (tipType) {
		this.isShowTip = true;
		CT.$("tipBG").style.visibility = "visible";
		//恭喜获奖
		if (tipType == 1) {
			CT.$("tipImg").src = "img/tip/congratulations.png";
			//很遗憾没有获奖
		} else if (tipType == 2) {
			CT.$("tipImg").src = "img/tip/pity.png";
			//奖品被抽完
		} else if (tipType == 3) {
			CT.$("tipImg").src = "img/tip/noNum.png";
		}
		PAGE.changeFocus("hands_x0_y0_tipImgFocus_");
	},
	/*
	*初始化转盘页面
	*/
	initLottery:function(){
		//actiObj.addClass(this.ringImg, "fastRow");
		//actiObj.removeClass(this.ringImg, "slowRow");
		this.ringImg.style.top = "355px";
		this.ringImg.style.left = "850px";
	}
}

/*
*正常返回到平台首页
*弹窗出现返回到活动首页：若机会用完，抽奖按钮禁用；若还有机会，焦点还是落在抽奖按钮上；
*抽奖中按返回出现提示文字
*/
function backfunc() {
	CT.delCookie("backCurFocus");//删除记忆焦点
	belleSendGiftMain.remainChance = belleSendGiftMain.totalChance - belleSendGiftMain.useChance;
	//弹窗显示
	if (belleSendGiftMain.isShowTip) {
		belleSendGiftMain.isShowTip = false;
		//关闭弹窗
		CT.$("tipBG").style.visibility = "hidden";
		if (belleSendGiftMain.remainChance <= 0) {//机会用完
			belleSendGiftMain.noChanceFunc();
			PAGE.changeFocus("hands_x0_y0_songIPFocus_");
			clearInterval(belleSendGiftMain.lotteryAni);
			belleSendGiftMain.lotteryAni = null;
		} else {
			PAGE.changeFocus("hands_x0_y0_lotteryBtnFocus_");
			//初始化抽奖转盘
			belleSendGiftMain.initLottery();
		}		
	} else if (belleSendGiftMain.isRing) {//转盘旋转中
		belleSendGiftMain.showTips();
	} else {
		CT.backPage();
	}
}

var belleSendGiftMain = new belleSendGift();