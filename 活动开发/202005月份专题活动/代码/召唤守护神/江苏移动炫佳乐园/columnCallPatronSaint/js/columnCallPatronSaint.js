function callPatronSaint() {
	this.initFunc();
	this.imgIndex = 1;
	this.randomIp;
	this.ipAni; //定时器
	this.handIndex = 1; //手指动画
	this.handAni;
	this.timeFlag = 1; //时间标记
	this.boomIndex = 1; //爆炸标记
}
callPatronSaint.prototype = {
	constructor: callPatronSaint,
	initFunc: function() {
		var buttonDom = "";
		for(var i = 0; i < 5; i++) {
			//创建页面元素
			buttonDom = '<img src="img/ip1.png" alt="" id="card' + (i + 1) + '" class="card' + (i + 1) + '"/><div id="hands_x0_y0_cards' + (i + 1) + 'Focus_"><img src="img/hand1.png" alt="" id="cards' + (i + 1) + 'Focus" style="visibility: hidden;"/></div>';
			//创建页面焦点元素
			var button = {
				id: "hands_x0_y0_cards" + (i + 1) + "Focus_",
				clickHandler: "javascript:callPatronSaintGame.clickIP(" + (i + 1) + ")",
				left: "hands_x0_y0_cards" + i + "Focus_",
				right: "hands_x0_y0_cards" + (i + 2) + "Focus_",
				up: "disable",
				down: "disable",
				focusType: 7
			}
			if(i == 0) {
				button.left = "disable";
				button.down = "hands_x0_y0_cards4Focus_";
			} else if(i == 1) {
				button.down = "hands_x0_y0_cards4Focus_";
			} else if(i == 2) {
				button.down = "hands_x0_y0_cards5Focus_";
			} else if(i == 3) {
				button.up = "hands_x0_y0_cards1Focus_";
			} else if(i == 4) {
				button.up = "hands_x0_y0_cards3Focus_";
				button.right = "disable";
			}
			buttons.push(button);
			CT.$("blackBG").innerHTML += buttonDom;
		}
		//初始化焦点
		focusInit();
		curFocus = getFocusModel6("hands_x0_y0_cards1Focus_");
		curFocus.defaultFocus();
	},
	clickIP: function(index) {
		var _this = this;
		this.randomIp = Math.floor(Math.random() * 5); //[0,4]随机数
		//手指动画
		this.handAni = setInterval(function() {
			if(_this.handIndex % 2 == 0) {
				CT.$("cards" + index + "Focus").src = "img/hand1.png";
				clearInterval(_this.handAni);
				_this.handAni = null;
				//切换到空焦点
				_this.changeFocus("hands_x0_y0_blankFocus_");
			} else {
				CT.$("cards" + index + "Focus").src = "img/hand2.png";
			}
			_this.handIndex++;
		}, 200);
		//400ms之后手指动画结束，再执行飞出动画
		setTimeout(function() {
			_this.flyCenter(index);
		}, 500);
	},
	flyCenter: function(index) {
		var _this = this;
		//执行飞到中间的动画
		this.addClass(CT.$("card" + index + ""), "flyCenter");
		this.ipAni = setInterval(function() {
			if(_this.imgIndex > 3) {
				if(_this.imgIndex > 6) {
					_this.imgIndex = 6;
					clearInterval(_this.ipAni);
					_this.ipAni = null;
					//大图动画					
					CT.$("ipBig").src = ipImages[_this.randomIp][0];
					_this.addClass(CT.$("ipBig"), "ipBigAni");
					setTimeout(function() {
						_this.addClass(CT.$("ipBig"), "upDownAni");
						_this.changeFocus("hands_x0_y0_ipBigFocus_");
					}, 400);
				} else {
					CT.$("card" + index + "").src = ipImages[_this.randomIp][_this.imgIndex - 3];
				}
			} else {
				CT.$("card" + index + "").src = "img/ip" + _this.imgIndex + ".png";
			}
			if(_this.timeFlag == 4) {
				//执行爆炸效果
				_this.blueBoom();
			}
			_this.imgIndex++;
			_this.timeFlag++;
		}, 250);
	},
	blueBoom: function() {
		var _this = this;
		this.boomInterval = setInterval(function() {
			if(_this.boomIndex > 6) {
				if(_this.boomIndex % 2 == 0) {
					CT.$("boomImg").src = "img/light/8.png";
				} else {
					CT.$("boomImg").src = "img/light/7.png";
				}
			} else {
				CT.$("boomImg").src = "img/light/" + _this.boomIndex + ".png";
			}
			_this.boomIndex++;
		}, 180);
	},
	clickbigIP: function() {
		var _this = this;
		//跳转对应片单或者跳订购
		CT.setCookie("columnBackUrl", window.location.href);
		var columnFree = OutJson[0].pageInfo.more1;
		if(freeAction == generalAction || columnFree == "free") {
			toAnterRecommendUrl(OutJson, 1, "recommend_1", _this.randomIp);
		} else {
			orderJs.columnGetAuth(function(data) {
				if(data == 0) {
					toAnterRecommendUrl(OutJson, 1, "recommend_1", _this.randomIp);
				} else {
					orderJs.columnToOrderPage(generalAction);
				}
			});
		}
	},
	/**
	 *判断当前DOM（objDom）元素是否拥有cls类
	 *
	 * objDom: 查询元素
	 * cls类名
	 * */
	hasClass: function(objDom, cls) {
		return objDom.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
	},
	/**
	 *为当前DOM（objDom）元素添加cls类
	 *
	 * objDom: 查询元素
	 * cls类名
	 * */
	addClass: function(objDom, cls) {
		if(!this.hasClass(objDom, cls)) objDom.className += " " + cls;
	},
	/**
	 *为当前DOM（objDom）元素移除cls类
	 *
	 * objDom: 查询元素
	 * cls类名
	 * */
	removeClass: function(objDom, cls) {
		if(this.hasClass(objDom, cls)) objDom.className = objDom.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), '');
	},
	/**
	 * 查看当前页面是否存在选中框focusName
	 * @param focusName
	 * @returns {boolean}
	 */
	checkFocusAble: function(focusName) {
		if(focusName && focusName.indexOf("hands_x0_y0") != -1 && document.getElementById(focusName)) {
			return true;
		} else {
			return false;
		}
	},
	/**
	 * 切换焦点
	 * @param focusName
	 */
	changeFocus: function(focusName) {
		if(this.checkFocusAble(focusName) === true) {
			curFocus.defaultBlur();
			curFocus = getFocusModel6(focusName);
			curFocus.defaultFocus();
		}
	}
}
var callPatronSaintGame = new callPatronSaint();