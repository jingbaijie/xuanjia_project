<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel = "stylesheet" href = "./HD/column/gameMiner/css/gameMiner.css">
    <meta name="page-view-size" content="1280*720"  />
    <title>勤劳的小矿工</title>
</head>
<body>
    <div id = "mainContent" class = "posDiv withScreen">
        <!--    背景图    -->
        <div class = "posDiv withScreen mainBg"></div>

        <!--    空焦点，触发用户按键操作    -->
        <div id = "hands_x0_y0_emptyFocus_" class = "posDiv" style = "width: 2px;height: 2px;top: 50px;left: 50px;">
            <img id = "emptyFocus" src = "./HD/column/gameMiner/images/empty.png" style = "width: 2px;height: 2px;visibility: hidden;" alt="">
        </div>
        <!--    金子收容器    -->
        <div id = "goldDom" class = "posDiv" style = "width: 800px;height: 685px;top: 0;left: 0;">

        </div>

        <!--    矿工    -->
        <div id = "miner" class = "posDiv" style = "top: 75px;left: 50px;">
        <!--    绳索        -->
            <div id = "rope" class = "posDiv" style = "width: 9px;height: 65px;top: 178px;left: 82px;">
                <!--      夹子        -->
                <img id = "clip" src = "./HD/column/gameMiner/images/clip0.png" class = "posDiv" style = "width: 119px;height: 86px;top: 50px;left: -52px;" alt="">
            </div>
        </div>

        <!--    弹窗    -->
        <div id = "conFirm" class = "posDiv" style = "visibility: hidden;">
            <img id = "conBg" src = "./HD/column/gameMiner/images/empty.png" style = "width: 1280px;height: 720px;" alt="">
            <!--     文字提示       -->
            <div id = "conText">
            </div>
            <!--     弹框焦点      -->
            <div id = "hands_x0_y0_conFocus0_" style = "width: 142px;height: 75px;position: absolute;top: 436px;left: 470px;">
                <img id = "conFocus0" src = "./HD/column/gameMiner/images/confirmSelect.png" style = "width: 142px;height: 75px;visibility: hidden;" alt="">
            </div>
            <div id = "hands_x0_y0_conFocus1_" style = "width: 142px;height: 75px;position: absolute;top: 436px;left: 658px;">
                <img id = "conFocus1" src = "./HD/column/gameMiner/images/confirmSelect.png" style = "width: 142px;height: 75px;visibility: hidden;" alt="">
            </div>
            <div id = "hands_x0_y0_conFocus2_" style = "width: 142px;height: 75px;position: absolute;top: 436px;left: 570px;">
                <img id = "conFocus2" src = "./HD/column/gameMiner/images/confirmSelect.png" style = "width: 142px;height: 75px;visibility: hidden;" alt="">
            </div>
        </div>
    </div>
