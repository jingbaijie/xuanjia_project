/***********************************     获取上中下页数据内容    ***************************************/
/**
 * 根据页面英文名获取其在pageMsgArr中的数组下标
 * @param newAction 页面英文名
 * @returns {string|boolean} 当前数据对应位于数组中的下标，为字符串类型
 */
function searchFromPageJsonByAction(newAction){
    for(var i = 0; i < pageMsgArr.length; i++){
        if(pageMsgArr[i].pageInfo.commPageEname == newAction){
            return i+"";
        }
    }
    return false;
}
/**
 * 查看当前页面是否有上一页
 * @param OutJson   当前页面信息
 * @returns {boolean}
 */
function searchHavePrePage(OutJson){
    if(OutJson){
        if(OutJson["recommend_4"] && OutJson["recommend_4"][0] && (OutJson["recommend_4"][0].recommendDisplayType == 4 || OutJson["recommend_4"][0].recommendDisplayType == 6)&& OutJson["recommend_4"][0].commpageId > 0){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
/**
 * 查看当前页面是否有下一页
 * @param OutJson 当前页面信息
 * @returns {boolean}
 */
function searchHaveNextPage(OutJson){
    if(OutJson){
        if(OutJson["recommend_5"] && OutJson["recommend_5"][0] && (OutJson["recommend_5"][0].recommendDisplayType == 4 || OutJson["recommend_5"][0].recommendDisplayType == 6)&& OutJson["recommend_5"][0].commpageId > 0){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
/**
 * 生成当前三屏数据
 */
function allForStart(actionName){
    if(actionName){
        curPageEName = actionName;
    }
    var isAlive = searchFromPageJsonByAction(curPageEName);
    curPageNum = isAlive;
    if(curPageNum){
        if(searchHavePrePage(pageMsgArr[curPageNum])){
            if(!pageMsgArr[curPageNum]["recommend_4"]){
                column.init();
                return;
            }
            if(pageMsgArr[curPageNum]["recommend_4"] &&searchFromPageJsonByAction(pageMsgArr[curPageNum]["recommend_4"][0].commpageName)){
                if(searchHaveNextPage(pageMsgArr[curPageNum])){
                    if(searchFromPageJsonByAction(pageMsgArr[curPageNum]["recommend_5"][0].commpageName)){
                        column.init();
                    }else{
                        getNextPageMsgById(pageMsgArr[curPageNum]["recommend_5"][0].commpageId,function(){
                            column.init();
                        });
                    }
                }else{
                    column.init();
                }
            }else{
                getPrePageMsgById(pageMsgArr[curPageNum]["recommend_4"][0].commpageId,function(){
                    if(searchHaveNextPage(pageMsgArr[curPageNum])){
                        if(searchFromPageJsonByAction(pageMsgArr[curPageNum]["recommend_5"][0].commpageName)){
                            column.init();
                        }else{
                            getNextPageMsgById(pageMsgArr[curPageNum]["recommend_5"][0].commpageId,function(){
                                column.init();
                            });
                        }
                    }else{
                        column.init();
                    }
                })
            }
        }else{
            if(!pageMsgArr[curPageNum]["recommend_5"]){
                column.init();
                return;
            }
            if(pageMsgArr[curPageNum] && pageMsgArr[curPageNum]["recommend_5"] && pageMsgArr[curPageNum]["recommend_5"].length > 0 && pageMsgArr[curPageNum]["recommend_5"][0].recommendDisplayType == "4" && pageMsgArr[curPageNum]["recommend_5"][0].commpageId > 0){
                if(searchFromPageJsonByAction(pageMsgArr[curPageNum]["recommend_5"][0].commpageName)){
                    column.init();
                }else{
                    getNextPageMsgById(pageMsgArr[curPageNum]["recommend_5"][0].commpageId,function(){
                        column.init();
                    });
                }
            }else{
                column.init();
            }
        }
    }else{
        curPageNum = 0;
        getPageMsgByAction(curPageEName);
    }
}

/**
 * 根据页面英文名获取该页面属于通用专题的配置数据
 * @param actionName    页面英文名
 * @param fn    回调函数，回传属于通用专题的配置数据
 */
function getPageMsgByAction(actionName,fn){
    interface.findRecCommonPageInfo({contentName: actionName},function(data){
        if(data){
            data = data.data;
            if(fn && typeof fn == "function"){
                fn(data);
            }else{
                var newOutJson  = new PageJson(data).newOutJson;
                pageMsgArr.push(data);
                pageJsonArr.push(newOutJson);
                allForStart(actionName);
            }
        }
    });
}
/**
 * 根据commPageId获取当前页面的上一级页面信息，主要获取页面英文名
 * @param commPageId    页面commPageId
 */
function getPrePageMsgById(commPageId,fn){
    interface.findCommonPageInfo({params: {contentId: commPageId}},function(data){
		if(data){
			data = data.data;
			getPageMsgByAction(data.pageInfo.commPageEname,function(data){
				var newOutJson = new PageJson(data).newOutJson;
				pageJsonArr.splice(parseInt(curPageNum),0,newOutJson);
				pageMsgArr.splice(parseInt(curPageNum),0,data);
				curPageNum = searchFromPageJsonByAction(curPageEName);
				fn&&fn();
			});
		}
    });
}
/**
 * 根据commPageId获取当前页面的下一级页面信息，主要获取页面英文名
 * @param commPageId    页面commPageId
 */
function getNextPageMsgById(commPageId,fn){
    interface.findCommonPageInfo({params: {contentId: commPageId}},function(data){
		if(data){
			data = data.data;
			getPageMsgByAction(data.pageInfo.commPageEname,function(data){
				var newOutJson = new PageJson(data).newOutJson;
				pageJsonArr.push(newOutJson);
				pageMsgArr.push(data);
				curPageNum = searchFromPageJsonByAction(curPageEName);
				fn&&fn();
			});
		}
    });
}


/***********************************     数据重新解析    ***************************************/
function PageJson(OutJson){
    //当前页面是否为中间页
    this.isMiddle = false;
    //页面原始配置数据
    this.OutJson = OutJson;
    /**
     * 新版后台会在图片上传是将图片宽高拼接进图片地址中,因此能从图片地址(imgUrl)中获取图片宽
     * @param imgUrl
     * @returns {Number}
     */
    this.getImgWidth = function(imgUrl){
        if(imgUrl){
            var imgWidth = imgUrl.substring(imgUrl.lastIndexOf("_") + 1,imgUrl.lastIndexOf("+"));
        }else{
            var imgWidth = "0";
        }
        return parseInt(imgWidth);
    };
    /**
     * 从图片地址中获取图片高
     * @param imgUrl
     * @returns {Number}
     */
    this.getImgHeight= function(imgUrl){
        if(imgUrl){
            var imgHeight = imgUrl.substring(imgUrl.lastIndexOf("+") + 1,imgUrl.lastIndexOf("."));
        }else{
            var imgHeight = "0";
        }
        return parseInt(imgHeight);
    };
    /**
     * 获取字符串str中的name等于的值
     * @param name
     * @param str
     * @returns {null}
     */
    this.getTrimValue = function(name,str){
        str = str + "";
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = str.match(reg);
        if(r == null){
            reg = new RegExp("(^|＆)"+ name +"=([^＆]*)(＆|$)");
            r = str.match(reg);
        }
        if(r!=null)return  unescape(r[2]); return null;
    };
    /**
     * 获取当前页面的默认焦点
     * @returns {string}
     */
    this.getDefaultFocus = function(){
        var defaultFcocus = "";
        if(this.OutJson){
            if(this.OutJson.recommend_1){
                for(var i = 0; i < this.OutJson.recommend_1.length; i++){
                    if(this.OutJson.recommend_1[i].onfocus == "0"){
                        defaultFcocus = "hands_x0_y0_generalFocus"+ this.OutJson.recommend_1[i].id +"_"
                        break;
                    }
                }
            }
            if(this.OutJson.recommend_2) {
                for (var i = 0; i < this.OutJson.recommend_2.length; i++) {
                    if(this.OutJson.recommend_2[i].onfocus == "0"){
                        defaultFcocus = "hands_x0_y0_generalFocus"+ this.OutJson.recommend_2[i].id +"_"
                        break;
                    }
                }
            }
        }
        return defaultFcocus;
    };
    /**
     * 将正文推荐,退出推荐,其余推荐中的图片信息填入newOutJson.allMsg中
     * @param allMsg
     * @returns {updateMessage.newOutJson|{recommendMsg, outRecommendMsg, otherDetailMsg}}
     */
    this.updateMes = function(data,allMsg){
        if(data.recommend_1){
            allMsg.recommendMsg = this.getNumsRecMsg(data.recommend_1,["focusPic","focus","focusShowPic","focusHidePic"]);
        }
        if(data.recommend_2){
            allMsg.outRecommendMsg = this.getNumsRecMsg(data.recommend_2,["backPic","focus","backShowPic","backHidePic"]);
        }
        if(data.recommend_3){
            allMsg.otherDetailMsg = this.getNumsRecMsg(data.recommend_3,["otherPic","otherLabelPic","otherShowPic","otherHidePic"]);
        }
        return allMsg;
    };
    /**
     * 将推荐的图片详情数据转换成一个对象
     * 						{
     * 							url: (图片地址)
     * 							width: (图片宽度)
     * 							height: (图片高度)
     * 							xValue: (图片位于页面的top值)
     * 							yValue: (图片位于页面的left值)
     *	 					}
     * 将当前推荐的上下左右移动目标存入focusMoveEvent数组
     * 将后台管理系统内填入的各类图片的动画类型存入animationType数组
     *
     * @param recommendMsgType 推荐图片类型(recommendPic,recommendLabelpic,recommendShowPic,recommendHidePic)
     * @param morePic 当推荐图片类型多于1张时,多出的图片数据会以字符串的形式存放在morePic字段中
     * @param more1 推荐详情中的视频播放地址,用于填写数据指定动画类型
     * @returns {*}
     */
    this.getAddRecommendMsg = function(recommendMsgType,more1,animation){
        if(animation != "" && animation != null){
            var recPicAni = this.getTrimValue("recOneAni",animation) || this.getTrimValue("rec1Ani",animation);
            if(recPicAni){
                if(recPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[0] = parseInt(recPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[0] = parseInt(recPicAni.split("_")[0]);
            }
            var recLabelPicAni = this.getTrimValue("recTwoAni",more1) || this.getTrimValue("rec2Ani",animation);
            if(recLabelPicAni){
                if(recLabelPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[1] = parseInt(recLabelPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[1] = parseInt(recLabelPicAni.split("_")[0]);
            }
            var recShowPicAni = this.getTrimValue("recThreeAni",more1) || this.getTrimValue("rec3Ani",animation);
            if(recShowPicAni){
                if(recShowPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[2] = parseInt(recShowPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[2] = parseInt(recShowPicAni.split("_")[0]);
            }
            var recHidePicAni = this.getTrimValue("recFourAni",more1) || this.getTrimValue("rec4Ani",animation);
            if(recHidePicAni){
                if(recHidePicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[3] = parseInt(recHidePicAni.split("_")[1]);
                }
                recommendMsgType.animationType[3] = parseInt(recHidePicAni.split("_")[0]);
            }
        }
        if((more1+"").indexOf("video") != -1){
            recommendMsgType.videoType[0] = 0;
            recommendMsgType.videoType[1] = this.getTrimValue("w",more1) || 0;
            recommendMsgType.videoType[2] = this.getTrimValue("h",more1) || 0;
            recommendMsgType.videoType[3] = this.getTrimValue("t",more1) || 0;
            recommendMsgType.videoType[4] = this.getTrimValue("l",more1) || 0;
        }
        return recommendMsgType;
    };
    /**
     * 将joinMsg(推荐详情)中的图片数据提取出来转换成单个对象并填充数据:
     * 			newRec = {
     *              focusnum: "",焦点名称（配置人员配置，用做全国数据拉取埋点）小包
     *              recommendTrackName: "",焦点名称（配置人员配置，用做全国数据拉取埋点）频道
     * 		        videoType: [1,0,0,0,0,0],//视频播放信息[是否拥有视频(0=有),width,height,top,left,卡通ID]
     * 		        animationTimes: [0/1,0/1,0/1,0/1],动画执行次数,0: 无数次 1: 1次,2:已执行一次
     *           	animationType: [0,0,0,0,1],四类图片对应的动画类型.最后一位为是否已轮询，1为否，0为是
     *           	recommendId: joinMsg[i].recommendId,推荐id
     *              recommendDisplayValue: "",//当前推荐的内容ID
     *           	focusMoveEvent: [],焦点移动的上下左右焦点推荐id
     *           	recommendPic: [],未选中推荐图
     *          	recommendLabelpic: [],选中推荐图
     *           	recommendShowPic: [],选中显示推荐图
     *           	recommendHidePic: [], 选中隐藏推荐图
     *              recommendMorePic: [] 后续新增推荐图
     *       	};
     * @param joinMsg
     * @returns {Array}
     */
    this.getNumsRecMsg = function(joinMsg,domNameArr){
        var newRec = {};
        var resultMsg = [];
        var picType = null;
        var picMsg = {};
        for(var i = 0; i < joinMsg.length; i++){
            newRec = {
                focusnum: joinMsg[i].focusnum || "0",
                recommendTrackName: joinMsg[i].recommendTrackName || "0",
                videoType: [1,0,0,0,0,0],
                animationTimes: [0,0,0,0],
                animationType: [0,0,0,0],
                recommendId: joinMsg[i].id,
				recommendDisplayValue: joinMsg[i].recommendDisplayValue,
                focusMoveEvent: [joinMsg[i].movetop||0,joinMsg[i].movedown||0,joinMsg[i].moveleft||0,joinMsg[i].moveright||0,1],
                recommendPic: [],
                recommendLabelpic: [],
                recommendShowPic: [],
                recommendHidePic: [],
                recommendMorePic: []
            };
            if(joinMsg[i].more1 && (joinMsg[i].more1+"").indexOf("video") > -1){
                newRec.videoType[5] = joinMsg[i].recommendDisplayValue;
            }
            for(var z = 0; z < joinMsg[i].pageRecommendConfigTabVos.length;z++){
                picType = joinMsg[i].pageRecommendConfigTabVos[z].picType;
                picMsg = {
                    divId: "",
                    imgId: "",
                    url: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picPath,
                    height: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picH,
                    width: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picW,
                    xValue: joinMsg[i].pageRecommendConfigTabVos[z].xvalue,
                    yValue: joinMsg[i].pageRecommendConfigTabVos[z].yvalue,
                    zIndex: 0
                };
                if(joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab && joinMsg[i].recommendDisplayType != 88){
                    switch (picType){
                        case 0:
                        case "0":
                            picMsg.divId = domNameArr[0] == "focus"?("hands_x0_y0_generalFocus"+newRec.recommendId+"_"):(domNameArr[0]+newRec.recommendId);
                            picMsg.imgId = domNameArr[0] == "focus"?("generalFocus"+newRec.recommendId):(domNameArr[0]+newRec.recommendId);
                            newRec.recommendPic.push(picMsg);
                            if(joinMsg[i].more1 && (joinMsg[i].more1+"").indexOf("zIndex") > -1){
                                picMsg.zIndex = parseInt((this.getTrimValue("zIndex",joinMsg[i].more1)+"").split("_")[0]) || 0;
                            }
                            break;
                        case 1:
                        case "1":
                            picMsg.divId = domNameArr[1] == "focus"?("hands_x0_y0_generalFocus"+newRec.recommendId+"_"):(domNameArr[1]+newRec.recommendId);
                            picMsg.imgId = domNameArr[1] == "focus"?("generalFocus"+newRec.recommendId):(domNameArr[1]+newRec.recommendId);
                            newRec.recommendLabelpic.push(picMsg);
                            if(joinMsg[i].more1 && (joinMsg[i].more1+"").indexOf("zIndex") > -1){
                                picMsg.zIndex = parseInt((this.getTrimValue("zIndex",joinMsg[i].more1)+"").split("_")[1]) || 0;
                            }
                            break;
                        case 2:
                        case "2":
                            picMsg.divId = domNameArr[2] == "focus"?("hands_x0_y0_generalFocus"+newRec.recommendId+"_"):(domNameArr[2]+newRec.recommendId);
                            picMsg.imgId = domNameArr[2] == "focus"?("generalFocus"+newRec.recommendId):(domNameArr[2]+newRec.recommendId);
                            newRec.recommendShowPic.push(picMsg);
                            if(joinMsg[i].more1 && (joinMsg[i].more1+"").indexOf("zIndex") > -1){
                                picMsg.zIndex = parseInt((this.getTrimValue("zIndex",joinMsg[i].more1)+"").split("_")[2]) || 0;
                            }
                            break;
                        case 3:
                        case "3":
                            picMsg.divId = domNameArr[3] == "focus"?("hands_x0_y0_generalFocus"+newRec.recommendId+"_"):(domNameArr[3]+newRec.recommendId);
                            picMsg.imgId = domNameArr[3] == "focus"?("generalFocus"+newRec.recommendId):(domNameArr[3]+newRec.recommendId);
                            newRec.recommendHidePic.push(picMsg);
                            if(joinMsg[i].more1 && (joinMsg[i].more1+"").indexOf("zIndex") > -1){
                                picMsg.zIndex = parseInt((this.getTrimValue("zIndex",joinMsg[i].more1)+"").split("_")[3]) || 0;
                            }
                            break;
                        default:
                            if(newRec.recommendMorePic.length <= 0 && !newRec.recommendMorePic[parseInt(picType)]){
                                for(var pt = 0; pt < parseInt(picType)+1; pt++){
                                    if(!newRec.recommendMorePic[pt]){
                                        newRec.recommendMorePic.push([]);
                                    }
                                }
                                newRec.recommendMorePic[parseInt(picType)].push(picMsg);
                            }else{
                                newRec.recommendMorePic[parseInt(picType)].push(picMsg);
                            }
                            break;
                    }
                }
            }
            newRec = this.getAddRecommendMsg(newRec,joinMsg[i].more1,joinMsg[i].animation);
            resultMsg.push(newRec);
		}
        return resultMsg;
    };
    this.reSetMessage = function(data){
        //所有推荐数据
        var newOutJson = {
            //页面英文名
            "actionName": data.pageInfo.commPageEname,
            //默认焦点
            "defaultFocus": "",
            //页面名称等内容,对应通用页面设置,模板设置与模板库设置
            "pageInfo": {},
            /*
            *所有推荐图片信息(数据类型为对象)
            * allMsg对象包含下列值
            *       recommendMsg(正文推荐,数据类型为数组)
            *       outRecommendMsg(退出推荐,数据类型为数组)
            *       otherDetailMsg(其余推荐,数据类型为数组)
            *       moveUpMsg(页面移动方向推荐，数据类型为数组)
            *       moveDownMsg(页面移动方向推荐，数据类型为数组)
            *           上列推荐类型信息数组中,每个值均为对象,包含下列值
            *               recommendId: 推荐ID(recommendId)后期生成的DOM元素ID与此类数据有关
            *               animationType: 动画类型 长度为四的数组,数组中的每个值对应一类推荐图片的动画类型,0为无动画
            *               focusMoveEvent:光标移动目标,长度为四的数组,四个值分别为上下左右移动目标,值为recommendId
            *               recommendHidePic: 焦点选中隐藏图片,数据类型为数组,保存后台配置的同一类图片(消失图片)信息
            *               recommendLabelpic: 焦点选中图片,数据类型为数组,保存后台配置的同一类图片(标签图片)信息
            *               recommendPic: 焦点详情图片,数据类型为数组,保存后台配置的同一类图片(推荐图片)信息
            *               recommendShowPic: 焦点选中显示图片,数据类型为数组,保存后台配置的同一类图片(显示图片)信息
            *
            *                   上列四类数据类型为数组的推荐图片数据(recommendHidePic,recommendLabelpic,recommendPic,recommendShowPic)中,
            *                   每个值均为对象,包含下列值
            *                       divId: 根据推荐图第一张图片信息生成的DIV元素,仅在数组中的第一个值中存在
            *                       imgId: 根据推荐图第一张图片信息生成的img元素,仅在数组中的第一个值中存在
            *                       url: 图片地址
            *                       width: 图片宽度,从图片地址中获取(后台上传图片时会获取上传图片的宽与高,并将此信息拼入图片文件名中
            *                       height: 图片高度
            *                       xValue: left值
            *                       yValue: top值
            */
            "allMsg": {
                "recommendMsg":[],
                "outRecommendMsg": [],
                "otherDetailMsg": [],
                "moveUpMsg": [],
                "moveDownMsg": []
            }
        };
        newOutJson.pageInfo = data.pageInfo;
        newOutJson.defaultFocus = this.getDefaultFocus();
        newOutJson.allMsg = this.updateMes(data,newOutJson.allMsg);
        return newOutJson;
    };
    //页面原始数据重编之后的数据
    this.newOutJson = this.reSetMessage(this.OutJson);
}
