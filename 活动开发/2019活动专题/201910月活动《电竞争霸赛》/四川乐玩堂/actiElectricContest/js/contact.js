//焦点是否在输入框上
var isOnFocus;

//当前用户手机号
var userPhone = "";

//焦点获焦在输入框中执行的方法
function onFocus(index) {
	isOnFocus = index == 1 ? true : false;
}

//手机号输入框
var telInput = document.getElementById("telInput").innerHTML;
//去除字符串内所有的空格
telInput = telInput.replace(/\s*/g, "");
//获取手机号
actiObj.getUserPhone(function(res) {
	if(res.userPhone != null) {
		document.getElementById("telInput").innerHTML = res.userPhone;
		phoneNum = res.userPhone;
	}
})

var phoneNum = telInput;
//监听用户遥控器输入的数字
function changeNum(num) {
	if(isOnFocus) {
		var size;
		if(phoneNum == "") {
			size = 0;
		} else {
			size = phoneNum.length;
		}
		if(size < 11 || !size) {
			var addnum = phoneNum;
			phoneNum = addnum + num;
		}
		document.getElementById("telInput").innerHTML = phoneNum;
	}
}

//保存手机号
function saveFunc() {
	var phoneNum = document.getElementById("telInput").innerHTML;
	if(phoneNum.length != 11) {
		document.getElementById("telInput").innerHTML = "请输入11位手机号码";
	} else {
		actiObj.setUserPhone(phoneNum, function(res) {
			phoneNum = res.userphone;			
		})
		document.getElementById("savetips").innerHTML = "手机号保存成功";
	}
}

//保存按钮失去焦点
function saveBlur() {
	document.getElementById("savetips").innerHTML = "";
}

//修改、清除手机号
function emptyFunc() {
	document.getElementById("telInput").innerHTML = "";
	phoneNum = "";
}