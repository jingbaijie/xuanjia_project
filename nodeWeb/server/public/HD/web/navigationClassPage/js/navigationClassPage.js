
var commonPageInfo = basePageInfo.commonPageInfo;
var page = {
    midFixedRecInfo: basePageInfo.transferObj.midFixedRecInfo,
    imgUrl: AjaxConfig.imgUrl,//图片Ip地址
    //页面英文名 从眉头取覆盖
    contentName: null,
    //页面编号ID 从眉头取覆盖
    contentId: commonPageInfo.pageInfo.commonPageId,
    //二级列表按钮信息   leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].classContentInfo 为当前展示的二级分类数据
    leftBtnListInfo: {},
    //当前所属分类按钮 索引
    curLabelBtnIndex: Number(CT.requestValue("curLabelBtnIndex")) || 0,
    //当前展示按钮的第一个索引
    startBtnIndex: Number(CT.requestValue("startBtnIndex")) || 0,
    //箭头动画计时器，所用变量
    arrowCount: 1,
    //箭头动画计时器
    arrowTimer: null,
    //中部当前展示的分类卡通详情数据
    curClassContentInfo: null,
    //是否是中部展示按钮返回焦点到左侧列表按钮
    isMidContentBackFocus: false,
    //是否是中部展示按钮 向上切换新的分类内容
    midContentUpChangeClass: false,
    //是否是中部展示按钮 向下切换新的分类内容
    midContentDownChangeClass: false,
    //同类内容展示焦点第一排和第二排之间切换
    midDiffRowFocusChange: false,
    //当前二级分类详情，所处第几分页（一页展示8条数据，不过这里计数四条算一页）
    curClassContentPageIndex: Number(CT.requestValue("curClassContentPageIndex")) || 0,
    //右部固定推荐详情数据
    rightFixedRecInfo: null,
    //标识进入本页面是是否记忆状态
    //光标选中推荐位标题跑马灯定时器
    horseRaceLamp: null,
    leftBtnTitleArr: [],
    //左侧列表按钮展示区域最大个数
    leftBtnMaxNum: 5,
    doMemory: false,
    isAnimationOn: true,       // 是否使用焦点动画
    init: function () {
        var _this = this;
        if (CT.requestValue("curClassContentPageIndex")) {
            _this.doMemory = true;
        }
        if (commonPageInfo.recommend_1 && commonPageInfo.recommend_1[0].recommendDisplayType == 9 && commonPageInfo.recommend_1[0].recommendDisplayValue == 3) {
            _this.isAnimationOn = true
        }
        //推荐按钮
        buttons.push({
            id: 'hands_x0_y0_hotRecommendFocus_',
            //clickHandler:'javascript:toNextPage()',
            otherFocusEvent: 'javascript:page.showHotRecArea()',
            //otherBlurEvent:'javascript:page.rightBtnBlurFocus(' + i + ')',
            left: "disable",
            //leftEvent : 'javascript:page.rightBtntoLeft(' + i + ')',
            right: 'hands_x0_y0_DMEJhotrecommend0_',
            up: "hands_x0_y0_DMSYDH0_",
            //down:'hands_x0_y0_DMEJleftcontentpagebutton0_',
            downEvent: 'javascript:PAGE.changeFocus("hands_x0_y0_DMEJleftcontentpagebutton0_")',
            focusType: 7
        });
        _this.getCommonPageInfoToDo();
        //设置左侧按钮列表上下箭头动画
        _this.setArrowAnimation();
        //显示当前分类按钮标记图
    },
    //得到 页面配置数据后的操作
    getCommonPageInfoToDo: function () {
        var _this = this;
        //初始化中部按钮列表
        _this.initMidFiexRecBtn();
        var parentId = CT.requestValue("parentId");
        if (parentId || parentId === 0) {
            _this.getAllSubtag(parentId);
        } else {
            _this.getAllSubtag();
        }
        // 广告数据代入组件需调整*********
        // if (commonPageInfo.recommend_2 && commonPageInfo.recommend_2[1] && commonPageInfo.recommend_2[1].recommendPic) {
        //     //从本页面取广告数据
        //     _this.recommendPoster = commonPageInfo.recommend_2[1];
        // }else if (commonPageInfo.pageInfo.commonPageInfo.recommend_4 && commonPageInfo.pageInfo.commonPageInfo.recommend_4[1] && commonPageInfo.pageInfo.commonPageInfo.recommend_4[1].recommendPic) {
        //     //从页面公共数据取广告数据
        //     _this.recommendPoster = commonPageInfo.pageInfo.commonPageInfo.recommend_4[1];

        // }
    },
    //左侧列表选中底图和光标换图
    changeLeftListImg: function () {
        var _this = this;
        var maxLength = _this.leftBtnListInfo.data.length > _this.leftBtnMaxNum ? _this.leftBtnMaxNum : _this.leftBtnListInfo.data.length;
        for (var i = 0; i < maxLength; i++) {
            if (_this.leftBtnListInfo.data[_this.startBtnIndex + i].labelPic) {
                CT.$("leftBtnEd" + i).src = _this.imgUrl + _this.leftBtnListInfo.data[_this.startBtnIndex + i].labelPic.picPath;
                CT.$("DMEJleftcontentpagebutton" + i).src = _this.imgUrl + _this.leftBtnListInfo.data[_this.startBtnIndex + i].detailPic.picPath;
            } else {
                var recDate = commonPageInfo.recommend_1[2];
                if (recDate && recDate.recommendLabelpic) {
                    CT.$("leftBtnEd" + i).src = AjaxConfig.imgUrl + recDate.recommendLabelpic.picPath;
                } else {
                    CT.$("leftBtnEd" + i).src = basePageInfo.localImg + "btnSelecting.png";
                }
                if (recDate && recDate.recommendFocuspic) {
                    CT.$("DMEJleftcontentpagebutton" + i).src = AjaxConfig.imgUrl + recDate.recommendFocuspic.picPath;
                } else {
                    CT.$("DMEJleftcontentpagebutton" + i).src = basePageInfo.localImg + 'btnFocus.png';
                }
            }
        }
    },
    //获取不同分类的子标签，展示在页面左侧 findTypesByParentId
    getAllSubtag: function (parentId) {
        var _this = this;
        var parentId = parentId;
        if (!parentId) {
            var navData = commonPageInfo.pageInfo.commonPageInfo.recommend_2;
            if (_this.contentName != null) {
                for (var i = 0; i < navData.length; i++) {
                    if (navData[i].commpageName.trim() == _this.contentName) {
                        parentId = navData[i].recommendDisplayValue;
                        break;
                    }
                }
            } else if (_this.contentId != null) {
                for (var i = 0; i < navData.length; i++) {
                    if (navData[i].commpageId == _this.contentId) {
                        parentId = navData[i].recommendDisplayValue;
                        break;
                    }
                }
            }
        }
        //	interface.findTypesByParentId({"parentId":parentId},function(data){
        var data = basePageInfo.typesByParentInfo || [];
        _this.leftBtnListInfo.data = data;
        if (data.length == 0) {
            PAGE.focusInit();
            var initFocus = CT.requestValue("curFocusId");
            var start = PAGE.getFocusModel6(initFocus);
            if (!start) {
                start = PAGE.getFocusModel6("hands_x0_y0_DMEJhotrecommend0_");
            }
            start.defaultFocus();
            return;
        }
        //初始化左侧按钮列表
        _this.initLeftBtnList();
        _this.getSubtagContent("doInit");
        page.showCurLabelBtn();
        //	});

    },
    //初始化中部上方固定列表按钮
    initMidFiexRecBtn: function () {
        var _this = this;
        for (var index = 0; index < _this.midFixedRecInfo.length; index++) {
            //初始化按钮
            var midFixedBtn = {
                id: "hands_x0_y0_DMEJhotrecommend" + index + "_",
                clickHandler: "javascript:page.toJump({type:'hotRecommend'})",
                otherFocusEvent: 'javascript:page.showHotRecArea(' + index + ')',
                left: 'hands_x0_y0_DMEJhotrecommend' + (index - 1) + '_',
                right: "hands_x0_y0_DMEJhotrecommend" + (index + 1) + "_",
                up: 'hands_x0_y0_DMEJhotrecommend' + (index - 5) + '_',
                //回到中间导航按钮（和当前页面内容对应的导航按钮）
                downEvent: 'javascript:page.midFiexRecBtnDown(' + index + ')',
                TempData: _this.midFixedRecInfo[index],
                focusType: 7
            }
            if (index == 0 || index == 5) {
                midFixedBtn.left = "hands_x0_y0_hotRecommendFocus_";
            }
            if (index == 4 || index == 9) {
                midFixedBtn.right = "disable";
            }
            if (index < 5) {
                midFixedBtn.up = "hands_x0_y0_DMSYDH" + topNavObj.showNavSelectedId + "_";
            }
            buttons.push(midFixedBtn);
        }
    },
    //获取不同分类的子标签的卡通详情 findContentsByTypeId
    getSubtagContent: function (doInit) {
        var _this = this;
        if (_this.leftBtnListInfo.data.length == 0) return;
        var typeId = _this.leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].id;
        interface.findContentsByTypeId({ "typeId": typeId }, function (data) {
            if (doInit) {
                //调用时传 doInit，表示还未初始化中部焦点
                //初始化中部按钮列表
                _this.initMidCotentBtn();
                //初始化焦点
                PAGE.focusInit();
                //关掉记忆页面标识
                _this.doMemory = false;
                var initFocus = CT.requestValue("curFocusId") || "hands_x0_y0_DMEJhotrecommend0_";
                PAGE.changeFocus(initFocus);
            }
            //获取对应分类内容，并存入对应按钮对象的 classContentInfo 属性中
            _this.leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].classContentInfo = data;
            //真正更新页面中部展示
            _this.trueUpdateMidCotent();
        });
    },
    //中部上方固定推荐按钮向下
    midFiexRecBtnDown: function (index) {
        var _this = this;
        if (index > 4 && index < 8) {
            for (var i = 0; i < 2; i++) {
                if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").enFocus) {
                    PAGE.changeFocus("hands_x0_y0_DMEJcontent" + i + "_");
                    break;
                }
            }
        } else if (index >= 8) {
            for (var i = 0; i < 5; i++) {
                if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + (4 - i) + "_").enFocus) {
                    PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (4 - i) + "_");
                    break;
                }
            }
        } else {
            //第一排
            PAGE.changeFocus("hands_x0_y0_DMEJhotrecommend" + (index + 5) + "_");
        }
    },
    //显示热门推荐
    showHotRecArea: function (index) {
        var _this = this;
        CT.$('hotRecommendEdImg').style.visibility = 'visible';
        CT.$('leftBtnEd0').style.visibility = 'hidden';
        CT.$('middleContent').style.top = '550px';
        CT.$('hotRecommendWrapper').style.display = 'block';
        /*判断为低版本盒子
        if (XJEPG.stbType == '1' && CT.$('hands_x0_y0_DMEJcontent5_').style.display != 'none') {
            for (var i = 0; i < 10; i++) {
                if (i < 5) {
                    //第一排
                    CT.$('content' + i).style.height = '105px';
                    CT.$('content' + i).style.borderRadius = '16px 16px 0 0';
                }else{
                    //第二排
                    CT.$('content' + i).style.display = 'none';
                }
                //隐藏焦点和角标、字幕
                CT.$('contentTitle' + i).style.display = 'none';
                CT.$('freeBadge' + i).style.display = 'none';
                CT.$('hands_x0_y0_DMEJcontent' + i + '_').style.display = 'none';
            }
        }
        */
        //当前进度条
        CT.$('curPage').innerHTML = 1;
        if (index > 4) {
            CT.$('curPage').innerHTML = 2;
        }
        CT.$('totalPage').innerHTML = 2;
        if ((index || index == 0) && _this.isAnimationOn) {
            //去掉动画
            for (var i = 0; i < _this.midFixedRecInfo.length; i++) {
                CT.removeClass(CT.$("hands_x0_y0_DMEJhotrecommend" + i + "_"), 'bigTransform');
            }
            CT.addClass(CT.$("hands_x0_y0_DMEJhotrecommend" + index + "_"), 'bigTransform');
        }
    },
    //隐藏热门推荐
    hidHotRecArea: function () {
        var _this = this;
        page.showCurLabelBtn();
        CT.$('hotRecommendEdImg').style.visibility = 'hidden';
        CT.$('middleContent').style.top = '145px';
        CT.$('hotRecommendWrapper').style.display = 'none';
        /*判断为低版本盒子
        if (XJEPG.stbType == '1' && (CT.$('hands_x0_y0_DMEJcontent5_').style.display == 'none' || CT.$('hands_x0_y0_DMEJcontent5_').style.display == '')) {
            for (var i = 0; i < 10; i++) {
                if (i < 5) {
                    //第一排
                    CT.$('content' + i).style.height = '233px';
                    CT.$('content' + i).style.borderRadius = '16px';
                }
                CT.$('content' + i).style.display = 'block';
                //隐藏焦点和角标、字幕
                CT.$('contentTitle' + i).style.display = 'block';
                CT.$('freeBadge' + i).style.display = 'block';
                CT.$('hands_x0_y0_DMEJcontent' + i + '_').style.display = 'block';
            }
        }
        */
        //去掉热门推荐位动画
        try {
            if (curFocus.lastFocusId.toLowerCase().indexOf('hands_x0_y0_DMEJhotrecommend') > -1) {
                CT.removeClass(CT.$(curFocus.lastFocusId), 'bigTransform');
            }
        } catch (error) {

        }
    },
    //右侧固定推荐焦点向左
    rightBtntoLeft: function (index) {
        var _this = this;
        var isChangeFocus = false;
        for (var i = 0; i < 5; i++) {
            if (index == 0) {
                if (_this.startBtnIndex == 0 && _this.curLabelBtnIndex == 0 && _this.curClassContentPageIndex == 0) {
                    PAGE.changeFocus("hands_x0_y0_DMEJhotrecommend1_");
                    isChangeFocus = true;
                    break;
                } else {
                    if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + (3 - i) + "_").enFocus) {
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (3 - i) + "_");
                        isChangeFocus = true;
                        break;
                    }
                }
            } else {
                if (_this.startBtnIndex == 0 && _this.curLabelBtnIndex == 0 && _this.curClassContentPageIndex == 0) {
                    if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + (3 - i) + "_").enFocus) {
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (3 - i) + "_");
                        isChangeFocus = true;
                        break;
                    }
                } else {
                    if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + (7 - i) + "_").enFocus) {
                        if (_this.firstLineToRight == false) {
                            PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (7 - i) + "_");
                        } else {
                            page.midToNextPage(3 - i);
                        }
                        isChangeFocus = true;
                        break;
                    }
                }
            }
        }
        if (!isChangeFocus) {
            for (var i = 0; i < 5; i++) {
                if (PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + (3 - i) + "_").enFocus) {
                    PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (3 - i) + "_");
                    isChangeFocus = true;
                    break;
                }
            }
        }
        if (!isChangeFocus) {
            _this.toLabelLeftBtn();
        }
    },
    //右侧固定推荐焦点获取焦点
    rightBtnGetFocus: function (index) {
        var _this = this;
        if (!curFocus.TempData) {
            curFocus.TempData = _this.rightFixedRecInfo[index];
        }
        /*if(CT.getStrLen(CT.$("rightRec" + index).dataset.content) > 13){
             CT.addClass(CT.$("rightRec" + index),"marquee_self");
         }*/
    },
    //右侧固定推荐焦点失去焦点
    /*rightBtnBlurFocus : function (index) {
        CT.removeClass(CT.$("rightRec" + index),"marquee_self");
    },*/
    //设置按钮列表上下箭头动画
    setArrowAnimation: function () {
        var _this = this;
        _this.arrowTimer = setInterval(function () {
            var arrowData = commonPageInfo.recommend_1[3];
            if (arrowData && arrowData.recommendPic && arrowData.recommendLabelpic) {
                if (_this.arrowCount % 2 == 0) {
                    CT.$('arrow_up').src = AjaxConfig.imgUrl + arrowData.recommendPic.picPath;
                    CT.$('arrow_down').src = AjaxConfig.imgUrl + arrowData.recommendPic.picPath;
                } else {
                    CT.$('arrow_up').src = AjaxConfig.imgUrl + arrowData.recommendLabelpic.picPath;
                    CT.$('arrow_down').src = AjaxConfig.imgUrl + arrowData.recommendLabelpic.picPath;
                }
            } else {
                CT.$('arrow_up').src = basePageInfo.localImg + 'arrow' + _this.arrowCount + '.png';
                CT.$('arrow_down').src = basePageInfo.localImg + 'arrow' + _this.arrowCount + '.png';
                if (_this.arrowCount >= 2) {
                    _this.arrowCount = 0;
                }
            }
            _this.arrowCount++;
            //眉头选中gif效果
            topNavObj.navBarObjTimerFunc && topNavObj.navBarObjTimerFunc();
        }, 300)
    },
    //初始化左侧按钮列表
    initLeftBtnList: function () {
        var _this = this;
        var leftBtnListInfoLength = _this.leftBtnListInfo.data.length < _this.leftBtnMaxNum ? _this.leftBtnListInfo.data.length : _this.leftBtnMaxNum;
        for (var i = 0; i < leftBtnListInfoLength; i++) {
            CT.$('leftBtnBGImg' + i).style.visibility = 'visible';
            //初始化按钮
            _this.leftBtnListInfo.data[i + _this.startBtnIndex].recommendTrackName = "DMEJleftcontentpagebutton" + i;
            var leftBtn = {
                id: "hands_x0_y0_DMEJleftcontentpagebutton" + i + "_",
                otherFocusEvent: 'javascript:page.showClassContent(' + i + ')',
                otherBlurEvent: 'javascript:page.initLeftBtnBlur(' + i + ')',
                left: "disable",
                rightEvent: 'javascript:page.leftBtnToMidContent(' + i + ')',
                up: "hands_x0_y0_DMEJleftcontentpagebutton" + (i - 1) + "_",
                down: "hands_x0_y0_DMEJleftcontentpagebutton" + (i + 1) + "_",
                TempData: _this.leftBtnListInfo.data[i + _this.startBtnIndex],
                focusType: 7
            };

            if (i == 0) {
                leftBtn.upEvent = 'javascript:page.leftBtnUpEvent()';
            }
            if (i == leftBtnListInfoLength - 1) {
                leftBtn.downEvent = 'javascript:page.leftBtnDownEvent()';
            }
            if (_this.leftBtnListInfo.data.length > _this.leftBtnMaxNum + _this.startBtnIndex && i == leftBtnListInfoLength - 1) {
                _this.showUpArrow("arrow_down");
            }
            if (_this.startBtnIndex > 0) {
                _this.showUpArrow("arrow_up");
            }
            buttons.push(leftBtn);

            //初始化按钮内容页面显示
            var showTitle = _this.leftBtnListInfo.data[i + _this.startBtnIndex].typeCname;
            // 存储名字
            _this.leftBtnTitleArr[i] = showTitle;
            if (showTitle.length > 5) {
                CT.$("leftBtnText" + i).innerHTML = String(showTitle).slice(0, 4) + "…";
            } else {
                CT.$("leftBtnText" + i).innerHTML = String(showTitle);
            }
        }
    },
    //获取到焦点 跑马灯
    initLeftBtnFocus: function () {
        var _this = this;
        var i = Number(curFocus.FocusID.match(/[\d]+/g)[2]);
        var showTitle = _this.leftBtnTitleArr[i];
        CT.$("leftBtnText" + i).innerHTML = CT.setMarquee(showTitle, 10, 4)
    },
    //失去焦点 跑马灯
    initLeftBtnBlur: function () {
        var _this = this;
        var i = Number(curFocus.FocusID.match(/[\d]+/g)[2]);
        var showTitle = _this.leftBtnTitleArr[i];
        if (showTitle.length > 5) {
            CT.$("leftBtnText" + i).innerHTML = String(showTitle).slice(0, 4) + "…";
        } else {
            CT.$("leftBtnText" + i).innerHTML = String(showTitle);
        }
    },
    //左侧列表按钮去中部展示按钮
    leftBtnToMidContent: function () {
        var _this = this;
        //从左侧按钮列表对象里取 中部详情数据
        _this.curClassContentInfo = _this.leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].classContentInfo;
        if (_this.curLabelBtnIndex == 0) {
            PAGE.changeFocus("hands_x0_y0_DMEJcontent0_");
        } else if (_this.curClassContentInfo.data.length > 0) {
            var focus = "hands_x0_y0_DMEJcontent0_";
            if (curFocus.lastFocusId && curFocus.lastFocusId.indexOf("hands_x0_y0_DMEJcontent") != -1) {
                focus = curFocus.lastFocusId;
            }
            PAGE.changeFocus(focus);
        }
    },
    //左侧按钮上翻页事件
    leftBtnUpEvent: function () {
        var _this = this;
        if (_this.startBtnIndex == 0) {
            _this.hidUpArrow("arrow_up");
            CT.$('leftBtnEd0').style.visibility = 'hidden';
            //回到中间导航按钮（和当前页面内容对应的导航按钮）
            PAGE.changeFocus('hands_x0_y0_hotRecommendFocus_');
        } else {
            if (_this.leftBtnListInfo.data.length > _this.leftBtnMaxNum && _this.startBtnIndex > 0) {
                _this.startBtnIndex--;
                _this.updateLeftBtnText();
                _this.showClassContent(0);
                _this.showUpArrow("arrow_down");
                if (_this.startBtnIndex == 0) {
                    _this.hidUpArrow("arrow_up");
                }
            }
        }
    },
    //左侧按钮下翻页事件
    leftBtnDownEvent: function () {
        var _this = this;
        if (_this.startBtnIndex + _this.leftBtnMaxNum < _this.leftBtnListInfo.data.length) {
            _this.startBtnIndex++;
            _this.updateLeftBtnText();
            _this.showClassContent(_this.leftBtnMaxNum - 1);
            _this.showUpArrow("arrow_up");
            if (_this.startBtnIndex + _this.leftBtnMaxNum >= _this.leftBtnListInfo.data.length) {
                _this.hidUpArrow("arrow_down");
            }
        } else {
            _this.hidUpArrow("arrow_down");
        }
    },
    //更新左侧按钮列表内容
    updateLeftBtnText: function () {
        var _this = this;
        for (var i = 0; i < _this.leftBtnMaxNum; i++) {
            var showTitle = _this.leftBtnListInfo.data[i + _this.startBtnIndex].typeCname;
            // 存储名字
            _this.leftBtnTitleArr[i] = showTitle;
            if (showTitle.length > 5) {
                CT.$("leftBtnText" + i).innerHTML = String(showTitle).slice(0, 4) + "…";
            } else {
                CT.$("leftBtnText" + i).innerHTML = String(showTitle);
            }
            //手动添加/更改当前坑位埋点
            if (PAGE.getModelByFocusId('hands_x0_y0_DMEJleftcontentpagebutton' + i + '_').TempData) {
                PAGE.getModelByFocusId('hands_x0_y0_DMEJleftcontentpagebutton' + i + '_').TempData.recommendTrackName = "DMEJleftcontentpagebutton" + (i + _this.startBtnIndex);
            } else {
                var tempData = _this.leftBtnListInfo.data[i + _this.startBtnIndex];
                tempData.recommendTrackName = "DMEJleftcontentpagebutton" + (i + _this.startBtnIndex);
                PAGE.getModelByFocusId('hands_x0_y0_DMEJleftcontentpagebutton' + i + '_').TempData = tempData;
            }
        }
    },
    //显示上下箭头动画
    showUpArrow: function (eleId) {
        document.getElementById(eleId).style.visibility = "visible";
    },
    //隐藏上下箭头动画
    hidUpArrow: function (eleId) {
        document.getElementById(eleId).style.visibility = "hidden";
    },
    //左侧按钮获焦事件
    showClassContent: function (index) {
        var _this = this;
        _this.hidHotRecArea();
        //_this.curLabelBtnIndex = index;
        // 不是中部按钮返回左侧列表按钮焦点
        if (!_this.isMidContentBackFocus) {
            if (_this.doMemory) {
                _this.doMemory = false;
            } else {
                _this.curLabelBtnIndex = index;
                _this.curClassContentPageIndex = 0;
            }
            //显示当前分类按钮标记图
            _this.showCurLabelBtn();
            //更新展示内容
            _this.updateMidCotent();
        } else {
            _this.isMidContentBackFocus = false;
        }
        // 跑马灯
        if (curFocus.FocusID.indexOf('DMEJleftcontentpagebutton') != -1) {
            _this.initLeftBtnFocus();
        }
    },
    //显示当前分类按钮标记图
    showCurLabelBtn: function () {

        var _this = this;
        //左侧列表选中底图和光标换图
        _this.changeLeftListImg();
        for (var i = 0; i < _this.leftBtnMaxNum; i++) {
            CT.$("leftBtnEd" + i).style.visibility = "hidden";
        }
        if (curFocus.FocusID.indexOf('DMEJhotrecommend') == -1 && curFocus.FocusID.indexOf('hotRecommendFocus') == -1) {
            CT.$("leftBtnEd" + _this.curLabelBtnIndex).style.visibility = "visible";
        } else {
            CT.$('hotRecommendEdImg').style.visibility = 'visible';
        }
    },
    //更新中部分类内容详情
    updateMidCotent: function () {
        var _this = this;
        //渲染中部展示数据，判断左侧按钮列表对象里有没有存 中部详情数据
        _this.curClassContentInfo = _this.leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].classContentInfo;
        if (_this.curClassContentInfo) {
            //真正更新页面中部展示
            _this.trueUpdateMidCotent();
        } else {
            //获取对应分类内容，并存入对应按钮对象的 classContentInfo 属性中
            _this.getSubtagContent();
        }
        // 改变进度条
        _this.changeScroll();
    },
    //真正更新中部分类内容详情
    trueUpdateMidCotent: function () {
        var _this = this;
        //从左侧按钮列表对象里获取 中部详情数据
        _this.curClassContentInfo = _this.leftBtnListInfo.data[_this.curLabelBtnIndex + _this.startBtnIndex].classContentInfo;
        if (_this.midContentUpChangeClass) {
            _this.midContentUpChangeClass = false;
            _this.curClassContentPageIndex = Math.ceil(_this.curClassContentInfo.data.length / 5) - 1;
        }

        var curClassContentPageIndex = _this.curClassContentPageIndex;
        //判断是否是同类内容下更新展示数据
        if (curClassContentPageIndex != 0 && (curFocus.FocusID == "hands_x0_y0_DMEJcontent5_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent6_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent7_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent8_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent9_")) {
            curClassContentPageIndex--;
        }
        /*
        //判断是否是同类内容上更新展示数据
        if(curClassContentPageIndex != Math.ceil(_this.curClassContentInfo.data.length / 4) - 1 && curFocus.FocusID == "hands_x0_y0_DMEJcontent0_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent1_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent2_" || curFocus.FocusID == "hands_x0_y0_DMEJcontent3_"){
            curClassContentPageIndex++;
        }
        */

        for (var i = 0; i < 10; i++) {
            //清除免费角标
            var dom = CT.$('freeBadge' + i);
            CT.removeClass(dom, 'freeBadge');
            //当前数据索引
            var curContentIndex = i + curClassContentPageIndex * 5;
            if (i < _this.curClassContentInfo.data.length - curClassContentPageIndex * 5) {
                //入口封面图
                var coverImg;
                //入口封面内容介绍
                var coverCname = "";
                // 判断是否为免费视频
                var freeBadge = "";
                //contentType 0：游戏；1：卡通；2：视频
                try {
                    if (_this.curClassContentInfo.data[curContentIndex].contentType == 0) {
                        coverImg = _this.curClassContentInfo.data[curContentIndex].iconPic.picPath;
                        coverCname = _this.curClassContentInfo.data[curContentIndex].contentCname;
                    } else if (_this.curClassContentInfo.data[curContentIndex].contentType == 1) {
                        coverCname = _this.curClassContentInfo.data[curContentIndex].contentCname;
                        coverImg = _this.curClassContentInfo.data[curContentIndex].iconPic.picPath;
                        freeBadge = _this.curClassContentInfo.data[curContentIndex].booleanFree;
                    } else if (_this.curClassContentInfo.data[curContentIndex].contentType == 2) {
                        coverImg = _this.curClassContentInfo.data[curContentIndex].iconPic.picPath;
                        coverCname = _this.curClassContentInfo.data[curContentIndex].contentCname;
                    }
                } catch (error) {

                }
                //var focus = PAGE.getFocusModel6("hands_x0_y0_DMEJcontent" + i + "_");
                //focus.enFocus = true;curFocus.
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").titleName = coverCname;
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").enFocus = true;
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").TempData = _this.curClassContentInfo.data[curContentIndex];
                var coverImgUrl = AjaxConfig.defaultCoverImg;
                if (coverImg) {
                    coverImgUrl = AjaxConfig.imgUrl + coverImg;
                }
                // CT.$('content' + i).style.background = "url(" + coverImgUrl + ") no-repeat";
                
                CT.$('content_' + i + "_img").src = coverImgUrl;
                CT.$('content' + i).style.backgroundSize = "cover";
                //CT.$('content' + i).style.backgroundPosition = "-16px -12px";
                CT.$("contentTitle" + i).innerHTML = coverCname.substring(0, 8);
                CT.$("contentTitle" + i).style.visibility = "visible";
                if (freeBadge == 0) {
                    CT.addClass(CT.$('freeBadge' + i), 'freeBadge')
                }
                // CT.$('content' + i).dataset.content = coverCname;
                //CT.addClass(CT.$('content' + i),"show-text");
                //CT.addClass(CT.$('content' + i),"all-content-data");
            } else {
                //var focus = PAGE.getFocusModel6("hands_x0_y0_DMEJcontent" + i + "_");
                //focus.enFocus = false;
                _this.stopText(i);
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").titleName = "";
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").enFocus = false;
                PAGE.getModelByFocusId("hands_x0_y0_DMEJcontent" + i + "_").TempData = null;
                // CT.$('content' + i).style.background = "url(" + basePageInfo.localImg + "empty.png)";
                if( CT.$('content_' + i + "_img")) {
                    CT.$('content_' + i + "_img").src = basePageInfo.localImg + "empty.png";
                }
                CT.$("contentTitle" + i).innerHTML = "";
                CT.$("contentTitle" + i).style.visibility = "hidden";
                // CT.$('content' + i).dataset.content = "";
                //CT.removeClass(CT.$('content' + i),"show-text");
                //CT.removeClass(CT.$('content' + i),"all-content-data");
            }
            if (!PAGE.getModelByFocusId(curFocus.FocusID).enFocus) {
                PAGE.getModelByFocusId(curFocus.FocusID).defaultBlur();
                try {
                    CT.$(curFocus.ImgID).style.visibility = 'hidden';
                } catch (error) {

                }
                PAGE.changeFocus("hands_x0_y0_DMEJcontent0_");
            }
        }
        //处理下面四个半露展示图, 计算第三排展示图有几个
        var midOverflowNum = _this.curClassContentInfo.data.length - curClassContentPageIndex * 5 - 10;
        if (midOverflowNum > 0) {
            for (var i = 0; i < 5; i++) {
                //当前数据索引
                var curContentIndex = i + curClassContentPageIndex * 5 + 10;
                //当前展示卡通信息Div索引
                var curTextIdIndex = i + 10;
                if (i < midOverflowNum) {
                    //入口封面图
                    var coverImg;
                    //contentType 0：游戏；1：卡通；2：视频 
                    try {
                        if (_this.curClassContentInfo.data[curContentIndex].contentType == 0) {
                            coverImg = _this.curClassContentInfo.data[curContentIndex].gameList[0].iconPic.picPath;
                        } else if (_this.curClassContentInfo.data[curContentIndex].contentType == 1) {
                            coverImg = _this.curClassContentInfo.data[curContentIndex].cartoonList[0].iconPic.picPath;
                        } else if (_this.curClassContentInfo.data[curContentIndex].contentType == 2) {
                            coverImg = _this.curClassContentInfo.data[curContentIndex].videoList[0].iconPic.picPath;
                        }
                    } catch (error) {

                    }
                    CT.$('content' + curTextIdIndex).style.background = "url(" + AjaxConfig.imgUrl + coverImg + ")";
                    CT.$('content' + curTextIdIndex).style.backgroundSize = "119%";
                    CT.$('content' + curTextIdIndex).style.backgroundPosition = "-16px -12px";
                } else {
                    CT.$('content' + curTextIdIndex).style.background = "url(" + basePageInfo.localImg + "empty.png)";
                    //CT.$('content' + curTextIdIndex).dataset.content = "";
                    //CT.removeClass(CT.$('content' + curTextIdIndex),"show-text");
                    //CT.removeClass(CT.$('content' + curTextIdIndex),"all-content-data");
                }
            }
        } else {
            for (var i = 0; i < 5; i++) {
                //当前数据索引
                var curContentIndex = i + curClassContentPageIndex * 5 + 10;
                //当前展示卡通信息Div索引
                var curTextIdIndex = i + 10;
                CT.$('content' + curTextIdIndex).style.background = "url(" + basePageInfo.localImg + "empty.png)";
                // CT.$('content' + curTextIdIndex).dataset.content = "";
                //CT.removeClass(CT.$('content' + curTextIdIndex),"show-text");
                //CT.removeClass(CT.$('content' + curTextIdIndex),"all-content-data");
            }
        }

        _this.changeScroll();
    },
    //初始化中部分类内容详情按钮
    initMidCotentBtn: function () {
        var _this = this;
        for (var i = 0; i < 10; i++) {
            var midBtn = {
                id: "hands_x0_y0_DMEJcontent" + i + "_",
                //是否开启自动查询下一焦点功能
                //enMove : false,
                clickHandler: 'javascript:page.toContentDetailUrl(' + i + ')',
                otherFocusEvent: 'javascript:page.midContentBtnGetFocus(' + i + ')',
                otherBlurEvent: 'javascript:page.stopText(' + i + ')',
                left: "hands_x0_y0_DMEJcontent" + (i - 1) + "_",
                //right:"hands_x0_y0_DMEJcontent" + (i + 1) + "_",
                rightEvent: 'javascript:page.midToRight(' + i + ')',
                upEvent: 'javascript:page.midToPrePage(' + i + ')',
                downEvent: 'javascript:page.midToNextPage(' + i + ')',
                focusType: 7
            }
            if (i == 0 || i == 5) {
                //leftBtn.up = "hands_x0_y0_DMSYDH0_";
                midBtn.leftEvent = 'javascript:page.toLabelLeftBtn()';
            }
            if (i == 4 || i == 9) {
                midBtn.right = 'disable';
            }
            buttons.push(midBtn);
        }
    },
    //中部分类详情推荐位按钮获焦事件
    midContentBtnGetFocus: function (index) {
        var _this = this;
        page.hidHotRecArea();
        _this.changeScroll();
        page.runText(index);
    },
    //中部按钮向右
    //是否是第一行按钮向右切换焦点到右侧焦点
    firstLineToRight: false,
    midToRight: function (index) {
        var _this = this;
        var nextFocus = "hands_x0_y0_DMEJcontent" + (index + 1) + "_";
        if (PAGE.getModelByFocusId(nextFocus)) {
            if (PAGE.getModelByFocusId(nextFocus).enFocus && (index + 1 != 5)) {
                //该焦点允许获焦
                PAGE.changeFocus(nextFocus);
            } else {
                _this.firstLineToRight = true;
                PAGE.changeFocus("hands_x0_y0_fixexRecFocus0_");
            }
        } else {
            _this.firstLineToRight = false;
            PAGE.changeFocus("hands_x0_y0_fixexRecFocus1_");
        }
    },
    //回到左侧标记分类按钮
    toLabelLeftBtn: function () {
        var _this = this;
        _this.isMidContentBackFocus = true;
        PAGE.changeFocus("hands_x0_y0_DMEJleftcontentpagebutton" + _this.curLabelBtnIndex + "_");
    },
    //添加跑马灯
    runText: function (index) {
        var _this = this;
        _this.hidHotRecArea();
        var showTitle = " " + curFocus.titleName;
        CT.$("contentTitle" + index).innerHTML = CT.setMarquee(showTitle, 14, 4);
        if (this.isAnimationOn) {
            // 加动画
            if (!CT.hasClass(CT.$('DMEJcontent' + index), 'bigTransform')) {
                CT.addClass(CT.$('DMEJcontent' + index), 'bigTransform')
                CT.addClass(CT.$('content' + index), 'bigTransform')
            }
        }
    },
    //去除跑马灯
    stopText: function (index) {
        CT.$("contentTitle" + index).innerHTML = String(curFocus.titleName).substring(0, 8);
        if (this.isAnimationOn) {
            // 加动画
            if (CT.hasClass(CT.$('DMEJcontent' + index), 'bigTransform')) {
                CT.removeClass(CT.$('DMEJcontent' + index), 'bigTransform')
                CT.removeClass(CT.$('content' + index), 'bigTransform')
            }
        }
    },
    //中部内容上一页
    midToPrePage: function (index) {
        var _this = this;
        //处于第一个分类
        if (_this.curLabelBtnIndex + _this.startBtnIndex == 0) {
            //当前展示类内容属于第一页
            if (_this.curClassContentPageIndex == 0) {
                //属于第一个分类
                _this.showHotRecArea();
                var focus = 'hands_x0_y0_DMEJhotrecommend5_';
                if (!CT.$(focus)) {
                    focus = 'hands_x0_y0_DMEJhotrecommend0_';
                }
                PAGE.changeFocus(focus);
            } else {
                //当前展示类内容大于第一页
                _this.curClassContentPageIndex--;
                //当前焦点属于第一排
                if (index < 5) {
                    //更新展示内容
                    _this.updateMidCotent();
                } else {
                    //当前焦点属于第二排
                    PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (index - 5) + "_");
                }
            }
        } else {
            //没有处于第一个分类
            //不用关注:_this.startBtnIndex，只需关注：_this.curLabelBtnIndex，切换上一分类内容
            if (_this.curLabelBtnIndex > 0) {
                //当前展示类内容属于第一页
                if (_this.curClassContentPageIndex == 0) {
                    _this.curLabelBtnIndex--;
                    _this.midContentUpChangeClass = true;
                    //隐藏焦点框
                    CT.$("DMEJcontent" + index).style.visibility = "hidden";
                    //换成第一个焦点
                    var initFocus = "hands_x0_y0_DMEJcontent0_";
                    /**/
                    if (page.curClassContentInfo.data.length == 0) {
                        initFocus = "hands_x0_y0_DMEJleftcontentpagebutton" + _this.curLabelBtnIndex + "_";
                    }
                    PAGE.changeFocus(initFocus);
                    try {
                        _this.showClassContent(_this.curLabelBtnIndex);
                    } catch (e) { }
                } else {
                    //当前展示类内容大于第一页
                    _this.curClassContentPageIndex--;
                    //当前焦点属于第一排
                    if (index < 5) {
                        //更新展示内容
                        _this.updateMidCotent();
                    } else {
                        //当前焦点属于第二排
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (index - 5) + "_");
                    }
                }
            } else if (_this.curLabelBtnIndex == 0) {
                //不用关注:_this.curLabelBtnIndex，只需关注：_this.startBtnIndex，切换上一分类内容
                //按钮列表上部有隐藏按钮
                //_this.leftBtnUpEvent();

                //当前展示类内容属于第一页
                if (_this.curClassContentPageIndex == 0) {
                    //_this.startBtnIndex--;
                    _this.midContentUpChangeClass = true;
                    _this.leftBtnUpEvent();
                    /**/
                    //_this.showClassContent(_this.curLabelBtnIndex);
                    //隐藏焦点框
                    CT.$("DMEJcontent" + index).style.visibility = "hidden";
                    //换成第一个焦点
                    PAGE.changeFocus("hands_x0_y0_DMEJcontent0_");
                } else {
                    //当前展示类内容大于第一页
                    _this.curClassContentPageIndex--;
                    //当前焦点属于第一排
                    if (index < 5) {
                        //更新展示内容
                        _this.updateMidCotent();
                    } else {
                        //当前焦点属于第二排
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (index - 5) + "_");
                    }
                }
            }
        }
    },
    //控制显示总卡通竖直进度的进度条
    changeScroll: function () {
        var _this = this;
        //当前分类的总页数
        if ((curFocus.FocusID.indexOf('hands_x0_y0_DMEJleftcontentpagebutton') > -1 || curFocus.FocusID.indexOf('hands_x0_y0_DMEJcontent') > -1) && _this.curClassContentInfo) {
            //当前焦点在分类数据导航按钮或推荐位焦点上
            var curCalsstotalPageNum = Math.ceil(_this.curClassContentInfo.data.length / 5);
            CT.$('curPage').innerHTML = _this.curClassContentPageIndex + 1;
            CT.$('totalPage').innerHTML = curCalsstotalPageNum;
        }
    },
    //中部内容下一页
    midToNextPage: function (index) {
        var _this = this;
        //处于最后一个分类
        if (_this.curLabelBtnIndex + _this.startBtnIndex == _this.leftBtnListInfo.data.length - 1) {
            //当前展示类内容属于最后一页
            if (_this.curClassContentPageIndex == Math.ceil(_this.curClassContentInfo.data.length / 5) - 1) {
                //下面没有新分类，啥都不做
            } else {
                //当前展示类内容小于最后一页
                _this.curClassContentPageIndex++;
                //当前焦点属于第一排
                if (index < 5) {
                    //当前数据加5个超出数据范围
                    if (index + _this.curClassContentPageIndex * 5 >= _this.curClassContentInfo.data.length) {
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (_this.curClassContentInfo.data.length % 5 - 1 + 5) + "_");
                    } else {
                        //当前数据加5个没有超出数据范围
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (index + 5) + "_");
                    }
                } else {
                    //当前焦点属于第二排
                    //当前数据超出数据范围
                    if (index + (_this.curClassContentPageIndex - 1) * 5 >= _this.curClassContentInfo.data.length) {
                        PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (_this.curClassContentInfo.data.length % 5 - 1) + "_");
                    } else {
                        //当前数据没有超出数据范围,  则焦点不变
                    }
                    //更新展示内容
                    _this.updateMidCotent();
                }
            }
        } else {
            //没有处于最后一个分类
            //不用关注:_this.startBtnIndex，只需关注：_this.curLabelBtnIndex，切换下一分类内容
            if (_this.curLabelBtnIndex < _this.leftBtnMaxNum - 1) {
                //当前展示类内容属于最后一页
                if (_this.curClassContentPageIndex == Math.ceil(_this.curClassContentInfo.data.length / 5) - 1) {
                    _this.curLabelBtnIndex++;
                    _this.showClassContent(_this.curLabelBtnIndex);
                    //隐藏焦点框
                    CT.$("DMEJcontent" + index).style.visibility = "hidden";
                    //换成第一个焦点
                    var initFocus = "hands_x0_y0_DMEJcontent0_";
                    if (page.curClassContentInfo.data.length == 0) {
                        initFocus = "hands_x0_y0_DMEJleftcontentpagebutton" + _this.curLabelBtnIndex + "_";
                    }
                    PAGE.changeFocus(initFocus);
                } else {
                    //当前展示类内容小于最后一页
                    _this.curClassContentPageIndex++;
                    //当前焦点属于第一排
                    if (index < 5) {
                        //当前数据加5个超出数据范围
                        if (index + _this.curClassContentPageIndex * 5 >= _this.curClassContentInfo.data.length) {
                            PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (_this.curClassContentInfo.data.length % 5 - 1 + 5) + "_");
                        } else {
                            //当前数据加5个没有超出数据范围
                            PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (index + 5) + "_");
                        }
                    } else {
                        //当前焦点属于第二排
                        //当前数据超出数据范围
                        if (index + (_this.curClassContentPageIndex - 1) * 5 >= _this.curClassContentInfo.data.length) {
                            PAGE.changeFocus("hands_x0_y0_DMEJcontent" + (_this.curClassContentInfo.data.length % 5 - 1) + "_");
                        } else {
                            //当前数据没有超出数据范围,  则焦点不变
                        }
                        //更新展示内容
                        _this.updateMidCotent();
                    }
                }
            } else if (_this.curLabelBtnIndex == _this.leftBtnMaxNum - 1) {
                //不用关注:_this.curLabelBtnIndex，只需关注：_this.startBtnIndex，切换下一分类内容
                //按钮列表下部有隐藏按钮
                _this.leftBtnDownEvent();
            }
        }
    },
	/*
	中部详情入口图点击跳转
	*/
    toContentDetailUrl: function (index) {
        var _this = this;
        //避免下标超出
        if (index > 4) {
            index -= 5;
        }
        //当前数据下标
        var curContentIndex = index + _this.curClassContentPageIndex * 5;
        var obj = _this.curClassContentInfo.data[curContentIndex];
        obj.recommendDisplayType = obj.contentType;
        obj.recommendDisplayValue = obj.contentId;
        //记忆页面离开时的数据
        _this.memoryPageLeaveData();
        CT.toAnterRecommendUrl(obj);

    },
	/**
     *  跳转
	 *  眉头跳转、瀑布流推荐位跳转、"返回到顶部"
	 *  如果是瀑布流的跳转先判断产品是否已经下线，下线不跳转
     *  @param type 跳转的类型：hotRecommend热门推荐推荐位跳转、Mid中间眉头跳转、Right右侧眉头跳转
     *  @param num 序号
     */
    toJump: function (type, num) {
        var _this = this;
        //已下线产品没有跳转
        if (curFocus.TempData.booleanUp == 0) {
            return;
        }
        if (type != 'topNav') {
            //记忆页面离开时的数据
            _this.memoryPageLeaveData();
        }
        //跳转
        CT.toAnterRecommendUrl(curFocus.TempData);
    },
    /*
        记录页面数据
        leaveDataObj ：离开页面参数对象
    */
    memoryPageLeaveData: function (leaveDataObj) {
        var _this = this;
        var obj = leaveDataObj || {}
        //先记录跳转离开之前的页面参数(分类导航页用例)  
        PAGE.otherPageParam = "&curFocusId=" + curFocus.FocusID +
            "&contentId=" + basePageInfo.commonPageInfo.pageInfo.commonPageId +
            "&parentId=" + CT.requestValue("parentId") +
            "&contentIdName=" + CT.requestValue("contentIdName") +
            "&startBtnIndex=" + page.startBtnIndex + "&curLabelBtnIndex=" + page.curLabelBtnIndex +
            "&curClassContentPageIndex=" + page.curClassContentPageIndex +
            "&contentEName=" + basePageInfo.commonPageInfo.pageInfo.commPageEname +
            "&contentCName=" + basePageInfo.commonPageInfo.pageInfo.commPageCname +
            "&action=" + CT.requestValue("action")
        CT.goPage();
    },
}

