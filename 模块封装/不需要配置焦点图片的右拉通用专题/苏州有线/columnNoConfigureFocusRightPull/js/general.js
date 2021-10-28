function GeneralColumn() {
    this.haveAddButtons = false;
    //当前页面焦点名称
    this.curPageFocusName = null;
    //是否初始化空焦点
    this.haveEmpty = false;
    //所有专题背景图
    this.columnBG = document.getElementById("columnBG");
    //所有专题推荐内容
    this.columnInfo = document.getElementById("columnInfo");
    //第一个推荐信息位置
    this.firstRecommendPicLeft = parseInt(CT.getCookie("firstRecommendPicLeft")) || 60;
    /**
     * 页面初始化
     */
    this.init = function () {
        CT.delCookie("firstRecommendPicLeft");
        curPageNum = searchFromPageJsonByAction(curPageEName);
        if (setLoggerInfo && setLoggerInfo.pageInfoLog) {
            setLoggerInfo.pageInfoLog.data = pageMsgArr[curPageNum];
        }
        // 初始化空焦点
        if (!this.haveEmpty) {
            this.haveEmpty = true;
            if (CT.getCookie("columnBackFocus")) {
                this.curPageFocusName = CT.getCookie("columnBackFocus");
                CT.delCookie("columnBackFocus");
            }
            buttons.push(
                {
                    id: "hands_x0_y0_emptyFocus_",
                    clickHandler: "",
                    up: "disable",
                    down: "disable",
                    left: "disable",
                    right: "disable",
                    focusType: 7
                });
        }
        var nowPageId = "columnPage" + pageMsgArr[curPageNum].pageInfo.commPageEname;

        document.title = pageMsgArr[curPageNum].pageInfo.commPageCname + "-通用专题";
        if (!nowPageId || !document.getElementById(nowPageId)) {
            this.haveAddButtons = true;
            var addHtmlWidth = parseInt(pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picW);
            var addHtmlHeight = parseInt(pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picH);
            var addBg = this.createDivDom({ id: nowPageId + "Bg", className: "withScreen", style: { width: addHtmlWidth, height: addHtmlHeight, top: curPageNum * 720, left: 0 } });
            var addDiv = this.createDivDom({ id: nowPageId, className: "withScreen", style: { width: addHtmlWidth, height: addHtmlHeight, top: curPageNum * 720, left: 0 } });
            addBg.innerHTML = "<img class = 'withScreen' src = '" + columnImgUrl + pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picPath + "'>";
            addDiv.innerHTML = this.columnHTML(pageJsonArr[curPageNum]);
            this.columnBG.appendChild(addBg);
            this.columnInfo.appendChild(addDiv);
        }
        if (this.haveAddButtons) {
            this.haveAddButtons = false;
            PAGE.focusInit();
        }
        curFocus.defaultBlur();
        if (this.curPageFocusName) {
            PAGE.changeFocus(this.curPageFocusName);
            this.curPageFocusName = null;
        } else {
            if (pageMsgArr[curPageNum].pageInfo.commPageEname == getGeneralAction() && pageJsonArr[curPageNum].defaultFocus) {
                PAGE.changeFocus(pageJsonArr[curPageNum].defaultFocus);
            } else {
                PAGE.changeFocus("hands_x0_y0_" + columnGeneralFocusName + pageJsonArr[curPageNum].allMsg.recommendMsg[0].recommendId + "_");
            }
        }
    };
    /**
    * 设置基础DIV属性,并返回此div
    * @param divOption 对象类型
    * @returns {HTMLDivElement}
    */
    this.createDivDom = function (divOption) {
        var addDiv = document.createElement("div");
        addDiv.id = divOption.id;
        addDiv.className = divOption.className;
        addDiv.style.width = divOption.style.width + "px";
        addDiv.style.height = divOption.style.height + "px";
        addDiv.style.top = divOption.style.top + "px";
        addDiv.style.left = divOption.style.left + "px";
        addDiv.style.zIndex = 0;
        return addDiv;
    };
    /**
     * 根据页面配置信息返回对应的页面渲染内容
     * @param newOutJson 数据重编后的页面信息
     * @returns {*}
     */
    this.columnHTML = function (newOutJson) {
        //选中焦点元素
        var focusHtml = this.createFocus(columnImgUrl, newOutJson.allMsg.recommendMsg, columnGeneralFocusName, "goSomeWhere", "getFocusNow", "loseFocusNow");
        //未选中元素
        var focusRecPicHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.recommendMsg, "recommendPic", "focusPic", "visible");
        //返回未选中元素
        var backRecPicHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.outRecommendMsg, "recommendPic", "backPic", "visible");

        //焦点选中显示详情图元素
        var focusRecShowPicHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.recommendMsg, "recommendShowPic", "focusShowPic", "hidden");
        //返回选中显示详情图元素
        var backRecShowPicHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.outRecommendMsg, "recommendShowPic", "backShowPic", "hidden");

        //焦点隐藏详情图
        var focusRecHidePicHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.recommendMsg, "recommendHidePic", "focusHidePic", "hidden");
        //返回隐藏详情图元素
        var backRecShowHideHtml = this.createDetail(columnImgUrl, newOutJson.allMsg.outRecommendMsg, "recommendHidePic", "backHidePic", "hidden");

        //以下其余推荐图,均做动画或静态图显示
        var otherMsgPic = this.createDetail(columnImgUrl, newOutJson.allMsg.otherDetailMsg, "recommendHidePic", "otherHidePic", "visible")
            + this.createDetail(columnImgUrl, newOutJson.allMsg.otherDetailMsg, "recommendShowPic", "otherShowPic", "visible")
            + this.createDetail(columnImgUrl, newOutJson.allMsg.otherDetailMsg, "recommendPic", "otherPic", "visible")
            + this.createDetail(columnImgUrl, newOutJson.allMsg.otherDetailMsg, "recommendLabelpic", "otherLabelPic", "visible");

        var retutnHtml = focusRecPicHtml + backRecPicHtml + focusRecShowPicHtml + backRecShowPicHtml + focusRecHidePicHtml + backRecShowHideHtml + otherMsgPic + focusHtml;
        return retutnHtml;
    };
    /**
     * 生成div包裹img形式的除返回外的焦点DOM元素，返回拼接的字符串
     *
     * generalImgUrl: 图片地址
     * focusMsg:焦点信息，newOutJson.recommendMsg
     * focusName:焦点名称 -->"hands_x0_y0_" + focusName + recommendId + "_"
     * clickFnName: 焦点点击确认方法名称
     */
    this.createFocus = function (generalImgUrl, focusMsg, focusName, clickFnName, otherFocusFn, otherBlurFn) {
        if (typeof (focusMsg) == "object" && focusMsg.length > 0) {
            var focusHtml = "";
            var focusId = "";
            var imgId = "";
            var imgSrc = "";
            var focusWith = "";
            var focusHeight = "";
            var focusTop = "";
            var focusLeft = "";
            var focusZIndex = 1;
            for (var i = 0; i < focusMsg.length; i++) {
                // 后台配置推荐图片（焦点信息），则按照配置图片渲染，若未配置使用固定焦点信息
                if (focusMsg[i].recommendLabelpic.length > 0) {
                    focusId = "hands_x0_y0_" + focusName + focusMsg[i].recommendId + "_";
                    imgId = focusName + focusMsg[i].recommendId;
                    imgSrc = generalImgUrl + focusMsg[i].recommendLabelpic[0].url;
                    focusMsg[i].recommendLabelpic[0].divId = focusId;
                    focusMsg[i].recommendLabelpic[0].imgId = imgId;
                    focusWith = focusMsg[i].recommendLabelpic[0].width + "px";
                    focusHeight = focusMsg[i].recommendLabelpic[0].height + "px";
                    focusTop = focusMsg[i].recommendLabelpic[0].yValue + "px";
                    focusLeft = focusMsg[i].recommendLabelpic[0].xValue + "px";
                    focusZIndex = focusMsg[i].recommendLabelpic[0].zIndex || 1;
                    focusHtml += "<div id = '" + focusId + "' style = 'width: " + focusWith + ";height: " + focusHeight
                        + ";position: absolute;top: " + focusTop + ";left: " + focusLeft + ";z-index: " + focusZIndex + ";' attr-top = '" + focusTop + "' attr-left = '" + focusLeft + "'>" +
                        "<img id = '" + imgId + "' src = '" + imgSrc + "' style = 'width: " + focusWith + ";height: " + focusHeight + ";visibility: hidden;border-radius:8px;z-index: " + focusZIndex + ";'>"
                        + "</div>";
                    this.addRecButtons(i, focusMsg[i], focusName, clickFnName, otherFocusFn, otherBlurFn);
                } else {
                    focusId = "hands_x0_y0_" + focusName + focusMsg[i].recommendId + "_";
                    imgId = focusName + focusMsg[i].recommendId;
                    imgSrc = "HD/web/column/columnNoConfigureFocusRightPull/img/empty.png";
                    focusTop = "417px";
                    focusLeft = this.firstRecommendPicLeft + (parseInt(focusMsg[i].recommendPic[0].width) + 30) * i - 3 + "px";
                    focusHtml += "<div id = '" + focusId + "' style = 'position:absolute;left:" + focusLeft + ";top:" + focusTop + ";width:168px;height:233px;'>" +
                        "<img id = '" + imgId + "' src = '" + imgSrc + "' style = 'width:168px;height:233px;border: 3px solid #FCFF00;border-radius: 8px;visibility: hidden;'></div>";
                    this.addRecButtons(i, focusMsg[i], focusName, clickFnName, otherFocusFn, otherBlurFn);
                }
            }
            return focusHtml;
        } else {
            return "";
        }
    };
    /**
     * 将推荐焦点(除退出)加入buttons数组
     *
     * ii: 位于正文推荐信息中的第几条，做后面的跳转用
     * buttonsMsg：将当前焦点对应的数据信息存入TempData
     * focusName： 焦点名称
     * clickFnName： 点击方法名
     * */
    this.addRecButtons = function (ii, buttonsMsg, focusName, clickFnName, otherFocusFn, otherBlurFn) {
        var recommendMsg = pageJsonArr[curPageNum].allMsg.recommendMsg;
        var focusId = "hands_x0_y0_" + focusName + buttonsMsg.recommendId + "_";
        var newButton = {
            id: focusId,
            TempData: buttonsMsg,
            clickHandler: "",
            otherFocusEvent: "",
            otherBlurEvent: "",
            up: "disable",
            down: "disable",
            leftEvent: "javascript:column.moveEvent('left'," + ii + ")",
            rightEvent: "javascript:column.moveEvent('right'," + ii + ")",
            focusType: 7
        };
        if (clickFnName) {
            newButton.clickHandler = "javascript: " + clickFnName + "(" + ii + ")";
        }
        if (otherFocusFn) {
            newButton.otherFocusEvent = "javascript: " + otherFocusFn + "(" + ii + ")";
        }
        if (otherBlurFn) {
            newButton.otherBlurEvent = "javascript: " + otherBlurFn + "(" + ii + ")";
        }
        buttons.push(newButton);
    };
    /**
	* 创建非焦点的单个推荐的图片元素,形式为DIV包裹img,返回拼接的字符串
	*
     *
     * generalImgUrl： 图片地址
     * detailMsg：推荐详情信息
     * recommendType：推荐类型（recommendPic，recommendShowPic，recommendHidePic）
     * detailIdName：生成DOM元素的ID名
     * visi：visible/hidden
	* */
    this.createDetail = function (generalImgUrl, detailMsg, recommendType, detailIdName, visi) {
        if (typeof (detailMsg) == "object" && detailMsg.length > 0) {
            var detailHtml = "";
            var detailId = "";
            var imgId = "";
            var imgSrc = "";
            var detailWith = "";
            var detailHeight = "";
            var detailTop = "";
            var detailLeft = "";
            var detailZIndex = 0;
            for (var i = 0; i < detailMsg.length; i++) {
                if (detailMsg[i][recommendType].length > 0) {
                    detailId = detailIdName + detailMsg[i].recommendId;
                    imgId = detailIdName + "Img" + detailMsg[i].recommendId;
                    detailMsg[i][recommendType][0].divId = detailId;
                    detailMsg[i][recommendType][0].imgId = imgId;
                    imgSrc = generalImgUrl + detailMsg[i][recommendType][0].url;
                    detailWith = "168px";
                    detailHeight = "233px";
                    detailTop = "420px";
                    detailLeft = this.firstRecommendPicLeft + (parseInt(detailMsg[i][recommendType][0].width) + 30) * i + "px";
                    detailZIndex = detailMsg[i][recommendType][0].zIndex;
                    detailHtml += "<div id = '" + detailId + "' style = 'width: " + detailWith + ";height: " + detailHeight
                        + ";position: absolute;top: " + detailTop + ";left: " + detailLeft + ";visibility: " + visi + ";z-index: " + detailZIndex + ";' attr-top = '" + detailTop + "' attr-left = '" + detailLeft + "' >" +
                        "<img id = '" + imgId + "' src = '" + imgSrc + "' style = 'width: " + detailWith + ";height: " + detailHeight + ";z-index: " + detailZIndex + ";border-radius: 8px;'>"
                        + "</div>";
                }
            }
            return detailHtml;
        } else {
            return "";
        }
    };
    this.moveEvent = function (direction, ii) {
        var recommendMsg = pageJsonArr[curPageNum].allMsg.recommendMsg;
        if (direction == "left") {
            //焦点在页面最左侧
            if (recommendMsg[ii - 1] && parseInt(CT.$("hands_x0_y0_generalFocus" + recommendMsg[ii - 1].recommendId + "_").style.left) < 0) {
                //焦点不是第一个
                for (i = 0; i < recommendMsg.length; i++) {
                    var focusDOMleft = parseInt(CT.$("hands_x0_y0_generalFocus" + recommendMsg[i].recommendId + "_").style.left);
                    var recommendPicLeft = parseInt(CT.$("focusPic" + recommendMsg[i].recommendId).style.left);
                    CT.$("hands_x0_y0_generalFocus" + recommendMsg[i].recommendId + "_").style.left = focusDOMleft + parseInt(recommendMsg[i].recommendPic[0].width) + 30 + "px";
                    CT.$("focusPic" + recommendMsg[i].recommendId).style.left = recommendPicLeft + parseInt(recommendMsg[i].recommendPic[0].width) + 30 + "px";
                }
            }
            if (ii > 0) {
                PAGE.changeFocus("hands_x0_y0_" + columnGeneralFocusName + recommendMsg[ii - 1].recommendId + "_");
            }
        } else if (direction == "right") {
            //焦点在页面最右侧,且焦点不是最后一个
            if (recommendMsg[ii + 1] && parseInt(CT.$("hands_x0_y0_generalFocus" + recommendMsg[ii + 1].recommendId + "_").style.left) + 168 > 1280) {
                for (i = 0; i < recommendMsg.length; i++) {
                    var focusDOMleft = parseInt(CT.$("hands_x0_y0_generalFocus" + recommendMsg[i].recommendId + "_").style.left);
                    var recommendPicLeft = parseInt(CT.$("focusPic" + recommendMsg[i].recommendId).style.left);
                    CT.$("hands_x0_y0_generalFocus" + recommendMsg[i].recommendId + "_").style.left = focusDOMleft - (parseInt(recommendMsg[i].recommendPic[0].width) + 30) + "px";
                    CT.$("focusPic" + recommendMsg[i].recommendId).style.left = recommendPicLeft - (parseInt(recommendMsg[i].recommendPic[0].width) + 30) + "px";
                }
            }
            if (ii < (recommendMsg.length - 1)) {
                PAGE.changeFocus("hands_x0_y0_" + columnGeneralFocusName + recommendMsg[ii + 1].recommendId + "_");
            }
        }
    }
}
