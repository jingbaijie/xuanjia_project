<%@ page contentType="text/html;charset=utf-8"%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
	<link rel = "stylesheet" href = "./HD/column/columnGeneral/css/general.css">
    <link rel = "stylesheet" href = "./HD/column/columnGeneral/css/animation.css">
    <meta name="page-view-size" content="1280*720"  />
    <title>通用专题</title>
</head>
<body>
    <div class = "main" id = "mainContent">
        <div id = "recommendPicContent" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;">

        </div>
        <div id = "recommendShowPicContent" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;">

        </div>
        <div id = "recommendHidePicContent" style = "width: 1280px;height: 720px;position: absolute;top: 0;left: 0;">

        </div>
        <div id = "focusContent" style = "width: 1280px;height: 720px;position: absolute; top: 0;left: 0;">

        </div>
    </div>
</body>
<!--
<script type = "text/javascript" src = "./HD/js/comm.js"></script>
<script type = "text/javascript" src = "./HD/js/common1_1.js"></script>
<script type = "text/javascript" src = "./HD/js/key1_3.js"></script>
<script type = "text/javascript" src = "./HD/js/ajax.js"></script>
<script type = "text/javascript" src = "./HD/js/logger.js"></script>
-->
<script type = "text/javascript" src = "./HD/js/loadCommomJs.js"></script>
<!--
<script type = "text/javascript" src = "./HD/js/gzgd.config.js"></script>
-->
<script type = "text/javascript" src = "./HD/column/columnGeneral/js/reSetMessage.js?v=2019"></script>
<script type = "text/javascript" src = "./HD/column/columnGeneral/js/general.js?v=2019"></script>
<script>
	//所有推荐数据
    var newOutJson = {
		//页面英文名
		"actionName": "",
		//页面名称等内容,对应通用页面设置,模板设置与模板库设置
		"pageInfo": {},
		/*
		*所有推荐图片信息(数据类型为对象)
		* allMsg对象包含下列值
		*       recommendMsg(正文推荐,数据类型为数组)
		*       outRecommendMsg(退出推荐,数据类型为数组)
		*       otherDetailMsg(其余推荐,数据类型为数组)
		*
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
		"allMsg": {}
	};
	//页面原始数据信息
	var OutJson = ${injson.outJson};
	var imgUrl = "${injson.IMG_BJ_INTERFACE_ADRESS}";
	var isOrder = "${result}";
	var isOrderUrl = "page.action?action=orderPage&userId=${injson.userId}";
    //图片地址
    var columnImgUrl = imgUrl;
    //焦点名称
    var columnGeneralFocusName = "generalFocus";
    //column对象,包含创建Dom元素与专题跳转等基本功能(general.js)
    var column = new GeneralColumn();
    //动画对象,包含添加动画,创建动画等(general.js)
    var columnAni = new ColumnAnimation();
    //所有焦点信息
    var buttons = [];
	//存放所有推荐详情(recommendPic)DOM
	var recommendPicContent = document.getElementById("recommendPicContent");
	//存放所有焦点(recommendLabelPic)详情DOM
	var focusContent = document.getElementById("focusContent");
    //存放显示图片详情(recommendShowPic),对应推荐详情中的第三类图片推荐
    var recommendShowPicContent = document.getElementById("recommendShowPicContent");
    //存放显示图片详情(recommendHidePic),对应推荐详情中的第四类图片推荐
    var recommendHidePicContent = document.getElementById("recommendHidePicContent");
	/*
	*
	*从眉头获取专题action用以区分专题内容
	*
	*/
	function getGeneralAction(){
		var reg = new RegExp("(^|&)contentEName=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r!=null){
			return  unescape(r[2]);
		}else{
			return null;
		}
	}
	/*
	*
	* ajax请求专题配置内容,有内容进行页面渲染,无内容跳转首页
	*
	*/
    function getAllMessage(){
		newOutJson.actionName = OutJson[0].pageInfo.commPageEname;
		if(newOutJson.actionName != "" && newOutJson.actionName != null){
			ajax.init({
				//url:"http://10.69.32.117:8391/xjcartoon_BtopInterface/SynthesizeInterface/recommandCommPage",
				url:AjaxConfig.interfaceUrl +'findRecCommonPageInfo',
				method:'get',
				params:{
					'commPageEname':newOutJson.actionName
				},
				async:false,
				ContentType:'json',
				success:function(data){
					//CT.writeInfo(data);
					OutJson = data;
					reSetMessage(data);
				},
				fail:function(status){
					//CT.writeInfo("获取数据失败！")
				}
			});
		}else{
			backFunc();
		}
	}
	getAllMessage();
	/*
	*
	* 重置数据,所有数据(除跳转内容)都在newOutJson中,设置标题,设置背景
	*
	*/
	function reSetMessage(data){
		document.title = data[0].pageInfo.commPageCname + "---通用专题" ;
        document.getElementById("mainContent").style.background = "url('"+ columnImgUrl + data[0].pageInfo.pageTemplateBgpic +"')";
        newOutJson.pageInfo = data[0].pageInfo;
		newOutJson.allMsg = updateMessage.updateMes(data);
		addRecAndDetailDom();
	}
    /*
    * 根据newOutJson中的推荐信息渲染页面,所有单个数据均是div包裹img形式
    * */
    function addRecAndDetailDom(){
        //选中焦点元素
	    var focusHtml = column.createFocus(columnImgUrl,newOutJson.allMsg.recommendMsg,columnGeneralFocusName,"goSomeWhere");
	    //未选中元素
	    var focusRecPicHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendPic","focusPic","visible");
	    //焦点选中显示详情图元素
	    var focusRecShowPicHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendShowPic","focusShowPic","hidden");
	    //焦点隐藏详情图
	    var focusRecHidePicHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.recommendMsg,"recommendHidePic","focusHidePic","visible");
	    //返回焦点元素
	    var backHtml = column.createBackFocus(columnImgUrl,newOutJson.allMsg.outRecommendMsg,columnGeneralFocusName,"backFunc");
	    //返回未选中元素
	    var backRecPicHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendPic","backPic","visible");
	    //返回选中显示详情图元素
	    var backRecShowPicHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendShowPic","backShowPic","hidden");
	    //返回隐藏详情图元素
	    var backRecShowHideHtml = column.createDetail(columnImgUrl,newOutJson.allMsg.outRecommendMsg,"recommendHidePic","backHidePic","hidden");
        //以下其余推荐图,均做动画或静态图显示
	    var otherRecPic = column.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendPic","otherPic","visible");
	    var otherRecLabelPic = column.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendLabelpic","otherLabelPic","visible");
        var otherRecShowPic = column.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendShowPic","otherShowPic","visible");
        var otherRecHidePic = column.createDetail(columnImgUrl,newOutJson.allMsg.otherDetailMsg,"recommendHidePic","otherHidePic","visible");

        focusContent.innerHTML = focusHtml + backHtml;
        recommendPicContent.innerHTML = focusRecPicHtml + backRecPicHtml + otherRecPic;
        recommendShowPicContent.innerHTML = otherRecLabelPic + focusRecShowPicHtml + backRecShowPicHtml + otherRecShowPic;
        recommendHidePicContent.innerHTML = focusRecHidePicHtml + backRecShowHideHtml + otherRecHidePic;

        //焦点初始化
	    focusInit();
	    if(curFocus){
	        curFocus.defaultBlur();
        }
        var generalBackFocus = CT.getCookie("generalBackFocus") + "";
	    if(generalBackFocus != "" && generalBackFocus != "null" && generalBackFocus != "undefined" && document.getElementById(generalBackFocus)){
            curFocus = getFocusModel6(generalBackFocus);
        }else{
            curFocus = getFocusModel6(buttons[0].id);
        }
	    curFocus.defaultFocus();
	    getAnimation();
	}
	/*
	* 页面加载完成后,初始化多帧动画,并且开启定时器(columnAni.startInterval)切换图片
	* */
    function getAnimation(){
        if(newOutJson.allMsg.recommendMsg.length > 0){
            columnAni.getAniType(newOutJson.allMsg.recommendMsg);
        }
        if(newOutJson.allMsg.outRecommendMsg.length > 0){
            columnAni.getAniType(newOutJson.allMsg.outRecommendMsg);
        }
        /*if(newOutJson.allMsg.otherDetailMsg.length > 0){
            columnAni.getCSSType(newOutJson.allMsg.otherDetailMsg);
        }*/
        columnAni.startInterval(columnImgUrl,newOutJson.allMsg);
    }
    /*
    * 获取焦点时(除返回焦点),显示焦点选中显示详情图,设置当前焦点与详情图的动画类型并执行(columnAni.setCSSFocusType)
    * */
    function getFocusNow(ii){
        if(newOutJson.allMsg.recommendMsg.length > 0 && newOutJson.allMsg.recommendMsg[ii].recommendLabelpic.length > 0){
            if(newOutJson.allMsg.recommendMsg[ii].recommendPic.length > 0){
				var recDivId = newOutJson.allMsg.recommendMsg[ii].recommendPic[0].divId;
                var recDivDom = document.getElementById(recDivId);
                if(recDivDom){
                    recDivDom.style.visibility = "hidden";
                }
			}
			if(newOutJson.allMsg.recommendMsg[ii].recommendShowPic.length > 0){
				openAniFlag(newOutJson.allMsg.recommendMsg[ii]);
                var divId = newOutJson.allMsg.recommendMsg[ii].recommendShowPic[0].divId;
                var divDom = document.getElementById(divId);
                if(divDom){
                    divDom.style.visibility = "visible";
                }

            }
            if(newOutJson.allMsg.recommendMsg[ii].recommendHidePic.length > 0){
                var secDivId = newOutJson.allMsg.recommendMsg[ii].recommendHidePic[0].divId;
                var secDivDom = document.getElementById(secDivId);
                if(secDivDom){
                    secDivDom.style.visibility = "visible";
                }

            }
            //columnAni.setCSSFocusType(newOutJson.allMsg.recommendMsg[ii]);
        }
    }
    /*
    * 失去焦点时(除返回焦点),显示焦点选中显示详情图,设置当前焦点与详情图的动画类型并执行(columnAni.setCSSFocusType)
    * */
    function loseFocusNow(ii){
        if(newOutJson.allMsg.recommendMsg.length > 0 && newOutJson.allMsg.recommendMsg[ii].recommendLabelpic.length > 0){
            if(newOutJson.allMsg.recommendMsg[ii].recommendPic.length > 0){
				var recDivId = newOutJson.allMsg.recommendMsg[ii].recommendPic[0].divId;
                var recDivDom = document.getElementById(recDivId);
                if(recDivDom){
                    recDivDom.style.visibility = "visible";
                }
			}
			if(newOutJson.allMsg.recommendMsg[ii].recommendShowPic.length > 0){
                closeAniFlag(newOutJson.allMsg.recommendMsg[ii]);
                var divId = newOutJson.allMsg.recommendMsg[ii].recommendShowPic[0].divId;
                var divDom = document.getElementById(divId);
                if(divDom){
                    divDom.style.visibility = "hidden";
                }

            }
            if(newOutJson.allMsg.recommendMsg[ii].recommendHidePic.length > 0){
                var secDivId = newOutJson.allMsg.recommendMsg[ii].recommendHidePic[0].divId;
                var secDivDom = document.getElementById(secDivId);
                if(secDivDom){
                    secDivDom.style.visibility = "hidden";
                }

            }
            //columnAni.setCSSBlurType(newOutJson.allMsg.recommendMsg[ii]);
        }
    }
	/*
    * 返回按钮获取焦点时(除返回焦点),显示焦点选中显示详情图,设置当前焦点与详情图的动画类型并执行(columnAni.setCSSFocusType)
    * */
    function backGetFocus(ii){
        if(newOutJson.allMsg.outRecommendMsg.length > 0 && newOutJson.allMsg.outRecommendMsg[ii].recommendLabelpic.length > 0){
            if(newOutJson.allMsg.outRecommendMsg[ii].recommendPic.length > 0){
				var recDivId = newOutJson.allMsg.outRecommendMsg[ii].recommendPic[0].divId;
                var recDivDom = document.getElementById(recDivId);
                if(recDivDom){
                    recDivDom.style.visibility = "hidden";
                }
			}
			if(newOutJson.allMsg.outRecommendMsg[ii].recommendShowPic.length > 0){
				openAniFlag(newOutJson.allMsg.outRecommendMsg[ii]);
                var divId = newOutJson.allMsg.outRecommendMsg[ii].recommendShowPic[0].divId;
                var divDom = document.getElementById(divId);
                if(divDom){
                    divDom.style.visibility = "visible";
                }
            }
            if(newOutJson.allMsg.outRecommendMsg[ii].recommendHidePic.length > 0){
                var secDivId = newOutJson.allMsg.outRecommendMsg[ii].recommendHidePic[0].divId;
                var secDivDom = document.getElementById(secDivId);
                if(secDivDom){
                    secDivDom.style.visibility = "visible";
                }

            }
            //columnAni.setCSSFocusType(newOutJson.allMsg.outRecommendMsg[ii]);
        }
    }
    /*
    * 返回按钮失去焦点时(除返回焦点),显示焦点选中显示详情图,设置当前焦点与详情图的动画类型并执行(columnAni.setCSSFocusType)
    * */
    function backLoseFocus(ii){
        if(newOutJson.allMsg.outRecommendMsg.length > 0 && newOutJson.allMsg.outRecommendMsg[ii].recommendLabelpic.length > 0){
            if(newOutJson.allMsg.outRecommendMsg[ii].recommendPic.length > 0){
				var recDivId = newOutJson.allMsg.outRecommendMsg[ii].recommendPic[0].divId;
                var recDivDom = document.getElementById(recDivId);
                if(recDivDom){
                    recDivDom.style.visibility = "visible";
                }
			}
			if(newOutJson.allMsg.outRecommendMsg[ii].recommendShowPic.length > 0){
                closeAniFlag(newOutJson.allMsg.outRecommendMsg[ii]);
                var divId = newOutJson.allMsg.outRecommendMsg[ii].recommendShowPic[0].divId;
                var divDom = document.getElementById(divId);
                if(divDom){
                    divDom.style.visibility = "hidden";
                }

            }
            if(newOutJson.allMsg.outRecommendMsg[ii].recommendHidePic.length > 0){
                var secDivId = newOutJson.allMsg.outRecommendMsg[ii].recommendHidePic[0].divId;
                var secDivDom = document.getElementById(secDivId);
                if(secDivDom){
                    secDivDom.style.visibility = "hidden";
                }

            }
            //columnAni.setCSSBlurType(newOutJson.allMsg.outRecommendMsg[ii]);
        }
    }
	/**
     *打开动画开关（非CSS3动画类）
	**/
	function openAniFlag(aniMsg){
		if(aniMsg.recommendPic.length > 0){
            if(columnAni.aniFlagObj[aniMsg.recommendPic[0].divId] != undefined){
                columnAni.aniFlagObj[aniMsg.recommendPic[0].divId] = 0;
            }
            if(columnAni.aniTimesObj[aniMsg.recommendPic[0].divId] == 2){
                columnAni.aniTimesObj[aniMsg.recommendPic[0].divId] = 1;
            }
		}
		if(aniMsg.recommendLabelpic.length > 0){
			if(columnAni.aniFlagObj[aniMsg.recommendLabelpic[0].divId] != undefined){
                columnAni.aniFlagObj[aniMsg.recommendLabelpic[0].divId] = 0;
            }
            if(columnAni.aniTimesObj[aniMsg.recommendLabelpic[0].divId] == 2){
                columnAni.aniFlagObj[aniMsg.recommendLabelpic[0].divId] = 1;
            }
		}
		if(aniMsg.recommendShowPic.length > 0){
			if(columnAni.aniFlagObj[aniMsg.recommendShowPic[0].divId] != undefined){
                columnAni.aniFlagObj[aniMsg.recommendShowPic[0].divId] = 0;
            }
            if(columnAni.aniTimesObj[aniMsg.recommendShowPic[0].divId] == 2){
                columnAni.aniTimesObj[aniMsg.recommendShowPic[0].divId] = 1;
            }
		}
		if(aniMsg.recommendHidePic.length > 0){
			if(columnAni.aniFlagObj[aniMsg.recommendHidePic[0].divId] != undefined){
                columnAni.aniFlagObj[aniMsg.recommendHidePic[0].divId] = 0;
            }
            if(columnAni.aniTimesObj[aniMsg.recommendHidePic[0].divId] == 2){
                columnAni.aniTimesObj[aniMsg.recommendHidePic[0].divId] = 1;
            }
		}
	}
    /**
     *关闭动画开关（非CSS3动画类）
     **/
    function closeAniFlag(aniMsg){
        if(aniMsg.recommendPic.length > 0 && columnAni.aniFlagObj[aniMsg.recommendPic[0].divId]){
            columnAni.aniFlagObj[aniMsg.recommendPic[0].divId] = 2;
        }
        if(aniMsg.recommendLabelpic.length > 0 && columnAni.aniFlagObj[aniMsg.recommendLabelpic[0].divId]){
            columnAni.aniFlagObj[aniMsg.recommendLabelpic[0].divId] = 2;
        }
        if(aniMsg.recommendShowPic.length > 0 && columnAni.aniFlagObj[aniMsg.recommendShowPic[0].divId]){
            columnAni.aniFlagObj[aniMsg.recommendShowPic[0].divId] = 2;
        }
        if(aniMsg.recommendHidePic.length > 0 && columnAni.aniFlagObj[aniMsg.recommendHidePic[0].divId]){
            columnAni.aniFlagObj[aniMsg.recommendHidePic[0].divId] = 2;
        }
    }
    /**
     * 按数字免费鉴权,测试用
    * */
	var freeAddr = "";
	var testNumber = "";
	function changeNum(num){
		testNumber = testNumber + num;
		if(testNumber == "1024"){
			freeAddr = newOutJson.actionName;
		}
	}
    /**
     * 焦点点击确认跳转
    * */
    function goSomeWhere(ii){
        CT.setCookie("generalBackFocus",curFocus.FocusID);
		CT.setCookie("backUrl",window.location.href);
		var columnFree = OutJson[0].pageInfo.more1;
		if(isOrder == "true" || columnFree == "free" || freeAddr == newOutJson.actionName){
			recommendUrl(1,"recommend_1",ii);
		}else{
			window.location.href = isOrderUrl;
		}
    }
    /**
     *  返回方法
    * */
    function backFunc(){
        if(OutJson && OutJson[2] && OutJson[2].recommend_2[0]){
            //删除但不跳转上一页面地址
            CT.delPreMemoryPage();
            recommendUrl(2,"recommend_2",0);
        }else{
            BackPortalMainPage();
        }
    }

	function recommendUrl(ids0,ids1,ids2){
		var mapInfo; 
		mapInfo = OutJson[ids0][ids1][ids2];   
		var columnFree = OutJson[0].pageInfo.more1;
		if(isOrder == "true" || columnFree == "free" || freeAddr == newOutJson.actionName){
			recommendUrlDetail(mapInfo);
		}else{
			window.location.href = isOrderUrl;
		}
	}   

	function recommendUrlDetail(mapInfo){//跳转详情页
		//0 游戏 1 卡通 2 ip编号 3 其他地址 4 通用页面id 5 活动id
		switch (mapInfo.recommendDisplayType) {
			case 0:
				window.location.href = "page.action?action=gameDetail&backType=1&gameId="+mapInfo.gameId;            
                break;
			case 1:
				window.location.href = "page.action?action=cartoonDetail&backType=1&cartoonId="+mapInfo.cartoonId;	 
                break;
			case 2:
				window.location.href = "page.action?action=ipExpand&backType=1&ipId="+mapInfo.ipId;
		        break;
		    case 3:
	            window.location.href = mapInfo.otherUrl;
		        break;
		    case 4:
		        window.location.href = "page.action?commPageId="+mapInfo.commpageId;
		        break;
		    case 5:
		        window.location.href = "page.action?action=activityDetailPage&activityId="+mapInfo.activityId;
		        break;
		    default:
		        BackPortalMainPage();
		    }
	};     
</script>
</html>