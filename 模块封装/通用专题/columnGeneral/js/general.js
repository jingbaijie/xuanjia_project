function GeneralColumn(){
	this.haveAddButtons = true
    this.isChangePage = false;
    //当前页面焦点名称
    this.curPageFocusName = null;
    //是否初始化空焦点
    this.haveEmpty = false;
    //专题整体内容，用于页面滑动
    this.columnContent = document.getElementById("columnContent");
    //所有专题背景图
    this.columnBG = document.getElementById("columnBG");
    //所有专题推荐内容
    this.columnInfo = document.getElementById("columnInfo");
    /**
     * 页面初始化，最多渲染三屏页面
     */
    this.init = function(){
        curPageNum = searchFromPageJsonByAction(curPageEName);
        if(setLoggerInfo && setLoggerInfo.pageInfoLog){
            setLoggerInfo.pageInfoLog = pageMsgArr[curPageNum];
        }
        if(!this.haveEmpty){
            this.haveEmpty = true;
            if(CT.getCookie("columnBackFocus")){
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
        var prePageId = (pageMsgArr[curPageNum] && pageMsgArr[curPageNum].recommend_4 && pageMsgArr[curPageNum].recommend_4[0] && pageMsgArr[curPageNum].recommend_4[0].commpageName) ? ("columnPage" + pageMsgArr[curPageNum].recommend_4[0].commpageName):false;
        var nextPageId = (pageMsgArr[curPageNum] && pageMsgArr[curPageNum].recommend_5 && pageMsgArr[curPageNum].recommend_5[0] && pageMsgArr[curPageNum].recommend_5[0].commpageName) ? ("columnPage" + pageMsgArr[curPageNum].recommend_5[0].commpageName):false;
        
        document.title = pageMsgArr[curPageNum].pageInfo.commPageCname + "-通用专题";
        if(!nowPageId || !document.getElementById(nowPageId)){
            this.haveAddButtons = true;
			var addHtmlWidth = parseInt(pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picW);
            var addHtmlHeight = parseInt(pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picH);
            var addBg = this.createDivDom({id: nowPageId +"Bg",className: "withScreen",style: {width: addHtmlWidth,height: addHtmlHeight,top: curPageNum*720,left: 0}});
            var addDiv = this.createDivDom({id: nowPageId,className: "withScreen",style: {width: addHtmlWidth,height: addHtmlHeight,top: curPageNum*720,left: 0}});
            addBg.innerHTML = "<img class = 'withScreen' src = '"+columnImgUrl + pageJsonArr[curPageNum].pageInfo.pageTemplateBgpic.picPath+"'>";
            addDiv.innerHTML = this.columnHTML(pageJsonArr[curPageNum]);
            this.columnBG.appendChild(addBg);
            this.columnInfo.appendChild(addDiv);
        }
        if(!document.getElementById(prePageId) && searchFromPageJsonByAction(pageMsgArr[curPageNum] && pageMsgArr[curPageNum].recommend_4 && pageMsgArr[curPageNum].recommend_4[0] && pageMsgArr[curPageNum].recommend_4[0].commpageName)){
            this.haveAddButtons = true;
			var addPreWidth = parseInt(pageJsonArr[parseInt(curPageNum)- 1].pageInfo.pageTemplateBgpic.picW);
            var addPreHeight = parseInt(pageJsonArr[parseInt(curPageNum)- 1].pageInfo.pageTemplateBgpic.picH);
            var addPreBg = this.createDivDom({id: prePageId +"Bg",className: "withScreen",style: {width: addPreWidth,height: addPreHeight,top: (parseInt(document.getElementById(nowPageId).style.top) - 720),left: 0}});
            var addPreDiv = this.createDivDom({id: prePageId,className: "withScreen",style: {width: addPreWidth,height: addPreHeight,top: (parseInt(document.getElementById(nowPageId).style.top) - 720),left: 0}});
            addPreBg.innerHTML = "<img class = 'withScreen' src = '"+columnImgUrl + pageJsonArr[parseInt(curPageNum)- 1].pageInfo.pageTemplateBgpic.picPath+"'>";
            addPreDiv.innerHTML = this.columnHTML(pageJsonArr[parseInt(curPageNum) - 1]);
            this.columnBG.appendChild(addPreBg);
            this.columnInfo.appendChild(addPreDiv);
        }
        if(!document.getElementById(nextPageId) && searchFromPageJsonByAction(pageMsgArr[curPageNum] && pageMsgArr[curPageNum].recommend_5 && pageMsgArr[curPageNum].recommend_5[0] && pageMsgArr[curPageNum].recommend_5[0].commpageName)){
            this.haveAddButtons = true;
			var addNextWidth = parseInt(pageJsonArr[parseInt(curPageNum) + 1].pageInfo.pageTemplateBgpic.picW);
            var addNextHeight = parseInt(pageJsonArr[parseInt(curPageNum) + 1].pageInfo.pageTemplateBgpic.picH);
            var addNextBg = this.createDivDom({id: nextPageId +"Bg",className: "withScreen",style: {width: addNextWidth,height: addNextHeight,top: (parseInt(document.getElementById(nowPageId).style.top) + 720),left: 0}});
            var addNextDiv = this.createDivDom({id: nextPageId,className: "withScreen",style: {width: addNextWidth,height: addNextHeight,top: (parseInt(document.getElementById(nowPageId).style.top) + 720),left: 0}});
            addNextBg.innerHTML = "<img class = 'withScreen' src = '"+columnImgUrl + pageJsonArr[parseInt(curPageNum) + 1].pageInfo.pageTemplateBgpic.picPath+"'>";
            addNextDiv.innerHTML = this.columnHTML(pageJsonArr[parseInt(curPageNum) + 1]);
            this.columnBG.appendChild(addNextBg);
            this.columnInfo.appendChild(addNextDiv);
        }
		if(this.haveAddButtons){
			this.haveAddButtons = false;
			PAGE.focusInit();
		}
        curFocus.defaultBlur();
        if(this.curPageFocusName){
            PAGE.changeFocus(this.curPageFocusName);
            this.curPageFocusName = null;
        }else{
            if(pageJsonArr[curPageNum].defaultFocus){
                PAGE.changeFocus(pageJsonArr[curPageNum].defaultFocus);
            }else{
                PAGE.changeFocus("hands_x0_y0_" + columnGeneralFocusName + pageJsonArr[curPageNum].allMsg.recommendMsg[0].recommendId + "_");
            }
        }
        getAnimation(pageJsonArr[curPageNum]);
    };
    /**
     * 设置基础DIV属性,并返回此div
     * @param divOption 对象类型
     * @returns {HTMLDivElement}
     */
    this.createDivDom = function(divOption){
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
    this.columnHTML = function(newOutJson){
        //选中焦点元素
        var focusHtml = this.createFocus(columnImgUrl,newOutJson.allMsg.recommendMsg,columnGeneralFocusName,"goSomeWhere","getFocusNow","loseFocusNow")
            + this.createFocus(columnImgUrl,newOutJson.allMsg.outRecommendMsg,columnGeneralFocusName,"backFunc","getFocusNow","loseFocusNow");
        //未选中元素
        var focusRecPicHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendPic","focusPic","visible");
        //返回未选中元素
        var backRecPicHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendPic","backPic","visible");

        //焦点选中显示详情图元素
        var focusRecShowPicHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendShowPic","focusShowPic","hidden");
        //返回选中显示详情图元素
        var backRecShowPicHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendShowPic","backShowPic","hidden");

        //焦点隐藏详情图
        var focusRecHidePicHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendHidePic","focusHidePic","hidden");
        //返回隐藏详情图元素
        var backRecShowHideHtml = this.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendHidePic","backHidePic","hidden");



        //以下其余推荐图,均做动画或静态图显示
        var otherMsgPic = this.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendHidePic","otherHidePic","visible")
            + this.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendShowPic","otherShowPic","visible")
            + this.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendPic","otherPic","visible")
            + this.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendLabelpic","otherLabelPic","visible");

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
	this.createFocus = function(generalImgUrl,focusMsg,focusName,clickFnName,otherFocusFn,otherBlurFn){
		if(typeof(focusMsg) == "object" && focusMsg.length > 0){
			var focusHtml = "";
			var focusId = "";
			var imgId = "";
			var imgSrc = "";
			var focusWith = "";
			var focusHeight = "";
			var focusTop = "";
			var focusLeft = "";
			var focusZIndex = 1;
			for(var i = 0; i < focusMsg.length; i++){
				if(focusMsg[i].recommendLabelpic.length > 0){
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
                    focusHtml += "<div id = '" + focusId +"' style = 'width: "+ focusWith +";height: "+ focusHeight
                        +";position: absolute;top: "+ focusTop +";left: "+ focusLeft +";z-index: "+ focusZIndex +";' attr-top = '"+ focusTop +"' attr-left = '"+ focusLeft +"'>" +
                        "<img id = '"+ imgId +"' src = '"+ imgSrc +"' style = 'width: "+ focusWith +";height: "+ focusHeight +";visibility: hidden;z-index: "+ focusZIndex +";'>"
                        + "</div>";
                    this.addRecButtons(i,focusMsg[i],focusName,clickFnName,otherFocusFn,otherBlurFn);
				}
			}
			return focusHtml;
		}else{
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
    this.addRecButtons = function(ii,buttonsMsg,focusName,clickFnName,otherFocusFn,otherBlurFn){
        var focusId = "hands_x0_y0_" + focusName + buttonsMsg.recommendId + "_";
        var newButton = {
            id: focusId,
            TempData: buttonsMsg,
            clickHandler: "",
            otherFocusEvent: "",
            otherBlurEvent: "",
            upEvent: "javascript: column.focusMove('up')",
            downEvent: "javascript: column.focusMove('down')",
            leftEvent: "javascript: column.focusMove('left')",
            rightEvent: "javascript: column.focusMove('right')",
            focusType: 7
        };
        if(clickFnName){
            newButton.clickHandler = "javascript: "+ clickFnName + "("+ ii +")";
        }
        if(otherFocusFn){
            newButton.otherFocusEvent = "javascript: "+ otherFocusFn +"("+ ii +")";
        }
        if(otherBlurFn){
            newButton.otherBlurEvent = "javascript: "+ otherBlurFn +"("+ ii +")";
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
	this.createDetail = function(generalImgUrl,detailMsg,recommendType,detailIdName,visi){
        if(typeof(detailMsg) == "object" && detailMsg.length > 0){
            var detailHtml = "";
            var detailId = "";
            var imgId = "";
            var imgSrc = "";
            var detailWith = "";
            var detailHeight = "";
            var detailTop = "";
            var detailLeft = "";
            var detailZIndex = 0;
            for(var i = 0; i < detailMsg.length; i++){
            	if(detailMsg[i][recommendType].length > 0){
                    detailId = detailIdName + detailMsg[i].recommendId;
                    imgId = detailIdName + "Img" + detailMsg[i].recommendId;
                    detailMsg[i][recommendType][0].divId = detailId;
                    detailMsg[i][recommendType][0].imgId = imgId;
                    imgSrc = generalImgUrl + detailMsg[i][recommendType][0].url;
                    detailWith = detailMsg[i][recommendType][0].width + "px";
                    detailHeight = detailMsg[i][recommendType][0].height + "px";
                    detailTop = detailMsg[i][recommendType][0].yValue + "px";
                    detailLeft = detailMsg[i][recommendType][0].xValue + "px";
                    detailZIndex = detailMsg[i][recommendType][0].zIndex;
                    detailHtml += "<div id = '" + detailId +"' style = 'width: "+ detailWith +";height: "+ detailHeight
                        +";position: absolute;top: "+ detailTop +";left: "+ detailLeft +";visibility: "+ visi +";z-index: "+ detailZIndex +";' attr-top = '"+ detailTop +"' attr-left = '"+ detailLeft +"' >" +
                        "<img id = '"+ imgId +"' src = '"+ imgSrc +"' style = 'width: "+ detailWith +";height: "+ detailHeight +";z-index: "+ detailZIndex +";'>"
                        + "</div>";
				}
            }
            return detailHtml;
        }else{
        	return "";
		}
	};
}
/**
* 将瀑布流首页版本中的就近原则使用在未指定上下左右移动目标的焦点上
* */
GeneralColumn.prototype = {
    /**
    * 更改焦点
     *
     * focusName： 切换后的焦点名称
    * */
	changeFocus: function(focusName){
    	if(focusName.indexOf("hands") != -1){
            PAGE.changeFocus(focusName);
		}
    },
    /**
     * 获取当前焦点的上下左右移动目标
     * @param focusMoveMsg 当前焦点的推荐消息
     * @returns {number[]} [0,0,0,0,1]//[上，下，左，右,是否已轮询]目标焦点数组，值为对应焦点推荐信息id
     */
    getMoveTarget: function(focusMoveMsg){
        var OutJson = null;
        var focusMoveArr = [0,0,0,0,0];
        for(var i = 0; i < pageMsgArr.length; i++){
            OutJson = pageMsgArr[i];
            if(OutJson.recommend_1){
                for(var x = 0; x < OutJson.recommend_1.length; x++){
                    if(focusMoveMsg[0] > 0 && OutJson.recommend_1[x].rankId == focusMoveMsg[0]){
                        focusMoveArr[0] = OutJson.recommend_1[x].id;
                    }
                    if(focusMoveMsg[1] > 0 && OutJson.recommend_1[x].rankId == focusMoveMsg[1]){
                        focusMoveArr[1] = OutJson.recommend_1[x].id;
                    }
                    if(focusMoveMsg[2] > 0 && OutJson.recommend_1[x].rankId == focusMoveMsg[2]){
                        focusMoveArr[2] = OutJson.recommend_1[x].id;
                    }
                    if(focusMoveMsg[3] > 0 && OutJson.recommend_1[x].rankId == focusMoveMsg[3]){
                        focusMoveArr[3] = OutJson.recommend_1[x].id;
                    }
                }
            }
            if(OutJson.recommend_2){
                for(var y = 0; y < OutJson.recommend_2.length; y++){
                    if(focusMoveMsg[0] > 0 && OutJson.recommend_2[y].rankId == focusMoveMsg[0]){
                        focusMoveArr[0] = OutJson.recommend_2[y].id;
                    }
                    if(focusMoveMsg[1] > 0  && OutJson.recommend_2[y].rankId == focusMoveMsg[1]){
                        focusMoveArr[1] = OutJson.recommend_2[y].id;
                    }
                    if(focusMoveMsg[2] > 0 && OutJson.recommend_2[y].rankId == focusMoveMsg[2]){
                        focusMoveArr[2] = OutJson.recommend_2[y].id;
                    }
                    if(focusMoveMsg[3] > 0 && OutJson.recommend_2[y].rankId == focusMoveMsg[3]){
                        focusMoveArr[3] = OutJson.recommend_2[y].id;
                    }

                }
            }
        }
        return focusMoveArr;
    },
    /**
     *判断当前焦点是否有制定移动目标，无则按就近原则选择下一个焦点目标，并记录此焦点目标为下次当前焦点该方向上的目标
     *
     *direction: 焦点移动方向
    * */
	focusMove: function(direction){
		if(curFocus.TempData){
            if(curFocus.TempData.focusMoveEvent && curFocus.TempData.focusMoveEvent[4] == 1){
                curFocus.TempData.focusMoveEvent = this.getMoveTarget(curFocus.TempData.focusMoveEvent);
            }
			var targetFocus = "";
            switch (direction){
                case "up":
                    if(curFocus.TempData.focusMoveEvent.length > 0 && curFocus.TempData.focusMoveEvent[0] > 0) {
                        targetFocus = "hands_x0_y0_" + columnGeneralFocusName + curFocus.TempData.focusMoveEvent[0] + "_";
                    }
                    break;
				case "down":
                    if(curFocus.TempData.focusMoveEvent.length > 0 && curFocus.TempData.focusMoveEvent[1] > 0){
                        targetFocus = "hands_x0_y0_"+ columnGeneralFocusName + curFocus.TempData.focusMoveEvent[1] +"_";
                    }
                    break;
				case "left":
                    if(curFocus.TempData.focusMoveEvent.length > 0 && curFocus.TempData.focusMoveEvent[2] > 0){
                        targetFocus = "hands_x0_y0_"+ columnGeneralFocusName + curFocus.TempData.focusMoveEvent[2] +"_";
                    }
                    break;
				case "right":
                    if(curFocus.TempData.focusMoveEvent.length > 0 && curFocus.TempData.focusMoveEvent[3] > 0){
                        targetFocus = "hands_x0_y0_"+ columnGeneralFocusName + curFocus.TempData.focusMoveEvent[3] +"_";
                    }
                    break;
				default:
					break;
            }
            if(targetFocus != "" && document.getElementById(targetFocus)){
                if(document.getElementById(targetFocus).parentNode.id != document.getElementById(curFocus.FocusID).parentNode.id){
                    this.curPageFocusName = targetFocus;
                    if(direction == "up" && curPageNum > 0){
                        this.changeFocus("hands_x0_y0_emptyFocus_");
                        moveUp();
                    }else if(direction == "down" && curPageNum < pageJsonArr.length - 1){
                        this.changeFocus("hands_x0_y0_emptyFocus_");
                        moveDown();
                    }
                }else{
                    PAGE.focusArr[curFocus.FocusID][direction] = targetFocus;
                    PAGE.focusArr[curFocus.FocusID][direction + "Event"] = "";
                    this.changeFocus(targetFocus);
                }
			}else{
				targetFocus = this.getNextFocusName(direction);
				if(targetFocus && document.getElementById(targetFocus) && targetFocus != "hands_x0_y0_emptyFocus_"){
                    if(document.getElementById(targetFocus).parentNode.id != document.getElementById(curFocus.FocusID).parentNode.id){
                        this.curPageFocusName = targetFocus;
                        if(direction == "up" && curPageNum > 0){
                            this.changeFocus("hands_x0_y0_emptyFocus_");
                            moveUp();
                        }else if(direction == "down" && curPageNum < pageJsonArr.length - 1){
                            this.changeFocus("hands_x0_y0_emptyFocus_");
                            moveDown();
                        }
                    }else{
                        PAGE.focusArr[curFocus.FocusID][direction] = targetFocus;
                        PAGE.focusArr[curFocus.FocusID][direction + "Event"] = "";
                        this.changeFocus(targetFocus);
                    }
				}else{
                    PAGE.focusArr[curFocus.FocusID][direction] = "disable";
                    PAGE.focusArr[curFocus.FocusID][direction + "Event"] = "";
				}
			}
		}

	},
    /**
     * 获取下一焦点名称
     *
     * direction： 当前移动方向
     * */
	getNextFocusName: function(direction){
		var curNode = null;
		// ********************获取当前焦点的坐标***********************/
		for (var key in PAGE.focusArr) {
			if (curFocus.FocusID == PAGE.focusArr[key].id) {
				curNode = PAGE.focusArr[key];
				break;
			}
		}
		var x = parseInt(curNode.style.left) + parseInt(curNode.parentNode.style.left);
		var y = parseInt(curNode.style.top) + parseInt(curNode.parentNode.style.top);
        var w = parseInt(curNode.style.width);
        var h = parseInt(curNode.style.height);
        var curCoo = new FunCoo(x,y,w,h);

		/** ****************************************************** */
		var upNodeArr = new Array();
		var downNodeArr = new Array();
		var leftNodeArr = new Array();
		var rightNodeArr = new Array();
		// 找出在当前的所有焦点
		for (var key in PAGE.focusArr) {
            var j = PAGE.focusArr[key];
            var top = parseInt(j.style.top) + parseInt(j.parentNode.style.top);
            var left = parseInt(j.style.left) + parseInt(j.parentNode.style.left);
            // 忽略已经被禁用的焦点
            if (j.focusmodel.enFocus == true) {
                if(top + h*(1/3) < y){
                    upNodeArr.push(j);
                }
                if(top > y + h*(1/3)){
                    downNodeArr.push(j);
                }
                if(left < x && curNode.parentNode.id == j.parentNode.id){
                    leftNodeArr.push(j);
                }
                if(left > x && curNode.parentNode.id == j.parentNode.id){
                    rightNodeArr.push(j);
                }
            }

		}
		switch (direction){
			case "up":
				return this.getUpFocusName(upNodeArr,curCoo);
				break;
			case "down":
                return this.getDownFocusName(downNodeArr,curCoo);
				break;
			case "left":
                return this.getLeftFocusName(leftNodeArr,curCoo);
				break;
			case "right":
                return this.getRightFocusName(rightNodeArr,curCoo);
				break;
			default:
				break;
		}
	},
    /**
     * 向上移动焦点
     *
     * upNodeArr： 在当前焦点上方的焦点
     * curCoo：当前焦点的x,y,w,h
     **/
    getUpFocusName: function(upNodeArr,curCoo){
        var nextNode = null;
        //var maxNextNode = null;
        var bl = true;
        // 距离当前焦点最小的距离
        var minjl = 0;
        // 距离当前焦点最大的距离
        var maxjl = 0;
        var minwds = curCoo.w;
        var nextwds = curCoo.w;
        var leftds = curCoo.w;
        var rightds = curCoo.w;
        var haveOne = false;
        var inCoo = false;
        // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo((parseInt(upNodeArr[i].style.left) + parseInt(upNodeArr[i].parentNode.style.left)), (parseInt(upNodeArr[i].style.top) + parseInt(upNodeArr[i].parentNode.style.top)), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                inCoo = false;
                // 计算距离
                if (bl) {
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                    bl = false;
                }

                if ((nextCoo.x >= curCoo.x && nextCoo.x <= curCoo.x + curCoo.w) || (nextCoo.x <= curCoo.x && nextCoo.x + nextCoo.w >= curCoo.x)) {
                    inCoo = true;
                    if(!haveOne){
                        haveOne = true;
                        minjl = nextCoo;
                        nextNode = upNodeArr[i];
                    }
                }
                if (inCoo && curCoo.y - nextCoo.y < curCoo.y - minjl.y) {
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                }
            }
            if(haveOne){
                return(nextNode.focusmodel.FocusID);
            }else{
                return null;
            }
        }
	},
    /**
     * 向下移动焦点
     *
     * upNodeArr： 在当前焦点下方的焦点
     * curCoo：当前焦点的x,y,w,h
     **/
    getDownFocusName: function(upNodeArr,curCoo){
        var nextNode = null;
        //var maxNextNode = null;
        var bl = true;
        // 距离当前焦点最小的距离
        var minjl = 0;
        // 距离当前焦点最大的距离
        var maxjl = 0;
        var haveOne = false;
        var inCoo = false;
        // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo((parseInt(upNodeArr[i].style.left)+parseInt(upNodeArr[i].parentNode.style.left)), (parseInt(upNodeArr[i].style.top)+parseInt(upNodeArr[i].parentNode.style.top)), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                // 计算距离
                if(bl){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                    bl = false;
                }
                inCoo = false;
                if((nextCoo.x >= curCoo.x && nextCoo.x <= curCoo.x + curCoo.w) || (nextCoo.x <= curCoo.x && nextCoo.x + nextCoo.w >= curCoo.x)){
                    inCoo = true;
                    if(!haveOne){
                        haveOne = true;
                        minjl = nextCoo;
                        nextNode = upNodeArr[i];
                    }
                }
                if(inCoo && nextCoo.y - curCoo.y< minjl.y - curCoo.y){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                }
            }
            if(haveOne){
                return(nextNode.focusmodel.FocusID);
            }else{
                return null;
            }

        }
	},
    /**
     * 向左移动焦点
     *
     * upNodeArr： 在当前焦点左方的焦点
     * curCoo：当前焦点的x,y,w,h
     **/
    getLeftFocusName: function(upNodeArr,curCoo){
        var nextNode = null;
        //var maxNextNode = null;
        var bl = true;
        // 距离当前焦点最小的距离
        var minjl = 0;
        // 距离当前焦点最大的距离
        var maxjl = 0;
        var haveOne = false;
        var inCoo = false;
        // 如果存在左方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                var nextCoo = new FunCoo((parseInt(upNodeArr[i].style.left)+parseInt(upNodeArr[i].parentNode.style.left)), (parseInt(upNodeArr[i].style.top)+parseInt(upNodeArr[i].parentNode.style.top)), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));

                // 计算距离
                if(bl){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                    bl = false;
                }
                inCoo = false;
                if((nextCoo.y >= curCoo.y && nextCoo.y <= curCoo.y + curCoo.h) || (nextCoo.y <= curCoo.y && nextCoo.y + nextCoo.h >= curCoo.y)){
                    inCoo = true;
                    if(!haveOne){
                        haveOne = true;
                        minjl = nextCoo;
                        nextNode = upNodeArr[i];
                    }
                }
                if(inCoo && curCoo.x - nextCoo.x < curCoo.x - minjl.x){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                }

            }
            return(nextNode.focusmodel.FocusID);
        }
	},
    /**
     * 向右移动焦点
     *
     * upNodeArr： 在当前焦点左方的焦点
     * curCoo：当前焦点的x,y,w,h
     **/
    getRightFocusName: function(upNodeArr,curCoo){
        var nextNode = null;
        //var maxNextNode = null;
        var bl = true;
        // 距离当前焦点最小的距离
        var minjl = 0;
        // 距离当前焦点最大的距离
        var maxjl = 0;
        var haveOne = false;
        var inCoo = false;
        // 如果存在右方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo((parseInt(upNodeArr[i].style.left)+parseInt(upNodeArr[i].parentNode.style.left)), (parseInt(upNodeArr[i].style.top)+parseInt(upNodeArr[i].parentNode.style.top)), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                // 计算距离
                if(bl){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                    bl = false;
                }
                inCoo = false;
                if((nextCoo.y >= curCoo.y && nextCoo.y <= curCoo.y + curCoo.h) || (nextCoo.y <= curCoo.y && nextCoo.y + nextCoo.h >= curCoo.y)){
                    inCoo = true;
                    if(!haveOne){
                        haveOne = true;
                        minjl = nextCoo;
                        nextNode = upNodeArr[i];
                    }
                }
                if(inCoo && nextCoo.x - curCoo.x< minjl.x - curCoo.x){
                    minjl = nextCoo;
                    nextNode = upNodeArr[i];
                }

            }
            return(nextNode.focusmodel.FocusID);
        }
	}
};
/**
* 存储坐标
* */
function FunCoo(_x, _y,_w,_h) {
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
}
/**
* 动画构造函数
* */
function ColumnAnimation(){
    //存放非CSS3类型动画的方法名
	this.aniFunArr = [];
	//存放非CSS3类型动画的开始-（0--》1--》2）-结束动画状态
	this.aniFlagObj = {};
	//存放动画帧类动画次数,0: 无数次,1: 一次,2: 已执行一次
    this.aniTimesObj = {};
    //存放各个DOM播放至哪一张图的下标
	this.aniChangeTimes = {};
	/**
	*判断当前DOM（objDom）元素是否拥有cls类
     *
     * objDom: 查询元素
     * cls类名
	* */
	this.hasClass = function(objDom,cls){
        return objDom.className.match(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'));
	};
    /**
     *为当前DOM（objDom）元素添加cls类
     *
     * objDom: 查询元素
     * cls类名
     * */
	this.addClass = function(objDom,cls){
        if(!this.hasClass(objDom, cls)) objDom.className += " " + cls;
	};
    /**
     *为当前DOM（objDom）元素移除cls类
     *
     * objDom: 查询元素
     * cls类名
     * */
	this.removeClass = function(objDom,cls){
        if(this.hasClass(objDom, cls)) objDom.className = objDom.className.replace(new RegExp('(\\s+|^)' + cls + '(\\s+|$)'), '');
	};
	/**
	* 同类推荐信息所有推荐图调用多帧动画切换（当一类推荐图片推荐了多张图片时）
     *
     * imgUrl： 图片地址
     * recMsg: 推荐类型（正文推荐，退出推荐，其余推荐）
	* */
	this.getRecycleAni = function(imgUrl,recMsg){
		for(var i = 0; i < recMsg.length; i++){
			this.setRecycleAni(imgUrl,recMsg[i].recommendPic,recMsg[i].animationTimes[0]);
			this.setRecycleAni(imgUrl,recMsg[i].recommendLabelpic,recMsg[i].animationTimes[1]);
			this.setRecycleAni(imgUrl,recMsg[i].recommendShowPic,recMsg[i].animationTimes[2]);
			this.setRecycleAni(imgUrl,recMsg[i].recommendHidePic,recMsg[i].animationTimes[3]);
		}
	};
    /**
     * 多帧动画切换（当一类推荐图片推荐了多张图片时）
     *
     * imgUrl： 图片地址
     * recMsg: 同类推荐图所有信息
     * once： 是否只执行一次动画
     * */
	this.setRecycleAni = function(imgUrl,recMsg,once){
		if(recMsg && recMsg.length && this.aniChangeTimes[recMsg[0].divId] != undefined && this.aniFlagObj[recMsg[0].divId] != undefined && this.aniFlagObj[recMsg[0].divId] != 2){
			var nowImg = this.aniChangeTimes[recMsg[0].divId]%recMsg.length;
            if(nowImg === 0 && once == "1"){
                /*document.getElementById(recMsg[0].divId).style.width = recMsg[0].width + "px";
                document.getElementById(recMsg[0].divId).style.height = recMsg[0].height + "px";
                document.getElementById(recMsg[0].divId).style.top = recMsg[0].yValue + "px";
                document.getElementById(recMsg[0].divId).style.left = recMsg[0].xValue + "px";
                document.getElementById(recMsg[0].imgId).style.width = recMsg[0].width + "px";
                document.getElementById(recMsg[0].imgId).style.height = recMsg[0].height + "px";
                document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[0].url;*/
            }else{
                document.getElementById(recMsg[0].divId).style.width = recMsg[nowImg].width + "px";
                document.getElementById(recMsg[0].divId).style.height = recMsg[nowImg].height + "px";
                document.getElementById(recMsg[0].divId).style.top = recMsg[nowImg].yValue + "px";
                document.getElementById(recMsg[0].divId).style.left = recMsg[nowImg].xValue + "px";
                document.getElementById(recMsg[0].imgId).style.width = recMsg[nowImg].width + "px";
                document.getElementById(recMsg[0].imgId).style.height = recMsg[nowImg].height + "px";
                document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[nowImg].url;
                this.aniChangeTimes[recMsg[0].divId] ++;
            }
		}else if(recMsg && recMsg.length > 1){
            document.getElementById(recMsg[0].divId).style.width = recMsg[0].width + "px";
            document.getElementById(recMsg[0].divId).style.height = recMsg[0].height + "px";
            document.getElementById(recMsg[0].divId).style.top = recMsg[0].yValue + "px";
            document.getElementById(recMsg[0].divId).style.left = recMsg[0].xValue + "px";
            document.getElementById(recMsg[0].imgId).style.width = recMsg[0].width + "px";
            document.getElementById(recMsg[0].imgId).style.height = recMsg[0].height + "px";
            document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[0].url;
        }
	};
	/**
	* 同类推荐信息所有推荐图调用多帧动画切换（当一类推荐图片推荐了多张图片时）
     *
     * imgUrl： 图片地址
     * recMsg: 推荐类型（正文推荐，退出推荐，其余推荐）
	* */
	this.getRecycleAniOfOther = function(imgUrl,recMsg){
		for(var i = 0; i < recMsg.length; i++){
			this.setRecycleAniOfOther(imgUrl,recMsg[i].recommendPic,recMsg[i].animationTimes[0]);
			this.setRecycleAniOfOther(imgUrl,recMsg[i].recommendLabelpic,recMsg[i].animationTimes[1]);
			this.setRecycleAniOfOther(imgUrl,recMsg[i].recommendShowPic,recMsg[i].animationTimes[2]);
			this.setRecycleAniOfOther(imgUrl,recMsg[i].recommendHidePic,recMsg[i].animationTimes[3]);
		}
	};
	/**
     * 多帧动画切换（当一类推荐图片推荐了多张图片时）
     *
     * imgUrl： 图片地址
     * recMsg: 同类推荐图所有信息
     * once： 是否只执行一次动画
     * */
	this.setRecycleAniOfOther = function(imgUrl,recMsg,once){
		if(recMsg && recMsg.length){
			if(this.aniChangeTimes[recMsg[0].divId] == undefined){
				this.aniChangeTimes[recMsg[0].divId] = 0;
			}
			if(this.aniFlagObj[recMsg[0].divId] == undefined){
				this.aniFlagObj[recMsg[0].divId] = 0;
			}
		}
		if(recMsg && recMsg.length && this.aniChangeTimes[recMsg[0].divId] != undefined && this.aniFlagObj[recMsg[0].divId] != undefined && this.aniFlagObj[recMsg[0].divId] != 2){
			var nowImg = this.aniChangeTimes[recMsg[0].divId]%recMsg.length;
            if(nowImg === 0 && once == "1"){
                /*document.getElementById(recMsg[0].divId).style.width = recMsg[0].width + "px";
                document.getElementById(recMsg[0].divId).style.height = recMsg[0].height + "px";
                document.getElementById(recMsg[0].divId).style.top = recMsg[0].yValue + "px";
                document.getElementById(recMsg[0].divId).style.left = recMsg[0].xValue + "px";
                document.getElementById(recMsg[0].imgId).style.width = recMsg[0].width + "px";
                document.getElementById(recMsg[0].imgId).style.height = recMsg[0].height + "px";
                document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[0].url;*/
            }else{
                document.getElementById(recMsg[0].divId).style.width = recMsg[nowImg].width + "px";
                document.getElementById(recMsg[0].divId).style.height = recMsg[nowImg].height + "px";
                document.getElementById(recMsg[0].divId).style.top = recMsg[nowImg].yValue + "px";
                document.getElementById(recMsg[0].divId).style.left = recMsg[nowImg].xValue + "px";
                document.getElementById(recMsg[0].imgId).style.width = recMsg[nowImg].width + "px";
                document.getElementById(recMsg[0].imgId).style.height = recMsg[nowImg].height + "px";
                document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[nowImg].url;
                this.aniChangeTimes[recMsg[0].divId] ++;
            }
		}else if(recMsg && recMsg.length > 1){
            document.getElementById(recMsg[0].divId).style.width = recMsg[0].width + "px";
            document.getElementById(recMsg[0].divId).style.height = recMsg[0].height + "px";
            document.getElementById(recMsg[0].divId).style.top = recMsg[0].yValue + "px";
            document.getElementById(recMsg[0].divId).style.left = recMsg[0].xValue + "px";
            document.getElementById(recMsg[0].imgId).style.width = recMsg[0].width + "px";
            document.getElementById(recMsg[0].imgId).style.height = recMsg[0].height + "px";
            document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[0].url;
        }
	};
	/**
	*判断并设置推荐详情中4类图片分辨使用那种CSS3动画
     *
     * aniMsg: 推荐详情
	* */
	this.getCSSType = function(aniMsg){
        for(var i = 0; i < aniMsg.length; i++){
            if(aniMsg[i].animationType[0] != 0){
                this.setCSSType(aniMsg[i].recommendPic,aniMsg[i].animationType[0]);
            }
            if(aniMsg[i].animationType[1] != 0){
                this.setCSSType(aniMsg[i].recommendLabelpic,aniMsg[i].animationType[1]);
            }
            if(aniMsg[i].animationType[2] != 0){
                this.setCSSType(aniMsg[i].recommendShowPic,aniMsg[i].animationType[2]);
            }
            if(aniMsg[i].animationType[3] != 0){
                this.setCSSType(aniMsg[i].recommendHidePic,aniMsg[i].animationType[3]);
            }
        }
    };
	/**
	*更具type设置CSS3动画类型，添加执行动画动作的Class
     *
     * aniMsg:一组图片信息
     * type: 动画类型
	* */
    this.setCSSType = function(aniMsg,type){
        if(aniMsg.length > 0){
            var addAniDivDom = document.getElementById(aniMsg[0].divId);
            var addAniImgDom = document.getElementById(aniMsg[0].imgId);
            if(addAniDivDom.className == ""){
                switch (type){
                    //从下往上
                    case 1:
                        this.addClass(addAniDivDom,"animated");
                        this.addClass(addAniDivDom,"fadeInUp");
                        break;
                    //从上往下
                    case 2:
                        this.addClass(addAniDivDom,"animated");
                        this.addClass(addAniDivDom,"fadeInDown");
                        break;
                    //从右往左
                    case 3:
                        this.addClass(addAniDivDom,"animated");
                        this.addClass(addAniDivDom,"fadeInLeft");
                        break;
                    //从左往右
                    case 4:
                        this.addClass(addAniDivDom,"animated");
                        this.addClass(addAniDivDom,"fadeInRight");
                        break;
                    //渐渐显示
                    case 5:
                        this.addClass(addAniDivDom,"littleByLittle");
                        break;
                    //渐渐隐藏
                    case 6:
                        this.addClass(addAniDivDom,"littleByLittle");
                        break;
                    //循环脉动
                    case 7:
                        this.addClass(addAniDivDom,"rePulse");
                        break;
                    //循环晃动
                    case 8:
                        this.addClass(addAniDivDom,"reShake");
                        break;
                    //循环闪烁
                    case 9:
                        this.addClass(addAniDivDom,"reFlash");
                        break;
                    //循环左右摇摆
                    case 10:
                        this.addClass(addAniDivDom,"reSwing");
                        break;
					//1.35倍放大
                    case 12:
                        this.addClass(addAniDivDom,"bigger");
                        break;
                    default:
                        break;
                }
            }
        }
    };
    /**
    *失去焦点时，删除失去焦点有关推荐的所有Class
     *
     * aniMsg：删除动画的推荐信息
     * 
    * */
    this.delCSSType = function(aniMsg,type){
        if(aniMsg.length > 0){
            var addAniDivDom = document.getElementById(aniMsg[0].divId);
            addAniDivDom.className = "";
        }
    };
    /**
    *设置当前焦点有关推荐信息的动画类型
     * focusMsg: 当前焦点的相关推荐信息
    * */
    this.setCSSFocusType = function(focusMsg){
        if(focusMsg.animationType[0] != 0){
            this.setCSSType(focusMsg.recommendPic,focusMsg.animationType[0]);
        }
        if(focusMsg.animationType[1] != 0){
            this.setCSSType(focusMsg.recommendLabelpic,focusMsg.animationType[1]);
        }
        if(focusMsg.animationType[2] != 0){
            this.setCSSType(focusMsg.recommendShowPic,focusMsg.animationType[2]);
        }
        if(focusMsg.animationType[3] != 0){
            this.setCSSType(focusMsg.recommendHidePic,focusMsg.animationType[3]);
        }
    };
    /**
     * 失去焦点时删除动画
    * */
    this.setCSSBlurType = function(blurMsg){
        if(blurMsg.animationType[0] != 0){
            this.delCSSType(blurMsg.recommendPic,blurMsg.animationType[0]);
        }
        if(blurMsg.animationType[1] != 0){
            this.delCSSType(blurMsg.recommendLabelpic,blurMsg.animationType[1]);
        }
        if(blurMsg.animationType[2] != 0){
            this.delCSSType(blurMsg.recommendShowPic,blurMsg.animationType[2]);
        }
        if(blurMsg.animationType[3] != 0){
            this.delCSSType(blurMsg.recommendHidePic,blurMsg.animationType[3]);
        }
    };
    /**
     * 设置其余推荐信息动画类型
     * otherMsg：其余推荐信息
    * */
    this.setOtherCSSType = function(otherMsg){
        if(otherMsg.animationType[0] != 0){
            this.setCSSType(otherMsg.recommendPic,otherMsg.animationType[0]);
        }
        if(otherMsg.animationType[1] != 0){
            this.setCSSType(otherMsg.recommendLabelpic,otherMsg.animationType[1]);
        }
        if(otherMsg.animationType[2] != 0){
            this.setCSSType(otherMsg.recommendShowPic,otherMsg.animationType[2]);
        }
        if(otherMsg.animationType[3] != 0){
            this.setCSSType(otherMsg.recommendHidePic,otherMsg.animationType[3]);
        }
    };
};

ColumnAnimation.prototype = {
	getAniDomInfo: function(moveDiv){
		var moveMsg = "";
		for(var i = 0; i < newOutJson.allMsg.recommendMsg.length; i++){
			if(newOutJson.allMsg.recommendMsg[i].recommendPic.length > 0){
				if(newOutJson.allMsg.recommendMsg[i].recommendPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.recommendMsg[i].recommendPic[0];
                    return moveMsg;
				}
			}
            if(newOutJson.allMsg.recommendMsg[i].recommendLabelpic.length > 0){
                if(newOutJson.allMsg.recommendMsg[i].recommendLabelpic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.recommendMsg[i].recommendLabelpic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.recommendMsg[i].recommendShowPic.length > 0){
                if(newOutJson.allMsg.recommendMsg[i].recommendShowPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.recommendMsg[i].recommendShowPic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.recommendMsg[i].recommendHidePic.length > 0){
                if(newOutJson.allMsg.recommendMsg[i].recommendHidePic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.recommendMsg[i].recommendHidePic[0];
                    return moveMsg;
                }
            }
		}
        for(var i = 0; i < newOutJson.allMsg.otherDetailMsg.length; i++){
            if(newOutJson.allMsg.otherDetailMsg[i].recommendPic.length > 0){
                if(newOutJson.allMsg.otherDetailMsg[i].recommendPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.otherDetailMsg[i].recommendPic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.otherDetailMsg[i].recommendLabelpic.length > 0){
                if(newOutJson.allMsg.otherDetailMsg[i].recommendLabelpic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.otherDetailMsg[i].recommendLabelpic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.otherDetailMsg[i].recommendShowPic.length > 0){
                if(newOutJson.allMsg.otherDetailMsg[i].recommendShowPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.otherDetailMsg[i].recommendShowPic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.otherDetailMsg[i].recommendHidePic.length > 0){
                if(newOutJson.allMsg.otherDetailMsg[i].recommendHidePic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.otherDetailMsg[i].recommendHidePic[0];
                    return moveMsg;
                }
            }
        }
        for(var i = 0; i < newOutJson.allMsg.outRecommendMsg.length; i++){
            if(newOutJson.allMsg.outRecommendMsg[i].recommendPic.length > 0){
                if(newOutJson.allMsg.outRecommendMsg[i].recommendPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.outRecommendMsg[i].recommendPic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.outRecommendMsg[i].recommendLabelpic.length > 0){
                if(newOutJson.allMsg.outRecommendMsg[i].recommendLabelpic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.outRecommendMsg[i].recommendLabelpic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.outRecommendMsg[i].recommendShowPic.length > 0){
                if(newOutJson.allMsg.outRecommendMsg[i].recommendShowPic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.outRecommendMsg[i].recommendShowPic[0];
                    return moveMsg;
                }
            }
            if(newOutJson.allMsg.outRecommendMsg[i].recommendHidePic.length > 0){
                if(newOutJson.allMsg.outRecommendMsg[i].recommendHidePic[0].divId == moveDiv){
                    moveMsg = newOutJson.allMsg.outRecommendMsg[i].recommendHidePic[0];
                    return moveMsg;
                }
            }
        }

        return moveMsg;
	},
    /**
     * 获取当前推荐详情四类图片的动画类型
     *
     * aniMsg: 推荐详情
    * */
    getAniType: function(aniMsg){
        var addAniId = "";
        for(var i = 0; i < aniMsg.length; i++){
            if(aniMsg[i].animationType[0] != 0){
                this.devideAniType(aniMsg[i].recommendPic,aniMsg[i].animationType[0]);
            }
            if(aniMsg[i].animationType[1] != 0){
                this.devideAniType(aniMsg[i].recommendLabelpic,aniMsg[i].animationType[1]);
            }
            if(aniMsg[i].animationType[2] != 0){
                this.devideAniType(aniMsg[i].recommendShowPic,aniMsg[i].animationType[2]);
            }
            if(aniMsg[i].animationType[3] != 0){
                this.devideAniType(aniMsg[i].recommendHidePic,aniMsg[i].animationType[3]);
            }
        }
    },
    /**
     * 将对应的动画添加至动画数组中（aniFunArr）
     * aniMsg: 推荐详情
     * type: 动画类型
    * */
    devideAniType: function(aniMsg,type){
        if(aniMsg.length > 0){
            var addAniDivDom = document.getElementById(aniMsg[0].divId);
            var addAniImgDom = document.getElementById(aniMsg[0].imgId);
            switch (type){
                //上移
                case 1:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.fromBottom('"+aniMsg[0].divId+"')");
                    break;
                //下移
                case 2:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.fromUp('"+aniMsg[0].divId+"')");
                    break;
                //左移
                case 3:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.fromRight('"+aniMsg[0].divId+"')");
                    break;
                //右移
                case 4:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.fromLeft('"+aniMsg[0].divId+"')");
                    break;
                //渐渐显示
                case 5:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.toHide('"+aniMsg[0].divId+"')");
                    break;
                //渐渐隐藏
                case 6:
                    this.aniFlagObj[aniMsg[0].divId] = 2;
                    this.aniFunArr.push("columnAni.toShow('"+aniMsg[0].divId+"')");
                    break;
                default:
                    break;
            }
        }
    },
    /**
     * 执行动画定时器
     *
     * imgUrl: 图片地址
     * allMsg: 所有推荐信息（正文推荐，推出推荐，其余推荐）
    * */
    startInterval: function(imgUrl,allMsg){
        var _this = this;
        clearInterval(this.oneInterval);
        this.oneInterval = setInterval(function(){
            _this.getRecycleAni(imgUrl,allMsg.recommendMsg);
            _this.getRecycleAni(imgUrl,allMsg.outRecommendMsg);
            _this.getRecycleAniOfOther(imgUrl,allMsg.otherDetailMsg);
            for(var f = 0;f < _this.aniFunArr.length; f++){
                eval(_this.aniFunArr[f]);
            }
        },168);
    },
    /**
     * 右移并渐渐显示
     *
     * moveDiv: 执行移动的DOM元素ID
    * */
	fromLeft: function(moveDiv){
		var moveDom = document.getElementById(moveDiv);
		var moveMsg = this.getAniDomInfo(moveDiv);
		if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
				if(parseInt(moveDom.style.left) - parseInt(moveMsg.width) >= 0){
                    moveDom.style.left = "0px";
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
				}
            }else if(this.aniFlagObj[moveDiv] === 2 && parseInt(moveDom.style.left) !== parseInt(moveMsg.xValue)){
                moveDom.style.opacity = 1;
            	moveDom.style.left = moveMsg.xValue + "px";
            }else if(this.aniFlagObj[moveDiv] === 1){
            	var lastDis = parseInt(moveMsg.xValue) - parseInt(moveDom.style.left);
                var moveDis = Math.ceil(lastDis/5);
				if(lastDis <= 30){
                    this.aniFlagObj[moveDiv] = 2;
				}else{
					if(moveDis < 30){
                        moveDis = 30;
					}
                    moveDom.style.opacity = parseInt(moveDom.style.left)/parseInt(moveMsg.xValue);
                    moveDom.style.left = parseInt(moveDom.style.left) + moveDis + "px";
				}
            }
		}
	},
    /**
     * 左移并渐渐显示
     *
     * moveDiv: 执行移动的DOM元素ID
     * */
	fromRight: function(moveDiv){
        var moveDom = document.getElementById(moveDiv);
        var moveMsg = this.getAniDomInfo(moveDiv);
        if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
                if(parseInt(moveDom.style.left) + parseInt(moveMsg.width) <= 1280){
                    moveDom.style.left = 1280 - parseInt(moveMsg.width) + "px";
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
                }
            }else if(this.aniFlagObj[moveDiv] === 2 && parseInt(moveDom.style.left) !== parseInt(moveMsg.xValue)){
                moveDom.style.opacity = 1;
                moveDom.style.left = moveMsg.xValue + "px";
            }else if(this.aniFlagObj[moveDiv] === 1){
            	var lastDis = parseInt(moveDom.style.left) - parseInt(moveMsg.xValue);
            	if(lastDis < 0){
                    lastDis = 0 - lastDis;
				}
                var moveDis = Math.ceil(lastDis/5);
                if(lastDis <= 30){
                    this.aniFlagObj[moveDiv] = 2;
                }else{
                    if(moveDis < 30){
                        moveDis = 30;
                    }
                    moveDom.style.opacity = (1280 - parseInt(moveDom.style.left))/(1280 - parseInt(moveMsg.xValue));
                    moveDom.style.left = parseInt(moveDom.style.left) + moveDis + "px";
                }
            }
        }
	},
    /**
     * 下移并渐渐显示
     *
     * moveDiv: 执行移动的DOM元素ID
     * */
	fromUp: function(moveDiv){
        var moveDom = document.getElementById(moveDiv);
        var moveMsg = this.getAniDomInfo(moveDiv);
        if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
                if(parseInt(moveDom.style.top) - parseInt(moveMsg.height) >= 0){
                    moveDom.style.top = "0px";
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
                }
            }else if(this.aniFlagObj[moveDiv] === 2 && parseInt(moveDom.style.top) !== parseInt(moveMsg.yValue)){
                moveDom.style.opacity = 1;
                moveDom.style.top = moveMsg.yValue + "px";
            }else if(this.aniFlagObj[moveDiv] === 1){
            	var lastDis = parseInt(moveMsg.yValue) - parseInt(moveDom.style.top);
                var moveDis = Math.ceil(lastDis/5);
                if(lastDis <= 30){
                    this.aniFlagObj[moveDiv] = 2;
                }else{
                    if(moveDis < 30){
                        moveDis = 30;
                    }
                    moveDom.style.opacity = parseInt(moveDom.style.top)/parseInt(moveMsg.yValue);
                    moveDom.style.top = parseInt(moveDom.style.top) + moveDis + "px";
                }
            }
        }
	},
    /**
     * 上移并渐渐显示
     *
     * moveDiv: 执行移动的DOM元素ID
     * */
	fromBottom: function(moveDiv){
        var moveDom = document.getElementById(moveDiv);
        var moveMsg = this.getAniDomInfo(moveDiv);
        if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
                if(parseInt(moveDom.style.top) + parseInt(moveMsg.height) <= 720){
                    moveDom.style.top = 720 - parseInt(moveMsg.height) + "px";
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
                }
            }else if(this.aniFlagObj[moveDiv] === 2 && parseInt(moveDom.style.top) !== parseInt(moveMsg.yValue)){
                moveDom.style.opacity = 1;
                moveDom.style.top = moveMsg.yValue + "px";
            }else if(this.aniFlagObj[moveDiv] === 1){
            	var lastDis = parseInt(moveMsg.yValue) - parseInt(moveDom.style.top);
				if(lastDis < 0){
                    lastDis = 0 - lastDis;
				}
                var moveDis = Math.ceil(lastDis/5);
                if(parseInt(moveMsg.yValue) - parseInt(moveDom.style.top) <= 30){
                    this.aniFlagObj[moveDiv] = 2;
                }else{
                    if(moveDis < 30){
                        moveDis = 30;
                    }
                    moveDom.style.opacity = (720 - parseInt(moveDom.style.top))/(720 - parseInt(moveMsg.yValue));
                    moveDom.style.top = parseInt(moveDom.style.top) - moveDis + "px";
                }
            }
        }
	},
    /**
     * 并渐渐隐藏
     *
     * moveDiv: 执行移动的DOM元素ID
     * */
	toHide: function(moveDiv){
        var moveDom = document.getElementById(moveDiv);
        var moveMsg = this.getAniDomInfo(moveDiv);
        if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
                if(moveDom.style.opacity >= 1 && moveDom.style.visibility != "hidden"){
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
                }
            }else if(this.aniFlagObj[moveDiv] === 2 && moveDom.style.opacity > 0){
                moveDom.style.opacity = 0;
                moveDom.style.visibility = "hidden";
            }else if(this.aniFlagObj[moveDiv] === 1){
                if(parseFloat(moveDom.style.opacity) <= 0){
                    this.aniFlagObj[moveDiv] = 2;
                }else{
                    moveDom.style.opacity = parseFloat(moveDom.style.opacity) - 0.2;
                }
            }
        }
	},
    /**
     * 渐渐显示
     *
     * moveDiv: 执行移动的DOM元素ID
     * */
	toShow: function(moveDiv){
        var moveDom = document.getElementById(moveDiv);
        var moveMsg = this.getAniDomInfo(moveDiv);
        if(moveMsg != "" && moveDom){
            if(this.aniFlagObj[moveDiv] === 0){
                if(moveDom.style.opacity >= 1 && moveDom.style.visibility != "visible"){
                    moveDom.style.opacity = 0;
                    moveDom.style.visibility = "visible";
                    this.aniFlagObj[moveDiv] = 1;
                }
            }else if(this.aniFlagObj[moveDiv] === 2 && moveDom.style.opacity < 1){
                moveDom.style.opacity = 1;
            }else if(this.aniFlagObj[moveDiv] === 1){
                if(parseFloat(moveDom.style.opacity) >= 1){
                    this.aniFlagObj[moveDiv] = 2;
                }else{
                    moveDom.style.opacity = parseFloat(moveDom.style.opacity) + 0.2;
                }
            }
        }
	}
};
