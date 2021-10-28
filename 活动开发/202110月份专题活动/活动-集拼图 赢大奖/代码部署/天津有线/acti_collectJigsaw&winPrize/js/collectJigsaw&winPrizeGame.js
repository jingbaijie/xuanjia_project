/**
 * 2、集拼图页面逻辑（当前碎片数判断弹窗）
 * 首次进入页面，获得9个碎片，提示订购增加90碎片:
 * （1）去订购：跳转订购页
 *      订购成功返回：获得99个碎片，弹出观看片单获得碎片线索弹窗》》》看片单》》》看片单返回:碎片线索的获得概率1%，被老鼠偷走的概率29%，未获得线索的概率70%；
 *      订购失败返回：正常返回逻辑,返回到活动根据当前碎片数判断弹窗
 * （2）返回：弹出好运卡，获得80个碎片》》》确定或者返回》》》弹出观看片单获得碎片线索弹窗》》》看片单》》》看片单返回》》》未订购用户在获得89个碎片之后，获得碎片线索的概率10%，被老鼠偷走的概率25%，未获得线索的概率65%，未订购用户前期可获得大量碎片线索集齐碎片，在碎片达到97-98个时，展示被老鼠偷走5个，需要订购之后才能拿回线索
 *      返回：活动挽留页：退出活动/留在集拼图页
 *      订购：跳转订购页面，进入步骤（1）
 * userdata数据格式：{"seenSheet":[1,2,4],"date":"0819","totalPieces":100,"currentClue":3}
 */
