/***********************************     数据重新解析    ***************************************/
var updateMessage = {
	newOutJson: {
        "recommendMsg":[],
        "outRecommendMsg": [],
        "otherDetailMsg": []
    },
    /**
	 * 新版后台会在图片上传是将图片宽高拼接进图片地址中,因此能从图片地址(imgUrl)中获取图片宽
     * @param imgUrl
     * @returns {Number}
     */
	getImgWidth: function(imgUrl){
		if(imgUrl){
			var imgWidth = imgUrl.substring(imgUrl.lastIndexOf("_") + 1,imgUrl.lastIndexOf("+"));
		}else{
			var imgWidth = "0";
		}
		return parseInt(imgWidth);
	},
    /**
	 * 从图片地址中获取图片高
     * @param imgUrl
     * @returns {Number}
     */
	getImgHeight: function(imgUrl){
		if(imgUrl){
			var imgHeight = imgUrl.substring(imgUrl.lastIndexOf("+") + 1,imgUrl.lastIndexOf("."));
		}else{
			var imgHeight = "0";
		}
		return parseInt(imgHeight);
	},
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
	getNumsRecMsg: function(joinMsg){
		var newRec = {};
		var resultMsg = [];
		for(var i = 0; i < joinMsg.length; i++){
            newRec = {
                animationTimes: [0,0,0,0],
                animationType: [0,0,0,0],
                recommendId: joinMsg[i].id,
				recommendDisplayValue: joinMsg[i].recommendDisplayValue,
                focusMoveEvent: [],
                recommendPic: [],
                recommendLabelpic: [],
                recommendShowPic: [],
                recommendHidePic: [],
                recommendMorePic: []
            };
            for(var z = 0; z < joinMsg[i].pageRecommendConfigTabVos.length;z++){
                if(joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab){
					
                    var picType = joinMsg[i].pageRecommendConfigTabVos[z].picType;
                    var picMsg = {
                        divId: "",
                        imgId: "",
                        url: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picPath,
                        height: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picH,
                        width: joinMsg[i].pageRecommendConfigTabVos[z].picLibraryTab.picW,
                        xValue: joinMsg[i].pageRecommendConfigTabVos[z].xValue,
                        yValue: joinMsg[i].pageRecommendConfigTabVos[z].yValue
                    };
                    switch (picType){
                        case 0:
                        case "0":
                            newRec.recommendPic.push(picMsg);
                            break;
                        case 1:
                        case "1":
                            newRec.recommendLabelpic.push(picMsg);
                            break;
                        case 2:
                        case "2":
                            newRec.recommendShowPic.push(picMsg);
                            break;
                        case 3:
                        case "3":
                            newRec.recommendHidePic.push(picMsg);
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
            resultMsg.push(newRec);
		}
		return resultMsg;
	},
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
	getAddRecommendMsg: function(recommendMsgType,morePic,more1){
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
        }
		return recommendMsgType;
	},
    /**
	 * 获取字符串str中的name等于的值
     * @param name
     * @param str
     * @returns {null}
     */
	getTrimValue: function(name,str){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = str.match(reg);
        if(r == null){
            reg = new RegExp("(^|＆)"+ name +"=([^＆]*)(＆|$)");
            r = str.match(reg);
        }
        if(r!=null)return  unescape(r[2]); return null;
	},
    /**
	 * 将正文推荐,退出推荐,其余推荐中的图片信息填入newOutJson.allMsg中
     * @param allMsg
     * @returns {updateMessage.newOutJson|{recommendMsg, outRecommendMsg, otherDetailMsg}}
     */
	updateMes: function(allMsg){
		var recommend1 = null;
		if(allMsg["recommend_1"]){
			//this.newOutJson.recommendMsg = this.getNumsRecMsg(allMsg["recommend_1"]);
			recommend1 = this.getNumsRecMsg(allMsg["recommend_1"]);
            for(var i=0;i<recommend1.length;i++){
				 this.newOutJson.recommendMsg[i] = recommend1[i];
			}
		}
		if(allMsg["recommend_2"]){
			this.newOutJson.outRecommendMsg = this.getNumsRecMsg(allMsg["recommend_2"]);
		}
		if(allMsg["recommend_3"]){
			this.newOutJson.otherDetailMsg = this.getNumsRecMsg(allMsg["recommend_3"]);
		}
		return this.newOutJson;
	}
};