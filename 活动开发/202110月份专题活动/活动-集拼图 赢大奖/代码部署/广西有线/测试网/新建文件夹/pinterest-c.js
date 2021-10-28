// CT.delCookie("popup");
// orderJs.getAuth({
//     failCallback: function () {

//     }
// });

CT.setCookie('backUrlList', '');
CT.delCookie('backUrlList');
CT.$('main').style.top = '0px'
var commonPageInfo = basePageInfo.commonPageInfo;
//瀑布流组件
var waterfall = {
    // 瀑布流数据
    pinterestData: commonPageInfo.recommend_5,
    // 主要内容显示区域高度
    mainShowAreaHight: 540,
    alreadyLoadPBLImg: false,
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
        var nowFocusId = curFocus.FocusID || "";
        //各个推荐位的定位
        for (var i = 0, len = _this.pinterestData.length; i < len; i++) {
            try {
                //加载瀑布流图片
                CT.$("waterContent" + i + 'Img').src = CT.$("waterContent" + i + 'Img').getAttribute('imgsrc');
                var waterSrc = CT.$("waterContent" + i).getAttribute('imgsrc');
                if (waterSrc) {
                    CT.$("waterContent" + i).src = waterSrc;
                }
            } catch (error) {
                console.log(error)
            }
        }
        //document.getElementsByTagName('body')[0].innerHTML += "<img id='downTipImg' style='position:absolute;top:650px;left:50px;' src='" + AjaxConfig.imgUrl + AjaxConfig.commonPageInfo.recommend_4[0].recommendPic.picPath + "'>"
        if (page.alreadyInitFocus && nowFocusId) {
            //不是初始化页面
            PAGE.focusInit();
            nowFocusId && PAGE.getFocusModel6(nowFocusId).defaultFocus()
        }
    },
    /**
     *  移动选中光标
     *  _this.mainShowAreaHight : 560
     *  特殊需求:当瀑布流推荐位向上选中眉头时，要根据当前所属页面选择对应的眉头
     *  先判断是否需要翻页，如果小于560时---不需要翻页：CT.$("main").style.top =  "0px";
     *                      如果大于560时---需要翻页
     *  如果大于560时，再判断总高度减去当前高度是否大于560，即是否存在完整的下一页， 如果小于等于560--- _this.isLoaded = true;
     *                                                                               如果大于560--- _this.isLoaded = false;
     *  特殊位置的处理：加载完成之后，需要判断是否存在_this.mainTop，如果存在CT.$("main").style.top = _this.mainTop;实现来哪去哪
     *  移动光标的同时要判断是否需要关闭或播放小视频
     *  移动光标的同时要判断是否滚动文字
     *  @param num 序号
     */
    focusEvent: function (num) {
        var _this = this;
        if (num != '0') {
            //关闭小视频
            page.videoHidden(-9999);
        }
        //特殊需求：底部推荐向上选中当前内容的眉头
        // if ((curFocus.lastFocusId.indexOf("waterContent") > -1) && (curFocus.FocusID.indexOf("topNavFocus") > -1)) {
        //     PAGE.changeFocus("hands_x0_y0_navMidFocus" + navBarObj.showNavSelectedId + "_");
        //     return;
        // }
        var mainDom = CT.$("main");
        var downTipDom = CT.$("downTipImg");
        //获取当前焦点的信息
        var curClassDomInfo = CT.getCurClassObjInfo(CT.$(curFocus.FocusID));
        //移动盒子main
        if (curClassDomInfo.top >= _this.mainShowAreaHight) {
            //加载瀑布流图片
            _this.loadPBL();
            if (page.parentBoxHeight - curClassDomInfo.top >= _this.mainShowAreaHight) {
                mainDom.style.top = -(curClassDomInfo.top - 300) + "px"; //_this.defaultTop
            } else {
                if (page.mainTop) { //实现特殊位置的来哪去哪
                    mainDom.style.top = page.mainTop;
                } else {
                    //如果当前dom 高度
                    if (page.getMore1(curFocus.TempData.recommendDisplayValue).toTop == "true") {
                        mainDom.style.top = -(curFocus.Y_Posi - page.defaultHeight + 22) + "px";
                    } else {
                        mainDom.style.top = -(curClassDomInfo.top - 300) + "px";
                    }
                }
            }
            //隐藏首页第一屏下提示箭头
            downTipDom && (downTipDom.style.visibility = "hidden");
        } else {
            //展示首页第一屏
            mainDom.style.top = "0px";
            //显示首页第一屏下提示箭头
            downTipDom && (downTipDom.style.visibility = "visible");
        }
        page.mainTop = 0;
        //是否滚动文字
        if (CT.$("waterContentFont" + num).innerHTML.length > 10 && CT.$("waterContentFont" + num).style.visibility == "visible") {
            CT.addClass(CT.$("waterContentFont" + num), 'marquee_self');
        }
        //小视频的播放或隐藏
        page.videoHidden(Number(mainDom.style.top.substring(0, mainDom.style.top.length - 2)));
    },
    /**
     *  离开光标
     *  离开光标的同时要关闭滚动文字
     *  @param num 序号
     */
    blurEvent: function (num) {
        CT.removeClass(CT.$("waterContentFont" + num), 'marquee_self');
    },
}
var page = {
    // 是否显示到期提醒弹框
    showPayDialog: undefined,
    //页面是否已完成注册焦点
    alreadyInitFocus: false,
    //页面id
    contentId: commonPageInfo.pageInfo.commonPageId || 1,
    //瀑布流数据
    pinterestData: waterfall.pinterestData,
    //main的top值
    parentBoxHeight: 0,
    //比较当前行的数组,如果当前行填满则清空数组
    comPareArray: [{ curRowNum: 0, h: 720 }],
    //当前比较数组下标
    comPareArrayIndex: 0,
    //小海贝悬浮框跳转数据数组
    XHBJumpDataArr: [],
    //默认初始Left值
    defaultFocus: "hands_x0_y0_mainVideo_",
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
    //所有推荐位的more1 数据
    moer1DataJson: [],
    //main当前的top值，只用于首页离开后再返回到首页使用，实现来哪去哪
    mainTop: CT.requestValue("mainTop") || 0,
    // 第一屏固定推荐数据
    recommendFirstScreenFiexd: [],
    //小视频数据
    recommendSmallVideoArr: [],
    //当前播放哪个小视频
    nowSmallVideoIndex: 0,
    //当前播放小视频所属的卡通
    CurCartoonId: null,
    //小海贝悬浮框小人焦点的上一个焦点
    XHBLastFocusId: null,
    //小海贝动画计时器
    xhbBtnAnimationTimer: null,
    //主题列表数组
    themeListArr: [],
    /** ************************ 功能性推荐位 1-轮播，2-排行，3-小视频，4-火车头 *****************************/
    recommendScroll: [], // 轮播图数据
    scrollId: basePageInfo.scrollId || 9999, // 轮播图所在推荐位
    rankId: 9999, // 排行榜所在推荐位
    playId: 9999, // 小视频所在推荐位
    //trainId: 9999,                         // 小火车所在推荐位
    dotPosition: -155, // 调整轮播图小圆点位置,
    dotW: 16, // 轮播图小圆点宽
    dotM: 10, // 轮播图小圆点间隙
    rankList: false, // 是否生成排行榜
    isPlay: false, // 是否生成小视频
    isTrain: false, // 是否生成小火车
    wordNums: 0, // 排行榜所能容纳字数
    isOnPlay: false, // 判断是否播放
    playObj: { // 小视频尺寸
        t: 238,
        l: 420,
        w: 400,
        h: 220
    },
    isLimitSTB: basePageInfo.reqQuery.STBtype === "29",
    autoPlay: true,
    isRenderWater: false,
    /**
     *  请求二维码订购用户到期提醒接口,判断是否显示提醒用户是否续买
     *  query参数 stbid
     */
    getPayDialog: function () {
        var _this = this
        // 机顶盒号
        var stbid = xjDataLog.getStbId();
        // 调用请求是否显示续费弹框接口
        interface.findPayBoolean({
            params: { stbid: stbid },
            ajaxConfig: { async: true }
        }, function (res) {
            //提醒续费弹框显示
            _this.showPayDialog = res.data;
            // showPayDialog为true显示弹框
            if (_this.showPayDialog=='near') {
            // if(true){
                _this.showPayDia();
            }else {
                // console.log('expired');
                _this.videoHidden(0);
            }
        });
    },
    /**
    * 显示续费提醒弹框
    */
    showPayDia: function () {
      var _this = this;
      CT.show(CT.$('dialogWindow'));
      _this.createDomAndBtn();
    },
    /*
        创建续费弹框dom和btn
    */
    createDomAndBtn: function () {
      var _this = this;
      // 背景图
      var bgSrc = AjaxConfig.imgUrl+basePageInfo.commonPageInfo.recommend_14[0].recommendPic.picPath 
      // 确定按钮
      var sureSrc = AjaxConfig.imgUrl+basePageInfo.commonPageInfo.recommend_14[1].pageRecommendConfigTabVos[0].picLibraryTab.picPath
      var checkedSureSrc = AjaxConfig.imgUrl+basePageInfo.commonPageInfo.recommend_14[1].pageRecommendConfigTabVos[1].picLibraryTab.picPath
      // 取消按钮
      var backSrc = AjaxConfig.imgUrl+basePageInfo.commonPageInfo.recommend_14[2].pageRecommendConfigTabVos[0].picLibraryTab.picPath
      var backSureSrc = AjaxConfig.imgUrl+basePageInfo.commonPageInfo.recommend_14[2].pageRecommendConfigTabVos[1].picLibraryTab.picPath
      // 埋点
      var sureTrack = basePageInfo.commonPageInfo.recommend_14[1]
      var backTrack = basePageInfo.commonPageInfo.recommend_14[2]
      // 创建弹框元素
      var createDomArr = [];
          var createDomObj = {
              domTag : 'div',
              domAttribute : {
                  'id' : "wrapper",
                  'zIndex' : 999999,
              },
              children: [
                  // 弹框图片
                  {
                      domTag : 'img',//img等等
                      domAttribute : {
                          'id' : 'bgimg',
                          // src 为运营配置的图片
                          // 'src':'./HD/web/mainPage/image/closeDate.jpg'
                          'src':bgSrc
                      }
                  },
                  // 弹框图片上的确定按钮
                  {
                    domTag : 'div',
                    domAttribute : {
                        'id' : "hands_x0_y0_dialogBtn1_",
                    },
                    children:[
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'uncheckImg1',
                                // 'src':'./HD/web/mainPage/image/sure.png',
                                'src' : sureSrc
                            }
                        }, 
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'dialogBtn1',
                                // 'src':'./HD/web/mainPage/image/checkedSure.png',
                                'src' : checkedSureSrc
                            }
                        }, 
                      ]
                  },
                  // 弹框图片上的取消按钮
                  {
                    domTag : 'div',
                    domAttribute : {
                        'id' : "hands_x0_y0_dialogBtn2_",
                    },
                    children:[
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'uncheckImg2',
                                // 'src':'./HD/web/mainPage/image/back.png',
                                'src' : backSrc
                            }
                        },
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'dialogBtn2',
                                // 'src':'./HD/web/mainPage/image/checkedBack.png',
                                'src' : backSureSrc
                            }
                        }, 
                      ]
                  }
              ]
          };
          // 要创建的元素放到数组里
          createDomArr.push(createDomObj);
          // 定义确定按钮
          var leftBtn = {
            id: "hands_x0_y0_dialogBtn1_",
            clickHandler: 'javascript:page.goOrder()',
            left: "disable",
            up:'disable',
            down:'disable',
            right: "hands_x0_y0_dialogBtn2_",
            focusType: 7,
            TempData: sureTrack,
        }
        // 定义取消按钮
        var rightBtn = {
          id: "hands_x0_y0_dialogBtn2_",
          clickHandler: 'javascript:page.goBack()',
          left: "hands_x0_y0_dialogBtn1_",
          right: "disable",
          up:'disable',
          down:'disable',
          focusType: 7,
          TempData: backTrack,
      }
          buttons.push(leftBtn,rightBtn);
      // 创建元素
      CT.batchCreateDom(CT.$("dialogWindow"), createDomArr);
      // 初始化焦点 
      PAGE.focusInit();
      PAGE.changeFocus('hands_x0_y0_dialogBtn1_')
  },
  /** 
     * 返回首页
     */
  goBack:function(){
    var _this = this
    // CT.$('mainVideo').visibility = 'visibility'
    CT.$("dialogWindow").style.visibility = "hidden";
    CT.$("dialogBtn1").style.visibility = "hidden";
    CT.$("dialogBtn2").style.visibility = "hidden";
    // 初始化小视频
    _this.videoHidden(0);
    if(page.defaultFocus && curFocus.FocusID != page.defaultFocus){
        PAGE.changeFocus(page.defaultFocus);
    }
  },
  /**
     * 去往订购页  
     */
   goOrder:function(){
        // 直接跳订购，且埋入cookie标识已订购用户可以继续跳订购
        CT.setCookie("canRepeatOrder", "yes");
        orderJs.toOrderPage();
   },
    /**
     * 初始化页面，请求到页面需要的所有数据
     */
    init: function (_param) {
        var _this = this;
        interface.loggerInfo("盒子型号："+xjDataLog.getSTBType(),'post');
       //======未订购老用户弹窗(一天一次)
       var _date = (_param && _param["dateTime"] && _param["dateTime"]["date"]) || new Date().getDate();

    //    // 模拟测试特定用户开放每日一次弹框
    //    CT.delCookie("_viPop");

       var _pop = CT.getCookie("_viPop");
       interface.loggerInfo("stbType:"+xjDataLog.stbTypeNum,'post');
       //获取当前天
    //    if(!_this.isLimitSTB && (!_pop || isNaN(parseInt(_pop)) || parseInt(_pop) != _date)) {
       if(!_pop || isNaN(parseInt(_pop)) || parseInt(_pop) != _date) {
        // if(true) {
            CT.setCookie("_viPop",_date);
            ajax.init({
                url:AjaxConfig.interfaceUrl +  "getCache",
                method: "get",
                params: { key: xjDataLog.getUserId() },//{"PROGID" : VODID,'PLAYTYPE':"1"},//_this.resolveMediaCode(mediacode)
                async: false,
                ContentType: "json",
                success: function (data) {
                    // // 模拟测试特定用户开放每日一次弹框
                    // if(xjDataLog.getStbId() == '44560063824'){
                    //     data.data = 1;
                    // }

                    //判断是否是同一天，不是，鉴权弹窗，是不弹窗
                    if(!data || !data.data || parseInt(data.data) < _date){
                        interface.findUserDetailByUserId({
                            userId: xjDataLog.getUserId()
                        },function(_res){
                            var showPop = false;
                            if(!_res || !_res.data || !_res.data.createTime ){
                                showPop = true;
                            }
                            if(!showPop) {
                                var dates = _res.data.createTime.split(" ")[0].split("-");
                                if(dates < 3) {
                                    showPop = true;
                                } else {
                                    var _year = (_param && _param["dateTime"] && _param["dateTime"]["year"]) || new Date().getFullYear();
                                    var _month = (_param && _param["dateTime"] && _param["dateTime"]["month"]) || new Date().getMonth() + 1;
                                    showPop = dates[0] < _year ||  dates[1] < _month || dates[2] < _date;
                                }
                            }
                            if(showPop) {
                                // 鉴权确认是未订购用户才弹窗
                                orderJs.getAuth({
                                    callback:function(){
                                        //鉴权成功弹领取权益弹窗或者直接初始化内容
                                        _this.orderAlert();
                                        // var _flag = _this.showUserOrderPop(commonPageInfo.recommend_16);
                                    },
                                    failCallback: function(){
                                        var _flag = _this.showUserOrderPop(commonPageInfo.recommend_16);
                                    }
                                }) ;
                            }
                        });
                    } else {
                        // var _flag = _this.showUserOrderPop(commonPageInfo.recommend_16);
                        
                        // var _flag = _this.orderAlert();
                        _this.trueInit();
                    }
                    ajax.init({
                        url: AjaxConfig.interfaceUrl +  "saveCache",
                        method: "get",
                        params: { key: xjDataLog.getUserId(),value:_date,expireTime: 24*60*60 },//{"PROGID" : VODID,'PLAYTYPE':"1"},//_this.resolveMediaCode(mediacode)
                        async: true,
                        ContentType: "json",
                        success: function (data) {
                        }
                    });
                }
            });
       } else {
                // var _flag = _this.showUserOrderPop(commonPageInfo.recommend_16);
                // if(xjDataLog.getStbId()=='34410002029'||xjDataLog.getStbId()=='34290245890'||xjDataLog.getStbId()=='44560257080'||xjDataLog.getStbId()=='34290024617'||xjDataLog.getStbId()=='34410002107'){
                //     var _flag = _this.showUserOrderPop(commonPageInfo.recommend_16);

                // }else{
                //     var _flag = _this.orderAlert();
                // }
                _this.trueInit();
       };
    },
    trueInit: function (){
        var _this = this;
        // 删除标识可重复订购的cookie
        CT.setCookie("canRepeatOrder", "");
        CT.delCookie("canRepeatOrder");
        // 二维码续费弹框是否显示
        _this.getPayDialog();
        // 启动自动寻找焦点
        AjaxConfig.isAutoFindFocus = true;
        // 订购图标
        var orderData = _this.isLimitSTB ? commonPageInfo.recommend_15 : commonPageInfo.recommend_11;
        if (orderData) {
            _this.createOrderRec(orderData);
        }
        if (_this.isLimitSTB) {
            _this.defaultFocus = "hands_x0_y0_videoAreaDom_";
            setTimeout(function () {
                _this.renderMoreCotent(commonPageInfo);
                // interface.updateExtraUserInfo({
                //     params: {userId: xjDataLog.getUserId(), themeId: 6},
                //     ajaxConfig: {async: true}
                // }, function (res) {
                //     // //清除node端主题缓存
                //     // var clearData = {
                //     //     //必传参数，清除缓存的关键字
                //     //     keyWord: 'updateExtraUserInfo',
                //     // }
                //     // interface.clearNodeCache(clearData);
                // });
            }, 2000)
        } else {
            _this.renderMoreCotent(commonPageInfo);
        }
       
    },
    //加载新盒子内容
    renderMoreCotent: function (data) {
        var _this = this;
        // 第一屏固定五个推荐位
        _this.recommendFirstScreenFiexd = data.recommend_1;
        if (_this.isLimitSTB) {
            if (data.recommend_13) {
                _this.recommendFirstScreenFiexd = data.recommend_13;
            }
        }
        _this.firstScreenFiexdRecommend();
        // 排行榜
        if (data.recommend_3) {
            _this.recommendRank = data.recommend_3;
            _this.firstScreenRankRecommend();
        }
        // 轮播图
        _this.recommendScroll = _this.isLimitSTB ? data.recommend_12 : data.recommend_7;
        // 视频区域
        if (data.recommend_2) {
            _this.recommendPlayer = data.recommend_2;
            _this.recommendSmallVideoArr = _this.recommendPlayer.slice(2, 7);
            _this.firstScreenVideoRecommend();
        }
        // 小海贝悬浮框
        if (data.recommend_10) {
            _this.createXHB(data.recommend_10);
        }
        // 创建主题切换功能,初始化焦点
        _this.createTheme(function () {
            //页面初始化焦点,实现来哪去哪先取眉头
            _this.alreadyInitFocus = true;
            PAGE.focusInit();
            if (_this.autoPlay) {
                // 生成轮播图 recommendDisplayType 9 recommendDisplayValue recommend
                _this.autoPlayImg({ whitch: 'firstScreenFiexd' });
                var scroll0Dom = 'hands_x0_y0_mainContent' + _this.scrollId + '_';
                if (_this.isLimitSTB) {
                    scroll0Dom = "hands_x0_y0_videoAreaDom_";
                }
                PAGE.getFocusModel6(scroll0Dom).TempData = _this.recommendScroll[0];
            }
            var curFocusId = CT.requestValue("curFocusId");
            //interface.loggerInfo(xjDataLog.getStbId()+":render1:");
            if (curFocusId) {
                if (curFocusId.indexOf("waterContent") === -1) {
                    PAGE.changeFocus(curFocusId);
                } else {
                    if (_this.isLimitSTB) {
                        PAGE.changeFocus(CT.$(curFocusId) ? curFocusId : _this.defaultFocus);
                    } else {
                        _this.toWaterContent(curFocusId);
                    }
                }
            } else {
                PAGE.changeFocus(_this.defaultFocus);
            }
            //interface.loggerInfo(xjDataLog.getStbId()+":render2:");
            //随机展示小海贝弹框IP
            if (!_this.isLimitSTB) {
                _this.xhbAlertRandomShow();
                //初始化小视频
                if (CT.$("main").style.top === "0px" && CT.$("dialogWindow").style.visibility == 'visible') {
                    _this.videoHidden(0);
                }
                CT.changeTheme(commonPageInfo, 1);
            }
            //interface.loggerInfo(xjDataLog.getStbId()+":render3:");
            //创建下拉指示箭头
            var downImg = document.createElement("img");
            downImg.style.cssText = "position:absolute;top:650px;left:50px;";
            downImg.id = 'downTipImg';
            downImg.src = AjaxConfig.imgUrl + commonPageInfo.recommend_4[0].recommendPic.picPath;
            document.body.appendChild(downImg);
            //interface.loggerInfo(xjDataLog.getStbId()+":render4:");
            //鉴权
            // orderJs.getAuth({
            //     failCallback: function () {
            //interface.loggerInfo(xjDataLog.getStbId()+":render5:");
            try {
                var navLen = commonPageInfo.pageInfo.commonPageInfo.recommend_2.length - 1;
                var navBarVIPShowImgId = "topNavFocus" + navLen + "Img";
                var navBarVIPBtnId = "hands_x0_y0_topNavFocus" + navLen + "_";
                CT.$(navBarVIPShowImgId).style.visibility = 'visible';
                PAGE.getModelByFocusId(navBarVIPBtnId).enFocus = true;
                PAGE.getButtonById(navBarVIPBtnId).enFocus = true;
                //interface.loggerInfo(xjDataLog.getStbId()+":render6:");
            } catch (error) {
                //interface.loggerInfo(xjDataLog.getStbId()+":render7:");
            }
            //     }
            // });  
        })
    },
    /**
     * 未订购老用户弹窗以及未订购高活免费送一天续订弹窗
     */
    showUserOrderPop : function(recData){
        var _this = this;
        //延迟订购弹窗优先级高于老用户以及活跃弹窗
        /**
             * 先判断用户是否只领取的五天免费没有订购
             * DelayEmpty 用户没有延时订购信息
                CancelDelayed 用户取消自动续订订购，且已弹窗
                CancelDelay用户取消自动续订，可弹窗
                UserDelay 用户为同意自动续订的，需查询续订状态
             */
        interface.getCancel(function (res) {
            // // 模拟测试特定用户开放每日一次弹框
            // if(xjDataLog.getStbId() == '44560063824'){
            //     try {
            //         interface.loggerInfo('getCancel return: ' + CT.jsonToString(res), 'post');
            //     } catch (error) {
            //         interface.loggerInfo('getCancel return: error.', 'post');
            //     }
            //     res.data='DelayEmpty';
            // }

            if (res.data == 'DelayEmpty') {
                interface.judgeUserType(function(jres){
                    //查询活跃状态-高活，延时订购，低活老用户
                    // if(xjDataLog.getStbId()=='34290024617'||xjDataLog.getStbId()=='34410002107'||xjDataLog.getStbId()=='34410002029'||xjDataLog.getStbId()=='44560257080'||xjDataLog.getStbId()=='34410002063'||xjDataLog.getStbId()=='34290245890'||xjDataLog.getStbId()=='sn00000'){
                    //     jres.data=1;
                    // }
                    // interface.loggerInfo("请求高活结果"+CT.jsonToString(res),'post');
                    if(jres.errorCode==1000){
                        //1高活
                        if(jres.data==1){
                            if(basePageInfo.commonPageInfo.recommend_18){
                                //已经做了一天弹一次，只用存当前弹第几天以及判断
                                // actiActivityId=21;
                                // CT.setCookie("activityId",21)
                                // interface.loggerInfo("判断第几天前")
                                actiObj.getUserDataList(function(gres){
                                    var userActiData=null;
                                    if(gres.errorCode==1007){
                                        userActiData=1;
                                    }else{
                                        userActiData=gres.data.userActiData;
                                    };
                                    // userActiData=1;
                                    interface.loggerInfo("判断第几天结果"+CT.jsonToString(gres),'post');
                                    if(userActiData<4){
                                        //如果小于3可以弹窗-大于弹老用户
                                        interface.loggerInfo("已执行");
                                        var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[0].picLibraryTab.picPath;
                                        // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                        //     img1 = imgUrlPre + 'orderBG.png';
                                        // }
                                        //选中
                                        var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].picLibraryTab.picPath;
                                        //退出
                                        var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].picLibraryTab.picPath;
                                        var btn = {
                                            id: "hands_x0_y0_oldUserOrder_",
                                            down: "disable",
                                            right: "hands_x0_y0_cancel_",
                                            up: "disable",
                                            left: "disable",
                                            clickHandler: 'javascript:page.freePay()',
                                            TempData:basePageInfo.commonPageInfo.recommend_18[0],
                                            focusType: 7,
                                        }
                                        // if (recData && recData[0]) {
                                        //     btn.TempData = recData[0];
                                        //     if (recData[0].recommendPic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                        //     }
                                        //     if (recData[0].recommendLabelpic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                        //     }
                                        //     if (recData[0].recommendFocuspic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                        //     }
                                        // }
                                        buttons.push(btn);
                                        buttons.push({
                                            id:'hands_x0_y0_cancel_',
                                            left:'hands_x0_y0_oldUserOrder_',
                                            up:'disable',
                                            down:'disable',
                                            right:'disable',
                                            clickHandler:'javascript:backFunc()',
                                            focusType:7,
                                        })
                                        // 批量递归创建元素
                                        var parentDom = CT.$("oldUserOrderTip");
                                        parentDom.style.visibility = "visible";
                                        var initDomObj = [
                                            {
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'orderTipBG',
                                                    'src' : img1,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                },
                                            },{
                                                domTag : 'div',//img等等
                                                domAttribute : {
                                                    'id' : 'hands_x0_y0_oldUserOrder_',
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                    'left' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                },
                                                children: [{
                                                        domTag : 'img',//img等等
                                                        domAttribute : {
                                                            'id' : 'oldUserOrder',
                                                            'src' : img2,
                                                        },
                                                        cssStyle : {
                                                            'position' : "absolute",
                                                            'top' : '0px',
                                                            "left": "0px",
                                                        },
                                                    }
                                                ]
                                            },{
                                                domTag : 'div',//img等等
                                                domAttribute : {
                                                    'id' : 'hands_x0_y0_cancel_',
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                    'left' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                },
                                                children: [{
                                                        domTag : 'img',//img等等
                                                        domAttribute : {
                                                            'id' : 'cancel',
                                                            'src' : img3,
                                                        },
                                                        cssStyle : {
                                                            'position' : "absolute",
                                                            'top' : '0px',
                                                            "left": "0px",
                                                            'visibility':'hidden'
                                                        },
                                                    }
                                                ]
                                            },{
                                                domTag:'div',
                                                domAttribute:{
                                                    'id':'countdown',
                                                },
                                            }
                                        ]
                                        CT.batchCreateDom(parentDom,initDomObj);
                                        PAGE.focusInit();
                                        PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                        // actiActivityId=21;
                                        actiObj.setUserDataList((Number(userActiData)+1),function(res){
                                            // console.log(res);
                                        });
                                        CT.$('countdown').innerHTML=_this.downTime;
                                        _this.downTimer=setInterval(function(){
                                            _this.downTime=(_this.downTime-1);
                                            CT.$('countdown').innerHTML=_this.downTime;
                                            if(_this.downTime<=0){
                                                console.log("订购");
                                                _this.freePay();
                                                clearInterval(_this.downTimer);
                                            }
                                        },1000);
                                    }else{
                                        if(basePageInfo.commonPageInfo.recommend_17){
                                            var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                            // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                            //     img1 = imgUrlPre + 'orderBG.png';
                                            // }
                                            //选中
                                            var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                            //退出
                                            var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                            var btn = {
                                                id: "hands_x0_y0_oldUserOrder_",
                                                down: "disable",
                                                up: "hands_x0_y0_cancel_",
                                                left: "disable",
                                                right: "disable",
                                                clickHandler: 'javascript:page.toJump("alert")',
                                                TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                                focusType: 7,
                                            }
                                            // if (recData && recData[0]) {
                                            //     btn.TempData = recData[0];
                                            //     if (recData[0].recommendPic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                            //     }
                                            //     if (recData[0].recommendLabelpic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                            //     }
                                            //     if (recData[0].recommendFocuspic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                            //     }
                                            // }
                                            buttons.push(btn);
                                            buttons.push({
                                                id:'hands_x0_y0_cancel_',
                                                down:'hands_x0_y0_oldUserOrder_',
                                                up:'disable',
                                                left:'disable',
                                                right:'disable',
                                                clickHandler:'javascript:backFunc()',
                                                focusType:7,
                                            })
                                            // 批量递归创建元素
                                            var parentDom = CT.$("oldUserOrderTip");
                                            parentDom.style.visibility = "visible";
                                            var initDomObj = [
                                                {
                                                    domTag : 'img',//img等等
                                                    domAttribute : {
                                                        'id' : 'orderTipBG',
                                                        'src' : img1,
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : '0px',
                                                        "left": "0px",
                                                    },
                                                },{
                                                    domTag : 'div',//img等等
                                                    domAttribute : {
                                                        'id' : 'hands_x0_y0_oldUserOrder_',
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                    },
                                                    children: [{
                                                            domTag : 'img',//img等等
                                                            domAttribute : {
                                                                'id' : 'oldUserOrder',
                                                                'src' : img2,
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : '0px',
                                                                "left": "0px",
                                                            },
                                                        }
                                                    ]
                                                },{
                                                    domTag : 'div',//img等等
                                                    domAttribute : {
                                                        'id' : 'hands_x0_y0_cancel_',
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                    },
                                                    children: [{
                                                            domTag : 'img',//img等等
                                                            domAttribute : {
                                                                'id' : 'cancel',
                                                                'src' : img3,
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : '0px',
                                                                "left": "0px",
                                                                'visibility':'hidden'
                                                            },
                                                        }
                                                    ]
                                                }
                                            ];
                                            CT.batchCreateDom(parentDom,initDomObj);
                                            PAGE.focusInit();
                                            PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                        }else{
                                            _this.trueInit();
                                        }
                                    }
                                });
                            }else{
                                _this.trueInit();
                            }
                        }else{
                            if(basePageInfo.commonPageInfo.recommend_17){
                                var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                //     img1 = imgUrlPre + 'orderBG.png';
                                // }
                                //选中
                                var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                //退出
                                var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                var btn = {
                                    id: "hands_x0_y0_oldUserOrder_",
                                    down: "disable",
                                    up: "hands_x0_y0_cancel_",
                                    left: "disable",
                                    right: "disable",
                                    clickHandler: 'javascript:page.goOrder()',
                                    TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                    focusType: 7,
                                }
                                // if (recData && recData[0]) {
                                //     btn.TempData = recData[0];
                                //     if (recData[0].recommendPic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                //     }
                                //     if (recData[0].recommendLabelpic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                //     }
                                //     if (recData[0].recommendFocuspic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                //     }
                                // }
                                buttons.push(btn);
                                buttons.push({
                                    id:'hands_x0_y0_cancel_',
                                    down:'hands_x0_y0_oldUserOrder_',
                                    up:'disable',
                                    left:'disable',
                                    right:'disable',
                                    clickHandler:'javascript:backFunc()',
                                    focusType:7,
                                })
                                // 批量递归创建元素
                                var parentDom = CT.$("oldUserOrderTip");
                                parentDom.style.visibility = "visible";
                                var initDomObj = [
                                    {
                                        domTag : 'img',//img等等
                                        domAttribute : {
                                            'id' : 'orderTipBG',
                                            'src' : img1,
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : '0px',
                                            "left": "0px",
                                        },
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_oldUserOrder_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'oldUserOrder',
                                                    'src' : img2,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                },
                                            }
                                        ]
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_cancel_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'cancel',
                                                    'src' : img3,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                    'visibility':'hidden'
                                                },
                                            }
                                        ]
                                    }
                                ]
                                CT.batchCreateDom(parentDom,initDomObj);
                                PAGE.focusInit();
                                PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                            }  else{
                                _this.trueInit();
                            }
                        }
                    }else{
                        if(basePageInfo.commonPageInfo.recommend_17){
                            var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                            // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                            //     img1 = imgUrlPre + 'orderBG.png';
                            // }
                            //选中
                            var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                            //退出
                            var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                            var btn = {
                                id: "hands_x0_y0_oldUserOrder_",
                                down: "disable",
                                up: "hands_x0_y0_cancel_",
                                left: "disable",
                                right: "disable",
                                clickHandler: 'javascript:page.goOrder()',
                                TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                focusType: 7,
                            }
                            // if (recData && recData[0]) {
                            //     btn.TempData = recData[0];
                            //     if (recData[0].recommendPic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                            //     }
                            //     if (recData[0].recommendLabelpic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                            //     }
                            //     if (recData[0].recommendFocuspic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                            //     }
                            // }
                            buttons.push(btn);
                            buttons.push({
                                id:'hands_x0_y0_cancel_',
                                down:'hands_x0_y0_oldUserOrder_',
                                up:'disable',
                                left:'disable',
                                right:'disable',
                                clickHandler:'javascript:backFunc()',
                                focusType:7,
                            })
                            // 批量递归创建元素
                            var parentDom = CT.$("oldUserOrderTip");
                            parentDom.style.visibility = "visible";
                            var initDomObj = [
                                {
                                    domTag : 'img',//img等等
                                    domAttribute : {
                                        'id' : 'orderTipBG',
                                        'src' : img1,
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : '0px',
                                        "left": "0px",
                                    },
                                },{
                                    domTag : 'div',//img等等
                                    domAttribute : {
                                        'id' : 'hands_x0_y0_oldUserOrder_',
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                    },
                                    children: [{
                                            domTag : 'img',//img等等
                                            domAttribute : {
                                                'id' : 'oldUserOrder',
                                                'src' : img2,
                                            },
                                            cssStyle : {
                                                'position' : "absolute",
                                                'top' : '0px',
                                                "left": "0px",
                                            },
                                        }
                                    ]
                                },{
                                    domTag : 'div',//img等等
                                    domAttribute : {
                                        'id' : 'hands_x0_y0_cancel_',
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                    },
                                    children: [{
                                            domTag : 'img',//img等等
                                            domAttribute : {
                                                'id' : 'cancel',
                                                'src' : img3,
                                            },
                                            cssStyle : {
                                                'position' : "absolute",
                                                'top' : '0px',
                                                "left": "0px",
                                                'visibility':'hidden'
                                            },
                                        }
                                    ]
                                }
                            ]
                            CT.batchCreateDom(parentDom,initDomObj);
                            PAGE.focusInit();
                            PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                        }else{
                            _this.trueInit();
                        }
                    }
                })
            }else if(res.data=='CancelDelay'){
                if(basePageInfo.commonPageInfo.recommend_19){
                    var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[0].picLibraryTab.picPath;
                    // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                    //     img1 = imgUrlPre + 'orderBG.png';
                    // }
                    //选中
                    var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].picLibraryTab.picPath;
                    //退出
                    var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].picLibraryTab.picPath;
                    var btn = {
                        id: "hands_x0_y0_oldUserOrder_",
                        down: "disable",
                        right: "hands_x0_y0_cancel_",
                        up: "disable",
                        left: "disable",
                        clickHandler: 'javascript:page.goOrder()',
                        TempData: basePageInfo.commonPageInfo.recommend_19[0],
                        focusType: 7,
                    }
                    // if (recData && recData[0]) {
                    //     btn.TempData = recData[0];
                    //     if (recData[0].recommendPic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                    //     }
                    //     if (recData[0].recommendLabelpic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                    //     }
                    //     if (recData[0].recommendFocuspic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                    //     }
                    // }
                    buttons.push(btn);
                    buttons.push({
                        id: 'hands_x0_y0_cancel_',
                        left: 'hands_x0_y0_oldUserOrder_',
                        up: 'disable',
                        down: 'disable',
                        right: 'disable',
                        clickHandler: 'javascript:backFunc()',
                        focusType: 7,
                    })
                    // 批量递归创建元素
                    var parentDom = CT.$("oldUserOrderTip");
                    parentDom.style.visibility = "visible";
                    var initDomObj = [
                        {
                            domTag: 'img',//img等等
                            domAttribute: {
                                'id': 'orderTipBG',
                                'src': img1,
                            },
                            cssStyle: {
                                'position': "absolute",
                                'top': '0px',
                                "left": "0px",
                            },
                        }, {
                            domTag: 'div',//img等等
                            domAttribute: {
                                'id': 'hands_x0_y0_oldUserOrder_',
                            },
                            cssStyle: {
                                'position': "absolute",
                                'top': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].yvalue + 'px',
                                'left': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].xvalue + 'px',
                            },
                            children: [{
                                domTag: 'img',//img等等
                                domAttribute: {
                                    'id': 'oldUserOrder',
                                    'src': img2,
                                },
                                cssStyle: {
                                    'position': "absolute",
                                    'top': '0px',
                                    "left": "0px",
                                },
                            }
                            ]
                        }, {
                            domTag: 'div',//img等等
                            domAttribute: {
                                'id': 'hands_x0_y0_cancel_',
                            },
                            cssStyle: {
                                'position': "absolute",
                                'top': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].yvalue + 'px',
                                'left': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].xvalue + 'px',
                            },
                            children: [{
                                domTag: 'img',//img等等
                                domAttribute: {
                                    'id': 'cancel',
                                    'src': img3,
                                },
                                cssStyle: {
                                    'position': "absolute",
                                    'top': '0px',
                                    "left": "0px",
                                    'visibility': 'hidden'
                                },
                            }
                            ]
                        }
                    ]
                    CT.batchCreateDom(parentDom, initDomObj);
                    PAGE.focusInit();
                    PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                }else{
                    if(basePageInfo.commonPageInfo.recommend_17){
                        var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                        // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                        //     img1 = imgUrlPre + 'orderBG.png';
                        // }
                        //选中
                        var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                        //退出
                        var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                        var btn = {
                            id: "hands_x0_y0_oldUserOrder_",
                            down: "disable",
                            up: "hands_x0_y0_cancel_",
                            left: "disable",
                            right: "disable",
                            clickHandler: 'javascript:page.goOrder()',
                            TempData:basePageInfo.commonPageInfo.recommend_17[0],
                            focusType: 7,
                        }
                        // if (recData && recData[0]) {
                        //     btn.TempData = recData[0];
                        //     if (recData[0].recommendPic) {
                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                        //     }
                        //     if (recData[0].recommendLabelpic) {
                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                        //     }
                        //     if (recData[0].recommendFocuspic) {
                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                        //     }
                        // }
                        buttons.push(btn);
                        buttons.push({
                            id:'hands_x0_y0_cancel_',
                            down:'hands_x0_y0_oldUserOrder_',
                            up:'disable',
                            left:'disable',
                            right:'disable',
                            clickHandler:'javascript:backFunc()',
                            focusType:7,
                        })
                        // 批量递归创建元素
                        var parentDom = CT.$("oldUserOrderTip");
                        parentDom.style.visibility = "visible";
                        var initDomObj = [
                            {
                                domTag : 'img',//img等等
                                domAttribute : {
                                    'id' : 'orderTipBG',
                                    'src' : img1,
                                },
                                cssStyle : {
                                    'position' : "absolute",
                                    'top' : '0px',
                                    "left": "0px",
                                },
                            },{
                                domTag : 'div',//img等等
                                domAttribute : {
                                    'id' : 'hands_x0_y0_oldUserOrder_',
                                },
                                cssStyle : {
                                    'position' : "absolute",
                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                },
                                children: [{
                                        domTag : 'img',//img等等
                                        domAttribute : {
                                            'id' : 'oldUserOrder',
                                            'src' : img2,
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : '0px',
                                            "left": "0px",
                                        },
                                    }
                                ]
                            },{
                                domTag : 'div',//img等等
                                domAttribute : {
                                    'id' : 'hands_x0_y0_cancel_',
                                },
                                cssStyle : {
                                    'position' : "absolute",
                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                },
                                children: [{
                                        domTag : 'img',//img等等
                                        domAttribute : {
                                            'id' : 'cancel',
                                            'src' : img3,
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : '0px',
                                            "left": "0px",
                                            'visibility':'hidden'
                                        },
                                    }
                                ]
                            }
                        ]
                        CT.batchCreateDom(parentDom,initDomObj);
                        PAGE.focusInit();
                        PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                    }
                }
            }else if(res.data=='CancelDelayed'){
                if(basePageInfo.commonPageInfo.recommend_17){
                    var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                    // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                    //     img1 = imgUrlPre + 'orderBG.png';
                    // }
                    //选中
                    var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                    //退出
                    var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                    var btn = {
                        id: "hands_x0_y0_oldUserOrder_",
                        down: "disable",
                        up: "hands_x0_y0_cancel_",
                        left: "disable",
                        right: "disable",
                        clickHandler: 'javascript:page.goOrder()',
                        TempData:basePageInfo.commonPageInfo.recommend_17[0],
                        focusType: 7,
                    }
                    // if (recData && recData[0]) {
                    //     btn.TempData = recData[0];
                    //     if (recData[0].recommendPic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                    //     }
                    //     if (recData[0].recommendLabelpic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                    //     }
                    //     if (recData[0].recommendFocuspic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                    //     }
                    // }
                    buttons.push(btn);
                    buttons.push({
                        id:'hands_x0_y0_cancel_',
                        down:'hands_x0_y0_oldUserOrder_',
                        up:'disable',
                        left:'disable',
                        right:'disable',
                        clickHandler:'javascript:backFunc()',
                        focusType:7,
                    })
                    // 批量递归创建元素
                    var parentDom = CT.$("oldUserOrderTip");
                    parentDom.style.visibility = "visible";
                    var initDomObj = [
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'orderTipBG',
                                'src' : img1,
                            },
                            cssStyle : {
                                'position' : "absolute",
                                'top' : '0px',
                                "left": "0px",
                            },
                        },{
                            domTag : 'div',//img等等
                            domAttribute : {
                                'id' : 'hands_x0_y0_oldUserOrder_',
                            },
                            cssStyle : {
                                'position' : "absolute",
                                'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                            },
                            children: [{
                                    domTag : 'img',//img等等
                                    domAttribute : {
                                        'id' : 'oldUserOrder',
                                        'src' : img2,
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : '0px',
                                        "left": "0px",
                                    },
                                }
                            ]
                        },{
                            domTag : 'div',//img等等
                            domAttribute : {
                                'id' : 'hands_x0_y0_cancel_',
                            },
                            cssStyle : {
                                'position' : "absolute",
                                'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                            },
                            children: [{
                                    domTag : 'img',//img等等
                                    domAttribute : {
                                        'id' : 'cancel',
                                        'src' : img3,
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : '0px',
                                        "left": "0px",
                                        'visibility':'hidden'
                                    },
                                }
                            ]
                        }
                    ]
                    CT.batchCreateDom(parentDom,initDomObj);
                    PAGE.focusInit();
                    PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                }
            }else if(res.data=='UserDelay'){
                interface.delayState(function(res){
                    /*查询当前的用户延迟订购状态 1说明 delayEmpty时，该用户没有延迟订购信息，可弹窗
                    2    //delaySucFirst时，该用户有订购成功记录，可弹窗提示用户开始扣费
                    3     //delaySucNotFirst时，该用户有订购成功记录，已弹窗提示用户开始扣费
                    4       //delayFail时 该用户延时订购失败
                    5、empty时表示用户有需要延迟订购的信息但还未触发延迟订购(白名单有效期内)*/
                    // if(xjDataLog.getStbId()=='44560257080'||xjDataLog.getStbId()=='34290024617'||xjDataLog.getStbId()=='34410002104'){
                    //     res.data='delayEmpty';
                    // }else if(xjDataLog.getStbId()=='34290245890'){
                    //     res.data='delayFail';
                    // }
                    // 鉴权未通过，结果只可能显示老用户弹窗或者去订购
                    //订购失败，弹去订购弹窗
                    if(res.data=='delayFail'){
                        if(basePageInfo.commonPageInfo.recommend_19){
                            var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[0].picLibraryTab.picPath;
                            // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                            //     img1 = imgUrlPre + 'orderBG.png';
                            // }
                            //选中
                            var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].picLibraryTab.picPath;
                            //退出
                            var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].picLibraryTab.picPath;
                            var btn = {
                                id: "hands_x0_y0_oldUserOrder_",
                                down: "disable",
                                right: "hands_x0_y0_cancel_",
                                up: "disable",
                                left: "disable",
                                clickHandler: 'javascript:page.goOrder()',
                                TempData: basePageInfo.commonPageInfo.recommend_19[0],
                                focusType: 7,
                            }
                            // if (recData && recData[0]) {
                            //     btn.TempData = recData[0];
                            //     if (recData[0].recommendPic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                            //     }
                            //     if (recData[0].recommendLabelpic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                            //     }
                            //     if (recData[0].recommendFocuspic) {
                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                            //     }
                            // }
                            buttons.push(btn);
                            buttons.push({
                                id: 'hands_x0_y0_cancel_',
                                left: 'hands_x0_y0_oldUserOrder_',
                                up: 'disable',
                                down: 'disable',
                                right: 'disable',
                                clickHandler: 'javascript:backFunc()',
                                focusType: 7,
                            })
                            // 批量递归创建元素
                            var parentDom = CT.$("oldUserOrderTip");
                            parentDom.style.visibility = "visible";
                            var initDomObj = [
                                {
                                    domTag: 'img',//img等等
                                    domAttribute: {
                                        'id': 'orderTipBG',
                                        'src': img1,
                                    },
                                    cssStyle: {
                                        'position': "absolute",
                                        'top': '0px',
                                        "left": "0px",
                                    },
                                }, {
                                    domTag: 'div',//img等等
                                    domAttribute: {
                                        'id': 'hands_x0_y0_oldUserOrder_',
                                    },
                                    cssStyle: {
                                        'position': "absolute",
                                        'top': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].yvalue + 'px',
                                        'left': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[2].xvalue + 'px',
                                    },
                                    children: [{
                                        domTag: 'img',//img等等
                                        domAttribute: {
                                            'id': 'oldUserOrder',
                                            'src': img2,
                                        },
                                        cssStyle: {
                                            'position': "absolute",
                                            'top': '0px',
                                            "left": "0px",
                                        },
                                    }
                                    ]
                                }, {
                                    domTag: 'div',//img等等
                                    domAttribute: {
                                        'id': 'hands_x0_y0_cancel_',
                                    },
                                    cssStyle: {
                                        'position': "absolute",
                                        'top': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].yvalue + 'px',
                                        'left': basePageInfo.commonPageInfo.recommend_19[0].pageRecommendConfigTabVos[1].xvalue + 'px',
                                    },
                                    children: [{
                                        domTag: 'img',//img等等
                                        domAttribute: {
                                            'id': 'cancel',
                                            'src': img3,
                                        },
                                        cssStyle: {
                                            'position': "absolute",
                                            'top': '0px',
                                            "left": "0px",
                                            'visibility': 'hidden'
                                        },
                                    }
                                    ]
                                }
                            ]
                            CT.batchCreateDom(parentDom, initDomObj);
                            PAGE.focusInit();
                            PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                        }else{
                            if(basePageInfo.commonPageInfo.recommend_17){
                                var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                //     img1 = imgUrlPre + 'orderBG.png';
                                // }
                                //选中
                                var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                //退出
                                var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                var btn = {
                                    id: "hands_x0_y0_oldUserOrder_",
                                    down: "disable",
                                    up: "hands_x0_y0_cancel_",
                                    left: "disable",
                                    right: "disable",
                                    clickHandler: 'javascript:page.goOrder()',
                                    TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                    focusType: 7,
                                }
                                // if (recData && recData[0]) {
                                //     btn.TempData = recData[0];
                                //     if (recData[0].recommendPic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                //     }
                                //     if (recData[0].recommendLabelpic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                //     }
                                //     if (recData[0].recommendFocuspic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                //     }
                                // }
                                buttons.push(btn);
                                buttons.push({
                                    id:'hands_x0_y0_cancel_',
                                    down:'hands_x0_y0_oldUserOrder_',
                                    up:'disable',
                                    left:'disable',
                                    right:'disable',
                                    clickHandler:'javascript:backFunc()',
                                    focusType:7,
                                })
                                // 批量递归创建元素
                                var parentDom = CT.$("oldUserOrderTip");
                                parentDom.style.visibility = "visible";
                                var initDomObj = [
                                    {
                                        domTag : 'img',//img等等
                                        domAttribute : {
                                            'id' : 'orderTipBG',
                                            'src' : img1,
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : '0px',
                                            "left": "0px",
                                        },
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_oldUserOrder_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'oldUserOrder',
                                                    'src' : img2,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                },
                                            }
                                        ]
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_cancel_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'cancel',
                                                    'src' : img3,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                    'visibility':'hidden'
                                                },
                                            }
                                        ]
                                    }
                                ]
                                CT.batchCreateDom(parentDom,initDomObj);
                                PAGE.focusInit();
                                PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                            }
                        }
                    }else if (res.data=="delayFailed"){
                        //无订购记录
                        if(false){
                            interface.judgeUserType(function(jres){
                                //查询活跃状态-高活，延时订购，低活老用户
                                if(xjDataLog.getStbId()=='34290024617'||xjDataLog.getStbId()=='34410002104'||xjDataLog.getStbId()=='34410002029'||xjDataLog.getStbId()=='44560257080'||xjDataLog.getStbId()=='34410002063'||xjDataLog.getStbId()=='34290245890'||xjDataLog.getStbId()=='sn00000'){
                                    jres.data=1;
                                }
                                // interface.loggerInfo("请求高活结果"+CT.jsonToString(res),'post');
                                if(jres.errorCode==1000){
                                    //1高活
                                    if(jres.data==1){
                                        if(basePageInfo.commonPageInfo.recommend_18){
                                            //已经做了一天弹一次，只用存当前弹第几天以及判断
                                            // actiActivityId=21;
                                            // CT.setCookie("activityId",21)
                                            // interface.loggerInfo("判断第几天前")
                                            actiObj.getUserDataList(function(gres){
                                                var userActiData=null;
                                                if(gres.errorCode==1007){
                                                    userActiData=1;
                                                }else{
                                                    userActiData=gres.data.userActiData;
                                                };
                                                userActiData=1;
                                                interface.loggerInfo("判断第几天结果"+CT.jsonToString(gres),'post');
                                                if(userActiData<4){
                                                    //如果小于3可以弹窗-大于弹老用户
                                                    interface.loggerInfo("已执行");
                                                    var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[0].picLibraryTab.picPath;
                                                    // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                                    //     img1 = imgUrlPre + 'orderBG.png';
                                                    // }
                                                    //选中
                                                    var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].picLibraryTab.picPath;
                                                    //退出
                                                    var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].picLibraryTab.picPath;
                                                    var btn = {
                                                        id: "hands_x0_y0_oldUserOrder_",
                                                        down: "disable",
                                                        right: "hands_x0_y0_cancel_",
                                                        up: "disable",
                                                        left: "disable",
                                                        clickHandler: 'javascript:page.freePay()',
                                                        TempData:basePageInfo.commonPageInfo.recommend_18[0],
                                                        focusType: 7,
                                                    }
                                                    // if (recData && recData[0]) {
                                                    //     btn.TempData = recData[0];
                                                    //     if (recData[0].recommendPic) {
                                                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                                    //     }
                                                    //     if (recData[0].recommendLabelpic) {
                                                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                                    //     }
                                                    //     if (recData[0].recommendFocuspic) {
                                                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                                    //     }
                                                    // }
                                                    buttons.push(btn);
                                                    buttons.push({
                                                        id:'hands_x0_y0_cancel_',
                                                        left:'hands_x0_y0_oldUserOrder_',
                                                        up:'disable',
                                                        down:'disable',
                                                        right:'disable',
                                                        clickHandler:'javascript:backFunc()',
                                                        focusType:7,
                                                    })
                                                    // 批量递归创建元素
                                                    var parentDom = CT.$("oldUserOrderTip");
                                                    parentDom.style.visibility = "visible";
                                                    var initDomObj = [
                                                        {
                                                            domTag : 'img',//img等等
                                                            domAttribute : {
                                                                'id' : 'orderTipBG',
                                                                'src' : img1,
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : '0px',
                                                                "left": "0px",
                                                            },
                                                        },{
                                                            domTag : 'div',//img等等
                                                            domAttribute : {
                                                                'id' : 'hands_x0_y0_oldUserOrder_',
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                                'left' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                            },
                                                            children: [{
                                                                    domTag : 'img',//img等等
                                                                    domAttribute : {
                                                                        'id' : 'oldUserOrder',
                                                                        'src' : img2,
                                                                    },
                                                                    cssStyle : {
                                                                        'position' : "absolute",
                                                                        'top' : '0px',
                                                                        "left": "0px",
                                                                    },
                                                                }
                                                            ]
                                                        },{
                                                            domTag : 'div',//img等等
                                                            domAttribute : {
                                                                'id' : 'hands_x0_y0_cancel_',
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                                'left' : basePageInfo.commonPageInfo.recommend_18[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                            },
                                                            children: [{
                                                                    domTag : 'img',//img等等
                                                                    domAttribute : {
                                                                        'id' : 'cancel',
                                                                        'src' : img3,
                                                                    },
                                                                    cssStyle : {
                                                                        'position' : "absolute",
                                                                        'top' : '0px',
                                                                        "left": "0px",
                                                                        'visibility':'hidden'
                                                                    },
                                                                }
                                                            ]
                                                        },{
                                                            domTag:'div',
                                                            domAttribute:{
                                                                'id':'countdown',
                                                            },
                                                        }
                                                    ]
                                                    CT.batchCreateDom(parentDom,initDomObj);
                                                    PAGE.focusInit();
                                                    PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                                    // actiActivityId=21;
                                                    actiObj.setUserDataList((Number(userActiData)+1),function(res){
                                                        // console.log(res);
                                                    });
                                                    CT.$('countdown').innerHTML=_this.downTime;
                                                    _this.downTimer=setInterval(function(){
                                                        _this.downTime=(_this.downTime-1);
                                                        CT.$('countdown').innerHTML=_this.downTime;
                                                        if(_this.downTime<=0){
                                                            console.log("订购");
                                                            _this.freePay();
                                                            clearInterval(_this.downTimer);
                                                        }
                                                    },1000);
                                                }else{
                                                    if(basePageInfo.commonPageInfo.recommend_17){
                                                        var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                                        // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                                        //     img1 = imgUrlPre + 'orderBG.png';
                                                        // }
                                                        //选中
                                                        var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                                        //退出
                                                        var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                                        var btn = {
                                                            id: "hands_x0_y0_oldUserOrder_",
                                                            down: "disable",
                                                            up: "hands_x0_y0_cancel_",
                                                            left: "disable",
                                                            right: "disable",
                                                            clickHandler: 'javascript:page.toJump("alert")',
                                                            TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                                            focusType: 7,
                                                        }
                                                        // if (recData && recData[0]) {
                                                        //     btn.TempData = recData[0];
                                                        //     if (recData[0].recommendPic) {
                                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                                        //     }
                                                        //     if (recData[0].recommendLabelpic) {
                                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                                        //     }
                                                        //     if (recData[0].recommendFocuspic) {
                                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                                        //     }
                                                        // }
                                                        buttons.push(btn);
                                                        buttons.push({
                                                            id:'hands_x0_y0_cancel_',
                                                            down:'hands_x0_y0_oldUserOrder_',
                                                            up:'disable',
                                                            left:'disable',
                                                            right:'disable',
                                                            clickHandler:'javascript:backFunc()',
                                                            focusType:7,
                                                        })
                                                        // 批量递归创建元素
                                                        var parentDom = CT.$("oldUserOrderTip");
                                                        parentDom.style.visibility = "visible";
                                                        var initDomObj = [
                                                            {
                                                                domTag : 'img',//img等等
                                                                domAttribute : {
                                                                    'id' : 'orderTipBG',
                                                                    'src' : img1,
                                                                },
                                                                cssStyle : {
                                                                    'position' : "absolute",
                                                                    'top' : '0px',
                                                                    "left": "0px",
                                                                },
                                                            },{
                                                                domTag : 'div',//img等等
                                                                domAttribute : {
                                                                    'id' : 'hands_x0_y0_oldUserOrder_',
                                                                },
                                                                cssStyle : {
                                                                    'position' : "absolute",
                                                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                                },
                                                                children: [{
                                                                        domTag : 'img',//img等等
                                                                        domAttribute : {
                                                                            'id' : 'oldUserOrder',
                                                                            'src' : img2,
                                                                        },
                                                                        cssStyle : {
                                                                            'position' : "absolute",
                                                                            'top' : '0px',
                                                                            "left": "0px",
                                                                        },
                                                                    }
                                                                ]
                                                            },{
                                                                domTag : 'div',//img等等
                                                                domAttribute : {
                                                                    'id' : 'hands_x0_y0_cancel_',
                                                                },
                                                                cssStyle : {
                                                                    'position' : "absolute",
                                                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                                },
                                                                children: [{
                                                                        domTag : 'img',//img等等
                                                                        domAttribute : {
                                                                            'id' : 'cancel',
                                                                            'src' : img3,
                                                                        },
                                                                        cssStyle : {
                                                                            'position' : "absolute",
                                                                            'top' : '0px',
                                                                            "left": "0px",
                                                                            'visibility':'hidden'
                                                                        },
                                                                    }
                                                                ]
                                                            }
                                                        ];
                                                        CT.batchCreateDom(parentDom,initDomObj);
                                                        PAGE.focusInit();
                                                        PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                                    }else{
                                                        _this.trueInit();
                                                    }
                                                }
                                            });
                                        }else{
                                            _this.trueInit();
                                        }
                                    }else{
                                        if(basePageInfo.commonPageInfo.recommend_17){
                                            var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                            // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                            //     img1 = imgUrlPre + 'orderBG.png';
                                            // }
                                            //选中
                                            var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                            //退出
                                            var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                            var btn = {
                                                id: "hands_x0_y0_oldUserOrder_",
                                                down: "disable",
                                                up: "hands_x0_y0_cancel_",
                                                left: "disable",
                                                right: "disable",
                                                clickHandler: 'javascript:page.goOrder()',
                                                TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                                focusType: 7,
                                            }
                                            // if (recData && recData[0]) {
                                            //     btn.TempData = recData[0];
                                            //     if (recData[0].recommendPic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                            //     }
                                            //     if (recData[0].recommendLabelpic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                            //     }
                                            //     if (recData[0].recommendFocuspic) {
                                            //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                            //     }
                                            // }
                                            buttons.push(btn);
                                            buttons.push({
                                                id:'hands_x0_y0_cancel_',
                                                down:'hands_x0_y0_oldUserOrder_',
                                                up:'disable',
                                                left:'disable',
                                                right:'disable',
                                                clickHandler:'javascript:backFunc()',
                                                focusType:7,
                                            })
                                            // 批量递归创建元素
                                            var parentDom = CT.$("oldUserOrderTip");
                                            parentDom.style.visibility = "visible";
                                            var initDomObj = [
                                                {
                                                    domTag : 'img',//img等等
                                                    domAttribute : {
                                                        'id' : 'orderTipBG',
                                                        'src' : img1,
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : '0px',
                                                        "left": "0px",
                                                    },
                                                },{
                                                    domTag : 'div',//img等等
                                                    domAttribute : {
                                                        'id' : 'hands_x0_y0_oldUserOrder_',
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                    },
                                                    children: [{
                                                            domTag : 'img',//img等等
                                                            domAttribute : {
                                                                'id' : 'oldUserOrder',
                                                                'src' : img2,
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : '0px',
                                                                "left": "0px",
                                                            },
                                                        }
                                                    ]
                                                },{
                                                    domTag : 'div',//img等等
                                                    domAttribute : {
                                                        'id' : 'hands_x0_y0_cancel_',
                                                    },
                                                    cssStyle : {
                                                        'position' : "absolute",
                                                        'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                        'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                    },
                                                    children: [{
                                                            domTag : 'img',//img等等
                                                            domAttribute : {
                                                                'id' : 'cancel',
                                                                'src' : img3,
                                                            },
                                                            cssStyle : {
                                                                'position' : "absolute",
                                                                'top' : '0px',
                                                                "left": "0px",
                                                                'visibility':'hidden'
                                                            },
                                                        }
                                                    ]
                                                }
                                            ]
                                            CT.batchCreateDom(parentDom,initDomObj);
                                            PAGE.focusInit();
                                            PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                        }  else{
                                            _this.trueInit();
                                        }
                                    }
                                }else{
                                    if(basePageInfo.commonPageInfo.recommend_17){
                                        var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                        // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                        //     img1 = imgUrlPre + 'orderBG.png';
                                        // }
                                        //选中
                                        var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                        //退出
                                        var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                        var btn = {
                                            id: "hands_x0_y0_oldUserOrder_",
                                            down: "disable",
                                            up: "hands_x0_y0_cancel_",
                                            left: "disable",
                                            right: "disable",
                                            clickHandler: 'javascript:page.goOrder()',
                                            TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                            focusType: 7,
                                        }
                                        // if (recData && recData[0]) {
                                        //     btn.TempData = recData[0];
                                        //     if (recData[0].recommendPic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                        //     }
                                        //     if (recData[0].recommendLabelpic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                        //     }
                                        //     if (recData[0].recommendFocuspic) {
                                        //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                        //     }
                                        // }
                                        buttons.push(btn);
                                        buttons.push({
                                            id:'hands_x0_y0_cancel_',
                                            down:'hands_x0_y0_oldUserOrder_',
                                            up:'disable',
                                            left:'disable',
                                            right:'disable',
                                            clickHandler:'javascript:backFunc()',
                                            focusType:7,
                                        })
                                        // 批量递归创建元素
                                        var parentDom = CT.$("oldUserOrderTip");
                                        parentDom.style.visibility = "visible";
                                        var initDomObj = [
                                            {
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'orderTipBG',
                                                    'src' : img1,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                },
                                            },{
                                                domTag : 'div',//img等等
                                                domAttribute : {
                                                    'id' : 'hands_x0_y0_oldUserOrder_',
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                                },
                                                children: [{
                                                        domTag : 'img',//img等等
                                                        domAttribute : {
                                                            'id' : 'oldUserOrder',
                                                            'src' : img2,
                                                        },
                                                        cssStyle : {
                                                            'position' : "absolute",
                                                            'top' : '0px',
                                                            "left": "0px",
                                                        },
                                                    }
                                                ]
                                            },{
                                                domTag : 'div',//img等等
                                                domAttribute : {
                                                    'id' : 'hands_x0_y0_cancel_',
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                                    'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                                },
                                                children: [{
                                                        domTag : 'img',//img等等
                                                        domAttribute : {
                                                            'id' : 'cancel',
                                                            'src' : img3,
                                                        },
                                                        cssStyle : {
                                                            'position' : "absolute",
                                                            'top' : '0px',
                                                            "left": "0px",
                                                            'visibility':'hidden'
                                                        },
                                                    }
                                                ]
                                            }
                                        ]
                                        CT.batchCreateDom(parentDom,initDomObj);
                                        PAGE.focusInit();
                                        PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                                    }else{
                                        _this.trueInit();
                                    }
                                }
                            })
                        }else{
                            if(basePageInfo.commonPageInfo.recommend_17){
                                var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendPic.picPath;
                                // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                                //     img1 = imgUrlPre + 'orderBG.png';
                                // }
                                //选中
                                var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendLabelpic.picPath;
                                //退出
                                var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                                var btn = {
                                    id: "hands_x0_y0_oldUserOrder_",
                                    down: "disable",
                                    up: "hands_x0_y0_cancel_",
                                    left: "disable",
                                    right: "disable",
                                    clickHandler: 'javascript:page.goOrder()',
                                    TempData:basePageInfo.commonPageInfo.recommend_17[0],
                                    focusType: 7,
                                }
                                // if (recData && recData[0]) {
                                //     btn.TempData = recData[0];
                                //     if (recData[0].recommendPic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                                //     }
                                //     if (recData[0].recommendLabelpic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                                //     }
                                //     if (recData[0].recommendFocuspic) {
                                //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                                //     }
                                // }
                                buttons.push(btn);
                                buttons.push({
                                    id:'hands_x0_y0_cancel_',
                                    down:'hands_x0_y0_oldUserOrder_',
                                    up:'disable',
                                    left:'disable',
                                    right:'disable',
                                    clickHandler:'javascript:backFunc()',
                                    focusType:7,
                                })
                                // 批量递归创建元素
                                var parentDom = CT.$("oldUserOrderTip");
                                parentDom.style.visibility = "visible";
                                var initDomObj = [
                                    {
                                        domTag : 'img',//img等等
                                        domAttribute : {
                                            'id' : 'orderTipBG',
                                            'src' : img1,
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : '0px',
                                            "left": "0px",
                                        },
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_oldUserOrder_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[2].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'oldUserOrder',
                                                    'src' : img2,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                },
                                            }
                                        ]
                                    },{
                                        domTag : 'div',//img等等
                                        domAttribute : {
                                            'id' : 'hands_x0_y0_cancel_',
                                        },
                                        cssStyle : {
                                            'position' : "absolute",
                                            'top' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                            'left' : basePageInfo.commonPageInfo.recommend_17[0].pageRecommendConfigTabVos[1].xvalue+'px',
                                        },
                                        children: [{
                                                domTag : 'img',//img等等
                                                domAttribute : {
                                                    'id' : 'cancel',
                                                    'src' : img3,
                                                },
                                                cssStyle : {
                                                    'position' : "absolute",
                                                    'top' : '0px',
                                                    "left": "0px",
                                                    'visibility':'hidden'
                                                },
                                            }
                                        ]
                                    }
                                ]
                                CT.batchCreateDom(parentDom,initDomObj);
                                PAGE.focusInit();
                                PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                            }  
                        }
                    }else {
                        _this.trueInit();
                    }
                })
            }else{
				 actiObj.getMyChance(parseInt(xjDataLog.getUserId()), 25, function (getActi1Res) {
					if (getActi1Res.data.activityChance >= 1) {
						actiObj.getMyChance(parseInt(xjDataLog.getUserId()), 24, function (getActi2Res) {
							if (getActi2Res.data.activityChance >= 1) {
								_this.trueInit();
							} else {
								actiObj.setMyChance(parseInt(xjDataLog.getUserId()), 24, function (setActi2Res) {
									if (setActi2Res.errorCode == 1000) {
										var params = {
											contentId: 258,
											contentName: "happyjb",
											contentType: "column",
											action: "column",
										};
										CT.getAnterByIdOrAction(params);
									}
								});
							}
						});
					} else {
						actiObj.setMyChance(parseInt(xjDataLog.getUserId()), 25, function (setActi1Res) {
							CT.getActivityUrl(25);
						});
					}
				});
            }
        })
        //判断是否符合免费高活
        // interface.loggerInfo("请求高活前",'post');
 
    },
    /**
     * 已订购用户判断是否为领取一天的
     */
    orderAlert:function(){
        //只针对第一次进入，并且鉴权通过进行判断是否弹窗
        /**
         * 1//说明 delayEmpty时，该用户没有需要延迟订购的信息，可弹窗
            2    //delaySucFirst时，该用户有订购成功记录，可弹窗提示用户开始扣费
            3     //delaySucNotFirst时，该用户有订购成功记录，已弹窗提示用户开始扣费
            4       //delayFail时 该用户延时订购失败
            5、empty时表示用户有需要延迟订购的信息但还未触发延迟订购(白名单有效期内)
         */
        var _this=this;
        interface.delayState(function(res){
            //delaySucFirst弹 delaySucNotFirst不弹
            // if(xjDataLog.getStbId()=='34410002063'){
            //     res.data='delaySucFirst';
            // }
            if(res.data=="delaySucFirst"){
                if(basePageInfo.commonPageInfo.recommend_20){
                    var img1 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_20[0].pageRecommendConfigTabVos[0].picLibraryTab.picPath;
                    // if(xjDataLog.stbTypeNum&&xjDataLog.stbTypeNum==56){
                    //     img1 = imgUrlPre + 'orderBG.png';
                    // }
                    //选中
                    var img2 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_20[0].pageRecommendConfigTabVos[1].picLibraryTab.picPath;
                    //退出
                    // var img3 = AjaxConfig.imgUrl + basePageInfo.commonPageInfo.recommend_17[0].recommendFocuspic.picPath;
                    var btn = {
                        id: "hands_x0_y0_oldUserOrder_",
                        down: "disable",
                        up: "disable",
                        left: "disable",
                        right: "disable",
                        clickHandler: 'javascript:page.toJump("alert")',
                        TempData:basePageInfo.commonPageInfo.recommend_20[0],
                        focusType: 7,
                    }
                    // if (recData && recData[0]) {
                    //     btn.TempData = recData[0];
                    //     if (recData[0].recommendPic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
                    //     }
                    //     if (recData[0].recommendLabelpic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
                    //     }
                    //     if (recData[0].recommendFocuspic) {
                    //         img1 = AjaxConfig.imgUrl + recData[0].recommendFocuspic.picPath;
                    //     }
                    // }
                    buttons.push(btn);
                    // buttons.push({
                    //     id:'hands_x0_y0_cancel_',
                    //     down:'hands_x0_y0_oldUserOrder_',
                    //     up:'disable',
                    //     left:'disable',
                    //     right:'disable',
                    //     clickHandler:'javascript:backFunc()',
                    //     focusType:7,
                    // })
                    // 批量递归创建元素
                    var parentDom = CT.$("oldUserOrderTip");
                    parentDom.style.visibility = "visible";
                    var initDomObj = [
                        {
                            domTag : 'img',//img等等
                            domAttribute : {
                                'id' : 'orderTipBG',
                                'src' : img1,
                            },
                            cssStyle : {
                                'position' : "absolute",
                                'top' : '0px',
                                "left": "0px",
                            },
                        },{
                            domTag : 'div',//img等等
                            domAttribute : {
                                'id' : 'hands_x0_y0_oldUserOrder_',
                            },
                            cssStyle : {
                                'position' : "absolute",
                                'top' : basePageInfo.commonPageInfo.recommend_20[0].pageRecommendConfigTabVos[1].yvalue+'px',
                                'left' : basePageInfo.commonPageInfo.recommend_20[0].pageRecommendConfigTabVos[1].xvalue+'px',
                            },
                            children: [{
                                    domTag : 'img',//img等等
                                    domAttribute : {
                                        'id' : 'oldUserOrder',
                                        'src' : img2,
                                    },
                                    cssStyle : {
                                        'position' : "absolute",
                                        'top' : '0px',
                                        "left": "0px",
                                    },
                                }
                            ]
                        }
                    ]
                    CT.batchCreateDom(parentDom,initDomObj);
                    PAGE.focusInit();
                    PAGE.changeFocus("hands_x0_y0_oldUserOrder_");
                }else{
                    _this.trueInit();
                }
            }else if (res.data=="delaySucNotFirst"){
                _this.trueInit();
            }else{
                _this.trueInit();
            }
        })
    },
    //一天白名单然后订购
    freePay:function(){
        var _this=this;
        clearInterval(_this.downTimer);
        CT.toAnterRecommendUrl(
            PAGE.getModelByFocusId("hands_x0_y0_oldUserOrder_").TempData
        )
    },
    createOrderRec: function (recData) {
        // var _this = this;
        var orderDom = document.createElement("div");
        orderDom.id = "hands_x0_y0_orderRecImg_";
        orderDom.style.position = "absolute";
        orderDom.style.top = "-6px";
        orderDom.style.left = "800px";
        orderDom.style.visibility = "visible";

        var orderImg = document.createElement("img");
        orderImg.src = AjaxConfig.imgUrl + recData[0].recommendPic.picPath;
        orderImg.style.position = "absolute";
        orderImg.style.top = "0px";
        orderDom.appendChild(orderImg);

        var orderImgFocus = document.createElement("img");
        orderImgFocus.src = AjaxConfig.imgUrl + recData[0].recommendLabelpic.picPath;
        orderImgFocus.style.position = "absolute";
        orderImgFocus.style.top = "0px";
        orderImgFocus.style.visibility = "hidden";
        orderImgFocus.id = "orderRecImg";
        orderDom.appendChild(orderImgFocus);

        document.body.appendChild(orderDom);

        buttons.push({
            id: "hands_x0_y0_orderRecImg_",
            down: "hands_x0_y0_topNavFocus2_",
            clickHandler: 'javascript:page.toActPage()',
            focusType: 7,
            TempData: recData[0]
        })
    },
    toActPage: function () {
        var _this = this;
        var moreObj = CT.getMoresObj(curFocus.TempData.more1);
        if (moreObj.btnType == 'order') {
            _this.goOrder();
        } else {
            CT.toAnterRecommendUrl(curFocus.TempData);
        }
    },
    /**
     *  生成第一屏固定推荐位
     * */
    firstScreenFiexdRecommend: function () {
        var _this = this;
        var firstScreenFiexdPosArr = [
            { left: '150px', top: '20px' },
            { left: '150px', top: '270px' },
            { left: '385px', top: '355px' },
            { left: '700px', top: '355px' },
            { left: '1010px', top: '265px' }];

        var firstScreenDom = CT.$('firstScreenWrapper');
        var domInner = firstScreenDom.innerHTML;
        for (var i = 0; i < _this.recommendFirstScreenFiexd.length; i++) {
            var recommendDisplayValue = _this.recommendFirstScreenFiexd[i].recommendDisplayValue;
            if (recommendDisplayValue == 1 && _this.recommendFirstScreenFiexd[i].recommendDisplayType == 9) { // 判断是否为轮播图
                _this.autoPlay = true;
                _this.scrollId = i + '';
            }
            //光标图对象
            var focusImgInfo = _this.recommendFirstScreenFiexd[i].recommendLabelpic;
            //展示图对象
            var showImgInfo = _this.recommendFirstScreenFiexd[i].recommendPic;
            //角标图对象
            var cornerImgInfo = _this.recommendFirstScreenFiexd[i].recommendFocuspic;
            var displayType = _this.recommendFirstScreenFiexd[i].booleanUp==0?'block':'none';
            //光标
            var obj = "<div id='hands_x0_y0_mainContent" + i + "_' style='position: absolute;top:" + firstScreenFiexdPosArr[i].top + ";left:" + firstScreenFiexdPosArr[i].left + ";width:" + focusImgInfo.picW + "px;height:" + focusImgInfo.picH + "px;'>"
                //展示图
                +
                "<img id='mainContent" + i + "Img' style='width: " + showImgInfo.picW + "px;height:" + showImgInfo.picH + "px;position: absolute;top:6px;left:6px;' src='" + AjaxConfig.imgUrl + showImgInfo.picPath + "'>"
                //光标图
                +
                "<img id='mainContent" + i + "' style='visibility:hidden;position: absolute;left: -5px; top: -5px;' src='" + AjaxConfig.imgUrl + focusImgInfo.picPath + "'>"
                //角标图
                +
                (cornerImgInfo ? "<img id='cornerImg" + i + "' style='visibility:visible' src='" + AjaxConfig.imgUrl + cornerImgInfo.picPath + "'>" : '') +
                "<img id='mainContent"+i+"_booleanDown' src='"+AjaxConfig.projectUrl+"HD/images/booleanDown.png' style='display:"+displayType+"; position:absolute; right: 2%; top:2%;'>"+
                "</div>";
            //创建的元素加入容器
            domInner += obj;
            //创建按钮
            var button = {
                id: 'hands_x0_y0_mainContent' + i + '_',
                clickHandler: 'javascript:page.toJump("mainContent",' + i + ')',
                otherFocusEvent: 'javascript:waterfall.focusEvent(0)',
                focusType: 7,
                TempData: _this.recommendFirstScreenFiexd[i]
            };
            switch (i) {
                case 0:
                    button.up = 'hands_x0_y0_topNavFocus1_';
                    button.down = 'hands_x0_y0_mainContent1_';
                    button.left = 'hands_x0_y0_mainLeftNav0_';
                    button.right = 'hands_x0_y0_mainVideo_';
                    if (_this.isLimitSTB) {
                        button.right = 'hands_x0_y0_videoAreaDom_';
                    }
                    break;
                case 1:
                    button.up = 'hands_x0_y0_mainContent0_';
                    button.downEvent = 'javascript:page.toWaterContent()';
                    button.left = 'hands_x0_y0_mainLeftNav3_';
                    button.right = 'hands_x0_y0_mainContent2_';
                    break;
                case 2:
                    button.up = 'hands_x0_y0_firstScreenVideoRec0_';
                    if (_this.isLimitSTB) {
                        button.up = 'hands_x0_y0_videoAreaDom_';
                    }
                    button.downEvent = 'javascript:page.toWaterContent()';
                    button.left = 'hands_x0_y0_mainContent1_';
                    button.right = 'hands_x0_y0_mainContent3_';
                    break;
                case 3:
                    button.up = 'hands_x0_y0_firstScreenVideoRec1_';
                    if (_this.isLimitSTB) {
                        button.up = 'hands_x0_y0_videoAreaDom_';
                    }
                    button.downEvent = 'javascript:page.toWaterContent()';
                    button.left = 'hands_x0_y0_mainContent2_';
                    button.right = 'hands_x0_y0_mainContent4_';
                    break;
                case 4:
                    button.up = 'hands_x0_y0_mainRank5_';
                    button.downEvent = 'javascript:page.toWaterContent()';
                    button.left = 'hands_x0_y0_mainContent3_';
                    button.right = 'disable';
                    break;
                default:
                    break;
            }
            buttons.push(button);
        }
        firstScreenDom.innerHTML = domInner;
    },
    toWaterContent: function (curFocusId) {
        var _this = this;
        if (this.isRenderWater) {
            PAGE.changeFocus("hands_x0_y0_waterContent3_");
        } else {
            curFocus.defaultBlur();
            this.createWaterDom();
            this.setWaterDomPosition(function () {
                PAGE.focusInit();
                if (curFocusId) {
                    PAGE.changeFocus(curFocusId);
                } else {
                    PAGE.changeFocus("hands_x0_y0_waterContent3_");
                }
                _this.isRenderWater = true;
            });
        }
    },
    // 排行榜
    firstScreenRankRecommend: function () {
        var _this = this;
        var firstScreenRankPosArr = [
            { left: '0px', top: '21px' },
            { left: '40px', top: '19px' },
            { left: '127px', top: '20px' },
            { left: '0px', top: '128px' },
            { left: '0px', top: '171px' },
            { left: '0px', top: '214px' }
        ];
        var firstScreenRankDom = document.createElement('div');
        firstScreenRankDom.id = 'rankDom';
        firstScreenRankDom.style.width = '220px';
        firstScreenRankDom.style.height = '230px';
        firstScreenRankDom.style.position = 'absolute';
        firstScreenRankDom.style.top = '0px';
        firstScreenRankDom.style.left = '1015px';
        for (var i = 0; i < _this.recommendRank.length; i++) {
            //光标图对象
            var focusImgInfo = _this.recommendRank[i].recommendLabelpic;
            //展示图对象
            var showImgInfo = _this.recommendRank[i].recommendPic || {};
            var focusType = 8;
            var diffWidth = -12;
            var diffHeight = -12;
            var zIndex = 0;
            if (i == 0) {
                diffHeight = -8;
            } else if (i == 2) {
                diffHeight = 4;
            }
            var displayType=_this.recommendRank[i].booleanUp==0?'block':'none';
            //光标
            var obj = "<div id='hands_x0_y0_mainRank" + i + "_' style='z-index:999;position: absolute;top:" + firstScreenRankPosArr[i].top + ";left:" + firstScreenRankPosArr[i].left + ";width:" + focusImgInfo.picW + "px;height:" + focusImgInfo.picH + "px;'>"
                +
                //光标图

                "<img id='mainRank" + i + "' style='position: absolute;visibility:hidden;top:" + diffHeight + "px;left:" + diffWidth + "px;z-index:" + zIndex + "' src='" + AjaxConfig.imgUrl + focusImgInfo.picPath + "'>"
                +
                //展示图

                "<img id='mainRankShow" + i + "' style='width: " + showImgInfo.picW + "px;height:" + showImgInfo.picH + "px;position: absolute;top:0px;left:0px;' src='" + AjaxConfig.imgUrl + showImgInfo.picPath + "'>"
                /*角标图
                + (cornerImgInfo ? "<img id='cornerImg" + i + "' style='visibility:visible' src='" + AjaxConfig.imgUrl + cornerImgInfo.picPath + "'>" : '')*/
                +
                "<img id='mainRankShow"+i+"_booleanDown' src='"+AjaxConfig.projectUrl+"HD/images/booleanDown.png' style='display:"+displayType+"; position:absolute; right: 2%; top:2%;'>"
                +
                "</div>";
            //创建的元素加入容器
            firstScreenRankDom.innerHTML += obj;
            //创建按钮
            var button = {
                id: 'hands_x0_y0_mainRank' + i + '_',
                clickHandler: 'javascript:page.toJump("firstScreenFiexd",' + i + ')',
                otherFocusEvent: 'javascript:waterfall.focusEvent(0)',
                right: 'disable',
                left: 'hands_x0_y0_mainVideoList0_',
                up: 'hands_x0_y0_mainRank' + (i - 1) + '_',
                down: 'hands_x0_y0_mainRank' + (i + 1) + '_',
                focusType: focusType,
                TempData: _this.recommendRank[i]
            };
            if (_this.isLimitSTB) {
                button.left = 'hands_x0_y0_videoAreaDom_';
            }
            var navLen = commonPageInfo.pageInfo.commonPageInfo.recommend_2.length - 1;
            if (i == 0) {
                button.up = 'hands_x0_y0_topNavFocus' + (navLen - 1) + '_';
                button.down = 'hands_x0_y0_mainRank3_';
                button.right = 'hands_x0_y0_mainRank1_';
            }
            if (i == 1) {
                button.up = 'hands_x0_y0_topNavFocus' + (navLen - 1) + '_';
                button.down = 'hands_x0_y0_mainRank3_';
                button.left = 'hands_x0_y0_mainRank0_';
                button.right = 'hands_x0_y0_mainRank2_';
            }
            if (i == 2) {
                button.up = 'hands_x0_y0_topNavFocus' + (navLen - 1) + '_';
                button.down = 'hands_x0_y0_mainRank3_';
                button.left = 'hands_x0_y0_mainRank1_';
            }
            if (i == _this.recommendRank.length - 1) {
                button.down = 'hands_x0_y0_mainContent4_';
            }
            buttons.push(button);
        }
        CT.$('firstScreenWrapper').appendChild(firstScreenRankDom);
    },
    /**
     *  生成第一屏视频区域
     * */
    firstScreenVideoRecommend: function () {
        var _this = this;
        var videoAreaDom = document.createElement('div');
        videoAreaDom.id = 'hands_x0_y0_videoAreaDom_';
        videoAreaDom.style.width = '617px';
        videoAreaDom.style.height = '337px';
        videoAreaDom.style.position = 'absolute';
        videoAreaDom.style.top = '20px';
        videoAreaDom.style.left = '390px';
        var navLen = commonPageInfo.pageInfo.commonPageInfo.recommend_2.length - 1;
        var navMaxIndex = navLen > 4 ? 4 : navLen;
        if (_this.isLimitSTB) {
            var obj = "<img id='videoAreaDomImg' src='" + AjaxConfig.imgUrl + _this.recommendScroll[0].recommendPic.picPath + "'>"
                //光标图
                + "<img id='videoAreaDom' style='position:absolute;visibility:hidden;left: -17px;top: -15px;'src='" + AjaxConfig.imgUrl + _this.recommendScroll[0].recommendLabelpic.picPath + "'>"
            //创建的元素加入容器
            videoAreaDom.innerHTML += obj;
            var button = {
                id: 'hands_x0_y0_videoAreaDom_',
                clickHandler: 'javascript:page.toJump("hands_x0_y0_firstScreenVideoFocus_")',
                otherFocusEvent: 'javascript:waterfall.focusEvent(0)',
                up: 'hands_x0_y0_topNavFocus' + navMaxIndex + '_',
                down: 'hands_x0_y0_mainContent2_',
                left: 'hands_x0_y0_mainContent0_',
                right: 'hands_x0_y0_mainRank1_',
                focusType: 7,
            };
            buttons.push(button);
        } else {
            var firstScreenVideoListPosArr = [
                { left: '458px', top: '21px' },
                { left: '458px', top: '69px' },
                { left: '458px', top: '119px' },
                { left: '458px', top: '168px' },
                { left: '458px', top: '217px' }
            ];
            var firstScreenVideoRecPosArr = [
                { left: '47px', top: '264px' },
                { left: '251px', top: '264px' }
            ];
            //视频区域背景图和视频选中框数据
            var videoRecData = _this.recommendPlayer[7];
            videoAreaDom.style.background = 'url(' + AjaxConfig.imgUrl + videoRecData.recommendPic.picPath + ') no-repeat';
            //光标
            var obj = "<div id='hands_x0_y0_mainVideo_' style='position: absolute;top:12px;left:8px;width:" + videoRecData.recommendLabelpic.picW + "px;height:" + videoRecData.recommendLabelpic.picH + "px;'>"
                //光标图
                + "<img id='mainVideo' style='visibility:hidden' src='" + AjaxConfig.imgUrl + videoRecData.recommendLabelpic.picPath + "'>" + "</div>";
            //创建的元素加入容器
            videoAreaDom.innerHTML += obj;
            //创建小视频选中框按钮
            var button = {
                id: 'hands_x0_y0_mainVideo_',
                clickHandler: 'javascript:page.toJump("firstScreenSmallVideo",page.nowSmallVideoIndex)',
                up: 'hands_x0_y0_topNavFocus' + navMaxIndex + '_',
                otherFocusEvent: 'javascript:waterfall.focusEvent(0)',
                down: 'hands_x0_y0_firstScreenVideoRec0_',
                left: 'hands_x0_y0_mainContent0_',
                right: 'hands_x0_y0_mainVideoList0_',
                focusType: 7,
                TempData: _this.recommendSmallVideoArr[0]
            };
            buttons.push(button);
            //创建小视频列表选中框按钮
            for (var i = 0; i < _this.recommendSmallVideoArr.length; i++) {
                //光标图对象
                var focusImgInfo = _this.recommendSmallVideoArr[i].recommendLabelpic || {};
                //展示图对象
                var showImgInfo = _this.recommendSmallVideoArr[i].recommendFocuspic || {}; //recommendPic
                //角标图对象
                //var cornerImgInfo = _this.recommendSmallVideoArr[i].recommendFocuspic;
                //光标
                var obj = "<div id='hands_x0_y0_mainVideoList" + i + "_' style='position: absolute;top:" + firstScreenVideoListPosArr[i].top + ";left:" + firstScreenVideoListPosArr[i].left + ";width:" + focusImgInfo.picW + "px;height:" + focusImgInfo.picH + "px;'>"
                    //展示图
                    + "<img id='videoListBtnBG" + i + "' style='width: " + showImgInfo.picW + "px;height:" + showImgInfo.picH + "px;position: absolute;top:0px;left:-7px;visibility:hidden;' src='" + AjaxConfig.imgUrl + showImgInfo.picPath + "'>"
                    //展示文本
                    + "<div id='videoListText" + i + "' style='width: 130px;height:45px;position: absolute;top:5px;left:10px;font-size:20px;color:white;line-height:45px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;'>" + _this.recommendSmallVideoArr[i].recommendDisplayName + "</div>"
                    //光标图 "../../../images/empty.png" AjaxConfig.imgUrl + focusImgInfo.picPath
                    + "<img id='mainVideoList" + i + "' style='visibility:hidden;position:absolute;left:-18px;top: -8px;' src='" + AjaxConfig.imgUrl + focusImgInfo.picPath + "'>"
                    //角标图
                    //+ (cornerImgInfo ? "<img id='cornerImg" + i + "' style='visibility:visible' src='" + AjaxConfig.imgUrl + cornerImgInfo.picPath + "'>" : '')
                    + "</div>";
                //创建的元素加入容器
                videoAreaDom.innerHTML += obj;
                //创建按钮
                var button = {
                    id: 'hands_x0_y0_mainVideoList' + i + '_',
                    clickHandler: 'javascript:page.changeSmallVideo(' + i + ')',
                    left: "hands_x0_y0_mainVideo_",
                    right: "hands_x0_y0_mainRank1_",
                    up: 'hands_x0_y0_mainVideoList' + (i - 1) + '_',
                    down: 'hands_x0_y0_mainVideoList' + (i + 1) + '_',
                    focusType: 7,
                    TempData: _this.recommendSmallVideoArr[i]
                };
                if (i == 0) {
                    button.up = 'hands_x0_y0_topNavFocus' + (navLen - 1) + '_';
                }
                if (i == _this.recommendSmallVideoArr.length - 1) {
                    button.down = 'hands_x0_y0_firstScreenVideoRec1_';
                }
                buttons.push(button);
            }
            //创建观看历史和一键播放按钮
            for (var i = 0; i < 2; i++) {
                //光标图对象
                var focusImgInfo = _this.recommendPlayer[i].recommendLabelpic;
                //展示图对象
                var showImgInfo = _this.recommendPlayer[i].recommendPic;
                //角标图对象
                var cornerImgInfo = _this.recommendPlayer[i].recommendFocuspic;
                //光标
                var obj = "<div id='hands_x0_y0_firstScreenVideoRec" + i + "_' style='position: absolute;top:" + firstScreenVideoRecPosArr[i].top + ";left:" + firstScreenVideoRecPosArr[i].left + ";width:" + focusImgInfo.picW + "px;height:" + focusImgInfo.picH + "px;'>"
                    //展示图
                    // + "<img id='firstScreenVideoRecShow"+i+"' style='width: " + showImgInfo.picW + "px;height:" + showImgInfo.picH + "px;position: absolute;top:6px;left:6px;' src='"+ AjaxConfig.imgUrl + showImgInfo.picPath + "'>"
                    //光标图
                    + "<img id='firstScreenVideoRec" + i + "' style='visibility:hidden' src='" + AjaxConfig.imgUrl + focusImgInfo.picPath + "'>"
                    //角标图
                    + (cornerImgInfo ? "<img id='cornerImg" + i + "' style='visibility:visible' src='" + AjaxConfig.imgUrl + cornerImgInfo.picPath + "'>" : '') + "</div>";
                //创建的元素加入容器
                videoAreaDom.innerHTML += obj;
                //创建按钮
                var button = {
                    id: 'hands_x0_y0_firstScreenVideoRec' + i + '_',
                    clickHandler: 'javascript:page.toJump("firstScreenVideoRec",' + i + ')',
                    up: 'hands_x0_y0_mainVideo_',
                    focusType: 7,
                    TempData: _this.recommendPlayer[i]
                };
                if (i == 0) {
                    button.left = 'hands_x0_y0_mainContent1_';
                    button.down = 'hands_x0_y0_mainContent2_';
                }
                if (i == 1) {
                    button.down = 'hands_x0_y0_mainContent3_';
                }
                buttons.push(button);
            }
        }
        CT.$('firstScreenWrapper').appendChild(videoAreaDom);
    },
    /**
    * 生成主题选择弹框
    * */
    createTheme: function (callBack) {
        var _this = this;
        if (_this.isLimitSTB) {
            callBack();
        } else {
            //获取主题列表
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
                themeImg.src = AjaxConfig.imgUrl + commonPageInfo.recommend_4[0].recommendLabelpic.picPath;
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
                        //left : 'hands_x0_y0_mainLeftNav2_',
                        leftEvent: 'javascript:mainNavObj.hideThemeList()',
                        right: 'disable',
                        focusType: 7,
                        TempData: _this.recommendFirstScreenFiexd[i],
                        // enFocus: false
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
            CT.$("title" + index).innerHTML = String(showTitle).substring(0, len - 1) + '…';
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
        var scrollDiv = _this.isLimitSTB ? "hands_x0_y0_videoAreaDom_" : "hands_x0_y0_mainContent" + this.scrollId + '_';
        var dom = CT.$(scrollDiv) // 轮播图
        var width = this.recommendScroll[0].recommendLabelpic.picW // 图片宽度
        var w = this.recommendScroll[0].recommendLabelpic.picW.replace('px', '')
        var height = this.recommendScroll[0].recommendLabelpic.picH // 图片高度
        var h = this.recommendScroll[0].recommendLabelpic.picH.replace('px', '')
        var top = height - 40; // 相对于main元素定位
        if (_this.isLimitSTB) {
            top -= 12;
        }
        var left = 0; // 相对于main元素定位
        // 生成小点
        var dots =
            '<div id="dots" style="position: absolute; left: ' + left + 'px; top: ' + Number(top) + 'px; width: ' + width + 'px;height: 20px;z-index: 0;padding: 0 ' + (Number(w) - (_this.dotW + _this.dotM * 2) * Number(len)) / 2 + 'px"></div>'
        if (initObj.whitch == 'firstScreenFiexd') {
            //第一屏轮播小点
            CT.$(scrollDiv).innerHTML += dots;
        } else {
            //瀑布流轮播小点
            dom = CT.$("hands_x0_y0_waterContent" + this.scrollId + '_') // 轮播图
            top = dom.style.top.replace('px', '') // 相对于main元素定位
            left = dom.style.left.replace('px', '') // 相对于main元素定位
            var dots =
                '<div id="dots" style="position: absolute; left: ' + left + 'px; top: ' + (Number(top) + Number(h) - _this.dotPosition) + 'px; width: ' + width + 'px;height: 20px;z-index: 10;padding: 0 ' + (Number(w) - (_this.dotW + _this.dotM * 2) * Number(len)) / 2 + 'px"></div>'
            CT.$('waterBox' + this.scrollId).innerHTML += dots;
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
        var scrollTime = _this.isLimitSTB ? 5000 : 1500;
        var scroll = function () {
            setTimeout(function () {
                try {
                    index == len && (index = 0)
                    var imgDom = CT.$('mainContent' + _this.scrollId + 'Img');
                    var imgDom = _this.isLimitSTB ? CT.$('videoAreaDomImg') : CT.$('mainContent' + _this.scrollId + 'Img');
                    imgDom.src = AjaxConfig.imgUrl + _this.recommendScroll[index].recommendPic.picPath
                    for (var i = 0; i < len; i++) {
                        CT.$('dot' + i).style.backgroundColor = '#fff'
                    }
                    CT.$('dot' + index).style.backgroundColor = 'rgb(100, 100, 100)'
                    PAGE.getFocusModel6(scrollDiv).TempData = _this.recommendScroll[index]
                    index++
                } catch (error) {

                }
                scroll()
            }, scrollTime)
        }
        scroll()
    },
    // 生成小海贝悬浮窗
    createXHB: function (data) {
        var _this = this;
        var xhbXFCData = commonPageInfo.recommend_10;
        //筛选出小海贝弹框跳转数据
        for (var index = 0; index < xhbXFCData.length; index++) {
            if (index == 1 || index > 2) {
                _this.XHBJumpDataArr.push(xhbXFCData[index]);
            }
        }
        //光标
        var obj =
            '<div id="hands_x0_y0_xhbFocus_" style="position: absolute;top:350px;left:0px;">' +
            '<img id="xhbShowImg" style="position: absolute;top:0px;left:0px;" src="' + AjaxConfig.imgUrl + xhbXFCData[2].recommendPic.picPath + '">' +
            '<img id="xhbFocus" style="position: absolute;top:0px;left:0px;visibility: hidden;" src="' + AjaxConfig.imgUrl + xhbXFCData[2].recommendLabelpic.picPath + '">' +
            '</div>' +
            //小海贝弹框
            '<div id="xhbAlertDiv" style="position: absolute;top:0px;left:0px;width:1280px;height:720px;z-index: 2;visibility: hidden;background: url(' + AjaxConfig.imgUrl + xhbXFCData[0].recommendPic.picPath + ') no-repeat;">' +
            '<div id="hands_x0_y0_xhbOK_" style="position: absolute;top:471px;left:535px;">' +
            '<img id="xhbOK" style="position: absolute;top:0px;left:0px;visibility: hidden;" src="' + AjaxConfig.imgUrl + xhbXFCData[1].recommendLabelpic.picPath + '">' +
            '</div>' +
            '<div id="hands_x0_y0_xhbExit_" style="position: absolute;top:77px;left:857px;">' +
            '<img id="xhbExit" style="position: absolute;top:0px;left:0px;visibility: hidden;" src="' + AjaxConfig.imgUrl + xhbXFCData[0].recommendLabelpic.picPath + '">' +
            '</div>' +
            '</div>';
        //创建的元素加入容器
        //CT.$('firstScreenWrapper').innerHTML += obj;
        document.getElementsByTagName('body')[0].innerHTML += obj;
        //添加小海贝按钮动画
        var imgUrlArr = [];
        var imgUrl0 = AjaxConfig.imgUrl + xhbXFCData[2].recommendLabelpic.picPath;
        imgUrlArr.push(imgUrl0);
        var imgUrl1 = AjaxConfig.imgUrl + xhbXFCData[2].recommendFocuspic.picPath;
        imgUrlArr.push(imgUrl1);
        //添加首页第一屏向下提示箭头动画
        var downTipData = commonPageInfo.recommend_4;
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
            CT.$('xhbFocus').src = imgUrlArr[xhbAnimationIndex];
            //添加首页第一屏向下提示箭头动画
            var xhbFocusBtn = CT.$('downTipImg');
            xhbFocusBtn && (xhbFocusBtn.src = imgUrlArr1[xhbAnimationIndex]);
            xhbAnimationIndex++;
            //眉头选中gif效果
            topNavObj.navBarObjTimerFunc && topNavObj.navBarObjTimerFunc();
        }, 300);
        //创建小视频选中框按钮
        var button = [{
            id: 'hands_x0_y0_xhbFocus_',
            clickHandler: 'javascript:page.showXhbXFC()',
            otherFocusEvent: 'javascript:page.xhbBtnGetFocus()',
            //enMove : 'false',
            left: 'disable',
            top: 'disable',
            up: 'disable',
            down: 'disable',
            //right: 'hands_x0_y0_navBelowFocus2_',
            rightEvent: 'javascript:page.xhbFocusRight()',
            focusType: 7,
            TempData: xhbXFCData[2]
        }, {
            id: 'hands_x0_y0_xhbOK_',
            clickHandler: 'javascript:page.toJump("xhbAlert")',
            enMove: 'false',
            left: 'hands_x0_y0_xhbFocus_',
            top: 'hands_x0_y0_xhbExit_',
            up: 'hands_x0_y0_xhbExit_',
            down: 'disable',
            right: 'disable',
            focusType: 7,
            TempData: xhbXFCData[1]
        }, {
            id: 'hands_x0_y0_xhbExit_',
            clickHandler: 'javascript:PAGE.changeFocus("hands_x0_y0_xhbFocus_")',
            enMove: 'false',
            left: 'disable',
            top: 'disable',
            up: 'disable',
            down: 'hands_x0_y0_xhbOK_',
            right: 'disable',
            focusType: 7,
            TempData: xhbXFCData[0]
        },];
        for (var index = 0; index < button.length; index++) {
            buttons.push(button[index]);
        }
    },
    /**
     *   小海贝弹框随机展示进入IP事件
     *   @param more1
     *   @returns {*}
     */
    xhbAlertRandomShow: function () {
        var _this = this;
        var maxRandomNum = _this.XHBJumpDataArr.length;
        var index = Math.floor(Math.random() * maxRandomNum);
        //随机改变小海贝弹框的展示图和焦点数据
        CT.$('xhbAlertDiv') && (CT.$('xhbAlertDiv').style.background = "url(" + AjaxConfig.imgUrl + _this.XHBJumpDataArr[index].recommendPic.picPath + ") no-repeat");
        PAGE.getFocusModel6("hands_x0_y0_xhbOK_").TempData = _this.XHBJumpDataArr[index];
    },
    /**
     *   小海贝按钮获焦事件
     *   @param more1
     *   @returns {*}
     */
    xhbBtnGetFocus: function () {
        var _this = this;
        if (curFocus.lastFocusId.toLowerCase().indexOf('xhb') == -1) {
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
        //关闭小视频
        _this.videoHidden(-9999);
        //随机展示小海贝弹框IP
        _this.xhbAlertRandomShow();
        CT.$('xhbAlertDiv').style.visibility = 'visible';
        PAGE.changeFocus('hands_x0_y0_xhbOK_');
    },
    /**
     *   隐藏小海贝弹窗
     *   @param more1
     *   @returns {*}
     */
    hidXhbXFC: function () {
        var _this = this;
        CT.$('xhbShowImg').style.visibility = 'hidden';
        CT.$('xhbAlertDiv').style.visibility = 'hidden';
        var mainTopNum = Number(CT.$("main").style.top.substring(0, CT.$("main").style.top.length - 2))
        if (mainTopNum >= 0) {
            //播放小视频
            _this.videoHidden(0);
        }
    },
    /**
     *   隐藏小海贝按钮往右切换焦点
     *   @param more1
     *   @returns {*}
     */
    xhbFocusRight: function () {
        var _this = this;
        CT.$('xhbShowImg').style.visibility = 'visible';
        PAGE.changeFocus(_this.XHBLastFocusId || 'hands_x0_y0_mainLeftNav0_');
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
                id: "hands_x0_y0_waterContent" + (conf.index) + "_",
                focusType: 7,
                clickHandler: 'javascript:page.toJump("bottom",' + (conf.index) + ')',
                otherFocusEvent: "javascript:waterfall.focusEvent(" + (conf.index) + ")",
                otherBlurEvent: "javascript:waterfall.blurEvent(" + (conf.index) + ")",
                TempData: conf.TempData
            }
        } else {
            btn = {
                id: "hands_x0_y0_waterContent" + (conf.index) + "_",
                focusType: 7,
                enFocus: false
            }
        }
        ;
        var moreObj = CT.getMoresObj(conf.TempData.more2);
        if (moreObj.focusType) {
            btn.focusType = Number(moreObj.focusType);
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
        if (_this.isLimitSTB) {
            return
        }
        if (top < 0) {//top > _this.mainShowAreaHight
            //关闭小视频
            CT.show(CT.$('videoImg'));
            CT.$('videoLoadingImg') && (CT.$('videoLoadingImg').style.visibility = 'hidden');
            if (_this.isOnPlay) {
                if (videoPlayer.timer !== null) {
                    clearInterval(videoPlayer.timer);
                    videoPlayer.timer = null;
                }
                _this.isOnPlay = false;
                videoPlayer.exitPage();
            }
        } else {
            //开启小视频
            setTimeout(function () {
                if (CT.$("main").style.top == "0px") {
                    CT.hide(CT.$('videoImg'));
                }
                CT.$('videoLoadingImg') && (CT.$('videoLoadingImg').style.visibility = 'hidden');
                if (!_this.isOnPlay) {
                    _this.changeSmallVideo(_this.nowSmallVideoIndex);
                    _this.isOnPlay = true;
                }
            }, 200);
        }
    },
    /**
     *  创建瀑布流推荐位的dom
     *  从接口返回数据中取出图片的地址、宽、高
     *  注：此时所有的推荐位只创建Dom和赋值width、height、src等属性，其中定位都是top:0;left:0;
     *  一些特殊需求可在此方法里处理，例如底图和光标图的层级关系、显示光标图（默认不显示）
     */
    createWaterDom: function () {
        var _this = this;
        //推荐位文字描述
        var contentText = null;
        //推荐位的显示图片 信息
        var contentImgInfo = null;
        //推荐位的光标图片 信息
        var selectBorderImgInfo = null;
        //存储创建元素
        var elm = null;
        //存储拼接的DOM
        var obj = null;
        //存储每个推荐位的按钮
        var button = null;
        //所有数据
        recommendObj = _this.pinterestData || [{}];
        //循环所有数据
        for (var i = 0, len = recommendObj.length; i < len; i++) {
            var curTempData = recommendObj[i];
            //整理more1数据
            _this.moer1DataJson.push(_this.getMore1(curTempData.recommendDisplayValue));
            //推荐位文字描述,取cartoonName或picCname
            contentText = (curTempData.recommendPic && curTempData.recommendPic.picCname) || "";
            //推荐位的显示图片 信息，位防止报错，默认{"picCname": "","picH": "","picPath": "","picW": ""}
            contentImgInfo = curTempData.recommendPic || { "picCname": "", "picH": "", "picPath": "", "picW": "" };
            selectBorderImgInfo = curTempData.recommendLabelpic || { "picCname": "", "picH": "", "picPath": "", "picW": "" };
            elm = document.createElement("div");
            elm.id = "waterBox" + i;

            if (curTempData.recommendDisplayType == 9) { // 判断是否为功能性推荐位
                var recommendDisplayValue = curTempData.recommendDisplayValue;
                if (recommendDisplayValue == 1) { // 判断是否为轮播图
                    _this.autoPlay = true;
                    _this.scrollId = i + '';
                } else if (recommendDisplayValue == 2) { // 判断是否是排行榜 recommendDisplayType 9 recommendDisplayType recommend
                    _this.rankList = true;
                    _this.rankId = i + '';
                } else if (recommendDisplayValue == 3) { // 判断是否为小视频
                    _this.isPlay = true;
                    _this.playId = i + '';
                } else if (recommendDisplayValue == 4) {
                    _this.isTrain = true;
                    _this.trainId = i + '';
                    var isShowSelectedImg = 4;
                } else {
                    isShowSelectedImg = 1;
                }
            } else {
                isShowSelectedImg = 1;
            }
            var focusImgsrc = "";
            if (selectBorderImgInfo.picPath) {
                focusImgsrc = AjaxConfig.imgUrl + selectBorderImgInfo.picPath + '?v=1';
            }
            var moreObj = CT.getMoresObj(curTempData.more2);
            if (moreObj.focusType) {
                try {
                } catch (error) {
                }
            }
            //底图
            obj = "<img id='waterContent" + i + "Img' style='width: " + contentImgInfo.picW + "px;height:" + contentImgInfo.picH + "px;position: absolute;top:0px;left:0px;' imgsrc='" + AjaxConfig.imgUrl + contentImgInfo.picPath + '?v=1' + "' src='./HD/images/empty.png'" + ">";
            //光标
            obj += "<div id='hands_x0_y0_waterContent" + i + "_' style='position: absolute;top:" + _this.defaultTop +
                "px;left:0px;width:" + (Number(contentImgInfo.picW) + _this.defaultSpaceRow) + "px;height:" +
                (Number(contentImgInfo.picH) + _this.defaultSpaceCol) + "px;'><img id='waterContent" + i +
                "' style='visibility:" + (_this.moer1DataJson[i].isShowSelectedImg == 'true' ? 'visible' : 'hidden') +
                "' imgsrc='" + focusImgsrc + "' src='./HD/images/empty.png'" + "'>";
            obj += "<div class='morePonts fontCss' id='waterContentFont" + i + "' style='visibility:" + (_this.moer1DataJson[i].isShowFont == 'true' ? 'visible' : 'hidden') + ";width:" + (contentImgInfo.picW - 17) + "px;'>" + contentText + "ll" + contentText + "pp" + contentText + "</div>";
            if(curTempData.booleanUp==0){
                obj += "<img id='waterContent"+i+"_booleanDown' src='"+AjaxConfig.projectUrl+"HD/images/booleanDown.png' style='display:block; position:absolute; right: 2%; top:2%;'>"
            }
            obj += "</div>";
            elm.innerHTML = obj;
            CT.$("main").appendChild(elm);
            //创建按钮
            var button = _this.setBtnObj({
                index: i,
                selectBorderImgUrl: selectBorderImgInfo.picPath,
                isShowSelectedImg: isShowSelectedImg,
                TempData: curTempData
            })
            buttons.push(button);
        }
    },
    /**
     *  获取arr数组中值为minH的值在数组中的索引
     *  @param arr 要比较的数组
     *  @returns {*}
     */
    getMinHeightKey: function (arr) {
        arr = arr || [{}];
        var minIndex = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].h < arr[minIndex].h) {
                minIndex = i;
            }
        }
        return arr[minIndex];
    },
    /**
     * 获取数组中值为MaxH的值在数组中的索引
     * @param arr 要比较的数组
     * @returns {*}
     */
    getMaxHeightKey: function (arr) {
        arr = arr || [{}];
        var Index = 0;
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i].h >= arr[Index].h) {
                Index = i;
            }
        }
        return arr[Index];
    },
    /**
     * 判断数组中的推荐位是否齐平
     * 先求出平均值，如果最大值和平均值相差小于10，则表示齐平，10表示误差大小
     * @param arr 要比较的数组
     * @returns {*}
     */
    isAllEquall: function (arr) {
        var _this = this;
        arr = arr || [{}]
        var sum = 0;
        var averageNum = 0;
        var len = arr.length;
        for (var i = 0; i < len; i++) {
            if (arr[i].h > 0) {
                sum += arr[i].h
            }
        }
        if (sum == 0) {
            return { result: true, averageNum: 0 };
        }
        averageNum = sum / len;
        if (_this.getMaxHeightKey(arr).h - averageNum > 10) {
            return { result: false, averageNum: 0 };
        }
        return { result: true, averageNum: averageNum };
    },
    /** 
     *  瀑布流推荐位的定位
     *  遍历所有的瀑布流数据，通过计算分别赋值top，left的值，光标图和底图一起改变定位
     *  计算的步骤
     *  1.当前推荐位是否需要换行，当left+width <1280不需要，可以直接left=curRowLeft;top=curRowTop
     *  2.当left+width >1280需要换行，再判断当前数组comPareArray中存在的推荐位是否齐平，如果齐平则制空数组comPareArray，此时的curRowTop就等于平均值;可以直接left=curRowLeft;top=curRowTop，重复步骤1
     *  3.如果不齐平，找到最小点，判断当前宽+10是否大于最小点推荐位的宽，10表示误差大小，如果大于需要改变最小值的top，如果不大于需要改变最小值的left
     *  注：每一次的计算最后都要把当前的推荐位信息添加到数组comPareArray中
     *  
     *  每次循环的最后判断此推荐位是否上下架：CT.isBooleanUp
     */
    setWaterDomPosition: function (callback) {
        var _this = this;
        //当前推荐位left值，遇到齐平情况会恢复初始值
        var curRowLeft = _this.defaultLeft;
        //当前推荐位Top值，无限增加
        var curRowTop = _this.defaultTop;
        var curClassDom = null; //当前元素的dom对象
        var curClassDomInfo = {}; //当前元素坐标参数
        //遍历当前取到的瀑布流块
        for (var i = 0, len = _this.pinterestData.length; i < len; i++) {
            (function (i) {
                curClassDom = CT.$("hands_x0_y0_waterContent" + i + "_");
                curClassDom.style.display = "block";
                curClassDomInfo = CT.getCurClassObjInfo(curClassDom);
                var waterImg = CT.$("waterContent" + i + 'Img');
                if ((curRowLeft + curClassDomInfo.width) < 1280) {
                    curClassDom.style.left = curRowLeft + "px"; //最左边
                    curClassDom.style.top = curRowTop + "px"; //最top
                    var diffVal = _this.defaultStartValue;
                    if (waterImg.style.width == CT.$('waterContent' + i).style.width) {
                        diffVal = 0;
                    }
                    waterImg.style.left = curRowLeft + diffVal + "px"; //最左边
                    waterImg.style.top = curRowTop + diffVal + "px"; //最top
                    _this.comPareArray[_this.comPareArrayIndex] = {
                        h: curRowTop + curClassDomInfo.height, //当前元素的 top + height 高度
                        left: curRowLeft, //当前元素的 left + width 宽度
                        width: curClassDomInfo.width,
                        domIndex: i, //当前元素当前在dom中的下标
                        curRowTop: curRowTop, //当前元素 top 值
                        curIndex: _this.comPareArrayIndex, //在当前数组下标
                    }
                    curRowLeft += curClassDomInfo.width;
                    _this.comPareArrayIndex++;
                } else {
                    //寻找最小
                    var isAllEquallResult = _this.isAllEquall(_this.comPareArray);
                    if (isAllEquallResult.result) {
                        curRowLeft = _this.defaultLeft;
                        curRowTop = parseInt(isAllEquallResult.averageNum) + 1;
                        _this.comPareArray = [];
                        _this.comPareArrayIndex = 0;
                        //归零之后 加一
                        curClassDom.style.left = curRowLeft + "px"; //最左边
                        curClassDom.style.top = curRowTop + "px"; //最top
                        var diffVal = _this.defaultStartValue;
                        if (waterImg.style.width == CT.$('waterContent' + i).style.width) {
                            diffVal = 0;
                        }
                        waterImg.style.left = curRowLeft + diffVal + "px"; //最左边
                        waterImg.style.top = curRowTop + diffVal + "px"; //最top
                        _this.comPareArray[_this.comPareArrayIndex] = {
                            h: curRowTop + curClassDomInfo.height,
                            left: curRowLeft,
                            width: curClassDomInfo.width,
                            domIndex: i,
                            curRowTop: curRowTop,
                            curIndex: _this.comPareArrayIndex,
                        }
                        _this.comPareArrayIndex++;
                    } else {
                        var getMinHObj = _this.getMinHeightKey(_this.comPareArray);
                        curRowTop = getMinHObj.h + curClassDomInfo.height;
                        curClassDom.style.left = getMinHObj.left + "px";
                        curClassDom.style.top = getMinHObj.h + "px";
                        waterImg.style.left = getMinHObj.left + 6 + "px"; //最左边
                        waterImg.style.top = getMinHObj.h + 6 + "px"; //最top
                        if ((curClassDomInfo.width + 10) >= getMinHObj.width) {
                            curRowTop = _this.comPareArray[getMinHObj.curIndex].h + curClassDomInfo.height;
                            _this.comPareArray[getMinHObj.curIndex].h = getMinHObj.h + curClassDomInfo.height;
                        } else {
                            _this.comPareArray[getMinHObj.curIndex].left = getMinHObj.left + curClassDomInfo.width;
                        }
                        _this.comPareArray[_this.comPareArrayIndex] = {
                            h: curRowTop,
                            left: curRowLeft + curClassDomInfo.width,
                            width: curClassDomInfo.width,
                            domIndex: i,
                            curRowTop: curRowTop,
                            curIndex: _this.comPareArrayIndex,
                        }
                        _this.comPareArrayIndex++;
                    }
                    curRowLeft += curClassDomInfo.width;
                }
                if (i == len - 1) {
                    _this.parentBoxHeight = CT.getDomInfo(curClassDom, 'top') + curClassDomInfo.height;
                }
                CT.isBooleanUp(commonPageInfo.recommend_5[i].booleanUp, "hands_x0_y0_waterContent" + i + "_");
            })(i)
        }
        callback && callback()
    },
    /**
     *  真正切换小视频播放
     */
    changeSmallVideoToDo: function (i) {
        var _this = this;
        var mainDom = CT.$("main");
        _this.nowSmallVideoIndex = i;
        //改变小视频框绑定数据
        PAGE.getModelByFocusId("hands_x0_y0_mainVideo_").TempData = PAGE.getModelByFocusId("hands_x0_y0_mainVideoList" + i + "_").TempData;
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
        if (PAGE.getModelByFocusId("hands_x0_y0_mainVideo_").TempData.recommendDisplayName) {
            var showTitle = " " + PAGE.getModelByFocusId("hands_x0_y0_mainVideo_").TempData.recommendDisplayName;
        } else {
            var showTitle = CT.$('videoListText' + i).innerHTML;
        }
        CT.$("videoListText" + i).innerHTML = CT.setMarquee(showTitle, 14, 6);
        if (mainDom && mainDom.style.top && mainDom.style.top.substring(0, mainDom.style.top.length - 2) == '0') {
            //当前展示第一屏
            _this.playSmallVideo();
            _this.nowSmallVideoIndex++;
            if (_this.nowSmallVideoIndex >= _this.recommendSmallVideoArr.length) {
                _this.nowSmallVideoIndex = 0;
            }
        } else {
            //停止小视频播放
            videoPlayer.exitPage();
        }
        ;

    },

    /**
     *  下视频列表按钮获焦事件
     *  重置当前小视频播放计时器
     */
    changeSmallVideo: function (i) {
        var _this = this;
        if (videoPlayer.changeMainPagePlay) {
            _this.changeSmallVideoToDo(i);
        } else {
            // 清除轮播播放小视频延时器
            clearInterval(videoPlayer.timer);
            videoPlayer.timer = null;
            _this.changeSmallVideoToDo(i);
            videoPlayer.timer = setInterval(function () {
                //停止小视频播放
                _this.changeSmallVideoToDo(_this.nowSmallVideoIndex);
            }, 30000);
        }
    },
    /**
     *  播放小视频
     */
    playSmallVideo: function () {
        var _this = this;
        if (CT.$("main").style.top.split('px')[0] != '0') {
            //不是在第一屏
            return;
        }
        _this.CurCartoonId = _this.recommendSmallVideoArr[_this.nowSmallVideoIndex].recommendDisplayValue;
        //看当前小视频所属卡通列表数据是否存在
        if (_this['smallVideoListInfo' + _this.CurCartoonId]) {
            //改变标记视频播放状态
            _this.isOnPlay = true;
            videoPlayer.alreadyPlayNum++;
            try {
                var playParams = {
                    top: _this.playObj.t,
                    left: _this.playObj.l,
                    height: _this.playObj.h,
                    width: _this.playObj.w,
                    nns_ids: _this['smallVideoListInfo' + _this.CurCartoonId].data[0].movieDetails[0].playUrl, //合集媒资
                    videoIndex: 0,//当前集数下标
                    //上传小视频播放日志所用信息
                    // smallVideoInfo: _this['smallVideoListInfo' + _this.CurCartoonId].data[0],
                    restartSwitch: false
                };
                // alert('*****已有视频列表信息缓存， play 获取播放串入参：' + CT.jsonToString(playParams))
                // interface.loggerInfo("*****已有视频列表信息缓存， play 获取播放串入参：" + CT.jsonToString(playParams), 'post')
                videoPlayer.SmallPlay(playParams);
                // 快进
                videoPlayer.seekPlay(1);
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
                videoPlayer.alreadyPlayNum++;
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
                        // smallVideoInfo: res.data[0],
                        restartSwitch: false
                    };
                    // alert('*****获取视频列表信息成功，小视频播放入参：' + CT.jsonToString(playParams))
                    // interface.loggerInfo('*****获取视频列表信息成功，小视频播放入参：' + CT.jsonToString(playParams), 'post')
                    videoPlayer.SmallPlay(playParams);
                } catch (e) {
                    console.log("playFAIL: " + CT.jsonToString(e))
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
        // if (CT.dataType(num) != 'object' && _this.moer1DataJson[num] && _this.moer1DataJson[num].toTop == 'true') { //返回到顶部
        if (num == _this.pinterestData.length - 1) {
            CT.$("main").style.top = "0px";
            PAGE.changeFocus(_this.defaultFocus);
        } else {
            //已下线产品没有跳转
            if ((type.indexOf("bottom") > -1) && _this.pinterestData[num].booleanUp == 0) {
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
                    CT.toAnterRecommendUrl(commonPageInfo, "recommend_5", num);
                }
            } else {
                if (type == 'firstScreenSmallVideo') {
                    if (!curFocus.TempData) {
                        curFocus.TempData = PAGE.getModelByFocusId("hands_x0_y0_mainVideoList" + _this.nowSmallVideoIndex + "_").TempData;
                    }
                }
                var more1 = curFocus.TempData.more1;
                if (more1 && more1 === "order") {
                    if (orderJs.orderResultString) {
                        CT.toAnterRecommendUrl(curFocus.TempData);
                    } else {
                        orderJs.toOrderPage();
                    }
                } else {
                    CT.toAnterRecommendUrl(curFocus.TempData);
                }

            }
        }
    }
};
// page.init();

