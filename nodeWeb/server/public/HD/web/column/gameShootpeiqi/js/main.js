var buttons = [
    {
        id: "hands_x0_y0_iconFocus0_",
        clickHandler:"javascript:fn()",
        left:"disable",
        right:"disable",
        up:"disable",
        down:"disable",
        focusType:7
    },
	{
		id: "hands_x0_y0_iconFocus1_",
		clickHandler:"javascript:back()",
		left:"disable",
		right:"disable",
		up:"disable",
		down:"disable",
		focusType:7
	}
];
PAGE.focusInit();
PAGE.changeFocus("hands_x0_y0_iconFocus0_");

//定义怪兽出现的位置
var giftArr = [
    {left: 267,top: 264},
    {left: 355,top: 265},
    {left: 437,top: 264},
    {left: 534,top: 272},
    {left: 628,top: 265}
    ];
//定义怪兽的数组
var giftNumArr = [];
//怪兽生成的地方
var giftDiv = document.getElementById("gift");
//小猪佩奇
var pinkPei = document.getElementById("pinkPei");
//得分
var scoreNum = document.getElementById("scoreNum");
var scoreNumHTML = 0;
//子弹
var shoot = document.getElementById("shoot");
//失败的弹窗
var losePop = document.getElementById("losePop");
//定义切换的图片的标志
var flag = 1;
//返回随机数
function random (start,end) {
	return Math.floor(Math.random()*(end-start))+start;
}
//怪兽的构造函数
function Gift(){
	this.giftImage = null;
	//x轴--left的值
    this.x = "";
	//y轴--left的值
    this.y = "";
	//小怪兽的图片
    this.giftImage = "";
    //小怪兽的类型
    this.giftNum = 0;
    //小怪兽的x步长
    this.stepX = "";
    //小怪兽的位置
	this.giftLock = 0;
    //小怪兽的y步长
    this.stepY = "10";
    //小怪兽是否被打了
	this.canDown = false;
	//小怪兽是否可以删除
	this.canDelete = false;
	//小怪兽的炸弹时间
	this.frameIndex = 0;
	//小怪兽的图片切换
	this.flag = 1;
    //随机生成this.giftNum怪兽类型
	this.bgImg = function () {
		var currentNum = parseInt(random(0, 3));
		switch (currentNum) {
			case 0:
				return "0";
				break;
			case 1:
				return "1";
				break;
			case 2:
				return "2";
				break;
		}
	};
	//生成怪兽
	this.init = function () {
		this.giftNum = this.bgImg();
		this.giftImage = document.createElement("img");
		this.giftImage.src = "./HD/web/column/gameShootpeiqi/images/"+this.giftNum+".png";
		this.giftLock = random(0,5);
		this.x = giftArr[this.giftLock].left;
		this.y = giftArr[this.giftLock].top;
		this.giftImage.style.position ="absolute";
		this.giftImage.style.left = this.x +"px";
		this.giftImage.style.top = this.y +"px";
		giftDiv.appendChild(this.giftImage);
	};
	this.init();
    //根据随机生成的this.giftLock怪兽位置确定x轴的步长
	this.speedX = function (num) {
		switch(num){
			case 0:
				return "-5";
				break;
			case 1:
				return "-3";
				break;
			case 2:
				return "0";
				break;
			case 3:
				return "3";
				break;
			case 4:
				return "5";
				break;
		}
	};
	//移动
	this.step = function () {
		if(this.canDown){
			this.frameIndex++;
			if(this.frameIndex>1){
				this.canDelete = true;
			}
		}else {
			if(this.y >= 480){
				this.y = 480;
				this.x += 0;
				setTimeout(function () {
					document.getElementById("losePop").style.visibility = "visible";
					PAGE.changeFocus("hands_x0_y0_iconFocus1_");
					clearInterval(timer);
				},800);
			}else {
				this.stepX = this.speedX(this.giftLock);
				this.x += parseInt(this.stepX);
				if(scoreNumHTML>21){
					this.y += 20;
				}else {
					this.y += parseInt(this.stepY);
				}

			}
			this.giftImage.style.left = this.x+"px";
			this.giftImage.style.top = this.y +"px";
		}
	};
	//停止
	this.stop = function () {
		losePop.style.visibility = "visible";

		PAGE.changeFocus("hands_x0_y0_iconFocus1_");
		clearInterval(timer);
	};
	//切换图片
	this.giftMove= function () {
		if(!this.canDown){
			if(this.flag == 1){
				this.giftImage.src = "./HD/web/column/gameShootpeiqi/images/"+this.giftNum+".png";
				this.flag = 0;
			}else {
				this.giftImage.src = "./HD/web/column/gameShootpeiqi/images/"+this.giftNum+"_move.png";
				this.flag = 1;
			}
		}
	}
}
//子弹和小猪佩奇的切换
function shootMove(){
	if(flag == 1){
		shoot.src="./HD/web/column/gameShootpeiqi/images/shoot.png";
		pinkPei.src = "./HD/web/column/gameShootpeiqi/images/peiqi01.png";
		flag = 0;
	}else {
		shoot.src="./HD/web/column/gameShootpeiqi/images/shoot_move.png";
		pinkPei.src = "./HD/web/column/gameShootpeiqi/images/peiqi02.png";
		flag = 1;
	}
}
//子弹的移动
var shootNum = 0;
var lock = 0;
function shootDom(){
	if(shootNum % 4 == 0){
		lock = this.random(0,5);
	}
    //子弹
    if(giftNumArr.length >= 1){
    	if(!giftNumArr[0].canDown){
		    shoot.style.left = (giftNumArr[0].x -15)+"px";
		    shoot.style.top = (giftNumArr[0].y -15)+"px";
	    }
    }else {
        shoot.style.left = (giftArr[lock].left-15)+"px";
        shoot.style.top = (giftArr[lock].top-10)+"px";
	    shootNum++;
    }

}
var num = 0;
//创建怪兽
function createGift(){
    if(num% 10 == 0){
        giftNumArr.push(new Gift());
    }
    num++;
}
//怪兽移动
function stepGift(){
	for (var i = 0; i < giftNumArr.length; i++) {
		giftNumArr[i].step();
		giftNumArr[i].giftMove();
	}
}
//怪兽删除
function deleteGift(){
	for (var i = 0; i < giftNumArr.length; i++) {
		if(giftNumArr[i].canDelete){
			giftDiv.removeChild(giftNumArr[i].giftImage);
			giftNumArr.splice(i,1);
		}
	}
}
//开始游戏
function startGame(){
	createGift();
	stepGift();
	deleteGift();
	shootMove();
	shootDom();
}
//设置定时器
var timer = setInterval(function () {
	startGame();
},250);
var fnNum = 0;
//执行爆炸动画
function fn() {
    if(giftNumArr.length >=1){
    	if(scoreNumHTML<= 20){
		    giftNumArr[0].canDown = true;
			if(giftNumArr[0].giftImage.src.indexOf("baozha") == -1){
				scoreInner();
			}
		    giftNumArr[0].giftImage.src = "./HD/web/column/gameShootpeiqi/images/baozha.png";
	    }else {
		    fnNum++;
		    if(fnNum>1){
			    giftNumArr[0].canDown = true;
				if(giftNumArr[0].giftImage.src.indexOf("baozha") == -1){
					scoreInner();
				}
			    giftNumArr[0].giftImage.src = "./HD/web/column/gameShootpeiqi/images/baozha.png";
			    fnNum = 0;
		    }
	    }
    }
}
//得分
function scoreInner(){
	scoreNumHTML++;
	if(scoreNumHTML<10){
		scoreNum.innerHTML = "00"+scoreNumHTML;
	}else if(scoreNumHTML<100){
		scoreNum.innerHTML = "0"+scoreNumHTML;
	}else {
		scoreNum.innerHTML = scoreNumHTML;
	}
}
//重置游戏参数
function init(){
	for (var i = 0; i < giftNumArr.length; i++) {
		giftDiv.removeChild(giftNumArr[i].giftImage);

	}
	giftNumArr = [];
	shoot.style.left = "340px";
	shoot.style.top = "255px";
	scoreNumHTML = 0;
	scoreNum.innerHTML = "000";
}
//继续玩
function back(){
	var xlOrder ="1";// CT.getCookie("xlOrder") + "";
	if(xlOrder == "1"){
		document.getElementById("losePop").style.visibility = "hidden";
		init();
		PAGE.changeFocus("hands_x0_y0_iconFocus0_");
		timer = setInterval(function () {
			startGame();
		},250);
	}else{
		orderJs.getAuth(function(){
			CT.setCookie("xlOrder",1);
			document.getElementById("losePop").style.visibility = "hidden";
			init();
			PAGE.changeFocus("hands_x0_y0_iconFocus0_");
			timer = setInterval(function () {
				startGame();
			},250);
		});
	}
}
function backFunc(){
	CT.backPage();
};
