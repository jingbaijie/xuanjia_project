/*
*获取游戏次数getChance、存储游戏次数setChance
*获取总计分getUserCredit，存储总计分setUserCredit
*上传当前时间userdata
*/

// 构造函数
function sharpShooter() {
    this.initFunc(); //初始化函数
    this.button = {};
    this.targetDom; //当前的要打的靶
    this.boomDom;//当前靶对应的爆炸图片
    this.boomArr = [];//当前射击的靶位置数组
    this.circleRandom = Math.floor(Math.random() * 5);//[0,4]随机整数,环数随机
    this.boomRandom = Math.floor(Math.random() * 3); //[0,2]随机整数，中枪位置随机
    this.isTuoB = false;//默认没有脱靶
    this.creditNum = 0;//每次打靶得分
    this.totalCredit = 0;//打靶总计分
	this.chanceNum = 0;//游戏机会
	this.thisDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当前时间
    this.boomLeft = [
        [{ //中心环
            "left": "185px",
            "top": "192px"
        }, { //脱靶
            "left": "120px",
            "top": "275px",
            "isTuoB": true
        }, { //脱靶
            "left": "190px",
            "top": "300px",
            "isTuoB": true
        }],
        [{
            "left": "168px",
            "top": "192px"
        }, {
            "left": "205px",
            "top": "192px"
        }, {
            "left": "185px",
            "top": "218px"
        }],
        [{
            "left": "220px",
            "top": "192px"
        }, {
            "left": "200px",
            "top": "236px"
        }, {
            "left": "168px",
            "top": "155px"
        }],
        [{
            "left": "232px",
            "top": "192px"
        }, {
            "left": "186px",
            "top": "258px"
        }, {
            "left": "142px",
            "top": "160px"
        }],
        [{
            "left": "250px",
            "top": "192px"
        }, {
            "left": "160px",
            "top": "270px"
        }, {
            "left": "125px",
            "top": "150px"
        }]
    ];
    this.boomMiddle = [
        [{ //中心环
            "left": "620px",
            "top": "120px"
        }, { //脱靶
            "left": "590px",
            "top": "170px",
            "isTuoB": true
        }, {//脱靶
            "left": "656px",
            "top": "170px",
            "isTuoB": true
        }],
        [{
            "left": "632px",
            "top": "120px"
        }, {
            "left": "620px",
            "top": "135px"
        }, {//脱靶
            "left": "620px",
            "top": "180px",
            "isTuoB": true
        }],
        [{
            "left": "638px",
            "top": "120px"
        }, {
            "left": "605px",
            "top": "120px"
        }, {//脱靶
            "left": "655px",
            "top": "165px",
            "isTuoB": true
        }],
        [{//脱靶
            "left": "665px",
            "top": "120px",
            "isTuoB": true
        }, {
            "left": "605px",
            "top": "150px"
        }, {
            "left": "605px",
            "top": "88px"
        }],
        [{
            "left": "655px",
            "top": "120px"
        }, {
            "left": "590px",
            "top": "145px"
        }, {
            "left": "590px",
            "top": "88px"
        }]
    ];
    this.boomRight = [
        [{ //中心环
            "left": "948px",
            "top": "198px"
        }, { //脱靶
            "left": "886px",
            "top": "270px",
            "isTuoB": true
        }, {//脱靶
            "left": "1000px",
            "top": "270px",
            "isTuoB": true
        }],
        [{
            "left": "960px",
            "top": "198px"
        }, {
            "left": "932px",
            "top": "210px"
        }, {//脱靶
            "left": "948px",
            "top": "280px",
            "isTuoB": true
        }],
        [{
            "left": "970px",
            "top": "198px"
        }, {
            "left": "950px",
            "top": "165px"
        }, {//脱靶
            "left": "890px",
            "top": "145px",
            "isTuoB": true
        }],
        [{
            "left": "982px",
            "top": "198px"
        }, {
            "left": "910px",
            "top": "198px"
        }, {
            "left": "925px",
            "top": "240px"
        }],
        [{
            "left": "995px",
            "top": "198px"
        }, {
            "left": "945px",
            "top": "130px"
        }, {
            "left": "900px",
            "top": "215px"
        }]
    ];

}
// 原型
sharpShooter.prototype = {
    constructor: sharpShooter,
    initFunc: function () {
		var _this = this;
        // 创建buttons数组       
        for (var i = 0; i < 6; i++) {
            this.button = {
                id: "hands_x0_y0_shootFocus" + i + "_",
                clickHandler: "javascript:sharpShooterGame.shootFunc(" + i + ")",
                left: "hands_x0_y0_shootFocus" + (i - 1) + "_",
                right: "hands_x0_y0_shootFocus" + (i + 1) + "_",
                up: "disable",
                down: "disable",
                focusType: 7
            };
            if (i == 0) {
                this.button.left = "disable";
            } else if (i == 2) {
                this.button.right = "disable";
            } else if (i == 3) {
                this.button.clickHandler = "javascript:sharpShooterGame.confirmFunc()";
				this.button.right = "disable";
				this.button.left = "disable";
            }else if(i==4){
				this.button.clickHandler = "javascript:sharpShooterGame.seeVideoFunc()";
				this.button.right = "disable";
				this.button.left = "disable";
				this.button.up = "hands_x0_y0_shootFocus5_";
			}else if(i==5){
				this.button.clickHandler = "javascript:backfunc()";
				this.button.right = "disable";
				this.button.left = "disable";
				this.button.down = "hands_x0_y0_shootFocus4_";
			}
            buttons.push(this.button);
        }

		//获取游戏机会和计分
		actiObj.getChance(function(res){
			_this.chanceNum = res.activityChance;
			actiObj.getUserCredit(function(res){
				if(res.resultMsg=="success"){
					_this.totalCredit = res.creditNum;
				}else{
					_this.totalCredit = 0;
				}
				CT.$("totalScore").innerHTML = _this.totalCredit;
			});
		});		
        // 焦点初始化
        focusInit();
        curFocus = getFocusModel6("hands_x0_y0_shootFocus1_");
        curFocus.defaultFocus();
    },
    // 点击射击执行方法
    shootFunc: function (ii) {
        var _this = this;
        // 选择左边的靶
        if (ii == 0) {
            this.targetDom = CT.$("targetLeft");
            this.boomDom = CT.$("boomLeft");
            this.boomArr = this.boomLeft;
            // 选择中间的靶
        } else if (ii == 1) {
            this.targetDom = CT.$("targetMiddle");
            this.boomDom = CT.$("boomMiddle");
            this.boomArr = this.boomMiddle;
            // 选择右边的靶
        } else if (ii == 2) {
            this.targetDom = CT.$("targetRight");
            this.boomDom = CT.$("boomRight");
            this.boomArr = this.boomRight;
        }
        this.targetDom.src = "./img/game/" + ii + "/1.png";
        this.boomDom.style.visibility = "visible";
        // 打中位置随机:随机环数的随机位置
        this.boomDom.style.left = this.boomArr[this.circleRandom][this.boomRandom].left;
        this.boomDom.style.top = this.boomArr[this.circleRandom][this.boomRandom].top;
        this.isTuoB = this.boomArr[this.circleRandom][this.boomRandom].isTuoB;
        // 100ms之后恢复到初始位置
        setTimeout(function () {
            _this.targetDom.src = "./img/game/" + ii + "/0.png";
            _this.boomDom.style.visibility = "hidden";
            _this.boomDom.style.left = "0px";
            _this.boomDom.style.top = "0px";
            //禁用射击的三个焦点
            PAGE.focusArr["hands_x0_y0_shootFocus0_"].focusmodel.enFocus = false;
            PAGE.focusArr["hands_x0_y0_shootFocus1_"].focusmodel.enFocus = false;
            PAGE.focusArr["hands_x0_y0_shootFocus2_"].focusmodel.enFocus = false;
        }, 100);
        // 800ms之后显示计分弹窗
        setTimeout(function () {
			//上传游戏机会
			actiObj.setChance();
			_this.chanceNum++;				
			CT.$("tanchuang").style.visibility = "visible";						         			
            // 显示环数、显示计分
            _this.showCircle();
			//切换焦点
			actiObj.changeFocus("hands_x0_y0_shootFocus3_");
        }, 800);
    },
    showCircle: function () {		
        // 数组中isTuoB=true,则表示脱靶，显示没有击中弹窗；否则显示恭喜弹窗，判断环数。
        if (this.isTuoB && this.isTuoB == true) {
            CT.$("nozhong").style.visibility = "visible";
            CT.$("circleNum").innerHTML = "";
            CT.$("scoreNum").innerHTML = "";
        } else {
            CT.$("zhong").style.visibility = "visible";
            switch (this.circleRandom) {
                case 0:
                    CT.$("circleNum").innerHTML = "10";
                    CT.$("scoreNum").innerHTML = "10";
                    break;
                case 1:
                    CT.$("circleNum").innerHTML = "9";
                    CT.$("scoreNum").innerHTML = "8";
                    break;
                case 2:
                    CT.$("circleNum").innerHTML = "8";
                    CT.$("scoreNum").innerHTML = "6";
                    break;
                case 3:
                    CT.$("circleNum").innerHTML = "7";
                    CT.$("scoreNum").innerHTML = "4";
                    break;
                case 4:
                    CT.$("circleNum").innerHTML = "6";
                    CT.$("scoreNum").innerHTML = "2";
                    break;
                default:
                    break;
            }
            this.creditNum = parseInt(CT.$("scoreNum").innerHTML);
            this.totalCredit += this.creditNum;
			//上传总计分
			actiObj.setUserCredit(this.totalCredit);
            CT.$("totalScore").innerHTML = this.totalCredit;
        }		
    },
    confirmFunc: function () {
		//达到三次机会，先显示分数弹窗，点击确定再弹出去看视频弹窗，否则点击确认直接回首页
		if(this.chanceNum==3){			
			CT.$("seeVideoTip").style.visibility="visible";
			actiObj.changeFocus("hands_x0_y0_shootFocus4_");
			CT.$("tanchuang").style.visibility = "hidden";
			CT.$("zhong").style.visibility = "hidden";
			CT.$("nozhong").style.visibility = "hidden";
		}else{
			window.location.href = "actiSharpshooterMain.html";	
		}       
    },
	seeVideoFunc:function(){
		//上传当前时间		
		actiObj.setUserDataList(this.thisDate);
		//800ms后跳转视频
		setTimeout(function(){
			CT.goPage();
			getAnterUrl("videoDetail","?action=videoDetail&cartoonId=823","hands_x0_y0_shootFocus4_");
		},800);		
	}
}
// 实例
var sharpShooterGame = new sharpShooter();

// 返回
function backfunc() {
    window.location.href = "actiSharpshooterMain.html";
} 