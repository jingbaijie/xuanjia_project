//聚焦事件，调用封装的js
var buttons = [
    {
        id: "hands_x0_y0_oscar_",
        clickHandler:"",
        left:"disable",
        right:"disable",
        leftEvent:"javascript:sea_game.leftMove()",
        rightEvent:"javascript:sea_game.rightMove()",
        up:"disable",
       // upEvent:"javascript:sea_game.topMove()",
        down:"disable",
        focusType:7
    },
    {
        id: "hands_x0_y0_conFocus0_",
        clickHandler:"javascript:sea_game.continueGame()",
        up: "disable",
        down: "disable",
        left: "hands_x0_y0_conFocus1_",
        right: "hands_x0_y0_conFocus1_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_conFocus1_",
        clickHandler:"javascript:sea_game.outGame()",
        up: "hands_x0_y0_conFocus2_",
        down: "disable",
        left: "hands_x0_y0_conFocus0_",
        right: "hands_x0_y0_conFocus0_",
        focusType: 7
    },
    {
        id: "hands_x0_y0_conFocus2_",
        clickHandler:"javascript:sea_game.closedGame()",
        up: "disable",
        down: "hands_x0_y0_conFocus1_",
        left: "hands_x0_y0_conFocus0_",
        right: "hands_x0_y0_conFocus1_",
        focusType: 7
    },
	{
		id: "hands_x0_y0_conFocus3_",
		clickHandler:"javascript:closedEnd()",
		up: "disable",
		down: "disable",
		left: "disable",
		right: "disable",
		focusType: 7
	}
];
PAGE.focusInit();
PAGE.changeFocus("hands_x0_y0_oscar_");

var sea_game = (function(){
    //潜艇左移动
    function leftMove(){
        oscar.x -= 30;
        if(oscar.x <45) oscar.x = 45;
        CT.$("hands_x0_y0_oscar_").style.left = oscar.x +"px";
    }
    //潜艇右移动
    function rightMove(){
        oscar.x += 30;
        if(oscar.x > 1150) oscar.x = 1150;
        CT.$("hands_x0_y0_oscar_").style.left = oscar.x +"px";
    }
    //按到返回的弹窗
    function topMove(){
        isPause = true;
        document.getElementById("backBg").style.visibility = "visible";
        PAGE.focusInit();
        PAGE.changeFocus("hands_x0_y0_conFocus0_");
    }
    //按到返回的弹窗中继续游戏
    function continueGame() {
		 isPause = false;
		 hiddenStyle("backBg","hidden");
		 hiddenStyle("conFocus0","hidden");
		 PAGE.focusInit();
		 PAGE.changeFocus("hands_x0_y0_oscar_");
    }
    //按到返回的弹窗退出游戏
    function outGame(){
 /*       hiddenStyle("backBg","hidden");
        hiddenStyle("conFocus1","hidden");
        footballGamen++;
        CT.setCookie("footballGamen",footballGamen);
        window.location = "./index.html";*/
    }
    //按到返回的弹窗退出按钮右上角
    function closedGame() {
       /* hiddenStyle("backBg","hidden");
        hiddenStyle("conFocus2","hidden");
        window.location = "./index.html";*/
    }
    return {
        leftMove:leftMove,
        rightMove:rightMove,
        topMove:topMove,
        continueGame:continueGame,
        outGame:outGame,
        closedGame:closedGame,
    };
})();

var main = document.getElementById("main");
var fish = document.getElementById("fish");
//是否暂停
var isPause = false;
//潜艇的一些基础信息
var oscar = document.getElementById("hands_x0_y0_oscar_");
    oscar.x = 500;
    oscar.y = 520;
    oscar.width = 142;
    oscar.height = 186;
    //发射子弹
    oscar.shoot = function () {
        // 创建子弹对象，添加数组中;
        bullets.push(new Bullet(bulletInit));
    };
//图片隐藏或显示
function hiddenStyle(ele,result){
    document.getElementById(ele).style.visibility = result;
}
//子弹的函数
var bullet = new Image();
bullet.src = "./HD/web/column/gameShootSea/images/bullet.png";
var bulletInit = {
    imgs:bullet,
    width:79,
    height: 105
};
function Bullet(object){
    this.bulletImage = null;
    this.images = object.imgs;
    this.width = object.width;
    this.height = object.height;
    this.x = parseInt(oscar.x) + 31.5 + 8;
    this.y = parseInt(oscar.y)- 105 + 25;
    this.canDelete = false;
    this.init = function(){
        this.bulletImage = document.createElement("img");
        this.bulletImage.src = "./HD/web/column/gameShootSea/images/bullet.png";
        this.bulletImage.style.position = "absolute";
        this.bulletImage.style.left = this.x + "px";
        this.bulletImage.style.top = this.y + "px";
        main.appendChild(this.bulletImage);
    };
    this.step = function(){
        this.y -= 30;
        this.bulletImage.style.top = this.y+"px";
    }
}
var bullets = [];
function paintBullets() {
    bullets[bullets.length - 1].init();
}
//  创建移动所有子弹的函数
function stepBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].step();
    }
}
//  创建删除子弹的函数
function delBullets(){
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].bulletImage.offsetTop <= 0 || bullets[i].canDelete) {
            main.removeChild(bullets[i].bulletImage);
            bullets.splice(i, 1);
        }
    }
}