</body>
<script type="text/javascript" src="./HD/js/comm.js"></script>
<script type="text/javascript" src="./HD/js/common1_1.js"></script>
<script type="text/javascript" src="./HD/js/key1_3.js"></script>
<script type="text/javascript" src="./HD/js/logger.js"></script>
<script>
	//页面原始数据信息
	var OutJson = ${injson.outJson};
	try{
		//全国数据拉取埋点
		setLoggerInfo.pageInfoLog = OutJson;
	}catch(e){}
	var imgUrl = "${injson.IMG_BJ_INTERFACE_ADRESS}";
	var isOrder = "${result}";
	var isOrderUrl = "page.action?action=orderPage&userId=${injson.userId}";
    // 所有焦点
    var buttons = [
        {//空焦点，用于用户点击事件
            id: "hands_x0_y0_emptyFocus_",
            clickHandler: "javascript: minerGame.catchStone()",
            up: "disable",
            left: "disable",
            right: "disable",
            down: "disable",
            focusType: 7
        },{//弹窗焦点1，用于用户抓中IP后跳转对应IP内容
            id: "hands_x0_y0_conFocus0_",
            clickHandler: "javascript: minerGame.checkJump()",
            up: "disable",
            left: "disable",
            right: "hands_x0_y0_conFocus1_",
            down: "disable",
            focusType: 7
        },{//弹窗焦点二，用于隐藏弹框
            id: "hands_x0_y0_conFocus1_",
            clickHandler: "javascript: minerGame.hideConfirm()",
            up: "disable",
            left: "hands_x0_y0_conFocus0_",
            right: "disable",
            down: "disable",
            focusType: 7
        },{//弹窗焦点二，用于隐藏弹框
            id: "hands_x0_y0_conFocus2_",
            clickHandler: "javascript: minerGame.hideConfirm()",
            up: "disable",
            left: "disable",
            right: "disable",
            down: "disable",
            focusType: 7
        }
    ];

    function MinerObj(){
        this.miner = document.getElementById("miner");//矿工
        this.rope = document.getElementById("rope");//绳索
        this.clip = document.getElementById("clip");//夹子
        this.confirm = document.getElementById("conFirm");//弹窗
        this.conBg = document.getElementById("conBg");//弹窗
        this.conText = document.getElementById("conText");//弹窗
        this.stoneDom = document.getElementById("goldDom");//石头容器
        this.ropeHeight = parseInt(document.getElementById("rope").style.height);//绳子原本长度
        this.devideTop = 0;//爪子碰撞判断
        this.devideLeft = 0;//爪子碰撞判断
        this.devideRight = 0;//爪子碰撞判断
        this.imageSource = "./HD/column/gameMiner/images/";//图片地址
        //ip卡通石头对应的图片信息及跳转卡通ID
        this.ipCartoonImgArr = [
            {
                src: "IP/IP0.png",
                width: 104,
                height: 103,
                jumpId: null
            },
            {
                src: "IP/IP1.png",
                width: 93,
                height: 88
            },
            {
                src: "IP/IP2.png",
                width: 126,
                height: 125,
                jumpId: null
            },
            {
                src: "IP/IP4.png",
                width: 126,
                height: 125,
                jumpId: null
            },
            {
                src: "IP/diamon0.png",
                width: 43,
                height: 44,
                jumpId: null
            },
            {
                src: "IP/diamon1.png",
                width: 30,
                height: 30,
                jumpId: null
            }
            ];//卡通IP图
        //ip游戏石头对应的图片信息及跳转卡通ID
        this.ipGameImgArr = [
            {
                src: "IP/IP3.png",
                width: 126,
                height: 125,
                jumpId: null
            },
            {
                src: "IP/IP5.png",
                width: 98,
                height: 91,
                jumpId: null
            },
            {
                src: "IP/IP6.png",
                width: 104,
                height: 105,
                jumpId: null
            },
            {
                src: "IP/IP7.png",
                width: 126,
                height: 125,
                jumpId: null
            },
            {
                src: "IP/diamon0.png",
                width: 43,
                height: 44,
                jumpId: null
            },
            {
                src: "IP/diamon1.png",
                width: 30,
                height: 30,
                jumpId: null
            }
            ];//游戏IP图
        //石头对应的图片信息
        this.stoneImgArr = [
            {
                src: "IP/stone0.png",
                width: 65,
                height: 48,
                jumpId: null
            },
            {
                src: "IP/stone1.png",
                width: 56,
                height: 35,
                jumpId: null
            },
            {
                src: "IP/stone2.png",
                width: 68,
                height: 59,
                jumpId: null
            },
            {
                src: "IP/stone3.png",
                width: 111,
                height: 72,
                jumpId: null
            },
            {
                src: "IP/stone4.png",
                width: 60,
                height: 39,
                jumpId: null
            },
            {
                src: "IP/stone5.png",
                width: 50,
                height: 42,
                jumpId: null
            },
            {
                src: "IP/stone6.png",
                width: 79,
                height: 51,
                jumpId: null
            },
            {
                src: "IP/stone7.png",
                width: 107,
                height: 75,
                jumpId: null
            }
        ];//普通石头图
        //钻石对应的图片信息
        this.diamonImgArr = [
            {
                src: "IP/diamon0.png",
                width: 43,
                height: 44,
                jumpId: null
            },
            {
                src: "IP/diamon1.png",
                width: 30,
                height: 30,
                jumpId: null
            },
            {
                src: "IP/diamon0.png",
                width: 43,
                height: 44,
                jumpId: null
            },
            {
                src: "IP/diamon1.png",
                width: 30,
                height: 30,
                jumpId: null
            },
            {
                src: "IP/diamon0.png",
                width: 43,
                height: 44,
                jumpId: null
            },
            {
                src: "IP/diamon1.png",
                width: 30,
                height: 30,
                jumpId: null
            }
            ];//黄金图
        //三组石头地址分布
        this.stoneArr = [
            [
                {top: 410,left: 100,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 580,left: 105,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 430,left: 300,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 545,left: 340,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 595,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 385,left: 500,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 495,left: 635,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 400,left: 690,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 540,left: 750,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 415,left: 855,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 500,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 595,left: 940,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 450,left: 985,catched: false,src: null,width: null,height: null,jumpId: null}
            ],
            [
                {top: 570,left: 75,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 600,left: 150,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 480,left: 220,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 405,left: 415,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 635,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 480,left: 515,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 570,left: 600,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 400,left: 655,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 600,left: 720,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 415,left: 810,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 560,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 620,left: 975,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 450,left: 1025,catched: false,src: null,width: null,height: null,jumpId: null}
            ],
            [
                {top: 425,left: 75,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 550,left: 150,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 450,left: 250,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 545,left: 340,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 555,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 435,left: 575,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 570,left: 600,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 400,left: 690,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 415,left: 810,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 560,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 480,left: 925,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 600,left: 870,catched: false,src: null,width: null,height: null,jumpId: null},
                {top: 450,left: 1025,catched: false,src: null,width: null,height: null,jumpId: null}
            ]
        ];
        this.stoneNum = 100;
        this.curStoneNum = 0;//当前展示的数组
        this.gameType = "null";//game-->跳转游戏;cartoon---跳转卡通
        this.isOrder = "1";//鉴权结果
        this.canCatch = true;//是否可以进行抓获
        this.minerRunInter = null;//矿车移动定时器
        this.minerRunDis = 35;//矿车移动距离
        this.ropeDownInter = null;//绳子与夹子移动定时器
        this.setCssType = function(styleDom,styleObj){
            if(styleDom && styleObj && typeof styleObj == "object"){
                for(var key in styleObj){
                    if((key == "top" || key == "left" || key == "width" || key == "height") && (styleObj[key]+"").indexOf("px") == -1){
                        styleDom.style[key] = styleObj[key] + "px";
                    }else{
                        styleDom.style[key] = styleObj[key];
                    }
                }
            }
        }
    }

    MinerObj.prototype = {
        constructor: MinerObj,
        //页面初始化
        init: function(){
            this.setStone();
            this.minerRun();
            focusInit();
            curFocus = getFocusModel6("hands_x0_y0_emptyFocus_");
            curFocus.defaultFocus();
        },
        //设置石头基础信息
        setCurStoneArr: function(curNum,targerMsg){
            this.stoneArr[this.curStoneNum][curNum].src = targerMsg.src;
            this.stoneArr[this.curStoneNum][curNum].width = targerMsg.width;
            this.stoneArr[this.curStoneNum][curNum].height = targerMsg.height;
            this.stoneArr[this.curStoneNum][curNum].jumpId = targerMsg.jumpId;
            this.stoneArr[this.curStoneNum][curNum].catched = false;
        },
        //设置整体游戏框内石头内容
        setStone: function(){
            this.curStoneNum = Math.floor(Math.random()*this.stoneArr.length);
            this.stoneNum = 100;
            var curStoneArr = this.stoneArr[this.curStoneNum];
            var curStoneHtml = "";
            var isStone = false;
            var prizeStoneArr = [];
            var curStoneNum = 0;
            if(this.gameType == "game"){
                for(var i = 0; i < this.ipGameImgArr.length; i++){
                    prizeStoneArr.push(this.ipGameImgArr[i]);
                }
            }else if(this.gameType == "cartoon"){
                for(var i = 0; i < this.ipCartoonImgArr.length; i++){
                    prizeStoneArr.push(this.ipCartoonImgArr[i]);
                }
            }else{
                for(var i = 0; i < this.diamonImgArr.length; i++){
                    prizeStoneArr.push(this.diamonImgArr[i]);
                }
            }
            for(var i = 0; i < curStoneArr.length; i++){
                if(Math.floor(Math.random()*100) < 60 && prizeStoneArr.length > 0){
                    curStoneNum = Math.floor(Math.random()*prizeStoneArr.length);
                    this.setCurStoneArr(i,prizeStoneArr[curStoneNum]);
                    prizeStoneArr.splice(curStoneNum,1);
                }else{
                    curStoneNum = Math.floor(Math.random()*this.stoneImgArr.length);
                    this.setCurStoneArr(i,this.stoneImgArr[curStoneNum]);
                }
                curStoneHtml += "<img src = '"+ (this.imageSource + curStoneArr[i].src) +"' class = 'posDiv' style = 'width: "+ curStoneArr[i].width +"px;height: "+ curStoneArr[i].height +"px;top: "+ curStoneArr[i].top +"px;left: "+ curStoneArr[i].left +"px;'>";
                this.stoneDom.innerHTML = curStoneHtml;
            }
        },
        //点击抓取石头
        catchStone: function(){
            if(this.canCatch){
                this.canCatch = false;
                clearInterval(this.minerRunInter);
                this.minerRunInter = null;
                this.ropeDown();
            }
        },
        //矿工运动
        minerRun: function(){
            var _this = this;
            this.minerRunInter = setInterval(function(){
                _this.setCssType(_this.miner,{left: parseInt(_this.miner.style.left)+_this.minerRunDis});
                if(parseInt(_this.miner.style.left) <= 50){
                    _this.minerRunDis = 35;
                }else if(parseInt(_this.miner.style.left) >= 1000){
                    _this.minerRunDis = -35;
                }
                if(_this.clip.src.indexOf("clip0") > -1){
                    _this.clip.src = "./HD/column/gameMiner/images/clip1.png";
                }else{
                    _this.clip.src = "./HD/column/gameMiner/images/clip0.png";
                }
            },200);
        },
        //绳子下降
        ropeDown: function(){
            var _this = this;
            _this.clip.src = "./HD/column/gameMiner/images/clip1.png";
            var allStoneImg = _this.stoneDom.getElementsByTagName("img");
            this.ropeDownInter = setInterval(function(){
                _this.devideTop = parseInt(_this.miner.style.top) + parseInt(_this.rope.style.top) + parseInt(_this.rope.style.height) + parseInt(_this.clip.style.height)/2;
                _this.devideLeft = parseInt(_this.miner.style.left)+ parseInt(_this.rope.style.left) + parseInt(_this.clip.style.left) + 10;
                _this.devideRight = _this.devideLeft + parseInt(_this.clip.style.width) - 10;
                var touchedStone = 100;
                for(var i = 0;i < allStoneImg.length;i++){
                    if(!_this.stoneArr[_this.curStoneNum][i].catched && parseInt(allStoneImg[i].style.top) <= _this.devideTop
                        && ((parseInt(allStoneImg[i].style.left) >= _this.devideLeft && _this.devideRight >= parseInt(allStoneImg[i].style.left) + parseInt(allStoneImg[i].style.width)/2)
                        || (parseInt(allStoneImg[i].style.left) <= _this.devideLeft && _this.devideLeft <= parseInt(allStoneImg[i].style.left) + parseInt(allStoneImg[i].style.width) - parseInt(allStoneImg[i].style.width)/2) 
                        || (parseInt(allStoneImg[i].style.left) >= _this.devideLeft && _this.devideRight >= parseInt(allStoneImg[i].style.left) + parseInt(allStoneImg[i].style.width))
                        || (parseInt(allStoneImg[i].style.left) <= _this.devideLeft && _this.devideRight <= parseInt(allStoneImg[i].style.left) + parseInt(allStoneImg[i].style.width))
                        )){
                        touchedStone = i;
                        break;
                    }
                }
                if(parseInt(_this.rope.style.height) < 450){
                    if(touchedStone >= 100){
                        _this.setCssType(_this.rope,{height: (parseInt(_this.rope.style.height) + 20)});
                        _this.setCssType(_this.clip,{top: (parseInt(_this.clip.style.top) + 20)});
                    }else{
                        clearInterval(_this.ropeDownInter);
                        _this.clip.src = "./HD/column/gameMiner/images/clip0.png";
                        _this.stoneNum = touchedStone;
                        _this.ropeUp(touchedStone);
                    }
                }else{
                    clearInterval(_this.ropeDownInter);
                    _this.stoneNum = touchedStone;
                    _this.ropeUp();
                }
            },200);
        },
        //绳子上升
        ropeUp: function(){
            var _this = this;
            var allStoneImg = _this.stoneDom.getElementsByTagName("img");
            this.ropeDownInter = setInterval(function(){
                if(parseInt(_this.rope.style.height) >= _this.ropeHeight){
                    _this.setCssType(_this.rope,{height: (parseInt(_this.rope.style.height) - 20)});
                    _this.setCssType(_this.clip,{top: (parseInt(_this.clip.style.top) - 20)});
                    if(_this.stoneNum < 100){
                        _this.setCssType(allStoneImg[_this.stoneNum],{top: (parseInt(allStoneImg[_this.stoneNum].style.top) - 20),left: (parseInt(_this.miner.style.left) + parseInt(_this.rope.style.left) - (parseInt(allStoneImg[_this.stoneNum].style.width)/2))});
                    }
                }else{
                    clearInterval(_this.ropeDownInter);
                    _this.setCssType(_this.rope,{height: _this.ropeHeight});
                    _this.setCssType(_this.clip,{top: 50});
                    if(_this.stoneNum < 100){
                        allStoneImg[_this.stoneNum].style.visibility = "hidden";
                        _this.stoneArr[_this.curStoneNum][_this.stoneNum].catched = true;
                    }
                    _this.showConfirm();
                }
            },200);
        },
        //显示弹框
        showConfirm: function(){
            var gameCanOver = true;
            if(this.gameType && this.stoneNum < 100 && this.stoneArr[this.curStoneNum][this.stoneNum].jumpId){
                this.conText.innerHTML = "稀有矿石有惊喜";
                this.conBg.src = "./HD/column/gameMiner/images/confirm.png";
                this.confirm.style.visibility = "visible";
                this.changeFocus("hands_x0_y0_conFocus0_");
            }else{
                for(var i = 0; i < this.stoneArr[this.curStoneNum].length; i++){
                    if(this.stoneArr[this.curStoneNum][i].src.indexOf("stone") == "-1" && !this.stoneArr[this.curStoneNum][i].catched){
                        gameCanOver = false;
                        break;
                    }
                }
                if(gameCanOver){
                    this.conText.innerHTML = "本关通过啦";
                    this.conBg.src = "./HD/column/gameMiner/images/oneConfirm.png";
                    this.confirm.style.visibility = "visible";
                    this.changeFocus("hands_x0_y0_conFocus2_");
                }else{
                    this.gameContinue();
                }
            }
        },
        //隐藏弹框
        hideConfirm: function(){
            var gameCanOver = true;
            for(var i = 0; i < this.stoneArr[this.curStoneNum].length; i++){
                if(this.stoneArr[this.curStoneNum][i].src.indexOf("stone") == "-1" && !this.stoneArr[this.curStoneNum][i].catched){
                    gameCanOver = false;
                    break;
                }
            }
            if(gameCanOver){
                this.reStart();
            }else{
                this.gameContinue();
            }
        },
        //继续游戏
        gameContinue: function(){
            this.conText.innerHTML = "";
            this.conBg.src = "./HD/column/gameMiner/images/empty.png";
            this.confirm.style.visibility = "hidden";
            this.changeFocus("hands_x0_y0_emptyFocus_");
            this.stoneNum = 100;
            this.canCatch = true;
            this.minerRun();
        },
        //检查单前IP是否需要跳转
        checkJump: function(){
            var gameCanOver = true;
            for(var i = 0; i < this.stoneArr[this.curStoneNum].length; i++){
                if(this.stoneArr[this.curStoneNum][i].src.indexOf("stone") == "-1" && !this.stoneArr[this.curStoneNum][i].catched){
                    gameCanOver = false;
                    break;
                }
            }
            if(this.conText.innerHTML == "本关通过啦"){
                this.conText.innerHTML = "";
                this.conBg.src = "./HD/column/gameMiner/images/empty.png";
                this.confirm.style.visibility = "hidden";
                this.changeFocus("hands_x0_y0_emptyFocus_");
                this.reStart();
            }else{
                if(gameCanOver){
                    this.conText.innerHTML = "本关通过啦";
                    this.conBg.src = "./HD/column/gameMiner/images/oneConfirm.png";
                    this.confirm.style.visibility = "visible";
                    this.changeFocus("hands_x0_y0_conFocus2_");
                }else{
                    this.conText.innerHTML = "";
                    this.conBg.src = "./HD/column/gameMiner/images/empty.png";
                    this.confirm.style.visibility = "hidden";
                    this.changeFocus("hands_x0_y0_emptyFocus_");
                    this.jumpUrl(this.stoneArr[this.curStoneNum][this.stoneNum].jumpId);
                }
            }
        },
        //从新开始游戏
        reStart: function(){
            this.stoneArr = [//三组石头位置
                [
                    {top: 410,left: 100,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 580,left: 105,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 430,left: 300,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 545,left: 340,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 595,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 385,left: 500,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 495,left: 635,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 400,left: 690,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 540,left: 750,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 415,left: 855,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 500,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 595,left: 940,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 450,left: 985,catched: false,src: null,width: null,height: null,jumpId: null}
                ],
                [
                    {top: 570,left: 100,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 600,left: 150,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 480,left: 220,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 405,left: 415,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 635,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 480,left: 515,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 570,left: 600,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 400,left: 655,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 600,left: 720,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 415,left: 810,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 560,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 620,left: 975,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 450,left: 1025,catched: false,src: null,width: null,height: null,jumpId: null}
                ],
                [
                    {top: 425,left: 100,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 550,left: 150,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 450,left: 250,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 545,left: 340,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 555,left: 485,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 435,left: 575,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 570,left: 600,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 400,left: 690,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 415,left: 810,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 560,left: 850,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 480,left: 925,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 600,left: 870,catched: false,src: null,width: null,height: null,jumpId: null},
                    {top: 450,left: 1025,catched: false,src: null,width: null,height: null,jumpId: null}
                ]
            ];
            this.conText.innerHTML = "";
            this.conBg.src = "./HD/column/gameMiner/images/empty.png";
            this.confirm.style.visibility = "hidden";
            this.changeFocus("hands_x0_y0_emptyFocus_");
            this.setStone();
            this.canCatch = true;
            this.minerRun();
        },
        //切换焦点
        changeFocus: function(focusId){
            if(document.getElementById(focusId)){
                curFocus.defaultBlur();
                curFocus = getFocusModel6(focusId);
                curFocus.defaultFocus();
            }
        },
        jumpUrl: function(jumpId){

        }
    };

    var minerGame = new MinerObj();
    minerGame.init();

	//返回方法
	function backfunc(){
		BackPortalMainPage();
	}
</script>
</html>