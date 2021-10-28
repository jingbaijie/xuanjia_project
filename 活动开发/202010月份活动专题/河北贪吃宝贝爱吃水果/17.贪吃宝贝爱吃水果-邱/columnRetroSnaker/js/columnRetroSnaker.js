var isOrder;
var boxTip = false;//宝箱弹窗是否显示，默认不显示
var againTip = false;//再来一次弹窗，默认不显示
/*鉴权*/
orderJs.columnGetAuth(function(data) {
	if (data == "0") {
		isOrder = 0;
	}else {
		isOrder = 1;
	}					
});

// 1、食物对象
function Food(width, height, foodImg, x, y) {
    this.width = width || 50;
    this.height = height || 50;
    this.x = x || 0;
    this.y = y || 0;
    this.foodArr = [];//食物数组
    this.foodNum = 0;
    this.randomFood = 0;
}

Food.prototype = {
    constructor: Food,
    /*
    *初始化把食物显示在地图上
    */
    init: function (map) {
        var _this = this;		
        var foodImgArr = ["apple", "bananan", "manggo", "pear", "pineapple", "strawberry", "pig", "newXMF", "superFly8", "treasureBox", "jjd","bbl"];
        // 先删除再创建，初始化每个食物(即每次只有一个食物产生);
        this.remove();
        //食物出现个数
        this.foodNum++;
        //创建一个食物
        var img = document.createElement("img");
        img.id = "foodImg";
        // 把div添加到map中
        if (this.foodNum > 5) {
            this.randomFood = Math.floor(Math.random() * 8+3);//[3,11]随机数          
            img.src = "img/game/food/" + foodImgArr[this.randomFood] + ".png";
        } else {
            this.randomFood = Math.floor(Math.random() * 6);//[0,5]随机数
            img.src = "img/game/food/" + foodImgArr[this.randomFood] + ".png";
        }
        map.appendChild(img);
        // 给食物设置样式
        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        img.style.position = "absolute";
        //随机数的坐标，不能超过地图的位置
        this.x = parseInt(Math.random() * ((map.offsetWidth - 100) / this.width)) * this.width;//食物的随机横坐标
        this.y = parseInt(Math.random() * ((map.offsetHeight - 100) / this.height)) * this.height;//食物的随机纵坐标
        //设置食物随机出现的位置
        img.style.left = (this.x+25) + "px";
        img.style.top = (this.y+25) + "px";
        this.foodArr.push(img);
    },
    /*
    *删除食物函数
    */
    remove: function () {
        for (var i = 0; i < this.foodArr.length; i++) {
            this.foodArr[i].parentElement.removeChild(this.foodArr[i]);
        }
        this.foodArr = [];
    }
}



// 2、小蛇对象
function Snake(width, height, direction) {
    this.direction = direction || "left";
    this.body = [{ x: 400, y: 200, imgSrc: "img/game/snakeHead/left.png" }, { x: 440, y: 200, imgSrc: "img/game/bodyImg.png" }, { x: 480, y: 200, imgSrc: "img/game/bodyImg.png" }, { x: 520, y: 200, imgSrc: "img/game/bodyImg.png" }];//蛇头，身体的位置
    this.snakeArr = [];//蛇身体部位数组 
    this.width = width || 40;
    this.height = height || 40;
}


