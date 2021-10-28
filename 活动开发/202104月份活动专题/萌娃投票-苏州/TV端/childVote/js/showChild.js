var buttons = [
    {
        id: "hands_x0_y0_voteFocus0_",
        clickHandler: "javascript:clickVote()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "hands_x0_y0_picFocus0_",
        focusType: 7
    },{
        id: "hands_x0_y0_backFocus0_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7
    },{
        id: "hands_x0_y0_numFocus4_",
        clickHandler: "javascript:backFunc()",
        left: "disable",
        right: "disable",
        up: "disable",
        down: "disable",
        focusType: 7
    }];
var ajaxUrl = AjaxConfig.origin;
var imgUrl = AjaxConfig.origin + "/pic-baby";
var arrPerson = [];
var tipsBefore = null;
var isClick = true;
var pic = null;
var imgWidth = null;
var move = 0;
var timer = null;
//var userId = xjDataLog.getUserId("userId");
var userId = 22232;
var playerId1 = GetQueryString("playerId")+"";
getPicInfo();
function getPicInfo() {//获取页面所有需要渲染的信息
    ajax.init({
        url: ajaxUrl + "/iptv-admin-api-baby/vote/api/userInfo/list",
        method:"get",
        params:{
            "playerId":playerId1,
            "pageNum":1,
            "pageSize":10,
            "orderType":0
        },
        ContentType:"json",
        async:false,
        success:function(res){
            if(res.errorCode == 1000){
				//背景音乐
				interface.findVideoListByCartoonId({params:{cartoonId:674,ajaxConfig:{async:true}}},function(data){
					page.videoListJSon = data;
					page.playSmallVideo();
				});
                arrPerson = res.data.records[0];
                childLength = arrPerson.playerPicInfoList.length;
                createHtml();
                createButtons();
				pic = document.getElementById("pic_div");
                imgWidth = pic.children[0].offsetWidth;
                pic.style.left = 0 + "px";
                CT.$("nameChlid").innerHTML = "姓名：" + arrPerson.playerName;
                CT.$("ageChlid").innerHTML = "年龄：" + arrPerson.playerAge;
                if(arrPerson.playerGender == 0){
                    CT.$("sexChlid").innerHTML = "性别：男";
                }else if(arrPerson.playerGender == 1){
                    CT.$("sexChlid").innerHTML = "性别：女";
                }
				CT.$("placeChlid").innerHTML = "地区：" + arrPerson.cityName;
				var hobbyDetail = arrPerson.playerIntroduction.substring(0,14) + "…"
                CT.$("hobbyChlid").innerHTML = "爱好：" + hobbyDetail;
                for(var i = 0; i < childLength ;i++){
                    CT.$("personImg" + i).src = imgUrl + arrPerson.playerPicInfoList[i].picPath;
                    CT.$("personImgBott" + i).src = imgUrl + arrPerson.playerPicInfoList[i].picPath;
                }
                PAGE.focusInit();
                curFocus = PAGE.getFocusModel6("hands_x0_y0_voteFocus0_");
                curFocus.defaultFocus();
                autoPlay();
            }
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
}
function createHtml() {
    var picLeft = CT.$("pic_div");
    var picBottom = CT.$("bottomChild");
    var html = "";
    var bottomHtml = "";
    for(var j = 0;j < childLength; j++){
        html =
            '<li class="cardContainer" id="cardContainer'+j+'" style="width:615px;position: absolute;top: 0;left: '+j*615+'px;">'
            +'<img src="" id="personImg'+j+'" style="width:615px;height:344px;position: absolute;top: 0px;left: 0px;">'
            +'</li>';
        picLeft.innerHTML = picLeft.innerHTML + html;

        bottomHtml =
            '<li class="cardContainer" id="cardContainer'+j+'" style="position: absolute;top: 0;left: '+j*223+'px;overflow: hidden">'
            +'<img id="personImgBott'+j+'" src="" style="position: absolute;top: 0;left: 0;width: 200px;height: 149px">'
            +'</li>'
            +"<div class='focus' id='hands_x0_y0_picFocus"+j+"_' style='left: "+j*223+"px;top: 0;'>"
            +"<img id='picFocus"+j+"' src='./img/vote/picSelect.png' style='width:200px;visibility: hidden'>"
            +"</div>";
        picBottom.innerHTML = picBottom.innerHTML + bottomHtml;
    }

}
function createButtons() {
    //中间投票光标
    var button = "";
    for(var i = 0 ;i < childLength ; i++){
        button =   {
            id: "hands_x0_y0_picFocus" + i + "_",
            clickHandler: "javascript:clickShow("+i+")",
            left: "hands_x0_y0_picFocus" + (i-1) + "_",
            right: "hands_x0_y0_picFocus" + (i+1) + "_",
            up: "hands_x0_y0_voteFocus0_",
            down: "disable",
            focusType: 7
        };
        if(i == 0){
            button.left = "disable";
        }
        if(i == (childLength-1)) {
            button.right = "disable";
        }
        buttons.push(button);
    }
}
function clickShow(num) {
    CT.$("tips3").style.visibility = "visible";
    CT.$("scalePic").src = imgUrl + arrPerson.playerPicInfoList[num].picPath;
    tipsBefore = curFocus.FocusID;
    PAGE.changeFocus("hands_x0_y0_backFocus0_");
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
    var addBabyId = (Array(6).join(0) +  arrPerson.playerId).slice(-6);
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
                CT.$("tips").style.visibility = "visible";
                tipsBefore = curFocus.FocusID;
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
                tipsBefore = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }else if(res.errorCode == 1041){
                CT.$("hands_x0_y0_numFocus4_").style.top = 513+"px";
                CT.$("hands_x0_y0_numFocus4_").style.left = 506+"px";
                CT.$("tips1").style.visibility = "visible";
                CT.$("isGone").innerHTML = "当前时段内投票投票次数已达上限，请过一小时后再来投票！";
                tipsBefore = curFocus.FocusID;
                PAGE.changeFocus("hands_x0_y0_numFocus4_")
            }
            isClick = true;
        },
        fail:function(res){
            console.log("请求失败")
        }
    });
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
function backFunc() {
    if(curFocus.FocusID == "hands_x0_y0_backFocus0_"){
        PAGE.changeFocus(tipsBefore);
        CT.$("tips3").style.visibility = "hidden";
    }else if(curFocus.FocusID == "hands_x0_y0_numFocus4_"){
        PAGE.changeFocus(tipsBefore);
        CT.$("tips").style.visibility = "hidden";
        CT.$("tips1").style.visibility = "hidden";
    }else {
        actiObj.actiCommonJumpUrl("childPrizeMain.html");
    }
}


function nextPic() {
    if(move == pic.children.length - 1){
        move = 0;
        pic.style.left = 0 + "px";
    }
    move++;
    pic.style.left = -move*imgWidth + "px";
    //animate(pic,-move*imgWidth);
}
function prevPic() {
    if(move == 0){
        move = pic.children.length - 1;
        pic.style.left = -move * imgWidth + "px";
    }
    move--;
    pic.style.left = -move*imgWidth + "px";
    //animate(pic,-move*imgWidth);
}
function autoPlay() {
    timer = setInterval(function () {
      nextPic();
    },3000)
}
function animate(el,distance) {
    clearInterval(el.timer);
    el.timer = setInterval(function () {
        var present = el.offsetLeft;//当前的位置
        var movement = 10;//每次移动的距离
        movement = present < distance ? movement : -movement;
        present +=movement;
        if(Math.abs(present-distance) > Math.abs(movement)){
            el.style.left = present + "px";
        }else{
            clearInterval(el.timer);
            el.style.left = distance + "px";
        }
    },5)

}
function pausePlay() {
    clearInterval(timer);
}
function GetQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}



