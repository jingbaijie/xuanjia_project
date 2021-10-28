CT.$('main').style.top = '0px'
var commonPageInfo = basePageInfo.commonPageInfo;
var page = {
    //页面是否已完成注册焦点
    alreadyInitFocus: false,
    //页面是否已加载瀑布流图片
    alreadyLoadPBLImg: false,
    //页面id
    contentId: commonPageInfo.pageInfo.commonPageId || 1,
    //瀑布流数据
    pinterestData: null,
    //最大的div存放瀑布流DOM
    parentBox: document.getElementById('main'),
    //main的top值
    parentBoxHeight: 0,
    //比较当前行的数组,如果当前行填满则清空数组
    comPareArray: [{ curRowNum: 0, h: 720 }],
    //当前比较数组下标
    comPareArrayIndex: 0,
    //默认初始Left值
    defaultFocus: "hands_x0_y0_DMSYKW0_",
    //默认初始Left值
    defaultLeft: 40,
    //默认初始元素上下间隔值
    defaultSpaceCol: 20,
    //默认初始元素左右间隔值
    defaultSpaceRow: 20,
    //默认初始焦点图元素左上错位值
    defaultStartValue: 6,
    //默认瀑布流展示高度
    defaultHeight: 563,
    //默认初始top值
    defaultTop: 700,
    //是否已经加载完
    isLoaded: false,
    //小窗口是否在播放
    isPlayingVideo: true,
    //所有推荐位的more1 数据
    moer1DataJson: [],
    //main当前的top值，只用于首页离开后再返回到首页使用，实现来哪去哪
    mainTop: CT.requestValue("mainTop") || false,
    //跑马灯功能
    // 是否添加跑马灯
    isMarquee: true,
    // 跑马灯数据
    recommendMarquee: null,
    //广告功能
    // 是否显示广告
    isPoster: true,
    // 广告数据
    recommendPoster: null,
    // 第一屏固定推荐数据
    recommendFirstScreenFiexd: [],
    // 小视频区域数据
    recommendPlayer: [],
    //小视频数据
    recommendSmallVideoArr: [],
    //当前播放哪个小视频
    nowSmallVideoIndex: 0,
    //当前播放小视频所属的卡通
    CurCartoonId: null,
    //当前播放小视频所属的卡通视频列表信息： 'smallVideoListInfo' + CurCartoonId
    // 排行榜数据
    recommendRank: [],
    //小海贝悬浮框小人焦点的上一个焦点
    XHBLastFocusId: null,
    //切换播放小视频的计时器： videoPlayer.timer
    //小海贝动画计时器
    xhbBtnAnimationTimer: null,
    //主题列表数组
    themeListArr: [],
    //当前主题对象
    curThemeObj: null,

    isAnimationOn: true, // 是否使用焦点动画

    /** ************************ 功能性推荐位 1-轮播，2-排行，3-小视频，4-火车头 *****************************/
    recommendScroll: [], // 轮播图数据
    scrollId: 9999, // 轮播图所在推荐位
    rankId: 9999, // 排行榜所在推荐位
    playId: 9999, // 小视频所在推荐位
    //trainId: 9999,                         // 小火车所在推荐位
    dotPosition: -155, // 调整轮播图小圆点位置,
    dotW: 16, // 轮播图小圆点宽
    dotM: 10, // 轮播图小圆点间隙
    rankList: false, // 是否生成排行榜
    isPlay: false, // 是否生成小视频
    isTrain: false, // 是否生成小火车
    rankBoxTop: 62, // 排行榜内容盒子的top调整参数
    rankBoxHeight: 70, // 排行榜内容盒子的高度调整参数
    wordNums: 0, // 排行榜所能容纳字数
    isOnPlay: false, // 判断是否播放
    playObj: { // 小视频尺寸
        t: 238,
        l: 420,
        w: 400,
        h: 220
    },
    /**
     * 初始化页面，请求到页面需要的所有数据
     */
    init: function () {
        var _this = this;
        if (_this.inited == true) return;
        _this.inited = true;
        var data = AjaxConfig.commonPageInfo;
        /** 赋值功能数据 */
        //启动自动寻找焦点，自动寻找焦点--不需要给光标定义上下左右的移动位置或事件，key3_4.js循环寻找最近的坐标
        AjaxConfig.isAutoFindFocus = true;
        //瀑布流数据
        _this.pinterestData = data.recommend_5;
        //限定用户开启分层营销
        // var userId=['8851004071598812'];
        // if(xjDataLog.getUserId()=='8851004071598812'||xjDataLog.getUserId()=='01010216110704014348'){
        // _this.createLayer();
        // }else{
        _this.initPageDom();
        // }
        //用户分层营销弹窗生成
    },
    // 获取机会函数
    getChanceFunc: function () {
        chance.getChance(parseInt(xjDataLog.getUserId()), 23, function (getActi1Res) {
            if (getActi1Res.data.activityChance >= 1) {
               return;
            } else {
                chance.setChance(parseInt(xjDataLog.getUserId()), 23, function (setActi1Res) {
                    CT.getActivityUrl(23);
                });
            }
        });
    },
    //用户分层
    createLayer: function () {
        var _this = this;
        orderJs.getAuth({
            callback: function (res) {
                //判断用户活跃状态
                interface.loggerInfo("鉴权" + CT.jsonToString(res), 'post');
                _this.getPopType(1);
            },
            failCallback: function (res) {
                // console.log("error",res);
                interface.loggerInfo("failcallback 鉴权:" + CT.jsonToString(res), 'post');
                _this.getPopType(0);
                //创建弹出框
                // _this.createAlert("three");
            }
        })
    },
    //获取当前需要弹窗类型
    getPopType: function (type) {
        var _this = this;
        interface.judgeUserType(function (res) {
            interface.loggerInfo("getHeight:" + CT.jsonToString(res), 'post');
            if (res.errorCode == 1000) {
                //判断弹窗与否以及弹窗类型
                // if(xjDataLog.getUserId()=="8851004071598812"){
                //     res.data=0;
                // };
                interface.queryUserPopRemind({
                    params: {
                        userId: xjDataLog.getUserId(),
                        isOrder: type,
                        activeLevel: res.data
                    },
                    ajaxConfig: {
                        async: true
                    }
                }, function (resd) {
                    // console.log(res)
                    if (resd.errorCode == 1000) {
                        interface.loggerInfo("getAlertType:" + CT.jsonToString(resd), 'post');
                        _this.createAlert(resd.data.remindType);
                        if (resd.data.remindType != 0) {
                            interface.recordPop(
                                {
                                    params: {
                                        userId: xjDataLog.getUserId(),
                                        remindType: resd.data.remindType
                                    },
                                    ajaxConfig: {
                                        async: true
                                    }
                                },
                                function () {
                                }
                            )
                        } else {
                            _this.initPageDom();
                        }
                    } else {
                        _this.initPageDom();
                    }
                })
            } else {
                _this.initPageDom();
            }
        })
    },
    //创建弹出框
    createAlert: function (type) {
        var _this = this;
        //0(不弹框)，1(免费会员弹出)，2(弹出连续包月订购页)，3(弹出9.9特惠包月订购页)5(弹出提示提前续费领取积分换玩具的弹框)
        if (type == 0) {
            // _this.initPageDom();
            return;
        }
        if (basePageInfo.commonPageInfo.recommend_11) {
            var threeZero = basePageInfo.commonPageInfo.recommend_11[3].pageRecommendConfigTabVos;
            var pre = basePageInfo.commonPageInfo.recommend_11[1].pageRecommendConfigTabVos;
            var nine = basePageInfo.commonPageInfo.recommend_11[0].pageRecommendConfigTabVos;
            var getVip = basePageInfo.commonPageInfo.recommend_11[4].pageRecommendConfigTabVos;
            var imgUrlPre = AjaxConfig.projectUrl + basePageInfo.basePageUrl;
            var btn = {
                id: "hands_x0_y0_oldAlert_",
                left: "disable",
                right: "disable",
                up: "disable",
                down: "disable",
                focusType: 7,
                clickHandler: "javascript:page.toJump('alert')",
            };
            var parentDom = CT.$("oldUserOrderTip");
            parentDom.style.visibility = "visible";
            var initDomObj = [];
            if (type == 1) {
                var img1 = AjaxConfig.imgUrl + threeZero[1].picLibraryTab.picPath;
                var img2 = AjaxConfig.imgUrl + threeZero[0].picLibraryTab.picPath;
                var img3 = AjaxConfig.imgUrl + threeZero[2].picLibraryTab.picPath;
                btn.TempData = basePageInfo.commonPageInfo.recommend_11[3];
                var clickDiv = {
                    domTag: 'div',
                    domAttribute: {
                        "id": "hands_x0_y0_oldAlert_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'458px',
                        // 'left':'475px',
                    },
                    children: [
                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "alertShow",
                                'src': img2,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": threeZero[0].yvalue + "px",
                                "left": threeZero[0].xvalue + "px",
                            }
                        },
                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "oldAlert",
                                "src": img3,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": threeZero[2].yvalue + "px",
                                "left": threeZero[2].xvalue + "px",
                            }
                        }
                    ]
                };
                var bgDiv = {
                    domTag: 'img',
                    domAttribute: {
                        "id": "orderTipBg",
                        "src": img1,
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px'
                    }
                };
                btn.clickHandler = "javascript:page.getFreeDay()"
                initDomObj.push(bgDiv);
                initDomObj.push(clickDiv);
            } else if (type == 3) {
                var img1 = AjaxConfig.imgUrl + nine[2].picLibraryTab.picPath;
                var img2 = AjaxConfig.imgUrl + nine[0].picLibraryTab.picPath;
                var img3 = AjaxConfig.imgUrl + nine[3].picLibraryTab.picPath;
                var img4 = AjaxConfig.imgUrl + nine[1].picLibraryTab.picPath;
                var img5 = AjaxConfig.imgUrl + nine[4].picLibraryTab.picPath;
                btn.TempData = basePageInfo.commonPageInfo.recommend_11[0];
                var cancelBtn = {
                    id: "hands_x0_y0_cancel_",
                    left: "disable",
                    right: "disable",
                    up: "disable",
                    down: "hands_x0_y0_oldAlert_",
                    clickHandler: "javascript:backFunc()",
                    focusType: 7
                };
                buttons.push(cancelBtn);
                btn.up = "hands_x0_y0_cancel_";
                var cancelDiv = {
                    domTag: "div",
                    domAttribute: {
                        id: "hands_x0_y0_cancel_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'116px',
                        // 'left':'1030px'
                    },
                    children: [
                        {
                            domTag: 'img',
                            domAttribute: {
                                id: 'cancelShow',
                                "src": img4
                            },
                            cssStyle: {
                                'position': 'absolute',
                                'top': nine[1].yvalue + 'px',
                                'left': nine[1].xvalue + 'px',
                            }
                        }, {
                            domTag: 'img',
                            domAttribute: {
                                id: 'cancel',
                                "src": img5
                            },
                            cssStyle: {
                                'position': 'absolute',
                                'top': nine[4].yvalue + 'px',
                                'left': nine[4].xvalue + 'px',
                                'visibility': 'hidden'
                            }
                        }
                    ]
                };
                var clickDiv = {
                    domTag: 'div',
                    domAttribute: {
                        "id": "hands_x0_y0_oldAlert_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'464px',
                        // 'left':'505px',
                    },
                    children: [
                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "alertShow",
                                'src': img2,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": nine[0].yvalue + "px",
                                "left": nine[0].xvalue + "px",
                            }
                        },
                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "oldAlert",
                                "src": img3,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": nine[3].yvalue + "px",
                                "left": nine[3].xvalue + "px",
                            }
                        }
                    ]
                };
                var bgDiv = {
                    domTag: 'img',
                    domAttribute: {
                        "id": "orderTipBg",
                        "src": img1,
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px'
                    }
                };
                initDomObj.push(bgDiv);
                initDomObj.push(cancelDiv);
                initDomObj.push(clickDiv);
                buttons.push(btn);

            } else if (type == 5) {
                var img1 = AjaxConfig.imgUrl + pre[0].picLibraryTab.picPath;
                var img2 = AjaxConfig.imgUrl + pre[1].picLibraryTab.picPath;
                btn.TempData = basePageInfo.commonPageInfo.recommend_11[1]
                var clickDiv = {
                    domTag: 'div',
                    domAttribute: {
                        "id": "hands_x0_y0_oldAlert_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'440px',
                        // 'left':'419px',
                    },
                    children: [
                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "oldAlert",
                                "src": img2,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": pre[1].yvalue + "px",
                                "left": pre[1].xvalue + "px",
                            }
                        }
                    ]
                };
                var bgDiv = {
                    domTag: 'img',
                    domAttribute: {
                        "id": "orderTipBg",
                        "src": img1,
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px'
                    }
                };
                initDomObj.push(bgDiv);
                initDomObj.push(clickDiv);
            } else if (type == 2) {
                var img1 = AjaxConfig.imgUrl + getVip[1].picLibraryTab.picPath;
                var img3 = AjaxConfig.imgUrl + getVip[0].picLibraryTab.picPath;
                var img5 = AjaxConfig.imgUrl + getVip[2].picLibraryTab.picPath;
                btn.TempData = basePageInfo.commonPageInfo.recommend_11[4];
                var cancelBtn = {
                    id: "hands_x0_y0_cancel_",
                    left: "disable",
                    right: "disable",
                    up: "disable",
                    down: "hands_x0_y0_oldAlert_",
                    clickHandler: "javascript:backFunc()",
                    focusType: 7
                };
                buttons.push(cancelBtn);
                btn.up = "hands_x0_y0_cancel_";
                var cancelDiv = {
                    domTag: "div",
                    domAttribute: {
                        id: "hands_x0_y0_cancel_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'116px',
                        // 'left':'1030px'
                    },
                    children: [
                        {
                            domTag: 'img',
                            domAttribute: {
                                id: 'cancel',
                                "src": img5
                            },
                            cssStyle: {
                                'position': 'absolute',
                                'top': getVip[2].yvalue + 'px',
                                'left': getVip[2].xvalue + 'px',
                                'visibility': 'hidden'
                            }
                        }
                    ]
                };
                var clickDiv = {
                    domTag: 'div',
                    domAttribute: {
                        "id": "hands_x0_y0_oldAlert_",
                    },
                    cssStyle: {
                        'position': 'absolute',
                        // 'top':'464px',
                        // 'left':'505px',
                    },
                    children: [

                        {
                            domTag: "img",
                            domAttribute: {
                                "id": "oldAlert",
                                "src": img3,
                            },
                            cssStyle: {
                                "position": "absolute",
                                "top": getVip[0].yvalue + "px",
                                "left": getVip[0].xvalue + "px",
                            }
                        }
                    ]
                };
                var bgDiv = {
                    domTag: 'img',
                    domAttribute: {
                        "id": "orderTipBg",
                        "src": img1,
                    },
                    cssStyle: {
                        'position': 'absolute',
                        'top': '0px',
                        'left': '0px'
                    }
                };
                initDomObj.push(bgDiv);
                initDomObj.push(cancelDiv);
                initDomObj.push(clickDiv);
                buttons.push(btn);
            };
            buttons.push(btn);
            CT.batchCreateDom(parentDom, initDomObj);
            PAGE.focusInit();
            PAGE.changeFocus("hands_x0_y0_oldAlert_");
            var p = new logCollParam(parseInt((new Date().getTime()) - window.entryTime) / 1000);
            p.focusLocation = curFocus.TempData.recommendTrackName + "total";
            xjDataLog.logCollection(ajax.jsonToString(p));
            // console.log(curFocus.TempData);
        }
    },
    //领取免费一天
    getFreeDay: function () {
        var _this = this;
        var threeOne = basePageInfo.commonPageInfo.recommend_11[2].pageRecommendConfigTabVos;
        interface.getFreeThree(
            {
                params: {
                    userId: xjDataLog.getUserId(),
                },
                ajaxConfig: {
                    async: true,
                }
            },
            function (res) {
                if (res.errorCode == 1000) {
                    CT.$("orderTipBg").src = AjaxConfig.imgUrl + threeOne[1].picLibraryTab.picPath;
                    CT.$("alertShow").src = AjaxConfig.imgUrl + threeOne[0].picLibraryTab.picPath;
                    CT.$("oldAlert").src = AjaxConfig.imgUrl + threeOne[2].picLibraryTab.picPath;
                    PAGE.getFocusModel6("hands_x0_y0_oldAlert_").TempData = basePageInfo.commonPageInfo.recommend_11[2];
                    PAGE.getFocusModel6("hands_x0_y0_oldAlert_").clickHandler = "javascript:location.reload()";
                    // PAGE.getFocusModel6("hands_x0_y0_oldAlert_").TempDate=basePageInfo.commonPageInfo.recommend_11;
                }
            }
        )
    },
    initPageDom: function () {
        var _this = this;
        var data = AjaxConfig.commonPageInfo;
        // 轮播图
        if (data.recommend_7) {
            _this.recommendScroll = data.recommend_7;
        }
        // 第一屏固定五个推荐位
        if (data.recommend_1) {
            _this.recommendFirstScreenFiexd = data.recommend_1;
            _this.firstScreenFiexdRecommend();
        }
        // 排行榜
        if (data.recommend_3) {
            _this.recommendRank = data.recommend_3;
            _this.firstScreenRankRecommend()
        }
        // 视频区域
        if (data.recommend_2) {
            _this.recommendPlayer = data.recommend_2;
            _this.recommendSmallVideoArr = _this.recommendPlayer.slice(2, 7);
            _this.firstScreenVideoRecommend();
        }
        _this.createTheme(function () {
            //创建下拉指示箭头
            document.getElementsByTagName('body')[0].innerHTML += "<img id='downTipImg' style='position:absolute;top:650px;left:50px;' src='" + AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendPic.picPath + "'>"
            // 生成轮播图 recommendDisplayType 9 recommendDisplayValue recommend
            if (_this.autoPlay) {
                _this.autoPlayImg({ whitch: 'firstScreenFiexd' });
            }
            // 小海贝悬浮框
            if (AjaxConfig.commonPageInfo.recommend_10) {
                _this.xhbXFC();
            }
            //页面初始化焦点,实现来哪去哪先取眉头
            _this.alreadyInitFocus = true;
            PAGE.focusInit();
            if (_this.autoPlay) {
                PAGE.getFocusModel6('hands_x0_y0_DMSYKW' + _this.scrollId + '_').TempData = _this.recommendScroll[0]
            }
            var defaultFocus = CT.requestValue("curFocusId") && CT.requestValue("curFocusId").indexOf('hands_x0_y0_') > -1 ? CT.requestValue("curFocusId") : _this.defaultFocus;
            setTimeout(function () {
                PAGE.changeFocus(defaultFocus);
            }, 0)
            //初始化小视频
            _this.videoHidden(0);
            _this.getChanceFunc();
        })

    },
    /**
        * 生成主题选择弹框
        * */
    createTheme: function (callBack) {
        var _this = this;
        //获取主题列表
        // interface.getThemeList({ params: {}, ajaxConfig: { async: false } }, function (res) {
        var res = basePageInfo.selectThemeDetail;
        _this.themeListArr = res || [];
        //可供
        if (_this.themeListArr.length > 4) {
            var tempArr = [];
            for (var i = 0; i < _this.themeListArr.length; i++) {
                tempArr.push(_this.themeListArr[i]);
            }
            _this.themeListArr = tempArr;
        }
        if (!CT.$('themeListAlert')) {
            //创建主题列表div
            var themeListAlert = document.createElement('div');
            themeListAlert.id = 'themeListAlert';
            themeListAlert.style.position = 'absolute';
            themeListAlert.style.left = '0px';
            themeListAlert.style.top = '0px';
            themeListAlert.style.width = '1280px';
            themeListAlert.style.height = '720px';
            themeListAlert.style.background = 'url(./HD/images/translucent.png) no-repeat';
            themeListAlert.style.visibility = 'hidden';
            themeListAlert.style.zIndex = '1';
            //主题轮盘图
            var themeImg = new Image();
            themeImg.id = 'themeImg';
            themeImg.src = AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendLabelpic.picPath;
            themeImg.style.position = 'absolute';
            themeImg.style.left = '0px';
            themeImg.style.top = '280px';
            themeListAlert.appendChild(themeImg);
            //创建主题列表按钮
            // 按钮位置，默认两个按钮时位置
            var listBtnPosArr = [
                { left: 140, top: 295 },
                { left: 140, top: 405 }
            ];
            switch (_this.themeListArr.length) {
                case 3:
                    listBtnPosArr = [
                        { left: 80, top: 250 },
                        { left: 160, top: 355 },
                        { left: 80, top: 460 }
                    ];
                    break;

                case 4:
                    listBtnPosArr = [
                        { left: 60, top: 225 },
                        { left: 140, top: 305 },
                        { left: 140, top: 395 },
                        { left: 60, top: 470 }
                    ];
                    break;
                default:
                    break;
            }
            for (var index = 0; index < _this.themeListArr.length; index++) {
                //主题焦点div
                var themeBtn = document.createElement('div');
                themeBtn.id = "hands_x0_y0_themeBtn" + index + '_';
                themeBtn.style.position = 'absolute';
                themeBtn.style.left = listBtnPosArr[index].left + 'px';
                themeBtn.style.top = listBtnPosArr[index].top + 'px';
                //主题展示图
                var themeBtnShowImg = new Image();
                themeBtnShowImg.id = 'themeBtnImg';
                themeBtnShowImg.style.position = 'absolute';
                try {
                    themeBtnShowImg.src = AjaxConfig.imgUrl + _this.themeListArr[index].themeAttrMap.THEME_COVER_PIC.split(',')[0];
                } catch (error) {

                }
                themeBtn.appendChild(themeBtnShowImg);
                //主题焦点图
                var themeBtnFocusImg = new Image();
                themeBtnFocusImg.id = 'themeBtn' + index;
                themeBtnFocusImg.style.position = 'absolute';
                themeBtnFocusImg.style.visibility = 'hidden';
                try {
                    themeBtnFocusImg.src = AjaxConfig.imgUrl + _this.themeListArr[index].themeAttrMap.THEME_COVER_PIC.split(',')[2];
                } catch (error) {

                }
                themeBtn.appendChild(themeBtnFocusImg);
                themeListAlert.appendChild(themeBtn);
                var btnObj = {
                    id: 'hands_x0_y0_themeBtn' + index + '_',
                    clickHandler: 'javascript:mainNavObj.changeDefaultTheme(' + CT.jsonToString(_this.themeListArr[index]) + ')',
                    up: 'hands_x0_y0_themeBtn' + (index - 1) + '_',
                    down: 'hands_x0_y0_themeBtn' + (index + 1) + '_',
                    //left : 'hands_x0_y0_DMSYGN2_',
                    leftEvent: 'javascript:mainNavObj.hideThemeList()',
                    right: 'disable',
                    focusType: _this.defaultFocusType,
                    TempData: _this.recommendFirstScreenFiexd[i],
                    enFocus: false,
                    curFocusBackEvent: 'javascript:mainNavObj.hideThemeList()'
                }
                if (index == 0) {
                    btnObj.up = 'disable';
                } else if (index == _this.themeListArr.length - 1) {
                    btnObj.down = 'disable';
                }
                buttons.push(btnObj);
            }
            //插入页面
            document.getElementsByTagName('body')[0].appendChild(themeListAlert);
        }
        callBack && callBack();
        // })
    },
    rankBlur: function (i) {
        CT.$('hands_x0_y0_DMSYPH' + i + '_').style.zIndex = 0;
    },
    rankFocus: function (i) {
        CT.$('hands_x0_y0_DMSYPH' + i + '_').style.zIndex = 100;
    },
    /**
     * 创建瀑布流元素
     * */
    loadPBL: function () {
        var _this = this;
        //是否已加载瀑布流图片
        if (_this.alreadyLoadPBLImg) {
            return;
        }
        _this.alreadyLoadPBLImg = true;
        var nowFocusId = '';
        try {
            nowFocusId = curFocus.FocusID
        } catch (error) {

        }
        //各个推荐位的定位
        for (var i = 0, len = _this.pinterestData.length; i < len; i++) {
            try {
                //加载瀑布流图片
                CT.$("DMSYXLP" + i + 'Img').src = CT.$("DMSYXLP" + i + 'Img').getAttribute('imgsrc');
                CT.$("DMSYXLP" + i).src = CT.$("DMSYXLP" + i).getAttribute('imgsrc');
            } catch (error) {

            }
        }
        //document.getElementsByTagName('body')[0].innerHTML += "<img id='downTipImg' style='position:absolute;top:650px;left:50px;' src='" + AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendPic.picPath + "'>"
        if (_this.alreadyInitFocus && nowFocusId) {
            //不是初始化页面
            PAGE.focusInit();
            nowFocusId && PAGE.getFocusModel6(nowFocusId).defaultFocus()
        }
    },
    /**
     * 跑马灯开始
     * */
    runText: function (index) {
        var _this = this;
        var showTitle = curFocus.TempData.recommendDisplayName
        if (showTitle.length > this.wordNums) {
            var len = this.wordNums * 2
            CT.$("title" + index).innerHTML = CT.setMarquee(showTitle, len, 4)
        }
    },
    /**
     * 跑马灯结束
     * */
    stopText: function (index) {
        var _this = this;
        var showTitle = curFocus.TempData.recommendDisplayName
        if (showTitle.length > this.wordNums) {
            var len = this.wordNums
            CT.$("title" + index).innerHTML = (showTitle + "").substring(0, len - 1) + '…';
        }
    },

    /**
     * 轮播图
     * */
    autoPlayImg: function (initObj) {
        var _this = this;
        var initObj = initObj || {};
        var index = 0
        var len = _this.recommendScroll.length // 数据数量
        var dom = CT.$("hands_x0_y0_DMSYKW" + this.scrollId + '_') // 轮播图
        var width = this.recommendScroll[0].recommendLabelpic.picW // 图片宽度
        var w = this.recommendScroll[0].recommendLabelpic.picW.replace('px', '')
        var height = this.recommendScroll[0].recommendLabelpic.picH // 图片高度
        var h = this.recommendScroll[0].recommendLabelpic.picH.replace('px', '')
        var top = height - 40; // 相对于main元素定位
        var left = 0; // 相对于main元素定位
        // 生成小点
        var dots =
            '<div id="dots" style="position: absolute; left: ' + left + 'px; top: ' + parseInt(top) + 'px; width: ' + width + 'px;height: 20px;z-index: 0;padding: 0 ' + (parseInt(w) - (_this.dotW + _this.dotM * 2) * parseInt(len)) / 2 + 'px"></div>'
        if (initObj.whitch == 'firstScreenFiexd') {
            //第一屏轮播小点
            CT.$('hands_x0_y0_DMSYKW' + this.scrollId + '_').innerHTML += dots;
        } else {
            //瀑布流轮播小点
            dom = CT.$("hands_x0_y0_DMSYXLP" + this.scrollId + '_') // 轮播图
            top = dom.style.top.replace('px', '') // 相对于main元素定位
            left = dom.style.left.replace('px', '') // 相对于main元素定位
            var dots =
                '<div id="dots" style="position: absolute; left: ' + left + 'px; top: ' + (parseInt(top) + parseInt(h) - _this.dotPosition) + 'px; width: ' + width + 'px;height: 20px;z-index: 10;padding: 0 ' + (parseInt(w) - (_this.dotW + _this.dotM * 2) * parseInt(len)) / 2 + 'px"></div>'
            CT.$('contentBox' + this.scrollId).innerHTML += dots;
        }
        var dotDoms = ''
        for (var i = 0; i < len; i++) {
            if (i == 0) {
                var dot = '<span id="dot' + i + '" style="float:left;width: ' + _this.dotW + 'px; height: 16px;background-color: rgb(100, 100, 100);border-radius: 50%;line-height: 18px;margin: 0 ' + _this.dotM + 'px;"></span>'
            } else {
                var dot = '<span id="dot' + i + '" style="float:left;width: ' + _this.dotW + 'px; height: 16px;background-color: #fff;border-radius: 50%;line-height: 18px;margin: 0 ' + _this.dotM + 'px;"></span>'
            }

            dotDoms += dot
        }
        document.getElementById('dots').innerHTML += dotDoms;
        var scroll = function () {
            setTimeout(function () {
                try {
                    index == len && (index = 0)
                    var imgDom = CT.$('DMSYKW' + _this.scrollId + 'Img');
                    imgDom.src = AjaxConfig.imgUrl + _this.recommendScroll[index].recommendPic.picPath
                    for (var i = 0; i < len; i++) {
                        CT.$('dot' + i).style.backgroundColor = '#fff'
                    }
                    CT.$('dot' + index).style.backgroundColor = 'rgb(100, 100, 100)'
                    PAGE.getFocusModel6('hands_x0_y0_DMSYKW' + _this.scrollId + '_').TempData = _this.recommendScroll[index]
                    // index++
                    //  已下架内容处理
                    if (_this.recommendScroll[index].booleanUp == 0) {
                        try {
                            CT.$('DMSYKW' + _this.scrollId + '_booleanDown').style.display = "block";
                        } catch (e) { }
                    } else {
                        try {
                            CT.$('DMSYKW' + _this.scrollId + '_booleanDown').style.display = "none";
                        } catch (e) { }
                    }
                    index++
                } catch (error) {

                }
                scroll()
            }, 1500)
        }
        scroll()
    },
    /**
     *  生成第一屏固定推荐位
     * */
    firstScreenFiexdRecommend: function () {
        var _this = this;

        for (var i = 0; i < _this.recommendFirstScreenFiexd.length; i++) {
            var recommendDisplayValue = _this.recommendFirstScreenFiexd[i].recommendDisplayValue;
            if (recommendDisplayValue == 1) { // 判断是否为轮播图
                _this.autoPlay = true;
                _this.scrollId = i + '';
                break;
            }
        }


    },
    /**
     *  生成第一屏视频区域
     * */
    firstScreenVideoRecommend: function () {
        var _this = this;


    },
    /**
     * 排行榜
     * */
    firstScreenRankRecommend: function () {


    },
    /**
     *   生成小海贝悬浮窗
     *
     */
    xhbXFC: function () {
        var _this = this;
        //添加小海贝按钮动画
        var xhbXFCData = AjaxConfig.commonPageInfo.recommend_10;
        var imgUrlArr = [];
        var imgUrl0 = AjaxConfig.imgUrl + xhbXFCData[2].recommendLabelpic.picPath;
        imgUrlArr.push(imgUrl0);
        var imgUrl1 = AjaxConfig.imgUrl + xhbXFCData[2].recommendFocuspic.picPath;
        imgUrlArr.push(imgUrl1);
        //添加首页第一屏向下提示箭头动画
        var downTipData = AjaxConfig.commonPageInfo.recommend_4;
        var imgUrlArr1 = [];
        var imgUrl01 = AjaxConfig.imgUrl + downTipData[0].recommendPic.picPath;
        imgUrlArr1.push(imgUrl01);
        var imgUrl11 = AjaxConfig.imgUrl + downTipData[0].recommendFocuspic.picPath;
        imgUrlArr1.push(imgUrl11);
        var xhbAnimationIndex = 0;
        _this.xhbBtnAnimationTimer = setInterval(function () {
            if (xhbAnimationIndex > 1) {
                xhbAnimationIndex = 0;
            }
            CT.$('DMXHB0').src = imgUrlArr[xhbAnimationIndex];
            //添加首页第一屏向下提示箭头动画
            var xhbFocusBtn = CT.$('downTipImg');
            xhbFocusBtn && (xhbFocusBtn.src = imgUrlArr1[xhbAnimationIndex]);
            xhbAnimationIndex++;
        }, 300);

    },
    /**
     *   小海贝按钮获焦事件
     *   @param more1
     *   @returns {*}
     */
    xhbBtnGetFocus: function () {
        var _this = this;
        if (curFocus.lastFocusId.toUpperCase().indexOf('DMXHB') == -1) {
            _this.XHBLastFocusId = curFocus.lastFocusId;
        }
        _this.hidXhbXFC();
    },
    /**
     *   显示小海贝弹窗
     *   @param more1
     *   @returns {*}
     */
    showXhbXFC: function () {
        var _this = this;
        //隐藏小视频
        _this.videoHidden(-100);
        CT.$('xhbAlertDiv').style.visibility = 'visible';
        PAGE.focusArr["hands_x0_y0_DMXHB2_"].focusmodel.enFocus = true;
        PAGE.focusArr["hands_x0_y0_DMXHB1_"].focusmodel.enFocus = true;
        PAGE.changeFocus('hands_x0_y0_DMXHB2_');
    },
    /**
     *   隐藏小海贝弹窗
     *   @param more1
     *   @returns {*}
     */
    hidXhbXFC: function () {
        var _this = this;
        //是否开启小视频
        _this.videoHidden();
        CT.$('xhbShowImg').style.visibility = 'hidden';
        CT.$('xhbAlertDiv').style.visibility = 'hidden';
        PAGE.focusArr["hands_x0_y0_DMXHB2_"].focusmodel.enFocus = false;
        PAGE.focusArr["hands_x0_y0_DMXHB1_"].focusmodel.enFocus = false;
    },
    /**
     *   隐藏小海贝按钮往右切换焦点
     *   @param more1
     *   @returns {*}
     */
    xhbFocusRight: function () {
        var _this = this;
        CT.$('xhbShowImg').style.visibility = 'visible';
        PAGE.changeFocus(_this.XHBLastFocusId || 'hands_x0_y0_DMSYGN0_');
    },
    /**
     *   取more1数据,并返回一个对象
     *   isShowSelectedImg=true 是否完全显示光标图片，默认false ，特例：小火车车身
     *   isSetZIndex=true  是否设置z-index属性，默认false默认光标在下
     *   isVideo=true 小视频坑位
     *   toTop= true 回到顶部坑位
     *   isShowFont=true显示推荐位的文字描述
     *   @param more1
     *   @returns {*}
     */
    getMore1: function (more1) {
        return more1 ? CT.strToJson(more1) : {};
    },
    /**
     *    设置button
     *    配置光标图片conf.selectBorderImgUrl表示光标可用
     *    配置conf.isShowSelectedImg光标不可用（特例：小火车）
     *    @param conf 序号
     *    @returns {*}
     */
    setBtnObj: function (conf) {
        var _this = this;
        conf = conf || {}
        var btn = null;
        if (conf.selectBorderImgUrl && conf.isShowSelectedImg != 4) {
            btn = {
                id: "hands_x0_y0_DMSYXLP" + (conf.index) + "_",
                focusType: 7,
                clickHandler: 'javascript:page.toJump("bottom",' + (conf.index) + ')',
                otherFocusEvent: "javascript:page.focusEvent(" + (conf.index) + ")",
                otherBlurEvent: "javascript:page.blurEvent(" + (conf.index) + ")",
                TempData: conf.TempData
            }
        } else {
            btn = {
                id: "hands_x0_y0_DMSYXLP" + (conf.index) + "_",
                focusType: 7,
                enFocus: false
            }
        }
        ;
        var moreObj = CT.getMoresObj(conf.TempData.more2);
        if (moreObj.focusType) {
            btn.focusType = parseInt(moreObj.focusType);
            try {
                /*判断为低版本盒子
                if (btn.focusType == 6 && XJEPG.stbType == '1') {
                    btn.focusType = 7;
                    //_this.pinterestData[conf.index].recommendFocuspic && (CT.$('DMSYXLP' + conf.index).imgsrc = AjaxConfig.imgUrl + _this.pinterestData[conf.index].recommendFocuspic.picPath);
                }
                */
            } catch (error) {

            }
        }
        return btn;
    },

    /**
     *  1.开启或关闭视频
     *  2.隐藏或显示小视频位置的补图
     *  @param top 当前光标的top值
     */
    videoHidden: function (top) {
        var _this = this;
        clearTimeout(_this.videoHidden_timer);
        _this.videoHidden_timer = setTimeout(function () {
            var topNum = top || parseInt(CT.$('main').style.top.substring(0, CT.$('main').style.top.length - 2));
            if ((top + "") == '0') {
                topNum = 0;
            }
            if (topNum < 0) {//top > _this.mainShowAreaHight
                //关闭小视频
                CT.show(CT.$('videoImg'));
                loggerInfo('play closeVideo: _this.isOnPlay=' + _this.isOnPlay + '---top:' + topNum);
                if (_this.isOnPlay) {
                    if (videoPlayer.timer !== null) {
                        clearInterval(videoPlayer.timer);
                        videoPlayer.timer = null;
                    }
                    _this.isOnPlay = false;
                    videoPlayer.exitPage();
                    try {
                        videoPlayer.mp = new MediaPlayer();
                    } catch (error) {

                    }
                }
            } else {
                //开启小视频
                if (CT.$("main").style.top == "0px") {
                    CT.hide(CT.$('videoImg'));
                }
                loggerInfo('play startVideo: _this.isOnPlay=' + _this.isOnPlay + '---top:' + topNum);
                if (!_this.isOnPlay) {
                    _this.changeSmallVideo(_this.nowSmallVideoIndex);
                    _this.isOnPlay = true;
                }
            }
        }, 500);
    },



    /**
     *  真正切换小视频播放
     */
    changeSmallVideoToDo: function (i) {
        var _this = this;
        _this.nowSmallVideoIndex = i;
        //改变小视频框绑定数据
        PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData = PAGE.getModelByFocusId("hands_x0_y0_DMSYvideolist" + i + "_").TempData;
        //改变小视频列表按钮播放标识状态
        for (var index = 0; index < _this.recommendSmallVideoArr.length; index++) {
            CT.$('videoListBtnBG' + index).style.visibility = 'hidden';
            CT.$('videoListText' + index).style.width = '130px';
            CT.$('videoListText' + index).style.left = '10px';
            CT.$('videoListText' + index).style.color = 'white';
            CT.$("videoListText" + index).innerHTML = _this.recommendSmallVideoArr[index].recommendDisplayName;
        }
        CT.$('videoListBtnBG' + i).style.visibility = 'visible';
        CT.$('videoListText' + i).style.width = '105px';
        CT.$('videoListText' + i).style.left = '40px';
        CT.$('videoListText' + i).style.color = '#ffeb3b';
        //添加跑马灯
        if (PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData.recommendDisplayName) {
            var showTitle = " " + PAGE.getModelByFocusId("hands_x0_y0_DMSYvideo_").TempData.recommendDisplayName;
        } else {
            var showTitle = CT.$('videoListText' + i).innerHTML;
        }
        CT.$("videoListText" + i).innerHTML = CT.setMarquee(showTitle, 14, 6);
        clearTimeout(_this.playstartTimer);
        _this.playstartTimer = setTimeout(function () {
            if (CT.$('main') && CT.$('main').style.top && CT.$('main').style.top.substring(0, CT.$('main').style.top.length - 2) == '0') {
                //当前展示第一屏
                _this.playSmallVideo();
                _this.nowSmallVideoIndex++;
                if (_this.nowSmallVideoIndex >= _this.recommendSmallVideoArr.length) {
                    _this.nowSmallVideoIndex = 0;
                }
            } else {
                _this.videoHidden(-100);
            }
        }, 600);
    },

    /**
     *  下视频列表按钮获焦事件
     *  重置当前小视频播放计时器
     */
    changeSmallVideo: function (i) {
        var _this = this;
        _this.changeSmallVideoToDo(i);
        //清除轮播播放小视频计时器
        clearInterval(videoPlayer.timer);
        videoPlayer.timer = null;
        videoPlayer.timer = setInterval(function () {
            //停止小视频播放
            _this.changeSmallVideoToDo(_this.nowSmallVideoIndex);
        }, 30000);
    },
    /**
     *  播放小视频
     */
    playSmallVideo: function () {
        var _this = this;
        if (CT.$('main').style.top.split('px')[0] != '0') {
            //不是在第一屏
            return;
        }
        _this.CurCartoonId = _this.recommendSmallVideoArr[_this.nowSmallVideoIndex].recommendDisplayValue;
        //看当前小视频所属卡通列表数据是否存在
        if (_this['smallVideoListInfo' + _this.CurCartoonId]) {
            //改变标记视频播放状态
            _this.isOnPlay = true;
            try {
                var playParams = {
                    top: _this.playObj.t,
                    left: _this.playObj.l,
                    height: _this.playObj.h,
                    width: _this.playObj.w,
                    nns_ids: _this['smallVideoListInfo' + _this.CurCartoonId].data[0].movieDetails[0].playUrl, //合集媒资
                    videoIndex: 0,//当前集数下标
                    //上传小视频播放日志所用信息
                    smallVideoInfo: _this['smallVideoListInfo' + _this.CurCartoonId].data[0]
                };
                videoPlayer.SmallPlay(playParams);
            } catch (e) {
                interface.loggerInfo("播放小视频失败：" + CT.jsonToString(e), 'post')
            }

        } else {
            interface.findVideoListByCartoonId({
                params: { cartoonId: _this.CurCartoonId },
                ajaxConfig: { async: true }
            }, function (res) {
                //改变标记视频播放状态
                _this.isOnPlay = true;
                _this['smallVideoListInfo' + _this.CurCartoonId] = res;
                try {
                    var playParams = {
                        top: _this.playObj.t,
                        left: _this.playObj.l,
                        height: _this.playObj.h,
                        width: _this.playObj.w,
                        nns_ids: res.data[0].movieDetails[0].playUrl, //合集媒资
                        videoIndex: 0,//当前集数下标
                        //上传小视频播放日志所用信息
                        smallVideoInfo: res.data[0]
                    };
                    videoPlayer.SmallPlay(playParams);
                } catch (e) {
                    interface.loggerInfo("播放小视频失败A：" + CT.jsonToString(e), 'post')
                }
            });
        }
    },
    /*
        记录页面数据
        leaveDataObj ：离开页面参数对象
    */
    memoryPageLeaveData: function (leaveDataObj) {
        var _this = this;
        var obj = leaveDataObj || {}
        PAGE.otherPageParam = "&contentId=" + _this.contentId +
            "&contentEName=" + commonPageInfo.pageInfo.commPageEname +
            "&contentName=" + commonPageInfo.pageInfo.commPageEname +
            "&contentCName=" + commonPageInfo.pageInfo.commPageCname +
            "&contentType=" + CT.requestValue("contentType") +
            "&curFocusId=" + (obj.curFocusId || curFocus.FocusID) +
            "&mainTop=" + CT.$("main").style.top;
        CT.goPage();
    },
    /**
     *  跳转
     *  眉头跳转、瀑布流推荐位跳转、"返回到顶部"
     *  如果是瀑布流的跳转先判断产品是否已经下线，下线不跳转
     *  @param type 跳转的类型：bottom瀑布流推荐位跳转、Mid中间眉头跳转、Right右侧眉头跳转
     *  @param num 序号
     */
    toJump: function (type, num) {
        var _this = this;
        /*"返回到顶部"按钮
         */
        if (type == 'alert') {
            CT.toAnterRecommendUrl(curFocus.TempData);
        }
        // if (CT.dataType(num) != 'object' && _this.moer1DataJson[num] && _this.moer1DataJson[num].toTop == 'true') { //返回到顶部
        if (CT.dataType(num) != 'object' && num == _this.pinterestData.length - 1) {
            CT.$("main").style.top = "0px";
            PAGE.changeFocus(_this.defaultFocus);
        } else {
            //已下线产品没有跳转
            if ([0, 1, 2].indexOf(_this.pinterestData[num].recommendDisplayType) > -1 && (type.indexOf("bottom") > -1) && _this.pinterestData[num].booleanUp == 0) {
                //下架弹窗
                CT.undercarriageTip();
                return;
            } else if ([0, 1, 2].indexOf(curFocus.TempData.recommendDisplayType) > -1 && curFocus.TempData && curFocus.TempData.booleanUp == 0) {
                //下架弹窗
                CT.undercarriageTip();
                return;
            }
            //剩下正常的跳转，先记录跳转离开之前的光标
            var leaveDataObj = {
                curFocusId: curFocus.FocusID
            };
            if (type.indexOf('xhbAlert') > -1) {
                //小海贝弹框
                leaveDataObj.curFocusId = _this.XHBLastFocusId;
            }
            //记忆页面离开时的数据
            _this.memoryPageLeaveData(leaveDataObj);
            if (type.indexOf("bottom") > -1) { //瀑布流
                if (_this.scrollId == num || _this.playId == num) {
                    CT.toAnterRecommendUrl(curFocus.TempData);
                } else {
                    CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo, "recommend_5", num);
                }
            } else {
                if (type == 'firstScreenSmallVideo') {
                    if (!curFocus.TempData) {
                        curFocus.TempData = PAGE.getModelByFocusId("hands_x0_y0_DMSYvideolist" + _this.nowSmallVideoIndex + "_").TempData;
                    }
                }
                CT.toAnterRecommendUrl(curFocus.TempData);
            }
        }
    },
    /*
        第一屏元素到瀑布流
    */
    firstSrcDownEvent: function (focusIndex) {
        var _this = this;
        if (focusIndex) {
            //关闭小视频
            try {
                videoPlayer.mp = new MediaPlayer();
            } catch (error) { }
            CT.show(CT.$('videoImg'));
            if (videoPlayer.timer !== null) {
                clearInterval(videoPlayer.timer);
                videoPlayer.timer = null;
            }
            _this.isOnPlay = false;
            videoPlayer.exitPage();
            videoPlayer.exitPage();
        }
        //自动寻找下一焦点
        PAGE.ProximityPrinciple('down');
    },
};
page.init();

