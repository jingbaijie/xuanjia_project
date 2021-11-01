//聚焦事件，调用封装的js
var buttons = [
    {
        id: "hands_x0_y0_iconFocus0_",
        clickHandler:"javascript:fn()",
        left:"disable",
        right:"disable",
        up:"disable",
        upEvent:"javascript:topMove()",
        down:"disable",
		leftEvent:"javascript:topMove()",
		rightEvent:"javascript:downMove()",
        downEvent:"javascript:downMove()",
        focusType:7
    },
    {
        id: "hands_x0_y0_backFocus0_",
        clickHandler:"javascript:continueGame()",
        left:"hands_x0_y0_backFocus1_",
        right:"hands_x0_y0_backFocus1_",
        up:"disable",
        down:"disable",
        focusType:7
    },
    {
        id: "hands_x0_y0_backFocus1_",
        clickHandler:"javascript:back()",
        left:"hands_x0_y0_backFocus0_",
        right:"hands_x0_y0_backFocus0_",
        up:"disable",
        down:"disable",
        focusType:7
    }


];
PAGE.focusInit();
PAGE.changeFocus("hands_x0_y0_iconFocus0_");

//继续游戏
function continueGame(){
    timer2 = setInterval(moveLight,40);
    if(timer != null){
        timer = setInterval(moveFootball,150);
    }
    showImg("backing","hidden");
    PAGE.changeFocus("hands_x0_y0_iconFocus0_");
}
//返回
function back(){
    backfunc();
}
function backfunc(){
	CT.backPage();
};

//游戏逻辑

//1、箭头切换
var arrow = document.getElementById("arrow").getElementsByTagName("img")[0];
var index = 6;

//改变箭头
function changeArrow(a,b){
    arrow.src = "./HD/web/column/gameShootfootball/images/arrow/"+index+".png";
    arrow.style.left = a;
    arrow.style.top = b;
}

function topMove(){
	changeSound();
    if(index<=1){
        index = 1;
    }
    index--;
    changeArrow("-94px","-48px");
}
function downMove(){
	changeSound();
    if(index>=11){
        index = 11;
    }
    index++;
    changeArrow("-94px","-48px");
}

var info = document.getElementById("info");
//2、移动光标
//光标
var lightImg = document.getElementById("lightA");
//光标的left值
var lightLeft = 592;
//定义方向
var direct = 1;
var colorFlag = 1;
var colorFlagImg = document.getElementById("colorFlag").getElementsByTagName("img")[0];
var flagBool = false;
//移动光标的函数
function moveLight(){
    if(lightLeft < 400){
        direct = 1;
    }
    if(lightLeft >780){
        direct = -1;
    }
    if(goalNum <5){
        lightLeft += direct*30;
    }else if(goalNum <20){
        lightLeft += direct*40;
    }else {
        lightLeft += direct*50;
    }

    lightImg.style.left = lightLeft +"px";
    if(flagBool){
        colorsFlag();
        setTimeout(function () {
            flagBool = false;
        },800);
    }
}

//设置光标移动的定时器
var timer2 = setInterval(function () {
    moveLight();
},200);
//彩旗飘动
function colorsFlag(){
    if(colorFlag == 1){
        colorFlagImg.src ="./HD/web/column/gameShootfootball/images/colorflag1.png";
        colorFlag = 0;
    }else {
        colorFlagImg.src ="./HD/web/column/gameShootfootball/images/colorflag2.png";
        colorFlag = 1;
    }

}
//
//3、移动足球