//重定义顶部按钮向下事件 参数：keyDirection{触发方向}, keyInfo{生成当前按钮的初始化对象，就是上面的“navInfo”或者默认的配置}, keyIndex{"当前nav按钮Id"}
topNavObj.navBtnArrowEvent = function (keyDirection, keyInfo, keyIndex) {
    var _this = topNavObj;
    var curKeyDateArr = topNavObj.navArr || [];
    //以下代码根据自己页面实际需求，可在自己页面重写
    switch (keyDirection) {
        case 'left':
            //导航栏按钮向左事件
            if (keyIndex > 0) {
                PAGE.changeFocus('hands_x0_y0_' + keyInfo.name + "Focus" + (keyIndex - 1) + '_');
            }
            break;
        case 'right':
            //导航栏按钮向右事件
            if (keyIndex == curKeyDateArr.length - 1) {
                //向右无响应
            } else {
                PAGE.changeFocus("hands_x0_y0_" + keyInfo.name + "Focus" + (keyIndex + 1) + "_");
            }
            break;
        case 'up':
            //导航栏按钮向上事件
            PAGE.changeFocus("hands_x0_y0_orderRecImg_");
            break;
        case 'down':
            if (keyIndex < 2) {
                PAGE.changeFocus('hands_x0_y0_mainContent0_');
            } else {
                if (page.isLimitSTB) {
                    PAGE.changeFocus('hands_x0_y0_videoAreaDom_');
                } else {
                    PAGE.changeFocus('hands_x0_y0_mainVideo_');
                }
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
    if (CT.$('xhbAlertDiv') && CT.$('xhbAlertDiv').style.visibility == 'visible') {
        //隐藏小海贝弹框
        PAGE.changeFocus("hands_x0_y0_xhbFocus_");
        return;
    }
    if (CT.$('themeListAlert') && CT.$('themeListAlert').style.visibility == 'visible') {
        //隐藏主题弹框
        mainNavObj.hideThemeList();
        return;
    }
    if (CT.$('oldUserOrderTip') && CT.$('oldUserOrderTip').style.visibility == 'visible') {
        if (!PAGE.getModelByFocusId('hands_x0_y0_mainContent0_')) {
            page.trueInit();
        }
        //<!--进入过平台的用户一天提示一次的订购弹框-->
        var changeFocus = 'hands_x0_y0_mainVideo_';
        if (page.isLimitSTB) {
            changeFocus = 'hands_x0_y0_videoAreaDom_';
        }
        PAGE.changeFocus(changeFocus);
        CT.$('oldUserOrderTip').style.display = 'none';
        return;
    }
    if(CT.$("dialogWindow") && CT.$("dialogWindow").style.visibility == "visible"){
        CT.$("dialogWindow").style.visibility = "hidden";
        CT.$("dialogBtn1").style.visibility = "hidden";
        CT.$("dialogBtn2").style.visibility = "hidden";
        // 初始化小视频
        page.videoHidden(0);
        if(curFocus.lastFocusId && curFocus.FocusID != curFocus.lastFocusId){
            // PAGE.changeFocus(curFocus.lastFocusId);
            PAGE.changeFocus(page.defaultFocus);
        }
        return;
    }
    //推出拦截页
    if (commonPageInfo && commonPageInfo.recommend_8 && commonPageInfo.recommend_8[0]) {
        CT.toAnterRecommendUrl(commonPageInfo.recommend_8[0]);
    } else {
        CT.commonJumpUrl(AjaxConfig.projectUrl + "commPage?contentId=174&isback=1");
    }
}

var CHANGEMUN = "";
var backmain = escape(window.location.href);
var changeNumObj = {
    changeNum: function (num) {
        CHANGEMUN = CHANGEMUN + num + '';
        xjDataLog.writeInfo("地址>>>>>>>>>>>CHANGEMUN=" + CHANGEMUN)
        var acPramas = xjDataLog.getStbId() + '&user_id=' + xjDataLog.getUserId() + '&area_code=' + xjDataLog.getCityCode();
        if (CHANGEMUN == "78920") { //测试网地址
            window.location.href = 'http://10.2.127.59:27080/iptv-web/HD/index.html?device_id=' + acPramas;
        } else if (CHANGEMUN == "78921") { // 现网57
            window.location.href = 'http://10.2.127.57:28080/iptv-web/HD/index.html?device_id=' + acPramas;
        } else if (CHANGEMUN == "78925") { // 订购页家长版
            CT.getAnterByIdOrAction({ contentName: 'yjdgyjzb20200811' });
        } else if (CHANGEMUN == "78926") { // 扫码支付页
            CT.getAnterByIdOrAction({ contentName: 'smzfy20200811' });
        } else if (CHANGEMUN == "78927") { // 订购成功页
            orderJs.toOrderSucPage();
        } else if (CHANGEMUN == "78928") { // 多计费页面
            CT.getAnterByIdOrAction({ contentId:235})
        }
        if (CHANGEMUN.length >= 5) {
            CHANGEMUN = "";
        }
    }
};


// 接收播放器消息响应函数，可在用到的页面根据需求重写。
playStatusAcceptObj.normalPlayEnd = function(){
    if (videoPlayer.changeMainPagePlay) {
        // 切换小视频
        page.changeSmallVideoToDo(page.nowSmallVideoIndex);
    }
}