//重定义顶部按钮向下事件 参数：keyDirection{触发方向}, keyInfo{生成当前按钮的初始化对象，就是上面的“navInfo”或者默认的配置}, keyIndex{"当前nav按钮Id"}
topNavObj.navBtnArrowEvent = function (keyDirection, keyInfo, keyIndex) {
    var _this = topNavObj;
    var curKeyDateArr = topNavObj.navArr || [];
    //以下代码根据自己页面实际需求，可在自己页面重写
    switch (keyDirection) {
        case 'left':
            //导航栏按钮向左事件
            if (keyIndex > 0) {
                PAGE.changeFocus('hands_x0_y0_' + keyInfo.name + (keyIndex - 1) + '_');
            }
            break;
        case 'right':
            //导航栏按钮向右事件
            if (keyIndex == curKeyDateArr.length - 1) {
                //向右无响应
            } else {
                PAGE.changeFocus("hands_x0_y0_" + keyInfo.name + (keyIndex + 1) + "_");
            }
            break;
        case 'up':
            //导航栏按钮向上事件
            //啥也不做
            break;
        case 'down':
            if (keyIndex == 0) {
                PAGE.changeFocus('hands_x0_y0_DMSYGN0_');
            } else if (keyIndex == 1 || keyIndex == 2) {
                PAGE.changeFocus('hands_x0_y0_DMSYKW0_');
            } else {
                PAGE.changeFocus('hands_x0_y0_DMSYvideo_');
            }
            break;
        default:
            break;
    }
}