//足球
var foot = document.getElementById("foot");
//足球的left值
// var footLeft = parseInt(foot.style.left);
var footLeft = 600;
//定义变量存储足球需要运动的x
var footX = 0;
//足球的top值
//var footTop = parseInt(foot.style.top);
var footTop = 662;
//足球的定时器
var timer = null;
//定义开闭原则
var stopMove = false;
//守门人
var proMan = document.getElementById("protect_man");
//踢球人
var man = document.getElementById("man").getElementsByTagName("img")[0];
//获取连续进球的span
var goalNum = document.getElementById("goalNum").innerHTML;
//最小宽度
var minWidth = 0;
//箭头偏移的度数
var angle  = 0;
//图片显示
function showImg(ele,visi){
    document.getElementById(ele).style.visibility = visi;
}
//切换守门人
function changeImg(num,image,top){
    proMan.style.left = num?((lightLeft - num)+"px"):"592px";
    proMan.src = "./HD/web/column/gameShootfootball/images/man/"+image+".png";
    proMan.style.top = top+"px";
}
//改变进球数并显现
function changeGoal() {
	//shotSucOgg.play();
	//sucOgg.play();
    goalNum++;
    document.getElementById("goalNum").innerHTML = goalNum;
    if(goalNum > 1 ){
        showImg("goal","visible");
    }
}
//重新定义
function init(){
    //隐藏
    showImg("goal","hidden");
    //足球
    foot.style.left = "600px";
    foot.style.top ="662px";
    footTop = 662;
    footLeft = 600;
    stopMove = false;
    //箭头
    index = 6;
    arrow.src = "./HD/web/column/gameShootfootball/images/arrow/arrow.png";
    arrow.style.left = "0";
    arrow.style.top = "0";
    //踢球人
    man.src = "./HD/web/column/gameShootfootball/images/man_ready.png";
    //守门人
    changeImg(null,"offen","253");
    //重新开启定时器
    timer2 = setInterval(moveLight,200);
    shootBoolean=true;
}
var overResultDrn=document.getElementById("overResultDrn");
var overNum=document.getElementById("overNum");
var resultBoolean=false;
function showResultDrn(){
	resultBoolean=true;
	overNum.innerHTML = goalNum;
	overResultDrn.style.visibility="visible";
	overNum.style.visibility="visible";
	goalNum=0;
}
function intiHideResult(){
	resultBoolean=false;
	overResultDrn.style.visibility="hidden";
	overNum.style.visibility="hidden";
	
	 init()
	
	
}
//游戏结束
function over(){
	showResultDrn();
}
function changeMan(){
    //左边--右边--中间
    if(lightLeft>350 && lightLeft<450) {
        clearInterval(timer2);
        changeImg(26,"left",280);
        minWidth= parseInt(proMan.style.left);
        if((footLeft< (minWidth-36) || footLeft > minWidth + 155) && footLeft >380 && footLeft < 850 ){
            flagBool = true;
            changeGoal();
            setTimeout(init,1000);
        }else {
        	//deffOgg.play();
            setTimeout(over,1000);
        }
    }else if(lightLeft>740 && lightLeft<820){
        clearInterval(timer2);
        changeImg(26,"right",280);
        minWidth= parseInt(proMan.style.left)-36;
        if((footLeft< (minWidth-36) || footLeft > minWidth + 155) && footLeft>380 && footLeft<850){
            flagBool = true;
            changeGoal();
            setTimeout(init,1000);
        }else {
        //	deffOgg.play();
            setTimeout(over,1000);
        }
    }else {
        clearInterval(timer2);
        changeImg(1,"top",182);
        minWidth= parseInt(proMan.style.left)+18;
        if((footLeft< (minWidth-36) || footLeft > minWidth + 75) && footLeft>380 && footLeft<850){
            flagBool = true;
            changeGoal();
            setTimeout(init,1000);
        }else {
        	//deffOgg.play();
            setTimeout(over,1000);
        }
    }
    
}
//球体运动
function moveFootball(){
    footTop -= 30;
    footLeft += footX;
    //如果超过屏幕
    if(footLeft>1190 || footTop<0){
        clearInterval(timer);
        stopMove=true;
       // deffOgg.play();
		setTimeout(over,500);
    }
    if(footTop<280){
        clearInterval(timer);
        stopMove=true;
        //判断得分
        changeMan();
    }
    if(!stopMove){
        foot.style.left =footLeft+"px";
        foot.style.top = footTop  +"px";
    }
}
//获取x移动的位移
function calX(angler,y){
    var pier =Math.PI/180*angler;
    var tan = Math.tan(pier);
    return (-1)*Math.round(y/tan*100)/100;
}
function fn() {
	if(resultBoolean==false){
		
		
	
	if(shootBoolean){
		shootBoolean=false;
		
	
		//shotOgg.play();
		//改变踢球人
		man.src = "./HD/web/column/gameShootfootball/images/man_game.png";
		//获取x便宜的角度
		angle = index*12.5+15;
		footX = calX(angle,20);
		//设置定时器
  	  timer = setInterval(function(){moveFootball();},80);
	}
	}else{
		var xlOrder ="1";// CT.getCookie("xlOrder") + "";		
		if(xlOrder == "1"){
			intiHideResult();
		}else{
			orderJs.getAuth(function(){
				CT.setCookie("xlOrder",1);
				intiHideResult();
			});
		}
		
	}
}
//按下踢球
function changeNum(num){
    if(num == 0){
        fn();
    }
}




