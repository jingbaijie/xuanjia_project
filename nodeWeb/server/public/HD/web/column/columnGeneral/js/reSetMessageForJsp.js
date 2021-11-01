/***********************************     获取上中下页数据内容    ***************************************/
/*
	*
	*从眉头获取专题action用以区分专题内容
	*
	*/
function getGeneralAction(){
    var reg = new RegExp("(^|&)action=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null){
        return  unescape(r[2]);
    }else{
        return null;
    }
}
//页面数组，存储重新解析后的各页面数据newOutJson
var pageJsonArr = [];
//页面原始数组OutJson
var pageMsgArr = [];
//当前页面信息在数组中的下标
var curPageNum = 0;
//切换前的上一级页面
var prePageNum = 0;
//从眉头获取当前页面信息
var curPageEName = CT.getCookie("columnBackAction") || OutJson[0].pageInfo.pageTemplateEname;
CT.delCookie("columnBackAction");

/**
 * 根据页面英文名获取其在pageMsgArr中的数组下标
 * @param newAction 页面英文名
 * @returns {string|boolean} 当前数据对应位于数组中的下标，为字符串类型
 */
function searchFromPageJaonByAction(newAction){
    for(var i = 0; i < pageMsgArr.length; i++){
        if(pageMsgArr[i][0].pageInfo.commPageEname == newAction){
            return i+"";
        }
    }
    return false;
}

/**
 * 根据页面commPageId获取其在pageMsgArr中的数组下标
 * @param newId 页面commPageId
 * @returns {string|boolean} 当前数据对应位于数组中的下标，为字符串类型
 */
function searchFromPageJaonById(newId){
    for(var i = 0; i < pageMsgArr.length; i++){
        if(pageMsgArr[i][0].pageInfo.commPageId == newId){
            return i+"";
        }
    }
    return false;
}

/**
 * 生成当前三屏数据
 */