function collectJigSawGame() {
    this.restart = CT.requestValue("restart") || 0;//是否重置游戏页数据
    this.bottomRecName = "actiCollectPuzzleCartoonRec";//底部片单推荐专题名称
    this.bottomRecList = [];//底部片单推荐列表
    this.getProbabilityParams = "collectPuzzleProbability";//获取后台配置获得碎片线索概率的参数名称
    this.isOrder = 0;//是否订购活动
    this.prizeIndex = CT.requestValue("prizeIndex") || 1;//首页选择的奖品下标
    this.prizeId = 0;//奖品id
    this.prizeList = [];//奖品列表
    this.totalRecNum = 0;//片单推荐总数
    this.sheetShowArr = [];//最终展示的片单下标
    this.koiCardShow = false;//锦鲤卡是否展示
    this.goodLuckCard = false;//好运卡是否展示
    this.toSheetTip = false;//看片单提示弹窗是否显示
    this.stolen5Tip = false;//碎片被偷走5个弹窗是否显示
    this.isGiveUpTip = false;//退出挽留页是否展示
    this.isRuleTipShow = false;//规则弹窗是否显示
    this.seenSheetArr = [];//已看片单
    this.lastSheet = 0;//上次看的片单，0表示不是从片单返回，1表示从片单返回但是该片单已看,有id表示从片单返回且不是重复片单
    this.lastDate = 0;//上次看片单的时间
    this.baseProbability = 1000;//概率基数
    this.getPiecesClueOdds = 0;//获得碎片线索概率
    this.stolenClueOdds = 0;//被老鼠偷走碎片线索概率
    this.noPiecesClueOdds = 0;//未获得碎片线索概率
    this.getPiecesClueTip = false;//获得碎片线索弹窗
    this.stolenClueTip = false;//被偷走碎片线索的弹窗
    this.noPiecesCluetip = false;//未获得碎片线索弹窗
    this.myPrizeTip = false;//我的奖品弹窗是否展示
    this.currentClueNum = 0;//当前线索数量
    this.currentPiecesNum = 0;//当前碎片数量
    this.leftCartoonImg = 1;//左侧卡通动画变量
    this.init();
}
var actiContact = new actiContactModule("actiContact");
collectJigSawGame.prototype = {
    constructor: collectJigSawGame,
    init: function () {
        var _this = this;
        // 获取当天已观看的片单情况和是否为片单返回
        actiObj.getUserDataList(function (userData) {
            if (userData.errorCode == 1000 && _this.restart != 1) {
                var userDataArr = CT.stringToJson(userData.data.userActiData);
                _this.lastDate = userDataArr["date"] || 0;//上次看片单的时间
                _this.seenSheetArr = userDataArr["seenSheet"] || 0;//已看片单数组
                _this.currentClueNum = userDataArr["currentClue"] || 0;//当前线索总数
                _this.currentPiecesNum = userDataArr["totalPieces"] || 0;//当前碎片总数
            }
            actiObj.getUserCredit(function (userCredit) {
                if (userCredit.errorCode == 1000 && _this.restart != 1) {
                    _this.lastSheet = userCredit.data.creditNum;
                }
                actiObj.getUserPrizeInfo(function (myPrizeRes) {
                    actiObj.getPrizeUserInfo(function (res) {
                        if (res.errorCode == 1000 && res.data.records.length > 0) {
                            prizeUserList = res.data.records;
                            for (var i = 0; i < prizeUserList.length; i++) {
                                prizeUserHTML += "用户" + prizeUserList[i].userId.substr(0, 1) + "****" + prizeUserList[i].userId.substr(prizeUserList[i].userId.length - 4) + "获得了" + prizeUserList[i].prizeCname + "；";
                            }
                            CT.$("prizeUserInfoList").innerHTML = prizeUserHTML;
                        }
                        // 焦点初始化                    
                        actiContact.init("prizeTip", option, function () {
                            PAGE.focusInit();
                            if (myPrizeRes.errorCode == 1000 && myPrizeRes.data && myPrizeRes.data.length > 0) {//获得奖品
                                PAGE.enableFocus("hands_x0_y0_myPrizeFocus_");
                                CT.$("myPrizeCover").style.visibility = "hidden";
                            } else {//没获奖禁用该焦点
                                PAGE.disableFocus("hands_x0_y0_myPrizeFocus_");
                                CT.$("myPrizeCover").style.visibility = "visible";
                            }
                            queryUserOrderActivity({ contentId: actiActivityId, userId: actiUserId || xjDataLog.getSmartCardid() }, function (orderRes) {
                                if (orderRes.errorCode == 1000) {
                                    _this.isOrder = orderRes.data.isOrder;
                                }
                                // if (xjDataLog.getSmartCardid() == "8120010925967579") {
                                //     _this.isOrder = 1;
                                // }
                                if (_this.isOrder == 0) {//未订购活动
                                    if (_this.currentPiecesNum == 0) {//当前用户是0个碎片，弹出锦鲤卡，获得9个碎片
                                        // 页面展示9个碎片
                                        _this.currentPiecesNum += 9;
                                        actiObj.setUserDataList(CT.jsonToString({ "seenSheet": _this.seenSheetArr, "date": _this.lastDate, "totalPieces": _this.currentPiecesNum, "currentClue": _this.currentClueNum, "prizeIndex": _this.prizeIndex }));
                                        //拼图进度展示
                                        _this.progressShow(_this.currentPiecesNum);
                                        setTimeout(function () {
                                            _this.koiCardShow = true;
                                            CT.$("koiCard").style.visibility = "visible";
                                            PAGE.changeFocus("hands_x0_y0_koiCardFocus_");
                                            //关于滚动奖品列表的判断
                                            if (prizeUserList.length > 0) {
                                                CT.$("prizeUserInfo").style.visibility = "visible";
                                                if (prizeUserList.length >= 3) {
                                                    _this.scrollPrizeUserList();//奖品滚动
                                                }
                                            }
                                        }, 1000);
                                    } else if (_this.currentPiecesNum == 9) {//订购失败回到拼图页面，展示好运卡
                                        _this.goodLuckCardShow();
                                    } else {
                                        // 当天如果是看过片单回来的展示获得线索情况弹窗，否则提示去看片单集线索
                                        _this.backFromSheetJudge();//判断是否从片单返回、是否从重复片单返回
                                    }
                                } else {//活动订购成功，提示看片单获得线索
                                    if (_this.currentPiecesNum == 99) {//当前用户是99个碎片，提示看片单集线索
                                        _this.backFromSheetJudge();//判断是否从片单返回、是否从重复片单返回
                                    } else if (_this.currentPiecesNum == 100) {//100个碎片 
                                        PAGE.enableFocus("hands_x0_y0_myPrizeFocus_");
                                        _this.progressShow(_this.currentPiecesNum);
                                        // 我的奖品状态
                                        CT.$("myPrizeCover").style.visibility = "hidden";
                                        PAGE.changeFocus("hands_x0_y0_myPrizeFocus_");
                                        if (myPrizeRes.errorCode != 1000 && !myPrizeRes.data) {//没有上传过作品
                                            // 上传我的奖品
                                            actiObj.setPrize(_this.prizeId);
                                        }
                                    } else {//订购成功回来展示99个碎片图片和文字信息
                                        _this.currentPiecesNum = 99;
                                        actiObj.setUserDataList(CT.jsonToString({ "seenSheet": _this.seenSheetArr, "date": _this.lastDate, "totalPieces": _this.currentPiecesNum, "currentClue": _this.currentClueNum, "prizeIndex": _this.prizeIndex }));
                                        _this.progressShow(_this.currentPiecesNum);
                                        CT.$("puzzleAreaCover").style.left = "-4px";
                                        CT.$("puzzleAreaCover").style.left = "-2px";
                                        setTimeout(function () {
                                            _this.toSheetTipShow();
                                        }, 2000);
                                    }
                                }
                            })
                        });
                    });
                });
            });
        });
        // 随机展示四个片单
        interface.findRecCommonPageInfo({ "contentName": _this.bottomRecName }, function (bottomRecRes) {
            if (bottomRecRes.errorCode == 1000) {
                var totalNumArr = [];
                _this.bottomRecList = bottomRecRes.data.recommend_1;
                _this.totalRecNum = bottomRecRes.data.recommend_1.length;//推荐的片单数
                for (var i = 0; i < _this.totalRecNum; i++) {
                    totalNumArr.push(i);
                }
                for (var j = 0; j < 4; j++) {
                    var randomIndex = Math.floor(Math.random() * totalNumArr.length);//如总数12,取[0,11]  
                    _this.sheetShowArr.push(totalNumArr[randomIndex]);
                    totalNumArr.splice(randomIndex, 1);
                }
            }
            for (var k = 0; k < _this.sheetShowArr.length; k++) {
                CT.$("recommendSheet").innerHTML += '<li><img src="' + AjaxConfig.origin + _this.bottomRecList[_this.sheetShowArr[k]].recommendPic.picPath + '" alt=""></li>';
            }
        });
        // 获取当前活动的奖品列表,展示我领取的奖品信息，渲染页面拼图信息
        actiObj.getActivityPrize(function (prizeInfoRes) {
            if (prizeInfoRes.errorCode == 1000 && prizeInfoRes.data.records.length > 0) {
                _this.prizeList = prizeInfoRes.data.records;
                if (_this.prizeIndex == 1) {//龙虎战机王
                    _this.prizeId = _this.prizeList[0].id;
                    CT.$("puzzleAreaImg").src = "img/gamePage/2.png";
                    CT.$("myPrizeImg").style.backgroundImage = "url(img/mainPage/prize2.png)";
                } else if (_this.prizeIndex == 2) {//热浪战机王
                    _this.prizeId = _this.prizeList[1].id;
                    CT.$("puzzleAreaImg").src = "img/gamePage/1.png";
                    CT.$("myPrizeImg").style.backgroundImage = "url(img/mainPage/prize1.png)";
                }
            }
        });
        // 左侧卡通动画
        setInterval(function () {
            if (_this.leftCartoonImg > 4) {
                _this.leftCartoonImg = 1;
            }
            CT.$("leftCartoon").src = "img/gamePage/leftCartoon/" + _this.leftCartoonImg + ".png";
            _this.leftCartoonImg++;
        }, 200);
    },
    /**
     * 获奖列表滚动
     */
    scrollPrizeUserList: function () {
        scrollPrizeAni = setInterval(function () {
            var start = prizeUserHTML.substr(0, 1);
            var end = prizeUserHTML.substr(1);
            prizeUserHTML = end + start;
            CT.$("prizeUserInfoList").innerHTML = prizeUserHTML;
        }, 500);
    },
    /**
     * 判断是否从片单返回、是否从重复片单返回
     * backFromSheetJudge
     */
    backFromSheetJudge: function () {
        var _this = this;
        var index = 0;
        var nowDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当前时间
        // 获取后台配置概率数据：系统管理》》》参数管理
        interface.getSystemConfigByKey(function (configRes) {
            if (configRes.errorCode == 1000) {
                if (_this.isOrder == 0) {//未订购活动
                    index = 0;
                } else if (_this.isOrder == 1) {//已订购活动
                    index = 1;
                }
                _this.getPiecesClueOdds = CT.stringToJson(configRes.data.configValue)[index].get;
                _this.stolenClueOdds = CT.stringToJson(configRes.data.configValue)[index].stolen;
                if (nowDate == _this.lastDate) {//当天
                    if (_this.currentPiecesNum >= 97 && _this.currentPiecesNum < 99 && _this.lastSheet != 0 && _this.isOrder == 0) {//未订购用户在碎片达到97-98个时，展示被老鼠偷走5个，需要订购之后才能拿回线索
                        _this.currentPiecesNum -= 5;
                        actiObj.setUserDataList(CT.jsonToString({ "seenSheet": _this.seenSheetArr, "date": _this.lastDate, "totalPieces": _this.currentPiecesNum, "currentClue": _this.currentClueNum, "prizeIndex": _this.prizeIndex }));
                        _this.stolen5Tip = true;
                        CT.$("stolen5Tip").style.visibility = "visible";
                        PAGE.changeFocus("hands_x0_y0_stolen5BtnFocus_");
                        //关于滚动奖品列表的判断
                        if (prizeUserList.length > 0) {
                            CT.$("prizeUserInfo").style.visibility = "visible";
                            if (prizeUserList.length >= 3) {
                                _this.scrollPrizeUserList();//奖品滚动
                            }
                        }
                    } else if (_this.lastSheet == _this.seenSheetArr[_this.seenSheetArr.length - 1]) {//从片单返回且不是重复片单
                        // 计算线索概率（有机会获得线索,获得碎片线索的概率1%，被老鼠偷走碎片的概率29%，未获得线索的概率70%）
                        var randomNum = Math.floor(Math.random() * _this.baseProbability);
                        if (randomNum <= _this.getPiecesClueOdds) {//获得碎片线索的概率
                            _this.getPiecesClueTip = true;
                            CT.$("getClueTip").style.visibility = "visible";
                            _this.currentClueNum += 1;
                            if (_this.currentClueNum > 3) {
                                _this.currentClueNum = 1;
                            }
                            if (_this.currentClueNum == 3) {
                                _this.currentPiecesNum += 1;
                            }
                            if (_this.currentPiecesNum == 100) {
                                // 上传我的奖品
                                actiObj.setPrize(_this.prizeId, function (data) {
                                    if (data.errorCode == 1000) {
                                        // 我的奖品状态
                                        CT.$("myPrizeCover").style.visibility = "hidden";
                                        PAGE.enableFocus("hands_x0_y0_myPrizeFocus_");
                                    }
                                });
                            }
                            // 上传碎片和线索数据
                            actiObj.setUserDataList(CT.jsonToString({ "seenSheet": _this.seenSheetArr, "date": _this.lastDate, "totalPieces": _this.currentPiecesNum, "currentClue": _this.currentClueNum, "prizeIndex": _this.prizeIndex }));
                            PAGE.changeFocus("hands_x0_y0_getClueBtnFocus_");
                        } else if (randomNum <= _this.stolenClueOdds && randomNum > _this.getPiecesClueOdds) {//被老鼠偷走线索的概率
                            _this.stolenClueTip = true;
                            CT.$("pityTip").style.visibility = "visible";
                            PAGE.changeFocus("hands_x0_y0_pityTipBtnFocus_");
                        } else {//未获得线索的概率
                            _this.noPiecesCluetip = true;
                            CT.$("noGetClue").style.visibility = "visible";
                            PAGE.changeFocus("hands_x0_y0_noGetClueBtnFocus_");
                        }
                    } else if (_this.lastSheet == 0) {//表示不是从片单返回,提示去看片单集线索
                        _this.toSheetTipShow();
                    } else if (_this.lastSheet == 1) {//从片单返回&&该片单今天已看,未得到线索弹窗
                        _this.noPiecesCluetip = true;
                        CT.$("noGetClue").style.visibility = "visible";
                        PAGE.changeFocus("hands_x0_y0_noGetClueBtnFocus_");
                    }
                    // 清除从片单返回的状态
                    _this.lastSheet = 0;
                    actiObj.setUserCredit(_this.lastSheet);
                } else {//不是当天，重置已看片单数据、从片单返回数据，提示看片单集线索
                    _this.seenSheetArr = [];
                    _this.lastSheet = 0;
                    _this.toSheetTipShow();
                }
                // 拼图进度展示
                _this.progressShow(_this.currentPiecesNum);
            }
        }, _this.getProbabilityParams);
    },
    /**
     * 跳转我的奖品
     */
    toMyPrize: function () {
        CT.$("prizeTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_telInputFocus_");
        this.myPrizeTip = true;
    },
    /**
     * 拼图进度展示
     */
    progressShow: function (piecesNum) {
        var addHtml = "";
        var num = 0;//添加几个碎片拼图
        if (piecesNum == 100) {
            CT.$("puzzleAreaCover").src = "img/empty.png";
        } else if (piecesNum == 90 || piecesNum == 91) {
            CT.$("puzzleAreaCover").src = "img/gamePage/mask/92.png";
            switch (piecesNum) {
                case 90:
                    num = 2;
                    break;
                case 91:
                    num = 1;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < num; i++) {
                addHtml += '<img src="img/gamePage/mask/99.png" alt="" style="position: absolute;left: -3px;top: ' + (285 + 33 * i) + 'px;"></img>';
            }
            CT.$("puzzleArea").innerHTML += addHtml;
        } else if (piecesNum == 94 || piecesNum == 95 || piecesNum == 96) {
            CT.$("puzzleAreaCover").src = "img/gamePage/mask/99.png";
            CT.$("puzzleAreaCover").style.left = "-3px";
            switch (piecesNum) {
                case 94:
                    num = 5;
                    break;
                case 95:
                    num = 4;
                    break;
                case 96:
                    num = 3;
                    break;
                default:
                    break;
            }
            for (var i = 0; i < num; i++) {
                addHtml += '<img src="img/gamePage/mask/99.png" alt="" style="position: absolute;left: -3px;top: ' + 35 * (i + 1) + 'px;"></img>';
            }
            CT.$("puzzleArea").innerHTML += addHtml;
        } else {
            CT.$("puzzleAreaCover").src = "img/gamePage/mask/" + this.currentPiecesNum + ".png";
        }
        CT.$("clueProgressText").innerText = this.currentClueNum;
        CT.$("progressText").innerText = this.currentPiecesNum;
        CT.$("progressdynamic").style.width = 400 * (this.currentPiecesNum / 100) + "px";
    },
    /**
     * 跳转订购页
     */
    toOrder: function () {
        PAGE.otherPageParam = "&prizeIndex=" + this.prizeIndex + "&activityId=" + CT.requestValue("activityId") + "&contentCName=" + CT.requestValue("contentCName") + "&contentId=" + CT.requestValue("contentId") + "&contentEName=" + CT.requestValue("contentEName") + "";
        CT.goPage();
        orderJs.columnToOrderPage("collectPuzzle");
    },
    /**
     * 跳转规则页
     */
    goRule: function () {
        CT.$("ruleTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_blankFocus_");
        this.isRuleTipShow = true;
    },
    /**
     *第四个片单向上移动事件
     */
    upSheet4: function () {
        if (PAGE.focusArr["hands_x0_y0_myPrizeFocus_"].focusmodel.enFocus) {//我的奖品焦点开启
            PAGE.changeFocus("hands_x0_y0_myPrizeFocus_");
        }
    },
    /**
     * 跳转片单
     */
    jumpToSheet: function (index) {
        var _this = this;
        var currentCartoonId = this.bottomRecList[this.sheetShowArr[index]].recommendDisplayValue;//当前跳转卡通ID
        CT.writeInfo("currentCartoonId" + currentCartoonId);
        var isSeen = this.seenSheetArr.some(function (item) {
            return item == currentCartoonId;
        })
        CT.writeInfo("isSeen" + isSeen);
        if (isSeen) {//当前观看的片单当天已看过
            this.lastSheet = 1;
        } else {//当前跳转片单今天没看过
            this.lastSheet = currentCartoonId;
            this.seenSheetArr.push(this.lastSheet);
        }
        CT.writeInfo("this.lastSheet" + this.lastSheet);
        var nowDate = new Date().getMonth() + 1 + "" + new Date().getDate();//当前日期
        CT.writeInfo("nowDate" + nowDate);
        CT.writeInfo(CT.jsonToString({ "seenSheet": this.seenSheetArr, "date": nowDate, "totalPieces": this.currentPiecesNum, "currentClue": this.currentClueNum, "prizeIndex": this.prizeIndex }));
        //上传数据格式{"seenSheet":[1,2,4],"date":"0819","totalPieces":100,"currentClue":3}
        actiObj.setUserDataList(CT.jsonToString({ "seenSheet": this.seenSheetArr, "date": nowDate, "totalPieces": this.currentPiecesNum, "currentClue": this.currentClueNum, "prizeIndex": this.prizeIndex }), function (res) {
            CT.writeInfo("res:" + CT.jsonToString(res));
            if (res.successFlg == 1) {
                // 上传本次跳转片单状态
                actiObj.setUserCredit(_this.lastSheet, function (creditData) {
                    if (creditData.successFlg == 1) {
                        PAGE.otherPageParam = "&prizeIndex=" + _this.prizeIndex + "&activityId=" + CT.requestValue("activityId") + "&contentCName=" + CT.requestValue("contentCName") + "&contentId=" + CT.requestValue("contentId") + "&contentEName=" + CT.requestValue("contentEName") + "";
                        CT.goPage();
                        CT.writeInfo(PAGE.otherPageParam);
                        CT.writeInfo(CT.jsonToString(_this.bottomRecList[_this.sheetShowArr[index]]));
                        CT.writeInfo("actiUserId:" + actiUserId);
                        CT.writeInfo("xjDataLog.getSmartCardid():" + xjDataLog.getSmartCardid());
                        CT.toAnterRecommendUrl(_this.bottomRecList[_this.sheetShowArr[index]], 1);
                    }
                });
            }
        });
    },
    /**
     * 好运卡展示
     */
    goodLuckCardShow: function () {
        this.currentPiecesNum = 89;
        this.progressShow(this.currentPiecesNum);
        actiObj.setUserDataList(CT.jsonToString({ "seenSheet": this.seenSheetArr, "date": this.lastDate, "totalPieces": this.currentPiecesNum, "currentClue": this.currentClueNum, "prizeIndex": this.prizeIndex }));
        this.goodLuckCard = true;
        CT.$("goodLuckCard").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_goodLuckCardFocus_");
    },
    /**
     * 弹出看片单集线索提示弹窗
     */
    toSheetTipShow: function () {
        this.toSheetTip = true;
        CT.$("toSheetTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_toSheetBtnFocus_");
    }


}
var collectJigSawGameEG = new collectJigSawGame();
function backFunc() {
    if (collectJigSawGameEG.koiCardShow) {//锦鲤卡展示的情况下按返回
        //锦鲤卡消失
        collectJigSawGameEG.koiCardShow = false;
        CT.$("koiCard").style.visibility = "hidden";
        //停止奖品列表滚动定时器
        CT.$("prizeUserInfo").style.visibility = "hidden";
        if (scrollPrizeAni) {
            clearInterval(scrollPrizeAni);
        }
        //弹出好运卡
        collectJigSawGameEG.goodLuckCardShow();
    } else if (collectJigSawGameEG.goodLuckCard) {//好运卡展示的情况下按返回
        // 好运卡关闭
        collectJigSawGameEG.goodLuckCard = false;
        CT.$("goodLuckCard").style.visibility = "hidden";
        // 弹出看片单集线索弹窗
        collectJigSawGameEG.toSheetTipShow();
    } else if (collectJigSawGameEG.toSheetTip) {//看片单提示弹窗展示时按返回,切换光标到片单上
        // 弹窗消失
        collectJigSawGameEG.toSheetTip = false;
        CT.$("toSheetTip").style.visibility = "hidden";
        // 焦点切换到片单上
        PAGE.changeFocus("hands_x0_y0_sheet1Focus_");
    } else if (collectJigSawGameEG.stolen5Tip) {//被偷走五个碎片弹窗展示的情况下按返回
        // 关闭当前弹窗
        collectJigSawGameEG.stolen5Tip = false;
        CT.$("stolen5Tip").style.visibility = "hidden";
        // 弹出退出挽留页
        collectJigSawGameEG.isGiveUpTip = true;
        CT.$("isGiveUpTip").style.visibility = "visible";
        PAGE.changeFocus("hands_x0_y0_continueBtnFocus_");
    } else if (collectJigSawGameEG.isGiveUpTip) {//退出挽留页展示的情况下按返回
        // 关闭退出挽留页回到集拼图页面
        collectJigSawGameEG.isGiveUpTip = false;
        CT.$("isGiveUpTip").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_sheet1Focus_");
        //停止奖品列表滚动定时器
        CT.$("prizeUserInfo").style.visibility = "hidden";
        if (scrollPrizeAni) {
            clearInterval(scrollPrizeAni);
        }
    } else if (collectJigSawGameEG.getPiecesClueTip) {//获得碎片线索弹窗展示情况下按返回
        // 关闭当前弹窗，焦点落在第一个片单上
        collectJigSawGameEG.getPiecesClueTip = false;
        CT.$("getClueTip").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_sheet1Focus_");
    } else if (collectJigSawGameEG.stolenClueTip) {//碎片线索被偷走弹窗展示，按返回
        // 关闭当前弹窗，焦点落在第一个片单上
        collectJigSawGameEG.stolenClueTip = false;
        CT.$("pityTip").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_sheet1Focus_");
    } else if (collectJigSawGameEG.noPiecesCluetip) {//碎片线索未获得弹窗显示的情况下按返回
        // 关闭当前弹窗，焦点落在第一个片单上
        collectJigSawGameEG.noPiecesCluetip = false;
        CT.$("noGetClue").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_sheet1Focus_");
    } else if (collectJigSawGameEG.isRuleTipShow) {//规则弹窗显示
        CT.$("ruleTip").style.visibility = "hidden";
        PAGE.changeFocus("hands_x0_y0_ruleBtnFocus_");
        collectJigSawGameEG.isRuleTipShow = false;
    } else if (collectJigSawGameEG.myPrizeTip) {//我的奖品提示弹窗
        CT.$("prizeTip").style.visibility = "hidden";
        collectJigSawGameEG.myPrizeTip = false;
        PAGE.changeFocus("hands_x0_y0_myPrizeFocus_");
    } else {
        CT.backPage();
    }
}
