function Scenario(wrapper) {
	this.sievesMoveAni=null;														//骰子转动
    this.wrapper = document.querySelector("#"+wrapper);
    this.cursorImg = this.wrapper.querySelector("#cursorImg");                      //焦点图
    this.focusDiv = this.wrapper.querySelector("#focusDiv");                        //焦点按钮
    this.moveDis = [];                                                              //移动位置
    this.btnInfo = [];                                                              //焦点按钮信息
    this.list = [];
    this.listLength = 0;
    this.icon = this.wrapper.querySelector("#icon");                                //焦点按钮图标
    this.iconArr = this.icon.children;
    this.pop = this.wrapper.querySelector("#pop");                                  //弹框
    this.rule = this.pop.querySelector("#rule");                                    //规则弹框
    this.ruleArr = this.rule.children;
    this.ruleFlag = false;
    this.ruleTimer = null;
    this.prize = this.pop.querySelector("#prize");                                  //奖品兑换弹框
    this.prizeInfo = ["急速遥控汽车","儿童竞技版赛车","50元话费","5元话费"];
    this.prizeArr = this.prize.querySelectorAll("s");
    this.prizeFocus = 0;
    this.prizeFlag = false;
    this.exchangeList = this.pop.querySelector("#exchangeList");                    //兑换记录弹框
    this.exchangeFlag = false;
    this.exchangeTimer = null;
    this.exchangeNum = 0;
    this.phoneFlag = false;
    this.openPop = this.pop.querySelector("#openPop");                              //结果弹框
    this.openInfo = this.openPop.children[0];
    this.coin = 0;                                                                  //车币
    this.sievesMove = this.wrapper.querySelector("#sievesMove");                    //骰子的盒子
    this.sieves = this.sievesMove.children[0];                                      //骰子
    this.sievesFlag = true;
    this.car = this.wrapper.querySelector("#car");                                  //车
    this.treasure = this.wrapper.querySelector("#treasure");                        //宝箱的盒子
    this.treasureArr = this.treasure.children;                                      //宝箱
    this.isTreasure = [1,1,1,1,1];                                                  //宝箱是否存在
    this.treasureNum = 0;                                                           //当前已经获取的宝箱
    this.prevNum = 0;                                                               //移动前车的位置
    this.carFlag = true;
    this.carMoveFlag = true;
    this.currentNum = 0;                                                            //当前车的位置
    this.sievesNum = 0;                                                             //记录这骰子的步数
	this.carTimer = null;
	this.index = 0;
    this.init();
}
Scenario.prototype = {
    constructor: Scenario,
    init: function () {
    	//设置宝箱
        this.getInfo();
        var _this = this;
        ajax.init({
            url:"./others/info.json?v=2019061401",
            method:"get",
            async:"true",
            params:{},
            contentType: "json",
            success:function (data) {
                _this.buildInfo(data);
				//console.log(data);
            },
            fail:function () {

            }
        });
        //设置排行榜
        this.getList();
        //设置用户手机号码
        this.setPhone();
        //设置是否中奖信息
        this.getCurPrize();
    },
    //生成光标和button数组
    buildInfo: function (data) {
        this.moveDis = data.moveDis;
        this.btnInfo = data.btnInfo;
        var self = this;
        this.btnInfo.forEach(function (value) {
            self.setButtons(value);
        });
        this.focusBuild("main",this.btnInfo.length);
    },
    focusBuild: function (ele,num) {
        var str = "";
        var arr = [];
        for(var i=0;i<num;i++){
            arr.push("<div id='hands_x0_y0_"+ele+"Focus"+i+"_' class='focusNormal'>");
            arr.push("<img id='"+ele+"Focus"+i+"' src='./img/empty.png' style='visibility:hidden;'>");
            arr.push("</div>");
        }
        str = arr.join("");
        this.focusDiv.innerHTML += str;
        focusInit();
        var start = getFocusModel6("hands_x0_y0_mainFocus0_");
        start.defaultFocus();
    },
    setButtons: function (arr) {
        buttons.push({
            id: arr[0],
            clickHandler:"javascript:"+arr[1],
            otherFocusEvent:"javascript:"+arr[2],
            left:arr[3],
            right:arr[4],
            up:arr[5],
            down:arr[6],
            focusType:7
        })
    },
    //获取参数
    getInfo: function () {
        var _this = this;
        InterfaceInfo.getUserInfo(userId,activityId,function (data) {
        	var date = new Date().getDate();
        	if(data.resultMsg == "success"){
        		var str = data.list[0].user_acti_data;
        		var coin = InterfaceInfo.getNum(str,6);
        		_this.coin = coin;
	        	_this.wrapper.setAttribute("data-info",_this.coin);
        		if(InterfaceInfo.getNum(str,0) != date){
	                InterfaceInfo.setUserInfo(userId,activityId,date+"_1_1_1_1_1_"+coin,function (data) {
	                    //console.log("再次设置"+date+"_1_1_1_1_1_"+coin);
	                     _this.setTreasure();
	                });
        		}else {
					for(var i=0;i<_this.isTreasure.length;i++){
	                	_this.isTreasure[i] = InterfaceInfo.getNum(str,i+1);
	            	}
	            	 _this.setTreasure();	
        		}   
        	}else {
		         InterfaceInfo.setUserInfo(userId,activityId,date+"_1_1_1_1_1_0",function (data) {
		                 _this.setTreasure();
		         });
        	}           
        });
    },
    //获取排行榜信息
    getList: function () {
        var _this = this;
        InterfaceInfo.getTotalPrize(activityId,pageNo,pageSize,function (data) {
        	if(data.resultMsg!= "fail"){
        		_this.list = data.list;
             	_this.setList();
        	}
        });
    },
    setList: function () {
        var str = "";
        var arr = [];
        if(this.list.length == 0)return;
        this.list.forEach(function (obj,index) {
            if(obj.USERID && obj.USERID.length > 10 && obj.USERID.length<17){
                var phone = obj.USERID.replace(/^(\d{4})\d{4}(\d+)/,"$1****$2");
                var time = new Date(obj.CREATE_TIME);
                var year = time.getFullYear();
                var month = (time.getMonth()+1)>9?(time.getMonth()+1):"0"+(time.getMonth()+1);
                var day = time.getDate()>9?time.getDate():"0"+time.getDate();
                arr.push("<li>");
                arr.push("<span>"+phone+"</span>");
                arr.push("<span>"+obj.PRIZE_CNAME+"</span>");
                arr.push("<span>"+year+"-"+month+"-"+day+"</span>");
                arr.push("</li>");
            }
        });
        str = arr.join("");
        this.exchangeList.children[0].innerHTML = str;
        this.listLength = this.exchangeList.children[0].children.length;
    },
    //设置宝箱
    setTreasure: function(){
    	var _this = this;
    	var num = 0;
        this.isTreasure.forEach(function (val,index) {
        	num += val;
        	if(val != 0){
		        _this.addClass(_this.treasureArr[index],"normal");
	        }
        });
	    this.treasureNum = 5-num;
    },
    removeClass: function (arr) {
        var _this = this;
        Array.prototype.slice.call(arr).forEach(function (ele) {
            _this.addClass(ele,"");
        });
    },
	//转动骰子
    jumpUrl: function () {
    	var _this = this;
    	var resutlt = CT.getCookie("alredayOrder") ;
    	//resutlt = 1;
		if(resutlt == 1){
			_this.carOrder();
		}else {
			orderJs.columnGetAuth(function(data){
				if(data == "1"){
					orderJs.columnToOrderPage();
				}else{
					CT.setCookie("alredayOrder",1);
					_this.carOrder();	
				}
		      });
        }
    },
    carOrder: function () {
    	if(!this.carFlag || !this.sievesFlag){return}
        this.sievesFlag = false;
        this.addClass(this.sievesMove,"active");

		var _this = this;
		var sievesMoveImgs=document.getElementById("sievesMove").getElementsByTagName("img");
		var sievesMove=1;
		_this.sievesMoveAni=setInterval(function() {
		if(sievesMove>=7){
			sievesMove=1;
		}else{
			sievesMoveImgs[0].src="./img/sieves/"+sievesMove+".png";
		}
		sievesMove++;
		},200)

        this.sievesNum  = this.getRandom();
        this.currentNum = this.prevNum + this.sievesNum;
        if(this.currentNum > this.moveDis.length){this.currentNum = this.currentNum%this.moveDis.length;}
        this.changeSrc(this.sievesNum);
        setTimeout(function () {
            this.addClass(this.sievesMove,"");
            this.setCar();
			clearInterval(_this.sievesMoveAni);
        }.bind(this),1500);
    },
	//移动车
    setCar:function () {
        var index = 0;
        if(this.carTimer != null){clearInterval(this.carTimer);}
        this.carTimer = setInterval(function () {
            this.carFlag = false;
            if(this.carMoveFlag){
                var num = this.prevNum + index;
                if(num > this.moveDis.length-1){num = num%this.moveDis.length;}
                var obj = this.moveDis[num];
                this.changeStyle(obj);
                this.carMoveFlag = false;
                index++;
            }
            if(index > this.sievesNum-1){
                this.prevNum += this.sievesNum;
                if(this.prevNum > this.moveDis.length){this.prevNum = this.prevNum%this.moveDis.length;}
                this.carFlag = true;
                this.sievesFlag = true;
                clearInterval(this.carTimer);
            }
         }.bind(this),1000);
    },
    changeStyle:function (obj) {
        this.car.className = obj.name;
        if(obj.category == "square" && this.isTreasure[obj.num] ){
            this.treasureArr[obj.num].classList.add("through");
            setTimeout(function () {
                this.treasureArr[obj.num].classList.remove("through");
            }.bind(this),1000);
        }
        this.carMove(obj);
    },
	carMove: function (obj) {
		var print1=document.getElementById("print1");
		var print2=document.getElementById("print2");
		var print3=document.getElementById("print3");
		var print4=document.getElementById("print4");
		var print5=document.getElementById("print5");
		var print6=document.getElementById("print6");
		var print7=document.getElementById("print7");
		var print8=document.getElementById("print8");
		var print9=document.getElementById("print9");
		var print10=document.getElementById("print10");
		var print11=document.getElementById("print11");
		var print12=document.getElementById("print12");
		var print13=document.getElementById("print13");
		var print14=document.getElementById("print14");
		var _this = this;
		var left = this.cssTransform(this.car,"translateX");
		print1.innerHTML="282行left值："+left;
		var top = this.cssTransform(this.car,"translateY");
		print2.innerHTML="284行top值："+top;
		var leftTarget = parseInt(obj.left) - this.cssTransform(this.car,"translateX");
		print3.innerHTML="286行leftTarget值："+leftTarget;
		var topTarget =parseInt(obj.top) - this.cssTransform(this.car,"translateY");
		print4.innerHTML="288行topTarget值："+topTarget;
		var radio = Math.abs(leftTarget/topTarget).toFixed(2)==0?0.1:Math.abs(leftTarget/topTarget).toFixed(2);
		var speedLeft = leftTarget > 0 ? 5 : -5;
		var speedTop =  topTarget > 0 ? 5/radio : -5/radio;
		var timer = requestAnimationFrame(function game() {			
			left += speedLeft;
			top += speedTop;
			print5.innerHTML="295行timer函数left："+left;
			print6.innerHTML="296行timer函数top："+top;
			_this.cssTransform(_this.car,"translateX",left);
			_this.cssTransform(_this.car,"translateY",top);
			if(speedLeft < 0 && left < parseInt(obj.left) || speedLeft > 0 && left > parseInt(obj.left)){
				_this.carMoveFlag = true;
				_this.cssTransform(_this.car,"translateX",parseInt(obj.left));
				_this.cssTransform(_this.car,"translateY",parseInt(obj.top));
				cancelAnimationFrame(timer);
				_this.isPrize(_this.currentNum);
			}else {
				requestAnimationFrame(game);
			}
		});
	},
    isPrize: function (n) {
        var obj = this.moveDis[n-1];
        if(obj.category == "square" && this.isTreasure[obj.num] && this.prevNum == this.currentNum){
            //让宝箱消失、改变宝箱数组、显示宝箱动画
            this.addClass(this.treasureArr[obj.num],"active");
	        this.isTreasure[obj.num] = 0;
	        this.changeInfo(obj.num+1,0);
	        setTimeout(function () {
               this.showGif(obj);
            }.bind(this),600);
        }
    },
    //改变接口信息
    changeInfo: function (num,n) {
        var _this = this;
        InterfaceInfo.getUserInfo(userId,activityId,function (data) {
            var str = data.list[0].user_acti_data;
            var arr = str.split("_");
            arr[num] = n;
            var newStr =arr.join("_");
            InterfaceInfo.setUserInfo(userId,activityId,newStr,function (data) {

            });
        });
    },
	showGif: function (obj) {
		//this.addClass(this.treasure,obj.type);		
		var num = 0;
		//判断是否还有开宝箱的机会
		if(this.treasureNum < 3){
			if(obj.type =="activeRare"){
				num = Math.floor(Math.random()*10+10);
			}else {
				num = Math.floor(Math.random()*5+1);
			}
			this.coin += num;
			this.openInfo.innerHTML = "恭喜你获得"+num+"车币";
			this.treasureNum++;
			this.changeInfo(6,this.coin);
		}else {
			this.openInfo.innerHTML = "机会用完，不可获得车币";
		}
		setTimeout(function () {
			this.showResult();
		}.bind(this),1500);
	},
	showResult: function () {
        this.prizeFocus = 0;
        this.prizeFlag = false;
		this.addClass(this.treasure,"");
		this.addClass(this.pop,"active");
		this.addClass(this.openPop,"active");
		this.changeSrc(6);
		this.changeFocus("main",5);
		this.wrapper.setAttribute("data-info",this.coin);

	},
    changeSrc: function (num) {
        this.sieves.style.backgroundImage = "url(./img/sieves/"+num+".png)";
    },
    getRandom: function () {
        return Math.floor(Math.random()*6+1);
    },
    addClass: function (ele,name) {
        ele.className = name;
    },
    cssTransform: function (ele,attr,value) {
		print7.innerHTML="377行ele:"+ele;
		print8.innerHTML="378行attr:"+attr;
		print9.innerHTML="379行value:"+value;
        if(!ele.transform){
            ele.transform = {};
        }
        if(arguments.length>2){
            ele.transform[attr] = value;
			print10.innerHTML="385行ele.transform[attr]:"+ele.transform[attr];
            var sVal = "";
			print11.innerHTML="387行ele.transform"+ele.transform;
            for(var key in ele.transform){
                switch(key){
                    case "translateY":
                    case "translateZ":
                    case "translateX":
                        sVal += key+"("+ele.transform[key]+"px)";
						print12.innerHTML="394行sVal:"+sVal;
                        break;
                    case "rotateY":
                        sVal += key+"("+ele.transform[key]+"deg)";
						print13.innerHTML="398行sVal:"+sVal;
                        break;
                }
            }
			//ele.style.cssText = "transform: " + sVal + ";-webkit-transform:" + sVal + ";-moz-transform:"+ sVal + ";-o-transform:" + sVal +";";
            ele.style.WebkitTransform = ele.style.transform = sVal;
        }else {
            value = ele.transform[attr];
			print14.innerHTML="406行value值："+value;
            if(value == undefined){
                value = 0;
            }
            return value;
        }
    },
    cursorEffect:function (name,n,num) {
        this.removeClass(this.iconArr);
        this.removeClass(this.prizeArr);
        this.addClass(this.sieves,"");
        if(arguments.length > 2){
            this.addClass(this[n][num],"active");
        }else if(arguments.length>1) {
            this.addClass(this.icon,"active");
            this.addClass(this.iconArr[n],"active");
        }else if(name == "sieves"){
            this.addClass(this.sieves,"active");
        }
        if(name == "exchangePhone"){this.phoneFlag = true;}
        this.addClass(this.cursorImg,name);
    },
    showPop: function (obj,n) {
        //如果是规则弹框，开启定时器
        if(obj == "rule"){
            this.ruleFlag = true;
            this.ruleSet();
        }else if(obj == "exchange"){
            this.setPhone();
            this.getCurPrize();
            this.exchangeFlag = true;
            var length = Math.floor(this.listLength/5);
            this.exchangeMove(this.exchangeList,length,2000,3000);
        }else if(obj == "prize"){
            this.prizeFlag = true;
        }
    	this.addClass(this.pop,"active");
    	this.addClass(document.querySelector("#"+obj),"active");
    	this.changeFocus("main",n);
    },
    hidePop: function (obj,n) {
        if(obj == "rule") {
            this.removeClass(this.ruleArr);
            this.ruleFlag = false;
            clearInterval(this.ruleTimer);
        }else if(obj == "exchange"){
            this.exchangeFlag = false;
            clearTimeout(this.exchangeTimer);
        }
        this.addClass(document.querySelector("#"+obj),"");
        this.addClass(this.pop,"");
        this.changeFocus("main",n);
    },
    setPhone: function () {
        InterfaceInfo.gainOwnPhone(userId,function (data) {
            if(data.userPhone != null && data.userPhone.length==11){
                document.getElementById("phoneText").innerHTML = data.userPhone;
                document.getElementById("phoneInfo").innerHTML="恭喜你，手机号码输入成功";
            }
        });
    },
    hideTips: function (obj) {
          this.changeFocus("main",this.prizeFocus);
          if(!this.prizeFlag){
              this.addClass(this.pop,"");
          }
          this.addClass(this.openPop,"");
            //this.prizeFlag = false;
    },
    getCurPrize: function () {
        var _this = this;
        InterfaceInfo.getUserPrize (userId,activityId,function (data) {
            if(data.resultMsg == "success"){
				if(data.list.PRIZE_CNAME!=undefined){
				document.getElementById("currentUser").innerHTML = "恭喜你，成功兑换"+data.list.PRIZE_CNAME+"!";
				}               
            }else {
                document.getElementById("currentUser").innerHTML = "您还未兑换，快点去兑换奖品吧！";
            }
        });
    },
    getPrize: function (n) {
        this.prizeFocus = n-7;
        var coin = this.coin;
        //coin = 100;
        this.prizeFocus = n;
        if(n==7&&coin < 700 || n==8&&coin < 500 || n==9&&coin < 300){
            this.exchangeResult("车币不够，兑换失败，再接再厉哟~")
        }else {
            this.jugglePrize(n)
        }
    },
    jugglePrize: function (n) {
        //判断是否中奖过
        var _this = this;
        InterfaceInfo.getUserPrize (userId,activityId,function (data) {
            if(data.resultMsg == "success"){
                _this.exchangeResult("您已兑过奖，不可重复兑换哟~");
            }else {
                _this.gainPrize(n);
            }
        });
    },
    gainPrize: function (n) {
		var amount0 = document.getElementById("amount0");
		var amount1 = document.getElementById("amount1");
		var amount2 = document.getElementById("amount2");		
		var amounts = [amount0, amount1, amount2];
        var _this = this;
        var num = n-7+ prizeId;
        InterfaceInfo.getPrizeNum(activityId,pageNo,pageSize,function (data) {
            var prizeList = data.list;
			var date = new Date().getDate();
            if(n-7==0 && prizeList[n-7].prize_num != 0 || n-7==1 && prizeList[n-7].prize_num != 0 || n-7==2 && prizeList[n-7].prize_num != 0 || n-7==3 && prizeList[n-7].prize_num != 0){                
                InterfaceInfo.loadUserPrize(userId,activityId,num,function (data) {	
					if(data.resultMsg=="success"){
					_this.exchangeResult("恭喜你，兑换成功，请提交正确的手机号");
					_this.coin-=parseInt(amounts[n-7].innerHTML);
					var coin=_this.coin;
					_this.wrapper.setAttribute("data-info",_this.coin);
					InterfaceInfo.setUserInfo(userId,activityId,date+"_1_1_1_1_1_"+coin,function (data) {
	                    //console.log("再次设置"+date+"_1_1_1_1_1_"+coin);
	                     _this.setTreasure();
	                });
					}
				});
            }else {
                _this.exchangeResult("很抱歉，奖品已兑完。下次早点来哟~");
            }
        });
    },
    exchangeResult: function (str) {
        this.openInfo.innerHTML = str;
        this.addClass(this.openPop,"active");
        this.changeFocus("main",5);
    },
    upLoadPhone: function () {
        var phoneText = document.getElementById("phoneText").innerHTML;
        if(phoneText.length<11){
            document.getElementById("phoneInfo").innerHTML="手机号码输入不正确，请重新输入";
        }else {
            document.getElementById("phoneInfo").innerHTML="恭喜您，手机号码输入成功";
            InterfaceInfo.upLoadPhone(userId,phoneText);
        }
    },
    clearPhone: function () {
        phoneNum = "";
        document.getElementById("phoneText").innerHTML = "";       
    },
    ruleSet: function () {
        var _this = this;
        if(this.ruleTimer != null)clearInterval(this.ruleTimer);
        var num = 0;
        var index = 0;
        this.ruleTimer = setInterval(function () {
            if(!this.ruleFlag){
                return;
            }
            num ++;
            if(num% 5 == 0){
                this.removeClass(this.ruleArr);
                this.addClass(this.ruleArr[index],"active");
                index++;
                if(index>3) index =0;
            }
        }.bind(this),1000);
    },
	changeFocus: function (dir,n) {
		curFocus.defaultBlur();
		curFocus = getFocusModel6("hands_x0_y0_"+dir+"Focus"+n+"_");
		curFocus.defaultFocus();
	},	
    exchangeMove: function (ele,scrollNum,scrollTime,stopTime) {
        var ul = ele.children[0];
        if(!this.exchangeFlag || ul.children.length < 10) return;
        if(this.exchangeTimer != null){clearTimeout(this.exchangeTimer);}
        var rect = ul.getBoundingClientRect();
        var maxHeight = rect.bottom - rect.top;
        var cloneUl;
        if(this.exchangeNum == 0){
            cloneUl = ul.cloneNode(true);
            cloneUl.style.top = maxHeight + "px";
            ele.appendChild(cloneUl);
        }else {
            cloneUl = ele.children[1];
        }
        this.exchangeNum++;
        var oneDistance = Math.floor(maxHeight / scrollNum);
        var oneTime = oneDistance / scrollTime;
        var _this = this;
        function scrollView() {
            var oldTop = ("" == ul.style.top)?0:parseInt(ul.style.top);
            if(oldTop < -maxHeight){
                oldTop = 0;
            }
            ul.style.top = (oldTop-1)+"px";
            cloneUl.style.top = (maxHeight + oldTop -1)+"px";
            if(oldTop % oneDistance == 0){
                _this.exchangeTimer = setTimeout(scrollView,stopTime);
            }else {
                _this.exchangeTimer = setTimeout(scrollView,oneTime);
            }
        }
        this.exchangeTimer = setTimeout(scrollView,scrollTime);
    }
};
var eatChicken = new Scenario("wrapper");

function backfunc() {	
	if(eatChicken.ruleFlag == true){		
		eatChicken.hidePop("rule",6);	
		eatChicken.changeFocus("main",1);
		eatChicken.ruleFlag = false;
	}else if(eatChicken.exchangeFlag == true){		
		eatChicken.hidePop("exchange",15);	
		eatChicken.changeFocus("main",3);
		eatChicken.exchangeFlag = false;
	}else if(eatChicken.prizeFlag == true){		
		eatChicken.hidePop("prize",11);			
		eatChicken.changeFocus("main",2);
		eatChicken.prizeFlag = false;
	}else{
		backPortalMainPage();
		CT.delCookie("alredayOrder");
	}    
}
setLoggerInfo.uploadLogPage(); 