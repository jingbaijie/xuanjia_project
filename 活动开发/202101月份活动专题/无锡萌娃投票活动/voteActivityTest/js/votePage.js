//获取全部选手列表
//	alert(window.navigator.userAgent);
var pageNum = 1;
var playerId = "";
var pages; //总页数
var isClick = true; //点击投票是否可以点击
//$("body").css("height", window.innerHeight);
getAllpalyerList(playerId, pageNum, function(res) {
	if(res.errorCode == "1000") {
		var html = "";
		var playerList = res.data.records;
		pages = res.data.pages; //返回总页数
		for(var i = 0; i < playerList.length; i++) {
			var imgSrc;
			var playerId = PrefixInteger(playerList[i].playerId, 6);
			if(playerList[i].avatar) {
				imgSrc = imgUrl + playerList[i].avatar;
			} else {
				imgSrc = "img/votePage/headPic.jpg";
			}
			html += '<li><div class="innerBox"><div class="headPic" data-playerId = "' + playerList[i].playerId + '"><img src="' + imgSrc + '"/></div>';
			html += '<div class="babyInfo"><div class="showId_name"><span>ID:' + playerId + '</span><span>' + playerList[i].playerName + '</span></div><div class="showIntroduction">' + playerList[i].playerIntroduction + '</div>';
			html += '<div class="showVotes"><span>月票:<span class="monthNum">' + playerList[i].playerMonthlyCredits + '</span></span><span>总票:<span class="totalNum">' + playerList[i].playerYearlyCredits + '</span></span></div>';
			html += '<div class="voteBtn"><img src="img/votePage/voteBtn@3x.png" class="voteBtnImg" data-playerId = "' + playerList[i].playerId + '"/></div></div></div><!--名次标识--><div class="levelIcon">' + playerList[i].rank + '</div></li>';
		}
		$(".voteList").append(html);
	}
});

/*
 * 滚动翻页，判断是否滑动到底部
 */
//滚动触发
$(".voteList").scroll(function() {
	if($(".voteList>li").length != 1) {
		//元素的整体高度
		var totalHeight = $(".voteList")[0].scrollHeight;
		//滚动条的垂直偏移
		var scrollTop = $(".voteList").scrollTop();
		//元素的可见高度
		var clientHeight = $(".voteList")[0].clientHeight;
		if(totalHeight - scrollTop == clientHeight) {
			console.log("到底了");
			pageNum += 1;
			if(pageNum <= pages) {
				getAllpalyerList(playerId, pageNum, function(res) {
					if(res.errorCode == "1000") {
						var html = "";
						var playerList = res.data.records;
						for(var i = 0; i < playerList.length; i++) {
							var imgSrc;
							var playerId = PrefixInteger(playerList[i].playerId, 6);
							if(playerList[i].avatar) {
								imgSrc = imgUrl + playerList[i].avatar;
							} else {
								imgSrc = "img/votePage/headPic.jpg";
							}
							html += '<li><div class="innerBox"><div class="headPic" data-playerId = "' + playerList[i].playerId + '"><img src="' + imgSrc + '"/></div>';
							html += '<div class="babyInfo"><div class="showId_name"><span>ID:' + playerId + '</span><span>' + playerList[i].playerName + '</span></div><div class="showIntroduction">' + playerList[i].playerIntroduction + '</div>';
							html += '<div class="showVotes"><span>月票:<span class="monthNum">' + playerList[i].playerMonthlyCredits + '</span></span><span>总票:<span class="totalNum">' + playerList[i].playerYearlyCredits + '</span></span></div>';
							html += '<div class="voteBtn"><img src="img/votePage/voteBtn@3x.png" class="voteBtnImg" data-playerId = "' + playerList[i].playerId + '"/></div></div></div><!--名次标识--><div class="levelIcon">' + playerList[i].rank + '</div></li>';
						}
						$(".voteList").append(html);
					}
				});
			}
		}
	}
});

//获取剩余票数
getPersonalCredits(function(res) {
	if(res.errorCode == "1000") {
		$("#surplusVotes").html(res.data.creditsRemain);
	}
});

