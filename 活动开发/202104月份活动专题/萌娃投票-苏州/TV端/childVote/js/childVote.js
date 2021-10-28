/*.....................投票页......................*/
var page = null;//数据的页数
var pageIndex = 1;//当前页码
var pageNum = 1;//已进入默认页码
//var userId = xjDataLog.getUserId("userId");
var userId = 22232;
var firstAjax = false;
var length = 10;//当前页数长度默认为10
var areaArr = [];//存放所有地区
var areaCode = [];//存放地区Code
var ajaxUrl = AjaxConfig.origin;
var imgUrl = AjaxConfig.origin + "/pic-baby";
var upBefore = null;//数字按钮向上前，记录当前焦点
var beforeTipCur = null;//弹窗弹出之前记录焦点
var button = {};//中间内容框按钮
var  phoneNum="";//输入的选手id
var isClick = true;//是否点击投票
getAllInfo();//获取所有用户
function areaBtnClick() {//地区选择按钮点击事件
    if(curFocus.FocusID == "hands_x0_y0_numFocus0_"){
        CT.$("placeBox").style.visibility = "visible";
    }
}
function areaBtnLeave() {//地区选择按钮向下
    if(CT.$("placeBox").style.visibility == "visible"){
        PAGE.changeFocus("hands_x0_y0_areaFocus0_");
    }else{
        PAGE.changeFocus("hands_x0_y0_showPicFocus0_");
    }
}
function areaClick(num){//点击相应的地区
    var citycode = areaCode[parseInt(curFocus.FocusID.substr(21,1))];//城市code
    CT.$("choosePlace").innerHTML = CT.$("placeP" + num).innerHTML;
    CT.$("placeBox").style.visibility = "hidden";
    //添加地区查询ajax请求
    getAreaPlayer(citycode);
}
function areaBlur() {//第一个地区按钮离开事件
    PAGE.changeFocus("hands_x0_y0_numFocus0_");
    CT.$("placeBox").style.visibility = "hidden";
}
function num1Focus() {//搜索按钮聚焦
    CT.$("placeBox").style.visibility = "hidden";
    phoneNum = "";
    CT.$("phoneText").innerHTML=phoneNum;
}
function num1Blur() {//搜索按钮失去焦点
    if(!CT.$("phoneText").innerHTML){
        CT.$("phoneText").innerHTML="请输入选手id";
    }
}
CT.changeNum = function (ids) {//重写changeNum()
    if(curFocus.FocusID == "hands_x0_y0_numFocus1_"){
        var size;
        if(phoneNum==""){
            size=0;
        }else{
            size= phoneNum.length;
        }

        if(size < 6||!size){
            var addnum = phoneNum;
            phoneNum = addnum + ids;
        }
        CT.$("phoneText").innerHTML=phoneNum;
    }

};
function clearPhoneNum() {//清空搜索框id
    phoneNum = "";
    CT.$("phoneText").innerHTML="";
}
function createVoteHtml() {//投票部分创建
    CT.$("vote").innerHTML = "";
    var picVote = CT.$("vote");
    var html = "";
    for(var j = 0;j < length; j++){
        html =
            '<div class="cardContainer" id="cardContainer'+j+'">'
            +'<div class="card">'
            +'<p id="playerName'+j+'" style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis;width:80px;height:22px;position: absolute;top: 8px;left: 6px;font-size: 19px;font-weight: bold"></p>'
            +'<p id="userIdcard'+j+'" style="position: absolute;top: 8px;left: 94px;font-size: 19px;font-weight: bold"></p>'
            +'<div class="cargImg">'
            +'<img id="cargImg'+j+'" style="width: 100%;height: 100%" src="">'
            +'</div>'

            +"<div class='focus' id='hands_x0_y0_showPicFocus"+j+"_' style='left: 3px;top: 34px;'>"
            +"<img id='showPicFocus"+j+"' src='./img/vote/picSelect.png' style='width:191px;visibility: hidden'>"
            +"</div>"


            +'<p id="monthTic'+j+'" style="position: absolute;top: 185px;left: 16px;"></p>'
            +'<p id="yearTic'+j+'" style="position: absolute;top: 206px;left: 16px;"></p>'
            +'<img src="./img/vote/voteBtn.png" style="position: absolute;top: 224px;left: 76px;">'
            +"<div class='focus' id='hands_x0_y0_showFocus"+j+"_' style='left: 72px;top: 220px;'>"
            +"<img id='showFocus"+j+"' src='./img/vote/voteSelect.png' style='visibility: hidden'>"
            +"</div>"
            +'</div>'
            +'</div>';
        picVote.innerHTML = picVote.innerHTML + html;

    }

    for(var i = 0 ; i < length ; i++){
        if(i<5){
            document.getElementById("cardContainer" + i).style.top = 103 + "px";
            document.getElementById("cardContainer" + i).style.left = (92 + 222*i) + "px";
        } else {
            document.getElementById("cardContainer" + i).style.top = 388 + "px";
            document.getElementById("cardContainer" + i).style.left = (92 + 222*(i-5)) + "px";
        }
    }

}
function createNumHtml() {//数字键html创建

    var numChange = CT.$("middleNum");
    var numHtml = "";
    numChange.innerHTML = "";
    for(var m = 0 ; m < page ;m++){
        if(page <= 7){
            numHtml =
                '<img src="./img/vote/numBg.png" id="numBg'+m+'" style="position: absolute;left: '+m*45+'px">'
                +'<div class="focus" id="hands_x0_y0_numMiddleFocus'+m+'_" style="left: '+ (-7+(m*45)) +'px;top: -6px;">'
                +'<img id="numMiddleFocus'+m+'" src="./img/vote/numSelect.png" style="visibility: hidden">'
                +'</div>'
                +'<div  id="numMiddleColor'+m+'" style="z-index:990;position: absolute;top: 0;left: '+ (m*45) +'px;visibility: hidden;">'
                +'<img src="./img/vote/numColorBg.png">'
                +'</div>'
                +'<p style="z-index:999;left: '+(m*45)+'px">'+(m+1)+'</p>';
            CT.$("hands_x0_y0_numFocus3_").style.left = (page+1)*45+(-1) + "px";
            CT.$("right").style.left = (page+1)*45+6 + "px";
            numChange.innerHTML = numChange.innerHTML + numHtml;
        }else if(page > 7){
            if(m<6){
                numHtml =
                    '<img src="./img/vote/numBg.png" id="numBg'+m+'" style="visibility:visible;position: absolute;left: '+m*45+'px">'
                    +'<div class="focus" id="hands_x0_y0_numMiddleFocus'+m+'_" style="left: '+ (-7+(m*45)) +'px;top: -6px;">'
                    +'<img id="numMiddleFocus'+m+'" src="./img/vote/numSelect.png" style="visibility: hidden">'
                    +'</div>'
                    +'<div id="numMiddleColor'+m+'" style="z-index:990;position: absolute;top: 0;left: '+ (m*45) +'px;visibility: hidden;">'
                    +'<img src="./img/vote/numColorBg.png">'
                    +'</div>'
                    +'<p id="pageNum'+m+'" style="z-index:999;left: '+(m*45)+'px">'+(m+1)+'</p>';
                numChange.innerHTML = numChange.innerHTML + numHtml;

            }else {
                break;
            }
            CT.$("hands_x0_y0_numFocus3_").style.left = 8*45+(-1) + "px";
            CT.$("right").style.left = 8*45+6 + "px";
        }

    }
}
function createButtons() {//创建全部按钮（除地区光标）地区光标在getArea（）中创建
    buttons = [];
    //中间投票光标
    for(var i = 0 ;i < length ; i++){
        button =   {
            id: "hands_x0_y0_showFocus" + i + "_",
            clickHandler: "javascript:clickVote()",
            left: "hands_x0_y0_showFocus" + (i-1) + "_",
            right: "hands_x0_y0_showFocus" + (i+1) + "_",
            up: "disable",
            down: "disable",
            focusType: 7
        };
        if(i == 0){
            button.left = "disable";
        }else if(i == 5){
            button.left = "disable";
        } else if(i == 4 ){
            button.right = "disable";
        }
        if(i == (length-1)) {
            button.right = "disable";
        }
        var last = length-5;
        if(last < 0){
            button.up = "hands_x0_y0_showPicFocus"+i+"_";
            button.downEvent = "javascript:showDown()"
        }else if(last > 0){
            if(i + 5 >= length && i < 5){//上面一排，后面多出来的
                button.up = "hands_x0_y0_showPicFocus"+i+"_";
                button.down = "hands_x0_y0_showPicFocus"+(length-1)+"_"
            }else if(i+5 < length && i < 5){//上面一排，下面有第二排的
                button.up = "hands_x0_y0_showPicFocus"+i+"_";
                button.down = "hands_x0_y0_showPicFocus" + (i+5) + "_"
            }else if(i >= 5){//下面一排
                button.up = "hands_x0_y0_showPicFocus"+i+"_";
                button.downEvent = "javascript:showDown()"
            }
        }
        buttons.push(button);
    }
    //中间展示选手个人信息光标
    for(var i = 0 ;i < length ; i++){
        button4 =   {
            id: "hands_x0_y0_showPicFocus" + i + "_",
            clickHandler: "javascript:showPerson("+ i +")",
            left: "hands_x0_y0_showPicFocus" + (i-1) + "_",
            right: "hands_x0_y0_showPicFocus" + (i+1) + "_",
            up: "disable",
            down: "disable",
            focusType: 7
        };
        if(i == 0){
            button4.left = "disable";
        }else if(i == 5){
            button4.left = "disable";
        } else if(i == 4 ){
            button4.right = "disable";
        }
        if(i == (length-1)) {
            button4.right = "disable";
        }
        var last = length-5;
        if(last < 0){
            button4.up = "hands_x0_y0_numFocus0_";
            button4.down = "hands_x0_y0_showFocus" + i + "_"
        }else if(last > 0){
            if(i + 5 >= length && i < 5){//上面一排，后面多出来的
                button4.up = "hands_x0_y0_numFocus0_";
                button4.down = "hands_x0_y0_showFocus" + i + "_"
            }else if(i+5 < length && i < 5){//上面一排，下面有第二排的
                button4.up = "hands_x0_y0_numFocus0_";
                button4.down = "hands_x0_y0_showFocus" + i + "_"
            }else if(i >= 5){//下面一排
                button4.up = "hands_x0_y0_showFocus"+(i-5)+"_";
                button4.down = "hands_x0_y0_showFocus" + i + "_"
            }
        }

        buttons.push(button4);
    }
    //顶部+left光标+right光标
    for(var j = 0 ;j < 5 ; j++){
        button1 =   {
            id: "hands_x0_y0_numFocus" + j + "_",
            clickHandler: "javascript:",
            left: "hands_x0_y0_numFocus"+(j-1)+"_",
            right: "hands_x0_y0_numFocus"+(j+1)+"_",
            upEvent:"javascript:numUp()",
            down: "disable",
            focusType: 7
        };
        if(j == 0){
            button1.clickHandler = "javascript:areaBtnClick()";
            button1.up = "hands_x0_y0_numFocus0_";
            button1.upEvent = "";
            button1.downEvent = "javascript:areaBtnLeave()";
            button1.left = "disable";
        }else if(j == 1){
            button1.up = "hands_x0_y0_numFocus1_";
            button1.upEvent = "";
            button1.right = "disable";
            button1.clickHandler = "javascript:searchPlayer()";
            button1.otherFocusEvent = "javascript:num1Focus()";
            button1.otherBlurEvent = "javascript:num1Blur()";
            button1.down = "hands_x0_y0_showPicFocus0_";
        }else if(j == 2){
            if(page<=7){
                button1.left = "disable";
                button1.right = "hands_x0_y0_numMiddleFocus0_"
            }else{
                button1.left = "disable";
                button1.right = "hands_x0_y0_numMiddleFocus0_";
                button1.clickHandler = "javascript:btnClickLeft()";
            }
        }else if(j == 3){
            if(page<=7){
                button1.right = "disable";
                button1.left = "hands_x0_y0_numMiddleFocus" + (page-1) + "_";
            }else {
                button1.right = "disable";
                button1.left = "hands_x0_y0_numMiddleFocus5_";
                button1.clickHandler = "javascript:btnClickRight()";
            }
        }else if(j == 4){
            button1.left = "disable";
            button1.right = "disable";
            button1.up = "disable";
            button1.upEvent = "";
            button1.down = "disable";
            button1.clickHandler = "javascript:backFunc()";
        }
        buttons.push(button1);
    }
    //创建底部中间数字button,
    for(var m = 0; m < page ;m++){
        if(page <= 7){
            button3 =   {
                id: "hands_x0_y0_numMiddleFocus" + m + "_",
                clickHandler: "javascript:",
                leftEvent: "javascript:numLeft()",
                rightEvent: "javascript:numRight()",
                upEvent:"javascript:numUp()",
                down: "disable",
                focusType: 7
            };
            if(m == 0){
                button3.left = "hands_x0_y0_numFocus2_"
            }else if(m == (page-1)){
                button3.right = "hands_x0_y0_numFocus3_"
            }
            buttons.push(button3);
        }else if(page > 7){
            if(m<6){
                button3 =   {
                    id: "hands_x0_y0_numMiddleFocus" + m + "_",
                    clickHandler: "javascript:",
                    leftEvent: "javascript:numLeft()",
                    rightEvent: "javascript:numRight()",
                    upEvent:"javascript:numUp()",
                    down: "disable",
                    focusType: 7
                };
                if(m == 0){
                    button3.left = "hands_x0_y0_numFocus2_"
                }else if(m == 5){
                    button3.right = "hands_x0_y0_numFocus3_"
                }
                buttons.push(button3);
            } else{
                break;
            }

        }


    }

}
function numUp() {//底部数字键向上，记当前焦点
    upBefore = curFocus.FocusID;
    PAGE.changeFocus("hands_x0_y0_showFocus"+(length-1)+"_");
}
function showDown() {//中间内容向下，回到之前记录的焦点
    PAGE.changeFocus(upBefore);
}
function numRight() {//底部数字按钮向右+1
    var direct = 1;
    if(pageNum <= page){
        pageNum ++ ;
    }
    if(pageNum <= page && pageNum < 7){
        getAllInfo(direct);
    }else if(pageNum <= page && pageNum >= 7){

    }
    var index = parseInt(curFocus.FocusID.substr(26,1));//当前光标下标
    if(page > 7){
        if((index+1) < 6){
            if(index == 1 && CT.$("pageNum2").innerHTML == "..."){
                pageNum = parseInt(CT.$("pageNum3").innerHTML);
                getAllInfo(direct);
                CT.$("numMiddleColor" + index).style.visibility = "hidden";
                CT.$("numMiddleColor" + (index+2)).style.visibility = "visible";
                PAGE.changeFocus("hands_x0_y0_numMiddleFocus" + (index+2) + "_");
            }else {
                CT.$("numMiddleColor" + index).style.visibility = "hidden";
                CT.$("numMiddleColor" + (index+1)).style.visibility = "visible";
                PAGE.changeFocus("hands_x0_y0_numMiddleFocus" + (index+1) + "_");
            }
        }else if((index+1) == 6){
            pageNum--;
            PAGE.changeFocus("hands_x0_y0_numFocus3_");
            CT.$("numMiddleColor5").style.visibility = "visible";
        }
    }else {
        if((pageNum-1) == page){
            PAGE.changeFocus("hands_x0_y0_numFocus3_");
        }else if((pageNum-1) < page){
            CT.$("numMiddleColor" + (pageNum-2)).style.visibility = "hidden";
            CT.$("numMiddleColor" + (pageNum-1)).style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_numMiddleFocus" + (pageNum -1) + "_");
        }
    }
}
function numLeft() {//底部数字按钮向右-1
    var direct = 0;
    var pageIndex = pageNum;//pageIndex:一个中转变量
    if(pageNum == page + 1){
        pageNum = pageNum -2;
    }else if (pageNum > 1) {
        pageNum--;
    }
    var index = parseInt(curFocus.FocusID.substr(26,1));//当前光标下标
    if(index == 0){
        pageIndex = 0;
    }
    if(pageNum <= page){
        getAllInfo(direct);
    }
    if(pageIndex == 0){
        PAGE.changeFocus("hands_x0_y0_numFocus2_");
        CT.$("numMiddleColor0").style.visibility = "visible";
    }else if(pageNum <= page){
        if(index-1 == 2 && CT.$("pageNum2").innerHTML == "..."){//跳过"..."
            pageNum = 2;
            getAllInfo(direct);
            CT.$("numMiddleColor" + (index)).style.visibility = "hidden";
            CT.$("numMiddleColor" + (index-2)).style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_numMiddleFocus"+(index -2)+"_");
        }else {
            CT.$("numMiddleColor" + index).style.visibility = "hidden";
            CT.$("numMiddleColor" + (index-1)).style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_numMiddleFocus"+(index -1)+"_");
        }
    }
}
function btnClickRight() {
    if(pageNum == 6){
        getAllInfo();
        pageNum++;
    }else if(pageNum < page){
        getAllInfo();
        pageNum++;
    }
    if(page>7 && parseInt(CT.$("pageNum5").innerHTML) < page){
        CT.$("numMiddleColor5").style.visibility = "visible";
        for(var q = 2 ;q < 6 ;q++){
            CT.$("pageNum" + q).innerHTML = parseInt(CT.$("pageNum" + q).innerHTML) + 1;
        }
        if(parseInt(CT.$("pageNum2").innerHTML) != 3){
            CT.$("pageNum2").innerHTML = "...";
            CT.$("pageNum2").style.top = -10+"px";
            CT.$("pageNum2").style.left = 90+"px";
            CT.$("pageNum2").style.fontSize = 42+"px";
            CT.$("pageNum2").style.color = "#fff";
            CT.$("numBg2").style.visibility = "hidden";
        }
    }
}
function btnClickLeft() {
    if(page>7 && parseInt(CT.$("pageNum5").innerHTML) <= page && parseInt(CT.$("pageNum3").innerHTML)>4){
        for(var q = 3 ;q < 6 ;q++){
            CT.$("pageNum" + q).innerHTML = parseInt(CT.$("pageNum" + q).innerHTML) - 1;
        }
        if(parseInt(CT.$("pageNum3").innerHTML) == 4){
            CT.$("pageNum2").innerHTML = 3;
            CT.$("pageNum2").style.top = 0+"px";
            CT.$("pageNum2").style.left = 90+"px";
            CT.$("pageNum2").style.fontSize = 16+"px";
            CT.$("pageNum2").style.color = "#000";
            CT.$("numBg2").style.visibility = "visible";
        }
    }
}
//请求全部用户信息
var chilData = [];//存放所有一页用户信息
function getAllInfo(direct) {//获取页面所有需要渲染的信息
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/list",
        method:"get",
        params:{
            //"userId":userId,
            "pageNum":pageNum,
            "pageSize":10,
            "orderType":0
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                chilData = res.data.records;
                length = chilData.length;
                page = res.data.pages;
                pageIndex = res.data.current;
                createVoteHtml();
                PAGE.focusArr = [];
                PAGE.focusIDArr = [];
                createButtons();
                getArea();//获取地区
                if(direct == 1){//按数字键，向右，需要初始化焦点（渲染的数据）
                    curFocus.defaultBlur();
                    PAGE.focusInit();
                    curFocus = PAGE.getFocusModel6("hands_x0_y0_numMiddleFocus" + (pageNum-1) + "_");
                    curFocus.defaultFocus();
                }else if(direct == 0){//按数字键，向左，需要初始化焦点（渲染的数据）
                    curFocus.defaultBlur();
                    PAGE.focusInit();
                    curFocus = PAGE.getFocusModel6("hands_x0_y0_numMiddleFocus" + (pageNum-1) + "_");
                    curFocus.defaultFocus();
                }
                if(firstAjax == false){//数字按键，一开始创建一次，当不搜索地区选手或不搜索当个选手，数字键都不需要重新渲染，全部选手信息是不变的
                    createNumHtml();
                    PAGE.focusInit();
                    curFocus = PAGE.getFocusModel6("hands_x0_y0_numFocus2_");
                    curFocus.defaultFocus();
                    //初始化页面下方小点和选中页面颜色
                    CT.$("numMiddleColor" + (pageIndex-1)).style.visibility = "visible";
                    if(page<=7){
                        CT.$("dot").style.visibility = "hidden";
                    }
                    firstAjax = true;
                }
                //渲染页面数据
                for(var i = 0 ;i < chilData.length ;i++){
                    var playId = (Array(6).join(0) +  chilData[i].playerId).slice(-6);
                    CT.$("userIdcard" + i).innerHTML =  "ID:" + playId;
                    CT.$("playerName" + i).innerHTML = chilData[i].playerName;
                    CT.$("cargImg" + i).src = imgUrl + chilData[i].avatar;
                    CT.$("monthTic" + i).innerHTML = "月票:" + chilData[i].playerMonthlyCredits;
                    CT.$("yearTic" + i).innerHTML = "总票数:" + chilData[i].playerYearlyCredits;
                }

            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function getArea() {//获取地区信息，并且创建html和地区buttons
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/province/getCityByProvinceId",
        method:"get",
        params:{},
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                areaArr = res.data;
                //创建地区
                CT.$("placeBox").innerHTML = "";
                var placeBox = CT.$("placeBox");
                var htmlPic = "";
                for(var q = 0;q < areaArr.length; q++){
                    htmlPic =
                        '<li style="left: 0px;top: '+q*32+'px;">'
                        +'<div class=“areafocus" id="hands_x0_y0_areaFocus'+q+'_" style="left: 0px;top: 0px;">'
                        +'<img id="areaFocus'+q+'" src="./img/vote/placeAreaSelect.png" style="width:160px;visibility: hidden">'
                        +'</div>'
                        +'<p id="placeP'+q+'"></p>'
                        +'</li>';
                    placeBox.innerHTML = placeBox.innerHTML + htmlPic;
                }
                //顶部地区光标
                for(var n = 0 ;n < areaArr.length ; n++){
                    button2 =   {
                        id: "hands_x0_y0_areaFocus" + n + "_",
                        clickHandler: "javascript:areaClick("+n+")",
                        up: "hands_x0_y0_areaFocus" + (n-1) + "_",
                        down: "hands_x0_y0_areaFocus" + (n+1) + "_",
                        right: "disable",
                        left: "disable",
                        focusType: 7
                    };
                    if(n==0){
                        button2.upEvent = "javascript:areaBlur()";
                        button2.up = "hands_x0_y0_numFocus0_"
                    }else if(n == (areaArr.length-1)){
                        button2.down = "disable"
                    }
                    buttons.push(button2);
                }
                //渲染页面数据
                for(var i = 0 ;i < areaArr.length ;i++){
                    if(areaCode.indexOf(areaArr[i].cityCode)>-1){

                    }else {
                        areaCode.push(areaArr[i].cityCode);
                    }

                    CT.$("placeP" + i).innerHTML = areaArr[i].cityName
                }
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function searchPlayer() {//通过id 搜索选手
    pageNum = 1;
    upBefore = "hands_x0_y0_numFocus2_";
    // var searchId = parseInt(CT.$("phoneText").innerHTML);
    var searchId = CT.$("phoneText").innerHTML;
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/list",
        method:"get",
        params:{
            "playerId":searchId,
            "pageNum":1,
            "pageSize":10,
            "orderType":0
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                if(res.data.records.length == 1){
                    firstAjax = false;
                    chilData = res.data.records;
                    length = chilData.length;
                    page = res.data.pages;
                    pageIndex = res.data.current;
                    createVoteHtml();
                    if(firstAjax == false){
                        createNumHtml();
                        PAGE.focusArr = [];
                        PAGE.focusIDArr = [];
                        createButtons();
                        getArea();//获取地区
                        button.downEvent = "";
                        button.down = "disable";
                        PAGE.focusInit();
                        curFocus = PAGE.getFocusModel6("hands_x0_y0_numFocus1_");
                        curFocus.defaultFocus();
                        //初始化页面下方小点和选中页面颜色
                        CT.$("numMiddleColor" + (pageIndex-1)).style.visibility = "visible";
                        if(page<=7){
                            CT.$("dot").style.visibility = "hidden";
                        }
                        firstAjax = true;
                    }
                    CT.$("bottomNum").style.visibility = "hidden";
                    CT.$("numMiddleColor0").style.visibility = "hidden";
                    //渲染页面数据
                    for(var i = 0 ;i < chilData.length ;i++){
                        CT.$("playerName" + i).innerHTML = chilData[i].playerName;
                        var playId = (Array(6).join(0) +  chilData[i].playerId).slice(-6);
                        CT.$("userIdcard" + i).innerHTML =  "ID:" + playId;
                        // CT.$("userIdcard" + i).innerHTML = "ID:" + chilData[i].playerId;
                        CT.$("cargImg" + i).src = imgUrl + chilData[i].avatar;
                        CT.$("monthTic" + i).innerHTML = "月票:" + chilData[i].playerMonthlyCredits;
                        CT.$("yearTic" + i).innerHTML = "总票数:" + chilData[i].playerYearlyCredits;
                    }
                }else {
                    // getAllInfo();
                    CT.$("tips2").style.visibility = "visible";
                    beforeTipCur = curFocus.FocusID;
                    // CT.$("hands_x0_y0_numFocus4_").style.top = 514 + "px";
                    PAGE.changeFocus("hands_x0_y0_numFocus4_")
                }

            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function clickVote() {//点击投票按钮
    var mAuth = null;
    var creditFrom = null;
    if(isClick){
        isClick = false;
        /*鉴权*/
        // orderJs.getAuth(function (data) {
        //     if(data == "0"){
                mAuth = true;
                creditFrom = 1;
                voteGet(mAuth,creditFrom);
        //     }else {
        //         mAuth = false;
        //         creditFrom = 0;
        //         voteGet(mAuth,creditFrom);
        //     }
        // });
    }
}
function voteGet(mAuth,creditFrom) {
    var currentIndex = curFocus.FocusID.substr(21,1);//当前投票按钮的index,动态更新数据会用到
    var addBabyId = CT.$("userIdcard" + currentIndex).innerHTML.substr(3);
    var mKey = hex_md5(Base64.encode("userId=" + userId + "&userType=0&addBaby=" + addBabyId + "&authStatus="+ mAuth + "&creditFrom=" + creditFrom));
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/insert",
        method:"get",
        params:{
            "userId":userId,
            "userType":0,
            "addBaby":addBabyId,
            "authStatus":mAuth,
            "creditFrom":creditFrom
        },
        ContentType:"json",
        async:false,
        beforeSend: function(xml){
            xml.setRequestHeader("x-v-p",mKey);
        },
        success:function(res){
            if(res.errorCode == 1000){
                //动态修改票数，不请求接口
                CT.$("monthTic" + currentIndex).innerHTML = "月票:"+ (parseInt(CT.$("monthTic" + currentIndex).innerHTML.substr(3)) + 1);
                CT.$("yearTic" + currentIndex).innerHTML = "总票数:"+ (parseInt(CT.$("yearTic" + currentIndex).innerHTML.substr(4)) + 1);
                CT.$("tips").style.visibility = "visible";
                beforeTipCur = curFocus.FocusID;
                getPlayerInfo(addBabyId);
            }else if(res.errorCode == 1034){
                CT.$("hands_x0_y0_numFocus4_").style.top = 513+"px";
                CT.$("hands_x0_y0_numFocus4_").style.left = 506+"px";
                CT.$("tips1").style.visibility = "visible";
                if(creditFrom == 1){
                    CT.$("isGone").innerHTML = "今日票数已用完";
                }else{
                    CT.$("isGone").innerHTML = "今日票数已用完，参与订购将获得更多票数！";
                }
                beforeTipCur = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }else if(res.errorCode == 1041){
                CT.$("hands_x0_y0_numFocus4_").style.top = 513+"px";
                CT.$("hands_x0_y0_numFocus4_").style.left = 506+"px";
                CT.$("tips1").style.visibility = "visible";
                CT.$("isGone").innerHTML = "当前时段内投票投票次数已达上限，请过一小时后再来投票！";
                beforeTipCur = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }
			isClick = true;
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function showPerson(num){//展示选手个人信息
	var playerID = CT.$("userIdcard" + num).innerHTML.slice(-6);
	actiObj.actiCommonJumpUrl("childPicShow.html?playerId=" + playerID);
}
function getPlayerInfo(playerId) {//获取选手信息，渲染在弹窗上
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/getPersonalCreditsInfo",
        method:"get",
        params:{
            "playerId":playerId,
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                CT.$("totalTicMonth").innerHTML = res.data.amountCreditsM;
                CT.$("TVTic").innerHTML = res.data.tvPlatformCreditsM;
                CT.$("phoneTic").innerHTML = res.data.wxPlatformCreditsM;
                CT.$("totalTic").innerHTML = res.data.amountCredits;
                PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function getAreaPlayer(citycode) {//获取某个地区相应的选手
    pageNum = 1;
    upBefore = "hands_x0_y0_numFocus2_";
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/list",
        method:"get",
        params:{
            "cityCode":citycode,
            "pageNum":1,
            "pageSize":10,
            "orderType":0
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
                firstAjax = false;
                CT.$("bottomNum").style.visibility = "visible";
                CT.$("placeBox").style.visibility = "hidden";
                chilData = res.data.records;
                length = chilData.length;
                page = res.data.pages;
                pageIndex = res.data.current;
                createVoteHtml();
                if(firstAjax == false){
                    createNumHtml();
                    PAGE.focusArr = [];
                    PAGE.focusIDArr = [];
                    createButtons();
                    getArea();//获取地区
                    PAGE.focusInit();
                    curFocus = PAGE.getFocusModel6("hands_x0_y0_numFocus0_");
                    curFocus.defaultFocus();
                    //初始化页面下方小点和选中页面颜色
                    if(chilData.length>0){
                        CT.$("numMiddleColor" + (pageIndex-1)).style.visibility = "visible";
                    }                    
                    if(page<=7){
                        CT.$("dot").style.visibility = "hidden";
                    }
                    firstAjax = true;
                }
                //渲染页面数据
                for(var i = 0 ;i < chilData.length ;i++){
                    CT.$("userIdcard" + i).innerHTML = "ID:" + chilData[i].playerId;
                    CT.$("cargImg" + i).src = imgUrl + chilData[i].avatar;
                    CT.$("monthTic" + i).innerHTML = "月票:" + chilData[i].playerMonthlyCredits;
                    CT.$("yearTic" + i).innerHTML = "总票数:" + chilData[i].playerYearlyCredits;
                }
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function backFunc() {//关闭弹窗
    if(curFocus.FocusID == "hands_x0_y0_numFocus4_"){
        PAGE.changeFocus(beforeTipCur);
        CT.$("tips").style.visibility = "hidden";
        CT.$("tips1").style.visibility = "hidden";
        CT.$("tips2").style.visibility = "hidden";
    }else if(curFocus.FocusID == "hands_x0_y0_numFocus1_"){
        clearPhoneNum();
    }else {//返回上一页
        actiObj.actiCommonJumpUrl("childPrizeMain.html");
    }
}
