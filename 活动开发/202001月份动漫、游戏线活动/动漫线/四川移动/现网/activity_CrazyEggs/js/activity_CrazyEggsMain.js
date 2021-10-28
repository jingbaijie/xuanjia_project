//构造函数
function CrazyEggs() {
	this.initFunc(); //页面初始化
	this.meteorAni; //流星转动效果
	this.meteorImg = 0; //流星计数变量
	this.meteorDom = CT.$("meteor").getElementsByTagName("img"); //流星DOM元素
	this.machineNumber = 0; //扭蛋机编号
	this.timeFlag = 0; //时间标记
	this.smallBallDom = CT.$("smallBall").getElementsByTagName("img"); //扭蛋机内小球DOM元素
	this.smallBallImg = 0; //扭蛋机内小球变量
	this.ballIndex; //扭蛋机内小球下标	
	this.bigBallAni; //中间大球晃动效果
	this.bigBallImg = 1; //中间大球变量
	this.stopShake = 0; //球停止晃动的时间标记	
	this.lotteryButton = {}; //抽奖页焦点数组	
	this.smallBallAni; //小球动画定时器
	this.timeFlag1 = 0; //抽奖时间标记
	this.tipImg = 0; //提示弹窗变量
	this.tipShowAni; //弹窗背景闪光定时器
	this.isTip = false; //是否为弹窗提示	
	this.blingImg1; //背景闪光图片
	this.blingImg2; //背景闪光图片
	this.isFirstEnter = true; //是否是第一次展示首页，默认是第一次
	this.isOnFocus; //焦点是否在输入框	
	this.isMainPage = true; //是否在首页
	this.isLotteryPage = false; //是否在抽奖页	
	this.isRulePage = false; //是否在规则页
	this.isNameListPage = false; //是否在中奖名单页
	this.isRinging = false; //是否在执行动画
	this.chanceNum = 0; //已使用游戏机会
	this.jumpData; //用户玩游戏或者看视频数据
	this.maxChance; //用户最大游戏次数默认为3
	this.prizeList = []; //当前活动奖品列表
	this.prizeId = 0; //当前中奖奖品Id
	this.isZhong = false; //当前用户是否中过奖	
	this.isOrder; //用户鉴权结果
	this.isTry; //是否试玩过，1：未试玩；0：试玩过；	
}

