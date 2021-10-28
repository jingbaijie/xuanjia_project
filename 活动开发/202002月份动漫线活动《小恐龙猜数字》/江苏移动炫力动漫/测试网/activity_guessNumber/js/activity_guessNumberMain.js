/*
 * 进入页面判断是否订购》》》若订购：获取游戏机会;若没有订购:获取试玩机会
 * 点击开始按钮判断是否订购》》》若订购：进入游戏；若未订购试玩过：弹出订购弹窗；若未订购未试玩：存试玩数据进入游戏
 * 点击排行榜按钮获取：用户积分、当前排名、排行榜、用户手机号
 * 点击保存储存手机号
 */
//构造函数
function GuessMain() {
	this.bgAni = null; //页面背景切换定时器
	this.bgImg = 1; //背景图片计数
	this.startImg = 1; //开始按钮图片计数
	this.rulePage = false; //规则页默认不显示
	this.rankPage = false; //排行页默认不显示
	this.chanceNum = 0; //游戏机会
	this.noChanceTip = false; //没有机会弹窗
	this.toOrderTip = false; //试玩结束去订购弹窗
	this.tryPlay = 0; //默认未试玩
	this.isOrder = 1; //用户鉴权结果，默认未鉴权
	this.initFunc(); //页面初始化
	this.currentScore = 0; //当前积分
	this.currentRank = 0; //当前排名
	this.isOnFocus; //焦点是否在输入框
}

