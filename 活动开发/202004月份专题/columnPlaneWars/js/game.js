//构造函数
function planeWars() {
	this.planeArr = ["img/plane1.png", "img/plane2.png", "img/plane1.png", "img/plane2.png", "img/ip/0.png", "img/ip/1.png", "img/ip/2.png", "img/ip/3.png", "img/ip/4.png"]; //飞机数组
	this.dropAni = null; //下落动画定时器    
	this.timeFlag1 = 0; //标记创建飞机时间 
	this.timeFlag2 = 1; //标记IP飞机出现时间
	this.planeSrc; //飞机图片
	this.dropPlaneArr = CT.$("dropPlane").getElementsByTagName("img"); //下落飞机数组
	this.upBulletArr = CT.$("shootBullets").getElementsByTagName("img"); //发射子弹数组
	this.boomImg = 0; //爆炸图片
	this.boomAni = null; //定时器
	this.isFirst = true; //默认是第一次进游戏
	this.killNumber = 0; //打死飞机的数量
	this.initFunc(); //页面初始化
}
// 原型
planeWars.prototype = {
	constructor: planeWars,
	/*
	 *页面初始化：出现箭头操作提示；三秒之后提示箭头消失、游戏开始
	 */
	initFunc: function() {
		var _this = this;
		if(this.isFirst) {
			this.isFirst = false;
			//箭头操作提示
			actiObj.addClass(CT.$("leftArrow"), "leftArrowAni");
			actiObj.addClass(CT.$("rightArrow"), "rightArrowAni");
			//三秒之后，箭头动画以及箭头图片消失
			setTimeout(function() {
				CT.$("main").removeChild(CT.$("leftArrow"));
				CT.$("main").removeChild(CT.$("rightArrow"));
			}, 3000);
		}
		//飞机飞行轨迹
		this.dropAni = setInterval(function() {
			if(_this.timeFlag1 % 20 == 0) {
				//飞机创建
				_this.createPlane();
			}
			if(_this.timeFlag1 % 10 == 0) {
				//我方歼击机发射子弹
				_this.shootBullet();
			}
			_this.timeFlag1++;
			_this.timeFlag2++;
			//飞机下落动画
			_this.dropFunc();
			//子弹向上发射
			_this.flyBullet();
			//判断撞击
			_this.checkHits();
			//判断敌方飞机是否飞过我方地盘
			_this.checkOut();
		}, 180);
	},
	/*
	 *创建敌方飞机
	 */
	createPlane: function() {
		var planeDom = document.createElement("img");
		if(this.timeFlag2 > 200) {
			this.planeSrc = Math.floor(Math.random() * 9); //[0,8]随机数
		} else {
			this.planeSrc = Math.floor(Math.random() * 4); //[0,3]随机数
		}
		var leftRandom = Math.random() * 901 + 100; //飞机left随机数[100,1000]
		var topRandom = 0 - (Math.random() * 221 + 80); //飞机top随机数[-300,-90]
		planeDom.src = this.planeArr[this.planeSrc];
		planeDom.style.position = "absolute";
		planeDom.style.left = leftRandom + "px";
		planeDom.style.top = topRandom + "px";
		CT.$("dropPlane").appendChild(planeDom);
	},
	/*
	 *飞机下落动画
	 */
	dropFunc: function() {
		if(this.dropPlaneArr.length > 0) {
			for(var i = 0; i < this.dropPlaneArr.length; i++) {
				this.dropPlaneArr[i].style.top = parseInt(this.dropPlaneArr[i].style.top) + 10 + "px";
			}
		}
	},
	/*
	 *自动发射子弹
	 */
	shootBullet: function() {
		var bulletDom = document.createElement("img");
		bulletDom.src = "img/bullet.png";
		bulletDom.style.position = "absolute";
		bulletDom.style.left = parseInt(CT.$("hands_x0_y0_fighterFocus_").style.left) + 90 + "px";
		bulletDom.style.top = CT.$("hands_x0_y0_fighterFocus_").style.top;
		CT.$("shootBullets").appendChild(bulletDom);
	},
	/*
	 *子弹向上发射
	 */
	flyBullet: function() {
		if(this.upBulletArr.length > 0) {
			for(var i = 0; i < this.upBulletArr.length; i++) {
				this.upBulletArr[i].style.top = parseInt(this.upBulletArr[i].style.top) - 40 + "px";
			}
		}
	},
	/*
	 *子弹左移
	 */
	leftEvent: function() {
		if(parseInt(CT.$("hands_x0_y0_fighterFocus_").style.left) >= -20) {
			CT.$("hands_x0_y0_fighterFocus_").style.left = parseInt(CT.$("hands_x0_y0_fighterFocus_").style.left) - 30 + "px";
		}
	},
	/*
	 *子弹右移
	 */
	rightEvent: function() {
		if(parseInt(CT.$("hands_x0_y0_fighterFocus_").style.left) <= 1060) {
			CT.$("hands_x0_y0_fighterFocus_").style.left = parseInt(CT.$("hands_x0_y0_fighterFocus_").style.left) + 30 + "px";
		}
	},
	/*
	 *判断子弹和飞机撞击：碰撞普通飞机产生爆炸、飞机消失、加分数；碰撞到带有IP的飞机产生爆炸、加分数、跳转对应片单；
	 *如果没有碰撞到对应的炸弹超过页面顶部消失；
	 */
	checkHits: function() {
		for(var j = 0; j < this.dropPlaneArr.length; j++) {
			for(var i = 0; i < this.upBulletArr.length; i++) {
				if(parseInt(this.upBulletArr[i].style.left) > parseInt(this.dropPlaneArr[j].style.left) && parseInt(this.upBulletArr[i].style.left) < parseInt(this.dropPlaneArr[j].style.left) + this.dropPlaneArr[j].width) {
					if(parseInt(this.upBulletArr[i].style.top) > parseInt(this.dropPlaneArr[j].style.top) && parseInt(this.upBulletArr[i].style.top) < parseInt(this.dropPlaneArr[j].style.top) + this.dropPlaneArr[j].height) {
						//子弹爆炸效果，子弹图片换成爆炸图片，飞机消失                            
						this.boomFunc(i, j);
						//创建加分图片
						this.getScore(i, j);
						//打到带有IP的飞机，跳转视频详情页
						this.jumpVideoDetail(i, j);
					}
				} else if(parseInt(this.upBulletArr[i].style.top) < -20) {
					this.upBulletArr[i].parentNode.removeChild(this.upBulletArr[i]);
				}
			}
		}
	},
	/*
	 *爆炸效果
	 */
	boomFunc: function(bulletIndex, planeIndex) {
		var _this = this;
		this.boomImg = 0;
		if(_this.boomAni == null) {
			this.boomAni = setInterval(function() {
				if(_this.boomImg > 2) {
					_this.boomImg = 0;
					_this.upBulletArr[bulletIndex].src = "img/empty.png";
					_this.dropPlaneArr[planeIndex].parentNode.removeChild(_this.dropPlaneArr[planeIndex]);
					_this.upBulletArr[bulletIndex].parentNode.removeChild(_this.upBulletArr[bulletIndex]);
					CT.$("getScores").src = "img/empty.png";
					actiObj.removeClass(CT.$("getScores"), "addScoreAni");
					//消灭飞机的数量
					_this.killNumber++;
					CT.$("totalScore").innerHTML = _this.killNumber * 20;
					clearInterval(_this.boomAni);
					_this.boomAni = null;
				} else {
					_this.upBulletArr[bulletIndex].src = "img/boom" + _this.boomImg + ".png";
					_this.upBulletArr[bulletIndex].style.left = parseInt(_this.dropPlaneArr[planeIndex].style.left) - 135 + "px";
					_this.upBulletArr[bulletIndex].style.top = parseInt(_this.dropPlaneArr[planeIndex].style.top) - 120 + "px";
					_this.boomImg++;
				}
			}, 20);
		}
	},
	/*
	 *如果飞机飞过页面最底部或者碰撞到我方歼击机，则本次游戏结束，显示弹窗再来一次
	 */
	checkOut: function() {
		for(var i = 0; i < this.dropPlaneArr.length; i++) {
			if(parseInt(this.dropPlaneArr[i].style.top) > 540) {
				//游戏结束，弹窗出现
				CT.$("againTip").src = "img/againTip.png";
				actiObj.changeFocus("hands_x0_y0_againTipFocus_");
				clearInterval(this.dropAni);
				this.dropAni = null;
			}
		}
	},
	continue: function() {
		//所有下落飞机重置
		CT.$("dropPlane").innerHTML = "";
		//所有子弹重置
		CT.$("shootBullets").innerHTML = "";
		this.killNumber = 0;
		CT.$("totalScore").innerHTML = 0; //积分清零
		this.timeFlag1 = 0;
		this.timeFlag2 = 1;
		actiObj.changeFocus("hands_x0_y0_fighterFocus_");
		CT.$("againTip").src = "img/empty.png";
		this.initFunc();

	},
	getScore: function(bulletIndex, planeIndex) {
		CT.$("getScores").src = "img/get20.png";
		CT.$("getScores").style.left = this.dropPlaneArr[planeIndex].style.left;
		CT.$("getScores").style.top = this.dropPlaneArr[planeIndex].style.top;
		actiObj.addClass(CT.$("getScores"), "addScoreAni");
	},
	jumpVideoDetail: function(bulletIndex, planeIndex) {
		if(this.dropPlaneArr[planeIndex].src.indexOf("ip/0") > -1) {
			CT.goPage();
			var params = {
				contentId: 3,
				cartoonId: "5936",
				contentType: "page"
			};
			CT.getAnterByIdOrAction(params); //阿贡和他的朋友们 
		} else if(this.dropPlaneArr[planeIndex].src.indexOf("ip/1") > -1) {
			CT.goPage();
			var params = {
				contentId: 3,
				cartoonId: "1714",
				contentType: "page"
			};
			CT.getAnterByIdOrAction(params); //超级飞侠第六季
		} else if(this.dropPlaneArr[planeIndex].src.indexOf("ip/2") > -1) {
			CT.goPage();
			var params = {
				contentId: 3,
				cartoonId: "4688",
				contentType: "page"
			};
			CT.getAnterByIdOrAction(params); //贝肯熊第四季
		} else if(this.dropPlaneArr[planeIndex].src.indexOf("ip/3") > -1) {
			CT.goPage();
			var params = {
				contentId: 3,
				cartoonId: "5764",
				contentType: "page"
			};
			CT.getAnterByIdOrAction(params); //小猪佩奇第七季特别篇：金靴子
		} else if(this.dropPlaneArr[planeIndex].src.indexOf("ip/4") > -1) {
			CT.goPage();
			var params = {
				contentId: 3,
				cartoonId: "3902",
				contentType: "page"
			};
			CT.getAnterByIdOrAction(params); //钢铁飞龙2龙魂觉醒
		}
	}
}
// 实例
var planeWarsGame = new planeWars();

function backfunc() {
	window.location.href = "main.html";
}

// 进入游戏页先提示如何操作，三秒之后焦点初始化
//飞机从上往下随机出现（并伴有左右晃动），带有IP的飞机一段时间之后再出现：随机产生
// 用户左右移动我方歼击机，我方歼击机自动发射子弹，射中则发生爆炸效果（爆炸动画、对应的飞机消失、加分数）
// 打中带有IP的飞机，则跳转对应的IP片单
// 如果飞机飞过页面最底部或者碰撞到我方歼击机，则本次游戏结束，显示弹窗再来一次
//子弹没有碰撞到飞机，超出页面顶部则该子弹消失