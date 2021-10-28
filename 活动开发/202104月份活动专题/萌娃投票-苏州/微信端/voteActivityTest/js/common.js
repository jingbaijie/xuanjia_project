var ipUrl = "https://cibn.tvjoy.cn/njxj_vote_jsyx/";
var imgUrl = "https://cibn.tvjoy.cn/pic/vote_project_pic_lib"; //图片地址
//var openId = Math.ceil(Math.random() * 1000);
var openId = $.cookie("weChatId");
var userId = GetQueryString("userId");
if(!userId) {
	userId = "11111111";
}
var vTime = new Date().getTime();
//获取当前用户是否报名信息
function getSignUPInfo(fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/userInfo/checkSignUpStatus",
		params: {
			userCode: userId, //非必传
			openId: openId
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function(res) {
			fn && fn(false);
		}
	});
};

//获取用户报名成功展示信息
function getUserInfoShow(fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/userInfo/getUserInfoByUserId",
		params: {
			userId: openId,
			platformType: "1", //"1"是微信
			vTime: vTime
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
};

//获取省市信息
function getCityByProvince(provinceId, fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/province/getCityByProvinceId",
		params: {
			provinceId: provinceId
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
};

//提交报名信息
function submitFormInfo(fn) {
	$.formDataFileUpload({
		url: ipUrl + "vote/api/userInfo/insert", //信息上传接口
		fileElementId: ["file0"], //数组,传如input的id
		data: {
			userId: userId,
			openId: openId,
			playerName: $("#name").val(), //用户名 （必传）
			playerGender: $("#selectSex").val(), //用户性别
			playerAgreeFlag: "0", //是否同意协议 （0-同意， 1-不同意）
			playerIntroduction: $("#hobbies").val(), //用户爱好
			playerAge: parseInt($("#selectAge").val()), //用户年龄
			playerPhone: $("#phone").val(), //用户手机号
			playerCity: cityCode //城市编码
		}, //其余参数
		beforesend: function() { //上传前操作
			console.log("beforeSend");
		},
		success: function(res) { //上传成功
			console.log("上传成功");
			fn && fn(res);
		},
		error: function(res) {
			console.log("请求失败");
		},
		onprogress: function(evt) { //上传中,文件上传中不停调用此方法,可通过此dd方法添加进度条等操作
			var loaded = evt.loaded; //已上传字节
			var tot = evt.total; //总字节
		}
	});
};

//获取全部用户
function getAllpalyerList(playerId, pageNum, fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/userInfo/list",
		params: {
			playerId: playerId, //（搜索的时候传）
			pageNum: pageNum, //当前页码,（默认第一页）
			pageSize: 10, //页面大小（ 默认每页10条数据）			
			orderType: 0 //排序方式（不传或者传0-按月票拍，1-按年票）
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
};
//剩余票数
function getPersonalCredits(fn) {
	var keys = hex_md5(Base64.encode("userId="+openId+"&userType=1&creditFrom=2"));
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/getUserCurrentCredits",
		params: {
			userId: openId,
			userType: 1,
			creditFrom: 2 //票数来源：2，微信；3，转发
		},
		headers: {
			"x-v-p": keys
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
};

//投票
function voteOperate(playerId, fn) {
	var keys = hex_md5(Base64.encode("userId=" + openId + "&userType=1&addBaby=" + playerId + "&creditFrom=2"));
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/insert",
		params: {
			userId: openId, //投票用户id （必传）
			userType: 1, //用户类型（0-iptv 1-微信）（必传）
			addBaby: playerId, //小朋友id（必传）
			creditFrom: 2 //票数来源：2，微信；3，转发
		},
		headers: {
			"x-v-p": keys
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
}
//增加投票次数（用于转发）
function addPoll(fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/incr",
		params: {
			userId: openId, //投票用户id （必传）
			userType: 1, //用户类型（0-iptv 1-微信）（必传）
			creditFrom: 3 //票数来源：2，微信；3，转发
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
}
//根据选手编号(playerId)获取对应选手信息
function getPlayerInfo(playerId, fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/userInfo/getPlayerInfoByPlayerId",
		params: {
			playerId: playerId
		},
		success: function(res) {
			fn && fn(res);
		},
		fail: function() {
			fn && fn(false);
		}
	});
}
/*
 * 获取地址栏参数
 */
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r != null)
		return unescape(r[2]);
	return null;
};

/*
 *不足六位自动补全0
 * num传入的数字，n需要的字符长度
 */
function PrefixInteger(num, n) {
	return(Array(n).join(0) + num).slice(-n);
}
/**
 * 获取ajax请求结果
 * option = {
 *      "requestUrl": 请求地址
 *      "type": 请求类型(post/get)
 *      "success": function(data){}请求成功后的回调方法
 *      "fail": function(data){}请求失败后的回调方法
 *  }
 * @param option
 */
function getAjaxResult(option) {
	$.ajax({
		url: option.requestUrl,
		type: option.type || "get",
		async: true,
		contentType: "application/x-www-form-urlencoded",
		data: option.params,
		processData: option.processData || true,
		headers: option.headers,
		success: function(res) {
			option.success && option.success(res);
		},
		fail: function(status) {
			option.fail && option.fail();
		}
	});
};