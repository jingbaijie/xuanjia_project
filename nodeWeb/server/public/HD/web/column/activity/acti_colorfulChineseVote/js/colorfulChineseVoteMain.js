/*
*获取选手基本信息渲染右侧列表（选手图片、编号、姓名、当前票数），按上页、下页键进行翻页；
*获取剩余票数(每日5票)
*点击【投TA一票】按钮：+1动画执行、选手票数增加；若剩余票数<=0,弹窗提示；
*光标移动到选手图片上点击，根据传递选手Id跳转全屏播放页；跳转原路返回逻辑；
*获取排行榜，前10名选手信息渲染到页面（名次、姓名），点击【投TA一票】按钮：+1动画执行、选手票数增加，若右侧展示的选手中有相应的选手，数量增加；若剩余票数<=0,弹窗提示；
*搜索框内文字，从右往左循环滚动，获焦点击搜索框时，搜索键盘弹出；
*键盘上点击删除,删除一个字符，点击完成（请求搜索结果）或者按返回键键盘收起，焦点落在搜索框内；搜索框旁边的为清除键（请求搜索结果）；
*活动详情页面：播放小视频；
*/
function colorFulChinese() {
    this.rankButton = {};
    this.listVoteButton = {};
    this.videoButton = {};
    this.keyBoardButton = {};
    this.playerData = [];//选手数据列表
    this.pages = 0;//获取的数据页数
    this.current = 1;//当前第几页
    this.rankListData = [];//排行榜列表数据
    this.textScrollAni = null;//输入框中文字滚动定时器
    this.remainVotes = 0;//剩余票数
    this.playerName = "";//选手姓名
    this.playerId = "";//选手编号
    this.enterInit = true;//初始化页面标记
    this.addVotesTimer = null;//投票动画定时器
    this.tipShow = false;//弹窗是否显示，默认不显示
    this.keyBoardShow = false;//键盘是否显示，默认不显示
    this.firstInput = true;//第一次输入，默认是第一次
    this.initFunc();//页面初始化
}
colorFulChinese.prototype = {
    constructor: colorFulChinese,
    initFunc: function () {
        var _this = this;
        this.playerId = "";
        this.playerName = "";
        this.current = 1;
        //输入框滚动字幕
        this.searchInputScroll();
        // 创建页面焦点数组
        this.createButtons();
        //渲染排行榜数据（按照票数排序）
        this.rankListShow(this.playerId, this.playerName, this.current);
        //获取剩余票数
        this.getRemainVotes();
        // 键盘页面元素渲染
        this.keyBoardDom();
    },
    searchInputScroll: function () {
        this.textScrollAni = setInterval(function () {
            var searchInputText = document.getElementById("searchInput");
            var start = searchInputText.innerHTML.substring(0, 1);
            var end = searchInputText.innerHTML.substring(1);
            document.getElementById("searchInput").innerHTML = end + start;
        }, 400);
    },
    createButtons: function () {
        for (var i = 0; i < 10; i++) {
            this.rankButton = {
                id: "hands_x0_y0_rankVoteBtn" + i + "Focus_",
                clickHandler: "javascript:colorFulChineseVote.voteFunc(0," + i + ")",
                left: "disable",
                right: "hands_x0_y0_video0Focus_",
                up: "hands_x0_y0_rankVoteBtn" + (i - 1) + "Focus_",
                down: "hands_x0_y0_rankVoteBtn" + (i + 1) + "Focus_",
                focusType: 7
            }
            if (i == 0) {
                this.rankButton.up = "hands_x0_y0_ruleBtnFocus_";
            } else if (i >= 5) {
                this.rankButton.right = "hands_x0_y0_video4Focus_";
                if (i == 9) {
                    this.rankButton.down = "disable";
                }
            }
            buttons.push(this.rankButton);
        }
        for (var j = 0; j < 8; j++) {
            this.videoButton = {
                id: "hands_x0_y0_video" + j + "Focus_",
                clickHandler: "javascript:colorFulChineseVote.videoPlayerJump("+j+")",
				otherFocusEvent:"javascript:colorFulChineseVote.videoPlayerFocusEvent("+j+")",
				otherBlurEvent:"javascript:colorFulChineseVote.videoPlayerBlurEvent("+j+")",
                left: "hands_x0_y0_video" + (j - 1) + "Focus_",
                right: "hands_x0_y0_video" + (j + 1) + "Focus_",
                up: "hands_x0_y0_voteBtn" + (j - 4) + "Focus_",
                down: "hands_x0_y0_voteBtn" + j + "Focus_",
                focusType: 7
            }
            this.listVoteButton = {
                id: "hands_x0_y0_voteBtn" + j + "Focus_",
                clickHandler: "javascript:colorFulChineseVote.voteFunc(1," + j + ")",
                left: "hands_x0_y0_voteBtn" + (j - 1) + "Focus_",
                right: "hands_x0_y0_voteBtn" + (j + 1) + "Focus_",
                up: "hands_x0_y0_video" + j + "Focus_",
                down: "hands_x0_y0_video" + (j + 4) + "Focus_",
                focusType: 7
            }
            if (j < 4) {
                this.videoButton.up = "hands_x0_y0_searchFocus_";
                if (j == 0) {
                    this.videoButton.left = "hands_x0_y0_rankVoteBtn0Focus_";
                    this.listVoteButton.left = "hands_x0_y0_rankVoteBtn3Focus_";
                } else if (j == 3) {
                    this.listVoteButton.right = "disable";
                }
            }
            if (j >= 4) {
                this.listVoteButton.down = "disable";
                if (j == 4) {
                    this.videoButton.left = "hands_x0_y0_rankVoteBtn5Focus_";
                    this.listVoteButton.left = "hands_x0_y0_rankVoteBtn8Focus_";
                } else if (j == 7) {
                    this.videoButton.right = "disable";
					this.videoButton.rightEvent="javascript:colorFulChineseVote.pageDownFunc()";
                    this.listVoteButton.right = "disable";
					this.listVoteButton.down = "hands_x0_y0_nextBtnFocus_";
                }
            }
            buttons.push(this.videoButton);
            buttons.push(this.listVoteButton);
        }
        for (var k = 0; k < 36; k++) {
            this.keyBoardButton = {
                id: "hands_x0_y0_key" + k + "Focus_",
                clickHandler: "javascript:colorFulChineseVote.keyClick(" + k + ")",
                left: "hands_x0_y0_key" + (k - 1) + "Focus_",
                right: "hands_x0_y0_key" + (k + 1) + "Focus_",
                up: "hands_x0_y0_key" + (k - 10) + "Focus_",
                down: "hands_x0_y0_key" + (k + 10) + "Focus_",
                focusType: 7
            }
            if (k < 10) {
                this.keyBoardButton.up = "disable";
            } else if (k >= 30 || k == 28 || k == 29) {
                this.keyBoardButton.down = "disable";
                if (k == 35) {
                    this.keyBoardButton.right = "hands_x0_y0_keyDeleteBtnFocus_";
                }
            } else if (k == 26) {
                this.keyBoardButton.down = "hands_x0_y0_keyDeleteBtnFocus_";
            } else if (k == 27) {
                this.keyBoardButton.down = "hands_x0_y0_keyFinishBtnFocus_";
            }
            if (k % 10 == 0) {
                this.keyBoardButton.left = "disable";
            }
            if (k == 9 || k == 19 || k == 29) {
                this.keyBoardButton.right = "disable";
            }
            buttons.push(this.keyBoardButton);
        }
    },
    pageInfoShow: function (playerId, playerName, current) {
        var _this = this;
        // 获取选手列表信息>>>初始化选手信息第一页八条数据(按照报名时间排序)>>>翻页传入不同的页码
        getAllpalyerList(playerId, playerName, current, 8, 0, function (res) {
            if (res.errorCode == 1000 && res.data.records.length > 0) {
                _this.playerData = res.data.records;
                _this.pages = res.data.pages;
                _this.current = res.data.current;
                //选手信息列表页面元素创建
                _this.createPlayerList();
                //初始化页面焦点始终落在排行榜第一个按钮
                if (_this.enterInit) {
                    //焦点初始化
					PAGE.focusInit();
					if(CT.getCookie("videoFocusId")){
						PAGE.changeFocus(CT.getCookie("videoFocusId"));
					}else{						
						PAGE.changeFocus("hands_x0_y0_video0Focus_");						
					} 
					_this.enterInit = false;//初始化页面结束
                } else {
                    // 上一次焦点是落在右侧并且现在对应的焦点页面元素存在,则落焦在上次焦点，否则在视频框第一个;
                    //上次焦点不在右侧列表上，上下翻页焦点不受影响
                    if (curFocus.FocusID.indexOf("video") > -1 || curFocus.FocusID.indexOf("hands_x0_y0_voteBtn") > -1) {
                        if (CT.$(curFocus.FocusID)) {
                            PAGE.changeFocus(curFocus.FocusID);
                        } else {
                            PAGE.changeFocus("hands_x0_y0_video0Focus_");
                        }
                    }
                }
            }
        });
    },
    createPlayerList: function () { 
        var playerDataHTML = "";
        document.getElementById("listUl").innerHTML = playerDataHTML;
        for (var i = 0; i < this.playerData.length; i++) {
            playerDataHTML += '<li><div class="videoPart" style="width:206px;height:156px;"><img src="' + this.playerData[i].playerAvatar + '" alt="" style="position:absolute;left:0px;top:0px;width:206px;height:156px;">';
            playerDataHTML += '<img src="img/videoKuang.png" alt="" class="videokuang"><img src="img/videoIcon.png" alt="" class="videoIcon" id="videoIcon' + i + '" style="visibility:hidden;">';
            playerDataHTML += '<div class="videoText" id="videoText'+i+'" style="visibility:hidden;">点击图片可全屏观看</div><div class="playerInfo"><span class="playerNumber">' + this.playerData[i].playerId + '</span><span class="playerName">' + this.playerData[i].playerName + '</span></div>';
            playerDataHTML += '<!-- 视频焦点 --><div id="hands_x0_y0_video' + i + 'Focus_" class="hands_x0_y0_videoFocus_"><img src="img/videoFocus1.png" alt="" id="video' + i + 'Focus" style="visibility:hidden;"></div></div>';
            playerDataHTML += '<div class="votePart"><div class="voteNUmBtn"><!-- 票数 --><div class="voteNum"><span id="voteNum' + i + '">' + this.playerData[i].playerVotes + '</span>票</div>';
            playerDataHTML += '<!-- 投票按钮 --><img src="img/voteBtn.png" alt="" class="voteBtn"><!-- 投票按钮文字 --><div class="voteBtnText">投TA一票</div></div>';
            playerDataHTML += '<div id="hands_x0_y0_voteBtn' + i + 'Focus_" class="hands_x0_y0_voteBtnFocus_" data-playerId="' + this.playerData[i].playerId + '"><img src="img/voteFocus1.png" alt="" id="voteBtn' + i + 'Focus" style="visibility:hidden;"></div></div></li>';
        }
        document.getElementById("listUl").innerHTML += playerDataHTML;
    },
    rankListShow: function (playerId, playerName, current) {
        var _this = this;
        //获取排行榜信息（按照票数排序）
        getAllpalyerList(playerId, playerName, current, 10, 1, function (res) {
            if (res.errorCode == 1000 && res.data.records.length > 0) {
                _this.rankListData = res.data.records;
                //排行榜列表页面元素创建
                _this.createRankList();
                // 渲染选手列表页面数据（按照报名时间排序）
                _this.pageInfoShow(playerId, playerName, current);
            }
        });
    },
    createRankList: function () {
        var rankListDataHTML = "";
        var rankIcon = "img/rankGeneralIcon.png";
        var rankIconClass = "rankIconGeneral";
        var rankNum = "";
        for (var i = 0; i < this.rankListData.length; i++) {
            if (i == 0) {//第一名
                rankIcon = "img/first.png";
                rankIconClass = "rankIcon";
            } else if (i == 1) {//第二名
                rankIcon = "img/second.png";
                rankIconClass = "rankIcon";
            } else if (i == 2) {//第三名
                rankIcon = "img/third.png";
                rankIconClass = "rankIcon";
            } else {
                rankIcon = "img/rankGeneralIcon.png";
                rankIconClass = "rankIconGeneral";
                rankNum = i + 1;
            }
            rankListDataHTML += '<li><div class="' + rankIconClass + '" style="background:url(' + rankIcon + ') no-repeat;background-size: 100% 100%;">' + rankNum + '</div>';
            rankListDataHTML += '<div class="playerName">' + this.rankListData[i].playerName + '</div><img src="img/voteBtn.png" alt="" class="voteBtn">';
            rankListDataHTML += '<div class="rankVoteBtnText">投TA一票</div>';
            rankListDataHTML += '<!-- 排行榜投票按钮光标 --><div id="hands_x0_y0_rankVoteBtn' + i + 'Focus_" class="hands_x0_y0_rankVoteBtnFocus_" data-playerId="' + this.rankListData[i].playerId + '">';
            rankListDataHTML += '<img src="img/voteFocus1.png" alt="" id="rankVoteBtn' + i + 'Focus" style="visibility: hidden;"></div></li>';
        }
        CT.$("rankListParent").innerHTML += rankListDataHTML;
    },
    /*
    *上页翻页:如果当前页不在第一页可以向上翻页
    */
    pageUpFunc: function () {
        if (this.current > 1) {
            this.current--;
            this.pageInfoShow(this.playerId, this.playerName, this.current);
        }
    },
    /*
    *下页翻页:如果下页有数据可以向下翻页(当前页数小于总页数)
    */
    pageDownFunc: function () {
        if (this.current < this.pages) {
            this.current++;
            this.pageInfoShow(this.playerId, this.playerName, this.current);
        }
    },
    keyBoardDom: function () {
        var letter26 = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var keyBoardHTML = CT.$("keyBoardBG").innerHTML;
        var numOrLetterText = 0;
        var liLeft;
        var liTop;
        var lineLeftArr = [];
        for (var i = 0; i < 36; i++) {
            if (i < 10) {
                numOrLetterText = i;
                liLeft = 100 * (i + 1);
                lineLeftArr.push(liLeft);
                liTop = 40;
            } else {
                // 换成字母
                numOrLetterText = letter26[i - 10];
                liLeft = lineLeftArr[i % 10];
                if (i >= 10 && i < 20) {
                    liTop = 100;
                } else if (i >= 20 && i < 30) {
                    liTop = 160;
                } else if (i >= 30 && i < 40) {
                    liTop = 220;
                }
            }
            keyBoardHTML += '<li style="width: 76px;height: 55px;position: absolute;left: ' + liLeft + 'px;top: ' + liTop + 'px;background:url(img/keyBoard/keyText.png) no-repeat;">';
            keyBoardHTML += '<div id="hands_x0_y0_key' + i + 'Focus_" style="position: absolute;left: 0px;top: 0px;">';
            keyBoardHTML += '<img src="img/keyBoard/keyFocus.png" alt="" id="key' + i + 'Focus" style="visibility: hidden;"></div>';
            keyBoardHTML += '<span id="key' + i + 'Text" style="position: absolute;left:32px;top: 10px;z-index: 2;color: #ffffff;font-size: 26px;">' + numOrLetterText + '</span></li>';
            CT.$("keyBoardBG").innerHTML = keyBoardHTML;
        }
    },
    /*
    *点击搜索框键盘弹出
    */
    keyBoardShowFunc: function () {
        CT.$("keyBoardBG").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_key0Focus_");
        this.keyBoardShow = true;//键盘显示
    },
    /*
    *获取当前用户剩余票数
    */
    getRemainVotes: function () {
        var _this = this;
        getPersonalCredits(function (res) {
            if (res.errorCode == "1000") {
                _this.remainVotes = res.data.creditsRemain;
				if(xjDataLog.getUserId()=="81200619290004345"){
					CT.writeInfo("剩余票数"+_this.remainVotes+"账号:"+xjDataLog.getUserId()+"userId:"+userId);
				}
            }
        });
    },
    /*
    *点击投票(type:点击的按钮类型（0:排行榜投票按钮；1：全部内容投票按钮）,index：点击的按钮角标)
    */
    voteFunc: function (type, index) {
        var _this = this;
        var votePlayerId = CT.$(curFocus.FocusID).getAttribute("data-playerId");
        if (this.remainVotes <= 0) {
            CT.$("tipBG").style.visibility = "visible";
            PAGE.changeFocus("hands_x0_y0_blankFocus_");
            this.tipShow = true;//弹窗显示
        } else {
            voteOperate(votePlayerId, function (res) {
                if (res.errorCode == "1000") {
                    _this.remainVotes--;
                    if (type == 1) {
                        CT.$("voteNum" + index + "").innerHTML = parseInt(CT.$("voteNum" + index + "").innerHTML) + 1;
                    } else if (type == 0) {
                        // 投票动画
                        _this.addVotesAni(index);
                        // 左侧投票，如果右侧有对应的选手，也票数+1
                        for (var m = 0; m < _this.playerData.length; m++) {
                            if (_this.playerData[m].playerId == votePlayerId) {
                                CT.$("voteNum" + m + "").innerHTML = parseInt(CT.$("voteNum" + m + "").innerHTML) + 1;
                            }
                        }
                    }
                }
            });
        }
    },
    /*
    *投票动画
    */
    addVotesAni: function (index) {
        var _this = this;
        var addVotesIndex = 1;
        this.addVotesTimer = setInterval(function () {
            if (addVotesIndex > 4) {
                CT.$("addVotes").src = "img/empty.png";
                clearInterval(_this.addVotesTimer);
                _this.addVotesTimer = null;
            } else {
                CT.$("addVotes").style.top = 10 + (index * 48) + "px";
                CT.$("addVotes").src = "img/add" + addVotesIndex + ".png";
                addVotesIndex++;
            }
        }, 200);
    },
    /*
    *点击字符：搜索
    */
    keyClick: function (ii) {
        //输入的第一个字符
        if (this.firstInput) {
            clearInterval(this.textScrollAni);
            this.textScrollAni = null;
            this.firstInput = false;//不是第一次输入
            CT.$("searchInput").innerHTML = "";
        }
        CT.$("searchInput").innerHTML = CT.$("searchInput").innerHTML + CT.$("key" + ii + "Text").innerHTML;
        this.fuzzySearch();
    },
    /*
    *删除按钮
    */
    keyDeleteFunc: function () {
        var searchText = CT.$("searchInput").innerHTML;
        if (searchText) {
            CT.$("searchInput").innerHTML = searchText.substring(0, searchText.length - 1);
        }
        this.fuzzySearch();
    },
    /*
    *模糊搜索
    */
    fuzzySearch: function () {
        var _this = this;
        var keyWords = CT.$("searchInput").innerHTML;
        var numReg = /[0-9]/;
        var letterReg = /[a-z]/i;
        this.playerId = "";
        this.playerName = "";
        this.current=1;
        if(numReg.test(keyWords.substring(0,1))){//判断第一个字符是数字
            this.playerId=keyWords;
        }else if(letterReg.test(keyWords.substring(0,1))){//判断第一个字符是字母
            this.playerName=keyWords;
        }
        getAllpalyerList(this.playerId, this.playerName, this.current, 8, 0, function (res) {
            if (res.errorCode == 1000 && res.data.records.length > 0) {
                _this.playerData = res.data.records;
                _this.pages = res.data.pages;
                //选手信息列表页面元素创建
                _this.createPlayerList();
            }
        });
    },
    /*
    *清空按钮
    */
    emptyFunc:function(){
       CT.$("searchInput").innerHTML="";
       this.fuzzySearch();
    },
    /*
    *键盘点击完成:收起键盘
    */
   keyFinishFunc:function(){
        backfunc();
   },
	/*
   *跳转全屏播放
   */
	videoPlayerJump:function(num){
		var _this = this;
		var params = {
				contentId: 299,
				cartoonId: this.playerData[num].playerCartoonId,
				videoId: this.playerData[num].playerVideoId,
				contentType: "video",
				action: "qcywActiPlayVideo",
				contentName: "七彩语文活动全屏播放"
		}		
		//CT.getAnterByIdOrAction(params);
		//记录返回		
		CT.setCookie("videoFocusId",curFocus.FocusID);
		PAGE.otherPageParam = "&contentId=" + params.contentId + "&contentEName=" + CT.requestValue("contentEName") + "&contentCName=" + CT.requestValue("contentCName") + "&cartoonId=" + params.cartoonId + "&curFocusId=" + curFocus.FocusID;
		CT.goPage();
		//CT.writeInfo(PAGE.otherPageParam);		
		//CT.writeInfo("122");
		//CT.writeInfo(AjaxConfig.projectUrl+"HD/web/column/activity/acti_colorfulChineseVote/playVideo/html/playVideo.html?contentId=15&contentEName=playvideo_2019v1&contentCName=全屏播放&contentType=video&cartoonId="+params.cartoonId+"&videoId="+params.videoId+"");
		//CT.commonJumpUrl(AjaxConfig.projectUrl+"HD/web/column/activity/acti_colorfulChineseVote/playVideo/html/playVideo.html?contentId=15&contentEName=playvideo_2019v1&contentCName=全屏播放&contentType=video&cartoonId="+params.cartoonId+"&videoId="+params.videoId+"");
		CT.getAnterByIdOrAction(params);
   },
	/*
   *跳转页面
   */
	jumpPage:function(index){
		CT.setCookie("videoFocusId",curFocus.FocusID);
		if(index==0){			
			CT.commonJumpUrl(AjaxConfig.projectUrl+"HD/web/column/activity/acti_colorfulChineseVote/colorfulChineseVoteRule.html?activityId="+CT.requestValue("activityId"));
		}
   },
	/*
   *下一页按钮上移事件:如果上方第八个选手存在，则上移至第八个，否则上移第一个
   */
   nextBtnUpEvent:function(){
	   var eighthPlay = CT.$("hands_x0_y0_voteBtn7Focus_");
		if(eighthPlay){
			PAGE.changeFocus("hands_x0_y0_voteBtn7Focus_");
		}else{
			PAGE.changeFocus("hands_x0_y0_video0Focus_");
		}
   },
	preBtnFunc:function(){
		this.pageUpFunc();
   },
	nextBtnFunc:function(){
		this.pageDownFunc();
   },
	videoPlayerFocusEvent:function(ii){
		CT.$("videoIcon"+ii+"").style.visibility="visible";
		CT.$("videoText"+ii+"").style.visibility="visible";		
   },
	videoPlayerBlurEvent:function(ii){
		CT.$("videoIcon"+ii+"").style.visibility="hidden";
		CT.$("videoText"+ii+"").style.visibility="hidden";
   },
	searchEmptyDownEvent:function(){
		var thirdPlayer = CT.$("hands_x0_y0_video3Focus_");
		if(thirdPlayer){
			PAGE.changeFocus("hands_x0_y0_video3Focus_");
		}else{
			PAGE.changeFocus("hands_x0_y0_video0Focus_");
		}
   }
}

function backfunc() {
    if (colorFulChineseVote.tipShow) {
        CT.$("tipBG").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_video0Focus_");
        colorFulChineseVote.tipShow = false;//弹窗显示
    } else if (colorFulChineseVote.keyBoardShow) {
        CT.$("keyBoardBG").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_searchFocus_");
        colorFulChineseVote.keyBoardShow = false;//键盘显示
    }else{
    	CT.delCookie("videoFocusId");
		CT.backPage();
	}
}

var colorFulChineseVote = new colorFulChinese();