var telInput = CT.$("phoneInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;

//原型对象
GuessMain.prototype = {
	constructor: GuessMain,
	initFunc: function() {
		var _this = this;
		//鉴权
		this.getAuth();
		this.bgAni = setInterval(function() {
			// 背景图片切换
			if(_this.bgImg > 4) {
				_this.bgImg = 1;
			}
			CT.$("mainBG").src = "img/main/bg" + _this.bgImg + ".jpg";
			_this.bgImg++;
			// 开始按钮动画           
			if(_this.startImg % 2 == 0) {
				CT.$("startBtn").src = "img/main/start2.png";
			} else {
				CT.$("startBtn").src = "img/main/start1.png";
			}
			_this.startImg++;
		}, 200);

	},
	//鉴权
	getAuth: function() {
		var _this = this;
		var currentDate = new Date().getMonth() + 1 + "" + new Date().getDate();
		//鉴权(data为0,鉴权通过,其余则未通过,需要跳转订购)
		orderJs.columnGetAuth(function(data) {
			_this.isOrder = data + "";
			// 初始化焦点数组
			focusInit();
			curFocus = getFocusModel6("hands_x0_y0_startBtnFocus_");
			curFocus.defaultFocus();
			if(_this.isOrder == 0) {
				//获取游戏机会
				_this.getChanceFunc();
			} else {
				//获取试玩机会
				actiObj.getUserDataList(function(res) {
					if(res.resultMsg == "success") {
						if(currentDate == res.list[0].user_acti_data) {
							_this.tryPlay = 1;
						} else {
							_this.tryPlay = 0;
						}
					} else {
						_this.tryPlay = 0;
					}
				});
			}
		});
	},
	//获取游戏机会
	getChanceFunc: function() {
		var _this = this;
		actiObj.getChance(function(res) {
			_this.chanceNum = res.activityChance;
		});
	},
	btnJump: function(ii) {
		if(ii == 0) {
			if(this.isOrder == 0) {
				if(this.chanceNum < 3) {
					actiObj.toJumpUrl("activity_guessNumberGame.html");
				} else {
					//没有机会弹窗
					CT.$("tanChuangBG").style.visibility = "visible";
					CT.$("tanchuangTip").src = "img/noChanceTip.png";
					actiObj.changeFocus("hands_x0_y0_playGameBtnFocus_");
					this.noChanceTip = true;
				}
			} else {
				if(this.tryPlay == 0) {
					//存储试玩数据
					var currentDate = new Date().getMonth() + 1 + "" + new Date().getDate();
					actiObj.setUserDataList(currentDate, function(res) {
						if(res && res.resultMsg == "success") {
							actiObj.toJumpUrl("activity_guessNumberGame.html", {
								"isTry": "1"
							});
						} else {
							console.log("上传试玩数据失败");
						}
					});
				} else if(this.tryPlay == 1) {
					//弹出试玩结束去订购弹窗
					CT.$("tanChuangBG").style.visibility = "visible";
					CT.$("tanchuangTip").src = "img/toOrderTip.png";
					actiObj.changeFocus("hands_x0_y0_toOrderBtnFocus_");
					this.toOrderTip = true;
				}
			}
		} else if(ii == 1) {
			this.rulePage = true;
			CT.$("rulePageBG").style.visibility = "visible";
			actiObj.changeFocus("hands_x0_y0_ruleBackBtnFocus_");
		} else if(ii == 2) {
			//获取排行榜页数据
			this.getRankStatus();
			this.rankPage = true;
			CT.$("rankPageBG").style.visibility = "visible";
			actiObj.changeFocus("hands_x0_y0_inputFocus_");
		} else if(ii == 3) {
			//返回平台首页
			backfunc();
		}
	},
	//获取排行榜页数据
	getRankStatus: function() {
		var _this = this;
		//当前积分
		actiObj.getUserCredit(function(res) {
			if(res && res.resultMsg == "success") {
				_this.currentScore = parseInt(res.creditNum, 10);
			} else {
				_this.currentScore = 0;
			}
			CT.$("currentScore").innerHTML = _this.currentScore;
			//当前排名
			//			actiObj.getUserRankList(function(res) {
			//				if(res.resultMsg == "success") {
			//					if(_this.currentScore == 0) {
			//						CT.$("currentRank").innerHTML = "";
			//					} else {
			//						CT.$("currentRank").innerHTML = res.rankID;
			//					}
			//				} else {
			//					CT.$("currentRank").innerHTML = "";
			//				}
			//			});
		});

		//获取用户手机号
		actiObj.getUserPhone(function(res) {
			if(res.userPhone != null) {
				CT.$("phoneInput").innerHTML = res.userPhone;
			} else {
				CT.$("phoneInput").innerHTML = "";
			}
		});
		//排行榜
		actiObj.getActivityRankList(function(res) {
			var rankHtml = "";
			if(res.resultMsg == "success") {
				for(var i = 0; i < res.list.length; i++) {
					rankHtml += "<li><span>" + (i + 1) + "</span><span>" + res.list[i].activity_credit_num + "</span><span>" + res.list[i].userId + "</span></li>";
					if(res.list[i].userId == actiUserId) {
						CT.$("currentRank").innerHTML = i+1;
					} else if(_this.currentScore == 0) {
						CT.$("currentRank").innerHTML = "";
					}
				}
				CT.$("nameListInner").innerHTML = rankHtml;
			} else {
				CT.$("nameListInner").innerHTML = "<li><span>66</span><span>120</span><span>18051987710</span></li>";
			}
		});
	},
	//没有机会弹窗按钮
	playGame: function() {
		backfunc();
	},
	//试玩结束去订购按钮
	toOrder: function() {
		orderJs.columnToOrderPage("activity_guessNumberMain");
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
		var TEL_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
		phoneNum = CT.$("phoneInput").innerHTML;
		if(phoneNum.length != 11) {
			CT.$("phoneInput").innerHTML = "请输入11位手机号码";
		} else {
			if(TEL_REGEXP.test(phoneNum)) {
				actiObj.setUserPhone(phoneNum, function(res) {
					phoneNum = res.userphone;
				});
				CT.$("saveTip").innerHTML = "手机号保存成功";
			} else {
				CT.$("phoneInput").innerHTML = "您输入的手机号格式有误";
			}
		}
	},
	emptyFunc: function() {
		CT.$("phoneInput").innerHTML = "";
		phoneNum = "";
	},
	saveBlur: function() {
		CT.$("saveTip").innerHTML = "";
	}
}

//实例
var GuessMainSp = new GuessMain();

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
		CT.$("phoneInput").innerHTML = phoneNum;
	}
}

// 游戏首页返回
function backfunc() {
	if(GuessMainSp.rulePage == true) {
		GuessMainSp.rulePage = false;
		CT.$("rulePageBG").style.visibility = "hidden";
		actiObj.changeFocus("hands_x0_y0_ruleBtnFocus_");
	} else if(GuessMainSp.rankPage == true) {
		GuessMainSp.rankPage = false;
		CT.$("rankPageBG").style.visibility = "hidden";
		actiObj.changeFocus("hands_x0_y0_rankBtnFocus_");
	} else if(GuessMainSp.noChanceTip == true || GuessMainSp.toOrderTip == true) { //没有机会弹窗显示 、试玩结束去订购弹窗	
		GuessMainSp.noChanceTip = false;
		GuessMainSp.toOrderTip = false;
		CT.$("tanChuangBG").style.visibility = "hidden";
		CT.$("tanchuangTip").src = "img/empty.png";
		actiObj.changeFocus("hands_x0_y0_startBtnFocus_");
	} else { //回到平台首页
		BackPortalMainPage();
	}
}