
//手机输入框
var phoneText = document.getElementById("phoneText");
//手机输入键盘
var phoneTable = document.getElementById("phoneTable");
//焦点是否在输入框上
var isOnFocus = true;
//选中框失去焦点
function phoneLoseFocus() {
    isPhoneFocus = false;
}
//当前用户手机号
var userPhone = "";
//选中框获得焦点
function phoneOnFocus() {
    phoneTable.style.visibility = "visible";
    actiObj.changeFocus("hands_x0_y0_phoneFocus1_");
    document.getElementById("myPrizePhoneS").style.visibility = "visible"
    isPhoneFocus = true;
}
//焦点获焦在输入框中执行的方法
function onFocus(index) {
    isOnFocus = index == 1 ? true : false;
}
function phoneSure() {
    document.getElementById("myPrizePhoneS").style.visibility = "hidden"
    phoneTable.style.visibility = "hidden";
    PAGE.changeFocus("hands_x0_y0_myPrizeSave_");
}

function phoneDel() {
    phoneNums = phoneText.innerHTML + "";
    if(phoneNums.length > 0) {
        phoneNums = phoneNums.substr(0, phoneNums.length - 1);
        phoneText.innerHTML = phoneNums;
    }
}

function inputNum(nums) {
    phoneNums = phoneText.innerHTML + "";
    if(phoneNums.length < 11) {
        phoneNums += nums;
        phoneText.innerHTML = phoneNums;
    }
}
//手机号输入框
var telInput = document.getElementById("telInput").innerHTML;
//去除字符串内所有的空格
telInput = telInput.replace(/\s*/g, "");


var phoneNum = telInput;
//保存手机号
function saveFunc() {
    var TEL_REGEXP = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    phoneNums = phoneText.innerHTML + "";
    if(phoneNums.length >= 11 && TEL_REGEXP.test(phoneNums)) {
        actiObj.setUserPhone(phoneNums, function(data) {
            if(data) {
                phoneTips.innerHTML = "手机号码保存成功";
            } else {
                phoneTips.innerHTML = "手机号码保存失败";
            }
        });
    } else {
        phoneTips.innerHTML = "您输入的手机号格式无效,请重新输入!"
    }
}
//监听用户遥控器输入的数字
function changeNum(num) {
    var phoneNum = document.getElementById("telInput").innerHTML;
    if (isOnFocus) {
        var size;
        if (num == "") {
            size = 0;
        } else {
            size = phoneNum.length;
        }
        if (size < 11 || !size) {
            var addnum = phoneNum;
            phoneNum = addnum + num;
        }
    }
}
//保存按钮失去焦点
function saveBlur() {
    document.getElementById("phoneTips").innerHTML = "";
}
//清除手机号
function clearPhone() {
    phoneNum = "";
    phoneText.innerHTML = phoneNum;
    document.getElementById("phoneTips").innerHTML = "";
}
function changeFocus(focusId){
    curFocus.defaultBlur();
    curFocus = getFocusModel6(focusId);
    curFocus.defaultFocus();
    document.getElementById(curFocus.ImgID).style.visibility = "visible";
}