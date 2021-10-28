// 构造函数
function elimonateVirusGame() {
	this.createVirus(); //初始化焦点,创建病毒页面元素
	this.initFunc(); //页面初始化 
	this.boomAni = null; //发射动画   
	this.boomIndex = 1; //发射图片标记
	this.initAni = null; //病毒下落动画
	this.virusFlag = 0; //病毒下落时间标记
	this.virusArr = []; //病毒数组
	this.totalScore = 0; //总分
	this.isClick = true; //是否可以点击：默认可以点击、碰撞之后恢复点击、子弹超过顶部边界恢复点击
	this.tipText; //弹窗文字
	this.tipTextArr = ["出门戴口罩，勤洗手!", "咳嗽或打喷嚏时捂住口鼻!", "将肉蛋彻底做熟!", "避免与呼吸道感染患者密切接触!", "避免近距离接触野生动物或活牲畜!", "不要随地吐痰!", "不要去人多的地方凑热闹!"]; //文字提示数组
	this.thisScore = 0; //本局得分
	this.chanceNum = 0; //未订购用户已使用游戏机会
	this.isOrder; //是否订购
	this.killNumber = 0; //杀死的病毒数量
}
// 原型
elimonateVirusGame.prototype = {
	constructor: elimonateVirusGame,
	/*
	 *获取眉头参数
	 */
	GetQueryString: function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		console.log(reg)
		var r = window.location.search.substr(1).match(reg);
		if(r != null) return unescape(r[2]);
		return null;
	},
	/*
	 * 初始化焦点,射手卡通；
	 * 获取页面总积分
	 */
	createVirus: function() {
		//根据眉头参数，初始化射手卡通character:0/1
		var character = this.GetQueryString("character");
		//判断是否为订购用户
		this.isOrder = this.GetQueryString("isOrder");
		if(character == 0) {
			CT.$("shooter").src = "img/game/cartoon1.png";
		} else if(character == 1) {
			CT.$("shooter").src = "img/game/cartoon2.png";
		}
		//获取游戏总积分
		this.getTotalScore();
		//获取游戏机会
		this.getChanceFunc();
		// 焦点初始化
		focusInit();
		curFous = getFocusModel6("hands_x0_y0_shootFocus_");
		curFous.defaultFocus();
	},
	/*
	 *页面初始化：病毒动画
	 */
	initFunc: function() {
		var _this = this;
		this.virusFlag = 0;
		this.thisScore = 0;
		this.killNumber = 0;
		// 页面元素渲染
		for(var i = 0; i < 28; i++) {
			var virusHTML = "<img src='img/game/virus/virus" + (i + 1) + ".png' id='virus" + (i + 1) + "' class='virus" + (i + 1) + "'>";
			CT.$("virus").innerHTML += virusHTML;
		}
		// 病毒移动：从上到下移动
		setTimeout(function() {
			_this.initAni = setInterval(function() {
				CT.$("virus").getElementsByTagName("img")[0].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[0].offsetTop + 5) + "px";
				if(_this.virusFlag >= 10) {
					CT.$("virus").getElementsByTagName("img")[4].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[4].offsetTop + 5) + "px";
				}
				if(_this.virusFlag >= 60) {
					CT.$("virus").getElementsByTagName("img")[9].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[9].offsetTop + 5) + "px";
				}
				if(_this.virusFlag >= 25) {
					CT.$("virus").getElementsByTagName("img")[11].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[11].offsetTop + 5) + "px";
				}
				if(_this.virusFlag >= 35) {
					CT.$("virus").getElementsByTagName("img")[16].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[16].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 75) {
					CT.$("virus").getElementsByTagName("img")[18].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[18].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 90) {
					CT.$("virus").getElementsByTagName("img")[22].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[22].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 100) {
					CT.$("virus").getElementsByTagName("img")[23].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[23].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 110) {
					CT.$("virus").getElementsByTagName("img")[25].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[25].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 120) {
					CT.$("virus").getElementsByTagName("img")[26].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[26].offsetTop + 10) + "px";
				}
				if(_this.virusFlag >= 150) {
					CT.$("virus").getElementsByTagName("img")[27].style.top = parseInt(CT.$("virus").getElementsByTagName("img")[27].offsetTop + 10) + "px";
				}
				_this.virusFlag++;

				// 判断：发射机效果图的top值和病毒的高度比较，发射机效果图的left值和病毒的宽度比较
				_this.virusArr = CT.$("virus").getElementsByTagName("img");
				for(var i = 0; i < _this.virusArr.length; i++) {
					//病毒超过发射机的位置或者病毒被打完游戏结束
					if(_this.virusArr[i].offsetTop > 550 || _this.killNumber == 28) {
						//关闭定时器
						clearInterval(_this.initAni);
						_this.initAni = null;
						//游戏结束弹窗弹出
						CT.$("tip").style.visibility = "visible";
						actiObj.changeFocus("hands_x0_y0_againFocus_");
						//弹窗文字展示，订购用户上传游戏积分，未订购用户上传游戏机会
						_this.tipTextShow();
					}
				}

			}, 200);
		}, 1000);
	},
	/*
	 *订购用户获取总积分
	 */
	getTotalScore: function() {
		var _this = this;
		if(this.isOrder == "0") {
			actiObj.getUserCredit(function(res) {
				if(res && res.resultMsg == "success") {
					_this.totalScore = res.creditNum;
					CT.$("score").innerHTML = _this.totalScore;
				} else {
					_this.totalScore = 0;
				}
			});
		}
	},
	/*
	 *获取游戏机会
	 */
	getChanceFunc: function() {
		var _this = this;
		//未订购用户获取游戏机会
		if(this.isOrder == "1") {
			actiObj.getChance(function(res) {
				_this.chanceNum = res.activityChance;
			});
		}
	},
	/*
	 *弹窗文字提示,存储游戏总积分
	 */
	tipTextShow: function() {
		var random = Math.floor(Math.random() * 7); //[0,6]随机数
		CT.$("tipText").innerHTML = this.tipTextArr[random];
		CT.$("thisScore").innerHTML = this.thisScore;
		//订购用户上传游戏积分,未订购用户上传游戏机会
		if(this.isOrder == "0") {
			actiObj.setUserCredit(this.totalScore);
		} else {
			this.chanceNum++;
			actiObj.setChance();
		}
	},
	/*
	 *点击再次游戏:
	 *订购用户:当前页重新开始游戏；未订购用户:chanceNum>=2,返回首页，否则当前页重新开始游戏
	 */
	againFunc: function() {
		if(this.isOrder == "1" && this.chanceNum >= 2) {
			actiObj.toJumpUrl("activity_eliminateVirusMain.html");
		} else {
			//当前页重新开始游戏
			CT.$("virus").innerHTML = "";
			this.initFunc();
			//关闭弹窗
			CT.$("tip").style.visibility = "hidden";
			//切换焦点
			actiObj.changeFocus("hands_x0_y0_shootFocus_");
		}
	},
	/*
	 *发射机左右移动：移到最左边和最右边时不能移动
	 */
	leftMove: function() {
		if(parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) >= 30) {
			CT.$("hands_x0_y0_shootFocus_").style.left = (parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) - 20) + "px";
		}
	},
	rightMove: function() {
		if(parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) <= 940) {
			CT.$("hands_x0_y0_shootFocus_").style.left = (parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) + 20) + "px";
		}
	},
	shootFunc: function() {
		var _this = this;
		if(_this.boomAni == null) {
			_this.isClick = false;
			clearInterval(_this.boomAni);
			abc += 1;
			console.log(abc);
			_this.boomIndex = 1;
			_this.boomAni = null;
			_this.boomAni = setInterval(function() {
				if(_this.boomIndex > 2) {
					//射击效果向上飞
					CT.$("boom").src = "img/game/shoot3.png";
					CT.$("boom").style.left = parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) + "px";
					CT.$("boom").style.top = parseInt(CT.$("boom").style.top) - 40 + "px";
					if(parseInt(CT.$("boom").style.top) <= 10) {
						_this.boomIndex = 1;
						clearInterval(_this.boomAni);
						_this.boomAni = null;
						console.log("1----" + abc);
						CT.$("boom").src = "img/empty.png";
						//恢复点击
						if(_this.isClick == false) {
							_this.isClick = true;
						}
					} else {
						//撞击
						_this.hitFunc();
					}
				} else {
					if(_this.boomIndex == 1) {
						CT.$("boom").style.left = parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) + 22 + "px";
						CT.$("boom").style.top = "470px";
					} else if(_this.boomIndex == 2) {
						CT.$("boom").style.left = parseInt(CT.$("hands_x0_y0_shootFocus_").style.left) + 22 + "px";
						CT.$("boom").style.top = "330px";
					}
					CT.$("boom").src = "img/game/shoot" + _this.boomIndex + ".png";
					//撞击
					_this.hitFunc();
					_this.boomIndex++;
				}
			}, 100);
		}
	},
	/*
	 * 碰撞爆炸
	 */
	hitFunc: function() {
		var _this = this;
		for(var i = 0; i < _this.virusArr.length; i++) {
			if(_this.virusArr[i].style.visibility != "hidden") {
				if(parseInt(CT.$("boom").style.left) >= (_this.virusArr[i].offsetLeft - 20) && parseInt(CT.$("boom").style.left) <= (_this.virusArr[i].offsetLeft + _this.virusArr[i].offsetWidth)) {
					if(parseInt(CT.$("boom").style.top) >= (_this.virusArr[i].offsetTop + 10) && parseInt(CT.$("boom").style.top) <= (_this.virusArr[i].offsetTop + _this.virusArr[i].offsetHeight - 10)) {
						//发射子弹和病毒撞到一起，子弹爆炸                                
						CT.$("boom").src = "img/game/shoot4.png";
						CT.$("boom").style.left = (_this.virusArr[i].offsetLeft - 40) + "px";
						CT.$("boom").style.top = (_this.virusArr[i].offsetTop - 20) + "px";
						_this.virusArr[i].style.visibility = "hidden";
						_this.virusArr[i].style.top = "-10000px";
						_this.totalScore += 1;
						_this.thisScore += 1;
						CT.$("score").innerHTML = _this.totalScore;
						//杀死的病毒数量
						_this.killNumber += 1;
						_this.boomIndex = 1;
						clearInterval(_this.boomAni);
						console.log("2----" + abc);
						_this.boomAni = null;
						//一段时间之后当前爆炸图片消失、复位
						setTimeout(function() {
							//爆炸之后恢复点击
							if(_this.isClick == false) {
								_this.isClick = true;
							}
							CT.$("boom").src = "img/empty.png";
						}, 80);
					}
				}
			}
		}
	},
	/*
	 * 别处看看
	 */
	otherSeeFunc: function() {
		/*CT.setCookie("columnBackUrl",window.location.href);
        var actionCartoon = "cartoonDetail_2018v1";
        var actionUrl = "?action=cartoonDetail_2018v1&cartoonId=1005";
        var curId = "hands_x0_y0_otherSeeFocus_";
        getAnterUrl(actionCartoon, actionUrl, curId);*/

		//活动跳转链接，用于跳转其余厂家平台后返回至本活动用
		//var activityLoginPortal = "http://202.99.114.152:25436/xjcartoon_FrontEndWeb/index.jsp?action=loginPortal_activity_eliminateVirus";
		var returnUrl = "http://202.99.114.152:25436/xjcartoon_FrontEndWeb/page.action?action=Qversion_2018v3";
		//跳转链接拼接参数，用于传递给各厂家平台以及厂家平台返回至活动中的时候活动需要重新获取用户信息用
		var houzhui = "UserID=" + actiUserId + "&UserToken=" + actiUserToken + "&CarrierId=" + actiCarrierId +
			"&userID=" + actiUserId + "&userToken=" + actiUserToken + "&carrierId=" + actiCarrierId +
			"&ReturnUrl=" + returnUrl;
		//跳转炫佳乐园
		window.location.href = "http://202.99.114.152:25436/xjcartoon_FrontEndWeb/index.jsp?" + houzhui;
	}

}
// 实例
var elimonateVirusGameSp = new elimonateVirusGame();

function backfunc() {
	actiObj.toJumpUrl("activity_eliminateVirusMain.html");
}
var abc = 1;
/*
 * 游戏逻辑
 * 发射机左右移动：移到最左边和最右边时不能移动
 * 点击发射机触发发射动画：1、未射击到直接到上边距发射动画消失2、射击到最近的病毒触发爆炸动画（静止的：固定的上下左右边距；移动的：固定的左右边距，变化的上下边距）
 * 病毒移动：从上到下移动
 * 当病毒超过发射机的上边距则游戏结束，弹出对应弹窗
 */

//接口：
// 未订购用户:重新开始游戏获取游戏机会，弹窗弹出游戏次数chanceNum++，chanceNum>=2,点击再来一次回到首页，否则重新开始游戏；
// 订购用户：页面初始获取积分，弹窗弹出存储游戏积分