//页面返回
function backFunc() {
    if (CT.requestValue("parentId") == 19) {
        CT.getAnterByIdOrAction({
            contentName: "MFZQFHWLY"
        })
    } else {
        CT.backPage();
    }
}



/*	功能：推荐位通用跳转
	调用方法：CT.toJump(jumpObj);
		jumpObj 为跳转信息对象，里面的具体参数为：
			{
				nextPageArr: ,//要跳转的下一页面存贮数组 如：page.commonPageInfo.data.pageInfo.commonPageInfo
				nextPageArrStr: ,//要跳转的下一页面存贮数组 的数据路径 如："page.commonPageInfo.data.pageInfo.commonPageInfo"
				nextPageAttr: ,//要跳转的下一页面存贮数组 的属性名，如 "recommend_1"
				nextPageAttrStr: ,//要跳转的下一页面存贮数组 的属性名获取代码 如："a()"; // a的定义：function a(){ return "recommend_1" }
				nextPageArr: ,//要跳转的下一页面数据所在索引 如：1
				nextPageArrStr: ,//要跳转的下一页面数据所在索引 的获取代码 如："page.index1 + page.index2"
			}


	toJump:function(jumpObj){
		var _this =this;
		if(page.needSave()){
			//先记录跳转离开之前的页面信息，光标，翻页记录等
			PAGE.otherPageParam = page.needSavePageInfoStr();
			CT.goPage();
		}
		var nextPageArr = jumpObj.nextPageArr ? jumpObj.nextPageArr : eval(jumpObj.nextPageArrStr);
		var nextPageAttr = jumpObj.nextPageAttr ? jumpObj.nextPageAttrStr : eval(jumpObj.nextPageAttrStr);
		var nextPageIndex = jumpObj.nextPageIndex >= 0 ? jumpObj.nextPageIndexStr : eval(jumpObj.nextPageIndexStr);
        CT.toAnterRecommendUrl(nextPageArr,nextPageAttr,nextPageIndex);
	}
*/