Snake.prototype = {
    constructor: Snake,
    /*
    *小蛇初始化
    */
    init: function () {
        this.remove();
        //遍历创建小蛇的每个部位
        for (var i = 0; i < this.body.length; i++) {
            var bodyImg = document.createElement("img");
            map.appendChild(bodyImg);
            bodyImg.style.position = "absolute";
            bodyImg.style.left = this.body[i].x + "px";
            bodyImg.style.top = this.body[i].y + "px";
            bodyImg.style.width = this.width + "px";
            bodyImg.style.height = this.height + "px";
            bodyImg.src = this.body[i].imgSrc;
            if (i == 0) {
                bodyImg.id = "snakeHead";
            } else {
                bodyImg.id = "snakeBody" + i;
            }
            this.snakeArr.push(bodyImg);
        }
    },
    /*
    *先清除再创建
    */
    remove: function () {
        for (var i = 0; i < this.snakeArr.length; i++) {
            this.snakeArr[i].parentElement.removeChild(this.snakeArr[i]);
        }
        this.snakeArr = [];
    },
    /*
    *小蛇移动一节:
    *蛇头根据方向键移动一格，身体部分后一节占据前一节的位置：循环小蛇的身体部位，头部要判断方向
    */
    moveSnake: function (map, food) {
        for (var i = this.body.length - 1; i > 0; i--) {
            //当i=2的时候，此时是第三块的坐标，把第2块的坐标给第3块的坐标
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
        }
        //判断小蛇头部坐标的位置
        switch (this.direction) {
            case "left":
                this.body[0].x -= 40;
                this.body[0].imgSrc = "img/game/snakeHead/left.png";
                break;
            case "right":
                this.body[0].x += 40;
                this.body[0].imgSrc = "img/game/snakeHead/right.png";
                break;
            case "up":
                this.body[0].y -= 40;
                this.body[0].imgSrc = "img/game/snakeHead/up.png";
                break;
            case "down":
                this.body[0].y += 40;
                this.body[0].imgSrc = "img/game/snakeHead/down.png";
                break;
            default:
                break;
        }
        //判断小蛇是否吃到食物:蛇头坐标在食物内
        //蛇头的坐标
        var headX = this.body[0].x;
        var headY = this.body[0].y;
        // 食物坐标
        var foodX = food.x;
        var foodY = food.y;
		var snakeHeadLeft = parseInt(CT.$("snakeHead").style.left);
		var foodImgLeft = parseInt(CT.$("foodImg").style.left);
		var snakeHeadTop = parseInt(CT.$("snakeHead").style.top);
		var foodImgTop = parseInt(CT.$("foodImg").style.top);
        if (snakeHeadLeft > foodImgLeft - 20 && snakeHeadLeft < foodImgLeft + 50 && snakeHeadTop > foodImgTop - 20 && snakeHeadTop < foodImgTop + 50) {
            //根据食物出现的种类执行操作
            game.judgeFoodType();
            //重新初始化食物
            food.init(map);            
            //小蛇增长一节：获取小蛇最后的尾巴，添加到数组中
            var last = this.body[this.body.length - 1];
            this.body.push({
                x: last.x,
                y: last.y,
                imgSrc: last.imgSrc
            })
        }
    },

}