var telInput = CT.$("telInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;

//原型对象
CrazyEggs.prototype = {
	constructor: CrazyEggs,
	/*
	 * 页面初始化：
	 * 1、初始化动画效果：四个位置的流星转动效果按顺序走一遍，然后回到第一个；
	 * 2、闪动效果出现的时候，对应的扭蛋机内小球晃动；
	 * 3、抽奖按键焦点元素生成
	 * 4、（获取游戏机会）
	 */
	initFunc: function() {
		var _this = this;
		this.meteorAni = setInterval(function() {
			if(_this.machineNumber == 0) {
				_this.ballIndex = 10;
			} else if(_this.machineNumber == 1) {
				_this.ballIndex = 5;
			} else if(_this.machineNumber == 2) {
				_this.ballIndex = 2;
			} else if(_this.machineNumber == 3) {
				_this.ballIndex = 6;
			}
			if(_this.meteorImg > 3) {
				_this.meteorImg = 0;
				if(_this.machineNumber >= 1) {
					_this.meteorDom[_this.machineNumber - 1].src = "../img/empty.png";
				}
			}
			_this.meteorDom[_this.machineNumber].src = "../img/mainPage/choose/" + _this.meteorImg + ".png";
			_this.meteorImg++;
			_this.timeFlag += 150;
			if(_this.timeFlag % 600 === 0) {
				_this.smallBallImg = 0;
				if(_this.machineNumber == 3) {
					_this.meteorDom[_this.machineNumber].src = "../img/empty.png";
					_this.machineNumber = 0;
				} else {
					_this.machineNumber++;
				}
				if(_this.timeFlag == 3000) {
					clearInterval(_this.meteorAni);
					for(var i = 0; i < _this.meteorDom.length; i++) {
						_this.meteorDom[i].src = "../img/empty.png";
					}
					//首页界面展示---小球打开					
					_this.mainFirstShow();
				}
			}
			//扭蛋机内小球动画
			_this.smallBallFunc();
		}, 150);
		//获取游戏机会
		this.getGameChance();
		//抽奖按键焦点生成
		this.createLotteryBtn();
		//获取用户观看视频或者玩游戏数据
		this.getJumpData();
		//获取鉴权及试玩
		this.initAuth();
		//获取活动奖品列表
		this.getprizeListInfo();
	},
	/*
	 * 鉴权
	 */
	initAuth: function() {
		var _this = this;
		var tryPlay = CT.getCookie("isTry"); //获取试玩数据
		if(tryPlay) {
			this.isTry = 0; //试玩过
		} else {
			this.isTry = 1; //未试玩过
		}		
		//鉴权(data为0,鉴权通过,其余则未通过,需要跳转订购)
		orderJs.columnGetAuth(function(data) {
			if (data === "0") {
				_this.isOrder = 0;					
			}else{
				_this.isOrder = 1;
			}						
		});		
	},
	/*
	 * 1、获取当前活动奖品列表
	 * 2、获取当前活动获奖名单
	 * 3、获取当前用户获奖信息
	 * 4、获取用户手机号
	 */
	getprizeListInfo: function() {
		var _this = this;
		//获取当前活动奖品列表
		actiObj.getActivityPrize(function(res) {
			if(res.resultMsg == "success") {
				_this.prizeList = res.list;
			} else {
				_this.prizeList = [];
			}
		});
	},
	userGetPrize: function() {
		var _this = this;
		actiObj.getUserPrizeInfo(function(res) {
			if(res.resultMsg == "success") {
				_this.isZhong = true;
				CT.$("prizeInfo").innerHTML = res.list.PRIZE_CNAME;
			} else {
				CT.$("prizeInfo").innerHTML = "未中奖";
			}
		});
	},
	getNameList: function() {
		actiObj.getPrizeUserInfo(function(res) {
			var html = "";
			CT.$("nameList").innerHTML = "";
			if(res.resultMsg == "success") {
				for(var i = 0; i < res.list.length; i++) {
					html += "<li><span>" + res.list[i].USERID + "</span><span>" + res.list[i].PRIZE_CNAME + "</span></li>";
					CT.$("nameList").innerHTML = html;
				}
			} else {
				html = "<li><span>189****7710</span><span>神奇扭蛋玩具</span></li>";
				CT.$("nameList").innerHTML += html;
			}
		});
	},
	getUserPhone: function() {
		//获取用户手机号
		actiObj.getUserPhone(function(res) {
			if(res.userPhone != null) {
				CT.$("telInput").innerHTML = res.userPhone;
				phoneNum = res.userPhone;
			}
			if(res.userId != "undefined") {
				CT.$("userInfo").innerHTML = res.userId;
			}
		});
	},
	/*
	 * 获取看视频或玩游戏数据
	 */
	getJumpData: function() {
		var _this = this;
		actiObj.getUserDataList(function(res) {
			if(res.resultMsg == "success") {
				var thisDate = new Date().getMonth() + 1 + "" + new Date().getDate();
				_this.jumpData = res.list[0].user_acti_data;
				if(_this.jumpData == thisDate) {
					_this.maxChance = 4;
				} else {
					_this.maxChance = 3;
				}
			} else {
				_this.maxChance = 3;
			}
		});
	},
	/*
	 * 获取游戏机会
	 */
	getGameChance: function() {
		var _this = this;
		actiObj.getChance(function(res) {
			_this.chanceNum = res.activityChance;
		});
	},
	/*
	 * 扭蛋机内小球动画
	 */
	smallBallFunc: function() {
		if(this.smallBallImg % 2 == 0) {
			this.smallBallDom[this.ballIndex].src = "../img/mainPage/smallEggs/1.png";
		} else {
			this.smallBallDom[this.ballIndex].src = "../img/mainPage/smallEggs/2.png";
		}
		this.smallBallImg++;
	},
	/*
	 * 首页大球下落打开
	 */
	bigBallShow: function(prizeRandom) {
		var _this = this;		
		//小球下落
		actiObj.addClass(CT.$("bigBall1"), "dropAni");
		//小球打开
		this.bigBallAni = setInterval(function() {
			if(_this.bigBallImg > 2) {
				_this.bigBallImg = 1;
			}
			CT.$("bigBall1").src = "../img/mainPage/bigEggs/" + _this.bigBallImg + ".png";
			_this.bigBallImg++;
			_this.stopShake += 150;
			if(_this.stopShake === 900) {
				clearInterval(_this.bigBallAni);
				_this.stopShake = 0;
				CT.$("bigBall1").src = "../img/mainPage/bigEggs/4.png";
				CT.$("bigBall2").style.visibility = "visible";
				actiObj.addClass(CT.$("bigBall2"), "redBallAni");
				setTimeout(function() {
					_this.emptybigBallShow();
					//首页界面展示---标题、灯光、奖品出现动画
					if(_this.isTip == false) {
						_this.mainSecondShow();
						//如果是提示弹窗中的大球，打开之后弹出对应的弹窗提示
					} else if(_this.isTip == true) {
						_this.tipShow(prizeRandom);
					}
				}, 800);
			}
		}, 150);				
	},
	/*
	 * 首页界面展示：
	 * 1、首页界面动画执行顺序：(1)大球下落、打开》》》(2)标题、灯光、奖品出现》》》(3)左侧按钮出现》》》(4)右侧卡通、看视频按钮、开始按钮出现
	 * 2、初始化焦点，默认光标落点；
	 */
	mainFirstShow: function() {
		CT.$("mainShow").style.visibility = "visible";
		this.isMainPage = true;
		this.isRinging = true; //动画执行中		
		//首页界面展示---大球下落打开
		this.bigBallShow();
	},
	mainSecondShow: function() {
		//标题、灯光、奖品出现动画
		CT.$("title_lamp_prize").style.visibility = "visible";
		actiObj.addClass(CT.$("prize"), "prizeAni");
		//首页界面展示---左侧按钮出现
		this.mainThirdShow();

	},
	mainThirdShow: function() {
		var _this = this;
		CT.$("left_btn").style.visibility = "visible";		
		//左侧按钮出现
		setTimeout(function() {
			actiObj.addClass(CT.$("ruleBtn"), "ruleAni");
			actiObj.addClass(CT.$("nameListBtn"), "nameListAni");
			//首页界面展示---右侧卡通、看视频按钮、开始按钮出现
			_this.mainForthShow();
		}, 500);		
	},
	mainForthShow: function() {
		var _this = this;
		CT.$("right_element").style.visibility = "visible";
		//右侧卡通、看视频按钮、开始按钮出现
		setTimeout(function() {
			actiObj.addClass(CT.$("rightCartoon"), "rightCartoonAni");
			actiObj.addClass(CT.$("seeVideo"), "seeVideoAni");			
			actiObj.addClass(CT.$("startBTn"), "startBTnAni");
			//开始按钮焦点动画
			actiObj.addClass(CT.$("hands_x0_y0_startBTnFocus_"), "startBTnAni");			
			if(_this.isFirstEnter == true) {
				//创建buttons数组 、焦点初始化
				_this.focusInitFunc();
			} else {
				actiObj.changeFocus("hands_x0_y0_startBTnFocus_");
			}
			_this.isRinging = false; //执行动画结束
		}, 500);
	},
	focusInitFunc: function() {
		//创建抽奖页button
		for(var i = 0; i < 12; i++) {
			this.lotteryButton = {
				id: "hands_x0_y0_lotteryFocus" + i + "_",
				clickHandler: "javascript:CrazyEggsGame.startLottery(" + i + ")",
				otherFocusEvent: "javascript:CrazyEggsGame.lotteryBtnFocus(" + i + ")",
				otherBlurEvent: "javascript:CrazyEggsGame.lotteryBtnblur(" + i + ")",
				left: "hands_x0_y0_lotteryFocus" + (i - 1) + "_",
				right: "hands_x0_y0_lotteryFocus" + (i + 1) + "_",
				up: "hands_x0_y0_lotteryFocus" + (i - 6) + "_",
				down: "hands_x0_y0_lotteryFocus" + (i + 6) + "_",
				focusType: 7
			}
			if(i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5) {
				this.lotteryButton.up = "disable";
				if(i == 0) {
					this.lotteryButton.left = "disable";
				}
			} else if(i == 6 || i == 7 || i == 8 || i == 9 || i == 10 || i == 11) {
				this.lotteryButton.down = "disable";
				if(i == 11) {
					this.lotteryButton.right = "disable";
				}
			}
			buttons.push(this.lotteryButton);
		}
		//焦点初始化
		focusInit();
		curFocus = getFocusModel6("hands_x0_y0_startBTnFocus_");
		curFocus.defaultFocus();
	},
	/*
	 * 首页按钮点击:
	 * 1、清除首页界面动画
	 * 2、进入活动规则页》》》中奖名单页》》》观看视频》》》开始抽奖页
	 */
	btnJump: function(ii) {
		//不是第一次打开首页界面了
		this.isFirstEnter = false;
		this.clearMainAni();
		switch(ii) {
			case 0:
				CT.$("rulePage").style.visibility = "visible";
				actiObj.changeFocus("hands_x0_y0_ruleCloseFocus_");
				this.isMainPage = false;
				this.isRulePage = true;
				break;
			case 1:
				//获取当前用户获奖信息
				this.userGetPrize();
				//获取用户手机号
				this.getUserPhone();
				//获取当前活动获奖名单
				this.getNameList();
				CT.$("nameListPage").style.visibility = "visible";
				actiObj.changeFocus("hands_x0_y0_inputFocus_");
				this.isMainPage = false;
				this.isNameListPage = true;
				break;
			case 2:
				if(this.isOrder == 0) {
					this.seeVideo();
				} else {					
					//跳订购
					this.toOrder();
				}
				break;
			case 3:
				if(this.isOrder == 0 || this.isTry == 1) {
					actiObj.changeFocus("hands_x0_y0_lotteryFocus0_");
					this.isMainPage = false;
					this.isLotteryPage = true;
					if(this.isTry == 1) {
						CT.setCookie("isTry", "play");
					}
				} else if(this.isTry == 0) {					
					//跳订购
					this.toOrder();
				}
				break;
			default:
				break;
		}
	},
	toOrder: function() {
		CT.setCookie("columnBackUrl", window.location.href);
		//跳订购
		orderJs.columnToOrderPage("activity_CrazyEggs");
	},
	/*
	 * 抽奖按键焦点生成
	 */
	createLotteryBtn: function() {
		var LotteryFocusUpHtml = "";
		var LotteryFocusDownHtml = "";
		for(var j = 0; j < 6; j++) {
			LotteryFocusUpHtml += '<div id="hands_x0_y0_lotteryFocus' + j + '_" style="position:absolute;top:0px;left:' + (j * 198) + 'px;">';
			LotteryFocusUpHtml += '<img src="../img/mainPage/choose/chooseFocus1.png" id="lotteryFocus' + j + '" style="visibility: hidden;width:76px;height:76px;"/></div>';
		}
		CT.$("pressKeyUp").innerHTML += LotteryFocusUpHtml;
		for(var k = 6; k < 12; k++) {
			LotteryFocusDownHtml += '<div id="hands_x0_y0_lotteryFocus' + k + '_" style="position:absolute;top:0px;left:' + (k - 6) * 198 + 'px;">';
			LotteryFocusDownHtml += '<img src="../img/mainPage/choose/chooseFocus1.png" id="lotteryFocus' + k + '" style="visibility: hidden;width:76px;height:76px;"/></div>';
		}
		CT.$("pressKeyDown").innerHTML += LotteryFocusDownHtml;
	},
	/*
	 * 点击按钮抽奖:
	 * 1、按钮旋转
	 * 2、扭蛋机中的小球晃动
	 * 3、弹窗展示：弹窗展示动画》》》（1）随机产生奖品（2）三次机会用完：提示看视频增加抽奖机会（3）机会用完
	 */
	startLottery: function(kk) {
		var _this = this;
		if(this.chanceNum < 3 || (this.chanceNum == 3 && this.maxChance == 4)) {
			if(this.isZhong == true || this.isTry == 1) {
				var prizeRandom = 0;
			} else {
				//var prizeRandom = Math.floor(Math.random() * 4); //[0,3]随机数
				var prizeRandom = 0;
			}
		}
		this.isRinging = true; //动画执行中
		this.ballIndex = kk;
		//抽奖时，焦点移到空焦点》》》空焦点的图片及位置与按钮焦点一致
		actiObj.changeFocus("hands_x0_y0_blankFocus_");
		CT.$("blankFocus").src = "../img/mainPage/choose/chooseFocus2.png";
		CT.$("hands_x0_y0_blankFocus_").style.left = parseInt(CT.$("hands_x0_y0_lotteryFocus" + kk + "_").style.left) + 68 + "px";
		if(kk < 6) {
			CT.$("hands_x0_y0_blankFocus_").style.top = parseInt(CT.$("hands_x0_y0_lotteryFocus" + kk + "_").style.top) + 277 + "px";
		} else {
			CT.$("hands_x0_y0_blankFocus_").style.top = parseInt(CT.$("hands_x0_y0_lotteryFocus" + kk + "_").style.top) + 566 + "px";
		}
		//扭蛋机内小球动画
		this.smallBallAni = setInterval(function() {
			if(_this.timeFlag1 == 21) {
				clearInterval(_this.smallBallAni);
				_this.smallBallImg = 0;
				_this.timeFlag1 = 0;
				_this.isTip = true;
				CT.$("tipTanchuang").style.visibility = "visible";
				//弹窗展示---大球动画
				if(_this.chanceNum < 3 || (_this.chanceNum == 3 && _this.maxChance == 4)) {
					_this.bigBallShow(prizeRandom);
				} else {
					_this.bigBallShow();
				}
			}
			_this.smallBallFunc();
			_this.timeFlag1++;
		}, 80);
	},
	/*
	 * 调用大球动画之前先还原成原始数据
	 */
	emptybigBallShow: function() {
		actiObj.removeClass(CT.$("bigBall1"), "dropAni");
		this.bigBallImg = 1;
		this.stopShake = 0;
		CT.$("bigBall1").src = "../img/mainPage/bigEggs/0.png";
		CT.$("bigBall2").style.visibility = "hidden";
		actiObj.removeClass(CT.$("bigBall2"), "redBallAni");
	},
	/*
	 * 抽奖按键失去焦点
	 */
	lotteryBtnblur: function(jj) {
		CT.$("lotteryFocus" + jj + "").src = "../img/mainPage/choose/rotate1.png";
	},
	/*
	 * 抽奖按键聚焦
	 */
	lotteryBtnFocus: function(jj) {
		CT.$("lotteryFocus" + jj + "").src = "../img/mainPage/choose/chooseFocus1.png";
	},
	/*
	 * 弹窗展示：弹窗展示动画:标题、卡通等动画》》》背景闪光
	 * 1、中奖情况：一等奖、二等奖、三等奖、没有中奖；2、没有抽奖机会、提醒看视频；3、机会用完；
	 */
	tipShow: function(prizeRandom) {
		var _this = this;
		this.isLotteryPage = false;
		if(this.chanceNum == 3 && this.maxChance == 3) {
			this.seeVideoTip();
		} else if(this.chanceNum >= 4 && this.maxChance == 4) {
			this.noChanceTip();
		} else {
			if(prizeRandom == 1) {
				this.prizeId = this.prizeList[0].prize_id;
			} else if(prizeRandom == 2) {
				this.prizeId = this.prizeList[1].prize_id;
			} else if(prizeRandom == 3) {
				this.prizeId = this.prizeList[2].prize_id;
			}
			if(this.prizeId != 0) {
				//存储当前用户获奖信息
				this.isZhong = true;
				actiObj.setPrize(this.prizeId);
			}
			CT.$("getPrize").src = "../img/tip/zjCondition/prize" + prizeRandom + ".png";
			if(prizeRandom == 0) {
				CT.$("tipTitle").src = "../img/tip/zjCondition/noChouZ.png";
				CT.$("tipText").src = "../img/tip/zjCondition/fight.png";
				CT.$("decoration").style.visibility = "hidden";
				this.blingImg1 = "../img/tip/zjCondition/whiteLight1.png";
				this.blingImg2 = "../img/tip/zjCondition/whiteLight2.png";
				CT.$("tipText").style.left = "520px";
			} else if(prizeRandom == 1 || prizeRandom == 2 || prizeRandom == 3) {
				CT.$("tipTitle").src = "../img/tip/zjCondition/congratulation.png";
				CT.$("tipText").src = "../img/tip/zjCondition/leaveContactTip.png";
				CT.$("decoration").style.visibility = "visible";
				this.blingImg1 = "../img/tip/zjCondition/zjLight1.png";
				this.blingImg2 = "../img/tip/zjCondition/zjLight2.png";
				CT.$("tipText").style.left = "460px";
			}
		}
		//标题、卡通等动画
		actiObj.addClass(CT.$("tipTitle"), "tipAni");
		actiObj.addClass(CT.$("getPrize"), "tipAni");
		actiObj.addClass(CT.$("decoration"), "tipAni");
		actiObj.addClass(CT.$("tipText"), "tipAni");
		//背景闪光
		this.tipShowAni = setInterval(function() {
			if(_this.tipImg % 2 == 0) {
				CT.$("blingbling").src = _this.blingImg1;
			} else {
				CT.$("blingbling").src = _this.blingImg2;
			}
			_this.tipImg++;
		}, 200);
		CT.$("blankFocus").src = "../img/empty.png";

		if(this.chanceNum < 3 || (this.chanceNum == 3 && this.maxChance == 4)) {
			if(this.isTry == 0) {
				//提示弹窗出现时存储游戏机会
				this.chanceNum++;
				actiObj.setChance();
			} else {
				this.isTry = 0;
			}
			CT.$("confirmBtn").style.visibility = "visible";
			actiObj.changeFocus("hands_x0_y0_confirmBtnFocus_");
		}
		this.isRinging = false; //动画执行结束
	},
	confirmBtn: function() {
		if(this.chanceNum == 3 && this.maxChance == 3) {
			this.seeVideoTip();
		} else {
			this.fromTipToMain();
		}
	},
	seeVideoTip: function() {
		CT.$("confirmBtn").style.visibility = "hidden";
		CT.$("getPrize").src = "../img/tip/zjCondition/noChouJCartoon.png";
		CT.$("tipTitle").src = "../img/tip/zjCondition/noChouJ.png";
		CT.$("decoration").style.visibility = "hidden";
		this.blingImg1 = "../img/tip/zjCondition/whiteLight1.png";
		this.blingImg2 = "../img/tip/zjCondition/whiteLight2.png";
		CT.$("seeVideoTipBtn").style.visibility = "visible";
		CT.$("continueBtn").style.visibility = "visible";
		actiObj.changeFocus("hands_x0_y0_seeVideoTipBtnFocus_");
	},
	noChanceTip: function() {
		CT.$("confirmBtn").style.visibility = "visible";
		CT.$("getPrize").src = "../img/tip/zjCondition/noChanceCartoon.png";
		CT.$("tipTitle").src = "../img/tip/zjCondition/noChance.png";
		CT.$("decoration").style.visibility = "hidden";
		this.blingImg1 = "../img/tip/zjCondition/whiteLight1.png";
		this.blingImg2 = "../img/tip/zjCondition/whiteLight2.png";
		CT.$("seeVideoTipBtn").style.visibility = "hidden";
		CT.$("continueBtn").style.visibility = "hidden";
		CT.$("tipText").src = "../img/tip/zjCondition/tomorrowContinue.png";
		CT.$("tipText").style.left = "520px";
		actiObj.changeFocus("hands_x0_y0_confirmBtnFocus_");
	},
	clearTipAni: function() {
		CT.$("tipTanchuang").style.visibility = "hidden";
		if(this.chanceNum == 3) {
			CT.$("seeVideoTipBtn").style.visibility = "hidden";
			CT.$("continueBtn").style.visibility = "hidden";
		} else {
			CT.$("confirmBtn").style.visibility = "hidden";
		}
		CT.$("blingbling").src = "../img/empty.png";
		actiObj.removeClass(CT.$("tipTitle"), "tipAni");
		actiObj.removeClass(CT.$("getPrize"), "tipAni");
		actiObj.removeClass(CT.$("decoration"), "tipAni");
		actiObj.removeClass(CT.$("tipText"), "tipAni");
		clearInterval(this.tipShowAni);
	},
	clearMainAni: function() {
		CT.$("mainShow").style.visibility = "hidden";
		CT.$("title_lamp_prize").style.visibility = "hidden";
		CT.$("left_btn").style.visibility = "hidden";
		CT.$("right_element").style.visibility = "hidden";
		actiObj.removeClass(CT.$("prize"), "prizeAni");
		actiObj.removeClass(CT.$("ruleBtn"), "ruleAni");
		actiObj.removeClass(CT.$("nameListBtn"), "nameListAni");
		actiObj.removeClass(CT.$("rightCartoon"), "rightCartoonAni");
		actiObj.removeClass(CT.$("seeVideo"), "seeVideoAni");
		actiObj.removeClass(CT.$("startBTn"), "startBTnAni");
		//开始按钮焦点动画
		actiObj.removeClass(CT.$("hands_x0_y0_startBTnFocus_"), "startBTnAni");
	},
	ruleCloseFunc: function() {		
		this.fromTipToMain();	
		CT.$("rulePage").style.visibility = "hidden";
		actiObj.changeFocus("hands_x0_y0_blankFocus_");		
	},
	/*
	 * 中奖名单页面：
	 * 1、手机号输入
	 * 2、（保存手机号）手机号保存：提示输入11位数字》》》提示手机号保存成功》》》光标离开保存按钮提示信息隐藏
	 * 3、清除手机号
	 * 4、中奖名单、用户信息、当前用户中奖情况页面渲染
	 */
	nameListClose: function() {	
		this.fromTipToMain();		
		CT.$("nameListPage").style.visibility = "hidden";
		actiObj.changeFocus("hands_x0_y0_blankFocus_");		
	},
	/*
	 * 焦点获焦在输入框中执行的方法
	 */
	onFocus: function(index) {
		this.isOnFocus = index == 1 ? true : false;
		if(this.isOnFocus) {
			changeNum();
		}
	},
	saveFunc: function() {
		phoneNum = CT.$("telInput").innerHTML;
		if(phoneNum.length != 11) {
			CT.$("telInput").innerHTML = "请输入11位手机号码";
		} else {
			actiObj.setUserPhone(phoneNum, function(res) {
				phoneNum = res.userphone;
			});
			CT.$("savetips").innerHTML = "手机号保存成功";
		}
	},
	emptyFunc: function() {
		CT.$("telInput").innerHTML = "";
		phoneNum = "";
	},
	saveBlur: function() {
		CT.$("savetips").innerHTML = "";
	},
	seeVideo: function() {
		if(this.chanceNum <= 3 && this.maxChance == 3) {
			if(this.isMainPage == false) {
				CT.$("confirmBtn").style.visibility = "visible";
				CT.$("getPrize").src = "../img/tip/zjCondition/seeVideoCartooon.png";
				CT.$("tipTitle").src = "../img/tip/zjCondition/gameRemember.png";
				CT.$("decoration").style.visibility = "hidden";
				this.blingImg1 = "../img/tip/zjCondition/whiteLight1.png";
				this.blingImg2 = "../img/tip/zjCondition/whiteLight2.png";
				CT.$("seeVideoTipBtn").style.visibility = "hidden";
				CT.$("continueBtn").style.visibility = "hidden";
				CT.$("hands_x0_y0_rememberFocus_").style.top = "547px";
			} else {
				this.isTip = true;
				this.isMainPage = false;
				CT.$("mainRemember").style.visibility = "visible";
				CT.$("hands_x0_y0_rememberFocus_").style.top = "535px";
			}
			actiObj.changeFocus("hands_x0_y0_rememberFocus_");
		} else {
			CT.setCookie("columnBackUrl", window.location.href);
			actiObj.changeFocus("hands_x0_y0_blankFocus_");
			getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=1324", "hands_x0_y0_seeVideoTipBtnFocus_");
			
		}
	},
	jumpVideo: function() {
		var thisDate = new Date().getMonth() + 1 + "" + new Date().getDate();
		actiObj.setUserDataList(thisDate);
		CT.setCookie("columnBackUrl", window.location.href);
		setTimeout(function() {
			getAnterUrl("cartoonDetail_2018v1", "?action=cartoonDetail_2018v1&cartoonId=1324", "hands_x0_y0_seeVideoBtnFocus_");
		}, 800);
	},
	continueFunc: function() {
		this.fromTipToMain();
	},
	fromTipToMain: function() {
		this.isTip = false;
		this.isNameListPage = false;
		this.isRulePage = false;
		this.isMainPage = true;
		CT.$("mainRemember").style.visibility = "hidden";
		CT.$("confirmBtn").style.visibility = "hidden";
		actiObj.changeFocus("hands_x0_y0_blankFocus_");
		this.clearTipAni();
		//如果是第一次进入首页执行大球动画，如果不是第一次进首页不执行大球的动画
		if(this.isFirstEnter == true) {
			this.mainFirstShow();
		} else {
			CT.$("mainShow").style.visibility = "visible";
			this.isMainPage = true;
			this.isRinging = true; //动画执行中
			this.mainSecondShow();
		}
	}
}

/*
 * 返回键：
 * 1、当前为启动页或首页：返回平台首页
 * 2、当前为抽奖页、提示页：返回首页
 * 3、当前为规则、中奖名单页：返回首页
 */
function backfunc() {
	if(CrazyEggsGame.isMainPage == true && CrazyEggsGame.isRinging == false) {
		CrazyEggsGame.isMainPage = false;
		CT.delCookie("fromJPZQ"),
		CT.delCookie("jpzqIndex"),
		CT.delCookie("jpzqFocus"),
		BackPortalMainPage();
	} else {
		if(CrazyEggsGame.isLotteryPage == true && CrazyEggsGame.isRinging == false) {
			CrazyEggsGame.isLotteryPage = false;
			actiObj.changeFocus("hands_x0_y0_blankFocus_");
			CrazyEggsGame.fromTipToMain();
		}
		if(CrazyEggsGame.isTip == true && CrazyEggsGame.isRinging == false) {
			CrazyEggsGame.fromTipToMain();
		}
		if(CrazyEggsGame.isRulePage == true) {
			CrazyEggsGame.ruleCloseFunc();
		}
		if(CrazyEggsGame.isNameListPage == true) {
			CrazyEggsGame.nameListClose();
		}
	}
}

//监听用户遥控器输入的数字
function changeNum(num) {
	if(num != undefined) {
		var size;
		if(phoneNum == "") {
			size = 0;
		} else {
			size = phoneNum.length;
		}
		if(size < 11 || !size) {
			var addnum = phoneNum;
			phoneNum = addnum + num;
		}
		CT.$("telInput").innerHTML = phoneNum;
	}
}

//实例
var CrazyEggsGame = new CrazyEggs();