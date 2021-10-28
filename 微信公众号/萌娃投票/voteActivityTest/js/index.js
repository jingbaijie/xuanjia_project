$(function() {
	//报名按钮点击跳转
	$(document).on("click", "#signUpBtn", function() {
		if($.cookie("weChatId")) {
			window.location.href = "signUp.html?vTime=" + new Date().getTime();
		}

	});
	//投票按钮点击跳转
	$(document).on("click", "#voteBtn", function() {
		if($.cookie("weChatId")) {
			window.location.href = "votePage.html?vTime=" + new Date().getTime();
		}
	});
	//用户须知按钮点击
	$(document).on("click", "#agreementBtn", function() {
		if($.cookie("weChatId")) {
			window.location.href = "agreementPage.html?vTime=" + new Date().getTime();
		}
	});
	//最萌宝贝轮播图
	var babyImg = 1;
	$("#babyPic").attr("src", "img/babypic/baby1.png")
	setInterval(function() {
		if(babyImg > 5) {
			babyImg = 1;
		}
		$("#babyPic").attr("src", "img/babypic/baby" + babyImg + ".png")
		babyImg++;
	}, 1000);
});