function allForStart(actionName){
    if(actionName){
        curPageEName = actionName;
    }
    var isAlive = searchFromPageJaonByAction(curPageEName);
    curPageNum = isAlive;
    if(curPageNum){
        if(pageMsgArr[curPageNum] && pageMsgArr[curPageNum][4] && pageMsgArr[curPageNum][4]["recommend_4"].length > 0 && pageMsgArr[curPageNum][4]["recommend_4"] && pageMsgArr[curPageNum][4]["recommend_4"][0].recommendDisplayType == "4" && pageMsgArr[curPageNum][4]["recommend_4"][0].commpageId > 0){
            if(searchFromPageJaonById(pageMsgArr[curPageNum][4]["recommend_4"][0].commpageId)){
                if(pageMsgArr[curPageNum] && pageMsgArr[curPageNum][5] && pageMsgArr[curPageNum][5]["recommend_5"].length > 0  && pageMsgArr[curPageNum][5]["recommend_5"] && pageMsgArr[curPageNum][5]["recommend_5"][0].recommendDisplayType == "4" && pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId > 0){
                    if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                        column.init();
                    }else{
                        getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId,function(){
                            column.init();
                        });
                    }
                }else{
                    column.init();
                }
            }else{
                getPrePageMsgById(pageMsgArr[curPageNum][4]["recommend_4"][0].commpageId,function(){
                    if(pageMsgArr[curPageNum] && pageMsgArr[curPageNum][5] && pageMsgArr[curPageNum][5]["recommend_5"].length > 0  && pageMsgArr[curPageNum][5]["recommend_5"] && pageMsgArr[curPageNum][5]["recommend_5"][0].recommendDisplayType == "4" && pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId > 0){
                        if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                            column.init();
                        }else{
                            getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId,function(){
                                column.init();
                            });
                        }
                    }else{
                        column.init();
                    }
                })
            }
        }else{
            if(pageMsgArr[curPageNum] && pageMsgArr[curPageNum][5] && pageMsgArr[curPageNum][5]["recommend_5"].length > 0  && pageMsgArr[curPageNum][5]["recommend_5"] && pageMsgArr[curPageNum][5]["recommend_5"][0].recommendDisplayType == "4" && pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId > 0){
                if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                    column.init();
                }else{
                    getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId);
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
    ajax.init({
        url: localUrl + 'xjcartoon_UnifyInterface/SynthesizeInterface/recommandCommPage',
        method:'get',
        params:{
            'commPageEname':newOutJson.actionName
        },
        async:false,
        ContentType:'json',
        success:function(data){
            if(data){
                if(fn && typeof fn == "function"){
                    fn(data);
                }else{
                    var newOutJson  = new PageJson(data).newOutJson;
                    pageMsgArr.push(data);
                    pageJsonArr.push(newOutJson);
                    if(data[4] && data[4]["recommend_4"].length > 0 && data[4]["recommend_4"][0].recommendDisplayType == "4" && data[4]["recommend_4"][0].commpageId > 0){
                        if(searchFromPageJaonById(pageMsgArr[curPageNum][4]["recommend_4"][0].commpageId)){
                            if(data[5] && data[5]["recommend_5"].length > 0 && data[5]["recommend_5"][0].recommendDisplayType == "4" && data[5]["recommend_5"][0].commpageId > 0){
                                if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                                    column.init();
                                }else{
                                    getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId,function(){
                                        column.init();
                                    });
                                }
                            }else{
                                column.init();
                            }
                        }else{
                            getPrePageMsgById(pageMsgArr[curPageNum][4]["recommend_4"][0].commpageId,function(){
                                if(data[5] && data[5]["recommend_5"].length > 0 && data[5]["recommend_5"][0].recommendDisplayType == "4" && data[5]["recommend_5"][0].commpageId > 0){
                                    if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                                        column.init();
                                    }else{
                                        getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId,function(){
                                            column.init();
                                        });
                                    }
                                }else{
                                    column.init();
                                }
                            });
                        }
                    }else{
                        if(data[5] && data[5]["recommend_5"].length > 0 && data[5]["recommend_5"][0].recommendDisplayType == "4" && data[5]["recommend_5"][0].commpageId > 0){
                            if(searchFromPageJaonById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId)){
                                column.init();
                            }else{
                                getNextPageMsgById(pageMsgArr[curPageNum][5]["recommend_5"][0].commpageId,function(){
                                    column.init();
                                });
                            }
                        }else{
                            column.init();
                        }
                    }
                }
            }
        },
        fail:function(status){
            return;
        }
    });
}

/**
 * 根据commPageId获取当前页面的上一级页面信息，主要获取页面英文名
 * @param commPageId    页面commPageId
 */
function getPrePageMsgById(commPageId,fn){
    ajax.init({
        url:localUrl + 'xjcartoon_UnifyInterface/SynthesizeInterface/recommandCommPage',
        method:"get",
        params:{"commPageId":commPageId},
        async:false,
        ContentType:"json",
        success:function(data){
            if(data){
                getPageMsgByAction(data[0].pageInfo.commPageEname,function(data){
                    var newOutJson = new PageJson(data).newOutJson;
                    pageJsonArr.splice(parseInt(curPageNum),0,newOutJson);
                    pageMsgArr.splice(parseInt(curPageNum),0,data);
                    curPageNum = searchFromPageJaonByAction(curPageEName);
                    fn&&fn();
                });
            }
        },
        fail:function(status){
            return;
        }
    });
}
/**
 * 根据commPageId获取当前页面的下一级页面信息，主要获取页面英文名
 * @param commPageId    页面commPageId
 */
