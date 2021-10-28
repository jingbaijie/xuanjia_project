/*
 * 进入页面获取游戏机会、获取游戏积分
 * 判断是否为试玩》》》是试玩：弹出试玩结束去订购弹窗；不是试玩：弹窗出现，上传游戏机会、上传当前总积分
 */
// 构造函数
function GuessGame() {
	this.button = {}; //焦点对象
	this.addNumber = 0; //每个恐龙对应的数字
	this.currentNumber = 0; //当前总数
	this.totalScore = 0; //积分
	this.addHeight = 0; //水位增加高度       
	this.timer = null; //计时器
	this.timeCount = 30;
	this.randomNumber = 0; //随机数
	this.dialogueNumber = 0; //对话框数字
	this.mark = [2, 4, 6, 8, 10, 12, 14]; //刻度  
	this.creatButtons(); //创建焦点数组
	this.chanceNum = 0; //已使用游戏次数
	this.dinosaurId = 0; //当前恐龙下标
	this.initFunc(); //页面初始化  	
	this.isTry = location.href.indexOf("isTry"); //判断是否为试玩
}

// 原型
GuessGame.prototype = {
	constructor: GuessGame,
	initFunc: function() {
		var _this = this;
		//对话框
		CT.$("dialogue").style.visibility = "visible";
		this.dialogueFunc();
		//获取游戏机会、游戏积分
		this.getChanceScore();
		//计时器
		this.timer = setInterval(function() {
			if(_this.timeCount <= 0) {
				//倒计时结束关闭定时器
				_this.timeCount = 0;
				clearInterval(_this.timer);
				_this.timer = null;
				//计时结束操作
				_this.timeOut();
			} else {
				_this.timeCount--;
			}
			CT.$("timeCount").innerHTML = _this.timeCount;
			//刻度与对话框数字对比
			if(_this.dialogueNumber == _this.currentNumber) {
				_this.currentNumber = 0;
				//积分累计1分
				_this.totalScore += 1;
				CT.$("totalScore").innerHTML = _this.totalScore;
				setTimeout(function() {
					// 对话框重置
					_this.dialogueFunc();
					//水位重置
					CT.$("waterHeight").style.bottom = "-280px";
					actiObj.addClass(CT.$("waterHeight"), "waterAni");
				}, 1800);
			}
		}, 1000);
	},
	//获取游戏机会、游戏积分
	getChanceScore: function() {
		var _this = this;
		actiObj.getChance(function(res) {
			_this.chanceNum = res.activityChance;
		});
		actiObj.getUserCredit(function(res) {
			if(res && res.resultMsg == "success") {
				_this.totalScore = parseInt(res.creditNum, 10);
			} else {
				_this.totalScore = 0;
			}
			CT.$("totalScore").innerHTML = _this.totalScore;
		});
	},
	//上传游戏机会、游戏积分
	setChanceScore: function() {
		var _this = this;
		actiObj.setChance(function(res) {
			if(res) {
				actiObj.setUserCredit(_this.totalScore);
			}
		});
	},
	//三十秒计时结束操作
	timeOut: function() {
		CT.$("tanChuangBG").style.visibility = "visible";
		//弹窗显示
		if(this.isTry > -1) {
			//弹出试玩结束去订购弹窗
			CT.$("tanchuangTip").src = "img/toOrderTip.png";
			actiObj.changeFocus("hands_x0_y0_toOrderBtnFocus_");
		} else {
			this.chanceNum++;
			CT.$("totalScoreTip").innerHTML = this.totalScore;
			//存储游戏机会、游戏积分		
			this.setChanceScore();
			if(this.chanceNum < 3) {
				CT.$("tanchuangTip").src = "img/continueTip.png";
				actiObj.changeFocus("hands_x0_y0_continueBtnFocus_");
			} else if(this.chanceNum >= 3) {
				CT.$("tanchuangTip").src = "img/toGameTip.png";
				actiObj.changeFocus("hands_x0_y0_playGameBtnFocus_");
				CT.$("totalScoreTip").style.left = "685px";
				CT.$("totalScoreTip").style.top = "435px";
			}
		}
	},
	// 创建焦点数组
	creatButtons: function() {
		for(var i = 0; i < 5; i++) {
			this.button = {
				id: "hands_x0_y0_leftFocus" + i + "_",
				clickHandler: "javascript:GuessGameSp.jumpWater(" + i + ")",
				otherFocusEvent: "javascript:GuessGameSp.otherFocusFunc(" + i + ")",
				left: "disable",
				right: "disable",
				leftEvent: "javascript:GuessGameSp.leftFunc(" + i + ")",
				rightEvent: "javascript:GuessGameSp.rightFunc(" + i + ")",
				up: "disable",
				down: "disable",
				downEvent: "javascript:GuessGameSp.downFunc(" + i + ")",
				focusType: 7
			}
			if(i == 0) {
				this.button.leftEvent = "";
			} else if(i == 4) {
				this.button.rightEvent = "";
			}
			buttons.push(this.button);
		}
		buttons.push({
			id: "hands_x0_y0_backFocus_",
			clickHandler: "javascript:backfunc()",
			left: "hands_x0_y0_leftFocus4_",
			right: "disable",
			up: "hands_x0_y0_leftFocus4_",
			down: "disable",
			focusType: 7
		}, {
			id: "hands_x0_y0_blankFocus_",
			left: "disable",
			right: "disable",
			up: "disable",
			down: "disable",
			focusType: 7
		}, {
			id: "hands_x0_y0_continueBtnFocus_",
			clickHandler: "javascript:GuessGameSp.tipBtnClick(0)",
			left: "disable",
			right: "disable",
			up: "disable",
			down: "disable",
			focusType: 7
		}, {
			id: "hands_x0_y0_toOrderBtnFocus_",
			clickHandler: "javascript:GuessGameSp.tipBtnClick(1)",
			left: "disable",
			right: "disable",
			up: "disable",
			down: "disable",
			focusType: 7
		}, {
			id: "hands_x0_y0_playGameBtnFocus_",
			clickHandler: "javascript:GuessGameSp.tipBtnClick(2)",
			left: "disable",
			right: "disable",
			up: "disable",
			down: "disable",
			focusType: 7
		});
		// 初始化焦点数组
		focusInit();
		curFocus = getFocusModel6("hands_x0_y0_leftFocus4_");
		curFocus.defaultFocus();
	},
	leftFunc: function(kk) {
		CT.$("leftDinosaur").getElementsByTagName("img")[kk].style.visibility = "visible";
		actiObj.changeFocus("hands_x0_y0_leftFocus" + (kk - 1) + "_");
	},
	rightFunc: function(ii) {
		CT.$("leftDinosaur").getElementsByTagName("img")[ii].style.visibility = "visible";
		actiObj.changeFocus("hands_x0_y0_leftFocus" + (ii + 1) + "_");
	},
	otherFocusFunc: function(mm) {
		var leftDinosaurImgs = CT.$("leftDinosaur").getElementsByTagName("img");
		for(var i = 0; i < leftDinosaurImgs.length; i++) {
			leftDinosaurImgs[i].style.visibility = "visible";
		}
		leftDinosaurImgs[mm].style.visibility = "hidden";
	},
	downFunc: function(nn) {
		CT.$("leftDinosaur").getElementsByTagName("img")[nn].style.visibility = "visible";
		actiObj.changeFocus("hands_x0_y0_backFocus_");
	},
	jumpWater: function(jj) {
		var _this = this;
		var objDom = CT.$("leftDinosaur").getElementsByTagName("img")[jj];
		//当前恐龙下标
		this.dinosaurId = jj;
		actiObj.removeClass(CT.$("dialogue"), "dialogueAni");
		actiObj.changeFocus("hands_x0_y0_blankFocus_");
		objDom.style.visibility = "visible";
		// 恐龙动画
		if(jj == 3 || jj == 4) {
			actiObj.addClass(objDom, "jumpSmallAni");
			this.addNumber = 1;
			this.addHeight = 20;
		} else if(jj == 1 || jj == 2) {
			actiObj.addClass(objDom, "jumpMiddleAni");
			this.addNumber = 3;
			this.addHeight = 60;
		} else if(jj == 0) {
			actiObj.addClass(objDom, "jumpBigAni");
			this.addNumber = 6;
			this.addHeight = 120;
		}

		setTimeout(function() {
			// 水位变化
			actiObj.addClass(CT.$("waterHeight"), "waterAni");
			if((parseInt(CT.$("waterHeight").style.bottom) + _this.addHeight) >= 0) {
				CT.$("waterHeight").style.bottom = "0px";
			} else {
				CT.$("waterHeight").style.bottom = (parseInt(CT.$("waterHeight").style.bottom) + _this.addHeight) + "px";
			}
			//数字计算
			_this.currentNumber += _this.addNumber;
		}, 800);
		// 恐龙复位
		setTimeout(function() {
			_this.removeDinosaur();
			if(_this.timeCount == 0) {
				return;
			} else {
				actiObj.changeFocus("hands_x0_y0_leftFocus" + jj + "_");
			}
		}, 2000);
	},
	removeDinosaur: function() {
		var objDom = CT.$("leftDinosaur").getElementsByTagName("img")[this.dinosaurId];
		actiObj.removeClass(CT.$("waterHeight"), "waterAni");
		actiObj.removeClass(objDom, "jumpSmallAni");
		actiObj.removeClass(objDom, "jumpMiddleAni");
		actiObj.removeClass(objDom, "jumpBigAni");
	},
	dialogueFunc: function() {
		//动画效果        
		actiObj.addClass(CT.$("dialogue"), "dialogueAni");
		//显示数字
		this.randomNumber = Math.floor(Math.random() * 7); //[0,6]随机数
		this.dialogueNumber = this.mark[this.randomNumber];
		CT.$("dialogueNumber").innerHTML = this.dialogueNumber;
	},
	//弹窗按钮点击
	tipBtnClick: function(gg) {
		var leftDinosaurImgs = CT.$("leftDinosaur").getElementsByTagName("img");
		//关闭弹窗        
		CT.$("tanChuangBG").style.visibility = "hidden";
		CT.$("tanchuangTip").src = "img/empty.png";
		//水位重置、恐龙重置
		CT.$("waterHeight").style.bottom = "-280px";
		this.removeDinosaur();
		if(gg == 0) {
			//继续按钮
			actiObj.changeFocus("hands_x0_y0_leftFocus4_");
			this.initFunc();
			//计时重置
			this.timeCount = 30;
			CT.$("timeCount").innerHTML = this.timeCount;
			//当前刻度重置
			this.currentNumber = 0;
		} else if(gg == 1) {
			//试玩结束去订购
			orderJs.columnToOrderPage("activity_guessNumberGame");
		} else if(gg == 2) {
			//三次机会结束按钮
			actiObj.toJumpUrl("activity_guessNumberMain.html");
		}
	}
}

function backfunc() {
	actiObj.toJumpUrl("activity_guessNumberMain.html");
}

// 实例
var GuessGameSp = new GuessGame();