function backFunc(){
	CT.backPage();
};
	

//小鱼的函数
var fish0;
fish0 = new Image();
fish0.src = "./HD/web/column/gameShootSea/images/fish/small_1.png";

var fish1;
fish1 = new Image();
fish1.src = "./HD/web/column/gameShootSea/images/fish/small_2.png";

var fish2;
fish2 = new Image();
fish2.src = "./HD/web/column/gameShootSea/images/fish/middle_1.png";

var fish3;
fish3 = new Image();
fish3.src = "./HD/web/column/gameShootSea/images/fish/middle_2.png";

var fish4;
fish4 = new Image();
fish4.src = "./HD/web/column/gameShootSea/images/fish/middle_3.png";

var fish5;
fish5 = new Image();
fish5.src = "./HD/web/column/gameShootSea/images/fish/large_1.png";

var fish6;
fish6 = new Image();
fish6.src = "./HD/web/column/gameShootSea/images/fish/large_2.png";

var fishInit0 = {
	images: fish0,
	width: 92,
	height: 74,
	counts: 1,
	len: fish0.length,
	life:1,
	score:2,
	type: 1,
	x:0,
    y:100
};
var fishInit1 = {
	images: fish1,
	width: 166,
	height: 92,
	counts: 1,
	len: fish1.length,
	life:2,
	score:2,
	type: 1,
	x:0,
    y:110
};
var fishInit2 = {
	images: fish2,
	width: 176,
	height: 79,
	counts: 1,
	len: fish2.length,
	life:2,
	score:5,
	type: 2,
	x:0,
    y:80
};
var fishInit3 = {
	images: fish3,
	width: 136,
	height: 95,
	counts: 1,
	len: fish3.length,
	life:2,
	score:5,
	type: 2,
	x:0,
    y:130
};
var fishInit4 = {
	images: fish4,
	width: 208,
	height: 97,
	counts: 1,
	len: fish4.length,
	life:2,
	score:5,
	type: 4,
	x:1200,
    y:250
};
var fishInit5 = {
	images: fish5,
	width: 311,
	height: 169,
	counts: 1,
	len: fish5.length,
	life:3,
	score:20,
	type: 3,
	x:0,
    y:150
};
var fishInit6 = {
	images: fish6,
	width: 237,
	height: 162,
	counts: 1,
	len: fish6.length,
	life:3,
	score:30,
	type: 5,
	x:0,
    y:120
};
var score = 0;
//创建fish的构造函数
function Fish(object){
	this.width = object.width;
	this.height = object.height;
	this.images = object.images;
	this.type = object.type;
	this.counts = object.counts;
	this.length = object.length;
	this.maxHeight = 340;
	this.minHeight = 120;
	this.direct = 1;
	this.x = object.x;
	this.y = Math.random()* ( this.maxHeight - this.minHeight) + object.y;
	this.frameIndex = 0;
	this.canDown = false;
	this.canDelete = false;
	this.life = object.life;
	this.score = object.score;
	this.init = function () {
		if(this.images.src){
			this.enemyImage=document.createElement("img");
			this.enemyImage.src = this.images.src;
			this.enemyImage.style.position = "absolute";
			this.enemyImage.style.left = this.x + "px";
			this.enemyImage.style.top = this.y + "px";
			fish.appendChild(this.enemyImage);
		}
	};
	this.init();
	var speed = 5*this.direct;
	this.step = function () {
	    if(this.canDown){
            this.frameIndex++;
		    if(this.frameIndex > 1){
	            this.canDelete = true;
            }
        }else {
		    switch (this.type) {
			    case 1://小鱼
				    this.enemyImage.style.left = this.x + 15 + "px";
				    this.x += 15;//小鱼移动速度控制
				    if (this.y > 300) {
					    this.direct = -1;
					    speed = 5 * this.direct;
				    } else if (this.y < 150) {
					    this.direct = 1;
					    speed = 5 * this.direct;
				    }
				    this.enemyImage.style.top = this.y + speed + "px";
				    this.y += speed;
				    break;
			    case 2://中等鱼
				    this.enemyImage.style.left = this.x + 20 + "px";
				    this.x += 20;//小鱼移动速度控制
				    if (this.y > 400) {
					    this.direct = -1;
					    speed = 5 * this.direct;
				    }else if(this.y<250){
					    this.direct = 1;
					    speed = 5*this.direct;
				    }
				    this.enemyImage.style.top = this.y + speed + "px";
				    this.y += speed;
				    break;
			    case 3://大鱼
				    this.enemyImage.style.left = this.x + 25 + "px";
				    this.x += 25;//大鱼移动速度控制
				    if(this.y>300){
					    this.direct = -1;
					    speed = 5*this.direct;
				    }else if(this.y<150){
					    this.direct = 1;
					    speed = 5*this.direct;
				    }
				    this.enemyImage.style.top = this.y + speed + "px";
				    this.y += speed;
				    break;
			    case 4://右边的鱼
				    this.enemyImage.style.left = this.x - 20 + "px";
				    this.x -= 20;//小鱼移动速度控制
				    if(this.y>300){
					    this.direct = -1;
					    speed = 5*this.direct;
				    }else if(this.y<150){
					    this.direct = 1;
					    speed = 5*this.direct;
				    }
				    this.enemyImage.style.top = this.y + speed + "px";
				    this.y += speed;
				    break;
                case 5://大鱼
                    this.enemyImage.style.left = this.x + 28 + "px";
                    this.x += 28;//大鱼移动速度控制
                    if(this.y>320){
                        this.direct = -1;
                        speed = 5*this.direct;
                    }else if(this.y<150){
                        this.direct = 1;
                        speed = 5*this.direct;
                    }
                    this.enemyImage.style.top = this.y + speed + "px";
                    this.y += speed;
                    break;
		    }
	    }
	};
	this.checkHit = function (bomb) {
		return bomb.y < this.y + this.height-60 &&
                bomb.x + bomb.width-50 > this.x &&
                bomb.x < this.x + this.width-60  &&
                bomb.y + bomb.height-50  > this.y;
	};
	this.down = function () {
		this.life--;
		// console.log("type:"+this.type+",life:"+this.life);
		if (this.life === 0) {
			this.canDown = true;
			// 执行爆破动画 - 实际上切换数组的角标值
			this.enemyImage.src = "./HD/web/column/gameShootSea/images/bomb.png";
			// 游戏得分累加
			score += this.score;
			if(score<10){
				document.getElementById("integralNum").innerHTML = "00"+score;
			}else if(score<100){
				document.getElementById("integralNum").innerHTML = "0"+score;
			}else {
				document.getElementById("integralNum").innerHTML = score;
			}
		}
	}
}
var fishArr = [];
var time = 0;
// 小鱼创建
function createFish(){
	if(time%6===0) {
        var num = Math.random() * 10;
        if (num <4) {
            fishArr[fishArr.length] = new Fish(fishInit0);
        } else if (num <5.5) {
            fishArr[fishArr.length] = new Fish(fishInit1);
        } else if (num <6) {
            fishArr[fishArr.length] = new Fish(fishInit2);
        } else if (num < 7.5) {
            fishArr[fishArr.length] = new Fish(fishInit3);
        } else if (num <9) {
            fishArr[fishArr.length] = new Fish(fishInit4);
        }else if(num<9.5) {
            fishArr[fishArr.length] = new Fish(fishInit5);
        }else if(num<10){
            fishArr[fishArr.length] = new Fish(fishInit6);
        }
    }
    time++;
}
// 小鱼移动
function stepFish(){
	for (var i = 0; i < fishArr.length; i++) {
		fishArr[i].step();
	}
}
// 小鱼删除
function deleteFish(){
    for (var i =0; i <fishArr.length; i++) {
	    if((fishArr[i].type === 4 && fishArr[i].x<0) || fishArr[i].type !== 4 &&fishArr[i].x>1280 || fishArr[i].canDelete ){
            fish.removeChild(fishArr[i].enemyImage);
            fishArr.splice(i,1);
        }
    }

}
//小鱼碰撞子弹判断
function checkHits(){
    for (var i = 0; i < fishArr.length; i++) {
        for (var j = 0; j < bullets.length; j++) {
            if(fishArr[i].checkHit(bullets[j]) && !fishArr[i].canDown){
                if(fishArr[i].type ===4){
                    timeValue += 2;
                }
                if(fishArr[i].type === 5){
                    timeValue -= 2; 
					if(timeValue == 0 || timeValue < 0){
						isPause = true;
						document.getElementById("countNum").innerHTML = 0;
						document.getElementById("endGame").style.visibility = "visible";
						PAGE.changeFocus("hands_x0_y0_conFocus3_");
					}
                }
	            bullets[j].canDelete = true;
	            fishArr[i].down();
            }
        }
    }
}
//设置定时器-小鱼和子弹
var num = 0;
var timer2 = setInterval(function(){
	if(isPause) return;
    num++;
    if(num%5 === 0){
        oscar.shoot();
        num = 0;
        paintBullets();
    }
    stepBullets();
    createFish();
	stepFish();
	checkHits();
	deleteFish();
    delBullets();
},180);
//设置定时器-倒计时
var timeValue = 30;
var timer = setInterval(function(){
	if(isPause) return;
	timeValue--;
	document.getElementById("countNum").innerHTML = timeValue<10?"0"+timeValue:timeValue;
	if(timeValue == 0){
		isPause = true;
		document.getElementById("countNum").innerHTML = 0;
		document.getElementById("endGame").style.visibility = "visible";

		PAGE.changeFocus("hands_x0_y0_conFocus3_");
	}
},1000);
function closedEnd(){
	document.getElementById("endGame").style.visibility = "hidden";
	PAGE.changeFocus("hands_x0_y0_oscar_");
	isPause = false;
	timeValue = 30;
	document.getElementById("countNum").innerHTML = 30;
	score = 0;
	document.getElementById("integralNum").innerHTML = "00";

	 
}