// 3、游戏对象
function Game() {
    this.food = new Food();//食物对象实例化
    this.snake = new Snake();//小蛇对象实例化
    this.map = document.getElementById("map");//地图对象
    this.timer = null;//定时器
}
Game.prototype = {
    constructor: Game,
    init: function () { 
        this.keyDownEvent(this.snake.direction);
        this.runSnake(this.map, this.food, this.snake);//小蛇跑起来
    },
    /*
    *监听键盘方向键
    */
    keyDownEvent: function (direction) {
        document.onkeydown = function (evt) {
            var keyCode1 = PAGE.keyCode(evt);
            var keyName = getKeyCodeName(keyCode1);
            switch (keyName) {
                case "UP":
                    game.snake.direction = "up";
                    break;
                case "DOWN":
                    game.snake.direction = "down";
                    break;
                case "LEFT":
                    game.snake.direction = "left";
                    break;
                case "RIGHT":
                    game.snake.direction = "right";
                    break;
                case "OK":
                    CT.stopJump();
                    curFocus.OK();
                    break;
                case "BACK":
                case "BACK_PAGE":
                case "RETURN":
                case "OUT_PAGE":
                case "HOME_PAGE":
                    CT.stopJump();
                    try {
                        evt = evt != null && evt != undefined ? evt : window.event;
                        evt.preventDefault();
                    } catch (e) {
                    }
                    backfunc();
                    break;
                default:
                    break;
            }
        };
    },
    /*
    *小蛇跑起来
    */
    runSnake: function (map, food, snake) {
        var _this = this;
		if(!boxTip){
			this.timer = setInterval(function () {
				_this.snake.moveSnake(map, food);//小蛇移动
				_this.snake.init(map);//小蛇显示
				//判断碰撞：碰撞到自己，碰撞到墙，游戏结束
				_this.checkHit(map, snake);
			}, 500);
		}        
    },
    /*
    *判断碰撞：碰撞到自己；碰撞到墙
    */
    checkHit: function (map, snake) {
        //检测撞墙
        var minX = 0;//墙相对于小蛇最小横坐标
        var minY = 0;//墙相对于小蛇最小纵坐标
        var maxX = document.getElementById("map").offsetWidth;//墙相对于小蛇最大横坐标
        var maxY = document.getElementById("map").offsetHeight;//墙相对于小蛇最大纵坐标
        var headX = snake.body[0].x;//蛇头横坐标
        var headY = snake.body[0].y;//蛇头纵坐标
        if (headX <= minX+30 || headY <= minY+30 || headX + 40 >= maxX-30 || headY + 40 >= maxY-30) {
			clearInterval(this.timer);
            this.hitShow(snake);
        }
        //检测撞到自己
        for (var i = 1; i < snake.body.length; i++) {
            if (headX == snake.body[i].x && headY == snake.body[i].y) {
				clearInterval(this.timer);
                this.hitShow(snake);                
            }
        }
    },
    /*
    *撞击蛇头变化
    */
    hitShow: function (snake) {
        if (snake.direction == "up") {
            snake.body[0].imgSrc = "img/game/failHead/up.png";
        } else if (snake.direction == "down") {
            snake.body[0].imgSrc = "img/game/failHead/down.png";
        } else if (snake.direction == "left") {
            snake.body[0].imgSrc = "img/game/failHead/left.png";
        } else if (snake.direction == "right") {
            snake.body[0].imgSrc = "img/game/failHead/right.png";
        }
        document.getElementById("snakeHead").src = snake.body[0].imgSrc;
        setTimeout(function () {
			if(!boxTip){
				//结束游戏弹窗
				document.getElementById("againTip").style.visibility = "visible";
				PAGE.changeFocus("hands_x0_y0_againBtnFocus_");
				againTip=true; 
			}            
        }, 1000);
    },
    /*
    *再来一次:初始化游戏
    */
    againFunc: function () {
        game.snake.body = [{ x: 400, y: 200, imgSrc: "img/game/snakeHead/left.png" }, { x: 440, y: 200, imgSrc: "img/game/bodyImg.png" }, { x: 480, y: 200, imgSrc: "img/game/bodyImg.png" }, { x: 520, y: 200, imgSrc: "img/game/bodyImg.png" }];
        game.snake.direction = "left";
		game.food.foodNum=0;
        PAGE.changeFocus("hands_x0_y0_emptyFocus_");
        document.getElementById("againTip").style.visibility = "hidden";
        game.init();
    },
    /*
    *食物出现是宝箱还是IP
    */
    judgeFoodType: function () {
        //打开宝箱
        if (this.food.randomFood == 9) {
			clearInterval(this.timer);
			document.getElementById("openTip").style.visibility="visible";
			PAGE.changeFocus("hands_x0_y0_openBtnFocus_");
			boxTip=true;//弹窗显示
        }else if(this.food.randomFood == 6 || this.food.randomFood == 7 || this.food.randomFood == 8 || this.food.randomFood == 10){
            //阿贡、钢铁飞龙、超级飞侠8、宇宙护卫队2
            var cartoonId;
            if (this.food.randomFood == 6) {//猪猪侠恐龙日记第三季
                cartoonId=7750;
            } else if (this.food.randomFood == 7) {//新小蜜蜂第一季
                cartoonId=8288;
            } else if (this.food.randomFood == 8) {//超级飞侠8
                cartoonId=7362;
            } else if (this.food.randomFood == 10) {//咭咭豆第二季
                cartoonId=8280;
            }else if(this.food.randomFood == 11){//帮帮龙出动第二季
				cartoonId=8220;
			}
            var params = {
                contentId:3,
                cartoonId:cartoonId,
                contentType:"page"
            }
            CT.goPage();
            CT.getAnterByIdOrAction(params);

        }


    },
    /*
    *打开宝箱:随机跳转片单
    */
   openBoxFunc:function(){
		var cartoonIdArr = [7750,8288,7362,8280,8220];
		var randomIndex = Math.floor(Math.random()*4);//[0,3]随机数
		var params = {
				contentId:3,
				cartoonId:cartoonIdArr[randomIndex],
				contentType:"page"
		}
		CT.goPage();
		CT.getAnterByIdOrAction(params);
   },
	/*
   *VIP订购按钮点击事件
   */
   vipOrder:function(){
		if(isOrder!="0"){
			PAGE.otherPageParam = "&curFocusId="+curFocus.FocusID + "&contentId=" + CT.requestValue("contentId")+"&contentEName="+CT.requestValue("contentEName")+"&contentCName="+CT.requestValue("contentCName");
			CT.goPage();
			orderJs.columnToOrderPage("columnRetroSnaker");
		}else{
			CT.BackPortalMainPage();//回首页
		}
   },
   /*
   *VIP订购按钮左移事件
   */
   vipBtnLeft:function(){
	   game.init();
	   PAGE.changeFocus("hands_x0_y0_emptyFocus_");
	   //订购按钮消失
	   CT.$("vipOrder").style.visibility="hidden";
	   CT.$("startGameTip").style.visibility="hidden";
   }

}

//游戏对象实例化
var game = new Game();
//显示食物和小蛇
game.food.init(game.map);
game.snake.init(game.map);

function backfunc() {
	if(boxTip){
		boxTip=false;
		game.runSnake(game.map, game.food, game.snake);
		document.getElementById("openTip").style.visibility="hidden";
		PAGE.changeFocus("hands_x0_y0_emptyFocus_");
	}else if(againTip){
		game.againFunc();
		againTip=false;
	}else{
		CT.backPage();
	}	
}