//点击投票
$(document).on('click', '.voteBtnImg', function(e) {
	if(isClick) {
		isClick = false; //禁止点击
		e.stopPropagation(); //阻止事件冒泡
		var aa = $(this);
		var playerId = $(this).attr("data-playerId"); //当前点击的选手playerId
		var monthNum = parseInt($(this).parent().siblings(".showVotes").find(".monthNum").html()); //月票
		var totalNum = parseInt($(this).parent().siblings(".showVotes").find(".totalNum").html()); //年票
		var surplusVotes = parseInt($("#surplusVotes").html());
		if(surplusVotes == "0") {
			layer.open({
				content: '今日票数已用完',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
			isClick = true;
		} else {
			$("#surplusVotes").html(surplusVotes - 1); //剩余票数展示	
			voteOperate(playerId, function(res) {
				if(res.errorCode == "1000") { //投票成功,票数增加
					var html = '<span>月票:<span class="monthNum">' + (monthNum + 1) + '</span></span><span>总票:<span class="totalNum">' + (totalNum + 1) + '</span></span>';
					aa.parent().siblings(".showVotes").empty().append(html);
					layer.open({
						content: '投票成功',
						skin: 'msg',
						time: 2 //2秒后自动关闭
					});
					isClick = true;
				}
			});
		}
	}

});

//点击搜索
$("#searchBtn").click(function() {
	var keyWords = $("#searchInput").val();
	pageNum = 1;
	getAllpalyerList(keyWords, pageNum, function(res) {
		if(res.errorCode == "1000") {
			var html = "";
			var playerList = res.data.records;
			for(var i = 0; i < playerList.length; i++) {
				var imgSrc;
				var playerId = PrefixInteger(playerList[i].playerId, 6);
				if(playerList[i].avatar) {
					imgSrc = imgUrl + playerList[i].avatar;
				} else {
					imgSrc = "img/votePage/headPic.jpg";
				}
				if(playerList.length > 0) {
					html += '<li><div class="innerBox"><div class="headPic" data-playerId = "' + playerList[i].playerId + '"><img src="' + imgSrc + '"/></div>';
					html += '<div class="babyInfo"><div class="showId_name"><span>ID:' + playerId + '</span><span>' + playerList[i].playerName + '</span></div><div class="showIntroduction">' + playerList[i].playerIntroduction + '</div>';
					html += '<div class="showVotes"><span>月票:<span class="monthNum">' + playerList[i].playerMonthlyCredits + '</span></span><span>总票:<span class="totalNum">' + playerList[i].playerYearlyCredits + '</span></span></div>';
					html += '<div class="voteBtn"><img src="img/votePage/voteBtn@3x.png" class="voteBtnImg" data-playerId = "' + playerList[i].playerId + '"/></div></div></div><!--名次标识--><div class="levelIcon">' + playerList[i].rank + '</div></li>';
				}
			}
			if(html) {
				$(".voteList").empty();
				$(".voteList").append(html);
			} else {
				layer.open({
					content: '您搜索的选手不存在',
					skin: 'msg',
					time: 2 //2秒后自动关闭
				});
			}
		}
	});
});

//转发增加票数
function shareFunc() {
	//转发增加票数
	addPoll(function(res) {
		if(res.errorCode == "1000") {
			var surplusVotes = parseInt($("#surplusVotes").html());
			$("#surplusVotes").html(surplusVotes + 1); //票数增加
		} else if(res.errorCode == "1036") {
			layer.open({
				content: '今日票数已达上限',
				skin: 'msg',
				time: 2 //2秒后自动关闭
			});
		}
	});

}
//软键盘恢复
$("#searchInput").on('blur', function() {
	window.scroll(0, 0);
});

//点击头像进入对应的萌娃档案页面
$(document).on("click", ".headPic", function() {
	var playerId = $(this).attr("data-playerId");
	window.location.href = "personalFiles.html?playerId=" + playerId;
});

//解决手机返回回退页面不刷新
window.onpageshow = function(event) {
	if(event.persisted || window.performance && window.performance.navigation.type == 2) {
		window.location.reload();
	}
}
