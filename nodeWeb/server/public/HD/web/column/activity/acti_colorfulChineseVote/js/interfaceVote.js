var ipUrl = "http://172.31.183.147:8090/iptv-admin-api-vote/";
var voteInterface ="http://172.31.183.147:8090/iptv-web-api-vote/";
//var imgUrl = "http://180.96.20.178:6100/vote_baby_img/other/"; //图片地址
var userId = xjDataLog.getUserId() || GetQueryString("userId");
var isOrder = 1;//鉴权结果，默认未订购
var creditFrom = 0//票数来源,默认传未订购
if (!userId) {
	userId = "";
}
if (isOrder == 0) {//已订购
	creditFrom = 1;//iptv订购用户
	authStatus = true;
} else {
	creditFrom = 0;//iptv未订购用户
	authStatus = false;
}
//获取全部用户
function getAllpalyerList(playerId,playerName,pageNum, pageSize, orderType, fn) {
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/userInfo/list",
		params: {
			playerId: playerId, //（搜索的时候传）
			playerName:playerName,//选手姓名缩写（小写）
			pageNum: pageNum, //当前页码,（默认第一页）
			pageSize: pageSize, //页面大小（ 默认每页10条数据）			
			orderType: orderType //排序方式（不传或者传0-按时间降序，1-按总票数降序）
		},
		success: function (res) {
			fn && fn(res);
		},
		fail: function () {
			fn && fn(false);
		}
	});
};
//剩余票数
function getPersonalCredits(fn) {
	var keys = hex_md5(Base64.encode("userId=" + userId + "&userType=0&creditFrom=" + creditFrom));
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/getUserCurrentCredits",
		params: {
			userId: userId,
			userType: 0,//用户类型（0-iptv 1-微信）（必传）
			creditFrom: creditFrom //票数来源：0,iptv未订购用户；1，iptv订购用户；2，微信；3，转发
		},
		headerName: "x-v-p",//加密字段请求头名称
		headerValue: keys,//请求头的值
		success: function (res) {
			fn && fn(res);
		},
		fail: function () {
			fn && fn(false);
		}
	});
};

//投票
function voteOperate(playerId, fn) {
	var keys = hex_md5(Base64.encode("userId=" + userId + "&userType=0&addBaby=" + playerId + "&authStatus="+authStatus+"&creditFrom="+creditFrom));
	getAjaxResult({
		requestUrl: ipUrl + "vote/api/insert",
		params: {
			userId: userId, //投票用户id （必传）
			userType: 0, //用户类型（0-iptv 1-微信）（必传）
			addBaby: playerId, //小朋友id（必传）
			authStatus:authStatus,//订购状态
			creditFrom: creditFrom //票数来源：0,iptv未订购用户；1，iptv订购用户；2，微信；3，转发
		},
		headerName: "x-v-p",//加密字段请求头名称
		headerValue: keys,//请求头的值
		success: function (res) {
			fn && fn(res);
		},
		fail: function () {
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
	if (r != null)
		return unescape(r[2]);
	return null;
};

/*
 *不足六位自动补全0
 * num传入的数字，n需要的字符长度
 */
function PrefixInteger(num, n) {
	return (Array(n).join(0) + num).slice(-n);
}
/**
 * 获取ajax请求结果
 * voteOption = {
 *      "requestUrl": 请求地址
 *      "type": 请求类型(post/get)
 *      "success": function(data){}请求成功后的回调方法
 *      "fail": function(data){}请求失败后的回调方法
 *  }
 * @param voteOption
 */
function getAjaxResult(voteOption) {
	ajax.init({
		url: voteOption.requestUrl,
		method: "get",
		params: voteOption.params,
		async: true,
		contentType: "application/json",
		beforeSend: function (xhr) {//发送请求前调用方法 可以设置请求头
			xhr.setRequestHeader(voteOption.headerName, voteOption.headerValue);
		},
		success: function (res) {
			voteOption.success && voteOption.success(res);
		},
		fail: function (status) {
			voteOption.fail && voteOption.fail();
		}
	});
};