function getNextPageMsgById(commPageId,fn){
    ajax.init({
        url:localUrl + 'xjcartoon_UnifyInterface/SynthesizeInterface/recommandCommPage',
        method:"get",
        params:{"commPageId":commPageId},
        async:false,
        ContentType:"json",
        success:function(data){
            if(data){
                getPageMsgByAction(data[0].pageInfo.commPageEname,function(data){
                    var newOutJson = new PageJson(data).newOutJson;
                    pageJsonArr.push(newOutJson);
                    pageMsgArr.push(data);
                    curPageNum = searchFromPageJaonByAction(curPageEName);
                    fn&&fn();
                });
            }
        },
        fail:function(status){
            return;
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
     * 将正文推荐,退出推荐,其余推荐中的图片信息填入newOutJson.allMsg中
     * @param allMsg
     * @returns {updateMessage.newOutJson|{recommendMsg, outRecommendMsg, otherDetailMsg}}
     */
    this.updateMes = function(data,allMsg){
        if(data[1]){
            allMsg.recommendMsg = this.getNumsRecMsg(data[1].recommend_1);
        }
        if(data[2]){
            allMsg.outRecommendMsg = this.getNumsRecMsg(data[2].recommend_2);
        }
        if(data[3]){
            allMsg.otherDetailMsg = this.getNumsRecMsg(data[3].recommend_3);
        }
        return allMsg;
    };
    /**
     * 将joinMsg(推荐详情)中的图片数据提取出来转换成单个对象并填充数据:
     * 			newRec = {
     * 		        animationTimes: [0/1,0/1,0/1,0/1],动画执行次数,0: 无数次 1: 1次,2:已执行一次
     *           	animationType: [0,0,0,0],四类图片对应的动画类型
     *           	recommendId: joinMsg[i].recommendId,推荐id
     *           	focusMoveEvent: [],焦点移动的上下左右焦点推荐id
     *           	recommendPic: [],未选中推荐图
     *          	recommendLabelpic: [],选中推荐图
     *           	recommendShowPic: [],选中显示推荐图
     *           	recommendHidePic: [] 选中隐藏推荐图
     *       	};
     * @param joinMsg
     * @returns {Array}
     */
    this.getNumsRecMsg = function(joinMsg){
        var newRec = {};
        var resultMsg = [];
        for(var i = 0; i < joinMsg.length; i++){
            newRec = {
                videoType: [1,0,0,0,0,0],
                animationTimes: [0,0,0,0],
                animationType: [0,0,0,0],
                recommendId: joinMsg[i].recommendId,
                focusMoveEvent: [],
                recommendPic: [],
                recommendLabelpic: [],
                recommendShowPic: [],
                recommendHidePic: []
            };
            if(joinMsg[i].recommendPic && joinMsg[i].recommendPic.url != null){
                joinMsg[i].recommendPic.width = this.getImgWidth(joinMsg[i].recommendPic.url);
                joinMsg[i].recommendPic.height = this.getImgHeight(joinMsg[i].recommendPic.url);
                newRec.recommendPic.push(joinMsg[i].recommendPic);
            }
            if(joinMsg[i].recommendLabelpic && joinMsg[i].recommendLabelpic.url != null){
                joinMsg[i].recommendLabelpic.width = this.getImgWidth(joinMsg[i].recommendLabelpic.url);
                joinMsg[i].recommendLabelpic.height = this.getImgHeight(joinMsg[i].recommendLabelpic.url);
                joinMsg[i].recommendLabelpic.zIndex = this.getTrimValue("zIndex",(joinMsg[i].more1 + "")) || 2;
                newRec.recommendLabelpic.push(joinMsg[i].recommendLabelpic);
            }
            newRec.videoType[5] = joinMsg[i].cartoonId;
            newRec = this.getAddRecommendMsg(newRec,joinMsg[i].morePic,joinMsg[i].more1);
            resultMsg.push(newRec);
        }
        return resultMsg;
    };
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
    this.getAddRecommendMsg = function(recommendMsgType,morePic,more1){
        var morePic = eval("(" + morePic + ")");
        var addRec = {};
        if(morePic){
            recommendMsgType.focusMoveEvent[0] = morePic.coordinate.top;
            recommendMsgType.focusMoveEvent[1] = morePic.coordinate.bottom;
            recommendMsgType.focusMoveEvent[2] = morePic.coordinate.left;
            recommendMsgType.focusMoveEvent[3] = morePic.coordinate.right;
            if(morePic.pics.length > 0){
                for(var i = 0; i < morePic.pics.length; i ++){
                    addRec = {};
                    addRec.url = morePic.pics[i].url;
                    addRec.width = this.getImgWidth(addRec.url);
                    addRec.height = this.getImgHeight(addRec.url);
                    addRec.xValue = morePic.pics[i].x;
                    addRec.yValue = morePic.pics[i].y;
                    switch(morePic.pics[i].type){
                        case "1":
                        case 1:
                            recommendMsgType.recommendPic.push(addRec);
                            break;
                        case "2":
                        case 2:
                            recommendMsgType.recommendLabelpic.push(addRec);
                            break;
                        case "3":
                        case 3:
                            recommendMsgType.recommendShowPic.push(addRec);
                            break;
                        case "4":
                        case 4:
                            recommendMsgType.recommendHidePic.push(addRec);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        if(more1 != "" && more1 != null){
            var recPicAni = this.getTrimValue("recOneAni",more1) || this.getTrimValue("rec1Ani",more1);
            if(recPicAni){
                if(recPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[0] = parseInt(recPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[0] = parseInt(recPicAni.split("_")[0]);
            }
            var recLabelPicAni = this.getTrimValue("recTwoAni",more1) || this.getTrimValue("rec2Ani",more1);
            if(recLabelPicAni){
                if(recLabelPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[1] = parseInt(recLabelPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[1] = parseInt(recLabelPicAni.split("_")[0]);
            }
            var recShowPicAni = this.getTrimValue("recThreeAni",more1) || this.getTrimValue("rec3Ani",more1);
            if(recShowPicAni){
                if(recShowPicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[2] = parseInt(recShowPicAni.split("_")[1]);
                }
                recommendMsgType.animationType[2] = parseInt(recShowPicAni.split("_")[0]);
            }
            var recHidePicAni = this.getTrimValue("recFourAni",more1) || this.getTrimValue("rec4Ani",more1);
            if(recHidePicAni){
                if(recHidePicAni.indexOf("_") != -1){
                    recommendMsgType.animationTimes[3] = parseInt(recHidePicAni.split("_")[1]);
                }
                recommendMsgType.animationType[3] = parseInt(recHidePicAni.split("_")[0]);
            }
            if(more1.indexOf("video") != -1){
                recommendMsgType.videoType[0] = 0;
                recommendMsgType.videoType[1] = this.getTrimValue("w",more1) || 0;
                recommendMsgType.videoType[2] = this.getTrimValue("h",more1) || 0;
                recommendMsgType.videoType[3] = this.getTrimValue("t",more1) || 0;
                recommendMsgType.videoType[4] = this.getTrimValue("l",more1) || 0;
            }
        }
        return recommendMsgType;
    };
    /**
     * 获取字符串str中的name等于的值
     * @param name
     * @param str
     * @returns {null}
     */
    this.getTrimValue = function(name,str){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = str.match(reg);
        if(r == null){
            reg = new RegExp("(^|＆)"+ name +"=([^＆]*)(＆|$)");
            r = str.match(reg);
        }
        if(r!=null)return  unescape(r[2]); return null;
    };
    this.reSetMessage = function(data){
        //所有推荐数据
        var newOutJson = {
            //页面英文名
            "actionName": data[0].pageInfo.commPageEname,
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
        newOutJson.pageInfo = data[0].pageInfo;
        newOutJson.allMsg = this.updateMes(data,newOutJson.allMsg);
        return newOutJson;
    };
    //页面原始数据重编之后的数据
    this.newOutJson = this.reSetMessage(this.OutJson);
}
