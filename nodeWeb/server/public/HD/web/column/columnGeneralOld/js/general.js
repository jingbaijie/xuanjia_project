function GeneralColumn(){
    /**
     * 生成div包裹img形式的除返回外的焦点DOM元素，返回拼接的字符串
     *
     * generalImgUrl: 图片地址
     * focusMsg:焦点信息，newOutJson.recommendMsg
     * focusName:焦点名称 -->"hands_x0_y0_" + focusName + recommendId + "_"
     * clickFnName: 焦点点击确认方法名称
     */
	this.createFocus = function(generalImgUrl,focusMsg,focusName,clickFnName){
		if(typeof(focusMsg) == "object" && focusMsg.length > 0){
			var focusHtml = "";
			var focusId = "";
			var imgId = "";
			var imgSrc = "";
			var focusWith = "";
			var focusHeight = "";
			var focusTop = "";
			var focusLeft = "";
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
                    focusHtml += "<div id = '" + focusId +"' style = 'width: "+ focusWith +";height: "+ focusHeight+";position: absolute;top: "+ focusTop +";left: "+ focusLeft +";' attr-top = '"+ focusTop +"' attr-left = '"+ focusLeft +"'>" ;
                    focusHtml += "<img id = '"+ imgId +"' src = '"+ imgSrc +"' style = 'width: "+ focusWith +";height: "+ focusHeight +";visibility: hidden;'>";
                     focusHtml += "</div>";
                    this.addRecButtons(i,focusMsg[i],focusName,clickFnName);
				}
			}
			return focusHtml;
		}else{
			return "";
		}
	};
	/**
     * 创建返回DOM元素，返回拼接的字符串
     *
     * generalImgUrl: 图片地址
     * backFocusMsg: 返回按钮数据newOutJson.allMsg.outRecommendMsg
     */
	this.createBackFocus = function(generalImgUrl,backFocusMsg){
        if(typeof(backFocusMsg) == "object" && backFocusMsg.length > 0 && backFocusMsg[0].recommendLabelpic.length > 0){
        	var focusHtml = "";
			var focusId = "hands_x0_y0_backFocus_";
			var imgId = "backFocus";
            backFocusMsg[0].recommendLabelpic[0].divId = focusId;
            backFocusMsg[0].recommendLabelpic[0].imgId = imgId;
			var imgSrc = generalImgUrl + backFocusMsg[0].recommendLabelpic[0].url;
			var focusWith = backFocusMsg[0].recommendLabelpic[0].width + "px";
			var focusHeight = backFocusMsg[0].recommendLabelpic[0].height + "px";
			var focusTop = backFocusMsg[0].recommendLabelpic[0].yValue + "px";
			var focusLeft = backFocusMsg[0].recommendLabelpic[0].xValue + "px";
			focusHtml += "<div id = '" + focusId +"' style = 'width: "+ focusWith +";height: "+ focusHeight+";position: absolute;top: "+ focusTop +";left: "+ focusLeft +";' attr-top = '"+ focusTop +"' attr-left = '"+ focusLeft +"'>";
            focusHtml += "<img id = '"+ imgId +"' src = '"+ imgSrc +"' style = 'width: "+ focusWith +";height: "+ focusHeight +";visibility: hidden;'>";
            focusHtml += "</div>";
			buttons.push({
				id: focusId,
                TempData: backFocusMsg[0],
				clickHandler: "javascript: backFunc()",
                otherFocusEvent: "javascript: backGetFocus(0)",
                otherBlurEvent: "javascript: backLoseFocus(0)",
                upEvent: "javascript: column.focusMove('up')",
                downEvent: "javascript: column.focusMove('down')",
                leftEvent: "javascript: column.focusMove('left')",
                rightEvent: "javascript: column.focusMove('right')",
                focusType: 7

			});
            return focusHtml;
        }else{
        	return "";
		}
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
                    detailHtml += "<div id = '" + detailId +"' style = 'width: "+ detailWith +";height: "+ detailHeight +";position: absolute;top: "+ detailTop +";left: "+ detailLeft +";visibility: "+ visi +";' attr-top = '"+ detailTop +"' attr-left = '"+ detailLeft +"' >";
                    detailHtml += "<img id = '"+ imgId +"' src = '"+ imgSrc +"' style = 'width: "+ detailWith +";height: "+ detailHeight +"'>";
                    detailHtml += "</div>";
				}
            }
            return detailHtml;
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
	this.addRecButtons = function(ii,buttonsMsg,focusName,clickFnName){
		var focusId = "hands_x0_y0_" + focusName + buttonsMsg.recommendId + "_";
		var newButton = {
			id: focusId,
            TempData: buttonsMsg,
			clickHandler: "javascript: "+ clickFnName + "("+ ii +")",
			otherFocusEvent: "javascript: getFocusNow("+ ii +")",
			otherBlurEvent: "javascript: loseFocusNow("+ ii +")",
			upEvent: "javascript: column.focusMove('up')",
			downEvent: "javascript: column.focusMove('down')",
			leftEvent: "javascript: column.focusMove('left')",
			rightEvent: "javascript: column.focusMove('right')",
			focusType: 7
		};
		buttons.push(newButton);
	}
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
     *判断当前焦点是否有制定移动目标，无则按就近原则选择下一个焦点目标，并记录此焦点目标为下次当前焦点该方向上的目标
     *
     *direction: 焦点移动方向
    * */
	focusMove: function(direction){
		if(curFocus.TempData){
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
                PAGE.focusArr[curFocus.FocusID][direction] = targetFocus;
                PAGE.focusArr[curFocus.FocusID][direction + "Event"] = "";
                this.changeFocus(targetFocus);
			}else{
				targetFocus = this.getNextFocusName(direction);
				if(targetFocus && document.getElementById(targetFocus)){
                    PAGE.focusArr[curFocus.FocusID][direction] = targetFocus;
                    PAGE.focusArr[curFocus.FocusID][direction + "Event"] = "";
                    this.changeFocus(targetFocus);
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
		var x = parseInt(curNode.style.left);
		var y = parseInt(curNode.style.top);
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
			var top = parseInt(j.style.top);
			var left = parseInt(j.style.left);
			// 忽略已经被禁用的焦点
			if (j.focusmodel.enFocus == true) {
				if(top < (y+h/2)){
					upNodeArr.push(j);
				}
				if(top > y){
					downNodeArr.push(j);
				}
				if(left < x){
					leftNodeArr.push(j);
				}
				if(left > x){
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
        // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                // 计算距离
                var jl = this.distanceCALTop(curCoo, nextCoo);
                // 这么做是首次赋值
                if (bl) {
                    minjl = jl;
                    maxjl = jl;
                    nextNode = upNodeArr[i];
                    maxNextNode = upNodeArr[i];
                    bl = false;
                }
                // 比较出最小的距离
                /*
                * 如果重合等级高，则为重合等级的数，
                * 如果没有重合等级一样，则比较距离
                ** */
                if(jl[1]<minjl[1]){
                    nextNode = upNodeArr[i];
                    minjl = jl;
                }else if(jl[1]==minjl[1]){
                    if (jl[0] <= minjl[0]) {

                        nextNode = upNodeArr[i];
                        minjl = jl;
                    }
                }
                /* if (jl[0] <= minjl[0]) {

                            nextNode = upNodeArr[i];
                            minjl = jl;
                        }*/

            }

            return(nextNode.focusmodel.FocusID);
        }
	},
    /**
    * 计算当前焦点上方距离两两焦点中最近的一个焦点，返回距离
    * */
    distanceCALTop: function(_coo1, _coo2){
        //获取第一点的X坐标
        var x1 = _coo1.x;
        //获取第一点的Y坐标
        var y1 = _coo1.y;
        //获取第一点的X坐标
        var w1 = _coo1.w;
        //获取第一点的Y坐标
        var h1 = _coo1.h;
        //获取第二点的X坐标
        var x2 = _coo2.x;
        //获取第二点的Y坐标
        var y2 = _coo2.y;
        //获取第二点的X坐标
        var w2 = _coo2.w;
        //获取第二点的Y坐标
        var h2 = _coo2.h;

        //重合的等级高于未重合的等级
        var positionRelative=1000;
        //判断是否存在重合

        /* if ((x1<=x2&&x1+w1>=x2)||(x1<=x2+w2&&x1+w1>=w2+x2)||(x1>=w2&&x1<=x2+w2)||(x1+w1>=x2&&x1+w1<=x2+w2)) {

             positionRelative= Math.abs(y1-(y2+h2))
         }*/

        /*取n点判断两个边的最短距离*/
        //平均每条线找n个点分割,n暂定为4
        var CArr1 = [];
        var CArr2 = [];
        n = 4;
        for (var i = 0; i <= n; i++) {
            CArr1.push([x1 + parseInt(w1 / n * i), y1 ]);
            CArr2.push([x2 + parseInt(w2 / n * i), y2+h2 ]);
        }

        var result = [];
        for (var i = 0; i < CArr1.length; i++) {
            for (var j = 0; j < CArr2.length; j++) {
                var calX = CArr1[i][0] - CArr2[j][0];
                var calY = CArr1[i][1] - CArr2[j][1];

                result.push(Math.round(Math.pow(calX * calX + calY * calY, 0.5)))
            }

        }
        var min = result[0];
        for (var k = 0; k < result.length; k++) {

            if (min > result[k]) {
                min = result[k];
            }
        }
        positionRelative = min;

        var mx1 = x1 + w1 / 2;
        var my1 = y1;
        var mx2 = x2 + w2 / 2;
        var my2 = y2 + h2;

        var calX = mx1 - mx2;
        var calY = my1 - my2;

        return [Math.round(Math.pow(calX * calX + calY * calY, 0.5)),positionRelative];
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
        // 如果存在上方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                // 计算距离
                var jl = this.distanceCALBottom(curCoo, nextCoo);
                // 这么做是首次赋值
                if (bl) {
                    minjl = jl;
                    maxjl = jl;
                    nextNode = upNodeArr[i];
                    maxNextNode = upNodeArr[i];
                    bl = false;
                }

                // 比较出最小的距离
                /*
                * 如果重合等级高，则为重合等级的数，
                * 如果没有重合等级一样，则比较距离
                *
                * */
                if(jl[1]<minjl[1]){
                    nextNode = upNodeArr[i];
                    minjl = jl;
                }else if(jl[1]==minjl[1]){
                    if (jl[0] <= minjl[0]) {

                        nextNode = upNodeArr[i];
                        minjl = jl;
                    }
                }
                /* if (jl[0] <= minjl[0]) {

                        nextNode = upNodeArr[i];
                        minjl = jl;
                    }
                */
            }

            return(nextNode.focusmodel.FocusID);

        }
	},
    distanceCALBottom: function(_coo1, _coo2){
        //获取第一点的X坐标
        var x1 = _coo1.x;
        //获取第一点的Y坐标
        var y1 = _coo1.y;
        //获取第一点的X坐标
        var w1 = _coo1.w;
        //获取第一点的Y坐标
        var h1 = _coo1.h;
        //获取第二点的X坐标
        var x2 = _coo2.x;
        //获取第二点的Y坐标
        var y2 = _coo2.y;
        //获取第二点的X坐标
        var w2 = _coo2.w;
        //获取第二点的Y坐标
        var h2 = _coo2.h;

        //重合的等级高于未重合的等级
        var positionRelative=1000;
        //判断是否存在重合

        /* if ((x1<=x2&&x1+w1>=x2)||(x1<=x2+w2&&x1+w1>=w2+x2)||(x1>=w2&&x1<=x2+w2)||(x1+w1>=x2&&x1+w1<=x2+w2)) {
             positionRelative=Math.abs(y1+h1-y2);
         }*/

        /*取n点判断两个边的最短距离*/
        //平均每条线找n个点分割,n暂定为4
        var CArr1 = [];
        var CArr2 = [];
        n = 4;
        for (var i = 0; i <= n; i++) {
            CArr1.push([x1 + parseInt(w1 / n * i), y1 + h1]);
            CArr2.push([x2 + parseInt(w2 / n * i), y2 ]);
        }

        var result = [];
        for (var i = 0; i < CArr1.length; i++) {
            for (var j = 0; j < CArr2.length; j++) {
                var calX = CArr1[i][0] - CArr2[j][0];
                var calY = CArr1[i][1] - CArr2[j][1];

                result.push(Math.round(Math.pow(calX * calX + calY * calY, 0.5)))
            }

        }
        var min = result[0];
        for (var k = 0; k < result.length; k++) {

            if (min > result[k]) {
                min = result[k];
            }
        }
        positionRelative = min;



        var mx1 = x1 + w1 / 2;
        var my1 = y1 + h1;
        var mx2 = x2 + w2 / 2;
        var my2 = y2;
        var calX = mx1 - mx2;
        var calY = my1 - my2;
        return [Math.round(Math.pow(calX * calX + calY * calY, 0.5)),positionRelative];
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
        // 如果存在左方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                //var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top));
                /*
            *20180820
             *生成需要计算的坐标，top left 并添加宽高参数

             */
                var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));

                // 计算距离
                // var jl = distanceCAL(curCoo, nextCoo);
                var jl = this.distanceCALLeft(curCoo, nextCoo);

                // 这么做是首次赋值
                if (bl) {
                    minjl = jl;
                    maxjl = jl;
                    nextNode = upNodeArr[i];
                    maxNextNode = upNodeArr[i];
                    bl = false;
                }

                // 比较出最小的距离
                /*
                * 如果重合等级高，则为重合等级的数，
                * 如果没有重合等级一样，则比较距离
                *
                *
                if(jl[1]<minjl[1]){
                    nextNode = upNodeArr[i];
                    minjl = jl;
                }else if(jl[1]==minjl[1]){
                    if (jl[0] <= minjl[0]) {

                        nextNode = upNodeArr[i];
                        minjl = jl;
                    }
                }*/
                if (jl[0] <= minjl[0]) {

                    nextNode = upNodeArr[i];
                    minjl = jl;
                }

            }

            return(nextNode.focusmodel.FocusID);
        }
	},
    distanceCALLeft: function(_coo1, _coo2){
        //获取第一点的X坐标
        var x1 = _coo1.x;
        //获取第一点的Y坐标
        var y1 = _coo1.y;
        //获取第一点的X坐标
        var w1 = _coo1.w;
        //获取第一点的Y坐标
        var h1 = _coo1.h;
        //获取第二点的X坐标
        var x2 = _coo2.x;
        //获取第二点的Y坐标
        var y2 = _coo2.y;
        //获取第二点的X坐标
        var w2 = _coo2.w;

        //获取第二点的Y坐标

        var h2 = _coo2.h;
		//重合的等级高于未重合的等级
        var positionRelative=1000;
        //判断是否存在重合

        if ((y1<=y2&&y1+h1>=y2)||(y1<=y2+h2&&y1+h1>=y2+h2)||(y1>=y2&&y1<=y2+h2)||(y1+h1>=y2&&y1+h1<=y2+h2)) {
            positionRelative= Math.abs(x1-(x2+w2));
        }

        var mx1 = x1;
        var my1 = y1 + h1 / 2;
        var mx2 = x2 + w2;
        var my2 = y2 + h2 / 2

        var calX = mx1 - mx2;
        var calY = my1 - my2;

        return [Math.round(Math.pow(calX * calX + calY * calY, 0.5)),positionRelative];
	},
    getRightFocusName: function(upNodeArr,curCoo){
        var nextNode = null;
        //var maxNextNode = null;
        var bl = true;
        // 距离当前焦点最小的距离
        var minjl = 0;
        // 距离当前焦点最大的距离
        var maxjl = 0;
        // 如果存在右方的焦点,就计算上方的所有焦点中，距离当前焦点最近的
        if (upNodeArr.length > 0) {
            for (var i = 0; i < upNodeArr.length; i++) {
                // 生成坐标
                var nextCoo = new FunCoo(parseInt(upNodeArr[i].style.left), parseInt(upNodeArr[i].style.top), parseInt(upNodeArr[i].style.width), parseInt(upNodeArr[i].style.height));
                // 计算距离
                //var jl = distanceCAL(curCoo, nextCoo);
                /*
				* 20180820
				* drn
				* 计算两个边上中间点的距离
				* */
                var jl = this.distanceCALRight(curCoo, nextCoo);

                // 这么做是首次赋值
                if (bl) {
                    minjl = jl;
                    maxjl = jl;
                    nextNode = upNodeArr[i];
                    maxNextNode = upNodeArr[i];
                    bl = false;
                }
                // 比较出最小的距离
                /*
                * 如果重合等级高，则为重合等级的数，
                * 如果没有重合等级一样，则比较距离
                *
                *
                if(jl[1]<minjl[1]){
                    nextNode = upNodeArr[i];
                    minjl = jl;
                }else if(jl[1]==minjl[1]){
                    if (jl[0] <= minjl[0]) {

                        nextNode = upNodeArr[i];
                        minjl = jl;
                    }
                }*/
                if (jl[0] <= minjl[0]) {

                    nextNode = upNodeArr[i];
                    minjl = jl;
                }

            }
            return(nextNode.focusmodel.FocusID);
        }
	},
    /**
     * 向右移动焦点
     *
     * upNodeArr： 在当前焦点右方的焦点
     * curCoo：当前焦点的x,y,w,h
     **/
    distanceCALRight: function(_coo1, _coo2){
        //获取第一点的X坐标
        var x1 = _coo1.x;
        //获取第一点的Y坐标
        var y1 = _coo1.y;
        //获取第一点的X坐标
        var w1 = _coo1.w;
        //获取第一点的Y坐标
        var h1 = _coo1.h;
        //获取第二点的X坐标
        var x2 = _coo2.x;
        //获取第二点的Y坐标
        var y2 = _coo2.y;
        //获取第二点的X坐标
        var w2 = _coo2.w;
        //获取第二点的Y坐标
        var h2 = _coo2.h;
        var positionRelative=1000;
        //判断是否存在重合

        if ((y1<=y2&&y1+h1>=y2)||(y1<=y2+h2&&y1+h1>=y2+h2)||(y1>=y2&&y1<=y2+h2)||(y1+h1>=y2&&y1+h1<=y2+h2)) {
            positionRelative=Math.abs(x1+w1-x2)
        }


        var mx1 = x1 + w1;
        var my1 = y1 + h1 / 2;
        var mx2 = x2;
        var my2 = y2 + h2 / 2

        var calX = mx1 - mx2;
        var calY = my1 - my2;

        return [Math.round(Math.pow(calX * calX + calY * calY, 0.5)),positionRelative];
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
     * recycleFlag：循环标志
     * recMsg: 推荐类型（正文推荐，退出推荐，其余推荐）
	* */
	this.getRecycleAni = function(imgUrl,recycleFlag,recMsg){
		for(var i = 0; i < recMsg.length; i++){
			this.setRecycleAni(imgUrl,recycleFlag,recMsg[i].recommendPic,recMsg[i].animationTimes[0]);
			this.setRecycleAni(imgUrl,recycleFlag,recMsg[i].recommendLabelpic,recMsg[i].animationTimes[1]);
			this.setRecycleAni(imgUrl,recycleFlag,recMsg[i].recommendShowPic,recMsg[i].animationTimes[2]);
			this.setRecycleAni(imgUrl,recycleFlag,recMsg[i].recommendHidePic,recMsg[i].animationTimes[3]);
		}
	};
    /**
     * 多帧动画切换（当一类推荐图片推荐了多张图片时）
     *
     * imgUrl： 图片地址
     * recycleFlag：循环标志
     * recMsg: 同类推荐图所有信息
     * once： 是否只执行一次动画
     * */
	this.setRecycleAni = function(imgUrl,recycleFlag,recMsg111,once){
		var recMsg = recMsg111;
		if(recMsg && recMsg.length > 1){
			
			//var nowImg = recycleFlag%recMsg.length;
			
			if(this.aniChangeTimes[recMsg[0].divId] == undefined){
				this.aniChangeTimes[recMsg[0].divId] = 1;
			}
			var nowImg = this.aniChangeTimes[recMsg[0].divId]%recMsg.length;
			
			if(this.aniTimesObj[recMsg[0].divId] == undefined){
                this.aniTimesObj[recMsg[0].divId] = once;
            }
			
			if(recMsg[0] && recMsg[0].imgId && this.aniTimesObj[recMsg[0].divId] != 2){
                if(nowImg === 0){
					if(once != "1"){
						document.getElementById(recMsg[0].divId).style.width = recMsg[0].width + "px";
						document.getElementById(recMsg[0].divId).style.height = recMsg[0].height + "px";
						document.getElementById(recMsg[0].imgId).style.width = recMsg[0].width + "px";
						document.getElementById(recMsg[0].imgId).style.height = recMsg[0].height + "px";
						document.getElementById(recMsg[0].divId).style.top = recMsg[0].yValue + "px";
						document.getElementById(recMsg[0].divId).style.left = recMsg[0].xValue + "px";
						document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[0].url;
					}
                    if(this.aniTimesObj[recMsg[0].divId] == 1){
                        this.aniTimesObj[recMsg[0].divId] = 2;
                        //document.getElementById(recMsg[nowImg].divId).style.visibility = "hidden";
					}
                }else{
					document.getElementById(recMsg[0].divId).style.width = recMsg[nowImg].width + "px";
					document.getElementById(recMsg[0].divId).style.height = recMsg[nowImg].height + "px";
					document.getElementById(recMsg[0].imgId).style.width = recMsg[nowImg].width + "px";
					document.getElementById(recMsg[0].imgId).style.height = recMsg[nowImg].height + "px";
					document.getElementById(recMsg[0].divId).style.top = recMsg[nowImg].yValue + "px";
					document.getElementById(recMsg[0].divId).style.left = recMsg[nowImg].xValue + "px";
                    document.getElementById(recMsg[0].imgId).src = imgUrl + recMsg[nowImg].url;
                }
				this.aniChangeTimes[recMsg[0].divId] ++;
			}
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
            var addAniImgDom = document.getElementById(aniMsg[0].imgId);
            addAniDivDom.className = "";
            /*switch (type){
                case 1:
                    this.removeClass(addAniDivDom,"fadeInRight");
                    break;
                case 2:
                    this.removeClass(addAniDivDom,"fadeInLeft");
                    break;
                case 3:
                    this.removeClass(addAniDivDom,"fadeInUp");
                    break;
                case 4:
                    this.removeClass(addAniDivDom,"fadeInDown");
                    break;
                case 5:
                    this.removeClass(addAniDivDom,"littleByLittle");
                    break;
                case 6:
                    this.removeClass(addAniDivDom,"littleByLittle");
                    break;
                default:
                    break;
            }
            this.removeClass(addAniDivDom,"animated");
            */
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
        var recycleFlag = 0;
        this.oneInterval = setInterval(function(){
            recycleFlag ++;
            _this.getRecycleAni(imgUrl,recycleFlag,allMsg.recommendMsg);
            _this.getRecycleAni(imgUrl,recycleFlag,allMsg.outRecommendMsg);
            _this.getRecycleAni(imgUrl,recycleFlag,allMsg.otherDetailMsg);
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
