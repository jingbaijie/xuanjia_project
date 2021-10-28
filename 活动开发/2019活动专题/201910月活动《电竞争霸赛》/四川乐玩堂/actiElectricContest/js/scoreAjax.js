//获取两个固定用户积分（两队总计分）
function gettotalScore(userId, activityId, fn) {
	var vTime = new Date().getTime();
	ajax.init({
		url: actiObj.getUserDataListUrl,
		method: "get",
		async: "true",
		params: {
			"userId": userId,
			"activityId": activityId,
			"vTime":vTime
		},
		contentType: "json",
		success: function(data) {
			if(fn) {
				fn(data);
			}
		},
		fail: function() {

		}
	});
}

//上传两固定用户积分(两队总计分)
function settotalScore(userId, activityId, totalScore, fn) {
	var vTime = new Date().getTime();
	ajax.init({
		url: actiObj.setUserDataListUrl,
		method: "get",
		async: "true",
		params: {
			"userId": userId,
			"activityId": activityId,
			"user_acti_data": totalScore,
			"vTime":vTime
		},
		contentType: "json",
		success: function(data) {
			if(fn) {
				fn(data);
			}
		},
		fail: function() {

		}
	});
}