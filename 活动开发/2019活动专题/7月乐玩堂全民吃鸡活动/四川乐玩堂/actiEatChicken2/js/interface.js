/*********************************      订购接口       ************************************/
//获取到userId
//111000000798是已经中奖用户
var userId = CT.getCookie("userId") || 201810220102;
var activityId = CT.getCookie("activityId") || 8;
var prizeId = 62;
var pageNo = 1;
var pageSize = 80;
var treasureStr = "";
var action = "actiEatChicken";
var OutJson = [{pageInfo:{commPageEname:"actiEatChicken"}}];
//接口
var InterfaceInfo = (function () {
      //接口地址
    var joggle = {
        //获取用户信息接口
        "getUserInfo":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface/ActivityUserDataInterface/getActivityUserDataList",
        //设置用户信息接口
        "setUserInfo":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface/ActivityUserDataInterface/setActivityUserData",
        //获取用户是否中奖接口
        "getUserPrize":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface_gg/ActivityPrizeInterface/getActivityUserPrize",
        //获取已中奖用户信息
        "getTotalPrize":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface_gg/ActivityPrizeInterface/getActivityUserPrizeList",
        //获取已中奖数量
        "getPrizeNum":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface/ActivityPrizeInterface/getActivityPrizeList",
        //上传中奖信息
        "loadUserPrize":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface_gg/ActivityPrizeInterface/setUserPrize",
        //获取用户个人信息
        "gainUserInfoUrl":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface/ActivityUserInterface/getUserInfo",
        //上传手机号码
        "upLoadPhoneNum":"http://112.45.191.110:8095/xjcartoon_activity_BtopInterface/ActivityUserInterface/saveUserPhone"
    };
    //获取参数
    function getNum(str,n) {
        return parseInt(str.split("_")[n]);
    }
    //获取用户存的信息
    function getUserInfo(userId,activityId,fn) {
        ajax.init({
            url:joggle.getUserInfo,
            method:"get",
            async:"true",
            params:{"userId":userId,"activityId":activityId},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //设置用户存的信息
    function setUserInfo(userId,activityId,user_acti_data,fn) {
        ajax.init({
            url:joggle.setUserInfo,
            method:"get",
            async:"true",
            params:{"userId":userId,"activityId":activityId,"user_acti_data":user_acti_data},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //获取用户获奖信息
    function getUserPrize (userId,activityId,fn) {
        ajax.init({
            url:joggle.getUserPrize,
            method:"get",
            async:"true",
            params:{"userId":userId,"activityId":activityId},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //获取总的获奖数量--计算是否还可以领奖
    function getPrizeNum(activityId,pageNo,pageSize,fn) {
        ajax.init({
            url:joggle.getPrizeNum,
            method:"get",
            async:"true",
            params:{"activityId":activityId,"pageNo":pageNo,"pageSize":pageSize},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //上传用户中奖信息
    function loadUserPrize (userId,activityId,prizeId,fn) {
        ajax.init({
            url:joggle.loadUserPrize,
            method:"get",
            async:"true",
            params:{"userId":userId,"activityId":activityId,"prizeId":prizeId},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //获取用户号码
    function gainOwnPhone (userId,fn) {
        ajax.init({
            url:joggle.gainUserInfoUrl,
            method:"get",
            async:"true",
            params:{"userId":userId},
            contentType: "json",
            success:function (data) {
                fn(data);
            },
            fail:function () {

            }
        });
    }
    //上传用户号码
    function upLoadPhone (userId,userPhone,fn) {
        ajax.init({
            url:joggle.upLoadPhoneNum,
            method:"get",
            async:"true",
            params:{"userId":userId,"userPhone":userPhone},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //获取总的获奖数量
    function getTotalPrize(activityId,pageNo,pageSize,fn) {
        ajax.init({
            url:joggle.getTotalPrize,
            method:"get",
            async:"true",
            params:{"activityId":activityId,"pageNo":pageNo,"pageSize":pageSize},
            contentType: "json",
            success:function (data) {
                if(fn){
                    fn(data);
                }
            },
            fail:function () {

            }
        });
    }
    //清除手机号
    function clearPhoneNum() {
        phoneNum = "";
        document.getElementById("phoneText").innerHTML="";
        document.getElementById("phoneInfo").innerHTML="";
    }
    return {
        getNum:getNum,
        getUserInfo: getUserInfo,
        setUserInfo: setUserInfo,
        getUserPrize:getUserPrize,
        getPrizeNum:getPrizeNum,
        loadUserPrize:loadUserPrize,
        clearPhoneNum:clearPhoneNum,
        gainOwnPhone:gainOwnPhone,
        upLoadPhone:upLoadPhone,
        getTotalPrize:getTotalPrize
    }
})();

//手机号码的存储
var phoneText = document.getElementById("phoneText").innerHTML;
var phoneNum = Trim(phoneText,"g");
//改变手机号码
function changeNum(ids) {
    if(eatChicken.phoneFlag){
        var size;
        if(phoneNum==""){
            size=0;
        }else{
            size= phoneNum.length;
        }
        if(size < 11||!size){
            var addNum = phoneNum;
            phoneNum = addNum + ids;
        }
        document.getElementById("phoneText").innerHTML=phoneNum;
    }
}
function Trim(str,is_global) {
    var result = str.replace(/(^\s+)|(\s+$)/g,"");
    if(is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g,"");
    }
    return result;
}



