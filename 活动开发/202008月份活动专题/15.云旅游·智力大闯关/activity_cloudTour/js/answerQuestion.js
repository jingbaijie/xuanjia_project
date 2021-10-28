// 获取url查询字符串
function getQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}
var passedNum = 3; // 订购用户闯关机会
var isOrder = getQueryString("isOrder") || "0"; // 订购用户0 未订购用户1
var totalChance = parseInt(getQueryString("totalChance"));//获取从首页传递过来的总的抽奖机会
if(totalChance){
  totalChance = parseInt(getQueryString("totalChance"));
}else{
  totalChance=3;
}
var remainChance = parseInt(getQueryString("remainChance"));//获取从首页传递过来的剩余抽奖机会
// 页面进来时候
var randomQuestion = document.getElementById("randomQuestion");
var correct = document.getElementById("correct");
var error = document.getElementById("error");
var isPassedList = JSON.parse(CT.getCookie("isPassedList"));//用户当前闯关信息
var answerChance = (passedNum - parseInt(isPassedList[1])) > 0 ? (passedNum - parseInt(isPassedList[1])) : 0;//每位订购用户每天三次闯关机会，去掉已使用闯关机会,为当前剩余闯关机会
var showInter = null;//展示答题结果一次性定时器
var cityName = getQueryString("cityName");//获取当前城市信息
var questionList = [];//当前城市题目集
var canClick = true;//当前是否可以点击答题
if (cityName == "nj") {
  questionList = [
    //南京站
    { src: "./img/answerQ/nj1.png", answerIndex: 1 },
    { src: "./img/answerQ/nj2.png", answerIndex: 3 },
    { src: "./img/answerQ/nj3.png", answerIndex: 2 },
  ];
} else if (cityName == "sz") {
  questionList = [
    // 苏州站
    { src: "./img/answerQ/sz1.png", answerIndex: 3 },
    { src: "./img/answerQ/sz2.png", answerIndex: 1 },
    { src: "./img/answerQ/sz3.png", answerIndex: 1 },
  ];
} else if (cityName == "xa") {
  questionList = [
    // 西安站
    { src: "./img/answerQ/xa1.png", answerIndex: 3 },
    { src: "./img/answerQ/xa2.png", answerIndex: 1 },
    { src: "./img/answerQ/xa3.png", answerIndex: 1 },
  ];
} else if (cityName == "cd") {
  questionList = [
    // 成都站
    { src: "./img/answerQ/cd1.png", answerIndex: 2 },
    { src: "./img/answerQ/cd2.png", answerIndex: 3 },
  ];
}
// 随机加载题目
var randomIndex = Math.floor(Math.random() * questionList.length);
randomQuestion.src = questionList[randomIndex].src;
// 焦点初始化
focusInit();
curFocus = getFocusModel6("hands_x0_y0_opContent1_");
curFocus.defaultFocus();
// 设置闯关数据
function setIsPassed(cityName, isPassed) {
  var haveSetCurCity = false;//判断城市数据是否已存在
  for (var i = 2; i < isPassedList.length; i++) {
    if (isPassedList[i].cityName == cityName) {
      haveSetCurCity = true;
      isPassedList[i].isPassed = isPassed;
    }
  }
  if (!haveSetCurCity) {//不存在则添加当前城市的闯关数据
    //成都站通过或者任意一关答错消耗一次游戏机会
    if(cityName=="cd" && isPassed){
      answerChance--;//剩余机会减一
      isPassedList[1] = parseInt(isPassedList[1]) + 1;//用掉一次机会
      totalChance++;//底站通过获得一次抽奖机会   
      remainChance++; //底站通过剩余抽奖机会也会增加    
    }else if(!isPassed){
      answerChance--;//剩余机会减一
      isPassedList[1] = parseInt(isPassedList[1]) + 1;//用掉一次机会
    }else{
      isPassedList[1]=parseInt(isPassedList[1]);
    }   
    isPassedList.push({ cityName: cityName, isPassed: isPassed });
  }
  if (isPassed == true) {//答对的情况下
    CT.$("correct").style.visibility = "visible";
    actiObj.setUserDataList(JSON.stringify(isPassedList), function () {
      clearTimeout(showInter);
      showInter = setTimeout(function () {
        if(cityName=="cd"){//成都站表示通关成功，获得抽奖机会
          CT.$("luckImg").style.visibility = "visible";
          CT.$("correct").style.visibility = "hidden";
          actiObj.changeFocus("hands_x0_y0_goToLucky_");
        }else{//不是底站代表答题成功
			// if(actiUserId=="123"){
				if(isOrder==0){
					CT.$("nextLevel").style.visibility = "visible";
					CT.$("correct").style.visibility = "hidden";
					actiObj.changeFocus("hands_x0_y0_nextLevelFocus_");
				}else{
					CT.$("luckImg").style.visibility = "visible";
					CT.$("correct").style.visibility = "hidden";
					actiObj.changeFocus("hands_x0_y0_goToLucky_");
				} 
			// }else{
			// 	CT.$("nextLevel").style.visibility = "visible";
			// 	CT.$("correct").style.visibility = "hidden";
			// 	actiObj.changeFocus("hands_x0_y0_nextLevelFocus_");
			// }
        }        
        canClick = true;
      }, 500);
    });
  } else {//答错的情况下
    CT.$("error").style.visibility = "visible";
    actiObj.setUserDataList(JSON.stringify(isPassedList), function () {
      clearTimeout(showInter);
      showInter = setTimeout(function () {
        if (answerChance <= 0 && isOrder == "0") {//判断当前为已订购用户且已用完答题机会,弹出机会用完弹窗
          CT.$("noChanceImg").style.visibility = "visible";
          CT.$("error").style.visibility = "hidden";
          actiObj.changeFocus("hands_x0_y0_noChance_");
        } else {//未订购用户、已订购且闯关机会未用完用户提示再次游戏
			// if(actiUserId=="123"){
				if(isOrder==0){
					CT.$("gameAgainImg").style.visibility = "visible";
					  CT.$("error").style.visibility = "hidden";
					  actiObj.changeFocus("hands_x0_y0_failAndAgain_");
				}else{					
				   orderJs.columnToOrderPage("actiCloudTour");
				   setTimeout(function(){
					  window.location.href=document.referrer;
				   },1000);
				}
			// }else{
			// 	CT.$("gameAgainImg").style.visibility = "visible";
			// 	  CT.$("error").style.visibility = "hidden";
			// 	  actiObj.changeFocus("hands_x0_y0_failAndAgain_");
			// }          
        }
        canClick = true;
      }, 500);
    });
  }
}
// 选项点击事件
function chooseAnswer(index) {
	orderJs.columnGetAuth(function (data) {
		if (data == 0) {
			isOrder = 0;
		  } else {
			isOrder = 1;
		  }
		  if (canClick) {
			canClick = false;
			var cityName = getQueryString("cityName");
			var currentQuestionSrc = randomQuestion.src;
			var currentQuestionAnswer;
			for (var i = 0; i < questionList.length; i++) {
			  if (currentQuestionSrc.indexOf(questionList[i].src.substr(questionList[i].src.length-7)) > -1) {
				currentQuestionAnswer = questionList[i].answerIndex;
			  }
			}
			if (index === currentQuestionAnswer) {
			  setIsPassed(cityName, true);
			} else {
			  // 再来一次
			  setIsPassed(cityName, false);
			}
		}
	});  
}
//各弹框点击按钮
function confirmClick(confirmName) {
  switch (confirmName) {
    case "gameAgain"://挑战失败回到首页    
      backfunc();
      break;
    case "noChance"://无机会
      backfunc();
      break;
    case "goToLucky"://跳转抽奖页，携带对应信息参数
      window.location.href = "./luckyDraw.html?vTime=" + new Date().getTime() + "&fromgCity=" + cityName + "&isOrder=" + isOrder + "&remainChance=" + remainChance;
      break;
	case "nextLevel"://答题成功下一关
		backfunc(); 
		break;
    default:
      backfunc();
      break;
  }
}
// 返回
function backfunc() {
  window.location.href = "./cloudTour.html?vTime=" + new Date().getTime() + "&fromgCity=" + cityName+"&totalChance="+totalChance;
}
