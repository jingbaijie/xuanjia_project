var isOnFocus = false;//输入框是否聚焦
var telInput = CT.$("telInput").innerHTML.replace(/\s*/g, ""); //手机号输入框(去除字符串内所有的空格)
var phoneNum = telInput;
function onFocus(index) {
    if (index == 1) {
        isOnFocus = true;
    } else {
        isOnFocus = false;
    }
}
function saveFunc() {
    phoneNum = CT.$("telInput").innerHTML;
    if (phoneNum.length != 11) {
        CT.$("telInput").innerHTML = "请输入11位手机号码";
        phoneNum = "";
    } else {
        actiObj.setUserPhone(phoneNum, function (res) {
            phoneNum = res.userphone;
        });
        CT.$("savetips").innerHTML = "手机号保存成功";
    }
}
function emptyFunc() {
    CT.$("telInput").innerHTML = "";
    phoneNum = "";
}
function saveBlur() {
    CT.$("savetips").innerHTML = "";
}
changeNumObj.changeNum = function (num) {
    if (isOnFocus) {
        var size;
        if (phoneNum == "") {
            size = 0;
        } else {
            size = phoneNum.length;
        }
        if (size < 11 || !size) {
            var addnum = phoneNum;
            phoneNum = addnum + num;
        }
        CT.$("telInput").innerHTML = phoneNum;
    }else if(num==9){
		orderJs.toOrderSucPage();
	}
}