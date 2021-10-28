//构造函数
function Marbles() {
	this.initFunc(); //页面初始化
	this.progressBarAni; //进度条动画
	this.progresIndex = 1; //进度条变量
	this.pressTime = 0; //按压时长
	this.keyUpFlag = true; //键盘默认抬起
	this.progressFlag = 0;
	this.pathAni; //运动轨迹定时器
	this.pathIndex = 0; //运动轨迹变量
	this.hitIP; //撞击到的IP
	this.isMoveing = false; //弹珠是否在运动中
	this.isFirst = true; //第一次进入游戏
	this.tipShow = false;//弹窗是否显示
}
//原型
Marbles.prototype = {
	constructor: Marbles,
	initFunc: function() {
		//焦点初始化
		focusInit();
		curFocus = getFocusModel6("hands_x0_y0_marblesFocus_");
		curFocus.defaultFocus();
	},
	/*
	 * 按OK键，键盘按下事件
	 */
	keyDownFunc: function() {
		var _this = this;
		if(!this.isMoveing) { //弹珠在运动中不能操作按键			
			this.keyUpFlag = false; //键盘按下
			this.hitIP = Math.floor(Math.random() * 6); //[0.5]随机数
			//CT.$("marblesFocus").src = "img/launchBtn2.png";
			CT.$("spring").src = "img/pressDown.png";
			CT.$("marbleBall").style.top = "475px";
			if(this.pressTime == 0) {
				CT.$("progressBar").src = "img/eneryProgress/1.png";
			}
			this.pressTime++; //按压时间累计
			//进度条
			this.progressBarAni = setInterval(function() {
				if(_this.keyUpFlag) {
					_this.progressBarAni = null;
					clearInterval(_this.progressBarAni);
					_this.progresIndex = 1;
					_this.pressTime = 0;
					_this.progressFlag = 0;
					CT.$("progressBar").src = "img/eneryProgress/0.png";
				} else {
					if(_this.progressFlag % 1000 == 0) {
						if(_this.progresIndex > 5) {
							_this.progresIndex = 5;
						}
						CT.$("progressBar").src = "img/eneryProgress/" + _this.progresIndex + ".png";
						_this.progresIndex++;
					}
					_this.progressFlag += 200;
				}
			}, 200);
			//一段时间后执行弹珠飞出事件
			setTimeout(function(){
				_this.keyUpFunc();
			},1000);
		}
	},
	/*
	 * 按OK键，键盘抬起事件(河北不支持抬起事件改为延时操作)
	 */
	keyUpFunc: function() {
		var _this = this;
		//CT.writeInfo("键盘抬起进入");
		if(!this.isMoveing) { //弹珠在运动中不能操作按键
			this.isMoveing = true; //弹珠在运动中
			this.keyUpFlag = true; //键盘抬起标记		
			//CT.$("marblesFocus").src = "img/launchBtn1.png";
			CT.$("spring").src = "img/pressUp.png";
			//键盘抬起弹珠运动轨迹
			CT.$("marbleBall").style.top = "395px";
			setTimeout(function() {
				_this.movePathFunc();
			}, 200);
		}
	},
	/*
	 * 弹珠运动轨迹
	 */
	movePathFunc: function() {
		var _this = this;
		console.log(_this.hitIP);
		_this.pathAni = setInterval(function() {
			if(_this.pathIndex > 6) {
				if(randomTrajectoryArr[_this.hitIP][_this.pathIndex - 7]) {
					CT.$("marbleBall").style.left = randomTrajectoryArr[_this.hitIP][_this.pathIndex - 7].left;
					CT.$("marbleBall").style.top = randomTrajectoryArr[_this.hitIP][_this.pathIndex - 7].top;
				} else {
					//关闭定时器
					clearInterval(_this.pathAni);
					_this.pathAni = null;
					_this.pathIndex = 0;
					if(_this.hitIP < 5) {
						//IP图片变大之后跳详情页
						CT.$("ip" + _this.hitIP + "").src = "img/IP/ipFocus"+_this.hitIP+".png";
						CT.$("marbleBall").style.left = "528px";
						CT.$("marbleBall").style.top = "395px";
						setTimeout(function() {
							//_this.tipShow=true;//弹窗显示
							//CT.$("zhongTip").style.visibility = "visible";
							//_this.changeFocus("hands_x0_y0_zhongConfirmFocus_");
							//_this.isFirst = false; //不是第一次进入游戏
							_this.seeVideoFunc();
						}, 1000);
					} else {
						setTimeout(function() {
							//显示没打中弹窗
							_this.tipShow=true;//弹窗显示
							CT.$("noZhongTip").style.visibility = "visible";
							_this.changeFocus("hands_x0_y0_noZhongConfirmFocus_");
							_this.isFirst = false; //不是第一次进入游戏
						}, 1000);
					}
				}
			} else {
				CT.$("marbleBall").style.left = fixedTrajectoryArr[_this.pathIndex].left;
				CT.$("marbleBall").style.top = fixedTrajectoryArr[_this.pathIndex].top;
			}
			_this.pathIndex++;
		}, 180);
	},
	/*
	 * 再来一次
	 */
	againFunc: function() {
		CT.$("noZhongTip").style.visibility = "hidden";
		CT.$("zhongTip").style.visibility = "hidden";
		this.changeFocus("hands_x0_y0_marblesFocus_");
		this.isMoveing = false;
		if(this.hitIP < 5) {
			CT.$("ip" + this.hitIP + "").src = "img/IP/ip"+_this.hitIP+".png";
		} else {
			CT.$("marbleBall").style.left = "528px";
			CT.$("marbleBall").style.top = "395px";
		}
	},
	/*
	 * 砸中IP去看视频
	 */
	seeVideoFunc: function() {
		var _this = this;
		var cartoonId;
		/*
		 * 焦点点击确认跳转
		 * */
		CT.setCookie("columnBackUrl", window.location.href);
		//orderJs.columnGetAuth(function(authData) {
			//if(authData == "0" || (OutJson.pageInfo.more1 + "").indexOf("free") > -1 || (OutJson.recommend_1[_this.hitIP].more1 + "").indexOf("free") > -1) {
				if(_this.hitIP==0){
					cartoonId = 7362;//超级飞侠八 
				}else if(_this.hitIP==1){
					cartoonId = 1861;//萌鸡小队第二季
				}else if(_this.hitIP==2){
					cartoonId = 7396;//汪汪队六
				}else if(_this.hitIP==3){
					cartoonId = 2498;//小猪佩奇七
				}else if(_this.hitIP==4){
					cartoonId = 2133;//罗布奥特曼
				}
				var params = {
					contentId : 3,
					cartoonId :cartoonId,
					contentType: "page"
				};
                CT.getAnterByIdOrAction(params);
			//} else {
				//orderJs.columnToOrderPage();
			//}
		//});

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
	},
	/*
	*上移事件
	*/
	upEventFunc:function(){
		if(!MarblesGame.isMoveing){
			this.changeFocus("hands_x0_y0_orderFocus_");
		}
	}

}
//实例
var MarblesGame = new Marbles();