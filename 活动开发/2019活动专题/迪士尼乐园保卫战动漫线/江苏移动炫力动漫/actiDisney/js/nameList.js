//焦点是否在输入框上
var isOnFocus;

//获取手机号输入框
var userPhone = document.getElementById("userPhone").innerHTML.replace(/\s*/g, "");
//获取用户手机号
actiObj.getUserPhone(function(res) {
	if(res.userPhone != null) {
		document.getElementById("userPhone").innerHTML = res.userPhone;
		document.getElementById("userInfo").innerHTML = res.userPhone;
	}
})

//判断焦点在输入框上获焦
function onFocus(index) {
	isOnfocus = index == 1 ? true : false;
}

//监听用户遥控器输入的数字
function changeNum(num) {
	if(isOnfocus) {
		var size;
		if(userPhone == "") {
			size = 0;
		} else {
			size = userPhone.length;
		}
		if(size < 11 || !size) {
			var addnum = userPhone;
			userPhone = addnum + num;
		}
		document.getElementById("userPhone").innerHTML = userPhone;
	}
}

//保存手机号
function saveFunc() {
	var userPhone = document.getElementById("userPhone").innerHTML;
	if(userPhone.length != 11) {
		document.getElementById("userPhone").innerHTML = "请输入11位手机号码";
	} else {
		actiObj.setUserPhone(userPhone, function(res) {
			document.getElementById("savetips").innerHTML = "手机号保存成功";
			document.getElementById("userInfo").innerHTML = userPhone;
		})
		
	}
}

//保存按钮失去焦点
function saveBlurFunc() {
	document.getElementById("savetips").innerHTML = "";
}

//清除手机号
function emptyFunc() {
	document.getElementById("userPhone").innerHTML = "";
}