/**
 *  返回
 */
function backFunc() {
    // if (CT.$('xhbAlertDiv').style.visibility == 'visible') {
    //     //隐藏小海贝弹框
    //     PAGE.changeFocus("hands_x0_y0_DMXHB0_");
    //     return;
    // }
    // if (CT.$('themeListAlert').style.visibility == 'visible') {
    //     //隐藏主题弹框
    //     mainNavObj.hideThemeList()
    //     return;
    // }
    //推出拦截页
    if (CT.$("oldUserOrderTip").style.visibility == 'visible') {
        // var _this=this;
        page.initPageDom();
        PAGE.changeFocus(page.defaultFocus);
        CT.$("oldUserOrderTip").innerHTML = "";
        CT.$("oldUserOrderTip").style.visibility = 'hidden';
        return
    }
    if (AjaxConfig.commonPageInfo.recommend_8 && AjaxConfig.commonPageInfo.recommend_8[0]) {
        //CT.alertInfo('走配置退出拦截！')
        CT.toAnterRecommendUrl(AjaxConfig.commonPageInfo.recommend_8[0]);
    } else {
        //CT.alertInfo('走自定义退出拦截！')
        CT.commonJumpUrl(AjaxConfig.projectUrl + "commPage?contentId=17");
    }
    //退出平台,添加退出日志
    //CT.exitPlatform();
}

// CT.writeInfo(6)